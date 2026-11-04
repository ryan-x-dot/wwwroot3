function report_ag(_win, _dom, _post){ //extends report_index
    var _self = this;
    var classname = "report_ag";
    var totalAry = new Array("WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","RESULT_D0","ARESULT0","AGOLD0","ARATIO0","SRESULT0","S1RESULT0","SGOLD0","SRATIO0","CRESULT0","D0RESULT0","CGOLD0","CRATIO0","D0GOLD0","D0RATIO0");

    var rowAry = new Object();
    rowAry["d0_Y_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","RESULT_D0","AWINLOSS0","ARESULT0","AGOLD0","ARATIO0","SWINLOSS0","SRESULT0","S1RESULT0","SGOLD0","SRATIO0");
    rowAry["d0_Y_valid"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","RESULT_D0","ARESULT0","AGOLD0","ARATIO0","SRESULT0","S1RESULT0","SGOLD0","SRATIO0","CRESULT0","D0RESULT0");
    rowAry["d0_Y_all"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","RESULT_D0","AID0","AWINLOSS0","ARESULT0","AGOLD0","ARATIO0","SID0","SWINLOSS0","SRESULT0","S1RESULT0","SGOLD0","SRATIO0","D0RESULT0","CRESULT0","CGOLD0","CRATIO0","D0GOLD0","D0RATIO0");
    rowAry["d0_N_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0");
    rowAry["d0_N_valid"] = rowAry["d0_N_set"];
    rowAry["d0_N_all"] = rowAry["d0_N_set"];

    var tfootAry = new Array("ARTAX_0");
    _self.init=function(){
        _self.reInit(_self, classname, totalAry, rowAry, tfootAry);
    }
}