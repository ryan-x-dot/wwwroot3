<?php


class Result
{
    protected $gtypeAry = [];
    protected $bet_table;
    protected $bet_p3_table;
    protected $dbc;
    protected $dbs;
    protected $ut;
    protected $isHGID = ["FT","BS","OP"];

    public function __construct()
    {
        global $sport_tables,$db_s,$db_c;
        $this->gtypeAry = $sport_tables;
        $this->bet_table = Constant::T_BET;
        $this->bet_p3_table = Constant::T_BET_P3;
        $this->dbc = $db_c;
        $this->dbs = $db_s;
        $this->ut = new Util_game();
    }

    /**
     * 冠军|最先/最后球员进球 结算
     * @param string $where
     * @return int
     */
    public function getBetFS($where=""){
        $num = 0;
        $bet = $this->dbc->select("SELECT * FROM {$this->bet_table} WHERE `isResult`=0 AND `wtype`='FS' {$where}");
        if($bet){
            $sfsTable = Constant::S_SP;
            foreach ($bet as $k => $v){
                $res = $this->dbc->select("SELECT * FROM {$sfsTable} WHERE `result`='Y' AND `gid`='{$v["gid"]}' AND `rtype`='{$v["rtype"]}'","Row");
                if($res){
                    if($res["win"] == "Y"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }

                    $wingold = 0;//输赢金额
                    $valid_gold = 0;//有效金额
                    $cancel = 0;//赛事是否取消
                    $mem_result = 0;//会员退水后输赢金额
                    $mem_win_gold = 0;//会员退水前输赢
                    $agent_result = 0;
                    $ag_result = 0;//代理结果
                    $su_result = 0;//总代结果
                    $co_result = 0;//股东结果
                    $d0_result = 0;//分公司结果

                    $isTurnBetGold = "N";//是否退还本金 Y:需要,N:不需要
                    switch ($sta) {
                        case "W"://赢
                            $wingold = $v["win_gold"];
                            $valid_gold = $wingold;
                            $isTurnBetGold = "Y";
                            break;
                        case "L"://输
                            $wingold = 0 - $v["bet_golds"];
                            $valid_gold = $v["bet_golds"];
                            break;
                    }
                    $mem_win_gold = $wingold;
                    $mem_turn_rate = $valid_gold * floatval($v["mem_turn_rate"]) / 100;//会员退水金额 = 有效金额*会员退水%
                    $mem_result = $wingold + $mem_turn_rate;//会员结果 = 输赢金额 + 会员退水金额
                    //print_r($mem_result);exit;
                    if ($mem_result > 0) { //赢表示还需要退还现金玩家的本金
                        $pay_gold = $v["bet_golds"] + $mem_result;
                    } else {
                        $pay_gold = $mem_turn_rate;
                    }
                    $agent_result = $mem_result + ($v["ag_turn_rate"] - $v["mem_turn_rate"]) * $valid_gold / 100;//上交金额 = 会员结果 + (代理商退水%-会员退水%)*有效金额
                    $ag_result = $agent_result * (100 - $v["ag_point"]) / 100; //代理结果 = 上级输赢 * (100-代理占成%)
                    //总代理结果 = 代理输赢*(100%-代理占成%-总代理占成%) + (总代退水% - 代理退水%)*有效金额
                    $su_result = $agent_result * (100 - $v["ag_point"] - $v["su_point"]) / 100 + ($v["su_turn_rate"] - $v["ag_turn_rate"]) * $valid_gold / 100;
                    //股东结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                    $co_result = $agent_result * (100 - $v["ag_point"] - $v["su_point"] - $v["co_point"]) / 100 + ($v["co_turn_rate"] - $v["su_turn_rate"]) * $valid_gold / 100;
                    //分公司结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                    $d0_result = $agent_result * (100 - $v["ag_point"] - $v["su_point"] - $v["co_point"] - $v["d0_point"]) / 100 + ($v["d0_turn_rate"] - $v["co_turn_rate"]) * $valid_gold / 100;

                    $up = [
                        "valid_gold" => round($valid_gold,4),//有效金额
                        "mem_result" => round($mem_result,4),//会员退水后输赢
                        "mem_win_gold" => round($mem_win_gold,4),//会员退水前输赢
                        "agent_result" => round($agent_result,4),
                        "ag_result" => round($ag_result,4),
                        "su_result" => round($su_result,4),
                        "co_result" => round($co_result,4),
                        "d0_result" => round($d0_result,4),
                        "inball" => "{$res["sfs_id"]}|{$res["sgid"]}",
                        "isResult" => 1,
                        "result" => $sta
                    ];
                    $this->dbc->update($this->bet_table,$up,"`ID`={$v["ID"]}");

                    if($pay_gold>0 && !empty($sta)){//现金玩家更新金额
                        $memTable = Constant::T_MEMBER;
                        $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$pay_gold}),`balance_credit`=(`balance_credit`+{$pay_gold}) WHERE `nid`='{$v["nid"]}' AND `pay_type`=1";
                        $this->dbc->execSql($sql);
                        //$this->set_credit_logs($v["nid"],$pay_gold, "冠军|最先/最后球员进球 结算");
                    }

                    $num++;
                }
            }
        }

        return $num;
    }

    /**
     * 入库现金额度记录日志
     * @param $nid
     * @param $cash 现金额度
     * @param $old_cash 旧额度
     */
    public function set_credit_logs($nid,$cash, $usertype = "结算"){
        $memTable = Constant::T_MEMBER;
        $mem = $this->dbc->select("SELECT * FROM {$memTable} WHERE `nid`='{$nid}' AND `pay_type`=1","Row");
        if($mem) {
            $insert = [
                "nid" => $nid,
                "type" => $cash > 0 ? "Y" : "N",
                "old_cash" => $mem["credit"],
                //"cash" => $cash,
                //"new_cash" => $mem["credit"] + $cash,
				"cash" => round($cash, 2),  // 只保留小数点后两位  
                "new_cash" => $mem["credit"] + round($cash, 2),
                "usertype" =>  $usertype,
                "logintime" => time(),
                "s_name" => $mem["name"]
            ];
            $this->dbc->insert(Constant::T_CREDIT_LOG, $insert);
        }
    }

    /**
     * 过关注单
     * @param string $where
     */
    public function getBetP3($where=""){
        $sql_p3 = "SELECT * FROM {$this->bet_table} WHERE `isResult`=0  AND `wtype`='P3' {$where}";
        $bet_p3 = $this->dbc->select($sql_p3);
        $num = 0;
        if($bet_p3) {
            foreach ($bet_p3 as $v){
                $sql = "SELECT `gid`,`gtype` FROM {$this->bet_p3_table} WHERE `isResult`=0 AND `danger` IN (0,3) AND `p3id`='{$v["ID"]}'";
                $bet = $this->dbc->select($sql);
                if($bet) {
                    $this->betResult($bet);
                }
                $num += $this->p3_Result($v);
            }
        }

        return $num;
    }

    /**
     * 过关注单结算入库
     * @param $b
     * @return int
     */
    public function p3_Result($b){
        $num = 0;
        $rs = $this->dbc->select("SELECT * FROM {$this->bet_p3_table} WHERE `p3id`='{$b["ID"]}'");
        if($rs){
            $isResultAll = "ok";
            $isWin = "W";
            $ior = 1;
            foreach ($rs as $v){
                if($v["isResult"] == 1){
                    switch ($v["result"]){
                        case "W":
                            $ior *= $v["ioratio"];
                            break;
                        case "HW":
                            $ior *= 1 + ($v["ioratio"] - 1)*0.5;
                            break;
                        case "L":
                            $isWin = "L";
                            break;
                        case "HL":
                            $ior *= 0.5;
                            break;
                    }

                }else{
                    $isResultAll = "no";
                }
            }
            
            if($isResultAll=="ok"){
                $this->dbc->beginTransaction();
                try{
                    if($isWin == "W"){
                        $wingold = $b["bet_golds"] * ($ior - 1);
                        $valid_gold = $wingold;
                    }else{
                        $wingold = 0 - $b["bet_golds"];
                        $valid_gold = $b["bet_golds"];
                    }
                    $mem_win_gold = $wingold;
                    //print_r($b["ID"]."--".$valid_gold."--".$b["mem_turn_rate"]);exit;
                    $mem_turn_rate = $valid_gold * floatval($b["mem_turn_rate"]) / 100;//会员退水金额 = 有效金额*会员退水%
                    $mem_result = $wingold + $mem_turn_rate;//会员结果 = 输赢金额 + 会员退水金额
                    if ($mem_result > 0) { //赢表示还需要退还现金玩家的本金
                        $pay_gold = $b["bet_golds"] + $mem_result;
                    } else {
                        $pay_gold = $mem_turn_rate;
                    }
					if($isWin == "W" && $mem_result < 0){
						    $pay_gold = $b["bet_golds"] + $mem_result;
					}

                    $agent_result = $mem_result + ($b["ag_turn_rate"] - $b["mem_turn_rate"]) * $valid_gold / 100;//上交金额 = 会员结果 + (代理商退水%-会员退水%)*有效金额
                    $ag_result = $agent_result * (100 - $b["ag_point"]) / 100; //代理结果 = 上级输赢 * (100-代理占成%)
                    //总代理结果 = 代理输赢*(100%-代理占成%-总代理占成%) + (总代退水% - 代理退水%)*有效金额
                    $su_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"]) / 100 + ($b["su_turn_rate"] - $b["ag_turn_rate"]) * $valid_gold / 100;
                    //股东结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                    $co_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"] - $b["co_point"]) / 100 + ($b["co_turn_rate"] - $b["su_turn_rate"]) * $valid_gold / 100;
                    //分公司结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                    $d0_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"] - $b["co_point"] - $b["d0_point"]) / 100 + ($b["d0_turn_rate"] - $b["co_turn_rate"]) * $valid_gold / 100;
                    $up = [
                        "valid_gold" => round($valid_gold,4),//有效金额
                        "mem_result" => round($mem_result,4),//会员退水后输赢
                        "mem_win_gold" => round($mem_win_gold,4),//会员退水前输赢
                        "agent_result" => round($agent_result,4),
                        "ag_result" => round($ag_result,4),
                        "su_result" => round($su_result,4),
                        "co_result" => round($co_result,4),
                        "d0_result" => round($d0_result,4),
                        "isResult" => 1,
                        "result" => $isWin=="W" ? "W" : "L"
                    ];
                    $this->dbc->update($this->bet_table,$up,"`ID`={$b["ID"]}");
                    if($pay_gold>0 && $b["pay_type"]==1) {//现金玩家更新金额
                        $memTable = Constant::T_MEMBER;
                        $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$pay_gold}),`balance_credit`=(`balance_credit`+{$pay_gold}) WHERE `nid`='{$b["nid"]}' AND `pay_type`=1";
                        $this->dbc->execSql($sql);
                        //$this->set_credit_logs($b["nid"], $pay_gold, "过关注单结算");
                    }
                    $this->dbc->commit();
                    $num = 1;
                }catch (\Exception $e){
                    print_r($e->getMessage());
                    print_r("\n");
                    $this->dbc->rollback();
                }

            }

        }

        return $num;
    }

    /**
     * 检测注单中存在队名为空，并且补上
     * @param string $betTableType
     */
    public function setBetLeagueNull($betTableType=""){
        $betTable = $this->bet_table;
        if(strtoupper($betTableType) == "P3"){
            $betTable = $this->bet_p3_table;
        }
        $where = "`league` IS NULL OR `league_tw` IS NULL OR `league_en` IS NULL OR `league`='' OR `league_tw`='' OR `league_en`=''";
        $sql = "SELECT `gid`,`gtype` FROM {$betTable} WHERE {$where} GROUP BY `gid`";
        $stmt = $this->dbc->select($sql);
        if($stmt){

            foreach ($stmt as $v){
                $gtype = strtoupper($v["gtype"]);
                $gid = $v["gid"];
                $table = $this->gtypeAry[$gtype]["table"];
                $m = $this->dbc->select("SELECT * FROM {$table} WHERE `gid`='{$gid}'","Row");
                if(!$m && in_array($gtype,$this->isHGID)) { //存在上半gid
                    $m = $this->dbc->select("SELECT * FROM {$table} WHERE `hgid`='{$gid}'","Row");
                }

                if($m){
                    $up = [
                        "league" => $m["league"],
                        "league_tw" => $m["league_tw"],
                        "league_en" => $m["league_en"],
                        "team_h" => $m["team_h"],
                        "team_c" => $m["team_c"],
                        "team_h_tw" => $m["team_h_tw"],
                        "team_c_tw" => $m["team_c_tw"],
                        "team_h_en" => $m["team_h_en"],
                        "team_c_en" => $m["team_c_en"],
                        "ptype" => $m["ptype"],
                        "ptype_tw" => $m["ptype_tw"],
                        "ptype_en" => $m["ptype_en"],
                        "ptype_id" => $m["ptype_id"],
                    ];

                    $this->dbc->update($betTable,$up,"`gid`='{$gid}'");
                }
            }
        }
    }

    /**
     * 普通注单结算
     * @param string $where
     * @return int
     */
    public function getBet($where=""){
        $sql = "SELECT `gid`,`gtype` FROM {$this->bet_table} WHERE `isResult`=0 AND `danger` IN (0,3) AND `wtype`<>'P3' {$where}";//未结算且已经确认的滚球
      
        $bet = $this->dbc->select($sql);
        $num = 0;
        if($bet) {
            $num = $this->betResult($bet);
        }

        //未通过的滚球注单结算
        $sql = "SELECT `ID`,`bet_golds`,`nid` FROM {$this->bet_table} WHERE `isResult`=0 AND `danger`=2 AND `wtype`<>'P3'";
        $bet3 = $this->dbc->select($sql);

        if($bet3){
            foreach ($bet3 as $v){
                $this->dbc->beginTransaction();
                try{
                    $up = [
                        //"status" => $m["status"],
                        "valid_gold" => 0,//有效金额
                        "mem_result" => 0,//会员退水后输赢
                        "mem_win_gold" => 0,//会员退水前输赢
                        "agent_result" => 0,
                        "ag_result" => 0,
                        "su_result" => 0,
                        "co_result" => 0,
                        "d0_result" => 0,
                        "status" => 12,//取消注单
                        "cancel" => 1,
                        "isResult" => 1,
                        "result" => "T"
                    ];
                    $this->dbc->update($this->bet_table,$up,"`ID`={$v["ID"]}");
                    $memTable = Constant::T_MEMBER;
                    $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$v["bet_golds"]}),`balance_credit`=(`balance_credit`+{$v["bet_golds"]}) WHERE `nid`='{$v["nid"]}' AND `pay_type`=1";
                    $this->dbc->execSql($sql);
                    $this->dbc->commit();
                }catch (\Exception $e){
                    print_r($e->getMessage());
                    print_r("\n");
                    $this->dbc->rollback();
                }
            }
        }
        return $num;
    }

    public function betResult($bet){
        $num = 0;
        $betGidAry = [];
        if($bet) {
            $betGidAry = $this->betGidAry($bet);
        }

        if(count($betGidAry)>0){
            foreach ($betGidAry as $gtype => $gids){
                $table = $this->gtypeAry[$gtype]["table"];

                foreach ($gids as $gid){
                    $match = $this->getMatch($table,$gid,$gtype);
                    // if($gtype=="ES"){ 
                    //     print_r($table.",".$gid);
                    //     print_r($match);exit;
                    // }
                    // if($gid=='8130697'){ 
                    //     print_r($match);exit;
                    // }
                    if(count($match)>0){
                    if($match["status"]>5 || (isset($match["inball_more"]) && !empty($match["inball_more"]) && strpos($match["inball_more"], "赛事腰斩") !== false)) {//非正常投注
                            $up_p3 = [
                                "status" => $match["status"],
                                "isResult" => 1,
                                "cancel" => 1,
                                "result" => "T"
                            ];
                            $this->dbc->update($this->bet_p3_table,$up_p3,"`gid`={$gid}");//串关表处理


							$betslist = $this->dbc->select("SELECT * FROM {$this->bet_table} WHERE `gid`={$match["gid"]} AND `isResult`=0");
                            
                            if($betslist){
                                foreach ($betslist as $v){
                                    $pay_gold = $v["bet_golds"];
									if($pay_gold>0 ){//现金玩家更新金额
										$memTable = Constant::T_MEMBER;
										$sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$pay_gold}),`balance_credit`=(`balance_credit`+{$pay_gold}) WHERE `nid`='{$v["nid"]}' AND `pay_type`=1 ";
										//$this->set_credit_logs($v["nid"],$pay_gold, "非正常投注 结算");
										$this->dbc->execSql($sql);
									}
                                }
                            }
                            //单注处理
                            $up = [
                                "status" => $match["status"],
                                "valid_gold" => 0,//有效金额
                                "mem_result" => 0,//退水后输赢
                                "mem_win_gold" => 0,//退水前输赢
                                "agent_result" => 0,
                                "ag_result" => 0,
                                "su_result" => 0,
                                "co_result" => 0,
                                "d0_result" => 0,
                                "cancel" => 1,
                                "isResult" => 1,
                                "result" => "T"
                            ];
                            $this->dbc->update($this->bet_table,$up,"`gid`={$gid}");
                        }else{
                            $bets = $this->dbc->select("SELECT * FROM {$this->bet_table} WHERE `gid`={$match["gid"]} AND `isResult`=0");
                            
                            if($bets){
                                foreach ($bets as $v){
                                    $sta =  $this->Result($match,$v);
                                    
                                    if($sta["status"] == "ok"){
                                        $num++;
                                    }elseif($sta["status"] == "error"){
                                        print_r($sta["msg"]);
                                    }
                                }
                            }
                            //过关注单 - 单注结算
                            $betp3 = $this->dbc->select("SELECT * FROM {$this->bet_p3_table} WHERE `gid`={$match["gid"]} AND `isResult`=0");
                            if($betp3){

                                foreach ($betp3 as $v){
                                    $sta =  $this->Result($match,$v,"p3");
                                    if($sta["status"] == "ok"){
                                        $num++;
                                    }elseif($sta["status"] == "error"){
                                        print_r($sta["msg"]);
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }

        return $num;
    }

    /**
     * 普通注单结算
     * @param string $where
     * @return int
     */
    public function getBetByBanchang($where=""){
        $sql = "SELECT `gid`,`gtype` FROM {$this->bet_table} WHERE `isResult`=0 AND `danger` IN (0,3) and`gtype`='FT' and wtype in ('HROU','HRE','HRM','HRPD','HRT','HRUH') ";//未结算且已经确认的滚球
      
        $bet = $this->dbc->select($sql);
        $num = 0;
        if($bet) {
            $num = $this->betResultbanchang($bet);
        }
        return $num;
    }
	
    public function betResultbanchang($bet){
        $num = 0;
        $betGidAry = [];
        if($bet) {
            $betGidAry = $this->betGidAry($bet);
        }

        if(count($betGidAry)>0){
            foreach ($betGidAry as $gtype => $gids){
                $table = $this->gtypeAry[$gtype]["table"];

                foreach ($gids as $gid){
                    $match = $this->getMatchbanchang($table,$gid,$gtype);
              
                    if(count($match)>0){
						if($match["status"]>5 || (isset($match["inball_more"]) && !empty($match["inball_more"]) && strpos($match["inball_more"], "赛事腰斩") !== false)) {//非正常投注
							  $num = 0;
							}else{
								$bets = $this->dbc->select("SELECT * FROM {$this->bet_table} WHERE `gid`={$match["gid"]} AND `isResult`=0 AND `danger` IN (0,3) and`gtype`='FT' and wtype in ('HROU','HRE','HRM','HRPD','HRT','HRUH') ");
								
								if($bets){
									foreach ($bets as $v){
										$sta =  $this->Result($match,$v);
										// if($gid=='8130697'){ 
										//     print_r($sta);exit;
										// }
										if($sta["status"] == "ok"){
											$num++;
										}elseif($sta["status"] == "error"){
											print_r($sta["msg"]);
										}
									}
								}
							}

                    }
                }
            }
        }

        return $num;
    }
	 public function getMatchbanchang($table,$gid,$gtype="FT",$isLiveInball="N"){
        $filed = "`strong`,`status`";
				$where = " AND `is_hr_inball`=1 and is_inball = 0";
         $filed .= ",`inball_h`,`inball_c`,`inball_h_hr`,`inball_c_hr`,`inball_more`,`is_inball`";
        // print_r("SELECT `gid`,`strong`,{$filed} FROM {$table} WHERE `gid`='{$gid}' {$where}\n");exit;
        $r = $this->dbs->select("SELECT `gid`,`strong`,{$filed} FROM {$table} WHERE `gid`='{$gid}' {$where}","Row");
        if(!$r && in_array($gtype,$this->isHGID)){ //存在上半gid
            if (strtoupper($gtype) == 'FT') {//足球半场结算
                $r = $this->dbs->select("SELECT `hgid` AS `gid`,`hstrong` AS `strong`,`m_time`,{$filed},`status`,`datetime`,`score_h`,`score_c`,`is_hr_inball` FROM {$table} WHERE `hgid`='{$gid}'","Row");
                if ($r) {
                    $ditime = time() - $r['datetime'];
                    if ((substr($r['m_time'],0,2) == 'HT' || substr($r['m_time'],0,2) == '2H' || $ditime > 3300) && $r['is_hr_inball']==0) {
                        $r['inball_h'] = $r['inball_h_hr'];
                        $r['inball_c'] = $r['inball_c_hr'];
                    }
                }
            }else{
                $r = $this->dbs->select("SELECT `hgid` AS `gid`,`hstrong` AS `strong`,{$filed} FROM {$table} WHERE `hgid`='{$gid}'","Row");
            }
        }


        if(!$r){
            $r = [];
        }

        return $r;
    }

    /**
     * 赛事查询
     * @param $table
     * @param $gid
     * @param string $gtype
     * @param string $isLiveInball 滚球是否结束，Y:未结束,N:结束
     * @return array|null
     */
    public function getMatch($table,$gid,$gtype="FT",$isLiveInball="N"){
        $filed = "`strong`,`status`";
        if($isLiveInball=="N"){
            $where = " AND `is_inball`=1";
            if(in_array($gtype,$this->isHGID)) {
                $filed .= ",`inball_h`,`inball_c`,`inball_h_hr`,`inball_c_hr`,`inball_more`,`is_inball`";
            }else{
                $filed .= ",`inball_h`,`inball_c`,`inball_more`,`is_inball`";
            }
        }else{
            $where = " AND `score_h` >= 0";
            $filed .= "`score_h` AS `inball_h`,`score_c` AS `inball_c`,`is_inball`";
        }
        // print_r("SELECT `gid`,`strong`,{$filed} FROM {$table} WHERE `gid`='{$gid}' {$where}\n");exit;
        $r = $this->dbs->select("SELECT `gid`,`strong`,{$filed} FROM {$table} WHERE `gid`='{$gid}' {$where}","Row");
        if(!$r && in_array($gtype,$this->isHGID)){ //存在上半gid
            if (strtoupper($gtype) == 'FT') {//足球半场结算
                $r = $this->dbs->select("SELECT `hgid` AS `gid`,`hstrong` AS `strong`,`m_time`,{$filed},`status`,`datetime`,`score_h`,`score_c`,`is_hr_inball` FROM {$table} WHERE `hgid`='{$gid}'","Row");
                if ($r) {
                    $ditime = time() - $r['datetime'];
                    if ((substr($r['m_time'],0,2) == 'HT' || substr($r['m_time'],0,2) == '2H' || $ditime > 3300) && $r['is_hr_inball']==0) {
                        $r['inball_h'] = $r['inball_h_hr'];
                        $r['inball_c'] = $r['inball_c_hr'];
                    }
                }
            }else{
                $r = $this->dbs->select("SELECT `hgid` AS `gid`,`hstrong` AS `strong`,{$filed} FROM {$table} WHERE `hgid`='{$gid}'","Row");
            }
        }


        if(!$r){
            $r = [];
        }

        return $r;
    }

    /**
     * 归类注单的GID
     * @param $bet
     * @return array
     */
    public function betGidAry($bet){
        $betGidAry = [];
        if($bet){
            foreach ($bet as $v){
                if(!isset($betGidAry[$v["gtype"]])){
                    $betGidAry[$v["gtype"]] = [];
                }
                if(!in_array($v["gid"],$betGidAry[$v["gtype"]])) {
                    $betGidAry[$v["gtype"]][] = $v["gid"];
                }
            }

        }

        return $betGidAry;
    }




    /**
     * 注单结算
     * @param $m
     * @param $b
     * @param string $betType
     * @return array|mixed|string[]
     */
    public function Result($m,$b,$betType="bet"){
        $num = 0;
        $sta = "";//T:退还,W:赢,L:输,HW:赢一半,HL:输一半
        $up = [];
        $betType = strtolower($betType);
        $this->dbc->beginTransaction();
        try{
            $pay_gold = 0;//现金额度
			$ballH_new = $m["inball_h"];
            $ballC_new = $m["inball_c"];
            $score_new = $b["score"];
            if (!empty($score_new) && is_numeric($ballH_new) && is_numeric($ballC_new)) {
                $scoreAry_new = explode(":", $score_new);
                if (count($scoreAry_new) == 2 && is_numeric($scoreAry_new[0]) && is_numeric($scoreAry_new[1])) {
                    $yuanlaibifen = $scoreAry_new[0]+$scoreAry_new[1];
                    $saishibifen = $ballH_new + $ballC_new ;
                    if($yuanlaibifen > $saishibifen){
                        $m["status"] = 23;
                    }
                }
            }
            if($m["status"]>0){//非正常投注
                if($betType=="bet"){
                    $up = [
                        "status" => $m["status"],
                        "valid_gold" => 0,//有效金额
                        "mem_result" => 0,//退水后输赢
                        "mem_win_gold" => 0,//退水前输赢
                        "agent_result" => 0,
                        "ag_result" => 0,
                        "su_result" => 0,
                        "co_result" => 0,
                        "d0_result" => 0,
                        "cancel" => 1,
                        "isResult" => 1,
                        "result" => "T"
                    ];
                    $this->dbc->update($this->bet_table,$up,"`ID`={$b["ID"]}");
                }else{
                    $up = [
                        "status" => $m["status"],
                        "isResult" => 1,
                        "cancel" => 1,
                        "result" => "T"
                    ];
                    $this->dbc->update($this->bet_p3_table,$up,"`ID`={$b["ID"]}");
                }
                $pay_gold = $b["bet_golds"];
                $sta = "T";//退还
            }else {
                $inball = "";
                $ballH = $m["inball_h"];
                $ballC = $m["inball_c"];
                $ballH_hr = "";
                $ballC_hr = "";
                if (isset($m["inball_h_hr"]) && isset($m["inball_c_hr"])) {
                    $ballH_hr = $m["inball_h_hr"];
                    $ballC_hr = $m["inball_c_hr"];
                }
                $more = [];
                $rs_more = [];
                if (!empty($m["inball_more"])) {
                    $more = unserialize($m["inball_more"]);
                    $rs_more = isset($more["rs_more"]) ? $more["rs_more"] : "";
                }
                $rtype = strtoupper($b["rtype"]);
                $spread = $b["spread"];
                $strong = strtoupper($b["strong"]);
                $wtype = strtoupper($b["wtype"]);
                $gtype = strtoupper($b["gtype"]);
                $score = $b["score"];
                $chose_team = strtoupper($b["chose_team"]);

                switch ($wtype) {
                    /*独赢类 - 开始*/
                    case "M":
                    case "RM":
                    case "MX":
                    case "RFA01":
                    case "RFA02":
                    case "RFA03":
                    case "RFA04":
                    case "RFA05":
                    case "RFA06":
                    case "RFA07":
                    case "RFA08":
                    case "RFA09":
                    case "RFA10":
                    case "RFA11":
                    case "RFA12":
                    case "RFA13":
                    case "RFB01":
                    case "RFB02":
                    case "RFB03":
                    case "RFB04":
                    case "RFB05":
                    case "RFB06":
                    case "RFB07":
                    case "RFB08":
                    case "RFB09":
                    case "RFB10":
                    case "RFB11":
                    case "RFB12":
                    case "RFB13":
                    case "RFC01":
                    case "RFC02":
                    case "RFC03":
                    case "RFC04":
                    case "RFC05":
                    case "RFC06":
                    case "RFC07":
                    case "RFC08":
                    case "RFC09":
                    case "RFC10":
                    case "RFC11":
                    case "RFC12":
                    case "RFC13":
                    case "RFC14":
                    case "RFC15":
                    case "RFC16":
                    case "RFC17":
                    case "RFC18":
                    case "RFC19":
                    case "RFC20":
                    case "RFC21":
                    case "RFC22":
                    case "RFC23":
                    case "RFC24":
                    case "RFC25":
                    case "RFC26":
                    case "RFC27":
                    case "RFC28":
                    case "RFC29":
                    case "RFC30":
                    case "RFC31":
                    case "RFC32":
                    case "RFC33":
                    case "RFC34":
                    case "RFC35":
                    case "RFC36":
                    case "RFC37":
                    case "RFC38":
                    case "RFC39":
                    case "RFC40":
                    case "RFC41":
                    case "RFC42":
                    case "RFC43":
                    case "RFC44":
                    case "RFC45":
                    case "RFC46":
                    case "RFC47":
                    case "RFC48":
                    case "RFC49":
                    case "RFC50":
                    case "RFD01":
                    case "RFD02":
                    case "RFD03":
                    case "RFD04":
                    case "RFD05":
                    case "RFD06":
                    case "RFD07":
                    case "RFD08":
                    case "RFD09":
                    case "RFD10":
                    case "RFD11":
                    case "RFD12":
                    case "RFD13":
                    case "RFE01":
                    case "RFE02":
                    case "RFE03":
                    case "RFE04":
                    case "RFE05":
                    case "RFE06":
                    case "RFE07":
                    case "RFE08":
                    case "RFE09":
                    case "RFE10":
                    case "RFE11":
                    case "RFE12":
                    case "RFE13":
                    case "RFE14":
                    case "RFE15":
                    case "RFE16":
                    case "RFE17":
                    case "RFE18":
                    case "RFE19":
                    case "RFE20":
                    case "RFE21":
                    case "RFE22":
                    case "RFE23":
                    case "RFE24":
                    case "RFE25":
                    case "RFE26":
                    case "RFE27":
                    case "RFE28":
                    case "RFE29":
                    case "RFE30":
                    case "RFE31":
                    case "RFE32":
                    case "RFE33":
                    case "RFE34":
                    case "RFE35":
                    case "RFE36":
                    case "RFE37":
                    case "RFE38":
                    case "RFE39":
                    case "RFE40":
                    case "RFE41":
                    case "RFE42":
                    case "RFE43":
                    case "RFE44":
                    case "RFE45":
                    case "RFE46":
                    case "RFE47":
                    case "RFE48":
                    case "RFE49":
                    case "RFE50":
                    case "RGAA01":
                    case "RGAA02":
                    case "RGAA03":
                    case "RGAA04":
                    case "RGAA05":
                    case "RGAA06":
                    case "RGAA07":
                    case "RGAA08":
                    case "RGAA09":
                    case "RGAA10":
                    case "RGAA11":
                    case "RGAA12":
                    case "RGAA13":
                    case "RGAB01":
                    case "RGAB02":
                    case "RGAB03":
                    case "RGAB04":
                    case "RGAB05":
                    case "RGAB06":
                    case "RGAB07":
                    case "RGAB08":
                    case "RGAB09":
                    case "RGAB10":
                    case "RGAB11":
                    case "RGAB12":
                    case "RGAB13":
                    case "RGAC01":
                    case "RGAC02":
                    case "RGAC03":
                    case "RGAC04":
                    case "RGAC05":
                    case "RGAC06":
                    case "RGAC07":
                    case "RGAC08":
                    case "RGAC09":
                    case "RGAC10":
                    case "RGAC11":
                    case "RGAC12":
                    case "RGAC13":
                    case "RGAC14":
                    case "RGAC15":
                    case "RGAC16":
                    case "RGAC17":
                    case "RGAC18":
                    case "RGAC19":
                    case "RGAC20":
                    case "RGAC21":
                    case "RGAC22":
                    case "RGAC23":
                    case "RGAC24":
                    case "RGAC25":
                    case "RGAC26":
                    case "RGAC27":
                    case "RGAC28":
                    case "RGAC29":
                    case "RGAC30":
                    case "RGAC31":
                    case "RGAC32":
                    case "RGAC33":
                    case "RGAC34":
                    case "RGAC35":
                    case "RGAC36":
                    case "RGAC37":
                    case "RGAC38":
                    case "RGAC39":
                    case "RGAC40":
                    case "RGAC41":
                    case "RGAC42":
                    case "RGAC43":
                    case "RGAC44":
                    case "RGAC45":
                    case "RGAC46":
                    case "RGAC47":
                    case "RGAC48":
                    case "RGAC49":
                    case "RGAC50":
                    case "RGAD01":
                    case "RGAD02":
                    case "RGAD03":
                    case "RGAD04":
                    case "RGAD05":
                    case "RGAD06":
                    case "RGAD07":
                    case "RGAD08":
                    case "RGAD09":
                    case "RGAD10":
                    case "RGAD11":
                    case "RGAD12":
                    case "RGAD13":
                    case "RGAE01":
                    case "RGAE02":
                    case "RGAE03":
                    case "RGAE04":
                    case "RGAE05":
                    case "RGAE06":
                    case "RGAE07":
                    case "RGAE08":
                    case "RGAE09":
                    case "RGAE10":
                    case "RGAE11":
                    case "RGAE12":
                    case "RGAE13":
                    case "RGAE14":
                    case "RGAE15":
                    case "RGAE16":
                    case "RGAE17":
                    case "RGAE18":
                    case "RGAE19":
                    case "RGAE20":
                    case "RGAE21":
                    case "RGAE22":
                    case "RGAE23":
                    case "RGAE24":
                    case "RGAE25":
                    case "RGAE26":
                    case "RGAE27":
                    case "RGAE28":
                    case "RGAE29":
                    case "RGAE30":
                    case "RGAE31":
                    case "RGAE32":
                    case "RGAE33":
                    case "RGAE34":
                    case "RGAE35":
                    case "RGAE36":
                    case "RGAE37":
                    case "RGAE38":
                    case "RGAE39":
                    case "RGAE40":
                    case "RGAE41":
                    case "RGAE42":
                    case "RGAE43":
                    case "RGAE44":
                    case "RGAE45":
                    case "RGAE46":
                    case "RGAE47":
                    case "RGAE48":
                    case "RGAE49":
                    case "RGAE50":
                    case "RGOUA01":
                    case "RGOUA02":
                    case "RGOUA03":
                    case "RGOUA04":
                    case "RGOUA05":
                    case "RGOUA06":
                    case "RGOUA07":
                    case "RGOUA08":
                    case "RGOUA09":
                    case "RGOUA10":
                    case "RGOUA11":
                    case "RGOUA12":
                    case "RGOUA13":
                    case "RGOUB01":
                    case "RGOUB02":
                    case "RGOUB03":
                    case "RGOUB04":
                    case "RGOUB05":
                    case "RGOUB06":
                    case "RGOUB07":
                    case "RGOUB08":
                    case "RGOUB09":
                    case "RGOUB10":
                    case "RGOUB11":
                    case "RGOUB12":
                    case "RGOUB13":
                    case "RGOUC01":
                    case "RGOUC02":
                    case "RGOUC03":
                    case "RGOUC04":
                    case "RGOUC05":
                    case "RGOUC06":
                    case "RGOUC07":
                    case "RGOUC08":
                    case "RGOUC09":
                    case "RGOUC10":
                    case "RGOUC11":
                    case "RGOUC12":
                    case "RGOUC13":
                    case "RGOUC14":
                    case "RGOUC15":
                    case "RGOUC16":
                    case "RGOUC17":
                    case "RGOUC18":
                    case "RGOUC19":
                    case "RGOUC20":
                    case "RGOUC21":
                    case "RGOUC22":
                    case "RGOUC23":
                    case "RGOUC24":
                    case "RGOUC25":
                    case "RGOUC26":
                    case "RGOUC27":
                    case "RGOUC28":
                    case "RGOUC29":
                    case "RGOUC30":
                    case "RGOUC31":
                    case "RGOUC32":
                    case "RGOUC33":
                    case "RGOUC34":
                    case "RGOUC35":
                    case "RGOUC36":
                    case "RGOUC37":
                    case "RGOUC38":
                    case "RGOUC39":
                    case "RGOUC40":
                    case "RGOUC41":
                    case "RGOUC42":
                    case "RGOUC43":
                    case "RGOUC44":
                    case "RGOUC45":
                    case "RGOUC46":
                    case "RGOUC47":
                    case "RGOUC48":
                    case "RGOUC49":
                    case "RGOUC50":
                    case "RGOUD01":
                    case "RGOUD02":
                    case "RGOUD03":
                    case "RGOUD04":
                    case "RGOUD05":
                    case "RGOUD06":
                    case "RGOUD07":
                    case "RGOUD08":
                    case "RGOUD09":
                    case "RGOUD10":
                    case "RGOUD11":
                    case "RGOUD12":
                    case "RGOUD13":
                    case "RGOUE01":
                    case "RGOUE02":
                    case "RGOUE03":
                    case "RGOUE04":
                    case "RGOUE05":
                    case "RGOUE06":
                    case "RGOUE07":
                    case "RGOUE08":
                    case "RGOUE09":
                    case "RGOUE10":
                    case "RGOUE11":
                    case "RGOUE12":
                    case "RGOUE13":
                    case "RGOUE14":
                    case "RGOUE15":
                    case "RGOUE16":
                    case "RGOUE17":
                    case "RGOUE18":
                    case "RGOUE19":
                    case "RGOUE20":
                    case "RGOUE21":
                    case "RGOUE22":
                    case "RGOUE23":
                    case "RGOUE24":
                    case "RGOUE25":
                    case "RGOUE26":
                    case "RGOUE27":
                    case "RGOUE28":
                    case "RGOUE29":
                    case "RGOUE30":
                    case "RGOUE31":
                    case "RGOUE32":
                    case "RGOUE33":
                    case "RGOUE34":
                    case "RGOUE35":
                    case "RGOUE36":
                    case "RGOUE37":
                    case "RGOUE38":
                    case "RGOUE39":
                    case "RGOUE40":
                    case "RGOUE41":
                    case "RGOUE42":
                    case "RGOUE43":
                    case "RGOUE44":
                    case "RGOUE45":
                    case "RGOUE46":
                    case "RGOUE47":
                    case "RGOUE48":
                    case "RGOUE49":
                    case "RGOUE50":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getM($ballH, $ballC, $rtype);
                        }
                        break;
                    case "HM":
                    case "HRM":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getM($ballH_hr, $ballC_hr, $rtype);
                        }
                        break;
                    /*15分钟 独赢 - 开始*/
                    case "AM":
                    case "ARM":
                        if (isset($more["AGMH"]) && isset($more["AGMC"]) && is_numeric($more["AGMH"]) && is_numeric($more["AGMC"])) {
                            $h = $more["AGMH"];
                            $c = $more["AGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    case "BM":
                    case "BRM":
                        if (isset($more["BGMH"]) && isset($more["BGMC"]) && is_numeric($more["BGMH"]) && is_numeric($more["BGMC"])) {
                            $h = $more["BGMH"];
                            $c = $more["BGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    case "CM":
                    case "CRM":
                        if (isset($more["CGMH"]) && isset($more["CGMC"]) && is_numeric($more["CGMH"]) && is_numeric($more["CGMC"])) {
                            $h = $more["CGMH"];
                            $c = $more["CGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    case "DM":
                    case "DRM":
                        if (isset($more["DGMH"]) && isset($more["DGMC"]) && is_numeric($more["DGMH"]) && is_numeric($more["DGMC"])) {
                            $h = $more["DGMH"];
                            $c = $more["DGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    case "EM":
                    case "ERM":
                        if (isset($more["EGMH"]) && isset($more["EGMC"]) && is_numeric($more["EGMH"]) && is_numeric($more["EGMC"])) {
                            $h = $more["EGMH"];
                            $c = $more["EGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    case "FM":
                    case "FRM":
                        if (isset($more["FGMH"]) && isset($more["FGMC"]) && is_numeric($more["FGMH"]) && is_numeric($more["FGMC"])) {
                            $h = $more["FGMH"];
                            $c = $more["FGMC"];
                            $inball = $h . ":" . $c;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    /*15分钟 独赢 - 结束*/

                    case "MG"://最多进球的半场 - 独赢
                    case "RMG":
                    case "HG":
                    case "RHG":
                        if (is_numeric($ballH) && is_numeric($ballC)
                            && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $h = $ballH_hr + $ballC_hr;//上半场
                            $c = $ballH + $ballC - $h;//下半场
                            $inball = $ballH.":".$ballC."@".$ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getM($h, $c, $rtype);
                        }
                        break;
                    /*独赢类 - 结束*/

                    /*让球类 - 开始*/
                    case "R":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $ballC . ":" . $ballH;
                            }*/
                            $sta = $this->getR($ballH, $ballC,$strong,$rtype,$spread);
                        }
                        break;
                    case "HR":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $ballC_hr . ":" . $ballH_hr;
                            }*/
                            $sta = $this->getR($ballH_hr, $ballC_hr,$strong,$rtype,$spread);
                        }
                        break;
                    case "RE":
                        if(empty($score) && $gtype<>"FT"){
                            $score = "0:0";
                        }
						if(in_array($gtype, ['BM', 'TN', 'VB', 'TT'])){
                            $gameNum = 0;
                            $gnumPrefix = isset($b["gnum_h"]) ? intval(substr($b["gnum_h"], 0, 1)) : 0;
                            switch ($gtype) {
                                case "BM":
                                case "TT":
                                    if($gnumPrefix >= 2 && $gnumPrefix <= 8){
                                        $gameNum = $gnumPrefix - 1;
                                    }
                                    break;
                                case "TN":
                                case "VB":
                                    if($gnumPrefix >= 3 && $gnumPrefix <= 9){
                                        $gameNum = $gnumPrefix - 2;
                                    }
                                    break;
                            }
                            if($gameNum == 0 && preg_match('/^(REH|REC|RE)(\d+)$/', $rtype, $matches)){
                                $gameNum = intval($matches[2]);
                            }
                            $gameScoreKey = "GMH".$gameNum;
                            if($gameNum > 0 && isset($more[$gameScoreKey]["result_h"]) && isset($more[$gameScoreKey]["result_c"])){
                                $ballH = $more[$gameScoreKey]["result_h"];
                                $ballC = $more[$gameScoreKey]["result_c"];
                            }
                        }
                        if (!empty($score) && is_numeric($ballH) && is_numeric($ballC)) {
                            $scoreAry = explode(":", $score);
                            if (count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                                /*switch ($strong) {
                                    case "H":*/
                                $h = $ballH - $scoreAry[0];
                                $c = $ballC - $scoreAry[1];
                                /*        break;
                                    default://主客交换比分
                                        $h = $ballC - $scoreAry[0];
                                        $c = $ballH - $scoreAry[1];
                                        break;
                                }*/
                                $inball = $ballH . ":" . $ballC;
                                /*if(strtoupper($strong) == "C") {
                                    $inball = $ballC . ":" . $ballH;
                                }*/

                                $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                            }

                        }
                        if($m["is_inball"] == 1 && $ballH == -1 && $ballC==-1){
                            //无比赛，注单退回
                            $sta = "T";
                        }
                        break;
                    case "HRE":

                        if(empty($score) && $gtype<>"FT"){
                            $score = "0:0";
                        }
                        if($gtype=="FT" && empty($score)){
                            $score = "0:0";
                        }
                        if (!empty($score) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $scoreAry = explode(":", $score);
                            if (count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                                /*switch ($strong) {
                                    case "H":*/
                                $h = $ballH_hr - $scoreAry[0];
                                $c = $ballC_hr - $scoreAry[1];
                                /*    break;
                                default://主客交换比分
                                    $h = $ballC_hr - $scoreAry[0];
                                    $c = $ballH_hr - $scoreAry[1];
                                    break;
                            }*/
                                $inball = $ballH_hr . ":" . $ballC_hr;
                                /*if(strtoupper($strong) == "C") {
                                    $inball = $ballC_hr . ":" . $ballH_hr;
                                }*/
                                $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                                //print_r($sta);exit;
                            }

                        }
                        break;
                    /*15分钟 让球 - 开始*/
                    case "AR":
                        if (isset($more["AGMH"]) && isset($more["AGMC"]) && is_numeric($more["AGMH"]) && is_numeric($more["AGMC"])) {
                            $h = $more["AGMH"];
                            $c = $more["AGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "ARE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["AGMH"]) && isset($more["AGMC"])
                            && is_numeric($more["AGMH"]) && is_numeric($more["AGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            $h = $more["AGMH"] - $scoreAry[0];
                            $c = $more["AGMC"] - $scoreAry[1];
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["AGMH"] - $scoreAry[0];
                                    $c = $more["AGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["AGMC"] - $scoreAry[0];
                                    $c = $more["AGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $inball = $more["AGMH"] . ":" . $more["AGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["AGMC"] . ":" . $more["AGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "BR":
                        if (isset($more["BGMH"]) && isset($more["BGMC"]) && is_numeric($more["BGMH"]) && is_numeric($more["BGMC"])) {
                            $h = $more["BGMH"];
                            $c = $more["BGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "BRE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["BGMH"]) && isset($more["BGMC"])
                            && is_numeric($more["BGMH"]) && is_numeric($more["BGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["BGMH"] - $scoreAry[0];
                                    $c = $more["BGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["BGMC"] - $scoreAry[0];
                                    $c = $more["BGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $h = $more["BGMH"] - $scoreAry[0];
                            $c = $more["BGMC"] - $scoreAry[1];
                            $inball = $more["BGMH"] . ":" . $more["BGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["BGMC"] . ":" . $more["BGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "CR":
                        if (isset($more["CGMH"]) && isset($more["CGMC"]) && is_numeric($more["CGMH"]) && is_numeric($more["CGMC"])) {
                            $h = $more["CGMH"];
                            $c = $more["CGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "CRE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["CGMH"]) && isset($more["CGMC"])
                            && is_numeric($more["CGMH"]) && is_numeric($more["CGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["CGMH"] - $scoreAry[0];
                                    $c = $more["CGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["CGMC"] - $scoreAry[0];
                                    $c = $more["CGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $h = $more["CGMH"] - $scoreAry[0];
                            $c = $more["CGMC"] - $scoreAry[1];
                            $inball = $more["CGMH"] . ":" . $more["CGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["CGMC"] . ":" . $more["CGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "DR":
                        if (isset($more["DGMH"]) && isset($more["DGMC"]) && is_numeric($more["DGMH"]) && is_numeric($more["DGMC"])) {
                            $h = $more["DGMH"];
                            $c = $more["DGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "DRE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["DGMH"]) && isset($more["DGMC"])
                            && is_numeric($more["DGMH"]) && is_numeric($more["DGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["DGMH"] - $scoreAry[0];
                                    $c = $more["DGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["DGMC"] - $scoreAry[0];
                                    $c = $more["DGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $h = $more["DGMH"] - $scoreAry[0];
                            $c = $more["DGMC"] - $scoreAry[1];
                            $inball = $more["DGMH"] . ":" . $more["DGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["DGMC"] . ":" . $more["DGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "ER":
                        if (isset($more["EGMH"]) && isset($more["EGMC"]) && is_numeric($more["EGMH"]) && is_numeric($more["EGMC"])) {
                            $h = $more["EGMH"];
                            $c = $more["EGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "ERE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["EGMH"]) && isset($more["EGMC"])
                            && is_numeric($more["EGMH"]) && is_numeric($more["EGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["EGMH"] - $scoreAry[0];
                                    $c = $more["EGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["EGMC"] - $scoreAry[0];
                                    $c = $more["EGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $h = $more["EGMH"] - $scoreAry[0];
                            $c = $more["EGMC"] - $scoreAry[1];
                            $inball = $more["EGMH"] . ":" . $more["EGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["EGMC"] . ":" . $more["EGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "FR":
                        if (isset($more["FGMH"]) && isset($more["FGMC"]) && is_numeric($more["FGMH"]) && is_numeric($more["FGMC"])) {
                            $h = $more["FGMH"];
                            $c = $more["FGMC"];
                            $inball = $h . ":" . $c;
                            /*if(strtoupper($strong) == "C") {
                                $inball = $c . ":" . $h;
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    case "FRE":
                        $scoreAry = explode(":", $score);
                        if (isset($more["FGMH"]) && isset($more["FGMC"])
                            && is_numeric($more["FGMH"]) && is_numeric($more["FGMC"])
                            && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            /*switch ($strong) {
                                case "H":
                                    $h = $more["FGMH"] - $scoreAry[0];
                                    $c = $more["FGMC"] - $scoreAry[1];
                                    break;
                                default://主客交换比分
                                    $h = $more["FGMC"] - $scoreAry[0];
                                    $c = $more["FGMH"] - $scoreAry[1];
                                    break;
                            }*/
                            $h = $more["FGMH"] - $scoreAry[0];
                            $c = $more["FGMC"] - $scoreAry[1];
                            $inball = $more["FGMH"] . ":" . $more["FGMC"];
                            /*if(strtoupper($strong) == "C") {
                                $inball = $more["FGMC"] . ":" . $more["FGMH"];
                            }*/
                            $sta = $this->getR($h, $c,$strong,$rtype,$spread);
                        }
                        break;
                    /*15分钟 让球 - 结束*/

                    //三项让球投注
                    case "W3":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            if(strtoupper($strong) == "C") {
                                $inball = $ballC . ":" . $ballH;
                            }
                            switch ($rtype){
                                case "W3H"://主队赢
                                    switch ($spread){
                                        case 1://主队让一球半
                                            $sta = $this->getR($ballH,$ballC,$strong,"RH","1.5");
                                            break;
                                        case 2://主队受让一球半
                                            $sta = $this->getR($ballH,$ballC,$strong,"RC","1.5");
                                            break;
                                    }
                                    break;
                                case "W3C"://客队赢
                                    switch ($spread){
                                        case 1://客队受让半球
                                            $sta = $this->getR($ballH,$ballC,$strong,"RC","0.5");
                                            break;
                                        case 2://客队让二球半
                                            $sta = $this->getR($ballH,$ballC,$strong,"RC","2.5");
                                            break;
                                    }
                                    break;
                                case "W3N"://和局
                                    if(strtoupper($strong) == "C") {
                                        $ballH = $ballH + $ballC;
                                        $ballC = $ballH - $ballC;
                                        $ballH = $ballH - $ballC;
                                    }
                                    switch ($spread){
                                        case 1://主场净胜一球
                                            if($ballH-$ballC == 1){
                                                $sta = "W";
                                            }else{
                                                $sta = "L";
                                            }
                                            break;
                                        case 2://客场净胜二球
                                            if($ballC-$ballH == 2){
                                                $sta = "W";
                                            }else{
                                                $sta = "L";
                                            }
                                            break;
                                    }
                                    break;
                            }
                        }
                        break;
                    /*让球类 - 结束*/

                    /*大小类 - 开始*/
                    case "OU":
                    case "ROU":
                        if (is_numeric($ballH) && is_numeric($ballC)) { 
                            $inball = $ballH . ":" . $ballC;
                            if($gtype == "ES" && $b["period_id"] == 2){ //电竞游戏  - 持续时间 
                                $spr = explode(":",$spread);
                                if(count($spr) == 1){ 
                                    $sta = $this->getOU($ballH,$ballC/60,$rtype,$spread);
                                }else{ 
                                    $sta = $this->getOU($ballH,$ballC/60,$rtype,$spr[0]+$spr[1]/60);
                                }
                                
                            } else { 
                                $sta = $this->getOU($ballH,$ballC,$rtype,$spread);
                            }
                            
                        }
                        break;
                    case "HOU":
                    case "HROU":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getOU($ballH_hr,$ballC_hr,$rtype,$spread);
                        }
                        break;
                    case "OUH"://主队进球 大小
                    case "ROUH"://滚球
                        if (is_numeric($ballH) && is_numeric($ballC)) {
							 if($gtype == 'TT'){
                                if (isset($more['GMH1']['result_h']) && isset($more['GMH1']['result_c']) && is_numeric($more['GMH1']['result_h']) && is_numeric($more['GMH1']['result_c'])) {
                                    $ballH = $more['GMH1']['result_h'];
                                    $ballC = $more['GMH1']['result_c'];
                                }
                            }
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getOU($ballH,0,$rtype,$spread);
                        }
                        break;
                    case "OUC"://客队进球 大小
                    case "ROUC"://滚球
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getOU(0,$ballC,$rtype,$spread);
                        }
                        break;
                    case "HOUH"://主队进球 上半 大小
                    case "HRUH"://滚球
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getOU($ballH_hr,0,$rtype,$spread);
                        }
                        break;
                    case "HOUC"://客队进球 上半 大小
                    case "HRUC"://滚球
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getOU(0,$ballC_hr,$rtype,$spread);
                        }
                        break;
                    case "AOU"://15分钟盘口 大小
                    case "AROU"://滚球
                    case "TARU"://5分钟盘口：开始 - 04:59 分钟 - 大 / 小 加时赛
                        if (isset($more["AGMH"]) && isset($more["AGMC"]) && is_numeric($more["AGMH"]) && is_numeric($more["AGMC"])) {
                            $inball = $more["AGMH"] . ":" . $more["AGMC"];

                            $sta = $this->getOU($more["AGMH"],$more["AGMC"],$rtype,$spread);
                        }
                        break;
                    case "BOU"://15分钟盘口 大小
                    case "BROU"://滚球
                    case "TBRU"://5分钟盘口：05:00 - 09:59 分钟 - 大 / 小 加时赛
                        if (isset($more["BGMH"]) && isset($more["BGMC"]) && is_numeric($more["BGMH"]) && is_numeric($more["BGMC"])) {
                            $inball = $more["BGMH"] . ":" . $more["BGMC"];
                            $sta = $this->getOU($more["BGMH"],$more["BGMC"],$rtype,$spread);
                        }
                        break;
                    case "COU"://15分钟盘口 大小
                    case "CROU":
                        $scoreAry = explode(":", $score);
                        if (isset($more["CGMH"]) && isset($more["CGMC"]) && is_numeric($more["CGMH"]) && is_numeric($more["CGMC"])) {
                            $inball = $more["CGMH"] . ":" . $more["CGMC"];
                            $sta = $this->getOU($more["CGMH"],$more["CGMC"],$rtype,$spread);
                        }
                        break;
                    case "DOU"://15分钟盘口 大小
                    case "DROU"://滚球
                    case "TDRU"://5分钟盘口：下半场开始 - 19:59分钟  - 大 / 小 加时赛
                        $scoreAry = explode(":", $score);
                        if (isset($more["DGMH"]) && isset($more["DGMC"]) && is_numeric($more["DGMH"]) && is_numeric($more["DGMC"])) {
                            $inball = $more["DGMH"] . ":" . $more["DGMC"];
                            $sta = $this->getOU($more["DGMH"],$more["DGMC"],$rtype,$spread);
                        }
                        break;
                    case "EOU"://15分钟盘口 大小
                    case "EROU"://滚球
                    case "TERU"://5分钟盘口：20:00 - 24:59分钟 - 大 / 小 加时赛
                        $scoreAry = explode(":", $score);
                        if (isset($more["EGMH"]) && isset($more["EGMC"]) && is_numeric($more["EGMH"]) && is_numeric($more["EGMC"])) {
                            $inball = $more["EGMH"] . ":" . $more["EGMC"];
                            $sta = $this->getOU($more["EGMH"],$more["EGMC"],$rtype,$spread);
                        }
                        break;
                    case "FOU"://15分钟盘口 大小
                    case "FROU":
                        $scoreAry = explode(":", $score);
                        if (isset($more["FGMH"]) && isset($more["FGMC"]) && is_numeric($more["FGMH"]) && is_numeric($more["FGMC"])) {
                            $inball = $more["FGMH"] . ":" . $more["FGMC"];
                            $sta = $this->getOU($more["FGMH"],$more["FGMC"],$rtype,$spread);
                        }
                        break;
                    /*大小类 - 结束*/

                    /*单双/进球数类 - 开始*/
                    case "T":
                    case "RT":
					case "RDT":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getT($ballH,$ballC,$rtype);
                        }
                        break;
                    case "HT":
                    case "HRT":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getT($ballH_hr,$ballC_hr,$rtype);
							}
                        break;
                    case "EOH":
                    case "EOC":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getE($ballH,$ballC,$rtype);
                        }
                        break;
                    case "HEOH":
                    case "HEOC":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getE($ballH_hr,$ballC_hr,$rtype);
                        }
                        break;
                    /*单双/进球数类 - 结束*/
                    /*其他玩法 和比分有关 - 开始*/
                    case "TS"://双方球队进球
                    case "RTS"://双方球队进球 滚球
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getTS($ballH,$ballC,$rtype);
                        }
                        break;
                    case "HTS"://双方球队进球 上半场
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getTS($ballH_hr,$ballC_hr,$rtype);
                        }
                        break;
                    case "RTS2"://双方球队进球 下半场
                        if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $h = $ballH - $ballH_hr;
                            $c = $ballC - $ballC_hr;
                            $inball = $h . ":" . $c;
                            $sta = $this->getTS($h,$c,$rtype);
                        }
                        break;
                    case "F"://半全场
                    case "RF":
                        if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH . ":" . $ballC."@". $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getF($ballH,$ballC,$ballH_hr,$ballC_hr,$rtype,$wtype);
                        }
                        break;

                    case "PD":
                    case "RPD":
                    case "PD3":
                    case "RPD3":
                    case "PD5":
                    case "RPD5":
                    case "PD7":
                    case "RPD7":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getPD($ballH,$ballC,$rtype,$wtype,$gtype);
                        }
                        break;
                    case "HPD":
                    case "HRPD":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getPD($ballH_hr,$ballC_hr,$rtype,$wtype);
                        }
                        break;
                    case "WM"://净胜球数
                    case "RWM":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getWM($ballH,$ballC,$rtype,$wtype,$gtype);
                        }
                        break;
                    case "HWM":
                    case "HRWM":
                        if (is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getWM($ballH_hr,$ballC_hr,$rtype,$wtype,$gtype);
                        }
                        break;
                    case "DC"://双重机会
                    case "RDC":
                        if (is_numeric($ballH) && is_numeric($ballC)) {
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getDC($ballH,$ballC,$rtype);
                        }
                        break;
                    case "WE"://赢得任一半场
                    case "RWE":
                        if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH . ":" . $ballC."@". $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getWE($ballH,$ballC,$ballH_hr,$ballC_hr,$rtype);
                        }
                        break;
                    case "WB"://赢得所有半场
                    case "RWB":
                        if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH . ":" . $ballC."@". $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getWB($ballH,$ballC,$ballH_hr,$ballC_hr,$rtype);
                        }
                        break;
                    case "CS"://零失球
                    case "RCS":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getCS($ballH,$ballC,$rtype);
                        }
                        break;
                    case "WN"://零失球获胜
                    case "RWN":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getWN($ballH,$ballC,$rtype);
                        }
                        break;
                    case "SB"://双半场进球
                    case "RSB":
                        if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                            $inball = $ballH . ":" . $ballC."@". $ballH_hr . ":" . $ballC_hr;
                            $sta = $this->getSB($ballH,$ballC,$ballH_hr,$ballC_hr,$rtype);
                        }
                        break;
                    case "MOUA"://独赢 & 进球 大 / 小1.5
                    case "RMUA":
                    case "MOUB"://独赢 & 进球 大 / 小2.5
                    case "RMUB":
                    case "MOUC"://独赢 & 进球 大 / 小3.5
                    case "RMUC":
                    case "MOUD"://独赢 & 进球 大 / 小4.5
                    case "RMUD":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getMOU($ballH,$ballC,$rtype);
                        }
                        break;
                    case "MTS"://独赢 & 双方球队进球
                    case "RMTS":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getMTS($ballH,$ballC,$rtype);
                        }
                        break;
                    case "MPG"://独赢 & 最先进球
                    case "RMPG":
                        if (is_numeric($ballH) && is_numeric($ballC) && !empty($rs_more["PGF_type"])){
                            $inball = $ballH . ":" . $ballC."@PGF|".$rs_more["PGF_type"];
                            $sta = $this->getMPG($ballH,$ballC,$rtype,$rs_more["PGF_type"]);
                        }
                        break;
                    case "OUTA"://进球 大 / 小 1.5 & 双方球队进球
                    case "RUTA":
                    case "OUTB"://进球 大 / 小 2.5 & 双方球队进球
                    case "RUTB":
                    case "OUTC"://进球 大 / 小 3.5 & 双方球队进球
                    case "RUTC":
                    case "OUTD"://进球 大 / 小 3.5 & 双方球队进球
                    case "RUTD":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getOUT($ballH,$ballC,$rtype);
                        }
                        break;
                    case "OUEA"://进球 大 / 小 1.5 & 进球 单 / 双
                    case "RUEA":
                    case "OUEB"://进球 大 / 小 2.5 & 进球 单 / 双
                    case "RUEB":
                    case "OUEC"://进球 大 / 小 3.5 & 进球 单 / 双
                    case "RUEC":
                    case "OUED"://进球 大 / 小 4.5 & 进球 单 / 双
                    case "RUED":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getOUE($ballH,$ballC,$rtype);
                        }
                        break;
                    case "OUPA"://进球 大 / 小 1.5 & 最先进球
                    case "RUPA":
                    case "OUPB"://进球 大 / 小 2.5 & 最先进球
                    case "RUPB":
                    case "OUPC"://进球 大 / 小 3.5 & 最先进球
                    case "RUPC":
                    case "OUPD"://进球 大 / 小 4.5 & 最先进球
                    case "RUPD":
                        if (is_numeric($ballH) && is_numeric($ballC) && !empty($rs_more["PGF_type"])){
                            $inball = $ballH . ":" . $ballC."@PGF|".$rs_more["PGF_type"];
                            $sta = $this->getOUP($ballH,$ballC,$rtype,$rs_more["PGF_type"]);
                        }
                        break;
                    case "DUA"://双重机会 & 进球 大 / 小 1.5
                    case "RDUA":
                    case "DUB"://双重机会 & 进球 大 / 小 2.5
                    case "RDUB":
                    case "DUC"://双重机会 & 进球 大 / 小 3.5
                    case "RDUC":
                    case "DUD"://双重机会 & 进球 大 / 小 4.5
                    case "RDUD":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getDU($ballH,$ballC,$rtype);
                        }
                        break;
                    case "DS"://双重机会 & 双方球队进球
                    case "RDS":
                        if (is_numeric($ballH) && is_numeric($ballC)){
                            $inball = $ballH . ":" . $ballC;
                            $sta = $this->getDS($ballH,$ballC,$rtype);
                        }
                        break;
                    case "DG"://双重机会 & 最先进球
                    case "RDG":
                        if (is_numeric($ballH) && is_numeric($ballC) && !empty($rs_more["PGF_type"])){
                            $inball = $ballH . ":" . $ballC."@PGF|".$rs_more["PGF_type"];
                            $sta = $this->getDG($ballH,$ballC,$rtype,$rs_more["PGF_type"]);
                        }
                        break;


                    /*其他玩法 和比分有关 - 结束*/

                    /*其他玩法 和比分无关 - 开始*/
                    case "BH"://落后反超获胜
                        if ($m["is_inball"] == 1) {//表示该赛事已有结果
                            if(isset($rs_more["BH_type"]) && !empty($rs_more["BH_type"])){
                                $inball = "BH|".$rs_more["BH_type"];
                                if("BH".strtoupper($rs_more["BH_type"]) == strtoupper($rtype)){
                                    $sta = "W";
                                }else{
                                    $sta = "L";
                                }
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
					case "PG":
                    case "SP":
                        if ($m["is_inball"] == 1 && !empty($more)) {//表示该赛事已有结果
                            $ary = $this->getSP($rs_more,$rtype);
                            $sta = $ary["sta"];
                            $inball = $ary["inball"];
                        }
                        break;
                    case "F2G"://先进2球的一方
                        if ($m["is_inball"] == 1 && !empty($rs_more["F2G_type"])) {
                            $inball = "F2G|".$rs_more["F2G_type"];
                            switch (strtoupper($rs_more["F2G_type"])){
                                case "H":
                                    if($rtype == "F2GH"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                                case "C":
                                    if($rtype == "F2GC"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                                case "N":
                                    if($rtype == "F2GN"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                            }
                        }
                        break;
                    case "F3G"://先进3球的一方
                        if ($m["is_inball"] == 1 && !empty($rs_more["F3G_type"])) {
                            $inball = "F3G|".$rs_more["F3G_type"];
                            switch (strtoupper($rs_more["F3G_type"])){
                                case "H":
                                    if($rtype == "F3GH"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                                case "C":
                                    if($rtype == "F3GC"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                                case "N":
                                    if($rtype == "F3GN"){
                                        $sta = "W";
                                    }else{
                                        $sta = "L";
                                    }
                                    break;
                            }
                        }
                        break;
                    case "FG"://首个进球方式
                        if ($m["is_inball"] == 1 && !empty($rs_more["FG_type"])) {
                            $inball = "FG|" . $rs_more["FG_type"];
                            if(strtoupper($rtype) == "FG".strtoupper($rs_more["FG_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "T1G"://首个进球时间
                    case "RT1G":
                        if ($m["is_inball"] == 1 && !empty($rs_more["T1G_type"])) {
                            $inball = "T1G|" . $rs_more["T1G_type"];
                            $rtype = str_replace("R","",$rtype);
                            if(strtoupper($rtype) == "T1G".strtoupper($rs_more["T1G_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "T3G"://首个进球时间 -3项
                    case "RT3G":
                        if ($m["is_inball"] == 1 && !empty($rs_more["T3G_type"])) {
                            $inball = "T3G|" . $rs_more["T3G_type"];
                            $rtype = str_replace("R","",$rtype);
                            if(strtoupper($rtype) == "T3G".strtoupper($rs_more["T3G_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "TK"://开球球队
                        if ($m["is_inball"] == 1 && !empty($rs_more["TK_type"])) {
                            $inball = "TK|" . $rs_more["TK_type"];
                            if(strtoupper($rtype) == "TK".strtoupper($rs_more["TK_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "PA"://点球荣获（除开点球大战)
                        if ($m["is_inball"] == 1 && !empty($rs_more["PA_type"])) {
                            $inball = "PA|" . $rs_more["PA_type"];
                            if(strtoupper($rtype) == "PA".strtoupper($rs_more["PA_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "RCD"://红卡(球员)
                        if ($m["is_inball"] == 1 && !empty($rs_more["RCD_type"])) {
                            $inball = "RCD|" . $rs_more["RCD_type"];
                            $sss = str_replace(["Y","N"],["H","C"],strtoupper($rs_more["RCD_type"]));
                            if(strtoupper($rtype) == "RCD".$sss){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "OG"://乌龙球
                        if ($m["is_inball"] == 1 && !empty($rs_more["OG_type"])) {
                            $inball = "OG|" . $rs_more["OG_type"];
                            if(strtoupper($rtype) == "OG".strtoupper($rs_more["OG_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "OT"://加时赛
                    case "ROT":
                        if ($m["is_inball"] == 1 && !empty($rs_more["OT_type"])) {
                            $inball = "OT|" . $rs_more["OT_type"];
                            $rtype = str_replace("R","",strtoupper($rtype));//去除滚球前面的R
                            if($rtype == "OT".strtoupper($rs_more["OT_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "MW"://胜出方法
                    case "HMW":
                    case "RMW":
                    case "HRMW":
                        if ($m["is_inball"] == 1 && !empty($rs_more["WM_type"])) {
                            $inball = "MW|" . $rs_more["MW_type"];
                            if(strtoupper($rtype) == "MW".strtoupper($rs_more["MW_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "MQ"://晋级方法
                        if ($m["is_inball"] == 1 && !empty($rs_more["MQ_type"])) {
                            $inball = "MQ|" . $rs_more["MQ_type"];
                            if(strtoupper($rtype) == "MQ".strtoupper($rs_more["MQ_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "RPS"://点球大战
                        if ($m["is_inball"] == 1 && !empty($rs_more["RPS_type"])) {
                            $inball = "RPS|" . $rs_more["RPS_type"];
                            if(strtoupper($rtype) == "RPS".strtoupper($rs_more["RPS_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "RPF"://点球大战 - 最后结束回合
                        if ($m["is_inball"] == 1 && !empty($rs_more["RPF_type"])) {
                            $inball = "RPF|" . $rs_more["RPF_type"];
                            if(strtoupper($rtype) == "RPF".strtoupper($rs_more["RPF_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
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
                        if ($m["is_inball"] == 1) {
                            $type = "{$wtype}_type";
                             if(!empty($rs_more[$type]) && $rs_more[$type] != '-') {
                                $inball = "{$wtype}|" . $rs_more[$type];
                                if (strtoupper($rtype) == $wtype . strtoupper($rs_more[$type])) {
                                    $sta = "W";
                                } else {
                                    $sta = "L";
                                }
                            }/*else{
                                $inball = "{$wtype}|N";
                                if (strtoupper($rtype) == $wtype ."N") {
                                    $sta = "W";
                                } else {
                                    $sta = "L";
                                }
                            }*/
                        }
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
                        $keyH = "RSH".str_replace("RPX","",$wtype);
                        $keyC = "RSC".str_replace("RPX","",$wtype);
                        $keyN = "RSN".str_replace("RPX","",$wtype);
                        if ($m["is_inball"] == 1 && !empty($rs_more["{$keyH}_type"]) && !empty($rs_more["{$keyC}_type"])) {
                            $yyn = strtoupper($rs_more["{$keyH}_type"].$rs_more["{$keyC}_type"]);
							
                            $inball = "{$keyH}|" . $rs_more["{$keyH}_type"]."@{$keyC}|" . $rs_more["{$keyC}_type"];
                            if(strpos($yyn,"P")!==false){ //无点球
							
                                if(strtoupper($rs_more["{$keyH}_type"]) == "P" && $rtype == $wtype."H"){
                                    $sta = "T";
                                }elseif(strtoupper($rs_more["{$keyC}_type"]) == "P" && $rtype == $wtype."C"){  
                                    $sta = "T";
								}elseif(strtoupper($rs_more["{$keyC}_type"]) == "P" && $rtype == $wtype."H" && $yyn=='YP'){ //主-进球
                                    $sta = "W";	
								}elseif(strtoupper($rs_more["{$keyH}_type"]) == "P" && $rtype == $wtype."C" && $yyn=='PY'){ //客-进球
                                    $sta = "W";	
                                }else{
									$sta = "L";
								}
                            }else{
                                switch ($yyn){
                                    case "YY"://主客都进球
                                        if($rtype == $wtype."N"){
                                            $sta = "W";
                                        }else{
                                            $sta = "L";
                                        }
                                        break;
                                    case "YN"://主-进球 客-无进球
                                        if($rtype == $wtype."H"){
                                            $sta = "W";
                                        }else{
                                            $sta = "L";
                                        }
                                        break;
                                    case "NY"://主-无进球 客-进球
                                        if($rtype == $wtype."C"){
                                            $sta = "W";
                                        }else{
                                            $sta = "L";
                                        }
                                        break;
                                    case "NN"://都无进球
                                        if($rtype == $wtype."N"){
                                            $sta = "W";
                                        }else{
                                            $sta = "L";
                                        }
                                        break;
                                }
                            }
                        }
                        break;

                    case "RTW"://点球大战 - 净胜球数
                        if ($m["is_inball"] == 1 && !empty($rs_more["RPF_type"])) {
                            $inball = "RTW|" . $rs_more["RTW_type"];
                            if(strtoupper($rtype) == "RTW".strtoupper($rs_more["RTW_type"])){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;

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
                        if($m["is_inball"] == 1 && isset($rs_more[$wtype."_type"]) && !empty($rs_more[$wtype."_type"])){
                            $inball = $wtype."|".$rs_more[$wtype."_type"];
                            if(strtoupper($rs_more[$wtype."_type"]) == "P"){//无角球
                                $sta = "T";
                            }else if($wtype.$rs_more[$wtype."_type"] == $rtype){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
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
                        if($m["is_inball"] == 1 && isset($rs_more[$wtype."_type"]) && !empty($rs_more[$wtype."_type"])){
                            $inball = $wtype."|".$rs_more[$wtype."_type"];
                            if(strtoupper($rs_more[$wtype."_type"]) == "P"){//无角球
                                $sta = "T";
                            }else if($wtype.$rs_more[$wtype."_type"] == $rtype){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    case "RSHA"://第一个点球大战 主队
                    case "RSHB"://第二个点球大战 主队
                    case "RSHC"://第三个点球大战 主队
                    case "RSHD"://第四个点球大战 主队
                    case "RSHE"://第五个点球大战 主队
                    case "RSHF"://第六个点球大战 主队
                    case "RSHG"://第七个点球大战 主队
                    case "RSHH"://第八个点球大战 主队
                    case "RSHI"://第九个点球大战 主队
                    case "RSHJ"://第十个点球大战 主队
                    case "RSHk"://第十一个点球大战 主队
                    case "RSHL"://第十二个点球大战 主队
                    case "RSHM"://第十三个点球大战 主队
                    case "RSHN"://第十四个点球大战 主队
                    case "RSHO"://第十五个点球大战 主队
                        if ($m["is_inball"] == 1 && !empty($rs_more["{$wtype}_type"])) {
                            $inball = $wtype."|".$rs_more[$wtype."_type"];
                            $rs_type = strtoupper($rs_more["{$wtype}_type"]);
                            if($rs_type=="P"){//无点球
                                $sta = "T";
                            }else if($wtype.$rs_type == $rtype){
                                $sta = "W";
                            }else{
                                $sta = "L";
                            }
                        }
                        break;
                    /*其他玩法 和比分无关 - 结束*/

                    /*网球 特殊结算 - start*/
                    //$rs_more
                    default:
                        switch ($gtype){
                            case "TN":
                                $rfs = ["RFA","RFB","RFC","RFD","RFE"];//网球 第某盘 第某局
                                foreach ($rfs as $rf){
                                    if(strpos($wtype,$rf)!==false){
                                        if($m["is_inball"] == 1 && !empty($rs_more[$rf])){
                                            $num = intval(str_replace($rf,"",$wtype))-1;
                                            $in_type = $rs_more[$rf][$num]["type"];
                                            $inball = $wtype."|".$in_type;
                                            if($in_type == "N/A"){
                                                $sta = "T";
                                            }else{
                                                if($rtype==$wtype.$in_type){
                                                    $sta = "W";
                                                }else{
                                                    $sta = "L";
                                                }
                                            }

                                        }
                                    }
                                }
                                break;
                            case "SK":
                                $f = [];
                                for($n=1;$n<=35;$n++){
                                    if($n<10){
                                        $f[] = "F0".$n;
                                    }else{
                                        $f[] = "F".$n;
                                    }
                                }

                                $wtype = str_replace("RF","F",$wtype);

                                if(in_array($wtype,$f)){
                                    if($m["is_inball"] == 1 && !empty($rs_more[$wtype."_type"])){
                                        $inball = $wtype."|".$rs_more[$wtype."_type"];
                                        $rtype  = str_replace("RF","F",$rtype);
                                        switch ($rs_more[$wtype."_type"]){
                                            case "H":
                                                if($rtype==$wtype."H"){
                                                    $sta = "W";
                                                }else{
                                                    $sta = "L";
                                                }
                                                break;
                                            case "C":
                                                if($rtype==$wtype."C"){
                                                    $sta = "W";
                                                }else{
                                                    $sta = "L";
                                                }
                                                break;
                                        }
                                    }
                                }
                                break;
							case "BM":
                                if(strpos($wtype,"RPTW")!==false || strpos($wtype,"RWXP")!==false){
                                    if($m["is_inball"] == 1 ){
                                        $chars_2_to_4 = substr($rtype, 1, 3);
                                        $char_5th = substr($rtype, 4, 1);
                                        preg_match('/(\d+)[A-Z]$/', $rtype, $num_matches);
                                        $numbers = $num_matches[1];
                                        $last_char = substr($rtype, -1);

                                        $list = $rs_more[$char_5th][$chars_2_to_4];
                                        foreach ($list as $item) {
                                            if ($item['point'] == $numbers) {
                                                echo $item['type'];
                                                $in_type = $item['type'];
                                                if($in_type == "N/A"){
                                                    $sta = "T";
                                                }else{
                                                    if($rtype==$last_char){
                                                        $sta = "W";
                                                    }else{
                                                        $sta = "L";
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                break;
                        }


                        break;
                    /*网球 特殊结算 - end*/
                }
                // if($m["gid"]=='8130697'){ 
                //     print_r($sta."---{$wtype}---\n");exit;
                // }
                if(!empty($sta)) {
                    if($betType=="bet") {
                        $wingold = 0;//输赢金额
                        $valid_gold = 0;//有效金额
                        $cancel = 0;//赛事是否取消
                        $mem_result = 0;//会员退水后金额
                        $mem_win_gold = 0;//退水前输赢金额
                        $agent_result = 0;
                        $ag_result = 0;//代理结果
                        $su_result = 0;//总代结果
                        $co_result = 0;//股东结果
                        $d0_result = 0;//分公司结果

                        if ($sta == "T") { //退还/和局
                            if ($m["status"] > 0) { //赛事取消
                                $cancel = 1;
                            }
                            $pay_gold = $b["bet_golds"];
                        } else {
                            $isTurnBetGold = "N";//是否退还本金 Y:需要,N:不需要
                            switch (strtoupper($sta)) {
                                case "W"://赢
                                    $wingold = $b["win_gold"];
                                    $valid_gold = $wingold;
                                    $isTurnBetGold = "Y";
                                    break;
                                case "L"://输
                                    $wingold = 0 - $b["bet_golds"];
                                    $valid_gold = $b["bet_golds"];
                                    switch ($b["odd_f_type"]) {
                                        case 'M'://马来盘
                                        case "I"://印尼盘
                                            if($b["ioratio"]<0){ 
                                                $wingold = $b["bet_golds"]*$b["ioratio"];
                                            }
                                            break;
                                    }
                                    break;
                                case "HW"://赢一半
                                    $wingold = $b["win_gold"] * 0.5;
                                    $valid_gold = $wingold;
                                    $isTurnBetGold = "Y";
                                    break;
                                case "HL"://输一半
                                    $wingold = 0 - $b["bet_golds"] * 0.5;
                                    $valid_gold = $b["bet_golds"] * 0.5;
                                    switch ($b["odd_f_type"]) {
                                        case 'M'://马来盘
                                        case "I"://印尼盘
                                            if($b["ioratio"]<0){ 
                                                $wingold = $b["bet_golds"]*$b["ioratio"]*0.5;
                                            }
                                            break;
                                    }
                                    break;
                            }
                            $mem_win_gold = $wingold;
                            //print_r($b["ID"]."--".$valid_gold."--".$b["mem_turn_rate"]);exit;
                            $mem_turn_rate = $valid_gold * floatval($b["mem_turn_rate"]) / 100;//会员退水金额 = 有效金额*会员退水%
                            $mem_result = $wingold + $mem_turn_rate;//会员结果 = 输赢金额 + 会员退水金额
                            //print_r($mem_result);exit;
                            if ($mem_result > 0) { //赢表示还需要退还现金玩家的本金
                                $pay_gold = $b["bet_golds"] + $mem_result;
                            } else {
                                if(strtoupper($sta)=="HL"){ //输一半 退还一半的现金额度
                                    $pay_gold = $valid_gold + $mem_turn_rate;
                                }else{
                                    $pay_gold = $mem_turn_rate;
                                }

                            }
                            $agent_result = $mem_result + ($b["ag_turn_rate"] - $b["mem_turn_rate"]) * $valid_gold / 100;//上交金额 = 会员结果 + (代理商退水%-会员退水%)*有效金额
                            $ag_result = $agent_result * (100 - $b["ag_point"]) / 100; //代理结果 = 上级输赢 * (100-代理占成%)
                            //总代理结果 = 代理输赢*(100%-代理占成%-总代理占成%) + (总代退水% - 代理退水%)*有效金额
                            $su_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"]) / 100 + ($b["su_turn_rate"] - $b["ag_turn_rate"]) * $valid_gold / 100;
                            //股东结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                            $co_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"] - $b["co_point"]) / 100 + ($b["co_turn_rate"] - $b["su_turn_rate"]) * $valid_gold / 100;
                            //分公司结果 = 代理输赢*(100%-代理占成% -总代理占成% - 股东占成%) + (股东退水% - 总代退水%)*有效金额
                            $d0_result = $agent_result * (100 - $b["ag_point"] - $b["su_point"] - $b["co_point"] - $b["d0_point"]) / 100 + ($b["d0_turn_rate"] - $b["co_turn_rate"]) * $valid_gold / 100;
                        }


                        $up = [
                            "status" => $m["status"],
                            "valid_gold" => round($valid_gold,4),//有效金额
                            "mem_result" => round($mem_result,4),//退水后输赢
                            "mem_win_gold" => round($mem_win_gold,4),//退水前输赢
                            "agent_result" => round($agent_result,4),
                            "ag_result" => round($ag_result,4),
                            "su_result" => round($su_result,4),
                            "co_result" => round($co_result,4),
                            "d0_result" => round($d0_result,4),
                            "inball" => $inball,
                            "isResult" => 1,
                            "result" => $sta
                        ];
                        /*if($b["ID"]==75920){
                            print_r($up);exit;
                        }*/
                        $this->dbc->update($this->bet_table,$up,"`ID`={$b["ID"]}");
                    }else{//串关表
                        $up = [
                            "status" => $m["status"],
                            "isResult" => 1,
                            "inball" => $inball,
                            "result" => $sta
                        ];
                        $this->dbc->update($this->bet_p3_table,$up,"`ID`={$b["ID"]}");
                    }
                }
            }
            if($pay_gold>0 && !empty($sta)){//现金玩家更新金额
                $memTable = Constant::T_MEMBER;
                $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$pay_gold}),`balance_credit`=(`balance_credit`+{$pay_gold}) WHERE `nid`='{$b["nid"]}' AND `pay_type`=1 ";
               // $this->set_credit_logs($b["nid"],$pay_gold, "结算 2412");
                $this->dbc->execSql($sql);
            }

            $this->dbc->commit();
            if(!empty($sta)){
                return ["status"=>"ok"];
            }else{
                return ["status"=>"no"];
            }

        }catch (\Exception $e){
            $this->dbc->rollback();
            return ["status"=>"error","msg"=>$e->getMessage()];
        }


        return $num;
    }

    /**
     * 最先/最后 后台结算
     * @param $_type0
     * @param $rtype
     * @return string[]
     */
    public function getSP_AD($_type0,$rtype){
        $sta = "";
        $inball = "";
        if(!empty($_type0)){
            $rtype = strtoupper($rtype);
            $pgfAry = ["PGFH","PGFC","PGFN"];//最先进球
            $pglAry = ["PGLH","PGLC","PGLN"];//最后进球
            if(in_array($rtype,$pgfAry)){
                $inball = "PGF|".$_type0;
                $pgf = strtoupper($_type0);
                switch ($rtype){
                    case "PGFH":
                        if($pgf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "PGFC":
                        if($pgf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "PGFN":
                        if($pgf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$pglAry)){
                $inball = "PGL|".$_type0;
                $pgf = strtoupper($_type0);
                switch ($rtype){
                    case "PGLH":
                        if($pgf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "PGLC":
                        if($pgf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "PGLN":
                        if($pgf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }

            $stfAry = ["STFH","STFC","STFN"];//最先越位球员
            $stlAry = ["STLH","STLC","STLN"];//最后越位球员

            if(in_array($rtype,$stfAry)){
                $inball = "STF|".$_type0;
                $stf = strtoupper($_type0);
                switch ($rtype){
                    case "STFH":
                        if($stf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "STFC":
                        if($stf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "STFN":
                        if($stf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$stlAry)){
                $inball = "STL|".$_type0;
                $stf = strtoupper($_type0);
                switch ($rtype){
                    case "STLH":
                        if($stf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "STLC":
                        if($stf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "STLN":
                        if($stf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }

            $cnfAry = ["CNFH","CNFC","CNFN"];//第一颗角球
            $cnlAry = ["CNLH","CNLC","CNLN"];//最后一颗角球

            if(in_array($rtype,$cnfAry)){
                $inball = "CNF|".$_type0;
                $cnf = strtoupper($_type0);
                switch ($rtype){
                    case "CNFH":
                        if($cnf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CNFC":
                        if($cnf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CNFN":
                        if($cnf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$cnlAry)){
                $inball = "CNL|".$_type0;
                $cnf = strtoupper($_type0);
                switch ($rtype){
                    case "CNLH":
                        if($cnf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CNLC":
                        if($cnf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CNLN":
                        if($cnf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }
                //print_r($cnf."==".$sta."==".$rtype);exit;
                return ["sta"=>$sta,"inball"=>$inball];
            }

            $cdfAry = ["CDFH","CDFC","CDFN"];//第一张罚牌
            $cdlAry = ["CDLH","CDLC","CDLN"];//最后一张罚牌
            if(in_array($rtype,$cdfAry)){
                $inball = "CDF|".$_type0;
                $cdf = strtoupper($_type0);
                switch ($rtype){
                    case "CDFH":
                        if($cdf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CDFC":
                        if($cdf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CDFN":
                        if($cdf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$cdlAry)){
                $inball = "CDL|".$_type0;
                $cdf = strtoupper($_type0);
                switch ($rtype){
                    case "CDLH":
                        if($cdf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CDLC":
                        if($cdf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "CDLN":
                        if($cdf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }

            $rcfAry = ["RCFH","RCFC"];//最先任意球
            $rclAry = ["RCLH","RCLC"];//最后任意球
            if(in_array($rtype,$rcfAry)){
                $inball = "RCF|".$_type0;
                $rcf = strtoupper($_type0);
                switch ($rtype){
                    case "RCFH":
                        if($rcf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "RCFC":
                        if($rcf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "RCFN":
                        if($rcf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$rclAry)){
                $inball = "RCL|".$_type0;
                $rcf = strtoupper($_type0);
                switch ($rtype){
                    case "RCLH":
                        if($rcf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "RCLC":
                        if($rcf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "RCLN":
                        if($rcf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }

            $ycfAry = ["YCFH","YCFC"];//第一张黄卡
            $yclAry = ["YCLH","YCLC"];//最后一张黄卡
            if(in_array($rtype,$ycfAry)){
                $inball = "YCF|".$_type0;
                $ycf = strtoupper($_type0);
                switch ($rtype){
                    case "YCFH":
                        if($ycf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "YCFC":
                        if($ycf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "YCFN":
                        if($ycf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$yclAry)){
                $inball = "YCL|".$_type0;
                $ycf = strtoupper($_type0);
                switch ($rtype){
                    case "YCLH":
                        if($ycf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "YCLC":
                        if($ycf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "YCLN":
                        if($ycf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }


            $gafAry = ["GAFH","GAFC"];//最先球门球
            $galAry = ["GALH","GALC"];//最后球门球
            if(in_array($rtype,$gafAry)){
                $inball = "GAF|".$_type0;
                $gaf = strtoupper($_type0);
                switch ($rtype){
                    case "GAFH":
                        if($gaf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "GAFC":
                        if($gaf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "GAFN":
                        if($gaf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
            if(in_array($rtype,$galAry)){
                $inball = "GAL|".$_type0;
                $gaf = strtoupper($_type0);
                switch ($rtype){
                    case "GALH":
                        if($gaf == "HOME"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "GALC":
                        if($gaf == "AWAY"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                    case "GALN":
                        if($gaf == "NO"){
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                        break;
                }

                return ["sta"=>$sta,"inball"=>$inball];
            }
        }

        return ["sta"=>$sta,"inball"=>$inball];
    }

    /**
     * 最先/最后
     * @param $more
     * @param $rtype
     * @return string
     */
    public function getSP($rs_more,$rtype){
        $sta = "";
        $rtype = strtoupper($rtype);
        $pgfAry = ["PGFH","PGFC","PGFN"];//最先进球
        $pglAry = ["PGLH","PGLC","PGLN"];//最后进球
        $inball = "";
        if(isset($rs_more["PGF_type"]) && !empty($rs_more["PGF_type"])  && in_array($rtype,$pgfAry)){
            $inball = "PGF|".$rs_more["PGF_type"];
            $pgf = strtoupper($rs_more["PGF_type"]);
            switch ($rtype){
                case "PGFH":
                    if($pgf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "PGFC":
                    if($pgf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "PGFN":
                    if($pgf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["PGL_type"]) && !empty($rs_more["PGL_type"]) && in_array($rtype,$pglAry)){
            $inball = "PGL|".$rs_more["PGL_type"];
            $pgf = strtoupper($rs_more["PGL_type"]);
            switch ($rtype){
                case "PGLH":
                    if($pgf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "PGLC":
                    if($pgf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "PGLN":
                    if($pgf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }

        $stfAry = ["STFH","STFC","STFN"];//最先越位球员
        $stlAry = ["STLH","STLC","STLN"];//最后越位球员

        if(isset($rs_more["STF_type"]) && !empty($rs_more["STF_type"]) && in_array($rtype,$stfAry)){
            $inball = "STF|".$rs_more["STF_type"];
            $stf = strtoupper($rs_more["STF_type"]);
            switch ($rtype){
                case "STFH":
                    if($stf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "STFC":
                    if($stf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "STFN":
                    if($stf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["STL_type"]) && !empty($rs_more["STL_type"]) && in_array($rtype,$stlAry)){
            $inball = "STL|".$rs_more["STL_type"];
            $stf = strtoupper($rs_more["STL_type"]);
            switch ($rtype){
                case "STLH":
                    if($stf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "STLC":
                    if($stf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "STLN":
                    if($stf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }

        $cnfAry = ["CNFH","CNFC","CNFN"];//第一颗角球
        $cnlAry = ["CNLH","CNLC","CNLN"];//最后一颗角球

        if(isset($rs_more["CNF_type"]) && !empty($rs_more["CNF_type"]) && in_array($rtype,$cnfAry)){
            $inball = "CNF|".$rs_more["CNF_type"];
            $cnf = strtoupper($rs_more["CNF_type"]);
            switch ($rtype){
                case "CNFH":
                    if($cnf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CNFC":
                    if($cnf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CNFN":
                    if($cnf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["CNL_type"]) && !empty($rs_more["CNL_type"]) && in_array($rtype,$cnlAry)){
            $inball = "CNL|".$rs_more["CNL_type"];
            $cnf = strtoupper($rs_more["CNL_type"]);
            switch ($rtype){
                case "CNLH":
                    if($cnf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CNLC":
                    if($cnf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CNLN":
                    if($cnf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }
            //print_r($cnf."==".$sta."==".$rtype);exit;
            return ["sta"=>$sta,"inball"=>$inball];
        }

        $cdfAry = ["CDFH","CDFC","CDFN"];//第一张罚牌
        $cdlAry = ["CDLH","CDLC","CDLN"];//最后一张罚牌
        if(isset($rs_more["CDF_type"]) && !empty($rs_more["CDF_type"]) && in_array($rtype,$cdfAry)){
            $inball = "CDF|".$rs_more["CDF_type"];
            $cdf = strtoupper($rs_more["CDF_type"]);
            switch ($rtype){
                case "CDFH":
                    if($cdf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CDFC":
                    if($cdf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CDFN":
                    if($cdf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["CDL_type"]) && !empty($rs_more["CDL_type"]) && in_array($rtype,$cdlAry)){
            $inball = "CDL|".$rs_more["CDL_type"];
            $cdf = strtoupper($rs_more["CDL_type"]);
            switch ($rtype){
                case "CDLH":
                    if($cdf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CDLC":
                    if($cdf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "CDLN":
                    if($cdf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }

        $rcfAry = ["RCFH","RCFC"];//最先任意球
        $rclAry = ["RCLH","RCLC"];//最后任意球
        if(isset($rs_more["RCF_type"]) && !empty($rs_more["RCF_type"]) && in_array($rtype,$rcfAry)){
            $inball = "RCF|".$rs_more["RCF_type"];
            $rcf = strtoupper($rs_more["RCF_type"]);
            switch ($rtype){
                case "RCFH":
                    if($rcf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "RCFC":
                    if($rcf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "RCFN":
                    if($rcf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["RCL_type"]) && !empty($rs_more["RCL_type"]) && in_array($rtype,$rclAry)){
            $inball = "RCL|".$rs_more["RCL_type"];
            $rcf = strtoupper($rs_more["RCL_type"]);
            switch ($rtype){
                case "RCLH":
                    if($rcf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "RCLC":
                    if($rcf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "RCLN":
                    if($rcf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }

        $ycfAry = ["YCFH","YCFC"];//第一张黄卡
        $yclAry = ["YCLH","YCLC"];//最后一张黄卡
        if(isset($rs_more["YCF_type"]) && !empty($rs_more["YCF_type"]) && in_array($rtype,$ycfAry)){
            $inball = "YCF|".$rs_more["YCF_type"];
            $ycf = strtoupper($rs_more["YCF_type"]);
            switch ($rtype){
                case "YCFH":
                    if($ycf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "YCFC":
                    if($ycf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "YCFN":
                    if($ycf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["YCL_type"]) && !empty($rs_more["YCL_type"]) && in_array($rtype,$yclAry)){
            $inball = "YCL|".$rs_more["YCL_type"];
            $ycf = strtoupper($rs_more["YCL_type"]);
            switch ($rtype){
                case "YCLH":
                    if($ycf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "YCLC":
                    if($ycf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "YCLN":
                    if($ycf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }


        $gafAry = ["GAFH","GAFC"];//最先球门球
        $galAry = ["GALH","GALC"];//最后球门球
        if(isset($rs_more["GAF_type"]) && !empty($rs_more["GAF_type"]) && in_array($rtype,$gafAry)){
            $inball = "GAF|".$rs_more["GAF_type"];
            $gaf = strtoupper($rs_more["GAF_type"]);
            switch ($rtype){
                case "GAFH":
                    if($gaf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "GAFC":
                    if($gaf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "GAFN":
                    if($gaf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }
        if(isset($rs_more["GAL_type"]) && !empty($rs_more["GAL_type"]) && in_array($rtype,$galAry)){
            $inball = "GAL|".$rs_more["GAL_type"];
            $gaf = strtoupper($rs_more["GAL_type"]);
            switch ($rtype){
                case "GALH":
                    if($gaf == "HOME"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "GALC":
                    if($gaf == "AWAY"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
                case "GALN":
                    if($gaf == "NO"){
                        $sta = "W";
                    } else {
                        $sta = "L";
                    }
                    break;
            }

            return ["sta"=>$sta,"inball"=>$inball];
        }


        return ["sta"=>$sta,"inball"=>$inball];
    }

    /**
     * 进球 大 / 小 & 最先进球
     * @param $h
     * @param $c
     * @param $rtype
     * @param $mtype
     * @return string
     */
    public function getOUP($h,$c,$rtype,$mtype){
        $rtype = strtoupper($rtype);
        $mtype = strtoupper($mtype);
        $sta = "";
        $sum = $h + $c;
        switch ($rtype){
            //进球 大 / 小 1.5 & 最先进球
            case "OUPAOH":
            case "RUPAOH":
                if($sum>1.5 && $mtype=="HOME"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPAOC":
            case "RUPAOC":
                if($sum>1.5 && $mtype=="AWAY"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPAUH":
            case "RUPAUH":
                if($sum<1.5 && $mtype=="HOME"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPAUC":
            case "RUPAUC":
                if($sum<1.5 && $mtype=="AWAY"){
                    $sta = "W";
                }
                break;

            //进球 大 / 小 2.5 & 最先进球
            case "OUPBOH":
            case "RUPBOH":
                if($sum>2.5 && $mtype=="HOME"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPBOC":
            case "RUPBOC":
                if($sum>2.5 && $mtype=="AWAY"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPBUH":
            case "RUPBUH":
                if($sum<2.5 && $mtype=="HOME"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPBUC":
            case "RUPBUC":
                if($sum<2.5 && $mtype=="AWAY"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;

            //进球 大 / 小 3.5 & 最先进球
            case "OUPCOH":
            case "RUPCOH":
                if($sum>3.5 && $mtype=="HOME"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPCOC":
            case "RUPCOC":
                if($sum>3.5 && $mtype=="AWAY"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPCUH":
            case "RUPCUH":
                if($sum<3.5 && $mtype=="HOME"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPCUC":
            case "RUPCUC":
                if($sum<3.5 && $mtype=="AWAY"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;

            //进球 大 / 小 4.5 & 最先进球
            case "OUPDOH":
            case "RUPDOH":
                if($sum>4.5 && $mtype=="HOME"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPDOC":
            case "RUPDOC":
                if($sum>4.5 && $mtype=="AWAY"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPDUH":
            case "RUPDUH":
                if($sum<4.5 && $mtype=="HOME"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
            case "OUPDUC":
            case "RUPDUC":
                if($sum<4.5 && $mtype=="AWAY"){
                    $sta = "W";
                }else{ 
                    $sta = "L";
                }
                break;
        }
        return $sta;
    }

    /**
     * 双重机会 & 最先进球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getDG($h,$c,$rtype,$mtype){
        $rtype = strtoupper($rtype);
        $mtype = strtoupper($mtype);
        $rtype = str_replace("R","",$rtype);//去除滚球前的R
        $sta = "";
        $kk = $h- $c;
        switch ($rtype){
            case "DGHH":
                if(($kk>0 || $kk==0) && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DGHC":
                if(($kk>0 || $kk==0) && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DGCH":
                if(($kk<0 || $kk==0) && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DGCC":
                if(($kk<0 || $kk==0) && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DGSH":
                if($kk!=0 && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DGSC":
                if($kk!=0 && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 双重机会 & 双方球队进球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getDS($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $rtype = str_replace("R","",$rtype);//去除滚球前的R
        $sta = "";
        $kk = $h- $c;
        switch ($rtype){
            case "DSHY":
                if(($kk>0 || $kk==0) && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DSHN":
                if(($kk>0 || $kk==0) && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DSCY":
                if(($kk<0 || $kk==0) && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DSCN":
                if(($kk<0 || $kk==0) && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DSSY":
                if($kk!=0 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DSSN":
                if($kk!=0 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 独赢 & 最先进球
     * @param $h
     * @param $c
     * @param $rtype
     * @param $mtype
     * @return string
     */
    public function getMPG($h,$c,$rtype,$mtype){
        $rtype = strtoupper($rtype);
        $mtype = strtoupper($mtype);
        $rtype = str_replace("R","",$rtype);//去除滚球前的R
        $kk = $h- $c;
        $sta = "";
        switch ($rtype){
            case "MPGHH":
                if($kk>0 && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MPGHC":
                if($kk>0 && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MPGCH":
                if($kk<0 && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MPGCC":
                if($kk<0 && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MPGNH":
                if($kk==0 && $mtype=="HOME"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MPGNC":
                if($kk==0 && $mtype=="AWAY"){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 双重机会 & 进球 大 / 小
     * @param $h
     * @param $c
     * @param $rtype
     */
    public function getDU($h,$c,$rtype)
    {
        $rtype = strtoupper($rtype);
        $rtype = str_replace("R","",$rtype);//去除滚球前的R
        $sum = $h + $c;
        $kk  = $h - $c;
        $sta = "";
        switch ($rtype) {
            //双重机会 & 进球 大 / 小 1.5
            case "DUAHO":
                if(($kk>0 || $kk == 0) && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUAHU":
                if(($kk>0 || $kk == 0) && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUACO":
                if(($kk<0 || $kk == 0) && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUACU":
                if(($kk<0 || $kk == 0) && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUASO":
                if($kk != 0 && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUASU":
                if($kk != 0 && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //双重机会 & 进球 大 / 小 2.5
            case "DUBHO":
                if(($kk>0 || $kk == 0) && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUBHU":
                if(($kk>0 || $kk == 0) && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUBCO":
                if(($kk<0 || $kk == 0) && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUBCU":
                if(($kk<0 || $kk == 0) && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUBSO":
                if($kk != 0 && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUBSU":
                if($kk != 0 && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //双重机会 & 进球 大 / 小 3.5
            case "DUCHO":
                if(($kk>0 || $kk == 0) && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUCHU":
                if(($kk>0 || $kk == 0) && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUCCO":
                if(($kk<0 || $kk == 0) && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUCCU":
                if(($kk<0 || $kk == 0) && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUCSO":
                if($kk != 0 && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUCSU":
                if($kk != 0 && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //双重机会 & 进球 大 / 小 4.5
            case "DUDHO":
                if(($kk>0 || $kk == 0) && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUDHU":
                if(($kk>0 || $kk == 0) && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUDCO":
                if(($kk<0 || $kk == 0) && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUDCU":
                if(($kk<0 || $kk == 0) && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUDSO":
                if($kk != 0 && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "DUDSU":
                if($kk != 0 && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 进球 大 / 小 & 进球 单 / 双
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getOUE($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $sum = $h + $c;
        $sta = "";
        switch ($rtype) {
            //进球 大 / 小 1.5 & 进球 单 / 双
            case "OUEAOO":
            case "RUEAOO":
                if($sum>1.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEAUO":
            case "RUEAUO":
                if($sum<1.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEAOE":
            case "RUEAOE":
                if($sum>1.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEAUE":
            case "RUEAUE":
                if($sum<1.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 2.5 & 进球 单 / 双
            case "OUEBOO":
            case "RUEBOO":
                if($sum>2.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEBUO":
            case "RUEBUO":
                if($sum<2.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEBOE":
            case "RUEBOE":
                if($sum>2.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEBUE":
            case "RUEBUE":
                if($sum<2.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 3.5 & 进球 单 / 双
            case "OUECOO":
            case "RUECOO":
                if($sum>3.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUECUO":
            case "RUECUO":
                if($sum<3.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUECOE":
            case "RUECOE":
                if($sum>3.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUECUE":
            case "RUECUE":
                if($sum<3.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 4.5 & 进球 单 / 双
            case "OUEDOO":
            case "RUEDOO":
                if($sum>4.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEDUO":
            case "RUEDUO":
                if($sum<4.5 && $sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEDOE":
            case "RUEDOE":
                if($sum>4.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUEDUE":
            case "RUEDUE":
                if($sum<4.5 && $sum%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 进球 大 / 小 & 双方球队进球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getOUT($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $sum = $h + $c;
        $sta = "";
        switch ($rtype){
            //进球 大 / 小 1.5 & 双方球队进球
            case "OUTAOY":
            case "RUTAOY":
                if($sum>1.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTAON":
            case "RUTAON":
                if($sum>1.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTAUY":
            case "RUTAUY":
                if($sum<1.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTAUN":
            case "RUTAUN":
                if($sum<1.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 2.5 & 双方球队进球
            case "OUTBOY":
            case "RUTBOY":
                if($sum>2.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTBON":
            case "RUTBON":
                if($sum>2.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTBUY":
            case "RUTBUY":
                if($sum<2.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTBUN":
            case "RUTBUN":
                if($sum<2.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 3.5 & 双方球队进球
            case "OUTCOY":
            case "RUTCOY":
                if($sum>3.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTCON":
            case "RUTCON":
                if($sum>3.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTCUY":
            case "RUTCUY":
                if($sum<3.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTCUN":
            case "RUTCUN":
                if($sum<3.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //进球 大 / 小 4.5 & 双方球队进球
            case "OUTDOY":
            case "RUTDOY":
                if($sum>4.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTDON":
            case "RUTDON":
                if($sum>4.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTDUY":
            case "RUTDUY":
                if($sum<4.5 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OUTDUN":
            case "RUTDUN":
                if($sum<4.5 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 独赢 & 双方球队进球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getMTS($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $kk  = $h - $c;
        $sum = $h + $c;
        $sta = "";
        $rtype = str_replace("R","",$rtype);//去除滚球前的R
        switch ($rtype){
            case "MTSHY":
                if($kk>0 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MTSHN":
                if($kk>0 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MTSCY":
                if($kk<0 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MTSCN":
                if($kk<0 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MTSNY":
                if($kk==0 && $h>0 && $c>0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MTSNN":
                if($kk==0 && ($h==0 || $c==0)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 独赢 & 进球 大 / 小
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getMOU($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $kk  = $h - $c;
        $sum = $h + $c;
        $sta = "";
        switch ($rtype){
            //独赢 & 进球 大 / 小 1.5
            case "MOUAHO":
            case "RMUAHO":
                if($kk>0 && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUAHU":
            case "RMUAHU":
                if($kk>0 && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUACO":
            case "RMUACO":
                if($kk<0 && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUACU":
            case "RMUACU":
                if($kk<0 && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUANO":
            case "RMUANO":
                if($kk==0 && $sum>1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUANU":
            case "RMUANU":
                if($kk==0 && $sum<1.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //独赢 & 进球 大 / 小 2.5
            case "MOUBHO":
            case "RMUBHO":
                if($kk>0 && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUBHU":
            case "RMUBHU":
                if($kk>0 && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUBCO":
            case "RMUBCO":
                if($kk<0 && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUBCU":
            case "RMUBCU":
                if($kk<0 && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUBNO":
            case "RMUBNO":
                if($kk==0 && $sum>2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUBNU":
            case "RMUBNU":
                if($kk==0 && $sum<2.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //独赢 & 进球 大 / 小 3.5
            case "MOUCHO":
            case "RMUCHO":
                if($kk>0 && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUCHU":
            case "RMUCHU":
                if($kk>0 && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUCCO":
            case "RMUCCO":
                if($kk<0 && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUCCU":
            case "RMUCCU":
                if($kk<0 && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUCNO":
            case "RMUCNO":
                if($kk==0 && $sum>3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUCNU":
            case "RMUCNU":
                if($kk==0 && $sum<3.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;

            //独赢 & 进球 大 / 小 4.5
            case "MOUDHO":
            case "RMUDHO":
                if($kk>0 && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUDHU":
            case "RMUDHU":
                if($kk>0 && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUDCO":
            case "RMUDCO":
                if($kk<0 && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUDCU":
            case "RMUDCU":
                if($kk<0 && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUDNO":
            case "RMUDNO":
                if($kk==0 && $sum>4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "MOUDNU":
            case "RMUDNU":
                if($kk==0 && $sum<4.5){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 双半场进球
     * @param $h
     * @param $c
     * @param $h_hr
     * @param $c_hr
     * @param $rtype
     * @return string
     */
    public function getSB($h,$c,$h_hr,$c_hr,$rtype){
        $rtype = strtoupper($rtype);
        $h1 = $h - $h_hr;
        $c1 = $c - $c_hr;
        $hAry = ["SBH","RSBH"];
        $cAry = ["SBC","RSBC"];
        $sta = "";
        if(in_array($rtype,$hAry)){
            if($h1>0 && $h_hr>0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif(in_array($rtype,$cAry)){
            if($c1>0 && $c_hr>0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 零失球获胜
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getWN($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $hAry = ["WNH","RWNH"];
        $cAry = ["WNC","RWNC"];
        $sta = "";
        if(in_array($rtype,$hAry)){//主队零失球获胜
            if($c==0 && $h>$c){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif(in_array($rtype,$cAry)){
            if($h==0 && $c>$h){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 零失球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getCS($h,$c,$rtype){
        $rtype = strtoupper($rtype);
        $hAry = ["CSH","RCSH"];
        $cAry = ["CSC","RCSC"];
        $sta = "";
        if(in_array($rtype,$hAry)){//主队零失球
            if($c==0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif(in_array($rtype,$cAry)){
            if($h==0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 赢得所有半场
     * @param $h
     * @param $c
     * @param $h_hr
     * @param $c_hr
     * @param $rtype
     * @return string
     */
    public function getWB($h,$c,$h_hr,$c_hr,$rtype){
        $h1 = $h_hr - $c_hr;
        $h2 = ($h-$h_hr) - ($c-$c_hr);
        $hAry = ["WBH","RWBH"];
        $cAry = ["WBC","RWBC"];
        $rtype = strtoupper($rtype);
        $sta = "";
        if(in_array($rtype,$hAry)){
            if($h1>0 && $h2>0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif(in_array($rtype,$cAry)){
            if($h1<0 && $h2<0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 赢得任一半场
     * @param $h
     * @param $c
     * @param $h_hr
     * @param $c_hr
     * @param $rtype
     * @return string
     */
    public function getWE($h,$c,$h_hr,$c_hr,$rtype){
        $h1 = $h_hr - $c_hr;
        $h2 = ($h-$h_hr) - ($c-$c_hr);
        $hAry = ["WEH","RWEH"];
        $cAry = ["WEC","RWEC"];
        $rtype = strtoupper($rtype);
        $sta = "";
        if(in_array($rtype,$hAry)){
            if($h1>0 || $h2>0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif(in_array($rtype,$cAry)){
            if($h1<0 || $h2<0){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 双重机会
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getDC($h,$c,$rtype){
        $sta = "";
        $rtype = strtoupper($rtype);
        $hn = ["DCHN","RDCHN"];//主/和
        $cn = ["DCCN","RDCCN"];//客/和
        $hc = ["DCHC","RDCHC"];//主/客
        $kk = $h - $c;
        if($kk>0){
            if(in_array($rtype,$hn) || in_array($rtype,$hc)){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }elseif($kk<0){
            if(in_array($rtype,$cn) || in_array($rtype,$hc)){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }else{
            if(in_array($rtype,$hn) || in_array($rtype,$cn)){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }

    /**
     * 净胜球数
     * @param $h
     * @param $c
     * @param $rtype
     * @param $wtype
     * @param $gtype
     * @return string
     */
    public function getWM($h,$c,$rtype,$wtype,$gtype){
        $rtype = strtoupper($rtype);
        $wtype = strtoupper($wtype);
        $gtype = strtoupper($gtype);
        $num = 3;
        $kk  = $h - $c;
        if($gtype == "BS"){
            $num = 4;
        }

        $_rtype = "";
        if($gtype == "BK"){
            $abs = abs($kk);
            if($h == 0 && $c == 0){
                $_rtype = "AN";
            }else if($kk == 0){
                $_rtype = "AN";
            }else{
                if($abs >= 26){
                    $idx = "OV";
                }else{
                    $idx = (string) ceil($abs / 5); // 1..5
                }
                $_rtype = ($kk > 0 ? "AH" : "AC") . $idx;
            }
        }else{
            if($h == 0 && $c == 0){
                $_rtype = 0;
            }else{
                if($kk>0){//主队净胜
                    if($kk<=$num) {
                        $_rtype = "H" . $kk;
                    }else{
                        $_rtype = "HOV";
                    }
                }else if($kk<0){//客队净胜
                    if(abs($kk)<=$num) {
                        $_rtype = "C" . abs($kk);
                    }else{
                        $_rtype = "COV";
                    }
                }else{
                    $_rtype = "N";
                }
            }
        }

        if($wtype.$_rtype == $rtype){
            $sta = "W";
        }else{
            $sta = "L";
        }

        return $sta;
    }


    /**
     * 波胆
     * @param $h
     * @param $c
     * @param $rtype
     * @param $wtype
     * @param $gtype
     * @return string
     */
    public function getPD($h,$c,$rtype,$wtype,$gtype="FT"){
        $sta = "";
        $rtype = strtoupper($rtype);
        $wtype = strtoupper($wtype);
        $gtype = strtoupper($gtype);
        switch ($gtype){
            case "BK":
                $rtype = str_replace("R","",$rtype);//滚球去掉"R"
                $pdh = ["PDH0","PDH1","PDH2","PDH3","PDH4","PDH5","PDH6","PDH7","PDH8","PDH9"];
                $pdc = ["PDC0","PDC1","PDC2","PDC3","PDC4","PDH5","PDH6","PDH7","PDH8","PDH9"];
                if(in_array($rtype,$pdh)){
					$zstr=substr($h,-1,1);
					if($zstr>=9){
						$str = "PDH".$zstr;
						$str1 = "PDH".($zstr-9);
					}else{
						$str = "PDH".$zstr;
						$str1 = "PDH".($zstr+9);
					}
                    
                    if($str == $rtype || $str1 == $rtype ){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if(in_array($rtype,$pdc)){
                   $zstr=substr($h,-1,1);
					if($zstr>=9){
						$str = "PDC".$zstr;
						$str1 = "PDC".($zstr-9);
					}else{
						$str = "PDC".$zstr;
						$str1 = "PDC".($zstr+9);
					}
                    
                    if($str == $rtype || $str1 == $rtype ){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }
                break;
            case "BM":
            case "VB":
            case "TT":
			case "TN":
                $str = $wtype.$h.$c;
                if($rtype == $str){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            default:
                $hc = "H{$h}C{$c}";
                switch ($wtype){
                    case "RPD":
                        $rtype = str_replace("R","",$rtype);
                        break;
                    case "HRPD":
                       $pdstr=substr($rtype,0,3);
						if($pdstr=="HRH"){
                       		$rtype = str_replace("HR","",$rtype);
						}else{
							$rtype = str_replace("R","",$rtype);
						}
						//echo $pdstr;exit;
                        break;
                }
                /*print_r($hc);
                print_r($rtype);*/
				
                if($wtype=="HPD" || $wtype=="HRPD"){//上半
                    if($h>20 || $c>20){//HOVH substr("HROVH",2) = "OVH"
                        $hv = ["OVH","HOVH"];
                        if(in_array($rtype,$hv)){
                            $sta = "W";
                        }else{
                            $sta = "L";
                        }
                    }else{
						//echo $rtype."-".$hc;exit;
                        if($rtype == $hc){
                            $sta = "W";
                        }else{
                            $sta = "L";
                        }
                    }
                }else{
                    if($h>20 || $c>20){//OVH substr("ROVH",2) = "OVH"
                        if($rtype=="OVH"){
                            $sta = "W";
                        }else{
                            $sta = "L";
                        }
                    }else{
                        if($rtype == $hc){
                            $sta = "W";
                        }else{
                            $sta = "L";
                        }
                    }
                }
                /*print_r($sta);exit;*/
                break;
        }


        return $sta;

    }

    /**
     * 半全场
     * @param $h
     * @param $c
     * @param $h_hr
     * @param $c_hr
     * @param $rtype
     * @param $wtype
     * @return string
     */
    public function getF($h,$c,$h_hr,$c_hr,$rtype,$wtype){
        $sta = "";
        $rtype = strtoupper($rtype);
        $wtype = strtoupper($wtype);
        $str = "";
        $h1 = $h_hr - $c_hr;//上半场 主队 - 客队
        $h2 = $h - $c;//全场  主队 - 客队

        //上半场
        if($h1>0){ //主队赢
            $str.= "H";
        }elseif($h1<0){//客队赢
            $str.= "C";
        }else{ //和
            $str.= "N";
        }

        //全场
        if($h2>0){ //主队赢
            $str.= "H";
        }elseif($h2<0){//客队赢
            $str.= "C";
        }else{ //和
            $str.= "N";
        }

        if($rtype == $wtype.$str){
            $sta = "W";
        }else{
            $sta = "L";
        }

        return $sta;
    }

    /**
     * 双方球队进球
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getTS($h,$c,$rtype){
        $sta = "";
        $rtype = strtoupper($rtype);
        $y = ["TSY","RTSY","HTSY","RTS2Y"];
        $n = ["TSN","RTSN","HTSN","RTS2N"];
        if($h>0 && $c>0){
            if(in_array($rtype,$y)){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }else{
            if(in_array($rtype,$n)){
                $sta = "W";
            }else{
                $sta = "L";
            }
        }

        return $sta;
    }



    /**
     * 单双/入球数
     * @param $h
     * @param $c
     * @param $rtype
     * @return string
     */
    public function getT($h,$c,$rtype){
        $sum = $h + $c;
        $sta = "";
        switch (strtoupper($rtype)){
            case "ODD"://单
            case "HODD"://单 - 上半
            case "RODD"://滚球 单
            case "HRODD"://滚球 单 - 上半
                if($sum%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "EVEN"://双
            case "HEVEN"://双 - 上半
            case "REVEN"://滚球 双
            case "HREVEN"://滚球 双 - 上半
                if($sum%2==1){
                    $sta = "L";
                }else{
                    $sta = "W";
                }
                break;
            case "0~1":
            case "R0~1":
                if($sum>=0 && $sum<=1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "2~3":
            case "R2~3":
                if($sum>=2 && $sum<=3){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "4~6":
            case "R4~6":
                if($sum>=4 && $sum<=6){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "OVER":
            case "ROVER":
                if($sum>=7){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "HT0":
            case "HRT0":
                if($sum==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "HT1":
            case "HRT1":
                if($sum==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "HT2":
            case "HRT2":
                if($sum==2){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "HTOV":
            case "HRTOV":
                if($sum>=3){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
			case "RDT0":
                if($sum==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
			case "RDT1":
                if($sum==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
			case "RDT2":
                if($sum==2){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
			case "RDTOV":
                if($sum>=3){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
				
        }

        return $sta;
    }
	 public function getE($h,$c,$rtype){
        $sta = "";
         switch (strtoupper($rtype)){
            case "EOHO"://
            case "HEOHO"://
				if($h%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "EOHE"://
            case "HEOHE"://
				if($h%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "EOCO"://
            case "HEOCO"://
				if($c%2==1){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
            case "EOCE"://
            case "HEOCE"://
                if($c%2==0){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
                break;
        }

        return $sta;
    }

    /**
     * 大小类
     * @param $h 主队比分
     * @param $c 客队比分
     * @param $rtype
     * @param $spread
     * @return string
     */
    public function getOU($h,$c,$rtype,$spread){
        $o = [
            "OUC","HOUC","ROUC","HROUC",
            "AOUO","BOUO","COUO","DOUO","EOUO","FOUO",
            "AROUO","BROUO","CROUO","DROUO","EROUO","FROUO",
            "OUHO","OUCO","HOUHO","HOUCO",
            "ROUHO","ROUCO","HRUHO","HRUCO",
            "TARUO","TBRUO","TDRUO","TERUO",//5分钟盘口 大
        ];

        $u = [
            "OUH","HOUH","ROUH","HROUH",
            "AOUU","BOUU","COUU","DOUU","EOUU","FOUU",
            "AROUU","BROUU","CROUU","DROUU","EROUU","FROUU",
            "OUHU","OUCU","HOUHU","HOUCU",
            "ROUHU","ROUCU","HRUHU","HRUCU",
            "TARUU","TBRUU","TDRUU","TERUU",//5分钟盘口 小
        ];
        $sta = "";
        $spread = str_replace(" ","",$spread);
        $radioAry = explode("/",$spread);
        $rtype = strtoupper($rtype);
        $sum = $h + $c;
        if(count($radioAry) == 1){
            $ra1 = $radioAry[0];
            $kk = $sum - $ra1;
            if($kk>0){
                if(in_array($rtype,$o)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
            }elseif($kk<0){
                if(in_array($rtype,$u)){
                    $sta = "W";
                }else{
                    $sta = "L";
                }
            }else{
                $sta = "T";
            }
        }else{
            $ra1 = $radioAry[0];
            $ra2 = $radioAry[1];
            if(ceil($ra1) == $ra1){// 0/0.5
                $kk = $sum - $ra1;
                if($kk>0){
                    if(in_array($rtype,$o)){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if($kk<0){
                    if(in_array($rtype,$u)){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    if(in_array($rtype,$o)){
                        $sta = "HL";
                    }else{
                        $sta = "HW";
                    }
                }
            }else{// 0.5/1
                $kk = $sum - $ra2;
                if($kk>0){
                    if(in_array($rtype,$o)){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if($kk<0){
                    if(in_array($rtype,$u)){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    if(in_array($rtype,$o)){
                        $sta = "HW";
                    }else{
                        $sta = "HL";
                    }
                }
            }
        }

        return $sta;
    }



    /**
     * 让球类
     * @param $h 主队比分
     * @param $c 客队比分
     * @param $strong H:主客比分,C:客主交换比分
     * @param $rtype
     * @param $spread
     * @return string
     */
    public function getR($h,$c,$strong,$rtype,$spread){
        $sta = "T";
        $spread = str_replace(" ","",$spread);
        $radioAry = explode("/",$spread);
        $rtype = strtoupper($rtype);
        $_strong = strtoupper($strong);
        if(strtoupper($_strong) == "C"){//客让主
            $k = $c - $h;
        }else{
            $k = $h - $c;
        }

        $rh = [
            "RH","REH","HRH","HREH",
            "ARH","AREH","BRH","BREH","CRH","CREH","DRH","DREH","ERH","EREH","FRH","FREH"
        ];
        $rc = [
            "RC","REC","HRC","HREC",
            "ARC","AREC","BRC","BREC","CRC","CREC","DRC","DREC","ERC","EREC","FRC","FREC"
        ];

        if(in_array($rtype,$rh)){ //主队
            $chose_team = "H";
        }else{
            $chose_team = "C";
        }

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

        if(count($radioAry)==1){
            $ra1 = $radioAry[0];
            $kk = $k - $ra1;

            if(strpos($ra1,".5") !== false){//让半
                //只有大于或小于0 不会存在等于0
                if($kk>0){
                    if($strong=="Y"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    if($strong=="N"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }
            }else{ //让整

                if($kk>0){
                    if($strong=="Y"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if($kk<0){
                    if($strong=="N"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    $sta = "T";
                }
            }

        }else{ // 0/0.5
            $ra1 = $radioAry[0];
            $ra2 = $radioAry[1];

            if(strpos($ra2,".5") !== false) {// 让整/让半(0/0.5)
                $kk = $k - $ra1;
                if($kk>0){
                    if($strong=="Y"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if($kk<0){
                    if($strong=="N"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    if($strong=="Y"){
                        $sta = "HL";//输一半
                    }else{
                        $sta = "HW";//赢一半
                    }
                }
            }else{ // 让半/让整(0.5/1)
                $kk = $k - $ra2;
                if($kk>0){
                    if($strong=="Y"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else if($kk<0){
                    if($strong=="N"){
                        $sta = "W";
                    }else{
                        $sta = "L";
                    }
                }else{
                    if($strong=="Y"){
                        $sta = "HW";//赢一半
                    }else{
                        $sta = "HL";//输一半
                    }
                }
            }
        }

        return $sta;
    }

    /**
     * 独赢类
     * @param $h 主队比分
     * @param $c 客队比分
     * @param $r rtype
     * @return string
     */
    public function getM($h,$c,$r){
        $h = intval($h);
        $c = intval($c);
        $r = strtoupper($r);
        $s = "T";//T:和,W:赢,L:输

        //主队赢
        $mh = [
            "MH","HMH",
            "RMH","HRMH",
            "RFA01H","RFA02H","RFA03H","RFA04H","RFA05H","RFA06H","RFA07H","RFA08H","RFA09H","RFA10H","RFA11H",
            "RFA12H","RFA13H","RFB01H","RFB02H","RFB03H","RFB04H","RFB05H","RFB06H","RFB07H","RFB08H","RFB09H",
            "RFB10H","RFB11H","RFB12H","RFB13H","RFC01H","RFC02H","RFC03H","RFC04H","RFC05H","RFC06H","RFC07H",
            "RFC08H","RFC09H","RFC10H","RFC11H","RFC12H","RFC13H","RFC14H","RFC15H","RFC16H","RFC17H","RFC18H",
            "RFC19H","RFC20H","RFC21H","RFC22H","RFC23H","RFC24H","RFC25H","RFC26H","RFC27H","RFC28H","RFC29H",
            "RFC30H","RFC31H","RFC32H","RFC33H","RFC34H","RFC35H","RFC36H","RFC37H","RFC38H","RFC39H","RFC40H",
            "RFC41H","RFC42H","RFC43H","RFC44H","RFC45H","RFC46H","RFC47H","RFC48H","RFC49H","RFC50H","RFD01H",
            "RFD02H","RFD03H","RFD04H","RFD05H","RFD06H","RFD07H","RFD08H","RFD09H","RFD10H","RFD11H","RFD12H",
            "RFD13H","RFE01H","RFE02H","RFE03H","RFE04H","RFE05H","RFE06H","RFE07H","RFE08H","RFE09H","RFE10H",
            "RFE11H","RFE12H","RFE13H","RFE14H","RFE15H","RFE16H","RFE17H","RFE18H","RFE19H","RFE20H","RFE21H",
            "RFE22H","RFE23H","RFE24H","RFE25H","RFE26H","RFE27H","RFE28H","RFE29H","RFE30H","RFE31H","RFE32H",
            "RFE33H","RFE34H","RFE35H","RFE36H","RFE37H","RFE38H","RFE39H","RFE40H","RFE41H","RFE42H","RFE43H",
            "RFE44H","RFE45H","RFE46H","RFE47H","RFE48H","RFE49H","RFE50H",
            //15分钟
            "AMH","BMH","CMH","DMH","EMH","FMH",
            "ARMH","BRMH","CRMH","DRMH","ERMH","FRMH",
            //进球最多半场
            "MGH","RMGH","HGH","RHGH"
        ];

        //客队赢
        $mc = [
            "MC","HMC",
            "RMC","HRMC",
            "RFA01C","RFA02C","RFA03C","RFA04C","RFA05C","RFA06C","RFA07C","RFA08C","RFA09C","RFA10C","RFA11C",
            "RFA12C","RFA13C","RFB01C","RFB02C","RFB03C","RFB04C","RFB05C","RFB06C","RFB07C","RFB08C","RFB09C",
            "RFB10C","RFB11C","RFB12C","RFB13C","RFC01C","RFC02C","RFC03C","RFC04C","RFC05C","RFC06C","RFC07C",
            "RFC08C","RFC09C","RFC10C","RFC11C","RFC12C","RFC13C","RFC14C","RFC15C","RFC16C","RFC17C","RFC18C",
            "RFC19C","RFC20C","RFC21C","RFC22C","RFC23C","RFC24C","RFC25C","RFC26C","RFC27C","RFC28C","RFC29C",
            "RFC30C","RFC31C","RFC32C","RFC33C","RFC34C","RFC35C","RFC36C","RFC37C","RFC38C","RFC39C","RFC40C",
            "RFC41C","RFC42C","RFC43C","RFC44C","RFC45C","RFC46C","RFC47C","RFC48C","RFC49C","RFC50C","RFD01C",
            "RFD02C","RFD03C","RFD04C","RFD05C","RFD06C","RFD07C","RFD08C","RFD09C","RFD10C","RFD11C","RFD12C",
            "RFD13C","RFE01C","RFE02C","RFE03C","RFE04C","RFE05C","RFE06C","RFE07C","RFE08C","RFE09C","RFE10C",
            "RFE11C","RFE12C","RFE13C","RFE14C","RFE15C","RFE16C","RFE17C","RFE18C","RFE19C","RFE20C","RFE21C",
            "RFE22C","RFE23C","RFE24C","RFE25C","RFE26C","RFE27C","RFE28C","RFE29C","RFE30C","RFE31C","RFE32C",
            "RFE33C","RFE34C","RFE35C","RFE36C","RFE37C","RFE38C","RFE39C","RFE40C","RFE41C","RFE42C","RFE43C",
            "RFE44C","RFE45C","RFE46C","RFE47C","RFE48C","RFE49C","RFE50C",
            "AMC","BMC","CMC","DMC","EMC","FMC",
            "ARMC","BRMC","CRMC","DRMC","ERMC","FRMC",
            "MGC","RMGC","HGC","RHGC"
        ];

        //和局
        $mn = [
            "MN","HMN",
            "RMN","HRMN",
            "AMN","BMN","CMN","DMN","EMN","FMN",
            "ARMN","BRMN","CRMN","DRMN","ERMN","FRMN",
            "MGN","RMGN",
        ];

        $hgAry = ["HGH","RHGH","HGC","RHGC"];
        $k = $h - $c;
        if($k>0){
            if(in_array($r,$mh)){
                $s = "W";
            }else{
                $s = "L";
            }
        }elseif($k<0){
            if(in_array($r,$mc)){
                $s = "W";
            }else{
                $s = "L";
            }
        }else{
            if(in_array($r,$hgAry)){ //最多进球的半场 和局视为无效
                $s = "T";
            }else{
                if(in_array($r,$mn)){
                    $s = "W";
                }else{
                    $s = "L";
                }
            }

        }

        return $s;
    }
	public function getPtwTypeByCode($code, $data) {
        if (preg_match('/RPTW([A-C])(\d{2})/', $code, $matches)) {
            $set = $matches[1]; // 局数(A/B/C)
            $point = intval($matches[2]); // 分数(03->3)

            if (isset($data['rs_more'][$set]['PTW'])) {
                // 遍历该局的PTW数据，查找匹配的分数
                foreach ($data['rs_more'][$set]['PTW'] as $item) {
                    if ($item['point'] == $point) {
                        return $item['type'];
                    }
                }
            }
        }
        return null;
    }


}
