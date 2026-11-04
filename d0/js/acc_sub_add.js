function acc_sub_add(_win, _dom, paramObj){
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
    var titleObj = new Array();
    var cBoxObj = new Array();
    var powerObj = new Array();
    var checkObj = new Array();
    var pri_ary = new Array("A", "B", "B1", "B2", "C");
    var user_mlimit = "";
    var isAll = "";
    var init_done = false;
    var keepScrollTop = 56;
    var overScrollTop = 56;

    _self.init=function(){
        parentClass.dispatchEvent("chgPageName", { "pageType": "account","pageName": "sub_add" });
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "account" });
        //設定離開確認事件
        var obj = new Object();
        obj["Alert"] = { "msg": LS_account.get("str_unsave"), "mode": "Y" };
        obj["ifNo"] = _self.exitConfirmNo;
        parentClass.dispatchEvent("SetConfirmExit", obj);

        var objid = ",box_user,input_user,msg_user,box_alias,input_alias,msg_alias,box_passwd,accountNum,";
        objid += "input_passwd,msg_passwd,";
        objid += "password_i_box,safe_i_box,";
        objid += "A,B,B1,B2,C,";
        objid += "btn_new,btn_save,";
        objid += "account_info,manage_info,"
        objid += "btn_cancel,btn_new,btn_save,";
        objid += "total,unChkAll,";
        objid += "btn_search,input_search,btn_delete,";
        // objid += "strengthTxt,first_estimate,pwd_light,complexity,eye_pwd,";
        objid += "scroll_div,";
        objid += "safe_tip,";
        objid += "ps_icon,ps_txt,account_icon,account_txt,";
        objid += "btn_ph_search,ph_search_class,"
        _mc = util.getObjAry(dom, objid);

        var obj_ids = ",strengthTxt,first_estimate,pwd_light,complexity,eye_pwd,";
        var tmpObj = util.getObjAry(_mc["account_info"], obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);

        //user
        ctlObj["user"] = new Object();
        ctlObj["user"].box = _mc["box_user"];
        ctlObj["user"].msg = _mc["msg_user"];
        ctlObj["user"].input = _mc["input_user"];

        //alias
        ctlObj["alias"] = new Object();
        ctlObj["alias"].box = _mc["box_alias"];
        ctlObj["alias"].msg = _mc["msg_alias"];
        ctlObj["alias"].input = _mc["input_alias"];

        //passwd
        ctlObj["passwd"] = new Object();
        ctlObj["passwd"].box = _mc["box_passwd"];
        ctlObj["passwd"].msg = _mc["msg_passwd"];
        ctlObj["passwd"].input = _mc["input_passwd"];
        _mc["eye_pwd"].isShow = false;
        _mc["eye_pwd"].BlurPwdOFF = false;

        _mc["total"].checked = false;

        _mc["btn_save"].backPage = "acc_sub_list";
        _mc["btn_cancel"].backPage = "acc_sub_list";
        _mc["btn_new"].backPage = "acc_sub_add";


        var obj_ids = ",account_title_box,manage_title_box,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for (var objid in tmpObj) {
            var ta = objid.split("_");
            tmpObj[objid].map = ta[0] + "_info";
            titleObj[objid] = tmpObj[objid];
            util.addEvent(tmpObj[objid], "click", _self.ShowAndHidden, tmpObj[objid]);
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

        var obj_ids = ",AD_MEM_LOG,AD_MEM_DOMAIN,AD_MEM_DOBET,AD_MEM_EXCHANGE,AD_MEM_EDIT,AD_MEM_HIDE,AD_MEM_DEL,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for(var objid in tmpObj){
            checkObj[objid] = tmpObj[objid];
        }

        util.ChkKeyUser(ctlObj["user"].input);
        util.addEvent(ctlObj["user"].input, "blur", _self.checkUserNameEvent, ctlObj["user"].input);
        util.addEvent(ctlObj["user"].input, "focus", _self.clearErrorStatusCtl, ctlObj["user"]);

        util.addEvent(ctlObj["alias"].input, "blur", _self.checkNameEvent, ctlObj["alias"].input);
        util.addEvent(ctlObj["alias"].input, "focus", _self.clearErrorStatusCtl, ctlObj["alias"]);

        util.ChkKeyUser(ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "keyup", _self.checkThisPassword, ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "blur", _self.checkThisPassword, ctlObj["passwd"].input);
        util.addEvent(ctlObj["passwd"].input, "focus", function () { _self.setBoxClass(ctlObj["passwd"].box, "psw_error", ""); }, ctlObj["passwd"].input);

        util.addEvent(_mc["btn_save"], "click", _self.saveEvent, _mc["btn_save"]);
        util.addEvent(_mc["btn_new"], "click", _self.saveEvent, _mc["btn_new"]);
        util.addEvent(_mc["btn_cancel"], "click", _self.closeEvent, _mc["btn_cancel"]);
        util.addEvent(_mc["eye_pwd"], "click", _self.showPwd, _mc["eye_pwd"]);
        util.addEvent(_mc["eye_pwd"], "mousedown", _self.BlurPwdOFF, _mc["eye_pwd"]);

        // 帳號狀態 i 提示
        util.addEvent(_mc["safe_tip"], "click", _self.showTip, { "_id": (top.login_layer == "ag") ? "loginid_pop" : "safe_pop" });

        // 密碼 i 提示
        util.setInfEvent(_mc["ps_icon"], { "_focus": _mc["ps_txt"], "_setView": _mc["ps_txt"], "_viewClass": "on" });
        // 可管理全選 i 提示
        util.setInfEvent(_mc["account_icon"], { "_focus": _mc["account_txt"], "_setView": _mc["account_txt"], "_viewClass": "on" });

        _self.initShow();
        _self.loadData();
        _self.showPwd(null, _mc["eye_pwd"]);

        keepScrollTop = _mc["account_title_box"].parentElement.offsetHeight;
        overScrollTop = _mc["account_title_box"].parentElement.offsetHeight;
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, _mc["scroll_div"]);
        dom.getElementById("body_show").scrollTop = 0;

        parentClass.dispatchEvent("showLoading", { "showLoading": false });
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


    _self.closeEvent = function (mouseEvent, targetObj) {
        var obj = new Object();
        obj.page = targetObj.backPage;
        if (targetObj == _mc["btn_new"] || targetObj == _mc["btn_save"]) obj.LeaveChkPass = true;
        parentClass.dispatchEvent("bodyGoToPage", obj);
    }

    _self.exitConfirmNo = function () {
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "account" });
    }

    _self.IInfoEvent = function (mouseEvent, targetObj) {
        _mc[targetObj.types + "_i_box"].style.display = (_mc[targetObj.types + "_i_box"].style.display == "") ? "none" : "";
    }

    _self.ShowAndHidden = function (mouseEvent, element) {
        for (var id in titleObj) {
            if (titleObj[id].classList.contains("on") && element.id != id){
                titleObj[id].classList.remove("on");
                _mc[titleObj[id].map].style.display = "none";
            }
        }
        if (!element.classList.contains("on")) {
            element.classList.add("on");
        }
        _mc[element.map].style.display = "";
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
            param += _self.getUsrChgParam();
            param = "p=body_subuser_modify&ver=" + top.ver + "&" + param;
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
            //parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_account_success") });
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_account_success") ,"s":5 , "showCopy":"Y" ,"value":LS.get("account_copy")});
            util.addEvent(dom.getElementById("btn_copy"), "click", _self.copyInput);

            _self.closeEvent(null, targetObj);
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
        par += "&action=add";
        par += "&levelid=" + top.layer_id;
        par += "&subid=";
        par += "&set_pri_type=" + set_pri_type;
        par += "&subname=" + ctlObj["user"].input.value;
        par += "&alias=" + ctlObj["alias"].input.value;
        par += "&passwords=" + ctlObj["passwd"].input.value;
        par += "&set_manager_uid=" + set_manager_uid;
        par += "&langx=" + top.langx;
        if (top.login_layer == "ag") par += "&pay_type=" + top.pay_type;
        return par;
    }

    //============== save ==============

    //============== check username ==============

    _self.getParam = function () {
        var par = "";
        par += "uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&action=add";
        if (top.login_layer == "ag") par += "&pay_type=" + top.pay_type;
        par += "&lower_name=" + _mc["input_search"].value;
        return par;
    }

    //load data
    _self.loadData = function () {
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.loadFinish);
        var param = _self.getParam();
        param = "p=get_subuser_lower&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }

    //load finish
    _self.loadFinish = function (data) {
        var xmlObj = new Object();
        var arr_data = JSON.parse(data);

        if (arr_data.status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg != null && error_msg != "") {
                _self.show_Error(error_code, error_msg, arr_data);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
            return false;
        }

        xmlObj["account"] = arr_data.account;
        user_mlimit = arr_data.user_mlimit * 1;
        isAll = arr_data.isAll;

        var bodyTemp = "";//存放body
        var outdata = "";//輸出資料
        var div_show = dom.getElementById("div_show");//show div

        //modle
        var xmp_header = dom.getElementById("xmp_header").innerHTML;//modle header
        var xmp_contant = dom.getElementById("xmp_contant").innerHTML;//modle contant

        xmp_header = xmp_header.replace(/\*ACCOUNTNUM\*/g, xmlObj["account"].length);

        if (xmlObj["account"].length > 0) {
            for (var i = 0; i < xmlObj["account"].length; i++) {
                var contanttmp = xmp_contant;//clone contant 資料
                var obj = xmlObj["account"][i];
                contanttmp = contanttmp.replace(/\*ID\*/g, util.showTxt(obj["id"]));
                contanttmp = contanttmp.replace(/\*USERNAME\*/g, util.showTxt(obj["username"]));
                contanttmp = contanttmp.replace(/\*ALIAS\*/g, util.showTxt(obj["alias"]));
                contanttmp = contanttmp.replace(/\*LOGINID\*/g, util.showTxt(obj["loginid"]));
                bodyTemp += contanttmp;
            }
        } else {
            bodyTemp = dom.getElementById("xmp_nodata").innerHTML;//modle contant
            isAll = "checked";
        }

        outdata = xmp_header + bodyTemp;
        div_show.innerHTML = outdata;
        if(arr_data["special"]){
            var special = arr_data["special"];
            if(special["isSpecial"] == "N"){
                dom.getElementById("special_info").remove();
            }else{
                dom.getElementById("special_info").style.display = "";
                var sup = special["sup"];
                var list = special["list"];
                for(var i in sup){
                    if (powerObj[i]) {
                        powerObj[i].value = list[i];
                        if (powerObj[i].JS_UL) powerObj[i].JS_UL.setSelected(powerObj[i].value);
                    }

                    if (checkObj[i]) {
                        if (arr_data[i] === "true") {
                            checkObj[i].checked = true;
                        } else {
                            checkObj[i].checked = false;
                        }
                    }
                }
            }
        }

        _self.initEvent(xmlObj["account"], div_show);
    }

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

    _self.chkAll = function (mouseEvent, targetObj) {
        _mc["total"].checked = (targetObj.id =="total")? true:false;
        var account = 0;
        for (var keys in cBoxObj) {
            var box = cBoxObj[keys];
            box.checked = _mc["total"].checked;
            if (_mc["total"].checked) account++;
        }
        _mc["accountNum"].innerHTML = "(" + account + ")";
        if (_mc["total"].checked) _self.showTip(null, { "_id": "AllAccount_pop" });
    }

    //init event
    _self.initEvent = function (accounts, div_show) {
        for (var i = 0; i < accounts.length; i++) {
            var cbox = dom.getElementById("cbox_" + accounts[i].id);

            if (cBoxObj[accounts[i].id] == null) {
                cbox.checked = accounts[i].isChk;
            } else {//btn_search/btn_delete後 cBoxObj 帶入之前的選項checked 並移除舊事件}
                cbox.checked = cBoxObj[accounts[i].id].checked;
                util.removeEvent(cBoxObj[accounts[i].id], "change");
            }
            cbox.acc_id = accounts[i].id;
            cBoxObj[accounts[i].id] = cbox;
            util.addEvent(cbox, "change", _self.cboxEvent, cbox);
        }
        //_mc["checkAll_i_box"] = _top["Util"].getSpan(checkAll_div, "div", "checkAll_i_box");
        if(!init_done){
            util.addEvent(_mc["total"], "click", _self.chkAll, _mc["total"]);
            util.addEvent(_mc["unChkAll"], "click", _self.chkAll, _mc["unChkAll"]);
            util.addEvent(_mc["btn_search"], "click", _self.loadData, _mc["btn_search"]);
            util.addEvent(_mc["btn_delete"], "click", _self.clear_search, _mc["input_search"]);
            util.addEvent(_mc["btn_ph_search"], "click", _self.setPHsearchIcon, { "tarDom": _mc["ph_search_class"], "className": "search_on", "searchDom": _mc["input_search"] });
            util.addEvent(_mc["input_search"], "blur", _self.setSearchInpBlur, { "tarDom": _mc["ph_search_class"], "className": "search_on" });
            _self.ShowAndHidden(null, _mc["account_title_box"]);
        }

        if (isAll == "checked") {
            _mc["total"].checked = true;
        }
        init_done = true;
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
        _mc["accountNum"].innerHTML = "(" + account +")";
    }

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

    _self.checkUserNameEvent = function (e, targetObj) {
        if (targetObj.value != "") {
            if (ctlObj["user"].input.value.length < 4) {
                _self.showErrorCtl("user", LS.get("user_limit"));
                return false;
            }
            var getHttp = new HttpRequest();
            var param = _self.getCheckParam(targetObj.value);
            getHttp.addEventListener("LoadComplete", _self.loadCheckFinish);
            param = "p=chk_username&ver=" + top.ver + param;
            getHttp.loadURL(top.url, "POST", param);
        } else {
            ctlObj["user"].msg.innerHTML = LS.get("empty_user");
            _self.setBoxClass(ctlObj["user"].box,"accadd_error","add");
        }
    }

    _self.checkNameEvent = function (e, targetObj) {
        if (targetObj.value == "") {
            ctlObj["alias"].msg.innerHTML = LS.get("empty_alias");
            _self.setBoxClass(ctlObj["alias"].box,"accadd_error","add");
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
        par += "&uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&view_layer=" + top.login_layer;
        par += "&username=" + username;
        par += "&langx=" + top.langx;
        return par;
    }
    //============== check username ==============

    //============== 確認安全碼是否重複 ==============
    _self.chkThisPwdSafe = function (keyEvent, targetObj) {
        if (ctlObj["safe"].input.value == "" && keyEvent.type == "blur") {
            _self.showErrorCtl("safe", LS.get("empty_user"));
        } else {
            var res = util.str_chk(ctlObj["safe"].input.value, 2);
            if (top.login_layer == "ag" && (res == "err_charactersNum" || res == "err_block_string")) {
                res = "chk_OK";
            }
            if (res != "chk_OK") {
                //_self.showErrorCtl("safe", LS_code.get("4X021"));
                _self.showErrorCtl("safe", LS_code.get(_self.strchk_Msg_safe(res, top.login_layer)));
            } else {
                var str = ctlObj["safe"].input.value;
                if (str == ctlObj["user"].input.value || str == ctlObj["passwd"].input.value) {
                    if (top.login_layer == "ag"){
                        _self.showErrorCtl("safe", LS_code.get("4X015_ag"));
                    }else{
                        _self.showErrorCtl("safe", LS_code.get("4X015"));
                    }
                    return false;
                }
                if (top.login_layer == "ag" && keyEvent.type == "blur"){
                    _self.chkpwfEvent(keyEvent, targetObj);
                }else{
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
            param = "p=chk_username&langx=" + top.langx + "&ver=" + top.ver + "&" + param;
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



    //=================錯誤訊息=================
    _self.showErrorCtl = function (code, msg) {
        if (code == "system") {
            code = "user";
        }
        var obj = ctlObj[code];
        _self.clearErrorStatusCtl(null,obj);
        var error_class = "accadd_error";
        if (obj != null) {
            ctlObj[code].msg.innerHTML = msg;
            if (code == "passwd") error_class = "psw_error";
            _self.setBoxClass(ctlObj[code].box, error_class, "add");
            _self.ShowAndHidden(null, _mc["account_title_box"]);
        }
    }

    _self.clearErrorStatusCtl = function (e, target) {
        if (target != null) {
            _self.setBoxClass(target.box, "accadd_error", "");
        } else {
            for (var key in ctlObj) {
                _self.setBoxClass(ctlObj[key].box, "accadd_error", "");
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
                _self.closeEvent(null, _mc["btn_save"]);
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
        // var obj = confObj[code];
        // if (obj != null) {
        //     if (code.indexOf("WAR") == -1 && code.indexOf("_limit") == -1) {
        //         _self.initShow();

        //         _self.setBoxClass(confObj[code], "accconf_error", "");
        //         confObj[code].focus();

        //         var tmp = code.split("_");
        //         var keys = "msgTr_" + tmp[0] + "_" + tmp[1] + "_tr";
        //         _mc[keys].style.display = "";
        //         _self.ShowAndHidden(null, _mc[tmp[0] + "_commis_title"]);
        //     }
        // }
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
		/*
		if(!util.checkFormat(ctlObj["alias"].input.value,0)){
			_self.showErrorCtl("alias", LS.get("empty_user"));
			return false;
		}
        */
        if (ctlObj["user"].input.value.length < 4) {
            _self.showErrorCtl("user", LS.get("user_limit"));
            return false;
        }

        if (!util.checkFormat(ctlObj["passwd"].input.value, 0)) {
            _self.showErrorCtl("passwd", LS.get("empty_passwd"));
            return false;
        }

        if (!_self.str_chk(ctlObj["passwd"].input.value)){
            return false;
        }

        if (!_mc["total"].checked) {
            var nums = 0;
            for (var keys in cBoxObj) {
                var box = cBoxObj[keys];
                if (box.checked) nums++;
            }
            if (nums > user_mlimit) {
                var msg = LS.get("sub_mlimit") + user_mlimit + LS.get("sub_mlimit2");
                _self.ShowAndHidden(null, _mc["manage_title_box"]);
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
                _self.ShowAndHidden(null, _mc["manage_title_box"]);
                parentClass.dispatchEvent("showAlertMsg", { "msg": msg });
                return false;
            }
        }

        return true;
    }

    _self.initShow = function () {
        for (var i = 0; i < pri_ary.length; i++) {
            if (pri_ary[i] == "B1" || pri_ary[i] == "B2") {
                if (!_mc["B"].checked)    _mc[pri_ary[i]].disabled = "disabled";
            }
            if (pri_ary[i] == "B") {
                util.addEvent(_mc[pri_ary[i]], "click", _self.showSubpri, { type: pri_ary[i], se: ["1","2"]});
            }
        }
    }

    //=================密碼強弱=================
    _self.checkThisPassword = function (keyEvent, targetObj) {
        if (keyEvent.type == "blur" && _mc["eye_pwd"].BlurPwdOFF) {
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
        if (res != "chk_OK") {
            _self.strchk_Msg(res);
            return false;
        } else {
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
        if (mouseEvent != null) _mc["input_passwd"].focus();
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
}