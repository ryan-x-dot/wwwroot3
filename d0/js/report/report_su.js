function report_su(_win, _dom, _post){ //extends report_index
    var _self = this;
    var classname = "report_su";
    var totalAry = new Array("ARESULT0","AWINGOLD0","C1RESULT0","CGOLD0","CRATIO0","CRESULT0","CWINLOSS0","GOLD0","MWINGOLD0","SGOLD0","SRATIO0","SRESULT0","S1RESULT0","VGOLD0","WCOUNT0","AGOLD0","ARATIO0","D0RESULT0","D0GOLD0","D0RATIO0");

    var rowAry = new Object();
    rowAry["d0_Y_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","S1RESULT0","SGOLD0","SRATIO0","CWINLOSS0","C1RESULT0","CRESULT0","CGOLD0","CRATIO0");
    rowAry["d0_Y_valid"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","S1RESULT0","SGOLD0","SRATIO0","C1RESULT0","CRESULT0","CGOLD0","CRATIO0","D0RESULT0");
    rowAry["d0_Y_all"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","S1RESULT0","SGOLD0","SRATIO0","CWINLOSS0","C1RESULT0","CRESULT0","CGOLD0","CRATIO0","AGOLD0","ARATIO0","D0RESULT0","D0GOLD0","D0RATIO0");
    rowAry["d0_N_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0");
    rowAry["d0_N_valid"] = rowAry["d0_N_set"];
    rowAry["d0_N_all"] = rowAry["d0_N_set"];
    var tfootAry = new Array("SRTAX_0");
    //var tfootAry = null;
    _self.init=function(){
        _self.reInit(_self, classname, totalAry, rowAry, tfootAry);
    }
}