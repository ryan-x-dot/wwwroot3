<?php
/**
 * 投注留证推送守护进程（纯 PHP CLI，零依赖）
 *
 * 启动（二选一）：
 *   1) 推荐：运行 bat/betmail.bat（已在 bat.txt 登记，由 BAT.exe 统一托管/自动重启）
 *   2) 手动：cd wwwroot/bdata 后执行  php betmail.php start
 * 单轮测试（处理完当前队列即退出，不常驻）：
 *      cd wwwroot/bdata 后执行  php betmail.php once
 *
 * 职责（每 loop_interval 秒一轮）：
 *   1. 读取 db_client.bet_mail_queue 中 status=0 且到达重试时间的记录
 *   2. 金额 >= 配置阈值 -> HTTPS 推送到留证服务器（fastadmin 接收接口）；
 *      低于阈值 -> 标记 status=3 跳过（记录保留，可 SQL 补发）
 *   3. 推送成功回写 status=1；失败按退避重试，超过 retry_max 记 status=2（死信，可 SQL 重发）
 *
 * 配置：include/betmail.local.php（阈值/留证服务器地址/密钥，保存即生效，无需重启本进程）
 * 性能与安全：本进程与投注链路完全隔离（投注事务内只写本地队列表，一次毫秒级 INSERT，
 *           异常在 BetMail 内部自吞）；本进程任何故障只影响推送延迟，不影响投注/结算/采集。
 */

if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
set_time_limit(0);

include_once __DIR__ . '/include/config.php'; // 公共配置（含 $db_c、$db_s 初始化）
require_once __DIR__ . '/include/AuditPusher.php';

$RUN_MODE = isset($argv[1]) ? strtolower((string)$argv[1]) : 'start'; // start=常驻 / once=单轮

// ---------------------------------------------------------------------
// 配置读取
// ---------------------------------------------------------------------

/**
 * 读取本地配置（每轮重新读取一次 -> 修改配置无需重启守护进程）
 * @return array|null
 */
function load_cfg()
{
    static $cache = null;

    $file = __DIR__ . '/include/betmail.local.php';
    $cfg  = is_file($file) ? include $file : null;
    if (!is_array($cfg) || !$cfg) {
        return $cache; // 文件暂时读不到时沿用上一次配置
    }

    $cache = $cfg + [
        'min_golds'     => 500,           // 推送阈值：下注金额 >= 该值才推送
        'channels'      => [],            // 推送通道（audit）
        'timezone'      => 'Etc/GMT+4',
        'retry_max'     => 8,             // 单条最大重试次数
        'loop_interval' => 10,            // 无积压时轮询间隔（秒）
        'cleanup_days'  => 30,            // 已处理记录保留天数（0=不清理）
    ];

    return $cache;
}

/**
 * 取 audit 通道配置（未配置返回 null）
 * @return array|null
 */
function audit_cfg(array $cfg)
{
    return isset($cfg['channels']['audit']) && is_array($cfg['channels']['audit'])
        ? $cfg['channels']['audit'] + ['connect_timeout' => 3, 'timeout' => 10]
        : null;
}

/**
 * 取公共配置创建的数据库对象（$db_c：db_client 业务库连接，由 common/include/mysql.php 初始化）
 * @return object DB 实例
 */
function require_db()
{
    $db = isset($GLOBALS['db_c']) ? $GLOBALS['db_c'] : null;
    if (!$db) {
        fwrite(STDERR, "[betmail] 数据库连接未初始化，请检查 common/include/mysql.local.php\n");
        exit(1);
    }
    return $db;
}

// ---------------------------------------------------------------------
// 入口
// ---------------------------------------------------------------------

if ($RUN_MODE === 'once') {
    $cfg = load_cfg();
    if (!$cfg) {
        fwrite(STDERR, "[betmail] 缺少配置文件 include/betmail.local.php\n");
        exit(1);
    }
    date_default_timezone_set($cfg['timezone'] ?: 'Etc/GMT+4');

    $audit = audit_cfg($cfg);
    if (!$audit) {
        fwrite(STDERR, "[betmail] 配置未完成：缺少 channels.audit（url/secret）\n");
        exit(1);
    }

    // 单轮测试可用第二参数临时覆盖推送地址（不改配置文件），例如：
    //   php betmail.php once http://127.0.0.1:8300/index.php?s=/api/betpush/receive
    if (isset($argv[2]) && $argv[2] !== '') {
        $audit['url'] = $argv[2];
        $cfg['channels']['audit'] = $audit;
        fwrite(STDOUT, "[betmail] once 模式：临时覆盖推送地址 -> {$argv[2]}\n");
    }

    $db   = require_db();
    $lock = $db->select("SELECT GET_LOCK('bet_mail_sender',0) AS `l`", 'Row');
    if (!$lock || (int)$lock['l'] !== 1) {
        fwrite(STDERR, "[betmail] 守护进程正在运行（或锁被占用），如需单轮测试请先停止守护进程\n");
        exit(2);
    }

    $sent = process_rows($db, $cfg);
    echo "[betmail] once 模式完成，本轮推送 {$sent} 条\n";
    exit(0);
}

run_daemon(require_db());

// ---------------------------------------------------------------------
// 守护主循环
// ---------------------------------------------------------------------

/**
 * @param object $db  DB 实例（db_client）
 */
function run_daemon($db)
{
    // 单实例互斥：借用 MySQL 命名锁，进程退出/连接断开自动释放
    $waited = false;
    while (true) {
        try {
            $row = $db->select("SELECT GET_LOCK('bet_mail_sender',0) AS `l`", 'Row');
            if ($row && (int)$row['l'] === 1) {
                break;
            }
            if (!$waited) {
                mlog('已有实例在运行，等待中...');
                $waited = true;
            }
        } catch (Throwable $e) {
            mlog('数据库连接异常: ' . $e->getMessage() . '（30秒后重试）');
        }
        sleep(30);
    }

    mlog('守护进程启动 pid=' . getmypid());
    fwrite(STDOUT, "[betmail] start pid=" . getmypid() . "\n");

    $lastMin   = null;
    $lastPurge = 0;
    $errStreak = 0;

    while (true) {
        $cfg = load_cfg();
        if (!$cfg) {
            mlog('配置文件丢失，60秒后重试');
            sleep(60);
            continue;
        }
        date_default_timezone_set($cfg['timezone'] ?: 'Etc/GMT+4');

        if ($lastMin !== null && (float)$cfg['min_golds'] !== (float)$lastMin) {
            mlog('阈值变更: ' . $lastMin . ' -> ' . $cfg['min_golds']);
        }
        $lastMin = $cfg['min_golds'];

        if (!audit_cfg($cfg)) {
            mlog('配置未完成（channels.audit url/secret），60秒后重试');
            sleep(60);
            continue;
        }

        // 每小时清理一次已处理的历史记录（默认保留 30 天，可配置）
        if (time() - $lastPurge >= 3600) {
            $lastPurge = time();
            try {
                purge_old($db, $cfg);
            } catch (Throwable $e) {
                mlog('清理历史记录失败: ' . $e->getMessage());
            }
        }

        try {
            $sent      = process_rows($db, $cfg);
            $errStreak = 0;
            if ($sent > 0) {
                usleep(300000); // 有积压：短暂停顿后立即处理下一批
            } else {
                sleep(max(2, (int)$cfg['loop_interval']));
            }
        } catch (Throwable $e) {
            $errStreak++;
            mlog('处理异常(' . $errStreak . '): ' . $e->getMessage());
            if ($errStreak >= 10) {
                mlog('连续异常达到 10 次，退出进程交由调度器重启');
                exit(1);
            }
            sleep(5);
        }
    }
}

// ---------------------------------------------------------------------
// 队列处理
// ---------------------------------------------------------------------

/**
 * 处理一轮待推送队列
 * @return int 本轮成功推送的条数
 */
function process_rows($db, array $cfg)
{
    $rows = $db->select(
        "SELECT `id`,`ticket_id`,`m_name`,`bet_golds`,`bet_time`,`payload`,`row_hash`,`retry`"
        . " FROM `db_client`.`bet_mail_queue`"
        . " WHERE `status`=0 AND `next_try`<=" . time()
        . " ORDER BY `id` ASC LIMIT 100"
    );
    if (!$rows) {
        return 0;
    }

    $audit  = audit_cfg($cfg);
    $pusher = new AuditPusher($audit);

    $sent = 0;
    foreach ($rows as $row) {
        // 阈值判断：低于阈值直接跳过（记录保留，日后可 SQL 补发）
        if ((float)$row['bet_golds'] < (float)$cfg['min_golds']) {
            upd_row($db, $row['id'], ['status' => 3]);
            continue;
        }

        try {
            $res = $pusher->pushRow($row);

            upd_row($db, $row['id'], [
                'status'    => 1,
                'send_time' => time(),
                'err_msg'   => null,
            ]);
            mlog('已推送 ticket=' . $row['ticket_id'] . ' 金额=' . $row['bet_golds']
                . ' 会员=' . $row['m_name']
                . (isset($res['dup']) && $res['dup'] ? ' (幂等去重)' : ''));
            $sent++;
        } catch (AuditPusherException $e) {
            if ($e->stage === 'connect') {
                // 网络层不可达（DNS/超时/网关错误）：本轮终止，60秒后重试，
                // 不消耗该记录的重试次数（避免误判为死信）
                upd_row($db, $row['id'], [
                    'next_try' => time() + 60,
                    'err_msg'  => substr($e->getMessage(), 0, 250),
                ]);
                mlog('留证服务器不可达: ' . $e->getMessage());
                return $sent;
            }
            // 服务端拒绝或本地组装失败：单条退避重试，不影响其他记录
            fail_row($db, $row, $cfg, 'audit:' . $e->getMessage());
        } catch (Throwable $e) {
            fail_row($db, $row, $cfg, 'audit:' . $e->getMessage());
        }
    }

    return $sent;
}

/**
 * 单条推送失败：按退避重试，超过上限标记为"死信"
 */
function fail_row($db, array $row, array $cfg, $msg)
{
    $msg   = trim(preg_replace('/\s+/', ' ', (string)$msg));
    $retry = (int)$row['retry'] + 1;

    if ($retry >= (int)$cfg['retry_max']) {
        upd_row($db, $row['id'], [
            'status'  => 2,
            'retry'   => $retry,
            'err_msg' => substr($msg, 0, 250),
        ]);
        mlog('放弃推送 ticket=' . $row['ticket_id'] . ' 原因=' . $msg);
        return;
    }

    $backoff = [10, 30, 60, 180, 300]; // 秒
    $delay   = $backoff[min($retry - 1, count($backoff) - 1)];
    upd_row($db, $row['id'], [
        'retry'    => $retry,
        'next_try' => time() + $delay,
        'err_msg'  => substr($msg, 0, 250),
    ]);
    mlog('推送失败将重试(' . $retry . '/' . $cfg['retry_max'] . ') ticket=' . $row['ticket_id'] . ' 原因=' . $msg);
}

/**
 * 更新一条队列记录（参数化，白名单字段由调用方控制）
 */
function upd_row($db, $id, array $set)
{
    $fields = [];
    $params = [];
    foreach ($set as $k => $v) {
        $fields[] = '`' . $k . '`=?';
        $params[] = $v;
    }
    $params[] = (int)$id;
    $db->execSqlNew(
        'UPDATE `db_client`.`bet_mail_queue` SET ' . implode(',', $fields) . ' WHERE `id`=?',
        $params
    );
}

/**
 * 清理已处理的历史队列记录（status: 1已推送 / 2死信 / 3跳过）
 */
function purge_old($db, array $cfg)
{
    $days = (int)(isset($cfg['cleanup_days']) ? $cfg['cleanup_days'] : 30);
    if ($days <= 0) {
        return;
    }
    $n = $db->execSqlNew(
        "DELETE FROM `db_client`.`bet_mail_queue` WHERE `status` IN (1,2,3) AND `create_time` < ? LIMIT 5000",
        [time() - $days * 86400]
    );
    if ($n > 0) {
        mlog('清理历史队列记录 ' . $n . ' 条（' . $days . ' 天前）');
    }
}

// ---------------------------------------------------------------------
// 日志
// ---------------------------------------------------------------------

function mlog($msg)
{
    $line = '[' . date('Y-m-d H:i:s') . '] ' . $msg . "\n";
    $file = __DIR__ . '/betmail_run.log';

    // 简单轮转：超过 10MB 时归档为 .1
    if (is_file($file) && filesize($file) > 10 * 1024 * 1024) {
        @rename($file, $file . '.1');
    }
    @file_put_contents($file, $line, FILE_APPEND);
    fwrite(STDOUT, '[betmail] ' . $msg . "\n");
}
