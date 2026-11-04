<?php


class Performance extends Base
{
    private $table;
    private $adTable;
    private $rankTable;
    private $memTable;

    public function __construct($_p = [])
    {
        parent::__construct($_p);
        $this->table = Constant::T_BET;
        $this->adTable = Constant::T_ADMIN;
        $this->rankTable = Constant::T_RANK;
        $this->memTable = Constant::T_MEMBER;
    }
    public function getTopData($userArr){

        $user = $userArr["user"];//子账号资料
        $sup =  $userArr["sup"];//主账号资料



        $between = date_between('yes');
        $start = $between["start"];
        $end = $between["end"];

        //查询过关
        $where1 = " AND (`M_Date` BETWEEN '{$start}' AND '{$end}')";
        $data = null;
        $statusname = false;
        $bet_table = Constant::T_BET;
        $mem_table = Constant::T_MEMBER;
        $acc_1_loss = $this->dbc->select("select sum(bet_golds) as gold_d,count(1) as amount,SUM(mem_result) as val,m.id as mid,m.loginname as username,m.alias From {$bet_table} b,{$mem_table} m where b.m_name=m.name  {$where1}  AND m.nid LIKE '{$sup["nid"]}%' and mem_result<0 GROUP BY b.m_name ",'All');
        if(!empty($acc_1_loss)){
            $statusname = true;
            $data['loss'] = $acc_1_loss;
        }

        $acc_1_win = $this->dbc->select("select sum(bet_golds) as gold_d,count(1) as amount,SUM(mem_result) as val,m.id as mid,m.loginname as username,m.alias From {$bet_table} b,{$mem_table} m where b.m_name=m.name  {$where1}  AND m.nid LIKE '{$sup["nid"]}%' and mem_result>=0 GROUP BY b.m_name ");
        if(!empty($acc_1_win)){
            $statusname = true;
            $data['win'] = $acc_1_win;
        }
        $types_1= ['status' => $statusname, 'date' => $start.'|'.$end, 'data' => $data];


        $between = date_between('tw');
        $start = $between["start"];
        $end = $between["end"];

        //查询过关
        $where1 = " AND (`M_Date` BETWEEN '{$start}' AND '{$end}')";

        $data = null;
        $statusname = false;
        $acc_2_loss = $this->dbc->select("select sum(bet_golds) as gold_d,count(1) as amount,SUM(mem_result) as val,m.id as mid,m.loginname as username,m.alias From {$bet_table} b,{$mem_table} m where b.m_name=m.name  {$where1}  AND m.nid LIKE '{$sup["nid"]}%' and mem_result<0 GROUP BY b.m_name ");

        if(!empty($acc_2_loss)){
            $statusname = true;
            $data['loss'] = $acc_2_loss;
        }
        $acc_2_win = $this->dbc->select("select sum(bet_golds) as gold_d,count(1) as amount,SUM(mem_result) as val,m.id as mid,m.loginname as username,m.alias From {$bet_table} b,{$mem_table} m where b.m_name=m.name  {$where1}  AND m.nid LIKE '{$sup["nid"]}%' and mem_result>=0 GROUP BY b.m_name ");
        if(!empty($acc_2_win)){
            $statusname = true;
            $data['win'] = $acc_2_win;
        }
        $types_2= ['status' => $statusname, 'date' => $start.'|'.$end, 'data' => $data];


        $between = date_between('lw');
        $start = $between["start"];
        $end = $between["end"];

        //查询过关
        $where1 = " AND (`M_Date` BETWEEN '{$start}' AND '{$end}')";
        $data = null;
        $statusname = false;
        $acc_3_loss = $this->dbc->select("select sum(bet_golds) as gold_d,count(1) as amount,SUM(mem_result) as val,m.id as mid,m.loginname as username,m.alias From {$bet_table} b,{$mem_table} m where b.m_name=m.name  {$where1}  AND m.nid LIKE '{$sup["nid"]}%' and mem_result<0 GROUP BY b.m_name ");
        if(!empty($acc_3_loss)){
            $statusname = true;
            $data['loss'] = $acc_3_loss;
        }
        $acc_3_win = $this->dbc->select("select sum(bet_golds) as gold_d,count(1) as amount,SUM(mem_result) as val,m.id as mid,m.loginname as username,m.alias From {$bet_table} b,{$mem_table} m where b.m_name=m.name  {$where1}  AND m.nid LIKE '{$sup["nid"]}%' and mem_result>=0 GROUP BY b.m_name ");
        if(!empty($acc_3_win)){
            $statusname = true;
            $data['win'] = $acc_3_win;
        }
        $types_3= ['status' => $statusname, 'date' => $start.'|'.$end, 'data' => $data];

        $outData = ['types_1'=>$types_1,'types_2'=>$types_2,'types_3'=>$types_3];
        return ['status' => 200,'outData'=>$outData];
    }
    public function getPerformance($userArr){
        global $week;
        $user = $userArr["user"];//子账号资料
        $sup =  $userArr["sup"];//主账号资料
        $sTable = $this->memTable;
        $wlevel = "";
        $where = "`hidden`=0";
        $point = "";//占成
        if(!empty($user)) {
            switch ($this->login_layer) {
                case Constant::ADS:
                    $sTable = $this->adTable;
                    $wlevel = " AND `level`=1";//子账号查询下级
                    break;
                case Constant::AD:
                    $sTable = $this->rankTable;
                    $wlevel = " AND `level`=4";
                    break;
                case Constant::D0:
                    $sTable = $this->rankTable;
                    $wlevel = " AND `level`=3";

                    $point = "`d0_point`";
                    break;
                case Constant::CO:
                    $sTable = $this->rankTable;
                    $wlevel = " AND `level`=2";

                    $point = "`co_point`";
                    break;
                case Constant::SU:
                    $sTable = $this->rankTable;
                    $wlevel = " AND `level`=1";

                    $point = "`su_point`";
                    break;
                case Constant::AG:
                    $sTable = $this->memTable;
                    $point = "`ag_point`";
                    break;
            }
        }

        if(!empty($this->param["isResult"])){//是否结算
            $isResult = $this->param["isResult"]=="Y" ? 1 : 0;
            $where .= " AND `isResult`={$isResult}";
        }

        if(!empty($this->param["gtype"])) {//球类型
            $where .= " AND `gtype`='{$this->param["gtype"]}'";
        }

        if(!empty($this->param["wtype"])){
            $where .= " AND `wtype`='{$this->param["wtype"]}'";
        }

        if(!empty($this->param["report_kind"])){ //报告类型 D:取消单,D4:非正常投注,A:正常注单
            switch ($this->param["report_kind"]){
                case "D":
                    $where .= " AND `status`>1";
                    break;
                case "D4":
                    $where .= " AND `status`=1";
                    break;
                case "A":
                    $where .= " AND `status`=0";
                    break;
            }
        }
        $where .=  " AND `nid` LIKE '{$user["nid"]}_%'";
        
        if(isset($this->param["date_start"]) && isset($this->param["date_end"])){
            $start = $this->param["date_start"];
            $end = $this->param["date_end"];
        }else{
            $date = empty($this->param["date"]) ? "" : $this->param["date"];
            $between = date_between($date);
            $start = $between["start"];
            $end = $between["end"];
        }

        //查询过关
        $where1 = "(`M_Date` BETWEEN '{$start}' AND '{$end}') AND ".$where;

        $show_date = false;
        $last_start = date("Y-m-d",strtotime($end)-24*60*60);
        $last_end = date("Y-m-d",strtotime($start)-24*60*60);
        $last_where = $where;
        if($date == "yes"){
            $show_date = true;
            $last_where = "(`M_Date` BETWEEN '{$last_start}' AND '{$last_end}') AND ".$where;
        }

        $para = [];
        switch ($this->param["p"]){
            case "get_performance"://概况
                switch ($this->param["code"]){
                    case "overview"://绩效概况
                        $para = [
                            "status" => "200",
                            "result" => "0",
                            "profit" => "0",
                            "stock" => "0",
                            "date" => $date,
                            "date_end" => date("Y-m-d",strtotime($end)),
                            "date_start" => date("Y-m-d",strtotime($start)),

                        ];

                        if($show_date == true){
                            $para["show_last"] = [
                                "last_date_start" => date("Y-m-d",strtotime($end)-24*60*60),
                                "last_date_end"=> date("Y-m-d",strtotime($start)-24*60*60),
                                "show_compare_result"=> $show_date,
                                "compare_result"=> "0",
                                "class_result" => "increase",//decrease
                                "show_compare_stock" => $show_date,
                                "compare_stock"=> "0",
                                "class_stock"=> "increase",
                                "show_compare_profit" => $show_date,
                                "compare_profit" => "0",
                                "class_profit" => "increase"
                            ];
                        }
                        if($user["isMaster"] == 1 && !empty($user["manager_uid"])){//子账号
                            $ids = explode(",",$user["manager_uid"]);
                            if(count($ids)==1){
                                $in = "`id`={$user["manager_uid"]}";
                            }else{
                                $in = "`id` IN ({$user["manager_uid"]})";
                            }
                            $acc = $this->dbc->select("SELECT `nid` FROM {$sTable} WHERE {$in} AND `nid` LIKE '{$sup["nid"]}%' {$wlevel}");

                            if(!$acc){
                                $para["result"] = "0";
                                $para["profit"] = "0";
                                $para["stock"] = "0";
                            }else{
                                $result = 0;
                                $stock = 0;
                                $last_result = 0;
                                $last_stock = 0;
                                foreach ($acc as $a){
                                    $ary = $this->get_overview(str_replace($user["nid"]."_",$a["nid"],$where1),$point);
                                    $result+= $ary["result"];
                                    $stock+= $ary["stock"];
                                    if($show_date == true){
                                        $ary = $this->get_overview(str_replace($user["nid"]."_",$a["nid"],$last_where),$point);
                                        $last_result+= $ary["result"];
                                        $last_stock+= $ary["stock"];
                                    }
                                }
                                if($stock == 0){
                                    $para["result"] = "0";
                                    $para["profit"] = "0";
                                    $para["stock"] = "0";
                                }else{
                                    $para["result"] = number_format($result,1);
                                    $para["profit"] = number_format($result/$stock,2);
                                    $para["stock"] = number_format($stock,1);
                                }

                                if($show_date==true){
                                    $para["show_last"]["compare_result"] = $para["result"] - number_format($last_result,1);
                                    $para["show_last"]["compare_stock"] = $para["stock"] - number_format($last_stock,1);
                                    if($last_stock == 0){
                                        $para["show_last"]["compare_profit"] = $para["profit"] - 0;
                                    }else{
                                        $para["show_last"]["compare_profit"] = $para["profit"] - number_format($last_result/$last_stock,2);
                                    }
                                    if($para["show_last"]["compare_result"]<0){
                                        $para["show_last"]["class_result"] = "decrease";
                                    }

                                    if($para["show_last"]["compare_stock"]<0){
                                        $para["show_last"]["class_stock"] = "decrease";
                                    }

                                    if($para["show_last"]["compare_profit"]<0){
                                        $para["show_last"]["class_profit"] = "decrease";
                                    }
                                }
                            }
                        }else{
                            $ary = $this->get_overview($where1,$point);
                            if($ary["stock"] == 0){
                                $para["result"] = "0";
                                $para["profit"] = "0";
                                $para["stock"] = "0";
                            }else{
                                $para["result"] = number_format($ary["result"],1);
                                $para["profit"] = number_format($ary["result"]/$ary["stock"],2);
                                $para["stock"] = number_format($ary["stock"],1);
                            }

                            if($show_date == true){
                                $last_ary = $this->get_overview($last_where,$point);
                                $para["show_last"]["compare_result"] = floatval(str_replace(',', '',$para["result"])) - floatval(str_replace(',', '',$last_ary["result"]));
                                $para["show_last"]["compare_stock"] = floatval(str_replace(',', '', $para["stock"])) - floatval(str_replace(',', '',$last_ary["stock"]));//number_format(str_replace(",","",$para["stock"]),1)
                                if($last_ary["stock"] == 0){
                                    $para["show_last"]["compare_profit"] = $para["profit"] - 0;
                                }else{
                                    $para["show_last"]["compare_profit"] = $para["profit"] - number_format($last_ary["result"]/$last_ary["stock"],2);
                                }

                                if($para["show_last"]["compare_result"]<0){
                                    $para["show_last"]["class_result"] = "decrease";
                                }

                                if($para["show_last"]["compare_stock"]<0){
                                    $para["show_last"]["class_stock"] = "decrease";
                                }

                                if($para["show_last"]["compare_profit"]<0){
                                    $para["show_last"]["class_profit"] = "decrease";
                                }
                            }
                        }

                        break;
                    case "possess"://占成收入
                        $para = [
                            "status" => "200",
                            "data" => []
                        ];
                        $date = [];
                        $org_date = [];
                        $value = [];

                        for($i=$start;$i<=$end;){
                            $date[] = date("m月d日",strtotime($i)) ." (星期".$week[date("w",strtotime($i))].")";
                            $org_date[] = $i;
                            $where2 = "`M_Date`='{$i}'  AND ".$where;
                            $value_sum = 0;
                            if(date("Y-m-d",strtotime($i))<date("Y-m-d")) {
                                if ($user["isMaster"] == 1 && !empty($user["manager_uid"])) {//子账号
                                    $ids = explode(",", $user["manager_uid"]);
                                    if (count($ids) == 1) {
                                        $in = "`id`={$user["manager_uid"]}";
                                    } else {
                                        $in = "`id` IN ({$user["manager_uid"]})";
                                    }
                                    $acc = $this->dbc->select("SELECT `nid` FROM {$sTable} WHERE {$in} AND `nid` LIKE '{$sup["nid"]}%' {$wlevel}");
                                    if ($acc) {
                                        foreach ($acc as $a) {
                                            $value_sum += $this->get_possess(str_replace($user["nid"] . "_", $a["nid"], $where2), $point);
                                        }
                                    }
                                } else {
                                    $value_sum = $this->get_possess($where2, $point);
                                }

                                $value[] = sprintf("%.1f", $value_sum);
                            }else{
                                $value[] = "";
                            }

                            $i = date("Y-m-d",strtotime($i)+(24*60*60));
                        }
                        $para["data"] = [
                            "code" => "possess",
                            "date" => $date,
                            "org_date" =>$org_date,
                            "pdate" => $this->param["date"],
                            "value" => $value
                        ];
                        break;
                    case "members":
                        $para = [
                            "status" => "200",
                            "data" => []
                        ];
                        $date = [];
                        $org_date = [];
                        $value = [];
                        $time = msectime();
                        for($i=$start;$i<=$end;){
                            $date[] = date("m月d日",strtotime($i)) ." (星期".$week[date("w",strtotime($i))].")";
                            $org_date[] = $i;
                            $where3 = "`M_Date`='{$i}' AND" .$where;
                            $value_sum = 0;
                            if(date("Y-m-d",strtotime($i))<date("Y-m-d")) {
                                if ($user["isMaster"] == 1 && !empty($user["manager_uid"])) {//子账号
                                    $ids = explode(",", $user["manager_uid"]);
                                    if (count($ids) == 1) {
                                        $in = "`id`={$user["manager_uid"]}";
                                    } else {
                                        $in = "`id` IN ({$user["manager_uid"]})";
                                    }
                                    $acc = $this->dbc->select("SELECT `nid` FROM {$sTable} WHERE {$in} AND `nid` LIKE '{$sup["nid"]}%' {$wlevel}");
                                    if ($acc) {
                                        foreach ($acc as $a) {
                                            $value_sum += $this->get_members(str_replace($user["nid"] . "_", $a["nid"], $where3));
                                        }
                                    }
                                } else {
                                    $value_sum = $this->get_members($where3);
                                }

                                $value[] = sprintf("%.1f", $value_sum);
                            }
                            $value[] = "";
                            $i = date("Y-m-d",strtotime($i)+(24*60*60));
                        }

                        $para["data"] = [
                            "code" => "members",
                            "date" => $date,
                            "org_date" =>$org_date,
                            "pdate" => $this->param["date"],
                            "value" => $value
                        ];
                        break;
                    case "turnover"://实货量
                        $para = [
                            "status" => "200",
                            "data" => []
                        ];
                        $date = [];
                        $org_date = [];
                        $value = [];
                        $start = date("Y-m-d",strtotime($start));
                        $end = date("Y-m-d",strtotime($end));
                        for($i=$start;$i<=$end;){
                            $date[] = date("m月d日",strtotime($i)) ." (星期".$week[date("w",strtotime($i))].")";
                            $org_date[] = $i;
                            $where4 = "`M_Date`='{$i}' AND ".$where;
                            if(date("Y-m-d",strtotime($i))<date("Y-m-d")) {
                                $value_sum = 0;
                                if ($user["isMaster"] == 1 && !empty($user["manager_uid"])) {//子账号
                                    $ids = explode(",", $user["manager_uid"]);
                                    if (count($ids) == 1) {
                                        $in = "`id`={$user["manager_uid"]}";
                                    } else {
                                        $in = "`id` IN ({$user["manager_uid"]})";
                                    }
                                    $acc = $this->dbc->select("SELECT `nid` FROM {$sTable} WHERE {$in} AND `nid` LIKE '{$sup["nid"]}%' {$wlevel}");
                                    if ($acc) {
                                        foreach ($acc as $a) {
                                            $value_sum += $this->get_turnover(str_replace($user["nid"] . "_", $a["nid"], $where4), $point);
                                        }
                                    }
                                } else {
                                    $value_sum = $this->get_turnover($where4, $point);
                                }

                                $value[] = sprintf("%.1f", $value_sum);
                            }else{
                                $value[] = "";
                            }
                            $i = date("Y-m-d",strtotime($i)+(24*60*60));
                        }
                        $para["data"] = [
                            "code" => "turnover",
                            "date" => $date,
                            "org_date" =>$org_date,
                            "pdate" => $this->param["date"],
                            "value" => $value
                        ];
                        break;
                    case "winloss"://赢/输
                        $para = [
                            "status" => "200",
                            "data" => []
                        ];
                        $date = [];
                        $org_date = [];
                        $value = [];
                        for($i=$start;$i<=$end;){
                            $date[] = date("m月d日",strtotime($i)) ." (星期".$week[date("w",strtotime($i))].")";
                            $org_date[] = $i;
                            $where5 = "`M_Date`='{$i}' AND ".$where;

                            if(date("Y-m-d",strtotime($i))<date("Y-m-d")) {
                                $value_sum = 0;
                                if ($user["isMaster"] == 1 && !empty($user["manager_uid"])) {//子账号
                                    $ids = explode(",", $user["manager_uid"]);
                                    if (count($ids) == 1) {
                                        $in = "`id`={$user["manager_uid"]}";
                                    } else {
                                        $in = "`id` IN ({$user["manager_uid"]})";
                                    }
                                    $acc = $this->dbc->select("SELECT `nid` FROM {$sTable} WHERE {$in} AND `nid` LIKE '{$sup["nid"]}%' {$wlevel}");
                                    if ($acc) {
                                        foreach ($acc as $a) {
                                            $value_sum += $this->get_winloss(str_replace($user["nid"] . "_", $a["nid"], $where5), $point);
                                        }
                                    }
                                } else {
                                    $value_sum = $this->get_winloss($where5, $point);
                                }

                                $value[] = sprintf("%.1f", $value_sum);
                            }else{
                                $value[] = "";
                            }
                            $i = date("Y-m-d",strtotime($i)+(24*60*60));
                        }
                        $para["data"] = [
                            "code" => "winloss",
                            "date" => $date,
                            "org_date" =>$org_date,
                            "pdate" => $this->param["date"],
                            "value" => $value
                        ];
                        break;
                }

                break;
        }
        return $para;
    }

    /**
     * 赢/输
     * @param $where
     * @return int|mixed
     */
    public function get_winloss($where,$point=[]){
        $a_result = "`mem_result`";
        if(!empty($point) && ($this->login_layer!=Constant::ADS || $this->login_layer!="AD")){
            $a_result = "`mem_result` * {$point} / 100";
        }
        $sum = 0;
        $sql = "SELECT SUM({$a_result}) AS `result` FROM {$this->table} WHERE {$where}";
        $rs = $this->dbc->select($sql,"Row");
        if($rs && !empty($rs["result"])){
            $sum = $rs["result"];
        }

        return $sum;
    }

    /**
     * 实货量
     * @param $where
     * @return int|mixed
     */
    public function get_turnover($where,$point=[]){
        $a_result = "`valid_gold`";
        if(!empty($point) && ($this->login_layer!=Constant::ADS || $this->login_layer!=Constant::AD)){
            $a_result = "`valid_gold` * {$point} / 100";
        }
        $sum = 0;
        $sql = "SELECT SUM({$a_result}) AS `vgold` FROM {$this->table} WHERE {$where}";//print_r($sql);
        $rs = $this->dbc->select($sql,"Row");
        if($rs && !empty($rs["vgold"])){
            $sum = $rs["vgold"];
        }

        return $sum;
    }

    /**
     * 投注人数
     * @param $where
     * @return int
     */
    public function get_members($where){
        return $this->dbc->getCount($this->table,"`M_Name`","{$where} GROUP BY `M_Name`");
    }

    /**
     * 占成收入
     * @param $where
     * @param array $point
     * @return int|mixed
     */
    public function get_possess($where,$point=[]){
        $a_result = "`agent_result`";
        if(!empty($point) && ($this->login_layer!=Constant::ADS || $this->login_layer!="AD")){
            $a_result = "`agent_result` * {$point} / 100";
        }
        $sum = 0;
        $sql = "SELECT SUM({$a_result}) as `result` FROM {$this->table} WHERE {$where}";
        $rs = $this->dbc->select($sql,'Row');
        if($rs && !empty($rs["result"])){
            $sum = $rs["result"];
        }

        return $sum;
    }

    /**
     * 绩效概况
     * @param $where
     * @return array|int[]
     */
    public function get_overview($where,$point=[]){
        $ary = [
            "result" => 0,//会员输赢
            "stock" => 0,//有效金额
        ];
        $field = "SUM(`mem_result`) AS `result`,SUM(`valid_gold`) as `stock`";
        if(!empty($point) && ($this->login_layer!=Constant::ADS || $this->login_layer!="AD")){
            $field = "SUM(`mem_result` * {$point} / 100) AS `result`,SUM(`valid_gold` * {$point} / 100) as `stock`";
        }
        $rs = $this->dbc->select("SELECT {$field} FROM {$this->table} WHERE {$where}","Row");
        if($rs){
            $ary["result"] = empty($rs["result"]) ? 0 : $rs["result"];
            $ary["stock"] = empty($rs["stock"]) ? 0 : $rs["stock"];
        }

        return $ary;
    }
}