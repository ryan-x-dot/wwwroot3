function acc_co_comm(_win, _dom, param) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object();
    var util;
    var level = "co";
    var LS;
    var LS_code;
    var _mc = new Object();
    var userDate = new Object();
    var titleObj = new Array();
    var ltpObj = new Array();
    var confObj = new Array();
    var classchg = new Array();
    var usrChgObj = new Object();   //送出當下要改變的物件，修改成功後會被清空
    var usrOriObj = new Object();
    var useInitView = true;
    var _editComm = null;
    var credit_old;

    _self.init = function () {
        userDate = param;
        util.echo("acc_"+level+"_comm load complete");
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        _self.getCommToServer();

        //球類匡格
        var obj_ids = ",commission_info,gtype_menu,FT_commis_info,BK_commis_info,OP_commis_info,FS_commis_info,";
            obj_ids += ",FT_R_war_error,FT_R_bet_error,FT_RE_war_error,FT_RE_bet_error,FT_M_bet_error,FT_DT_bet_error,FT_RDT_bet_error";
            obj_ids += ",BK_R_war_error,BK_R_bet_error,BK_RE_war_error,BK_RE_bet_error,BK_M_bet_error,BK_DT_bet_error";
            obj_ids += ",OP_R_war_error,OP_R_bet_error,OP_RE_war_error,OP_RE_bet_error,OP_M_bet_error,OP_DT_bet_error";
            obj_ids += ",FS_FS_bet_error,";
            _mc = util.getObjAry(dom, obj_ids);
        //各球類 限額 退水
        //足球
        var obj_ids = ",FT_R_A,FT_R_B,FT_R_C,FT_R_D,FT_R_SC,FT_R_SC_limit,FT_R_SO,FT_R_SO_limit";
            obj_ids += ",FT_RE_A,FT_RE_B,FT_RE_C,FT_RE_D,FT_RE_SC,FT_RE_SC_limit,FT_RE_SO,FT_RE_SO_limit";
            obj_ids += ",FT_M_SC,FT_M_SC_limit,FT_M_SO,FT_M_SO_limit";
            obj_ids += ",FT_DT_SC,FT_DT_SC_limit,FT_DT_SO,FT_DT_SO_limit";
            obj_ids += ",FT_RDT_SC,FT_RDT_SC_limit,FT_RDT_SO,FT_RDT_SO_limit,";

            //籃球
            obj_ids += ",BK_R_A,BK_R_B,BK_R_C,BK_R_D,BK_R_SC,BK_R_SC_limit,BK_R_SO,BK_R_SO_limit";
            obj_ids += ",BK_RE_A,BK_RE_B,BK_RE_C,BK_RE_D,BK_RE_SC,BK_RE_SC_limit,BK_RE_SO,BK_RE_SO_limit";
            obj_ids += ",BK_M_SC,BK_M_SC_limit,BK_M_SO,BK_M_SO_limit";
            obj_ids += ",BK_DT_SC,BK_DT_SC_limit,BK_DT_SO,BK_DT_SO_limit,";

            //其他球類
            obj_ids += ",OP_R_A,OP_R_B,OP_R_C,OP_R_D,OP_R_SC,OP_R_SC_limit,OP_R_SO,OP_R_SO_limit";
            obj_ids += ",OP_RE_A,OP_RE_B,OP_RE_C,OP_RE_D,OP_RE_SC,OP_RE_SC_limit,OP_RE_SO,OP_RE_SO_limit";
            obj_ids += ",OP_M_SC,OP_M_SC_limit,OP_M_SO,OP_M_SO_limit";
            obj_ids += ",OP_DT_SC,OP_DT_SC_limit,OP_DT_SO,OP_DT_SO_limit,";

            //冠軍
            obj_ids += ",FS_FS_SC,FS_FS_SC_limit,FS_FS_SO,FS_FS_SO_limit,";

        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);

        for (var objid in tmpObj) {
            confObj[objid] = tmpObj[objid];
        }
        //修改 按鈕 顯示
        var obj_ids = ",FT_R_CLASSCHG,FT_RE_CLASSCHG,FT_M_CLASSCHG,FT_DT_CLASSCHG,FT_RDT_CLASSCHG,BK_R_CLASSCHG,BK_RE_CLASSCHG,BK_M_CLASSCHG,BK_DT_CLASSCHG,OP_R_CLASSCHG,OP_RE_CLASSCHG,OP_M_CLASSCHG,OP_DT_CLASSCHG,FS_FS_CLASSCHG,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);

        for (var objid in tmpObj) {
            classchg[objid] = tmpObj[objid];
        }


        //監聽 修改
        var obj_ids = ",FT_R_EDIT,FT_R_CANCEL,FT_R_SUBMIT,FT_RE_EDIT,FT_RE_CANCEL,FT_RE_SUBMIT,FT_M_EDIT,FT_M_CANCEL,FT_M_SUBMIT,FT_DT_EDIT,FT_DT_CANCEL,FT_DT_SUBMIT,FT_RDT_EDIT,FT_RDT_CANCEL,FT_RDT_SUBMIT,";
        obj_ids += ",BK_R_EDIT,BK_R_CANCEL,BK_R_SUBMIT,BK_RE_EDIT,BK_RE_CANCEL,BK_RE_SUBMIT,BK_M_EDIT,BK_M_CANCEL,BK_M_SUBMIT,BK_DT_EDIT,BK_DT_CANCEL,BK_DT_SUBMIT,";
        obj_ids += ",OP_R_EDIT,OP_R_CANCEL,OP_R_SUBMIT,OP_RE_EDIT,OP_RE_CANCEL,OP_RE_SUBMIT,OP_M_EDIT,OP_M_CANCEL,OP_M_SUBMIT,OP_DT_EDIT,OP_DT_CANCEL,OP_DT_SUBMIT,";
        obj_ids += ",FS_FS_EDIT,FS_FS_CANCEL,FS_FS_SUBMIT,";

        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for (var objid in tmpObj) {
            var splitName = objid.split("_");
            var grType = splitName[0] + "_" + splitName[1] + "_";
            if (splitName[2] == "SUBMIT")       util.addEvent(tmpObj[objid], "click", _self.setSubmitListerner, { "grType": grType, "kind": splitName[0], "rtype": splitName[1], "o1": classchg[grType + "CLASSCHG"]});
            else if (splitName[2] == "CANCEL")  util.addEvent(tmpObj[objid], "click", _self.setCancelListerner, { "grType": grType, "o1": classchg[grType + "CLASSCHG"]});
            else if (splitName[2] == "EDIT")    util.addEvent(tmpObj[objid], "click", _self.setEditListerner, { "grType": grType, "o1": classchg[grType + "CLASSCHG"]});
        }

        //球種類標題
        var obj_ids = ",FT_commis_title,BK_commis_title,OP_commis_title,FS_commis_title,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);

        for (var objid in tmpObj) {
            var ta = objid.split("_");
            tmpObj[objid].mapA = ta[0];
            tmpObj[objid].mapB = "_commis_info";
            tmpObj[objid]._type = "COMMIS";
            titleObj[objid] = tmpObj[objid];
            util.addEvent(tmpObj[objid], "click", _self.ShowAndHidden, tmpObj[objid]);
        }

        //監聽提示小視窗
        var tip_message = document.getElementsByName("tip_message");
        for (var i = 0, len = tip_message.length; i < len; i++) {
            var icon = tip_message[i].parentElement;
            util.setInfEvent(icon, { "_focus": tip_message[i], "_setView": icon, "_viewClass": "on" });
        }

    }

    _self.ChkCreditErr = function (e, par) {
        _self.showError(e.target.id, LS.get("str_maxcre"));
    }

    _self.initCreditShow = function (e, par) {
    }

    //信用額度轉換千位顯示
    _self.show_credits = function (e) {
        if (e.type == "input") {
            util.Replace_Input_credits(e.target, credit_old, e);
        } else {
            util.Replace_credits(e.target, credit_old, e);
        }
    }

    _self.keep_credit=function(e){
        credit_old = e.target.value.replace(/\D/g,'');
    }

    _self.showError = function(tarObj_id,msg){
        var tmpAry = tarObj_id.split("_");
        var _grType = tmpAry[0]+"_"+tmpAry[1];
        var err_id = _grType+"_bet_error";
        _mc[tarObj_id].parentElement.classList.add("accadd_error");
        _mc[err_id].innerHTML = msg;
        _mc[err_id].style.display = "";
    }

    //編輯
    _self.setEditListerner = function(evt,param){
        var DOM = evt.target;
        if (!param.o1.classList.contains("edit_on")){
            param.o1.classList.add("edit_on");
            for (var i in confObj){
                if (i.indexOf(param.grType) != -1 && i.indexOf("limit") == -1){
                    confObj[i].disabled = false;
                    if (confObj[i].JS_UL) confObj[i].JS_UL.setDisabled(false);
                    if (confObj[i].type == "text" || confObj[i].type == "tel") {
                        var numSplit = confObj[i].value.split(".");
                        var val = numSplit[0];
                        // confObj[i].value = val.replace(/[^\d]*/g,"");   //清除非數字的字元
                        confObj[i].value = val;
                    }
                }
            }
        }
    }
    //取消
    _self.setCancelListerner = function (evt,param) {
        var DOM = evt.target;
        if (param.o1.classList.contains("edit_on")) {
            param.o1.classList.remove("edit_on");
            for (var i in confObj) {
                if (i.indexOf(param.grType) != -1 && i.indexOf("limit") == -1) {
                    var val;
                    confObj[i].disabled = true;
                    if (confObj[i].JS_UL) confObj[i].JS_UL.setDisabled(true);
                    if (confObj[i].type == "text" || confObj[i].type == "tel") val = util.mprintf(usrOriObj[i], 0, 2, false, true);
                    else val = usrOriObj[i];
                    confObj[i].value = val;
                    if (confObj[i].JS_UL) confObj[i].JS_UL.setSelected(val);
                }
            }
        }
        //取消錯誤樣式 與 消除錯誤訊息
        _self.vanishStyle_Text(param.grType);
    }
    //確定送出
    _self.setSubmitListerner = function (evt,param) {
        var DOM = evt.target;
        for (var i in confObj) {
            if (i.indexOf(param.grType) != -1 && i.indexOf("limit") == -1) {
                var tmpStr = i.split("_");
                var war_set = ["A","B","C","D"];
                var keyName = tmpStr[2];
                if (war_set.indexOf(tmpStr[2]) != -1) keyName = "war_set_" + tmpStr[2];
                if(i.indexOf("SC") != -1 || i.indexOf("SO") != -1){
                    usrChgObj[keyName] = confObj[i].value.replace(/[^\d]*/g,"");
                }else{
                    usrChgObj[keyName] = confObj[i].value;
                }
            }
        }
        usrChgObj["kind"] = param.kind;
        usrChgObj["rtype"] = param.rtype;
        _editComm = param;
        _self.vanishStyle_Text(param.grType);   //避免已經提示窗有出現，又再次點擊，要重置
        _self.amendCommToServer();
        usrChgObj = {}; //送出後清空該物件
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;

        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
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

    _self.onError = function () {
        util.echo("onError");
    }

    _self.backPage = function (e, param) {
        parentClass.dispatchEvent("backToIdex", { "retFun": _self.backPageComplete });
    }

    _self.backPageComplete = function () {
        util.echo("backPageComplete");
    }
    //修改退水額度
    _self.amendCommToServer = function(){
        // parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&aid=" + userDate["edit_id"];
        urlParams += "&act=Y";
        urlParams += "&langx=" + top.langx;
        urlParams += _self.getUsrChgParam();
        urlParams = "p=get_acc_"+level+"_comm&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.amendCommMesg);
        getHTML.loadURL(top.url, "POST", urlParams);
    }
    //預設拿資料
    _self.getCommToServer = function () {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&aid=" + userDate["edit_id"];
        urlParams += "&langx=" + top.langx;
        urlParams = "p=get_acc_"+level+"_comm&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.setViewParam);
        getHTML.loadURL(top.url, "POST", urlParams);
    }
    //預設資料load畫面
    _self.setViewParam = function (data) {
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        if (data == "") return;
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
        } catch (e) {
            util.echo(e);
        }
        usrOriObj = arr_data["dataAry"];
        if (usrOriObj){
            for (var i in usrOriObj){
                var namsSplit = i.split("_");
                if (!confObj[i]) {
                    if (namsSplit[1] == "M" || namsSplit[1] == "DT" || namsSplit[1] == "RDT" || namsSplit[1] == "FS") continue;
                }else{
                    if (namsSplit[3] == "limit") { //限額字體
                        confObj[i].innerHTML = LS.get("max_limit_head") + LS.get("RMB") + " " + util.mprintf(usrOriObj[i], 0, 2, false, true);
                        continue;
                    }
                    if (confObj[i].tagName == "INPUT"){
                        confObj[i].value = util.mprintf(usrOriObj[i], 0, 2, false, true);
                        if (namsSplit[2] == "SC") {
                            confObj[i].chgK = namsSplit[0] + "_" + namsSplit[1] + "_SO";
                            util.addEvent(confObj[i], "keydown", _self.keep_credit);
                            util.ChkKeyCash(confObj[i], { initShow: _self.initCreditShow, onErr: _self.ChkCreditErr, onSuc: _self.count_so });
                        }
                        if (namsSplit[2] == "SO") {
                            util.addEvent(confObj[i], "keydown", _self.keep_credit);
                            util.ChkKeyCash(confObj[i], { initShow: _self.initCreditShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
                        }
                        continue;
                    }
                    if (confObj[i].tagName == "SELECT") {
                        _self.initOption(confObj[i],usrOriObj[i + "_limit"],config_set.get("CONF_BAR_RANGE"));
                        confObj[i].value = usrOriObj[i];        //開設最大option後，導回使用者當下的值
                        if (confObj[i].JS_UL) confObj[i].JS_UL.setSelected(confObj[i].value);
                        continue;
                    }
                }
            }
            if (useInitView) _self.ShowAndHidden(_mc["FT_commis_title"], _mc["FT_commis_title"]);
        }
        //關閉當前save視窗
        if (_editComm != null) {
            _editComm.o1.classList.remove("edit_on");
            for (var i in confObj) {
                if ((i.indexOf("limit") == -1) && (i.indexOf(_editComm.grType) != -1)) {
                    //console.log(confObj[i]);
                    confObj[i].disabled = true;
                    if (confObj[i].JS_UL) confObj[i].JS_UL.setDisabled(true);
                }
            }
        }
    }

    //自動換算單場限額
    _self.count_so = function (keyEvent) {
        _self.show_credits(keyEvent);
        var now_val = keyEvent.target.value.replace(/[^\d]*/g, "");
        var so_v = (now_val * 1) / 2;
        confObj[keyEvent.target.chgK].value = util.mprintf(so_v, 0, 0, false, true);
    }

    //修改資料處理中心
    _self.amendCommMesg = function(data){
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        if (data == "") return;
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
        } catch (e) {
            util.echo(e);
        }
        if (arr_data["status"] == "success") {
            _self.getCommToServer();
        } else if (arr_data["status"] == "error") {
            var domId = "";
            var str = arr_data["gtype"] + "_" + arr_data["rtype"];
            var erroMsgWar = str+"_war_error";
            var erroMsgBet = str+"_bet_error";
            var ltype_msg = "";
            var bet_msg = "";
            if (arr_data["msg"] == null || arr_data["msg"] == "") {
                util.chkErrorMsg(arr_data, LS_code);
            }
            if(arr_data["ltypeData"].length > 0){
                for(var i = 0 ; i < arr_data["ltypeData"].length; i++){
                    if (arr_data["ltypeData"][i]) domId = str + "_" + arr_data["ltypeData"][i]["ltype"];
                    //錯誤的class樣式
                    _mc[domId].parentElement.parentElement.classList.add("accadd_error");
                    ltype_msg = arr_data["ltypeData"][i]["msg"];
                }
            }

            if(arr_data["betData"].length > 0){
                var tmp_bet_msg = "";
                for(var i = 0 ; i < arr_data["betData"].length; i++){
                    if (arr_data["betData"][i]) domId = str + "_" + arr_data["betData"][i]["bet"];
                    //錯誤的class樣式
                    _mc[domId].parentElement.classList.add("accadd_error");
                    tmp_bet_msg = arr_data["betData"][i]["msg"] ;
                    if(arr_data["betData"][i]["bet"]=="SC") bet_msg = arr_data["betData"][i]["msg"];
                }
                if (bet_msg == "") bet_msg = tmp_bet_msg ;
            }

            //寫錯誤訊息
            if (_mc[erroMsgBet]) _mc[erroMsgBet].innerHTML = (arr_data["betData"].length==1)?arr_data["betData"][0]["msg"]:bet_msg;
            // 2019-04-19 當訊息出現不同的情況依SC為主 sunny說的
            if (_mc[erroMsgWar]) _mc[erroMsgWar].innerHTML = ltype_msg;
        } else {
            util.showErrorMsg(arr_data);
        }
        useInitView = false;
    }
    //拿使用者要改變的參數
    _self.getUsrChgParam = function(){
        var param = "";
        for (var i in usrChgObj){
            param += "&" + i + "=" + usrChgObj[i];
        }
        return param;
    }
    //顯示畫面
    _self.ShowAndHidden = function (evt, param){
        for (var id in titleObj) {
            if (titleObj[id].classList.contains("on") && param._type == titleObj[id]._type && param.id != id) {
                titleObj[id].classList.remove("on");
                var setNone = "" + titleObj[id].mapA + titleObj[id].mapB;
                _mc[setNone].style.display = "none";
            }
        }
        if (!param.classList.contains("on")) {
            param.classList.add("on");
        }

        var setView = "" + param.mapA + param.mapB;
        if (param._type == "COMMIS") {
            commiss_gtype = param.mapA;
        }
        _mc[setView].style.display = "";
    }
    //動態更換拉霸
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
    //取消錯誤樣式 與 消除錯誤訊息
    _self.vanishStyle_Text = function (grString) {
        if (_mc[grString + "A"]) _mc[grString + "A"].parentElement.parentElement.classList.remove("accadd_error");
        if (_mc[grString + "B"]) _mc[grString + "B"].parentElement.parentElement.classList.remove("accadd_error");
        if (_mc[grString + "C"]) _mc[grString + "C"].parentElement.parentElement.classList.remove("accadd_error");
        if (_mc[grString + "D"]) _mc[grString + "D"].parentElement.parentElement.classList.remove("accadd_error");
        if (_mc[grString + "SC"]) _mc[grString + "SC"].parentElement.classList.remove("accadd_error");
        if (_mc[grString + "SO"]) _mc[grString + "SO"].parentElement.classList.remove("accadd_error");
        if (_mc[grString + "bet_error"]) _mc[grString + "bet_error"].innerHTML = "";
        if (_mc[grString + "war_error"]) _mc[grString + "war_error"].innerHTML = "";
    }

    _self.doSelToUL = function (DOMSel, labelId) {
        var obj_ids = ",sel_text,sel_list,";
        //console.log("when stop",obj_ids);
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
        sel_js.addEvent("ONCHANGE", _self.set_SEL_value, DOMSel);
        sel_js.addEvent("ONOPEN", _self.show_sel_box, elmt["sel_label"]);
        sel_js.addEvent("ONCLOSE", _self.close_sel_box, elmt["sel_label"]);
        sel_js.addEvent("DISABLED", _self.disable_sel_box, { view: elmt["sel_label"], ref: DOMSel});
        sel_js.setDisabled(DOMSel.disabled);
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
    _self.disable_sel_box = function (e, Obj) {
        if (Obj.ref.disabled) {
            if (!Obj.view.classList.contains("disabled")) Obj.view.classList.add("disabled");
        }else{
            if (Obj.view.classList.contains("disabled")) Obj.view.classList.remove("disabled");
        }
    }
    //==================拉霸隱藏顯示設定 end==================

}