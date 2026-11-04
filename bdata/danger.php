<?php
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
$refreshTime = 10;//刷新时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php';
do {
    $bet = new Bet();
    $bet->get_dangerous("N");
    print_r(utf8_gbk( "滚球注单确认\n"));
    sleep($refreshTime);
} while (true);
?>