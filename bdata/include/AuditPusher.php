<?php

/**
 * 投注留证推送（HTTP 通道）
 *
 * 职责：把 db_client.bet_mail_queue 的队列记录推送到 fastadmin 留证服务器
 *       的接收接口（/api/betpush/receive）。
 *
 * 协议：
 *   POST JSON + X-Push-Time(秒级时间戳) + X-Push-Sign
 *   X-Push-Sign = hash_hmac('sha256', time . '.' . body, secret)
 *
 * 幂等：push_id = sha1(ticket_id|bet_time|bet_golds|ioratio)，
 *       接收端按 push_id 唯一键去重，重试/重复推送不产生重复记录。
 *
 * 重要约束：本类只在 bdata 守护进程（CLI）中运行，
 *           绝不进入投注请求路径（性能红线：投注事务内只写本地队列表）。
 *
 * 异常约定（供守护进程分类处理）：
 *   stage=connect  网络/HTTP层失败（DNS、超时、非JSON响应）→ 整体退避，不消耗重试次数
 *   stage=reject   服务端明确拒绝（验签失败、数据非法）     → 单条退避重试
 *   stage=proto    本地组装失败（配置缺失、json_encode失败）→ 单条退避重试
 */

class AuditPusherException extends Exception
{
    public $stage;

    public function __construct($message, $stage)
    {
        parent::__construct($message);
        $this->stage = $stage;
    }
}

class AuditPusher
{
    private $cfg;

    public function __construct(array $cfg)
    {
        $this->cfg = $cfg + [
            'url'             => '',
            'secret'          => '',
            'connect_timeout' => 3,   // 秒：TCP连接超时（收敛故障恢复时间）
            'timeout'         => 10,  // 秒：总超时（含接收端入库）
        ];
        if (empty($this->cfg['url']) || empty($this->cfg['secret'])) {
            throw new AuditPusherException('audit通道未配置 url/secret', 'proto');
        }
    }

    /**
     * 推送一条队列记录
     * @param array $row bet_mail_queue 行（SELECT 出的关联数组）
     * @return array 服务端返回的 data（含 id/dup）
     * @throws AuditPusherException
     */
    public function pushRow(array $row)
    {
        $json = json_encode(self::buildBody($row), JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new AuditPusherException('json_encode失败:' . json_last_error_msg(), 'proto');
        }
        return $this->post($json);
    }

    /**
     * 组装推送体：幂等 push_id + 常用展示列 + payload 完整快照
     * @param array $row bet_mail_queue 行
     * @return array
     */
    public static function buildBody(array $row)
    {
        $p = json_decode((string)(isset($row['payload']) ? $row['payload'] : ''), true);
        if (!is_array($p)) {
            $p = [];
        }
        $legs = isset($p['_legs']) && is_array($p['_legs']) ? $p['_legs'] : [];

        return [
            'push_id'       => self::pushId($row),
            'ticket_id'     => (string)(isset($row['ticket_id']) ? $row['ticket_id'] : ''),
            'm_name'        => (string)(isset($row['m_name']) ? $row['m_name'] : ''),
            'mem_turn_rate' => (string)self::pick($p, 'mem_turn_rate'),
            'gtype'         => (string)self::pick($p, 'gtype'),
            'wtype'         => (string)self::pick($p, 'wtype'),
            'showtype'      => (string)self::pick($p, 'showtype'),
            'league'        => (string)self::pick($p, 'league'),
            'team_h'        => (string)self::pick($p, 'team_h'),
            'team_c'        => (string)self::pick($p, 'team_c'),
            'chose_team'    => (string)self::pick($p, 'chose_team'),
            'bet_content'   => self::contentSummary($p, $legs),
            'ioratio'       => (string)self::pick($p, 'ioratio'),
            'bet_golds'     => isset($row['bet_golds']) ? (string)$row['bet_golds'] : '0',
            'win_gold'      => self::pick($p, 'win_gold'),
            'currency'      => (string)self::pick($p, 'currency'),
            'bet_time'      => isset($row['bet_time']) ? (int)$row['bet_time'] : 0,
            'payload'       => $p,
            'row_hash'      => isset($row['row_hash']) ? (string)$row['row_hash'] : '',
        ];
    }

    /**
     * 幂等键：同一条注单（同注单号/时间/金额/赔率）的重试推送得到相同 push_id，
     * 接收端唯一索引去重；不同注单几乎不可能四元组全同。
     * @param array $row bet_mail_queue 行
     * @return string sha1 hex(40)
     */
    public static function pushId(array $row)
    {
        $p = json_decode((string)(isset($row['payload']) ? $row['payload'] : ''), true);
        $ioratio = is_array($p) && isset($p['ioratio']) ? (string)$p['ioratio'] : '';
        return sha1(
            (string)(isset($row['ticket_id']) ? $row['ticket_id'] : '') . '|'
            . (string)(isset($row['bet_time']) ? $row['bet_time'] : '') . '|'
            . (string)(isset($row['bet_golds']) ? $row['bet_golds'] : '') . '|'
            . $ioratio
        );
    }

    private static function pick(array $p, $k)
    {
        return isset($p[$k]) && $p[$k] !== '' ? $p[$k] : '';
    }

    /**
     * 内容摘要（列表展示用）：单场=选择/盘口/赔率；过关=关数+总赔率
     */
    private static function contentSummary(array $p, array $legs)
    {
        $parts = [];
        if ($legs) {
            $parts[] = count($legs) . '关';
        } elseif (isset($p['chose_team']) && $p['chose_team'] !== '') {
            $parts[] = '选:' . $p['chose_team'];
        }
        if (isset($p['spread']) && $p['spread'] !== '') {
            $parts[] = '盘:' . $p['spread'];
        } elseif (isset($p['ratio']) && $p['ratio'] !== '') {
            $parts[] = '比:' . $p['ratio'];
        }
        if (isset($p['ioratio']) && $p['ioratio'] !== '') {
            $parts[] = '@' . $p['ioratio'];
        }
        return implode(' ', $parts);
    }

    /**
     * 发送并校验响应
     * @param string $json 已编码的请求体
     * @return array 服务端 data
     * @throws AuditPusherException
     */
    private function post($json)
    {
        $time = time();
        $sign = hash_hmac('sha256', $time . '.' . $json, $this->cfg['secret']);

        $ch = curl_init($this->cfg['url']);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $json,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'X-Push-Time: ' . $time,
                'X-Push-Sign: ' . $sign,
            ],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CONNECTTIMEOUT => (int)$this->cfg['connect_timeout'],
            CURLOPT_TIMEOUT        => (int)$this->cfg['timeout'],
            CURLOPT_DNS_CACHE_TIMEOUT => 600,
        ]);
        $res  = curl_exec($ch);
        $err  = curl_error($ch);
        $http = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($res === false) {
            throw new AuditPusherException('curl失败:' . $err, 'connect');
        }

        $data = json_decode($res, true);
        if (!is_array($data)) {
            // 容错：生产机 PHP Warning（如 putenv 被禁用）会拼在 JSON 前面污染响应体，
            // 截取首个 '{' 到最后一个 '}' 的 JSON 段重试解析，避免误判为网络层故障
            $b = (string)$res;
            $p = strpos($b, '{');
            $q = strrpos($b, '}');
            if ($p !== false && $q !== false && $q > $p) {
                $data = json_decode(substr($b, $p, $q - $p + 1), true);
            }
        }
        if (!is_array($data)) {
            // 网关错误页/HTML响应等，按网络层故障处理（整体退避）
            throw new AuditPusherException('响应非JSON:HTTP' . $http . ' ' . substr((string)$res, 0, 120), 'connect');
        }
        if (!isset($data['code']) || (int)$data['code'] !== 1) {
            $msg = isset($data['msg']) ? (string)$data['msg'] : '';
            throw new AuditPusherException('服务端拒绝:HTTP' . $http . ' ' . $msg, 'reject');
        }

        return isset($data['data']) && is_array($data['data']) ? $data['data'] : [];
    }
}
