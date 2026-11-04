function acc_mem_detail(_win, _dom, paramObj){
    var _self = this;
    var level = "mem";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var LS_account;
    var config_set;
    var _mc = new Object();
    var credit_old;
    var param;
    var acc_par = new Object;
    var psw_isShow = false;
    var acc_title = new Object();
    var classname = "acc_mem_detail";
    acc_title["title"] = new Array("acc_detail","acc_comm","acc_report","acc_eventlog","acc_onlineMem");
    acc_title["perf"] = new Array("perf_yesterday","perf_week","perf_period");
    acc_title["summary"] = new Array("summary_ag","summary_mem");
    var keepScrollTop = 56;
    var overScrollTop = 56;
    var balance = 0;

    _self.init=function(){
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        param = paramObj;
        var obj_ids = ",div_acc_detail,div_acc_comm,div_acc_report,div_acc_eventlog,div_acc_onlineMem,";
        obj_ids += "acc_detail,acc_comm,acc_report,acc_eventlog,acc_onlineMem,"
        obj_ids += "btn_add_acc,btn_cancel,btn_save,";
        obj_ids += "box_upper_user,input_upper_user,";
        obj_ids += "box_user,input_user,";
        obj_ids += "box_ltype,input_ltype,";
        obj_ids += "box_alias,input_alias,msg_alias,";
        obj_ids += "box_psw,btn_psw,pop_psw,ps_icon,ps_txt,";
        obj_ids += "box_psw_recovery,input_psw_recovery,psw_recovery_text,";
        obj_ids += "box_safe,input_safe,";
        obj_ids += "status_list,status_tip,";
        obj_ids += "box_date,input_create_date,winloss_c,dfwinloss_c,possess_max,possess_min,";
        obj_ids += "box_credit,available_credit,now_credit,input_credit,msg_credit,currency,trans_credit,currency_rate,";
        obj_ids += "currency_1,currency_2,";
        obj_ids += "box_possess,box_possess,input_possess_su,input_possess_ag,sel_possess_su,sel_possess_ag,possess_tip,possess_effect_time,";
        obj_ids += "box_acc_summary,amount_mem,last_login,last_chg_date,";
        obj_ids += "box_perf,perf_yesterday,perf_week,perf_period,perf_winloss,perf_profit,perf_turnover,";
        obj_ids += "box_down_acc_summary,summary_ag,summary_mem,amount_active,amount_veiwonly,amount_inactive,amount_suspended,";
        obj_ids += "credit_active,credit_veiwonly,credit_inactive,credit_suspended,";
        obj_ids += "box_psw,input_psw,first_estimate,eye_psw,complexity,psw_light,strengthTxt,msg_psw,psw_btn_cancel,psw_btn_save,";
        obj_ids += "show_account_type,show_pay_type,";
        _mc = util.getObjAry(dom, obj_ids);

        _mc["box_perf"].style.display = "none";

        // 新增帳號
        util.addEvent(_mc["btn_add_acc"], "click", _self.goToAdd, _mc["btn_add_acc"]);

        // 修改儲存/取消
        util.addEvent(_mc["btn_cancel"], "click", _self.closeEvent, "cancel");
        util.addEvent(_mc["btn_save"], "click", _self.upd_data, _mc["btn_save"]);

        // 密碼恢復
        util.addEvent(_mc["input_psw_recovery"], "click", _self.chg_mail_status, _mc["input_psw_recovery"]);

        // 帳號狀態 i 提示
        util.addEvent(_mc["status_tip"], "click", _self.showTip, { "_id": "status_pop" });

        // 密碼 i 提示
        util.setInfEvent(_mc["ps_icon"], { "_focus": _mc["ps_txt"], "_setView": _mc["ps_txt"], "_viewClass": "on" });

        // 顯示 關於額度模式 內容
        util.addEvent(_mc["show_account_type"], "click", _self.showAccountType, { "_id": "account_type_pop" });

        // 修改密碼
        util.addEvent(_mc["eye_psw"], "click", _self.showPwd, _mc["eye_psw"]);
        util.addEvent(_mc["btn_psw"], "click", _self.showResetPsw, {"isShow":true});
        util.addEvent(_mc["input_psw"], "keyup", _self.keyupEventHandler);
        util.addEvent(_mc["psw_btn_cancel"], "click", _self.showResetPsw, {"isShow":false});
        util.addEvent(_mc["psw_btn_save"], "click", _self.submitEventHandler, _mc["psw_btn_save"]);

        // 有修改額度的權限才可做修改
        if (!(top.user_type != "1" && top.pri_type.indexOf("B2") == -1)) {
            _mc["box_credit"].classList.remove("_disabled");
            util.addEvent(_mc["input_credit"],"keydown", _self.keep_credit, _mc["input_credit"]);
            util.ChkKeyCash(_mc["input_credit"], { initShow: _self.closeErrMsg, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        }else{
            _mc["box_credit"].classList.add("_disabled");
        }

        for(var i = 0; i < acc_title["perf"].length; i++){
            util.addEvent(_mc[acc_title["perf"][i]], "click", _self.titleChg, {"target":_mc[acc_title["perf"][i]],"type":"perf"});
        }
        for(var i = 0; i < acc_title["summary"].length; i++){
            util.addEvent(_mc[acc_title["summary"][i]], "click", _self.titleChg, {"target":_mc[acc_title["summary"][i]],"type":"summary"});
        }

        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, _mc["div_acc_detail"]);

        _self.showPwd(null, _mc["eye_psw"]);
        _self.loadUserData();
    }

    _self.ChkCreditErr = function (e) {
        _self.showError("credit", LS.get("str_maxcre"));
    }

    //信用額度轉換千位顯示
    _self.show_credits = function (e) {
        if (e.type == "input") {
            util.Replace_Input_credits(e.target, credit_old, e);
        } else {
            util.Replace_credits(e.target, credit_old, e);
        }
        try {
            _self.TransRMB();
        } catch (e) {
            util.echo("Error TransRMB");
        }
        // 即時計算剩餘額度
        if (e.target == _mc["input_credit"]) {
            var credit = _mc["input_credit"].value.replace(/\D/g, '');
            _mc["available_credit"].innerHTML = util.mprintf((balance - credit), 0, 2, false, true);
        }
    }

    _self.keep_credit=function(e, targetObj){
        // credit_old = _mc["input_credit"].value.replace(/\D/g, '');
        credit_old = _mc["input_credit"].value.replace(/[^\d.]/g, '');
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
        config_set = parentClass.getThis("config_set");
    }

    _self.titleChg = function(mouseEvent, obj){
        var length = acc_title[obj["type"]].length;
        for(var i =0; i < length; i++){
            _mc[acc_title[obj["type"]][i]].classList.remove("on");
        }
        obj["target"].classList.add("on");
        if(obj.type=="summary"){
            _self.ChgSummary(obj.target)
        }else{
            _self.ChgPerformace(obj.target);
        }
    }

    _self.ChgSummary = function(tarObj){
        var level = tarObj.id.split("_")[1];
        summary_layer = level;
        _self.getUserCredit();
    }

    _self.ChgPerformace = function(tarObj){
        var range = "";
        var tmp_range = tarObj.id.split("_")[1];
        switch(tmp_range){
            case "yesterday":
                range = "yes";
                break;
            case "today":
                range = "to";
                break;
            case "week":
                range = "tw";
                break;
            case "period":
                range = "tp";
                break;
        }
        _self.get_performace("overview", range,  _self.getOverViewComplete);
    }

    _self.get_performace=function(code, _date, retFun){
        var par = "";
        par+=top.param;
        par+="&p=get_performance";
        par+="&code="+code;
        par+="&date="+_date;

        if(code=="overview"){
            par+="&report_kind=A";
            par+="&result_type=Y";
            par+="&gtype=";
            par+="&wtype=";
            par+="&aid="+param.up_id;
            par+="&view_id="+param.edit_id;
            par+="&view_layer=mem";
        }

        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", retFun);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.getOverViewComplete=function(data){
        try{
            var hash = JSON.parse(data);
            if(util.chkErrorMsg(hash,LS_code)) return;
            if(hash["status"]=="200"){

                _mc["perf_winloss"].innerHTML = hash["result"];
                _mc["perf_profit"].innerHTML = hash["profit"];
                _mc["perf_turnover"].innerHTML = hash["stock"];

                _mc["perf_winloss"].classList.remove("word_red");
                _mc["perf_profit"].classList.remove("word_red");
                _mc["perf_turnover"].classList.remove("word_red");

                if(hash["result"].substring(0,1)=="-") _mc["perf_winloss"].classList.add("word_red");
                if(hash["profit"].substring(0,1)=="-") _mc["perf_profit"].classList.add("word_red");
                if(hash["stock"].substring(0,1)=="-") _mc["perf_turnover"].classList.add("word_red");
            }else{
                var msg = hash["msg"]? hash["msg"] : LS_code.get(hash["code"]);
                util.showErrorMsg(msg);
            }
        }catch(e){
            util.err("["+classname+"]", e);
            util.showErrorMsg("data error");
            return;
        }
    }

    _self.loadUserData = function(){
        var par = "p=get_" + level + "_list" + _self.targetParam("get_list_mems");
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.showUserData);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.submitCheck = function(){
        _self.closeErrMsg();
        if(acc_par.new_credits == ""){
            _self.showError("credit", LS.get("empty_credit"));
            return false;
        }else if (!util.checkFormat(acc_par.new_credits.replace(/,/g, ''), 1)) {
            if (param.pay_type == 1 && util.checkFormat(acc_par.new_credits.replace(/[\,\.]/g, ''), 1)) {
                // 現金帳號允許輸入小數點
            } else {
                if (acc_par.new_credits*1 == acc_par.maxcredit){
                    // 現金帳號原額度為負數 沒經過異動
                }else{
                    _self.showError("credit", LS.get("str_maxcre"));
                    return false;
                }
            }
        }else if(acc_par.new_credits*1==0 && param.pay_type==0){
            if(top.langx == "en-us"){
                _self.showError("credit", LS.get("str_maxcre_zero")+" "+LS.get("str_maxcre_zero1"));
            }else{
                _self.showError("credit", LS.get("str_maxcre_zero1")+","+LS.get("str_maxcre_zero")+".");
            }
            return false;
        }
        return true;
    }

    _self.upd_data = function(e){
        var new_alias = _mc["input_alias"].value;
        // var new_credits = _mc["input_credit"].value.replace(/\D/g,'');
        var new_credits = _mc["input_credit"].value.replace(/[^\d.-]/g, '');
        var new_status = _mc["status_list"].value;
        var new_psw_recv = (_mc["input_psw_recovery"].checked)?"E":"S";

        if( (new_alias != acc_par.alias) || (new_credits*1 != acc_par.maxcredit*1) || (new_status != acc_par.status) || (new_psw_recv != acc_par.psw_enable) ){
            acc_par.new_alias = new_alias;
            acc_par.new_credits = new_credits;
            acc_par.new_status = new_status;
            acc_par.new_psw_enable = new_psw_recv;
            var ret = _self.submitCheck();
            if(!ret)	return;
            //util.removeEvent(_mc["btn_save"], "click");

            var par = "p=body_mem_edit" + _self.targetParam("body_members_edit");
            var getHttp = new HttpRequest();
            getHttp.addEventListener("LoadComplete", _self.upd_msg);
            getHttp.loadURL(top.url, "POST", par);
        }else{
            // _self.closeEvent("save");
            parentClass.dispatchEvent("showLoading", { "showLoading": true });
            _self.loadUserData();
        }
    }

    _self.upd_msg = function(data){
        //util.echo(data);
        var arr_data = JSON.parse(data);
        if (arr_data.status == "success") {
            parentClass.dispatchEvent("showLoading", { "showLoading": true });
            _self.loadUserData();
            // _self.closeEvent("save");
        } else if (arr_data.status == "error") {
            if (arr_data.code == "alias") {
                _self.showError("alias", arr_data.msg);

            } else if (arr_data.code == "maxcredit") {
                _self.showError("credit", arr_data.msg);

            } else if (arr_data.code == "Err_credits_chg" || arr_data.code == "Err_credits_avaliable") {
                _self.showError("credit", arr_data.msg);

                balance = (arr_data.avaliable_credit * 1) + (arr_data.old_maxcredit * 1);
                _mc["available_credit"].innerHTML = util.mprintf(arr_data.avaliable_credit * 1, 0, 2, false, true);
                _mc["input_credit"].value = util.mprintf(arr_data.old_maxcredit * 1, 0, 2, false, true);
                _mc["trans_credit"].innerHTML = util.mprintf(arr_data.old_maxcredit_trans * 1, 0, 2, false, true);
                acc_par.maxcredit = arr_data.old_maxcredit ;
            } else if (arr_data.code == "err_cash_sw") {
                _self.showError("credit", arr_data.msg);

            } else {
                if (arr_data.msg == null || arr_data.msg == "") {
                    util.chkErrorMsg(arr_data, LS_code);
                    return false;
                }
                parentClass.dispatchEvent("showAlertMsg", arr_data);
            }
        }
    }

    _self.showUserData = function(data){
        var arr_data = JSON.parse(data);
        acc_par.username = arr_data["account"]["username"];
        acc_par.alias = arr_data["account"]["alias"];
        acc_par.maxcredit = arr_data["account"]["maxcredit"];
        acc_par.status = arr_data["account"]["enable"];
        acc_par.psw_enable = arr_data["account"]["pmo_enabled"];
        acc_par.winloss_c = arr_data["account"]["winloss_c"];
        acc_par.currency = arr_data["account"]["currency_code"];

        _mc["input_user"].innerHTML = arr_data["account"]["username"];
        _mc["input_upper_user"].innerHTML = arr_data["account"]["up_username"];
        _mc["input_alias"].value = arr_data["account"]["alias"];
        _mc["status_list"].value = arr_data["account"]["enable"];
        _mc["input_safe"].innerHTML = arr_data["account"]["passwd_safe"];
        _mc["input_create_date"].innerHTML = arr_data["account"]["adddate"];
        balance = (arr_data["account"]["avaliable_credit"] * 1) + (arr_data["account"]["maxcredit"] * 1);
        _mc["available_credit"].innerHTML = util.mprintf(arr_data["account"]["avaliable_credit"] * 1,0,2,false,true);
        _mc["input_credit"].value = util.mprintf(arr_data["account"]["maxcredit"]*1,0,2,false,true);
        _mc["input_ltype"].innerHTML = _self.chg_ltype_str(arr_data["account"]["ltype"]);
        _mc["show_pay_type"].innerHTML = LS.get("long_pay_type_" + param.pay_type);

        if( arr_data["account"]["currency_code"]!="RMB"){
            _mc["box_credit"].className = _mc["box_credit"].className.replace("rmb_credit","box_mem_credit");
        }else{
            _mc["box_credit"].className = _mc["box_credit"].className.replace("box_mem_credit","rmb_credit");
        }
        _mc["trans_credit"].innerHTML = util.mprintf(arr_data["account"]["maxcredit_RMB"]*1,0,2,false,true);
        _mc["currency_rate"].innerHTML = arr_data["account"]["currency_value"];
        _mc["currency_1"].innerHTML = arr_data["account"]["currency"];
        _mc["currency_2"].innerHTML = arr_data["account"]["currency"];
        _mc["last_login"].innerHTML = (arr_data["account"]["logindate"]!=null)?arr_data["account"]["logindate"].split(" ")[0]:"0000-00-00";
        _mc["last_chg_date"].innerHTML = (arr_data["account"]["lastdate"]!=null)?arr_data["account"]["lastdate"]:"0000-00-00";

        _mc["input_psw_recovery"].checked = (arr_data["account"]["pmo_enabled"]!="" && arr_data["account"]["pmo_enabled"]=="E")?true:false;
        _mc["psw_recovery_text"].innerHTML = (_mc["input_psw_recovery"].checked)?LS.get("recv_enable"):LS.get("recv_disable");

        if (arr_data["account"]["enable"] != "Y") {
            var opt_arr = _mc["status_list"].getElementsByTagName("option");
            for (var _i = 0, end = opt_arr.length; _i < end; _i++) {
                opt_arr[_i].style.display = "";
                if (!(opt_arr[_i].value == "Y" || opt_arr[_i].value == arr_data["account"]["enable"])) {
                    opt_arr[_i].style.display = "none";
                }
            }
        }else{
            var opt_arr = _mc["status_list"].getElementsByTagName("option");
            for (var _i = 0, end = opt_arr.length; _i < end; _i++) {
                opt_arr[_i].style.display = "";
            }
        }
        _self.doSelToUL(_mc["status_list"], "status_list_LB");
        util.addEvent(_mc["status_list"], "change", _self.set_UL_value);

        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        // _self.get_performace("overview", "yes",  _self.getOverViewComplete);
    }

    _self.goToAdd = function (mouseEvent) {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.addEvent);
        var tmp_obj = {};
        tmp_obj.id = param.up_id;
        tmp_obj.username = param.edit_username;
        var txt = JSON.stringify(tmp_obj);
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&langx="+top.langx;
        par += "&uid=" + top.uid + "&keys=addAccount" + "&txt=" + txt;
        par +="&langx="+top.langx;
        par = "p=prevData&ver=" + top.ver + "&" + par;
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.addEvent = function (data) {
        var arr_data = JSON.parse(data);
        var _status = util.showTxt(arr_data.status);
        var code = util.showTxt(arr_data.code);
        var msg = util.showTxt(arr_data.msg);
        if (_status == "error") {
            if (msg == null || msg == "") {
                util.chkErrorMsg(arr_data, LS_code);
                return false;
            }
            parentClass.dispatchEvent("showAlertMsg", arr_data);
        } else {
            var obj = new Object();
            var paramHash = new Object();
            paramHash["up_id"] = arr_data.id;
            paramHash["back_page"] = param.back_page;

            obj.page = "acc_mem_add";
            obj.postHash = paramHash;
            parentClass.dispatchEvent("bodyGoToPage", obj);
        }
    }

    _self.targetParam = function(targetName){

        var par = "";
        par+="&ver=" + top.ver;
        par+="&login_layer=" + top.login_layer;
        par+="&uid=" + top.uid;
        par+="&langx=" + top.langx;

        if(targetName == "body_members_edit"){
            par+="&aid="+param.edit_id;
            par+="&sid="+param.up_id;
            par+="&username="+acc_par.username;
            par+="&alias="+acc_par.new_alias;
            par+="&maxcredit="+acc_par.new_credits;
            par+="&currency="+acc_par.currency;
            par+="&pay_type="+param.pay_type;
            par+="&now_maxcredit="+acc_par.maxcredit;

            if(acc_par.status != acc_par.new_status){
                par+="&enable_chk=Y";
                if(acc_par.status == "Y"){
                    if(acc_par.new_status == "F"){
                        par+="&enable_pri=N";
                    }
                }else{
                    if(acc_par.status == "S"){
                        par+="&status=S";
                    }else if(acc_par.status == "F"){
                        par+="&status=S";
                        par+="&enable_pri=Y";
                    }
                }
            }

            if(acc_par.new_psw_enable != acc_par.psw_enable){
                par+="&psw_enable_chk="+acc_par.new_psw_enable;
            }

            par+="&enable="+acc_par.new_status;
        }else if(targetName == "get_list_mems"){
            par+="&mid="+param.edit_id;
            par+="&up_id="+param.up_id;
            par+="&pay_type="+param.pay_type;
            par+="&enable="+param.edit_enable;
            par+="&sort_type=asc";
            par+="&sort_name=username";
            par+="&act=edit";
        }else if(targetName == "chg_psw"){
            par+="&edit_layer="+param.edit_layer;
            par+="&edit_psw="+acc_par.passwd;
            par+="&edit_id="+paramObj.edit_id;
            par+="&pay_type="+param.pay_type;
        }
        return par;
    }

    _self.chg_mail_status = function(e){
        var enable_recv = e.target.checked;
        _mc["psw_recovery_text"].innerHTML = (enable_recv)?LS.get("recv_enable"):LS.get("recv_disable");
    }

    _self.showResetPsw = function(mouseEvent, par){
        _mc["pop_psw"].style.display = (par.isShow)?"":"none";
        if(par.isShow){
            dom.getElementById("body_show").setAttribute("style", "overflow-y:hidden;");
            dom.body.setAttribute("style", "position:fixed; overflow-y:hidden;");
        }else{
            dom.getElementById("body_show").removeAttribute("style");
            dom.body.removeAttribute("style");
        }
        _self.clearResetPsw();
    }

    _self.showTip = function (mouseEvent, par) {
        parentClass.dispatchEvent("showAlertMsg", par);
    }

    //=================顯示 關於額度模式 內容=================
    _self.showAccountType = function (mouseEvent, par) {
        parentClass.dispatchEvent("showAlertMsg", par);
    }

    _self.clearResetPsw = function(){
        _mc["input_psw"].value = "";
        _mc["complexity"].innerHTML = "";
        _mc["psw_light"].className = "ps_strength_img";
        _mc["strengthTxt"].style.display="none";
        if(_mc["box_psw"].classList.contains("psw_error")) _mc["box_psw"].classList.remove("psw_error");
    }

    _self.keyupEventHandler = function(keyEvent){
        _mc["strengthTxt"].style.display="";
        _self.checkThisPassword(_mc["input_psw"].value);
        //var res = _self.str_chk(_mc["input_psw"].value);
        var res = util.str_chk(_mc["input_psw"].value, 1);
        _self.strchk_Msg(res);
        if(_mc["input_psw"].value==""){
            _mc["strengthTxt"].style.display="none";
            _mc["msg_psw"].style.display = "none";
            if(_mc["box_psw"].classList.contains("psw_error")) _mc["box_psw"].classList.remove("psw_error");
        }

        var charCode = "";
        if(keyEvent.keyCode==0){
            charCode = keyEvent.which;
        }else{
            charCode = (keyEvent.keyCode)?keyEvent.keyCode:keyEvent.which;
        }

        if(charCode=="13"){
            if(res=="chk_OK") _self.submitEventHandler();
        }
    }

    //submit
    _self.submitEventHandler = function(mouseEvent, targetObj){
        try{
            _self.connetToServer();
        }catch(e){
            util.echo("chg_pwd error");
        }
    }

    _self.connetToServer = function(){
        acc_par.passwd = _mc["input_psw"].value;
        var par = "p=chg_psw" + _self.targetParam("chg_psw");
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url,"POST", par);
    }

    _self.connectComplete = function(data){
        try{
            var arr_data = JSON.parse(data);
            if(util.chkErrorMsg(arr_data,LS_code)) return;
            if(arr_data["code"]=="504"){
                if(arr_data["status"]=="success"){
                    if(arr_data["status_code"]=="none"){
                        _self.showResetPsw(null,{"isShow":false});
                        parentClass.dispatchEvent("showFadeOutMesg",{"text":LS_account.get("chg_pwd_success")});
                    }
                }else{
                    //秀錯誤訊息(*)
                    _self.showError("psw",LS_code.get(arr_data["status_code"]));
                    _mc["input_psw"].value = "";
                    _mc["psw_btn_save"].disabled = true;
                }
            }else{
                //秀錯誤訊息(*)
                util.echo("error code: " + arr_data["code"]);
                _self.showError("psw", arr_data["msg"]);
                _mc["input_psw"].value = "";
                _mc["psw_btn_save"].disabled = true;
            }
        }catch(e){
            util.echo("[old_chg_pwd]something wrong !!");
            util.echo(e);
        }

    }

    _self.onError = function(){
        util.echo("onError");
    }

    _self.showPwd = function (mouseEvent, targetObj) {
        if (mouseEvent == null || !psw_isShow) {
            psw_isShow = true;
            _mc["input_psw"].setAttribute("type", "text");
            targetObj.className = "eye_icon";
        } else {
            psw_isShow = false;
            _mc["input_psw"].setAttribute("type", "password");
            targetObj.className = "no_eye_icon";
        }
    }

    _self.checkThisPassword = function(password){
        var checked = zxcvbn(password);
        var timetocrack = checked.crack_time;
        var strength = checked.score;

        var timeinwords = _self.toWords(timetocrack);

        _mc["first_estimate"].innerHTML = timeinwords;
        if(password=="") strength = 5;

        _self.displayStrength(strength); //強弱程度

    }
    //James 19/04/30 496.繁簡-密碼强度
    _self.toWords = function(number){

        //is merely seconds, just return rounded numebr
        if (number < 120) {
            return _self.getNumberWords(number, true) + LS.get("pwd_break_Seconds");
        }
        var hour = 60 * 60;
        if (number < hour) {
            minutes = number / 60;
            return _self.getNumberWords(minutes, true) + " " +LS.get("pwd_break_Minutes");
        }

        var day = hour * 24;
        if (number < (2 * day)) {
            hours = number / hour;
            return _self.getNumberWords(hours) + " " +LS.get("pwd_break_Hours");
        }

        var month = day * 30;
        if (number < month) {
            days = number / day;
            return _self.getNumberWords(days) + " " +LS.get("pwd_break_Days");
        }

        var year = day * 365;
        if (number < year) {
            months = number / month;
            return _self.getNumberWords(months) + " " +LS.get("pwd_break_Months");
        }

        var century = year * 100;
        if (number < century * 10) {
            years = number / year;
            return _self.getNumberWords(years) + " " +LS.get("pwd_break_Years");
        }

        if (number < century * 100) {
            centuries = number / century;
            return _self.getNumberWords(centuries) + " " +LS.get("pwd_break_Centuries");
        }

        years = number / year;
        return _self.getNumberWords(years) + " " +LS.get("pwd_break_Years");
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
    //James 19/04/30 496.繁簡-密碼强度
    _self.displayStrength = function(c){
        var f = LS.get("pwd_Very Weak");
        var e = "";
        if (c == 0) {
            f = LS.get("pwd_Very Weak");
            e = "word_red";
            _mc["psw_light"].className = "ps_strength_img ps_strength_light1";
        }
        if (c == 1) {
            f = LS.get("pwd_Weak");
            e = "word_red";
            _mc["psw_light"].className = "ps_strength_img ps_strength_light2";
        }
        if (c == 2) {
            f = LS.get("pwd_Fair");
            e = "word_darkGreen";
            _mc["psw_light"].className = "ps_strength_img ps_strength_light3";
        }
        if (c == 3) {
            f = LS.get("pwd_Good");
            e = "word_darkGreen";
            _mc["psw_light"].className = "ps_strength_img ps_strength_light4";
        }
        if (c == 4) {
            f = LS.get("pwd_Strong");
            e = "word_darkGreen";
            _mc["psw_light"].className = "ps_strength_img ps_strength_light5";
        }
        if (c == 5) {
            f = "";
            _mc["pwd_light"].className = "ps_strength_img";
        }
        _mc["complexity"].innerHTML = f;
        _mc["complexity"].className = e;
        //document.getElementById("complexity").style.backgroundColor = "#" + e;
    }

    //新密碼檢查流程
    /*_self.str_chk = function(str){
        // npbox.className = "ps_input ";
        var str_char=0;
        var str_len = str.length;
        for (var i=0; i < str_len;i++){
            var tmp_str = str.substr(i,1);
            if(tmp_str.match(/[aA-zZ]/))str_char++;
        }
        //新密碼不是由英數字組成
        if(!str.match(/^[0-9aA-zZ]+$/)){
            _self.showError("psw", LS_code.get("4X021"));
            _mc["psw_btn_save"].disabled = true;
            return false;
        }
        //新密碼低於6個字或是大於12個字
        if(str_len < 6 || str_len > 12 ){
            _self.showError("psw",LS_code.get("4X021"));
            _mc["psw_btn_save"].disabled = true;
            return false;
        }
        //新密碼裡面含有空格或是底線
        else if(str.match(/\s/) || str.match(/_/)){
            _self.showError("psw",LS_code.get("4X021"));
            _mc["psw_btn_save"].disabled = true;
            return false;
        }
        else if(str_char >= 1 && str_len > str_char){
            if(_mc["box_psw"].classList.contains("psw_error")) _mc["box_psw"].classList.remove("psw_error");
            _mc["msg_psw"].style.display = "none";
            _mc["psw_btn_save"].disabled = false;
            return true;
        }
        return;
    }*/

    _self.strchk_Msg = function (str) {
        if (str == "err_combination") {
            _self.showError("psw",LS_code.get("4X021"));
            _mc["psw_btn_save"].disabled = true;
        }
        else if (str == "err_length") {
            _self.showError("psw",LS_code.get("4X021"));
            _mc["psw_btn_save"].disabled = true;
        }
        else if (str == "err_contain") {
            _self.showError("psw",LS_code.get("4X021"));
            _mc["psw_btn_save"].disabled = true;
        }
        else if (str == "err_charactersNum") {
            _self.showError("psw", LS_code.get("4X040"));
            _mc["psw_btn_save"].disabled = true;
        }
        else if (str == "err_block_string") {
            _self.showError("psw", LS_code.get("4X040"));
            _mc["psw_btn_save"].disabled = true;
        }
        else if (str == "chk_OK") {
            if(_mc["box_psw"].classList.contains("psw_error")) _mc["box_psw"].classList.remove("psw_error");
            _mc["msg_psw"].style.display = "none";
            _mc["psw_btn_save"].disabled = false;
        }
        else {
            util.echo("chk wrong!!");
            _self.showError("psw",LS_code.get("4X021"));
            _mc["psw_btn_save"].disabled = true;
        }
    }

    _self.initOption=function(targetObj, now, _max, range){
        if(targetObj==null) return;
        if(now !=null && now !="-") now = (100 - now*1);

        var sel = false;
        if(now == null) sel = true;
        var varItem = new Option(LS_account.get("dash_text"), "-", false, sel);
        targetObj.options.add(varItem);

        for(var j=0; j<=_max; j+=range){
                sel = false;
                if(j == now && now !=null ) sel = true;
                var show = j+"%";
                var varItem = new Option(show, j, false, sel);
                targetObj.options.add(varItem);
        }
        _self.doSelToUL(targetObj, targetObj.id + "_LB");
        util.addEvent(targetObj, "change", _self.set_UL_value);
    }

    _self.closeErrMsg = function(){
        _mc["msg_credit"].style.display = "none";
        if( _mc["box_credit"].classList.contains("accadd_error") ) _mc["box_credit"].classList.remove("accadd_error");
    }

    _self.showError = function(types,msg){
        if(types=="psw"){
            _mc["box_"+types].classList.add("psw_error");
        }else if(types=="credit"){//
            _mc["box_"+types].classList.add("accadd_error");
        }
        _mc["msg_"+types].innerHTML = msg;
        _mc["msg_"+types].style.display = "";
        _mc["input_"+types].focus();
    }

    _self.closeEvent = function(e){
        var par = new Array();
        par["page"] = param.back_page;
        if (e == "save") par["LeaveChkPass"] = true;
        if(param.back_page.indexOf("list")!=-1) {
            var _paramObj = new Array();
            _paramObj["up_id"] = param.up_id;
            _paramObj["up_username"] = param.up_username;
            _paramObj["pay_type"] = param.pay_type;
            par["postHash"] = _paramObj;
        }
        parentClass.dispatchEvent("bodyGoToPage", par);
    }

    //==================拉霸隱藏顯示設定==================
    _self.show_sel_box = function (e, ElmObj) {
        if (!ElmObj.classList.contains("on")) {
            ElmObj.classList.add("on");
        }
    }

    _self.close_sel_box = function (e, ElmObj) {
        if (ElmObj.classList.contains("on")) {
            ElmObj.classList.remove("on");
        }
    }
    //==================拉霸隱藏顯示設定 end==================

    //轉換匯率金額
    _self.TransRMB=function(){
        try{
            // var credit = _mc["input_credit"].value.replace(/\D/g,'');
            var credit = _mc["input_credit"].value.replace(/[^\d.]/g, '');
            credit = credit *1;
            var trans = _mc["currency_rate"].innerHTML*credit;
            _mc["trans_credit"].innerHTML = util.mprintf(trans,0,2,false,true);
        }catch(e){
            util.echo(e);
        }
    }

    _self.chg_ltype_str=function(ltype){
        switch(ltype){
            case "1":
                ret = "A";
                break;
            case "2":
                ret = "B";
                break;
            case "4":
                ret = "D"
                break;
            default:
                ret = "C";
                break;
        }
        return ret;
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    //判斷向下滑動 設定加上css
    _self.scrollEvent = function (e, target) {
        var newScrollTop = e.target.scrollTop;
        if (newScrollTop >= overScrollTop) {
            if (!target.issticky) {
                util.classFunc(target, "acc_sticky");
                overScrollTop = e.target.scrollTop;
                target.issticky = true;
            }
        } else {
            if (target.issticky) {
                util.classFunc(target, "acc_sticky", "remove");
                overScrollTop = keepScrollTop;
                target.issticky = false;
            }
        }
    }

    //離開此頁移除事件
    _self.exitEvent = function () {
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        return true;
    }

    _self.doSelToUL = function (DOMSel, labelId) {
        var obj_ids = ",sel_text,sel_list,";
        var elmt = util.getObjAry(dom.getElementById(labelId), obj_ids);
        elmt["sel_label"] = dom.getElementById(labelId);
        elmt["sel_list"].innerHTML = "";
        var options = DOMSel.options;
        for (i = 0; i < options.length; i++) {
            if (options[i].style.display == "none") continue;
            var tmp_li = document.createElement("li");
            tmp_li.id = options[i].value;
            tmp_li.innerHTML = options[i].innerHTML;
            elmt["sel_list"].appendChild(tmp_li);
        }

        var sel_js = new win.ClassSelect(win, dom);
        sel_js.setParentclass(_self);
        sel_js.init(elmt["sel_text"], elmt["sel_list"], elmt["sel_label"], elmt["sel_label"]);
        sel_js.setSelected(DOMSel.value);
        sel_js.addEvent("ONCHANGE", _self.set_SEL_value, DOMSel);
        sel_js.addEvent("ONOPEN", _self.show_sel_box, elmt["sel_label"]);
        sel_js.addEvent("ONCLOSE", _self.close_sel_box, elmt["sel_label"]);
        DOMSel["JS_UL"] = sel_js;
    }

    _self.set_SEL_value = function (e, ElmObj) {
        ElmObj.value = ElmObj.JS_UL.value();
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            ElmObj.dispatchEvent(evt);
        }
        else {
            ElmObj.fireEvent("onchange");
        }
    }

    _self.set_UL_value = function (e) {
        e.target.JS_UL.setSelected(e.target.value);
    }

    //==================拉霸隱藏顯示設定==================
    _self.show_sel_box = function (e, ElmObj) {
        if (!ElmObj.classList.contains("on")) {
            ElmObj.classList.add("on");
        }
    }

    _self.close_sel_box = function (e, ElmObj) {
        if (ElmObj.classList.contains("on")) {
            ElmObj.classList.remove("on");
        }
    }
    //==================拉霸隱藏顯示設定 end==================

    _self.isEdit = function () {
        var new_alias = _mc["input_alias"].value;
        // var new_credits = _mc["input_credit"].value.replace(/\D/g,'');
        var new_credits = _mc["input_credit"].value.replace(/[^\d.-]/g, '');
        var new_status = _mc["status_list"].value;
        var new_psw_recv = (_mc["input_psw_recovery"].checked)?"E":"S";
        if( (new_alias != acc_par.alias) || (new_credits*1 != acc_par.maxcredit*1) || (new_status != acc_par.status) || (new_psw_recv != acc_par.psw_enable) ){
            return true;
        } else {
            return false;
        }
    }
}