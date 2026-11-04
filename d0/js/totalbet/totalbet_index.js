function totalbet_index(_win, _dom,_toppar){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "totalbet_index";
    var util;
    var LS;
    var config_set;
    var Timer;
    var timerHash;
    var LS_code;
    var _mc = new Object();
    var eventHandler = new Object();

    // var toppar = new Object();
    var toppar = _toppar;
    var dataHash = null; // type:Json_String  for Sort;
    //var showtypeAry = new Array("INPLAY","TODAY","EARLY","STARTED","PARLAY","OUTRIGHT","RESULTS");
    var gtypeAry = new Array("FT","BK","TN","VB","BM","TT","BS","SK","OP");

	var sort_type = "";
	var sort_asc = false; //asc or desc
    var _set = new Object();

    var _model_innerHTML;  //樣板


    var isExist = new Array();
    var aryNum = 0;

    var allbetCloseWtype = new Array();
    var leagueCloseAry = new Array();

    // ==========過濾器
    // var credit_old;
    var bugWtypeRtype = {};

    var bodyFrame; // totalbet_header
    var filter_set = new Object();
    var source_date_obj ;
    var data_filter ={};  //"league","downline","items"
    //var data_filter ={"league":[{"id":"111","name":"AAA"},{"id":"222","name":"BBB"}]};
    var filterInitParam = new Object();
	var filterBigObj = null;
    var filterUse = new Object();
    var firstFilterFlag =true;

    var arr_leagueid = new Array();
    var num_leagueid = 0;
    var fixed_div_height = 0 ;
    var now_fix_league = 0;
    var front_league_bak_height = 0;

    var isBack = false;
    // ==========過濾器
    _self.init=function(){
        if(toppar.back == "Y"){
            isBack = true;
            toppar.back = null;
        }

        /*
        tbet_gtype: "FT"
        tbet_showtype: "TODAY"
        */
        util.echo("totalbet_index complete");

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
        //_self.loadFilterData();
        util.setInfEvent(dom.getElementById("burger_div"), { "_focus": dom.getElementById("burger_sel"), "_setView": dom.getElementById("burger_div"), "_viewClass": "active" });
        //util.addEvent(dom.getElementById("burger_div"), "click", _self.loadFilterData);
        util.addEvent(dom.getElementById("show_filter"), "click", _self.showFilter);
        util.addEvent(dom.getElementById("hide_filter"), "click", _self.hideFilter);
        util.addEvent(dom.getElementById("edit_filter"), "click", _self.editFilter);
        util.addEvent(dom.getElementById("filter_cancel"), "click", _self.filterCancel);
        util.addEvent(dom.getElementById("filter_submit"), "click", _self.filterSubmit);


        //util.addEvent(dom.getElementById("allbetleague_now"), "click", _self.allbetleague_click);
        util.setInfEvent(dom.getElementById("allbetleague_now"), { "_focus": dom.getElementById("allbetleague_sel"), "_setView": dom.getElementById("allbetleague_now"), "_viewClass": "active","info_mode":false });
        // dom.getElementById("allbetleague_sel").prevScrollBottomIgnore = true;//橫向滾軸物件判斷使用
        // dom.getElementById("allbetleague_sel").setAttribute("name","prev_scroll_lock");//橫向滾軸物件判斷使用

        util.addEvent(dom.getElementById("allbetleague_text"), "input", _self.searchItem);
        util.addEvent(dom.getElementById("allbetleague_clearBtn"), "click", _self.clearSearch);

        // util.addEvent(dom.getElementById("stake_now"), "keyup", _self.keep_credit);
        util.ChkKeyCash(dom.getElementById("stake_now"), { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });

        //_self.connetToServer();

        // ＝＝＝＝＝＝ totalbet_index.js 連接 index.js (上層) ＝＝＝＝＝＝
        _self.addEventListener("goToPage", _self.indexGoToPageEvent);
        _self.addEventListener("showAccDetail", _self.indexShowAccDetail);
        _self.addEventListener("showReportDetail", _self.indexShowReportDetail);
        // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

        // ＝＝＝＝＝＝ totalbet_index.js 連接 index.js (上層) ＝＝＝＝＝＝
        bodyFrame.addEventListener("changeFilter",_self.changeFilter);
        bodyFrame.addEventListener("hideFilter",_self.hideFilterBack);
        // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

        //show header init

        _self.display(dom.getElementById("burger_div"),"");
        _self.display(dom.getElementById("filter_div"),"");
        // dom.getElementById("burger_sel").prevScrollBottomIgnore = true;//橫向滾軸物件判斷使用
        // dom.getElementById("burger_sel").setAttribute("name","prev_scroll_lock");//橫向滾軸物件判斷使用
        sort_type = "league_name";
        _set["CompleteFunc"] = {};
        _set["CompleteFunc"]["totalbet_model"] = _self.LoadComplete;
        _set["CompleteFunc"]["totalbet_model_allbet"] = _self.LoadAllbetComplete;
        if(_set["layer"]) _set["layer"] = "totalbet_model";
        _self.showFilter();
        _self.createTimer();
        _self.setChooseFilter();
        _self.filterHeader();
        _self.configFilter();
        _self.defaultFilter();
        _self.loadFilterData();
        // _self.setSelectEvent();
        //_self.set_sear_filter();
        //_self.subPage(toppar);
    }
    _self.subPage = function(par){
        if(par["sub_page"] == "totalbet_model_allbet"){
            _self.gotoAllbet(par,true);
            return "";
        }
        _self.getModel(par,true);
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
    _self.scroll_gtype = function(gtype){
        var obj = document.getElementById("tbet_"+gtype);
        var obj_left = obj.offsetWidth*1 + obj.offsetLeft*1;
        var ul = obj.parentElement;
        var go_left = obj_left*1 - ul.offsetWidth*1;
        if(go_left <0) go_left=0;
        //ul.scrollTo(go_left,0);
        ul.scrollLeft=go_left;
    }
    _self.changeFilter = function (param) {
        var set_rtype = param["rtype"] ;
        if (set_rtype == "stake") {
            filterBigObj.reDefault(set_rtype, param["param"][set_rtype]);
            filterUse["stake"] = param["param"][set_rtype];
        }else{
            filterBigObj.reDefault(set_rtype, param["param"][set_rtype].toString());
        }
        _self.set_toppar();
        _self.set_sear_filter();
        _self.reload();
        //_self.getData(toppar);
    }
    _self. hideFilterBack= function(param){
        _self.scroll_ver_event(dom.getElementById("body_show"),dom.getElementById("totalbet_show"));
    }

    //
    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        config_set = parentClass.getThis("config_set");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash");
        bodyFrame = parentClass.getThis("bodyFrame");
        filter_set = parentClass.getThis("filter_set");
    }

    // ==========過濾器
    _self.configFilter = function(){
        filterInitParam = {
            "date":{
                "info_mode":true,
                "title_mode":true,
                "_setDiv":null,
                "_titleView":null,
                "_contantView":null,
                "_type":null,
                "_viewClass":"active",
                "_list":["ALL","today","yesterday"],
                "_listSub":["ALL","Today","Yesterday"],
                "_default":"ALL",
                "mode":1,
            },
            "market":{
                "info_mode":true,
                "title_mode":true,
                "_setDiv":null,
                "_titleView":null,
                "_contantView":null,
                "_type":null,
                "_viewClass":"active",
                "_list":["ALL","rb","ft"],
                "_listSub":["ALL","LIVE","TODAY"],
                "_default":"ALL",
                "mode":1,

            },
            "league": {
                "mode": 3,
                "info_mode": false,
                "title_mode": true,
                "_setDiv": null,
                "_titleView": null,
                "_titleName":"",
                "_contantView": null,
                "_type":null,
                "_data": null, //1002: {id: "1002", alias: "stanNew", username: "stanNew"}
                "_viewClass": "active",
                "_default": "All",
                "_limitCount": 0,
                "_searchOpen": true,
                "_searchItem": "leagueID",
                "_searchDiv": null,
                "_dataShowDiv": null,
                "_breakpoint": [
                    {
                        "div": null,
                        "amount": 0
                    },
                    {
                        "div": null,
                        "amount": 12
                    }
                ],
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
            "stake":{
                "mode":2,
                "info_mode":false,
                "title_mode":true,
                "_setDiv":null,
                "_titleView":null,
                "_contantView":null,
                "_type":null,
                "_viewClass":"on",
                "_group":["ALL","PER"],
                "_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP"],
                "_default":{
                    "mode":"SIN",
                    "listGold":{
                        "ALL":0,
                        "FT":0,
                        "BK":0,
                        "TN":0,
                        "VB":0,
                        "BM":0,
                        "TT":0,
                        "BS":0,
                        "SK":0,
                        "OP":0
                    },
                    "listItem":toppar["tbet_gtype"]
                },
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
            "view":{
                "mode":1,
                "info_mode":true,
                "title_mode":true,
                "_setDiv":null,
                "_titleView":null,
                "_contantView":null,
                "_type":null,
                "_viewClass":"active",
                "_list":["full","my","c","s","a","csa","cs","sa"],
                "_listSub":[
                    "Full Percentage","D0 %","SMA %","Master Agent %","Agent %",
                    "SMA + Master Agent + Agent %",
                    "SMA + Master Agent %",
                    "Master Agent + Agent %",
                ],
                "_default":"my"
            },
            "items":{
                "mode":3,
                "info_mode":false,
                "title_mode":true,
                "_setDiv":null,
                "_titleView":null,
                "_contantView":null,
                "_type":null,
                "_data":null, //1002: {id: "1002", alias: "stanNew", username: "stanNew"}
                "_viewClass":"active",
                "_default":"all",
                "_limitCount":1,
                "_searchOpen":true,
                "_searchItem":"itemsID",
                "_searchDiv":null,
                "_dataShowDiv":null,
                "_breakpoint":[
                    {
                        "div":null,
                        "aomunt":0
                    }
                ],
                "_chkBtnMode":false,
                "_chkBtnDiv":
                {
                    "SAVE":
                    {
                        "div":null,
                        "disappear":true,
                    },
                    "CLEAR":
                    {
                        "div":null,
                        "disappear":true,
                    }

                }
            }
        }
    }
    _self.defaultFilter = function(){
        var view_map = {};
        view_map["d0"] = {};
        view_map["d0"]["data_list"] = ["full", "my", "c", "s", "a", "csa", "cs", "sa"];
        view_map["d0"]["data_listSub"] = _self.get_filter_name("view", view_map["d0"]["data_list"]);

        view_map["co"] = {};
        view_map["co"]["data_list"] = ["full","my","s","a","csa","cs","sa"];
        //view_map["co"]["data_listSub"] = ["Full Percentage","Company %","My Percentage","Master Agent %","Agent %","SMA + Master Agent + Agent %","SMA + Master Agent %","Master Agent + Agent %"];
        view_map["co"]["data_listSub"] = _self.get_filter_name("view",view_map["co"]["data_list"]);
        view_map["co"]["data_default"] = "full";
        view_map["su"] = {};
        view_map["su"]["data_list"] = ["full","my","a","sa"];
        view_map["su"]["data_listSub"] = _self.get_filter_name("view",view_map["su"]["data_list"]);
        //view_map["su"]["data_listSub"] = ["Full Percentage","My Percentage","Agent %","Master Agent + Agent %"];
        view_map["su"]["data_default"] = "full";
        view_map["ag"] = {};
        view_map["ag"]["data_list"] = ["full","my"];
        // view_map["ag"]["data_listSub"] = ["Full Percentage","My Percentage"];
        view_map["ag"]["data_listSub"] = _self.get_filter_name("view",view_map["ag"]["data_list"]);

        view_map["ag"]["data_default"] = "full";



        var set = {};
        set["INPLAY"] = {};
        set["INPLAY"]["date"] = {"show":false,"data_list":[""],"data_listSub":["Today"]};
        set["INPLAY"]["market"] = {"show":false,"data_list":[""],"data_listSub":[""]};
        set["INPLAY"]["items"] = {"show":false,"data_list":[""],"data_listSub":[""]};
        set["TODAY"] = {};
        set["TODAY"]["date"] = {"show":false,"data_list":[""],"data_listSub":["Today"]};
        set["TODAY"]["market"] = {"show":false,"data_list":[""],"data_listSub":[""]};
        set["TODAY"]["items"] = {"show":false,"data_list":[""],"data_listSub":[""]};
        set["EARLY"] = {};
        set["EARLY"]["date"] = {"show":true,"data_list":["all"],"data_listSub":["All"]};
        set["EARLY"]["market"] = {"show":false,"data_list":[""],"data_listSub":[""]};
        set["EARLY"]["items"] = {"show":false,"data_list":[""],"data_listSub":[""]};

        var data_list = new Array();
        var data_listSub = new Array();
        //data_listSub = _self.get_filter_name("date",data_list);

        // for(var i=1;i<8;i++){
        //     var date_str = _self.getNowDateTime("yyyy-mm-dd","d",i);
        //     data_list[i] = date_str;
        //     data_listSub[i] = date_str;
        // }
        if (source_date_obj == null) {
            source_date_obj = new source_date();
            source_date_obj.setLangx(top.langx);
            source_date_obj.setTimeZone(config_set.get("WEB_TIME_ZONE"));
        }
        data_list.push("all");
        data_listSub = _self.get_filter_name("date",data_list);

        var date_obj = source_date_obj.getDateSource(8, 3, 3) ;
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

        set["EARLY"]["date"]["data_list"] = data_list;
        set["EARLY"]["date"]["data_listSub"] = data_listSub;
        set["STARTED"] = {};
        set["STARTED"]["date"] = {"show":true,"data_list":["today","yesterday"],"data_listSub":["Today","Yesterday"],"data_default":"today"};
        set["STARTED"]["date"]["data_listSub"] = _self.get_filter_name("date",set["STARTED"]["date"]["data_list"]);

        set["STARTED"]["market"] = {"show":true,"data_list":["all","rb","pl"]};
        set["STARTED"]["market"]["data_listSub"] = _self.get_filter_name("market",set["STARTED"]["market"]["data_list"]);
        set["STARTED"]["items"] = {"show":false,"data_list":[""],"data_listSub":[""]};
        set["OUTRIGHT"] = {};
        set["OUTRIGHT"]["date"] = {"show":true,"data_list":[],"data_listSub":[],"data_default":"all"};
        set["OUTRIGHT"]["market"] = {"show":false,"data_list":[""],"data_listSub":[""]};
        //set["OUTRIGHT"]["items"] = {"show":true,"data_list":[""],"data_listSub":[""]};
        set["OUTRIGHT"]["items"] = {"show":false,"data_list":[""],"data_listSub":[""]};
        var data_list = new Array();
        var data_listSub = new Array();
        data_list.push("all");
        data_listSub = _self.get_filter_name("date",data_list);
        var monthArea = source_date_obj.getMonthArea();
        for(var i=0;i<monthArea["month"].length;i++){
            data_list.push(monthArea["month"][i]);
        }
        for(var i=0;i<monthArea["text"].length;i++){
            data_listSub.push(monthArea["text"][i]);
        }
        set["OUTRIGHT"]["date"]["data_list"] = data_list;
        set["OUTRIGHT"]["date"]["data_listSub"] = data_listSub;
        var setting = set[toppar["tbet_showtype"]];
        for(var k in setting){
            var kind = k;
            var datas = setting[k];
            var _div = dom.getElementById(kind+"_div");
            var _select = dom.getElementById(kind+"_select");
            var _small = dom.getElementById("f_"+kind+"_small");

            var display = (datas.show==true)?"":"none";
            if(_div)_div.style.display=display;
            if(_select)_select.style.display=display;
            if(_small)_small.style.display=display;

            if(datas.data_list)filterInitParam[kind]["_list"] = datas.data_list ;
            if(datas.data_listSub)filterInitParam[kind]["_listSub"] = datas.data_listSub ;
            if(datas.data_default)filterInitParam[kind]["_default"] = datas.data_default ;
        }
        filterInitParam["view"]["_list"]=view_map[top.login_layer]["data_list"];
        filterInitParam["view"]["_listSub"]=view_map[top.login_layer]["data_listSub"];
        filterInitParam["view"]["_default"]=view_map[top.login_layer]["data_default"];
        //console.log("defaultFilter",filterInitParam);
        for (var rtype in filterInitParam) {
            if(rtype=="stake"){
                //toppar["stake_obj"]["listItem"] == toppar["tbet_gtype"];
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
        /*
        date _list
        date _listSub
        market _list
        market _listSub
        view _list
        view _listSub
        */

    }
    _self.filterHeader = function(){
        var sort_l =dom.getElementById("f_sort_league_name");
        var sort_c =dom.getElementById("f_sort_count");
        var sort_g =dom.getElementById("f_sort_gold");


        var league_select =dom.getElementById("league_select");
        var f_league_small =dom.getElementById("f_league_small");
        var league_div =dom.getElementById("league_div");

        var date_select =dom.getElementById("date_select");
        var f_date_small =dom.getElementById("f_date_small");
        var date_div =dom.getElementById("date_div");



        if(toppar["tbet_showtype"] == "OUTRIGHT"){
            if(sort_l)sort_l.style.display="none";
            if(sort_c)sort_c.style.display="none";
            if(sort_g)sort_g.style.display="none";
        }else{
            if(sort_l)sort_l.style.display="";
            if(sort_c)sort_c.style.display="";
            if(sort_g)sort_g.style.display="";
        }

        if(_set["layer"] == "totalbet_model_allbet"){
            if(sort_l)sort_l.style.display="none";
            if(sort_c)sort_c.style.display="none";
            if(sort_g)sort_g.style.display="none";
            if(league_select)league_select.style.display="none";
            if(f_league_small)f_league_small.style.display="none";
            if(league_div)league_div.style.display="none";
            if(toppar["tbet_showtype"] == "EARLY" ||toppar["tbet_showtype"] == "STARTED" ||toppar["tbet_showtype"] == "OUTRIGHT"){
                if(date_select) date_select.style.display="none";
                if(f_date_small) f_date_small.style.display="none";
                if(date_div) date_div.style.display="none";
            }


        }else{

            if(league_select)league_select.style.display="";
            if(f_league_small)f_league_small.style.display="";
            if(league_div)league_div.style.display="";
            if(toppar["tbet_showtype"] == "EARLY" ||toppar["tbet_showtype"] == "STARTED" ||toppar["tbet_showtype"] == "OUTRIGHT"){
                if(date_select) date_select.style.display="";
                if(f_date_small) f_date_small.style.display="";
                if(date_div) date_div.style.display="";
            }
        }
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
        param+="&showgtype="+toppar["tbet_gtype"];
        //fs  showgtype  fi
		param+="&gtype="+toppar["tbet_gtype"];

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
        var tmp=hash["league"];
        for(var k in tmp){
            tmp[k]["alias"]="";
            tmp[k]["username"]=tmp[k]["name"];
        }
        //hash["league"] = tmp;
        data_filter = hash;
        //console.log("data_filter",data_filter);
        _self.setSelectEvent();
        if(firstFilterFlag == true){
            _self.subPage(toppar);
            firstFilterFlag = false;
        }
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
                    var rShowDiv = dom.getElementById( rtype+"_show");
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
                        var str_blank = (top.langx == "en-us") ? " " : "";
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
                    util.addEvent(dom.getElementById("f_"+rtype+"_small"),"click",_self.openSmallFilter,
                    {"dataSet":filterInitParam[rtype],"rtype":rtype}
                    );
                    //  util.addEvent(dom.getElementById("f_"+rtype+"_small"),"click",_self.openSmallFilter,{"MODE":rtype});
                }catch(e){console.log(e);}

			}

            filterBigObj = new util.filterBig(win,dom);
			// filterBigObj = new filterBig(win,dom);
			filterBigObj.setParentclass(parentClass);
			filterBigObj.addEventListenEvent();
            filterBigObj.addEventListener("autoBackParam",_self.takeParam);
            filterBigObj.init(filterInitParam);
            _self.initFilter();
            _self.set_toppar();
            _self.set_sear_filter();
		}else{
			var tmpObj = new Object();
			var tmpAry = ["league","downline","items"];

			for(var i=0;i<tmpAry.length;i++){
				var rtype = tmpAry[i];
				if(data_filter[rtype]){
                    filterInitParam[rtype]["_data"] = data_filter[rtype];
                    var tmp_def = (toppar[rtype]!=null)? toppar[rtype]: "ALL" ;
                    tmpObj[rtype] = {"_data":data_filter[rtype],"_default":tmp_def};
                }else{
                    tmpObj[rtype] = {"_data":{}};
                }
            }
            //console.log("tmpObj",tmpObj);
            filterBigObj.reinit(tmpObj);
            _self.set_sear_filter();
        }
    }
    _self.setChooseFilter = function () {
        if (_self.size(filter_set[toppar["tbet_showtype"]]) == 0 ) {
            if (_self.size(filter_set["OVERVIEW"]) != 0) {
                toppar["view"] = filter_set["OVERVIEW"]["value"] ;
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
        // console.log("takeParam",obj);
        filterUse = obj;
    }
    _self.getFilterUse = function(name){
        // filterUse
        var ret;
        if(name=="date"){
            ret = filterUse["date"].toString().toLowerCase();
        }
        if(name=="downline"){
            var ret=filterUse["downline"];
            if(typeof ret == "object" || ret=="NONE") ret = "All";
            ret = ret.toString().toLowerCase();
        }
        if(name=="items"){
            ret = filterUse["items"].toString().toLowerCase();
        }
        if(name=="league"){
            //ret = filterUse["league"].toString().toLowerCase();
            var ret=filterUse["league"];
            if(typeof ret == "object" || ret=="NONE") ret = "All";
            ret = ret.toString().toLowerCase();
        }
        if(name=="market"){
            ret = filterUse["market"].toString().toLowerCase();
        }
        if(name=="stake"){
            var tmp_type = "ALL";
            if(filterUse["stake"]["mode"] == "PER" || filterUse["stake"]["mode"] == "SIN"){
                tmp_type = toppar["tbet_gtype"];
            }
            ret =  filterUse["stake"]["listGold"][tmp_type];
        }
        if(name=="view"){
            ret = filterUse["view"].toString().toLowerCase();
        }
        //console.log(name,ret);
        return ret;
    }
    // ==========過濾器
    _self.chgGtype = function (e, param) {
        parentClass.dispatchEvent("showLoading", {"showLoading":true});
        toppar["tbet_gtype"] = param.type;
        _self.initGtype();
        _self.set_toppar();
        _self.getModel(toppar,false);
        // _self.loadFilterData();
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
        nameHash["PARLAY"] = "parly";
        nameHash["OUTRIGHT"] = "outright";
        nameHash["RESULTS"] = "results";
        //    //var showtypeAry = new Array("INPLAY","TODAY","EARLY","STARTED","PARLAY","OUTRIGHT","RESULTS");

        if(nameHash[name] == null) nameHash[name] = "re";

        return nameHash[name];

    }
    _self.transSessionName = function (name) {
        var nameHash = new Object();
        nameHash[name] = "";
        nameHash["re"] = "RB";
        nameHash["today"] = "FT";
        nameHash["fu"] = "FU";
        nameHash["started"] = "PL";

        nameHash["parly"] = "P";
        nameHash["outright"] = "FS";
        //nameHash["results"] = "FT";
        if(nameHash[name] == null) nameHash[name] = "RB";

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
        if(nameHash[name] == null) nameHash[name] = "live_ft_league";
        return nameHash[name];
    }
    _self.transDate = function(name,obj){
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

    // ＝＝＝＝＝＝＝＝  外層 function ＝＝＝＝＝＝＝＝＝
    _self.getModel = function (par,isInit) {
        parentClass.dispatchEvent("showLoading", {"showLoading":true});
        //重置 scrollbar
        var totalbet_show = dom.getElementById("totalbet_show");
        if(totalbet_show!=null)totalbet_show.innerHTML = "";

        if(isInit){
            var param = new Object();
            param["page"] = "totalbet_model";
            param["target"] = "totalbet_model";
            param["retFun"] = _self.getModelComplete;
            //param["retParam"] = needGet;
            //if(needGet)param["backGoToPage"] = "Y";
            param["post"] = "tbet_showtype=" + _self.transShowtypeName(par["tbet_showtype"]) + "&tbet_gtype=" + par["tbet_gtype"];
            // param["backGoToPage"] = "Y";
            // param["isTrans"]="N";
            // param["back"]="N";
            // param["useDefineParent"] = "Y"
            param["par"] = par;
            //param["tbet_showtype"] = par["tbet_showtype"];
            filter_set[par["tbet_showtype"]] = util.clone(par);
            parentClass.dispatchEvent("goToPage", param);
        }else{
            var param = new Object();
            // param["sub_page"] = "totalbet_model";
            // param["sub_target"] = "totalbet_model";
            //param["sub_retFun"] = _self.getModelComplete;
            //param["retParam"] = needGet;
            //if(needGet)param["backGoToPage"] = "Y";
            // param["sub_post"] = "tbet_showtype=" + _self.transShowtypeName(par["tbet_showtype"]) + "&tbet_gtype=" + par["tbet_gtype"];
            // param["backGoToPage"] = "Y";
            // param["isTrans"]="N";
            // param["back"]="N";
            // param["useDefineParent"] = "Y"
            par["sub_page"] = "totalbet_model";

            param["page"] = "totalbet_header";
            param["postHash"] = par;
            // param["tbet_showtype"] = par["tbet_showtype"];
            filter_set[par["tbet_showtype"]] = util.clone(par);
            parentClass.dispatchEvent("bodyGoToPage", param);
        }
    }

    _self.getModelComplete = function (par) {
        leagueCloseAry = null;
        _self.getData(par["par"]);
    }

    _self.getData = function (par) {
        filter_set[toppar["tbet_showtype"]] = util.clone(toppar);
        var param = "";
        param += top.param;
        if(par["tbet_showtype"] == "OUTRIGHT"){
            param += "&p=get_league_wager_fs";
        }else{
            param += "&p=get_league_wager";
        }
        //takeParam
        //param+="&session="+_self.transSessionName(par["tbet_showtype"]);
        // toppar["tbet_showtype"] = par["tbet_showtype"];
        param+="&session="+ _self.transSessionName(_self.transShowtypeName(par["tbet_showtype"]));
        param+="&gtype="+par["tbet_gtype"];



        param+="&date="+par["date"];
        param+="&market="+par["market"];
        param+="&gold="+par["stake"];
        param+="&percentage="+par["view"];
        param+="&down_id="+par["downline"];
        param+="&league_id="+par["league"];

        param+="&filter=Y";// 未知用途
        param+="&symbol=more";// 未知用途

        hr = new HttpRequest();
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadComplete);
        hr.loadURL(top.url, "POST", param);
    }

    _self.LoadComplete = function (json) {
        var hash;
        _set["layer"] = "totalbet_model";
        dataHash = json;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }
        _self.displayLeagueHeader();
        _self.filterHeader();
        if(hash["code"] == "no_data" || hash["code"] == "game_close" || hash["code"] == "gidm_not_find"){
            _self.display(dom.getElementById("totalbet_show"),"none");
            _self.display(dom.getElementById("totalbet_nodata"),"");
        }else{
            _self.display(dom.getElementById("totalbet_show"),"");
            _self.display(dom.getElementById("totalbet_nodata"),"none");
            //hash["league"] = _self.sortData(hash["league"], sort_type, sort_asc);
            if(toppar["tbet_showtype"] == "OUTRIGHT"){
                if(leagueCloseAry==null){
                    leagueCloseAry = new Array();
                    var cnt=0;
                    for(var k in hash["league"]){
                        if(cnt>=config_set.get("ALLBETS_LEAGUE_ACTIVE")){
                        // if(cnt>=2){
                            leagueCloseAry.push(hash["league"][k]["lid"]+"");
                        }
                        cnt ++;
                    }
                }else{
                    var tmp = new Array();
                    for(var k in hash["league"]){
                        lid=hash["league"][k]["lid"]+"";
                        if(leagueCloseAry.indexOf(lid) != -1){
                           tmp.push(lid);
                        }
                    }
                    leagueCloseAry = tmp;
                }
                _self.parseDataFS(hash);
            }else{

                _self.sortData(hash["league"], sort_type, sort_asc);
                if(leagueCloseAry==null){
                    leagueCloseAry = new Array();
                    var cnt=0;
                    for(var k=0;k<hash["league"].length;k++){
                        if(cnt>=config_set.get("ALLBETS_LEAGUE_ACTIVE")){
                        // if(cnt>=3){
                            leagueCloseAry.push(hash["league"][k]["lid"]+"");
                        }
                        cnt ++;
                    }
                }
                //console.log("sort end",hash["league"]);
                if(sort_type=="count" || sort_type == "gold"){
                    for(var k=0;k<hash["league"].length;k++){
                        _self.sortData(hash["league"][k]["game"], sort_type, sort_asc);
                    }
                }
                // console.log(hash["league"]);
                _self.parseData(hash);
            }
        }
        _self.startTimer();
        parentClass.dispatchEvent("showLoading", {"showLoading":false});
    }
    // =========== sort ===================
    _self.sortData = function (ary, types, up_down) {
        if (ary.length <= 1) return ary;
        if(types == "league_name")types = "event";
        var string_type = ",league_name,event,";
        if (string_type.indexOf(types) == -1) {
            var Reverse_type = ",count,gold,";
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
                    ret = (a_val - b_val);
                    // console.log("up_down",a_val,b_val,ret);
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
                    ret = (b_val - a_val);
                    // console.log("down_up",a_val,b_val,ret);
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
        // console.log("sort start",ary);
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
        _set["CompleteFunc"][_set["layer"]](dataHash);
    }

    // =========== sort end ===================
    _self.started_header = function(market){
        var ft_display = "";
        var rb_display = "";
        if(market == "rb"){
            ft_display = "none";
        }
        if(market == "pl"){
            rb_display = "none";
        }
        dom.getElementById("total_text_ft").style.display=ft_display;
        dom.getElementById("total_text_rb").style.display=rb_display;
        dom.getElementById("total_wagers_ft").style.display=ft_display;
        dom.getElementById("total_wagers_rb").style.display=rb_display;
        dom.getElementById("total_stake_ft").style.display=ft_display;
        dom.getElementById("total_stake_rb").style.display=rb_display;
    }
    _self.displayLeagueHeader = function(){
        _self.display(dom.getElementById("league_header"),"");
        _self.display(dom.getElementById("allbetleague_div"),"none");
        _self.display(dom.getElementById("total_payout_head"),"none");
        if(toppar["tbet_showtype"] == "PARLAY"){
            _self.display(dom.getElementById("total_payout_head"),"");
        }
        if(toppar["tbet_showtype"] == "STARTED"){
            _self.display(dom.getElementById("startrd_header"),"");

            _self.display(dom.getElementById("league_header"),"none");
        }
        dom.getElementById("total_wagers").innerHTML = "0";
        dom.getElementById("total_stake").innerHTML = "0.0";
        dom.getElementById("total_payout").innerHTML = "0.0";

        dom.getElementById("total_wagers_ft").innerHTML = "0";
        dom.getElementById("total_wagers_rb").innerHTML = "0";
        dom.getElementById("total_stake_ft").innerHTML = "0.0";
        dom.getElementById("total_stake_rb").innerHTML = "0.0";
        _self.started_header(toppar["market"]);
    }
    _self.parseData = function (hash) {
        // var sort_model = dom.getElementById("sort_model");
        // var div_model = dom.getElementById("league_model");
        var gid;
        var gidm;
        var objid = ",total_wagers,total_stake,total_payout,totalbet_show,sort_model,league_model,league_model_RB,league_model_FT,";
        objid += "total_wagers_ft,total_stake_ft,total_wagers_rb,total_stake_rb,"
        var tmpObj = util.getObjAry(dom, objid);
        _mc = util.mergeArray(_mc, tmpObj);

        var total_wagers=0,total_stake=0.0,total_payout=0.0;
        var total_wagers_ft=0,total_stake_ft=0.0;
        var total_wagers_rb=0,total_stake_rb=0.0;

        var totalbet_show_innerHTML = _mc["sort_model"].innerHTML;

        for(var i=0; i<hash["league"].length; i++){
            var tpl = new fastTemplate_a1();
            var gameHash = hash["league"][i]["game"];
            //"All","rb","pl"
            if(toppar["market"] == "rb"){
                tpl.init(_mc["league_model_RB"].cloneNode(true));
            }else if(toppar["market"] == "pl"){
                tpl.init(_mc["league_model_FT"].cloneNode(true));
            }else{
                tpl.init(_mc["league_model"].cloneNode(true));
            }
            for(var j=0; j<gameHash.length; j++){
                tpl.addBlock("tbody");

                var retime = _self.getGameTime(gameHash[j]["session"],toppar["tbet_gtype"]);
                tpl.replace(new RegExp("\\\*SE_NOW\\\*","gi"),retime[0]);
                tpl.replace(new RegExp("\\\*RETIME\\\*","gi"),retime[1]);


                tpl.replace(new RegExp("\\\*TEAM_H\\\*","gi"),gameHash[j]["team_h"]);
                tpl.replace(new RegExp("\\\*TEAM_C\\\*","gi"),gameHash[j]["team_c"]);
                // var score_h,score_c;
                // score_h=gameHash[j]["session"]["score_h"];
                // score_c=gameHash[j]["session"]["score_c"];
                // if(score_h*1 <0) score_h="";
                // if(score_c*1 <0) score_c="";
                // tpl.replace(new RegExp("\\\*SCORE_H\\\*","gi"),score_h);
                // tpl.replace(new RegExp("\\\*SCORE_C\\\*","gi"),score_c);
                var best_str = gameHash[j]["session"]["best"];
                if(best_str==null) best_str = "";

                // if(toppar["tbet_showtype"] == "TODAY" || toppar["tbet_showtype"] == "EARLY"){
                //     if(toppar["tbet_gtype"] == "TT"||toppar["tbet_gtype"]=="TN") best_str = "";
                // }
                //語系
                tpl.replace(new RegExp("\\\*BEST\\\*","gi"),_self.bestToLS(best_str,toppar["tbet_gtype"]));
                //LS.get(toppar["tbet_gtype"]+"_"+gameHash[j]["session"]["best"].replace(" ","_"))
                //tpl.replace(new RegExp("\\\*BEST\\\*","gi"),gameHash[j]["session"]["best"]);

                tpl.replace(new RegExp("\\\*GID\\\*","gi"),gameHash[j]["m_gid"]);
                //語系
                tpl.replace(new RegExp("\\\*MIDFIELD\\\*","gi"),(gameHash[j]["midfield"]=="Y")?LS.get("midfield"):"");
                if(toppar["tbet_showtype"] == "STARTED"){
                    tpl.replace(new RegExp("\\\*LIVE\\\*","gi"),"");
                }else{
                    tpl.replace(new RegExp("\\\*LIVE\\\*","gi"),(gameHash[j]["live"]=="Y")?LS.get("live"):"");
                }


                if(toppar["tbet_showtype"] == "INPLAY"){
                    tpl.replace(new RegExp("\\\*GAME_DATE\\\*","gi"),gameHash[j]["session"]["retime"]);
                    tpl.replace(new RegExp("\\\*GAME_TIME\\\*","gi"),gameHash[j]["session"]["reminute"]);
                }else if( toppar["tbet_showtype"] == "EARLY" || toppar["tbet_showtype"] == "STARTED" ){
                    tpl.replace(new RegExp("\\\*GAME_DATE\\\*","gi"),gameHash[j]["session"]["date"].substr(5,5)+" ");
                    tpl.replace(new RegExp("\\\*GAME_TIME\\\*","gi"),gameHash[j]["session"]["time"].substr(0,5));
                }else{
                    tpl.replace(new RegExp("\\\*GAME_DATE\\\*","gi"),"");
                    tpl.replace(new RegExp("\\\*GAME_TIME\\\*","gi"),gameHash[j]["session"]["time"].substr(0,5));
                }
                var result_over = gameHash[j]["game_over"];
                if(toppar["tbet_showtype"] == "INPLAY"){
                    result_over = "Y"
                }
                tpl = _self.gtype_result(toppar["tbet_gtype"],tpl,gameHash[j]["session"],result_over);




                if(toppar["tbet_showtype"] == "STARTED"){

                    tpl.replace(new RegExp("\\\*WAGER_COUNT_FT\\\*","gi"),_self.wagerFormat(gameHash[j]["wager_count_FT"]*1));
                    tpl.replace(new RegExp("\\\*WAGER_GOLD_FT\\\*","gi"),_self.goldFormat(gameHash[j]["wager_gold_FT"]*1));
                    tpl.replace(new RegExp("\\\*MORE_COUNT_FT\\\*","gi"),_self.wagerFormat(gameHash[j]["more_count_FT"]*1));

                    tpl.replace(new RegExp("\\\*WAGER_COUNT_RB\\\*","gi"),_self.wagerFormat(gameHash[j]["wager_count_RB"]*1));
                    tpl.replace(new RegExp("\\\*WAGER_GOLD_RB\\\*","gi"),_self.goldFormat(gameHash[j]["wager_gold_RB"]*1));
                    tpl.replace(new RegExp("\\\*MORE_COUNT_RB\\\*","gi"),_self.wagerFormat(gameHash[j]["more_count_RB"]*1));


                    tpl.replace(new RegExp("\\\*MORE_COUNT\\\*","gi"),_self.wagerFormat(gameHash[j]["more_count_FT"]*1+gameHash[j]["more_count_RB"]*1));

                    total_wagers_ft += gameHash[j]["wager_count_FT"]*1;
                    total_stake_ft += gameHash[j]["wager_gold_FT"]*1;

                    total_wagers_rb += gameHash[j]["wager_count_RB"]*1;
                    total_stake_rb += gameHash[j]["wager_gold_RB"]*1;
                }else{

                    tpl.replace(new RegExp("\\\*WAGER_COUNT\\\*","gi"),_self.wagerFormat(gameHash[j]["wager_count"]));
                    tpl.replace(new RegExp("\\\*WAGER_GOLD\\\*","gi"),_self.goldFormat(gameHash[j]["wager_gold"]));
                    tpl.replace(new RegExp("\\\*MORE_COUNT\\\*","gi"),_self.wagerFormat(gameHash[j]["more_count"]));

                    total_wagers += gameHash[j]["wager_count"];
                    total_stake += gameHash[j]["wager_gold"];
                    total_payout += gameHash[j]["payout"];
                }


            }
            var tpl_innerHtml = tpl.fastPrint();
            tpl_innerHtml = tpl_innerHtml.replace(/\*LEAGUE\*/g, hash["league"][i]["league_name"]);
            tpl_innerHtml = tpl_innerHtml.replace(/\*LEAGUEID\*/g, hash["league"][i]["lid"]);
            tpl_innerHtml = tpl_innerHtml.replace(/\*COUNT\*/g, _self.wagerFormat(hash["league"][i]["count"]*1));
            tpl_innerHtml = tpl_innerHtml.replace(/\*GOLD\*/g, _self.goldFormat(hash["league"][i]["gold"]*1));

            tpl_innerHtml = tpl_innerHtml.replace(/\*COUNT_FT\*/g, _self.wagerFormat(hash["league"][i]["count_FT"]*1));
            tpl_innerHtml = tpl_innerHtml.replace(/\*GOLD_FT\*/g, _self.goldFormat(hash["league"][i]["gold_FT"]*1));

            tpl_innerHtml = tpl_innerHtml.replace(/\*COUNT_RB\*/g, _self.wagerFormat(hash["league"][i]["count_RB"]*1));
            tpl_innerHtml = tpl_innerHtml.replace(/\*GOLD_RB\*/g, _self.goldFormat(hash["league"][i]["gold_RB"]*1));
            totalbet_show_innerHTML += tpl_innerHtml;

        }

        if(toppar["tbet_showtype"] == "STARTED"){
            _mc["total_wagers_ft"].innerHTML = _self.wagerFormat(total_wagers_ft);
            _mc["total_stake_ft"].innerHTML = _self.goldFormat(total_stake_ft);
            _mc["total_wagers_rb"].innerHTML = _self.wagerFormat(total_wagers_rb);
            _mc["total_stake_rb"].innerHTML = _self.goldFormat(total_stake_rb);
        }else{
            _mc["total_wagers"].innerHTML = _self.wagerFormat(total_wagers);
            _mc["total_stake"].innerHTML = _self.goldFormat(total_stake);
            _mc["total_payout"].innerHTML = _self.goldFormat(total_payout);
        }

        _mc["totalbet_show"].innerHTML = totalbet_show_innerHTML;

        var cnt=0;
        //新增進內層的點擊事件
        arr_leagueid = new Array();
        for(var i=0; i<hash["league"].length; i++){
            cnt++;
            var gameHash = hash["league"][i]["game"];
            leagueid = hash["league"][i]["lid"]+"";
            var league_head = dom.getElementById("league_head_"+leagueid);
            arr_leagueid.push("league_head_" + leagueid);

            _self.removeClassStr(league_head,"active");
            util.addEvent(league_head, "click", _self.leagueClose, { "league_id": leagueid });
            if(leagueCloseAry.indexOf(leagueid)!= -1){
                _self.divChildrenClose(league_head);
            }


            for(var j=0; j<gameHash.length; j++){
                gid = gameHash[j]["m_gid"];
                gidm = gameHash[j]["gidm"];
                util.addEvent(dom.getElementById("more_count_gold_"+gid), "click", _self.gotoAllbetEvent, { "gidm":gidm});
                util.addEvent(dom.getElementById("more_count_gold_small_"+gid), "click", _self.gotoAllbetEvent, { "gidm":gidm});
                util.addEvent(dom.getElementById("more_count_"+gid), "click", _self.gotoAllbetEvent, { "gidm":gidm});
                util.addEvent(dom.getElementById("more_count_small_"+gid), "click", _self.gotoAllbetEvent, { "gidm":gidm});
            }
        }
        num_leagueid = arr_leagueid.length ;
        _self.setSortClick(true);
        _self.initScroll();

    }


    _self.initScroll = function () {
        //切換時重置下拉霸事件 以免互相影響
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        //util.classFunc(dom.getElementById("totalbet_show"), "tbet_title_fixed", "remove");
        if(toppar["tbet_showtype"] == "OUTRIGHT"){
            fixed_div_height = 0;
        }else{
            fixed_div_height = dom.getElementById("totalbet_show").children[0].nextElementSibling.clientHeight;
        }
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollVerEvent, dom.getElementById("totalbet_show"));
        now_fix_league = 0;
        _self.scroll_ver_event(dom.getElementById("body_show"), dom.getElementById("totalbet_show"));
    }

    _self.scrollVerEvent = function (e, targetObj) {
        _self.scroll_ver_event(e.target, targetObj);
    }

    _self.scroll_ver_event = function (target, targetObj) {
        if (target == null || !dom.getElementById("re_function")) return;
        if(filterBigObj!=null){
            if(filterBigObj.closeAllDownlist != null){
                filterBigObj.closeAllDownlist();
            }
        }
        var newScrollTop = target.scrollTop;
        var func_h = dom.getElementById("re_function").clientHeight + dom.getElementById("re_function").offsetTop;
        if (getView().viewportwidth < 768){
            fixed_div_height = 0;
        }else{
            if (fixed_div_height == 0 && toppar["tbet_showtype"] != "OUTRIGHT"){
                fixed_div_height = dom.getElementById("totalbet_show").children[0].nextElementSibling.clientHeight;
            }
        }
        //欄位header 固定
        if (newScrollTop >= func_h) {
            util.classFunc(targetObj, "tbet_title_fixed");
            if (toppar["tbet_showtype"] == "OUTRIGHT") {
                util.classFunc(targetObj, "outright");
                //var use_class = "tbet_fixed_1stitem";
            }
            var use_class = "tbet_fixed_2rditem";
            //改變排序時 重新定位
            if (now_fix_league == 0){
                for (var key in arr_leagueid){
                    var tmp_ = dom.getElementById(arr_leagueid[key]) ;
                    if ((newScrollTop + fixed_div_height + tmp_.clientHeight) >= (tmp_.offsetTop + targetObj.offsetTop ) ){
                        now_fix_league = key ;
                        front_league_bak_height = tmp_.offsetTop + targetObj.offsetTop;
                    }else{
                        if (now_fix_league>0){
                            now_fix_league++ ;
                        }
                        break;
                    }
                }
            }

            //聯盟header 固定
            if (num_leagueid > 0 && now_fix_league < num_leagueid) {
                var fixed_league = dom.getElementById(arr_leagueid[now_fix_league]);
                var fixed_league_height = fixed_league.offsetTop + targetObj.offsetTop;
                if (now_fix_league > 0){
                    fixed_league_height += fixed_league.clientHeight
                }else{
                    fixed_league_height -= 4;
                }

                if ((newScrollTop + fixed_div_height + fixed_league.clientHeight) >= fixed_league_height  ){
                    if (now_fix_league > 0) {
                        util.classFunc(dom.getElementById(arr_leagueid[(now_fix_league - 1)]), use_class, "remove");
                        util.classFunc(dom.getElementById(arr_leagueid[(now_fix_league - 1)]), "down_head");
                        util.classFunc(fixed_league, use_class);
                    }else{
                        util.classFunc(fixed_league, use_class);
                    }
                    //front_league_bak_height = fixed_league_height + fixed_league.clientHeight;
                    front_league_bak_height = fixed_league_height;
                    now_fix_league++;
                } else {
                    if (now_fix_league > 1) {
                        var front_fixed_league = dom.getElementById(arr_leagueid[(now_fix_league - 1)]);
                        var front_fixed_league2 = dom.getElementById(arr_leagueid[(now_fix_league - 2)]);
                        if ((newScrollTop + fixed_div_height + front_fixed_league.clientHeight) <= front_league_bak_height) {
                            if (toppar["tbet_showtype"] == "OUTRIGHT") {
                                front_league_bak_height = front_fixed_league2.offsetTop + targetObj.offsetTop - fixed_div_height ;
                            }else{
                                if (getView().viewportwidth < 768){
                                    front_league_bak_height = front_fixed_league2.offsetTop + targetObj.offsetTop - fixed_div_height ;
                                }else{
                                    front_league_bak_height = front_fixed_league2.offsetTop + 12 + targetObj.offsetTop - fixed_div_height + front_fixed_league2.clientHeight;
                                }
                            }

                            util.classFunc(front_fixed_league, use_class, "remove");
                            util.classFunc(front_fixed_league2, use_class);
                            now_fix_league--;
                        } else {
                            util.classFunc(front_fixed_league, use_class);
                        }
                    } else {
                        util.classFunc(fixed_league, use_class, "remove");
                    }
                }
            }else{
                var front_fixed_league = dom.getElementById(arr_leagueid[(now_fix_league - 1)]);
                var front_fixed_league2 = dom.getElementById(arr_leagueid[(now_fix_league - 2)]);
                if ((newScrollTop + fixed_div_height + front_fixed_league.clientHeight) <= front_league_bak_height) {
                    if (toppar["tbet_showtype"] == "OUTRIGHT") {
                        front_league_bak_height = front_fixed_league2.offsetTop + targetObj.offsetTop - fixed_div_height;
                    } else {
                        if (getView().viewportwidth < 768) {
                            front_league_bak_height = front_fixed_league2.offsetTop + targetObj.offsetTop - fixed_div_height;
                        } else {
                            front_league_bak_height = front_fixed_league2.offsetTop + 12 + targetObj.offsetTop - fixed_div_height + front_fixed_league2.clientHeight;
                        }
                    }

                    util.classFunc(front_fixed_league, use_class, "remove");
                    util.classFunc(front_fixed_league2, "down_head", "remove");
                    util.classFunc(front_fixed_league2, use_class);
                    now_fix_league--;
                } else {
                    util.classFunc(front_fixed_league, use_class);
                    util.classFunc(front_fixed_league2, "down_head");
                }
            }
        } else {
            util.classFunc(targetObj, "tbet_title_fixed", "remove");
            if (toppar["tbet_showtype"] == "OUTRIGHT") {
                util.classFunc(targetObj, "outright", "remove");
            }
        }

        //_self.checkShowLazyLoading(e.target);
    }
    _self.createRFmodel=function(){
        var tmp_model = document.getElementById('tmp_model');
        if(tmp_model==null)return;
        //console.log(tmp_model);
        var setNum = new Array("A","B","C","D","E");
        var gameNum = new Array("01","02","03","04","05","06","07","08","09","10",
                                "11","12","13","14","15","16","17","18","19","20",
                                "21","22","23","24","25","26","27","28","29","30",
                                "31","32","33","34","35","36","37","38","39","40",
                                "41","42","43","44","45","46","47","48","49","50");

        var wtype_model = "";
        if(toppar["tbet_showtype"] == "INPLAY"){
            wtype_model = "model_ROUH_0";
        }
        if(toppar["tbet_showtype"] == "STARTED"){
            wtype_model = "model_OUH_0";
        }
        var parentDiv = document.getElementById(wtype_model).parentNode;
        var ROUH = document.getElementById(wtype_model);

        for(var a=0; a<setNum.length; a++)
        {
            var tmpNum = 0;
            if(setNum[a]=="A" || setNum[a]=="B" || setNum[a]=="D") tmpNum = 13;// 一二四盤
            else tmpNum = 50;// 三五盤

            //console.log(tmpNum);
            for(var b=0; b<tmpNum; b++)
            {
                var model_RF = tmp_model.children[0].cloneNode(true);
                //console.log("model_RF:"+model_RF);
                var tmp_div = document.createElement("div");
                tmp_div.appendChild(model_RF);
                var wtype = setNum[a]+gameNum[b];
                //要替換tag的地方
                tmp_div.innerHTML = tmp_div.innerHTML.replace(/\*WTYPE\*/g, wtype);
                // tmp_div.innerHTML = tmp_div.innerHTML.replace(/\*WTYPE_STR\*/g, _top["LS"].getLS("title_RF"+setNum[a]+gameNum[b]+"_0_TN"));
                tmp_div.innerHTML = tmp_div.innerHTML.replace(/\*WTYPE_STR\*/g,LS.get("title_RF"+setNum[a]+gameNum[b]+"_0_TN"));
                var child = tmp_div.children[0].cloneNode(true);
                //console.log("child:"+child);
                // if(!_self.in_array(wtype,isExist))
                // {
                //     parentDiv.insertBefore(child,ROUH);
                //     isExist[aryNum] = setNum[a]+gameNum[b];
                //     aryNum++;
                // }
                parentDiv.insertBefore(child,ROUH);
                //TITLE_RFA02_0_TN 語系
            }
        }
    }
    _self.in_array=function(_key, ary){
        var ret = false;
        if(typeof(_key)=="string" && typeof(ary)=="object"){
                var str = ","+ary.join(",")+",";
                var _find = ","+_key+",";
                if(str.indexOf(_find)!=-1){
                        ret = true;
                }
        }
        return ret;
    }
    _self.scoreToString = function(num,isOver,key,gtype){
        if(isOver=="N") return "0";
        if(isOver=="DN") return "";
        if(num==null)return "";
        if(num*1<0) return "";
        return num;
    }
    _self.bestToLS = function(bestStr,gtype){
        var ret = bestStr;
        if(gtype=="SK")return ret;
        if(bestStr.indexOf("Best of 3") != -1){
            ret = LS.get("Best_of_3");
        }
        if(bestStr.indexOf("Best of 5") != -1){
            ret = LS.get("Best_of_5");
        }
        if(bestStr.indexOf("Best of 7") != -1){
            ret = LS.get("Best_of_7");
        }
        if(bestStr.indexOf("Best of 12") != -1){
            ret = LS.get("Best_of_12");
        }
        return ret;
    }
    _self.gtype_result = function(gtype,tpl,hash,isOver){
        //CANCEL_DISPLAY CANCEL_TYPE
        var show_game_num = "";
        var result = 0;
        var ordinal_num = Array("","1st","2nd","3th","4th","5th","6th","7th");
        if(hash["result_type"] == "DN") isOver = "DN";
        if(gtype=="FT"){
            result = hash["result_FT_H"]*1;
            tpl.replace(new RegExp("\\\*RESULT_1H_H\\\*","gi"),_self.scoreToString(hash["result_1H_H"],isOver));
            tpl.replace(new RegExp("\\\*RESULT_1H_C\\\*","gi"),_self.scoreToString(hash["result_1H_C"],isOver));
            tpl.replace(new RegExp("\\\*RESULT_FT_H\\\*","gi"),_self.scoreToString(hash["result_FT_H"],isOver));
            tpl.replace(new RegExp("\\\*RESULT_FT_C\\\*","gi"),_self.scoreToString(hash["result_FT_C"],isOver));
            if(toppar["tbet_showtype"]=="INPLAY"){
                tpl.replace(new RegExp("\\\*SCORE_COLOR_"+hash["lastScore"]+"\\\*","gi"),"word_darkOrange");
            }
        }
        if(gtype=="BK" ){
            result = hash["result_FT_H"]*1;
            tpl.replace(new RegExp("\\\*RESULT_FT_H\\\*","gi"),_self.scoreToString(hash["result_FT_H"],isOver));
            tpl.replace(new RegExp("\\\*RESULT_FT_C\\\*","gi"),_self.scoreToString(hash["result_FT_C"],isOver));


            if(toppar["tbet_showtype"]=="INPLAY"){
                lastScore = hash["sc_new"];
                if(lastScore == "A") lastScore = "C";
                tpl.replace(new RegExp("\\\*SCORE_COLOR_"+lastScore+"\\\*","gi"),"word_darkOrange");
            }
        }
        if(gtype=="OP" ){
            result = hash["result_FT_H"]*1;
        }
        if(gtype == "BS"){
            result = hash["result_FT_H"]*1;

            var score_h = hash["score_h"];//總得分
            var score_c = hash["score_c"];
            var retime = hash["retime"];
            var reminute = hash["reminute"];
            var outCount = hash["outCount"];//出局數
            var base_1B = hash["base_1B"]; //base_x 
            var base_2B = hash["base_2B"];
            var base_3B = hash["base_3B"];
            var lastScore =  hash["lastScore"];


            tpl.replace(new RegExp("\\\*OUT_COUNT\\\*","gi"),outCount);

            tpl.replace(new RegExp("\\\*BASE_1B\\\*","gi"),(base_1B == 'true')?' bs_1sticon ':'');
            tpl.replace(new RegExp("\\\*BASE_2B\\\*","gi"),(base_2B == 'true')?' bs_2ndicon ':'');
            tpl.replace(new RegExp("\\\*BASE_3B\\\*","gi"),(base_3B == 'true')?' bs_3rdicon ':'');

            var part = hash["part"];//"Straight"
            if(part!=null){
                var halves = "";
                var innings = "";
                if(part == "Straight"){
                    halves = "bs_upicon_line";
                    innings = "1";
                } else{
                    if(part.match(/Bottom/i)) halves = 'bs_downicon_line';
                    else if(part.match(/Top/i)) halves = 'bs_upicon_line';
                    if(part.match(/[1-9][0-9]/)) innings = part.match(/[1-9][0-9]/)[0];
                    else if(part.match(/[1-9]/)) innings = part.match(/[1-9]/)[0];
                }
                var isTop = part.match(/Bottom/i);

                tpl.replace(new RegExp("\\\*OFF_DEF_H\\\*","gi"),isTop?' on':'');
                tpl.replace(new RegExp("\\\*OFF_DEF_C\\\*","gi"),isTop?' ':' on');

                tpl.replace(new RegExp("\\\*HALVES\\\*","gi"),halves);
                tpl.replace(new RegExp("\\\*INNINGS\\\*","gi"),innings);

            }

            if(toppar["tbet_showtype"]=="INPLAY"){
                tpl.replace(new RegExp("\\\*SCORE_COLOR_"+hash["lastScore"]+"\\\*","gi"),"word_darkOrange");
            }

            // tpl.replace(/\*OFF_DEF_H\*/g, (part.match(/Bottom/i))?"icon_bs_offense":"icon_bs_defense", tpl_i);
            // tpl.replace(/\*OFF_DEF_C\*/g, (part.match(/Top/i))?"icon_bs_offense":"icon_bs_defense", tpl_i);

            // tpl.replace(/\*SCORE_H_STYLE\*/g, (lastScore == 'H')?"red_word":"", tpl_i);
            // tpl.replace(/\*SCORE_C_STYLE\*/g, (lastScore == 'C')?"red_word":"", tpl_i);
            // tpl.replace(/\*SCORE_H\*/g, score_h*1, tpl_i);
            // tpl.replace(/\*SCORE_C\*/g, score_c*1, tpl_i);
            // tpl.replace(/\*RE_TIME\*/g, retime+" "+reminute+"'", tpl_i);


        }

        if(gtype=="TN" || gtype=="VB" || gtype=="BM" || gtype=="TT" || gtype=="SK"){
            result = hash["result_0_H"]*1;
            if(gtype=="BM" || gtype=="TT") result = hash["result_set_H"]*1;
            if(gtype=="SK") result = hash["score_h"]*1;
            //"sc_3th_H"
            //server_sw 是不是 home 發球
            //W_delay 暫停
            tpl.replace(new RegExp("\\\*BEST\\\*","gi"),_self.bestToLS(hash["best"],gtype));
            var th = ordinal_num[hash["se_now"]];
            tpl.replace(new RegExp("\\\*SC_TH_H\\\*","gi"),_self.scoreToString(hash["sc_"+th+"_H"],isOver));
            tpl.replace(new RegExp("\\\*SC_TH_A\\\*","gi"),_self.scoreToString(hash["sc_"+th+"_A"],isOver));

            var tmp=hash["sc_game_H"];
            if(tmp && tmp.toString().toUpperCase() == "ADV") tmp = "A";
            tpl.replace(new RegExp("\\\*SC_GAME_H\\\*","gi"),_self.scoreToString(tmp,isOver));
            var tmp=hash["sc_game_A"];
            if(tmp && tmp.toString().toUpperCase() == "ADV") tmp = "A";
            tpl.replace(new RegExp("\\\*SC_GAME_A\\\*","gi"),_self.scoreToString(tmp,isOver));

            var server_sw = hash["server_sw"]*1;
            if(gtype == "VB"||gtype == "BM"||gtype == "TT"){
                if(server_sw==1) server_sw=0;
                else if(server_sw==0) server_sw=1;
            }
            if(server_sw != 2){
                tpl.replace(new RegExp("\\\*SERVER_SW_H\\\*","gi"),(server_sw==1)?"on":"");
                tpl.replace(new RegExp("\\\*SERVER_SW_A\\\*","gi"),(server_sw==1)?"":"on");
            }
        }
        //已開賽 隱藏完賽時節比分
        var show_game_set = 0;
        var best = hash["best"];
        /*
        Best of 3
        Best of 5
        Best of 5 - 21 VB
        Best of 5 - 25 VB
        Best of 3
        Best of 5
        Best of 5 - 11 BM
        Best of 7
        */

        if(gtype=="TN" || gtype=="VB"){

            //show_game_set = hash["result_0_H"]*1 +hash["result_0_C"]*1;
            show_game_set = best.match(/\d/)[0]*1;
        }
        if(gtype=="BM" || gtype=="TT"){
            //show_game_set = hash["result_set_H"]*1 +hash["result_set_A"]*1;
            show_game_set = best.match(/\d/)[0]*1;
        }

        if(show_game_set!=0){
            //  *DISPLAY_3*
            for(var i=show_game_set;i<8;i++){
                tpl.replace(new RegExp("\\\*DISPLAY_"+i+"\\\*","gi"),"hide_game");
            }
        }


        if(gtype=="TN" ){
            tpl.replace(new RegExp("\\\*W_DELAY_DISPLAY\\\*","gi"),(hash["W_delay"]=="Y")?"":"none");

            tpl.replace(new RegExp("\\\*SC_SET_H\\\*","gi"),_self.scoreToString(hash["sc_set_H"],isOver));
            tpl.replace(new RegExp("\\\*SC_SET_A\\\*","gi"),_self.scoreToString(hash["sc_set_A"],isOver));
            show_game_num = hash["RESULT_0_H"]*1+hash["RESULT_0_C"]*1;
        }
        if(gtype=="VB"){
            show_game_num = hash["RESULT_0_H"]*1+hash["RESULT_0_C"]*1;
        }
        if(gtype=="BM"){
            show_game_num = hash["RESULT_SET_H"]*1+hash["RESULT_SET_C"]*1;
        }
        if(gtype=="TT"){
            show_game_num = hash["RESULT_SET_H"]*1+hash["RESULT_SET_C"]*1;
        }
        if(gtype=="SK"){
            if(toppar["tbet_showtype"]=="INPLAY"){
                tpl.replace(new RegExp("\\\*SCORE_COLOR_"+hash["lastScore"]+"\\\*","gi"),"word_darkOrange");
            }
        }

        if(gtype == "OP"){
            if(toppar["tbet_showtype"]=="INPLAY"){
                tpl.replace(new RegExp("\\\*SCORE_COLOR_"+hash["lastScore"]+"\\\*","gi"),"word_darkOrange");
            }
        }
        if(hash["result_type"] == "DN") result = -13;
        if(result<0){
            tpl.replace(new RegExp("\\\*CANCEL_DISPLAY\\\*","gi"),"");
            if(result == -14 && gtype=="SK") result = "_SK-14";
            var result_str = LS.get("CancelType"+result);
            if(result_str==null) result_str="CancelType"+result;
            tpl.replace(new RegExp("\\\*CANCEL_TYPE\\\*","gi"),result_str);
        }else{
            tpl.replace(new RegExp("\\\*CANCEL_DISPLAY\\\*","gi"),"none");
            tpl.replace(new RegExp("\\\*CANCEL_TYPE\\\*","gi"),"");
        }
        for(var k in hash){
            var value=hash[k];
            if(value==null)value = "";
            if(k.indexOf("result")!= -1 || k.indexOf("score")!= -1) value = _self.scoreToString(value,isOver);
            tpl.replace(new RegExp("\\\*"+k+"\\\*","gi"),value);
        }
        if(toppar["tbet_showtype"]=="INPLAY"){
            tpl.replace(new RegExp("\\\*SCORE_COLOR_H\\\*","gi"),"word_brown");
            tpl.replace(new RegExp("\\\*SCORE_COLOR_C\\\*","gi"),"word_brown");
            tpl.replace(new RegExp("\\\*SCORE_COLOR_A\\\*","gi"),"word_brown");
        }else{
            tpl.replace(new RegExp("\\\*SCORE_COLOR_H\\\*","gi"),"word_darkOrange");
            tpl.replace(new RegExp("\\\*SCORE_COLOR_C\\\*","gi"),"word_darkOrange");
            tpl.replace(new RegExp("\\\*SCORE_COLOR_A\\\*","gi"),"word_darkOrange");
        }
        return tpl;
    }

    _self.parseDataFS = function (hash) {
        // var sort_model = dom.getElementById("sort_model");
        // var div_model = dom.getElementById("league_model");
        var gid;
        var gidm;
        var objid = ",total_wagers,total_stake,total_payout,totalbet_show,sort_model,league_model,rtype_model,";
        objid += "total_wagers_ft,total_stake_ft,total_wagers_rb,total_stake_rb,"
        var tmpObj = util.getObjAry(dom, objid);
        _mc = util.mergeArray(_mc, tmpObj);

        var total_wagers=0,total_stake=0.0,total_payout=0;
        var total_wagers_ft=0,total_stake_ft=0;
        var total_wagers_rb=0,total_stake_rb=0;

        //var totalbet_show_innerHTML = _mc["sort_model"].innerHTML;
        var totalbet_show_innerHTML = "";

        //for(var i=0; i<hash["league"].length; i++){
        for(var lid in hash["league"]){
            var tpl = new fastTemplate_a1();
            var gameHash = hash["league"][lid]["game"];
            //console.log(gameHash);
            // continue;
            tpl.init(_mc["league_model"].cloneNode(true));
            for(var j=0; j<gameHash.length; j++){
                tpl.addBlock("game");

                var tpl_rtype = new fastTemplate_a1();
                tpl_rtype.init(_mc["rtype_model"].cloneNode(true));
                for(var k=0;k<gameHash[j].length;k++){

                    var game_name=gameHash[j][k]["name"];
                    if(game_name==null)game_name=""
                    tpl.replace(new RegExp("\\\*G_NAME\\\*","gi"),game_name);
                    tpl.replace(new RegExp("\\\*G_COUNT\\\*","gi"),_self.wagerFormat(gameHash[j][k]["count"]));
                    tpl.replace(new RegExp("\\\*G_GOLD\\\*","gi"),_self.goldFormat(gameHash[j][k]["gold"]));
                    tpl.replace(new RegExp("\\\*GID\\\*","gi"),_self.goldFormat(gameHash[j][k]["gid"]));
                    for(var l=0;l<gameHash[j][k]["rtype"].length;l++){
                        rtypeHash=gameHash[j][k]["rtype"][l];
                        tpl_rtype.addBlock("rtype");
                        tpl_rtype.replace(new RegExp("\\\*R_NAME\\\*","gi"),rtypeHash["player"]);
                        tpl_rtype.replace(new RegExp("\\\*R_COUNT\\\*","gi"),_self.wagerFormat(rtypeHash["wager_count"]));
                        tpl_rtype.replace(new RegExp("\\\*R_GOLD\\\*","gi"),_self.goldFormat(rtypeHash["wager_gold"]));
                        tpl_rtype.replace(new RegExp("\\\*RTYPE\\\*","gi"),rtypeHash["rtype"]);
                        tpl_rtype.replace(new RegExp("\\\*GID\\\*","gi"),gameHash[j][k]["gid"]);
                    }
                }
                var tpl_rtype_html = tpl_rtype.fastPrint();
                tpl.replace(new RegExp("\\\*SHOW_RTYPE\\\*","gi"),tpl_rtype_html);
            }

            var tpl_innerHtml = tpl.fastPrint();

            tpl_innerHtml = tpl_innerHtml.replace(/\*LEAGUE\*/g, hash["league"][lid]["league_name"]);
            tpl_innerHtml = tpl_innerHtml.replace(/\*LEAGUEID\*/g, hash["league"][lid]["lid"]);
            tpl_innerHtml = tpl_innerHtml.replace(/\*L_COUNT\*/g, _self.wagerFormat(hash["league"][lid]["all_count"]));
            tpl_innerHtml = tpl_innerHtml.replace(/\*L_GOLD\*/g, _self.goldFormat(hash["league"][lid]["all_gold"]));
            totalbet_show_innerHTML += tpl_innerHtml;

            total_wagers += hash["league"][lid]["all_count"]*1;
            total_stake += hash["league"][lid]["all_gold"]*1;
        }

        // if(toppar["tbet_showtype"] == "STARTED"){

        //     _mc["total_wagers_ft"].innerHTML = total_wagers_ft;
        //     _mc["total_stake_ft"].innerHTML = total_stake_ft;

        //     _mc["total_wagers_rb"].innerHTML = total_wagers_rb;
        //     _mc["total_stake_rb"].innerHTML = total_stake_rb;
        // }else{
            _mc["total_wagers"].innerHTML = _self.wagerFormat(total_wagers);
            _mc["total_stake"].innerHTML = _self.goldFormat(total_stake);
            // _mc["total_payout"].innerHTML = total_payout;
        // }

        _mc["totalbet_show"].innerHTML = totalbet_show_innerHTML;

        //新增進內層的點擊事件
        //for(var i=0; i<hash["league"].length; i++){
        arr_leagueid = new Array();
        for(var lid in hash["league"]){
            var gameHash = hash["league"][lid]["game"];
            leagueid = hash["league"][lid]["lid"];
            league_name = hash["league"][lid]["league_name"];

            var league_head = dom.getElementById("league_head_"+leagueid);
            arr_leagueid.push("league_head_" + leagueid);

            util.addEvent(league_head, "click", _self.leagueClose, { "league_id": leagueid });
            if(leagueCloseAry.indexOf(leagueid)!= -1)_self.divChildrenClose(league_head);
            for(var j=0; j<gameHash.length; j++){
                var detailHash = new Object();
                for(var k=0;k<gameHash[j].length;k++){
                    for(var l=0;l<gameHash[j][k]["rtype"].length;l++){
                        rtypeHash=gameHash[j][k]["rtype"][l];
                        var detailHash = new Object();
                        //detailHash["LEAGUE"] = gameHash[j]["league_name"];
                        detailHash["GTYPE"] = "FS";
                        detailHash["LEAGUE"] = league_name;
                        detailHash["TEAM_H"] = gameHash[j][k]["name"];
                        detailHash["TEAM_C"] = gameHash[j][k]["name"];
                        detailHash["GID"] = gameHash[j][k]["gid"];
                        detailHash["WTYPE"] = rtypeHash["rtype"];
                        detailHash["RTYPE"] = rtypeHash["rtype"];
                        detailHash["downline"] = toppar["downline"];
                        detailHash["stake"] = toppar["stake"];
                        util.addEvent(dom.getElementById("R_GOLD_" + detailHash["GID"]+"_"+detailHash["RTYPE"]), "click", _self.gotoBetDetailEvent, { "postHash": detailHash});
                    }
                }
            }
        }
        num_leagueid = arr_leagueid.length ;
        _self.setSortClick(true);
        _self.initScroll();
    }
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

    // ＝＝＝＝＝＝＝＝  內層 function ＝＝＝＝＝＝＝＝＝
    _self.gotoAllbetEvent = function(e,param){
        _self.gotoAllbet(param,false);
    }
    _self.gotoAllbet = function (param,isInit) {
        //切換時重置下拉霸事件 以免互相影響
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        util.classFunc(dom.getElementById("totalbet_show"), "tbet_title_fixed", "remove");
        target =dom.getElementById("allbetleague_now");
        if(target.classList.contains("active")){
            target.classList.remove("active");
        }
        //重置 scrollbar
        var totalbet_show = dom.getElementById("totalbet_show");
        if(totalbet_show!=null)totalbet_show.innerHTML = "";
        parentClass.dispatchEvent("showLoading", {"showLoading":true});
        //console.log(param);
        if(isInit){
            // toppar["allbetParam"] = param;
            var par = new Object();
            par["page"] = "totalbet_model_allbet";
            par["target"] = "totalbet_model";
            //par["useDefineParent"] = "N";
            par["retFun"] = _self.getAllbetModelComplete;
            par["retParam"] = param.allbetParam;
            par["tbet_showtype"] = _self.transShowtypeName(toppar["tbet_showtype"]);
            par["post"] = "tbet_showtype=" + par["tbet_showtype"] + "&tbet_gtype=" + toppar["tbet_gtype"];
            filter_set[toppar["tbet_showtype"]] = util.clone(toppar);
            parentClass.dispatchEvent("goToPage", par);
        }else{
            toppar["sub_page"] = "totalbet_model_allbet";
            toppar["allbetParam"] = param;
            var par = new Object();
            par["page"] = "totalbet_header";
            par["postHash"] = toppar;
            filter_set[toppar["tbet_showtype"]] = util.clone(toppar);
            parentClass.dispatchEvent("bodyGoToPage", par);
        }
    }
    _self.displayAllbetHeader = function(){
        _self.display(dom.getElementById("league_header"),"none");
        _self.display(dom.getElementById("startrd_header"),"none");
        _self.display(dom.getElementById("allbetleague_div"),"");
    }
    _self.getAllbetModelComplete = function (allbetParam) {
        allbetCloseWtype = null;
        _self.displayAllbetHeader();
        _self.getAllbetData(toppar);
        _self.getAllbetLeagueData(toppar);
    }

    _self.getAllbetData = function (allbetParam) {
        filter_set[toppar["tbet_showtype"]] = util.clone(toppar);
        var param = "";
        param += top.param;
        if(toppar["tbet_showtype"]=="STARTED"){
            param += "&p=get_started_allbet_wager";
        }else{
            param += "&p=get_allbet_wager";
        }

        param+="&session="+_self.transSessionName(_self.transShowtypeName(allbetParam["tbet_showtype"]));
        // if(allbetParam.tbet_showtype!=null){
        //     param+="&session="+_self.transSessionName(allbetParam.tbet_showtype);
        // }else{
        //     param+="&session="+_self.transSessionName(par["tbet_showtype"]);
        // }
        param+="&gtype="+allbetParam["tbet_gtype"];
        //param+="&filter=Y";
        //&symbol=more&gold=0&percentage=full&down_id=all&league_id=all //滾球,今日
        //&date=all&symbol=more&gold=0&percentage=full&down_id=all&league_id=all //早餐
        //&date=today&market=all&symbol=more&gold=0&percentage=full&down_id=all&league_id=all //已開賽
        if(allbetParam["tbet_showtype"]=="STARTED" || allbetParam["tbet_showtype"]=="EARLY"){
            param+="&date=all";
            // param+="&date="+allbetParam["date"];
        }else{
            param+="&date="+allbetParam["date"];
        }


        param+="&market="+allbetParam["market"];;
        param+="&symbol=more";
        param+="&gold="+allbetParam["stake"];;
        param+="&percentage="+allbetParam["view"];;
        param+="&down_id="+allbetParam["downline"];;
        param+="&league_id="+allbetParam["league"];;
        //param+="&gidm=878731";
        param+="&gidm="+allbetParam.allbetParam.gidm;
        //param+=_url; 還沒用

        hr = new HttpRequest();
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadAllbetComplete);
        hr.loadURL(top.url, "POST", param);
    }

    _self.LoadAllbetComplete = function (json) {
        var hash;
        _set["layer"] = "totalbet_model_allbet";
        dataHash = json;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }
        _self.filterHeader();
        if(hash["code"] == "no_data"){
            _self.display(dom.getElementById("totalbet_show"),"none");
            _self.display(dom.getElementById("totalbet_nodata"),"");
        }else{
            _self.display(dom.getElementById("totalbet_show"),"");
            _self.display(dom.getElementById("totalbet_nodata"),"none");

            if(toppar["tbet_showtype"] == "STARTED"){
                _self.parseAllbetData_started(hash);
            }else{
                _self.parseAllbetData(hash);
            }
        }
        _self.startTimer();
        parentClass.dispatchEvent("showLoading", {"showLoading":false});
    }
    _self.allbetHeader = function(hash,gtype){
        var isOver,isCancelled;
        var objid = ",gameInfo,allbet_league,allbet_team_h,allbet_team_c,allbet_total_wagers,allbet_total_stake,gameRunning,gameOver,";
        var tmpObj = util.getObjAry(dom, objid);
        _mc = util.mergeArray(_mc, tmpObj);

        objid = ",score_h,score_c,redcard_h,redcard_c,cancelled,";
        var tmpObj2 = util.getObjAry(_mc["gameInfo"], objid);
        _mc = util.mergeArray(_mc, tmpObj2);

        var gameInfo = _mc["gameInfo"];
        //hash["game_over"] = "N";
        if(hash["game_over"] =="Y"){
            isOver = true;
            if(tmpObj["gameOver"]) gameInfo = tmpObj["gameOver"];
        }else{
            isOver = false;
            if(tmpObj["gameRunning"]) gameInfo = tmpObj["gameRunning"];
        }

        if(hash["game_cancel"] == "Y"){
            isCancelled = true;
            if(tmpObj["gameRunning"]) gameInfo = tmpObj["gameRunning"];
        }else{
            isCancelled = false;
        }

        if(tmpObj["gameRunning"]) tmpObj["gameRunning"].style.display = (isOver)?"none":"";
        if(tmpObj["gameOver"]) tmpObj["gameOver"].style.display = (isOver)?"":"none";

        objid = ",live,gamedate,gametime,midfield,team_h,team_c,se_now,retime,";
        tmpObj = util.getObjAry(gameInfo, objid);
        _mc = util.mergeArray(_mc, tmpObj);

        //cancelled
        if(_mc["cancelled"]){
            _mc["cancelled"].style.display="none";
        }else{
            //console.log("_mc[cancelled]  is null");
        }

        //Live
        if(_mc["live"]){
            //if(hash["live"] == "Y" && toppar["tbet_showtype"] !="INPLAY" && toppar["tbet_showtype"] !="STARTED" ){
            if(hash["live"] == "Y" && toppar["tbet_showtype"] !="INPLAY" ){
                _mc["live"].style.display="";
            }else{
                _mc["live"].style.display="none";
            }
        }else{
            //console.log("_mc[live] is null");
        }
        // date
        if(_mc["gamedate"]){
            var date = hash["session"]["date"];
            if(date!=null){
                var date_ary = date.split("-");
                _mc["gamedate"].innerHTML = date_ary[2]+" / "+date_ary[1];
            }
            _mc["gamedate"].style.display="none"
            if(toppar["tbet_showtype"] == "EARLY" || toppar["tbet_showtype"] == "STARTED" ){
                _mc["gamedate"].style.display="";
            }
        }else{
            //console.log("_mc[gamedate] is null");
        }

        //midfield
        if(_mc["midfield"]){
            if(hash["midfield"] == "Y"){
                _mc["midfield"].style.display="";
            }else{
                _mc["midfield"].style.display="none";
            }
        }else{
            //console.log("_mc[midfield] is null");
        }
        var gametime = _self.getGameTime(hash["session"],gtype);

        if(_mc["gametime"]){
            if(toppar["tbet_showtype"] == "INPLAY"){

                //var gametime = _self.getGameTime(hash["session"],gtype);
                if(gtype == "BK"){
                    _mc["gametime"].innerHTML = gametime[1];
                }else{
                    _mc["gametime"].innerHTML = gametime[0]+gametime[1];
                }


            }else{
                _mc["gametime"].innerHTML = hash["session"]["time"].substr(0,5);
            }
        }else{
            //console.log("_mc[gametime] is null");
        }
        // tpl.replace(new RegExp("\\\*SE_NOW\\\*","gi"),retime[0]);
        // tpl.replace(new RegExp("\\\*RETIME\\\*","gi"),retime[1]);

        if(_mc["se_now"]){
            _mc["se_now"].innerHTML = gametime[0];
        }else{
            //console.log("_mc[se_now] is null");
        }
        if(_mc["retime"]){
            _mc["retime"].innerHTML = gametime[1];
        }else{
            //console.log("_mc[retime] is null");
        }

        if(_mc["score_h"] == null || _mc["score_c"] == null){
            //console.log("score_h , score_c  null");
        }else{
            if(toppar["tbet_showtype"] == "INPLAY" || (toppar["tbet_showtype"] == "STARTED" && isOver == true) ){
                var score_h,score_c;
                if(toppar["tbet_showtype"] == "STARTED" && (gtype=="FT" || gtype == "OP" || gtype=="BS" || gtype=="BK")){
                    score_h = hash["session"]["result_FT_H"];
                    score_c = hash["session"]["result_FT_C"];
                }else if(toppar["tbet_showtype"] == "STARTED" && gtype == "SK"){
                    score_h = hash["session"]["score_h"];
                    score_c = hash["session"]["score_c"];
                }else if(toppar["tbet_showtype"] == "STARTED"){
                    score_h = hash["session"]["result_0_H"];
                    score_c = hash["session"]["result_0_C"];
                }else if(gtype=="FT"){
                    score_h = hash["score_h"];
                    score_c = hash["score_c"];
                }else{
                    score_h = hash["session"]["score_h"];
                    score_c = hash["session"]["score_c"];
                }
                if(score_h*1 >=0 && score_c*1 >=0){
                    _mc["score_h"].innerHTML = score_h;
                    _mc["score_c"].innerHTML = score_c;
                }

                if(toppar["tbet_showtype"] == "INPLAY"){
                    var lastScore = hash["session"]["lastScore"];
                    if(lastScore==null){
                        lastScore = hash["session"]["sc_new"];
                        if(lastScore == "A") lastScore = "C";
                    }
                    if(lastScore!=null){
                        _self.removeClassStr(_mc["score_h"],"on");
                        _self.removeClassStr(_mc["score_c"],"on");
                        _self.setClassStr(_mc["score_"+lastScore.toLowerCase()],"on");
                    }
                }
            }else{
                // _mc["score_h"].style.display = "none";
                // _mc["score_c"].style.display = "none";
                //hide_item
                _self.setClassStr(_mc["score_h"],"hide_item");
                _self.setClassStr(_mc["score_c"],"hide_item");
            }
        }

        //_mc["midfield"].innerHTML = hash["midfield"];
        if(_mc["redcard_h"] == null || _mc["redcard_c"] == null ){
            //console.log(" redcard_h , redcard_c null");
        }else{
            //console.log(top.totalbet_model_allbet);
            if(top.totalbet_model_allbet.indexOf("_re_allbet")!= -1){
                var red_h = hash["session"]["redcard_h"]*1;
                var red_c = hash["session"]["redcard_c"]*1;
                if(red_h!=0){
                    _mc["redcard_h"].style.display = "";
                }else{
                    _mc["redcard_h"].style.display = "none";
                }
                if(red_c!=0){
                    _mc["redcard_c"].style.display = "";
                }else{
                    _mc["redcard_c"].style.display = "none";
                }
                _mc["redcard_h"].innerHTML = hash["session"]["redcard_h"];
                _mc["redcard_c"].innerHTML = hash["session"]["redcard_c"];
            }
        }

        if( _mc["team_h"] == null || _mc["team_c"] == null  ){
            //console.log(" team_h , team_c null");
        }else{
            _mc["team_h"].innerHTML = hash["team_h"];
            _mc["team_c"].innerHTML = hash["team_c"];
        }

        if( _mc["allbet_team_h"] == null || _mc["allbet_team_c"] == null  ){
            //console.log(" allbet_team_h , allbet_team_c null");
        }else{
            _mc["allbet_team_h"].innerHTML = hash["team_h"];
            _mc["allbet_team_c"].innerHTML = hash["team_c"];
        }
        if(_mc["allbet_league"] == null || _mc["allbet_total_wagers"] == null || _mc["allbet_total_stake"] == null){
            //console.log(" allbet_league , allbet_total_wagers allbet_total_stake null");
        }else{
            _mc["allbet_league"].innerHTML = hash["league_name"];
            _mc["allbet_total_wagers"].innerHTML = _self.wagerFormat(hash["league_count"]);
            _mc["allbet_total_stake"].innerHTML = _self.goldFormat(hash["league_gold"]);
        }

        if(toppar["tbet_showtype"] == "INPLAY"){
            _self.allbetMoreScore(hash["session"],gtype);
        }
        if(toppar["tbet_showtype"] == "STARTED"){
            _self.allbetMoreScore_started(hash["session"],gtype,isOver,isCancelled);
        }

        if(isCancelled){
            _self.showCancelHeader(hash["cancel_type"]);
        }
    }
    _self.showCancelHeader = function(cancel_type){
        //console.log("showCancelHeader",_mc);
        if(_mc["gameOver"])_mc["gameOver"].style.display="none";
        if(_mc["live"])_mc["live"].style.display="none";
        if(_mc["gamedate"])_mc["gamedate"].style.display="none";
        if(_mc["gametime"])_mc["gametime"].style.display="none";
        if(_mc["midfield"])_mc["midfield"].style.display="none";

        if(_mc["redcard_h"])_mc["redcard_h"].style.display="none";
        if(_mc["redcard_c"])_mc["redcard_c"].style.display="none";

        if(_mc["score_h"])_mc["score_h"].style.display="none";
        if(_mc["score_c"])_mc["score_c"].style.display="none";


        if(_mc["cancelled"]){
            _mc["cancelled"].style.display="";
            _mc["cancelled"].innerHTML = LS.get("CancelType"+cancel_type);
        }
        if(_mc["gameRunning"])_mc["gameRunning"].style.display="";
    }
    _self.getGameTime = function(session,gtype){
        //console.log(session);
        var ret_str = new Array();
        if(gtype=="FT"){
            var retime = session["retime"];
            var reminute = session["reminute"];
            var sec = session["sec"];
            if(retime=="1H" && reminute=="00" && sec =="0"){
                ret_str[0]="";
                if(_set["layer"] == "totalbet_model_allbet") ret_str[1]="0";
                else ret_str[1]="";
            }else if(retime=="1H" &&  reminute == "00:00"){
                ret_str[0]="";
                if(_set["layer"] == "totalbet_model_allbet") ret_str[1]="0";
                else ret_str[1]="";
            }else{
                if(reminute == null)reminute="";
                if(retime == "HT"){
                    retime = LS.get("HT");
                    reminute="";
                }
                if(retime == "1H") retime = LS.get("1H");
                if(retime == "2H") retime = LS.get("2H");
                ret_str[0] = retime;
                if( reminute!="" ){
                    ret_str[1] = " "+reminute+"";
                    if(_set["layer"] == "totalbet_model"){
                        ret_str[1] = ret_str[1]+"'";
                    }
                }else{
                    ret_str[1] = "";
                }
            }
        }
        if(gtype == "BK"){
            // half_time 半場
            //se_now 時節(Q1,Q2)
            //t_status("START"/"PAUSE")
            //t_count 暫停取這個
            //t_end start取這個
            //t_type 時間長度(分鐘 10/12)
            // se_type Halves
            // se_now  HT H2
            //語系
            var allbet_str = "";
            if( _set["layer"] == "totalbet_model_allbet" ){
                allbet_str = "_allbet";
            }
            if(session["half_time"]=="Y"){
                ret_str[0] = LS.get(gtype+"_half_time"+allbet_str);
                ret_str[1] = "";
            }else{
                tmp_sec="0";
                if(session["t_status"]=="START") tmp_sec = session["t_end"];
                else tmp_sec = session["t_count"];
                //ret_str[0] = session["se_now"];
                if(tmp_sec*1 <0)tmp_sec=0;
                ret_str[0] = LS.get("BK_"+session["se_now"]+allbet_str);
                ret_str[1] = " "+_self.secondsToTimeType(tmp_sec);
            }
        }
        //console.log(ret_str);
        return ret_str;
    }
    _self.secondsToTimeType = function(sec){
        //h,i,s
        // type = type||"H:I:S";
        // var dd = new Date(sec*1000);
        // dd.getMinutes();
        // dd.getSeconds();
        var ret_str = "";
        var ct = new CountdownTimer(0,0);
        ret_str = ct.showMinute(sec);
        return ret_str;
    }
    _self.allbetMoreScore = function(session,gtype){
        var ordinal_num = Array("","1st","2nd","3th","4th","5th","6th","7th","8th","9th");
        var more_map = new Array();
        more_map["BK"] = new Array("sc_H1_A","sc_H1_H","sc_H2_A","sc_H2_H","sc_OT_A","sc_OT_H","sc_Q1_A","sc_Q1_H","sc_Q2_A","sc_Q2_H","sc_Q3_A","sc_Q3_H","sc_Q4_A","sc_Q4_H");
        //more_map["BK"] = new Array("sc_QT","sc_Q1","sc_Q2","sc_Q3","sc_Q4");
        more_map["TN"] = new Array("sc_set_H","sc_set_A","sc_game_H","sc_game_A","sc_1st_H","sc_1st_A","sc_2nd_H","sc_2nd_A","sc_3th_H","sc_3th_A","sc_4th_H","sc_4th_A","sc_5th_H","sc_5th_A");
        more_map["VB"] = new Array("sc_game_H","sc_game_A","sc_1st_H","sc_1st_A","sc_2nd_H","sc_2nd_A","sc_3th_H","sc_3th_A","sc_4th_H","sc_4th_A","sc_5th_H","sc_5th_A");
        more_map["BM"] = new Array("sc_game_H","sc_game_A","sc_1st_H","sc_1st_A","sc_2nd_H","sc_2nd_A","sc_3th_H","sc_3th_A","sc_4th_H","sc_4th_A","sc_5th_H","sc_5th_A");
        more_map["TT"] = new Array("sc_game_H","sc_game_A","sc_1st_H","sc_1st_A","sc_2nd_H","sc_2nd_A","sc_3th_H","sc_3th_A","sc_4th_H","sc_4th_A","sc_5th_H","sc_5th_A","sc_6th_H","sc_6th_A","sc_7th_H","sc_7th_A");
        // more_map["SK"] = new Array("");
        //more_map["BS"] = new Array("score_h","score_c","sc_1st_H","sc_1st_A","sc_2nd_H","sc_2nd_A","sc_3th_H","sc_3th_A","sc_4th_H","sc_4th_A","sc_5th_H","sc_5th_A","sc_6th_H","sc_6th_A","sc_7th_H","sc_7th_A","sc_8th_H","sc_8th_A","sc_9th_H","sc_9th_A");

        var ary = more_map[gtype];
        if(ary!=null){
            objid = ","+ary.toString()+",";
            tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            _mc = util.mergeArray(_mc, tmpObj);
            //console.log(_mc);
            // 分數
            for(var i=0;i<ary.length;i++){
                var keys=ary[i];
                if(_mc[keys]){
                    var innerHTML = session[keys];
                    if(gtype=="TN"){
                        if(innerHTML.toString().toUpperCase() == "ADV") innerHTML = "A";
                    }
                    _mc[keys].innerHTML = innerHTML;
                    // _mc[keys].innerHTML = session[keys];
                }
            }
        }
        //隱藏未到時節
        if(gtype=="BK"){
            var session_map = new Array("Q1","Q2","Q3","Q4","OT");
            var session_map2 = new Array("H1","H2","OT");
            var show;
            var no_show;

            if(session["se_type"] == "Halves") {
                show = session_map2;
                no_show = session_map;
            }else{
                show = session_map;
                no_show = session_map2;
            }

            for(var i=0;i<no_show.length;i++){
                var se_i=no_show[i];
                var show_obj = dom.getElementById("sc_"+se_i);
                if(show_obj)show_obj.style.display="none";
            }

            var show_flag=true;
            var se_now = session["se_now"];
            if(se_now=="HT") se_now = "H1";
            if(se_now=="H2") se_now = "H2";
            for(var i=0;i<show.length;i++){
                var se_i=show[i];
                var show_obj = dom.getElementById("sc_"+se_i);
                var style_obj = dom.getElementById("sc_"+se_i+"_style");
                if(style_obj)style_obj.className = "word_white02_a8";
                if(show_obj)show_obj.style.display=(show_flag)?"":"none";
                if(se_i == se_now){
                    show_flag = false;
                    if(style_obj && session["half_time"]!="Y")style_obj.className = "word_lightOrange";
                }
            }
            // for(var i=0;i<session_map.length;i++){
            //     var se_i=session_map[i];
            //     var show_obj = dom.getElementById("sc_"+se_i);
            //     var style_obj = dom.getElementById("sc_"+se_i+"_style");
            //     if(style_obj)style_obj.className = "word_white02_a8";
            //     if(show_obj)show_obj.style.display=(show_flag)?"":"none";
            //     if(se_i == se_now){
            //         show_flag = false;
            //         if(style_obj)style_obj.className = "word_lightOrange";
            //     }
            // }
            //se_type  Halves
            //se_now = H2 H1


        }
        if(gtype=="TN"||gtype=="BM"||gtype=="VB"||gtype=="TT"){
            objid = ",se_now_name,w_delay,gameall_H,gameall_A,sc_th_A,sc_th_H,server_sw_H,server_sw_A,";
            tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            _mc = util.mergeArray(_mc, tmpObj);

            if(_mc["se_now_name"])_mc["se_now_name"].innerHTML = session["se_now_name"];
            if(_mc["w_delay"])_mc["w_delay"].style.display = (session["W_delay"]=="Y")?"":"none";


            var th = ordinal_num[session["se_now"]];
            if(_mc["sc_th_A"])_mc["sc_th_A"].innerHTML = session["sc_"+th+"_A"];
            if(_mc["sc_th_H"])_mc["sc_th_H"].innerHTML = session["sc_"+th+"_H"];
            var gameall_H = session["sc_1st_H"]*1+session["sc_2nd_H"]*1+session["sc_3th_H"]*1+session["sc_4th_H"]*1+session["sc_5th_H"]*1;
            var gameall_A = session["sc_1st_A"]*1+session["sc_2nd_A"]*1+session["sc_3th_A"]*1+session["sc_4th_A"]*1+session["sc_5th_A"]*1;
            if(_mc["gameall_A"])_mc["gameall_A"].innerHTML = gameall_A;
            if(_mc["gameall_H"])_mc["gameall_H"].innerHTML = gameall_H;


            //當下發球 sc_new
            var server_sw = session["server_sw"]*1;

            if(server_sw!=2){
                if(gtype=="VB"||gtype=="BM"||gtype == "TT")server_sw = (server_sw==1)?"0":"1";
                if(server_sw=="1")lastScore = "H";
                else lastScore = "A";
                _self.removeClassStr(_mc["server_sw_H"],"on");
                _self.removeClassStr(_mc["server_sw_A"],"on");
                _self.setClassStr(_mc["server_sw_"+lastScore.toUpperCase()],"on");
            }

            //w_delay,se_now,se_now_name,server_sw
            //se_now_name,w_delay,gameall_H,gameall_A,sc_th_A,sc_th_H

            //隱藏未到時節
            var show_flag=true;
            for(var i=0;i<ordinal_num.length;i++){
                var se_i=ordinal_num[i];
                var show_obj = dom.getElementById("sc_"+se_i);
                //var style_obj = dom.getElementById("sc_"+se_i+"_style");
                //if(style_obj)style_obj.className = "word_white02_a8";
                //if(show_obj)show_obj.style.display=(show_flag)?"":"none";
                if(i == session["se_now"]){
                    show_flag = false;
                    //if(style_obj)style_obj.className = "word_lightOrange";
                }
                //if(gtype=="TN") {
                    if(show_obj)show_obj.style.display=(show_flag)?"":"none";
                //}
            }
        }

        if(gtype=="BS"){
            //out_count  OFF_DEF_H  = server_sw_H
            //HALVES 上下半 class innings
            //
            objid = ",out_count,innings,server_sw_H,server_sw_A,base,";
            tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            _mc = util.mergeArray(_mc, tmpObj);

            var retime = session["retime"];
            var reminute = session["reminute"];
            var outCount = session["outCount"];//出局數
            var base_1B = session["base_1B"]; //base_x 
            var base_2B = session["base_2B"];
            var base_3B = session["base_3B"];
            var lastScore =  session["lastScore"];


            _mc["out_count"].innerHTML = outCount;
            // tpl.replace(new RegExp("\\\*OUT_COUNT\\\*","gi"),outCount);

            _self.removeClassStr(_mc["base"],"bs_1sticon");
            _self.removeClassStr(_mc["base"],"bs_2ndicon");
            _self.removeClassStr(_mc["base"],"bs_3rdicon");
            if(base_1B=="true")_self.setClassStr(_mc["base"],"bs_1sticon");
            if(base_2B=="true")_self.setClassStr(_mc["base"],"bs_2ndicon");
            if(base_3B=="true")_self.setClassStr(_mc["base"],"bs_3rdicon");
            // tpl.replace(new RegExp("\\\*BASE_1B\\\*","gi"),(base_1B == 'true')?' bs_1sticon ':'');
            // tpl.replace(new RegExp("\\\*BASE_2B\\\*","gi"),(base_2B == 'true')?' bs_2ndicon ':'');
            // tpl.replace(new RegExp("\\\*BASE_3B\\\*","gi"),(base_3B == 'true')?' bs_3rdicon ':'');

            var part = session["part"];
            if(part!=null){
                var halves = "";
                var innings = "";
                if(part == "Straight"){
                    halves = "bs_upicon_graph";
                    innings = "1";
                }else{
                    if(part.match(/Bottom/i)) halves = 'bs_downicon_graph';
                    else if(part.match(/Top/i)) halves = 'bs_upicon_graph';
                    if(part.match(/[1-9][0-9]/)) innings = part.match(/[1-9][0-9]/)[0];
                    else if(part.match(/[1-9]/)) innings = part.match(/[1-9]/)[0];
                }

                _mc["innings"].innerHTML = innings;
                _self.removeClassStr(_mc["innings"],"bs_downicon_graph");
                _self.removeClassStr(_mc["innings"],"bs_upicon_graph");
                if(halves!="")_self.setClassStr(_mc["innings"],halves);

                // tpl.replace(new RegExp("\\\*server_sw_H\\\*","gi"),(part.match(/Bottom/i))?' on':'');
                // tpl.replace(new RegExp("\\\*server_sw_C\\\*","gi"),(part.match(/Top/i))?' on':'');
                _self.removeClassStr(_mc["server_sw_H"],"on");
                _self.removeClassStr(_mc["server_sw_A"],"on");
                var server_sw = part.match(/Bottom/i)?"H":"A";
                _self.setClassStr(_mc["server_sw_"+server_sw],"on");

                // tpl.replace(new RegExp("\\\*HALVES\\\*","gi"),halves);
                // tpl.replace(new RegExp("\\\*INNINGS\\\*","gi"),innings);

            }
        }
        if(gtype=="SK"){
            objid = ",best,";
            tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            _mc = util.mergeArray(_mc, tmpObj);
            //_mc["best"].innerHTML = _self.bestToLS(session["best"],gtype);
            _mc["best"].innerHTML = session["best"];
            //_mc["best"].innerHTML = LS.get(gtype+"_"+session["best"].replace(" ","_"));
        }
        if(gtype=="OP"){
            if(_mc["live"]){
                if(session["score_h"]*1 >0  || session["score_c"]*1 >0 ){
                    _self.display(_mc["live"],"none");
                }else{
                    _self.display(_mc["live"],"");
                }
            }
            objid = ",time_div,";
            tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            _mc = util.mergeArray(_mc, tmpObj);
            if(_mc["time_div"]){
                var elem_ary = _mc["time_div"].children;
                var showflag = false;
                for(var i=0;i<elem_ary.length;i++){
                    if(elem_ary[i].style.display==""){
                        showflag = true;
                        break;
                    }
                }
                _mc["time_div"].style.display=(showflag)?"":"none";
            }
            // if(_mc["midfield"]!= null && _mc["midfield"].style.display=="none" && _mc["live"]!=null && _mc["live"].style.display=="none"){
            //     if(_mc["time_div"]){
            //         _mc["time_div"].style.display="none";
            //     }
            // }

        }
    }
    _self.allbetMoreScore_started = function(session,gtype,isOver,isCancelled){
        var ordinal_num = Array("","1st","2nd","3th","4th","5th","6th","7th","8th","9th");
        //var ordinal_num = Array("0","1","2","3","4","5","6","7","8","9");
        var more_map = new Array();
        more_map["BK"] = new Array("result_1H_C","result_1H_H","result_2H_H","result_2H_C","result_OT_H","result_OT_C","result_Q1_C","result_Q1_H","result_Q2_C","result_Q2_H","result_Q3_C","result_Q3_H","result_Q4_C","result_Q4_H");
        //more_map["BK"] = new Array("result_QT","result_Q1","result_Q2","result_Q3","result_Q4");//

        more_map["TN"] = new Array("result_0_H","result_0_C","result_1_H","result_1_C","result_2_H","result_2_C","result_3_H","result_3_C","result_4_H","result_4_C","result_5_H","result_5_C","result_6_H","result_6_C");
        more_map["VB"] = new Array("result_0_H","result_0_C","result_1_H","result_1_C","result_2_H","result_2_C","result_3_H","result_3_C","result_4_H","result_4_C","result_5_H","result_5_C","result_6_H","result_6_C","result_7_H","result_7_C");

        more_map["BM"] = new Array("result_set_H","result_set_A","result_point_H","result_point_A","result_1st_H","result_1st_A","result_2nd_H","result_2nd_A","result_3th_H","result_3th_A","result_4th_H","result_4th_A","result_5th_H","result_5th_A");
        more_map["TT"] = new Array("result_set_H","result_set_A","result_point_H","result_point_A","result_1st_H","result_1st_A","result_2nd_H","result_2nd_A","result_3th_H","result_3th_A","result_4th_H","result_4th_A","result_5th_H","result_5th_A","result_6th_H","result_6th_A","result_7th_H","result_7th_A");

        more_map["SK"] = new Array();

        more_map["BS"] = new Array("result_FT_H","result_FT_C");
        // more_map["VB"] = new Array("result_game_H","result_game_C","result_1st_H","result_1st_C","result_2nd_H","result_2nd_C","result_3th_H","result_3th_C","result_4th_H","result_4th_C","result_5th_H","result_5th_C");
        // more_map["BM"] = new Array("result_game_H","result_game_C","result_1st_H","result_1st_C","result_2nd_H","result_2nd_C","result_3th_H","result_3th_C","result_4th_H","result_4th_C","result_5th_H","result_5th_C");
        // more_map["TT"] = new Array("result_game_H","result_game_C","result_1st_H","result_1st_C","result_2nd_H","result_2nd_C","result_3th_H","result_3th_C","result_4th_H","result_4th_C","result_5th_H","result_5th_C","result_6th_H","result_6th_C","result_7th_H","result_7th_C");
        // more_map["SK"] = new Array("");
        //more_map["BS"] = new Array("score_h","score_c","result_1st_H","result_1st_C","result_2nd_H","result_2nd_C","result_3th_H","result_3th_C","result_4th_H","result_4th_C","result_5th_H","result_5th_C","result_6th_H","sc_6th_C","sc_7th_H","sc_7th_C","sc_8th_H","sc_8th_C","sc_9th_H","sc_9th_C");
        // var isCancelled = false;
        var ary = more_map[gtype];
        if(ary!=null){
            objid = ","+ary.toString()+",";
            tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            _mc = util.mergeArray(_mc, tmpObj);
            //console.log(_mc);
            // 分數
            for(var i=0;i<ary.length;i++){
                var keys=ary[i];
                if(_mc[keys]){
                    if(isOver){
                        _mc[keys].innerHTML = session[keys];
                    }else{
                        _mc[keys].style.display="none";
                    }

                }
            }
        }
        //隱藏未到時節
        if(gtype=="BK"){
            //if(session["result_FT_H"]*1<0) isCancelled = true;
            //var session_map = new Array("Q1","Q2","Q3","Q4","1H","2H","OT");
            var session_map = new Array("Q1","Q2","Q3","Q4","OT");
            var show_flag=true;
            //var se_now = session["se_now"];
            if(isOver == false) show_flag = false;
            if(isCancelled == true ) show_flag = false;
            //console.log("isCancelled",isCancelled);

            for(var i=0;i<session_map.length;i++){
                var se_i=session_map[i];
                var show_obj = dom.getElementById("result_"+se_i);
                var style_obj = dom.getElementById("result_"+se_i+"_style");
                //if(style_obj)style_obj.className = "word_white02_a8";
                if(show_obj)show_obj.style.display=(show_flag)?"":"none";
                // if(se_i == se_now){
                //     show_flag = false;
                //     if(style_obj)style_obj.className = "word_lightOrange";
                // }
            }
            if(session["result_OT_H"]*1 == 0 && session["result_OT_C"]*1 == 0){
                _mc["result_OT_H"].innerHTML = "";
                _mc["result_OT_C"].innerHTML = "";
                //show_flag = false;
            }
            //if(show_obj)show_obj.style.display=(show_flag)?"":"none";
        }
        if(gtype=="TN"||gtype=="VB"){
            objid = ",result_th_C,result_th_H,";
            tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            _mc = util.mergeArray(_mc, tmpObj);

            // if(_mc["se_now_name"])_mc["se_now_name"].innerHTML = session["se_now_name"];
            // if(_mc["w_delay"])_mc["w_delay"].style.display = (session["w_delay"]=="Y")?"":"none";


            //var th = ordinal_num[session["se_now"]];
            // var best = session["best"];
            // if(best.match(/f [1-9][0-9]/)) th = best.match(/f [1-9][0-9]/)[0];
            // else if(best.match(/f [1-9]/)) th = best.match(/f [1-9]/)[0];
            //th=th.replace("f ","");
            var th = session["result_0_H"]*1 + session["result_0_C"]*1;
            if(gtype=="VB") th = 2;
            if(_mc["result_th_C"])_mc["result_th_C"].innerHTML = session["result_"+th+"_C"];
            if(_mc["result_th_H"])_mc["result_th_H"].innerHTML = session["result_"+th+"_H"];


            // var gameall_H = session["result_1_H"]*1+session["result_2_H"]*1+session["result_3_H"]*1+session["result_4_H"]*1+session["result_5_H"]*1;
            // var gameall_C = session["result_1_C"]*1+session["result_2_C"]*1+session["result_3_C"]*1+session["result_4_C"]*1+session["result_5_C"]*1;
            // if(_mc["gameall_C"])_mc["gameall_C"].innerHTML = gameall_C;
            // if(_mc["gameall_H"])_mc["gameall_H"].innerHTML = gameall_H;


            //當下發球 sc_new
            // var server_sw = session["server_sw"]*1;
            // if(gtype=="VB"||gtype=="BM"||gtype == "TT")server_sw = (server_sw==1)?"0":"1";
            // if(server_sw=="1")lastScore = "H";
            // else lastScore = "C";
            // _self.removeClassStr(_mc["server_sw_H"],"on");
            // _self.removeClassStr(_mc["server_sw_C"],"on");
            // _self.setClassStr(_mc["server_sw_"+lastScore.toUpperCase()],"on");

            //w_delay,se_now,se_now_name,server_sw
            //se_now_name,w_delay,gameall_H,gameall_C,sc_th_C,sc_th_H

            th = session["result_0_H"]*1 + session["result_0_C"]*1;
            if(gtype=="VB") th += 2;
            //隱藏未到時節
            var show_flag=true;
            //if(session["result_0_H"]*1<0) isCancelled = true;
            if(isOver == false) show_flag = false;
            if(isCancelled == true ) show_flag = false;
            for(var i=0;i<ordinal_num.length;i++){
                var se_i;
                se_i=i;
                var show_obj = dom.getElementById("result_"+se_i);

                //var style_obj = dom.getElementById("sc_"+se_i+"_style");
                //if(style_obj)style_obj.className = "word_white02_a8";
                if(show_obj)show_obj.style.display=(show_flag)?"":"none";
                if(i == th){
                    show_flag = false;
                    //if(style_obj)style_obj.className = "word_lightOrange";
                }
            }
        }
        if(gtype=="BM"||gtype=="TT"){
            objid = ",result_th_H,result_th_A,";
            tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            _mc = util.mergeArray(_mc, tmpObj);

            // if(_mc["se_now_name"])_mc["se_now_name"].innerHTML = session["se_now_name"];
            // if(_mc["w_delay"])_mc["w_delay"].style.display = (session["w_delay"]=="Y")?"":"none";


            //var th = ordinal_num[session["se_now"]];
            // var best = session["best"];
            // if(best.match(/f [1-9][0-9]/)) th = best.match(/f [1-9][0-9]/)[0];
            // else if(best.match(/f [1-9]/)) th = best.match(/f [1-9]/)[0];
            //th=th.replace("f ","");
            // console.log("th="+th);
            // if(_mc["result_th_A"])_mc["result_th_A"].innerHTML = session["result_"+ordinal_num[th]+"_A"];
            // if(_mc["result_th_H"])_mc["result_th_H"].innerHTML = session["result_"+ordinal_num[th]+"_H"];
            if(_mc["result_th_A"])_mc["result_th_A"].innerHTML = session["result_point_A"];
            if(_mc["result_th_H"])_mc["result_th_H"].innerHTML = session["result_point_H"];


            // var gameall_H = session["result_1_H"]*1+session["result_2_H"]*1+session["result_3_H"]*1+session["result_4_H"]*1+session["result_5_H"]*1;
            // var gameall_C = session["result_1_C"]*1+session["result_2_C"]*1+session["result_3_C"]*1+session["result_4_C"]*1+session["result_5_C"]*1;
            // if(_mc["gameall_C"])_mc["gameall_C"].innerHTML = gameall_C;
            // if(_mc["gameall_H"])_mc["gameall_H"].innerHTML = gameall_H;


            //當下發球 sc_new
            // var server_sw = session["server_sw"]*1;
            // if(gtype=="VB"||gtype=="BM"||gtype == "TT")server_sw = (server_sw==1)?"0":"1";
            // if(server_sw=="1")lastScore = "H";
            // else lastScore = "C";
            // _self.removeClassStr(_mc["server_sw_H"],"on");
            // _self.removeClassStr(_mc["server_sw_C"],"on");
            // _self.setClassStr(_mc["server_sw_"+lastScore.toUpperCase()],"on");

            //w_delay,se_now,se_now_name,server_sw
            //se_now_name,w_delay,gameall_H,gameall_C,sc_th_C,sc_th_H

            var th = session["result_set_H"]*1 + session["result_set_A"]*1
            //隱藏未到時節
            var show_flag=true;
            //if(session["result_0_H"]*1<0) isCancelled = true;
            if(isOver == false) show_flag = false;
            if(isCancelled == true ) show_flag = false;
            for(var i=0;i<ordinal_num.length;i++){
                var se_i=ordinal_num[i];

                var show_obj = dom.getElementById("result_"+se_i);

                //var style_obj = dom.getElementById("sc_"+se_i+"_style");
                //if(style_obj)style_obj.className = "word_white02_a8";
                if(show_obj)show_obj.style.display=(show_flag)?"":"none";
                if(i == th){
                    show_flag = false;
                    //if(style_obj)style_obj.className = "word_lightOrange";
                }
            }
        }
        if(gtype=="BS"){
            //out_count  OFF_DEF_H  = server_sw_H
            //HALVES 上下半 class innings
            //
            // objid = ",out_count,innings,server_sw_H,server_sw_C,base,";
            // tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            // _mc = util.mergeArray(_mc, tmpObj);

            // var retime = session["retime"];
            // var reminute = session["reminute"];
            // var outCount = session["outCount"];//出局數
            // var base_1B = session["base_1B"]; //base_x 
            // var base_2B = session["base_2B"];
            // var base_3B = session["base_3B"];
            // var lastScore =  session["lastScore"];


            // _mc["out_count"].innerHTML = outCount;

            // _self.removeClassStr(_mc["base"],"bs_1sticon");
            // _self.removeClassStr(_mc["base"],"bs_2ndicon");
            // _self.removeClassStr(_mc["base"],"bs_3rdicon");
            // if(base_1B=="true")_self.setClassStr(_mc["base"],"bs_1sticon");
            // if(base_2B=="true")_self.setClassStr(_mc["base"],"bs_2ndicon");
            // if(base_3B=="true")_self.setClassStr(_mc["base"],"bs_3rdicon");


            // var part = session["part"];
            // if(part!=null){
            //     if(part.match(/Bottom/i)) halves = 'bs_downicon_line';
            //     else if(part.match(/Top/i)) halves = 'bs_upicon_line';
            //     if(part.match(/[1-9][0-9]/)) innings = part.match(/[1-9][0-9]/)[0];
            //     else if(part.match(/[1-9]/)) innings = part.match(/[1-9]/)[0];

            //     _mc["innings"].innerHTML = innings;
            //     _self.removeClassStr(_mc["innings"],"bs_downicon_line");
            //     _self.removeClassStr(_mc["innings"],"bs_upicon_line");
            //     _self.setClassStr(_mc["innings"],halves);

            //     _self.removeClassStr(_mc["server_sw_H"],"on");
            //     _self.removeClassStr(_mc["server_sw_C"],"on");
            //     var server_sw = part.match(/Top/i)?"A":"H";
            //     _self.setClassStr(_mc["server_sw_"+server_sw],"on");
            // }
        }
        if(gtype=="SK"){
            objid = ",best,";
            tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            _mc = util.mergeArray(_mc, tmpObj);
            if(_mc["best"])_mc["best"].innerHTML = session["best"];
            //_mc["best"].innerHTML = LS.get(gtype+"_"+session["best"].replace(" ","_"));
        }
        if(gtype=="OP"){
            objid = ",time_div,";
            tmpObj = util.getObjAry(_mc["gameInfo"], objid);
            _mc = util.mergeArray(_mc, tmpObj);
            if(_mc["midfield"]!= null && _mc["midfield"].style.display=="none"){
                if(_mc["time_div"])_mc["time_div"].style.display="none";
            }
        }
    }
    _self.parseAllbetData = function (hash) {
        //head
        var totalbet_show =  dom.getElementById("totalbet_show");
        var totalbet_model =  dom.getElementById("totalbet_model");

        var model_innerHTML=totalbet_model.innerHTML;
        if(model_innerHTML!=""){
            _model_innerHTML = model_innerHTML;
            totalbet_model.innerHTML = "";
        }
        totalbet_show.style.display="none";
        totalbet_show.innerHTML = _model_innerHTML;

        _self.allbetHeader(hash,toppar["tbet_gtype"]);
        if(toppar["tbet_gtype"] == "TN" && toppar["tbet_showtype"]=="INPLAY") _self.createRFmodel();

        for(var i=0; i<hash["wtype"].length; i++){

            var wtype = hash["wtype"][i]["wtype"];

            if((wtype == "PD"||wtype == "RPD") && hash["is_OT"] == "true") {
                wtype += "_EXTRA";
            }
            var model_wtype = dom.getElementById("model_"+wtype);
            var show_wtype = dom.getElementById("show_"+wtype);

            if(model_wtype==null){
                //console.log(wtype);
                if(bugWtypeRtype[wtype] ==null) alert("此玩法找不到 model_"+wtype);
                bugWtypeRtype[wtype] = true;
                continue;
            }
            if(show_wtype == null){
                if(bugWtypeRtype[wtype] ==null) alert("此玩法找不到 show_"+wtype);
                bugWtypeRtype[wtype] = true;
                continue;
            }
            var innerHTML = model_wtype.innerHTML;
            show_wtype.style.display = ""; //開啟玩法模組
            innerHTML = innerHTML.replace(/\*TEAM_H\*/g, hash["team_h"]);
            innerHTML = innerHTML.replace(/\*TEAM_C\*/g, hash["team_c"]);
            innerHTML = innerHTML.replace(/\*WTYPE_COUNT\*/g, _self.wagerFormat(hash["wtype"][i]["wtype_count"]));
            innerHTML = innerHTML.replace(/\*WTYPE_GOLD\*/g, _self.goldFormat(hash["wtype"][i]["wtype_gold"]));
            show_wtype.innerHTML = innerHTML;

            if(wtype == "SFS"){
                //onerows
                //continue;
                var onerows = hash["wtype"][i]["onerows"];
                tmp = util.getObjAry(show_wtype,",onerows_h,onerows_c,");
                var onerows_h = tmp["onerows_h"];
                var onerows_c = tmp["onerows_c"];
                var onerows__html = {};
                onerows__html["h"] = onerows_h.innerHTML ;
                onerows__html["c"] = onerows_c.innerHTML ;
                onerows_h.innerHTML = "";
                onerows_c.innerHTML = "";

                var total_html = {};
                total_html["h"] = "";
                total_html["c"] = "";
                var tmp_html = {};
                tmp_html["h"];
                tmp_html["c"];

                for(j=0; j<onerows.length; j++){
                    onerowsObj = onerows[j];
                    var ary = new Array("h","c");
                    for(var k=0;k<ary.length;k++){
                        var hc = ary[k];
                        tmp_html[hc] = onerows__html[hc];
                        tmp_html[hc] = tmp_html[hc].replace(new RegExp("\\\*PLAY_"+hc+"\\\*","gi"), onerowsObj["player_"+hc]);
                        var count=0;
                        for(var l=0;l<onerowsObj[hc].length;l++){
                            gidObj = onerowsObj[hc][l];

                            var tmp_var = gidObj["count"];
                            if(tmp_var !=""){
                                tmp_var = _self.wagerFormat(tmp_var);
                            }
                            tmp_html[hc] = tmp_html[hc].replace(new RegExp("\\\*"+gidObj["rtype"]+"_COUNT\\\*","gi"), tmp_var);

                            var tmp_var = gidObj["gold"];
                            if(tmp_var !=""){
                                tmp_var = _self.wagerFormat(tmp_var);
                            }
                            tmp_html[hc] = tmp_html[hc].replace(new RegExp("\\\*"+gidObj["rtype"]+"_GOLD\\\*","gi"), tmp_var);
                            tmp_html[hc] = tmp_html[hc].replace(new RegExp("\\\*GID_"+gidObj["rtype"]+"\\\*","gi"), gidObj["gid"]+"_"+gidObj["pos"]);
                            // gold_rtype_gid_pos;
                            // gold_H_19_7581_FS02
                            count+= gidObj["count"]*1;
                        }
                        var hide_class = "hide_sfs";
                        if(count>0){
                            hide_class="";
                        }
                        tmp_html[hc] = tmp_html[hc].replace(new RegExp("\\\*hide_SFS\\\*","gi"), hide_class);
                        total_html[hc] += tmp_html[hc];
                    }
                }
                onerows_h.innerHTML = total_html["h"];
                onerows_c.innerHTML = total_html["c"];
            }else{
                var gidHash = hash["wtype"][i]["gid"];
                var concede_w3=hash["concede_w3"];

                //var body_wtype = dom.getElementById("body_"+wtype);
                tmp = util.getObjAry(show_wtype,",body_"+wtype+",");
                var body_wtype = tmp["body_"+wtype];
                var body_wtype_html = body_wtype.innerHTML ;
                var total_html = "";
                var tmp_html = "";
                body_wtype.innerHTML = "";
                for(var j=0; j<gidHash.length; j++){
                    var rtypeHash = gidHash[j]["rtype"];
                    var ptype = gidHash[j]["ptype"];
                    var gid = gidHash[j]["gid"];
                    tmp_html = body_wtype_html;

                    if(ptype == null)ptype="";
                    tmp_html = tmp_html.replace(new RegExp("\\\*PTYPE\\\*","gi"), ptype);
                    tmp_html = tmp_html.replace(new RegExp("\\\*GID\\\*","gi"), gid);

                    if(toppar["tbet_gtype"] == "TN" && wtype.indexOf("RF") != -1){
                        //tmp_html = _self.wtype_rf_server_sw(tmp_html,wtype,hash["session"]);
                    }

                    //for(var k=0; k<rtypeHash.length; k++){
                    for(var k in rtypeHash){
                        var rtype = rtypeHash[k]["rtype"];
                        tmp_html = tmp_html.replace(new RegExp("\\\*"+rtype+"_COUNT\\\*","gi"), _self.wagerFormat(rtypeHash[k]["count"]));
                        tmp_html = tmp_html.replace(new RegExp("\\\*"+rtype+"_GOLD\\\*","gi"), _self.goldFormat(rtypeHash[k]["gold"]));

                        if(wtype == "W3"){
                            /*
                            var concede_h = concede_w3*1;
                            var concede_c = concede_w3*-1;
                            var symbol_h = " - ";
                            var symbol_c = " - ";

                            if(concede_h < 0){
                                symbol_h = " + ";
                                concede_h = concede_h*-1;
                            }

                            if(concede_c < 0){
                                symbol_c = " + ";
                                concede_c = concede_c*-1;
                            }

                            tmp_html = tmp_html.replace(new RegExp("\\\*CONCEDE_H\\\*","gi"), symbol_h+concede_h);
                            tmp_html = tmp_html.replace(new RegExp("\\\*CONCEDE_C\\\*","gi"), symbol_c+concede_c);
                            */
                            tmp_html = tmp_html.replace(new RegExp("\\\*CONCEDE_H\\\*", "gi"), "");
                            tmp_html = tmp_html.replace(new RegExp("\\\*CONCEDE_C\\\*", "gi"), "");
                        }
                    }
                    //console.log(tmp_html);
                    // if((wtype == "PD"||wtype == "RPD") && hash["is_OT"] == "true") {
                    //     tmp_html = tmp_html.replace(new RegExp("\\\*hide_ex\\\*","gi"),"");
                    // } else{
                    //     tmp_html = tmp_html.replace(new RegExp("\\\*hide_ex\\\*","gi"),"hide_item");
                    // }
                    total_html += tmp_html;
                }


                body_wtype.innerHTML = total_html;
            }
        }
        //replaceNoData -> 把沒趴到的tag自動趴成0
        all_html = totalbet_show.innerHTML;
        if(toppar["tbet_gtype"] == "SK"){
            var map_ary = new Array("sc_1st_A","sc_1st_H","sc_2nd_A","sc_2nd_H","sc_3th_A","sc_3th_H","sc_4th_A","sc_4th_H","sc_5th_A","sc_5th_H","sc_6th_A","sc_6th_H");
            for(var i=0;i<map_ary.length;i++){
                var key_str=map_ary[i];
                all_html = all_html.replace(new RegExp("\\\*"+key_str+"\\\*","gi"), hash["session"][key_str]);
            }
        }
        totalbet_show.innerHTML = _self.replaceNoData(all_html);

        for(var i=0; i<hash["wtype"].length; i++){
            var wtype = hash["wtype"][i]["wtype"];
            var show_wtype = dom.getElementById("show_"+wtype);
            tmp = util.getObjAry(show_wtype,",body_"+wtype+",");
            var body_wtype = tmp["body_"+wtype];
            if(wtype=="SFS"){
                var onerows = hash["wtype"][i]["onerows"];
                for(j=0; j<onerows.length; j++){
                    onerowsObj = onerows[j];
                    var ary = new Array("h","c");
                    for(var k=0;k<ary.length;k++){
                        var hc = ary[k];
                        for(var l=0;l<onerowsObj[hc].length;l++){
                            gidObj = onerowsObj[hc][l];
                            if(gidObj["count"]*1 ==0) continue;
                            // gold_rtype_gid_pos;
                            // gold_H_19_7581_FS02
                            var detailHash = new Object();
                            detailHash["LEAGUE"] = hash["league_name"];
                            detailHash["GTYPE"] = "FS";
                            detailHash["TEAM_H"] = null;//hash["team_h"];
                            detailHash["TEAM_C"] = null;//hash["team_c"];
                            detailHash["WTYPE"] = "FS";
                            detailHash["GID"] = gidObj["gid"];
                            detailHash["RTYPE"] = gidObj["pos"];
                            detailHash["downline"] = toppar["downline"];
                            detailHash["stake"] = toppar["stake"];

                            var key = "gold_"+gidObj["rtype"]+"_"+gidObj["gid"]+"_"+gidObj["pos"];
                            var ids=","+key+",";

                            domObj = util.getObjAry(body_wtype, ids);
                            if(domObj[key]==null){
                                // if(bugWtypeRtype[rtype] ==null) alert("此rtype找不到 gold_"+rtype+"_"+gid);
                                bugWtypeRtype[rtype] = true;
                            }
                            util.addEvent(domObj[key], "click", _self.gotoBetDetailEvent, { "postHash": detailHash});
                        }
                    }
                }
            }else{
                var gidHash = hash["wtype"][i]["gid"];


                for (var j = 0; j < gidHash.length; j++) {
                    var rtypeHash = gidHash[j]["rtype"];
                    var gid=gidHash[j]["gid"];
                    //for(var k=0; k<rtypeHash.length; k++){
                    for(var k in rtypeHash){
                        var rtype = rtypeHash[k]["rtype"];
                        var detailHash = new Object();
                        detailHash["LEAGUE"] = hash["league_name"];
                        detailHash["GTYPE"] = hash["gtype"];
                        detailHash["TEAM_H"] = hash["team_h"];
                        detailHash["TEAM_C"] = hash["team_c"];
                        if (typeof (rtypeHash[k]["old_wtype"]) != "undefined" && rtypeHash[k]["old_wtype"] !== null) {
                            detailHash["WTYPE"] = rtypeHash[k]["old_wtype"];
                        }else{
                            detailHash["WTYPE"] = hash["wtype"][i]["wtype"];
                        }
                        detailHash["GID"] = gid;
                        detailHash["RTYPE"] = rtype;
                        detailHash["downline"] = toppar["downline"];
                        detailHash["stake"] = toppar["stake"];

                        var ids=",gold_"+rtype+"_"+gid+",";
                        if(rtype == "OVH" || rtype == "ROVH"){
                            ids+="gold_"+rtype+"_small_"+gid+",";
                        }

                        domObj = util.getObjAry(body_wtype, ids);
                        if(domObj["gold_" + rtype+"_"+gid]==null){
                            // if(bugWtypeRtype[rtype] ==null) alert("此rtype找不到 gold_"+rtype+"_"+gid);
                            bugWtypeRtype[rtype] = true;
                        }
                        util.addEvent(domObj["gold_"+rtype+"_"+gid], "click", _self.gotoBetDetailEvent, { "postHash": detailHash});
                        if(rtype == "OVH" || rtype == "ROVH"){
                            util.addEvent(domObj["gold_"+rtype+"_small_"+gid], "click", _self.gotoBetDetailEvent, { "postHash": detailHash});
                        }
                        // domObj = util.getObjAry(body_wtype, ",gold_"+rtype+",");
                        // if(domObj["gold_" + rtype]==null){
                        //     console.log("此rtype找不到 gold_"+rtype);
                        //     //if(bugWtypeRtype[rtype] ==null) alert("此rtype找不到 gold_"+rtype+"_"+gid);
                        //     bugWtypeRtype[rtype] = true;
                        // }
                        // util.addEvent(domObj["gold_"+rtype], "click", _self.gotoBetDetailEvent, { "postHash": detailHash});
                    }
                }
            }
            tmp = util.getObjAry(show_wtype,",head_"+wtype+",");
            util.addEvent(tmp["head_"+wtype], "click", _self.wtypeClose, { "wtype": wtype });
            if(allbetCloseWtype!=null && allbetCloseWtype.indexOf(wtype)!= -1)_self.divChildrenClose(show_wtype);
        }
        _self.chk_allbetCloseWtype();
        totalbet_show.style.display="";
    }
    _self.parseAllbetData_started = function (hash) {
        var totalbet_show =  dom.getElementById("totalbet_show");
        var totalbet_model =  dom.getElementById("totalbet_model");

        var model_innerHTML=totalbet_model.innerHTML;
        if(model_innerHTML!=""){
            _model_innerHTML = model_innerHTML;
            totalbet_model.innerHTML = "";
        }
        totalbet_show.style.display="none";
        totalbet_show.innerHTML = _model_innerHTML;

        _self.allbetHeader(hash,toppar["tbet_gtype"]);
        if(toppar["tbet_gtype"] == "TN" && toppar["tbet_showtype"]=="STARTED") _self.createRFmodel();

        for(var i=0; i<hash["wtype"].length; i++){
            var wtype = hash["wtype"][i]["wtype"];

            if((wtype == "PD"||wtype == "RPD") && hash["is_OT"] == "true") {
                wtype += "_EXTRA";
            }

            var model_wtype = dom.getElementById("model_"+wtype);
            var show_wtype = dom.getElementById("show_"+wtype);

            if(model_wtype==null){
                if(bugWtypeRtype[wtype] ==null) alert("此玩法找不到 model_"+wtype);
                bugWtypeRtype[wtype] = true;
                continue;
            }
            var innerHTML = model_wtype.innerHTML;
            if(show_wtype==null){
                if(bugWtypeRtype[wtype] ==null) alert("此玩法找不到 show_"+wtype);
                bugWtypeRtype[wtype] = true;
                continue;
            }

            show_wtype.style.display = ""; //開啟玩法模組
            innerHTML = innerHTML.replace(/\*TEAM_H\*/g, hash["team_h"]);
            innerHTML = innerHTML.replace(/\*TEAM_C\*/g, hash["team_c"]);
            innerHTML = innerHTML.replace(/\*WTYPE_COUNT\*/g, _self.wagerFormat(hash["wtype"][i]["wtype_count"]));
            innerHTML = innerHTML.replace(/\*WTYPE_GOLD\*/g, _self.goldFormat(hash["wtype"][i]["wtype_gold"]));
            show_wtype.innerHTML = innerHTML;

            if(wtype == "SFS"){
                var onerows = hash["wtype"][i]["onerows"];
                tmp = util.getObjAry(show_wtype,",onerows_h,onerows_c,");
                var onerows_h = tmp["onerows_h"];
                var onerows_c = tmp["onerows_c"];
                var onerows__html = {};
                onerows__html["h"] = onerows_h.innerHTML ;
                onerows__html["c"] = onerows_c.innerHTML ;
                onerows_h.innerHTML = "";
                onerows_c.innerHTML = "";

                var total_html = {};
                total_html["h"] = "";
                total_html["c"] = "";
                var tmp_html = {};
                tmp_html["h"];
                tmp_html["c"];

                for(j=0; j<onerows.length; j++){
                    onerowsObj = onerows[j];
                    var ary = new Array("h","c");
                    for(var k=0;k<ary.length;k++){
                        var hc = ary[k];
                        tmp_html[hc] = onerows__html[hc];
                        tmp_html[hc] = tmp_html[hc].replace(new RegExp("\\\*PLAY_"+hc+"\\\*","gi"), onerowsObj["player_"+hc]);
                        var count=0;
                        for(var l=0;l<onerowsObj[hc].length;l++){
                            gidObj = onerowsObj[hc][l];
                            var tmp_var = gidObj["count"];
                            if(tmp_var !=""){
                                tmp_var = _self.wagerFormat(tmp_var);
                            }
                            tmp_html[hc] = tmp_html[hc].replace(new RegExp("\\\*"+gidObj["rtype"]+"_COUNT\\\*","gi"), tmp_var);

                            var tmp_var = gidObj["gold"];
                            if(tmp_var !=""){
                                tmp_var = _self.wagerFormat(tmp_var);
                            }
                            tmp_html[hc] = tmp_html[hc].replace(new RegExp("\\\*"+gidObj["rtype"]+"_GOLD\\\*","gi"), tmp_var);
                            tmp_html[hc] = tmp_html[hc].replace(new RegExp("\\\*GID_"+gidObj["rtype"]+"\\\*","gi"), gidObj["gid"]+"_"+gidObj["pos"]);
                            // gold_rtype_gid_pos;
                            // gold_H_19_7581_FS02
                            count+= gidObj["count"]*1;
                        }
                        var hide_class = "hide_sfs";
                        if(count>0){
                            hide_class="";
                        }
                        tmp_html[hc] = tmp_html[hc].replace(new RegExp("\\\*hide_SFS\\\*","gi"), hide_class);
                        total_html[hc] += tmp_html[hc];
                    }
                }
                onerows_h.innerHTML = total_html["h"];
                onerows_c.innerHTML = total_html["c"];
            }else{


                //var body_wtype = dom.getElementById("body_"+wtype);
                var id_str = ",body_"+wtype+",inhead_PL_"+wtype+",inbody_PL_"+wtype+",inhead_RB_"+wtype+",inbody_RB_"+wtype+",";
                tmp = util.getObjAry(show_wtype,id_str);
                if(tmp["inhead_PL_"+wtype])tmp["inhead_PL_"+wtype].style.display="none";
                if(tmp["inhead_RB_"+wtype])tmp["inhead_RB_"+wtype].style.display="none";
                if(tmp["inbody_PL_"+wtype])tmp["inbody_PL_"+wtype].style.display="none";
                if(tmp["inbody_RB_"+wtype])tmp["inbody_RB_"+wtype].style.display="none";

                var wtype_rb = hash["wtype"][i]["wtype_rb"];
                var concede_w3=hash["concede_w3"];
                //console.log(wtype_rb.length);
                for(var m=0;m<wtype_rb.length;m++){
                    var wtype_rb_str = wtype_rb[m]["wtype_rb"];
                    gidHash = wtype_rb[m]["gid"];
                    //console.log("inbody_"+wtype_rb_str+"_"+wtype);
                    if(tmp["inhead_"+wtype_rb_str+"_"+wtype])tmp["inhead_"+wtype_rb_str+"_"+wtype].style.display="";
                    if(tmp["inbody_"+wtype_rb_str+"_"+wtype])tmp["inbody_"+wtype_rb_str+"_"+wtype].style.display="";

                    // inbody_PL_R_0
                    // inbody_RB_R_0
                    var body_wtype = tmp["inbody_"+wtype_rb_str+"_"+wtype];
                    if(body_wtype ==null){
                        if(bugWtypeRtype[wtype_rb_str+wtype] ==null) alert("此玩法找不到 inbody_"+wtype_rb_str+"_"+wtype);
                        bugWtypeRtype[wtype_rb_str+wtype] = true;
                        continue;
                    }
                    var body_wtype_html = body_wtype.innerHTML ;
                    var total_html = "";
                    var tmp_html = "";
                    body_wtype.innerHTML = "";

                    for(var j=0; j<gidHash.length; j++){
                        var rtypeHash = gidHash[j]["rtype"];
                        var ptype = gidHash[j]["ptype"];
                        var gid = gidHash[j]["gid"];
                        tmp_html = body_wtype_html;
                        if(ptype == null)ptype="";
                        tmp_html = tmp_html.replace(new RegExp("\\\*PTYPE\\\*","gi"), ptype);
                        tmp_html = tmp_html.replace(new RegExp("\\\*GID\\\*","gi"), gid);
                        //for(var k=0; k<rtypeHash.length; k++){
                        for(var k in rtypeHash){
                            var rtype = rtypeHash[k]["rtype"];
                                tmp_html = tmp_html.replace(new RegExp("\\\*"+rtype+"_COUNT\\\*","gi"), _self.wagerFormat(rtypeHash[k]["count"]));
                                tmp_html = tmp_html.replace(new RegExp("\\\*"+rtype+"_GOLD\\\*","gi"), _self.goldFormat(rtypeHash[k]["gold"]));

                                if(wtype == "W3"){
                                    /*
                                    var concede_h = concede_w3*1;
                                    var concede_c = concede_w3*-1;
                                    var symbol_h = " - ";
                                    var symbol_c = " - ";

                                    if(concede_h < 0){
                                        symbol_h = " + ";
                                        concede_h = concede_h*-1;
                                    }

                                    if(concede_c < 0){
                                        symbol_c = " + ";
                                        concede_c = concede_c*-1;
                                    }

                                    tmp_html = tmp_html.replace(new RegExp("\\\*CONCEDE_H\\\*","gi"), symbol_h+concede_h);
                                    tmp_html = tmp_html.replace(new RegExp("\\\*CONCEDE_C\\\*","gi"), symbol_c+concede_c);
                                    */
                                    tmp_html = tmp_html.replace(new RegExp("\\\*CONCEDE_H\\\*", "gi"), "");
                                    tmp_html = tmp_html.replace(new RegExp("\\\*CONCEDE_C\\\*", "gi"), "");
                                }
                        }
                        // if((wtype == "PD"||wtype == "RPD") && hash["is_OT"] == "true") {
                        //     tmp_html = tmp_html.replace(new RegExp("\\\*hide_ex\\\*","gi"),"");
                        // } else{
                        //     tmp_html = tmp_html.replace(new RegExp("\\\*hide_ex\\\*","gi"),"hide_item");
                        // }
                        total_html += tmp_html;
                    }
                    body_wtype.innerHTML = total_html;
                }
            }
        }
        //replaceNoData -> 把沒趴到的tag自動趴成0
        totalbet_show.innerHTML = _self.replaceNoData(totalbet_show.innerHTML);
        // dom.getElementById("totalbet_show").innerHTML = dom.getElementById("totalbet_model").innerHTML;
        for(var i=0; i<hash["wtype"].length; i++){
            var wtype_rb = hash["wtype"][i]["wtype_rb"];
            var wtype = hash["wtype"][i]["wtype"];
            //var body_wtype = dom.getElementById("body_" + wtype);
            var show_wtype = dom.getElementById("show_"+wtype);
            tmp = util.getObjAry(show_wtype,",body_"+wtype+",");
            var body_wtype = tmp["body_"+wtype];

            if(wtype == "SFS"){
                var onerows = hash["wtype"][i]["onerows"];
                for(j=0; j<onerows.length; j++){
                    onerowsObj = onerows[j];
                    var ary = new Array("h","c");
                    for(var k=0;k<ary.length;k++){
                        var hc = ary[k];
                        for(var l=0;l<onerowsObj[hc].length;l++){
                            gidObj = onerowsObj[hc][l];
                            if(gidObj["count"]*1 ==0) continue;
                            // gold_rtype_gid_pos;
                            // gold_H_19_7581_FS02
                            var detailHash = new Object();
                            detailHash["LEAGUE"] = hash["league_name"];
                            detailHash["GTYPE"] = "FS";
                            detailHash["TEAM_H"] = null;//hash["team_h"];
                            detailHash["TEAM_C"] = null;//hash["team_c"];
                            detailHash["WTYPE"] = "FS";
                            detailHash["GID"] = gidObj["gid"];
                            detailHash["RTYPE"] = gidObj["pos"];
                            detailHash["downline"] = toppar["downline"];
                            detailHash["stake"] = toppar["stake"];

                            var key = "gold_"+gidObj["rtype"]+"_"+gidObj["gid"]+"_"+gidObj["pos"];
                            var ids=","+key+",";

                            domObj = util.getObjAry(body_wtype, ids);
                            if(domObj[key]==null){
                                // if(bugWtypeRtype[rtype] ==null) alert("此rtype找不到 gold_"+rtype+"_"+gid);
                                bugWtypeRtype[rtype] = true;
                            }
                            util.addEvent(domObj[key], "click", _self.gotoBetDetailEvent, { "postHash": detailHash});
                        }
                    }
                }
            }else{
                for(var m=0;m<wtype_rb.length;m++){
                    gidHash = wtype_rb[m]["gid"];
                    var real_wtype = wtype_rb[m]["real_wtype"];
                    for (var j = 0; j < gidHash.length; j++) {
                        var rtypeHash = gidHash[j]["rtype"];
                        var gid = gidHash[j]["gid"];
                        //for(var k=0; k<rtypeHash.length; k++){
                        for(var k in rtypeHash){
                            var rtype = rtypeHash[k]["rtype"];
                            var detailHash = new Object();
                            detailHash["LEAGUE"] = hash["league_name"];
                            detailHash["GTYPE"] = hash["gtype"];
                            detailHash["TEAM_H"] = hash["team_h"];
                            detailHash["TEAM_C"] = hash["team_c"];
                            detailHash["WTYPE"] = real_wtype;
                            detailHash["GID"] = gid;
                            detailHash["RTYPE"] = rtype;
                            detailHash["downline"] = toppar["downline"];
                            detailHash["stake"] = toppar["stake"];
                            detailHash["game_over"] = hash["game_over"];

                            var ids=",gold_"+rtype+"_"+gid+",";
                            if(rtype == "OVH" || rtype == "ROVH"){
                                ids+="gold_"+rtype+"_small_"+gid+",";
                            }


                            domObj = util.getObjAry(body_wtype, ids);
                            if(domObj["gold_" + rtype+"_"+gid]==null){
                                // if(bugWtypeRtype[rtype] ==null) alert("此rtype找不到 gold_"+rtype+"_"+gid);
                                bugWtypeRtype[rtype] = true;
                            }
                            util.addEvent(domObj["gold_"+rtype+"_"+gid], "click", _self.gotoBetDetailEvent, { "postHash": detailHash});
                            if(rtype == "OVH" || rtype == "ROVH"){
                                util.addEvent(domObj["gold_"+rtype+"_small_"+gid], "click", _self.gotoBetDetailEvent, { "postHash": detailHash});
                            }
                        }
                    }
                }
            }


            tmp = util.getObjAry(show_wtype,",head_"+wtype+",");
            util.addEvent(tmp["head_"+wtype], "click", _self.wtypeClose, { "wtype": wtype });
            if(allbetCloseWtype !=null && allbetCloseWtype.indexOf(wtype)!= -1)_self.divChildrenClose(show_wtype);
        }
        _self.chk_allbetCloseWtype();
        totalbet_show.style.display="";
    }
    _self.chk_allbetCloseWtype = function(){
        if(allbetCloseWtype==null){
            allbetCloseWtype = new Array();
            var dom_ary = document.getElementsByTagName("div");
            var cnt = 0;
            for(var i=0;i<dom_ary.length;i++){
                var obj=dom_ary[i];
                var ids = obj.id;
                if(ids==null)ids="";
                if(ids.indexOf("show_") != -1){
                    if(obj.style.display==""){
                        //console.log(ids.replace("show_",""));
                        var wtype = ids.replace("show_","");
                        if(cnt>=config_set.get("ALLBETS_LEAGUE_ACTIVE")){
                        // if(cnt>=2){
                            allbetCloseWtype.push(wtype);
                            _self.divChildrenClose(obj);
                        }
                        cnt ++;
                    }else{
                        _self.divChildrenClose(obj);
                    }
                }
            }
            /*
            for(var k in hash["league"]){
                if(cnt>=config_set.get("ALLBETS_LEAGUE_ACTIVE")){
                // if(cnt>=2){
                    leagueCloseAry.push(hash["league"][k]["lid"]+"");
                }
                cnt ++;
            }
            */
        }
    }
    _self.wtype_rf_server_sw = function(tmp_html,wtype,session){
        var ordinal_num = Array("","1st","2nd","3th","4th","5th","6th","7th");
        var game_num = wtype.match(/\d\d/)[0];
        var se_now = session["se_now"];
        var server_sw = session["server_sw"];
        //first last
        var th = ordinal_num[se_now];
        var sc_h = session["sc_"+th+"_H"];
        var sc_a = session["sc_"+th+"_A"];
        //server_sw 0:A  1:H


        tmp_html = tmp_html.replace(new RegExp("\\\*SERVER_SW_H\\\*","gi"), "");
        tmp_html = tmp_html.replace(new RegExp("\\\*SERVER_SW_A\\\*","gi"), "");

        return tmp_html;
    }
    _self.replaceNoData=function(div){
        var pos = -2;
        var posAry = new Array();
        var tmp = div;

        while (pos !== -1) {
              pos = div.indexOf("*", pos + 1);
              if(pos!=-1){
                      posAry.push(pos);
                    //   _self.debugPrint(pos);
              }
        }

        for(var i=posAry.length-1; i>0; i-=2){
                if(i==0) break;
                var e = posAry[i];
                var s = posAry[i-1];
                var ret = div.substring(s,e+1);
                if(e*1 - s*1  > 20){
                    // console.log(ret);
                }
                //_self.debugPrint(ret);
                if(ret.toUpperCase().indexOf("DISPLAY")!=-1){
                    tmp = tmp.replace(ret, "style='display:none;'");
                }else if(ret.toUpperCase().indexOf("_GOLD")!=-1){
                    tmp = tmp.replace(ret, "0.0");
                }else{
                    tmp = tmp.replace(ret, "0");
                }
                //tmp = tmp.replace(ret, "0");
        }
        //_self.debugPrint(tmp);
        return tmp;
    }

    _self.getAllbetLeagueData = function (par) {
        filter_set[toppar["tbet_showtype"]] = util.clone(par);
        var param = "";
        param += top.param;
        param += "&p=get_league_wager";
        //takeParam
        //param+="&session="+_self.transSessionName(par["tbet_showtype"]);
        toppar["tbet_showtype"] = par["tbet_showtype"];
        param+="&session="+ _self.transSessionName(_self.transShowtypeName(par["tbet_showtype"]));
        param+="&gtype="+toppar["tbet_gtype"];



        //param+="&date="+par["date"];
        param+="&date=all";
        param+="&market="+par["market"];
        param+="&gold="+par["stake"];
        param+="&percentage="+par["view"];
        param+="&down_id="+par["downline"];
        param+="&league_id="+par["league"];

        param+="&filter=Y";// 未知用途
        param+="&symbol=more";// 未知用途

        hr = new HttpRequest();
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadAllbetLeagueComplete);
        hr.loadURL(top.url, "POST", param);
    }
    _self.LoadAllbetLeagueComplete = function(json){
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }
        if(hash["code"] == "no_data" || hash["code"] == "game_close" || hash["code"] == "gidm_not_find"){

        }else{
            _self.parseAllbetLeague(hash);
            //_self.searchItem();
            _self.clearSearch();
        }
        // parentClass.dispatchEvent("showLoading", {"showLoading":false});
    }
    _self.parseAllbetLeague = function(hash){
        // var a=true;
        // if(a)return ;

        var objid = ",allbetleague_leagueli,allbetleague_search,allbetleague_show,";
        var tmpObj = util.getObjAry(dom, objid);
        _mc = util.mergeArray(_mc, tmpObj);
        var show_innerHTML="";
        var gtype = toppar["tbet_gtype"];
        for(var i=0; i<hash["league"].length; i++){
            var tpl = new fastTemplate_a1();
            var gameHash = hash["league"][i]["game"];
            tpl.init(_mc["allbetleague_leagueli"].cloneNode(true));
            for(var j=0; j<gameHash.length; j++){
                var session = gameHash[j]["session"];
                tpl.addBlock("TEAMLI");

                tpl.replace(new RegExp("\\\*TEAM_H\\\*","gi"),gameHash[j]["team_h"]);
                tpl.replace(new RegExp("\\\*TEAM_C\\\*","gi"),gameHash[j]["team_c"]);

                tpl.replace(new RegExp("\\\*GID\\\*","gi"),gameHash[j]["m_gid"]);


                //語系
                var result_over = gameHash[j]["game_over"];
                if(toppar["tbet_showtype"] == "INPLAY"){
                    result_over = "Y"
                }
                var score_h=0,score_c=0;

                if(result_over =="N"){
                    score_h=0;
                    score_c=0;
                }else if(toppar["tbet_showtype"] == "INPLAY"){
                    score_h = session["score_h"];
                    score_c = session["score_c"];
                    if(gtype == "TN"){
                        score_h = session["sc_set_H"];
                        score_c = session["sc_set_A"];
                    }
                    if(gtype == "VB"||gtype == "BM"||gtype == "TT"){
                        score_h = session["sc_game_H"];
                        score_c = session["sc_game_A"];
                    }
                }else {
                    score_h = session["result_FT_H"];
                    score_c = session["result_FT_C"];
                    if(gtype=="TN" || gtype=="VB"){
                        score_h = session["result_0_H"];
                        score_c = session["result_0_C"];
                    }
                    if(gtype=="BM" || gtype=="TT"){
                        score_h = session["result_set_H"];
                        score_c = session["result_set_A"];
                    }
                    if(gtype=="SK"){
                        score_h = session["score_h"];
                        score_c = session["score_c"];
                    }
                }
                tpl.replace(new RegExp("\\\*SCORE_H\\\*","gi"),score_h);
                tpl.replace(new RegExp("\\\*SCORE_C\\\*","gi"),score_c);
                /*
                FT
                RESULT_FT_H
                RESULT_FT_C
                SCORE_H
                SCORE_C
                BK
                RESULT_FT_H
                RESULT_FT_C
                SCORE_H
                SCORE_C
                TN
                RESULT_0_H
                RESULT_0_A
                SC_SET_H
                SC_SET_A
                VB
                RESULT_0_H
                RESULT_0_C
                SC_GAME_H
                SC_GAME_A
                BM
                RESULT_SET_H
                RESULT_SET_A
                SC_GAME_H
                SC_GAME_A
                TT
                RESULT_SET_H
                RESULT_SET_A
                SC_GAME_H
                SC_GAME_A
                BS
                RESULT_FT_H
                RESULT_FT_C
                SCORE_H
                SCORE_C
                SK
                SCORE_H
                SCORE_C
                SCORE_H
                SCORE_C
                OT
                RESULT_FT_H
                RESULT_FT_C
                SCORE_H
                SCORE_C
                */

                var wager_count=0,wager_gold=0,more_count=0;

                if(toppar["tbet_showtype"] == "STARTED"){
                    wager_count=gameHash[j]["wager_count_FT"]*1+gameHash[j]["wager_count_RB"]*1
                    wager_gold=gameHash[j]["wager_gold_FT"]*1+gameHash[j]["wager_gold_RB"]*1
                    more_count=gameHash[j]["more_count_FT"]*1+gameHash[j]["more_count_RB"]*1
                }else{
                    wager_count=gameHash[j]["wager_count"]*1;
                    wager_gold=gameHash[j]["wager_gold"]*1;
                    more_count=gameHash[j]["more_count"]*1;
                }

                tpl.replace(new RegExp("\\\*WAGER_COUNT\\\*","gi"),_self.wagerFormat(wager_count));
                tpl.replace(new RegExp("\\\*WAGER_GOLD\\\*","gi"),_self.goldFormat(wager_gold));
                tpl.replace(new RegExp("\\\*MORE_COUNT\\\*","gi"),_self.wagerFormat(more_count));

                if(toppar["tbet_showtype"] == "TODAY" || toppar["tbet_showtype"] == "EARLY" || score_h*1 <0  || score_c *1 <0){
                    tpl.replace(new RegExp("\\\*DISPLAY_SCORE\\\*","gi"),"style='display:none' ");
                }else{
                    tpl.replace(new RegExp("\\\*DISPLAY_SCORE\\\*","gi")," ");
                }

            }
            var tpl_innerHtml = tpl.fastPrint();
            tpl_innerHtml = tpl_innerHtml.replace(/\*LEAGUE\*/g, hash["league"][i]["league_name"]);
            tpl_innerHtml = tpl_innerHtml.replace(/\*LEAGUEID\*/g, hash["league"][i]["lid"]);


            // tpl_innerHtml = tpl_innerHtml.replace(/\*COUNT\*/g, _self.wagerFormat(hash["league"][i]["count"]*1));
            // tpl_innerHtml = tpl_innerHtml.replace(/\*GOLD\*/g, _self.goldFormat(hash["league"][i]["gold"]*1));

            // tpl_innerHtml = tpl_innerHtml.replace(/\*COUNT_FT\*/g, _self.wagerFormat(hash["league"][i]["count_FT"]*1));
            // tpl_innerHtml = tpl_innerHtml.replace(/\*GOLD_FT\*/g, _self.goldFormat(hash["league"][i]["gold_FT"]*1));

            // tpl_innerHtml = tpl_innerHtml.replace(/\*COUNT_RB\*/g, _self.wagerFormat(hash["league"][i]["count_RB"]*1));
            // tpl_innerHtml = tpl_innerHtml.replace(/\*GOLD_RB\*/g, _self.goldFormat(hash["league"][i]["gold_RB"]*1));
            show_innerHTML += tpl_innerHtml;

        }
        _mc["allbetleague_show"].innerHTML = show_innerHTML;

        //新增進內層的點擊事件
        for(var i=0; i<hash["league"].length; i++){
            var gameHash = hash["league"][i]["game"];
            leagueid = hash["league"][i]["lid"]+"";

            // var league_head = dom.getElementById("league_head_"+leagueid);
            // _self.removeClassStr(league_head,"active");
            // util.addEvent(league_head, "click", _self.leagueClose, { "league_id": leagueid });
            // if(leagueCloseAry.indexOf(leagueid)!= -1){
            //     _self.divChildrenClose(league_head);
            // }
            for(var j=0; j<gameHash.length; j++){
                gid = gameHash[j]["m_gid"];
                gidm = gameHash[j]["gidm"];
                util.addEvent(dom.getElementById("allbetleague_teamli_"+gid), "click", _self.gotoAllbetEvent, { "gidm":gidm});
            }
        }
    }




    _self.searchItem = function(e){
        // console.log(_par);
        var ul = dom.getElementById("allbetleague_show");
        var objary = ul.children;
        if(objary==null)return;

        var target = dom.getElementById("allbetleague_text");
        var reg = new RegExp("" + target.value + "","i");
        for(var i=0;i<objary.length;i++){
            var id_str = objary[i].id;
            //var searchMain = (value)? value:text;
            if(id_str.indexOf("allbetleague_teamli_") ==-1){
                continue;
            }
            var objid = ",allbetleague_team_h,allbetleague_team_c,";
            var tmpObj = util.getObjAry(objary[i], objid);
            var text_h = tmpObj["allbetleague_team_h"].innerText;
            var text_c = tmpObj["allbetleague_team_c"].innerText;

            if(text_h.match(reg) != null)_self.display(objary[i],"");
            else if(text_c.match(reg) != null)_self.display(objary[i],"");
            else _self.display(objary[i],"none");
        }

        // 處理聯盟底下賽事空的問題
        var leagueli;
        var teamli;
        var leagueHaveTeam = false;
        for(var i=0;i<objary.length;i++){
            var id_str = objary[i].id;
            if(id_str.indexOf("allbetleague_teamli_")== -1){
                if(leagueli!=null){
                    if(leagueHaveTeam == false) _self.display(leagueli,"none");
                    else _self.display(leagueli,"");
                }
                leagueli = objary[i];
                leagueHaveTeam = false;
            }else{
                teamli = objary[i];
                if(teamli.style.display==""){
                    leagueHaveTeam = true;
                }
            }
        }
        if(leagueli!=null){
            if(leagueHaveTeam == false) _self.display(leagueli,"none");
            else _self.display(leagueli,"");
        }
    }
    _self.clearSearch = function(e){
        var target = dom.getElementById("allbetleague_text");
        target.value="";
        _self.searchItem(e);

    }

    _self.display = function(obj,str){
        if(obj!=null && obj.style !=null){
            obj.style.display=str;
        }
    }

    _self.leagueClose=function(e,param){
        var tarDiv = dom.getElementById("league_head_"+param.league_id);
        _self.divChildrenClose(tarDiv);
    }
    _self.wtypeClose=function(e,param){
        var tarDiv = dom.getElementById("show_"+param.wtype);
        _self.divChildrenClose(tarDiv);
    }
    _self.divChildrenClose=function(tarDiv){
        var ids = tarDiv.id;
        //console.log("divChildrenClose",ids);
        if(ids==null)ids="";
        var show_pos = ids.indexOf("show_");
        var league_head_pos = ids.indexOf("league_head_");
        var wtype=ids.replace("show_","");
        var league_id=ids.replace("league_head_","");

        if(tarDiv.classList.contains("active")){
            // console.log("s tarDiv.className    "+tarDiv.className);
            tarDiv.classList.remove("active");
            // console.log("e tarDiv.className    "+tarDiv.className);
            if(show_pos != -1){
                allbetCloseWtype.splice(allbetCloseWtype.indexOf(wtype),1);
            }
            if(league_head_pos  != -1 ){
                leagueCloseAry.splice(leagueCloseAry.indexOf(league_id),1);
            }
        }else{
            // console.log("s tarDiv.className    "+tarDiv.className);
            tarDiv.classList.add("active");
            // console.log("e tarDiv.className    "+tarDiv.className);
            if(show_pos  != -1 ){
                if(allbetCloseWtype.indexOf(wtype) == -1)allbetCloseWtype.push(wtype);
            }
            if(league_head_pos  != -1 ){
                if(leagueCloseAry.indexOf(league_id) == -1)leagueCloseAry.push(league_id);
            }
        }
        // console.log("divChildrenClose",allbetCloseWtype,leagueCloseAry);
    }
    _self.setClassStr=function(tarDiv,classStr){
        if(tarDiv!=null && tarDiv.classList!=null){
            if(tarDiv.classList.contains(classStr)){
                //tarDiv.classList.remove(classStr);
            }else{
                tarDiv.classList.add(classStr);
            }
        }
    }
    _self.removeClassStr=function(tarDiv,classStr){
        if(tarDiv!=null && tarDiv.classList!=null){
            if(tarDiv.classList.contains(classStr)){
                tarDiv.classList.remove(classStr);
            }else{
                //tarDiv.classList.add(classStr);
            }
        }
    }
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    _self.gotoBetDetailEvent =function(e,param){
        _self.gotoBetDetail(param,false);
    }
    _self.gotoBetDetail = function (param,isInit) {
        //切換時重置下拉霸事件 以免互相影響
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        util.classFunc(dom.getElementById("totalbet_show"), "tbet_title_fixed", "remove");
        //新增進內層的點擊事件
        parentClass.dispatchEvent("showLoading", {"showLoading":true});
        _set["layer"] = "wagers_index";

        if(isInit){
            // var par = new Object();
            // par["page"] = "wagers_index";
            // par["target"] = "totalbet_body";
            // par["retFun"] = function () {};
            // par["useDefineParent"] = "Y";
            // par["postHash"] = param.postHash;
            // parentClass.dispatchEvent("goToPage", par);
        }else{
            param.postHash["sub_page"] = "wagers_index";
            param.postHash["sub_target"] = "totalbet_body";

            param.postHash["tbet_showtype"] = toppar["tbet_showtype"];
            param.postHash["tbet_gtype"] = toppar["tbet_gtype"];
            //param.postHash["sub_retFun"] = "wagers_index";
            var par = new Object();
            par["page"] = "totalbet_header";
            par["postHash"] = param.postHash;
            parentClass.dispatchEvent("bodyGoToPage", par);
        }

    }

    //================== 過濾器相關Function ==================
    _self.showFilter = function () {
        _self.show_filter();
        _self.hideBtn();
    }

    _self.show_filter = function () {
        _self.display(dom.getElementById("filter_div"),"");
        // dom.getElementById("burger_sel").prevScrollBottomIgnore = true;//橫向滾軸物件判斷使用
        _self.display(dom.getElementById("filter_edit"),"none");
    }

    _self.hideFilter = function () {
        _self.display(dom.getElementById("filter_div"),"none");
        _self.display(dom.getElementById("filter_edit"),"none");
        // _self.hideMenuFilter();
        _self.showBtn();
    }

    _self.showBtn = function () {
        _self.display(dom.getElementById("show_filter"),"");
        _self.display(dom.getElementById("hide_filter"),"none");
    }

    _self.hideBtn = function () {
        _self.display(dom.getElementById("show_filter"),"none");
        _self.display(dom.getElementById("hide_filter"),"");
    }

    _self.showEditFilter = function () {
        _self.display(dom.getElementById("filter_div"),"none");
        _self.display(dom.getElementById("filter_edit"),"");
    }

    _self.editFilter = function (e, param) {
        // _self.hideMenuFilter();
        if (getView().viewportwidth < 1024) {
            //parentClass.dispatchEvent("showFilter", toppar);
        } else {
            _self.hideBtn();
            _self.showEditFilter();
        }
    }

    _self.filterCancel = function (e, param) {
        _self.initFilter();
        _self.hideEvent();
        //_self.initCalendar();
    }

    _self.initFilter = function () {
        for (var rtype in filterInitParam) {
            if(rtype=="stake"){
                //toppar["stake_obj"]["listItem"] == toppar["tbet_gtype"];
                if(toppar["stake_obj"]!=null)filterBigObj.reDefault(rtype, toppar["stake_obj"]);
                dom.getElementById("stake_now").value = toppar["stake"];
            }else{
                if(toppar[rtype] !=null)filterBigObj.reDefault(rtype, toppar[rtype].toString() );
            }
        }
    }

    _self.filterSubmit = function (e) {
        var rNow = dom.getElementById("stake_now");
        if(rNow.value=="") rNow.value = 0;
        filterUse["stake"]["listGold"][toppar["tbet_gtype"]] = rNow.value;
        _self.set_toppar();
        _self.reload();
        _self.set_sear_filter();
        _self.hideEvent();
    }
	_self.openSmallFilter = function(e,_par){
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
            }else if (rtype == "downline" || rtype == "league" || rtype == "market"){
                var rSelect = dom.getElementById(rtype + "_select");
                var r_smallSelect = dom.getElementById("f_" + rtype + "_small").children[1];
                var rNow = dom.getElementById(rtype + "_now");
                var str_show = LS.get("filter_" + rtype + "_show");

                if (str_show!=null){
                    if(toppar[rtype]=="all"){
                        //str_show = rNow.innerHTML + str_blank + str_show;
                        str_show = rNow.innerHTML;
                    }else{
                        if(rtype == "market") str_show = rNow.innerHTML;
                        else str_show = str_show+ str_blank +rNow.innerHTML;
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

    _self.hideEvent = function () {
        _self.show_filter();
    }

    _self.set_toppar = function(){

        toppar["league"] = _self.getFilterUse("league");
        toppar["date"] = _self.getFilterUse("date");
        toppar["market"] = _self.getFilterUse("market");
        toppar["stake"] = _self.getFilterUse("stake");
        toppar["stake_obj"] = util.clone(filterUse["stake"]) ;
        toppar["view"] = _self.getFilterUse("view");
        toppar["downline"] = _self.getFilterUse("downline");
        toppar["items"] = _self.getFilterUse("items");
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


    //--------------創建計時器 start-----------------
    _self.createTimer = function () {


        if(timerHash["totalbet"] !=null){
            timerHash["totalbet"].clearObj();
        }
        // timerHash["totalbet"] = new Timer(config_set.get("LEAGUE_RELOAD"));
        timerHash["totalbet"] = new Timer(30*1000);
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
        util.echo("totalbet stopTimer");
        timerHash["totalbet"].stopTimer();
    }

    _self.clearTimer = function () {
        util.echo("totalbet clearTimer");
        timerHash["totalbet"].clearObj();
        timerHash["totalbet"]=null;
    }

    _self.timerRun = function () {
        util.echo("totalbet timer");
        _self.reload();
    }

    _self.timerComplete = function () {
        util.echo("totalbet timerComplete"); //no complete
    }
    _self.reload =function(){
        if(toppar["tbet_showtype"] == "INPLAY" || toppar["tbet_showtype"] == "TODAY" || toppar["tbet_showtype"] == "EARLY" || toppar["tbet_showtype"] == "STARTED" || toppar["tbet_showtype"] == "OUTRIGHT"){
            if(_set["layer"] == "totalbet_model"){
                _self.reloadFilterData();
                // parentClass.dispatchEvent("showLoading", {"showLoading":true});

                _self.getData(toppar);
            }
            if(_set["layer"] == "totalbet_model_allbet"){
                _self.reloadFilterData();
                // parentClass.dispatchEvent("showLoading", {"showLoading":true});

                _self.getAllbetData(toppar);
                _self.getAllbetLeagueData(toppar);
            }
            if(_set["layer"] == "wagers_index"){
                _self.clearTimer();
            }
        }else{
            _self.clearTimer();
        }
    }
    //--------------創建計時器 end-----------------

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

    _self.goldFormat = function(val){
        if(isNaN(val*1)) val=0;
        var fronts = 0;
        var points = 1;
        var comma = ",";
        return util.mprintf(val,fronts,points,comma);
    }
    _self.wagerFormat = function(val){
        if(isNaN(val*1)) val=0;
        var fronts = 0;
        var points = 0;
        var comma = ",";
        return util.mprintf(val,fronts,points,comma);
    }
    //--------
    // _self.keep_credit = function (e) {
    //     credit_old = e.target.value.replace(/\D/g, '')*1;
    // }
    _self.initShow = function (e) {
        var target= null;
        if(e){
            target =  e.target || null;
        }
        if(target.value == 0 )target.value = "";
        // console.log("initShow",e,target);
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