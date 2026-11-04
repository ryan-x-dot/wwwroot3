<?php
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
$refreshTime = 180;//刷新时间
$refreshTime_one = 5;//单次刷新间隔时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php';
global $db_c,$db_s,$webdb,$curlTypes;
$types = $curlTypes["s180"];

do{
    // print_r($langx_name);exit;
    $str = messageget();
    print_r(utf8_gbk("{$str}\n"));
    $isErr = false;
    $earlyDate = [1,2,3,4,5,6,7,"future"];
    foreach ($earlyDate as $n){
        foreach ($types as $k =>$v){
            $v["date"] = $n;
            if($n == "future"){
                $date = "未来";
            }else{
                $date = date("Y-m-d",strtotime("{$n} day"));
            }
            foreach($langx_name as $langx => $name){ 
                print_r(utf8_gbk($v["name"] . "[{$name}][$date] 数据采集开始...\n"));
                $str = setMatchData($k, $v,$langx,"N",180,$codes["zc_data"]); 
                print_r(utf8_gbk($v["name"] . "[{$name}][$date]" . $str . "\n"));
            }
        }
        sleep($refreshTime_one);
    }
    /*$db_c->close();
    $db_s->close();*/
    sleep($refreshTime);

} while(true);
?>