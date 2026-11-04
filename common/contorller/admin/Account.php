<?php
/**
 * Class Account 账户类
 */

class Account extends Base
{
    public function __construct($_p = [])
    {
        parent::__construct($_p);
    }



    /**
     * 在线玩家
     */
    public function online(){
        global $out_time,$online_name;
        $on = $online_name[$this->langx];
        $p = $this->param;
        $el = $this->edit_bet_layer();
        $type = lv_nid($this->sup["nid"])["lv"];
        $arr = [];
        $time = time();
        $ad_table = Constant::T_ADMIN;
        $ag_table = Constant::T_RANK;
        $mem_table = Constant::T_MEMBER;
        $son_nid_manger = $this->son_nid_manger();
        //20分钟内在线
        if($p["chk_mem"] == "Y") {//头部显示在线人数
            $table_ary = [Constant::T_MEMBER,Constant::T_RANK,Constant::T_ADMIN];
            foreach ($table_ary as $t){//提线2小时不活动的玩家
                $ttt = sha1(time().rand(1000000,9999999));
                $ups = [
                    "isout" => 0,
                    "uid" => sha1($ttt)
                ];
                $time = time();
                $ouwhere = "`isout`=1 AND ({$time} - `lastdate`)>3*60*60 AND LENGTH(`nid`)>16 and `uid`<>'{$ttt}'";
                $this->dbc->update($t,$ups,$ouwhere);
            }
            switch ($type) {
                case Constant::ADS:
                    if(isset($el["td_layer"]["CO"])) {
                        $arr["ad"] = [
                            "NAME" => "线上公司",
                            "LAYER" => Constant::AD,
                            "COUNT" => 0
                        ];
                        if ($son_nid_manger === false) {
                            $arr["ad"]["COUNT"] = $this->dbc->getCount($ad_table, "id", "`status` IN (1,3)  AND ({$time} - `lastdate`)<20*60  AND `isout`=1 AND `level`=1");
                        } else {//子帐号管理下线
                            if (count($son_nid_manger) > 0) {
                                $ad = $this->dbc->select("SELECT `nid` FROM {$ad_table} WHERE `status` IN (1,3)  AND ({$time} - `lastdate`)<20*60  AND `isout`=1 AND `level`=1");
                                foreach ($ad as $v) {
                                    if (in_array($v["nid"], $son_nid_manger)) {
                                        $arr["ad"]["COUNT"]++;
                                    }
                                }
                            }
                        }
                    }
                case Constant::AD:
                    if(isset($el["td_layer"]["D0"])) {
                        $arr["d0"] = [
                            "NAME" => "线上分公司",
                            "LAYER" => Constant::D0,
                            "COUNT" => 0
                        ];
                        $ww = "`status` IN (1,3) AND ({$time} - `lastdate`)<20*60  AND `isout`=1 AND `level`=4 AND `nid` LIKE '{$this->sup["nid"]}%'";
                        if ($son_nid_manger === false) {
                            $arr["d0"]["COUNT"] = $this->dbc->getCount($ag_table, "id", $ww);
                        } else {
                            if (count($son_nid_manger) > 0) {
                                $d0 = $this->dbc->select("SELECT `nid` FROM {$ag_table} WHERE {$ww}");
                                foreach ($d0 as $v) {
                                    $nid = $this->get_manger_acc_nid(Constant::AD,$v["nid"]);
                                    if (in_array($nid, $son_nid_manger)) {
                                        $arr["d0"]["COUNT"]++;
                                    }
                                }
                            }
                        }
                    }
                case Constant::D0:
                    if(isset($el["td_layer"]["CO"])) {
                        $arr["co"] = [
                            "NAME" => "线上股东",
                            "LAYER" => Constant::CO,
                            "COUNT" => 0
                        ];

                        $ww_co = "`status` IN (1,3)  AND ({$time} - `lastdate`)<20*60  AND `isout`=1 AND `level`=3 AND `nid` LIKE '{$this->sup["nid"]}%'";
                        if($son_nid_manger === false) {
                            $arr["co"]["COUNT"] = $this->dbc->getCount($ag_table, "id", $ww_co);
                        }else{
                            if(count($son_nid_manger)>0){
                                $co = $this->dbc->select("SELECT `nid` FROM {$ag_table} WHERE {$ww_co}");
                                foreach ($co as $v){
                                    $nid = $this->get_manger_acc_nid(Constant::D0,$v["nid"]);
                                    if(in_array($nid,$son_nid_manger)){
                                        $arr["co"]["COUNT"]++;
                                    }
                                }
                            }
                        }
                    }

                case Constant::CO:
                    if(isset($el["td_layer"]["SU"])) {
                        $arr["su"] = [
                            "NAME" => $on["su"],
                            "LAYER" => Constant::SU,
                            "COUNT" => 0
                        ];
                        $ww_su = "`status` IN (1,3)  AND ({$time} - `lastdate`)<20*60  AND `isout`=1 AND `level`=2 AND `nid` LIKE '{$this->sup["nid"]}%'";
                        if($son_nid_manger === false) {
                            $arr["su"]["COUNT"] = $this->dbc->getCount($ag_table, "id", $ww_su);
                        }else{
                            if(count($son_nid_manger)>0){
                                $su = $this->dbc->select("SELECT `nid` FROM {$ag_table} WHERE {$ww_su}");
                                foreach ($su as $v){
                                    $nid = $this->get_manger_acc_nid(Constant::CO,$v["nid"]);
                                    if(in_array($nid,$son_nid_manger)){
                                        $arr["su"]["COUNT"]++;
                                    }
                                }
                            }
                        }
                    }

                    if(isset($el["td_layer"]["AG"])) {
                        $arr["ag"] = [
                            "NAME" => $on["ag"],
                            "LAYER" => Constant::AG,
                            "COUNT" => 0
                        ];


                        $ww_ag = "`status` IN (1,3)  AND ({$time} - `lastdate`)<20*60  AND `isout`=1 AND `level`=1 AND `nid` LIKE '{$this->sup["nid"]}%'";
                        if ($son_nid_manger === false) {
                            $arr["ag"]["COUNT"] = $this->dbc->getCount($ag_table, "id", $ww_ag);
                        } else {
                            if (count($son_nid_manger) > 0) {
                                $ag = $this->dbc->select("SELECT `nid` FROM {$ag_table} WHERE {$ww_ag}");
                                foreach ($ag as $v) {
                                    $nid = $this->get_manger_acc_nid(Constant::SU,$v["nid"]);
                                    if (in_array($nid, $son_nid_manger)) {
                                        $arr["ag"]["COUNT"]++;
                                    }
                                }
                            }
                        }
                    }
                case Constant::SU:
                case Constant::AG:
                    $arr["mem"] = [
                        "NAME" => $on["mem"],
                        "LAYER" => Constant::MEM,
                        "COUNT" => 0,
                        "HIDDEN" => "N"
                    ];
                    $ww = "`status` IN (1,3) AND ({$time} - `lastdate`)<20*60 AND `isout`=1 AND `nid` LIKE '{$this->sup["nid"]}%'";
                    if ($son_nid_manger === false) {
                        $arr["mem"]["COUNT"] = $this->dbc->getCount($mem_table, "id", $ww);
                    } else {
                        //print_r("SELECT `nid` FROM {$mem_table} WHERE {$ww}");exit;
                        if (count($son_nid_manger) > 0) {
                            $mem = $this->dbc->select("SELECT `nid` FROM {$mem_table} WHERE {$ww}");
                            foreach ($mem as $v) {
                                $nid = $this->get_manger_acc_nid(Constant::AG,$v["nid"]);
                                if (in_array($nid, $son_nid_manger)) {
                                    $arr["mem"]["COUNT"]++;
                                }
                            }
                        }
                    }

                    if(isset($el["td_layer"]["MEM"])) {
                        $arr["mem"]["HIDDEN"] = "Y";
                    }
            }
        }else{
            $where = " AND `isout`=1 ";
            if(isset($this->param["search"]) && !empty($this->param["search"])){
                if($p["layer"] == Constant::AD || $p["layer"] == Constant::ADS){
                    $where = " AND `name` LIKE '%{$this->param["search"]}%'";
                }else{
                    $where = " AND (`name` LIKE '%{$this->param["search"]}%' OR `loginname` LIKE '%{$this->param["search"]}%')";
                }

            }
            switch ($p["layer"]){
                case Constant::AD:
                case Constant::ADS:
                    $agr_table = Constant::T_ADMIN_RECORD;
                    $ag = $this->dbc->select("SELECT * FROM {$ad_table} WHERE `status` IN (1,3) AND `isMaster`=0 AND `level`=1 AND `nid` LIKE '{$this->sup["nid"]}%' {$where}","All");
                    if(!$ag){ return ["msg"=>"nodata"];}
                    foreach ($ag as $k => $v){
                        $agr = $this->dbc->select("SELECT MAX(`logintime`) AS `logintime`,`info` FROM {$agr_table} WHERE `gid`={$v["id"]} ORDER BY `logintime` DESC LIMIT 1","Row");
                        if($agr){
                            if(((time()-$agr["logintime"]) < $out_time)  || (isset($this->param["search"]) && !empty($this->param["search"]))){//20分钟内在线
                                $aa = [
                                    "username" => $v["name"],
                                    "time" => empty($agr["logintime"]) ? "-" : date("Y-m-d H:i:s",$agr["logintime"]),
                                    "ip" => empty($v["loginip"]) ? "-" : $v["loginip"],
                                    "content" => empty($agr["info"]) ? "-" : $agr["info"],
                                    "id" => $v["id"],
                                ];

                                if ($son_nid_manger === false) {
                                    $arr[] = $aa;
                                }else{
                                    if (count($son_nid_manger)>0) {//子账号管理的下线
                                        $nid = $v["nid"];
                                        if($p["layer"] == Constant::AD){
                                            $nid = $this->get_manger_acc_nid(Constant::AD,$nid);
                                        }
                                        if(in_array($nid, $son_nid_manger)){
                                            $arr[] = $aa;
                                        }
                                    }
                                }
                            }else{
                                $this->dbc->update($ad_table,["isout"=>0,"uid"=>"sadf"],"`id`={$v["id"]}");//20分钟没有活动自动提线
                            }
                        }
                    }
                    break;
                case Constant::D0:
                case Constant::CO:
                case Constant::SU:
                case Constant::AG:
                    switch($p["layer"]){
                        case Constant::D0: $where .= " AND `level`=4";break;
                        case Constant::CO: $where .= " AND `level`=3";break;
                        case Constant::SU: $where .= " AND `level`=2";break;
                        case Constant::AG: $where .= " AND `level`=1";break;
                    }
                    //print_r("SELECT * FROM {$ag_table} WHERE `status` IN (1,3) AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where}");exit;
                    $agr_table = Constant::T_RANK_RECORD;
                    $ag = $this->dbc->select("SELECT * FROM {$ag_table} WHERE `status` IN (1,3) AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where}","All");
                    if(!$ag){ return ["msg"=>"nodata"];}
                    foreach ($ag as $k => $v){
                        $agr = $this->dbc->select("SELECT MAX(`logintime`) AS `logintime`,`info` FROM {$agr_table} WHERE `gid`={$v["id"]} ORDER BY `logintime` DESC LIMIT 1","Row");
                        if($agr){
                            if(((time()-$agr["logintime"]) < $out_time)  || (isset($this->param["search"]) && !empty($this->param["search"]))){//20分钟内在线
                                $aa = [
                                    "username" => $v["name"],
                                    "time" => empty($agr["logintime"]) ? "-" : date("Y-m-d H:i:s",$agr["logintime"]),
                                    "ip" => empty($v["loginip"]) ? "-" : $v["loginip"],
                                    "content" => empty($agr["info"]) ? "-" : $agr["info"],
                                    "id" => $v["id"]
                                ];
                                if ($son_nid_manger === false) {
                                    $arr[] = $aa;
                                }else{
                                    if (count($son_nid_manger)>0) {//子账号管理的下线
                                        $nid = $v["nid"];
                                        switch ($type){
                                            case Constant::D0:
                                                $nid = $this->get_manger_acc_nid(Constant::D0,$v["nid"]);
                                                break;
                                            case Constant::CO:
                                                $nid = $this->get_manger_acc_nid(Constant::CO,$v["nid"]);
                                                break;
                                            case Constant::SU:
                                                $nid = $this->get_manger_acc_nid(Constant::SU,$v["nid"]);
                                                break;
                                            case Constant::AG:
                                                $nid = $this->get_manger_acc_nid(Constant::AG,$v["nid"]);
                                                break;
                                        }

                                        if(in_array($nid, $son_nid_manger)){
                                            $arr[] = $aa;
                                        }
                                    }
                                }
                            }else{
                                $this->dbc->update($ag_table,["isout"=>0,"uid"=>"sadf"],"`id`={$v["id"]}");//20分钟没有活动自动提线
                            }
                        }
                    }

                    break;
                default://在线会员
                    switch ($type) {
                        case Constant::ADS:
                        case Constant::AD:
                            $ad = $this->dbc->select("SELECT `loginip` FROM {$ad_table} WHERE `status` IN (1,3) AND `level`=1 AND `nid` LIKE '{$this->sup["nid"]}%'","All");//查询公司
                            $ag = $this->dbc->select("SELECT `loginip` FROM {$ag_table} WHERE `status` IN (1,3) AND `nid` LIKE '{$this->sup["nid"]}%'","All");//查询股东
                            break;
                        case Constant::D0:
                            $ag = $this->dbc->select("SELECT `loginip` FROM {$ag_table} WHERE `status` IN (1,3) AND `nid` LIKE '{$this->sup["nid"]}%'","All");//查询股东
                            break;
                    }

                    $where1 = " AND `nid` LIKE '{$this->sup["nid"]}%'";
                    if(isset($p["view_layer"])){

                        if(isset($p["view_id"]) && is_numeric($p["view_id"])){
                            $suTable = Constant::T_RANK;
                            $vid = $p["view_id"];
                            switch ($p["view_layer"]){
                                case Constant::ADS:
                                case Constant::AD:
                                    $suTable = Constant::T_ADMIN;
                                    break;
                                case Constant::D0:
                                case Constant::CO:
                                case Constant::SU:
                                case Constant::AG:
                                    $suTable = Constant::T_RANK;
                                    break;
                                default:
                                    return ["msg"=>"nodata"];
                                    break;
                            }
                            $suData = $this->dbc->select("SELECT `nid` FROM {$suTable} WHERE `id`={$vid} {$where1}","Row");
                            if(!$suData){
                                return ["msg"=>"nodata"];
                            }

                            $where1 = " AND `nid` LIKE '{$suData["nid"]}%'";
                            //print_r($where1);
                        }else{
                            return ["msg"=>"nodata"];
                        }
                    }
                    //print_r("SELECT * FROM {$mem_table} WHERE `status` IN (1,3) {$where1} {$where}");
                    $mem = $this->dbc->select("SELECT * FROM {$mem_table} WHERE `status` IN (1,3) {$where1} {$where}","All");
                    if(!$mem){
                        return ["msg"=>"nodata"];
                    }

                    foreach ($mem as $k => $v){
                        if(((time()-$v["lastdate"])<$out_time) || (isset($this->param["search"]) && !empty($this->param["search"]))) {
                            $ag = $this->dbc->select("SELECT `name` FROM {$ag_table} where `nid` like '".sup_nid('ag',$v['nid'])."'","Row");
                            $su = $this->dbc->select("SELECT `name` FROM {$ag_table} where `nid` like '".sup_nid('su',$v['nid'])."'","Row");
                            $co = $this->dbc->select("SELECT `name` FROM {$ag_table} where `nid` like '".sup_nid('co',$v['nid'])."'","Row");
                            $d0 = $this->dbc->select("SELECT `name` FROM {$ag_table} where `nid` like '".sup_nid('d0',$v['nid'])."'","Row");

                            $bet_table = Constant::T_BET;
                            $bet_date = date("Y-m-d");
                            $bet = $this->dbc->select("SELECT SUM(`bet_golds`) AS `gold`, COUNT(`id`) as `num` FROM {$bet_table} WHERE  `m_date`='{$bet_date}' AND `nid`='".$v['nid']."' AND `hidden`=0","Row");

                            $goldsss = $bet['gold'] ?:0;

                            $aa = [
                                "username" => $v["name"],
                                "shangx"=> $d0['name'].'->'.$co['name'].'->'.$su['name'].'->'.$ag['name'],
								"shangx0"=> $co['name'].'->'.$su['name'].'->'.$ag['name'],
                                "loginname" => empty($v["loginname"]) ? "-" : $v["loginname"],
                                "alias" => $v["alias"],
                                "lastdate" => empty($v["lastdate"]) ? "-" : date("Y-m-d H:i:s",$v["lastdate"]),
                                "adddate" => empty($v["lastdate"]) ? "-" : date("Y-m-d H:i:s",$v["lastdate"]),
                                "id" => $v["id"],
                                "gold"=>$goldsss ."(". $bet['num'] ."笔)"
                            ];
                            if(isset($el["td_layer"]["MEM"]) && count($el["td_online"])>0){ //权限
                                $aa["onlines"] = $el["td_online"];
                                if(isset($el["td_online"]["mes"]) && ($this->login_layer==Constant::ADS)){
                                    $aa["onlines"]["chat"] = "会话";
                                }
                                $aa["onlines"]["chat"] = "会话";
                                if(isset($el["td_online"]["domain"])){
                                    $aa["ip"] = empty($v["loginip"]) ? "-" : $v["loginip"];
                                    $aa["url"] = empty($v["logurl"]) ? "-" : $v["logurl"];
                                }
                            }
                            switch ($type) {
                                case Constant::ADS:
                                case Constant::AD:
                                    if (array_search($v["loginip"]??'', array_column($ad?:[], "loginip")) || array_search($v["loginip"]??'', array_column($ag?:[], "loginip"))) {//是否和上级ip相同
                                        $aa["sp"] = 1;
                                    } else {
                                        $aa["sp"] = 0;
                                    }
                                    break;
                                case Constant::D0:
                                    if (array_search($v["loginip"], array_column($ag, "loginip"))) {//是否和上级ip相同
                                        $aa["sp"] = 1;
                                    } else {
                                        $aa["sp"] = 0;
                                    }
                                    break;
                            }
                            if ($son_nid_manger === false) {
                                $arr[] = $aa;
                            }else {
                                if (count($son_nid_manger) > 0) {//子账号管理的下线
                                    $nid = $this->get_manger_acc_nid(Constant::MEM,$v["nid"]);
                                    if(in_array($nid, $son_nid_manger)){
                                        $arr[] = $aa;
                                    }
                                }
                            }
                        }else{
                            $this->dbc->update($mem_table,["isout"=>0,"uid"=>"sadf"],"`id`={$v["id"]}");//20分钟没有活动自动提线
                        }
                    }
                    break;
            }

            if(count($arr)==0){
                return ["msg"=>"nodata"];
            }

            $this->insertLog("查看[在线{$this->tables[$p["layer"]]["name"]}]");
        }
        return $arr;
    }
    /**
     * 上层账号查询
     * @param string $layer
     */
    public function uplayer_user($layer=Constant::AG){
        global $tables;
        $table = $filed = "";
        $level = 1;
        switch ($layer){
            case Constant::AD:
            case Constant::ADS:
                $table = $this->tables[Constant::AD]["t"];
                $level = 1;
                break;
            case Constant::D0:
                $table = $this->tables[Constant::D0]["t"];
                $level = 4;
                break;
            case Constant::CO:
                $table = $this->tables[Constant::CO]["t"];
                $level = 3;
                break;
            case Constant::SU:
                $table = $this->tables[Constant::SU]["t"];
                $level = 2;
                break;
            case Constant::AG:
                $table = $this->tables[Constant::AG]["t"];
                $level = 1;
                $filed = ",`pay_type`";
                break;
        }
        $sql = "SELECT `nid`,`id`,`name`AS `username`,`alias`,(CASE `status` WHEN 1 THEN 'Y'  WHEN 2 THEN 'N' WHEN 3 THEN 'S' WHEN 4 THEN 'F' END) AS `enable` {$filed} FROM {$table} WHERE `nid` LIKE '{$this->sup["nid"]}%' AND `isMaster` = 0 AND `level`={$level} ORDER BY `name` ASC,`adddate` DESC";
        LOG::write("mysql:", $sql);
        $rs = $this->dbc->select($sql,"All");
        if(!$rs){
            return ["status"=>"error","msg"=>"请先添加[".$tables[$layer]["name"]."]"];
        }else{
            $up_id = isset($this->param["up_id"]) ? $this->param["up_id"] : "";
            $is_up_id = "N";
            $smn = $this->son_nid_manger();
            $ary = [];
            if($smn === false || $this->login_layer==$layer){
                $ary = $rs;
                $ids = array_column($rs,"id");
                if(in_array($up_id,$ids)){
                    $is_up_id = "Y";
                }
            }else{
                foreach ($rs as $v){
                    $nid = $this->get_manger_acc_nid($layer,$v["nid"]);
                    if(in_array($nid,$smn)){
                        unset($v["nid"]);
                        if($v["id"]==$up_id){$is_up_id = "Y";}
                        $ary[] = $v;
                    }
                }
            }

            if($is_up_id == "N" || empty($up_id)){
                $up_id = isset($ary[0]["id"]) ? $ary[0]["id"] : "";
            }
            return ["status"=>"success","data"=>$ary,"up_id"=>$up_id];
        }
    }


    /**
     * 公司列表 查询
     * @return array
     */
    public function acc_ad_list(){
        $type = Constant::AD;
        return $this->getAccountList($type);
    }

    /**
     * 分公司列表 查询
     * $up_id 默认上级id
     * @return array
     */
    public function acc_d0_list($up_id=0){
        $type = Constant::D0;
        if(empty($this->param["up_id"])){
            $this->param["up_id"] = $up_id;
        }
        return $this->getAccountList($type);
    }

    /**
     * 股东列表 查询
     * $up_id 默认上级id
     * @return array
     */
    public function acc_co_list($up_id=0){
        $layer = Constant::CO;
        if(empty($this->param["up_id"])){
            $this->param["up_id"] = $up_id;
        }

        return $this->getAccountList($layer);
    }

    /**
     * 总代理列表 查询
     * $up_id 默认上级id
     * @return array
     */
    public function acc_su_list($up_id=0){
        $type = Constant::SU;
        if(empty($this->param["up_id"])){
            $this->param["up_id"] = $up_id;
        }
        return $this->getAccountList($type);
    }

    /**
     * 代理列表 查询
     * $up_id 默认上级id
     * @return array
     */
    public function acc_ag_list($up_id=0){
        $type = Constant::AG;
        if(empty($this->param["up_id"])){
            $this->param["up_id"] = $up_id;
        }
        return $this->getAccountList($type);
    }

    /**
     * 会员列表 查询
     * $up_id 默认上级id
     * @return array
     */
    public function acc_mem_list($up_id=0){
        $type = Constant::MEM;
        if(empty($this->param["up_id"])){
            $this->param["up_id"] = $up_id;
        }
        return $this->getAccountList($type);
    }

    public function sub_del(){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        $table = Constant::T_RANK;
        if($this->param["login_layer"] == Constant::AD || $this->param["login_layer"] == Constant::ADS){
            $table = Constant::T_ADMIN;
        }
        if(!isset($this->param["id"]) || empty($this->param["id"])){
            return ["status"=>"error","code"=>$ls["4X008"]];
        }

        $rs = $this->dbc->select("SELECT `name` FROM {$table} WHERE `id`={$this->param["id"]} AND `isMaster`=1 AND `nid`='{$this->sup["nid"]}'","Row");
        if(!$rs){
            return ["status"=>"error","code"=>$ls["0X003"]];
        }

        try{
            $this->dbc->delete($table,"`id`={$this->param["id"]} AND `isMaster`=1 AND `nid`='{$this->sup["nid"]}'");
            $this->insertLog('帐号管理->子账号->删除子账号[' . $rs["name"] . ']成功!');
            return ["status"=>"success","code"=>""];
        }catch (\Exception $e){
            return ["status"=>"error","code"=>$e->getMessage()];
        }
    }

    /**
     * 子账号列表 查询
     * $up_id 默认上级id
     * @return array
     */
    public function acc_sub_list(){
        $table = Constant::T_RANK;
        $where = "`nid`='{$this->sup["nid"]}' AND `isMaster`=1";
        if($this->param["login_layer"] == Constant::AD || $this->login_layer == Constant::ADS){
            $table = Constant::T_ADMIN;
            if(!empty($this->param["user_name"])){
                $where  .= " AND (`name` LIKE '{$this->param["user_name"]}%')";
            }
        }else{
            if(!empty($this->param["user_name"])){
                $where  .= " AND (`name` LIKE '{$this->param["user_name"]}%' OR `loginname` LIKE '{$this->param["user_name"]}%')";
            }
        }


        $order = $this->orderBy();
        //print_r("SELECT * FROM {$table} WHERE {$where} {$order}");exit;
        $rs = $this->dbc->select("SELECT * FROM {$table} WHERE {$where} {$order}","All");
        $arr = [];
        foreach ($rs as $v){
            $longerr = "";
            if($v["bandate"]>0 && $v["bandate"] > time() ){
                $longerr = "Y";
            }
            $pri = explode("-",$v["pri"]);
            $data = [];
            $data["pri_A"] = in_array("A",$pri) ? "ok" : "no";
            $data["pri_B"] = in_array("B",$pri) ? "ok" : "no";
            $data["pri_B1"] = in_array("B1",$pri) ? "ok" : "no";
            $data["pri_B2"] = in_array("B2",$pri) ? "ok" : "no";
            $data["pri_C"] = in_array("C",$pri) ? "ok" : "no";
            $data["acc_id"] = $this->sup["id"];
            $data["adddate"]= date("Y-m-d H:i:s",$v["adddate"]);
            $data["alias"] = $v["alias"];
            $data["id"] = $v["id"];
            $data["layer"] = $this->param["login_layer"];
            $data["longerr"] = $longerr;
            $data["user_type"] = 2;
            $data["username"] = $v["name"];
            $data["status"] = $v["status"];
            $data["pw"] = isset($v["pw"]) ? $v["pw"] : "";
            switch($this->param["login_layer"]){
                case Constant::CO:
                case Constant::SU:
                    $data["passwd_safe"] = $v["pwd_safe"];
                    break;
                case Constant::AG:
                    $data["passwd_safe"] = $v["loginname"];
                    break;
            }

            $arr[] = $data;
        }

        return $arr;
    }

    /**
     * 账号列表查询
     * @param string $type
     * @return array
     */
    public function getAccountList($layer=Constant::MEM){
        global $currencys,$ltypes;
        $sup = $this->sup;
        $data = [];
        $table = $this->tables[$layer]["t"];
        $where = "";

        if($layer != Constant::AD && $layer != Constant::ADS){
            if(!empty($this->param["user_name"])){
                $where  .= " AND (`name` LIKE '{$this->param["user_name"]}%' OR `loginname` LIKE '{$this->param["user_name"]}%')";
            }
            switch ($layer){
                case Constant::D0:
                    $where .= " AND `level` = 4";
                    break;
                case Constant::CO:
                    $where .= " AND `level` = 3";
                    break;
                case Constant::SU:
                    $where .= " AND `level` = 2";
                    break;
                case Constant::AG:
                    $where .= " AND `level` = 1";
                    break;
            }

            if(isset($this->param["pay_type"]) && $this->param["pay_type"]!="ALL"){
                $where .= " AND `pay_type`={$this->param["pay_type"]}";
            }

            $up_id = $this->param["up_id"];
            $up_username = "";
            if(!empty($this->param["up_id"]) && empty($this->param["user_name"])){
                if($layer == Constant::D0){
                    $ta = Constant::T_ADMIN;
                    $up_field = "`nid`,`name`";
                }else{
                    $ta = Constant::T_RANK;
                    $up_field = "`nid`,`name`,`credit`";
                }
                $uprs = $this->dbc->select("SELECT {$up_field} FROM {$ta} WHERE `id`={$this->param["up_id"]} AND `nid` LIKE '{$sup["nid"]}%'","Row");
                if(!empty($uprs)){
                    $up_username = $uprs["name"];
                    $where .= " AND `nid` LIKE '{$uprs["nid"]}_%'";
                }else{
                    $where .= " AND `nid` LIKE '{$sup["nid"]}%'";
                }

            }else{
                $where .= " AND `nid` LIKE '{$sup["nid"]}%'";
            }

        }else{
            if(!empty($this->param["user_name"])){
                $where  .= " AND `name` LIKE '{$this->param["user_name"]}%'";
            }

            $where .= " AND `nid` LIKE '{$sup["nid"]}%'";
        }

        /*if(!empty($this->param["enable"]) && $this->param["enable"] != "ALL"){
            $status = status_num_str(1,$this->param["enable"]);
            if($this->param["enable"] == 3){
                $time = time();
                $where .= " AND (`status`='{$status}' OR (`enddate`>0 AND `endata`<'{$time}'))";
            }else{
                $where .= " AND `status`='{$status}'";
            }

        }*/

        $order = $this->orderBy();
        if($layer!=Constant::MEM){
            $where .= " AND `isMaster`=0 ";
        }
        //print_R("SELECT * FROM {$table} WHERE `id`>0 {$where} {$order}");exit;
        $rows = $this->dbc->select("SELECT * FROM {$table} WHERE `id`>0 {$where} {$order}");
        foreach ($rows as $rs){
            $rt = Constant::T_RANK;
            $mt = Constant::T_MEMBER;
            if($layer != Constant::AG && $layer != Constant::MEM){
                $csql = "SELECT ";
                switch ($layer){
                    case Constant::ADS:
                    case Constant::AD:
                        $csql .= "SUM(IF(`level`=4,1,0)) AS `d0`,";
                    case Constant::D0:
                        $csql .= "SUM(IF(`level`=3,1,0)) AS `co`,";
                    case Constant::CO:
                        $csql .= "SUM(IF(`level`=2,1,0)) AS `su`,";
                    case Constant::SU:
                        $csql .= "SUM(IF(`level`=1,1,0)) AS `ag`";
                }
                $csql .= " FROM {$rt} WHERE `nid` LIKE '{$rs["nid"]}_%' AND `isMaster`=0 LIMIT 1";
                $lower = $this->dbc->select($csql,'Row');
            }

            $mem = $this->dbc->getCount($mt,"`id`","`nid` LIKE '{$rs["nid"]}_%'");
            $longerr = "";
            if($rs["bandate"]>0 && $rs["bandate"] > time() ){
                $longerr = "Y";
            }
            /*lower_count*/
            $status = $this->getAccountStatus($rs["nid"]);
            $is_banned = $this->getIsBanned($rs["id"]);
            $enable = status_num_str(2,$status);
            $enable = $enable=="E" ? "S" : $enable;
            $isarr = false;

            if(!empty($this->param["enable"]) && $this->param["enable"] != "ALL") {
                if($enable == $this->param["enable"]){
                    $arr =[
                        "id" => $rs["id"],
                        "user_id" => $rs["id"],
                        "user_type" => "1",
                        "username" => $rs["name"],
                        "adddate" => date("Y-m-d H:i:s",$rs["adddate"]),
                        "alias" =>  $rs["alias"],
                        "enable" => $enable,
                        "is_banned" => $is_banned,
                        "longerr" => $longerr,
						"pw" => $rs["pw"],
                        "up_id" => empty($this->param["up_id"]) ? 0 : $this->param["up_id"],
                        "up_username" => empty($up_username) ? "" : $up_username
                    ];
                    if($this->login_layer==Constant::ADS || $this->login_layer==Constant::AD){
                        $arr["pw"] = empty($rs["pw"]) ? "" : $rs["pw"];
                    }
                    $isarr = true;
                }

            }else{
                $arr =[
                    "id" => $rs["id"],
                    "user_id" => $rs["id"],
                    "user_type" => "1",
                    "username" => $rs["name"],
                    "adddate" => date("Y-m-d H:i:s",$rs["adddate"]),
                    "alias" =>  $rs["alias"],
                    "enable" => $enable,
                    "is_banned" => $is_banned,
                    "longerr" => $longerr,
                    "pw" => $rs["pw"],
                    "up_id" => $this->param["up_id"],
                    "up_username" => $up_username
                ];
                $isarr = true;
            }


            if($isarr){
                switch ($layer){
                    case Constant::CO:
                    case Constant::SU:
                        $arr["passwd_safe"] = $rs["pwd_safe"];
                        break;
                    case Constant::AG:
                        $arr["passwd_safe"] = $rs["loginname"];
                        $arr["pay_type"] = $rs["pay_type"];
                        break;
                    case Constant::MEM:
                        $arr["passwd_safe"] = $rs["loginname"];
                        $arr["loginname"] = $rs["loginname"];
                        $arr["pay_type"] = $rs["pay_type"];
                        $currency = $currencys[$this->langx][$rs["currency"]];
                        $arr["currency"] = $currency["name"];
                        $arr["currency_code"] = $currency["code"];
                        $arr["currency_value"] = $currency["value"];
                        $arr["ltype"] = array_search($rs["ltype"],$ltypes);
                        $arr["maxcredit_RMB"] = $rs["credit"] * $currency["value"];
                        $arr["odd_f"] = "H,M,I,E";
                        if($this->login_layer == Constant::ADS || $this->login_layer == Constant::AD){
                            $arr["setip"] = $rs["setip"];
                            $arr["seturl"] = $rs["seturl"];
                            $arr["hidden"] = $rs["hidden"]==1 ? "Y" : "N";
                        }
                        break;
                }
                if($layer == Constant::AD || $layer == Constant::ADS){
                    $arr["level"] = $rs["level"] == 1 ? "公司" : "超管员";
                }else{//查询额度
                    if($layer != Constant::D0){
                        if(!isset($uprs) || count($uprs)==0) {
                            $up_nid = substr($rs["nid"],0,strlen($rs["nid"])-16);
                            $uprs = $this->dbc->select("SELECT * FROM {$rt} WHERE `nid`='{$up_nid}' AND `isMaster`=0","Row");

                        }
                        $up_layer = lv_nid($uprs["nid"])["lv"];
                        $arr["avaliable_credit"] = $uprs["credit"] - $this->usedCredit($up_layer, $uprs["nid"]);//上级剩余额度
                    }
                    $arr["maxcredit"] = $rs["credit"];
                }

                switch ($layer){
                    case Constant::ADS:
                    case Constant::AD:
                        $arr["lower_d0_count"] = empty($lower["d0"]) ? "0" : $lower["d0"];
                    case Constant::D0:
                        $arr["lower_co_count"] = empty($lower["co"]) ? "0" : $lower["co"];
                    case Constant::CO:
                        $arr["lower_su_count"] = empty($lower["su"]) ? "0" : $lower["su"];
                    case Constant::SU:
                        $arr["lower_ag_count"] = empty($lower["ag"]) ? "0" : $lower["ag"];
                    case Constant::AG:
                        $arr["lower_mem_count"] = empty($mem) ? "0" : $mem;
                }
                $arr["lower_count"] = "0";
                if(isset($arr["lower_mem_count"])){
                    $arr["lower_count"] = $arr["lower_mem_count"];
                }
                $smn = $this->son_nid_manger();//是否为子账号
                if ($smn === false) {//主账号
                    $data[] = $arr;
                } else {
                    if (count($smn) > 0) {//筛选子账号管理的下级账号
                        $nid = $this->get_manger_acc_nid($layer, $rs["nid"]);
                        if (in_array($nid, $smn)) { //是子账号的下属账号
                            $data[] = $arr;
                        }
                    }
                }
            }

        }
        $lays = [Constant::D0,Constant::CO,Constant::SU,Constant::AG,Constant::MEM,"count"];
        if(count($data)>0 && in_array($this->param["sort_name"],$lays)){
            if($this->param["sort_name"]=="count"){
                $this->param["sort_name"] = Constant::MEM;
            }
            $lower = array_column($data,"lower_{$this->param["sort_name"]}_count");
            if(strtoupper($this->param["sort_type"]) == "DESC"){
                array_multisort($lower,SORT_DESC,$data);
            }else{
                array_multisort($lower,SORT_ASC,$data);
            }

        }
        //$data = array_merge($data,Dashboard::sum_amounts($layer,"tp",$rs["nid"]));
        return $data;
    }

    /**
     * 隐单账号
     * @return array
     */
    public function chg_hide_user(){
        global $ls_msg;
        $p = $this->param;
        $ls = $ls_msg[$this->langx];
        if(!isset($this->param["sid"]) || $this->param["sid"]*1<=0){
            return ["status" => "error","code" =>$ls["0X003"]];
        }

        $hidden = isset($p["hide_user"]) && strtoupper($p["hide_user"])=="Y" ? 1 : 0;
        try{
            $table = Constant::T_MEMBER;
            $rs = $this->dbc->select("SELECT `name` FROM {$table} WHERE `id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
            $this->dbc->update($table,["hidden"=>$hidden],"`id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'");
            $this->insertLog("账号管理->会员->隐单账号[账号:{$rs["name"]}]!");
            return ["status"=>"success","code"=>"chgHideUserSuccess","msg"=>"is done."];
        }catch (\Exception $e){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => $e->getMessage()
            ];
        }
    }

    /**
     * 绑定ip
     * @return array
     */
    public function chg_setip(){
        global $ls_msg;
        $p = $this->param;
        $ls = $ls_msg[$this->langx];
        if(!isset($this->param["sid"]) || $this->param["sid"]*1<=0){
            return ["status" => "error","code" =>$ls["0X003"]];
        }

        $setip = isset($p["setip"]) ? $p["setip"] : "";
        $str = "绑定ip";
        if($p["action"]=="cancal"){
            $setip = "";
            $str = "撤销绑定ip";
        }else{
            $pattern = '/^(?:(?:2[0-4][0-9]\.)|(?:25[0-5]\.)|(?:1[0-9][0-9]\.)|(?:[1-9][0-9]\.)|(?:[0-9]\.)){3}(?:(?:2[0-5][0-5])|(?:25[0-5])|(?:1[0-9][0-9])|(?:[1-9][0-9])|(?:[1-9]))$/';
            if(!empty($setip) && !preg_match($pattern,$setip)){
                return ["status"=>"error","code"=>"Err_setip","msg"=>"请正确输入IP地址"];
            }
        }
        try{
            $table = Constant::T_MEMBER;
            $rs = $this->dbc->select("SELECT `name` FROM {$table} WHERE `id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
            $this->dbc->update($table,["setip"=>$setip],"`id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'");
            $this->insertLog("账号管理->会员->{$str}[账号:{$rs["name"]}]!");
            return ["status"=>"success","code"=>"chgSetipSuccess","msg"=>"is done."];
        }catch (\Exception $e){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => $e->getMessage()
            ];
        }
    }

    /**
     * 绑定网址
     * @return array
     */
    public function chg_seturl(){
        global $ls_msg;
        $p = $this->param;
        $ls = $ls_msg[$this->langx];
        if(!isset($this->param["sid"]) || $this->param["sid"]*1<=0){
            return ["status" => "error","code" =>$ls["0X003"]];
        }

        $seturl = isset($p["seturl"]) ? $p["seturl"] : "";
        $str = "绑定网址";
        if($p["action"]=="cancal"){
            $seturl = "";
            $str = "撤销网址";
        }

        try{
            $table = Constant::T_MEMBER;
            $rs = $this->dbc->select("SELECT `name` FROM {$table} WHERE `id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
            $this->dbc->update($table,["seturl"=>$seturl],"`id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'");
            $this->insertLog("账号管理->会员->{$str}[账号:{$rs["name"]}]!");
            return ["status"=>"success","code"=>"chgSeturlSuccess","msg"=>"is done."];
        }catch (\Exception $e){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => $e->getMessage()
            ];
        }
    }

    /**
     * 修改账号信用额度
     * @param string $layer
     * @return array|string[]
     */
    public function chg_credit($layer=Constant::MEM){
        global $ls_msg;
        if (empty($this->param["sid"]) && !empty($this->param["mid"])) {
            $this->param["sid"] = $this->param["mid"];
        }
        $p = $this->param;
        $ls = $ls_msg[$this->langx];

        if(!isset($this->param["sid"]) || $this->param["sid"]*1<=0){
            return ["status" => "error","code" =>$ls["0X003"]];
        }
        $table = Constant::T_RANK;
        if($layer==Constant::MEM){ $table = Constant::T_MEMBER;}
        $rs = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
        if(!$rs){return ["status" => "error","code" =>$ls["4X008"]];}

        if($layer == Constant::MEM){
            if($rs["pay_type"] == 1){
                $min_credit = 0;
            }else{
                $min_credit = $rs["t_credit"] - $rs["balance_credit"];
            }
        }else{
            $min_credit = $this->usedCredit($layer,$rs["nid"]);
        }

        if($p["t_credit"]<$min_credit){
            $min_credit = number_format($min_credit,2);
            return [
                "status" => "error",
                "code" => "Err_credits_avaliable",
                "msg" => $ls["0X017"]."({$min_credit})",
                "old_maxcredit" => $rs["credit"],
            ];
        }

        $up_nid = this_sup_nid($layer,$rs["nid"]);
        $up_layer = lv_nid($up_nid)["lv"];
        if($layer != Constant::D0){
            $up_table = Constant::T_RANK;
            $uprs = $this->dbc->select("SELECT `credit` FROM {$up_table} WHERE `isMaster`=0 AND `nid`='{$up_nid}'","Row");
            if(!$uprs){return ["status" => "error","code" =>$ls["4X008"]];}
            $avaliable_credit = $uprs["credit"] - $this->usedCredit($up_layer,$up_nid);//上级剩余金额
            $up_max_credit = $avaliable_credit + $rs["credit"];//可更改的最高金额
            if($p["t_credit"]>$up_max_credit){
                return [
                    "status" => "error",
                    "code" => "Err_credits_avaliable",
                    "msg" => $ls["0X014"],
                    "avaliable_credit" => $avaliable_credit,
                    "old_maxcredit" => $rs["credit"],
                ];
            }
        }
        $update = ["credit"=>$p["t_credit"]];
        if($layer == Constant::MEM){
            $update["balance_credit"] = $rs["balance_credit"] + ($p["t_credit"] - $rs["credit"]);
        }

        try{
            $this->dbc->update($table,$update,"`id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'");
            $lv = lv_nid($rs["nid"]);
			if($this->param["login_layer"] == "ag" && $layer == Constant::MEM && $rs["pay_type"] == 1){
				      $insertnbews = [
                    "nid" => $rs["nid"],
                    "type" => "Y",
                    "old_cash" => $rs["credit"],
                    "cash" => $p["t_credit"] - $rs["credit"],
                    "new_cash" => $p["t_credit"],
                    "usertype" => "代理",
                    "logintime"  => time(),
                    "s_name" => $this->userArr["user"]["name"]
                ];
                $this->dbc->insert(Constant::T_CREDIT_LOG,$insertnbews);
			}
        $this->insertLog("账号管理->{$lv["name"]}->修改[账号:{$rs["name"]}]额度成功!");
            return ["status"=>"success","code"=>"chgCreditSuccess","msg"=>"is done."];
        }catch (\Exception $e){
            return [
                "status" => "error",
                "code" => "Err_credits_chg",
                "msg" => $e->getMessage(),
                "old_maxcredit" => $rs["credit"],
            ];
        }

    }

    /**
     * 修改账号状态
     * @param string $layer
     * @return array|string[]
     */
    public function chg_status($layer=Constant::MEM){
        global $ls_msg;
        $p = $this->param;
        $ls = $ls_msg[$this->langx];
        if(isset($this->param["mid"]) && $this->param["mid"]*1>0){ 
            $p["sid"] = $this->param["mid"];
        }else{
            if(!isset($this->param["sid"]) || $this->param["sid"]*1<=0){
                return ["status" => "error","chgStatus"=>"N","code" => "Err_status","msg" =>$ls["0X003"]];
            }
        }

        $table = Constant::T_RANK;
        if($layer==Constant::MEM){ $table = Constant::T_MEMBER;}
        if($layer==Constant::AD || $layer==Constant::ADS){ $table = Constant::T_ADMIN;}
        $rs = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
        if(!$rs){return ["status" => "error","chgStatus"=>"N","code" => "Err_status","msg" =>$ls["4X008"]];}
        $status = $this->getAccountStatus($rs["nid"],false);//上线账号状态
        switch($status){
            case 2:
                return [
                    "status" => "error",
                    "chgStatus"=>"N",
                    "code" => "Err_status",
                    "msg" => $ls["4X013"]
                ];
            case 3:
                return [
                    "status" => "error",
                    "chgStatus"=>"N",
                    "code" => "Err_status",
                    "msg" => $ls["4X016"]
                ];
            case 4:
                return [
                    "status" => "error",
                    "chgStatus"=>"N",
                    "code" => "Err_status",
                    "msg" => $ls["4X014"]
                ];
            case 5:
                return [
                    "status" => "error",
                    "chgStatus"=>"N",
                    "code" => "Err_status",
                    "msg" => $ls["4X046"]
                ];
                return $arr;
        }
        try{
            if (isset($p["enable_pri"])) { 
                $status = status_num_str(1,$p["enable_pri"]);
            }else{ 
                $status = status_num_str(1,$p["enable"]);
            }
            
            $this->dbc->update($table,["status"=>$status],"`id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'");
            $lv = lv_nid($rs["nid"]);
            $this->insertLog("账号管理->{$lv["name"]}->修改[账号:{$rs["name"]}]状态成功!");
            return ["status"=>"success","code"=>"chgStatusSuccess","msg"=>"is done.","chgStatus"=>"Y"];
        }catch (\Exception $e){
            return [
                "status" => "error",
                "chgStatus"=>"N",
                "code" => "Err_status",
                "msg" => $e->getMessage()
            ];
        }
    }

    /**
     * 获取账号特殊权限
     * @param string $layer
     * @return array
     */
    public function getAccountPower($layer=Constant::D0){
        global $ls_msg,$special_d0,$special_co;
        if($layer == Constant::D0){
            $special = $special_d0;
            $ary = ["D0_CO","D0_SU","D0_AG","D0_MEM","D0_MESS","D1_SU","D1_AG","D1_MEM","D1_MESS"];
        }else if($layer == Constant::CO){
            $special = $special_co;
            $ary = ["D1_SU","D1_AG","D1_MEM","D1_MESS"];
        }

        $ls = $ls_msg[$this->langx];
        $table = Constant::T_RANK;
        if($this->param["aid"]*1<=0){ return ["status"=>"error","code"=>$ls["4X008"]];}

        $rs = $this->dbc->select("SELECT `special`,`nid`,`level` FROM {$table} WHERE `id`={$this->param["aid"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
        if(!$rs || empty($rs["special"])){ return ["status" => "error","code" => "4X008"];}
        if(isset($this->param["act"]) && $this->param["act"] == "Y"){ //修改
            $specials = [];

            if(isset($special) && !empty($special)){
                $specials = [];
                foreach ($special as $v){
                    if(isset($this->param[$v])){
                        $specials[$v] = $this->param[$v];
                    }else{

                        if(in_array($v,$ary)){
                            $specials[$v] = "N";
                        }else{
                            $specials[$v] = "false";
                        }
                    }
                }
            }


            try{
                $this->dbc->update($table,["special"=>json_encode($specials)],"`id`={$this->param["aid"]}");
                /*if($layer==Constant::D0){//股东特殊权限修改
                    if(count($co_special) > 0){
                        $co_special = json_encode($co_special);
                    }else{
                        $co_special = NULL;
                    }
                    $this->dbc->update($table,["special"=>$co_special],"`nid` LIKE '{$rs["nid"]}_%' AND `level`=3");
                }*/
                return ["status"=>"success"];
            }catch (\Exception $e){
                return ["status"=>"errot","code"=>$e->getMessage()];
            }
        }else{
            if($rs["level"] == 3){//股东
                $nid = sup_nid(Constant::D0,$rs["nid"]);
                $d0 = $this->dbc->select("SELECT `special` FROM {$table} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                $d0_special = json_decode($d0["special"],true);
                $co_special = json_decode($rs["special"],true);
                $ary = [
                    "sup" => [],
                    "list"=> $co_special
                ];
                foreach ($co_special as $k => $v){
                    if($d0_special[$k] == "N" || $d0_special[$k] == "false"){//分公司禁止，股东显示禁止
                        $ary["sup"][$k] = "N";
                    }else{
                        $ary["sup"][$k] = "Y";
                    }
                }
                return $ary;
            }else{//分公司
                return json_decode($rs["special"],true);
            }

        }

    }

    /**
     * 分公司修改页面 退水和额度数据
     */
    public function acc_d0_comm(){
        if(isset($this->param["act"]) && ($this->param["act"] == "Y" || $this->param["act"] == "Save_All")){//修改退水和额度
            return $this->updateOneAccountComm2(Constant::D0);
        }else{
            return $this->getAccountComm(Constant::D0);
        }
    }

    /**
     * 股东修改页面 退水和额度数据
     */
    public function acc_co_comm(){
        if(isset($this->param["act"]) && ($this->param["act"] == "Y" || $this->param["act"] == "Save_All")){//修改退水和额度
            return $this->updateOneAccountComm2(Constant::CO);
        }else{
            return $this->getAccountComm(Constant::CO);
        }
    }

    /**
     * 总代修改页面 退水和额度数据
     */
    public function acc_su_comm(){
        if(isset($this->param["act"]) && ($this->param["act"] == "Y" || $this->param["act"] == "Save_All")){//修改退水和额度
            return $this->updateOneAccountComm2(Constant::SU);
        }else{
            return $this->getAccountComm(Constant::SU);
        }
    }

    /**
     * 代理修改页面 退水和额度数据
     */
    public function acc_ag_comm(){
        if(isset($this->param["act"]) && ($this->param["act"] == "Y" || $this->param["act"] == "Save_All")){//修改退水和额度
            return $this->updateOneAccountComm2(Constant::AG);
        }else{
            return $this->getAccountComm(Constant::AG);
        }
    }
    /**
     * 单独修改退水和限额
     * @return array
     */
    public function updateOneAccountComm2($layer = Constant::AG)
    {
        
        global $ls_msg, $ltypes;
        $p = $this->param;
        $error = [];
        $ls = $ls_msg[$this->langx];
        if ($p["aid"] * 1 <= 0) {
            return ["status" => "error", "code" => $ls["4X008"]];
        }

        $c = $this->selectComms($layer);
        if ($c["status"] == "error") {
            return $c;
        }
        $up_comm = $c["up_comm"];

        if($p["act"] == "Save_All"){
            $str = $p['chg_value'][0];
            $substring = "FT";
            if (strpos($str, $substring) !== false) {
                $p['kind']= "FT";
            }
        }

      
        



        // $ltype = 1;
        // if ($layer == Constant::MEM) {
        //     $mem_table = Constant::T_MEMBER;
        //     $mem_rs = $this->dbc->select("SELECT `ltype` FROM {$mem_table} WHERE `id`={$this->param["aid"]}", "Row");
        //     // print_r($mem_rs);exit;
        //     $ltype = array_search($mem_rs["ltype"], $ltypes);
        //     $up_war = $up_comm[$p["kind"]]["data"][$p["rtype"] . "_" . $ltype]["war"];
        
        //     if (isset($p["war_set"]) && $p["war_set"] * 1 > $up_war) {
        //         $error["ltypeData"][] = [
        //             "ltype" => $mem_rs["ltype"],
        //             "msg" => $ls["1X001"] . $up_war
        //         ];
        //     }
        //     $p["rtype"] = $mem_rs["ltype"];
        // } 
        
        // // else {
        // //     foreach ($ltypes as $k => $v) {
        // //         $up_war = $up_comm[$p["kind"]]["data"][$p["rtype"] . "_" . $k]["war"];
        // //         if (isset($p["war_set_{$v}"]) && $p["war_set_{$v}"] * 1 > $up_war) {
        // //             $error["ltypeData"][] = [
        // //                 "ltype" => $v,
        // //                 "msg" => $ls["1X001"] . $up_war
        // //             ];
        // //         }
        // //     }
        // // }

        // $up_sc = $up_comm[$p["kind"]]["data"][$p["rtype"] . "_{$ltype}"]["sc"];
        // $up_so = $up_comm[$p["kind"]]["data"][$p["rtype"] . "_{$ltype}"]["so"];
        // if (isset($p["SC"]) && $p["SC"] * 1 > $up_sc) {
        //     $error["betData"][] = [
        //         "bet" => "SC",
        //         "msg" => $ls["1X002"] . $up_sc
        //     ];
        // }

        // if (isset($p["SO"]) && $p["SO"] * 1 > $up_so) {
        //     $error["betData"][] = [
        //         "bet" => "SO",
        //         "msg" => $ls["1X003"] . $up_so
        //     ];
        // }

        // if (count($error) > 0) {
        //     $arr = [
        //         "status" => "error",
        //         "gtype" => $p["kind"],
        //         "rtype" => $p["rtype"]
        //     ];

        //     return array_merge($arr, $error);
        // }
        
        

        $this->dbc->beginTransaction();
        try {
            $table = Constant::T_RANK;
            if ($layer == Constant::MEM) {
                $table = Constant::T_MEMBER;
            }
            $rs = $this->dbc->select("SELECT `nid`,`name`,`config` FROM {$table} WHERE `id`={$p["aid"]} LIMIT 1", "Row");
            $comm = json_decode($rs["config"], true);
            if(isset($p['chg_value'])){
                $ltype_to_num = [];
                foreach ($ltypes as $k => $v){ 
                    $ltype_to_num[$v] = $k;
                }
                $totalchg_value = $p['chg_value'];
                // if ($layer == Constant::MEM) {
                //     foreach ($totalchg_value as $tvale){
                //         $pattern = '/_([^_]+)_/';
                //         preg_match($pattern, $tvale, $matches);
                //         $result = strtoupper($matches[1]);
                        
                //         $parts = explode("_", $tvale);
                //         $result2 = strtoupper(end($parts));
                //         $type2 = strtolower($result2);
                //         $tskdjk[] = $type2;
                //         if($result2 == "SO" || $result2 == "SC"){
                //             for($i=1;$i<=4;$i++){ 
                //                 //如果大于上级 
                //                 $up_co = $up_comm[$p["kind"]]["data"][$result . "_".$i][$type2];
                //                 if($num > $up_co){ 
                //                     $num = $up_co;
                //                 }
                //                 $comm[$p["kind"]]["data"][$result . "_".$i][$type2] = $num;
                //                 if($p["act"] == "Save_All" && $p["kind"]=="FT"){ 
                //                     $comm["BK"]["data"][$result . "_" . $i][$type2] = $num;
                //                     $comm["OP"]["data"][$result . "_" . $i][$type2] = $num;
                //                     $comm["FS"]["data"][$result . "_" . $i][$type2] = $num;
                //                 }
                //             }

                //             $comm[$p["kind"]]["data"][$result . "_" . $ltype][$type2] = $p[$tvale] * 1;
                //             if($p["act"] == "Save_All" && $p["kind"]=="FT"){ 

                //             }
                //         }else{ 

                //         }
                //         $ltype = $ltype_to_num[$result2];
                //         print_r($ltype);exit;
                //         if($result2 == 'C'){
                //             $comm[$p["kind"]]["data"][$result . "_" . $ltype]["war"] = isset($p[$tvale]) ? $p[$tvale] * 1 : 0;
                //         }else{
                            
                //         }

                //         if($p["act"] == "Save_All" && $p["kind"]=="FT"){ 
                //             if($result2 == 'C'){
                //                 $comm["BK"]["data"][$result . "_" . $ltype]["war"] = isset($p[$tvale]) ? $p[$tvale] * 1 : 0;
                //                 $comm["OP"]["data"][$result . "_" . $ltype]["war"] = isset($p[$tvale]) ? $p[$tvale] * 1 : 0;
                //                 $comm["FS"]["data"][$result . "_" . $ltype]["war"] = isset($p[$tvale]) ? $p[$tvale] * 1 : 0;
                //             }else{
                //                 $comm["BK"]["data"][$result . "_" . $ltype][$type2] = $p[$tvale] * 1;
                //                 $comm["OP"]["data"][$result . "_" . $ltype][$type2] = $p[$tvale] * 1;
                //                 $comm["FS"]["data"][$result . "_" . $ltype][$type2] = $p[$tvale] * 1;

                //             }
                //         }
                //     }
                // } else {
                        
                    $comm = $this->set_acc_config($p,$ltype_to_num,$totalchg_value,$comm,$up_comm);
                    //不是会员修改，下级也要检测
                    if($layer != Constant::MEM){ 
                        //检测各级代理
                        $rank_table = Constant::T_RANK;
                        $rank_rs = $this->dbc->select("SELECT `id`,`config` FROM {$rank_table} WHERE `nid` LIKE '{$rs["nid"]}_%' AND `isMaster`=0"); 
                        if(count($rank_rs)>0){ 
                            foreach($rank_rs as $rs1){ 
                                $comm1 = $this->set_acc_config($p,$ltype_to_num,$totalchg_value,json_decode($rs1["config"], true),$comm);
                                $this->dbc->update($rank_table, ["config" => json_encode($comm1)], "`id`={$rs1["id"]}");
                            }
                        }
                        //检测会员
                        $mem_table = Constant::T_MEMBER;
                        $mem_rs = $this->dbc->select("SELECT `id`,`config`,`ltype` FROM {$mem_table} WHERE `nid` LIKE '{$rs["nid"]}%'");
                        if(count($mem_rs)>0){ 
                            foreach($mem_rs as $rs2){ 
                                $comm2 = $this->set_acc_config($p,$ltype_to_num,$totalchg_value,json_decode($rs2["config"], true),$comm);
                                $this->dbc->update($mem_table, ["config" => json_encode($comm2)], "`id`={$rs2["id"]}");
                            }
                        }
                    }
                    

                    // print_r($comm);
                // }
            }
            // print_r($comm);
            $this->dbc->update($table, ["config" => json_encode($comm)], "`id`={$p["aid"]}");

            $lv = lv_nid($rs["nid"]);
            $this->insertLog("账号管理->{$lv["name"]}->修改[账号:{$rs["name"]}]退水和限额成功!");
            $this->dbc->commit();
            return ["status" => "success"];
        } catch (\Exception $e) {
            $this->dbc->rollback();
            return ["status" => "error", "code" => $e->getMessage()];
        }
    }

    public function set_acc_config($p,$ltype_to_num,$totalchg_value,$comm,$up_comm){ 
        foreach ($totalchg_value as $tvale){
            $pattern = '/_([^_]+)_/';
            preg_match($pattern, $tvale, $matches);
            $result = strtoupper($matches[1]);

            $parts = explode("_", $tvale);
            $result2 = strtoupper(end($parts));
            $type2 = strtolower($result2);
            $tskdjk[] = $type2;
            if(!empty($type2)&&!empty($result) && !empty($p["kind"])){
                $num = isset($p[$tvale]) ? floatval($p[$tvale]) * 1 : 0;
                if($result2 == "SO" || $result2 == "SC"){ 
                    for($i=1;$i<=4;$i++){ 
                        //如果大于上级 
                        $up_co = $up_comm[$p["kind"]]["data"][$result . "_".$i][$type2];
                        if($num > $up_co){ 
                            $num = $up_co;
                        }
                        $comm[$p["kind"]]["data"][$result . "_".$i][$type2] = $num;
                        if($p["act"] == "Save_All" && $p["kind"]=="FT"){ 
                            $comm["BK"]["data"][$result . "_" . $i][$type2] = $num;
                            $comm["OP"]["data"][$result . "_" . $i][$type2] = $num;
                            $comm["FS"]["data"][$result . "_" . $i][$type2] = $num;
                        }
                    }
                    
                }else{ 
                    $i = $ltype_to_num[$result2];
                    //如果大于上级 
                    $up_co = $up_comm[$p["kind"]]["data"][$result . "_" . $i]["war"];
                    if($num > $up_co){ 
                        $num = $up_co;
                    }

                    $comm[$p["kind"]]["data"][$result . "_" . $i]["war"] = $num;
                    if($p["act"] == "Save_All" && $p["kind"]=="FT"){
                        $comm["BK"]["data"][$result . "_" . $i]["war"] = $num;
                        $comm["OP"]["data"][$result . "_" . $i]["war"] = $num;
                        $comm["FS"]["data"][$result . "_" . $i]["war"] = $num;
                    }
                }
            }
        }

        return $comm;
    }

    /**
     * 总代修改页面 退水和额度数据
     */
    public function acc_mem_comm(){
        if(isset($this->param["act"]) && ($this->param["act"] == "Y" || $this->param["act"] == "Save_All")){//修改退水和额度
            return $this->updateOneAccountComm2(Constant::MEM);
        }else{
            return $this->getAccountComm(Constant::MEM);
        }
    }

    public function updateOneMemberCommAccount($layer = Constant::AG)
    {
        global $ls_msg, $ltypes;
        $p = $this->param;
        $error = [];
        $ls = $ls_msg[$this->langx];
        if ($p["aid"] * 1 <= 0) {
            return ["status" => "error", "code" => $ls["4X008"]];
        }

        $c = $this->selectComms($layer);
        if ($c["status"] == "error") {
            return $c;
        }
        $up_comm = $c["up_comm"];

        if($p["act"] == "Save_All"){
            $str = $p['chg_value'][0];
            $substring = "FT";
            if (strpos($str, $substring) !== false) {
                $p['kind']= "FT";
            }
        }



        $ltype = 1;
        if ($layer == Constant::MEM) {
            $mem_table = Constant::T_MEMBER;
            $mem_rs = $this->dbc->select("SELECT `ltype` FROM {$mem_table} WHERE `id`={$this->param["aid"]}", "Row");
            $ltype = array_search($mem_rs["ltype"], $ltypes);
            $up_war = $up_comm[$p["kind"]]["data"][$p["rtype"] . "_" . $ltype]["war"];
            if (isset($p["war_set"]) && $p["war_set"] * 1 > $up_war) {
                $error["ltypeData"][] = [
                    "ltype" => $mem_rs["ltype"],
                    "msg" => $ls["1X001"] . $up_war
                ];
            }
        } else {
            foreach ($ltypes as $k => $v) {
                $up_war = $up_comm[$p["kind"]]["data"][$p["rtype"] . "_" . $k]["war"];
                if (isset($p["war_set_{$v}"]) && $p["war_set_{$v}"] * 1 > $up_war) {
                    $error["ltypeData"][] = [
                        "ltype" => $v,
                        "msg" => $ls["1X001"] . $up_war
                    ];
                }
            }
        }
        $p["rtype"] = $mem_rs["ltype"];

        $up_sc = $up_comm[$p["kind"]]["data"][$p["rtype"] . "_{$ltype}"]["sc"];
        $up_so = $up_comm[$p["kind"]]["data"][$p["rtype"] . "_{$ltype}"]["so"];
        if (isset($p["SC"]) && $p["SC"] * 1 > $up_sc) {
            $error["betData"][] = [
                "bet" => "SC",
                "msg" => $ls["1X002"] . $up_sc
            ];
        }

        if (isset($p["SO"]) && $p["SO"] * 1 > $up_so) {
            $error["betData"][] = [
                "bet" => "SO",
                "msg" => $ls["1X003"] . $up_so
            ];
        }

        if (count($error) > 0) {
            $arr = [
                "status" => "error",
                "gtype" => $p["kind"],
                "rtype" => $p["rtype"]
            ];

            return array_merge($arr, $error);
        }

        $this->dbc->beginTransaction();
        try {
            $table = Constant::T_RANK;
            if ($layer == Constant::MEM) {
                $table = Constant::T_MEMBER;
            }
            $rs = $this->dbc->select("SELECT `nid`,`name`,`config` FROM {$table} WHERE `id`={$p["aid"]} LIMIT 1", "Row");
            $comm = json_decode($rs["config"], true);

            if ($layer == Constant::MEM) {

                $totalchg_value = $p['chg_value'];
                foreach ($totalchg_value as $tvale){
                    $pattern = '/_([^_]+)_/';
                    preg_match($pattern, $tvale, $matches);
                    $result = $matches[1];

                    $parts = explode("_", $tvale);
                    $result2 = end($parts);
                    $type2 = strtolower($result2);
                    $tskdjk[] = $type2;
                    if($result2 == 'C'){
                        $comm[$p["kind"]]["data"][$result . "_" . $ltype]["war"] = isset($p[$tvale]) ? $p[$tvale] * 1 : 0;
                    }else{
                        $comm[$p["kind"]]["data"][$result . "_" . $ltype][$type2] = $p[$tvale] * 1;
                    }
                }


            } else {
                $totalchg_value = $p['chg_value'];
                foreach ($ltypes as $k => $v) {
                    foreach ($totalchg_value as $tvale){
                        $pattern = '/_([^_]+)_/';
                        preg_match($pattern, $tvale, $matches);
                        $result = $matches[1];

                        $parts = explode("_", $tvale);
                        $result2 = end($parts);
                        $type2 = strtolower($result2);
                        $tskdjk[] = $type2;
                        if(!empty($tvale)&&!empty($type2)&&!empty($result)){
                            if($result2 == 'C'){
                                $comm[$p["kind"]]["data"][$result . "_" . $k]["war"] = isset($p[$tvale]) ? $p[$tvale] * 1 : 0;
                            }else{
                                $comm[$p["kind"]]["data"][$result . "_" . $k][$type2] = floatval($p[$tvale]) * 1;
                            }
                        }

                    }
                }

                $rank_table = Constant::T_RANK;
                $mem_table = Constant::T_MEMBER;
                $rank_rs = $this->dbc->select("SELECT `id`,`config` FROM {$rank_table} WHERE `nid` LIKE '{$rs["nid"]}_%' AND `isMaster`=0");
                $mem_rs = $this->dbc->select("SELECT `id`,`config`,`ltype` FROM {$mem_table} WHERE `nid` LIKE '{$rs["nid"]}%'");

            }

            $this->dbc->update($table, ["config" => json_encode($comm)], "`id`={$p["aid"]}");

            $lv = lv_nid($rs["nid"]);
            $this->insertLog("账号管理->{$lv["name"]}->修改[账号:{$rs["name"]}]退水和限额成功!");
            $this->dbc->commit();
            return ["status" => "success"];
        } catch (\Exception $e) {
            $this->dbc->rollback();
            return ["status" => "error", "code" => $e->getMessage()];
        }
    }
    /**
     * 单独修改退水和限额
     * @return array
     */
    public function updateOneAccountComm($layer = Constant::AG){
        if ($layer == Constant::MEM) {
            global $ls_msg,$ltypes,$gtypes;
            $p = $this->param;
            $ls = $ls_msg[$this->langx];

            if($p["aid"]*1<=0){ return ["status"=>"error","code"=>$ls["4X008"]];}

            $c = $this->selectComms($layer);
            if($c["status"] == "error"){ return $c; }
            $up_comm = $c["up_comm"];
            $ltype = 1;

            $mem_table = Constant::T_MEMBER;
            $mem_rs = $this->dbc->select("SELECT `ltype` FROM {$mem_table} WHERE `id`={$this->param["aid"]}","Row");
            $ltype = array_search($mem_rs["ltype"],$ltypes);

            $this->dbc->beginTransaction();

            try{
                $table = Constant::T_MEMBER;
                $rs = $this->dbc->select("SELECT `nid`,`name`,`config` FROM {$table} WHERE `id`={$p["aid"]} LIMIT 1","Row");
                $comm = json_decode($rs["config"],true);

                $rtypes = ["R", "RE", "M", "DT", "RDT"];
                $opts = ["SC", "SO", "WAR"];
                if ($this->param["act"] == "Save_All") {
                    foreach ($gtypes as $gk => $gv) {
                        $gtype = $gk;
                        if ($gtype == "FS") {
                            continue;
                        }
                        foreach($rtypes as $rv) {
                            $rtype = $rv;

                            if ($gtype != "FT" && $rtype == "RDT") {
                                continue;
                            }

                            foreach ($opts as $op) {
                                $key = "FT" . "_" . $rtype . "_" . $op;
                                $tmp = $rtype;
                                if ($gtype == "FS") {
                                    $tmp = "FS";
                                }
                                // LOG::write("updateOneAccountComm123", $gtype . " " . $rtype . " " . $ltype . " " . $op . " " . $key . " " . $p[$key]);
                                if (isset($p[$key])) {
                                    $comm[$gtype]["data"][$rtype."_".$ltype][strtolower($op)] = $p[$key];
                                }
                            }
                        }
                    }

                    $comm["FS"]["data"]["FS"."_".$ltype]["sc"] = $p["FT_RDT_SC"];
                    $comm["FS"]["data"]["FS"."_".$ltype]["so"] = $p["FT_RDT_SO"];
                }

                if (!empty($p["chg_value"]) && is_array($p["chg_value"]) && count($p["chg_value"]) > 0) {
                    foreach ($p["chg_value"] as $it) {
                        $fileds = explode("_", $it);
                        $gtype = $fileds[0];
                        $rtype = $fileds[1];
                        $op = $fileds[2];
                        $comm[$gtype]["data"][$rtype."_".$ltype][strtolower($op)] = $p[$it];
                        // LOG::write("updateOneAccountComm", $p["kind"] . " " . $rtype . " " . $ltype . " " . $op . " " . $p[$it]);
                    }
                }
                // LOG::write("updateOneAccountComm", $comm);
                $this->dbc->update($table,["config"=>json_encode($comm)],"`id`={$p["aid"]}");

                $lv = lv_nid($rs["nid"]);
                $this->insertLog("账号管理->{$lv["name"]}->修改[账号:{$rs["name"]}]退水和限额成功!");
                $this->dbc->commit();
                return ["status"=>"success"];
            }catch (\Exception $e){
                $this->dbc->rollback();
                return ["status"=>"error","code"=>$e->getMessage()];
            }
        }
        else {
            global $ls_msg,$ltypes;
            $p = $this->param;
            $error = [];
            $ls = $ls_msg[$this->langx];

            if($p["aid"]*1<=0){ return ["status"=>"error","code"=>$ls["4X008"]];}

            $c = $this->selectComms($layer);
            if($c["status"] == "error"){ return $c; }
            $up_comm = $c["up_comm"];
            $ltype = 1;
            if($layer == Constant::MEM){
                $mem_table = Constant::T_MEMBER;
                $mem_rs = $this->dbc->select("SELECT `ltype` FROM {$mem_table} WHERE `id`={$this->param["aid"]}","Row");
                $ltype = array_search($mem_rs["ltype"],$ltypes);
                $up_war = $up_comm[$p["kind"]]["data"][$p["rtype"]."_".$ltype]["war"];
                if(isset($p["war_set"]) && $p["war_set"]*1 > $up_war){
                    $error["ltypeData"][] = [
                        "ltype" => $mem_rs["ltype"],
                        "msg" => $ls["1X001"].$up_war
                    ];
                }
            }else{
                foreach ($ltypes as $k => $v){
                    $up_war = $up_comm[$p["kind"]]["data"][$p["rtype"]."_".$k]["war"];
                    if(isset($p["war_set_{$v}"]) && $p["war_set_{$v}"]*1 > $up_war){
                        $error["ltypeData"][] = [
                            "ltype" => $v,
                            "msg" => $ls["1X001"].$up_war
                        ];
                    }
                }
            }

            $up_sc = $up_comm[$p["kind"]]["data"][$p["rtype"]."_{$ltype}"]["sc"];
            $up_so = $up_comm[$p["kind"]]["data"][$p["rtype"]."_{$ltype}"]["so"];
            if(isset($p["SC"]) && $p["SC"]*1 > $up_sc){
                $error["betData"][] = [
                    "bet" => "SC",
                    "msg" => $ls["1X002"].$up_sc
                ];
            }

            if(isset($p["SO"]) && $p["SO"]*1 > $up_so){
                $error["betData"][] = [
                    "bet" => "SO",
                    "msg" => $ls["1X003"].$up_so
                ];
            }

            if(count($error)>0){
                $arr = [
                    "status" => "error",
                    "gtype"  => $p["kind"],
                    "rtype"  => $p["rtype"]
                ];

                return array_merge($arr,$error);
            }

            $this->dbc->beginTransaction();
            try{
                $table = Constant::T_RANK;
                if($layer == Constant::MEM){
                    $table = Constant::T_MEMBER;
                }
                $rs = $this->dbc->select("SELECT `nid`,`name`,`config` FROM {$table} WHERE `id`={$p["aid"]} LIMIT 1","Row");
                $comm = json_decode($rs["config"],true);
                if($layer == Constant::MEM){
                    $comm[$p["kind"]]["data"][$p["rtype"]."_".$ltype]["war"] = isset($p["war_set"]) ? $p["war_set"]*1 : 0;
                    $comm[$p["kind"]]["data"][$p["rtype"]."_".$ltype]["sc"] = $p["SC"]*1;
                    $comm[$p["kind"]]["data"][$p["rtype"]."_".$ltype]["so"] = $p["SO"]*1;
                }else{
                    foreach ($ltypes as $k => $v){
                        $war = isset($p["war_set_{$v}"]) ? $p["war_set_{$v}"]*1 : 0;
                        $sc = isset($p["SC"]) ? $p["SC"]*1 : 0;
                        $so = isset($p["SO"]) ? $p["SO"]*1 : 0;

                        $comm[$p["kind"]]["data"][$p["rtype"]."_".$k]["war"] = $war;
                        $comm[$p["kind"]]["data"][$p["rtype"]."_".$k]["sc"] = $sc;
                        $comm[$p["kind"]]["data"][$p["rtype"]."_".$k]["so"] = $so;
                    }
                    if (!empty($p["chg_value"]) && is_array($p["chg_value"]) && count($p["chg_value"]) > 0) {
                        foreach ($p["chg_value"] as $it) {
                            $fileds = explode("_", $it);
                            $gtype = $fileds[0];
                            $rtype = $fileds[1];
                            $op = $fileds[2];
                            if($op == 'A'){
                                $comm[$gtype]["data"][$rtype."_1"]["war"] = $p[$it];
                            }
                            if($op == 'B'){
                                $comm[$gtype]["data"][$rtype."_2"]["war"] = $p[$it];
                            }
                            if($op == 'C'){
                                $comm[$gtype]["data"][$rtype."_3"]["war"] = $p[$it];
                            }
                            if($op == 'D'){
                                $comm[$gtype]["data"][$rtype."_4"]["war"] = $p[$it];
                            }
                            if($op == 'SC'){
                                $comm[$gtype]["data"][$rtype."_1"]["sc"] = $p[$it];
                                $comm[$gtype]["data"][$rtype."_2"]["sc"] = $p[$it];
                                $comm[$gtype]["data"][$rtype."_3"]["sc"] = $p[$it];
                                $comm[$gtype]["data"][$rtype."_4"]["sc"] = $p[$it];
                            }
                            if($op == 'SO'){
                                $comm[$gtype]["data"][$rtype."_1"]["so"] = $p[$it];
                                $comm[$gtype]["data"][$rtype."_2"]["so"] = $p[$it];
                                $comm[$gtype]["data"][$rtype."_3"]["so"] = $p[$it];
                                $comm[$gtype]["data"][$rtype."_4"]["so"] = $p[$it];
                            }
                        }
                    }
                    $rank_table = Constant::T_RANK;
                    $mem_table = Constant::T_MEMBER;
                    $rank_rs = $this->dbc->select("SELECT `id`,`config` FROM {$rank_table} WHERE `nid` LIKE '{$rs["nid"]}_%' AND `isMaster`=0");
                    $mem_rs = $this->dbc->select("SELECT `id`,`config`,`ltype` FROM {$mem_table} WHERE `nid` LIKE '{$rs["nid"]}%'");
                    /*下级联动 开始*/
                    if($rank_rs && count($rank_rs)>0){
                        foreach ($rank_rs as $vv){
                            $rank_comm = json_decode($vv["config"],true);
                            foreach ($ltypes as $k => $v){
                                $war1 = isset($p["war_set_{$v}"]) ? $p["war_set_{$v}"]*1 : 0;
                                $sc1 = isset($p["SC"]) ? $p["SC"]*1 : 0;
                                $so1 = isset($p["SO"]) ? $p["SO"]*1 : 0;

                                $rank_comm[$p["kind"]]["data"][$p["rtype"]."_".$k]["war"] > $war && $rank_comm[$p["kind"]]["data"][$p["rtype"]."_".$k]["war"] = $war1;
                                $rank_comm[$p["kind"]]["data"][$p["rtype"]."_".$k]["sc"] > $sc && $rank_comm[$p["kind"]]["data"][$p["rtype"]."_".$k]["sc"] = $sc1;
                                $rank_comm[$p["kind"]]["data"][$p["rtype"]."_".$k]["so"] > $so && $rank_comm[$p["kind"]]["data"][$p["rtype"]."_".$k]["so"] = $so1;
                            }
                            $this->dbc->update($rank_table,["config"=>json_encode($rank_comm)],"`id`={$vv["id"]}");

                        }
                    }

                    if($mem_rs && count($mem_rs)>0){
                        foreach ($mem_rs as $vv){
                            $ltype = array_search($vv["ltype"],$ltypes);
                            $mem_comm = json_decode($vv["config"],true);

                            $war1 = isset($p["war_set_{$ltype}"]) ? $p["war_set_{$ltype}"]*1 : 0;
                            $sc1 = isset($p["SC"]) ? $p["SC"]*1 : 0;
                            $so1 = isset($p["SO"]) ? $p["SO"]*1 : 0;

                            $mem_comm[$p["kind"]]["data"][$p["rtype"]."_".$ltype]["war"] > $war && $mem_comm[$p["kind"]]["data"][$p["rtype"]."_".$ltype]["war"] = $war1;
                            $mem_comm[$p["kind"]]["data"][$p["rtype"]."_".$ltype]["sc"] > $sc && $mem_comm[$p["kind"]]["data"][$p["rtype"]."_".$ltype]["sc"] = $sc1;
                            $mem_comm[$p["kind"]]["data"][$p["rtype"]."_".$ltype]["so"] > $so && $mem_comm[$p["kind"]]["data"][$p["rtype"]."_".$ltype]["so"] = $so1;

                            $this->dbc->update($mem_table,["config"=>json_encode($mem_comm)],"`id`={$vv["id"]}");

                        }
                    }
                    /*下级联动 结束*/

                }

                $this->dbc->update($table,["config"=>json_encode($comm)],"`id`={$p["aid"]}");

                $lv = lv_nid($rs["nid"]);
                $this->insertLog("账号管理->{$lv["name"]}->修改[账号:{$rs["name"]}]退水和限额成功!");
                $this->dbc->commit();
                return ["status"=>"success"];
            }catch (\Exception $e){
                $this->dbc->rollback();
                return ["status"=>"error","code"=>$e->getMessage()];
            }
        }
    }

    /**
     * 查询上下级退水和限额
     * @param string $layer
     * @return array|string[]
     */
    public function selectComms($layer = Constant::AG){
        $table = Constant::T_RANK;
        if($layer == Constant::MEM){
            $table = Constant::T_MEMBER;
        }

        if(isset($this->param["mid"])){
            $newid = $this->param["mid"];
            if(empty($newid)){
                $newid = $this->param["aid"];
            }
        }elseif(isset($this->param["sid"])){
            $newid = $this->param["sid"];
        }else{ 
            $newid = $this->param["aid"];
        }
        
        $rs = $this->dbc->select("SELECT `nid`,`config` FROM {$table} WHERE `id`={$newid} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
        if(!$rs || empty($rs["config"])){
            return ["status" => "error","code" => "4X008"];
        }

        //获取上级退水和限额
        $up_comm = [];
        if($layer==Constant::D0){
            global $game_default_config;
            $up_comm = $game_default_config;
        }else{
            $up_nid = this_sup_nid($layer,$rs["nid"]);
            $up_table = Constant::T_RANK;
            $uprs = $this->dbc->select("SELECT `config` FROM {$up_table} WHERE `nid`='{$up_nid}' AND `isMaster`=0","Row");
            $up_comm = json_decode($uprs["config"],true);
        }

        return ["status"=>"success","comm"=>json_decode($rs["config"],true),"up_comm"=>$up_comm];
    }

    public function get_my_setting(){
        global $ltypes;
        $available = $this->sup["credit"] - $this->usedCredit($this->login_layer,$this->sup["nid"]);
        if($available<0){
            $available = 0;
        }
        $ary["data"] = [
            "username" => $this->user["name"],
            "maxcredit" => $this->sup["credit"],
            "available" => $this->sup["credit"] - $available,
        ];
        foreach (json_decode($this->sup["config"],true) as $k => $v){
            $key = $k."_";
            foreach ($v["data"] as $vv){
                $key1 = $key.$vv["rtype"];
                $ary["data"][$key1."_SC"] = $vv["sc"];
                $ary["data"][$key1."_SO"] = $vv["so"];
                $ary["data"][$key1."_".$ltypes[$vv["ltype"]]] = $vv["war"];
            }
        }
        return $ary;
    }

    /**
     * 读取退水和限额
     * @return array
     */
    public function getAccountComm($layer = Constant::AG){
        global $ltypes;
        $c = $this->selectComms($layer);
        if($c["status"] == "error"){
            return $c;
        }
        $arr["dataAry"] = [];
        if($layer == Constant::MEM){
            foreach ($c["comm"] as $k => $v){
                $key = $k."_";
                foreach ($v["data"] as $vv){
                    $key1 = $key;
                    if(isset($vv["rtype"])){
                        $key1 = $key.$vv["rtype"];
                        $arr["dataAry"][$key1."_SC"] = $vv["sc"];
                        $arr["dataAry"][$key1."_SC_limit"] = $c["up_comm"][$k]["data"][$vv["rtype"]."_".$vv["ltype"]]["sc"];
                        $arr["dataAry"][$key1."_SO"] = $vv["so"];
                        $arr["dataAry"][$key1."_SO_limit"] = $c["up_comm"][$k]["data"][$vv["rtype"]."_".$vv["ltype"]]["so"];
                        $arr["dataAry"][$key1."_WAR"] = $vv["war"];
                        $arr["dataAry"][$key1."_WAR_limit"] = $c["up_comm"][$k]["data"][$vv["rtype"]."_".$vv["ltype"]]["war"];
                        $arr["dataAry"][$key1."_WARTYPE"] = $ltypes[$vv["ltype"]];
                    }
                }
            }
            $table = Constant::T_MEMBER;
            $rs = $this->dbc->select("SELECT `currency` FROM {$table} WHERE `id`={$this->param["aid"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");

            global $currencys;
            $currency = $rs["currency"];
            $curr = $currencys[$this->langx][$currency];
            $arr["currency_def"] = $curr["def"];
            $arr["currency_name"] = $curr["name"];
        }else{
            $comm = $this->getGames($c["comm"]);
            $up_comm = $this->getGames($c["up_comm"]);
            foreach ($comm as $k => $v){
                $arr["dataAry"][$k] = $v;
                if(isset($up_comm[$k])){
                    $arr["dataAry"][$k."_limit"] = $up_comm[$k];
                }
            }
        }

        return $arr;
    }

    /**
     * 解析限额和退水
     * @param array $str
     * @return array
     */
    public function getGames($str = [])
    {
        global $ltypes;
        $arr = [];
        
        foreach ($str as $k => $v) {
            $key = $k . "_";
            foreach ($v["data"] as $vv) {
                $key1 = $key . $vv["rtype"];
                $arr[$key1 . "_SC"] = $vv["sc"];
                $arr[$key1 . "_SO"] = $vv["so"];
                $arr[$key1 . "_" . $ltypes[$vv["ltype"]]] = $vv["war"];
                
                // if(isset($vv["a"])){
                //     $arr[$key1 . "_" . $ltypes['1']] = $vv["a"];
                //     $arr[$key1 . "_" . $ltypes['2']] = $vv["b"];
                //     $arr[$key1 . "_" . $ltypes['4']] = $vv["d"];
                // }
            }
        }
        ksort($arr);
        return $arr;
    }


    /**
     * 写入限额和退水设置
     * @param string $layer
     * @return array
     */
    public function setGames($layer=""){
        global $game_key;
        $games = [];
        foreach ($game_key as $k => $v){
            $pName1 = $k."_";
            if($layer == Constant::MEM) {
                $i = $this->param["type"];
                foreach ($v as $vv) {
                    $pName = $pName1;
                    $pName .= $vv;
                    $sc = isset($this->param[strtoupper("{$pName}_{$i}_SC")]) ? $this->param[strtoupper( "{$pName}_{$i}_SC")] : 0;
                    $so = isset($this->param[strtoupper("{$pName}_{$i}_SO")]) ? $this->param[strtoupper("{$pName}_{$i}_SO")] : 0;

                    $n = $vv . "_" . $i;
                    $pName .= "_" . $i;
                    $war = isset($this->param[strtoupper($pName . "_WAR")]) ? $this->param[strtoupper($pName . "_WAR")] : 0;
                    $games[$k]["data"][$n] = [
                        'type' => $n,
                        'rtype' => $vv,
                        'ltype' => $i,
                        'sc' => $sc,
                        'so' => $so,
                        'war' => $war,
                    ];
                }
            }else{
                for ($i = 1; $i <= 4; $i++) {
                    foreach ($v as $vv) {
                        $pName = $pName1;
                        $pName .= $vv;
                        $sc = isset($this->param[strtoupper($pName . "_1_SC")]) ? $this->param[strtoupper($pName . "_1_SC")] : 0;
                        $so = isset($this->param[strtoupper($pName . "_1_SO")]) ? $this->param[strtoupper($pName . "_1_SO")] : 0;

                        $n = $vv . "_" . $i;
                        $pName .= "_" . $i;
                        $war = isset($this->param[strtoupper($pName . "_WAR")]) ? $this->param[strtoupper($pName . "_WAR")] : 0;
                        $games[$k]["data"][$n] = [
                            'type' => $n,
                            'rtype' => $vv,
                            'ltype' => $i,
                            'sc' => $sc,
                            'so' => $so,
                            'war' => $war,
                        ];
                    }
                }
            }
        }
        return $games;
    }

    /**
     * 代理类 账号添加/修改验证
     * @return array|string[]
     */
    public function validate_ags($type="add"){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        $ctl = "";
        if($type=="add"){
            $ctl = "ctl|";
            if(!regexUser($this->param["username"]) || empty($this->param["username"])){
                $para = [
                    "status" => "error",
                    "code" => $ctl."user",
                    "msg" => $ls["0X011"]
                ];
                return $para;
            }

            if(!regexPwd($this->param["passwords"]) || empty($this->param["passwords"])){
                $para = [
                    "status" => "error",
                    "code" => $ctl."passwd",
                    "msg" => $ls["0X012"]
                ];
                return $para;
            }

            if(empty($this->param["up_layer"]) || empty($this->param["up_id"])) {
                $para = [
                    "status" => "error",
                    "code" => "0X001"
                ];
                return $para;
            }
        }

        if(!empty($this->param["enddate"]) && !regexDate($this->param["enddate"])){
            $para = [
                "status" => "error",
                "code" => $ctl."enddate",
                "msg" => $ls["0X016"]
            ];
            return $para;
        }

        if(!empty($this->param["end_date"]) && !regexDate($this->param["end_date"])){
            $para = [
                "status" => "error",
                "code" => $ctl."enddate",
                "msg" => $ls["0X016"]
            ];
            return $para;
        }

        if(empty($this->param["alias"])){
            $para = [
                "status" => "error",
                "code" => $ctl."alias",
                "msg" => $ls["0X013"]
            ];
            return $para;
        }

        if(strlen($this->param["alias"])>10){
            $para = [
                "status" => "error",
                "code" => $ctl."alias",
                "msg" => $ls["0X015"]
            ];
            return $para;
        }


        if(!is_numeric($this->param["maxcredit"]) || $this->param["maxcredit"]<0){
            $para = [
                "status" => "error",
                "code" => $ctl."credit",
                "msg" => $ls["0X009"]
            ];
            return $para;
        }

        return [
            "status" => "success"
        ];
    }

    /**
     * 修改分公司
     * @return array|string[]
     */
    public function d0_edit(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ags("edit");
        if($validate["status"]=="error"){
            return $validate;
        }

        return $this->updateAccount(Constant::D0);

    }

    /**
     * 修改股东
     * @return array|string[]
     */
    public function co_edit(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ags("edit");
        if($validate["status"]=="error"){
            return $validate;
        }

        return $this->updateAccount(Constant::CO);
    }

    /**
     * 修改总代
     * @return array|string[]
     */
    public function su_edit(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ags("edit");
        if($validate["status"]=="error"){
            return $validate;
        }

        return $this->updateAccount(Constant::SU);
    }

    /**
     * 修改代理
     * @return array|string[]
     */
    /**
     * 修改代理
     * @return array|string[]
     */
    public function ag_edit()
    {
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if ($this->userArr["status"] == "error") {
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ags("edit");


        if ($validate["status"] == "error") {
            return $validate;
        }

        return $this->updateAccountByShui(Constant::AG);

    }

    /**
     * 修改Rank表账号
     * @param string $layer
     * @return array
     */
    public function updateAccountByShui($layer = Constant::D0)
    {
        global $ls_msg;
        $p = $this->param;
        $ls = $ls_msg[$this->langx];
        $types = [
            1 => Constant::AG,
            2 => Constant::SU,
            3 => Constant::CO,
            4 => Constant::D0
        ];

        $nid = $this->user["nid"];
        $logMsg = "帐号管理->" . lv_nid($this->user["nid"])["name"] . "->";

        if (!isset($this->param["aid"]) || $this->param["aid"] * 1 <= 0) {
            return ["status" => "error", "msg" => $ls["0X003"]];
        }

        if (!isset($this->param["sid"]) || $this->param["sid"] * 1 <= 0) {
            return ["status" => "error", "msg" => $ls["0X003"]];
        }

        $table = Constant::T_RANK;
        if ($layer == Constant::MEM) {
            $table = Constant::T_MEMBER;
        }

        $rs = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$p["aid"]} AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
        if (!$rs) {
            return ["status" => "error", "code" => $ls["4X008"]];
        }
        
        $status = $this->getAccountStatus($rs["nid"], false);//上线账号状态

        // var_dump($table, $rs["nid"]);die;

        if (status_num_str(1, $p["enable"]) != $status) {

            switch ($status) {
                case 2:
                    return [
                        "status" => "error",
                        "msg" => $ls["4X013"]
                    ];
                case 3:
                    return [
                        "status" => "error",
                        "msg" => $ls["4X016"]
                    ];
                case 4:
                    return [
                        "status" => "error",
                        "msg" => $ls["4X014"]
                    ];
                case 5:
                    return [
                        "status" => "error",
                        "msg" => $ls["4X046"]
                    ];
            }
        }

        //已用额度
        if ($layer == Constant::MEM) {
            if ($rs["pay_type"] == 1) {
                $min_credit = 0;
            } else {
                $min_credit = $rs["credit"] - $rs["balance_credit"];
            }

        } else {
            $min_credit = $this->usedCredit($layer, $rs["nid"]);
        }

        if ($p["maxcredit"] < $min_credit) {
            $min_credit = number_format($min_credit, 2);
            return [
                "status" => "error",
                "code" => "maxcredit",
                "msg" => $ls["0X017"] . "({$min_credit})",
                "old_maxcredit" => $rs["credit"],
            ];
        }


        $logMsg .= "修改[账号:{$rs["name"]}]成功!";
        if ($layer == Constant::D0) {
            if ($p["dfwinloss"] > 100) {
                return ["status" => "error", "code" => "possess", "msg" => $ls["1X004"] . "100%"];
            }
        } else {
            $up_table = Constant::T_RANK;
            $uprs = $this->dbc->select("SELECT * FROM {$up_table} WHERE `id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
            if ($layer != Constant::MEM) {
                // if (!empty($p["dfwinloss"]) && $p["dfwinloss"] > $uprs["winloss"]) {
                //     return ["status" => "error", "code" => "possess", "msg" => $ls["1X004"] . "{$uprs["winloss"]}%"];
                // }
            }


            $up_layer = lv_nid($uprs["nid"])["lv"];
            $up_max_credit = $uprs["credit"] - ($this->usedCredit($up_layer, $uprs["nid"]) - $rs["credit"]);
            if ($p["maxcredit"] > $up_max_credit) {
                $up_max_credit = number_format($up_max_credit, 2);
                return ["status" => "error", "code" => "maxcredit", "msg" => $ls["0X014"] . "({$up_max_credit})"];
            }
        }

        if ((isset($p["no_date"]) && $p["no_date"] === "true") || !isset($p["end_date"])) {
            $enddate = 0;
        } else {
            $enddate = strtotime($p["end_date"]);
        }
        $update = [
            "alias" => $p["alias"],
            "credit" => $p["maxcredit"],
            "status" => status_num_str(1, $p["enable"]),
            "enddate" => $enddate
        ];
        if ($layer != Constant::MEM) {
            $update["winloss"] = 100-($p["dfwinloss"] == '' ? 0 : $p["dfwinloss"]);
        } else {
            $update["balance_credit"] = $rs["balance_credit"] + ($p["maxcredit"] - $rs["credit"]);
        }

        $update["is_banned"] = $p['is_banned'] == 'Y' ? 2 : 1;

        $this->dbc->beginTransaction();
        try {
            $table = Constant::T_RANK;
            if ($layer == Constant::MEM) {
                $table = Constant::T_MEMBER;
            }
            $this->dbc->update($table, $update, "`id`={$p["aid"]}");
            $this->insertLog($logMsg);
            $cash = $p["maxcredit"] - $rs["credit"];
            if ($rs["pay_type"] == 1) {
                $this->set_credit_logs($rs["nid"], $cash, $rs["credit"]);
            }

            $this->dbc->commit();
            return [
                "status" => "success",
                "code" => "edit"
            ];
        } catch (\Exception $e) {
            $this->dbc->rollback();
            return [
                "status" => "error",
                "msg" => $e->getMessage()
            ];
        }

    }



    /**
     * 修改会员
     * @return array|string[]
     */
    public function mem_edit(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ags("edit");
        if($validate["status"]=="error"){
            return $validate;
        }

        return $this->updateAccount(Constant::MEM);

    }

    /**
     * 修改Rank表账号
     * @param string $layer
     * @return array
     */
    public function updateAccount($layer = Constant::D0){
        global $ls_msg;
        $p = $this->param;
        $ls = $ls_msg[$this->langx];
        $types = [
            1=>Constant::AG,
            2=>Constant::SU,
            3=>Constant::CO,
            4=>Constant::D0
        ];

        $nid = $this->user["nid"];
        $logMsg = "帐号管理->".lv_nid($this->user["nid"])["name"]."->";

        if(!isset($this->param["aid"]) || $this->param["aid"]*1<=0){
            return ["status" => "error","msg" =>$ls["0X003"]];
        }

        if(!isset($this->param["sid"]) || $this->param["sid"]*1<=0){
            return ["status" => "error","msg" =>$ls["0X003"]];
        }

        $table = Constant::T_RANK;
        if($layer == Constant::MEM){
            $table = Constant::T_MEMBER;
        }

        $rs = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$p["aid"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
        if(!$rs){return ["status" => "error","code" =>$ls["4X008"]];}
        $status = $this->getAccountStatus($rs["nid"], false);//上线账号状态
        if(status_num_str(1,$p["enable"]) != $status) {

            switch ($status) {
                case 2:
                    return [
                        "status" => "error",
                        "msg" => $ls["4X013"]
                    ];
                case 3:
                    return [
                        "status" => "error",
                        "msg" => $ls["4X016"]
                    ];
                case 4:
                    return [
                        "status" => "error",
                        "msg" => $ls["4X014"]
                    ];
                case 5:
                    return [
                        "status" => "error",
                        "msg" => $ls["4X046"]
                    ];
            }
        }

        //已用额度
        if($layer == Constant::MEM){
            if($rs["pay_type"] == 1){
                $min_credit = 0;
            }else{
                $min_credit = $rs["credit"] - $rs["balance_credit"];
            }

        }else{
            $min_credit = $this->usedCredit($layer,$rs["nid"]);
        }

        if($p["maxcredit"]<$min_credit){
            $min_credit = number_format($min_credit,2);
            return [
                "status" => "error",
                "code" => "maxcredit",
                "msg" => $ls["0X017"]."({$min_credit})",
                "old_maxcredit" => $rs["credit"],
            ];
        }


        $logMsg .= "修改[账号:{$rs["name"]}]成功!";
        if($layer == Constant::D0){
            if($p["dfwinloss"] > 100){
                return ["status" => "error","code" =>"possess","msg"=>$ls["1X004"]."100%"];
            }
        }else{
            $up_table = Constant::T_RANK;
            $uprs = $this->dbc->select("SELECT * FROM {$up_table} WHERE `id`={$p["sid"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
            if($layer != Constant::MEM){
                if(!empty($p["dfwinloss"]) && $p["dfwinloss"] > $uprs["winloss"]){
                    return ["status" => "error","code" =>"possess","msg"=>$ls["1X004"]."{$uprs["winloss"]}%"];
                }
            }


            $up_layer = lv_nid($uprs["nid"])["lv"];
            $up_max_credit = $uprs["credit"] - ($this->usedCredit($up_layer,$uprs["nid"]) - $rs["credit"]);
            if($p["maxcredit"] > $up_max_credit){
                $up_max_credit = number_format($up_max_credit,2);
                return ["status" => "error","code" =>"maxcredit","msg"=>$ls["0X014"]."({$up_max_credit})"];
            }
        }

        if((isset($p["no_date"]) && $p["no_date"] === "true") || !isset($p["end_date"])){
            $enddate = 0;
        }else{
            $enddate = strtotime($p["end_date"]);
        }
        $update = [
            "alias" => $p["alias"],
            "credit" => $p["maxcredit"],
            "status" => status_num_str(1,$p["enable"]),
            "enddate" => $enddate
        ];
        if($layer != Constant::MEM) {
            if ("ss" . $p["dfwinloss"] != "ss" && $p["dfwinloss"] != $rs["winloss"]) {
                $update["dfwinloss"] = $p["dfwinloss"];
            }
        }else{
            $update["balance_credit"] = $rs["balance_credit"] + ($p["maxcredit"] - $rs["credit"]);
            if(isset($this->param["hidden_chk"])){
                if($this->param["hidden_chk"] == 'N'){
                    $update["hidden"] = 0;
                }
                if($this->param["hidden_chk"] == 'Y'){
                    $update["hidden"] = 1;
                }
            }
        }

        $this->dbc->beginTransaction();
        try{
            $table = Constant::T_RANK;
            if($layer == Constant::MEM){
                $table = Constant::T_MEMBER;
            }
            $this->dbc->update($table,$update,"`id`={$p["aid"]}");
            $this->insertLog($logMsg);
            $cash = $p["maxcredit"] - $rs["credit"];
            if($rs["pay_type"] == 1) {
                $this->set_credit_logs($rs["nid"], $cash, $rs["credit"]);
            }
            $this->dbc->commit();
            return [
                "status" => "success",
                "code" => "edit"
            ];
        }catch (\Exception $e){
            $this->dbc->rollback();
            return [
                "status" => "error",
                "msg" =>$e->getMessage()
            ];
        }

    }

    /**
     * 添加分公司
     * @return array|string[]
     */
    public function d0_add(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ags();
        if($validate["status"]=="error"){
            return $validate;
        }
        
        $userCount = $this->dbc->getCount(Constant::T_RANK,"id","name='{$this->param["username"]}'");
        if($userCount>0){
            return [
                "status" => "error",
                "code" => "ctl|user",
                "msg" => $ls["0X004"]
            ];
        }

        return $this->insertAccount(Constant::D0);

    }

    /**
     * 添加股东
     * @return array|string[]
     */
    public function co_add(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ags();
        if($validate["status"]=="error"){
            return $validate;
        }

        $userCount = $this->dbc->getCount(Constant::T_RANK,"id","name='{$this->param["username"]}'");
        if($userCount>0){
            return [
                "status" => "error",
                "code" => "ctl|user",
                "msg" => $ls["0X004"]
            ];
        }

        return $this->insertAccount(Constant::CO);

    }

    /**
     * 添加总代
     * @return array|string[]
     */
    public function su_add(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ags();
        if($validate["status"]=="error"){
            return $validate;
        }

        $userCount = $this->dbc->getCount(Constant::T_RANK,"id","name='{$this->param["username"]}'");
        if($userCount>0){
            return [
                "status" => "error",
                "code" => "ctl|user",
                "msg" => $ls["0X004"]
            ];
        }

        return $this->insertAccount(Constant::SU);

    }

    /**
     * 添加代理
     * @return array|string[]
     */
    public function ag_add()
    {
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if ($this->userArr["status"] == "error") {
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ags();
        if ($validate["status"] == "error") {
            return $validate;
        }

        $userCount = $this->dbc->getCount(Constant::T_RANK, "id", "name='{$this->param["username"]}'");
        if ($userCount > 0) {
            return [
                "status" => "error",
                "code" => "ctl|user",
                "msg" => $ls["0X004"]
            ];
        }

        return $this->insertAccount(Constant::AG);

    }


    /**
     * 添加Rank表账号
     * @param string $type
     * @return array
     */
    public function insertAccount($layer = Constant::D0)
    {
        global $special_d0, $special_co, $ls_msg, $ltypes,$ag_url;
        $ls = $ls_msg[$this->langx];
        $upfiled = "`nid`,`credit`";
        if ($layer == Constant::D0) {
            $upfiled = "`nid`";
            $special = $special_d0;
            $ary = ["D0_CO", "D0_SU", "D0_AG", "D0_MEM", "D0_MESS", "D1_SU", "D1_AG", "D1_MEM", "D1_MESS"];
        } else if ($layer == Constant::CO) {
            $special = $special_co;
            $upfiled = "`nid`,`credit`,`special`";
            $ary = ["D1_SU", "D1_AG", "D1_MEM", "D1_MESS"];
        }
        $types = [
            1 => Constant::AG,
            2 => Constant::SU,
            3 => Constant::CO,
            4 => Constant::D0
        ];

        $nid = $this->user["nid"];
        $logMsg = "帐号管理->" . lv_nid($this->user["nid"])["name"] . "->";

        if (!empty($this->param["up_id"])) {
            $up_table = Constant::T_RANK;
            if ($layer == Constant::D0) {
                $up_table = Constant::T_ADMIN;
            }
            /*if($this->param["up_id"]=="Y"){
                $this->param["up_id"] = $this->sup["id"];
            }*/
            $rs = $this->dbc->select("SELECT {$upfiled} FROM {$up_table} WHERE `id`={$this->param["up_id"]}", "Row");
            $nid = $rs["nid"];
            $status = $this->getAccountStatus($nid);
            switch ($status) {
                case 2:
                    $arr["status"] = "error";
                    $arr["code"] = $ls["4X013"];
                    return $arr;
                case 3:
                    $arr["status"] = "error";
                    $arr["code"] = $ls["4X016"];
                    return $arr;
                case 4:
                    $arr["status"] = "error";
                    $arr["code"] = $ls["4X014"];
                    return $arr;
                case 5:
                    $arr["status"] = "error";
                    $arr["code"] = $ls["4X046"];
                    return $arr;
            }
            $lv_nid = lv_nid($nid);
            $logMsg .= $lv_nid["name"] . "->";

            if (isset($rs["credit"])) {
                $up_balance_credit = $rs["credit"] - $this->usedCredit($lv_nid["lv"], $nid);
                if ($this->param["maxcredit"] > $up_balance_credit && $this->param["pay_type"] != 1) {
                    $para = [
                        "status" => "error",
                        "code" => "ctl|credit",
                        "msg" => $ls["1X005"] . $up_balance_credit
                    ];
                    return $para;
                }
            }
        }

        $insert = [];
        $insert["nid"] = set_nid($nid);
        $insert["uid"] = md5($this->param["username"]);
        $insert["name"] = $this->param["username"];
        $insert["alias"] = $this->param["alias"];
        $insert["passwd"] = md5(md5($this->param["passwords"]));
        $insert["pw"] = $this->param["passwords"];
        $insert["credit"] = $this->param["maxcredit"];
        $type = lv_nid($insert["nid"])["lv"];


        if ($layer != Constant::MEM) {
            if ($layer == Constant::D0 || $layer == Constant::SU) {
                $wc = isset($this->param["winloss_c"]) ? $this->param["winloss_c"] : 0;
                $insert["winloss"] = $this->param["winloss"] - $wc;
            } else { 
                $insert["winloss"] = $this->param["winloss"];
                if ($layer == Constant::AG && isset($this->param["winloss_a"])){ 
                    $insert["winloss"] = 100 - $this->param["winloss_a"];
                }
                
            }

            $insert["level"] = array_search($type, $types);//权限

            if ($layer == Constant::AG) {
                // $insert["winloss"] = 100-$this->param["winloss_a"];
                $insert["pay_type"] = $this->param["pay_type"];
            }

            if (isset($special) && !empty($special)) {
                $specials = [];
                foreach ($special as $v) {
                    if (isset($this->param[$v])) {
                        $specials[$v] = $this->param[$v];
                    } else {

                        if (in_array($v, $ary)) {
                            $specials[$v] = "N";
                        } else {
                            $specials[$v] = "false";
                        }
                    }
                }
                $insert["special"] = json_encode($specials);
            }
            $insert["config"] = json_encode($this->setGames());
        } else {
            $insert["currency"] = $this->param["currency"];
            $insert["ltype"] = $ltypes[$this->param["type"]];
            $insert["pay_type"] = $this->param["pay_type"];
            $insert["balance_credit"] = $this->param["maxcredit"];
            $insert["config"] = json_encode($this->setGames(Constant::MEM));
        }

        $insert["adddate"] = time();

        if ((isset($this->param["no_date"]) && $this->param["no_date"] === "true") || !isset($this->param["end_date"])) {
            $insert["enddate"] = 0;
        } else {
            $insert["enddate"] = strtotime($this->param["end_date"]);
        }


        $this->dbc->beginTransaction();
        try {
            $table = Constant::T_RANK;
            if ($layer == Constant::MEM) {
                $table = Constant::T_MEMBER;
            }
            $insertID = $this->dbc->insert($table, $insert, true);
            $upSon = "N";
            switch ($layer) {
                case Constant::D0:
                    if ($this->login_layer == Constant::AD) {
                        $upSon = "Y";
                    }
                    break;
                case Constant::CO:
                    if ($this->login_layer == Constant::D0) {
                        $upSon = "Y";
                    }
                    break;
                case Constant::SU:
                    if ($this->login_layer == Constant::CO) {
                        $upSon = "Y";
                    }
                    break;
                case Constant::AG:
                    if ($this->login_layer == Constant::SU) {
                        $upSon = "Y";
                    }
                    break;
                case Constant::MEM:
                    if ($this->login_layer == Constant::AG) {
                        $upSon = "Y";
                    }
                    break;
            }
            if ($upSon == "Y") {
                $smn = $this->son_nid_manger("idAry");
                if ($smn !== false) { //子账号添加的下线归属子账号管理
                    $smn[] = $insertID;
                    $this->dbc->update($table, ["manager_uid" => implode(",", $smn)], "`id`={$this->user["id"]}");
                }
            }
            $logMsg .= "新增" . lv_nid($insert["nid"])["name"] . "[{$this->param["username"]}]成功!";
            $this->insertLog($logMsg);
            if (isset($insert["pay_type"]) && $insert["pay_type"] == 1 && $insert["credit"] > 0) {//现金额度
                $this->set_credit_logs($insert['nid'], $insert['credit']);
            }
            $this->dbc->commit();
//            return [
//                "status" => "success",
//                "code" => "add"
//            ];
            
            $user_information = array(
                "addUser_url" => $ag_url,
                "status" => "success",
                "user_id" => $insertID,
                "pay_type" => "0",
                "username" => $this->param["username"],
                "alias" => $this->param["alias"],
            );
            return [
                "status" => "success",
                "code" => "add",
                "user_information"=>$user_information
            ];
        } catch (\Exception $e) {
            $this->dbc->rollback();
            return [
                "status" => "error",
                "msg" => $e->getMessage()
            ];
        }

    }



    /**
     * 入库现金额度记录日志
     * @param $nid
     * @param $cash 现金额度
     * @param $old_cash 旧额度
     */
    public function set_credit_logs($nid,$cash,$old_cash=0,$usertype=""){
        $insert = [
            "nid" => $nid,
            "type" => $cash>0 ? "Y" : "N",
            "old_cash" => $old_cash,
            "cash" => $cash,
            "new_cash" => $old_cash + $cash,
            "usertype" => $usertype,
            "logintime"  => time()
        ];

        if(isset($this->sup["name"])){
            $insert["s_name"] = $this->sup["name"];
            if(isset($this->user["name"]) && $this->user["name"] != $this->sup["name"]){//子账号操作
                $insert["ss_name"] = $this->user["name"];
            }
        }

        if(isset($this->sup["nid"]) && empty($usertype)){
            $insert["usertype"] = lv_nid($this->sup["nid"])["name"];
        }

        $this->dbc->insert(Constant::T_CREDIT_LOG,$insert);
    }

    /**
     * 添加会员
     * @return array|string[]
     */
    public function mem_add(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ags();
        if($validate["status"]=="error"){
            return $validate;
        }

        $userCount = $this->dbc->getCount(Constant::T_MEMBER,"id","name='{$this->param["username"]}'");
        if($userCount>0){
            return [
                "status" => "error",
                "code" => "ctl|user",
                "msg" => $ls["0X004"]
            ];
        }

        return $this->insertAccount(Constant::MEM);

    }

    /**
     * 添加子账号
     * @param string $layer
     * @return array|string[]
     */
    public function sub_add(){
        global $ls_msg;
        $layer = $this->login_layer;
        $p = $this->param;
        $ls = $ls_msg[$p["langx"]];
        $action = isset($p["action"]) ? $p["action"] : "";

        if($action != "edit"){
            if(!regexUser($p["subname"]) || empty($p["subname"])){
                $para = [
                    "status" => "error",
                    "code" => "ctl|user",
                    "msg" => $ls["0X011"]
                ];
                return $para;
            }

            if(!regexPwd($p["passwords"]) || empty($p["passwords"])){
                $para = [
                    "status" => "error",
                    "code" => "ctl|passwd",
                    "msg" => $ls["0X012"]
                ];
                return $para;
            }
        }


        if(empty($this->param["alias"])){
            $para = [
                "status" => "error",
                "code" => "ctl|alias",
                "msg" => $ls["0X013"]
            ];
            return $para;
        }

        if(strlen($this->param["alias"])>10){
            $para = [
                "status" => "error",
                "code" => "ctl|alias",
                "msg" => $ls["0X015"]
            ];
            return $para;
        }

        if($action == "edit"){
            $insert = [
                "pri"  => $p["set_pri_type"],
                "alias"=> $p["alias"],
                "manager_uid" => !empty($p["set_manager_uid"]) ? $p["set_manager_uid"] : 0,
                "pwd_safe" => !empty($p["passwordssafe"]) ? $p["passwordssafe"] : "",
            ];
        }else{
            $insert = [
                "name" => $p["subname"],
                "pri"  => $p["set_pri_type"],
                "alias"=> $p["alias"],
                "pw"   => $p["passwords"],
                "passwd" =>md5(md5($p["passwords"])),
                "isMaster" =>1,
                "nid" => $this->sup["nid"],
                "pri" => $p["set_pri_type"],
                "level" => $this->sup["level"],
                "manager_uid" => !empty($p["set_manager_uid"]) ? $p["set_manager_uid"] : 0,
                "adddate" => time(),
                "pwd_safe" => !empty($p["passwordssafe"]) ? $p["passwordssafe"] : "",
                "uid" => sha1(time())
            ];
        }

        switch ($layer){
            case Constant::ADS:
            case Constant::AD:
                global $special_ad_sub;
                $speciald = $special_ad_sub;
                unset($insert["pwd_safe"]);
                break;
            case Constant::D0:
                global $special_D0_sub;
                $speciald = $special_D0_sub;
                break;
            case Constant::CO:
                global $special_CO_sub;
                $speciald = $special_CO_sub;
                break;
        }

        if(isset($speciald)){
            $sp = [];
            foreach ($speciald as $k => $v){
                if(isset($p[$k])){
                    $sp[$k] = $p[$k];
                }else{
                    $sp[$v] = $v;
                }
            }

            $insert["special"] = json_encode($sp);
        }

        $this->dbc->beginTransaction();
        try{
            $table = Constant::T_RANK;
            if($layer == Constant::ADS || $layer == Constant::AD){
                $table = Constant::T_ADMIN;
            }
            $uid = 0;
            $alias = "";
            $username = "";
            if($action == "edit") {
                $uid  = $p["subid"];
                $r = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$p["subid"]} AND `isMaster`=1 AND `nid`='{$this->sup["nid"]}'","Row");
                if(!$r){return ["status" => "error", "code" => $ls["4X008"]];}
                $this->dbc->update($table,$insert,"`id`={$p["subid"]} AND `isMaster`=1 AND `nid`='{$this->sup["nid"]}'");
                $username = $r["name"];
                $alias = $r["alias"];
                $this->insertLog('帐号管理->子账号->修改子账号[' . $r["name"] . ']成功!');
            }else{
                $uid = $this->dbc->insert($table, $insert, true);
                $this->insertLog('帐号管理->子账号->新增子账号[' . $this->param["subname"] . ']成功!');
                $username = $this->param["subname"];
                $alias = $this->param["alias"];
            }
            $this->dbc->commit();
            //{"user_information":{"status":"success","user_id":10040091,"username":"Betaa123","alias":"Betaa123","addAgUser_url":"https:\/\/ag.mos011.com\/","is_create":true},"code":"add","status":"success"}
            $schema = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http";
            $addAgUser_url = $schema . "://" . $_SERVER['HTTP_HOST'];
            return ["status" => "success","code" => "add", "user_information" => [
                "status" => "success",
                "user_id" => $uid,
                "username" => $username,
                "alias" => $alias,
                "addAgUser_url" => $addAgUser_url,
                "is_create" => true
            ]];
        }catch (\Exception $e){
            $this->dbc->rollback();
            return ["status" => "error", "code" => $e->getMessage()];
        }
    }

    public function setting_edit(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];

        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        if($this->param["type"] == "setting") {
            $validate = $this->validate_im();
            if ($validate != "ok") {
                return $validate;
            }
        }

        if($this->param["type"] == "saveUI"){ 
            $sql = "TRUNCATE TABLE ".Constant::T_HTML; 
            $this->dbs->select($sql);
            $para = [
                "status" => "success",
                "code" => "edit"
            ];

            return $para;
        }

        $this->dbc->beginTransaction();
        try{
            $connTable = Constant::T_CONFIG_DEFAULT;
            $log = "";
            if($this->param["type"] == "setting"){
                if(isset($this->param["min_m"])){
                    $update = [
                        "m_min"   => $this->param["min_m"],
                        "r_min"   => $this->param["min_r"],
                        "re_min"  => $this->param["min_re"],
                        "dt_min"  => $this->param["min_dt"],
                        "rdt_min"  => $this->param["min_rdt"],
                        "fs_min"  => $this->param["min_fs"],
                        "m_max"   => $this->param["max_m"],
                        "r_max"   => $this->param["max_r"],
                        "re_max"  => $this->param["max_re"],
                        "dt_max"  => $this->param["max_dt"],
                        "rdt_max"  => $this->param["max_rdt"],
                        "fs_max"  => $this->param["max_fs"]
                    ];
                    $log = "默认单注最低限额";
                }

            }else{
                if(isset($this->param["webstr"]) && isset($this->param["website"])){
                    $isrg = 0;//是否人工设置维护
                    if($this->param["website"] == 1){
                        $isrg = 1;
                    }
                    $pattern = '/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s(0\d|1[0-9]|2[0-3]):[0-5]\d:[0-5]\d~(0\d|1[0-9]|2[0-3]):[0-5]\d:[0-5]\d$/';
                    if (!preg_match($pattern, $this->param["webstr"])){ 
                        $para = [
                            "status" => "error",
                            "code" => "edit",
                            "msg" => "维护时间[开始]:请输入正确的日期时间格式!"
                        ];
                        return $para;
                    }else{ 
                        $update = [
                            "webend"    => $this->param["webend"],
                            "webstr"    => $this->param["webstr"],
							"isgoogle"  => $this->param["isgoogle"],
							"google_code"  => $this->param["google_code"],
                            "website"   => $this->param["website"], //$this->param["website"] == 1 ? 619 : $this->param["website"],
                            "isrg"      => $isrg
                        ];
                        $log = "维护设置";
                    }


                    
                }
            }

            if(isset($update)){
                $where = "`id`=1";
                if($this->login_layer==Constant::AD){
                    $connTable = Constant::T_CONFIG;
                    $where = "`nid`='{$this->sup["nid"]}'";
                }
                $this->dbc->update($connTable,$update,$where);
                $this->dbc->commit();
                $this->insertLog("系统设置->{$log}->修改成功!");
                $para = [
                    "status" => "success",
                    "code" => "edit"
                ];
            }else{
                $para = [
                    "status" => "error",
                    "code" => "4X014",
                ];
            }
            return $para;
        }catch (\Exception $e){
            $this->dbc->rollback();
            $para = [
                "status" => "error",
                "code" => "alias",
                "msg" => $e->getMessage()
            ];
            return $para;
        }
    }



    /**
     * 添加公司
     * @return array|string[]
     */
    public function admin_add(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        $validate = $this->validate_ad();
        if($validate["status"]=="error"){
            return $validate;
        }

        $table = Constant::T_ADMIN;
        $cou = $this->dbc->getCount($table,"`id`","`name`='{$this->param["username"]}'");
        if($cou>0){
            $para = [
                "status" => "error",
                "code" => "user",
                "msg" => $ls["0X004"]
            ];
            return $para;
        }

        $rs = $this->dbc->select("SELECT `nid` FROM {$table} WHERE `id`={$this->param["up_id"]} AND `isMaster`=0","Row");
        if(!$rs){
            $para = [
                "status" => "error",
                "code" => "ctl|input_max",
                "msg" => $ls["0X001"]
            ];
            return $para;
        }
        $nid = set_nid($rs["nid"]);

        $arraySql = [];
        $time = time();
        $pwd = md5(md5($this->param["passwords"]));
        $enddate = 0;
        if(!empty($this->param["enddate"])) $enddate = strtotime($this->param["enddate"]);

        $this->dbc->beginTransaction();
        try{
            $insert = [
                "uid" => $this->param["username"],
                "nid" => $nid,
                "name"=> $this->param["username"],
                "passwd" => $pwd,
                "pw" => $this->param["passwords"],
                "alias" => $this->param["alias"],
                "seturl" => $this->param["url"],
                "adddate" => $time,
                "level" => 1,
                "enddate" => $enddate
            ];
            $insertID = $this->dbc->insert($table,$insert,true);
            $connTable = Constant::T_CONFIG;
            $ins = [
                "nid" => $nid,
                "m_min" => $this->param["min_m"],
                "r_min" => $this->param["min_r"],
                "re_min"=> $this->param["min_re"],
                "dt_min"=> $this->param["min_dt"],
                "rdt_min" => $this->param["min_rdt"],
                "fs_min" => $this->param["min_fs"],
                "m_max" => $this->param["max_m"],
                "r_max" => $this->param["max_r"],
                "re_max" => $this->param["max_re"],
                "dt_max" => $this->param["max_dt"],
                "rdt_max" => $this->param["max_rdt"],
                "fs_max" => $this->param["max_fs"]
            ];
            $this->dbc->insert($connTable,$ins);
            $smn = $this->son_nid_manger("idAry");
            if($smn !== false){ //子账号添加下线 归属子账号管理
                $smn[] = $insertID;
                $this->dbc->update($table,["manager_uid"=>implode(",",$smn)],"`id`={$this->user["id"]}");
            }
            $this->insertLog('帐号管理->公司->新增公司['.$this->param["username"].']成功!');
            $this->dbc->commit();
            $para = [
                "status" => "success",
                "code" => "add"
            ];
            return $para;
        }catch (\Exception $e){
            $this->dbc->rollback();
            return ["status"=>"erroe","code"=>$e->getMessage()];
        }
    }

    /**
     * 修改公司
     * @return array|string[]
     */
    public function admin_edit(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "msg" => "",
                "code" => "4X014",
            ];
            return $para;
        }
        $user = $this->user;
        $sup  = $this->sup;


        $validate = $this->validate_ad("edit");
        if($validate["status"]=="error"){
            return $validate;
        }


        $table = Constant::T_ADMIN;
        $lower = $this->dbc->select("SELECT * FROM {$table} WHERE `name`='{$this->param["username"]}' AND `id`={$this->param["id"]} AND `nid` LIKE '{$sup["nid"]}%'","Row");
        if(!$lower){
            $para = [
                "status" => "error",
                "msg" => "",
                "code" => "4X008",
            ];
            return $para;
        }
        $this->dbc->beginTransaction();
        try{
            $status = status_num_str(1,$this->param["enable"]);
            $enddate = 0;
            if(!empty($this->param["enddate"])) $enddate = strtotime($this->param["enddate"]);
            $update = [
                "alias"  => $this->param["alias"],
                "seturl"  => $this->param["url"],
                "status" => $status,
                "enddate" => $enddate
            ];

            $this->dbc->update($table,$update,"`id`={$lower["id"]}");
            if(isset($this->param["min_m"])){
                $connTable = Constant::T_CONFIG;
                $update = [
                    "m_min"   => $this->param["min_m"],
                    "r_min"   => $this->param["min_r"],
                    "re_min"  => $this->param["min_re"],
                    "dt_min"  => $this->param["min_dt"],
                    "rdt_min"  => $this->param["min_rdt"],
                    "fs_min"  => $this->param["min_fs"],
                    "m_max"   => $this->param["max_m"],
                    "r_max"   => $this->param["max_r"],
                    "re_max"  => $this->param["max_re"],
                    "dt_max"  => $this->param["max_dt"],
                    "rdt_max"  => $this->param["max_rdt"],
                    "fs_max"  => $this->param["max_fs"]
                ];
                $this->dbc->update($connTable,$update,"`nid`='{$lower["nid"]}'");
            }

            $this->dbc->commit();
            $this->insertLog('帐号管理->公司->修改公司['.$this->param["username"].']成功!');
            $para = [
                "status" => "success",
                "code" => "edit"
            ];
            return $para;
        }catch (\Exception $e){
            $this->dbc->rollback();
            $para = [
                "status" => "error",
                "code" => "alias",
                "msg" => $e->getMessage()
            ];
            return $para;
        }

    }

    /**
     * 公司账号添加/修改验证
     * @return array|string[]
     */
    public function validate_ad($type="add"){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];

        if($type=="add"){
            if(!regexUser($this->param["username"]) || empty($this->param["username"])){
                $para = [
                    "status" => "error",
                    "code" => "ctl|user",
                    "msg" => $ls["0X011"]
                ];
                return $para;
            }

            if(!regexPwd($this->param["passwords"]) || empty($this->param["passwords"])){
                $para = [
                    "status" => "error",
                    "code" => "ctl|passwd",
                    "msg" => $ls["0X012"]
                ];
                return $para;
            }

            if(empty($this->param["up_layer"]) || empty($this->param["up_id"])) {
                $para = [
                    "status" => "error",
                    "code" => "0X001"
                ];
                return $para;
            }
        }




        if(!empty($this->param["enddate"]) && !regexDate($this->param["enddate"])){
            $para = [
                "status" => "error",
                "code" => "ctl|enddate",
                "msg" => $ls["0X016"]
            ];
            return $para;
        }

        if(empty($this->param["alias"])){
            $para = [
                "status" => "error",
                "code" => "ctl|alias",
                "msg" => $ls["0X013"]
            ];
            return $para;
        }

        if(strlen($this->param["alias"])>10){
            $para = [
                "status" => "error",
                "code" => "ctl|alias",
                "msg" => $ls["0X015"]
            ];
            return $para;
        }


        $para = $this->validate_im();
        if($para == "ok"){
            return [
                "status" => "success"
            ];
        }else{
            return $para;
        }



    }

    public function validate_im(){
        global $ls_msg;
        $ls = $ls_msg[$this->param["langx"]];
        if(isset($this->param["min_m"])) {
            if (!is_numeric($this->param["min_m"]) || $this->param["min_m"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_min_m",
                    "msg" => $ls["0X00MINM"]
                ];
                return $para;
            }

            if (!is_numeric($this->param["min_r"]) || $this->param["min_r"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_min_r",
                    "msg" => $ls["0X00MINR"]
                ];
                return $para;
            }

            if (!is_numeric($this->param["min_dt"]) || $this->param["min_dt"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_min_dt",
                    "msg" => $ls["0X00MINDT"]
                ];
                return $para;
            }

            if (!is_numeric($this->param["min_re"]) || $this->param["min_re"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_min_re",
                    "msg" => $ls["0X00MINRE"]
                ];
                return $para;
            }

            if (!is_numeric($this->param["min_rdt"]) || $this->param["min_rdt"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_min_rdt",
                    "msg" => $ls["0X00MINRDT"]
                ];
                return $para;
            }

            if (!is_numeric($this->param["min_fs"]) || $this->param["min_fs"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_min_fs",
                    "msg" => $ls["0X0MINFS"]
                ];
                return $para;
            }
        }

        if(isset($this->param["max_m"])) {
            if (!is_numeric($this->param["max_m"]) || $this->param["max_m"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_max_m",
                    "msg" => $ls["0X00MAXM"]
                ];
                return $para;
            }

            if (!is_numeric($this->param["max_r"]) || $this->param["max_r"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_max_r",
                    "msg" => $ls["0X00MAXR"]
                ];
                return $para;
            }

            if (!is_numeric($this->param["max_dt"]) || $this->param["max_dt"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_max_dt",
                    "msg" => $ls["0X0MAXDT"]
                ];
                return $para;
            }

            if (!is_numeric($this->param["max_re"]) || $this->param["max_re"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_max_re",
                    "msg" => $ls["0X00MAXRE"]
                ];
                return $para;
            }

            if (!is_numeric($this->param["max_rdt"]) || $this->param["max_rdt"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_max_rdt",
                    "msg" => $ls["0X0MAXRDT"]
                ];
                return $para;
            }

            if (!is_numeric($this->param["max_fs"]) || $this->param["max_fs"] < 0) {
                $para = [
                    "status" => "error",
                    "code" => "ctl|input_max_fs",
                    "msg" => $ls["0X0MAXFS"]
                ];
                return $para;
            }
        }

        return "ok";
    }

    /**
     * 添加子账号 资料查询
     * @return array
     */
    public function get_sub_lower(){
        $where = "`nid` LIKE '{$this->sup["nid"]}%'";
        $table = Constant::T_RANK;
        if($this->login_layer == Constant::AG){
            $table = Constant::T_MEMBER;
        }else{
            $where .= " AND `isMaster`=0";
            $level = 1;
            switch ($this->login_layer){
                case Constant::ADS:
                    $table = Constant::T_ADMIN;
                    break;
                case Constant::AD:
                    $level = 4;
                    break;
                case Constant::D0:
                    $level = 3;
                    break;
                case Constant::CO:
                    $level = 2;
                    break;
                case Constant::SU:
                    $level = 1;
                    break;
            }
            $where .= " AND `level`={$level}";

        }

        if(isset($this->param["lower_name"]) && !empty($this->param["lower_name"])){
            $where .= " AND `name` LIKE '{$this->param["lower_name"]}%'";
        }

        $arr = [
            "account" => [],
            "isAll" => "",
            "user_mlimit" => "200"
        ];

        //特殊权限处理
        switch ($this->login_layer){
            case Constant::ADS:
            case Constant::AD:
                global $special_ad,$special_ad_sub;
                $adTable = Constant::T_ADMIN;
                $special = $special_ad_sub;
                if(isset($this->param["subid"])){//修改
                    $sub = $this->dbc->select("SELECT `special` FROM {$adTable} WHERE `id`={$this->param["subid"]} AND `isMaster`=1","Row");
                    if($sub && !empty($sub["special"])){
                        $special = json_decode($sub["special"],true);
                        if(empty($special)){$special = $special_ad;}
                    }
                }
                $arr["special"] = [
                    "isSpecial" => "Y",
                    "sup" => $special_ad,
                    "list" => $special
                ];
                break;
            case Constant::D0:
                global $special_d0_sub;
                $rankTable = Constant::T_RANK;
                $d0_special = json_decode($this->sup["special"],true);
                $sup_s = [];
                $list = $special_d0_sub;
                $isSpecial = "N";
                foreach ($special_d0_sub as $k => $v){
                    if($d0_special[$k] == "N" || $d0_special[$k] == "false"){
                        $sup_s[$k] = "N";
                    }else{
                        $sup_s[$k] = "Y";
                        $isSpecial = "Y";
                    }
                }
                if(isset($this->param["subid"])) {//修改
                    $sub = $this->dbc->select("SELECT `special` FROM {$rankTable} WHERE `id`={$this->param["subid"]} AND `isMaster`=1","Row");
                    if($sub && !empty($sub["special"])){
                        $list = json_decode($sub["special"],true);
                        if(empty($list)){$list = $special_d0_sub;}
                    }
                }
                $arr["special"] = [
                    "isSpecial" => $isSpecial,
                    "sup" => $sup_s,
                    "list" => $list
                ];
                break;
            case Constant::CO:
                global $special_co_sub;
                $rankTable = Constant::T_RANK;
                $co_special = json_decode($this->sup["special"],true);
                //$co = json_decode($co,true);
                $sup_s = [];
                $list = $special_co_sub;
                $isSpecial = "N";

                //分公司权限查询
                $nid = sup_nid(Constant::D0,$this->sup["nid"]);
                $d0 = $this->dbc->select("SELECT `special` FROM {$rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                $d0_s = json_decode($d0["special"],true);

                foreach ($special_co_sub as $k => $v){
                    if(!isset($d0_s[$k]) || $d0_s[$k] == "N" || $d0_s[$k] == "false"){//分公司权限未开通
                        $sup_s[$k] = "N";
                    }else{
                        if(!isset($co_special[$k]) || $co_special[$k] == "N" || $co_special[$k] == "false"){
                            $sup_s[$k] = "N";
                        }else{
                            $sup_s[$k] = "Y";
                        }
                    }

                }

                if(isset($this->param["subid"])) {//修改
                    $sub = $this->dbc->select("SELECT `special` FROM {$rankTable} WHERE `id`={$this->param["subid"]} AND `isMaster`=1","Row");
                    if($sub && !empty($sub["special"])){
                        $list = json_decode($sub["special"],true);
                        if(empty($list)){$list = $special_co_sub;}
                    }
                }
                $arr["special"] = [
                    "isSpecial" => $isSpecial,
                    "sup" => $sup_s,
                    "list" => $list
                ];
                break;
        }
        $rs = $this->dbc->select("SELECT `alias`,`name`,`id` FROM {$table} WHERE {$where} ORDER BY `name` ASC,`id` DESC","All");
        if(!empty($this->param["subid"])){
            $sub_table = Constant::T_RANK;
            if($this->param["login_layer"] == Constant::AD || $this->param["login_layer"] == Constant::ADS){
                $sub_table = Constant::T_ADMIN;
            }
            $sub_rs = $this->dbc->select("SELECT `manager_uid` FROM {$sub_table} WHERE `id`={$this->param["subid"]} AND `isMaster`=1 AND `nid`='{$this->sup["nid"]}'","Row");

            if($sub_rs){
                if($sub_rs["manager_uid"]==0){
                    $arr["isAll"] = "checked";
                }
            }

        }
        if(count($rs)>0){
            $account = [];
            foreach ($rs as $v){
                $isChk = "";
                if(isset($sub_rs) && $sub_rs){
                    if(!empty($sub_rs["manager_uid"])){
                        $manager_uid = explode(",",$sub_rs["manager_uid"]);
                        if(in_array($v["id"],$manager_uid)){
                            $isChk = "checked";
                        }
                    }else{
                        $isChk = "checked";
                    }

                }
                $account[] = [
                    "alias" => $v["alias"],
                    "id" => $v["id"],
                    "isChk" => $isChk,
                    "loginid" => "-",
                    "username" => $v["name"]
                ];

            }
            $arr["account"] = $account;
        }

        return $arr;
    }

    /**
     * 搜索账号
     */
    public function get_quick_search(){
        $p = $this->param;
        $arr = [
            "page" => 1,
            "totalpage" => 1
        ];
        $searchType = $p["searchType"];
        $login_layer = $p["login_layer"];
        $search_layer = $p["search_layer"];
        $searchName = $p["searchName"];
        $sortName = $p["sortName"];
        $sortType = $p["sortType"];
        $order = " ORDER BY ";
        switch ($sortName){
            case "adddate":
                $order .= "`adddate`";
                break;
            case "status":
                $order .= "`status`";
                break;
            default:
                $order .= "`name`";
                break;
        }
        if($sortType == "down"){
            $order .= " DESC";
        }else{
            $order .= " ASC";
        }

        $where =  " AND `name` LIKE '%{$searchName}%'";

        if($searchType == "subAcc"){//子账号查询
            $usertype = $login_layer;
            switch ($login_layer){
                case Constant::AD:
                    if(strlen($this->sup["nid"]) == 16){
                        $usertype = Constant::ADS;
                    }
                    break;
                case Constant::CO:
                    $usertype = "corprator";
                    break;
                case Constant::SU:
                    $usertype = "super_agents";
                    break;
                case Constant::AG:
                    $usertype = "agents";
                    break;
            }
            $table = Constant::T_RANK;
            if($login_layer == Constant::AD || $login_layer == Constant::ADS){
                $table = Constant::T_ADMIN;
            }
            $count = $this->dbc->getCount($table,"id","`isMaster`=1 AND `nid` = '{$this->sup["nid"]}' {$where}");
            $page = pager($p,$count);
            $arr["page"] = $page["page"];
            $arr["totalpage"] = $page["totalpage"];
            $limit = " LIMIT {$page["start"]},{$page["size"]}";
            $sub = $this->dbc->select("SELECT * FROM {$table} WHERE `isMaster`=1 AND `nid` = '{$this->sup["nid"]}' {$where} {$order} {$limit}");
            $accData = [];
            foreach ($sub as $v){
                $passwd_safe = "aaaaaa";
                switch ($login_layer){
                    case Constant::CO:
                    case Constant::SU:
                        $passwd_safe = empty($v["pwd_safe"]) ? "aaaaaa" : $v["pwd_safe"];
                        break;
                    case Constant::AG:
                        $passwd_safe = empty($v["loginname"]) ? "aaaaaa" : $v["loginname"];
                        break;
                }
                $accData[] = [
                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                    "alias" => $v["alias"],
                    "edit_type" => "2",
                    "enable" => status_num_str(2,$v["status"]) ,
                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                    "id" => $v["id"],
                    "passwd_safe" => $passwd_safe,
                    "pri" => $v["pri"],
                    "user_id" => $v["id"],
                    "username" => $v["name"],
                    "usertype" => $usertype,
                ];
            }
            $arr["accData"] = $accData;
        }else{
            switch ($login_layer){
                case Constant::ADS:
                case Constant::AD:
                    if(strlen($this->sup["nid"]) == 16){ //超管
                        $table = Constant::T_ADMIN;
                        $ad_id_data = [];
                        $ad_nid_data = [];
                        $ad = $this->dbc->select("SELECT `id`,`nid`,`name`  FROM {$table} WHERE `level`=1 AND `isMaster`=0 {$order}");
                        foreach ($ad as $v){
                            $ad_id_data[$v["id"]] = [
                                "id" => $v["id"],
                                "ads_ad_id" => 1,
                                "username" => $v["name"],
                                "usertype" => "ad"
                            ];
                            $ad_nid_data[$v["id"]] = $v["nid"];
                        }
                        $arr["ad_id_data"] = $ad_id_data;
                    }

                    switch ($searchType){
                        case Constant::D0:
                            $table = Constant::T_RANK;
                            $count = $this->dbc->getCount($table,"id","`level`=4 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'  {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $d0_id_data = [];
                            $d0 = $this->dbc->select("SELECT * FROM {$table} WHERE `level`=4 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($d0 as $v){
                                if(strlen($this->sup["nid"]) == 16) { //超管
                                    $ad_id = array_search(sup_nid(Constant::D0, $v["nid"]), $ad_nid_data);
                                }else{
                                    $ad_id = $this->sup["id"];
                                }
                                $d0_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "ad_id" => $ad_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["pwd_safe"]) ? "aaaaaa" : $v["pwd_safe"],
                                    "username" => $v["name"],
                                    "usertype" => "d0",
                                ];
                            }
                            $arr["d0_id_data"] = $d0_id_data;

                            break;
                        case Constant::CO:
                            $table = Constant::T_RANK;
                            $d0_id_data = [];
                            $d0_nid_data = [];
                            $d0 = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=4 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($d0 as $v){
                                $ad_id = array_search(sup_nid(Constant::D0,$v["nid"]),$ad_nid_data) ;
                                $d0_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "ad_d0_id" => $ad_id,
                                    "username" => $v["name"],
                                    "usertype" => "d0"
                                ];
                                $d0_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["d0_id_data"] = $d0_id_data;

                            $count = $this->dbc->getCount($table,"id","`level`=3 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'  {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $co_id_data =[];
                            $co = $this->dbc->select("SELECT * FROM {$table} WHERE `level`=3 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($co as $v){
                                $d0_id = array_search(sup_nid(Constant::CO,$v["nid"]),$d0_nid_data) ;
                                $co_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "d0_id" => $d0_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["pwd_safe"]) ? "aaaaaa" : $v["pwd_safe"],
                                    "username" => $v["name"],
                                    "usertype" => "corprator",
                                ];
                            }
                            $arr["co_id_data"] = $co_id_data;
                            break;
                        case Constant::SU:
                            $table = Constant::T_RANK;
                            //分公司
                            $d0_id_data = [];
                            $d0_nid_data = [];
                            $d0 = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=4 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($d0 as $v){
                                $ad_d0_id = array_search(sup_nid(Constant::D0,$v["nid"]),$ad_nid_data) ;
                                $d0_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "ad_d0_id" => $ad_d0_id,
                                    "username" => $v["name"],
                                    "usertype" => "d0"
                                ];
                                $d0_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["d0_id_data"] = $d0_id_data;

                            //股东
                            $co_id_data = [];
                            $co_nid_data = [];
                            $co = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=3 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($co as $v){
                                $d0_co_id = array_search(sup_nid(Constant::CO,$v["nid"]),$d0_nid_data) ;
                                $co_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "d0_co_id" => $d0_co_id,
                                    "username" => $v["name"],
                                    "usertype" => "corprator"
                                ];
                                $co_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["co_id_data"] = $co_id_data;

                            //总代理
                            $count = $this->dbc->getCount($table,"id","`level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'  {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $su_id_data =[];
                            $su = $this->dbc->select("SELECT * FROM {$table} WHERE `level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($su as $v){
                                $co_id = array_search(sup_nid(Constant::SU,$v["nid"]),$co_nid_data) ;
                                $su_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "co_id" => $co_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["pwd_safe"]) ? "aaaaaa" : $v["pwd_safe"],
                                    "username" => $v["name"],
                                    "usertype" => "super_agents",
                                ];
                            }
                            $arr["super_id_data"] = $su_id_data;
                            break;
                        case Constant::AG:
                            $table = Constant::T_RANK;
                            //分公司
                            $d0_id_data = [];
                            $d0_nid_data = [];
                            $d0 = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=4 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($d0 as $v){
                                $ad_d0_id = array_search(sup_nid(Constant::D0,$v["nid"]),$ad_nid_data) ;
                                $d0_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "ad_d0_id" => $ad_d0_id,
                                    "username" => $v["name"],
                                    "usertype" => "d0"
                                ];
                                $d0_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["d0_id_data"] = $d0_id_data;

                            //股东
                            $co_id_data = [];
                            $co_nid_data = [];
                            $co = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=3 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($co as $v){
                                $d0_co_id = array_search(sup_nid(Constant::CO,$v["nid"]),$d0_nid_data) ;
                                $co_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "d0_co_id" => $d0_co_id,
                                    "username" => $v["name"],
                                    "usertype" => "corprator"
                                ];
                                $co_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["co_id_data"] = $co_id_data;

                            //总代理
                            $su_id_data = [];
                            $su_nid_data = [];
                            $su = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($su as $v){
                                $co_super_id = array_search(sup_nid(Constant::SU,$v["nid"]),$co_nid_data) ;
                                $su_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "co_super_id" => $co_super_id,
                                    "username" => $v["name"],
                                    "usertype" => "super_agents"
                                ];
                                $su_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["super_id_data"] = $su_id_data;

                            //代理
                            $count = $this->dbc->getCount($table,"id","`level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'  {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $agents_id_data =[];
                            $agents = $this->dbc->select("SELECT * FROM {$table} WHERE `level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($agents as $v){
                                $super_id = array_search(sup_nid(Constant::AG,$v["nid"]),$su_nid_data) ;
                                $agents_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "super_id" => $super_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "pay_type" => $v["pay_type"],
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["loginname"]) ? "aaaaaa" : $v["loginname"],
                                    "username" => $v["name"],
                                    "usertype" => "agents",
                                ];
                            }
                            $arr["agents_id_data"] = $agents_id_data;
                            break;
                        case Constant::MEM:
                            $table = Constant::T_RANK;
                            //分公司
                            $d0_id_data = [];
                            $d0_nid_data = [];
                            $d0 = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=4 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($d0 as $v){
                                $ad_d0_id = array_search(sup_nid(Constant::D0,$v["nid"]),$ad_nid_data) ;
                                $d0_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "ad_d0_id" => $ad_d0_id,
                                    "username" => $v["name"],
                                    "usertype" => "d0"
                                ];
                                $d0_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["d0_id_data"] = $d0_id_data;

                            //股东
                            $co_id_data = [];
                            $co_nid_data = [];
                            $co = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=3 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($co as $v){
                                $d0_co_id = array_search(sup_nid(Constant::CO,$v["nid"]),$d0_nid_data) ;
                                $co_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "d0_co_id" => $d0_co_id,
                                    "username" => $v["name"],
                                    "usertype" => "corprator"
                                ];
                                $co_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["co_id_data"] = $co_id_data;

                            //总代理
                            $su_id_data = [];
                            $su_nid_data = [];
                            $su = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($su as $v){
                                $co_super_id = array_search(sup_nid(Constant::SU,$v["nid"]),$co_nid_data) ;
                                $su_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "co_super_id" => $co_super_id,
                                    "username" => $v["name"],
                                    "usertype" => "super_agents"
                                ];
                                $su_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["super_id_data"] = $su_id_data;

                            //代理
                            $agents_id_data = [];
                            $agents_nid_data = [];
                            $agents = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($agents as $v){
                                $super_agents_id = array_search(sup_nid(Constant::AG,$v["nid"]),$su_nid_data) ;
                                $agents_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "super_agents_id" => $super_agents_id,
                                    "username" => $v["name"],
                                    "usertype" => "agents"
                                ];
                                $agents_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["agents_id_data"] = $agents_id_data;

                            //会员
                            $table = Constant::T_MEMBER;
                            $count = $this->dbc->getCount($table,"id","`nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $members_id_data =[];
                            $members = $this->dbc->select("SELECT * FROM {$table} WHERE `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($members as $v){
                                $agents_id = array_search(sup_nid(Constant::MEM,$v["nid"]),$agents_nid_data) ;
                                $members_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "agents_id" => $agents_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "pay_type" => $v["pay_type"],
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["loginname"]) ? "aaaaaa" : $v["loginname"],
                                    "username" => $v["name"],
                                    "usertype" => "members",
                                ];
                            }
                            $arr["members_id_data"] = $members_id_data;
                            break;
                    }
                    break;
                case Constant::D0:
                    switch ($searchType){
                        case Constant::CO:
                            $table = Constant::T_RANK;
                            $count = $this->dbc->getCount($table,"id","`level`=3 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $co_id_data =[];
                            $co = $this->dbc->select("SELECT * FROM {$table} WHERE `level`=3 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($co as $v){
                                $co_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "d0_id" => $this->sup["id"],
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["pwd_safe"]) ? "aaaaaa" : $v["pwd_safe"],
                                    "username" => $v["name"],
                                    "usertype" => "corprator",
                                ];
                            }
                            $arr["co_id_data"] = $co_id_data;
                            break;
                        case Constant::SU:
                            $table = Constant::T_RANK;
                            //股东
                            $co_id_data = [];
                            $co_nid_data = [];
                            $co = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=3 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($co as $v){
                                $co_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "d0_co_id" => $this->sup["id"],
                                    "username" => $v["name"],
                                    "usertype" => "corprator"
                                ];
                                $co_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["co_id_data"] = $co_id_data;

                            //总代理
                            $count = $this->dbc->getCount($table,"id","`level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $su_id_data =[];
                            $su = $this->dbc->select("SELECT * FROM {$table} WHERE `level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($su as $v){
                                $co_id = array_search(sup_nid(Constant::SU,$v["nid"]),$co_nid_data) ;
                                $su_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "co_id" => $co_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["pwd_safe"]) ? "aaaaaa" : $v["pwd_safe"],
                                    "username" => $v["name"],
                                    "usertype" => "super_agents",
                                ];
                            }
                            $arr["super_id_data"] = $su_id_data;
                            break;
                        case Constant::AG:
                            $table = Constant::T_RANK;
                            //股东
                            $co_id_data = [];
                            $co_nid_data = [];
                            $co = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=3 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($co as $v){
                                $co_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "d0_co_id" => $this->sup["id"],
                                    "username" => $v["name"],
                                    "usertype" => "corprator"
                                ];
                                $co_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["co_id_data"] = $co_id_data;

                            //总代理
                            $su_id_data = [];
                            $su_nid_data = [];
                            $su = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($su as $v){
                                $co_super_id = array_search(sup_nid(Constant::SU,$v["nid"]),$co_nid_data) ;
                                $su_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "co_super_id" => $co_super_id,
                                    "username" => $v["name"],
                                    "usertype" => "super_agents"
                                ];
                                $su_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["super_id_data"] = $su_id_data;

                            //代理
                            $count = $this->dbc->getCount($table,"id","`level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $agents_id_data =[];
                            $agents = $this->dbc->select("SELECT * FROM {$table} WHERE `level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($agents as $v){
                                $super_id = array_search(sup_nid(Constant::AG,$v["nid"]),$su_nid_data) ;
                                $agents_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "super_id" => $super_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "pay_type" => $v["pay_type"],
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["loginname"]) ? "aaaaaa" : $v["loginname"],
                                    "username" => $v["name"],
                                    "usertype" => "agents",
                                ];
                            }
                            $arr["agents_id_data"] = $agents_id_data;
                            break;
                        case Constant::MEM:
                            $table = Constant::T_RANK;
                            //股东
                            $co_id_data = [];
                            $co_nid_data = [];
                            $co = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=3 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($co as $v){
                                $co_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "d0_co_id" => $this->sup["id"],
                                    "username" => $v["name"],
                                    "usertype" => "corprator"
                                ];
                                $co_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["co_id_data"] = $co_id_data;

                            //总代理
                            $su_id_data = [];
                            $su_nid_data = [];
                            $su = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($su as $v){
                                $co_super_id = array_search(sup_nid(Constant::SU,$v["nid"]),$co_nid_data) ;
                                $su_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "co_super_id" => $co_super_id,
                                    "username" => $v["name"],
                                    "usertype" => "super_agents"
                                ];
                                $su_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["super_id_data"] = $su_id_data;

                            //代理
                            $agents_id_data = [];
                            $agents_nid_data = [];
                            $agents = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($agents as $v){
                                $super_agents_id = array_search(sup_nid(Constant::AG,$v["nid"]),$su_nid_data) ;
                                $agents_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "super_agents_id" => $super_agents_id,
                                    "username" => $v["name"],
                                    "usertype" => "agents"
                                ];
                                $agents_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["agents_id_data"] = $agents_id_data;

                            //会员
                            $table = Constant::T_MEMBER;
                            $count = $this->dbc->getCount($table,"id","`nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $members_id_data =[];
                            $members = $this->dbc->select("SELECT * FROM {$table} WHERE `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($members as $v){
                                $agents_id = array_search(sup_nid(Constant::MEM,$v["nid"]),$agents_nid_data) ;
                                $members_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "agents_id" => $agents_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "pay_type" => $v["pay_type"],
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["loginname"]) ? "aaaaaa" : $v["loginname"],
                                    "username" => $v["name"],
                                    "usertype" => "members",
                                ];
                            }
                            $arr["members_id_data"] = $members_id_data;
                            break;
                    }
                    break;
                case Constant::CO:
                    switch ($searchType){
                        case Constant::SU:
                            $table = Constant::T_RANK;
                            //总代理
                            $count = $this->dbc->getCount($table,"id","`level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $su_id_data =[];
                            $su = $this->dbc->select("SELECT * FROM {$table} WHERE `level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($su as $v){
                                $su_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "co_id" => $this->sup["id"],
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["pwd_safe"]) ? "aaaaaa" : $v["pwd_safe"],
                                    "username" => $v["name"],
                                    "usertype" => "corprator",
                                ];
                            }
                            $arr["super_id_data"] = $su_id_data;
                            break;
                        case Constant::AG:
                            $table = Constant::T_RANK;
                            //总代理
                            $su_id_data = [];
                            $su_nid_data = [];
                            $su = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($su as $v){
                                $su_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "co_super_id" => $this->sup["id"],
                                    "username" => $v["name"],
                                    "usertype" => "super_agents"
                                ];
                                $su_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["super_id_data"] = $su_id_data;

                            //代理
                            $count = $this->dbc->getCount($table,"id","`level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $agents_id_data =[];
                            $agents = $this->dbc->select("SELECT * FROM {$table} WHERE `level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($agents as $v){
                                $super_id = array_search(sup_nid(Constant::AG,$v["nid"]),$su_nid_data) ;
                                $agents_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "super_id" => $super_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "pay_type" => $v["pay_type"],
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["loginname"]) ? "aaaaaa" : $v["loginname"],
                                    "username" => $v["name"],
                                    "usertype" => "agents",
                                ];
                            }
                            $arr["agents_id_data"] = $agents_id_data;
                            break;
                        case Constant::MEM:
                            $table = Constant::T_RANK;
                            //总代理
                            $su_id_data = [];
                            $su_nid_data = [];
                            $su = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=2 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($su as $v){
                                $su_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "co_super_id" => $this->sup["id"],
                                    "username" => $v["name"],
                                    "usertype" => "super"
                                ];
                                $su_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["super_id_data"] = $su_id_data;

                            //代理
                            $agents_id_data = [];
                            $agents_nid_data = [];
                            $agents = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($agents as $v){
                                $super_agents_id = array_search(sup_nid(Constant::AG,$v["nid"]),$su_nid_data) ;
                                $agents_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "super_agents_id" => $super_agents_id,
                                    "username" => $v["name"],
                                    "usertype" => "agents"
                                ];
                                $agents_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["agents_id_data"] = $agents_id_data;

                            //会员
                            $table = Constant::T_MEMBER;
                            $count = $this->dbc->getCount($table,"id","`nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $members_id_data =[];
                            $members = $this->dbc->select("SELECT * FROM {$table} WHERE `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($members as $v){
                                $agents_id = array_search(sup_nid(Constant::MEM,$v["nid"]),$agents_nid_data) ;
                                $members_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "agents_id" => $agents_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "pay_type" => $v["pay_type"],
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["loginname"]) ? "aaaaaa" : $v["loginname"],
                                    "username" => $v["name"],
                                    "usertype" => "members",
                                ];
                            }
                            $arr["members_id_data"] = $members_id_data;
                            break;
                    }
                    break;
                case Constant::SU:
                    switch ($searchType){
                        case Constant::AG:
                            $table = Constant::T_RANK;
                            //代理
                            $count = $this->dbc->getCount($table,"id","`level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $agents_id_data =[];
                            $agents = $this->dbc->select("SELECT * FROM {$table} WHERE `level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($agents as $v){
                                $agents_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "super_id" => $this->sup["id"],
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "pay_type" => $v["pay_type"],
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["loginname"]) ? "aaaaaa" : $v["loginname"],
                                    "username" => $v["name"],
                                    "usertype" => "members",
                                ];
                            }
                            $arr["agents_id_data"] = $agents_id_data;
                            break;
                        case Constant::MEM:
                            $table = Constant::T_RANK;
                            //代理
                            $agents_id_data = [];
                            $agents_nid_data = [];
                            $agents = $this->dbc->select("SELECT `id`,`nid`,`name` FROM {$table} WHERE `level`=1 AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%' {$order}");
                            foreach ($agents as $v){
                                $agents_id_data[$v["id"]] =  [
                                    "id" => $v["id"],
                                    "super_agents_id" => $this->sup["id"],
                                    "username" => $v["name"],
                                    "usertype" => "agents"
                                ];
                                $agents_nid_data[$v["id"]] = $v["nid"];
                            }
                            $arr["agents_id_data"] = $agents_id_data;

                            //会员
                            $table = Constant::T_MEMBER;
                            $count = $this->dbc->getCount($table,"id","`nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $members_id_data =[];
                            $members = $this->dbc->select("SELECT * FROM {$table} WHERE `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($members as $v){
                                $agents_id = array_search(sup_nid(Constant::MEM,$v["nid"]),$agents_nid_data) ;
                                $members_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "agents_id" => $agents_id,
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "pay_type" => $v["pay_type"],
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["loginname"]) ? "aaaaaa" : $v["loginname"],
                                    "username" => $v["name"],
                                    "usertype" => "members",
                                ];
                            }
                            $arr["members_id_data"] = $members_id_data;
                            break;
                    }
                    break;
                case Constant::AG:
                    switch ($searchType){
                        case Constant::MEM:
                            //会员
                            $table = Constant::T_MEMBER;
                            $count = $this->dbc->getCount($table,"id","`nid` LIKE '{$this->sup["nid"]}%' {$where}");
                            $page = pager($p,$count);
                            $arr["page"] = $page["page"];
                            $arr["totalpage"] = $page["totalpage"];
                            $limit = " LIMIT {$page["start"]},{$page["size"]}";

                            $members_id_data =[];
                            $members = $this->dbc->select("SELECT * FROM {$table} WHERE `nid` LIKE '{$this->sup["nid"]}%' {$where} {$order} {$limit}");
                            foreach ($members as $v){
                                $members_id_data[] =  [
                                    "adddate" => date("y-m-d H:i:s",$v["adddate"]),
                                    "agents_id" => $this->sup["id"],
                                    "alias" => $v["alias"],
                                    "enable" => status_num_str(2,$v["status"]) ,
                                    "enable_pri" => status_num_str(2,$this->getAccountStatus($v["nid"],false)),
                                    "pay_type" => $v["pay_type"],
                                    "id" => $v["id"],
                                    "passwd_safe" => empty($v["loginname"]) ? "aaaaaa" : $v["loginname"],
                                    "username" => $v["name"],
                                    "usertype" => "members",
                                ];
                            }
                            $arr["members_id_data"] = $members_id_data;
                            break;
                    }
                    break;
            }
        }


        return $arr;
    }

    /**
     * 修改公司 资料查询
     * @return array
     */
    public function get_ad_list(){
        $sup = $this->sup;
        $data = [];
        $table = $this->tables[Constant::AD]["t"];
        $ad = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$this->param["user_id"]} AND `nid` LIKE '{$sup["nid"]}%' limit 1","Row");
        if(!$ad){return $data;}
        $data["username"] = $ad["name"];
        $data["alias"]    = $ad["alias"];
        $data["enable"]   = status_num_str(2,$ad["status"]);
        $data["adddate"]  = date("Y-m-d H:i:s",$ad["adddate"]);
        $data["enddate"]  = empty($ad["enddate"]) ? 0 : date("Y-m-d",$ad["enddate"]);
        $data["logindate"]  = empty($ad["logindate"]) ? "暂无" : date("Y-m-d H:i:s",$ad["logindate"]);

        $nid = $sup["nid"];
        $where = "`nid` LIKE '{$nid}_%' AND `isMaster`=0";
        $between = date_between("tp");//本期日期
        $start = strtotime($between["start"]);
        $end = strtotime($between["end"]);
        $where .= " AND `adddate` BETWEEN '{$start}' AND '{$end}'";
        if(strlen($ad["nid"])==16){ //修改超管
            $data["layer"] = Constant::ADS;
            $data["amount_ad"] = $this->dbc->getCount($table,"`id`",$where);
        }else{
            $data["url"] = $ad["seturl"];
            $data["layer"] = Constant::AD;
            $table = Constant::T_CONFIG;
            $c = $this->dbc->select("SELECT * FROM {$table} WHERE `nid`='{$ad["nid"]}'","Row");
            if(!$c){
                $table = Constant::T_CONFIG_DEFAULT;
                $c = $this->dbc->select("SELECT * FROM {$table}","Row");
            }
            $data["conn"] = [
                "m_min"   =>  $c["m_min"],
                "r_min"   =>  $c["r_min"],
                "re_min"  =>  $c["re_min"],
                "dt_min"  =>  $c["dt_min"],
                "rdt_min" =>  $c["rdt_min"],
                "fs_min"  =>  $c["fs_min"],
                "m_max"   =>  $c["m_max"],
                "r_max"   =>  $c["r_max"],
                "re_max"  =>  $c["re_max"],
                "dt_max"  =>  $c["dt_max"],
                "rdt_max" =>  $c["rdt_max"],
                "fs_max"  =>  $c["fs_max"],
            ];
        }
        $data = array_merge($data,Dashboard::sum_amounts($data["layer"],"tp",$ad["nid"]));
        return $data;
    }

    public function get_d0_list(){
        return $this->getEditAccount(Constant::D0);
    }

    public function get_co_list(){
        return $this->getEditAccount(Constant::CO);
    }

    public function get_su_list(){
        return $this->getEditAccount(Constant::SU);
    }

    public function get_ag_list(){
        return $this->getEditAccount(Constant::AG);
    }

    public function get_mem_list(){
        return $this->getEditAccount(Constant::MEM);
    }

    public function getEditAccount($layer=Constant::AG){
        global $currencys;
        $upfiled = "`id`,`name`,`nid`,`credit`";
        switch($layer){
            case Constant::D0:
                $up_table = Constant::T_ADMIN;
                $table = Constant::T_RANK;
                $up_layer = Constant::AD;
                $upfiled = "`id`,`name`,`nid`";
                break;
            case Constant::CO:
                $up_layer = Constant::D0;
                $up_table = Constant::T_RANK;
                $table = Constant::T_RANK;
                break;
            case Constant::SU:
                $up_layer = Constant::CO;
                $up_table = Constant::T_RANK;
                $table = Constant::T_RANK;
                break;
            case Constant::AG:
                $up_layer = Constant::SU;
                $up_table = Constant::T_RANK;
                $table = Constant::T_RANK;
                break;
            case Constant::MEM:
                $up_table = Constant::T_RANK;
                $table = Constant::T_MEMBER;
                $up_layer = Constant::AG;
                $this->param["user_id"] = $this->param["mid"];
                break;
        }
        $nid = $this->sup["nid"];
        // print_r("SELECT `id`,`name`,`nid` FROM {$up_table} WHERE `id`={$this->param["up_id"]} AND `nid` LIKE '{$nid}%'");exit;
        $uprs = $this->dbc->select("SELECT {$upfiled} FROM {$up_table} WHERE `id`={$this->param["up_id"]} AND `nid` LIKE '{$nid}%'","Row");
        $rs = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$this->param["user_id"]}  AND `nid` LIKE '{$nid}%'","Row");
        if(!$uprs || !$rs){return [];}
        $avaliable_credit = 0;
        if($up_layer != Constant::AD && $up_layer != Constant::ADS){
            $avaliable_credit = $uprs["credit"] - $this->usedCredit($up_layer,$uprs["nid"]);
        }
        $status = $this->getAccountStatus($rs["nid"]);//上线账号状态
        $enable = status_num_str(2,$status);
        $enable = $enable == "E" ? $enable="S" : $enable;
        $arr = [
            "adddate" => date("Y-m-d H:i:s",$rs["adddate"]),
            "alias" => $rs["alias"],
			"pw" => $rs["pw"],
            "avaliable_credit" => $avaliable_credit,
            "enable" => $enable,
                "is_banned" => $rs['is_banned'] == 2 ? "Y" : "N",
            "id" => $rs["id"],
            "lastdate" => empty($rs["pwddate"]) ? "暂无" : date("Y-m-d",$rs["pwddate"]),
            "level" =>  "1_4",
            "locktype" => "",
            "logindate" => empty($rs["logindate"]) ? "暂无" : date("Y-m-d",$rs["logindate"]),
            "longerr" => "",
            "look_safe_paswrd" => "",
            "lower_count" => "1",
            "maxcredit" => $rs["credit"],
            "passwd_safe" => empty($rs["pwd_safe"]) ? "" : $rs["pwd_safe"],
            "enddate"  => empty($rs["enddate"]) ? 0 : date("Y-m-d",$rs["enddate"]),
            "pmo_enabled" => "E",
            "up_id" => $uprs["id"],
            "up_username" => $uprs["name"],
            "user_type" => "1",
            "username" => $rs["name"]
        ];
        if($layer == Constant::MEM){
            $curr = $currencys[$this->langx][$rs["currency"]];
            $arr["pay_type"] = $rs["pay_type"];
            $arr["currency"] = $curr["name"];
            $arr["currency_code"] = $curr["code"];
            $arr["currency_value"] = $curr["value"];
            $arr["ltype"]= (string)ltype_num($rs["ltype"]);
            $arr["maxcredit_RMB"] = $curr["value"] * $rs["credit"];
            $arr["passwd_safe"] = $rs["loginname"];
            $arr["hidden"] = empty($rs["hidden"]) ? "N" : "Y";
            $arr["odd_f"] = "H,M,I,E";
        }else{
            $arr["winloss"] = $rs["winloss"];
            if($layer == Constant::AG){
                $arr["pay_type"] = $rs["pay_type"];
                $arr["passwd_safe"] = $rs["loginname"];
            }

            if($layer == Constant::CO){
                $arr["special"] = "N";//是否打开特殊权限
                if(!empty($rs["special"])) {
                    $rankTable = Constant::T_RANK;
                    $nid = sup_nid(Constant::D0,$rs["nid"]);
                    $d0 = $this->dbc->select("SELECT `special` FROM {$rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                    $sp = json_decode($d0["special"],true);
                    global $special_co;
                    foreach ($special_co as $k){
                        if($sp[$k]=="Y" || $sp[$k]=="true"){
                            $arr["special"] = "Y";
                            break;
                        }
                    }
                }
            }
        }

        return array_merge($arr,Dashboard::sum_amounts($layer,"tp",$rs["nid"]));
    }

    /**
     * 下级账号状态查询
     * @return array
     */
    public function get_user_credit(){
        $data = [];
        $filed = "`nid`";
        if($this->param["layer_type"]!=Constant::AD && $this->param["layer_type"]!=Constant::ADS){
            $table = Constant::T_RANK;
            $filed .= ",`winloss`,`dfwinloss`,`credit`";
        }else{
            $table = Constant::T_ADMIN;
        }
        // print_r("SELECT {$filed} FROM {$table} WHERE `id`={$this->param["user_id"]} AND `nid` LIKE '{$this->sup["nid"]}%' limit 1");
        $rs = $this->dbc->select("SELECT {$filed} FROM {$table} WHERE `id`={$this->param["user_id"]} AND `nid` LIKE '{$this->sup["nid"]}%' limit 1","Row");
        if(!$rs){ return $data;}
        $layer_type = isset($this->param["layer_type"]) ? $this->param["layer_type"] : "all";
        $data = Dashboard::sum_enables($this->param["summary"],$layer_type,true,$rs["nid"]);
        
        $arr = [];
        $beetween = date_between("tw");
        $editday = date("Y-m-d",strtotime($beetween["end"]))."00:00:00";
        $dfday = date("Y-m-d",strtotime($beetween["start"]))." 17:00:00";//生效时间 每周一生效
        //可修改时间计算
        $date = date("Y-m-d H:i:s");
        $dfwinloss_sw = "N";
        //可修改时间：每星期日12:00至星期一 19:00 (香港时间)
        if($editday<=$date && $date<=date("Y-m-d",strtotime($beetween["end"]))." 23:59:59"){
            $dfday = date("Y-m-d",strtotime($beetween["start"])+24*60*60)." 17:00:00";
        }
        if($editday<=$date && $date<=$dfday){
            $dfwinloss_sw = "Y";
        }

        $arr = [];
        if($layer_type != "all" && $this->param["layer_type"]!=Constant::AD && $this->param["layer_type"]!=Constant::ADS){
            $arr["dfday"] = $dfday;
            $arr["systime"] = $date;
            $arr["dfwinloss_sw"] = $dfwinloss_sw;
            $arr["used_maxcredit"] = $this->usedCredit($this->param["layer_type"],$rs["nid"]);
            $arr["winloss"] = $rs["winloss"];
            $arr["winloss_a"] = 100-$rs["winloss"];
            $arr["winloss_s"] = "100";
            $arr["dfwinloss"] = $rs["dfwinloss"];

            if($this->param["layer_type"] != Constant::D0){
                $up_table = Constant::T_RANK;
                $uprs = $this->dbc->select("SELECT `winloss` FROM {$up_table} WHERE `id`={$this->param["up_id"]}","Row");
                $arr["up_winloss"] = $uprs["winloss"];
            }
        }
        return array_merge($arr,$data);
    }


    /**
     * 最大可用额度
     * @param $user
     * @return int|mixed
     */
    public function maxCredit($user){
        $credit = $user["credit"];
        if($user["pay_type"] == 0){//信用玩家
            $credit -= $this->usedCredit($this->login_layer,$user["nid"]);
        }
        return $credit;
    }
    /**
     * 检查权限
     * @return array
     */
    /**
     * 检查权限
     * @return array
     */
    public function prevData(){
        global $ls_msg;
        /*code: "errormsg|clean_db"
        msg: "系统优化中， 请耐心等待十五分钟。"
        status: "error"*/
        $ls = $ls_msg[$this->langx];
        if($this->userArr["status"]=="error"){
            $arr["status"] = "error";
            $arr["code"] = "402|clean_db";
            $arr["msg"] = $ls["0X002"];
            return $arr;
        }
        $user = $this->user;
        $sup = $this->sup;
        $txt = "";
        $nid = $sup["nid"];



        if(isset($this->param["txt"])){
            $txt = json_decode($this->param["txt"],true);
            $username = empty($txt["username"]) ? "" : $txt["username"];
            $id = empty($txt["id"]) ? "" : $txt["id"];
            $layer = empty($txt["layer"]) ? "" : $txt["layer"];

            // 添加查询 rank 表的数据
            if (!empty($this->param["uid"]) && !empty($id)) {
                $rankTable = Constant::T_RANK;
                $rankData = $this->dbc->select("SELECT * FROM {$rankTable} WHERE `id`={$id} ","Row");
                if ($rankData) {
                    $arr["rankData"] = $rankData;
                    if (isset($this->param["txt"])) {
                        $txt = json_decode($this->param["txt"], true);
                        $txt['is_banned'] = 'N';
                        $this->param["txt"] = json_encode($txt);
                    }
                }
            }

            if(!empty($txt["up_username"])){
                $username = $txt["up_username"];
            }
            if(!empty($txt["up_id"])){
                $id = $txt["up_id"];
            }

            $table = Constant::T_RANK;
            if(!empty($txt["up_layer"])){//有上级
                $layer = $txt["up_layer"];
            }

            if(!isset($txt["up_layer"]) && ($layer == Constant::ADS || $layer == Constant::AD)){
                $table = Constant::T_ADMIN;
            }

            if(isset($txt["up_layer"]) && $layer == Constant::AD){
                $table = Constant::T_ADMIN;
            }

            if(isset($txt["up_layer"]) && $layer == Constant::AG){
                $table = Constant::T_MEMBER;
            }

            if($layer == Constant::MEM){
                $table = Constant::T_MEMBER;
            }

            $nid = "";
            $rs = $this->dbc->select("SELECT * FROM {$table} WHERE `id`={$id} AND `name`='{$username}' AND `nid` LIKE '{$sup["nid"]}%'","Row");

            if($rs){
                $nid = $rs["nid"];
            }
			if(empty($rs["nid"])) {
				$rs = $this->dbc->select("SELECT * FROM {$table} WHERE `name`='{$username}' AND `nid` LIKE '{$sup["nid"]}%'","Row");
				if($rs){
					$nid = $rs["nid"];
				}
			}
            if(empty($nid)){
                $arr["status"] = "error";
                $arr["code"] = "402|clean_db";
                $arr["msg"] = $ls["4X008"]."000";
                return $arr;
            }else{
                $status = $this->getAccountStatus($nid,false);
				if ( !in_array($sup['level'], [0, 1])) {
					switch($status){
						case 2:
							$arr["status"] = "error";
							$arr["code"] = "402|clean_db";
							$arr["msg"] = $ls["4X013"];
							return $arr;
						case 3:
							$arr["status"] = "error";
							$arr["code"] = "402|clean_db";
							$arr["msg"] = $ls["4X016"];
							return $arr;
						case 4:
							$arr["status"] = "error";
							$arr["code"] = "402|clean_db";
							$arr["msg"] = $ls["4X014"];
							return $arr;
						case 5:
							$arr["status"] = "error";
							$arr["code"] = "402|clean_db";
							$arr["msg"] = $ls["4X046"];
							return $arr;
					}
				}
            }
        }

        switch ($this->param["keys"]){
            case "addAccount"://新增
                $layer = lv_nid($nid)["lv"];
                if(!empty($txt)){
                    if(isset($txt["back_page"]) && $txt["back_page"] == "acc_sub_list"){ //子账号修改
                        $arr = $txt;
                        $arr["status"] = "success";
                        $arr["code"] = "addAccount";
                    }else{
                        $arr = [
                            "status" => "success",
                            "code" => "addAccount",
                            "id" => $txt["id"],
                            "username" => $txt["username"],
                            "layer" => $layer
                        ];
                    }
                    if(isset($txt["pay_type"])){
                        $arr["pay_type"] = $txt["pay_type"];
                    }
                }else{
                    $arr = [
                        "status" => "success",
                        "code" => "addAccount",
                    ];
                }
                break;
            case "editAccount":
                $arr = [
                    "code" => "editAccount",
                    "enable" => $txt["enable"],
                    "is_banned" => isset($txt["is_banned"]) ? $txt["is_banned"] : "",
                    "id" => isset($txt["user_id"]) ? $txt["user_id"] : $txt["id"],
                    "user_id" => isset($txt["user_id"]) ? $txt["user_id"] : $txt["id"],
                    "pay_type" => empty($txt["pay_type"]) ? 0 : $txt["pay_type"],
                    "status" => "success",
                    "user_type" => $txt["user_type"],
                    "username" => $txt["username"],
                ];
                if(isset($txt["up_id"])){
                    $arr["up_id"] = $txt["up_id"];
                    $arr["up_username"] = $txt["up_username"];
                }
                break;
            case "delAccount":
                $arr = [];
                if($this->login_layer == Constant::AD || $this->login_layer==Constant::ADS){
                    $this->dbc->beginTransaction();
                    try{
                        $rs = $this->dbc->select("SELECT * FROM {$table} WHERE id={$txt["id"]} AND `nid` LIKE '{$sup["nid"]}%'","Row");
                        $this->dbc->delete($table,"id={$txt["id"]} AND `nid` LIKE '{$sup["nid"]}%'");
                        switch ($table){
                            case Constant::T_ADMIN:
                                $this->dbc->delete(Constant::T_ADMIN,"`nid` LIKE '{$rs["nid"]}%'");
                                $this->dbc->delete(Constant::T_ADMIN_LOGIN_LOG,"`nid` LIKE '{$rs["nid"]}%'");
                                $this->dbc->delete(Constant::T_ADMIN_RECORD,"`nid` LIKE '{$rs["nid"]}%'");
                                $this->dbc->delete(Constant::T_CONFIG,"`nid` LIKE '{$rs["nid"]}%'");
                            case Constant::T_RANK:
                                $this->dbc->delete(Constant::T_RANK,"`nid` LIKE '{$rs["nid"]}%'");
                                $this->dbc->delete(Constant::T_RANK_LOGIN_LOG,"`nid` LIKE '{$rs["nid"]}%'");
                                $this->dbc->delete(Constant::T_RANK_RECORD,"`nid` LIKE '{$rs["nid"]}%'");
                                break;
                        }
                        $this->dbc->delete(Constant::T_MEMBER,"`nid` LIKE '{$rs["nid"]}%'");
                        $this->dbc->delete(Constant::T_MEMBER_LOGIN_LOG,"`nid` LIKE '{$rs["nid"]}%'");
                        $this->dbc->delete(Constant::T_MEMBER_RECORD,"`nid` LIKE '{$rs["nid"]}%'");
                        $this->dbc->commit();
                        $arr = [
                            "status" => "success",
                            "code" => "delAccount",
                            "msg" => $ls["0XDELE"]
                        ];
                    }catch (\Exception $e){
                        $this->dbc->rollback();
                        $arr["status"] = "error";
                        $arr["code"] = "402|clean_db";
                        $arr["msg"] = $e->getMessage();
                    }
                }else{
                    $arr["status"] = "error";
                    $arr["code"] = "402|clean_db";
                    $arr["msg"] = $ls["0X001"];
                }
                break;
            case "out"://提线
                if(empty($this->param["id"])){
                    $arr["status"] = "error";
                    $arr["code"] = "402";
                    $arr["msg"] = $ls["0X003"];
                    return $arr;
                }

                $table = Constant::T_RANK;
                switch ($this->param["layer"]){
                    case Constant::ADS:
                    case Constant::AD:
                        $table = Constant::T_ADMIN;
                        break;
                    case Constant::MEM:
                        $table = Constant::T_MEMBER;
                        break;
                }
                $count = $this->dbc->getCount($table,"id","`id`={$this->param["id"]} AND `nid` LIKE '{$this->sup["nid"]}%'");
                if($count == 0){
                    $arr["status"] = "error";
                    $arr["code"] = "402";
                    $arr["msg"] = $ls["5X001"];
                    return $arr;
                }
                try{
                    $this->dbc->update($table,["isout"=>0,"uid"=>"sadf"],"`id`={$this->param["id"]} AND `nid` LIKE '{$this->sup["nid"]}%'");
                    return ["status" => "success"];
                }catch (\Exception $e){
                    $arr["status"] = "error";
                    $arr["code"] = "402";
                    $arr["msg"] = $e->getMessage();
                    return $arr;
                }
                break;
        }

        return $arr;

    }


    /**
     * 上级参数配置
     * @return array|string[]
     */
    public function upperConf(){
        global $currencys,$game_default_config,$special_co;
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014"
            ];
            return $para;
        }
        $user = $this->user;//子账号
        $sup = $this->sup;//主账号
        $arr = [];
        switch ($this->param["up_layer"]){
            case Constant::ADS:
                $ctable = Constant::T_CONFIG_DEFAULT;
                $conn = $this->dbc->select("SELECT * FROM {$ctable} WHERE `id`>0  LIMIT 1","Row");
                if($this->login_layer == Constant::AD){
                    $ctable = Constant::T_CONFIG;
                    $conn_a = $this->dbc->select("SELECT * FROM {$ctable} WHERE `nid`='{$this->sup["nid"]}'","Row");
                    if($conn_a){
                        $conn = $conn_a;
                    }
                }
                $arr["conn"] = [
                    "m_min" => $conn["m_min"],
                    "r_min" => $conn["r_min"],
                    "re_min" => $conn["re_min"],
                    "dt_min" => $conn["dt_min"],
                    "rdt_min" => $conn["rdt_min"],
                    "fs_min"=> $conn["fs_min"],
                    "m_max" => $conn["m_max"],
                    "r_max" => $conn["r_max"],
                    "re_max" => $conn["re_max"],
                    "dt_max" => $conn["dt_max"],
                    "rdt_max" => $conn["rdt_max"],
                    "fs_max"=> $conn["fs_max"],
                    "webstr"=>$conn["webstr"],
                    "webend"=>$conn["webend"],
					"isgoogle"=>$conn["isgoogle"],
					"google_code"=>$conn["google_code"],
                    "website"=>$conn["website"]
                ];

                break;
            case Constant::AD:
                $arr["currency"] = $currencys[$this->langx];
                $arr["user"] = [
                    "cotype" => null,
                    "id" => $this->param["up_id"]
                ];
                $arr["game"] = $game_default_config;
                break;
            case Constant::MEM:
                /*$arr["currency"] = $currencys[$this->langx];
                $arr["user"] = [
                    "cash_sw" => $sup["cash_sw"] == 1 ? "Y" : "N",//现金开关
                    "cotype" => null,
                    "id" => $sup["id"],
                    "surplus_maxcredit" => $this->maxCredit($sup),//剩余可用额度
                ];
                $arr["game"] = json_decode($sup["config"],true);//游戏参数*/
                break;
            default:
                $table = Constant::T_RANK;
                $rs = $this->dbc->select("SELECT `nid`,`special`,`credit`,`config`,`winloss` FROM {$table} WHERE `id`={$this->param["up_id"]} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
                LOG::write("creadit11", "SELECT `nid`,`special`,`credit`,`config`,`winloss` FROM {$table} WHERE `id`={$this->param["up_id"]} AND `nid` LIKE '{$this->sup["nid"]}%'");
                LOG::write("creadit11", $rs);
                $arr["currency"] = $currencys[$this->langx];
                $arr["user"] = [
                    "cotype" => null,
                    "id" => $this->param["up_id"],
                    "winloss" => $rs["winloss"],
                    "winloss_c" => empty($rs["winloss"])?100:$rs["winloss"],
                    "dfwinloss_c" => empty($rs["dfwinloss"])?"":$rs["dfwinloss"],
                    "surplus_maxcredit" => $rs["credit"] - $this->usedCredit($this->param["up_layer"],$rs["nid"]),//剩余额度
                ];

                if($this->param["up_layer"] == Constant::SU){
                    $arr["user"]["cash_sw"] = "Y";
                    //查询股东最大占成
                    $co_nid = substr($rs["nid"],0,16*4);
                }

                if($this->param["up_layer"] == Constant::D0){
                    $arr["special"] = [];
                    $specials = json_decode($rs["special"],true);

                    foreach ($special_co as $v){
                        if($specials[$v] === "true" || $specials[$v] == "Y"){
                            $arr["special"][$v] = $specials[$v];
                        }
                    }
                }

                $arr["game"] = json_decode($rs["config"],true);
                break;
        }

		require_once 'GoogleAuthenticator.php';
		$ga = new PHPGangsta_GoogleAuthenticator();
		$secret = $ga->createSecret();
		$qrCodeUrl = $ga->getQRCodeGoogleUrl('谷歌安全验证', $secret);
        $arr['google_qrcode'] = $qrCodeUrl;
		$arr['google_code'] = $secret;
		
        return $arr;
    }



    /**
     * 检测账号是否占用
     * @return array|string[]
     */
    public function chk_username(){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        if($this->userArr["status"]=="error"){
            $para = [
                "status" => "error",
                "code" => "4X014",
            ];
            return $para;
        }

        if(empty($this->param["view_layer"])){
            $para = [
                "status" => "error",
                "code" => "user",
                "msg" => $ls["0X003"]
            ];
            return $para;
        }

        if(empty($this->param["username"])){
            $para = [
                "status" => "error",
                "code" => "user",
                "msg" => $ls["0X006"]
            ];
            return $para;
        }

        if(!regexUser($this->param["username"])){
            $para = [
                "status" => "error",
                "code" => "user",
                "msg" => $ls["0X011"]
            ];
            return $para;
        }

        $table = $this->tables[$this->param["view_layer"]]["t"];
        $cou = $this->dbc->getCount($table,"`id`","`name`='{$this->param["username"]}'");
        if($cou>0){
            $para = [
                "status" => "error",
                "code" => "user",
                "msg" => $ls["0X004"]
            ];
            return $para;
        }

        $para = [
            "status" => "no_use",
            "code" => "user",
            "msg" => $ls["0X005"]
        ];
        return $para;
    }

    /**
     * 查询排序
     * @return string
     */
    private function orderBy(){
        $order = "";
        if(!empty($this->param["sort_name"])){
            switch ($this->param["sort_name"]){
                case "alias":
                    $order = "`alias`";
                    break;
                case "maxcredit":
                    $order = "`credit`";
                    break;
                case "currency":
                    $order = "`currency`";
                    break;
                case "adddate":
                    $order = "`adddate`";
                    break;
                default:
                    $order = "`name`";
                    break;
            }
            $asc = " ASC";
            if(!empty($this->param["sort_type"]) && $this->param["sort_type"]=="desc"){
                $asc = " DESC";
            }

            $order = " ORDER BY ".$order.$asc;
        }

        return $order;
    }

    /**
     * 修改下级密码
     * @return mixed
     */
    public function chg_psw(){
        $arr["code"] = "504";
        if($this->userArr["status"]=="error"){
            $arr["status"] = "error";
            $arr["status_code"] = "4X014";
            return $arr;
        }
        $sup = $this->sup;
        if(empty($this->param["edit_layer"]) || empty($this->param["edit_psw"]) || empty($this->param["edit_id"])){
            $arr["status"] = "error";
            $arr["status_code"] = "0X001";
            return $arr;
        }

        $table = $this->tables[$this->param["edit_layer"]]["t"];
        $sql = "SELECT * FROM {$table} WHERE `id`={$this->param["edit_id"]} AND `nid` LIKE '{$sup["nid"]}%' LIMIT 1";
        $user = $this->dbc->select($sql,"Row");
        if(!$user){
            $arr["status"] = "error";
            $arr["status_code"] = "4X008";
            return $arr;
        }

        $pwd = md5Pwd($this->param["edit_psw"]);
        if($user["passwd"] == $pwd){
            $arr["status"] = "error";
            $arr["status_code"] = "4X019";
            return $arr;
        }

        if($user["name"] == $this->param["edit_psw"]){
            $arr["status"] = "error";
            $arr["status_code"] = "4X022";
            return $arr;
        }

        $aa = [Constant::CO,Constant::SU];//检验安全码
        $bb = [Constant::AG,Constant::MEM];//验证登陆账号
        if(in_array($this->login_layer,$aa)){
            if($user["pwd_safe"] == $this->param["edit_psw"]){
                $arr["status"] = "error";
                $arr["status_code"] = "4X023";
                return $arr;
            }
        }

        if(in_array($this->login_layer,$bb)){
            if($user["loginname"] == $this->param["edit_psw"]){
                $arr["status"] = "error";
                $arr["status_code"] = "4X022";
                return $arr;
            }
        }

        try{
            $update = [
                "passwd" => $pwd,
                "pw" => $this->param["edit_psw"],
                "pwddate" => time()
            ];
            $this->dbc->update($table,$update,"`id`={$user["id"]}");

            $name = $this->tables[$this->param["edit_layer"]]["name"];
            $this->insertLog("修改{$name}[{$user["name"]}]密码成功！");
            $arr["status"] = "success";
            $arr["status_code"] = "none";
        }catch (\Exception $e){
            $arr["status"] = "error";
            $arr["status_code"] = $e->getMessage();
        }

        return $arr;
    }

    public function chg_subuser_pwd(){
        $arr["code"] = "504";
        if($this->userArr["status"]=="error"){
            $arr["status"] = "error";
            $arr["status_code"] = "4X014";
            return $arr;
        }
        $sup = $this->sup;
        if(empty($this->param["passwords"]) || empty($this->param["id"])){
            $arr["status"] = "error";
            $arr["status_code"] = "0X001";
            return $arr;
        }

        $table = $this->tables[$this->param["login_layer"]]["t"];
        $sql = "SELECT * FROM {$table} WHERE `id`={$this->param["id"]} AND `nid` LIKE '{$sup["nid"]}%' LIMIT 1";
        $user = $this->dbc->select($sql,"Row");
        if(!$user){
            $arr["status"] = "error";
            $arr["status_code"] = "4X008";
            return $arr;
        }

        $pwd = md5Pwd($this->param["passwords"]);
        if($user["passwd"] == $pwd){
            $arr["status"] = "error";
            $arr["status_code"] = "4X019";
            return $arr;
        }

        if($user["name"] == $this->param["passwords"]){
            $arr["status"] = "error";
            $arr["status_code"] = "4X022";
            return $arr;
        }

        $aa = [Constant::CO,Constant::SU];//检验安全码
        $bb = [Constant::AG,Constant::MEM];//验证登陆账号
        if(in_array($this->login_layer,$aa)){
            if($user["pwd_safe"] == $this->param["passwords"]){
                $arr["status"] = "error";
                $arr["status_code"] = "4X023";
                return $arr;
            }
        }

        if(in_array($this->login_layer,$bb)){
            if($user["loginname"] == $this->param["passwords"]){
                $arr["status"] = "error";
                $arr["status_code"] = "4X022";
                return $arr;
            }
        }

        try{
            $update = [
                "passwd" => $pwd,
                "pw" => $this->param["passwords"],
                "pwddate" => time()
            ];
            $this->dbc->update($table,$update,"`id`={$user["id"]}");

            if(isset($this->param["edit_layer"])){
                $ly = $this->param["edit_layer"];
            }else{
                $ly = $this->param["login_layer"];
            }
            $name = $this->tables[$ly]["name"];
            $this->insertLog("修改{$name}[{$user["name"]}]密码成功！");
            $arr["status"] = "success";
            $arr["status_code"] = "none";
        }catch (\Exception $e){
            $arr["status"] = "error";
            $arr["status_code"] = $e->getMessage();
        }

        return $arr;
    }

    public function chg_psw_ag(){
        $ary = ["code"=>"412","status"=>"error"];
        if(!isset($this->param["old_pwd"]) || !isset($this->param["new_pwd"])){
            $ary["status_code"] = "0X001";
            return $ary;
        }

        if(empty($this->param["old_pwd"]) || $this->param["old_pwd"] != $this->user["pw"]){
            $ary["status_code"] = "4X018";
            return $ary;
        }

        $pwd = $this->param["new_pwd"];
        $str = str_chk($pwd,2);
        if(strtoupper($str) != "CHK_OK"){
            $ary["status_code"] = "4X021";
            return $ary;
        }

        if($pwd == $this->user["pw"]){
            $ary["status_code"] = "4X019";
            return $ary;
        }


        if($this->login_layer==Constant::CO || $this->login_layer==Constant::SU){
            if($pwd == $this->user["pwd_safe"] || $pwd == $this->user["name"]){
                $ary["status_code"] = "4X023";
                return $ary;
            }
        }else if($this->login_layer == Constant::AG){
            if($pwd == $this->user["loginname"] || $pwd == $this->user["name"]){
                $ary["status_code"] = "4X022";
                return $ary;
            }
        }else{
            if($pwd == $this->user["name"]){
                $ary["status_code"] = "4X024";
                return $ary;
            }
        }



        try{
            $this->dbc->update(Constant::T_RANK,["pw" => $pwd,"passwd" =>md5Pwd($pwd),"pwddate"=>time()],"`id`={$this->user["id"]}");
            $ary["status"] = "success";
            $ary["status_code"] = "none";
            return $ary;
        }catch (\Exception $e){
            $ary["msg"] = $e->getMessage();
            return $ary;
        }
    }

    /**
     * 检测登陆账号是否存在
     */
    public function tmp_loginID_chk(){
        if(!isset($this->param["pwd_safe"]) && empty($this->param["pwd_safe"])){
            return "NO";
        }

        $_p = $this->param;
        $safe = $_p["pwd_safe"];
        $str = str_chk($safe,2);
        if(strtoupper($str) != "CHK_OK"){
            return "NO";
        }

        if($safe == $this->user["name"] || $safe == $this->user["pw"]){
            return "SAME";
        }

        $rCount = $this->dbc->getCount(Constant::T_RANK,"`id`","`name`='{$safe}' OR `loginname`='{$safe}'");
        $mCount = $this->dbc->getCount(Constant::T_MEMBER,"`id`","`name`='{$safe}' OR `loginname`='{$safe}'");
        if($rCount>0 || $mCount>0){
            return "NO";
        }
        return "OK";
    }

    /**
     * 添加安全码/登陆账号
     * @return array|string[]
     */
    public function chg_psw_safe(){
        if(!isset($this->param["pwd_safe"]) && empty($this->param["pwd_safe"])){
            return ["code"=>"410","status"=>"error","status_code"=>"4X011"];
        }

        $_p = $this->param;
        $safe = $_p["pwd_safe"];
        if($safe == $this->user["pw"] || $safe == $this->user["name"]){
            return ["code"=>"410","status"=>"error","status_code"=>"4X015"];
        }

        try{
            if($this->login_layer==Constant::AG){ //设置登陆账号
                $str = str_chk($safe,2);
                if(strtoupper($str) != "CHK_OK"){
                    return ["code"=>"410","status"=>"error1","status_code"=>"4X011_ag"];
                }
                $rCount = $this->dbc->getCount(Constant::T_RANK,"`id`","`name`='{$safe}' OR `loginname`='{$safe}'");
                $mCount = $this->dbc->getCount(Constant::T_MEMBER,"`id`","`name`='{$safe}' OR `loginname`='{$safe}'");
                if($rCount>0 || $mCount>0){
                    return ["code"=>"410","status"=>"error1","status_code"=>"4X016"];
                }
                $this->dbc->update(Constant::T_RANK,["loginname" => $safe],"`id`={$this->user["id"]}");
                return ["code"=>"410","status"=>"success","status_code"=>"4O003"];
            }else{
                $str = str_chk($safe,2);
                if(strtoupper($str) != "CHK_OK"){
                    return ["code"=>"410","status"=>"error1","status_code"=>"4X011"];
                }

                if(!empty($this->user["pwd_safe"])){
                    return ["code"=>"410","status"=>"error","status_code"=>"4X017"];
                }

                $this->dbc->update(Constant::T_RANK,["pwd_safe" => $safe],"`id`={$this->user["id"]}");
                return ["code"=>"410","status"=>"success","status_code"=>"4O004"];
            }


        }catch (\Exception $e){
            return ["code"=>"410","status"=>"error","msg"=>$e->getMessage()];
        }
    }
	

    public function acc_sub_all_list(){
        $p = $this->param;

        if($this->login_layer != Constant::AD && $this->login_layer != Constant::ADS){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "no permission"
            ];
        }

        $table = Constant::T_RANK;
        $keyword = isset($p["user_name"]) ? trim($p["user_name"]) : "";
        $layer = isset($p["layer"]) ? trim($p["layer"]) : "co";
        $page = isset($p["page"]) ? intval($p["page"]) : 1;
        $page_size = isset($p["page_size"]) ? intval($p["page_size"]) : 10;

        if($page < 1){
            $page = 1;
        }
        if($page_size < 1){
            $page_size = 10;
        }
        if($page_size > 50){
            $page_size = 50;
        }

        $layer_map = [
            "co" => 3,
            "su" => 2,
            "ag" => 1
        ];
        if(!isset($layer_map[$layer])){
            $layer = "co";
        }
        $level = $layer_map[$layer];

        $where = " `a`.`isMaster`=0
                   AND `a`.`nid` LIKE '{$this->sup["nid"]}%'
                   AND `a`.`level`={$level}";

        if($keyword !== ""){
            $kw = addslashes($keyword);
            $where .= " AND (
                `a`.`name` LIKE '%{$kw}%'
                OR `a`.`alias` LIKE '%{$kw}%'
                OR `a`.`loginname` LIKE '%{$kw}%'
                OR EXISTS (
                    SELECT 1
                    FROM {$table} AS `s`
                    WHERE `s`.`nid`=`a`.`nid`
                    AND `s`.`isMaster`=1
                    AND (
                        `s`.`name` LIKE '%{$kw}%'
                        OR `s`.`alias` LIKE '%{$kw}%'
                        OR `s`.`loginname` LIKE '%{$kw}%'
                    )
                )
            )";
        }

        $count_sql = "SELECT COUNT(*) AS `total`
                      FROM {$table} AS `a`
                      WHERE {$where}";
        $count_rs = $this->dbc->select($count_sql, "Row");
        $total = $count_rs ? intval($count_rs["total"]) : 0;

        $page_total = $total > 0 ? ceil($total / $page_size) : 0;
        if($page_total > 0 && $page > $page_total){
            $page = $page_total;
        }
        if($page_total == 0){
            $page = 1;
        }

        $offset = ($page - 1) * $page_size;
        if($offset < 0){
            $offset = 0;
        }

        $parent_sql = "SELECT `a`.`id`,`a`.`nid`,`a`.`name`,`a`.`alias`,`a`.`loginname`,`a`.`pw`,`a`.`level`,`a`.`is_banned`,`a`.`adddate`
               FROM {$table} AS `a`
               WHERE {$where}
               ORDER BY `a`.`name` ASC, `a`.`adddate` DESC
               LIMIT {$offset},{$page_size}";
        $parents = $this->dbc->select($parent_sql, "All");

        $sub_map = [];
        if($parents){
            $nid_arr = [];
            foreach($parents as $v){
                $nid_arr[] = "'" . addslashes($v["nid"]) . "'";
            }

            if(!empty($nid_arr)){
                $sub_sql = "SELECT `id`,`nid`,`name`,`alias`,`loginname`,`pw`,`is_banned`,`adddate`
                            FROM {$table}
                            WHERE `isMaster`=1
                            AND `nid` IN (" . implode(",", $nid_arr) . ")
                            ORDER BY `nid` ASC, `name` ASC, `adddate` DESC";

                $subs = $this->dbc->select($sub_sql, "All");

                if($subs){
                    foreach($subs as $v){
                        if(!isset($sub_map[$v["nid"]])){
                            $sub_map[$v["nid"]] = [];
                        }

                        $sub_map[$v["nid"]][] = [
                            "id" => $v["id"],
                            "name" => $v["name"],
                            "alias" => $v["alias"],
                            "loginname" => empty($v["loginname"]) ? "-" : $v["loginname"],
                            "pw" => empty($v["pw"]) ? "-" : $v["pw"],
                            "adddate" => date("Y-m-d H:i:s", $v["adddate"]),
                            "is_banned" => $v["is_banned"] == 2 ? "Y" : "N",
                            "_raw_name" => $v["name"],
                            "_raw_alias" => $v["alias"],
                            "_raw_loginname" => $v["loginname"]
                        ];
                    }
                }
            }
        }

        $list = [];
        if($parents){
            foreach($parents as $v){
                $subs_all = isset($sub_map[$v["nid"]]) ? $sub_map[$v["nid"]] : [];
                $subs_show = [];
                $parent_hit = false;

                if($keyword !== ""){
                    $parent_hit = stripos($v["name"] . " " . $v["alias"] . " " . $v["loginname"], $keyword) !== false;
                }

                if($keyword !== "" && !$parent_hit){
                    foreach($subs_all as $sv){
                        $sstr = $sv["_raw_name"] . " " . $sv["_raw_alias"] . " " . $sv["_raw_loginname"];
                        if(stripos($sstr, $keyword) !== false){
                            unset($sv["_raw_name"], $sv["_raw_alias"], $sv["_raw_loginname"]);
                            $subs_show[] = $sv;
                        }
                    }
                }else{
                    foreach($subs_all as $sv){
                        unset($sv["_raw_name"], $sv["_raw_alias"], $sv["_raw_loginname"]);
                        $subs_show[] = $sv;
                    }
                }

                $list[] = [
                    "parent_id" => $v["id"],
                    "parent_nid" => $v["nid"],
                    "parent_name" => $v["name"],
                    "parent_alias" => $v["alias"],
                    "parent_loginname" => empty($v["loginname"]) ? "-" : $v["loginname"],
                    "parent_pw" => empty($v["pw"]) ? "-" : $v["pw"],
                    "parent_is_banned" => $v["is_banned"] == 2 ? "Y" : "N",
                    "sub_count" => count($subs_all),
                    "subs" => $subs_show
                ];
            }
        }

        return [
            "layer" => $layer,
            "page" => $page,
            "page_size" => $page_size,
            "total" => $total,
            "page_total" => $page_total,
            "list" => $list
        ];
    }

    public function chg_sub_banned_single(){
        $p = $this->param;

        if($this->login_layer != Constant::AD && $this->login_layer != Constant::ADS){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "no permission"
            ];
        }

        if(!isset($p["id"]) || $p["id"]*1 <= 0){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "id error"
            ];
        }

        if(!isset($p["is_banned"]) || ($p["is_banned"] != "Y" && $p["is_banned"] != "N")){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "is_banned error"
            ];
        }

        $table = Constant::T_RANK;
        $id = $p["id"] * 1;
        $is_banned = $p["is_banned"] == "Y" ? 2 : 1;

        $rs = $this->dbc->select("SELECT `id`,`nid`,`name`
                                  FROM {$table}
                                  WHERE `id`={$id}
                                  AND `isMaster`=1
                                  AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
        if(!$rs){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "sub account not found"
            ];
        }

        try{
            $this->dbc->update($table, ["is_banned"=>$is_banned], "`id`={$id}");
            $txt = $p["is_banned"] == "Y" ? "禁用代理子账号" : "启用代理子账号";
            $this->insertLog($txt."[账号:{$rs["name"]}]");
            return [
                "status" => "success",
                "code" => "chgSubBannedSingleSuccess",
                "msg" => "success"
            ];
        }catch (\Exception $e){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => $e->getMessage()
            ];
        }
    }

    public function chg_sub_banned_batch(){
        $p = $this->param;

        if($this->login_layer != Constant::AD && $this->login_layer != Constant::ADS){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "no permission"
            ];
        }

        if(empty($p["parent_nid"])){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "parent_nid empty"
            ];
        }

        if(!isset($p["is_banned"]) || ($p["is_banned"] != "Y" && $p["is_banned"] != "N")){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "is_banned error"
            ];
        }

        $table = Constant::T_RANK;
        $parent_nid = addslashes($p["parent_nid"]);
        $is_banned = $p["is_banned"] == "Y" ? 2 : 1;

        $parent = $this->dbc->select("SELECT `id`,`nid`,`name`
                                      FROM {$table}
                                      WHERE `nid`='{$parent_nid}'
                                      AND `isMaster`=0
                                      AND `level` IN (3,2,1)
                                      AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
        if(!$parent){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "parent not found"
            ];
        }

        $this->dbc->beginTransaction();
        try{
            $sql = "UPDATE {$table}
                    SET `is_banned`={$is_banned}
                    WHERE `nid`='{$parent_nid}'
                    AND `isMaster`=1
                    AND `nid` LIKE '{$this->sup["nid"]}%'";
            $this->dbc->execSql($sql);
        
            $txt = $p["is_banned"] == "Y" ? "批量禁用代理子账号" : "批量启用代理子账号";
            $this->insertLog($txt."[代理:{$parent["name"]}]");

            $this->dbc->commit();
            return [
                "status" => "success",
                "code" => "chgSubBannedBatchSuccess",
                "msg" => "success"
            ];
        }catch (\Exception $e){
            $this->dbc->rollback();
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => $e->getMessage()
            ];
        }
    }

    public function chg_acc_banned_cascade(){
        $p = $this->param;

        if($this->login_layer != Constant::AD && $this->login_layer != Constant::ADS){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "no permission"
            ];
        }

        if(!isset($p["parent_id"]) || $p["parent_id"]*1 <= 0){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "parent_id error"
            ];
        }

        if(!isset($p["is_banned"]) || ($p["is_banned"] != "Y" && $p["is_banned"] != "N")){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "is_banned error"
            ];
        }

        $table = Constant::T_RANK;
        $parent_id = $p["parent_id"] * 1;
        $is_banned = $p["is_banned"] == "Y" ? 2 : 1;

        $parent = $this->dbc->select("SELECT `id`,`nid`,`name`
                                      FROM {$table}
                                      WHERE `id`={$parent_id}
                                      AND `isMaster`=0
                                      AND `level` IN (3,2,1)
                                      AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
        if(!$parent){
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => "parent not found"
            ];
        }

        $this->dbc->beginTransaction();
        try{
            $this->dbc->update($table, ["is_banned"=>$is_banned], "`id`={$parent_id}");
        
            $sql = "UPDATE {$table}
                    SET `is_banned`={$is_banned}
                    WHERE `nid`='{$parent["nid"]}'
                    AND `isMaster`=1
                    AND `nid` LIKE '{$this->sup["nid"]}%'";
            $this->dbc->execSql($sql);
        
            $txt = $p["is_banned"] == "Y" ? "禁用代理并级联子账号" : "启用代理并级联子账号";
            $this->insertLog($txt."[代理:{$parent["name"]}]");

            $this->dbc->commit();
            return [
                "status" => "success",
                "code" => "chgAccBannedCascadeSuccess",
                "msg" => "success"
            ];
        }catch (\Exception $e){
            $this->dbc->rollback();
            return [
                "status" => "error",
                "code" => "Err_status",
                "msg" => $e->getMessage()
            ];
        }
    }
}
