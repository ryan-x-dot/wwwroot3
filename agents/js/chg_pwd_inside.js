function chg_pwd_inside(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object;
    var util;
    var LS_code;
    var LS;
    var topFrame;
    var div_set_pwd;
    var div_set_done;
    var chg_DONE;
    var ps_icon;
    var ps_txt;
    var SUBMIT;
    var pwd_light;
    var strengthTxt;
    var Password_Obj = new Array;
    _self.init = function() {
        parentClass.dispatchEvent("chgPageName", {
            "pageName": "chg_pwd_inside"
        });
        div_set_pwd = dom.getElementById("div_set_pwd");
        div_set_done = dom.getElementById("div_set_done");
        chg_DONE = dom.getElementById("chg_DONE");
        ps_icon = dom.getElementById("ps_icon");
        ps_txt = dom.getElementById("ps_txt");
        SUBMIT = dom.getElementById("SUBMIT");
        var tmp_obj = new Array;
        tmp_obj["box"] = dom.getElementById("cpbox");
        tmp_obj["input"] = dom.getElementById("OLDpwd");
        tmp_obj["eye_icon"] = dom.getElementById("eye_oldpwd");
        tmp_obj["msg"] = dom.getElementById("cp");
        Password_Obj["oldpwd"] = tmp_obj;
        var tmp_obj = new Array;
        tmp_obj["box"] = dom.getElementById("npbox");
        tmp_obj["input"] = dom.getElementById("pwd");
        tmp_obj["eye_icon"] = dom.getElementById("eye_pwd");
        tmp_obj["msg"] = dom.getElementById("cnp");
        Password_Obj["pwd"] = tmp_obj;
        pwd_light = dom.getElementById("pwd_light");
        strengthTxt = dom.getElementById("strengthTxt");
        var tmp_obj = new Array;
        tmp_obj["box"] = dom.getElementById("ccpbox");
        tmp_obj["input"] = dom.getElementById("confirmpwd");
        tmp_obj["eye_icon"] = dom.getElementById("eye_confirmpwd");
        tmp_obj["msg"] = dom.getElementById("ccp");
        Password_Obj["confirmpwd"] = tmp_obj;
        util.addEvent(Password_Obj["oldpwd"]["input"], "focus", _self.onFocusEventHandler, {
            "target": "oldpwd"
        });
        util.addEvent(Password_Obj["oldpwd"]["input"], "blur", _self.onBlurEventHandler, {
            "target": "oldpwd"
        });
        util.addEvent(Password_Obj["oldpwd"]["eye_icon"], "click", _self.showPwd, {
            "target": "oldpwd"
        });
        util.addEvent(Password_Obj["pwd"]["input"], "focus", _self.onFocusEventHandler, {
            "target": "pwd"
        });
        util.addEvent(Password_Obj["pwd"]["input"], "blur", _self.keyupEventHandler, {
            "target": "pwd"
        });
        util.addEvent(Password_Obj["pwd"]["eye_icon"], "click", _self.showPwd, {
            "target": "pwd"
        });
        util.addEvent(Password_Obj["confirmpwd"]["input"], "focus", _self.onFocusEventHandler, {
            "target": "confirmpwd"
        });
        util.addEvent(Password_Obj["confirmpwd"]["input"], "blur", _self.keyupEventHandler_noChk, {
            "target": "confirmpwd"
        });
        util.addEvent(Password_Obj["confirmpwd"]["eye_icon"], "click", _self.showPwd, {
            "target": "confirmpwd"
        });
        util.setInfEvent(ps_icon, {
            "_focus": ps_txt,
            "_setView": ps_icon,
            "_viewClass": "active"
        });
        util.addEvent(SUBMIT, "click", _self.submitEventHandler);
        util.addEvent(Password_Obj["oldpwd"]["input"], "keyup", _self.keyupEventHandler_noChk, {
            "target": "oldpwd"
        });
        util.addEvent(Password_Obj["pwd"]["input"], "keyup", _self.keyupEventHandler, {
            "target": "pwd"
        });
        util.addEvent(Password_Obj["confirmpwd"]["input"], "keyup", _self.keyupEventHandler_noChk, {
            "target": "confirmpwd"
        });
        util.addEvent(chg_DONE, "click", _self.DONEHome);
        topFrame.closeRightPanel();
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        })
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS_code = parentClass.getThis("LS_code");
        LS = parentClass.getThis("LS");
        topFrame = parentClass.getThis("topFrame");
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
    _self.onFocusEventHandler = function(evt, param) {
        Password_Obj[param.target]["box"].className = "ps_input focus_input";
        Password_Obj[param.target]["msg"].style.display = "none"
    };
    _self.onBlurEventHandler = function(evt, param) {
        Password_Obj[param.target]["box"].className = "ps_input";
        if (Password_Obj[param.target]["input"].value == "") {
            Password_Obj[param.target]["box"].className = "ps_input err_input";
            Password_Obj[param.target]["msg"].innerHTML = LS.get("empty_passwd");
            Password_Obj[param.target]["msg"].style.display = ""
        }
    };
    _self.keyupEventHandler = function(keyEvent, param) {
        if (keyEvent.type == "blur" && Password_Obj[param.target]["input"].value == "") {
            Password_Obj[param.target]["box"].className = "ps_input err_input";
            Password_Obj[param.target]["msg"].innerHTML = LS.get("empty_passwd");
            Password_Obj[param.target]["msg"].style.display = "";
            return
        }
        strengthTxt.style.display = "";
        _self.checkThisPassword(Password_Obj[param.target]["input"].value);
        var res = util.str_chk(Password_Obj[param.target]["input"].value);
        _self.strchk_Msg(res);
        if (Password_Obj[param.target]["input"].value == "")
            strengthTxt.style.display = "none";
        var chk_ = _self.chk_confirmpwd(false);
        if (keyEvent.keyCode == 0)
            charCode = keyEvent.which;
        else
            charCode = keyEvent.keyCode ? keyEvent.keyCode : keyEvent.which;
        if (charCode == "13")
            if (res == "chk_OK")
                _self.submitEventHandler()
    };
    _self.keyupEventHandler_noChk = function(keyEvent, param) {
        if (keyEvent.type == "blur" && Password_Obj[param.target]["input"].value == "") {
            Password_Obj[param.target]["box"].className = "ps_input err_input";
            Password_Obj[param.target]["msg"].innerHTML = LS.get("empty_passwd");
            Password_Obj[param.target]["msg"].style.display = "";
            return
        }
        if (Password_Obj[param.target]["input"].value == "") {
            SUBMIT.disabled = true;
            Password_Obj[param.target]["box"].className = "ps_input";
            Password_Obj[param.target]["msg"].style.display = "none"
        }
        if (param.target == "confirmpwd")
            var chk_ = _self.chk_confirmpwd(true);
        if (keyEvent.keyCode == 0)
            charCode = keyEvent.which;
        else
            charCode = keyEvent.keyCode ? keyEvent.keyCode : keyEvent.which;
        if (charCode == "13")
            _self.submitEventHandler()
    };
    _self.chk_confirmpwd = function(show_err) {
        var str_out = true;
        if (Password_Obj["confirmpwd"]["input"].value != Password_Obj["pwd"]["input"].value || Password_Obj["confirmpwd"]["input"].value == "" && Password_Obj["pwd"]["input"].value == "") {
            SUBMIT.disabled = true;
            if (show_err) {
                Password_Obj["confirmpwd"]["box"].className = "ps_input err_input";
                Password_Obj["confirmpwd"]["msg"].innerHTML = LS_account.get("confirmpwd_diff");
                Password_Obj["confirmpwd"]["msg"].style.display = ""
            }
            str_out = false
        } else {
            if (show_err) {
                Password_Obj["confirmpwd"]["box"].className = "ps_input";
                Password_Obj["confirmpwd"]["msg"].style.display = "none"
            }
            var res = util.str_chk(Password_Obj["pwd"]["input"].value);
            _self.strchk_Msg(res);
            if (res == "chk_OK") {
                Password_Obj["confirmpwd"]["box"].className = "ps_input";
                Password_Obj["confirmpwd"]["msg"].style.display = "none";
                SUBMIT.disabled = false
            }
        }
        return str_out
    };
    _self.DONEHome = function() {
        parentClass.dispatchEvent("bodyGoToPage", {
            "page": "dashboard_main",
            "pageName": "dashboard"
        })
    };
    _self.submitEventHandler = function(mouseEvent, targetObj) {
        Password_Obj["oldpwd"]["box"].className = "ps_input";
        Password_Obj["pwd"]["box"].className = "ps_input";
        Password_Obj["confirmpwd"]["box"].className = "ps_input";
        var ret = _self.checkFormat(["oldpwd", "pwd", "confirmpwd"]);
        if (ret == "")
            _self.connetToServer();
        else
            util.echo("chg_pwd error")
    };
    _self.checkFormat = function(arr_chk) {
        var str_out = "";
        var errr_use_msg = {
            "oldpwd": "curPwd_Null",
            "pwd": "err_pwd_rule",
            "confirmpwd": "pwd_Null"
        };
        for (var key in arr_chk) {
            var chk_type = arr_chk[key];
            if (Password_Obj[chk_type]["input"].value == "") {
                Password_Obj[chk_type]["msg"].style.display = "";
                Password_Obj[chk_type]["box"].className = "ps_input err_input";
                Password_Obj[chk_type]["msg"].innerHTML = LS_account.get(errr_use_msg[chk_type]);
                SUBMIT.disabled = true;
                str_out = chk_type;
                break
            }
            if (chk_type == "pwd") {
                var res = util.str_chk(Password_Obj["pwd"]["input"].value);
                _self.strchk_Msg(res);
                if (res != "chk_OK") {
                    SUBMIT.disabled = true;
                    str_out = chk_type;
                    break
                }
            }
            if (chk_type == "confirmpwd") {
                var chk_ = _self.chk_confirmpwd(true);
                if (!chk_) {
                    SUBMIT.disabled = true;
                    str_out = chk_type;
                    break
                }
            }
        }
        return str_out
    };
    _self.connetToServer = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&old_pwd=" + Password_Obj["oldpwd"]["input"].value;
        urlParams += "&new_pwd=" + Password_Obj["pwd"]["input"].value;
        urlParams += "&confirm_pwd=" + Password_Obj["confirmpwd"]["input"].value;
        urlParams = "p=get_chg_pwd_inside&action=chgPwd&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.connectComplete = function(data) {
        try {
            var arr_data = JSON.parse(data);
            util.echo(arr_data);
            if (util.chkErrorMsg(arr_data, LS_code))
                return;
            if (arr_data["msg"] == "success") {
                if (arr_data["code"] == "none") {
                    div_set_pwd.style.display = "none";
                    div_set_done.style.display = ""
                }
            } else if (arr_data["code"] == "4X018") {
                Password_Obj["oldpwd"]["box"].className = "ps_input err_input";
                Password_Obj["oldpwd"]["msg"].style.display = "";
                Password_Obj["oldpwd"]["msg"].innerHTML = LS_code.get(arr_data["code"])
            } else if (arr_data["code"] == "diff") {
                Password_Obj["confirmpwd"]["box"].className = "ps_input err_input";
                Password_Obj["confirmpwd"]["msg"].style.display = "";
                Password_Obj["confirmpwd"]["msg"].innerHTML = LS_account.get("confirmpwd_diff");
                SUBMIT.disabled = true
            } else {
                Password_Obj["pwd"]["input"].value = "";
                Password_Obj["confirmpwd"]["input"].value = "";
                Password_Obj["pwd"]["box"].className = "ps_input err_input";
                SUBMIT.disabled = true;
                Password_Obj["pwd"]["msg"].style.display = "";
                Password_Obj["pwd"]["msg"].innerHTML = LS_code.get(arr_data["code"])
            }
        } catch (e) {
            util.echo("something wrong !!")
        }
    };
    _self.onError = function() {
        util.echo("onError")
    };
    _self.showPwd = function(evt, param) {
        if (Password_Obj[param.target]["input"].getAttribute("type") == "password") {
            Password_Obj[param.target]["input"].setAttribute("type", "text");
            Password_Obj[param.target]["eye_icon"].className = "eye_icon"
        } else {
            Password_Obj[param.target]["input"].setAttribute("type", "password");
            Password_Obj[param.target]["input"].setAttribute("autocomplete", "new-password");
            Password_Obj[param.target]["eye_icon"].className = "no_eye_icon"
        }
    };
    _self.backPage = function(e, param) {
        parentClass.dispatchEvent("backToIdex", {
            "retFun": _self.backPageComplete
        })
    };
    _self.backPageComplete = function() {
        util.echo("backPageComplete")
    };
    _self.checkThisPassword = function(password) {
        var checked = zxcvbn(password);
        var timetocrack = checked.crack_time;
        var strength = checked.score;
        var timeinwords = _self.toWords(timetocrack);
        document.getElementById("first_estimate").innerHTML = timeinwords;
        if (password == "")
            strength = 5;
        _self.displayStrength(strength)
    };
    _self.displayStrength = function(c) {
        var f = LS.get("pwd_Very Weak");
        var e = "";
        if (c == 0) {
            f = LS.get("pwd_Very Weak");
            e = "word_red";
            pwd_light.className = "ps_strength_img ps_strength_light1"
        }
        if (c == 1) {
            f = LS.get("pwd_Weak");
            e = "word_red";
            pwd_light.className = "ps_strength_img ps_strength_light2"
        }
        if (c == 2) {
            f = LS.get("pwd_Fair");
            e = "word_darkGreen";
            pwd_light.className = "ps_strength_img ps_strength_light3"
        }
        if (c == 3) {
            f = LS.get("pwd_Good");
            e = "word_darkGreen";
            pwd_light.className = "ps_strength_img ps_strength_light4"
        }
        if (c == 4) {
            f = LS.get("pwd_Strong");
            e = "word_darkGreen";
            pwd_light.className = "ps_strength_img ps_strength_light5"
        }
        if (c == 5) {
            f = "";
            pwd_light.className = "ps_strength_img"
        }
        document.getElementById("complexity-span").innerHTML = f;
        document.getElementById("complexity-span").className = e
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
            number = number / hundred;
            if (number > 9)
                numberWords = LS.get("pwd_THOUSAND")
        }
        if (twoDP)
            decimalPoint = 100;
        else
            decimalPoint = 1;
        number = Math.round(number * decimalPoint) / decimalPoint;
        numberWords = number + numberWords;
        return numberWords
    };
    _self.strchk_Msg = function(str) {
        if (str == "err_combination") {
            Password_Obj["pwd"]["msg"].style.display = "";
            Password_Obj["pwd"]["msg"].innerHTML = LS_account.get("err_pwd_rule");
            Password_Obj["pwd"]["box"].className = "ps_input err_input";
            SUBMIT.disabled = true
        } else if (str == "err_length") {
            Password_Obj["pwd"]["msg"].style.display = "";
            Password_Obj["pwd"]["msg"].innerHTML = LS_account.get("err_pwd_rule");
            Password_Obj["pwd"]["box"].className = "ps_input err_input";
            SUBMIT.disabled = true
        } else if (str == "err_contain") {
            Password_Obj["pwd"]["msg"].style.display = "";
            Password_Obj["pwd"]["msg"].innerHTML = LS_account.get("err_pwd_rule");
            Password_Obj["pwd"]["box"].className = "ps_input err_input";
            SUBMIT.disabled = true
        } else if (str == "err_charactersNum") {
            Password_Obj["pwd"]["msg"].style.display = "";
            Password_Obj["pwd"]["msg"].innerHTML = LS_account.get("err_pwd_block");
            Password_Obj["pwd"]["box"].className = "ps_input err_input";
            SUBMIT.disabled = true
        } else if (str == "err_block_string") {
            Password_Obj["pwd"]["msg"].style.display = "";
            Password_Obj["pwd"]["msg"].innerHTML = LS_account.get("err_pwd_block");
            Password_Obj["pwd"]["box"].className = "ps_input err_input";
            SUBMIT.disabled = true
        } else if (str == "chk_OK") {
            Password_Obj["pwd"]["msg"].style.display = "none";
            Password_Obj["pwd"]["box"].className = "ps_input";
            if (Password_Obj["confirmpwd"]["input"].value != Password_Obj["pwd"]["input"].value)
                SUBMIT.disabled = false;
            else
                SUBMIT.disabled = true
        } else {
            util.echo("chk wrong!!" + str);
            Password_Obj["pwd"]["msg"].style.display = "";
            Password_Obj["pwd"]["msg"].innerHTML = LS_account.get("err_pwd_rule");
            Password_Obj["pwd"]["box"].className = "ps_input err_input";
            SUBMIT.disabled = true
        }
    }
};
