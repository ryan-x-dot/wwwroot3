<?php


class Order extends Base
{
    protected $ls_code;

    protected $ls_account;

    protected $ls;

    protected $table;

    protected $conn;

    protected $betTable;

    public function __construct($_p = [])
    {
        parent::__construct($_p);
        global $ls_ary,$ls_account_ary,$ls_code_ary;
        $this->ls = $ls_ary;
        $this->ls_account = $ls_account_ary;
        $this->ls_code = $ls_code_ary;
        $this->betTable = Constant::T_BET;
        $this->table = Constant::T_MEMBER;
        $connTable = Constant::T_CONFIG;
        $connDefTable = Constant::T_CONFIG_DEFAULT;
        $ad_nid = substr($this->user["nid"],0,32);
        $this->conn = $this->dbc->select("SELECT * FROM {$connTable} WHERE `nid`='{$ad_nid}'","Row");
        if(!$this->conn){
            $this->conn = $this->dbc->select("SELECT * FROM {$connDefTable} LIMIT 1","Row");
        }
    }


    public function order_view($xml){
        //会员参数配置
        $ary = [];

        switch ($this->param["p"]){
            case "FT_order_view":
                preg_match("/\<ioratio>(.*?)\<\/ioratio>/is",$xml,$odds);
                $odd = isset($odds[1]) ? $odds[1] : 0;
                $arr = $this->FT_order_view($odd);
                //$xml = '<game_sc>ddd</game_sc>';
                foreach ($arr as $k => $v){
                    $xml =  preg_replace("/\<{$k}>(.*?)\<\/{$k}>/is","<{$k}>{$v}</{$k}>",$xml);
                }
                break;
            case "Other_order_view":
                preg_match("/\<ioratio>(.*?)\<\/ioratio>/is",$xml,$odds);
                $odd = isset($odds[1]) ? $odds[1] : 0;
                $arr = $this->Other_order_view($odd);
                foreach ($arr as $k => $v){
                    $xml =  preg_replace("/\<{$k}>(.*?)\<\/{$k}>/is","<{$k}>{$v}</{$k}>",$xml);
                }
                break;
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
                    $odd = isset($odds[2]) ? $odds[2] : 0;
                    switch ($ss[1]){
                        case "FT":
                            $arr = $this->FT_order_view($odd);
                            break;
                        default:
                            $arr = $this->Other_order_view($odd);
                            break;
                    }

                    foreach ($arr as $kk=>$vv){
                        $xml = preg_replace("/\<betslip id='{$id}'>(.*?)\<{$kk}>(.*?)\<\/{$kk}>(.*?)\<\/betslip>/is","<betslip id='{$id}'>$1<{$kk}>{$vv}</{$kk}>$3</betslip>",$xml);
                    }

                }
                break;
        }
        return $xml;
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
        switch ($this->param["gtype"]){
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
		    $currentKey = $v["rtype"] ?? (isset($v[""]) ? $v[""] : (isset($v[null]) ? $v[null] : ""));
			if (empty($currentKey) && $currentKey !== 0 && $currentKey !== '0') {
				continue;
			}
            if($v["rtype"]=="FS"){
                $arr[$gtype]["SP"]["max"] = $v["sc"];
                $arr[$gtype]["SP"]["min"] = $v["so"];
            }else{
                $arr[$gtype][$v["rtype"]]["max"] = $v["sc"];
                $arr[$gtype][$v["rtype"]]["min"] = $v["so"];
            }

        }
        $this->insertLog("详细设定页面");
        return $arr;
    }

    /**
     * 足球注单视图
     * @param int $odds
     * @return array
     */
    public function FT_order_view($odds=0){
        global $currencys;
        $arr = [];
        $ltype = ltype_num($this->user["ltype"]);
        $oeAry = ["ODD","EVEN","HODD","HEVEN"];//单双
        $roeAry = ["RODD","REVEN","HRODD","HREVEN"];//滚球单双
        $mAry = [
            "M","HM","AM","BM","CM","DM","EM","FM",
            "RM","HRM","ARM","BRM","CRM","DRM","ERM","FRM",
        ];
        $rAry = [
            "R","HR","AR","BR","CR","DR","ER","FR",
            "OU","HOU","AOU","BOU","COU","DOU","EOU","FOU",
            "EOH","EOC","HEOH","HEOC",
        ];
        $reAry = [
            "RE","HRE","ARE","BRE","CRE","DRE","ERE","FRE",
            "ROU","HROU","AROU","BROU","CROU","DROU","EROU","FROU",
            "REOH","REOC","HREOH","HREOC",
        ];
        $dtAry = ["PD","HPD","TS","HTS","T","HT","SP","F","WM","DC","MQ","CS","WN","MOUA","MOUB","MOUC","MOUD","DUA","DUB","DUC","DUD","OUTA","OUTB","OUTC","OUTD","OUPA","OUPB","OUPC","OUPD","OUEA","OUEB","OUEC","OUED",
            "MOU","MTS","MPG","DU","DS","DG","OUT","OUP","OUE","MTS","RCD","F2G","F3G","HG","MG","OG","FG","SB","T1G","T3G","W3","BH","WE","WB","TK","PA","OT"];
        $rdtAry = ["RPD","HRPD","RTS","HRTS","RT","HRT","RF","RWM","RDC","RMQ","RCS","RWN","RMUA","RMUB","RMUC","RMUD","RDUA","RDUB","RDUC","RDUD","RUTA","RUTB","RUTC","RUTD","RUPA","RUPB","RUPC","RUPD","RUEA","RUEB","RUEC","RUED",
            "RMOU","RMTS","RMPG","RDU","RDS","RDG","ROUT","ROUP","ROUE","RMTS","RT1G","RT3G"];
        $key = "DT_";
        if(in_array($this->param["wtype"],$mAry)){
            $key = "M_";
            $arr["game_sc"] = $this->conn["m_max"];
            $arr["game_so"] = $this->conn["m_min"];
            $odds -= 1;
        }else if(in_array($this->param["wtype"],$rAry) || in_array($this->param["chose_team"],$oeAry)){
            $key = "R_";
            $arr["game_sc"] = $this->conn["r_max"];
            $arr["game_so"] = $this->conn["r_min"];
        }else if(in_array($this->param["wtype"],$reAry) || in_array($this->param["chose_team"],$roeAry)){
            $key = "RE_";
            $arr["game_sc"] = $this->conn["r_max"];
            $arr["game_so"] = $this->conn["r_min"];
        }else if(in_array($this->param["wtype"],$dtAry) && !in_array($this->param["chose_team"],$oeAry)){
            $key = "DT_";
            $arr["game_sc"] = $this->conn["dt_max"];
            $arr["game_so"] = $this->conn["dt_min"];
            if($odds>1){$odds -= 1;}
        }else if(in_array($this->param["wtype"],$rdtAry) && !in_array($this->param["chose_team"],$roeAry)){
            $key = "RDT_";
            $arr["game_sc"] = $this->conn["dt_max"];
            $arr["game_so"] = $this->conn["dt_min"];
            if($odds>1){$odds -= 1;}
        }
        $arr["game_sc"] = floor($arr["game_sc"]/$odds);
        $conn = $this->getConn();
        $con = $conn[$key.$ltype];
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
        return $arr;
    }

    /**
     * 其他球类注单视图
     * @param int $odds
     * @return array
     */
    public function Other_order_view($odds=0){
        global $currencys;
        $arr = [];
        $ltype = ltype_num($this->user["ltype"]);
        $oeAry = ["ODD","EVEN","HODD","HEVEN"];//单双
        $roeAry = ["RODD","REVEN","HRODD","HREVEN"];//滚球单双
        $mAry = [
            "M","RM",
            "RF01","RF02","RF03","RF04","RF05","RF06","RF07","RF08","RF09","RF10"
            ,"RF11","RF12","RF13","RF14","RF15","RF16","RF17","RF18","RF19","RF20"
            ,"RF21","RF22","RF23","RF24","RF25","RF26","RF27","RF28","RF29","RF30"
            ,"RF31","RF32","RF33","RF34","RF35",
            "F01","F02",
            /*网球 -- 开始*/
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
            ,"RFE41","RFE42","RFE43","RFE44","RFE45","RFE46","RFE47","RFE48","RFE49","RFE50",
            /*网球 -- 结束*/
        ];
        $rAry = [
            "R","OU","OUH","OUC",
        ];
        $reAry = [
            "RE","ROU","ROUH","ROUC",
        ];
        $dtAry = ["PD","T","PD3","PD5","PD7","HPD"];
        $rdtAry = ["RPD","RT","RPD3","RPD5","RPD7","HRPD"];
        $key = "DT_";
        if(in_array($this->param["wtype"],$mAry)){
            $key = "M_";
            $arr["game_sc"] = $this->conn["m_max"];
            $arr["game_so"] = $this->conn["m_min"];
            $odds -= 1;
        }else if(in_array($this->param["wtype"],$rAry) || in_array($this->param["chose_team"],$oeAry)){
            $key = "R_";
            $arr["game_sc"] = $this->conn["r_max"];
            $arr["game_so"] = $this->conn["r_min"];
        }else if(in_array($this->param["wtype"],$reAry) || in_array($this->param["chose_team"],$roeAry)){
            $key = "RE_";
            $arr["game_sc"] = $this->conn["r_max"];
            $arr["game_so"] = $this->conn["r_min"];
        }else if(in_array($this->param["wtype"],$dtAry) && !in_array($this->param["chose_team"],$oeAry)){
            $arr["game_sc"] = $this->conn["dt_max"];
            $arr["game_so"] = $this->conn["dt_min"];
            $key = "DT_";
            if($odds>1){$odds -= 1;}
        }else if(in_array($this->param["wtype"],$rdtAry) && !in_array($this->param["chose_team"],$roeAry)){
            $key = "RDT_";
            $arr["game_sc"] = $this->conn["dt_max"];
            $arr["game_so"] = $this->conn["dt_min"];
            if($odds>1){$odds -= 1;}
        }
        $arr["game_sc"] = floor($arr["game_sc"]/$odds);
        $conn = $this->getConn();
        $con = $conn[$key.$ltype];
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
        return $arr;
    }



    public function FT_bet($xml,$_p){
        $arr = $this->bet_check($xml,$_p);
        if($arr["code"]=="555"){
            return $arr;
        }
        $isRB = $_p["isRB"];
        $golds = $this->getXmlNode($xml,"golds");
        $gold_gmax = $this->getXmlNode($xml,"gold_gmax");
        $gold_gmin = $this->getXmlNode($xml,"gold_gmin");
        $mem_sc = $this->getXmlNode($xml,"mem_sc");
        $dates = $this->getXmlNode($xml,"dates");

        //注单入库
        $arr["wtype"] = $this->param["wtype"];
        $arr["rtype"] = $this->param["rtype"];
        $arr["type"] = $this->param["chose_team"];
        $arr["gold"] = $_p["golds"];
        $arr["nowcredit"] -= $_p["golds"];
        $arr["maxcredit"] = $arr["nowcredit"];
        $arr["username"] = $this->user["name"];
        $arr["mtype"] = ltype_num($this->user["ltype"]);
        $arr["mid"] = returnMID($this->user["id"]);
        $arr["timestamp"] = get_timestamp_millisecond();
        $arr["date"] = date("Y-m-d");
        $arr["time"] = date("H:i:s");
        $ftTable = Constant::S_FT;
        $sql = "SELECT `gid`,`lid`,`gidm`,`ecid`,`strong`,`league`,`league_tw`,`league_en`,`team_h`,`team_c`,`team_h_tw`,`team_c_tw`,`team_h_en`,`team_c_en`,`gnum_h`,`gnum_c`,`datetime` FROM  {$ftTable} WHERE `gid`='{$arr["gid"]}'";
        $match = $this->dbs->select($sql,"Row");
        switch ($_p["langx"]){
            case "zh-tw":
                $league = $match["league_tw"];
                $team_c = $match["team_c_tw"];
                $team_h = $match["team_h_tw"];
                break;
            case "en-us":
                $league = $match["league_en"];
                $team_c = $match["team_c_en"];
                $team_h = $match["team_h_en"];
                break;
            default:
                $league = $match["league"];
                $team_c = $match["team_c"];
                $team_h = $match["team_h"];
                break;
        }
        $arr["league"] = $league;
        $arr["team_c"] = $team_c;
        $arr["team_h"] = $team_h;
        $arr["team_id_h"] = $match["gnum_h"];
        $arr["team_id_c"] = $match["gnum_c"];
        $arr["league_id"] = $match["lid"];
        $arr["ticket_id"] = betID();
        $arr["strong"] = $match["strong"];
        $arr["ioratio"] = $this->getXmlNode($xml,"ioration");
        $arr["spread"] = $this->getXmlNode($xml,"spread");
        $arr["ratio"] = $this->getXmlNode($xml,"ratio");
        $arr["concede"] = $this->getXmlNode($xml,"con");
        $arr["ball_act"] = $this->getXmlNode($xml,"dg");
        $arr["ptype"] = $this->getXmlNode($xml,"ptype");//-角球，-罚球数 等
        $arr["imp"] = $this->getXmlNode($xml,"important");
        $arr["ms"] = $this->getXmlNode($xml,"ms");
        if($isRB == "Y"){
            $score = explode(":",$this->getXmlNode($xml,"score"));
            $arr["score_h"] = $score[0];
            $arr["score_c"] = $score[1];
        }

        return $arr;

    }

    /**
     * 下注前验证
     * @param $xml
     * @return array
     */
    public function bet_check($xml,$_p){
        $golds = $this->getXmlNode($xml,"golds");
        $gold_gmax = $this->getXmlNode($xml,"gold_gmax");
        $gold_gmin = $this->getXmlNode($xml,"gold_gmin");
        $mem_sc = $this->getXmlNode($xml,"mem_sc");
        $dates = $this->getXmlNode($xml,"dates");
        $isyesterday = $_p["isyesterday"];
        $maxcredit = $this->user["balance_credit"];
        if($this->user["pay_type"] == 0){ //信用玩家
            $maxcredit = $this->user["balance_credit"] - $this->usedCredit(Constant::MEM,$this->user["nid"],$isyesterday);
            $maxcredit = $maxcredit>0 ? $maxcredit : 0;
        }

        $arr = [
            'nowcredit'=>$maxcredit,
            "code"=>"555",
            'gtype' => $this->param["gtype"],
            'gid' => $this->param["gid"],
            'systime' => $dates,
            'isyesterday' => $isyesterday
        ];

        if($golds>$maxcredit){ //余额不足
            $arr["errormsg"] = "1X012";
            $arr["errorvalue"] = "";
        }

        if($gold_gmin>$golds){//最低下注金额
            $arr["errormsg"] = "1X004";
            $arr["errorvalue"] = $gold_gmin;
            return $arr;
        }

        if($golds>$gold_gmax){//单注最高限额
            $arr["errormsg"] = "1X036";
            $arr["errorvalue"] = $gold_gmax;
            return $arr;
        }

        //单场最高限额
        $sum_bet_golds = 0;
        $rs = $this->dbc->select("SELECT SUM(`bet_golds`) AS `sum_bet_golds` FROM {$this->betTable} WHERE `gtype`='{$this->param["gtype"]}' AND `gid`='{$this->param["gid"]}' AND `wtype`='{$this->param["wtype"]}' AND `M_Date`='{$dates}'","Row");
        if(!empty($rs["golds"])){$sum_bet_golds=$rs["golds"];}
        if($sum_bet_golds+$golds>$mem_sc){
            $arr["errormsg"] = "1X018";
            $arr["errorvalue"] = $gold_gmax;
            return $arr;
        }

        $arr["code"] = 560;
        return $arr;
    }

    /**
     * 获取Xml节点值
     * @param $xml
     * @param $str
     * @return mixed
     */
    public function getXmlNode($xml,$str){
        preg_match("/\<{$str}>(.*?)\<\/{$str}>/is",$xml,$arr);
        return isset($arr[1]) ? rtrim($arr[1]) : "";
    }
}