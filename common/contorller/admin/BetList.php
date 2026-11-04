<?php


class BetList extends Base
{
    private $betTable;

    private $betTable3;

    public function __construct($_p = [])
    {
        parent::__construct($_p);
        $this->betTable = Constant::T_BET;
        $this->betTable3 = Constant::T_BET_P3;
    }

    public function delete_bet_list(){
        $_p = $this->param;
        $datetime = strtotime($_p["date"]);
        switch ($_p["showtype"]){
            case "log":
                $ary = [
                    Constant::T_ADMIN_LOGIN_LOG,Constant::T_ADMIN_RECORD,
                    Constant::T_RANK_LOGIN_LOG,Constant::T_RANK_RECORD,
                    Constant::T_MEMBER_LOGIN_LOG,Constant::T_MEMBER_RECORD
                ];
                $where = "`logintime`<'{$datetime}' AND `nid` LIKE '{$this->sup["nid"]}%'";
                $name = "日志";
                break;
            case "bet":
                $ary = [Constant::T_BET,Constant::T_BET_P3];
                $where = "`m_date`<'{$_p["date"]}' AND `nid` LIKE '{$this->sup["nid"]}%'";
                $name = "注单";
                break;
            case "mes":
                $ary = [Constant::T_MESSAGE,Constant::T_CHAT];
                $where = "`ntime`<'{$datetime}' AND ((`type`=4 AND `nid` LIKE '{$this->sup["nid"]}%') OR `type`<4)";
                $name = "公告";
                break;
            case "match":
                global $match_ary;
                $ary = array_merge(array_column($match_ary,"table"),array_column($match_ary,"table_xml"));
                $where = "`m_date`<'{$_p["date"]}'";
                $name = "赛程";
                break;
            default:
                return ["status"=>"error","msg"=>"参数错误"];
        }

        $this->dbc->beginTransaction();
        try{
            foreach ($ary as $t){
                if($t == Constant::T_CHAT){
                    $this->dbc->delete($t,"`time`<'{$datetime}'");
                }else{
                    $this->dbc->delete($t,$where);
                }
            }
            $this->insertLog("清理[{$_p["date"]}]之前的[$name]");
            $this->dbc->commit();
            return ["status"=>"success","msg"=>"[{$_p["date"]}]之前的[$name]清理成功"];
        }catch (\Exception $e){
            $this->dbc->rollback();
            return ["status"=>"error","msg"=>$e->getMessage()];
        }
    }

    /**
     * 下级账号查询
     * @return array
     */
    public function get_downline(){
        $lv = lv_nid($this->sup["nid"]);
        $downTable = Constant::T_RANK;
        $where = "`nid` LIKE '{$this->sup["nid"]}%'";
        $isMaster = " AND `isMaster`=0";
        switch ($lv["lv"]){
            case Constant::ADS:
            case Constant::AD:
                $where.= " AND `level`=4";//分公司
                break;
            case Constant::D0:
                $where.= " AND `level`=3";//股东
                break;
            case Constant::CO:
                $where.= " AND `level`=2";//总代理
                break;
            case Constant::SU:
                $where.= " AND `level`=1";//代理
                break;
            case Constant::AG:
                $isMaster = "";
                $downTable = Constant::T_MEMBER;
                break;
        }

        $rs = $this->dbc->select("SELECT `alias`,`id`,`name` AS `username`  FROM {$downTable} WHERE {$where} {$isMaster}");
        if($rs){
            $ary = [];
            foreach ($rs as $v){
                $ary[$v["id"]] = $v;
            }
            return $ary;
        }else{
            return [];
        }
    }


    /**
     * 流水注单
     * @return array
     */
    public function get_bet_list(){
        global $ls_ag_ary,$bet_status,$ls_account_ary,$bet_p3_wtype,$artjson,$sport_tables,$ls_game_ary,$bet_result,$result_status;
        $_p = $this->param;
        $start_time = microtime(true);
        $gtype = isset($_p["gtype"]) ?  strtoupper($_p["gtype"]) : "ALL";
        $p_result =  isset($_p["result"]) ?  strtoupper($_p["result"]) : 0;
        $totalBets = isset($_p["totalBets"]) && !empty($_p["totalBets"]) ? strtoupper($_p["totalBets"]) : "LIST";
		if($totalBets == "undefined"){
			$totalBets = "LIST";
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
        $smn = $this->son_nid_manger();
        $ov = new OverView($_p);
        $ary = [
            "downline" => [],
            "wagers"=> [],
            "league"=>[],
            "event"=>[],
            "dates"=>[]
        ];

        $edit_bet_layer = $this->edit_bet_layer();
        $ary["header"] = $edit_bet_layer["td_head"];
        $where = "`nid` LIKE '{$this->sup["nid"]}%'";

        
        $date = date("Y-m-d",strtotime("-2 hours"));
        if(!isset($_p["date"]) || empty($_p["date"])){ 
            $where.= " AND `m_date`='{$date}'";
        }else{ 
            switch($_p["date"]){ 
                case "FULL"://早盘
                    $where.= " AND `m_date`>'{$date}'";
                    break;
                case "TODAY"://今日
                    $where.= " AND `m_date`='{$date}'";
                    break;
                case "YESTERDAY"://昨日
                    $date = date("Y-m-d", strtotime("-26 hours"));
                    $where.= " AND `m_date`='{$date}'";
                    break;
                default:
                    $cdate = date_create($_p["date"]);
                    $isValid = $cdate && ($_p["date"] === date_format($cdate, 'Y-m-d'));
                    if($isValid){ 
                        $where.= " AND `m_date`='{$_p["date"]}'";
                    }else{ 
                        $where.= " AND `m_date`='{$date}'";
                    }
                    break;
            }
        }
        

        // $date = date("Y-m-d",strtotime("-1 day")); //只能查询昨天和今天的注单 避免数据太多
        // $where.= " AND `m_date`>='{$date}'";
        $where.= $this->hidden_layer();
        if(isset($_p["username"])){
            if(empty($_p["username"])){return $ary;}
            $where.= " AND `m_name`='{$_p["username"]}'";
			  $ary["downline"] = $ov->get_downline();
        }else{
            $ary["downline"] = $ov->get_downline();
        }
        if($gtype!="ALL"){
            if($gtype == "FS"){
                $where.= " AND `wtype`='FS' AND `gnum_c`=0";
            }else{
                $where.= " AND `gtype`='{$gtype}'";
            }
        }
        // if(strtoupper($p_result) == "ALL") {//只能查询今日的全部
        
        // }
        $log = "注单管理->";
        switch ($totalBets){
            case "EDIT"://改单注单
                if(strtoupper($p_result) != "ALL") {
                    if (is_numeric($p_result)) {
                        $where .= " AND `isResult`={$p_result}";
                    }else{
                        $where .= " AND `result`='{$p_result}'";
                    }
                }
                $where.= " AND `isEdit`=1 AND `edit_layer`>0";
                $log.= "改单注单[查询]";
                break;
            case "ABNORMAL"://异常注单
                $where.= " AND `status`>0";
                $log.= "异常注单[查询]";
                break;
            case "LIVE"://滚球危险球
                if(strtoupper($p_result) != "ALL") {
                    if (is_numeric($p_result)) {
                        $where .= " AND `isResult`={$p_result}";
                    }else{
                        $where .= " AND `result`='{$p_result}'";
                    }
                }
                $where.=" AND `danger`=2";
                break;
            default://流水注单
                if(strtoupper($p_result) != "ALL") {
                    if (is_numeric($p_result)) {
                        $where .= " AND `isResult`={$p_result}";
                    }else{
                        $where .= " AND `result`='{$p_result}'";
                    }
                }
                $log.= "流水注单[查询]";
                break;
        }
        if(isset($_p["username"])){
            $log = "线上会员->投注[会员：{$_p["username"]}]->注单列表";
        }
        $this->insertLog($log);
        // 分页参数
        $page = isset($_p["page"]) && is_numeric($_p["page"]) ? max(1, intval($_p["page"])) : 1;
        $pageSize = isset($_p["pageSize"]) && is_numeric($_p["pageSize"]) ? min(500, max(10, intval($_p["pageSize"]))) : 200;
        $offset = ($page - 1) * $pageSize;
        // 先查总数
        $countRs = $this->dbc->select("SELECT COUNT(*) AS `cnt` FROM {$this->betTable} WHERE {$where}", "Row");
        $ary["total"] = $countRs ? intval($countRs["cnt"]) : 0;
        $ary["page"] = $page;
        $ary["pageSize"] = $pageSize;
        $rs = $this->dbc->select("SELECT * FROM {$this->betTable} WHERE {$where} ORDER BY `bet_time` DESC LIMIT {$offset},{$pageSize}");
        // print_r("SELECT * FROM {$this->betTable} WHERE {$where} ORDER BY `bet_time` DESC");exit;
        if($rs){
            // $end_time = microtime(true)-$start_time;
            // $start_time = microtime(true);
            // print_r("1-阶段使用了{$end_time}秒".count($rs)."asdfl\n");
            $ut = new Util_game();
            $bs = new Bet($this->param);
            $wagers = [];
            $lids = [];
            $event = [];
            $cname = [];
            $dates = [];
            $count = 0;
            
            // 预加载 P3 过关注单子单（批量查询替代 N+1）
            $p3Ids = [];
            foreach ($rs as $v) {
                if (strtoupper($v["wtype"]) == "P3") {
                    $p3Ids[] = $v["ID"];
                }
            }
            $p3Map = [];
            if (!empty($p3Ids)) {
                $p3IdStr = implode(',', $p3Ids);
                $p3All = $this->dbc->select("SELECT * FROM {$this->betTable3} WHERE `p3id` IN ({$p3IdStr})");
                if ($p3All) {
                    foreach ($p3All as $p3Row) {
                        $p3Map[$p3Row["p3id"]][] = $p3Row;
                    }
                }
            }

            // 预加载赛事信息（批量查询替代 N+1）
            $gidList = [];
            foreach ($rs as $v) {
                if ($v["gid"] > 0 && !isset($gidList[$v["gid"]])) {
                    $gidList[$v["gid"]] = $v;
                }
            }
            $matchMap = [];
            if (!empty($gidList)) {
                $gidGroups = []; // 按 matchTable 分组
                foreach ($gidList as $gid => $v) {
                    $matchTable = null;
                    if ($v["gnum_c"] > 0 && $v["showtype"] != "fs") {
                        if ($gtype == "ALL") {
                            if (isset($sport_tables[$v["gtype"]]["table"])) {
                                $matchTable = $sport_tables[$v["gtype"]]["table"];
                            }
                        } else {
                            if (isset($sport_tables[$gtype]["table"])) {
                                $matchTable = $sport_tables[$gtype]["table"];
                            }
                        }
                    }
                    if ($matchTable) {
                        $gidGroups[$matchTable][] = "'" . addslashes($v["gidm"]) . "'";
                    }
                }
                foreach ($gidGroups as $mTable => $gidmArr) {
                    $gidmStr = implode(',', array_unique($gidmArr));
                    $matchRs = $this->dbs->select("SELECT `team_h{$cs}` AS `team_h`,`team_c{$cs}` AS `team_c`,`gid`,`ptype{$cs}` AS `ptype`,`gidm` FROM {$mTable} WHERE `gidm` IN ({$gidmStr}) AND `master`='Y'");
                    if ($matchRs) {
                        foreach ($matchRs as $mRow) {
                            $matchMap[$mRow["gidm"]] = $mRow;
                        }
                    }
                }
            }

            // get_downline 移到循环外（结果不依赖单条注单）
            $downlines = $ov->get_downline();

            foreach ($rs as $v) {
                $isOK = "N";
                if($smn === false){
                    $isOK = "Y";
                }else{
                    $nid = $this->get_manger_acc_nid(Constant::MEM,$v["nid"]);
                    if(in_array($nid,$smn)){
                        $isOK = "Y";
                    }
                }
                
                if($isOK == "Y") {
                    $count++;
                    if (!isset($lids[$v["lid"]]) && $v["lid"] > 0) {
                        $lids[$v["lid"]] = [
                            "id" => $v["lid"],
                            "name" => $v["league{$cs}"]
                        ];
                    }

                    if (!empty($v["m_date"]) && !isset($dates[$v["m_date"]])) {
                        $dates[$v["m_date"]] = [
                            "id" => $v["m_date"],
                            "name" => $v["m_date"]
                        ];
                    }

                    $isResult = "N";
                    if ($v["isResult"] == 1) {
                        $isResult = "Y";
                    }
                    $arr = [];
                    $td_content = "";
                    $style = "style='display: inline-block;padding: 6px 0px;font-size: 14px;margin: 0 2px;cursor:pointer'";
                    if (count($edit_bet_layer["td_content"]) > 0) {
                        $arr["BETTIME"] = date("Y-m-d H:i:s", $v["bet_time"]);
                        $arr["WTYPE"] = $v["wtype"];
                        $arr["GTYPE"] = $v["gtype"];
                        $arr["RTYPE"] = $v["rtype"];
			
						if(isset($_p["totalBets"]) && strtoupper($_p["totalBets"]) == "LIST"){ 
							if ($this->login_layer != Constant::D0 || array_key_exists('tiandan', $edit_bet_layer["td_content"])) {
								$edit_bet_layer["td_content"]["add"] = "添单";
							}
						}
						
                        foreach ($edit_bet_layer["td_content"] as $tk => $tv) { 
                            $str_tk = "<a id='{$tk}_{$v["ID"]}' class='word_red word_bold500' {$style}>{$tv}</a> / ";
                            switch ($tk) {
                                case "manage"://注单处理
								    if ($this->login_layer != Constant::D0 || array_key_exists('zhudan', $edit_bet_layer["td_content"])) {
										$select = "<select id=\"manage_{$v["ID"]}\" class='word_blue word_bold500 txtc' style='border: 0px;margin: 2px 2px 0px 2px;padding: 6px 0px;BACKGROUND-COLOR: transparent;'>";
										foreach ($result_status[$this->langx] as $kk => $vv) {
											$selected = "";
											if ($kk == $v["status"]) {
												$selected = "selected";
											}
											if ($kk == 0) {
												$value = "正常注单";
												switch ($this->langx) {
													case "zh-tw":
														$value = "正常註單";
														break;
													case "en-us":
														$value = "Normal";
														break;
												}
												$select .= "<option style='color: #000000' value =\"{$kk}\" {$selected}>{$value}</option>";
											} else {
												$select .= "<option style='color: #000000' value =\"{$kk}\" {$selected}>{$vv}</option>";
											}

										}
										$select .= "</select>";
										$td_content = rtrim($td_content, " / ");
										$td_content .= "<br>";
										$td_content .= $select;
									}
                                    break;
                                case "swap"://对调
                                    if (count($ut->get_wtype_swap($v["wtype"], $v["rtype"], $v["gtype"])) > 0) {//允许对调
                                        $td_content .= $str_tk;
                                    }
                                    break;
                                case "hidden"://隐藏/显示
                                    if ($v["hidden"] == 1) {
                                        $td_content .= "<a id='{$tk}_{$v["ID"]}' class='word_red word_bold500' {$style}>显示</a> / ";
                                    } else {
                                        $td_content .= $str_tk;
                                    }
                                    break;
									
                                case "zhudan":
								case "tiandan":
                                    break;
									
                                default: 
                                    $td_content .= $str_tk;
                                    break;
                            }

                        }
                        $td_content = rtrim($td_content, " / ");
                    }
                    $arr["TD_CONTENT"] = $td_content;
                    $arr["ID"] = $v["ID"];
                    if ($totalBets == "EDIT" && $v["isEdit"] == 1) {
                        if (!isset($cname[$v["edit_name"]])) {
                            global $tables;
                            $c_name = "";
                            $lay = edit_layer_num_str($v["edit_layer"]);
                            if (!empty($lay)) {
                                $c_name .= $tables[$lay]["name"] . " ";
                            }
                            if ($v["isEditSon"] == 1 && !empty($v["edit_son_name"])) {
                                $c_name .= "子:{$v["edit_son_name"]}[主:{$v["edit_name"]}]";
                            } else {
                                $c_name .= "主:{$v["edit_name"]}";
                            }
                            $cname[$v["edit_name"]] = [
                                "id" => $v["edit_name"],
                                "username" => "主:" . $v["edit_name"],
                                "alias" => "子:" . (empty($v["edit_son_name"]) ? "无" : $v["edit_son_name"]),
                                "name1" => $c_name
                            ];
                        }
                        $str = "";
                        switch ($v["edit_type"]) {
                            case 1:
                                $str = " - [对调]";
                                break;
                            case 2:
                                $str = " - [修改]";
                                break;
                            case 3:
                                $str = " - [隐藏]";
                                break;
                        }
                        $arr["CNAME"] = $v["edit_name"];
                        $arr["CTYPE"] = $v["edit_type"];
                        $arr["EDITLOG"] = $cname[$v["edit_name"]]["name1"] . $str;
                    }

                    $arr["TID"] = substr($v["ticket_id"], 2);
                    $arr["WAGERS_ID"] = substr($v["ticket_id"], 2);
                    $arr["DATE"] = date("m-d-Y", $v["bet_time"]);
                    $arr["TIME"] = date("H:i:s", $v["bet_time"]);
                    $arr["SRV_IP"] = $v["bet_ip"];
                    $arr["NAME0"] = $v["m_name"];
                    $arr["ALIAS0"] = null;
                    $arr["HIDDEN"] = $v["hidden"];
                    $arr["M_TYPE"] = $v["ltype"];
                    $arr["IN_RADIO"] = $v["mem_turn_rate"];
                    $arr["ODDF_TYPE"] = $ls_ag_ary["oddf_" . $v["odd_f_type"]];
                    $arr["GOLD"] = number_format($v["bet_golds"], 1);
                    $arr["GOLD1"] = number_format($v["bet_golds"], 1);
                    $arr["GT"] = $ls_ag_ary["str_{$v["gtype"]}"];
                    $arr["FS_DIS"] = "";
                    if ($v["wtype"] == "FS" || $v["wtype"] == "SP") {
                        $arr["FS_DIS"] = "hide_item";
                    }
                    $arr["DIS_GT"] = "hide_item";
                    $arr["test"] = "";

                    $arr["RESULT_WL"] = "-";
                    $arr["RESULT_WL_CLASS"] = "";
                    $arr["RESULT_DATA"] = null;
                    $arr["SETTLED"] = $v["isResult"] == 1 ? "Y" : "N";
                    $arr["BALL_ACT"] = "";
                    $arr["K_WIN_GOLD"] = number_format($v["win_gold"], 1);
                    $arr["WIN_GOLD_CLASS"] = "word_red";
                    $arr["WIN_GOLD"] = "未结算";

                    $arr["CANCEL_MSG"] = "";
                    $arr["CANCEL_APN"] = "";
                    $arr["CANCEL_DIS"] = "style='display:none'";

                    $arr["IS_P"] = "";
                    if ($v["gnum_c"] == 0 && $v["showtype"] == "fs") {
                        $arr["GTYPE"] = "FS";
                    } else {
                        $arr["GTYPE"] = $v["gtype"];
                    }

                    if ($v["showtype"] == "live") {
                        $arr["MARKET"] = "rb";
                    } else {
                        if ($v["m_date"] > date("Y-m-d")) {
                            $arr["MARKET"] = "fu";
                        } else {
                            $arr["MARKET"] = "ft";
                        }
                    }


                    if (strtoupper($v["wtype"]) != "P3") {
                        $xml = $bs->get_bet_wagers($v, $isResult, '', "Y");
                        $wagers_type = getXmlNode($xml, "wtype");
                        $league = getXmlNode($xml, "league");
                        $team_h = getXmlNode($xml, "team_h_show");
                        $team_c = getXmlNode($xml, "team_c_show");
                        $team_h_ratio = getXmlNode($xml, "team_h_ratio");
                        $team_c_ratio = getXmlNode($xml, "team_c_ratio");
                        $score = getXmlNode($xml, "score");
						       $orgscore = getXmlNode($xml, "orgscore");
                        $ioratio = getXmlNode($xml, "ioratio");
                        $result = getXmlNode($xml, "result");
                        $spread = "";
                        if ($ut->checkWtypeIsOU($v["wtype"]) || $v["wtype"] == "W3") {//大小、3项让球
                            $result = getXmlNode($xml, "rtype_name");
                            $spread = getXmlNode($xml, "spread_name");
                        }
                        $arr["WAGERS_TYPE"] = $wagers_type;
                        $tname0 = "{$league}<br>";
                        if ($arr["GTYPE"] == "FS") {
                            $tname1 = "";
                        } else {
                            $tname1 = "<li class=\"re_betdetail_liMini\">[{$v["gnum_h"]}] vs [{$v["gnum_c"]}]</li>";
                        }

                        $tname2 = "";
                        if ($v["wtype"] != "FS") {
                            $tname2 = "<li>{$team_h} ";
                            if (!empty($team_h_ratio) || is_numeric($team_h_ratio)) {
                                $tname2 .= "<tt class=\"word_red\">{$team_h_ratio}</tt> ";
                            }
                            $tname2 .= "v  {$team_c} ";
                            if (!empty($team_c_ratio) || is_numeric($team_c_ratio)) {
                                $tname2 .= "<tt class=\"word_red\">{$team_c_ratio}</tt>";
                            }

                            $tname2 .= "<tt class=\"word_green\"></tt>";
                            $tname2 .= "<tt class=\"word_blue\">{$score}</tt>";
                            $tname2 .= "</li>";
                        }

                        $tname3 = "<li class=\"re_betdetail_liBold\">{$result} ";
                        $tname3 .= "<tt class=\"word_red\">{$spread}</tt> ";
                        $tname3 .= "@ <tt class=\"word_red\">{$ioratio}</tt>";
                        $tname3 .= "</li>";
                        $tname3 .= "<li class=\"re_betdetail_liMini\">{$wagers_type}</li>";
                        $tname = $tname0 . $tname1 . $tname2 . $tname3;
                        $arr["TNAME"] = $tname;

                        if ($v["status"] == 0 && $v["cancel"] == 0) {//注单有效
                            if ($v["isResult"] == 1) {
                                $arr["WIN_GOLD"] = number_format($v["mem_result"] ?? 0, 1);
                                $result_data = str_replace($ls_game_ary["showtype_live"], "", getXmlNode($xml, "result_data"));
                                // 检查result值是否有效
                                if (isset($bet_result[$v["result"]]) && !empty($v["result"])) {
                                    $arr["RESULT_WL"] = "{$bet_result[$v["result"]]}<br>{$result_data}";
                                    switch ($v["result"]) {
                                        case "L":
                                        case "HL":
                                            $arr["WIN_GOLD_CLASS"] = $arr["RESULT_WL_CLASS"] = "word_red";
                                            break;
                                        case "W":
                                        case "HW":
                                            $arr["WIN_GOLD_CLASS"] = $arr["RESULT_WL_CLASS"] = "word_green";
                                            break;
                                        default:
                                            $arr["WIN_GOLD"] = $bet_result[$v["result"]];
                                            $arr["RESULT_WL_CLASS"] = "";
                                            $arr["WIN_GOLD_CLASS"] = "";
                                            break;
                                    }
                                } else {
                                    // result值无效时显示默认值
                                    $arr["RESULT_WL"] = "已结算<br>{$result_data}";
                                }

                            }

                        } else {
                            $arr["CANCEL_MSG"] = "<font class=\"word_red txtBold\">{$bet_status[$v["status"]]}</font>";
                            $arr["CANCEL_APN"] = "";
                            $arr["CANCEL_DIS"] = "style='display:none'";
                            $arr["WIN_GOLD"] = $bet_status[$v["status"]] ?? "未确认";
                            $arr["WIN_GOLD_CLASS"] = "word_red";
                            $arr["GOLD"] = "<s>" . number_format($v["bet_golds"], 1) . "</s>";
                        }

                        $arr["BALL_ACT"] = "";
                        $arr["CANCEL_MSG"] = "";
                        switch ($v["danger"]) {
                            case 3:
                                $arr["BALL_ACT"] = "<font class=\"word_green txtBold\">{$ls_account_ary["today_wagers_A"]}</font>";
                                break;
                            case 2:
                                $arr["BALL_ACT"] = "<font class=\"word_red txtBold\">{$ls_account_ary["today_wagers_R"]}</font>";
                                $arr["WIN_GOLD"] = $ls_account_ary["today_wagers_R"];
                                $arr["WIN_GOLD_CLASS"] = "word_red";
                                $arr["CANCEL_MSG"] = "<font class=\"word_red txtBold\">{$ls_account_ary["today_wagers_R"]}</font>";
                                $arr["CANCEL_DIS"] = "style='display:none'";
                                break;
                            case 1:
                                $arr["BALL_ACT"] = "<font class=\"word_yellow txtBold\">{$ls_account_ary["today_wagers_N"]}</font>";
                                break;
                        }
                        $strong = "N";
                        if ($v["strong"] == "H") {
                            if ($v["chose_team"] == "H") {
                                $strong = "Y";
                            } else {
                                $strong = "N";
                            }
                        } else {
                            if ($v["chose_team"] == "C") {
                                $strong = "Y";
                            } else {
                                $strong = "N";
                            }
                        }
                        $arr["STRONG"] = $strong;

                        $CON = "";
                        if (!empty($team_h_ratio) || is_numeric($team_h_ratio)) {
                            $CON = $team_h_ratio;
                        } else if (!empty($team_c_ratio) || is_numeric($team_c_ratio)) {
                            $CON = $team_c_ratio;
                        }

                        $arr["TEAM_H"] = $team_h;
                        $arr["TEAM_C"] = $team_c;
                        $arr["NUM_H"] = $v["gnum_h"];
                        $arr["NUM_C"] = $v["gnum_c"];
                        $arr["IORATIO"] = $ioratio;
                        $arr["ORDER_TYPE"] = $result;
                        $arr["ORDER_CON"] = $spread;
                        $arr["CON"] = $CON;
                        $arr["SCORE"] = $score;
						  $arr["ORGSCORE"] = $orgscore;
                        $arr["DIF_SCORE"] = "";
                        $arr["LEAGUE"] = $v["lid"];
                        $arr["BET_TYPE"] = $v["chose_team"];
                        $arr["G_TIME"] = date("m-d-Y H:i:s", $v["datetime"]);

                    }
                    $arr["ARESULT"] = $v["ag_point"];
                    $arr["LIST_PMSG"] = "none";
                    switch ($this->login_layer) {
                        case Constant::ADS:
                        case Constant::AD:
                            $arr["ADRESULT"] = (100 - $v["d0_point"] - $v["co_point"] - $v["su_point"] - $v["ag_point"]);
                        case Constant::D0:
                            $arr["D0RESULT"] = $v["d0_point"];
                        case Constant::CO:
                            $arr["CRESULT"] = $v["co_point"];
                        case Constant::SU:
                            $arr["SRESULT"] = $v["su_point"];
                            break;
                    }
                    /*过滤部分 - start*/


                    $arr["M_DATE"] = $v["m_date"];
                    switch ($v["showtype"]) {
                        case "live":
                            $arr["MARKET"] = "rb";
                            break;
                        case "today":
                            if ($v["m_date"] > date("Y-m-d")) {
                                $arr["MARKET"] = "fu";
                            }
                            break;
                        case "fs":
                            if ($v["gnum_c"] > 0) {
                                if ($v["m_date"] > date("Y-m-d")) {
                                    $arr["MARKET"] = "fu";
                                }
                            }
                            break;
                    }

                    $lv = lv_nid($this->sup["nid"]);
                    switch ($lv["lv"]) {
                        case Constant::ADS:
                        case Constant::AD:
                            $name = $v["d0_name"];
                            break;
                        case Constant::D0:
                            $name = $v["co_name"];
                            break;
                        case Constant::CO:
                            $name = $v["su_name"];
                            break;
                        case Constant::SU:
                            $name = $v["ag_name"];
                            break;
                        case Constant::AG:
                            $name = $v["m_name"];
                            break;
                    }
                    $downline = array_search($name, array_column($downlines, "name"));
                    $arr["DOWNLINE"] = $downline;
                    if ($v["gid"] > 0) {
                        if (!isset($m_gid[$v["gid"]])) {
                            $m_gid[$v["gid"]] = $v["gid"];
                            if (isset($matchMap[$v["gidm"]])) {
                                $match = $matchMap[$v["gidm"]];
                                $m_gid[$v["gid"]] = $match["gid"];
                                $event[$v["gid"]] = [
                                    "id" => $v["gid"],
                                    "name" => str_replace($v["ptype"], "", $v["team_h"]) . " v " . str_replace($v["ptype"], "", $v["team_c"])
                                ];
                            }
                        }
                        $arr["_EVENT"] = $m_gid[$v["gid"]];
                    }
                    /*过滤部分 - end*/
                    if (strtoupper($v["wtype"]) == "P3") {
                        $arr["BALL_ACT"] = "";
                        $p3 = isset($p3Map[$v["ID"]]) ? $p3Map[$v["ID"]] : [];
                        if ($p3) {
                            $cou = count($p3);
                            $arr["TNAME_P"] = [];
                            $isRB = "N";
                            $isDanger = "N";
                            foreach ($p3 as $v3) {
                                $ary3 = [];
                                $xml = $bs->get_bet_wagers($v3, $isResult, 'P3', "Y");
                                $wagers_type = getXmlNode($xml, "wtype_sub");
                                $league = getXmlNode($xml, "league");
                                $team_h = getXmlNode($xml, "team_h_show");
                                $team_c = getXmlNode($xml, "team_c_show");
                                $team_h_ratio = getXmlNode($xml, "team_h_ratio");
                                $team_c_ratio = getXmlNode($xml, "team_c_ratio");
                                $score = getXmlNode($xml, "score");
								 $orgscore = getXmlNode($xml, "orgscore");
                                $ioratio = getXmlNode($xml, "ioratio");
                                $result = getXmlNode($xml, "result");
                                $spread = "";
                                $strong = "N";
                                if ($v3["strong"] == "H") {
                                    if ($v3["chose_team"] == "H") {
                                        $strong = "Y";
                                    } else {
                                        $strong = "N";
                                    }
                                } else {
                                    if ($v3["chose_team"] == "C") {
                                        $strong = "Y";
                                    } else {
                                        $strong = "N";
                                    }
                                }
                                $CON = "";
                                if (!empty($team_h_ratio) || is_numeric($team_h_ratio)) {
                                    $CON = $team_h_ratio;
                                } else if (!empty($team_c_ratio) || is_numeric($team_c_ratio)) {
                                    $CON = $team_c_ratio;
                                }

                                if ($ut->checkWtypeIsOU($v3["wtype"]) || $v3["wtype"] == "W3") {//大小、3项让球
                                    $result = getXmlNode($xml, "rtype_name");
                                    $spread = getXmlNode($xml, "spread_name");
                                }
                                if (count($edit_bet_layer["td_content"]) > 0) {
                                    $ary3["WTYPE"] = $v3["wtype"];
                                    $ary3["GTYPE"] = $v3["gtype"];
                                    $ary3["RTYPE"] = $v3["rtype"];
                                }
                                $ary3["WAGERS_TYPE"] = $wagers_type;
                                $ary3["LEAGUE"] = $league;
                                $ary3["G_TIME"] = date("m-d-Y H:i:s", $v3["datetime"]);
                                $ary3["ID"] = $v3["ID"];
                                $ary3["NUM_H"] = $v3["gnum_h"];
                                $ary3["NUM_C"] = $v3["gnum_c"];
                                $ary3["WTYPE"] = $v3["wtype"];
                                $ary3["TEAM_H"] = $team_h;
                                $ary3["TEAM_C"] = $team_c;
                                $ary3["ORDER_TYPE"] = $result;
                                $ary3["test"] = $result;
                                $ary3["ORDER_CON"] = $spread;
                                $ary3["CON"] = $CON;
                                $ary3["IORATIO"] = $ioratio;
                                $ary3["STRONG"] = $strong;
                                $ary3["SCORE"] = $score;
								 $ary3["orgSCORE"] = $orgscore;
                                $ary3["DIF_SCORE"] = "";
                                $ary3["DATE"] = date("m-d", strtotime($v3["m_date"]));
                                $ary3["RESULT_WL"] = "注单平局<br>(全场 :   )";
                                $ary3["BET_TYPE"] = $v3["chose_team"];
                                if ($v3["status"] == 0 && $v3["cancel"] == 0) {//注单有效
                                    if ($v3["isResult"] == 1) {
                                        $result_data = str_replace($ls_game_ary["showtype_live"], "", getXmlNode($xml, "result_data"));
                                        $ary3["GAME_SCORE"] = "({$result_data})";
                                        // 检查result值是否有效
                                        if (isset($bet_result[$v3["result"]]) && !empty($v3["result"])) {
                                            $ary3["RESULT_WL"] = "{$bet_result[$v3["result"]]}<br>{$result_data}";
                                            switch ($v3["result"]) {
                                                case "L":
                                                case "HL":
                                                    $ary3["RESULT_WL_CLASS"] = "word_red";
                                                    break;
                                                case "W":
                                                case "HW":
                                                    $ary3["RESULT_WL_CLASS"] = "word_green";
                                                    break;
                                                default:
                                                    $ary3["RESULT_WL_CLASS"] = "";
                                                    break;
                                            }
                                        } else {
                                            // result值无效时显示默认值
                                            $ary3["RESULT_WL"] = "已结算<br>{$result_data}";
                                        }
                                    }

                                } else {
                                    $ary3["CANCEL_MSG"] = "<font class=\"word_red txtBold\">{$bet_status[$v3["status"]]}</font>";
                                    $ary3["CANCEL_APN"] = "";
                                    $ary3["CANCEL_DIS"] = "style='display:none'";
                                }

                                switch ($v3["danger"]) {
                                    case 3:
                                        $ary3["BALL_ACT"] = "<font class=\"word_green txtBold\">{$ls_account_ary["today_wagers_A"]}</font>";
                                        break;
                                    case 2:
                                        $ary3["BALL_ACT"] = "<font class=\"word_red txtBold\">{$ls_account_ary["today_wagers_R"]}</font>";
                                        $ary3["CANCEL_MSG"] = "<font class=\"word_red txtBold\">{$ls_account_ary["today_wagers_R"]}</font>";
                                        $ary3["CANCEL_DIS"] = "style='display:none'";
                                        break;
                                    case 1:
                                        $ary3["BALL_ACT"] = "<font class=\"word_yellow txtBold\">{$ls_account_ary["today_wagers_N"]}</font>";
                                        break;
                                }


                                $ary3["RESULT_DATA"] = null;
                                $ary3["DEL_CLASS"] = "";

                                if ($v3["rb"] == "Y") {
                                    $isRB = "Y";
                                }
                                $arr["TNAME_P"][] = $ary3;
                            }
                            $arr["WAGERS_TYPE"] = $artjson["ART_today_parlay"];
                            $arr["IS_P"] = $bet_p3_wtype[$isRB];
                            $arr["WAGERSTYPE"] = $bet_p3_wtype[$isRB];
                            $arr["TNAME"] = "<li class=\"word_bold\">{$arr["IS_P"]} {$cou} {$artjson["ART_today_in"]} 1</li>";
                            if ($isRB == "Y") {
                                $arr["BALL_ACT"] = "<font class=\"word_green txtBold\">{$ls_account_ary["today_wagers_A"]}</font>";
                            }
                            if ($v["isResult"] == 1) {
                                $arr["WIN_GOLD"] = number_format($v["mem_result"] ?? 0, 1);
                                // 检查result值是否有效
                                if (isset($bet_result[$v["result"]]) && !empty($v["result"])) {
                                    $arr["RESULT_WL"] = "{$bet_result[$v["result"]]}";
                                    switch ($v["result"]) {
                                        case "L":
                                        case "HL":
                                            $arr["WIN_GOLD_CLASS"] = $arr["RESULT_WL_CLASS"] = "word_red";
                                            break;
                                        case "W":
                                        case "HW":
                                            $arr["WIN_GOLD_CLASS"] = $arr["RESULT_WL_CLASS"] = "word_green";
                                            break;
                                        default:
                                            $arr["WIN_GOLD_CLASS"] = $arr["RESULT_WL_CLASS"] = "";
                                            break;
                                    }
                                } else {
                                    // result值无效时显示默认值
                                    $arr["RESULT_WL"] = "已结算";
                                }
                            }

                        }

                        $arr["RPWAGERSTYPE"] = $arr["TNAME"];
                        $arr["SHOWTEXT_LEAGUE"] = null;
                        $arr["SHOWTEXT_TEAM_NUM"] = null;
                        $arr["SHOWTEXT_TEAM"] = null;
                        $arr["SHOWTEXT_ORDER_TYPE_IORATIO"] = null;
                    } else {
                        $arr["WAGERSTYPE"] = $wagers_type;
                        $arr["RPWAGERSTYPE"] = "";
                        $arr["SHOWTEXT_LEAGUE"] = $tname0;
                        $arr["SHOWTEXT_TEAM_NUM"] = $tname1;
                        $arr["SHOWTEXT_TEAM"] = $tname2;
                        $arr["SHOWTEXT_ORDER_TYPE_IORATIO"] = $tname3;
                    }
                    $arr["SITE"] = "";
                    $wagers[] = $arr;
                }

            }
            // $end_time = microtime(true)-$start_time;
            // $start_time = microtime(true);
            // print_r("2-阶段使用了{$end_time}秒\n");
            if($count >0 ){
                $ary["wagers"] = $wagers;
                $ary["league"] = array_values($lids);
                $ary["event"] = array_values($event);
                $ary["dates"] = array_values($dates ?? []);
                $ary["cname"] = array_values($cname);
            }

        }

        return $ary;
    }


    /**
     * 注单修改 操作
     * @return array|string[]
     */
    public function get_bet_edit(){
        global $default_ior,$default_ior1;
        $_p = $this->param;
        $memTable = Constant::T_MEMBER;
        $l = $this->edit_bet_layer();
        $action = isset($_p["action"]) ? strtolower($_p["action"]) : "";
        if(empty($action) || !isset($_p["betid"]) || !is_numeric($_p["betid"]) || $_p["betid"]==0){
            return ["status"=>"error","msg"=>"参数错误！"];
        }
        if($action == 'add'){
            $member = isset($_p["member"]) ? $_p["member"] : "";
            if(empty($member)){
                return ["status"=>"error","msg"=>"请输入添单"];
            }
            
        }
        
        if(!isset($l["td_content"][$action])){
            return ["status"=>"error","msg"=>"暂无该操作！"];
        }
        
        
        $id = $_p["betid"];
        $this->dbc->beginTransaction();
        try{
            $ut = new Util_game();
            $b = $this->dbc->select("SELECT * FROM {$this->betTable} WHERE `ID`={$id} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
            if(!$b){
                $this->dbc->rollback();
                return ["status"=>"error","msg"=>"该注单不存在！"];
            }
            $log = "[注单ID:{$id}]";
            $isEditSon = 0;
            if($this->sup["name"] != $this->user["name"]){ //子账号操作
                $isEditSon = 1;
            }
            $msg = "";
            $msg1 = $l["td_content"][$action];
            switch ($action){
                case "swap"://对调
                    $log = "对调".$log;
                    $arr = $ut->get_wtype_swap($b["wtype"],$b["rtype"],$b["gtype"]);
                    if(count($arr) == 0){
                        $this->dbc->rollback();
                        return ["status"=>"error","msg"=>"该注单不支持对调操作！"];
                    }

                    $up = [
                        "isEdit" => 1,
                        "edit_type" => 1,
                        "edit_name" => $this->sup["name"],
                        "edit_son_name" => $this->user["name"],
                        "isEditSon" => $isEditSon,
                        "edit_date" => date("Y-m-d H:i:s"),
                        "edit_layer"=>edit_layer_num_str($this->login_layer,1),
                        "isResult" => 0,
                        "mem_win_gold" => null,
                        "agent_result" => null,
                        "ag_result" =>null,
                        "su_result" => null,
                        "co_result" => null,
                        "d0_result" => null,
                        "mem_result"=> null,
                        /*"mem_turn_rate" =>null,
                        "ag_turn_rate" => null,
                        "su_turn_rate" => null,
                        "co_turn_rate" => null,
                        "d0_turn_rate" => null,*/
                        "valid_gold" => null
                    ];

                    $nw_gold = round($b["win_gold"]) - round($b["ioratio"] * $b["bet_golds"]) - $b["bet_golds"];
                    if($nw_gold<0){ //表示 赔率没有减1
                        $d_ior = $default_ior;
                        $jj = 0;
                    }else{
                        $d_ior = $default_ior1;
                        $jj = 1;
                    }

                    if($b["ioratio"]<$d_ior){
                        $iors = explode(".",$b["ioratio"]);
                        $len = 0;
                        if(isset($iors[1])){
                            $len = strlen($iors[1]);//获取小数点位数
                        }
                        $ior = number_format(($d_ior - $b["ioratio"]),$len);
                        if($ior-$jj>0){
                            $up["ioratio"] = $ior;//更新赔率
                            $up["win_gold"] = ($ior-$jj)*$b["bet_golds"];//更新可赢额度
                        }else{
                            $msg="当前赔率[对调]时超过预设值,请点击[修改]自设赔率";
                        }

                    }else{
                        $msg="当前赔率[对调]时超过预设值,请点击[修改]自设赔率2";
                    }

                    $key = array_search(strtoupper($b["rtype"]),$arr);
                    if($key==0){
                        $up["rtype"] = $arr[1];
                    }else{
                        $up["rtype"] = $arr[0];
                    }
                    if($b["rtype"] == $b["chose_team"] && strlen($b["chose_team"])>1){
                        $up["chose_team"] = $up["rtype"];
                    }elseif(strlen($b["chose_team"])==1){//如 H C O U
                        if(str_replace($b["wtype"],"",$b["rtype"]) == $b["chose_team"]){
                            $up["chose_team"] = str_replace($b["wtype"],"",$up["rtype"]);
                        }
                    }
                    $this->dbc->update($this->betTable,$up,"`ID`={$id}");
                    if($b["pay_type"]==1 && $b["isResult"]==1){ //现金玩家额度恢复
                        $gold = 0;
                        if($b["mem_result"]>0){
                            $gold = $b["mem_result"];
                        }elseif($b["mem_result"]<0){
                            $gold = $b["mem_result"] - $b["mem_win_gold"];
                        }

                        if($gold>0){
                            $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`-{$gold}),`credit`=`credit`-{$gold} WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                            $this->dbc->execSql($sql);
                        }
                    }
                    break;
                case "edit":
                    $log = "修改".$log;
                    $up = [
                        "isEdit" => 1,
                        "edit_type" => 2,
                        "edit_name" => $this->sup["name"],
                        "edit_son_name" => $this->user["name"],
                        "isEditSon" => $isEditSon,
                        "edit_date" => date("Y-m-d H:i:s"),
                        "edit_layer"=>edit_layer_num_str($this->login_layer,1),
                        "isResult" => 0,
                        "mem_win_gold" => null,
                        "agent_result" => null,
                        "ag_result" =>null,
                        "su_result" => null,
                        "co_result" => null,
                        "d0_result" => null,
                        "mem_result"=> null,
						   "score"=> $_p["orgscore"],
                        /*"mem_turn_rate" =>null,
                        "ag_turn_rate" => null,
                        "su_turn_rate" => null,
                        "co_turn_rate" => null,
                        "d0_turn_rate" => null,*/
                        "valid_gold" => null
                    ];

                    if(isset($_p["ip"]) && !empty($_p["ip"]) && preg_match("/^\A((([0-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\Z$/",$_p["ip"])){
                        $up["bet_ip"] = $_p["ip"];
                    }

                    if(isset($_p["bettime"]) && !empty($_p["bettime"]) && preg_match("/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/is",$_p["bettime"])){
                        $up["bet_time"] = strtotime($_p["bettime"]);
                    }

                    if(isset($_p["gold"]) ){
                        $bet_gold = str_replace(",","",$_p["gold"]);
                        if(is_numeric($bet_gold) && $bet_gold>0) {
                            $gss = explode(".", $bet_gold);
                            if (isset($gss[1]) && intval($gss[1]) == 0) {
                                $bet_gold = intval($bet_gold);
                            } else {
                                $bet_gold = round($bet_gold, 1);
                            }
                            if($bet_gold != $b["bet_golds"]){//金额有改变
                                //查询会员额度是否足够
                                $mem = $this->dbc->select("SELECT * FROM {$memTable} WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'","Row");
                                $bet_time = isset($up["bet_time"]) ? $up["bet_time"] : $b["bet_time"];
                                $d_date = date("Y-m-d",$bet_time);
                                if($d_date<date("Y-m-d") && $b["pay_type"]==0){ //信用玩家 今日之前的注单需要核查当日额度是否超额
                                    $start = strtotime($d_date."00:00:00");
                                    $end = strtotime($d_date."23:59:59");
                                    $sum = $this->dbc->select("SELECT SUM(`bet_golds`) AS `gold` FROM {$this->betTable} WHERE `nid`='{$b["nid"]}' AND `m_name`='{$b["m_name"]}' AND `bet_time` BETWEEN '{$start}' AND '{$end}'","Row");
                                    if(!$sum){
                                        $balance_gold=$mem["credit"];//当日剩余额度
                                    }else{
                                        $balance_gold = $mem["credit"] - $sum["gold"];//当日剩余额度
                                    }
                                    if(($bet_gold-$b["bet_golds"])>$balance_gold){
                                        $this->dbc->rollback();
                                        return ["status"=>"error","msg"=>"已超出[{$d_date}]的额度"];
                                    }
                                } else {
                                    if(!$mem){
                                        $this->dbc->rollback();
                                        return ["status"=>"error","msg"=>"会员账号不存在或已被删除"];
                                    }

                                    if(($bet_gold-$b["bet_golds"])>$mem["balance_credit"]){
                                        $this->dbc->rollback();
                                        return ["status"=>"error","msg"=>"添加的下注金额已经超过会员剩余额度！"];
                                    }


                                }

                                $up["bet_golds"] = $bet_gold;

                            }

                        }
                    }

                    if(strtoupper($b["wtype"])=="P3"){
                        $p3 = $this->dbc->select("SELECT * FROM {$this->betTable3} WHERE `p3id`={$id}");
                        if($p3){
                            $tmpIor = 0;
                            foreach ($p3 as $k => $v){
                                $up3 = [
                                    "isResult" => 0
                                ];

                                if(isset($_p["ioratio_{$v["ID"]}"]) && is_numeric($_p["ioratio_{$v["ID"]}"]) && $_p["ioratio_{$v["ID"]}"]>1){//过关赔率都加本金，所以必须大于1
                                    $up3["ioratio"] = $_p["ioratio_{$v["ID"]}"];
                                }

                                if(isset($_p["order_{$v["ID"]}"])){
                                    $ors = explode("/",trim($_p["order_{$v["ID"]}"]));
                                    if(count($ors)==1){
                                        $order = trim($ors[0]);
                                        if(is_numeric($order)){
                                            $up3["spread"] = $order;
                                        }
                                    }elseif(count($ors)==2){
                                        $o0 = trim($ors[0]);
                                        $o1 = trim($ors[1]);
                                        if(is_numeric($o0) && is_numeric($o1)){
                                            $up3["spread"] = "{$o0} / {$o1}";
                                        }
                                    }
                                }

                                if(isset($_p["rtype_{$v["ID"]}"]) && !empty($_p["rtype_{$v["ID"]}"])){
                                    $up3["rtype"] = $_p["rtype_{$v["ID"]}"];
                                    if($v["rtype"] == $v["chose_team"] && strlen($v["chose_team"])>1){
                                        $up3["chose_team"] = $up3["rtype"];
                                    }elseif(strlen($v["chose_team"])==1){//如 H C O U
                                        if(str_replace($v["wtype"],"",$v["rtype"]) == $v["chose_team"]){
                                            $up3["chose_team"] = str_replace($v["wtype"],"",$up3["rtype"]);
                                        }
                                    }
                                }

                                $ioratio = isset($up3["ioratio"]) ? $up3["ioratio"] : $v["ioratio"];
                                if ($k == 0) {
                                    $tmpIor = $ioratio;
                                } else {
                                    $tmpIor = $ut->mulFloat($tmpIor * 1, $ioratio * 1);
                                }

                                $this->dbc->update($this->betTable3,$up3,"`ID`={$v["ID"]}");
                            }
                            $golds = isset($up["bet_golds"]) ? $up["bet_golds"] : $b["bet_golds"];
                            $win_gold = $ut->calcWindGold($golds,$tmpIor,"P3",$b["gtype"],$b["odd_f_type"]);
                            $up["win_gold"] = $win_gold;
                        }
                    }else{
                        if(isset($_p["ioratio_{$b["ID"]}"]) && is_numeric($_p["ioratio_{$b["ID"]}"]) && $_p["ioratio_{$b["ID"]}"]>0){
                            $up["ioratio"] = $_p["ioratio_{$b["ID"]}"];
                        }

                        if(isset($_p["order_{$b["ID"]}"])){
                            $ors = explode("/",trim($_p["order_{$b["ID"]}"]));
                            if(count($ors)==1){
                                $order = trim($ors[0]);
                                if(is_numeric($order)){
                                    $up["spread"] = $order;
                                }
                            }elseif(count($ors)==2){
                                $o0 = trim($ors[0]);
                                $o1 = trim($ors[1]);
                                if(is_numeric($o0) && is_numeric($o1)){
                                    $up["spread"] = "{$o0} / {$o1}";
                                }
                            }
                        }

                        if(isset($_p["rtype_{$b["ID"]}"]) && !empty($_p["rtype_{$b["ID"]}"])){
                            $up["rtype"] = $_p["rtype_{$b["ID"]}"];
                            if($b["rtype"] == $b["chose_team"] && strlen($b["chose_team"])>1){
                                $up["chose_team"] = $up["rtype"];
                            }elseif(strlen($b["chose_team"])==1){//如 H C O U
                                if(str_replace($b["wtype"],"",$b["rtype"]) == $b["chose_team"]){
                                    $up["chose_team"] = str_replace($b["wtype"],"",$up["rtype"]);
                                }
                            }
                        }

                        if(isset($up["bet_golds"]) || isset($up["ioratio"])){ //计算可赢金额
                            $wtype = strtoupper($b["wtype"]);
                            $rtype = strtoupper($b["rtype"]);
                            $gtype = strtoupper($b["gtype"]);
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
                            } else if ($wtype=="SP" || $ut->checkWtypeisSP($wtype)){
                                $showRtype = substr($rtype,0,strlen($rtype)-1);
                            } else{
                                $showRtype = $wtype;
                            }
                            $gold = isset($up["bet_golds"]) ? $up["bet_golds"] : $b["bet_golds"];
                            $ioratio = isset($up["ioratio"]) ? $up["ioratio"] : $b["ioratio"];
                            $win_gold = $ut->calcWindGold($gold,$ioratio,$showRtype,$gtype,$b["odd_f_type"]);
                            $up["win_gold"] = $win_gold;
                        }
                    }

                    $this->dbc->update($this->betTable,$up,"`ID`={$id}");
                    if($b["pay_type"]==1 && $b["isResult"]==1){ //现金玩家额度恢复
                        $gold = 0;
                        if($b["mem_result"]>0){
                            $gold = $b["mem_result"];//扣除赢的金额
                        }elseif($b["mem_result"]<0){
                            $gold = $b["mem_result"] - $b["mem_win_gold"];//扣除退水
                        }

                        if($gold>0){
                            $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`-{$gold}),`credit`=(`credit`-{$gold}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                            $this->dbc->execSql($sql);
                        }
                    }

                    if(isset($up["bet_golds"])){
                        $d_gold = $up["bet_golds"] - $b["bet_golds"];//计算多用的金额
                        if($b["pay_type"]==1) {//现金 扣除基础额度
                            $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`-{$d_gold}),`credit`=(`credit`-{$d_gold}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                            $this->dbc->execSql($sql);
                        }else{
                            $bet_time = isset($up["bet_time"]) ? $up["bet_time"] : $b["bet_time"];
                            $d_date = date("Y-m-d",$bet_time);
                            if($d_date>=date("Y-m-d")) { //信用玩家 只针对今日之后注单的额度修改
                                $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`-{$d_gold}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                                $this->dbc->execSql($sql);
                            }
                        }

                    }
                    break;
                case "delete"://删除
                    $this->dbc->delete($this->betTable,"`ID`={$id}");
                    if(strtoupper($b["wtype"]) == "P3"){
                        $this->dbc->delete($this->betTable3,"`p3id`={$id}");
                    }
                    $log = "删除".$log;
                    if($b["pay_type"] == 1){ //现金 归还额度
						if($b["hidden"]==0){
							$sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`+{$b["bet_golds"]}),`credit`=(`credit`+{$b["bet_golds"]}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                        $this->dbc->execSql($sql);
						}
                    }else{//信用 效验额度
                        $mem = $this->dbc->select("SELECT * FROM {$memTable} WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'","Row");
                        if(!$mem){
                            $this->dbc->rollback();
                            return ["status"=>"error","msg"=>"会员账号不存在或已被删除1"];
                        }
                        $this->chg_member_credit($mem);
                    }
                    break;
                case "hidden":
                    if($b["hidden"]==1){
                        $hidden = 0;
                        $msg1 = "显示";
                    }else{
                        $hidden = 1;
                        $msg1 = "隐藏";
                    }
                    $up = [
                        "isEdit" => 1,
                        "edit_type" => 3,
                        "edit_name" => $this->sup["name"],
                        "edit_son_name" => $this->user["name"],
                        "isEditSon" => $isEditSon,
                        "edit_date" => date("Y-m-d H:i:s"),
                        "edit_layer"=>edit_layer_num_str($this->login_layer,1),
                        "hidden" => $hidden
                    ];
					if($b["hidden"]==1){
                        if($b["pay_type"] == 1 && $b["isResult"]==0){ //现金 归还额度
                            $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`-{$b["bet_golds"]}),`credit`=(`credit`-{$b["bet_golds"]}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                            $this->dbc->execSql($sql);
                        }
                    }else{
                        if($b["pay_type"] == 1 && $b["isResult"]==0){ //现金 归还额度
                            $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`+{$b["bet_golds"]}),`credit`=(`credit`+{$b["bet_golds"]}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                            $this->dbc->execSql($sql);
                        }
                    }
                    $this->dbc->update($this->betTable,$up,"`ID`={$id}");
                    break;
                case "manage":
                    if(!isset($_p["status"]) || !is_numeric($_p["status"])){
                        $this->dbc->rollback();
                        return ["status"=>"error","msg"=>"参数错误1！"];
                    }
                    $status = $_p["status"];
                    $up = [
                        "status" => $status,
                        "isResult" => $status>0 ? 1 : 0,
                        "mem_win_gold" => null,
                        "agent_result" => null,
                        "ag_result" =>null,
                        "su_result" => null,
                        "co_result" => null,
                        "d0_result" => null,
                        "mem_result"=> null,
                        /*"mem_turn_rate" =>null,
                        "ag_turn_rate" => null,
                        "su_turn_rate" => null,
                        "co_turn_rate" => null,
                        "d0_turn_rate" => null,*/
                        "valid_gold" => null
                    ];
                    $this->dbc->update($this->betTable,$up,"`ID`={$id}");

                    if($b["status"] != $status) {//有改变的情况
                        if ($status > 0 && $b["status"]==0) { //正常转非其他 退还额度
                            $mem = $this->dbc->select("SELECT * FROM {$memTable} WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'","Row");
                            if(!$mem){
                                $this->dbc->rollback();
                                return ["status"=>"error","msg"=>"会员账号不存在或已被删除2"];
                            }
							
							
                            if ($b["pay_type"] == 1) { //现金 基础额度
							  if($b["isResult"]==1){ //现金玩家额度恢复
                                    $gold = 0;
                                    if($b["mem_result"]>0){
                                        $gold = $b["mem_result"] - $b["bet_golds"];
                                    }elseif($b["mem_result"]<0){
                                        $gold = $b["mem_result"] - $b["mem_win_gold"];
                                    }

                                    if($gold>0){
                                        $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`-{$gold}),`credit`=`credit`-{$gold} WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                                        $this->dbc->execSql($sql);
                                    }
                                }else{
                                        $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`+{$b["bet_golds"]}),`credit`=(`credit`+{$b["bet_golds"]}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                                        $this->dbc->execSql($sql);
                                }
							
							//$this->set_credit_logs($b["nid"],$b["bet_golds"],"退还");
                              //  $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`+{$b["bet_golds"]}),`credit`=(`credit`+{$b["bet_golds"]}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                                //$this->dbc->execSql($sql);
                            }/*else{
                                $bet_time = $b["bet_time"];
                                $d_date = date("Y-m-d",$bet_time);
                                if($d_date>=date("Y-m-d")){//今日(之后)的注单 恢复额度
                                    $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`+{$b["bet_golds"]}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                                    $this->dbc->execSql($sql);
                                }
                            }*/


                        } else if($status==0 && $b["status"]>0){//非正常转正常 扣除额度

                            $mem = $this->dbc->select("SELECT * FROM {$memTable} WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'","Row");
                            if(!$mem){
                                $this->dbc->rollback();
                                return ["status"=>"error","msg"=>"会员账号不存在或已被删除2"];
                            }

                            if ($b["pay_type"] == 1) { //现金
                                if($mem["balance_credit"]<$b["bet_golds"]){
                                    return ["status"=>"error","msg"=>"处理失败,可用额度不足！"];
                                }
                                $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit` - {$b["bet_golds"]}),`credit`=(`credit` - {$b["bet_golds"]}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                                $this->dbc->execSql($sql);
                            }/*else{
                                $bet_time = $b["bet_time"];
                                $d_date = date("Y-m-d",$bet_time);
                                if($d_date>=date("Y-m-d")){//今日(之后)的注单 扣除额度
                                    if($mem["balance_credit"]>$b["bet_golds"]){
                                        $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit` - {$b["bet_golds"]}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                                        $this->dbc->execSql($sql);
                                    }else{
                                        $this->dbc->rollback();
                                        return ["status"=>"error","msg"=>"处理失败,今日可用额度不足！"];
                                    }

                                }else{
                                    $start = strtotime($d_date."00:00:00");
                                    $end = strtotime($d_date."23:59:59");
                                    $sum = $this->dbc->select("SELECT SUM(`bet_golds`) AS `gold` FROM {$this->betTable} WHERE `nid`='{$b["nid"]}' AND `m_name`='{$b["m_name"]}' AND `bet_time` BETWEEN '{$start}' AND '{$end}'","Row");
                                    if(!$sum){
                                        $balance_gold=$mem["credit"];//当日剩余额度
                                    }else{
                                        $balance_gold = $mem["credit"] - $sum["gold"];//当日剩余额度
                                    }
                                    if($b["bet_golds"]>$balance_gold){
                                        $this->dbc->rollback();
                                        return ["status"=>"error","msg"=>"处理失败,已超出[{$d_date}]的额度"];
                                    }
                                }
                            }*/
                        }
                    }
                    break;
                case "result":
                    $isResultAll = "ok";
                    if(strtoupper($b["wtype"]) == "P3"){
                        $b3 = $this->dbc->select("SELECT * FROM {$this->betTable3} WHERE `p3id`='{$id}'  AND `nid` LIKE '{$this->sup["nid"]}%'");
                        if(!$b3){return ["status"=>"error","msg"=>"注单不存在1!"];$this->dbc->rollback();}

                        $isWin = "W";
                        $ior = 1;
                        foreach ($b3 as $v){
                            $res = $this->result_ad($v);
                            if(count($res) == 0){
                                $isResultAll = "no";//不能结算
                            }else{
                                $up3 = [
                                    "inball" => $res["inball"],
                                    "result" => $res["sta"],
                                    "isResult"=> 1
                                ];

                                $this->dbc->update($this->betTable3,$up3,"`ID`={$v["ID"]}");

                                switch ($res["sta"]){
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
                            }
                        }
                        if($isResultAll == "ok"){
                            if($isWin == "W"){
                                $wingold = $b["bet_golds"] * ($ior - 1);
                                $valid_gold = $wingold;
                            }else{
                                $wingold = 0 - $b["bet_golds"];
                                $valid_gold = $b["bet_golds"];
                            }

                        }
                    }else{
                        $res = $this->result_ad($b);
                        if(count($res) == 0){
                            $isResultAll = "no";
                        }else{
                            $isWin = $res["sta"];
                            switch ($res["sta"]) {
                                case "W"://赢
                                    $wingold = $b["win_gold"];
                                    $valid_gold = $wingold;
                                    break;
                                case "L"://输
                                    $wingold = 0 - $b["bet_golds"];
                                    $valid_gold = $b["bet_golds"];
                                    break;
                                case "HW"://赢一半
                                    $wingold = $b["win_gold"] * 0.5;
                                    $valid_gold = $wingold;
                                    break;
                                case "HL"://输一半
                                    $wingold = 0 - $b["bet_golds"] * 0.5;
                                    $valid_gold = $b["bet_golds"] * 0.5;
                                    break;
                            }
                        }
                    }


                    if($isResultAll == "ok"){
                        if($isWin == "T"){
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
                            $pay_gold = $b["bet_golds"];
                        } else {
                            $mem_win_gold = $wingold;
                            $mem_turn_rate = $valid_gold * floatval($b["mem_turn_rate"]) / 100;//会员退水金额 = 有效金额*会员退水%
                            $mem_result = $wingold + $mem_turn_rate;//会员结果 = 输赢金额 + 会员退水金额
                             if ($mem_result > 0 || in_array($isWin, ["W","HW"])) { //赢表示还需要退还现金玩家的本金
                                $pay_gold = $b["bet_golds"] + $mem_result;
                            } else {
                                $pay_gold = $mem_turn_rate;
                            }
							$pay_gold = round($pay_gold,1); // 保留一位小数
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
                        if(strtoupper($b["wtype"]) != "P3"){
                            $up["inball"] = $res["inball"];
                        }
                        $this->dbc->update($this->betTable,$up,"`ID`={$b["ID"]}");
                        if($b["pay_type"]){ //现金
                            $memTable = Constant::T_MEMBER;
                            if($b["isResult"]==1){//已结算
                                $old = $b["mem_result"] + $b["bet_golds"];
                                $sql = "UPDATE {$memTable} SET `credit`=(`credit`-{$old}+{$pay_gold}),`balance_credit`=(`balance_credit`-{$old}+{$pay_gold}) WHERE `nid`='{$b["nid"]}' AND `pay_type`=1";
                                $this->dbc->execSql($sql);
                            } else {
                                if($pay_gold>0){ //现金玩家更新金额
								//$this->set_credit_logs($b["nid"],$pay_gold);
                                    $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$pay_gold}),`balance_credit`=(`balance_credit`+{$pay_gold}) WHERE `nid`='{$b["nid"]}' AND `pay_type`=1";
                                    $this->dbc->execSql($sql);
                                }
                            }
                        }
                    }else{

                        return ["status"=>"error","msg"=>"赛果为空不能结算 "];
                        $this->dbc->rollback();
                    }
                    break;
                case "add":
                    $log = "添单".$log;
                    $mem = $this->dbc->select("SELECT * FROM {$memTable} WHERE  `name`='{$_p["member"]}'","Row");
                    if(!$mem){
                        $this->dbc->rollback();
                        return ["status"=>"error","msg"=>"添单账号不存在或已被删除"];
                    }
                    foreach($b as $k=>$v){
                        if($v != ''){
                            $insertArray[$k] = $v;
                        }
                    }
                    $insertArray['m_name'] = $mem['name'];
                    $insertArray['nid'] =$mem['nid'];
                    $rankTable = Constant::T_RANK;
                    $lv = [Constant::D0,Constant::CO,Constant::SU,Constant::AG];
                    $sup_arr = [];
                    foreach ($lv as $v){
                        $nid = sup_nid($v,$mem['nid']);
                        $sup_arr[$v] = $this->dbc->select("SELECT * FROM {$rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                    }
                    //编辑
                    if(isset($_p["ip"]) && !empty($_p["ip"]) && preg_match("/^\A((([0-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\.){3}(([0-9]?[0-9])|(1[0-9]{2})|(2[0-4][0-9])|(25[0-5]))\Z$/",$_p["ip"])){
                        $insertArray["bet_ip"] = $_p["ip"];
                    }

                    if(isset($_p["bettime"]) && !empty($_p["bettime"]) && preg_match("/^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/is",$_p["bettime"])){
                        $insertArray["bet_time"] = strtotime($_p["bettime"]);
                    }

                    if(isset($_p["gold"])){
                        $bet_gold = str_replace(",","",$_p["gold"]);
                        if(is_numeric($bet_gold) && $bet_gold>0) {
                            $gss = explode(".", $bet_gold);
                            if (isset($gss[1]) && intval($gss[1]) == 0) {
                                $bet_gold = intval($bet_gold);
                            } else {
                                $bet_gold = round($bet_gold, 1);
                            }

                            //查询会员额度是否足够
                            
                            $bet_time = $insertArray["bet_time"];
                            $d_date = date("Y-m-d",$bet_time);
                            if($d_date<date("Y-m-d") && $b["pay_type"]==0){ //信用玩家 今日之前的注单需要核查当日额度是否超额
                                $start = strtotime($d_date."00:00:00");
                                $end = strtotime($d_date."23:59:59");
                                $sum = $this->dbc->select("SELECT SUM(`bet_golds`) AS `gold` FROM {$this->betTable} WHERE `nid`='{$insertArray["nid"]}' AND `m_name`='{$insertArray["m_name"]}' AND `bet_time` BETWEEN '{$start}' AND '{$end}'","Row");
                                if(!$sum){
                                    $balance_gold=$mem["credit"];//当日剩余额度
                                }else{
                                    $balance_gold = $mem["credit"] - $sum["gold"];//当日剩余额度
                                }
                                if($bet_gold>$balance_gold){
                                    $this->dbc->rollback();
                                    return ["status"=>"error","msg"=>"已超出[{$d_date}]的额度"];
                                }
                            } else {
                                if($bet_gold>$mem["balance_credit"]){
                                    $this->dbc->rollback();
                                    return ["status"=>"error","msg"=>"添加的下注金额已经超过会员剩余额度！"];
                                }


                            }
                            $insertArray["bet_golds"] = $bet_gold;
                        }
                    }

                    if(strtoupper($b["wtype"])=="P3"){
                        $p3 = $this->dbc->select("SELECT * FROM {$this->betTable3} WHERE `p3id`={$id}");
                        if($p3){
                            $tmpIor = $b['ioratio'];

                            $golds = $insertArray["bet_golds"];
                            $win_gold = $ut->calcWindGold($golds,$tmpIor,"P3",$b["gtype"],$b["odd_f_type"]);
                            $insertArray["win_gold"] = $win_gold;
                        }
                    }else{
                         if(isset($_p["ioratio_{$b["ID"]}"]) && is_numeric($_p["ioratio_{$b["ID"]}"]) && $_p["ioratio_{$b["ID"]}"]>0){
                            $insertArray["ioratio"] = $_p["ioratio_{$b["ID"]}"];
                        }
                        if(isset($_p["order_{$b["ID"]}"])){
                            $ors = explode("/",trim($_p["order_{$b["ID"]}"]));
                            if(count($ors)==1){
                                $order = trim($ors[0]);
                                if(is_numeric($order)){
                                    $insertArray["spread"] = $order;
                                }
                            }elseif(count($ors)==2){
                                $o0 = trim($ors[0]);
                                $o1 = trim($ors[1]);
                                if(is_numeric($o0) && is_numeric($o1)){
                                    $insertArray["spread"] = "{$o0} / {$o1}";
                                }
                            }
                        }

                        if(isset($_p["rtype_{$b["ID"]}"]) && !empty($_p["rtype_{$b["ID"]}"])){
                            $up["rtype"] = $_p["rtype_{$b["ID"]}"];
                            if($b["rtype"] == $b["chose_team"] && strlen($b["chose_team"])>1){
                                $insertArray["chose_team"] = $up["rtype"];
                            }elseif(strlen($b["chose_team"])==1){//如 H C O U
                                if(str_replace($b["wtype"],"",$b["rtype"]) == $b["chose_team"]){
                                    $insertArray["chose_team"] = str_replace($b["wtype"],"",$up["rtype"]);
                                }
                            }
                        }

                        if(isset($insertArray["bet_golds"]) || isset($insertArray["ioratio"])){ //计算可赢金额
                            $wtype = strtoupper($b["wtype"]);
                            $rtype = strtoupper($b["rtype"]);
                            $gtype = strtoupper($b["gtype"]);
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
                            } else if ($wtype=="SP" || $ut->checkWtypeisSP($wtype)){
                                $showRtype = substr($rtype,0,strlen($rtype)-1);
                            } else{
                                $showRtype = $wtype;
                            }
                            // $gold =  $insertArray["bet_golds"];
                            // $ioratio = $b["ioratio"];
                            $gold = isset($insertArray["bet_golds"]) ? $insertArray["bet_golds"] : $b["bet_golds"];
                            $ioratio = isset($insertArray["ioratio"]) ? $insertArray["ioratio"] : $b["ioratio"];
                            $win_gold = $ut->calcWindGold($gold,$ioratio,$showRtype,$gtype,$b["odd_f_type"]);
                            $insertArray["win_gold"] = $win_gold;
                        }
                    }

                    /*$this->dbc->update($this->betTable,$up,"`ID`={$id}");
                    if($b["pay_type"]==1 && $b["isResult"]==1){ //现金玩家额度恢复
                        $gold = 0;
                        if($b["mem_result"]>0){
                            $gold = $b["mem_result"];//扣除赢的金额
                        }elseif($b["mem_result"]<0){
                            $gold = $b["mem_result"] - $b["mem_win_gold"];//扣除退水
                        }

                        if($gold>0){
                            $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`-{$gold}),`credit`=(`credit`-{$gold}) WHERE `nid`='{$b["nid"]}' AND `name`='{$b["m_name"]}'";
                            $this->dbc->execSql($sql);
                        }
                    }*/

                    if(isset($insertArray["bet_golds"])){
                        $d_gold = $insertArray["bet_golds"];//计算多用的金额
                        if($mem["pay_type"]==1) {//现金 扣除基础额度
                            $sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`-{$d_gold}),`credit`=(`credit`-{$d_gold}) WHERE `nid`='{$insertArray["nid"]}' AND `name`='{$insertArray["m_name"]}'";
                            $this->dbc->execSql($sql);
                        }else{
                            $bet_time =  $insertArray["bet_time"];
                            $d_date = date("Y-m-d",$bet_time);
                            if($d_date>=date("Y-m-d")) { //信用玩家 只针对今日之后注单的额度修改
									//信用玩家 补扣额度  2026-2-2
                                //$sql = "UPDATE {$memTable} SET `balance_credit` = (`balance_credit`-{$d_gold}) WHERE `nid`='{$insertArray["nid"]}' AND `name`='{$insertArray["m_name"]}'";
                               // $this->dbc->execSql($sql);
                            }
                        }

                    }    



                    //编辑END   
                    $insertArray['ag_name'] =$sup_arr['ag']['name'];
                    $insertArray['su_name'] =$sup_arr['su']['name'];
                    $insertArray['co_name'] =$sup_arr['co']['name'];
                    $insertArray['d0_name'] =$sup_arr['d0']['name'];
                    unset($insertArray['ID']);
                    $lastInsertId = $this->dbc->insert($this->betTable,$insertArray,true);

                    if(strtoupper($b["wtype"])=="P3"){
                        $p3 = $this->dbc->select("SELECT * FROM {$this->betTable3} WHERE `p3id`='{$id}'");
                        if($p3){
                            foreach ($p3 as $k => $v){
                                $up3 = $v;
                                foreach ($up3 as $key => $value) {
                                    if($value == ''){
                                        unset($up3[$key]);
                                    }
                                }
                                unset($up3['ID']);
                                $up3['nid'] =$mem['nid'];
                                $up3['p3id']=$lastInsertId;
                                $this->dbc->insert($this->betTable3,$up3);
                            }
                        }
                    }
                    break;
            }

            $this->insertLog($log);
            $this->dbc->commit();
            return ["status"=>"success","msg"=>"{$msg1}成功!{$msg}"];
        }catch (\Exception $e){
            $this->dbc->rollback();
            return ["status"=>"error","msg"=>$e->getMessage()];
        }

    }

    /**
     * 注单结算
     * @param $b
     * @return array
     */
    public function result_ad($b){
        $_p = $this->param;
        if(isset($_p["result_".$b["ID"]])) { //直接输入输赢
            return ["sta" => $_p["result_".$b["ID"]], "inball" => ""];
        } else {
            $result = new Result();
            $id = $b["ID"];
            $rtype = strtoupper($b["rtype"]);
            $spread = $b["spread"];
            $strong = strtoupper($b["strong"]);
            $wtype = strtoupper($b["wtype"]);
            $gtype = strtoupper($b["gtype"]);
            $score = $b["score"];
            $ballH = isset($_p["input_{$id}_GMH"]) ? $_p["input_{$id}_GMH"] : "";
            $ballC = isset($_p["input_{$id}_GMC"]) ? $_p["input_{$id}_GMC"] : "";
            $ballH_hr = isset($_p["input_{$id}_HGMH"]) ? $_p["input_{$id}_HGMH"] : "";
            $ballC_hr = isset($_p["input_{$id}_HGMC"]) ? $_p["input_{$id}_HGMC"] : "";
            $_type0 = isset($_p["select_{$id}_0"]) ? $_p["select_{$id}_0"] : "";
            $_type1 = isset($_p["select_{$id}_1"]) ? $_p["select_{$id}_1"] : "";
            switch ($wtype) {
                /*独赢类 - 开始*/
                case "M":
                case "RM":
                case "HM":
                case "HRM":
                    /*15分钟 独赢 - 开始*/
                case "AM":
                case "ARM":
                case "BM":
                case "BRM":
                case "CM":
                case "CRM":
                case "DM":
                case "DRM":
                case "EM":
                case "ERM":
                case "FM":
                case "FRM":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getM($ballH, $ballC, $rtype);
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
                        $inball = $ballH . ":" . $ballC . "@" . $ballH_hr . ":" . $ballC_hr;
                        $sta = $result->getM($h, $c, $rtype);
                    }
                    break;
                /*独赢类 - 结束*/

                /*让球类 - 开始*/
                case "R":
                case "HR":
                case "AR":
                case "BR":
                case "CR":
                case "DR":
                case "ER":
                case "FR":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getR($ballH, $ballC, $strong, $rtype, $spread);
                    }
                    break;
                case "RE":
                case "HRE":
                    if (empty($score) && $gtype <> "FT") {
                        $score = "0:0";
                    }
                    if (!empty($score) && is_numeric($ballH) && is_numeric($ballC)) {
                        $scoreAry = explode(":", $score);
                        if (count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                            $h = $ballH - $scoreAry[0];
                            $c = $ballC - $scoreAry[1];
                            $inball = $ballH . ":" . $ballC;
                            $sta = $result->getR($h, $c, $strong, $rtype, $spread);
                        }

                    }

                    break;
                /*15分钟 让球 - 开始*/

                case "ARE":
                case "BRE":
                case "CRE":
                case "DRE":
                case "ERE":
                case "FRE":
                    $scoreAry = explode(":", $score);
                    if (is_numeric($ballH) && is_numeric($ballC)
                        && count($scoreAry) == 2 && is_numeric($scoreAry[0]) && is_numeric($scoreAry[1])) {
                        $h = $ballH - $scoreAry[0];
                        $c = $ballC - $scoreAry[1];
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getR($h, $c, $strong, $rtype, $spread);
                    }
                    break;
                /*15分钟 让球 - 结束*/

                //三项让球投注
                case "W3":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        if (strtoupper($strong) == "C") {
                            $inball = $ballC . ":" . $ballH;
                        }
                        switch ($rtype) {
                            case "W3H"://主队赢
                                switch ($spread) {
                                    case 1://主队让一球半
                                        $sta = $result->getR($ballH, $ballC, $strong, "RH", "1.5");
                                        break;
                                    case 2://主队受让一球半
                                        $sta = $result->getR($ballH, $ballC, $strong, "RC", "1.5");
                                        break;
                                }
                                break;
                            case "W3C"://客队赢
                                switch ($spread) {
                                    case 1://客队受让半球
                                        $sta = $result->getR($ballH, $ballC, $strong, "RC", "0.5");
                                        break;
                                    case 2://客队让二球半
                                        $sta = $result->getR($ballH, $ballC, $strong, "RC", "2.5");
                                        break;
                                }
                                break;
                            case "W3N"://和局
                                if (strtoupper($strong) == "C") {
                                    $ballH = $ballH + $ballC;
                                    $ballC = $ballH - $ballC;
                                    $ballH = $ballH - $ballC;
                                }
                                switch ($spread) {
                                    case 1://主场净胜一球
                                        if ($ballH - $ballC == 1) {
                                            $sta = "W";
                                        } else {
                                            $sta = "L";
                                        }
                                        break;
                                    case 2://客场净胜二球
                                        if ($ballC - $ballH == 2) {
                                            $sta = "W";
                                        } else {
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
                case "HOU":
                case "HROU":
                case "OUH"://主队进球 大小
                case "ROUH"://滚球
                case "OUC"://客队进球 大小
                case "ROUC"://滚球
                case "HOUH"://主队进球 上半 大小
                case "HRUH"://滚球
                case "HOUC"://客队进球 上半 大小
                case "HRUC"://滚球
                case "AOU"://15分钟盘口 大小
                case "AROU"://滚球
                case "TARU"://5分钟盘口：开始 - 04:59 分钟 - 大 / 小 加时赛
                case "BOU"://15分钟盘口 大小
                case "BROU"://滚球
                case "TBRU"://5分钟盘口：05:00 - 09:59 分钟 - 大 / 小 加时赛
                case "COU"://15分钟盘口 大小
                case "CROU":
                case "DOU"://15分钟盘口 大小
                case "DROU"://滚球
                case "TDRU"://5分钟盘口：下半场开始 - 19:59分钟  - 大 / 小 加时赛
                case "EOU"://15分钟盘口 大小
                case "EROU"://滚球
                case "TERU"://5分钟盘口：20:00 - 24:59分钟 - 大 / 小 加时赛
                case "FOU"://15分钟盘口 大小
                case "FROU":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getOU($ballH, $ballC, $rtype, $spread);
                    }
                    break;

                /*大小类 - 结束*/

                /*单双/进球数类 - 开始*/
                case "T":
                case "RT":
                case "HT":
                case "HRT":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getT($ballH, $ballC, $rtype);
                    }
                    break;
                /*单双/进球数类 - 结束*/
                /*其他玩法 和比分有关 - 开始*/
                case "TS"://双方球队进球
                case "RTS"://双方球队进球 滚球
                case "HTS"://双方球队进球 上半场
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getTS($ballH, $ballC, $rtype);
                    }
                    break;
                case "RTS2"://双方球队进球 下半场
                    if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                        $h = $ballH - $ballH_hr;
                        $c = $ballC - $ballC_hr;
                        $inball = $h . ":" . $c;
                        $sta = $result->getTS($h, $c, $rtype);
                    }
                    break;
                case "F"://半全场
                case "RF":
                    if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                        $inball = $ballH . ":" . $ballC . "@" . $ballH_hr . ":" . $ballC_hr;
                        $sta = $result->getF($ballH, $ballC, $ballH_hr, $ballC_hr, $rtype, $wtype);
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
                case "HPD":
                case "HRPD":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getPD($ballH, $ballC, $rtype, $wtype, $gtype);
                    }
                    break;
                case "WM"://净胜球数
                case "RWM":
                case "HWM":
                case "HRWM":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getWM($ballH, $ballC, $rtype, $wtype, $gtype);
                    }
                    break;
                case "DC"://双重机会
                case "RDC":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getDC($ballH, $ballC, $rtype);
                    }
                    break;
                case "WE"://赢得任一半场
                case "RWE":
                    if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                        $inball = $ballH . ":" . $ballC . "@" . $ballH_hr . ":" . $ballC_hr;
                        $sta = $result->getWE($ballH, $ballC, $ballH_hr, $ballC_hr, $rtype);
                    }
                    break;
                case "WB"://赢得所有半场
                case "RWB":
                    if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                        $inball = $ballH . ":" . $ballC . "@" . $ballH_hr . ":" . $ballC_hr;
                        $sta = $result->getWB($ballH, $ballC, $ballH_hr, $ballC_hr, $rtype);
                    }
                    break;
                case "CS"://零失球
                case "RCS":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getCS($ballH, $ballC, $rtype);
                    }
                    break;
                case "WN"://零失球获胜
                case "RWN":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getWN($ballH, $ballC, $rtype);
                    }
                    break;
                case "SB"://双半场进球
                case "RSB":
                    if (is_numeric($ballH) && is_numeric($ballC) && is_numeric($ballH_hr) && is_numeric($ballC_hr)) {
                        $inball = $ballH . ":" . $ballC . "@" . $ballH_hr . ":" . $ballC_hr;
                        $sta = $result->getSB($ballH, $ballC, $ballH_hr, $ballC_hr, $rtype);
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
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getMOU($ballH, $ballC, $rtype);
                    }
                    break;
                case "MTS"://独赢 & 双方球队进球
                case "RMTS":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getMTS($ballH, $ballC, $rtype);
                    }
                    break;
                case "MPG"://独赢 & 最先进球
                case "RMPG":
                    if (is_numeric($ballH) && is_numeric($ballC) && !empty($_type0)) {
                        $inball = $ballH . ":" . $ballC . "@PGF|" . $_type0;
                        $sta = $result->getMPG($ballH, $ballC, $rtype, $_type0);
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
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getOUT($ballH, $ballC, $rtype);
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
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getOUE($ballH, $ballC, $rtype);
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
                    if (is_numeric($ballH) && is_numeric($ballC) && !empty($_type0)) {
                        $inball = $ballH . ":" . $ballC . "@PGF|" . $_type0;
                        $sta = $result->getOUP($ballH, $ballC, $rtype, $_type0);
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
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getDU($ballH, $ballC, $rtype);
                    }
                    break;
                case "DS"://双重机会 & 双方球队进球
                case "RDS":
                    if (is_numeric($ballH) && is_numeric($ballC)) {
                        $inball = $ballH . ":" . $ballC;
                        $sta = $result->getDS($ballH, $ballC, $rtype);
                    }
                    break;
                case "DG"://双重机会 & 最先进球
                case "RDG":
                    if (is_numeric($ballH) && is_numeric($ballC) && !empty($_type0)) {
                        $inball = $ballH . ":" . $ballC . "@PGF|" . $_type0;
                        $sta = $result->getDG($ballH, $ballC, $rtype, $_type0);
                    }
                    break;


                /*其他玩法 和比分有关 - 结束*/

                /*其他玩法 和比分无关 - 开始*/
                case "BH"://落后反超获胜
                    if (!empty($_type0)) {
                        $inball = "BH|" . $_type0;
                        if ("BH" . strtoupper($_type0) == strtoupper($rtype)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    } else {
                        $sta = "L";
                    }
                    break;
                case "SP":
                    $ary = $result->getSP_AD($_type0, $rtype);
                    if (!empty($ary["sta"])) {
                        $sta = $ary["sta"];
                        $inball = $ary["inball"];
                    }
                    break;
                case "F2G"://先进2球的一方
                    if (!empty($_type0)) {
                        $inball = "F2G|" . $_type0;
                        switch (strtoupper($_type0)) {
                            case "H":
                                if ($rtype == "F2GH") {
                                    $sta = "W";
                                } else {
                                    $sta = "L";
                                }
                                break;
                            case "C":
                                if ($rtype == "F2GC") {
                                    $sta = "W";
                                } else {
                                    $sta = "L";
                                }
                                break;
                            case "N":
                                if ($rtype == "F2GN") {
                                    $sta = "W";
                                } else {
                                    $sta = "L";
                                }
                                break;
                        }
                    }
                    break;
                case "F3G"://先进3球的一方
                    if (!empty($_type0)) {
                        $inball = "F3G|" . $_type0;
                        switch (strtoupper($_type0)) {
                            case "H":
                                if ($rtype == "F3GH") {
                                    $sta = "W";
                                } else {
                                    $sta = "L";
                                }
                                break;
                            case "C":
                                if ($rtype == "F3GC") {
                                    $sta = "W";
                                } else {
                                    $sta = "L";
                                }
                                break;
                            case "N":
                                if ($rtype == "F3GN") {
                                    $sta = "W";
                                } else {
                                    $sta = "L";
                                }
                                break;
                        }
                    }
                    break;
                case "FG"://首个进球方式
                    if (!empty($_type0)) {
                        $inball = "FG|" . $_type0;
                        if (strtoupper($rtype) == "FG" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "T1G"://首个进球时间
                case "RT1G":
                    if (!empty($_type0)) {
                        $inball = "T1G|" . $_type0;
                        $rtype = str_replace("R", "", $rtype);
                        if (strtoupper($rtype) == "T1G" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "T3G"://首个进球时间 -3项
                case "RT3G":
                    if (!empty($_type0)) {
                        $inball = "T3G|" . $_type0;
                        $rtype = str_replace("R", "", $rtype);
                        if (strtoupper($rtype) == "T3G" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "TK"://开球球队
                    if ($_type0) {
                        $inball = "TK|" . $_type0;
                        if (strtoupper($rtype) == "TK" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "PA"://点球荣获（除开点球大战)
                    if (!empty($_type0)) {
                        $inball = "PA|" . $_type0;
                        if (strtoupper($rtype) == "PA" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "RCD"://红卡(球员)
                    if (!empty($_type0)) {
                        $inball = "RCD|" . $_type0;
                        $sss = str_replace(["Y", "N"], ["H", "C"], strtoupper($_type0));
                        if (strtoupper($rtype) == "RCD" . $sss) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "OG"://乌龙球
                    if (!empty($_type0)) {
                        $inball = "OG|" . $_type0;
                        if (strtoupper($rtype) == "OG" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "OT"://加时赛
                case "ROT":
                    if (!empty($_type0)) {
                        $inball = "OT|" . $_type0;
                        $rtype = str_replace("R", "", strtoupper($rtype));//去除滚球前面的R
                        if ($rtype == "OT" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "WM"://胜出方法
                case "HWM":
                case "RWM":
                case "HRWM":
                    if (!empty($_type0)) {
                        $inball = "WM|" . $_type0;
                        if (strtoupper($rtype) == "WM" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "MQ"://晋级方法
                    if (!empty($_type0)) {
                        $inball = "MQ|" . $_type0;
                        if (strtoupper($rtype) == "MQ" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "RPS"://点球大战
                    if (!empty($_type0)) {
                        $inball = "RPS|" . $_type0;
                        if (strtoupper($rtype) == "RPS" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "RPF"://点球大战 - 最后结束回合
                    if (!empty($_type0)) {
                        $inball = "RPF|" . $_type0;
                        if (strtoupper($rtype) == "RPF" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
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
                    if (!empty($_type0)) {
                        $inball = "{$wtype}|" . $_type0;
                        if (strtoupper($rtype) == $wtype . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;
                case "RPXA"://点球大战 - 第一回合
                case "RSCA"://点球大战 - 第一回合
                case "RSCB"://点球大战 - 第一回合
                case "RSCC"://点球大战 - 第一回合
                case "RSCE"://点球大战 - 第一回合
                case "RSCF"://点球大战 - 第一回合
                case "RSCG"://点球大战 - 第一回合
                case "RSCH"://点球大战 - 第一回合
                case "RSCI"://点球大战 - 第一回合
                case "RSCJ"://点球大战 - 第一回合
                case "RSCK"://点球大战 - 第一回合
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
                    $keyH = "RSH" . str_replace("RPX", "", $wtype);
                    $keyC = "RSC" . str_replace("RPX", "", $wtype);
                    $keyN = "RSN" . str_replace("RPX", "", $wtype);
                    if (!empty($_type0) && !empty($_type1)) {
                        $yyn = strtoupper($_type0 . $_type1);
                        $inball = "{$keyH}|" . $_type0 . "@{$keyC}|" . $_type1;
                        if (strpos($yyn, "P") !== false) { //无点球
                            if (strtoupper($_type0) == "P" && $rtype == $wtype . "H") {
                                $sta = "T";
                            }
                            if (strtoupper($_type1) == "P" && $rtype == $wtype . "C") {
                                $sta = "T";
                            }
                        } else {
                            switch ($yyn) {
                                case "YY"://主客都进球
                                    if ($rtype == $wtype . "N") {
                                        $sta = "L";
                                    } else {
                                        $sta = "W";
                                    }
                                    break;
                                case "YN"://主-进球 客-无进球
                                    if ($rtype == $wtype . "H") {
                                        $sta = "W";
                                    } else {
                                        $sta = "L";
                                    }
                                    break;
                                case "NY"://主-无进球 客-进球
                                    if ($rtype == $wtype . "C") {
                                        $sta = "W";
                                    } else {
                                        $sta = "L";
                                    }
                                    break;
                                case "NN"://都无进球
                                    if ($rtype == $wtype . "N") {
                                        $sta = "W";
                                    } else {
                                        $sta = "L";
                                    }
                                    break;
                            }
                        }
                    }
                    break;

                case "RTW"://点球大战 - 净胜球数
                    if (!empty($_type0)) {
                        $inball = "RTW|" . $_type0;
                        if (strtoupper($rtype) == "RTW" . strtoupper($_type0)) {
                            $sta = "W";
                        } else {
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
                    if (!empty($_type0)) {
                        $inball = $wtype . "|" . $_type0;
                        if (strtoupper($_type0) == "P") {//无角球
                            $sta = "T";
                        } else if ($wtype . $_type0 == $rtype) {
                            $sta = "W";
                        } else {
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
                    if (!empty($_type0)) {
                        $inball = $wtype . "|" . $_type0;
                        if (strtoupper($_type0) == "P") {//无角球
                            $sta = "T";
                        } else if ($wtype . $_type0 == $rtype) {
                            $sta = "W";
                        } else {
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
                    if (!empty($_type0)) {
                        $inball = $wtype . "|" . $_type0;
                        $rs_type = strtoupper($_type0);
                        if ($rs_type == "P") {//无点球
                            $sta = "T";
                        } else if ($wtype . $rs_type == $rtype) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;

             /*   case "RSCA"://第一个点球大战 客队
                case "RSCB"://第二个点球大战 客队
                case "RSCC"://第三个点球大战 客队
                case "RSCD"://第四个点球大战 客队
                case "RSCE"://第五个点球大战 客队
                case "RSCF"://第六个点球大战 客队
                case "RSCG"://第七个点球大战 客队
                case "RSCH"://第八个点球大战 客队
                case "RSCI"://第九个点球大战 客队
                case "RSCJ"://第十个点球大战 客队
                case "RSCk"://第十一个点球大战 客队
                case "RSCL"://第十二个点球大战 客队
                case "RSCM"://第十三个点球大战 客队
                case "RSCN"://第十四个点球大战 客队
                case "RSCO"://第十五个点球大战 客队
                    if (!empty($_type0)) {
                        $inball = $wtype . "|" . $_type0;
                        $rs_type = strtoupper($_type0);
                        if ($rs_type == "P") {//无点球
                            $sta = "T";
                        } else if ($wtype . $rs_type == $rtype) {
                            $sta = "W";
                        } else {
                            $sta = "L";
                        }
                    }
                    break;*/

                /*其他玩法 和比分无关 - 结束*/

                /*网球 特殊结算 - start*/
                //$rs_more
                default:
                    $rfs = ["RFA", "RFB", "RFC", "RFD", "RFE"];//网球 第某盘 第某局
                    foreach ($rfs as $rf) {
                        if (strpos($wtype, $rf) !== false) {
                            if (!empty($_type0)) {
                                $in_type = $_type0;
                                $inball = $wtype . "|" . $in_type;
                                if ($in_type == "N/A") {
                                    $sta = "T";
                                } else {
                                    if ($rtype == $wtype . $in_type) {
                                        $sta = "W";
                                    } else {
                                        $sta = "L";
                                    }
                                }

                            }
                        }
                    }

                    break;
                /*网球 特殊结算 - end*/
            }

            if (isset($inball) && isset($sta)) {
                return ["sta" => $sta, "inball" => $inball];
            } else {
                return [];
            }
        }
    }

    /**
     * 获取玩法列表 改单
     * @return array|string[]
     */
    public function get_game_name(){
        global $ls_game_ary;
        $_p = $this->param;
        if(!isset($_p["betid"]) || !is_numeric($_p["betid"])){
            return ["status"=>"error","msg"=>"参数错误！"];
        }
        $cs = "";
        switch ($this->langx){
            case "zh-tw":
                $cs = "_tw";
                break;
            case "en-us":
                $cs = "_en";
                break;
        }
        $id = $_p["betid"];
        $ary = [];
        $data = [];
        $bet = $this->dbc->select("SELECT * FROM {$this->betTable} WHERE `ID`={$id} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
        if(!$bet){return ["status"=>"error","msg"=>"注单不存在！"];}
        switch (strtoupper($bet["wtype"]) ){
            case "P3":
                $p3 = $this->dbc->select("SELECT * FROM {$this->betTable3} WHERE `p3id`={$id}");
                if(!$p3){return ["status"=>"error","msg"=>"注单不存在1！"];}
                $ary = $p3;
                break;
            case "FS":
                $table = Constant::S_SP;
                $fs = $this->dbc->select("SELECT `team{$cs}` AS `team`,`rtype` FROM {$table} WHERE `gid`={$bet["gid"]}");
                if(!$fs){return ["status"=>"error","msg"=>"冠军列表不存在！"];}
                $arr = [];
                foreach ($fs as $v){
                    $arr[] = [
                        "rtype" => $v["rtype"],
                        "name" => $v["team"]
                    ];
                }
                $data[$id] = $arr;
                return ["status"=>"success","data"=>$data];
                break;
            default:
                $ary[] = $bet;
                break;

        }

        $wr = new Wtype_Rtype();
        $a = ["*TEAM_H*","*TEAM_C*"];
        $o = $ls_game_ary["eoho"];//单
        $e = $ls_game_ary["eohe"];//双

        foreach ($ary as $v){
            $th = $v["team_h{$cs}"];
            $tc = $v["team_c{$cs}"];
            $b = [$th,$tc];
            $wtype = strtoupper($v["wtype"]);
            $rtype = strtoupper($v["rtype"]);
            $gtype = strtoupper($v["gtype"]);
            $wtypes = $wr->getGtype($gtype)["ALL"];
            $oe = [
                "T" => ["ODD"=>$o,"EVEN"=>$e],
                "HT"=> ["HODD"=>$o,"HEVEN"=>$e],
                "RT"=> ["RODD"=>$o,"REVEN"=>$e],
                "HRT"=>["HRODD"=>$o,"HREVEN"=>$e],
            ];

            if(isset($oe[$wtype][$rtype])){//单双
                foreach ($oe[$wtype] as $kk => $vv){
                    $data[$v["ID"]][] = [
                        "rtype" => $kk,
                        "name" => $vv
                    ];
                }

            }else if(isset($wtypes[$wtype])){
                foreach ($wtypes[$wtype] as $vv){
                    $key = strtolower($vv);
                    $h_c = "";
                    $w_a = ["WM","HWM","RWM","HRWM"];
                    switch ($gtype){
                        case "FT":
                            if(in_array($wtype,$w_a)) {
                                $wm = str_replace($wtype, "", $vv);
                                if (strpos($wm,"H") !== false) {
                                    $h_c = $th;
                                } elseif (strpos($wm,"C") !== false) {
                                    $h_c = $tc;
                                }
                            }
                            break;
                        case "BS":
                            if(in_array($wtype,$w_a)) {
                                $key .= "_bs";
                                $wm = str_replace($wtype, "", $vv);
                                if (strpos($wm,"H") !== false) {
                                    $h_c = $th;
                                } elseif (strpos($wm,"C") !== false) {
                                    $h_c = $tc;
                                }
                            }
                            break;
                    }
                    if(isset($ls_game_ary[$key])){
                        $ts = [
                            "T01"=>"0~1","T23"=>"2~3","T46"=>"4~6","HT0"=>"0","HT1"=>1,"HT2"=>2,
                            "RT01"=>"0~1","RT23"=>"2~3","RT46"=>"4~6","HRT0"=>"0","HRT1"=>1,"HRT2"=>2,
                            "RDT0"=>0,"RDT1"=>1,"RDT2"=>2
                        ];//进球数
                        $rty = isset($ts[$key]) ? $ts[$key] : $vv;
                        $data[$v["ID"]][] = [
                            "rtype" => $rty,
                            "name" => $h_c.str_replace($a,$b,$ls_game_ary[$key])
                        ];
                    }else {
                        if(str_replace($wtype,"",$vv) == "H"){
                            $data[$v["ID"]][] = [
                                "rtype" => $vv,
                                "name"  => $th
                            ];
                        }else if(str_replace($wtype,"",$vv) == "C"){
                            $data[$v["ID"]][] = [
                                "rtype" => $vv,
                                "name"  => $tc
                            ];
                        }else{
                            switch ($wtype){
                                case "F"://半全场
                                    $f_a = [
                                        "FHH"=>"{$th} / {$th}",
                                        "FHN"=>"{$th} / {$ls_game_ary["mn"]}",
                                        "FHC"=>"{$th} / {$tc}",
                                        "FNH"=>"{$ls_game_ary["mn"]} / {$th}",
                                        "FNN"=>"{$ls_game_ary["mn"]} / {$ls_game_ary["mn"]}",
                                        "FNC"=>"{$ls_game_ary["mn"]} / {$tc}",
                                        "FCH"=>"{$tc} / {$th}",
                                        "FCN"=>"{$tc} / {$ls_game_ary["mn"]}",
                                        "FCC"=>"{$tc} / {$tc}"
                                    ];
                                    $data[$v["ID"]][] = [
                                        "rtype" => $vv,
                                        "name"  => $f_a[$vv]
                                    ];
                                    break;
                                case "DC":
                                case "RDC"://双重机会
                                    $dc_a = [
                                        "DCHN"=>"{$th} / {$ls_game_ary["mn"]}",
                                        "DCCN"=>"{$tc} / {$ls_game_ary["mn"]}",
                                        "DCHC"=>"{$th} / {$tc}"
                                    ];
                                    $dc = str_replace("R","",$vv);
                                    $data[$v["ID"]][] = [
                                        "rtype" => $vv,
                                        "name"  => $dc_a[$dc]
                                    ];
                                    break;
                                default:
                                    return ["status"=>"error","msg"=>"不支持[rtype:{$vv}]"];
                                    break;
                            }
                        }
                    }
                }
            }else{
                return ["status"=>"error","msg"=>"不支持[wtype:{$wtype}]"];
            }
        }

        return ["status"=>"success","data"=>$data];
    }

    /**
     * 根据注单获取设置赛果的列表
     * @return array|string[]
     */
    public function get_wtype_result_list(){
        $_p = $this->param;
        $ary = [];
        if(!isset($_p["betid"]) || !is_numeric($_p["betid"]) || $_p["betid"]<=0){
            return ["status"=>"error","msg"=>"参数错误!"];
        }
        $id = $_p["betid"];
        $bet = $this->dbc->select("SELECT * FROM {$this->betTable} WHERE `ID`={$id} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
        if(!$bet){return ["status"=>"error","msg"=>"注单不存在!"];}

        if($bet["wtype"] == "P3"){
            $b3 = $this->dbc->select("SELECT * FROM {$this->betTable3} WHERE `p3id`='{$id}'  AND `nid` LIKE '{$this->sup["nid"]}%'");
            if(!$b3){return ["status"=>"error","msg"=>"注单不存在1!"];}
            foreach ($b3 as $v){
                $ary[$v["ID"]] = $this->get_wtype_result($v);
            }
        }else{
            $ary[$id] = $this->get_wtype_result($bet);
        }
        return ["status"=>"success","data"=>$ary];
    }

    /**
     * 根据wtype获取设置赛果列表
     * @param $b
     * @return array|array[]
     */
    public function get_wtype_result($b){
        global $ls_ag_ary,$ls_game_ary;
        $css = "";
        switch ($this->langx){
            case "zh-tw":
                $css="_tw";
                break;
            case "en-us":
                $css="_en";
                break;
        }
        $gtype = strtoupper($b["gtype"]);
        $wtype = strtoupper($b["wtype"]);
        $rtype = strtoupper($b["rtype"]);
        $ptype = $b["ptype{$css}"];
        $gnum_h = $b["gnum_h"];
        $ary = [];
        if($wtype=="FS"){
            return $ary;
        }

        $title = $ls_ag_ary["GMH"];
        if(!empty($ptype)){
            $title = str_replace("-","",$ptype);
        }
        switch (strtoupper($gtype)){
            case "BK":
                if(strlen($gnum_h)==6){
                    switch (substr($gnum_h,0,1)){
                        case 3://第一节
                            $title = $ls_ag_ary["str_BK_0"];
                            break;
                        case 4://第二节
                            $title = $ls_ag_ary["str_BK_1"];
                            break;
                        case 5://第三节
                            $title = $ls_ag_ary["str_BK_2"];
                            break;
                        case 6://第四节
                            $title = $ls_ag_ary["str_BK_3"];
                            break;
                        case 8://上半场
                            $title = $ls_ag_ary["str_BK_4"];
                            break;
                        case 9://下半场
                            $title = $ls_ag_ary["str_BK_5"];
                            break;
                        case 7://加时
                            $title = $ls_ag_ary["str_BK_6"];
                            break;
                    }
                }
                break;
            case "BM":
            case "TT":
                if(strlen($gnum_h)==6){
                    switch (substr($gnum_h,0,1)){
                        case 2://第一局
                            $title = $ls_ag_ary["str_BMTT_0"];
                            break;
                        case 3://第二局
                            $title = $ls_ag_ary["str_BMTT_1"];
                            break;
                        case 4://第三局
                            $title = $ls_ag_ary["str_BMTT_2"];
                            break;
                        case 5://第四局
                            $title = $ls_ag_ary["str_BMTT_3"];
                            break;
                        case 6://第五局
                            $title = $ls_ag_ary["str_BMTT_4"];
                            break;
                        case 7://第六局
                            $title = $ls_ag_ary["str_BMTT_5"];
                            break;
                        case 8://第七局
                            $title = $ls_ag_ary["str_BMTT_6"];
                            break;
                        case 1://让分
                            $title = $ls_ag_ary["str_BMTT_7"];
                            break;
                    }
                }else{
                    $title = $ls_ag_ary["str_BMTT_9"];
                }
                break;
            case "TN":
                if(strlen($gnum_h)==6){
                    //print_r($gnum_h."--".substr($gnum_h,0,1));
                    switch (substr($gnum_h,0,1)){
                        case 1:
                            $title = $ls_ag_ary["str_TN_6"];
                            break;
                        case 2://让局
                            $title = $ls_ag_ary["str_TN_5"];
                            break;
                        case 3://第一盘
                            $title = $ls_ag_ary["str_TN_0"];
                            break;
                        case 4://第二盘
                            $title = $ls_ag_ary["str_TN_1"];
                            break;
                        case 5://第三盘
                            $title = $ls_ag_ary["str_TN_2"];
                            break;
                        case 6://第四盘
                            $title = $ls_ag_ary["str_TN_3"];
                            break;
                        case 7://第五盘
                            $title = $ls_ag_ary["str_TN_4"];
                            break;
                    }
                }else{
                    $title = $ls_ag_ary["str_TN_7"];
                }
                break;
            case "VB":
                if(strlen($gnum_h)==6){
                    switch (substr($gnum_h,0,1)){
                        case 3://第一局
                            $title = $ls_ag_ary["str_VB_0"];
                            break;
                        case 4://第二局
                            $title = $ls_ag_ary["str_VB_1"];
                            break;
                        case 5://第三局
                            $title = $ls_ag_ary["str_VB_2"];
                            break;
                        case 6://第四局
                            $title = $ls_ag_ary["str_VB_3"];
                            break;
                        case 7://第五局
                            $title = $ls_ag_ary["str_VB_4"];
                            break;
                        case 8://第六局
                            $title = $ls_ag_ary["str_VB_5"];
                            break;
                        case 9://第七局
                            $title = $ls_ag_ary["str_VB_6"];
                            break;
                        case 2://让分
                            $title = $ls_ag_ary["str_VB_7"];
                            break;
                    }
                }else{
                    $title = $ls_ag_ary["str_VB_8"];
                }
                break;
            case "SK":
                if(strlen($gnum_h)==6){
                    switch (substr($gnum_h,0,1)){
                        case 1://第1-5局
                            $title = $ls_ag_ary["str_SK_0"];
                            break;
                        case 2://第6-8局
                            $title = $ls_ag_ary["str_SK_1"];
                            break;
                        case 3://第10-14局
                            $title = $ls_ag_ary["str_SK_2"];
                            break;
                        case 4://第15-17局
                            $title = $ls_ag_ary["str_SK_3"];
                            break;
                        case 5://第19-23局
                            $title = $ls_ag_ary["str_SK_4"];
                            break;
                        case 6://第24-26局
                            $title = $ls_ag_ary["str_SK_5"];
                            break;
                    }
                }
                break;
        }
        $inball = $b["inball"];
        //输入全场比分
        $ball =  [
            "M","RM","R","RE","W3","OU","ROU","OUH","OUC","ROUH","ROUC",
            "T","RT","TS","RTS","PD","RPD","PD3","RPD3","PD5","RPD5","PD7","RPD7",
            "WM","RWM","DC","RDC","CS","RCS","WN","RWN","MOUA","RMUA",
            "MOUB","RMUB","MOUC","RMUC","MOUD","RMUD","MTS","RMTS",
            "OUTA","RUTA","OUTB","RUTB","OUTC","RUTC","OUTD","RUTD",
            "OUEA","RUEA","OUEB","RUEB","OUEC","RUEC","OUED","RUED",
            "DUA","RDUA","DUB","RDUB","DUC","RDUC","DUD","RDUD",
            "DS","RDS"
        ];
        if(in_array($wtype,$ball)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";

            $ary[] = [
                "title" => $title,
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];

            return $ary;
        }

        //输入上半场比分
        $ball_h1 = ["HM","HRM","HR","HRE","HOU","HROU","HOUH","HRUH","HOUC","HRUC","HT","HRT","HTS","HPD","HRPD","HWM","HRWM"];
        if(in_array($wtype,$ball_h1)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";

            $ary[] = [
                "title" => $gtype=="BS" ? $ls_ag_ary["str_BS_0"] : $ls_ag_ary["1H"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //输入下半场比分
        $ball_h2 = ["RTS2"];
        if(in_array($wtype,$ball_h2)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["2H"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //输入上半/全场比分
        $ball_h1_full =["MG","RMG","HG","RHG","F","RF","WE","RWE","WB","RWB","SB","RSB"];
        if(in_array($wtype,$ball_h1_full)){
            $ihc = explode("@",$inball);
            $ihc0 = isset($ihc[0]) ? $ihc[0] : "";
            $ihc1 = isset($ihc[1]) ? $ihc[1] : "";
            $ib_h = "";
            $ib_c = "";
            $ib_h_hr = "";
            $ib_c_hr = "";
            if(!empty($ihc0)){//全场
                $ib = explode(":",$ihc0);
                $ib_h = isset($ib[0]) ? $ib[0] : "";
                $ib_c = isset($ib[1]) ? $ib[1] : "";
            }

            if(!empty($ihc1)){//上半场
                $ib_hr = explode(":",$ihc1);
                $ib_h_hr = isset($ib_hr[0]) ? $ib_hr[0] : "";
                $ib_c_hr = isset($ib_hr[1]) ? $ib_hr[1] : "";
            }

            $ary = [
                [
                    "title" => $ls_ag_ary["1H"],
                    "type" => ["input"=>["HGMH"=>$ib_h_hr,"HGMC"=>$ib_c_hr]]
                ],
                [
                    "title" => $ls_ag_ary["GMH"],
                    "type" => ["input"=>["GMH"=>$ib_h,"GMC"=>$ib_c]]
                ]
            ];
            return $ary;
        }

        //5分钟盘口：开始 - 04:59 分钟 - 大 / 小 加时赛
        $ball_a_5 = ["TARU"];
        if(in_array($wtype,$ball_a_5)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["TAGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //5分钟盘口：05:00 - 09:59 分钟 - 大 / 小 加时赛
        $ball_b_5 = ["TARU"];
        if(in_array($wtype,$ball_b_5)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["TBGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //5分钟盘口：05:00 - 09:59 分钟 - 大 / 小 加时赛
        $ball_b_5 = ["TBRU"];
        if(in_array($wtype,$ball_b_5)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["TBGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //5分钟盘口：下半场开始 - 19:59分钟  - 大 / 小 加时赛
        $ball_d_5 = ["TDRU"];
        if(in_array($wtype,$ball_d_5)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["TDGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //5分钟盘口：05:00 - 09:59 分钟 - 大 / 小 加时赛
        $ball_e_5 = ["TERU"];
        if(in_array($wtype,$ball_e_5)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["TEGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //上半场开始 - 14:59 分钟
        $ball_a_15 = ["AM","ARM","AR","ARE","AOU","AROU"];
        if(in_array($wtype,$ball_a_15)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["AGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //上半场开始 - 14:59 分钟
        $ball_a_15 = ["AM","ARM","AR","ARE","AOU","AROU"];
        if(in_array($wtype,$ball_a_15)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["AGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //15:00 - 29:59 分钟
        $ball_b_15 = ["BM","BRM","BR","BRE","BOU","BROU"];
        if(in_array($wtype,$ball_b_15)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["BGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //30:00 分钟 - 半场
        $ball_c_15 = ["CM","CRM","CR","CRE","COU","CROU"];
        if(in_array($wtype,$ball_c_15)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["CGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //下半场开始 - 59:59 分钟
        $ball_d_15 = ["DM","DRM","DR","DRE","DOU","DROU"];
        if(in_array($wtype,$ball_d_15)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["DGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //60:00 - 74:59 分钟
        $ball_e_15 = ["EM","ERM","ER","ERE","EOU","EROU"];
        if(in_array($wtype,$ball_e_15)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["EGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //75:00 分钟 - 全场
        $ball_f_15 = ["FM","FRM","FR","FRE","FOU","FROU"];
        if(in_array($wtype,$ball_f_15)){
            $ib = explode(":",$inball);
            $ib0 = isset($ib[0]) ? $ib[0] : "";
            $ib1 = isset($ib[0]) ? $ib[0] : "";
            $ary[] = [
                "title" => $ls_ag_ary["FGMH"],
                "type" => ["input"=>["GMH"=>$ib0,"GMC"=>$ib1]]
            ];
            return $ary;
        }

        //全场比分/PGF (1:1@PGF|..)
        $ball_full_pgf = ["DG","RDG","MPG","RMPG","OUPA","RUPA","OUPB","RUPB","OUPC","RUPC","OUPD","RUPD"];
        if(in_array($wtype,$ball_full_pgf)){
            $ihc = explode("@",$inball);
            $ihc0 = isset($ihc[0]) ? $ihc[0] : "";
            $ihc1 = isset($ihc[1]) ? $ihc[1] : "";
            $ib_h = "";
            $ib_c = "";
            $pgf = "";
            if(!empty($ihc0)){//全场
                $ib = explode(":",$ihc0);
                $ib_h = isset($ib[0]) ? $ib[0] : "";
                $ib_c = isset($ib[1]) ? $ib[1] : "";
            }

            if(!empty($ihc1)){//PGF
                $ib_hr = explode("|",$ihc1);
                $pgf = isset($ib_hr[1]) ? $ib_hr[1] : "NO";
            }
            $ary = [
                [
                    "title" => $ls_ag_ary["GMH"],
                    "type" => ["input"=>["GMH"=>$ib_h,"GMC"=>$ib_c]]
                ],
                [
                    "title" => $ls_ag_ary["PGF"],
                    "alias" => "PGF",
                    "default" => $pgf,
                    "type" => ["select"=>["HOME"=>$b["team_h{$css}"],"AWAY"=>$b["team_c{$css}"],"NO"=>$ls_ag_ary["FG_N"]]]
                ]
            ];
            return $ary;
        }

        //和比分无关
        $h_c_n = ["select"=>["H"=>$b["team_h{$css}"],"C"=>$b["team_c{$css}"],"N"=>$ls_ag_ary["No"]]];
        $h_a_n = ["select"=>["HOME"=>$b["team_h{$css}"],"AWAY"=>$b["team_c{$css}"],"NO"=>$ls_ag_ary["No"]]];
        $y_n = ["select"=>["Y"=>$ls_ag_ary["Y"],"N"=>$ls_ag_ary["N"]]];
        $ball_no = [
            "SP" => [[
                "title" => $ls_ag_ary["PGF"],
                "alias" => "PGF",
                "type" => $h_a_n
            ]],
            "FG" => [[
                "title" => $ls_ag_ary["FG"],
                "alias" => "FG",
                "type" => [
                    "select"=>[
                        "S" => $ls_ag_ary["FG_S"],
                        "H" => $ls_ag_ary["FG_H"],
                        "N" => $ls_ag_ary["FG_N"],
                        "P" => $ls_ag_ary["FG_P"],
                        "F" => $ls_ag_ary["FG_F"],
                        "O" => $ls_ag_ary["FG_O"],
                    ]
                ]
            ]],
            "T1G" => [[
                "title" => $ls_ag_ary["T1G"],
                "alias" => "T1G",
                "type" => [
                    "select"=>[
                        "N" => $ls_ag_ary["T1G_N"],
                        "1" => $ls_ag_ary["T1G_1"],
                        "2" => $ls_ag_ary["T1G_2"],
                        "3" => $ls_ag_ary["T1G_3"],
                        "4" => $ls_ag_ary["T1G_4"],
                        "5" => $ls_ag_ary["T1G_5"],
                        "6" => $ls_ag_ary["T1G_6"],
                    ]
                ]
            ]],
            "T3G" => [[
                "title" => $ls_ag_ary["T3G"],
                "alias" => "T3G",
                "type" => [
                    "select"=>[
                        "N" => $ls_ag_ary["T3G_N"],
                        "1" => $ls_ag_ary["T3G_1"],
                        "2" => $ls_ag_ary["T3G_2"],
                    ]
                ]
            ]],
            "MQ" => [[
                "title" => $ls_ag_ary["MQ"],
                "alias" => "MQ",
                "type" => [
                    "select"=>[
                        "H" => $b["team_h{$css}"].$ls_ag_ary["MQ_H"],
                        "C" => $b["team_c{$css}"].$ls_ag_ary["MQ_C"],
                        "HOT" => $b["team_h{$css}"].$ls_ag_ary["MQ_HOT"],
                        "COT" => $b["team_c{$css}"].$ls_ag_ary["MQ_COT"],
                        "HPK" => $b["team_h{$css}"].$ls_ag_ary["MQ_HPK"],
                        "CPK" => $b["team_c{$css}"].$ls_ag_ary["MQ_CPK"],
                    ]
                ]
            ]],
            "RPF" => [[
                "title" => $ls_ag_ary["RPF"],
                "alias" => "RPF",
                "type" => [
                    "select"=>[
                        "1" => $ls_ag_ary["RPF_1"],
                        "2" => $ls_ag_ary["RPF_2"],
                        "3" => $ls_ag_ary["RPF_3"],
                        "OV" => $ls_ag_ary["RPF_OV"],
                    ]
                ]
            ]],
            "RTW" => [[
                "title" => $ls_game_ary["showRtype_rtw"],
                "alias" => "RTW",
                "type"  => [
                    "select" => [
                        "H1"=>$b["team_h{$css}"]."-".$ls_game_ary["rtwh1"],
                        "H2"=>$b["team_h{$css}"]."-".$ls_game_ary["rtwh2"],
                        "HOV"=>$b["team_h{$css}"]."-".$ls_game_ary["rtwhov"],
                        "C1"=>$b["team_c{$css}"]."-".$ls_game_ary["rtwc1"],
                        "C2"=>$b["team_c{$css}"]."-".$ls_game_ary["rtwc2"],
                        "COV"=>$b["team_c{$css}"]."-".$ls_game_ary["rtwcov"],
                        "0"=>$ls_game_ary["rtw0"],
                        "N"=>$ls_game_ary["rtwn"]
                    ]
                ]
            ]]
        ];

        //净胜球数
        if($gtype=="BS"){
            $ball_no["WM"] = [[
                "title" => $ls_game_ary["showRtype_wm"],
                "alias" => "WM",
                "type"  => [
                    "select" => [
                        "H1"=>$b["team_h{$css}"]."-".$ls_game_ary["wmh1_bs"],
                        "H2"=>$b["team_h{$css}"]."-".$ls_game_ary["wmh2_bs"],
                        "H3"=>$b["team_h{$css}"]."-".$ls_game_ary["wmh3_bs"],
                        "H4"=>$b["team_h{$css}"]."-".$ls_game_ary["wmh4_bs"],
                        "C1"=>$b["team_c{$css}"]."-".$ls_game_ary["wmc1_bs"],
                        "C2"=>$b["team_c{$css}"]."-".$ls_game_ary["wmc2_bs"],
                        "C3"=>$b["team_c{$css}"]."-".$ls_game_ary["wmc3_bs"],
                        "C4"=>$b["team_c{$css}"]."-".$ls_game_ary["wmc4_bs"],
                        "H0"=>$ls_game_ary["wmh0_bs"]
                    ]
                ]
            ]];
        }else if($gtype=="FT"){
            $ball_no["WM"] = [[
                "title" => $ls_game_ary["showRtype_wm"],
                "alias" => "WM",
                "type"  => [
                    "select" => [
                        "H1"=>$b["team_h{$css}"]."-".$ls_game_ary["wmh1"],
                        "H2"=>$b["team_h{$css}"]."-".$ls_game_ary["wmh2"],
                        "H3"=>$b["team_h{$css}"]."-".$ls_game_ary["wmh3"],
                        "HOV"=>$b["team_h{$css}"]."-".$ls_game_ary["wmhov"],
                        "C1"=>$b["team_c{$css}"]."-".$ls_game_ary["wmc1"],
                        "C2"=>$b["team_c{$css}"]."-".$ls_game_ary["wmc2"],
                        "C3"=>$b["team_c{$css}"]."-".$ls_game_ary["wmc3"],
                        "COV"=>$b["team_c{$css}"]."-".$ls_game_ary["wmcov"],
                        "0"=>$ls_game_ary["wm0"],
                        "N"=>$ls_game_ary["wmn"]
                    ]
                ]
            ]];
        }

        if(isset($ball_no["WM"])){
            $ball_no["HWM"] = $ball_no["WM"];
            $ball_no["RWM"] = $ball_no["WM"];
            $ball_no["HRWM"] = $ball_no["WM"];
        }

        $ball_no["RT1G"] = $ball_no["T1G"];
        $ball_no["RT3G"] = $ball_no["T3G"];

        $yn = ["OG","OT","ROT","RPS"];
        foreach ($yn as $v){
            $ball_no[$v] = [[
                "title"=>$ls_game_ary["showRtype_".strtolower($v)],
                "alias"=>$v,
                "type" => $y_n
            ]];
        }

        $hcn = [
            "BH","F2G","F3G","TK","PA","RCD",
            "ARG","BRG","CRG","DRG","ERG","FRG","GRG",
            "HRG","IRG","JRG",
        ];//,"KRG","LRG","MRG","NRG","ORG"
        foreach ($hcn as $v){
            $ball_no[$v] = [[
                "title"=>$ls_ag_ary[$v],
                "alias"=>$v,
                "type" => $h_c_n
            ]];
        }

        $replace_a=["*TEAM_H*","*TEAM_C"];
        $replace_b=[$b["team_h{$css}"],$b["team_c{$css}"]];

        //点球大战 主队
        $dqdz_rs = [
            "RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO",
            "RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ","RSCK","RSCL","RSCM","RSCN","RSCO"
        ];
        foreach ($dqdz_rs as $v){
            $ball_no[$v] = [
                "title" => str_replace($replace_a,$replace_b,$ls_game_ary["showRtype_".strtolower($v)]),
                "alias" => $v,
                "type"  => ["select"=>["H"=>$b["team_h{$css}"],"C"=>$b["team_c{$css}"],"P"=>$ls_ag_ary["RNB_P"]]]
            ];

        }



        //罚牌数
        $fps = ["RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO"];
        foreach ($fps as $v){
            $ball_no[$v] = [[
                "title" => $ls_game_ary["showRtype_".strtolower($v)],
                "alias" => $v,
                "type"  => ["select"=>["H"=>$b["team_h{$css}"],"C"=>$b["team_c{$css}"],"P"=>$ls_ag_ary["RNB_P"]]]
            ]];
        }

        //角球数
        $jqs = [
            "RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC","RNCD","RNCE","RNCF",
            "RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU"
        ];
        foreach ($jqs as $v){
            $ball_no[$v] = [[
                "title" => $ls_game_ary["showRtype_".strtolower($v)],
                "alias" => $v,
                "type"  => ["select"=>["H"=>$b["team_h{$css}"],"C"=>$b["team_c{$css}"],"P"=>$ls_ag_ary["RNC_P"]]]
            ]];
        }

        if($wtype == "SP"){
            $pgfAry = ["PGFH","PGFC","PGFN"];//最先进球
            $pglAry = ["PGLH","PGLC","PGLN"];//最后进球
            if(in_array($rtype,$pgfAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["PGF"];
                $ball_no["SP"][0]["alias"] = "PGF";
            }

            if(in_array($rtype,$pglAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["PGL"];
                $ball_no["SP"][0]["alias"] = "PGL";
            }

            $stfAry = ["STFH","STFC","STFN"];//最先越位球员
            $stlAry = ["STLH","STLC","STLN"];//最后越位球员
            if(in_array($rtype,$stfAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["STF"];
                $ball_no["SP"][0]["alias"] = "STF";
            }

            if(in_array($rtype,$stlAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["STL"];
                $ball_no["SP"][0]["alias"] = "STL";
            }

            $cnfAry = ["CNFH","CNFC","CNFN"];//第一颗角球
            $cnlAry = ["CNLH","CNLC","CNLN"];//最后一颗角球
            if(in_array($rtype,$cnfAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["CNF"];
                $ball_no["SP"][0]["alias"] = "CNF";
            }

            if(in_array($rtype,$cnlAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["CNL"];
                $ball_no["SP"][0]["alias"] = "CNL";
            }

            $cdfAry = ["CDFH","CDFC","CDFN"];//第一张罚牌
            $cdlAry = ["CDLH","CDLC","CDLN"];//最后一张罚牌
            if(in_array($rtype,$cdfAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["CDF"];
                $ball_no["SP"][0]["alias"] = "CDF";
            }

            if(in_array($rtype,$cdlAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["CDL"];
                $ball_no["SP"][0]["alias"] = "CDL";
            }

            $rcfAry = ["RCFH","RCFC"];//最先任意球
            $rclAry = ["RCLH","RCLC"];//最后任意球
            if(in_array($rtype,$rcfAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["RCF"];
                $ball_no["SP"][0]["alias"] = "RCF";
            }

            if(in_array($rtype,$rclAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["RCL"];
                $ball_no["SP"][0]["alias"] = "RCL";
            }

            $ycfAry = ["YCFH","YCFC"];//第一张黄卡
            $yclAry = ["YCLH","YCLC"];//最后一张黄卡
            if(in_array($rtype,$ycfAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["YCF"];
                $ball_no["SP"][0]["alias"] = "YCF";
            }

            if(in_array($rtype,$yclAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["YCL"];
                $ball_no["SP"][0]["alias"] = "YCL";
            }

            $gafAry = ["GAFH","GAFC"];//最先球门球
            $galAry = ["GALH","GALC"];//最后球门球
            if(in_array($rtype,$gafAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["GAF"];
                $ball_no["SP"][0]["alias"] = "GAF";
            }

            if(in_array($rtype,$galAry)){
                $ball_no["SP"][0]["title"] = $ls_ag_ary["GAL"];
                $ball_no["SP"][0]["alias"] = "GAL";
            }
        }

        /*网球 特殊玩法 - start*/
        $rfs = ["RFA","RFB","RFC","RFD","RFE"];//网球 第某盘 第某局
        foreach ($rfs as $v){
            if(strpos($wtype,$v)!==false){
                $ball_no[$wtype] = [[
                    "title" => $ls_game_ary["showRtype_".strtolower($wtype)."_TN"],
                    "alias" => $wtype,
                    "type"  => ["select"=>["H"=>$b["team_h{$css}"],"C"=>$b["team_c{$css}"],"N/A"=>$ls_ag_ary["CancelType-12"]]]
                ]];
            }
        }
        /*网球 特殊玩法 - end*/


        if(!empty($inball) && isset($ball_no[$wtype])){
            $ball_no[$wtype][0]["default"] = str_replace("{$wtype}|","",$inball);
        }

        $dqdz = [
			"RPXA","RPXB","RPXC","RPXD","RPXE","RPXF","RPXG",
            "RPXH","RPXI","RPXJ","RPXK","RPXL","RPXM","RPXN","RPXO","RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCK","RSCI"
        ];//点球大战

        foreach ($dqdz as $v){

            $h_c_n_dqdz["select"]["N"] = $ls_game_ary["mn"];
            $rsh = str_replace("RSH","RPX",$v);
            $rsc = str_replace("RSC","RPX",$v);
            $ball_no[$v] = [
                [
                    "title"=>str_replace($replace_a,$replace_b,$ls_game_ary["showRtype_".strtolower($rsh)]),
                    "alias"=>$rsh,
                    "type" => ["select"=>["Y"=>$ls_game_ary["rshay"],"N"=>$ls_game_ary["rshan"],"P"=>$ls_ag_ary["RS_P"]]]
                ],
                [
                    "title"=>str_replace($replace_a,$replace_b,$ls_game_ary["showRtype_".strtolower($rsc)]),
                    "alias"=>$rsc,
                    "type" => ["select"=>["Y"=>$ls_game_ary["rshay"],"N"=>$ls_game_ary["rshan"],"P"=>$ls_ag_ary["RS_P"]]]
                ]
            ];

            if(!empty($inball)){
                $ihc = explode("@",$inball);
                $rh = isset($ihc[0]) ? str_replace("RSH|","",$ihc[0]) : "";
                $rc = isset($ihc[1]) ? str_replace("RSH|","",$ihc[1]) : "";
                if(!empty($rh)){$ball_no[$v][0]["default"] = $rh;}
                if(!empty($rc)){$ball_no[$v][1]["default"] = $rc;}
            }
        }

        return isset($ball_no[$wtype]) ? $ball_no[$wtype] : [];
    }


}
