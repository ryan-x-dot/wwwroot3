function report_co(_win, _dom, _post){ //extends report_index
    var _self = this;
    var classname = "report_co";
    var totalAry = new Array("ARESULT0","AWINGOLD0","C1RESULT0","CRESULT0","GOLD0","MWINGOLD0","SRESULT0","VGOLD0","WCOUNT0","AGOLD0","ARATIO0","SGOLD0","SRATIO0","CGOLD0","CRATIO0");

    var rowAry = new Object();
    rowAry["co_Y_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","CRESULT0","C1RESULT0","CGOLD0","CRATIO0","SGOLD0");
    rowAry["co_Y_valid"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","CRESULT0","C1RESULT0","SGOLD0");
    rowAry["co_Y_all"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0","VGOLD0","MWINGOLD0","AWINGOLD0","ARESULT0","SRESULT0","CRESULT0","C1RESULT0","AGOLD0","ARATIO0","SGOLD0","SRATIO0","CGOLD0","CRATIO0");
    rowAry["co_N_set"] = new Array("ID0","ACTION0","NAME0","ALIAS0","WCOUNT0","GOLD0");
    rowAry["co_N_valid"] = rowAry["co_N_set"];
    rowAry["co_N_all"] = rowAry["co_N_set"];


    var tfootAry = new Array("CRTAX_0");
    _self.init=function(){
        _self.reInit(_self, classname, totalAry, rowAry, tfootAry);
    }
}