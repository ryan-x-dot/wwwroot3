<?PHP 
header("Content-type: text/html; charset=utf-8");
define('COMMON_ROOT_PATH', dirname(dirname(__FILE__)));
if (!defined('COMMON_ROOT_PATH')) exit('invalid request');

function require_once_file($path) {
    foreach (glob($path."*.php") as $filePath) { 
        if (file_exists($filePath)) {
            require_once $filePath;
        } else {
            echo "文件 {$filePath} 不存在。";
        }
        
    }
}

require_once_file(COMMON_ROOT_PATH.'/class/'); 
require_once_file(COMMON_ROOT_PATH.'/function/');
require_once COMMON_ROOT_PATH.'/include/global.php';
require_once COMMON_ROOT_PATH.'/include/mysql.php';

//过滤特殊函数
$isNormal = ["code"=>1,"data"=>""];//网站是否正常 code=1 表示正常
$disable_keywords = '/\b(union|select|update|delete|insert|drop|truncate|alter|create|table|database|into|values|from|where|order\s+by)\b|<script|<iframe|onclick|onerror|onload|eval\s*\(|phpinfo\s*\(|passthru|exec\s*\(|system\s*\(|shell_exec|proc_open|popen\s*\(/is';

function checkInputSafe($value, $pattern) {
    if (is_array($value)) {
        foreach ($value as $v) {
            checkInputSafe($v, $pattern);
        }
        return;
    }
    if (preg_match($pattern, $value)) {
        define("IS_NORMAL", serialize(["code" => 2, "msg" => "Illegal input detected"]));
    }
}

foreach ($_REQUEST as $key => $value) {
    if ($key === "blackbox") continue;
    checkInputSafe($value, $disable_keywords);
}

if (!defined('IS_NORMAL')) {
    define('IS_NORMAL', serialize($isNormal));
}
?>