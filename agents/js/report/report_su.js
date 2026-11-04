function report_su(_win, _dom, _post){ //extends report_index
    var _self = this;
    var classname = "report_su";
    var totalAry = new Array("ARESULT0","AWINGOLD0","C1RESULT0","CGOLD0","CRATIO0","CRESULT0","CWINLOSS0","GOLD0","MWINGOLD0","AGOLD0","ARATIO0","SGOLD0","SRATIO0","SRESULT0","VGOLD0","WCOUNT0","S1RESULT0");

    var rowAry = new Object();
    rowAry["co_Y_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","SRESULT0","SGOLD0","SRATIO0","C1RESULT0","CWINLOSS0","CRESULT0","CGOLD0","CRATIO0");
    rowAry["co_Y_valid"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","CRESULT0");
    rowAry["co_Y_all"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","AGOLD0","ARATIO0","SRESULT0","C1RESULT0","SGOLD0","SRATIO0","CWINLOSS0","CRESULT0","CGOLD0","CRATIO0");
    rowAry["co_N_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0");
    rowAry["co_N_valid"] = rowAry["co_N_set"];
    rowAry["co_N_all"] = rowAry["co_N_set"];

    rowAry["su_Y_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","SGOLD0","SRATIO0","S1RESULT0");
    rowAry["su_Y_valid"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0");
    rowAry["su_Y_all"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","SGOLD0","SRATIO0");
    rowAry["su_N_set"] = rowAry["co_N_set"];
    rowAry["su_N_valid"] = rowAry["co_N_set"];
    rowAry["su_N_all"] = rowAry["co_N_set"];

    var tfootAry = new Array("SRTAX_0");
    //var tfootAry = null;
    _self.init=function(){
        _self.reInit(_self, classname, totalAry, rowAry, tfootAry);
    }
}