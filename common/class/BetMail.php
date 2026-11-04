<?php

/**
 * 投注邮件通知 - 入队类
 *
 * 调用点（均为会员端投注落库事务内，注单写入 bets 表之后）：
 *   - Bet::insertAry()    —— 单场注单（FT_bet / Other_bet / 批量单注）
 *   - Bet::FS_bet()       —— 冠军注单
 *   - Bet::All_bet_p3()   —— 过关注单（附带各关明细）
 *
 * 设计约束（务必遵守）：
 *   1. 本类是"只增不减"的旁路：任何异常必须在本类内部消化，
 *      绝不允许抛出影响投注主流程（不回滚事务、不改变接口返回值）。
 *   2. 只做一次 INSERT：不读配置、不发起网络调用、不使用 SMTP，耗时毫秒级。
 *   3. 队列表故障（表缺失、磁盘满等）只写降级日志，投注照常成功。
 *
 * 表：db_client.bet_mail_queue（建表脚本：数据库/bet_mail_notify.sql）
 * 发信：bdata/betmail.php 守护进程（独立运行，与投注完全隔离）
 */
class BetMail
{
    /** 队列表 */
    const QUEUE_TABLE = '`db_client`.`bet_mail_queue`';

    /** 快照校验码盐值（可自行修改，不要公开） */
    const SALT = 'bet_mail_2026_salt_change_me';

    /**
     * 入队一条投注记录（事务内调用，内部自捕获异常）
     *
     * @param object $dbc  DB 实例（$db_c，db_client 连接）
     * @param array  $snap 注单字段快照（$insertAry 原样传入）
     * @param array  $legs 过关注单各关明细数组（单注单留空即可）
     */
    public static function enqueue($dbc, array $snap, array $legs = [])
    {
        try {
            if (empty($snap['ticket_id'])) {
                return;
            }

            $payload = $snap;
            if (!empty($legs)) {
                $payload['_legs'] = $legs; // 过关各关明细，供邮件正文展开
            }

            $json = json_encode($payload, JSON_UNESCAPED_UNICODE);
            if ($json === false) {
                self::fallback('json_encode 失败: ' . json_last_error_msg());
                return;
            }

            // 关键字段校验码：事后可用邮件里的校验码与 bets 表当前值比对是否被改动
            $hash = sha1(implode('|', [
                (string)$snap['ticket_id'],
                isset($snap['bet_golds']) ? (string)$snap['bet_golds'] : '',
                isset($snap['ioratio']) ? (string)$snap['ioratio'] : '',
                isset($snap['win_gold']) ? (string)$snap['win_gold'] : '',
                isset($snap['bet_time']) ? (string)$snap['bet_time'] : '',
                self::SALT,
            ]));

            $dbc->execSqlNew(
                'INSERT INTO ' . self::QUEUE_TABLE
                . ' (`ticket_id`,`m_name`,`bet_golds`,`bet_time`,`payload`,`row_hash`,`status`,`retry`,`next_try`,`create_time`)'
                . ' VALUES (?,?,?,?,?,?,0,0,0,?)',
                [
                    (string)$snap['ticket_id'],
                    isset($snap['m_name']) ? (string)$snap['m_name'] : '',
                    isset($snap['bet_golds']) ? $snap['bet_golds'] : 0,
                    isset($snap['bet_time']) ? (int)$snap['bet_time'] : time(),
                    $json,
                    $hash,
                    time(),
                ]
            );
        } catch (Throwable $e) {
            // 隔离降级：队列写入失败绝不能影响投注
            self::fallback($e->getMessage());
        }
    }

    /**
     * 降级日志（本身也不允许抛出）
     */
    private static function fallback($msg)
    {
        try {
            $dir = dirname(__DIR__) . '/runtime';
            if (!is_dir($dir)) {
                @mkdir($dir, 0777, true);
            }
            @file_put_contents(
                $dir . '/betmail_fail.log',
                date('Y-m-d H:i:s') . ' [BetMail] ' . $msg . "\n",
                FILE_APPEND
            );
        } catch (Throwable $e) {
            // 忽略：任何情况下都不能向外抛出
        }
    }
}
