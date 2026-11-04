<?php

/**
 * Class Eventlog 记录类
 */
class Eventlog extends Base
{
    public function __construct($_p = [])
    {
        parent::__construct($_p);
    }

    public function orderBy(){
        $order = "";
        if(isset($this->param["sortName"])){
            $name = "logintime";
            switch ($this->param["sortName"]){
                case "adddate":
                    $name = "logintime";
                    break;
            }
            $type = "ASC";
            if($this->param["sortType"] == "down"){
                $type = " DESC";
            }
            $order = " ORDER BY {$name} {$type}";
        }
        return $order;
    }

    public function getWhere(){

    }

    public function get_my_activities(){
        $p = $this->param;
        $table_log = $this->tables[$p["login_layer"]]["t_record"];
        $table = $this->tables[$p["login_layer"]]["t"];
        $name = $this->tables[$p["login_layer"]]["name"];
        $between = date_between($p["sortDate"]);
        $start = strtotime($between["start"]);
        $end = strtotime($between["end"]);
        $where = " AND `logintime` BETWEEN {$start} AND {$end}";
        if($this->user["isMaster"] == 1){
            $where .= " AND `sub_id`={$p["layer_id"]}";
        }else{
            $where .= " AND `gid`={$p["layer_id"]} AND `sub_id`=`gid`";
        }
        $order = $this->orderBy();
        $rs = $this->dbc->select("SELECT * FROM {$table_log} WHERE `nid` LIKE '{$this->sup["nid"]}%'  {$where} {$order}","All");
        if(!$rs){
            return ["outData"=>[]];
        }


        $outData = [];
        foreach ($rs as $v){
            //$activities_user = $name;
            $master = $this->sup["name"];
            $uname = $master;
            if($this->user["isMaster"]==0){
                $uname .= "(主)";
            }
            $uname_type = $name;
            if($this->user["isMaster"] == 1){//子账号
                $uname = $this->user["name"]."(子)";
                $uname_type .= "[主:{$master}]";
            }

            $outData[] = [
                "adddate" => date("Y-m-d H:i:s",$v["logintime"]),
                "uname" => $uname."|".$uname_type,
                "ip" => $v["loginip"],
                "activities" => $v["info"]
            ];
        }

        $this->insertLog("个人中心->我的活动轨迹");
        return ["outData"=>$outData];
    }

    public function get_acc_eventlog(){
        $p = $this->param;
        $table_log = $this->tables[$p["showLayer"]]["t_record"];
        $table = $this->tables[$p["showLayer"]]["t"];
        $name = $this->tables[$p["showLayer"]]["name"];
        $between = date_between($p["sortDate"]);
        $start = strtotime($between["start"]);
        $end = strtotime($between["end"]);
        $where = " AND `logintime` BETWEEN {$start} AND {$end}";
        if(isset($p["user_type"]) && $p["user_type"] == 2){
            $where .= " AND `sub_id`={$p["showId"]}";
        }else{
            $where .= " AND `gid`={$p["showId"]}";
        }
        $order = $this->orderBy();
        $rs = $this->dbc->select("SELECT * FROM {$table_log} WHERE `nid` LIKE '{$this->sup["nid"]}%'  {$where} {$order}","All");
        if(!$rs){
            return ["outData"=>[]];
        }

        $sub_rs = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$p["showId"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
        $outData = [];
        foreach ($rs as $v){
            //$activities_user = $name;
            $master = $sub_rs["name"];
            $uname = $master;
            if(isset($v["isMaster"])){
                $uname .= "(主)";
            }
            $uname_type = $name;
            if(isset($v["isMaster"]) && $v["isMaster"] == 1){//子账号
                $uname = $sub_rs["name"]."(子)";
                $uname_type .= "[主:{$this->sup["name"]}]";
            }

            $outData[] = [
                "adddate" => date("Y-m-d H:i:s",$v["logintime"]),
                "uname" => $uname."|".$uname_type,
                "ip" => $v["loginip"],
                "activities" => $v["info"]
            ];
        }

        $this->insertLog("账户管理->{$name}->修改账号[{$sub_rs["name"]}]->查看记录");
        return ["outData"=>$outData];
    }

    public function get_log_login(){
        $p = $this->param;
        $smn = $this->son_nid_manger();
        $table_log = $this->tables[$p["showLayer"]]["t_login_log"];
        $table = $this->tables[$p["showLayer"]]["t"];
        $name = $this->tables[$p["showLayer"]]["name"];
        $between = date_between($p["sortDate"]);
        $start = strtotime($between["start"]);
        $end = strtotime($between["end"]);
        $where = " AND `logintime` BETWEEN {$start} AND {$end}";
        $order = $this->orderBy();
        $rs = $this->dbc->select("SELECT * FROM {$table_log} WHERE `nid` LIKE '{$this->sup["nid"]}%'  {$where} {$order}","All");
        if(!$rs){
            return ["outData"=>[]];
        }

        $sub_rs = $this->dbc->select("SELECT * FROM {$table} WHERE `nid` LIKE '{$this->sup["nid"]}%'","All");
        $sub_ids = array_column($sub_rs,"id");
        $outData = [];
        foreach ($rs as $v){
            $isOK = "N";
            if($smn === false){
                $isOK = "Y";
            }else{
                $nid = $this->get_manger_acc_nid($p["showLayer"],$v["nid"]);
                if(in_array($nid,$smn)){
                    $isOK = "Y";
                }
            }
            if($isOK == "Y") {
                $activities_user = $name;
                $master = $sub_rs[array_search($v["gid"], $sub_ids)]["name"];
                $uname = $master;
                if (isset($v["isMaster"])) {
                    $uname .= "(主)";
                }
                $uname_type = $name;
                if (isset($v["isMaster"]) && $v["isMaster"] == 1) {//子账号
                    $uname = $sub_rs[array_search($v["sub_id"], $sub_ids)]["name"] . "(子)";
                    $uname_type .= "[主:{$master}]";
                }

                $outData[] = [
                    "adddate" => date("Y-m-d H:i:s", $v["logintime"]),
                    "uname" => $uname . "|" . $uname_type,
                    "ip" => $v["loginip"],
                    "address" => $v["ip_address"],
                    "url" => $v["loginurl"],
                    "activities" => "登陆"
                ];
            }
        }

        $this->insertLog("日志管理->{$name}->登陆日志");
        return ["outData"=>$outData];
    }

    /**
     * 活动轨迹
     */
    public function get_record(){
        global $ls_msg;
        $p = $this->param;
        $ls = $ls_msg[$p["langx"]];
        if(isset($p["action"]) && $p["action"]=="app"){
            if(!isset($p["view_id"]) || !isset($p["view_user"]) || !is_numeric($p["view_id"]) || !isset($p["view_user"])){
                return ["status"=>"error","msg"=>$ls["0X003"]];
            }
            $p["id"] = $p["view_id"];

            if(!isset($p["view_layer"]) || empty($p["view_layer"]) || !array_key_exists($p["view_layer"],$this->tables)){
                return ["status"=>"error","msg"=>$ls["0X003"]];
            }

            $p["layer"] = $p["view_layer"];
        } else {
            if(!isset($p["id"]) || empty($p["id"]) || !is_numeric($p["id"])){
                return ["status"=>"error","msg"=>$ls["0X003"]];
            }

            if(!isset($p["layer"]) || empty($p["layer"]) || !array_key_exists($p["layer"],$this->tables)){
                return ["status"=>"error","msg"=>$ls["0X003"]];
            }
        }


        $arr = [];
        $where = "";
        $table = $this->tables[$p["layer"]]["t"];
        if($p["layer"]!=Constant::MEM){
            $where .= " AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' ";
        }else{
            $where .= "AND `nid` LIKE '{$this->sup["nid"]}%' ";
            switch ($p["layer"]){
                case Constant::AD:
                    $where .= " AND `level`=1 ";
                    break;
                case Constant::D0:
                    $where .= " AND `level`=4";
                    break;
                case Constant::CO:
                    $where .= " AND `level`=3";
                    break;
                case Constant::SU:
                    $where .= " AND `level`=2";
                    break;
                case Constant::AG:
                    $where .= " AND `level`=1";
                    break;
            }
        }

        if(isset($p["view_user"])){ $where.=" AND `name`='{$p["view_user"]}'";}
        $rs = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$p["id"]} {$where}","Row");
        if(!$rs){return ["status"=>"error","msg"=>$ls["4X008"]];}

        $arr["status"] = "success";
        $data = [];
        switch ($p["layer"]){
            case Constant::MEM:
            case Constant::AG:
                $ag_nid = sup_nid(Constant::AG, $rs["nid"]);
                $data[Constant::AG] = $this->getRecords(Constant::AG, $ag_nid);
            case Constant::SU:
                if($this->login_layer == Constant::AD || $this->login_layer == Constant::ADS
                    || $this->login_layer == Constant::D0 || $this->login_layer == Constant::CO) {
                    $su_nid = sup_nid(Constant::SU, $rs["nid"]);
                    $data[Constant::SU] = $this->getRecords(Constant::SU, $su_nid);
                }
            case Constant::CO:
                if($this->login_layer == Constant::AD || $this->login_layer == Constant::ADS
                    || $this->login_layer == Constant::D0) {
                    $co_nid = sup_nid(Constant::CO, $rs["nid"]);
                    $data[Constant::CO] = $this->getRecords(Constant::CO, $co_nid);
                }
            case Constant::D0:
                if($this->login_layer == Constant::AD || $this->login_layer == Constant::ADS ) {
                    $d0_nid = sup_nid(Constant::D0, $rs["nid"]);
                    $data[Constant::D0] = $this->getRecords(Constant::D0, $d0_nid);
                }
            case Constant::AD:
                if($this->login_layer == Constant::ADS) {
                    if (strlen($this->sup["nid"]) == 16) {
                        $ad_nid = sup_nid(Constant::AD, $rs["nid"]);
                        $data[Constant::AD] = $this->getRecords(Constant::AD, $ad_nid);
                    }
                }
        }
        $arr["data"] = $data;

        $this->insertLog("查看[在线{$this->tables[$p["layer"]]["name"]}]->[账号:{$rs["name"]}]及上级活动轨迹");
        return $arr;
    }

    public function getRecords($layer,$nid){
        global $ls_msg;
        $p = $this->param;
        $ls = $ls_msg[$p["langx"]];
        $d = $this->dbc->select("SELECT `a`.*,`b`.`name`,`b`.`isMaster` FROM {$this->tables[$layer]["t_record"]} AS `a` LEFT JOIN {$this->tables[$layer]["t"]} AS `b` ON `a`.`nid`=`b`.`nid` WHERE `a`.`nid`='{$nid}' ORDER BY `a`.`logintime` DESC LIMIT 0,50","All");
        if(!$d){ return [];}
        $arr = [];
        foreach ($d as $k => $v){
            $data = [];
            $data["username"] = $v["name"].($v["isMaster"] == 1 ? "[子]" : "[主]");
            $data["ip"] = isset($v["loginip"]) ? $v["loginip"] : $v["ip"];
            $data["time"] = date("Y-m-d H:i:s",$v["logintime"]);
            $data["content"] = $v["info"];
            $data["color"] = 0;
            if((time() - $v["logintime"])<=20){
                $data["color"] = 1;
            }
            $arr[] = $data;
        }

        return $arr;
    }

    public function get_acc_creditlogs(){
        $data = [
            "outData"=>[]
        ];
        $p = $this->param;
        $showId = $p["showId"];
        $showLayer = $p["showLayer"];
        $mTable = Constant::T_MEMBER;
        if($showLayer == Constant::AG){
            $mTable = Constant::T_RANK;
        }

        $mem = $this->dbc->select("SELECT * FROM {$mTable} WHERE `id`={$showId} AND `nid`LIKE '{$this->sup["nid"]}%'","Row");
        if($mem){
            $table = Constant::T_CREDIT_LOG;
            $between = date_between($p["sortDate"]);
            $start = strtotime($between["start"]);
            $end = strtotime($between["end"]);
            $where = " AND `logintime` BETWEEN {$start} AND {$end}";
            $order = $this->orderBy();
            $rs = $this->dbc->select("SELECT * FROM {$table}  WHERE `nid`='{$mem["nid"]}'  {$where} {$order}");
            $outData = [];
            if($rs) {
                foreach ($rs as $v) {
                    $ary = [];
                    $ary["adddate"] = date("Y-m-d H:i:s",$v["logintime"]);
                    $ary["old_cash"] = $v["old_cash"];
                    $ary["new_cash"] = $v["new_cash"];
                    $ary["withdrawal"] = 0;
                    $ary["deposit"] = 0;
                    if($v["type"] == "Y"){
                        $ary["deposit"] = $v["cash"];
                    }else{
                        $ary["withdrawal"] = $v["cash"];
                    }
                    $ary["chg_value"] = $v["cash"];
                    if($showLayer == Constant::AG) {
                        $chg_user = "";
                        if (!empty($v["s_name"])) {
                            $chg_user .= "(主)" . $v["s_name"];
                        } else {
                            $chg_user .= "自动";
                        }

                        if (!empty($v["ss_name"])) {
                            $chg_user = "(子)" . $v["ss_name"] . "[主:{$v["s_name"]}]";
                        }
                    }else{
                        $chg_user = $v["s_name"];
                    }

                    $ary["chg_user"] = $chg_user;
                    $ary["chg_site"] = $v["usertype"];
                    $outData[] = $ary;
                }
            }
            $lv_name = lv_nid($mem["nid"])["name"];
            $this->insertLog("账号管理->{$lv_name}->{$mem["name"]}->额度修改记录");
            $data = ["outData"=>$outData];
        }
        return $data;
    }



    /**
     * 记录查询
     * @return array[]
     */
    public function get_log_record(){
        $p = $this->param;
        $smn = $this->son_nid_manger();
        $table_log = $this->tables[$p["showLayer"]]["t_record"];
        $table = $this->tables[$p["showLayer"]]["t"];
        $name = $this->tables[$p["showLayer"]]["name"];
        $between = date_between($p["sortDate"]);
        $start = strtotime($between["start"]);
        $end = strtotime($between["end"]);
        $where = " AND `logintime` BETWEEN {$start} AND {$end}";
        $order = $this->orderBy();
        $rs = $this->dbc->select("SELECT * FROM {$table_log} WHERE `nid` LIKE '{$this->sup["nid"]}%'  {$where} {$order}","All");
        if(!$rs){
            return ["outData"=>[]];
        }

        $sub_rs = $this->dbc->select("SELECT * FROM {$table} WHERE `nid` LIKE '{$this->sup["nid"]}%'","All");
        $sub_ids = array_column($sub_rs,"id");
        $outData = [];
        foreach ($rs as $v){
            $isOK = "N";
            if($smn===false){
                $isOK = "Y";
            }else{
                $nid = $this->get_manger_acc_nid($p["showLayer"],$v["nid"]);
                if(in_array($nid,$smn)){
                    $isOK = "Y";
                }
            }
            if($isOK == "Y") {
                $activities_user = $name;
                $master = $sub_rs[array_search($v["gid"], $sub_ids)]["name"];
                $uname = $master;
                if (isset($v["isMaster"])) {
                    $uname = "(主)" . $uname;
                }
                $uname_type = $name;
                if (isset($v["isMaster"]) && $v["isMaster"] == 1) {//子账号
                    $uname = "(子)" . $sub_rs[array_search($v["sub_id"], $sub_ids)]["name"];
                    $uname_type .= "[主:{$master}]";
                }

                $outData[] = [
                    "adddate" => date("Y-m-d H:i:s", $v["logintime"]),
                    "uname" => $uname . "|" . $uname_type,
                    "ip" => $v["loginip"],
                    "activities" => $v["info"]
                ];
            }
        }
        $this->insertLog("日志管理->{$name}->查看记录");
        return ["outData"=>$outData];
    }

    /**
     * 获取指定时间戳之后的新登录事件（供后台“登录提示音”轮询使用）
     *
     * 请求参数（$this->param）：
     *   since  int    客户端上次查询的服务器时间戳，仅返回 logintime > since 的记录
     *   layers string 逗号分隔的监听层，取值 mem / ag，默认 "mem,ag"
     *   max    int    单次最多返回条数，限制 1-50，默认 20
     *
     * 返回：
     *   [
     *     "status"      => "success" | "error",
     *     "server_time" => int,   // 当前服务器时间戳，前端下次轮询用作 since
     *     "events"      => [ ["layer","name","logintime","loginip","ip_address", ...], ... ]
     *   ]
     */
    public function get_new_login(){
        $p = $this->param;

        // 只允许管理端调用（会员自己不能查）
        $allow_layers = [Constant::AD, Constant::ADS, Constant::D0, Constant::CO, Constant::SU, Constant::AG];
        if (!in_array($this->login_layer, $allow_layers)) {
            return ["status"=>"error", "msg"=>"permission denied", "server_time"=>time(), "events"=>[]];
        }

        // 参数解析
        $since = isset($p["since"]) ? intval($p["since"]) : 0;
        if ($since < 0) $since = 0;
        $max = isset($p["max"]) ? intval($p["max"]) : 20;
        if ($max < 1)  $max = 1;
        if ($max > 50) $max = 50;

        $layers_raw = isset($p["layers"]) ? strtolower($p["layers"]) : "mem,ag";
        $layers_raw = preg_replace('/[^a-z,]/', '', $layers_raw);
        $layers = array_values(array_filter(array_unique(explode(",", $layers_raw))));
        if (empty($layers)) $layers = ["mem", "ag"];

        $sup_nid = isset($this->sup["nid"]) ? $this->sup["nid"] : '';
        // 防 SQL 注入：nid 只应包含十六进制/字母数字，这里进一步转义
        $sup_nid_escaped = str_replace(["'", "\\", "%", "_"], ['', '', '\\%', '\\_'], $sup_nid);

        $events = [];

        // ============ 会员登录 mem_login_log ============
        if (in_array("mem", $layers)) {
            $log_table  = Constant::T_MEMBER_LOGIN_LOG;
            $user_table = Constant::T_MEMBER;
            $sql = "SELECT l.`logintime`, l.`loginip`, l.`ip_address`, l.`nid`, u.`name`
                    FROM {$log_table} AS l
                    LEFT JOIN {$user_table} AS u ON u.`nid` = l.`nid`
                    WHERE l.`logintime` > {$since}
                      AND l.`nid` LIKE '{$sup_nid_escaped}%'
                    ORDER BY l.`logintime` ASC
                    LIMIT {$max}";
            $rs = $this->dbc->select($sql, "All");
            if ($rs) {
                foreach ($rs as $v) {
                    $events[] = [
                        "layer"      => "mem",
                        "name"       => !empty($v["name"]) ? $v["name"] : "",
                        "logintime"  => intval($v["logintime"]),
                        "loginip"    => isset($v["loginip"]) ? $v["loginip"] : "",
                        "ip_address" => isset($v["ip_address"]) ? $v["ip_address"] : "",
                    ];
                }
            }
        }

        // ============ 代理登录 ag_login_log（AG/SU/CO/D0 共用）============
        if (in_array("ag", $layers)) {
            $log_table  = Constant::T_RANK_LOGIN_LOG;
            $user_table = Constant::T_RANK;
            $sql = "SELECT l.`logintime`, l.`loginip`, l.`ip_address`, l.`nid`, l.`isMaster`, u.`name`
                    FROM {$log_table} AS l
                    LEFT JOIN {$user_table} AS u ON u.`nid` = l.`nid` AND u.`isMaster` = l.`isMaster`
                    WHERE l.`logintime` > {$since}
                      AND l.`nid` LIKE '{$sup_nid_escaped}%'
                    ORDER BY l.`logintime` ASC
                    LIMIT {$max}";
            $rs = $this->dbc->select($sql, "All");
            if ($rs) {
                foreach ($rs as $v) {
                    $events[] = [
                        "layer"      => "ag",
                        "name"       => !empty($v["name"]) ? $v["name"] : "",
                        "logintime"  => intval($v["logintime"]),
                        "loginip"    => isset($v["loginip"]) ? $v["loginip"] : "",
                        "ip_address" => isset($v["ip_address"]) ? $v["ip_address"] : "",
                        "is_sub"     => (isset($v["isMaster"]) && intval($v["isMaster"]) === 1) ? 1 : 0,
                    ];
                }
            }
        }

        // 合并后按时间升序（保证前端取最后一条作为下次 since 备份）
        usort($events, function($a, $b){ return $a["logintime"] - $b["logintime"]; });

        return [
            "status"      => "success",
            "server_time" => time(),
            "events"      => $events,
        ];
    }
}