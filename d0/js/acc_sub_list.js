function acc_sub_list(_win, _dom, param){
    var _self = this;
    var level = "sub";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var sort_type = "asc";
    var sort_name = "username";
    var account_status;
    var paramObj = param;
    var ClassName = "acc_sub_list";
    var nowDeleteSub = "";

    var _mc = new Object();
    var sortObj = new Object();
    var pri_ary = new Array("A", "B", "B1", "B2", "C");
    var sub_max = -1;
    var sub_count = -1;
    var keepScrollTop = 56;
    var overScrollTop = 56;
    var dataHash = null;
    var lazy_sw = null;
    var lazy_count = null; //every page count
    var lazy_page = null;
    var lazy_total_page = null;
    var lazy_loading = false;
    var scroll_e = null;
    var up_userData = Array();
    _self.init=function(){
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "account" });
        //util.echo("acc_sub_list html completed");
        _mc["getHttp"] = new HttpRequest();
        _mc["getHttp"].addEventListener("LoadComplete", _self.doLoadComplete);
        _mc["system_msg_contain"] = dom.getElementById("system_msg_contain");
        _mc["cancel_btn"] = dom.getElementById("cancel_btn");
        _mc["save_btn"] = dom.getElementById("save_btn");

        //account_status 篩選帳戶狀態&用戶收尋&新增該層用戶
        try {
            account_status = new win.account_status(win, dom);
            account_status.setParentclass(_self);
            account_status.setTopParent(parentClass);
            if(typeof paramObj!="undefined") account_status.setParam(paramObj);
            account_status.init();
        } catch (e) {
            util.err("[alert_msg]", e);
        }
        //account_status 篩選帳戶狀態&用戶收尋&新增該層用戶
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, dom.getElementById("div_show"));
        _self.loadData();
        _self.initMenu();
        _self.initLazy();
        util.echo("get_acc_" + level +"_list finish");
    }

    _self.initMenu = function () {
        parentClass.dispatchEvent("chgPageName", { "pageType": "account", "pageName": level });
    }

    _self.closeDivEvent = function (mouseEvent, targetObj) {
        _mc["system_msg_contain"].style.display = "none";
        nowDeleteSub = "";
    }

    //load data
    _self.loadData = function () {
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
    }

    _self.getParam = function () {
        var par = "";
        par += "uid=" + top.uid;
        par += "&user_name=" + account_status.getSearchName();
        par += "&login_layer=" + top.login_layer;
        par += "&sort_type=" + sort_type;
        par += "&sort_name=" + sort_name;
        par = "p=get_acc_" + level + "_list&ver=" + top.ver + "&" + par;
        return par;
    }

    _self.parseData = function (data) {
        try {
            var arr_data = JSON.parse(data);

            if (util.chkErrorMsg(arr_data, LS_code)) return;

            var bodyTemp = "";//存放body
            var outdata = "";//輸出資料
            var div_show = dom.getElementById("div_show");//show div

            //modle
            var xmp_header = dom.getElementById("xmp_header").innerHTML;//modle header
            var xmp_contant = dom.getElementById("xmp_contant").innerHTML;//modle contant

            sub_max = arr_data.sub_max;
            sub_count = arr_data.account.length;

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

                    contanttmp = contanttmp.replace(/\*ID\*/g, util.showTxt(obj["id"]));
                    contanttmp = contanttmp.replace(/\*USERNAME\*/g, util.showTxt(obj["username"]));
                    contanttmp = contanttmp.replace(/\*ALIAS\*/g, util.showTxt(obj["alias"]));
                    contanttmp = contanttmp.replace(/\*PW\*/g, util.showTxt(obj["pw"]));
                    contanttmp = contanttmp.replace(/\*ADDDATE\*/g, util.showTxt(obj["adddate"]));

                    contanttmp = contanttmp.replace(/\*pri_A\*/g, util.showTxt("icon_" + obj["pri_A"]+"use"));
                    contanttmp = contanttmp.replace(/\*pri_B\*/g, util.showTxt("icon_" + obj["pri_B"] + "use"));
                    contanttmp = contanttmp.replace(/\*pri_B1\*/g, util.showTxt("icon_" + obj["pri_B1"] + "use"));
                    contanttmp = contanttmp.replace(/\*pri_B2\*/g, util.showTxt("icon_" + obj["pri_B2"] + "use"));
                    contanttmp = contanttmp.replace(/\*pri_C\*/g, util.showTxt("icon_" + obj["pri_C"] + "use"));
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
            parentClass.dispatchEvent("showLoading", { "showLoading": false });
        } catch (e) {
            util.echo(e);
        }

    }

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
            // var obj = Object.assign({}, ArrObj["account"][i]); ie 不支援
            var obj = util.clone(ArrObj["account"][i]);
            if (top.login_layer == "ag") {
                obj["pay_type"] = ArrObj["pay_type"] ;
            }
            var div = dom.getElementById("div_" + obj["id"]);

            var obj_ids = ",btn_edit,btn_delete,btn_unlock,";
            var _ary = util.getObjAry(div, obj_ids);

            var pri = "";
            for (var j = 0; j < pri_ary.length; j++) {
                var p = obj["pri_" + pri_ary[j]];
                if (p == "ok") {
                    if (pri != "") pri += "-";
                    pri += pri_ary[j];
                }
            }
            obj.pri = pri;
            obj.back_page = ClassName;
            util.addEvent(_ary["btn_edit"], "click", _self.editEventPrev, obj);
            util.addEvent(_ary["btn_delete"], "click", _self.deleteEvent, obj);

            //CRP-37 AG/超帳子帳號密碼錯誤封鎖,改密碼要自動解封
            if (obj.longerr == "Y") {
                _ary["btn_unlock"].style.display = "";
                util.addEvent(_ary["btn_unlock"], "click", _self.unlockEvent, obj);
            } else {
                _ary["btn_unlock"].style.display = "none";
                util.removeEvent(_ary["btn_unlock"], "click");
            }
        }

        var objids = ",title_username,title_alias,title_adddate,";
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

        util.addEvent(_mc["cancel_btn"], "click", _self.closeDivEvent, _mc["cancel_btn"]);
        util.addEvent(_mc["save_btn"], "click", _self.saveEvent, _mc["save_btn"]);
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

    _self.getSortClass = function (_status) {
        var hash = new Object();
        hash["empty"] = "acc_sort";
        hash["asc"] = "acc_sort acc_sort_down";
        hash["desc"] = "acc_sort acc_sort_up";
        return hash[_status];
    }

    //reload
    _self.reloadEventHandler = function () {
        _self.loadData();
    }

    //add account
    _self.addAccountEventHandler = function (paramObj) {
        if (sub_max != -1 && sub_count >= sub_max) {
            var msg = LS.get("max_sub3");
            parentClass.dispatchEvent("showAlertMsg", { msg: msg });
        } else {
            parentClass.dispatchEvent("bodyGoToPage", paramObj);
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
    _self.editEventPrev = function (mouseEvent, paramObj) {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.editEvent);
        var txt = JSON.stringify(paramObj)
        var param = _self.getBaseParam() + "&keys=addAccount" + "&txt=" + txt;
        param = "p=prevData&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }
    _self.editEvent = function (data) {
        var arr_data = JSON.parse(data);
        if (util.chkErrorMsg(arr_data, LS_code)) return;
        var obj = new Object();
        obj.postHash = arr_data;
        obj.page = "acc_" + level + "_edit";
        parentClass.dispatchEvent("bodyGoToPage", obj);
    }

    //delete
    _self.deleteEvent = function (mouseEvent, paramObj) {
        nowDeleteSub = paramObj;
        _mc["system_msg_contain"].style.display = "";
    }

    //unlock
    _self.unlockEvent = function (mouseEvent, paramObj) {
        var sendCode = "";
        sendCode += "uid=" + top.uid;
        sendCode += "&level=" + top.login_layer + "_user";
        sendCode += "&login_layer=" + top.login_layer;
        sendCode += "&user_id=" + paramObj.id;//套別層時需要修改
        sendCode += "&master_id=" + paramObj.acc_id;
        sendCode += "&isSub=Y";
        sendCode += "&pay_type=" + paramObj.pay_type;
        sendCode += "&langx=" + top.langx;
        sendCode = "p=longerr_Edit&ver=" + top.ver + "&" + sendCode;
        _mc["getHttp"].loadURL(top.url, "POST", sendCode);
    }

    //save
    _self.saveEvent = function (mouseEvent, targetObj) {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var sendCode = "";
        sendCode += "uid=" + top.uid;
        sendCode += "&login_layer=" + top.login_layer;
        sendCode += "&master_id=" + nowDeleteSub.acc_id;
        sendCode += "&id=" + nowDeleteSub.id;
        if (top.login_layer=="ag")sendCode += "&pay_type=" + up_userData[nowDeleteSub.acc_id]["pay_type"];
        sendCode = "p=subUser_del&ver=" + top.ver + "&" + sendCode;
        _mc["getHttp"].loadURL(top.url, "POST", sendCode);
        _mc["system_msg_contain"].style.display = "none";
        _self.loadData();
    }

    _self.doLoadComplete = function (data) {
        var arr_data = JSON.parse(data);
        if (util.chkErrorMsg(arr_data, LS_code)) return;
        if (arr_data.code != null && arr_data.code != "") {
            parentClass.dispatchEvent("showLoading", { "showLoading": false });

            switch (arr_data.code) {
                case "longerrSuccess":
                    parentClass.dispatchEvent("showFadeOutMesg", { "text": arr_data.msg });
                    _self.closeDivEvent("", "");
                    _self.loadData();
                    break;
                case "deleteSuccess":
                    _self.closeDivEvent("", "");
                    _self.loadData();
                    break;
            }
        }
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