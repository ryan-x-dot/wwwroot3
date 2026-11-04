<?php
class Base
{
    protected $login_layer;
    protected $param;
    protected $langx;
    protected $dbc;
    protected $dbs;
    protected $uid;
    protected $userArr;
    protected $sup;
    public $user;
    protected $isson="N";
    protected $tables;
    protected $utable;
    

    /**
     * Base constructor.
     * @param $_p 传递参数
     */
    public function __construct($_p=[]){
        global $tables,$db_c,$db_s;
        $this->dbc = $db_c;
        $this->dbs = $db_s;
        $this->param = $_p;
        if (!empty($this->param["mid"]) && empty($this->param["aid"])) {
            $this->param["aid"] = $this->param["mid"];
        }
        $this->login_layer = !empty($_p["login_layer"]) ? $_p["login_layer"] : Constant::MEM;
        $this->langx = !empty($_p["langx"]) ? $_p["langx"] : "zh-cn";
        $this->tables = $tables;
        $this->utable = $tables[$this->login_layer]["t"];


        if(!empty($this->param["langx"])){
            $this->langx = $this->param["langx"];
        }
        if(!empty($_p["uid"]) && $_p["uid"]!="null"){
            $this->uid = $_p["uid"];
            $this->userArr = $this->getUID();
            if($this->userArr["status"] == "success") {
                $this->user = $this->userArr["user"];
                $this->user["username"] = $this->user["name"];
                $this->user["enable"] = $this->user["status"] == "1"? "Y" : "N";
                $this->user["is_banned"] = $this->user["is_banned"] == "2"? "Y" : "N";
                $this->user["mid"] = $this->user["id"];
                $this->sup = $this->userArr["sup"];
            }
        }
    }

    /**
     * 检测会员是否登陆失效
     * @return array
     */
    public function chgMemberUID(){
        if($this->userArr["status"]=="error"){
            return ["code"=>"error","msg"=>$this->userArr["msg"]];
        }
    }

    /**
     * UID检测
     * @param $isTest
     * @return array|false
     */
    public function getUID($isTest=true){
        if($isTest === false){
            return false;
        }

        if(empty($this->param["uid"])){
            $this->logKick("empty_uid");
            $arr = [
                "status" => "error",
                "code" => "4X014",
                "msg" => "goHome"
            ];
            return $arr;
        }
        if(!preg_match('/^[A-Za-z0-9]{16,128}$/', $this->param["uid"])){
            $this->logKick("bad_format");
            $arr = [
                "status" => "error",
                "code" => "4X014",
                "msg" => "goHome"
            ];
            return $arr;
        }
        $arr = [];
        $sql = "SELECT * FROM {$this->utable} WHERE `uid`=:uid";
        $row = $this->dbc->selectNew($sql, [":uid" => $this->uid], 'Row');
        if(!$row){
            $this->logKick("uid_not_found");
            $arr = [
                "status" => "error",
                "code" => "4X014",
                "msg" => "goHome"
            ];
            return $arr;
        }

        $arr["user"] = $row;
        $arr["sup"] = $row;
        if(isset($row["isMaster"]) && $row["isMaster"]>0){ //非主账号
            $sup = $this->getNidMaster($row["nid"]);
            $this->isson = "Y";
            if($sup){
                $arr["sup"] = $sup;//主账号资料
            }else{
                $this->logKick("master_not_found");
                $arr = [
                    "status" => "error",
                    "code" => "4X014",
                    "msg" => "goHome"
                ];
                return $arr;
            }
        }
        
        $arr["status"] = "success";
        return $arr;
    }

    /**
     * 诊断用：记录本地 uid 校验失败（会员被踢下线的本地侧原因）
     * @param string $reason 失败原因：empty_uid/bad_format/uid_not_found/master_not_found
     */
    private function logKick($reason){
        $uid = isset($this->param["uid"]) ? $this->param["uid"] : "";
        Log::write("KICK_LOCAL", [
            "reason" => $reason,
            "p"      => isset($this->param["p"]) ? $this->param["p"] : "",
            "table"  => $this->utable,
            "uid"    => $uid,
            "uidlen" => strlen($uid),
            "ip"     => isset($_SERVER["REMOTE_ADDR"]) ? $_SERVER["REMOTE_ADDR"] : "",
            "host"   => isset($_SERVER["HTTP_HOST"]) ? $_SERVER["HTTP_HOST"] : "",
            "agent"  => isset($_SERVER["HTTP_USER_AGENT"]) ? substr($_SERVER["HTTP_USER_AGENT"],0,120) : "",
        ]);
    }


    /**
     * NID查询 主账号资料
     * @param $id
     * @return bool|mixed
     */
    public function getNidMaster($nid){
        if(empty($nid)){return false;}
        $sql = "SELECT * FROM {$this->utable} WHERE `nid`=:nid AND `isMaster`=0";
        $row = $this->dbc->selectNew($sql, [":nid" => $nid], 'Row');
        if(!$row){return false;}
        return $row;
    }

    /**
     * ID查询玩家资料
     * @param $id
     * @return bool|mixed
     */
    public function getID($id){
        if(empty($id)){return false;}
        $sql = "SELECT * FROM {$this->utable} WHERE `id`=:id";
        $row = $this->dbc->selectNew($sql, [":id" => $id], 'Row');
        if(!$row){ return false;}
        return $row;
    }

    /**
     * @param $layer 级别
     * @param $nid
     * @param $isyesterday 是否查询昨日
     * @return int|mixed 已用金额
     */
    public function usedCredit($layer,$nid,$isyesterday="N"){
        $table = "";
        $where = "";
        switch ($layer){
            case Constant::SU:
                $table = Constant::T_RANK;
                $where .= " AND `level`=1 AND `isMaster`=0";
                break;
            case Constant::CO:
                $table = Constant::T_RANK;
                $where .= " AND `level`=2 AND `isMaster`=0";
                break;
            case Constant::D0:
                $table = Constant::T_RANK;
                $where .= " AND `level`=3 AND `isMaster`=0";
                break;
            default:
                $table = Constant::T_MEMBER;
                break;
        }

        if(!empty($table)){
            if($layer==Constant::MEM){//查询下注金额
                $betTable = Constant::T_BET;

                if($isyesterday == "Y"){
                    $day = date("Y-m-d",strtotime("-1 day"));
                    $rs = $this->dbc->select("SELECT SUM(`bet_golds`) AS `Amount` FROM {$betTable} WHERE `nid`='{$nid}' AND `M_Date`='{$day}' AND `hidden`=0","Row");
                    // LOG::write("credit1", "SELECT SUM(`bet_golds`) AS `Amount` FROM {$betTable} WHERE `nid`='{$nid}' AND `M_Date`='{$day}' AND `hidden`=0");
                }else{
                    $day = date("Y-m-d");
                    $rs = $this->dbc->select("SELECT SUM(`bet_golds`) AS `Amount` FROM {$betTable} WHERE `nid`='{$nid}' AND `M_Date`>='{$day}' AND `hidden`=0","Row");
                    //print_r("SELECT SUM(`bet_golds`) AS `Amount` FROM {$betTable} WHERE `nid`='{$nid}' AND `M_Date`>='{$day}' AND `hidden`=0");exit;
                    // LOG::write("credit2", "SELECT SUM(`bet_golds`) AS `Amount` FROM {$betTable} WHERE `nid`='{$nid}' AND `M_Date`>='{$day}' AND `hidden`=0");
                }

            }else{//查询已用额度
                $rs = $this->dbc->select("SELECT SUM(`credit`) AS `Amount` FROM {$table} WHERE `nid` LIKE '{$nid}_%' {$where}",'Row');
                // LOG::write("credit3", "SELECT SUM(`credit`) AS `Amount` FROM {$table} WHERE `nid` LIKE '{$nid}_%' {$where}");
            }
            // LOG::write("credit4", $rs);
            return empty($rs["Amount"]) ? 0 : $rs["Amount"];
        }else{
            return 0;
        }
    }

    /**
     * 剩余可用额度
     * @param $user
     * @return int|mixed
     */
    public function usableCredit($user){
        $usable = $credit = $user["credit"];
        if($user["pay_type"] == 1){ //余额浮动
            $table_credit_log = Constant::T_CREDIT_LOG;
            // $credit_log_cash = $this->dbc->select("SELECT SUM(`cash`) AS `cash` FROM {$table_credit_log}  WHERE `s_name`='{$user["name"]}' AND `nid` !='{$user["nid"]}'","Row");
			//echo "SELECT SUM(`cash`) AS `cash` FROM {$table_credit_log}  WHERE `s_name`='{$user["name"]}'";
            $credit_log_cash = $this->dbc->select("SELECT SUM(`cash`) AS `cash` FROM {$table_credit_log}  WHERE `s_name`='{$user["name"]}'","Row");
			//echo $credit ."-". $credit_log_cash['cash']."\r\n";
            $usable = $credit - $credit_log_cash['cash'];
        }
        return $usable;
    }

    /**
     * 信用会员额度校验
     * @param $user
     * @param $isReturnUsers 是否返回新用户资料
     */
    public function chg_member_credit($user,$isReturnUsers=false){
        $table = Constant::T_MEMBER;

        if($user["pay_type"]!=1){
            $up = [];
            $nid = $user["nid"];
            $betAmount = $this->usedCredit(Constant::MEM,$nid);//今日下注金额
            //print_r($betAmount);exit;
            $cr = $user["credit"] - $betAmount;
            $cr = $cr>0 ? $cr : 0;
            $up["balance_credit"] = $cr;
            $this->dbc->update($table,$up,"`id`={$user["id"]}");
        }



        if($isReturnUsers){
            return $this->dbc->select("SELECT * FROM {$table} WHERE `uid`='{$user["uid"]}'","Row");
        }
    }


    /**
     * 添加日志
     * @param $log 内容
     */
    public function insertLog($log,$ip=""){
        if(empty($ip)){
            if(isset($this->user["setip"]) && !empty($this->user["setip"])){
                $ip = $this->user["setip"];
            }else{
                $ip = $_SERVER['REMOTE_ADDR'];
            }

        }

        if($this->login_layer == Constant::MEM){
            $gid = $this->sup["id"];//主账号id
            if(empty($ip)){$ip = $_SERVER['REMOTE_ADDR'];}
            $insert = [
                "gid"=>$gid,
                "info"=>$log,
                "loginip"=>$ip,
                "logintime"=>time(),
                "nid"=>$this->sup["nid"]
            ];
        }else{
            $isMaster = isset($this->user["isMaster"]) ? $this->user["isMaster"] : 0;
            $subid = $this->user['id'];//子账号id
            $gid = $this->sup["id"];//主账号id
            $insert = [
                "gid"=>$gid,
                "sub_id"=>$subid,
                "info"=>$log,
                "loginip"=>$ip,
                "logintime"=>time(),
                "nid"=>$this->user["nid"],
                "isMaster"=>$isMaster
            ];
        }
        $this->dbc->insert($this->tables[$this->login_layer]["t_record"],$insert);
        switch ($this->login_layer){
            case Constant::ADS:
            case Constant::AD:
                $table = Constant::T_ADMIN;
                break;
            case Constant::MEM:
                $table = Constant::T_MEMBER;
                break;
            default:
                $table = Constant::T_RANK;
                break;
        }
        $this->dbc->update($table,["lastdate"=>time()],"`id`={$this->user["id"]}");
    }

    /**
     * 检测账号的状态
     * @param $nid
     * @param $isStatus 是否查询本级账户状态
     * @return int
     */
    public function getAccountStatus($nid,$isStatus = true){
        $nums = [2,3,4,5,6,7];
        $len = strlen($nid);
        if($isStatus){
            switch ($len){
                case 16:
                case 16*2:
                    $table = Constant::T_ADMIN;
                    break;
                case 16*7:
                    $table = Constant::T_MEMBER;
                    break;
                default:
                    $table = Constant::T_RANK;
                    break;
            }
            $status = $this->setSupStatus($nid,$table);
        }


        $up_status = 1;
        foreach ($nums as $v){
            $up_nid = substr($nid,0,$v*16);
            if($v == 2){
                $up_table = Constant::T_ADMIN;
            }else{
                $up_table = Constant::T_RANK;
            }

            if(strlen($up_nid)<$len){
                 //var_dump($table, $up_nid);die;
                $up_status = $this->setSupStatus($up_nid,$up_table);
                if($up_status >1){//上级存在 停用,只能看账,禁止登入,租用到期
                    break;
                }
            }
        }
        // var_dump($status, $nid,$table);die;

        if($isStatus) {
            if ($status == 1) {
                if ($up_status == 1) {
                    return 1;
                } else {
                    return $up_status;
                }
            } else {
                return $status;
            }
        }else{//只返回上级账号状态
            return $up_status;
        }

    }

    /**
     * 检测账号的状态
     * @param $nid
     * @param $isStatus 是否查询本级账户状态
     * @return int
     */
    public function getIsBanned($rid,$isStatus = true){
        $rankTable = Constant::T_RANK;
        $rankData = $this->dbc->select("SELECT * FROM {$rankTable} WHERE `id`={$rid} ","Row");
        
        if($isStatus && $rankData){
            switch ($rankData['is_banned']){
                case 1:
                    return 'N';
                case 2:
                    return "Y";
                default:
                    $table = Constant::T_RANK;
                    break;
            }
        }


    }

    /**
     * 各级别访问隐藏注单
     * @param $alias 别名
     * @return string
     */
    public function hidden_layer($alias=''){
        $where = "";
        $a = "";
        if(!empty($alias)){
            $a = $alias.".";
        }
        switch ($this->login_layer){
            case Constant::ADS:
                break;
            case Constant::AD:
                $where= " AND ({$a}`hidden`=0 OR ({$a}`hidden`=1 AND ({$a}`edit_layer`>=1) OR {$a}`edit_layer` IS NULL))";
                break;
            case Constant::D0:
                $special = json_decode($this->sup["special"],true);
                if(isset($special["D0_MEM_HIDE"]) && $special["D0_MEM_HIDE"]==true) {
                    $where = " AND ({$a}`hidden`=0 OR ({$a}`hidden`=1 AND {$a}`edit_layer`>=2))";
                }else{
                    $where = " AND {$a}`hidden`=0";
                }
                break;
            case Constant::SU:
                $special = json_decode($this->sup["special"],true);
                if(isset($special["D1_MEM_HIDE"]) && $special["D1_MEM_HIDE"]==true) {
                    $where = " AND ({$a}`hidden`=0 OR ({$a}`hidden`=1 AND {$a}`edit_layer`>=3))";
                }else{
                    $where = " AND {$a}`hidden`=0";
                }
                break;
            default:
                $where = " AND {$a}`hidden`=0";
                break;
        }

        return $where;
    }

    /**
     * 修改注单权限
     */
    public function edit_bet_layer(){
        global $online_name;
        $onn = $online_name[$this->langx];
        $ary = [
            "td_head" => [],
            "td_content" => [],
            "td_online" => [],
            "td_layer" => []
        ];
        
        switch ($this->login_layer){
            case Constant::ADS:
            case Constant::AD:
                if($this->isson=="Y"){
                    $special = json_decode($this->user["special"],true);
                    $ishead = "N";
                    //对调
                    if(isset($special["AD_MEM_EXCHANGE"]) && $special["AD_MEM_EXCHANGE"]=="true") {
                        $ary["td_content"]["swap"] = $onn["swap"];
                        $ishead = "Y";
                    }
                    //隐藏
                    if(isset($special["AD_MEM_HIDE"]) && $special["AD_MEM_HIDE"]=="true") {
                        $ary["td_content"]["hidden"] = $onn["hidden"];
                        $ishead = "Y";
                    }

                    //修改
                    if(isset($special["AD_MEM_EDIT"]) && $special["AD_MEM_EDIT"]=="true") {
                        $ary["td_content"]["edit"] = $onn["edit"];
                        $ishead = "Y";
                    }

                    //添单
                    if(isset($special["AD_MEM_ADD"]) && $special["AD_MEM_ADD"]=="true") {
                        $ary["td_content"]["add"] = $onn["add"];
                        $ishead = "Y";
                    }

                    //删除
                    if(isset($special["AD_MEM_DEL"]) && $special["AD_MEM_DEL"]=="true") {
                        $ary["td_content"]["delete"] = $onn["delete"];
						// $ary["td_content"]["add"] = $onn["add"];
                        $ishead = "Y";
                    }

                    //记录
                    if(isset($special["AD_MEM_LOG"]) && $special["AD_MEM_LOG"]=="true") {
                        $ary["td_online"]["log"] = "记录";
                    }

                    //网址
                    if(isset($special["AD_MEM_DOMAIN"]) && $special["AD_MEM_DOMAIN"]=="true") {
                        $ary["td_online"]["domain"] = "网址";
                    }

                    //投注
                    if(isset($special["AD_MEM_DOBET"]) && $special["AD_MEM_DOBET"]=="true") {
                        $ary["td_online"]["dobet"] = "投注";
                    }

                    //私聊
                    if(isset($special["AD_MESS"]) && $special["AD_MESS"]=="Y") {
                        $ary["td_online"]["mes"] = "私聊";
                    }

                    //线上股东
                    if(isset($special["AD_CO"]) && $special["AD_CO"] == "Y"){
                        $ary["td_layer"]["CO"] = "线上股东";
                    }

                    //线上总代
                    if(isset($special["AD_SU"]) && $special["AD_SU"] == "Y"){
                        $ary["td_layer"]["SU"] = $onn["su"];
                    }

                    //线上代理
                    if(isset($special["AD_AG"]) && $special["AD_AG"] == "Y"){
                        $ary["td_layer"]["AG"] = $onn["ag"];
                    }

                    //线上会员
                    if(isset($special["AD_MEM"]) && $special["AD_MEM"] == "Y"){
                        $ary["td_layer"]["MEM"] = $onn["mem"];
                    }

                    if($ishead=="Y"){
                        $ary["td_head"] = "操作";
                    }
                }else{
                    $ary["td_head"] = "操作";
                    $ary["td_content"] = ["swap"=>$onn["swap"],"edit"=>$onn["edit"],"add"=>$onn["add"],"hidden"=>$onn["hidden"],"result"=>$onn["result"],"delete"=>$onn["delete"],"manage"=>$onn["bet_manger"]];
                    $ary["td_online"] = ["log"=>"记录","domain"=>"网址","dobet"=>"投注","mes"=>"私聊"];
                    $ary["td_layer"] = ["D0"=>"线上分公司","CO"=>"线上股东","SU"=>$onn["su"],"AG"=>$onn["ag"],"MEM"=>$onn["mem"]];
                    if($this->login_layer==Constant::ADS){
                        $ary["td_layer"]["AD"] = "线上公司";
                    }
                }
                break;
            case Constant::D0:
                $special = json_decode($this->sup["special"],true);
                $special_son = json_decode($this->user["special"],true);//子账号
                $ishead = "N";
                if($this->isson == "Y"){//子账号
                    //对调
                    if(isset($special["D0_MEM_EXCHANGE"]) && $special["D0_MEM_EXCHANGE"]=="true" && isset($special_son["D0_MEM_EXCHANGE"]) && $special_son["D0_MEM_EXCHANGE"]=="true") {
                        $ary["td_content"]["swap"] = $onn["swap"];
                        $ishead = "Y";
                    }
                    //隐藏
                    if(isset($special["D0_MEM_HIDE"]) && $special["D0_MEM_HIDE"]=="true" && isset($special_son["D0_MEM_HIDE"]) && $special_son["D0_MEM_HIDE"]=="true") {
                        $ary["td_content"]["hidden"] = $onn["hidden"];
                        $ishead = "Y";
                    }

                    //修改
                    if(isset($special["D0_MEM_EDIT"]) && $special["D0_MEM_EDIT"]=="true" && isset($special_son["D0_MEM_EDIT"]) && $special_son["D0_MEM_EDIT"]=="true") {
                        $ary["td_content"]["edit"] = $onn["edit"];
                        $ishead = "Y";
                    }

                    //删除
                    if(isset($special["D0_MEM_DEL"]) && $special["D0_MEM_DEL"]=="true" && isset($special_son["D0_MEM_DEL"]) && $special_son["D0_MEM_DEL"]=="true") {
                        $ary["td_content"]["delete"] = $onn["delete"];
                        $ishead = "Y";
                    }

                    //记录
                    if(isset($special["D0_MEM_LOG"]) && $special["D0_MEM_LOG"]=="true" && isset($special_son["D0_MEM_LOG"]) && $special_son["D0_MEM_LOG"]=="true") {
                        $ary["td_online"]["log"] = "记录";
                    }

                    //网址
                    if(isset($special["D0_MEM_DOMAIN"]) && $special["D0_MEM_DOMAIN"]=="true" && isset($special_son["D0_MEM_DOMAIN"]) && $special_son["D0_MEM_DOMAIN"]=="true") {
                        $ary["td_online"]["domain"] = "网址";
                    }

                    //投注
                    if(isset($special["D0_MEM_DOBET"]) && $special["D0_MEM_DOBET"]=="true" && isset($special_son["D0_MEM_DOBET"]) && $special_son["D0_MEM_DOBET"]=="true") {
                        $ary["td_online"]["dobet"] = "投注";
                    }

                    //私聊
                    if(isset($special["D0_MES"]) && $special["D0_MES"]=="Y" && isset($special_son["D0_MES"]) && $special_son["D0_MES"]=="Y") {
                        $ary["td_online"]["mes"] = "私聊";
                    }

                    //线上股东
                    if(isset($special["D0_CO"]) && $special["D0_CO"] == "Y" && isset($special_son["D0_CO"]) && $special_son["D0_CO"] == "Y"){
                        $ary["td_layer"]["CO"] = "线上股东";
                    }

                    //线上总代
                    if(isset($special["D0_SU"]) && $special["D0_SU"] == "Y" && isset($special_son["D0_SU"]) && $special_son["D0_SU"] == "Y"){
                        $ary["td_layer"]["SU"] = $onn["su"];
                    }

                    //线上代理
                    if(isset($special["D0_AG"]) && $special["D0_AG"] == "Y" && isset($special_son["D0_SU"]) && $special_son["D0_SU"] == "Y"){
                        $ary["td_layer"]["AG"] = $onn["ag"];
                    }

                    //线上会员
                    if(isset($special["D0_MEM"]) && $special["D0_MEM"] == "Y" && isset($special_son["D0_MEM"]) && $special_son["D0_MEM"] == "Y"){
                        $ary["td_layer"]["MEM"] = $onn["mem"];
                    }
                }else{
                    //对调
                    if(isset($special["D0_MEM_EXCHANGE"]) && $special["D0_MEM_EXCHANGE"]=="true") {
                        $ary["td_content"]["swap"] = $onn["swap"];
                        $ishead = "Y";
                    }
                    //隐藏
                    if(isset($special["D0_MEM_HIDE"]) && $special["D0_MEM_HIDE"]=="true") {
                        $ary["td_content"]["hidden"] = $onn["hidden"];
                        $ishead = "Y";
                    }

                    //修改
                    if(isset($special["D0_MEM_EDIT"]) && $special["D0_MEM_EDIT"]=="true") {
                        $ary["td_content"]["edit"] = $onn["edit"];
                        $ishead = "Y";
                    }

                    //删除
                    if(isset($special["D0_MEM_DEL"]) && $special["D0_MEM_DEL"]=="true") {
                        $ary["td_content"]["delete"] = $onn["delete"];
                        $ishead = "Y";
                    }
					
					//添单
					if(isset($special["D0_MEM_TIANDAN"]) && $special["D0_MEM_TIANDAN"]=="true") {
						$ary["td_content"]["tiandan"] = $onn["tiandan"];
					}

					//划单
					if(isset($special["D0_MEM_ZHUDAN"]) && $special["D0_MEM_ZHUDAN"]=="true") {
						$ary["td_content"]["zhudan"] = $onn["zhudan"];
					}

                    //记录
                    if(isset($special["D0_MEM_LOG"]) && $special["D0_MEM_LOG"]=="true") {
                        $ary["td_online"]["log"] = "记录";
                    }

                    //网址
                    if(isset($special["D0_MEM_DOMAIN"]) && $special["D0_MEM_DOMAIN"]=="true") {
                        $ary["td_online"]["domain"] = "网址";
                    }

                    //投注
                    if(isset($special["D0_MEM_DOBET"]) && $special["D0_MEM_DOBET"]=="true") {
                        $ary["td_online"]["dobet"] = "投注";
                    }

                    //私聊
                    if(isset($special["D0_MESS"]) && $special["D0_MESS"] == "Y"){
                        $ary["td_online"]["mes"] = "私聊";
                    }

                    //线上股东
                    if(isset($special["D0_CO"]) && $special["D0_CO"] == "Y"){
                        $ary["td_layer"]["CO"] = "线上股东";
                    }

                    //线上总代
                    if(isset($special["D0_SU"]) && $special["D0_SU"] == "Y"){
                        $ary["td_layer"]["SU"] = $onn["su"];
                    }

                    //线上代理
                    if(isset($special["D0_AG"]) && $special["D0_AG"] == "Y"){
                        $ary["td_layer"]["AG"] = $onn["ag"];
                    }

                    //线上会员
                    if(isset($special["D0_MEM"]) && $special["D0_MEM"] == "Y"){
                        $ary["td_layer"]["MEM"] = $onn["mem"];
                    }
                }
                $ary["td_content"]["manage"] = '注单处理';

                if($ishead=="Y"){
                    $ary["td_head"] = "操作";
                }
                break;
            case Constant::CO:
                $special = json_decode($this->sup["special"],true);
                $rankTable = Constant::T_RANK;
                $nid = sup_nid(Constant::D0,$this->sup["nid"]);
                $d0 = $this->dbc->select("SELECT `special` FROM {$rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                $d0_special = json_decode($d0["special"],true);
                $special_son = json_decode($this->user["special"],true);//子账号
                $ishead = "N";
                if($this->isson == "Y") {//子账号
                    //对调
                    if($d0_special["D1_MEM_EXCHANGE"]=="true"
                        && isset($special["D1_MEM_EXCHANGE"]) && $special["D1_MEM_EXCHANGE"]=="true"
                        && isset($special_son["D1_MEM_EXCHANGE"]) && $special_son["D1_MEM_EXCHANGE"]=="true") {
                        $ary["td_content"]["swap"] = $onn["swap"];
                        $ishead = "Y";
                    }
                    //隐藏
                    if($d0_special["D1_MEM_HIDE"]=="true"
                        && isset($special["D1_MEM_HIDE"]) && $special["D1_MEM_HIDE"]=="true"
                        && isset($special_son["D1_MEM_HIDE"]) && $special_son["D1_MEM_HIDE"]=="true") {
                        $ary["td_content"]["hidden"] = $onn["hidden"];
                        $ishead = "Y";
                    }

                    //修改
                    if($d0_special["D1_MEM_EDIT"]=="true"
                        && isset($special["D1_MEM_EDIT"]) && $special["D1_MEM_EDIT"]=="true"
                        && isset($special_son["D1_MEM_EDIT"]) && $special_son["D1_MEM_EDIT"]=="true") {
                        $ary["td_content"]["edit"] = $onn["edit"];
                        $ishead = "Y";
                    }

                    //删除
                    if($d0_special["D1_MEM_DEL"]=="true"
                        && isset($special["D1_MEM_DEL"]) && $special["D1_MEM_DEL"]=="true"
                        && isset($special_son["D1_MEM_DEL"]) && $special_son["D1_MEM_DEL"]=="true") {
                        $ary["td_content"]["delete"] = $onn["delete"];
                        $ishead = "Y";
                    }

                    //记录
                    if($d0_special["D1_MEM_LOG"]=="true"
                        && isset($special["D1_MEM_LOG"]) && $special["D1_MEM_LOG"]=="true"
                        && isset($special_son["D1_MEM_LOG"]) && $special_son["D1_MEM_LOG"]=="true") {
                        $ary["td_online"]["log"] = "记录";
                    }

                    //网址
                    if($d0_special["D1_MEM_DOMAIN"]=="true"
                        && isset($special["D1_MEM_DOMAIN"]) && $special["D1_MEM_DOMAIN"]=="true"
                        && isset($special_son["D1_MEM_DOMAIN"]) && $special_son["D1_MEM_DOMAIN"]=="true") {
                        $ary["td_online"]["domain"] = "网址";
                    }

                    //投注
                    if($d0_special["D1_MEM_DOBET"]=="true"
                        && isset($special["D1_MEM_DOBET"]) && $special["D1_MEM_DOBET"]=="true"
                        && isset($special_son["D1_MEM_DOBET"]) && $special_son["D1_MEM_DOBET"]=="true") {
                        $ary["td_online"]["dobet"] = "投注";
                    }

                    //私聊
                    if(isset($d0_special["D0_MES"]) && $d0_special["D0_MES"] == "Y"
                        && isset($special["D1_MES"]) && $special["D1_MES"] == "Y"
                        && isset($special_son["D1_MES"]) && $special_son["D1_MES"] == "Y"){
                        $ary["td_online"]["mes"] = "私聊";
                    }

                    //线上总代
                    if(isset($d0_special["D0_SU"]) && $d0_special["D0_SU"] == "Y"
                        && isset($special["D1_SU"]) && $special["D1_SU"] == "Y"
                        && isset($special_son["D1_SU"]) && $special_son["D1_SU"] == "Y"){
                        $ary["td_layer"]["SU"] = $onn["su"];
                    }

                    //线上代理
                    if(isset($d0_special["D0_AG"]) && $d0_special["D0_AG"] == "Y"
                        && isset($special["D1_AG"]) && $special["D1_AG"] == "Y"
                        && isset($special_son["D1_AG"]) && $special_son["D1_AG"] == "Y"){
                        $ary["td_layer"]["AG"] = $onn["ag"];
                    }

                    //线上会员
                    if(isset($d0_special["D0_MEM"]) && $d0_special["D0_MEM"] == "Y"
                        && isset($special["D1_MEM"]) && $special["D1_MEM"] == "Y"
                        && isset($special_son["D1_MEM"]) && $special_son["D1_MEM"] == "Y"){
                        $ary["td_layer"]["MEM"] = $onn["mem"];
                    }
                }else{
                    //对调
                    if($d0_special["D1_MEM_EXCHANGE"]=="true" && isset($special["D1_MEM_EXCHANGE"]) && $special["D1_MEM_EXCHANGE"]=="true") {
                        $ary["td_content"]["swap"] = $onn["swap"];
                        $ishead = "Y";
                    }
                    //隐藏
                    if($d0_special["D1_MEM_HIDE"]=="true" && isset($special["D1_MEM_HIDE"]) && $special["D1_MEM_HIDE"]=="true") {
                        $ary["td_content"]["hidden"] = $onn["hidden"];
                        $ishead = "Y";
                    }

                    //修改
                    if($d0_special["D1_MEM_EDIT"]=="true" && isset($special["D1_MEM_EDIT"]) && $special["D1_MEM_EDIT"]=="true") {
                        $ary["td_content"]["edit"] = $onn["edit"];
                        $ishead = "Y";
                    }

                    //删除
                    if($d0_special["D1_MEM_DEL"]=="true" && isset($special["D1_MEM_DEL"]) && $special["D1_MEM_DEL"]=="true") {
                        $ary["td_content"]["delete"] = $onn["delete"];
                        $ishead = "Y";
                    }

                    //记录
                    if($d0_special["D1_MEM_LOG"]=="true" && isset($special["D1_MEM_LOG"]) && $special["D1_MEM_LOG"]=="true") {
                        $ary["td_online"]["log"] = "记录";
                    }

                    //网址
                    if($d0_special["D1_MEM_DOMAIN"]=="true" && isset($special["D1_MEM_DOMAIN"]) && $special["D1_MEM_DOMAIN"]=="true") {
                        $ary["td_online"]["domain"] = "网址";
                    }

                    //投注
                    if($d0_special["D1_MEM_DOBET"]=="true" && isset($special["D1_MEM_DOBET"]) && $special["D1_MEM_DOBET"]=="true") {
                        $ary["td_online"]["dobet"] = "投注";
                    }

                    //私聊
                    if(isset($d0_special["D0_MES"]) && $d0_special["D0_MES"] == "Y" && isset($special["D1_MES"]) && $special["D1_MES"] == "Y"){
                        $ary["td_online"]["mes"] = "私聊";
                    }

                    //线上总代
                    if(isset($d0_special["D0_SU"]) && $d0_special["D0_SU"] == "Y" && isset($special["D1_SU"]) && $special["D1_SU"] == "Y"){
                        $ary["td_layer"]["SU"] = $onn["su"];
                    }

                    //线上代理
                    if(isset($d0_special["D0_AG"]) && $d0_special["D0_AG"] == "Y" && isset($special["D1_AG"]) && $special["D1_AG"] == "Y"){
                        $ary["td_layer"]["AG"] = $onn["ag"];
                    }

                    //线上会员
                    if(isset($d0_special["D0_MEM"]) && $d0_special["D0_MEM"] == "Y" && isset($special["D1_MEM"]) && $special["D1_MEM"] == "Y"){
                        $ary["td_layer"]["MEM"] = $onn["mem"];
                    }
                }

                if($ishead=="Y"){
                    $ary["td_head"] = "操作";
                }
                break;
        }
        return $ary;
    }

    /**
     * 获取子账号所管理的下线nid
     * @param $return_id_nid idAry:返回下级ID集,nidAry:返回下级nid集,idStr:返回下级ID字符串
     * @return array|false|mixed
     */
    public function son_nid_manger($return_id_nid="nidAry"){
        if($this->isson == "Y" && !empty($this->user["manager_uid"]) && $this->user["manager_uid"]!=0) { //子账号管理自己的账号
            switch ($return_id_nid){
                case "idAry":
                    return explode(",",$this->user["manager_uid"]);
                    break;
                case "idStr":
                    return $this->user["manager_uid"];
                    break;
                default:
                    $son_nid_ary = [];
                    $ww = "";
                    switch ($this->login_layer){
                        case Constant::ADS:
                            $table = Constant::T_ADMIN;
                            $ww = " AND `level`=1";
                            break;
                        case Constant::AD:
                            $table = Constant::T_RANK;
                            $ww = " AND `level`=4";
                            break;
                        case Constant::D0:
                            $table = Constant::T_RANK;
                            $ww = " AND `level`=3";
                            break;
                        case Constant::CO:
                            $table = Constant::T_RANK;
                            $ww = " AND `level`=2";
                            break;
                        case Constant::SU:
                            $table = Constant::T_RANK;
                            $ww = " AND `level`=1";
                            break;
                        case Constant::AG:
                            $table = Constant::T_MEMBER;
                            break;
                    }

                    $ad_sub = $this->dbc->select("SELECT `nid` FROM {$table} WHERE `id` IN ({$this->user["manager_uid"]}) {$ww}");
                    if($ad_sub){
                        $son_nid_ary = array_column($ad_sub,"nid");
                    }
                    return $son_nid_ary;
                    break;
            }

        }else{
            return false;
        }
    }

    /**
     * 子账号管理下线 根据下级nid获取当前级的nid
     * @param $layer
     * @param $vnid
     * @return false|mixed|string|级别编码
     */
    public function get_manger_acc_nid($layer,$vnid){
        $nid = $vnid;
        switch ($layer){
            case Constant::AD:
                switch ($this->login_layer){//子账号级别
                    case Constant::ADS:
                        $nid = sup_nid(Constant::AD,$vnid);
                        break;
                }
                break;
            case Constant::D0:
                switch ($this->login_layer){//子账号级别
                    case Constant::ADS:
                        $nid = sup_nid(Constant::AD,$vnid);
                        break;
                    case Constant::AD:
                        $nid = sup_nid(Constant::D0,$vnid);
                        break;
                }
                break;
            case Constant::CO:
                switch ($this->login_layer){//子账号级别
                    case Constant::ADS:
                        $nid = sup_nid(Constant::AD,$vnid);
                        break;
                    case Constant::AD:
                        $nid = sup_nid(Constant::D0,$vnid);
                        break;
                    case Constant::D0:
                        $nid = sup_nid(Constant::CO,$vnid);
                        break;
                }
                break;
            case Constant::SU:
                switch ($this->login_layer){//子账号级别
                    case Constant::ADS:
                        $nid = sup_nid(Constant::AD,$vnid);
                        break;
                    case Constant::AD:
                        $nid = sup_nid(Constant::D0,$vnid);
                        break;
                    case Constant::D0:
                        $nid = sup_nid(Constant::CO,$vnid);
                        break;
                    case Constant::CO:
                        $nid = sup_nid(Constant::SU,$vnid);
                        break;

                }
                break;
            case Constant::AG:
            case Constant::MEM:
                switch ($this->login_layer){//子账号级别
                    case Constant::ADS:
                        $nid = sup_nid(Constant::AD,$vnid);
                        break;
                    case Constant::AD:
                        $nid = sup_nid(Constant::D0,$vnid);
                        break;
                    case Constant::D0:
                        $nid = sup_nid(Constant::CO,$vnid);
                        break;
                    case Constant::CO:
                        $nid = sup_nid(Constant::SU,$vnid);
                        break;
                    case Constant::SU:
                        $nid = sup_nid(Constant::AG,$vnid);
                        break;
                }
                break;
        }

        return $nid;
    }

    private function setSupStatus($nid,$table){
        $where =" AND `isMaster`=0";
        if($table == Constant::T_MEMBER){
            $where = "";
        }
        $rs = $this->dbc->select("SELECT `enddate`,`status` FROM {$table} WHERE `nid`='{$nid}' {$where}","Row");
        
        if($rs){
            if($rs["status"]>1){
                return $rs["status"];
            }else{
                if(!empty($rs["enddate"]) && $rs["enddate"]<time()){
                    return 5;
                }else{
                    return 1;
                }
            }
        }
    }
	/**
     * 根据条件查询上级
     * @param  string $mem_nid [description]
     * @return [type]          [description]
     */
    public function getSupList($mem_nid=''){
        $arr = [];
        $rankTable = Constant::T_RANK;
        $lv = [Constant::D0,Constant::CO,Constant::SU,Constant::AG];

        foreach ($lv as $v){
            $nid = sup_nid($v,$mem_nid);
            $arr[$v] = $this->dbc->select("SELECT `name` FROM {$rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
        }
        return $arr;
    }

    /**
     * 用户踢线
     * [acc_out description]
     * @param  [type] $layer [description]
     * @param  [type] $id    [description]
     * @return [type]        [description]
     */
    public function acc_out($layer,$id)
    {    
        $table = Constant::T_RANK;
        switch ($layer){
            case Constant::ADS:
            case Constant::AD:
                $table = Constant::T_ADMIN;
                break;
            case Constant::MEM:
                $table = Constant::T_MEMBER;
                break;
        }
        $count = $this->dbc->getCount($table,"id","`id`={$id} AND `nid` LIKE '{$this->sup["nid"]}%'");
        if($count == 0){
            return false;
        }
        try{
            $res = $this->dbc->update($table,["isout"=>0,"uid"=>"sadf"],"`id`={$id} AND `nid` LIKE '{$this->sup["nid"]}%'");
            return true;
        }catch (\Exception $e){
            $msg = $e->getMessage();
            return false;
        }    
    }

    /**
     * hgid转换gid
     */
    public function hgid_convert($gids)
    {
        $new_gids = [];
        foreach($gids as $k =>$v){
            if($v % 2 == 0) $new_gids[$k] = $v-1;
            else $new_gids[$k] = $v;
        }
        return array_unique($new_gids);
    }

    /**
     * 调试时，写入文件
     */
    public function addMyfile($txt='空白',$prefix='newfile',$time=null)
    {
        //$fileName = $prefix."_".time().".txt";
        $log_base_dir = dirname(getcwd()) . "/log/";
        $time = $time ? "_".time() : "";
        $fileName = $log_base_dir . $prefix.$time . ".log";
        if(file_exists($fileName)){
            $myfile = fopen($fileName, "a") or die("Unable to open file!");
            if(is_array($txt)){
                $txt = PHP_EOL.json_encode($txt);
            }
        }else{
            $myfile = fopen($fileName, "w") or die("Unable to open file!");
            if(is_array($txt)){
                $txt = json_encode($txt);
            }
        }
        fwrite($myfile, $txt);
        fclose($myfile);
    }


}
