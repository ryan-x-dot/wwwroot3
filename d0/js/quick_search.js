function quick_search(_win, _dom ,param) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var eventHandler = new Object();
    var _mc = new Object();
    var nowSearchType = "co";//預設搜尋條件
    var nowSort = "username";//預設排序
    var nowAorD = "up";//預設排序2 ASC DESC
    var paramEnable = false;
    var nowPage = 1;//預設頁數
    var totalPage = 1;//預設總頁數
    var nowScroll = 0;//now scroll
    var search_layer = top.login_layer;//預設使用登入者層級
    var search_id = top.layer_id;//預設使用登入者id
    var keepScrollTop = 56;
    var overScrollTop = 56;
    var classname = "quick_search";
    var searchTxt = "";

    _self.init = function () {
        parentClass.dispatchEvent("chgPageName", { "pageName": "quicksearch" });
        util.echo("quick_search complete");
        _self.getViewAllEle();//取得畫面所需元素
        _self.addStaticListen();//建立監聽事件(靜態)
        //判斷目前登入的層級 顯示隱藏
        _self.showAndHidden(_mc["search_co"], "on");
        _self.showAndHidden(_mc["search_su"], "");
        _self.showAndHidden(_mc["search_ag"], "");
        _self.showAndHidden(_mc["search_mem"], "");

        //如果用子帳號登入 需要隱藏查詢子帳號
        if (top.user_type != 1)_self.setHidden(_mc["search_subAcc"], true);
        //判斷是否有從別頁帶來的參數 ex 用戶管理
        if (param) {
            _self.chgSearchType("", param["search_type"]);
            search_layer = param["search_layer"];
            search_id = param["search_id"];
            nowSearchType = param["search_type"];
            paramEnable = param["enable"];
            _self.getSearchData();
        }

        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        //判斷畫面拉動 是否要載入資料
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, { "target": dom.getElementById("showBody")});
        topFrame.closeRightPanel();
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        topFrame = parentClass.getThis("topFrame");
    }
    _self.getViewAllEle = function () {
        //建立畫面元素物件
        _mc["search_txt"] = dom.getElementById("search_txt");
        _mc["search_btn"] = dom.getElementById("search_btn");
        _mc["clear_search_btn"] = dom.getElementById("clear_search_btn");
        _mc["search_co"] = dom.getElementById("search_co");
        _mc["search_su"] = dom.getElementById("search_su");
        _mc["search_ag"] = dom.getElementById("search_ag");
        _mc["search_mem"] = dom.getElementById("search_mem");
        _mc["search_subAcc"] = dom.getElementById("search_subAcc");
        _mc["hr_info1"] = dom.getElementById("hr_info1");
        _mc["search_Div"] = dom.getElementById("search_Div");
        _mc["no_data_view"] = dom.getElementById("no_data_view");
    }
    //畫面顯示
    _self.parseData = function (data) {
        var getView = parentClass.getThis("getView");
        var view_w = getView().viewportwidth;//螢幕畫面大小
        var ret = "";//選用框架
        if (view_w < 600) {
            ret = "xmp_360";
        } else if (view_w >= 600 && view_w < 768) {
            ret = "xmp_360";
        } else if (view_w >= 768 && view_w < 1024) {
            ret = "xmp_1024";
        } else if (view_w >= 1024) {
            ret = "xmp_1024";
        }
        var showmain = dom.getElementById("showmain");//顯示區
        var xmp_header = dom.getElementById(ret + "_header").innerHTML;//modle hrader
        var xmp_foot = dom.getElementById(ret + "_foot").innerHTML;//modle foot
        var outdata = xmp_header;//輸出資料
        _self.setHidden(_mc["no_data_view"], true);
        _self.setHidden(showmain, false);
        var parseDate = null;
        if (nowSearchType == "co") {
            parseDate = data["co_id_data"];
        } else if (nowSearchType == "su") {
            parseDate = data["super_id_data"];
        } else if (nowSearchType == "ag") {
            parseDate = data["agents_id_data"];
        } else if (nowSearchType == "mem") {
            parseDate = data["members_id_data"];
        } else if (nowSearchType == "subAcc") {
            parseDate = data["accData"];
        }
        if (parseDate != null && (parseDate.length > 0) ) {//有資料才跑
            for (var i = 0; i < parseDate.length; i++) {
                var tmpdata = parseDate[i];
                var xmp_contant = dom.getElementById(ret + "_contant").innerHTML;//modle contant
                // xmp_contant = xmp_contant.replace(/\*USERNAME\*/g, tmpdata["username"]);//替換資料
                xmp_contant = xmp_contant.replace("*USERNAME*", tmpdata["username"]);//替換資料
                xmp_contant = xmp_contant.replace("*ALIAS*", tmpdata["alias"]);//
                //2019-03-29 Ricky 279.279.Quick Search快速搜尋- 總代/代理/會員，尚未首次登入建立安全代碼的總代 & 建立登入帳號的代理/會員，Login ID/Safe Code欄位 目前都顯示aaaaaa，正確應不能顯示
                if(tmpdata["passwd_safe"] == "aaaaaa") tmpdata["passwd_safe"] = "";
                xmp_contant = xmp_contant.replace("*PASSWD_SAFE*", tmpdata["passwd_safe"]);//
                xmp_contant = xmp_contant.replace("*ID*", tmpdata["id"]);//
                var status = _self.statusTransFor(tmpdata);//轉換目前會員狀態
                //2019-03-27 Ricky 288.Quick Search-sub account-沒有停啟用狀態，畫面上active幫拿掉
                if(nowSearchType == "subAcc") xmp_contant = xmp_contant.replace("*STAUAS*", "");//
                else xmp_contant = xmp_contant.replace("*STAUAS*", LS.get("enable_str_" + status));//
                xmp_contant = xmp_contant.replace("*ADDDATE*", tmpdata["adddate"]);//
                xmp_contant = xmp_contant.replace("*USERTYPE*", LS.get("layer_type_name_" + tmpdata["usertype"]));

                var upAgentsName = "-";
                var upMasterAgentsName = "-";
                var upCO = "-";
                //取得會員上層username
                try {
                    switch (nowSearchType){
                        case "mem":

                            upAgentsName = data["agents_id_data"][tmpdata["agents_id"]]["username"];//代理

                            var upid = data["agents_id_data"][tmpdata["agents_id"]]["super_agents_id"];
                            if (upid) upMasterAgentsName = data["super_id_data"][upid]["username"];//总代理

                            var upid = data["super_id_data"][upid]["co_super_id"];
                            if (upid) upCO = data["co_id_data"][upid]["username"];//股东

                            break;
                        case "ag":
                            xmp_contant = xmp_contant.replace("*USERTYPE*", LS.get("layer_type_name_" + tmpdata["usertype"]));
                            upMasterAgentsName = data["super_id_data"][tmpdata["super_id"]]["username"];

                            var upid = data["super_id_data"][tmpdata["super_id"]]["co_super_id"];
                            if (upid) upCO = data["co_id_data"][upid]["username"];//股东

                            break;
                        case "su":
                            xmp_contant = xmp_contant.replace("*USERTYPE*", LS.get("layer_type_name_" + tmpdata["usertype"]));
                            upCO = data["co_id_data"][tmpdata["co_id"]]["username"];//股东

                            break;
                        case "co":
                            xmp_contant = xmp_contant.replace("*USERTYPE*", LS.get("layer_type_name_" + tmpdata["usertype"]));
                            break;
                    }
                } catch (e) {

                }
                xmp_contant = xmp_contant.replace("*UPAGENTS*", upAgentsName);//
                xmp_contant = xmp_contant.replace("*UPSUPERAGENTS*", upMasterAgentsName);//
                xmp_contant = xmp_contant.replace("*UPSUPERCO*", upCO);//
                outdata += xmp_contant;
            }
        }else{
            //如果沒有資料要顯示另一個區塊
            _self.setHidden(showmain, true);
            _self.setHidden(_mc["no_data_view"], false);

        }
        outdata += xmp_foot;
        nowPage = data["page"];
        totalPage = data["totalpage"];

        showmain.innerHTML = outdata;
        if (parseDate != null) _self.addDynamicTableListen(parseDate);
        if (ret == "xmp_1024") {
            _self.addDynamicListen();//如果是大畫面才建立監聽
            //把剛剛點選的設定顯示到畫面上
            _self.showAndHidden(_mc[nowSort + "_sort"], " sort_" + nowAorD);
        }
        keepScrollTop = dom.getElementById("re_functionG").offsetHeight;
        overScrollTop = dom.getElementById("re_functionG").offsetHeight;

    }
    //畫面家載
    _self.parseChildData = function (data) {
        var getView = parentClass.getThis("getView");
        var view_w = getView().viewportwidth;//螢幕畫面大小
        var ret = "";//選用框架
        if (view_w < 600) {
            ret = "xmp_360";
        } else if (view_w >= 600 && view_w < 768) {
            ret = "xmp_360";
        } else if (view_w >= 768 && view_w < 1024) {
            ret = "xmp_1024";
        } else if (view_w >= 1024) {
            ret = "xmp_1024";
        }

        var tbody_div = dom.getElementById("tbody_div");//顯示區
        if (nowSearchType == "co") {
            parseDate = data["co_id_data"];
        } else if (nowSearchType == "su") {
            parseDate = data["super_id_data"];
        } else if (nowSearchType == "ag") {
            parseDate = data["agents_id_data"];
        } else if (nowSearchType == "mem") {
            parseDate = data["members_id_data"];
        } else if (nowSearchType == "subAcc") {
            parseDate = data["accData"];
        }
        var fragment = document.createDocumentFragment();
        if (parseDate != null) {//有資料才跑
            for (var i = 0; i < parseDate.length; i++) {
                var tr = document.createElement("tr");
                var tmpdata = parseDate[i];
                var xmp_contant = dom.getElementById(ret + "_contant").innerHTML;//modle contant
                // xmp_contant = xmp_contant.replace(/\*USERNAME\*/g, tmpdata["username"]);//替換資料
                xmp_contant = xmp_contant.replace("*USERNAME*", tmpdata["username"]);//替換資料
                xmp_contant = xmp_contant.replace("*ALIAS*", tmpdata["alias"]);//
                //2019-03-29 Ricky 279.279.Quick Search快速搜尋- 總代/代理/會員，尚未首次登入建立安全代碼的總代 & 建立登入帳號的代理/會員，Login ID/Safe Code欄位 目前都顯示aaaaaa，正確應不能顯示
                if(tmpdata["passwd_safe"] == "aaaaaa") tmpdata["passwd_safe"] = "";
                xmp_contant = xmp_contant.replace("*PASSWD_SAFE*", tmpdata["passwd_safe"]);//
                xmp_contant = xmp_contant.replace("*ID*", tmpdata["id"]);//
                var status = _self.statusTransFor(tmpdata);//轉換目前會員狀態
                //2019-03-27 Ricky 288.Quick Search-sub account-沒有停啟用狀態，畫面上active幫拿掉
                if(nowSearchType == "subAcc") xmp_contant = xmp_contant.replace("*STAUAS*", "");//
                else xmp_contant = xmp_contant.replace("*STAUAS*", LS.get("enable_str_" + status));//
                xmp_contant = xmp_contant.replace("*ADDDATE*", tmpdata["adddate"]);//
                xmp_contant = xmp_contant.replace("*USERTYPE*", LS.get("layer_type_name_" + tmpdata["usertype"]));

                var upAgentsName = "-";
                var upMasterAgentsName = "-";
                var upCO = "-";
                //取得會員上層username
                try {
                    switch (nowSearchType){
                        case "mem":
                            upAgentsName = data["agents_id_data"][tmpdata["agents_id"]]["username"];//代理

                            var upid = data["agents_id_data"][tmpdata["agents_id"]]["super_agents_id"];
                            if (upid) upMasterAgentsName = data["super_id_data"][upid]["username"];//总代理

                            var upid = data["super_id_data"][upid]["co_super_id"];
                            if (upid) upCO = data["co_id_data"][upid]["username"];//股东

                            break;
                        case "ag":
                            xmp_contant = xmp_contant.replace("*USERTYPE*", LS.get("layer_type_name_" + tmpdata["usertype"]));
                            upMasterAgentsName = data["super_id_data"][tmpdata["super_id"]]["username"];

                            var upid = data["super_id_data"][tmpdata["super_id"]]["co_super_id"];
                            if (upid) upCO = data["co_id_data"][upid]["username"];//股东

                            break;
                        case "su":
                            xmp_contant = xmp_contant.replace("*USERTYPE*", LS.get("layer_type_name_" + tmpdata["usertype"]));
                            upCO = data["co_id_data"][tmpdata["co_id"]]["username"];//股东

                            break;
                        case "co":
                            xmp_contant = xmp_contant.replace("*USERTYPE*", LS.get("layer_type_name_" + tmpdata["usertype"]));
                            break;
                    }
                } catch (e) {

                }
                xmp_contant = xmp_contant.replace("*UPAGENTS*", upAgentsName);//
                xmp_contant = xmp_contant.replace("*UPSUPERAGENTS*", upMasterAgentsName);//
                xmp_contant = xmp_contant.replace("*UPSUPERCO*", upCO);//

                tr.innerHTML = xmp_contant;
                tr.setAttribute("class", "re_table_body_auto");
                if (ret == "xmp_360")tr.setAttribute("id", "link_" + tmpdata["id"]);//360畫面 需要特殊處理 id
                fragment.appendChild(tr);
            }
            tbody_div.appendChild(fragment);
            _self.addDynamicTableListen(parseDate);
        }
    }
    //建立靜態監聽
    _self.addStaticListen = function () {
        util.addEvent(_mc["search_btn"], "click", _self.goSearch, "");
        util.addEvent(_mc["clear_search_btn"], "click", _self.clearSearch, "");
        util.addEvent(_mc["search_co"], "click", _self.chgSearchType, "co");
        util.addEvent(_mc["search_su"], "click", _self.chgSearchType, "su");
        util.addEvent(_mc["search_ag"], "click", _self.chgSearchType, "ag");
        util.addEvent(_mc["search_mem"], "click", _self.chgSearchType, "mem");
        util.addEvent(_mc["search_subAcc"], "click", _self.chgSearchType, "subAcc");
        util.addEvent(_mc["search_txt"], "focus", _self.onFocusEventHandler, { "target": _mc["search_Div"] });
        util.addEvent(_mc["search_txt"], "blur", _self.onBlurEventHandler, { "target": _mc["search_Div"] });
        util.addEvent(_mc["search_txt"], "keypress", _self.Press_Search, "");
    }
    //建立動態監聽
    _self.addDynamicListen = function () {
        _mc["username_sort"] = dom.getElementById("username_sort");
        _mc["alias_sort"] = dom.getElementById("alias_sort");
        _mc["status_sort"] = dom.getElementById("status_sort");
        _mc["adddate_sort"] = dom.getElementById("adddate_sort");

        util.addEvent(_mc["username_sort"], "click", _self.chgSort, "username");
        util.addEvent(_mc["alias_sort"], "click", _self.chgSort, "alias");
        util.addEvent(_mc["status_sort"], "click", _self.chgSort, "status");
        util.addEvent(_mc["adddate_sort"], "click", _self.chgSort, "adddate");
    }
    //建立table上的動態監聽
    _self.addDynamicTableListen = function (data) {
        // 2019-06-20 566.子帳號-無管理帳戶（更改和觀看）的權限-從首頁的下線狀態點擊，在點擊帳號-就可以到修改頁面(PJP-688)
        // >>這點請幫在首頁點擊下線狀態時, 不要有作用;快速搜索頁面點擊帳號名稱, 也不要有作用 - Roy
        if (!(top.user_type != "1" && top.pri_type.indexOf("B1") == -1)){
            for (var i = 0; i < data.length; i++) {
                _mc["link_" + data[i]["id"]] = dom.getElementById("link_" + data[i]["id"]);
                util.addEvent(_mc["link_" + data[i]["id"]], "click", _self.gotoPage, data[i]);
            }
        }
    }
    //點擊該人 轉導到修改畫面
    _self.gotoPage = function (e, param) {
        var div = e.target;
        var levelObj = { "corprator": "co", "super_agents": "su", "agents": "ag", "members": "mem" };
        var paramHash = new Object();
        paramHash["edit_id"] = param["id"];
        paramHash["edit_username"] = param["username"];
        paramHash["edit_enable"] = getEnable(param["enable"], param["enable_pri"]);
        paramHash["back_page"] = classname;
        paramHash["pay_type"] = param["pay_type"];
        //找出上層的ID
        if (param["usertype"] == "super_agents" ){
            paramHash["up_id"] = param["corprator_id"];
            paramHash["user_id"] = param["user_id"];
            paramHash["edit_type"] = param["edit_type"];
        }else if (param["usertype"] == "agents"){
            paramHash["up_id"] = param["super_agents_id"];
            paramHash["user_id"] = param["user_id"];
            paramHash["edit_type"] = param["edit_type"];
        } else if (param["usertype"] == "members"){
            paramHash["up_id"] = param["agents_id"];
            paramHash["edit_type"] = "1";
        }

        var obj = new Object();
        if (nowSearchType != "subAcc"){
            obj["page"] = "acc_" + levelObj[param["usertype"]] + "_edit";
        } else {//子帳號
            paramHash["id"] = param["user_id"];
            paramHash["pri"] = param["pri"];
            paramHash["alias"] = param["alias"];
            paramHash["adddate"] = param["adddate"];
            paramHash["username"] = param["username"];
            paramHash["user_type"] = param["edit_type"];
            paramHash["passwd_safe"] = param["passwd_safe"];
            obj["page"] = "acc_sub_edit";
        }
        obj["postHash"] = paramHash;
        parentClass.dispatchEvent("bodyGoToPage", obj);
    }
    //點擊排序
    _self.chgSort = function (e, param) {
        //sort_down DESC   sort_up  ASC
        var divClass = e.target.className;
        nowSort = param;
        if (divClass.indexOf("sort_up") != -1) nowAorD = "down";
        else nowAorD = "up";
        if (divClass.indexOf("sort_up") == -1 && divClass.indexOf("sort_down") == -1) {
            _self.showAndHidden(e.target, " sort_up");
        } else {
            _self.showAndHidden(e.target, " sort_up");
            _self.showAndHidden(e.target, " sort_down");
        }
        _self.goSearch();

    }
    //Entrt goSearch
    _self.Press_Search = function (e, param) {
        var keyCode = util.getKeyCode(e);
        if (keyCode == 13) {
            _self.goSearch(e);
        }
    }

    //查詢資料
    _self.goSearch = function (e, param) {
        //檢查搜尋條件是否小於三
        //James 2019/05/08 525.快速搜索，點擊輸入匡，沒有輸入任何文字，按enter可以搜尋到下層所有帳號(PJP-624)
        _self.onFocusEventHandler(null,{ "target": _mc["search_Div"] });
        if (e != null) {
            if (_mc["search_txt"].value.length < 3){
                _self.setHidden(_mc["hr_info1"], false);//顯示提示字
                _self.showAndHidden(_mc["search_Div"], " err_input");//切換警告class
                return;
            }
            searchTxt = _mc["search_txt"].value;
            search_layer = top.login_layer;//預設使用登入者層級
            search_id = top.layer_id;//預設使用登入者id
            paramEnable = false;
        }
        nowPage = 1;//重新搜尋 要重置頁碼
        //查詢資料
        _self.getSearchData();
    }
    //送php 取資料
    _self.getSearchData = function () {

        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;//登入層級 不可變動
        urlParams += "&search_layer=" + search_layer;//搜尋層級 可變動
        urlParams += "&layer_id=" + search_id;
        urlParams += "&sortName=" + nowSort;
        urlParams += "&sortType=" + nowAorD;
        urlParams += "&page=" + nowPage;
        if (paramEnable){
            urlParams += "&enable=" + paramEnable;
        }
        urlParams = "p=get_quick_search&ver=" + top.ver + "&" + urlParams + "&searchType=" + nowSearchType + "&searchName=" + searchTxt;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.connectComplete = function (data) {
        try {
            var arr_data = JSON.parse(data);
            // util.echo(arr_data);
            if (arr_data["page"] >= "2") _self.parseChildData(arr_data);//加載畫面
            else _self.parseData(arr_data);//普通顯示畫面
        } catch (e) {
            util.echo(e);
        }

    }
    //清空搜尋內容
    _self.clearSearch = function (e, param) {
        _mc["search_txt"].value = "";
    }
    _self.chgSearchType = function (e, param) {
        _self.showAndHidden(dom.getElementById("search_" + nowSearchType), "on");//還原class
        _self.showAndHidden(dom.getElementById("search_" + param), "on");//切換class
        nowSearchType = param;
        var showmain = dom.getElementById("showmain");//顯示區
        showmain.innerHTML = "";
    }
    //輸入欄位聚焦
    _self.onFocusEventHandler = function (e, param) {
        var classname = param.target.className;
        var newClassname = "";
        newClassname = classname.replace(" err_input", "");
        _self.setObjectClass(param.target, newClassname);//如果有顯示錯誤 先將class 還原
        _self.setHidden(_mc["hr_info1"], true);//隱藏提示字
        _self.showAndHidden(param.target, " focus_input");
    }
    //輸入欄位失焦
    _self.onBlurEventHandler = function (e, param) {
        _self.showAndHidden(param.target, " focus_input");
    }
    //開關div
    _self.showAndHidden = function (titleObj, cName) {
        var classname = titleObj.className;
        var newClassname = "";

        if (classname.search(cName) == -1) {
            newClassname = classname + cName;
        } else {
            newClassname = classname.replace(cName, "");
        }

        _self.setObjectClass(titleObj, newClassname);

    }
    //set obj class
    _self.setObjectClass = function (targetObj, classStr) {
        if (targetObj.className != undefined) {
            targetObj.className = classStr;
        } else {
            targetObj.setAttribute("class", classStr);
        }
    }
    //隱藏元件
    _self.setHidden = function (el, oks) {
        if (el == null) return;
        el.style.display = (oks) ? "none" : "";
    }
    //staus 轉換器
    _self.statusTransFor = function (data) {
        if (data["enable"] != "N" && data["enable_pri"] == "N") {
            return "Suspended";
        } else {
            if (data["enable"] == "Y" && data["enable_pri"] == "Y") {
                return "Active";
            } else if(data["enable"] == "S" && data["enable_pri"] == "Y"){
                return "ViewOnly";
            } else if(data["enable"] == "N"){
                return "Inactive";
            }
        }
    }
    _self.onError = function () {
        util.echo("onError");
    }


    _self.getThis = function (varible) {
        return eval(varible);
    }

    //exit
    _self.exitEvent = function () {
        // util.echo("top exit");
        return true;
    }

    _self.backPage = function (e, param) {
        parentClass.dispatchEvent("backPage", { "retFun": _self.backPageComplete });
    }

    _self.backPageComplete = function () {
        // util.echo("backPageComplete");
    }

    _self.changePage = function (e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.changePageComplete = function () {
        // util.echo("changePageComplete");
    }

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }
    //判斷畫面拉動 是否需要載入資料
    _self.scrollEvent = function (e, param) {
            var newScrollTop = dom.getElementById("body_show").scrollTop;
            var clinH = dom.getElementById("body_show").clientHeight;
            var crollHeight = dom.getElementById("body_show").scrollHeight;
            // console.log( (newScrollTop + clinH) + "|" + (crollHeight-30)  );
            if (newScrollTop + clinH >= (crollHeight - (crollHeight/6) ) && newScrollTop > nowScroll) {//拉到接近底部的時候開始判斷 是否要再繞資料進來
                // console.log("more reload");
                if (nowPage < totalPage) {//如果還有頁數 才要再載入
                    nowPage++;
                    //查詢資料
                    _self.getSearchData();
                }
            }
            nowScroll = newScrollTop;
// ---------------------------------------------------------
            newScrollTop = e.target.scrollTop;
            if (newScrollTop >= overScrollTop) {
                if (!param.target.issticky) {
                    util.classFunc(param.target, "report_fixed");
                    overScrollTop = e.target.scrollTop;
                    param.target.issticky = true;
                }
            } else {
                if (param.target.issticky) {
                    util.classFunc(param.target, "report_fixed", "remove");
                    overScrollTop = keepScrollTop;
                    param.target.issticky = false;
                }
            }

    }
    //轉換enable
    function getEnable(enable, enable_pri) {
        var ret = "";
        if (enable != "N" && enable_pri == "N") {
            ret = "F";  //禁止登入
        } else {
            if (enable == "Y" && enable_pri == "Y") {
                ret = "Y";  //啓用
            } else if (enable == "S" && enable_pri == "Y") {
                ret = "S";  //只能看帳
            } else if (enable == "N") {
                ret = "N";  //停用
            }
        }

        return ret;
    }
}