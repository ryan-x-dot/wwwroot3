function acc_mem_list(_win, _dom, param) {
    var _self = this;
    var level = "mem";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var nullchar = "&nbsp;";
    var user_mlimit = -1;
    var magager_count = -1;
    var sort_type = "asc";
    var sort_name = "username";
    var sortObj = new Object;
    var _mc = new Object;
    _mc["credits"] = new Object;
    _mc["status"] = new Object;
    var create_btn_first = false;
    var credit_old;
    var account_status;
    var _nowEdit = "";
    var paramObj = param;
    var isParsed = false;
    var ClassName = "acc_mem_list";
    var overScrollTop = 56;
    var dataHash = null;
    var lazy_sw = null;
    var lazy_count = null;
    var lazy_page = null;
    var lazy_total_page = null;
    var lazy_loading = false;
    var scroll_e = null;
    var up_userData = Array();
    var cancel_reload = false;
    var header_height = 0;
    var menu_ul_height = 0;
    var total_amount_height = 0;
    var footer_height = 0;
    var pb_height = 0;
    var ctlObj = new Array;
    _self.init = function() {
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "account",
            "id": "MEM"
        });
        dom.getElementById("body_show").classList.remove("body_pb");
        _mc["upper_pay_type"] = dom.getElementById("upper_pay_type");
        _mc["upper_pay_type_768"] = dom.getElementById("upper_pay_type_768");
        _mc["getHttp"] = new HttpRequest;
        _mc["getHttp"].addEventListener("LoadComplete", _self.doLoadComplete);
        try {
            account_status = new win.account_status(win, dom);
            account_status.setParentclass(_self);
            account_status.setTopParent(parentClass);
            var up_enable = "Y";
            if (typeof paramObj != "undefined" && Object.keys(paramObj).length > 0) {
                account_status.setParam(paramObj);
                up_enable = typeof paramObj.up_enable != "undefined" ? paramObj.up_enable : "Y";
                var tmp_param = Array();
                tmp_param["id"] = paramObj.up_id;
                if (typeof paramObj.up_username != "undefined")
                    tmp_param["username"] = paramObj.up_username;
                if (typeof paramObj.up_enable != "undefined")
                    tmp_param["enable"] = paramObj.up_enable;
                if (typeof paramObj.pay_type != "undefined")
                    tmp_param["pay_type"] = paramObj.pay_type;
                up_userData[paramObj.up_id] = tmp_param
            }
            account_status.init();
            account_status.setEnable(up_enable)
        } catch (e) {
            util.err("[alert_msg]", e)
        }
        if (top.login_layer == "ag" && top.user_type == 1 && top.pay_type == "0" && top.retrieve_sw == "Y" && top.user_enable == "Y") {
            var retrieve_link = dom.getElementById("retrieve_link");
            util.addEvent(retrieve_link, "click", _self.goToRetrieve);
            retrieve_link.style.display = ""
        }
        header_height = dom.getElementById("main_header").clientHeight;
        menu_ul_height = dom.getElementById("menu_ul").clientHeight;
        total_amount_height = dom.getElementById("div_total_amount").clientHeight;
        footer_height = dom.getElementById("footer_show").clientHeight;
        _self.initLazy();
        _self.loadData();
        _self.initMenu();
        util.echo("get_acc_" + level + "_list finish")
    };
    _self.initMenu = function() {
        var hash = new Object;
        hash["view_layer"] = level;
        var txt = JSON.stringify(hash);
        parentClass.dispatchEvent("chgPageName", {
            "pageType": "account",
            "url_hash": txt
        })
    };
    _self.loadData = function() {
        cancel_reload = false;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.dataCompele);
        getHTML.loadURL(top.url, "POST", _self.getParam())
    };
    _self.dataCompele = function(data) {
        dataHash = data;
        var arr_data = JSON.parse(data);
        _self.reSetLazy(arr_data["account"]);
        _self.parseData(data);
        var _history_num = win._history.length;
        if (_history_num > 1) {
            var tmp_up_id = account_status.getUpperLayerId_sql();
            if (up_userData.length > 0)
                win._history[_history_num - 1].state.postHash = {
                    "up_id": tmp_up_id,
                    "up_username": up_userData[tmp_up_id]["username"],
                    "up_enable": up_userData[tmp_up_id]["enable"],
                    "pay_type": up_userData[tmp_up_id]["pay_type"]
                }
        }
        pb_height = util.countPaddingPx(dom.getElementById("scroll_div"))
    };
    _self.getParam = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&user_name=" + account_status.getSearchName();
        urlParams += "&enable=" + account_status.getEnable();
        urlParams += "&ltype=" + account_status.getltype();
        urlParams += "&sort_type=" + sort_type;
        urlParams += "&sort_name=" + sort_name;
        urlParams += "&langx=" + top.langx;
        var tmp_up_id = account_status.getUpperLayerId_sql();
        urlParams += "&up_id=" + tmp_up_id;
        if (up_userData.length > 0)
            urlParams += "&up_pay_type=" + up_userData[tmp_up_id]["pay_type"];
        urlParams = "p=get_acc_" + level + "_list&ver=" + top.ver + "&" + urlParams;
        return urlParams
    };
    _self.reloadEventHandler = function() {
        isParsed = false;
        if (_nowEdit != "")
            _self.closeDivEvent();
        _self.loadData()
    };
    _self.parseData = function(data) {
        try {
            var arr_data = JSON.parse(data);
            if (arr_data.sub_user_data != null) {
                magager_count = arr_data.sub_user_data.magager_count;
                user_mlimit = arr_data.sub_user_data.user_mlimit
            }
            var bodyTemp = "";
            var outdata = "";
            var div_show = dom.getElementById("div_show");
            var xmp_header = dom.getElementById("xmp_header").innerHTML;
            var xmp_contant = dom.getElementById("xmp_contant").innerHTML;
            var xmp_foot = dom.getElementById("xmp_foot").innerHTML;
            dom.getElementById("total_amount").innerHTML = arr_data["account"].length;
            if (arr_data["account"].length > 0) {
                var s = 0;
                var e = 0;
                if (lazy_sw) {
                    s = (lazy_page - 1) * lazy_count;
                    e = lazy_page == lazy_total_page ? arr_data["account"].length : lazy_page * lazy_count
                } else {
                    s = 0;
                    e = arr_data["account"].length
                }
                for (var i = s; i < e; i++) {
                    var contanttmp = xmp_contant;
                    var obj = arr_data["account"][i];
                    var passwd_safe = obj["passwd_safe"];
                    var trans_dis = "";
                    if (obj["currency_code"] == "RMB")
                        trans_dis = "none";
                    var status_class = "active";
                    if (obj["enable"] == "N")
                        status_class = "inactive";
                    else if (obj["enable"] == "S")
                        status_class = "viewonly";
                    else if (obj["enable"] == "F")
                        status_class = "suspend";
                    if (util.showTxt(passwd_safe) == "")
                        passwd_saf = nullchar;
                    contanttmp = contanttmp.replace(/\*ID\*/g, util.showTxt(obj["id"]));
                    contanttmp = contanttmp.replace(/\*STATUS\*/g, status_class);
                    contanttmp = contanttmp.replace(/\*USERNAME\*/g, util.showTxt(obj["username"]));
                    contanttmp = contanttmp.replace(/\*ALIAS\*/g, util.showTxt(obj["alias"]));
                    contanttmp = contanttmp.replace(/\*PASSWD_SAFE\*/g, util.showTxt(passwd_safe));
                    contanttmp = contanttmp.replace(/\*MAXCREDIT\*/g, util.mprintf(util.showTxt(obj["maxcredit"]) * 1, 0, 2, false, true));
                    contanttmp = contanttmp.replace(/\*CURRENCY\*/g, util.showTxt(obj["currency"]));
                    contanttmp = contanttmp.replace(/\*TRANS_DIS\*/g, trans_dis);
                    contanttmp = contanttmp.replace(/\*ADDDATE\*/g, util.showTxt(obj["adddate"].replace(/-/g, "/")));
                    bodyTemp += contanttmp
                }
                if (lazy_page == 1) {
                    outdata = xmp_header + bodyTemp + xmp_foot;
                    div_show.innerHTML = outdata;
                    parentClass.dispatchEvent("showLoading", {
                        "showLoading": false
                    });
                    dom.getElementById("ma_content").scrollTop = dom.getElementById("ma_content").scrollTop + 1;
                    dom.getElementById("ma_content").scrollTop = dom.getElementById("ma_content").scrollTop - 1
                } else
                    _self.div_append(div_show.children[1], bodyTemp)
            } else {
                bodyTemp = dom.getElementById("xmp_no_data").innerHTML;
                outdata = xmp_header + bodyTemp;
                div_show.innerHTML = outdata;
                parentClass.dispatchEvent("showLoading", {
                    "showLoading": false
                })
            }
            _self.initEvent(arr_data, div_show);
            _self.setLzayLoadingVisible(false);
            util.addEvent(dom.getElementById("ma_content"), "scroll", _self.scrollEvent, div_show.children[0]);
            _self.scroll_ver_event(scroll_e, dom.getElementById("body_show"));
            var old_exists = true;
            if (top.login_layer != "ag" && !isParsed) {
                old_exists = account_status.setUpperLayer(arr_data["uplayer_user"]);
                up_userData = Array();
                for (var key in arr_data["uplayer_user"])
                    up_userData[arr_data["uplayer_user"][key]["id"]] = arr_data["uplayer_user"][key]
            } else if (Object.keys(up_userData).length == 0) {
                var tmp_param = Array();
                tmp_param["id"] = arr_data.up_id;
                tmp_param["pay_type"] = arr_data.up_pay_type;
                up_userData[arr_data.up_id] = tmp_param;
                account_status.up_data = tmp_param
            } else if (Object.keys(up_userData).length == 1)
                account_status.up_data = up_userData[Object.keys(up_userData)[0]];
            if (up_userData.length > 0) {
                var str_show_paytype = LS.get("pay_type_" + up_userData[account_status.getUpperLayerId_sql()]["pay_type"]);
                _mc["upper_pay_type"].innerHTML = "(" + str_show_paytype + ")";
                _mc["upper_pay_type_768"].innerHTML = "(" + str_show_paytype + ")"
            }
            isParsed = true;
            if (!old_exists)
                _self.loadData();
            dom.getElementById("body_show").classList.add("body_pb")
        } catch (e) {
            util.echo(e)
        }
    };
    _self.div_append = function(_Obj, str_append) {
        var divObj = dom.createElement("div");
        divObj.innerHTML = str_append;
        var dolength = divObj.children.length;
        for (var i = 0; i < dolength; i++) {
            var retObj = divObj.children[0];
            _Obj.appendChild(retObj)
        }
    };
    _self.initEvent = function(ArrObj, div_show) {
        var s = 0;
        var e = 0;
        if (lazy_sw) {
            s = (lazy_page - 1) * lazy_count;
            e = lazy_page == lazy_total_page ? ArrObj["account"].length : lazy_page * lazy_count
        } else {
            s = 0;
            e = ArrObj.length
        }
        for (var i = s; i < e; i++) {
            var obj = util.clone(ArrObj["account"][i]);
            var div = dom.getElementById("div_" + obj["id"]);
            var obj_ids = ",span_credit,span_enable,btn_edit,btn_unlock,btn_user,change_credits_box,change_status_box,dropdown_id,credit_arrow,";
            var _ary = util.getObjAry(div, obj_ids);
            if (obj["longerr"] == "Y") {
                _ary["btn_unlock"].style.display = "";
                util.addEvent(_ary["btn_unlock"], "click", _self.unlockEvent, obj)
            } else {
                _ary["btn_unlock"].style.display = "none";
                util.removeEvent(_ary["btn_unlock"], "click")
            }
            var ubj = util.clone(ArrObj["account"][i]);
            var obj_ids = ",sel_view,sel_list,sel_text,span_enable,sel_768,dropdown_id,";
            var _sstatus = util.getObjAry(_ary["change_status_box"], obj_ids);
            _sstatus["change_status_box"] = _ary["change_status_box"];
            ubj.saveType = "status";
            _sstatus["account"] = ubj;
            if (ubj.enable != "Y") {
                var li_arr = _sstatus["sel_list"].getElementsByTagName("li");
                for (var _i = 0, end = li_arr.length; _i < end; _i++)
                    if (!(li_arr[_i].id == "Y" || li_arr[_i].id == ubj.enable))
                        li_arr[_i].style.display = "none"
            }
            _sstatus["Select"] = new win.ClassSelect(win, dom);
            _sstatus["Select"].setParentclass(_self);
            _sstatus["Select"].setSelCss("md_status_item", "", false);
            _sstatus["Select"].init(_sstatus["sel_text"], _sstatus["sel_list"], _sstatus["change_status_box"], _sstatus["dropdown_id"]);
            _sstatus["Select"].setSelected(ubj["enable"]);
            if (_sstatus["sel_768"] != null)
                _sstatus["Select"].creatSelOpt(_sstatus["sel_768"]);
            if (!(top.user_type != "1" && top.pri_type.indexOf("B1") == -1) && top.user_enable == "Y") {
                _sstatus["Select"].addEvent("ONOPEN", _self.show_status_box, ubj);
                _sstatus["Select"].addEvent("ONCLOSE", _self.close_status_box, ubj);
                _sstatus["Select"].addEvent("ONCHANGE", _self.saveEvent, ubj);
                _mc["status"][ubj.id] = _sstatus
            } else {
                _sstatus["Select"].setDisabled(true);
                util.classFunc(_sstatus["change_status_box"], "--view_only")
            }
            if (!(top.user_type != "1" && top.pri_type.indexOf("B1") == -1))
                util.addEvent(_ary["btn_edit"], "click", _self.editEventPrev, obj);
            if (!(top.user_type != "1" && top.pri_type.indexOf("B2") == -1)) {
                var ubj = util.clone(ArrObj["account"][i]);
                var obj_ids = ",view_credits_box,btn_close,save_btn,current_txt,new_credits" + ubj.id + ",trans_credit,error_note,error_txt,span_credit,";
                var _ccredit = util.getObjAry(_ary["change_credits_box"], obj_ids);
                _ccredit["new_credits"] = _ccredit["new_credits" + ubj.id];
                _ccredit["change_credits_box"] = _ary["change_credits_box"];
                ubj.saveType = "credits";
                ubj._ccredit = _ccredit;
                _ccredit["account"] = ubj;
                ctlObj["credit"] = new Object;
                ctlObj["credit"].box = _ccredit["error_note"];
                ctlObj["credit"].msg = _ccredit["error_txt"];
                ctlObj["credit"].input = _ccredit["new_credits"];
                _mc["credits"][ubj.id] = _ccredit;
                util.addEvent(_ccredit["btn_close"], "click", _self.closeDivEvent, ubj);
                util.addEvent(_ccredit["save_btn"], "click", _self.saveEvent, ubj);
                util.ChkKeyCash(_ccredit["new_credits"], {
                    initShow: _self.initCreditShow,
                    onErr: _self.ChkCreditErr,
                    onSuc: _self.show_credits,
                    param: _ccredit
                });
                util.addEvent(_ccredit["new_credits"], "keydown", _self.keep_credit, ctlObj["credit"], false);
                util.addEvent(_ccredit["new_credits"], "focus", _self.inputboxFocusEvent, ctlObj["credit"], false);
                util.addEvent(_ccredit["new_credits"], "blur", _self.inputboxBlurEvent, ctlObj["credit"], false);
                util.addEvent(_ary["span_credit"], "click", _self.showCreditEvent, _ccredit)
            } else
                util.classFunc(_ary["change_credits_box"], "--view_only");
            _ary["span_enable"].enable = obj.enable;
            if (!(top.user_type != "1" && top.pri_type.indexOf("C") == -1))
                util.addEvent(_ary["btn_user"], "click", _self.listEvent, {
                    "acc_id": obj["id"],
                    "acc_username": obj["username"],
                    "acc_alias": obj["alias"],
                    "pay_type": obj["pay_type"]
                });
            _self.chkUserEnable(_ary["span_credit"], _ary["span_enable"], _ary["btn_edit"], _ary["btn_unlock"]);
            if (top.user_type != "1" && top.pri_type.indexOf("B1") == -1)
                _ary["btn_edit"].style.display = "none"
        }
        var objids = ",title_username,title_maxcredit,title_adddate,";
        var ary = util.getObjAry(div_show, objids);
        if (ArrObj["account"].length > 0) {
            for (key in ary) {
                var _type = "empty";
                if (sortObj[key] == null) {
                    if (key == "title_" + sort_name)
                        _type = sort_type
                } else
                    _type = sortObj[key].type;
                sortObj[key] = ary[key];
                sortObj[key].name = key.split("_")[1];
                sortObj[key].type = _type;
                var sty = _self.getSortClass(sortObj[key].type);
                util.setObjectClass(sortObj[key], sty);
                util.addEvent(sortObj[key], "click", _self.sortEvent, sortObj[key])
            }
            var choseObj = sortObj["title_" + sort_name];
            var choseSty = _self.getSortClass(choseObj.type);
            util.setObjectClass(choseObj, choseSty)
        }
        overScrollTop = dom.getElementById("ph_search_class").offsetHeight + header_height + menu_ul_height + total_amount_height
    };
    _self.sortEvent = function(mouseEvent, targetObj) {
        var _type = targetObj.type;
        for (key in sortObj)
            sortObj[key].type = "empty";
        targetObj.type = _self.transSortStatus(_type);
        sort_type = targetObj.type;
        sort_name = targetObj.name;
        _self.loadData()
    };
    _self.transSortStatus = function(_status) {
        var hash = new Object;
        hash["empty"] = "asc";
        hash["asc"] = "desc";
        hash["desc"] = "asc";
        return hash[_status]
    };
    _self.chkUserEnable = function(span_credit, span_enable, btn_edit, btn_unlock) {
        var showType = "";
        if (top.user_enable == "Y")
            showType = "";
        else {
            showType = "none";
            util.removeEvent(span_credit, "click");
            util.removeEvent(span_enable, "click");
            util.removeEvent(btn_edit, "click");
            util.removeEvent(btn_unlock, "click")
        }
        span_credit.style.display = showType;
        span_enable.style.display = showType;
        btn_edit.style.display = showType;
        btn_unlock.style.display = btn_unlock.style.display == "" ? showType : btn_unlock.style.display;
        if (top.user_enable == "S") {
            span_credit.style.display = "";
            span_credit.style.cursor = "default"
        }
    };
    _self.getSortClass = function(_status) {
        var hash = new Object;
        hash["empty"] = "md_sort_label";
        hash["asc"] = "md_sort_label sort_down";
        hash["desc"] = "md_sort_label sort_up";
        return hash[_status]
    };
    _self.showCreditEvent = function(mouseEvent, _ccredit) {
        var account = _ccredit.account;
        _nowEdit = account;
        credit_old = account.maxcredit;
        _ccredit["new_credits"].value = util.mprintf(account.maxcredit * 1, 0, 2, false, false);
        _ccredit["current_txt"].innerHTML = util.mprintf(account.avaliable_credit * 1, 0, 2, false, true);
        _ccredit["trans_credit"].value = util.mprintf(account.maxcredit * (account.currency_value * 1), 0, 2, false, true);
        util.classFunc(_ccredit["error_note"], "--err", "remove");
        var param = {};
        param._focus = _ccredit["view_credits_box"];
        param._setView = _ccredit["span_credit"];
        param._viewClass = "show";
        util.showInfEvent(mouseEvent, {
            "icon": mouseEvent.target,
            "param": param
        })
    };
    _self.closeDivEvent = function() {
        for (key in _mc["credits"]) {
            if (_mc["credits"][key] != null)
                util.classFunc(_mc["credits"][key]["span_credit"], "show", "remove");
            _mc["credits"][key]["trans_credit"].value = util.mprintf(0, 0, 2, false, true)
        }
        for (key in _mc["status"]) {
            if (_mc["status"][key] != null)
                util.classFunc(_mc["status"][key]["dropdown_id"], "on", "remove");
            util.classFunc(_mc["status"][key]["sel_view"], "on", "remove")
        }
        credit_old = null;
        _nowEdit = "";
        if (cancel_reload)
            _self.loadData()
    };
    _self.saveEvent = function(mouseEvent, account) {
        _nowEdit = account;
        if (!_self.submitCheck(account))
            return;
        var sendCode = "";
        sendCode += "uid=" + top.uid;
        sendCode += "&login_layer=" + top.login_layer;
        if (account.saveType == "credits") {
            sendCode += "&mid=" + account.id;
            sendCode += "&langx=" + top.langx;
            sendCode += "&pay_type=" + account.pay_type;
            sendCode += "&now_maxcredit=" + account.maxcredit;
            sendCode += "&t_credit=" + _mc["credits"][account.id]["new_credits"].value.replace(/[^\d.-]/g, "");
            parentClass.dispatchEvent("showLoading", {
                "showLoading": true
            });
            sendCode = "p=chg_" + level + "_credit&" + _self.getBaseParam() + "&" + sendCode;
            _mc["getHttp"].loadURL(top.url, "POST", sendCode)
        } else if (account.saveType == "status") {
            var selectValue = _mc["status"][account.id]["Select"].value();
            sendCode += "&mid=" + account.id;
            if (account.enable != "F")
                sendCode += "&enable=" + selectValue;
            if (account.enable == "Y" && selectValue == "F")
                sendCode += "&enable_pri=N";
            else if (account.enable == "F" && selectValue == "Y")
                sendCode += "&enable_pri=Y";
            if ((account.enable == "S" || account.enable == "F") && selectValue)
                sendCode += "&status=S";
            sendCode += "&pay_type=" + account.pay_type;
            parentClass.dispatchEvent("showLoading", {
                "showLoading": true
            });
            sendCode = "p=chg_" + level + "_status&" + _self.getBaseParam() + "&" + sendCode;
            _mc["getHttp"].loadURL(top.url, "POST", sendCode)
        }
    };
    _self.submitCheck = function(acc) {
        if (typeof _mc["credits"][acc.id] != "undefined")
            util.classFunc(_mc["credits"][acc.id]["error_note"], "--err", "remove");
        if (acc.saveType == "credits") {
            var new_credits = _mc["credits"][acc.id]["new_credits"].value.replace(/[^\d.-]/g, "");
            if (new_credits == "") {
                _self.showError(acc.saveType, "empty_credit");
                return false
            } else if (!util.checkFormat(new_credits.replace(/,/g, ""), 1))
                if (acc.pay_type == 1 && util.checkFormat(new_credits.replace(/[,\.]/g, ""), 1))
                ;
                else if (new_credits * 1 == acc.maxcredit)
            ;
            else {
                _self.showError(acc.saveType, "str_maxcre");
                return false
            } else if (new_credits.replace(/[^\d.-]/g, "") * 1 == 0) {
                _self.showError(acc.saveType, "str_maxcre_zero");
                return false
            }
        } else if (acc.saveType == "status")
        ;
        return true
    };
    _self.showError = function(types, code) {
        if (types == "credits") {
            if (code == "str_maxcre_zero")
                if (top.langx != "en-us")
                    code = LS.get(code + "1") + "," + LS.get(code) + ".";
                else
                    code = LS.get(code) + LS.get(code + "1");
            else
                code = LS.get(code);
            _mc[types][_nowEdit.id]["error_txt"].innerHTML = code;
            util.classFunc(_mc[types][_nowEdit.id]["error_note"], "--err")
        }
    };
    _self.doLoadComplete = function(data) {
        try {
            var arr_data = JSON.parse(data);
            create_btn_first = true;
            if (util.chkErrorMsg(arr_data, LS_code))
                return;
            var code = arr_data.code;
            var msg = arr_data.msg;
            if (code != null && code != "")
                switch (code) {
                    case "Err_credits":
                        var codeAry = code.split("_");
                        _mc[codeAry[1]][_nowEdit.id]["error_txt"].innerHTML = msg;
                        util.classFunc(_mc[codeAry[1]][_nowEdit.id]["error_note"], "--err");
                        parentClass.dispatchEvent("showLoading", {
                            "showLoading": false
                        });
                        break;
                    case "Err_credits_chg":
                    case "Err_credits_avaliable":
                        var codeAry = code.split("_");
                        _mc[codeAry[1]][_nowEdit.id]["error_txt"].innerHTML = msg;
                        util.classFunc(_mc[codeAry[1]][_nowEdit.id]["error_note"], "--err");
                        _nowEdit._ccredit["current_txt"].innerHTML = util.mprintf(arr_data.avaliable_credit * 1, 0, 2, false, true);
                        _nowEdit.avaliable_credit = arr_data.avaliable_credit;
                        _nowEdit.maxcredit = arr_data.old_maxcredit;
                        _nowEdit._ccredit["change_credits_box"].children[0].children[0].innerHTML = util.mprintf(util.showTxt(arr_data.old_maxcredit) * 1, 0, 2, false, true);
                        _nowEdit._ccredit["new_credits"].value = util.mprintf(arr_data.old_maxcredit * 1, 0, 0, false, false);
                        _nowEdit._ccredit["trans_credit"].value = util.mprintf(arr_data.old_maxcredit_trans * 1, 0, 2, false, true);
                        util.addEvent(_nowEdit._ccredit["save_btn"], "click", _self.saveEvent, _nowEdit);
                        cancel_reload = true;
                        parentClass.dispatchEvent("showLoading", {
                            "showLoading": false
                        });
                        break;
                    case "Err_status":
                        parentClass.dispatchEvent("showAlertMsg", arr_data);
                        _self.loadData();
                        break;
                    case "chgCreditSuccess":
                    case "chgStatusSuccess":
                        var types = "credits";
                        if (code.indexOf("Credit") == -1) {
                            types = "status";
                            parentClass.dispatchEvent("showFadeOutMesg", {
                                "text": LS.get("status_update")
                            })
                        }
                        if (types == "credits") {
                            util.classFunc(_mc[types][_nowEdit.id]["error_note"], "--err", "remove");
                            _mc[types][_nowEdit.id]["error_txt"].innerHTML = "";
                            parentClass.dispatchEvent("showFadeOutMesg", {
                                "text": LS.get("credit_update")
                            })
                        }
                        var targetObj = new Object;
                        targetObj.saveType = types;
                        _self.closeDivEvent();
                        _self.loadData();
                        break;
                    case "longerrFail":
                    case "longerrSuccess":
                        parentClass.dispatchEvent("showFadeOutMesg", {
                            "text": msg
                        });
                        _self.loadData();
                        break;
                    case "errormsg|clean_db":
                        var targetObj = new Object;
                        targetObj.saveType = "credits";
                        _self.closeDivEvent();
                        parentClass.dispatchEvent("showAlertMsg", arr_data);
                        parentClass.dispatchEvent("showLoading", {
                            "showLoading": false
                        });
                        break;
                    case "err_cash_sw":
                        _mc["credits"][_nowEdit.id]["error_txt"].innerHTML = msg;
                        util.classFunc(_mc["credits"][_nowEdit.id]["error_note"], "--err");
                        parentClass.dispatchEvent("showLoading", {
                            "showLoading": false
                        });
                        break
                }
        } catch (e) {
            util.echo(e)
        }
    };
    _self.ChkCreditErr = function(e, par) {
        _self.showError("credits", "str_maxcre")
    };
    _self.initCreditShow = function(e, par) {
        util.classFunc(_mc["credits"][_nowEdit.id]["error_note"], "--err", "remove")
    };
    _self.keep_credit = function(e, target) {
        credit_old = target.input.value.replace(/[^\d.-]/g, "");
        target.msg.innerHTML = ""
    };
    _self.inputboxFocusEvent = function(e, target) {
        if (target.box.classList.contains("--err"))
            target.box.classList.remove("--err");
        target.msg.innerHTML = ""
    };
    _self.inputboxBlurEvent = function(e, target) {
        if (target.box.classList.contains("--err"))
            target.box.classList.remove("--err");
        target.msg.innerHTML = ""
    };
    _self.show_credits = function(e, _ccredit) {
        if (e.type == "input")
            util.Replace_Input_credits(e.target, credit_old, e);
        else
            util.Replace_credits(e.target, credit_old, e);
        if (e.target == _ccredit["new_credits"]) {
            var credit = _ccredit["new_credits"].value.replace(/[^\d.-]/g, "");
            _ccredit["current_txt"].innerHTML = util.mprintf(_ccredit["account"].avaliable_credit * 1 + _ccredit["account"].maxcredit * 1 - credit * 1, 0, 2, false, true)
        }
        var trans = e.target.value.replace(/[^\d.-]/g, "") * _ccredit["account"].currency_value;
        _ccredit["trans_credit"].value = util.mprintf(trans, 0, 2, false, true)
    };
    _self.getBaseParam = function() {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&langx=" + top.langx;
        return par
    };
    _self.editEventPrev = function(mouseEvent, param) {
        parentClass.dispatchEvent("showLoading", {
            "showLoading": true
        });
        var getHttp = new HttpRequest;
        getHttp.addEventListener("LoadComplete", _self.editEvent);
        var tmp_obj = {};
        tmp_obj.id = param.id;
        tmp_obj.username = param.username;
        tmp_obj.up_id = account_status.getUpperLayerId_sql();
        tmp_obj.up_username = account_status.getUpperLayerName();
        tmp_obj.user_type = param.user_type;
        tmp_obj.enable = param.enable;
        tmp_obj.pay_type = param.pay_type;
        var txt = JSON.stringify(tmp_obj);
        var param = _self.getBaseParam() + "&keys=editAccount" + "&txt=" + txt;
        param = "p=prevData&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param)
    };
    _self.editEvent = function(data) {
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        });
        var arr_data = JSON.parse(data);
        if (util.chkErrorMsg(arr_data, LS_code))
            return;
        var obj = new Object;
        var paramHash = new Object;
        paramHash["edit_id"] = arr_data.id;
        paramHash["up_id"] = arr_data.up_id;
        paramHash["up_username"] = arr_data.up_username;
        paramHash["edit_username"] = arr_data.username;
        paramHash["edit_type"] = arr_data.user_type;
        paramHash["edit_enable"] = arr_data.enable;
        paramHash["back_page"] = ClassName;
        paramHash["pay_type"] = arr_data.pay_type;
        var obj = new Object;
        obj["page"] = "acc_" + level + "_edit";
        obj["postHash"] = paramHash;
        parentClass.dispatchEvent("bodyGoToPage", obj)
    };
    _self.unlockEvent = function(mouseEvent, paramObj) {
        var sendCode = "";
        sendCode += _self.getBaseParam();
        sendCode += "&level=members";
        sendCode += "&user_id=" + paramObj.id;
        sendCode += "&pay_type=" + paramObj.pay_type;
        sendCode = "p=longerr_Edit&" + sendCode;
        _mc["getHttp"].loadURL(top.url, "POST", sendCode)
    };
    _self.addAccountEventHandler = function(paramObj) {
        if (magager_count != -1 && user_mlimit != -1 && magager_count * 1 >= user_mlimit * 1) {
            var msg = LS.get("sub_selMax");
            parentClass.dispatchEvent("showAlertMsg", {
                msg: msg
            })
        } else
            parentClass.dispatchEvent("bodyGoToPage", paramObj)
    };
    _self.show_status_box = function(e, obj) {
        _self.closeDivEvent();
        var ubj = _mc["status"][obj.id];
        if (!ubj["dropdown_id"].classList.contains("on")) {
            ubj["dropdown_id"].classList.add("on");
            ubj["sel_view"].classList.add("on");
            ubj["sel_list"].children[obj["enable"]].classList.add("on");
            _nowEdit = ubj["account"]
        }
    };
    _self.close_status_box = function(e, obj) {
        var ubj = _mc["status"][obj.id];
        if (ubj["dropdown_id"].classList.contains("on")) {
            ubj["dropdown_id"].classList.remove("on");
            ubj["sel_view"].classList.remove("on");
            ubj["sel_list"].children[obj["enable"]].classList.remove("on");
            _nowEdit = ""
        }
    };
    _self.loadingFun = function(show) {
        parentClass.dispatchEvent("showLoading", {
            "showLoading": show
        })
    };
    _self.scrollEvent = function(e, target) {
        var newScrollTop = e.target.scrollTop;
        if (newScrollTop >= overScrollTop) {
            if (!target.issticky) {
                util.classFunc(target, "report_fixed");
                target.issticky = true
            }
        } else if (target.issticky) {
            util.classFunc(target, "report_fixed", "remove");
            target.issticky = false
        }
        scroll_e = e;
        _self.scroll_ver_event(e, target)
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code")
    };
    _self.exitEvent = function() {
        util.removeEvent(dom.getElementById("ma_content"), "scroll");
        return true
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.listEvent = function(mouseEvent, targetObj) {
        var postHash = new Object;
        postHash["mid"] = targetObj.acc_id;
        postHash["username"] = targetObj.acc_username;
        postHash["alias"] = targetObj.acc_alias;
        postHash["pay_type"] = targetObj.pay_type;
        var param = new Object;
        param["page"] = "acc_mem_history";
        param["postHash"] = postHash;
        parentClass.dispatchEvent("showMemHistory", param)
    };
    _self.scroll_ver_event = function(e, targetObj) {
        if (e == null || !dom.getElementById("scroll_div"))
            return;
        var newScrollTop = e.target.scrollTop;
        var ori_h = e.target.scrollHeight;
        var now_h = 0;
        var func_h = dom.getElementById("scroll_div").clientHeight;
        if (newScrollTop > func_h) {
            now_h = e.target.scrollHeight;
            if (now_h != 0)
                stop_h = func_h - (ori_h - now_h)
        }
        if (newScrollTop <= func_h)
        ;
        _self.checkShowLazyLoading(e.target)
    };
    _self.checkShowLazyLoading = function(target) {
        if (!lazy_sw)
            return;
        var newScrollTop = target.scrollTop;
        var s_h = target.scrollHeight;
        var c_h = target.clientHeight;
        var scroll_bottom = newScrollTop >= s_h - c_h - footer_height - pb_height;
        if (scroll_bottom && !lazy_loading)
            if (lazy_page < lazy_total_page) {
                _self.setLzayLoadingVisible(true);
                retryTimer = setTimeout(_self.loadLazyData, 300)
            }
    };
    _self.setLzayLoadingVisible = function(isShow) {
        if (!lazy_sw)
            return;
        lazy_loading = isShow;
        dom.getElementById("report_loading").style.display = isShow ? "" : "none"
    };
    _self.loadLazyData = function() {
        if (!lazy_sw)
            return;
        lazy_loading = true;
        if (lazy_page < lazy_total_page) {
            lazy_page++;
            _self.parseData(dataHash)
        }
    };
    _self.initLazy = function() {
        lazy_sw = config_set.get("LAZY_SW") || false;
        lazy_page = 1;
        lazy_total_page = 1;
        var lazy_cnt = getView().viewportheight > 700 ? "LAZY_COUNT_BIG_PAGE" : "LAZY_COUNT";
        lazy_count = config_set.get(lazy_cnt) || 10
    };
    _self.reSetLazy = function(row0) {
        _self.initLazy();
        lazy_total_page = row0 ? Math.ceil(row0.length / lazy_count) : 1;
        if (lazy_total_page <= 0)
            lazy_total_page = 1
    };
    _self.goToRetrieve = function(mouseEvent, targetObj) {
        var param = new Object;
        param["page"] = "retrieve_credit";
        parentClass.dispatchEvent("bodyGoToPage", param)
    }
};
