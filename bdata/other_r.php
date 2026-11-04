<?PHP
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
$refreshTime = 910;//刷新时间
$refreshTime_err = 5;//单次刷新间隔时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php'; 
do{
    global $curlTypes;
    $types = $curlTypes["s60"];
    $isErr = false; 
      
    // $v = $types["ES_R"]; //电竞测试
    // foreach($langx_name as $langx => $name){
    //     print_r(utf8_gbk( $v["name"] . "[{$name}] 数据采集开始...\n"));
    //     $str = setESMatchData("ES_R", $v, $langx,"N",60,$codes["other_r"]);
    //     if ($str) {
    //         print_r(utf8_gbk( $v["name"] . "[{$name}]" . $str . "\n"));
    //     } else {
    //         $isErr = true;
    //     }
    // }

    foreach ($types as $k => $v) { 
        if (strpos($k, "FT") !== false || strpos($k, "BK") !== false) { 
        }else{
            foreach($langx_name as $langx => $name){
                $str = "";
                print_r(utf8_gbk( $v["name"] . "[{$name}] 数据采集开始...\n"));
                if($v["gtype"] == "ES"){ //电竞
                    $str = setESMatchData($k, $v, $langx,"N",60,$codes["other_r"]);
                }else{ 
                    $str = setMatchData($k, $v, $langx,"N",60,$codes["other_r"]);
                }
                
                if ($str) {
                    print_r(utf8_gbk( $v["name"] . "[{$name}]" . $str . "\n"));
                } else {
                    $isErr = true;
                }
                sleep(3);
            }
        }
        sleep(10);
    }
    $rTime = $refreshTime;
    // if($isErr){ 
    //     $rTime = $refreshTime_err;
    // }
    print_r("{$rTime}秒后从新检测线路...\n");
    sleep($rTime);
    
} while(true);
?>