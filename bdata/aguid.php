<?php
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
include_once "include/config.php";
$title = "代理UID检测";
$refreshTime = 300;//刷新时间
$rTime = 1;//间隙时间
$content = "";//显示内容
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
$ad_url = [
	'http://agresultapi.iooyuu.com'
	//'https://ag.hga553.com'
	//'https://ag7.hgs2026.com'
	//'https://ag.hga553.com'
    /*"https://ag.mos011.com",
    "https://ag.mos022.com",
    "https://ag.mos066.com",
    "https://ag.hga050.com",
    "https://ag.hga039.com",
    "https://ag.hga035.com",
    "https://ag.hga030.com"*/
];
$ver = "version-12-29";
$langx = "zh-cn";
$login_layer = "ag";
do{ 
    $table = Constant::T_AGUID; 
    
    //--------------------↓↓↓ 网址检测 - 开始 ↓↓↓-----------------------
    foreach ($ad_url as $k => $v){
        $tf = new TransformAG($v,$langx,$ver,$login_layer);
        $isUrl = $tf->chkUrl($v);
        //$tf->close();
        if($isUrl["status"]=="ok"){
            $url = $v;
            break;
        }
    }
    //--------------------↑↑↑ 网址检测 - 结束 ↑↑↑-----------------------
    if(!empty($url)) {
        $rs = $db_s->select("SELECT * FROM {$table}");
        foreach ($rs as $k => $v) { 
            $str = "[代理账号:{$v["username"]}] ";
            $v["url"] = $url;

            $str .= checkAGUID($v);
            print_r($str."\n");
            sleep($rTime);
        }
        print_r("{$refreshTime}秒后从新检测代理UID...\n");
    }else{ 
        print_r("所有代理线路不通...\n");
    }
    sleep($refreshTime);
} while(true); 

function checkAGUID($v){
    global $ver,$langx,$login_layer;
    $url = $v["url"];
    
    $tf = new TransformAG($url, $langx, $ver, $login_layer);
    $uid = $v["uid"];
    $user_id = $v["user_id"];
    $layer_id = $v["layer_id"];
    $status = 1;
    $msg = "ok";
    $isUrl = $tf->chkUrl($url);

    if (isset($isUrl["maintain_sw"]) && $isUrl["maintain_sw"] == "Y") {
        $tf->close();
        $status = 2;
        $msg = "系统维护时间{$isUrl["maintain_time"]}";
        setCurlTable($v["id"], $url, $uid, $user_id, $layer_id, $status, $msg, $ver);
        sleep(59);
        return $msg;
    }

    //更新版本号
    if (!empty($isUrl["ver"])) {
        $ver = $isUrl["ver"];
    }
    //}
    //设置默认采集账号配置为当前账号配置
    $tf->setDefaultWeb($v);

    //--------------------↓↓↓ 检测UID - 开始 ↓↓↓-----------------------
    $xml = $tf->get_online_mem();//访问用户资料用于检测登陆是否失效

    if ($xml["status"] == "success") { 
        $tf->close();
        $status = 1;
        $msg = "ok";
        setCurlTable($v["id"], $url, $uid, $user_id, $layer_id, $status, $msg, $ver);
        return "正常";
    }
    //--------------------↑↑↑ 检测UID - 结束 ↑↑↑-----------------------

    //--------------------↓↓↓ 登陆验证 - 开始 ↓↓↓----------------------- 
    $arr = $tf->login($v["username"], $v["password"]);
    $tf->close();
    if ($arr["status"] == "error") {
        $v["status"] = $arr["msg"];
        $status = 2;
        $msg = $arr["msg"];
        setCurlTable($v["id"], $url, $uid, $user_id, $layer_id, $status, $msg, $ver);
        return $arr["msg"];
    } else {
        $status = 1;
        $msg = "ok";
        $user_id = $arr["user_id"];
        $layer_id = $arr["layer_id"];
        $uid = $arr["uid"];
        $cookie = $arr["cookie"] ? $arr["cookie"] : "";
    
        setCurlTable($v["id"], $url, $uid, $user_id, $layer_id, $status, $msg, $ver,$cookie);
        return "UID:{$uid}";
    }

    //--------------------↑↑↑ 登陆验证 - 结束 ↑↑↑-----------------------
}

function setCurlTable($id,$url,$uid,$user_id,$layer_id,$status=1,$msg="ok",$ver='',$cookie=''){
    global $table,$db_s;
    $up = [
        "uid" => $uid,
        "url" => $url,
        "ver" => $ver,
        "status" => $status,
        "msg" => $msg,
        "user_id" => $user_id,
        "layer_id" => $layer_id
    ];
    if($cookie != ''){ 
        $up["cookie"] = $cookie;
    }
    $db_s->update($table,$up,"`id`={$id}");
}

?>