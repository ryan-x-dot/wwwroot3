function LS_report_tw(){
    var _self = this;
    var parentClass;
    var LangxAry;
 
    _self.init=function(){
        LangxAry = _self.set();
    }

    _self.set=function(){
        var array = new Object();
        array["report_layer_co"] = "股東";
        array["report_layer_su"] = "總代理";
        array["report_layer_ag"] = "代理商";
        array["report_layer_mem"] = "會員";

        array["parlay_selection"] = " 串 1";
        return array;
    }

    _self.get=function(_key){
        return LangxAry[_key];
    }

}