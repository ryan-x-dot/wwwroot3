function quick_search(_win, _dom, param) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var eventHandler = new Object;
    var _mc = new Object;
    var nowSearchType = "ma";
    var nowSort = "username";
    var nowAorD = "up";
    var paramEnable = false;
    var nowPage = 1;
    var totalPage = 1;
    var nowScroll = 0;
    var search_layer = top.login_layer;
    var search_id = top.layer_id;
    var keepScrollTop = 56;
    var overScrollTop = 56;
    var classname = "quick_search";
    var searchTxt = "";
    var header_height = 0;
    var footer_height = 0;
    _self.init = function() {
        parentClass.dispatchEvent("chgPageName", {
            "pageName": "quicksearch"
        });
        util.echo("quick_search complete");
        _self.getViewAllEle();
        _self.addStaticListen();
        if (top.login_layer == "su") {
            _self.setHidden(_mc["search_ma"], true);
            _self.showAndHidden(_mc["search_ag"], "on");
            nowSearchType = "ag"
        } else if (top.login_layer == "ag") {
            _self.setHidden(_mc["search_ma"], true);
            _self.setHidden(_mc["search_ag"], true);
            _self.showAndHidden(_mc["search_mem"], "on");
            nowSearchType = "mem"
        }
        if (top.user_type != 1)
            _self.setHidden(_mc["search_subAcc"], true);
        if (param) {
            _self.chgSearchType("", param["search_type"]);
            search_layer = param["search_layer"];
            search_id = param["search_id"];
            nowSearchType = param["search_type"];
            if (typeof param["search_txt"] === "undefined") {
                paramEnable = param["enable"];
                _self.getSearchData()
            } else {
                _mc["search_txt"].value = param["search_txt"];
                _self.goSearch(param["e"])
            }
        }
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        });
        header_height = dom.getElementById("main_header").clientHeight;
        footer_height = dom.getElementById("footer_show").clientHeight;
        util.addEvent(dom.getElementById("ma_content"), "scroll", _self.scrollEvent, {
            "target": dom.getElementById("showBody")
        });
        topFrame.closeRightPanel()
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        topFrame = parentClass.getThis("topFrame")
    };
    _self.getViewAllEle = function() {
        _mc["search_txt"] = dom.getElementById("search_txt");
        _mc["search_btn"] = dom.getElementById("search_btn");
        _mc["clear_search_btn"] = dom.getElementById("clear_search_btn");
        _mc["search_ma"] = dom.getElementById("search_ma");
        _mc["search_ag"] = dom.getElementById("search_ag");
        _mc["search_mem"] = dom.getElementById("search_mem");
        _mc["search_subAcc"] = dom.getElementById("search_subAcc");
        _mc["hr_info1"] = dom.getElementById("hr_info1");
        _mc["search_Div"] = dom.getElementById("search_Div");
        _mc["no_data_view"] = dom.getElementById("no_data_view")
    };
    _self.parseData = function(data) {
        var getView = parentClass.getThis("getView");
        var view_w = getView().viewportwidth;
        var ret = "";
        if (view_w < 600)
            ret = "xmp_360";
        else if (view_w >= 600 && view_w < 768)
            ret = "xmp_360";
        else if (view_w >= 768 && view_w < 1024)
            ret = "xmp_1024";
        else if (view_w >= 1024)
            ret = "xmp_1024";
        var showmain = dom.getElementById("showmain");
        var xmp_header = dom.getElementById(ret + "_header").innerHTML;
        var xmp_foot = dom.getElementById(ret + "_foot").innerHTML;
        var outdata = xmp_header;
        _self.setHidden(_mc["no_data_view"], true);
        _self.setHidden(showmain, false);
        var parseDate = null;
        if (nowSearchType == "ma")
            parseDate = data["super_agents_id_data"];
        else if (nowSearchType == "ag")
            parseDate = data["agents_id_data"];
        else if (nowSearchType == "mem")
            parseDate = data["members_id_data"];
        else if (nowSearchType == "subAcc")
            parseDate = data["accData"];
        if (parseDate != null && parseDate.length > 0)
            for (var i = 0; i < parseDate.length; i++) {
                var tmpdata = parseDate[i];
                var xmp_contant = dom.getElementById(ret + "_contant").innerHTML;
                xmp_contant = xmp_contant.replace("*USERNAME*", tmpdata["username"]);
                xmp_contant = xmp_contant.replace("*USERTYPE*", LS.get("layer_type_name_" + tmpdata["usertype"]));
                xmp_contant = xmp_contant.replace("*ALIAS*", tmpdata["alias"]);
                if (tmpdata["passwd_safe"] == "aaaaaa")
                    tmpdata["passwd_safe"] = "";
                xmp_contant = xmp_contant.replace("*PASSWD_SAFE*", tmpdata["passwd_safe"]);
                xmp_contant = xmp_contant.replace("*ID*", tmpdata["id"]);
                var status = _self.statusTransFor(tmpdata);
                if (nowSearchType == "subAcc")
                    xmp_contant = xmp_contant.replace("*STAUAS*", "");
                else
                    xmp_contant = xmp_contant.replace("*STAUAS*", LS.get("enable_str_" + status));
                xmp_contant = xmp_contant.replace("*ADDDATE*", tmpdata["adddate"]);
                var upAgentsName = "-";
                var upMasterAgentsName = "-";
                try {
                    if (nowSearchType == "mem") {
                        upAgentsName = data["agents_id_data"][tmpdata["agents_id"]]["username"];
                        var upid = data["agents_id_data"][tmpdata["agents_id"]]["super_agents_id"];
                        if (upid)
                            upMasterAgentsName = data["super_agents_id_data"][upid]["username"]
                    } else if (nowSearchType == "ag")
                        upMasterAgentsName = data["super_agents_id_data"][tmpdata["super_agents_id"]]["username"]
                } catch (e) {}
                xmp_contant = xmp_contant.replace("*UPAGENTS*", upAgentsName);
                xmp_contant = xmp_contant.replace("*UPSUPERAGENTS*", upMasterAgentsName);
                outdata += xmp_contant
            }
        else {
            _self.setHidden(showmain, true);
            _self.setHidden(_mc["no_data_view"], false)
        }
        outdata += xmp_foot;
        nowPage = data["page"];
        totalPage = data["totalpage"];
        showmain.innerHTML = outdata;
        if (parseDate != null)
            _self.addDynamicTableListen(parseDate);
        if (ret == "xmp_1024") {
            _self.addDynamicListen();
            _self.showAndHidden(_mc[nowSort + "_sort"], " sort_" + nowAorD)
        }
        keepScrollTop = dom.getElementById("re_functionG").offsetHeight + header_height;
        overScrollTop = dom.getElementById("re_functionG").offsetHeight + header_height
    };
    _self.parseChildData = function(data) {
        var getView = parentClass.getThis("getView");
        var view_w = getView().viewportwidth;
        var ret = "";
        if (view_w < 600)
            ret = "xmp_360";
        else if (view_w >= 600 && view_w < 768)
            ret = "xmp_360";
        else if (view_w >= 768 && view_w < 1024)
            ret = "xmp_1024";
        else if (view_w >= 1024)
            ret = "xmp_1024";
        var tbody_div = dom.getElementById("tbody_div");
        if (nowSearchType == "ma")
            parseDate = data["super_agents_id_data"];
        else if (nowSearchType == "ag")
            parseDate = data["agents_id_data"];
        else if (nowSearchType == "mem")
            parseDate = data["members_id_data"];
        else if (nowSearchType == "subAcc")
            parseDate = data["accData"];
        var fragment = document.createDocumentFragment();
        if (parseDate != null) {
            for (var i = 0; i < parseDate.length; i++) {
                var tr = document.createElement("tr");
                var tmpdata = parseDate[i];
                var xmp_contant = dom.getElementById(ret + "_contant").innerHTML;
                xmp_contant = xmp_contant.replace("*USERNAME*", tmpdata["username"]);
                xmp_contant = xmp_contant.replace("*USERTYPE*", LS.get("layer_type_name_" + tmpdata["usertype"]));
                xmp_contant = xmp_contant.replace("*ALIAS*", tmpdata["alias"]);
                if (tmpdata["passwd_safe"] == "aaaaaa")
                    tmpdata["passwd_safe"] = "";
                xmp_contant = xmp_contant.replace("*PASSWD_SAFE*", tmpdata["passwd_safe"]);
                xmp_contant = xmp_contant.replace("*ID*", tmpdata["id"]);
                var status = _self.statusTransFor(tmpdata);
                if (nowSearchType == "subAcc")
                    xmp_contant = xmp_contant.replace("*STAUAS*", "");
                else
                    xmp_contant = xmp_contant.replace("*STAUAS*", LS.get("enable_str_" + status));
                xmp_contant = xmp_contant.replace("*ADDDATE*", tmpdata["adddate"]);
                var upAgentsName = "-";
                var upMasterAgentsName = "-";
                try {
                    if (nowSearchType == "mem") {
                        upAgentsName = data["agents_id_data"][tmpdata["agents_id"]]["username"];
                        var upid = data["agents_id_data"][tmpdata["agents_id"]]["super_agents_id"];
                        if (upid)
                            upMasterAgentsName = data["super_agents_id_data"][upid]["username"]
                    } else if (nowSearchType == "ag")
                        upMasterAgentsName = data["super_agents_id_data"][tmpdata["super_agents_id"]]["username"]
                } catch (e) {}
                xmp_contant = xmp_contant.replace("*UPAGENTS*", upAgentsName);
                xmp_contant = xmp_contant.replace("*UPSUPERAGENTS*", upMasterAgentsName);
                tr.innerHTML = xmp_contant;
                tr.setAttribute("class", "re_table_body_auto");
                if (ret == "xmp_360")
                    tr.setAttribute("id", "link_" + tmpdata["id"]);
                fragment.appendChild(tr)
            }
            tbody_div.appendChild(fragment);
            _self.addDynamicTableListen(parseDate)
        }
    };
    _self.addStaticListen = function() {
        util.addEvent(_mc["search_btn"], "click", _self.goSearch, "");
        util.addEvent(_mc["clear_search_btn"], "click", _self.clearSearch, "");
        util.addEvent(_mc["search_ma"], "click", _self.chgSearchType, "ma");
        util.addEvent(_mc["search_ag"], "click", _self.chgSearchType, "ag");
        util.addEvent(_mc["search_mem"], "click", _self.chgSearchType, "mem");
        util.addEvent(_mc["search_subAcc"], "click", _self.chgSearchType, "subAcc");
        util.addEvent(_mc["search_txt"], "focus", _self.onFocusEventHandler, {
            "target": _mc["search_Div"]
        });
        util.addEvent(_mc["search_txt"], "blur", _self.onBlurEventHandler, {
            "target": _mc["search_Div"]
        });
        util.ChkKeyUser(_mc["search_txt"]);
        util.addEvent(_mc["search_txt"], "keypress", _self.Press_Search, "", false)
    };
    _self.addDynamicListen = function() {
        _mc["username_sort"] = dom.getElementById("username_sort");
        _mc["alias_sort"] = dom.getElementById("alias_sort");
        _mc["status_sort"] = dom.getElementById("status_sort");
        _mc["adddate_sort"] = dom.getElementById("adddate_sort");
        util.addEvent(_mc["username_sort"], "click", _self.chgSort, "username");
        util.addEvent(_mc["alias_sort"], "click", _self.chgSort, "alias");
        util.addEvent(_mc["status_sort"], "click", _self.chgSort, "status");
        util.addEvent(_mc["adddate_sort"], "click", _self.chgSort, "adddate")
    };
    _self.addDynamicTableListen = function(data) {
        if (!(top.user_type != "1" && top.pri_type.indexOf("B1") == -1))
            for (var i = 0; i < data.length; i++) {
                _mc["link_" + data[i]["id"]] = dom.getElementById("link_" + data[i]["id"]);
                util.addEvent(_mc["link_" + data[i]["id"]], "click", _self.gotoPage, data[i])
            }
    };
    _self.gotoPage = function(e, param) {
        var div = e.target;
        var levelObj = {
            "corprator": "co",
            "super_agents": "su",
            "agents": "ag",
            "members": "mem"
        };
        var paramHash = new Object;
        paramHash["edit_id"] = param["id"];
        paramHash["edit_username"] = param["username"];
        paramHash["edit_enable"] = getEnable(param["enable"], param["enable_pri"]);
        paramHash["back_page"] = classname;
        paramHash["pay_type"] = param["pay_type"];
        if (param["usertype"] == "super_agents") {
            paramHash["up_id"] = param["corprator_id"];
            paramHash["user_id"] = param["user_id"];
            paramHash["edit_type"] = param["edit_type"]
        } else if (param["usertype"] == "agents") {
            paramHash["up_id"] = param["super_agents_id"];
            paramHash["user_id"] = param["user_id"];
            paramHash["edit_type"] = param["edit_type"]
        } else if (param["usertype"] == "members") {
            paramHash["up_id"] = param["agents_id"];
            paramHash["edit_type"] = "1"
        }
        var obj = new Object;
        if (nowSearchType != "subAcc")
            obj["page"] = "acc_" + levelObj[param["usertype"]] + "_edit";
        else {
            paramHash["id"] = param["user_id"];
            paramHash["pri"] = param["pri"];
            paramHash["alias"] = param["alias"];
            paramHash["adddate"] = param["adddate"];
            paramHash["username"] = param["username"];
            paramHash["user_type"] = param["edit_type"];
            paramHash["passwd_safe"] = param["passwd_safe"];
            obj["page"] = "acc_sub_edit"
        }
        obj["postHash"] = paramHash;
        parentClass.dispatchEvent("bodyGoToPage", obj)
    };
    _self.chgSort = function(e, param) {
        var divClass = e.target.className;
        nowSort = param;
        if (divClass.indexOf("sort_up") != -1)
            nowAorD = "down";
        else
            nowAorD = "up";
        if (divClass.indexOf("sort_up") == -1 && divClass.indexOf("sort_down") == -1)
            _self.showAndHidden(e.target, " sort_up");
        else {
            _self.showAndHidden(e.target, " sort_up");
            _self.showAndHidden(e.target, " sort_down")
        }
        _self.goSearch()
    };
    _self.Press_Search = function(e, param) {
        var keyCode = util.getKeyCode(e);
        if (keyCode == 13)
            _self.goSearch(e)
    };
    _self.goSearch = function(e, param) {
        _self.onFocusEventHandler(null, {
            "target": _mc["search_Div"]
        });
        if (e != null) {
            if (_mc["search_txt"].value.length < 3) {
                _self.show_err_msg(e, LS.get("atleast3"));
                return
            }
            if (!util.checkFormat(_mc["search_txt"].value, 0)) {
                _self.show_err_msg(e, LS.get("username_err"));
                return
            }
            searchTxt = _mc["search_txt"].value;
            search_layer = top.login_layer;
            search_id = top.layer_id;
            paramEnable = false
        }
        nowPage = 1;
        _self.getSearchData()
    };
    _self.getSearchData = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&search_layer=" + search_layer;
        urlParams += "&layer_id=" + search_id;
        urlParams += "&sortName=" + nowSort;
        urlParams += "&sortType=" + nowAorD;
        urlParams += "&page=" + nowPage;
        if (paramEnable)
            urlParams += "&enable=" + paramEnable;
        urlParams = "p=get_quick_search&ver=" + top.ver + "&" + urlParams + "&searchType=" + nowSearchType + "&searchName=" + searchTxt;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.connectComplete = function(data) {
        try {
            var arr_data = JSON.parse(data);
            if (arr_data["page"] >= "2")
                _self.parseChildData(arr_data);
            else
                _self.parseData(arr_data)
        } catch (e) {
            util.echo(e)
        }
    };
    _self.clearSearch = function(e, param) {
        _mc["search_txt"].value = ""
    };
    _self.chgSearchType = function(e, param) {
        _self.showAndHidden(dom.getElementById("search_" + nowSearchType), "on");
        _self.showAndHidden(dom.getElementById("search_" + param), "on");
        nowSearchType = param;
        var showmain = dom.getElementById("showmain");
        showmain.innerHTML = ""
    };
    _self.onFocusEventHandler = function(e, param) {
        var classname = param.target.className;
        var newClassname = "";
        newClassname = classname.replace(" err_input", "");
        _self.setObjectClass(param.target, newClassname);
        _self.setHidden(_mc["hr_info1"], true);
        _self.showAndHidden(param.target, " focus_input")
    };
    _self.onBlurEventHandler = function(e, param) {
        _self.showAndHidden(param.target, " focus_input")
    };
    _self.showAndHidden = function(titleObj, cName) {
        var classname = titleObj.className;
        var newClassname = "";
        if (classname.search(cName) == -1)
            newClassname = classname + cName;
        else
            newClassname = classname.replace(cName, "");
        _self.setObjectClass(titleObj, newClassname)
    };
    _self.setObjectClass = function(targetObj, classStr) {
        if (targetObj.className != undefined)
            targetObj.className = classStr;
        else
            targetObj.setAttribute("class", classStr)
    };
    _self.setHidden = function(el, oks) {
        if (el == null)
            return;
        el.style.display = oks ? "none" : ""
    };
    _self.statusTransFor = function(data) {
        if (data["enable"] != "N" && data["enable_pri"] == "N")
            return "Suspended";
        else if (data["enable"] == "Y" && data["enable_pri"] == "Y")
            return "Active";
        else if (data["enable"] == "S" && data["enable_pri"] == "Y")
            return "ViewOnly";
        else if (data["enable"] == "N")
            return "Inactive"
    };
    _self.onError = function() {
        util.echo("onError")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.exitEvent = function() {
        return true
    };
    _self.backPage = function(e, param) {
        parentClass.dispatchEvent("backPage", {
            "retFun": _self.backPageComplete
        })
    };
    _self.backPageComplete = function() {};
    _self.changePage = function(e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.changePageComplete = function() {};
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname])
            eventHandler[eventname](param)
    };
    _self.scrollEvent = function(e, param) {
        var newScrollTop = dom.getElementById("ma_content").scrollTop;
        var clinH = dom.getElementById("ma_content").clientHeight;
        var crollHeight = dom.getElementById("ma_content").scrollHeight;
        if (newScrollTop + clinH >= crollHeight - crollHeight / 6 - footer_height && newScrollTop > nowScroll)
            if (nowPage < totalPage) {
                nowPage++;
                _self.getSearchData()
            }
        nowScroll = newScrollTop;
        newScrollTop = e.target.scrollTop;
        if (newScrollTop >= overScrollTop) {
            if (!param.target.issticky) {
                util.classFunc(param.target, "report_fixed");
                overScrollTop = e.target.scrollTop;
                param.target.issticky = true
            }
        } else if (param.target.issticky) {
            util.classFunc(param.target, "report_fixed", "remove");
            overScrollTop = keepScrollTop;
            param.target.issticky = false
        }
    };

    function getEnable(enable, enable_pri) {
        var ret = "";
        if (enable != "N" && enable_pri == "N")
            ret = "F";
        else if (enable == "Y" && enable_pri == "Y")
            ret = "Y";
        else if (enable == "S" && enable_pri == "Y")
            ret = "S";
        else if (enable == "N")
            ret = "N";
        return ret
    }
    _self.show_err_msg = function(e, show_msg) {
        _mc["hr_info1"].innerHTML = show_msg;
        _self.setHidden(_mc["hr_info1"], false);
        _self.showAndHidden(_mc["search_Div"], " err_input")
    }
};
