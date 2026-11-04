<?php
/**
 * Transform 数据采集
 */

class TransformAG
{
    private $url = '';//采集地址
    private $curl;//curl类
    private $langx = '';//语言
    private $cookie = '';//cookie
    private $globalPost = [];//全局post参数
    private $web = [];//可用的UID集
    private $ltype = 3;
    private $ver = "";//版本号
    private $login_layer;
    private $layer_id =0;
    private $user_id = 0;

    /**
     * Transform constructor.
     * @param $url 采集网址
     * @param $langx 语言
     */
    public function __construct($url="",$langx="zh-cn",$ver="",$login_layer="mem")
    {
        $this->url = $url;
        $this->langx  = $langx;
        $this->curl = new Curl_HTTP_Client();
        $this->curl->set_user_agent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36");
        if(!empty($url)){
            $this->curl->set_referrer($url);
        }

    
        $this->ver = empty($ver) ? date("Y-m-d-H")."_e2a70f7b-3ed5-ad58-".date("md")."-271au2576be7" : $ver;
        $this->globalPost = [
            "p" => "",
            "ver" => $this->ver,
            "langx" => $this->langx
        ];
        $this->login_layer = $login_layer;
    }



    /**
     * 随机选取可用的采集账号
     * @param $webdb
     * @param $type after:后端采集账号组,front:前端采集账号组
     * @return false|mixed
     */
    public function randUser($code = 0){
        global $db_s;
        $table = Constant::T_AGUID;
        $rs = $db_s->select("SELECT * FROM {$table} WHERE `status`=1");
        $arr = [];
        if($rs && count($rs) > 0){
            $count = count($rs); 
            
            $i = 0;
            if ($code > 0) { 
                $i = $code % $count;
            }
            
            $this->setDefaultWeb($rs[$i]);
        }else{
            $rs = $db_s->select("SELECT * FROM {$table} LIMIT 1","Row");
            $this->setDefaultWeb($rs);
            print_r("curl name null\n");
        }
    }

    /**
     * 设置默认采集账号
     * @param $conn 采集账号配置
     */
    public function setDefaultWeb($conn){
        $this->web = $conn;
        $this->url = $conn["url"];
        $this->user_id = $conn["user_id"];
        $this->layer_id = $conn["layer_id"];
        if(!empty($conn["ver"])){//设置版本
            $this->ver = $conn["ver"];
            $this->globalPost["ver"] = $conn["ver"];
        };
        $this->cookie = $conn["cookie"];
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
        $this->curl->set_referrer($this->web["url"]);
        $xml=$this->curl->send_post_data($this->web["url"]."/transform.php?ver=".$this->ver,$post,"",10);
        return $xml;
    }

    

    /**
     * 关闭curl
     */
    public function close(){
        $this->curl->close();
    }

    public function xmlOrArray(){

    }

    /**
     * 采集线路检测
     * @param string $url 网址
     */
    public function chkUrl($url=""){
        if(empty($url)){
            $url = $this->url;
        }

        $html = $this->curl->send_post_data($url,["detection"=>"Y"],"",10);
        preg_match("/\<tt id=\"reg_time_zh\">(.*?)\<\/tt>/s",$html,$wh_date);//页面内部是否维护
        if(isset($wh_date[1])){
            return ["status"=>"ok","maintain_sw"=>"Y","maintain_time"=>$wh_date[1]];
        }

        $html = $this->curl->send_post_data($url."/index.php",["detection"=>"Y"],"",10);
        if(strpos($html,'top.ver') !== false){
            preg_match("/top\.ver = \'(.*?)\'/is",$html,$vers);
            $ver = isset($vers[1]) ? $vers[1] : "";
            return ["status"=>"ok","ver"=>$ver];
        }

        if(strpos($html,'return document.location.protocol;') !== false){ //添加网址协议
            $this->url = str_replace("http://","https://",$this->url);
            preg_match("/top\.ver = \'(.*?)\'/is",$html,$vers);
            $ver = isset($vers[1]) ? $vers[1] : "";
            return ["status"=>"ok","ver"=>$ver];
        }

        return ["status"=>"error"];

    }

    public function getCookie($post) { 
        
    }

    /**
     * 登陆验证 获取UID
     * @param $user 用户名
     * @param $pwd 密码
     * @return string[]
     */
    public function login($user,$pwd){
        $ary = $this->globalPost;
        $ary["p"] = "login_chk";
        $ary["username"] = $user;
        $ary["login_layer"] = $this->login_layer;
        $ary["pwd"] = $pwd;
        $ary["pwd_safe"] = "none";
        $ary["uid"] ="";
        $ary["auto"] = "GZECIC";

		$this->curl->set_curlopt_header(1);
        $str=$this->curl->send_post_data($this->web["url"]."/transform.php?ver=".$this->ver,$ary,"",10);
        
        preg_match_all("/{(.*?)}/is",$str,$json);
        if(count($json[0])==0){
            $res["status"] = "error";
            $res["msg"] = "登陆失败!";
            return $res;
        }
        
        $arr = json_decode($json[0][0],true);
        if (!isset($arr["code"])) { //需要验证码
            $arr = json_decode($json[0][0]."}",true);
        }
        $res = [];
        if($arr["code"]=="102"){
            if($arr["status"]=="success"){
                $res["status"] = "success";
                $res["uid"] = $arr["uid"];
                $res["layer_id"] = $arr["layer_id"];
                $res["user_id"] = $arr["user_id"];
                preg_match_all("/Set-Cookie: ag_".$arr["user_id"]."_v=(.*?);/is",$str,$cookies);
                
                if (count($cookies[1])>0){ 
                    $res["cookie"] = "ag_".$arr["user_id"]."_v=".$cookies[1][0]; 
                }
            }else{
                $res["status"] = "error";
                $res["msg"] = "账号或密码错误";
            }
        }else if($arr["code"]=="201" && isset($arr["is_check"]) && $arr["is_check"]=="Y"){
            $res["status"] = "error";
            $res["msg"] = "需要验证码";
        }else{
            $res["status"] = "error";
            $res["msg"] = "链接失败!!";
        }

        return $res;

    }
	
	public function convertASCIItoHex($asciiString) {
		$hex = "";
		$tempHex="";
		$asciiStringArr=explode("",$asciiString);
		foreach($asciiStringArr as $enc_str){
			$str=substr($enc_str,0,1);
			$tempHex = $this->get_bianma($str);
			$hex = $hex . $tempHex;
		}
		$hex = trim($hex);
		return $hex;
	}
	
	public function get_bianma($str)//等同于js的charCodeAt()  
	{  
		$result = array();  
		for($i = 0, $l = mb_strlen($str, 'utf-8');$i < $l;++$i)  
		{  
			$result[] = $this->uniord(mb_substr($str, $i, 1, 'utf-8'));  
		}  
		return join(",", $result);  
	}  
	public function uniord($str, $from_encoding = false)  
	{  
		$from_encoding = $from_encoding ? $from_encoding : 'UTF-8';  
		if (strlen($str) == 1)  
			return ord($str);  
		$str = mb_convert_encoding($str, 'UCS-4BE', $from_encoding);  
		$tmp = unpack('N', $str);  
		return $tmp[1];  
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

  /*  public function check_login_domain(){
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
    public function get_online_mem(){
        $ary = $this->globalPost;
        // $ary["p"] = "get_online_mem";
        // $ary["uid"] = $this->web["uid"];
        // $ary["login_layer"] = $this->login_layer;
        // $ary["layer_id"] = $this->web["layer_id"];
        // $ary["chk_mem"] = "Y";
        // $arr = json_decode($this->curlXml($ary),true);
        // if(isset($arr["memCount"])){ 
        //     return ["status"=>"success"];
        // }else{
        //     return ["status"=>"error"];
        // }

        $ary["p"] = "get_announcement";
        $ary["uid"] = $this->web["uid"];
        $ary["login_layer"] = $this->login_layer;
        $ary["announcement"] = "count";
        $arr = json_decode($this->curlXml($ary),true);
        if(isset($arr["count"])){ 
            return ["status"=>"success"];
        }else{
            return ["status"=>"error"];
        }
        //change: credit
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
        $ary["lid"] = isset($p["lid"]) ? $p["lid"] : "";
        $ary["action"] = isset($p["action"]) ? $p["action"] : "clickCoupon";
        $ary["sorttype"] = isset($p["sorttype"]) ? strtoupper($p["sorttype"]) : "L";
        $ary["specialClick"] = isset($p["specialClick"]) ? $p["specialClick"] : "";
        $ary["target"] = isset($p["target"]) ? $p["target"] : "";
        $ary["langx"] = $langx;
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
            return ["status"=>"error","msg"=>"UID为空"];
        }
        $ary = $p;
        $ary["p"] = $p["p"];
        $ary["ver"] = $this->globalPost["ver"];
        $ary["uid"] = $this->web["uid"];
        $xml = $this->curlXml($ary);
        //print_r($xml);exit;
        return $xml;
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

    /**
     * 账号解封
     */
    public function longerr_Edit($mid){
        $ary = [
            "p" => "longerr_Edit",
            "login_layer" => "ag",
            "uid" => $this->web["uid"],
            "langx" => "zh-cn",
            "level" => "members",
            "user_id"=> $mid,
            "pay_type" => 0
        ];
// p: longerr_Edit
// login_layer: ag
// uid: 22a0dc9dm12068008l763734970xw
// langx: zh-cn
// level: members
// user_id: 38483451
// pay_type: 0
        return $this->curlXml($ary);
    }

    public function get_result($p,$langx="zh-cn"){
        $date = date("Y-m-d",time()-$p["time"]);
        if($date == date("Y-m-d")){
            $date = "today";
        }  
             
        $ary = [
            "login_layer" =>  "ag",
            "uid"=>$this->web["uid"],
            "langx"=> "zh-cn",
            "ver"=> empty($this->web["ver"]) ? "version-12-29" : $this->web["ver"],
            "p"=> strtoupper($p["gtype"])=="ES" ? "get_result_es" : "get_result",
            "session"=>"", 
            "gtype"=>strtoupper($p["gtype"]),
            "date"=> $date,
            "league_id" => "all"
        ];
        
        $rs=$this->curlXml($ary);
		return $rs;
    }

    public function get_curl_ad_data($_p,$code=0){
        $this->randUser();
        if(!isset($this->web["uid"])){
            return json_encode(["status"=>"error","code"=>"4X011","msg"=>"线路不通"]);
        }
        $_p["login_layer"] = "ag";
        $_p["uid"] = $this->web["uid"];
        $_p["ver"] = empty($this->web["ver"]) ? "version-12-29" : $this->web["ver"];
        $json = $this->curlXml($_p);
        if($json == "curl name null"){
            return json_encode(["status"=>"error","code"=>"4X011","msg"=>"curl name null"]);
        }
        return $json;
    }

    /**
     * 获取会员列表
     * @return array|mixed
     */
    public function get_acc_mem_list(){
        $ary = [
            "p" => "get_acc_mem_list",
            "ver" => $this->ver,
            "uid" => $this->web["uid"],
            "login_layer" => "ag",
            "user_name" => "",
            "enable" => "Y",
            "sort_type" => "desc",
            "sort_name" => "adddate",
            "langx" => $this->langx,
            "up_id" => ""
        ];
        $json = $this->curlXml($ary);
        return json_decode($json, true);
    }

    /**
     * 获取代理自身设置(用于获取用户名前缀)
     * @return array|mixed
     */
    public function get_my_setting(){
        $ary = [
            "p" => "get_my_setting",
            "ver" => $this->ver,
            "uid" => $this->web["uid"],
            "login_layer" => "ag"
        ];
        $json = $this->curlXml($ary);
        return json_decode($json, true);
    }

    /**
     * 自动开号 - 创建会员账号
     * @param string $username 用户名
     * @param string $sname 简称
     * @param string $password 密码
     * @param string $up_id 上级ID
     * @return string
     */
    public function body_members_add($username, $sname, $password, $up_id){
        $ary = [
            "p" => "body_members_add",
            "ver" => $this->ver,
            "login_layer" => "ag",
            "uid" => $this->web["uid"],
            "keys" => "add",
            "ratio" => "",
            "odd_f_str" => "H,M,I,E",
            "username" => $username,
            "sname" => $sname,
            "alias" => $sname,
            "passwords" => $password,
            "maxcredit" => "1",
            "type" => "3",
            "currency" => "RMB",
            "up_layer" => "ag",
            "up_id" => $up_id,
            "pay_type" => "0",
            "langx" => $this->langx,
            // 足球-让球
            "FT_R_3_WAR" => "0.75",
            "FT_R_3_SC" => "1100000",
            "FT_R_3_SO" => "330000",
            // 足球-滚球让球
            "FT_RE_3_WAR" => "0.75",
            "FT_RE_3_SC" => "1100000",
            "FT_RE_3_SO" => "330000",
            // 足球-大小
            "FT_M_3_SC" => "1100000",
            "FT_M_3_SO" => "330000",
            // 足球-单双
            "FT_DT_3_SC" => "220000",
            "FT_DT_3_SO" => "55000",
            // 足球-滚球单双
            "FT_RDT_3_SC" => "220000",
            "FT_RDT_3_SO" => "55000",
            // 篮球-让球
            "BK_R_3_WAR" => "0.75",
            "BK_R_3_SC" => "1100000",
            "BK_R_3_SO" => "330000",
            // 篮球-滚球让球
            "BK_RE_3_WAR" => "0.75",
            "BK_RE_3_SC" => "1100000",
            "BK_RE_3_SO" => "220000",
            // 篮球-大小
            "BK_M_3_SC" => "550000",
            "BK_M_3_SO" => "110000",
            // 篮球-单双
            "BK_DT_3_SC" => "110000",
            "BK_DT_3_SO" => "55000",
            // 其他-让球
            "OP_R_3_WAR" => "0.75",
            "OP_R_3_SC" => "220000",
            "OP_R_3_SO" => "110000",
            // 其他-滚球让球
            "OP_RE_3_WAR" => "0.75",
            "OP_RE_3_SC" => "220000",
            "OP_RE_3_SO" => "110000",
            // 其他-大小
            "OP_M_3_SC" => "220000",
            "OP_M_3_SO" => "110000",
            // 其他-单双
            "OP_DT_3_SC" => "55000",
            "OP_DT_3_SO" => "55000",
            // 冠军
            "FS_FS_3_SC" => "110000",
            "FS_FS_3_SO" => "55000"
        ];
        return $this->curlXml($ary);
    }

    /**
     * 自动开号-二次处理：用默认密码登录新会员，拿到会员uid
     * @param string $username 会员账号
     * @param string $password 会员密码
     * @return array [uid, msg, raw]
     */
    public function mem_login($username, $password){
        $ary = [
            "p" => "chk_login",
            "langx" => $this->langx,
            "username" => $username,
            "password" => $password,
            "app" => "N",
            "auto" => "EZAFCC",
            "userAgent" => "TW96aWxsYS81LjAgKFdpbmRvd3MgTlQgNi4zOyBXaW42NDsgeDY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTIyLjAuNjI2MS45NSBTYWZhcmkvNTM3LjM2"
        ];
        $rs = $this->memCurl($ary);
        $xml = isset($rs["body"]) ? $rs["body"] : "";

        $uid = "";
        $msg = "";
        if (!empty($xml)) {
            $xmlObj = @simplexml_load_string($xml);
            if ($xmlObj) {
                $uid = (string)$xmlObj->uid;
                $msg = (string)$xmlObj->msg;
            }
        }
        return [
            "uid" => $uid,
            "msg" => $msg,
            "raw" => $xml,
            "http_code" => isset($rs["http_code"]) ? $rs["http_code"] : 0,
            "errno" => isset($rs["errno"]) ? $rs["errno"] : 0,
            "error" => isset($rs["error"]) ? $rs["error"] : "",
            "url" => isset($rs["url"]) ? $rs["url"] : "",
        ];
    }

    /**
     * 自动开号-二次处理：修改会员的"安全登录账号(passwd_safe)"
     * @param string $username 会员账号
     * @param string $chk_name 新的安全登录账号(随机6字母+3数字)
     * @param string $uid 由 mem_login 返回的会员uid
     * @return string 接口原始返回，包含"已成功修改登录帐号"则成功
     */
    public function mem_chg_passwd_safe($username, $chk_name, $uid){
        $ary = [
            "p" => "chg_passwd_safe",
            "ver" => "",
            "username" => $username,
            "chk_name" => $chk_name,
            "uid" => $uid,
            "langx" => $this->langx
        ];
        $rs = $this->memCurl($ary);
        return isset($rs["body"]) ? $rs["body"] : "";
    }

    /**
     * 自动开号-二次处理：修改会员密码
     * @param string $username 会员账号
     * @param string $newPassword 新密码
     * @param string $uid 由 mem_login 返回的会员uid
     * @return string 接口原始返回，包含"Success"则成功
     */
    public function mem_chg_newpwd($username, $newPassword, $uid){
        $ary = [
            "p" => "chg_newpwd",
            "ver" => "",
            "username" => $username,
            "new_password" => $newPassword,
            "chg_password" => $newPassword,
            "uid" => $uid,
            "langx" => $this->langx
        ];
        $rs = $this->memCurl($ary);
        return isset($rs["body"]) ? $rs["body"] : "";
    }

    // 用于二次处理专用：会员登录URL（可与代理URL不同）
    private $mem_url = "";
    public function setMemUrl($url){ $this->mem_url = $url; }

    /**
     * 自动开号-二次处理专用请求：独立的 curl 实例，不带代理 cookie，URL 不拼 ver。
     * 与旧项目 httpGet 逻辑对齐：URL=/transform.php，参数全部走 POST body。
     * @param array $post
     * @return array [body, http_code, errno, error]
     */
    private function memCurl($post){
        $base = !empty($this->mem_url) ? $this->mem_url : $this->web["url"];
        $base = rtrim($base, "/");
        $url = $base . "/transform.php";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 8);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36");
        curl_setopt($ch, CURLOPT_REFERER, $base);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($post));
        curl_setopt($ch, CURLOPT_HEADER, 0);
        $rs = curl_exec($ch);
        $info = [
            "body" => (string)$rs,
            "http_code" => curl_getinfo($ch, CURLINFO_HTTP_CODE),
            "errno" => curl_errno($ch),
            "error" => curl_error($ch),
            "url" => $url,
        ];
        curl_close($ch);
        return $info;
    }

}