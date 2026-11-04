function acc_mem_add_modal(_win, _dom, _paramData) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var LS_account;
    var config_set;
    var paramData = _paramData;
    var paramObj = new Object;
    var _mc = new Object;
    var ctlObj = new Array;
    var confObj = new Array;
    var ltpObj = new Array;
    var titleObj = new Array;
    var credit_old;
    var commiss_gtype = "FT";
    var MainCurrency = "RMB";
    var default_currency = "RMB";
    var up_userData = Array();
    var default_set = {
        "curr_sw": "N",
        "comm_sw": "N"
    };
    var get_template_value = "N";
    var original_value = Array();
    var first_load = true;
    var NowComm = new Object;
    var now_curr = "";
    _self.init = function() {
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        parentClass.dispatchEvent("chgPageName", {
            "pageType": "acc_mem_modal",
            "pageName": "acc_mem_" + paramData.act + "_modal"
        });
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "account",
            "id": "MEM"
        });
        _self.InitSetConfirmExit();
        var obj_ids = ",step_account,step_commission,account_info,commission_info,";
        obj_ids += "box_templatename,input_templatename,msg_templatename,";
        obj_ids += "msg_url,sel_ltype,default_curr,div_curr,default_comm,div_comm,";
        obj_ids += "box_credit,input_credit,msg_credit,";
        obj_ids += "input_credit_RMB,sel_currency,";
        obj_ids += "div_rate,currency_name,currency_def,";
        obj_ids += "sel_upper,agent,";
        obj_ids += "FT_commis_info,BK_commis_info,OP_commis_info,FS_commis_info,";
        _mc = util.getObjAry(dom, obj_ids);
        if (top.login_layer == "ag")
            _mc["agent"].style.display = "none";
        util.addEvent(_mc["sel_ltype"], "change", _self.chgReload, _mc["sel_ltype"]);
        util.addEvent(_mc["sel_upper"], "change", _self.chgReload, _mc["sel_upper"]);
        util.addEvent(_mc["default_curr"], "click", _self.Showdefault_sw, "curr");
        util.addEvent(_mc["default_comm"], "click", _self.Showdefault_sw, "comm");
        _mc["default_comm"].click();
        util.addEvent(_mc["sel_currency"], "change", _self.chgCurrencyEvent, _mc["sel_currency"]);
        ctlObj["templatename"] = new Object;
        ctlObj["templatename"].box = _mc["box_templatename"];
        ctlObj["templatename"].input = _mc["input_templatename"];
        ctlObj["templatename"].msg = _mc["msg_templatename"];
        ctlObj["credit"] = new Object;
        ctlObj["credit"].box = _mc["box_credit"];
        ctlObj["credit"].input = _mc["input_credit"];
        ctlObj["credit"].msg = _mc["msg_credit"];
        util.ChkKeyAlias(ctlObj["templatename"].input);
        util.addEvent(ctlObj["templatename"].input, "focus", _self.inputboxFocusEvent, ctlObj["templatename"]);
        util.addEvent(ctlObj["templatename"].input, "blur", _self.inputboxBlurEvent, ctlObj["templatename"]);
        util.addEvent(ctlObj["credit"].input, "keydown", _self.keep_credit);
        util.ChkKeyCash(ctlObj["credit"].input, {
            initShow: _self.initShow,
            onErr: _self.ChkCreditErr,
            onSuc: _self.show_credits
        });
        util.addEvent(ctlObj["credit"].input, "focus", _self.inputboxFocusEvent, ctlObj["credit"]);
        util.addEvent(ctlObj["credit"].input, "blur", _self.inputboxBlurEvent, ctlObj["credit"]);
        var tip_BETLIMITicon = document.getElementsByName("tip_BETLIMITicon");
        var len = tip_BETLIMITicon.length;
        for (var i = 0; i < len; i++) {
            var icon = tip_BETLIMITicon[i];
            util.addEvent(icon, "click", _self.showIconMsg, {
                "_id": "modal_popup_betl"
            })
        }
        var obj_ids = ",FT_commis_title,BK_commis_title,OP_commis_title,FS_commis_title,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for (var objid in tmpObj) {
            var ta = objid.split("_");
            tmpObj[objid].mapA = ta[0];
            tmpObj[objid].mapB = "_commis_info";
            titleObj[objid] = tmpObj[objid];
            util.addEvent(tmpObj[objid], "click", _self.ShowAndHidden, tmpObj[objid])
        }
        var obj_ids = ",FT_R_0_WAR,FT_R_0_SC,FT_R_0_SO,FT_RE_0_WAR,FT_RE_0_SC,FT_RE_0_SO,FT_M_0_WAR,FT_M_0_SC,FT_M_0_SO,FT_DT_0_WAR,FT_DT_0_SC,FT_DT_0_SO,FT_RDT_0_WAR,FT_RDT_0_SC,FT_RDT_0_SO,";
        obj_ids += "BK_R_0_WAR,BK_R_0_SC,BK_R_0_SO,BK_RE_0_WAR,BK_RE_0_SC,BK_RE_0_SO,BK_M_0_WAR,BK_M_0_SC,BK_M_0_SO,BK_DT_0_WAR,BK_DT_0_SC,BK_DT_0_SO,";
        obj_ids += "OP_R_0_WAR,OP_R_0_SC,OP_R_0_SO,OP_RE_0_WAR,OP_RE_0_SC,OP_RE_0_SO,OP_M_0_WAR,OP_M_0_SC,OP_M_0_SO,OP_DT_0_WAR,OP_DT_0_SC,OP_DT_0_SO,";
        obj_ids += "FS_FS_0_WAR,FS_FS_0_SC,FS_FS_0_SO,";
        obj_ids += "FT_R_0_SC_limit,FT_R_0_SO_limit,FT_RE_0_SC_limit,FT_RE_0_SO_limit,FT_M_0_SC_limit,FT_M_0_SO_limit,FT_DT_0_SC_limit,FT_DT_0_SO_limit,FT_RDT_0_SC_limit,FT_RDT_0_SO_limit,";
        obj_ids += "BK_R_0_SC_limit,BK_R_0_SO_limit,BK_RE_0_SC_limit,BK_RE_0_SO_limit,BK_M_0_SC_limit,BK_M_0_SO_limit,BK_DT_0_SC_limit,BK_DT_0_SO_limit,";
        obj_ids += "OP_R_0_SC_limit,OP_R_0_SO_limit,OP_RE_0_SC_limit,OP_RE_0_SO_limit,OP_M_0_SC_limit,OP_M_0_SO_limit,OP_DT_0_SC_limit,OP_DT_0_SO_limit,";
        obj_ids += "FS_FS_0_SC_limit,FS_FS_0_SO_limit,";
        obj_ids += "boxCMS_FT_R_SC,boxCMS_FT_RE_SC,boxCMS_FT_M_SC,boxCMS_FT_DT_SC,boxCMS_FT_RDT_SC,boxCMS_BK_R_SC,boxCMS_BK_RE_SC,boxCMS_BK_M_SC,boxCMS_BK_DT_SC,boxCMS_OP_R_SC,boxCMS_OP_RE_SC,boxCMS_OP_M_SC,boxCMS_OP_DT_SC,boxCMS_FS_FS_SC,";
        obj_ids += "boxCMS_FT_R_SO,boxCMS_FT_RE_SO,boxCMS_FT_M_SO,boxCMS_FT_DT_SO,boxCMS_FT_RDT_SO,boxCMS_BK_R_SO,boxCMS_BK_RE_SO,boxCMS_BK_M_SO,boxCMS_BK_DT_SO,boxCMS_OP_R_SO,boxCMS_OP_RE_SO,boxCMS_OP_M_SO,boxCMS_OP_DT_SO,boxCMS_FS_FS_SO,";
        obj_ids += "msgCMS_FT_R,msgCMS_FT_RE,msgCMS_FT_M,msgCMS_FT_DT,msgCMS_FT_RDT,msgCMS_BK_R,msgCMS_BK_RE,msgCMS_BK_M,msgCMS_BK_DT,msgCMS_OP_R,msgCMS_OP_RE,msgCMS_OP_M,msgCMS_OP_DT,msgCMS_FS_FS,";
        var tmpObj = util.getObjAry(_mc["commission_info"], obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for (var objid in tmpObj)
            if (objid.search("CMS") == -1) {
                var tmp = objid.split("_");
                confObj[objid] = tmpObj[objid];
                confObj[objid].gtype = tmp[0];
                confObj[objid].rtype = tmp[1];
                confObj[objid].ltype = tmp[2];
                confObj[objid].ftype = tmp[3];
                confObj[objid].limit = tmp[4];
                if (tmp[3] == "SC" || tmp[3] == "SO") {
                    confObj[objid].box = _mc["boxCMS_" + tmp[0] + "_" + tmp[1] + "_" + tmp[3]];
                    confObj[objid].msg = _mc["msgCMS_" + tmp[0] + "_" + tmp[1]]
                }
            }
        var obj_ids = ",FT_R_0_ltype_pc,FT_RE_0_ltype_pc,BK_R_0_ltype_pc,BK_RE_0_ltype_pc,OP_R_0_ltype_pc,OP_RE_0_ltype_pc,";
        obj_ids += "FT_R_0_ltype_ph,FT_RE_0_ltype_ph,BK_R_0_ltype_ph,BK_RE_0_ltype_ph,OP_R_0_ltype_ph,OP_RE_0_ltype_ph,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        for (var objid in tmpObj)
            ltpObj[objid] = tmpObj[objid];
        _mc["sel_upper"].options.length = 0;
        _self.show_info(null, {
            "show": "account",
            "set_step": 1
        });
        parentClass.dispatchEvent("show_modal_step", {
            "show_step": true
        });
        if (paramData.act != "createm")
            get_template_value = "Y";
        _self.loadModalConf();
        var _history_num = win._history.length;
        if (win._history[_history_num - 1].page == "acc_mem_add") {
            win._history[_history_num - 1].page = "acc_mem_modal";
            win._history[_history_num - 1].state = {
                "page": "acc_mem_modal"
            }
        }
    };
    _self.ShowAndHidden = function(mouseEvent, element) {
        for (var id in titleObj)
            if (titleObj[id].classList.contains("--on") && element.id != id) {
                titleObj[id].classList.remove("--on");
                var setNone = "" + titleObj[id].mapA + titleObj[id].mapB;
                _mc[setNone].style.display = "none"
            }
        if (!element.classList.contains("--on"))
            element.classList.add("--on");
        var setView = "" + element.mapA + element.mapB;
        _mc[setView].style.display = ""
    };
    _self.loadModalConf = function() {
        var getHttp = new HttpRequest;
        var param = _self.getConfParam();
        getHttp.addEventListener("LoadComplete", _self.loadConfFinish);
        param = "p=get_modal_conf&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param)
    };
    _self.getConfParam = function() {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&langx=" + top.langx;
        par += "&up_layer=ag";
        if (_mc["sel_upper"].options.length > 0 && _mc["sel_upper"].value != "-") {
            par += "&up_id=" + _mc["sel_upper"].value;
            par += "&up_pay_type=" + _self.getUpPay_type(up_userData, _mc["sel_upper"].value)
        }
        if (paramData.act != "createm" && get_template_value == "Y") {
            par += "&get_template_value=" + get_template_value;
            par += "&template_id=" + paramData.act_id;
            par += "&template_user_id=" + paramData.act_user_id;
            get_template_value = "N"
        }
        return par
    };
    _self.loadConfFinish = function(data) {
        var arr_data = JSON.parse(data);
        if (util.chkErrorMsg(arr_data, LS_code))
            return;
        var use_comm_value = arr_data.game["up_data"];
        if (arr_data.get_template_value == "Y" && arr_data.template_value) {
            var _template_value = arr_data.template_value;
            if (paramData.act == "editm")
                _mc["input_templatename"].value = _template_value["templatename"];
            if (default_set["curr_sw"] != _template_value["default_curr_sw"])
                _mc["default_curr"].click();
            if (_template_value["default_curr_sw"] == "Y") {
                _mc["input_credit"].value = _template_value["maxcredit"];
                _self.set_select_default(_mc["sel_currency"], _template_value["currency"])
            }
            _self.set_select_default(_mc["sel_ltype"], _template_value["type"]);
            if (default_set["comm_sw"] != _template_value["default_comm_sw"])
                _mc["default_comm"].click();
            if (_template_value["default_comm_sw"] == "Y")
                use_comm_value = arr_data.game["template_data_" + _template_value["id"]];
            original_value = _template_value
        }
        _self.initLtype();
        paramObj.up_id = arr_data.up_id;
        paramObj.up_data = arr_data.uplayer_user;
        up_userData = arr_data.uplayer_user;
        _self.initModalLayer();
        _self.set_comm_value(arr_data.game["up_data"], use_comm_value);
        _mc["currency"] = arr_data.currency;
        _self.initCurrency();
        var l_value = _mc["sel_ltype"].value;
        var ary_ltype = config_set.get("LTYPE_ARY");
        for (var objid in ltpObj)
            ltpObj[objid].innerHTML = ary_ltype[l_value];
        setTimeout(function() {
            parentClass.dispatchEvent("showLoading", {
                "showLoading": false
            })
        }, 300)
    };
    _self.set_select_default = function(_Object, default_value) {
        var varItem = new Option("", default_value, false, false);
        _Object.options.add(varItem);
        _Object.value = default_value
    };
    _self.set_comm_value = function(up_value, _valueObj) {
        for (var objid in confObj) {
            var obj = confObj[objid];
            var gameObj = _valueObj[obj.gtype];
            if (gameObj == null)
                continue;
            var dataObj = gameObj.data[obj.rtype + "_" + _mc["sel_ltype"].value];
            if (dataObj) {
                var war = util.showTxt(dataObj.war);
                var sc = util.showTxt(dataObj.sc);
                var so = util.showTxt(dataObj.so)
            } else {
                var war = 0;
                var sc = 0;
                var so = 0
            }
            var up_dataObj = up_value[obj.gtype].data[obj.rtype + "_" + _mc["sel_ltype"].value];
            if (up_dataObj) {
                var up_war = util.showTxt(up_dataObj.war);
                var up_sc = util.showTxt(up_dataObj.sc);
                var up_so = util.showTxt(up_dataObj.so)
            } else {
                var up_war = 0;
                var up_sc = 0;
                var up_so = 0
            }
            obj.war = war;
            obj.sc = sc;
            obj.so = so;
            obj.up_war = up_war;
            obj.up_sc = up_sc;
            obj.up_so = up_so;
            if (obj.limit != null) {
                var setV = "";
                if (obj.ftype == "SC")
                    setV = up_sc;
                else
                    setV = up_so;
                obj.innerHTML = LS.get("max_limit_head") + MainCurrency + " " + util.mprintf(setV * 1, 0, 0, false, true);
                obj.setK = obj.gtype + "_" + obj.rtype + "_" + obj.ltype + "_" + obj.ftype;
                obj.setV = setV
            } else if (obj.ftype == "WAR") {
                var max = dataObj.max_war != undefined ? dataObj.max_war : up_war;
                _self.initOption(obj, max, war, config_set.get("CONF_BAR_RANGE"))
            } else if (obj.ftype == "SC" || obj.ftype == "SO") {
                if (obj.ftype == "SC") {
                    obj.value = util.mprintf(sc * 1, 0, 0, false, false);
                    obj.chgK = obj.gtype + "_" + obj.rtype + "_" + obj.ltype + "_SO";
                    util.addEvent(obj, "keydown", _self.keep_credit);
                    util.ChkKeyCash(obj, {
                        initShow: _self.initShow,
                        onErr: _self.ChkCreditErr,
                        onSuc: _self.count_so
                    })
                } else {
                    obj.value = util.mprintf(so * 1, 0, 0, false, false);
                    util.addEvent(obj, "keydown", _self.keep_credit);
                    util.ChkKeyCash(obj, {
                        initShow: _self.initShow,
                        onErr: _self.ChkCreditErr,
                        onSuc: _self.show_credits
                    })
                }
                util.addEvent(obj, "focus", _self.inputboxFocusEvent, obj);
                util.addEvent(obj, "blur", _self.inputboxBlurEvent, obj)
            }
        }
    };
    _self.formatCredit = function(credit, def, currency) {
        var num = Math.floor(credit * 1 / def * 1 * 1E3 + 1E-5) / 1E3;
        return num
    };
    _self.chgReload = function(changeEvent) {
        if (changeEvent)
            _self.set_UL_value(changeEvent);
        var idx = _mc["sel_upper"].selectedIndex;
        if (idx == -1) {
            idx = 0;
            _mc["sel_upper"].selectedIndex = idx
        }
        _self.saveNowcomm();
        var l_value = _mc["sel_ltype"].value;
        var ary_ltype = config_set.get("LTYPE_ARY");
        for (var objid in ltpObj)
            ltpObj[objid].innerHTML = ary_ltype[l_value];
        _self.loadModalConf()
    };
    _self.saveNowcomm = function() {
        if (default_set["comm_sw"] == "Y")
            if (Object.keys(NowComm).length === 0) {
                NowComm["curr"] = now_curr;
                NowComm["upper"] = _mc["sel_upper"].value;
                NowComm["comm_data"] = _self.getNowcommData()
            } else if (NowComm["upper"] != _mc["sel_upper"].value)
            NowComm = new Object;
        else {
            NowComm["curr"] = now_curr;
            NowComm["upper"] = _mc["sel_upper"].value;
            NowComm["comm_data"] = _self.getNowcommData()
        }
    };
    _self.getNowcommData = function() {
        var arr_out = new Object;
        for (var objid in confObj) {
            var obj = confObj[objid];
            if (obj.limit == null) {
                if (obj.ftype == "SC" || obj.ftype == "SO")
                    var now_value = obj.value.replace(/\D/g, "");
                else
                    continue;
                arr_out[objid] = now_value
            }
        }
        return arr_out
    };
    _self.count_so = function(keyEvent) {
        _self.show_credits(keyEvent);
        var now_val = keyEvent.target.value.replace(/[^\d]*/g, "");
        var so_v = now_val * 1 / 2;
        confObj[keyEvent.target.chgK].value = util.mprintf(so_v, 0, 0, false, false)
    };
    _self.initOption = function(targetObj, _max, _set, range) {
        if (targetObj == null)
            return;
        targetObj.options.length = 0;
        var _set_num = -1;
        var i = 0;
        for (var j = 0; j <= _max; j += range) {
            if (j == _set)
                _set_num = i;
            var varItem = new Option(j, j, false, false);
            targetObj.options.add(varItem);
            i++
        }
        if (_set_num == -1)
            _set_num = i - 1;
        targetObj.selectedIndex = _set_num;
        _self.doSelToUL(targetObj, targetObj.id + "_LB");
        util.addEvent(targetObj, "change", _self.set_UL_value)
    };
    _self.saveEvent = function() {
        var show_alert_type = paramData.act;
        if (paramData.act == "copym")
            show_alert_type = "createm";
        parentClass.dispatchEvent("showAlertMsg", {
            "_id": "modal_popup_" + show_alert_type
        });
        var ret = _self.submitCheck();
        if (ret) {
            var getHttp = new HttpRequest;
            getHttp.addEventListener("LoadComplete", function(data) {
                setTimeout(function(data) {
                    _self.saveFinish(data)
                }, 500, data)
            });
            var param = _self.getSaveParam();
            param = "p=body_modal_conf_set&ver=" + top.ver + "&" + param;
            getHttp.loadURL(top.url, "POST", param)
        } else
            parentClass.dispatchEvent("hideAlertMsg", {})
    };
    _self.saveFinish = function(data) {
        try {
            var arr_data = JSON.parse(data)
        } catch (e) {
            util.showErrorMsg("data error");
            return
        }
        var _status = arr_data.status;
        parentClass.dispatchEvent("hideAlertMsg", {});
        if (_status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg != null && error_msg != "")
                _self.show_Error(error_code, error_msg, arr_data);
            else
                util.chkErrorMsg(arr_data, LS_code)
        } else {
            var _history_num = win._history.length;
            if (_history_num > 2) {
                win._history.splice(_history_num - 1, 1);
                win._history.splice(_history_num - 2, 1)
            }
            var obj = new Object;
            obj.page = "acc_mem_modal";
            obj.LeaveChkPass = true;
            parentClass.dispatchEvent("bodyGoToPage", obj)
        }
    };
    _self.getSaveParam = function() {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&keys=" + paramData.act;
        if (paramData.act == "editm")
            par += "&template_edit_id=" + paramData.act_id;
        par += "&templatename=" + _mc["input_templatename"].value;
        par += "&default_curr_sw=" + default_set["curr_sw"];
        if (default_set["curr_sw"] == "Y")
            par += "&maxcredit=" + _mc["input_credit"].value.replace(/\D/g, "");
        else
            par += "&maxcredit=0";
        par += "&currency=" + _mc["sel_currency"].value;
        par += "&type=" + _mc["sel_ltype"].value;
        par += "&default_comm_sw=" + default_set["comm_sw"];
        par += "&up_layer=ag";
        par += "&up_id=" + _mc["sel_upper"].value;
        par += "&up_pay_type=" + _self.getUpPay_type(up_userData, _mc["sel_upper"].value);
        par += "&langx=" + top.langx;
        par += _self.getConfAryUrl();
        return par
    };
    _self.getUpPay_type = function(up_userData, up_id) {
        var up_pay_type = 0;
        for (var key in up_userData) {
            var tmp_data = up_userData[key];
            if (tmp_data["id"] == up_id) {
                up_pay_type = tmp_data["pay_type"];
                break
            }
        }
        return up_pay_type
    };
    _self.getConfAryUrl = function() {
        var par = "";
        for (var objid in confObj) {
            var obj = confObj[objid];
            if (obj.limit == null) {
                var _name = objid.replace("_0_", "_" + _mc["sel_ltype"].value + "_");
                par += "&" + _name;
                if (obj.ftype == "SC" || obj.ftype == "SO")
                    par += "=" + obj.value.replace(/\D/g, "");
                else
                    par += "=" + obj.value
            }
        }
        return par
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
    _self.ChkCreditErr = function(e) {
        if (e.target == ctlObj["credit"].input)
            _self.showErrorCtl("credit", LS.get("str_maxcre"));
        else
            _self.showError(e.target.id, LS.get("str_maxcre"))
    };
    _self.showError = function(tarObj_id, msg) {
        var tmpAry = tarObj_id.split("_");
        var _grType = tmpAry[0] + "_" + tmpAry[1];
        var err_id = "msgCMS_" + _grType;
        _mc[tarObj_id].parentElement.classList.add("--err");
        _mc[err_id].innerHTML = msg;
        _mc[err_id].style.display = ""
    };
    _self.keep_credit = function(e) {
        credit_old = e.target.value.replace(/\D/g, "")
    };
    _self.show_credits = function(e) {
        var do_target = new Object;
        var ctl_tmp = e.target.id.replace("input_", "");
        if (ctlObj[ctl_tmp])
            do_target = ctlObj[ctl_tmp];
        else
            for (var key in ctlObj)
                if (ctlObj[key].input == e.target) {
                    do_target = ctlObj[key];
                    break
                }
        _self.inputboxFocusEvent(e, do_target);
        if (e.type == "input")
            util.Replace_Input_credits(e.target, credit_old, e);
        else
            util.Replace_credits(e.target, credit_old, e);
        if (e.target == _mc["input_credit"])
            _self.TransRMB()
    };
    _self.TransRMB = function() {
        var credit = _mc["input_credit"].value.replace(/\D/g, "");
        credit = credit * 1;
        if (_mc["currency_def"].innerHTML * 1 == 1) {
            _mc["input_credit_RMB"].parentElement.parentElement.style.display = "none";
            _mc["div_rate"].style.display = "none"
        } else {
            var trans = _mc["currency_def"].innerHTML * credit;
            _mc["input_credit_RMB"].value = util.mprintf(trans, 0, 2, false, true);
            _mc["input_credit_RMB"].parentElement.parentElement.style.display = "";
            _mc["div_rate"].style.display = ""
        }
    };
    _self.showErrorCtl = function(code, msg) {
        if (code == "system")
            code = "user";
        if (code)
            _self.clearErrorStatusCtl(null, ctlObj[code]);
        else
            _self.clearErrorStatusCtl();
        var _obj = ctlObj[code];
        var error_class = "--err";
        if (_obj != null) {
            _obj.msg.innerHTML = msg;
            _self.setBoxClass(_obj.box, error_class, "add")
        }
    };
    _self.inputboxFocusEvent = function(e, target) {
        _self.clearErrorStatusCtl(null, target);
        _self.clearErrorStatusConf(null, target);
        _self.setBoxClass(target.box, "--on", "add")
    };
    _self.inputboxBlurEvent = function(e, target) {
        if (!target.box.classList.contains("--err"))
            _self.setBoxClass(target.box, "--on", "")
    };
    _self.clearErrorStatusCtl = function(e, target) {
        if (target != null) {
            _self.setBoxClass(target.box, "--err", "");
            target.msg.innerHTML = ""
        } else
            for (var key in ctlObj) {
                _self.setBoxClass(ctlObj[key].box, "--err", "");
                ctlObj[key].msg.innerHTML = ""
            }
    };
    _self.clearErrorStatusConf = function(e, target) {
        if (target != null) {
            if (target.ftype == "SC") {
                var tmp_obj = confObj[target.gtype + "_" + target.rtype + "_" + target.ltype + "_SO"];
                _self.setBoxClass(tmp_obj.box, "", "")
            } else if (target.ftype == "SO") {
                var tmp_obj = confObj[target.gtype + "_" + target.rtype + "_" + target.ltype + "_SC"];
                _self.setBoxClass(tmp_obj.box, "", "")
            }
            _self.setBoxClass(target.box, "", "");
            if (target.msg)
                target.msg.innerHTML = ""
        } else
            for (var key in confObj) {
                _self.setBoxClass(confObj[key].box, "", "");
                if (confObj[key].msg)
                    confObj[key].msg.innerHTML = ""
            }
    };
    _self.show_Error = function(code, msg, arr_data) {
        var tmp = code.split("|");
        if (tmp[0] == "errormsg")
            _self.showErrorMsg(tmp[1], msg);
        else if (tmp[0] == "ctl")
            _self.showErrorCtl(tmp[1], msg);
        else if (tmp[0] == "conf")
            _self.showErrorConf(tmp[1], msg);
        else if (msg != null && msg != "")
            parentClass.dispatchEvent("showAlertMsg", arr_data);
        else
            util.chkErrorMsg(arr_data, LS_code)
    };
    _self.showErrorMsg = function(code, msg) {
        if (code == "clean_db") {
            var obj = new Object;
            obj.msg = msg;
            obj.backPage = "account";
            parentClass.dispatchEvent("showAlertMsg", obj)
        } else if (code == "err_cash_sw") {
            var obj = new Object;
            obj.msg = msg;
            obj.backPage = "account";
            parentClass.dispatchEvent("showAlertMsg", obj)
        }
    };
    _self.showErrorConf = function(code, msg) {
        var obj = confObj[code.replace(/\d/g, "0")];
        if (obj != null)
            if (obj.ftype != null && obj.limit == null) {
                _self.initShow();
                obj.msg.innerHTML = msg;
                _self.setBoxClass(obj.box, "--err", "add");
                commiss_gtype = obj.gtype;
                _self.ShowAndHidden(null, _mc["commission_title_box"]);
                obj.focus()
            }
    };
    _self.submitCheck = function() {
        _self.initShow();
        if (_mc["sel_upper"].value == "")
            return false;
        if (ctlObj["templatename"].input.value == "") {
            _self.showErrorCtl("templatename", LS.get("empty_templatename"));
            _self.goTarget_scrollTop(ctlObj["templatename"].box);
            return false
        } else if (!util.checkFormat(ctlObj["templatename"].input.value, 3)) {
            _self.showErrorCtl("templatename", LS.get("alias_no_SPChar"));
            _self.goTarget_scrollTop(ctlObj["templatename"].box);
            return false
        }
        if (default_set["curr_sw"] == "Y")
            if (ctlObj["credit"].input.value == "") {
                _self.showErrorCtl("credit", LS.get("empty_credit"));
                _self.show_info(null, {
                    "show": "account",
                    "set_step": 1
                });
                _self.goTarget_scrollTop(ctlObj["credit"].box);
                return false
            } else if (ctlObj["credit"].input.value.replace(/\D/g, "") * 1 == 0) {
            if (top.langx != "en-us")
                _self.showErrorCtl("credit", LS.get("str_maxcre_zero1") + "," + LS.get("str_maxcre_zero") + ".");
            else
                _self.showErrorCtl("credit", LS.get("str_maxcre_zero") + LS.get("str_maxcre_zero1"));
            _self.show_info(null, {
                "show": "account",
                "set_step": 1
            });
            _self.goTarget_scrollTop(ctlObj["credit"].box);
            return false
        }
        for (var objid in confObj)
            if (confObj[objid].value == "")
                confObj[objid].value = 0;
        return true
    };
    _self.goTarget_scrollTop = function(target) {
        if (target) {
            var window_height = dom.getElementById("ma_content").clientHeight;
            dom.getElementById("ma_content").scrollTop = target.offsetTop - window_height / 2 * 2 / 3
        }
    };
    _self.initModalLayer = function() {
        _mc["sel_upper"].options.length = 0;
        if (top.login_layer == "co" || top.login_layer == "su") {
            var upObj = paramObj.up_data;
            if (upObj != null) {
                for (var key in upObj) {
                    var _id = upObj[key].id;
                    var _name = upObj[key].username;
                    var _alias = upObj[key].alias;
                    var _enable = upObj[key].enable;
                    if (_enable != "Y")
                        continue;
                    var varItem = new Option(_name, _id, false, false);
                    _mc["sel_upper"].options.add(varItem)
                }
                _mc["sel_upper"].value = paramObj.up_id
            }
        } else if (top.login_layer == "ag") {
            var varItem = new Option(top.layer_username, top.layer_id, false, false);
            _mc["sel_upper"].options.add(varItem);
            _mc["sel_upper"].value = top.layer_id
        }
        if (_mc["sel_upper"].options.length == 0) {
            var varItem = new Option("-", "-", false, false);
            _mc["sel_upper"].options.add(varItem);
            _mc["sel_upper"].value = "-"
        }
        _self.doSelToUL(_mc["sel_upper"], "sel_upper_LB")
    };
    _self.initLtype = function() {
        var ary_ltype = config_set.get("LTYPE_ARY");
        var def_ltype = config_set.get("MODAL_DEF_LTYPE");
        var old_ltype = _mc["sel_ltype"].value || def_ltype;
        _mc["sel_ltype"].options.length = 0;
        for (var key in ary_ltype) {
            var varItem = new Option(ary_ltype[key], key, false, false);
            _mc["sel_ltype"].options.add(varItem)
        }
        _mc["sel_ltype"].value = old_ltype;
        _self.doSelToUL(_mc["sel_ltype"], "sel_ltype_LB")
    };
    _self.initCurrency = function() {
        var old_Currency = _mc["sel_currency"].value || default_currency;
        _mc["sel_currency"].options.length = 0;
        for (key in _mc["currency"]) {
            var code = _mc["currency"][key].code;
            var _name = _mc["currency"][key].name;
            var varItem = new Option(_name, code, false, false);
            _mc["sel_currency"].options.add(varItem)
        }
        if (old_Currency != "")
            _mc["sel_currency"].value = old_Currency;
        _self.doSelToUL(_mc["sel_currency"], "sel_currency_LB");
        _mc["currency_name"].innerHTML = _mc["sel_currency"].options[_mc["sel_currency"].selectedIndex].value;
        _self.chgCurrencyEvent(null, _mc["sel_currency"].options[_mc["sel_currency"].selectedIndex]);
        MainCurrency = _mc["sel_currency"].options[_mc["sel_currency"].selectedIndex].innerHTML
    };
    _self.chgCurrencyEvent = function(changeEvent, targetObj) {
        if (changeEvent) {
            _self.saveNowcomm();
            _self.set_UL_value(changeEvent)
        }
        var currObj = _mc["currency"][targetObj.value];
        var def = limit_def = util.showTxt(currObj.def);
        var code_name = util.showTxt(currObj.name);
        _mc["currency_def"].innerHTML = def;
        _mc["currency_name"].innerHTML = _mc["currency"][targetObj.value]["name"];
        MainCurrency = currObj.name;
        _self.TransRMB();
        if (default_set["curr_sw"] == "Y" || first_load) {
            if (default_set["curr_sw"] == "Y" && first_load)
                def = "1";
            for (key in confObj) {
                var obj = confObj[key];
                if (Object.keys(NowComm).length === 0 || NowComm["comm_data"][key] == "undefined") {
                    var total = obj.ftype == "SC" ? obj.sc : obj.so;
                    var tmp = _self.formatCredit(total * 1, def, _mc["sel_currency"].value)
                } else {
                    var total = NowComm["comm_data"][key];
                    var use_curr = NowComm["curr"];
                    var tmp = _self.formatCredit(total * 1 * _mc["currency"][use_curr]["def"], def, _mc["sel_currency"].value)
                }
                var limit_total = obj.ftype == "SC" ? obj.up_sc : obj.up_so;
                var limit_tmp = _self.formatCredit(limit_total * 1, limit_def, _mc["sel_currency"].value);
                if (obj.limit != null) {
                    obj.innerHTML = LS.get("max_limit_head") + MainCurrency + " " + util.mprintf(limit_tmp * 1, 0, 0, false, true);
                    obj.setV = limit_tmp
                } else if (obj.ftype != "WAR") {
                    if (tmp > limit_tmp)
                        tmp = limit_tmp;
                    obj.value = util.mprintf(tmp * 1, 0, 0, false, false)
                }
                if (default_set["curr_sw"] == "Y" && first_load) {
                    obj.sc = obj.up_sc;
                    obj.so = obj.up_so
                }
            }
            if (first_load)
                first_load = false
        } else {
            var defaul_currObj = _mc["currency"][default_currency];
            var def = util.showTxt(defaul_currObj.def);
            var defaul_currency_name = defaul_currObj.name;
            for (key in confObj) {
                var obj = confObj[key];
                if (Object.keys(NowComm).length === 0 || NowComm["comm_data"][key] == undefined) {
                    var total = obj.ftype == "SC" ? obj.up_sc : obj.up_so;
                    tmp = _self.formatCredit(total * 1, def, _mc["sel_currency"].value)
                } else {
                    var total = NowComm["comm_data"][key];
                    var use_curr = NowComm["curr"];
                    var tmp = _self.formatCredit(total * 1 * _mc["currency"][use_curr]["def"], def, _mc["sel_currency"].value)
                }
                var limit_total = obj.ftype == "SC" ? obj.up_sc : obj.up_so;
                var limit_tmp = _self.formatCredit(limit_total * 1, limit_def, _mc["sel_currency"].value);
                if (obj.limit != null) {
                    obj.innerHTML = LS.get("max_limit_head") + defaul_currency_name + " " + util.mprintf(tmp * 1, 0, 0, false, true);
                    obj.setV = tmp
                } else if (obj.ftype != "WAR") {
                    if (tmp > limit_tmp)
                        tmp = limit_tmp;
                    obj.value = util.mprintf(tmp * 1, 0, 0, false, false)
                }
            }
        }
        now_curr = default_set["curr_sw"] == "Y" ? _mc["sel_currency"].value : default_currency
    };
    _self.Showdefault_sw = function(e, sw_name) {
        var targetObj = _mc["default_" + sw_name];
        var div_Obj = _mc["div_" + sw_name];
        if (default_set[sw_name + "_sw"] == "N") {
            targetObj.setAttribute("data-txt", LS.get("default_enable"));
            div_Obj.classList.remove("--all_disabled");
            default_set[sw_name + "_sw"] = "Y"
        } else {
            targetObj.setAttribute("data-txt", LS.get("default_disable"));
            div_Obj.classList.add("--all_disabled");
            default_set[sw_name + "_sw"] = "N"
        }
        if (sw_name == "curr" && !first_load)
            _self.chgCurrencyEvent(null, _mc["sel_currency"].options[_mc["sel_currency"].selectedIndex])
    };
    _self.initShow = function(e) {
        var target = new Object;
        if (e) {
            var ctl_tmp = e.target.id.replace("input_", "");
            if (ctlObj[ctl_tmp])
                target = ctlObj[ctl_tmp];
            else
                for (var key in ctlObj)
                    if (ctlObj[key].input == e.target) {
                        target = ctlObj[key];
                        break
                    }
            if (target.length > 0) {
                _self.clearErrorStatusCtl(e, target);
                _self.setBoxClass(target.box, "--on", "add")
            }
            _self.clearErrorStatusConf(e, target);
            if (confObj[e.target.id] != null) {
                target = confObj[e.target.id];
                _self.setBoxClass(target.box, "--on", "add")
            }
        }
    };
    _self.showIconMsg = function(mouseEvent, par) {
        parentClass.dispatchEvent("showAlertMsg", par)
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
        config_set = parentClass.getThis("config_set")
    };
    _self.exitEvent = function() {
        parentClass.dispatchEvent("show_modal_step", {
            "show_step": false
        });
        return true
    };
    _self.doSelToUL = function(DOMSel, labelId) {
        var obj_ids = ",sel_text,sel_list,";
        var elmt = util.getObjAry(dom.getElementById(labelId), obj_ids);
        elmt["sel_label"] = dom.getElementById(labelId);
        elmt["sel_list"].innerHTML = "";
        var options = DOMSel.options;
        for (i = 0; i < options.length; i++) {
            var tmp_li = document.createElement("li");
            tmp_li.id = options[i].value;
            tmp_li.innerHTML = options[i].innerHTML;
            elmt["sel_list"].appendChild(tmp_li)
        }
        var sel_js = new win.ClassSelect(win, dom);
        sel_js.setParentclass(_self);
        sel_js.init(elmt["sel_text"], elmt["sel_list"], elmt["sel_label"], elmt["sel_label"]);
        sel_js.setSelected(DOMSel.value);
        sel_js.addEvent("ONCHANGE", _self.set_SEL_value, DOMSel);
        sel_js.addEvent("ONOPEN", _self.show_sel_box, elmt["sel_label"]);
        sel_js.addEvent("ONCLOSE", _self.close_sel_box, elmt["sel_label"]);
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
        e.target.JS_UL.setSelected(e.target.value)
    };
    _self.show_sel_box = function(e, ElmObj) {
        if (!ElmObj.classList.contains("--on"))
            ElmObj.classList.add("--on")
    };
    _self.close_sel_box = function(e, ElmObj) {
        if (ElmObj.classList.contains("--on"))
            ElmObj.classList.remove("--on")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.InitSetConfirmExit = function() {
        var obj = new Object;
        obj["Alert"] = {
            "msg": LS_account.get("str_unsave"),
            "mode": "Y"
        };
        obj["ifNo"] = _self.exitConfirmNo;
        if (paramData.act != "createm")
            obj["isEdit"] = _self.isEdit;
        parentClass.dispatchEvent("SetConfirmExit", obj)
    };
    _self.exitConfirmNo = function() {
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "account",
            "id": "MEM"
        })
    };
    _self.isEdit = function() {
        if (original_value) {
            var new_templatename = _mc["input_templatename"].value;
            var new_default_curr_sw = default_set["curr_sw"];
            var new_maxcredit = _mc["input_credit"].value.replace(/\D/g, "");
            var new_currency = _mc["sel_currency"].value;
            var new_type = _mc["sel_ltype"].value;
            var new_default_comm_sw = default_set["comm_sw"];
            var new_up_id = _mc["sel_upper"].value;
            if (new_templatename != original_value["templatename"] || new_default_curr_sw != original_value["default_curr_sw"] || new_type != original_value["type"] || new_default_comm_sw != original_value["default_comm_sw"])
                return true;
            else {
                if (original_value["default_curr_sw"] == "Y")
                    if (new_maxcredit * 1 != original_value["maxcredit"] * 1 || new_currency != original_value["currency"])
                        return true;
                if (original_value["default_comm_sw"] == "Y")
                    if (new_up_id != "-" && new_up_id != original_value["up_id"])
                        return true;
                    else
                        return _self.check_comm_value(original_value["game"]["template_data_" + original_value["id"]]);
                else
                    return false
            }
        }
    };
    _self.check_comm_value = function(original_comm_value) {
        var is_edit = false;
        for (var objid in confObj) {
            var obj = confObj[objid];
            if (obj.limit == null) {
                if (obj.ftype == "SC" || obj.ftype == "SO")
                    var now_value = obj.value.replace(/\D/g, "");
                else
                    var now_value = obj.value;
                var _name = objid.replace("_0_", "_" + _mc["sel_ltype"].value + "_");
                var tmp = _name.split("_");
                var gtype = tmp[0];
                var lrtype = tmp[1] + "_" + tmp[2];
                var ftype = tmp[3].toLowerCase();
                var original_value = original_comm_value[gtype]["data"][lrtype][ftype];
                if (now_value * 1 != original_value * 1) {
                    is_edit = true;
                    break
                }
            }
        }
        return is_edit
    };
    _self.show_info = function(e, param) {
        var arr_step = Array("account", "commission");
        var front_show = true;
        for (var key in arr_step) {
            var tmp_step_Obj = _mc["step_" + arr_step[key]];
            var tmp_info_Obj = _mc[arr_step[key] + "_info"];
            if (arr_step[key] == param.show) {
                if (tmp_step_Obj.classList.contains("--ok"))
                    tmp_step_Obj.classList.remove("--ok");
                tmp_step_Obj.classList.add("--on");
                front_show = false;
                tmp_info_Obj.style.display = ""
            } else {
                tmp_step_Obj.classList.remove("--on");
                if (front_show)
                    tmp_step_Obj.classList.add("--ok");
                tmp_info_Obj.style.display = "none"
            }
        }
        if (param.go_top)
            dom.getElementById("ma_content").scrollTop = 0;
        _self.set_modal_step_btn(param.set_step)
    };
    _self.set_modal_step_btn = function(show_now_step) {
        var obj = new Object;
        if (show_now_step == 1) {
            obj["btn_left"] = new Object;
            obj["btn_left"].show_msg = LS.get("step_cancel");
            obj["btn_left"].class = {
                "action": "add",
                "classname": "--cancel"
            };
            obj["btn_left"].disabled = false;
            obj["btn_left"].fun = _self.closeEvent;
            obj["btn_right"] = new Object;
            obj["btn_right"].show_msg = LS.get("step_next");
            obj["btn_right"].disabled = false;
            obj["btn_right"].fun = _self.show_info;
            obj["btn_right"].funvalue = {
                "show": "commission",
                "set_step": 2,
                "go_top": true
            }
        } else if (show_now_step == 2) {
            obj["btn_left"] = new Object;
            obj["btn_left"].show_msg = LS.get("step_back");
            obj["btn_left"].disabled = false;
            obj["btn_left"].fun = _self.show_info;
            obj["btn_left"].funvalue = {
                "show": "account",
                "set_step": 1,
                "go_top": true
            };
            obj["btn_right"] = new Object;
            obj["btn_right"].show_msg = LS.get("step_" + paramData.act);
            obj["btn_right"].disabled = false;
            obj["btn_right"].fun = _self.saveEvent
        }
        parentClass.dispatchEvent("set_modal_step", obj)
    };
    _self.closeEvent = function() {
        parentClass.dispatchEvent("backPage", {
            "retFun": _self.backPageComplete
        })
    };
    _self.backPageComplete = function() {}
};
