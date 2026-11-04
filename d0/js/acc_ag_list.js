function acc_ag_list(_win, _dom, param){
    var _self = this;
    var supLevel = "su";
    var level = "ag";
    var subLevel = "mem";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var nullchar = "&nbsp;";
    var user_mlimit = -1;
    var magager_count = -1;
    var sort_type = "asc";
    var sort_name = "username";
    var sortObj = new Object();
    var _mc = new Object();
    _mc["credits"] = new Object();
    _mc["status"] = new Object();
    var create_btn_first = false;
    var credit_old;
    var account_status;
    var _nowEdit = "";                  //當下正在修改的下層
    var paramObj = param;
    var isParsed = false;
    var ClassName = "acc_ag_list";
    var keepScrollTop = 56;
    var overScrollTop = 56;
    var dataHash = null;
    var lazy_sw = null;
    var lazy_count = null; //every page count
    var lazy_page = null;
    var lazy_total_page = null;
    var lazy_loading = false;
    var scroll_e = null;
    var cancel_reload = false ;
    _self.init=function(){
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "account" });
        //util.echo("acc_su_list html completed");
        _mc["getHttp"] = new HttpRequest();
        _mc["getHttp"].addEventListener("LoadComplete", _self.doLoadComplete);
        //account_status 篩選帳戶狀態&用戶收尋&新增該層用戶
        try {
            account_status = new win.account_status(win, dom);
            account_status.setParentclass(_self);
            account_status.setTopParent(parentClass);
            var up_enable = "Y" //帳戶狀態預設值為 啟用
            var up_paytype = "ALL" //額度模式預設值為 全部
            if(typeof paramObj!="undefined"){
                account_status.setParam(paramObj);
                up_enable = (typeof paramObj.up_enable !="undefined") ? paramObj.up_enable : "Y";
                up_paytype = (typeof paramObj.up_paytype !="undefined") ? paramObj.up_paytype : "ALL";
            }
            account_status.init();
            account_status.setEnable(up_enable);
            account_status.setPaytype(up_paytype);
        } catch (e) {
            util.err("[alert_msg]", e);
        }
        //account_status 篩選帳戶狀態&用戶收尋&新增該層用戶
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, dom.getElementById("div_show"));
        _self.loadData();
        util.echo("get_acc_" + level +"_list finish");
        _self.initMenu();
        _self.initLazy();
    }

    _self.initMenu = function () {
        var hash = new Object();
        hash["view_layer"] = level;
        var txt = JSON.stringify(hash);
        parentClass.dispatchEvent("chgPageName", { "pageType": "account", "url_hash": txt });
    }

    //load data
    _self.loadData = function () {
        cancel_reload = false;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.dataCompele);
        getHTML.loadURL(top.url, "POST", _self.getParam());
    }

    _self.dataCompele = function(data){
        dataHash = data;
        var arr_data = JSON.parse(data);
        _self.reSetLazy(arr_data["account"]);
        _self.parseData(data);

        var _history_num = win._history.length;
        if (_history_num > 1) {
            win._history[_history_num - 1].state.postHash = { "up_id": account_status.getUpperLayerId_sql(), "up_username": account_status.getUpperLayerName() };
        }
    }

    _self.getParam=function(){
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&user_name=" + account_status.getSearchName();
        urlParams += "&enable=" + account_status.getEnable();
        urlParams += "&sort_type=" + sort_type;
        urlParams += "&sort_name=" + sort_name;
        urlParams += "&up_id=" + account_status.getUpperLayerId_sql();
        urlParams += "&pay_type=" + account_status.getPaytype();
        urlParams += "&langx=" + top.langx;
        urlParams = "p=get_acc_" + level+"_list&ver=" + top.ver + "&" + urlParams;
		return urlParams;
	}

    //reload
    _self.reloadEventHandler = function () {
        isParsed = false;
        if (_nowEdit!=""){
            _self.closeDivEvent();
        }
        _self.loadData();
    }

    _self.parseData = function (data) {
        try {
            var arr_data = JSON.parse(data);

            if (arr_data.sub_user_data!=null) {
                magager_count = arr_data.sub_user_data.magager_count;
                user_mlimit = arr_data.sub_user_data.user_mlimit;
            }

            var bodyTemp = "";//存放body
            var outdata = "";//輸出資料
            var div_show = dom.getElementById("div_show");//show div

            //modle
            var xmp_header = dom.getElementById("xmp_header").innerHTML;//modle header
            var xmp_contant = dom.getElementById("xmp_contant").innerHTML;//modle contant

            if (arr_data["account"].length > 0) {
                var s = 0;
                var e = 0;
                if(lazy_sw){
                    s = (lazy_page - 1) * lazy_count;

                    e = (lazy_page == lazy_total_page) ? arr_data["account"].length  : lazy_page*lazy_count;
                }else{
                    s = 0;
                    e = arr_data["account"].length;
                }
                for (var i = 0; i < e; i++) {
                    var contanttmp = xmp_contant;//clone contant 資料
                    var obj = arr_data["account"][i];
                    var passwd_safe = obj["passwd_safe"];

                    if (util.showTxt(passwd_safe) == "") passwd_saf = nullchar;
                    contanttmp = contanttmp.replace(/\*ID\*/g, util.showTxt(obj["id"]));
                    contanttmp = contanttmp.replace(/\*USERNAME\*/g, util.showTxt(obj["username"]));
                    contanttmp = contanttmp.replace(/\*ALIAS\*/g, util.showTxt(obj["alias"]));
                    contanttmp = contanttmp.replace(/\*PASSWD_SAFE\*/g, util.showTxt(passwd_safe));
                    contanttmp = contanttmp.replace(/\*MAXCREDIT\*/g, util.mprintf(util.showTxt(obj["maxcredit"]) * 1, 0, 2, false, true));
                    contanttmp = contanttmp.replace(/\*LOWER_COUNT\*/g, util.showTxt(obj["lower_mem_count"]));
                    contanttmp = contanttmp.replace(/\*ADDDATE\*/g, util.showTxt(obj["adddate"]));
                    contanttmp = contanttmp.replace(/\*PAY_TYPE\*/g, util.showTxt(LS.get("pay_type_"+obj["pay_type"])));
                    //contanttmp = contanttmp.replace(/\*ENABLE\*/g, LS.get("enable_" + util.showTxt(obj["enable"])));
                    bodyTemp += contanttmp;
                }
            } else {
                bodyTemp = dom.getElementById("xmp_no_data").innerHTML;
            }

            outdata = xmp_header + bodyTemp;
            div_show.innerHTML = outdata;
            _self.initEvent(arr_data, div_show);
            _self.setLzayLoadingVisible(false);
            _self.scroll_ver_event(scroll_e, dom.getElementById("body_show"));
            //console.log(top.login_layer,isParsed);
            var old_exists = true;
            if(top.login_layer!="su" && !isParsed) old_exists = account_status.setUpperLayer(arr_data["uplayer_user"]);
            isParsed = true;

            if (!old_exists){
                _self.loadData() ;
            }
            // 收掉整頁loading
            parentClass.dispatchEvent("showLoading", { "showLoading": false });

        } catch (e) {
            util.echo(e);
        }

    }

    //init event
    _self.initEvent = function (ArrObj, div_show) {
        var s = 0;
        var e = 0;
        if(lazy_sw){
            s = (lazy_page - 1) * lazy_count;
            e = (lazy_page == lazy_total_page) ? ArrObj["account"].length  : lazy_page*lazy_count;
        }else{
            s = 0;
            e = ArrObj.length;
        }
        for (var i = 0; i < e; i++) {
            //下層資料
            // var obj = Object.assign({}, ArrObj["account"][i]); ie 不支援
            var obj = util.clone(ArrObj["account"][i]);
            var div = dom.getElementById("div_" + obj["id"]);
            var obj_ids = ",span_credit,span_enable,btn_edit,btn_add,btn_unlock,btn_user,change_credits_box,change_status_box,";
            var _ary = util.getObjAry(div, obj_ids);

            if (obj["longerr"] == "Y") {
                _ary["btn_unlock"].style.display = "";
                util.addEvent(_ary["btn_unlock"], "click", _self.unlockEvent, obj);
            } else {
                _ary["btn_unlock"].style.display = "none";
                util.removeEvent(_ary["btn_unlock"], "click");
            }

            //更改帳戶狀態
            // var ubj = Object.assign({}, ArrObj["account"][i]); ie 不支援
            var ubj = util.clone(ArrObj["account"][i]);
            var obj_ids = ",sel_view,sel_list,sel_text,span_enable,sel_768,";
            var _sstatus = util.getObjAry(_ary["change_status_box"], obj_ids);
            _sstatus["change_status_box"] = _ary["change_status_box"];
            ubj.saveType = "status";
            _sstatus["account"] = ubj;

            if (ubj.enable != "Y") {
                var li_arr = _sstatus["sel_list"].getElementsByTagName("li");
                for (var _i = 0, end = li_arr.length; _i < end; _i++) {
                    if (!(li_arr[_i].id == "Y" || li_arr[_i].id == ubj.enable)) {
                        li_arr[_i].style.display = "none";
                    }
                }
            }

            _sstatus["Select"] = new win.ClassSelect(win, dom);
            _sstatus["Select"].setParentclass(_self);
            _sstatus["Select"].setSelCss("drop_down_on", "", false);
            _sstatus["Select"].init(_sstatus["sel_text"], _sstatus["sel_list"], _sstatus["change_status_box"], _sstatus["span_enable"]);
            _sstatus["Select"].setSelected(ubj["enable"]);
            if (_sstatus["sel_768"] != null) _sstatus["Select"].creatSelOpt(_sstatus["sel_768"]);
            if (!(top.user_type != "1" && top.pri_type.indexOf("B1") == -1)) {
                _sstatus["Select"].addEvent("ONOPEN", _self.show_status_box, ubj);
                _sstatus["Select"].addEvent("ONCLOSE", _self.close_status_box, ubj);
                _sstatus["Select"].addEvent("ONCHANGE", _self.saveEvent, ubj);
                _mc["status"][ubj.id] = _sstatus;
            } else {
                _sstatus["Select"].setDisabled(true);
                // 沒有管理帳戶(更改和觀看)權限, 可修改的三角形要隱藏
                util.classFunc(_sstatus["change_status_box"], "_no_purview");
            }
            //更改帳戶狀態

            if (!(top.user_type != "1" && top.pri_type.indexOf("B1") == -1)){
                util.addEvent(_ary["btn_edit"], "click", _self.editEventPrev, obj);
                util.addEvent(_ary["btn_add"], "click", _self.addEventPrev, obj);
            }
            if (!(top.user_type != "1" && top.pri_type.indexOf("B2") == -1)) {

                //更改信用額度
                // var ubj = Object.assign({}, ArrObj["account"][i]); ie 不支援
                var ubj = util.clone(ArrObj["account"][i]);
                var obj_ids = ",view_credits_box,btn_close,save_btn,current_txt,new_credits" + ubj.id + ",error_note,error_txt,";
                var _ccredit = util.getObjAry(_ary["change_credits_box"], obj_ids);
                _ccredit["new_credits"] = _ccredit["new_credits" + ubj.id];
                _ccredit["change_credits_box"] = _ary["change_credits_box"];
                ubj.saveType = "credits";
                ubj._ccredit = _ccredit ;
                _ccredit["account"] = ubj;

                _mc["credits"][ubj.id] = _ccredit;
                util.addEvent(_ccredit["btn_close"], "click", _self.closeDivEvent, ubj);
                util.addEvent(_ccredit["save_btn"], "click", _self.saveEvent, ubj);
                util.ChkKeyCash(_ccredit["new_credits"], { initShow: _self.initCreditShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits, param:_ccredit });
                util.addEvent(_ccredit["new_credits"], "keydown", _self.keep_credit, _ccredit["new_credits"],false);
                //更改信用額度

                util.addEvent(_ary["span_credit"], "click", _self.showCreditEvent, _ccredit);
            }else{
                // 沒有修改額度權限, 可修改的三角形要隱藏
                util.classFunc(_ary["change_credits_box"], "_no_purview");
            }
            _ary["span_enable"].enable = obj.enable;
            util.addEvent(_ary["btn_user"], "click", _self.listEvent, { "acc_id": obj["id"], "acc_username": obj["username"], "acc_enable": obj["enable"], "pay_type": obj["pay_type"] });
            _self.chkUserEnable(_ary["span_credit"], _ary["span_enable"], _ary["btn_edit"], _ary["btn_add"], _ary["btn_unlock"]);
        }

        // var btn_more = dom.getElementById("btn_more");
        // if (ArrObj["view_more"] == "Y") {  //show
        //     util.addEvent(btn_more, "click", _self.viewMoreEvent, null);
        //     btn_more.style.display = "";
        // } else {
        //     util.removeEvent(btn_more, "click");
        //     btn_more.style.display = "none";
        // }

        var objids = ",title_username,title_alias,title_maxcredit,title_ag_count,title_mem_count,title_adddate,";
        var ary = util.getObjAry(div_show, objids);

        if (ArrObj["account"].length > 0) {
            for (key in ary) {
                var _type = "empty";

                if (sortObj[key] == null) {
                    //first time load def sort
                    if (key == "title_" + sort_name) {
                        _type = sort_type;
                    }
                } else {
                    _type = sortObj[key].type;
                }
                sortObj[key] = ary[key];
                sortObj[key].name = key.split("_")[1];
                sortObj[key].type = _type;

                var sty = _self.getSortClass(sortObj[key].type);
                util.setObjectClass(sortObj[key], sty);
                util.addEvent(sortObj[key], "click", _self.sortEvent, sortObj[key]);
            }
            var choseObj = sortObj["title_" + sort_name];
            var choseSty = _self.getSortClass(choseObj.type);
            util.setObjectClass(choseObj, choseSty);
        }
        keepScrollTop = dom.getElementById("ph_search_class").offsetHeight;
        overScrollTop = dom.getElementById("ph_search_class").offsetHeight;
    }

    _self.sortEvent = function (mouseEvent, targetObj) {
        var _type = targetObj.type;
        for (key in sortObj) {
            sortObj[key].type = "empty";
        }
        targetObj.type = _self.transSortStatus(_type);
        sort_type = targetObj.type;
        sort_name = targetObj.name;
        _self.loadData();
    }

    _self.transSortStatus = function (_status) {
        var hash = new Object();
        hash["empty"] = "asc";
        hash["asc"] = "desc";
        hash["desc"] = "asc";
        return hash[_status];
    }

    _self.chkUserEnable = function (span_credit, span_enable, btn_edit, btn_add, btn_unlock) {
        var showType = "";

        //登入帳號的權限
        if (top.user_enable == "Y") {
            showType = "";
        } else {
            showType = "none";

            util.removeEvent(span_credit, "click");
            util.removeEvent(span_enable, "click");
            util.removeEvent(btn_edit, "click");
            util.removeEvent(btn_add, "click");
            util.removeEvent(btn_unlock, "click");
        }
        span_credit.style.display = showType;
        span_enable.style.display = showType;
        btn_edit.style.display = showType;
        btn_add.style.display = showType;
        btn_unlock.style.display = (btn_unlock.style.display == "") ? showType : btn_unlock.style.display;

        //帳號管理 每一筆帳號的賬號狀態
        if (span_enable.enable != "Y") {
            btn_add.style.display = "none";
            util.removeEvent(btn_add, "click");
        }
    }

    _self.getSortClass = function (_status) {
        var hash = new Object();
        hash["empty"] = "acc_sort";
        hash["asc"]   = "acc_sort acc_sort_down";
        hash["desc"]  = "acc_sort acc_sort_up";
        return hash[_status];
    }

    _self.showCreditEvent = function (mouseEvent, _ccredit) {
        //_self.closeDivEvent();
        var account = _ccredit.account;
        _nowEdit = account;

        credit_old = account.maxcredit;
        _ccredit["new_credits"].value = util.mprintf(account.maxcredit * 1, 0, 2, false, true);
        _ccredit["current_txt"].innerHTML = util.mprintf(account.avaliable_credit * 1, 0, 2, false, true);
        util.classFunc(_ccredit["error_note"], "error_credits", "remove");
        //util.classFunc(_ccredit["change_credits_box"], "on");

        var param = {};
        param._focus = _ccredit["view_credits_box"];
        param._setView = _ccredit["change_credits_box"];
        param._viewClass = "on";
        util.showInfEvent(mouseEvent, { "icon": mouseEvent.target, "param": param });
    }

    _self.closeDivEvent = function () {
        for (key in _mc["credits"]) {
            if (_mc["credits"][key]!=null)
            util.classFunc(_mc["credits"][key]["change_credits_box"], "on", "remove");
        }
        for (key in _mc["status"]) {
            if (_mc["status"][key] != null)
                util.classFunc(_mc["status"][key]["change_status_box"], "on", "remove");
        }
        credit_old = null;
        _nowEdit = "";
        if(cancel_reload){
            _self.loadData();
        }
    }

    _self.saveEvent = function (mouseEvent, account) {
        _nowEdit = account;
        if (!_self.submitCheck(account)) return;

        var sendCode = "";
        sendCode += "uid=" + top.uid;
        sendCode += "&login_layer=" + top.login_layer;

        if (account.saveType == "credits") {
            sendCode += "&sid=" + account.id;
            sendCode += "&langx=" + top.langx;
            sendCode += "&pay_type=" + account.pay_type;
            sendCode += "&now_maxcredit=" + account.maxcredit;
            sendCode += "&t_credit=" + _mc["credits"][account.id]["new_credits"].value.replace(/[^\d.]/g, '');

            parentClass.dispatchEvent("showLoading", { "showLoading": true });
            sendCode = "p=chg_"+level+ "_credit&" + sendCode;
            _mc["getHttp"].loadURL(top.url, "POST", sendCode);

        } else if (account.saveType == "status") {
            var selectValue = _mc["status"][account.id]["Select"].value();

            sendCode += "&sid=" + account.id;
            sendCode += "&pay_type=" + account.pay_type;
            if (account.enable != "F") {
                sendCode += "&enable=" + selectValue;
            }

            if (account.enable == "Y" && selectValue == "F") {
                sendCode += "&enable_pri=N";
            } else if (account.enable == "F" && selectValue == "Y") {
                sendCode += "&enable_pri=Y";
            }

            if ((account.enable == "S" || account.enable == "F") && selectValue){
                sendCode += "&status=S";
            }

            parentClass.dispatchEvent("showLoading", { "showLoading": true });
            sendCode = "p=chg_" + level + "_status&" + sendCode;
            _mc["getHttp"].loadURL(top.url, "POST", sendCode);
        }
    }

    _self.submitCheck = function (acc) {
        if (typeof (_mc["credits"][acc.id]) != 'undefined') {
            util.classFunc(_mc["credits"][acc.id]["error_note"], "error_credits", "remove");
        }

        if (acc.saveType == "credits") {
            var new_credits = _mc["credits"][acc.id]["new_credits"].value.replace(/[^\d.-]/g, '');
            if (new_credits == "") {
                _self.showError(acc.saveType, "empty_credit");
                return false;
            } else if (!util.checkFormat(new_credits.replace(/,/g, ''), 1)) {
                if (acc.pay_type == 1 && util.checkFormat(new_credits.replace(/[\,\.]/g, ''), 1) ){
                    // 現金帳號允許輸入小數點
                } else {
                    if (new_credits * 1 == acc.maxcredit) {
                        // 現金帳號原額度為負數 沒經過異動
                    } else {
                        _self.showError(acc.saveType, "str_maxcre");
                        return false;
                    }
                }
            } else if (new_credits.replace(/[^\d.-]/g, '') * 1 == 0 && acc.pay_type == 0) {
                _self.showError(acc.saveType, "str_maxcre_zero");
                return false;
            }
        } else if (acc.saveType == "status") {

        }

        return true;
    }

    _self.showError = function (types,code) {
        if (types == "credits"){
            if (code == "str_maxcre_zero") {
                if(top.langx != "en-us"){
                    code = LS.get(code+"1") + "," + LS.get(code) + ".";
                }else{
                    code = LS.get(code) + LS.get(code+"1");
                }
            } else {
                code = LS.get(code);
            }

            _mc[types][_nowEdit.id]["error_txt"].innerHTML = code;
            util.classFunc(_mc[types][_nowEdit.id]["error_note"], "error_credits");
        }
    }

    _self.doLoadComplete = function (data) {
        try {
            var arr_data = JSON.parse(data);
            //_self.addEventListener("MouseEvent.CLICK", _self.saveEvent, _mc["save_btn"]);
            create_btn_first = true;
            //var _status = util.showTxt(xmlnode.getNodeVal(xmlnode.Node(xmlnodeRoot, "status")));
            if (util.chkErrorMsg(arr_data, LS_code)) return;

            var code = arr_data.code;
            var msg  = arr_data.msg;

            if (code != null && code != "") {
                parentClass.dispatchEvent("showLoading", { "showLoading": false });

                switch (code) {
                    case "Err_credits":
                        var codeAry = code.split("_");
                        _mc[codeAry[1]][_nowEdit.id]["error_txt"].innerHTML = msg;
                        util.classFunc(_mc[codeAry[1]][_nowEdit.id]["error_note"], "error_credits");
                        break;
                    case "Err_credits_chg":
                        // 如額度被異動過, 顯示錯誤訊息並更新為新的值
                    case "Err_credits_avaliable":
                        // 上層剩餘額度不夠時 更新顯示的剩餘額度
                        var codeAry = code.split("_");
                        _mc[codeAry[1]][_nowEdit.id]["error_txt"].innerHTML = msg;
                        util.classFunc(_mc[codeAry[1]][_nowEdit.id]["error_note"], "error_credits");

                        _nowEdit._ccredit["current_txt"].innerHTML = util.mprintf(arr_data.avaliable_credit * 1, 0, 2, false, true) ;
                        _nowEdit.avaliable_credit = arr_data.avaliable_credit ;
                        _nowEdit.maxcredit = arr_data.old_maxcredit;
                        _nowEdit._ccredit["change_credits_box"].children[0].children[0].innerHTML = util.mprintf(util.showTxt(arr_data.old_maxcredit) * 1, 0, 2, false, true);
                        _nowEdit._ccredit["new_credits"].value = util.mprintf(arr_data.old_maxcredit * 1, 0, 2, false, true);
                        util.addEvent(_nowEdit._ccredit["save_btn"], "click", _self.saveEvent, _nowEdit);
                        cancel_reload = true;
                        break;
                    case "Err_status":
                        parentClass.dispatchEvent("showAlertMsg", arr_data);
                        _self.loadData();
                        break;
                    case "chgCreditSuccess":
                        if (arr_data.is_exceeded == "true") parentClass.dispatchEvent("showAlertMsg", { "_id": "credit_exceeded_pop" });
                    case "chgStatusSuccess":
                        var types = "credits";
                        if (code.indexOf("Credit") == -1) {
                            types = "status";
                            //account_status.setEnable(arr_data.chgStatus);
                            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("status_update") });
                        }
                        if (types == "credits"){
                            util.classFunc(_mc[types][_nowEdit.id]["error_note"], "error_credits", "remove");
                            _mc[types][_nowEdit.id]["error_txt"].innerHTML = "";
                            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("credit_update") });
                        }
                        var targetObj = new Object();
                        targetObj.saveType = types;
                        _self.closeDivEvent();
                        _self.loadData();
                        break;
                    case "longerrFail":
                    case "longerrSuccess":
                        parentClass.dispatchEvent("showFadeOutMesg", { "text": msg });
                        _self.loadData();
                        break;
                    case "errormsg|clean_db":
                        var targetObj = new Object();
                        targetObj.saveType = "credits";
                        _self.closeDivEvent();

                        // var tmp = code.split("|");
                        // _self.showErrorMsg(tmp[1], msg);
                        parentClass.dispatchEvent("showAlertMsg", arr_data);
                        break;
                    case "err_cash_sw":
                        _mc["credits"][_nowEdit.id]["error_txt"].innerHTML = msg;
                        util.classFunc(_mc["credits"][_nowEdit.id]["error_note"], "error_credits");
                        break;
                }
            }
        } catch (e) {
            util.echo(e);
        }
    }

    _self.ChkCreditErr = function (e, par) {
        _self.showError("credits", "str_maxcre");
    }

    _self.initCreditShow = function (e, par) {
        util.classFunc(_mc["credits"][_nowEdit.id]["error_note"], "error_credits", "remove");
    }

    _self.keep_credit = function (e, new_credits) {
        // credit_old = new_credits.value.replace(/\D/g, '');
        credit_old = new_credits.value.replace(/[^\d.]/g, '');
    }

    //信用額度轉換千位顯示
    _self.show_credits = function (e, _ccredit) {
        if (e.type == "input") {
            util.Replace_Input_credits(e.target, credit_old, e);
        } else {
            util.Replace_credits(e.target, credit_old, e);
        }
        // 即時計算剩餘額度
        if (e.target == _ccredit["new_credits"]) {
            var credit = _ccredit["new_credits"].value.replace(/[^\d.-]/g, '');
            _ccredit["current_txt"].innerHTML = util.mprintf((_ccredit["account"].avaliable_credit * 1 + _ccredit["account"].maxcredit * 1 - credit * 1), 0, 2, false, true);
        }
    }

    _self.getBaseParam = function () {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&langx="+top.langx;
        return par;
    }



    //edit
    _self.editEventPrev = function (mouseEvent, param) {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.editEvent);
        var tmp_obj = {};
        tmp_obj.id = param.id;
        tmp_obj.user_id = param.user_id;
        tmp_obj.username = param.username;
        tmp_obj.up_id = account_status.getUpperLayerId_sql();
        tmp_obj.up_username = account_status.getUpperLayerName();
        tmp_obj.user_type = param.user_type;
        tmp_obj.enable = param.enable;
        tmp_obj.pay_type = param.pay_type;
        var txt = JSON.stringify(tmp_obj)
        var param = _self.getBaseParam() + "&keys=editAccount" + "&txt=" + txt;
        param = "p=prevData&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.editEvent = function (data) {
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        var arr_data = JSON.parse(data);
        if (util.chkErrorMsg(arr_data, LS_code)) return;
        var paramHash = new Object();
        paramHash["edit_id"] = arr_data.id;
        paramHash["user_id"] = arr_data.user_id;
        paramHash["up_id"] = arr_data.up_id;
        paramHash["up_username"] = arr_data.up_username;
        paramHash["edit_username"] = arr_data.username;
        paramHash["edit_type"] = arr_data.user_type;
        paramHash["edit_enable"] = arr_data.enable;
        paramHash["pay_type"] = arr_data.pay_type;
        paramHash["back_page"] = ClassName;

        var obj = new Object();
        obj["page"] = "acc_" + level + "_edit";
        obj["postHash"] = paramHash;
        parentClass.dispatchEvent("bodyGoToPage", obj);
    }

    //add
    _self.addEventPrev = function (mouseEvent, _param) {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.addEvent);
        var tmp_obj = {};
        tmp_obj.id = _param.id;
        tmp_obj.username = _param.username;
        tmp_obj.pay_type = _param.pay_type;
        var txt = JSON.stringify(tmp_obj);
        var param = _self.getBaseParam() + "&keys=addAccount" + "&txt=" + txt;
        param = "p=prevData&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }
    _self.addEvent = function (data) {
        var arr_data = JSON.parse(data);
        if (util.chkErrorMsg(arr_data, LS_code)) return;
        var obj = new Object();
        var paramHash = new Object();
        paramHash["up_id"] = arr_data.id;
        paramHash["up_user"] = arr_data.username;

        if (typeof (paramObj) == "undefined" || (paramObj.up_id != account_status.getUpperLayerId_sql())) {
            var back_param = new Object();
            back_param["up_id"] = account_status.getUpperLayerId_sql();
            back_param["up_username"] = account_status.getUpperLayerName();
            paramHash["back_param"] = back_param;

        } else {
            paramHash["back_param"] = paramObj;
        }
        paramHash["pay_type"] = arr_data.pay_type;
        paramHash["back_page"] = ClassName;
        obj.page = "acc_"+subLevel+"_add";
        obj.postHash = paramHash;
        parentClass.dispatchEvent("bodyGoToPage", obj);
    }

    //unlock
    _self.unlockEvent = function (mouseEvent, paramObj) {
        var sendCode = "";
        sendCode += _self.getBaseParam();
        sendCode += "&level=" + level + "_user";
        sendCode += "&level_id=" + paramObj.id;//套別層時需要修改
        sendCode += "&pay_type=" + paramObj.pay_type;
        sendCode = "p=longerr_Edit&" + sendCode;
        _mc["getHttp"].loadURL(top.url, "POST", sendCode);
    }

    //add account
    _self.addAccountEventHandler = function (paramObj) {
        if (magager_count != -1 && user_mlimit != -1 && magager_count * 1 >= user_mlimit * 1) {
            var msg = LS.get("sub_selMax");
            parentClass.dispatchEvent("showAlertMsg", { msg: msg });
        } else {
            parentClass.dispatchEvent("bodyGoToPage", paramObj);
        }
    }

    _self.show_status_box = function (e, obj) {
        _self.closeDivEvent();
        var ubj = _mc["status"][obj.id];
        if (!ubj["change_status_box"].classList.contains("on")) {
            ubj["change_status_box"].classList.add("on");
            _nowEdit = ubj["account"];
            setTimeout(function () { ubj["sel_list"].focus() }, 500);
        }
    }

    _self.close_status_box = function (e, obj) {
        var ubj = _mc["status"][obj.id];
        if (ubj["change_status_box"].classList.contains("on")) {
            ubj["change_status_box"].classList.remove("on");
            _nowEdit = "";
        }
    }

    _self.loadingFun=function(show){
        parentClass.dispatchEvent("showLoading", { "showLoading": show });
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
        scroll_e = e;
        _self.scroll_ver_event(e, target);
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
    }

    //離開此頁移除事件
    _self.exitEvent = function () {
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        return true;
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    _self.listEvent=function(mouseEvent, targetObj){
        var paramHash = new Object();
        paramHash["up_id"] = targetObj.acc_id;
        paramHash["up_username"] = targetObj.acc_username;
        paramHash["up_enable"] = targetObj.acc_enable;
        paramHash["pay_type"] = targetObj.pay_type;

        var param = new Object();
        param["page"] = "acc_mem_list";
        param["postHash"] = paramHash;

        parentClass.dispatchEvent("bodyGoToPage", param);

    }

    _self.scroll_ver_event = function (e, targetObj) {
        if (e == null || !dom.getElementById("scroll_div")) return;
        var newScrollTop = e.target.scrollTop;
        var ori_h = e.target.scrollHeight;
        var now_h = 0;
        var func_h = dom.getElementById("scroll_div").clientHeight;

        if (newScrollTop > func_h) {
            // util.classFunc(targetObj, "report_fixed");
            now_h = e.target.scrollHeight;
            if (now_h != 0) stop_h = func_h - (ori_h - now_h);

        }
        // console.log("[newScrollTop] = "+newScrollTop+"  [stop_h] = "+stop_h);
        if(newScrollTop <= func_h){
            // util.classFunc(targetObj, "report_fixed", "remove");
            // e.target.scrollTop = func_h;
        }

        _self.checkShowLazyLoading(e.target);
    }


    //============ lazy loading ============

    _self.checkShowLazyLoading = function(target){
        if(!lazy_sw) return;
        var newScrollTop = target.scrollTop;
        var s_h = target.scrollHeight;
        var c_h = target.clientHeight;
        var scroll_bottom = (newScrollTop >= ((s_h-c_h)-10) );

        // util.echo("[checkShowLazyLoading]["+scroll_bottom+"]"+newScrollTop+"=="+s_h+"-"+c_h);

        if(scroll_bottom && !lazy_loading){
            // util.echo("[checkShowLazyLoading]"+lazy_page+"<"+lazy_total_page);
            if(lazy_page < lazy_total_page){
                _self.setLzayLoadingVisible(true);
                retryTimer = setTimeout(_self.loadLazyData, 300);
            }
        }
    }

    _self.setLzayLoadingVisible = function(isShow){
        if(!lazy_sw) return;
        lazy_loading = isShow;
        dom.getElementById("report_loading").style.display = (isShow)? "" : "none";
    }

    _self.loadLazyData = function(){
        if(!lazy_sw) return;
        lazy_loading = true;
        if(lazy_page < lazy_total_page){
            lazy_page++;
            _self.parseData(dataHash);
        }
    }

    _self.initLazy = function(){
        lazy_sw = config_set.get("LAZY_SW") || false;
        lazy_page = 1;
        lazy_total_page = 1;

        var lazy_cnt = (getView().viewportheight > 700) ? "LAZY_COUNT_BIG_PAGE" : "LAZY_COUNT";
        lazy_count = config_set.get(lazy_cnt) || 10;

        // util.echo("[init lazy]"+getView().viewportheight+",lazy_count="+lazy_count);
    }

    _self.reSetLazy = function(row0){
        _self.initLazy();
        lazy_total_page = row0 ? Math.ceil(row0.length / lazy_count) : 1;
        if(lazy_total_page <= 0 ) lazy_total_page = 1;
    }
    //============ lazy loading ============
}
