function old_chg_pwd_safe(_win, _dom){
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
    var pwd_safe;
    var hr_info;
    var SUBMIT;
    var back;
    var hr_info;
    var safecode_box;

    _self.init=function(){
        util.echo("chg_pwd_safe load complete");

        ps_icon = dom.getElementById("ps_icon");
        ps_txt = dom.getElementById("ps_txt");
        pwd_safe = dom.getElementById("pwd_safe");
        hr_info = dom.getElementById("hr_info");
        SUBMIT = dom.getElementById("SUBMIT");
        back = dom.getElementById("back");
        safecode_box = dom.getElementById("safecode_box");

        dom.getElementById("pwd_loading").style.display = "";
        ps_icon.classList.add("active");

        util.setInfEvent(ps_icon, { "_focus": ps_txt, "_setView": ps_icon, "_viewClass": "active" });
        util.addEvent(back, "click", _self.backPage);
        util.addEvent(pwd_safe, "focus", _self.onFocusEventHandler, {"target":"pwd_safe"});
        util.addEvent(pwd_safe, "blur", _self.onBlurEventHandler, {"target":"pwd_safe"});
        util.addEvent(SUBMIT, "click", _self.submitEventHandler);
        util.addEvent(pwd_safe, "keyup", _self.keyupEventHandler);

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
        if(param.target == "pwd_safe"){
            safecode_box.className="ps_input focus_input";
        }
    }

    //onBlur
    _self.onBlurEventHandler=function(evt, param){
        if(param.target == "pwd_safe"){
            safecode_box.className="ps_input";
        }
    }

    _self.keyupEventHandler=function(keyEvent, targetObj){
        //var res = _self.str_chk(pwd_safe.value);
        var res = util.str_chk(pwd_safe.value);
        _self.strchk_Msg(res);
        if(pwd_safe.value==""){
            safecode_box.className="ps_input";
            hr_info.style.display = "none";
        }

        if(keyEvent.keyCode==0){
            charCode = keyEvent.which;
        }else{
            charCode = (keyEvent.keyCode)?keyEvent.keyCode:keyEvent.which;
        }

        if(charCode=="13"){
            if(res=="chk_OK")_self.submitEventHandler();
            //targetObj.blur();
        }
    }


    //submit
    _self.submitEventHandler=function(mouseEvent, targetObj){
        //alert("user="+_mc["user"].value+"\npwd="+_mc["pwd"].value);


        var ret = _self.checkFormat(pwd_safe.value);

        if(ret==""){
            _self.connetToServer();

        }else{
            util.echo("chg_pwd_safe error");
        }

    }
    //check format
    _self.checkFormat=function(pwd_safe){
        if(pwd_safe==""){
                return "pwd_safe";
        }
        return "";
    }

    _self.connetToServer=function(){

        var urlParams = "";
        urlParams += "uid="+top.uid;
        urlParams += "&login_layer="+top.login_layer;
        urlParams += "&pwd_safe="+pwd_safe.value;
        urlParams = "p=chg_pwd_safe&ver="+top.ver+"&"+urlParams;
        //util.echo(urlParams);
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.connectComplete=function(data){
        try{
            var arr_data = JSON.parse(data);
            util.echo(arr_data);
            if(util.chkErrorMsg(arr_data,LS_code))return;
            if(arr_data["code"]=="410"){
                if(arr_data["status"]=="success"){
                    if(arr_data["status_code"]=="4O004"){
                        //top.pwdSafe = pwd_safe.value;
                        //已成功創建安全代碼
                        parentClass.dispatchEvent("chgPwd", {"target":"acc_show","retFun":_self.hideDivComplete});
                    }
                }else{
                    if(arr_data["status_code"]=="4X015") safecode_box.className="ps_input err_input"; //LS_account.get("pwd_safe_same");
                    //秀錯誤訊息(*)
                    hr_info.style.display = "";
                    hr_info.innerHTML = LS_code.get(arr_data["status_code"]);
                    SUBMIT.disabled = false;
                }

            }
        }catch(e){
            util.echo("[old_chg_pwd_safe]something wrong !!");
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
            hr_info.innerHTML = LS_account.get("err_pwd_safe_rule");
            safecode_box.className="ps_input err_input";
            SUBMIT.disabled = true;
        }
        else if(str == "err_length"){
            hr_info.style.display = "";
            hr_info.innerHTML = LS_account.get("err_pwd_safe_rule");
            safecode_box.className="ps_input err_input";
            SUBMIT.disabled = true;
        }
        else if(str == "err_contain"){
            hr_info.style.display = "";
            hr_info.innerHTML = LS_account.get("err_pwd_safe_rule");
            safecode_box.className="ps_input err_input";
            SUBMIT.disabled = true;
        }
        else if(str == "err_charactersNum"){
            hr_info.style.display = "";
            hr_info.innerHTML = LS_account.get("err_pwd_safe_block");
            safecode_box.className="ps_input err_input";
            SUBMIT.disabled = true;
        }
        else if(str == "err_block_string"){
            hr_info.style.display = "";
            hr_info.innerHTML = LS_account.get("err_pwd_safe_block");
            safecode_box.className="ps_input err_input";
            SUBMIT.disabled = true;
        }
        else if(str == "chk_OK"){
            hr_info.style.display = "none";
            safecode_box.className = "ps_input scss_icon";
            SUBMIT.disabled = false;
        }
        else{
            util.echo("chk wrong!!");
        }
    }

}