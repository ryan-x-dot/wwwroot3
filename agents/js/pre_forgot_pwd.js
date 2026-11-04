function pre_forgot_pwd(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object;
    var util;
    var LS;
    var LS_code;
    var LS_account;
    var nowDiv = "div_set_email";
    var div_set_email;
    var user;
    var setEmail;
    var gv_CANCEL;
    var gv_NEXT;
    var pwd_info;
    var ac_err;
    var mail_err;
    var div_set_verify;
    var myVerify;
    var reset;
    var verify_show_info;
    var PS_sendCode;
    var verify_div;
    var div_set_pwd;
    var pwd;
    var pwd_box;
    var pwd_isShow = true;
    var eye_icon;
    var sp_CANCEL;
    var submitto;
    var strengthTxt;
    var div_set_done;
    var DONE;
    var AR_BG;
    var cfm_box;
    var btn_N;
    var btn_Y;
    var isLock = false;
    var confirmpwd_box;
    var confirmpwd;
    var eye_confirmpwd;
    var confirmpwd_info;
    var onfirmpwd_isShow = true;
    _self.init = function() {
        util.echo("pre_forgot_pwd load complete");
        div_set_email = dom.getElementById("div_set_email");
        user = dom.getElementById("username");
        usernameinfo = dom.getElementById("usernameinfo");
        setEmail = dom.getElementById("setEmail");
        passinfo = dom.getElementById("passinfo");
        gv_CANCEL = dom.getElementById("gv_CANCEL");
        gv_NEXT = dom.getElementById("gv_NEXT");
        ac_err = dom.getElementById("ac_err");
        mail_err = dom.getElementById("mail_err");
        util.addEvent(gv_CANCEL, "click", _self.CANCEL);
        util.addEvent(gv_NEXT, "click", _self.NEXT);
        util.addEvent(user, "focus", _self.onFocusEventHandler, {
            "target": "user"
        });
        util.addEvent(user, "blur", _self.onBlurEventHandler, {
            "target": "user"
        });
        util.addEvent(setEmail, "focus", _self.onFocusEventHandler, {
            "target": "setEmail"
        });
        util.addEvent(setEmail, "blur", _self.onBlurEventHandler, {
            "target": "setEmail"
        });
        util.addEvent(user, "keyup", _self.keyupEventHandler_noChk, {
            "target": "user"
        });
        util.addEvent(setEmail, "keyup", _self.keyupEventHandler_noChk, {
            "target": "setEmail"
        });
        div_set_verify = dom.getElementById("div_set_verify");
        myVerify = dom.getElementById("myVerify");
        cv_CANCEL = dom.getElementById("cv_CANCEL");
        cv_NEXT = dom.getElementById("cv_NEXT");
        reset = dom.getElementById("reset");
        verify_show_info = dom.getElementById("verify_show_info");
        PS_sendCode = dom.getElementById("PS_sendCode");
        verify_div = dom.getElementById("verify_div");
        util.addEvent(cv_CANCEL, "click", _self.CANCEL);
        util.addEvent(cv_NEXT, "click", _self.NEXT);
        util.addEvent(myVerify, "keyup", _self.StrtoUPPer);
        util.addEvent(myVerify, "focus", _self.onFocusEventHandler, {
            "target": "myVerify"
        });
        util.addEvent(myVerify, "blur", _self.onBlurEventHandler, {
            "target": "myVerify"
        });
        div_set_pwd = dom.getElementById("div_set_pwd");
        pwd = dom.getElementById("pwd");
        pwd_box = dom.getElementById("pwd_box");
        eye_icon = dom.getElementById("eye_icon");
        sp_CANCEL = dom.getElementById("sp_CANCEL");
        submitto = dom.getElementById("submitto");
        pwd_info = dom.getElementById("pwd_info");
        strengthTxt = dom.getElementById("strengthTxt");
        confirmpwd_box = dom.getElementById("confirmpwd_box");
        confirmpwd = dom.getElementById("confirmpwd");
        eye_confirmpwd = dom.getElementById("eye_confirmpwd");
        confirmpwd_info = dom.getElementById("confirmpwd_info");
        util.addEvent(reset, "click", _self.RESET);
        util.addEvent(eye_icon, "click", _self.showPwd, {
            "do_inputobj": pwd,
            "do_eyeobj": eye_icon
        });
        util.addEvent(sp_CANCEL, "click", _self.CANCEL);
        util.addEvent(submitto, "click", _self.NEXT);
        util.addEvent(pwd, "keyup", _self.keyupEventHandler);
        util.addEvent(pwd, "focus", _self.onFocusEventHandler, {
            "target": "pwd"
        });
        util.addEvent(pwd, "blur", _self.keyupEventHandler);
        util.addEvent(eye_confirmpwd, "click", _self.showPwd, {
            "do_inputobj": confirmpwd,
            "do_eyeobj": eye_confirmpwd
        });
        util.addEvent(confirmpwd, "keyup", _self.keyupEventHandler_noChk, {
            "target": "confirmpwd"
        });
        util.addEvent(confirmpwd, "focus", _self.onFocusEventHandler, {
            "target": "confirmpwd"
        });
        util.addEvent(confirmpwd, "blur", _self.keyupEventHandler_noChk, {
            "target": "confirmpwd"
        });
        div_set_done = dom.getElementById("div_set_done");
        DONE = dom.getElementById("DONE");
        util.addEvent(DONE, "click", _self.DONE);
        AR_BG = dom.getElementById("AR_BG");
        cfm_box = dom.getElementById("cfm_box");
        btn_N = dom.getElementById("btn_N");
        btn_Y = dom.getElementById("btn_Y");
        util.addEvent(btn_N, "click", _self.btn_N);
        util.addEvent(btn_Y, "click", _self.btn_Y);
        _self.addEventListener("startTimer", _self.startTimer);
        _self.addEventListener("stopTimer", _self.stopTimer);
        _self.addEventListener("clearTimer", _self.clearTimer);
        _self.createTimer()
    }
    ;
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
        config_set = parentClass.getThis("config_set");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash")
    }
    ;
    _self.getThis = function(varible) {
        return eval(varible)
    }
    ;
    _self.exitEvent = function() {
        util.echo("xxx exit");
        return true
    }
    ;
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    }
    ;
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname])
            eventHandler[eventname](param)
    }
    ;
    _self.onFocusEventHandler = function(evt, param) {
        if (param.target == "user")
            usernameinfo.className = "ps_input focus_input";
        if (param.target == "setEmail")
            passinfo.className = "ps_input focus_input";
        if (param.target == "myVerify")
            verify_div.className = "ps_input m_noH focus_input";
        if (param.target == "pwd") {
            pwd_box.className = "ps_input focus_input";
            pwd_info.style.display = "none"
        }
        if (param.target == "confirmpwd") {
            confirmpwd_box.className = "ps_input focus_input";
            confirmpwd_info.style.display = "none"
        }
    }
    ;
    _self.onBlurEventHandler = function(evt, param) {
        if (param.target == "user") {
            usernameinfo.className = "ps_input";
            passinfo.className = "ps_input"
        }
        if (param.target == "setEmail") {
            usernameinfo.className = "ps_input";
            passinfo.className = "ps_input"
        }
        if (param.target == "myVerify")
            verify_div.className = "ps_input m_noH";
        if (param.target == "pwd") {
            pwd_box.className = "ps_input";
            if (pwd.value == "") {
                pwd_info.style.display = "";
                pwd_box.className = "ps_input err_input";
                pwd_info.innerHTML = LS.get("empty_passwd")
            }
        }
        if (param.target == "confirmpwd") {
            confirmpwd_box.className = "ps_input";
            if (confirmpwd.value == "") {
                confirmpwd_info.style.display = "";
                confirmpwd_box.className = "ps_input err_input";
                confirmpwd_info.innerHTML = LS.get("empty_passwd")
            }
        }
    }
    ;
    _self.keyupEventHandler = function(keyEvent, targetObj) {
        if (keyEvent.type == "blur" && pwd.value == "") {
            pwd_info.style.display = "";
            pwd_box.className = "ps_input err_input";
            pwd_info.innerHTML = LS.get("empty_passwd");
            return
        }
        strengthTxt.style.display = "";
        _self.checkThisPassword(pwd.value);
        var res = util.str_chk(pwd.value);
        _self.strchk_Msg(res);
        if (pwd.value == "")
            strengthTxt.style.display = "none";
        var chk_ = _self.chk_confirmpwd(false);
        if (keyEvent.keyCode == 0)
            charCode = keyEvent.which;
        else
            charCode = keyEvent.keyCode ? keyEvent.keyCode : keyEvent.which;
        if (charCode == "13")
            if (res == "chk_OK")
                _self.NEXT()
    }
    ;
    _self.keyupEventHandler_noChk = function(keyEvent, param) {
        if (param.target == "confirmpwd") {
            if (confirmpwd.value == "") {
                confirmpwd_info.style.display = "";
                confirmpwd_box.className = "ps_input err_input";
                confirmpwd_info.innerHTML = LS.get("empty_passwd");
                return
            }
            var chk_ = _self.chk_confirmpwd(true)
        }
        if (keyEvent.keyCode == 0)
            charCode = keyEvent.which;
        else
            charCode = keyEvent.keyCode ? keyEvent.keyCode : keyEvent.which;
        if (charCode == "13")
            _self.NEXT()
    }
    ;
    _self.chk_confirmpwd = function(show_err) {
        var str_out = true;
        if (confirmpwd.value != pwd.value || confirmpwd.value == "" && pwd.value == "") {
            submitto.disabled = true;
            if (show_err) {
                confirmpwd_box.className = "ps_input err_input";
                confirmpwd_info.innerHTML = LS_account.get("confirmpwd_diff");
                confirmpwd_info.style.display = ""
            }
            str_out = false
        } else {
            if (show_err) {
                confirmpwd_box.className = "ps_input";
                confirmpwd_info.style.display = "none"
            }
            var res = util.str_chk(pwd.value);
            _self.strchk_Msg(res);
            if (res == "chk_OK") {
                confirmpwd_box.className = "ps_input";
                confirmpwd_info.style.display = "none";
                submitto.disabled = false
            }
        }
        return str_out
    }
    ;
    _self.StrtoUPPer = function(keyEvent, targetObj) {
        var tmp = myVerify.value;
        var stu = tmp.toUpperCase();
        myVerify.value = stu;
        if (myVerify.value == "") {
            verify_show_info.style.display = "none";
            verify_div.className = "ps_input m_noH"
        }
        if (keyEvent.keyCode == 0)
            charCode = keyEvent.which;
        else
            charCode = keyEvent.keyCode ? keyEvent.keyCode : keyEvent.which;
        if (charCode == "13")
            _self.NEXT()
    }
    ;
    _self.NEXT = function(mouseEvent, targetObj) {
        ac_err.style.display = "none";
        usernameinfo.className = "ps_input";
        mail_err.style.display = "none";
        passinfo.className = "ps_input";
        if (nowDiv == "div_set_email")
            var ret = _self.checkFormat(user.value, setEmail.value);
        if (nowDiv == "div_set_verify")
            var ret = _self.checkFormat2(myVerify.value);
        if (nowDiv == "div_set_pwd")
            var ret = _self.checkFormat3(pwd.value, confirmpwd.value);
        if (ret == "")
            _self.connetToServer(nowDiv);
        else
            util.echo("Email or user ID error")
    }
    ;
    _self.RESET = function(mouseEvent, targetObj) {
        if (!isLock) {
            nowDiv = "div_set_email";
            PS_sendCode.style.display = "none";
            _self.connetToServer(nowDiv);
            _self.startTimer();
            reset.className = "ps_reset_btn on";
            isLock = true
        } else
            util.echo("RESEND isLock")
    }
    ;
    _self.checkFormat = function(user, email) {
        if (user == "") {
            mail_err.style.display = "";
            mail_err.innerHTML = LS_account.get("forgot_pwd_Invaild");
            usernameinfo.className = "ps_input err_input";
            passinfo.className = "ps_input err_input";
            return "login_user"
        } else
            mail_err.style.display = "none";
        if (email == "") {
            mail_err.style.display = "";
            mail_err.innerHTML = LS_account.get("forgot_pwd_Invaild");
            usernameinfo.className = "ps_input err_input";
            passinfo.className = "ps_input err_input";
            return "login_email"
        }
        return ""
    }
    ;
    _self.checkFormat2 = function(myVerify) {
        if (myVerify == "") {
            verify_show_info.style.display = "";
            verify_div.className = "ps_input m_noH err_input";
            verify_show_info.innerHTML = LS_account.get("verif_Invalid");
            return "login_verify"
        }
        return ""
    }
    ;
    _self.checkFormat3 = function(pwd_value, confirmpwd_value) {
        if (pwd_value == "") {
            pwd_info.style.display = "";
            pwd_info.innerHTML = LS_account.get("err_pwd_rule");
            pwd_box.className = "ps_input err_input";
            submitto.disabled = true;
            return "pwd"
        } else {
            var res = util.str_chk(pwd_value);
            _self.strchk_Msg(res);
            if (res != "chk_OK") {
                submitto.disabled = true;
                return "pwd"
            }
        }
        if (confirmpwd_value == "") {
            confirmpwd_info.style.display = "";
            confirmpwd_info.innerHTML = LS_account.get("confirmpwd_diff");
            confirmpwd_box.className = "ps_input err_input";
            submitto.disabled = true;
            return "confirmpwd"
        } else {
            var chk_ = _self.chk_confirmpwd(true);
            if (!chk_) {
                submitto.disabled = true;
                return "confirmpwd"
            }
        }
        return ""
    }
    ;
    _self.connetToServer = function(nowDiv) {
        var urlParams = "";
        urlParams += "login_layer=" + top.login_layer;
        urlParams += "&langx=" + top.langx;
        urlParams += "&user=" + user.value;
        top.username = user.value;
        urlParams += "&mail=" + setEmail.value;
        if (nowDiv == "div_set_verify")
            urlParams += "&verify=" + myVerify.value;
        if (nowDiv == "div_set_pwd") {
            urlParams += "&verify=" + myVerify.value;
            urlParams += "&pwd=" + pwd.value;
            urlParams += "&confirm_pwd=" + confirmpwd.value
        }
        urlParams += "&nowDiv=" + nowDiv;
        urlParams = "p=pre_chkPwd&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams)
    }
    ;
    _self.connectComplete = function(data) {
        try {
            PS_sendCode.style.display = "";
            var arr_data = JSON.parse(data);
            if (util.chkErrorMsg(arr_data, LS_code))
                return;
            if (arr_data["code"] == "424")
                if (arr_data["status"] == "success") {
                    if (arr_data["status_code"] == "4O005") {
                        div_set_email.style.display = "none";
                        div_set_verify.style.display = "";
                        nowDiv = "div_set_verify"
                    }
                } else {
                    mail_err.style.display = "";
                    usernameinfo.className = "ps_input err_input";
                    passinfo.className = "ps_input err_input";
                    mail_err.innerHTML = LS_code.get(arr_data["status_code"])
                }
            else if (arr_data["code"] == "426")
                if (arr_data["status"] == "success") {
                    div_set_verify.style.display = "none";
                    div_set_pwd.style.display = "";
                    nowDiv = "div_set_pwd"
                } else {
                    verify_show_info.style.display = "";
                    verify_div.className = "ps_input m_noH err_input";
                    verify_show_info.innerHTML = LS_code.get(arr_data["status_code"])
                }
            else if (arr_data["code"] == "428")
                if (arr_data["status"] == "success") {
                    div_set_pwd.style.display = "none";
                    div_set_done.style.display = "";
                    nowDiv = "div_set_done"
                } else if (arr_data["status_code"] == "4X023") {
                    pwd_info.style.display = "";
                    pwd_info.innerHTML = LS_code.get(arr_data["status_code"]);
                    pwd_box.className = "ps_input err_input"
                } else if (arr_data["status_code"] == "diff") {
                    confirmpwd_info.style.display = "";
                    confirmpwd_info.innerHTML = LS_account.get("confirmpwd_diff");
                    confirmpwd_box.className = "ps_input err_input"
                } else {
                    pwd_info.style.display = "";
                    pwd_info.innerHTML = LS_code.get(arr_data["status_code"]);
                    submitto.disabled = true
                }
        } catch (e) {
            util.echo("[pre_forgot_pwd]something wrong !!");
            util.echo(e)
        }
    }
    ;
    _self.onError = function() {
        util.echo("onError")
    }
    ;
    _self.CANCEL = function(mouseEvent, targetObj) {
        AR_BG.style.display = "";
        cfm_box.style.display = ""
    }
    ;
    _self.btn_N = function(mouseEvent, targetObj) {
        AR_BG.style.display = "none";
        cfm_box.style.display = "none"
    }
    ;
    _self.btn_Y = function(mouseEvent, targetObj) {
        util.goToIndex()
    }
    ;
    _self.DONE = function(mouseEvent, targetObj) {
        util.goToIndex()
    }
    ;
    _self.backPageComplete = function() {
        util.echo("backPageComplete")
    }
    ;
    _self.showPwd = function(evt, param) {
        if (param.do_inputobj.getAttribute("type") == "password") {
            param.do_inputobj.setAttribute("type", "text");
            param.do_eyeobj.className = "eye_icon"
        } else {
            param.do_inputobj.setAttribute("type", "password");
            param.do_inputobj.setAttribute("autocomplete", "new-password");
            param.do_eyeobj.className = "no_eye_icon"
        }
    }
    ;
    _self.createTimer = function() {
        timerHash["getVerify"] = new Timer(config_set.get("RESEND_TIME"),1);
        timerHash["getVerify"].setParentclass(_self);
        timerHash["getVerify"].init();
        timerHash["getVerify"].addEventListener("TimerEvent.TIMER", _self.timerRun);
        timerHash["getVerify"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerComplete)
    }
    ;
    _self.startTimer = function() {
        util.echo("getVerify startTimer");
        timerHash["getVerify"].startTimer()
    }
    ;
    _self.stopTimer = function() {
        util.echo("getVerify stopTimer");
        timerHash["getVerify"].stopTimer()
    }
    ;
    _self.clearTimer = function() {
        util.echo("getVerify clearTimer");
        timerHash["getVerify"].clearObj()
    }
    ;
    _self.timerRun = function() {
        util.echo("getVerify timer")
    }
    ;
    _self.timerComplete = function() {
        reset.className = "ps_reset_btn";
        util.echo("timerComplete");
        isLock = false
    }
    ;
    _self.checkThisPassword = function(password) {
        var checked = zxcvbn(password);
        var timetocrack = checked.crack_time;
        var strength = checked.score;
        var timeinwords = _self.toWords(timetocrack);
        document.getElementById("first_estimate").innerHTML = timeinwords;
        if (password == "")
            strength = 5;
        _self.displayStrength(strength)
    }
    ;
    _self.displayStrength = function(c) {
        var f = LS.get("pwd_Very Weak");
        var e = "";
        if (c == 0) {
            f = LS.get("pwd_Very Weak");
            e = "word_red";
            document.getElementById("pwd_light").className = "ps_strength_img ps_strength_light1"
        }
        if (c == 1) {
            f = LS.get("pwd_Weak");
            e = "word_red";
            document.getElementById("pwd_light").className = "ps_strength_img ps_strength_light2"
        }
        if (c == 2) {
            f = LS.get("pwd_Fair");
            e = "word_lightGreen";
            document.getElementById("pwd_light").className = "ps_strength_img ps_strength_light3"
        }
        if (c == 3) {
            f = LS.get("pwd_Good");
            e = "word_lightGreen";
            document.getElementById("pwd_light").className = "ps_strength_img ps_strength_light4"
        }
        if (c == 4) {
            f = LS.get("pwd_Strong");
            e = "word_lightGreen";
            document.getElementById("pwd_light").className = "ps_strength_img ps_strength_light5"
        }
        if (c == 5) {
            f = "";
            document.getElementById("pwd_light").className = "ps_strength_img"
        }
        document.getElementById("complexity-span").innerHTML = f;
        document.getElementById("complexity-span").className = e
    }
    ;
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
    }
    ;
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
            }
        else if (top.langx == "zh-tw" || top.langx == "zh-cn")
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
    }
    ;
    _self.strchk_Msg = function(str) {
        if (str == "err_combination") {
            pwd_info.style.display = "";
            pwd_info.innerHTML = LS_account.get("err_pwd_rule");
            pwd_box.className = "ps_input err_input";
            submitto.disabled = true
        } else if (str == "err_length") {
            pwd_info.style.display = "";
            pwd_info.innerHTML = LS_account.get("err_pwd_rule");
            pwd_box.className = "ps_input err_input";
            submitto.disabled = true
        } else if (str == "err_contain") {
            pwd_info.style.display = "";
            pwd_info.innerHTML = LS_account.get("err_pwd_rule");
            pwd_box.className = "ps_input err_input";
            submitto.disabled = true
        } else if (str == "err_charactersNum") {
            pwd_info.style.display = "";
            pwd_info.innerHTML = LS_account.get("err_pwd_block");
            pwd_box.className = "ps_input err_input";
            submitto.disabled = true
        } else if (str == "err_block_string") {
            pwd_info.style.display = "";
            pwd_info.innerHTML = LS_account.get("err_pwd_block");
            pwd_box.className = "ps_input err_input";
            submitto.disabled = true
        } else if (str == "chk_OK") {
            pwd_info.style.display = "none";
            pwd_box.className = "ps_input";
            submitto.disabled = false
        } else
            ;
    }
}
;