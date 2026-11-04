<?php
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
/**
 * 自动开号脚本
 * 功能：读取cfg_default表配置，自动在上游平台创建会员账号
 * 运行方式：后台常驻进程 php autoreg.php
 */
header('Content-type: text/html;charset=utf-8');
set_time_limit(0);
include_once "include/config.php";

$title = "自动开号";
$defaultInterval = 5; // 默认间隔秒数
$defaultPass = 'Aa11223344';   // 注册时初始密码（10位）
$defaultPassNew = 'Aa1122334455'; // 二次处理后的最终密码（12位）
$characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
$letters = 'abcdefghijklmnopqrstuvwxyz';

print_r("=== 自动开号脚本启动 ===\n");

do {
    try {
        // 1. 读取自动开号配置
        $cfgTable = Constant::T_CONFIG_DEFAULT;
        $cfg = $db_c->select("SELECT `auto_reg_num`,`auto_reg_interval`,`auto_reg_enabled` FROM {$cfgTable} LIMIT 1", "Row");

        if (!$cfg || $cfg['auto_reg_enabled'] != 1) {
            print_r(date('H:i:s') . " 自动开号未启用，等待30秒后重新检查...\n");
            sleep(30);
            continue;
        }

        $regNum = intval($cfg['auto_reg_num']);
        $interval = intval($cfg['auto_reg_interval']);
        if ($regNum < 1) $regNum = 1;
        if ($interval < 5) $interval = $defaultInterval;

        // 2. 获取赛果采集账号(aguid表)用于开号
        $agTable = Constant::T_AGUID;
        $agAcc = $db_s->select("SELECT * FROM {$agTable} WHERE `status`=1 LIMIT 1", "Row");
        if (!$agAcc) {
            $agAcc = $db_s->select("SELECT * FROM {$agTable} LIMIT 1", "Row");
        }

        if (!$agAcc) {
            print_r(date('H:i:s') . " 未找到赛果采集账号，等待60秒...\n");
            sleep(60);
            continue;
        }

        // 3. 初始化TransformAG
        $tf = new TransformAG($agAcc['url'], "zh-cn", isset($agAcc['ver']) ? $agAcc['ver'] : "");
        $tf->setDefaultWeb($agAcc);

        // 4. 获取当前会员列表和代理设置
        $users = $tf->get_acc_mem_list();
        if (!$users || !isset($users['up_id'])) {
            print_r(date('H:i:s') . " 获取会员列表失败，可能UID失效，等待{$interval}秒...\n");
            $tf->close();
            sleep($interval);
            continue;
        }

        $up_id = $users['up_id'];
        $memCount = isset($users['account']) ? count($users['account']) : 0;
        print_r(date('H:i:s') . " 当前会员数量: {$memCount}, 准备开号: {$regNum}个\n");

        // 5. 获取代理设置(用于生成用户名前缀)
        $setting = $tf->get_my_setting();
        $upnamePrefix = 'c';
        if ($setting && isset($setting['data']['username'])) {
            $upnamePrefix = 'c' . substr($setting['data']['username'], 0, 3);
        }

        // 6. 批量创建会员
        $successCount = 0;
        $failCount = 0;

        for ($i = 0; $i < $regNum; $i++) {
            // 生成随机用户名
            $sname = '';
            for ($j = 0; $j < 6; $j++) {
                $sname .= $characters[rand(0, strlen($characters) - 1)];
            }
            $username = $upnamePrefix . $sname;

            // 调用API创建会员
            $result = $tf->body_members_add($username, $sname, $defaultPass, $up_id);

            if (strpos($result, "uccess") !== false) {
                $successCount++;
                print_r(date('H:i:s') . " 成功创建账号: {$username}\n");

                // === 二次处理：登录新账号 → 改安全登录账号 → 改最终密码 ===
                sleep(1);
                $loginRs = $tf->mem_login($username, $defaultPass);
                $newUid = isset($loginRs['uid']) ? $loginRs['uid'] : '';
                if (!empty($newUid)) {
                    // 生成随机安全登录账号：6字母 + 3位数字
                    $chkName = '';
                    for ($k = 0; $k < 6; $k++) {
                        $chkName .= $letters[rand(0, strlen($letters) - 1)];
                    }
                    $chkName .= rand(111, 999);

                    $rs1 = $tf->mem_chg_passwd_safe($username, $chkName, $newUid);
                    if ($rs1 !== false && strpos($rs1, "已成功修改登录帐号") !== false) {
                        print_r(date('H:i:s') . "   - 已修改安全登录账号: {$chkName}\n");

                        $rs2 = $tf->mem_chg_newpwd($username, $defaultPassNew, $newUid);
                        if ($rs2 !== false && (strpos($rs2, "Success") !== false || strpos($rs2, "uccess") !== false)) {
                            print_r(date('H:i:s') . "   - 已修改最终密码: {$defaultPassNew}\n");
                        } else {
                            print_r(date('H:i:s') . "   - 修改最终密码失败: " . mb_substr((string)$rs2, 0, 80) . "\n");
                        }
                    } else {
                        print_r(date('H:i:s') . "   - 修改安全登录账号失败: " . mb_substr((string)$rs1, 0, 80) . "\n");
                    }
                } else {
                    print_r(date('H:i:s') . "   - 登录新账号失败，跳过二次处理: " . (isset($loginRs['msg']) ? $loginRs['msg'] : '') . "\n");
                }
            } else {
                $failCount++;
                print_r(date('H:i:s') . " 创建账号 {$username} 失败: " . mb_substr($result, 0, 100) . "\n");
            }

            // 每个账号之间等待1秒，避免请求过快
            if ($i < $regNum - 1) {
                sleep(1);
            }
        }

        $tf->close();
        print_r(date('H:i:s') . " 本轮开号完成: 成功{$successCount}个, 失败{$failCount}个\n");

        // 本轮开号完成后自动关闭自动开号开关（需要手动到后台重新开启才会进入下一轮）
        $db_c->update($cfgTable, ["auto_reg_enabled" => 0], "1=1");
        print_r(date('H:i:s') . " 已自动关闭自动开号开关，等待后台手动重新开启...\n");
        sleep($interval);

    } catch (Exception $ex) {
        print_r(date('H:i:s') . " 异常: " . $ex->getMessage() . "\n");
        sleep(10);
    }
} while (true);
?>
