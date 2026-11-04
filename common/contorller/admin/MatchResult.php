<?php


class MatchResult extends Base
{
    private $matchTables = [];
    public function __construct($_p = [])
    {
        parent::__construct($_p);
        global $sport_tables;
        $this->matchTables = $sport_tables;
    }

    public function get_match_edit_score(){
		
		
		
		
        global $result_status;
        $log = $this->match_log();
        $log.= "->修改比分";
        $this->insertLog($log);
        $_p = $this->param;
        $gtype = strtoupper($_p["gtype"]);
        $gid = $_p["gid"];
        $table = $this->matchTables[$gtype]["table"];
        $jsonAry = [
            "status" => "error",
            "msg" => "修改失败!"
        ];
        $filed = "`inball_more`,`inball_more_tw`,`inball_more_en`";
        $filed.= ",`lid`,`gid`,`gidm`,`datetime`,`gnum_h`,`gnum_c`";
        $filed.= ",`league`,`league_tw`,`league_en`";
        $filed.= ",`team_h`,`team_c`,`ptype`";
        $filed.= ",`team_h_tw`,`team_c_tw`,`ptype_tw`";
        $filed.= ",`team_h_en`,`team_c_en`,`ptype_en`";
        $rs = $this->dbs->select("SELECT {$filed} FROM {$table} WHERE `gid`='{$gid}'","Row");
        if(!$rs){
            $jsonAry["msg"] = "赛事不存在!";
            return $jsonAry;
        }
		
		
		
		//echo '-----'.$gtype.'-----';			TN
		

        switch ($gtype){
            case "FT":
                $ary = ["AGMH", "BGMH", "CGMH", "HGMH", "DGMH", "EGMH", "FGMH", "GMH","AGMC", "BGMC", "CGMC", "HGMC", "DGMC", "EGMC", "FGMC", "GMC"];
                if($_p["status"] == "cancal") {
                    $up = [
                        "inball_h" => "",
                        "inball_c" => "",
                        "inball_h_hr" => "",
                        "inball_c_hr" => "",
                        "is_inball" => 0,
                        "is_hr_inball" => 0
                    ];
                }else{
                    if ($_p["status"] > 0) {
                        $up = [
                            "inball_h" => -1,
                            "inball_c" => -1,
                            "inball_h_hr" => -1,
                            "inball_c_hr" => -1,
                            "is_inball" => 1,
                            "is_hr_inball" => 1
                        ];
                    } else {
                        if (is_numeric($_p["GMH"]) && is_numeric($_p["GMC"]) && is_numeric($_p["HGMH"]) && is_numeric($_p["HGMC"])) {
                            $up = [
                                "inball_h" => $_p["GMH"],
                                "inball_c" => $_p["GMC"],
                                "inball_h_hr" => $_p["HGMH"],
                                "inball_c_hr" => $_p["HGMC"],
                                "is_inball" => 1,
                                "is_hr_inball" => 1
                            ];
                        } else {
                            $jsonAry["msg"] = "请输入上半场/全场比分！";
                            return $jsonAry;
                        }
                    }
                }
                if($_p["status"]=="cancal"){
                    $up["status"] = 0;
                }else{
                    $up["status"] = $_p["status"];
                }

                if(!empty($rs["inball_more"]) || !empty($rs["inball_more_tw"]) || !empty($rs["inball_more_tw"])){
                    $inball_more = [];
                    if(!empty($rs["inball_more"])){
                        $inball_more = unserialize($rs["inball_more"]);
                    }elseif(!empty($rs["inball_more_tw"])){
                        $inball_more = unserialize($rs["inball_more_tw"]);
                    }else{
                        $inball_more = unserialize($rs["inball_more_en"]);
                    }

                    if(empty($rs["inball_more"])){
                        $cn = $inball_more;
                        $cn["league_name"] = $rs["league"];
                        $cn["team_h"] = $rs["team_h"];
                        $cn["team_c"] = $rs["team_c"];
                    }else{
                        $cn = unserialize($rs["inball_more"]);
                    }

                    if(empty($rs["inball_more_tw"])){
                        $tw = $inball_more;
                        $tw["league_name"] = $rs["league_tw"];
                        $tw["team_h"] = $rs["team_h_tw"];
                        $tw["team_c"] = $rs["team_c_tw"];
                    }else{
                        $tw = unserialize($rs["inball_more_tw"]);
                    }

                    if(empty($rs["inball_more_en"])){
                        $en = $inball_more;
                        $en["league_name"] = $rs["league_en"];
                        $en["team_h"] = $rs["team_h_en"];
                        $en["team_c"] = $rs["team_c_en"];
                    }else{
                        $en = unserialize($rs["inball_more_en"]);
                    }



                    foreach ($ary as $h){
                        if($_p["status"] == "cancal") {
                            $cn[$h] = "";
                            $tw[$h] = "";
                            $en[$h] = "";
                        } else if($_p["status"]>0){
                            $cn[$h] = $result_status["zh-cn"][$_p["status"]];
                            $tw[$h] = $result_status["zh-tw"][$_p["status"]];
                            $en[$h] = $result_status["en-us"][$_p["status"]];
                        }else{
                            $cn[$h] = $_p[$h];
                            $tw[$h] = $_p[$h];
                            $en[$h] = $_p[$h];
                        }

                    }

                    $up["inball_more"] = serialize($cn);
                    $up["inball_more_tw"] = serialize($tw);
                    $up["inball_more_en"] = serialize($en);
                }else{
                    $inball_more = [
                        "league_id" => $rs["lid"],
                        "league_name" => $rs["league"],
                        "gid" => $rs["gid"],
                        "datetime" => $rs["datetime"],
                        "time" => date("H:i",$rs["datetime"]),
                        "date" => date("m-d",$rs["datetime"]),
                        "num_h"=> $rs["gnum_h"],
                        "num_c"=> $rs["gnum_c"],
                        "team_h"=>$rs["team_h"],
                        "team_c"=>$rs["team_c"]
                    ];
                    $inball_more_tw = [
                        "league_id" => $rs["lid"],
                        "league_name" => $rs["league_tw"],
                        "gid" => $rs["gid"],
                        "datetime" => $rs["datetime"],
                        "time" => date("H:i",$rs["datetime"]),
                        "date" => date("m-d",$rs["datetime"]),
                        "num_h"=> $rs["gnum_h"],
                        "num_c"=> $rs["gnum_c"],
                        "team_h"=>$rs["team_h_tw"],
                        "team_c"=>$rs["team_c_tw"]
                    ];
                    $inball_more_en = [
                        "league_id" => $rs["lid"],
                        "league_name" => $rs["league_en"],
                        "gid" => $rs["gid"],
                        "datetime" => $rs["datetime"],
                        "time" => date("H:i",$rs["datetime"]),
                        "date" => date("m-d",$rs["datetime"]),
                        "num_h"=> $rs["gnum_h"],
                        "num_c"=> $rs["gnum_c"],
                        "team_h"=>$rs["team_h_en"],
                        "team_c"=>$rs["team_c_en"]
                    ];

                    foreach ($ary as $h){
                        if($_p["status"] == "cancal") {
                            $inball_more[$h] = "";
                            $inball_more_tw[$h] = "";
                            $inball_more_en[$h] = "";
                        }else if($_p["status"]>0){
                            $inball_more[$h] = $result_status["zh-cn"][$_p["status"]];
                            $inball_more_tw[$h] = $result_status["zh-tw"][$_p["status"]];
                            $inball_more_en[$h] = $result_status["en-us"][$_p["status"]];
                        }else{
                            $inball_more[$h] = $_p[$h];
                            $inball_more_tw[$h] = $_p[$h];
                            $inball_more_en[$h] = $_p[$h];
                        }

                    }

                    $up["inball_more"] = serialize($inball_more);
                    $up["inball_more_tw"] = serialize($inball_more_tw);
                    $up["inball_more_en"] = serialize($inball_more_en);
                }
                try{
                    $this->dbs->update($table,$up,"`gidm`='{$rs["gidm"]}'");
                    $jsonAry["status"] = "success";
                    $jsonAry["code"] = 100;
                    $jsonAry["msg"] = "比分修改成功!";
                    return $jsonAry;
                }catch (\Exception $e){
					
				
					
                    $jsonAry["msg"] = $e->getMessage();
                    return $jsonAry;
                }
                break;
            case "BK":
                $len = strlen($rs["gnum_h"]);
                if($len=="6"){
                    $rs = $this->dbs->select("SELECT {$filed} FROM {$table} WHERE `gidm`='{$rs["gidm"]}' AND LENGTH(`gnum_h`)=5","Row");
                }
                $ary = ["GMH3", "GMH4", "GMH5", "GMH6", "GMH1", "GMH2", "HGMH", "GMH"];
                if($_p["status"] == "cancal") {
                    $up_more = ["status" => 0];
                }else{
                    $up_more = ["status" => $_p["status"]];
                }
                if(!empty($rs["inball_more"]) || !empty($rs["inball_more_tw"]) || !empty($rs["inball_more_tw"])){
                    $inball_more = [];
                    if(!empty($rs["inball_more"])){
                        $inball_more = unserialize($rs["inball_more"]);
                    }elseif(!empty($rs["inball_more_tw"])){
                        $inball_more = unserialize($rs["inball_more_tw"]);
                    }else{
                        $inball_more = unserialize($rs["inball_more_en"]);
                    }

                    if(empty($rs["inball_more"])){
                        $cn = $inball_more;
                        $cn["league_name"] = $rs["league"];
                        $cn["team_h"] = $rs["team_h"];
                        $cn["team_c"] = $rs["team_c"];
                    }else{
                        $cn = unserialize($rs["inball_more"]);
                    }

                    if(empty($rs["inball_more_tw"])){
                        $tw = $inball_more;
                        $tw["league_name"] = $rs["league_tw"];
                        $tw["team_h"] = $rs["team_h_tw"];
                        $tw["team_c"] = $rs["team_c_tw"];
                    }else{
                        $tw = unserialize($rs["inball_more_tw"]);
                    }

                    if(empty($rs["inball_more_en"])){
                        $en = $inball_more;
                        $en["league_name"] = $rs["league_en"];
                        $en["team_h"] = $rs["team_h_en"];
                        $en["team_c"] = $rs["team_c_en"];
                    }else{
                        $en = unserialize($rs["inball_more_en"]);
                    }



                    foreach ($ary as $h){
                        if($_p["status"] == "cancal"){
                            $cn[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                            $tw[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                            $en[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                            if($h!="GMH" && $h!="HGMH"){
                                $cn["H".$h] = [
                                    "result_h"=>"",
                                    "result_c"=>""
                                ];
                                $tw["H".$h] = [
                                    "result_h"=>"",
                                    "result_c"=>""
                                ];
                                $en["H".$h] = [
                                    "result_h"=>"",
                                    "result_c"=>""
                                ];
                            }
                        }else if($_p["status"]>0){
                            $cn[$h] = [
                                "result_h"=>$result_status["zh-cn"][$_p["status"]],
                                "result_c"=>$result_status["zh-cn"][$_p["status"]]
                            ];
                            $tw[$h] = [
                                "result_h"=>$result_status["zh-tw"][$_p["status"]],
                                "result_c"=>$result_status["zh-tw"][$_p["status"]]
                            ];
                            $en[$h] = [
                                "result_h"=>$result_status["en-us"][$_p["status"]],
                                "result_c"=>$result_status["en-us"][$_p["status"]]
                            ];
                            if($h!="GMH" && $h!="HGMH"){
                                $cn["H".$h] = [
                                    "result_h"=>$result_status["zh-cn"][$_p["status"]],
                                    "result_c"=>$result_status["zh-cn"][$_p["status"]]
                                ];
                                $tw["H".$h] = [
                                    "result_h"=>$result_status["zh-tw"][$_p["status"]],
                                    "result_c"=>$result_status["zh-tw"][$_p["status"]]
                                ];
                                $en["H".$h] = [
                                    "result_h"=>$result_status["en-us"][$_p["status"]],
                                    "result_c"=>$result_status["en-us"][$_p["status"]]
                                ];
                            }
                        }else{
                            $cn[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];
                            $tw[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];
                            $en[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];

                            if($h!="GMH" && $h!="HGMH"){
                                $cn["H".$h] = [
                                    "result_h"=>$_p[$h."_H"],
                                    "result_c"=>$_p[$h."_C"]
                                ];
                                $tw["H".$h] = [
                                    "result_h"=>$_p[$h."_H"],
                                    "result_c"=>$_p[$h."_C"]
                                ];
                                $en["H".$h] = [
                                    "result_h"=>$_p[$h."_H"],
                                    "result_c"=>$_p[$h."_C"]
                                ];
                            }
                        }

                    }

                    $up_more["inball_more"] = serialize($cn);
                    $up_more["inball_more_tw"] = serialize($tw);
                    $up_more["inball_more_en"] = serialize($en);
                }else{

                    $inball_more = [
                        "league_id" => $rs["lid"],
                        "league_name" => $rs["league"],
                        "gid" => $rs["gid"],
                        "datetime" => $rs["datetime"],
                        "time" => date("H:i",$rs["datetime"]),
                        "date" => date("m-d",$rs["datetime"]),
                        "num_h"=> $rs["gnum_h"],
                        "num_c"=> $rs["gnum_c"],
                        "team_h"=>$rs["team_h"],
                        "team_c"=>$rs["team_c"]
                    ];
                    $inball_more_tw = [
                        "league_id" => $rs["lid"],
                        "league_name" => $rs["league_tw"],
                        "gid" => $rs["gid"],
                        "datetime" => $rs["datetime"],
                        "time" => date("H:i",$rs["datetime"]),
                        "date" => date("m-d",$rs["datetime"]),
                        "num_h"=> $rs["gnum_h"],
                        "num_c"=> $rs["gnum_c"],
                        "team_h"=>$rs["team_h_tw"],
                        "team_c"=>$rs["team_c_tw"]
                    ];
                    $inball_more_en = [
                        "league_id" => $rs["lid"],
                        "league_name" => $rs["league_en"],
                        "gid" => $rs["gid"],
                        "datetime" => $rs["datetime"],
                        "time" => date("H:i",$rs["datetime"]),
                        "date" => date("m-d",$rs["datetime"]),
                        "num_h"=> $rs["gnum_h"],
                        "num_c"=> $rs["gnum_c"],
                        "team_h"=>$rs["team_h_en"],
                        "team_c"=>$rs["team_c_en"]
                    ];

                    foreach ($ary as $h){
                        if($_p["status"] == "cancal"){
                            $inball_more[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                            $inball_more_tw[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                            $inball_more_en[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];

                            if($h!="GMH" && $h!="HGMH"){
                                $inball_more["H".$h] = [
                                    "result_h"=>"",
                                    "result_c"=>""
                                ];
                                $inball_more_tw["H".$h] = [
                                    "result_h"=>"",
                                    "result_c"=>""
                                ];
                                $inball_more_en["H".$h] = [
                                    "result_h"=>"",
                                    "result_c"=>""
                                ];
                            }
                        }else if($_p["status"]>0){
                            $inball_more[$h] = [
                                "result_h"=>$result_status["zh-cn"][$_p["status"]],
                                "result_c"=>$result_status["zh-cn"][$_p["status"]]
                            ];
                            $inball_more_tw[$h] = [
                                "result_h"=>$result_status["zh-tw"][$_p["status"]],
                                "result_c"=>$result_status["zh-tw"][$_p["status"]]
                            ];
                            $inball_more_en[$h] = [
                                "result_h"=>$result_status["en-us"][$_p["status"]],
                                "result_c"=>$result_status["en-us"][$_p["status"]]
                            ];

                            if($h!="GMH" && $h!="HGMH"){
                                $inball_more["H".$h] = [
                                    "result_h"=>$result_status["zh-cn"][$_p["status"]],
                                    "result_c"=>$result_status["zh-cn"][$_p["status"]]
                                ];
                                $inball_more_tw["H".$h] = [
                                    "result_h"=>$result_status["zh-tw"][$_p["status"]],
                                    "result_c"=>$result_status["zh-tw"][$_p["status"]]
                                ];
                                $inball_more_en["H".$h] = [
                                    "result_h"=>$result_status["en-us"][$_p["status"]],
                                    "result_c"=>$result_status["en-us"][$_p["status"]]
                                ];
                            }
                        }else{
                            $inball_more[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];
                            $inball_more_tw[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];
                            $inball_more_en[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];

                            if($h!="GMH" && $h!="HGMH"){
                                $inball_more["H".$h] = [
                                    "result_h"=>$_p[$h."_H"],
                                    "result_c"=>$_p[$h."_C"]
                                ];
                                $inball_more_tw["H".$h] = [
                                    "result_h"=>$_p[$h."_H"],
                                    "result_c"=>$_p[$h."_C"]
                                ];
                                $inball_more_en["H".$h] = [
                                    "result_h"=>$_p[$h."_H"],
                                    "result_c"=>$_p[$h."_C"]
                                ];
                            }
                        }

                    }

                    $up_more["inball_more"] = serialize($inball_more);
                    $up_more["inball_more_tw"] = serialize($inball_more_tw);
                    $up_more["inball_more_en"] = serialize($inball_more_en);
                }

                $this->dbs->beginTransaction();
                try{
                    $this->dbs->update($table,$up_more,"`gidm`='{$rs["gidm"]}'");
                    //"GMH3", "GMH4", "GMH5", "GMH6", "GMH1", "GMH2", "HGMH", "GMH"

                    $nums = [
                        "GMH"=>"",
                        "GMH1"=>8,//上半场
                        "GMH2"=>9,//下半场
                        "GMH3"=>3,//第一节
                        "GMH4"=>4,//第二节
                        "GMH5"=>5,//第三节
                        "GMH6"=>6,//第四节
                        "HGMH"=>7//加时
                    ];
                    foreach ($nums as $k => $num){
                        if($k==0){$k="";}
                        if($_p["status"] == "cancal"){
                            $up = [
                                "inball_h" => "",
                                "inball_c" => "",
                                "is_inball"=>0,
                                "is_hr_inball"=>0
                            ];
                        }else if($_p["status"]>0){
                            $up = [
                                "inball_h" => -1,
                                "inball_c" => -1,
                                "is_inball"=>1,
                                "is_hr_inball"=>1
                            ];
                        }else{
                            $up = [
                                "inball_h" => $_p["{$k}_H"],
                                "inball_c" => $_p["{$k}_C"],
                                "is_inball"=>1,
                                "is_hr_inball"=>1
                            ];
                        }

                        $gnum_h = $num.$rs["gnum_h"];
                        $gnum_c = $num.$rs["gnum_c"];
                        $where = "`gnum_h`={$gnum_h} AND `gnum_c`={$gnum_c} AND `gidm`={$rs["gidm"]}";

                        $this->dbs->update($table,$up,$where);
                    }

                    $jsonAry["status"] = "success";
                    $jsonAry["code"] = 100;
                    $jsonAry["msg"] = "比分修改成功!";
                    $this->dbs->commit();
                    return $jsonAry;
                }catch (\Exception $e){
					
					
					echo 'hhhhhhhhhhhhhhhhhhhhh';
					
                    $this->dbs->rollback();
                    $jsonAry["msg"] = $e->getMessage();
                    return $jsonAry;
                }
                break;
            case "TN":
            case "VB":
            case "BM":
            case "TT":
            case "BS":
            case "SK":
                $len = strlen($rs["gnum_h"]);
                if($len=="6"){
                    $rs = $this->dbs->select("SELECT {$filed} FROM {$table} WHERE `gidm`='{$rs["gidm"]}' AND LENGTH(`gnum_h`)=5","Row");
                }
                switch ($gtype){
                    case "TN":
                        $ary = ["GMH1", "GMH2", "GMH3", "GMH4", "GMH5", "GMH6", "GMH"];
                        $nums = [
                            "GMH1"=>1,//第一盘
                            "GMH2"=>2,//第二盘
                            "GMH3"=>3,//第三盘
                            "GMH4"=>4,//第四盘
                            "GMH5"=>5,//第五盘
                            "GMH6"=>6,//让局
                            "GMH"=>"",//让盘
                        ];
                        break;
                    case "VB":
                        $ary = ["GMH3", "GMH4", "GMH5", "GMH6", "GMH7", "GMH8", "GMH9", "GMH2", "GMH"];
                        $nums = [

                            "GMH3"=>3,//第一局
                            "GMH4"=>4,//第二局
                            "GMH5"=>5,//第三局
                            "GMH6"=>6,//第四局
                            "GMH7"=>7,//第五局
                            "GMH8"=>8,//第六局
                            "GMH9"=>9,//第七局
                            "GMH2"=>2,//让分
                            "GMH"=>"",//完赛
                        ];
                        break;
                    case "BM":
                    case "TT":
                        $ary = ["GMH2", "GMH3", "GMH4", "GMH5", "GMH6", "GMH7", "GMH8", "GMH1", "GMH"];
                        $nums = [
                            "GMH2"=>2,//第一局
                            "GMH3"=>3,//第二局
                            "GMH4"=>4,//第三局
                            "GMH5"=>5,//第四局
                            "GMH6"=>6,//第五局
                            "GMH7"=>7,//第六局
                            "GMH8"=>8,//第七局
                            "GMH1"=>1,//让分
                            "GMH"=>"",//完赛
                        ];
                        break;
                    case "BS":
                        $ary = ["HGMH", "GMH"];
                        $nums = ["HGMH"=>"", "GMH"=>""];
                        break;
                    case "SK":
                        $ary = ["GMH1", "GMH2", "GMH3", "GMH4", "GMH5", "GMH6", "GMH"];
                        $nums = [
                            "GMH1"=>1,//第1-5局
                            "GMH2"=>2,//第6-8局
                            "GMH3"=>3,//第10-14局
                            "GMH4"=>4,//第15-17局
                            "GMH5"=>5,//第19-23局
                            "GMH6"=>6,//第24-26局
                            "GMH"=>"",//完赛
                        ];
                        break;
                }

                if($_p["status"] == "cancal") {
                    $up_more = ["status" => 0];
                }else{
                    $up_more = ["status" => $_p["status"]];
                }
                if(!empty($rs["inball_more"]) || !empty($rs["inball_more_tw"]) || !empty($rs["inball_more_tw"])){
                    $inball_more = [];
                    if(!empty($rs["inball_more"])){
                        $inball_more = unserialize($rs["inball_more"]);
                    }elseif(!empty($rs["inball_more_tw"])){
                        $inball_more = unserialize($rs["inball_more_tw"]);
                    }else{
                        $inball_more = unserialize($rs["inball_more_en"]);
                    }

                    if(empty($rs["inball_more"])){
                        $cn = $inball_more;
                        $cn["league_name"] = $rs["league"];
                        $cn["team_h"] = $rs["team_h"];
                        $cn["team_c"] = $rs["team_c"];
                    }else{
                        $cn = unserialize($rs["inball_more"]);
                    }

                    if(empty($rs["inball_more_tw"])){
                        $tw = $inball_more;
                        $tw["league_name"] = $rs["league_tw"];
                        $tw["team_h"] = $rs["team_h_tw"];
                        $tw["team_c"] = $rs["team_c_tw"];
                    }else{
                        $tw = unserialize($rs["inball_more_tw"]);
                    }

                    if(empty($rs["inball_more_en"])){
                        $en = $inball_more;
                        $en["league_name"] = $rs["league_en"];
                        $en["team_h"] = $rs["team_h_en"];
                        $en["team_c"] = $rs["team_c_en"];
                    }else{
                        $en = unserialize($rs["inball_more_en"]);
                    }



                    foreach ($ary as $h){
                        if($_p["status"] == "cancal"){
                            $cn[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                            $tw[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                            $en[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                        }else if($_p["status"]>0){
                            $cn[$h] = [
                                "result_h"=>$result_status["zh-cn"][$_p["status"]],
                                "result_c"=>$result_status["zh-cn"][$_p["status"]]
                            ];
                            $tw[$h] = [
                                "result_h"=>$result_status["zh-tw"][$_p["status"]],
                                "result_c"=>$result_status["zh-tw"][$_p["status"]]
                            ];
                            $en[$h] = [
                                "result_h"=>$result_status["en-us"][$_p["status"]],
                                "result_c"=>$result_status["en-us"][$_p["status"]]
                            ];

                        }else{
                            $cn[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];
                            $tw[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];
                            $en[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];
                        }

                    }

                    $up_more["inball_more"] = serialize($cn);
                    $up_more["inball_more_tw"] = serialize($tw);
                    $up_more["inball_more_en"] = serialize($en);
                }else{

                    $inball_more = [
                        "league_id" => $rs["lid"],
                        "league_name" => $rs["league"],
                        "gid" => $rs["gid"],
                        "datetime" => $rs["datetime"],
                        "time" => date("H:i",$rs["datetime"]),
                        "date" => date("m-d",$rs["datetime"]),
                        "num_h"=> $rs["gnum_h"],
                        "num_c"=> $rs["gnum_c"],
                        "team_h"=>$rs["team_h"],
                        "team_c"=>$rs["team_c"]
                    ];
                    $inball_more_tw = [
                        "league_id" => $rs["lid"],
                        "league_name" => $rs["league_tw"],
                        "gid" => $rs["gid"],
                        "datetime" => $rs["datetime"],
                        "time" => date("H:i",$rs["datetime"]),
                        "date" => date("m-d",$rs["datetime"]),
                        "num_h"=> $rs["gnum_h"],
                        "num_c"=> $rs["gnum_c"],
                        "team_h"=>$rs["team_h_tw"],
                        "team_c"=>$rs["team_c_tw"]
                    ];
                    $inball_more_en = [
                        "league_id" => $rs["lid"],
                        "league_name" => $rs["league_en"],
                        "gid" => $rs["gid"],
                        "datetime" => $rs["datetime"],
                        "time" => date("H:i",$rs["datetime"]),
                        "date" => date("m-d",$rs["datetime"]),
                        "num_h"=> $rs["gnum_h"],
                        "num_c"=> $rs["gnum_c"],
                        "team_h"=>$rs["team_h_en"],
                        "team_c"=>$rs["team_c_en"]
                    ];

                    foreach ($ary as $h){
                        if($_p["status"] == "cancal"){
                            $inball_more[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                            $inball_more_tw[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                            $inball_more_en[$h] = [
                                "result_h"=>"",
                                "result_c"=>""
                            ];
                        }else if($_p["status"]>0){
                            $inball_more[$h] = [
                                "result_h"=>$result_status["zh-cn"][$_p["status"]],
                                "result_c"=>$result_status["zh-cn"][$_p["status"]]
                            ];
                            $inball_more_tw[$h] = [
                                "result_h"=>$result_status["zh-tw"][$_p["status"]],
                                "result_c"=>$result_status["zh-tw"][$_p["status"]]
                            ];
                            $inball_more_en[$h] = [
                                "result_h"=>$result_status["en-us"][$_p["status"]],
                                "result_c"=>$result_status["en-us"][$_p["status"]]
                            ];

                        }else{
                            $inball_more[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];
                            $inball_more_tw[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];
                            $inball_more_en[$h] = [
                                "result_h"=>$_p[$h."_H"],
                                "result_c"=>$_p[$h."_C"]
                            ];

                        }

                    }

                    $up_more["inball_more"] = serialize($inball_more);
                    $up_more["inball_more_tw"] = serialize($inball_more_tw);
                    $up_more["inball_more_en"] = serialize($inball_more_en);
                }

                $this->dbs->beginTransaction();
                try{
					
					
						
					
                    $this->dbs->update($table,$up_more,"`gidm`='{$rs["gidm"]}'");

                    if($gtype == "BS"){
						
						
						
                        if($_p["status"] == "cancal") {
                            $up = [
                                "inball_h" => "",
                                "inball_c" => "",
                                "inball_h_hr" => "",
                                "inball_c_hr" => "",
                                "is_inball"=>0,
                                "is_hr_inball"=>0
                            ];
                        }else if($_p["status"]>0){
                            $up = [
                                "inball_h" => -1,
                                "inball_c" => -1,
                                "inball_h_hr" => -1,
                                "inball_c_hr" => -1,
                                "is_inball"=>1,
                                "is_hr_inball"=>1
                            ];
                        }else{
                            $up = [
                                "inball_h" => $_p["GMH_H"],
                                "inball_c" => $_p["GMH_C"],
                                "inball_h_hr" => $_p["HGMH_H"],
                                "inball_c_hr" => $_p["HGMH_C"],
                                "is_inball"=>1,
                                "is_hr_inball"=>1
                            ];
                        }
                        $where = "`gidm`={$rs["gidm"]}";

                        $this->dbs->update($table,$up,$where);
                    }else{
						
						//print_r($nums);
					
						
                        foreach ($nums as $k => $num){
                            if($k==0){$k="";}
                            if($_p["status"] == "cancal") {
                                $up = [
                                    "inball_h" => "",
                                    "inball_c" => "",
                                    "is_inball"=>0,
                                    "is_hr_inball"=>0
                                ];
                            }else if($_p["status"]>0){
                                $up = [
                                    "inball_h" => -1,
                                    "inball_c" => -1,
                                    "is_inball"=>1,
                                    "is_hr_inball"=>1
                                ];
                            }else{
                                $up = [
                                    "inball_h" => $_p["{$k}_H"],
                                    "inball_c" => $_p["{$k}_C"],
                                    "is_inball"=>1,
                                    "is_hr_inball"=>1
                                ];
                            }
							
							
							

                            $gnum_h = $num.$rs["gnum_h"];
                            $gnum_c = $num.$rs["gnum_c"];
							
							
							//echo $gnum_h.'---';
							//echo $gnum_c.'----';
							//echo $rs["gidm"].'----';
							
                            //$where = "`gnum_h`={$gnum_h} AND `gnum_c`={$gnum_c} AND `gidm`={$rs["gidm"]}";
							
							//$where = "`gnum_h`=1 AND `gnum_c`=1 AND `gidm`=1";
							
							$where = "`gid`={$gid}";
							
							//$where = " gid = 1919872";


							//echo $table.'<br>';
							//print_r( $up)   ;
							//echo '<br>';
							//echo $where.'<br>';



                            $this->dbs->update($table,$up,$where);
							
							echo '999999999999999999999';
							
							
                        }
                    }


                    $jsonAry["status"] = "success";
                    $jsonAry["code"] = 100;
                    $jsonAry["msg"] = "比分修改成功!";
                    $this->dbs->commit();
                    return $jsonAry;
                }catch (\Exception $e){
					
					echo 'hhhhhhhhhhhhhhhhhhhhh2';
					
                    $this->dbs->rollback();
                    $jsonAry["msg"] = $e->getMessage();
                    return $jsonAry;
                }
                break;
            case "OP":

                if($_p["status"] == "cancal") {
                    $up = [
                        "inball_h" => "",
                        "inball_c" => "",
                        "inball_h_hr" => "",
                        "inball_c_hr" => "",
                        "is_inball"=>0,
                        "is_hr_inball"=>0
                    ];
                }else if($_p["status"]>0){
                    $up = [
                        "inball_h" => -1,
                        "inball_c" => -1,
                        "inball_h_hr" => -1,
                        "inball_c_hr" => -1,
                        "is_inball"=>1,
                        "is_hr_inball"=>1
                    ];
                }else{
                    $up = [
                        "inball_h" => $_p["GMH_H"],
                        "inball_c" => $_p["GMH_C"],
                        "inball_h_hr" => $_p["HGMH_H"],
                        "inball_c_hr" => $_p["HGMH_C"],
                        "is_inball"=>1,
                        "is_hr_inball"=>1
                    ];
                }

                $where = "`gidm`={$rs["gidm"]}";
                try{
                    $this->dbs->update($table,$up,$where);
                    $jsonAry["status"] = "success";
                    $jsonAry["code"] = 100;
                    $jsonAry["msg"] = "比分修改成功!";
                    return $jsonAry;
                }catch (\Exception $e){
					
					
					
                    $this->dbs->rollback();
                    $jsonAry["msg"] = $e->getMessage();
                    return $jsonAry;
                }

                break;
        }




    }

    /**
     * 赛果日期
     * @return array
     */
    public function get_result_date(){
        $ary = [
            "today" => date("Y-m-d"),
            "dateValue" => [],
            "dateList" => []
        ];

        $ws = ["日","一","二","三","四","五","六"];
        if($this->langx=="en-us"){
            $ws = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
        }
        $m = ["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"];
        $dateValue = [];
        $dateList  = [];
        for($i=1;$i<=6;$i++){
            $strtime = strtotime("-{$i} day");
            $w = date("w",$strtime);
            $dateValue[] = date("Y-m-d-w",$strtime);
            if($this->langx=="en-us"){
                $mk = intval(date("m",$strtime))-1;
                $d = date("d",$strtime);
                $dateList[] = $ws[$w]." ".$d." ".$m[$mk];
            }else{
                $dateList[] = date("m月 d日(".$ws[$w].")",$strtime);
            }

        }
        $ary["dateValue"] = $dateValue;
        $ary["dateList"] = $dateList;
        return $ary;
    }

    public function get_bet_filter_data(){
        $ary = [
            "normal"=>[],
            "popular" => [],
            "dates" => []
        ];
        $css = "";
        switch ($this->langx){
            case "zh-tw":
                $css = "_tw";
                break;
            case "en-us":
                $css = "_en";
                break;
        }
        $_p = $this->param;

        $totalBets = strtolower($_p["totalBets"]);
        $gtype = strtoupper($_p["gtype"]);
        $date = isset($_p["date"]) ? strtoupper($_p["date"]) : "ALL";
        $isinball = !isset($_p["inball"]) || $_p["inball"]=="N" ? 0 : 1;

        $where = "`is_inball`={$isinball}";
        if($date != "ALL") {
            $m_date = $date;
            switch ($date) {
                case "TODAY":
                    $m_date = date("Y-m-d");
                    break;
            }
            $where.= " AND `m_date`='{$m_date}'";
        }

        if($totalBets == "outright_ft_league"){//冠军未做
            return $ary;
        }else{
            $table = $this->matchTables[$gtype]["table"];
            $rs = $this->dbs->select("SELECT `lid` AS `id`,`league{$css}` AS `username`,'' AS `alias` FROM {$table} WHERE {$where} GROUP BY `lid` ORDER BY `datetime` ASC");
            if(!$rs){return $ary;}
            $ary["normal"] = $rs;
            return $ary;
        }
    }


    /**
     * 联盟读取
     * @return array[]
     */
    public function get_match_filter_data(){
        $ary = [
            "normal"=>[],
            "popular" => []
        ];
        $css = "";
        switch ($this->langx){
            case "zh-tw":
                $css = "_tw";
                break;
            case "en-us":
                $css = "_en";
                break;
        }
        $_p = $this->param;

        $totalBets = strtolower($_p["totalBets"]);
        $gtype = strtoupper($_p["gtype"]);
        $date = strtoupper($_p["date"]);
        $isinball = !isset($_p["inball"]) || $_p["inball"]=="N" ? 0 : 1;

        $m_date = $date;
        switch ($date){
            case "TODAY":
                $m_date = date("Y-m-d");
                break;
        }
        $where = "`m_date`='{$m_date}' AND `is_inball`={$isinball}";
        if($totalBets == "outright_ft_league"){//冠军未做
            return $ary;
        }else{
            $table = $this->matchTables[$gtype]["table"];
            $rs = $this->dbs->select("SELECT `lid` AS `id`,`league{$css}` AS `username`,'' AS `alias` FROM {$table} WHERE {$where} GROUP BY `lid` ORDER BY `datetime` ASC");
            if(!$rs){return $ary;}
            $ary["normal"] = $rs;
            return $ary;
        }
    }

    public function get_match_FS(){
        $this->insertLog($this->match_log()."冠军");
        return ["league"=>[]];
    }

    /**
     * 获取赛程
     * @return array
     */
    public function get_match(){
        global $sport_tables;
        $time = time();
        $css = "";
        switch ($this->langx){
            case "zh-tw":
                $css = "_tw";
                break;
            case "en-us":
                $css = "_en";
                break;
        }
        $_p = $this->param;
        $this->insertLog($this->match_log());
        $league_id = strtolower($_p["league_id"]);
        $gtype = strtoupper($_p["gtype"]);
        $date = strtoupper($_p["date"]);
        $bet = isset($_p["bet"]) ? strtoupper($_p["bet"]) : "ALL";
        $score = isset($_p["score"]) ? strtoupper($_p["score"]) : "ALL";

        $m_date = $date;
        switch ($date){
            case "TODAY":
                $m_date = date("Y-m-d");
                break;
        }

        $ary = [
            "date"=>$m_date,
            "qtime" => 0,
            "results_data" => []
        ];

        $where = "`m_date`='{$m_date}'";
        if($league_id!="all"){
            $lea = explode(",",$league_id);
            if(count($lea)==1){
                $where.= " AND `lid`={$league_id}";
            }else{
                $where.= " AND `lid` IN ({$league_id})";
            }
        }
        $b_gid_ary = [];
        if($bet != "ALL"){ //查询注单
            $betTable = Constant::T_BET;
            $betTable3= Constant::T_BET_P3;
            $b = $this->dbc->select("SELECT `gid` FROM {$betTable} WHERE {$where}  AND `nid` LIKE '{$this->sup["nid"]}%' GROUP BY `gid`");

            if(!$b){$bGid = [];}else{
                $bGid = array_column($b,"gid");
            }

            $b3= $this->dbc->select("SELECT `gid` FROM {$betTable3} WHERE {$where}  AND `nid` LIKE '{$this->sup["nid"]}%' GROUP BY `gid`");
            if(!$b3){$bGid3=[];}else{
                $bGid3 = array_column($b3,"gid");
            }

            $b_gid_ary = array_merge(array_unique(array_merge($bGid,$bGid3)),[]);
        }

        switch ($score){
            case "Y":
                $where.=" AND `is_inball`=1";
                break;
            case "N":
                $where.=" AND `is_inball`=0";
                break;
        }
        $table = $sport_tables[$gtype]["table"];
        $filed = "`lid`,`datetime`,`gnum_h`,`gnum_c`,`ptype`,`inball_more{$css}` AS `inball_more`,`gid`,`gidm`";
        $filed.= ",`league{$css}` AS `league`";
        $filed.= ",`team_h{$css}` AS `team_h`";
        $filed.= ",`team_c{$css}` AS `team_c`";
        if($gtype=="OP"){
            $filed.= ",`inball_h`,`inball_c`,`inball_h_hr`,`inball_c_hr`";
        }

        $rs = $this->dbs->select("SELECT {$filed} FROM {$table} WHERE {$where} ORDER BY `datetime` ASC");
        if(!$rs){return $ary;}
        $results_data = [];
        foreach ($rs as $kk => $v){
            if($bet=="ALL" || ($bet=="Y" && in_array($v["gid"],$b_gid_ary)) || ($bet=="N" && !in_array($v["gid"],$b_gid_ary))) {
                $key = $v["lid"] . "_" . $v["datetime"];
                if (!isset($results_data[$key])) {
                    $results_data[$key] = [
                        "league_id" => $v["lid"],
                        "league_name" => $v["league"],
                        "gid" => []
                    ];
                }
                $gid = [];
                if (empty($v["inball_more"])) {
                    $gid = [
                        "league_id" => $v["lid"],
                        "league_name" => $v["league"],
                        "gid" => $v["gid"],
                        "gidm" => $v["gidm"],
                        "datetime" => date("m-d H:i", $v["datetime"]),
                        "date" => date("m-d", $v["datetime"]),
                        "time" => date("H:i", $v["datetime"]),
                        "num_h" => $v["gnum_h"],
                        "num_c" => $v["gnum_c"],
                        "team_h" => $v["team_h"],
                        "team_c" => $v["team_c"],
                        "ptype" => $v["ptype"]
                    ];
                    if($gtype == "OP"){
                        $gid["GMH"] = [
                            "result_h" => $v["inball_h"],
                            "result_c" => $v["inball_c"]
                        ];

                        $gid["HGMH"] = [
                            "result_h" => $v["inball_h_hr"],
                            "result_c" => $v["inball_c_hr"]
                        ];
                    }
                } else {
                    $gid = unserialize($v["inball_more"]);
                    $gid["league_name"] = $v["league"];
                    $gid["gid"] = $v["gid"];
                    $gid["gidm"] = $v["gidm"];
                    $gid["datetime"] = date("m-d H:i", $v["datetime"]);
                    $gid["date"] = date("m-d", $v["datetime"]);
                    $gid["time"] = date("H:i", $v["datetime"]);
                    $gid["team_h"] = $v["team_h"];
                    $gid["team_c"] = $v["team_c"];
                }
                $results_data[$key]["gid"][] = $gid;
            }
        }
        $ary["results_data"] = array_values($results_data);
        $qtime = time()-$time;
        $ary["qtime"] = $qtime;
        return $ary;

    }

    public function match_log(){
        global $sport_tables;
        $gtype = strtoupper($this->param["gtype"]);
        $log = "操盘->赛程[{$sport_tables[$gtype]["name"]}]";
        return $log;
    }
}