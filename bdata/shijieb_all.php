<?PHP
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
$refreshTime = 3600;//刷新时间
$refreshTime_one = 5;//单次刷新间隔时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php'; 
do{
        print_r(utf8_gbk($v . "[简体] 世界杯采集(全量)开始...\n"));
		$str = setFSMatchDataAll("FT", "zh-cn", $codes["fs_all"]);
		print_r(utf8_gbk($v . "[简体] " . $str . "\n"));
		sleep(1);
		print_r(utf8_gbk($v . "[繁体] 世界杯采集(全量)开始...\n"));
		$str = setFSMatchDataAll("FT", "zh-tw", $codes["fs_all"]);
		print_r(utf8_gbk($v . "[繁体] " . $str . "\n"));
		sleep(1);
		print_r(utf8_gbk($v . "[英文] 世界杯采集(全量)开始...\n"));
		$str = setFSMatchDataAll("FT", "en-us", $codes["fs_all"]);
		print_r(utf8_gbk($v . "[英文] " . $str . "\n"));
		sleep(1);
    print_r("{$refreshTime}秒后从新检测线路...\n");
    sleep($refreshTime);
    
} while(true);
?>
