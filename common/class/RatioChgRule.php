<?php


class RatioChgRule
{
    public function __construct(){

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
     * 是否为独赢类
     * @param $rtype
     * @return bool
     */
    public function chkIsM ($rtype)
    {
        $rtype = strtoupper($rtype);
        $isM = false;

        $M_wtype = ["A", "B", "C", "D", "E", "F"];
        $F_wtype = ["01", "02"];
        $RF_wtype = [
            "01", "02", "03", "04", "05", "06", "07", "08", "09", "10",
            "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
            "21", "22", "23", "24", "25", "26", "27", "28", "29", "30",
            "31", "32", "33", "34", "35"
        ];

        //Ricky 2018-02-21 UAT-會員端-盤面-下一點球獨贏，幫改成四捨五入獨贏的進位法
        $RPX_wtype = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O"];

        $ary = ["M","HM","RM","HRM"];
        foreach ($M_wtype as $v){
            $ary[] = $v."M";
            $ary[] = $v."RM";
        }

        foreach ($F_wtype as $v){
            $ary[] = "F".$v;
        }

        foreach ($RF_wtype as $v){
            $ary[] = "RF".$v;
        }

        foreach ($RPX_wtype as $v){ //Ricky 2018-02-21 UAT-會員端-盤面-下一點球獨贏，幫改成四捨五入獨贏的進位法
            $ary[] = "RPX".$v;
        }

        if(in_array($rtype,$ary)){
            $isM = true;
        } else {
            //wtype not find,find rtype
            $tmpRtype = substr($rtype, 0, strlen($rtype) - 1);
            $choid_team = substr($rtype, strlen($rtype) - 1, 1);
            if (isset($ary[$tmpRtype]) && preg_match("/(H|C|N)/is", $choid_team)) {
                $isM = true;
            }
        }

        // 2018-03-19 PJB-188 網球下一局獨贏 - (5)所有會員端-所有注單&盤面-下一局獨贏-應為四捨五入獨贏的進位法
        if (preg_match("/^RF(A|B|C|D|E)[0-5][0-9]$/is", $rtype)) $isM = true;

        return $isM;
    }

    /**
     * 是否为冠军
     * @param $wtype
     * @return bool
     */
    public function chkIsFS ($wtype)
    {
        $isFS = false;
        $ary = ["FS","SFS"];
        if (in_array($wtype,$ary)){$isFS = true;}
        return $isFS;
    }

    /**
     * 是否为大小或让球类
     * @param $wtype
     * @return bool
     */
    public function chkIsRorOU ($wtype)
    {
        $wtype = strtoupper($wtype);
        $isRorOU = false;
        $OU = ["OU", "ROU", "HOU", "HROU", "OUH", "OUC", "ROUH", "ROUC", "HOUH", "HOUC", "HROUH", "HROUC", "POU", "HPOU", "POUH", "POUC", "HPOUH", "HPOUC", "ROUHO", "ROUHU", "ROUCO", "ROUCU"];
        $R = ["R", "RE", "HR", "HRE", "RH", "REH", "REC", "HRH", "HRC", "HREH", "HREC", "PR", "HPR", "PRH", "PRC", "HPRH", "HPRC"];
        $DOUBLE = [
            "TARU", "TARUO", "TARUU",
            "TBRU", "TBRUO", "TBRUU",
            "TDRU", "TDRUO", "TDRUU",
            "TERU", "TERUO", "TERUU",
            "EO", "HEO", "REO", "HREO", "EOH", "EOC", "HEOH", "HEOC", "EOO", "EOE", "HEOO", "HEOE", "REOO", "REOE", "HREOO", "HREOE"
            , "RSH1", "RSH2", "RSH3", "RSH4", "RSH5", "RSH6", "RSH7", "RSH8", "RSH9", "RSHA", "RSHB", "RSHC", "RSHD", "RSHE", "RSHF", "RSHG", "RSHH", "RSHI", "RSHJ", "RSHK"
            , "RSHL", "RSHM", "RSHN", "RSHO", "RSHP", "RSHQ", "RSHR", "RSHS", "RSHT", "RSHU"
            , "RSC1", "RSC2", "RSC3", "RSC4", "RSC5", "RSC6", "RSC7", "RSC8", "RSC9", "RSCA", "RSCB", "RSCC", "RSCD", "RSCE", "RSCF", "RSCG", "RSCH", "RSCI", "RSCJ", "RSCK"
            , "RSCL", "RSCM", "RSCN", "RSCO", "RSCP", "RSCQ", "RSCR", "RSCS", "RSCT", "RSCU"
            , "RNB1", "RNB2", "RNB3", "RNB4", "RNB5", "RNB6", "RNB7", "RNB8", "RNB9", "RNBA", "RNBB", "RNBC", "RNBD", "RNBE", "RNBF", "RNBG", "RNBH", "RNBI", "RNBJ", "RNBK"
            , "RNBL", "RNBM", "RNBN", "RNBO", "RNBP", "RNBQ", "RNBR", "RNBS", "RNBT", "RNBU"
            , "RNC1", "RNC2", "RNC3", "RNC4", "RNC5", "RNC6", "RNC7", "RNC8", "RNC9", "RNCA", "RNCB", "RNCC", "RNCD", "RNCE", "RNCF", "RNCG", "RNCH", "RNCI", "RNCJ", "RNCK"
            , "RNCL", "RNCM", "RNCN", "RNCO", "RNCP", "RNCQ", "RNCR", "RNCS", "RNCT", "RNCU"
            , "PEO", "HPEO", "PREO", "HPREO", "PEOH", "PEOC", "HPEOH", "HPEOC", "PEOO", "PEOE", "HPEOO", "HPEOE"
        ];
        $OU15 = [
            "AOU", "BOU", "COU", "DOU", "EOU", "FOU",
            "APOU", "BPOU", "CPOU", "DPOU", "EPOU", "FPOU",
            "PAOU", "PBOU", "PCOU", "PDOU", "PEOU", "PFOU"
        ];
        $R15 = [
            "AR", "BR", "CR", "DR", "ER", "FR",
            "APR", "BPR", "CPR", "DPR", "EPR", "FPR",
            "PAR", "PBR", "PCR", "PDR", "PER", "PFR"
        ];
        $RE15 = [
            "ARE", "BRE", "CRE", "DRE", "ERE", "FRE"
        ];
        $ROU15 = ["AROU", "BROU", "CROU", "DROU", "EROU", "FROU"];
        $ROUHC = ["ROUH", "ROUC", "HRUH", "HRUC"];

        $ary = array_merge($R, $OU, $DOUBLE, $OU15, $R15, $ROU15,$RE15, $ROUHC);
        if (in_array($wtype, $ary)) {
            $isRorOU = true;
        }

        return $isRorOU;
    }

    /**
     * 赔率处理
     * @param $odds 赔率
     * @param $wtype 类型
     * @return float|int|string
     */
    public function chgRatio ($odds,$wtype)
    {
        $odds = $odds * 1;
        $isM = $this->chkIsM($wtype);
        $isFS = $this->chkIsFS($wtype);
        $isRorOU = $this->chkIsRorOU($wtype);

        if ($isRorOU) {
            return $this->formatNumber($odds, 2, 2);
        } else {
            if (!($isM || $isFS) && $odds == 0) {
                return round($odds, 0);
            } else if (($isM || $isFS) && 10 <= $odds && $odds < 98.5) {        //獨贏or冠軍賠率10~98.5 秀小數點後一位
                return round($odds, 1);
            } else if (!($isM || $isFS) && 5 <= $odds && $odds < 20) {            //非獨贏賠率5~20 秀小數點後一位
                return round($odds, 1);
            } else if (!($isM || $isFS) && 20 <= $odds) {                    //非獨贏賠率大於等於20秀整數
                return round($odds, 0);
            } else if (($isM || $isFS) && 101 <= $odds) {                    //獨贏or冠軍賠率大於等於101秀整數
                return round($odds, 0);
            }
            return round($odds, 2);
        }
    }
}