function pwd_recovery(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var topFrame;
    var eventHandler = new Object();
    var chgMailText = true; //不讓change事件一直去讀dom，會耗資源

    _self.init = function () {
        util.echo(" Password Recovery ");
        _self.connetToServer("init");
        parentClass.dispatchEvent("chgPageName", { "pageName": "pwd_recovery" });
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        topFrame.closeRightPanel();
        _self.setListen();
    }
    //監聽註冊
    _self.setListen = function(){
        //dom
        var setEmail = dom.getElementById("setEmail");
        var mail_CANCEAL = dom.getElementById("mail_CANCEAL");
        var mail_NEXT = dom.getElementById("mail_NEXT");
        var myVerify = dom.getElementById("myVerify");
        var verify_RESEND = dom.getElementById("verify_RESEND");
        var verify_CANCEAL = dom.getElementById("verify_CANCEAL");
        var verify_NEXT = dom.getElementById("verify_NEXT");
        var done_btn = dom.getElementById("done_btn");
        var mail_del = dom.getElementById("mail_del");
        var mail_edit = dom.getElementsByName("mail_edit");//此為序列
        //填信箱
        util.addEvent(mail_CANCEAL, "click", _self.onClickEventHandler, { "target": "setEmail_CANCEL" });
        util.addEvent(mail_NEXT, "click", _self.onClickEventHandler, { "target": "setEmail_NEXT" });
        util.addEvent(setEmail, "focus", _self.onFocusEventHandler, { "target": "setEmail" });
        util.addEvent(setEmail, "blur", _self.onBlurEventHandler, { "target": "setEmail" });
        util.addEvent(setEmail, "keypress", _self.onKeypressEventHandler, { "target": "setEmail" });
        util.addEvent(setEmail, "input", _self.onInputEventHandler, { "target": "setEmail" });
        //填驗證碼
        util.addEvent(verify_RESEND, "click", _self.onClickEventHandler, { "target": "inputVerify_RESEND" });
        util.addEvent(verify_CANCEAL, "click", _self.onClickEventHandler, { "target": "inputVerify_CANCEL" });
        util.addEvent(verify_NEXT, "click", _self.onClickEventHandler, { "target": "inputVerify_NEXT" });
        util.addEvent(myVerify, "focus", _self.onFocusEventHandler, { "target": "myVerify" });
        util.addEvent(myVerify, "blur", _self.onBlurEventHandler, { "target": "myVerify" });
        util.addEvent(myVerify, "keypress", _self.onKeypressEventHandler, { "target": "myVerify" });
        util.addEvent(myVerify, "input", _self.onInputEventHandler, { "target": "myVerify" });
        //Done
        util.addEvent(done_btn, "click", _self.onClickEventHandler, { "target": "done_CANCEL" });
        // 修改/刪除 信箱
        util.addEvent(mail_del, "click", _self.onClickEventHandler, { "target": "mail_del" });
        for (var i = 0, len = mail_edit.length; i < len; i++) {
            util.addEvent(mail_edit[i], "click", _self.onClickEventHandler, { "target": "mail_EDIT" });
        }
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        topFrame = parentClass.getThis("topFrame");
    }
    //後台溝通
    _self.connetToServer = function (eventName,param) {
        param = (typeof param !== 'undefined')? param:"";
        var urlParams = "uid=" + top.uid;
        var getHTML = new HttpRequest();
        if (eventName == "init"){   //初始
            urlParams += "&action=init";
            urlParams += "&login_layer=" + top.login_layer;
            urlParams = "p=get_pwd_recovery&ver=" + top.ver + "&" + urlParams;
            getHTML.addEventListener("LoadComplete", _self.connectInit);
        } else if (eventName == "regEmail"){    //註冊信箱
            urlParams += "&action=regEmail";
            urlParams += "&login_layer=" + top.login_layer + "&langx=" + langx;
            urlParams = "p=get_pwd_recovery&ver=" + top.ver + "&" + urlParams + "&" + param;
            getHTML.addEventListener("LoadComplete", _self.getVerification);
        } else if (eventName == "sendVerify"){  //檢查驗證碼
            urlParams += "&action=sendVerify";
            urlParams += "&login_layer=" + top.login_layer + "&langx=" + langx;
            urlParams = "p=get_pwd_recovery&ver=" + top.ver + "&" + urlParams + "&" + param;
            getHTML.addEventListener("LoadComplete", _self.chkVerification);
        } else if (eventName == "removeEmail"){  //移除信箱
            urlParams += "&action=removeEmail";
            urlParams += "&login_layer=" + top.login_layer + "&langx=" + langx;
            urlParams = "p=get_pwd_recovery&ver=" + top.ver + "&" + urlParams;
            getHTML.addEventListener("LoadComplete", _self.removeEmail);
        }
        getHTML.addEventListener("onError", _self.onError);
        getHTML.loadURL(top.url, "POST", urlParams);
    }
    //初始設定接口
    _self.connectInit = function (data) {
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
            _self.parsePHPData("init",arr_data);
        } catch (e) {
            util.echo(e);
        }
    }
    //驗證碼接口
    _self.getVerification = function (data){
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
            _self.parsePHPData("viewVerify",arr_data);
        } catch (e) {
            util.echo(e);
        }
    }
    //檢查驗證碼接口
    _self.chkVerification = function (data){
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
            _self.parsePHPData("verInfo", arr_data);
        } catch (e) {
            util.echo(e);
        }
    }
    //移除信箱街口
    _self.removeEmail = function (data) {
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
            _self.parsePHPData("remove_email", arr_data);
        } catch (e) {
            util.echo(e);
        }
    }
    //資料轉譯站
    _self.parsePHPData = function(eventName,data){
        if (!data) return;//除錯 當沒有資料就直接白頁
        var msg = data["msg"];
        var code = data["code"];
        if (eventName == "init"){   //初始
            if (msg == "success") {
                _self.setViewEmail(code);
                _self.viewHTML("div_view_email");
            }
            else if (msg == "error") {
                if (code == "4X007") {
                    _self.viewHTML("div_set_email");
                }else{
                    util.showErrorMsg(LS_code.get(code));
                }
            }
        } else if (eventName == "viewVerify"){ //get驗證碼
            if (msg == "success" && code == "4O005") {
                parentClass.dispatchEvent("showFadeOutMesg", { "text": LS_code.get(code) });
                _self.viewHTML("div_set_verify");
            } else if (msg == "error") {
                util.showErrorMsg(LS_code.get(code));
            }
        } else if (eventName == "verInfo"){
            if (msg == "success" && code == "4O006") {
                parentClass.dispatchEvent("showFadeOutMesg", { "text": LS_code.get(code) });
                // util.showErrorMsg(LS_code.get(code));
                _self.viewHTML("div_view_email");
                _self.clearInput();
            } else if (msg == "error") {
                if (code == "4X031"){   //驗證碼錯誤
                    var ver = dom.getElementById("myVerify");
                    var ver_err = dom.getElementById("verify_err");
                    ver.parentElement.className = "ps_input err_input";
                    ver_err.style.display = "";
                    ver.value = "";
                }else{
                    util.showErrorMsg(LS_code.get(code));
                }

            }
        } else if (eventName == "remove_email"){ //刪除信箱 顯示設定信箱頁面
            if (msg == "success"){
                _self.viewHTML("div_set_email");
                parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get(eventName) });
                // util.showErrorMsg(LS.get(eventName));
            }else{
                util.showErrorMsg(LS_code.get(code));
            }
        }
    }
    //錯誤訊息
    _self.onError = function () {
        util.echo("onError");
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }
    //exit
    _self.exitEvent = function () {
        // util.echo("top exit");
        return true;
    }
    //倒回上一頁
    _self.backPage = function (e, param) {
        parentClass.dispatchEvent("backPage", { "retFun": _self.backPageComplete });
    }

    _self.backPageComplete = function () {
        // util.echo("backPageComplete");
    }
    _self.changePage = function (e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.changePageComplete = function () {
        // util.echo("changePageComplete");
    }
    //-------------------監聽-------------------
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }
    //點擊事件
    _self.onClickEventHandler = function (evt, param){
        if (param.target == "setEmail_NEXT"){
            _self.checkFormat(param.target,"Y");
        }
        else if (param.target == "setEmail_CANCEL"){
            util.showMsg(LS.get("input_verify_cancel"), "Y", _self.goPageHome);
        }
        else if( param.target == "inputVerify_RESEND"){
            dom.getElementById("myVerify").value = "";
            var mailVal = dom.getElementById("setEmail").value;
            _self.connetToServer("regEmail", "email=" + mailVal);
        }
        else if ( param.target == "inputVerify_CANCEL") {
            util.showMsg(LS.get("input_verify_cancel"), "Y", _self.goPageHome);
        }
        else if ( param.target == "inputVerify_NEXT") {
            _self.checkFormat(param.target,"Y");
        }
        else if ( param.target == "done_CANCEL"){
            _self.goPageHome("yes");
        }
        else if (param.target == "mail_EDIT"){
            _self.viewHTML("div_set_email");
        }
        else if( param.target == "mail_del"){
            util.showMsg(LS.get("remove_email_message"), "Y",function(x){
                if (x == "yes") _self.connetToServer("removeEmail");
            });
        }

    }
    //焦距事件
    _self.onFocusEventHandler = function (evt, param){
        var passinfo = evt.target.parentElement;
        if (param.target == "setEmail" || param.target == "myVerify") {
            var claN = "ps_input focus_input";
            if (param.target == "myVerify") claN += " m_noH"
            if (evt.target.value == "") chgMailText = true;
            passinfo.className = claN;
        }
    }
    //取消焦距事件
    _self.onBlurEventHandler = function (evt, param){
        var passinfo = evt.target.parentElement;
        if (param.target == "setEmail" || param.target == "myVerify") {
            var claN = "ps_input focus_input";
            if (param.target == "myVerify") claN += " m_noH"
            passinfo.className = claN;
        }
    }
    //keyCode
    _self.onKeypressEventHandler = function (evt, param) {
        var passinfo = evt.charCode || evt.keyCode;
        if (evt.target.value == "") return;
        if (param.target == "setEmail" && passinfo == 13){
            dom.getElementById("mail_NEXT").click();
        }
        else if (param.target == "myVerify" && passinfo == 13){
            dom.getElementById("verify_NEXT").click();
        }
    }
    //text 變動事件
    _self.onInputEventHandler = function (evt, param){
        if (param.target == "setEmail"){
            _self.checkFormat("setEmail_NEXT");
            var val = evt.target.value;
            var disTF = true;
            if (/[\x00-\xff]+@[\x00-\xff]+\.com(?:\.[\x00-\xff]+|)$/.test(val)) disTF = false;
            else chgMailText = true;
            if (chgMailText){
                dom.getElementById("mail_NEXT").disabled = disTF;
                if (!disTF) chgMailText = false;
            }
        }
        // else if (param.target == "myVerify"){
        //     var len = evt.target.value.length;
        //     var disTF = true;
        //     if (len > 0) disTF = false;
        //     else chgMailText = true;
        //     if (chgMailText) {
        //         dom.getElementById("verify_NEXT").disabled = disTF;
        //         if (!disTF) chgMailText = false;
        //     }
        // }
    }
    //顯示該頁面
    _self.viewHTML = function(viewID){
        var viewIdAry = ["div_view_email","div_set_email","div_set_verify"];
        var len = viewIdAry.length;
        for (var i = 0; i < len ; i++){
            var tmpStr = viewIdAry[i],
                display = "none"
            if (!tmpStr) continue; //不存在在陣列中
            if (viewID == tmpStr) display = "";
            dom.getElementById(tmpStr).style.display = display;
        }
    }
    //送出時檢查該參數
    _self.checkFormat = function(param,sendServer){
        //尚未申請信箱
        if (param == "setEmail_NEXT"){
            var emailRule = /[\x00-\xff]+@[\x00-\xff]+\.com(?:\.[\x00-\xff]+|)$/;
            var mail = dom.getElementById("setEmail");
            var mail_err = dom.getElementById("mail_err");
            var mailVal = mail.value;
            if (emailRule.test(mailVal)){
                mail.parentElement.className = "ps_input scss_icon";
                mail_err.style.display = "none";
                _self.setViewEmail(mailVal);
                if (sendServer == "Y") _self.connetToServer("regEmail", "email=" + mailVal);
            }else{
                mail.parentElement.className = "ps_input err_input";
                mail_err.style.display = "";
            }
        }
        else if (param == "inputVerify_NEXT"){
            var verRule = /^[A-Z|0-9]+$/g;
            var ver = dom.getElementById("myVerify");
            var ver_err = dom.getElementById("verify_err");
            var verVal = (ver.value).toUpperCase();
            if (verRule.test(verVal)) {
                ver.parentElement.className = "ps_input m_noH";
                ver_err.style.display = "none";
                if (sendServer == "Y") _self.connetToServer("sendVerify", "verCode=" + verVal);
            } else {
                ver.parentElement.className = "ps_input m_noH err_input";
                ver_err.style.display = "";
                ver.value = "";
            }
        }
    }
    //返回主頁
    _self.goPageHome = function(x){
        if (x == "yes") {
            parentClass.dispatchEvent("bodyGoToPage", { "page": "dashboard_main", "pageName": "dashboard" });
        }
    }
    //設定顯示信箱
    _self.setViewEmail = function(param){
        var EA = dom.getElementsByName("emailAddress");
        var len = EA.length;
        for(var i = 0 ; i < len ; i++){
            EA[i].textContent = param;
        }
    }
    //清空所有text
    _self.clearInput = function(){
        var PSI = dom.getElementsByName("pswInput");
        for (var i = 0, len = PSI.length; i < len; i++) {
            var claN = "ps_input";
            PSI[i].value = "";
            if (PSI[i].id == "myVerify") claN += " m_noH";
            PSI[i].parentElement.className = claN;
        }
    }
}