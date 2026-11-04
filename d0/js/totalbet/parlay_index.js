function parlay_index(_win, _dom,_toppar){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "parlay_index";
    var util;
    var LS;
    var _mc = new Object();
    var eventHandler = new Object();
    var _set = new Object();
    var gtypeAry = new Array("FT","BK","TN","VB","BM","TT","BS","SK","OP");
    var dataHash = null;
	var sort_type = "";
    var sort_asc = false; //asc or desc
    var cookie;
    var nowDetail = "";

    var scroll_left = 0;
    var lazy_sw = null;
    var lazy_count = null; //every page count
    var lazy_page = null;
    var lazy_total_page = null;
    var lazy_loading = false;

    //var toppar = new Object();
    var toppar = _toppar;
    var Timer;
    var timerHash;

    var isBack = false;
    var LS_code;
    // ==========過濾器
    // var credit_old;
    var source_date_obj ;
    var data_filter ={};
    //var data_filter ={"league":[{"id":"111","name":"AAA"},{"id":"222","name":"BBB"}]};
    var filterInitParam = new Object();
	var filterBigObj = null;
    var filterUse = new Object();
    var bodyFrame = null ;  // totalbet_header
    var filter_set = new Object();
    // ==========過濾器

    _self.init=function(){
        // util.echo("parlay_index complete");
        if (toppar.back == "Y") {
            isBack = true;
            toppar.back = null;
        }

        if(top.tbet_gtype==undefined)top.tbet_gtype = "FT";
        if(toppar["tbet_gtype"] == null) {
            toppar["tbet_gtype"] = top.tbet_gtype;
        }else{
            top.tbet_gtype = toppar["tbet_gtype"];
        }
        if(toppar["tbet_showtype"] == null){
            toppar["tbet_showtype"] = top.tbet_showtype;
        } else{
            top.tbet_showtype = toppar["tbet_showtype"];
        }

        parentClass.dispatchEvent("chgPageName", { "pageType": "totalbet", "uniqText": _self.transUniqText(toppar["tbet_showtype"]) });

        for (var i = 0; i < gtypeAry.length; i++) {
            var _name = gtypeAry[i];
            dom.getElementById("tbet_" + _name).classList.remove("on");
        }
        dom.getElementById("tbet_" + toppar["tbet_gtype"]).classList.add("on");
        _self.scroll_gtype(toppar["tbet_gtype"]);

        for (var i = 0; i < gtypeAry.length; i++) {
            var _name = gtypeAry[i];
            util.addEvent(dom.getElementById("tbet_" + _name), "click", _self.chgGtype, { "type": _name });
        }

        util.setInfEvent(dom.getElementById("burger_div"), { "_focus": dom.getElementById("burger_sel"), "_setView": dom.getElementById("burger_div"), "_viewClass": "active" });
        util.addEvent(dom.getElementById("show_filter"), "click", _self.showFilter);
        util.addEvent(dom.getElementById("hide_filter"), "click", _self.hideFilter);
        util.addEvent(dom.getElementById("edit_filter"), "click", _self.editFilter);
        util.addEvent(dom.getElementById("filter_cancel"), "click", _self.filterCancel);
        util.addEvent(dom.getElementById("filter_submit"), "click", _self.filterSubmit);
        //_self.connetToServer();

        _self.initLazy();

        // util.addEvent(dom.getElementById("stake_now"), "keyup", _self.keep_credit);
        util.ChkKeyCash(dom.getElementById("stake_now"), { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });

        // ＝＝＝＝＝＝ parlay_index.js 連接 index.js (上層) ＝＝＝＝＝＝
        _self.addEventListener("goToPage", _self.indexGoToPageEvent);
        _self.addEventListener("showAccDetail", _self.indexShowAccDetail);
        _self.addEventListener("showReportDetail", _self.indexShowReportDetail);
        // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

        bodyFrame.addEventListener("changeFilter", _self.changeFilter);

        //show header init
        dom.getElementById("burger_div").style.display = "";
        dom.getElementById("filter_div").style.display = "";

        sort_type = "DATETIME";
        _set["CompleteFunc"] = {};
        _set["CompleteFunc"]["get_wagers_list_bet"] = _self.LoadListComplete;
        _set["layer"] = "totalbet_model";

        //_self.createTimer();
        /*_self.defaultFilter();
        _self.setSelectEvent();
        _self.loadFilterData();
        _self.setChooseFilter();
        _self.getModel(toppar, true);*/
        _self.showFilter();
        _self.setChooseFilter();
        _self.configFilter();
        _self.defaultFilter();
        _self.loadFilterData();
        // _self.setSelectEvent();
        //_self.set_sear_filter();


        //totalbets 側邊細單關掉移除底色
        bodyFrame.closeAccDetail = function () {
            _self.closeAccDetail();
        }

        bodyFrame.closeAccEditDetail = function () {
            _self.closeAccEditDetail();
        }
        //parentClass.dispatchEvent("showLoading", {"showLoading":false});
    }

     // ＝＝＝＝＝＝＝＝  連接 index.js (上層) function ＝＝＝＝＝＝＝＝
    _self.indexGoToPageEvent = function(parObj){
        parentClass.dispatchEvent("goToPage", parObj);
    }

    _self.indexShowAccDetail = function(parObj){
        parentClass.dispatchEvent("showAccDetail", parObj);
    }

    _self.indexShowReportDetail = function(parObj){
        parentClass.dispatchEvent("showReportDetail", parObj);
    }
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        cookie = parentClass.getThis("cookie");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        config_set = parentClass.getThis("config_set");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash");
        bodyFrame = parentClass.getThis("bodyFrame");
        filter_set = parentClass.getThis("filter_set");
    }

    // ==========過濾器
    _self.configFilter = function () {
        filterInitParam = {
            "date": {
                "_titleName": "",
                "info_mode": true,
                "title_mode": true,
                "_setDiv": null,
                "_titleView": null,
                "_contantView": null,
                "_type": null,
                "_viewClass": "active",
                "_list": ["ALL", "today", "yesterday"],
                "_listSub": ["ALL", "Today", "Yesterday"],
                "_default": "today",
                "mode": 1,
                "rtype": "date"
            },
            "stake": {
                "_titleName": "",
                "mode": 2,
                "info_mode": false,
                "title_mode": true,
                "_setDiv": null,
                "_titleView": null,
                "_contantView": null,
                "_type": null,
                "_viewClass": "on",
                "_group": ["ALL", "PER"],
                "_list": ["ALL", "FT", "BK", "TN", "VB", "BM", "TT", "BS", "SK", "OP"],
                "_default": {
                    "mode": "ALL",
                    "listGold": {
                        "ALL": 0,
                        "FT": 0,
                        "BK": 0,
                        "TN": 0,
                        "VB": 0,
                        "BM": 0,
                        "TT": 0,
                        "BS": 0,
                        "SK": 0,
                        "OP": 0,
                    },
                    "listItem": toppar["tbet_gtype"]
                },
                "rtype": "stake",
            },
            "downline": {
                "_titleName": "",
                "mode": 3,
                "info_mode": false,
                "title_mode": true,
                "_setDiv": null,
                "_titleView": null,
                "_contantView": null,
                "_type": null,
                "_data": null, //1002: {id: "1002", alias: "stanNew", username: "stanNew"}
                "_viewClass": "active",
                "_default": "all",
                "_limitCount": 5,
                "_searchOpen": true,
                "_searchItem": "downlineID",
                "_searchDiv": null,
                "_dataShowDiv": null,
                "_breakpoint": [
                    {
                        "div": null,
                        "amount": 0
                    }
                ],
                "rtype": "downline",
                "_chkBtnMode": true,
                "_chkBtnDiv":
                {
                    "SAVE":
                    {
                        "div": null,
                        "disappear": true,
                    },
                    "CANCEL":
                    {
                        "div": null,
                        "disappear": true,
                    }
                }
            },
            "view": {
                "_titleName": "",
                "info_mode": true,
                "title_mode": true,
                "_setDiv": null,
                "_titleView": null,
                "_contantView": null,
                "_type": null,
                "_viewClass": "active",
                "_list":["full","my","com","d","c","s","a","csa","cs","sa","dcsa", "dcs", "dc"],
                "_listSub":[
                    "Full Percentage","My Percentage","Company %","D0 %","SMA %","Master Agent %","Agent %",
                    "SMA + Master Agent + Agent %",
                    "SMA + Master Agent %",
                    "Master Agent + Agent %",
                    "D0 + SMA + Master Agent + Agent %",
                    "D0 + SMA + Master Agent %",
                    "D0 + SMA %",
                ],
                "mode": 1,
                "rtype": "view"
            }
        }
    }

    _self.scroll_gtype = function (gtype) {
        var obj = document.getElementById("tbet_" + gtype);
        var obj_left = obj.offsetWidth * 1 + obj.offsetLeft * 1;
        var ul = obj.parentElement;
        var go_left = obj_left * 1 - ul.offsetWidth * 1;
        if (go_left < 0) go_left = 0;
        //ul.scrollTo(go_left, 0);
        ul.scrollLeft=go_left;
    }

    _self.chgGtype = function (e, param) {
        toppar["tbet_gtype"] = param.type;
        _self.initGtype();
        _self.getModel(toppar, false);
        //_self.loadFilterData();
    }

    _self.transUniqText = function (name) {
        var tmp_name = LS.get("page_" + name);
        if (tmp_name == null) tmp_name = LS.get("page_INPLAY");
        return tmp_name;
    }

    _self.transShowtypeName = function (name) {
        var nameHash = new Object();
        nameHash[name] = "";
        nameHash["INPLAY"] = "re";
        nameHash["TODAY"] = "today";
        nameHash["EARLY"] = "fu";
        nameHash["STARTED"] = "started";
        nameHash["PARLAY"] = "parlay";
        nameHash["OUTRIGHT"] = "outright";
        nameHash["RESULTS"] = "results";

        if(nameHash[name] == null) nameHash[name] = "re";

        return nameHash[name];

    }

    _self.transTotalBets = function(name){
        var nameHash = new Object();
        nameHash[name] = "";
        nameHash["INPLAY"] = "live_ft_league";
        nameHash["TODAY"] = "today_ft_league";
        nameHash["EARLY"] = "early_ft_league";
        nameHash["STARTED"] = "started_ft_league";
        nameHash["OUTRIGHT"] = "outright_ft_league";
        nameHash["PARLAY"] = "parlay_ft_league";
        if(nameHash[name] == null) nameHash[name] = "live_ft_league";
        return nameHash[name];
    }
    _self.transDate = function(name,obj){
        /*
        早餐	所有日期 (預設)		9  all
                明日起的七個日期	   2019-08-29 ....
                未來		         future
        已開賽	今日 (預設)		2
                昨日

        冠軍	所有日期 (預設)		5
                當月起算的四個季節


        */
        var date = obj["date"]||"";
        return date;
    }

    _self.initGtype = function () {
        for (var i = 0; i < gtypeAry.length; i++) {
            var _name = gtypeAry[i];
            dom.getElementById("tbet_" + _name).classList.remove("on");
        }
        dom.getElementById("tbet_" + toppar["tbet_gtype"]).classList.add("on");
        top.tbet_gtype = toppar["tbet_gtype"];
        toppar["stake_obj"]["listItem"] = toppar["tbet_gtype"];
        filterBigObj.reDefault("stake", toppar["stake_obj"]);
    }

    _self.transSessionName = function (name) {
        var nameHash = new Object();
        nameHash[name] = "";
        nameHash["re"] = "RB";
        nameHash["today"] = "FT";
        nameHash["fu"] = "FU";
        nameHash["started"] = "PL";
        nameHash["parlay"] = "P";
        nameHash["outright"] = "FS";
        //nameHash["results"] = "FT";
        if(nameHash[name] == null) nameHash[name] = "RB";

        return nameHash[name];

    }

    // ＝＝＝＝＝＝＝＝  外層 function ＝＝＝＝＝＝＝＝＝
    _self.getModel = function (par,isInit) {
        parentClass.dispatchEvent("showLoading", {"showLoading":true});
        //重置 scrollbar
        //var totalbet_show = dom.getElementById("totalbet_show");
        //if(totalbet_show!=null)totalbet_show.innerHTML = "";

        if(isInit){
            var param = new Object();
            param["page"] = "totalbet_model";
            param["target"] = "totalbet_model";
            param["retFun"] = _self.getModelComplete;
            param["post"] = "tbet_showtype=" + _self.transShowtypeName(par["tbet_showtype"]) + "&tbet_gtype=" + par["tbet_gtype"];
            param["par"] = par;
            filter_set[par["tbet_showtype"]] = util.clone(par);
            parentClass.dispatchEvent("goToPage", param);
        }else{
            var param = new Object();
            par["sub_page"] = "totalbet_model";

            param["page"] = "totalbet_header";
            param["postHash"] = par;
            filter_set[par["tbet_showtype"]] = util.clone(par);
            parentClass.dispatchEvent("bodyGoToPage", param);
        }
    }

    _self.getModelComplete = function (par) {
        _self.getData(par["par"]);
    }

    _self.getData = function (par) {
        parentClass.dispatchEvent("showLoading", { "showLoading": true });
        //filter_set[top.tbet_showtype] = par;
        filter_set[toppar["tbet_showtype"]] = util.clone(par);

        var tarPage = "get_wagers_list_bet_parlay";
        var param = "";
        param += top.param;
        param += "&p=" + tarPage;
        //param+="&session="+_self.transSessionName(par["tbet_showtype"]);
        param+="&session="+_self.transSessionName(par["tbet_showtype"].toLowerCase());
        param+="&gtype="+par["tbet_gtype"];
        param+="&date="+par["date"];
        param+="&symbol=more";
        param+="&gold="+par["stake"];
        param+="&percentage="+par["view"];
        param+="&down_id="+par["downline"];
        //param+=_url; 還沒用

        hr = new HttpRequest();
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadListComplete);
        hr.loadURL(top.url, "POST", param);
    }


    _self.LoadListComplete = function (json) {
        var hash;
        dataHash = json;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }

        // console.log("[LoadComplete]", hash);
        _self.displayLeagueHeader();
        if (hash["code"] == "no_data" || hash["code"] == "game_close" || hash["code"] == "gidm_not_find") {
            lazy_sw = false;
            dom.getElementById("div_show").style.display = "none";
            dom.getElementById("totalbet_nodata").style.display = "";
        } else {
            lazy_sw = config_set.get("LAZY_SW") || false;
            var row0 = hash["row0"];
            dom.getElementById("div_show").style.display = "";
            dom.getElementById("totalbet_nodata").style.display = "none";
            _self.reSetLazy(row0);
            _self.parseData(hash);
        }
        //_self.startTimer();
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
    }

	_self.getWagersModel = function(_layer){
        var view_w = getView().viewportwidth;
		var ret = "";
		/*if(view_w < 1024){
			ret = "report_list_s_model" ;
		}else{
			ret = "report_list_b_model" ;
        }*/
        ret = "report_list_b_model";
        return ret;
	}
    // =========== sort ===================
    _self.sortData = function (ary, types, up_down) {
        //util.echo("[sortData]"+types+","+up_down);
        if (ary.length <= 1) return ary;
        var string_type = ",DATETIME,";
        if (string_type.indexOf(types) == -1) {
            var Reverse_type = ",GOLD,WIN_GOLD,";
            if (Reverse_type.indexOf(types) != -1) up_down = !up_down;
            if (up_down) {
                var sortfun = function (a, b) {
                    var ret;
                    a[types] = a[types] + "";
                    b[types] = b[types] + "";
                    var a_val = a[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
                    var b_val = b[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
                    if (isNaN(a_val)) a_val = 0;
                    if (isNaN(b_val)) b_val = 0;
                    //console.log(a[types]+"=>"+a[types].replace(",","")*1)
                    ret = (a_val - b_val);
                    //console.log( a[types].replace(",","")*1 +"-"+ b[types].replace(",","")*1 +" = "+ ret);
                    return ret;
                }
            } else {
                var sortfun = function (a, b) {
                    var ret;
                    a[types] = a[types] + "";
                    b[types] = b[types] + "";
                    var a_val = a[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
                    var b_val = b[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
                    if (isNaN(a_val)) a_val = 0;
                    if (isNaN(b_val)) b_val = 0;
                    //console.log(b[types]+"=>"+b[types].replace(",","")*1)
                    ret = (b_val - a_val);
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
        //_self.set_scroll_top();
        _self.LoadListComplete(dataHash);
    }

    // =========== sort end ===================
    _self.displayLeagueHeader = function(){
        dom.getElementById("league_header").style.display = "";
        dom.getElementById("total_payout_head").style.display = "none";
        if(top.tbet_showtype == "PARLAY"){
            dom.getElementById("total_payout_head").style.display = "";
        }
        dom.getElementById("total_wagers").innerHTML = "0";
        dom.getElementById("total_stake").innerHTML = "0.0";
        dom.getElementById("total_payout").innerHTML = "0.0";

    }
    _self.parseData = function (hash) {
        // var sort_model = dom.getElementById("sort_model");
        // var div_model = dom.getElementById("league_model");
        var objid = ",total_wagers,total_stake,total_payout,div_show,";
        var tmpObj = util.getObjAry(dom, objid);
        //console.log(tmpObj);
        _mc = util.mergeArray(_mc, tmpObj);

        _mc["total_wagers"].innerHTML = hash["WCOUNT"];
        _mc["total_stake"].innerHTML = hash["GOLD"];
        _mc["total_payout"].innerHTML = hash["WGOLD"];

        var row0 = hash["row0"];
        if (row0) {
            _self.sortData(row0, sort_type, sort_asc);
            var now_model = _self.getWagersModel(_set["layer"]);
            var modelObj = dom.getElementById(now_model);
            var tmpModel = modelObj.cloneNode(true);
            var showObj = _mc["div_show"];

            var tpl = new fastTemplate_a1();
            tpl.init(tmpModel);
            tpl.addBlock("td");
            tpl.replace("*ADD_TD*", hash["HEADER"]);

            if (lazy_page == 1) {
                showObj.innerHTML = "";
                var totalAry = new Array("WCOUNT", "SGOLD0");
                tpl.addBlock("total");
                for (var a = 0; a < totalAry.length; a++) {
                    var keys = totalAry[a];
                    if (hash[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), hash[keys]);
                }
            }

            // var subData = hash["subData"];
            // ARESULT: 20
            //BALL_ACT,COMWINLOSS,CRESULT,DATE,GOLD,GT,IN_RADIO,M_TYPE,NAME0,ODDF_TYPE,SRESULT,SRV_IP,TID,TIME,TNAME
            var s = 0;
            var e = 0;
            if (lazy_sw) {
                s = (lazy_page - 1) * lazy_count;
                e = (lazy_page == lazy_total_page) ? row0.length : lazy_page * lazy_count;
            } else {
                s = 0;
                e = row0.length;
            }

            var subDataAry = new Array("DATE", "TIME", "NAME0","TD_CONTENT", "M_TYPE", "IN_RADIO", "ODDF_TYPE", "TID", "GT", "SRV_IP", "TNAME", "BALL_ACT", "GOLD", "ARESULT", "SRESULT", "CRESULT", "COMWINLOSS", "WIN_GOLD");
            for (var i = s; i < e; i++) {
                tpl.addBlock("row0");
                for (var a = 0; a < subDataAry.length; a++) {
                    var subAry = row0[i];
                    var keys = subDataAry[a];
                    if (subAry[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), subAry[keys]);
                    if(keys=="TD_CONTENT"){
                        var small_td_content = subAry.TD_CONTENT.replace(new RegExp(" \/ ", "gi"),"");
                        small_td_content = small_td_content.replace(new RegExp("_"+subAry.ID, "gi"),"_small_"+subAry.ID);
                        small_td_content = small_td_content.replace('<br>',"");
                        tpl.replace(new RegExp("\\\*ADD_TD_SMALL_CONTENT\\\*", "gi"), small_td_content);
                    }
                }
            }

            if (lazy_page == 1) {
                showObj.innerHTML = tpl.fastPrint();
            } else {
                var obj = dom.getElementById("re_body_scroll").children[0].children[0];
                obj.innerHTML += tpl.getBlock("row0");
            }
            // console.log(tpl.fastPrint());
            _self.setSortClick(true);
            _self.setDetailClick(row0);
            _self.initScroll();
            //重整後維持底色存在
            if(nowDetail!=""){
                if (dom.getElementById(nowDetail)!=null){
                    dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
                }
            }
        }
        _self.checkShowLazyLoading(dom.getElementById("body_show"));
        dom.getElementById("body_show").style.overflowY = "scroll";
        _self.set_scroll_left();
        _self.setLzayLoadingVisible(false);
    }

    _self.setDetailClick = function (dataAry) {
        for (var i = 0; i < dataAry.length; i++) {
            var _name = "";
            _name = "tid_" + dataAry[i]["TID"];
            util.addEvent(dom.getElementById(_name), "click", _self.viewDetail, dataAry[i]);
            util.addEvent(dom.getElementById("tid_small_" + dataAry[i]["TID"]), "click", _self.viewDetail, dataAry[i]);

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
            _self.loadFilterData();
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
        _self.loadFilterData();
    }

    _self.closeAccEditDetail = function(){
        _self.loadFilterData();
        if(dom.getElementById(nowDetail)) dom.getElementById(nowDetail).classList.remove("tr_bgebf7ff");
    }

    _self.viewDetail = function (e, param) {
        try {
            if (e.target.id.indexOf("anno") != -1) return;
            // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
            _self.closeAccDetail();
            nowDetail = "tid_" + param["TID"];
            dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
        } catch (e) { }
        parentClass.dispatchEvent("showReportDetail", { "view_layer": "list_bet", "result_type": "", "row0": param });
    }

    // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
    _self.closeAccDetail = function(){
        if(dom.getElementById(nowDetail)) dom.getElementById(nowDetail).classList.remove("tr_bgebf7ff");
        nowDetail = "";
    }

    //================== 過濾器相關Function ==================
    _self.showFilter = function (e, param) {
        // _self.hideMenuFilter();
        _self.show_filter();
        _self.hideBtn();
    }

    _self.show_filter = function () {
        dom.getElementById("filter_div").style.display = "";
        // dom.getElementById("filter_div").prevScrollBottomIgnore = true;//橫向滾軸物件判斷使用
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
            //parentClass.dispatchEvent("showFilter", par);
        } else {
            _self.hideBtn();
            _self.showEditFilter();
        }
    }

    _self.filterCancel = function (e, param) {
        _self.hideEvent();
        _self.initFilter();
        //_self.initCalendar();
    }

    _self.initFilter = function () {
        for (var rtype in filterInitParam) {
            if(rtype=="stake"){
                if(toppar["stake_obj"]!=null)filterBigObj.reDefault(rtype, toppar["stake_obj"]);
                dom.getElementById("stake_now").value = toppar["stake"];
            }else{
                if(toppar[rtype]!=null)         filterBigObj.reDefault(rtype, toppar[rtype].toString() );
            }
        }
    }

    _self.openSmallFilter = function (e, _par) {
        var _par = _par;
        _par.dataSet["rtype"] = _par["rtype"];
        _par.dataSet["_default"] = "" ;

        if (_par["rtype"] == "stake") {
            _par.dataSet["_default"] = toppar["stake_obj"] ;
            _par.dataSet["_default"]["mode"] = "SIN";
        } else {
            _par.dataSet["_default"] = toppar[_par["rtype"]] ;
        }
        //console.log(_par);

        if (getView().viewportwidth < 1024) {
            parentClass.dispatchEvent("showOverviewFilter", _par.dataSet);
        } else {
            // _self.hideBtn();
            // _self.showEditFilter();
        }
    }

    _self.changeFilter = function (param) {
        // console.log("changeFilter");
        // console.log(param);
        var set_rtype = param["rtype"] ;

        if (set_rtype == "stake") {
            filterBigObj.reDefault(set_rtype, param["param"][set_rtype]);
            filterUse["stake"] = param["param"][set_rtype];
        }else{
            filterBigObj.reDefault(set_rtype, param["param"][set_rtype].toString());
        }
        //filterUse[set_rtype] = param["param"][set_rtype] ;
        // console.log(filterUse);
        _self.set_toppar();
        _self.getData(toppar);
        _self.set_sear_filter();
    }

    _self.filterSubmit = function (e) {
        var rNow = dom.getElementById("stake_now");
        if(rNow.value=="") rNow.value = 0;
        filterUse["stake"]["listGold"][toppar["tbet_gtype"]] = rNow.value;
        _self.set_toppar();
        _self.getData(toppar);
        _self.set_sear_filter();
        _self.hideEvent();
    }

    _self.hideEvent = function () {
        _self.show_filter();
    }

    //搜尋條件顯示
    _self.set_sear_filter = function () {
        var str_blank = "";
        if(top.langx=="en-us"){
            str_blank = " ";
        }
        for (var rtype in filterInitParam) {
            if (rtype =="stake"){
                var rNow = dom.getElementById(rtype + "_now");
                var rSelect = dom.getElementById(rtype + "_select");
                var r_smallSelect = dom.getElementById("f_" + rtype + "_small").children[1];
                var stake_mode = toppar["stake_obj"]["mode"];
                var str_select = "";
                if (stake_mode=="ALL"){
                    str_select = toppar["stake_obj"]["listGold"]["ALL"];
                }else{
                    str_select = toppar["stake_obj"]["listGold"][toppar["tbet_gtype"]];
                }
                if(str_select=="" || str_select==null) str_select = "0";
                rSelect.innerHTML =  LS.get("filter_more")+" "+str_select;
                r_smallSelect.innerHTML =  LS.get("filter_more")+" "+str_select;
                rNow.value = str_select;
            }else if (rtype == "downline"){
                var rSelect = dom.getElementById(rtype + "_select");
                var r_smallSelect = dom.getElementById("f_" + rtype + "_small").children[1];
                var rNow = dom.getElementById(rtype + "_now");
                var str_show = LS.get("filter_" + rtype + "_show");

                if (str_show!=null){
                    if(toppar[rtype]=="all"){
                        //var str_show = rNow.innerHTML + str_blank + str_show;
                        str_show = rNow.innerHTML;
                    }else{
                        str_show = str_show + str_blank + rNow.innerHTML;
                    }
                }else{
                    str_show = rNow.innerHTML;
                }

                rSelect.innerHTML = str_show;
                r_smallSelect.innerHTML = str_show;
            }else if (rtype == "date"){
                var rSelect = dom.getElementById(rtype + "_select");
                var r_smallSelect = dom.getElementById("f_" + rtype + "_small").children[1];
                var rNow = dom.getElementById(rtype + "_now");
                var str_show = LS.get("filter_" + rtype + "_show");

                if (str_show!=null && toppar[rtype]=="all"){
                    str_show = rNow.innerHTML + str_blank + str_show;
                }else{
                    str_show = rNow.innerHTML;
                }

                rSelect.innerHTML = str_show;
                r_smallSelect.innerHTML = str_show;
            }else{
                var rNow = dom.getElementById(rtype + "_now");
                var rSelect = dom.getElementById(rtype + "_select");
                var r_smallSelect = dom.getElementById("f_" + rtype + "_small").children[1];
                rSelect.innerHTML = rNow.innerHTML;
                r_smallSelect.innerHTML = rNow.innerHTML;
            }
        }
    }
    //=====================================================

    _self.onError=function(){
        console.log("onError");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    //exit
    _self.exitEvent=function(){
        // util.echo("top exit");
        return true;
    }

    _self.backPage=function(e, param){
        parentClass.dispatchEvent("backPage", {"retFun":_self.backPageComplete});
    }

    _self.backPageComplete=function(){
        // util.echo("backPageComplete");
    }

    _self.changePage=function(e, param){
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.changePageComplete=function(){
        // util.echo("changePageComplete");
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

    _self.set_scroll_top = function () {
        // util.echo("[report_index]set_scroll_top");
        if(lazy_page==1) dom.getElementById("body_show").scrollTop = 0;
    }

    _self.set_scroll_left = function () {
        dom.getElementById("re_body_scroll").scrollLeft = scroll_left;
    }

    _self.initScroll = function () {
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollVerEvent, dom.getElementById("div_show"));
    }

    _self.scrollVerEvent = function (e,targetObj) {
        _self.scroll_ver_event(e, targetObj);
    }

    _self.scroll_ver_event = function (e, targetObj) {
        if (e == null || !dom.getElementById("re_function")) return;
        if(filterBigObj!=null){
            if(filterBigObj.closeAllDownlist != null){
                filterBigObj.closeAllDownlist();
            }
        }
        var newScrollTop = e.target.scrollTop;
        var func_h = dom.getElementById("re_function").clientHeight + dom.getElementById("re_function").offsetTop ;

        if (newScrollTop >= func_h) {
            util.classFunc(targetObj, "report_fixed");
        }else{
            util.classFunc(targetObj, "report_fixed", "remove");
        }

        _self.checkShowLazyLoading(e.target);
    }

    //============ lazy loading ============

    _self.checkShowLazyLoading = function(target){
        if(!lazy_sw) return;
        var newScrollTop = target.scrollTop;
        var s_h = target.scrollHeight;
        var c_h = target.clientHeight;
        var scroll_bottom = (newScrollTop >= ((s_h - c_h) - 10));

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
            _self.parseData(JSON.parse(dataHash));
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

    //--------- 日期
    _self.getNowDateTime=function(fomat,field,num){
		var yyyy=mm=dd=H=i=s=0;
		var gDate = new Date();
		yyyy = gDate.getUTCFullYear();
		mm = gDate.getUTCMonth()+1;
		dd = gDate.getUTCDate();
		H = gDate.getUTCHours();
		i = gDate.getUTCMinutes();
		s = gDate.getUTCSeconds();
		gDate = new Date(parseInt(yyyy, 10),parseInt(mm, 10) - 1,parseInt(dd, 10) ,parseInt(H,10)+parseInt(config_set.get("WEB_TIME_ZONE"),10),parseInt(i,10),parseInt(s,10),0)
		yyyy = gDate.getFullYear();
		mm = gDate.getMonth()+1;
		dd = gDate.getDate();
		H = gDate.getHours();
		i = gDate.getMinutes();
		s = gDate.getSeconds();
		if(field=="y"||field=="m"||field=="d"){
			gDate = _self. chg_date(field,num,yyyy+"-"+mm+"-"+dd,1);
			yyyy = gDate.getFullYear();
			mm = gDate.getMonth()+1;
			dd = gDate.getDate();
		}
		if(mm*1< 10)mm = "0"+mm;
		if(dd*1< 10)dd = "0"+dd;
		if(H*1< 10)H = "0"+H;
		if(i*1< 10)i = "0"+i;
		if(s*1< 10)s = "0"+s;
		if(fomat=="yyyy-mm-dd")return yyyy+"-"+mm+"-"+dd;
		if(fomat=="H:i:s") return H+":"+i+":"+s;
		if(fomat=="yyyy-mm-dd H:i:s")return yyyy+"-"+mm+"-"+dd+" "+H+":"+i+":"+s;

		return yyyy+"-"+mm+"-"+dd+" "+H+":"+i+":"+s;
    }

    _self.chg_date = function(fix_type,shift,today,Obj){
		var y_num=m_num=d_num=0;
		if(fix_type == "y") y_num = shift;
		if(fix_type == "m") m_num = shift;
		if(fix_type == "d") d_num = shift;
		var aDate = today.split("-");
		var newDate = new Date(parseInt(aDate[0], 10)+y_num,parseInt(aDate[1], 10) - 1+m_num,parseInt(aDate[2], 10) + d_num);
		if(Obj==1)return newDate;
		else {
			var yyyy = newDate.getFullYear();
			var mm = newDate.getMonth()+1;
			var dd = newDate.getDate();
			if(mm*1< 10)mm = "0"+mm;
			if(dd*1< 10)dd = "0"+dd;
			return yyyy+"-"+mm+"-"+dd;
		}
    }
    //--------- 日期

    //--------------創建計時器 start-----------------
    _self.createTimer = function () {
        if(timerHash["totalbet"] !=null){
            timerHash["totalbet"].clearObj();
        }
        timerHash["totalbet"] = new Timer(config_set.get("LEAGUE_RELOAD"));
        //timerHash["totalbet"] = new Timer(15*1000);
        timerHash["totalbet"].setParentclass(_self);
        timerHash["totalbet"].dont_clear = false; //設定為不清除timer
        timerHash["totalbet"].init();
        timerHash["totalbet"].addEventListener("TimerEvent.TIMER", _self.timerRun);
        timerHash["totalbet"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerComplete);
    }
    //設定 定時做事
    _self.startTimer = function () {
        // util.echo("totalbet startTimer");
        timerHash["totalbet"].startTimer();
    }

    _self.stopTimer = function () {
        // util.echo("totalbet stopTimer");
        timerHash["totalbet"].stopTimer();
    }

    _self.clearTimer = function () {
        // util.echo("totalbet clearTimer");
        timerHash["totalbet"].clearObj();
        timerHash["totalbet"]=null;
    }

    _self.timerRun = function () {
        // util.echo("parlay timer");
        // console.log("timerRun",toppar);
        if(top.tbet_showtype == "PARLAY"){
            _self.getData(toppar);
            _self.loadFilterData();
        }else{
            _self.clearTimer();
        }
    }

    _self.timerComplete = function () {
        // util.echo("totalbet timerComplete"); //no complete
    }
    //--------------創建計時器 end-----------------


    // ==========過濾器
    _self.defaultFilter = function(){
        //語系 My Percentage
        //"_list":["full","com","c","s","a","csa","cs","sa"],
        //"_listSub":["Full Percentage","Company %","SMA %","Master Agent %","Agent %","SMA + Master Agent + Agent %","SMA + Master Agent %","Master Agent + Agent %"],

        var view_map = {};
        view_map["ads"] = {};
        view_map["ads"]["data_list"] = ["full", "com", "my", "d", "s", "a", "dcsa", "dcs", "dc", "csa", "cs", "sa"];
        view_map["ads"]["data_listSub"] = _self.get_filter_name("view", view_map["ads"]["data_list"]);
        view_map["ad"] = view_map["ads"];

        view_map["d0"] = {};
        view_map["d0"]["data_list"] = ["full", "com", "my", "s", "a", "dcsa", "dcs", "dc", "csa", "cs", "sa"];
        view_map["d0"]["data_listSub"] = _self.get_filter_name("view", view_map["d0"]["data_list"]);

        view_map["co"] = {};
        view_map["co"]["data_list"] = ["full","com","c","s","a","csa","cs","sa"];
        view_map["co"]["data_listSub"] = _self.get_filter_name("view",view_map["co"]["data_list"]);
        view_map["su"] = {};
        view_map["su"]["data_list"] = ["full","my","a","sa"];
        view_map["su"]["data_listSub"] = _self.get_filter_name("view",view_map["su"]["data_list"]);
        view_map["ag"] = {};
        view_map["ag"]["data_list"] = ["full","my"];
        view_map["ag"]["data_listSub"] = _self.get_filter_name("view",view_map["ag"]["data_list"]);

        var set = {};
        set["PARLAY"] = {};
        set["PARLAY"]["date"] = {"show":true,"data_list":["all"],"data_listSub":["ALL"],"data_default":"all"};

        var data_list = new Array();
        var data_listSub = new Array();
        //日期語系
        if (source_date_obj == null) {
            source_date_obj = new source_date();
            source_date_obj.setLangx(top.langx);
            source_date_obj.setTimeZone(config_set.get("WEB_TIME_ZONE"));
        }
        var date_obj = source_date_obj.getDateSource(7, 3, 3) ;
        var tmp_date = ["all", "today"];
        data_list = data_list.concat(tmp_date);
        data_listSub = data_listSub.concat(_self.get_filter_name("date", tmp_date));

		for(var i=1; i<date_obj["date"].length; i++){
			var oD = date_obj["date"][i];
			var monthName = date_obj["month"][i];
			var weekName = date_obj["week"][i];
			var oDAry = oD.split("-");
            var datename ;
            if(top.langx == "en-us"){
                datename = oDAry[2] + " " + monthName + " (" + weekName + ")";
            }else{
                datename = monthName + oDAry[2]+LS.get("str_day") + " (" + weekName + ")";
            }

            data_list.push(oD);
            data_listSub.push(datename);
		}
        var tmp_date = ["future"];
        data_list = data_list.concat(tmp_date);
        data_listSub = data_listSub.concat(_self.get_filter_name("date", tmp_date));

        set["PARLAY"]["date"]["data_list"] = data_list;
        set["PARLAY"]["date"]["data_listSub"] = data_listSub;

        var setting = set[top.tbet_showtype];
        for(var k in setting){
            var kind = k;
            var datas = setting[k];
            var _div = dom.getElementById(kind+"_div");
            var _select = dom.getElementById(kind+"_select");

            var display = (datas.show==true)?"":"none";
            if(_div)_div.style.display=display;
            if(_select)_select.style.display=display;

            if(datas.data_list)filterInitParam[kind]["_list"] = datas.data_list ;
            if(datas.data_listSub)filterInitParam[kind]["_listSub"] = datas.data_listSub ;
            if(datas.data_default)filterInitParam[kind]["_default"] = datas.data_default ;
        }
        filterInitParam["view"]["_list"]=view_map[top.login_layer]["data_list"];
        filterInitParam["view"]["_listSub"]=view_map[top.login_layer]["data_listSub"];

        for(var rtype in filterInitParam){
            if(rtype=="stake"){
                if(toppar["stake_obj"]!=null)filterInitParam[rtype]["_default"] = toppar["stake_obj"];
            }else{
                if (toppar[rtype] != null){
                    if (filterInitParam[rtype]["mode"]==1){
                        if (filterInitParam[rtype]["_list"].indexOf(toppar[rtype]) != -1){
                            filterInitParam[rtype]["_default"] = toppar[rtype].toString();
                        }else{
                            toppar[rtype] = filterInitParam[rtype]["_default"] ;
                        }
                    }else{
                        filterInitParam[rtype]["_default"] = toppar[rtype].toString();
                    }
                }
            }
        }
    }

    //取過濾器選項語系 filter_(過濾器類別)_(值)
    _self.get_filter_name = function(rtype,arr_filter){
        var tmp_name = "";
        var arr_out = new Array();
        for(var key in arr_filter){
            tmp_name = LS.get("filter_" + rtype + "_" + arr_filter[key]);
            if (tmp_name != null ){
                arr_out.push(tmp_name);
            }else{
                arr_out.push(arr_filter[key]);
            }
        }
        return arr_out ;
	}

    _self.loadFilterData = function(){
		_self.reloadFilterData();
	}

	_self.reloadFilterData = function(){

        var param = "";
        param += top.param;

        param+="&p=get_SearchFilter_data";


        //started_ft_league,outright_ft_league
        //"live_ft_league","today_ft_league","early_ft_league","started_ft_league","outright_ft_league"
        param+="&totalBets="+_self.transTotalBets(toppar["tbet_showtype"]);

        //par_date = _self.transDate(toppar["tbet_showtype"],filterUse);
        if(toppar["date"]==null){
            param+="&date="+filterInitParam["date"]["_default"];
        }else{
            param+="&date="+toppar["date"];
        }
        //date future,all,today
        param+="&session="+_self.transSessionName(_self.transShowtypeName(toppar["tbet_showtype"]));
        //session
        param+="&showgtype="+top.tbet_gtype;
        //fs  showgtype  fi
		param+="&gtype="+top.tbet_gtype;

		var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadFilterFinish);
        getHttp.loadURL(top.url, "POST", param);
    }
    _self.loadFilterFinish = function(json){

        //console.log(json);
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }
        // console.log(hash);
        // var downline = hash["downline"];
        // var league = hash["league"];
        data_filter = hash;
        _self.setSelectEvent();
        _self.getModel(toppar, true);
    }
    _self.setSelectEvent=function(){
        // return;
		if(filterBigObj==null){
			for(var rtype in filterInitParam){
                try{
                    // console.log(rtype);
                    var rDom = dom.getElementById(rtype + "_div");
                    var rSel = dom.getElementById(rtype + "_sel");
                    var rNow = dom.getElementById(rtype + "_now");
                    var rSearch = dom.getElementById( rtype+"_search");
                    var rShowDiv = dom.getElementById(rtype + "_show");
                    filterInitParam[rtype]["_titleName"] = LS.get("btns_" + rtype);

                    // console.log(rtype+" 1");
                    if(filterInitParam[rtype]["mode"]*1==4 || filterInitParam[rtype]["mode"]*1==3){
                        var tmpAry = [];
                        for(var i=0;i<filterInitParam[rtype]["_breakpoint"].length;i++){
                            var tmpObj = new Object();
                            var rpoint = dom.getElementById(rtype + "_point"+(i+1));
                            filterInitParam[rtype]["_breakpoint"][i].div = rpoint;
                        }
                        var tmpkeysAry = Object.keys(filterInitParam[rtype]["_chkBtnDiv"]);
                        for (var i = 0; i < tmpkeysAry.length; i++) {
                            //var tmpBtnObj = new Object();
                            var tmpKey = tmpkeysAry[i];
                            var rbtn = dom.getElementById(rtype + "_chkBtn" + (i + 1));
                            filterInitParam[rtype]["_chkBtnDiv"][tmpKey].div = rbtn;
                        }
                        var str_blank = (top.langx == "en-us")? " ":"";
                        filterInitParam[rtype]["_setAllTitleName"] = rNow.innerHTML + str_blank + LS.get("filter_" + rtype + "_show");
                    }

                    // console.log(rtype+" 2");
                    filterInitParam[rtype]["_setDiv"] = rDom;
                    filterInitParam[rtype]["_contantView"] = rSel;
                    filterInitParam[rtype]["_titleView"] = rNow;
                    if(rSearch) filterInitParam[rtype]["_searchDiv"] = rSearch;
                    if(rShowDiv) filterInitParam[rtype]["_dataShowDiv"] = rShowDiv;
                    if(data_filter[rtype]) filterInitParam[rtype]["_data"] = data_filter[rtype];
                    // console.log(rtype+" 3");

                    //  util.addEvent(dom.getElementById("f_"+rtype+"_small"),"click",_self.openSmallFilter,{"MODE":rtype});
                }catch(e){console.log(e);}

                var set_smallFilter = {"dataSet": filterInitParam[rtype],"rtype": rtype};
                util.addEvent(dom.getElementById("f_" + rtype + "_small"), "click", _self.openSmallFilter, set_smallFilter);
			}

			filterBigObj = new util.filterBig(win,dom);
			filterBigObj.setParentclass(parentClass);
			filterBigObj.addEventListenEvent();
			filterBigObj.addEventListener("autoBackParam",_self.takeParam);
            filterBigObj.init(filterInitParam);
            _self.initFilter();
            _self.set_toppar();
            _self.set_sear_filter();
		}else{
			var tmpObj = new Object();
			var tmpAry = ["downline"];

			for(var i=0;i<tmpAry.length;i++){
				var rtype = tmpAry[i];
				if(data_filter[rtype]){
                    filterInitParam[rtype]["_data"] = data_filter[rtype];
                    var tmp_def = (toppar[rtype]!=null)? toppar[rtype]: "ALL" ;
                    tmpObj[rtype] = {"_data":data_filter[rtype],"_default":tmp_def};
                }else{
                    tmpObj[rtype] = {"_data":{},"_default":"ALL"};
                }
			}
            filterBigObj.reinit(tmpObj);
            _self.set_sear_filter();
        }
    }

    _self.setChooseFilter = function () {
        if (_self.size(filter_set[toppar["tbet_showtype"]]) == 0) {
            if (_self.size(filter_set["OVERVIEW"]) != 0) {
                toppar["view"] = filter_set["OVERVIEW"]["value"];
            }
            filter_set[toppar["tbet_showtype"]] = util.clone(toppar);
        } else {
            var sub_page = toppar["sub_page"];

            if(isBack){
                filter_set[toppar["tbet_showtype"]] = util.clone(toppar);
            }else{
                var tbet_gtype = toppar["tbet_gtype"];
                toppar = util.clone(filter_set[toppar["tbet_showtype"]]);
                toppar["tbet_gtype"] = tbet_gtype;
            }
            toppar["sub_page"] = sub_page;

        }
    }

    _self.size = function (obj) {
        var size = 0, key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) size++;
        }
        return size;
    };

    _self.takeParam = function(obj){
        filterUse = obj;
        // console.log("takeParam",obj);
    }

    _self.getFilterUse = function(name){
        // filterUse
        if(name=="date"){
            return filterUse["date"].toString().toLowerCase();
        }
        if(name=="downline"){
            var ret=filterUse["downline"];
            if (typeof ret == "object" || ret =="NONE") ret = "all";
            return ret.toString().toLowerCase();
        }
        if(name=="items"){
            return filterUse["items"].toString().toLowerCase();
        }
        if(name=="league"){
            return filterUse["league"].toString().toLowerCase();
        }
        if(name=="market"){
            return filterUse["market"].toString().toLowerCase();
        }
        if(name=="stake"){
            var tmp_type = "ALL";
            if(filterUse["stake"]["mode"] == "PER" || filterUse["stake"]["mode"] == "SIN"){
                tmp_type = top.tbet_gtype;
            }
            return  filterUse["stake"]["listGold"][tmp_type];
        }
        if(name=="view"){
            return filterUse["view"].toString().toLowerCase();
        }
    }
    // ==========過濾器

    _self.set_toppar = function(){
        toppar["date"] = _self.getFilterUse("date");
        toppar["stake"] = _self.getFilterUse("stake");
        toppar["stake_obj"] = util.clone(filterUse["stake"]) ;
        toppar["view"] = _self.getFilterUse("view");
        toppar["downline"] = _self.getFilterUse("downline");
    }

    // _self.keep_credit = function (e) {
    //     credit_old = e.target.value.replace(/\D/g, '')*1;
    // }
    _self.initShow = function (e) {
        var target= null;
        if(e){
            target =  e.target || null;
        }
        if(target.value == 0 )target.value = "";
        //console.log("initShow",e,target);
        // _self.clearErrorStatusCtl(e,target);
        // _self.clearErrorStatusConf();
    }
    _self.ChkCreditErr = function (e) {
        //console.log("ChkCreditErr",e);
        // if (e.target == ctlObj["credit"].input) {
        //     _self.showErrorCtl("credit", LS.get("str_maxcre"));
        // }
    }
    //信用額度轉換千位顯示
    _self.show_credits = function (e) {
        //console.log("show_credits",e)
        // util.Replace_Input_credits(e.target, credit_old, e);
        // if (e.type == "input") {
            // util.Replace_Input_credits(e.target, credit_old, e);
        // } else {
        //     util.Replace_credits(e.target, credit_old, e);
        // }
    }

}