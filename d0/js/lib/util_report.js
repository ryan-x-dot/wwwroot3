function util_report(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;

    _self.init=function(){

    }

    _self.getReportModel = function (report_model, getView, report_kind, is_from_acc, isDupLayer){
        var view_w = getView().viewportwidth;
        var ret = "report";
        switch(report_model){
            case "report_d0_set":
            case "report_co_set":
                ret = (view_w >= 1024 || report_kind == "D" || report_kind == "D4") ? "report_b" : "report_s";
                break;
            case "report_su_set":
            case "report_ag_set":
                ret = (view_w >= 1024)? "report_b":"report_s";
                break;
            case "report_d0_valid":
            case "report_d0_all":
            case "report_co_valid":
            case "report_co_all":
            case "report_su_valid":
            case "report_su_all":
            case "report_ag_valid":
            case "report_ag_all":
            case "report_view_d0_all":
            case "report_view_co_all":
            case "report_view_su_all":
            case "report_view_ag_all":
                ret = "report";
                break;
            case "report_view_d0_set":
            case "report_view_co_set":
            case "report_view_su_set":
            case "report_view_ag_set":
            case "report_view_d0_valid":
            case "report_view_co_valid":
            case "report_view_su_valid":
            case "report_view_ag_valid":
            case "report_view_mem":
                if (is_from_acc && (report_model == "report_view_mem") && (view_w < 1024) && isDupLayer ){
                    ret = "report_acc";
                    break;
                }
            case "report_list_bet":
            case "report_list_bet_unsettled":
            case "report_unsettled":
                if(view_w < 600){
                    ret = "report_360";
                }else if(view_w >= 600 && view_w < 768){
                    ret = "report_600";
                }else if(view_w >= 768 && view_w < 1024){
                    ret = "report_768";
                }else if(view_w >= 1024){
                    ret = "report_1024";
                }
                break;
        }
        return ret+"_model";
    }

}