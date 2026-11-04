<?php
/**
 * UID检测启动诊断脚本 (只读检测，不修改任何数据)
 * 用法: 复制到 D:\wwwroot3\bdata\diag_uid.php 后运行:  php diag_uid.php
 */
if (php_sapi_name() !== 'cli') { exit("请在命令行运行: php diag_uid.php\n"); }
if (stripos(PHP_OS, 'WIN') === 0) { passthru('chcp 65001 > nul'); }
date_default_timezone_set('Asia/Shanghai');

$root = dirname(__DIR__); // 脚本必须放在 bdata 目录下

function ok($m)   { echo "[OK]   {$m}\n"; }
function fail($m) { echo "[FAIL] {$m}\n"; global $failCount; $failCount++; }
function warn($m) { echo "[WARN] {$m}\n"; }
function info($m) { echo "[INFO] {$m}\n"; }
function hr()     { echo str_repeat('-', 64) . "\n"; }

echo "========== UID启动诊断 " . date('Y-m-d H:i:s') . " ==========\n";
$failCount = 0;

/* ---------- 1. PHP 运行环境 ---------- */
hr(); echo "【1】PHP 运行环境\n";
info('PHP 版本: ' . PHP_VERSION . '  (' . PHP_OS . ', ' . php_sapi_name() . ')');
$ini = php_ini_loaded_file();
if ($ini) { info("加载的 php.ini: {$ini}"); }
else { fail('PHP 未加载任何 php.ini (大部分扩展默认没开，uid.php 必然跑不起来)'); }
info('display_errors=' . ini_get('display_errors') . '  log_errors=' . ini_get('log_errors') . '  error_log=' . (ini_get('error_log') ? ini_get('error_log') : '(未设置)'));
foreach (array('pdo', 'pdo_mysql', 'mysqli', 'curl', 'json', 'mbstring', 'simplexml', 'dom') as $ext) {
    if (extension_loaded($ext)) { ok("扩展 {$ext} 已加载"); }
    else { fail("扩展 {$ext} 未加载 (检查 php.ini 中 ;extension={$ext} 是否被注释)"); }
}

/* ---------- 2. 关键文件 ---------- */
hr(); echo "【2】关键文件检查 (根目录: {$root})\n";
$files = array(
    'bdata/include/config.php'       => "{$root}/bdata/include/config.php",
    'bdata/include/fun.php'          => "{$root}/bdata/include/fun.php",
    'common/include/config.php'      => "{$root}/common/include/config.php",
    'common/include/global.php'      => "{$root}/common/include/global.php",
    'common/include/mysql.php'       => "{$root}/common/include/mysql.php",
    'common/include/mysql.local.php' => "{$root}/common/include/mysql.local.php",
    'common/class/mysqldb.php'       => "{$root}/common/class/mysqldb.php",
    'common/class/Constant.php'      => "{$root}/common/class/Constant.php",
    'common/class/Transform.php'     => "{$root}/common/class/Transform.php",
    'common/class/curl.php'          => "{$root}/common/class/curl.php",
);
foreach ($files as $label => $f) {
    if (is_file($f)) { ok("存在: {$label}"); }
    else { fail("缺失: {$label}"); }
}

/* ---------- 3. 数据库配置与连接 (独立测试，不依赖项目代码) ---------- */
hr(); echo "【3】数据库配置与连接测试\n";
$localFile = "{$root}/common/include/mysql.local.php";
if (!is_file($localFile)) {
    fail("缺少 common/include/mysql.local.php");
    info('  mysql.php 里默认 账号/密码/库名 全是空字符串，DB 连接必然抛异常，uid.php 启动即闪退且屏幕无任何输出!');
    info('  解决: 创建该文件并填入正确的数据库连接信息');
} else {
    ok('存在: common/include/mysql.local.php');
    $cfg = include $localFile;
    if (!is_array($cfg)) { fail('mysql.local.php 返回的不是数组 (检查文件语法)'); $cfg = array(); }
    foreach (array('host', 'username', 'password', 'charset', 'database_c', 'database_s') as $k) {
        if (!isset($cfg[$k]) || $cfg[$k] === '') { warn("配置项 {$k} 为空"); }
    }
    $host    = isset($cfg['host'])     ? $cfg['host']     : 'localhost';
    $user    = isset($cfg['username']) ? $cfg['username'] : '';
    $pass    = isset($cfg['password']) ? $cfg['password'] : '';
    $charset = (isset($cfg['charset']) && $cfg['charset'] !== '') ? $cfg['charset'] : 'utf8';
    foreach (array('database_c' => 'db_client', 'database_s' => 'db_sports') as $key => $label) {
        $dbname = isset($cfg[$key]) ? $cfg[$key] : '';
        if ($dbname === '') { fail("{$key} 未配置，无法连接 {$label}"); continue; }
        try {
            $pdo = new PDO("mysql:host={$host};dbname={$dbname};charset={$charset}", $user, $pass, array(
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5,
            ));
            ok("连接 {$label} ({$dbname} @ {$host}) 成功");
            if ($key === 'database_s') {
                foreach (array('uid', 'url') as $t) {
                    try {
                        $n = $pdo->query("SELECT COUNT(*) FROM `{$t}`")->fetchColumn();
                        ok("表 db_sports.{$t} 可访问，当前 {$n} 条记录");
                        if ($t === 'uid') {
                            foreach ($pdo->query("SELECT `user`,`status`,`url` FROM `uid`") as $r) {
                                info("  采集账号: {$r['user']}  status={$r['status']}  url={$r['url']}");
                            }
                        }
                    } catch (PDOException $e) { fail("表 db_sports.{$t} 查询失败: " . $e->getMessage()); }
                }
            }
        } catch (PDOException $e) {
            fail("连接 {$label} ({$dbname} @ {$host}) 失败: " . $e->getMessage());
            info('  账号=' . ($user === '' ? '(空!)' : $user) . '  密码=' . ($pass === '' ? '(空!)' : '(已填)'));
        }
    }
}

/* ---------- 4. 模拟 uid.php 完整启动链 (放最后，失败不影响前面结果) ---------- */
hr(); echo "【4】模拟 uid.php 启动 (include bdata/include/config.php)\n";
ob_start(); // 吸收诊断脚本自身输出，避免 include 链中 header() 报 already-sent 造成误报
set_error_handler(function ($no, $str, $file, $line) {
    if (!(error_reporting() & $no)) { return false; }
    if (stripos($str, 'Cannot modify header information') !== false) { return true; } // CLI 下 header 警告无害，忽略避免误报
    throw new ErrorException($str, 0, $no, $file, $line);
});
try {
    include_once __DIR__ . '/include/config.php';
    ok('include 链加载成功 (bdata config + common class/global/mysql + fun.php)');
} catch (Exception $e) {
    fail('加载异常: ' . get_class($e) . ': ' . $e->getMessage());
    info('  位置: ' . $e->getFile() . ' 第 ' . $e->getLine() . ' 行');
}
if (class_exists('Constant')) { ok('Constant 类已加载, T_UID=' . Constant::T_UID); }
else { fail('Constant 类未加载 (common/class 目录 glob 加载失败?)'); }
if (class_exists('DB') && isset($db_s) && is_object($db_s)) {
    try {
        $rs = $db_s->select('SELECT * FROM ' . Constant::T_UID);
        ok('DB::select 查询 uid 表成功, 共 ' . count($rs) . ' 个采集账号');
    } catch (Exception $e) {
        fail('通过项目 DB 类查询 uid 表失败: ' . $e->getMessage());
    }
} else {
    fail('$db_s 不可用 (项目 DB 类实例化失败，原因见【3】连接测试)');
}
restore_error_handler();

/* ---------- 汇总 ---------- */
hr();
if ($failCount === 0) {
    ok('以上检测全部通过，配置/文件/数据库都正常。');
    info('uid.php 闪退但屏幕无输出 → 多半是 php.ini 关闭了错误显示，请运行下面命令看真正报错:');
    info('  php -d display_errors=1 ..\\uid.php');
    info('或查看 php.ini 中 error_log 指向的日志文件末尾几行。');
} else {
    echo "共发现 {$failCount} 个 [FAIL]，按上面提示逐项处理后再试。\n";
}
