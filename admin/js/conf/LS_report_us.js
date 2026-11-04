function LS_report_us(){
    var _self = this;
    var parentClass;
    var LangxAry;
 
    _self.init=function(){
        LangxAry = _self.set();
    }

    _self.set=function(){
        var array = new Object();
        array["report_layer_co"] = "SMA";
        array["report_layer_su"] = "MA";
        array["report_layer_ag"] = "AG";
        array["report_layer_mem"] = "Member";

        array["parlay_selection"] = "Selections";
        return array;
    }

    _self.get=function(_key){
        return LangxAry[_key];
    }

}