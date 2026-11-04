<?PHP 
header("Content-type: text/html; charset=utf-8");
if (!defined('COMMON_ROOT_PATH')) exit('invalid request');

$db_config = [
    'host' => 'localhost',
    'username' => '',
    'password' => '',
    'charset' => '',
    'database_c' => '',
    'database_s' => '',
];

$localConfig = COMMON_ROOT_PATH . '/include/mysql.local.php';
if (file_exists($localConfig)) {
    $local = include $localConfig;
    if (is_array($local)) {
        $db_config = array_merge($db_config, $local);
    }
}

$db_host = $db_config['host'];
$db_username = $db_config['username'];
$db_password = $db_config['password'];
$db_charset = $db_config['charset'];

$db_s = DB::getInstance($db_host, $db_username, $db_password, $db_charset, $db_config['database_s']);
$db_c = DB::getInstance($db_host, $db_username, $db_password, $db_charset, $db_config['database_c']);
?>
