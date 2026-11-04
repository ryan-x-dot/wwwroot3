function VB_result_detail(_win, _dom, _post) {
    var classname = "VB_result_detail";
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;

    var postHash = _post;
    // console.log(postHash);
    var htmlModel = null;

    if (top.langx == "zh-tw" || top.langx == "zh-cn") {
        var weekAry = ["日", "一", "二", "三", "四", "五", "六"];
    } else if (top.langx == "en-us") {
        var weekAry = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }
    var week = weekAry[postHash["week"]];

    //scroll
    var minHtml = "";

    _self.init = function () {
        // util.echo(classname + " load complete");

        _self.parseData(postHash);

        util.addEvent(dom.getElementById("scroll_control"), "scroll", _self.scrollEvent, dom.getElementById("scroll_control"));
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

        if (newScrollTop > 0) {
            dom.getElementById("scroll_header").innerHTML = minHtml;
            dom.getElementById("scroll_header").style.display = "";
            dom.getElementById("minute_result").style.visibility = "hidden";
        }
    }

    _self.parseData = function (obj) {
        var gameData = obj["data"];

        if (htmlModel == null) {
            htmlModel = dom.getElementById("detail_show").cloneNode(true);
        }

        // var div_model = dom.getElementById("detail_show");
        var tpl = new fastTemplate();
        tpl.init(htmlModel.cloneNode(true));

        var score_type = Array("GMH3", "GMH4", "GMH5", "GMH6", "GMH7", "GMH8", "GMH9", "GMH2", "GMH");

        for (var i = 0; i < score_type.length; i++) {
            tpl.addBlock("game");

            var time_slot = LS.get("str_VB_" + i);
            var score_h = 0;
            var score_c = 0;

            if (score_type[i] in gameData) {
                tpl.replace(new RegExp("\\\*MINUTE_STATUS\\\*", "gi"), "");

                if (gameData[score_type[i]]["result_h"] != undefined) score_h = gameData[score_type[i]]["result_h"];
                if (gameData[score_type[i]]["result_c"] != undefined) score_c = gameData[score_type[i]]["result_c"];
            } else {
                tpl.replace(new RegExp("\\\*MINUTE_STATUS\\\*", "gi"), "style='display:none;'");
            }

            tpl.replace(new RegExp("\\\*GAME_TIMESLOT\\\*", "gi"), time_slot);
            tpl.replace(new RegExp("\\\*TEAM_H_SCORE\\\*", "gi"), score_h);
            tpl.replace(new RegExp("\\\*TEAM_C_SCORE\\\*", "gi"), score_c);
        }

        var div_show = document.getElementById("detail_show");

        //最後parse畫面
        div_show.innerHTML = tpl.fastPrint();

        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*LEAGUENAME\*/g, gameData["league_name"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TEAM_H\*/g, gameData["team_h"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TEAM_C\*/g, gameData["team_c"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TIME\*/g, gameData["datetime"] + " (" + week + ")");

        //監聽 叉叉
        util.addEvent(dom.getElementById("back_btn"), "click", _self.backEvent);

        minHtml = dom.getElementById("minute_result").innerHTML;
    }

    //點叉叉關閉
    _self.backEvent = function (param) {
        parentClass.dispatchEvent("hideResultDetail", null);
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