<?PHP
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
$refreshTime = 620;//刷新时间
$refreshTime_one = 5;//单次刷新间隔时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php'; 
do{
    global $curlTypes;
    $types = $curlTypes["s60"];
    $k = "BK_P3";
    $v = $types[$k];
    $isErr = false;
    foreach($langx_name as $langx => $name){
        print_r(utf8_gbk( $v["name"] . "[{$name}] 数据采集开始...\n"));
        $str = setMatchData($k, $v, $langx,"N",60,$codes["bk_p3"]);
        if ($str) {
            print_r(utf8_gbk( $v["name"] . "[{$name}]" . $str . "\n"));
        } else {
            $isErr = true;
        }
        sleep(5);
    }
    
    $rTime = $refreshTime;
    // if($isErr){ 
    //     $rTime = $refreshTime_err;
    // }
    print_r("{$rTime}秒后从新检测线路...\n");
    sleep($rTime);
    
} while(true);
?>