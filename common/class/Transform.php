<?php
/**
 * Transform 数据采集
 */

class Transform
{
    private $url = '';//采集地址
    private $curl;//curl类
    private $langx = '';//语言
    private $cookie = '';//cookie
    private $globalPost = [];//全局post参数
    public  $web = [];//采集数据
    private $ltype = 3;
    public  $ctype = 1;
    private $ver = "";//版本号
    private $dbc;
    private $dbs;
    private $userId = 0;


    /**
     * Transform constructor.
     * @param $url 采集网址
     * @param $langx 语言
     */
    public function __construct($url="",$langx="zh-cn",$userId=0)
    {
        global $db_c,$db_s;
        $this->url = $url;
        $this->langx  = $langx;
        $this->userId = $userId;
        $this->curl = new Curl_HTTP_Client();
        $this->curl->set_user_agent("Mozilla/5.0 (Windows NT 6.1; Win64; x64)");
        $this->ver = date("Y-m-d-H")."_e2a70f7b-3ed5-ad58-".date("md")."-271au2576be7";
        $this->globalPost = [
            "p" => "",
            "ver" => $this->ver,
            "langx" => $this->langx
        ];
        $this->dbc = $db_c;
        $this->dbs = $db_s;
        
        
    }


    /**
     * 获取采集账号
     * @param int $ctype  1:前端采集 2:后端采集
     * @Param int $code   采集编号
     */
    public function getUserCurl($ctype="",$code=0) {  
        if($ctype == ""){  $ctype = $this->ctype; }
        $view = Constant::VIEW_CLIENT_CURL;
        $typeName = "前端";
        if ($ctype != 1){ 
            if(!is_int($ctype) || $ctype <= 1){
                $ctype = 2;
                $typeName = "后端";
            }
            $view = Constant::VIEW_SEVER_CURL;
        }
        
        $rs = $this->dbc->select("SELECT * FROM ".$view." WHERE `ctype`={$ctype}","All"); 
        if (count($rs) == 0 ) { 
            if($ctype==2){ 
                print_r("无可用的采集UID...\n");
                return ["code"=>10001,"msg"=>$typeName."无可采集账号!!!"];
            } else { 
                $view = Constant::T_UID;
                $rr = $this->dbc->select("SELECT * FROM ".$view." WHERE `id`=1","Row");
                $this->web = $rr;
                $this->url = $this->web["url"];
            }
            
        }else{ 
            $count = count($rs); 
            $i = 0;
            if ($code > 0) { 
                $i = $code % $count;
            }
			$i = rand(0,count($rs)-1);
            // print_r("key=".$i."/n");
            $this->web = $rs[$i];
            $this->url = $this->web["url"];
            if(!empty($this->web["ver"])){//设置版本
                $this->ver = $this->web["ver"];
                $this->globalPost["ver"] = $this->web["ver"];
            }
            return ["code"=>10000];
        }

    }

    /**
     * 设置默认采集账号
     * @param $conn 采集账号配置
     */
    public function setDefaultWeb($conn){
        $this->web = $conn;
        $this->url = $conn["url"];
        if(!empty($conn["ver"])){//设置版本
            $this->ver = $conn["ver"];
            $this->globalPost["ver"] = $conn["ver"];
        }
    }


    /**
     * 获取Xml节点值
     * @param $xml
     * @param $str
     * @return mixed
     */
    public function getXmlNode($xml,$str){
        preg_match("/\<{$str}>(.*?)\<\/{$str}>/is",$xml,$arr);
        return isset($arr[1]) ? rtrim($arr[1]) : "";
    }

    /**
     * @param array $post post参数
     * @return bool|string
     */
    public function curlXml($post=[]){
        if(!empty($this->cookie)){
            $this->curl->set_cookie($this->cookie);
        }
        $this->curl->set_referrer($this->url);
        // print_r($post);exit;
		$urls = $this->url;
        if($post['p']=='get_game_list'&&$post['showtype']=='live'){
            $urls='http://mem2.vkchga.top/';
        }
        if($post['p']=='get_league_count'){
            $urls='http://mem2.vkchga.top/';
        }
                if($post['p']=='get_specialGame_count'){
            $urls='http://mem2.vkchga.top/';
        }
        $xml=$this->curl->send_post_data($urls."/transform.php",$post,"",5);
		//print_r($xml);

        return $xml;
    }

    /**
     * 关闭curl
     */
    public function close(){
        //$this->curl->close();
    }

    public function messageget($langx="zh-cn"){
        $ary = $this->globalPost;
        $ary["p"] = "messageget";
        $ary["uid"] = $this->web["uid"];
        $ary["langx"] = $langx;
        $ary["username"] = $this->web["user"];
        $ary["select_date"] = -4;
        $ary["t_important"] = 0;
        $xml = $this->curlXml($ary);
        preg_match_all("/\<game id=\"(.*?)\">(.*?)\<\/game>/is",$xml,$msg);
        $arr = [];
        if(isset($msg[2]) && count($msg[2])>0){
            foreach ($msg[2] as $k => $v){
                $msg = $this->getXmlNode($v,"msg");
                $dd = [
                    "adddate" => $this->getXmlNode($v,"adddate"),
                    "msg" => $msg,
                    "sha1" => sha1($msg)
                ];
                $arr[] = $dd;
            }
        }
        return $arr;
    }

    /**
     * 采集线路检测
     * @param string $url 网址
     */
    public function chkUrl($url=""){
        if(empty($url)){
            $url = $this->url;
        }
        
    
        $html = $this->curl->send_post_data($url."/index.php",["detection"=>"Y"],"",5);
    
        if(strpos($html,'id="scroll_body"') !== false){
            preg_match("/top\.ver = \'(.*?)\'/is",$html,$vers);
            $ver = isset($vers[1]) ? $vers[1] : "";
            return ["status"=>"ok","ver"=>$ver];
        }
        //<tt id="reg_time_zh">2021年11月4日13:00:00~18:00:00</tt>
        preg_match("/\<tt id=\"reg_time_zh\">(.*?)\<\/tt>/is",$html,$wh);

        if(isset($wh[1]) && !empty($wh[1])){ //系统维护
            $a = ["年","月","日"];
            $b = ["-","-"," "];
            $maintain_time = str_replace($a,$b,$wh[1]);
            return [
                "status"=>"ok",
                "maintain_sw" => "Y",
                "maintain_time" => $maintain_time
            ];
        }


        /*if(strpos($html,'return document.location.protocol;') !== false){ //添加网址协议
            $this->url = str_replace("http://","https://",$this->url);
            preg_match("/top\.ver = \'(.*?)\'/is",$html,$vers);
            $ver = isset($vers[1]) ? $vers[1] : "";
            return ["status"=>"ok","ver"=>$ver];
        }*/
        return ["status"=>"error"];

    }

    /**
     * 登陆验证 获取UID
     * @param $user 用户名
     * @param $pwd 密码
     * @return string[]
     */
    public function login($user,$pwd){
        $ary = $this->globalPost;
        $ary["p"] = "chk_login";
        $ary["username"] = $user;
        $ary["password"] = $pwd;
        $ary["app"] = "N";
        $ary["auto"] = "IAIHGD";
        $ary["blackbox"] = "";
        $ary["userAgent"] = "TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzNS4wLjAuMCBTYWZhcmkvNTM3LjM2";
        $xml =  $this->curlXml($ary);

//         p: chk_login
// langx: zh-cn
// ver: 2025-07-31-4pwdFix_109
// username: jfi0016
// password: Abcd1234
// app: N
// auto: IAIHGD
// blackbox: 
// userAgent: TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgMTAuMDsgV2luNjQ7IHg2NCkgQXBwbGVXZWJLaXQvNTM3LjM2IChLSFRNTCwgbGlrZSBHZWNrbykgQ2hyb21lLzEzNS4wLjAuMCBTYWZhcmkvNTM3LjM2
        $this->close();
        
        preg_match("/\<status>(.*?)\<\/status>/is",$xml,$status);
        if(count($status)==2 && $status[1] == 200){
            $arr = ["status"=>"ok"];
            //<mid>23925249</mid><uid>xw4p71t0m23925249l83211b1</uid><domain></domain>
            $arr["mid"] = $this->getXmlNode($xml,"mid");
            $arr["uid"] = $this->getXmlNode($xml,"uid");
            $url = $this->getXmlNode($xml,"domian");
            $arr["url"] = empty($url) ? $this->url : $url;
        }else{
            $arr = ["status"=>"error"];
            preg_match("/\<msg>(.*?)\<\/msg>/is",$xml,$msgs);
            if(isset($msgs[1])){
                $arr["msg"] = "[code:{$msgs[1]}]";
                switch ($msgs[1]){
                    case "101":
                    case "103":
                        $arr["msg"].= $this->getXmlNode($xml,"code_message");
                        break;
                    case "102":
                        $arr["msg"].= "密码错误次数过多。";
                        break;
                    case "105":
                        $arr["msg"].= "帐号或密码不正确。";
                        break;
                    case "107"://网路过慢，请重新登入
                        $this->login($user,$pwd);
                        break;
                }
            }else{
                $arr["msg"] = "登陆失败,请检查线路或者账号密码。";
            }
        }
        return $arr;
    }

    public function get_game_more($p=[],$langx="zh-cn"){
        $ary = $this->globalPost;
        $ary["p"] = "get_game_more";
        $ary["uid"] = $this->web["uid"];
        $ary["langx"] = $langx;
        $ary["showtype"] = isset($p["showtype"]) ? $p["showtype"] : "today";
        /*$ary["rtype"] = isset($p["rtype"]) ? strtolower($p["rtype"]) : "r";*/
        $ary["gtype"] = isset($p["gtype"]) ? strtolower($p["gtype"]) : "ft";
        $ary["ltype"] = $this->ltype;
		$ary["from"] = "game_more";
		
        $ary["lid"] = $p["lid"];
        $ary["isRB"] = $p["isRB"];
        if($ary["gtype"] == "es"){ //电竞
            $ary["peid"] = $p["peid"];
            $ary["mode"] = $p["mode"];
            $ary["filter"] = $p["filter"];
            $ary["outerGameNum"] = $p["outerGameNum"];
            $ary["type"] = $p["type"];
        }
        
        $ary["specialClick"] = "";
        switch (strtoupper($p["gtype"])){
            case "FT":
            case "FU":
                $ary["ecid"] = $p["ecid"];
                break;
            default:
                $ary["gid"] = $p["gid"];
                break;
        }
        // print_r($ary);exit;
        $xml = $this->curlXml($ary);
        return $xml;
    }



    /**
     * 获取采集线路
     * @param string $login
     * @return bool|string
     */
    public function service_mainget($login="Y"){
        $ary = $this->globalPost;
        $ary["login"] = $login;
        $ary["p"] = "service_mainget";
        $xml =  $this->curlXml($ary);
        return $xml;
    }

    /*public function check_login_domain(){
        $ary = $this->globalPost;
        $ary["p"] = "check_login_domain";
        $ary["username"] = "";
        $ary["code"] = 663;
        $ary["uid"] = $this->web["uid"];
        $ary["mid"] = $this->web["mid"];
    }*/

    /**
     * 获取账号金额/判断uid是否失效
     */
    public function get_member_data(){
        $ary = $this->globalPost;
        $ary["p"] = "get_member_data";
        $ary["uid"] = $this->web["uid"];
        $ary["change"] = "credit";
        $xml = $this->curlXml($ary);
        return $xml;
        //change: credit
    }

    /**
     * 冠军league列表
     * @param $gtype
     * @param string $langx
     * @return bool|string
     */
    public function get_league_list_FS($gtype,$langx="zh-cn"){
        $ary = $this->globalPost;
        $ary["p"] = "get_league_list_FS";
        $ary["langx"] = $langx;
        $ary["uid"] = $this->web["uid"];
        $ary["gtype"] = $gtype;
        $ary["FS"] = "Y";
        $ary["showtype"] = "fu";
        $ary["specialClick"] = "";
        $xml = $this->curlXml($ary);
        return $xml;
    }

    /**
     * 冠军赛事接收
     * @param $gtype
     * @param $gid
     * @param $langx
     * @param string $date
     * @return bool|string
     */
    public function get_game_list_FS($gtype,$gid,$langx,$date=''){
        $ary = $this->globalPost;
        $ary["p"] = "get_game_list_FS";
        $ary["langx"] = $langx;
        $ary["uid"] = $this->web["uid"];
        $ary["gtype"] = $gtype;
        $ary["showtype"] = "FU";
        $ary["rtype"] = "fs";
        $ary["league_id"] = $gid;
        $ary["date"] = $date;
        $ary["special"] = "";
        return $this->curlXml($ary);
    }

    /**
     * 赛事数据采集
     * @param array $p
     * @param string $langx
     * @return bool|string
     */
    public function get_game_list($p=[],$langx="zh-cn"){
        $ary = $this->globalPost;

        $ary["p"] = "get_game_list";
        $ary["uid"] = $this->web["uid"];
        $ary["p3type"] = isset($p["p3type"]) ? $p["p3type"] : "";
        $ary["date"] = isset($p["date"]) ? $p["date"] : "";
        $ary["showtype"] = isset($p["showtype"]) ? $p["showtype"] : "today";
        $ary["rtype"] = isset($p["rtype"]) ? strtolower($p["rtype"]) : "r";
        $ary["gtype"] = isset($p["gtype"]) ? strtolower($p["gtype"]) : "ft";
        $ary["ltype"] = $this->ltype;
        if(isset($p["lid"])){$ary["lid"] = $p["lid"];}
        if(isset($p["action"])){$ary["action"] = "clickCoupon";}
        $ary["sorttype"] = isset($p["sorttype"]) ? strtoupper($p["sorttype"]) : "L";
        $ary["specialClick"] = isset($p["specialClick"]) ? $p["specialClick"] : "";
        if(isset($p["target"])){$ary["target"] = $p["target"];}
        $ary["langx"] = $langx;
        $ary["isFantasy"] = "N";
        $ary["ts"] = get_timestamp_millisecond();//时间戳:毫秒

        //获取lib
        $leagueAry = [];
        $leagueAry["gtype"] = strtoupper($ary["gtype"]);
        $leagueAry["showtype"] = "ft";
        $leagueAry["date"] = $ary["date"];
        $leagueAry["nocp"] = "N";
        switch ($ary["showtype"]){
            case "today":
                $leagueXml = $this->get_league_list_All($leagueAry);
                preg_match("/\<coupon id='1'>(.*?)\<\/coupon>/is",$leagueXml,$matchs);
                if(count($matchs)>0){
                    $ary["lid"] = $this->getXmlNode($matchs[1],"lid");
                }

                break;
            case "parlay"://过关
                $leagueAry["showtype"] = "p3";
                $leagueXml = $this->get_league_list_All($leagueAry);
                switch ($ary["gtype"]){
                    case "ft":
                        preg_match("/\<coupon id='2'>(.*?)\<\/coupon>/is",$leagueXml,$matchs);
                        break;
                    default:
                        preg_match("/\<coupon id='1'>(.*?)\<\/coupon>/is",$leagueXml,$matchs);
                        break;
                }

                if(count($matchs)>0){
                    $ary["lid"] = $this->getXmlNode($matchs[1],"lid");
                }
                break;
            case "early"://早盘
                $leagueAry["showtype"] = "fu";
                $leagueXml = $this->get_league_list_All($leagueAry);
                preg_match("/\<coupon id='1'>(.*?)\<\/coupon>/is",$leagueXml,$matchs);
                if(count($matchs)>0){
                    $ary["lid"] = $this->getXmlNode($matchs[1],"lid");
                }
                break;
        }
        if(strtoupper($p["gtype"]) == "FT"){ 
            $ary["filter"] = strtoupper($p["gtype"]);
        }
        $ary["cupFantasy"] = "N";
        
        // $ary = [
        //     1"uid"=>$this->web["uid"],
        //     1"ver"=>"2025-09-10-c1bug_115",
        //     1"langx"=>"zh-cn",
        //     1"p"=>"get_game_list",
        //     1"p3type"=>"",
        //     1"date"=>"",
        //     1"gtype"=>"ft",
        //     1"showtype"=>"today",
        //     1"rtype"=>"r",
        //     1"ltype"=>3,
        //     "filter"=>"FT",
        //     "cupFantasy"=>"N",
        //     1"sorttype"=>"L",
        //     1"specialClick"=>"",
        //    1"isFantasy"=>"N",
        //     1"ts"=>get_timestamp_millisecond() //时间戳:毫秒
        // ];
        // print_r($ary);exit;
        $xml = $this->curlXml($ary);
        if($ary["showtype"]=="pd"){
            print_r($xml);exit;
        }
        return $xml;
    }

    /**
     * 读取官网数据
     * @param array $p
     * @return bool|string|string[]
     */
    public function get_curl_data($p=[]){
        if(!isset($this->web["uid"]) || empty($this->web["uid"])){
            Log::write("KICK_UPSTREAM", [
                "reason"     => "web_uid_empty",
                "p"          => isset($p["p"]) ? $p["p"] : "",
                "upstream"   => $this->url,
                "member_uid" => isset($p["uid"]) ? $p["uid"] : "",
                "ip"         => isset($_SERVER["REMOTE_ADDR"]) ? $_SERVER["REMOTE_ADDR"] : "",
            ]);
            return ["status"=>"error","msg"=>"UID为空"];
        }
        $ary = $p;
        $ary["p"] = $p["p"];
        $ary["ver"] = $this->globalPost["ver"];
        $ary["uid"] = $this->web["uid"];

        // $ary["ts"] = $this->web["ts"];
        // print_r($ary);exit;

        $xml = $this->curlXml($ary);

        // 诊断：上游把踢线码(4X014/doubleLogin/goHome)透传回来时记录
        if(is_string($xml) && (strpos($xml,"4X014")!==false || strpos($xml,"doubleLogin")!==false || strpos($xml,"goHome")!==false)){
            Log::write("KICK_UPSTREAM", [
                "reason"     => "upstream_kick_passthrough",
                "p"          => isset($p["p"]) ? $p["p"] : "",
                "upstream"   => $this->url,
                "web_uid"    => isset($this->web["uid"]) ? $this->web["uid"] : "",
                "web_user"   => isset($this->web["user"]) ? $this->web["user"] : "",
                "member_uid" => isset($p["uid"]) ? $p["uid"] : "",
                "resp"       => substr(preg_replace("/\s+/"," ",$xml),0,600),
                "ip"         => isset($_SERVER["REMOTE_ADDR"]) ? $_SERVER["REMOTE_ADDR"] : "",
            ]);
        }
        return $xml;
    }

    /**
     * 读取官网HTML
     * @param array $p
     * @return bool|string|string[]
     */
    public function get_curl_data_html($p=[]){
        // if(!isset($this->web["uid"]) || empty($this->web["uid"])){
        //     return ["status"=>"error","msg"=>"UID为空"];
        // }
        $ary = $p;
        $ary["p"] = $p["p"];
        $ary["ver"] = $this->globalPost["ver"];
        $ary["uid"] = isset($this->web["uid"]) ? $this->web["uid"] : "";

        // $ary["ts"] = $this->web["ts"];

        $xml = $this->curlXml($ary);
        return $xml;
    }

    /**
     * 读取官网数据
     * @param array $p
     * @return bool|string|string[]
     */
    public function get_curl_data_uid($p=[]){
        if(!isset($this->web["uid"]) || empty($this->web["uid"])){
            return ["status"=>"error","msg"=>"UID为空"];
        }
        $ary = $p;
        $ary["uid"] = $this->web["uid"];
        return $ary;
    }
    /**
     * 联盟列表采集
     * @param array $p
     * @return bool|string
     */
    public function get_league_list_All($p=[]){
        $ary = $this->globalPost;
        $ary["p"] = "get_league_list_All";
        $ary["uid"] = $this->web["uid"];
        $ary["gtype"] = isset($p["gtype"]) ? $p["gtype"] : "FT";
        $ary["showtype"] = isset($p["showtype"]) ? strtolower($p["showtype"]) : "ft";
        $ary["date"] = isset($p["date"]) ? $p["date"] : "all";
        $ary["nocp"] = isset($p["nocp"]) ? $p["nocp"] : "N";
        $ary["FS"] = isset($p["FS"]) ? $p["FS"] : "N";
        return $xml = $this->curlXml($ary);
    }

    public function get_result(){
        $ary = [
            "p" => "get_result",
            "login_layer" => "ag",
            "uid" => $this->web["uid"],
            "ver" => "version-12-29",
            "langx" => "zh-cn",
            "session" => "",
            "gtype" => "FT",
            "date" => "2021-4-8",
            "league_id" => "all"
        ];

        $this->curl->set_referrer($this->url);
        $xml=$this->curl->send_post_data("https://ag.hga030.com/transform.php",$ary,"",10);
        print_r($xml);exit;
        return $xml = $this->curlXml($ary);
    }
	/**
     * 世界杯赛事接收
     * @param string $gtype 球类
     * @param string $gid 联赛ID
     * @param string $langx 语言
     * @param string $date 日期
     * @return bool|string
     */
    public function get_game_list_FS_all($gtype,$gid,$langx,$date=''){
        $ary = $this->globalPost;
        $ary["p"] = "get_game_list_FS";
        $ary["langx"] = $langx;
        $ary["uid"] = $this->web["uid"];
        $ary["gtype"] = $gtype;
        $ary["showtype"] = "FU";
        $ary["search"] = "all";
        $ary["rtype"] = "fs";
        $ary["league_id"] = $gid;
        $ary["date"] = $date;
        $ary["special"] = "";
        return $this->curlXml($ary);
    }
}
