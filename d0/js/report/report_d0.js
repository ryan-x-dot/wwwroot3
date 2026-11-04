function report_d0(_win, _dom, _post){ //extends report_index
    var _self = this;
    var classname = "report_d0";
    var totalAry = new Array("ARESULT0","AWINGOLD0","CRESULT0","GOLD0","MWINGOLD0","D0GOLD0","D01RESULT0","D0RESULT0","SRESULT0","VGOLD0","WCOUNT0","D0RATIO0","AGOLD0","ARATIO0","SGOLD0","SRATIO0","CGOLD0","CRATIO0");

    var rowAry = new Object();
    rowAry["d0_Y_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","CRESULT0","CGOLD0","D0RESULT0","D01RESULT0","D0GOLD0","D0RATIO0");
    rowAry["d0_Y_valid"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","CRESULT0","D0RESULT0","D01RESULT0","D0GOLD0","D0RATIO0");
    rowAry["d0_Y_all"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","CRESULT0","D0RESULT0","D01RESULT0","D0GOLD0","D0RATIO0","AGOLD0","ARATIO0","SGOLD0","SRATIO0","CGOLD0","CRATIO0");
    rowAry["d0_N_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0");
    rowAry["d0_N_valid"] = rowAry["d0_N_set"];
    rowAry["d0_N_all"] = rowAry["d0_N_set"];


    var tfootAry = new Array("D0RTAX_0");
    _self.init=function(){
        _self.reInit(_self, classname, totalAry, rowAry, tfootAry);
    }
}