function acc_su_add(_win, _dom, paramObj){
    var _self = this;
    var win = _win;
    var dom = _dom;

    var parentClass;
    var util;
    var LS;
    var LS_code;
    var LS_account;
    var config_set;
    var level = "su";

    var _mc = new Object();
    var ctlObj = new Array();
    var confObj = new Array();
    var titleObj = new Array();
    var credit_old;
    var commiss_gtype = "FT";
    var balance = 0;
    var keepScrollTop = 56;
    var overScrollTop = 56;

    _self.init=function(){
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        parentClass.dispatchEvent("chgPageName", { "pageType": "account","pageName": level+"_add" });
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "account" });
        //設定離開確認事件
        var obj = new Object();
        obj["Alert"] = { "msg": LS_account.get("str_unsave"), "mode": "Y" };
        obj["ifNo"] = _self.exitConfirmNo;
        parentClass.dispatchEvent("SetConfirmExit", obj);

        var obj_ids = ",box_user,input_user,msg_user,box_alias,input_alias,msg_alias,password_i_box,box_passwd,input_passwd,msg_passwd,";
        obj_ids += "box_confirm,input_confirm,msg_confirm,box_credit,input_credit,msg_credit,credit_box,balance,btn_save,btn_new,btn_cancel,";
        obj_ids += "SC_i_box,SO_i_box,info_passwd,SC_new_info,SO_new_info,gtype_menu,account_info,commission_info,";
        obj_ids += "FT_commis_info,BK_commis_info,OP_commis_info,FS_commis_info,";
        obj_ids += "input_possess,input_enddate,input_no_date,";
        obj_ids += "sel_upper,";
        // obj_ids += "strengthTxt,first_estimate,pwd_light,complexity,eye_pwd,";
        obj_ids += "scroll_div,";
        obj_ids += "possess_tip,";
        _mc = util.getObjAry(dom, obj_ids);

        var obj_ids = ",strengthTxt,first_estimate,pwd_light,complexity,eye_pwd,";
        var tmpObj = util.getObjAry(_mc["account_info"], obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);

        ctlObj["user"] = new Object();
        ctlObj["user"].box = _mc["box_user"];
        ctlObj["user"].msg = _mc["msg_user"];
        ctlObj["user"].input = _mc["input_user"];

        ctlObj["alias"] = new Object();
        ctlObj["alias"].box = _mc["box_alias"];
        ctlObj["alias"].msg = _mc["msg_alias"];
        ctlObj["alias"].input = _mc["input_alias"];

        ctlObj["passwd"] = new Object();
        ctlObj["passwd"].box = _mc["box_passwd"];
        ctlObj["passwd"].msg = _mc["msg_passwd"];
        ctlObj["passwd"].input = _mc["input_passwd"];
        _mc["eye_pwd"].isShow = false;
        _mc["eye_pwd"].BlurPwdOFF = false;

        ctlObj["credit"] = new Object();
        ctlObj["credit"].box = _mc["box_credit"];
        ctlObj["credit"].msg = _mc["msg_credit"];
        ctlObj["credit"].input = _mc["input_credit"];

        var obj_ids = ",account_title_box,commission_title_box,FT_commis_title,BK_commis_title,OP_commis_title,FS_commis_title,";
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

        _mc["btn_save"].backPage = "acc_su_list";
        _mc["btn_new"].backPage = "acc_su_add";

        var obj_ids = ",FT_R_1_WAR,FT_R_2_WAR,FT_R_3_WAR,FT_R_4_WAR,FT_R_1_SC,FT_R_1_SO,FT_RE_1_WAR,FT_RE_2_WAR,FT_RE_3_WAR,FT_RE_4_WAR,FT_RE_1_SC,FT_RE_1_SO,FT_M_1_WAR,FT_M_1_SC,FT_M_1_SO,FT_DT_1_WAR,FT_DT_1_SC,FT_DT_1_SO,FT_RDT_1_WAR,FT_RDT_1_SC,FT_RDT_1_SO,BK_R_1_WAR,BK_R_2_WAR,BK_R_3_WAR,BK_R_4_WAR,BK_R_1_SC,BK_R_1_SO,BK_RE_1_WAR,BK_RE_2_WAR,BK_RE_3_WAR,BK_RE_4_WAR,BK_RE_1_SC,BK_RE_1_SO,BK_M_1_WAR,BK_M_1_SC,BK_M_1_SO,BK_DT_1_WAR,BK_DT_1_SC,BK_DT_1_SO,OP_R_1_WAR,OP_R_2_WAR,OP_R_3_WAR,OP_R_4_WAR,OP_R_1_SC,OP_R_1_SO,OP_RE_1_WAR,OP_RE_2_WAR,OP_RE_3_WAR,OP_RE_4_WAR,OP_RE_1_SC,OP_RE_1_SO,OP_M_1_WAR,OP_M_1_SC,OP_M_1_SO,OP_DT_1_WAR,OP_DT_1_SC,OP_DT_1_SO,FS_FS_1_WAR,FS_FS_1_SC,FS_FS_1_SO,FT_R_1_SC_limit,FT_R_1_SO_limit,FT_RE_1_SC_limit,FT_RE_1_SO_limit,FT_M_1_SC_limit,FT_M_1_SO_limit,FT_DT_1_SC_limit,FT_DT_1_SO_limit,FT_RDT_1_SC_limit,FT_RDT_1_SO_limit,BK_R_1_SC_limit,BK_R_1_SO_limit,BK_RE_1_SC_limit,BK_RE_1_SO_limit,BK_M_1_SC_limit,BK_M_1_SO_limit,BK_DT_1_SC_limit,BK_DT_1_SO_limit,OP_R_1_SC_limit,OP_R_1_SO_limit,OP_RE_1_SC_limit,OP_RE_1_SO_limit,OP_M_1_SC_limit,OP_M_1_SO_limit,OP_DT_1_SC_limit,OP_DT_1_SO_limit,FS_FS_1_SC_limit,FS_FS_1_SO_limit,";
        obj_ids += "boxCMS_FT_R_SC,boxCMS_FT_RE_SC,boxCMS_FT_M_SC,boxCMS_FT_DT_SC,boxCMS_FT_RDT_SC,boxCMS_BK_R_SC,boxCMS_BK_RE_SC,boxCMS_BK_M_SC,boxCMS_BK_DT_SC,boxCMS_OP_R_SC,boxCMS_OP_RE_SC,boxCMS_OP_M_SC,boxCMS_OP_DT_SC,boxCMS_FS_FS_SC,";
        obj_ids += "boxCMS_FT_R_SO,boxCMS_FT_RE_SO,boxCMS_FT_M_SO,boxCMS_FT_DT_SO,boxCMS_FT_RDT_SO,boxCMS_BK_R_SO,boxCMS_BK_RE_SO,boxCMS_BK_M_SO,boxCMS_BK_DT_SO,boxCMS_OP_R_SO,boxCMS_OP_RE_SO,boxCMS_OP_M_SO,boxCMS_OP_DT_SO,boxCMS_FS_FS_SO,";
        obj_ids += "msgCMS_FT_R,msgCMS_FT_RE,msgCMS_FT_M,msgCMS_FT_DT,msgCMS_FT_RDT,msgCMS_BK_R,msgCMS_BK_RE,msgCMS_BK_M,msgCMS_BK_DT,msgCMS_OP_R,msgCMS_OP_RE,msgCMS_OP_M,msgCMS_OP_DT,msgCMS_FS_FS,";
        var tmpObj = util.getObjAry(_mc["commission_info"], obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);

        for (var objid in tmpObj) {
            if (objid.search("CMS") == -1) {
                var tmp = objid.split("_");
                confObj[objid] = tmpObj[objid];
                confObj[objid].gtype = tmp[0];
                confObj[objid].rtype = tmp[1];
                confObj[objid].ltype = tmp[2];
                confObj[objid].ftype = tmp[3];//WAR/SC/SO
                confObj[objid].limit = tmp[4];//limit
                if (tmp[3] == "SC" || tmp[3] == "SO"){
                    confObj[objid].box = _mc["boxCMS_" + tmp[0] + "_" + tmp[1] + "_" + tmp[3]];
                    confObj[objid].msg = _mc["msgCMS_" + tmp[0] + "_" + tmp[1]];
                }
            }

            if (objid.search("limit") != -1) {
                //點擊後置換最高限額 企劃沒說先不做
                //util.addEvent(confObj[objid], "click", _self.setConfEvent, confObj[objid]);
            }
        }

        util.addEvent(_mc["btn_cancel"], "click", _self.closeEvent, "cancel");
        util.addEvent(_mc["btn_save"], "click", _self.saveEvent, _mc["btn_save"]);
        util.addEvent(_mc["btn_new"], "click", _self.saveEvent, _mc["btn_new"]);

        util.ChkKeyUser(ctlObj["user"].input);
        util.addEvent(ctlObj["user"].input, "blur", _self.checkUserNameEvent, ctlObj["user"].input);
        util.addEvent(ctlObj["user"].input, "focus", _self.clearErrorStatusCtl, ctlObj["user"]);

        util.addEvent(ctlObj["alias"].input, "blur", _self.checkNameEvent, ctlObj["alias"].input);
        util.addEvent(ctlObj["alias"].input, "focus", _self.clearErrorStatusCtl, ctlObj["alias"]);

        util.ChkKeyUser(ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "keyup", _self.checkThisPassword, ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "blur", _self.checkThisPassword, ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "focus", function () { _self.setBoxClass(ctlObj["passwd"].box, "psw_error", ""); }, ctlObj["passwd"].input);

        util.addEvent(ctlObj["credit"].input, "keydown", _self.keep_credit);
        util.ChkKeyCash(ctlObj["credit"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });

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
        util.addEvent(_mc["sel_upper"], "change", _self.chgUpperLayerEvent, _mc["sel_upper"]);
        keepScrollTop = _mc["account_title_box"].parentElement.offsetHeight;
        overScrollTop = _mc["account_title_box"].parentElement.offsetHeight;
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, _mc["scroll_div"]);
        dom.getElementById("body_show").scrollTop = 0;

        parentClass.dispatchEvent("showLoading", { "showLoading": false });
    }

    _self.chgUpperLayerEvent = function (changeEvent, targetObj) {
        _self.set_UL_value(changeEvent);
        _self.loadUpperConf();
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
        sPar.div = dom.getElementById("box_date");
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
        var setView = ""+element.mapA + element.mapB;

        if (setView == "commission_info" && element._type== "TITLE"){
            _self.ShowAndHidden(mouseEvent, _mc[commiss_gtype +"_commis_title"]);
            _mc["gtype_menu"].style.display = "";
        } else if (element._type == "TITLE"){
            _mc["gtype_menu"].style.display = "none";
        } else if (element._type == "COMMIS"){
            commiss_gtype = element.mapA;
        }
        _mc[setView].style.display = "";
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

        xmlObj["game"] = arr_data.game;
        xmlObj["user"] = arr_data.user;
        balance = util.showTxt(xmlObj["user"].surplus_maxcredit)*1;

        _mc["balance"].org_value = balance*1;
        _mc["balance"].innerHTML = util.mprintf(balance*1,0,2,false,true);
        _mc["winloss"] = util.showTxt(xmlObj["user"].winloss);
        for(var objid in confObj){
            var obj = confObj[objid];

            var gameObj = xmlObj["game"][obj.gtype];
            if(gameObj==null) continue;

            var dataObj = gameObj.data[obj.rtype+"_"+obj.ltype];
            if(dataObj==null) continue;


            var war = util.showTxt(dataObj.war);
            var sc = util.showTxt(dataObj.sc);
            var so = util.showTxt(dataObj.so);

            if(obj.limit != null){
                var setV = "";
                if(obj.ftype == "SC"){
                    setV = sc;
                }else{
                    setV = so;
                }
                //19/05/02 James *483.繁簡-修改/新增帳號-退水和限額-藍色字"Max:"請幫翻"最高:"右邊幣值也請依照貨幣名稱翻譯
                obj.innerHTML = LS.get("max_limit_head")+ LS.get("RMB") +" "+ util.mprintf(setV*1,0,0,false,true);
                obj.setK = obj.gtype+"_"+obj.rtype+"_"+obj.ltype+"_"+obj.ftype;
                obj.setV = setV;
            }else if(obj.ftype == "WAR"){
                _self.initOption(obj, war, config_set.get("CONF_BAR_RANGE"));
            }else if(obj.ftype=="SC" || obj.ftype=="SO"){
                if(obj.ftype == "SC"){
                    obj.value = util.mprintf(sc * 1, 0, 0, false, true);
                    obj.chgK = obj.gtype+"_"+obj.rtype+"_"+obj.ltype+"_SO";

                    util.addEvent(obj, "keydown", _self.keep_credit);
                    util.ChkKeyCash(obj, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.count_so });
                }else{
                    obj.value = util.mprintf(so * 1, 0, 0, false, true);
                    util.addEvent(obj, "keydown", _self.keep_credit);
                    util.ChkKeyCash(obj, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
                }
            }
        }

        _self.initWinloss();
    }

    _self.initWinloss = function () {
        _mc["input_possess"].options.length = 0;

        var su_max = _mc["winloss"] * 1;
        var percent = "%";
        for (i = 0; i <= su_max; i ++) {
            var _value = i;
            var _txt = i;
            var varItem = new Option(_txt + percent, _value, false, false);
            _mc["input_possess"].options.add(varItem);
        }
        _self.doSelToUL(_mc["input_possess"], "input_possess_LB");
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
        par += "&up_layer=co";
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
            param = "p=body_"+level+"_add&ver=" + top.ver + "&" + param;
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
        par += "&passwords=" + _mc["input_passwd"].value;
        par += "&maxcredit=" + _mc["input_credit"].value.replace(/\D/g, '');
        par += "&winloss=" + _mc["input_possess"].value;
        par += "&up_layer=" + paramObj["up_layer"];
        par += "&langx=" + top.langx; //19/04/30 James *483.>>>新增帳號時，幣值/阻擋訊息還是沒有翻到
        par += "&up_id=" + paramObj["up_id"];
        par += "&end_date=" + _mc["input_enddate"].value;
        par += "&no_date=" + _mc["input_no_date"].checked;
        par += _self.getConfAryUrl();
        return par;
    }

    _self.getConfAryUrl = function () {
        var par = "";
        for (var objid in confObj) {
            var obj = confObj[objid];
            if (obj.limit == null) {
                par += "&" + objid;
                if (obj.ftype == "SC" || obj.ftype == "SO"){
                    par += "=" + obj.value.replace(/\D/g, '');
                }else{
                    par += "=" + obj.value;
                }
            }
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
            param += "&upper_layer=" + top.login_layer;
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
        par += "&view_layer=" + level;
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

    _self.ChkCreditErr = function (e) {
        if (e.target == ctlObj["credit"].input) {
            _self.showErrorCtl("credit", LS.get("str_maxcre"));
        }
    }

    _self.keep_credit = function (e) {
        credit_old = e.target.value.replace(/\D/g, '');
    }

    //信用額度轉換千位顯示
    _self.show_credits = function (e) {
        if (e.type == "input") {
            util.Replace_Input_credits(e.target, credit_old, e);
        } else {
            util.Replace_credits(e.target, credit_old, e);
        }
        if (e.target == _mc["input_credit"]){
            var credit = _mc["input_credit"].value.replace(/\D/g, '');
            _mc["balance"].innerHTML = util.mprintf((balance - credit), 0, 2, false, true);
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
            if (ctlObj[key].input.value == "") {
                _self.showErrorCtl(key, LS.get("empty_" + key));
                return false;
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

        if ((ctlObj["credit"].input.value.replace(/\D/g, '')) * 1 == 0) {
            if(top.langx != "en-us"){
                _self.showErrorCtl("credit", LS.get("str_maxcre_zero1") + "," + LS.get("str_maxcre_zero") + ".");
            }else{
                _self.showErrorCtl("credit", LS.get("str_maxcre_zero") + LS.get("str_maxcre_zero1"));
            }
            return false;
        }
        /*
        if(!util.checkFormat(ctlObj["credit"].input.value,1)){
            _self.showErrorCtl("credit", LS.get("str_maxcre"));
            return false;
        }
        */

        if ((ctlObj["credit"].input.value.replace(/\D/g, '')) * 1 > _mc["balance"].org_value * 1) {
            _self.showErrorCtl("credit", LS.get("credit_over"));
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
        paramObj.up_id = e.target.value;
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
