<?php
ini_set("display_errors", "On");
error_reporting(E_ALL | E_STRICT);
header('Content-type: text/html;charset=utf-8');

$title = "UID检测";
$refreshTime = 7;//刷新时间
$content = "";//显示内容
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去

#do{
    include_once "../../bdata/include/config.php";
    global $db_c,$db_s,$webdb;
    $table = Constant::S_CONFIG;
    #echo $table;
    $curl = $db_c->select("SELECT * FROM {$table} LIMIT 1","Row");
    if($curl) {
        $front = !empty($curl["front"]) ? unserialize($curl["front"]) : [];
        $after = !empty($curl["after"]) ? unserialize($curl["after"]) : [];
        echo $curl["after"];
        $arr = [
        "front" => $front,
            "after" => $after
        ];
        echo serialize($after);
        writefile(serialize($arr));
        print_r("写入db.php成功!\n");
    }
    #sleep($refreshTime);
#} while(true);
?>
