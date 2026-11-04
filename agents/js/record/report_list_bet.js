function report_list_bet(_win, _dom, _post){ //extends report_index
    var _self = this;
    var classname = "report_list_bet";
    var totalAry = new Array("WCOUNT","AG_WIN_GOLD","GOLD","WIN_GOLD");

    var rowAry = new Object();
    rowAry["co_Y_set"] = new Array("DATE", "TIME","TD_CONTENT", "ODDF_TYPE","WAGERS_ID", "CANCEL_APN", "CANCEL_DIS", "TID", "TNAME", "BALL_ACT","CANCEL_MSG","TEAM_H","TEAM_C","NUM_H","NUM_C","IORATIO","CON","RESULT_WL","RESULT_WL_CLASS","SCORE","DIF_SCORE","ORDER_TYPE","ORDER_CON","FS_STY","LEAGUE","GT","DIS_GT","SRV_IP","WAGERS_TYPE","WIN_GOLD","WIN_GOLD_CLASS","GOLD","ARESULT","SRESULT","CRESULT");
    rowAry["co_Y_valid"] = rowAry["co_Y_set"];
    rowAry["co_Y_all"] = rowAry["co_Y_set"];
    rowAry["co_N_set"] = rowAry["co_Y_set"];
    rowAry["co_N_valid"] = rowAry["co_N_set"];
    rowAry["co_N_all"] = rowAry["co_N_set"];

    rowAry["su_Y_set"] = rowAry["co_Y_set"];
    rowAry["su_Y_valid"] = rowAry["co_Y_set"];
    rowAry["su_Y_all"] = rowAry["co_Y_set"];
    rowAry["su_N_set"] = rowAry["co_N_set"] ;
    rowAry["su_N_valid"] = rowAry["co_N_set"];
    rowAry["su_N_all"] = rowAry["co_N_set"];

    rowAry["ag_Y_set"] = rowAry["co_Y_set"];
    rowAry["ag_Y_valid"] = rowAry["co_Y_set"];
    rowAry["ag_Y_all"] = rowAry["co_Y_set"];
    rowAry["ag_N_set"] = rowAry["co_N_set"] ;
    rowAry["ag_N_valid"] = rowAry["co_N_set"];
    rowAry["ag_N_all"] = rowAry["co_N_set"];


    var tfootAry = null;
    _self.init=function(){
        _self.reInit(_self, classname, totalAry, rowAry, tfootAry);
    }
}