function BS_result_detail(_win, _dom, _post) {
    var classname = "BS_result_detail";
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;

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

            var _time_slot = LS.get("str_BS_" + i);
            tpl.replace(new RegExp("\\\*GAME_TIMESLOT\\\*", "gi"), _time_slot);
            tpl.replace(new RegExp("\\\*TEAM_H_SCORE\\\*", "gi"), gameData[score_type[i]]["result_h"]);
            tpl.replace(new RegExp("\\\*TEAM_C_SCORE\\\*", "gi"), gameData[score_type[i]]["result_c"]);
        }

        //other 
        if (gameData["rs_more"] != "") {
            // for (key in gameData["rs_more"]) {
            //     var tmp = key.split("_");
            //     if (tmp[1] == "type") {
            //         tpl.addBlock("play");

            //         var _result;
            //         var test_result;
            //         if (gameData["rs_more"][key] == "Y") {
            //             _result = LS.get("str_BS_Y");
            //         } else if (gameData["rs_more"][key] == "N") {
            //             _result = LS.get("str_BS_N");
            //         } else {
            //             _result = "";
            //             // test_result = _self.getManualRS(gameData["rs_more"][key],type);
            //         }

            //         tpl.replace(new RegExp("\\\*GAMERESULT\\\*", "gi"), _result);
            //     }
            // }
            tpl.addBlock("play");
            var _result;
            if(gameData["rs_more"]["OT_type"] == "Y"){
                _result = LS.get("str_BS_Y");
            } else if (gameData["rs_more"]["OT_type"] == "N") {
                _result = LS.get("str_BS_N");
            } else {
                _result = gameData["rs_more"]["OT_result"];
            }
            tpl.replace(new RegExp("\\\*GAMERESULT\\\*", "gi"), _result);
        } else {
            tpl.addBlock("play");

            tpl.replace(new RegExp("\\\*GAMERESULT\\\*", "gi"), "");
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
        otherHtml = dom.getElementById("other_result").innerHTML;
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