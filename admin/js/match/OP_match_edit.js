function OP_match_edit(_win, _dom, _post) {
    var classname = "OP_match_edit";
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;

    var selObj = new Object();
    selObj["status"] = new Array("cancal",0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15);
    var selectFun = new Object();
    var status = 0;
    var aryType = Array("HGMH", "GMH");

    var postHash = _post;
    // console.log(postHash);
    var htmlModel = null;

    var detailData_keys = new Array();
    for (var key in postHash["data"]) {
        if (postHash["data"].hasOwnProperty(key)) detailData_keys.push(key);
    }
    var periodsCnt = 0;
    for (var i = 0; i < detailData_keys.length; i++) {
        var tmpkey = detailData_keys[i];

        if (tmpkey.indexOf("GMH") != -1) periodsCnt++;
    }

    if(top.langx == "zh-tw" || top.langx == "zh-cn" ){
        var weekAry = ["日","一","二","三","四","五","六"];
    }else if (top.langx == "en-us"){
        var weekAry = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    }
    var week = weekAry[postHash["week"]];

    //scroll
    var minHtml = "";
    var otherHtml = "";
    var header_h;
    var secondHeaderTop;

    _self.init = function () {
        // util.echo(classname + " load complete");

        _self.parseData(postHash);
        util.addEvent(dom.getElementById("scroll_control"), "scroll", _self.scrollEvent, dom.getElementById("scroll_control"));
        util.addEvent(dom.getElementById("btn_cancel"),"click",_self.cancel);
        util.addEvent(dom.getElementById("btn_save"),"click",_self.save);

        _self.initSelectFun();
        _self.setSelectEvent();
    }

    _self.initSelectFun=function(){
        selectFun["status"] = _self.chgSel;
    }

    //畫面顯示對應的預設值
    _self.chgSel=function(e, param){
        var rtype = param.rtype;
        var type = param.type;
        status = type;
        if(status>0 || status=="cancal"){
            if(status == 15){
                var str = LS.get("CancelType_SK-14");
            }else if(status=="cancal"){
                var str = "";
            }else{
                var str = LS.get("CancelType-"+status);
            }
            for(var i=0;i<aryType.length;i++){
                dom.getElementById(aryType[i]+"_H").value = str;
                dom.getElementById(aryType[i]+"_C").value = str;
            }
        }else{
            _self.init();
        }
        dom.getElementById(rtype+"_now").innerHTML = dom.getElementById(rtype+"_"+type).innerHTML;
    }

    _self.setSelectEvent=function(){
        for(var rtype in selObj){
            var ary = selObj[rtype];
            var rDom = dom.getElementById(rtype + "_div");
            var rSel = dom.getElementById(rtype + "_sel");
            var rNow = dom.getElementById(rtype + "_now");
            rNow.innerHTML = dom.getElementById(rtype+"_"+status).innerHTML;
            util.setInfEvent(rDom, { "_focus": rSel, "_setView": rDom, "_viewClass": "active" });
            for(var i=0; i<ary.length; i++){
                var type = ary[i];
                util.addEvent(dom.getElementById(rtype+"_"+type), "click", selectFun[rtype], {"rtype":rtype,"type":type});
            }

        }
    }

    _self.cancel = function (){
        _self.init();
    }

    _self.save = function(){
        var ary = aryType;
        var param = top.param;
        param += "&p=get_match_edit_score";
        param += "&gid="+postHash["gid"];
        param += "&gtype="+postHash["gtype"];
        param += "&status="+status;
        for(var i=0; i < ary.length; i++){
            var vh = dom.getElementById(ary[i]+"_H").value;
            var vc = dom.getElementById(ary[i]+"_C").value;
            param += "&"+ary[i]+"_H="+vh;
            param += "&"+ary[i]+"_C="+vc;
        }
        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadEditFinish);
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.loadEditFinish = function(json){
        var data = JSON.parse(json);
        util.showErrorMsg(data.msg);
    }

    _self.setInput = function(name,val) {
        if(typeof(val) == "undefined"){ val = "";}
        return '<input id="'+name+'" type="text" className="agnew_text" style="width: 100%" value="'+val+'">';
    }

    _self.scrollEvent = function (e, targetObj) {
        scroll_e = e;
        _self.scroll_ver_event(e, targetObj);
    }

    _self.scroll_ver_event = function (e, targetObj) {
        if (e == null || !dom.getElementById("scroll_control")) return;
        var newScrollTop = e.target.scrollTop;

        if (newScrollTop == 0) {
            dom.getElementById("scroll_header").style.display = "none";
            dom.getElementById("scroll_header").innerHTML = "";
            dom.getElementById("minute_result").style.visibility = "";
        }

        if (newScrollTop > 0 && newScrollTop < secondHeaderTop) {
            dom.getElementById("scroll_header").innerHTML = minHtml;
            dom.getElementById("scroll_header").style.display = "";
            dom.getElementById("minute_result").style.visibility = "hidden";
            dom.getElementById("other_result").style.visibility = "";
        }

        if (newScrollTop >= secondHeaderTop) {
            dom.getElementById("scroll_header").innerHTML = otherHtml;
            dom.getElementById("other_result").style.visibility = "hidden";
        }
    }

    _self.parseData = function (obj) {
        var gameData = obj["data"];

        if(htmlModel == null) {
            htmlModel = dom.getElementById("detail_show").cloneNode(true);
        }

        // var div_model = dom.getElementById("detail_show");
        var tpl = new fastTemplate();
        tpl.init(htmlModel.cloneNode(true));

        var score_type = Array("HGMH", "GMH");
        for (var i = 0; i < score_type.length; i++) {
            tpl.addBlock("game");

            var _time_slot = LS.get(score_type[i]);
            var score_h = '';
            var score_c = '';
            if (typeof(gameData[score_type[i]]) != "undefined") {
                if (typeof(gameData[score_type[i]]["result_h"]) != "undefined") score_h = gameData[score_type[i]]["result_h"];
                if (typeof(gameData[score_type[i]]["result_c"]) != "undefined") score_c = gameData[score_type[i]]["result_c"];
            }

            tpl.replace(new RegExp("\\\*GAME_TIMESLOT\\\*", "gi"), _time_slot);
            tpl.replace(new RegExp("\\\*TEAM_H_SCORE\\\*", "gi"), _self.setInput(score_type[i]+"_H",score_h));
            tpl.replace(new RegExp("\\\*TEAM_C_SCORE\\\*", "gi"), _self.setInput(score_type[i]+"_C",score_c));
        }




        var div_show = document.getElementById("detail_show");

        //最後parse畫面
        div_show.innerHTML = tpl.fastPrint();

        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*LEAGUENAME\*/g, gameData["league_name"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TEAM_H\*/g, gameData["team_h"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TEAM_C\*/g, gameData["team_c"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TIME\*/g, gameData["datetime"] + " (" + week + ")");

        util.addEvent(dom.getElementById("back_btn"), "click", _self.backEvent);

        minHtml = dom.getElementById("minute_result").innerHTML;

        header_h = dom.getElementById("minute_result").clientHeight;
        secondHeaderTop = header_h * ( periodsCnt + 1);
    }

    _self.getManualRS=function(_result,_type){
        var showResult = _result;
        var openResult = _type;
        var out ="";

        if(openResult == "DL"){
            out ="";
        }else{
            if(showResult != ""){
                out = showResult;
            }else{
                var newOpenResult = openResult;
                if(newOpenResult=="Y"){
                    newOpenResult = LS.get("str_BS_Y");;
                }else if(newOpenResult=="N"){
                    newOpenResult = LS.get("str_BS_N");
                }

                out = newOpenResult;
            }
        }
        return out;
    }

    _self.reinit = function (_parHash) {
        postHash = _parHash;

        _self.init();
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    _self.backEvent = function (param) {
        parentClass.dispatchEvent("hideResultDetail", null);
    }

    //離開此頁移除事件
    _self.exitEvent = function () {
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        return true;
    }

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }
}