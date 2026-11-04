function acc_mem_edit(_win, _dom, paramObj) {
    var _self = this;
    var level = "mem";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS_code;
    var LS_account;
    var LS_report;
    var cookie;
    var getView;
    var config_set;
    var fastTemplate_a1;
    var subFrame = null;
    var _mc = new Object;
    var eventHandler = new Object;
    var param;
    var acc_div = new Array("div_acc_detail", "div_acc_comm", "div_acc_report", "div_acc_eventlog", "div_acc_creditlogs");
    var acc_title = new Object;
    acc_title["title"] = new Array("acc_detail", "acc_comm", "acc_report", "acc_eventlog", "acc_creditlogs");
    var ObjEditNow;
    _self.init = function() {
        param = paramObj;
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "account",
            "id": "MEM"
        });
        parentClass.dispatchEvent("chgPageName", {
            "pageType": "account",
            "uniqText": param.edit_username
        });
        _self.InitSetConfirmExit();
        var obj_ids = ",div_acc_detail,div_acc_comm,div_acc_report,div_acc_eventlog,div_acc_creditlogs,";
        obj_ids += "acc_detail,acc_comm,acc_report,acc_eventlog,acc_creditlogs,";
        obj_ids += "acc_edit_offset,title_scroll,";
        _mc = util.getObjAry(dom, obj_ids);
        for (var i = 0; i < acc_title["title"].length; i++)
            if (top.user_type != "1" && top.pri_type.indexOf("C") == -1 && acc_title["title"][i] == "acc_report")
                _mc[acc_title["title"][i]].style.display = "none";
            else if (acc_title["title"][i] == "acc_creditlogs" && param.pay_type != 1)
            _mc[acc_title["title"][i]].style.display = "none";
        else
            util.addEvent(_mc[acc_title["title"][i]], "click", _self.titleChg, {
                "target": _mc[acc_title["title"][i]],
                "type": "title"
            });
        _self.titleChg(null, {
            "target": _mc["acc_detail"],
            "type": "title"
        });
        util.addEvent(_mc["title_scroll"], "scroll", _self.roll, {
            "chk_obj": _mc["title_scroll"],
            "do_obj": _mc["acc_edit_offset"]
        });
        _self.addEventListener("goToPage", _self.indexGoToPageEvent);
        _self.addEventListener("bodyGoToPage", _self.indexBodyGoToPage);
        _self.addEventListener("showLoading", _self.indexShowLoading);
        _self.addEventListener("showFilter", _self.indexShowFilter);
        _self.addEventListener("showAccDetail", _self.indexShowAccDetail);
        _self.addEventListener("showReportDetail", _self.indexShowReportDetail);
        _self.addEventListener("showFadeOutMesg", _self.showFadeOutMesg)
    };
    _self.indexGoToPageEvent = function(parObj) {
        parentClass.dispatchEvent("goToPage", parObj)
    };
    _self.indexBodyGoToPage = function(parObj) {
        parentClass.dispatchEvent("bodyGoToPage", parObj)
    };
    _self.indexShowLoading = function(parObj) {
        parentClass.dispatchEvent("showLoading", parObj)
    };
    _self.indexShowFilter = function(parObj) {
        parentClass.dispatchEvent("showFilter", parObj)
    };
    _self.indexShowAccDetail = function(parObj) {
        parentClass.dispatchEvent("showAccDetail", parObj)
    };
    _self.indexShowReportDetail = function(parObj) {
        parentClass.dispatchEvent("showReportDetail", parObj)
    };
    _self.showFadeOutMesg = function(parObj) {
        parentClass.dispatchEvent("showFadeOutMesg", parObj)
    };
    _self.changeFilter = function(param) {
        subFrame.changeFilter(param)
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
        LS_report = parentClass.getThis("LS_report");
        cookie = parentClass.getThis("cookie");
        getView = parentClass.getThis("getView");
        config_set = parentClass.getThis("config_set");
        fastTemplate_a1 = parentClass.getThis("fastTemplate_a1")
    };
    _self.getParentThis = function(varible) {
        return parentClass.getThis(varible)
    };
    _self.titleChg = function(mouseEvent, obj) {
        if (obj["type"] == "title") {
            var target_id = obj.target.id;
            var div_body_show = dom.getElementById("body_show");
            if (div_body_show.classList.contains("bgf0f0f0"))
                div_body_show.classList.remove("bgf0f0f0");
            if (target_id == "acc_detail" || target_id == "acc_comm")
                div_body_show.classList.add("bgf0f0f0");
            parentClass.dispatchEvent("show_modal_step", {
                "show_step": false
            });
            parentClass.dispatchEvent("show_add_user_btn", {
                "show_": false
            });
            if (mouseEvent != null)
                parentClass.dispatchEvent("ConfirmExitAlert", {
                    Event: mouseEvent,
                    Param: obj,
                    func: _self.ShowAndHidden
                });
            else
                _self.ShowAndHidden(mouseEvent, obj)
        }
    };
    _self.ShowAndHidden = function(mouseEvent, titleChgObj) {
        var length = acc_title[titleChgObj["type"]].length;
        for (var i = 0; i < length; i++)
            _mc[acc_title[titleChgObj["type"]][i]].classList.remove("--on");
        titleChgObj["target"].classList.add("--on");
        for (var i = 0; i < acc_div.length; i++)
            _mc[acc_div[i]].style.display = "none";
        _mc["div_" + titleChgObj["target"].id].style.display = "";
        if (titleChgObj["target"].id == "acc_detail")
            _self.InitSetConfirmExit();
        _self.openDiv("div_" + titleChgObj["target"].id)
    };
    _self.openDiv = function(name) {
        parentClass.dispatchEvent("showLoading", {
            "showLoading": true
        });
        for (var i = 0; i < acc_div.length; i++)
            if (acc_div[i] != "div_acc_detail")
                _mc[acc_div[i]].innerHTML = "";
        var paramHash = new Object;
        paramHash["edit_id"] = param.edit_id;
        paramHash["up_id"] = param.up_id;
        paramHash["up_username"] = param.up_username;
        paramHash["edit_layer"] = level;
        paramHash["edit_type"] = param.edit_type;
        paramHash["edit_enable"] = param.edit_enable;
        paramHash["back_page"] = param.back_page;
        paramHash["pay_type"] = param.pay_type;
        var parObj = new Object;
        parObj["target"] = name;
        parObj["useDefineParent"] = "Y";
        parObj["postHash"] = paramHash;
        ObjEditNow = null;
        switch (name) {
            case "div_acc_detail":
                parObj["retChild"] = _self.getChild;
            case "div_acc_comm":
                parObj["page"] = "acc_" + level + "_" + name.split("_")[2];
                parObj["p"] = "acc_" + level + "_" + name.split("_")[2];
                parentClass.dispatchEvent("goToPage", parObj);
                break;
            case "div_acc_eventlog":
            case "div_acc_creditlogs":
            case "div_acc_onlineMem":
                parObj["page"] = "acc_" + name.split("_")[2];
                parObj["p"] = "acc_" + name.split("_")[2];
                parentClass.dispatchEvent("goToPage", parObj);
                break;
            case "div_acc_report":
                _self.checkReport(function() {
                    var classname = "acc_" + name.split("_")[2];
                    var accObj = eval("new " + classname + "(win,dom,paramHash);");
                    accObj.setParentclass(_self);
                    accObj.init()
                });
                break
        }
    };
    _self.loadSubFrame = function(param) {
        if (param["extendsClass"])
            subFrame = util.extendsClass(eval("new " + param["extendsClass"] + "(win,dom,param.postHash)"), eval(param.page), win, dom, param["postHash"]);
        else
            subFrame = eval("new " + param.page + "(win,dom,param.postHash);");
        subFrame.setParentclass(_self);
        subFrame.init()
    };
    _self.checkReport = function(retFun) {
        var str = "";
        str += top.param;
        str += "&p=check_report";
        str += "&date_start=" + _self.date_show(-1);
        str += "&date_end=" + _self.date_show(-1);
        str += "&result_type=Y";
        str += "&report_kind=A";
        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
        hr.setParentclass(_self);
        hr.addEventListener("onError", function() {});
        hr.addEventListener("LoadComplete", function(json) {
            var hash;
            try {
                hash = JSON.parse(json);
                if (util.chkErrorMsg(hash, LS_code))
                    return
            } catch (e) {
                util.err("[" + classname + "]", e);
                util.showErrorMsg("data error");
                return
            }
            if (hash["status"] == "200")
                retFun();
            else {
                util.showErrorMsg(hash["msg"]);
                parentClass.dispatchEvent("showLoading", {
                    "showLoading": false
                })
            }
        });
        hr.loadURL(top.url, "POST", str)
    };
    _self.date_show = function(daynum) {
        var today = new Date;
        var years = today.getFullYear();
        var months = today.getMonth() + 1;
        var days = today.getDate();
        var hours = today.getHours();
        var transday = _self.addDate(years, months - 1, days, hours, 0, daynum);
        var y = transday.getFullYear();
        var m = transday.getMonth() + 1;
        var d = transday.getDate();
        if (m < 10)
            m = "0" + m;
        if (d < 10)
            d = "0" + d;
        var result = y + "-" + m + "-" + d;
        return result
    };
    _self.addDate = function(dy, dmomth, dd, dh, dm, dadd) {
        var a = new Date(dy, dmomth, dd, dh, dm);
        a = a.valueOf();
        a = a + dadd * 1 * 60 * 60 * 1E3 * 24;
        a = new Date(a);
        return a
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname])
            eventHandler[eventname](param)
    };
    _self.InitSetConfirmExit = function() {
        var obj = new Object;
        obj["Alert"] = {
            "msg": LS_account.get("str_unsave"),
            "mode": "Y"
        };
        obj["ifNo"] = _self.exitConfirmNo;
        obj["isEdit"] = _self.isEdit;
        parentClass.dispatchEvent("SetConfirmExit", obj)
    };
    _self.exitConfirmNo = function() {
        parentClass.dispatchEvent("show_modal_step", {
            "show_step": true
        });
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "account",
            "id": "MEM"
        })
    };
    _self.getChild = function(childObj) {
        ObjEditNow = childObj
    };
    _self.isEdit = function() {
        if (ObjEditNow != null)
            return ObjEditNow.isEdit();
        return false
    };
    _self.roll = function(e, param) {
        if (param.chk_obj.scrollLeft == 0)
            param.do_obj.classList.remove("--scroll");
        else {
            param.do_obj.classList.add("--scroll");
            if (param.chk_obj.scrollLeft + param.chk_obj.offsetWidth == param.chk_obj.scrollWidth)
                param.do_obj.classList.add("--right_no_scroll");
            else
                param.do_obj.classList.remove("--right_no_scroll")
        }
    };
    _self.exitEvent = function() {
        parentClass.dispatchEvent("show_modal_step", {
            "show_step": false
        });
        parentClass.dispatchEvent("show_add_user_btn", {
            "show_": false
        });
        return true
    }
};
