function config_set(){
    var _self = this;
    var parentClass;
    var ConfigAry;

    _self.init=function(){
        ConfigAry = _self.set();
    }

    _self.set=function(){
        var ary = new Object();
        ary["GTYPEARY"] = new Array("FT","BK","TN","VB","TT","BM","BS","SK","OP");
        ary["REPORT_GTYPE"] = ary["GTYPEARY"].concat(new Array("ALL","FS"));
        ary["REPORT_WTYPE"] = new Array("ALL","R","RE","P","OU","ROU","PD","RPD","PD3","RPD3","PD5","RPD5","T","RDT","RT","M","RM","FALL","RFALL","SP","F","RF","HR","HOU","HM","HRE","HROU","HRM","HPD","HRPD","OUALL","EOALL","HOUALL","HEOALL","ROUALL","HRUALL","HT","HRT","WM","RWM","HWM","HRWM","DC","RDC","W3","MOUALL","MPG","MTS","DUALL","DG","DS","OUEALL","OUPALL","OUTALL","RMUALL","RMPG","RMTS","RDUALL","RDG","RDS","RUEALL","RUPALL","RUTALL","ARGALL","RNCALL","RNBALL","RSALL","CS","RCS","WN","RWN","HTS","RTS2","TS","RTS","WB","RWB","WE","RWE","SB","RSB","HG","RHG","MG","RMG","F2G","F3G","T1G","RT1G","T3G","RT3G","R15","OU15","M15","RE15","ROU15","RM15","TK","OT","ROT","PA","OG","RCD","FG","MWMQ","BH","RPS","TRUALL","RTW","RPF","RPXALL");

        ary["RETRY_LIMIT"] = 6;
        ary["RETRY_TIME"] = 5000;
        ary["DASHBOARD"] = 10000;
        ary["AD_TIME"] = 5000;
        ary["RESEND_TIME"] = 5000;
        ary["ANNOUNCE_PROBLEMACCOUNT_TIME"] = 1000 * 60 * 3;

        ary["NCR_SHOWCOUNT_DEF"] = 50;  //NCR預設顯示筆數
        ary["ACCOUNT_SHOWCOUNT_DEF"] = 50;  //帳號預設顯示筆數
        ary["ACCOUNT_SHOWCOUNT_ARY"] = [25, 50, 100];  //帳號顯示筆數陣列


        ary["CONF_BAR_RANGE"] = 0.25;  //詳細設定的拉霸間隔
        ary["SU_WINLOSS_RANGE"] = 1;  //新增代理的su佔成拉霸間隔
        ary["SU_WINLOSS_MAX"] = 100;  //新增代理的su最大成數
        ary["AG_WINLOSS_RANGE"] = 1;  //新增代理的ag佔成拉霸間隔
        ary["AG_WINLOSS_MAX"] = 100;  //新增代理的ag最大成數
        ary["CO_WINLOSS_RANGE"] = 1;  //新增總代理的co佔成拉霸間隔
        ary["CO_WINLOSS_MAX"] = 100;  //新增總代理的co最大成數
        ary["D0_WINLOSS_MAX"] = 100;  //新增分公司的預設成數

        ary["LTYPE_ARY"] = { "1": "A", "2": "B", "3": "C", "4": "D" };  //ltype值
        ary["DEF_LTYPE"] = 4;  //預設ltype
        ary["CONFIG_DANGEROUS"] = 10 * 1000; //危險球更新(下注單&交易狀況)
        ary["LAZY_SW"] = true; //lazy loading開關
        ary["LAZY_COUNT"] = 10 //lazy loading筆數
        ary["LAZY_COUNT_BIG_PAGE"] = 20 //lazy loading筆數(大畫面)
        ary["WMC_RELOAD"] = 10 * 1000;  //WMC更新秒數
        ary["RECORD_LIMIT"] = 6;//RECORD默认显示条数
        ary["RECORD_RELOAD"]= 20 * 1000;  //RECORD更新秒數
        ary["BETLIST_RELOAD"]= 30 * 1000;  //注单更新秒數
        // ary["NCR_RELOAD"] = 180 * ConfigAry["SECOND"];  //NCR更新秒數
        // ary["APN_RELOAD"] = 180 * ConfigAry["SECOND"];  //APN更新秒數

        ary["LEAGUE_RELOAD"] = 180 * 1000;  //盤面league更新秒數
        // ary["ALLBETS_FT_RELOAD"] = 180 * 1000;  //單式盤面allbets更新秒數
        // ary["ALLBETS_RB_RELOAD"] = 180 * 1000;  //滾球盤面allbets更新秒數
        ary["ALLBETS_LEAGUE_ACTIVE"] = 10; //聯盟預設展開數量
        ary["WEB_TIME_ZONE"] = -4;
        ary["ONLINE_MEM"] = 30 *1000;  //線上會員 自動更新秒數
        ary["LOG_LOGIN_TIME"] = 60 *1000;//登陆日志 自动更新秒数
        return ary;
    }

    _self.get=function(_key){
        return ConfigAry[_key];
    }

}