function feature(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var eventHandler = new Object();
    var arr_features = {
        "rwd": false,
        "dasboard": false,
        "search": false,
        "copy": false,
        "reports": false,
        "total": false,
        "wmc": false,
        "performance": false
    };
    // 要顯示的特色
    var show_features = Array("rwd", "dasboard", "search", "copy", "reports", "total", "wmc", "performance");
    // var show_features = Array();

    _self.init=function(){
        util.echo("feature completed");
        parentClass.dispatchEvent("chgPageName", { "pageName": "feature" });
        topFrame.closeRightPanel();

        _self.detect_img() ;
        // parentClass.dispatchEvent("showLoading", { "showLoading": false });
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        topFrame = parentClass.getThis("topFrame");
    }

    _self.detect_img = function () {
        for (var key in arr_features){
            // 狀態初始
            arr_features[key] = false ;
            // 加上 img是否有載完事件
            var this_obj = dom.getElementById("features_" + key) ;
            this_obj.style.display = "none";
            _self.set_onload(this_obj, key);
        }
    }

    _self.set_onload = function (_obj,key) {
        _obj.getElementsByTagName("img")[0].onload = function () {
            _self.check_all_img(key);
        }
    }

    _self.check_all_img = function (do_id) {
        arr_features[do_id] = true;
        var chk_all_img = true;
        for (var i in arr_features) {
            if (!arr_features[i]) {
                chk_all_img = false;
                break;
            }
        }
        // 全部圖片都載完後, 才將要顯示的圖片打開並關閉loading
        if (chk_all_img) {
            _self.show_img() ;
        }
    }

    _self.show_img = function () {
        dom.getElementById("show_nodata").style.display = "none";
        if (show_features.length>0){
            for (var i in show_features) {
                dom.getElementById("features_" + show_features[i]).style.display = "";
            }
        }else{
            dom.getElementById("show_nodata").style.display = "";
        }
        parentClass.dispatchEvent("showLoading", {"showLoading":false});
    }


    //exit
    _self.exitEvent=function(){
        // util.echo("top exit");
        return true;
    }

    _self.backPage=function(e, param){
        parentClass.dispatchEvent("backPage", {"retFun":_self.backPageComplete});
    }

    _self.backPageComplete=function(){
        // util.echo("backPageComplete");
    }


    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

}