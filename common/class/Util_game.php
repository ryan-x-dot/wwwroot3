<?php


class Util_game
{
    protected $ratioChg;

    public function __construct()
    {
        $this->ratioChg = new RatioChgRule();
    }

    /**
     * 判断是否为上半菜单
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsHalf_menutype ($wtype){
        $ary = [
            "HR", "HRE", "HPD", "HM", "HRM", "HRPD", "HOU", "HROU", "HEO", "HREO", "HT", "HRT",
            "HOUH", "HOUC", "HRUH", "HRUC", "HPR", "HPOU", "HPEO", "HPOUH", "HPOUC",
            "HPRE", "HPROU", "HPREO", "HPROUH", "HPROUC", "HPRUH", "HPRUC",
            "HTS", "HEOH", "HEOC", "HREOH", "HREOC", "HWM", "HRWM"
        ];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为上半
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsHalf_util ($wtype){
        //補上 "HTS","HEOH","HEOC","HREOH","HREOC","HWM"
        $ary = [
            "HR", "HRE", "HPD", "HM", "HRM", "HRPD", "HOU", "HROU", "HEO", "HREO", "HT", "HRT",
            "HOUH", "HOUC", "HRUH", "HRUC", "HPR", "HPOU", "HPEO", "HPOUH", "HPOUC",
            "HPRE", "HPROU", "HPREO", "HPROUH", "HPROUC", "HPRUH", "HPRUC",
            "HTS", "HEOH", "HEOC", "HREOH", "HREOC", "HWM", "HRWM"
        ];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为让球类
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsR ($wtype){
        $ary = [
            "PRE","HPRE","PARE","PBRE","PCRE","PDRE","PERE","PFRE",
            "R","HR","RE","HRE","PR","HPR",
            "ARE","BRE","CRE","DRE","ERE","FRE",
            "AR","BR","CR","DR","ER","FR",
            "PAR","PBR","PCR","PDR","PER","PFR",
            "BAR","CAR","DAR","EAR","FAR",
            "W3"
        ];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为大小类
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsOU ($wtype){
		$ary = [
		    "ROU","HROU","AROU","BROU","CROU","DROU","EROU","FROU","ROUH","ROUC","HRUH","HRUC",
            "OU","HOU","AOU","BOU","COU","DOU","EOU","FOU","OUH","OUC","HOUH","HOUC",
            "PAOU","PBOU","PCOU","PDOU","PEOU","PFOU",
            "POU","HPOU","HPOUH","HPOUC","POUH","POUC",
            "TARU","TBRU","TDRU","TERU"
        ];

        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为波胆类
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsPD ($wtype){
        $ary = ["PD","HPD","RPD","HRPD"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为15分钟滚球类
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIs15Min_RB ($wtype){
        $ary = ["ARE","AROU","ARM","BRE","BROU","BRM","CRE","CROU","CRM","DRE","DROU","DRM","ERE","EROU","ERM","FRE","FROU","FRM"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为单双
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsEO ($wtype){
        $ary = ["EO","HEO","EOH","EOC","HEOH","HEOC","REO","HREO","REOH","REOC","HREOH","HREOC","PEO","HPEO"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为 双方球队进球
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsTS ($wtype)
    {
        $ary = ["TS", "HTS", "RTS", "RTS2"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为 加时赛
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsOT ($wtype){
        $ary = ["OT","ROT"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    public function OUtransDT_wtype ($wtype){
        $ary = ["TS","HTS","OG","OT","RTS","RTS2","ROT"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为复合玩法
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsComplex ($wtype){
        $ary = ["MOU","MTS","MPG","DU","DS","DG","OUT","OUP","OUE",
        "MOUA","MOUB","MOUC","MOUD","DUA","DUB","DUC","DUD","OUTA","OUTB","OUTC","OUTD","OUPA","OUPB","OUPC","OUPD","OUEA","OUEB","OUEC","OUED",
        "RMOU","RMTS","RMPG","RDU","RDS","RDG","ROUT","ROUP","ROUE",
        "RMUA","RMUB","RMUC","RMUD","RDUA","RDUB","RDUC","RDUD","RUTA","RUTB","RUTC","RUTD","RUPA","RUPB","RUPC","RUPD","RUEA","RUEB","RUEC","RUED"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    public function checkWtypeIsSingle2016 ($wtype){
        $ary = ["MOUA","MOUB","MOUC","MOUD","DUA","DUB","DUC","DUD","OUTA","OUTB","OUTC","OUTD","OUPA","OUPB","OUPC","OUPD","OUEA","OUEB","OUEC","OUED",
        "MOU","MTS","MPG","DU","DS","DG","OUT","OUP","OUE",
        "MW","MQ",
        "RMUA","RMUB","RMUC","RMUD","RDUA","RDUB","RDUC","RDUD","RUTA","RUTB","RUTC","RUTD","RUPA","RUPB","RUPC","RUPD","RUEA","RUEB","RUEC","RUED",
        "RMOU","RMTS","RMPG","RDU","RDS","RDG","ROUT","ROUP","ROUE"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    public function checkWtypeIsDouble2016 ($wtype){
        $ary = ["EOH","EOC","HEOH","HEOC",
        "RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO",
        "RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC","RNCD","RNCE","RNCF",
        "RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU",
        "RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO",
        "RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ","RSCK","RSCL","RSCM","RSCN","RSCO"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    public function checkWtypeIsSingle2017 ($wtype){
        $ary = ["RPS","RTW","RPF","RPXA","RPXB","RPXC","RPXD","RPXE","RPXF","RPXG","RPXH","RPXI","RPXJ","RPXK","RPXL","RPXM","RPXN","RPXO"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为点球大战
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsRSH ($wtype){
        $ary = [
            "RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO",
            "PRSHA","PRSHB","PRSHC","PRSHD","PRSHE","PRSHF","PRSHG","PRSHH","PRSHI","PRSHJ","PRSHK","PRSHL","PRSHM","PRSHN","PRSHO"
        ];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为净胜球数
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsWM ($wtype){
        $ary = ["WM","RWM","HWM","HRWM"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为半全场
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsF ($wtype){
        $ary = ["F01","F02"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 判断是否为滚球半全场
     * @param $wtype
     * @return bool
     */
    public function checkWtypeIsRF ($wtype)
    {
        $ary = [
            "RF01", "RF02", "RF03", "RF04", "RF05", "RF06", "RF07", "RF08", "RF09", "RF10"
            , "RF11", "RF12", "RF13", "RF14", "RF15", "RF16", "RF17", "RF18", "RF19", "RF20"
            , "RF21", "RF22", "RF23", "RF24", "RF25", "RF26", "RF27", "RF28", "RF29", "RF30"
            , "RF31", "RF32", "RF33", "RF34", "RF35"
        ];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    public function checkWtypeIsRF_TN ($wtype){
        $ary = [
            "RFA01","RFA02","RFA03","RFA04","RFA05","RFA06","RFA07","RFA08","RFA09","RFA10"
            ,"RFA11","RFA12","RFA13"
            ,"RFB01","RFB02","RFB03","RFB04","RFB05","RFB06","RFB07","RFB08","RFB09","RFB10"
            ,"RFB11","RFB12","RFB13"
            ,"RFC01","RFC02","RFC03","RFC04","RFC05","RFC06","RFC07","RFC08","RFC09","RFC10"
            ,"RFC11","RFC12","RFC13","RFC14","RFC15","RFC16","RFC17","RFC18","RFC19","RFC20"
            ,"RFC21","RFC22","RFC23","RFC24","RFC25","RFC26","RFC27","RFC28","RFC29","RFC30"
            ,"RFC31","RFC32","RFC33","RFC34","RFC35","RFC36","RFC37","RFC38","RFC39","RFC40"
            ,"RFC41","RFC42","RFC43","RFC44","RFC45","RFC46","RFC47","RFC48","RFC49","RFC50"
            ,"RFD01","RFD02","RFD03","RFD04","RFD05","RFD06","RFD07","RFD08","RFD09","RFD10"
            ,"RFD11","RFD12","RFD13"
            ,"RFE01","RFE02","RFE03","RFE04","RFE05","RFE06","RFE07","RFE08","RFE09","RFE10"
            ,"RFE11","RFE12","RFE13","RFE14","RFE15","RFE16","RFE17","RFE18","RFE19","RFE20"
            ,"RFE21","RFE22","RFE23","RFE24","RFE25","RFE26","RFE27","RFE28","RFE29","RFE30"
            ,"RFE31","RFE32","RFE33","RFE34","RFE35","RFE36","RFE37","RFE38","RFE39","RFE40"
            ,"RFE41","RFE42","RFE43","RFE44","RFE45","RFE46","RFE47","RFE48","RFE49","RFE50"
        ];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }
	
	public function checkWtypeIsRGA_TN($wtype) {
		$ary =["RGAA01","RGAA02","RGAA03","RGAA04","RGAA05","RGAA06","RGAA07","RGAA08","RGAA09","RGAA10","RGAA11","RGAA12","RGAA13","RGAB01","RGAB02","RGAB03","RGAB04","RGAB05","RGAB06","RGAB07","RGAB08","RGAB09","RGAB10","RGAB11","RGAB12","RGAB13","RGAC01","RGAC02","RGAC03","RGAC04","RGAC05","RGAC06","RGAC07","RGAC08","RGAC09","RGAC10","RGAC11","RGAC12","RGAC13","RGAC14","RGAC15","RGAC16","RGAC17","RGAC18","RGAC19","RGAC20","RGAC21","RGAC22","RGAC23","RGAC24","RGAC25","RGAC26","RGAC27","RGAC28","RGAC29","RGAC30","RGAC31","RGAC32","RGAC33","RGAC34","RGAC35","RGAC36","RGAC37","RGAC38","RGAC39","RGAC40","RGAC41","RGAC42","RGAC43","RGAC44","RGAC45","RGAC46","RGAC47","RGAC48","RGAC49","RGAC50","RGAD01","RGAD02","RGAD03","RGAD04","RGAD05","RGAD06","RGAD07","RGAD08","RGAD09","RGAD10","RGAD11","RGAD12","RGAD13","RGAE01","RGAE02","RGAE03","RGAE04","RGAE05","RGAE06","RGAE07","RGAE08","RGAE09","RGAE10","RGAE11","RGAE12","RGAE13","RGAE14","RGAE15","RGAE16","RGAE17","RGAE18","RGAE19","RGAE20","RGAE21","RGAE22","RGAE23","RGAE24","RGAE25","RGAE26","RGAE27","RGAE28","RGAE29","RGAE30","RGAE31","RGAE32","RGAE33","RGAE34","RGAE35","RGAE36","RGAE37","RGAE38","RGAE39","RGAE40","RGAE41","RGAE42","RGAE43","RGAE44","RGAE45","RGAE46","RGAE47","RGAE48","RGAE49","RGAE50"];
		if (in_array(strtoupper($wtype), $ary)) {
			return true;
		} else {
			return false;
		}
	}

    public function checkWtypeIsRGOU_TN($wtype) {
		$ary = ["RGOUA01","RGOUA02","RGOUA03","RGOUA04","RGOUA05","RGOUA06","RGOUA07","RGOUA08","RGOUA09","RGOUA10","RGOUA11","RGOUA12","RGOUA13","RGOUB01","RGOUB02","RGOUB03","RGOUB04","RGOUB05","RGOUB06","RGOUB07","RGOUB08","RGOUB09","RGOUB10","RGOUB11","RGOUB12","RGOUB13","RGOUC01","RGOUC02","RGOUC03","RGOUC04","RGOUC05","RGOUC06","RGOUC07","RGOUC08","RGOUC09","RGOUC10","RGOUC11","RGOUC12","RGOUC13","RGOUC14","RGOUC15","RGOUC16","RGOUC17","RGOUC18","RGOUC19","RGOUC20","RGOUC21","RGOUC22","RGOUC23","RGOUC24","RGOUC25","RGOUC26","RGOUC27","RGOUC28","RGOUC29","RGOUC30","RGOUC31","RGOUC32","RGOUC33","RGOUC34","RGOUC35","RGOUC36","RGOUC37","RGOUC38","RGOUC39","RGOUC40","RGOUC41","RGOUC42","RGOUC43","RGOUC44","RGOUC45","RGOUC46","RGOUC47","RGOUC48","RGOUC49","RGOUC50","RGOUD01","RGOUD02","RGOUD03","RGOUD04","RGOUD05","RGOUD06","RGOUD07","RGOUD08","RGOUD09","RGOUD10","RGOUD11","RGOUD12","RGOUD13","RGOUE01","RGOUE02","RGOUE03","RGOUE04","RGOUE05","RGOUE06","RGOUE07","RGOUE08","RGOUE09","RGOUE10","RGOUE11","RGOUE12","RGOUE13","RGOUE14","RGOUE15","RGOUE16","RGOUE17","RGOUE18","RGOUE19","RGOUE20","RGOUE21","RGOUE22","RGOUE23","RGOUE24","RGOUE25","RGOUE26","RGOUE27","RGOUE28","RGOUE29","RGOUE30","RGOUE31","RGOUE32","RGOUE33","RGOUE34","RGOUE35","RGOUE36","RGOUE37","RGOUE38","RGOUE39","RGOUE40","RGOUE41","RGOUE42","RGOUE43","RGOUE44","RGOUE45","RGOUE46","RGOUE47","RGOUE48","RGOUE49","RGOUE50"];
		if (in_array(strtoupper($wtype), $ary)) {
			return true;
		} else {
			return false;
		}
	}
    public function checkWtypeIsRG ($wtype){
        $ary = ["ARG","BRG","CRG","DRG","ERG","FRG","GRG","HRG","IRG","JRG"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    public function checkWtypeisSP ($wtype){
        $ary = ["PG","OS","ST","CN","CD","RC","YC","GA"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    //走地下注需秀比分
    public function needToShowScore ($wtype){
        $ary = ["RE","HRE","ROU","HROU","ARE","AROU","ARM","BRE","BROU","BRM","CRE","CROU","CRM","DRE","DROU","DRM","ERE","EROU","ERM","FRE","FROU","FRM","ROUH","ROUC","HRUH","HRUC",
        "RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA",
        "RNCB","RNCC","RNCD","RNCE","RNCF","RNCG","RNCH","RNCI","RNCJ","RNCK",
        "RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU",
        "RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ",
        "RNBK","RNBL","RNBM","RNBN","RNBO",
        "RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ",
        "RSHK","RSHL","RSHM","RSHN","RSHO",
        "RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ",
        "RSCK","RSCL","RSCM","RSCN","RSCO",
        "TARU","TBRU","TDRU","TERU"];
        if (in_array(strtoupper($wtype), $ary)) {
            return true;
        } else {
            return false;
        }
    }

    public function changeWtypeForPD ($gtype, $wtype, $isLower=false){
        $gtype = strtoupper($gtype);
        $wtype = strtoupper($wtype);
        $hash = [];
        $hash["BK_RPDH"] = "RPD";
        $hash["BK_RPDC"] = "RPD";
        $hash["BK_PDH"] = "PD";
        $hash["BK_PDC"] = "PD";
        $hash["BS_MX"] = "M";
        $hash["BS_RMX"] = "RM";
        $ret = isset($hash[$gtype."_".$wtype]) ? $hash[$gtype."_".$wtype] : $wtype;
        return $isLower ? strtolower($ret) : strtoupper($ret);
    }

    /**
     * 足球复合玩法 根据rtype去"P"后获取wtype
     * @param $rtype
     */
    public function get_rtypeORwtype($rtype){
        $hash = $this->getAllWtype();
        $wtype = "";
        foreach ($hash as $k => $v){
            if(in_array($rtype,$v)){
                $wtype = $k;
                break;
            }
        }
        return $wtype;
    }

    public function getAllWtype(){
        //MW
        $hash["MW"] = ["MWH", "MWC", "MWHOT", "MWCOT", "MWHPK", "MWCPK"];
        //MQ
        $hash["MQ"] = ["MQH", "MQC", "MQHOT", "MQCOT", "MQHPK", "MQCPK"];
        //MOUA
        $hash["MOUA"] = ["MOUAHO", "MOUAHU", "MOUACO", "MOUACU", "MOUANO", "MOUANU"];
        //MOUB
        $hash["MOUB"] = ["MOUBHO", "MOUBHU", "MOUBCO", "MOUBCU", "MOUBNO", "MOUBNU"];
        //MOUC
        $hash["MOUC"] = ["MOUCHO", "MOUCHU", "MOUCCO", "MOUCCU", "MOUCNO", "MOUCNU"];
        //MOUD
        $hash["MOUD"] = ["MOUDHO", "MOUDHU", "MOUDCO", "MOUDCU", "MOUDNO", "MOUDNU"];
        //MPG
        $hash["MPG"] = ["MPGHH", "MPGHC", "MPGCH", "MPGCC", "MPGNH", "MPGNC"];
        //MTS
        $hash["MTS"] = ["MTSHY", "MTSHN", "MTSCY", "MTSCN", "MTSNY", "MTSNN"];
        //DUA
        $hash["DUA"] = ["DUAHO", "DUAHU", "DUACO", "DUACU", "DUASO", "DUASU"];
        //DUB
        $hash["DUB"] = ["DUBHO", "DUBHU", "DUBCO", "DUBCU", "DUBSO", "DUBSU"];
        //DUC
        $hash["DUC"] = ["DUCHO", "DUCHU", "DUCCO", "DUCCU", "DUCSO", "DUCSU"];
        //DUD
        $hash["DUD"] = ["DUDHO", "DUDHU", "DUDCO", "DUDCU", "DUDSO", "DUDSU"];
        //DG
        $hash["DG"] = ["DGHH", "DGHC", "DGCH", "DGCC", "DGSH", "DGSC"];
        //DS
        $hash["DS"] = ["DSHY", "DSHN", "DSCY", "DSCN", "DSSY", "DSSN"];
        //OUEA
        $hash["OUEA"] = ["OUEAOO", "OUEAOE", "OUEAUO", "OUEAUE"];
        //OUEB
        $hash["OUEB"] = ["OUEBOO", "OUEBOE", "OUEBUO", "OUEBUE"];
        //OUEC
        $hash["OUEC"] = ["OUECOO", "OUECOE", "OUECUO", "OUECUE"];
        //OUED
        $hash["OUED"] = ["OUEDOO", "OUEDOE", "OUEDUO", "OUEDUE"];
        //OUPA
        $hash["OUPA"] = ["OUPAOH", "OUPAOC", "OUPAUH", "OUPAUC"];
        //OUPB
        $hash["OUPB"] = ["OUPBOH", "OUPBOC", "OUPBUH", "OUPBUC"];
        //OUPC
        $hash["OUPC"] = ["OUPCOH", "OUPCOC", "OUPCUH", "OUPCUC"];
        //OUPD
        $hash["OUPD"] = ["OUPDOH", "OUPDOC", "OUPDUH", "OUPDUC"];
        //OUTA
        $hash["OUTA"] = ["OUTAOY", "OUTAON", "OUTAUY", "OUTAUN"];
        //OUTB
        $hash["OUTB"] = ["OUTBOY", "OUTBON", "OUTBUY", "OUTBUN"];
        //OUTC
        $hash["OUTC"] = ["OUTCOY", "OUTCON", "OUTCUY", "OUTCUN"];
        //OUTD
        $hash["OUTD"] = ["OUTDOY", "OUTDON", "OUTDUY", "OUTDUN"];

        //RMUA
        $hash["RMUA"] = ["RMUAHO", "RMUAHU", "RMUACO", "RMUACU", "RMUANO", "RMUANU"];
        //RMUB
        $hash["RMUB"] = ["RMUBHO", "RMUBHU", "RMUBCO", "RMUBCU", "RMUBNO", "RMUBNU"];
        //RMUC
        $hash["RMUC"] = ["RMUCHO", "RMUCHU", "RMUCCO", "RMUCCU", "RMUCNO", "RMUCNU"];
        //RMUD
        $hash["RMUD"] = ["RMUDHO", "RMUDHU", "RMUDCO", "RMUDCU", "RMUDNO", "RMUDNU"];
        //RMPG
        $hash["RMPG"] = ["RMPGHH", "RMPGHC", "RMPGCH", "RMPGCC", "RMPGNH", "RMPGNC"];
        //RMTS
        $hash["RMTS"] = ["RMTSHY", "RMTSHN", "RMTSCY", "RMTSCN", "RMTSNY", "RMTSNN"];
        //RDUA
        $hash["RDUA"] = ["RDUAHO", "RDUAHU", "RDUACO", "RDUACU", "RDUASO", "RDUASU"];
        //RDUB
        $hash["RDUB"] = ["RDUBHO", "RDUBHU", "RDUBCO", "RDUBCU", "RDUBSO", "RDUBSU"];
        //RDUC
        $hash["RDUC"] = ["RDUCHO", "RDUCHU", "RDUCCO", "RDUCCU", "RDUCSO", "RDUCSU"];
        //RDUD
        $hash["RDUD"] = ["RDUDHO", "RDUDHU", "RDUDCO", "RDUDCU", "RDUDSO", "RDUDSU"];
        //RDG
        $hash["RDG"] = ["RDGHH", "RDGHC", "RDGCH", "RDGCC", "RDGSH", "RDGSC"];
        //RDS
        $hash["RDS"] = ["RDSHY", "RDSHN", "RDSCY", "RDSCN", "RDSSY", "RDSSN"];
        //RUEA
        $hash["RUEA"] = ["RUEAOO", "RUEAOE", "RUEAUO", "RUEAUE"];
        //RUEB
        $hash["RUEB"] = ["RUEBOO", "RUEBOE", "RUEBUO", "RUEBUE"];
        //RUEC
        $hash["RUEC"] = ["RUECOO", "RUECOE", "RUECUO", "RUECUE"];
        //RUED
        $hash["RUED"] = ["RUEDOO", "RUEDOE", "RUEDUO", "RUEDUE"];
        //RUPA
        $hash["RUPA"] = ["RUPAOH", "RUPAOC", "RUPAUH", "RUPAUC"];
        //RUPB
        $hash["RUPB"] = ["RUPBOH", "RUPBOC", "RUPBUH", "RUPBUC"];
        //RUPC
        $hash["RUPC"] = ["RUPCOH", "RUPCOC", "RUPCUH", "RUPCUC"];
        //RUPD
        $hash["RUPD"] = ["RUPDOH", "RUPDOC", "RUPDUH", "RUPDUC"];
        //RUTA
        $hash["RUTA"] = ["RUTAOY", "RUTAON", "RUTAUY", "RUTAUN"];
        //RUTB
        $hash["RUTB"] = ["RUTBOY", "RUTBON", "RUTBUY", "RUTBUN"];
        //RUTC
        $hash["RUTC"] = ["RUTCOY", "RUTCON", "RUTCUY", "RUTCUN"];
        //RUTD
        $hash["RUTD"] = ["RUTDOY", "RUTDON", "RUTDUY", "RUTDUN"];

        return $hash;
    }

    /**
     * 足球复合玩法 根据wtype获取下属所有rtype
     * @param $wtype
     * @return string[]
     */
    public function getAllRtype($wtype){
        $hash = [];

        $RNB_ary = ["RNBA", "RNBB", "RNBC", "RNBD", "RNBE", "RNBF", "RNBG", "RNBH", "RNBI", "RNBJ", "RNBK", "RNBL", "RNBM", "RNBN", "RNBO"];
        $RNC_ary = ["RNC1", "RNC2", "RNC3", "RNC4", "RNC5", "RNC6", "RNC7", "RNC8", "RNC9", "RNCA", "RNCB", "RNCC", "RNCD", "RNCE", "RNCF",
            "RNCG", "RNCH", "RNCI", "RNCJ", "RNCK", "RNCL", "RNCM", "RNCN", "RNCO", "RNCP", "RNCQ", "RNCR", "RNCS", "RNCT", "RNCU"];
        $RSH_ary = ["RSHA", "RSHB", "RSHC", "RSHD", "RSHE", "RSHF", "RSHG", "RSHH", "RSHI", "RSHJ", "RSHK", "RSHL", "RSHM", "RSHN", "RSHO",
            "RSCA", "RSCB", "RSCC", "RSCD", "RSCE", "RSCF", "RSCG", "RSCH", "RSCI", "RSCJ", "RSCK", "RSCL", "RSCM", "RSCN", "RSCO"];

        //先做初始對應
        //$hash[$wtype] = $wtype;

        $hash = $this->getAllWtype();

        //RNB,RNC,RSH 這三個系列的rtype重複性質，故動態新增
        if (in_array($wtype, $RNB_ary) || in_array($wtype, $RNC_ary)) {
            $rtypeH = $wtype + "H";
            $rtypeC = $wtype + "C";
            $hash[$wtype] = [$rtypeH, $rtypeC];
        } else if (in_array($wtype, $RSH_ary)) {
            $rtypeHH = $wtype . "Y";
            $rtypeHC = $wtype . "N";
            $rtypeCH = substr($wtype, 0, 2) . "C" . substr($wtype, 3, 1) . "Y";
            $rtypeCC = substr($wtype, 0, 2) . "C" . substr($wtype, 3, 1) . "N";
            $hash[$wtype] = [$rtypeHH, $rtypeHC, $rtypeCH, $rtypeCC];
        }

        return isset($hash[$wtype]) ? $hash[$wtype] : $wtype;
    }

    /**
     * 过滤掉滚球的P
     * @param $str
     * @param false $isLower
     * @return string
     */
    public function filterP ($str,$isLower=false)
    {
        $tmpstr = strtoupper($str);
        if ((substr($tmpstr, 0, 2) == "HP" || substr($tmpstr, 0, 1) == "P")
            && !preg_match("/^H?PD(3|5|7)?$/is", $tmpstr)
            && !preg_match("/^R?PD3[0-2][0-2]$/is", $tmpstr)
            && !preg_match("/^R?PD5[0-3][0-3]$/is", $tmpstr)
            && !preg_match("/^R?PD7[0-4][0-4]$/is", $tmpstr)
            && !preg_match("/^PD(H|C)?[0-4]?$/is", $tmpstr)
            && !preg_match("/^PG(F|L)?(H|N|C)?$/is", $tmpstr)
            && !preg_match("/^PA(H|C)?$/is", $tmpstr)) {
            $tmpstr = str_replace("P", "", $tmpstr);
        }
        return $isLower==false ? strtolower($tmpstr) : strtoupper($tmpstr);
    }

    /**
     * @param $rtype
     * @return string
     */
    public function getTeamP($rtype){
        $rtype = strtoupper($rtype);
        $hash = [
            "POUHO" => "H",
            "POUHU" => "H",
            "POUCO" => "C",
            "POUCU" => "C",
            "HPOUHO" => "H",
            "HPOUHU" => "H",
            "HPOUCO" => "C",
            "HPOUCU" => "C"
        ];
        return isset($hash[$rtype]) ? $hash[$rtype] : "";
    }

    /**
     * 小数点相乘溢位
     * @param $num1
     * @param $num2
     */
    public function mulFloat ($num1, $num2){
        $m = 0;
        $s1 = explode(".",$num1);
        $s2 = explode(".",$num2);
        if(isset($s1[1])){
            $m += strlen($s1[1]);
        }

        if(isset($s2[1])){
            $m += strlen($s2[1]);
        }

        $num1 = intval(str_replace(".","",$num1));
        $num2 = intval(str_replace(".","",$num2));
        return  $num1 * $num2 / pow(10,$m);
    } 

    public function checkWtypeIsWXP_BM($wtype){
        $ary =[ 
            "WXPA05","WXPA10","WXPA15",
            "RWXPA05","RWXPA10","RWXPA15",
            "RWXPB05","RWXPB10","RWXPB15",
            "RWXPC05","RWXPC10","RWXPC15",
            "RWXPD05","RWXPD10","RWXPD15",
            "RWXPE05","RWXPE10","RWXPE15"
            ];
        return in_array(strtoupper($wtype), $ary);
    }

    public function checkWtypeIsPTW_BM ($wtype){
        $ary = [
            "PTWA01","PTWA02","PTWA03",
            "RPTWA01","RPTWA02","RPTWA03","RPTWA04","RPTWA05","RPTWA06","RPTWA07","RPTWA08","RPTWA09","RPTWA10",
            "RPTWA11","RPTWA12","RPTWA13","RPTWA14","RPTWA15","RPTWA16","RPTWA17","RPTWA18","RPTWA19","RPTWA20",
            "RPTWA21","RPTWA22","RPTWA23","RPTWA24","RPTWA25","RPTWA26","RPTWA27","RPTWA28","RPTWA29","RPTWA30",
            "RPTWA31","RPTWA32","RPTWA33","RPTWA34","RPTWA35","RPTWA36","RPTWA37","RPTWA38","RPTWA39","RPTWA40",
            "RPTWA41","RPTWA42","RPTWA43","RPTWA44","RPTWA45","RPTWA46","RPTWA47","RPTWA48","RPTWA49","RPTWA50",
            "RPTWA51","RPTWA52","RPTWA53","RPTWA54","RPTWA55","RPTWA56","RPTWA57","RPTWA58","RPTWA59",
            "RPTWB01","RPTWB02","RPTWB03","RPTWB04","RPTWB05","RPTWB06","RPTWB07","RPTWB08","RPTWB09","RPTWB10",
            "RPTWB11","RPTWB12","RPTWB13","RPTWB14","RPTWB15","RPTWB16","RPTWB17","RPTWB18","RPTWB19","RPTWB20",
            "RPTWB21","RPTWB22","RPTWB23","RPTWB24","RPTWB25","RPTWB26","RPTWB27","RPTWB28","RPTWB29","RPTWB30",
            "RPTWB31","RPTWB32","RPTWB33","RPTWB34","RPTWB35","RPTWB36","RPTWB37","RPTWB38","RPTWB39","RPTWB40",
            "RPTWB41","RPTWB42","RPTWB43","RPTWB44","RPTWB45","RPTWB46","RPTWB47","RPTWB48","RPTWB49","RPTWB50",
            "RPTWB51","RPTWB52","RPTWB53","RPTWB54","RPTWB55","RPTWB56","RPTWB57","RPTWB58","RPTWB59",
            "RPTWC01","RPTWC02","RPTWC03","RPTWC04","RPTWC05","RPTWC06","RPTWC07","RPTWC08","RPTWC09","RPTWC10",
            "RPTWC11","RPTWC12","RPTWC13","RPTWC14","RPTWC15","RPTWC16","RPTWC17","RPTWC18","RPTWC19","RPTWC20",
            "RPTWC21","RPTWC22","RPTWC23","RPTWC24","RPTWC25","RPTWC26","RPTWC27","RPTWC28","RPTWC29","RPTWC30",
            "RPTWC31","RPTWC32","RPTWC33","RPTWC34","RPTWC35","RPTWC36","RPTWC37","RPTWC38","RPTWC39","RPTWC40",
            "RPTWC41","RPTWC42","RPTWC43","RPTWC44","RPTWC45","RPTWC46","RPTWC47","RPTWC48","RPTWC49","RPTWC50",
            "RPTWC51","RPTWC52","RPTWC53","RPTWC54","RPTWC55","RPTWC56","RPTWC57","RPTWC58","RPTWC59",
            "RPTWD01","RPTWD02","RPTWD03","RPTWD04","RPTWD05","RPTWD06","RPTWD07","RPTWD08","RPTWD09","RPTWD10",
            "RPTWD11","RPTWD12","RPTWD13","RPTWD14","RPTWD15","RPTWD16","RPTWD17","RPTWD18","RPTWD19","RPTWD20",
            "RPTWD21","RPTWD22","RPTWD23","RPTWD24","RPTWD25","RPTWD26","RPTWD27","RPTWD28","RPTWD29",
            "RPTWE01","RPTWE02","RPTWE03","RPTWE04","RPTWE05","RPTWE06","RPTWE07","RPTWE08","RPTWE09","RPTWE10",
            "RPTWE11","RPTWE12","RPTWE13","RPTWE14","RPTWE15","RPTWE16","RPTWE17","RPTWE18","RPTWE19","RPTWE20",
            "RPTWE21","RPTWE22","RPTWE23","RPTWE24","RPTWE25","RPTWE26","RPTWE27","RPTWE28","RPTWE29"
        ];
        return in_array(strtoupper($wtype), $ary);
    }

    /**
     * 判断是否为滚球
     * @param $wtype
     * @return bool
     */
    public function isRBWtype($wtype)
    {
        $wtype = $this->filterP($wtype, true); //滾過先濾掉P

        $wtypeRB = [
            "RE", "ROU", "HRE", "HROU", "RM", "HRM",
            "ARE", "BRE", "CRE", "DRE", "ERE", "FRE",
            "AROU", "BROU", "CROU", "DROU", "EROU", "FROU",
            "ARM", "BRM", "CRM", "DRM", "ERM", "FRM",
            "ROUH", "ROUC", "HRUH", "HRUC",
            "RPD", "RPD3", "RPD5", "RPD7", "HRPD",
            "RDT", "RT", "HRT", "REO", "HREO", "RF", "RHG", "RMG",
            "ARG", "BRG", "CRG", "DRG", "ERG", "FRG", "GRG", "HRG", "IRG", "JRG",
            "RWM", "RDC", "RCS", "RWN", "RTS", "RWB", "RWE", "RSB", "RT1G", "RT3G",
            "RMUA", "RMUB", "RMUC", "RMUD", "RMPG", "RMTS",
            "RDUA", "RDUB", "RDUC", "RDUD", "RDG", "RDS",
            "RUEA", "RUEB", "RUEC", "RUED",
            "RUPA", "RUPB", "RUPC", "RUPD",
            "RUTA", "RUTB", "RUTC", "RUTD",
            "ROT", "RTS", "RTS2",
            "RNC1", "RNC2", "RNC3", "RNC4", "RNC5", "RNC6", "RNC7", "RNC8", "RNC9", "RNCA",
            "RNCB", "RNCC", "RNCD", "RNCE", "RNCF", "RNCG", "RNCH", "RNCI", "RNCJ", "RNCK",
            "RNCL", "RNCM", "RNCN", "RNCO", "RNCP", "RNCQ", "RNCR", "RNCS", "RNCT", "RNCU",
            "RNBA", "RNBB", "RNBC", "RNBD", "RNBE", "RNBF", "RNBG", "RNBH", "RNBI", "RNBJ",
            "RNBK", "RNBL", "RNBM", "RNBN", "RNBO",
            "RSHA", "RSHB", "RSHC", "RSHD", "RSHE", "RSHF", "RSHG", "RSHH", "RSHI", "RSHJ",
            "RSHK", "RSHL", "RSHM", "RSHN", "RSHO",
            "RSCA", "RSCB", "RSCC", "RSCD", "RSCE", "RSCF", "RSCG", "RSCH", "RSCI", "RSCJ",
            "RSCK", "RSCL", "RSCM", "RSCN", "RSCO",
            "HRWM",
            "RF01", "RF02", "RF03", "RF04", "RF05", "RF06", "RF07", "RF08", "RF09", "RF10",
            "RF11", "RF12", "RF13", "RF14", "RF15", "RF16", "RF17", "RF18", "RF19", "RF20",
            "RF21", "RF22", "RF23", "RF24", "RF25", "RF26", "RF27", "RF28", "RF29", "RF30",
            "RF31", "RF32", "RF33", "RF34", "RF35",
            "RFA01", "RFA02", "RFA03", "RFA04", "RFA05", "RFA06", "RFA07", "RFA08", "RFA09", "RFA10",
            "RFB01", "RFB02", "RFB03", "RFB04", "RFB05", "RFB06", "RFB07", "RFB08", "RFB09", "RFB10",
            "RFC01", "RFC02", "RFC03", "RFC04", "RFC05", "RFC06", "RFC07", "RFC08", "RFC09", "RFC10",
            "RFD01", "RFD02", "RFD03", "RFD04", "RFD05", "RFD06", "RFD07", "RFD08", "RFD09", "RFD10",
            "RFE01", "RFE02", "RFE03", "RFE04", "RFE05", "RFE06", "RFE07", "RFE08", "RFE09", "RFE10",
            "TARU", "TBRU", "TDRU", "TERU",
            "RPS", "RTW", "RPF",
            "RPXA", "RPXB", "RPXC", "RPXD", "RPXE", "RPXF", "RPXG", "RPXH", "RPXI", "RPXJ", "RPXK", "RPXL", "RPXM", "RPXN", "RPXO"
        ];
        for ($i = 65; $i < 70; $i++) {//網球滾球盤數11～50局
            $tochar = chr($i);//ascii轉字元ABCDE
            for ($j = 11; $j <= 50; $j++) {
                $wtypeRB[] = "RF" . $tochar . $j;
            }
        }
        if (in_array(strtoupper($wtype), $wtypeRB)) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 保留几位小数
     * @param $num
     * @param $b
     * @param $add
     * @return float|int|string
     */
    public function formatNumber($num, $b, $add)
    {
        $point = $b;
        $t = 1;
        for (; $b > 0; $t *= 10, $b--) ;
        $n = ($b == 0) ? 0 : (1 / $t); //極小數 處理溢位問題
        if ($num * 1 >= 0) {
            if ($add) return $this->addZero(round(($num * $t) + $n) / $t, $point);
            else    return round(($num * $t) + $n) / $t;
        } else {
            if ($add) return $this->addZero(round(($num * $t) - $n) / $t, $point);
            else    return round(($num * $t) + $n) / $t;
        }
    }

    /**
     * 添零
     * @param $code
     * @param $b
     * @return string
     */
    public function addZero ($code,$b)
    {
        $code .= "";
        $str = "";
        $index = strrpos($code, ".");

        if ($index === false) {
            $code .= ".";
            $index = strlen($code) - 1;
        }

        $r = $b * 1 - (strlen($code) - $index - 1);
        for ($i = 0; $i < $r; $i++) {$str .= "0";}
        $str = $code.$str;

        return $str;
    }

    /**
     * 计算可赢金额
     * @param $gold
     * @param $ior
     * @param $wtype
     * @param $gtype
     * @param string $odd_f_type
     * @return mixed
     */
    public function calcWindGold ($gold,$ior,$wtype,$gtype,$odd_f_type="H")
    {
        $wtype = strtoupper($wtype);
        if (($this->checkWtypeIsR($wtype) || $this->checkWtypeIsOU($wtype) || $this->checkWtypeIsDouble2016($wtype)) && !$this->checkWtypeIsEO($wtype) && $odd_f_type != "E"
            && !($this->checkWtypeIsOT($wtype) && $gtype == "BS")) {
            if ($ior < 0 || $wtype == "W3")
                return $this->calcWinGoldDT($gold, $ior);
            else
                return $this->util_formatNumber($gold * $ior * 1);
        } else if ($wtype == "P3" || $wtype == "RP3") {
            return $this->calcWinGoldP($gold, $ior);
        } else {
            return $this->calcWinGoldDT($gold, $ior);
        }
    }

    /**
     * 过关可赢计算 扣本金
     * @param $gold
     * @param $ior
     * @return float|int|string
     */
    public function calcWinGoldP ($gold, $ior){
        $total = $gold*$ior-$gold;
        return $this->util_formatNumber($total);
    }

    /**
     * 其他类可赢计算 扣本金
     * @param $gold
     * @param $ior
     * @return float|int|string
     */
    public function calcWinGoldDT ($gold, $ior)
    {
        if ($ior * 1 >= 1) {
            return $this->util_formatNumber($gold * ($ior * 1 - 1));
        }
        if ($ior * 1 < 0) {
            return $this->util_formatNumber($gold * 1);
        } else {
            return $this->util_formatNumber($gold * $ior * 1);
        }
    }

    public function util_formatNumber ($num){
        return $this->formatNumber($num, 2, true);
    }

    /**
     * 各球类 独赢读取
     * @param $_name
     * @param $_gtype
     * @return mixed|string
     */
    public function chgShowName_M ($_name, $_gtype)
    {
        $gtype = strtoupper($_gtype);
        $ary = ["showRtype_m", "showRtype_hm", "showRtype_rm", "showRtype_hrm"];
        if (in_array($_name, $ary)) {
            if ($gtype == "FT" || $gtype == "OP") {
                return $_name . "_FT";
            }
        }
        return $_name;
    }

    public function util_wtypeConverToR ($wtype, $isLower=false)
    {
        $wtype = strtoupper($wtype);
        $hash = [
            "RM" => "M",
            "RE" => "R",
            "ROU" => "OU",
            "REO" => "EO",
            "RPD3" => "PD3",
            "RPD5" => "PD5",
            "RPD7" => "PD7",
            "ROUH" => "OUH",
            "ROUC" => "OUC",
            "PR" => "R",
            "POU" => "OU",
            "PEO" => "EO"
        ];
        $ret = isset($hash[$wtype]) ? $hash[$wtype] : $wtype;
        return $isLower == true ? strtolower($ret) : strtoupper($ret);
    }

    public function changeRtypetoWtypeSP ($rtype){
        $ary = ["PG", "OS", "ST", "CN", "CD", "RC", "YC", "GA"];
        foreach ($ary as $v) {
            if (strpos($rtype, $v) !== false) {
                return $v;
            }
        }
    }

    public function getConcede($ratio, $sw)
    {
        $ret = "-";
        $str = "";
        if (empty($ratio) && !is_numeric($ratio)) {
            return $ret;
        }
        if ($sw == "N") {
            return $ret;
        }
        $str = $ratio;
        return $str;
    }

    public function getConcedeStr ($wtype,$strong,$ratio){
        $obj = [
            "bet_finish_con" => "",
            "bet_finish_con_c" => ""
        ];
        if ($this->checkWtypeIsR($wtype) && $wtype != "W3") {
            if ($strong == "H") {
                $obj["bet_finish_con"] = $this->getConcede($ratio, null);
                $obj["bet_finish_con_c"] = "";
            } else {
                $obj["bet_finish_con"] = "";
                $obj["bet_finish_con_c"] = $this->getConcede($ratio, null);
            }
        }
        return $obj;
    }

    public function switchTeamName($wtype,$rtype)
    {
        $rtypeHash["T_EVEN"] = "eoe";
        $rtypeHash["T_ODD"] = "eoo";
        $rtypeHash["HT_HEVEN"] = "heoe";
        $rtypeHash["HT_HODD"] = "heoo";
        $rtypeHash["RT_REVEN"] = "reoe";
        $rtypeHash["RT_RODD"] = "reoo";
        $rtypeHash["HRT_HREVEN"] = "hreoe";
        $rtypeHash["HRT_HRODD"] = "hreoo";
        $rtypeHash["T_0~1"] = "t01";
        $rtypeHash["T_2~3"] = "t23";
        $rtypeHash["T_4~6"] = "t46";
        $rtypeHash["RT_R0~1"] = "rt01";
        $rtypeHash["RT_R2~3"] = "rt23";
        $rtypeHash["RT_R4~6"] = "rt46";
        $key = strtoupper($wtype) . "_" . strtoupper($rtype);
        return isset($rtypeHash[$key]) ? $rtypeHash[$key] : "";
    }

    public function getTeamWM($rtype){
        $_rtype = strtoupper($rtype);
        $hash["WMH1"] = "h";
        $hash["WMH2"] = "h";
        $hash["WMH3"] = "h";
        $hash["WMH4"] = "h";
        $hash["WMHOV"] = "h";

        $hash["WMC1"] = "c";
        $hash["WMC2"] = "c";
        $hash["WMC3"] = "c";
        $hash["WMC4"] = "c";
        $hash["WMCOV"] = "c";
		$hash["WMCCOV"] = "c";

        $hash["HWMH1"] = "h";
        $hash["HWMH2"] = "h";
        $hash["HWMH3"] = "h";
        $hash["HWMH4"] = "h";

        $hash["HWMC1"] = "c";
        $hash["HWMC2"] = "c";
        $hash["HWMC3"] = "c";
        $hash["HWMC4"] = "c";

        $hash["RWMH1"] = "h";
        $hash["RWMH2"] = "h";
        $hash["RWMH3"] = "h";
        $hash["RWMH4"] = "h";
        $hash["RWMHOV"] = "h";

        $hash["RWMC1"] = "c";
        $hash["RWMC2"] = "c";
        $hash["RWMC3"] = "c";
        $hash["RWMC4"] = "c";
        $hash["RWMCOV"] = "c";

        $hash["HRWMH1"] = "h";
        $hash["HRWMH2"] = "h";
        $hash["HRWMH3"] = "h";
        $hash["HRWMH4"] = "h";

        $hash["HRWMC1"] = "c";
        $hash["HRWMC2"] = "c";
        $hash["HRWMC3"] = "c";
        $hash["HRWMC4"] = "c";
	$hash["WMAH1"] = "h";
        $hash["WMAH2"] = "h";
        $hash["WMAH3"] = "h";
        $hash["WMAH4"] = "h";
		$hash["WMAH5"] = "h";
        $hash["WMAHOV"] = "h";
        $hash["WMBH1"] = "h";
        $hash["WMBHOV"] = "h";
        // $hash["WMB0T"] = "h"; // "其它比分";
        $hash["WMCHOV"] = "h";

        $hash["WMAC1"] = "c";
        $hash["WMAC2"] = "c";
        $hash["WMAC3"] = "c";
        $hash["WMAC4"] = "c";
		$hash["WMAC5"] = "c";
        $hash["WMACOV"] = "c";

        $hash["HWMAH1"] = "h";
        $hash["HWMAH2"] = "h";
        $hash["HWMAH3"] = "h";
        $hash["HWMAH4"] = "h";
		$hash["HWMAH5"] = "h";

        $hash["HWMAC1"] = "c";
        $hash["HWMAC2"] = "c";
        $hash["HWMAC3"] = "c";
        $hash["HWMAC4"] = "c";
		$hash["HWMAC5"] = "c";

        $hash["RWMAH1"] = "h";
        $hash["RWMAH2"] = "h";
        $hash["RWMAH3"] = "h";
        $hash["RWMAH4"] = "h";
		$hash["RWMAH5"] = "h";
        $hash["RWMAHOV"] = "h";
        $hash["RWMBH1"] = "h";
        $hash["RWMBHOV"] = "h";
        $hash["RWMCHOV"] = "h";

        $hash["RWMAC1"] = "c";
        $hash["RWMAC2"] = "c";
        $hash["RWMAC3"] = "c";
        $hash["RWMAC4"] = "c";
		$hash["RWMAC5"] = "c";
        $hash["RWMACOV"] = "c";

        $hash["HRWMAH1"] = "h";
        $hash["HRWMAH2"] = "h";
        $hash["HRWMAH3"] = "h";
        $hash["HRWMAH4"] = "h";
		$hash["HRWMAH5"] = "h";

        $hash["HRWMAC1"] = "c";
        $hash["HRWMAC2"] = "c";
        $hash["HRWMAC3"] = "c";
        $hash["HRWMAC4"] = "c";
		$hash["HRWMAC5"] = "c";
        return isset($hash[$_rtype]) ? $hash[$_rtype] : "";
    }

    /**
     * 根据wtype获取内容显示
     * @param $showtype
     * @param $gtype
     * @param $wtype
     * @param $rtype
     * @param $msStr
     * @param $team_h
     * @param $team_c
     * @param $imp
     * @param $ptype
     * @param $isGtypeName
     * @return array|string|string[]
     */
    public function getWtypeName ($showtype,$gtype,$wtype,$rtype,$msStr,$team_h,$team_c,$imp,$ptype,$isGtypeName=true){
        global $ls_game_ary;
        $LS_game = $ls_game_ary;
        $gtype = strtoupper($gtype);
        $wtype = strtoupper($wtype);
        $rtype = strtoupper($rtype);
        $subtypestr = "";
        $menutype = "";
        $showtypeStr = "";
        $showRtype = "";
        $tmp_wtype = "";
        $showPlayType = "";
        $tHash = [
            "ODD" => "EOO",
            "EVEN" => "EOE",
            "RODD" => "REOO",
            "REVEN" => "REOE",
            "HREVEN" => "HREOE",
            "HRODD" => "HREOO"
        ];
        $_ary = ["ouh","ouc","houh","houc","rouh","rouc","hruh","hruc"];
		$pd_ary = ["pd","rpd","pdh","pdc"];
		$REgtype = ["BM","TT","TN","VB"]; // 有局數盤
		$specialBS = ["HM","OT","HRM","ROT"];
        $ms = "";
		try{
            $team_h = explode("-",$team_h)[0];
            $team_c = explode("-",$team_c)[0];

            // 取得節數語系
            if($gtype=="FT"){
                $subtypestr = $LS_game["showRtype"];
                if($this->checkWtypeIsHalf_menutype($wtype)){
                    $subtypestr = $LS_game["showRtype_h"];
                }
            } else {
                if(!empty($msStr)) {
                    $ms = explode('_', $msStr)[1];
                    if (!empty($ms)) {
                        $ms_str = $LS_game[$gtype . "_game_" . $ms . "_set"];
                        if ($ms_str == $gtype . "_game_" . $ms . "_set") {
                            $ms_str = "";
                        }
                        $subtypestr = $ms_str;
                    }
                }


                $htype="_HR_HRE_HPD_HM_HRM_HRPD_HOU_HROU_HWM_HRWM_HOUH_HOUC_HRUH_HRUC_HT_HEO_HRT_HREO_HPR_HPOU_HPEO_HPOUH_HPOUC_";
                if (strpos($htype,"_".$wtype."_") !== false){
                    if ($gtype=="BS"){
                        $subtypestr = $LS_game["showRtype_h_s"];
                    }else{
                        $subtypestr = $LS_game["showRtype_h"];
                    }
                }
            }

            //取得玩法語系
            if ($wtype=="T"){
                $_ary = ["EOO","EOE","HEOO","HEOE","EOH","EOC","HEOH","HEOC","ODD","RODD","EVEN","REVEN"];
                if(in_array($rtype, $_ary)){
                    $wtype = "eo";
                }
                $showRtype = $wtype;
                $rtype = isset($tHash[$rtype]) ? $tHash[$rtype] : $rtype;
            } else if($wtype=="HT"){
                $_ary = ["HEVEN","HODD"];
                if(in_array($rtype, $_ary)){
                    $wtype = "heo";
                }
                $showRtype = $wtype;
                $rtype = isset($tHash[$rtype]) ? $tHash[$rtype] : $rtype;
            } else if($wtype=="RT"){
                $_ary = ["REVEN","RODD"];
                if(in_array($rtype, $_ary)){
                    $wtype = "reo";
                }
                $showRtype = $wtype;
                $rtype = isset($tHash[$rtype]) ? $tHash[$rtype] : $rtype;
            }else if($wtype=="HRT"){
                $_ary = ["HREVEN","HRODD"];
                if(in_array($rtype, $_ary)){
                    $wtype = "hreo";
                }
                $showRtype = $wtype;
                $rtype = isset($tHash[$rtype]) ? $tHash[$rtype] : $rtype;
            } else if ($wtype=="SP" || $this->checkWtypeisSP($wtype)){
                $showRtype = substr($rtype,0,strlen($rtype)-1);
            } else{
                $showRtype = $wtype;
            }

            $tmp_wtype = strtolower($showRtype);

            if((substr($tmp_wtype,0,2)=="hp" || substr($tmp_wtype,0,1)=="p")
                && $tmp_wtype!="pd" && $tmp_wtype!="hpd"
                && $tmp_wtype!="pgf" && $tmp_wtype!="pgl" && $tmp_wtype!="pgfn" && $tmp_wtype!="pgln" && $tmp_wtype!="pg"
                && $tmp_wtype!="pgfh" && $tmp_wtype!="pgfc" && $tmp_wtype!="pglh" && $tmp_wtype!="pglc"
                && $tmp_wtype!="pa" && $tmp_wtype!="pah" && $tmp_wtype!="pac"
                && $gtype=="FT") {
                $showRtype = str_replace("p", "",$tmp_wtype);
            }
            $showRtype_key = $this->chgShowName_M("showRtype_".strtolower($showRtype),$gtype);
            $showPlayType = isset($LS_game[$showRtype_key]) ? $LS_game[$showRtype_key] : "";
            if(in_array($tmp_wtype, $_ary) && $gtype=="FT"){
                $t = substr($tmp_wtype,strlen($tmp_wtype)-1,1);
                if(strtoupper($t)=="H") {
                    $showPlayType = str_replace("*TEAM_H*", $team_h, $showPlayType);
                } else {
                    $showPlayType =  str_replace("*TEAM_C*", $team_c,$showPlayType);
                }

            }

            if($wtype !="FS"){
                // 網 羽 桌 排 分數盤
                if(in_array($gtype,$REgtype)){
                    $tmp_i = empty($ms) ? "0":"1";
                    $_type = $this->util_wtypeConverToR($wtype,true);
                    $showPlayType = isset($LS_game["showRtype_".$_type."_".$tmp_i."_".$gtype]) ? $LS_game["showRtype_".$_type."_".$tmp_i."_".$gtype] : "";
                    if(strpos($_type,"rf")!==false || strpos($_type,"rga")!==false || strpos($_type,"rgou")!==false) {
                        $showPlayType = $LS_game["showRtype_" . $_type . "_" . $gtype];
                    }
                    if($gtype=="TN" && $_type == "r" && $tmp_i == "1" && $subtypestr=="") {
                        $showPlayType = $LS_game["showRtype_" . $_type . "_main_TN"];
                    }

                    if($gtype=="BM" && ($this->checkWtypeIsWXP_BM(strtoupper($showRtype)) || $this->checkWtypeIsPTW_BM(strtoupper($showRtype)))){
                        $showPlayType = $LS_game["showRtype_".strtolower($showRtype)."_".$gtype];
                    }
                }

                
                // 台球 讓局 showRtype_r_SK
                if ($gtype=="SK"){
                    $_type = $this->util_wtypeConverToR($wtype,true);
                    $showPlayType = $LS_game["showRtype_".$_type."_".$gtype];
                }

                // 棒球 讓分 showRtype_r_bs
                if ($gtype=="BS" && ($this->checkWtypeIsOU($wtype) || $this->checkWtypeIsEO($wtype) || in_array($wtype,$specialBS)) ){
                    $_type = $this->util_wtypeConverToR($wtype,true);
                    $showPlayType = $LS_game["showRtype_".$_type."_".strtolower($gtype)];
                }
                // 籃 讓球
                if ($gtype=="BK" && $this->checkWtypeIsR($wtype)){
                    if(strpos($showRtype,"P")!==false) {
                        $showRtype = str_replace("P", "",$showRtype);
                    }
                    $showPlayType = $LS_game["showRtype_".strtolower($showRtype)."_s"];
                }

                // 籃球 除了讓球 其他玩法皆需要 "總分: xxx"
                if ($gtype=="BK" && !($this->checkWtypeIsR($wtype))){
                    $showPlayType = $LS_game["showRtype_".strtolower($showRtype)."_BK"];
                }

                // 籃球 最後一位數
                if(in_array($tmp_wtype, $pd_ary) && $gtype=="BK"){
                    $showPlayType = $LS_game["showRtype_".$tmp_wtype."_BK"];
                    $_rtype = strtolower($rtype);
                    $t = substr($_rtype,strlen($_rtype)-2,1);
                    if(strtoupper($t)=="H") {
                        $showPlayType = str_replace("*TEAM*", $team_h,$showPlayType);
                    }else{
                        $showPlayType = str_replace("*TEAM*", $team_c,$showPlayType);
                    }
                }

            }
        }catch (\Exception $e){
		    print_r($e->getMessage());exit;
        }

		$showPlayType = preg_replace("/\*TEAM_H\*/is",$team_h,$showPlayType);
		$showPlayType = preg_replace("/\*TEAM_C\*/is",$team_c,$showPlayType);
     
		$showtypeStr = strtolower($showtype)=="live" ? $LS_game["showtype_".$showtype] : "";
        $tilte_gtype = "";
		if($isGtypeName == true) {

            if ($gtype == "BK") {
                $tilte_gtype = explode("/", $LS_game["title_" . strtoupper($gtype)])[0];
            } else {
                $tilte_gtype = $LS_game["title_" . strtoupper($gtype)];
            }
            $tilte_gtype.=" ";
        }

        $showtypeStr = $this->isRBWtype($wtype) ? $LS_game["showtype_live"] : $showtypeStr;

		if($subtypestr==""){
            $menutype = $tilte_gtype.$showtypeStr." ".$showPlayType." ".$subtypestr;
        }else{
            $menutype = $tilte_gtype.$showtypeStr." ".$showPlayType." - ".$subtypestr;
        }

		/*$imp = "";
		$ptype = "";*/
		$tmp_menutype = "";

        $isRB = $this->isRBWtype($wtype) ? true : false;//判斷是不是滾過
		if($gtype=="FT"){
            $tmp_menutype = $menutype;
            if(!empty($ptype)){
                if(strpos($tmp_menutype,$ptype) !== false ) {
                    $tmp_menutype = str_replace($ptype, "",$tmp_menutype);
                }
                $ptype = str_replace("-","",$ptype);

                if( $imp == "Y" ){
                    if( $showtype=="live" || ($showtype =="parlay" && $isRB)){ //滾球&滾過
                        $tmp = explode(" ",$tmp_menutype);
                        $tmp_menutype = str_replace($tmp[0]." ".$tmp[1],$tmp[0]." ".$tmp[1]." ".$ptype." -",$tmp_menutype);
                    }else{
                        $tmp = explode(" ",$tmp_menutype);
                        $tmp_menutype = str_replace($tmp[0]." ".$tmp[1],$tmp[0]." ".$ptype." - ".$tmp[1],$tmp_menutype);
                    }
                }

            }
        }else if($gtype=="BS"){
            $tmp_menutype = $menutype;
            if(!empty($ptype)){
                if( strpos($tmp_menutype,$ptype) !== false ) {
                    $tmp_menutype =  str_replace($ptype, "",$tmp_menutype);
                }
                $ptype = str_replace("-","",$ptype);
                $ptype = preg_replace("/[\])}[{(]/is","",$ptype);
				if( $imp == "Y" ) $tmp_menutype = $tmp_menutype . " - ".$ptype;
			}
        }else{
            $tmp_menutype = $menutype;
        }
		if ($gtype=="BK" && $wtype == "RWM"){
			$tmp_menutype =$tmp_menutype."".$LS_game["showRtype_rwm"];
		}
		return $tmp_menutype;
    }

    /**
     * 获取支持对调的wtype
     * @param $wtype
     * @param $rtype
     * @return string[][]
     */
    public function get_wtype_swap($wtype,$rtype,$gtype){
        $wtype = strtoupper($wtype);
        $rtype = strtoupper($rtype);
        $gtype = strtoupper($gtype);

        $ary = [
            "R" => ["RH","RC"],
            "OU" => ["OUH","OUC"],
            "HR" => ["HRH","HRC"],
            "HOU" => ["HOUH","HOUC"],
            "EO" => ["ODD","EVEN"],
            "HEO" => ["HODD","HEVEN"],
            "REO" => ["RODD","REVEN"],
            "HREO"=> ["HRODD","HREVEN"],
            "AR" => ["ARH","ARC"],
            "BR" => ["BRH","BRC"],
            "CR" => ["CRH","CRC"],
            "DR" => ["DRH","DRC"],
            "ER" => ["ERH","ERC"],
            "FR" => ["FRH","FRC"],
            "AOU" => ["AOUO","AOUU"],
            "BOU" => ["BOUO","BOUU"],
            "COU" => ["COUO","COUU"],
            "DOU" => ["DOUO","DOUU"],
            "EOU" => ["EOUO","EOUU"],
            "FOU" => ["FOUO","FOUU"],
            "BH" => ["BHH","BHC"],
            "WE" => ["WEH","WEC"],
            "WB" => ["WBH","WBC"],
            "TS" => ["TSY","TSN"],
            "OUH" => ["OUHO","OUHU"],
            "OUC" => ["OUCO","OUCU"],
            "HOUH" => ["HOUHO","HOUHU"],
            "HOUC" => ["HOUCO","HOUCU"],
            "CS" => ["CSH","CSC"],
            "WN" => ["WNH","WNC"],
            "HG" => ["HGH","HGC"],
            "SB" => ["SBH","SBC"],
            "TK" => ["TKH","TKC"],
            "PA" => ["PAH","PAC"],
            "RCD" => ["RCDH","RCDC"],
            "OG" => ["OGY","OGN"],
            "OT" => ["OTY","OTN"],
            "HTS" => ["HTSY","HTSN"],
            "EOH" => ["EOHO","EOHE"],
            "EOC" => ["EOCO","EOCE"],
            "HEOH" => ["HEOHO","HEOHE"],
            "HEOC" => ["HEOCO","HEOCE"],
            //滚球部分
            "RPS" => ["RPSY","RPSN"],
            "TARU" => ["TARUO","TARUU"],
            "TBRU" => ["TBRUO","TBRUU"],
            "TDRU" => ["TDRUO","TDRUU"],
            "TERU" => ["TERUO","TERUU"],
            "RE" => ["REH","REC"],
            "ROU" => ["ROUH","ROUC"],
            "HRE" => ["HREH","HREC"],
            "HROU" => ["HROUH","HROUC"],
            "AROU" => ["AROUO","AROUU"],
            "BROU" => ["BROUO","BROUU"],
            "CROU" => ["CROUO","CROUU"],
            "DROU" => ["DROUO","DROUU"],
            "EROU" => ["EROUO","EROUU"],
            "FROU" => ["FROUO","FROUU"],
            "ARE" => ["AREH","AREC"],
            "BRE" => ["BREH","BREC"],
            "CRE" => ["CREH","CREC"],
            "DRE" => ["DREH","DREC"],
            "ERE" => ["EREH","EREC"],
            "FRE" => ["FREH","FREC"],
            "RWE" => ["RWEH","RWEC"],
            "RWB" => ["RWBH","RWBC"],
            "RTS" => ["RTSY","RTSN"],
            "RCS" => ["RCSH","RCSC"],
            "RWN" => ["RWNH","RWNC"],
            "RHG" => ["RHGH","RHGC"],
            "RSB" => ["RSBH","RSBC"],
            "RTS2" => ["RTS2Y","RTS2N"],
            "ROT" => ["ROTY","ROTN"],
        ];
        $wtype_RNB = ["RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO"];
        $wtype_RNC = ["RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC","RNCD","RNCE","RNCF",
            "RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU"];
        foreach ($wtype_RNB as $v){
            $ary[$v] = [$v."H",$v."C"];
        }

        foreach ($wtype_RNC as $v){
            $ary[$v] = [$v."H",$v."C"];
        }

        switch ($gtype){
            case "BK":
            case "BM":
            case "VB":
            case "TT":
                $ary["M"] = ["MH","MC"];
                $ary["RM"] = ["RMH","RMC"];
                $ary["ROUH"] = ["ROUHO","ROUHU"];
                $ary["ROUC"] = ["ROUCO","ROUCU"];
                break;
            case "BS":
                $ary["ROUH"] = ["ROUHO","ROUHU"];
                $ary["ROUC"] = ["ROUCO","ROUCU"];
                $ary["HROU"] = ["HROUH","HROUC"];
                $ary["HRUH"] = ["HRUHO","HRUHU"];
                $ary["HRUC"] = ["HRUCO","HRUCU"];
                break;
            case "SK":
                for($i=1;$i<=35;$i++){
                    $k = "F".$i;
                    if($i<10){ $k = "F0{$i}";}
                    $ary[$k] = [$k."H",$k."C"];
                }
                break;
            case "TN":
                $ary["RFA01"] = ["RFA01H","RFA01C"];
                $ary["RFA02"] = ["RFA02H","RFA02C"];
                $ary["RFA03"] = ["RFA03H","RFA03C"];
                $ary["RFA04"] = ["RFA04H","RFA04C"];
                $ary["RFA05"] = ["RFA05H","RFA05C"];
                $ary["RFA06"] = ["RFA06H","RFA06C"];
                $ary["RFA07"] = ["RFA07H","RFA07C"];
                $ary["RFA08"] = ["RFA08H","RFA08C"];
                $ary["RFA09"] = ["RFA09H","RFA09C"];
                $ary["RFA10"] = ["RFA10H","RFA10C"];
                $ary["RFA11"] = ["RFA11H","RFA11C"];
                $ary["RFA12"] = ["RFA12H","RFA12C"];
                $ary["RFA13"] = ["RFA13H","RFA13C"];

                $ary["RFB01"] = ["RFB01H","RFB01C"];
                $ary["RFB02"] = ["RFB02H","RFB02C"];
                $ary["RFB03"] = ["RFB03H","RFB03C"];
                $ary["RFB04"] = ["RFB04H","RFB04C"];
                $ary["RFB05"] = ["RFB05H","RFB05C"];
                $ary["RFB06"] = ["RFB06H","RFB06C"];
                $ary["RFB07"] = ["RFB07H","RFB07C"];
                $ary["RFB08"] = ["RFB08H","RFB08C"];
                $ary["RFB09"] = ["RFB09H","RFB09C"];
                $ary["RFB10"] = ["RFB10H","RFB10C"];
                $ary["RFB11"] = ["RFB11H","RFB11C"];
                $ary["RFB12"] = ["RFB12H","RFB12C"];
                $ary["RFB13"] = ["RFB13H","RFB13C"];

                $ary["RFC01"] = ["RFC01H","RFC01C"];
                $ary["RFC02"] = ["RFC02H","RFC02C"];
                $ary["RFC03"] = ["RFC03H","RFC03C"];
                $ary["RFC04"] = ["RFC04H","RFC04C"];
                $ary["RFC05"] = ["RFC05H","RFC05C"];
                $ary["RFC06"] = ["RFC06H","RFC06C"];
                $ary["RFC07"] = ["RFC07H","RFC07C"];
                $ary["RFC08"] = ["RFC08H","RFC08C"];
                $ary["RFC09"] = ["RFC09H","RFC09C"];
                $ary["RFC10"] = ["RFC10H","RFC10C"];
                $ary["RFC11"] = ["RFC11H","RFC11C"];
                $ary["RFC12"] = ["RFC12H","RFC12C"];
                $ary["RFC13"] = ["RFC13H","RFC13C"];
                $ary["RFC14"] = ["RFC14H","RFC14C"];
                $ary["RFC15"] = ["RFC15H","RFC15C"];
                $ary["RFC16"] = ["RFC16H","RFC16C"];
                $ary["RFC17"] = ["RFC17H","RFC17C"];
                $ary["RFC18"] = ["RFC18H","RFC18C"];
                $ary["RFC19"] = ["RFC19H","RFC19C"];
                $ary["RFC20"] = ["RFC20H","RFC20C"];
                $ary["RFC21"] = ["RFC21H","RFC21C"];
                $ary["RFC22"] = ["RFC22H","RFC22C"];
                $ary["RFC23"] = ["RFC23H","RFC23C"];
                $ary["RFC24"] = ["RFC24H","RFC24C"];
                $ary["RFC25"] = ["RFC25H","RFC25C"];
                $ary["RFC26"] = ["RFC26H","RFC26C"];
                $ary["RFC27"] = ["RFC27H","RFC27C"];
                $ary["RFC28"] = ["RFC28H","RFC28C"];
                $ary["RFC29"] = ["RFC29H","RFC29C"];
                $ary["RFC30"] = ["RFC30H","RFC30C"];
                $ary["RFC31"] = ["RFC31H","RFC31C"];
                $ary["RFC32"] = ["RFC32H","RFC32C"];
                $ary["RFC33"] = ["RFC33H","RFC33C"];
                $ary["RFC34"] = ["RFC34H","RFC34C"];
                $ary["RFC35"] = ["RFC35H","RFC35C"];
                $ary["RFC36"] = ["RFC36H","RFC36C"];
                $ary["RFC37"] = ["RFC37H","RFC37C"];
                $ary["RFC38"] = ["RFC38H","RFC38C"];
                $ary["RFC39"] = ["RFC39H","RFC39C"];
                $ary["RFC40"] = ["RFC40H","RFC40C"];
                $ary["RFC41"] = ["RFC41H","RFC41C"];
                $ary["RFC42"] = ["RFC42H","RFC42C"];
                $ary["RFC43"] = ["RFC43H","RFC43C"];
                $ary["RFC44"] = ["RFC44H","RFC44C"];
                $ary["RFC45"] = ["RFC45H","RFC45C"];
                $ary["RFC46"] = ["RFC46H","RFC46C"];
                $ary["RFC47"] = ["RFC47H","RFC47C"];
                $ary["RFC48"] = ["RFC48H","RFC48C"];
                $ary["RFC49"] = ["RFC49H","RFC49C"];
                $ary["RFC50"] = ["RFC50H","RFC50C"];

                $ary["RFD01"] = ["RFD01H","RFD01C"];
                $ary["RFD02"] = ["RFD02H","RFD02C"];
                $ary["RFD03"] = ["RFD03H","RFD03C"];
                $ary["RFD04"] = ["RFD04H","RFD04C"];
                $ary["RFD05"] = ["RFD05H","RFD05C"];
                $ary["RFD06"] = ["RFD06H","RFD06C"];
                $ary["RFD07"] = ["RFD07H","RFD07C"];
                $ary["RFD08"] = ["RFD08H","RFD08C"];
                $ary["RFD09"] = ["RFD09H","RFD09C"];
                $ary["RFD10"] = ["RFD10H","RFD10C"];
                $ary["RFD11"] = ["RFD11H","RFD11C"];
                $ary["RFD12"] = ["RFD12H","RFD12C"];
                $ary["RFD13"] = ["RFD13H","RFD13C"];

                $ary["RFE01"] = ["RFE01H","RFE01C"];
                $ary["RFE02"] = ["RFE02H","RFE02C"];
                $ary["RFE03"] = ["RFE03H","RFE03C"];
                $ary["RFE04"] = ["RFE04H","RFE04C"];
                $ary["RFE05"] = ["RFE05H","RFE05C"];
                $ary["RFE06"] = ["RFE06H","RFE06C"];
                $ary["RFE07"] = ["RFE07H","RFE07C"];
                $ary["RFE08"] = ["RFE08H","RFE08C"];
                $ary["RFE09"] = ["RFE09H","RFE09C"];
                $ary["RFE10"] = ["RFE10H","RFE10C"];
                $ary["RFE11"] = ["RFE11H","RFE11C"];
                $ary["RFE12"] = ["RFE12H","RFE12C"];
                $ary["RFE13"] = ["RFE13H","RFE13C"];
                $ary["RFE14"] = ["RFE14H","RFE14C"];
                $ary["RFE15"] = ["RFE15H","RFE15C"];
                $ary["RFE16"] = ["RFE16H","RFE16C"];
                $ary["RFE17"] = ["RFE17H","RFE17C"];
                $ary["RFE18"] = ["RFE18H","RFE18C"];
                $ary["RFE19"] = ["RFE19H","RFE19C"];
                $ary["RFE20"] = ["RFE20H","RFE20C"];
                $ary["RFE21"] = ["RFE21H","RFE21C"];
                $ary["RFE22"] = ["RFE22H","RFE22C"];
                $ary["RFE23"] = ["RFE23H","RFE23C"];
                $ary["RFE24"] = ["RFE24H","RFE24C"];
                $ary["RFE25"] = ["RFE25H","RFE25C"];
                $ary["RFE26"] = ["RFE26H","RFE26C"];
                $ary["RFE27"] = ["RFE27H","RFE27C"];
                $ary["RFE28"] = ["RFE28H","RFE28C"];
                $ary["RFE29"] = ["RFE29H","RFE29C"];
                $ary["RFE30"] = ["RFE30H","RFE30C"];
                $ary["RFE31"] = ["RFE31H","RFE31C"];
                $ary["RFE32"] = ["RFE32H","RFE32C"];
                $ary["RFE33"] = ["RFE33H","RFE33C"];
                $ary["RFE34"] = ["RFE34H","RFE34C"];
                $ary["RFE35"] = ["RFE35H","RFE35C"];
                $ary["RFE36"] = ["RFE36H","RFE36C"];
                $ary["RFE37"] = ["RFE37H","RFE37C"];
                $ary["RFE38"] = ["RFE38H","RFE38C"];
                $ary["RFE39"] = ["RFE39H","RFE39C"];
                $ary["RFE40"] = ["RFE40H","RFE40C"];
                $ary["RFE41"] = ["RFE41H","RFE41C"];
                $ary["RFE42"] = ["RFE42H","RFE42C"];
                $ary["RFE43"] = ["RFE43H","RFE43C"];
                $ary["RFE44"] = ["RFE44H","RFE44C"];
                $ary["RFE45"] = ["RFE45H","RFE45C"];
                $ary["RFE46"] = ["RFE46H","RFE46C"];
                $ary["RFE47"] = ["RFE47H","RFE47C"];
                $ary["RFE48"] = ["RFE48H","RFE48C"];
                $ary["RFE49"] = ["RFE49H","RFE49C"];
                $ary["RFE50"] = ["RFE50H","RFE50C"];
                $ary["ROUH"] = ["ROUHO","ROUHU"];
                $ary["ROUC"] = ["ROUCO","ROUCU"];
                break;
        }
        switch ($wtype){
            case "T":
                if(in_array($rtype,$ary["EO"])){ $wtype = "EO"; }
                break;
            case "HT":
                if(in_array($rtype,$ary["HEO"])){ $wtype = "HEO"; }
                break;
            case "RT":
                if(in_array($rtype,$ary["REO"])){ $wtype = "REO"; }
                break;
            case "HRT":
                if(in_array($rtype,$ary["HREO"])){ $wtype = "HREO"; }
                break;
        }

        return isset($ary[$wtype]) ? $ary[$wtype] : [];
    }



}
