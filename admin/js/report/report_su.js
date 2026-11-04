function report_su(_win, _dom, _post){ //extends report_index
    var _self = this;
    var classname = "report_su";
    var totalAry = new Array("ARESULT0","AWINGOLD0","C1RESULT0","CGOLD0","CRATIO0","CRESULT0","CWINLOSS0","GOLD0","MWINGOLD0","SGOLD0","SRATIO0","SRESULT0","S1RESULT0","VGOLD0","WCOUNT0","AGOLD0","ARATIO0","D0RESULT0","D0GOLD0","D0RATIO0","AD1RESULT0","ADRATIO0");

    var rowAry = new Object();
    rowAry["ads_Y_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","S1RESULT0","SGOLD0","SRATIO0","CWINLOSS0","C1RESULT0","CRESULT0","CGOLD0","CRATIO0");
    rowAry["ads_Y_valid"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","S1RESULT0","SGOLD0","SRATIO0","C1RESULT0","CRESULT0","CGOLD0","CRATIO0","D0RESULT0");
    rowAry["ads_Y_all"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","S1RESULT0","SGOLD0","SRATIO0","CWINLOSS0","C1RESULT0","CRESULT0","CGOLD0","CRATIO0","AGOLD0","ARATIO0","D0RESULT0","D0GOLD0","D0RATIO0","AD1RESULT0","ADRATIO0");
    rowAry["ads_N_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0");
    rowAry["ads_N_valid"] = rowAry["ads_N_set"];
    rowAry["ads_N_all"] = rowAry["ads_N_set"];

    rowAry["ad_Y_set"] = rowAry["ads_Y_set"];
    rowAry["ad_Y_valid"] = rowAry["ads_Y_valid"];
    rowAry["ad_Y_all"] = rowAry["ads_Y_all"];
    rowAry["ad_N_set"] = rowAry["ads_N_set"];
    rowAry["ad_N_valid"] = rowAry["ads_N_set"];
    rowAry["ad_N_all"] = rowAry["ads_N_set"];
    var tfootAry = new Array("SRTAX_0");
    //var tfootAry = null;
    _self.init=function(){
        _self.reInit(_self, classname, totalAry, rowAry, tfootAry);
    }
}