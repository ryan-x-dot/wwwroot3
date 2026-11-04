function overView(_win, _dom) {
	var _self = this;
	var win = _win;
	var dom = _dom;
	var parentClass;
	var util;
	var LS;

	var tmpScreen;
	var _top;
	var paramObj;
	var _mc = new Object();
	var gtypeAry = new Array("FT", "BK", "TN", "VB", "BM", "TT", "BS", "SK", "OP");
	var timeAry = new Array("inplay", "today", "early", "outright", "parlay");
	var _idAry;
	var fastTemplate_a1;
	var config_set;
	var eventHandler = new Object();
	var filterInitParam = new Object();
	var filterUse = new Object();
	var filter_set = new Object();

	filterInitParam = {
		"view": {
			"info_mode": true,
			"title_mode": true,
			"_setDiv": null,
			"_titleView": null,
			"_contantView": null,
			"_type": null,
			"_viewClass": "active",
			"_list": ["full", "c", "s", "a", "csa", "cs", "sa"],
			"_listSub": [
				"Full Percentage", "SMA %", "Master Agent %", "Agent %",
				"SMA + Master Agent + Agent %", "SMA + Master Agent %", "Master Agent + Agent %"
			],
			"_act": false,
			"_default": "full",
			"mode": 1,
			"rtype": "view",
		}
	}

	var filterBigObj = null;
	var data_filter = {};

	_self.init = function (Top) {
		util.echo("overView_index complete");
		_top = Top

		if (_self.size(filter_set["OVERVIEW"]) == 0) {
			filterUse["name"] = dom.getElementById("full_radio").innerHTML;
			filterUse["value"] = "full";
		}else{
			filterUse["name"] = dom.getElementById(filter_set["OVERVIEW"]["value"]+"_radio").innerHTML;
			filterUse["value"] = filter_set["OVERVIEW"]["value"];
		}

		//gtypeAry = config_set.get("GTYPEARY");
		_self.setScrollEvent();

		var objid = ",table01,view_div,sp_bets,sp_total,div_show,div_model,view_now,filters_head,filters_title,burger_div,show_filter,hide_filter,f_view_small,";
		var ary = util.getObjAry(dom, objid);
		_mc = util.mergeArray(_mc, ary);

		_mc["burger_div"].addEventListener("click", _self.filter_600);
		_mc["view_div"].addEventListener("click", _self.filter);
		_mc["filters_title"].addEventListener("click", _self.f_view_small_btn);

		util.setInfEvent(dom.getElementById("view_div"), { "_focus": dom.getElementById("view_sel"), "_setView": dom.getElementById("view_div"), "_viewClass": "active" });
		util.setInfEvent(dom.getElementById("burger_div"), { "_focus": dom.getElementById("burger_sel"), "_setView": dom.getElementById("burger_div"), "_viewClass": "active" });


		_self.loadData();

	}

	_self.size = function (obj) {
		var size = 0, key;
		for (key in obj) {
			if (obj.hasOwnProperty(key)) size++;
		}
		return size;
	};

	_self.loadData = function () {
		var getHttp = new HttpRequest();
		getHttp.addEventListener("LoadComplete", _self.loadFinish);
		filter_set["OVERVIEW"] = util.clone(filterUse);
		getHttp.loadURL(top.url, "POST", _self.getUrlParam());
	}

	_self.setParentclass = function (_parentclass) {
		parentClass = _parentclass;
		util = parentClass.getThis("util");
		LS = parentClass.getThis("LS");
		topFrame = parentClass.getThis("topFrame");
		fastTemplate_a1 = parentClass.getThis("fastTemplate_a1");
		config_set = parentClass.getThis("config_set");
		filter_set = parentClass.getThis("filter_set");
	}
	_self.getUrlParam = function () {
		var sendCode = "";
		sendCode += "p=get_overview";
		sendCode += "&uid=" + top.uid;
		sendCode += "&login_layer=" + top.login_layer;
		sendCode += "&percentage=" + filterUse["value"];
		sendCode += "&id=" + top.layer_id;
		//console.log("send",sendCode);
		return sendCode;

	}

	//===================畫面資料=======================//
	_self.loadFinish = function (xml) {
		var ary = JSON.parse(xml);
		var _status = util.showTxt(ary, "status");
		var bet = new Array();
		var total = new Array();
		var allbet = 0;
		var alltotal = 0;

		for (var k = 0; k < timeAry.length; k++) {
			var time = timeAry[k];
			bet[time] = 0;
			total[time] = 0;
		}

		for (var j = 0; j < gtypeAry.length; j++) {
			var gtype = gtypeAry[j];
			for (var i = 0; i < timeAry.length; i++) {
				var time = timeAry[i];
				bet[time] += (_status["period"][gtype][time]["bets"]) * 1;
				total[time] += (_status["period"][gtype][time]["total"]) * 1;
				allbet += (_status["period"][gtype][time]["bets"]) * 1;
				alltotal += (_status["period"][gtype][time]["total"]) * 1;
			}
		}

		//_mc["sp_bets"].innerHTML = util.mprintf(allbet * 1, 0, 0, false, true);
		_mc["sp_total"].innerHTML = util.mprintf(alltotal * 1, 0, 1, false, true);
		_mc["sp_bets"].innerHTML = util.formatThousand(util.showTxt(String(allbet)));
		//_mc["sp_total"].innerHTML = util.formatThousand(util.showTxt(String(alltotal)));

		_mc["view_now"].innerHTML = filterUse["name"];
		_mc["filters_title"].innerHTML = filterUse["name"];

		var tpl = new fastTemplate_a1();
		tpl.init(_mc["div_model"].cloneNode(true));
		var objid = ",";
		_idAry = new Array();

		for (var i = 0; i < gtypeAry.length; i++) { //球類排序
			// for(var i=0; i<1; i++){
			tpl.addBlock("BETS");
			var gtype = gtypeAry[i];

			tpl.replace(/\*GTYPE\*/g, (util.showTxt(gtype))); //先給球類

			//tpl.replace(/\*ALL_BETS\*/g, util.mprintf(bet * 1, 0, 0, false, true));
			tpl.replace(/\*ALL_TOTAL\*/g, util.mprintf(total * 1, 0, 1, false, true));
			tpl.replace(/\*ALL_BETS\*/g, util.formatThousand(util.showTxt(bet)));
			//tpl.replace(/\*ALL_TOTAL\*/g, util.formatThousand(util.showTxt(total)));

			for (var j = 0; j < timeAry.length; j++) { //區間排序
				var time = timeAry[j];
				var session_str = time;

				var _bets = String((_status["period"][gtype][time]["bets"]) * 1);
				var _total = String((_status["period"][gtype][time]["total"]) * 1);

				//tpl.replace(_self.getMyReg("\\\*" + gtype + "_" + session_str.toUpperCase() + "_BETS\\\*"), util.mprintf(_bets * 1, 0, 0, false, true));
				tpl.replace(_self.getMyReg("\\\*" + gtype + "_" + session_str.toUpperCase() + "_TOTAL\\\*"), util.mprintf(_total * 1, 0, 1, false, true));
				tpl.replace(_self.getMyReg("\\\*" + gtype + "_" + session_str.toUpperCase() + "_BETS\\\*"), util.formatThousand(util.showTxt(_bets)));
				//tpl.replace(_self.getMyReg("\\\*" + gtype + "_" + session_str.toUpperCase() + "_TOTAL\\\*"), util.formatThousand(util.showTxt(_total)));
				_idAry.push(gtype + "_" + session_str);
				objid += gtype + "_" + session_str + ",";

			}
		}

		_mc["div_show"].innerHTML = tpl.fastPrint();

		for (var k = 0; k < timeAry.length; k++) {
			var time = timeAry[k];
			dom.getElementById(time + "_all_total").innerHTML = util.mprintf(total[time] * 1, 0, 1, false, true);
			dom.getElementById(time + "_all_bets").innerHTML = util.formatThousand(util.showTxt(String(bet[time])));
		}

		_mc["table01"].style.display = "";

		var obj_ary = util.getObjAry(_mc["div_show"], objid);
		_mc = util.mergeArray(_mc, obj_ary);
		_self.initBtn();

		parentClass.dispatchEvent("showLoading", { "showLoading": false });
		//_self.loadingFun(false);
	}


	_self.filter = function () {
		if (_mc["view_div"] != null) {
			var obj_ids = ",view_now,view_sel,full_radio,com_radio,my_radio,s_radio,a_radio,csa_radio,cs_radio,sa_radio,";
			var _EL = util.getObjAry(_mc["view_div"], obj_ids);

			switch (top.login_layer) {
				case "su":
					_EL["s_radio"].innerHTML = LS.get("filter_view_my");
					_EL["com_radio"].style.display = "none";
					_EL["my_radio"].style.display = "none";
					_EL["csa_radio"].style.display = "none";
					_EL["cs_radio"].style.display = "none";
					break;
				case "ag":
					_EL["a_radio"].innerHTML = LS.get("filter_view_my");
					_EL["com_radio"].style.display = "none";
					_EL["my_radio"].style.display = "none";
					_EL["s_radio"].style.display = "none";
					_EL["csa_radio"].style.display = "none";
					_EL["cs_radio"].style.display = "none";
					_EL["sa_radio"].style.display = "none";
					break;
			}

			_mc["ClassSelect"] = new win.ClassSelect(win, dom);
			_mc["ClassSelect"].setParentclass(_self);
			_mc["ClassSelect"].init(_EL["view_now"], _EL["view_sel"]);
			_mc["ClassSelect"].addEvent("ONCHANGE", _self.reloadData);

			_EL["view_now"].innerHTML = filterUse["name"];

		}
	}

	_self.filter_600 = function () {
		if (_mc["filters_head"].style.display == "") {
			_mc["hide_filter"].style.display = "";
			_mc["show_filter"].style.display = "none";
		} else {
			_mc["hide_filter"].style.display = "none";
			_mc["show_filter"].style.display = "";
		}

		_mc["show_filter"].addEventListener("click", _self.filters_head_btn);
		_mc["hide_filter"].addEventListener("click", _self.filters_head_btn);
		_mc["f_view_small"].addEventListener("click", _self.f_view_small_btn);

	}

	_self.filters_head_btn = function () {
		if (_mc["filters_head"].style.display == "none") {
			_mc["filters_head"].style.display = "";
		} else {
			_mc["filters_head"].style.display = "none";
		}

	}

	_self.f_view_small_btn = function () {
		_self.defaultFilter();
		_self.setSelectEvent();

		parentClass.dispatchEvent("showOverviewFilter", filterInitParam["view"]);
	}

	_self.defaultFilter = function () {
		var view_map = {};

		view_map["d0"] = {};
		view_map["d0"]["data_list"] = ["full", "my", "c", "s", "a", "csa", "cs", "sa"];
		view_map["d0"]["data_listSub"] = _self.get_filter_name("view", view_map["d0"]["data_list"]);

		view_map["co"] = {};
		view_map["co"]["data_list"] = ["full", "my", "s", "a", "csa", "cs", "sa"];
		view_map["co"]["data_listSub"] = _self.get_filter_name("view", view_map["co"]["data_list"]);
		view_map["su"] = {};
		view_map["su"]["data_list"] = ["full", "my", "a", "sa"];
		view_map["su"]["data_listSub"] = _self.get_filter_name("view", view_map["su"]["data_list"]);
		view_map["ag"] = {};
		view_map["ag"]["data_list"] = ["full", "my"];
		view_map["ag"]["data_listSub"] = _self.get_filter_name("view", view_map["ag"]["data_list"]);

		filterInitParam["view"]["_list"] = view_map[top.login_layer]["data_list"];
		filterInitParam["view"]["_listSub"] = view_map[top.login_layer]["data_listSub"];
		filterInitParam["view"]["_default"] = filterUse["value"];
	}

	_self.get_filter_name = function (rtype, arr_filter) {
		var tmp_name = "";
		var arr_out = new Array();
		for (var key in arr_filter) {
			tmp_name = LS.get("filter_" + rtype + "_" + arr_filter[key]);
			if (tmp_name != null) {
				arr_out.push(tmp_name);
			} else {
				arr_out.push(arr_filter[key]);
			}
		}
		return arr_out;
	}

	_self.setSelectEvent = function () {
		for (var rtype in filterInitParam) {

			var rDom = dom.getElementById(rtype + "_div");
			var rSel = dom.getElementById(rtype + "_sel");
			var rNow = dom.getElementById(rtype + "_now");

			filterInitParam[rtype]["_titleName"] = LS.get("btns_" + rtype);
			filterInitParam[rtype]["_setDiv"] = rDom;
			filterInitParam[rtype]["_contantView"] = rSel;
			filterInitParam[rtype]["_titleView"] = rNow;

			if (data_filter[rtype]) filterInitParam[rtype]["_data"] = data_filter[rtype];

		}

		filterBigObj = new util.filterBig(win, dom);
		filterBigObj.setParentclass(parentClass);
		filterBigObj.addEventListenEvent();
		filterBigObj.addEventListener("autoBackParam", _self.takeParam);
		filterBigObj.init(filterInitParam);

	}

	_self.takeParam = function (obj) {
		//console.log("take===>", obj);

		switch (obj["view"]) {
			case "full":
				filterUse["name"] = dom.getElementById("view_full_f").children[0].innerHTML;
				filterUse["value"] = "full";
				break;

			case "my":
				filterUse["name"] = dom.getElementById("view_my_f").children[0].innerHTML;
				filterUse["value"] = "my";
				break;
			case "c":
				filterUse["name"] = dom.getElementById("view_d_f").children[0].innerHTML;
				filterUse["value"] = "c";
				break;
			case "s":
				filterUse["name"] = dom.getElementById("view_s_f").children[0].innerHTML;
				filterUse["value"] = "s";
				break;
			case "a":
				filterUse["name"] = dom.getElementById("view_a_f").children[0].innerHTML;
				filterUse["value"] = "a";
				break;
			case "csa":
				filterUse["name"] = dom.getElementById("view_csa_f").children[0].innerHTML;
				filterUse["value"] = "csa";
				break;
			case "cs":
				filterUse["name"] = dom.getElementById("view_sc_f").children[0].innerHTML;
				filterUse["value"] = "cs";
				break;
			case "sa":
				filterUse["name"] = dom.getElementById("view_sa_f").children[0].innerHTML;
				filterUse["value"] = "sa";
				break;
		}

		for (var i in filter_set) {
			if (i == "OVERVIEW") {
				continue;
			} else {
				filter_set[i]["view"] = filterUse["value"];
			}
		}
		_self.loadData();

	}

	_self.changeFilter = function (param) {
		//console.log(param);
		var param_obj = param.param;

		_self.takeParam(param_obj);

	}

	//===================按鈕連結=========================//
	_self.initBtn = function () {
		for (var i = 0; i < _idAry.length; i++) {
			util.addEvent(_mc[_idAry[i]], "click", _self.clickBtn, _mc[_idAry[i]]);
		}

		//_self.loadingFun(false);
	}
	_self.clickBtn = function (mouseEvent, targetObj) {
		var tmp = targetObj.id.split("_");
		var _gtype = tmp[0]
		var _session = tmp[1];

		switch (_session) {
			case "inplay":
				_session = "INPLAY";
				break;
			case "today":
				_session = "TODAY";
				break;
			case "early":
				_session = "EARLY";
				break;
			case "parlay":
				_session = "PARLAY";
				break;
			case "outright":
				_session = "OUTRIGHT";
				break;
		}

		var param = new Object();
		param.page = "totalbet_header";
		param.target = "overview";
		param.postHash = { "tbet_gtype": _gtype, "tbet_showtype": _session };

		top.tbet_gtype = _gtype;
		top.tbet_showtype = _session;

		parentClass.dispatchEvent("bodyGoToPage", param);
	}

	_self.getMyReg = function (types) {
		return new RegExp(types, "g");
	}

	_self.closeEvent = function (mouseEvent, targetObj) {
		//tmpScreen.style.display = "none";
		_self.addEventListener("layerCloseHandler", { "divname": classname.replace(".js", "") });
	}

	_self.loadingFun = function (types) {
		var obj = new Object();
		obj.isShow = types;
		_self.addEventListener("setLoadingVisibleHandler", obj);
	}

	_self.setScrollEvent = function (isset) {
		var ref = dom.getElementById("re_functionG");
		var acceo = dom.getElementById("div_show");
		keepScrollTop = ref.offsetHeight + acceo.offsetHeight;
		overScrollTop = ref.offsetHeight + acceo.offsetHeight;
		if (!param.disableScrollEvent || isset) {
			util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, dom.getElementById("showBody"));
			util.addEvent(dom.getElementById("re_right_scroll"), "scroll", _self.scrollEvent, dom.getElementById("re_head_scroll"));
		}
	}

	//判斷向下滑動 設定加上css
	_self.scrollEvent = function (e, target) {
		var view_h = getView().viewportheight;
		if (target.id == "showBody" && view_h < 659){
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
		} else if (target.id == "re_head_scroll"){
			if (e.target.scrollLeft > 0){
				util.classFunc(target, "fixed");
			}else{
				util.classFunc(target, "fixed", "remove");
			}

		//dom.getElementById("re_head_scroll").style.overflowX = "scroll";
		//dom.getElementById("head_fix_scroll").scrollLeft = e.target.scrollLeft;

		}

		dom.getElementById("head_fix_scroll").scrollLeft = dom.getElementById("re_right_scroll").scrollLeft;

		if (dom.getElementById("re_right_scroll").scrollLeft > 0) {
			util.classFunc(dom.getElementById("first_td"), "fixed");
		} else {
			util.classFunc(dom.getElementById("first_td"), "fixed", "remove");
		}

	}

	_self.debugPrint = function (msg) {
		try {
			console.log(msg);
		} catch (e) {
			//alert(msg);
		}
	}


	//========================================================================================

	_self.reloadData = function (changeEvent, targetObj) {

		switch (targetObj.id) {
			case "full_radio":
				filterUse["name"] = dom.getElementById("full_radio").innerHTML;
				filterUse["value"] = "full";
				break;
			case "my_radio":
				filterUse["name"] = dom.getElementById("my_radio").innerHTML;
				filterUse["value"] = "my";
				break;
			case "c_radio":
				filterUse["name"] = dom.getElementById("d_radio").innerHTML;
				filterUse["value"] = "c";
				break;
			case "s_radio":
				filterUse["name"] = dom.getElementById("s_radio").innerHTML;
				filterUse["value"] = "s";
				break;
			case "a_radio":
				filterUse["name"] = dom.getElementById("a_radio").innerHTML;
				filterUse["value"] = "a";
				break;
			case "csa_radio":
				filterUse["name"] = dom.getElementById("csa_radio").innerHTML;
				filterUse["value"] = "csa";
				break;
			case "cs_radio":
				filterUse["name"] = dom.getElementById("cs_radio").innerHTML;
				filterUse["value"] = "cs";
				break;
			case "sa_radio":
				filterUse["name"] = dom.getElementById("sa_radio").innerHTML;
				filterUse["value"] = "sa";
				break;
		}

		for (var i in filter_set) {
			if (i == "OVERVIEW") {
				continue;
			} else {
				filter_set[i]["view"] = filterUse["value"];
			}
		}
		_self.loadData();
		//parentClass.reloadEventHandler();
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

}