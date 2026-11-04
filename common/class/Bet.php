<?php


class Bet extends Base
{
    protected $ls_code;

    protected $ls_account;

    protected $ls;

    protected $table;

    protected $conn;

    protected $bet_table;
    
    protected $bet_p3_table;
    
    public function __construct($_p = [])
    {
        parent::__construct($_p);
        global $ls_ary, $ls_account_ary, $ls_code_ary;
        $this->ls = $ls_ary;
        $this->ls_account = $ls_account_ary;
        $this->ls_code = $ls_code_ary;
        $this->bet_table = Constant::T_BET;
        $this->bet_p3_table = Constant::T_BET_P3;
    }

    /**
     * 账户历史-列表
     * @return string
     */
    public function get_history_view(){
		set_time_limit(300);
		ini_set('memory_limit', '4G');
		
        global $weekAry;
        $gtype = "ALL";
        $where = "`nid`='{$this->user["nid"]}' AND `isResult`=1 AND `hidden`=0";
        $date = date("Y-m-d");
        $params = [];
        if(isset($this->param["gtype"]) && strtoupper($this->param["gtype"])!="ALL"){
            $gtype = strtoupper($this->param["gtype"]);
            $where .= " AND `gtype`=?";
            $params[] = $gtype;
        }

        if(isset($this->param["today_gmt"]) && strtoupper($this->param["today_gmt"])!="ALL"){
            $date = $this->param["today_gmt"];
        }
        $where .= " AND `m_date`=?";
        $params[] = $date;
        $allDateValue = "";
        $allDateShow  = "";
        for($i=0;$i<=7;$i++){
            if($i==0){
                $dt = date("Y-m-d");
            }else{
                $dt = date("Y-m-d",strtotime("-{$i} day"));
            }
            $allDateValue.= $dt."|";
            $allDateShow .= date("m-d",strtotime($dt));
            switch ($this->langx){
                case "en-us":
                    $w = date("w",strtotime($dt));
                    $allDateShow .= " ".$weekAry["en-us"][$w]."|";
                    break;
                default:
                    $w = date("w",strtotime($dt));
                    $allDateShow .= " ".$weekAry["zh-cn"][$w]."|";
                    break;
            }
        }
        $allDateShow = rtrim($allDateShow,"|");
        $allDateValue= rtrim($allDateValue,"|");

        $xmls = [];
        // print_r("SELECT * FROM {$this->bet_table} WHERE {$where}");exit;
        $rs = $this->dbc->selectNew("SELECT * FROM {$this->bet_table} WHERE {$where} ORDER BY `bet_time` DESC", $params);
        if($rs){
            $xmls.=$this->get_bet_list($rs,"Y");
        }

        $xml[] = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        $xml[]= "<serverresponse>";
        $xml[]= "<code>609</code>";
        $xml[]= "<selDate>{$date}</selDate>";
        $xml[]= "<selGtype>{$gtype}</selGtype>";
        $xml[]= "<allDateValue>{$allDateValue}</allDateValue>";
        $xml[]= "<allDateShow>{$allDateShow}</allDateShow>";
        $xml[]= "<pay_type>{$this->user["pay_type"]}</pay_type>";
        $xml[]= $xmls;
        $xml[]= "</serverresponse>";
        $this->insertLog("账户历史-注单页");
        return implode('', $xml);
    }

    /**
     * 账户历史
     * @return string
     */
    public function get_history_data(){
        global $weekAry;
        $nid = $this->user["nid"];
        $total_gold = 0;
        $total_vgold = 0;
        $total_winloss = 0;
        $xmls = "";
        $dateBar = "";
        $num = 0;
        for($i=0;$i<=7;$i++){
            if($i==0) {
                $date = date("Y-m-d");
            } else {
                $date = date("Y-m-d",strtotime("-{$i} day"));
            }
            $dateBar.=$date."|";
            $num++;
            $date_name = "";
            //startdate  enddate
            if(empty($this->param["startdate"]) || (!empty($this->param["startdate"]) && $this->param["startdate"]<=$date && $date<=$this->param["enddate"])) {
                switch ($this->langx) {
                    case "en-us":
                        $date_name .= date("m-d", strtotime($date));
                        $w = date("w", strtotime($date));
                        $date_name .= " " . $weekAry["en-us"][$w];
                        break;
                    default:
                        $date_name .= date("m月d日", strtotime($date));
                        $w = date("w", strtotime($date));
                        $date_name .= " " . $weekAry["zh-cn"][$w];
                        break;
                }

                $ary = [
                    "date" => $date,
                    "date_name" => $date_name,
                    "action_date" => "",
                    "date_class" => "his_list_none",
                    "gold" => "-",
                    "vgold" => "-",
                    "winloss" => "-",
                    "winloss_class" => "winloss_black"
                ];

                //print_r("SELECT SUM(`bet_golds`) AS `gold`, SUM(`valid_gold`) AS `vgold`,SUM(`mem_result`) AS `winloss` FROM {$this->bet_table} WHERE `isResult`=1 AND `m_date`='{$ary["date"]}' AND `nid`='{$nid}'");exit;
                $where = "";
                if (isset($this->param["gtype"]) && strtoupper($this->param["gtype"]) != "ALL") {
                    $gtype = strtoupper($this->param["gtype"]);
                    $where = " AND `gtype`='{$gtype}'";
                }
                //SUM(IF(`pay_type`=1 AND `mem_result`>=0,`mem_result`+`mem_result`,`mem_result`))
                $rs = $this->dbc->select("SELECT SUM(`bet_golds`) AS `gold`, SUM(`valid_gold`) AS `vgold`,SUM(`mem_result`) AS `winloss` FROM {$this->bet_table} WHERE `isResult`=1 AND `m_date`='{$ary["date"]}' AND `nid`='{$nid}' AND `hidden`=0 {$where}", "Row");
                if ($rs) {
                    $total_gold += $rs["gold"];
                    $total_vgold += $rs["vgold"];
                    $total_winloss += $rs["winloss"];

                    $ary["date_class"] = "his_list";
                    $ary["gold"] = empty($rs["gold"]) ? "-" : number_format(round($rs["gold"], 2),0) ;
                    $ary["vgold"] = empty($rs["vgold"]) ? "-" : number_format(round($rs["vgold"], 2),0);
                    $ary["winloss"] = empty($rs["winloss"]) ? "-" : number_format(round($rs["winloss"], 2),2);
                    if ($rs["winloss"] > 0) {
                        $ary["winloss_class"] = "word_green";
                    } else {
                        $ary["winloss_class"] = "word_red";
                    }
                }

                $xmls .= "<history>";
                $xmls .= "<date>{$ary["date"]}</date>";
                $xmls .= "<date_name>{$ary["date_name"]}</date_name>";
                $xmls .= "<action_date></action_date>";
                $xmls .= "<date_class>{$ary["date_class"]}</date_class>";
                $xmls .= "<gold>{$ary["gold"]}</gold>";
                $xmls .= "<vgold>{$ary["vgold"]}</vgold>";
                $xmls .= "<winloss>{$ary["winloss"]}</winloss>";
                $xmls .= "<winloss_class>{$ary["winloss_class"]}</winloss_class>";
                $xmls .= "</history>";
            }
        }
        $dateBar = rtrim($dateBar,"|");
        $total_gold = empty($total_gold) ? "-" : number_format($total_gold,0);
        $total_vgold = empty($total_vgold) ? "-" : number_format($total_vgold,0);
        $total_winloss = empty($total_winloss) ? "-" : number_format($total_winloss,2);
        $winloss_class = $total_winloss=="-" ? "word_lightred" : ($total_winloss>0 ? "word_lightgreen" : "word_lightred");
        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        $xml.= "<serverresponse>";
        $xml.= "<code>607</code>";
        $xml.= "<total_gold>{$total_gold}</total_gold>";
        $xml.= "<total_vgold>{$total_vgold}</total_vgold>";
        $xml.= "<total_winloss>{$total_winloss}</total_winloss>";
        $xml.= "<total_winloss_class>{$winloss_class}</total_winloss_class>";
        $xml.= "<pay_type>{$this->user["pay_type"]}</pay_type>";
        $xml.= $xmls;
        $xml.= "<dateBar>{$dateBar}</dateBar>";
        $xml.= "<history_view_day>{$num}</history_view_day>";
        $xml.= "</serverresponse>";
        $this->insertLog("账户历史-总览页");
        return $xml;
    }

    /**
     * 交易状况统计
     * @return array
     */
    public function get_todaywagers_count(){
        $nid = $this->user["nid"];
        $date = date("Y-m-d");
        $params = [
            'nid' => $nid,
            'isResult' => 0,
            'hidden' => 0
        ];
        $rs = $this->dbc->selectNew("SELECT COUNT(*) AS `cou` FROM {$this->bet_table} WHERE `nid`=:nid AND `isResult`=:isResult AND `hidden`=:hidden", $params, 'Row');
//        $rs = $this->dbc->select("SELECT COUNT(*) AS `cou` FROM {$this->bet_table} WHERE `nid`='{$nid}' AND `isResult`=0 AND `hidden`=0","Row");
        $cou = isset($rs["cou"]) ? $rs["cou"] : 0;
        $arr = [
            "code" => "666",
            "count"=> $cou
        ];
        return $arr;
    }
    public function get_today_wagers_json(){
        global $oddf_type_ary,$gtypes,$ls_game_ary,$artjson,$ls_ary,$ls_account_ary;
        $nid = $this->user["nid"];
        $date = date("Y-m-d");
        $where = "`nid`='{$nid}' AND `isResult`=0 AND `hidden`=0";
        if(strtoupper($this->param["selGtype"])!="ALL"){
            $where .= " AND `gtype`='{$this->param["selGtype"]}'";
        }

        $cs = "";
        switch ($this->param["langx"]){
            case "zh-tw":
                $cs = "_tw";
                break;
            case "en-us":
                $cs = "_en";
                break;
        }
        $count = 0;
        $amout_gold = 0;
        $sql = "SELECT * FROM {$this->bet_table} WHERE {$where} ORDER BY `bet_time` DESC,`id` DESC ";
        $rs = $this->dbc->select($sql);
        //file_put_contents('./bet725.log',date('Y-m-d H:i:s').$sql."\r\n",FILE_APPEND);
        //{"pay_type":0,"talert":null,"code":"todaywagers","amout_gold":0,"count":0,"ts":"1689938577841"}
        if ($rs)
        {
            $count = count($rs);
            $bet_golds = array_column($rs,"bet_golds");
            $amout_gold = number_format(array_sum($bet_golds),2);
        }else{
            $amout_gold = 0;
        }
//        {"code":"todaywagers","amout_gold":"0","wagers":[],"count":0,"pay_type":0,"ts":"1690105455413"}
        // file_put_contents('./betrs.log',date('Y-m-d H:i:s').var_export($rs,true)."\r\n",FILE_APPEND);


        $isResult = 'N';
        $allGidAry = [];
        foreach ($rs as &$v){
            
            $wagers = '';
            $team_h_ratio = '';
            $team_c_ratio = '';
            $strong = '';
            $score = '';
            $wtype_name = '';
            $wtype = $v["wtype"];
            $gtype = strtoupper($v["gtype"]);
            $gtype_name = $artjson["ATR_ball_".strtolower($gtype)];
            $v['gtype_name'] = $gtype_name;
            if(!isset($allGidAry[$gtype])){ 
                $allGidAry[$gtype] = [];
                $allGidAry[$gtype][] = $v["gid"];
            }else{ 
                if(!in_array($v["gid"],$allGidAry[$gtype])){ 
                    $allGidAry[$gtype][] = $v["gid"];
                }
            }
            $bet_wtype = strtoupper($wtype);
            if(strtoupper($wtype) == "P3"){//过关
                $p3 = $this->dbc->select("SELECT * FROM {$this->bet_p3_table} WHERE `p3id`={$v["ID"]}");
                foreach ($p3 as $vv){
                    if($vv["rb"]=="Y"){
                        $bet_wtype = "RP3";
                    }
                    $returnwagers= $this->get_bet_wagers_json($vv,$isResult,"P3");
                    $wagers.= $returnwagers['result'];
                    $team_h_ratio= $returnwagers['team_h_ratio'];
                    $team_c_ratio= $returnwagers['team_c_ratio'];
                    $strong= $returnwagers['strong'];
                    $wtype_name = $returnwagers['wtype_name'];
                    $score = $returnwagers['score'];
                }
            }else{
                $bet_wtype = strtoupper($wtype);//RE
                $returnwagers= $this->get_bet_wagers_json($v,$isResult);// 篮球 开始给正负号
                $wagers.= $returnwagers['result'];
                $team_h_ratio= $returnwagers['team_h_ratio'];
                $team_c_ratio= $returnwagers['team_c_ratio'];
                $strong= $returnwagers['strong'];
                $wtype_name = $returnwagers['wtype_name'];
                $score = $returnwagers['score'];
            }
            $v['bet_wtype'] = $bet_wtype;
            $v['bet_gtype'] = $gtype;
            $v['result'] = $wagers;
            $v['team_h_ratio'] = $team_h_ratio;
            $v['team_c_ratio'] = $team_c_ratio;
            $v['strong'] = $strong;
            $v['wtype'] = $wtype_name;
            $v['score'] = $score;
            $caltype = 1;
            if($v['chose_team'] == 'H' && !empty($team_c_ratio)){
                $caltype = -1;
            }
            if($v['chose_team'] == 'C' && !empty($team_h_ratio)){
                $caltype = -1;
            }
            if(strpos($v["spread"], ' / ') !== false){
                $concede_temp = explode ( ' / ', $v["spread"] );
                $v['concede'] = ceil($concede_temp[0])*$caltype;
            }else{
                $v['concede'] = 0;
            }
            
            $v["w_id"] = $v['ticket_id'];
            $v["addtime"] = date("H:i:s",$v["datetime"]); 
            $v["oddf_type"] = "(".$ls_ary["oddf_".$v["odd_f_type"]].")";

            $msStr = $v["ms"];
            $ms_name = "";
            if($gtype != "FT" && !empty($ms)) {
                $ms = explode('_', $msStr)[1];
                $ms_str = $ls_game_ary[$gtype . "_game_" . $ms . "_set"];
                if (!empty($ms_str)) {
                    if ($ms_str != $gtype . "_game_" . $ms . "_set") {
                        $ms_name = "{$ms_str}";
                    }
                }
            }else{
                if(!empty($v["ptype_id"])){
                    $ms_name = str_replace("-","",$v["ptype{$cs}"])." : ";
                }
            }
            $v["w_ms"] = $ms_name;
            $v["team_id_h"] = $v["gnum_h"];
            $v["team_id_c"] = $v["gnum_c"];
            $v["adddate"] = date("Y-m-d H:i:s",$v["datetime"]);
            $v["bet_showtype"] = $v["showtype"];
            $v["team_h_show"] = $v["team_h".$cs];
            $v["team_c_show"] = $v["team_c".$cs];
            $ball_act_class = "";
            $ball_act_ret = "";
            switch ($v["danger"]){
                case 1://待确认
                    $ball_act_class = "word_yellow";
                    $ball_act_ret = $ls_account_ary["today_wagers_N"];
                    break;
                case 2:
                    $ball_act_class = "word_red";
                    $ball_act_ret = $ls_account_ary["today_wagers_R"];
                    break;
                case 3:
                    $ball_act_class = "word_green";
                    $ball_act_ret = $ls_account_ary["today_wagers_A"];
                    break;
            }
            
            $v["ball_act_class"] = $ball_act_class;
            $v["ball_act_ret"] = $ball_act_ret;
            if($gtype == "FT"){ 
                $v["mainGid"] = $v["gid"]%2 == 0 ? $v["gid"]-1 : $v["gid"];
            }else{ 
                $v["mainGid"] = $v["gid"];
            }


            $v['gidfl'] = "0"; 
            $v["stop_time"] = -1;
            $v["fore_result"] = 0;
            $v["code_value"] = "1.0"; 
            $v["ball_map"] = "";
            $v["pname"] = ""; 
            
            
            $v["cancel_apn"] = "";
            $v["cancel_line"] = "";
            $v["delaysec"] = "0";
            $v["ballact"] = "0";
        }
        $arr = [
            "pay_type" => $this->user["pay_type"],
            // "talert" => null,
            "allGidAry"=>$allGidAry,
            "code" => "todaywagers",
            "amout_gold" => $amout_gold,
            "count"=> $count,
            "ts" => $this->param["ts"],
            "wagers" => $rs
        ];
        $this->insertLog("查看交易状况");
        return $arr;
    }
    public function get_bet_wagers_json($v,$isResult="N",$p_wtype='',$isAD="N"){
        global $ls_game_ary,$ls_account_ary;
        $cs = "";
        switch ($this->param["langx"]){
            case "zh-tw":
                $cs = "_tw";
                break;
            case "en-us":
                $cs = "_en";
                break;
        }

        $ut = new Util_game();
        // print_r($v);exit;
        $wagers = "";
        $gtype = $v["gtype"];// BK 篮球
        $rtype = $v["rtype"];
        $wtype = $v["wtype"];
        $_wtype = $v["wtype"];
        $showtype = $v["showtype"];
        $_chose_team = $v["chose_team"];
        $danger = $v["danger"];
        $spread = $v["spread"];// 让球
        $date = $v["m_date"];
        $imp = $v["important"];
        $ptype = $v["ptype{$cs}"];

        $ms_name = "";


        $league = $v["league{$cs}"];
        $team_h = $v["team_h{$cs}"];//主队
        $team_c = $v["team_c{$cs}"];// 客队
        if($gtype != "FT"){
            $msAry = explode("-",$team_h);
            if(isset($msAry[1])){
                $msStr1 = "- ".$msAry[1];
                $team_h = rtrim(str_replace($msStr1,"",$team_h));
                $team_c = rtrim(str_replace($msStr1,"",$team_c));
            }
        }

        if($imp=="Y"){
            $team_h = rtrim(str_replace($ptype,"",$team_h));
            $team_c = rtrim(str_replace($ptype,"",$team_c));
        }

        $msStr = $v["ms"];//如:篮球(4369430_3) 4369430:gid,1:第一节)
        if($gtype != "FT" && !empty($msStr)) {//todo
            $ms = explode('_', $msStr)[1];
            $ms_str = $ls_game_ary[$gtype . "_game_" . $ms . "_set"];
            if (!empty($ms_str)) {
                if ($ms_str != $gtype . "_game_" . $ms . "_set") {
                    $ms_name = "- {$ms_str}";
                }
            }
        }


        $wtype_name =  "";
        if($gtype=="ES"){ 
            $wtype_name .= $v["gamenum"]>0 ? $ls_game_ary["ES_g".$v["gamenum"]]: "";
            if($v["period_id"]>1){ 
                $aa = ["*TEAM_H*","*TEAM_C*"];
                $bb = [$team_h,$team_c];
                $pid_name = str_replace($aa,$bb,$ls_game_ary["period_".$v["period_id"]."_ES"]." - ");
                $wtype_name .= $pid_name;
            }
        }
        $wtype_name .= $ut->getWtypeName($showtype,$gtype,$wtype,$rtype,$msStr,$team_h,$team_c,$imp,$ptype,false);

        $score = "";
        if(!empty($v["score"])){
            $scs = explode(":",$v["score"]);
            if(count($scs)==2){
                $score = "({$scs[0]} - {$scs[1]})";
            }
        }
        

        if($wtype=="SP") {
            $wtype = $ut->changeRtypetoWtypeSP($rtype);
        }

        $strong = $v["strong"];// 其实只有H 和C
        if(strtoupper($_chose_team)=="N") {
            $_chose_team = "H";
        }
        $strObj = [
            "H_Y" => "H",
            "C_N" => "H",
            "C_Y" => "C",
            "H_N" => "C"
        ];
        $strong = isset($strObj[$_chose_team."_".$strong]) ? $strObj[$_chose_team."_".$strong] : $strong;


        $ratio = $spread;
        $conObj = $ut->getConcedeStr($wtype,$strong,$ratio,false);

        $_rtype = strtolower($rtype);
        $newRtype = $ut->switchTeamName($wtype,$rtype);
        if(!empty($newRtype)){
            $_rtype = $newRtype;
        }

        if(strtoupper($gtype)=="BS" && $ut->checkWtypeIsWM($_wtype)){
            $chose_team = $ls_game_ary[$_rtype."_".strtolower($gtype)];
        }else if(!isset($ls_game_ary[$_rtype])){
            $Ftype="_F_RF_DC_RDC_";
            if (strpos($Ftype,"_".strtoupper($_wtype)."_")!==false){
                $f1=strtoupper(substr(str_replace(strtoupper($_wtype),"",strtoupper($rtype)),0,1));
                $f2=strtoupper(substr(str_replace(strtoupper($_wtype),"",strtoupper($rtype)),1,1));
                $chose_team = "";
                if($f1=="N"){
                    $chose_team.= $ls_game_ary["mn"];
                }else{
                    $choose = $team_h;
                    if($f1 == "C"){
                        $choose = $team_c;
                    }
                    $chose_team.= $choose;
                }
                $chose_team .= " / ";
                if ($f2=="N"){
                    $chose_team.= $ls_game_ary["mn"];
                }else{
                    $choose = $team_h;
                    if($f2 == "C"){
                        $choose = $team_c;
                    }
                    $chose_team.= $choose;
                }
            }else{
                $tmp_type = substr($_chose_team,-1,1);
                $choose = $team_h;
                if(strtoupper($tmp_type) == "C"){
                    $choose = $team_c;
                }
                $chose_team = $choose;
            }
        } else {
            $chose_team = $ls_game_ary[$_rtype];
            $chose_team = preg_replace("/\*TEAM_H\*/is", $team_h, $chose_team);
            $chose_team = preg_replace("/\*TEAM_C\*/is", $team_c, $chose_team);
        }

        $tmp_team = "";
        $get_team = $ut->getTeamWM(strtoupper($_rtype));
        if(!empty($get_team)){
            $tmp_team = $team_h;
            if($get_team == "c"){
                $tmp_team = $team_c;
            }
        }

        $result = $tmp_team.$chose_team;


        if(!$ut->checkWtypeIsOU($wtype) && $wtype!="W3"){
        }else{
            $_abs = "";
            if($_wtype=="W3"){
                $chose = $_chose_team;
                if(strtoupper($chose)=="N") $chose="H";

                if(strtoupper($strong)==strtoupper($chose)){
                    $_abs = "-";
                }else{
                    $_abs = "+";
                }
            }
            $rtype_name = $result;
            $spread_name = $_abs.$spread;
            $result .=  " ".$_abs.$spread;

        }
        if(strtoupper($p_wtype) == "P3"){

        }elseif(strtoupper($wtype)=="FS"){

        }else{
            if ($strong == "H") {
                $strong = "Y";
                if ($chose_team == $team_h) {
                    $strong = "Y";
                } else {
                    $strong = "N";
                }
            } else {
                $strong = "N";
                if ($chose_team == $team_c) {
                    $strong = "Y";
                } else {
                    $strong = "N";
                }
            }
        }

        return ["score"=>$score,"wtype_name"=>$wtype_name,"result" => $result,"strong" => $strong, "team_h_ratio" => $conObj["bet_finish_con"], "team_c_ratio" =>$conObj["bet_finish_con_c"]];
    }
    public function get_today_wagers(){
        global $oddf_type_ary,$gtypes,$ls_game_ary,$ls_account_ary;
        $nid = $this->user["nid"];
        $date = date("Y-m-d");
        $where = "`nid`='{$nid}' AND `isResult`=0 AND `hidden`=0";
        if(strtoupper($this->param["selGtype"])!="ALL"){
            $where .= " AND `gtype`='{$this->param["selGtype"]}'";
        }

        $cs = "";
        switch ($this->param["langx"]){
            case "zh-tw":
                $cs = "_tw";
                break;
            case "en-us":
                $cs = "_en";
                break;
        }
        $count = 0;
        $amout_gold = 0;
        $rs = $this->dbc->select("SELECT * FROM {$this->bet_table} WHERE {$where} ORDER BY `bet_time` DESC,`id` DESC ");
        //print_R("SELECT * FROM {$this->bet_table} WHERE {$where} ORDER BY `bet_time` DESC,`id` DESC ");exit;
        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        $xml.= "<serverresponse>";
        $xml.= "<code>todaywagers</code>";
        $xml.= "<ts>{$this->param["ts"]}</ts>";
        if($rs){
            $count = count($rs);
            $bet_golds = array_column($rs,"bet_golds");
            $amout_gold = number_format(array_sum($bet_golds),2);
            $xml.= $this->get_bet_list($rs);
            $xml.= "<amout_gold>{$amout_gold}</amout_gold>";
        }else{
            $xml.= "<amout_gold>{$amout_gold}</amout_gold>";
        }
        $xml.= "<count>{$count}</count>";
        $xml.= "<pay_type>{$this->user["pay_type"]}</pay_type>";
        $xml.= "</serverresponse>";
        $this->insertLog("查看交易状况");
        return $xml;
    }

    /**
     * 注单列表处理
     * @param $rs
     * @param string $isResult Y:结算注单,N:未结算注单
     * @return string
     */
    public function get_bet_list($rs,$isResult="N"){
        global $ls_ary,$ls_account_ary,$artjson,$bet_status;
        $wagers = [];
        $amout_gold = 0;
		
		$p3_map = array();
		if (!empty($rs)) {
			$p3_ids = array_column($rs, 'ID');
			if (!empty($p3_ids)) {
				$ids_str = implode(',', array_map('intval', $p3_ids));
				// echo "SELECT * FROM {$this->bet_p3_table} WHERE `p3id` IN ({$ids_str})\n";

				$p3_rows = $this->dbc->select(
					"SELECT * FROM {$this->bet_p3_table} WHERE `p3id` IN ({$ids_str})"
				);

				foreach ($p3_rows as $row) {
					$pid = $row['p3id'];
					if (!isset($p3_map[$pid])) {
						$p3_map[$pid] = array();
					}
					$p3_map[$pid][] = $row;
				}
			}
		}

		
        foreach ($rs as $k => $v){
            $amout_gold += $v["bet_golds"];
            $ticket_id = $v["ticket_id"];
            $gtype = strtoupper($v["gtype"]);
            $rtype = $v["rtype"];
            $wtype = $v["wtype"];
            $showtype = $v["showtype"];
            $ms_name = "";
            $ballact = 0;
            $danger = $v["danger"];
            $gid = $v["gid"];

            $addtime = date("H:i:s",$v["bet_time"]);
            $oddf_type_name = $ls_ary["oddf_".$v["odd_f_type"]];
            
            $gtype_name = $artjson["ATR_ball_".strtolower($gtype)];
            if($gtype=="BK"){ 
                $gtype_name = $artjson["ATR_ball_bk1"];
            }
            $wagers[]= "<wagers tid=\"{$ticket_id}\">";
            $wagers[]= "<w_id>{$ticket_id}</w_id>";
            $wagers[]= "<gidfl>0</gidfl>";
            $wagers[]= "<gid>{$gid}</gid>";
            $wagers[]= "<addtime>{$addtime}</addtime>";
            $wagers[]= "<oddf_type>({$oddf_type_name})</oddf_type>";
            $wagers[]= "<gtype>{$gtype_name}</gtype>";
            if(strtoupper($wtype) == "P3"){//过关
                $bet_wtype = "P";
                $ball_act_class = "";
                $ball_act_ret = "";
                $ddd = "";
                $ddd1 = "";
                $ddd2 = "";
                $wagers[]= "<w_ms></w_ms>";
                $wagers[]= "<wtype></wtype>";
				
				// echo "SELECT * FROM {$this->bet_p3_table} WHERE `p3id`={$v["ID"]}\n";
                //$p3 = $this->dbc->select("SELECT * FROM {$this->bet_p3_table} WHERE `p3id`={$v["ID"]}");
				
				$p3 = array_key_exists($v["ID"], $p3_map) ? $p3_map[$v["ID"]] : array();
                foreach ($p3 as $vv){
                    $wagers[]= "<wagers_sub>";
                    if($vv["rb"]=="Y"){
                        $bet_wtype = "RP3";
                    }

                    if($vv["dg"] == "Y"){
                        switch ($danger){
                            case 1://待确认
                                $ball_act_class = "word_yellow";
                                $ball_act_ret = $ls_account_ary["today_wagers_N"];
                                $ddd = "N";
                                break;
                            case 2:
                                $ddd1 = "R";
                                $ball_act_class = "word_red";
                                $ball_act_ret = $ls_account_ary["today_wagers_R"];
                                break;
                            case 3:
                                $ddd2 = "A";
                                $ball_act_class = "word_green";
                                $ball_act_ret = $ls_account_ary["today_wagers_A"];
                                break;
                        }
                    }
                    $wagers[]= $this->get_bet_wagers($vv,$isResult,"P3");
                    $wagers[]= "</wagers_sub>";
                }
                $wagers[]= "<bet_wtype>{$bet_wtype}</bet_wtype>";

                if($bet_wtype == "RP3"){
                    if($ddd1=="R"){
                        $wagers[]= "<main_ball_act_class>word_red</main_ball_act_class>";
                        $wagers[]= "<main_ball_act_ret>{$ls_account_ary["today_wagers_R"]}</main_ball_act_ret>";
                        $wagers[]= "<ball_act_class>word_red</ball_act_class>";
                        $wagers[]= "<ball_act_ret>{$ls_account_ary["today_wagers_R"]}</ball_act_ret>";
                    }else if($ddd == "N"){
                        $wagers[]= "<main_ball_act_class>word_yellow</main_ball_act_class>";
                        $wagers[]= "<main_ball_act_ret>{$ls_account_ary["today_wagers_N"]}</main_ball_act_ret>";
                        $wagers[]= "<ball_act_class>word_yellow</ball_act_class>";
                        $wagers[]= "<ball_act_ret>{$ls_account_ary["today_wagers_N"]}</ball_act_ret>";
                    }else if($ddd2=="A"){
                        $wagers[]= "<main_ball_act_class>word_yellow</main_ball_act_class>";
                        $wagers[]= "<main_ball_act_ret>{$ls_account_ary["today_wagers_A"]}</main_ball_act_ret>";
                        $wagers[]= "<ball_act_class>word_yellow</ball_act_class>";
                        $wagers[]= "<ball_act_ret>{$ls_account_ary["today_wagers_A"]}</ball_act_ret>";
                    } else{
                        $wagers[]= "<main_ball_act_class></main_ball_act_class>";
                        $wagers[]= "<main_ball_act_ret></main_ball_act_ret>";
                        $wagers[]= "<ball_act_class></ball_act_class>";
                        $wagers[]= "<ball_act_ret></ball_act_ret>";
                    }

                }else{
                    $wagers[]= "<main_ball_act_class></main_ball_act_class>";
                    $wagers[]= "<main_ball_act_ret></main_ball_act_ret>";
                    $wagers[]= "<ball_act_class></ball_act_class>";
                    $wagers[]= "<ball_act_ret></ball_act_ret>";
                    
                }

            }else{
                $bet_wtype = strtoupper($wtype);
                $wagers[]= "<bet_wtype>{$bet_wtype}</bet_wtype>";
                $wagers[]= $this->get_bet_wagers($v,$isResult);
                if($v["dg"]=="Y"){
                    $ballact = 1;
                    $wagers[]= "<dg>{$v["dg"]}</dg>";
                    $wagers[]= "<dg_str>{$ls_account_ary["today_wagers_A"]}</dg_str>";
                }

            }

            
            $wagers[]= "<gold>{$v["bet_golds"]}</gold>";
            $cancel_apn = "";
            if($isResult=="Y"){
                if($v["status"]>0){
                    $wagers[]= "<win_gold>-</win_gold>";
                    $wagers[]= "<push>{$bet_status[0]}</push>";
                    // $cancel_apn = $bet_status[$v["status"]];
                }else{
                    $mem_result = round($v["mem_result"],2);
                    $wagers[]= "<win_gold>{$mem_result}</win_gold>";
                    if($v["mem_result"] == 0){
                        $wagers[]= "<push>{$bet_status[0]}</push>";
                    }
                }

            }else{
                $wagers[]= "<win_gold>{$v["win_gold"]}</win_gold>";
                $wagers[]= "<delaysec>0</delaysec>";
                $wagers[]= "<ballact>{$ballact}</ballact>";
            }
            $wagers[]= "<cancel_apn></cancel_apn>";//{$cancel_apn}交易状况、帐户历史-当有取消原因有公告没有出现I图示
            $wagers[]= "</wagers>";
        }
		return implode('', $wagers);
    }

    /**
     * 赛果处理
     * @param $v
     * @param $home 主队名
     * @param $away 客队名
     * @param $wtype_name 下注类型
     * @param string $isAD "Y":后台显示 "N":前台显示
     * @return string[]
     */
    public function getInball($v,$home,$away,$wtype_name,$isAD="N"){
        global $ls_game_ary,$artjson;
        $ug = new Util_game();
        $wtype_name = rtrim($wtype_name);
        $inball = $v["inball"];
        $wtype = strtoupper($v["wtype"]);
        $gtype = strtoupper($v["gtype"]);
        $ary = [
            "team" => "",
            "data" => ""
        ];

        //显示上半场比分
        $retime1H = str_replace(["场","場"],"",$ls_game_ary["retime1H"]);
        $retime2H = str_replace(["场","場"],"",$ls_game_ary["retime2H"]);
        if($ug->checkWtypeIsHalf_util($wtype)){
            $ary["data"] = "({$ls_game_ary["retime1H"]} {$inball})";
            if($isAD == "Y"){

                $ary["data"] = "({$retime1H} : {$inball})";
            }
            return $ary;
        }

        //显示下半场比分
        if($wtype == "RTS2"){
            $ary["data"] = "({$ls_game_ary["retime2H"]} {$inball})";
            if($isAD == "Y"){
                $ary["data"] = "({$retime2H} : {$inball})";
            }
            return $ary;
        }
        //是否为15分钟盘口
        $m15 = [
            "AM","BM","CM","DM","EM","FM","ARM","BRM","CRM","DRM","ERM","FRM",
            "AR","BR","CR","DR","ER","FR","ARE","BRE","CRE","DRE","ERE","FRE",
            "AOU","BOU","COU","DOU","EOU","FOU","AROU","BROU","CROU","DROU","EROU","FROU",
        ];
        if(in_array($wtype,$m15)){
            $ary["data"] = $wtype_name . " : " . $inball;
            if($isAD == "Y"){
                $ary["data"] = "({$ary["data"]})";
            }
            return $ary;
        }

        //冠军显示
        if($wtype == "FS" && !empty($inball)){
            $cs = "";
            $leg204= "任何时间";
            switch ($cs){
                case "en_us":
                    $cs = "_en";
                    $leg204 = "Anytime";
                    break;
                case "zh-tw":
                    $cs = "_tw";
                    $leg204= "任何時間";
                    break;
            }

            $sfsTable = Constant::S_SP;

            $ins = explode("|",$inball);
            $ins0 = str_replace(["H","C"],"",$ins[0]);
            $sgid = $ins[1];
            $where = "`sgid`='{$sgid}' AND `sfs_id` LIKE '%{$ins0}'";
            if(strtoupper($ins0)=="FS"){//冠军
                $where = "`gid`='{$sgid}' AND `sfs_id`='FS'";
            }
			

            $fs = $this->dbc->select("SELECT `team{$cs}` AS `team` FROM {$sfsTable} WHERE {$where} AND `result`='Y' AND `win`='Y'");

            switch ($ins0){
                case "19":
                    $data = $ls_game_ary["showRtype_pgf"]." : ";
                    break;
                case "20":
                    $data = $ls_game_ary["showRtype_pgl"]." : ";
                    //print_r("SELECT `team{$cs}` AS `team` FROM {$sfsTable} WHERE `gid`='{$v["gid"]}' AND `sfs_id` LIKE '%{$ins}' AND `result`='Y' AND `win`='Y'");exit;
                    break;
                case "204":
                    $data = $leg204.": ";
                    break;
                default:
                    $data = $ls_game_ary["showRtype_fs"]." : ";
                    break;
            }

            if($fs){
                foreach ($fs as $ff){
                    $data.=$ff["team"].";";
                }
                $ary["data"] = rtrim($data,";");
                if($isAD == "Y"){
                    $ary["data"] = "({$ary["data"]})";
                }
            }
            return $ary;
        }

        //网球 第某盘 第某局
        $tn_inball_ary = [
            "RFA01","RFA02","RFA03","RFA04","RFA05","RFA06","RFA07","RFA08","RFA09","RFA10","RFA11","RFA12","RFA13",
            "RFB01","RFB02","RFB03","RFB04","RFB05","RFB06","RFB07","RFB08","RFB09","RFB10","RFB11","RFB12","RFB13",
            "RFC01","RFC02","RFC03","RFC04","RFC05","RFC06","RFC07","RFC08","RFC09","RFC10"
            ,"RFC11","RFC12","RFC13","RFC14","RFC15","RFC16","RFC17","RFC18","RFC19","RFC20"
            ,"RFC21","RFC22","RFC23","RFC24","RFC25","RFC26","RFC27","RFC28","RFC29","RFC30"
            ,"RFC31","RFC32","RFC33","RFC34","RFC35","RFC36","RFC37","RFC38","RFC39","RFC40"
            ,"RFC41","RFC42","RFC43","RFC44","RFC45","RFC46","RFC47","RFC48","RFC49","RFC50",

            "RFD01","RFD02","RFD03","RFD04","RFD05","RFD06","RFD07","RFD08","RFD09","RFD10","RFD11","RFD12","RFD13",

            "RFE01","RFE02","RFE03","RFE04","RFE05","RFE06","RFE07","RFE08","RFE09","RFE10"
            ,"RFE11","RFE12","RFE13","RFE14","RFE15","RFE16","RFE17","RFE18","RFE19","RFE20"
            ,"RFE21","RFE22","RFE23","RFE24","RFE25","RFE26","RFE27","RFE28","RFE29","RFE30"
            ,"RFE31","RFE32","RFE33","RFE34","RFE35","RFE36","RFE37","RFE38","RFE39","RFE40"
            ,"RFE41","RFE42","RFE43","RFE44","RFE45","RFE46","RFE47","RFE48","RFE49","RFE50"
        ];

        if(in_array($wtype,$tn_inball_ary)){
            $nwtype = substr($wtype,0,3);
            $numw = substr($wtype,3,2);
            $instr = "";
            switch ($nwtype){
                case "RFA":
                    $instr.= $ls_game_ary["TN_game_a_set_{$numw}"];
                    break;
                case "RFB":
                    $instr.= $ls_game_ary["TN_game_b_set_{$numw}"];
                    break;
                case "RFC":
                    $instr.= $ls_game_ary["TN_game_c_set_{$numw}"];
                    break;
                case "RFD":
                    $instr.= $ls_game_ary["TN_game_d_set_{$numw}"];
                    break;
                case "RFE":
                    $instr.= $ls_game_ary["TN_game_e_set_{$numw}"];
                    break;
            }
            
            $arr = explode("|",$inball);
            $instr = str_replace(" - ","",$instr);
            $instr.= " : ";
            if(isset($arr[1])){ 
                switch ($arr[1]){
                    case "H":
                        $instr.= $home;
                        break;
                    case "C":
                        $instr.= $away;
                        break;
                    default:
                        $instr.= $artjson["ART_chgid_btn_cancel"];
                        break;
                }
            }
            
            $ary["data"] = "({$instr})";
            return $ary;
        }

        $sk_inball_ary = [
            "F01","F02",
            "RF01","F02","F03","F04","F05","F06","F07","F08","F09","F10",
            "RF11","F12","F13","F14","F15","F16","F17","F18","F19","F20",
            "RF21","F22","F23","F24","F25","F26","F27","F28","F29","F30",
            "RF31","F32","F33","F34","F35"
        ];
        if(in_array($wtype,$sk_inball_ary)){
            $ary["data"] = $ls_game_ary["SK_".$wtype];
            $arr = explode("|",$inball);
            if(isset($arr[1])) {
                switch ($arr[1]){
                    case "H":
                        $ary["team"] = $home;
                        break;
                    case "C":
                        $ary["team"] = $away;
                        break;
                }
                $ary["data"] .= " : ".$ary["team"];
            }

            return $ary;
        }

        //和比分无关
        $n_inball_ary = [
            "BH","SP","F2G","F3G","FG","T1G","RT1G","T3G","RT3G","TK","PA","RCD","OG","OT","ROT","MW","MQ","RPS","RPF","RTW",
            "ARG","BRG","CRG","DRG","ERG","FRG","GRG","HRG","IRG","JRG","KRG","LRG","MRG","NRG","ORG",
            "RPXA","RPXB","RPXC","RPXD","RPXE","RPXF","RPXG","RPXH","RPXI","RPXJ","RPXK","RPXL","RPXM","RPXN","RPXO",
            "RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO",
            "RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9",
            "RNCA","RNCB","RNCC","RNCD","RNCE","RNCF","RNCG","RNCH","RNCI",
            "RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR",
            "RNCS","RNCT","RNCU",
            "RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO",
        ];
        if(in_array($wtype,$n_inball_ary)){
            $arr = explode("|",$inball);
            if(isset($arr[1])) {
                switch ($wtype) {
                    case "BH"://落后反超获胜
                    case "SP":
                        switch (strtoupper($arr[1])) {
                            case "HOME":
                                $ary["team"] = $home;
                                $ary["data"] = $wtype_name . " : " . $home;
                                break;
                            case "AWAY":
                                $ary["team"] = $away;
                                $ary["data"] = $wtype_name . " : " . $away;
                                break;
                            default:
                                $ary["team"] = $ls_game_ary["rpgln"];//无
                                $ary["data"] = $wtype_name . " : " . $ls_game_ary["rpgln"];
                                break;
                        }
                        break;
                    case "F2G"://先进2球的一方
                    case "F3G"://先进3球的一方
                        switch (strtoupper($arr[1])) {
                            case "H":
                                $ary["team"] = $home;
                                $ary["data"] = $wtype_name . " : " . $home;
                                break;
                            case "C":
                                $ary["team"] = $away;
                                $ary["data"] = $wtype_name . " : " . $away;
                                break;
                            default:
                                $ary["team"] = $ls_game_ary["f2gn"];//两队都没有
                                $ary["data"] = $wtype_name . " : " . $ls_game_ary["f2gn"];
                                break;
                        }
                        break;
                    case "FG"://首个进球方式
                        $a = strtolower($arr[1]);
                        $ary["team"] = $ls_game_ary["fg{$a}"];
                        $ary["data"] = $wtype_name . " : " . $ary["team"];
                        break;
                    case "T1G"://首个进球时间
                    case "RT1G":
                        $a = strtolower($arr[1]);
                        $ary["team"] = $ls_game_ary["t1g{$a}"];
                        $ary["data"] = $wtype_name . " : " . $ary["team"];
                        break;
                    case "T3G"://首个进球时间 -3项
                    case "RT3G":
                        $a = strtolower($arr[1]);
                        $ary["team"] = $ls_game_ary["t3g{$a}"];
                        $ary["data"] = $wtype_name . " : " . $ary["team"];
                        break;
                    case "TK"://开球球队
                        switch (strtoupper($arr[1])) {
                            case "H":
                                $ary["team"] = $home;
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                            case "C":
                                $ary["team"] = $away;
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                        }
                        break;
                    case "PA"://点球荣获（除开点球大战)
                    case "RCD"://红卡(球员)
                        switch (strtoupper($arr[1])) {
                            case "Y":
                                $ary["team"] = $ls_game_ary["tsy"];
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                            case "N":
                                $ary["team"] = $ls_game_ary["tsn"];
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                        }
                        break;
                    case "OG"://乌龙球
                    case "OT"://加时赛
                    case "ROT":
                    case "RPS"://点球大战
                        switch (strtoupper($arr[1])) {
                            case "Y":
                                $ary["team"] = $ls_game_ary["tsy"];
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                            case "N":
                                $ary["team"] = $ls_game_ary["tsn"];
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                        }
                        break;
                    case "MW"://胜出方法
                        $a = strtolower($arr[1]);
                        $ary["team"] = $ls_game_ary["mw{$a}"];
                        $ary["data"] = $wtype_name . " : " . $ary["team"];
                        break;
                    case "MQ"://晋级方法
                        $a = strtolower($arr[1]);
                        $aa = ["*TEAM_H*","*TEAM_C*"];
                        $bb = [$home,$away];
                        $ary["team"] = str_replace($aa,$bb,$ls_game_ary["mq{$a}"]);
                        $ary["data"] = $wtype_name . " : " . $ary["team"];
                        break;
                    case "RPF"://点球大战 - 最后结束回合
                        $a = strtolower($arr[1]);
                        $ary["team"] = $ls_game_ary["rpf{$a}"];
                        $ary["data"] = $wtype_name . " : " . $ary["team"];
                        break;
                    case "RTW"://点球大战 - 净胜球数
                        $a = strtolower($arr[1]);
                        $aa = ["*TEAM_H*","*TEAM_C*"];
                        $bb = [$home,$away];
                        $ary["team"] = str_replace($aa,$bb,$ls_game_ary["rtw{$a}"]);
                        $ary["data"] = $wtype_name . " : " . $ary["team"];
                        break;
                    case "ARG"://第一个进球
                    case "BRG"://第二个进球
                    case "CRG"://第三个进球
                    case "DRG"://第四个进球
                    case "ERG"://第五个进球
                    case "FRG"://第六个进球
                    case "GRG"://第七个进球
                    case "HRG"://第八个进球
                    case "IRG"://第九个进球
                    case "JRG"://第十个进球
                    case "KRG"://第十一个进球
                    case "LRG"://第十二个进球
                    case "MRG"://第十三个进球
                    case "NRG"://第十四个进球
                    case "ORG"://第十五个进球
                        switch (strtoupper($arr[1])) {
                            case "H":
                                $ary["team"] = $home;
                                break;
                            case "C":
                                $ary["team"] = $away;
                                break;
                            default:
                                $ary["team"] = $ls_game_ary["argn"];
                                break;
                        }
                        $ary["data"] = $wtype_name . " : " . $ary["team"];
                        break;
                    case "RPXA"://点球大战 - 第一回合
                    case "RPXB"://点球大战 - 第二回合
                    case "RPXC"://点球大战 - 第三回合
                    case "RPXD"://点球大战 - 第四回合
                    case "RPXE"://点球大战 - 第五回合
                    case "RPXF"://点球大战 - 第六回合
                    case "RPXG"://点球大战 - 第七回合
                    case "RPXH"://点球大战 - 第八回合
                    case "RPXI"://点球大战 - 第九回合
                    case "RPXJ"://点球大战 - 第十回合
                    case "RPXK"://点球大战 - 第十一回合
                    case "RPXL"://点球大战 - 第十二回合
                    case "RPXM"://点球大战 - 第十三回合
                    case "RPXN"://点球大战 - 第十四回合
                    case "RPXO"://点球大战 - 第十五回合
                        $a = str_replace("RPX","",$wtype);
                        switch ($arr[0]){
                            case "RSH{$a}":
                                $ary["team"] = $home;
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                            case "RSC{$a}":
                                $ary["team"] = $away;
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                            default:
                                $ary["team"] = $ls_game_ary["rpx{$a}n"];
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                        }
                        break;
                    case "RSHA"://第一个点球大战
                    case "RSHB"://第二个点球大战
                    case "RSHC"://第三个点球大战
                    case "RSHD"://第四个点球大战
                    case "RSHE"://第五个点球大战
                    case "RSHF"://第六个点球大战
                    case "RSHG"://第七个点球大战
                    case "RSHH"://第八个点球大战
                    case "RSHI"://第九个点球大战
                    case "RSHJ"://第十个点球大战
                    case "RSHk"://第十一个点球大战
                    case "RSHL"://第十二个点球大战
                    case "RSHM"://第十三个点球大战
                    case "RSHN"://第十四个点球大战
                    case "RSHO"://第十五个点球大战
                        $a = str_replace("RSH","",$wtype);
                        switch ($arr[0]){
                            case "RSH{$a}":
                                $ary["team"] = $home;
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                            case "RSC{$a}":
                                $ary["team"] = $away;
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                            default:
                                $ary["team"] = $ls_game_ary["rsh{$a}n"];
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                        }
                        break;

                    case "RNBA"://第一张罚牌
                    case "RNBB"://第二张罚牌
                    case "RNBC"://第三张罚牌
                    case "RNBD"://第四张罚牌
                    case "RNBE"://第五张罚牌
                    case "RNBF"://第六张罚牌
                    case "RNBG"://第七张罚牌
                    case "RNBH"://第八张罚牌
                    case "RNBI"://第九张罚牌
                    case "RNBJ"://第十张罚牌
                    case "RNBK"://第十一张罚牌
                    case "RNBL"://第十二张罚牌
                    case "RNBM"://第十三张罚牌
                    case "RNBN"://第十四张罚牌
                    case "RNBO"://第十五张罚牌
                    case "RNC1"://第一個角球
                    case "RNC2"://第二個角球
                    case "RNC3"://第三個角球
                    case "RNC4"://第四個角球
                    case "RNC5"://第五個角球
                    case "RNC6"://第六個角球
                    case "RNC7"://第七個角球
                    case "RNC8"://第八個角球
                    case "RNC9"://第九個角球
                    case "RNCA"://第十個角球
                    case "RNCB"://第十一個角球
                    case "RNCC"://第十二個角球
                    case "RNCD"://第十三個角球
                    case "RNCE"://第十四個角球
                    case "RNCF"://第十五個角球
                    case "RNCG"://第十六個角球
                    case "RNCH"://第十七個角球
                    case "RNCI"://第十八個角球
                    case "RNCJ"://第十九個角球
                    case "RNCK"://第二十個角球
                    case "RNCL"://第二十一個角球
                    case "RNCM"://第二十二個角球
                    case "RNCN"://第二十三個角球
                    case "RNCO"://第二十四個角球
                    case "RNCP"://第二十五個角球
                    case "RNCQ"://第二十六個角球
                    case "RNCR"://第二十七個角球
                    case "RNCS"://第二十八個角球
                    case "RNCT"://第二十九個角球
                    case "RNCU"://第三十個角球
                        switch (strtoupper($arr[1])) {
                            case "H":
                                $ary["team"] = $home;
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                            case "C":
                                $ary["team"] = $away;
                                $ary["data"] = $wtype_name . " : " . $ary["team"];
                                break;
                        }
                        break;

                }
            }
            if($isAD == "Y"){$ary["data"] = "({$ary["data"]})";}
            return $ary;
        }

        $msStr = $v["ms"];
        $ms_name = "";
        $cs = "";
        switch ($this->param["langx"]){
            case "zh-tw":
                $cs = "_tw";
                break;
            case "en-us":
                $cs = "_en";
                break;
        }
        if($gtype != "FT" && !empty($ms)) {
            $ms = explode('_', $msStr)[1];
            $ms_str = $ls_game_ary[$gtype . "_game_" . $ms . "_set"];
            if (!empty($ms_str)) {
                if ($ms_str != $gtype . "_game_" . $ms . "_set") {
                    $ms_name = "{$ms_str}";
                }
            }
        }else{
            if(!empty($v["ptype_id"])){
                $ms_name = str_replace("-","",$v["ptype{$cs}"])." : ";
            }
        }

        $inballAry = explode("@",$inball);
        if(count($inballAry)==1){
            $inball = str_replace(":"," - ",$inball);
            $ary["data"] = "{$ms_name} {$inball}";
            if($isAD == "Y"){
                if(empty($ms_name)) {$ms_name = $artjson["ART_game_fulltime"];}
                str_replace(":","",$ms_name);
                $ary["data"] = "({$ms_name} : {$inball})";
            }
        }else{
            $i0 = str_replace(":"," - ",$inballAry[0]);
            $i1 = str_replace(":"," - ",$inballAry[1]);
            /*switch (strtoupper($arr[1])) {
                case "HOME":
                    $ary["team"] = $home;
                    $ary["data"] = $wtype_name . ":" . $home;
                    break;
                case "AWAY":
                    $ary["team"] = $away;
                    $ary["data"] = $wtype_name . ":" . $away;
                    break;
                default:
                    $ary["team"] = $ls_game_ary["rpgln"];//无
                    $ary["data"] = $wtype_name . ":" . $ls_game_ary["rpgln"];
                    break;
            }*/
            $arr = explode("|",$i1);
            if(count($arr)==1){
                $ary["data"] = $ms_name.$i0." ({$ls_game_ary["retime1H"]} $i1)";
                if($isAD == "Y"){
                    if(empty($ms_name)) {$ms_name = $artjson["ART_game_fulltime"]." : ";}
                    $ary["data"] = "({$ms_name}{$i0}) ({$retime1H} : {$i1})";
                }
            }else{
                switch (strtoupper($arr[0])){
                    case "PGF":
                    case "PGL":
                        $wtype_name = $ls_game_ary["showRtype_".strtolower($arr[0])];
                        switch (strtoupper($arr[1])) {
                            case "HOME":
                                $str = $wtype_name . " : " . $home;
                                break;
                            case "AWAY":
                                $str = $wtype_name . " : " . $away;
                                break;
                            default:
                                $str = $wtype_name . " : " . $ls_game_ary["rpgln"];
                                break;
                        }
                        $ary["data"] = $ms_name.$i0." ({$str})";
                        if($isAD == "Y"){
                            if(empty($ms_name)) {$ms_name = $artjson["ART_game_fulltime"]." : ";}
                            $ary["data"] = "({$ms_name}{$i0}) ($str)";
                        }
                        break;
                    default:
                        $ary["data"] = $ms_name.$i0." ({$ls_game_ary["retime1H"]} $i1)";
                        if($isAD == "Y"){
                            if(empty($ms_name)) {$ms_name = $artjson["ART_game_fulltime"]." : ";}
                            $ary["data"] = "({$ms_name}{$i0}) ({$retime1H} : {$i1})";
                        }
                        break;

                }

            }

        }
        return $ary;

    }

    /**
     * 注单处理
     * @param $v
     * @param $isResult Y:结算注单,N:未结算注单
     * @param string $p_wtype
     * @param string $isAD Y:后台显示 N:前台显示
     * @return string
     */
    public function get_bet_wagers($v,$isResult="N",$p_wtype='',$isAD="N"){
        global $ls_game_ary,$ls_account_ary,$bet_status;
        $cs = "";
        switch ($this->param["langx"]){
            case "zh-tw":
                $cs = "_tw";
                break;
            case "en-us":
                $cs = "_en";
                break;
        }

        $ut = new Util_game();
        $wagers = [];
        $gtype = $v["gtype"];
        $rtype = $v["rtype"];
        $wtype = $v["wtype"];
        $_wtype = $v["wtype"];
        $showtype = $v["showtype"];
        $_chose_team = $v["chose_team"];
        $danger = $v["danger"];
        $spread = $v["spread"];
        $date = $v["m_date"];
        $imp = $v["important"];
        $ptype = $v["ptype{$cs}"];

        $ms_name = "";


        $league = $v["league{$cs}"];
        $team_h = $v["team_h{$cs}"];
        $team_c = $v["team_c{$cs}"];
        if($gtype != "FT"){
            $msAry = explode("-",$team_h);
            if(isset($msAry[1])){
                $msStr1 = "- ".$msAry[1];
                $team_h = rtrim(str_replace($msStr1,"",$team_h));
                $team_c = rtrim(str_replace($msStr1,"",$team_c));
            }
        }

        if($imp=="Y"){
            $team_h = rtrim(str_replace($ptype,"",$team_h));
            $team_c = rtrim(str_replace($ptype,"",$team_c));
        }

        $msStr = $v["ms"];
        if($gtype != "FT" && !empty($msStr)) {
            $ms = explode('_', $msStr)[1];
            $ms_str = isset($ls_game_ary[$gtype . "_game_" . $ms . "_set"]) ? $ls_game_ary[$gtype . "_game_" . $ms . "_set"] : "";
            if (!empty($ms_str)) {
                if ($ms_str != $gtype . "_game_" . $ms . "_set") {
                    $ms_name = " - {$ms_str}";
                }
            }
            
        }

        $wtype_name =  "";
        if($gtype=="ES"){ 
            $wtype_name .= $v["gamenum"]>0 ? $ls_game_ary["ES_g".$v["gamenum"]]: "";
            if($v["period_id"]>1){ 
                $aa = ["*TEAM_H*","*TEAM_C*"];
                $bb = [$team_h,$team_c];
                $pid_name = str_replace($aa,$bb,$ls_game_ary["period_".$v["period_id"]."_ES"]." - ");
                $wtype_name .= $pid_name;
                if($v["period_id"] == 2){ 
                    $sp = explode(":",$spread);
                    if(count($sp)==1){ 
                        $spread = $spread.":00";
                    }
                }
            }
        }
        
        $wtype_name .= $ut->getWtypeName($showtype,$gtype,$wtype,$rtype,$msStr,$team_h,$team_c,$imp,$ptype,false);
	

        $score = "";
		  $orgscore = "";
        if(!empty($v["score"])){ 
            $scs = explode(":",$v["score"]);
            if(count($scs)==2){
                $score = "({$scs[0]} - {$scs[1]})";
            }
			 $orgscore = $v["score"];
        }
        

        if($wtype=="SP") {
            $wtype = $ut->changeRtypetoWtypeSP($rtype);
        }

        $strong = $v["strong"];
        if(strtoupper($_chose_team)=="N") {
            $_chose_team = "H";
        }
        $strObj = [
            "H_Y" => "H",
            "C_N" => "H",
            "C_Y" => "C",
            "H_N" => "C"
        ];
        $strong = isset($strObj[$_chose_team."_".$strong]) ? $strObj[$_chose_team."_".$strong] : $strong;
        $ratio = $spread;
        $conObj = $ut->getConcedeStr($wtype,$strong,$ratio,false);

        $_rtype = strtolower($rtype);
        $newRtype = $ut->switchTeamName($wtype,$rtype);
        if(!empty($newRtype)){
            $_rtype = $newRtype;
        }
        if(strtoupper($gtype)=="BS" && $ut->checkWtypeIsWM($_wtype)){
            $chose_team = $ls_game_ary[$_rtype."_".strtolower($gtype)];
        }else if(!isset($ls_game_ary[$_rtype])){
            $Ftype="_F_RF_DC_RDC_";
            if (strpos($Ftype,"_".strtoupper($_wtype)."_")!==false){
                $f1=strtoupper(substr(str_replace(strtoupper($_wtype),"",strtoupper($rtype)),0,1));
                $f2=strtoupper(substr(str_replace(strtoupper($_wtype),"",strtoupper($rtype)),1,1));
                $chose_team = "";
                if($f1=="N"){
                    $chose_team.= $ls_game_ary["mn"];
                }else{
                    $choose = $team_h;
                    if($f1 == "C"){
                        $choose = $team_c;
                    }
                    $chose_team.= $choose;
                }
                $chose_team .= " / ";
                if ($f2=="N"){
                    $chose_team.= $ls_game_ary["mn"];
                }else{
                    $choose = $team_h;
                    if($f2 == "C"){
                        $choose = $team_c;
                    }
                    $chose_team.= $choose;
                }
            }else{
                $tmp_type = substr($_chose_team,-1,1);
                $choose = $team_h;
                if(strtoupper($tmp_type) == "C"){
                    $choose = $team_c;
                }
                $chose_team = $choose;
            }
        } else {
            $chose_team = $ls_game_ary[$_rtype];
            $chose_team = preg_replace("/\*TEAM_H\*/is", $team_h, $chose_team);
            $chose_team = preg_replace("/\*TEAM_C\*/is", $team_c, $chose_team);
        }

        $tmp_team = "";
        $get_team = $ut->getTeamWM(strtoupper($_rtype));
        if(!empty($get_team)){
            $tmp_team = $team_h;
            if($get_team == "c"){
                $tmp_team = $team_c;
            }
        }

        $result = $tmp_team.$chose_team;


        if(!$ut->checkWtypeIsOU($wtype) && $wtype!="W3"){
        }else{//大小处理
            $_abs = "";
            if($_wtype=="W3"){
                $chose = $_chose_team;
                if(strtoupper($chose)=="N") $chose="H";

                if(strtoupper($strong)==strtoupper($chose)){
                    $_abs = "-";
                }else{
                    $_abs = "+";
                }
            }
            $rtype_name = $result;
            $spread_name = $_abs.$spread;
            $result .=  " ".$_abs.$spread;

            $wagers[]= "<rtype_name>{$rtype_name} </rtype_name>";
            $wagers[]= "<spread_name>{$spread_name} </spread_name>";
        }



        $ball_act_class = "";
        $ball_act_ret = "";
        switch ($danger){
            case 1://待确认
                $ball_act_class = "word_yellow";
                $ball_act_ret = $ls_account_ary["today_wagers_N"];
                break;
            case 2:
                $ball_act_class = "word_red";
                $ball_act_ret = $ls_account_ary["today_wagers_R"];
                break;
            case 3:
                $ball_act_class = "word_green";
                $ball_act_ret = $ls_account_ary["today_wagers_A"];
                break;
        }

        
        if($isResult=="Y" && $v["status"]>0){
            $ball_act_class = "word_red";
            $ball_act_ret = $bet_status[$v["status"]];
            // if($v["status"]!=12){ 
            //     $ball_act_ret = $bet_status[12]." - ".$bet_status[$v["status"]];
            // }
        }


        if(strtoupper($p_wtype) == "P3"){
			  if ($strong == "H") {
                $strong = "Y";
                if ($chose_team == $team_h) {
                    $strong = "Y";
                } else {
                    $strong = "N";
                }
            } else {
                $strong = "N";
                if ($chose_team == $team_c) {
                    $strong = "Y";
                } else {
                    $strong = "N";
                }
            }
            $date = date("m-d",strtotime($date));
            $wagers[]= "<date>{$date} </date>";
            $wagers[]= "<wtype_sub>{$wtype_name}</wtype_sub>";
            //$wagers[]= "<ms_sub>{$ms_name}</ms_sub>";
			$wagers[]= "<ms_sub></ms_sub>";
            $wagers[]= "<league>{$league}</league>";
            $wagers[]= "<team_h_show>{$team_h} </team_h_show>";
            $wagers[]= "<team_c_show>{$team_c} </team_c_show>";
            $wagers[]= "<team_h_ratio>{$conObj["bet_finish_con"]}</team_h_ratio>";
            $wagers[]= "<team_c_ratio>{$conObj["bet_finish_con_c"]}</team_c_ratio>";
            $wagers[]= "<ratio></ratio>";
            $wagers[]= "<org_score></org_score>";
            $wagers[]= "<chose_team>{$v["chose_team"]}</chose_team>";
            $wagers[]= "<strong>{$strong}</strong>";
            $wagers[]= "<score>{$score}</score>";
			     $wagers[]= "<orgscore>{$orgscore}</orgscore>";
            $wagers[]= "<result>{$result} </result>";
            $wagers[]= "<pname>{$ptype}</pname>";
            $wagers[]= "<ioratio>{$v["ioratio"]}</ioratio>";
            $wagers[]= "<p_wtype>{$_wtype}</p_wtype>";
            $wagers[]= "<p_ball_act_class>{$ball_act_class}</p_ball_act_class>";
            $wagers[]= "<p_ball_act_ret>{$ball_act_ret}</p_ball_act_ret>";
        }elseif(strtoupper($wtype)=="FS"){
            $wagers[]= "<w_ms>{$ms_name}</w_ms>";
            $wagers[]= "<wtype>{$wtype_name}</wtype>";
            $wagers[]= "<league>{$league}</league>";
            $wagers[]= "<team_h_show></team_h_show>";
            $wagers[]= "<team_c_show></team_c_show>";
            $wagers[]= "<team_h_ratio></team_h_ratio>";
            $wagers[]= "<team_c_ratio></team_c_ratio>";
            $wagers[]= "<ratio></ratio>";
            $wagers[]= "<org_score></org_score>";
            $wagers[]= "<score></score>";
            $wagers[]= "<result>{$result}</result>";
            $wagers[]= "<pname></pname>";
            $wagers[]= "<ioratio>{$v["ioratio"]}</ioratio>";
            $wagers[]= "<ball_act_class></ball_act_class>";
            $wagers[]= "<ball_act_ret></ball_act_ret>";
        }else{
            if ($strong == "H") {
                $strong = "Y";
                if ($chose_team == $team_h) {
                    $strong = "Y";
                } else {
                    $strong = "N";
                }
            } else {
                $strong = "N";
                if ($chose_team == $team_c) {
                    $strong = "Y";
                } else {
                    $strong = "N";
                }
            }
          $wagers[]= "<strong>{$strong}</strong>";
            $wagers[]= "<chose_team>{$_chose_team}</chose_team>";
           // $wagers[]= "<w_ms>{$ms_name}</w_ms>";
			 $wagers[]= "<w_ms></w_ms>";
            $wagers[]= "<wtype>{$wtype_name}</wtype>";
            $wagers[]= "<league>{$league}</league>";

            $wagers[]= "<team_h_show>{$team_h} </team_h_show>";
            $wagers[]= "<team_c_show>{$team_c} </team_c_show>";
            $wagers[]= "<team_h_ratio>{$conObj["bet_finish_con"]}</team_h_ratio>";
            $wagers[]= "<team_c_ratio>{$conObj["bet_finish_con_c"]}</team_c_ratio>";
            $wagers[]= "<ratio></ratio>";
            $wagers[]= "<org_score></org_score>";
            $wagers[]= "<score>{$score}</score>";
				     $wagers[]= "<orgscore>{$orgscore}</orgscore>";
            $wagers[]= "<result>{$result}</result>";
            $wagers[]= "<pname>{$ptype}</pname>";
            $wagers[]= "<ioratio>{$v["ioratio"]}</ioratio>";
            $wagers[]= "<ball_act_class>{$ball_act_class}</ball_act_class>";
            $wagers[]= "<ball_act_ret>{$ball_act_ret}</ball_act_ret>";
        }
        if($isResult=="Y"){
            $resultAry = $this->getInball($v,$team_h,$team_c,$wtype_name,$isAD);
            $wagers[]= "<gtype_tag>{$gtype}</gtype_tag>";
            $wagers[]= "<result_team>{$resultAry["team"]}</result_team>";
            if($gtype=="ES" && $v["period_id"]==2){ 
                $inball1 = str_replace(" - ",":",$resultAry["data"]);
                $wagers[]= "<result_data>{$inball1}</result_data>";
            }else{ 
                $wagers[]= "<result_data>{$resultAry["data"]}</result_data>";
            }
            
        }
		
		return implode('', $wagers);
    }

    /**
     * 获取Xml节点值
     * @param $xml
     * @param $str
     * @return mixed
     */
    public function getXmlNode($xml, $str)
    {
        preg_match("/\<{$str}>(.*?)\<\/{$str}>/is", $xml, $arr);
        return isset($arr[1]) ? rtrim($arr[1]) : "";
    }

    /**
     * 读取后台注单的默认配置
     * @return array|null
     */
    public function getDefaultConn(){
        $nid = $this->user["nid"];
        $ad_nid = sup_nid(Constant::AD,$nid);
        $conn_table = Constant::T_CONFIG;
        $rs = $this->dbc->select("SELECT * FROM {$conn_table} WHERE `nid`='{$ad_nid}'","Row");
        if(!$rs){
            $conn_default_table = Constant::T_CONFIG_DEFAULT;
            $rs = $this->dbc->select("SELECT * FROM {$conn_default_table} LIMIT 1","Row");
        }
        return $rs;
    }

    public function getConn(){
        $gtype = "OP";

        if($this->param["wtype"] == "FS"){
            $gtype = "FS";
        }else{
            switch ($this->param["gtype"]){
                case "FT":
                case "BK":
                    $gtype = $this->param["gtype"];
                    break;
            }
        }
        //{"FT":{"data":{"DT_3":{"type":"DT_3","rtype":"DT","ltype":"3","sc":"220000","so":"55000","war":0},"M_3":{"type":"M_3","rtype":"M","ltype":"3","sc":"110002","so":"55001","war":0},"RDT_3":{"type":"RDT_3","rtype":"RDT","ltype":"3","sc":"2109","so":"1054","war":0},"RE_3":{"type":"RE_3","rtype":"RE","ltype":"3","sc":"1100000","so":"550000","war":"0.75"},"R_3":{"type":"R_3","rtype":"R","ltype":"3","sc":"1100000","so":"550000","war":"0.75"}}},"BK":{"data":{"DT_3":{"type":"DT_3","rtype":"DT","ltype":"3","sc":"110000","so":"55000","war":0},"M_3":{"type":"M_3","rtype":"M","ltype":"3","sc":"110000","so":"55000","war":0},"RE_3":{"type":"RE_3","rtype":"RE","ltype":"3","sc":"1100000","so":"220000","war":"0.75"},"R_3":{"type":"R_3","rtype":"R","ltype":"3","sc":"1100000","so":"550000","war":"0.75"}}},"OP":{"data":{"DT_3":{"type":"DT_3","rtype":"DT","ltype":"3","sc":"110000","so":"55000","war":0},"M_3":{"type":"M_3","rtype":"M","ltype":"3","sc":"220000","so":"55000","war":0},"RE_3":{"type":"RE_3","rtype":"RE","ltype":"3","sc":"1100000","so":"220000","war":"0.75"},"R_3":{"type":"R_3","rtype":"R","ltype":"3","sc":"1100000","so":"550000","war":"0.75"}}},"FS":{"data":{"FS_3":{"type":"FS_3","rtype":"FS","ltype":"3","sc":"110000","so":"55000","war":0}}}}
        $conn = json_decode($this->user["config"],true)[$gtype]["data"];
        return $conn;
    }

    /**
     * 玩家单场最高，单注最高查询
     * @return array
     */
    public function get_account_set(){
        $gtype = "OP";
        switch ($gtype){
            case "FT":
            case "BK":
            case "FS":
                $gtype = $this->param["gtype"];
                break;
        }

        $conn = json_decode($this->user["config"],true)[$gtype]["data"];
        $arr = [
            "code"=>607,
            $gtype => []
        ];
        foreach ($conn as $k => $v){
            $arr[$gtype][$v["rtype"]]["max"] = $v["sc"];
            $arr[$gtype][$v["rtype"]]["min"] = $v["s0"];
        }

        return $arr;
    }

    /**
     * 注单视图
     * @param $xml
     * @return array|mixed|string|string[]|null
     */
    public function order_view($xml){
        //会员参数配置
        $ary = [];
        switch ($this->param["p"]){
            case "Total_order_view":
                $ary["maxcredit"] = $this->user["balance_credit"];
                $xml =  preg_replace("/\<today_credit>(.*?)\<\/today_credit>/is","<today_credit>{$this->user["balance_credit"]}</today_credit>",$xml);
                if($this->user["pay_type"]==0){ //信用账号 计算昨日金额
                    //查询昨日总下注金额
                    $sum_yesterday_credit = $this->usedCredit(Constant::MEM,$this->user["nid"],"Y");
                    $yesterday_credit = $this->user["credit"] - $sum_yesterday_credit;
                    $yesterday_credit = $yesterday_credit<0 ? 0 : $yesterday_credit;
                    $xml =  preg_replace("/\<yesterday_credit>(.*?)\<\/yesterday_credit>/is","<yesterday_credit>{$yesterday_credit}</yesterday_credit>",$xml);
                }else{
                    $xml =  preg_replace("/\<yesterday_credit>(.*?)\<\/yesterday_credit>/is","<yesterday_credit>{$this->user["balance_credit"]}</yesterday_credit>",$xml);
                }
                //betStr: 640673!BK!4336523!OU!OUC!C^640670!BK!4336502!OUH!OUHO!O
                $betStr = $this->param["betStr"];
                $bsr = explode("^",$betStr);
                $str = "";
                foreach ($bsr as $k => $v){
                    //BK_640673
                    $arr = [];
                    $ss = explode("!",$v);
                    $this->param["gtype"] = $ss[1];
                    $this->param["wtype"] = $ss[3];
                    $this->param["chose_team"] = $ss[4];
                    $id = $ss[1]."_".$ss[0];
                    preg_match("/\<betslip id='{$id}'>(.*?)\<ioratio>(.*?)\<\/ioratio>(.*?)\<\/betslip>/is",$xml,$odds);

                    $ior = isset($odds[2]) ? $odds[2] : 0;
                    $arr = $this->update_order_view($ior);
                    foreach ($arr as $kk=>$vv){
                        $xml = preg_replace("/\<betslip id='{$id}'>(.*?)\<{$kk}>(.*?)\<\/{$kk}>(.*?)\<\/betslip>/is","<betslip id='{$id}'>$1<{$kk}>{$vv}</{$kk}>$3</betslip>",$xml);
                    }

                }
                $parlay = $this->getXmlNode($xml,"parlay");
                if(!empty($parlay)){
                    $arr = $this->update_order_view($ior,"DT");
                    foreach ($arr as $kk => $vv){
                        if($kk!="ioratio") {
                            $parlay = preg_replace("/\<{$kk}>(.*?)\<\/{$kk}>/is", "<{$kk}>{$vv}</{$kk}>", $parlay);
                        }
                    }
                    $xml = preg_replace("/\<parlay>(.*?)\<\/parlay>/is","<parlay>{$parlay}</parlay>",$xml);
                }
                break;
            default:
                preg_match("/\<ioratio>(.*?)\<\/ioratio>/is",$xml,$odds);
                $ior = isset($odds[1]) ? $odds[1] : 0;
                $arr = $this->update_order_view($ior);
                foreach ($arr as $k => $v){
                    $xml =  preg_replace("/\<{$k}>(.*?)\<\/{$k}>/is","<{$k}>{$v}</{$k}>",$xml);
                }
                break;
        }
        return $xml;
    }

    /**
     * 获取退水
     * @param $ary
     * @param $gtype
     * @param $rtype
     * @param $wtype
     * @return mixed
     */
    public function getTurnRate($ary,$gtype,$rtype,$wtype){
        $key = $this->getWtypeType($wtype,$rtype,$gtype);

        $ltypeNum = ltype_num($this->user["ltype"]);
        $g = "OP";
        switch ($gtype){
            case "FT":
            case "BK":
                $g = $gtype;
                break;
        }
        $trunRate = $ary[$g]["data"][$key."_".$ltypeNum]["war"];

        return $trunRate;
    }

    /**
     * 根据wtype/rtype获取所属类
     * @param $wtype
     * @param $rtype
     * @return string
     */
    public function getWtypeType($wtype,$rtype,$gtype="FT"){
        $oeAry = ["ODD", "EVEN", "HODD", "HEVEN"];//单双
        $roeAry = ["RODD", "REVEN", "HRODD", "HREVEN"];//滚球单双
        $ratioChgRule = new RatioChgRule();
        $util_game = new Util_game();
        if(in_array($rtype, $oeAry)){//单双
            $key = "R";
        }else if(in_array($rtype, $roeAry)){//滚球单双
            $key = "RE";
        }else if($ratioChgRule->chkIsM($wtype)){//独赢 滚球独赢
            $key = "M";
        }else{
            if($util_game->isRBWtype($wtype)){//是否为滚球 && $gtype=="FT"
                if($ratioChgRule->chkIsRorOU($wtype)){//滚球 让球大小
                    $key = "RE";
                }else{//滚球其他玩法
                    $key = "RDT";
                }
            }else{
                if($ratioChgRule->chkIsRorOU($wtype)){//让球大小
                    $key = "R";
                }else{//其他玩法
                    $key = "DT";
                }
            }
        }

        return $key;
    }


    /**
     * 修改注单视图
     * @param int $ior 赔率
     * @return array
     */
    public function update_order_view($ior = 0,$key="")
    {
        global $currencys;
        $this->conn = $this->getDefaultConn();
        $arr = [];
        $ltype = ltype_num($this->user["ltype"]);
        if(empty($key)) {
            if (strtoupper($this->param["wtype"]) == "FS") {
                $key = "FS";
            } else {
                $key = $this->getWtypeType($this->param["wtype"], $this->param["chose_team"], $this->param["gtype"]);
            }
        }

        switch ($key){
            case "M":
                $arr["game_so"] = $this->conn["m_min"];
                $arr["game_sc"] = $this->conn["m_max"];
                break;
            case "R":
                $arr["game_so"] = $this->conn["r_min"];
                $arr["game_sc"] = $this->conn["r_max"];
                break;
            case "RE":
                $arr["game_so"] = $this->conn["re_min"];
                $arr["game_sc"] = $this->conn["re_max"];
                break;
            case "RDT":
                $arr["game_so"] = $this->conn["rdt_min"];
                $arr["game_sc"] = $this->conn["rdt_max"];
                break;
            case "FS":
                $arr["game_so"] = $this->conn["fs_min"];
                $arr["game_sc"] = $this->conn["fs_max"];
                break;
            default:
                $arr["game_so"] = $this->conn["dt_min"];
                $arr["game_sc"] = $this->conn["dt_max"];
                break;
        }

        $conn = $this->getConn();
        $con = $conn[$key."_".$ltype];
        $arr["mem_sc"] = $con["sc"];
        $arr["mem_so"] = $con["so"];
        $arr["gold_gmin"] = $arr["game_so"];
        if($arr["mem_so"]<$arr["game_sc"]){
            $arr["gold_gmax"] = $arr["mem_so"];
        }else{
            $arr["gold_gmax"] = $arr["game_sc"];
        }

        $arr["maxcredit"] = $this->user["balance_credit"];
        $arr["currency"] = $this->user["currency"];
        $arr["currency_value"] = $currencys["zh-cn"][$this->user["currency"]]["value"];
        $arr["ltype"] = $ltype;
        $arr["username"] = $this->user["name"];

        $ut = new Util_game();
        if(count($ut->get_wtype_swap($this->param["wtype"], $this->param["chose_team"], $this->param["gtype"]))>0){
            //两种玩法的需要计算盘口赔率，如:单/双 大/小需要,而独赢（主/客/和）就不需要
            $arr["ioratio"] = chg_ioratio($this->user["ltype"], $ior);
        }else{
            $arr["ioratio"] = $ior;
        }


        return $arr;
    }

    /**
     * 查询上级资料
     * @return array
     */
    public function getSupData(){
        $arr = [];
        $rankTable = Constant::T_RANK;
        $lv = [Constant::D0,Constant::CO,Constant::SU,Constant::AG];

        foreach ($lv as $v){
            $nid = sup_nid($v,$this->user["nid"]);
            $arr[$v] = $this->dbc->select("SELECT * FROM {$rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
        }
        return $arr;
    }



    public function FS_bet($xml, $_p){
        $arr = $this->bet_check($xml, $_p);
        if ($arr["code"] == "555") {
            return $arr;
        }

        $wtype = $_p["wtype"];
        $golds = $_p['golds'];
        $gtype = $_p["gtype"];
        $rtype = $_p["rtype"];
        $gid   = $_p["gid"];
        $ioratios = $_p['ioratio'];
        $odd_f_type = empty($_p['odd_f_type']) ? $_p['odd_f_type'] : "H";
        switch (strtoupper($gtype)){
            case "FT":
                $matchTable = Constant::S_FT;
                break;
            case "BK":
                $matchTable = Constant::S_BK;
                break;
            case "BM":
                $matchTable = Constant::S_BM;
                break;
            case "BS":
                $matchTable = Constant::S_BS;
                break;
            case "VB":
                $matchTable = Constant::S_VB;
                break;
            case "TT":
                $matchTable = Constant::S_TT;
                break;
            case "TN":
                $matchTable = Constant::S_TN;
                break;
            case "SK":
                $matchTable = Constant::S_SK;
                break;
            case "OP":
                $matchTable = Constant::S_OP;
                break;
            case "ES":
                $matchTable = Constant::S_ES;
                break;
        }
        $fsTable = Constant::S_SP;

        $st = $this->dbs->select("SELECT * FROM {$fsTable} WHERE `gid`={$gid} AND `rtype`='{$rtype}'","Row");
        //print_r("SELECT * FROM {$fsTable} WHERE `gid`={$gid}");exit;
        if (!$st) {
            return ["code" => "555", "errormsg" => "1X010", "errorvalue" => ""];
        }

        $ioratio = $this->getXmlNode($xml, "ioratio");
        $ratio = $this->getXmlNode($xml,"ratio");
        $strong = $this->getXmlNode($xml,"strong");
        $spread = $this->getXmlNode($xml, "spread");
        $important = $this->getXmlNode($xml,"important");
        $v_date = $this->getXmlNode($xml, "dates");
        $dg = $this->getXmlNode($xml,"dg");
        $dg = empty($dg) ? "N" : $dg;
        if (empty($v_date)) {$v_date = date('Y-m-d');}
        $isyesterday = "N";

        if (empty($ioratio)) {
            return ["code" => "555", "errormsg" => "1X013", "errorvalue" => ""];
        }

        if ($ioratio != $ioratios) {
            return ["code" => "555", "errormsg" => "1X005", "errorvalue" => $gid];
        }

        if ($ioratio <= 0 && $odd_f_type == 'H') {
            return ["code" => "555", "errormsg" => "1X013", "errorvalue" => ""];
        }


        $insertAry = [];
        $ip = !empty($this->user["setip"]) ? $this->user["setip"] : $_SERVER['REMOTE_ADDR'];
        //主要参数插入
        $insertAry["gid"] = $gid;
        $insertAry["gtype"] = $gtype;
        $insertAry["wtype"] = $wtype;
        $insertAry["rtype"] = $rtype;
        $insertAry["important"] = empty($important) ? "N" : $important;
        $insertAry["odd_f_type"] = $odd_f_type;
        $insertAry["ltype"] = $this->user["ltype"];
        $insertAry["bet_time"] = time();
        $insertAry["bet_ip"] = $ip;
        $insertAry["ioratio"] = $ioratio;
        if(!empty($spread) || $spread == 0){ $insertAry["spread"] = $spread;}
        if(is_numeric($ratio)){$insertAry["ratio"] = $ratio;}
        $insertAry["strong"] = empty($strong) ? "H" : $strong;
        $insertAry["bet_golds"] = $_p['golds'];
        $insertAry["m_date"] = $v_date;
        $insertAry["showtype"] = "fs";
        $ug = new Util_game();

        $win_gold = $ug->util_formatNumber( ($ioratio * 1 - 1) * $golds);
        $this->conn = $this->getDefaultConn();
        $max = $this->conn["fs_max"];
        if($win_gold>$max){
            return ["code" => "555", "errormsg" => "1X020", "errorvalue" => $max];
        }
        $insertAry["win_gold"] = $win_gold;

        //赛事
        $league = $st["league"]." - ".$st["teamsname"];
        $league_tw = $st["league_tw"]." - ".$st["teamsname_tw"];
        $league_en = $st["league_en"]." - ".$st["teamsname_en"];
        $num_c = $this->getXmlNode($xml,"num_c");
        switch ($num_c){
            case "204":
                $leg204= "- 任何时间";
                $leg204_tw= "- 任何時間";
                $leg204_en= "- Anytime";
                $league   .= $leg204;
                $league_tw.= $leg204_tw;
                $league_en.= $leg204_en;
                break;
            case "19":
                $leg19 = "- 最先进球";
                $leg19_tw = "- 最先進球";
                $leg19_en = "- First Goal";

                $league   .= $leg19;
                $league_tw.= $leg19_tw;
                $league_en.= $leg19_en;
                break;
            case "20":
                $leg20 = "- 最后进球";
                $leg20_tw = "- 最後進球";
                $leg20_en = "- Last Goal";

                $league   .= $leg20;
                $league_tw.= $leg20_tw;
                $league_en.= $leg20_en;
                break;
        }
        $insertAry["league"] = $league;
        $insertAry["league_tw"] = $league_tw;
        $insertAry["league_en"] = $league_en;
        $insertAry["gnum_h"] = $this->getXmlNode($xml,"num_h");
        $insertAry["gnum_c"] = $num_c;
        $insertAry["team_h"] = $st["team"];
        $insertAry["team_h_tw"] = $st["team_tw"];
        $insertAry["team_h_en"] = $st["team_en"];
        $insertAry["datetime"] = $st["datetime"];
        $insertAry["lid"] = $st["lid"];
        $insertAry["gidm"] = $st['gidm'];

        $sup = $this->getSupData();
        $insertAry["currency"] = $this->user["currency"];
        $insertAry["hidden"] = $this->user["hidden"];
        $insertAry["nid"] = $this->user["nid"];
        $insertAry["pay_type"] = $this->user["pay_type"];
        $insertAry["m_name"] = $this->user["name"];
        $insertAry["ag_name"] = $sup["ag"]["name"];
        $insertAry["su_name"] = $sup["su"]["name"];
        $insertAry["co_name"] = $sup["co"]["name"];
        $insertAry["d0_name"] = $sup["d0"]["name"];
        $insertAry["ag_point"] = $sup["ag"]["winloss"];
        $insertAry["su_point"] = $sup["su"]["winloss"] - $sup["ag"]["winloss"];
        $insertAry["co_point"] = $sup["co"]["winloss"] - $sup["su"]["winloss"];
        $insertAry["d0_point"] = $sup["d0"]["winloss"] - $sup["co"]["winloss"];
        $insertAry["ms"] = $this->getXmlNode($xml,"ms");
        $insertAry["mem_turn_rate"] = $this->getTurnRate(json_decode($this->user["config"],true),$gtype,$rtype,$wtype);
        $insertAry["ag_turn_rate"] = $this->getTurnRate(json_decode($sup["ag"]["config"],true),$gtype,$rtype,$wtype);
        $insertAry["su_turn_rate"] = $this->getTurnRate(json_decode($sup["su"]["config"],true),$gtype,$rtype,$wtype);
        $insertAry["co_turn_rate"] = $this->getTurnRate(json_decode($sup["co"]["config"],true),$gtype,$rtype,$wtype);
        $insertAry["d0_turn_rate"] = $this->getTurnRate(json_decode($sup["d0"]["config"],true),$gtype,$rtype,$wtype);
        $ticket_id = $this->setTicketID("FS");
        $insertAry["ticket_id"] = $ticket_id;
        $this->dbc->beginTransaction();
        try{
            $this->dbc->insert($this->bet_table, $insertAry);
            BetMail::enqueue($this->dbc, $insertAry);//投注邮件通知入队(冠军注单,内部自捕获异常,不影响投注)
            $this->user = $this->chg_member_credit($this->user,true);
            $maxcredit = $this->user["balance_credit"];

            $havemoney = $maxcredit > 0 ? $maxcredit-$golds : 0;
            if ($isyesterday == "N") {
                $up = ["balance_credit" => $havemoney];
                if($this->user['pay_type']==1){ //现金
                    $up["credit"] = $havemoney;
                    //$this->set_credit_logs($this->user["nid"],0-$golds,$this->user["credit"],'下注');
                }

                $table = Constant::T_MEMBER;
                $this->dbc->update($table, $up, "`id`={$this->user["id"]}");
            }
            $this->insertLog("冠军-注单:{$ticket_id}下注成功");
            $this->dbc->commit();

            $arr = [
                "nowcredit" => $havemoney,
                "code" => 560,
                "ticket_id" => substr($ticket_id,2),
                "gid" => $gid,
                "gtype" => $_p["gtype"],
                "wtype" => $_p["wtype"],
                "rtype" => $_p["rtype"],
                "ioratio" => $this->getXmlNode($xml, "ioratio"),
                "gold" => $golds,
                "concede" => $this->getXmlNode($xml, "con"),
                "ratio" => $this->getXmlNode($xml, "ratio"),
                "date" => $this->getXmlNode($xml, "dates"),
                "time" => $this->getXmlNode($xml, "times"),
                "league" => $this->getXmlNode($xml, "league_name"),
                "stype_name" => $this->getXmlNode($xml, "team_name_c"),
                "teamname" => $this->getXmlNode($xml, "team_name_h"),
                "rtype_name" => $this->getXmlNode($xml, "score"),
                "systime" => date("Y-m-d")
            ];
            return $arr;
        }catch (\Exception $e){
            $this->dbc->rollback();
            return ["code" => "555", "errormsg" => $e->getMessage(), "errorvalue" => ""];
        }

    }

    /**
     * 所有单注单入库
     * @param $xml
     * @param $_p
     */
    public function All_bet($xml, $_p)
    {
        $arr = $this->bet_check($xml, $_p);
        if ($arr["code"] == "555") {
            return $arr;
        }

        $gid = $_p['gid'];
        $wtype = $_p['wtype'];
        $gtype = $_p["gtype"];
        
       // if ($gtype == 'BK' && $_p["ioratio"] >=3) {
          //  return ["code" => "555", "errormsg" => "1X010", "errorvalue" => ""];
       // }
        $ug = new Util_game();
        /*赛事查询 - 开始*/
        $isHR = "N";
        switch (strtoupper($gtype)){
            case "FT":
                $matchTable = Constant::S_FT;
                $isHR = "Y";
                break;
            case "BK":
                $matchTable = Constant::S_BK;
                break;
            case "BM":
                $matchTable = Constant::S_BM;
                break;
            case "BS":
                $matchTable = Constant::S_BS;
                $isHR = "Y";
                break;
            case "VB":
                $matchTable = Constant::S_VB;
                break;
            case "TT":
                $matchTable = Constant::S_TT;
                break;
            case "TN":
                $matchTable = Constant::S_TN;
                break;
            case "SK":
                $matchTable = Constant::S_SK;
                break;
            case "ES":
                $matchTable = Constant::S_ES;
                break;
            case "OP":
                $matchTable = Constant::S_OP;
                $isHR = "Y";
                break;
        }

        $where = "`gid`={$gid}";
        if($isHR=="Y" && $ug->checkWtypeIsHalf_menutype($wtype)){ //上半赛事
            $where = "`hgid`={$gid}";
        }
        // print_r("SELECT * FROM {$matchTable} WHERE {$where}");exit;
        $st = $this->dbs->select("SELECT * FROM {$matchTable} WHERE {$where}","Row");
        //return ["code" => "555", "errormsg" => "1X010", "errorvalue" => ""];
        if (!$st) {
			file_put_contents('./weizhi2026.log',date('Y-m-d H:i:s').var_export($_p,true)."\r\n",FILE_APPEND);
			file_put_contents('./weizhi2026.log',date('Y-m-d H:i:s').var_export($xml,true)."\r\n",FILE_APPEND);
            return ["code" => "555", "errormsg" => "1X010", "errorvalue" => ""];
        }
        /*赛事查询 - 结束*/
        // print_r([$_p,$xml,$st]);die;
        return $this->insertAry($_p,$xml,$st);

    }

    /**
     * 过关注单入库
     * @return array|int[]|string
     */
    public function All_bet_p3($userId=0){
        $_p = $this->param;
        $bp_p3 = $_p["bp_p3"];
        $odd_f_type = empty($_p['odd_f_type']) ? $_p['odd_f_type'] : "H";
        $pds = explode("@", $bp_p3);
        $golds = $pds[5];
        $gtype = strtoupper($pds[3]);
        $ltype = $this->user["ltype"];
        $ltypeNum = ltype_num($ltype);
        $bets = explode("^", rtrim($pds[4], "^"));
        $arr = ["code" => 555];
        $this->conn = $this->getDefaultConn();
        $max = $this->conn["dt_max"];
        $min = $this->conn["dt_min"];
        $maxcredit = $this->user["balance_credit"];
        if ($this->user["pay_type"] == 0) { //信用玩家
            $maxcredit = $this->user["credit"] - $this->usedCredit(Constant::MEM, $this->user["nid"], "N");
            $maxcredit = $maxcredit > 0 ? $maxcredit : 0;
        }
        $conn = json_decode($this->user["config"],true);
        switch (strtoupper($gtype)){
            case "FT":
            case "BK":
            case "FS":
                $sc = $conn[$gtype]["data"]["DT_".$ltypeNum]["sc"];
                $so = $conn[$gtype]["data"]["DT_".$ltypeNum]["so"];
                break;
            default:
                $sc = $conn["OP"]["data"]["DT_".$ltypeNum]["sc"];
                $so = $conn["OP"]["data"]["DT_".$ltypeNum]["so"];
                break;
        }



        if ($golds > $maxcredit) { //余额不足
            $arr["errormsg"] = "1X012";
            $arr["errorvalue"] = "";
        }

        if ($min > $golds) {//最低下注金额
            $arr["errormsg"] = "1X004";
            $arr["errorvalue"] = $this->conn["p"];
            return $arr;
        }

        if ($golds > $so) {//单注最高限额
            $arr["errormsg"] = "1X018";
            $arr["errorvalue"] = $so;
            return $arr;
        }
        $wr = new Wtype_Rtype();
        $betStr = "";
        $rows = [];
        $ug = new Util_game();
        foreach ($bets as $k => $v) {
            $vv = explode('!', $v);
            $gid = $vv[0];
            $rtype = strtoupper($vv[1]);
            $chose_team = $vv[2];
            $concede = $vv[3];
            $ratio = $vv[4];
            $ioratio = $vv[5];
            $mdate = $vv[6];

            switch (strtoupper($pds[3])) {
                case "FT":
                    $matchTable = Constant::S_FT;
                    $where = "(`gid`={$gid} OR `hgid`={$gid})";
                    break;
                case "BK":
                    $matchTable = Constant::S_BK;
                    $where = "`gid`={$gid} ";
                    break;
                case "BS":
                    $matchTable = Constant::S_BS;
                    $where = "(`gid`={$gid} OR `hgid`={$gid})";
                    break;
                case "TN":
                    $matchTable = Constant::S_TN;
                    $where = "`gid`={$gid} ";
                    break;
                case "VB":
                    $matchTable = Constant::S_VB;
                    $where = "`gid`={$gid} ";
                    break;
                case "OP":
                    $matchTable = Constant::S_OP;
                    $where = "(`gid`={$gid} OR `hgid`={$gid})";
                    break;
                case "ES":
                    $matchTable = Constant::S_ES;
                    $where = "`gid`={$gid} ";
                    break;
                case "SK":
                    $matchTable = Constant::S_SK;
                    $where = "`gid`={$gid} ";
                    break;
                default:
                    $arr["errormsg"] = "1X001";
                    $arr["errorvalue"] = "002";
                    return $arr;
                    break;
            }

            $time = time();
            $row = $this->dbs->select("SELECT * FROM {$matchTable} WHERE {$where}", "Row");
            if (!$row) {
                $arr["errormsg"] = "1X001";
                $arr["errorvalue"] = "SELECT * FROM {$matchTable} WHERE {$where}";
                return $arr;
            }
            $_rtype = $rtype;
            if ((substr($_rtype, 0, 2) == "HP" || substr($_rtype, 0, 1) == "P") && $_rtype != "PD" && $_rtype != "HPD"
                && $_rtype != "PG" && $_rtype != "PGF" && $_rtype != "PGL" && $_rtype != "PGFN" && $_rtype != "PGLN"
                && $_rtype != "PGFH" && $_rtype != "PGFC" && $_rtype != "PGLH" && $_rtype != "PGLC"
                && $_rtype != "PA" && $_rtype != "PAH" && $_rtype != "PAC") {
                $_rtype = str_replace("P", "", $_rtype);
            }
            $_t = $ug->getTeamP($rtype);
          //  $_choice = !empty($_t) ? $_t : substr($rtype, strlen($rtype) - 1, 1);
		    $_choice =  substr($rtype, strlen($rtype) - 1, 1);
            if(is_numeric($_choice)){$_choice = $_rtype;}
            $_wtype = $wr->get_rtype_wtype($gtype,$_rtype);

            $_ecid = $row["gidm"];
            if(isset($row["ecid"])){
                if(!empty($row["ecid"])){
                    $_ecid = $row["ecid"];
                }
            }
            switch (strtoupper($gtype)){
                case "TN":
                    $_ecid = $row["gidm"];
                    break;
            }
            if($ug->checkWtypeIsPD($_wtype)){
                switch ($_wtype){
                    case "PD":
                    case "RPD":
                        $_choice = $_rtype;
                        break;
                    case "HPD":
                    case "HRPD":
                        $_rtype = substr($_rtype,1);
                        $_choice = $_rtype;
                        break;
                }
            }
            if($rtype == "PE"){
                $_rtype ="EVEN";
                   $_choice ="EVEN";
                $_wtype ="T";
            }
            if($rtype == "PO"){
                $_rtype ="ODD";
                  $_choice ="ODD";
                $_wtype ="T";
            }
            $betStr .= "{$_ecid}!{$gtype}!{$gid}!{$_wtype}!{$_rtype}!{$_choice}^";
            $rows[$k] = $row;
        }

        /*p: Total_order_view
        uid: ab611f2865f7a468b5eeb19ca2b40af8354ef054bc9b44b3ae496108fd1e6a97
        ver: 2021-07-20-06_e2a70f7b-3ed5-ad58-0720-688en1576be7
        langx: zh-cn
        odd_f_type: H
        betStr: 5108275!FT!4934631!R!RH!H^5097874!FT!4928403!OU!OUC!C^5108281!FT!4934635!M!MH!H
        code: getOrderview
        needsP3: Y*/

        //5105119!FT!4932959!ROU!ROUC!C^5095341!FT!4926165!RM!RMH!H^5102967!FT!4931721!ROU!ROUC!C
        $betStr = rtrim($betStr, "^");
        $m_name = $this->user["name"];
        $sum_bet_golds = 0;
        $bt = $this->dbc->select("SELECT SUM(`bet_golds`) AS `sum_bet_golds` FROM {$this->bet_table} WHERE `betstr`='{$betStr}' AND `wtype`='P3' AND `m_name`='{$m_name}'","Row");
        if($bt){ $sum_bet_golds = $bt["sum_bet_golds"];}
        //单场最高限额
        if($sum_bet_golds+$golds>$sc){
            $arr["errormsg"] = "1X018";
            $arr["errorvalue"] = $sc;
            return $arr;
        }
        $tf = new Transform();
        $tf->getUserCurl(1,$userId);
        $parr = [
            "p" => "Total_order_view",
            "uid" => $this->web["uid"],
            "langx" => $_p["langx"],
            "odd_f_type" => $odd_f_type,
            "betStr" => $betStr,
            "code" => "getOrderview",
            "gtype" => $gtype,
            "wtype" => "P3",
            "needsP3" => "Y"
        ];
        $xml = $tf->get_curl_data($parr);
		 
        if (empty($xml)) {
            $arr["errormsg"] = "1X010";
            $arr["errorvalue"] = "";
            return $arr;
        }
        $parlay = $tf->getXmlNode($xml, "parlay");
        $code = $tf->getXmlNode($parlay, "code");
        if (empty($parlay) || strtolower($parlay) == "nobet" || empty($code)) {
            $arr["errormsg"] = "1X010";
            $arr["errorvalue"] = "";
            return $arr;
        }

        if ($code != 541) {
            $arr["code"] = 555;
            $arr["errormsg"] = $tf->getXmlNode($parlay, "errormsg");
            $arr["par_limit_min"] = $tf->getXmlNode($parlay, 'par_limit_min');
            $arr["par_limit_max"] = $tf->getXmlNode($parlay, 'par_limit_max');
            return $arr;
        }

        $this->dbc->beginTransaction();
        try{
            $sup = $this->getSupData();
            $ticket_id = $this->setTicketID("P3");
            $insertAry = [];
            $insertAry["nid"] = $this->user["nid"];
            $insertAry["betstr"] = $betStr;
            $insertAry["ticket_id"] = $ticket_id;
            $insertAry["currency"] = $this->user["currency"];
            $insertAry["hidden"] = $this->user["hidden"];
            $insertAry["nid"] = $this->user["nid"];
            $insertAry["pay_type"] = $this->user["pay_type"];
            $insertAry["m_name"] = $this->user["name"];
            $insertAry["ag_name"] = $sup["ag"]["name"];
            $insertAry["su_name"] = $sup["su"]["name"];
            $insertAry["co_name"] = $sup["co"]["name"];
            $insertAry["d0_name"] = $sup["d0"]["name"];
            $insertAry["ag_point"] = $sup["ag"]["winloss"];
            $insertAry["su_point"] = $sup["su"]["winloss"] - $sup["ag"]["winloss"];
            $insertAry["co_point"] = $sup["co"]["winloss"] - $sup["su"]["winloss"];
            $insertAry["d0_point"] = $sup["d0"]["winloss"] - $sup["co"]["winloss"];
            $gt = "OP";
            switch($gtype){ 
                case "FT":
                case "BK":
                case "FS":
                    $gt = $gtype;
                    break;
            }
            $mem_turn_rate = json_decode($this->user["config"],true)[$gt]["data"]["DT_".$ltypeNum]["war"];
            $insertAry["mem_turn_rate"] = $mem_turn_rate;
            $ag_turn_rate = json_decode($sup["ag"]["config"],true)[$gt]["data"]["DT_".$ltypeNum]["war"];
            $insertAry["ag_turn_rate"] = $ag_turn_rate;
            $su_turn_rate = json_decode($sup["su"]["config"],true)[$gt]["data"]["DT_".$ltypeNum]["war"];
            $insertAry["su_turn_rate"] = $su_turn_rate;
            $co_turn_rate = json_decode($sup["co"]["config"],true)[$gt]["data"]["DT_".$ltypeNum]["war"];
            $insertAry["co_turn_rate"] = $co_turn_rate;
            $d0_turn_rate = json_decode($sup["d0"]["config"],true)[$gt]["data"]["DT_".$ltypeNum]["war"];
            $insertAry["d0_turn_rate"] = $d0_turn_rate;
            $bettime = time();
            $insertAry["odd_f_type"] = $odd_f_type;
            $insertAry["ltype"] = $ltype;
            $insertAry["wtype"] = "P3";
            $insertAry["gtype"] = $gtype;
            $insertAry["showtype"] = "parlay";
            $insertAry["bet_time"] = $bettime;
            $ip = !empty($this->user["setip"]) ? $this->user["setip"] : $_SERVER['REMOTE_ADDR'];
            $insertAry["bet_ip"] = $ip;
            $insertAry["bet_golds"] = $golds;

            //单注处理
            $i = 0;
            $arr = [];
            $tmpIor = 0;
            $dates = date("Y-m-d");
            $insertP3s = [];
            $xmll = "";
            $betStrAry = explode("^",$betStr);//5105119!FT!4932959!ROU!ROUC!C^5095341!FT!4926165!RM!RMH!H^5102967!FT!4931721!ROU!ROUC!C
            /*print_r($betStrAry);
            print_r($bets);exit;*/
			$patternmsxml = "/\<betslip id=\'BK_(\d+)\'>(.*?)\<ms>(.*?)\<\/ms>(.*?)\<\/betslip>/s";
			$matchCount = preg_match_all($patternmsxml, $xml, $matchesnew, PREG_SET_ORDER);
			$falgmscount = 0;
            foreach ($bets as $k => $v) {
                $betAry = explode("!",$betStrAry[$k]);
                $vv = explode('!', $v);//4914247!MH!H!0!1340!1.33!2021-07-19
                $gid = $vv[0];
                $wtype = $betAry[3];
                $rtype = $betAry[4];
                $chose_team = $betAry[5];
                preg_match("/\<game id=\'gid" . $gid . "\'>(.*?)\<\/game>/s", $parlay, $games);
                $games = $games[1];
                //print_r($games);exit;
                $spread = $this->getXmlNode($games, "combine");
                $ioratio = $this->getXmlNode($games, "ioratio");
                $_strong = $this->getXmlNode($games, "strong");
                $important = $this->getXmlNode($games,"important");
                $ratio = $this->getXmlNode($games,"ratio");
                $concede = $this->getXmlNode($games,"con");
                $_wtype = $this->getXmlNode($games,"wtype");
                $v_date = $this->getXmlNode($games, "date");
                $_rtype = $this->getXmlNode($games, "rtype");
                $score = $this->getXmlNode($games,"score");
                $ms = $this->getXmlNode($games, "ms");
				if(empty($ms) && $gtype == 'BK' && $matchCount > 0){
				    $ms = $matchesnew[$falgmscount][3];
				}
				$falgmscount++;
                $dg = $this->getXmlNode($games,"dg");
                $dg = empty($dg) ? "N" : $dg;
                if (empty($v_date)) {$v_date = date('Y-m-d');}
                if($v_date>$dates){ $dates = $v_date;}
                if ($k == 0) {
                    $tmpIor = $ioratio;
                } else {
                    $tmpIor = $ug->mulFloat($tmpIor * 1, $ioratio * 1);
                }
                $st = $rows[$k];
                $stAry = ["gidm","lid","datetime","league","league_tw","league_en","gnum_h","gnum_c","team_h","team_c","team_h_tw","team_c_tw","team_h_en","team_c_en","ptype_id","ptype","ptype_tw","ptype_en"];

                $insertP3 = [];
                $insertP3["gid"] = $gid;
                $insertP3["p3id"] = 1;
                $insertP3["nid"] = $this->user["nid"];
                $insertP3["m_date"] = $v_date;
                $insertP3["bet_time"] = $bettime;
                $insertP3["ticket_id"] = $ticket_id;
                $insertP3["odd_f_type"] = $odd_f_type;
                $insertP3["chose_team"] = $chose_team;
                $insertP3["bet_ip"] = $ip;
                $insertP3["wtype"] = $wtype;
				if (substr($rtype, 0, 3) === 'WMA') {
					$insertP3["wtype"] ='WM'; 
				}
                $insertP3["gtype"] = $gtype;
                $insertP3["ltype"] = $ltype;
                $insertP3["rtype"] = $rtype;
                $insertP3["p_wtype"] = $_wtype;
                $insertP3["p_rtype"] = $_rtype;
                if(strlen($important)>1){
                   $insertP3["important"] = '';
                }else{
                   $insertP3["important"] = $important;
                }
                $insertP3["ratio"] = $ratio;
                $insertP3["ioratio"] = $ioratio;
                $insertP3["strong"] = $_strong;
                $insertP3["spread"] = $spread;
                $insertP3["ms"] = $ms;
                $insertP3["rb"] = $_wtype=="RP3" ? "Y" : "N";
                $insertP3["score"] = $score;
                if($ug->isRBWtype($wtype) && !empty($score)){//是否为滚球且需要确认比分
                    $scores = explode(":",$score);
                    if(count($scores)==2){
                        $dg = 'Y';
                        $insertP3["dg"] = "Y";
                        $insertP3["danger"] = 1;
                        if($ug->checkWtypeIs15Min_RB($wtype) && is_numeric($st["score_h"])){ //15分钟滚球
                            if($_strong == "C"){
                                $insertP3["org_score"] = $st["score_h"].":".$st["score_c"];
                            }else{
                                $insertP3["org_score"] = $st["score_c"].":".$st["score_h"];
                            }

                        }
                    }
                }
                $insertP3["currency"] = $this->user["currency"];

                //赛事内容插入
                foreach ($stAry as $v){
                    if(!empty($st[$v])){
                        $insertP3[$v] = $st[$v];
                    }
                }
                $insertP3["showtype"] = $_wtype=="RP3" ? "live" : "today";

                if($gtype == "ES"){ 
                    $insertP3["period_id"] = $st["period_id"];
                    $insertP3["peid"] = $st["peid"];
                    $insertP3["gamenum"] = $st["gamenum"];
                    $insertP3["gametype"] = $st["gametype"];
                }

                $insertP3s[] = $insertP3;
                $strong = "N";
                if ($_strong == "H") {
                    if ($chose_team == "H") {
                        $strong = "Y";
                    } else {
                        $strong = "N";
                    }
                } else {
                    if ($chose_team == "C") {
                        $strong = "Y";
                    } else {
                        $strong = "N";
                    }
                }
                $league = $this->getXmlNode($games, "league");
                $team_c = $this->getXmlNode($games, "team_c");
                $team_h = $this->getXmlNode($games, "team_h");
                $num_c = $this->getXmlNode($games, "num_c");
                $num_h = $this->getXmlNode($games, "num_h");
                $ptype = $this->getXmlNode($games, "ptype");
                $xmll .= "<game id='gid{$gid}'>";
                $xmll .= "<gid>{$gid}</gid>";
                $xmll .= "<date>{$v_date}</date>";
                $xmll .= "<rtype>{$rtype}</rtype>";
                $xmll .= "<strong>{$strong}</strong>";
                $xmll .= "<concede>{$concede}</concede>";
                $xmll .= "<ratio>{$ratio}</ratio>";
                $xmll .= "<ioratio>{$ioratio}</ioratio>";
                $xmll .= "<combine>{$spread}</combine>";
                $xmll .= "<league>{$league}</league>";
                $xmll .= "<team_c>{$team_h} </team_c>";
                $xmll .= "<team_h>{$team_c} </team_h>";
                $xmll .= "<midfield>Y</midfield>";
                $xmll .= "<num_c>{$num_c}</num_c>";
                $xmll .= "<num_h>{$num_h}</num_h>";
                $xmll .= "<ms>{$ms}</ms>";
                $xmll .= "<score>{$score}</score>";
                $xmll .= "<dg>{$dg}</dg>";
                $xmll .= "<ptype>{$ptype}</ptype>";
                $xmll .= "<important>{$important}</important>";
                $xmll .= "</game>";
            }

            $win_gold = $ug->calcWindGold($golds,$tmpIor,"P3",$gtype,$odd_f_type);//做到此处，需要下注验证是否有效
            if($win_gold>$max){
                return ["code" => "555", "errormsg" => "1X020", "errorvalue" => $max];
            }
            $insertAry["win_gold"] = $win_gold;
            $insertAry["m_date"] = $dates;

            $lastInsertId = $this->dbc->insert($this->bet_table,$insertAry,true);
            $bet_p3_table = Constant::T_BET_P3;
            foreach ($insertP3s as $v){
                $v["p3id"] = $lastInsertId;
                $this->dbc->insert($bet_p3_table,$v);
            }
            BetMail::enqueue($this->dbc, $insertAry, $insertP3s);//投注邮件通知入队(过关注单,含各关明细;内部自捕获异常,不影响投注)

            $this->user = $this->chg_member_credit($this->user,true);
            $maxcredit = $this->user["balance_credit"];
            $havemoney = $maxcredit > 0 ? $maxcredit-$golds : 0;
            $up = ["balance_credit" => $havemoney];
            if($this->user['pay_type']==1){ //现金
                $up["credit"] = $havemoney;
                //$this->set_credit_logs($this->user["nid"],0-$golds,$this->user["credit"],'下注');
            }
            $table = Constant::T_MEMBER;
            $this->dbc->update($table, $up, "`id`={$this->user["id"]}");
            $this->insertLog("过关-注单:{$ticket_id}下注成功");
            $ticket_id = substr($ticket_id,2);
            $this->dbc->commit();
            $count_p = count($bets);
            $xmls = "<code>560</code>";
            $xmls .= "<ticket_id>{$ticket_id}</ticket_id>";
            $xmls .= "<maxcredit>{$havemoney}</maxcredit>";
            $xmls .= "<gold>{$golds}</gold>";
            $xmls .= "<gtype>{$gtype}</gtype>";
            $xmls .= "<wtype>P3</wtype>";
            $xmls .= "<count_p>{$count_p}</count_p>";
            $xmls .= $xmll;
            return $xmls;
        }catch (\Exception $e){
            $this->dbc->rollback();
            return ["code" => "555", "errormsg" => $e->getMessage(), "errorvalue" => ""];
        }

    }

    /**
     * 获取注单编号
     * @param $key
     * @return string
     */
    public function setTicketID($key){
        $maxid = $this->dbc->select("SELECT MAX(`id`) AS `maxid` FROM {$this->bet_table}","Row");
        $id = rand(1000,9999);
        if($maxid){
            $id = $maxid["maxid"]+1;
        }
        $id += 22712000000;
        switch ($key){
            case "R":
            case "RE":
            case "M":
                $ticket_id = "OU".$id;
                break;
            case "P3":
                $ticket_id = "P3".$id;
                break;
            default:
                $ticket_id = "DT".$id;
                break;
        }
        return $ticket_id;
    }

    /**
     * 注单入库
     * @param $_p
     * @param $st
     * @return array
     */
    public function insertAry($_p,$xml,$st){
        $wtype = $_p["wtype"];
        $golds = $_p['golds'];
        $gtype = $_p["gtype"];
        $rtype = $_p["rtype"];
        $gid   = $_p["gid"];
        $ioratios = $_p['ioratio'];
        $isRB = $_p['isRB']=="Y" ? "Y" : "N";
        $odd_f_type = empty($_p['odd_f_type']) ? "H" : $_p['odd_f_type'];

        $ioratio = $this->getXmlNode($xml, "ioratio");
        $ratio = $this->getXmlNode($xml,"ratio");
        $_strong = $this->getXmlNode($xml,"strong");
        $spread = $this->getXmlNode($xml, "spread");
        $important = $this->getXmlNode($xml,"important");
        $v_date = $this->getXmlNode($xml, "dates");
        $dg = $this->getXmlNode($xml,"dg");
        $dg = empty($dg) ? "N" : $dg;

        if (empty($v_date)) {$v_date = date('Y-m-d');}
        $isyesterday = isset($_p["isYesterday"]) ? $_p["isYesterday"] : "N";
        if($v_date<date("Y-m-d")){
            $isyesterday = "Y";
        }
        if (empty($ioratio)) {
            return ["code" => "555", "errormsg" => "1X013", "errorvalue" => ""];
        }

        if ($ioratio != $ioratios) {
            return ["code" => "555", "errormsg" => "1X005", "errorvalue" => $gid];
        }

        if ($ioratio <= 0 && $odd_f_type == 'H') {
            return ["code" => "555", "errormsg" => "1X013", "errorvalue" => ""];
        }

        $stAry = ["gidm","lid","datetime","league","league_tw","league_en","gnum_h","gnum_c","team_h","team_c","team_h_tw","team_c_tw","team_h_en","team_c_en","ptype_id","ptype","ptype_tw","ptype_en"];
        $insertAry = [];
        $ip = !empty($this->user["setip"]) ? $this->user["setip"] : $_SERVER['REMOTE_ADDR'];
        //主要参数插入
        $insertAry["gid"] = $gid;
        $insertAry["rb"] = $isRB;
        $insertAry["ecid"] = isset($st["ecid"]) ? $st["ecid"] : 0;
        $insertAry["gtype"] = $gtype;
        $insertAry["wtype"] = $wtype;
        $insertAry["rtype"] = $rtype;
        $insertAry["important"] = empty($important) ? "N" : $important;
        $insertAry["chose_team"] = $_p["chose_team"];
        $insertAry["odd_f_type"] = $odd_f_type;
        $insertAry["ltype"] = $this->user["ltype"];
        $insertAry["bet_time"] = time();
        $insertAry["bet_ip"] = $ip;
        $insertAry["ioratio"] = $ioratio;
        if(!empty($spread) || $spread == 0){ $insertAry["spread"] = $spread;}
        if(is_numeric($ratio)){$insertAry["ratio"] = $ratio;}
        $insertAry["strong"] = empty($_strong) ? "H" : $_strong;
        $insertAry["bet_golds"] = $_p['golds'];
        $insertAry["m_date"] = $v_date;
        if($gtype=="ES"){ 
            $insertAry["period_id"] = $st["period_id"];
            $insertAry["gametype"] = $st["gametype"];
            $insertAry["peid"] = $st["peid"];
            $insertAry["gamenum"] = $st["gamenum"];
        }
        //可赢金额计算
        $ug = new Util_game();
        //取得玩法語系
        if ($wtype=="T"){
            $_ary = ["EOO","EOE","HEOO","HEOE","EOH","EOC","HEOH","HEOC","ODD","RODD","EVEN","REVEN"];
            if(in_array($rtype, $_ary)){
                $wtype = "EO";
            }
            $showRtype = $wtype;
        } else if($wtype=="HT"){
            $_ary = ["HEVEN","HODD"];
            if(in_array($rtype, $_ary)){
                $wtype = "HEO";
            }
            $showRtype = $wtype;
        } else if($wtype=="RT"){
            $_ary = ["REVEN","RODD"];
            if(in_array($rtype, $_ary)){
                $wtype = "REO";
            }
            $showRtype = $wtype;
        }else if($wtype=="HRT"){
            $_ary = ["HREVEN","HRODD"];
            if(in_array($rtype, $_ary)){
                $wtype = "HREO";
            }
            $showRtype = $wtype;
        } else if ($wtype=="SP" || $ug->checkWtypeisSP($wtype)){
            $showRtype = substr($rtype,0,strlen($rtype)-1);
        } else{
            $showRtype = $wtype;
        }
        $showtype = "today";
        if($ug->isRBWtype($wtype) || $isRB=="Y"){
            $showtype = "live";
        }
        $insertAry["showtype"] = $showtype;
        $win_gold = $ug->calcWindGold($golds,$ioratio,$showRtype,$gtype,$odd_f_type);//做到此处，需要下注验证是否有效
        $this->conn = $this->getDefaultConn();
        $key = strtolower($this->getWtypeType($wtype,$rtype,$gtype));
        $max = $this->conn["dt_max"];
        if(isset($this->conn["{$key}_max"])){
            $max = $this->conn["{$key}_max"];
        }
        if($win_gold>$max){
            return ["code" => "555", "errormsg" => "1X020", "errorvalue" => $max];
        }
        $strong = "N";
        if ($_strong == "H") {
            if ($_p["chose_team"] == "H") {
                $strong = "Y";
            } else {
                $strong = "N";
            }
        } else {
            if ($_p["chose_team"] == "C") {
                $strong = "Y";
            } else {
                $strong = "N";
            }
        }
		if($isRB=="Y" || $dg == "Y"){
            $insertAry["danger"] = 1;
        }
        $insertAry["win_gold"] = $win_gold;
        //if($dg=="Y"){//是否需要滚球比分
        $score = $this->getXmlNode($xml,"score");
        if(!empty($score)){
            $insertAry["score"] = $score;
            $insertAry["dg"] = "Y";
            $insertAry["danger"] = 1;
            if($ug->checkWtypeIs15Min_RB($wtype) && is_numeric($st["score_h"])){ //15分钟滚球
                if($st["strong"] == "C"){
                    $insertAry["org_score"] = $st["score_h"].":".$st["score_c"];
                }else{
                    $insertAry["org_score"] = $st["score_c"].":".$st["score_h"];
                }
            }
        }
        //}
        //赛事内容插入
        foreach ($stAry as $v){
            if(!empty($st[$v])){
                $insertAry[$v] = $st[$v];
            }
        }
		
        $sup = $this->getSupData();
        $insertAry["currency"] = $this->user["currency"];
        $insertAry["hidden"] = $this->user["hidden"];
        $insertAry["nid"] = $this->user["nid"];
        $insertAry["pay_type"] = $this->user["pay_type"];
        $insertAry["m_name"] = $this->user["name"];
        $insertAry["ag_name"] = $sup["ag"]["name"];
        $insertAry["su_name"] = $sup["su"]["name"];
        $insertAry["co_name"] = $sup["co"]["name"];
        $insertAry["d0_name"] = $sup["d0"]["name"];
        $insertAry["ag_point"] = $sup["ag"]["winloss"];
        $insertAry["su_point"] = $sup["su"]["winloss"] - $sup["ag"]["winloss"];
        $insertAry["co_point"] = $sup["co"]["winloss"] - $sup["su"]["winloss"];
        $insertAry["d0_point"] = $sup["d0"]["winloss"] - $sup["co"]["winloss"];
        $insertAry["ms"] = $this->getXmlNode($xml,"ms");
        $insertAry["mem_turn_rate"] = $this->getTurnRate(json_decode($this->user["config"],true),$gtype,$rtype,$wtype);
        $insertAry["ag_turn_rate"] = $this->getTurnRate(json_decode($sup["ag"]["config"],true),$gtype,$rtype,$wtype);
        $insertAry["su_turn_rate"] = $this->getTurnRate(json_decode($sup["su"]["config"],true),$gtype,$rtype,$wtype);
        $insertAry["co_turn_rate"] = $this->getTurnRate(json_decode($sup["co"]["config"],true),$gtype,$rtype,$wtype);
        $insertAry["d0_turn_rate"] = $this->getTurnRate(json_decode($sup["d0"]["config"],true),$gtype,$rtype,$wtype);
        $key = $this->getWtypeType($wtype,$rtype,$gtype);
        $ticket_id = $this->setTicketID($key);
        $insertAry["ticket_id"] = $ticket_id;
        // if ($this->user['hidden'] == 1) {
        //           $insertAry["hidden"] = 1;
        // }
        $this->dbc->beginTransaction();
        try{
            $this->user = $this->chg_member_credit($this->user,true);
            $maxcredit = $this->user["balance_credit"];
            $this->dbc->insert($this->bet_table, $insertAry);
            BetMail::enqueue($this->dbc, $insertAry);//投注邮件通知入队(单场注单,内部自捕获异常,不影响投注)
            if($isyesterday == "Y" && $this->user['pay_type']!=1){//昨日赛事要 信用玩家
                $maxcredit = $this->user["credit"] - $this->usedCredit(Constant::MEM, $this->user["nid"], $isyesterday);
            }
            $havemoney = $maxcredit > 0 ? $maxcredit-$golds : 0;
            if (($isyesterday == "N" || $this->user['pay_type']==1) && $this->user['hidden'] == 0) {
                $up = [];
                $up = ["balance_credit" => $havemoney];
                if($this->user['pay_type']==1){ //现金
                    $up["credit"] = $havemoney;
                    //$this->set_credit_logs($this->user["nid"],0-$golds,$this->user["credit"],'下注');
                }
                $table = Constant::T_MEMBER;
                $this->dbc->update($table, $up, "`id`={$this->user["id"]}");
            }
            $this->insertLog("注单:{$ticket_id}下注成功");
            $this->dbc->commit();
            $arr = [
                "nowcredit" => $havemoney,
                "code" => 560,
                "ticket_id" => substr($ticket_id,2),
                "gid" => $gid,
                "gtype" => $_p["gtype"],
                "wtype" => $_p["wtype"],
                "rtype" => $_p["rtype"],
                "type" => $_p["chose_team"],
                "strong" => $strong,
                "ioratio" => $this->getXmlNode($xml, "ioratio"),
                "gold" => $golds,
                "concede" => $_p["con"],
                "ratio" => $_p["ratio"],
                "spread" => $this->getXmlNode($xml, "spread"),
                "date" => $this->getXmlNode($xml, "dates"),
                "time" => $this->getXmlNode($xml, "times"),
                "team_id_h" => $this->getXmlNode($xml, "team_id_h"),
                "team_id_c" => $this->getXmlNode($xml, "team_id_c"),
                "maxcredit" => $havemoney,
                "mid" => $this->user["id"],
                "username" => $this->user["name"],
                "mtype" => ltype_num($this->user["ltype"]),
                "league" => $this->getXmlNode($xml, "league_name"),
                "team_c" => $this->getXmlNode($xml, "team_name_c"),
                "team_h" => $this->getXmlNode($xml, "team_name_h"),
                "ball_act" => $dg,//$this->getXmlNode($xml,"ball_act"),
                "ms" => $this->getXmlNode($xml, "ms"),
                "timestamp" => $this->getXmlNode($xml, "timestamp"),
                "ptype" => $this->getXmlNode($xml, "ptype"),
                "imp" => $this->getXmlNode($xml, "important"),
                "systime" => date("Y-m-d"),
                "isyesterday" => $isyesterday,
                "score_h" => '',
                "score_c" => '',
                "score" => '',
            ];
			if($isRB=="Y" || $dg == "Y"){
                $arr["delaysec"] = 5;
            }
            if($gtype=="ES"){ 
                $arr["period"] = $st["period_id"];
                $arr["competitionext"] = $st["gametype"];
                $arr["peid"] = $st["peid"];
                $arr["gamenum"] = $st["gamenum"];
            }

            if (isset($score) && !empty($score)) {
                $scores = explode(":", $score);
                if(count($scores)==2){
                    $arr["score_h"] = trim($scores[0]);
                    $arr["score_c"] = trim($scores[1]);
                }

            }

            return $arr;
        }catch (\Exception $e){
            $this->dbc->rollback();
            return ["code" => "555", "errormsg" => $e->getMessage(), "errorvalue" => ""];
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
            "logintime"  => time(),
            "s_name" => $this->user["name"]
        ];
        $this->dbc->insert(Constant::T_CREDIT_LOG,$insert);
    }

    /**
     * 下注前验证
     * @param $xml
     * @return array
     */
    public function bet_check($xml, $_p)
    {
        $golds = $_p["golds"];
        $gold_gmax = $this->getXmlNode($xml, "gold_gmax");
        $gold_gmin = $this->getXmlNode($xml, "gold_gmin");
        $mem_sc = $this->getXmlNode($xml, "mem_sc");
        $dates = $this->getXmlNode($xml, "dates");
        if(empty($dates)){$dates=date("Y-m-d");}
        $isyesterday = isset($_p["isYesterday"]) ? $_p["isYesterday"] : "N";
        if($dates<date("Y-m-d")){
            $isyesterday = "Y";
        }
        $maxcredit = $this->user["balance_credit"];
        if ($this->user["pay_type"] == 0) { //信用玩家
            $maxcredit = $this->user["credit"] - $this->usedCredit(Constant::MEM, $this->user["nid"], $isyesterday);
            $maxcredit = $maxcredit > 0 ? $maxcredit : 0;
        }

        $arr = [
            'nowcredit' => $maxcredit,
            "code" => "555",
            'gtype' => $_p["gtype"],
            'gid' => $_p["gid"],
            'systime' => $dates,
            'isyesterday' => $isyesterday
        ];

        if ($golds > $maxcredit) { //余额不足
            $arr["errormsg"] = "1X012";
            $arr["errorvalue"] = "";
            return $arr;
        }

        if ($gold_gmin > $golds) {//最低下注金额
            $arr["errormsg"] = "1X004";
            $arr["errorvalue"] = $gold_gmin;
            return $arr;
        }

        if ($golds > $gold_gmax) {//单注最高限额
            $arr["errormsg"] = "1X018";
            $arr["errorvalue"] = $gold_gmax;
            return $arr;
        }

        $gid = $_p['gid'];
        $wtype = $_p['wtype'];
        $gtype = $_p["gtype"];
        $sum_bet_golds = 0;
        $m_name = $this->user["name"];
        $bt = $this->dbc->select("SELECT SUM(`bet_golds`) AS `sum_bet_golds` FROM {$this->bet_table} WHERE `gid`={$gid} AND `wtype`='{$wtype}' AND `gtype`='{$gtype}' AND `m_name`='{$m_name}'","Row");
        if($bt){
            $sum_bet_golds = $bt["sum_bet_golds"];
        }

        //单场最高限额
        if($sum_bet_golds+$golds>$mem_sc){
            $arr["errormsg"] = "1X018";
            $arr["errorvalue"] = $mem_sc;
            return $arr;
        }

        $arr["code"] = 560;
        return $arr;
    }

    /**
     * 滚球确认
     * @param false $isMember Y:指定会员，N:不指定会员
     * @return string
     */
    public function get_dangerous($isMember="Y"){
        global $dangerous_max_time,$dangerous_time;
        $_p = $this->param;
        $time = time();
        $t15 = $time - $dangerous_time;
        $t20 = $time - $dangerous_max_time;
        $where = "`rb`='Y' AND `dg`='Y'";
        if($isMember == "Y"){
            $where .= " AND `nid`='{$this->user["nid"]}'";
        }
		$lock_file = sys_get_temp_dir()."/dg_lock_".$_p["tid"];
		$handle = fopen($lock_file, "w+");
		if(!flock($handle, LOCK_EX | LOCK_NB)){
			fclose($handle);
			     $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
            $xml .= "<serverrequest>";
            $xml.= "<status>";
            $xml.= "<status_N></status_N>";
            $xml.= "<status_A>";
            $xml.= "</status_A>";
            $xml.= "<status_7></status_7>";
            $xml.= "<status_8></status_8>";
            $xml.= "<status_R></status_R>";
            $xml.= "</status>";
            $xml.= "<tickets><ticket id='{$_p["tid"]}'>A</ticket></tickets>";
            $xml.= "<nodata></nodata>";
			$xml.= "</serverrequest>";
			return $xml; 
		}
	  $randomNumber = $dangerous_max_time; // 抢跑修复(2026-11-01): 原 mt_rand(3,15) 无条件秒确认改为不早于自动确认窗口($dangerous_max_time, 默认35s), 给 updanger 守护留出 [CHECK_AFTER,35s] 进球比对窗口; 超35s仍 danger=1 的单由本行与下方 L3263 兜底确认 danger=3, 不卡单
  $this->dbc->execSql("update db_client.`bets` set `danger`=3  where danger=1 and isresult=0 and bet_time <=UNIX_TIMESTAMP(DATE_SUB(NOW(), INTERVAL {$randomNumber} SECOND)) ");


        /*超出($dangerous_max_time)秒未确认自动确认 */
        $up = ["dg" => "N","danger" => 3];
        $tid = "";
        $tidp3 = "";
        $xmm = "";
        if(!empty($_p["tid"]) && $isMember=="Y"){
            $tid = " AND SUBSTRING(`ticket_id`,2)<>'{$_p["tid"]}'";
            $xmm.= "<status>";
            $xmm.= "<status_N></status_N>";
            $xmm.= "<status_A></status_A>";
            $xmm.= "<status_7></status_7>";
            $xmm.= "<status_8></status_8>";
            $xmm.= "<status_R></status_R>";
            $xmm.= "</status>";
            $xmm.= "<tickets></tickets>";
            $xmm.= "<nodata>";
            $xmm.= "<ticket id='{$_p["tid"]}'>NODATA</ticket>";
            $xmm.= "</nodata>";
        }

        if(!empty($_p["p3_tid"]) && $isMember=="Y"){
            $tidp3 = " AND SUBSTRING(`ticket_id`,2)<>'{$_p["p3_tid"]}'";
            if(empty($_p["tid"])){
                $xmm.= "<status>";
                $xmm.= "<status_N></status_N>";
                $xmm.= "<status_A><ticket id='{$_p["p3_tid"]}'>A</ticket></status_A>";
                $xmm.= "<status_7></status_7>";
                $xmm.= "<status_8></status_8>";
                $xmm.= "<status_R></status_R>";
                $xmm.= "</status>";
                $xmm.= "<tickets><ticket id='{$_p["p3_tid"]}'>A</ticket></tickets>";
                $xmm.= "<nodata></nodata>";
            }

        }

        $this->dbc->update($this->bet_table,$up,"{$where} AND `bet_time`<{$t20} {$tid}");
        $this->dbc->update($this->bet_p3_table,$up,"{$where} AND `bet_time`<{$t20} {$tidp3}");

        $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        $xml .= "<serverrequest>";
        $where .= " AND `bet_time`<{$t15}";
        //print_R("SELECT `score`,`gtype`,`gid` FROM {$this->bet_table} WHERE {$where}");exit;
        $rs = $this->dbc->select("SELECT `score`,`gtype`,`gid` FROM {$this->bet_table} WHERE {$where}");
        $is = "N";
        if($rs){
            $is = "Y";
            $status = $this->set_dangerous($rs,$this->bet_table,$_p);
            switch ($status){
                case "A":
                    $xml.= "<status>";
                    $xml.= "<status_N></status_N>";
                    $xml.= "<status_A>";
                    $xml.= "<ticket id='{$_p["tid"]}'>A</ticket>";
                    $xml.= "</status_A>";
                    $xml.= "<status_7></status_7>";
                    $xml.= "<status_8></status_8>";
                    $xml.= "<status_R></status_R>";
                    $xml.= "</status>";
                    $xml.= "<tickets><ticket id='{$_p["tid"]}'>A</ticket></tickets>";
                    $xml.= "<nodata></nodata>";
                    break;
                case "R":
                    $xml.= "<status>";
                    $xml.= "<status_N></status_N>";
                    $xml.= "<status_A></status_A>";
                    $xml.= "<status_7></status_7>";
                    $xml.= "<status_8></status_8>";
                    $xml.= "<status_R><ticket id='{$_p["tid"]}'>R</ticket></status_R>";
                    $xml.= "</status>";
                    $xml.= "<tickets><ticket id='{$_p["tid"]}'>R</ticket></tickets>";
                    $xml.= "<nodata></nodata>";
                    break;
                default:
                    $xml.=$xmm;
                    break;
            }
        }else{
            $xml.=$xmm;
        }

        $rsp3 = $this->dbc->select("SELECT `score`,`gtype`,`gid` FROM {$this->bet_p3_table} WHERE {$where}");
        if($rsp3){
            $this->set_dangerous($rsp3,$this->bet_table,$_p);
        }
        if($isMember=="Y" && isset($_p["uni_key"])) {
            $xml .= "<uni_key>{$_p["uni_key"]}</uni_key>";
        }
		       $ticketnw_id = "OU".$_p["tid"];
        $dangermatch = $this->dbc->select("SELECT danger FROM db_client.`bets` WHERE ticket_id='{$ticketnw_id}'", "Row");
        if(!empty($dangermatch) && $dangermatch['danger'] == 3){
            $xml = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
            $xml .= "<serverrequest>";
            $xml.= "<status>";
            $xml.= "<status_N></status_N>";
            $xml.= "<status_A>";
            $xml.= "<ticket id='{$_p["tid"]}'>A</ticket>";
            $xml.= "</status_A>";
            $xml.= "<status_7></status_7>";
            $xml.= "<status_8></status_8>";
            $xml.= "<status_R></status_R>";
            $xml.= "</status>";
            $xml.= "<tickets><ticket id='{$_p["tid"]}'>A</ticket></tickets>";
            $xml.= "<nodata></nodata>";
        }
        $xml.= "</serverrequest>";
		
		  // 执行完解锁
		flock($handle, LOCK_UN);
		fclose($handle);
        return $xml;
    }

    /**
     * 确认注单入库
     * @param $rs
     * @param $bet_table
     * @param array $_p
     * @return string
     */
    public function set_dangerous($rs,$bet_table,$_p=[]){
        global $sport_tables;
        $m15 = ["ARE","AROU","ARM","BRE","BROU","BRM","CRE","CROU","CRM","DRE","DROU","DRM","ERE","EROU","ERM","FRE","FROU","FRM"];
        $status = "";
        $up = ["dg" => "N","danger" => 3];
        foreach ($rs as $k => $v){
            $table = $sport_tables[$v["gtype"]]["table"];
            $match = $this->dbc->select("SELECT `score_h`,`score_c`,`strong` FROM {$table} WHERE `gid`={$v["gid"]}","Row");
            $hr = ["FT","BS","OP"];
            if(in_array($v["gtype"],$hr)) {
                if (!$match) {
                    //上半查询
                    $match = $this->dbc->select("SELECT `score_h`,`score_c`,`hstrong` AS `strong` FROM {$table} WHERE `hgid`={$v["gid"]}", "Row");
                }
            }

            if(!$match){
                $this->dbc->update($bet_table,$up,"`ID`={$v["ID"]}");
                if(isset($_p["tid"]) && substr($v["ticket_id"],2) == $_p["tid"]){
                    $status = "A";
                }
            }else{
                $score = $match["score_h"].":".$match["score_c"];
                if($score!=":"){
                    if(isset($v["strong"]) && strtoupper($v["strong"])=="C"){
                        $score = $match["score_c"].":".$match["score_h"];
                    }
                    if(isset($v["wtype"]) && in_array($v["wtype"],$m15) && !empty($v["org_score"])){
                        $oscoreAry = explode(":",$v["org_score"]);
                        $scoreAry = explode(":",$score);
                        $score = abs($scoreAry[0]-$oscoreAry[0]).":".abs($scoreAry[1]-$oscoreAry[1]);
                    }

                    if($score == $v["score"]){
                        $up["danger"] = 2;
                        $up["status"] = 12;//取消注单
                        if(isset($_p["tid"]) && substr($v["ticket_id"],2) == $_p["tid"]){
                            $status = "A";
                        }
                    }else{
                        $up["danger"] = 3;
                        if(isset($_p["tid"]) && substr($v["ticket_id"],2) == $_p["tid"]){
                            $status = "R";
                        }
                    }

                    //$this->dbc->beginTransaction();
                    try{
                        if(isset($v["ID"])) {
                            $this->dbc->update($bet_table, $up, "`ID`={$v["ID"]}");
                            $up = [
                                //"status" => $m["status"],
                                "valid_gold" => 0,//有效金额
                                "mem_result" => 0,//输赢
                                "agent_result" => 0,
                                "ag_result" => 0,
                                "su_result" => 0,
                                "co_result" => 0,
                                "d0_result" => 0,
                                "cancel" => 1,
                                "isResult" => 1
                            ];
                            $this->dbc->update($this->bet_table, $up, "`ID`={$v["ID"]}");
                            $memTable = Constant::T_MEMBER;
                            //现金玩家退还额度
                            $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$v["bet_golds"]}),`balance_credit`=(`balance_credit`+{$v["bet_golds"]}) WHERE `nid`='{$v["nid"]}' AND `pay_type`=1";
                            $this->dbc->execSql($sql);
                            //$this->dbc->commit();
                        }
                    }catch (\Exception $e){
                        print_R($e->getMessage()."\n");
                        //$this->dbc->rollback();
                    }

                }
            }
        }

        return $status;
    }
}