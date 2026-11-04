function acc_creditlogs (_win, _dom ,param) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_account;
    var eventHandler = new Object();
    var _mc = new Object();
    var nowSortDate = "ThisMonths";//預設排序
    var nowSort = "adddate";//預設排序 //adddate, act_field ,
    var nowAorD = "down";//預設排序2 ASC DESC
    var show_layer = "";
    var show_id = "";
    var user_type = "";
    var keepScrollTop = 109;
    var overScrollTop = 109;

    var lazy_sw = null;
    var lazy_count = null; //every page count
    var lazy_page = null;
    var lazy_total_page = null;
    var lazy_loading = false;
    var scroll_e = null;
    var dataHash = null;
    var no_data_str = "-" ;

    _self.init = function () {
        show_layer = param["edit_layer"];
        show_id = param["edit_id"];
        user_type = param["edit_type"];
        util.echo("acc creditlogs complete");
        _self.getViewAllEle();//取得畫面所需元素
        _self.addStaticListen();//建立監聽事件(靜態)
        _self.getSearchData();
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        _self.initLazy();
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_account = parentClass.getThis("LS_account");
    }
    _self.getViewAllEle = function (){
        //建立畫面元素物件
        _mc["ser_date_view"] = dom.getElementById("ser_date_view");
        _mc["ser_date_title"] = dom.getElementById("ser_date_title");
        _mc["ser_order_title"] = dom.getElementById("ser_order_title");
        _mc["ul_date"] = dom.getElementById("ul_date");
        _mc["ul_order"] = dom.getElementById("ul_order");
        _mc["no_data_view"] = dom.getElementById("no_data_view");
        //James 2019/05/10 495.尺寸600以下-所有下拉選單-改為內建瀏覽器拉霸
        _mc["sel_date_view"] = dom.getElementById("sel_date_view");

    }
    _self.parseData = function (data) {
        var showmain = dom.getElementById("showmain");//顯示區
        var parseDate = data["outData"];
        _self.setHidden(_mc["no_data_view"], true);
        _self.setHidden(showmain, false);

        if (parseDate != null && (parseDate.length > 0) ) {//有資料才跑
            var xmp_header = dom.getElementById("xmp_header").innerHTML;//modle hrader
            var xmp_foot = dom.getElementById("xmp_foot").innerHTML;//modle foot
            var xmp_foot_mini = dom.getElementById("xmp_foot_mini").innerHTML;//modle foot
            var outdata = xmp_header;//輸出資料
            var tmp_out_data = "";
            var tmp_out_data_mini = "";

            var s = 0;
            var e = 0;
            if (lazy_sw) {
                s = (lazy_page - 1) * lazy_count;

                e = (lazy_page == lazy_total_page) ? parseDate.length : lazy_page * lazy_count;
            } else {
                s = 0;
                e = parseDate.length;
            }
            for (var i = s; i < e; i++) {
                var tmpdata = parseDate[i];
                var xmp_contant = dom.getElementById("xmp_contant").innerHTML;              //modle contant
                var xmp_contant_mini = dom.getElementById("xmp_contant_mini").innerHTML;    //modle contant

                xmp_contant = xmp_contant.replace(/\*ADDDATE\*/g, tmpdata["adddate"]);
                xmp_contant = xmp_contant.replace(/\*OLDCASH\*/g, util.mprintf(tmpdata["old_cash"] * 1, 0, 2, false, true));
                xmp_contant = xmp_contant.replace(/\*NEWCASH\*/g, util.mprintf(tmpdata["new_cash"] * 1, 0, 2, false, true));
                xmp_contant = xmp_contant.replace(/\*DEPOSIT\*/g, (tmpdata["deposit"] != 0) ? util.mprintf(tmpdata["deposit"] * 1, 0, 2, false, true) : no_data_str);
                xmp_contant = xmp_contant.replace(/\*WITHDRAWAL\*/g, (tmpdata["withdrawal"] != 0) ? util.mprintf(tmpdata["withdrawal"] * 1, 0, 2, false, true) : no_data_str);
                xmp_contant = xmp_contant.replace(/\*USERNAME\*/g, tmpdata["chg_user"]);
                xmp_contant = xmp_contant.replace(/\*USERTYPE\*/g, tmpdata["chg_site"]);
                // xmp_contant = xmp_contant.replace(/\*RECSTATUS\*/g, tmpdata["rec_status"]);

                xmp_contant_mini = xmp_contant_mini.replace(/\*ADDDATE\*/g, tmpdata["adddate"]);
                xmp_contant_mini = xmp_contant_mini.replace(/\*OLDCASH\*/g, util.mprintf(tmpdata["old_cash"] * 1, 0, 2, false, true));
                xmp_contant_mini = xmp_contant_mini.replace(/\*NEWCASH\*/g, util.mprintf(tmpdata["new_cash"] * 1, 0, 2, false, true));
                xmp_contant_mini = xmp_contant_mini.replace(/\*DEPOSIT_WITHDRAWAL\*/g, util.mprintf(tmpdata["chg_value"]  * 1, 0, 2, false, true));
                xmp_contant_mini = xmp_contant_mini.replace(/\*USERNAME\*/g, tmpdata["chg_user"]);
                xmp_contant_mini = xmp_contant_mini.replace(/\*USERTYPE\*/g, tmpdata["chg_site"]);
                // xmp_contant_mini = xmp_contant_mini.replace(/\*RECSTATUS\*/g, tmpdata["rec_status"]);

                tmp_out_data += xmp_contant;
                tmp_out_data_mini += xmp_contant_mini;
            }

            if (lazy_page == 1) {
                outdata += tmp_out_data + xmp_foot ;
                outdata += tmp_out_data_mini + xmp_foot_mini ;
                showmain.innerHTML = outdata;

                _self.set_mini_clickevent(dom.getElementsByClassName("Retractable")) ;
                _self.addDynamicListen();//建立上方選項監聽
                //把剛剛點選的設定顯示到畫面上
                _self.showAndHidden(_mc[nowSort + "_sort"], " sort_" + nowAorD);
            } else {
                _self.table_append(showmain.children[1].children[0].children[0].children[0], tmp_out_data);
                _self.div_append(showmain.children[2].children[0].children[0], tmp_out_data_mini);

                // var tmp_innerHTML = showmain.children[1].children[0].children[0].children[0];
                // var tmp_innerHTML_mini = showmain.children[2].children[0].children[0];
                // tmp_innerHTML.innerHTML = tmp_innerHTML.innerHTML + tmp_out_data;
                // tmp_innerHTML_mini.innerHTML = tmp_innerHTML_mini.innerHTML + tmp_out_data_mini;
            }

            _self.scroll_ver_event(scroll_e, dom.getElementById("body_show"));
            _self.setLzayLoadingVisible(false);
        } else {
            //如果沒有資料要顯示另一個區塊
            _self.setHidden(showmain, true);
            _self.setHidden(_mc["no_data_view"], false);
        }
    }

    // 新的資料直接新增在table的最後面
    _self.table_append = function (_Obj,str_append) {
        var tableObj = dom.createElement("table");
        tableObj.innerHTML = str_append;
        var dolength = tableObj.rows.length;
        for (var i = 0; i < dolength; i++) {
            var retObj = tableObj.rows[0];
            _Obj.appendChild(retObj);
        }
    }

    // 新的資料直接新增在div的最後面
    _self.div_append = function (_Obj, str_append) {
        var divObj = dom.createElement("div");
        divObj.innerHTML = str_append;
        var dolength = divObj.children.length;
        for (var i = 0; i < dolength; i++) {
            var retObj = divObj.children[0];
            _Obj.appendChild(retObj);
            _self.set_mini_clickevent(retObj.getElementsByClassName("Retractable"));
        }
    }

    _self.set_mini_clickevent = function(_Obj){
        for (var i=0; i < _Obj.length ; i++) {
            util.addEvent(_Obj[i], "click", _self.more_sw, _Obj[i].parentElement.parentElement  );
        }
    }
    _self.more_sw = function (evt,do_Obj) {
        if (do_Obj.className.indexOf("active")!=-1){
            do_Obj.classList.remove("active");
        }else{
            do_Obj.classList.add("active");
        }
    }

    //建立靜態監聽
    _self.addStaticListen = function(){
        util.setInfEvent(_mc["ser_date_view"], { "_focus": _mc["ul_date"], "_setView": _mc["ser_date_view"], "_viewClass": "active" });

        var ul_dateCh = _mc["ul_date"].children;
        for (var i = 0, len = ul_dateCh.length; i < len ; i++){
            util.addEvent(ul_dateCh[i], "click", _self.onClickEventHandler, { "target": "ul_bar", "h1": _mc["ser_date_title"]});
        }
        util.addEvent(_mc["sel_date_view"], "change", _self.onChangeEventHandler);

        _self.setScrollEvent();
    }
    _self.setScrollEvent = function(isset){
        var ref = dom.getElementById("re_functionG");
        var acceo = dom.getElementById("acc_edit_offset");
        keepScrollTop = ref.offsetHeight + acceo.offsetHeight;
        overScrollTop = ref.offsetHeight + acceo.offsetHeight;
        if (!param.disableScrollEvent || isset) {
            util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, dom.getElementById("showBody"));
        }
    }
    //建立動態監聽
    _self.addDynamicListen = function () {
        _mc["adddate_sort"] = dom.getElementById("adddate_sort");

        util.addEvent(_mc["adddate_sort"], "click", _self.onClickEventHandler, { "target": "adddate_sort", "data": "adddate"});
    }
    //所有點擊事件
    _self.onClickEventHandler = function (evt, param) {
        var DOM = evt.target;
        if (param.target == "ul_bar") { //點擊 日期 子項目
            if (DOM.tagName != "LI") return;
            _self.labarFunc(param.h1, DOM.innerHTML);
            _mc["sel_date_view"].value = DOM.getAttribute("value") ; // 兩種畫面大小的選項要同步
            if (param.h1.id.indexOf("date") != -1) nowSortDate = DOM.getAttribute("value"); //日期
            //查詢資料
            _self.getSearchData();
        } else if (param.target.indexOf("_sort")!= -1 ){
            //sort_down DESC   sort_up  ASC
            var divClass = DOM.className;
            nowSort = param.data;
            if (divClass.indexOf("sort_up") != -1) nowAorD = "down";
            else nowAorD = "up";
            _self.getSearchData();
        }
    }
    //James 2019/05/10 495.尺寸600以下-所有下拉選單-改為內建瀏覽器拉霸
    //所有切換事件
    _self.onChangeEventHandler = function (evt) {
        var h1 = evt.target.id;
        _self.labarFunc(_mc["ser_date_title"], evt.target[evt.target.selectedIndex].innerHTML);     // 兩種畫面大小的選項要同步
        if (h1.indexOf("date") != -1) nowSortDate = evt.target.value; //日期
        //查詢資料
        _self.getSearchData();
    }

    //送php 取資料
    _self.getSearchData = function () {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&layer_id=" + top.layer_id;
        urlParams += "&sortName=" + nowSort;
        urlParams += "&sortType=" + nowAorD;
        urlParams += "&sortDate=" + nowSortDate;
        urlParams += "&showLayer=" + show_layer;
        urlParams += "&showId=" + show_id;
        urlParams += "&user_type=" + user_type;
        if (typeof(param["pay_type"]) != "undefined"){
            urlParams += "&pay_type=" + param["pay_type"];
        }else{
            urlParams += "&pay_type=0";
        }
        urlParams += "&langx=" + top.langx;
        urlParams = "p=get_acc_creditlogs&ver=" + top.ver + "&" + urlParams ;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams);
    }
    _self.connectComplete = function (data) {
        var arr_data = JSON.parse(data);
        dataHash = arr_data;
        // util.echo(arr_data);
        _self.reSetLazy(arr_data["outData"]);
        _self.parseData(arr_data);
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
    _self.onError = function () {
        util.echo("onError");
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
    //拉霸 換字顯示
    _self.labarFunc = function (innerDom, val) {
        innerDom.innerHTML = val;
    }
    //隱藏元件
    _self.setHidden = function (el, oks) {
        if (el == null) return;
        el.style.display = (oks) ? "none" : "";
    }
    //舊管理端搬過來的 數字顯示轉換
    _self._number_format = function (num, decimals, dec_point, thousands_sep) {
        if (num == undefined) return "";
        decimals = decimals || 0;
        decimals = decimals * 1;
        dec_point = dec_point || ".";
        thousands_sep = thousands_sep || ",";
        var sign = "";
        var ans = "";
        num = num.toString();
        if (isFinite(num.replace(/,/g, ""))) {
            num = num.replace(/,/g, "");
            num_ary = num.split(".");
            ans = "";
            num0 = num_ary[0];
            if (num0 * 1 < 0) {
                sign = "-";
                num0 = num0.substr(1, num0.length);
            }
            (num_ary[1] == undefined) ?
                num1 = "" :
                num1 = num_ary[1];
            len = num0.length;
            for (var i = 1; i <= len; i++) {
                ans = num0.substr(len - i, 1) + ans;
                if (i % 3 == 0 && i != len) ans = thousands_sep + ans;
            }
            num0 = ans;
            if (decimals != 0) {
                ans = "";
                for (var i = 0; i < decimals; i++) {
                    if (num1.charAt(i) == "") ans += 0;
                    else ans += num1.substr(i, 1);
                }
                num1 = ans;
                ret_str = sign + num0 + dec_point + num1;
            } else {
                ret_str = sign + num0;
            }
            return ret_str;
        } else {
            return num;
        }
    }

    _self.transLS=function(val){
        var hash = new Object();
        hash["Y"] = LS.get("enable_str_Active");
        hash["N"] = LS.get("enable_str_Inactive");
        hash["S"] = LS.get("enable_str_ViewOnly");
        hash["F"] = LS.get("enable_str_Suspended");

        return hash[val]? hash[val] : "";
    }
    //判斷向下滑動 設定加上css
    _self.scrollEvent = function (e, target) {
        var newScrollTop = e.target.scrollTop;
        if (newScrollTop >= overScrollTop) {
            if (!target.issticky) {
                util.classFunc(target, "report_fixed");
                overScrollTop = e.target.scrollTop;
                target.issticky = true;
            }
        } else {
            if (target.issticky) {
                util.classFunc(target, "report_fixed", "remove");
                overScrollTop = keepScrollTop;
                target.issticky = false;
            }
        }
        scroll_e = e;
        _self.scroll_ver_event(e, target);
    }

    _self.scroll_ver_event = function (e, targetObj) {
        if (e == null || !dom.getElementById("showBody")) return;
        var newScrollTop = e.target.scrollTop;
        var ori_h = e.target.scrollHeight;
        var now_h = 0;
        var func_h = dom.getElementById("showBody").clientHeight;

        if (newScrollTop > func_h) {
            // util.classFunc(targetObj, "report_fixed");
            now_h = e.target.scrollHeight;
            if (now_h != 0) stop_h = func_h - (ori_h - now_h);

        }
        if (newScrollTop <= func_h) {
            // util.classFunc(targetObj, "report_fixed", "remove");
            // e.target.scrollTop = func_h;
        }

        _self.checkShowLazyLoading(e.target);
    }

    //============ lazy loading ============
    _self.checkShowLazyLoading = function (target) {
        if (!lazy_sw) return;
        var newScrollTop = target.scrollTop;
        var s_h = target.scrollHeight;
        var c_h = target.clientHeight;
        var scroll_bottom = (newScrollTop >= ((s_h - c_h) - 10));

        // util.echo("[checkShowLazyLoading]["+scroll_bottom+"]"+newScrollTop+"=="+s_h+"-"+c_h);

        if (scroll_bottom && !lazy_loading) {
            // util.echo("[checkShowLazyLoading]"+lazy_page+"<"+lazy_total_page);
            if (lazy_page < lazy_total_page) {
                _self.setLzayLoadingVisible(true);
                retryTimer = setTimeout(_self.loadLazyData, 300);
            }
        }
    }

    _self.setLzayLoadingVisible = function (isShow) {
        if (!lazy_sw) return;
        lazy_loading = isShow;
        dom.getElementById("report_loading").style.display = (isShow) ? "" : "none";
    }

    _self.loadLazyData = function () {
        if (!lazy_sw) return;
        lazy_loading = true;
        if (lazy_page < lazy_total_page) {
            lazy_page++;
            _self.parseData(dataHash);
        }
    }

    _self.initLazy = function () {
        lazy_sw = config_set.get("LAZY_SW") || false;
        lazy_page = 1;
        lazy_total_page = 1;

        var lazy_cnt = (getView().viewportheight > 700) ? "LAZY_COUNT_BIG_PAGE" : "LAZY_COUNT";
        lazy_count = config_set.get(lazy_cnt) || 10;
    }

    _self.reSetLazy = function (row0) {
        _self.initLazy();
        lazy_total_page = row0 ? Math.ceil(row0.length / lazy_count) : 1;
        if (lazy_total_page <= 0) lazy_total_page = 1;
    }
    //============ lazy loading ============
}