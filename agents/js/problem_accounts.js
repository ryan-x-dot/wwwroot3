function problem_accounts(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object();
    var util;
    var LS;
    var urlObj = {};            //查詢資料使用
    var allAccountObj = {};     //影響會員頁面用
    var review_sta = [];        //檢視按鈕讀取用
    var downlineObj = {};       //設定下限用
    var Cookie;

    var ul_review;
    var ul_period;
    var ul_burger;
    var div_ul_review;
    var div_ul_period;
    var div_ul_burger;
    var title_review;
    var title_period;
    var layer_su;
    var layer_ag;
    var pc_u_sort;
    var pc_s_sort;
    var pc_d_sort;

    var div_review_btn;
    var inp_review_btn;
    var talbe_view;
    var no_data_view;

    var revirw_tbody;
    var canReload;
    var XPB;
    var promblem_acc_excel;

    var keepScrollTop = 56;
    var overScrollTop = 56;
    var header_height = 0 ;

    _self.init = function () {
        // util.echo("problem_accounts load complete");
        parentClass.dispatchEvent("chgPageName", { "pageName": "problem_accounts" });

        ul_review = document.getElementById("ul_review");
        ul_period = document.getElementById("ul_period");
        ul_burger = document.getElementById("ul_burger");
        div_ul_review = document.getElementById("div_ul_review");
        div_ul_period = document.getElementById("div_ul_period");
        div_ul_burger = document.getElementById("div_ul_burger");
        title_review = document.getElementById("title_review");
        title_period = document.getElementById("title_period");
        layer_su = document.getElementById("layer_su");
        layer_ag = document.getElementById("layer_ag");

        pc_u_sort = document.getElementById("pc_u_sort");
        pc_s_sort = document.getElementById("pc_s_sort");
        pc_d_sort = document.getElementById("pc_d_sort");

        XPB = document.getElementById("XMP_PROBLEM_BODY").innerHTML;
        div_review_btn = document.getElementById("div_review_btn");
        talbe_view = document.getElementById("talbe_view");
        no_data_view = document.getElementById("no_data_view");

        revirw_tbody = document.getElementById("revirw_tbody");
        inp_review_btn = document.getElementById("inp_review_btn");
        promblem_acc_excel = document.getElementById("promblem_acc_excel");
        //James 2019/05/10 495.尺寸600以下-所有下拉選單-改為內建瀏覽器拉霸
        //所有切換事件
        sel_date_view = document.getElementById("div_sel_review");
        sel_order_view = document.getElementById("div_sel_period");


        util.setInfEvent(div_ul_review, { "_focus": ul_review, "_setView": div_ul_review, "_viewClass": "active"});
        util.setInfEvent(div_ul_period, { "_focus": ul_period, "_setView": div_ul_period, "_viewClass": "active"});
        util.setInfEvent(div_ul_burger, { "_focus": ul_burger, "_setView": div_ul_burger, "_viewClass": "active"});

        var ul_reviewCh = ul_review.children;
        for (var i = 0, len = ul_reviewCh.length; i < len ; i++){
            util.addEvent(ul_reviewCh[i], "click", _self.onClickEventHandler, { "target": "set_innerHTML", "s1": title_review});
        }
        util.addEvent(sel_date_view, "change", _self.onChangeEventHandler);

        var ul_periodCh = ul_period.children;
        for (var i = 0, len = ul_periodCh.length; i < len; i++) {
            util.addEvent(ul_periodCh[i], "click", _self.onClickEventHandler, { "target": "set_innerHTML", "s1": title_period });
        }
        util.addEvent(sel_order_view, "change", _self.onChangeEventHandler);

        var ul_burgerCh = ul_burger.children;
        for (var i = 0, len = ul_burgerCh.length; i < len; i++) {
            util.addEvent(ul_burgerCh[i], "click", _self.onClickEventHandler, { "target": "set_excel_sort" });
        }


        util.addEvent(layer_su, "click", _self.onClickEventHandler, { "target": "qlayer", "v1": layer_ag });
        util.addEvent(layer_ag, "click", _self.onClickEventHandler, { "target": "qlayer", "v1": layer_su });
        util.addEvent(pc_u_sort, "click", _self.onClickEventHandler, { "target": "pc_sort", "s1": pc_s_sort, "s2": pc_d_sort });
        util.addEvent(pc_s_sort, "click", _self.onClickEventHandler, { "target": "pc_sort", "s1": pc_u_sort, "s2": pc_d_sort });
        util.addEvent(pc_d_sort, "click", _self.onClickEventHandler, { "target": "pc_sort", "s1": pc_u_sort, "s2": pc_s_sort });
        util.addEvent(inp_review_btn, "click", _self.onClickEventHandler, { "target": "inp_review_btn" });
        header_height = dom.getElementById("main_header").clientHeight;
        util.addEvent(dom.getElementById("ma_content"), "scroll", _self.scrollEvent, dom.getElementById("showBody") );

        _self.setUrlObjInit();
        _self.setTitleLight();
        _self.connectServer();

        parentClass.dispatchEvent("showLoading", { "showLoading": false });
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        Cookie = parentClass.getThis("cookie");
    }

    //-----------------------------狀態拉霸使用 Start-----------------------------
    _self.setULViewLabar = function (innerText, viewUL) { //參數都是DOM物件
        var tmpClassSel = new win.ClassSelect(win, dom);
        tmpClassSel.setParentclass(_self);
        tmpClassSel.setSelCss("on", "", false);
        tmpClassSel.init(innerText, viewUL, viewUL, viewUL.parentElement);
        tmpClassSel.setSelected(innerText.getAttribute("data-enable"));
        tmpClassSel.addEvent("ONOPEN", _self.show_status_box);
        tmpClassSel.addEvent("ONCLOSE", _self.close_status_box, { "targetDom": viewUL.parentElement});
        tmpClassSel.addEvent("ONCHANGE", _self.saveEvent, { "target": "self" });
        var NUM = viewUL.getElementsByTagName("li")[0].getAttribute("data-status");
        if (document.getElementById("tree_"+NUM+"_768") != null) tmpClassSel.creatSelOpt(document.getElementById("tree_"+NUM+"_768"));

    }
    _self.show_status_box = function (e, param) {
        var DOM = e.target;
        if (DOM.tagName == "SPAN") {
            util.classFunc(DOM.parentElement, "active");
        } else if (DOM.tagName == "DIV"){
            util.classFunc(DOM, "active");
        }
    }
    _self.close_status_box = function (e, param) {
        var view = param.targetDom;
        // console.log(view);
        if(view.classList.contains("active")){
            view.classList.remove("active");
        }
    }
    _self.saveEvent = function (e, param) {
        var DOM = e.target;
        var tid = "";
        var staVal = "";
        if (param.target == "self") {
            if (DOM.tagName == "LI") {
                tid = DOM.getAttribute("data-status");
                staVal = DOM.id;
            } else if (DOM.tagName == "SPAN") {
                tid = DOM.parentElement.getAttribute("data-status");
                staVal = DOM.parentElement.id;
            } else if (DOM.tagName == "SELECT") {
                tid = DOM.getAttribute("data-status");
                staVal = DOM.value;
            }

            downlineObj["id"] = allAccountObj[tid]["user_id"];
            downlineObj["enable"] = staVal;
            downlineObj["origin_enable"] = allAccountObj[tid]["enable"];    //紀錄原始狀態
            downlineObj["pay_type"] = allAccountObj[tid]["pay_type"];
            _self.connecServerSetDownlineSta();
        }
    }
    //-----------------------------狀態拉霸使用 End-----------------------------
    //動態註冊 產生 狀態/影響會員/檢視狀態
    _self.setAnimationLisener = function () {
        var tree_ul = document.getElementsByName("tree_ul");
        var tree_aff = document.getElementsByName("tree_aff");
        var tree_cbox = document.getElementsByName("tree_cbox");

        for (var i = 0, len = tree_ul.length; i < len; i++) {   //狀態監聽
            _self.setULViewLabar(tree_ul[i].previousElementSibling, tree_ul[i]);
        }
        for (var j = 0, len = tree_aff.length; j < len; j++) {
            util.addEvent(tree_aff[j], "click", _self.onClickEventHandler, { "target": "affect" });
        }
        for (var k = 0, len = tree_cbox.length; k < len; k++) {
            util.addEvent(tree_cbox[k], "click", _self.onClickEventHandler, { "target": "review_checkbox" });
        }

    }
    _self.getThis = function (varible) {
        return eval(varible);
    }
    _self.onError = function () {
        util.echo("onError");
    }
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }
    _self.backPage = function (e, param) {
        parentClass.dispatchEvent("backToIdex", { "retFun": _self.backPageComplete });
    }
    _self.backPageComplete = function () {
        util.echo("backPageComplete");
    }
    //設定下線狀態
    _self.connecServerSetDownlineSta = function () {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var urlParams = "uid=" + top.uid;
        var getHTML = new HttpRequest();
        var pp = _self.getDownlineParam();
        urlParams += "&langx=" + top.langx;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&" + pp;
        urlParams = "p=chg_" + urlObj["qlayer"] + "_status" + "&ver=" + top.ver + "&" + urlParams;  //判斷點的當下是誰
        getHTML.addEventListener("LoadComplete", _self.catchAmendDonwLine);
        getHTML.addEventListener("onError", _self.onError);
        getHTML.loadURL(top.url, "POST", urlParams);
    }
    //設定已檢視
    _self.connectServerSetReview = function () {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var urlParams = "uid=" + top.uid;
        var getHTML = new HttpRequest();
        var pp = _self.getReviewGroupId();
        urlParams += "&action=setReview";
        urlParams += "&langx=" + top.langx;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&" + pp;
        urlParams = "p=get_problem_accounts&ver=" + top.ver + "&" + urlParams;
        getHTML.addEventListener("LoadComplete", _self.refreashReview);
        getHTML.addEventListener("onError", _self.onError);
        getHTML.loadURL(top.url, "POST", urlParams);
    }
    //讀取最新資料
    _self.connectServer = function () {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        review_sta = [];    //清空容器
        var urlParams = "uid=" + top.uid;
        var getHTML = new HttpRequest();
        var pp = _self.getUrlObjInfo();
        urlParams += "&action=getAccInfo";
        urlParams += "&langx=" + top.langx;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&" + pp;
        urlParams = "p=get_problem_accounts&ver=" + top.ver + "&" + urlParams;
        getHTML.addEventListener("LoadComplete", _self.refreshView);
        getHTML.addEventListener("onError", _self.onError);
        getHTML.loadURL(top.url, "POST", urlParams);
    }
    //檢視完重刷
    _self.refreashReview = function () {
        _self.connectServer();
        parentClass.dispatchEvent("getPromblemCount");
        setTimeout(_self.setTitleLight,300);
    }
    //修改完 訊息
    _self.catchAmendDonwLine = function(data){
        _self.connectServer();
        if (data == "") return;
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
        } catch (e) {
            util.echo(e);
        }
        if (arr_data["code"] == "Err_status"){
            util.showErrorMsg(arr_data["msg"]);
        }
        else if (arr_data["code"] == "chgStatusSuccess"){
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("status_update")});
        }
        else{
            util.showErrorMsg(arr_data["msg"]);
        }
    }

    //刷新頁面
    _self.refreshView = function (data) {
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        revirw_tbody.innerHTML = "";
        promblem_acc_excel.innerHTML = "";
        if (data == "") return;
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
        } catch (e) {
            util.echo(e);
        }
        _self.setFormDisplayIsHiden(false);
        if (arr_data["total_count"] == 0) { //沒資料時
            canReload = false;
            _self.setFormDisplayIsHiden(true);
            return;
        }
        var fragment = document.createDocumentFragment();
        var creatTr = document.createElement("tr");
        var dataAry = arr_data["dateAry"];
        var XMP_PROBLEM_STATUS_ALL = document.getElementById("XMP_PROBLEM_STATUS_ALL").innerHTML;
        var XMP_PROBLEM_STATUS_NOTALL = document.getElementById("XMP_PROBLEM_STATUS_NOTALL").innerHTML;
        allAccountObj = JSON.parse(JSON.stringify(arr_data["dateAry"]));
        for (var i in dataAry) {
            var xmpTr = XPB;
            var info = dataAry[i];
            var chkInp = "";
            var affName = "";
            var XMPStatus = "";//動態狀態列表
            var affclass = "";
            var affStr = "";
            var tr = creatTr.cloneNode(true);
            util.classFunc(tr, "re_table_body_auto");
            if (info["review"] == "1") {    //已讀
                util.classFunc(tr, "pro_gray_tr");
                chkInp = "disabled";
            }
            if (typeof info["lower_ary"] != "string") {
                affName = "tree_aff";
                affclass = "add_infoG";
            }else{
                affStr = "-";
            }
            //判斷li該使用哪一個拉霸 2個 與 4個
            if (info["enable"] == "Y") XMPStatus = XMP_PROBLEM_STATUS_ALL;
            else XMPStatus = XMP_PROBLEM_STATUS_NOTALL;

            XMPStatus = XMPStatus.replace(/\*ENABLE\*/ig, info["enable"]);
            XMPStatus = XMPStatus.replace(/\*ENABLESTUTAS\*/ig, LS.get("enable_" + info["enable"]));
            xmpTr = xmpTr.replace(/\*DISABLED\*/ig, chkInp);
            xmpTr = xmpTr.replace(/\*AFFCLASSNAME\*/ig, affclass);
            xmpTr = xmpTr.replace(/\*AFFSTR\*/ig, affStr);
            xmpTr = xmpTr.replace(/\*LISTENERAFF\*/ig, affName);
            xmpTr = xmpTr.replace(/\*ALIAS\*/ig, info["alias"]);
            xmpTr = xmpTr.replace(/\*USERNAME\*/ig, info["username"]);
            xmpTr = xmpTr.replace(/\*DATE\*/ig, info["t_date"]);
            xmpTr = xmpTr.replace(/\*PROBLEMSTATUSUL\*/ig, XMPStatus);
            xmpTr = xmpTr.replace(/\*NUM\*/ig, i);
            tr.innerHTML = xmpTr;
            fragment.appendChild(tr);
        }
        revirw_tbody.appendChild(fragment);
        canReload = true;
        _self.setExcelTable();
        _self.setFormDisplayIsHiden(false);
        _self.setAnimationLisener();
        _self.setReviewCount();
        keepScrollTop = dom.getElementById("re_functionG").offsetHeight + header_height;
        overScrollTop = dom.getElementById("re_functionG").offsetHeight + header_height;
    }
    //超過50筆資料 多載入資料
    // _self.reloadhView = function (data) {

    // }
    //塞資料給excel用的 table
    _self.setExcelTable = function () {
        var XMP_EXCEL_TABLE = document.getElementById("XMP_EXCEL_TABLE").innerHTML;
        var XMP_EXCEL_TR = document.getElementById("XMP_EXCEL_TR").innerHTML;
        var strTr = "";
        for (var i in allAccountObj) {
            var usrData = allAccountObj[i];
            var tmpTr = XMP_EXCEL_TR;
            tmpTr = tmpTr.replace("*EXCEL_USERNAME*", usrData["username"]);
            tmpTr = tmpTr.replace("*EXCEL_ALIAS*", usrData["alias"]);
            tmpTr = tmpTr.replace("*EXCEL_LAYER*", LS.get("str_" + usrData["layer"]));
            tmpTr = tmpTr.replace("*EXCEL_ENABLE*", LS.get("enable_" + usrData["enable"]));
            tmpTr = tmpTr.replace("*EXCEL_T_DATE*", usrData["t_date"]);
            tmpTr = tmpTr.replace("*EXCEL_VIEW_CONTENT*", _self.affectDate(usrData["lower_ary"]));
            strTr += tmpTr;
        }
        XMP_EXCEL_TABLE = XMP_EXCEL_TABLE.replace("*EXCELDATATR*", strTr);
        promblem_acc_excel.innerHTML = XMP_EXCEL_TABLE;
    }

    _self.affectDate = function (data) {
        var str = "";
        if (typeof data === "string") {
            str = "-"
        } else {
            for (var i in data) {
                str += data[i]["username"] + " " + data[i]["alias"] + "<br>";
            }
        }
        return str;
    }
    //預設值
    _self.setUrlObjInit = function () {
        urlObj["sta"] = "ALL";  //檢閱狀態
        urlObj["range"] = "TP";
        urlObj["qlayer"] = "su";
        urlObj["sort_type"] = "asc";
        urlObj["sort_name"] = "s_user";

        title_review.innerHTML = dom.getElementById("review_"+urlObj["sta"]).innerHTML;
    }

    //送出資料
    _self.getUrlObjInfo = function () {
        var param = "";
        param += "sta=" + urlObj["sta"];
        param += "&range=" + urlObj["range"];
        param += "&qlayer=" + urlObj["qlayer"];
        param += "&sort_type=" + urlObj["sort_type"];
        param += "&sort_name=" + urlObj["sort_name"];
        return param;
    }
    //檢視送出參數
    _self.getReviewGroupId = function () {
        var param;
        param = "idAry=" + review_sta.join(",");
        return param;
    }
    //狀態送出參數
    _self.getDownlineParam = function () {
        var param = "";
        var qid = "";
        var enable_pri = "";
        //判斷是總代還是代理
        if (urlObj["qlayer"] == "su") qid = "sid";
        else if (urlObj["qlayer"] == "ag") qid = "aid";
        param = qid + "=" + downlineObj["id"];
        if (urlObj["qlayer"] == "ag") param += "&pay_type=" + downlineObj["pay_type"];
        //判斷是否是需要 enable_pri
        if (downlineObj["origin_enable"] == "Y") {
            if (downlineObj["enable"] == "F") enable_pri = "&enable_pri=N";
            param += "&enable=" + downlineObj["enable"];
            param += enable_pri;
        }
        else {
            if (downlineObj["origin_enable"] == "F") {
                param += "&enable_pri=Y";
                param += "&status=S";
            } else if (downlineObj["origin_enable"] == "S") {
                param += "&enable=" + downlineObj["enable"];
                param += "&status=S";
            } else if (downlineObj["origin_enable"] == "N") {
                param += "&enable=" + downlineObj["enable"];
            }
        }
        return param;
    }
    //點擊監聽
    _self.onClickEventHandler = function (evt, param) {
        var DOM = evt.target;
        if (param.target == "set_innerHTML") {   //檢視狀態 / 本期 本週 上週
            if (DOM.tagName != "LI") return;
            var id = DOM.parentElement.id;
            if (id.indexOf("review") != -1) urlObj["sta"] = DOM.getAttribute("value");
            if (id.indexOf("period") != -1) urlObj["range"] = DOM.getAttribute("value");
            _self.setUlView(param.s1, DOM.innerHTML); //顯示當下選擇的項目
            _self.connectServer();
        }
        else if (param.target == "set_excel_sort") {   //漢堡事件
            if (DOM.tagName != "LI") return;
            var val = DOM.getAttribute("value").split(" ");
            if (val[0] != "export") {
                urlObj["sort_name"] = val[0];
                urlObj["sort_type"] = val[1];
                _self.connectServer();
            } else {
                if (promblem_acc_excel.innerHTML.indexOf("table") == -1) return;
                _self.Excel();  //輸出excel
            }
        }
        else if (param.target == "qlayer") {   //總代 / 代理
            util.classFunc(DOM, "on");
            util.classFunc(param.v1, "on", "remove");
            urlObj["qlayer"] = DOM.getAttribute("value");
            _self.connectServer();
        }
        else if (param.target == "pc_sort") {  //pc排序
            var claNams = DOM.className;
            if (claNams.indexOf("sort_down") != -1) {
                util.classFunc(DOM, "sort_down", "remove");
                util.classFunc(DOM, "sort_up");
                urlObj["sort_type"] = "asc";
            }
            else {
                util.classFunc(DOM, "sort_up", "remove");
                util.classFunc(DOM, "sort_down");
                urlObj["sort_type"] = "desc";
            }
            util.classFunc(param.s1, ["sort_down", "sort_up"], "remove");
            util.classFunc(param.s2, ["sort_down", "sort_up"], "remove");
            urlObj["sort_name"] = DOM.getAttribute("value");
            _self.connectServer();
        }
        else if (param.target == "affect") {   //顯示影響下層
            var targetObj = allAccountObj[DOM.getAttribute("data-affect")];
            parentClass.dispatchEvent("showProblemAccDetail", { "up_layer": targetObj["username"], "downlineAry": targetObj["lower_ary"] });
        }
        else if (param.target == "review_checkbox") {  //檢視打勾判斷
            var targetObj = allAccountObj[DOM.getAttribute("data-review")];
            if (DOM.checked) review_sta.push(targetObj["id"]);
            else review_sta.splice(review_sta.indexOf(targetObj["id"]), 1);
            review_sta = util.unique(review_sta);   //過濾相同的元素
            _self.setReviewCount();
        }
        else if (param.target == "inp_review_btn") { //檢視按鈕
            if (review_sta.length == 0) return;
            _self.connectServerSetReview();
        }
    }
    //James 2019/05/10 495.尺寸600以下-所有下拉選單-改為內建瀏覽器拉霸
    //所有切換事件
    _self.onChangeEventHandler = function (evt) {
        var id = evt.target.id;
        if (id.indexOf("review") != -1) urlObj["sta"] = evt.target.value;
        if (id.indexOf("period") != -1) urlObj["range"] = evt.target.value;
        _self.connectServer();
    }

    //顯示點擊的數量
    _self.setReviewCount = function () {
        var len = review_sta.length;
        if (len == 0) {
            if(top.langx=="en-us")
            inp_review_btn.value = "REVIEW";
            else if(top.langx=="zh-tw")
            inp_review_btn.value = "設為已檢視";
            else if(top.langx=="zh-cn")
            inp_review_btn.value = "设为已检视";
        }
        else {
            if(top.langx=="en-us")
            inp_review_btn.value = "REVIEW(" + len + ")";
            else if(top.langx=="zh-tw")
            inp_review_btn.value = "設為已檢視(" + len + ")";
            else if(top.langx=="zh-cn")
            inp_review_btn.value = "设为已检视(" + len + ")";
        }
    }
    //設定畫面顯示隱藏
    _self.setFormDisplayIsHiden = function (param) {
        var view = "none";
        var reverse = ""
        if (!param) {
            view = "";
            reverse = "none";
        }
        div_review_btn.style.display = view;
        talbe_view.style.display = view;
        no_data_view.style.display = reverse;

    }
    //打印當下點擊的內容給span
    _self.setUlView = function (innerDom, val) {
        innerDom.innerHTML = val;
    }
    //輸出excel
    _self.Excel = function () {
        var param = new Array();
        var tsb = promblem_acc_excel.innerHTML;
        var setMeta = "<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>";
        var baseUrl = "<base href=http://" + document.domain + ">";
        param['mydata'] = setMeta + baseUrl + (tsb.replace(/bgcolor=/gi, "").replace(/#ffffff/gi, "").replace(/href=/gi, "").replace(/border=0/gi, "border=1"));
        _self.post_to_url('/app/transExcel.php?langx=' + top.langx + '&a=' + new Date().getTime(), param);
    }
    //post送出
    _self.post_to_url = function (path, params) {
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", path);
        for (var key in params) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);
            form.appendChild(hiddenField);
        }
        document.body.appendChild(form);
        form.submit();
    }

    _self.setTitleLight = function(){
        var str = "ag_" + top.login_layer + "_" + top.layer_id;
        var suTitle = Cookie.get(str + "_ncr_count_s");
        var agTitle = Cookie.get(str + "_ncr_count_a");

        var isMove = "remove";
        if (suTitle * 1 != 0) isMove = "";
        util.classFunc(layer_su, "ann_li_dot", isMove);

        isMove = "remove";
        if (agTitle * 1 != 0) isMove = "";
        util.classFunc(layer_ag, "ann_li_dot", isMove);

    }

    //判斷向下滑動 設定加上css
    _self.scrollEvent = function (e, target) {
        var newScrollTop = e.target.scrollTop;
        if (newScrollTop >= overScrollTop) {
            if (!target.issticky) {
                util.classFunc(target, "title_fixed");
                overScrollTop = e.target.scrollTop;
                target.issticky = true;
            }
        } else {
            if (target.issticky) {
                util.classFunc(target, "title_fixed", "remove");
                overScrollTop = keepScrollTop;
                target.issticky = false;
            }
        }
    }

}