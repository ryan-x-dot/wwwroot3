function ann_add(_win, _dom, paramObj){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS_code;
    var LS_account;
    var LS_report;
    var cookie;
    var getView;
    var config_set;
    var param;
    var scoll_type;
    var _mc = new Object();

    var ann_div = new Array("div_ann_important","div_ann_general","div_ann_personal","div_ann_proNews","div_ann_proChat");
    var ann_title = new Object();
    ann_title["title"] = new Array("ann_important","ann_general","ann_personal","ann_proNews","ann_proChat");
    _self.init=function() {
        param = paramObj;
        if(param.hasOwnProperty("scoll_type")){
            scoll_type = param.scoll_type;
        }else{
            scoll_type = "important";
        }

        parentClass.dispatchEvent("chgLeftMenuColor", {"target": "announcement"});
        parentClass.dispatchEvent("chgPageName", {"pageType": "announcement", "uniqText": "新增"});

        var obj_ids = ",div_ann_important,div_ann_general,div_ann_personal,div_ann_proNews,div_ann_proChat,";
        obj_ids += ",ann_important,ann_general,ann_personal,ann_proNews,ann_proChat,";
        _mc = util.getObjAry(dom, obj_ids);
        for(var i = 0; i < ann_title["title"].length; i++){
            util.addEvent(_mc[ann_title["title"][i]], "click", _self.titleChg, { "target": _mc[ann_title["title"][i]], "type": "title" });
        }

        _self.titleChg(null, { "target": _mc["ann_"+scoll_type], "type": "title" });
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }



    // ＝＝＝＝＝＝ index.js 連接 report_index.js (下層) ＝＝＝＝＝＝
    _self.changeFilter = function (param) {
        subFrame.changeFilter(param);
    }
    // ＝＝＝＝＝＝ index.js 連接 report_index.js (下層) ＝＝＝＝＝＝
    _self.getThis=function(varible){
        if(typeof eval(varible)!=="undefined") return eval(varible);
        return parentClass.getThis(varible);
    }
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
        LS_report = parentClass.getThis("LS_report");
        cookie = parentClass.getThis("cookie");
        getView = parentClass.getThis("getView");
        config_set = parentClass.getThis("config_set");
        fastTemplate_a1 = parentClass.getThis("fastTemplate_a1");
    }

    _self.getParentThis = function (varible) {
        return parentClass.getThis(varible);
    }

    _self.titleChg = function (mouseEvent, obj) {
        if (obj["type"] == "title") {
            if (mouseEvent != null) {
                parentClass.dispatchEvent("ConfirmExitAlert", { Event: mouseEvent, Param: obj, func: _self.ShowAndHidden });
            } else {
                _self.ShowAndHidden(mouseEvent, obj);
            }
        }
    }

    //成功離開修改頁的畫面顯示設定
    _self.ShowAndHidden = function (mouseEvent, titleChgObj) {
        var length = ann_title[titleChgObj["type"]].length;
        for (var i = 0; i < length; i++) {
            _mc[ann_title[titleChgObj["type"]][i]].classList.remove("on");
        }
        titleChgObj["target"].classList.add("on");
        for (var i = 0; i < ann_div.length; i++) {
            _mc[ann_div[i]].style.display = "none";
        }
        _mc["div_" + titleChgObj["target"].id].style.display = "";

        _self.openDiv("div_" + titleChgObj["target"].id);
    }

    //成功離開修改頁的畫面顯示設定

    _self.openDiv = function(name){
        var level = name.split("_")[2];
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        // 2019-04-23 464.帳號編輯-本來ONLIE   MEMBERS有資料，但先點reports再點ONLIE   MEMBERS，ONLIE   MEMBERS就變空白(PJP-523)
        // 因為 onlineMember 內的id有跟report相同的
        for(var i =0; i < ann_div.length; i++){
            _mc[ann_div[i]].innerHTML = "";
        }
        var paramHash = new Object();
        paramHash["scoll_type"] = level;
        paramHash["back_page"] = param.back_page;
        paramHash["scoll_date"] = param.scoll_date;
        paramHash["sort"] = param.sort;
        paramHash["search"] = param.search;
        if((level=="proNews" || level == "proChat") && param.hasOwnProperty("username")){
            paramHash["username"] = param.username;
        }
        var parObj = new Object();
        parObj["target"] = name;
        parObj["useDefineParent"] = "Y";
        //parObj["retChild"] = _self.getChild;
        parObj["postHash"] = paramHash;
        parObj["page"] = "ann_"+level+"_add";
        parObj["p"] = "ann_"+level+"_add";
        parentClass.dispatchEvent("goToPage", parObj);

    }
}