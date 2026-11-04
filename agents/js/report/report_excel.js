function report_excel(_win, _dom, _post) {
    var _self = this;
    var classname = "report_excel";
    var parentClass;
    var totalAry = new Object;
    totalAry["co"] = new Array("C1RESULT0", "CRESULT0", "SGOLD0", "WCOUNT0", "GOLD0", "VGOLD0", "MWINGOLD0", "AWINGOLD0", "ARESULT0", "SRESULT0");
    totalAry["su"] = new Array("SRESULT0", "SGOLD0", "SRATIO0", "C1RESULT0", "CRESULT0", "CGOLD0", "CRATIO0", "WCOUNT0", "GOLD0", "VGOLD0", "MWINGOLD0", "AWINGOLD0", "ARESULT0");
    totalAry["ag"] = new Array("AWINGOLD0", "ARESULT0", "SGOLD0", "SRESULT0", "WCOUNT0", "GOLD0", "VGOLD0",
        "WINGOLD0", "RESULT_D0");
    totalAry["mem"] = new Array("WCOUNT0", "GOLD0", "VGOLD0", "WINGOLD_MCY0", "WINGOLD0", "ARESULT0");
    totalAry["list_bet"] = new Array("GOLD", "WIN_GOLD");
    var rowAry = new Object;
    rowAry["co"] = new Array("NAME0", "C1RESULT0", "CRESULT0", "SGOLD0", "WCOUNT0", "GOLD0", "VGOLD0", "MWINGOLD0", "AWINGOLD0", "ARESULT0", "SRESULT0");
    rowAry["su"] = new Array("NAME0", "ALIAS0", "SRESULT0", "SGOLD0", "SRATIO0", "C1RESULT0", "CWINLOSS0", "CRESULT0", "CGOLD0", "CRATIO0", "WCOUNT0", "GOLD0", "VGOLD0", "MWINGOLD0", "AWINGOLD0", "ARESULT0");
    rowAry["ag"] = new Array("NAME0", "ALIAS0", "AWINGOLD0", "AWINLOSS0", "ARESULT0", "SGOLD0", "SWINLOSS0", "SRESULT0", "WCOUNT0", "GOLD0", "VGOLD0", "WINGOLD0", "RESULT_D0");
    rowAry["mem"] = new Array("NAME0", "MEMBER_CODE0", "ALIAS0", "WCOUNT0", "GOLD0", "VGOLD0", "WINGOLD_MCY0", "WINGOLD0", "WINLOSS0", "ARESULT0");
    rowAry["list_bet"] = new Array("DATE", "TIME", "NAME0", "M_TYPE", "IN_RADIO", "ODDF_TYPE", "TID", "GT", "IS_P", "SRV_IP", "TNAME", "BALL_ACT", "GOLD", "WIN_GOLD", "RESULT_WL", "ARESULT", "SRESULT", "CRESULT", "COMWINLOSS");
    var tfootAry =
        new Array("CRTAX_0");
    _self.init = function() {
        parentClass.setColumn(totalAry, rowAry, tfootAry)
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass
    }
};