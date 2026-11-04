function LS_report_cn(){
    var _self = this;
    var parentClass;
    var LangxAry;
 
    _self.init=function(){
        LangxAry = _self.set();
    }

    _self.set=function(){
        var array = new Object();
        array["report_layer_ads"] = "超管员";
        array["report_layer_ad"] = "公司";
        array["report_layer_d0"] = "分公司";
        array["report_layer_co"] = "股东";
        array["report_layer_su"] = "总代理";
        array["report_layer_ag"] = "代理商";
        array["report_layer_mem"] = "会员";

        array["parlay_selection"] = " 串 1";
        return array;
    }

    _self.get=function(_key){
        return LangxAry[_key];
    }

}

