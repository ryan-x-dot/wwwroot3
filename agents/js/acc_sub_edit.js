function acc_sub_edit(_win, _dom, _paramObj) {
    var _self = this;
    var level = "sub";
    var win = _win;
    var dom = _dom;
    var paramObj = _paramObj;
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
    var isAll = "";
    var old_manager_uid = "";
    var user_mlimit = "";
    var init_done = false;
    var ObjEventlog;
    var search_input_show = false;
    _self.init = function() {
        parentClass.dispatchEvent("chgPageName", {
            "pageType": "account",
            "uniqText": paramObj.username
        });
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "account",
            "id": "Sub"
        });
        _self.InitSetConfirmExit();
        var obj_ids = ",scroll_div,acc_edit_offset,commis_title_scroll,";
        _mc = util.getObjAry(dom, obj_ids);
        util.addEvent(_mc["commis_title_scroll"], "scroll", _self.roll, {
            "chk_obj": _mc["commis_title_scroll"],
            "do_obj": _mc["acc_edit_offset"]
        });
        var obj_ids = ",div_acc_detail,div_acc_manage,div_acc_eventlog,";
        obj_ids += "user_code,";
        obj_ids += "box_alias,input_alias,msg_alias,";
        obj_ids += "btn_pwd,";
        obj_ids += "input_psw_recovery,psw_recovery_text,";
        obj_ids += "box_safe,input_safe,msg_safe,div_safe,safe_checked,";
        obj_ids += "create_date,";
        obj_ids += "A,B,B1,B2,C,";
        obj_ids += "checkbox_text_A,checkbox_text_B,checkbox_text_B1,checkbox_text_B2,checkbox_text_C,";
        obj_ids += "pop_pwd,pop_psw_close,pwd_cancel_btn,pwd_save_btn,";
        obj_ids += "box_passwd,input_passwd,msg_passwd,passwd_rule,";
        obj_ids += "eye_pwd,div_show_strong,pwd_light,complexity,strengthTxt,first_estimate,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        ctlObj["alias"] = new Object;
        ctlObj["alias"].box = _mc["box_alias"];
        ctlObj["alias"].input = _mc["input_alias"];
        ctlObj["alias"].msg = _mc["msg_alias"];
        ctlObj["safe"] = new Object;
        ctlObj["safe"].box = _mc["box_safe"];
        ctlObj["safe"].input = _mc["input_safe"];
        ctlObj["safe"].msg = _mc["msg_safe"];
        ctlObj["passwd"] = new Object;
        ctlObj["passwd"].box = _mc["box_passwd"];
        ctlObj["passwd"].msg = _mc["msg_passwd"];
        ctlObj["passwd"].input = _mc["input_passwd"];
        _mc["eye_pwd"].isShow = true;
        _mc["eye_pwd"].BlurPwdOFF = false;
        var obj_ids = ",acc_detail,acc_manage,acc_eventlog,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for (var objid in tmpObj) {
            tmpObj[objid].map = "div_" + objid;
            titleObj[objid] = tmpObj[objid];
            util.addEvent(tmpObj[objid], "click", _self.titleChg, tmpObj[objid])
        }
        var keys = top.login_layer == "ag" ? "listsub_safe_ag" : "listsub_safe";
        if (_mc["div_safe"] != null)
            _mc["div_safe"].innerHTML = LS.get(keys);
        util.ChkKeyAlias(ctlObj["alias"].input);
        util.addEvent(ctlObj["alias"].input, "blur", _self.checkNameEvent, ctlObj["alias"].input);
        util.addEvent(ctlObj["alias"].input, "blur", _self.inputboxBlurEvent, ctlObj["alias"], false);
        util.addEvent(ctlObj["alias"].input, "focus", _self.inputboxFocusEvent, ctlObj["alias"]);
        util.ChkKeyUser(ctlObj["safe"].input);
        util.addEvent(ctlObj["safe"].input, "keyup", _self.chkThisPwdSafe, ctlObj["safe"].input);
        util.addEvent(ctlObj["safe"].input, "blur", _self.chkThisPwdSafe, ctlObj["safe"].input);
        util.addEvent(ctlObj["safe"].input, "blur", _self.inputboxBlurEvent, ctlObj["safe"], false);
        util.addEvent(ctlObj["safe"].input, "focus", _self.inputboxFocusEvent, ctlObj["safe"]);
        util.addEvent(_mc["btn_pwd"], "click", _self.showResetPsw, {
            "isShow": true
        });
        util.addEvent(_mc["pwd_cancel_btn"], "click", _self.showResetPsw, {
            "isShow": false
        });
        util.addEvent(_mc["pop_psw_close"], "click", _self.showResetPsw, {
            "isShow": false
        });
        util.addEvent(_mc["pwd_save_btn"], "click", _self.upd_passwd);
        var pop_psw_area = _mc["pop_pwd"].children[0];
        util.addEvent(_mc["pop_pwd"], "click", _self.closePopEvent, {
            "target": pop_psw_area
        });
        util.addEvent(_mc["eye_pwd"], "click", _self.showPwd, _mc["eye_pwd"]);
        util.addEvent(_mc["eye_pwd"], "mousedown", _self.BlurPwdOFF, _mc["eye_pwd"]);
        _self.showPwd(null, _mc["eye_pwd"]);
        util.ChkKeyUser(ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "keyup", _self.checkThisPassword, ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "blur", _self.checkThisPassword, ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "blur", _self.inputboxBlurEvent, ctlObj["passwd"], false);
        util.addEvent(ctlObj["passwd"].input, "focus", _self.inputboxFocusEvent, ctlObj["passwd"]);
        util.addEvent(_mc["input_psw_recovery"], "click", _self.chg_mail_status, _mc["input_psw_recovery"]);
        var obj_ids = ",accountNum,total,checkbox_text_total,total_accountNum,";
        obj_ids += "box_search,input_search,btn_delete,btn_search,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        _mc["total"].checked = false;
        util.addEvent(_mc["checkbox_text_total"], "click", function(e, _obj) {
            _obj.click()
        }, _mc["total"]);
        _self.initShow();
        _self.loadData();
        _self.titleChg(null, _mc["acc_detail"])
    };
    _self.closeEvent = function(e) {
        var obj = new Object;
        obj.page = paramObj.back_page;
        if (e == "save")
            obj.LeaveChkPass = true;
        parentClass.dispatchEvent("bodyGoToPage", obj)
    };
    _self.initShow = function() {
        _mc["user_code"].innerHTML = paramObj.username;
        _mc["create_date"].innerHTML = paramObj.adddate.replace(/\-/g, "/");
        ctlObj["alias"].input.value = paramObj.alias;
        ctlObj["safe"].input.value = paramObj.passwd_safe;
        for (var i = 0; i < pri_ary.length; i++) {
            if (paramObj.pri.search(pri_ary[i]) != -1)
                _mc[pri_ary[i]].checked = "checked";
            else {
                _mc[pri_ary[i]].checked = "";
                if (pri_ary[i] == "B")
                    _self.showSubpri({
                        target: _mc[pri_ary[i]]
                    }, {
                        type: pri_ary[i],
                        se: ["1", "2"]
                    })
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
        var parObj = new Object;
        var paramHash = new Object;
        paramHash["edit_id"] = paramObj.id;
        paramHash["edit_username"] = paramObj.username;
        paramHash["user_id"] = paramObj.id;
        paramHash["edit_layer"] = top.login_layer;
        paramHash["pay_type"] = paramObj.pay_type;
        paramHash["edit_type"] = paramObj.user_type;
        paramHash["disableScrollEvent"] = true;
        parObj["target"] = "div_acc_eventlog";
        parObj["useDefineParent"] = "Y";
        parObj["postHash"] = paramHash;
        parObj["isTrams"] = "Y";
        parObj["page"] = "acc_eventlog";
        parObj["retChild"] = _self.getChild;
        parentClass.dispatchEvent("goToPage", parObj)
    };
    _self.getChild = function(childObj) {
        ObjEventlog = childObj
    };
    _self.loadData = function() {
        var getHttp = new HttpRequest;
        getHttp.addEventListener("LoadComplete", _self.loadFinish);
        var param = _self.getParam();
        param = "p=get_subuser_lower&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param)
    };
    _self.getParam = function() {
        var par = "";
        par += "uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&subid=" + paramObj.id;
        par += "&pay_type=" + paramObj.pay_type;
        par += "&lower_name=" + _self.getSearchName();
        return par
    };
    _self.loadFinish = function(data) {
        var xmlObj = new Object;
        var arr_data = JSON.parse(data);
        if (arr_data.status == "error") {
            if (arr_data.msg == null || arr_data.msg == "") {
                util.chkErrorMsg(arr_data, LS_code);
                return false
            }
            parentClass.dispatchEvent("showAlertMsg", arr_data);
            return
        }
        if (!init_done) {
            _mc["input_psw_recovery"].checked = arr_data.pmo_enabled != "S" ? true : false;
            _mc["input_psw_recovery"].keep = _mc["input_psw_recovery"].checked;
            _self.chg_mail_status()
        }
        xmlObj["account"] = arr_data.account;
        user_mlimit = arr_data.user_mlimit * 1;
        isAll = arr_data.isAll;
        var bodyTemp = "";
        var outdata = "";
        var div_show = dom.getElementById("div_show");
        var xmp_headerSub = dom.getElementById("xmp_headerSub").innerHTML;
        var xmp_contantSub = dom.getElementById("xmp_contantSub").innerHTML;
        var safe_show = top.login_layer == "co" ? LS.get("listsub_safe") : LS.get("listsub_safe_ag");
        xmp_headerSub = xmp_headerSub.replace(/\*PSWDSF_SHOW\*/g, safe_show);
        if (_self.getSearchName() == "")
            _mc["total_accountNum"].innerHTML = xmlObj["account"].length;
        if (xmlObj["account"].length > 0) {
            for (var i = 0; i < xmlObj["account"].length; i++) {
                var contanttmp = xmp_contantSub;
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
        outdata = xmp_headerSub + bodyTemp;
        div_show.innerHTML = outdata;
        _self.initEvent(xmlObj["account"], div_show);
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        })
    };
    _self.initEvent = function(accounts, div_show) {
        var account_Sel = 0;
        for (var i = 0; i < accounts.length; i++) {
            var cbox = dom.getElementById("cbox_" + accounts[i].id);
            if (cBoxObj[accounts[i].id] == null) {
                cbox.checked = accounts[i].isChk;
                if (!init_done && accounts[i].isChk == "checked") {
                    old_manager_uid += accounts[i].id + ",";
                    account_Sel++
                }
            } else {
                cbox.checked = cBoxObj[accounts[i].id].checked;
                util.removeEvent(cBoxObj[accounts[i].id], "change")
            }
            cbox.acc_id = accounts[i].id;
            cBoxObj[accounts[i].id] = cbox;
            util.addEvent(cbox, "change", _self.cboxEvent, cbox)
        }
        if (!init_done) {
            _mc["accountNum"].innerHTML = account_Sel;
            util.addEvent(_mc["total"], "click", _self.chkAll, _mc["total"]);
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
            _self.ShowAndHidden(null, _mc["acc_detail"]);
            old_manager_uid = old_manager_uid.substr(0, old_manager_uid.length - 1);
            if (isAll == "checked") {
                _mc["total"].checked = true;
                old_manager_uid = "0"
            }
        }
        init_done = true
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
    _self.showResetPsw = function(mouseEvent, par) {
        _mc["pop_pwd"].style.display = par.isShow ? "" : "none";
        if (par.isShow) {
            dom.getElementById("body_show").setAttribute("style", "overflow-y:hidden;");
            dom.body.setAttribute("style", "position:fixed; overflow-y:hidden;")
        } else {
            dom.getElementById("body_show").removeAttribute("style");
            dom.body.removeAttribute("style")
        }
        _self.clearResetPsw()
    };
    _self.clearResetPsw = function() {
        _mc["input_passwd"].value = "";
        _mc["strengthTxt"].style.display = "none";
        _mc["div_show_strong"].classList.add("hide_item");
        _self.clearErrorStatusCtl(null, ctlObj["passwd"]);
        _self.setBoxClass(_mc["passwd_rule"], "word_midRed", "");
        _mc["pwd_save_btn"].disabled = true
    };
    _self.upd_passwd = function() {
        var getHttp = new HttpRequest;
        getHttp.addEventListener("LoadComplete", _self.upd_msg);
        var param = _self.passwdParam();
        param = "p=chg_subuser_pwd&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param)
    };
    _self.passwdParam = function() {
        var par = "";
        par += "uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&levelid=" + top.layer_id;
        par += "&id=" + paramObj.id;
        par += "&pay_type=" + paramObj.pay_type;
        par += "&passwords=" + ctlObj["passwd"].input.value;
        par += "&langx=" + top.langx;
        return par
    };
    _self.upd_msg = function(data) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        if (_status == "success") {
            _self.showResetPsw(null, {
                "isShow": false
            });
            parentClass.dispatchEvent("showFadeOutMesg", {
                "text": LS_account.get("chg_pwd_success"),
                "set_class_id": "home_show",
                "set_class_name": "--accType"
            })
        } else if (_status == "error") {
            _mc["pwd_save_btn"].disabled = true;
            if (arr_data.msg == null || arr_data.msg == "") {
                util.chkErrorMsg(arr_data, LS_code);
                return false
            }
            ctlObj["passwd"].msg.innerHTML = arr_data.msg;
            _self.setBoxClass(ctlObj["passwd"].box, "--err", "add")
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
    _self.showErrorCtl = function(code, msg) {
        if (code)
            _self.clearErrorStatusCtl(null, ctlObj[code]);
        else
            _self.clearErrorStatusCtl();
        var obj = ctlObj[code];
        var error_class = "--err";
        if (obj != null) {
            ctlObj[code].msg.innerHTML = msg;
            _self.setBoxClass(ctlObj[code].box, error_class, "add");
            _self.ShowAndHidden(null, _mc["acc_detail"])
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
        }
    };
    _self.showError = function(code, msg) {
        var tmp = code.split("|");
        if (tmp[0] == "errormsg")
            _self.showErrorMsg(tmp[1], msg);
        else if (tmp[0] == "ctl")
            _self.showErrorCtl(tmp[1], msg)
    };
    _self.showErrorMsg = function(code, msg) {
        if (code == "clean_db") {
            var obj = new Object;
            obj.msg = msg;
            parentClass.dispatchEvent("showAlertMsg", obj)
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
        var res = _self.str_chk(ctlObj["passwd"].input.value);
        var charCode = "";
        if (keyEvent.keyCode == 0)
            charCode = keyEvent.which;
        else
            charCode = keyEvent.keyCode ? keyEvent.keyCode : keyEvent.which;
        if (charCode == "13")
            if (res)
                _self.upd_passwd()
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
            return _self.getNumberWords(number, true) + LS.get("pwd_break_Seconds");
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
        if (str == paramObj.username || str == paramObj.passwd_safe) {
            _self.showErrorPwd("passwd", LS_code.get("4X022"));
            _mc["pwd_save_btn"].disabled = true;
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
            _mc["pwd_save_btn"].disabled = false;
            return true
        }
    };
    _self.strchk_Msg = function(str) {
        if (str == "err_combination") {
            _self.showErrorPwd("passwd", "4X021");
            _mc["pwd_save_btn"].disabled = true
        } else if (str == "err_length") {
            _self.showErrorPwd("passwd", "4X021");
            _mc["pwd_save_btn"].disabled = true
        } else if (str == "err_contain") {
            _self.showErrorPwd("passwd", "4X021");
            _mc["pwd_save_btn"].disabled = true
        } else if (str == "err_charactersNum") {
            _self.showErrorPwd("passwd", LS_code.get("4X040"));
            _mc["pwd_save_btn"].disabled = true
        } else if (str == "err_block_string") {
            _self.showErrorPwd("passwd", LS_code.get("4X040"));
            _mc["pwd_save_btn"].disabled = true
        } else {
            util.echo("chk wrong!!");
            _self.showErrorPwd("passwd", "4X021");
            _mc["pwd_save_btn"].disabled = true
        }
    };
    _self.strchk_Msg_safe = function(str, login_layer) {
        if (str == "err_combination")
            return login_layer == "ag" ? "4X011_ag" : "4X011";
        else if (str == "err_length")
            return login_layer == "ag" ? "4X011_ag" : "4X011";
        else if (str == "err_contain")
            return login_layer == "ag" ? "4X011_ag" : "4X011";
        else if (str == "err_charactersNum")
            return "4X041";
        else if (str == "err_block_string")
            return "4X041";
        else {
            util.echo("chk wrong!!");
            return login_layer == "ag" ? "4X011_ag" : "4X011"
        }
    };
    _self.chkThisPwdSafe = function(keyEvent, targetObj) {
        _mc["safe_checked"].style.display = "none";
        _mc["msg_safe"].classList.add("--noListStyle");
        if (ctlObj["safe"].input.value == "" && keyEvent.type == "blur")
            _self.showErrorCtl("safe", LS.get("empty_user"));
        else {
            var str = ctlObj["safe"].input.value;
            if (str == paramObj.username) {
                if (top.login_layer == "ag")
                    _self.showErrorCtl("safe", LS_code.get("4X015_ag"));
                else
                    _self.showErrorCtl("safe", LS_code.get("4X015"));
                return false
            }
            if (top.login_layer == "ag") {
                var res = util.str_chk_mem(ctlObj["safe"].input.value, 2);
                if (res == "err_charactersNum" || res == "err_block_string")
                    res = "chk_OK"
            } else
                var res = util.str_chk(ctlObj["safe"].input.value);
            if (res != "chk_OK") {
                var str_out = _self.strchk_Msg_safe(res, top.login_layer);
                if (str_out == "4X011")
                    _mc["msg_safe"].classList.remove("--noListStyle");
                _self.showErrorCtl("safe", LS_code.get(str_out))
            } else if (top.login_layer == "ag" && keyEvent.type == "blur") {
                if (str != paramObj.passwd_safe)
                    _self.chkpwfEvent(keyEvent, targetObj)
            } else {
                _self.setBoxClass(ctlObj["safe"].box, "accadd_succ", "add");
                ctlObj["safe"].msg.innerHTML = ""
            }
        }
    };
    _self.chkpwfEvent = function(e, targetObj) {
        if (targetObj.value != "") {
            var getHttp = new HttpRequest;
            var param = _self.pwfChkParam(targetObj.value);
            getHttp.addEventListener("LoadComplete", _self.pwfChkFinish);
            param = "p=chk_username&langx=" + top.langx + "&ver=" + top.ver + param;
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
                _self.showErrorCtl(code, msg)
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
    _self.chg_mail_status = function() {
        var enable_recv = _mc["input_psw_recovery"].checked;
        _mc["psw_recovery_text"].setAttribute("data-txt", enable_recv ? LS.get("recv_enable") : LS.get("recv_disable"))
    };
    _self.ShowAndHidden = function(mouseEvent, element) {
        for (var id in titleObj)
            if (titleObj[id].classList.contains("--on") && element.id != id) {
                titleObj[id].classList.remove("--on");
                _mc[titleObj[id].map].style.display = "none"
            }
        if (!element.classList.contains("--on"))
            element.classList.add("--on");
        _mc[element.map].style.display = "";
        if (element.map == "div_acc_eventlog")
            ObjEventlog.setScrollEvent(true);
        else {
            _self.InitSetConfirmExit();
            _self.set_modal_step_btn();
            parentClass.dispatchEvent("show_modal_step", {
                "show_step": true
            })
        }
    };
    _self.saveEvent = function(mouseEvent, targetObj) {
        var ret = _self.submitCheck();
        var new_name = ctlObj["alias"].input.value;
        var new_safe = ctlObj["safe"].input.value;
        var new_pri = "";
        var new_manager_uid = "";
        for (var i = 0; i < pri_ary.length; i++)
            if (_mc[pri_ary[i]].checked) {
                if (new_pri != "")
                    new_pri += "-";
                new_pri += pri_ary[i]
            }
        if (_mc["total"].checked)
            new_manager_uid = "0";
        else
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked) {
                    if (new_manager_uid != "")
                        new_manager_uid += ",";
                    new_manager_uid += box.acc_id
                }
            }
        var managerEqual = new_manager_uid.split(",").sort().join("") === old_manager_uid.split(",").sort().join("");
        if (ret) {
            var chk_new_safe = top.login_layer == "ag" ? "chk_OK" : util.str_chk(new_safe);
            if (new_name != paramObj["alias"] || chk_new_safe != "chk_OK" || new_safe != paramObj["passwd_safe"] || new_pri != paramObj["pri"] || !managerEqual || _mc["input_psw_recovery"].keep != _mc["input_psw_recovery"].checked) {
                var getHttp = new HttpRequest;
                getHttp.addEventListener("LoadComplete", function(data) {
                    _self.saveFinish(data, targetObj)
                });
                var param = _self.getSaveParam();
                param = "p=body_subuser_modify&ver=" + top.ver + "&" + param;
                getHttp.loadURL(top.url, "POST", param)
            } else
                _self.closeEvent("save")
        }
    };
    _self.saveFinish = function(data, targetObj) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        if (_status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg == null || error_msg == "") {
                util.chkErrorMsg(arr_data, LS_code);
                return false
            }
            _self.showError(error_code, error_msg)
        } else
            _self.closeEvent("save")
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
        par += "&action=edit";
        par += "&levelid=" + top.layer_id;
        par += "&subid=" + paramObj.id;
        par += "&set_pri_type=" + set_pri_type;
        par += "&subname=" + paramObj.username;
        par += "&alias=" + ctlObj["alias"].input.value;
        par += "&passwordssafe=" + ctlObj["safe"].input.value;
        par += "&set_manager_uid=" + set_manager_uid;
        par += "&langx=" + top.langx;
        par += "&pay_type=" + paramObj.pay_type;
        var pmo_enable = "";
        if (_mc["input_psw_recovery"].keep != _mc["input_psw_recovery"].checked)
            pmo_enable = _mc["input_psw_recovery"].checked ? "E" : "S";
        par += "&pmo_enable=" + pmo_enable;
        return par
    };
    _self.submitCheck = function() {
        for (var key in ctlObj)
            if (ctlObj[key].input.value == "")
                if (key != "passwd") {
                    _self.showErrorCtl(key, LS.get("empty_" + key));
                    return false
                }
        if (!util.checkFormat(ctlObj["alias"].input.value, 3)) {
            _self.showErrorCtl("alias", LS.get("alias_no_SPChar"));
            return false
        }
        if (!_mc["total"].checked) {
            var nums = 0;
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked)
                    nums++
            }
            if (nums > user_mlimit) {
                var msg = LS.get("sub_mlimit") + user_mlimit + LS.get("sub_mlimit2");
                _self.ShowAndHidden(null, _mc["acc_manage"]);
                parentClass.dispatchEvent("showAlertMsg", {
                    "msg": msg
                });
                return false
            }
        }
        var chk = 0;
        var msg = LS.get("user_manage");
        if (!_mc["total"].checked) {
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked)
                    chk = 1
            }
            if (chk == 0) {
                _self.ShowAndHidden(null, _mc["acc_manage"]);
                parentClass.dispatchEvent("showAlertMsg", {
                    "msg": msg
                });
                return false
            }
        }
        return true
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
            "id": "Sub"
        })
    };
    _self.titleChg = function(mouseEvent, element) {
        parentClass.dispatchEvent("show_modal_step", {
            "show_step": false
        });
        var target_id = element.id;
        var div_body_show = dom.getElementById("body_show");
        if (div_body_show.classList.contains("bgf0f0f0"))
            div_body_show.classList.remove("bgf0f0f0");
        if (target_id == "acc_detail")
            div_body_show.classList.add("bgf0f0f0");
        if (element.map == "div_acc_eventlog" && mouseEvent != null)
            parentClass.dispatchEvent("ConfirmExitAlert", {
                Event: mouseEvent,
                Param: element,
                func: _self.ShowAndHidden
            });
        else
            _self.ShowAndHidden(mouseEvent, element)
    };
    _self.isEdit = function() {
        var new_name = ctlObj["alias"].input.value;
        var new_safe = ctlObj["safe"].input.value;
        var new_pri = "";
        var new_manager_uid = "";
        for (var i = 0; i < pri_ary.length; i++)
            if (_mc[pri_ary[i]].checked) {
                if (new_pri != "")
                    new_pri += "-";
                new_pri += pri_ary[i]
            }
        if (_mc["total"].checked)
            new_manager_uid = "0";
        else
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked) {
                    if (new_manager_uid != "")
                        new_manager_uid += ",";
                    new_manager_uid += box.acc_id
                }
            }
        var managerEqual = new_manager_uid.split(",").sort().join("") === old_manager_uid.split(",").sort().join("");
        if (new_name != paramObj["alias"] || new_safe != paramObj["passwd_safe"] || new_pri != paramObj["pri"] || !managerEqual || _mc["input_psw_recovery"].keep != _mc["input_psw_recovery"].checked)
            return true;
        else
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
    _self.checkNameEvent = function(e, targetObj) {
        if (targetObj.value == "") {
            ctlObj["alias"].msg.innerHTML = LS.get("empty_alias");
            _self.setBoxClass(ctlObj["alias"].box, "--err", "add")
        }
    };
    _self.inputboxFocusEvent = function(e, target) {
        _self.clearErrorStatusCtl(null, target);
        _self.setBoxClass(target.box, "--on", "add")
    };
    _self.inputboxBlurEvent = function(e, target) {
        if (!target.box.classList.contains("--err"))
            _self.setBoxClass(target.box, "--on", "")
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
    };
    _self.set_modal_step_btn = function() {
        var obj = new Object;
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
        obj["btn_right"].show_msg = LS.get("step_editm");
        obj["btn_right"].disabled = false;
        obj["btn_right"].fun = _self.saveEvent;
        parentClass.dispatchEvent("set_modal_step", obj)
    };
    _self.closePopEvent = function(e, param) {
        if (!param.target.contains(e.target))
            _self.showResetPsw(null, {
                "isShow": false
            })
    }
};
