<?php
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
function match_start11($dtime){
    $timestamp = strtotime($dtime);
    $m_date=date("Y-m-d",$timestamp);
    $m_time=date("H:i",$timestamp);
    $h = date("H",$timestamp);
    if(intval($h)>=12){
        $m_time.="p";
    }else{
        $m_time.="a";
    }
    return [$m_date,$m_time,$timestamp];
}

/**
 * 公告采集
 */
function messageget(){
    global $db_c;
    $table = Constant::T_MESSAGE;
    $time = time();
    $tf = new Transform();
    $tf->getUserCurl(1);
    if(count($tf->web) > 0){
        $cn = $tf->messageget("zh-cn");
        $tw = $tf->messageget("zh-tw");
        $en = $tf->messageget("en-us");
        $tf->close();
        try{
			   $del = "DELETE FROM {$table} WHERE ndate < DATE_SUB(NOW(), INTERVAL 7 DAY)";
            $db_c->execSql($del);
            if(count($cn)>0 && count($tw)>0 && count($en)){
                foreach ($cn as $k => $v){
					
					   $delmessage = "DELETE FROM {$table} WHERE sha1='{$v["sha1"]}'";
						$db_c->execSql($delmessage);
                    $sql = "INSERT INTO {$table}(`ndate`,`ntime`,`dqtime`,`message`,`message_tw`,`message_en`,`sha1`,`type`) VALUES ";
                    $sql .= "('20{$v["adddate"]}','{$time}',0,'{$v["msg"]}','{$tw[$k]["msg"]}','{$en[$k]["msg"]}','{$v["sha1"]}',1)";
                    $sql .= " ON DUPLICATE KEY UPDATE ";
                    $sql .= "`message`=VALUES(`message`),`message_tw`=VALUES(`message_tw`),`message_en`=VALUES(`message_en`)";
                    $db_c->execSql($sql);
                }
                return "公告采集成功!";
            }else{
                return "公告采集失败!";
            }
        }catch (\Exception $e){
            return $e->getMessage();
        }
    }else{ 
        return "前端无可用采集账号";
    }

}



/**
 * 写入冠军数据
 * @param string $gtype
 * @param string $langx
 * @return string
 */
function setFSMatchData($gtype="FT",$langx="zh-cn",$code){
    global $db_s;
    $table = Constant::S_SP;
    switch ($langx){
        case "zh-tw":
            $league = "league_tw";
            $is_league = "is_league_tw";
            $teamsname = "teamsname_tw";
            $team = "team_tw";
            break;
        case "en-us":
            $league = "league_en";
            $teamsname = "teamsname_en";
            $team = "team_en";
            $is_league = "is_league_en";
            break;
        default:
            $league = "league";
            $teamsname = "teamsname";
            $team = "team";
            $is_league = "is_league";
            break;
    }
    $fiedAry = ["gid","lid","sfs_id","FStype","datetime","sha1","rtype","ioratio",$league,$teamsname,$team,$is_league];
    $tf = new Transform();
    $res = $tf->getUserCurl(2,$code);
    if ($res["code"] == 10000) {
        $xml_league = $tf->get_league_list_FS($gtype,$langx);
        preg_match_all("/\<league name=\'(.*?)\' id=\'(.*?)\'(.*?)\<\/league>/is",$xml_league,$league_ids);
        $league_id_ary = $league_ids[2];

        $time = time();
        $lidNull = $db_s->select("SELECT `lid` FROM {$table} WHERE `sfs_id`='FS' AND `datetime`>{$time} AND `{$is_league}`=1 GROUP BY `lid`");
        $lids = [];
        if($lidNull){$lids = array_column($lidNull,"lid");}
        $str = "";


        if(count($league_id_ary)>0){
            foreach ($league_id_ary as $lid){ 
                if (!in_array($lid,$lids)){
                    $xml = $tf->get_game_list_FS($gtype,$lid,$langx);
                    preg_match_all("/\<game id=\"gid(.*?)\">(.*?)\<\/game>/is",$xml,$games);
                    $game_ary = $games[2];
                    if(count($game_ary)>0){
                        $values = "";
                        foreach ($game_ary as $v){

                            $ary = [
                                $tf->getXmlNode($v,"gid"),
                                $lid,"FS",
                                $tf->getXmlNode($v,"FStype"),
                                strtotime($tf->getXmlNode($v,"datetime")),
                            ];
                            $league_name = $tf->getXmlNode($v,"league");
                            $teamsname_name = $tf->getXmlNode($v,"teamsname");

                            preg_match_all("/\<rtypes id=\"(.*?)\">(.*?)\<\/rtypes>/is",$v,$rtypes);
                            $rtype_ary = $rtypes[2];
                            if(count($rtype_ary)>0){
                                foreach ($rtype_ary as $vv){
                                    $arr = $ary;
                                    $sha1 = $tf->getXmlNode($v,"gid")."|".$lid."|FS|".$tf->getXmlNode($v,"FStype")."|".$tf->getXmlNode($vv,"rtype");
                                    $sha1 = sha1($sha1);
                                    $arr[] = $sha1;
                                    $arr[] = $tf->getXmlNode($vv,"rtype");
                                    $arr[] = $tf->getXmlNode($vv,"ioratio");
                                    $arr[] = $league_name;
                                    $arr[] = $teamsname_name;
                                    $arr[] = rtrim($tf->getXmlNode($vv,"teams"));
                                    $arr[] = 1;
                                    $values .= "('".implode("','",$arr)."'),";
                                }
                            }
                        }
                        if(!empty($values)){
                            $fied = implode("`,`",$fiedAry);
                            $values = rtrim($values,",");
                            $insert = "INSERT INTO {$table} (`{$fied}`) VALUES {$values} ON DUPLICATE KEY UPDATE `{$league}`=VALUES(`{$league}`),`{$teamsname}`=VALUES(`{$teamsname}`),`{$team}`=VALUES(`{$team}`),`{$is_league}`=VALUES(`{$is_league}`)";
                            try{
                                $db_s->execSql($insert);
                                print_r("[lid:{$lid}]数据更新成功!\n");
                            }catch (\Exception $e){
                                print_r($insert);exit;
                            }

                        }
                    }
                }
            }
            $str = "冠军采集完成...";
        }else{
            $str = "数据接受失败1!";
        }
    }else{ 
        return $res["msg"];
    }
    return $str;
}

/**
 * 赛事采集并入库
 * @param string $type 采集类型
 * @param array $typeAry
 * @return false|string
 */
function setMatchData($type="FT_R",$typeAry=[],$langx="zh-cn",$isEdit="N",$level=0,$code){
    global $db_s,$isHRAry;
    // $count = 20;
    $table = $typeAry["table"];
    $table_xml = $typeAry["table_xml"];
    $gtype = $typeAry["gtype"];
    $rtype = $typeAry["rtype"];
    $is_hr = isset($isHRAry[$gtype]) ? $isHRAry[$gtype] : [];
    $setAry = [
        "gid",
        "datetime",
        "league",
        "gnum_h",
        "gnum_c",
        "team_h",
        "team_c",
        "strong",
        "lid",
        "gidm",
        "m_date",
        "m_time",
        "league_tw",
        "team_h_tw",
        "team_c_tw",
        "league_en",
        "team_h_en",
        "team_c_en",
        "isHR"
    ];//入库字段

    $css = "";
    switch ($langx){
        case "zh-tw":
            $league = "league_tw";
            $gnum_h = "team_h_tw";
            $gnum_c = "team_c_tw";
            $ptype = "ptype_tw";
            $is_league = "is_league_tw";
            $css = "_tw";
            break;
        case "en-us":
            $league = "league_en";
            $gnum_h = "team_h_en";
            $gnum_c = "team_c_en";
            $ptype = "ptype_en";
            $is_league = "is_league_en";
            $css = "_en";
            break;
        default:
            $league = "league";
            $gnum_h = "team_h";
            $gnum_c = "team_c";
            $ptype = "ptype";
            $is_league = "is_league";
            $css = "_cn";
            break;
    }
    $setNewAry = [];
    $types = explode("_",$type);
    $isRB = "N";
    switch ($types[1]){
        case "R":
            $setNewAry = ["gid","is_r","r_up_time","r_display","r{$css}"];//"r_cn","r_tw","r_en",
            break;
        case "RE":
            $isRB = "Y";
            $setNewAry = ["gid","is_re","re_up_time","re_display","re{$css}"];//"re_cn","re_tw","re_en",
            break;
        case "P3":
            $setNewAry = ["gid","is_p3","p3_up_time","p3_display","p3{$css}"];//"p3_cn","p3_tw","p3_en",
            break;
        case "PD":
        case "RPD":
            $setNewAry = ["gid","is_pd","pd_up_time","pd_display","pd{$css}"];//"pd_cn","pd_tw","pd_en",
            break;
    }
    
    $tf = new Transform();
    $res = $tf->getUserCurl(2,$code);
    
    if ($res["code"] == 10000) {
        $xml_cn = $tf->get_game_list($typeAry,$langx);
		$list_is_json = false;
		if (!is_null(json_decode($xml_cn))){
			$json_res = json_decode($xml_cn, true);
			$matchs_cn = [
				1 => $json_res,
				2 => $json_res['response']
			];
			$list_is_json = true;
		}else{
			preg_match_all("/\<game id=\"(.*?)\">(.*?)\<\/game>/is",$xml_cn,$matchs_cn);
		}
        $date = date("Y-m-d");
        switch (strtoupper($types[0])){
            case "FT":
                $rs = $db_s->select("SELECT `ecid` FROM {$table} WHERE `m_date`='{$date}' AND `ecid`>0  AND `{$is_league}` = 1 GROUP BY `ecid` ");
                break;
            case "FU":
                $rs = $db_s->select("SELECT `ecid` FROM {$table} WHERE `m_date`>='{$date}' AND `ecid`>0 AND `{$is_league}` = 1 GROUP BY `ecid` ");
                // print_r("SELECT `ecid` FROM {$table} WHERE `{$is_league}` = 0 AND `ecid`>0 AND `m_date`>='{$date}' GROUP BY `ecid` \n");
                break;
            default:
                $rs = $db_s->select("SELECT `gidm` AS `ecid` FROM {$table} WHERE  `m_date`>='{$date}' AND `gidm`>0 AND `{$is_league}` = 1 GROUP BY `gidm` ");
                break;
        }
        
        $ecidAry = [];
        if($rs){ $ecidAry = array_column($rs,"ecid");} 
        // print_r($ecidAry);exit;
        if(isset($matchs_cn[2]) && count($matchs_cn[2])>0){ 
            try {
                $ki = 0;
                foreach ($matchs_cn[2] as $kk => $vv) { 
					if ($list_is_json){
						$gid = $vv['GID'];
					}else{
						$gid = $tf->getXmlNode($vv,"GID");
					}
                    switch (strtoupper($types[0])){
                        case "FT":
							if ($list_is_json){
								$ftsh = $vv['SCORE_H'];
								$ftsc = $vv['SCORE_C'];
								$ftsh = empty($ftsh) ? 0 : $ftsh;
								$ftsc = empty($ftsc) ? 0 : $ftsc;  
							}else{
								$ftsh = $tf->getXmlNode($vv,"SCORE_H");
								$ftsc = $tf->getXmlNode($vv,"SCORE_C");
								$ftsh = empty($ftsh) ? 0 : $ftsh;
								$ftsc = empty($ftsc) ? 0 : $ftsc;   
							}
                        case "FU":
                            $gameHeads = ["gid", "gidm", "lid", "ecid", $is_league, $league, "gnum_h", "gnum_c", $gnum_h, $gnum_c, "master", $ptype,"ptype_id"];
							if ($list_is_json){
								$ecid = $vv['ECID'];
							}else{
								$ecid = $tf->getXmlNode($vv, "ECID");
							}
                            if(empty($ecid)){
								if ($list_is_json){
									$ecid = $vv['GIDM'];
								}else{
									$ecid = $tf->getXmlNode($vv, "GIDM");
								}
                            }
                            break;
                        default:
                            $gameHeads = ["gid", "gidm", "lid", $is_league, $league, "gnum_h", "gnum_c", $gnum_h, $gnum_c, $ptype,"ptype_id"];
							if ($list_is_json){
									$ecid = $vv['GIDM'];
							}else{
								$ecid = $tf->getXmlNode($vv,"GIDM");
							}
                            break;
                    }
					if ($list_is_json){
						$lid = $vv['LID'];
					}else{
						$lid = $tf->getXmlNode($vv, "LID");
					}
                    $moreAry = $typeAry;
                    $moreAry["ecid"] = $ecid;
                    $moreAry["lid"] = $lid;
                    $moreAry["isRB"] = $isRB;
                    $moreAry["gid"] = $gid;
                    $gameHeadsAry = $gameHeads;
                    $values = "";
                    $values_xml = "";
                //    var_dump(in_array(intval($ecid),$ecidAry));
                // print_r($isEdit."\n");exit;
                    if (!in_array($ecid,$ecidAry) || $isEdit == "Y"){
                        $xml_more = $tf->get_game_more($moreAry, $langx);
						$more_is_json = false;
						if (!is_null(json_decode($xml_more))){
							$more_json = json_decode($xml_more, true);
							$ary_mores = $more_json['response']['GAMES'];
							$ary_mores = array_values($ary_mores);
							$more_is_json = true;
						}else{
							switch (strtoupper($types[0])){
								case "FT":
								case "FU":
									preg_match_all("/\<game id=\"gid(.*?)\" master=\"(.*?)\" mode=\"(.*?)\" ptype=\"(.*?)\">(.*?)\<\/game>/is", $xml_more, $ary_more);
									$ary_mores = $ary_more[5];
									break;
								default:
									preg_match_all("/\<game id=\"gid(.*?)\">(.*?)\<\/game>/is", $xml_more, $ary_more);
									$ary_mores = $ary_more[2];
									break;
							}
						}
                        foreach ($ary_mores as $k => $v) {
                           if ($more_is_json){
								$master = isset($v['IS_MASTER'])? $v['IS_MASTER']: 'N';
								$v = array_change_key_case($v);
							}else{
								$master = $ary_more[2][$k];
							}

                            $values .= "(";
                            $value = "";
                             if ($more_is_json){
								$gid = $v['gid'];
							}else{
								$gid = $tf->getXmlNode($v, "gid");
							}
                            foreach ($gameHeads as $n) {
                                switch ($n) {
                                    case "master":
                                        $value .= "'{$master}',";
                                        break;
                                    case "ecid":
                                        $value .= "'{$ecid}',";
                                        break;
                                    case "lid":
                                        $value .= "'{$lid}',";
                                        break;
                                    case "league":
                                    case "league_tw":
                                    case "league_en":
										 if ($more_is_json){
												$val = $v['league'];
											}else{
												$val = $tf->getXmlNode($v, "league");
											}
                                        $value .= "'{$val}',";
                                        break;
                                    case "is_league":
                                    case "is_league_tw":
                                    case "is_league_en":
										if ($more_is_json){
											$val = $v['league'];
										}else{
											$val = $tf->getXmlNode($v, "league");
										}
                                        if($val != ""){ 
                                            $value .= "1,";
                                        }else{ 
                                            $value .= "0,";
                                        }
                                        
                                        break;
                                    case "team_h":
                                    case "team_h_tw":
                                    case "team_h_en":
									   if ($more_is_json){
											$val = $v['team_h'];
										}else{
											$val = $tf->getXmlNode($v, "team_h");
										}
                                        $value .= "'{$val}',";
                                        break;
                                    case "team_c":
                                    case "team_c_tw":
                                    case "team_c_en":
                                      if ($more_is_json){
											$val = $v['team_c'];
										}else{
											$val = $tf->getXmlNode($v, "team_c");
										}
                                        $value .= "'{$val}',";
                                        break;
                                    case "ptype":
                                    case "ptype_tw":
                                    case "ptype_en":
									   if ($more_is_json){
											$val = isset($v['ptype']) ? $v['ptype']: '';
										}else{
											$val = $tf->getXmlNode($v, "ptype");
										}
                                        $value .= "'{$val}',";
                                        break;
                                    default:
                                        if ($more_is_json){
											$val = isset($v[$n]) ? $v[$n]: 0;
										}else{
											$val = $tf->getXmlNode($v, $n);
										}
                                        $value .= "'{$val}',";
                                        break;
                                }

                            }
                            //开赛时间
							 if ($more_is_json){
								$datetime = match_start11($v['datetime']);
							}else{
								$datetime = match_start11($tf->getXmlNode($v, "datetime"));
							}
                            if (!in_array("datetime", $gameHeadsAry)) {
                                $gameHeadsAry[] = "datetime";
                                $gameHeadsAry[] = "m_time";
                                $gameHeadsAry[] = "m_date";
                            }
                            $value .= "'{$datetime[2]}',";
							  if ($more_is_json){
								$timer = isset($v['re_time']) ? $v['re_time']: '';
							}else{
								$timer = $tf->getXmlNode($v, "re_time");
							}

                            if (!empty($timer)) {
                                $timer = rtrim(str_replace("'","",$timer));
                                $value .= "'{$timer}',";
                            } else {
                                $value .= "'{$datetime[1]}',";
                            }
                            $value .= "'{$datetime[0]}',";

                            if (isset($setNewAry) && count($setNewAry) > 0) {
                                $time = time();
                                $rv = en_string($v);
                                $values_xml .= "('{$gid}',1,'{$time}',{$k},'{$rv}'),";
                            }

                            if (!in_array("live", $gameHeadsAry)) {
                                $gameHeadsAry[] = "live";
                            }
								if ($more_is_json){
								$live = isset($v['live']) ?$v['live']: '';
							}else{
								$live = $tf->getXmlNode($v, "live"); 
							}
                            if (empty($live)){$live = "N";}
                            $value .= "'{$live}',";

							if ($more_is_json){
								$hgid = isset($v['hgid']) ? $v['hgid']: '';
							}else{
								$hgid = $tf->getXmlNode($v, "hgid");
							}
                            if (!empty($hgid)) {
							  if ($more_is_json){
									$hgopen = isset($v['hgopen']) ? $v['hgopen']: '';
									$hstrong = isset($v['hstrong']) ? $v['hstrong']: '';
									$hlive = isset($v['hlive']) ? $v['hlive']: '';
								}else{
									$hgopen = $tf->getXmlNode($v, "hgopen");
									$hstrong = $tf->getXmlNode($v, "hstrong");
									$hlive = $tf->getXmlNode($v, "hlive");
								}
                                if(empty($hlive)){$hlive="N";}
                                if (!in_array("hgid", $gameHeadsAry)) {
                                    $gameHeadsAry[] = "hgid";
                                    $gameHeadsAry[] = "hgopen";
                                    $gameHeadsAry[] = "hstrong";
                                    $gameHeadsAry[] = "hlive";
                                }
                                $value .= "'{$hgid}','{$hgopen}','{$hstrong}','{$hlive}',";
                            }
                            if($types[1] == "RE"){
                                switch ($types[0]){
                                    case "FT":
                                        $arr = ["score_h","score_c"];//TIMER 半场
                                        if (!in_array("score_h", $gameHeadsAry)) {
                                            $gameHeadsAry[] = "score_h";
                                            $gameHeadsAry[] = "score_c";
                                        }
                                        $value .="{$ftsh},{$ftsc},";
                                        break;
                                    case "BK":
                                        $arr = ["score_h","score_c","sc_q1_h","sc_q1_a","sc_q1_is","sc_q2_h","sc_q2_a","sc_q2_is","sc_q3_h","sc_q3_a","sc_q3_is","sc_q4_h","sc_q4_a","sc_q4_is","sc_ot_h","sc_ot_a","sc_ot_is","sc_h1_h","sc_h1_a","sc_h1_is","sc_h2_h","sc_h2_a","sc_h2_is"];
                                        if (!in_array("score_h", $gameHeadsAry)) {
                                            $gameHeadsAry = array_merge($gameHeadsAry, $arr);
                                        }
									
										if ($more_is_json){
											$nowsession = isset($v['se_now']) ? $v['se_now']: '';
											if (!empty($v['score'])){
												$v = array_merge($v['score'], $v);
											}
										}else{
											$nowsession = $tf->getXmlNode($vv,"NOWSESSION");
										}
                                        $sc_q1_is = $sc_q2_is = $sc_q3_is = $sc_q4_is = $sc_ot_is = $sc_h1_is = $sc_h2_is = 0;

                                        switch ($nowsession){
                                            case "Q2"://第2节
                                                $sc_q1_is = 1;
                                                break;
                                            case "HT"://半场
                                            case "Q3"://第3节
                                                $sc_q1_is = 1;
                                                $sc_q2_is = 1;
                                                $sc_h1_is = 1;
                                                break;
                                            case "Q4"://第4节
                                                $sc_q1_is = 1;
                                                $sc_q2_is = 1;
                                                $sc_h1_is = 1;
                                                $sc_q3_is = 1;
                                                break;
                                            case "OT"://加时
                                                $sc_q1_is = 1;
                                                $sc_q2_is = 1;
                                                $sc_h1_is = 1;
                                                $sc_q3_is = 1;
                                                $sc_q4_is = 1;
                                                break;
                                        }

                                        foreach ($arr as $n) {
                                            switch ($n){
                                                case "sc_q1_is":
                                                    $value .= "{$sc_q1_is},";
                                                    break;
                                                case "sc_q2_is":
                                                    $value .= "{$sc_q2_is},";
                                                    break;
                                                case "sc_q3_is":
                                                    $value .= "{$sc_q3_is},";
                                                    break;
                                                case "sc_q4_is":
                                                    $value .= "{$sc_q4_is},";
                                                    break;
                                                case "sc_ot_is":
                                                    $value .= "{$sc_ot_is},";
                                                    break;
                                                case "sc_h1_is":
                                                    $value .= "{$sc_h1_is},";
                                                    break;
                                                case "sc_h2_is":
                                                    $value .= "{$sc_h2_is},";
                                                    break;
                                                default:
													 if ($more_is_json){
														 if(isset($v[$n])){
															 $val = $v[$n];
														 }else{
															$val = isset($v[strtoupper($n)])?$v[strtoupper($n)]:0;
														 }
													}else{
														$val = $tf->getXmlNode($vv,strtoupper($n));
													}
													/*if($list_is_json){
														$SCORE_new = $vv['SCORE'];
														if(!empty($SCORE_new)){
															$targets = [
																"SC_H1_A",
																"SC_H1_H",
																"SC_Q1_A",
																"SC_Q1_H",
																"SC_Q2_A",
																"SC_Q2_H",
																"SC_Q3_A",
																"SC_Q3_H"
															];
															if (in_array($n, $targets)) {
																$val = isset($SCORE_new[strtoupper($n)])?$SCORE_new[strtoupper($n)]:0;
															}
														}
													}*/
                                                    $value .= "{$val},";
                                                    break;
                                            }


                                        }

                                        break;
                                }
                            }
                            $value = rtrim($value, ",");
                            $values .= "{$value}),";


                            if($gtype == "FT"){ //存储球员
                                setSFSData($v,$lid,$langx);
                            }
                        }
                    }
                    $values_xml = rtrim($values_xml,",");
                    if(!empty($values_xml)){
                        $up_xml = "";
                        $i_xml = rtrim("`" . implode("`,`", $setNewAry) . "`,", ",");
                        foreach ($setNewAry as $v){
                            if($v!="gid"){
                                $up_xml.= "`{$v}`=VALUES(`{$v}`),";
                            }
                        }
                        $up_xml = rtrim($up_xml,",");
                        $insert = "INSERT INTO {$table_xml}({$i_xml}) VALUES {$values_xml}  ON DUPLICATE KEY UPDATE {$up_xml}";
                        $db_s->execSql($insert);
                    }
                    
                    $values = rtrim($values, ",");
                    if (!empty($values)) {
                        $setStr = rtrim("`" . implode("`,`", $gameHeadsAry) . "`,", ",");
                        $up = "";
                        //$gameHeadsAry = array_merge($gameHeads,$gameHeadsAry);
                        foreach ($gameHeadsAry as $v) {
                            $un = ["gid","hgid"];
                            if (!in_array($v,$un)) {
                                $up .= "`{$v}`=VALUES(`{$v}`),";
                            }

                        }
                        $up = rtrim($up, ",");
                        $insert = "INSERT INTO {$table}({$setStr}) VALUES {$values}  ON DUPLICATE KEY UPDATE {$up}";
                        $res = $db_s->execSql($insert);
                        if ($res > 0 && strtoupper($types[0])=='FT') {
                            $ftRows = $db_s->select("SELECT `gid`,`hgid` FROM {$table} WHERE `ecid` = {$ecid} AND `ptype` is null ");
                            if ($ftRows) {
                                $ftgids = array_merge(array_column($ftRows,'gid'),array_column($ftRows,'hgid'));
                                $ftgids = implode(',',$ftgids);
                                $score = $ftsh.':'.$ftsc;
                                getMinuteBet($ftgids,$score);
                            }
                        }
                        print_r(utf8_gbk("[ECID:{$ecid}] 更新完成！\n"));
                    }


                    $ki++;
                    // if($ki%$count == 0){ 
                    //     sleep(3);//每隔几个条就延时3秒
                    // }

                }
                return " 更新完成!";
            }catch (\Exception $e){
                return $e->getMessage();
            }
        }else{
            return "暂无数据！";
        }
    }else{ 
        return $res["msg"];
    }
}

/**
 * 电竞赛事采集并入库
 * @param string $type 采集类型
 * @param array $typeAry
 * @return false|string
 */
function setESMatchData($type="ES_R",$typeAry=[],$langx="zh-cn",$isEdit="N",$level=0,$code=0) { 
    global $db_s,$isHRAry;
    $table = $typeAry["table"];
    $table_json = $typeAry["table_xml"];
    $gtype = $typeAry["gtype"];
    $date = date("Y-m-d");
    
    $css = "";
    switch ($langx){
        case "zh-tw":
            $league = "league_tw";
            $team_h = "team_h_tw";
            $team_c = "team_c_tw";
            $is_league = "is_league_tw";
            $css = "_tw";
            break;
        case "en-us":
            $league = "league_en";
            $team_h = "team_h_en";
            $team_c = "team_c_en";
            $is_league = "is_league_en";
            $css = "_en";
            break;
        default:
            $league = "league";
            $team_h = "team_h";
            $team_c = "team_c";
            $is_league = "is_league";
            $css = "_cn";
            break;
    }
    $setNewAry = [];
    $types = explode("_",$type);
    $isRB = "N";
    switch ($types[1]){
        case "R":
            $setNewAry = ["gid","is_r","r_up_time","r_display","r{$css}"];//"r_cn","r_tw","r_en",
            break;
        case "RE":
            $isRB = "Y";
            $setNewAry = ["gid","is_re","re_up_time","re_display","re{$css}"];//"re_cn","re_tw","re_en",
            break;
        case "P3":
            $setNewAry = ["gid","is_p3","p3_up_time","p3_display","p3{$css}"];//"p3_cn","p3_tw","p3_en",
            break;
        case "PD":
        case "RPD":
            $setNewAry = ["gid","is_pd","pd_up_time","pd_display","pd{$css}"];//"pd_cn","pd_tw","pd_en",
            break;
    }

    $tf = new Transform();
    $res = $tf->getUserCurl(2,$code);
    if ($res["code"] == 10000) {
        $json_str = $tf->get_game_list($typeAry,$langx);

        if(!empty($json_str)){ 
            $json = json_decode($json_str,true);
            if(!empty($json) && $json["status"] == "success"){ 
                $values = "";
                $values_json = "";
                $k = 0;
                $kk = 0;
                $gameHeadsAry = [];
                foreach($json["response"] as $v){ 
                    if (true){
                        $dt = match_start11($v["GAME_DATE_TIME"]);
                        $ary = [
                            "gid" => $v["GID"],
                            "gidm"=> $v["GIDM"],
                            "lid" => $v["LID"],
                            "m_date" => $dt[0], 
                            "m_time" => $dt[1],
                            "datetime" => $dt[2],
                            $is_league => isset($v["LEAGUE"]) ? 1 : 0, 
                            $league => $v["LEAGUE"],
                            "gnum_h" => $v["GNUM_H"],
                            "gnum_c" => $v["GNUM_C"],
                            $team_h => $v["TEAM_H"], 
                            $team_c => $v["TEAM_C"],
                            "strong" => $v["STRONG"],
                            "peid" => $v["PARENT_ID"],
                            "period_id" => 1,
                            "live" => "N",
                            "gametype" => "Match",
                            "gamenum" => 0,
                            "mode" => $v["BEST"]
                        ];
                        $moreAry = $typeAry;
                        $moreAry["peid"] = $v["PARENT_ID"];
                        $moreAry["lid"] = $v["LID"];
                        $moreAry["isRB"] = $isRB;
                        $moreAry["mode"] = "CUP";
                        $moreAry["filter"] = "Main";
                        $moreAry["outerGameNum"] = "N/A";
                        $moreAry["type"] = "getMore";
                        $moreAry["gid"] = $v["GID"];
                        $json_more = $tf->get_game_more($moreAry, $langx);
                        if(!empty($json_more)){ 
                            $json_more = json_decode($json_more,true);
                            if($json_more["status"] == "success"){ 
							       $gamesData = isset($json_more["response"]["GAMES"]) 
                                    ? $json_more["response"]["GAMES"] 
                                    : $json_more["response"];

                                // --- 補采电竞父层额外信息：MODE / SCORE / MATCH_H|C / NOWGAME / TYPE ---
                                $moreResp = $json_more["response"];
                                $modeVal    = isset($moreResp["MODE"])    ? $moreResp["MODE"]    : (isset($v["BEST"]) ? $v["BEST"] : "");
                  
                                $v["_more"] = [
                                    "MODE"     => $modeVal,
                                    "SCORE"    => isset($moreResp["SCORE"])   ? $moreResp["SCORE"]   : [],
                                    "MATCH_H"  => isset($moreResp["MATCH_H"]) ? $moreResp["MATCH_H"] : "",
                                    "MATCH_C"  => isset($moreResp["MATCH_C"]) ? $moreResp["MATCH_C"] : "",
                                    "NOWGAME"  => isset($moreResp["NOWGAME"]) ? $moreResp["NOWGAME"] : "",
                                    "TYPE"     => isset($moreResp["TYPE"])    ? $moreResp["TYPE"]    : "",
                                    "SHOWTYPE" => isset($moreResp["SHOWTYPE"])? $moreResp["SHOWTYPE"]: "",
                                ];

                                foreach($gamesData as $vv){
                               // foreach($json_more["response"]["GAMES"] as $vv){ 
                                    $ary["gid"] = $vv["GID"]; 
                                    $ary["gidm"] = $vv["GIDM"];
                                    $ary["gnum_h"] = $vv["GNUM_H"];
                                    $ary["gnum_c"] = $vv["GNUM_C"];
                                    $ary[$is_league] = isset($v["LEAGUE"]) ? 1 : 0; 
                                    $ary[$league] = $vv["LEAGUE"];
                                    $ary[$team_h] = $vv["TEAM_H"]; 
                                    $ary[$team_c] = $vv["TEAM_C"];
                                    $ary["strong"] = $vv["STRONG"];
                                    $ary["period_id"] = $vv["PERIOD_ID"];
                                    $ary["gametype"] = $vv["GAMETYPE"];
                                    $ary["peid"] = $vv["PARENT_ID"];
                                    $ary["gamenum"] = empty($vv["GAMENUM"]) ? 0 : $vv["GAMENUM"];
                                    $ary["live"] = isset($vv["LIVE"]) ? $vv["LIVE"] : "N";
                                    // 以 more 层的 MODE 为准，众 $v["BEST"] 为 fallback（修复原先读空的问题）
                                    $ary["mode"] = $modeVal;
                                    $values .= "('".implode("','",array_values($ary))."'),";
                                    // if($vv["GID"]=="50788"){ 
                                    //     print_r("sdfsdf");exit;
                                    // }
                                    // print_r($vv["GID"]."\n");
                                    if (isset($setNewAry) && count($setNewAry) > 0) {
                                        $time = time();
                                        $rv = en_string(json_encode($v));
                                        $values_json .= "('{$vv["GID"]}',1,'{$time}',{$kk},'{$rv}'),";
                                    }
                                    $kk++;
                                }
                            } 
                        }
                        $gameHeadsAry = array_keys($ary);
                        
                        // if (isset($setNewAry) && count($setNewAry) > 0) {
                        //     $time = time();
                        //     $rv = en_string(json_encode($v));
                        //     $values_json .= "('{$v["GID"]}',1,'{$time}',{$k},'{$rv}'),";
                        // }
                        
                        $k += 1;
                        print_r(utf8_gbk("[PEID:{$v["PARENT_ID"]}] 更新完成！\n"));
                    }
                }

                //更新json表
                $values_json = rtrim($values_json,",");
                if(!empty($values_json)){
                    $up_json = "";
                    $i_json = rtrim("`" . implode("`,`", $setNewAry) . "`,", ",");
                    foreach ($setNewAry as $v){
                        if($v!="gid"){
                            $up_json.= "`{$v}`=VALUES(`{$v}`),";
                        }
                    }
                    $up_json = rtrim($up_json,",");
                    $insert = "INSERT INTO {$table_json}({$i_json}) VALUES {$values_json}  ON DUPLICATE KEY UPDATE {$up_json}";
                    // print_r($insert);
                    $db_s->execSql($insert);
                }

                //更新表
                $values = rtrim($values, ",");
                if (!empty($values)) {
                    $setStr = rtrim("`" . implode("`,`", $gameHeadsAry) . "`,", ",");
                    $up = "";
                    
                    foreach ($gameHeadsAry as $v) {
                        $un = ["gid","hgid"];
                        if (!in_array($v,$un)) {
                            $up .= "`{$v}`=VALUES(`{$v}`),";
                        }

                    }
                    $up = rtrim($up, ",");
                    $insert = "INSERT INTO {$table}({$setStr}) VALUES {$values}  ON DUPLICATE KEY UPDATE {$up}";
                    // print_r($insert."\n");
                    $res = $db_s->execSql($insert);
                    
                    
                }



            }  
        }
        
    }else{ 
        return $res["msg"];
    }
}

/**
 * 足球有比分变动一分钟内下注订单进球取消
 * 
 */
function getMinuteBet($gids,$score){
    global $db_c;
    $table = Constant::T_BET;
    $footTable = Constant::S_FT;
    $time = time()-65;
    $bets = $db_c->select("SELECT `ID`,`gid`,`score`,`bet_golds`,`nid` FROM {$table} WHERE `gtype`='FT' AND `gid` in({$gids}) AND `bet_time` >= {$time} AND `danger` > 0 AND `isResult`=0");
    $m15 = ["ARE","AROU","ARM","BRE","BROU","BRM","CRE","CROU","CRM","DRE","DROU","DRM","ERE","EROU","ERM","FRE","FROU","FRM"];
    if ($bets) {
        foreach($bets as $k => $v){
            if(isset($v["wtype"]) && in_array($v["wtype"],$m15) && !empty($v["org_score"])){
                $oscoreAry = explode(":",$v["org_score"]);
                $scoreAry = explode(":",$score);
                $score = abs($scoreAry[1]-$oscoreAry[0]).":".abs($scoreAry[0]-$oscoreAry[1]);
            }

            if ($v['score'] == $score) {
                continue;
            }
            $up = [
                "status" => 16,
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
            $db_c->update($table,$up,"`ID`={$v["ID"]}");
            $pay_gold = $v["bet_golds"];
            $sta = "T";//退还
            if($pay_gold>0 && !empty($sta)){//现金玩家更新金额
                $memTable = Constant::T_MEMBER;
                $sql = "UPDATE {$memTable} SET `credit`=(`credit`+{$pay_gold}),`balance_credit`=(`balance_credit`+{$pay_gold}) WHERE `nid`='{$v["nid"]}' AND `pay_type`=1";
                // set_credit_logs($v["nid"],$pay_gold);
                $insert = [
                    "nid" => $v["nid"],
                    "type" => "Y",
                    "old_cash" => 0,
                    "cash" => $pay_gold,
                    "new_cash" => $pay_gold,
                    "usertype" => "",
                    "logintime"  => time(),
                    "s_name" => ""
                ];
                $db_c->insert(Constant::T_CREDIT_LOG,$insert);
                 $db_c->execSql($sql);
            }
        }
    }
}

/**
 * 球员进球入库
 * @param $xml
 * @param int $lid
 * @param string $langx
 */
function setSFSData($xml,$lid=0,$langx="zh-cn"){
    global $db_s;
    $sfsname = getXmlNode($xml,"SFSGAME");
    $sgid = getXmlNode($xml, "gid");
    $home = getXmlNode($xml,"team_h");
    $away = getXmlNode($xml,"team_c");
    $legs = getXmlNode($xml,"league");
    $gidm = getXmlNode($xml,"gidm");
    $datetime = strtotime(getXmlNode($xml,"datetime"));
    switch ($langx){
        case "zh-tw":
            $league = "league_tw";
            $teamsname = "teamsname_tw";
            $team = "team_tw";
            $fs_flg = "最先/最後進球球員";
            $sfs_name = "SFS_NAME_C";
            break;
        case "en-us":
            $league = "league_en";
            $teamsname = "teamsname_en";
            $team = "team_en";
            $fs_flg = "First / Last goal";
            $sfs_name = "SFS_NAME_E";
            break;
        default:
            $league = "league";
            $teamsname = "teamsname";
            $team = "team";
            $fs_flg = "最先/最后进球球员";
            $sfs_name = "SFS_NAME_G";
            break;
    }

    if(!empty($sfsname)){
        //最先进球球员
        preg_match("/\<SFS id=\"19C\">(.*?)\<\/SFS>/is", $sfsname, $sfs_c19);
        preg_match_all("/\<RTYPES id=\"(.*?)\">(.*?)\<\/RTYPES>/is", $sfs_c19[1], $c19s);
        preg_match("/\<SFS id=\"19H\">(.*?)\<\/SFS>/is", $sfsname, $sfs_h19);
        preg_match_all("/\<RTYPES id=\"(.*?)\">(.*?)\<\/RTYPES>/is", $sfs_h19[1], $h19s);


        $c19 = $c19s[2];
        $h19 = $h19s[2];
        $gid_h19 = getXmlNode($sfs_h19[1],"SFS_GID");
        $gid_c19 = getXmlNode($sfs_c19[1],"SFS_GID");
        $vs = [];
        foreach ($c19 as $k => $v){
            $sha1_c = sha1($sgid."|".$gid_c19."|".getXmlNode($v,"TEAM_ID")."|".getXmlNode($v,"SFS_RTYPE"));
            $vs[] = [
                "C19",
                $datetime,
                $gid_c19,
                $sha1_c,
                $sgid,
                $lid,
                getXmlNode($v,"TEAM_ID"),
                $legs,
                $home."vs".$away."-".$fs_flg,
                getXmlNode($v,$sfs_name),
                getXmlNode($v,"SFS_RTYPE"),
                getXmlNode($v,"SFS_IOR"),
                $gidm
            ];

            if(isset($h19[$k])) {
                $sha1_h = sha1($sgid . "|" . $gid_h19 . "|" . getXmlNode($h19[$k], "TEAM_ID") . "|" . getXmlNode($h19[$k], "SFS_RTYPE"));
                $vs[] = [
                    "H19",
                    $datetime,
                    $gid_h19,
                    $sha1_h,
                    $sgid,
                    $lid,
                    getXmlNode($h19[$k], "TEAM_ID"),
                    $legs,
                    $home."vs".$away."-".$fs_flg,
                    getXmlNode($h19[$k], $sfs_name),
                    getXmlNode($h19[$k], "SFS_RTYPE"),
                    getXmlNode($h19[$k], "SFS_IOR"),
                    $gidm
                ];
            }

        }

        //任何时间进球球员
        preg_match("/\<SFS id=\"204C\">(.*?)\<\/SFS>/is", $sfsname, $sfs_c204);
        preg_match_all("/\<RTYPES id=\"(.*?)\">(.*?)\<\/RTYPES>/is", $sfs_c204[1], $c204s);
        preg_match("/\<SFS id=\"204H\">(.*?)\<\/SFS>/is", $sfsname, $sfs_h204);
        preg_match_all("/\<RTYPES id=\"(.*?)\">(.*?)\<\/RTYPES>/is", $sfs_h204[1], $h204s);

        $c204 = $c204s[2];
        $h204 = $h204s[2];
        $gid_h204 = getXmlNode($sfs_h204[1],"SFS_GID");
        $gid_c204 = getXmlNode($sfs_c204[1],"SFS_GID");

        foreach ($c204 as $k => $v){
            $sha1_c = sha1($sgid."|".$gid_c204."|".getXmlNode($v,"TEAM_ID")."|".getXmlNode($v,"SFS_RTYPE"));
            $vs[] = [
                "C204",
                $datetime,
                $gid_c204,
                $sha1_c,
                $sgid,
                $lid,
                getXmlNode($v,"TEAM_ID"),
                $legs,
                $home."vs".$away."-".$fs_flg,
                getXmlNode($v,$sfs_name),
                getXmlNode($v,"SFS_RTYPE"),
                getXmlNode($v,"SFS_IOR"),
                $gidm
            ];

            if(isset($h204[$k])) {
                $sha1_h = sha1($sgid . "|" . $gid_h204 . "|" . getXmlNode($h204[$k], "TEAM_ID") . "|" . getXmlNode($h204[$k], "SFS_RTYPE"));
                $vs[] = [
                    "H204",
                    $datetime,
                    $gid_h204,
                    $sha1_h,
                    $sgid,
                    $lid,
                    getXmlNode($h204[$k], "TEAM_ID"),
                    $legs,
                    $home."vs".$away."-".$fs_flg,
                    getXmlNode($h204[$k], $sfs_name),
                    getXmlNode($h204[$k], "SFS_RTYPE"),
                    getXmlNode($h204[$k], "SFS_IOR"),
                    $gidm
                ];
            }
        }

        //最后进球球员
        preg_match("/\<SFS id=\"20C\">(.*?)\<\/SFS>/is", $sfsname, $sfs_c20);
        preg_match_all("/\<RTYPES id=\"(.*?)\">(.*?)\<\/RTYPES>/is", $sfs_c20[1], $c20s);
        preg_match("/\<SFS id=\"20H\">(.*?)\<\/SFS>/is", $sfsname, $sfs_h20);
        preg_match_all("/\<RTYPES id=\"(.*?)\">(.*?)\<\/RTYPES>/is", $sfs_h20[1], $h20s);

        $c20 = $c20s[2];
        $h20 = $h20s[2];
        $gid_h20 = getXmlNode($sfs_h20[1],"SFS_GID");
        $gid_c20 = getXmlNode($sfs_c20[1],"SFS_GID");

        foreach ($c20 as $k => $v){
            $sha1_c = sha1($sgid."|".$gid_c20."|".getXmlNode($v,"TEAM_ID")."|".getXmlNode($v,"SFS_RTYPE"));
            $vs[] = [
                "C20",
                $datetime,
                $gid_c20,
                $sha1_c,
                $sgid,
                $lid,
                getXmlNode($v,"TEAM_ID"),
                $legs,
                $home."vs".$away."-".$fs_flg,
                getXmlNode($v,$sfs_name),
                getXmlNode($v,"SFS_RTYPE"),
                getXmlNode($v,"SFS_IOR"),
                $gidm
            ];
            if(isset($h20[$k])) {
                $sha1_h = sha1($sgid . "|" . $gid_h20 . "|" . getXmlNode($h20[$k], "TEAM_ID") . "|" . getXmlNode($h20[$k], "SFS_RTYPE"));
                $vs[] = [
                    "H20",
                    $datetime,
                    $gid_h20,
                    $sha1_h,
                    $sgid,
                    $lid,
                    getXmlNode($h20[$k], "TEAM_ID"),
                    $legs,
                    $home."vs".$away."-".$fs_flg,
                    getXmlNode($h20[$k], $sfs_name),
                    getXmlNode($h20[$k], "SFS_RTYPE"),
                    getXmlNode($h20[$k], "SFS_IOR"),
                    $gidm
                ];
            }
        }

        $arr = ["sfs_id","datetime","gid","sha1","sgid","lid","team_id",$league,$teamsname,$team,"rtype","ioratio","gidm"];
        if(count($vs)>0){
            $f = implode("`,`",$arr);
            $val = "";
            foreach ($vs as $k => $v){
                $vv = implode("','", $v);
                $val .= "('{$vv}'),";
            }
            $val = rtrim($val,",");
            $table = Constant::S_SP;
            $sql = "INSERT INTO {$table} (`{$f}`) VALUES {$val} ON DUPLICATE KEY UPDATE `lid`=VALUES(`lid`),`gidm`=VALUES(`gidm`),`{$league}`=VALUES(`{$league}`),`{$teamsname}`=VALUES(`{$teamsname}`),`{$team}`=VALUES(`{$team}`)";

            $db_s->execSql($sql);
        }
    }
}

function setAcceptDataAG($typeAry=[],$langx="zh-cn"){
    $tf = new TransformAG();
    $tf->randUser();
    $json = $tf->get_result($typeAry,$langx);
    $arr = json_decode($json,true);
    $sum = 0;
    if(isset($arr["results_data"]) && count($arr["results_data"])>0){
        $gids = array_column($arr["results_data"],"gid") ;
        
        $gids = is_object($gids) ? (array)$gids : $gids;
        if(count($gids)>0){
            switch ($typeAry["gtype"]){
                case "FT":
                    $sum = Result_FT($gids,$langx);
                    break;
                case "BK":
                    $sum = Result_BK($gids,$langx);
                    break;
                case "BS":
                    $sum = Result_BS($gids,$langx);
                    break;
                case "TN":
                    $sum = Result_TN($gids,$langx);
                    break;
                case "VB":
                    $sum = Result_VB($gids,$langx);
                    break;
                case "TT":
                    $sum = Result_TT($gids,$langx);
                    break;
                case "BM":
                    $sum = Result_BM($gids,$langx);
                    break;
                case "ES":
                    $sum = Result_ES($gids,$langx);
                    break;
                case "SK":
                    $sum = Result_SK($gids,$langx);
                    break;
                case "OP":
                    $sum = Result_OP($gids,$langx);
                    break;

            }
        }

    }
    
    if(isset($sum)){
        if(is_numeric($sum)) {
            return "采集{$sum}条赛果！";
        }else{
            return $sum;
        }
    }else{
        return "接收失败！";
    }
}

/**
 * 足球结果入库
 * @param $p
 * @param $langx
 * @return int|string
 */
function Result_FT($p,$langx){
    global $db_s;
    $table = Constant::S_FT;
    $sum = 0;
    try{
        foreach ($p as $k => $v){
            foreach ($v as $kk=>$vv){
                $gid = $vv["gid"];
                $more = serialize($vv);
                if(!isset($vv["GMC"])){
                    $vv["GMC"] = $vv["GMH"];
                }


                if(!isset($vv["HGMH"]) && isset($vv["GMH"]) ){
                    $vv["HGMH"] = $vv["GMH"];
                    $vv["HGMC"] = $vv["GMC"];
                }else if(!isset($vv["HGMC"])){
                    $vv["HGMC"] = $vv["HGMH"];
                }

                $inballs = inball_FT($vv["GMH"],$vv["GMC"],$vv["HGMH"],$vv["HGMC"],$langx);
                if($inballs=="no"){ 
                    $hfball = ft_half_inball($vv["HGMH"],$vv["HGMC"]);
                    if ($hfball != 'no') {
                        $rs = $db_s->select("SELECT `gidm`,`m_time`,`datetime` FROM {$table} WHERE `gid`='{$gid}' AND `is_inball`=0","Row");
                        if($rs){
                            $gidm = $rs["gidm"];
                            $ditime = time() - $rs['datetime'];
                            if(!empty($gidm) && (substr($rs['m_time'],0,2) == 'HT'||substr($rs['m_time'],0,2) == '2H'|| $ditime > 3300)) {
                                $sql = "UPDATE {$table} SET `is_hr_inball`=1,`inball_h_hr`='{$hfball[0]}',`inball_c_hr`='{$hfball[1]}' WHERE `gidm`={$gidm}";
                                $db_s->execSql($sql);
                            }
                        }
                    }
                    continue;
                }
                $cs = "";
                switch ($langx){
                    case "en-us":
                        $cs = "_en";
                        break;
                    case "zh-tw":
                        $cs = "_tw";
                        break;

                }
                $rs = $db_s->select("SELECT `gidm`,`team_h{$cs}`,`team_c{$cs}` FROM {$table} WHERE `gid`='{$gid}'","Row");
                if($rs){
                    $gidm = $rs["gidm"];
                    if(!empty($gidm)) {
                        $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inballs["mb"]}',`inball_c`='{$inballs["tg"]}',";
                        $sql .= "`inball_h_hr`='{$inballs["mb_hr"]}',`inball_c_hr`='{$inballs["tg_hr"]}',`inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm}";
                        $db_s->execSql($sql);

                        //进球球员 入库
                        if(isset($vv["rs_sfs"]) && !empty($vv["rs_sfs"])){

                            $sfsTable = Constant::S_SP;
                            $sfs = $vv["rs_sfs"];
                            $team_h = $rs["team_h{$cs}"];
                            $team_c = $rs["team_c{$cs}"];
                            $hc = "H";
                            $arys = [
                                "SFS_f"=>19,//最先进球球员
                                "SFS_l"=>20,//最后进球球员
                                "SFS_a"=>204//任意时间进球球员
                            ];
                            foreach ($arys as $fs => $fsid){
                                if(isset($sfs[$fs])){
                                    $result_fs = explode(" <BR>",$sfs[$fs]["result"]);
                                    foreach ($result_fs as $ress){
                                        $res = explode(" - ",$ress);
                                        if(count($res) == 2) {
                                            if (strtolower(str_replace(" ","",$res[0])) == strtolower(str_replace(" ","",$team_c))) {
                                                $hc = "C";
                                            }
                                            //print_r($res[0]."<BR>".$team_c."<BR>{$hc}---");
                                            $sfs_id = $hc . $fsid;
                                            $sql = "UPDATE {$sfsTable} SET `win`='Y' WHERE `sgid`='{$gid}' AND `sfs_id`='{$sfs_id}' AND `team{$cs}`='{$res[1]}'";
                                            /*if($fsid==20){
                                                print_R($sql);exit;
                                            }*/
                                            //print_R($sql);exit;
                                            $db_s->execSql($sql);

                                        }
                                    }
                                    $sql = "UPDATE {$sfsTable} SET `result`='Y' WHERE `sgid`='{$gid}' AND `sfs_id` LIKE '%{$fsid}'";
                                    $db_s->execSql($sql);
                                }
                            }

                        }
                    }
                    $sum++;
                }
            }
        }
        return $sum;
    }catch (\Exception $e){
        return $e->getMessage();
    }

}

/**
 * 半场赛果更新
 * @param $mb_inball_hr
 * @param $tg_inball_hr
 */
function ft_half_inball($mb_inball_hr,$tg_inball_hr){
    $mb_inball_hr = chk_result($mb_inball_hr);
    $tg_inball_hr  = chk_result($tg_inball_hr);
    if(strpos($mb_inball_hr,"-")!==false){return "no";}
    return [$mb_inball_hr,$tg_inball_hr];
}

/**
 * 足球-赛果处理
 * @param $mb_inball
 * @param $tg_inball
 * @param $mb_inball_hr
 * @param $tg_inball_hr
 * @param string $langx
 * @return array
 */
function inball_FT($mb_inball,$tg_inball,$mb_inball_hr,$tg_inball_hr,$langx="en-us"){
    global $result_status;
    $res = $result_status[$langx];
    $mb_inball = chk_result($mb_inball);
    $tg_inball =  chk_result($tg_inball);
    $mb_inball_hr = chk_result($mb_inball_hr);
    $tg_inball_hr  = chk_result($tg_inball_hr);

    if(strpos($mb_inball,"-")!==false){
        return "no";
    }
    if(empty($mb_inball_hr) && !is_numeric($mb_inball_hr)){return "no";}
    $status = 0;
    
    $key = array_search($mb_inball,$res);
    $key_h = array_search($mb_inball_hr,$res);
    if($key>0 || $key_h>0){
        if(empty($key)){
            $key = $key_h;
        }
        if(is_numeric($mb_inball_hr) && is_numeric($tg_inball_hr)){
            $tg_inball=$mb_inball_hr;
            $mb_inball=$tg_inball_hr;
        }else{
            $mb_inball='-1';
            $tg_inball='-1';
            $mb_inball_hr='-1';
            $tg_inball_hr='-1';
            $status=$key;
        }
    }else{
        $str = "";
        switch ($langx){
            case "zh-cn":
                $str ="球员没参赛/球员弃权";
                break;
            case "zh-tw":
                $str ="球員沒參賽/球員棄權";
                break;
            case "en-us":
                $str ="playernotparticipate/retirement";
                break;
        }

        if(strpos($str,$mb_inball)!==false){
            $mb_inball='-1';
            $tg_inball='-1';
            $mb_inball_hr='-1';
            $tg_inball_hr='-1';
            $status=5;
        }else{
            if(!is_numeric($mb_inball)){return "no";}
        }
    }

    return array('mb'=>$mb_inball,'tg'=>$tg_inball,'mb_hr'=>$mb_inball_hr,'tg_hr'=>$tg_inball_hr,'sta'=>$status);


}

/**
 * 篮球结果入库
 * @param $p
 * @param $langx
 * @return int|string
 */
function Result_BK($p,$langx="en-us"){
    global $db_s;
    $table = Constant::S_BK;
    $sum = 0;
    $cs = "";
    switch ($langx){
        case "en-us":
            $cs = "_en";
            break;
        case "zh-tw":
            $cs = "_tw";
            break;

    }
    try{
        foreach ($p as $k => $v){
            foreach ($v as $kk=>$vv){
                $gid = $vv["gid"];
                $more = serialize($vv);
                $mb = $vv["GMH"]["result_h"];
                $tg = $vv["GMH"]["result_c"];
                $inballs = inball_BK($mb,$tg,$langx);
                if($inballs=="no"){continue;}
                $inball_h = $inballs["mb"];
                $inball_c = $inballs["tg"];


                if($inballs["sta"] != 0){
                    $sc_q1_h = -1;
                    $sc_q1_a = -1;

                    $sc_q2_h = -1;
                    $sc_q2_a = -1;

                    $sc_q3_h = -1;
                    $sc_q3_a = -1;

                    $sc_q4_h = -1;
                    $sc_q4_a = -1;

                    $sc_h1_h = -1;
                    $sc_h1_a = -1;

                    $sc_h2_h = -1;
                    $sc_h2_a = -1;

                    $sc_ot_h = -1;
                    $sc_ot_a = -1;

                    $sta_q1 = $inballs["sta"];
                    $sta_q2 = $inballs["sta"];
                    $sta_q3 = $inballs["sta"];
                    $sta_q4 = $inballs["sta"];

                    $sta_h1 = $inballs["sta"];
                    $sta_h2 = $inballs["sta"];
                    $sta_ot = $inballs["sta"];
                }else{
                    if(isset($vv["GMH3"])) {
                        $inball_q1 = inball_BK($vv["GMH3"]["result_h"], $vv["GMH3"]["result_c"], $langx);
                        if ($inball_q1["sta"] != 0) {
                            $sc_q1_h = -1;
                            $sc_q1_a = -1;
                            $sta_q1 = $inball_q1["sta"];
                        } else {
                            $sc_q1_h = $inball_q1["mb"];
                            $sc_q1_a = $inball_q1["tg"];
                            $sta_q1 = 0;
                        }
                    }

                    if(isset($vv["GMH4"])) {
                        $inball_q2 = inball_BK($vv["GMH4"]["result_h"], $vv["GMH4"]["result_c"], $langx);
                        if ($inball_q2["sta"] != 0) {
                            $sc_q2_h = -1;
                            $sc_q2_a = -1;
                            $sta_q2 = $inball_q2["sta"];
                        } else {
                            $sc_q2_h = $inball_q2["mb"];
                            $sc_q2_a = $inball_q2["tg"];
                            $sta_q2 = 0;
                        }
                    }

                    if(isset($vv["GMH5"])) {
                        $inball_q3 = inball_BK($vv["GMH5"]["result_h"], $vv["GMH5"]["result_c"], $langx);
                        if ($inball_q3["sta"] != 0) {
                            $sc_q3_h = -1;
                            $sc_q3_a = -1;
                            $sta_q3 = $inball_q3["sta"];
                        } else {
                            $sc_q3_h = $inball_q3["mb"];
                            $sc_q3_a = $inball_q3["tg"];
                            $sta_q3 = 0;
                        }
                    }

                    if(isset($vv["GMH6"])) {
                        $inball_q4 = inball_BK($vv["GMH6"]["result_h"], $vv["GMH6"]["result_c"], $langx);
                        if ($inball_q4["sta"] != 0) {
                            $sc_q4_h = -1;
                            $sc_q4_a = -1;
                            $sta_q4 = $inball_q4["sta"];
                        } else {
                            $sc_q4_h = $inball_q4["mb"];
                            $sc_q4_a = $inball_q4["tg"];
                            $sta_q4 = 0;
                        }
                    }


                    if(isset($vv["GMH1"])) {
                        $inball_h1 = inball_BK($vv["GMH1"]["result_h"], $vv["GMH1"]["result_c"], $langx);
                        if ($inball_h1["sta"] != 0) {
                            $sc_h1_h = -1;
                            $sc_h1_a = -1;
                            $sta_h1 = $inball_h1["sta"];
                        } else {
                            $sc_h1_h = $inball_h1["mb"];
                            $sc_h1_a = $inball_h1["tg"];
                            $sta_h1 = 0;
                        }
                    }

                    if(isset($vv["GMH2"])) {
                        $inball_h2 = inball_BK($vv["GMH2"]["result_h"], $vv["GMH2"]["result_c"], $langx);
                        if ($inball_h2["sta"] != 0) {
                            $sc_h2_h = -1;
                            $sc_h2_a = -1;
                            $sta_h2 = $inball_h2["sta"];
                        } else {
                            $sc_h2_h = $inball_h2["mb"];
                            $sc_h2_a = $inball_h2["tg"];
                            $sta_h2 = 0;
                        }
                    }


                    if(isset($vv["HGMH"])) {
                        $inball_ot = inball_BK($vv["HGMH"]["result_h"], $vv["HGMH"]["result_c"], $langx);
                        if ($inball_ot["sta"] != 0) {
                            $sc_ot_h = -1;
                            $sc_ot_a = -1;
                            $sta_ot = $inball_ot["sta"];
                        } else {
                            $sc_ot_h = $inball_ot["mb"];
                            $sc_ot_a = $inball_ot["tg"];
                            $sta_ot = 0;
                        }
                    }
                }
                //print_r($inballs);
                $rs = $db_s->select("SELECT `gidm`,`gnum_h` FROM {$table} WHERE `gid`='{$gid}'","Row");
                if($rs){
                    $gidm = $rs["gidm"];
                    $row = $db_s->select("SELECT `gidm`,`gnum_h` FROM {$table} WHERE `gidm`='{$gidm}' AND LENGTH(`gnum_h`)=5");

                    foreach ($row as $k => $n){
                        $gnum = $n["gnum_h"];
                        if (!empty($gidm)) {
                            $up = "`sc_q1_is`=1,`sc_q2_is`=1,`sc_q3_is`=1,`sc_q4_is`=1,`sc_h1_is`=1,`sc_h1_is`=1,`sc_ot_is`=1,`sc_q1_is`=1,`is_inball`=1,`is_hr_inball`=1,";

                            if(isset($sc_q1_h) && is_numeric($sc_q1_h)){
                                $up .= "`sc_q1_h`='{$sc_q1_h}',`sc_q1_a`='{$sc_q1_a}',";
                            }

                            if(isset($sc_q2_h) && is_numeric($sc_q2_h)){
                                $up .= "`sc_q2_h`='{$sc_q2_h}',`sc_q2_a`='{$sc_q2_a}',";
                            }

                            if(isset($sc_q3_h) && is_numeric($sc_q3_h)){
                                $up .= "`sc_q3_h`='{$sc_q3_h}',`sc_q3_a`='{$sc_q3_a}',";
                            }

                            if(isset($sc_q4_h) && is_numeric($sc_q4_h)){
                                $up .= "`sc_q4_h`='{$sc_q4_h}',`sc_q4_a`='{$sc_q4_a}',";
                            }

                            if(isset($sc_h1_h) && is_numeric($sc_h1_h)){
                                $up .= "`sc_h1_h`='{$sc_h1_h}',`sc_h1_a`='{$sc_h1_a}',";
                            }

                            if(isset($sc_h2_h) && is_numeric($sc_h2_h)){
                                $up .= "`sc_h2_h`='{$sc_h2_h}',`sc_h2_a`='{$sc_h2_a}',";
                            }

                            if(isset($sc_ot_h) && is_numeric($sc_ot_h)){
                                $up .= "`sc_ot_h`='{$sc_ot_h}',`sc_ot_a`='{$sc_ot_a}',";
                            }


                            //全场
                            if(isset($inball_h) && is_numeric($inball_h)) {
                                $upAll = $up . " `inball_h`='{$inball_h}',`inball_c`='{$inball_c}',";
                                $sql = "UPDATE {$table} SET {$upAll} `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum}'";
                                $db_s->execSql($sql);
                            }

                            //上半场
                            if(isset($sc_h1_h) && is_numeric($sc_h1_h)) {
                                $gnum_h1 = "8" . $gnum;
                                $up_h1 = $up . " `inball_h`='{$sc_h1_h}',`inball_c`='{$sc_h1_a}',";
                                $sql = "UPDATE {$table} SET {$up_h1} `inball_more`='{$more}',`status`={$sta_h1} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum_h1}'";
                                $db_s->execSql($sql);
                            }

                            //下半场
                            if(isset($sc_h2_h) && is_numeric($sc_h2_h)) {
                                $gnum_h2 = "9" . $gnum;
                                $up_h2 = $up . " `inball_h`='{$sc_h2_h}',`inball_c`='{$sc_h2_a}',";
                                $sql = "UPDATE {$table} SET {$up_h2} `inball_more{$cs}`='{$more}',`status`={$sta_h2} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum_h2}'";
                                $db_s->execSql($sql);
                            }

                            //第一节
                            if(isset($sc_q1_h) && is_numeric($sc_q1_h)) {
                                $gnum_q1 = "3" . $gnum;
                                $up_q1 = $up . " `inball_h`='{$sc_q1_h}',`inball_c`='{$sc_q1_a}',";
                                $sql = "UPDATE {$table} SET {$up_q1} `inball_more{$cs}`='{$more}',`status`={$sta_q1} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum_q1}'";
                                $db_s->execSql($sql);
                            }

                            //第二节
                            if(isset($sc_q2_h) && is_numeric($sc_q2_h)) {
                                $gnum_q2 = "4" . $gnum;
                                $up_q2 = $up . " `inball_h`='{$sc_q2_h}',`inball_c`='{$sc_q2_a}',";
                                $sql = "UPDATE {$table} SET {$up_q2} `inball_more{$cs}`='{$more}',`status`={$sta_q2} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum_q2}'";
                                $db_s->execSql($sql);
                            }

                            //第三节
                            if(isset($sc_q3_h) && is_numeric($sc_q3_h)) {
                                $gnum_q3 = "5" . $gnum;
                                $up_q3 = $up . " `inball_h`='{$sc_q3_h}',`inball_c`='{$sc_q3_a}',";
                                $sql = "UPDATE {$table} SET {$up_q3} `inball_more{$cs}`='{$more}',`status`={$sta_q3} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum_q3}'";
                                $db_s->execSql($sql);
                            }

                            //第4节
                            if(isset($sc_q4_h) && is_numeric($sc_q4_h)) {
                                $gnum_q4 = "6" . $gnum;
                                $up_q4 = $up . " `inball_h`='{$sc_q4_h}',`inball_c`='{$sc_q4_a}',";
                                $sql = "UPDATE {$table} SET {$up_q4} `inball_more{$cs}`='{$more}',`status`={$sta_q4} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum_q4}'";
                                $db_s->execSql($sql);
                            }

                            /*//加时
                            $gnum_ot = "4".$gnum;
                            $up_ot = $up." `inball_h`='{$sc_ot_h}',`inball_c`='{$sc_ot_c}',";
                            $sql = "UPDATE {$table} SET {$up_ot} `inball_more`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`<'{$gnum_ot}'";
                            $db_s->execSql($sql);*/
                        }
                        $sum++;
                    }
                }
            }

        }
        return $sum;
    }catch (\Exception $e){
        return $e->getMessage();
    }
}


/**
 * 篮球-赛果处理
 * @param $m
 * @param $t
 * @return array
 */
function inball_BK($m,$t,$langx="en-us"){
    global $result_status;
    if(strpos($m,"-")!==false){
        return "no";
    }
    $m = chk_result($m);
    $t = chk_result($t);

    $res = $result_status[$langx];
    if($m<>""){$s=$m;}else{$s=$t;}
    $status = 0;
    $key = array_search($s,$res);
    if($key>0){
        $t1='-1';
        $m1='-1';
        $status=$key;
    }else{
        $t1=$t;
        $m1=$m;
        $status=0;
    }
    return array('mb'=>$m1,'tg'=>$t1,'sta'=>$status);
}

function chk_result($s){
    $s = strtolower(str_replace(' ','',$s));
    //如 球员弃权(17)
    if(!is_numeric($s)){
        preg_match("/\((.*?)\)/is",$s,$rr);
        if(isset($rr[1]) && is_numeric($rr[1])){$s = $rr[1];}
    }
    return $s;
}

/**
 * 棒球结果入库
 * @param $p
 * @param $langx
 * @return int|string
 */
function Result_BS($p,$langx="en-us"){
    global $db_s;
    $table = Constant::S_BS;
    $sum = 0;
    $cs = "";
    switch ($langx){
        case "en-us":
            $cs = "_en";
            break;
        case "zh-tw":
            $cs = "_tw";
            break;

    }
    try{
        foreach ($p as $k => $v){
            foreach ($v as $kk=>$vv){
                $gid = $vv["gid"];
                $more = serialize($vv);
                $mb = $vv["GMH"]["result_h"];
                $tg = $vv["GMH"]["result_c"];
                $mb_hr = $vv["HGMH"]["result_h"];
                $tg_hr = $vv["HGMH"]["result_c"];
                $inballs = inball_FT($mb,$tg,$mb_hr,$tg_hr,$langx);
                if($inballs=="no"){continue;}
                $inball_h = $inballs["mb"];
                $inball_c = $inballs["tg"];
                $inball_h_hr = $inballs["mb_hr"];
                $inball_c_hr = $inballs["tg_hr"];

                //print_r($inballs);
                $rs = $db_s->select("SELECT `gidm` FROM {$table} WHERE `gid`='{$gid}'","Row");
                if($rs){
                    $gidm = $rs["gidm"];
                    $row = $db_s->select("SELECT `gid` FROM {$table} WHERE `gidm`='{$gidm}'");
                    foreach ($row as $k => $n) {
                        $gid = $n["gid"];
                        if (!empty($gid)) {
                            //全场
                            $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}',`inball_h_hr`='{$inball_h_hr}',`inball_c_hr`='{$inball_c_hr}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gid`={$gid} AND `ptype_id`=0";
                            $db_s->execSql($sql);

                            //第一局
                            $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h_hr}',`inball_c`='{$inball_c_hr}',`inball_h_hr`='{$inball_h_hr}',`inball_c_hr`='{$inball_c_hr}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gid`={$gid} AND `ptype_id`=6";
                            $db_s->execSql($sql);
                        }
                        $sum++;
                    }
                }

            }

        }
        return $sum;
    }catch (\Exception $e){
        return $e->getMessage();
    }
}



/**
 * 网球结果入库
 * @param $p
 * @param $langx
 * @return int|string
 */
function Result_TN($p,$langx="en-us"){
    global $db_s;
    $table = Constant::S_TN;
    $sum = 0;
    $cs = "";
    switch ($langx){
        case "en-us":
            $cs = "_en";
            break;
        case "zh-tw":
            $cs = "_tw";
            break;

    }
    try{
        foreach ($p as $k => $v){

            foreach ($v as $kk=>$vv){
                $gid = $vv["gid"];
                $more = serialize($vv);

                //print_r($inballs);
                $rs = $db_s->select("SELECT `gidm` FROM {$table} WHERE `gid`='{$gid}'","Row");
                if($rs) {
                    $gidm = $rs["gidm"];
                    $row = $db_s->select("SELECT `gidm`,`gnum_h` FROM {$table} WHERE `gidm`='{$gidm}' AND LENGTH(`gnum_h`)=6");
                    foreach($row as $k => $n) {
                        $gnum = $n["gnum_h"];
                        if (!empty($gidm)) {

                            if(isset($vv["GMH"])) {//全场
                                $mb = $vv["GMH"]["result_h"];
                                $tg = $vv["GMH"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH1"])) {
                                //第一盘
                                $mb = $vv["GMH1"]["result_h"];
                                $tg = $vv["GMH1"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum1 = "1" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum1}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH2"])) {
                                //第2盘
                                $mb = $vv["GMH2"]["result_h"];
                                $tg = $vv["GMH2"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum2 = "2" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum2}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH3"])) {
                                //第3盘
                                $mb = $vv["GMH3"]["result_h"];
                                $tg = $vv["GMH3"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum3 = "3" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum3}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH6"])) {
                                //球员得分: 大 / 小
                                $mb = $vv["GMH6"]["result_h"];
                                $tg = $vv["GMH6"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum6 = "6" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum6}'";
                                $db_s->execSql($sql);
                            }
                        }
                        $sum++;
                    }
                }
            }

        }
        return $sum;
    }catch (\Exception $e){
        return $e->getMessage();
    }
}

/**
 * 网球-赛果处理
 * @param $m
 * @param $t
 * @return array
 */
function inball_TN($m,$t,$langx="en-us"){
    global $result_status;
    if(strpos($m,"-")!==false){ return "no"; }
    $res = $result_status[$langx];
    $mb = chk_result($m);
    $tg = chk_result($t);
    $status = 0;
    $key = array_search($mb,$res);
    if($key>0){
        $mb='-1';
        $tg='-1';
        $status=$key;
    }else{
        $str = "";
        switch ($langx){
            case "zh-cn":
                $str ="赛事腰斩/球员弃权";
                break;
            case "zh-tw":
                $str ="賽事腰斬/球員棄權";
                break;
            case "en-us":
                $str ="suspended/retirement";
                break;
        }

        if(strpos($str,$mb)!==false){
            $mb='-1';
            $tg='-1';
            $status=5;
        }else{
            if(!is_numeric($mb)){return "no";}
        }
    }

    return array('mb'=>$mb,'tg'=>$tg,'sta'=>$status);
}

/**
 * 排球结果入库
 * @param $p
 * @param $langx
 * @return int|string
 */
function Result_VB($p,$langx="en-us"){
    global $db_s;
    $table = Constant::S_VB;
    $sum = 0;
    $cs = "";
    switch ($langx){
        case "en-us":
            $cs = "_en";
            break;
        case "zh-tw":
            $cs = "_tw";
            break;

    }
    try{
        foreach ($p as $k => $v){

            foreach ($v as $kk=>$vv){
                $gid = $vv["gid"];
                $more = serialize($vv);
                $rs = $db_s->select("SELECT `gidm` FROM {$table} WHERE `gid`='{$gid}'","Row");
                if($rs) {
                    $gidm = $rs["gidm"];
                    $row = $db_s->select("SELECT `gidm`,`gnum_h` FROM {$table} WHERE `gidm`='{$gidm}' AND LENGTH(`gnum_h`)=6");
                    foreach($row as $n) {
                        $gnum = $n["gnum_h"];
                        if (!empty($gidm)) {
                            if(isset($vv["GMH"])) {
                                //全场
                                $mb = $vv["GMH"]["result_h"];
                                $tg = $vv["GMH"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH2"])) {
                                //让分
                                $mb = $vv["GMH2"]["result_h"];
                                $tg = $vv["GMH2"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum1 = "2" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum1}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH3"])) {
                                //第1局
                                $mb = $vv["GMH3"]["result_h"];
                                $tg = $vv["GMH3"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum2 = "3" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum2}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH4"])) {
                                //第2局
                                $mb = $vv["GMH4"]["result_h"];
                                $tg = $vv["GMH4"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum3 = "4" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum3}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH5"])) {
                                //第3局
                                $mb = $vv["GMH5"]["result_h"];
                                $tg = $vv["GMH5"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum5 = "5" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum5}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH6"])) {
                                //第4局
                                $mb = $vv["GMH6"]["result_h"];
                                $tg = $vv["GMH6"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum6 = "6" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum6}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH7"])) {
                                //第5局
                                $mb = $vv["GMH7"]["result_h"];
                                $tg = $vv["GMH7"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum7 = "7" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum7}'";
                                $db_s->execSql($sql);
                            }
                        }
                        $sum++;
                    }
                }
            }

        }
        return $sum;
    }catch (\Exception $e){
        return $e->getMessage();
    }
}


/**
 * 
 */
function Result_BM($p,$langx="en-us"){
    global $db_s;
    $table = Constant::S_BM;
    $sum = 0;
    $cs = "";
    switch ($langx){
        case "en-us":
            $cs = "_en";
            break;
        case "zh-tw":
            $cs = "_tw";
            break;

    }
    try{
        foreach ($p as $k => $v){

            foreach ($v as $kk=>$vv){
                $gid = $vv["gid"];
                $more = serialize($vv);
                //print_r($inballs);
                $rs = $db_s->select("SELECT `gidm` FROM {$table} WHERE `gid`='{$gid}'","Row");
                if($rs) {
                    $gidm = $rs["gidm"];
                    $row = $db_s->select("SELECT `gidm`,`gnum_h` FROM {$table} WHERE `gidm`='{$gidm}' AND LENGTH(`gnum_h`)=6");
                    foreach($row as $n) {
                        $gnum = $n["gnum_h"];
                        if (!empty($gidm)) {
                            if(isset($vv["GMH"])) {
                                //全场
                                $mb = $vv["GMH"]["result_h"];
                                $tg = $vv["GMH"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH1"])) {
                                //分数
                                $mb = $vv["GMH1"]["result_h"];
                                $tg = $vv["GMH1"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum1 = "1" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum1}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH2"])) {
                                //第1局
                                $mb = $vv["GMH2"]["result_h"];
                                $tg = $vv["GMH2"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum2 = "2" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum2}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH3"])) {
                                //第2局
                                $mb = $vv["GMH3"]["result_h"];
                                $tg = $vv["GMH3"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum3 = "3" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum3}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH4"])) {
                                //第3局
                                $mb = $vv["GMH4"]["result_h"];
                                $tg = $vv["GMH4"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum4 = "4" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum4}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH5"])) {
                                //第4局
                                $mb = $vv["GMH5"]["result_h"];
                                $tg = $vv["GMH5"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum5 = "5" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum5}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH6"])) {
                                //第5局
                                $mb = $vv["GMH6"]["result_h"];
                                $tg = $vv["GMH6"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum6 = "6" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum6}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH7"])) {
                                //第6局
                                $mb = $vv["GMH7"]["result_h"];
                                $tg = $vv["GMH7"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum7 = "7" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum7}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH8"])) {
                                //第7局
                                $mb = $vv["GMH8"]["result_h"];
                                $tg = $vv["GMH8"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum8 = "8" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum8}'";
                                $db_s->execSql($sql);
                            }
                        }
                        $sum++;
                    }
                }
            }

        }
        return $sum;
    }catch (\Exception $e){
        return $e->getMessage();
    }
}

function Result_TT($p,$langx="en-us"){
    global $db_s;
    $table = Constant::S_TT;
    $sum = 0;
    $cs = "";
    switch ($langx){
        case "en-us":
            $cs = "_en";
            break;
        case "zh-tw":
            $cs = "_tw";
            break;

    }
    try{
        foreach ($p as $k => $v){

            foreach ($v as $kk=>$vv){
                $gid = $vv["gid"];
                $more = serialize($vv);
                //print_r($inballs);
                $rs = $db_s->select("SELECT `gidm` FROM {$table} WHERE `gid`='{$gid}'","Row");
                if($rs) {
                    $gidm = $rs["gidm"];
                    $row = $db_s->select("SELECT `gidm`,`gnum_h` FROM {$table} WHERE `gidm`='{$gidm}' AND LENGTH(`gnum_h`)=6");
                    foreach($row as $n) {
                        $gnum = $n["gnum_h"];
                        if (!empty($gidm)) {
                            if(isset($vv["GMH"])) {
                                //全场
                                $mb = $vv["GMH"]["result_h"];
                                $tg = $vv["GMH"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH1"])) {
                                //让分
                                $mb = $vv["GMH1"]["result_h"];
                                $tg = $vv["GMH1"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum1 = "1" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum1}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH2"])) {
                                //第1局
                                $mb = $vv["GMH2"]["result_h"];
                                $tg = $vv["GMH2"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum2 = "2" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum2}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH3"])) {
                                //第2局
                                $mb = $vv["GMH3"]["result_h"];
                                $tg = $vv["GMH3"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum3 = "3" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum3}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH4"])) {
                                //第3局
                                $mb = $vv["GMH4"]["result_h"];
                                $tg = $vv["GMH4"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum4 = "4" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum4}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH5"])) {
                                //第4局
                                $mb = $vv["GMH5"]["result_h"];
                                $tg = $vv["GMH5"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum5 = "5" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum5}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH6"])) {
                                //第5局
                                $mb = $vv["GMH6"]["result_h"];
                                $tg = $vv["GMH6"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $gnum6 = "6" . $gnum;
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum6}'";
                                $db_s->execSql($sql);
                            }
                        }
                        $sum++;
                    }
                }
            }

        }
        return $sum;
    }catch (\Exception $e){
        return $e->getMessage();
    }
}

function Result_SK($p,$langx="en-us"){
    global $db_s;
    $table = Constant::S_SK;
    $sum = 0;
    $cs = "";
    switch ($langx){
        case "en-us":
            $cs = "_en";
            break;
        case "zh-tw":
            $cs = "_tw";
            break;

    }
    try{
        foreach ($p as $k => $v){

            foreach ($v as $kk=>$vv){
                $gid = $vv["gid"];
                $more = serialize($vv);
                //print_r($inballs);
                $rs = $db_s->select("SELECT `gidm` FROM {$table} WHERE `gid`='{$gid}'","Row");
                if($rs) {
                    $gidm = $rs["gidm"];
                    $row = $db_s->select("SELECT `gidm`,`gnum_h` FROM {$table} WHERE `gidm`='{$gidm}' AND LENGTH(`gnum_h`)=6");
                    foreach($row as $n) {
                        $gnum = $n["gnum_h"];
                        if (!empty($gidm)) {
                            if(isset($vv["GMH"])) {
                                //全场
                                $mb = $vv["GMH"]["result_h"];
                                $tg = $vv["GMH"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                                $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum}'";
                                $db_s->execSql($sql);
                            }

                            if(isset($vv["GMH1"])) {
                                //1-5局
                                $mb = $vv["GMH1"]["result_h"];
                                $tg = $vv["GMH1"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                            }else{
                                $inball_h = 0;
                                $inball_c = 0;
                            }
                            $gnum1 = "1" . $gnum;
                            $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum1}'";
                            $db_s->execSql($sql);

                            if(isset($vv["GMH2"])) {
                                //6-8局
                                $mb = $vv["GMH2"]["result_h"];
                                $tg = $vv["GMH2"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                            }else{
                                $inball_h = 0;
                                $inball_c = 0;
                            }

                            $gnum2 = "2" . $gnum;
                            $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum2}'";
                            $db_s->execSql($sql);

                            if(isset($vv["GMH3"])) {
                                //10-14局
                                $mb = $vv["GMH3"]["result_h"];
                                $tg = $vv["GMH3"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                            }else{
                                $inball_h = 0;
                                $inball_c = 0;
                            }
                            $gnum3 = "3" . $gnum;
                            $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum3}'";
                            $db_s->execSql($sql);

                            if(isset($vv["GMH4"])) {
                                //15-17局
                                $mb = $vv["GMH4"]["result_h"];
                                $tg = $vv["GMH4"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                            }else{
                                $inball_h = 0;
                                $inball_c = 0;
                            }
                            $gnum4 = "4" . $gnum;
                            $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum4}'";
                            $db_s->execSql($sql);

                            if(isset($vv["GMH5"])) {
                                //19-23局
                                $mb = $vv["GMH5"]["result_h"];
                                $tg = $vv["GMH5"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                            }else{
                                $inball_h = 0;
                                $inball_c = 0;
                            }
                            $gnum5 = "5" . $gnum;
                            $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum5}'";
                            $db_s->execSql($sql);


                            if(isset($vv["GMH6"])) {
                                //24-26局
                                $mb = $vv["GMH6"]["result_h"];
                                $tg = $vv["GMH6"]["result_c"];
                                $inballs = inball_TN($mb, $tg,$langx);
                                if($inballs=="no"){continue;}
                                $inball_h = $inballs["mb"];
                                $inball_c = $inballs["tg"];
                            }else{
                                $inball_h = 0;
                                $inball_c = 0;
                            }
                            $gnum6 = "6" . $gnum;
                            $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`={$gidm} AND `gnum_h`='{$gnum6}'";
                            $db_s->execSql($sql);

                        }
                        $sum++;
                    }
                }
            }

        }
        return $sum;
    }catch (\Exception $e){
        return $e->getMessage();
    }
}


/**
 * 电竞-赛果处理
 * @param $m
 * @param $t
 * @return array
 */
function inball_ES($m,$t,$langx="en-us"){
    global $result_status;
    if(strpos($m,"-")!==false){ return "no"; }
    $res = $result_status[$langx];
    $mb = chk_result($m);
    $tg = chk_result($t);
    $status = 0;
    $key = array_search($mb,$res);
    if($key>0){
        $mb='-1';
        $tg='-1';
        $status=$key;
    }else{
        $str = "";
        switch ($langx){
            case "zh-cn":
                $str ="赛事延赛";
                break;
            case "zh-tw":
                $str ="賽事延賽";
                break;
            case "en-us":
                $str ="Postponed";
                break;
        }

        if(strpos($str,$mb)!==false){
            $mb='-1';
            $tg='-1';
            $status=5;
        }else{
            if(!is_numeric($mb)){return "no";}
        }
    }

    return array('mb'=>$mb,'tg'=>$tg,'sta'=>$status);
}
/** 
 * 电竞 结果入库
 */
function Result_ES($p,$langx="en-us"){
    global $db_s;
    $table = Constant::S_ES;
    $sum = 0;
    $cs = "";
    switch ($langx){
        case "en-us":
            $cs = "_en";
            break;
        case "zh-tw":
            $cs = "_tw";
            break;

    }
    try{
        foreach ($p as $k => $v){
            foreach ($v as $kk=>$vv){ 
                if(isset($vv["num_h"]) && isset($vv["num_c"])) { 
                    $peid = explode("_",$vv["pe_segid"])[0];
                    //全场
                    if(isset($vv["GMH"]) && isset($vv["GMC"])){ 
                        $mb = $vv["GMH"];
                        $tg = $vv["GMC"];
                        // if($vv["num_h"] == '400592'){
                        // print_r("SELECT `datetime`,`team_h`,`team_c`,`gamenum`,`gametype` FROM {$table} WHERE `gnum_h`='{$vv["num_h"]}' AND `gnum_c`='{$vv["num_c"]}' AND `peid`='{$peid}'");
                        // }
                        
                        $rs = $db_s->select("SELECT `datetime`,`team_h`,`team_c`,`gamenum`,`gametype`,`period_id` FROM {$table} WHERE `gnum_h`='{$vv["num_h"]}' AND `gnum_c`='{$vv["num_c"]}' AND `peid`='{$peid}'","Row");
                        if(!empty($rs)){ 
                            $sql = "SELECT * FROM {$table} WHERE `datetime`='{$rs["datetime"]}' AND `team_h`='{$rs["team_h"]}' AND `team_c`='{$rs["team_c"]}' AND `gamenum`={$rs["gamenum"]} AND `gametype`='{$rs["gametype"]}' AND `peid`='{$peid}'";
                            // print_r($sql);exit;
                            // if($peid=='9781837'){ 
                            //     print_r($sql);exit;         
                            // }
                            //持续时间  
                            if(isset($vv["DURATION"])){ 
                                $sj = explode(":",$vv["DURATION"]);
                                if(count($sj)==1){ 
                                    $sj = [$sj,$sj];
                                }
                                $rs1 = $db_s->select($sql." AND `period_id`=2 ","Row");
                                
                                if(!empty($rs1)){ 
                                    // if($peid=='9781837'){ 
                                    //     print_r($sql." AND `period_id`=2 \n");
                                    //     print_r($rs1["gnum_h"],$rs1["gnum_c"]);
                                    //     print_r("111=========================");       
                                    // }
                                    Result_ES_db(intval($sj[0]),intval($sj[1]),$peid,$rs1["gnum_h"],$rs1["gnum_c"],$langx,$vv,$table);
                                } 
                            }
                            if(isset($vv["rs_more"])){ 
                                //pid_3
                                if(isset($vv["rs_more"][0]["pid_3"])){ 
                                    $m0 = $vv["rs_more"][0]["pid_3"];
                                    $rs1 = $db_s->select($sql." AND `period_id`=3 ","Row");
                                    
                                    if(!empty($rs1)){ 
                                        Result_ES_db($m0["GMH"],$m0["GMC"],$peid,$rs1["gnum_h"],$rs1["gnum_c"],$langx,$vv,$table);
                                    }
                                }
                                
                                //pid_4
                                if(isset($vv["rs_more"][1]["pid_4"])){
                                    $m1 = $vv["rs_more"][1]["pid_4"];
                                    $rs1 = $db_s->select($sql." AND `period_id`=4 ","Row");
                                    if(!empty($rs1)){ 
                                        Result_ES_db($m1["GMH"],$m1["GMC"],$peid,$rs1["gnum_h"],$rs1["gnum_c"],$langx,$vv,$table);
                                    }
                                }

                                //pid_5
                                if(isset($vv["rs_more"][2]["pid_5"])){
                                    $m2 = $vv["rs_more"][2]["pid_5"];
                                    $rs1 = $db_s->select($sql." AND `period_id`=5 ","Row");
                                    if(!empty($rs1)){ 
                                        Result_ES_db($m2["GMH"],$m2["GMC"],$peid,$rs1["gnum_h"],$rs1["gnum_c"],$langx,$vv,$table);
                                    }
                                }

                                //pid_6
                                if(isset($vv["rs_more"][3]["pid_6"])){
                                    $m3 = $vv["rs_more"][3]["pid_6"];
                                    // if($vv["num_h"] == '400592'){ 
                                    //     print_r($sql." AND `period_id`=6 ");exit;
                                    // }
                                    
                                    $rs1 = $db_s->select($sql." AND `period_id`=6 ","Row");
                                    if(!empty($rs1)){ 
                                        Result_ES_db($m3["GMH"],$m3["GMC"],$peid,$rs1["gnum_h"],$rs1["gnum_c"],$langx,$vv,$table);
                                    }
                                }
                            }
                        }
                    }else{
                        if(isset($vv["rs_more"][0]["pid_3"]["GMH"])){ 
                            $mb = $vv["rs_more"][0]["pid_3"]["GMH"];
                            $tg = $vv["rs_more"][0]["pid_3"]["GMC"];
                        }
                    }
                    if(isset($mb) && isset($tg)){ 
                        Result_ES_db($mb,$tg,$peid,$vv["num_h"],$vv["num_c"],$langx,$vv,$table);
                    }
                    
                    $sum++;
                }
            }
        }
        return $sum;
    }catch (\Exception $e){
        return $e->getMessage();
    }
}

function Result_ES_db($mb,$tg,$peid,$gnum_h,$gnum_c,$langx,$vv,$table) { 
    global $db_s;
    $cs = "";
    switch ($langx){
        case "en-us":
            $cs = "_en";
            break;
        case "zh-tw":
            $cs = "_tw";
            break;

    }
    $inballs = inball_ES($mb, $tg,$langx);
    if($inballs=="no"){return;}
    $inball_h = $inballs["mb"];
    $inball_c = $inballs["tg"];
    $more = serialize($vv);
    
    //方法一
    // $rs = $db_s->select("SELECT `datetime`,`team_h`,`team_c`,`gamenum`,`gametype`,`period_id` FROM {$table} WHERE `gnum_h`='{$gnum_h}' AND `gnum_c`='{$gnum_c}' AND `peid`='{$peid}'","Row");
    // if(!empty($rs)){
    //     $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gamenum`='{$rs["gamenum"]}' AND `gametype`='{$rs["gametype"]}' AND `period_id`='{$rs["period_id"]}' AND `peid`='{$peid}'";
        
    //     $db_s->execSql($sql);
    // }

    //方法二
    $rs = $db_s->select("SELECT `datetime`,`gidm` FROM {$table} WHERE `gnum_h`='{$gnum_h}' AND `gnum_c`='{$gnum_c}' AND `peid`='{$peid}'","Row");
    if(!empty($rs)){
        $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}', `inball_more{$cs}`='{$more}',`status`={$inballs["sta"]} WHERE `gidm`='{$rs["gidm"]}' AND `peid`='{$peid}'";
        
        $db_s->execSql($sql);
    }
}

/**
 * 其他结果入库
 * @param $p
 * @param $langx
 * @return int|string
 */
function Result_OP($p,$langx="en-us"){
    global $db_s;
    $table = Constant::S_OP;
    $sum = 0;
    try{
        foreach ($p as $k => $v){
            foreach ($v as $kk=>$vv){
                $gid = $vv["gid"];
                //$more = serialize($vv);
                $mb = $vv["GMH"]["result_h"];
                $tg = $vv["GMH"]["result_c"];
                $mb_hr = $vv["HGMH"]["result_h"];
                $tg_hr = $vv["HGMH"]["result_c"];
                $inballs = inball_FT($mb,$tg,$mb_hr,$tg_hr,$langx);
                if($inballs=="no"){continue;}
                $inball_h = $inballs["mb"];
                $inball_c = $inballs["tg"];
                $inball_h_hr = $inballs["mb_hr"];
                $inball_c_hr = $inballs["tg_hr"];

                //print_r($inballs);
                $rs = $db_s->select("SELECT `gidm` FROM {$table} WHERE `gid`='{$gid}'","Row");
                if($rs) {
                    $gidm = $rs["gidm"];
                    $row = $db_s->select("SELECT `gid` FROM {$table} WHERE `gidm`='{$gidm}'");
                    foreach($row as $n) {
                        $gid = $n["gid"];
                        if (!empty($gid)) {
                            //全场
                            $sql = "UPDATE {$table} SET `is_inball`=1,`is_hr_inball`=1,`inball_h`='{$inball_h}',`inball_c`='{$inball_c}',`inball_h_hr`='{$inball_h_hr}',`inball_c_hr`='{$inball_c_hr}', `status`={$inballs["sta"]} WHERE `gid`={$gid} AND `ptype_id`=0";
                            $db_s->execSql($sql);
                        }
                        $sum++;
                    }
                }
            }

        }
        return $sum;
    }catch (\Exception $e){
        return $e->getMessage();
    }
}



function setAcceptData($typeAry=[]){
    $gtype = $typeAry["gtype"];
    $time = $typeAry["time"];
    $tf = new Transform();
    $res = $tf->getUserCurl(2);
    if ($res["code"] == 10000) {
        $xml = $tf->get_result();
        $res = accept_html_array($gtype,$time);
        if(!$res){
            return false;
        }else{
            return "更新完成!";
        }
    }else{ 
        return $res["msg"];
    }
}

/**
 * 采集赛事数据 并转换为数组
 * @param string $gtype 球类
 * @param string $rtype 赛事类型
 * @param string $langx 语言
 * @return array|false
 */
function match_html_array($gtype="FT",$rtype="r",$langx="zh-cn"){
    $tf = new Transform();
    $res = $tf->getUserCurl(2);
    if ($res["code"] == 10000) {
        $ary = [];
        $t_page = 1;
        $curlDB = $tf->web;
        for($pages=0;$pages<$t_page;$pages++){
            $html = curl_body_var_data($curlDB["url"], $curlDB["uid"],$curlDB["mid"], $gtype, $rtype, 3, $langx, $pages);
            preg_match("/t_page=(.*?);/s",$html,$pg);
            preg_match_all("/g\((.*?)\);/is", $html, $matches);
            preg_match_all("/gm\[\'(.*?)'\]=(.*?);/is", $html, $gms);
            if(empty($pg)) {
                $t_page = 1;
            }else{
                $t_page = $pg[1]==0 ? 1 : $pg[1];
            }

            if(!empty($matches)){
                if($pages>0){
                    $ary["data"] = array_merge($ary["data"],$matches[1]);
                    if(!empty($gms[1]) && !empty($gms[2])){
                        $ary["gids"] = array_merge($ary["gids"],$gms[1]);
                        $ary["gmAry"] = array_merge($ary["gmAry"],$gms[2]);
                    }
                }else{
                    $ary["data"] = $matches[1];
                    if(!empty($gms[1]) && !empty($gms[2])){
                        $ary["gids"] = $gms[1];
                        $ary["gmAry"] = $gms[2];
                    }
                }
            }else{
                return false;
            }
        }
        return $ary;
    }else{
        return false;
    }
}

function accept_html_array($gtype="FT",$time=0){
    $tf = new Transform();
    $res = $tf->getUserCurl(2);
    if ($res["code"] == 10000) {
        $curlDB = $tf->web;
        $list_date = date("Y-m-d",time()-$time);
        $html = curl_accept_data($curlDB["url"],$curlDB["uid"],$curlDB["mid"],$gtype,$list_date);
        //var myleg = new Array('','103761_4761825','103761_4761829','103761_4762685','103761_4762687','100275_4750271','109065_4764173','109065_4764177','109065_4764181','109065_4764185','108254_4761781','105670_4753857','109065_4764189','109065_4764193','109065_4764509','104740_4756819','105670_4753861','109065_4764513','108203_4761785','105670_4753865','101353_4756803','107998_4761793','100810_4761797','108784_4756827','108784_4762681','109290_4764215','109290_4764219','101353_4756815','101353_4756811','109191_4761845','100448_4751867','100448_4751875','101862_4756831','101862_4762683','100128_4750119','100448_4751871','100275_4750275','108203_4761801','103373_4761833','100405_4750515','100816_4761841','100128_4750123','100127_4750055','100127_4750059','100127_4750063','100127_4750067','100128_4750127','100128_4750131','100128_4750135','100128_4750139','100128_4750143','100283_4749971','100283_4749979','100283_4749983','100283_4749987','100283_4749991','100283_4761773','108688_4764157','108688_4764159','108688_4764161','108688_4764163','108688_4764165','108688_4764167','108688_4764169','108688_4764171','100448_4751879','102812_4761777','102812_4764213','100047_4752021','100101_4757773','100283_4749995','100283_4749999','101811_4753239','101811_4753243','101811_4753247','101811_4753251','101811_4753255','100802_4756843','100802_4756847','100802_4756851','100802_4756855','100802_4756859','100802_4756863','100802_4756867','100802_4756871','100802_4756879','100101_4757777','100405_4750519','100405_4761837','100802_4764905','100802_4764909','100802_4764911','100802_4764945','100802_4764949','100802_4764951','100802_4764985','100802_4764989','100802_4764991','109207_4764197','106923_4756787','106923_4761839','101362_4752415','103166_4753577','109207_4764201','100397_4764517','107696_4761821','109202_4764205');
        preg_match_all("/var myleg = new Array\((.*?)\);/is", $html, $matches);
        if(!empty($matches[1][0])){
            $ary = json_decode("[".str_replace("'","\"",$matches[1][0])."]",true);
            $gids = [];
            foreach ($ary as $k => $v){
                if(!empty($v)){
                    $gids[] = explode("_",$v)[1];
                }
            }

            if(!empty($gids)){
                switch ($gtype){
                    case "FT":
                        $res =  FT_result_new($curlDB,$gids,$list_date);
                        if(!$res){return false;}
                        break;
                    case "BK":
                        $res =  BK_result_new($curlDB,$gids,$list_date);
                        if(!$res){return false;}
                        break;
                }
            }
            return true;
        }else{
            return false;
        }
    } else {
        return false;
    }
}

/**
 * 接收比分的日期转为区间时间戳
 * @param string $date
 * @return array
 */
function accept_date($date=""){
    if(empty($date)){
        $start = strtotime(date("Y-m-d 00:00:00",strtotime("-1 day")));
        $end = time();//当前时间
    }else{
        $start = strtotime(date("Y-m-d 00:00:00",strtotime($date)+24*60*60));
        if($date == date("Y-m-d")){
            $end = time();//当前时间
        }else{
            $end = strtotime(date("Y-m-d 23:59:59",strtotime($date)));
        }
    }

    return ["start"=>$start,"end"=>$end];
}


/**
 * 足球赛果 - 所有赛果采集并入库
 * @param $curlDB
 * @param array $gids
 * @param string $date
 * @return bool
 */
function FT_result_new($curlDB,$gids = [],$date=""){
    global $db_s;
    $table = Constant::S_FT;
    $gtype = "FT";
    $dates = accept_date($date);

    $rs = $db_s->select("SELECT `gid`,`gidm`,`gnum_h`,`gnum_c` FROM {$table} WHERE `is_inball`=0 AND `datetime` BETWEEN '{$dates["start"]}' AND '{$dates["end"]}'");
    if(!$rs && empty($rs)){//区间内所有赛事都有比分
        return true;
    }
    $n_gids = array_column($rs,"gid");//没比分的gid

    $nows = array_intersect($gids,$n_gids);
    if(empty($nows)){//暂无新赛果
        return true;
    }

    $heads = ['gid','date','time','league','team_h','team_c','num_h','num_c','game_over','is_OT','AGM_h','AGM_c','AGM_result','AGM_type','ARG_result','ARG_type','BGM_h','BGM_c','BGM_result','BGM_type','BH_result','BH_type','BRG_result','BRG_type','CDF_result','CDF_type','CDL_result','CDL_type','CGM_h','CGM_c','CGM_result','CGM_type','CNF_result','CNF_type','CNL_result','CNL_type','CRG_result','CRG_type','DGM_h','DGM_c','DGM_result','DGM_type','DRG_result','DRG_type','EGM_h','EGM_c','EGM_result','EGM_type','ERG_result','ERG_type','F2G_result','F2G_type','F3G_result','F3G_type','FG_result','FG_type','FGM_h','FGM_c','FGM_result','FGM_type','FRG_result','FRG_type','GAF_result','GAF_type','GAL_result','GAL_type','GM_h','GM_c','GM_result','GM_type','GRG_result','GRG_type','HGM_h','HGM_c','HGM_result','HGM_type','HRG_result','HRG_type','IRG_result','IRG_type','JRG_result','JRG_type','MQ_result','MQ_type','MW_result','MW_type','OG_result','OG_type','OSF_result','OSF_type','OSL_result','OSL_type','OT_result','OT_type','PA_result','PA_type','PGF_result','PGF_type','PGL_result','PGL_type','RCD_result','RCD_type','RCF_result','RCF_type','RCL_result','RCL_type','RNBA_result','RNBA_type','RNBB_result','RNBB_type','RNBC_result','RNBC_type','RNBD_result','RNBD_type','RNBE_result','RNBE_type','RNBF_result','RNBF_type','RNBG_result','RNBG_type','RNBH_result','RNBH_type','RNBI_result','RNBI_type','RNBJ_result','RNBJ_type','RNBK_result','RNBK_type','RNBL_result','RNBL_type','RNBM_result','RNBM_type','RNBN_result','RNBN_type','RNBO_result','RNBO_type','RNC1_result','RNC1_type','RNC2_result','RNC2_type','RNC3_result','RNC3_type','RNC4_result','RNC4_type','RNC5_result','RNC5_type','RNC6_result','RNC6_type','RNC7_result','RNC7_type','RNC8_result','RNC8_type','RNC9_result','RNC9_type','RNCA_result','RNCA_type','RNCB_result','RNCB_type','RNCC_result','RNCC_type','RNCD_result','RNCD_type','RNCE_result','RNCE_type','RNCF_result','RNCF_type','RNCG_result','RNCG_type','RNCH_result','RNCH_type','RNCI_result','RNCI_type','RNCJ_result','RNCJ_type','RNCK_result','RNCK_type','RNCL_result','RNCL_type','RNCM_result','RNCM_type','RNCN_result','RNCN_type','RNCO_result','RNCO_type','RNCP_result','RNCP_type','RNCQ_result','RNCQ_type','RNCR_result','RNCR_type','RNCS_result','RNCS_type','RNCT_result','RNCT_type','RNCU_result','RNCU_type','RPF_result','RPF_type','RPS_result','RPS_type','RSCA_result','RSCA_type','RSCB_result','RSCB_type','RSCC_result','RSCC_type','RSCD_result','RSCD_type','RSCE_result','RSCE_type','RSCF_result','RSCF_type','RSCG_result','RSCG_type','RSCH_result','RSCH_type','RSCI_result','RSCI_type','RSCJ_result','RSCJ_type','RSCK_result','RSCK_type','RSCL_result','RSCL_type','RSCM_result','RSCM_type','RSCN_result','RSCN_type','RSCO_result','RSCO_type','RSHA_result','RSHA_type','RSHB_result','RSHB_type','RSHC_result','RSHC_type','RSHD_result','RSHD_type','RSHE_result','RSHE_type','RSHF_result','RSHF_type','RSHG_result','RSHG_type','RSHH_result','RSHH_type','RSHI_result','RSHI_type','RSHJ_result','RSHJ_type','RSHK_result','RSHK_type','RSHL_result','RSHL_type','RSHM_result','RSHM_type','RSHN_result','RSHN_type','RSHO_result','RSHO_type','STF_result','STF_type','STL_result','STL_type','T1G_result','T1G_type','T3G_result','T3G_type','TK_result','TK_type','YCF_result','YCF_type','YCL_result','YCL_type','RESULT_F','RESULT_L','RESULT_A'];
    foreach ($nows as $k => $v){
        $html = curl_result_new($curlDB["pcurl"],$curlDB["uid"],$curlDB["mid"],$gtype,$v);
        preg_match_all("/var gdata = Array\((.*?)\);/is", $html, $matches);
        if(!empty($matches[1][0])){
            $gdata = json_decode("[".str_replace("'","\"",$matches[1][0])."]",true);
            $datas = array_combine($heads,$gdata);
            //全场
            $up = [
                "inball_h"     => $datas["GM_h"],
                "inball_c"     => $datas["GM_c"],
                "is_inball"    => 1,
                "inball_h_hr"  => $datas["HGM_h"],
                "inball_c_hr"  => $datas["HGM_c"],
                "is_hr_inball" => 1,
                "inball_more"  => serialize($gdata)
            ];
            //上半场
            $up1 = [
                "inball_h"     => $datas["HGM_h"],
                "inball_c"     => $datas["HGM_c"],
                "is_inball"    => 1,
                "inball_h_hr"  => $datas["HGM_h"],
                "inball_c_hr"  => $datas["HGM_c"],
                "is_hr_inball" => 1,
                "inball_more"  => serialize($gdata)
            ];
            //下半场
            $up2 = [
                "inball_h"     => $datas["GM_h"] - $datas["HGM_h"],
                "inball_c"     => $datas["GM_c"] - $datas["HGM_c"],
                "is_inball"    => 1,
                "inball_h_hr"  => $datas["GM_h"] - $datas["HGM_h"],
                "inball_c_hr"  => $datas["GM_c"] - $datas["HGM_c"],
                "is_hr_inball" => 1,
                "inball_more"  => serialize($gdata)
            ];

            try{
                $row = $db_s->select("SELECT `gid`,`gidm` FROM {$table} WHERE `gid`={$v} LIMIT 1","Row");
                $db_s->update($table,$up,"`gidm`={$row["gidm"]} AND `isHR`=0");//全场
                $db_s->update($table,$up1,"`gidm`={$row["gidm"]} AND `isHR`=1");//上半场
                $db_s->update($table,$up2,"`gidm`={$row["gidm"]} AND `isHR`=2");//下半场
            }catch (\Exception $e){
                print_r($e->getMessage());
                print_r("\n");
            }
        }

    }

    return true;
}

function deldata()
{
	global $db_c;
	global $db_s;
	$deltime = date("Y-m-d", strtotime('-60 day'));
	$deltime2 = date("Y-m-d", strtotime('-61 day'));
	$logdeltime = strtotime('-15 day'); 
	$logdeltime2 =strtotime('-16 day'); 
	try {
		$sql = "delete from db_client.bets where `m_date`<'$deltime'";
		 $db_c->execSql($sql);
		$sql = "delete from db_sports.foot_match where `m_date`<'$deltime2'";
		$stmt = $db_s->execSql($sql);
		$sql = "delete from db_sports.foot_match_xml where `m_date`<'$deltime2'";
		$stmt = $db_s->execSql($sql);
		$sql = "delete from db_sports.bask_match where `m_date`<'$deltime2'";
		$stmt = $db_s->execSql($sql);
		$sql = "delete from db_sports.bask_match_xml where `m_date`<'$deltime2'";
		$stmt = $db_s->execSql($sql);
		//logs
		$sql = "delete from db_client.ad_login_log where `logintime`<'$logdeltime2'";
		$stmt = $db_c->execSql($sql);
		$sql = "delete from db_client.ag_login_log where `logintime`<'$logdeltime2'";
		$stmt = $db_c->execSql($sql);
		$sql = "delete from db_client.mem_record where `logintime`<'$logdeltime2'";
		$stmt = $db_c->execSql($sql);
		$sql = "delete from db_client.ag_record where `logintime`<'$logdeltime2'";
		$stmt = $db_c->execSql($sql);
		$sql = "delete from db_client.ad_record where `logintime`<'$logdeltime2'";
		$stmt = $db_c->execSql($sql);
		print_r(iconv('UTF-8', 'gbk', date("m-d H:i:s") . " 已清除一个月前的数据\n"));
		// $stmt = $db_client->query($sql);

	} catch (Exception $ex) {
		$msg = 'Fail';
	}



}

/**
 * 篮球赛果 - 所有赛果采集并入库
 * @param $curlDB
 * @param array $gids
 * @param string $date
 * @return bool
 */
function BK_result_new($curlDB,$gids = [],$date=""){
    global $db_s,$isHRAry;
    $table = Constant::S_BK;
    $gtype = "BK";
    $isHR = $isHRAry[$gtype];
    $dates = accept_date($date);
    $rs = $db_s->select("SELECT `gid`,`gidm`,`gnum_h`,`gnum_c` FROM {$table} WHERE `is_inball`=0 AND `datetime` BETWEEN '{$dates["start"]}' AND '{$dates["end"]}'");

    if(!$rs && empty($rs)){//区间内所有赛事都有比分
        return true;
    }

    $n_gids = array_column($rs,"gid");//没比分的gid
    $nows = array_intersect($gids,$n_gids);
    if(empty($nows)){//暂无新赛果
        return true;
    }
    foreach ($nows as $k => $v){
        $html = curl_result_new($curlDB["pcurl"],$curlDB["uid"],$curlDB["mid"],$gtype,$v);
        $html = str_replace("acc_cont_bold","",$html);
        preg_match_all("/\<tr class=\"acc_cont_tr\"(.*?)\<td>(.*?)\<\/td>(.*?)\<td>(.*?)\<\/td>(.*?)\<\/tr>/is", $html, $matches);
        if(!empty($matches[2]) && !empty($matches[4])){
            try{
                $row = $db_s->select("SELECT `gid`,`gidm` FROM {$table} WHERE `gid`={$v} LIMIT 1","Row");
                $gidm = $row["gidm"];
                foreach ($isHR as $k => $v){
                    if($k>0){ //单节 加时
                        $j = $k - 1;
                        if($matches[2][$j] != "-" && $matches[4][$j] != "-"){
                            $up = [
                                "inball_h"     => $matches[2][$j],
                                "inball_c"     => $matches[4][$j],
                                "is_inball"    => 1,
                                "is_hr_inball" => 1
                            ];
                            $db_s->update($table,$up,"`gidm`={$gidm} AND `isHR`={$k}");
                        }
                    }else{//全场
                        preg_match_all("/\<tr class=\"acc_cont_tr\"(.*?)\<td class=\"\">(.*?)\<\/td>(.*?)\<td class=\"\">(.*?)\<\/td>(.*?)\<\/tr>/is", $html, $matcheAll);
                        if(isset($matcheAll[2][0]) && isset($matcheAll[4][0]) && $matcheAll[2][0] != "-" && $matcheAll[4][0] == "-") {
                            $up = [
                                "inball_h"     => $matches[2][0],
                                "inball_c"     => $matches[4][0],
                                "is_inball"    => 1,
                                "is_hr_inball" => 1
                            ];
                            $db_s->update($table,$up,"`gidm`={$gidm} AND `isHR`=0");
                        }
                    }

                }

            }catch (\Exception $e){
                print_r($e->getMessage());
                print_r("\n");
            }
        }

    }

    return true;
}


/**
 * 写入世界杯数据
 * @param string $gtype
 * @param string $langx
 * @param int $code
 * @return string
 */
function setFSMatchDataAll($gtype="FT",$langx="zh-cn",$code){
    global $db_s;
    $table = Constant::S_SP;
    switch ($langx){
        case "zh-tw":
            $league = "league_tw";
            $is_league = "is_league_tw";
            $teamsname = "teamsname_tw";
            $team = "team_tw";
            break;
        case "en-us":
            $league = "league_en";
            $teamsname = "teamsname_en";
            $team = "team_en";
            $is_league = "is_league_en";
            break;
        default:
            $league = "league";
            $teamsname = "teamsname";
            $team = "team";
            $is_league = "is_league";
            break;
    }
    $fiedAry = ["gid","lid","sfs_id","FStype","datetime","sha1","rtype","ioratio",$league,$teamsname,$team,$is_league];
    $tf = new Transform();
    $res = $tf->getUserCurl(2,$code);
    if ($res["code"] != 10000) {
        return $res["msg"];
    }
    $lid = 104036;
    $xml = $tf->get_game_list_FS_all($gtype,$lid,$langx);
    preg_match_all("/\<game id=\"gid(.*?)\">(.*?)\<\/game>/is",$xml,$games);
    $game_ary = $games[2];
    if(count($game_ary)>0){
        $values = "";
        foreach ($game_ary as $v){
            $ary = [
                $tf->getXmlNode($v,"gid"),
                $lid,"FS",
                $tf->getXmlNode($v,"FStype"),
                strtotime($tf->getXmlNode($v,"datetime")),
            ];
            $league_name = $tf->getXmlNode($v,"league");
            $teamsname_name = $tf->getXmlNode($v,"teamsname");

            preg_match_all("/\<rtypes id=\"(.*?)\">(.*?)\<\/rtypes>/is",$v,$rtypes);
            $rtype_ary = $rtypes[2];
            if(count($rtype_ary)>0){
                foreach ($rtype_ary as $vv){
                    $arr = $ary;
                    $sha1 = $tf->getXmlNode($v,"gid")."|".$lid."|FS|".$tf->getXmlNode($v,"FStype")."|".$tf->getXmlNode($vv,"rtype");
                    $sha1 = sha1($sha1);
                    $arr[] = $sha1;
                    $arr[] = $tf->getXmlNode($vv,"rtype");
                    $arr[] = $tf->getXmlNode($vv,"ioratio");
                    $arr[] = $league_name;
                    $arr[] = $teamsname_name;
                    $arr[] = rtrim($tf->getXmlNode($vv,"teams"));
                    $arr[] = 1;
                    $values .= "('".implode("','",$arr)."'),";
                }
            }
        }
        if(!empty($values)){
            $fied = implode("`,`",$fiedAry);
            $values = rtrim($values,",");
            $insert = "INSERT INTO {$table} (`{$fied}`) VALUES {$values} ON DUPLICATE KEY UPDATE `{$league}`=VALUES(`{$league}`),`{$teamsname}`=VALUES(`{$teamsname}`),`{$team}`=VALUES(`{$team}`),`{$is_league}`=VALUES(`{$is_league}`)";
            try{
                $db_s->execSql($insert);
                print_r("[lid:{$lid}]数据更新成功!\n");
            }catch (\Exception $e){
                print_r($insert);exit;
            }
        }
    }
    return "世界杯数据采集完成...";
}

