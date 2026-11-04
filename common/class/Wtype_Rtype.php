<?php
/**
 * 各个球类的wtype=>rtype
 * Class Wtype_Rtype
 */

class Wtype_Rtype
{

    public function __construct()
    {
    }

    /**
     * 根据rtype获取wtype
     * @param $gtype
     * @param $rtype
     * @return int|string
     */
    public function get_rtype_wtype($gtype,$rtype){
        $ary = $this->getGtype($gtype)["ALL"];
        $wtype = "";
        foreach ($ary as $k => $v){
            if(in_array($rtype,$v)){
                $wtype = $k;
                break;
            }
        }

        return $wtype;
    }

    /**
     * 根据wtype获取所有rtype
     * @param $gtype
     * @param $wtype
     * @return array|mixed
     */
    public function get_wtype_rtype($gtype,$wtype){
        $ary = $this->getGtype($gtype)["ALL"];
        return isset($ary[$wtype]) ? $ary[$wtype] : [];
    }

    /**
     * 获取gtype类的所有玩法
     * @param $gtype
     * @return array
     */
    public function getGtype($gtype){
        $ary = [];
        switch ($gtype){
            case "FT":
                $ary = $this->getFT();
                break;
            case "BK":
                $ary = $this->getBK();
                break;
            case "BM":
                $ary = $this->getBM();
                break;
            case "BS":
                $ary = $this->getBS();
                break;
            case "SK":
                $ary = $this->getSK();
                break;
            case "TT":
                $ary = $this->getTT();
                break;
            case "VB":
                $ary = $this->getVB();
                break;
            case "TN":
                $ary = $this->getTN();
                break;
            case "OP":
                $ary = $this->getOP();
            default:
                $ary = $this->getOP();
                break;
        }

        return $ary;
    }

    /**
     * 足球所有玩法
     * @return array
     */
    public function getFT(){
        $r = [
            "R" => ["RH","RC"],
            "OU" => ["OUH","OUC"],
            "HR" => ["HRH","HRC"],
            "HOU" => ["HOUH","HOUC"],
            "M" => ["MH","MC","MN"],
            "HM" => ["HMH","HMC","HMN"],
            "EO" => ["EOO","EOE"],
            "T" => ["T01","T23","T46","OVER","0~1","2~3","4~6"],
            "F" => ["FHH","FHN","FHC","FNH","FNN","FNC","FCH","FCN","FCC"],
            "PG" => ["PGFH","PGFC","PGFN","PGLH","PGLC","PGLN"],  //最先/最後進球
            "OS" => ["OSFH","OSFC","OSFN","OSLH","OSLC","OSLN"],  //最先/最後越位
            "ST" => ["STFH","STFC","STFN","STLH","STLC","STLN"],  //最先/最後替補球員
            "CN" => ["CNFH","CNFC","CNFN","CNLH","CNLC","CNLN"],  //第一顆/最後一顆角球
            "CD" => ["CDFH","CDFC","CDFN","CDLH","CDLC","CDLN"],  //第一張/最後一張卡=>首個/最後罰牌
            "RC" => ["RCFH","RCFC","RCLH","RCLC"],
            "YC" => ["YCFH","YCFC","YCLH","YCLC"],  //第一張/最後一張黃卡
            "GA" => ["GAFH","GAFC","GALH","GALC"],  //有失球/沒有失球
            "PD" => ["H1C0","H2C0","H2C1","H3C0","H3C1","H3C2","H4C0","H4C1","H4C2","H4C3","H5C0","H5C1","H5C2","H5C3","H5C4","H6C0","H6C1","H6C2","H6C3","H6C4","H6C5","H7C0","H7C1","H7C2","H7C3","H7C4","H7C5","H7C6","H8C0","H8C1","H8C2","H8C3","H8C4","H8C5","H8C6","H8C7","H9C0","H9C1","H9C2","H9C3","H9C4","H9C5","H9C6","H9C7","H9C8","H10C0","H10C1","H10C2","H10C3","H10C4","H10C5","H10C6","H10C7","H10C8","H10C9",                       "H0C0","H1C1","H2C2","H3C3","H4C4","H5C5","H6C6","H7C7","H8C8","H9C9","H10C10","H0C1","H0C2","H1C2","H0C3","H1C3","H2C3","H0C4","H1C4","H2C4","H3C4","H0C5","H1C5","H2C5","H3C5","H4C5","H0C6","H1C6","H2C6","H3C6","H4C6","H5C6","H0C7","H1C7","H2C7","H3C7","H4C7","H5C7","H6C7","H0C8","H1C8","H2C8","H3C8","H4C8","H5C8","H6C8","H7C8","H0C9","H1C9","H2C9","H3C9","H4C9","H5C9","H6C9","H7C9","H8C9","H0C10","H1C10","H2C10","H3C10","H4C10","H5C10","H6C10","H7C10","H8C10","H9C10","OVH"],
            "HPD" => ["HH1C0","HH2C0","HH2C1","HH3C0","HH3C1","HH3C2","HH4C0","HH4C1","HH4C2","HH4C3","HH5C0","HH5C1","HH5C2","HH5C3","HH5C4","HH6C0","HH6C1","HH6C2","HH6C3","HH6C4","HH6C5","HH7C0","HH7C1","HH7C2","HH7C3","HH7C4","HH7C5","HH7C6","HH8C0","HH8C1","HH8C2","HH8C3","HH8C4","HH8C5","HH8C6","HH8C7","HH9C0","HH9C1","HH9C2","HH9C3","HH9C4","HH9C5","HH9C6","HH9C7","HH9C8","HH10C0","HH10C1","HH10C2","HH10C3","HH10C4","HH10C5","HH10C6","HH10C7","HH10C8","HH10C9","HH0C0","HH1C1","HH2C2","HH3C3","HH4C4","HH5C5","HH6C6","HH7C7","HH8C8","HH9C9","HH10C10","HH0C1","HH0C2","HH1C2","HH0C3","HH1C3","HH2C3","HH0C4","HH1C4","HH2C4","HH3C4","HH0C5","HH1C5","HH2C5","HH3C5","HH4C5","HH0C6","HH1C6","HH2C6","HH3C6","HH4C6","HH5C6","HH0C7","HH1C7","HH2C7","HH3C7","HH4C7","HH5C7","HH6C7","HH0C8","HH1C8","HH2C8","HH3C8","HH4C8","HH5C8","HH6C8","HH7C8","HH0C9","HH1C9" ,"HH2C9","HH3C9","HH4C9","HH5C9","HH6C9","HH7C9","HH8C9","HH0C10","HH1C10","HH2C10","HH3C10","HH4C10","HH5C10","HH6C10","HH7C10","HH8C10","HH9C10","HOVH"],
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
            "AM" => ["AMH","AMC","AMN"],
            "BM" => ["BMH","BMC","BMN"],
            "CM" => ["CMH","CMC","CMN"],
            "DM" => ["DMH","DMC","DMN"],
            "EM" => ["EMH","EMC","EMN"],
            "FM" => ["FMH","FMC","FMN"],
            "HT" => ["HT0","HT1","HT2","HTOV"],
            "WM" => ["WMH1","WMH2","WMH3","WMHOV","WMC1","WMC2","WMC3","WMCOV","WM0","WMN"],
            "DC" => ["DCHN","DCCN","DCHC"],
            "W3" => ["W3H","W3C","W3N"],
            "BH" => ["BHH","BHC"],
            "WE" => ["WEH","WEC"],
            "WB" => ["WBH","WBC"],
            "TS" => ["TSY","TSN"],
            "OUH" => ["OUHO","OUHU"],
            "OUC" => ["OUCO","OUCU"],
            "HOUH" => ["HOUHO","HOUHU"],
            "HOUC" => ["HOUCO","HOUCU"],
            "HEO" => ["HEOO","HEOE"],
            "CS" => ["CSH","CSC"],
            "WN" => ["WNH","WNC"],
            "F2G" => ["F2GH","F2GC","F2GN"],
            "F3G" => ["F3GH","F3GC","F3GN"],
            "HG" => ["HGH","HGC"],
            "MG" => ["MGH","MGC","MGN"],
            "SB" => ["SBH","SBC"],
            "FG" => ["FGS","FGH","FGN","FGP","FGF","FGO"],
            "T3G" => ["T3G1","T3G2","T3GN"],
            "T1G" => ["T1G1","T1G2","T1G3","T1G4","T1G5","T1G6","T1GN"],
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
            "MW" => ["MWH","MWC","MWHOT","MWCOT","MWHPK","MWCPK"],
            "MQ" => ["MQH","MQC","MQHOT","MQCOT","MQHPK","MQCPK"],
            "MOU" => ["MOUA","MOUB","MOUC","MOUD"],
            "MPG" => ["MPG"],
            "MTS" => ["MTS"],
            "DU" => ["DUA","DUB","DUC","DUD"],
            "DG" => ["DG"],
            "DS" => ["DS"],
            "OUE" => ["OUEA","OUEB","OUEC","OUED"],
            "OUP" => ["OUPA","OUPB","OUPC","OUPD"],
            "OUT" => ["OUTA","OUTB","OUTC","OUTD"],
            //MOUA
            "MOUA" => ["MOUAHO", "MOUAHU", "MOUACO", "MOUACU", "MOUANO", "MOUANU"],
            //MOUB
            "MOUB" => ["MOUBHO", "MOUBHU", "MOUBCO", "MOUBCU", "MOUBNO", "MOUBNU"],
            //MOUC
            "MOUC" => ["MOUCHO", "MOUCHU", "MOUCCO", "MOUCCU", "MOUCNO", "MOUCNU"],
            //MOUD
            "MOUD" => ["MOUDHO", "MOUDHU", "MOUDCO", "MOUDCU", "MOUDNO", "MOUDNU"],
            //MPG
            "MPG" => ["MPGHH", "MPGHC", "MPGCH", "MPGCC", "MPGNH", "MPGNC"],
            //MTS
            "MTS" => ["MTSHY", "MTSHN", "MTSCY", "MTSCN", "MTSNY", "MTSNN"],
            //DUA
            "DUA" => ["DUAHO", "DUAHU", "DUACO", "DUACU", "DUASO", "DUASU"],
            //DUB
            "DUB" => ["DUBHO", "DUBHU", "DUBCO", "DUBCU", "DUBSO", "DUBSU"],
            //DUC
            "DUC" => ["DUCHO", "DUCHU", "DUCCO", "DUCCU", "DUCSO", "DUCSU"],
            //DUD
            "DUD" => ["DUDHO", "DUDHU", "DUDCO", "DUDCU", "DUDSO", "DUDSU"],
            //DG
            "DG" => ["DGHH", "DGHC", "DGCH", "DGCC", "DGSH", "DGSC"],
            //DS
            "DS" => ["DSHY", "DSHN", "DSCY", "DSCN", "DSSY", "DSSN"],
            //OUEA
            "OUEA" => ["OUEAOO", "OUEAOE", "OUEAUO", "OUEAUE"],
            //OUEB
            "OUEB" => ["OUEBOO", "OUEBOE", "OUEBUO", "OUEBUE"],
            //OUEC
            "OUEC" => ["OUECOO", "OUECOE", "OUECUO", "OUECUE"],
            //OUED
            "OUED" => ["OUEDOO", "OUEDOE", "OUEDUO", "OUEDUE"],
            //OUPA
            "OUPA" => ["OUPAOH", "OUPAOC", "OUPAUH", "OUPAUC"],
            //OUPB
            "OUPB" => ["OUPBOH", "OUPBOC", "OUPBUH", "OUPBUC"],
            //OUPC
            "OUPC" => ["OUPCOH", "OUPCOC", "OUPCUH", "OUPCUC"],
            //OUPD
            "OUPD" => ["OUPDOH", "OUPDOC", "OUPDUH", "OUPDUC"],
            //OUTA
            "OUTA" => ["OUTAOY", "OUTAON", "OUTAUY", "OUTAUN"],
            //OUTB
            "OUTB" => ["OUTBOY", "OUTBON", "OUTBUY", "OUTBUN"],
            //OUTC
            "OUTC" => ["OUTCOY", "OUTCON", "OUTCUY", "OUTCUN"],
            //OUTD
            "OUTD" => ["OUTDOY", "OUTDON", "OUTDUY", "OUTDUN"],
        ];
        $re= [
            "RPS" => ["RPSY","RPSN"],
            "TARU" => ["TARUO","TARUU"],
            "TBRU" => ["TBRUO","TBRUU"],
            "TDRU" => ["TDRUO","TDRUU"],
            "TERU" => ["TERUO","TERUU"],
            "RTW" => ["RTWH1","RTWH2","RTWHOV","RTWC1","RTWC2","RTWCOV","RTW0","RTWN"],
            "RPF" => ["RPF1","RPF2","RPF3","RPFOV"],
            "RPXA" => ["RPXAH","RPXAC","RPXAN"],
            "RPXB" => ["RPXBH","RPXBC","RPXBN"],
            "RPXC" => ["RPXCH","RPXCC","RPXCN"],
            "RPXD" => ["RPXDH","RPXDC","RPXDN"],
            "RPXE" => ["RPXEH","RPXEC","RPXEN"],
            "RPXF" => ["RPXFH","RPXFC","RPXFN"],
            "RPXG" => ["RPXGH","RPXGC","RPXGN"],
            "RPXH" => ["RPXHH","RPXHC","RPXHN"],
            "RPXI" => ["RPXIH","RPXIC","RPXIN"],
            "RPXJ" => ["RPXJH","RPXJC","RPXJN"],
            "RPXK" => ["RPXKH","RPXKC","RPXKN"],
            "RPXL" => ["RPXLH","RPXLC","RPXLN"],
            "RPXM" => ["RPXMH","RPXMC","RPXMN"],
            "RPXN" => ["RPXNH","RPXNC","RPXNN"],
            "RPXO" => ["RPXOH","RPXOC","RPXON"],
            "RE" => ["REH","REC"],
            "ROU" => ["ROUH","ROUC"],
            "HRE" => ["HREH","HREC"],
            "HROU" => ["HROUH","HROUC"],
            "RM" => ["RMH","RMC","RMN"],
            "HRM" => ["HRMH","HRMC","HRMN"],
            "REO" => ["REOO","REOE"],
            "RT" => ["RT01","RT23","RT46","ROVER","R0~1","R2~3","R4~6"],
            "RDT" => ["RDT0","RDT1","RDT2","RDTOV"],
            "RF" => ["RFHH","RFHN","RFHC","RFNH","RFNN","RFNC","RFCH","RFCN","RFCC"],
            "RPD" => ["RH1C0","RH2C0","RH2C1","RH3C0","RH3C1","RH3C2","RH4C0","RH4C1","RH4C2","RH4C3","RH5C0","RH5C1","RH5C2","RH5C3","RH5C4","RH6C0","RH6C1","RH6C2","RH6C3","RH6C4","RH6C5","RH7C0","RH7C1","RH7C2","RH7C3","RH7C4","RH7C5","RH7C6","RH8C0","RH8C1","RH8C2","RH8C3","RH8C4","RH8C5","RH8C6","RH8C7","RH9C0","RH9C1","RH9C2","RH9C3","RH9C4","RH9C5","RH9C6","RH9C7","RH9C8","RH10C0","RH10C1","RH10C2","RH10C3","RH10C4","RH10C5","RH10C6","RH10C7","RH10C8","RH10C9","RH0C0","RH1C1","RH2C2","RH3C3","RH4C4","RH5C5","RH6C6","RH7C7","RH8C8","RH9C9","RH10C10","RH0C1","RH0C2","RH1C2","RH0C3","RH1C3","RH2C3","RH0C4","RH1C4","RH2C4","RH3C4","RH0C5","RH1C5","RH2C5","RH3C5","RH4C5","RH0C6","RH1C6","RH2C6","RH3C6","RH4C6","RH5C6","RH0C7","RH1C7","RH2C7","RH3C7","RH4C7","RH5C7","RH6C7","RH0C8","RH1C8","RH2C8","RH3C8","RH4C8","RH5C8","RH6C8","RH7C8","RH0C9","RH1C9","RH2C9","RH3C9","RH4C9","RH5C9","RH6C9","RH7C9","RH8C9","RH0C10","RH1C10","RH2C10","RH3C10","RH4C10","RH5C10","RH6C10","RH7C10","RH8C10","RH9C10","ROVH"],
            "HRPD" => ["HRH1C0","HRH2C0","HRH2C1","HRH3C0","HRH3C1","HRH3C2","HRH4C0","HRH4C1","HRH4C2","HRH4C3","HRH5C0","HRH5C1","HRH5C2","HRH5C3","HRH5C4","HRH6C0","HRH6C1","HRH6C2","HRH6C3","HRH6C4","HRH6C5","HRH7C0",         "HRH7C1","HRH7C2","HRH7C3","HRH7C4","HRH7C5","HRH7C6","HRH8C0","HRH8C1","HRH8C2","HRH8C3","HRH8C4","HRH8C5","HRH8C6","HRH8C7","HRH9C0","HRH9C1","HRH9C2","HRH9C3","HRH9C4","HRH9C5","HRH9C6","HRH9C7","HRH9C8"         ,"HRH10C0","HRH10C1","HRH10C2","HRH10C3","HRH10C4","HRH10C5","HRH10C6","HRH10C7","HRH10C8","HRH10C9","HRH0C0","HRH1C1","HRH2C2","HRH3C3","HRH4C4","HRH5C5","HRH6C6","HRH7C7","HRH8C8","HRH9C9","HRH10C10",         "HRH0C1","HRH0C2","HRH1C2","HRH0C3","HRH1C3","HRH2C3","HRH0C4","HRH1C4","HRH2C4","HRH3C4","HRH0C5","HRH1C5","HRH2C5","HRH3C5","HRH4C5","HRH0C6","HRH1C6","HRH2C6","HRH3C6","HRH4C6","HRH5C6","HRH0C7","HRH1C7"        ,"HRH2C7","HRH3C7","HRH4C7","HRH5C7","HRH6C7","HRH0C8","HRH1C8","HRH2C8","HRH3C8","HRH4C8","HRH5C8","HRH6C8","HRH7C8","HRH0C9","HRH1C9","HRH2C9","HRH3C9","HRH4C9","HRH5C9","HRH6C9","HRH7C9","HRH8C9",         "HRH0C10","HRH1C10","HRH2C10","HRH3C10","HRH4C10","HRH5C10","HRH6C10","HRH7C10","HRH8C10","HRH9C10","HROVH"],
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
            "ARM" => ["ARMH","ARMC","ARMN"],
            "BRM" => ["BRMH","BRMC","BRMN"],
            "CRM" => ["CRMH","CRMC","CRMN"],
            "DRM" => ["DRMH","DRMC","DRMN"],
            "ERM" => ["ERMH","ERMC","ERMN"],
            "FRM" => ["FRMH","FRMC","FRMN"],
            "HRT" => ["HRT0","HRT1","HRT2","HRTOV"],
            "RWM" => ["RWMH1","RWMH2","RWMH3","RWMHOV","RWMC1","RWMC2","RWMC3","RWMCOV","RWM0","RWMN"],
            "RDC" => ["RDCHN","RDCCN","RDCHC"],
            "RWE" => ["RWEH","RWEC"],
            "RWB" => ["RWBH","RWBC"],
            "ARG" => ["ARGH","ARGC","ARGN"],
            "BRG" => ["BRGH","BRGC","BRGN"],
            "CRG" => ["CRGH","CRGC","CRGN"],
            "DRG" => ["DRGH","DRGC","DRGN"],
            "ERG" => ["ERGH","ERGC","ERGN"],
            "FRG" => ["FRGH","FRGC","FRGN"],
            "GRG" => ["GRGH","GRGC","GRGN"],
            "HRG" => ["HRGH","HRGC","HRGN"],
            "IRG" => ["IRGH","IRGC","IRGN"],
            "JRG" => ["JRGH","JRGC","JRGN"],
            "RTS" => ["RTSY","RTSN"],
            "ROUH" => ["ROUHO","ROUHU"],
            "ROUC" => ["ROUCO","ROUCU"],
            "HRUH" => ["HRUHO","HRUHU"],
            "HRUC" => ["HRUCO","HRUCU"],
            "HREO" => ["HREOO","HREOE"],
            "RCS" => ["RCSH","RCSC"],
            "RWN" => ["RWNH","RWNC"],
            "RHG" => ["RHGH","RHGC"],
            "RMG" => ["RMGH","RMGC","RMGN"],
            "RSB" => ["RSBH","RSBC"],
            "RT3G" => ["RT3G1","RT3G2","RT3GN"],
            "RT1G" => ["RT1G1","RT1G2","RT1G3","RT1G4","RT1G5","RT1G6","RT1GN"],
            "RTS2" => ["RTS2Y","RTS2N"],
            "ROT" => ["ROTY","ROTN"],
            "RMOU" => ["RMUA","RMUB","RMUC","RMUD"],
            "RMPG" => ["RMPG"],
            "RMTS" => ["RMTS"],
            "RDU" => ["RDUA","RDUB","RDUC","RDUD"],
            "RDG" => ["RDG"],
            "RDS" => ["RDS"],
            "ROUE" => ["RUEA","RUEB","RUEC","RUED"],
            "ROUP" => ["RUPA","RUPB","RUPC","RUPD"],
            "ROUT" => ["RUTA","RUTB","RUTC","RUTD"],
            //RMUA
            "RMUA" => ["RMUAHO", "RMUAHU", "RMUACO", "RMUACU", "RMUANO", "RMUANU"],
            //RMUB
            "RMUB" => ["RMUBHO", "RMUBHU", "RMUBCO", "RMUBCU", "RMUBNO", "RMUBNU"],
            //RMUC
            "RMUC" => ["RMUCHO", "RMUCHU", "RMUCCO", "RMUCCU", "RMUCNO", "RMUCNU"],
            //RMUD
            "RMUD" => ["RMUDHO", "RMUDHU", "RMUDCO", "RMUDCU", "RMUDNO", "RMUDNU"],
            //RMPG
            "RMPG" => ["RMPGHH", "RMPGHC", "RMPGCH", "RMPGCC", "RMPGNH", "RMPGNC"],
            //RMTS
            "RMTS" => ["RMTSHY", "RMTSHN", "RMTSCY", "RMTSCN", "RMTSNY", "RMTSNN"],
            //RDUA
            "RDUA" => ["RDUAHO", "RDUAHU", "RDUACO", "RDUACU", "RDUASO", "RDUASU"],
            //RDUB
            "RDUB" => ["RDUBHO", "RDUBHU", "RDUBCO", "RDUBCU", "RDUBSO", "RDUBSU"],
            //RDUC
            "RDUC" => ["RDUCHO", "RDUCHU", "RDUCCO", "RDUCCU", "RDUCSO", "RDUCSU"],
            //RDUD
            "RDUD" => ["RDUDHO", "RDUDHU", "RDUDCO", "RDUDCU", "RDUDSO", "RDUDSU"],
            //RDG
            "RDG" => ["RDGHH", "RDGHC", "RDGCH", "RDGCC", "RDGSH", "RDGSC"],
            //RDS
            "RDS" => ["RDSHY", "RDSHN", "RDSCY", "RDSCN", "RDSSY", "RDSSN"],
            //RUEA
            "RUEA" => ["RUEAOO", "RUEAOE", "RUEAUO", "RUEAUE"],
            //RUEB
            "RUEB" => ["RUEBOO", "RUEBOE", "RUEBUO", "RUEBUE"],
            //RUEC
            "RUEC" => ["RUECOO", "RUECOE", "RUECUO", "RUECUE"],
            //RUED
            "RUED" => ["RUEDOO", "RUEDOE", "RUEDUO", "RUEDUE"],
            //RUPA
            "RUPA" => ["RUPAOH", "RUPAOC", "RUPAUH", "RUPAUC"],
            //RUPB
            "RUPB" => ["RUPBOH", "RUPBOC", "RUPBUH", "RUPBUC"],
            //RUPC
            "RUPC" => ["RUPCOH", "RUPCOC", "RUPCUH", "RUPCUC"],
            //RUPD
            "RUPD" => ["RUPDOH", "RUPDOC", "RUPDUH", "RUPDUC"],
            //RUTA
            "RUTA" => ["RUTAOY", "RUTAON", "RUTAUY", "RUTAUN"],
            //RUTB
            "RUTB" => ["RUTBOY", "RUTBON", "RUTBUY", "RUTBUN"],
            //RUTC
            "RUTC" => ["RUTCOY", "RUTCON", "RUTCUY", "RUTCUN"],
            //RUTD
            "RUTD" => ["RUTDOY", "RUTDON", "RUTDUY", "RUTDUN"],
        ];
        $wtype_RNB = ["RNBA","RNBB","RNBC","RNBD","RNBE","RNBF","RNBG","RNBH","RNBI","RNBJ","RNBK","RNBL","RNBM","RNBN","RNBO"];
        $wtype_RNC = ["RNC1","RNC2","RNC3","RNC4","RNC5","RNC6","RNC7","RNC8","RNC9","RNCA","RNCB","RNCC","RNCD","RNCE","RNCF",
            "RNCG","RNCH","RNCI","RNCJ","RNCK","RNCL","RNCM","RNCN","RNCO","RNCP","RNCQ","RNCR","RNCS","RNCT","RNCU"];
        $wtype_RSH = ["RSHA","RSHB","RSHC","RSHD","RSHE","RSHF","RSHG","RSHH","RSHI","RSHJ","RSHK","RSHL","RSHM","RSHN","RSHO"];
        $wtype_RSC = ["RSCA","RSCB","RSCC","RSCD","RSCE","RSCF","RSCG","RSCH","RSCI","RSCJ","RSCK","RSCL","RSCM","RSCN","RSCO"];

        foreach ($wtype_RNB as $v){
            $re[$v] = [$v."H",$v."C"];
        }

        foreach ($wtype_RNC as $v){
            $re[$v] = [$v."H",$v."C"];
        }
        
        foreach ($wtype_RSH as $k => $v){
            $re[$v] = [$v."Y",$v."N",$wtype_RSC[$k]."Y",$wtype_RSC[$k]."N"];
        }
        $ary = array_merge($r,$re);
        return ["R" => $r,"RE"=> $re,"ALL" => $ary];
    }

    /**
     * 篮球所有玩法
     * @return array
     */
    public function getBK(){
        $r = [
            "R" => ["RH","RC"],
            "OU" => ["OUH","OUC"],		
            "OUH" => ["OUHO","OUHU"],
            "OUC" => ["OUCO","OUCU"],
            "PDH" => ["PDH0","PDH1","PDH2","PDH3","PDH4"],
            "PDC" => ["PDC0","PDC1","PDC2","PDC3","PDC4"],
            "M" => ["MH","MC"],
            "EO" => ["EOO","EOE"],
        ];
        $re = [
            "RE" => ["REH","REC"],
            "ROU" => ["ROUH","ROUC"],		
            "ROUH" => ["ROUHO","ROUHU"],
            "ROUC" => ["ROUCO","ROUCU"],
            "RPDH" => ["RPDH0","RPDH1","RPDH2","RPDH3","RPDH4"],
            "RPDC" => ["RPDC0","RPDC1","RPDC2","RPDC3","RPDC4"],
            "RM" => ["RMH","RMC"],
            "REO" => ["REOO","REOE"],
        ];

        $ary = array_merge($r,$re);
        return ["r" => $r,"RE"=> $re,"ALL" => $ary];
    }

    /**
     * 棒球所有玩法
     * @return array
     */
    public function getBS(){ 
        $r = [
            "MX" => ["MH","MC","MN"],    
            "R" => ["RH","RC"],
            "OU" => ["OUH","OUC"],
            "OUH" => ["OUHO","OUHU"],
            "OUC" => ["OUCO","OUCU"],
            "M" => ["MH","MC","MN"],
            "EO" => ["EOO","EOE"],
            "WM" => ["WMH1","WMH2","WMH3","WMH4","WMH0","WMC1","WMC2","WMC3","WMC4"],
            "OT" => ["OTY","OTN"],
            
            "HR" => ["HRH","HRC"],
            "HOU" => ["HOUH","HOUC"],
            "HOUH" => ["HOUHO","HOUHU"],
            "HOUC" => ["HOUCO","HOUCU"],
            "HM" => ["HMH","HMC","HMN"],
            "HEO" => ["HEOO","HEOE"],
            "HWM" => ["HWMH1","HWMH2","HWMH3","HWMH4","HWMH0","HWMC1","HWMC2","HWMC3","HWMC4"],
        ];
        
        $re = [
            "RMX" => ["RMH","RMC","RMN"],      
            "RE" => ["REH","REC"],
            "ROU" => ["ROUH","ROUC"],
            "ROUH" => ["ROUHO","ROUHU"],
            "ROUC" => ["ROUCO","ROUCU"],
            "RM" => ["RMH","RMC","RMN"],
            "REO" => ["REOO","REOE"],
            "RWM" => ["RWMH1","RWMH2","RWMH3","RWMH4","RWMH0","RWMC1","RWMC2","RWMC3","RWMC4"],
            "ROT" => ["ROTY","ROTN"],
            
            "HRE" => ["HREH","HREC"],
            "HROU" => ["HROUH","HROUC"],
            "HRUH" => ["HRUHO","HRUHU"],
            "HRUC" => ["HRUCO","HRUCU"],
            "HRM" => ["HRMH","HRMC","HRMN"],
            "HREO" => ["HREOO","HREOE"],
            "HRWM" => ["HRWMH1","HRWMH2","HRWMH3","HRWMH4","HRWMH0","HRWMC1","HRWMC2","HRWMC3","HRWMC4"],
        ];
        $ary = array_merge($r,$re);
        return ["r" => $r,"RE"=> $re,"ALL" => $ary];
    }

    /**
     * 羽毛球所有玩法
     * @return array
     */
    public function getBM(){ 
        $r = [
            "R" => ["RH","RC"],
            "OU" => ["OUH","OUC"],		
            "OUH" => ["OUHO","OUHU"],
            "OUC" => ["OUCO","OUCU"],
            "PD3" => ["PD320","PD321","PD302","PD312"],
            "PD5" => ["PD530","PD531","PD532","PD503","PD513","PD523"],
            "M" => ["MH","MC"],
            "EO" => ["EOO","EOE"],
        ];
        $re = [
            "RE" => ["REH","REC"],
            "ROU" => ["ROUH","ROUC"],		
            "ROUH" => ["ROUHO","ROUHU"],
            "ROUC" => ["ROUCO","ROUCU"],
            "RPD3" => ["RPD320","RPD321","RPD302","RPD312"],
            "RPD5" => ["RPD530","RPD531","RPD532","RPD503","RPD513","RPD523"],
            "RM" => ["RMH","RMC"],
            "REO" => ["REOO","REOE"],
        ];
        $ary = array_merge($r,$re);
        return ["r" => $r,"RE"=> $re,"ALL" => $ary];
    }

    /**
     * 斯诺克所有玩法
     * @return array
     */
    public function getSK(){
        $r = [
            "M" => ["MH","MC"],
            "R" => ["RH","RC"],
            "OU" => ["OUH","OUC"],		
            "EO" => ["EOO","EOE"],
        ];
        for($i=1;$i<=35;$i++){//"F01" => ["F01H","F01C"]
            $k = "F".$i;
            if($i<10){ $k = "F0{$i}";}
            $r[$k] = [$k."H",$k."C"];
        }
        $re = [
            "RM" => ["RMH","RMC"],
            "RE" => ["REH","REC"],
            "ROU" => ["ROUH","ROUC"],
            "REO" => ["REOO","REOE"],
        ];
        $ary = array_merge($r,$re);
        return ["r" => $r,"RE"=> $re,"ALL" => $ary];
    }

    /**
     * 网球所有玩法
     * @return array
     */
    public function getTN(){
        $r = [
            "M" => ["MH","MC"],
            "R" => ["RH","RC"],
            "OU" => ["OUH","OUC"],		
            "PD3" => ["PD320","PD321","PD302","PD312"],
            "PD5" => ["PD530","PD531","PD532","PD503","PD513","PD523"],
            "OUH" => ["OUHO","OUHU"],
            "OUC" => ["OUCO","OUCU"],
            "EO" => ["EOO","EOE"],  
        ];
        $re = [
            "RFA01" => ["RFA01H","RFA01C"],
            "RFA02" => ["RFA02H","RFA02C"],
            "RFA03" => ["RFA03H","RFA03C"],
            "RFA04" => ["RFA04H","RFA04C"],
            "RFA05" => ["RFA05H","RFA05C"],
            "RFA06" => ["RFA06H","RFA06C"],
            "RFA07" => ["RFA07H","RFA07C"],
            "RFA08" => ["RFA08H","RFA08C"],
            "RFA09" => ["RFA09H","RFA09C"],
            "RFA10" => ["RFA10H","RFA10C"],
            "RFA11" => ["RFA11H","RFA11C"],
            "RFA12" => ["RFA12H","RFA12C"],
            "RFA13" => ["RFA13H","RFA13C"],
            "RFB01" => ["RFB01H","RFB01C"],
            "RFB02" => ["RFB02H","RFB02C"],
            "RFB03" => ["RFB03H","RFB03C"],
            "RFB04" => ["RFB04H","RFB04C"],
            "RFB05" => ["RFB05H","RFB05C"],
            "RFB06" => ["RFB06H","RFB06C"],
            "RFB07" => ["RFB07H","RFB07C"],
            "RFB08" => ["RFB08H","RFB08C"],
            "RFB09" => ["RFB09H","RFB09C"],
            "RFB10" => ["RFB10H","RFB10C"],
            "RFB11" => ["RFB11H","RFB11C"],
            "RFB12" => ["RFB12H","RFB12C"],
            "RFB13" => ["RFB13H","RFB13C"],
            "RFC01" => ["RFC01H","RFC01C"],
            "RFC02" => ["RFC02H","RFC02C"],
            "RFC03" => ["RFC03H","RFC03C"],
            "RFC04" => ["RFC04H","RFC04C"],
            "RFC05" => ["RFC05H","RFC05C"],
            "RFC06" => ["RFC06H","RFC06C"],
            "RFC07" => ["RFC07H","RFC07C"],
            "RFC08" => ["RFC08H","RFC08C"],
            "RFC09" => ["RFC09H","RFC09C"],
            "RFC10" => ["RFC10H","RFC10C"],
            "RFC11" => ["RFC11H","RFC11C"],
            "RFC12" => ["RFC12H","RFC12C"],
            "RFC13" => ["RFC13H","RFC13C"],
            "RFC14" => ["RFC14H","RFC14C"],
            "RFC15" => ["RFC15H","RFC15C"],
            "RFC16" => ["RFC16H","RFC16C"],
            "RFC17" => ["RFC17H","RFC17C"],
            "RFC18" => ["RFC18H","RFC18C"],
            "RFC19" => ["RFC19H","RFC19C"],
            "RFC20" => ["RFC20H","RFC20C"],
            "RFC21" => ["RFC21H","RFC21C"],
            "RFC22" => ["RFC22H","RFC22C"],
            "RFC23" => ["RFC23H","RFC23C"],
            "RFC24" => ["RFC24H","RFC24C"],
            "RFC25" => ["RFC25H","RFC25C"],
            "RFC26" => ["RFC26H","RFC26C"],
            "RFC27" => ["RFC27H","RFC27C"],
            "RFC28" => ["RFC28H","RFC28C"],
            "RFC29" => ["RFC29H","RFC29C"],
            "RFC30" => ["RFC30H","RFC30C"],
            "RFC31" => ["RFC31H","RFC31C"],
            "RFC32" => ["RFC32H","RFC32C"],
            "RFC33" => ["RFC33H","RFC33C"],
            "RFC34" => ["RFC34H","RFC34C"],
            "RFC35" => ["RFC35H","RFC35C"],
            "RFC36" => ["RFC36H","RFC36C"],
            "RFC37" => ["RFC37H","RFC37C"],
            "RFC38" => ["RFC38H","RFC38C"],
            "RFC39" => ["RFC39H","RFC39C"],
            "RFC40" => ["RFC40H","RFC40C"],
            "RFC41" => ["RFC41H","RFC41C"],
            "RFC42" => ["RFC42H","RFC42C"],
            "RFC43" => ["RFC43H","RFC43C"],
            "RFC44" => ["RFC44H","RFC44C"],
            "RFC45" => ["RFC45H","RFC45C"],
            "RFC46" => ["RFC46H","RFC46C"],
            "RFC47" => ["RFC47H","RFC47C"],
            "RFC48" => ["RFC48H","RFC48C"],
            "RFC49" => ["RFC49H","RFC49C"],
            "RFC50" => ["RFC50H","RFC50C"],
            "RFD01" => ["RFD01H","RFD01C"],
            "RFD02" => ["RFD02H","RFD02C"],
            "RFD03" => ["RFD03H","RFD03C"],
            "RFD04" => ["RFD04H","RFD04C"],
            "RFD05" => ["RFD05H","RFD05C"],
            "RFD06" => ["RFD06H","RFD06C"],
            "RFD07" => ["RFD07H","RFD07C"],
            "RFD08" => ["RFD08H","RFD08C"],
            "RFD09" => ["RFD09H","RFD09C"],
            "RFD10" => ["RFD10H","RFD10C"],
            "RFD11" => ["RFD11H","RFD11C"],
            "RFD12" => ["RFD12H","RFD12C"],
            "RFD13" => ["RFD13H","RFD13C"],
            "RFE01" => ["RFE01H","RFE01C"],
            "RFE02" => ["RFE02H","RFE02C"],
            "RFE03" => ["RFE03H","RFE03C"],
            "RFE04" => ["RFE04H","RFE04C"],
            "RFE05" => ["RFE05H","RFE05C"],
            "RFE06" => ["RFE06H","RFE06C"],
            "RFE07" => ["RFE07H","RFE07C"],
            "RFE08" => ["RFE08H","RFE08C"],
            "RFE09" => ["RFE09H","RFE09C"],
            "RFE10" => ["RFE10H","RFE10C"],
            "RFE11" => ["RFE11H","RFE11C"],
            "RFE12" => ["RFE12H","RFE12C"],
            "RFE13" => ["RFE13H","RFE13C"],
            "RFE14" => ["RFE14H","RFE14C"],
            "RFE15" => ["RFE15H","RFE15C"],
            "RFE16" => ["RFE16H","RFE16C"],
            "RFE17" => ["RFE17H","RFE17C"],
            "RFE18" => ["RFE18H","RFE18C"],
            "RFE19" => ["RFE19H","RFE19C"],
            "RFE20" => ["RFE20H","RFE20C"],
            "RFE21" => ["RFE21H","RFE21C"],
            "RFE22" => ["RFE22H","RFE22C"],
            "RFE23" => ["RFE23H","RFE23C"],
            "RFE24" => ["RFE24H","RFE24C"],
            "RFE25" => ["RFE25H","RFE25C"],
            "RFE26" => ["RFE26H","RFE26C"],
            "RFE27" => ["RFE27H","RFE27C"],
            "RFE28" => ["RFE28H","RFE28C"],
            "RFE29" => ["RFE29H","RFE29C"],
            "RFE30" => ["RFE30H","RFE30C"],
            "RFE31" => ["RFE31H","RFE31C"],
            "RFE32" => ["RFE32H","RFE32C"],
            "RFE33" => ["RFE33H","RFE33C"],
            "RFE34" => ["RFE34H","RFE34C"],
            "RFE35" => ["RFE35H","RFE35C"],
            "RFE36" => ["RFE36H","RFE36C"],
            "RFE37" => ["RFE37H","RFE37C"],
            "RFE38" => ["RFE38H","RFE38C"],
            "RFE39" => ["RFE39H","RFE39C"],
            "RFE40" => ["RFE40H","RFE40C"],
            "RFE41" => ["RFE41H","RFE41C"],
            "RFE42" => ["RFE42H","RFE42C"],
            "RFE43" => ["RFE43H","RFE43C"],
            "RFE44" => ["RFE44H","RFE44C"],
            "RFE45" => ["RFE45H","RFE45C"],
            "RFE46" => ["RFE46H","RFE46C"],
            "RFE47" => ["RFE47H","RFE47C"],
            "RFE48" => ["RFE48H","RFE48C"],
            "RFE49" => ["RFE49H","RFE49C"],
            "RFE50" => ["RFE50H","RFE50C"],
    
            "RM" => ["RMH","RMC"],
            "RE" => ["REH","REC"],
            "ROU" => ["ROUH","ROUC"],		
            "RPD3" => ["RPD320","RPD321","RPD302","RPD312"],
            "RPD5" => ["RPD530","RPD531","RPD532","RPD503","RPD513","RPD523"],
            "ROUH" => ["ROUHO","ROUHU"],
            "ROUC" => ["ROUCO","ROUCU"],
            "REO" => ["REOO","REOE"], 
        ];
        $ary = array_merge($r,$re);
        return ["r" => $r,"RE"=> $re,"ALL" => $ary];
    }

    /**
     * 排球所有玩法
     * @return array
     */
    public function getVB(){
        $r = [
            "M" => ["MH","MC"],
            "R" => ["RH","RC"],
            "OU" => ["OUH","OUC"],		
            "PD3" => ["PD320","PD321","PD302","PD312"],
            "PD5" => ["PD530","PD531","PD532","PD503","PD513","PD523"],
            "OUH" => ["OUHO","OUHU"],
            "OUC" => ["OUCO","OUCU"],
            "EO" => ["EOO","EOE"],
        ];
        $re = [
            "RM" => ["RMH","RMC"],
            "RE" => ["REH","REC"],
            "ROU" => ["ROUH","ROUC"],		
            "RPD3" => ["RPD320","RPD321","RPD302","RPD312"],
            "RPD5" => ["RPD530","RPD531","RPD532","RPD503","RPD513","RPD523"],
            "ROUH" => ["ROUHO","ROUHU"],
            "ROUC" => ["ROUCO","ROUCU"],
            "REO" => ["REOO","REOE"],
        ];
        $ary = array_merge($r,$re);
        return ["r" => $r,"RE"=> $re,"ALL" => $ary];
    }

    /**
     * 乒乓球所有玩法
     * @return array
     */
    public function getTT(){
        $r = [
            "R" => ["RH","RC"],
            "OU" => ["OUH","OUC"],		
            "OUH" => ["OUHO","OUHU"],
            "OUC" => ["OUCO","OUCU"],
            "PD5" => ["PD530","PD531","PD532","PD503","PD513","PD523"],
            "PD7" => ["PD740","PD741","PD742","PD743","PD704","PD714","PD724","PD734"],
            "M" => ["MH","MC"],
            "EO" => ["EOO","EOE"],
        ];
        $re = [
            "RE" => ["REH","REC"],
            "ROU" => ["ROUH","ROUC"],		
            "ROUH" => ["ROUHO","ROUHU"],
            "ROUC" => ["ROUCO","ROUCU"],
            "RPD5" => ["RPD530","RPD531","RPD532","RPD503","RPD513","RPD523"],
            "RPD7" => ["RPD740","RPD741","RPD742","RPD743","RPD704","RPD714","RPD724","RPD734"],
            "RM" => ["RMH","RMC"],
            "REO" => ["REOO","REOE"],
        ];
        $ary = array_merge($r,$re);
        return ["r" => $r,"RE"=> $re,"ALL" => $ary];
    }

    /**
     * 其他所有玩法
     * @return array
     */
    public function getOP(){
        $r = [
            "R" => ["RH","RC"],
            "OU" => ["OUH","OUC"],		
            "M" => ["MH","MC","MN"],
            "EO" => ["EOO","EOE"],
        ];
        $re = [
            "RE" => ["REH","REC"],
            "ROU" => ["ROUH","ROUC"],		
            "RM" => ["RMH","RMC","RMN"],
            "REO" => ["REOO","REOE"],
            "HRE" => ["HREH","HREC"],
            "HROU" => ["HROUH","HROUC"],		
            "HRM" => ["HRMH","HRMC","HRMN"],
            "HREO" => ["HREOO","HREOE"],
        ];
        $ary = array_merge($r,$re);
        return ["r" => $r,"RE"=> $re,"ALL" => $ary];
    }
}