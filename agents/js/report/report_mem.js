function report_mem(_win, _dom, _post) {
    //extends report_index
    var _self = this;
    var classname = "report_mem";
    var totalAry = new Array("WCOUNT0", "GOLD0", "VGOLD0", "WINGOLD_MCY0", "WINGOLD0", "ARESULT0", "MWINGOLD0");

    var rowAry = new Object();
    rowAry["co_Y_set"] = new Array("ID0", "ACTION0", "NAME0", "MEMBER_CODE0", "ALIAS0", "WCOUNT0", "GOLD0", "VGOLD0", "WINGOLD0", "WINGOLD_MCY0", "WINLOSS0", "ARESULT0", "MWINGOLD0");
    rowAry["co_Y_valid"] = rowAry["co_Y_set"];
    rowAry["co_Y_all"] = rowAry["co_Y_set"];
    rowAry["co_N_set"] = new Array("ID0", "ACTION0", "NAME0", "MEMBER_CODE0", "ALIAS0", "WCOUNT0", "GOLD0");
    rowAry["co_N_valid"] = rowAry["co_N_set"];
    rowAry["co_N_all"] = rowAry["co_N_set"];

    rowAry["su_Y_set"] = rowAry["co_Y_set"];
    rowAry["su_Y_valid"] = rowAry["su_Y_set"];
    rowAry["su_Y_all"] = rowAry["su_Y_set"];
    rowAry["su_N_set"] = rowAry["co_N_set"];
    rowAry["su_N_valid"] = rowAry["co_N_set"];
    rowAry["su_N_all"] = rowAry["co_N_set"];

    rowAry["ag_Y_set"] = rowAry["co_Y_set"];
    rowAry["ag_Y_valid"] = rowAry["su_Y_set"];
    rowAry["ag_Y_all"] = rowAry["su_Y_set"];
    rowAry["ag_N_set"] = rowAry["co_N_set"];
    rowAry["ag_N_valid"] = rowAry["co_N_set"];
    rowAry["ag_N_all"] = rowAry["co_N_set"];

    rowAry["mem_Y_set"] = rowAry["co_Y_set"];

    var tfootAry = null;
    _self.init = function() {
        _self.reInit(_self, classname, totalAry, rowAry, tfootAry);
    }
}
