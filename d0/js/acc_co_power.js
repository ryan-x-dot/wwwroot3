function acc_co_power(_win, _dom, param) {
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
    var powerObj = new Array();
    var checkObj = new Array();
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

        var obj_ids = ",btn_cancel,btn_save,";
        _mc = util.getObjAry(dom, obj_ids);

        var obj_ids = ",D1_SU,D1_AG,D1_MEM,D1_MESS,";
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
            util.addEvent(sel, "change", _self.set_UL_value);
        }

        var obj_ids = ",D1_MEM_LOG,D1_MEM_DOMAIN,D1_MEM_DOBET,D1_MEM_EXCHANGE,D1_MEM_EDIT,D1_MEM_HIDE,D1_MEM_DEL,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for(var objid in tmpObj){
            checkObj[objid] = tmpObj[objid];
        }

        _self.getPowerToServer();
        // 修改儲存/取消
        util.addEvent(_mc["btn_cancel"], "click", _self.closeEvent, "cancel");
        util.addEvent(_mc["btn_save"], "click", _self.amendPowerToServer, _mc["btn_save"]);
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

    _self.closeEvent = function(e){
        var par = new Array();
        par["page"] = param.back_page;
        if (e == "save") par["LeaveChkPass"] = true;
        if(param.back_page.indexOf("list")!=-1) {
            var _paramObj = new Array();
            _paramObj["up_id"] = param.up_id;
            _paramObj["up_username"] = param.up_username;
            par["postHash"] = _paramObj;
        }
        parentClass.dispatchEvent("bodyGoToPage", par);
    }

    //修改退水額度
    _self.amendPowerToServer = function(){
        // parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&aid=" + userDate["edit_id"];
        urlParams += "&act=Y";
        urlParams += "&langx=" + top.langx;
        urlParams += _self.getUsrChgParam();
        urlParams = "p=get_acc_"+level+"_power&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.amendCommMesg);
        getHTML.loadURL(top.url, "POST", urlParams);
    }
    //預設拿資料
    _self.getPowerToServer = function () {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&aid=" + userDate["edit_id"];
        urlParams += "&langx=" + top.langx;
        urlParams = "p=get_acc_"+level+"_power&ver=" + top.ver + "&" + urlParams;
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

        if (arr_data){
            var sup = arr_data["sup"];
            var list = arr_data["list"];
            var div_select = "N";
            var div_mem = "N";
            var div_bet_eidt = "N";
            for (var i in list){
                if(sup[i] && sup[i]=="Y") {
                    if (powerObj[i]) {
                        powerObj[i].value = list[i];
                        if (powerObj[i].JS_UL) powerObj[i].JS_UL.setSelected(powerObj[i].value);

                        if(i=="D1_MEM"){
                            div_mem = "Y";
                        }else{
                            div_select = "Y";
                        }
                    }

                    if (checkObj[i]) {
                        if (list[i] === "true") {
                            checkObj[i].checked = true;
                        } else {
                            checkObj[i].checked = false;
                        }
                        switch (i){
                            case "D1_MEM_EXCHANGE":
                            case "D1_MEM_EDIT":
                            case "D1_MEM_HIDE":
                            case "D1_MEM_DEL":
                                div_bet_eidt = "Y";
                                break;
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
            if(div_select == "N"){
                dom.getElementById("D1_SELECT").remove();
            }

            if(div_mem == "N"){
                dom.getElementById("MEM_DIVS").remove();
            }

            if(div_bet_eidt == "N"){
                dom.getElementById("BET_EDIT_DIV").remove();
            }
        }
    }




    //修改資料處理中心
    _self.amendCommMesg = function(data){
        var arr_data = JSON.parse(data);
        if (arr_data.status == "success") {
            parentClass.dispatchEvent("showLoading", { "showLoading": true });
            _self.getPowerToServer();
        } else if (arr_data.status == "error") {
            if (arr_data.msg == null || arr_data.msg == "") {
                util.chkErrorMsg(arr_data, LS_code);
                return false;
            }
            parentClass.dispatchEvent("showAlertMsg", arr_data);
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