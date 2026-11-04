function acc_mem_comm(_win, _dom, param) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object;
    var util;
    var LS;
    var LS_code;
    var LS_account;
    var _mc = new Object;
    var userDate = new Object;
    var titleObj = new Array;
    var err_msg_Obj = new Array;
    var confObj = new Array;
    var usrChgObj = new Object;
    var usrOriObj = new Object;
    var useInitView = true;
    var credit_old;
    var now_grType = "FT";
    _self.init = function() {
        userDate = param;
        util.echo("acc_mem_comm load complete");
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        });
        _self.InitSetConfirmExit();
        var obj_ids = ",FT_commis_info,BK_commis_info,OP_commis_info,FS_commis_info,show_SA_notice,";
        _mc = util.getObjAry(dom, obj_ids);
        var obj_ids = ",FT_R_war_error,FT_RE_war_error,FT_R_bet_error,FT_RE_bet_error,FT_M_bet_error,FT_DT_bet_error,FT_RDT_bet_error";
        obj_ids += ",BK_R_war_error,BK_RE_war_error,BK_R_bet_error,BK_RE_bet_error,BK_M_bet_error,BK_DT_bet_error";
        obj_ids += ",OP_R_war_error,OP_RE_war_error,OP_R_bet_error,OP_RE_bet_error,OP_M_bet_error,OP_DT_bet_error";
        obj_ids += ",FS_FS_bet_error,";
        var err_msg_Obj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, err_msg_Obj);
        for (var i in err_msg_Obj)
            err_msg_Obj[i].arr_err_domId = Array();
        var obj_ids = ",FT_R_WARTYPE_pc,FT_R_WARTYPE_ph,FT_R_WAR,FT_R_SC,FT_R_SC_limit,FT_R_SO,FT_R_SO_limit";
        obj_ids += ",FT_RE_WARTYPE_pc,FT_RE_WARTYPE_ph,FT_RE_WAR,FT_RE_SC,FT_RE_SC_limit,FT_RE_SO,FT_RE_SO_limit";
        obj_ids += ",FT_M_SC,FT_M_SC_limit,FT_M_SO,FT_M_SO_limit";
        obj_ids += ",FT_DT_SC,FT_DT_SC_limit,FT_DT_SO,FT_DT_SO_limit";
        obj_ids += ",FT_RDT_SC,FT_RDT_SC_limit,FT_RDT_SO,FT_RDT_SO_limit,";
        obj_ids += ",BK_R_WARTYPE_pc,BK_R_WARTYPE_ph,BK_R_WAR,BK_R_SC,BK_R_SC_limit,BK_R_SO,BK_R_SO_limit";
        obj_ids += ",BK_RE_WARTYPE_pc,BK_RE_WARTYPE_ph,BK_RE_WAR,BK_RE_SC,BK_RE_SC_limit,BK_RE_SO,BK_RE_SO_limit";
        obj_ids += ",BK_M_SC,BK_M_SC_limit,BK_M_SO,BK_M_SO_limit";
        obj_ids += ",BK_DT_SC,BK_DT_SC_limit,BK_DT_SO,BK_DT_SO_limit,";
        obj_ids += ",OP_R_WARTYPE_pc,OP_R_WARTYPE_ph,OP_R_WAR,OP_R_SC,OP_R_SC_limit,OP_R_SO,OP_R_SO_limit";
        obj_ids += ",OP_RE_WARTYPE_pc,OP_RE_WARTYPE_ph,OP_RE_WAR,OP_RE_SC,OP_RE_SC_limit,OP_RE_SO,OP_RE_SO_limit";
        obj_ids += ",OP_M_SC,OP_M_SC_limit,OP_M_SO,OP_M_SO_limit";
        obj_ids += ",OP_DT_SC,OP_DT_SC_limit,OP_DT_SO,OP_DT_SO_limit,";
        obj_ids += ",FS_FS_SC,FS_FS_SC_limit,FS_FS_SO,FS_FS_SO_limit,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for (var objid in tmpObj)
            confObj[objid] = tmpObj[objid];
        var obj_ids = ",FT_R_WAR_LB,FT_RE_WAR_LB";
        obj_ids += ",BK_R_WAR_LB,BK_RE_WAR_LB";
        obj_ids += ",OP_R_WAR_LB,OP_RE_WAR_LB,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        var obj_ids = ",div_commis_title,commis_title_scroll,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        util.addEvent(_mc["commis_title_scroll"], "scroll", _self.roll, {
            "chk_obj": _mc["commis_title_scroll"],
            "do_obj": _mc["div_commis_title"]
        });
        var obj_ids = ",FT_commis_title,BK_commis_title,OP_commis_title,FS_commis_title,";
        var tmpObj = util.getObjAry(_mc["div_commis_title"], obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for (var objid in tmpObj) {
            var ta = objid.split("_");
            tmpObj[objid].mapA = ta[0];
            tmpObj[objid].mapB = "_commis_info";
            tmpObj[objid]._type = "COMMIS";
            titleObj[objid] = tmpObj[objid];
            util.addEvent(tmpObj[objid], "click", _self.chg_gtype_chk, tmpObj[objid])
        }
        var tip_BETLIMITicon = document.getElementsByName("tip_BETLIMITicon");
        var len = tip_BETLIMITicon.length;
        for (var i = 0; i < len; i++) {
            var icon = tip_BETLIMITicon[i];
            util.addEvent(icon, "click", _self.showIconMsg, {
                "_id": "modal_popup_betl"
            })
        }
        _self.getCommToServer()
    };
    _self.ChkCreditErr = function(e, par) {
        _self.showError(e.target.id, LS.get("str_maxcre"))
    };
    _self.initCreditShow = function(e, par) {};
    _self.show_credits = function(e) {
        _self.inputboxFocusEvent(e, e.target);
        if (e.type == "input")
            util.Replace_Input_credits(e.target, credit_old, e);
        else
            util.Replace_credits(e.target, credit_old, e)
    };
    _self.keep_credit = function(e) {
        credit_old = e.target.value.replace(/\D/g, "")
    };
    _self.showError = function(tarObj_id, msg) {
        var tmpAry = tarObj_id.split("_");
        var _grType = tmpAry[0] + "_" + tmpAry[1];
        var err_id = _grType + "_bet_error";
        _self.setBoxClass(_mc[tarObj_id].parentElement, "--err", "add");
        _mc[err_id].innerHTML = msg
    };
    _self.setCancelListerner = function(evt, par) {
        now_grType = par.grType;
        _self.closeEvent()
    };
    _self.closeEvent = function(e) {
        var par = new Array;
        par["page"] = param.back_page;
        if (e == "save" || e == "error")
            par["LeaveChkPass"] = true;
        if (param.back_page.indexOf("list") != -1) {
            var _paramObj = new Array;
            _paramObj["up_id"] = param.up_id;
            _paramObj["up_username"] = param.up_username;
            _paramObj["pay_type"] = param.pay_type;
            par["postHash"] = _paramObj
        }
        parentClass.dispatchEvent("bodyGoToPage", par)
    };
    _self.setSubmitListerner = function(evt, param) {
        parentClass.dispatchEvent("showLoading", {
            "showLoading": true
        });
        var chg_value = new Array;
        for (var i in confObj)
            if (i.indexOf(param.grType) != -1 && i.indexOf("limit") == -1) {
                if (i.indexOf("WARTYPE") != -1)
                    continue;
                var now_val = "";
                var val = usrOriObj[i];
                if (i.indexOf("SC") != -1 || i.indexOf("SO") != -1)
                    now_val = confObj[i].value.replace(/[^\d]*/g, "");
                else
                    now_val = confObj[i].value;
                if (now_val != val) {
                    var tmpStr = i.split("_");
                    var keyName = tmpStr[2];
                    if (keyName == "WAR") {
                        var value_key = i.replace(/WAR/g, usrOriObj[i + "TYPE"]);
                        usrChgObj[value_key] = now_val;
                        chg_value.push(value_key)
                    } else {
                        usrChgObj[i] = now_val;
                        chg_value.push(i)
                    }
                }
            }
        usrChgObj["kind"] = param.kind;
        usrChgObj["chg_value"] = chg_value;
        _self.vanishStyle_Text(param.grType);
        if (chg_value.length > 0)
            _self.amendCommToServer();
        else {
            useInitView = false;
            _self.getCommToServer()
        }
        usrChgObj = {}
    };
    _self.close_loading = function() {
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        })
    };
    _self.set_Save_All = function() {
        parentClass.dispatchEvent("showLoading", {
            "showLoading": true
        });
        if (now_grType == "FT") {
            _self.vanishStyle_Text("FT");
            var urlParams = "";
            urlParams += "uid=" + top.uid;
            urlParams += "&login_layer=" + top.login_layer;
            urlParams += "&mid=" + userDate["edit_id"];
            urlParams += "&act=Save_All";
            urlParams += "&pay_type=" + userDate["pay_type"];
            urlParams += "&langx=" + top.langx;
            urlParams += _self.getSaveAllParam();
            urlParams = "p=get_acc_mem_comm&ver=" + top.ver + "&" + urlParams;
            var getHTML = new HttpRequest;
            getHTML.addEventListener("onError", _self.onError);
            getHTML.addEventListener("LoadComplete", _self.amendCommMesg);
            getHTML.loadURL(top.url, "POST", urlParams)
        }
    };
    _self.getSaveAllParam = function() {
        var param = "";
        for (var i in confObj)
            if (i.indexOf("FT") != -1 && i.indexOf("limit") == -1)
                if (i.indexOf("SC") != -1 || i.indexOf("SO") != -1) {
                    param += "&" + i + "=" + confObj[i].value.replace(/[^\d]*/g, "");
                    param += "&chg_value[]=" + i
                } else {
                    var tmpStr = i.split("_");
                    var keyName = tmpStr[2];
                    if (keyName == "WAR") {
                        var value_key = i.replace(/WAR/g, usrOriObj[i + "TYPE"]);
                        param += "&" + value_key + "=" + confObj[i].value;
                        param += "&chg_value[]=" + value_key
                    }
                }
        return param
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account")
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
    _self.onError = function() {
        util.echo("onError")
    };
    _self.backPage = function(e, param) {
        parentClass.dispatchEvent("backToIdex", {
            "retFun": _self.backPageComplete
        })
    };
    _self.backPageComplete = function() {
        util.echo("backPageComplete")
    };
    _self.amendCommToServer = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&mid=" + userDate["edit_id"];
        urlParams += "&pay_type=" + userDate["pay_type"];
        urlParams += "&act=Y";
        urlParams += "&langx=" + top.langx;
        urlParams += _self.getUsrChgParam();
        urlParams = "p=get_acc_mem_comm&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.amendCommMesg);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.getCommToServer = function() {
        parentClass.dispatchEvent("showLoading", {
            "showLoading": true
        });
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&mid=" + userDate["edit_id"];
        urlParams += "&pay_type=" + userDate["pay_type"];
        urlParams += "&langx=" + top.langx;
        urlParams = "p=get_acc_mem_comm&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.setViewParam);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.setViewParam = function(data) {
        if (data == "")
            return;
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data))
                arr_data = JSON.parse(data);
            if (!arr_data)
                arr_data = data
        } catch (e) {
            util.echo(e)
        }
        var currency_def = arr_data.currency_def;
        var currency_name = arr_data.currency_name;
        usrOriObj = arr_data["dataAry"];
        if (usrOriObj) {
            for (var i in usrOriObj) {
                var namsSplit = i.split("_");
                if (namsSplit[2] == "WARTYPE") {
                    if (confObj[i + "_pc"])
                        confObj[i + "_pc"].innerHTML = usrOriObj[i];
                    if (confObj[i + "_ph"])
                        confObj[i + "_ph"].innerHTML = usrOriObj[i];
                    continue
                }
                if (!confObj[i])
                    continue;
                if (namsSplit[3] == "limit") {
                    var tmp = Math.floor(usrOriObj[i] * 1 / currency_def * 1);
                    confObj[i].innerHTML = LS.get("max_limit_head") + currency_name + " " + util.mprintf(tmp, 0, 2, false, true);
                    continue
                }
                if (confObj[i].tagName == "INPUT") {
                    confObj[i].value = util.mprintf(usrOriObj[i], 0, 0, false, false);
                    if (namsSplit[2] == "SC") {
                        confObj[i].chgK = namsSplit[0] + "_" + namsSplit[1] + "_SO";
                        util.addEvent(confObj[i], "keydown", _self.keep_credit);
                        util.ChkKeyCash(confObj[i], {
                            initShow: _self.initCreditShow,
                            onErr: _self.ChkCreditErr,
                            onSuc: _self.count_so
                        })
                    }
                    if (namsSplit[2] == "SO") {
                        util.addEvent(confObj[i], "keydown", _self.keep_credit);
                        util.ChkKeyCash(confObj[i], {
                            initShow: _self.initCreditShow,
                            onErr: _self.ChkCreditErr,
                            onSuc: _self.show_credits
                        })
                    }
                    util.addEvent(confObj[i], "focus", _self.inputboxFocusEvent, confObj[i]);
                    util.addEvent(confObj[i], "blur", _self.inputboxBlurEvent, confObj[i]);
                    continue
                }
                if (confObj[i].tagName == "SELECT") {
                    _self.initOption(confObj[i], usrOriObj[i + "_limit"], config_set.get("CONF_BAR_RANGE"));
                    confObj[i].value = usrOriObj[i];
                    if (confObj[i].JS_UL)
                        confObj[i].JS_UL.setSelected(confObj[i].value);
                    continue
                }
            }
            if (useInitView)
                _self.ShowAndHidden(_mc["FT_commis_title"], _mc["FT_commis_title"])
        } else
            _self.closeEvent("error");
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        })
    };
    _self.count_so = function(keyEvent) {
        _self.show_credits(keyEvent);
        var now_val = keyEvent.target.value.replace(/[^\d]*/g, "");
        var so_v = now_val * 1 / 2;
        confObj[keyEvent.target.chgK].value = util.mprintf(so_v, 0, 0, false, false)
    };
    _self.amendCommMesg = function(data) {
        if (data == "")
            return;
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data))
                arr_data = JSON.parse(data);
            if (!arr_data)
                arr_data = data
        } catch (e) {
            util.echo(e)
        }
        if (arr_data["status"] == "success")
            _self.getCommToServer();
        else if (arr_data["status"] == "error")
            if (arr_data["msg"] == "clean_db") {
                arr_data["msg"] = arr_data["errormsg"];
                parentClass.dispatchEvent("showAlertMsg", arr_data)
            } else if (arr_data["act"] == "Save_All")
            parentClass.dispatchEvent("showAlertMsg", {
                "_id": "acc_comm_pop",
                "do": "comm_msg",
                "gtype_show": arr_data["gtype_show"],
                "rtype_show": arr_data["rtype_show"]
            });
        else {
            var domId = "";
            var str = "";
            if (arr_data["msg"] == null || arr_data["msg"] == "")
                util.chkErrorMsg(arr_data, LS_code);
            var first_ = true;
            if (Object.keys(arr_data["ltypeData"]).length > 0)
                for (var rtype in arr_data["ltypeData"]) {
                    str = arr_data["gtype"] + "_" + rtype;
                    var erroMsgWar = str + "_war_error";
                    var ltype_msg = "";
                    var tmp_ltypeData = arr_data["ltypeData"][rtype];
                    var arr_err_domId = Array();
                    if (tmp_ltypeData.length > 0)
                        for (var i in tmp_ltypeData) {
                            if (tmp_ltypeData[i])
                                domId = str + "_WAR";
                            _self.setBoxClass(_mc[domId].parentElement, "--err", "add");
                            _self.setBoxClass(_mc[domId + "_LB"], "--err", "add");
                            arr_err_domId.push(domId);
                            ltype_msg = tmp_ltypeData[i]["msg"];
                            if (first_) {
                                _self.goTarget_scrollTop(_mc[domId].parentElement);
                                _self.goTarget_scrollTop(_mc[domId + "_LB"]);
                                first_ = false
                            }
                        }
                    if (_mc[erroMsgWar]) {
                        _mc[erroMsgWar].arr_err_domId = arr_err_domId;
                        _mc[erroMsgWar].innerHTML = ltype_msg
                    }
                }
            if (Object.keys(arr_data["betData"]).length > 0)
                for (var rtype in arr_data["betData"]) {
                    str = arr_data["gtype"] + "_" + rtype;
                    var erroMsgBet = str + "_bet_error";
                    var bet_msg = "";
                    var tmp_betData = arr_data["betData"][rtype];
                    if (tmp_betData.length > 0)
                        for (var i in tmp_betData) {
                            if (tmp_betData[i])
                                domId = str + "_" + tmp_betData[i]["bet"];
                            _self.setBoxClass(_mc[domId].parentElement, "--err", "add");
                            if (tmp_betData[i]["bet"] == "SC")
                                bet_msg = tmp_betData[i]["msg"];
                            if (first_) {
                                _self.goTarget_scrollTop(_mc[domId].parentElement);
                                first_ = false
                            }
                        }
                    if (_mc[erroMsgBet])
                        _mc[erroMsgBet].innerHTML = arr_data["betData"][rtype].length == 1 ? arr_data["betData"][rtype][0]["msg"] : bet_msg
                }
        } else
            util.showErrorMsg(arr_data);
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        });
        useInitView = false
    };
    _self.getUsrChgParam = function() {
        var param = "";
        for (var i in usrChgObj)
            if (i == "chg_value") {
                var arr_tmp = usrChgObj[i];
                for (var j in arr_tmp)
                    param += "&" + i + "[]=" + arr_tmp[j]
            } else
                param += "&" + i + "=" + usrChgObj[i];
        return param
    };
    _self.chg_gtype_chk = function(evt, _par) {
        if (!_self.isEdit()) {
            _self.ShowAndHidden(evt, _par);
            return
        }
        util.showMsg(LS_account.get("str_unsave"), "Y", function(msg) {
            if (msg == "yes") {
                _self.reset_value(now_grType);
                _self.ShowAndHidden(evt, _par);
                return
            } else
                return false
        });
        return
    };
    _self.reset_value = function(_gtype) {
        _self.vanishStyle_Text(_gtype);
        for (var i in confObj)
            if (i.indexOf(_gtype) != -1 && i.indexOf("limit") == -1) {
                var now_val = "";
                var val = usrOriObj[i];
                if (i.indexOf("SC") != -1 || i.indexOf("SO") != -1)
                    now_val = confObj[i].value.replace(/[^\d]*/g, "");
                else
                    now_val = confObj[i].value;
                if (now_val != val)
                    if (confObj[i].tagName == "INPUT")
                        confObj[i].value = util.mprintf(val, 0, 0, false, false);
                    else if (confObj[i].tagName == "SELECT") {
                    confObj[i].value = val;
                    if (confObj[i].JS_UL)
                        confObj[i].JS_UL.setSelected(val)
                }
            }
    };
    _self.ShowAndHidden = function(evt, _par) {
        for (var id in titleObj)
            if (titleObj[id].classList.contains("--on") && _par._type == titleObj[id]._type && _par.id != id) {
                titleObj[id].classList.remove("--on");
                var setNone = "" + titleObj[id].mapA + titleObj[id].mapB;
                _mc[setNone].style.display = "none"
            }
        if (!_par.classList.contains("--on"))
            _par.classList.add("--on");
        var setView = "" + _par.mapA + _par.mapB;
        if (_par._type == "COMMIS")
            commiss_gtype = _par.mapA;
        now_grType = _par.mapA;
        _mc[setView].style.display = "";
        if (now_grType == "FT")
            _mc["show_SA_notice"].style.display = "";
        else
            _mc["show_SA_notice"].style.display = "none";
        _self.set_modal_step_btn(now_grType);
        parentClass.dispatchEvent("show_modal_step", {
            "show_step": true
        })
    };
    _self.initOption = function(targetObj, _max, range) {
        if (targetObj == null)
            return;
        targetObj.options.length = 0;
        for (var j = 0; j <= _max; j += range) {
            var varItem = new Option(j, j, false, false);
            targetObj.options.add(varItem)
        }
        targetObj.selectedIndex = targetObj.options.length - 1;
        _self.doSelToUL(targetObj, targetObj.id + "_LB");
        util.addEvent(targetObj, "change", _self.set_UL_value)
    };
    _self.vanishStyle_Text = function(grString) {
        for (var i in confObj)
            if (i.indexOf(grString) != -1 && i.indexOf("limit") == -1)
                if (i.indexOf("SC") != -1 || i.indexOf("SO") != -1)
                    _self.setBoxClass(confObj[i].parentElement, "--err", "");
                else {
                    if (i.indexOf("WARTYPE") != -1)
                        continue;
                    _self.clearErrorStatusWar(null, confObj[i])
                }
        for (var i in err_msg_Obj)
            if (i.indexOf(grString) != -1)
                err_msg_Obj[i].innerHTML = ""
    };
    _self.doSelToUL = function(DOMSel, labelId) {
        var obj_ids = ",sel_text,sel_list,";
        var elmt = util.getObjAry(dom.getElementById(labelId), obj_ids);
        elmt["sel_label"] = dom.getElementById(labelId);
        elmt["sel_list"].innerHTML = "";
        var options = DOMSel.options;
        for (i = 0; i < options.length; i++) {
            if (options[i].style.display == "none")
                continue;
            var tmp_li = document.createElement("li");
            tmp_li.id = options[i].value;
            tmp_li.innerHTML = options[i].innerHTML;
            elmt["sel_list"].appendChild(tmp_li)
        }
        var sel_js = new win.ClassSelect(win, dom);
        sel_js.setParentclass(_self);
        sel_js.init(elmt["sel_text"], elmt["sel_list"], elmt["sel_label"], elmt["sel_label"]);
        sel_js.addEvent("ONCHANGE", _self.set_SEL_value, DOMSel);
        sel_js.addEvent("ONOPEN", _self.show_sel_box, elmt["sel_label"]);
        sel_js.addEvent("ONCLOSE", _self.close_sel_box, elmt["sel_label"]);
        sel_js.addEvent("DISABLED", _self.disable_sel_box, {
            view: elmt["sel_label"],
            ref: DOMSel
        });
        sel_js.setDisabled(DOMSel.disabled);
        DOMSel["JS_UL"] = sel_js
    };
    _self.set_SEL_value = function(e, ElmObj) {
        ElmObj.value = ElmObj.JS_UL.value();
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            ElmObj.dispatchEvent(evt)
        } else
            ElmObj.fireEvent("onchange")
    };
    _self.set_UL_value = function(e) {
        e.target.JS_UL.setSelected(e.target.value);
        _self.clearErrorStatusWar(e, e.target)
    };
    _self.show_sel_box = function(e, ElmObj) {
        if (!ElmObj.classList.contains("--on"))
            ElmObj.classList.add("--on")
    };
    _self.close_sel_box = function(e, ElmObj) {
        if (ElmObj.classList.contains("--on"))
            ElmObj.classList.remove("--on")
    };
    _self.disable_sel_box = function(e, Obj) {
        if (Obj.ref.disabled) {
            if (!Obj.view.classList.contains("disabled"))
                Obj.view.classList.add("disabled")
        } else if (Obj.view.classList.contains("disabled"))
            Obj.view.classList.remove("disabled")
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
    _self.isEdit = function() {
        var chk_chg = false;
        if (usrOriObj)
            for (var i in confObj) {
                if (i.indexOf("WARTYPE") != -1)
                    continue;
                if (i.indexOf(now_grType) != -1 && i.indexOf("limit") == -1) {
                    var now_val = "";
                    var val = usrOriObj[i];
                    if (i.indexOf("SC") != -1 || i.indexOf("SO") != -1)
                        now_val = confObj[i].value.replace(/[^\d]*/g, "");
                    else
                        now_val = confObj[i].value;
                    if (now_val != val) {
                        chk_chg = true;
                        break
                    }
                }
            }
        return chk_chg
    };
    _self.inputboxBlurEvent = function(e, target) {
        var target_box = target.parentElement;
        if (!target_box.classList.contains("--err"))
            _self.setBoxClass(target_box, "--on", "")
    };
    _self.inputboxFocusEvent = function(e, target) {
        var target_box = target.parentElement;
        _self.clearErrorStatusConf(null, target);
        _self.setBoxClass(target_box, "--on", "add")
    };
    _self.clearErrorStatusWar = function(e, target) {
        if (target.parentElement.classList.contains("--err"))
            target.parentElement.classList.remove("--err");
        if (_mc[target.id + "_LB"].classList.contains("--err"))
            _mc[target.id + "_LB"].classList.remove("--err");
        var tmpAry = target.id.split("_");
        var _grType = tmpAry[0] + "_" + tmpAry[1];
        var erroMsgWar = _grType + "_war_error";
        if (_mc[erroMsgWar]) {
            var chk_ = _mc[erroMsgWar].arr_err_domId.indexOf(target.id);
            if (chk_ != -1)
                _mc[erroMsgWar].arr_err_domId.splice(chk_, 1);
            if (_mc[erroMsgWar].arr_err_domId.length <= 0)
                _mc[erroMsgWar].innerHTML = ""
        }
    };
    _self.clearErrorStatusConf = function(e, target) {
        if (target != null) {
            var tarObj_id = target.id;
            var tmpAry = tarObj_id.split("_");
            var _grType = tmpAry[0] + "_" + tmpAry[1];
            var err_id = _grType + "_bet_error";
            if (tmpAry[2] == "SO")
                var tmp_tarObj_id = _grType + "_SC";
            else if (tmpAry[2] == "SC")
                var tmp_tarObj_id = _grType + "_SO";
            if (_mc[tmp_tarObj_id])
                _self.setBoxClass(_mc[tmp_tarObj_id].parentElement, "--err", "");
            _self.setBoxClass(_mc[tarObj_id].parentElement, "--err", "");
            if (_mc[err_id])
                _mc[err_id].innerHTML = ""
        } else
            for (var key in confObj) {
                var tarObj_id = confObj[key].id;
                var tmpAry = tarObj_id.split("_");
                var _grType = tmpAry[0] + "_" + tmpAry[1];
                var err_id = _grType + "_bet_error";
                _self.setBoxClass(_mc[tarObj_id].parentElement, "--err", "");
                if (_mc[err_id])
                    _mc[err_id].innerHTML = ""
            }
    };
    _self.setBoxClass = function(targetObj, style, _doSome) {
        if (targetObj == null)
            return;
        if (targetObj.initclass == null)
            targetObj.initclass = targetObj.className;
        else
            targetObj.className = targetObj.initclass;
        if (_doSome == "add" && !targetObj.classList.contains(style))
            targetObj.classList.add(style)
    };
    _self.set_modal_step_btn = function(set_grType) {
        var obj = new Object;
        obj["btn_left"] = new Object;
        obj["btn_left"].show_msg = LS.get("step_cancel");
        obj["btn_left"].class = {
            "action": "add",
            "classname": "--cancel"
        };
        obj["btn_left"].disabled = false;
        obj["btn_left"].fun = _self.setCancelListerner;
        obj["btn_left"].funvalue = {
            "grType": set_grType + "_"
        };
        if (set_grType == "FT") {
            obj["btn_center"] = new Object;
            obj["btn_center"].show_msg = LS.get("step_safeAll");
            obj["btn_center"].disabled = false;
            obj["btn_center"].fun = _self.set_Save_All
        }
        obj["btn_right"] = new Object;
        obj["btn_right"].show_msg = LS.get("step_editm");
        obj["btn_right"].disabled = false;
        obj["btn_right"].fun = _self.setSubmitListerner;
        obj["btn_right"].funvalue = {
            "grType": set_grType + "_",
            "kind": set_grType
        };
        parentClass.dispatchEvent("set_modal_step", obj)
    };
    _self.goTarget_scrollTop = function(target) {
        if (target) {
            var window_height = dom.getElementById("ma_content").clientHeight;
            dom.getElementById("ma_content").scrollTop = target.offsetTop - window_height / 2 * 2 / 3
        }
    };
    _self.showIconMsg = function(mouseEvent, par) {
        parentClass.dispatchEvent("showAlertMsg", par);
        dom.getElementById(par._id).children[0].focus()
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
    }
};
