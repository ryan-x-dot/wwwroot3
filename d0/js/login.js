function login(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object();
    var layerFun = new Object();
    var util;
    var LS_code;
    var LS_account;
    var login_layer = "d0";

    //Ricky
    var pwd_isShow = false;
    var lang_isShow = false;
    var site_isShow = false;
    var totalAD;
    var nowAD = 1;
    var animate_div;
    var selLayer = "A";//預設登1

    var cookieAry = new Array();
    var lang_btn;
    var zh_tw;
    var zh_cn;
    var en_us;
    var user;
    var user_div;
    var pwd;
    var pwd_div;
    var verifycode;
    var verifycode_div;
    var verifycode_img;
    var text_msg;
    var pwd_eye_icon;
    var hr_info;
    var hr_info1;
    var hr_info2;
    var hr_infoTXT;
    var hr_info1TXT;
    var hr_info2TXT;
    var remember;
    var forgot_pwd;
    var login_btn;
    var loginold_btn;
    var pwdHtmlTemp;

    var firstTouch = false;
    var touchStartPos = 0;
    var touch = null; // 第一個接觸點
    var touchPoint = 5; //移動多少pixel數才觸發事件

    var timeObj;
    var timeOut = 300; //登入的延遲時間

    var _mc = new Object();
    var tag = "•";

    _self.init = function () {
        if(!top.login_layer) top.login_layer=login_layer;
        // util.echo("login load complete");
        top.blackbox = '';
        /*if (iovationURL != '') {
            var p = dom.location.protocol;
            p = p.replace(":", "")
            iovation_Proxy = iovation_Proxy.replace("http", "");
            iovation_Proxy = iovation_Proxy.replace("https", "");
            iovationURL = p + iovation_Proxy + "/iovation/vindex.html?webProtocal=" + p + "&webDomain=" + dom.domain;
            dom.getElementById("ddnet_corp_func1").src = iovationURL;
            //top.blackbox = dom.getElementById("ddnet_corp_func1").blackbox ;
        } else {
            top.blackbox = " no blackbox ";
        }*/

        lang_btn = dom.getElementById("lang_btn"); //語系箭頭
        //lang_target = dom.getElementById("lang_target");
        zh_tw = dom.getElementById("lg_lan_tw");
        zh_cn = dom.getElementById("lg_lan_cn");
        en_us = dom.getElementById("lg_lan_us");

        user = dom.getElementById("username");//帳號
        user_div = dom.getElementById("username_div");//帳號框
        pwd = dom.getElementById("pwd");//密碼
        pwdHtmlTemp = pwd.outerHTML.replace(new RegExp("type=*password*", "gi"), "*TYPE*");
        pwd_div = dom.getElementById("pwd_div");//密碼框
        pwd_eye_icon = dom.getElementById("pwd_eye_icon"); //密碼明碼
        verifycode = dom.getElementById("verifycode");//验证码
        text_msg = dom.getElementById("text_msg");//未設定安全代碼不需輸入
        verifycode_div = dom.getElementById("verifycode_div");//验证码框
        verifycode_img = dom.getElementById("verifycode_img");//验证码图片
        hr_info = dom.getElementById("hr_info");//帳號框下的錯誤訊息
        hr_info1 = dom.getElementById("hr_info1");//密码框下的錯誤訊息
        hr_info2 = dom.getElementById("hr_info2");//验证码框下的錯誤訊息
        hr_infoTXT = dom.getElementById("hr_infoTXT");//帳號框下的錯誤訊息
        hr_info1TXT = dom.getElementById("hr_info1TXT");//密码框下的錯誤訊息
        hr_info2TXT = dom.getElementById("hr_info2TXT");//验证码框下的錯誤訊息
        remember = dom.getElementById("remember"); //記住帳號
        forgot_pwd = dom.getElementById("forgot_pwd"); //忘記密碼
        login_btn = dom.getElementById("loginBtn"); //登入鈕
        loginold_btn = dom.getElementById("loginoldBtn"); //登入鈕

        _mc["pwd"] = pwd;
        _mc["verifycode"] = verifycode;
        _mc["pwd"].val = "";
        _mc["verifycode"].val = "";

        util.addEvent(pwd, "focus", _self.onFocusEventHandler, {"type": "pwd"});
        util.addEvent(pwd, "blur", _self.onBlurEventHandler, {"type": "pwd"});

        util.addEvent(login_btn, "click", _self.doLogin);
        util.addEvent(loginold_btn, "click", _self.cntToOldSite);
        util.addEvent(pwd_eye_icon, "click", _self.showPwd);
        util.addEvent(verifycode_img,"click",_self.verifycodeImg);
        util.addEvent(lang_btn, "click", _self.showLang);
        util.addEvent(lang_btn, "focus", _self.onFocusEventHandler);
        util.addEvent(lang_btn, "blur", _self.onBlurEventHandler);

        util.addEvent(zh_tw, "click", _self.chgLang, {"langx": "zh-tw", "ls": "tw", "class": "hk"});
        util.addEvent(zh_cn, "click", _self.chgLang, {"langx": "zh-cn", "ls": "cn", "class": "cn"});
        util.addEvent(en_us, "click", _self.chgLang, {"langx": "en-us", "ls": "us", "class": "en"});

        _self.addEventListener("startTimer", _self.startTimer);
        _self.addEventListener("stopTimer", _self.stopTimer);
        _self.addEventListener("clearTimer", _self.clearTimer);
        _self.addEventListener("showFadeOutMesg", _self.showFadeOutMesg);
        util.addEvent(user, "keyup", _self.keyupEventHandler, {"type": "user"});
        util.addEvent(pwd, "keyup", _self.keyupEventHandler, {"type": "pwd"});
        util.addEvent(verifycode, "keyup", _self.keyupEventHandler, {"type": "user"});

        // //依照語系換登入頁(*)

        //_self.setLayerFun(null, {"layer": selLayer});

        cookieAry = document.cookie.split(";");
        _self.doCookie("ag_user" + selLayer);


        if (!_self.chg_site()) return; // 不支援的不跑廣告邏輯
        //==== AD func
        animate_div = dom.getElementById("animate_div");
        //ad_Dot = dom.getElementById("ad_Dot");
        preBtn = dom.getElementById("preBtn"); //廣告上一頁按鈕
        nextBtn = dom.getElementById("nextBtn"); //廣告下一頁按鈕
        totalAD = animate_div.children.length; //全部廣告數量(包含最後一張)
        //左右鍵
        util.addEvent(preBtn, "click", _self.preAD);
        util.addEvent(nextBtn, "click", _self.nextAD);
        //廣告小圓點
        for (var i = 1; i <= totalAD - 1; i++) {
            util.addEvent(dom.getElementById("dot" + i), "click", _self.chgAD, {"now": i});
        }
        //touch事件
        util.addEvent(animate_div, "touchstart", _self.touchstart);
        util.addEvent(animate_div, "touchmove", _self.touchmove);
        util.addEvent(animate_div, "touchend", _self.touchend);

        _self.createTimer();
        _self.startTimer();
        //=============

    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
        config_set = parentClass.getThis("config_set");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash");
        selLayer = parentClass.getThis("selLayer");
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

    _self.keyupEventHandler = function (keyEvent, param) {

        var type = param.type;

        if (keyEvent.keyCode == 0) {
            charCode = keyEvent.which;
        } else {
            charCode = (keyEvent.keyCode) ? keyEvent.keyCode : keyEvent.which;
        }

        if (type != "user") _mc[type].val = _mc[type].value;

        if (charCode == "13") {
            //2019-04-10 Ricky 防止連點
            _self.doLogin();
            //targetObj.blur();
        }
    }

    _self.chgPwd = function (val) {
        var n = val.length;
        var ret = "";
        for (i = 0; i < n; i++) {
            ret += tag;
        }
        return ret;
    }

    _self.verifycodeImg = function () {
        verifycode_img.src = "verifycode.php?"+Math.random();
    }

    //onFocus
    _self.onFocusEventHandler = function (evt, param) {
        //lang_btn.className = "lg_languageG active";

        if ((pwd_isShow && evt.target.id == "pwd")) {

        } else {
            if (evt.target.value != null) {
                evt.target.value = _mc[param.type].val;
                evt.target.setAttribute("type", "password");
                evt.target.setAttribute("autocomplete", "new-password");
            }
        }


    }

    //onBlur
    _self.onBlurEventHandler = function (evt, param) {
        //lang_btn.className = "lg_languageG";
        // lang_isShow = false;
        if ((pwd_isShow && evt.target.id == "pwd")) {
        } else {
            if (evt.target.value != null) {
                _mc[param.type].val = evt.target.value;
                evt.target.value = _self.chgPwd(evt.target.value);
                evt.target.setAttribute("autocomplete", "off");
            }
        }
        evt.target.setAttribute("type", "text");

    }

    //2019-04-10 Ricky 防止連點
    _self.doLogin = function () {
        clearTimeout(timeObj);
        timeObj = setTimeout(_self.loginEventHandler, timeOut);
    }

    //login
    _self.loginEventHandler = function (mouseEvent, targetObj) {
        //alert("user="+_mc["user"].value+"\npwd="+_mc["pwd"].value);
        if (typeof autoLogin == "function") autoLogin();
        user_div.className = "lg_input u_icon";
        pwd_div.className = "lg_input p_icon";
        verifycode_div.className = "lg_input s_icon";
        hr_info.style.display = "none";
        hr_info1.style.display = "none";
        hr_info2.style.display = "none";
        var ret = _self.checkFormat(user.value, pwd.value, verifycode.value);

        if (ret == "") {
            //記住我的帳號(*)
            if (remember.checked) {
                // util.echo("remember is checked");
                //取cookie
                //setLocalStorageItem("username",_mc["user"].value);
            }
            //登入動作
            _self.connetToServer();

        } else {
            util.echo("login error");
        }
    }

    _self.cntToOldSite = function () {
        if (oldSite) util.topGoToUrl(oldSite, {"langx": top.langx});
    }

    //check format
    _self.checkFormat = function (user, pwd,verifycode) {
        if (user == "") {
            //帳號未輸入時，要秀錯誤訊息(*)
            hr_info.style.display = "";
            //19/04/30 James 517>現在登入帳號沒有輸入時, 顯示的提示訊息秀成英文
            hr_infoTXT.innerHTML = LS_account.get("loginID_Null");
            user_div.className = "lg_input u_icon err_input";
            return "login_user";
        }
        if (pwd == "") {
            hr_info1.style.display = "";
            hr_info1TXT.innerHTML = LS_account.get("pwd_Null");
            pwd_div.className = "lg_input p_icon err_input";
            return "login_pwd";
        }

        if (verifycode == "") {
            hr_info2.style.display = "";
            hr_info2TXT.innerHTML = LS_account.get("verifycode_Null");
            verifycode_div.className = "lg_input s_icon err_input";
            return "login_verifycode";
        }

        var regNum = /^\d+$/
        if (!regNum.test(verifycode)) {
            hr_info2.style.display = "";
            hr_info2TXT.innerHTML = LS_account.get("verifycode_Num");
            verifycode_div.className = "lg_input s_icon err_input";
            return "login_verifycode";
        }
        return "";
    }

    //密碼明碼
    _self.showPwd = function () {

        var ret = "";

        if (!pwd_isShow) {
            pwd_isShow = true;
            pwd_eye_icon.className = "eye_icon";
            pwd.setAttribute("type", "text");
            pwd.value = _mc["pwd"].val;
        } else {
            pwd_isShow = false;
            pwd_eye_icon.className = "no_eye_icon";
            pwd.setAttribute("type", "password");
            // ret = _self.chgPwd(pwd.val);

        }


        _self.changePage = function (e, param) {
            param.retFun = _self.changePageComplete;
            parentClass.dispatchEvent("GoToPage", param);
        }

        _self.changePageComplete = function () {
            // util.echo("changePageComplete");
        }

        _self.connetToServer = function () {
            util.removeEvent(login_btn, "click");
            if(!top.login_layer) top.login_layer=login_layer;
            var urlParams = "";
            urlParams += "login_layer="+top.login_layer;
            urlParams += "&username=" + user.value;
            // urlParams += "&pwd="+pwd.value;
            urlParams += "&pwd=" + _mc["pwd"].val;
            urlParams += "&uid=" + top.uid;
            urlParams += "&verifycode="+verifycode.value;
            urlParams += "&langx=" + top.langx;
            urlParams += "&auto=" + top.iovationKey;
            urlParams += "&blackbox=" + top.blackbox;
            urlParams = "p=login_chk&ver=" + top.ver + "&" + urlParams;
            var getHTML = new HttpRequest();
            getHTML.addEventListener("onError", _self.onError);
            getHTML.addEventListener("LoadComplete", _self.connectComplete);

            getHTML.loadURL(top.url, "POST", urlParams);
        }

        _self.connectComplete = function (data) {
            util.addEvent(login_btn, "click", _self.doLogin);
            try {
                var arr_data = new Object();
                try {
                    arr_data = JSON.parse(data);
                } catch (e) {
                    arr_data = (new Function("return " + data))();
                }

                if (util.chkErrorMsg(arr_data, LS_code)) return;
                top.uid = arr_data["uid"];
                top.login_layer = arr_data["login_layer"] ? arr_data["login_layer"] : login_layer;
                top.user_id = arr_data["user_id"];
                top.layer_id = arr_data["layer_id"];
                top.pri_type = arr_data["pri_type"];
                top.user_type = arr_data["user_type"];
                top.user_enable = arr_data["enable"];
                top.enable_pri = arr_data["enable_pri"];
                top.username = arr_data["username"];
                top.layer_username = arr_data["layer_username"];
                top.annCookie = "ag_" + top.login_layer + "_ann" + top.user_id;
                top.pay_type = arr_data["pay_type"];
                //console.log(top.pri_type);
                if (arr_data["code"] == "102") {
                    if (arr_data["status"] == "success") {
                        if (_self.chg_site()) {
                            _self.clearTimer();
                            //top.pwd =pwd.value;
                            var isChceked = remember.checked;
                            if (isChceked) {
                                document.cookie = "ag_user" + selLayer + "=" + user.value + ";";
                            } else {

                                cookieAry = document.cookie.split(";");
                                var ary = new Array();
                                for (var i = 0; i < cookieAry.length; i++) {
                                    var keys = cookieAry[i];
                                    var tmp = keys.split("=");
                                    if (tmp[0].indexOf("ag_user" + selLayer) != -1) {

                                        var d = new Date();
                                        d.setTime(d.getTime() - 1 * 3600 * 1000);
                                        var _value = tmp[0] + "=;";
                                        _value += 'expires=' + d.toGMTString() + ";";

                                        ary.unshift(_value);
                                    } else {
                                        ary.push(keys);
                                    }
                                }
                                document.cookie = ary.join(";");

                            }
                            if (arr_data["status_code"] == "4O000") {
                                //正常登入
                                parentClass.dispatchEvent("hideDiv", {
                                    "target": "acc_show",
                                    "retFun": _self.hideDivComplete
                                });

                            }
                            if (arr_data["status_code"] == "4O001") {
                                //修改密碼(*)
                                parentClass.dispatchEvent("chgPwd", {
                                    "target": "acc_show",
                                    "retFun": _self.hideDivComplete
                                });
                            }
                            if (arr_data["status_code"] == "4O007") {
                                //超過30(other_set name='chg_pwd_ag')天未修改密碼 要做修改密碼(*)
                                parentClass.dispatchEvent("chgPwd", {
                                    "target": "acc_show",
                                    "retFun": _self.hideDivComplete
                                });
                            }

                            if (arr_data["status_code"] == "4O002") {
                                if (selLayer == "C") {
                                    parentClass.dispatchEvent("chgLoginID", {
                                        "target": "acc_show",
                                        "retFun": _self.hideDivComplete
                                    });
                                } else {
                                    //修改安全代碼
                                    parentClass.dispatchEvent("chgPwdSafe", {
                                        "target": "acc_show",
                                        "retFun": _self.hideDivComplete
                                    });
                                }
                            }
                        } else {
                            var protocol = dom.location.protocol;
                            window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx;
                        }

                    } else {
                        //秀錯誤訊息(*)
                        if (arr_data["status_code"] == "4X004") {
                            user_div.className = "lg_input u_icon";
                            pwd_div.className = "lg_input p_icon";
                            verifycode_div.className = "lg_input p_icon";
                        } else {
                            user_div.className = "lg_input u_icon  err_input";
                            pwd_div.className = "lg_input p_icon  err_input";
                            verifycode_div.className = "lg_input s_icon  err_input";
                        }

                        //if(arr_data["status_code"] == "4X042"){
                        _self.verifycodeImg();
                        //}

                        hr_info2.style.display = "";
                        hr_info2TXT.innerHTML = LS_code.get(arr_data["status_code"]);
                        pwd.value = "";
                        verifycode.value = "";
                        //roland 577.登入頁-當輸入錯誤帳號密碼, 要再輸入密碼時, 頁面會自動填入資料, 原管理端不會(PJP-718)
                        _mc["pwd"].val = "";
                        _mc["verifycode"].val = "";
                    }

                } else {
                    hr_info1.style.display = "";
                    hr_info1TXT.innerHTML = "connect fail !!";
                }
            } catch (e) {
                util.echo("[login]something wrong !!");
                util.echo(e);
            }

        }

        _self.chg_site = function () {
            var ret = false;
            var agent = navigator.userAgent;
            var ie = "MSIE";
            var pos = agent.indexOf(ie);
            //Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET4.0C)

            //Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36
            //Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9
            var brows = new Array("Chrome", "Safari", "Firefox", "rv:11", "UCBrowser", "opr/");
            //alert(agent)
            if (pos != -1) {
                var tmp_agent = agent.substring(pos + ie.length, agent.length);
                var str = tmp_agent.indexOf(".");
                var version = tmp_agent.substring(0, str);
                if (version * 1 >= 11) ret = true;
            }

            for (var i = 0; i < brows.length; i++) {
                if (agent.indexOf(brows[i]) != -1) {
                    ret = true;
                    break;
                }
            }
            return ret;
        }

        _self.onError = function () {
            util.addEvent(login_btn, "click", _self.doLogin);
            util.echo("onError");
        }

        _self.hideDivComplete = function () {
            // util.echo("acc_show div hide OK!");
        }


        _self.setLayerFun = function (e, param) {
            if (layerFun[param.layer]) layerFun[param.layer]();
        }

        _self.chgLang = function (e, param) {

            // util.classFunc(lang_target, ["lg_lan_hk","lg_lan_cn","lg_lan_en"], "remove");
            // lang_target.innerHTML = dom.getElementById("lg_lan_"+param.ls).innerHTML;

            lang_btn.blur();

            parentClass.dispatchEvent("chgLangx", {"langx": param.langx, "ls": param.ls, "selLayer": selLayer});
        }

        _self.forgotPwd = function () {
            if (_self.chg_site()) {
                _self.clearTimer();
                parentClass.dispatchEvent("forgotPwd", {"target": "acc_show", "retFun": _self.hideDivComplete});
            } else {
                var protocol = dom.location.protocol;
                window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx;
            }
        }

        _self.doCookie = function (keys) {
            remember.checked = false;
            for (var i = 0; i < cookieAry.length; i++) {
                var thisCookie = cookieAry[i].split("=");
                if (thisCookie[0].indexOf(keys) != -1) {
                    user.value = thisCookie[1];
                    remember.checked = true;
                    break;
                }
            }
        }


        //========= 廣告部分(*) ==========
        _self.createTimer = function () {
            timerHash["AD"] = new Timer(config_set.get("AD_TIME"));
            timerHash["AD"].setParentclass(_self);
            //timerHash["AD"].dont_clear = true; //設定為不清除timer
            timerHash["AD"].init();
            timerHash["AD"].addEventListener("TimerEvent.TIMER", _self.timerRun);
            //timerHash["AD"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.ADtimerComplete);
        }

        _self.startTimer = function () {
            // util.echo("AD startTimer");
            if (timerHash["AD"] != null) timerHash["AD"].startTimer();
        }

        _self.stopTimer = function () {
            // util.echo("AD stopTimer");
            if (timerHash["AD"] != null) timerHash["AD"].stopTimer();
        }

        _self.clearTimer = function () {
            // util.echo("AD clearTimer");
            if (timerHash["AD"] != null) timerHash["AD"].clearObj();
        }

        _self.touchstart = function (e) {
            var start_touch = e.touches[0]; // 第一個接觸點
            touchStartPos = Number(start_touch.pageX);
            firstTouch = true;
        }
        _self.touchmove = function (e) {
            var diff = (touchStartPos * 1) - (e.touches[0].pageX) * 1;
            if (Math.abs(diff) >= 10) e.preventDefault();
            touch = e.touches[0]; // 第一個接觸點
            if (timerHash["AD"] != null) _self.stopTimer();
        }
        _self.touchend = function (e) {
            if (!touch) return;
            animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
            var x = Number(touch.pageX);
            var y = Number(touch.pageY);
            var diffPos = touchStartPos - x;


            if (firstTouch) {
                if (diffPos <= touchPoint * -1) {  //左往右拖曳
                    nowAD--;
                } else if (diffPos >= touchPoint) {  //右往左拖曳
                    nowAD++;
                }
                //if(nowAD>totalAD)nowAD=1;

                if (nowAD >= totalAD - 1) nowAD = totalAD - 1;
                if (nowAD < 1) nowAD = 1;

                animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
                _self.chkAD(nowAD);
                _self.startTimer();
            }

            firstTouch = false;
            touch = null;
        }

        _self.timerRun = function () {
            // util.echo("nowAD:"+nowAD+"===totalAD:"+totalAD);
            if (nowAD > totalAD) nowAD = 1;
            else if (nowAD < 1) nowAD = totalAD;
            nowAD++;
            animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
            if (nowAD == totalAD) {
                setTimeout(function () {
                    nowAD = 1;
                    dot1.className = "on";
                    dot2.className = "";
                    dot3.className = "";
                    animate_div.className = "lg_adcomInner adcom1";
                    _self.stopTimer();
                    _self.startTimer();
                }, 300);
                _self.chkAD(1);
            } else {
                _self.chkAD(nowAD);
            }
        }

        _self.preAD = function () {
            if (nowAD == 1) { //第一張廣告按左鍵，還是在第一頁
                nowAD = 1;
            } else {
                nowAD--;
            }
            animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
            _self.chkAD(nowAD);
            _self.stopTimer();
            _self.startTimer();
        }

        _self.nextAD = function () {
            if (nowAD == totalAD - 1) { //最後一張廣告按右鍵，還是在最後一頁
                nowAD = totalAD - 1;
            } else {
                nowAD++;
            }
            animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
            _self.chkAD(nowAD);
            _self.stopTimer();
            _self.startTimer();
        }

        //點選廣告小圓點切換到對應廣告
        _self.chgAD = function (e, param) {
            _self.chkAD(param.now);
            nowAD = param.now;
            animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
            _self.stopTimer();
            _self.startTimer();
        }

        //檢查廣告小圓點＆左右鍵
        _self.chkAD = function (now) {
            //util.echo(now);
            //=====初始化
            preBtn.style.display = "";
            nextBtn.style.display = "";
            for (var i = 1; i <= totalAD - 1; i++) {
                dom.getElementById("dot" + i).className = "";
            }
            //==========

            if (now == 1) {
                preBtn.style.display = "none";
            } else if (now == totalAD - 1) {
                nextBtn.style.display = "none";
            }

            dom.getElementById("dot" + now).className = "on";
        }
        //========= 廣告部分 ==========
    }


    _self.changePage=function(e, param){
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("GoToPage", param);
    }

    _self.changePageComplete=function(){
        // util.echo("changePageComplete");
    }

    _self.connetToServer=function(){
        util.removeEvent(login_btn, "click");
        if(!top.login_layer) top.login_layer=login_layer;
        var urlParams = "";
        urlParams += "login_layer="+top.login_layer;
        urlParams += "&username="+user.value;
        urlParams += "&pwd="+_mc["pwd"].val;
        urlParams += "&verifycode="+verifycode.value;
        urlParams += "&uid="+top.uid;
        urlParams += "&langx="+top.langx;
        urlParams += "&auto=" + top.iovationKey;
        urlParams += "&blackbox=" + top.blackbox;

        urlParams = "p=login_chk&ver="+top.ver+"&"+urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);

        getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.connectComplete=function(data){
        util.addEvent(login_btn, "click", _self.doLogin);
        try{
            var arr_data = new Object();
            try{
                arr_data = JSON.parse(data);
            }catch(e){
                arr_data = (new Function("return " + data))();
            }

            if(util.chkErrorMsg(arr_data,LS_code)) return;
            top.uid = arr_data["uid"];
            top.login_layer = arr_data["login_layer"] ? arr_data["login_layer"] : login_layer;
            top.user_id = arr_data["user_id"];
            top.layer_id = arr_data["layer_id"];
            top.pri_type = arr_data["pri_type"];
            top.user_type = arr_data["user_type"];
            top.user_enable = arr_data["enable"];
            top.enable_pri = arr_data["enable_pri"];
            top.username = arr_data["username"];
            top.layer_username = arr_data["layer_username"];
            top.annCookie = "ag_" + top.login_layer + "_ann" + top.user_id;
            top.pay_type = arr_data["pay_type"];
            if(arr_data["code"]=="102"){
                if(arr_data["status"]=="success"){
                    if (_self.chg_site()) {
                        _self.clearTimer();
                        //top.pwd =pwd.value;
                        //top.pwdSafe = pwd_safe.value;
                        var isChceked = remember.checked;
                        if (isChceked) {
                            document.cookie = "ag_user" + selLayer + "=" + user.value + ";";
                        } else {

                            cookieAry = document.cookie.split(";");
                            var ary = new Array();
                            for (var i = 0; i < cookieAry.length; i++) {
                                var keys = cookieAry[i];
                                var tmp = keys.split("=");
                                if (tmp[0].indexOf("ag_user" + selLayer) != -1) {

                                    var d = new Date();
                                    d.setTime(d.getTime() - 1 * 3600 * 1000);
                                    var _value = tmp[0] + "=;";
                                    _value += 'expires=' + d.toGMTString() + ";";

                                    ary.unshift(_value);
                                } else {
                                    ary.push(keys);
                                }
                            }
                            document.cookie = ary.join(";");

                        }
                        if (arr_data["status_code"] == "4O000") {
                            //正常登入
                            parentClass.dispatchEvent("hideDiv", { "target": "acc_show", "retFun": _self.hideDivComplete });

                        }
                        if (arr_data["status_code"] == "4O001") {
                            //修改密碼(*)
                            parentClass.dispatchEvent("chgPwd", { "target": "acc_show", "retFun": _self.hideDivComplete });
                        }
                        if (arr_data["status_code"] == "4O007") {
                            //超過30(other_set name='chg_pwd_ag')天未修改密碼 要做修改密碼(*)
                            parentClass.dispatchEvent("chgPwd", { "target": "acc_show", "retFun": _self.hideDivComplete });
                        }

                        if (arr_data["status_code"] == "4O002") {
                            if (selLayer == "C") {
                                parentClass.dispatchEvent("chgLoginID", { "target": "acc_show", "retFun": _self.hideDivComplete });
                            } else {
                                //修改安全代碼
                                parentClass.dispatchEvent("chgPwdSafe", { "target": "acc_show", "retFun": _self.hideDivComplete });
                            }
                        }
                    } else {
                        var protocol = dom.location.protocol;
                        window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx;
                    }

                }else{
                    //秀錯誤訊息(*)
                    if(arr_data["status_code"]=="4X004"){
                        user_div.className="lg_input u_icon";
                        pwd_div.className="lg_input p_icon";
                        verifycode_div.className="lg_input s_icon";
                    }else{
                        user_div.className="lg_input u_icon  err_input";
                        pwd_div.className="lg_input p_icon  err_input";
                        verifycode_div.className="lg_input s_icon  err_input";
                    }

                    //if(arr_data["status_code"] == "4X042"){
                        _self.verifycodeImg();
                    //}
                    hr_info2.style.display = "";
                    hr_info2TXT.innerHTML = LS_code.get(arr_data["status_code"]);
                    pwd.value="";
                    verifycode.value="";
                    //roland 577.登入頁-當輸入錯誤帳號密碼, 要再輸入密碼時, 頁面會自動填入資料, 原管理端不會(PJP-718)
                    _mc["pwd"].val="";
                    _mc["verifycode"].val="";
                }

            }else{
                hr_info1.style.display = "";
                hr_info1TXT.innerHTML = "connect fail !!";
            }
        }catch(e){
            util.echo("[login]something wrong !!");
            util.echo(e);
        }

    }

    _self.chg_site = function() {
        var ret = false;
        var agent = navigator.userAgent;
        var ie = "MSIE";
        var pos = agent.indexOf(ie);
        //Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 5.1; Trident/4.0; .NET4.0C)

        //Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.111 Safari/537.36
        //Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_5) AppleWebKit/601.3.9 (KHTML, like Gecko) Version/9.0.2 Safari/601.3.9
        var brows = new Array("Chrome", "Safari", "Firefox", "rv:11", "UCBrowser","opr/");
        //alert(agent)
        if (pos != -1) {
            var tmp_agent = agent.substring(pos + ie.length, agent.length);
            var str = tmp_agent.indexOf(".");
            var version = tmp_agent.substring(0, str);
            if (version * 1 >= 11) ret = true;
        }

        for (var i = 0; i < brows.length; i++) {
            if (agent.indexOf(brows[i]) != -1) {
                ret = true;
                break;
            }
        }
        return ret;
    }

    _self.onError=function(){
        util.addEvent(login_btn, "click", _self.doLogin);
        util.echo("onError");
    }

    _self.hideDivComplete=function(){
        // util.echo("acc_show div hide OK!");
    }

    _self.initLayerFun=function(){
        layerFun["A"] = _self.chgLoginlayer1;
        layerFun["B"] = _self.chgLoginlayer2;
        layerFun["C"] = _self.chgLoginlayer3;
    }

    _self.setLayerFun=function(e, param){
        if(layerFun[param.layer]) layerFun[param.layer]();
    }

    _self.chgLang=function(e, param){

        // util.classFunc(lang_target, ["lg_lan_hk","lg_lan_cn","lg_lan_en"], "remove");
        // lang_target.innerHTML = dom.getElementById("lg_lan_"+param.ls).innerHTML;

        lang_btn.blur();

        parentClass.dispatchEvent("chgLangx", {"langx":param.langx,"ls":param.ls,"selLayer":selLayer});
    }

    _self.forgotPwd=function(){
        if (_self.chg_site()) {
            _self.clearTimer();
            parentClass.dispatchEvent("forgotPwd", { "target": "acc_show", "retFun": _self.hideDivComplete });
        } else {
            var protocol = dom.location.protocol;
            window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx;
        }
    }

    _self.doCookie=function(keys){
        remember.checked = false;
        for(var i=0; i<cookieAry.length; i++){
            var thisCookie = cookieAry[i].split("=");
            if(thisCookie[0].indexOf(keys) != -1){
                user.value = thisCookie[1];
                remember.checked = true;
                break;
            }
        }
    }


    //========= 廣告部分(*) ==========
    _self.createTimer=function(){
        timerHash["AD"] = new Timer(config_set.get("AD_TIME"));
        timerHash["AD"].setParentclass(_self);
        //timerHash["AD"].dont_clear = true; //設定為不清除timer
        timerHash["AD"].init();
        timerHash["AD"].addEventListener("TimerEvent.TIMER", _self.timerRun);
        //timerHash["AD"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.ADtimerComplete);
    }

    _self.startTimer=function(){
        // util.echo("AD startTimer");
        if(timerHash["AD"]!=null) timerHash["AD"].startTimer();
    }

    _self.stopTimer=function(){
        // util.echo("AD stopTimer");
        if(timerHash["AD"]!=null) timerHash["AD"].stopTimer();
    }

    _self.clearTimer=function(){
        // util.echo("AD clearTimer");
        if(timerHash["AD"]!=null) timerHash["AD"].clearObj();
    }

    _self.touchstart=function(e){
        var start_touch = e.touches[0]; // 第一個接觸點
        touchStartPos = Number(start_touch.pageX);
        firstTouch = true;
    }
    _self.touchmove=function(e){
        var diff = (touchStartPos*1) - (e.touches[0].pageX)*1;
        if(Math.abs(diff)>=10) e.preventDefault();
        touch = e.touches[0]; // 第一個接觸點
        if(timerHash["AD"]!=null) _self.stopTimer();
    }
    _self.touchend=function(e){
        if(!touch) return;
        animate_div.className = "lg_adcomInner lg_adcomGO adcom"+nowAD;
        var x = Number(touch.pageX);
        var y = Number(touch.pageY);
        var diffPos = touchStartPos - x;


        if(firstTouch){
            if(diffPos <= touchPoint*-1){  //左往右拖曳
                nowAD--;
            }
            else if(diffPos >= touchPoint){  //右往左拖曳
                nowAD++;
            }
            //if(nowAD>totalAD)nowAD=1;

            if(nowAD>=totalAD-1)nowAD=totalAD-1;
            if(nowAD<1)nowAD=1;

            animate_div.className = "lg_adcomInner lg_adcomGO adcom"+nowAD;
            _self.chkAD(nowAD);
            _self.startTimer();
        }

        firstTouch = false;
        touch = null;
    }

    _self.timerRun=function(){
        // util.echo("nowAD:"+nowAD+"===totalAD:"+totalAD);
        if(nowAD>totalAD)nowAD=1;
        else if(nowAD<1)nowAD=totalAD;
        nowAD++;
        animate_div.className ="lg_adcomInner lg_adcomGO adcom"+nowAD;
        if(nowAD == totalAD){
            setTimeout(function(){
                nowAD = 1;
                dot1.className = "on";
                dot2.className = "";
                dot3.className = "";
                animate_div.className = "lg_adcomInner adcom1";
                _self.stopTimer();
                _self.startTimer();
            },300);
            _self.chkAD(1);
        }else{
            _self.chkAD(nowAD);
        }
    }

    _self.preAD=function(){
        if(nowAD==1){ //第一張廣告按左鍵，還是在第一頁
            nowAD=1;
        }
        else{
            nowAD--;
        }
        animate_div.className = "lg_adcomInner lg_adcomGO adcom"+nowAD;
        _self.chkAD(nowAD);
        _self.stopTimer();
        _self.startTimer();
    }

    _self.nextAD=function(){
        if(nowAD==totalAD-1){ //最後一張廣告按右鍵，還是在最後一頁
            nowAD=totalAD-1;
        }
        else{
            nowAD++;
        }
        animate_div.className = "lg_adcomInner lg_adcomGO adcom"+nowAD;
        _self.chkAD(nowAD);
        _self.stopTimer();
        _self.startTimer();
    }

    //點選廣告小圓點切換到對應廣告
    _self.chgAD=function(e, param){
        _self.chkAD(param.now);
        nowAD=param.now;
        animate_div.className = "lg_adcomInner lg_adcomGO adcom"+nowAD;
        _self.stopTimer();
        _self.startTimer();
    }

    //檢查廣告小圓點＆左右鍵
    _self.chkAD=function(now){
        //util.echo(now);
        //=====初始化
        preBtn.style.display="";
        nextBtn.style.display="";
        for(var i = 1; i<=totalAD-1; i++){
            dom.getElementById("dot"+i).className = "";
        }
        //==========

        if(now == 1){
            preBtn.style.display="none";
        }else if(now == totalAD-1){
            nextBtn.style.display="none";
        }

        dom.getElementById("dot"+now).className = "on";
    }
    //========= 廣告部分 ==========
}