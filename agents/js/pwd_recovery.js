function pwd_recovery(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var topFrame;
    var eventHandler = new Object;
    var chgMailText = true;
    _self.init = function() {
        util.echo(" Password Recovery ");
        _self.connetToServer("init");
        parentClass.dispatchEvent("chgPageName", {
            "pageName": "pwd_recovery"
        });
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        });
        topFrame.closeRightPanel();
        _self.setListen()
    };
    _self.setListen = function() {
        var setEmail = dom.getElementById("setEmail");
        var mail_CANCEAL = dom.getElementById("mail_CANCEAL");
        var mail_NEXT = dom.getElementById("mail_NEXT");
        var myVerify = dom.getElementById("myVerify");
        var verify_RESEND = dom.getElementById("verify_RESEND");
        var verify_CANCEAL = dom.getElementById("verify_CANCEAL");
        var verify_NEXT = dom.getElementById("verify_NEXT");
        var done_btn = dom.getElementById("done_btn");
        var mail_del = dom.getElementById("mail_del");
        var mail_edit = dom.getElementsByName("mail_edit");
        util.addEvent(mail_CANCEAL, "click", _self.onClickEventHandler, {
            "target": "setEmail_CANCEL"
        });
        util.addEvent(mail_NEXT, "click", _self.onClickEventHandler, {
            "target": "setEmail_NEXT"
        });
        util.addEvent(setEmail, "focus", _self.onFocusEventHandler, {
            "target": "setEmail"
        });
        util.addEvent(setEmail, "blur", _self.onBlurEventHandler, {
            "target": "setEmail"
        });
        util.addEvent(setEmail, "keypress", _self.onKeypressEventHandler, {
            "target": "setEmail"
        });
        util.addEvent(setEmail, "input", _self.onInputEventHandler, {
            "target": "setEmail"
        });
        util.addEvent(verify_RESEND, "click", _self.onClickEventHandler, {
            "target": "inputVerify_RESEND"
        });
        util.addEvent(verify_CANCEAL, "click", _self.onClickEventHandler, {
            "target": "inputVerify_CANCEL"
        });
        util.addEvent(verify_NEXT, "click", _self.onClickEventHandler, {
            "target": "inputVerify_NEXT"
        });
        util.addEvent(myVerify, "focus", _self.onFocusEventHandler, {
            "target": "myVerify"
        });
        util.addEvent(myVerify, "blur", _self.onBlurEventHandler, {
            "target": "myVerify"
        });
        util.addEvent(myVerify, "keypress", _self.onKeypressEventHandler, {
            "target": "myVerify"
        });
        util.addEvent(myVerify, "input", _self.onInputEventHandler, {
            "target": "myVerify"
        });
        util.addEvent(done_btn, "click", _self.onClickEventHandler, {
            "target": "done_CANCEL"
        });
        util.addEvent(mail_del, "click", _self.onClickEventHandler, {
            "target": "mail_del"
        });
        for (var i = 0, len = mail_edit.length; i < len; i++)
            util.addEvent(mail_edit[i], "click", _self.onClickEventHandler, {
                "target": "mail_EDIT"
            })
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        topFrame = parentClass.getThis("topFrame")
    };
    _self.connetToServer = function(eventName, param) {
        param = typeof param !== "undefined" ? param : "";
        var urlParams = "uid=" + top.uid;
        var getHTML = new HttpRequest;
        if (eventName == "init") {
            urlParams += "&action=init";
            urlParams += "&login_layer=" + top.login_layer;
            urlParams = "p=get_pwd_recovery&ver=" + top.ver + "&" + urlParams;
            getHTML.addEventListener("LoadComplete", _self.connectInit)
        } else if (eventName == "regEmail") {
            urlParams += "&action=regEmail";
            urlParams += "&login_layer=" + top.login_layer + "&langx=" + langx;
            urlParams = "p=get_pwd_recovery&ver=" + top.ver + "&" + urlParams + "&" + param;
            getHTML.addEventListener("LoadComplete", _self.getVerification)
        } else if (eventName == "sendVerify") {
            urlParams += "&action=sendVerify";
            urlParams += "&login_layer=" + top.login_layer + "&langx=" + langx;
            urlParams = "p=get_pwd_recovery&ver=" + top.ver + "&" + urlParams + "&" + param;
            getHTML.addEventListener("LoadComplete", _self.chkVerification)
        } else if (eventName == "removeEmail") {
            urlParams += "&action=removeEmail";
            urlParams += "&login_layer=" + top.login_layer + "&langx=" + langx;
            urlParams = "p=get_pwd_recovery&ver=" + top.ver + "&" + urlParams;
            getHTML.addEventListener("LoadComplete", _self.removeEmail)
        }
        getHTML.addEventListener("onError", _self.onError);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.connectInit = function(data) {
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data))
                arr_data = JSON.parse(data);
            if (!arr_data)
                arr_data = data;
            _self.parsePHPData("init", arr_data)
        } catch (e) {
            util.echo(e)
        }
    };
    _self.getVerification = function(data) {
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data))
                arr_data = JSON.parse(data);
            if (!arr_data)
                arr_data = data;
            _self.parsePHPData("viewVerify", arr_data)
        } catch (e) {
            util.echo(e)
        }
    };
    _self.chkVerification = function(data) {
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data))
                arr_data = JSON.parse(data);
            if (!arr_data)
                arr_data = data;
            _self.parsePHPData("verInfo", arr_data)
        } catch (e) {
            util.echo(e)
        }
    };
    _self.removeEmail = function(data) {
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data))
                arr_data = JSON.parse(data);
            if (!arr_data)
                arr_data = data;
            _self.parsePHPData("remove_email", arr_data)
        } catch (e) {
            util.echo(e)
        }
    };
    _self.parsePHPData = function(eventName, data) {
        if (!data)
            return;
        var msg = data["msg"];
        var code = data["code"];
        if (eventName == "init")
            if (msg == "success") {
                _self.setViewEmail(code);
                _self.viewHTML("div_view_email")
            } else {
                if (msg == "error")
                    if (code == "4X007")
                        _self.viewHTML("div_set_email");
                    else
                        util.showErrorMsg(LS_code.get(code))
            }
        else if (eventName == "viewVerify")
            if (msg == "success" && code == "4O005") {
                parentClass.dispatchEvent("showFadeOutMesg", {
                    "text": LS_code.get(code)
                });
                _self.viewHTML("div_set_verify")
            } else {
                if (msg == "error")
                    if (code == "4X035") {
                        var mail = dom.getElementById("setEmail");
                        var mail_err = dom.getElementById("mail_err");
                        mail.parentElement.className = "ps_input err_input";
                        mail_err.textContent = LS_code.get(code);
                        mail_err.style.display = ""
                    } else
                        util.showErrorMsg(LS_code.get(code))
            }
        else if (eventName == "verInfo")
            if (msg == "success" && code == "4O006") {
                parentClass.dispatchEvent("showFadeOutMesg", {
                    "text": LS_code.get(code)
                });
                _self.viewHTML("div_view_email");
                _self.clearInput()
            } else {
                if (msg == "error")
                    if (code == "4X031") {
                        var ver = dom.getElementById("myVerify");
                        var ver_err = dom.getElementById("verify_err");
                        ver.parentElement.className = "ps_input err_input";
                        ver_err.style.display = "";
                        ver.value = ""
                    } else
                        util.showErrorMsg(LS_code.get(code))
            }
        else if (eventName == "remove_email")
            if (msg == "success") {
                _self.viewHTML("div_set_email");
                parentClass.dispatchEvent("showFadeOutMesg", {
                    "text": LS.get(eventName)
                })
            } else
                util.showErrorMsg(LS_code.get(code))
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
    _self.onClickEventHandler = function(evt, param) {
        if (param.target == "setEmail_NEXT")
            _self.checkFormat(param.target, "Y");
        else if (param.target == "setEmail_CANCEL")
            util.showMsg(LS.get("input_verify_cancel"), "Y", _self.goPageHome);
        else if (param.target == "inputVerify_RESEND") {
            dom.getElementById("myVerify").value = "";
            var mailVal = dom.getElementById("setEmail").value;
            _self.connetToServer("regEmail", "email=" + mailVal)
        } else if (param.target == "inputVerify_CANCEL")
            util.showMsg(LS.get("input_verify_cancel"), "Y", _self.goPageHome);
        else if (param.target == "inputVerify_NEXT")
            _self.checkFormat(param.target, "Y");
        else if (param.target == "done_CANCEL")
            _self.goPageHome("yes");
        else if (param.target == "mail_EDIT")
            _self.viewHTML("div_set_email");
        else if (param.target == "mail_del")
            util.showMsg(LS.get("remove_email_message"), "Y", function(x) {
                if (x == "yes")
                    _self.connetToServer("removeEmail")
            })
    };
    _self.onFocusEventHandler = function(evt, param) {
        var passinfo = evt.target.parentElement;
        if (param.target == "setEmail" || param.target == "myVerify") {
            var claN = "ps_input focus_input";
            if (param.target == "myVerify")
                claN += " m_noH";
            if (evt.target.value == "")
                chgMailText = true;
            passinfo.className = claN
        }
    };
    _self.onBlurEventHandler = function(evt, param) {
        var passinfo = evt.target.parentElement;
        if (param.target == "setEmail" || param.target == "myVerify") {
            var claN = "ps_input focus_input";
            if (param.target == "myVerify")
                claN += " m_noH";
            passinfo.className = claN
        }
    };
    _self.onKeypressEventHandler = function(evt, param) {
        var passinfo = evt.charCode || evt.keyCode;
        if (evt.target.value == "")
            return;
        if (param.target == "setEmail" && passinfo == 13)
            dom.getElementById("mail_NEXT").click();
        else if (param.target == "myVerify" && passinfo == 13)
            dom.getElementById("verify_NEXT").click()
    };
    _self.onInputEventHandler = function(evt, param) {
        if (param.target == "setEmail") {
            _self.checkFormat("setEmail_NEXT");
            var val = evt.target.value;
            var disTF = true;
            if (/[\x00-\xff]+@[\x00-\xff]+\.com(?:\.[\x00-\xff]+|)$/.test(val)) {
                var tmp_arr = val.split("@");
                if (!/gmail/i.test(tmp_arr[1]))
                    disTF = false
            } else
                chgMailText = true;
            if (chgMailText) {
                dom.getElementById("mail_NEXT").disabled = disTF;
                if (!disTF)
                    chgMailText = false
            }
        }
    };
    _self.viewHTML = function(viewID) {
        var viewIdAry = ["div_view_email", "div_set_email", "div_set_verify"];
        var len = viewIdAry.length;
        for (var i = 0; i < len; i++) {
            var tmpStr = viewIdAry[i],
                display = "none";
            if (!tmpStr)
                continue;
            if (viewID == tmpStr)
                display = "";
            dom.getElementById(tmpStr).style.display = display
        }
    };
    _self.checkFormat = function(param, sendServer) {
        if (param == "setEmail_NEXT") {
            var emailRule = /[\x00-\xff]+@[\x00-\xff]+\.com(?:\.[\x00-\xff]+|)$/;
            var mail = dom.getElementById("setEmail");
            var mail_err = dom.getElementById("mail_err");
            var mailVal = mail.value;
            if (emailRule.test(mailVal)) {
                var tmp_arr = mailVal.split("@");
                if (/gmail/i.test(tmp_arr[1])) {
                    mail.parentElement.className = "ps_input err_input";
                    mail_err.textContent = LS.get("gmail_not_supported");
                    mail_err.style.display = ""
                } else {
                    mail.parentElement.className = "ps_input scss_icon";
                    mail_err.style.display = "none";
                    _self.setViewEmail(mailVal);
                    if (sendServer == "Y")
                        _self.connetToServer("regEmail", "email=" + mailVal)
                }
            } else {
                mail.parentElement.className = "ps_input err_input";
                mail_err.textContent = LS.get("emailRule_err");
                mail_err.style.display = ""
            }
        } else if (param == "inputVerify_NEXT") {
            var verRule = /^[A-Z|0-9]+$/g;
            var ver = dom.getElementById("myVerify");
            var ver_err = dom.getElementById("verify_err");
            var verVal = ver.value.toUpperCase();
            if (verRule.test(verVal)) {
                ver.parentElement.className = "ps_input m_noH";
                ver_err.style.display = "none";
                if (sendServer == "Y")
                    _self.connetToServer("sendVerify", "verCode=" + verVal)
            } else {
                ver.parentElement.className = "ps_input m_noH err_input";
                ver_err.style.display = "";
                ver.value = ""
            }
        }
    };
    _self.goPageHome = function(x) {
        if (x == "yes")
            parentClass.dispatchEvent("bodyGoToPage", {
                "page": "dashboard_main",
                "pageName": "dashboard"
            })
    };
    _self.setViewEmail = function(param) {
        var EA = dom.getElementsByName("emailAddress");
        var len = EA.length;
        for (var i = 0; i < len; i++)
            EA[i].textContent = param
    };
    _self.clearInput = function() {
        var PSI = dom.getElementsByName("pswInput");
        for (var i = 0, len = PSI.length; i < len; i++) {
            var claN = "ps_input";
            PSI[i].value = "";
            if (PSI[i].id == "myVerify")
                claN += " m_noH";
            PSI[i].parentElement.className = claN
        }
    }
};
