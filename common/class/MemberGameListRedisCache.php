<?php
/**
 * Short Redis cache for member game list APIs.
 */
class MemberGameListRedisCache
{
    private $redis = null;
    private $ttl = 5;
    private $staleTtl = 10;
    private $lockTtl = 2;
    private $prefix = 'member:game_list:v2:';
    private $checked = false;

    public function __construct()
    {
    }

    public function enabled()
    {
        if (!$this->checked) {
            $this->redis = $this->connect();
            $this->checked = true;
        }
        return $this->redis !== null;
    }

    public function isCacheableRequest($p)
    {
        if (!isset($p['p'])) {
            return false;
        }

        $actions = array(
            'get_specialGame_count' => true,
            'get_league_count' => true,
            'get_game_list' => true,
            'get_league_list_All' => true,
            'get_game_more' => true,
            'get_league_list_FS' => true,
            'get_game_list_FS' => true,
            'get_list_tv' => true,
            'get_game_OBT' => true,
            'get_cup_list_FS' => true,
            'get_cup_list' => true,
        );

        return isset($actions[$p['p']]);
    }

    public function get($p)
    {
        if (!$this->isCacheableRequest($p) || !$this->enabled()) {
            return false;
        }
        return $this->withRequestTimestamps($p, $this->redis->get($this->dataKey($p)));
    }

    public function getStale($p)
    {
        if (!$this->isCacheableRequest($p) || !$this->enabled()) {
            return false;
        }
        return $this->withRequestTimestamps($p, $this->redis->get($this->staleKey($p)));
    }

    public function waitAndGet($p, $waitMs = 300)
    {
        $sleepUs = 50000;
        $loops = max(1, (int)ceil(($waitMs * 1000) / $sleepUs));
        for ($i = 0; $i < $loops; $i++) {
            usleep($sleepUs);
            $value = $this->get($p);
            if ($value !== false && $value !== '') {
                return $value;
            }
        }
        return false;
    }

    public function lock($p)
    {
        if (!$this->isCacheableRequest($p) || !$this->enabled()) {
            return false;
        }

        $token = uniqid('', true);
        $key = $this->lockKey($p);

        try {
            $locked = $this->redis->rawCommand('SET', $key, $token, 'NX', 'EX', $this->lockTtl);
            if ($locked === true || $locked === 'OK') {
                return $token;
            }
        } catch (Exception $e) {
            if ($this->redis->setnx($key, $token)) {
                $this->redis->expire($key, $this->lockTtl);
                return $token;
            }
        }

        return false;
    }

    public function unlock($p, $token)
    {
        if (!$this->enabled() || !$token) {
            return false;
        }

        $key = $this->lockKey($p);
        if ($this->redis->get($key) === $token) {
            return $this->redis->del($key);
        }
        return false;
    }

    public function set($p, $value)
    {
        if (!$this->isCacheableRequest($p) || !$this->enabled() || !$this->isCacheableResponse($value)) {
            return false;
        }

        $this->redis->setex($this->dataKey($p), $this->ttl, $value);
        $this->redis->setex($this->staleKey($p), $this->staleTtl, $value);
        return true;
    }

    public function isCacheableResponse($value)
    {
        return is_string($value)
            && $value !== ''
            && stripos($value, '<serverresponse') !== false
            && stripos($value, '<status>error</status>') === false;
    }

    private function connect()
    {
        if (!class_exists('Redis')) {
            return null;
        }

        $host = getenv('MEMBER_REDIS_HOST') ?: '127.0.0.1';
        $port = (int)(getenv('MEMBER_REDIS_PORT') ?: 6379);
        $timeout = (float)(getenv('MEMBER_REDIS_TIMEOUT') ?: 0.2);
        $password = getenv('MEMBER_REDIS_PASSWORD');
        $database = getenv('MEMBER_REDIS_DB');

        try {
            $redis = new Redis();
            if (!$redis->connect($host, $port, $timeout)) {
                return null;
            }
            if ($password !== false && $password !== '') {
                $redis->auth($password);
            }
            if ($database !== false && $database !== '') {
                $redis->select((int)$database);
            }
            return $redis;
        } catch (Exception $e) {
            return null;
        }
    }

    private function dataKey($p)
    {
        return $this->prefix.md5($this->normalizedParams($p));
    }

    private function staleKey($p)
    {
        return $this->dataKey($p).':stale';
    }

    private function lockKey($p)
    {
        return $this->dataKey($p).':lock';
    }

    private function normalizedParams($p)
    {
        $skip = array(
            'uid' => true,
            'ts' => true,
            'Ts' => true,
            'TS' => true,
            'timestamp' => true,
            'timeStamp' => true,
            'systimestamp' => true,
            'nowClickTabTs' => true,
            'chgsortts' => true,
            'chgFilterTs' => true,
            '_' => true,
            'ver' => true,
            'lid' => true,
            'PHPSESSID' => true,
            'blackbox' => true,
        );

        $params = array();
        foreach ($p as $key => $value) {
            if (isset($skip[$key])) {
                continue;
            }
            if (is_array($value)) {
                $value = json_encode($value);
            }
            $params[$key] = (string)$value;
        }
        ksort($params);
        return http_build_query($params);
    }

    private function withRequestTimestamps($p, $value)
    {
        if (!is_string($value) || $value === '') {
            return $value;
        }

        $ts = $this->requestValue($p, array('ts', 'Ts', 'TS', 'timestamp', 'timeStamp'));
        if ($ts !== null) {
            $value = $this->replaceXmlNode($value, 'ts', $ts);
            $value = $this->replaceXmlNode($value, 'timestamp', $ts);
        }

        $nodes = array('systimestamp', 'nowClickTabTs', 'chgsortts', 'chgFilterTs');
        foreach ($nodes as $node) {
            $nodeValue = $this->requestValue($p, array($node));
            if ($nodeValue !== null) {
                $value = $this->replaceXmlNode($value, $node, $nodeValue);
            }
        }

        return $value;
    }

    private function requestValue($p, $keys)
    {
        foreach ($keys as $key) {
            if (isset($p[$key]) && is_scalar($p[$key]) && (string)$p[$key] !== '') {
                return (string)$p[$key];
            }
        }
        return null;
    }

    private function replaceXmlNode($xml, $node, $value)
    {
        return preg_replace(
            '/<'.$node.'>(.*?)<\/'.$node.'>/is',
            '<'.$node.'>'.htmlspecialchars($value, ENT_QUOTES, 'UTF-8').'</'.$node.'>',
            $xml
        );
    }
}
