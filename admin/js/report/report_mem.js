function report_mem(_win, _dom, _post){ //extends report_index
    var _self = this;
    var classname = "report_mem";
    var totalAry = new Array("WCOUNT0","GOLD0","VGOLD0","WINGOLD_MCY0","WINGOLD0","ARESULT0");

    var rowAry = new Object();
    rowAry["ads_Y_set"] = new Array("ID0", "ACTION0", "NAME0", "MEMBER_CODE0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","WINGOLD0","WINGOLD_MCY0","WINLOSS0","ARESULT0");
    rowAry["ads_Y_valid"] = rowAry["ads_Y_set"];
    rowAry["ads_Y_all"] = rowAry["ads_Y_set"];
    rowAry["ads_N_set"] = new Array("ID0", "ACTION0", "NAME0", "MEMBER_CODE0","ALIAS0","WCOUNT0","GOLD0");
    rowAry["ads_N_valid"] = rowAry["ads_N_set"];
    rowAry["ads_N_all"] = rowAry["ads_N_set"];

    rowAry["ad_Y_set"] = rowAry["ads_Y_set"];
    rowAry["ad_Y_valid"] = rowAry["ads_Y_valid"];
    rowAry["ad_Y_all"] = rowAry["ads_Y_all"];
    rowAry["ad_N_set"] = rowAry["ads_N_set"];
    rowAry["ad_N_valid"] = rowAry["ads_N_set"];
    rowAry["ad_N_all"] = rowAry["ads_N_set"];


    var tfootAry = null;
    _self.init=function(){
        _self.reInit(_self, classname, totalAry, rowAry, tfootAry);
    }
}