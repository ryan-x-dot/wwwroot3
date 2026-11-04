<?PHP   
header('Content-type: text/html;charset=utf-8');
include_once 'include/config.php'; 
$code = unserialize(IS_NORMAL);
//if(isset($code["code"]) && $code["code"]==2){ exit("CheckIOSapp error");}

$_p = $_POST;
$dateH =  date("Y-m-d-H");
$date = date("Y-m-d H:i:s");
$ver = "2025-06-20-c1bugNo312_103";
$md = date("md");
$PHP_domain = $_SERVER['HTTP_HOST'];
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

$cheUIDAry = [
    "chg_newpwd","help_chg_safepwd","messageget","get_member_data","mem_online","memSet","mem_message",
    "get_history_data","get_history_view","get_todaywagers_count","get_today_wagers",
    "get_dangerous","get_bethold","FS_order_view","Total_order_view","Other_order_view",
    "FT_order_view","FT_bet","Other_bet","Total_bet","FS_bet","get_account_set","get_credit_logs"
];
if(empty($_p["p"])){ $_p = $_GET;}
if(empty($_p["p"]) || !preg_match('/^[a-zA-Z0-9_]+$/', $_p["p"])){ exit("Invalid parameter 'p'");}
$xml = new A2Xml();
$userId = 0;
if(in_array($_p["p"],$cheUIDAry)){ //需要uid验证
    $bs = new Base($_p);
    $guid = $bs->getUID();
    if($guid["status"] == "error"){
        $arr["code"] = "error";
        $arr["msg"] = $guid["msg"];
        exit($xml->toXml($arr));
    }
    $userId = $guid["user"]["id"];
}

$ary_preg_replace = [];
$fileDir = $_p["p"];
switch ($_p["p"]) {
	case 'service_mainget':
        header('Content-Type: text/xml');
        $con_table = Constant::T_CONFIG_DEFAULT;
        $conn = $db_c->select("SELECT * FROM {$con_table} WHERE `id`>0 LIMIT 1","Row");
        
        $maintain_sw = isset($conn["website"]) && $conn["website"]==1 ? "Y"  : "N";//是否维护
        $maintain_time = $conn["webstr"];
		        $clean_data_sw = 'N';
		$xmlArr = [
			"code" => 619,
			"urgent_sw"=>"",
			"emergency_sw"=>"N",
			"maintain_sw"=>"{$maintain_sw}",
			"maintain_time" => "{$maintain_time}",
			"clean_data_sw" => "{$clean_data_sw}",
			"clean_data_time" => "{$date}",
			"exceptions_ip" => "@{$PHP_domain}@",
			"masterNewDomain_ip" => "{$PHP_domain}@",
			"masterNewDomainY_ip"=> "{$PHP_domain}@",
			"now_time" => "{$date}",
            "myGame_sw" => "Y",
            "forecast_sw" => "Y",
			"gmt" => "WEB_TIME_ZONE"
		];
        
           $acc = new Account($_p);
        $arr = $acc->checkloginmember();
		   if($arr['code'] =="error"){
			   $xmlArr = [
				"code" => "error",
				"msg"=>"doubleLogin"
			];
		   }

		exit($xml->toXml($xmlArr));
    case 'mem_message':
        $acc = new Account($_p);
        exit($acc->get_alert_msg());
        break;
    case 'set_message':
        $acc = new Account($_p);
        exit($acc->set_alert_msg());
        break;
	case 'login':
        $ary_preg_replace[] = ["/var iovationURL= '(.*?)';/s","var iovationURL= 'http://sbc.ry00000.com/iovation/iovation.html?webProtocal=http&webDomain={$PHP_domain}';"];
		break;
    case 'chk_login':
        header('Content-Type: text/xml');
        if($code["code"]==2){ exit("CheckIOSapp error");}

        if(!isset($_SESSION["login_time"])){
            $_SESSION["login_time"] = time();
            $_SESSION["login_num"] = 1;//次数
            $_SESSION["no_login"] = "N";
        }else{
            if($_SESSION["no_login"] == "Y"){ //3分钟后登陆
                if(time()-$_SESSION["login_time"] > 3 *60){ //解除登陆
                    $_SESSION["login_time"] = time();
                    $_SESSION["login_num"] = 1;//次数
                    $_SESSION["no_login"] = "N";
                }else{
                    $xmlArr = [
                        "code"=>"101",
                        "action"=>"login",
                        "status" => "error",
                        "status_code" => $ls_code_ary["4X006"]
                    ];
                    exit($xml->toXml($xmlArr));
                }
            }

            if(time() - $_SESSION["login_time"] <= 3){ //3秒内
                if($_SESSION["login_num"]>5){//访问5次以上禁止登陆
                    $xmlArr = [
                        "code"=>"101",
                        "action"=>"login",
                        "status" => "error",
                        "status_code" => $ls_code_ary["4X006"]
                    ];
                    $_SESSION["no_login"] = "Y";
                    exit($xml->toXml($xmlArr));
                }else{//5次内记录访问次数
                    $_SESSION["login_num"] += 1;
                }

            }else{//超出3秒恢复初始值
                $_SESSION["login_time"] = time();
                $_SESSION["login_num"] = 1;//次数
            }
        }
        $_p["pwd"] = isset($_p["password"]) ? $_p["password"] : "";
      
		$login = new Login($_p);
        $xmlArr = $login->getLogin();
        $tf = new Transform();
        $tf->getUserCurl(1,$userId);
        $xxnew =  $tf->get_curl_data_uid();
        $xmlArr['newuid'] = $xxnew['uid'];
		exit($xml->toXml($xmlArr));
		break;
    case 'get_out':
        $login = new Login($_p);
        $login->get_out();
        exit("ok");
        break;
	case "chk_email":
	    if($_p["action"] == 1){
            $email = new ChkEmail($_p);
            $sta = $email->vaildateEmail();
            if($sta["status"]=="error"){
                $xmlArr["err_msg"] = $sta["msg"];
            }else{
                $xmlArr = [
                    "alert_msg" => "",
                    "done_msg" => "",
                    "err_msg" => "",
                    "time" => 0,
                    "view" => "",
                ];
                $set = $email->setData();
                if($set["status"]=="error"){
                    $xmlArr["err_msg"] = $sta["msg"];
                }else{
                    $xmlArr["err_msg"] = "";
                }
            }
            exit(json_encode($xmlArr));
        }else{
	        $xmlArr = ["code"=>"error","msg"=>""];
            exit($xml->toXml($xmlArr));
        }
		break;
    case "chg_newpwd":
    case "help_chg_safepwd":
        $acc = new Account($_p);
        $xmlArr = $acc->setPwd();
        header('Content-Type: text/xml');
        exit($xml->toXml($xmlArr));
        break;
    case "mem_chk":
        $acc = new Account($_p);
        $chk = $acc->chk_mem();
        $arr = [];
        $arr["code"] = "";
        $arr["msg"] = isset($chk["code"]) ? $chk["code"] : "N";
        $arr["type"] = isset($chk["msg"]) ? $chk["msg"] : "";
        $arr["LVar"] = "";
        $arr["noDate"] = "";
        if($chk["status"]!="error"){
            $arr["type"] = $ls_code_ary["chgid_ok"];
        }
        //<serverresponse><code></code><msg>N</msg><type>此帐号无人使用。</type><LVar></LVar><noDate></noDate></serverresponse>
        header('Content-Type: text/xml');
        exit($xml->toXml($arr));
        // exit("N;{$ls_code_ary["chgid_ok"]}");
        break;
    case "mem_online"://检测是否在线
        $bs = new Base($_p);
        $guid = $bs->getUID();
        if($guid["status"] == "error"){
            $arr["code"] = "error";
            $arr["msg"] = $guid["msg"];
        }else{
            $arr["msg"] = "OK";
            $bs->chg_member_credit($guid["user"]);
        }
        header('Content-Type: text/xml');
        exit($xml->toXml($arr));
        break;
    case "chg_passwd_safe":
        $acc = new Account($_p);
        $chk = $acc->setLoginName();
        //<serverresponse><code></code><msg>N</msg><str_user>此帐号无人使用。</str_user><chg_long_user>已成功修改登录帐号。~~请回重新登入</chg_long_user><str_user_noDate></str_user_noDate></serverresponse>
        $arr = []; 
        $arr["code"] = "";
        $arr["msg"] = isset($chk["code"]) ? $chk["code"] : "N";
        $arr["type"] = isset($chk["msg"]) ? $chk["msg"] : "";
        if($chk["status"]!="error"){ 
            $arr["str_user"] = $ls_code_ary["chgid_ok"];
            $arr["chg_long_user"] = $ls_code_ary["chgid_complete"];
        }
        header('Content-Type: text/xml');
        exit($xml->toXml($arr));
        break;
    case "get_version":
        $arr = [
            "code" => 666,
            "ver" =>  $ver
        ];
        header('Content-Type: text/xml');
        exit($xml->toXml($arr));
        break;
    case "check_login_domain"://检测新域名
        /*
        p: check_login_domain
        ver: 2021-06-18-01_en10f7b-3ed5-ad58-0617-871ae5576be7
        username: cbq80609
        uid: kxiqqy0wm24375445l134829b1
        langx: zh-cn
        code: 663
        */
        header('Content-Type: text/xml');
        $arr=[
            "code" => 664,
            "new_domain" =>"",
            "now_mode" => "N",
            "login_mid" => ""
        ];
        exit($xml->toXml($arr));
        break;
    case "get_credit_logs":
        $acc = new Account($_p);
        $json = $acc->get_mem_creditlogs();
        exit(json_encode($json));
        break;
    case "features":
        
        $ary_preg_replace[] = ["/var _data ='(.*?)';/s","var _data ='{$data}';"];
        $ary_preg_replace[] = ["/var _data = '(.*?)';/s","var _data = '{$data}';"];
		break;
    case "get_systemTime":
        header('Content-Type: text/xml');
        $arr = [
            "systemtime" => date("Y-m-d H:i:s"),
            "systimestamp" => time()
        ];
        exit($xml->toXml($arr));
        break;
    case "messageget"://弹出公告
        header('Content-Type: text/xml');
        $acc = new Account($_p);
        $xml = $acc->messageget();
        exit($xml);
        break;
    case "get_member_data"://会员资料
        header('Content-Type: text/xml');
        $acc = new Account($_p);
        $arr = $acc->get_member_data();
        exit($xml->toXml($arr));
        break;
    case "checkPassCode"://设置简易密码
        $acc = new Account($_p);
        $arr = $acc->set_passcode();
        exit($xml->toXml($arr));
        break;
    case "memSet":
        $acc = new Account($_p);
        $arr = $acc->memSet();
        exit(json_encode($arr));
        break;
    case "gameModel":
        if($_p["rtype"]=="fs") {
            $game_model = "all_game_fs";
        }else if($_p["rtype"]=="r" && $_p["gtype"] == "ft" && $_p["isSpecial"] == "Y"){
            $game_model = "cup_highlights_game";
            if($_p["isStandings"] == "Y"){
                $game_model = "cup_highlights_game_pai";
            }
            if($_p["isTeam"] == "Y"){
                $game_model = "cup_team_game";
            }
        } else {
            $game_model = "{$_p["gtype"]}_{$_p["showtype"]}_game";

            if ($_p["gtype"] == "ft"){
                if ($_p["showtype"] == 'live' || $_p["showtype"] == 'today' || $_p["showtype"] == 'early' || $_p["showtype"] == 'parlay' || $_p["showtype"] == 'mygame'){
                    $game_model = "{$_p["gtype"]}_{$_p["showtype"]}_{$_p["rtype"]}";
                }


                if ($_p["showtype"] == 'soon' || $_p["showtype"] == 'hot'){
                    $game_model = "{$_p["gtype"]}_{$_p["showtype"]}_game";
                    if(!empty($_p["rtype"]) && $_p["rtype"] != "r" && $_p["rtype"] != "rb" && $_p["gtype"] =="ft"){
                        $game_model = "{$_p["gtype"]}_{$_p["showtype"]}_game_{$_p["rtype"]}";
                    }
                }

                $showtype = $_p["showtype"];
                if ($_p["isSpecial"] == "Y" && $_p["isFantasy"] == "N") {
                    $showtype = 'mygame';
                    $game_model = "{$_p["gtype"]}_{$showtype}_{$_p["rtype"]}";
                }
            }
        }
        
        
        $ary_preg_replace[] = ["/top.game_model = '(.*?)';/s","top.game_model = '{$game_model}';"];
        $fileDir = $game_model;
        break;
    case "right_score":
        $fileDir = $_p["gtype"]."_right_score";
        break;
    case "game_more_FT":
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "ft_{$showtype}_game_more";
        break;
    case "game_more_BK":
        
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "bk_{$showtype}_game_more";
        break;
    case "game_more_TN":
        
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tn_{$showtype}_game_more";
        break;
    case "game_more_VB":
        
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "vb_{$showtype}_game_more";
        break;
    case "game_more_BS":
        
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "bs_{$showtype}_game_more";
        break;
    case "game_more_BM":
        
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "bm_{$showtype}_game_more";
        break;
    case "game_more_SK":
        
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "sk_{$showtype}_game_more";
        break;
    case "game_more_TT":
        
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "tt_{$showtype}_game_more";
        break;
    case "game_more_OP":
        
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "op_{$showtype}_game_more";
        break;
    case "game_more_ES":
        
        $showtype = strtolower($_p["showtype"]);
        $fileDir = "es_{$showtype}_game_more";
        break;
    case "get_betradar":
    case "get_perform":
    case "get_img":
    case "get_mygame":
        $tf = new Transform();
        $tf->getUserCurl(1,$userId); 
        $xx =  $tf->get_curl_data($_p);
        exit($xx);
        break;

    case "get_specialGame_count":
    case "get_league_count":
    case "get_game_list":
    case "get_league_list_All":
    case "get_game_more":
    case "get_league_list_FS":
    case "get_game_list_FS":
    case "get_list_tv":
    case "get_game_OBT":
    case "get_cup_list_FS":
    case "get_cup_list":
        $tf = new Transform();
        $tf->getUserCurl(1,$userId);
        header('Content-Type: text/xml');
        $xx =  $tf->get_curl_data($_p);
        if(empty($xx)){
            $arr = ["status"=>"error","msg"=>"暂无数据"];
        }else{
            if(isset($xx["status"]) && $xx["status"]=="error"){
				 if(isset($xx["code"]) && $xx["code"]=="4X014"){
                    $arr = ["status"=>"error","msg"=>"暂无数据"];
                    exit($xml->toXml($arr));
                }
                $arr = $xx;
            }
        }
        $base = new Base($_p);
        $base->insertLog("赛事页面");

        //
        if(isset($arr)){
            exit($xml->toXml($arr));
        }else{
            exit($xx);
        }
        break;
    case "get_history_data"://账户历史
        header('Content-Type: text/xml');
        $bet = new Bet($_p);
        $xmls = $bet->get_history_data();
        exit($xmls);
        break;
    case "history_switch":
    case "get_history_view":
        header('Content-Type: text/xml');
        $bet = new Bet($_p);
        $xmls = $bet->get_history_view();
        exit($xmls);
        break;
    case "get_todaywagers_count":
        header('Content-Type: text/xml');
        $bet = new Bet($_p);
        $arr = $bet->get_todaywagers_count();
        // LOG::write("get_todaywagers_count", $arr);
        exit($xml->toXml($arr));
        break;
    case "get_today_wagers":
        if (isset($_p['format']) && $_p['format'] == 'json') {
            header('Content-Type: application/json');
            $bet = new Bet($_p);
            $arr = $bet->get_today_wagers_json();
            echo json_encode($arr);
            exit();
        }
        header('Content-Type: text/xml');
        $bet = new Bet($_p);
        $xml = $bet->get_today_wagers();
        exit($xml);
        break;
    case "get_delay_result":
        header('Content-Type: text/xml');
        $xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $xml.= "<serverresponse sip=\"74.145\">";
        $xml.= "<code>635</code>";
        $xml.= "<systime>".date("Y-m-d H:i:s")."</systime>";       
        $gid_str = $_p["gid_str"]; 
        $gid_ary = explode("@",$gid_str);
        if (count($gid_ary) > 1 ){ 
            foreach($gid_ary as $k => $v){ 
                // FT|7994815,7915203,7902937@TN|2300616
                if (!empty($v)){ 
                    $gary = explode("|",$v); 
                    $gids = explode(",",$gary[1]);
                    foreach($gids as $m => $n){ 
                        $xml.= "<game hasGame=\"N\" gtype=\"{$gary[0]}\" cmd_gid=\"{$n}\" delayReason=\"\"/>";
                    }
                }
                
            }
            //
        }
        $xml.= "</serverresponse>";
        exit($xml);
        break;
    case "get_dangerous"://滚球确认注单查询
    case "get_bethold":
        header('Content-Type: text/xml');
        $bet = new Bet($_p);
        $xml = $bet->get_dangerous();
        exit($xml);
        break;
    case "FS_order_view":
    case "Total_order_view":
    case "Other_order_view":
    case "FT_order_view":
        header('Content-Type: text/xml');
        //需要查询玩家资料
        $tf = new Transform();
        $tf->getUserCurl(1,$userId);
        $xx =  $tf->get_curl_data($_p);
        // print_r($xx);
   
        if(empty($xx)){
            $arr = ["status"=>"error","msg"=>"暂无数据"];
        }else{
            if(isset($xx["status"]) && $xx["status"]=="error"){
				  if(isset($xx["code"]) && $xx["code"]=="4X014"){
                    $arr = ["status"=>"error","msg"=>"暂无数据"];
                    exit($xml->toXml($arr));
                }
                $arr = $xx;
            }
        }

        if(isset($arr)){
            exit($xml->toXml($arr));
        }else{
            $bet = new Bet($_p);
            $xmls = $bet->order_view($xx);
            exit($xmls);
        }
        break;
    case "FT_bet":
        //需要查询玩家资料
        $tf = new Transform();
        $tf->getUserCurl(1,$userId);
        header('Content-Type: text/xml');
        $parr = [
            "p" => "FT_order_view",
            "uid" => $_p["uid"],
            "langx" => $_p["langx"],
            "odd_f_type" => $_p["odd_f_type"],
            "gid" => $_p["gid"],
            "gtype" => $_p["gtype"],
            "wtype" => $_p["wtype"],
            "chose_team" => $_p["chose_team"]
        ];
        $xx =  $tf->get_curl_data($parr);
        if(empty($xx)){
            $arr = ["code"=>"570"];
        }else{
            if(isset($xx["status"]) && $xx["status"]=="error"){
				  if(isset($xx["code"]) && $xx["code"]=="4X014"){
                    $arr = ["status"=>"error","msg"=>"暂无数据"];
                    exit($xml->toXml($arr));
                }
                $arr = $xx;
            }
        }
        $order = new Bet($parr);
        $view_xml = $order->order_view($xx);
        $arr = $order->All_bet($view_xml,$_p);
        exit($xml->toXml($arr));
        break;
    case "Other_bet":
        //需要查询玩家资料
        $tf = new Transform();
        $tf->getUserCurl(1,$userId);
        header('Content-Type: text/xml');
        $parr = [
            "p" => "Other_order_view",
            "uid" => $_p["uid"],
            "langx" => $_p["langx"],
            "odd_f_type" => $_p["odd_f_type"],
            "gid" => $_p["gid"],
            "gtype" => $_p["gtype"],
            "wtype" => $_p["wtype"],
            "chose_team" => $_p["chose_team"]
        ];
        $xx =  $tf->get_curl_data($parr);
        // LOG::write("Betxx", $xx);
        if(empty($xx)){
            $arr = ["code"=>"570"];
        }else{
            if(isset($xx["status"]) && $xx["status"]=="error"){
				  if(isset($xx["code"]) && $xx["code"]=="4X014"){
                    $arr = ["status"=>"error","msg"=>"暂无数据"];
                    exit($xml->toXml($arr));
                }
                $arr = $xx;
            }
        }
        $order = new Bet($parr);
        $view_xml = $order->order_view($xx);
        // LOG::write("Betviewxml", $view_xml);
        $arr = $order->All_bet($view_xml,$_p);
        // LOG::write("BetAll_bet", $arr);
        exit($xml->toXml($arr));
        break;
    case "FS_bet":
        $tf = new Transform();
        $tf->getUserCurl(1,$userId);
        header('Content-Type: text/xml');
        $parr = [
            "p" => "FS_order_view",
            "uid" => $_p["uid"],
            "langx" => $_p["langx"],
            "odd_f_type" => $_p["odd_f_type"],
            "gid" => $_p["gid"],
            "gtype" => $_p["gtype"],
            "wtype" => $_p["wtype"],
            "rtype" => $_p["rtype"]
        ];
        $xx =  $tf->get_curl_data($parr);
        if(empty($xx)){
            $arr = ["code"=>"570"];
        }else{
            if(isset($xx["status"]) && $xx["status"]=="error"){
				  if(isset($xx["code"]) && $xx["code"]=="4X014"){
                    $arr = ["status"=>"error","msg"=>"暂无数据"];
                    exit($xml->toXml($arr));
                }
                $arr = $xx;
            }
        }
        $order = new Bet($parr);
        $view_xml = $order->order_view($xx);
        $arr = $order->FS_bet($view_xml,$_p);
        exit($xml->toXml($arr));
        break;
    case "Total_bet":
        header('Content-Type: text/xml');
        $isOk = 0;
        $tf = new Transform();
        $tf->getUserCurl(1,$userId);
        $teamCount = $_p["teamCount"];
        $success = "";//成功注单
        $fail = "";//错误注单
        $delay = "";//延迟注单
        if($teamCount>0){
            $xxs = [];
            for ($tc = 0; $tc < $teamCount; $tc++) {
                $arr = [];
                $post = $_p;
                $bp = $_p["bp_{$tc}"];
                $pp = explode("!", $bp);
                $parr = [
                    "p" => "Other_order_view",
                    "uid" => $_p["uid"],
                    "langx" => $_p["langx"],
                    "odd_f_type" => $_p["odd_f_type"],
                    "gid" => $pp[2],
                    "gtype" => $pp[3],
                    "wtype" => $pp[4],
                    "chose_team" => $pp[6]
                ];
                $failErrorAry = [
                  "gid" => $pp[2],
                  "gtype" => $pp[3]
                ];
                if (strtoupper($pp[3]) == "FT") {
                    $parr["p"] = "FT_order_view";
                }
                $xx = $tf->get_curl_data($parr);
                
                $xxs[] = $xx;
                if (empty($xx)) {
                    $arr = ["code" => "555", "errormsg" => "1X009", "errorvalue" => "读取失败"];
                    $isOk++;
                } else {
                    if (isset($xx["status"]) && $xx["status"] == "error") {
                        $arr = $xx;
                        $arr["code"] = "555";
                        $arr["errorvalue"] = $xx["msg"];
                        $arr["errormsg"] = $xx["msg"];
                        $isOk++;
                    }
                }

                if(count($arr)>0){
                    $fail.= "<betslip id='gid_{$pp[2]}'>";
                    foreach ($failErrorAry as $k =>$v){
                        $fail .= "<{$k}>{$v}</{$k}>";
                    }

                    foreach ($arr as $k => $v) {
                        if ($k != 'nowcredit' && !isset($failErrorAry[$k])) {
                            $fail .= "<{$k}>{$v}</{$k}>";
                        }
                    }
                    $fail .= "</betslip>";
                    continue;
                }

                $code = $tf->getXmlNode($xx, "code");
                if (empty($code) || $code != "501") {
                    $arr = [
                        "code" => $code,
                        "errormsg" => $tf->getXmlNode($xx, "errormsg"),
                        "errorvalue" => $code,
                        "gid"=>$pp[2],
                        "dates" => $tf->getXmlNode($xx, "dates"),
                        "systime" => $tf->getXmlNode($xx, "systime")
                    ];
                    $isOk++;
                }

                if(count($arr)>0){
                    $fail.= "<betslip id='gid_{$pp[2]}'>";
                    foreach ($failErrorAry as $k =>$v){
                        $fail .= "<{$k}>{$v}</{$k}>";
                    }
                    foreach ($arr as $k => $v) {
                        if ($k != 'nowcredit' && !isset($failErrorAry[$k])) {
                            $fail .= "<{$k}>{$v}</{$k}>";
                        }
                    }
                    $fail .= "</betslip>";
                    continue;
                }

                $bet = new Bet($parr);

                $post["golds"] = $pp[1];
                $post["gid"] = $pp[2];
                $post["gtype"] = $pp[3];
                $post["wtype"] = $pp[4];
                $post["rtype"] = $pp[5];
                $post["chose_team"] = $pp[6];
                $post["ioratio"] = $pp[7];
                $post["con"] = $pp[8];
                $post["ratio"] = $pp[9];
                $post["isRB"] = $pp[10];
                $post["imp"] = $pp[11];
                $view_xml = $bet->order_view($xx);
                $arr = $bet->All_bet($view_xml, $post);
                if($arr["code"]!="560"){
                    $fail.= "<betslip id='gid_{$pp[2]}'>";
                    foreach ($failErrorAry as $k =>$v){
                        $fail .= "<{$k}>{$v}</{$k}>";
                    }
                    foreach ($arr as $k => $v) {
                        if ($k != 'nowcredit' && !isset($failErrorAry[$k])) {
                            $fail .= "<{$k}>{$v}</{$k}>";
                        }
                    }
                    $fail .= "</betslip>";
                }else{
                    $success .= "<betslip id='gid_{$pp[2]}'>";
                    foreach ($arr as $k => $v) {
                        if ($k != 'nowcredit') {
                            $success .= "<{$k}>{$v}</{$k}>";
                        }
                    }
                    $success .= "</betslip>";
                }


            }
        }
        if(!empty($success)){//成功注单
            $success = "<success>{$success}</success>";
        }

        if(!empty($fail)){//下注失败注单
            $fail = "<fail>{$fail}</fail>";
        }
        $success.= $fail;


        //串关下注
        $arr = [];
        $success.= "<parlay>";
        if(!isset($_p["bp_p3"])){
            $success.= "noBet";
            if($isOk == $teamCount){//所有单注都错误
                $arr = [];
                $arr["code"] = 555;
                $arr["errorvalue"] = $arr["errormsg"];
                $arr["errormsg"] = "betError000";
                exit($xml->toXml($arr));
            }
        }else{
            // print_r($_p["bp_p3"]);exit;
            $bet = new Bet($_p);
            $bp_p3 = $_p["bp_p3"];
            //10cc97f7c046cc4c881629158e09002f70234daecacdf38a8edba6979baecba8@P3@1@FT@4914247!MH!H!0!1340!1.33!2021-07-19^4914257!PRH!H!0!-50!1.93!2021-07-19^4921824!HPOUC!H!1!50!1.92!2021-07-19^4903056!HPOUC!H!1!0!1.89!2021-07-19^@100@
            $bps = explode("@",$bp_p3);
            $arr = $bet->All_bet_p3($userId);


            if(is_array($arr)){
                if($arr["errormsg"]=="1X034"){
                    $success.= "<code>555</code>";
                    $success.= "<errormsg>1X034</errormsg>";
                    foreach ($arr["errorGame"] as $gg){
                        $success.="<errorGame>{$gg}</errorGame>";
                    }
                }else {
                    $xml_arr = $xml->toXml($arr);
                    $success .= $tf->getXmlNode($xml_arr, "serverresponse");

                }
                $success.="<gtype>{$bps[3]}</gtype>";
                $isOk++;

            }else{
                $success.= $arr;
            }


        }
        $success.= "</parlay>";
        $bs = new Base($_p);
        $urs = $bs->getUID();
        $nowcredit = 0;
        if($urs["status"]=="success"){
            $nowcredit = $urs["user"]["balance_credit"];
        }
        $xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
        $xml.= "<serverresponse>";
        $xml.= "<nowcredit>{$nowcredit}</nowcredit>";
        $xml.= $success;
        $xml.= "</serverresponse>";
        exit($xml);
        break;
    case "get_account_set":
        header('Content-Type: text/xml');
        $order = new Order($_p);
        $arr = $order->get_account_set();
        exit($xml->toXml($arr));
        break;
    //TODO:mq30
    case "get_page_count":
        header('Content-Type: text/xml');
        $tf = new Transform();
        $tf->getUserCurl(1,$userId);
        $xx =  $tf->get_curl_data($_p);
        exit($xx);
        break;
    case "loadDomain":
        exit("");
        break;
    // default:
    //     echo $_p["p"];
    //     error_400();exit;
    //     break;
}

//读取html内容 

// $filename = $fileDir."&{$langx}.html";  
$filename = getparm().".html";
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
    $html = $acf->curlOther($filename,$_p);
    if(empty($html)){
        echo $_p["p"];
        error_400(); 
        exit;
    }
}else{
    $html = getFileTxt($index_path);
}
//getDataMT 还得观察  today json观察
//批量替换内容 

if (strpos($html, "p=getDataMT") !== false) { //直播 
    $rs = $db_s->select("SELECT `uid` FROM ".Constant::VIEW_CLIENT_CURL." WHERE `status`='ok' LIMIT 1","Row");
    if(!empty($rs)){ 
        $ary_preg_replace[] = ["/par\+\=\"&uid=\"\+top\[\"userData\"\]\.uid;/s",'par+="&uid='.$rs["uid"].'";'];
    }
}


$a = array_column($ary_preg_replace,0);
$b = array_column($ary_preg_replace,1);
$html = preg_replace($a,$b,$html);
$ts = isset($_p["ts"]) ? $_p["ts"] : "";
$html = preg_replace("/\<script id=\"ts\">(.*?)\<\/script>/is",'<script id="ts">'.$ts.'</script>',$html);
print_r($html);
exit;
?>