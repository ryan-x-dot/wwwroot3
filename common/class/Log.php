<?php

// use Exception;

// header("Content-type:text/html;charset=utf-8");
date_default_timezone_set('Etc/GMT+4');

class Log
{
    /** 诊断日志总开关：改为 false 可立即停用（无需删代码） */
    public static $enable    = true;
    /** 单文件体积上限（字节），超过即轮转，封顶磁盘占用 */
    private static $maxSize  = 5242880; // 5MB
    /** 日志保留天数，超期自动清理 */
    private static $keepDays = 7;
    /** 缓存已解析的可写日志目录，避免每次写入重复探测 */
    private static $logDir   = null;

    /**
     * 写诊断日志（生产安全：按天轮转 + 体积封顶 + 超期清理 + 失败静默）
     * @param $type 日志类型
     * @param $mesg 日志内容
     */
    public static function write($type, $mesg)
    {
        if (!self::$enable) { return; }
        try {
            if (is_array($mesg)) {
                $mesg = json_encode($mesg, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
            }
            $dir = self::logDir();
            if ($dir === null) { return; }

            $day  = date("Ymd");
            $file = $dir . "/kick_" . $day . ".log";
            $line = "[" . date("Y-m-d H:i:s") . "] [" . $type . "] " . $mesg . "\n";

            // 概率性清理过期文件（约 1/50 写入触发一次，避免每次 glob 扫描）
            if (mt_rand(1, 50) === 1) { self::cleanup($dir, $day); }

            // 体积封顶：超过上限轮转为 .1（仅留一个备份），单文件不会无限增长
            clearstatcache(true, $file);
            if (@filesize($file) > self::$maxSize) {
                @unlink($file . ".1");
                @rename($file, $file . ".1");
            }

            @file_put_contents($file, $line, FILE_APPEND | LOCK_EX);
        } catch (Exception $exception) {
            // 诊断日志失败绝不能影响主流程，静默吞掉
        }
    }

    /**
     * 探测并缓存一个可写日志目录（优先当前工作目录，其次 common/log，最后系统临时目录）
     */
    private static function logDir()
    {
        if (self::$logDir !== null) { return self::$logDir; }
        $cands = [".", dirname(__DIR__) . "/log", sys_get_temp_dir()];
        foreach ($cands as $c) {
            if (!is_dir($c)) { @mkdir($c, 0777, true); }
            if (!is_dir($c)) { continue; }
            $probe = rtrim($c, "/\\") . "/.kick_w_" . getmypid();
            if (@file_put_contents($probe, "x") !== false) {
                @unlink($probe);
                self::$logDir = rtrim($c, "/\\");
                return self::$logDir;
            }
        }
        return null;
    }

    /**
     * 清理超过保留天数的日志（含 .1 备份）
     */
    private static function cleanup($dir, $today)
    {
        $files = @glob($dir . "/kick_*.log*");
        if (empty($files)) { return; }
        $todayTs = strtotime(substr($today, 0, 4) . "-" . substr($today, 4, 2) . "-" . substr($today, 6, 2));
        foreach ($files as $f) {
            if (preg_match('/kick_(\d{8})\.log/', $f, $m)) {
                $ts = strtotime(substr($m[1], 0, 4) . "-" . substr($m[1], 4, 2) . "-" . substr($m[1], 6, 2));
                if ($ts !== false && ($todayTs - $ts) > self::$keepDays * 86400) { @unlink($f); }
            }
        }
    }

    /**
     * xml数据转数据array
     * @param $xml
     * @return mixed
     */
    public static function xml_to_array($xml)
    {
        $arr = [];
        $reg = '/<(\\w+)[^>]*>([\\x00-\\xFF]*)<\\/\\1>/';
        if (preg_match_all($reg, $xml, $matches)) {
            $count = count($matches[0]);
            for ($i = 0; $i < $count; $i++) {
                $subxml = $matches[2][$i];
                $key = $matches[1][$i];
                if (preg_match($reg, $subxml)) {
                    $arr[$key] = self::xml_to_array($subxml);
                } else {
                    $arr[$key] = $subxml;
                }
            }
        }
        return $arr;
    }
}
