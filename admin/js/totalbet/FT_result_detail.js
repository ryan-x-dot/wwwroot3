function FT_result_detail(_win, _dom, _post) {
    var classname = "FT_result_detail";
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

    if (top.langx == "zh-tw" || top.langx == "zh-cn") {
        var weekAry = ["日", "一", "二", "三", "四", "五", "六"];
    } else if (top.langx == "en-us") {
        var weekAry = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }
    var week = weekAry[postHash["week"]];

    var showMinuteTitle = true;
    var showOtherTitle = true;

    var _manualAry = new Array("BH", "ARG", "BRG", "CRG", "DRG", "ERG", "FRG", "GRG", "HRG", "IRG", "JRG", "FG", "F2G", "F3G", "T1G", "T3G", "TK", "PA", "RCD", "MQ", "MW", "OG", "OT", "RPS");
    var _spAry = new Array("PGF", "PGL", "OSF", "OSL", "STF", "STL", "CNF", "CNL", "CDF", "CDL", "RCF", "RCL", "YCF", "YCL", "GAF", "GAL");
    var _cornerAry = new Array("RNC1", "RNC2", "RNC3", "RNC4", "RNC5", "RNC6", "RNC7", "RNC8", "RNC9", "RNCA", "RNCB", "RNCC", "RNCD", "RNCE", "RNCF", "RNCG", "RNCH", "RNCI", "RNCJ", "RNCK", "RNCL", "RNCM", "RNCN", "RNCO", "RNCP", "RNCQ", "RNCR", "RNCS", "RNCT", "RNCU");
    var _bookingAry = new Array("RNBA", "RNBB", "RNBC", "RNBD", "RNBE", "RNBF", "RNBG", "RNBH", "RNBI", "RNBJ", "RNBK", "RNBL", "RNBM", "RNBN", "RNBO");
    var _penaltyAry = new Array("RSHA", "RSHB", "RSHC", "RSHD", "RSHE", "RSHF", "RSHG", "RSHH", "RSHI", "RSHJ", "RSHK", "RSHL", "RSHM", "RSHN", "RSHO", "RPF");
    var _sfsAry = new Array("SFS_f", "SFS_l", "SFS_a");

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
        var time_title;

        if (htmlModel == null) {
            htmlModel = dom.getElementById("detail_show").cloneNode(true);
        }

        var tpl = new fastTemplate();
        tpl.init(htmlModel.cloneNode(true));

        var score_type_h = Array("AGMH", "BGMH", "CGMH", "HGMH", "DGMH", "EGMH", "FGMH", "GMH");
        var score_type_c = Array("AGMC", "BGMC", "CGMC", "HGMC", "DGMC", "EGMC", "FGMC", "GMC");
        showMinuteTitle = false;

        for (var i = 0; i < score_type_h.length; i++) {
            if (score_type_h[i] in gameData === true) {
                tpl.addBlock("GAME");

                var time_slot;
                if (gameData["ptype"] == "779") {
                    time_title = LS.get("FT_title1");
                    time_slot = LS.get("T" + score_type_h[i]);
                } else {
                    time_title = LS.get("FT_title2");
                    time_slot = LS.get(score_type_h[i]);
                }

                tpl.replace(new RegExp("\\\*MINUTE_STATUS\\\*", "gi"), "");
                tpl.replace(new RegExp("\\\*GAME_TIMESLOT\\\*", "gi"), time_slot);
                tpl.replace(new RegExp("\\\*TEAM_H_SCORE\\\*", "gi"), gameData[score_type_h[i]]);
                if (gameData[score_type_c[i]] == undefined) {
                    tpl.replace(new RegExp("\\\*TEAM_C_SCORE\\\*", "gi"), gameData[score_type_h[i]]);
                } else {
                    tpl.replace(new RegExp("\\\*TEAM_C_SCORE\\\*", "gi"), gameData[score_type_c[i]]);
                }
                showMinuteTitle = true;
            } else {
                tpl.addBlock("GAME");

                tpl.replace(new RegExp("\\\*MINUTE_STATUS\\\*", "gi"), "style='display:none;'");
            }
        }

        //other 
        var rs_more_length = 0;
        for (var key in gameData["rs_more"]) {
            if (gameData["rs_more"].hasOwnProperty(key)) rs_more_length++;
        }
        if (rs_more_length != "0") {
            var tmpCodeAry = new Array();
            var tmpCodeAry2 = new Array(); //點球大戰 主
            var tmpCodeAry3 = new Array(); //點球大戰 客
            for (key in gameData["rs_more"]) {
                var tmp = key.split("_");

                var tmpCode = tmp[0];

                if (tmpCodeAry.indexOf(tmpCode) == -1) {
                    if (tmpCode.substr(0, 3) == "RSH") {
                        if (tmpCodeAry2.indexOf(tmpCode) == -1) {
                            tmpCodeAry2.push(tmpCode);
                        }
                    } else if (tmpCode.substr(0, 3) == "RSC") {
                        if (tmpCodeAry3.indexOf(tmpCode) == -1) {
                            tmpCodeAry3.push(tmpCode);
                        }
                    } else {
                        if (tmpCodeAry.indexOf(tmpCode) == -1) {
                            tmpCodeAry.push(tmpCode);
                        }
                    }
                }
            }

            if (tmpCodeAry.length != 0) {
                //for (var i = 0; i < tmpCodeAry.length; i++) {
                for (var j = 0; j < _manualAry.length; j++) {
                    if (tmpCodeAry.indexOf(_manualAry[j]) != -1) {
                        var _code = _manualAry[j];
                        var _result = gameData["rs_more"][_code + "_result"];
                        var _type = gameData["rs_more"][_code + "_type"];

                        var rs = "";
                        var rs = _self.getManualRS(_code, _result, _type, gameData["team_h"], gameData["team_c"]);

                        tpl.addBlock("WTYPE");

                        if (rs != undefined) {
                            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "");
                            tpl.replace(new RegExp("\\\*MORE_WTYPE\\\*", "gi"), LS.get(_code));
                            tpl.replace(new RegExp("\\\*WTYPE_RS\\\*", "gi"), rs);
                        } else {
                            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "style='display:none;'");
                        }
                    }
                }
                for (var j = 0; j < _spAry.length; j++) {
                    if (tmpCodeAry.indexOf(_spAry[j]) != -1) {
                        var _code = _spAry[j];
                        var _result = gameData["rs_more"][_code + "_result"];
                        var _type = gameData["rs_more"][_code + "_type"];

                        var rs = "";
                        var rs = _self.getManualRS(_code, _result, _type, gameData["team_h"], gameData["team_c"]);

                        tpl.addBlock("WTYPE");

                        if (rs != undefined) {
                            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "");
                            tpl.replace(new RegExp("\\\*MORE_WTYPE\\\*", "gi"), LS.get(_code));
                            tpl.replace(new RegExp("\\\*WTYPE_RS\\\*", "gi"), rs);
                        } else {
                            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "style='display:none;'");
                        }
                    }
                }
                for (var j = 0; j < _cornerAry.length; j++) {
                    if (tmpCodeAry.indexOf(_cornerAry[j]) != -1) {
                        var _code = _cornerAry[j];
                        var _result = gameData["rs_more"][_code + "_result"];
                        var _type = gameData["rs_more"][_code + "_type"];

                        var rs = "";
                        var rs = _self.getManualRS(_code, _result, _type, gameData["team_h"], gameData["team_c"]);

                        tpl.addBlock("WTYPE");

                        if (rs != undefined) {
                            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "");
                            tpl.replace(new RegExp("\\\*MORE_WTYPE\\\*", "gi"), LS.get(_code));
                            tpl.replace(new RegExp("\\\*WTYPE_RS\\\*", "gi"), rs);
                        } else {
                            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "style='display:none;'");
                        }
                    }
                }
                for (var j = 0; j < _bookingAry.length; j++) {
                    if (tmpCodeAry.indexOf(_bookingAry[j]) != -1) {
                        var _code = _bookingAry[j];
                        var _result = gameData["rs_more"][_code + "_result"];
                        var _type = gameData["rs_more"][_code + "_type"];

                        var rs = "";
                        var rs = _self.getManualRS(_code, _result, _type, gameData["team_h"], gameData["team_c"]);

                        tpl.addBlock("WTYPE");

                        if (rs != undefined) {
                            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "");
                            tpl.replace(new RegExp("\\\*MORE_WTYPE\\\*", "gi"), LS.get(_code));
                            tpl.replace(new RegExp("\\\*WTYPE_RS\\\*", "gi"), rs);
                        } else {
                            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "style='display:none;'");
                        }
                    }
                }
                for (var j = 0; j < _penaltyAry.length; j++) {
                    if (tmpCodeAry.indexOf(_penaltyAry[j]) != -1) {
                        var _code = _penaltyAry[j];
                        var _result = gameData["rs_more"][_code + "_result"];
                        var _type = gameData["rs_more"][_code + "_type"];

                        var rs = "";
                        var rs = _self.getManualRS(_code, _result, _type, gameData["team_h"], gameData["team_c"]);

                        tpl.addBlock("WTYPE");

                        if (rs != undefined) {
                            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "");
                            tpl.replace(new RegExp("\\\*MORE_WTYPE\\\*", "gi"), LS.get(_code));
                            tpl.replace(new RegExp("\\\*WTYPE_RS\\\*", "gi"), rs);
                        } else {
                            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "style='display:none;'");
                        }
                    }
                }
                //}
            } else {
                tpl.addBlock("WTYPE");

                tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "style='display:none;'");

            }

            if (tmpCodeAry2.length != 0) {
                for (var i = 0; i < tmpCodeAry2.length; i++) {
                    var _code = tmpCodeAry2[i];     //主
                    var _code2 = tmpCodeAry3[i];    //客

                    var _result = gameData["rs_more"][_code + "_result"];
                    var _type = gameData["rs_more"][_code + "_type"];
                    var _result2 = gameData["rs_more"][_code2 + "_result"];
                    var _type2 = gameData["rs_more"][_code2 + "_type"];

                    var rs = "";
                    var rs2 = "";
                    var rs = _self.getManualRS(_code, _result, _type, gameData["team_h"], gameData["team_c"]);
                    var rs2 = _self.getManualRS(_code2, _result2, _type2, gameData["team_h"], gameData["team_c"]);

                    if (rs == "") break;

                    tpl.addBlock("WTYPE2");

                    tpl.replace(new RegExp("\\\*OTHER_STATUS2\\\*", "gi"), "");
                    tpl.replace(new RegExp("\\\*MORE_WTYPE\\\*", "gi"), LS.get(_code));
                    tpl.replace(new RegExp("\\\*WTYPE_RSH\\\*", "gi"), rs);
                    tpl.replace(new RegExp("\\\*WTYPE_RSC\\\*", "gi"), rs2);
                }
            } else {
                tpl.addBlock("WTYPE2");

                tpl.replace(new RegExp("\\\*OTHER_STATUS2\\\*", "gi"), "style='display:none;'");
            }
        } else {
            tpl.addBlock("WTYPE");

            tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "style='display:none;'");

            tpl.addBlock("WTYPE2");

            tpl.replace(new RegExp("\\\*OTHER_STATUS2\\\*", "gi"), "style='display:none;'");
            showOtherTitle = false;
        }

        var rs_sfs_length = 0;
        for (var key in gameData["rs_sfs"]) {
            if (gameData["rs_sfs"].hasOwnProperty(key))
                rs_sfs_length++;
        }

        if (rs_sfs_length != "0") {
            var tmpCodeAry = new Array();
            for (key in gameData["rs_sfs"]) {
                var tmp = key.split("_");

                var tmpCode = tmp[0] + "_" + tmp[1];

                if (tmpCodeAry.indexOf(tmpCode) == -1) {
                    if (tmpCodeAry.indexOf(tmpCode) == -1) {
                        tmpCodeAry.push(tmpCode);
                    }
                }
            }
            if (tmpCodeAry.length != 0) {
                for (var j = 0; j < _sfsAry.length; j++) {
                    if (tmpCodeAry.indexOf(_sfsAry[j]) != -1) {
                        var _code = _sfsAry[j];
                        var _result = gameData["rs_sfs"][_code]["result"];
                        var _type = gameData["rs_sfs"][_code]["type"];

                        tpl.addBlock("WTYPE");

                        tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "");
                        tpl.replace(new RegExp("\\\*MORE_WTYPE\\\*", "gi"), _type);
                        tpl.replace(new RegExp("\\\*WTYPE_RS\\\*", "gi"), _result);
                    }
                }

                showOtherTitle = true;
            } else {
                tpl.addBlock("WTYPE");

                tpl.replace(new RegExp("\\\*OTHER_STATUS\\\*", "gi"), "style='display:none;'");
                showOtherTitle = false;
            }
        }

        var div_show = document.getElementById("detail_show");

        //最後parse畫面
        div_show.innerHTML = tpl.fastPrint();

        if (showMinuteTitle) {
            dom.getElementById("minute_result").style.display = "";
        } else {
            dom.getElementById("minute_result").style.display = "none";
        }
        if (showOtherTitle) {
            dom.getElementById("other_result").style.display = "";
        } else {
            dom.getElementById("other_result").style.display = "none";
        }
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*LEAGUENAME\*/g, gameData["league_name"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TIME_TYPE\*/g, time_title);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TEAM_H\*/g, gameData["team_h"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TEAM_C\*/g, gameData["team_c"]);
        dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TIME\*/g, gameData["datetime"] + " (" + week + ")");

        util.addEvent(dom.getElementById("back_btn"), "click", _self.backEvent);

        minHtml = dom.getElementById("minute_result").innerHTML;
        otherHtml = dom.getElementById("other_result").innerHTML;
        header_h = dom.getElementById("minute_result").clientHeight;
        secondHeaderTop = header_h * (periodsCnt + 1);
    }

    _self.getManualRS = function (_wtype, _result, _type, _team_h, _team_c) {
        var showResult = _result;
        var openResult = _type;
        var out = "";

        if (openResult == "DL") {
            out = "";
        } else {
            if (showResult != "") {
                out = showResult;
            } else {
                var newOpenResult = openResult;
                if (_wtype == "FG" || _wtype == "T3G" || _wtype == "T1G" || _wtype == "RPF") {
                    newOpenResult = LS.get([_wtype + "_" + newOpenResult]);
                } if (_wtype == "MW" || _wtype == "MQ") {
                    var teamSide = openResult.substring(0, 1);
                    newOpenResult = (teamSide == "H") ? _team_h : _team_c;
                    newOpenResult += LS.get(["MQ_" + openResult]);

                } else if (_wtype == "PA" || _wtype == "RCD") {
                    newOpenResult = LS.get([newOpenResult]);

                } else if (_wtype.match("(RNC|RNB|RS[HC])[1-9A-U]")) {
                    var playType;
                    if (_wtype.match("RS[HC][A-O]")) {
                        playType = _wtype.substring(0, 2);
                    } else {
                        playType = _wtype.substring(0, 3);
                    }

                    if (openResult == "H") newOpenResult = _team_h;
                    else if (openResult == "C") newOpenResult = _team_c;
                    else if (openResult == "Y") newOpenResult = LS.get([playType + "_" + newOpenResult]);
                    else if (openResult == "N") newOpenResult = LS.get([playType + "_" + newOpenResult]);
                    else if (openResult == "P") newOpenResult = LS.get([playType + "_" + newOpenResult]);

                }
                else {
                    if (newOpenResult == "H" || newOpenResult == "Home") {
                        newOpenResult = _team_h;
                    } else if (newOpenResult == "C" || newOpenResult == "Away") {
                        newOpenResult = _team_c;
                    } else if (newOpenResult == "N" || newOpenResult == "No") {
                        newOpenResult = LS.get(["N"]);
                    } else if (newOpenResult == "Y" || newOpenResult == "Yes") {
                        newOpenResult = LS.get(["Y"]);
                    }

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