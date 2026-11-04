function acc_sub_add(_win, _dom, paramObj) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var LS_account;
    var config_set;
    var _mc = new Object;
    var ctlObj = new Array;
    var titleObj = new Array;
    var cBoxObj = new Array;
    var pri_ary = new Array("A", "B", "B1", "B2", "C");
    var user_mlimit = 0;
    var isAll = "";
    var search_input_show = false;
    _self.init = function() {
        parentClass.dispatchEvent("chgPageName", {
            "pageType": "account",
            "pageName": "sub_add"
        });
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "account",
            "id": "Sub"
        });
        var obj = new Object;
        obj["Alert"] = {
            "msg": LS_account.get("str_unsave"),
            "mode": "Y"
        };
        obj["ifNo"] = _self.exitConfirmNo;
        parentClass.dispatchEvent("SetConfirmExit", obj);
        var _history_num = win._history.length;
        if (win._history[_history_num - 1].page == _self.constructor.name)
            win._history.splice(-1, 1);
        var obj_ids = ",div_all,step_account,step_manage,step_finish,accountNum,account_info,manage_info,finish_info,";
        obj_ids += "box_user,input_user,msg_user,btn_create_name,create_name_loading,";
        obj_ids += "box_alias,input_alias,msg_alias,";
        obj_ids += "box_passwd,input_passwd,msg_passwd,passwd_rule,";
        obj_ids += "eye_pwd,pwd_light,div_show_strong,complexity,strengthTxt,first_estimate,";
        obj_ids += "box_safe,input_safe,msg_safe,tt_safe,safe_checked,safe_rule,";
        obj_ids += "checkbox_text_A,checkbox_text_B,checkbox_text_B1,checkbox_text_B2,checkbox_text_C,";
        obj_ids += "A,B,B1,B2,C,";
        _mc = util.getObjAry(dom, obj_ids);
        ctlObj["user"] = new Object;
        ctlObj["user"].box = _mc["box_user"];
        ctlObj["user"].msg = _mc["msg_user"];
        ctlObj["user"].input = _mc["input_user"];
        ctlObj["alias"] = new Object;
        ctlObj["alias"].box = _mc["box_alias"];
        ctlObj["alias"].msg = _mc["msg_alias"];
        ctlObj["alias"].input = _mc["input_alias"];
        ctlObj["passwd"] = new Object;
        ctlObj["passwd"].box = _mc["box_passwd"];
        ctlObj["passwd"].msg = _mc["msg_passwd"];
        ctlObj["passwd"].input = _mc["input_passwd"];
        _mc["eye_pwd"].isShow = true;
        _mc["eye_pwd"].BlurPwdOFF = false;
        ctlObj["safe"] = new Object;
        ctlObj["safe"].box = _mc["box_safe"];
        ctlObj["safe"].msg = _mc["msg_safe"];
        ctlObj["safe"].input = _mc["input_safe"];
        util.ChkKeyUser(ctlObj["user"].input);
        util.addEvent(ctlObj["user"].input, "blur", _self.checkUserNameEvent, ctlObj["user"].input);
        util.addEvent(ctlObj["user"].input, "blur", _self.inputboxBlurEvent, ctlObj["user"], false);
        util.addEvent(ctlObj["user"].input, "focus", _self.inputboxFocusEvent, ctlObj["user"]);
        util.addEvent(_mc["btn_create_name"], "click", _self.create_random_name, {
            "doObj": ctlObj["user"].input,
            "create_num": 10
        });
        util.addEvent(_mc["btn_create_name"], "mousedown", _self.BlurUserOFF, _mc["btn_create_name"]);
        _mc["btn_create_name"].BlurUserOFF = false;
        util.ChkKeyAlias(ctlObj["alias"].input);
        util.addEvent(ctlObj["alias"].input, "blur", _self.checkNameEvent, ctlObj["alias"].input);
        util.addEvent(ctlObj["alias"].input, "blur", _self.inputboxBlurEvent, ctlObj["alias"], false);
        util.addEvent(ctlObj["alias"].input, "focus", _self.inputboxFocusEvent, ctlObj["alias"]);
        util.ChkKeyUser(ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "keyup", _self.checkThisPassword, ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "blur", _self.checkThisPassword, ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "blur", _self.inputboxBlurEvent, ctlObj["passwd"], false);
        util.addEvent(ctlObj["passwd"].input, "focus", _self.inputboxFocusEvent, ctlObj["passwd"]);
        util.addEvent(_mc["eye_pwd"], "click", _self.showPwd, _mc["eye_pwd"]);
        util.addEvent(_mc["eye_pwd"], "mousedown", _self.BlurPwdOFF, _mc["eye_pwd"]);
        _self.showPwd(null, _mc["eye_pwd"]);
        util.ChkKeyUser(ctlObj["safe"].input);
        util.addEvent(ctlObj["safe"].input, "keyup", _self.chkThisPwdSafe, ctlObj["safe"].input);
        util.addEvent(ctlObj["safe"].input, "blur", _self.chkThisPwdSafe, ctlObj["safe"].input);
        util.addEvent(ctlObj["safe"].input, "blur", _self.inputboxBlurEvent, ctlObj["safe"], false);
        util.addEvent(ctlObj["safe"].input, "focus", _self.inputboxFocusEvent, ctlObj["safe"]);
        var keys = top.login_layer == "ag" ? "listsub_safe_ag" : "listsub_safe";
        if (_mc["tt_safe"] != null)
            _mc["tt_safe"].innerHTML = LS.get(keys);
        var keys = top.login_layer == "ag" ? "4X011_ag" : "4X011";
        if (_mc["tt_safe"] != null)
            _mc["safe_rule"].innerHTML = LS_code.get(keys);
        if (top.login_layer == "ag")
            _mc["safe_rule"].classList.add("--noListStyle");
        var obj_ids = ",checkbox_text_total,total,total_accountNum,";
        obj_ids += "box_search,input_search,btn_delete,btn_search,";
        var tmpObj = util.getObjAry(_mc["manage_info"], obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        _mc["total"].checked = false;
        util.addEvent(_mc["total"], "click", _self.chkAll);
        util.addEvent(_mc["checkbox_text_total"], "click", function(e, _obj) {
            _obj.click()
        }, _mc["total"]);
        util.ChkKeyUser(_mc["input_search"]);
        util.addEvent(_mc["input_search"], "focus", _self.show_box_search, {
            "target": _mc["box_search"],
            "act": "add",
            "class_name": "focus"
        });
        util.addEvent(_mc["input_search"], "blur", _self.show_box_search, {
            "target": _mc["box_search"],
            "act": "remove",
            "class_name": "focus"
        });
        util.addEvent(_mc["input_search"], "keyup", _self.keyup_dsearch, {
            "target": _mc["input_search"],
            "clean_target": _mc["btn_delete"]
        });
        util.addEvent(_mc["input_search"], "keypress", _self.keyPressEvent, _mc["input_search"]);
        util.addEvent(_mc["btn_delete"], "click", _self.clean_search, {
            "target": _mc["btn_delete"],
            "target_txt": _mc["input_search"]
        });
        util.addEvent(_mc["btn_search"], "click", _self.click_btn_search, _mc["btn_search"]);
        var tip_GENERALDATAicon = document.getElementsByName("tip_GENERALDATAicon");
        var len = tip_GENERALDATAicon.length;
        for (var i = 0; i < len; i++) {
            var icon = tip_GENERALDATAicon[i];
            util.addEvent(icon, "click", _self.showIconMsg, {
                "_id": "account_popup_data"
            })
        }
        _self.initShow();
        _self.loadData();
        dom.getElementById("ma_content").scrollTop = 0;
        _self.show_info(null, {
            "show": "account",
            "set_step": 1
        });
        parentClass.dispatchEvent("show_modal_step", {
            "show_step": true
        });
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        });
        var obj_ids = ",show_alias,show_user,user_copyArea,btn_copy_user,";
        obj_ids += "btn_add_another,btn_go_list,";
        var tmpObj = util.getObjAry(_mc["finish_info"], obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        util.addEvent(_mc["btn_copy_user"], "click", _self.copyInput, "user");
        util.addEvent(_mc["btn_add_another"], "click", _self.goPage, "new");
        util.addEvent(_mc["btn_go_list"], "click", _self.goPage, "list")
    };
    _self.goPage = function(mouseEvent, go_type) {
        if (go_type == "new") {
            var obj = new Object;
            obj.page = "acc_sub_add";
            obj.postHash = paramObj;
            obj.LeaveChkPass = true;
            parentClass.dispatchEvent("bodyGoToPage", obj)
        } else if (go_type == "list") {
            var obj = new Object;
            obj.postHash = paramObj.back_param;
            obj.page = "acc_sub_list";
            obj.LeaveChkPass = true;
            parentClass.dispatchEvent("bodyGoToPage", obj)
        }
    };
    _self.exitConfirmNo = function() {
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "account",
            "id": "Sub"
        })
    };
    _self.saveEvent = function(mouseEvent, targetObj) {
        parentClass.dispatchEvent("showAlertMsg", {
            "_id": "modal_popup_createm"
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
            param = "p=body_subuser_modify&ver=" + top.ver + "&" + param;
            getHttp.loadURL(top.url, "POST", param)
        }
    };
    _self.saveFinish = function(data, targetObj) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        if (_status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg != null && error_msg != "")
                _self.show_Error(error_code, error_msg, arr_data);
            else
                util.chkErrorMsg(arr_data, LS_code)
        } else {
            user_information = arr_data.user_information;
            _mc["show_alias"].innerHTML = user_information.alias;
            _mc["show_user"].innerHTML = user_information.username;
            _mc["div_all"].className = "acc_sum";
            if (user_information.is_create)
                _mc["btn_add_another"].style.display = "";
            else
                _mc["btn_add_another"].style.display = "none";
            _self.show_info(null, {
                "show": "finish",
                "set_step": 0,
                "go_top": true
            });
            parentClass.dispatchEvent("show_modal_step", {
                "show_step": false
            });
            parentClass.dispatchEvent("chgPageName", {
                "pageType": "account",
                "pageName": "sub_add",
                "uniqText": _mc["show_user"].innerHTML
            });
            parentClass.dispatchEvent("CloseConfirmExit")
        }
        parentClass.dispatchEvent("hideAlertMsg", {})
    };
    _self.copyInput = function(e, do_url) {
        var showDiv = _mc["user_copyArea"];
        var tmp_copy = "";
        var user_url = user_information.addAgUser_url;
        if (do_url == "user" && user_url != "") {
            var user_url_ary = user_url.split("://");
            var tmp_user_url = "";
            if (user_url_ary[1] != "undefined")
                tmp_user_url = user_url_ary[1].replace(/\//g, "");
            tmp_copy = tmp_user_url + "<br>";
            tmp_copy += user_information.username
        }
        showDiv.innerHTML = tmp_copy;
        var range = dom.createRange();
        range.selectNode(showDiv);
        getSelection().removeAllRanges();
        getSelection().addRange(range);
        try {
            var successful = dom.execCommand("copy");
            var msg = successful ? "successful" : "fail"
        } catch (e) {}
        util.echo("copy :" + msg);
        if (msg == "successful")
            parentClass.dispatchEvent("showFadeOutMesg", {
                "text": LS.get("str_copied")
            });
        else
            util.echo("copy_fail")
    };
    _self.getSaveParam = function() {
        var set_pri_type = "";
        var set_manager_uid = "";
        for (var i = 0; i < pri_ary.length; i++)
            if (_mc[pri_ary[i]].checked) {
                if (set_pri_type != "")
                    set_pri_type += "-";
                set_pri_type += pri_ary[i]
            }
        if (_mc["total"].checked)
            set_manager_uid = "0";
        else
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked) {
                    if (set_manager_uid != "")
                        set_manager_uid += ",";
                    set_manager_uid += box.acc_id
                }
            }
        var par = "";
        par += "uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&action=add";
        par += "&levelid=" + top.layer_id;
        par += "&subid=";
        par += "&set_pri_type=" + set_pri_type;
        par += "&subname=" + ctlObj["user"].input.value;
        par += "&alias=" + ctlObj["alias"].input.value;
        par += "&passwords=" + ctlObj["passwd"].input.value;
        par += "&passwordssafe=" + ctlObj["safe"].input.value;
        par += "&set_manager_uid=" + set_manager_uid;
        par += "&langx=" + top.langx;
        if (top.login_layer == "ag")
            par += "&pay_type=" + top.pay_type;
        return par
    };
    _self.getParam = function() {
        var par = "";
        par += "uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&action=add";
        if (top.login_layer == "ag")
            par += "&pay_type=" + top.pay_type;
        par += "&lower_name=" + _self.getSearchName();
        par += "&langx=" + top.langx;
        return par
    };
    _self.loadData = function() {
        var getHttp = new HttpRequest;
        getHttp.addEventListener("LoadComplete", _self.loadFinish);
        var param = _self.getParam();
        param = "p=get_subuser_lower&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param)
    };
    _self.loadFinish = function(data) {
        var xmlObj = new Object;
        var arr_data = JSON.parse(data);
        if (arr_data.status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg != null && error_msg != "")
                _self.show_Error(error_code, error_msg, arr_data);
            else
                util.chkErrorMsg(arr_data, LS_code);
            return false
        }
        xmlObj["account"] = arr_data.account;
        user_mlimit = arr_data.user_mlimit * 1;
        isAll = arr_data.isAll;
        var bodyTemp = "";
        var outdata = "";
        var div_show = dom.getElementById("div_show");
        var xmp_header = dom.getElementById("xmp_header").innerHTML;
        var xmp_contant = dom.getElementById("xmp_contant").innerHTML;
        var safe_show = top.login_layer == "co" ? LS.get("listsub_safe") : LS.get("listsub_safe_ag");
        xmp_header = xmp_header.replace(/\*PSWDSF_SHOW\*/g, safe_show);
        if (_self.getSearchName() == "")
            _mc["total_accountNum"].innerHTML = xmlObj["account"].length;
        if (xmlObj["account"].length > 0) {
            for (var i = 0; i < xmlObj["account"].length; i++) {
                var contanttmp = xmp_contant;
                var obj = xmlObj["account"][i];
                contanttmp = contanttmp.replace(/\*ID\*/g, util.showTxt(obj["id"]));
                contanttmp = contanttmp.replace(/\*USERNAME\*/g, util.showTxt(obj["username"]));
                contanttmp = contanttmp.replace(/\*ALIAS\*/g, util.showTxt(obj["alias"]));
                contanttmp = contanttmp.replace(/\*LOGINID\*/g, util.showTxt(obj["loginid"]));
                bodyTemp += contanttmp
            }
            dom.getElementById("div_show_nodata").style.display = "none"
        } else {
            dom.getElementById("div_show_nodata").style.display = "";
            isAll = "checked"
        }
        outdata = xmp_header + bodyTemp;
        div_show.innerHTML = outdata;
        _self.initEvent(xmlObj["account"], div_show)
    };
    _self.checkCbox = function() {
        var mAccount = 0;
        for (var keys in cBoxObj) {
            var box = cBoxObj[keys];
            if (box.checked)
                mAccount++
        }
        return mAccount
    };
    _self.chkAll = function(mouseEvent, targetObj) {
        var set_check_status = _mc["total"].checked;
        var account = 0;
        for (var keys in cBoxObj) {
            var box = cBoxObj[keys];
            box.checked = set_check_status;
            if (set_check_status)
                account++
        }
        _mc["accountNum"].innerHTML = account
    };
    _self.initEvent = function(accounts, div_show) {
        for (var i = 0; i < accounts.length; i++) {
            var cbox = dom.getElementById("cbox_" + accounts[i].id);
            if (cBoxObj[accounts[i].id] == null)
                cbox.checked = accounts[i].isChk;
            else {
                cbox.checked = cBoxObj[accounts[i].id].checked;
                util.removeEvent(cBoxObj[accounts[i].id], "change")
            }
            cbox.acc_id = accounts[i].id;
            cBoxObj[accounts[i].id] = cbox;
            util.addEvent(cbox, "change", _self.cboxEvent, cbox)
        }
        if (isAll == "checked")
            _mc["total"].checked = true
    };
    _self.cboxEvent = function(mouseEvent, targetObj) {
        _mc["total"].checked = false;
        var account = _self.checkCbox();
        if (account > user_mlimit) {
            var msg = LS.get("sub_mlimit") + user_mlimit + LS.get("sub_mlimit2");
            parentClass.dispatchEvent("showAlertMsg", {
                "msg": msg
            });
            targetObj.checked = "";
            account = _self.checkCbox()
        }
        _mc["accountNum"].innerHTML = account
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
    _self.checkUserNameEvent = function(e, targetObj) {
        if (e.type == "blur" && _mc["btn_create_name"].BlurUserOFF) {
            _mc["btn_create_name"].BlurUserOFF = false;
            return
        }
        if (targetObj.value != "") {
            if (!util.checkFormat(targetObj.value, 0)) {
                _self.showErrorCtl("user", LS.get("username_err"));
                return false
            }
            var getHttp = new HttpRequest;
            var param = _self.getCheckParam(targetObj.value);
            param += "&upper_layer=co";
            param += "&upper_id=" + top.layer_id;
            getHttp.addEventListener("LoadComplete", _self.loadCheckFinish);
            param = "p=chk_username&ver=" + top.ver + "&" + param;
            getHttp.loadURL(top.url, "POST", param)
        } else {
            ctlObj["user"].msg.innerHTML = LS.get("empty_user");
            _self.setBoxClass(ctlObj["user"].box, "--err", "add")
        }
    };
    _self.checkNameEvent = function(e, targetObj) {
        if (targetObj.value == "") {
            ctlObj["alias"].msg.innerHTML = LS.get("empty_alias");
            _self.setBoxClass(ctlObj["alias"].box, "--err", "add")
        }
    };
    _self.loadCheckFinish = function(data) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        var code = util.showTxt(arr_data.code);
        var msg = util.showTxt(arr_data.msg);
        if (_status == "error")
            if (msg != null && msg != "") {
                ctlObj[code].input.value = "";
                _self.showErrorCtl(code, msg)
            } else
                util.chkErrorMsg(arr_data, LS_code);
        else if (_status == "no_use")
            ctlObj[code].msg.innerHTML = msg
    };
    _self.getCheckParam = function(username) {
        var par = "";
        par += "&uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&view_layer=" + top.login_layer;
        par += "&username=" + username;
        par += "&langx=" + top.langx;
        return par
    };
    _self.chkThisPwdSafe = function(keyEvent, targetObj) {
        _mc["safe_checked"].style.display = "none";
        if (ctlObj["safe"].input.value == "" && keyEvent.type == "blur")
            _self.showErrorCtl("safe", LS.get("empty_user"));
        else {
            if (top.login_layer == "ag") {
                var res = util.str_chk_mem(ctlObj["safe"].input.value, 2);
                if (res == "err_charactersNum" || res == "err_block_string")
                    res = "chk_OK"
            } else
                var res = util.str_chk(ctlObj["safe"].input.value);
            if (res != "chk_OK")
                _self.strchk_Msg_safe(res, top.login_layer);
            else {
                var str = ctlObj["safe"].input.value;
                if (str == ctlObj["user"].input.value || str == ctlObj["passwd"].input.value) {
                    if (top.login_layer == "ag")
                        _self.showErrorPwd_safe("safe", LS_code.get("4X015_ag"));
                    else
                        _self.showErrorPwd_safe("safe", LS_code.get("4X015"));
                    return false
                }
                if (top.login_layer == "ag" && keyEvent.type == "blur")
                    _self.chkpwfEvent(keyEvent, targetObj);
                else {
                    _self.setBoxClass(ctlObj["safe"].box, "--err", "");
                    _self.setBoxClass(_mc["safe_rule"], "word_midRed", "");
                    ctlObj["safe"].msg.innerHTML = ""
                }
            }
        }
    };
    _self.chkpwfEvent = function(e, targetObj) {
        if (targetObj.value != "") {
            var getHttp = new HttpRequest;
            var param = _self.pwfChkParam(targetObj.value);
            getHttp.addEventListener("LoadComplete", _self.pwfChkFinish);
            param = "p=chk_username&langx=" + top.langx + "&ver=" + top.ver + "&" + param;
            getHttp.loadURL(top.url, "POST", param)
        } else {
            ctlObj["safe"].msg.innerHTML = LS.get("empty_user");
            _self.setBoxClass(ctlObj["safe"].box, "--err", "add")
        }
    };
    _self.pwfChkFinish = function(data) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        var code = util.showTxt(arr_data.code);
        var msg = util.showTxt(arr_data.msg);
        if (_status == "error")
            if (msg != null && msg != "") {
                ctlObj[code].input.focus();
                _self.showErrorPwd_safe(code, msg)
            } else
                util.chkErrorMsg(arr_data, LS_code);
        else if (_status == "no_use") {
            ctlObj[code].msg.innerHTML = msg;
            _mc["safe_checked"].style.display = ""
        }
    };
    _self.pwfChkParam = function(passwordssafe) {
        var par = "";
        par += "&uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&view_layer=" + top.login_layer;
        par += "&passwordssafe=" + passwordssafe;
        return par
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
            _self.setBoxClass(_obj.box, error_class, "add");
            _self.show_info(null, {
                "show": "account",
                "set_step": 1
            })
        }
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
    _self.showErrorPwd = function(code, msg) {
        var obj = ctlObj[code];
        if (obj != null) {
            _self.setBoxClass(ctlObj["passwd"].box, "--err", "add");
            if (msg == "4X021") {
                _self.setBoxClass(_mc["passwd_rule"], "word_midRed", "add");
                ctlObj[code].msg.innerHTML = ""
            } else {
                _self.setBoxClass(_mc["passwd_rule"], "word_midRed", "");
                ctlObj[code].msg.innerHTML = msg
            }
            _self.show_info(null, {
                "show": "account",
                "set_step": 1
            })
        }
    };
    _self.show_Error = function(code, msg, arr_data) {
        var tmp = code.split("|");
        if (tmp[0] == "errormsg")
            _self.showErrorMsg(tmp[1], msg);
        else if (tmp[0] == "ctl") {
            _self.showErrorCtl(tmp[1], msg);
            _self.goTarget_scrollTop(ctlObj[tmp[1]].box)
        } else if (msg != null && msg != "") {
            _self.closeEvent(null, _mc["btn_save"]);
            parentClass.dispatchEvent("showAlertMsg", arr_data)
        } else
            util.chkErrorMsg(arr_data, LS_code)
    };
    _self.showErrorMsg = function(code, msg) {
        if (code == "clean_db") {
            var obj = new Object;
            obj.msg = msg;
            obj.backPage = "account";
            parentClass.dispatchEvent("showAlertMsg", obj)
        }
    };
    _self.submitCheck = function() {
        _self.initShow();
        for (var key in ctlObj)
            if (ctlObj[key].input.value == "") {
                _self.showErrorCtl(key, LS.get("empty_" + key));
                _self.goTarget_scrollTop(ctlObj[key].box);
                parentClass.dispatchEvent("hideAlertMsg", {});
                return false
            }
        if (!util.checkFormat(ctlObj["user"].input.value, 0)) {
            _self.showErrorCtl("user", LS.get("username_err"));
            _self.goTarget_scrollTop(ctlObj["user"].box);
            parentClass.dispatchEvent("hideAlertMsg", {});
            return false
        }
        if (!util.checkFormat(ctlObj["alias"].input.value, 3)) {
            _self.showErrorCtl("alias", LS.get("alias_no_SPChar"));
            _self.goTarget_scrollTop(ctlObj["alias"].box);
            parentClass.dispatchEvent("hideAlertMsg", {});
            return false
        }
        if (ctlObj["user"].input.value.length < 4) {
            _self.showErrorCtl("user", LS.get("user_limit"));
            _self.goTarget_scrollTop(ctlObj["user"].box);
            parentClass.dispatchEvent("hideAlertMsg", {});
            return false
        }
        if (!util.checkFormat(ctlObj["passwd"].input.value, 0)) {
            _self.showErrorCtl("passwd", LS.get("empty_passwd"));
            _self.goTarget_scrollTop(ctlObj["passwd"].box);
            parentClass.dispatchEvent("hideAlertMsg", {});
            return false
        }
        if (!_self.str_chk(ctlObj["passwd"].input.value)) {
            _self.goTarget_scrollTop(ctlObj["passwd"].box);
            parentClass.dispatchEvent("hideAlertMsg", {});
            return false
        }
        if (top.login_layer == "ag") {
            var res = util.str_chk_mem(ctlObj["safe"].input.value, 2);
            if (res == "err_charactersNum" || res == "err_block_string")
                res = "chk_OK"
        } else
            var res = util.str_chk(ctlObj["safe"].input.value);
        if (res != "chk_OK") {
            _self.strchk_Msg_safe(res, top.login_layer);
            _self.goTarget_scrollTop(ctlObj["safe"].box);
            parentClass.dispatchEvent("hideAlertMsg", {});
            return false
        }
        if (!_mc["total"].checked) {
            var nums = 0;
            var msg = "";
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked)
                    nums++
            }
            if (nums == 0)
                msg = LS.get("user_manage");
            else if (nums > user_mlimit)
                msg = LS.get("sub_mlimit") + user_mlimit + LS.get("sub_mlimit2");
            if (msg != "") {
                _self.show_info(null, {
                    "show": "manage",
                    "set_step": 2
                });
                parentClass.dispatchEvent("showAlertMsg", {
                    "msg": msg
                });
                _self.goTarget_scrollTop(_mc["manage_info"]);
                return false
            }
        }
        return true
    };
    _self.goTarget_scrollTop = function(target) {
        if (target) {
            var window_height = dom.getElementById("ma_content").clientHeight;
            dom.getElementById("ma_content").scrollTop = target.offsetTop - window_height / 2 * 2 / 3
        }
    };
    _self.initShow = function() {
        for (var i = 0; i < pri_ary.length; i++) {
            if (pri_ary[i] == "B1" || pri_ary[i] == "B2")
                if (!_mc["B"].checked) {
                    _mc[pri_ary[i]].disabled = true;
                    _mc["checkbox_text_" + pri_ary[i]].classList.add("--disabled")
                }
            if (pri_ary[i] == "B")
                util.addEvent(_mc[pri_ary[i]], "click", _self.showSubpri, {
                    type: pri_ary[i],
                    se: ["1", "2"]
                });
            util.addEvent(_mc["checkbox_text_" + pri_ary[i]], "click", function(e, _obj) {
                if (e.target.nodeName == "SPAN")
                    return;
                _obj.click()
            }, _mc[pri_ary[i]])
        }
    };
    _self.checkThisPassword = function(keyEvent, targetObj) {
        if (keyEvent.type == "blur" && _mc["eye_pwd"].BlurPwdOFF) {
            _mc["eye_pwd"].BlurPwdOFF = false;
            return
        }
        if (keyEvent.type == "blur" && ctlObj["passwd"].input.value == "") {
            _self.showErrorCtl("passwd", LS.get("empty_passwd"));
            return
        }
        _mc["strengthTxt"].style.display = "";
        var password = _mc["input_passwd"].value;
        var checked = zxcvbn(password);
        var timetocrack = checked.crack_time;
        var strength = checked.score;
        var timeinwords = _self.toWords(timetocrack);
        _mc["first_estimate"].innerHTML = timeinwords;
        if (password == "") {
            _mc["strengthTxt"].style.display = "none";
            strength = 5;
            _mc["div_show_strong"].classList.add("hide_item")
        } else if (_mc["div_show_strong"].classList.contains("hide_item"))
            _mc["div_show_strong"].classList.remove("hide_item");
        _self.displayStrength(strength);
        _self.str_chk(ctlObj["passwd"].input.value)
    };
    _self.displayStrength = function(c) {
        var arr_use_word = Array("pwd_Very Weak", "pwd_Weak", "pwd_Fair", "pwd_Good", "pwd_Strong", "");
        var use_word = typeof arr_use_word[c] != "undefined" ? arr_use_word[c] : "pwd_Very Weak";
        f = use_word != "" ? LS.get(use_word) : "";
        for (var i = 0; i <= 5; i++)
            if (_mc["div_show_strong"].classList.contains("lv" + i))
                _mc["div_show_strong"].classList.remove("lv" + i);
        var show_lv = c + 1;
        if (show_lv <= 5)
            _mc["div_show_strong"].classList.add("lv" + show_lv);
        _mc["complexity"].innerHTML = f
    };
    _self.toWords = function(number) {
        if (number < 120)
            return _self.getNumberWords(number, true) + " " + LS.get("pwd_break_Seconds");
        var hour = 60 * 60;
        if (number < hour) {
            minutes = number / 60;
            return _self.getNumberWords(minutes, true) + " " + LS.get("pwd_break_Minutes")
        }
        var day = hour * 24;
        if (number < 2 * day) {
            hours = number / hour;
            return _self.getNumberWords(hours) + " " + LS.get("pwd_break_Hours")
        }
        var month = day * 30;
        if (number < month) {
            days = number / day;
            return _self.getNumberWords(days) + " " + LS.get("pwd_break_Days")
        }
        var year = day * 365;
        if (number < year) {
            months = number / month;
            return _self.getNumberWords(months) + " " + LS.get("pwd_break_Months")
        }
        var century = year * 100;
        if (number < century * 10) {
            years = number / year;
            return _self.getNumberWords(years) + " " + LS.get("pwd_break_Years")
        }
        if (number < century * 100) {
            centuries = number / century;
            return _self.getNumberWords(centuries) + " " + LS.get("pwd_break_Centuries")
        }
        years = number / year;
        return _self.getNumberWords(years) + " " + LS.get("pwd_break_Years")
    };
    _self.getNumberWords = function(number, twoDP) {
        var numberWords = "";
        var trillion = Math.pow(10, 12);
        var billion = Math.pow(10, 9);
        var hundred_million = Math.pow(10, 8);
        var million = Math.pow(10, 6);
        var ten_thousand = Math.pow(10, 4);
        var thousand = Math.pow(10, 3);
        var hundred = Math.pow(10, 2);
        if (top.langx == "en-us")
            if (number / trillion >= 1) {
                numberWords = "TRILLION";
                number = number / trillion
            } else if (number / billion >= 1) {
            numberWords = "BILLION";
            number = number / billion
        } else if (number / million >= 1) {
            numberWords = "MILLION";
            number = number / million
        } else if (number / thousand >= 1) {
            numberWords = "THOUSAND";
            number = number / thousand
        } else {
            if (number / hundred >= 1) {
                numberWords = "HUNDRED";
                number = number / hundred
            }
        } else if (top.langx == "zh-tw" || top.langx == "zh-cn")
            if (number / trillion >= 1) {
                numberWords = LS.get("pwd_TRILLION");
                number = number / trillion
            } else if (number / hundred_million >= 1) {
            numberWords = LS.get("pwd_100_MILLION");
            number = number / hundred_million
        } else if (number / ten_thousand >= 1) {
            numberWords = LS.get("pwd_10_THOUSAND");
            number = number / ten_thousand
        } else if (number / thousand >= 1) {
            numberWords = LS.get("pwd_THOUSAND");
            number = number / thousand
        } else if (number / hundred >= 1) {
            numberWords = LS.get("pwd_HUNDRED");
            number = number / hundred
        }
        if (twoDP)
            decimalPoint = 100;
        else
            decimalPoint = 1;
        number = Math.round(number * decimalPoint) / decimalPoint;
        numberWords = number + numberWords;
        return numberWords
    };
    _self.str_chk = function(str) {
        if (str != "" && (str == ctlObj["user"].input.value || str == ctlObj["safe"].input.value)) {
            _self.showErrorPwd("passwd", LS_code.get("4X022"));
            return false
        }
        var res = util.str_chk(str);
        if (res != "chk_OK") {
            _self.strchk_Msg(res);
            return false
        } else {
            _self.setBoxClass(ctlObj["passwd"].box, "--err", "");
            _self.setBoxClass(_mc["passwd_rule"], "word_midRed", "");
            ctlObj["passwd"].msg.innerHTML = "";
            return true
        }
    };
    _self.strchk_Msg = function(str) {
        if (str == "err_combination")
            _self.showErrorPwd("passwd", "4X021");
        else if (str == "err_length")
            _self.showErrorPwd("passwd", "4X021");
        else if (str == "err_contain")
            _self.showErrorPwd("passwd", "4X021");
        else if (str == "err_charactersNum")
            _self.showErrorPwd("passwd", LS_code.get("4X040"));
        else if (str == "err_block_string")
            _self.showErrorPwd("passwd", LS_code.get("4X040"));
        else
            _self.showErrorPwd("passwd", "4X021")
    };
    _self.strchk_Msg_safe = function(str, login_layer) {
        if (str == "err_combination")
            _self.showErrorPwd_safe("safe", login_layer == "ag" ? "4X011_ag" : "4X011");
        else if (str == "err_length")
            _self.showErrorPwd_safe("safe", login_layer == "ag" ? "4X011_ag" : "4X011");
        else if (str == "err_contain")
            _self.showErrorPwd_safe("safe", login_layer == "ag" ? "4X011_ag" : "4X011");
        else if (str == "err_charactersNum")
            _self.showErrorPwd_safe("safe", LS_code.get("4X041"));
        else if (str == "err_block_string")
            _self.showErrorPwd_safe("safe", LS_code.get("4X041"));
        else
            _self.showErrorPwd_safe("safe", login_layer == "ag" ? "4X011_ag" : "4X011")
    };
    _self.showErrorPwd_safe = function(code, msg) {
        var obj = ctlObj[code];
        if (obj != null) {
            _self.setBoxClass(ctlObj["safe"].box, "--err", "add");
            if (msg == "4X011" || msg == "4X011_ag") {
                _self.setBoxClass(_mc["safe_rule"], "word_midRed", "add");
                ctlObj[code].msg.innerHTML = ""
            } else {
                _self.setBoxClass(_mc["safe_rule"], "word_midRed", "");
                ctlObj[code].msg.innerHTML = msg
            }
            _self.show_info(null, {
                "show": "account",
                "set_step": 1
            })
        }
    };
    _self.showPwd = function(mouseEvent, targetObj) {
        if (!targetObj.isShow) {
            ctlObj["passwd"].input.setAttribute("type", "text");
            targetObj.className = "icon_pw_visible";
            targetObj.isShow = true
        } else {
            ctlObj["passwd"].input.setAttribute("type", "password");
            targetObj.className = "icon_pw_hidden";
            targetObj.isShow = false
        }
        if (mouseEvent != null)
            _mc["input_passwd"].focus()
    };
    _self.BlurPwdOFF = function(mouseEvent, targetObj) {
        _mc["eye_pwd"].BlurPwdOFF = true
    };
    _self.showIconMsg = function(mouseEvent, par) {
        parentClass.dispatchEvent("showAlertMsg", par);
        dom.getElementById(par._id).children[0].focus()
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
    _self.showSubpri = function(e, param) {
        for (var i = 0; i < param.se.length; i++) {
            var tmp_id = param.type + param.se[i];
            if (e.target.checked) {
                _mc[tmp_id].removeAttribute("disabled");
                _mc["checkbox_text_" + tmp_id].classList.remove("--disabled")
            } else {
                _mc[tmp_id].checked = false;
                _mc[tmp_id].setAttribute("disabled", "disabled");
                _mc["checkbox_text_" + tmp_id].classList.add("--disabled")
            }
        }
    };
    _self.show_info = function(e, param) {
        var div_body_show = dom.getElementById("body_show");
        if (div_body_show.classList.contains("bgf0f0f0"))
            div_body_show.classList.remove("bgf0f0f0");
        var arr_step = Array("account", "manage", "finish");
        var front_show = true;
        for (var key in arr_step) {
            var tmp_step_Obj = _mc["step_" + arr_step[key]];
            var tmp_info_Obj = _mc[arr_step[key] + "_info"];
            if (arr_step[key] == param.show) {
                if (tmp_step_Obj.classList.contains("--ok"))
                    tmp_step_Obj.classList.remove("--ok");
                tmp_step_Obj.classList.add("--on");
                front_show = false;
                tmp_info_Obj.style.display = "";
                if (param.show == "account")
                    div_body_show.classList.add("bgf0f0f0")
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
            obj["btn_left"].funvalue = "cancel";
            obj["btn_right"] = new Object;
            obj["btn_right"].show_msg = LS.get("step_next");
            obj["btn_right"].disabled = false;
            obj["btn_right"].fun = _self.show_info;
            obj["btn_right"].funvalue = {
                "show": "manage",
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
            obj["btn_right"].show_msg = LS.get("step_createm");
            obj["btn_right"].disabled = false;
            obj["btn_right"].fun = _self.saveEvent
        }
        parentClass.dispatchEvent("set_modal_step", obj)
    };
    _self.closeEvent = function(e) {
        var obj = new Object;
        obj.postHash = paramObj.back_param;
        obj.page = paramObj.back_page;
        if (e == "save")
            obj.LeaveChkPass = true;
        parentClass.dispatchEvent("bodyGoToPage", obj)
    };
    _self.inputboxFocusEvent = function(e, target) {
        _self.clearErrorStatusCtl(null, target);
        _self.setBoxClass(target.box, "--on", "add")
    };
    _self.inputboxBlurEvent = function(e, target) {
        if (!target.box.classList.contains("--err"))
            _self.setBoxClass(target.box, "--on", "")
    };
    _self.create_random_name = function(mouseEvent, param) {
        var create_name = "";
        var arr_base = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        var total_base_num = arr_base.length;
        var create_num = param["create_num"];
        var doObj = param["doObj"];
        for (var i = 0; i < create_num; i++)
            create_name += arr_base[getRandom(total_base_num)];
        doObj.value = create_name;
        doObj.focus();
        _mc["btn_create_name"].BlurUserOFF = false
    };

    function getRandom(x) {
        return Math.floor(Math.random() * x)
    }
    _self.BlurUserOFF = function(mouseEvent, targetObj) {
        _mc["btn_create_name"].BlurUserOFF = true
    };
    _self.show_box_search = function(e, param) {
        var use_target = param.target;
        if (use_target)
            if (param.act == "add")
                use_target.classList.add(param.class_name);
            else if (param.act == "remove")
            use_target.classList.remove(param.class_name)
    };
    _self.getSearchName = function(e) {
        var str_out = "";
        if (_mc["input_search"] != null)
            str_out = _mc["input_search"].value;
        else
            str_out = "";
        return str_out
    };
    _self.keyup_dsearch = function(e, param) {
        var use_target = param.target;
        if (use_target)
            if (use_target.value.length > 0) {
                if (param.clean_target)
                    param.clean_target.style.display = ""
            } else if (param.clean_target)
            param.clean_target.style.display = "none"
    };
    _self.keyPressEvent = function(keyEvent, targetObj) {
        var keyCode = util.getKeyCode();
        if (keyCode == 13)
            _self.click_btn_search()
    };
    _self.clean_search = function(e, param) {
        if (param.target_txt)
            param.target_txt.value = "";
        if (param.target)
            param.target.style.display = "none";
        _self.loadData()
    };
    _self.click_btn_search = function() {
        if (getView().viewportwidth >= 1024)
            _self.loadData();
        else if (search_input_show)
            if (_self.getSearchName() != "")
                _self.loadData();
            else {
                _mc["box_search"].classList.remove("search_on");
                search_input_show = false
            }
        else {
            _mc["box_search"].classList.add("search_on");
            search_input_show = true
        }
    }
};
