function old_chg_login_ID(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object();
    var util;
    var LS_code;
    var LS_account;

    //Ricky
    var ps_isShow = false;
    var ps_icon;
    var ps_txt;
    var pwd;
    var pwd_box;
    var hr_info;
    var SUBMIT;
    var back;
    var hr_info;
    var CHECK;

    _self.init=function(){

        util.echo("chg_login_ID load complete");


        ps_icon = dom.getElementById("ps_icon");
        ps_txt = dom.getElementById("ps_txt");
        pwd = dom.getElementById("pwd");
        pwd_box = dom.getElementById("pwd_box");
        hr_info = dom.getElementById("hr_info");
        SUBMIT = dom.getElementById("SUBMIT");
        back = dom.getElementById("back");
        CHECK = dom.getElementById("CHECK");

        dom.getElementById("pwd_loading").style.display = "";
        ps_icon.classList.add("active");

        util.addEvent(back, "click", _self.backPage);

        util.setInfEvent(ps_icon, { "_focus": ps_txt, "_setView": ps_icon, "_viewClass": "active" });
        util.addEvent(pwd, "focus", _self.onFocusEventHandler, {"target":"pwd"});
        util.addEvent(pwd, "blur", _self.onBlurEventHandler, {"target":"pwd"});
        util.addEvent(SUBMIT, "click", _self.submitEventHandler);

        util.addEvent(pwd, "keyup", _self.keyupEventHandler);
        util.addEvent(CHECK, "click", _self.chkLoginID);

        //修不好只好這樣處理 500.uc瀏覽器-更改安代/密碼頁面-點擊i圖是沒有作用(PJP-513）
        setTimeout(function () {
            ps_icon.classList.remove("active");
        }, 100);

        setTimeout(function () {
            dom.getElementById("pwd_loading").style.display = "none";
        }, 500);
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

    //onFocus
    _self.onFocusEventHandler=function(evt, param){
        if(param.target == "pwd"){
            pwd_box.className="ps_input focus_input";
        }

    }

    //onBlur
    _self.onBlurEventHandler=function(evt, param){
        //_self.str_chk(pwd.value);
        if(param.target == "pwd" && !pwd_box.classList.contains("scss_iconS")){
            pwd_box.className="ps_input";
        }
    }

    _self.keyupEventHandler=function(keyEvent, targetObj){
        //var res = _self.str_chk(pwd.value);
        var res = util.str_chk_mem(pwd.value,2);
        _self.strchk_Msg(res);
        if(pwd.value==""){
            pwd_box.className="ps_input";
            hr_info.style.display = "none";
        }

        if(keyEvent.keyCode==0){
            charCode = keyEvent.which;
        }else{
            charCode = (keyEvent.keyCode)?keyEvent.keyCode:keyEvent.which;
        }

        if(charCode=="13"){
            if(res=="chk_OK" && SUBMIT.disabled==false)_self.submitEventHandler();
            //targetObj.blur();
        }
    }


    _self.chkLoginID=function(){
        if(CHECK.className=="ps_chk_btn")return;
        // if(pwd.value == top.username || pwd.value == top.pwd){
        //     hr_info.style.display = "";
        //     hr_info.className="lg_err";
        //     pwd_box.className="ps_input err_input";
        //     //hr_info.innerHTML="Login ID cannot be the same as your Password or User Code";
        //     hr_info.innerHTML = LS_account.get("loginID_same");
        //     SUBMIT.disabled=true;
        //     return;
        // }
        var urlParams = "";
        urlParams = "pwd_safe="+pwd.value+"&"+"username="+top.username;
        urlParams += "&uid="+top.uid;
        urlParams += "&login_layer="+top.login_layer;
        urlParams = "p=tmp_loginID_chk&ver="+top.ver+"&"+urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.checkComplete);
        getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.checkComplete=function(data){
        var arr_data = JSON.parse(data);
        if(util.chkErrorMsg(arr_data,LS_code)) return;
        try{
            if(arr_data.status == "SAME"){
                hr_info.style.display = "";
                hr_info.className="lg_err";
                pwd_box.className="ps_input err_input";
                hr_info.innerHTML = LS_account.get("loginID_same");
                SUBMIT.disabled=true;
            }else if(arr_data.status == "NO"){
                hr_info.style.display = "";
                hr_info.className="lg_err";
                pwd_box.className="ps_input err_input";
                //hr_info.innerHTML="Login ID is NOT available";
                hr_info.innerHTML = LS_account.get("loginID_notOK");
                SUBMIT.disabled=true;
            }else{
                hr_info.style.display = "";
                hr_info.className="lg_scss";
                pwd_box.className="ps_input scss_iconS";
                //hr_info.innerHTML="Login ID is available";
                hr_info.innerHTML = LS_account.get("loginID_OK");
                SUBMIT.disabled=false;
            }
        }catch(e){
            util.echo("[old_chg_login_ID][checkID]something wrong !!");
            util.echo(e);
        }

    }


    //submit
    _self.submitEventHandler=function(mouseEvent, targetObj){
        //alert("user="+_mc["user"].value+"\npwd="+_mc["pwd"].value);


        var ret = _self.checkFormat(pwd.value);

        if(ret==""){
            _self.connetToServer();

        }else{
            util.echo("chg_login_ID error");
        }

    }
    //check format
    _self.checkFormat=function(pwd){
        if(pwd==""){
            return "pwd";
        }
        return "";
    }

    _self.connetToServer=function(){

        var urlParams = "";
        urlParams += "uid="+top.uid;
        urlParams += "&login_layer="+top.login_layer;
        urlParams += "&pwd_safe="+pwd.value;
        urlParams = "p=chg_pwd_safe&ver="+top.ver+"&"+urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.connectComplete=function(data){
        try{
            var arr_data = JSON.parse(data);
            if(util.chkErrorMsg(arr_data,LS_code)) return;
            if(arr_data["code"]=="410"){
                if(arr_data["status"]=="success"){
                    if(arr_data["status_code"]=="4O003"){
                        //top.username = pwd.value;
                        //成功創建登入帳號
                        parentClass.dispatchEvent("chgPwd", {"target":"acc_show","retFun":_self.hideDivComplete});
                    }
                }else{
                    //LoginID跟帳號一樣
                    if(arr_data["status_code"]=="4X015"){
                        hr_info.style.display = "";
                        hr_info.className ="lg_err";
                        //hr_info.innerHTML = LS_account.get("loginID_same2");
                        hr_info.innerHTML = LS_code.get("4X015_ag");
                        pwd_box.className="ps_input err_input";
                        CHECK.className = "ps_chk_btn on";
                        CHECK.disabled=false;
                    }
                    else{
                        //秀錯誤訊息(*)
                        hr_info.style.display = "";
                        hr_info.className ="lg_err";
                        pwd_box.className="ps_input err_input";
                        hr_info.innerHTML = LS_code.get(arr_data["status_code"]);
                    }

                }

            }
        }catch(e){
            util.echo("[old_chg_login_ID]something wrong !!");
            util.echo(e);
        }

    }

    _self.onError=function(){
        util.echo("onError");
    }

    _self.backPage=function(e, param){
        //parentClass.dispatchEvent("backToIdex", {"retFun":_self.backPageComplete});
        util.goToIndex();
    }

    _self.backPageComplete=function(){
        util.echo("backPageComplete");
    }

    _self.strchk_Msg=function(str){
        if(str == "err_combination"){
            hr_info.style.display = "";
            hr_info.className ="lg_err";
            hr_info.innerHTML = LS_account.get("err_loginID_rule");
            pwd_box.className="ps_input err_input";
            CHECK.className = "ps_chk_btn";
            CHECK.disabled=true;
            SUBMIT.disabled=true;
        }
        else if(str == "err_length"){
            hr_info.style.display = "";
            hr_info.className ="lg_err";
            hr_info.innerHTML = LS_account.get("err_loginID_rule");
            pwd_box.className="ps_input err_input";
            CHECK.className = "ps_chk_btn";
            CHECK.disabled=true;
            SUBMIT.disabled=true;
        }
        else if(str == "err_contain"){
            hr_info.style.display = "";
            hr_info.className ="lg_err";
            hr_info.innerHTML = LS_account.get("err_loginID_rule");
            pwd_box.className="ps_input err_input";
            CHECK.className = "ps_chk_btn";
            CHECK.disabled=true;
            SUBMIT.disabled=true;
        }
        else if (str == "chk_OK" || str == "err_charactersNum" || str == "err_block_string" ){
            hr_info.style.display = "none";
            pwd_box.className="ps_input scss_iconS";
            CHECK.className = "ps_chk_btn on";
            CHECK.disabled=false;
        }
        else{
            util.echo("chk wrong!!");
        }
    }


}