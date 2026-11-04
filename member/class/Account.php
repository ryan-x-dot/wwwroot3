<?php

class Account extends Base
{
    protected $ls_code;

    protected $ls_account;

    protected $ls;

    protected $table;

    public function __construct($_p = [])
    {
        parent::__construct($_p);
        global $ls_ary,$ls_account_ary,$ls_code_ary;
        $this->ls = $ls_ary;
        $this->ls_account = $ls_account_ary;
        $this->ls_code = $ls_code_ary;
        $this->table = Constant::T_MEMBER;
    }

    /**
     * 邮箱设置
     * @return array
     */
    public function get_set_mail(){
        $p = $this->param;
        if(!preg_match("/^[a-zA-Z0-9._%+-]+@(?!.*\.\..*)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/is",$p["setEmail"])){
            return ["code"=>"607","err_msg"=>$this->ls["pls_enter_email"]];
        }
        $arr = [];
        switch ($p["action"]){
            case "getVerify":
                $up = [
                    "email" => $p["setEmail"]
                ];
                $this->dbc->update(Constant::T_MEMBER,$up,"`id`={$this->user["id"]}");
                $arr["code"] = 607;
                $arr["err_msg"] = "";
                $arr["alert_msg"] = $this->ls_code["mail_reg_ok"];
                $arr["done_msg"] = "";
                $arr["view"] = "div_set_verify";
                $arr["email"] = $p["setEmail"];
                $arr["enabled"] = "";
                break;
        }
        return  $arr;
    }

    /**
     * 弹窗私人消息
     * @return string
     */
    public function get_alert_msg(){
        $table = Constant::T_MESSAGE;
        $str = "";
        if(isset($this->user['name'])){
            $memname=$this->user['name'];
            $datetime = date("Y-m-d H:i:s");
            $where = "`member`='{$memname}' AND `type`=4 AND `fb`=1 AND (`dqtime`=0 OR `dqtime`>='{$datetime}') AND `isdelete`=0";
            $rs = $this->dbc->select("SELECT * FROM {$table} WHERE {$where} ORDER BY `ndate` DESC ,`id` DESC LIMIT 1","Row");

            if($rs){
                $msg = "<span style=\"line-height:30px;line-height:30px;min-height: 260px;font-size: 24px;font-weight: 800;word-wrap:break-word\"><span style=\"color:red\">{$rs["message"]}</span>";
                if(isset($rs['tel']) && !empty($rs['tel'])){
                    $msg.= "<br><br>电话号码/微信:<a href='tel:{$rs['tel']}'><span style='color:#ff8b0f;'>{$rs['tel']}</span></a></span>";
                }
                $str = json_encode(["id"=>$rs["id"],"msg"=>$msg]);
                
                $this->dbc->update($table, ["readcount" => $rs["readcount"] + 1], "`id`={$rs["id"]}");
            }
        }

        return $str;
    }

    public function set_alert_msg(){
        if(isset($this->param["id"])){
            $table = Constant::T_MESSAGE;
            $rs = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$this->param["id"]}","Row");
            if($rs) {
                $this->dbc->update($table, ["readcount" => $rs["readcount"] + 1], "`id`={$rs["id"]}");
            }
        }

    }

    /**
     * 现金额度修改记录
     * @return array
     */
    public function get_mem_creditlogs(){
        $data = [];
        $p = $this->param;
        $table = Constant::T_CREDIT_LOG;
        $start = strtotime("-{$p["selDate"]} day");
        $end = time();
        $where = " AND `logintime` BETWEEN {$start} AND {$end}";

        $rs = $this->dbc->select("SELECT * FROM {$table}  WHERE `nid`='{$this->user["nid"]}'  {$where} ORDER BY `logintime` DESC");

        if($rs) {
            foreach ($rs as $v) {
                $ary = [];
                $ary["adddate"] = date("Y-m-d H:i:s",$v["logintime"]);

                $ary["cash"] = $v["new_cash"];
                if($v["type"] == "Y"){
                    $ary["payway"] = 1;
                }else{
                    $ary["payway"] = -1;
                }
                $ary["gold"] = abs($v["cash"]);
                $data[] = $ary;
            }
        }
        $this->insertLog("额度修改记录");
        return $data;
    }

    /**
     * 公告查询
     * @return string
     */
    public function messageget(){
        $p = $this->param;
        $table = Constant::T_MESSAGE;
        $datetime = time();
        $date = date("Y-m-d");
        switch ($p["langx"]){
            case "zh-tw":
                $message = "message_tw";
                break;
            case "en-us":
                $message = "message_en";
                break;
            default:
                $message = "message";
                break;
        }
        $where = "`fb`=1 AND (`dqtime`=0 OR `dqtime`<='{$datetime}') ";
        $limit = "";
        switch ($p["t_important"]){
            case 2://个人公告
                $message = "message";
                $where .= " AND `type`=3 AND `member`='{$this->user["name"]}' ";
                /*$memname=$this->user['name'];
                $stmt = $db_client->query('select `message`,`tel` from db_client.`message` where `member`=\''.$memname.'\' and `type`=3 and `fb`=1 and (`dqtime`=0 or `dqtime`>now())');
                if($stmt->rowCount()>0){
                    $rs = $stmt->fetch();
                    $talert="<span style=\"color:red\">{$rs['message']}</span>";
                    if(!empty($rs['tel'])){
                        $talert.= "<br><br>电话号码/微信:<a href='tel:{$rs['tel']}'><span style='color:#ff8b0f;'>{$rs['tel']}</span></a>";
                    }
                    if($talert){
                        $db_client->query('update db_client.`message` set `readcount`=`readcount`+1 where `member`=\''.$memname.'\' and `type`=3 and `fb`=1 and (`dqtime`=0 or `dqtime`>now())');
                    }
                }*/
                break;
            case 1://重要公告
                $message = "message";
                $where .= " AND `type`=1";
                break;
            default://体育公告
                $where .= "AND `type`=0";
                if($p["select_date"]==0){
                    $where .= " AND `ndate`='{$date}'";
                }else if($p["select_date"] == -1){
                    $yesterday = date("Y-m-d",strtotime("-1 day"));
                    $where .= " AND `ndate`='{$yesterday}'";
                }else{
                    $limit = " LIMIT 0,4";
                }
                break;
        }

        if(isset($p["find"]) && !empty($p["find"])){
            $where .= " AND `{$message}` LIKE '%{$p["find"]}%'";
        }

        $rs = $this->dbc->select("SELECT *,`{$message}` AS `message` FROM {$table} WHERE {$where} ORDER BY `ndate` DESC ,`id` DESC {$limit}","All");
        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        $xml.= "<serverresponse>";
        $xml.= "<systime>{$date}</systime>";
        if($rs && count($rs)>0){
            $xml.="<max_id>{$rs[0]["id"]}</max_id>";
            foreach ($rs as $k=>$v){

                $kk = $k+1;
                $xml.="<game id=\"{$kk}\">";
                $xml.="<adddate>{$v["ndate"]}</adddate>";
                $xml.="<msg>{$v["message"]}</msg>";
                $xml.="</game>";
            }
        }else{
            $xml.="<max_id>0</max_id>";
        }
        $xml.= "</serverresponse>";
        $this->insertLog("讯息页面");
        return $xml;
    }


    /**
     * 验证账号
     * @return array|string[]
     */
    public function vaildateName(){
        $chk_name = $this->param["chk_name"];

        return $this->chkName($chk_name);

    }

    /**
     * 1. 您的登录帐号必须介于6到12个字母数字字符之间，且至少包含2个大写字母（A-Z）或小写字母（a-z）以及至少1个数字字符（0-9）。
     * 2. 您的登录帐号不得包含任何空格。
     * @param $chk_name
     * @return array|string[]
     */
    public function chkName($chk_name){
        //1. 您的登录帐号必须介于6到12个字母数字字符之间，且至少包含2个大写字母（A-Z）或小写字母（a-z）以及至少1个数字字符（0-9）。
        //2. 您的登录帐号不得包含任何空格。
        if(empty($chk_name)){
            return ["status"=>"error","msg"=>$this->ls_code["chgid_error"]];
        }
        $zm = 0;
        $num = 0;
        $len = strlen($chk_name);

        if(!preg_match("/^[aA-zZ][aA-zZ0-9]{5,11}$/",$chk_name)){
            return ["status"=>"error","msg"=>$this->ls_code["chgid_error_rule"]];
        }

        for($i=0;$i<strlen($chk_name);$i++){
            $l = substr($chk_name,$i,1);
            if(empty($l) && !is_numeric($l)){
                return ["status"=>"error","msg"=>$this->ls_code["chgid_error_rule"]];
            }
            if($i==0 && !ctype_alpha($l)){ //首字符为字母
                return ["status"=>"error","msg"=>$this->ls_code["chgid_error_rule"]];
            }

            if(ctype_alpha($l)){
                $zm++;
            }else if(is_numeric($l)){
                $num++;
            }
        }

        if($zm<2 || $num<1){
            return ["status"=>"error","msg"=>$this->ls_code["chgid_error_rule"]];
        }else{
            return ["status"=>"success"];
        }
    }



    /**
     * 密码验证
     * @param $pwd
     * @return array|string[]
     */
    public function chkPwd($pwd){
        //至少要有两个大或小写英文字母和数字(0-9)组合, 字数最少6至12个。
        //三个不同的字母数字。
        //不准许有空格。
        if(!preg_match("/^[aA-zZ][aA-zZ0-9]{5,11}$/",$pwd)){
            return ["status"=>"error","msg"=>1];
        }

        if(ctype_alnum($pwd) == false){
            return ["status"=>"error","msg"=>5];
        }

        $len = strlen($pwd);
        $arr_char = [];
        $str_char = 0;
        for($i=0;$i<$len;$i++){
            $tmp_str = substr($pwd,$i,1);
            if(empty($tmp_str) && !is_numeric($tmp_str)){
                return ["status"=>"error","msg"=>5];
            }
            if(preg_match("/^[aA-zZ]$/",$tmp_str)){
                $str_char++;
            }
            $arr_char[$tmp_str] = true;
        }

        $arr_block_string = ["abc111", "abc222", "abc333", "abc444", "abc555", "abc666", "abc777", "abc888", "abc999", "abc000", "111abc", "222abc", "333abc", "444abc", "555abc", "666abc", "777abc", "888abc", "999abc", "000abc", "abc123", "123abc", "aaa123", "123aaa", "aaa1234", "1234aaa", "aa1234", "1234aa", "aa12345", "12345aa", "bbb123", "123bbb", "bbb1234", "1234bbb", "bb1234", "1234bb", "bb12345", "12345bb", "ccc123", "123ccc", "ccc1234", "1234ccc", "cc1234", "1234cc", "cc12345", "12345cc", "qwe123", "123qwe", "qwe1234", "1234qwe", "qwe12345", "12345qwe"];
        if(in_array($pwd,$arr_block_string) || count(array_keys($arr_char))<=2){
            return ["status"=>"error","msg"=>3];
        }

        return ["status"=>"success"];
    }

    public function setPwd(){
        if(empty($this->param["uid"])){
            if(empty($this->param["username"])){
                return ["status" => "error", "code" => "error", "msg" => $this->ls_code["1X014"]];
            }else{
                $user = $this->dbc->select("SELECT * FROM {$this->utable} WHERE `name`='{$this->param["username"]}'","Row");
                if(!$user){return ["status" => "error", "code" => "error", "msg" => $this->ls_code["1X014"]];}
            }
        }else {
            $sta = $this->getUID();
            if ($sta["status"] == "error") {
                return ["status" => "error", "code" => "error", "msg" => $this->ls_code["1X014"]];
            }
            $user = $sta["user"];
        }

        $password = $this->param["new_password"];
        $REpassword = $this->param["chg_password"];
        if(empty($password)){
            return ["status"=>"error","err"=>411,"msg"=>$this->ls_code["changepwd_password"]];
        }

        if(empty($REpassword)){
            return ["status"=>"error","err"=>412,"msg"=>$this->ls_code["changepwd_REpassword"]];
        }

        
        if($password != $REpassword){
            return ["status"=>"error","err"=>413,"msg"=>$this->ls_code["changepwd_REpassworderror"]];
        }

        $chk = $this->chkPwd($password);
        if($chk["status"]=="error"){
            print_r($chk["msg"]);exit;
            $err = 415;
            if($chk["msg"]==3){
                $err = 416;
            }
            return ["status"=>"error","err"=>$err,"msg"=>$this->ls_code["rule_error_{$chk["msg"]}"]];
        }

       
        $this->dbc->beginTransaction();
        try{
            $up = [
                "passwd" => md5(md5($password)),
                "pw" => $password,
                "pwddate" => time()
            ];
            $this->dbc->update($this->table,$up,"`id`={$user["id"]}");
            $log = "修改密码";
            if($this->param["p"] == "chg_newpwd"){
                $log.= "[首次登陆]";
            }
            $this->insertLog($log);
            $this->dbc->commit();
            return ["status"=>"success"];
        }catch (\Exception $e){
            $this->dbc->rollback();
            return ["status"=>"error","code"=>"error","msg"=>$e->getMessage()];
        }
    }

    /**
     * 检测用户是否可用
     * @return array|string[]
     */
    public function chk_mem(){
        $vail = $this->vaildateName();
        if($vail["status"] == "error"){
            $vail["code"] = 'L';
            return $vail;
        }

        $username = $this->param["username"];
        $chk_name = $this->param["chk_name"];
        $count = $this->dbc->getCount($this->table,"id","`name`='{$chk_name}' OR `loginname`='{$chk_name}'");
        if($count>0){
            return ["status"=>"error","code"=>"Y","msg"=>$this->ls_code["chgid_error_duplicate"]];
        }

        $usr = $this->dbc->select("SELECT `loginname`,`name`,`passwd`,`setip` FROM {$this->table} WHERE `name`='{$username}' AND `loginname` IS NULL","Row");
        if(!$usr){
            return ["status"=>"error","code"=>"Y","msg"=>$this->ls_code["chgid_error_rule"]];
        }

        if($usr["name"] == $chk_name || md5(md5($chk_name)) == $usr["passwd"]){
            return ["status"=>"error","code"=>"Y","msg"=>$this->ls_code["chgid_error_passwd"]];
        }

        return ["status"=>"success","setip"=>$usr["setip"]];
    }

    /**
     * 设置登陆账号
     * @return array|string[]
     */
    public function setLoginName(){
        $chk = $this->chk_mem();
        if($chk["status"]=="error"){
            return $chk;
        }

        try{
            $username = $this->param["username"];
            $chk_name = $this->param["chk_name"];
            $this->dbc->update($this->table,["loginname"=>$chk_name],"`name`='{$username}' AND `loginname` IS NULL");
            $this->insertLog("设置登陆账号");
            return ["status"=>"success"];
        }catch (\Exception $e){
            return ["status"=>"error","code"=>"L","msg"=>$e->getMessage()];
        }
    }

    /**
     * 读取会员资料
     * @return array
     */
    public function get_member_data(){
        $change = "all";
        if(isset($this->param["change"])){
            $change = $this->param["change"];
        }

        $chgUID = $this->chgMemberUID();
        if(!empty($chgUID)){//登陆失效
            return $chgUID;
        }

        $user = $this->user;
        $user = $this->chg_member_credit($user,true);
        $arr = [];
        switch ($change){
            default:
                $arr["code"] = "get_all_data";
                $arr["enable"] = status_num_str(2,$this->getAccountStatus($user["nid"]));
                $arr["pay_type"] = $user["pay_type"];
                $arr["currency"] = $user["currency"];

                if($user["pay_type"] == 0){//信用玩家
                    $arr["maxcredit"] = $user["balance_credit"];//剩余额度
                    $arr["cash"] = 0;//现金额度
                }else{
                    $arr["maxcredit"] = $user["balance_credit"];//剩余额度
                    $arr["cash"] = $user["balance_credit"];//现金额度
                }
                break;
        }
        return $arr;
    }



    /**
     * 设置简易密码
     * @return array
     */
    public function set_passcode(){
        switch ($this->param["action"]){
            case "SET"://设置简易密码
                $chgUID = $this->chgMemberUID();
                if(!empty($chgUID)){//登陆失效
                    return $chgUID;
                }
                $user = $this->user;
                if(!isset($this->param["inputCode"]) || empty($this->param["inputCode"])){
                    return ["code"=>"error","msg"=>$this->ls_code["4pwd_input"]];
                }
                $ps = explode("|",$this->param["inputCode"]);
                if(!isset($ps[1]) || empty($ps[1])){
                    return ["code"=>"error","msg"=>$this->ls_code["4pwd_input"]];
                }
                $this->dbc->beginTransaction();
                $passcodeMD5 = md5Pwd($user["name"]."|".$user["passwd"]."|".$ps[1]);
                try{
                    $this->dbc->update($this->utable,["passcode"=>$ps[1],"passcodeMD5"=>$passcodeMD5],"id='{$user["id"]}'");
                    $this->insertLog("成功设置简易密码");
                    $this->dbc->commit();
                    return [
                        "code"=>484,
                        "data"=>$passcodeMD5
                    ];
                }catch (\Exception $e){
                    $this->dbc->rollback();
                    return ["code"=>"error","msg"=>$e->getMessage()];
                }
                break;
            case "GET":
                if(!isset($this->param["inputCode"]) || empty($this->param["inputCode"])){
                    return ["code"=>"999","msg"=>"fail"];
                }

                if(!isset($this->param["keycode"]) || empty($this->param["keycode"])){
                    return ["code"=>"999","msg"=>"fail"];
                }

                $user = $this->dbc->select("SELECT * FROM {$this->utable} WHERE `passcode`='{$this->param["inputCode"]}' AND `passcodeMD5`='{$this->param["keycode"]}'","Row");
                if(!$user){
                    return ["code"=>"999","msg"=>"fail"];
                }
                return ["code"=>"666","msg"=>"success"];
                break;
            case "GETSW"://核查简易密码
                $arr = ["code"=>"666","sw"=>"Y"];
                //inputCode
                if(isset($this->param["keycode"]) && !empty($this->param["keycode"])) {
                    $count = $this->dbc->getCount($this->utable, "id", "`passcodeMD5`='{$this->param["keycode"]}'");
                    if ($count > 0) {
                        $arr["sw"] = "N";
                    }
                }
                return $arr;
                break;
        }
    }

    public function memSet(){
        $arr = [];
        switch ($this->param["action"]){
            case "check":
                $chgUID = $this->chgMemberUID();
                if(!empty($chgUID)){//登陆失效
                    return $chgUID;
                }
                $user = $this->user;
                $arr["passcode"] = '[del1]';
                if(!empty($user["passcode"])){
                    $arr["passcode"] = $user["passcode"];
                }
                break;
        }

        return $arr;
    }
	
    public function checkloginmember(){
        $chgUID = $this->chgMemberUID();
		if(!empty($chgUID)){//登陆失效
			return $chgUID;
		}
	 $arr = [
			"code" => "ok",
			"msg" => "ok"
		];
        return $arr;
    }
}