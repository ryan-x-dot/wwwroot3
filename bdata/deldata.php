<?php
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
$refreshTime = 300;//刷新时间
$refreshTime_err = 5;//单次刷新间隔时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php'; 
function go(){
	$refreshTime = 600;
	$refreshTime_err = 30;
	try{
		deldata();
		sleep($refreshTime);
	}catch (Exception $ex){
		sleep($refreshTime_err);
	}
		go();
}
go();
?>