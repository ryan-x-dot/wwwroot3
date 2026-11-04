function totalbet_header(_win, _dom,_toppar){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "totalbet_header";
    var util;
    var LS;
    var LS_code;
    var eventHandler = new Object();

    // var toppar = new Object();
    var toppar = _toppar;
    var showtypeAry = new Array("INPLAY","TODAY","EARLY","STARTED","PARLAY","OUTRIGHT","RESULTS");
    //var gtypeAry = new Array("FT","BK","TN","VB","BM","TT","BS","SK","OP");

    _self.init=function(){
        if(toppar==null)toppar = new Object();
        // console.log("[totalbet_header][init]",toppar);
        util.echo("totalbet_header complete");
        //parentClass.dispatchEvent("chgPageName", { "pageName": "bet" });


        for (var i = 0; i < showtypeAry.length; i++) {
            var _name = showtypeAry[i];
            util.addEvent(dom.getElementById("tbet_" + _name), "click", _self.chgShowType, { "type": _name });
        }

        if(top.tbet_showtype==null)top.tbet_showtype = "INPLAY"; //預設滾球
        if(top.tbet_gtype==null)top.tbet_gtype = "FT"; //預設滾球
        if(toppar["sub_page"] == null) toppar["sub_page"] = "totalbet_index";
        if(toppar["tbet_showtype"]==null)toppar["tbet_showtype"] = top.tbet_showtype;
        if(toppar["tbet_gtype"]==null)toppar["tbet_gtype"] = top.tbet_gtype;


        _self.addEventListener("changeFilter",_self.changeFilterEvent);
        _self.addEventListener("hideFilter",_self.hideFilterEvent);
        _self.initShowType();
        _self.subPage(toppar);
        // _self.getTbetIndex(toppar);

        //parentClass.dispatchEvent("showLoading", {"showLoading":false});

    }

    _self.subPage = function(par){
        // if(par["sub_page"] == "result_index" || par["sub_page"] == "totalbet_index" || par["sub_page"] == "parlay_index"){
            // _self.getTbetIndex(par,true);
        // }
        if(par["sub_page"] == "wagers_index"){
            _self.gotoBetDetail(par,true);
            return
        }
        _self.getTbetIndex(par,true);
    }
    _self.gotoBetDetail = function(par,isInit){
        var tmppar = new Object();
        tmppar["page"] = par["sub_page"];
        tmppar["target"] = par["sub_target"];
        tmppar["retFun"] = par["sub_retFun"];
        tmppar["useDefineParent"] = "Y";
        tmppar["postHash"] = par;
        parentClass.dispatchEvent("goToPage", tmppar);

    }
    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS_code = parentClass.getThis("LS_code");
        //LS = parentClass.getThis("LS");
    }

    _self.chgShowType = function (e, param) {
        // tmp_toppar = util.clone(toppar);
        // tmp_toppar["tbet_showtype"] = param.type;
        // _self.initShowType();
        toppar["tbet_showtype"] = param.type;
        if(toppar["tbet_showtype"] == "RESULTS"){
            toppar["sub_page"] = "result_index";
        }else if(toppar["tbet_showtype"] == "OUTRIGHT"){
            toppar["sub_page"] = "totalbet_index";
        }else if(toppar["tbet_showtype"] == "PARLAY"){
            toppar["sub_page"] = "parlay_index";
        }else{
            toppar["sub_page"] = "totalbet_index";
        }
        _self.getTbetIndex(toppar,false);
    }

    _self.initShowType = function () {
        for (var i = 0; i < showtypeAry.length; i++) {
            var _name = showtypeAry[i];
            dom.getElementById("tbet_" + _name).classList.remove("on");
        }
        _self.scroll_showtype(toppar["tbet_showtype"]);
        dom.getElementById("tbet_" + toppar["tbet_showtype"]).classList.add("on");
        top.tbet_showtype = toppar["tbet_showtype"];
    }

    _self.getTbetIndex = function (par,isInit) {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        //console.log(par);
        //切換時重置下拉霸事件 以免互相影響
        util.removeEvent(dom.getElementById("body_show"), "scroll");


        if(isInit){

            var param = new Object();
            if(par["tbet_showtype"] == "RESULTS"){
                param["page"] = "result_index";
            }else if(par["tbet_showtype"] == "OUTRIGHT"){
                param["page"] = "totalbet_index";
            }else if(par["tbet_showtype"] == "PARLAY"){
                param["page"] = "parlay_index";
            }else{
                param["page"] = "totalbet_index";
            }
            //param["page"] = "totalbet_index";
            param["target"] = "totalbet_body";
            param["useDefineParent"] = "Y"; //totalbet_index載進來才會再執行init();
            param["postHash"] = par;
            parentClass.dispatchEvent("goToPage", param);
        }else{

            var param = new Object();
            param["page"] = "totalbet_header";
            //param["useDefineParent"] = "Y"; //totalbet_index載進來才會再執行init();
            param["postHash"] = par;
            parentClass.dispatchEvent("bodyGoToPage", param);
        }


    }

    _self.scroll_showtype = function(show_type){
        var obj = document.getElementById("tbet_"+show_type);
        var obj_left = obj.offsetWidth*1 + obj.offsetLeft*1;
        var ul = obj.parentElement;
        var go_left = obj_left*1 - ul.offsetWidth*1;
        if(go_left <0) go_left=0;
        //ie11 不支援
        //ul.scrollTo(go_left,0);
        ul.scrollLeft=go_left;
    }

    _self.getComplete = function () {
        // console.log(classname+"|_self.getComplete")
    }

    _self.onError=function(){
        // console.log("onError");
    }


    _self.getThis=function(varible){
        return eval(varible);
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

    _self.changePage=function(e, param){
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.changePageComplete=function(){
        // util.echo("changePageComplete");
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }
    _self.changeFilter=function(obj){
        _self.dispatchEvent("changeFilter",obj);
    }

    _self.changeFilterEvent=function(obj){
        // console.log("["+classname+"]"+"changeFilterEvent",obj);
        alert("[changeFilterEvent] override it");
    }


    _self.hideFilter=function(obj){
        _self.dispatchEvent("hideFilter",obj);
    }

    _self.hideFilterEvent=function(obj){
        // console.log("["+classname+"]"+"hideFilterEvent",obj);
        // alert("[hideFilterEvent] override it");
    }
}