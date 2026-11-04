function acc_sub_edit(_win, _dom, _paramObj) {
    var _self = this;
    var level = "sub";
    var win = _win;
    var dom = _dom;
    var paramObj = _paramObj;

    var parentClass;
    var util;
    var LS;
    var LS_code;
    var LS_account;
    var config_set;

    var _mc = new Object();
    var ctlObj = new Array();
    var titleObj = new Array();
    var cBoxObj = new Array();
    var powerObj = new Array();
    var checkObj = new Array();
    var pri_ary = new Array("A", "B", "B1", "B2", "C");
    var isAll = "";
    var old_manager_uid = "";
    var user_mlimit = "";
    var init_done = false;
    var keepScrollTop = 56;
    var overScrollTop = 56;
    var ObjEventlog;

    _self.init = function () {
        //2019-04-12 Ricky 412.快速搜索-從快速搜索查詢子帳號, 在點擊子帳號後, 頁面會帶到修改子帳號頁面, 紅色標題列應也要改變A/C Management(PJP-528)
        parentClass.dispatchEvent("chgPageName", { "pageType": "account", "uniqText": paramObj.username });
        //設定離開確認事件
        _self.InitSetConfirmExit();

        var obj_ids = ",btn_pwd,user_code,create_date,accountNum,";
        obj_ids += "box_alias,input_alias,msg_alias,";
        obj_ids += "box_passwd,msg_passwd,input_passwd,";
        obj_ids += "A,B,B1,B2,C,";
        obj_ids += "pop_pwd,pwd_cancel_btn,pwd_save_btn,eye_pwd,";
        obj_ids += "input_psw_recovery,psw_recovery_text,";
        obj_ids += "strengthTxt,first_estimate,pwd_light,complexity,";
        obj_ids += "div_acc_detail,div_acc_manage,div_acc_eventlog,";
        obj_ids += "total,unChkAll,";
        obj_ids += "btn_search,input_search,btn_delete,";
        obj_ids += "scroll_div,";
        obj_ids += "safe_tip,";
        obj_ids += "ps_icon,ps_txt,account_icon,account_txt,";
        obj_ids += "btn_ph_search,ph_search_class,"
        _mc = util.getObjAry(dom, obj_ids);

        //alias
        ctlObj["alias"] = new Object();
        ctlObj["alias"].box = _mc["box_alias"];
        ctlObj["alias"].input = _mc["input_alias"];
        ctlObj["alias"].msg = _mc["msg_alias"];

        //passwd
        ctlObj["passwd"] = new Object();
        ctlObj["passwd"].box = _mc["box_passwd"];
        ctlObj["passwd"].msg = _mc["msg_passwd"];
        ctlObj["passwd"].input = _mc["input_passwd"];
        _mc["eye_pwd"].isShow = false;

        _mc["total"].checked = false;

        var obj_ids = ",acc_detail,acc_manage,acc_eventlog,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for (var objid in tmpObj) {
            tmpObj[objid].map = "div_" + objid;
            titleObj[objid] = tmpObj[objid];
            util.addEvent(tmpObj[objid], "click", _self.titleChg, tmpObj[objid]);
            if (objid == "acc_detail" || objid == "acc_manage") {
                var btn_ids = ",btn_save,btn_cancel,";
                var btns = util.getObjAry(_mc["div_" + objid], btn_ids);
                util.addEvent(btns["btn_save"], "click", _self.saveEvent, btns["btn_save"]);
                util.addEvent(btns["btn_cancel"], "click", _self.closeEvent, "cancel");
            }
        }

        var obj_ids = ",AD_CO,AD_SU,AD_AG,AD_MEM,AD_MESS,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for(var objid in tmpObj){
            var sel = tmpObj[objid];
            powerObj[objid] = sel;
            sel.options.length = 0;
            var varItem = new Option( "禁用","N", false, false);
            sel.options.add(varItem);
            var varItem = new Option( "启用","Y", false, false);
            sel.options.add(varItem);
            _self.doSelToUL(sel, objid+"_LB");
        }

        var obj_ids = ",AD_MEM_LOG,AD_MEM_DOMAIN,AD_MEM_DOBET,AD_MEM_EXCHANGE,AD_MEM_EDIT,AD_MEM_HIDE,AD_MEM_DEL,AD_MEM_ADD,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for(var objid in tmpObj){
            checkObj[objid] = tmpObj[objid];
        }


        util.addEvent(_mc["btn_pwd"], "click", _self.clickBtn, _mc["btn_pwd"]);
        util.addEvent(_mc["pwd_save_btn"], "click", _self.clickBtn, _mc["pwd_save_btn"]);
        util.addEvent(_mc["pwd_cancel_btn"], "click", _self.clickBtn, _mc["pwd_cancel_btn"]);
        util.addEvent(_mc["eye_pwd"], "click", _self.showPwd, _mc["eye_pwd"]);
        util.addEvent(_mc["input_psw_recovery"], "click", _self.chg_mail_status, _mc["input_psw_recovery"]);// 密碼恢復

        util.ChkKeyUser(ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "keyup", _self.checkThisPassword, ctlObj["passwd"].input);



        keepScrollTop = _mc["acc_detail"].parentElement.offsetHeight;
        overScrollTop = _mc["acc_detail"].parentElement.offsetHeight;
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, _mc["scroll_div"]);

        // 帳號狀態 i 提示
        util.addEvent(_mc["safe_tip"], "click", _self.showTip, { "_id": (top.login_layer == "ag") ? "loginid_pop":"safe_pop" });

        // 密碼 i 提示
        util.setInfEvent(_mc["ps_icon"], { "_focus": _mc["ps_txt"], "_setView": _mc["ps_txt"], "_viewClass": "on" });
        // 可管理全選 i 提示
        util.setInfEvent(_mc["account_icon"], { "_focus": _mc["account_txt"], "_setView": _mc["account_txt"], "_viewClass": "on" });

        _self.initShow();
        _self.loadData();
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "account" });
    }

    _self.closeEvent = function (e) {
        var obj = new Object();
        obj.page = paramObj.back_page;
        if (e == "save") obj.LeaveChkPass = true;
        parentClass.dispatchEvent("bodyGoToPage", obj);
    }

    _self.initShow = function () {
        _mc["user_code"].innerHTML = paramObj.username;
        _mc["create_date"].innerHTML = paramObj.adddate;
        ctlObj["alias"].input.value = paramObj.alias;
        for (var i = 0; i < pri_ary.length; i++) {
            if (paramObj.pri.search(pri_ary[i]) != -1) {
                _mc[pri_ary[i]].checked = "checked";
            } else {
                _mc[pri_ary[i]].checked = "";
                if (pri_ary[i] == "B") {
                    _self.showSubpri({ target: _mc[pri_ary[i]] }, { type: pri_ary[i], se: ["1", "2"] })
                }
                // // 2019-04-29 d.修改/新增子帳號-請先幫將"change credit"的文字和勾選紐做灰底, 並無法勾選
                // if (pri_ary[i] == "B2") _mc[pri_ary[i]].disabled = "true";
            }
            if (pri_ary[i] == "B") {
                util.addEvent(_mc[pri_ary[i]], "click", _self.showSubpri, { type: pri_ary[i], se: ["1", "2"] });
            }
        }
        _self.showPwd(null, _mc["eye_pwd"]);

        //eventlog 資料&畫面
        var parObj = new Object();
        var paramHash = new Object();
        paramHash["edit_id"] = paramObj.id;
        paramHash["edit_username"] = paramObj.username;
        paramHash["user_id"] = paramObj.id;
        paramHash["edit_layer"] = top.login_layer;
        paramHash["pay_type"] = paramObj.pay_type;
        paramHash["edit_type"] = paramObj.user_type;
        paramHash["disableScrollEvent"] = true;

        parObj["target"] = "div_acc_eventlog";
        parObj["useDefineParent"] = "Y";
        parObj["postHash"] = paramHash;
        parObj["isTrams"] = "Y";
        parObj["page"] = "acc_eventlog";
        parObj["retChild"] = _self.getChild;
        parentClass.dispatchEvent("goToPage", parObj);
        //eventlog 資料&畫面
    }
    _self.getChild = function (childObj) {
        ObjEventlog = childObj;
    }

    //=================load data=================
    //load data
    _self.loadData = function () {
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.loadFinish);
        var param = _self.getParam();
        param = "p=get_subuser_lower&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.getParam = function () {
        var par = "";
        par += "uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&subid=" + paramObj.id;
        par += "&pay_type=" + paramObj.pay_type;
        par += "&lower_name=" + _mc["input_search"].value;
        return par;
    }

    //load finish
    _self.loadFinish = function (data) {
        var xmlObj = new Object();
        var arr_data = JSON.parse(data);
        if (arr_data.status == "error") {
            if (arr_data.msg == null || arr_data.msg == "") {
                util.chkErrorMsg(arr_data, LS_code);
                return false;
            }
            parentClass.dispatchEvent("showAlertMsg", arr_data);
            return;
        }

        if (!init_done) {
            _mc["input_psw_recovery"].checked = (arr_data.pmo_enabled != "S") ? true : false;
            _mc["input_psw_recovery"].keep = _mc["input_psw_recovery"].checked;
            _self.chg_mail_status();
        }

        xmlObj["account"] = arr_data.account;
        user_mlimit = arr_data.user_mlimit * 1;
        isAll = arr_data.isAll;

        var bodyTemp = "";//存放body
        var outdata = "";//輸出資料
        var div_show = dom.getElementById("div_show");//show div

        //modle
        var xmp_headerSub = dom.getElementById("xmp_headerSub").innerHTML;//modle header
        var xmp_contantSub = dom.getElementById("xmp_contantSub").innerHTML;//modle contant
        xmp_headerSub = xmp_headerSub.replace(/\*ACCOUNTNUM\*/g, xmlObj["account"].length);

        if (xmlObj["account"].length > 0) {
            for (var i = 0; i < xmlObj["account"].length; i++) {
                var contanttmp = xmp_contantSub;//clone contant 資料
                var obj = xmlObj["account"][i];
                contanttmp = contanttmp.replace(/\*ID\*/g, util.showTxt(obj["id"]));
                contanttmp = contanttmp.replace(/\*USERNAME\*/g, util.showTxt(obj["username"]));
                contanttmp = contanttmp.replace(/\*ALIAS\*/g, util.showTxt(obj["alias"]));
                contanttmp = contanttmp.replace(/\*LOGINID\*/g, util.showTxt(obj["loginid"]));
                bodyTemp += contanttmp;
            }
        } else {
            bodyTemp = dom.getElementById("xmp_nodataSub").innerHTML;//modle contant
            isAll = "checked";
        }
        outdata = xmp_headerSub + bodyTemp;
        div_show.innerHTML = outdata;
        _self.setViewParam(arr_data.special);
        _self.initEvent(xmlObj["account"], div_show);
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
    }

    //預設資料load畫面
    _self.setViewParam = function (data) {
        if (data == "") return;

        if (data.isSpecial == "Y"){
            dom.getElementById("special_info").style.display = "";
            var sup = data["sup"];
            var list = data["list"];
            for (var i in list){
                if(sup[i] && sup[i]=="Y") {
                    if (powerObj[i]) {
                        powerObj[i].value = list[i];
                        if (powerObj[i].JS_UL) {
                            powerObj[i].JS_UL.setSelected(powerObj[i].value);
                        }

                    }

                    if (checkObj[i]) {
                        if (list[i] === "true") {
                            checkObj[i].checked = true;
                        } else {
                            checkObj[i].checked = false;
                        }
                    }


                }else{
                    if (powerObj[i]) {
                        var s_id = powerObj[i].id;
                        dom.getElementById(s_id+"_DIV").remove();
                    }

                    if (checkObj[i]) {
                        var c_id = checkObj[i].id;
                        dom.getElementById(c_id+"_DIV").remove();
                    }
                }
            }
        } else {
            dom.getElementById("special_info").remove();
        }
    }

    //init event
    _self.initEvent = function (accounts, div_show) {
        var account_Sel = 0;
        for (var i = 0; i < accounts.length; i++) {
            var cbox = dom.getElementById("cbox_" + accounts[i].id);

            if (cBoxObj[accounts[i].id] == null) {
                cbox.checked = accounts[i].isChk;
                if (!init_done && accounts[i].isChk == "checked") {
                    old_manager_uid += accounts[i].id + ",";
                    account_Sel++;
                }
            } else {//btn_search/btn_delete後 cBoxObj 帶入之前的選項checked 並移除舊事件}
                cbox.checked = cBoxObj[accounts[i].id].checked;
                util.removeEvent(cBoxObj[accounts[i].id], "change");
            }
            cbox.acc_id = accounts[i].id;
            cBoxObj[accounts[i].id] = cbox;
            util.addEvent(cbox, "change", _self.cboxEvent, cbox);
        }

        if (!init_done) {
            _mc["accountNum"].innerHTML = "(" + account_Sel + ")";
            util.addEvent(_mc["total"], "click", _self.chkAll, _mc["total"]);
            util.addEvent(_mc["unChkAll"], "click", _self.chkAll, _mc["unChkAll"]);
            util.addEvent(_mc["btn_search"], "click", _self.loadData, _mc["btn_search"]);
            util.addEvent(_mc["btn_delete"], "click", _self.clear_search, _mc["input_search"]);
            util.addEvent(_mc["btn_ph_search"], "click", _self.setPHsearchIcon, { "tarDom": _mc["ph_search_class"], "className": "search_on", "searchDom": _mc["input_search"] });
            util.addEvent(_mc["input_search"], "blur", _self.setSearchInpBlur, { "tarDom": _mc["ph_search_class"], "className": "search_on" });
            _self.ShowAndHidden(null, _mc["acc_detail"]);
            old_manager_uid = old_manager_uid.substr(0, old_manager_uid.length - 1);
            if (isAll == "checked") {
                _mc["total"].checked = true;
                old_manager_uid = 0;
            }
        }
        init_done = true;
    }
    //=================load data end=================

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

    _self.getThis = function (varible) {
        return eval(varible);
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


    _self.checkCbox = function () {
        var mAccount = 0;
        for (var keys in cBoxObj) {
            var box = cBoxObj[keys];
            if (box.checked) {
                mAccount++;
            }
        }
        return mAccount;
    }

    _self.clear_search = function (mouseEvent, targetObj) {
        _mc["input_search"].value = "";
        targetObj.focus();
        _self.loadData();
    }

    _self.cboxEvent = function (mouseEvent, targetObj) {
        _mc["total"].checked = false;
        var account = _self.checkCbox();
        if (account > user_mlimit) {
            var msg = LS.get("sub_mlimit") + user_mlimit + LS.get("sub_mlimit2");
            parentClass.dispatchEvent("showAlertMsg", { "msg": msg });
            targetObj.checked = "";
        }
        _mc["accountNum"].innerHTML = "(" + account + ")";
    }

    _self.chkAll = function (mouseEvent, targetObj) {
        _mc["total"].checked = (targetObj.id == "total") ? true : false;
        var account = 0;
        for (var keys in cBoxObj) {
            var box = cBoxObj[keys];
            box.checked = _mc["total"].checked;
            if (_mc["total"].checked) account++;
        }
        _mc["accountNum"].innerHTML = "(" + account + ")";
        if (_mc["total"].checked) _self.showTip(null, { "_id": "AllAccount_pop" });
    }

    _self.clickBtn = function (mouseEvent, targetObj) {
        if (targetObj.id == "btn_pwd") {
            ctlObj["passwd"].input.value = "";
            _mc["pop_pwd"].style.display = "";
            dom.getElementById("body_show").setAttribute("style", "overflow-y:hidden;");
            dom.body.setAttribute("style", "position:fixed; overflow-y:hidden;");
        } else if (targetObj.id == "pwd_cancel_btn") {
            _mc["pop_pwd"].style.display = "none";
            dom.getElementById("body_show").removeAttribute("style");
            dom.body.removeAttribute("style");
            dom.getElementById("box_passwd").className = "box_popup";
            dom.getElementById("complexity").innerHTML = "";
            dom.getElementById("strengthTxt").style.display = "none";
            dom.getElementById("first_estimate").innerHTML = "";
            dom.getElementById("pwd_light").className = "psw_strength_light";
        } else if (targetObj.id == "pwd_save_btn") {
            _self.upd_passwd();
            dom.getElementById("body_show").removeAttribute("style");
            dom.body.removeAttribute("style");
            dom.getElementById("box_passwd").className = "box_popup";
            dom.getElementById("complexity").innerHTML = "";
            dom.getElementById("strengthTxt").style.display = "none";
            dom.getElementById("first_estimate").innerHTML = "";
            dom.getElementById("pwd_light").className = "psw_strength_light";
        }
    }

    //=================更改密碼=================
    _self.upd_passwd = function () {
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.upd_msg);
        var param = _self.passwdParam();
        param = "p=chg_subuser_pwd&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.passwdParam = function () {
        var par = "";
        par += "uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&levelid=" + top.layer_id;
        par += "&id=" + paramObj.id;
        par += "&pay_type=" + paramObj.pay_type;
        par += "&passwords=" + ctlObj["passwd"].input.value;
        par += "&langx=" + top.langx;
        return par;
    }

    _self.upd_msg = function (data) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;

        if (_status == "success") {
            // ctlObj["passwd"].msg.innerHTML = LS.get("upd_success");
            // _self.setBoxClass(ctlObj["passwd"].box, "psw_succ", "add");
            _mc["pop_pwd"].style.display = "none";
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS_account.get("chg_pwd_success") });
        } else if (_status == "error") {
            if (arr_data.msg == null || arr_data.msg == "") {
                util.chkErrorMsg(arr_data, LS_code);
                return false;
            }
            ctlObj["passwd"].msg.innerHTML = arr_data.msg;
            _self.setBoxClass(ctlObj["passwd"].box, "psw_error", "add");
        }
    }

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
    }
    //=================更改密碼 end=================

    //=================錯誤訊息=================
    _self.showErrorCtl = function (code, msg) {
        _self.clearErrorStatusCtl();
        var obj = ctlObj[code];
        var error_class = "accadd_error";
        if (obj != null) {
            ctlObj[code].msg.innerHTML = msg;
            if (code == "passwd") error_class = "psw_error";
            _self.setBoxClass(ctlObj[code].box, error_class, "add");
            _self.ShowAndHidden(null, _mc["acc_detail"]);
        }
    }

    _self.clearErrorStatusCtl = function () {
        for (var key in ctlObj) {
            _self.setBoxClass(ctlObj[key].box, "", "");
        }
    }

    _self.showErrorPwd = function (code, msg) {
        var obj = ctlObj[code];
        if (obj != null) {
            ctlObj[code].msg.innerHTML = msg;
            _self.setBoxClass(ctlObj[code].box, "psw_error", "add");
        }
    }

    _self.showError = function (code, msg) {
        var tmp = code.split("|");
        if (tmp[0] == "errormsg") {
            _self.showErrorMsg(tmp[1], msg);
        } else if (tmp[0] == "ctl") {
            _self.showErrorCtl(tmp[1], msg);
        }
    }

    _self.showErrorMsg = function (code, msg) {
        if (code == "clean_db") {
            var obj = new Object();
            obj.msg = msg;
            parentClass.dispatchEvent("showAlertMsg", obj);
        }
    }

    _self.setBoxClass = function (targetObj, style, _doSome) {
        if (targetObj == null) return;
        if (targetObj.initclass == null) {
            targetObj.initclass = targetObj.className;
        } else {
            targetObj.className = targetObj.initclass;
        }
        if (_doSome == "add" && !targetObj.classList.contains(style)) {
            targetObj.classList.add(style);
        }
    }
    //=================錯誤訊息 end=================


    //=================密碼強弱=================
    _self.checkThisPassword = function (keyEvent, targetObj) {
        _mc["strengthTxt"].style.display = "";
        var password = _mc["input_passwd"].value;
        var checked = zxcvbn(password);
        var timetocrack = checked.crack_time;
        var strength = checked.score;

        var timeinwords = _self.toWords(timetocrack);

        _mc["first_estimate"].innerHTML = timeinwords;
        if (password == "") {
            _mc["strengthTxt"].style.display = "none";
            strength = 5;
        }

        _self.displayStrength(strength); //強弱程度

        var res = _self.str_chk(ctlObj["passwd"].input.value);
        var charCode = "";
        if (keyEvent.keyCode == 0) {
            charCode = keyEvent.which;
        } else {
            charCode = (keyEvent.keyCode) ? keyEvent.keyCode : keyEvent.which;
        }
        if (charCode == "13") {
            if (res) _self.upd_passwd();
        }

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

    //新密碼檢查流程
    _self.str_chk = function (str) {
        //新密碼跟帳號或安全代碼一樣
        if (str == paramObj.username) {
            _self.showErrorPwd("passwd", LS_code.get("4X022"));
            _mc["pwd_save_btn"].disabled = true;
            return false;
        }
        var res = util.str_chk(str, 1);
        if (res != "chk_OK") {
            _self.strchk_Msg(res);
            return false;
        } else {
            _self.setBoxClass(ctlObj["passwd"].box, "psw_error", "");
            _mc["pwd_save_btn"].disabled = false;
            return true;
        }
    }

    _self.strchk_Msg = function (str) {
        if (str == "err_combination") {
            _self.showErrorPwd("passwd", LS_code.get("4X021"));
            _mc["pwd_save_btn"].disabled = true;
        }
        else if (str == "err_length") {
            _self.showErrorPwd("passwd", LS_code.get("4X021"));
            _mc["pwd_save_btn"].disabled = true;
        }
        else if (str == "err_contain") {
            _self.showErrorPwd("passwd", LS_code.get("4X021"));
            _mc["pwd_save_btn"].disabled = true;
        }
        else if (str == "err_charactersNum") {
            _self.showErrorPwd("passwd", LS_code.get("4X040"));
            _mc["pwd_save_btn"].disabled = true;
        }
        else if (str == "err_block_string") {
            _self.showErrorPwd("passwd", LS_code.get("4X040"));
            _mc["pwd_save_btn"].disabled = true;
        }
        else {
            util.echo("chk wrong!!");
            _self.showErrorPwd("passwd", LS_code.get("4X021"));
            _mc["pwd_save_btn"].disabled = true;
        }
    }

    _self.strchk_Msg_safe = function (str, login_layer) {
        if (str == "err_combination") {
            return (login_layer == "ag")? "4X011_ag":"4X011";
        }
        else if (str == "err_length") {
            return (login_layer == "ag")? "4X011_ag":"4X011";
        }
        else if (str == "err_contain") {
            return (login_layer == "ag")? "4X011_ag":"4X011";
        }
        else if (str == "err_charactersNum") {
            return "4X041";
        }
        else if (str == "err_block_string") {
            return "4X041";
        }
        else {
            util.echo("chk wrong!!");
            return (login_layer == "ag")? "4X011_ag":"4X011";
        }
    }
    //=================密碼強弱 end=================

    //============== 確認安全碼是否重複 ==============
    _self.chkThisPwdSafe = function (keyEvent, targetObj) {
        if (ctlObj["safe"].input.value == "" && keyEvent.type == "blur") {
            _self.showErrorCtl("safe", LS.get("empty_user"));
        } else {
            var str = ctlObj["safe"].input.value;
            if (str == paramObj.username) {
                if (top.login_layer == "ag") {
                    _self.showErrorCtl("safe", LS_code.get("4X015_ag"));
                } else {
                    _self.showErrorCtl("safe", LS_code.get("4X015"));
                }
                return false;
            }
            var res = util.str_chk(ctlObj["safe"].input.value, 2);
            if (top.login_layer == "ag" && (res == "err_charactersNum" || res == "err_block_string")){
                res = "chk_OK" ;
            }
            if (res != "chk_OK") {
                //_self.showErrorCtl("safe", LS_code.get("4X021"));
                _self.showErrorCtl("safe", LS_code.get(_self.strchk_Msg_safe(res, top.login_layer)));
            } else {
                if (top.login_layer == "ag" && keyEvent.type == "blur") {
                    _self.chkpwfEvent(keyEvent, targetObj);
                } else {
                    _self.setBoxClass(ctlObj["safe"].box, "accadd_succ", "add");
                    ctlObj["safe"].msg.innerHTML = "";
                }
            }
        }
    }

    _self.chkpwfEvent = function (e, targetObj) {
        if (targetObj.value != "") {
            var getHttp = new HttpRequest();
            var param = _self.pwfChkParam(targetObj.value);
            getHttp.addEventListener("LoadComplete", _self.pwfChkFinish);
            param = "p=chk_username&langx=" + top.langx+ "&ver=" + top.ver + param;
            getHttp.loadURL(top.url, "POST", param);
        } else {
            ctlObj["safe"].msg.innerHTML = LS.get("empty_user");
            _self.setBoxClass(ctlObj["safe"].box, "accadd_error", "add");
        }
    }

    _self.pwfChkFinish = function (data) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        var code = util.showTxt(arr_data.code);
        var msg = util.showTxt(arr_data.msg);

        if (_status == "error") {
            if (msg != null && msg != "") {
                //ctlObj[code].input.value = "";
                ctlObj[code].input.focus();
                _self.showErrorCtl(code, msg);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
        } else if (_status == "no_use") {
            ctlObj[code].msg.innerHTML = msg;
            _self.setBoxClass(ctlObj[code].box, "accadd_succ", "add");
        }
    }

    _self.pwfChkParam = function (passwordssafe) {
        var par = "";
        par += "&uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&view_layer=" + top.login_layer;
        par += "&passwordssafe=" + passwordssafe;
        return par;
    }
    //============== 確認安全碼是否重複 ==============

    _self.chg_mail_status = function () {
        var enable_recv = _mc["input_psw_recovery"].checked;
        _mc["psw_recovery_text"].innerHTML = (enable_recv) ? LS.get("recv_enable") : LS.get("recv_disable");
    }

    _self.ShowAndHidden = function (mouseEvent, element) {
        for (var id in titleObj) {
            if (titleObj[id].classList.contains("on") && element.id != id) {
                titleObj[id].classList.remove("on");
                _mc[titleObj[id].map].style.display = "none";
            }
        }
        if (!element.classList.contains("on")) {
            element.classList.add("on");
        }
        _mc[element.map].style.display = "";
        if (element.map == "div_acc_eventlog") {
            ObjEventlog.setScrollEvent(true);
        } else {
            //回到帳號設定頁時 重新設定離開確認事件
            _self.InitSetConfirmExit();
            util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, _mc["scroll_div"]);
        }
    }


    //============== save ==============
    _self.saveEvent = function (mouseEvent, targetObj) {
        var ret = _self.submitCheck();
        var new_name = ctlObj["alias"].input.value;
        var new_pri = "";
        var new_manager_uid = "";

        for (var i = 0; i < pri_ary.length; i++) {
            if (_mc[pri_ary[i]].checked) {
                if (new_pri != "") new_pri += "-";
                new_pri += pri_ary[i];
            }
        }

        if (_mc["total"].checked) {
            new_manager_uid = "0";
        } else {
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked) {
                    if (new_manager_uid != "") new_manager_uid += ",";
                    new_manager_uid += box.acc_id;
                }
            }
        }

        if (ret) {
            //if (new_name != paramObj["alias"] || new_pri != paramObj["pri"] || new_manager_uid != old_manager_uid || _mc["input_psw_recovery"].keep != _mc["input_psw_recovery"].checked) {
                var getHttp = new HttpRequest();
                getHttp.addEventListener("LoadComplete", function (data) {
                    _self.saveFinish(data, targetObj);
                });
                var param = _self.getSaveParam();
                param += _self.getUsrChgParam();
                param = "p=body_subuser_modify&ver=" + top.ver + "&" + param;
                getHttp.loadURL(top.url, "POST", param);

            /*} else {
                _self.closeEvent("save");
            }*/
        }
    }

    //拿使用者要改變的參數
    _self.getUsrChgParam = function(){
        var param = "";
        for (var i in powerObj){
            param += "&" + i + "=" + powerObj[i].value;
        }

        for(var i in checkObj){
            param += "&" + i + "=" + checkObj[i].checked;
        }
        return param;
    }

    _self.saveFinish = function (data, targetObj) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        if (_status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg == null || error_msg == "") {
                util.chkErrorMsg(arr_data, LS_code);
                return false;
            }
            _self.showError(error_code, error_msg);
        } else {
            //parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_account_success") , "s":"5" });
            _self.closeEvent("save");
        }
    }

    _self.getSaveParam = function () {
        var set_pri_type = "";
        var set_manager_uid = "";

        for (var i = 0; i < pri_ary.length; i++) {
            if (_mc[pri_ary[i]].checked) {
                if (set_pri_type != "") set_pri_type += "-";
                set_pri_type += pri_ary[i];
            }
        }

        if (_mc["total"].checked) {
            set_manager_uid = "0";
        } else {
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked) {
                    if (set_manager_uid != "") set_manager_uid += ",";
                    set_manager_uid += box.acc_id;
                }
            }
        }

        var par = "";
        par += "uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&action=edit";
        par += "&levelid=" + top.layer_id;
        par += "&subid=" + paramObj.id;
        par += "&set_pri_type=" + set_pri_type;
        par += "&subname=" + paramObj.username;
        par += "&alias=" + ctlObj["alias"].input.value;
        par += "&set_manager_uid=" + set_manager_uid;
        par += "&langx=" + top.langx;
        par += "&pay_type=" + paramObj.pay_type;
        var pmo_enable = "";
        if (_mc["input_psw_recovery"].keep != _mc["input_psw_recovery"].checked) {
            pmo_enable = (_mc["input_psw_recovery"].checked) ? "E" : "S";
        }
        par += "&pmo_enable=" + pmo_enable;
        return par;
    }

    _self.submitCheck = function () {
        for (var key in ctlObj) {
            if (ctlObj[key].input.value == "") {
                if (key != "passwd") {
                    _self.showErrorCtl(key, LS.get("empty_" + key));
                    return false;
                }
            }
        }

        if (!_mc["total"].checked) {
            var nums = 0;
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked) nums++;
            }
            if (nums > user_mlimit) {
                var msg = LS.get("sub_mlimit") + user_mlimit + LS.get("sub_mlimit2");
                _self.ShowAndHidden(null, _mc["acc_manage"]);
                parentClass.dispatchEvent("showAlertMsg", { "msg": msg });
                return false;
            }
        }
        var chk = 0;
        var msg = LS.get("user_manage");
        if (!_mc["total"].checked) {
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked) chk = 1;
            }
            if (chk == 0) {
                _self.ShowAndHidden(null, _mc["acc_manage"]);
                parentClass.dispatchEvent("showAlertMsg", { "msg": msg });
                return false;
            }
        }
        return true;
    }
    //============== save end ==============

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

    //=================收尋視窗 手機監聽事件 start================
    _self.setPHsearchIcon = function (evt, param) {
        param.tarDom.classList.add(param.className);
        param.searchDom.focus();
    }
    _self.setSearchInpBlur = function (evt, param) {
        var DOM = evt.target;
        if (param.tarDom.classList.contains(param.className) && DOM.value == "") {
            param.tarDom.classList.remove(param.className);
        }
    }
    //=================收尋視窗 手機監聽事件 end================

    //=================帳號管理權限=================
    _self.showSubpri = function (e, param) {
        for (var i = 0; i < param.se.length; i++) {
            var tmp_id = param.type + param.se[i];
            if (e.target.checked) {
                // // 2019-04-29 d.修改/新增子帳號-請先幫將"change credit"的文字和勾選紐做灰底, 並無法勾選
                // if(tmp_id!="B2") _mc[tmp_id].removeAttribute('disabled');
                _mc[tmp_id].removeAttribute('disabled');
            } else {
                _mc[tmp_id].checked = false;
                _mc[tmp_id].setAttribute('disabled', 'disabled');
            }
        }
    }
    //=================帳號管理權限 end=================

    _self.InitSetConfirmExit = function(){
        var obj = new Object();
        obj["Alert"] = { "msg": LS_account.get("str_unsave"), "mode": "Y" };
        obj["ifNo"] = _self.exitConfirmNo;
        obj["isEdit"] = _self.isEdit;
        parentClass.dispatchEvent("SetConfirmExit", obj);
    }

    _self.exitConfirmNo = function () {
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "account" });
    }

    _self.titleChg = function (mouseEvent, element) {
        if (element.map == "div_acc_eventlog" && mouseEvent!=null) {
            parentClass.dispatchEvent("ConfirmExitAlert", { Event: mouseEvent, Param: element, func: _self.ShowAndHidden });
        }else{
            _self.ShowAndHidden(mouseEvent, element);
        }
    }

    _self.isEdit = function () {
        var new_name = ctlObj["alias"].input.value;
        var new_pri = "";
        var new_manager_uid = "";

        for (var i = 0; i < pri_ary.length; i++) {
            if (_mc[pri_ary[i]].checked) {
                if (new_pri != "") new_pri += "-";
                new_pri += pri_ary[i];
            }
        }

        if (_mc["total"].checked) {
            new_manager_uid = "0";
        } else {
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked) {
                    if (new_manager_uid != "") new_manager_uid += ",";
                    new_manager_uid += box.acc_id;
                }
            }
        }

        if (new_name != paramObj["alias"] || new_pri != paramObj["pri"]
            || new_manager_uid != old_manager_uid || _mc["input_psw_recovery"].keep != _mc["input_psw_recovery"].checked) {
            return true;
        } else {
            return false;
        }
    }
}