function report_ag(_win, _dom, _post){ //extends report_index
    var _self = this;
    var classname = "report_ag";
    var totalAry = new Array("AWINGOLD0","ARESULT0","SGOLD0","SRESULT0","WCOUNT0","GOLD0","VGOLD0","WINGOLD0","RESULT_D0","ARATIO0","AGOLD0","S1RESULT0","SRATIO0","MWINGOLD0","CRESULT0","CGOLD0","CRATIO0","D0RESULT0");

    var rowAry = new Object();
    rowAry["co_Y_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","AWINGOLD0","AWINLOSS0","ARESULT0","SGOLD0","SWINLOSS0","SRESULT0","DETIAL_DISPLAY0","SID0","AID0","ARATIO0","AGOLD0","S1RESULT0","SRATIO0","CRATIO0");
    rowAry["co_Y_valid"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","WINGOLD0","RESULT_D0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","CRESULT0");
    rowAry["co_Y_all"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","WINGOLD0","RESULT_D0","AWINGOLD0","AWINLOSS0","ARESULT0","SGOLD0","SWINLOSS0","SRESULT0","DETIAL_DISPLAY0","SID0","AID0","AGOLD0","ARATIO0","SRATIO0","CRESULT0","CGOLD0","CRATIO0","MWINGOLD0","MWINGOLD0");
    rowAry["co_N_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0");
    rowAry["co_N_valid"] = rowAry["co_N_set"];
    rowAry["co_N_all"] = rowAry["co_N_set"];

    rowAry["su_Y_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","AWINGOLD0","AWINLOSS0","ARESULT0","SGOLD0","SWINLOSS0","SRESULT0","DETIAL_DISPLAY0","SID0","AID0","ARATIO0","AGOLD0","S1RESULT0","SRATIO0");
    rowAry["su_Y_valid"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","WINGOLD0","RESULT_D0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0");
    rowAry["su_Y_all"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","WINGOLD0","RESULT_D0","AWINGOLD0","AWINLOSS0","ARESULT0","SGOLD0","SWINLOSS0","SRESULT0","DETIAL_DISPLAY0","SID0","AID0","MWINGOLD0","AGOLD0","ARATIO0","SRATIO0");
    rowAry["su_N_set"] = rowAry["co_N_set"];
    rowAry["su_N_valid"] = rowAry["co_N_set"];
    rowAry["su_N_all"] = rowAry["co_N_set"];

    rowAry["ag_Y_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","WINGOLD0","RESULT_D0","MWINGOLD0","AWINGOLD0","AWINLOSS0","ARESULT0","SGOLD0","ARATIO0","AGOLD0");
    rowAry["ag_Y_valid"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","WINGOLD0","RESULT_D0","MWINGOLD0","ARESULT0");
    rowAry["ag_Y_all"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","WINGOLD0","RESULT_D0","AWINGOLD0","AWINLOSS0","ARESULT0","SGOLD0","MWINGOLD0","ARATIO0","AGOLD0");
    rowAry["ag_N_set"] = rowAry["co_N_set"];
    rowAry["ag_N_valid"] = rowAry["co_N_set"];
    rowAry["ag_N_all"] = rowAry["co_N_set"];

    var tfootAry = new Array("ARTAX_0");
    _self.init=function(){
        _self.reInit(_self, classname, totalAry, rowAry, tfootAry);
    }
}