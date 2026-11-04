function chg_pwd_inside(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object();
    var util;
    var LS_code;
    var LS;
    var LS_account;
    var topFrame;
    var ps_isShow = false;
    var oldpwd_isShow = true;
    var pwd_isShow = true;
    var OLDpwd;
    var cpbox;
    var pwd;
    var npbox;
    var eye_oldpwd;
    var eye_pwd;
    var SUBMIT;
    var ps_icon;
    var ps_txt;
    var pwd_light;
    var cnp;
    var cp;
    var strengthTxt;
    var chg_DONE;
    var div_set_pwd;
    var div_set_done;

    _self.init = function () {
        parentClass.dispatchEvent("chgPageName", { "pageName": "chg_pwd_inside" });
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        OLDpwd = dom.getElementById("OLDpwd");
        cpbox = dom.getElementById("cpbox");
        pwd = dom.getElementById("pwd");
        npbox = dom.getElementById("npbox");
        eye_oldpwd = dom.getElementById("eye_oldpwd");
        eye_pwd = dom.getElementById("eye_pwd");
        SUBMIT = dom.getElementById("SUBMIT");
        ps_icon = dom.getElementById("ps_icon");
        ps_txt = dom.getElementById("ps_txt");
        pwd_light = dom.getElementById("pwd_light");
        cnp = dom.getElementById("cnp");
        cp = dom.getElementById("cp");
        strengthTxt = dom.getElementById("strengthTxt");
        chg_DONE = dom.getElementById("chg_DONE");
        div_set_pwd = dom.getElementById("div_set_pwd");
        div_set_done = dom.getElementById("div_set_done");



        util.addEvent(OLDpwd, "focus", _self.onFocusEventHandler, { "target": "oldpwd" });
        util.addEvent(OLDpwd, "blur", _self.onBlurEventHandler, { "target": "oldpwd" });
        util.addEvent(pwd, "focus", _self.onFocusEventHandler, { "target": "pwd" });
        util.addEvent(pwd, "blur", _self.onBlurEventHandler, { "target": "pwd" });
        util.addEvent(eye_oldpwd, "click", _self.showOldPwd);
        util.addEvent(eye_pwd, "click", _self.showPwd);

        util.setInfEvent(ps_icon, { "_focus": ps_txt, "_setView": ps_icon, "_viewClass": "active" });

        util.addEvent(SUBMIT, "click", _self.submitEventHandler);

        util.addEvent(pwd, "keyup", _self.keyupEventHandler);
        util.addEvent(OLDpwd, "keyup", _self.keyupEventHandler_noChk);

        util.addEvent(chg_DONE, "click", _self.DONEHome);
        topFrame.closeRightPanel();
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS_code = parentClass.getThis("LS_code");
        LS = parentClass.getThis("LS");
        topFrame = parentClass.getThis("topFrame");
        LS_account = parentClass.getThis("LS_account");
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }

    //onFocus
    _self.onFocusEventHandler = function (evt, param) {
        if (param.target == "oldpwd") {
            cpbox.className = "ps_input focus_input";
        }
        else if (param.target == "pwd") {
            npbox.className = "ps_input focus_input";
        }
        else if (param.target == "ps_icon") {
            ps_txt.style.display = "";
        }
    }

    //onBlur
    _self.onBlurEventHandler = function (evt, param) {
        //targetObj.placeholder=targetObj.txt;
        if (param.target == "oldpwd") {
            cpbox.className = "ps_input";
        }
        else if (param.target == "pwd") {
            npbox.className = "ps_input";
        }
        else if (param.target == "ps_icon") {
            ps_isShow = false;
            ps_txt.style.display = "none";
        }
    }


    _self.keyupEventHandler = function (keyEvent, targetObj) {
        strengthTxt.style.display = "";
        _self.checkThisPassword(pwd.value);
        //var res = _self.str_chk(pwd.value);
        var res = util.str_chk(pwd.value,2);
        _self.strchk_Msg(res);
        if (pwd.value == "") {
            strengthTxt.style.display = "none";
            npbox.className = "ps_input";
            cnp.style.display = "none";
        }

        if (keyEvent.keyCode == 0) {
            charCode = keyEvent.which;
        } else {
            charCode = (keyEvent.keyCode) ? keyEvent.keyCode : keyEvent.which;
        }

        if (charCode == "13") {
            if (res=="chk_OK")_self.submitEventHandler();
            //targetObj.blur();
        }
    }

    _self.keyupEventHandler_noChk = function (keyEvent, targetObj) {
        if (OLDpwd.value == ""){
            SUBMIT.disabled = true;
            cpbox.className = "ps_input";
            cp.style.display = "none";
        }
        if (keyEvent.keyCode == 0) {
            charCode = keyEvent.which;
        } else {
            charCode = (keyEvent.keyCode) ? keyEvent.keyCode : keyEvent.which;
        }

        if (charCode == "13") {
            _self.submitEventHandler();
            //targetObj.blur();
        }
    }

    //done
    _self.DONEHome = function () {
        parentClass.dispatchEvent("bodyGoToPage", { "page": "dashboard_main", "pageName": "dashboard"});
    }

    //submit
    _self.submitEventHandler = function (mouseEvent, targetObj) {
        //alert("user="+_mc["user"].value+"\npwd="+_mc["pwd"].value);
        cpbox.className = "ps_input";
        npbox.className = "ps_input";

        var ret = _self.checkFormat(OLDpwd.value,pwd.value);

        if (ret == "") {
            _self.connetToServer();
        } else {
            util.echo("chg_pwd error");
        }
    }

    //check format
    _self.checkFormat = function (oldpwd,pwd) {
        if (oldpwd == "") {
            cp.style.display = "";
            cpbox.className = "ps_input err_input";
            //cnp.innerHTML = "Please enter your current password."
            cp.innerHTML=LS_account.get("curPwd_Null");
            return "cp";
        }
        else if(pwd==""){
                cnp.style.display="";
                npbox.className="ps_input err_input";
                cnp.innerHTML=LS_account.get("err_pwd_rule");
                return "np";
        }
        return "";
    }

    _self.connetToServer = function () {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&old_pwd=" + OLDpwd.value;
        urlParams += "&new_pwd=" + pwd.value;
        urlParams = "p=get_chg_pwd_inside&action=chgPwd&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.connectComplete = function (data) {
        try {
            var arr_data = JSON.parse(data);
            util.echo(arr_data);
            if (util.chkErrorMsg(arr_data, LS_code)) return;
            if (arr_data["msg"] == "success") {
                if (arr_data["code"] == "none") {
                    //導向新頁面
                    div_set_pwd.style.display = "none";
                    div_set_done.style.display = "";
                    //top.pwd = pwd.value;
                }
            } else {
                //秀錯誤訊息(*)
                if (arr_data["code"] == "4X018") {
                    cpbox.className = "ps_input err_input";
                } else {
                    pwd.value = "";
                    npbox.className = "ps_input err_input";
                    SUBMIT.disabled = true;
                }
                cnp.style.display = "";
                cnp.innerHTML = LS_code.get(arr_data["code"]);
            }
        } catch (e) {
            util.echo("something wrong !!");
        }

    }

    _self.onError = function () {
        util.echo("onError");
    }

    //密碼明碼
    _self.showPwd = function () {
        if (!pwd_isShow) {
            pwd_isShow = true;
            pwd.setAttribute("type", "text");
            eye_pwd.className = "eye_icon";
        } else {
            pwd_isShow = false;
            pwd.setAttribute("type", "password");
            pwd.setAttribute("autocomplete", "new-password");
            eye_pwd.className = "no_eye_icon";
        }
    }

    _self.showOldPwd = function () {
        if (!oldpwd_isShow) {
            oldpwd_isShow = true;
            OLDpwd.setAttribute("type", "text");
            eye_oldpwd.className = "eye_icon";
        } else {
            oldpwd_isShow = false;
            OLDpwd.setAttribute("type", "password");
            OLDpwd.setAttribute("autocomplete", "new-password");
            eye_oldpwd.className = "no_eye_icon";
        }
    }

    _self.showPs = function () {
        if (!ps_isShow) {
            ps_isShow = true;
            ps_txt.style.display = "";
        } else {
            ps_isShow = false;
            ps_txt.style.display = "none";
        }
    }


    _self.backPage = function (e, param) {
        parentClass.dispatchEvent("backToIdex", { "retFun": _self.backPageComplete });
    }

    _self.backPageComplete = function () {
        util.echo("backPageComplete");
    }

    _self.checkThisPassword = function (password) {
        var checked = zxcvbn(password);
        var timetocrack = checked.crack_time;
        var strength = checked.score;

        var timeinwords = _self.toWords(timetocrack);

        //document.getElementById("first_estimate").innerHTML = '<h1>'+timeinwords+'</h1>';
        document.getElementById("first_estimate").innerHTML = timeinwords;
        if (password == "") strength = 5;

        _self.displayStrength(strength); //強弱程度

    }
    //James 19/04/30 496.繁簡-密碼强度
    _self.displayStrength = function (c) {
        var f = LS.get("pwd_Very Weak");
        var e = "";
        if (c == 0) {
            f = LS.get("pwd_Very Weak");
            e = "word_red";
            document.getElementById("pwd_light").className = "ps_strength_img ps_strength_light1";
        }
        if (c == 1) {
            f = LS.get("pwd_Weak");
            e = "word_red";
            document.getElementById("pwd_light").className = "ps_strength_img ps_strength_light2";
        }
        if (c == 2) {
            f = LS.get("pwd_Fair");
            e = "word_darkGreen";
            document.getElementById("pwd_light").className = "ps_strength_img ps_strength_light3";
        }
        if (c == 3) {
            f = LS.get("pwd_Good");
            e = "word_darkGreen";
            document.getElementById("pwd_light").className = "ps_strength_img ps_strength_light4";
        }
        if (c == 4) {
            f = LS.get("pwd_Strong");
            e = "word_darkGreen";
            document.getElementById("pwd_light").className = "ps_strength_img ps_strength_light5";
        }
        if (c == 5) {
            f = "";
            document.getElementById("pwd_light").className = "ps_strength_img";
        }
        document.getElementById("complexity-span").innerHTML = f;
        document.getElementById("complexity-span").className = e;
        //document.getElementById("complexity").style.backgroundColor = "#" + e;
    }
    //James 19/04/30 496.繁簡-密碼强度
    _self.toWords = function (number) {

        //is merely seconds, just return rounded numebr
        if (number < 120) {
            return _self.getNumberWords(number, true) + LS.get("pwd_break_Seconds");
        }
        var hour = 60 * 60;
        if (number < hour) {
            minutes = number / 60;
            return _self.getNumberWords(minutes, true) + " " + LS.get("pwd_break_Minutes");
        }

        var day = hour * 24;
        if (number < (2 * day)) {
            hours = number / hour;
            return _self.getNumberWords(hours) + " " + LS.get("pwd_break_Hours");
        }

        var month = day * 30;
        if (number < month) {
            days = number / day;
            return _self.getNumberWords(days) + " " + LS.get("pwd_break_Days");
        }

        var year = day * 365;
        if (number < year) {
            months = number / month;
            return _self.getNumberWords(months) + " " + LS.get("pwd_break_Months");
        }

        var century = year * 100;
        if (number < century * 10) {
            years = number / year;
            return _self.getNumberWords(years) + " " + LS.get("pwd_break_Years");
        }

        if (number < century * 100) {
            centuries = number / century;
            return _self.getNumberWords(centuries) + " " + LS.get("pwd_break_Centuries");
        }

        years = number / year;
        return _self.getNumberWords(years) + " " + LS.get("pwd_break_Years");
    }
    //James 19/05/03 515.繁簡-密碼強度-強度和破解時間都沒有翻譯到
    _self.getNumberWords = function (number, twoDP) {
        var numberWords = "";

        var trillion = Math.pow(10, 12);
        var billion = Math.pow(10, 9);
        var hundred_million = Math.pow(10, 8)
        var million = Math.pow(10, 6);
        var ten_thousand = Math.pow(10, 4);
        var thousand = Math.pow(10, 3);
        var hundred = Math.pow(10, 2);

        if (top.langx == "en-us") {
            if (number / trillion >= 1) {
                numberWords = "TRILLION";
                number = number / trillion;
            }

            else if (number / billion >= 1) {
                numberWords = "BILLION";
                number = number / billion;
            }

            else if (number / million >= 1) {
                numberWords = "MILLION";
                number = number / million;
            }

            else if (number / thousand >= 1) {
                numberWords = "THOUSAND";
                number = number / thousand;
            }

            else if (number / hundred >= 1) {
                numberWords = "HUNDRED";
                number = number / hundred;
            }
        }
        else if (top.langx == "zh-tw" || top.langx == "zh-cn") {
            if (number / trillion >= 1) {
                numberWords = LS.get("pwd_TRILLION");
                number = number / trillion;
            }

            else if (number / hundred_million >= 1) {
                numberWords = LS.get("pwd_100_MILLION");
                number = number / hundred_million;
            }

            else if (number / ten_thousand >= 1) {
                numberWords = LS.get("pwd_10_THOUSAND");
                number = number / ten_thousand;
            }

            else if (number / thousand >= 1) {
                numberWords = LS.get("pwd_THOUSAND");
                number = number / thousand;
            }

            else if (number / hundred >= 1) {
                numberWords = LS.get("pwd_HUNDRED");
                number = number / hundred;
                if(number>9) {
                    numberWords = LS.get("pwd_THOUSAND");
                }
            }
        }
        if (twoDP) {
            decimalPoint = 100;
        } else {
            decimalPoint = 1;
        }
        number = (Math.round(number * decimalPoint) / decimalPoint)
        numberWords = number + numberWords;

        return numberWords;
    }

    _self.strchk_Msg=function(str){
        if(str == "err_combination"){
            cnp.style.display = "";
            cnp.innerHTML = LS_account.get("err_pwd_rule");
            npbox.className="ps_input err_input";
            SUBMIT.disabled = true;
        }
        else if(str == "err_length"){
            cnp.style.display = "";
            cnp.innerHTML = LS_account.get("err_pwd_rule");
            npbox.className="ps_input err_input";
            SUBMIT.disabled = true;
        }
        else if(str == "err_contain"){
            cnp.style.display = "";
            cnp.innerHTML = LS_account.get("err_pwd_rule");
            npbox.className="ps_input err_input";
            SUBMIT.disabled = true;
        }
        else if(str == "err_charactersNum"){
            cnp.style.display = "";
            cnp.innerHTML = LS_account.get("err_pwd_block");
            npbox.className="ps_input err_input";
            SUBMIT.disabled = true;
        }
        else if(str == "err_block_string"){
            cnp.style.display = "";
            cnp.innerHTML = LS_account.get("err_pwd_block");
            npbox.className="ps_input err_input";
            SUBMIT.disabled = true;
        }
        else if(str == "chk_OK"){
            cnp.style.display = "none";
            npbox.className="ps_input";
            SUBMIT.disabled = false;
        }
        else{
            util.echo("chk wrong!!" + str);
            cnp.style.display = "";
            cnp.innerHTML = LS_account.get("err_pwd_rule");
            npbox.className = "ps_input err_input";
            SUBMIT.disabled = true;
        }
    }

    // //新密碼檢查流程
    // _self.str_chk = function (str) {
    //     npbox.className = "ps_input ";
    //     var str_char = 0;
    //     var str_len = str.length;
    //     for (var i = 0; i < str_len; i++) {
    //         var tmp_str = str.substr(i, 1);
    //         if (tmp_str.match(/[aA-zZ]/)) str_char++;
    //     }
    //     //新密碼不是由英數字組成
    //     if (!str.match(/^[0-9aA-zZ]+$/)) {
    //         cnp.style.display = "";
    //         cnp.innerHTML = "Your Password must be between 6 to 12 alphanumeric (A-Z & 0-9) characters";
    //         npbox.className = "ps_input err_input";
    //         SUBMIT.disabled = true;
    //         return false;
    //     }
    //     //新密碼低於6個字或是大於12個字
    //     if (str_len < 6 || str_len > 12) {
    //         cnp.style.display = "";
    //         cnp.innerHTML = "Your Password must be between 6 to 12 alphanumeric (A-Z & 0-9) characters";
    //         npbox.className = "ps_input err_input";
    //         SUBMIT.disabled = true;
    //         return false;
    //     }

    //     //新密碼跟密碼一樣
    //     if (str == top.pwd) {
    //         cnp.style.display = "";
    //         cnp.innerHTML = "Your new Password cannot be the same as your Current Password. Please try again.";
    //         npbox.className = "ps_input err_input";
    //         SUBMIT.disabled = true;
    //         return false;
    //     }
    //     //新密碼跟帳號或安全代碼一樣
    //     else if (str == top.username || str == top.pwdSafe) {
    //         cnp.style.display = "";
    //         cnp.innerHTML = "New Password cannot be the same as you login ID or safe code.";
    //         npbox.className = "ps_input err_input";
    //         SUBMIT.disabled = true;
    //         return false;
    //     }
    //     //新密碼裡面含有空格或是底線
    //     else if (str.match(/\s/) || str.match(/_/)) {
    //         cnp.style.display = "";
    //         cnp.innerHTML = "Your Password must be between 6 to 12 alphanumeric (A-Z & 0-9) characters";
    //         npbox.className = "ps_input err_input";
    //         SUBMIT.disabled = true;
    //         return false;
    //     }
    //     else if (str_char >= 1 && str_len > str_char) {
    //         cnp.style.display = "none";
    //         npbox.className = "ps_input";
    //         SUBMIT.disabled = false;
    //         return true;
    //     }
    //     return;
    // }

}