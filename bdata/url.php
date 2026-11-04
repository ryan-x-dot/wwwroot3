<?php
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');

$refreshTime = 10;//刷新时间

set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
$table = "`db_sports`.`url`";
include_once 'include/config.php';
global $db_s,$db_c;
do{
    $rTime = 10;
    $time = time();
    $rs = $db_s->select("SELECT * FROM {$table}");
    //print_r($rs);
    foreach ($rs as $k => $v) {
        $url = $v["url"];
        $msg = "ok";
        $str = "URL:{$v["url"]}";
        /*检测线路 -- 开始*/
        $tf = new Transform($url);
        $isUrl = $tf->chkUrl($url);
        if($isUrl["status"]=="error"){
            $msg = "线路不通！";
            $str .= " 结果:{$msg}！";
            getPrint($str);
            setURLTable($v["id"],$msg,time()-$time);
            continue;
        }
        $str .= " 结果:打开正常";
        getPrint($str);
        setURLTable($v["id"],$msg,time()-$time);
        //$tf->close();
    }
    print_r("\n\n");
    sleep($rTime);
}while (true);

function getPrint($str){
	global $refreshTime;
	//$str = iconv("UTF-8","gbk//TRANSLIT",$str);
    print_r($str."\n");
    sleep($refreshTime);
}

function setURLTable($id,$msg="ok",$ms=0){
    global $table,$db_s;
    $up=[
        "status" => $msg,
        "ms" => $ms
    ];
    $db_s->update($table,$up,"`id`={$id}");
}

function rovmeScript($str){
    $a = [
        "script",
        "form"
    ];

    return str_replace($a,"",$str);
}
?>