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
    foreach ($gtypes as $k =>$v){
        if(strtoupper($v) != "FS") {
            print_r(utf8_gbk($v . "[简体] 冠军采集开始...\n"));
            $str = setFSMatchData($k, "zh-cn", $codes["fs"]);
            print_r(utf8_gbk($v . "[简体] " . $str . "\n"));
            sleep(1);
            print_r(utf8_gbk($v . "[繁体] 冠军采集开始...\n"));
            $str = setFSMatchData($k, "zh-tw", $codes["fs"]);
            print_r(utf8_gbk($v . "[繁体] " . $str . "\n"));
            sleep(1);
            print_r(utf8_gbk($v . "[英文] 冠军采集开始...\n"));
            $str = setFSMatchData($k, "en-us", $codes["fs"]);
            print_r(utf8_gbk($v . "[英文] " . $str . "\n"));
            sleep(1);
        }

    }
    print_r("{$refreshTime}秒后从新检测线路...\n");
    sleep($refreshTime);
    
} while(true);
?>