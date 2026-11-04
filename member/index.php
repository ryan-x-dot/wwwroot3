<?php  
header('Content-type: text/html;charset=utf-8');
include_once './include/config.php'; 
$con_table = Constant::T_CONFIG_DEFAULT;
$conn = $db_c->select("SELECT * FROM {$con_table} WHERE `id`>0 LIMIT 1","Row");
$date =  date("Y-m-d-H");
$md = date("md");
$uid = isset($_REQUEST["uid"]) ? $_REQUEST["uid"] : "";
$chg_ad_ph = $_SERVER['HTTP_HOST'];
$ad_ip = $_SERVER['REMOTE_ADDR'];
$maintain_sw = isset($conn["website"]) && $conn["website"]==1 ? "Y"  : "N";//是否维护 
$mobile  = isMobile()==true ? "Y" : "N";
$testnewmsg = isset($_REQUEST["msg"]) ? $_REQUEST["msg"] : "";
$testnewalertMsg = isset($_REQUEST["newalertMsg"]) ? $_REQUEST["newalertMsg"] : "";
$ls = "cn";
switch ($langx){
    case "zh-cn":
        $ls = "cn";
        break;
    case "zh-tw":
        $ls = "tw";
        break;
    case "en-us":
        $ls = "us";
        break;
}



//替换内容
$ary_preg_replace = [ 
    ["/top.ls = '(.*?)';/s",            "top.ls = '{$ls}';"],
    ["/top.langx = '(.*?)';/s",         "top.langx = '{$langx}';"],
    ["/top.cu_domain = '(.*?)';/s",     "top.cu_domain = '{$_SERVER['HTTP_HOST']}';"],
    ["/top.cuipv6_domain = '(.*?)';/s", "top.cuipv6_domain = '{$_SERVER['HTTP_HOST']}';"],
    ["/top.ipv6_domain = '(.*?)';/s",   "top.ipv6_domain = '{$_SERVER['HTTP_HOST']}';"],
    ["/top.uid = '(.*?)';/s" ,          "top.uid = '{$uid}';"],
    ["/top.chg_ad_ph = '(.*?)';/s",     "top.chg_ad_ph = 'http://{$chg_ad_ph}';"],
    ["/top.ad_ip = '(.*?)';/s",         "top.ad_ip = '{$ad_ip}';"],
    ["/top.maintain_sw = '(.*?)';/s",   "top.maintain_sw = '{$maintain_sw}';"],
    ["/top.mobile = '(.*?)';/s",        "top.mobile = '{$mobile}';"],
    ["/top.oldSite = '(.*?)';/s",       "top.oldSite = '{$_SERVER['HTTP_HOST']}';"],
    ["/top.needsTrans = '(.*?)';/s",    ""],
];

if( !empty($uid) && !empty($_REQUEST["username"]) && !empty($_REQUEST["passwd_safe"])){
    // print_r("aaa");exit;
    $table = Constant::T_MEMBER;
    $mem = $db_c->selectNew("SELECT * FROM {$table} WHERE `uid` = :uid LIMIT 1", [':uid' => $uid], "Row");
    if($mem){
        $_pp = ["langx"=>$langx];
        $lg = new Base($_pp);
        $status = $lg->getAccountStatus($mem["nid"]);
        $odd_f_type = isset($_REQUEST["odd_f_type"]) && !empty($_REQUEST["odd_f_type"]) ? $_REQUEST["odd_f_type"] : "H";
        $secondSet4pwd = empty($mem["passcode"]) ? "N" : "Y";
        $four_pwd = "new";
        $ltype = ltype_num($mem["ltype"]);
        $ary_preg_replace[] = ["/_CHDomain.langx = '(.*?)';/s","_CHDomain.langx = '{$langx}';"];
        $ary_preg_replace[] = ["/_CHDomain.maxcredit = '(.*?)';/s","_CHDomain.maxcredit = '{$mem["balance_credit"]}';"];
        $ary_preg_replace[] = ["/_CHDomain.pay_type = '(.*?)';/s","_CHDomain.pay_type = '{$mem["pay_type"]}';"];
        $ary_preg_replace[] = ["/_CHDomain.odd_f_type = '(.*?)';/s","_CHDomain.odd_f_type = '{$odd_f_type}';"];
        $ary_preg_replace[] = ["/_CHDomain.status = '(.*?)';/s","_CHDomain.status = '{$status}';"];
        $ary_preg_replace[] = ["/_CHDomain.username = '(.*?)';/s","_CHDomain.username = '{$mem["name"]}';"];

        $ary_preg_replace[] = ["/_CHDomain.mid = '(.*?)';/s","_CHDomain.mid = '{$mem["id"]}';"];
        $ary_preg_replace[] = ["/_CHDomain.uid = '(.*?)';/s","_CHDomain.uid = '{$mem["uid"]}';"];
        $ary_preg_replace[] = ["/_CHDomain.ltype = '(.*?)';/s","_CHDomain.ltype = '{$ltype}';"];
        $ary_preg_replace[] = ["/_CHDomain.passwd_safe = '(.*?)';/s","_CHDomain.passwd_safe = '{$mem["loginname"]}';"];
        $ary_preg_replace[] = ["/_CHDomain.secondSet4pwd = '(.*?)';/s","_CHDomain.secondSet4pwd = '{$secondSet4pwd}';"];
        $ary_preg_replace[] = ["/_CHDomain.four_pwd = '(.*?)';/s","_CHDomain.four_pwd = '{$four_pwd}';"];
		$ary_preg_replace[] = ["/_CHDomain.msg = '(.*?)';/s","_CHDomain.msg = '{$testnewmsg}';"];
		$ary_preg_replace[] = ["/_CHDomain.newalertMsg = '(.*?)';/s","_CHDomain.newalertMsg = '{$testnewalertMsg}';"];

        
        //弹窗
        $ary_preg_replace[] = ["/createNetTimer\(\);/s","createNetTimer();_self.createMemMessageTimer();"];
        $js_tc = '_self.createMemMessageTimer=function(){var _name="MemMessageTimer";if(timerHash[_name]!=null)return;timerHash[_name]=new Timer(10*1000);timerHash[_name].setParentclass(_self);timerHash[_name].init();timerHash[_name].dont_clear=true;timerHash[_name].addEventListener("TimerEvent.TIMER",_self.memMessage);timerHash[_name].addEventListener("TimerEvent.TIMER_COMPLETE",_self.getMemData);timerHash[_name].startTimer();};';
        // $js_tc = "console.log('sdfd=========');";
        $js_tc .= '_self.clearMemMessageTimer=function(){var _name="MemMessageTimer";if(timerHash!=null){if(timerHash[_name]!=null){timerHash[_name].clearObj();timerHash[_name].is_clear=true;timerHash[_name]=null;}}return true;};';
        $js_tc .= '_self.memMessage=function(param){var par="p=mem_message&"+top.param; var getHTML=new HttpRequest();getHTML.addEventListener("LoadComplete",_self.getMemData);getHTML.loadURL(top.m2_url,"POST",par)};';
        $js_tc .= '_self.getMemData=function(data){if(data!=""){data=JSON.parse(data);var id=data.id;var msg=data.msg;_self.showAlertMsg({"target":"C_alert_ok","msg":msg,"retFun":_self.cleardoubleLogincookie,"msgid":id})}};';
        $js_tc .= '_self.createNetTimer=function';
        $ary_preg_replace[] = ["/_self.createNetTimer=function/s",$js_tc];

        //会话 
        $js_hh = '<div id="chat"style="display:none; width:100%; height:152px; left:2px; top:20px; position:absolute; z-index: 1000; background-color:#FFFFFF;"><table width="100%"border="0"cellpadding="0"cellspacing="3"bgcolor="#CA6500"><tr><td><iframe name="chat"src="about:blank"width="100%"height="150"frameborder="0"border="0"marginwidth="0"marginheight="0"scrolling="no"></iframe><iframe name="msg"src="about:blank"width="0"height="0"frameborder="0"border="0"marginwidth="0"marginheight="0"scrolling="no"></iframe></td></tr></table></div><script>function refreshChat(){try{if(top["userData"].uid!=null){window.frames["chat"].location.href="chat.php?uid="+top["userData"].uid+"&rnd="+Math.random()}}catch(e){}setTimeout("refreshChat()",10000)}refreshChat();</script>';
        // $js_hh .= "</body>";
        $ary_preg_replace[] = ["/\<!-- \<iframe name=\"SI2_func\" id=\"SI2_func\" src=\"\" scrolling=\"NO\" noresize width=0 height=0 style=\"display:none\"\>\<\/iframe\> --\>/s",$js_hh];
    }
    
    $type = "cu";
    $filename = "index&{$langx}&cu.html";
}else{ 
    // print_r("aaa1");exit;
    $type = "";
    $filename = "index&{$langx}.html";
}

//读取html内容

$index_path = DIR_MEMBER_HTML.$filename;
$isSave = false;
if(!file_exists($index_path)){ 
    $isSave = true;
}else{ 
    $rs = $db_s->select("SELECT `id` FROM ".Constant::T_HTML." WHERE `path`='{$filename}'","Row");
    if(empty($rs)){
        $isSave = true;
    }   
}

if($isSave){ 
    $acf = new AutoCurlFile();  
    $html = $acf->curlIndex($filename,$langx,$type);
    
    if(empty($html)){
        error_400(); exit;
    }
}else{ 
    $html = getFileTxt($index_path);
}
//批量替换内容 
$a = array_column($ary_preg_replace,0);
$b = array_column($ary_preg_replace,1);
$html = preg_replace($a,$b,$html);
print_r($html);
exit;
?>
