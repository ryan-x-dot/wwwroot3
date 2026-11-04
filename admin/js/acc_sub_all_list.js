function acc_sub_all_list(_win, _dom, param){
    var _self = this;
    var level = "sub_all";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var paramObj = param || {};

    var currentTab = "co";
    var currentPage = 1;
    var pageSize = 10;
    var foldStatus = {};
    var nowAction = null;
    var currentData = {
        "layer": "co",
        "page": 1,
        "page_size": 10,
        "total": 0,
        "page_total": 0,
        "list": []
    };

    var _mc = new Object();

    _self.init = function(){
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "account" });

        _mc["getHttp"] = new HttpRequest();
        _mc["getHttp"].addEventListener("LoadComplete", _self.doLoadComplete);

        _mc["div_show"] = dom.getElementById("div_show");
        _mc["input_search"] = dom.getElementById("input_search");
        _mc["btn_search"] = dom.getElementById("btn_search");
        _mc["btn_delete"] = dom.getElementById("btn_delete");

        _mc["tab_co"] = dom.getElementById("tab_co");
        _mc["tab_su"] = dom.getElementById("tab_su");
        _mc["tab_ag"] = dom.getElementById("tab_ag");

        _mc["page_info"] = dom.getElementById("page_info");
        _mc["btn_prev_page"] = dom.getElementById("btn_prev_page");
        _mc["btn_next_page"] = dom.getElementById("btn_next_page");

        _mc["system_msg_contain"] = dom.getElementById("system_msg_contain");
        _mc["confirm_msg"] = dom.getElementById("confirm_msg");
        _mc["cancel_btn"] = dom.getElementById("cancel_btn");
        _mc["save_btn"] = dom.getElementById("save_btn");

        _mc["tab_co"].innerHTML = "登1";
        _mc["tab_su"].innerHTML = "登2";
        _mc["tab_ag"].innerHTML = "登3";
        _mc["input_search"].setAttribute("placeholder", "搜索代理/子账号");

        _self.initMenu();
        _self.initEvent();
        _self.loadData();
    };

    _self.initMenu = function () {
        parentClass.dispatchEvent("chgPageName", { "pageType": "account", "pageName": level });
    };

    _self.initEvent = function(){
        util.addEvent(_mc["btn_search"], "click", _self.searchEvent, "");
        util.addEvent(_mc["btn_delete"], "click", _self.clearSearchEvent, "");
        util.addEvent(_mc["tab_co"], "click", _self.changeTabEvent, "co");
        util.addEvent(_mc["tab_su"], "click", _self.changeTabEvent, "su");
        util.addEvent(_mc["tab_ag"], "click", _self.changeTabEvent, "ag");
        util.addEvent(_mc["btn_prev_page"], "click", _self.prevPageEvent, "");
        util.addEvent(_mc["btn_next_page"], "click", _self.nextPageEvent, "");
        util.addEvent(_mc["cancel_btn"], "click", _self.closeConfirmEvent, "");
        util.addEvent(_mc["save_btn"], "click", _self.saveEvent, "");
    };

    _self.getBaseParam = function () {
        var par = "";
        par += "uid=" + top.uid;
        par += "&login_layer=" + top.login_layer;
        par += "&langx=" + top.langx;
        return par;
    };

    _self.getParam = function(){
        var par = _self.getBaseParam();
        par += "&layer=" + currentTab;
        par += "&page=" + currentPage;
        par += "&page_size=" + pageSize;
        par += "&user_name=" + encodeURIComponent(_mc["input_search"].value || "");
        par = "p=get_acc_" + level + "_list&ver=" + top.ver + "&" + par;
        return par;
    };

    _self.loadData = function(){
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.dataComplete);
        getHTML.loadURL(top.url, "POST", _self.getParam());
    };

    _self.onError = function(){
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        parentClass.dispatchEvent("showAlertMsg", { "msg": "请求失败" });
    };

    _self.dataComplete = function(data){
        try{
            var arr_data = JSON.parse(data);
            if (util.chkErrorMsg(arr_data, LS_code)) {
                parentClass.dispatchEvent("showLoading", { "showLoading": false });
                return;
            }

            currentData = arr_data || {};
            if(!currentData["list"]){
                currentData["list"] = [];
            }
            currentPage = currentData["page"] ? currentData["page"] * 1 : 1;

            _self.renderTab();
            parentClass.dispatchEvent("showLoading", { "showLoading": false });
        }catch(e){
            parentClass.dispatchEvent("showLoading", { "showLoading": false });
            util.echo(e);
        }
    };

    _self.renderTab = function(){
        _mc["tab_co"].className = "suball_tab" + (currentTab == "co" ? " on" : "");
        _mc["tab_su"].className = "suball_tab" + (currentTab == "su" ? " on" : "");
        _mc["tab_ag"].className = "suball_tab" + (currentTab == "ag" ? " on" : "");

        var list = currentData["list"] || [];
        var html = "";
        var xmp_group = dom.getElementById("xmp_group").innerHTML;
        var xmp_sub_row = dom.getElementById("xmp_sub_row").innerHTML;
        var xmp_no_sub = dom.getElementById("xmp_no_sub").innerHTML;
        var xmp_no_data = dom.getElementById("xmp_no_data").innerHTML;

        if(list.length <= 0){
            _mc["div_show"].innerHTML = xmp_no_data;
            _self.renderPager();
            return;
        }

        for(var i=0;i<list.length;i++){
            var g = list[i];
            var subRows = "";
            var subs = g["subs"] || [];
            var isOpen = foldStatus[g["parent_id"]] ? true : false;

            if(subs.length > 0){
                for(var j=0;j<subs.length;j++){
                    var s = subs[j];
                    var rowTmp = xmp_sub_row;
                    rowTmp = rowTmp.replace(/\*ID\*/g, util.showTxt(s["id"]));
                    rowTmp = rowTmp.replace(/\*USERNAME\*/g, util.showTxt(s["name"]));
                    rowTmp = rowTmp.replace(/\*ALIAS\*/g, util.showTxt(s["alias"]));
                    rowTmp = rowTmp.replace(/\*LOGINNAME\*/g, util.showTxt(s["loginname"]));
                    rowTmp = rowTmp.replace(/\*PW\*/g, util.showTxt(s["pw"]));
                    rowTmp = rowTmp.replace(/\*ADDDATE\*/g, util.showTxt(s["adddate"]));
                    rowTmp = rowTmp.replace(/\*BANNED_TXT\*/g, s["is_banned"] == "Y" ? "是" : "否");
                    rowTmp = rowTmp.replace(/\*BANNED_CLASS\*/g, s["is_banned"] == "Y" ? "suball_status_y" : "suball_status_n");
                    subRows += rowTmp;
                }
            }else{
                subRows = xmp_no_sub;
            }

            var groupTmp = xmp_group;
            groupTmp = groupTmp.replace(/\*LAYER\*/g, currentTab);
            groupTmp = groupTmp.replace(/\*PARENT_ID\*/g, util.showTxt(g["parent_id"]));
            groupTmp = groupTmp.replace(/\*PARENT_NID\*/g, util.showTxt(g["parent_nid"]));
            groupTmp = groupTmp.replace(/\*PARENT_NAME\*/g, util.showTxt(g["parent_name"]));
            groupTmp = groupTmp.replace(/\*PARENT_ALIAS\*/g, util.showTxt(g["parent_alias"]));
            groupTmp = groupTmp.replace(/\*PARENT_LOGINNAME\*/g, util.showTxt(g["parent_loginname"]));
            groupTmp = groupTmp.replace(/\*PARENT_PW\*/g, util.showTxt(g["parent_pw"]));
            groupTmp = groupTmp.replace(/\*PARENT_BANNED_TXT\*/g, g["parent_is_banned"] == "Y" ? "是" : "否");
            groupTmp = groupTmp.replace(/\*PARENT_BANNED_CLASS\*/g, g["parent_is_banned"] == "Y" ? "suball_status_y" : "suball_status_n");
            groupTmp = groupTmp.replace(/\*SUB_COUNT\*/g, util.showTxt(g["sub_count"]));
            groupTmp = groupTmp.replace(/\*SUB_ROWS\*/g, subRows);
            groupTmp = groupTmp.replace(/\*ARROW_CLASS\*/g, isOpen ? "open" : "");
            groupTmp = groupTmp.replace(/\*BODY_STYLE\*/g, isOpen ? 'style="display:block;"' : 'style="display:none;"');

            html += groupTmp;
        }

        _mc["div_show"].innerHTML = html;
        _self.bindRowEvent();
        _self.renderPager();
    };

    _self.renderPager = function(){
        var total = currentData["total"] ? currentData["total"] * 1 : 0;
        var pageTotal = currentData["page_total"] ? currentData["page_total"] * 1 : 0;
        var showPage = total > 0 ? currentPage : 0;

        _mc["page_info"].innerHTML = "第 " + showPage + " / " + pageTotal + " 页，共 " + total + " 个代理";
        _mc["btn_prev_page"].className = "suball_page_btn" + (total <= 0 || currentPage <= 1 ? " disabled" : "");
        _mc["btn_next_page"].className = "suball_page_btn" + (total <= 0 || currentPage >= pageTotal ? " disabled" : "");
    };

    _self.bindRowEvent = function(){
        var list = currentData["list"] || [];
        for(var i=0;i<list.length;i++){
            var g = list[i];

            var btnToggle = dom.getElementById("btn_toggle_" + g["parent_id"]);
            var btnBatchOpen = dom.getElementById("btn_batch_open_" + g["parent_id"]);
            var btnBatchBan = dom.getElementById("btn_batch_ban_" + g["parent_id"]);
            var btnCascadeOpen = dom.getElementById("btn_cascade_open_" + g["parent_id"]);
            var btnCascadeBan = dom.getElementById("btn_cascade_ban_" + g["parent_id"]);


            if(btnToggle){
                util.addEvent(btnToggle, "click", _self.toggleGroupEvent, {
                    "parent_id": g["parent_id"]
                });
            }
            if(btnBatchOpen){
                util.addEvent(btnBatchOpen, "click", _self.batchBannedEvent, {
                    "parent_id": g["parent_id"],
                    "parent_nid": g["parent_nid"],
                    "is_banned": "N"
                });
            }
            if(btnBatchBan){
                util.addEvent(btnBatchBan, "click", _self.batchBannedEvent, {
                    "parent_id": g["parent_id"],
                    "parent_nid": g["parent_nid"],
                    "is_banned": "Y"
                });
            }
            if(btnCascadeOpen){
                util.addEvent(btnCascadeOpen, "click", _self.cascadeBannedEvent, {
                    "parent_id": g["parent_id"],
                    "parent_nid": g["parent_nid"],
                    "is_banned": "N"
                });
            }

            if(btnCascadeBan){
                util.addEvent(btnCascadeBan, "click", _self.cascadeBannedEvent, {
                    "parent_id": g["parent_id"],
                    "parent_nid": g["parent_nid"],
                    "is_banned": "Y"
                });
            }


            var subs = g["subs"] || [];
            for(var j=0;j<subs.length;j++){
                var s = subs[j];
                var btnOpen = dom.getElementById("btn_open_" + s["id"]);
                var btnBan = dom.getElementById("btn_ban_" + s["id"]);

                if(btnOpen){
                    util.addEvent(btnOpen, "click", _self.singleBannedEvent, {
                        "id": s["id"],
                        "is_banned": "N"
                    });
                }
                if(btnBan){
                    util.addEvent(btnBan, "click", _self.singleBannedEvent, {
                        "id": s["id"],
                        "is_banned": "Y"
                    });
                }
            }
        }
    };

    _self.toggleGroupEvent = function(mouseEvent, paramObj){
        var pid = paramObj["parent_id"];
        var body = dom.getElementById("group_body_" + pid);
        var arrow = dom.getElementById("arrow_" + pid);

        foldStatus[pid] = foldStatus[pid] ? false : true;

        if(body){
            body.style.display = foldStatus[pid] ? "block" : "none";
        }
        if(arrow){
            arrow.className = "suball_arrow" + (foldStatus[pid] ? " open" : "");
        }
    };

    _self.searchEvent = function(){
        currentPage = 1;
        foldStatus = {};
        _self.loadData();
    };

    _self.clearSearchEvent = function(){
        _mc["input_search"].value = "";
        currentPage = 1;
        foldStatus = {};
        _self.loadData();
    };

    _self.changeTabEvent = function(mouseEvent, targetObj){
        currentTab = targetObj;
        currentPage = 1;
        foldStatus = {};
        _self.loadData();
    };

    _self.prevPageEvent = function(){
        if(currentPage <= 1){
            return;
        }
        currentPage--;
        foldStatus = {};
        _self.loadData();
    };

    _self.nextPageEvent = function(){
        var pageTotal = currentData["page_total"] ? currentData["page_total"] * 1 : 0;
        if(pageTotal <= 0 || currentPage >= pageTotal){
            return;
        }
        currentPage++;
        foldStatus = {};
        _self.loadData();
    };

    _self.singleBannedEvent = function(mouseEvent, paramObj){
        nowAction = {
            "type": "single",
            "id": paramObj["id"],
            "is_banned": paramObj["is_banned"]
        };
        _mc["confirm_msg"].innerHTML = (paramObj["is_banned"] == "Y" ? "确认禁用该子账号？" : "确认启用该子账号？");
        _mc["system_msg_contain"].style.display = "";
    };

    _self.batchBannedEvent = function(mouseEvent, paramObj){
        nowAction = {
            "type": "batch",
            "parent_id": paramObj["parent_id"],
            "parent_nid": paramObj["parent_nid"],
            "is_banned": paramObj["is_banned"]
        };
        _mc["confirm_msg"].innerHTML = (paramObj["is_banned"] == "Y" ? "确认禁用该代理下全部子账号？" : "确认启用该代理下全部子账号？");
        _mc["system_msg_contain"].style.display = "";
    };

    _self.cascadeBannedEvent = function(mouseEvent, paramObj){
        nowAction = {
            "type": "cascade",
            "parent_id": paramObj["parent_id"],
            "parent_nid": paramObj["parent_nid"],
            "is_banned": paramObj["is_banned"]
        };
        _mc["confirm_msg"].innerHTML = (paramObj["is_banned"] == "Y" ? "确认禁用该代理及其全部子账号？" : "确认启用该代理及其全部子账号？");
        _mc["system_msg_contain"].style.display = "";
    };

    _self.closeConfirmEvent = function(){
        _mc["system_msg_contain"].style.display = "none";
        nowAction = null;
    };

    _self.saveEvent = function(){
        if(!nowAction) return;

        parentClass.dispatchEvent("showLoading", { "showLoading": true });

        var sendCode = _self.getBaseParam();
        if(nowAction["type"] == "single"){
            sendCode += "&id=" + nowAction["id"];
            sendCode += "&is_banned=" + nowAction["is_banned"];
            sendCode = "p=chg_sub_banned_single&ver=" + top.ver + "&" + sendCode;
        }else if(nowAction["type"] == "batch"){
            sendCode += "&parent_nid=" + nowAction["parent_nid"];
            sendCode += "&is_banned=" + nowAction["is_banned"];
            sendCode = "p=chg_sub_banned_batch&ver=" + top.ver + "&" + sendCode;
        }else if(nowAction["type"] == "cascade"){
            sendCode += "&parent_id=" + nowAction["parent_id"];
            sendCode += "&is_banned=" + nowAction["is_banned"];
            sendCode = "p=chg_acc_banned_cascade&ver=" + top.ver + "&" + sendCode;
        }

        _mc["getHttp"].loadURL(top.url, "POST", sendCode);
    };

    _self.doLoadComplete = function(data){
        var arr_data = JSON.parse(data);
        if (util.chkErrorMsg(arr_data, LS_code)) {
            parentClass.dispatchEvent("showLoading", { "showLoading": false });
            return;
        }

        parentClass.dispatchEvent("showLoading", { "showLoading": false });

        if(arr_data["code"] != null && arr_data["code"] != ""){
            _mc["system_msg_contain"].style.display = "none";
            nowAction = null;

            switch(arr_data["code"]){
                case "chgSubBannedSingleSuccess":
                case "chgSubBannedBatchSuccess":
                case "chgAccBannedCascadeSuccess":
                    parentClass.dispatchEvent("showFadeOutMesg", { "text": "操作成功" });
                    _self.loadData();
                    break;
            }
        }
    };

    _self.setParentclass = function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
    };

    _self.exitEvent = function () {
        return true;
    };

    _self.getThis = function (varible) {
        return eval(varible);
    };
}