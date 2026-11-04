<?php
/**
 * ============================================================================
 *  updanger.php —— 滚球"进球即取消"守护进程【重写版 · 已部署 bdata/ · DRY_RUN 空跑中】
 * ============================================================================
 *  编写: 2026-11-01   状态: 已部署工程(bdata/updanger.php); 4 项假设经 probe.php 只读实测验证/修正(见文末);
 *                        once 单轮自测通过(处理=0 无异常); 待用户重启常驻 updanger 进程后生效(我不重启进程).
 *
 *  【为什么重写】旧版三处硬伤(本机实测):
 *   1) L77 调用 httpGet() —— 全项目 0 定义(新项目已废弃, 改用 Curl_HTTP_Client)
 *   2) global $webdb —— config 链从未初始化(=NULL), 拼出的 URL 无效
 *   3) concat(score_h,':',score_c) —— foot_match.score_h/score_c 全表 NULL(比分实在 inball_h/inball_c)
 *   旧版靠"抢跑导致查空"而空转不崩; 一旦不空转, 执行到 httpGet 即 fatal 崩溃.
 *
 *  【本版改动】
 *   - 比分源: 改用 Transform::getUserCurl(2)+get_game_more() 实时拉上游(替代死掉的 httpGet/$webdb)
 *   - 基准比分: 用 bets.score(下注瞬间上游比分); 为空则"只确认不取消"(防误杀)
 *   - 窗口: 下注后 CHECK_AFTER(20s) 才判定; 超 MAX_AGE(300s) 兜底确认(对齐原设计 t20/t300)
 *   - 终态一律置 dg='N', 防 Bet.php L3263 兜底把 danger=2 覆盖回 3
 *   - 取消状态 status=16(进球取消), 非 12
 *   - 退款+改单同一事务; 先置取消态再退款(幂等, 防崩溃重复退款); 全程写审计日志
 *   - 取分失败 → 不动该单(保持 danger=1 下轮再试), 绝不因失败而取消/退款
 *   - catch(\Throwable) 防未捕获 Error 崩进程; while(true) 替代递归防栈溢出
 *   - 方向未定时"两口径都不等才取消"(保守, 减少误杀)
 *
 *  ★ 上线前 4 项假设 —— 2026-11-01 probe.php 只读实测结论(详见 DESIGN_REVIEW.md 第 6 节):
 *    A.【实测修正】XML 根为 <serverresponse>; <code>617</code>=有效数据(非错误!), 全场比分在顶层
 *       <FTscoreH>/<FTscoreC>(前端亦优先用之), 而非 <game> 节点列表; <code>error</code>/doubleLogin=失败态.
 *       fetch_live_score() 已据此改为 code===617 + FTscoreH/FTscoreC(旧 <game> 遍历会永远取空→机制失效).
 *    B.【实测通过】近24h bets.score 12/12 为 "h:c" 格式, 0 空值; 方向用"两口径都不等才取消"规避.
 *    C.【实测通过】mem 退款键 nid/pay_type/credit/balance_credit/hidden 字段全部存在.
 *    D.【实测通过】getUserCurl(2) 返回 code=10000; 3 场取分与 foot_match inball 一致(1:5/6:4 准确).
 * ============================================================================
 */
if (php_sapi_name() !== 'cli') { http_response_code(403); exit('Forbidden'); }
header("Content-Type: text/html; charset=utf-8");
ini_set("display_errors", "On");
set_time_limit(0);
include_once 'include/config.php';

// ===================== 可调参数(对齐原设计 20~35s) =====================
$UPDANGER_DRY_RUN     = true;  // ★★ 9:00 先 true 空跑观察日志, 确认无误后改 false 实弹 ★★
$UPDANGER_CHECK_AFTER = 20;    // 下注后多少秒才开始判定(原 t20)
$UPDANGER_MAX_AGE     = 300;   // 超过多少秒仍未判定则兜底确认(原 t300), 保证结算不卡单
$UPDANGER_POLL        = 8;     // 轮询周期秒(原 35; 收紧以保证 20s 判定及时)
$UPDANGER_CTYPE       = 2;     // 上游账号池: 2=后端采集池 s_curl(取分失败可试 1)
$UPDANGER_LOG         = __DIR__ . '/updanger_run.log';

function upd_log($msg) {
    global $UPDANGER_LOG;
    if (@filesize($UPDANGER_LOG) > 10 * 1024 * 1024) { @rename($UPDANGER_LOG, $UPDANGER_LOG . '.1'); }
    @file_put_contents($UPDANGER_LOG, date('Y-m-d H:i:s') . ' ' . $msg . "\n", FILE_APPEND);
}

/**
 * 取某场比赛的实时上游比分, 返回 "h:c" 或 null(失败/无数据)
 */
function fetch_live_score($gid, $lid, $ecid, $gtype, $t) {
    try {
        $xml = $t->get_game_more([
            'lid'      => $lid,
            'ecid'     => $ecid,
            'gtype'    => $gtype,
            'isRB'     => 'N',
            'showtype' => 'today',
        ]);
        if (empty($xml)) { return null; }
        $datacn = @simplexml_load_string($xml);
        if (!$datacn) { return null; }
        // 会员端 game_more 权威解析(实测 2026-11-01 修正): code=617 才是有效比赛数据,
        // 全场比分在顶层 <FTscoreH>/<FTscoreC>(前端亦优先用之), 而非遍历 <game> 节点.
        // code=error(doubleLogin 等)/其它 => 取分失败返回 null, 下轮重试, 绝不误判取消.
        if ((string)$datacn->code !== '617') { return null; }
        $sh = (string)$datacn->FTscoreH;
        $sc = (string)$datacn->FTscoreC;
        if ($sh === '' || $sc === '') { return null; }
        return $sh . ':' . $sc;
    } catch (\Throwable $e) {
        upd_log('fetch_live_score ERROR gid=' . $gid . ' ' . $e->getMessage());
    }
    return null;
}

/**
 * 确认有效(danger=3, dg=N) → 交 result.php 正常结算
 */
function confirm_bet($id, $dry) {
    global $db_c;
    if ($dry) { upd_log('[DRY] WOULD CONFIRM id=' . $id . ' -> danger=3,dg=N'); return; }
    $sql = 'UPDATE ' . Constant::T_BET . ' SET `danger`=3,`dg`="N"
            WHERE `ID`=' . $id . ' AND `danger`=1 AND `cancel`!=1';
    $db_c->execSql($sql);
}

/**
 * 进球取消 + 退款(事务 + 审计 + 幂等)
 */
function cancel_bet($r, $baseScore, $liveScore, $dry) {
    global $db_c;
    $id  = (int)$r['ID'];
    $refund = ($r['pay_type'] == 1 && $r['hidden'] != 1) ? (float)$r['bet_golds'] : 0;
    if ($dry) {
        upd_log('[DRY] WOULD CANCEL id=' . $id . ' gid=' . $r['gid'] . ' m_name=' . $r['m_name']
            . ' base=' . $baseScore . ' live=' . $liveScore . ' refund=' . $refund);
        return;
    }
    try {
        $db_c->beginTransaction();
        // 先置取消态(幂等: 仅当仍 danger=1 且未取消); ★校验命中行数防幽灵退款:
        // affected=0 说明该单已被 Bet.php L3224(35s 兜底)或其他进程确认/取消, 必须放弃退款,
        // 否则"单已 danger=3 有效却照退" = 平台净亏. (execSql 底层 PDO::exec 返回 affected rows)
        $up = 'UPDATE ' . Constant::T_BET . '
               SET `danger`=2,`dg`="N",`cancel`=1,`status`=16,`isResult`=1,`result`="T"
               WHERE `ID`=' . $id . ' AND `danger`=1 AND `cancel`!=1';
        $affected = $db_c->execSql($up);
        if (!$affected) {
            $db_c->rollback();
            upd_log('CANCEL SKIP id=' . $id . ' gid=' . $r['gid'] . ' (affected=0, 已被他进程确认/取消, 放弃退款)');
            return;
        }
        if ($refund > 0) {
            $re = 'UPDATE ' . Constant::T_MEMBER . '
                   SET `credit`=`credit`+' . $refund . ',`balance_credit`=`balance_credit`+' . $refund . '
                   WHERE `nid`="' . $r['nid'] . '" AND `pay_type`=1';
            $db_c->execSql($re);
        }
        $db_c->commit();
        upd_log('CANCEL id=' . $id . ' gid=' . $r['gid'] . ' m_name=' . $r['m_name']
            . ' base=' . $baseScore . ' live=' . $liveScore . ' refund=' . $refund);
    } catch (\Throwable $e) {
        $db_c->rollback();
        upd_log('CANCEL FAIL id=' . $id . ' rollback. ' . $e->getMessage());
    }
}

/**
 * 单轮处理
 */
function updanger() {
    global $db_c, $UPDANGER_CHECK_AFTER, $UPDANGER_MAX_AGE, $UPDANGER_CTYPE, $UPDANGER_DRY_RUN;
    $handled = 0; $cancelled = 0; $skipped = 0;
    try {
        $now    = time();
        $tCheck = $now - $UPDANGER_CHECK_AFTER;

        // 取一个后端采集账号(整轮复用)
        $t   = new Transform();
        $acc = $t->getUserCurl($UPDANGER_CTYPE);
        if (!is_array($acc) || (isset($acc['code']) && $acc['code'] != 10000)) {
            upd_log('无可用采集账号(ctype=' . $UPDANGER_CTYPE . '), 本轮跳过');
            return [0, 0, 0];
        }

        // 待判定: 足球滚球, danger=1 未结算 未取消, 下注超过 CHECK_AFTER 秒
        // LEFT JOIN foot_match 取 lid/ecid(get_game_more 需要); 仅 FT(对齐旧版只做足球)
        $sql = 'SELECT w.`ID`,w.`gid`,w.`gtype`,w.`score`,w.`strong`,w.`pay_type`,w.`hidden`,
                       w.`bet_golds`,w.`m_name`,w.`nid`,w.`bet_time`,s.`lid`,s.`ecid`
                FROM ' . Constant::T_BET . ' AS w
                LEFT JOIN ' . Constant::S_FT . ' AS s ON w.`gid`=s.`gid`
                WHERE w.`danger`=1 AND w.`isResult`=0 AND w.`rb`="Y" AND w.`dg`="Y"
                  AND w.`cancel`!=1 AND UPPER(w.`gtype`)="FT" AND w.`bet_time` < ' . $tCheck . '
                ORDER BY w.`ID`';
        $rows = $db_c->select($sql);
        if (!$rows) { return [0, 0, 0]; }

        $scoreCache = [];
        foreach ($rows as $r) {
            $id        = (int)$r['ID'];
            $age       = $now - (int)$r['bet_time'];
            $baseScore = trim((string)$r['score']);   // 下注瞬间比分基准

            // 兜底确认(不取消): 超龄 / 无基准比分 / 无赛况关联 → 保证结算, 绝不误杀
            if ($age > $UPDANGER_MAX_AGE || $baseScore === '' || $baseScore === ':'
                || empty($r['lid']) || empty($r['ecid'])) {
                confirm_bet($id, $UPDANGER_DRY_RUN);
                $handled++;
                continue;
            }

            // 实时上游比分(按 lid+ecid 缓存, 减少请求)
            $ck = $r['lid'] . '_' . $r['ecid'];
            if (!array_key_exists($ck, $scoreCache)) {
                $scoreCache[$ck] = fetch_live_score($r['gid'], $r['lid'], $r['ecid'], $r['gtype'], $t);
            }
            $live = $scoreCache[$ck];

            if ($live === null) {
                // 取分失败 → 不动(下轮再试; 超 MAX_AGE 兜底确认). 绝不因失败取消/退款.
                $skipped++;
                continue;
            }

            // 方向对齐: 两口径(原向/交换)都不等才判为"比分变化"(保守, 防方向误判误杀)
            $p        = explode(':', $live);
            $liveSwap = (count($p) == 2) ? $p[1] . ':' . $p[0] : $live;
            $unchanged = ($baseScore === $live) || ($baseScore === $liveSwap);

            if (!$unchanged) {
                cancel_bet($r, $baseScore, $live, $UPDANGER_DRY_RUN);
                $cancelled++; $handled++;
            } else {
                confirm_bet($id, $UPDANGER_DRY_RUN);
                $handled++;
            }
        }
        unset($t);   // 显式释放本轮 Transform/curl 句柄, 防长期常驻 fd 累积(PHP 亦会 GC, 此为防御)
    } catch (\Throwable $e) {
        upd_log('updanger LOOP ERROR: ' . $e->getMessage());
    }
    return [$handled, $cancelled, $skipped];
}

// ===================== 主循环 =====================
// 运行模式: argv[1]=='once' -> 单轮自测(跑一次即退出, 供部署前验证, 不进常驻循环);
//           其它(含 BAT 的 'start') -> 常驻轮询. 不影响 bat.txt 的 `php updanger.php start`.
$RUN_MODE = isset($argv[1]) ? $argv[1] : 'start';

upd_log('==== updanger(rewrite) 启动 mode=' . $RUN_MODE . ' DRY_RUN=' . var_export($UPDANGER_DRY_RUN, true)
    . ' CHECK_AFTER=' . $UPDANGER_CHECK_AFTER . ' MAX_AGE=' . $UPDANGER_MAX_AGE
    . ' POLL=' . $UPDANGER_POLL . ' CTYPE=' . $UPDANGER_CTYPE . ' ====');

if ($RUN_MODE === 'once') {
    list($h, $c, $s) = updanger();
    $msg = '[ONCE] 单轮自测完成 处理=' . $h . ' 取消=' . $c . ' 取分失败跳过=' . $s;
    upd_log($msg);
    echo $msg . "\n";
    exit(0);
}

while (true) {
    list($h, $c, $s) = updanger();
    if ($h > 0 || $s > 0) {
        upd_log('本轮 处理=' . $h . ' 取消=' . $c . ' 取分失败跳过=' . $s);
        print_r(utf8_gbk('滚球审核 处理' . $h . ' 取消' . $c . ' 跳过' . $s . ' ' . date('H:i:s') . "\n"));
    }
    sleep($UPDANGER_POLL);
}
