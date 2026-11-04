function bet_header(_win, _dom, _toppar){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "bet_header";
    var util;
    var LS;
    var LS_code;
    var eventHandler = new Object();
    // var toppar = new Object();
    var toppar = _toppar;
    var showtypeAry = new Array("LIST","ABNORMAL","LIVE");
    //var gtypeAry = new Array("FT","BK","TN","VB","BM","TT","BS","SK","OP");

    _self.init=function(){
        if(toppar==null)toppar = new Object();
        // console.log("[bet_header][init]",toppar);
        util.echo("bet_header complete");
        //parentClass.dispatchEvent("chgPageName", { "pageName": "bet" });

        //console.log(toppar);
        for (var i = 0; i < showtypeAry.length; i++) {
            var _name = showtypeAry[i];
            util.addEvent(dom.getElementById("bet_" + _name), "click", _self.chgShowType, { "type": _name });
        }

        if(top.bet_showtype==null)top.bet_showtype = "LIST"; //預設赛程
        if(top.bet_gtype==null)top.bet_gtype = "All"; //預設赛程
        if(toppar["sub_page"] == null) toppar["sub_page"] = "bet_index";
        if(toppar["bet_showtype"]==null)toppar["bet_showtype"] = top.bet_showtype;
        if(toppar["bet_gtype"]==null)toppar["bet_gtype"] = top.bet_gtype;

        //console.log(toppar);
        //_self.addEventListener("changeFilter",_self.changeFilter);
        _self.addEventListener("hideFilter",_self.hideFilterEvent);
        _self.initShowType();
        _self.subPage(toppar);
        // _self.getTbetIndex(toppar);

        //parentClass.dispatchEvent("showLoading", {"showLoading":false});

    }

    /*_self.hideFilter=function(param){
        // console.log("index");
        _self.showDiv({"type":"body_show"});
        filterFrame = null;
    }*/

    _self.changeFilter=function(param){
        try{
            //parentClass.changeFilter(param);
        }catch(e){
            util.err("[changeFilter]", e);
        }
        //_self.hideFilter(null);
    }

    _self.showDiv=function(param){
        // dom.getElementById("acc_show").style.display = "none";
        // console.log(param);
        dom.getElementById("body_show").style.display = "none";
        dom.getElementById("wmc_filter_show").style.display = "none";
        dom.getElementById(param.type).style.display = "";
    }

    _self.subPage = function(par){
        // if(par["sub_page"] == "result_index" || par["sub_page"] == "bet_index" || par["sub_page"] == "parlay_index"){
            // _self.getTbetIndex(par,true);
        // }
        if(par["sub_page"] == "bet_wagers_index"){
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
        // tmp_toppar["bet_showtype"] = param.type;
        // _self.initShowType();
        toppar["bet_showtype"] = param.type;
        if(toppar["bet_showtype"] == "SCORE"){
            toppar["sub_page"] = "score_index";
        }else{
            toppar["sub_page"] = "bet_index";
        }
        _self.getTbetIndex(toppar,false);
    }

    _self.initShowType = function () {
        for (var i = 0; i < showtypeAry.length; i++) {
            var _name = showtypeAry[i];
            dom.getElementById("bet_" + _name).classList.remove("on");
        }
        _self.scroll_showtype(toppar["bet_showtype"]);
        dom.getElementById("bet_" + toppar["bet_showtype"]).classList.add("on");
        top.bet_showtype = toppar["bet_showtype"];
    }

    _self.getTbetIndex = function (par,isInit) {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        //console.log(par);
        //切換時重置下拉霸事件 以免互相影響
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        if(isInit){
            var param = new Object();
            param["page"] = "bet_index";
            //param["page"] = "bet_index";
            param["target"] = "bet_body";
            param["useDefineParent"] = "Y"; //bet_index載進來才會再執行init();
            param["postHash"] = par;
            parentClass.dispatchEvent("goToPage", param);
        }else{

            var param = new Object();
            param["page"] = "bet_header";
            //param["useDefineParent"] = "Y"; //bet_index載進來才會再執行init();
            param["postHash"] = par;
            parentClass.dispatchEvent("bodyGoToPage", param);
        }


    }

    _self.scroll_showtype = function(show_type){
        var obj = document.getElementById("bet_"+show_type);
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