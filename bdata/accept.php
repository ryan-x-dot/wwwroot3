<?PHP
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
$refreshTime = 120;//刷新时间
$refreshTime_err = 5;//单次刷新间隔时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php'; 
do{
    global $curlTypes;
    $isErr = false;
    $types = $curlTypes["a180"];
    foreach ($types as $k => $v) {
        // if($v["gtype"]=="ES"){ 
        //     foreach($langx_name as $langx => $name){
        //         $str = setAcceptDataAG($v, $langx);
        //         if ($str) {
        //             print_r(utf8_gbk("[{$name}] => ".$v["name"] . $str . "\n"));
        //         } else {
        //             $isErr = true;
        //         }
        //     }
        // }
        foreach($langx_name as $langx => $name){
            $str = setAcceptDataAG($v, $langx);
            if ($str) {
                print_r(utf8_gbk("[{$name}] => ".$v["name"] . $str . "\n"));
            } else {
                $isErr = true;
            }
        }
    }
    
    $rTime = $refreshTime;
    if($isErr){ 
        $rTime = $refreshTime_err;
    }
    print_r("{$rTime}秒后从新检测线路...\n");
    sleep($rTime);
    
} while(true);
?>