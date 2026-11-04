function report_index(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var childClass;
    var classname = "report_index";
    var util;
    var util_report = new win.util_report(win, dom);
    var retryTimer;
    var LS;
    var LS_code;
    var LS_report;
    var cookie;
    var hr = null;
    var getView;
    var fastTemplate_a1;
    var config_set;
    var now_model = "";
    var eventHandler = new Object();
    var totalAry;
    var tfootAry;
    var rowAry;
    var excel_totalAry;
    var excel_tfootAry;
    var excel_rowAry;
    var dataHash = null;
    var selectFun = new Object();
    var reportTypeAry = new Array("set", "valid", "all");
    var row0 = new Array();
    var par = new Object();
    var selPar = new Object();
    var selObj = new Object();
    var idAry = new Array();
    var stop_h = 0;
    // var possess_sw = false;
    var nowDetail = "";
    selObj["result_type"] = new Array("Y", "N");
    selObj["report_kind"] = new Array("D", "D4");
    selObj["gtype"];
    // selObj["wtype"];
    var sort_asc = false; //asc or desc
    var sort_type = "";
    var scroll_e = null;
    var scroll_left = 0;
    var tmpModelAry = new Array("report_list_bet","report_list_bet_unsettled")
    var cancelAry = new Array();
    var possessAry = new Array();
    var possess_openAry = new Object();

    //arvin
    var displayWtype = null;
    var inWtype = null;

    var disAry;

    var lazy_sw = null;
    var lazy_count = null; //every page count
    var lazy_page = null;
    var lazy_total_page = null;
    var lazy_loading = false;

    var sDate = null;
    var eDate = null;
    var is_fixed_head = false ;    //fix 是否已啟動標記

    _self.init = function () {

    }

    _self.reInit = function (_childClass, _classname, _totalAry, _rowAry, _tfootAry) {

        childClass = _childClass;
        totalAry = _totalAry;
        rowAry = _rowAry;
        tfootAry = _tfootAry;
        classname = _classname;
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "report" });
        //util.echo(classname + " load complete");


        selObj["gtype"] = config_set.get("REPORT_GTYPE");
        // selObj["wtype"] = config_set.get("REPORT_WTYPE");

        sort_type = (classname == "report_list_bet") ? "DATETIME" : "NAME0";
        // sort_asc = (classname == "report_list_bet")? false:true;
        _self.initFilter();
        _self.initChooseName();
        _self.initSelectFun();
        _self.initReportTypeDiv();
        _self.initCalendar();
        _self.initReportType();
        _self.initLazy();
        _self.hideFilter();
        _self.addSelectEvent();
        _self.showBtn();
        disAry = _self.getDisObj();

        util.setInfEvent(dom.getElementById("burger_div"), { "_focus": dom.getElementById("burger_sel"), "_setView": dom.getElementById("burger_div"), "_viewClass": "active" });

        if (getView().viewportwidth >= 1024) _self.show_filter();


        // 2019-04-15 Arvin 說把mousedown touchstart 註解換成click
        util.addEvent(dom.getElementById("export_excel"), "click", _self.exportExcel);
        util.addEvent(dom.getElementById("show_filter"), "click", _self.showFilter);
        util.addEvent(dom.getElementById("hide_filter"), "click", _self.hideFilter);
        util.addEvent(dom.getElementById("edit_filter"), "click", _self.editFilter);
        util.addEvent(dom.getElementById("copy_btn"), "click", _self.copyTable);

        _self.addEventListener("choseDateEvent", _self.choseDateEvent);

        for (var i = 0; i < reportTypeAry.length; i++) {
            var _name = reportTypeAry[i];
            util.addEvent(dom.getElementById(_name + "_btn"), "click", _self.chgReportType, { "type": _name });
        }


        // util.addEvent(dom.getElementById("cleanWtype"), "click", _self.cleanWtype, { "dom": dom.getElementById("searchWtype") });
        // util.addEvent(dom.getElementById("wtype_div"), "click", _self.setRtypeLis, { "className": "re_selectG", "InnerText": dom.getElementById("wtype_now") });
        // util.addEvent(dom.getElementById("focusBtn"), "blur", _self.hideWtypeSel, { "view": dom.getElementById("wtype_div"), "className": "active" });
        // util.addEvent(dom.getElementById("searchWtype"), "input", _self.changeSearchText);
        // util.addEvent(dom.getElementById("searchWtype"), "blur", _self.hideWtypeSel, { "view": dom.getElementById("wtype_div"), "className": "active" });

        // util.addEvent(dom.getElementById("wtype_div"), "mouseleave", _self.setMouseLeave);
        // util.addEvent(dom.getElementById("wtype_div"), "mouseenter", _self.setMouseIn);


        _self.setSearchSel(dom.getElementById("wtype_div"), { "_focus": dom.getElementById("wtype_sel"), "_setView": dom.getElementById("wtype_div"), "_viewClass": "active"});
        // util.addEvent(dom.getElementById("cleanText"), "click", _self.cleanTextEvent, { "dom": dom.getElementById("f_searchWtype") });
        util.addEvent(dom.getElementById("allULWtype"), "click", _self.serchSelEvent, { "className": "active", "isFilter": false});
        // util.addEvent(dom.getElementById("searchWtype"), "input", _self.changeSearchText, "");

        // var wtype_list = dom.getElementsByName("wtype_list");
        // for (var i = 0, len = wtype_list.length; i < 0; i++) {
        //     console.log("[===wtype_list====]");
        //     util.addEvent(wtype_div[i], "click", _self.setRtypeLis, { "className": "re_betlistG" });
        // }

        util.addEvent(win, "orientationchange", _self.orientation);
        _self.getModel(true);

    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_report = parentClass.getThis("LS_report");
        cookie = parentClass.getThis("cookie");
        getView = parentClass.getThis("getView");
        config_set = parentClass.getThis("config_set");
        fastTemplate_a1 = parentClass.getThis("fastTemplate_a1");
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    _self.getParentThis = function (varible) {
        return parentClass.getThis(varible);
    }

    _self.orientation = function () {
        var orientation = win.Math.abs(win.orientation);
        if (orientation == 90 || orientation == 0) {
            // alert("[orientation] = "+orientation+" [width] = "+getView().viewportwidth);
            if(dom.getElementById("div_model"))_self.getModel(true);
        }
    }


    _self.initScroll = function () {
        is_fixed_head = false;
        if (dom.getElementById("more_btn")) dom.getElementById("more_btn").style.display = "none";
        util.addEvent(dom.getElementById("re_body_scroll"), "scroll", _self.scrollHorEvent);
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollVerEvent, dom.getElementById("re_body"));
        util.addEvent(dom.getElementById("data_right_scroll"), "scroll", _self.data_right_scrollEvent);
        //dom.getElementById("re_body_scroll").prevScrollBottomIgnore = true;//橫向滾軸物件判斷使用

        if (getView().viewportwidth < 1440) {
            if (dom.getElementById("more_btn")) {
                if (dom.getElementById("more_btn").onclick != null)
                    util.removeEvent(dom.getElementById("more_btn"), "click");
                if (cookie.get("moreTip20190130") == "Y") {
                    dom.getElementById("more_btn").style.display = "none";
                } else if (!cookie.get("moreTip20190130")) {
                    dom.getElementById("more_btn").style.display = "";
                    util.addEvent(dom.getElementById("more_btn"), "click", _self.scrollHorToRight);
                }
            }
        }

    }
    _self.data_right_scrollEvent = function (e, targetObj) {
        // 捲軸滾動時, 關閉已開啟的佔成紀錄框框
        _self.possess_close_all();

        var _obj = new Object();
        _obj["data_right_scroll"] = dom.getElementById("data_right_scroll");
        _obj["head_fix_scroll"] = dom.getElementById("head_fix_scroll");
        if (_obj["data_right_scroll"] && _obj["head_fix_scroll"]){
            _obj["head_fix_scroll"].scrollLeft = _obj["data_right_scroll"].scrollLeft ;

            if (_obj["data_right_scroll"].scrollLeft > 0 && !is_fixed_head) {
                var _fix_head = dom.getElementsByClassName("re_td_fixedShadow");
                for (var i=0; i < _fix_head.length; i++ ){
                    util.classFunc(_fix_head[i], "fixed");
                }
                is_fixed_head = true ;
            }else if (_obj["data_right_scroll"].scrollLeft <= 0 && is_fixed_head){
                var _fix_head = dom.getElementsByClassName("re_td_fixedShadow");
                for (var i = 0; i < _fix_head.length; i++) {
                    util.classFunc(_fix_head[i], "fixed", "remove");
                }
                is_fixed_head = false;
            }
        }
        var obj_more_btn = dom.getElementById("more_btn");
        if (obj_more_btn) {
            if ((_obj["data_right_scroll"].scrollLeft + _obj["data_right_scroll"].clientWidth) >= _obj["data_right_scroll"].scrollWidth) {
                obj_more_btn.style.display = "none";
            }
        }
    }

    _self.scrollVerEvent = function (e, targetObj) {
        scroll_e = e;
        _self.scroll_ver_event(e, targetObj);
    }

    _self.scroll_ver_event = function (e, targetObj) {
        //卷軸滾動時 關閉已開啟的過濾器選項
        sDate.blurEvent();
        eDate.blurEvent();
        // 捲軸滾動時, 關閉已開啟的佔成紀錄框框
        _self.possess_close_all();

        var arr_close = new Array("result_type", "gtype", "wtype");
        for(var key in arr_close){
            util.classFunc(dom.getElementById(arr_close[key]+"_div"), "active", "remove");
        }

        if (e == null || !dom.getElementById("re_function")) return;
        var newScrollTop = e.target.scrollTop;
        var ori_h = e.target.scrollHeight;
        var now_h = 0;
        var func_h = dom.getElementById("re_function").clientHeight;

        if (newScrollTop > func_h) {
            util.classFunc(targetObj, "report_fixed");
            _self.data_right_scrollEvent();
            now_h = e.target.scrollHeight;
            if (now_h != 0) stop_h = func_h - (ori_h - now_h);

        }
        // console.log("[newScrollTop] = "+newScrollTop+"  [stop_h] = "+stop_h);
        if(newScrollTop <= func_h){
            util.classFunc(targetObj, "report_fixed", "remove");
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
    }
    //============ lazy loading ============

    _self.scrollHorEvent = function (e) {
        _self.scroll_hor_event(e.target, false);
    }

    _self.scroll_hor_event = function(target, isParse){

        if(dom.getElementById("more_btn") && !isParse) dom.getElementById("more_btn").style.display = "none";
        var obj = dom.getElementById("re_head_scroll");
        if(obj){
            obj.scrollLeft = target.scrollLeft;
            var scorllW = target.scrollWidth - target.clientWidth;

            // if (target.scrollLeft == 0) {
            //     _self.checkHeader(true);
            // } else if (target.scrollLeft == scorllW) {
            //     dom.getElementById("more_btn").style.display = "none";
            //     _self.checkHeader();
            // } else {
            //     _self.checkHeader();
            // }

            scroll_left = target.scrollLeft;
            if (!cookie.get("moreTip20190130") && !isParse) cookie.set("moreTip20190130", "Y");
        }

    }

    _self.scrollHorToRight = function () {
        dom.getElementById("more_btn").style.display = "none";
        dom.getElementById("data_right_scroll").scrollLeft = dom.getElementById("data_right_scroll").scrollWidth;
        if (!cookie.get("moreTip20190130")) cookie.set("moreTip20190130", "Y");
    }

    _self.checkHeader = function (close) {
        if (getView().viewportwidth < 1440) {
            if (dom.getElementById("td_total_fixed") != null) dom.getElementById("td_total_fixed").classList.add("re_td_fixed");
            if (dom.getElementById("td_result_fixed") != null) dom.getElementById("td_result_fixed").classList.add("re_td_fixed");
            if (dom.getElementById("td_header_fixed") != null) dom.getElementById("td_header_fixed").classList.add("re_td_fixed");
            for (var i = 0; i < idAry.length; i++) {
                if (dom.getElementById("td_" + idAry[i] + "_fixed") != null) dom.getElementById("td_" + idAry[i] + "_fixed").classList.add("re_td_fixed");
            }
        }

        if (close) {
            if (dom.getElementById("td_total_fixed") != null) dom.getElementById("td_total_fixed").classList.remove("re_td_fixed");
            if (dom.getElementById("td_result_fixed") != null) dom.getElementById("td_result_fixed").classList.remove("re_td_fixed");
            if (dom.getElementById("td_header_fixed") != null) dom.getElementById("td_header_fixed").classList.remove("re_td_fixed");
            for (var i = 0; i < idAry.length; i++) {
                if (dom.getElementById("td_" + idAry[i] + "_fixed") != null) dom.getElementById("td_" + idAry[i] + "_fixed").classList.remove("re_td_fixed");
            }
        }
    }


    _self.initSelectFun = function () {
        selectFun["result_type"] = _self.chgSel;
        selectFun["report_kind"] = _self.chgSel;
        selectFun["gtype"] = _self.chgSel;
        // selectFun["wtype"] = _self.chgSel;
    }

    _self.initReportTypeDiv = function () {
        if (postHash["view_layer"] == "list_bet" || postHash["view_layer"] == "mem"
            || par["report_kind"] == "D" || par["report_kind"] == "D4"
            || par["result_type"] == "N" ||
            ((top.login_layer == postHash["view_layer"]  || postHash["is_from_acc"]) && getView().viewportwidth < 1024)) {
            dom.getElementById("div_result_type").style.display = "none";
        } else {
            dom.getElementById("div_result_type").style.display = "";
        }
    }

    _self.initCalendar = function () {
        _self.setCalendar("start");
        _self.setCalendar("end");
    }

    _self.setCalendar = function (_name) {
        var sPar = new Object();
        sPar.div = dom.getElementById("filter_edit");
        sPar.input = dom.getElementById("input_" + _name);
        sPar.photo = dom.getElementById("date_" + _name);
        sPar.def_date = par["date_" + _name];
        sPar.langx = top.langx;
        sPar.CalendarClass = win.ClassFankCal_ag;
        sPar.period_ls = limitDate;
        sPar.WEB_TIME_ZONE = postHash["WEB_TIME_ZONE"];

        /*var sDate = new win.calendar_ag(win, dom);
        sDate.setParentclass(_self);
        sDate.setName(_name);
        sDate.init(sPar);*/

        if (_name == "start") {
            if (sDate == null) {
                sDate = new win.calendar_ag(win, dom);
                sDate.setParentclass(_self);
                sDate.setName(_name);
                sDate.init(sPar);
            } else {
                sDate.restart();
            }
        }
        if (_name == "end") {
            if (eDate == null) {
                eDate = new win.calendar_ag(win, dom);
                eDate.setParentclass(_self);
                eDate.setName(_name);
                eDate.init(sPar);
            } else {
                eDate.restart();
            }
        }
    }

    _self.addSelectEvent = function () {
        for (var rtype in selObj) {
            var ary = selObj[rtype];

            if (rtype != "report_kind") {
                var rDom = dom.getElementById(rtype + "_div");
                var rSel = dom.getElementById(rtype + "_sel");
                util.setInfEvent(rDom, { "_focus": rSel, "_setView": rDom, "_viewClass": "active" });
            }
            for (var i = 0; i < ary.length; i++) {
                var type = ary[i];
                util.addEvent(dom.getElementById(rtype + "_" + type), "click", selectFun[rtype], { "rtype": rtype, "type": type });
            }
        }
        util.addEvent(dom.getElementById("filter_cancel"), "click", _self.filterCancel);
        util.addEvent(dom.getElementById("filter_submit"), "click", _self.filterSubmit);
        dom.getElementById("filter_btn").style.display = "";
    }

    _self.chgSel = function (e, param) {
        var rtype = param.rtype;
        var type = param.type;

        if (rtype != "date") {
            selPar[rtype] = type;
            if (rtype == "report_kind") {

                selPar["result_type"] = "N";

            } else if (rtype == "result_type") {

                selPar["report_kind"] = "A";

            }
        }

        // util.echo("["+classname+"][chgSel]"+rtype+","+type);
        var tmpRtype = (rtype == "report_kind") ? "result_type" : rtype;
        dom.getElementById(tmpRtype + "_now").innerHTML = dom.getElementById(rtype + "_" + type).innerHTML;
    }

    _self.choseDateEvent = function (param) {
        //selPar["date_"+param.name] = param.date;
    }

    _self.resizeEvent = function () {
        var resize_model = util_report.getReportModel(top.report_model, getView);
        if (now_model != resize_model) {
            _self.getModel(false);
        }
    }

    _self.getModel = function (needGet) {
        // util.echo("getModel");
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        var tmpParm = "";
        if (top.login_layer == postHash["view_layer"]) {
            var view_w = getView().viewportwidth;
            if (view_w < 1024) {
                par["report_type"] = "set";
                if(postHash["is_from_acc"]) tmpParm += "&is_from_acc=Y";
                if(postHash["from_acc_layer"]) tmpParm += "&from_acc_layer="+postHash["from_acc_layer"];
            }
        }else if(postHash["is_from_acc"]!=null){
            var view_w = getView().viewportwidth;
            if (view_w < 1024) {
                par["report_type"] = "set";
                if(postHash["is_from_acc"]!=null) tmpParm += "&is_from_acc=Y";
                if(postHash["from_acc_layer"]!=null) tmpParm += "&from_acc_layer="+postHash["from_acc_layer"];
            }
        }


        var param = new Object();
        param["page"] = "report_model";
        param["target"] = "div_model";
        param["retFun"] = function () { _self.getModelComplete(needGet); };
        param["post"] = "view_layer=" + postHash["view_layer"] + "&report_type=" + par["report_type"] + "&result_type=" + par["result_type"] + "&report_kind=" + par["report_kind"] + tmpParm;
        parentClass.dispatchEvent("goToPage", param);
    }

    _self.getModelComplete = function (needGet) {
        if (needGet) {
            _self.getData();
        } else {
            _self.parseData(dataHash);
        }
    }

    _self.getData = function () {
        // util.echo(par, "getData");
        _self.initReportTypeDiv();
        var param = "";
        param += top.param;
        param += "&p=get_report_" + postHash["view_layer"];
        if (postHash["url_param"]) param += "&" + postHash["url_param"];

        var tmpGtype = (par["gtype"] == "ALL") ? "" : par["gtype"];
        var tmpWtype = (par["wtype"] == "ALL") ? "" : par["wtype"];

        param += "&report_kind=" + par["report_kind"];
        param += "&result_type=" + par["result_type"];
        param += "&date_start=" + par["date_start"].replace(/ /g, "");
        param += "&date_end=" + par["date_end"].replace(/ /g, "");
        param += "&gtype=" + tmpGtype;
        param += "&wtype=" + tmpWtype;
        if (postHash["is_from_acc"] && postHash["view_id"]) param += "&view_id=" + postHash["view_id"];
        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT") , postHash["chkFrame"]);
        hr.setParentclass(childClass);
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadComplete);
        hr.loadURL(top.url, "POST", param);


        var p = "";
        if (par["report_kind"] == "A") {
            p = (par["result_type"] == "Y") ? "set" : "un";
        } else {
            p = "cancel";
        }
        parentClass.dispatchEvent("chgPageName", { "pageType": "report", "pageName": p });
    }

    _self.onError = function () {

    }

    _self.LoadComplete = function (json) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }
        if (hash["status"] == "error") {
            util.showErrorMsg(hash["msg"]);
            _self.backPage();
        } else {
            dataHash = hash;

            _self.reSetLazy(hash["data"]["array"]["row0"]);

            _self.parseData(hash);
        }
    }

    _self.backPage = function (e, param) {
        parentClass.dispatchEvent("backPage", { "retFun": _self.backPageComplete });
    }

    _self.backPageComplete = function () {
        // util.echo("backPageComplete");
    }

    _self.parseData = function (hash) {
        try {
            var tmpWtype = (par["wtype"] == "") ? "ALL" : par["wtype"];
            var tmpGtype = (par["gtype"] == "") ? "ALL" : par["gtype"];

            var resultName = "";
            if (par["report_kind"] == "A") {
                resultName = dom.getElementById("result_type_" + par["result_type"]).innerHTML;
            } else {
                resultName = dom.getElementById("report_kind_" + par["report_kind"]).innerHTML;
            }
            dom.getElementById("result_name").innerHTML = resultName;
            dom.getElementById("sub_date").innerHTML = par["date_start"].replace(/ /g, "") + " ~ " + par["date_end"].replace(/ /g, "");
            dom.getElementById("sub_wtype").innerHTML = dom.getElementById("wtype_" + tmpWtype).innerHTML;
            dom.getElementById("sub_gtype").innerHTML = dom.getElementById("gtype_" + tmpGtype).innerHTML;
            dom.getElementById("input_start").innerHTML = par["date_start"];
            dom.getElementById("input_end").innerHTML = par["date_end"];
        } catch (e) {
            util.err("[" + classname + "]", e);
        }

        if (hash["status"] == "200") {
            row0 = hash["data"]["array"]["row0"];

            if (row0) {
                row0 = _self.sortData(row0, sort_type, sort_asc);
                var isDupLayer = (postHash["from_acc_layer"]==postHash["view_layer"]);
                now_model = util_report.getReportModel(top.report_model, getView, par["report_kind"], postHash["is_from_acc"],isDupLayer);

                util.echo("[" + classname + "][now_model]" + now_model);
                //console.log(now_model);
                var modelObj = dom.getElementById(now_model);
                var showObj = dom.getElementById("div_show");
                showObj.setAttribute("class", modelObj.getAttribute("class"));
                modelObj.innerHTML = modelObj.innerHTML.replace(/\*LAYER_NAME\*/g, LS_report.get("report_layer_" + postHash["view_layer"]));
                if (postHash["view_layer"] == "mem"){
                    util.classFunc(dom.getElementById("div_show"), "mem");
                }else{
                    util.classFunc(dom.getElementById("div_show"), "mem", "remove");
                }

                var tpl = new fastTemplate_a1();
                tpl.init(modelObj.cloneNode(true));
                tpl.addBlock("td");
                tpl.replace("*ADD_TD*", hash["data"]["array"]["total"]["HEADER"]);
                if(lazy_page==1){
                    var totalData = hash["data"]["array"]["total"];
                    tpl.addBlock("total");
                    for (var a = 0; a < totalAry.length; a++) {
                        var keys = totalAry[a];
                        if (totalData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), totalData[keys]);
                    }
                    tpl.addBlock("total1");
                    for (var a = 0; a < totalAry.length; a++) {
                        var keys = totalAry[a];
                        if (totalData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), totalData[keys]);
                    }


                    var tfootData = hash["data"]["array"]["tfoot"];
                    if (tfootData && tfootAry) {
                        tpl.addBlock("tfoot");
                        for (var a = 0; a < tfootAry.length; a++) {
                            var keys = tfootAry[a];
                            if (tfootData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), tfootData[keys]);
                        }
                        tpl.addBlock("tfoot1");
                        for (var a = 0; a < tfootAry.length; a++) {
                            var keys = tfootAry[a];
                            if (tfootData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), tfootData[keys]);
                        }
                    }

                }

                var tmpLoginLayer = (postHash["is_from_acc"] && getView().viewportwidth < 1024 && isDupLayer) ? postHash["from_acc_layer"] : top.login_layer;
                //var possessAry = new Array();

                // util.echo("[report_index]row0.length="+row0.length+",lazy_total_page="+lazy_total_page+",lazy_page="+lazy_page+",lazy_count="+lazy_count);
                var s = 0;
                var e = 0;
                if(lazy_sw){
                    s = (lazy_page - 1) * lazy_count;
                    e = (lazy_page == lazy_total_page) ? row0.length : lazy_page*lazy_count;
                }else{
                    s = 0;
                    e = row0.length;
                }
                // util.echo("[report_index]s="+s+",e="+e);
                for (var i = s; i < e; i++) {

                    var row0Data = row0[i];
                    tpl.addBlock("row0");
                    var rAry = rowAry[tmpLoginLayer + "_" + par["result_type"] + "_" + par["report_type"]];
                    if (par["report_kind"] == "D" || par["report_kind"] == "D4") {//取消單畫面要跟未有結果一樣
                        rAry = rowAry[top.login_layer + "_N_" + par["report_type"]];
                    }

                    for (var a = 0; a < rAry.length; a++) {
                        var keys = rAry[a];
                        if (postHash["view_layer"] != "mem") tpl.replace(new RegExp("\\\*MEMBER_CODE0\\\*", "gi"), "");
                        if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys]);
                        if (keys.indexOf("ID") != -1) idAry.push(row0Data[keys]);
                        if(keys=="TD_CONTENT"){
                            var small_td_content = row0Data.TD_CONTENT.replace(new RegExp(" \/ ", "gi"),"");
                            small_td_content = small_td_content.replace(new RegExp("_"+row0Data.ID, "gi"),"_small_"+row0Data.ID);
                            small_td_content = small_td_content.replace('<br>',"");
                            tpl.replace(new RegExp("\\\*ADD_TD_SMALL_CONTENT\\\*", "gi"), small_td_content);
                        }
                    }

                    tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
                    tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
                    tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"]);

                    if (row0Data["CANCEL_DIS"] == "") cancelAry.push(row0Data["WAGERS_ID"]);
                    if (top.report_model.indexOf("_ag_") != -1 && row0Data["DETIAL_DISPLAY0"] == "") possessAry.push(row0Data["ID0"]);

                    tpl.addBlock("row1");
                    for (var a = 0; a < rAry.length; a++) {
                        var keys = rAry[a];
                        if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys]);
                    }
                }

                if(lazy_page==1){
                    showObj.innerHTML = tpl.fastPrint();
                }else{
                    if (now_model == "report_s_model") {
                        var obj = showObj.children[0].children[0];
                        obj.innerHTML += tpl.getBlock("row0");
                    }else if (postHash["result_type"] == "Y" && postHash["view_layer"] != "list_bet"){
                        // 報表改結構 有調整的畫面層級不同
                        var tmpObj = util.getObjAry(showObj, ",data_right_scroll,");
                        var obj = tmpObj["data_right_scroll"].children[0];
                        obj.innerHTML += tpl.getBlock("row0");

                        var obj = tmpObj["data_right_scroll"].nextElementSibling;
                        obj.innerHTML += tpl.getBlock("row1");
                    }else{
                        var obj = dom.getElementById("re_body_scroll").children[0].children[0].children[0];
                        obj.innerHTML += tpl.getBlock("row0");
                    }
                }

                _self.showNodata(false);
                if (util.in_array(top.report_model,tmpModelAry)) _self.setCancelClick(cancelAry);
                //if (top.report_model == "report_list_bet")_self.setCancelClick(cancelAry);
                if (top.report_model.indexOf("_ag_") != -1) _self.setPossessClick(possessAry);
                _self.setUserClick(hash["data"]["array"]["view_layer"]);
                _self.setSortClick(true);
                _self.setDetailClick(row0);
                _self.initScroll();

                if (postHash["view_layer"] == "list_bet") _self.hideLevel(showObj, disAry);

            } else {
                _self.showNodata(true);
            }
        } else {
            if (hash["status"] == "error") {
                util.showErrorMsg(hash["msg"]);
            } else {
                util.showErrorMsg("data error");
            }
        }
        _self.checkShowLazyLoading(dom.getElementById("body_show"));
        dom.getElementById("body_show").style.overflowY = "scroll";
        _self.showSubMessage(hash["sub"]);
        //_self.set_scroll_left();
        _self.scroll_hor_event(dom.getElementById("re_body_scroll"),true);
        _self.scroll_ver_event(scroll_e, dom.getElementById("re_body"));
        _self.setLzayLoadingVisible(false);

        if (hash["status"] == "200" && lazy_page == 1) {
            _self.copyData();
        }

        parentClass.dispatchEvent("showLoading", { "showLoading": false });
    }

    _self.showSubMessage = function(hash){
        if(!hash) return;
        if(hash["sub_message"]=="Y"){
            dom.getElementById("sub_message").style.display = "";
            dom.getElementById("sub_num").innerHTML = hash["sub_num"];
            dom.getElementById("total_num").innerHTML = hash["total_num"];
        }else{
            dom.getElementById("sub_message").style.display = "none";
        }
    }

    _self.getDisObj=function(){
        var disAry = new Object();
        disAry["com"] = (top.login_layer == "co") ? "" : "hide_item";
        disAry["co"] = disAry["com"];
        disAry["su"] = (top.login_layer == "co" || top.login_layer == "su") ? "" : "hide_item";
        return disAry;
    }
    _self.hideLevel = function (showObj, disAry) {
        var titAry = util.getObjAry(showObj, ",title_com,title_co,title_su,");
        if (titAry["title_com"]) titAry["title_com"].style.display = (disAry["com"] != "") ? "none" : "";
        if (titAry["title_co"]) titAry["title_co"].style.display = (disAry["co"] != "") ? "none" : "";
        if (titAry["title_su"]) titAry["title_su"].style.display = (disAry["su"] != "") ? "none" : "";
    }

    _self.hideLevelAry = function (showObj, disAry) {

        for(var keys in disAry){
            if(disAry[keys]!=""){
                var ary = dom.getElementsByName("title_"+keys);
                for(var i=0; i<ary.length; i++){
                    ary[i].style.display = "none";
                }
            }
        }
    }


    _self.set_scroll_top = function () {
        util.echo("[report_index]set_scroll_top");
        if(lazy_page==1) dom.getElementById("body_show").scrollTop = 0;
    }

    _self.set_scroll_left = function () {
        dom.getElementById("re_body_scroll").scrollLeft = scroll_left;
    }

    _self.setPossessClick = function (ary) {
        for (var i = 0; i < ary.length; i++) {
            var _open = dom.getElementById("open_poss_" + ary[i]);
            if(_open!=null)_open.style.display = "";
            var par = new Object();
            par.id = "box_poss_" + ary[i];
            par.target = "div_poss_" + ary[i];

            util.addEvent(_open, "click", _self.setPossess, par);
        }
    }

    _self.setPossess = function (e, _param) {
        var target = dom.getElementById(_param.target);
        if (target.children.length == 0) {
            var urlParams = "";
            var data_winloss = target.getAttribute("data-winloss");
            eval("data_winloss=" + data_winloss);

            urlParams += "uid=" + top.uid;
            urlParams += "&login_layer=" + top.login_layer;
            for (var k in data_winloss) {
                urlParams += "&" + k + "=" + data_winloss[k];
            }
            urlParams += "&date_start=" + par["date_start"];
            urlParams += "&date_end=" + par["date_end"];
            urlParams = "p=get_winloss_detail&ver=" + top.ver + "&" + urlParams;
            var getHTML = new HttpRequest();
            getHTML.addEventListener("onError", _self.onError);
            getHTML.addEventListener("LoadComplete", _self.buildPossess);
            getHTML.loadURL(top.url, "POST", urlParams);
        }

        /*
        if (!possess_sw) {
            if (!dom.getElementById(_param.id).classList.contains("active")) dom.getElementById(_param.id).classList.add("active");
        } else {
            if (dom.getElementById(_param.id).classList.contains("active")) dom.getElementById(_param.id).classList.remove("active");
        }
        possess_sw = !possess_sw;
        */
        var box_Obj = dom.getElementById(_param.id) ;
        if (!box_Obj.classList.contains("active")){
            _self.possess_open(box_Obj) ;
        }else{
            _self.possess_close(box_Obj) ;
        }
    }

    // 開啟佔成紀錄
    _self.possess_open = function (do_Obj) {
        do_Obj.classList.add("active");
        possess_openAry[do_Obj.id] = do_Obj;
    }

    // 關閉佔成紀錄
    _self.possess_close = function (do_Obj) {
        do_Obj.classList.remove("active");
        delete possess_openAry[do_Obj.id];
    }

    // 關閉所有已開啟的佔成紀錄框框
    _self.possess_close_all = function () {
        for (var key in possess_openAry) {
            _self.possess_close(possess_openAry[key]);
        }
    }

    _self.buildPossess = function (hash) {
        var dataAry = JSON.parse(hash);
        var winlossAry = dataAry["data"]["winloss_data"];
        var edit_model = dom.getElementById("edit_poss_container");

        var tpl = new fastTemplate_a1();
        tpl.init(edit_model.cloneNode(true));
        ary = new Array("WINLOSS0", "DATE0", "TIME0");
        for (var i = 0; i < winlossAry.length; i++) {
            tpl.addBlock("info");
            for (var a = 0; a < ary.length; a++) {
                var keys = ary[a];
                // console.log("["+keys+"] = "+winlossAry[i][keys]);
                tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), util.showTxt(winlossAry[i][keys]));
            }
        }

        var showObj = dom.getElementById("div_poss_" + dataAry["data"]["id"]);
        // console.log(showObj);
        showObj.innerHTML = tpl.fastPrint();
    }


    _self.setCancelClick = function (ary) {
        for (var i = 0; i < ary.length; i++) {
            var _div = dom.getElementById("open_anno_" + ary[i]);
            var par = new Object();
            par.isShow = true;
            //2019-04-01 Ricky 取消單的驚嘆號按鈕，配合橘子更改層級。
            //par.id = "div_anno_" + ary[i];
            par.id = "open_anno_" + ary[i];
            util.addEvent(_div, "click", _self.showCancel, par);

            var _close = dom.getElementById("close_anno_" + ary[i]);
            var par_close = new Object();
            par_close.isShow = false;
            //2019-04-01 Ricky 取消單的驚嘆號按鈕，配合橘子更改層級。
            //par.id = "div_anno_" + ary[i];
            par_close.id = "open_anno_" + ary[i];
            util.addEvent(_close, "click", _self.showCancel, par_close);
        }
    }

    _self.showCancel = function (e, par) {
        //2019-04-01 Ricky 487.報表-細單-點開"i"取消單公告, 在點另一個公告, 另一個要收起來 只需顯示一個
        for (var i = 0; i < cancelAry.length; i++) {
            dom.getElementById("open_anno_"+cancelAry[i]).classList.remove("active");
        }

        if (par.isShow) {
            if (!dom.getElementById(par.id).classList.contains("active")) dom.getElementById(par.id).classList.add("active");
        } else {
            if (dom.getElementById(par.id).classList.contains("active")) dom.getElementById(par.id).classList.remove("active");
        }
    }

    _self.setUserClick = function (view_layer) {
        var objs = document.getElementsByName("user_btn");
        for (var i = 0; i < objs.length; i++) {
            _self.addUserClick(objs[i], objs[i].getAttribute("data-url"), view_layer);
        }
        if (cookie.get("isclick") != null) {
            _self.giveColor(objs);
        }
    }


    //============== test 換顏色
    _self.giveColor = function (objs) {
        // var numcookie = cookie.get("isclick").split("*").length;
        //console.log(objs);
        var isclickarr = cookie.get("isclick").split("*");
        // console.log("isclickarr", isclickarr);
        // console.log("objs", objs);
        // console.log("objs", objs[0].innerText);
        for (i = 0; i < objs.length; i++) {
            var url = objs[i].getAttribute("data-url");
            var usersp = url.split("&");
            var userorigin = usersp[usersp.indexOf(usersp[usersp.length - 3])];
            // console.log("test1", url);
            // console.log("test2", userorigin);
            if (isclickarr.indexOf(userorigin) >= 0) {
                var test = objs[i];
                test.classList.add("on");
            }
        }
    }




    _self.addUserClick = function (obj, _post, view_layer) {
        var p = (_post && _post.indexOf("*") == -1) ? _post : "";

        var hash = _self.coverToHash(_post);
        var pHash = new Object();
        pHash["report_kind"] = par["report_kind"];
        pHash["report_type"] = par["report_type"];
        pHash["result_type"] = par["result_type"];
        pHash["date"] = par["date"];
        pHash["date_start"] = par["date_start"];
        pHash["date_end"] = par["date_end"];
        pHash["gtype"] = par["gtype"];
        pHash["wtype"] = par["wtype"];
        pHash["view_layer"] = view_layer;
        pHash["url_param"] = p;
        if(postHash["is_from_acc"]!=null) pHash["is_from_acc"] = postHash["is_from_acc"];
        if(postHash["from_acc_layer"]!=null) pHash["from_acc_layer"] = postHash["from_acc_layer"];

        var param = new Object();
        param["page"] = "report_" + view_layer;
        param["postHash"] = pHash;
        param["post"] = "view_layer=" + view_layer;
        param["extendsClass"] = "report_index";

        util.addEvent(obj, "click", _self.gotoNext, param);

    }



    _self.setSortClick = function (isSet) {
        var objs = document.getElementsByName("sort_btn");
        for (var i = 0; i < objs.length; i++) {
            var obj = objs[i];
            var tmp_sort = obj.getAttribute("data-sort");
            if (isSet) _self.addSortClick(obj, tmp_sort);

            obj.classList.remove("sort_up");
            obj.classList.remove("sort_down");

            if (sort_type == tmp_sort) {
                var sty = sort_asc ? "sort_down" : "sort_up";
                obj.classList.add(sty);
            }
        }
    }

    _self.coverToHash = function (_post) {
        var hash = new Object();
        var tmp = _post.split("&");
        for (var i = 0; i < tmp.length; i++) {
            var t = tmp[i].split("=");
            hash[t[0]] = t[1];
        }
        return hash;
    }

    _self.setDetailClick = function (dataAry) {
        for (var i = 0; i < dataAry.length; i++) {
            var _name = "";
            if (postHash["view_layer"] == "list_bet") {
                _name = "tid_" + dataAry[i]["WAGERS_ID"];
                util.addEvent(dom.getElementById(_name), "click", _self.viewDetail, dataAry[i]);

                var _swap = "swap_"+dataAry[i]["ID"];
                var _swap_small = "swap_small_"+dataAry[i]["ID"];
                util.addEvent(dom.getElementById(_swap), "click", _self.viewSwap, dataAry[i]);
                util.addEvent(dom.getElementById(_swap_small), "click", _self.viewSwap, dataAry[i]);

                var _delete = "delete_"+dataAry[i]["ID"];
                var _delete_small = "delete_small_"+dataAry[i]["ID"];
                util.addEvent(dom.getElementById(_delete), "click", _self.viewDelete, dataAry[i]);
                util.addEvent(dom.getElementById(_delete_small), "click", _self.viewDelete, dataAry[i]);

                var _hidden = "hidden_"+dataAry[i]["ID"];
                var _hidden_small = "hidden_small_"+dataAry[i]["ID"];
                util.addEvent(dom.getElementById(_hidden), "click", _self.viewHidden, dataAry[i]);
                util.addEvent(dom.getElementById(_hidden_small), "click", _self.viewHidden, dataAry[i]);

                var _manage = "manage_"+dataAry[i]["ID"];
                var _manage_small = "manage_small_"+dataAry[i]["ID"];
                util.addEvent(dom.getElementById(_manage), "change", _self.viewManage, dataAry[i]);
                util.addEvent(dom.getElementById(_manage_small), "change", _self.viewManage, dataAry[i]);

                var _edit = "edit_"+dataAry[i]["ID"];
                var _edit_small = "edit_small_"+dataAry[i]["ID"];
                util.addEvent(dom.getElementById(_edit), "click", _self.viewEdit, dataAry[i]);
                util.addEvent(dom.getElementById(_edit_small), "click", _self.viewEdit, dataAry[i]);

                var _result = "result_"+dataAry[i]["ID"];
                var _result_small = "result_small_"+dataAry[i]["ID"];
                util.addEvent(dom.getElementById(_result), "click", _self.viewResult, dataAry[i]);
                util.addEvent(dom.getElementById(_result_small), "click", _self.viewResult, dataAry[i]);
            } else {
                _name = "accid_" + dataAry[i]["ID0"];
                util.addEvent(dom.getElementById(_name), "click", _self.viewAccDetail, dataAry[i]);
            }

        }
    }

    _self.viewManage = function(e,param){
        var par = "";
        par+=top.param;
        par+="&p=get_bet_edit";
        par+="&action=manage";
        par+="&betid="+param["ID"];
        par+="&status="+e.target.value;
        _self.loadBetEdit(par);
    }

    _self.viewHidden = function(e,param){
        var par = "";
        par+=top.param;
        par+="&p=get_bet_edit";
        par+="&action=hidden";
        par+="&betid="+param["ID"];
        _self.loadBetEdit(par);
    }

    _self.viewDelete = function(e,param){
        var msg = "删除后不能恢复,现金玩家会退还额度,您确定要删除该注单吗？";
        if (confirm(msg)==true) {
            var par = "";
            par+=top.param;
            par+="&p=get_bet_edit";
            par+="&action=delete";
            par+="&betid="+param["ID"];
            _self.loadBetEdit(par);
        }
    }

    _self.viewSwap = function(e,param){
        var par = "";
        par+=top.param;
        par+="&p=get_bet_edit";
        par+="&action=swap";
        par+="&betid="+param["ID"];
        _self.loadBetEdit(par);

    }

    _self.loadBetEdit = function(par){
        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadBetEditFinish);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.loadBetEditFinish = function(json){
        var hash;
        try {
            hash = JSON.parse(json);
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }

        if(hash.status == "success"){
            parentClass.dispatchEvent("showFadeOutMesg", { "text": hash.msg ,"s":5 , "showCopy":"N","value":"" });
            _self.getData();
        }else{
            parentClass.showAlertMsg(hash);
        }
    }

    _self.viewResult = function(e,param){
        try {
            if (e.target.id.indexOf("anno") != -1) return;
            // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
            _self.closeAccDetail();
            nowDetail = "tid_"+param["TID"];
            dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
        } catch (e) { }
        parentClass.dispatchEvent("showBetResult", {"row0": param });
    }

    _self.viewEdit = function(e,param){
        try {
            if (e.target.id.indexOf("anno") != -1) return;
            // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
            _self.closeAccDetail();
            nowDetail = "tid_"+param["TID"];
            dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
        } catch (e) { }
        parentClass.dispatchEvent("showBetEdit", {"row0": param });
    }

    _self.closeBetEditSuccess = function(){
        _self.getData();
    }

    _self.closeAccEditDetail = function(){
        _self.getData();
        if(dom.getElementById(nowDetail)) dom.getElementById(nowDetail).classList.remove("tr_bgebf7ff");
    }

    _self.viewDetail = function (e, param) {
        try {
            if (e.target.id.indexOf("anno") != -1) return;
            // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
            _self.closeAccDetail();
            nowDetail = "tid_"+param["WAGERS_ID"];
            dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
        } catch (e) { }
        parentClass.dispatchEvent("showReportDetail", { "view_layer": postHash["view_layer"], "result_type": par["result_type"], "row0": param });
    }

    _self.viewAccDetail = function (e, param) {
        try {
            if (e.target.getAttribute("data-url") != null) return;
            if (e.target.id.indexOf("open_poss")!= -1) return;
            // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
            _self.closeAccDetail();
            nowDetail = "accid_"+param["ID0"];
            dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
        } catch (e) { }
        var model_name = util_report.getReportModel(top.report_model, getView, par["report_kind"], postHash["is_from_acc"]);
        parentClass.dispatchEvent("showAccDetail", { "view_layer": postHash["view_layer"], "report_type": par["report_type"], "row0": param, "model": dom.getElementById(model_name).outerHTML });
    }

    // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
    _self.closeAccDetail = function(){
        if(dom.getElementById(nowDetail)) dom.getElementById(nowDetail).classList.remove("tr_bgebf7ff");
    }

    _self.addSortClick = function (obj, sort_type) {
        if (!sort_type) return;
        util.addEvent(obj, "click", _self.chgSortField, { "sort_type": sort_type });
    }

    _self.chgSortField = function (e, param) {

        if (sort_type == param.sort_type) {
            sort_asc = !sort_asc;
        } else {
            sort_type = param.sort_type;
            sort_asc = true;
        }
        _self.setSortClick(false);
        _self.reSetLazy(dataHash["data"]["array"]["row0"]);

        _self.set_scroll_top();
        _self.parseData(dataHash);

    }

    _self.chgToArray = function (datas) {
        var data_ary = new Array()
        if (datas == null) {
            ;
        } else if (datas[0] == null) {
            data_ary[data_ary.length] = datas;
        } else {
            data_ary = datas;
        }
        return data_ary;
    }

    _self.sortData = function (ary, types, up_down) {
        if (ary.length <= 1) return ary;
        var string_type = ",NAME0,ALIAS0,DATETIME,";
        if (string_type.indexOf(types) == -1) {
            //var Reverse_type = ",GOLD,GOLD0,WIN_GOLD,WCOUNT0,";
            //if (Reverse_type.indexOf(types) != -1) up_down = !up_down;
            var reTag = /<(?:.|\s)*?>/g;
            if (up_down) {
                //大到小排序
                var sortfun = function (a, b) {
                    var ret;
                    a[types] = a[types] + "";
                    b[types] = b[types] + "";
                    var a_val = a[types].replace(/,/g, "").replace(reTag,"") * 1;
                    var b_val = b[types].replace(/,/g, "").replace(reTag,"") * 1;
                    if (isNaN(a_val)) a_val = 0;
                    if (isNaN(b_val)) b_val = 0;
                    //console.log(a[types]+"=>"+a[types].replace(",","")*1)
                    ret = (b_val - a_val);
                    //console.log( a[types].replace(",","")*1 +"-"+ b[types].replace(",","")*1 +" = "+ ret);
                    return ret;
                }
            } else {
                //小到大排序
                var sortfun = function (a, b) {
                    var ret;
                    a[types] = a[types] + "";
                    b[types] = b[types] + "";
                    var a_val = a[types].replace(/,/g, "").replace(reTag,"") * 1;
                    var b_val = b[types].replace(/,/g, "").replace(reTag,"") * 1;
                    if (isNaN(a_val)) a_val = 0;
                    if (isNaN(b_val)) b_val = 0;
                    //console.log(b[types]+"=>"+b[types].replace(",","")*1)
                    ret = (a_val - b_val);
                    //console.log( b[types].replace(",","")*1 +"-"+ a[types].replace(",","")*1 +" = "+ ret);
                    return ret;
                }
            }

        } else {
            if (up_down) {
                var sortfun = function (a, b) {
                    var ret;
                    ret = (b[types].localeCompare(a[types]));
                    //console.log(b[types] +" > "+ a[types] +" = "+ret);
                    return ret;
                }
            } else {
                var sortfun = function (a, b) {
                    var ret;
                    ret = (a[types].localeCompare(b[types]));
                    //console.log(a[types] +" > "+ b[types] +" = "+ret);
                    return ret;
                }
            }
        }
        return ary.sort(sortfun)
    }


    _self.gotoNext = function (e, param) {
        _self.checkReport(_self.chg_page, param);
        _self.setPurple(param);
    }

    _self.setPurple = function (param) {
        var user = param.postHash.url_param;
        var usersp = user.split("&");
        var userorigin = usersp[usersp.indexOf(usersp[usersp.length - 3])];
        var userlayer = userorigin.substr(0, (userorigin.search("=")));
        var username = userorigin.substr((userorigin.search("=") + 1));
        // console.log("userlayer", userlayer);
        // console.log("userlayer", username);
        if (userlayer == "ad_user" || userlayer == "d0_user" || userlayer == "co_user" || userlayer == "su_user" || userlayer == "ag_user" || userlayer == "mem_user") {
            if (cookie.get("isclick") == undefined) {
                cookie.set("isclick", "");
                // if ((cookie.get("isclick").match(userlayer + username)) == null) {
                cookie.set("isclick", userlayer + "=" + username + "*" + cookie.get("isclick"));
                // }
            }
            else {
                if ((cookie.get("isclick").match(userlayer + "=" + username)) == null) {
                    cookie.set("isclick", userlayer + "=" + username + "*" + cookie.get("isclick"));
                }
            }
        }
    }


    _self.dateFormat = function (d) {
        return d.replace(/ /g, "");
    }

    _self.showDate = function (d) {
        var date = d;
        date = date.replace(/ /g, "");
        date = date.replace(/-/g, "-");
        return date;
    }

    _self.checkReport = function (retFun, param) {
        var str = "";
        str += top.param;
        str += "&p=check_report";
        str += "&date_start=" + _self.dateFormat(dom.getElementById("input_start").value);
        str += "&date_end=" + _self.dateFormat(dom.getElementById("input_end").value);
        str += "&result_type=" + selPar["result_type"];
        str += "&report_kind=" + selPar["report_kind"];
        selPar["date_start"] = dom.getElementById("input_start").value;
        selPar["date_end"] = dom.getElementById("input_end").value;

        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT") , postHash["chkFrame"]);
        hr.setParentclass(childClass);
        hr.addEventListener("onError", function () { });
        hr.addEventListener("LoadComplete", function (json) {
            var hash;
            try {
                hash = JSON.parse(json);
                if (util.chkErrorMsg(hash, LS_code)) return;
            } catch (e) {
                util.err("[" + classname + "]", e);
                return;
            }

            if (hash["status"] == "200") {
                par = util.clone(selPar);
                retFun(param);
            } else {
                selPar = util.clone(par);
                if (par["report_kind"] == "A") {
                    _self.chgSel(null, { "rtype": "result_type", "type": par["result_type"] });
                } else {
                    _self.chgSel(null, { "rtype": "report_kind", "type": par["report_kind"] });
                }
                _self.chgSel(null, { "rtype": "gtype", "type": par["gtype"] });
                _self.chgSel(null, { "rtype": "wtype", "type": par["wtype"] });
                dom.getElementById("input_start").value = _self.showDate(par["date_start"]);
                dom.getElementById("input_end").value = _self.showDate(par["date_end"]);
                util.showErrorMsg(hash["msg"]);
            }
        });
        hr.loadURL(top.url, "POST", str);
    }

    _self.chg_page = function (param) {
        _self.chgPage(null, param);
    }

    _self.chgPage = function (e, param) {
        if(postHash["is_from_acc"]){
            var clonePostHash = util.clone(param["postHash"]);
            clonePostHash["chkFrame"] = postHash["chkFrame"];
            param["target"] = "div_acc_report";
            param["retFun"] = parentClass.loadSubFrame;
            param["postHash"] = clonePostHash;
            parentClass.dispatchEvent("goToPage", param);
        }else{
            parentClass.dispatchEvent("bodyGoToPage", param);
        }

    }

    _self.chgReportType = function (e, param) {
        par["report_type"] = param.type;
        _self.initReportType();
        // 2019-06-17 lazy loading 需要重新取模組
        _self.getModel(true);
    }

    _self.initReportType = function () {
        for (var i = 0; i < reportTypeAry.length; i++) {
            var _name = reportTypeAry[i];
            dom.getElementById(_name + "_btn").classList.remove("on");
        }
        dom.getElementById(par["report_type"] + "_btn").classList.add("on");
    }
    //============== filter ==============
    _self.showMenuFilter = function (e, param) {
        // util.echo("show filter");
        var obj = dom.getElementById("burger_div");
        if (obj.classList.contains("active")) {
            obj.classList.remove("active");
        } else {
            obj.classList.add("active");
            obj.focus();
        }
    }

    _self.hideMenuFilter = function () {
        // dom.getElementById("burger_menu").style.display = "none";
        // var obj = dom.getElementById("burger_div");
        // if (obj.classList.contains("active")){
        //     obj.classList.remove("active");
        // }
    }

    _self.showFilter = function (e, param) {
        // _self.hideMenuFilter();
        _self.show_filter();
        _self.hideBtn();
    }

    _self.show_filter = function () {
        dom.getElementById("filter_div").style.display = "";
        dom.getElementById("filter_div").prevScrollBottomIgnore = true;//橫向滾軸物件判斷使用
        dom.getElementById("filter_edit").style.display = "none";
    }

    _self.hideFilter = function () {
        dom.getElementById("filter_div").style.display = "none";
        dom.getElementById("filter_edit").style.display = "none";
        // _self.hideMenuFilter();
        _self.showBtn();
    }

    _self.showBtn = function () {
        dom.getElementById("show_filter").style.display = "";
        dom.getElementById("hide_filter").style.display = "none";
    }

    _self.hideBtn = function () {
        dom.getElementById("show_filter").style.display = "none";
        dom.getElementById("hide_filter").style.display = "";
    }


    _self.showEditFilter = function () {
        dom.getElementById("filter_div").style.display = "none";
        dom.getElementById("filter_edit").style.display = "";
    }

    _self.editFilter = function (e, param) {
        // _self.hideMenuFilter();
        if (getView().viewportwidth < 1024) {
            parentClass.dispatchEvent("showFilter", par);
        } else {
            _self.hideBtn();
            _self.showEditFilter();
        }
    }

    _self.setColumn = function (_totalAry, _rowAry, _tfootAry) {
        excel_totalAry = _totalAry;
        excel_rowAry = _rowAry;
        excel_tfootAry = _tfootAry;
    }

    _self.exportExcel = function (e, param){
        var param = new Object();
        param["page"] = "report_excel";
        param["target"] = "excel_model";
        param["useDefineParent"] = "Y";
        param["parentClass"] = _self;
        param["retFun"] = _self.openExcelDivComplete;
        param["retParam"] = dataHash;

        parentClass.dispatchEvent("goToPage", param);
    }

    _self.copyData = function (e, param) {
        var param = new Object();
        param["page"] = "report_excel";
        param["target"] = "excel_model";
        param["useDefineParent"] = "Y";
        param["parentClass"] = _self;
        param["retFun"] = _self.copyDataComplete;
        param["retParam"] = dataHash;

        parentClass.dispatchEvent("goToPage", param);
    }

    _self.copyDataComplete = function (hash) {
        var now_model = "report_" + postHash["view_layer"] + "_excel";
        var modelObj = dom.getElementById(now_model);
        var showObj = dom.getElementById("myText");

        var tpl = new fastTemplate_a1();
        tpl.init(modelObj.cloneNode(true));

        if (hash["status"] == "200") {
            var excel_row0 = util.clone(hash["data"]["array"]["row0"]);
            if (excel_row0) {

                var tmpLoginLayer = postHash["view_layer"];
                var totalData = hash["data"]["array"]["total"];
                tpl.addBlock("total");
                var totalAry = excel_totalAry[tmpLoginLayer];
                for (var a = 0; a < totalAry.length; a++) {
                    var keys = totalAry[a];
                    if (totalData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), totalData[keys]);
                }

                tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
                tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
                tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"]);

                var tfootData = hash["data"]["array"]["tfoot"];

                if (tfootData && excel_tfootAry) {
                    tpl.addBlock("tfoot");
                    for (var a = 0; a < excel_tfootAry.length; a++) {
                        var keys = excel_tfootAry[a];
                        if (tfootData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), tfootData[keys]);
                    }
                }

                for (var i = 0; i < excel_row0.length; i++) {
                    var row0Data = excel_row0[i];
                    var isP = (row0Data["IS_P"] != null && row0Data["IS_P"] != "");
                    if (isP) {
                        // 過關細單
                        for (var k = 0; k < row0Data["TNAME_P"].length; k++) {
                            tpl.addBlock("row0");
                            var rAry = excel_rowAry[tmpLoginLayer];
                            // 表格欄位
                            for (var a = 0; a < rAry.length; a++) {
                                var keys = rAry[a];
                                // 過關第一串包含『母單資訊』
                                if (k == 0) {
                                    if (keys == "IS_P" && row0Data[keys] != "") {
                                        var parlay_count = row0Data["TNAME_P"].length;
                                        //要顯示球類過關 EX: Tennis Mix Parlay (x Selections)
                                        row0Data[keys] = row0Data[keys] + "<br>(" + parlay_count + " " + LS_report.get("parlay_selection") + ")";
                                    }
                                    // 過關其他串則只顯示『細單內容』及『結果』
                                } else {
                                    row0Data[keys] = "";
                                }
                                var parlayData = row0Data["TNAME_P"][k];

                                // 細單內容
                                if (keys == "TNAME") {
                                    // 過關細單model
                                    var par_model = dom.getElementById("parlay_detail_model");
                                    var tmp = par_model.cloneNode(true);
                                    var tmpAry = new Array("DATE", "WAGERS_TYPE", "LEAGUE", "TEAM_H", "CON_H", "TEAM_C", "CON_C", "NUM_H", "NUM_C", "ORDER_TYPE", "ORDER_CON", "IORATIO");
                                    for (var p = 0; p < tmpAry.length; p++) {
                                        var par_key = tmpAry[p];
                                        if (parlayData["STRONG"] == "Y") {
                                            if (parlayData["BET_TYPE"] == "H") {
                                                parlayData["CON_H"] = parlayData["CON"];
                                                parlayData["CON_C"] = "";
                                            } else {
                                                parlayData["CON_C"] = parlayData["CON"];
                                                parlayData["CON_H"] = "";
                                            }
                                        } else if (parlayData["STRONG"] == "N") {
                                            if (parlayData["BET_TYPE"] == "H") {
                                                parlayData["CON_C"] = parlayData["CON"];
                                                parlayData["CON_H"] = "";
                                            } else {
                                                parlayData["CON_H"] = parlayData["CON"];
                                                parlayData["CON_C"] = "";
                                            }
                                            parlayData["ORDER_CON"] = "";
                                        }
                                        if (parlayData[par_key] != null) tmp.innerHTML = tmp.innerHTML.replace(new RegExp("\\\*" + par_key + "\\\*", "gi"), parlayData[par_key]);
                                    }
                                    row0Data[keys] = tmp.innerHTML;
                                    // 細單結果
                                } else if (keys == "RESULT_WL") {
                                    var tmp_data = (par["result_type"] == "N") ? "_" : parlayData[keys] ;
                                    row0Data[keys] = tmp_data;
                                }
                                if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys]);
                            }
                            tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
                            tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
                            tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"]);
                        }
                    } else {

                        tpl.addBlock("row0");
                        var rAry = excel_rowAry[tmpLoginLayer];
                        for (var a = 0; a < rAry.length; a++) {
                            var keys = rAry[a];
                            if (keys == "RESULT_WL") {
                                var tmp_data = (par["result_type"] == "N") ? "_" : row0Data[keys];
                                row0Data[keys] = tmp_data;
                            }
                            if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys]);
                        }

                        tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
                        tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
                        tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"]);
                    }
                }

                showObj.innerHTML = tpl.fastPrint();
            }
        }
        if (postHash["view_layer"] == "list_bet") _self.hideLevel(showObj, disAry);

        _self.hideLevelAry(showObj, disAry);
        var param = new Array();
        var adiv = dom.createElement("div");

        var tmpDiv = dom.getElementById("myText").cloneNode(true);
        tmpDiv = _self.removeHideDiv(tmpDiv);

        var tmp_html = tmpDiv.innerHTML;
        adiv.innerHTML = tmp_html;

    }

    _self.copyTable = function () {
        var el = dom.getElementById("myText");
        el.style.display = "";
        var range = dom.createRange();
        range.selectNodeContents(el);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        el.style.display = "none";
        parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("str_copied"), "s": 1, "showCopy": "N", "value": "" });
    }

    _self.openExcelDivComplete=function(hash){
        var now_model = "report_" +postHash["view_layer"] + "_excel";
        util.echo("[report_excel][now_model]" + now_model);
        var modelObj = dom.getElementById(now_model);
        var showObj = dom.getElementById("excel_show");

        var tpl = new fastTemplate_a1();
        tpl.init(modelObj.cloneNode(true));

        if(hash["status"] == "200"){
            var excel_row0 = util.clone(hash["data"]["array"]["row0"]);
            if(excel_row0){

                var tmpLoginLayer = postHash["view_layer"];
                var totalData = hash["data"]["array"]["total"];

                tpl.addBlock("total");
                var totalAry = excel_totalAry[tmpLoginLayer];
                for (var a = 0; a < totalAry.length; a++) {
                    var keys = totalAry[a];
                    if (totalData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), totalData[keys]);
                }

                tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
                tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
                tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"]);

                var tfootData = hash["data"]["array"]["tfoot"];

                if (tfootData && excel_tfootAry) {
                    tpl.addBlock("tfoot");
                    for (var a = 0; a < excel_tfootAry.length; a++) {
                        var keys = excel_tfootAry[a];
                        if (tfootData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), tfootData[keys]);
                    }
                }

                for (var i = 0; i < excel_row0.length; i++) {
                    var row0Data = excel_row0[i];
                    var isP = (row0Data["IS_P"]!=null && row0Data["IS_P"]!="");
                    if(isP){
                        // 過關細單
                        for(var k = 0; k < row0Data["TNAME_P"].length; k++){
                            tpl.addBlock("row0");
                            var rAry = excel_rowAry[tmpLoginLayer];
                            // 表格欄位
                            for (var a = 0; a < rAry.length; a++) {
                                var keys = rAry[a];
                                // 過關第一串包含『母單資訊』
                                if(k==0){
                                    if(keys == "IS_P" && row0Data[keys] != "") {
                                        var parlay_count = row0Data["TNAME_P"].length;
                                        //要顯示球類過關 EX: Tennis Mix Parlay (x Selections)
                                        row0Data[keys] = row0Data[keys] + "<br>("+parlay_count+" "+LS_report.get("parlay_selection")+")";
                                    }
                                // 過關其他串則只顯示『細單內容』及『結果』
                                }else{
                                    row0Data[keys] = "";
                                }
                                var parlayData = row0Data["TNAME_P"][k];

                                // 細單內容
                                if(keys == "TNAME"){
                                    // 過關細單model
                                    var par_model = dom.getElementById("parlay_detail_model");
                                    var tmp = par_model.cloneNode(true);
                                    var tmpAry = new Array("DATE","WAGERS_TYPE","LEAGUE","TEAM_H","CON_H","TEAM_C","CON_C","NUM_H","NUM_C","ORDER_TYPE","ORDER_CON","IORATIO");
                                    for(var p =0; p < tmpAry.length; p++){
                                        var par_key = tmpAry[p];
                                        if(parlayData["STRONG"]=="Y"){
                                            if(parlayData["BET_TYPE"]=="H"){
                                                parlayData["CON_H"] = parlayData["CON"];
                                                parlayData["CON_C"] = "";
                                            }else{
                                                parlayData["CON_C"] = parlayData["CON"];
                                                parlayData["CON_H"] = "";
                                            }
                                        }else if(parlayData["STRONG"]=="N"){
                                            if(parlayData["BET_TYPE"]=="H"){
                                                parlayData["CON_C"] = parlayData["CON"];
                                                parlayData["CON_H"] = "";
                                            }else{
                                                parlayData["CON_H"] = parlayData["CON"];
                                                parlayData["CON_C"] = "";
                                            }
                                            parlayData["ORDER_CON"] = "";
                                        }
                                        if (parlayData[par_key] != null)  tmp.innerHTML = tmp.innerHTML.replace(new RegExp("\\\*" + par_key + "\\\*", "gi"), parlayData[par_key]);
                                    }
                                    row0Data[keys] = tmp.innerHTML;
                                // 細單結果
                                }else if(keys == "RESULT_WL"){
                                    var tmp_data = (par["result_type"] == "N") ? "_" : parlayData[keys] ;
                                    row0Data[keys] = tmp_data;
                                }
                                if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys]);
                            }
                            tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
                            tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
                            tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"]);
                        }
                    }else{

                        tpl.addBlock("row0");
                        var rAry = excel_rowAry[tmpLoginLayer];
                        for (var a = 0; a < rAry.length; a++) {
                            var keys = rAry[a];
                            if (keys == "RESULT_WL") {
                                var tmp_data = (par["result_type"] == "N") ? "_" : row0Data[keys];
                                row0Data[keys] = tmp_data;
                            }
                            if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys]);
                        }

                        tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
                        tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
                        tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"]);
                    }
                }

                showObj.innerHTML = tpl.fastPrint();
            }
        }
        if (postHash["view_layer"] == "list_bet") _self.hideLevel(showObj, disAry);

        _self.hideLevelAry(showObj, disAry);
        var param = new Array();
        var adiv = dom.createElement("div");

        var tmpDiv = dom.getElementById("excel_show").cloneNode(true);
        tmpDiv = _self.removeHideDiv(tmpDiv);

        var tmp_html = tmpDiv.innerHTML;

        tmp_html = tmp_html.replace('<table', '<table border="1" cellspacing="0" bordercolor="#66666" ');
        tmp_html = tmp_html.replace('<td', '<td style="collapse;border:1px solid black;" ');
        adiv.innerHTML = tmp_html;

        param["mydata"] = adiv.innerHTML
        param["filename"] = par["date_start"] + "~" + par["date_end"];
        param["p"] = "transExcel";
        _self.post_to_url(top.url, param);
    }

    _self.removeHideDiv = function (div) {
        var ary = div.children;
        _self.remove_hide_div(ary);
        return div;
    }

    _self.remove_hide_div = function (ary) {
        var len = ary.length;
        for (var i = 0; i < len; i++) {
            var obj = ary[i];
            if (obj.style.display == "none" || obj.className == "hide_item") {
                obj.parentNode.removeChild(obj);
                len--;
                i--;
            } else {
                if (obj.children.length > 0) {
                    _self.remove_hide_div(obj.children);
                }
            }

        }
    }

    _self.post_to_url = function (paths, params) {
        var form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", paths);
        form.setAttribute("target", "_top");
        for (var keys in params) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", keys);
            hiddenField.setAttribute("value", params[keys]);
            form.appendChild(hiddenField);
        }
        document.body.appendChild(form);
        form.submit();
        _self.removeSelf(form);
    }

    _self.removeSelf = function (dom) {
        var _pNode = dom.parentNode;
        _pNode.removeChild(dom);
    }

    _self.hideEvent = function () {
        _self.show_filter();
    }

    _self.filterCancel = function (e, param) {
        _self.hideEvent();
        _self.initFilter();
        _self.initCalendar();
    }

    _self.changeFilter = function (param) {
        par = selPar = param;

        _self.hideEvent();
        _self.hideBtn();
        _self.initReportTypeDiv();
        _self.getModel(true);
    }

    _self.filterSubmit = function (e, param) {
        _self.hideEvent();
        // var chgResultType = (par["result_type"]!=selPar["result_type"])? true : false;



        _self.initReportTypeDiv();


        // _self.getModel(true);
        _self.checkReport(_self.getModel, true);


        cookie.del("isclick");
    }

    _self.initFilter = function () {
        // par["result_type"] = postHash["result_type"];
        // par["gtype"] = postHash["gtype"];
        // par["wtype"] = postHash["wtype"];
        // par["report_kind"] = postHash["report_kind"];
        // par["date"] = postHash["date"];
        // par["date_start"] = postHash["date_start"];
        // par["date_end"] = postHash["date_end"];
        // par["report_type"] = postHash["report_type"];
        par = util.clone(postHash);
        selPar = util.clone(par);
        if (par["report_kind"] == "A") {
            _self.chgSel(null, { "rtype": "result_type", "type": par["result_type"] });
        } else {
            _self.chgSel(null, { "rtype": "report_kind", "type": par["report_kind"] });
        }

        _self.chgSel(null, { "rtype": "gtype", "type": par["gtype"] });
        _self.chgSel(null, { "rtype": "wtype", "type": par["wtype"] });
    }
    //============== filter ==============

    _self.get_index=function(ary, txt){
        for (var i = 0; i < ary.length; i++) {
            if(ary[i]==txt) return i;
        }
        return -1;
    }
    _self.initChooseName = function () {
        if (postHash["url_param"]) {
            var hash = new Object();
            var tmp = postHash["url_param"].split("&");
            for (var i = 0; i < tmp.length; i++) {
                var t = tmp[i].split("=");
                hash[t[0]] = t[1];
            }
            var ary = new Array("d0","co", "su", "ag", "mem");
            var _view = false;

            var acc_layer = _self.get_index(ary, postHash["from_acc_layer"]);
            var view_layer = _self.get_index(ary, postHash["view_layer"]);
            var _show = false;
            for (var j = 0; j < ary.length; j++) {
                _show = false;
                var layer = ary[j] + "_user";
                var obj = dom.getElementById(layer);
                if(postHash["is_from_acc"]){
                    if( (acc_layer!=view_layer) && (j>=acc_layer && (j < view_layer || view_layer==-1) ) ){
                        _show = true;
                    }

                    if (hash[layer] && _show) {
                        obj.innerHTML = hash[layer];
                        obj.style.display = "";
                        util.addEvent(obj, "click", _self.linkLayer, { "view_layer": ary[j] });
                    } else {
                        obj.style.display = "none";
                        util.removeEvent(obj, "click", _self.linkLayer);
                    }
                    if(layer=="co_user"){
                        obj.style.display = "none";
                        util.removeEvent(obj, "click", _self.linkLayer);
                    }
                }else{

                    if (postHash["view_layer"] == ary[j]) _view = true;

                    if (hash[layer] && !_view) {
                        obj.innerHTML = hash[layer];
                        obj.style.display = "";
                        util.addEvent(obj, "click", _self.linkLayer, { "view_layer": ary[j] });
                    } else {
                        obj.style.display = "none";
                        util.removeEvent(obj, "click", _self.linkLayer);
                    }

                }



            }
        }

        if(!postHash["is_from_acc"]) util.addEvent(dom.getElementById("main_user"), "click", _self.gotoReportMain, { "page": "report_main", "type": "report", "pageName": "report" });
    }

    _self.gotoReportMain = function (e, param) {
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.linkLayer = function (e, param) {
        var pHash = new Object();
        pHash["report_kind"] = par["report_kind"];
        pHash["report_type"] = par["report_type"];
        pHash["result_type"] = par["result_type"];
        pHash["date_start"] = par["date_start"];
        pHash["date_end"] = par["date_end"];
        pHash["gtype"] = par["gtype"];
        pHash["wtype"] = par["wtype"];
        pHash["view_layer"] = param["view_layer"];
        pHash["url_param"] = postHash["url_param"];
        if(postHash["is_from_acc"]!=null) pHash["is_from_acc"] = postHash["is_from_acc"];
        if(postHash["from_acc_layer"]!=null) pHash["from_acc_layer"] = postHash["from_acc_layer"];

        var parObj = new Object();
        parObj["page"] = "report_" + param["view_layer"];
        parObj["postHash"] = pHash;
        parObj["post"] = "view_layer=" + param["view_layer"];
        parObj["extendsClass"] = "report_index";

        _self.gotoNext(null, parObj);
    }

    _self.showNodata = function (isShow) {
        dom.getElementById("div_show").style.display = (isShow) ? "none" : "";
        dom.getElementById("nodata_show").style.display = (isShow) ? "" : "none";
        //console.log(dom.getElementById("div_show").innerHTML);
    }

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }
    //監聽整個大div(可視範圍內的都會被註冊監聽，和個別DOM監聽有區別)
    _self.setRtypeLis = function (evt, param) {
        var DOM = evt.target;
        var clas = param["className"];
        var DOMClassVal = DOM.classList.value || DOM.className;
        //在作用範圍內做的任何取 焦距 都是為了滑鼠移到作用範圍外，取消事件關閉用來選單(與內部展開毫無關係)
        if (DOM.tagName == "INPUT") {
            if (DOM.type == "button") document.getElementById("searchWtype").focus();
        } else {
            document.getElementById("focusBtn").focus();
        }
        if (DOM.tagName == "DIV") {
            if (DOM.className.indexOf("re_sreachitem") == -1 && DOM.className.indexOf("re_sreachitem_title") == -1) return;
            if (DOM.className.indexOf("re_sreachitem_title") != -1) DOM = DOM.parentElement;
            displayWtype = false;
            var claName = DOM.classList.value || DOM.className;
            _self.chkActive(DOM.classList, claName, "active");
            return;
        }
        if (DOM.tagName == "SPAN") { //打開拉霸
            DOM = DOM.parentElement;
            if (DOM.className.indexOf("re_sreachitem_title") != -1) DOM = DOM.parentElement;
            displayWtype = false;
            var claName = DOM.classList.value || DOM.className;
            _self.chkActive(DOM.classList, claName, "active");
            return;
        }
        if (DOM.tagName == "LI" && DOMClassVal == "") {  //點擊選擇的球類
            param.InnerText.innerHTML = DOM.innerHTML;
            var wtypeIdSplit = DOM.id.split("_");
            selPar["wtype"] = wtypeIdSplit[(wtypeIdSplit.length * 1 - 1)];
            displayWtype = true;
        }
        _self.vanishWtype("active");
    }
    //判斷是否關閉選單
    _self.vanishWtype = function (clasName) {
        var view = dom.getElementById("wtype_div");
        if (displayWtype) {
            view.classList.remove(clasName);
            _self.closeAllWtype_list(clasName);
        }
    }
    //------------------------選單內外判斷 start--------------------------------
    _self.setMouseLeave = function (e) {
        inWtype = true;
    }

    _self.setMouseIn = function (e) {
        inWtype = false;
    }

    _self.hideWtypeSel = function (evt, param) {
        if (!param.view || !param.className) return;
        var DOM = evt.target;
        if (inWtype) {
            param.view.classList.remove(param.className);
            _self.closeAllWtype_list(param.className);
        }
    }
    //------------------------選單內外判斷 end--------------------------------
    _self.chkActive = function (domcls, val, classStr) {
        if (classStr == "") return;
        if (val.indexOf(classStr) != -1) {
            domcls.remove(classStr);
        } else {
            domcls.add(classStr);
        }
        if (val.indexOf("re_sreachitem") != -1) {   //關閉選單時 清空與關閉所有選單
            _self.closeAllWtype_list(classStr);
        }
        return;
    }
    //關閉wtype時收起開啟的拉霸與清空收尋內容
    _self.closeAllWtype_list = function (clasName) {
        var aryDom = document.getElementsByName("wtype_list");
        for (var i = 0, len = aryDom.length; i < len; i++) {
            aryDom[i].classList.remove(clasName);
        }
        dom.getElementById("searchWtype").value = "";
        _self.recoveyDispalyWtype();
    }



    //----------------------------------------------------------------------------------------------------------------------------------------
    _self.setSearchSel = function (icon, param) {
        util.addEvent(icon, "click", _self.setSCEvent, { "icon": icon, "param": param });
    }

    _self.setSCEvent = function (e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i] == e.target) {
                return false;
            }
        }
        if (e.target == param._focus) return false;

        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
            util.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
            util.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");
        } else {
            param._setView.classList.add(param._viewClass);
            util.addEvent(dom.getElementsByTagName("div")[0], "mousedown", _self.InfBlurEvent, _par);
            util.addEvent(dom.getElementsByTagName("div")[0], "touchstart", _self.InfBlurEvent, _par);
        }
    }

    _self.InfBlurEvent = function (e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        var mouseIN = false;
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i] == e.target) {
                mouseIN = true;
            }
        }
        if (param._focus == e.target) mouseIN = true;

        if (!mouseIN) {
            var all = icon.getElementsByTagName("*");
            for (var i = 0, max = all.length; i < max; i++) {
                if (all[i] == e.target) {
                    return false;
                }
            }
            if (e.target == icon) return false;
            _self.closeInfElmt(param);
        } else if (param.info_mode && mouseIN) {
            _self.closeInfElmt(param);
        }
    }

    _self.closeInfElmt = function (param) {
        dom.activeElement.blur();
        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
        }
        util.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
        util.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");
    }

    _self.cleanTextEvent = function (evt, param) {
        param.dom.value = "";
        param.dom.focus();
        _self.recoveyDispalyWtype();
    }

    _self.serchSelEvent = function (evt, param) {
        var DOM = evt.target;
        if (DOM.tagName == "LI") {
            selPar["wtype"] = DOM.id.split("_")[1];
            dom.getElementById("wtype_div").classList.remove(param.className);
            _self.recoveyDispalyWtype();
            //印上innerHTML 與 清空 text
            dom.getElementById("wtype_now").innerHTML = DOM.innerHTML
            dom.getElementById("searchWtype").value = "";
        }
    }
    //輸入匡異動
    _self.changeSearchText = function (evt, param) {
        var DOM = evt.target;
        var searchStr = DOM.value;
        if (searchStr == "") {
            _self.recoveyDispalyWtype();
        } else {
            var allULWtype = document.getElementById("allULWtype");
            var wtypeLIId = allULWtype.getElementsByTagName("LI");
            for (var i = 0, len = wtypeLIId.length; i < len; i++) {
                var targerDOMid = wtypeLIId[i].textContent.toLowerCase();
                var vanishLI = "none";
                if (targerDOMid.indexOf(searchStr) != -1) vanishLI = "";
                wtypeLIId[i].style.display = vanishLI;
            }
        }
    }
    //恢復所有選項
    _self.recoveyDispalyWtype = function () {
        var allULWtype = document.getElementById("allULWtype");
        var wtypeLIId = allULWtype.getElementsByTagName("LI");
        for (var i = 0, len = wtypeLIId.length; i < len; i++) {
            wtypeLIId[i].style.display = "";
        }
    }

    //離開此頁移除事件
    _self.exitEvent = function () {
        clearTimeout(retryTimer);
        _self.setLzayLoadingVisible(false);
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        return true;
    }
    //----------------------------------------------------------------------------------------------------------------------------------------
}