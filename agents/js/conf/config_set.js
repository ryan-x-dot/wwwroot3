function config_set() {
    var _self = this;
    var parentClass;
    var ConfigAry;
    _self.init = function() {
        ConfigAry = _self.set()
    };
    _self.set = function() {
        var ary = new Object;
        ary["GTYPEARY"] = new Array("FT", "BK", "TN", "VB", "TT", "BM", "BS", "SK", "OP");
        ary["REPORT_GTYPE"] = ary["GTYPEARY"].concat(new Array("ALL", "FS"));
        ary["REPORT_WTYPE"] = new Array("ALL", "R", "RE", "P", "OU", "ROU", "PD", "RPD", "PD3", "RPD3", "PD5", "RPD5", "T", "RDT", "RT", "M", "RM", "FALL", "RFALL", "SP", "F", "RF", "HR", "HOU", "HM", "HRE", "HROU", "HRM", "HPD", "HRPD", "OUALL", "EOALL", "HOUALL", "HEOALL", "ROUALL", "HRUALL", "HT", "HRT", "WM", "RWM", "HWM", "HRWM", "DC", "RDC", "W3", "MOUALL", "MPG", "MTS", "DUALL", "DG", "DS", "OUEALL", "OUPALL", "OUTALL", "RMUALL", "RMPG", "RMTS", "RDUALL", "RDG", "RDS", "RUEALL", "RUPALL", "RUTALL", "ARGALL", "RNCALL", "RNBALL", "RSALL", "CS", "RCS", "WN", "RWN", "HTS", "RTS2", "TS", "RTS", "WB", "RWB", "WE", "RWE", "SB", "RSB", "HG", "RHG", "MG", "RMG", "F2G", "F3G", "T1G", "RT1G", "T3G", "RT3G", "R15", "OU15", "M15", "RE15", "ROU15", "RM15", "TK", "OT", "ROT", "PA", "OG", "RCD", "FG", "MWMQ", "BH", "RPS", "TRUALL", "RTW", "RPF", "RPXALL");
        ary["RETRY_LIMIT"] = 6;
        ary["RETRY_TIME"] = 5000;
        ary["DASHBOARD"] = 10000;
        ary["AD_TIME"] = 5000;
        ary["RESEND_TIME"] = 5000;
        ary["ANNOUNCE_PROBLEMACCOUNT_TIME"] = 1E3 * 60 * 3;
        ary["NCR_SHOWCOUNT_DEF"] = 50;
        ary["ACCOUNT_SHOWCOUNT_DEF"] = 50;
        ary["ACCOUNT_SHOWCOUNT_ARY"] = [25, 50, 100];
        ary["ADD_SUPER_AGENTS_WINLOSS"] = 100;
        ary["CONF_BAR_RANGE"] = .25;
        ary["SU_WINLOSS_RANGE"] = 1;
        ary["SU_WINLOSS_MAX"] = 80;
        ary["AG_WINLOSS_RANGE"] = 1;
        ary["AG_WINLOSS_MAX"] = 80;
        ary["CO_WINLOSS_RANGE"] = 1;
        ary["CO_WINLOSS_MAX"] = 80;
        ary["LTYPE_ARY"] = {
            1: "A",
            2: "B",
            3: "C",
            4: "D"
        };
        ary["DEF_LTYPE"] = 4;
        ary["MODAL_DEF_LTYPE"] = 3;
        ary["CONFIG_DANGEROUS"] = 10 * 1E3;
        ary["LAZY_SW"] = true;
        ary["LAZY_COUNT"] = 10;
        ary["LAZY_COUNT_BIG_PAGE"] = 20;
        ary["WMC_RELOAD"] = 10 * 1E3;
        ary["LEAGUE_RELOAD"] = 180 * 1E3;
        ary["ALLBETS_LEAGUE_ACTIVE"] = 10;
        ary["WEB_TIME_ZONE"] = -4;
        ary["ONLINE_MEM"] = 5 * 60 * 1E3;
        return ary
    };
    _self.get = function(_key) {
        return ConfigAry[_key]
    }
};
