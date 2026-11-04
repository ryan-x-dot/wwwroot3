<?PHP 
header("Content-type: text/html; charset=utf-8");
define('ROOT_PATH', dirname(dirname(dirname(__FILE__))));
if (!defined('ROOT_PATH')) exit('invalid request');
define('DIR_ADMIN',ROOT_PATH.'/admin');
define('INCLUDE_DIR',DIR_ADMIN.'/include');

include_once ROOT_PATH .'/common/include/config.php';
require_once_file(ROOT_PATH.'/common/contorller/admin/');  
$langxs = ["zh-cn","zh-tw","en-us"];
$langx = "zh-cn";
$ls = "cn";
$coo = $_COOKIE;

if(isset($_REQUEST['langx'])){
    $langx = $_REQUEST["langx"];
}else{
    if(isset($coo["chg_langx"]) ){
        $langx = $coo["chg_langx"];
        if(!in_array($langx, $langxs)){
            $langx = base64_decode($langx);
        } 
    }
}
if(!in_array($langx, $langxs)){
    $langx = "zh-cn";
}

include_once ROOT_PATH."/common/config/ag-{$langx}.php"; 
include_once ROOT_PATH."/common/config/{$langx}.php"; 
$_POST["langx"] = $langx;
//$langx = "en-us";


//会员绑定IP
$uid=isset($_REQUEST['uid']) ? $_REQUEST['uid'] : "";
if(!empty($uid)){
    $memTable = Constant::T_MEMBER;
    $memRow = $db_c->selectNew("SELECT `setip`,`seturl` FROM {$memTable} WHERE `uid` = :uid", [':uid' => $uid], "Row");
}

?>