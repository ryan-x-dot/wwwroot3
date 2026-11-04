<?php


class Report extends Base
{
    private $betTable = "";
    private $betTable_p3 = "";
    private $adTable = "";
    private $rankTable = "";
    private $memTable = "";
    public function __construct($_p = [])
    {
        parent::__construct($_p);
        $this->betTable = Constant::T_BET;
        $this->betTable_p3 = Constant::T_BET_P3;
        $this->adTable = Constant::T_ADMIN;
        $this->rankTable = Constant::T_RANK;
        $this->memTable  = Constant::T_MEMBER;
    }

    public function get_upper_structure(){
        $now_layer = $this->param["now_layer"];
        $now_id = $this->param["now_id"];
        $accTable = Constant::T_RANK;
        switch ($now_layer){
            case Constant::AD:
                $accTable = Constant::T_ADMIN;
                break;
            case Constant::MEM:
                $accTable = Constant::T_MEMBER;
                break;
        }
        $field = "`nid`,`id`,`name`";
        $acc = $this->dbc->select("SELECT {$field} FROM {$accTable} WHERE `id`={$now_id} AND `nid` LIKE '{$this->sup["nid"]}%'","Row");

        $data = [];
        switch ($this->login_layer){
            case Constant::ADS:
            case Constant::AD:
                if($now_layer == Constant::AD){
                    $d = "adid";
                    $du = "ad_user";
                }else{
                    $nid = sup_nid(Constant::AD,$acc["nid"]);
                    $table = Constant::T_ADMIN;
                    $ad = $this->dbc->select("SELECT {$field} FROM {$table} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                    $data["ad"] = [
                        "accountid" => "ad",
                        "id" => $ad["id"],
                        "layer" => Constant::AD,
                        "report_path" => "adid={$ad["id"]}&ad_user={$ad["name"]}",
                        "username" => $ad["name"]
                    ];

                    switch ($now_layer){
                        case Constant::D0:
                            $d = "did";
                            $du = "d0_user";
                            break;
                        case Constant::CO:
                            $d = "cid";
                            $du = "co_user";

                            $c = Constant::D0;
                            $nid = sup_nid($c,$acc["nid"]);
                            $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                            $data[$c] = [
                                "accountid" => $c,
                                "id" => $rs["id"],
                                "layer" => $c,
                                "report_path" => "did={$rs["id"]}&d0_user={$rs["name"]}",
                                "username" => $rs["name"]
                            ];
                            break;
                        case Constant::SU:
                            $d = "sid";
                            $du = "su_user";

                            $c = Constant::D0;
                            $nid = sup_nid($c,$acc["nid"]);
                            $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                            $data[$c] = [
                                "accountid" => $c,
                                "id" => $rs["id"],
                                "layer" => $c,
                                "report_path" => "did={$rs["id"]}&d0_user={$rs["name"]}",
                                "username" => $rs["name"]
                            ];

                            $c = Constant::CO;
                            $nid = sup_nid($c,$acc["nid"]);
                            $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                            $data[$c] = [
                                "accountid" => $c,
                                "id" => $rs["id"],
                                "layer" => $c,
                                "report_path" => "cid={$rs["id"]}&co_user={$rs["name"]}",
                                "username" => $rs["name"]
                            ];

                            break;
                        case Constant::AG:
                            $d = "aid";
                            $du = "ag_user";

                            $c = Constant::D0;
                            $nid = sup_nid($c,$acc["nid"]);
                            //print_R("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0");exit;
                            $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                            $data[$c] = [
                                "accountid" => $c,
                                "id" => $rs["id"],
                                "layer" => $c,
                                "report_path" => "did={$rs["id"]}&d0_user={$rs["name"]}",
                                "username" => $rs["name"]
                            ];

                            $c = Constant::CO;
                            $nid = sup_nid($c,$acc["nid"]);
                            $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                            $data[$c] = [
                                "accountid" => $c,
                                "id" => $rs["id"],
                                "layer" => $c,
                                "report_path" => "cid={$rs["id"]}&co_user={$rs["name"]}",
                                "username" => $rs["name"]
                            ];

                            $c = Constant::SU;
                            $nid = sup_nid($c,$acc["nid"]);
                            $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                            $data[$c] = [
                                "accountid" => $c,
                                "id" => $rs["id"],
                                "layer" => $c,
                                "report_path" => "sid={$rs["id"]}&su_user={$rs["name"]}",
                                "username" => $rs["name"]
                            ];
                            break;
                        case Constant::MEM:
                            $d = "mid";
                            $du = "mem_user";

                            $c = Constant::D0;
                            $nid = sup_nid($c,$acc["nid"]);
                            $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                            $data[$c] = [
                                "accountid" => $c,
                                "id" => $rs["id"],
                                "layer" => $c,
                                "report_path" => "did={$rs["id"]}&d0_user={$rs["name"]}",
                                "username" => $rs["name"]
                            ];

                            $c = Constant::CO;
                            $nid = sup_nid($c,$acc["nid"]);
                            $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                            $data[$c] = [
                                "accountid" => $c,
                                "id" => $rs["id"],
                                "layer" => $c,
                                "report_path" => "cid={$rs["id"]}&co_user={$rs["name"]}",
                                "username" => $rs["name"]
                            ];

                            $c = Constant::SU;
                            $nid = sup_nid($c,$acc["nid"]);
                            $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                            $data[$c] = [
                                "accountid" => $c,
                                "id" => $rs["id"],
                                "layer" => $c,
                                "report_path" => "sid={$rs["id"]}&su_user={$rs["name"]}",
                                "username" => $rs["name"]
                            ];

                            $c = Constant::AG;
                            $nid = sup_nid($c,$acc["nid"]);
                            $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                            $data[$c] = [
                                "accountid" => $c,
                                "id" => $rs["id"],
                                "layer" => $c,
                                "report_path" => "aid={$rs["id"]}&ag_user={$rs["name"]}",
                                "username" => $rs["name"]
                            ];
                            break;
                    }
                }

                break;
            case Constant::D0:
                $data["d0"] = [
                    "accountid" => "d0",
                    "id" => $this->sup["id"],
                    "layer" => Constant::D0,
                    "report_path" => "did={$this->sup["id"]}&d0_user={$this->sup["name"]}",
                    "username" => $this->sup["name"]
                ];
                switch ($now_layer){
                    case Constant::CO:
                        $d = "cid";
                        $du = "co_user";
                        break;
                    case Constant::SU:
                        $d = "sid";
                        $du = "su_user";

                        $c = Constant::CO;
                        $nid = sup_nid($c,$acc["nid"]);
                        $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                        $data[$c] = [
                            "accountid" => $c,
                            "id" => $rs["id"],
                            "layer" => $c,
                            "report_path" => "cid={$rs["id"]}&co_user={$rs["name"]}",
                            "username" => $rs["name"]
                        ];

                        break;
                    case Constant::AG:
                        $d = "aid";
                        $du = "ag_user";

                        $c = Constant::CO;
                        $nid = sup_nid($c,$acc["nid"]);
                        $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                        $data[$c] = [
                            "accountid" => $c,
                            "id" => $rs["id"],
                            "layer" => $c,
                            "report_path" => "cid={$rs["id"]}&co_user={$rs["name"]}",
                            "username" => $rs["name"]
                        ];

                        $c = Constant::SU;
                        $nid = sup_nid($c,$acc["nid"]);
                        $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                        $data[$c] = [
                            "accountid" => $c,
                            "id" => $rs["id"],
                            "layer" => $c,
                            "report_path" => "sid={$rs["id"]}&su_user={$rs["name"]}",
                            "username" => $rs["name"]
                        ];
                        break;
                    case Constant::MEM:
                        $d = "mid";
                        $du = "mem_user";

                        $c = Constant::CO;
                        $nid = sup_nid($c,$acc["nid"]);
                        $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                        $data[$c] = [
                            "accountid" => $c,
                            "id" => $rs["id"],
                            "layer" => $c,
                            "report_path" => "cid={$rs["id"]}&co_user={$rs["name"]}",
                            "username" => $rs["name"]
                        ];

                        $c = Constant::SU;
                        $nid = sup_nid($c,$acc["nid"]);
                        $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                        $data[$c] = [
                            "accountid" => $c,
                            "id" => $rs["id"],
                            "layer" => $c,
                            "report_path" => "sid={$rs["id"]}&su_user={$rs["name"]}",
                            "username" => $rs["name"]
                        ];

                        $c = Constant::AG;
                        $nid = sup_nid($c,$acc["nid"]);
                        $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                        $data[$c] = [
                            "accountid" => $c,
                            "id" => $rs["id"],
                            "layer" => $c,
                            "report_path" => "aid={$rs["id"]}&ag_user={$rs["name"]}",
                            "username" => $rs["name"]
                        ];
                        break;
                }
                break;
            case Constant::CO:
                $data["co"] = [
                    "accountid" => "co",
                    "id" => $this->sup["id"],
                    "layer" => Constant::CO,
                    "report_path" => "cid={$this->sup["id"]}&co_user={$this->sup["name"]}",
                    "username" => $this->sup["name"]
                ];
                switch ($now_layer){
                    case Constant::SU:
                        $d = "sid";
                        $du = "su_user";
                        break;
                    case Constant::AG:
                        $d = "aid";
                        $du = "ag_user";

                        $c = Constant::SU;
                        $nid = sup_nid($c,$acc["nid"]);
                        $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                        $data[$c] = [
                            "accountid" => $c,
                            "id" => $rs["id"],
                            "layer" => $c,
                            "report_path" => "sid={$rs["id"]}&su_user={$rs["name"]}",
                            "username" => $rs["name"]
                        ];
                        break;
                    case Constant::MEM:
                        $d = "mid";
                        $du = "mem_user";

                        $c = Constant::SU;
                        $nid = sup_nid($c,$acc["nid"]);
                        $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                        $data[$c] = [
                            "accountid" => $c,
                            "id" => $rs["id"],
                            "layer" => $c,
                            "report_path" => "sid={$rs["id"]}&su_user={$rs["name"]}",
                            "username" => $rs["name"]
                        ];

                        $c = Constant::AG;
                        $nid = sup_nid($c,$acc["nid"]);
                        $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                        $data[$c] = [
                            "accountid" => $c,
                            "id" => $rs["id"],
                            "layer" => $c,
                            "report_path" => "aid={$rs["id"]}&ag_user={$rs["name"]}",
                            "username" => $rs["name"]
                        ];
                        break;
                }
                break;
            case Constant::SU:
                $data["su"] = [
                    "accountid" => "su",
                    "id" => $this->sup["id"],
                    "layer" => Constant::SU,
                    "report_path" => "sid={$this->sup["id"]}&su_user={$this->sup["name"]}",
                    "username" => $this->sup["name"]
                ];
                switch ($now_layer){
                    case Constant::AG:
                        $d = "aid";
                        $du = "ag_user";
                        break;
                    case Constant::MEM:
                        $d = "mid";
                        $du = "mem_user";

                        $c = Constant::AG;
                        $nid = sup_nid($c,$acc["nid"]);
                        $rs = $this->dbc->select("SELECT {$field} FROM {$this->rankTable} WHERE `nid`='{$nid}' AND `isMaster`=0","Row");
                        $data[$c] = [
                            "accountid" => $c,
                            "id" => $rs["id"],
                            "layer" => $c,
                            "report_path" => "aid={$rs["id"]}&ag_user={$rs["name"]}",
                            "username" => $rs["name"]
                        ];
                        break;
                }
                break;
            case Constant::AG:
                $data["ag"] = [
                    "accountid" => "ag",
                    "id" => $this->sup["id"],
                    "layer" => Constant::AG,
                    "report_path" => "aid={$this->sup["id"]}&ag_user={$this->sup["name"]}",
                    "username" => $this->sup["name"]
                ];

                $d = "mid";
                $du = "mem_user";
                break;
        }
        $data[$now_layer] = [
            "accountid" => $now_layer,
            "id" => $acc["id"],
            "layer" => $now_layer,
            "report_path" => "{$d}={$acc["id"]}&{$du}={$acc["name"]}",
            "username" => $acc["name"]
        ];

        return ["data"=>$data];
    }

    /**
     * 报表数据
     * @param $layer
     * @return array
     */
    public function report_data($layer){
        global $ls_ag_ary,$currencys;
        $_p = $this->param;
        
        $result_name = $ls_ag_ary["page_set"];
        if(isset($_p["result_type"]) && $_p["result_type"]=="N"){
            $result_name = $ls_ag_ary["page_un"];
        }

        $start = isset($_p["date_start"]) ? $_p["date_start"] : date("Y-m-d");
        $end = isset($_p["date_end"]) ? $_p["date_end"] : date("Y-m-d");
        $gtype = isset($_p["gtype"]) ? strtoupper($_p["gtype"]) : "";
        $wtype = isset($_p["wtype"]) ? strtoupper($_p["wtype"]) : "";
        $kind =  isset($_p["report_kind"]) ? strtoupper($_p["report_kind"]) : "A";
        $result = isset($_p["result_type"]) ? strtoupper($_p["result_type"]) : "Y";
        $ary = [
            "status" => 200,
            "msg" => "",
            "code" => "report_data",
            "data" => [
                "array"=>[
                    "sub_data"=>[
                        "SUAGENT_USER"=>"",
                        "SUAGENT_ALIAS"=>"",
                        "SCOUNT"=>"",
                        "SGOLD"=>"",
                        "SVGOLD"=>"",
                        "SGOLD_ALL"=>"",
                        "MWINGOLD"=>"",
                        "AWINGOLD"=>"",
                        "ARESULT"=>"",
                        "SRESULT"=>""
                    ],
                    "display"=>[
                        "LIST_CREDIT"=>"none",
                        "LIST_NODATA"=>"",
                        "LIST_CLOSEDATA"=>"none"
                    ],
                    "enable"=>[
                        "COSU_ENABLE"=>"none"
                    ]
                ],
                "subUser_msg"=>[
                    "sub_message"=>"N",
                    "sub_num"=>0,
                    "total_num"=>0
                ],
                "head"=>[],
                "RESULT_NAME"=>$result_name,
                "SUB_DATE_START"=>$start,
                "SUB_DATE_END"=>$end,
                "gtype"=>$gtype,
                "wtype"=>$wtype,
                "filename"=>null
            ],
            "sub"  => [
                "sub_message"=>"N",
                "sub_num"=>0,
                "total_num"=>0
            ]
        ];
        $smn = $this->son_nid_manger("idAry");//下级id
        $smn_nid = $this->son_nid_manger();//下级nid
        $son_sub_list = [];
        if($smn!==false){ //子账号报表管理
            $ary["sub"]["sub_message"] = "Y";
            //查询下级账户所有资料
            switch ($this->login_layer){
                case Constant::ADS:
                    $ad_all = $this->dbc->select("SELECT * FROM {$this->adTable} WHERE `nid` LIKE '{$this->sup["nid"]}%' AND `isMaster`=0 AND `level`=1");
                    break;
                case Constant::AD:
                    $ad_all = $this->dbc->select("SELECT * FROM {$this->rankTable} WHERE `nid` LIKE '{$this->sup["nid"]}%' AND `isMaster`=0 AND `level`=4");
                    break;
                case Constant::D0:
                    $ad_all = $this->dbc->select("SELECT * FROM {$this->rankTable} WHERE `nid` LIKE '{$this->sup["nid"]}%' AND `isMaster`=0 AND `level`=3");
                    break;
                case Constant::CO:
                    $ad_all = $this->dbc->select("SELECT * FROM {$this->rankTable} WHERE `nid` LIKE '{$this->sup["nid"]}%' AND `isMaster`=0 AND `level`=2");
                    break;
                case Constant::SU:
                    $ad_all = $this->dbc->select("SELECT * FROM {$this->rankTable} WHERE `nid` LIKE '{$this->sup["nid"]}%' AND `isMaster`=0 AND `level`=1");
                    break;
                case Constant::AG:
                    $ad_all = $this->dbc->select("SELECT * FROM {$this->memTable} WHERE `nid` LIKE '{$this->sup["nid"]}%'");
                    break;
            }
            if(!$ad_all){ return $ary;}
            $ary["sub"]["total_num"] = count($ad_all);
            $ary["sub"]["sub_num"] = count($smn);
            $ad_ids = array_column($ad_all,"id");
            $idAry = array_intersect($ad_ids,$smn);
            if(count($idAry)==0){
                return $ary;
            }

            foreach ($idAry as $v){
                $key = array_search($v,$ad_ids);
                $son_sub_list[$v] = $ad_all[$key];
            }
        }

        $where = "`nid` LIKE '{$this->sup["nid"]}%' AND `m_date` BETWEEN '{$start}' AND '{$end}' AND `hidden`=0";
        if(!empty($gtype)){
            $where.= " AND `gtype`='{$gtype}'";
        }

        if(!empty($wtype)){
            $where.= " AND `wtype`='{$wtype}'";
        }

        switch ($kind){
            case "A":
                //$where.= " AND `status`=0";
                if($result == "Y"){
                    $where.= " AND `isResult`=1";
                }else{
                    $where.= " AND `isResult`=0";
                }
                break;
            case "D"://取消注单
                $where.= " AND `status`>0 AND `status`<16";
                break;
            case "D4"://非正常投注
                $where.= " AND `status`=16";
                break;
        }
        $row0 = [];
        $tfoot = 0;//获利率
        $total = [];//注单查询
        $url = "";
        $log = "报表";

        if($layer == $this->login_layer || $layer==Constant::AD){
            //注单查询
            $count = $this->dbc->getCount($this->betTable,"`ID`",$where);
            if($count==0){
                return $ary;
            }
            $table = $this->tables[$layer]["t"];
            $total = [
                "WCOUNT0" => 0,
                "GOLD0" => 0,
                "VGOLD0" => 0,
                "MWINGOLD0" => 0,
                "AWINGOLD0" => 0,
            ];
            $winKey = ["GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0"];
            $fileds = ",COUNT(`ID`) AS `WCOUNT0`";
            $fileds.= ",ROUND(SUM(`bet_golds`),2) AS `GOLD0`";
            $fileds.= ",ROUND(SUM(`valid_gold`),2) AS `VGOLD0`";
            $fileds.= ",ROUND(SUM(`mem_result`),2) AS `MWINGOLD0`";
            $fileds.= ",ROUND(SUM(`agent_result`),2) AS `AWINGOLD0`";
            switch (strtolower($layer)){
                case Constant::ADS:
                case Constant::AD:
                    $layerA = "AD";
                    $log .= "-公司";
                    $idname = "adid";
                    $layer_user = "ad_user";
                    $view_layer = Constant::D0;

                    $total["ARESULT0"] = 0;
                    $total["SRESULT0"] = 0;
                    $total["CRESULT0"] = 0;
                    $total["D0RESULT0"] = 0;
                    $total["{$layerA}RESULT0"] = 0;
                    $total["{$layerA}1RESULT0"] = 0;
                    $total["{$layerA}GOLD0"] = 0;
                    $total["{$layerA}RATIO0"] = 0;

                    $winKey[] = "ARESULT0";
                    $winKey[] = "SRESULT0";
                    $winKey[] = "CRESULT0";
                    $winKey[] = "D0RESULT0";
                    $winKey[] = "{$layerA}RESULT0";
                    $winKey[] = "{$layerA}1RESULT0";
                    $winKey[] = "{$layerA}GOLD0";

                    $fileds.= ",ROUND(SUM(`ag_result`),2) AS `ARESULT0`";
                    $fileds.= ",ROUND(SUM(`su_result`),2) AS `SRESULT0`";
                    $fileds.= ",ROUND(SUM(`co_result`),2) AS `CRESULT0`";
                    $fileds.= ",ROUND(SUM(`d0_result`),2) AS `D0RESULT0`";
                    $fileds.= ",0 AS `{$layerA}RESULT0`";
                    $fileds.= ",ROUND(SUM(`d0_result`),2) AS `{$layerA}1RESULT0`";
                    $fileds.= ",0 AS `{$layerA}GOLD0`";//实货量
                    $fileds.= ",ROUND(SUM((100-`d0_point`-`co_point`-`su_point`-`ag_point`))/COUNT(`ID`),2) AS `{$layerA}RATIO0`";

                    if($smn!==false){//子账号
                        if(isset($_p["adid"]) && isset($_p["ad_user"])){
                            $ad = $this->dbc->select("SELECT * FROM {$table} WHERE `id`='{$_p["adid"]}' AND `isMaster`=0");
                        }else{
                            $ad = array_values($son_sub_list);
                        }
                    } else {
                        if($layer == Constant::AD && $layer == $this->login_layer){
                            $ad = $this->dbc->select("SELECT * FROM {$table} WHERE `nid`='{$this->sup["nid"]}' AND `isMaster`=0");
                        } else {
                            if(isset($_p["adid"]) && isset($_p["ad_user"])){
                                $ad = $this->dbc->select("SELECT * FROM {$table} WHERE `id`='{$_p["adid"]}' AND `isMaster`=0");
                            } else {
                                $ad = $this->dbc->select("SELECT * FROM {$table} WHERE `nid` LIKE '{$this->sup["nid"]}%' AND `level`=1 AND `isMaster`=0");
                            }
                        }
                    }
                    break;
                case Constant::D0:
                    $layerA = "D0";
                    $log .= "-分公司";
                    $idname = "did";
                    $layer_user = "d0_user";
                    $view_layer = Constant::CO;

                    $total["ARESULT0"] = 0;
                    $total["SRESULT0"] = 0;
                    $total["CRESULT0"] = 0;
                    $total["{$layerA}RESULT0"] = 0;
                    $total["{$layerA}1RESULT0"] = 0;
                    $total["{$layerA}GOLD0"] = 0;
                    $total["{$layerA}RATIO0"] = 0;

                    $winKey[] = "ARESULT0";
                    $winKey[] = "SRESULT0";
                    $winKey[] = "CRESULT0";
                    $winKey[] = "{$layerA}RESULT0";
                    $winKey[] = "{$layerA}1RESULT0";
                    $winKey[] = "{$layerA}GOLD0";

                    $fileds.= ",ROUND(SUM(`ag_result`),2) AS `ARESULT0`";
                    $fileds.= ",ROUND(SUM(`su_result`),2) AS `SRESULT0`";
                    $fileds.= ",ROUND(SUM(`co_result`),2) AS `CRESULT0`";
                    $fileds.= ",ROUND(SUM(`co_result`),2) AS `{$layerA}1RESULT0`";
                    $fileds.= ",ROUND(SUM(`d0_result`),2) AS `{$layerA}RESULT0`";
                    $fileds.= ",ROUND(SUM(`valid_gold`*(100-`d0_point`-`co_point`-`su_point`-`ag_point`)/100),2) AS `{$layerA}GOLD0`";//实货量
                    $fileds.= ",ROUND(SUM(`d0_point`)/COUNT(`ID`),2) AS `{$layerA}RATIO0`";

                    if($smn!==false){//子账号
                        $ad = array_values($son_sub_list);
                    } else {
                        $ad = $this->dbc->select("SELECT * FROM {$table} WHERE `nid`='{$this->sup["nid"]}' AND `isMaster`=0");
                    }

                    break;
                case Constant::CO:
                    $layerA = "C";
                    $log .= "-股东";
                    $idname = "cid";
                    $layer_user = "co_user";
                    $total["ARESULT0"] = 0;
                    $total["SRESULT0"] = 0;
                    $total["{$layerA}RESULT0"] = 0;
                    $total["{$layerA}1RESULT0"] = 0;
                    $total["{$layerA}GOLD0"] = 0;
                    $total["{$layerA}RATIO0"] = 0;
                    $view_layer = Constant::SU;

                    $winKey[] = "ARESULT0";
                    $winKey[] = "SRESULT0";
                    $winKey[] = "{$layerA}RESULT0";
                    $winKey[] = "{$layerA}1RESULT0";
                    $winKey[] = "{$layerA}GOLD0";

                    $fileds.= ",ROUND(SUM(`ag_result`),2) AS `ARESULT0`";
                    $fileds.= ",ROUND(SUM(`su_result`),2) AS `SRESULT0`";
                    $fileds.= ",ROUND(SUM(`su_result`),2) AS `{$layerA}1RESULT0`";
                    $fileds.= ",ROUND(SUM(`co_result`),2) AS `{$layerA}RESULT0`";
                    $fileds.= ",ROUND(SUM(`valid_gold`*(100 -`co_point`-`su_point`-`ag_point`)/100),2) AS `{$layerA}GOLD0`";//实货量
                    $fileds.= ",ROUND(SUM(`co_point`)/COUNT(`ID`),2) AS `{$layerA}RATIO0`";
                    if($smn!==false){//子账号
                        $ad = array_values($son_sub_list);
                    } else {
                        $ad = $this->dbc->select("SELECT * FROM {$table} WHERE `nid`='{$this->sup["nid"]}' AND `isMaster`=0");
                    }

                    break;
                case Constant::SU:
                    $layerA = "S";
                    $log .= "-总代理";
                    $idname = "sid";
                    $layer_user = "su_user";
                    $total["ARESULT0"] = 0;
                    $total["{$layerA}RESULT0"] = 0;
                    $total["{$layerA}1RESULT0"] = 0;
                    $total["{$layerA}GOLD0"] = 0;
                    $total["{$layerA}RATIO0"] = 0;
                    $view_layer = Constant::AG;

                    $winKey[] = "ARESULT0";
                    $winKey[] = "{$layerA}RESULT0";
                    $winKey[] = "{$layerA}1RESULT0";
                    $winKey[] = "{$layerA}GOLD0";

                    $fileds.= ",ROUND(SUM(`ag_result`),2) AS `ARESULT0`";
                    $fileds.= ",ROUND(SUM(`ag_result`),2) AS `{$layerA}1RESULT0`";
                    $fileds.= ",ROUND(SUM(`su_result`),2) AS `{$layerA}RESULT0`";
                    $fileds.= ",ROUND(SUM(`valid_gold`*(100 -`su_point`-`ag_point`)/100),2) AS `{$layerA}GOLD0`";//实货量
                    $fileds.= ",ROUND(SUM(`su_point`)/COUNT(`ID`),2) AS `{$layerA}RATIO0`";
                    if($smn!==false){//子账号
                        $ad = array_values($son_sub_list);
                    } else {
                        $ad = $this->dbc->select("SELECT * FROM {$table} WHERE `nid`='{$this->sup["nid"]}' AND `isMaster`=0");
                    }

                    break;
                case Constant::AG:
                    $layerA = "A";
                    $log .= "-代理";
                    $idname = "aid";
                    $layer_user = "ag_user";
                    $view_layer = Constant::MEM;

                    $total["{$layerA}RESULT0"] = 0;
                    $total["{$layerA}GOLD0"] = 0;
                    $total["{$layerA}RATIO0"] = 0;

                    $winKey[] = "{$layerA}RESULT0";
                    $winKey[] = "{$layerA}GOLD0";

                    $fileds.= ",ROUND(SUM(`ag_result`),2) AS `{$layerA}RESULT0`";
                    $fileds.= ",ROUND(SUM(`valid_gold`*(100 -`ag_point`)/100),2) AS `{$layerA}GOLD0`";//实货量
                    $fileds.= ",ROUND(SUM(`ag_point`)/COUNT(`ID`),2) AS `{$layerA}RATIO0`";

                    if($smn!==false){//子账号
                        $ad = array_values($son_sub_list);
                    } else {
                        $ad = $this->dbc->select("SELECT * FROM {$table} WHERE `nid`='{$this->sup["nid"]}' AND `isMaster`=0");
                    }
                    break;
            }
            //$ad 下级资料
            if($ad){
                foreach ($ad as $v){
                    $ww = str_replace($this->sup["nid"],$v["nid"],$where);
                    if($smn!==false && $this->login_layer!=Constant::ADS){//子账号
                        $v = $this->sup;
                    }
                    $sql = "SELECT {$v["id"]} AS `ID0`,'{$v["name"]}' AS `NAME0`,'{$v["alias"]}' AS `ALIAS0` ,'{$v["id"]}' AS `AID0`";
                    $sql.= ",'{$idname}={$v["id"]}&{$layer_user}={$v["name"]}&report_date={$start}&report_daily={$end}' AS `ACTION0`";
                    $sql.= $fileds;
                    $sql.= " FROM {$this->betTable} WHERE {$ww}";
                    $rs = $this->dbc->select($sql,"Row");
                    if($rs && $rs["WCOUNT0"]>0){
                        foreach ($total as $kk => $vv){
                            $total[$kk] += $rs[$kk];
                            if(in_array($kk,$winKey)){
                                if($rs[$kk]<0){
                                    $rs[$kk] = number_format($rs[$kk],1);
                                    $rs[$kk] = "<span class='word_red'>{$rs[$kk]}</span>";
                                }else{
                                    $rs[$kk] = number_format($rs[$kk],1);
                                }
                            }
                        }
                        $row0[] = $rs;
                    }else{
                        if(isset($_p["adid"]) && isset($_p["ad_user"])){
                            return $ary;
                        }
                    }
                }


            }else{
                return $ary;
            }
            $result0 = 0;
            foreach ($winKey as $v){
                if($v == "{$layerA}RESULT0"){
                    $result0 = str_replace(",","",$total[$v]);
                }
                if($total[$v]<0){
                    $total[$v] = number_format($total[$v],1);
                    $total[$v] = "<span class='word_lightpink'>{$total[$v]}</span>";
                }else{
                    $total[$v] = number_format($total[$v],1);
                }
            }
            $total["{$layerA}RATIO0"] = round($total["{$layerA}RATIO0"]/count($row0),2);
            if(count($row0)>0){
                $ary["data"]["array"]["row0"]  = $row0;
            }

            $ary["data"]["array"]["total"] = $total;
            if($total["{$layerA}GOLD0"]== 0 || $result0 == 0){
                $profit = 0;
            }else{
                $profit = round($result0/floatval(str_replace(",","",$total["{$layerA}GOLD0"]))*100,2);
            }

            $ary["data"]["array"]["view_layer"] = $view_layer;
            $ary["data"]["array"]["tfoot"]["{$layerA}RTAX_0"] = "{$profit}%";
            $ary["data"]["array"]["performance"] = [
                "RESULT" => $rs["{$layerA}RESULT0"]<0 ? "<span class='word_red'>{$rs["{$layerA}RESULT0"]}</span>" : $rs["{$layerA}RESULT0"],
                "STOCK" => $total["VGOLD0"],
                "PROFIT" => $profit
            ];
            $ary["data"]["head"] = [];
        } else {

            if($layer != Constant::MEM && $layer != "list_bet") {//管理层
                //注单查询
                $total = [
                    "WCOUNT0" => 0,
                    "GOLD0" => 0,
                    "VGOLD0" => 0,
                    "MWINGOLD0" => 0,
                    "AWINGOLD0" => 0,
                ];

                $winKey = ["GOLD0", "VGOLD0", "MWINGOLD0", "AWINGOLD0"];
                $fileds = "COUNT(`ID`) AS `WCOUNT0`";
                $fileds .= ",ROUND(SUM(`bet_golds`),2) AS `GOLD0`";
                $fileds .= ",ROUND(SUM(`valid_gold`),2) AS `VGOLD0`";
                $fileds .= ",ROUND(SUM(`mem_result`),2) AS `MWINGOLD0`";
                $fileds .= ",ROUND(SUM(`agent_result`),2) AS `AWINGOLD0`";
                $fileds .= ",ROUND(SUM(`ag_result`),2) AS `ARESULT0`";

                switch (strtolower($this->login_layer)) {
                    case Constant::ADS:
                    case Constant::AD:
                        $ad0 = "AD";
                        $total[$ad0 . "RESULT0"] = 0;
                        $total[$ad0 . "1RESULT0"] = 0;
                        $total[$ad0 . "GOLD0"] = 0;
                        $total[$ad0 . "RATIO0"] = 0;

                        $winKey[] = $ad0 . "RESULT0";
                        $winKey[] = $ad0 . "1RESULT0";
                        $winKey[] = $ad0 . "GOLD0";

                        $fileds .= ",ROUND(SUM(`d0_result`),2) AS `{$ad0}RESULT0`,0 AS `{$ad0}1RESULT0`";
                        $fileds .= ",ROUND(SUM((100-`d0_point`-`co_point`-`su_point`-`ag_point`))/COUNT(`ID`),2) AS `{$ad0}RATIO0`";
                        $fileds .= ",0 AS `{$ad0}GOLD0`";
                    case Constant::D0:
                        $d0 = "D0";
                        $total[$d0 . "RESULT0"] = 0;
                        $total[$d0 . "1RESULT0"] = 0;
                        $total[$d0 . "GOLD0"] = 0;
                        $total[$d0 . "RATIO0"] = 0;
                        $total[$d0 . "WINLOSS0"] = 0;

                        $winKey[] = $d0 . "RESULT0";
                        $winKey[] = $d0 . "1RESULT0";
                        $winKey[] = $d0 . "GOLD0";

                        $fileds .= ",ROUND(SUM(`d0_result`),2) AS `{$d0}RESULT0`,ROUND(SUM(`co_result`),2) AS `{$d0}1RESULT0`";
                        $fileds .= ",ROUND(SUM(`valid_gold`*(100-`d0_point`-`co_point`-`su_point`-`ag_point`)/100),2) AS `{$d0}GOLD0`";
                        $fileds .= ",ROUND(SUM(`{$d0}_point`)/COUNT(`ID`),2) AS `{$d0}RATIO0`";
                        $fileds .= ",ROUND(SUM(`{$d0}_point`/100)/COUNT(`ID`),2) AS `{$d0}WINLOSS0`";
                    case Constant::CO:
                        $co = "C";
                        $total[$co . "RESULT0"] = 0;
                        $total[$co . "1RESULT0"] = 0;
                        $total[$co . "GOLD0"] = 0;
                        $total[$co . "RATIO0"] = 0;
                        $total[$co . "WINLOSS0"] = 0;

                        $winKey[] = $co . "RESULT0";
                        $winKey[] = $co . "1RESULT0";
                        $winKey[] = $co . "GOLD0";

                        $fileds .= ",ROUND(SUM(`co_result`),2) AS `{$co}RESULT0`,ROUND(SUM(`su_result`),2) AS `{$co}1RESULT0`";
                        $fileds .= ",ROUND(SUM(`valid_gold`*(100 -`co_point`-`su_point`-`ag_point`)/100),2) AS `{$co}GOLD0`";
                        $fileds .= ",ROUND(SUM(`co_point`)/COUNT(`ID`),2) AS `{$co}RATIO0`";
                        $fileds .= ",ROUND(SUM(`co_point`/100)/COUNT(`ID`),2) AS `{$co}WINLOSS0`";
                    case Constant::SU:
                        $su = "S";
                        $total[$su . "RESULT0"] = 0;
                        $total[$su . "1RESULT0"] = 0;
                        $total[$su . "GOLD0"] = 0;
                        $total[$su . "RATIO0"] = 0;
                        $total[$su . "WINLOSS0"] = 0;

                        $winKey[] = $su . "RESULT0";
                        $winKey[] = $su . "1RESULT0";
                        $winKey[] = $su . "GOLD0";

                        $fileds .= ",ROUND(SUM(`su_result`),2) AS `{$su}RESULT0`,ROUND(SUM(`ag_result`),2) AS `{$su}1RESULT0`";
                        $fileds .= ",ROUND(SUM(`valid_gold`*(100 -`su_point`-`ag_point`)/100),2) AS `{$su}GOLD0`";
                        $fileds .= ",ROUND(SUM(`su_point`)/COUNT(`ID`),2) AS `{$su}RATIO0`";
                        $fileds .= ",ROUND(SUM(`su_point`/100)/COUNT(`ID`),2) AS `{$su}WINLOSS0`";
                    case Constant::AG:
                        $ag = "A";
                        $total[$ag . "RESULT0"] = 0;
                        $total["RESULT_D0"] = 0;
                        $total[$ag . "GOLD0"] = 0;
                        $total[$ag . "RATIO0"] = 0;
                        $total[$ag . "WINLOSS0"] = 0;

                        $winKey[] = $ag . "RESULT0";
                        $winKey[] = $ag . "GOLD0";
                        $winKey[] = "RESULT_D0";

                        $fileds .= ",ROUND(SUM(`ag_result`),2) AS `RESULT_D0`";//结果
                        $fileds .= ",ROUND(SUM(`ag_result`),2) AS `{$ag}RESULT0`";
                        $fileds .= ",ROUND(SUM(`valid_gold`*(100 -`ag_point`)/100),2) AS `{$ag}GOLD0`";
                        $fileds .= ",ROUND(SUM(`ag_point`)/COUNT(`ID`),2) AS `{$ag}RATIO0`";
                        $fileds .= ",ROUND(SUM(`ag_point`/100)/COUNT(`ID`),2) AS `{$ag}WINLOSS0`";
                        break;
                }
                $view_layer = "";
                $ww = $where;
                switch ($layer) {
                    case Constant::D0:
                        $view_layer = Constant::CO;
                        $layerA = "D0";
                        $idname = "did";
                        switch ($this->login_layer) {
                            case Constant::ADS:
                            case Constant::AD:
                                $log .= "-公司[{$_p["ad_user"]}] -分公司";
                                $url .= "&adid={$_p["adid"]}&ad_user={$_p["ad_user"]}";
                                $fileds.= ",'{$_p["adid"]}' AS `ADID0`";
                                $ary["data"]["head"]["AD_USER"] = $_p["ad_user"];
                                $ary["data"]["head"]["AD_DISPLAY"] = "";
                                break;
                        }


                        if (isset($_p["adid"])) {
                            if(isset($_p["did"]) && isset($_p["d0_user"])) {//查询指定账号
                                $ad = $this->dbc->select("SELECT `nid` FROM ".Constant::T_RANK." WHERE `id`={$_p["did"]} AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
                            }else{
                                $ad = $this->dbc->select("SELECT `nid` FROM {$this->adTable} WHERE `id`={$_p["adid"]} AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
                            }
                            if ($ad) {
                                $sub = $this->dbc->select("SELECT `nid`,`id`,`name`,`alias` FROM {$this->rankTable} WHERE `nid` LIKE '{$ad["nid"]}%' AND `isMaster`=0 AND `level`=4");
                                if ($smn!==false) {//子账号
                                    $d = [];
                                    foreach ($sub as $v){
                                        $nid = $this->get_manger_acc_nid($layer,$v["nid"]);
                                        if(in_array($nid,$smn_nid)){
                                            $d[] = $v;
                                        }
                                    }
                                } else {
                                    $d = $sub;
                                }

                                $nameAry = array_column($d, "name");
                                $ww = str_replace($this->sup["nid"], $ad["nid"], $where);

                            }
                        }
                        break;
                    case Constant::CO:
                        $view_layer = Constant::SU;
                        $layerA = "C";
                        $idname = "cid";
                        switch ($this->login_layer) {
                            case Constant::ADS:
                            case Constant::AD:
                                $log .= "-公司[{$_p["ad_user"]}]";
                                $url .= "&adid={$_p["adid"]}&ad_user={$_p["ad_user"]}";
                                $fileds.= ",'{$_p["adid"]}' AS `ADID0`";
                                $ary["data"]["head"]["AD_USER"] = $_p["ad_user"];
                                $ary["data"]["head"]["AD_DISPLAY"] = "";
                            case Constant::D0:
                                $log .= "-分公司[{$_p["d0_user"]}]-股东";
                                $url .= "&did={$_p["did"]}&d0_user={$_p["d0_user"]}";
                                $fileds.= ",'{$_p["did"]}' AS `DID0`";
                                $ary["data"]["head"]["D0_USER"] = $_p["d0_user"];
                                $ary["data"]["head"]["D0_DISPLAY"] = "";
                        }
                        if (isset($_p["did"])) {
                            if(isset($_p["cid"]) && isset($_p["co_user"])) {//查询指定账号
                                $ad = $this->dbc->select("SELECT `nid` FROM {$this->rankTable} WHERE `id`={$_p["cid"]} AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
                            }else{
                                $ad = $this->dbc->select("SELECT `nid` FROM {$this->rankTable} WHERE `id`={$_p["did"]} AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
                            }

                            if ($ad) {
                                $sub = $this->dbc->select("SELECT `nid`,`id`,`name`,`alias` FROM {$this->rankTable} WHERE `nid` LIKE '{$ad["nid"]}%' AND `isMaster`=0 AND `level`=3");
                                if ($smn!==false) {//子账号
                                    $d = [];
                                    foreach ($sub as $v){
                                        $nid = $this->get_manger_acc_nid($layer,$v["nid"]);
                                        if(in_array($nid,$smn_nid)){
                                            $d[] = $v;
                                        }
                                    }
                                } else {
                                    $d = $sub;
                                }
                                $nameAry = array_column($d, "name");
                                $ww = str_replace($this->sup["nid"], $ad["nid"], $where);
                            }
                        }
                        break;
                    case Constant::SU:
                        $view_layer = Constant::AG;
                        $layerA = "S";
                        $idname = "sid";
                        switch ($this->login_layer) {
                            case Constant::ADS:
                            case Constant::AD:
                                $log .= "-公司[{$_p["ad_user"]}]";
                                $url .= "&adid={$_p["adid"]}&ad_user={$_p["ad_user"]}";
                                $fileds.= ",'{$_p["adid"]}' AS `ADID0`";
                                $ary["data"]["head"]["AD_USER"] = $_p["ad_user"];
                                $ary["data"]["head"]["AD_DISPLAY"] = "";
                            case Constant::D0:
                                $log .= "-分公司[{$_p["d0_user"]}]";
                                $url .= "&did={$_p["did"]}&d0_user={$_p["d0_user"]}";
                                $fileds.= ",'{$_p["did"]}' AS `DID0`";
                                $ary["data"]["head"]["D0_USER"] = $_p["d0_user"];
                                $ary["data"]["head"]["D0_DISPLAY"] = "";
                            case Constant::CO:
                                $log .= "-股东[{$_p["co_user"]}]-总代理";
                                $url .= "&cid={$_p["cid"]}&co_user={$_p["co_user"]}";
                                $ary["data"]["head"]["CO_USER"] = $_p["co_user"];
                                $ary["data"]["head"]["CO_DISPLAY"] = "";
                                $fileds.= ",'{$_p["cid"]}' AS `CID0`";
                                break;
                        }
                        if (isset($_p["cid"])) {
                            if(isset($_p["sid"]) && isset($_p["su_user"])) {//查询指定账号
                                $ad = $this->dbc->select("SELECT `nid` FROM {$this->rankTable} WHERE `id`={$_p["sid"]} AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
                            }else{
                                $ad = $this->dbc->select("SELECT `nid` FROM {$this->rankTable} WHERE `id`={$_p["cid"]} AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
                            }

                            if ($ad) {
                                $sub = $this->dbc->select("SELECT `nid`,`id`,`name`,`alias` FROM {$this->rankTable} WHERE `nid` LIKE '{$ad["nid"]}%' AND `isMaster`=0 AND `level`=2");
                                if ($smn!==false) {//子账号
                                    $d = [];
                                    foreach ($sub as $v) {
                                        $nid = $this->get_manger_acc_nid($layer, $v["nid"]);
                                        if (in_array($nid, $smn_nid)) {
                                            $d[] = $v;
                                        }
                                    }
                                } else {
                                    $d = $sub;
                                }

                                $nameAry = array_column($d, "name");
                                $ww = str_replace($this->sup["nid"], $ad["nid"], $where);
                            }
                        }
                        break;
                    case Constant::AG:
                        $view_layer = Constant::MEM;
                        $layerA = "A";
                        $idname = "aid";

                        switch ($this->login_layer) {
                            case Constant::ADS:
                            case Constant::AD:
                                $log .= "-公司[{$_p["ad_user"]}]";
                                $url .= "&adid={$_p["adid"]}&ad_user={$_p["ad_user"]}";
                                $fileds.= ",'{$_p["adid"]}' AS `ADID0`";
                                $ary["data"]["head"]["AD_USER"] = $_p["ad_user"];
                                $ary["data"]["head"]["AD_DISPLAY"] = "";
                            case Constant::D0:
                                $log .= "-分公司[{$_p["d0_user"]}]";
                                $url .= "&did={$_p["did"]}&d0_user={$_p["d0_user"]}";
                                $ary["data"]["head"]["D0_USER"] = $_p["d0_user"];
                                $ary["data"]["head"]["D0_DISPLAY"] = "";
                                $fileds.= ",'{$_p["did"]}' AS `DID0`";
                            case Constant::CO:
                                $log .= "-股东[{$_p["co_user"]}]";
                                $url .= "&cid={$_p["cid"]}&co_user={$_p["co_user"]}";
                                $ary["data"]["head"]["CO_USER"] = $_p["co_user"];
                                $ary["data"]["head"]["CO_DISPLAY"] = "";
                                $fileds.= ",'{$_p["cid"]}' AS `CID0`";
                            case Constant::SU:
                                $log .= "-总代理[{$_p["su_user"]}]-代理商";
                                $url .= "&sid={$_p["sid"]}&su_user={$_p["su_user"]}";
                                $fileds.= ",'{$_p["sid"]}' AS `SID0`";
                                $ary["data"]["head"]["SU_USER"] = $_p["su_user"];
                                $ary["data"]["head"]["SU_DISPLAY"] = "";
                                break;
                        }
                        if (isset($_p["sid"])) {
                            if(isset($_p["aid"]) && isset($_p["ag_user"])){//查询指定账号
                                $ad = $this->dbc->select("SELECT `nid` FROM {$this->rankTable} WHERE `id`={$_p["aid"]} AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
                            }else {
                                $ad = $this->dbc->select("SELECT `nid` FROM {$this->rankTable} WHERE `id`={$_p["sid"]} AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'", "Row");
                            }
                            if ($ad) {
                                $sub = $this->dbc->select("SELECT `nid`,`id`,`name`,`alias` FROM {$this->rankTable} WHERE `nid` LIKE '{$ad["nid"]}%' AND `isMaster`=0 AND `level`=1");
                                if ($smn!==false) {//子账号
                                    $d = [];
                                    foreach ($sub as $v) {
                                        $nid = $this->get_manger_acc_nid($layer, $v["nid"]);
                                        if (in_array($nid, $smn_nid)) {
                                            $d[] = $v;
                                        }
                                    }
                                } else {
                                    $d = $sub;
                                }
                                $nameAry = array_column($d, "name");
                                $ww = str_replace($this->sup["nid"], $ad["nid"], $where);
                            }
                        }
                        break;
                }

                $url = ltrim($url, "&");
                $sql = "SELECT {$fileds},`{$layer}_name` AS `NAME0`  FROM {$this->betTable} WHERE {$ww} GROUP BY `{$layer}_name` ORDER BY `{$layer}_name` ASC";
                $rows = $this->dbc->select($sql);
                //print_r($sql);exit;
                $ratios = ["D0RATIO0", "CRATIO0", "SRATIO0", "ARATIO0","D0WINLOSS0", "CWINLOSS0", "SWINLOSS0", "AWINLOSS0"];
                if ($rows) {

                    foreach ($rows as $rs) {
                        if(!isset($nameAry) || (isset($nameAry) && in_array($rs["NAME0"], $nameAry))) {
                            foreach ($total as $kk => $vv) {
                                $total[$kk] += $rs[$kk];
                                if (in_array($kk, $winKey)) {
                                    if ($rs[$kk] < 0) {
                                        $rs[$kk] = number_format($rs[$kk], 1);
                                        $rs[$kk] = "<span class='word_red'>{$rs[$kk]}</span>";
                                    } else {
                                        $rs[$kk] = number_format($rs[$kk], 1);
                                    }
                                }
                            }

                            $k = 0;
                            if (isset($nameAry)) {
                                $k = array_search($rs["NAME0"], $nameAry);
                            }

                            $names = $d[$k];

                            $rs["ID0"] = $names["id"];
                            $rs[strtoupper($idname) . "0"] = $names["id"];
                            $rs["ALIAS0"] = $names["alias"];
                            $rs["ACTION0"] = $url . "&{$idname}={$names["id"]}&{$layer}_user={$names["name"]}&report_date={$start}&report_daily={$end}";
                            foreach ($ratios as $ratio) {
                                if (isset($rs[$ratio])) {
                                    if (strpos($ratio, "WINLOSS0") !== false) {
                                        $rs[$ratio] = number_format($rs[$ratio], 2);
                                    } else {
                                        $rs[$ratio] = intval($rs[$ratio] * 100) / 100 . "%";
                                    }

                                }
                            }
                            $row0[] = $rs;
                        }

                    }

                    foreach ($ratios as $ratio) {
                        if (isset($total[$ratio])) {
                            if(strpos($ratio,"WINLOSS0") !== false){
                                $total[$ratio] = number_format($total[$ratio],2);
                            } else {
                                $total[$ratio] = intval($total[$ratio] * 100) / 100 . "%";
                            }
                        }
                    }

                    $result0 = 0;

                    foreach ($winKey as $v) {
                        if ($v == "{$layerA}RESULT0") {
                            $result0 = str_replace(",", "", $total[$v]);
                        }
                        if ($total[$v] < 0) {
                            $total[$v] = number_format($total[$v], 1);
                            $total[$v] = "<span class='word_lightpink'>{$total[$v]}</span>";
                        } else {
                            $total[$v] = number_format($total[$v], 1);
                        }
                    }

                    if (count($row0) > 0) {
                        $ary["data"]["array"]["row0"] = $row0;
                    }

                    $ary["data"]["array"]["total"] = $total;
                    if ($total["{$layerA}GOLD0"] == 0 || $result0 == 0) {
                        $profit = 0;
                    } else {
                        $profit = round($result0 / floatval(str_replace(",", "", $total["{$layerA}GOLD0"])) * 100, 2);
                    }

                    $ary["data"]["array"]["view_layer"] = $view_layer;
                    $ary["data"]["array"]["tfoot"]["{$layerA}RTAX_0"] = "{$profit}%";
                    $ary["data"]["array"]["performance"] = [
                        "RESULT" => $rs["{$layerA}RESULT0"] < 0 ? "<span class='word_red'>{$rs["{$layerA}RESULT0"]}</span>" : $rs["{$layerA}RESULT0"],
                        "STOCK" => $total["VGOLD0"],
                        "PROFIT" => $profit
                    ];

                }
            } else {
                switch ($layer){
                    case Constant::MEM:
                        $layer_b = Constant::AG;
                        $layerB = "A";
                        if(isset($_p["aid"])){
                            $ad = $this->dbc->select("SELECT `nid` FROM {$this->rankTable} WHERE `id`={$_p["aid"]} AND `isMaster`=0 AND `nid` LIKE '{$this->sup["nid"]}%'","Row");

                            if($ad){
                                $sub = $this->dbc->select("SELECT `nid`,`id`,`name`,`alias` FROM {$this->memTable} WHERE `nid` LIKE '{$ad["nid"]}_%'");
                                if($smn === false){
                                    $d = $sub;
                                }else{
                                    $d = [];
                                    foreach ($sub as $v){
                                        $nid = $this->get_manger_acc_nid(Constant::MEM,$v["nid"]);
                                        if(in_array($nid,$smn_nid)){
                                            $d[] = $v;
                                        }
                                    }
                                }

                                $nameAry = array_column($d, "name");
                                $url = "";
                                switch ($this->login_layer){
                                    case Constant::ADS:
                                    case Constant::AD:
                                        $log .= "-公司[{$_p["ad_user"]}]";
                                        $url .= "&adid={$_p["adid"]}&ad_user={$_p["ad_user"]}";
                                        $ary["data"]["head"]["AD_USER"] = $_p["ad_user"];
                                        $ary["data"]["head"]["AD_DISPLAY"] = "";
                                    case Constant::D0:
                                        $log .= "-分公司[{$_p["d0_user"]}]";
                                        $url .= "&did={$_p["did"]}&d0_user={$_p["d0_user"]}";
                                        $ary["data"]["head"]["D0_USER"] = $_p["d0_user"];
                                        $ary["data"]["head"]["D0_DISPLAY"] = "";
                                    case Constant::CO:
                                        $log .= "-股东[{$_p["co_user"]}]";
                                        $url .= "&cid={$_p["cid"]}&co_user={$_p["co_user"]}";
                                        $ary["data"]["head"]["CO_USER"] = $_p["co_user"];
                                        $ary["data"]["head"]["CO_DISPLAY"] = "";
                                    case Constant::SU:
                                        $log .= "-总代理[{$_p["su_user"]}]";
                                        $url .= "&sid={$_p["sid"]}&su_user={$_p["su_user"]}";
                                        $ary["data"]["head"]["SU_USER"] = $_p["su_user"];
                                        $ary["data"]["head"]["SU_DISPLAY"] = "";
                                    case Constant::AG:
                                        $log .= "-代理商[{$_p["ag_user"]}]-会员";
                                        $url .= "&aid={$_p["aid"]}&ag_user={$_p["ag_user"]}";
                                        $ary["data"]["head"]["AG_USER"] = $_p["ag_user"];
                                        $ary["data"]["head"]["AG_DISPLAY"] = "";

                                        break;
                                }
                                $url = ltrim($url,"&");

                                //注单查询
                                $total = [
                                    "WCOUNT0" => 0,
                                    "GOLD0" => 0,
                                    "VGOLD0" => 0,
                                    "WINGOLD_MCY0" => 0,
                                    "WINGOLD0" => 0,
                                    "ARESULT0" => 0,
                                ];
                                $winKey = ["GOLD0","VGOLD0","WINGOLD0","ARESULT0","WINGOLD_MCY0"];


                                //$sql = "SELECT {$v["id"]} AS `ID0`,'{$v["name"]}' AS `NAME0`,'{$v["alias"]}' AS `ALIAS0`,'aid={$v["id"]}&ad_user={$v["name"]}&report_date={$start}&report_daily={$end}' AS `ACTION0`";
                                //,'{$v["id"]}' AS `AID0`
                                $sql= "SELECT COUNT(`ID`) AS `WCOUNT0`,`m_name` AS `NAME0`,`currency`,`pay_type`";
                                $sql.= ",ROUND(SUM(`bet_golds`),2) AS `GOLD0`";
                                $sql.= ",ROUND(SUM(`valid_gold`),2) AS `VGOLD0`";
                                $sql.= ",ROUND(SUM(`mem_result`),2) AS `WINGOLD0`";
                                $sql.= ",ROUND(SUM(`agent_result`),2) AS `AWINGOLD0`";
                                $sql.= ",ROUND(SUM(`ag_point`/100)/COUNT(`ID`),2) AS `WINLOSS0`";//占成百分比
                                $sql.= ",ROUND(SUM(`ag_result`),2) AS `ARESULT0`";//结果


                                $ww = str_replace($this->sup["nid"],$ad["nid"],$where);
                                $sql.= " FROM {$this->betTable} WHERE {$ww} GROUP BY `m_name`";

                                $rows = $this->dbc->select($sql);
                                if($rows){
                                    foreach ($rows as $key => $rs) {
                                        if(!isset($nameAry) || (isset($nameAry) && in_array($rs["NAME0"],$nameAry))) {
                                            $rs["WINGOLD_MCY0"] = $rs["WINGOLD0"] * $currencys[$this->langx][$rs["currency"]]["value"];
                                            foreach ($total as $kk => $vv) {
                                                $total[$kk] += $rs[$kk];
                                                if (in_array($kk, $winKey)) {
                                                    if ($rs[$kk] < 0) {
                                                        $rs[$kk] = number_format($rs[$kk], 1);
                                                        $rs[$kk] = "<span class='word_red'>{$rs[$kk]}</span>";
                                                    } else {
                                                        $rs[$kk] = number_format($rs[$kk], 1);
                                                    }
                                                }


                                            }

                                            $k = 0;
                                            if (isset($nameAry)) {
                                                $k = array_search($rs["NAME0"], $nameAry);
                                            }

                                            $names = $d[$k];
                                            $rs["ID0"] = $names["id"];
                                            $rs["MEMBER_CODE0"] = "(" . $currencys[$this->langx][$rs["currency"]]["name"] . ")";
                                            $rs["ALIAS0"] = $names["alias"];
                                            $rs["AGOLD_S0"] = "";
                                            $rs["ACTION0"] = $url . "&mid={$names["id"]}&{$layer}_user={$names["name"]}&report_date={$start}&report_daily={$end}&pay_type={$rs["pay_type"]}";
                                            $rs["LIST_NUM0"] = $key;
                                            $row0[] = $rs;
                                        }
                                    }


                                    foreach ($winKey as $v){

                                        if($total[$v]<0){
                                            $total[$v] = number_format($total[$v],1);
                                            $total[$v] = "<span class='word_lightpink'>{$total[$v]}</span>";
                                        }else{
                                            $total[$v] = number_format($total[$v],1);
                                        }
                                    }

                                    if(count($row0)>0){
                                        $ary["data"]["array"]["row0"]  = $row0;
                                    }
                                    $ary["data"]["array"]["total"] = $total;
                                    $ary["data"]["array"]["view_layer"] = "list_bet";

                                }
                            }
                        }
                        break;
                    case "list_bet":
                        $ary = [
                            "status" => 200,
                            "msg" => "",
                            "code" => "report_list",
                            "data" => [
                                "array"=>[
                                    "row0"=>[],
                                    "total"=>[],
                                    "display"=>[
                                        "LIST_CREDIT"=>"none",
                                        "LIST_NODATA"=>"",
                                        "LIST_CLOSEDATA"=>"none"
                                    ],
                                    "enable"=>[
                                        "COSU_ENABLE"=>"none"
                                    ]
                                ],
                                "MEMBER"=>"",
                                "head"=>[],
                                "RESULT_NAME"=>$result_name,
                                "SUB_DATE_START"=>$start,
                                "SUB_DATE_END"=>$end,
                                "gtype"=>$gtype,
                                "wtype"=>$wtype,
                                "filename"=>null
                            ],
                        ];

                        if(isset($_p["mid"])){
                            $ary["data"]["MEMBER"] = $_p["mem_user"];
                            switch ($this->login_layer){
                                case Constant::ADS:
                                case Constant::AD:
                                    $log .= "-公司[{$_p["ad_user"]}]";
                                    //$url .= "&adid={$_p["adid"]}&ad_user={$_p["ad_user"]}";
                                    $ary["data"]["head"]["AD_USER"] = $_p["ad_user"];
                                    $ary["data"]["head"]["AD_DISPLAY"] = "";
                                case Constant::D0:
                                    $log .= "-分公司[{$_p["d0_user"]}]";
                                    //$url .= "&did={$_p["did"]}&d0_user={$_p["d0_user"]}";
                                    $ary["data"]["head"]["D0_USER"] = $_p["d0_user"];
                                    $ary["data"]["head"]["D0_DISPLAY"] = "";
                                case Constant::CO:
                                    $log .= "-股东[{$_p["co_user"]}]";
                                    //$url .= "&cid={$_p["cid"]}&co_user={$_p["co_user"]}";
                                    $ary["data"]["head"]["CO_USER"] = $_p["co_user"];
                                    $ary["data"]["head"]["CO_DISPLAY"] = "";
                                case Constant::SU:
                                    $log .= "-总代理[{$_p["su_user"]}]-代理商";
                                    //$url .= "&sid={$_p["sid"]}&su_user={$_p["su_user"]}";
                                    $ary["data"]["head"]["SU_USER"] = $_p["su_user"];
                                    $ary["data"]["head"]["SU_DISPLAY"] = "";
                                case Constant::AG:
                                    $log .= "-代理商[{$_p["ag_user"]}]";
                                    //$url .= "&aid={$_p["sid"]}&ag_user={$_p["ag_user"]}";
                                    $ary["data"]["head"]["AG_USER"] = $_p["ag_user"];
                                    $ary["data"]["head"]["AG_DISPLAY"] = "";

                                    $log .= "-会员[{$_p["mem_user"]}]";
                                    //$url .= "&mid={$_p["sid"]}&mem_user={$_p["mem_user"]}";
                                    $ary["data"]["head"]["MEM_USER"] = $_p["mem_user"];
                                    $ary["data"]["head"]["MEM_DISPLAY"] = "";
                                    break;
                            }

                            //注单查询
                            $where.= " AND `m_name`='{$_p["mem_user"]}'";
                            $mem = $this->dbc->select("SELECT * FROM {$this->memTable} WHERE `id`={$_p["mid"]}","Row");
                            $bl = $this->report_list_bet($mem,$where);
                            if(count($bl["row0"])>0){
                                $ary["data"]["array"]["row0"]  = $bl["row0"];
                            }
                            $ary["data"]["array"]["total"] = $bl["total"];
                        }
                        break;
                }
            }
        }


        $this->insertLog($log."[查看]");
        return $ary;

    }


    /**
     * 报表注单数据
     */
    public function report_list_bet($mem,$where){
        global $ls_ag_ary,$ls_game_ary,$artjson,$bet_status,$ls_account_ary,$bet_result,$bet_p3_wtype,$result_status;
        $ary = [];
        $bet = $this->dbc->select("SELECT * FROM {$this->betTable} WHERE {$where} ORDER BY `datetime` DESC");
        if(!$bet){ return $ary;}
        $total = [];
        $total["WCOUNT"] = count($bet);
        $total["GOLD"] = 0;
        $total["WIN_GOLD"] = 0;
        $total["AG_WIN_GOLD"] = 0;
        $edit_bet_layer = $this->edit_bet_layer();
        $total["HEADER"] = $edit_bet_layer["td_head"];
        $ut = new Util_game();
        $bs = new Bet($this->param);
        foreach ($bet as $k => $v){
            $p_wtype = "";
            $isResult = "N";
            if($v["isResult"]==1){
                $isResult = "Y";
            }

            //print_r($xml);exit;
            $total["GOLD"]+= $v["bet_golds"];
            $total["WIN_GOLD"]+= $v["mem_result"];
            $total["AG_WIN_GOLD"]+= $v["agent_result"];
            $arr = [];
            $td_content = "";
            $style = "style='display: inline-block;padding: 6px 0px;font-size: 14px;margin: 0 2px;cursor:pointer'";
            if(count($edit_bet_layer["td_content"])>0){
                $arr["BETTIME"] = date("Y-m-d H:i:s",$v["bet_time"]);
                $arr["WTYPE"] = $v["wtype"];
                $arr["GTYPE"] = $v["gtype"];
                $arr["RTYPE"] = $v["rtype"];
                foreach ($edit_bet_layer["td_content"] as $tk => $tv){
                    $str_tk = "<a id='{$tk}_{$v["ID"]}' class='word_red word_bold500' {$style}>{$tv}</a> / ";
                    switch ($tk){
                        case "manage"://注单处理
                            $select = "<select id=\"manage_{$v["ID"]}\" class='word_blue word_bold500 txtc' style='border: 0px;margin: 2px 2px 0px 2px;padding: 6px 0px;BACKGROUND-COLOR: transparent;'>";
                            foreach ($result_status[$this->langx] as $kk => $vv){
                                $selected = "";
                                if($kk == $v["status"]){
                                    $selected = "selected";
                                }
                                if($kk == 0){
                                    $value = "正常注单";
                                    switch ($this->langx){
                                        case "zh-tw":
                                            $value = "正常註單";
                                            break;
                                        case "en-us":
                                            $value = "Normal";
                                            break;
                                    }
                                    $select.= "<option style='color: #000000' value =\"{$kk}\" {$selected}>{$value}</option>";
                                }else{
                                    $select.= "<option style='color: #000000' value =\"{$kk}\" {$selected}>{$vv}</option>";
                                }

                            }
                            $select.= "</select>";
                            $td_content = rtrim($td_content," / ");
                            $td_content.="<br>";
                            $td_content.=$select;
                            break;
                        case "swap"://对调
                            if(count($ut->get_wtype_swap($v["wtype"],$v["rtype"],$v["gtype"]))>0){//允许对调
                                $td_content.= $str_tk;
                            }
                            break;
                        case "hidden"://隐藏/显示
                            if($v["hidden"]==1){
                                $td_content.= "<a id='{$tk}_{$v["ID"]}' class='word_red word_bold500' {$style}>显示</a> / ";
                            }else{
                                $td_content.= $str_tk;
                            }
                            break;

                        default:
                            $td_content.= $str_tk;
                            break;
                    }

                }
            }
            $arr["TD_CONTENT"] = rtrim($td_content," / ");
            $arr["ID"] = $v["ID"];
            $arr["GOLD1"] = number_format($v["bet_golds"], 1);

            $arr["DATETIME"] = date("Y-m-d H:i:s",$v["bet_time"]);
            $arr["DATE"] = date("m-d-Y",$v["bet_time"]);
            $arr["TIME"] = date("H:i:s",$v["bet_time"]);
            $arr["WAGERS_ID"] = substr($v["ticket_id"],2);
            $arr["SRV_IP"] = $v["bet_ip"];
            $arr["NAME0"] = $v["m_name"];
            $arr["M_TYPE"] = $v["ltype"];
            $arr["ALIAS0"] = $mem["alias"];

            $arr["G_TIME"] = date("m-d-Y H:i:s",$v["datetime"]);
            $arr["GOLD"] = number_format($v["bet_golds"],1);


            $arr["ODDF_TYPE"] = $ls_ag_ary["oddf_".$v["odd_f_type"]];
            $arr["TID"] = $arr["WAGERS_ID"];
            $arr["GT"] = $ls_ag_ary["str_{$v["gtype"]}"];
            $arr["FS_DIS"] = "";
            if($v["wtype"]=="FS" || $v["wtype"]=="SP"){
                $arr["FS_DIS"] = "hide_item";
            }
            $arr["DIS_GT"] = "hide_item";
            $arr["test"] = "";

            $arr["RESULT_WL"] = "";
            $arr["RESULT_WL_CLASS"] = "";
            $arr["RESULT_DATA"] = null;
            $arr["SETTLED"] = $v["isResult"]==1 ? "Y" : "N";
            $arr["BALL_ACT"] = "";
            $arr["K_WIN_GOLD"] = number_format($v["win_gold"],1);
            $arr["WIN_GOLD_CLASS"] = "word_red";
            $arr["WIN_GOLD"] = "未结算";

            $arr["CANCEL_MSG"] = "";
            $arr["CANCEL_APN"] = "";
            $arr["CANCEL_DIS"] = "style='display:none'";

            if($v["wtype"] == "P3"){
                if($v["status"] == 0 && $v["cancel"]==0) {//注单有效
                    $p3 = $this->dbc->select("SELECT * FROM {$this->betTable_p3} WHERE `p3id`={$v["ID"]}");
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
                            if(count($edit_bet_layer["td_content"])>0) {
                                $ary3["WTYPE"] = $v3["wtype"];
                                $ary3["GTYPE"] = $v3["gtype"];
                                $ary3["RTYPE"] = $v3["rtype"];
                                $ary3["ID"] = $v3["ID"];
                            }

                            $ary3["WAGERS_TYPE"] = $wagers_type;
                            $ary3["LEAGUE"] = $league;
                            $ary3["G_TIME"] = date("m-d-Y H:i:s", $v3["datetime"]);
                            $ary3["NUM_H"] = $v3["gnum_h"];
                            $ary3["NUM_C"] = $v3["gnum_c"];
                            $ary3["TEAM_H"] = $team_h;
                            $ary3["TEAM_C"] = $team_c;
                            $ary3["ORDER_TYPE"] = $result;
                            $ary3["test"] = $result;
                            $ary3["ORDER_CON"] = $spread;
                            $ary3["CON"] = $CON;
                            $ary3["IORATIO"] = $ioratio;
                            $ary3["STRONG"] = $strong;
                            $ary3["SCORE"] = $score;
                            $ary3["DIF_SCORE"] = "";
                            $ary3["DATE"] = date("m-d", strtotime($v3["m_date"]));
                            $ary3["RESULT_WL"] = "注单平局<br>(全场 :   )";
                            $ary3["BET_TYPE"] = $v3["chose_team"];
                            if ($v3["status"] == 0 && $v3["cancel"] == 0) {//注单有效
                                if ($v3["isResult"] == 1) {
                                    $result_data = str_replace($ls_game_ary["showtype_live"], "", getXmlNode($xml, "result_data"));
                                    $ary3["GAME_SCORE"] = "({$result_data})";
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
                        $arr["TNAME"] = "<li class=\"word_bold\">{$arr["IS_P"]} {$cou} {$artjson["ART_today_in"]} 1</li>";
                        if ($isRB == "Y") {
                            $arr["BALL_ACT"] = "<font class=\"word_green txtBold\">{$ls_account_ary["today_wagers_A"]}</font>";
                        }
                        $arr["WIN_GOLD"] = number_format($v["mem_result"], 1);
                        $arr["RESULT_WL"] = "{$bet_result[$v["result"]]}";
                        switch ($v["result"]){
                            case "L":
                            case "HL":
                                $arr["WIN_GOLD_CLASS"] = $arr["RESULT_WL_CLASS"] = "word_red";
                                break;
                            case "W":
                            case "HW":
                                $arr["WIN_GOLD_CLASS"] = $arr["RESULT_WL_CLASS"] = "word_green";
                                break;
                            default:
                                $arr["WIN_GOLD_CLASS"] =  $arr["RESULT_WL_CLASS"] = "";
                                break;
                        }
                    }
                } else {
                    $arr["CANCEL_MSG"] = "<font class=\"word_red txtBold\">{$bet_status[$v["status"]]}</font>";
                    $arr["CANCEL_APN"] = "";
                    $arr["CANCEL_DIS"] = "style='display:none'";
                    $arr["WIN_GOLD"] = $bet_status[$v["status"]];
                    $arr["WIN_GOLD_CLASS"] = "word_red";
                    $arr["GOLD"] = "<s>{$arr["GOLD"]}</s>";
                }
                //$arr["FROM"] = "totalbet_parlay";
            } else {
                $xml = $bs->get_bet_wagers($v,$isResult,'',"Y");
                $wagers_type = getXmlNode($xml,"wtype");
                $league = getXmlNode($xml,"league");
                $team_h = getXmlNode($xml,"team_h_show");
                $team_c = getXmlNode($xml,"team_c_show");
                $team_h_ratio = getXmlNode($xml,"team_h_ratio");
                $team_c_ratio = getXmlNode($xml,"team_c_ratio");
                $score = getXmlNode($xml,"score");
                $ioratio = getXmlNode($xml,"ioratio");
                $result = getXmlNode($xml,"result");
                $spread = "";
                if($ut->checkWtypeIsOU($v["wtype"]) || $v["wtype"] == "W3"){//大小、3项让球
                    $result = getXmlNode($xml,"rtype_name");
                    $spread = getXmlNode($xml,"spread_name");
                }
                $arr["WAGERS_TYPE"] = $wagers_type;
                $tname = "<li>{$league}</li>";
                if ($v["wtype"] != "FS") {
                    $tname .= "<li>{$team_h} ";
                    if (!empty($team_h_ratio) || is_numeric($team_h_ratio)) {
                        $tname .= "<tt class=\"word_red\">{$team_h_ratio}</tt> ";
                    }
                    $tname .= "v  {$team_c} ";
                    if (!empty($team_c_ratio) || is_numeric($team_c_ratio)) {
                        $tname .= "<tt class=\"word_red\">{$team_c_ratio}</tt>";
                    }

                    $tname .= "<tt class=\"word_green\"></tt>";
                    $tname .= "<tt class=\"word_blue\">{$score}</tt>";
                    $tname .= "</li>";
                }

                $tname .= "<li class=\"re_betdetail_liBold\">{$result} ";
                $tname .= "<tt class=\"word_red\">{$spread}</tt> ";
                $tname .= "@ <tt class=\"word_red\">{$ioratio}</tt>";
                $tname .= "</li>";
                $tname .= "<li class=\"re_betdetail_liMini\">{$wagers_type}</li>";
                $arr["TNAME"] = $tname;
                $arr["TNAME_P"] = [];
                $arr["IS_P"] = "";


                if($v["status"] == 0 && $v["cancel"]==0) {//注单有效
                    if($v["isResult"]==1){
                        $arr["WIN_GOLD"] = number_format($v["mem_result"],1);
                        $result_data = str_replace($ls_game_ary["showtype_live"],"",getXmlNode($xml,"result_data"));
                        $arr["RESULT_WL"] = "{$bet_result[$v["result"]]}<br>{$result_data}";
                        switch ($v["result"]){
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

                    }

                }else{
                    $arr["CANCEL_MSG"] = "<font class=\"word_red txtBold\">{$bet_status[$v["status"]]}</font>";
                    $arr["CANCEL_APN"] = "";
                    $arr["CANCEL_DIS"] = "style='display:none'";
                    $arr["WIN_GOLD"] = $bet_status[$v["status"]];
                    $arr["WIN_GOLD_CLASS"] = "word_red";
                    $arr["GOLD"] = "<s>{$arr["GOLD"]}</s>";
                }

                switch ($v["danger"]){
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
                if($v["strong"] == "H"){
                    if($v["chose_team"]=="H"){
                        $strong = "Y";
                    }else{
                        $strong = "N";
                    }
                }else{
                    if($v["chose_team"]=="C"){
                        $strong = "Y";
                    }else{
                        $strong = "N";
                    }
                }
                $arr["STRONG"] = $strong;

                $CON = "";
                if(!empty($team_h_ratio) || is_numeric($team_h_ratio)){
                    $CON = $team_h_ratio;
                }else if(!empty($team_c_ratio) || is_numeric($team_c_ratio)){
                    $CON = $team_c_ratio;
                }
            }

            $arr["LEAGUE"] = $league;
            $arr["TEAM_H"] = $team_h;
            $arr["TEAM_C"] = $team_c;
            $arr["NUM_H"] = $v["gnum_h"];
            $arr["NUM_C"] = $v["gnum_c"];
            $arr["IORATIO"] = $ioratio;
            $arr["CON"] = $CON;
            $arr["SCORE"] = $score;
            $arr["DIF_SCORE"] = "";
            $arr["ORDER_TYPE"] = $result;
            $arr["ORDER_CON"] = $spread;


            $arr["BET_TYPE"] = $v["chose_team"];
            $arr["IN_RADIO"] = $v["mem_turn_rate"];
            $arr["ARESULT"] = $v["ag_point"];
            $arr["LIST_PMSG"] = "none";
            $arr["LIST_NUM0"] = $k;
            switch ($this->login_layer){
                case Constant::ADS:
                case Constant::AD:
                    $arr["ADRESULT"] = 100-$v["d0_point"]-$v["co_point"]-$v["su_point"]-$v["ag_point"];
                case Constant::D0:
                    $arr["D0RESULT"] = $v["d0_point"];
                case Constant::CO:
                    $arr["CRESULT"] = $v["co_point"];
                case Constant::SU:
                    $arr["SRESULT"] = $v["su_point"];
                    break;
            }

            $ary[] = $arr;
        }
        $total["GOLD"] = number_format($total["GOLD"],1);
        if($total["WIN_GOLD"]<0){
            $total["WIN_GOLD"] = number_format($total["WIN_GOLD"],1);
            $total["WIN_GOLD"] = "<span class='word_lightpink'>{$total["WIN_GOLD"]}</span>";
        }else if($total["WIN_GOLD"]>0){
            $total["WIN_GOLD"] = number_format($total["WIN_GOLD"],1);
            $total["WIN_GOLD"] = "<span class='word_lightgreen'>{$total["WIN_GOLD"]}</span>";
        }else{
            $total["WIN_GOLD"] = number_format($total["WIN_GOLD"], 1);
        }

        if($total["AG_WIN_GOLD"]<0){
            $total["AG_WIN_GOLD"] = number_format($total["AG_WIN_GOLD"],1);
            $total["AG_WIN_GOLD"] = "<span class='word_lightpink'>{$total["AG_WIN_GOLD"]}</span>";
        }elseif($total["AG_WIN_GOLD"]>0){
            $total["AG_WIN_GOLD"] = number_format($total["AG_WIN_GOLD"],1);
            $total["AG_WIN_GOLD"] = "<span class='word_lightgreen'>{$total["AG_WIN_GOLD"]}</span>";
        }else{
            $total["AG_WIN_GOLD"] = number_format($total["AG_WIN_GOLD"],1);
        }
        return ["row0"=>$ary,"total"=>$total];
    }
}