function ann_important_add(_win, _dom, paramObj){
    var _self = this;
    var level ="important";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var LS_account;
    var config_set;
    var _mc = new Object();
    var dateHash = new Object();
    var eventHandler = new Object();
    var ctlObj = new Array();
    var param;
    var ann_title = new Object();
    ann_title["title"] = new Array("ann_important","ann_general","ann_personal","ann_proNews","ann_proChat");

    _self.init=function() {
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        parentClass.dispatchEvent("chgLeftMenuColor", {"target": "announcement"});
        parentClass.dispatchEvent("chgPageName", {"pageType": "announcement", "uniqText": LS.get("page_"+level+"_announcement")});
        param = paramObj;
        var obj_ids = ",div_ann_important,div_ann_general,div_ann_personal,div_ann_proNews,div_ann_proChat,";
        obj_ids += "ann_important,ann_general,ann_personal,ann_proNews,ann_proChat,";
        obj_ids += "box_content_cn,input_content_cn,msg_content_cn,";
        obj_ids += "box_content_tw,input_content_tw,msg_content_tw,";
        obj_ids += "box_content_en,input_content_en,msg_content_en,";
        obj_ids += "box_ann_type,box_alert_type,input_enddate,input_no_date,box_date,msg_enddate,";
        obj_ids += "btn_save,btn_cancel,";
        _mc = util.getObjAry(dom, obj_ids);

        _mc["ann_fb"] = dom.getElementsByName("ann_fb") ;
        _mc["ann_alert"] = dom.getElementsByName("ann_alert") ;

        ctlObj["content_cn"] = new Object();
        ctlObj["content_cn"].box = _mc["box_content_cn"];
        ctlObj["content_cn"].msg = _mc["msg_content_cn"];
        ctlObj["content_cn"].input = _mc["input_content_cn"];

        ctlObj["content_tw"] = new Object();
        ctlObj["content_tw"].box = _mc["box_content_tw"];
        ctlObj["content_tw"].msg = _mc["msg_content_tw"];
        ctlObj["content_tw"].input = _mc["input_content_tw"];

        ctlObj["content_en"] = new Object();
        ctlObj["content_en"].box = _mc["box_content_en"];
        ctlObj["content_en"].msg = _mc["msg_content_en"];
        ctlObj["content_en"].input = _mc["input_content_en"];

        ctlObj["enddate"] = new Object();
        ctlObj["enddate"].box = _mc["box_date"];
        ctlObj["enddate"].msg = _mc["msg_enddate"];
        ctlObj["enddate"].input = _mc["input_enddate"];

        ctlObj["ann_type"] = new Object();
        ctlObj["ann_type"].box = _mc["box_ann_type"];

        ctlObj["alert_type"] = new Object();
        ctlObj["alert_type"].box = _mc["box_alert_type"];

        util.addEvent(_mc["btn_cancel"], "click", _self.closeEvent, "cancel");
        util.addEvent(_mc["btn_save"], "click", _self.saveEvent, _mc["btn_save"]);

        _self.parseJSON();
        _self.initCalendar(); //日历

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

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
        config_set = parentClass.getThis("config_set");
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    //============== save ==============
    _self.saveEvent = function (mouseEvent, targetObj) {
        var ret = _self.submitCheck();
        if (ret) {
            var getHttp = new HttpRequest();
            getHttp.addEventListener("LoadComplete", function (data) {
                _self.saveFinish(data, targetObj);
            });
            var param = _self.getSaveParam();
            param = "p=get_announcement&ver=" + top.ver + "&" + param;
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
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_success") ,"s":5, "showCopy":"N" });
            _self.closeEvent("save");
        }
    }

    _self.getSaveParam = function () {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&langx=" + top.langx;
        par += "&action=add";
        par += "&txt_cn="+_mc["input_content_cn"].value;
        par += "&txt_tw="+_mc["input_content_tw"].value;
        par += "&txt_en="+_mc["input_content_en"].value;
        par += "&scoll_type=" +level;
        par += "&end_date=" + _mc["input_enddate"].value;
        par += "&no_date=" + _mc["input_no_date"].checked;
        par += "&fb=" + _self.get_acc_type();
        par += "&alert=" + _self.get_alert_type();
        return par;
    }

    _self.get_acc_type = function () {
        var obj = _mc["ann_fb"]
        var radio_value = "";
        for (i = 0; i < obj.length; i++) {
            if (obj[i].checked) {
                radio_value = obj[i].value;
            }
        }
        return radio_value;
    }

    _self.get_alert_type = function () {
        var obj = _mc["ann_alert"];
        var radio_value = "";
        for (i = 0; i < obj.length; i++) {
            if (obj[i].checked) {
                radio_value = obj[i].value;
            }
        }
        return radio_value;
    }

    _self.closeEvent = function(e){
        var par = new Array();
        var paramHash = new Object();
        paramHash["scoll_type"] = level;
        paramHash["scoll_date"] = param.scoll_date;
        paramHash["sort"] = param.sort;
        paramHash["search"] = param.search;

        par["page"] = param.back_page;
        par["postHash"] = paramHash;
        if (e == "save") par["LeaveChkPass"] = true;
        parentClass.dispatchEvent("bodyGoToPage", par);
    }

    _self.submitCheck = function () {
        _self.initShow();
        if (ctlObj["content_cn"].input.value == "") {
            _self.showErrorCtl("content_cn", LS.get("empty_content"));
            return false;
        }

        if (ctlObj["content_tw"].input.value == "") {
            _self.showErrorCtl("content_tw", LS.get("empty_content"));
            return false;
        }

        if (ctlObj["content_en"].input.value == "") {
            _self.showErrorCtl("content_en", LS.get("empty_content"));
            return false;
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
        _self.clearErrorStatusCtl(e,target);
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

    //=================錯誤訊息=================
    _self.showErrorCtl = function (code, msg) {
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
            _self.setBoxClass(ctlObj[code].box, error_class, "add");
        }
    }

    _self.clearErrorStatusCtl = function (e, target) {
        if (target!=null){
            _self.setBoxClass(target.box, "accadd_error", "");
        }else{
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
            obj.backPage = "announcement";
            parentClass.dispatchEvent("showAlertMsg", obj);
        } else if (code == "err_cash_sw") {
            var obj = new Object();
            obj.msg = msg;
            obj.backPage = "announcement";
            parentClass.dispatchEvent("showAlertMsg", obj);
        }
    }
    //=================錯誤訊息=================
}