<?PHP
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header("Content-type: text/html; charset=utf-8");
define('ROOT_PATH', dirname(dirname(dirname(__FILE__))));
if (!defined('ROOT_PATH')) exit('invalid request');
include_once ROOT_PATH .'/common/include/config.php';
include_once 'fun.php';

//赛事采集编号(不能重复)
$codes = [
    "fs"        => 1,
    "zc_data"   => 2,
    "other_r"   => 3, 
    "other_re"  => 4,
    "bk_r"      => 5,
    "bk_re"     => 6, 
    "bk_p3"     => 7,
    "ft_r"      => 8, 
    "ft_re"     => 9,
    "ft_pd"     => 10,
    "ft_p3"     => 11 
];
?>