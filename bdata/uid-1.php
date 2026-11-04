<?php
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
include_once "include/config.php";
$title = "UID检测";
$refreshTime = 60;//刷新时间
$rTime = 1;//间隙时间
$content = "";//显示内容
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去

do{
    $ary = [];
    $table = Constant::T_UID;
    $rs = $db_s->select("SELECT * FROM {$table}");
    foreach ($rs as $k => $v) { 
        $str = "[账号:{$v["user"]}] ";
        $str .= checkUID($v);
        print_r($str."\n");
        sleep($rTime);
    }
    print_r("{$refreshTime}秒后从新检测UID...\n");
    sleep($refreshTime);
} while(true);

function setUID($ary,$id){
    global $table,$db_s;
    $db_s->update($table,$ary,"`id`={$id}");
}

function checkUID($v){
    global $db_c;
    $ary = [];
    $tf = new Transform($v['url'],"zh-cn");
    $isUrl = $tf->chkUrl();
    //--------------------↓↓↓ 网址检测 - 开始 ↓↓↓-----------------------
    if($isUrl["status"]=="error"){
        $url1 = get_url(); //获取新线路
        if(empty($url1)){
            $tf->close();
            $ary["status"] = "所有线路不通！";
            setUID($ary,$v["id"]);
            return $ary["status"];
        }
        $ary["url"] = $url1;
        $isUrl = $tf->chkUrl($ary["url"]);

        if($isUrl["status"]=="error"){ 
            $tf->close();
            $ary["status"] = "线路不通！";
            setUID($ary,$v["id"]);
            return $ary["status"];
        }
    }
    //--------------------↑↑↑ 网址检测 - 结束 ↑↑↑-----------------------


    //--------------------↓↓↓ 系统维护检测 - 开始 ↓↓↓-----------------------
    if(isset($isUrl["maintain_sw"]) && $isUrl["maintain_sw"] == "Y"){
        $tf->close();
        if($isUrl["maintain_sw"]=="Y"){
            $ary["status"] = "紧急维护";
        }else{
            $ary["status"] = "例行维护";
        }
        $webstr = $isUrl["maintain_time"];
        //更新维护表
        $db_c ->update(Constant::T_CONFIG_DEFAULT,["website"=>1,"webstr"=>$webstr],"`isrg`=0");
        setUID($ary,$v["id"]);
        return $ary["status"];
    }else{ 
        $xml = $tf->service_mainget("N");
        $urgent_sw =  $tf->getXmlNode($xml,"urgent_sw");
        $maintain_sw =  $tf->getXmlNode($xml,"maintain_sw");
        if($urgent_sw=="Y" || $maintain_sw=="Y"){
            $tf->close();
            if($urgent_sw=="Y"){
                $ary["status"] = "紧急维护";
            }else{
                $ary["status"] = "例行维护";
            }
            $website = $tf->getXmlNode($xml,"maintain_time");
            //更新维护表
            $db_c ->update(Constant::T_CONFIG_DEFAULT,["website"=>1,"webstr"=>$website],"`isrg`=0");
            setUID($ary,$v["id"]);
            return $ary["status"];
        }else{
            $db_c ->update(Constant::T_CONFIG_DEFAULT,["website"=>0],"`isrg`=0");
        }
    }
    //--------------------↑↑↑ 系统维护检测 - 结束 ↑↑↑-----------------------

    //设置默认采集账号配置为当前账号配置
    $tf->setDefaultWeb($v);
    //更新版本号
    if(!empty($isUrl["ver"]) && $isUrl["ver"]!=$v["ver"]){
        $ary["ver"] = $isUrl["ver"];
        $v["ver"] = $isUrl["ver"];
    }

    //--------------------↓↓↓ 检测UID - 开始 ↓↓↓----------------------- 
    $xml = $tf->get_member_data();//访问用户资料用于检测登陆是否失效
    $code = $tf->getXmlNode($xml,"code");
    if($code == "get_credit_data"){ 
        $tf->close();
        $ary["status"] = "ok";
        setUID($ary,$v["id"]);
        return "UID:正常";
    }
    //--------------------↑↑↑ 检测UID - 结束 ↑↑↑-----------------------

    //--------------------↓↓↓ 登陆验证 - 开始 ↓↓↓-----------------------
    $arr = $tf->login($v["user"],$v["pwd"]);
    if($arr["status"] == "error"){ 
        $tf->close();
        $ary["status"] = $arr["msg"];
        setUID($ary,$v["id"]);
        return $arr["msg"];
    }
    $tf->close();
    //登陆成功
    $ary["uid"] = $arr["uid"];
    $ary["mid"] = $arr["mid"];
    $ary["url"] = $arr["url"];
    $ary["status"] = "ok";
    setUID($ary,$v["id"]);
    return "UID:{$arr["uid"]}";
    //--------------------↑↑↑ 登陆验证 - 结束 ↑↑↑-----------------------
}

function get_url(){
    global $db_s;
    $rs = $db_s->select("SELECT `url` FROM ".Constant::T_URL ." WHERE `status`='ok' limit 1","Row");
    return isset($rs["url"]) ? $rs["url"] : "";
}
?>
