function acc_ad_add(_win, _dom, paramObj){
    var _self = this;
    var win = _win;
    var dom = _dom;

    var parentClass;
    var util;
    var LS;
    var LS_code;
    var LS_account;
    var config_set;

    var _mc = new Object();
    var ctlObj = new Array();
    var confObj = new Array();
    var titleObj = new Array();
    var dateHash = new Object();
    var eventHandler = new Object();
    var credit_old_min_m;
    var credit_old_min_r;
    var credit_old_min_re;
    var credit_old_min_dt;
    var credit_old_min_rdt;
    var credit_old_min_fs;
    var credit_old_max_m;
    var credit_old_max_r;
    var credit_old_max_re;
    var credit_old_max_dt;
    var credit_old_max_rdt;
    var credit_old_max_fs;
    var commiss_gtype = "FT";
    var balance = 0;
    var keepScrollTop = 56;
    var overScrollTop = 56;

    _self.init=function(){
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        parentClass.dispatchEvent("chgPageName", { "pageType": "account","pageName": "ad_add" });
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "account" });
        //設定離開確認事件
        var obj = new Object();
        obj["Alert"] = { "msg": LS_account.get("str_unsave"), "mode": "Y" };
        obj["ifNo"] = _self.exitConfirmNo;
        parentClass.dispatchEvent("SetConfirmExit", obj);

        var obj_ids = ",box_user,input_user,msg_user,box_url,input_url,msg_url,box_alias,input_alias,msg_alias,box_enddate,input_enddate,msg_enddate,input_no_date,password_i_box,box_passwd,input_passwd,msg_passwd,eye_pwd,scroll_div,";
        obj_ids += "btn_save,btn_new,btn_cancel,msg_sports_credit,box_top,box_bottom,msg_max_credit,strengthTxt,first_estimate,pwd_light,complexity,";
        obj_ids += "input_min_m,credit_min_m,";
        obj_ids += "input_min_r,credit_min_r,";
        obj_ids += "input_min_re,credit_min_re,";
        obj_ids += "input_min_dt,credit_min_dt,";
        obj_ids += "input_min_rdt,credit_min_rdt,";
        obj_ids += "input_min_fs,credit_min_fs,";

        obj_ids += "input_max_m,credit_max_m,";
        obj_ids += "input_max_r,credit_max_r,";
        obj_ids += "input_max_re,credit_max_re,";
        obj_ids += "input_max_dt,credit_max_dt,";
        obj_ids += "input_max_rdt,credit_max_rdt,";
        obj_ids += "input_max_fs,credit_max_fs,";
        _mc = util.getObjAry(dom, obj_ids);

        /*var obj_ids = ",strengthTxt,first_estimate,pwd_light,complexity,eye_pwd,";
        var tmpObj = util.getObjAry(_mc["account_info"], obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);*/

        ctlObj["user"] = new Object();
        ctlObj["user"].box = _mc["box_user"];
        ctlObj["user"].msg = _mc["msg_user"];
        ctlObj["user"].input = _mc["input_user"];

        ctlObj["alias"] = new Object();
        ctlObj["alias"].box = _mc["box_alias"];
        ctlObj["alias"].msg = _mc["msg_alias"];
        ctlObj["alias"].input = _mc["input_alias"];

        ctlObj["url"] = new Object();
        ctlObj["url"].box = _mc["box_url"];
        ctlObj["url"].msg = _mc["msg_url"];
        ctlObj["url"].input = _mc["input_url"];

        ctlObj["enddate"] = new Object();
        ctlObj["enddate"].box = _mc["box_enddate"];
        ctlObj["enddate"].msg = _mc["msg_enddate"];
        ctlObj["enddate"].input = _mc["input_enddate"];
        ctlObj["enddate"].checkbox = _mc["input_no_date"];

        ctlObj["passwd"] = new Object();
        ctlObj["passwd"].box = _mc["box_passwd"];
        ctlObj["passwd"].msg = _mc["msg_passwd"];
        ctlObj["passwd"].input = _mc["input_passwd"];
        _mc["eye_pwd"].isShow = false;
        _mc["eye_pwd"].BlurPwdOFF = false;

        ctlObj["input_min_m"] = new Object();
        ctlObj["input_min_m"].box = _mc["box_top"];
        ctlObj["input_min_m"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_m"].input = _mc["input_min_m"];

        ctlObj["input_min_r"] = new Object();
        ctlObj["input_min_r"].box = _mc["box_top"];
        ctlObj["input_min_r"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_r"].input = _mc["input_min_r"];

        ctlObj["input_min_re"] = new Object();
        ctlObj["input_min_re"].box = _mc["box_top"];
        ctlObj["input_min_re"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_re"].input = _mc["input_min_re"];

        ctlObj["input_min_dt"] = new Object();
        ctlObj["input_min_dt"].box = _mc["box_top"];
        ctlObj["input_min_dt"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_dt"].input = _mc["input_min_dt"];

        ctlObj["input_min_rdt"] = new Object();
        ctlObj["input_min_rdt"].box = _mc["box_top"];
        ctlObj["input_min_rdt"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_rdt"].input = _mc["input_min_rdt"];

        ctlObj["input_min_fs"] = new Object();
        ctlObj["input_min_fs"].box = _mc["box_top"];
        ctlObj["input_min_fs"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_fs"].input = _mc["input_min_fs"];

        ctlObj["input_max_m"] = new Object();
        ctlObj["input_max_m"].box = _mc["box_top"];
        ctlObj["input_max_m"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_m"].input = _mc["input_max_m"];

        ctlObj["input_max_r"] = new Object();
        ctlObj["input_max_r"].box = _mc["box_top"];
        ctlObj["input_max_r"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_r"].input = _mc["input_max_r"];

        ctlObj["input_max_re"] = new Object();
        ctlObj["input_max_re"].box = _mc["box_top"];
        ctlObj["input_max_re"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_re"].input = _mc["input_max_re"];

        ctlObj["input_max_dt"] = new Object();
        ctlObj["input_max_dt"].box = _mc["box_top"];
        ctlObj["input_max_dt"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_dt"].input = _mc["input_max_dt"];

        ctlObj["input_max_rdt"] = new Object();
        ctlObj["input_max_rdt"].box = _mc["box_top"];
        ctlObj["input_max_rdt"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_rdt"].input = _mc["input_max_rdt"];

        ctlObj["input_max_fs"] = new Object();
        ctlObj["input_max_fs"].box = _mc["box_top"];
        ctlObj["input_max_fs"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_fs"].input = _mc["input_max_fs"];
        var obj_ids = ",account_title_box,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for (var objid in tmpObj) {
            var ta = objid.split("_");
            tmpObj[objid].mapA = ta[0];
            if (objid.search("title_box") != -1) {
                tmpObj[objid].mapB = "_info";
                tmpObj[objid]._type = "TITLE";
            }else{
                tmpObj[objid].mapB = "_commis_info";
                tmpObj[objid]._type = "COMMIS";
            }
            titleObj[objid] = tmpObj[objid];
            util.addEvent(tmpObj[objid], "click", _self.ShowAndHidden, tmpObj[objid]);
        }
        /*var domain = document.domain;
        domain = domain.match(/[^\.]*\.[^.]*$/)[0];
        _mc["input_url"].value = domain;*/
        _mc["btn_save"].backPage = "acc_su_list";
        _mc["btn_new"].backPage = "acc_su_add";

        util.addEvent(_mc["btn_cancel"], "click", _self.closeEvent, "cancel");
        util.addEvent(_mc["btn_save"], "click", _self.saveEvent, _mc["btn_save"]);
        util.addEvent(_mc["btn_new"], "click", _self.saveEvent, _mc["btn_new"]);

        util.ChkKeyUser(ctlObj["user"].input);
        util.addEvent(ctlObj["user"].input, "blur", _self.checkUserNameEvent, ctlObj["user"].input);
        util.addEvent(ctlObj["user"].input, "focus", _self.clearErrorStatusCtl, ctlObj["user"]);

        util.addEvent(ctlObj["alias"].input, "blur", _self.checkNameEvent, ctlObj["alias"].input);
        util.addEvent(ctlObj["alias"].input, "focus", _self.clearErrorStatusCtl, ctlObj["alias"]);

        util.addEvent(ctlObj["url"].input, "blur", _self.checkUrlEvent, ctlObj["url"].input);
        util.addEvent(ctlObj["url"].input, "focus", _self.clearErrorStatusCtl, ctlObj["url"]);

        util.ChkKeyUser(ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "keyup", _self.checkThisPassword, ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "blur", _self.checkThisPassword, ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "focus", function () { _self.setBoxClass(ctlObj["passwd"].box, "psw_error", ""); }, ctlObj["passwd"].input);

        util.addEvent(ctlObj["input_min_m"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_min_r"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_min_re"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_min_dt"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_min_rdt"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_min_fs"].input, "keydown", _self.keep_credits);

        util.addEvent(ctlObj["input_max_m"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_max_r"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_max_re"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_max_dt"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_max_rdt"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_max_fs"].input, "keydown", _self.keep_credits);

        util.ChkKeyCash(ctlObj["input_min_m"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_min_r"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_min_re"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_min_dt"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_min_rdt"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_min_fs"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });

        util.ChkKeyCash(ctlObj["input_max_m"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_max_r"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_max_re"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_max_dt"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_max_rdt"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_max_fs"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });

        util.addEvent(_mc["eye_pwd"], "click", _self.showPwd, _mc["eye_pwd"]);
        util.addEvent(_mc["eye_pwd"], "mousedown", _self.BlurPwdOFF, _mc["eye_pwd"]);

        //監聽提示小視窗
        var tip_message = document.getElementsByName("tip_message");
        for (var i = 0, len = tip_message.length; i < len; i++) {
            var icon = tip_message[i].parentElement;
            util.setInfEvent(icon, { "_focus": tip_message[i], "_setView": tip_message[i], "_viewClass": "on" });
        }

        // 帳號狀態 i 提示
        util.addEvent(_mc["possess_tip"], "click", _self.showTip, { "_id": "possess_pop" });
        _self.parseJSON();
        _self.initCalendar(); //日历
        _self.loadUpperConf();
        _self.showPwd(null, _mc["eye_pwd"]);

        keepScrollTop = _mc["account_title_box"].parentElement.offsetHeight;
        overScrollTop = _mc["account_title_box"].parentElement.offsetHeight;
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, _mc["scroll_div"]);
        dom.getElementById("body_show").scrollTop = 0;

        parentClass.dispatchEvent("showLoading", { "showLoading": false });
    }

    _self.initCalendar=function(){
        _self.setCalendar(dateHash, "enddate");
    }

    _self.parseJSON=function(){
        dateHash = JSON.parse(win.jsonDate);
        util.echo(dateHash);
    }
    _self.setCalendar=function(dateHash, _name){
        var sPar = new Object();
        sPar.div = dom.getElementById("box_enddate");
        sPar.input = dom.getElementById("input_"+_name);
        sPar.photo = dom.getElementById("date_"+_name);
        sPar.def_date = dateHash.today;
        sPar.langx = top.langx;
        sPar.CalendarClass = win.ClassFankCal;
        sPar.period_ls = dateHash.period_ls;
        sPar.period_le = dateHash.period_le;
        sPar.WEB_TIME_ZONE = dateHash.WEB_TIME_ZONE;

        var sDate = new win.calendar(win,dom);
        sDate.setParentclass(_self);
        sDate.init(sPar);
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

    _self.setConfEvent = function (mouseEvent, targetObj) {
        confObj[targetObj.setK].value = targetObj.setV;
        if (targetObj.ftype == "SC") {
            confObj[targetObj.gtype + "_" + targetObj.rtype + "_1_SO"].value = confObj[targetObj.gtype + "_" + targetObj.rtype + "_1_SO_limit"].setV;
        }
    }

    _self.closeEvent = function (e) {
        var obj = new Object();
        obj.postHash = paramObj.back_param;
        obj.page = paramObj.back_page;
        if (e == "save") obj.LeaveChkPass = true;
        parentClass.dispatchEvent("bodyGoToPage", obj);
    }

    _self.exitConfirmNo = function () {
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "account" });
    }

    _self.IInfoEvent = function (mouseEvent, targetObj) {
		/*
		if(targetObj.types == "password"){
			var absObj = util.getObjAbsolute_new(targetObj,"add_super_box");
			_mc[targetObj.types+"_i_box"].style.top = (absObj["top"]+targetObj.offsetHeight)+"px";
		}
		*/
        _mc[targetObj.types + "_i_box"].style.display = (_mc[targetObj.types + "_i_box"].style.display == "") ? "none" : "";
    }

    _self.ShowAndHidden = function (mouseEvent, element) {
        for (var id in titleObj) {
            if (titleObj[id].classList.contains("on") && element._type == titleObj[id]._type && element.id != id){
                titleObj[id].classList.remove("on");
                var setNone = ""+titleObj[id].mapA + titleObj[id].mapB;
                _mc[setNone].style.display = "none";
            }
        }
        if (!element.classList.contains("on")) {
            element.classList.add("on");
        }
        
    }

    //============== load conf ==============
    _self.loadUpperConf = function () {
        var getHttp = new HttpRequest();
        var param = _self.getConfParam();
        getHttp.addEventListener("LoadComplete", _self.loadConfFinish);
        param = "p=get_upper_conf&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.loadConfFinish=function(data){
        var xmlObj = new Object();
        var arr_data = JSON.parse(data);
        var conn = arr_data.conn;

        dom.getElementById("input_min_m").value = conn.m_min*1;
        dom.getElementById("input_min_r").value = conn.r_min*1;
        dom.getElementById("input_min_re").value = conn.re_min*1;
        dom.getElementById("input_min_dt").value = conn.dt_min*1;
        dom.getElementById("input_min_rdt").value = conn.rdt_min*1;
        dom.getElementById("input_min_fs").value = conn.fs_min*1;

        dom.getElementById("input_max_m").value = conn.m_max*1;
        dom.getElementById("input_max_r").value = conn.r_max*1;
        dom.getElementById("input_max_re").value = conn.re_max*1;
        dom.getElementById("input_max_dt").value = conn.dt_max*1;
        dom.getElementById("input_max_rdt").value = conn.rdt_max*1;
        dom.getElementById("input_max_fs").value = conn.fs_max*1;
    }


    _self.count_so = function (keyEvent) {
        _self.show_credits(keyEvent);
        var now_val = keyEvent.target.value.replace(/[^\d]*/g, "");
        var so_v = (now_val * 1) / 2;
        confObj[keyEvent.target.chgK].value = util.mprintf(so_v, 0, 0, false, true);
    }

    _self.getConfParam = function () {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&up_layer=ads";
        par += "&up_id=" + top.layer_id;
        par += "&langx=" + top.langx; //19/04/30 James *483.>>>新增帳號時，幣值/阻擋訊息還是沒有翻到
        return par;
    }
    //============== load conf ==============

    _self.initOption = function (targetObj, _max, range) {
        if (targetObj == null) return;
        targetObj.options.length = 0;

        for (var j = 0; j <= _max; j += range) {
            var varItem = new Option(j, j, false, false);
            targetObj.options.add(varItem);
        }
        targetObj.selectedIndex = targetObj.options.length - 1;
        _self.doSelToUL(targetObj, targetObj.id + "_LB");
        util.addEvent(targetObj, "change", _self.set_UL_value);
    }

    //============== save ==============
    _self.saveEvent = function (mouseEvent, targetObj) {
        //2019-04-09 Ricky 150.新增帳號-成功創建新帳戶後，將會顯示7秒的短暫訊息“成功新增帳戶。現在大概只有2秒，且應有copy的字眼可以複製帳密，現在訊息account successfully created，應該是New Account Created
        dom.getElementById("copyArea").innerHTML = LS.get("copy_user")+ctlObj["user"].input.value+"<br>"+LS.get("copy_pwd")+ctlObj["passwd"].input.value;
        var ret = _self.submitCheck();
        if (ret) {
            var getHttp = new HttpRequest();
            getHttp.addEventListener("LoadComplete", function (data) {
                _self.saveFinish(data, targetObj);
            });
            var param = _self.getSaveParam();
            param = "p=body_admin_add&ver=" + top.ver + "&" + param;
            getHttp.loadURL(top.url, "POST", param);
        }
    }

    _self.saveFinish = function (data, targetObj) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        if (_status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg != null && error_msg != "") {
                _self.show_Error(error_code, error_msg, arr_data);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
        } else {
            //2019-04-09 Ricky 150.新增帳號-成功創建新帳戶後，將會顯示7秒的短暫訊息“成功新增帳戶。現在大概只有2秒，且應有copy的字眼可以複製帳密，現在訊息account successfully created，應該是New Account Created
            //parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_account_success")});
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_account_success") ,"s":5 , "showCopy":"Y" ,"value":LS.get("account_copy")});
            util.addEvent(dom.getElementById("btn_copy"), "click", _self.copyInput);

            if (targetObj.id == "btn_new") {
                var obj = new Object();
                obj.page = targetObj.backPage;
                obj.postHash = paramObj;
                obj.LeaveChkPass = true;
                parentClass.dispatchEvent("bodyGoToPage", obj);
            } else {
                _self.closeEvent("save");
            }
        }
    }

    _self.copyInput = function (){
        var range = dom.createRange();
        var showDiv = dom.getElementById("copyArea");
        //setVisible(showDiv, true);
        range.selectNode(showDiv);
        getSelection().removeAllRanges();
        getSelection().addRange(range);

        try {
            var successful = dom.execCommand("copy");
            var msg = successful ? "successful" : "fail";
        }catch(e){}

        //setVisible(showDiv, false);

        //alert("copy :" + msg);
        util.echo("copy :" + msg);

        //James 19/04/30 498.繁簡-新增帳號成功的訊息
        if(msg == "successful") parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("copy_success") });
        else util.echo("copy_fail");
    }

    _self.getSaveParam = function () {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&keys=add";
        par += "&enable=Y";
        par += "&username=" + _mc["input_user"].value;
        par += "&alias=" + _mc["input_alias"].value;
        par += "&url=" + _mc["input_url"].value;
        par += "&passwords=" + _mc["input_passwd"].value;
        par += "&passwords=" + _mc["input_passwd"].value;
        par += "&min_m=" + _mc["input_min_m"].value.replace(/\,/g,'');
        par += "&min_r=" + _mc["input_min_r"].value.replace(/\,/g,'');
        par += "&min_re=" + _mc["input_min_re"].value.replace(/\,/g,'');
        par += "&min_rdt=" + _mc["input_min_rdt"].value.replace(/\,/g,'');
        par += "&min_dt=" + _mc["input_min_dt"].value.replace(/\,/g,'');
        par += "&min_fs=" + _mc["input_min_fs"].value.replace(/\,/g,'');

        par += "&max_m=" + _mc["input_max_m"].value.replace(/\,/g,'');
        par += "&max_r=" + _mc["input_max_r"].value.replace(/\,/g,'');
        par += "&max_re=" + _mc["input_max_re"].value.replace(/\,/g,'');
        par += "&max_dt=" + _mc["input_max_dt"].value.replace(/\,/g,'');
        par += "&max_rdt=" + _mc["input_max_rdt"].value.replace(/\,/g,'');
        par += "&max_fs=" + _mc["input_max_fs"].value.replace(/\,/g,'');
        par += "&up_layer=ad";
        par += "&langx=" + top.langx; //19/04/30 James *483.>>>新增帳號時，幣值/阻擋訊息還是沒有翻到
        par += "&up_id=" + top.layer_id;

        if(_mc["input_no_date"].checked){
            par += "&enddate=0";
        }else{
            par += "&enddate=" + _mc["input_enddate"].value;
        }
        return par;
    }

    //============== save ==============

    _self.setBoxClass = function (targetObj, style ,_doSome) {
        if (targetObj== null) return;
        if (targetObj.initclass == null){
            targetObj.initclass = targetObj.className;
        }else{
            targetObj.className = targetObj.initclass;
        }
        if (_doSome == "add" &&!targetObj.classList.contains(style)) {
            targetObj.classList.add(style);
        }
    }

    //============== check username ==============
    _self.checkUserNameEvent = function (e, targetObj) {
        if (targetObj.value != "") {
            var getHttp = new HttpRequest();
            var param = _self.getCheckParam(targetObj.value);
            param += "&upper_layer=co";
            param += "&upper_id=" + top.layer_id;
            getHttp.addEventListener("LoadComplete", _self.loadCheckFinish);
            param = "p=chk_username&ver=" + top.ver + "&" + param;
            getHttp.loadURL(top.url, "POST", param);
        } else {
            ctlObj["user"].msg.innerHTML = LS.get("empty_user");
            _self.setBoxClass(ctlObj["user"].box,"accadd_error","add");
        }
    }

    _self.loadCheckFinish = function (data) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        var code = util.showTxt(arr_data.code);
        var msg = util.showTxt(arr_data.msg);

        if (_status == "error") {
            if (msg != null && msg != "") {
                ctlObj[code].input.value = "";
                _self.showErrorCtl(code, msg);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
        } else if (_status == "no_use") {
            ctlObj[code].msg.innerHTML = msg;
            _self.setBoxClass(ctlObj[code].box, "accadd_succ", "add");
        }
    }

    _self.getCheckParam = function (username) {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&view_layer=ad";
        par += "&username=" + username;
        par += "&langx="+top.langx;
        return par;
    }
    //============== check username ==============

    _self.checkNameEvent = function (e, targetObj) {
        if (targetObj.value == "") {
            ctlObj["alias"].msg.innerHTML = LS.get("empty_alias");
            _self.setBoxClass(ctlObj["alias"].box, "accadd_error", "add");
        }
    }

    _self.checkUrlEvent = function (e, targetObj) {
        if (targetObj.value == "") {
            ctlObj["url"].msg.innerHTML = LS.get("empty_alias");
            _self.setBoxClass(ctlObj["url"].box, "accadd_error", "add");
        }
    }

    _self.ChkCreditErr = function (e) {
        if (e.target == ctlObj["input_min_m"].input) {
            _self.showErrorCtl("input_min_m", LS.get("str_min_m"));
        }

        if (e.target == ctlObj["input_min_r"].input) {
            _self.showErrorCtl("input_min_r", LS.get("str_min_r"));
        }

        if (e.target == ctlObj["input_min_re"].input) {
            _self.showErrorCtl("input_min_re", LS.get("str_min_re"));
        }

        if (e.target == ctlObj["input_min_dt"].input) {
            _self.showErrorCtl("input_min_dt", LS.get("str_min_dt"));
        }

        if (e.target == ctlObj["input_min_rdt"].input) {
            _self.showErrorCtl("input_min_rdt", LS.get("str_min_rdt"));
        }

        if (e.target == ctlObj["input_min_fs"].input) {
            _self.showErrorCtl("input_min_fs", LS.get("str_min_fs"));
        }

        if (e.target == ctlObj["input_max_m"].input) {
            _self.showErrorCtl("input_max_m", LS.get("str_max_m"));
        }

        if (e.target == ctlObj["input_max_r"].input) {
            _self.showErrorCtl("input_max_r", LS.get("str_max_r"));
        }

        if (e.target == ctlObj["input_max_re"].input) {
            _self.showErrorCtl("input_max_re", LS.get("str_max_re"));
        }

        if (e.target == ctlObj["input_max_dt"].input) {
            _self.showErrorCtl("input_max_dt", LS.get("str_max_dt"));
        }

        if (e.target == ctlObj["input_max_rdt"].input) {
            _self.showErrorCtl("input_max_rdt", LS.get("str_max_rdt"));
        }

        if (e.target == ctlObj["input_max_fs"].input) {
            _self.showErrorCtl("input_max_fs", LS.get("str_max_fs"));
        }
    }

    _self.keep_credits = function (e) {
        var va = e.target.value.replace(/\D/g, '');
        if (e.target == ctlObj["input_min_m"].input) {
            credit_old_min_m = va;
        }

        if (e.target == ctlObj["input_min_r"].input) {
            credit_old_min_r = va;
        }

        if (e.target == ctlObj["input_min_re"].input) {
            credit_old_min_re = va;
        }

        if (e.target == ctlObj["input_min_ou"].input) {
            credit_old_min_ou = va;
        }

        if (e.target == ctlObj["input_min_dt"].input) {
            credit_old_min_dt = va;
        }

        if (e.target == ctlObj["input_min_rdt"].input) {
            credit_old_min_rdt = va;
        }

        if (e.target == ctlObj["input_min_fs"].input) {
            credit_old_min_fs = va;
        }

        if (e.target == ctlObj["input_max_m"].input) {
            credit_old_max_m = va;
        }

        if (e.target == ctlObj["input_max_r"].input) {
            credit_old_max_r = va;
        }

        if (e.target == ctlObj["input_max_re"].input) {
            credit_old_max_re = va;
        }

        if (e.target == ctlObj["input_max_dt"].input) {
            credit_old_max_dt = va;
        }

        if (e.target == ctlObj["input_max_rdt"].input) {
            credit_old_max_rdt = va;
        }

        if (e.target == ctlObj["input_max_fs"].input) {
            credit_old_max_fs = va;
        }
    }

    //信用額度轉換千位顯示
    _self.show_credits = function (e) {
        if (e.target == ctlObj["input_min_m"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_m, e);
        } else if(e.target == ctlObj["input_min_r"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_r, e);
        } else if(e.target == ctlObj["input_min_re"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_re, e);
        } else if(e.target == ctlObj["input_min_dt"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_dt, e);
        } else if(e.target == ctlObj["input_min_rdt"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_rdt, e);
        } else if(e.target == ctlObj["input_min_fs"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_fs, e);
        } else if (e.target == ctlObj["input_max_m"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_m, e);
        } else if(e.target == ctlObj["input_max_r"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_r, e);
        } else if(e.target == ctlObj["input_max_re"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_re, e);
        } else if(e.target == ctlObj["input_max_dt"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_dt, e);
        } else if(e.target == ctlObj["input_max_rdt"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_rdt, e);
        } else if(e.target == ctlObj["input_max_fs"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_fs, e);
        }else if (e.type == "input") {
            util.Replace_Input_credits(e.target, credit_old, e);
        } else {
            util.Replace_credits(e.target, credit_old, e);
        }

    }

    //轉換匯率金額
    _self.TransRMB = function () {
        var credit = _mc["input_credit"].value.replace(/\D/g, '');
        credit = credit * 1;
        var trans = _mc["currency_def"].innerHTML * credit;
        _mc["input_credit_RMB"].innerHTML = util.mprintf(trans, 0, 2, false, true);

    }

    //=================錯誤訊息=================
    _self.showErrorCtl = function (code, msg) {
        if (code == "system") {
            code = "user";
        }
        if(code){
            _self.clearErrorStatusCtl(null,ctlObj[code]);
        }else{
            _self.clearErrorStatusCtl();
        }
        // _self.clearErrorStatusCtl();
        var obj = ctlObj[code];
        var error_class = "accadd_error";
        if (obj != null) {
            ctlObj[code].msg.innerHTML = msg;
            if (code == "passwd") error_class = "psw_error";
            _self.setBoxClass(ctlObj[code].box, error_class, "add");
            //if (code != "user") ctlObj[code].input.focus();
            _self.ShowAndHidden(null, _mc["account_title_box"]);
        }
    }

    _self.clearErrorStatusCtl = function (e, target) {
        if (target != null) {
            _self.setBoxClass(target.box, "accadd_error", "");
        } else {
            for (var key in ctlObj) {
                if (key != "posses") {
                    _self.setBoxClass(ctlObj[key].box, "", "");
                }
            }
        }
    }

    _self.showErrorPwd = function (code, msg) {
        var obj = ctlObj[code];
        if (obj != null) {
            ctlObj[code].msg.innerHTML = msg;
            _self.setBoxClass(ctlObj[code].box, "psw_error", "add");
        }
    }

    _self.clearErrorStatusConf = function () {
        for (var key in confObj) {
            _self.setBoxClass(confObj[key].box, "", "");
        }
    }

    _self.show_Error = function (code, msg, arr_data) {
        var tmp = code.split("|");
        if (tmp[0] == "errormsg") {
            _self.showErrorMsg(tmp[1], msg);
        } else if (tmp[0] == "ctl") {
            _self.showErrorCtl(tmp[1], msg);
        } else if (tmp[0] == "conf") {
            _self.showErrorConf(tmp[1], msg);
        } else {
            if (msg != null && msg != "") {
                parentClass.dispatchEvent("showAlertMsg", arr_data);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
        }
    }

    _self.showErrorMsg = function (code, msg) {
        if (code == "clean_db") {
            var obj = new Object();
            obj.msg = msg;
            obj.backPage = "account";
            parentClass.dispatchEvent("showAlertMsg", obj);
        }
    }

    //show conf obj error
    _self.showErrorConf = function (code, msg) {
        var obj = confObj[code];
        if (obj != null) {
            if (obj.ftype != null && obj.limit == null) {
                _self.initShow();
                obj.msg.innerHTML = msg;
                _self.setBoxClass(obj.box, "accadd_error", "add");
                commiss_gtype = obj.gtype;
                _self.ShowAndHidden(null, _mc["commission_title_box"]);
                obj.focus();
            }
        }
    }
    //=================錯誤訊息 end=================

    _self.submitCheck = function () {
        _self.initShow();
        for (var key in ctlObj) {
            if(key == "enddate"){
                if(!ctlObj["enddate"].checkbox.checked){
                    if (ctlObj[key].input.value == "") {
                        _self.showErrorCtl(key, LS.get("empty_" + key));
                        return false;
                    }else{
                        var RegDate = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/;
                        var date = ctlObj["enddate"].input.value;
                        if(!RegDate.test(date)){
                            _self.showErrorCtl(key, LS.get("empty_enddate1"));
                            return false;
                        }
                    }
                }
            } else {
                if (ctlObj[key].input.value == "") {
                    _self.showErrorCtl(key, LS.get("empty_" + key));
                    return false;
                }
            }

        }

        if (!util.checkFormat(ctlObj["user"].input.value, 0)) {
            _self.showErrorCtl("user", LS.get("empty_user"));
            return false;
        }

        if (!util.checkFormat(ctlObj["passwd"].input.value, 0)) {
            _self.showErrorCtl("passwd", LS.get("empty_passwd"));
            return false;
        }

        if (!_self.str_chk(ctlObj["passwd"].input.value)) {
            return false;
        }


		if(!util.checkFormat(ctlObj["input_min_m"].input.value.replace(/\,/g,''),1)){
			_self.showErrorCtl("input_min_m", LS.get("str_min_m"));
			return false;
		}

        if(!util.checkFormat(ctlObj["input_min_r"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_min_r", LS.get("str_min_r"));
            return false;
        }

        if(!util.checkFormat(ctlObj["input_min_re"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_min_re", LS.get("str_min_re"));
            return false;
        }

        if(!util.checkFormat(ctlObj["input_min_dt"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_min_dt", LS.get("str_min_dt"));
            return false;
        }

        if(!util.checkFormat(ctlObj["input_min_rdt"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_min_rdt", LS.get("str_min_dt"));
            return false;
        }


        if(!util.checkFormat(ctlObj["input_min_fs"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_min_fs", LS.get("str_min_fs"));
            return false;
        }

        if(!util.checkFormat(ctlObj["input_max_m"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_max_m", LS.get("str_max_m"));
            return false;
        }

        if(!util.checkFormat(ctlObj["input_max_r"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_max_r", LS.get("str_max_r"));
            return false;
        }

        if(!util.checkFormat(ctlObj["input_max_re"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_max_re", LS.get("str_max_re"));
            return false;
        }

        if(!util.checkFormat(ctlObj["input_max_dt"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_max_dt", LS.get("str_max_dt"));
            return false;
        }

        if(!util.checkFormat(ctlObj["input_max_rdt"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_max_rdt", LS.get("str_max_dt"));
            return false;
        }


        if(!util.checkFormat(ctlObj["input_max_fs"].input.value.replace(/\,/g,''),1)){
            _self.showErrorCtl("input_max_fs", LS.get("str_max_fs"));
            return false;
        }

        for (var objid in confObj) {
            if (confObj[objid].value == "") {
                _self.showErrorConf(objid, LS.get("empty_user"))
                return false;
            }
        }
        return true;
    }

    _self.initShow = function (e) {
        var target = new Object();
        if(e){
            var ctl_tmp = e.target.id.replace("input_", "") ;
            if (ctlObj[ctl_tmp]){
                target = ctlObj[ctl_tmp];
            } else {
                for (var key in ctlObj) {
                    if (ctlObj[key].input == e.target){
                        target = ctlObj[key] ;
                        break ;
                    }
                }
            }
        }
        _self.clearErrorStatusCtl(e, target);
        _self.clearErrorStatusConf();
    }

    //=================密碼強弱=================
    _self.checkThisPassword = function (keyEvent, targetObj) {
        if (keyEvent.type == "blur" && _mc["eye_pwd"].BlurPwdOFF){
            _mc["eye_pwd"].BlurPwdOFF = false;
            return;
        }

        _mc["strengthTxt"].style.display = "";
        var password = _mc["input_passwd"].value;
        var checked = zxcvbn(password);
        var timetocrack = checked.crack_time;
        var strength = checked.score;

        var timeinwords = _self.toWords(timetocrack);

        _mc["first_estimate"].innerHTML = timeinwords;
        if (password == ""){
            _mc["strengthTxt"].style.display = "none";
            strength = 5;
        }

        _self.displayStrength(strength); //強弱程度
        _self.str_chk(ctlObj["passwd"].input.value);

    }
    //James 19/04/30 496.繁簡-密碼强度
    _self.displayStrength = function (c) {
        var f = LS.get("pwd_Very Weak");
        var e = "";
        if (c == 0) {
            f = LS.get("pwd_Very Weak");
            e = "word_red";
            _mc["pwd_light"].className = "ps_strength_img ps_strength_light1";
        }
        if (c == 1) {
            f = LS.get("pwd_Weak");
            e = "word_red";
            _mc["pwd_light"].className = "ps_strength_img ps_strength_light2";
        }
        if (c == 2) {
            f = LS.get("pwd_Fair");
            e = "word_darkGreen";
            _mc["pwd_light"].className = "ps_strength_img ps_strength_light3";
        }
        if (c == 3) {
            f = LS.get("pwd_Good");
            e = "word_darkGreen";
            _mc["pwd_light"].className = "ps_strength_img ps_strength_light4";
        }
        if (c == 4) {
            f = LS.get("pwd_Strong");
            e = "word_darkGreen";
            _mc["pwd_light"].className = "ps_strength_img ps_strength_light5";
        }
        if (c == 5) {
            f = "";
            _mc["pwd_light"].className = "ps_strength_img";
        }
        _mc["complexity"].innerHTML = f;
        _mc["complexity"].className = e;
        //document.getElementById("complexity").style.backgroundColor = "#" + e;
    }
    //James 19/04/30 496.繁簡-密碼强度
    _self.toWords = function (number) {

        //is merely seconds, just return rounded numebr
        if (number < 120) {
            return _self.getNumberWords(number, true) + " "+LS.get("pwd_break_Seconds");
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

    //新密碼檢查流程
    _self.str_chk = function (str) {
        //新密碼跟帳號或安全代碼一樣
        if (str != "" && str == ctlObj["user"].input.value) {
            _self.showErrorPwd("passwd", LS_code.get("4X022"));
            return false;
        }
        var res = util.str_chk(str, 1);
        if (res != "chk_OK"){
            _self.strchk_Msg(res);
            return false ;
        }else{
            _self.setBoxClass(ctlObj["passwd"].box, "psw_error", "");
            return true;
        }
    }

    _self.strchk_Msg = function (str) {
        if (str == "err_combination") {
            _self.showErrorPwd("passwd", LS_code.get("4X021"));
        }
        else if (str == "err_length") {
            _self.showErrorPwd("passwd", LS_code.get("4X021"));
        }
        else if (str == "err_contain") {
            _self.showErrorPwd("passwd", LS_code.get("4X021"));
        }
        else if (str == "err_charactersNum") {
            _self.showErrorPwd("passwd", LS_code.get("4X040"));
        }
        else if (str == "err_block_string") {
            _self.showErrorPwd("passwd", LS_code.get("4X040"));
        }
        else {
            util.echo("chk wrong!!");
            _self.showErrorPwd("passwd", LS_code.get("4X021"));
        }
    }

    //=================密碼強弱 end=================

    _self.showPwd = function (mouseEvent, targetObj) {
        if (mouseEvent == null || !targetObj.isShow) {
            ctlObj["passwd"].input.setAttribute("type", "text");
            targetObj.className = "eye_icon";
            targetObj.isShow = true;
        } else {
            ctlObj["passwd"].input.setAttribute("type", "password");
            targetObj.className = "no_eye_icon";
            targetObj.isShow = false;
        }
        if (mouseEvent!=null) _mc["input_passwd"].focus();
    }

    _self.BlurPwdOFF = function (mouseEvent, targetObj) {
        _mc["eye_pwd"].BlurPwdOFF = true;
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

    //=================提示訊息i=================
    _self.showTip = function (mouseEvent, par) {
        parentClass.dispatchEvent("showAlertMsg", par);
    }
    //=================提示訊息i end=================

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
        config_set = parentClass.getThis("config_set");
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

    _self.getThis = function (varible) {
        return eval(varible);
    }

}
