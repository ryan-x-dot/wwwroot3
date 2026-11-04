function TN_match_edit(_win, _dom, _post) {
    var classname = "TN_match_edit";
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

    var postHash = _post;
    // console.log(postHash);
    var htmlModel = null;

    if (top.langx == "zh-tw" || top.langx == "zh-cn") {
        var weekAry = ["日", "一", "二", "三", "四", "五", "六"];
    } else if (top.langx == "en-us") {
        var weekAry = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }
    var week = weekAry[postHash["week"]];

    //var setAry = Object.keys(postHash["data"]["rs_more"]);
    var setAry = new Array();
    var setCount = 0;
    for(var key in postHash["data"]["rs_more"]){
        if(postHash["data"]["rs_more"].hasOwnProperty(key)) {
            setAry.push(key);
            setCount++;
        }
    }

    var setIdAry = Array();
    //var setCount = Object.keys(postHash["data"]["rs_more"]).length;
    // console.log(setCount);
    var winner;

    var resultTypeAry = Array("GMH1", "GMH2", "GMH3", "GMH4", "GMH5", "GMH6", "GMH");

    //scroll
    var headerHtml = "";

    _self.init = function () {
        // util.echo(classname + " load complete");

        _self.setGame();
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
            for(var i=0;i<resultTypeAry.length;i++){
                dom.getElementById(resultTypeAry[i]+"_H").value = str;
                dom.getElementById(resultTypeAry[i]+"_C").value = str;
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
        var ary = resultTypeAry;
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
            dom.getElementById("minute_title").style.visibility = "";
        }

        if (newScrollTop > 0) {
            dom.getElementById("scroll_header").innerHTML = headerHtml;
            dom.getElementById("scroll_header").style.display = "";
            dom.getElementById("minute_title").style.visibility = "hidden";
        }
    }

    _self.setGame = function () {
        var div_model = dom.getElementById("set_list");
        var tpl = new fastTemplate();
        tpl.init(div_model.cloneNode(true));

        if (setCount > 0) {
            for (var i = 0; i < setCount; i++) {
                tpl.addBlock("set");

                var setNum = 0;
                switch (setAry[i]) {
                    case "RFA":
                        setNum = 1;
                        break;
                    case "RFB":
                        setNum = 2;
                        break;
                    case "RFC":
                        setNum = 3;
                        break;
                    case "RFD":
                        setNum = 4;
                        break;
                    case "RFE":
                        setNum = 5;
                        break;
                }
                setIdAry.push(setNum);

                tpl.replace(new RegExp("\\\*SETSTATUS\\\*", "gi"), "");
                tpl.replace(new RegExp("\\\*NO\\\*", "gi"), setNum);
                tpl.replace(new RegExp("\\\*SETNO\\\*", "gi"), LS.get("str_TN_game_" + setNum));
            }
        } else {
            tpl.addBlock("set");

            tpl.replace(new RegExp("\\\*SETSTATUS\\\*", "gi"), "style='display:none;'");
        }

        var div_show = document.getElementById("set_list");
        //最後parse畫面
        div_show.innerHTML = tpl.fastPrint();

        _self.parseData("main", postHash);
    }

    _self.parseData = function (set, obj) {
        var gameData = obj["data"];

        if(htmlModel == null) {
            htmlModel = dom.getElementById("detail_show").cloneNode(true);
        }

        // var div_model = dom.getElementById("detail_show");
        var tpl = new fastTemplate();
        tpl.init(htmlModel.cloneNode(true));

        for (var i = 0; i < resultTypeAry.length; i++) {
            tpl.addBlock("game");

            var time_slot = LS.get("str_TN_" + i);
            if(resultTypeAry[i] == "GMH"){
                var time_slot = LS.get("str_TN_7");
            }
            var score_h = "";
            var score_c = "";

            tpl.replace(new RegExp("\\\*MINUTE_STATUS\\\*", "gi"), "");
            if (typeof(gameData[resultTypeAry[i]]) != "undefined") {
                if (typeof(gameData[resultTypeAry[i]]["result_h"]) != "undefined") score_h = gameData[resultTypeAry[i]]["result_h"];
                if (typeof(gameData[resultTypeAry[i]]["result_c"]) != "undefined") score_c = gameData[resultTypeAry[i]]["result_c"];
            }

            tpl.replace(new RegExp("\\\*GAME_TIMESLOT\\\*", "gi"), time_slot);
            tpl.replace(new RegExp("\\\*TEAM_H_SCORE\\\*", "gi"), _self.setInput(resultTypeAry[i]+"_H",score_h));
            tpl.replace(new RegExp("\\\*TEAM_C_SCORE\\\*", "gi"), _self.setInput(resultTypeAry[i]+"_C",score_c));
            tpl.replace(new RegExp("\\\*MINUTE_STATUS\\\*", "gi"), "");
        }

        var div_show = document.getElementById("detail_show");

        //最後parse畫面
        div_show.innerHTML = tpl.fastPrint();

        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*LEAGUENAME\*/g, gameData["league_name"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TEAM_H\*/g, gameData["team_h"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TEAM_C\*/g, gameData["team_c"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TIME\*/g, gameData["datetime"] + " (" + week + ")");

        _self.showView(set);
        _self.clickBtn();

        headerHtml = dom.getElementById("minute_title").innerHTML;
    }

    _self.chgOtherData = function (set, obj) {
        switch (set) {
            case 1:
                _type = "RFA";
                break;
            case 2:
                _type = "RFB";
                break;
            case 3:
                _type = "RFC";
                break;
            case 4:
                _type = "RFD";
                break;
            case 5:
                _type = "RFE";
                break;
        }

        var resutData = obj["data"]["rs_more"][_type];

        var div_model = dom.getElementById("other_body_model");
        var tpl = new fastTemplate();
        tpl.init(div_model.cloneNode(true));

        for (var i = 0; i < resutData.length; i++) {
            tpl.addBlock("play");

            // var _time_slot = LS.get("game_TN_" + (i + 1));
            var tmp = ((i + 1) < 10) ? "0" + (i + 1) : (i + 1);
            var _time_slot = LS.get(_type + tmp);
            tpl.replace(new RegExp("\\\*GAMETYPE\\\*", "gi"), _time_slot);

            if (resutData[i]["type"] == "H") {
                winner = obj["data"]["team_h"];
            } else if (resutData[i]["type"] == "C") {
                winner = obj["data"]["team_c"]
            } else {
                winner = resutData[i]["result"];
            }
            tpl.replace(new RegExp("\\\*GAMERESULT\\\*", "gi"), winner);
        }

        var div_show = document.getElementById("other_body");

        div_show.innerHTML = tpl.fastPrint();
    }

    //點叉叉關閉
    _self.backEvent = function (param) {
        parentClass.dispatchEvent("hideResultDetail", null);
    }

    _self.chgSet = function (e, obj) {
        dom.getElementById("gameMain").classList.remove("on");
        for (var i = 0; i < setIdAry.length; i++) {
            dom.getElementById("set_" + setIdAry[i]).classList.remove("on");
        }

        if (obj.type == "main") {
            dom.getElementById("gameMain").classList.add("on");
        } else {
            dom.getElementById("set_" + obj.type).classList.add("on");
        }

        if (obj.type != "main") {
            _self.chgOtherData(obj.type, postHash);
        }
        _self.showView(obj.type);
        dom.getElementById("scroll_control").scrollTop = 0;

        headerHtml = dom.getElementById("other_title").innerHTML;
    }

    _self.showView = function (set) {
        if (set == "main") {
            dom.getElementById("minute_title").style.display = "";
            dom.getElementById("minute_body").style.display = "";
            dom.getElementById("other_title").style.display = "none";
            dom.getElementById("other_body").style.display = "none";
        } else {
            dom.getElementById("minute_title").style.display = "none";
            dom.getElementById("minute_body").style.display = "none"
            dom.getElementById("other_title").style.display = "";
            dom.getElementById("other_body").style.display = "";
        }
    }

    _self.clickBtn = function (e) {
        //監聽 叉叉
        util.addEvent(dom.getElementById("back_btn"), "click", _self.backEvent);

        //監聽 set列
        util.addEvent(dom.getElementById("gameMain"), "click", _self.chgSet, { "type": "main" });
        for (var i = 0; i < setIdAry.length; i++) {
            util.addEvent(dom.getElementById("set_" + setIdAry[i]), "click", _self.chgSet, { "type": setIdAry[i] });
        }
        util.addEvent(dom.getElementById("scroll_control"), "scroll", _self.scrollEvent, dom.getElementById("scroll_control"));
    }

    _self.reinit = function (_parHash) {
        postHash = _parHash;

        _self.init();
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
    }

    _self.getThis = function (varible) {
        return eval(varible);
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