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
	var eventHandler = new Object;
	var totalAry;
	var tfootAry;
	var rowAry;
	var excel_totalAry;
	var excel_tfootAry;
	var excel_rowAry;
	var dataHash = null;
	var selectFun = new Object;
	var reportTypeAry = new Array("set", "valid", "all");
	var subTypeAry = new Array("su", "ag");
	var subTypeMap = {
		"su": "ag",
		"ag": "mem"
	};
	var row0 = new Array;
	var par = new Object;
	var selPar = new Object;
	var idAry = new Array;
	var stop_h = 0;
	var nowDetail = "";
	var selObj = new Object;
	selObj["result_type"] = new Array("Y", "N", "D", "D4");
	selObj["date"] = new Array("yes", "to", "tm", "tw", "lw", "tp", "lp");
	selObj["account"] = new Array("main", "all_account");
	var sort_asc = false;
	var sort_type = "";
	var scroll_e = null;
	var scroll_left = 0;
	var tmpModelAry = new Array("report_list_bet", "report_list_bet_unsettled");
	var cancelAry = new Array;
	var possessAry = new Array;
	var possess_openAry = new Object;
	var footer_height = 0;
	var pb_height = 0;
	var displayWtype = null;
	var inWtype = null;
	var disAry;
	var lazy_sw = null;
	var lazy_count = null;
	var lazy_page = null;
	var lazy_total_page = null;
	var lazy_loading = false;
	var allDate = null;
	var is_fixed_head = false;
	var _mc = new Object;
	var dateHash;
	var originalAccountSel;
	var originalAccountSel_600;
	var isInitAccSelect = true;
	var isOpenPossess = false;
	var isOpenCancel = false;
	var isPcUser;
	var useBigScreen;
	var lastResultType = null;
	_self.init = function() {};
	_self.reInit = function(_childClass, _classname, _totalAry, _rowAry, _tfootAry) {
		childClass = _childClass;
		totalAry = _totalAry;
		rowAry = _rowAry;
		tfootAry = _tfootAry;
		classname = _classname;
		parentClass.dispatchEvent("chgLeftMenuColor", {"target": "report"});
		dom.getElementById("body_show").classList.remove("body_pb");
		selObj["gtype"] = config_set.get("REPORT_GTYPE");
		sort_type = classname == "report_list_bet" ? "DATETIME": "NAME0";
		obj_ids += ",date_now,f_date_now,";
		_mc = util.getObjAry(dom, obj_ids);
		if (getView().viewportwidth >= 1024) isPcUser = true;
		else isPcUser = false;
		useBigScreen = top.login_layer == postHash["view_layer"] && postHash["account"] == "all_account" ? true: false;
	
		_self.parseJSON();
		_self.initFilter();
		_self.initChooseName();
		_self.initSelectFun();
		_self.initReportTypeDiv();
		_self.initCalendar();
		_self.initReportType();
		_self.initLazy();
		_self.hideFilter();
		disAry = _self.getDisObj();
		if (top.user_type == 1 && top.login_layer == postHash["view_layer"]) _self.getSubAccount();
		else {
			if (top.user_type != 1 || postHash["from_acc_layer"] != null) {
				dom.getElementById("account_div").setAttribute("style", "display:none");
				dom.getElementById("account_label_600").setAttribute("style", "display:none")
			}
			dom.getElementById("sub_account").setAttribute("style", "display: none");
			_self.setSelectEvent()
		}
		originalAccountSel = dom.getElementById("account_sel").cloneNode(true);
		originalAccountSel_600 = dom.getElementById("account_div_600").cloneNode(true);
		util.addEvent(dom.getElementById("export_excel"), "click", _self.exportExcel);
		util.addEvent(dom.getElementById("show_filter"), "click", _self.show_filter);
		util.addEvent(dom.getElementById("copy_btn"), "click", _self.copyTable);
		_self.addEventListener("choseDateEvent", _self.choseDateEvent);
		for (var i = 0; i < reportTypeAry.length; i++) {
			var _name = reportTypeAry[i];
			util.addEvent(dom.getElementById(_name + "_btn"), "click", _self.chgReportType, {
				"type": _name
			})
		}
		util.addEvent(win, "orientationchange", _self.orientation);
		_self.getModel(true)
	};
	_self.parseJSON = function() {
		dateHash = JSON.parse(win.jsonDate);
		util.echo(dateHash)
	};
	_self.setParentclass = function(_parentclass) {
		parentClass = _parentclass;
		util = parentClass.getThis("util");
		LS = parentClass.getThis("LS");
		LS_code = parentClass.getThis("LS_code");
		LS_report = parentClass.getThis("LS_report");
		cookie = parentClass.getThis("cookie");
		getView = parentClass.getThis("getView");
		config_set = parentClass.getThis("config_set");
		fastTemplate_a1 = parentClass.getThis("fastTemplate_a1")
	};
	_self.getThis = function(varible) {
		return eval(varible)
	};
	_self.getParentThis = function(varible) {
		return parentClass.getThis(varible)
	};
	_self.orientation = function() {
		var orientation = win.Math.abs(win.orientation);
		if (orientation == 90 || orientation == 0) if (dom.getElementById("div_model")) _self.getModel(true)
	};
	_self.initScroll = function() {
		is_fixed_head = false;
		if (dom.getElementById("more_btn")) dom.getElementById("more_btn").style.display = "none";
		util.addEvent(dom.getElementById("re_body_scroll"), "scroll", _self.scrollHorEvent);
		util.addEvent(dom.getElementById("ma_content"), "scroll", _self.scrollVerEvent, dom.getElementById("re_body"));
		util.addEvent(dom.getElementById("data_right_scroll"), "scroll", _self.data_right_scrollEvent);
		util.addEvent(dom.getElementById("re_breadUL"), "scroll", _self.roll, {
			"chk_obj": dom.getElementById("re_breadUL"),
			"do_obj": dom.getElementById("re_breadUL").parentNode,
			"do_obj2": dom.getElementById("copy_btn")
		});
		util.addEvent(dom.getElementById("filter_scroll"), "scroll", _self.filter_roll, {
			"chk_obj": dom.getElementById("filter_scroll"),
			"do_obj": dom.getElementById("show_filter")
		});
		if (getView().viewportwidth < 1440) if (dom.getElementById("more_btn")) {
			if (dom.getElementById("more_btn").onclick != null) util.removeEvent(dom.getElementById("more_btn"), "click");
			if (cookie.get("moreTip20190130") == "Y") dom.getElementById("more_btn").style.display = "none";
			else if (!cookie.get("moreTip20190130")) {
				dom.getElementById("more_btn").style.display = "";
				util.addEvent(dom.getElementById("more_btn"), "click", _self.scrollHorToRight)
			}
		}
	};
	_self.roll = function(e, param) {
		var maxScrollLeft = param.chk_obj.scrollWidth - param.chk_obj.clientWidth;
		if (param.chk_obj.scrollLeft == 0) param.do_obj.classList.remove("scroll");
		else if (param.chk_obj.scrollLeft == maxScrollLeft) param.do_obj2.classList.remove("scroll");
		else {
			param.do_obj.classList.add("scroll");
			param.do_obj2.classList.add("scroll")
		}
	};
	_self.filter_roll = function(e, param) {
		if (param.chk_obj.scrollLeft == 0) param.do_obj.classList.remove("--active");
		else param.do_obj.classList.add("--active")
	};
	_self.data_right_scrollEvent = function(e, targetObj) {
		_self.possess_close_all();
		var _obj = new Object;
		_obj["data_right_scroll"] = dom.getElementById("data_right_scroll");
		_obj["head_fix_scroll"] = dom.getElementById("head_fix_scroll");
		if (_obj["data_right_scroll"] && _obj["head_fix_scroll"]) {
			_obj["head_fix_scroll"].scrollLeft = _obj["data_right_scroll"].scrollLeft;
			if (_obj["data_right_scroll"].scrollLeft > 0 && !is_fixed_head) {
				var _fix_head = dom.getElementsByClassName("re_td_fixedShadow");
				for (var i = 0; i < _fix_head.length; i++) util.classFunc(_fix_head[i], "fixed");
				is_fixed_head = true
			} else if (_obj["data_right_scroll"].scrollLeft <= 0 && is_fixed_head) {
				var _fix_head = dom.getElementsByClassName("re_td_fixedShadow");
				for (var i = 0; i < _fix_head.length; i++) util.classFunc(_fix_head[i], "fixed", "remove");
				is_fixed_head = false
			}
		}
		var obj_more_btn = dom.getElementById("more_btn");
		if (obj_more_btn) if (_obj["data_right_scroll"].scrollLeft + _obj["data_right_scroll"].clientWidth >= _obj["data_right_scroll"].scrollWidth) obj_more_btn.style.display = "none"
	};
	_self.scrollVerEvent = function(e, targetObj) {
		scroll_e = e;
		_self.scroll_ver_event(e, targetObj)
	};
	_self.scroll_ver_event = function(e, targetObj) {
		_self.possess_close_all();
		var arr_close = new Array("result_type", "gtype");
		for (var key in arr_close) util.classFunc(dom.getElementById(arr_close[key] + "_div"), "--on", "remove");
		if (e == null || !dom.getElementById("re_function")) return;
		var newScrollTop = e.target.scrollTop;
		var ori_h = e.target.scrollHeight;
		var now_h = 0;
		var func_h = dom.getElementById("main_header").clientHeight + dom.getElementById("re_function").clientHeight;
		if (newScrollTop > func_h) {
			util.classFunc(targetObj, "report_fixed");
			_self.data_right_scrollEvent();
			now_h = e.target.scrollHeight;
			if (now_h != 0) stop_h = func_h - (ori_h - now_h)
		}
		if (newScrollTop <= func_h) util.classFunc(targetObj, "report_fixed", "remove");
		_self.checkShowLazyLoading(e.target)
	};
	_self.checkShowLazyLoading = function(target) {
		if (!lazy_sw) return;
		var newScrollTop = target.scrollTop;
		var s_h = target.scrollHeight;
		var c_h = target.clientHeight;
		var scroll_bottom = newScrollTop >= s_h - c_h - footer_height - pb_height;
		if (scroll_bottom && !lazy_loading) if (lazy_page < lazy_total_page) {
			_self.setLzayLoadingVisible(true);
			retryTimer = setTimeout(_self.loadLazyData, 300)
		}
	};
	_self.setLzayLoadingVisible = function(isShow) {
		if (!lazy_sw) return;
		lazy_loading = isShow;
		dom.getElementById("report_loading").style.display = isShow ? "": "none"
	};
	_self.loadLazyData = function() {
		if (!lazy_sw) return;
		lazy_loading = true;
		if (lazy_page < lazy_total_page) {
			lazy_page++;
			_self.parseData(dataHash)
		}
	};
	_self.initLazy = function() {
		lazy_sw = config_set.get("LAZY_SW") || false;
		lazy_page = 1;
		lazy_total_page = 1;
		var lazy_cnt = getView().viewportheight > 700 ? "LAZY_COUNT_BIG_PAGE": "LAZY_COUNT";
		lazy_count = config_set.get(lazy_cnt) || 10
	};
	_self.reSetLazy = function(row0) {
		_self.initLazy();
		lazy_total_page = row0 ? Math.ceil(row0.length / lazy_count) : 1
	};
	_self.scrollHorEvent = function(e) {
		_self.scroll_hor_event(e.target, false)
	};
	_self.scroll_hor_event = function(target, isParse) {
		if (dom.getElementById("more_btn") && !isParse) dom.getElementById("more_btn").style.display = "none";
		var obj = dom.getElementById("re_head_scroll");
		if (obj) {
			obj.scrollLeft = target.scrollLeft;
			var scorllW = target.scrollWidth - target.clientWidth;
			scroll_left = target.scrollLeft;
			if (!cookie.get("moreTip20190130") && !isParse) cookie.set("moreTip20190130", "Y")
		}
	};
	_self.scrollHorToRight = function() {
		dom.getElementById("more_btn").style.display = "none";
		dom.getElementById("data_right_scroll").scrollLeft = dom.getElementById("data_right_scroll").scrollWidth;
		if (!cookie.get("moreTip20190130")) cookie.set("moreTip20190130", "Y")
	};
	_self.checkHeader = function(close) {
		if (getView().viewportwidth < 1440) {
			if (dom.getElementById("td_total_fixed") != null) dom.getElementById("td_total_fixed").classList.add("re_td_fixed");
			if (dom.getElementById("td_result_fixed") != null) dom.getElementById("td_result_fixed").classList.add("re_td_fixed");
			if (dom.getElementById("td_header_fixed") != null) dom.getElementById("td_header_fixed").classList.add("re_td_fixed");
			for (var i = 0; i < idAry.length; i++) if (dom.getElementById("td_" + idAry[i] + "_fixed") != null) dom.getElementById("td_" + idAry[i] + "_fixed").classList.add("re_td_fixed")
		}
		if (close) {
			if (dom.getElementById("td_total_fixed") != null) dom.getElementById("td_total_fixed").classList.remove("re_td_fixed");
			if (dom.getElementById("td_result_fixed") != null) dom.getElementById("td_result_fixed").classList.remove("re_td_fixed");
			if (dom.getElementById("td_header_fixed") != null) dom.getElementById("td_header_fixed").classList.remove("re_td_fixed");
			for (var i = 0; i < idAry.length; i++) if (dom.getElementById("td_" + idAry[i] + "_fixed") != null) dom.getElementById("td_" + idAry[i] + "_fixed").classList.remove("re_td_fixed")
		}
	};
	_self.initReportTypeDiv = function() {
		if (postHash["view_layer"] == "list_bet" || postHash["view_layer"] == "mem" || par["report_kind"] == "D" || par["report_kind"] == "D4" || par["result_type"] == "N" || (top.login_layer == postHash["view_layer"] || postHash["is_from_acc"]) && getView().viewportwidth < 1024 && useBigScreen != true) dom.getElementById("div_result_type").style.display = "none";
		else dom.getElementById("div_result_type").style.display = ""
	};
	_self.initSelectFun = function() {
		selectFun["result_type"] = _self.chgSel;
		selectFun["date"] = _self.chgDate;
		selectFun["gtype"] = _self.chgSel;
		selectFun["account"] = _self.chgSel
	};
	_self.initFilter = function() {
		if (Object.keys(par).length === 0) par = util.clone(postHash);
		selPar = util.clone(par);
		if (par["report_kind"] == "A") {
			lastResultType = par["result_type"];
			_self.chgSel(null, {
				"rtype": "result_type",
				"type": par["result_type"]
			})
		} else {
			lastResultType = par["report_kind"];
			_self.chgSel(null, {
				"rtype": "report_kind",
				"type": par["report_kind"]
			})
		}
		_self.chgSel(null, {
			"rtype": "gtype",
			"type": par["gtype"]
		});
		document.getElementById("date_now").textContent = _self.dateReplace(par["date_start"], "set") + "~" + _self.dateReplace(par["date_end"], "set");
		document.getElementById("f_date_now").textContent = _self.dateReplace(par["date_start"], "set") + "~" + _self.dateReplace(par["date_end"], "set");
		if (top.user_type != 1 || postHash["from_acc_layer"] != null) document.getElementById("filter_div").classList.add("--sub")
	};
	_self.filterCancel = function(e, param) {
		_self.hideFilter();
		_self.initFilter();
		if (top.user_type != "1" || postHash["from_acc_layer"] == null) _self.chgSel(null, {
			"rtype": "account",
			"type": par["account"]
		})
	};
	_self.filterClear = function() {
		_self.initFilter();
		if (isPcUser) {
			document.getElementById("input_all_start").value = par["date_start"];
			document.getElementById("input_all_end").value = par["date_end"]
		} else {
			document.getElementById("f_input_all_start").value = par["date_start"];
			document.getElementById("f_input_all_end").value = par["date_end"]
		}
		_self.chgSel(null, {
			"rtype": "account",
			"type": par["account"]
		})
	};
	_self.filterSubmit = function(e, param) {
		useBigScreen = top.login_layer == postHash["view_layer"] && selPar["account"] == "all_account" ? true: false;
		_self.hideFilter();
		if (top.user_type == 1 && top.login_layer == postHash["view_layer"]) _self.getSubAccount();
		_self.checkReport(_self.getModel, true);
		cookie.del("isclick")
	};
	_self.dateReplace = function(str, type) {
		var ret_str = str;
		if (type == "get") {
			ret_str = ret_str.replace(/ /g, "");
			ret_str = ret_str.replace(/\//g, "-")
		}
		if (type == "set") ret_str = ret_str.replace(/\-/g, "/");
		return ret_str
	};
	_self.show_filter = function() {
		dom.getElementById("filter_div").style.display = "";
		dom.getElementById("filter_div").prevScrollBottomIgnore = true;
		_self.setBoxClass(dom.getElementById("ma_content"), "md_hidden", "add");
		dom.getElementById("filter_clear").disabled = true;
		dom.getElementById("filter_submit").disabled = true
	};
	_self.hideFilter = function() {
		dom.getElementById("filter_div").style.display = "none";
		_self.setBoxClass(dom.getElementById("ma_content"), "md_hidden", "")
	};
	_self.setBoxClass = function(targetObj, style, _doSome) {
		if (targetObj == null) return;
		if (targetObj.initclass == null) targetObj.initclass = targetObj.className;
		else targetObj.className = targetObj.initclass;
		if (_doSome == "add" && !targetObj.classList.contains(style)) targetObj.classList.add(style)
	};
	_self.initCalendar = function() {
		if (isPcUser) _self.setCalendar(dateHash, "all");
		else _self.setCalendar(dateHash, "f_all")
	};
	_self.setCalendar = function(dateHash, _name) {
		var sPar = new Object;
		if (_name == "all") {
			sPar.div = dom.getElementById("div_date");
			sPar.photo = dom.getElementById("icon_all");
			sPar.CalendarClass = win.ClassFankCal2_ag
		} else {
			sPar.div = dom.getElementById("f_div_date");
			sPar.photo = dom.getElementById("f_icon_all");
			sPar.CalendarClass = win.ClassFankCal_ag
		}
		if (_name == "all") {
			def_date_start = Array(dateHash.period_ls, dateHash.period_le);
			sPar.input = Array(dom.getElementById("input_all_start"), dom.getElementById("input_all_end"))
		} else if (_name == "f_all") {
			def_date_start = Array(dateHash.period_ls, dateHash.period_le);
			sPar.input = Array(dom.getElementById("f_input_all_start"), dom.getElementById("f_input_all_end"))
		}
		sPar.def_date = Array(par["date_start"], par["date_end"]);
		sPar.langx = top.langx;
		sPar.period_ls = dateHash.period_ls;
		sPar.WEB_TIME_ZONE = dateHash.WEB_TIME_ZONE;
		if (_name == "all") if (allDate == null) {
			allDate = new win.calendar_ag(win, dom);
			allDate.setParentclass(_self);
			allDate.init(sPar)
		} else allDate.restart();
		if (_name == "f_all") if (allDate == null) {
			allDate = new win.calendar_ag(win, dom);
			allDate.setParentclass(_self);
			allDate.init(sPar)
		} else allDate.restart()
	};
	_self.setSelectEvent = function() {
		for (var rtype in selObj) {
			var rDom_600 = dom.getElementById(rtype + "_div_600");
			util.addEvent(rDom_600, "change", _self.selChgEvent, {
				"rtype": rtype
			});
			var expectedElement = null;
			if (rtype == "date") {
				util.addEvent(rDom_600, "click", _self.hideCalEvent);
				var rDom = dom.getElementById("new_date_div");
				var expectedElement = dom.getElementById("new_date_div")
			} else var rDom = dom.getElementById(rtype + "_div");
			var rSel = dom.getElementById(rtype + "_sel");
			var ary = selObj[rtype];
			_self.setInfEvent(rDom, {
				"_focus": rSel,
				"_setView": rDom,
				"_viewClass": "--on",
				"expected": expectedElement
			});
			for (var i = 0; i < ary.length; i++) {
				var type = ary[i];
				var tmp_obj = dom.getElementById(rtype + "_" + type);
				util.addEvent(tmp_obj, "click", selectFun[rtype], {
					"rtype": rtype,
					"type": type
				})
			}
		}
		if (top.login_layer == postHash["view_layer"]) {
			dom.getElementById("account_div").classList.remove("--disabled");
			dom.getElementById("account_label_600").classList.remove("--disabled")
		} else {
			dom.getElementById("account_div").classList.add("--disabled");
			dom.getElementById("account_label_600").classList.add("--disabled")
		}
		util.addEvent(dom.getElementById("note_close_btn"), "click", _self.filterCancel);
		util.addEvent(dom.getElementById("filter_cancel"), "click", _self.filterCancel);
		util.addEvent(dom.getElementById("filter_clear"), "click", _self.filterClear);
		util.addEvent(dom.getElementById("filter_submit"), "click", _self.filterSubmit)
	};
	_self.selChgEvent = function(e, param) {
		param.type = e.target.value;
		if (param.rtype == "date") _self.chgDate(e, param);
		else _self.chgSel(e, param)
	};
	_self.chgSel = function(e, param) {
		var rtype = param.rtype;
		var type = param.type;
		selPar[rtype] = type;
		if (rtype == "date") {
			dom.getElementById("f_date_now").innerHTML = dom.getElementById(rtype + "_" + type).innerHTML;
			document.getElementById("f_date_now").setAttribute("style", "display:")
		} else if (rtype == "report_kind") selPar["result_type"] = "Y";
		else if (rtype == "result_type") selPar["report_kind"] = "A";
		var tmpRtype = rtype == "report_kind" ? "result_type": rtype;
		dom.getElementById(tmpRtype + "_now").innerHTML = dom.getElementById(tmpRtype + "_" + type).innerHTML;
		var sel_Now = dom.getElementById(tmpRtype + "_sel").getElementsByTagName("li");
		var sel_obj = tmpRtype + "_" + type;
		for (var i = 0; i < sel_Now.length; i++) sel_Now[i].classList.remove("--on");
		dom.getElementById(sel_obj).classList.add("--on");
		try {
			dom.getElementById(tmpRtype + "_div_600").value = type
		} catch(e) {
			util.err("[chgSel]" + tmpRtype + "_div_600" + type, e)
		}
		if (type != par[rtype] || lastResultType != null && type != lastResultType) {
			if (rtype == "result_type" && (type == "D" || type == "D4")) if (type == par["report_kind"]) return;
			dom.getElementById("filter_clear").disabled = false;
			dom.getElementById("filter_submit").disabled = false
		}
	};
	_self.chgDate = function(e, param) {
		util.echo("[" + classname + "][chgDate]" + param.type);
		var date_s = "";
		var date_e = "";
		switch (param.type) {
		case "yes":
			date_s = dateHash["yesterday"];
			date_e = dateHash["yesterday"];
			break;
		case "to":
			date_s = dateHash["today"];
			date_e = dateHash["today"];
			break;
		case "tm":
			date_s = dateHash["tomorrow"];
			date_e = dateHash["tomorrow"];
			break;
		case "tw":
			date_s = dateHash["this_week_s"];
			date_e = dateHash["this_week_e"];
			break;
		case "lw":
			date_s = dateHash["last_week_s"];
			date_e = dateHash["last_week_e"];
			break;
		case "tp":
			date_s = dateHash["period_s"];
			date_e = dateHash["period_e"];
			break;
		case "lp":
			date_s = dateHash["period_ls"];
			date_e = dateHash["period_le"];
			break
		}
		date_s = date_s.replace(/ /g, "");
		date_s = date_s.replace(/\-/g, "/");
		date_e = date_e.replace(/ /g, "");
		date_e = date_e.replace(/\-/g, "/");
		util.echo(date_s);
		util.echo(date_e);
		if (isPcUser) {
			dom.getElementById("input_all_start").value = date_s;
			dom.getElementById("input_all_end").value = date_e
		} else {
			dom.getElementById("f_input_all_start").value = date_s;
			dom.getElementById("f_input_all_end").value = date_e
		}
		_self.chgSel(e, param)
	};
	_self.choseDateEvent = function(param) {};
	_self.resizeEvent = function() {
		var resize_model = util_report.getReportModel(top.report_model, getView);
		if (now_model != resize_model) _self.getModel(false)
	};
	_self.getModel = function(needGet) {
		parentClass.dispatchEvent("showLoading", {
			"showLoading": true
		});
		var tmpParm = "";
		if (top.login_layer == postHash["view_layer"]) {
			var view_w = getView().viewportwidth;
			if (view_w < 1024 && useBigScreen != true) {
				par["report_type"] = "set";
				if (postHash["is_from_acc"]) tmpParm += "&is_from_acc=Y";
				if (postHash["from_acc_layer"]) tmpParm += "&from_acc_layer=" + postHash["from_acc_layer"]
			}
		} else if (postHash["is_from_acc"] != null) {
			var view_w = getView().viewportwidth;
			if (view_w < 1024) {
				par["report_type"] = "set";
				if (postHash["is_from_acc"] != null) tmpParm += "&is_from_acc=Y";
				if (postHash["from_acc_layer"] != null) tmpParm += "&from_acc_layer=" + postHash["from_acc_layer"]
			}
		}
		
		var param = new Object;
		param["page"] = "report_model";
		param["target"] = "div_model";
		param["retFun"] = function() {
			_self.getModelComplete(needGet)
		};
		param["post"] = "view_layer=" + postHash["view_layer"] + "&report_type=" + par["report_type"] + "&result_type=" + par["result_type"] + "&report_kind=" + par["report_kind"] + tmpParm;
		parentClass.dispatchEvent("goToPage", param)
	};
	_self.getModelComplete = function(needGet) {
		if (needGet) _self.getData();
		else _self.parseData(dataHash)
	};
	_self.getData = function() {
		_self.initReportTypeDiv();
		var param = "";
		param += top.param;
		if (par["account"] != "main" && top.login_layer == postHash["view_layer"]) {
			param += "&p=get_report_" + _self.getNextSubType(postHash["view_layer"]) + "_sub";
			param += "&show_account=" + par["account"];
			param += "&pay_type=" + top.pay_type
		} else param += "&p=get_report_" + postHash["view_layer"];
		if (postHash["url_param"]) param += "&" + postHash["url_param"];
		var tmpGtype = par["gtype"] == "ALL" ? "": par["gtype"];
		var tmpWtype = par["wtype"] == "ALL" ? "": par["wtype"];
		param += "&report_kind=" + par["report_kind"];
		param += "&result_type=" + par["result_type"];
		param += "&date_start=" + _self.dateFormat(par["date_start"]);
		param += "&date_end=" + _self.dateFormat(par["date_end"]);
		param += "&gtype=" + tmpGtype;
		param += "&wtype=" + tmpWtype;
		if (postHash["is_from_acc"] && postHash["view_id"]) param += "&view_id=" + postHash["view_id"];
		hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), postHash["chkFrame"]);
		hr.setParentclass(childClass);
		hr.addEventListener("onError", _self.onError);
		hr.addEventListener("LoadComplete", _self.LoadComplete);
		hr.loadURL(top.url, "POST", param);
		var p = "";
		if (par["report_kind"] == "A") p = par["result_type"] == "Y" ? "set": "un";
		else if (par["report_kind"] == "D") p = "cancel";
		else if (par["report_kind"] == "D4") p = "cancelD4";
		parentClass.dispatchEvent("chgPageName", {
			"pageType": "report",
			"pageName": p
		})
	};
	_self.onError = function() {};
	_self.LoadComplete = function(json) {
		var hash;
		try {
			hash = JSON.parse(json);
			if (util.chkErrorMsg(hash, LS_code)) return
		} catch(e) {
			util.err("[" + classname + "]", e);
			return
		}
		if (hash["status"] == "error") {
			util.showErrorMsg(hash["msg"]);
			_self.backPage()
		} else {
			dataHash = hash;
			_self.reSetLazy(hash["data"]["array"]["row0"]);
			_self.parseData(hash);
			pb_height = util.countPaddingPx(dom.getElementById("re_body"));
			footer_height = dom.getElementById("footer_show").clientHeight
		}
	};
	_self.getNextSubType = function(input) {
		return subTypeMap[input] || null
	};
	_self.backPage = function(e, param) {
		parentClass.dispatchEvent("backPage", {
			"retFun": _self.backPageComplete
		})
	};
	_self.backPageComplete = function() {};
	_self.parseData = function(hash) {
		try {
			var tmpWtype = par["wtype"] == "" ? "ALL": par["wtype"];
			var tmpGtype = par["gtype"] == "" ? "ALL": par["gtype"];
			var resultName = "";
			if (par["report_kind"] == "A") resultName = dom.getElementById("result_type_" + par["result_type"]).innerHTML;
			else resultName = dom.getElementById("report_kind_" + par["report_kind"]).innerHTML;
			dom.getElementById("result_name").innerHTML = resultName;
			par["date_start"] = par["date_start"].replace(/ /g, "");
			par["date_start"] = par["date_start"].replace(/\-/g, "/");
			par["date_end"] = par["date_end"].replace(/ /g, "");
			par["date_end"] = par["date_end"].replace(/\-/g, "/");
			dom.getElementById("sub_date").innerHTML = par["date_start"] + " ~ " + par["date_end"];
			dom.getElementById("sub_gtype").innerHTML = dom.getElementById("gtype_" + tmpGtype).innerHTML;
			if (top.login_layer == postHash["view_layer"]) dom.getElementById("sub_account").innerHTML = dom.getElementById("account_" + par["account"]).textContent
		} catch(e) {
			util.err("[" + classname + "]", e)
		}
		if (hash["status"] == "200") {
			row0 = hash["data"]["array"]["row0"];
			if (row0) {
				row0 = _self.sortData(row0, sort_type, sort_asc);
				var isDupLayer = postHash["from_acc_layer"] == postHash["view_layer"];
				now_model = util_report.getReportModel(top.report_model, getView, par["report_kind"], postHash["is_from_acc"], isDupLayer, useBigScreen);
				console.log("[" + classname + "][now_model]" + now_model);
				var modelObj = dom.getElementById(now_model);
				var showObj = dom.getElementById("div_show");
				showObj.setAttribute("class", modelObj.getAttribute("class"));
				modelObj.innerHTML = modelObj.innerHTML.replace(/\*LAYER_NAME\*/g, LS_report.get("report_layer_" + postHash["view_layer"]));
				if (postHash["view_layer"] == "mem") util.classFunc(dom.getElementById("div_show"), "mem");
				else util.classFunc(dom.getElementById("div_show"), "mem", "remove");
				var tpl = new fastTemplate_a1;
				tpl.init(modelObj.cloneNode(true));
				if (lazy_page == 1) {
					var totalData = hash["data"]["array"]["total"];
					if (typeof totalData != "undefined" && totalData !== null) {
						tpl.addBlock("total");
						for (var a = 0; a < totalAry.length; a++) {
							var keys = totalAry[a];
							if (totalData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), totalData[keys])
						}
						tpl.addBlock("total1");
						for (var a = 0; a < totalAry.length; a++) {
							var keys = totalAry[a];
							if (totalData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), totalData[keys])
						}
						tpl.addBlock("total2");
						for (var a = 0; a < totalAry.length; a++) {
							var keys = totalAry[a];
							if (totalData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), totalData[keys])
						}
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
				var tmpLoginLayer = postHash["is_from_acc"] && getView().viewportwidth < 1024 && isDupLayer ? postHash["from_acc_layer"] : top.login_layer;
				var s = 0;
				var e = 0;
				if (lazy_sw) {
					s = (lazy_page - 1) * lazy_count;
					e = lazy_page == lazy_total_page ? row0.length: lazy_page * lazy_count
				} else {
					s = 0;
					e = row0.length
				}
				for (var i = s; i < e; i++) {
					var row0Data = row0[i];
					tpl.addBlock("row0");
					var rAry = rowAry[tmpLoginLayer + "_" + par["result_type"] + "_" + par["report_type"]];
					if (par["report_kind"] == "D" || par["report_kind"] == "D4") rAry = rowAry[top.login_layer + "_N_" + par["report_type"]];
					for (var a = 0; a < rAry.length; a++) {
						var keys = rAry[a];
						if (postHash["view_layer"] != "mem") tpl.replace(new RegExp("\\\*MEMBER_CODE0\\\*", "gi"), "");
						if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys]);
						if (keys.indexOf("ID") != -1) idAry.push(row0Data[keys]) 

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
						if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys])
					}
				}
				if (lazy_page == 1) showObj.innerHTML = tpl.fastPrint();
				else if (now_model == "report_s_model") {
					var obj = showObj.children[0].children[0];
					obj.innerHTML += tpl.getBlock("row0")
				} else if (selPar["result_type"] == "Y" && selPar["view_layer"] != "list_bet") {
					var tmpObj = util.getObjAry(showObj, ",data_right_scroll,");
					var obj = tmpObj["data_right_scroll"].children[0];
					obj.innerHTML += tpl.getBlock("row0");
					var obj = tmpObj["data_right_scroll"].nextElementSibling;
					obj.innerHTML += tpl.getBlock("row1")
				} else {
					var obj = dom.getElementById("re_body_scroll").children[0].children[0].children[0];
					obj.innerHTML += tpl.getBlock("row0")
				}
				_self.showNodata(false);
				if (util.in_array(top.report_model, tmpModelAry)) _self.setCancelClick(cancelAry);
				if (top.report_model.indexOf("_ag_") != -1) _self.setPossessClick(possessAry);
				_self.setUserClick(hash["data"]["array"]["view_layer"]);
				_self.setSortClick(true);
				_self.setDetailClick(row0);
				_self.initScroll();
				if (postHash["view_layer"] == "list_bet") _self.hideLevel(showObj, disAry);
				if (par["account"] != "main" && top.login_layer == postHash["view_layer"]) {
					var tmpObj = dom.getElementById("subType_use01");
					var tmpObj2 = dom.getElementById("subType_use02");
					var tmpObjAry = Array(tmpObj, tmpObj2);
					for (var _tmpObj of tmpObjAry) if (_tmpObj) _tmpObj.classList.add("--subType");
					if (typeof dom.getElementById("total_count") != "undefined" && dom.getElementById("total_count") !== null) dom.getElementById("total_count").setAttribute("style", "display:none");
					var view_w = getView().viewportwidth;
					if (par["account"] == "all_account" && view_w < 1024) dom.getElementById("all_btn").setAttribute("style", "display:none")
				}
			} else _self.showNodata(true)
		} else if (hash["status"] == "error") util.showErrorMsg(hash["msg"]);
		else util.showErrorMsg("data error");
		_self.checkShowLazyLoading(dom.getElementById("ma_content"));
		_self.showSubMessage(hash["sub"]);
		_self.scroll_hor_event(dom.getElementById("re_body_scroll"), true);
		_self.scroll_ver_event(scroll_e, dom.getElementById("re_body"));
		_self.setLzayLoadingVisible(false);
		if (hash["status"] == "200" && lazy_page == 1) _self.copyData();
		parentClass.dispatchEvent("showLoading", {
			"showLoading": false
		});
		dom.getElementById("body_show").classList.add("body_pb");
		dom.getElementById("body_show").classList.add("--report")
	};
	_self.showSubMessage = function(hash) {
		if (!hash) return;
		if (hash["sub_message"] == "Y") {
			dom.getElementById("sub_message").style.display = "";
			dom.getElementById("sub_num").innerHTML = hash["sub_num"];
			dom.getElementById("total_num").innerHTML = hash["total_num"]
		} else dom.getElementById("sub_message").style.display = "none"
	};
	_self.getDisObj = function() {
		var disAry = new Object;
		disAry["com"] = top.login_layer == "co" ? "": "hide_item";
		disAry["co"] = disAry["com"];
		disAry["su"] = top.login_layer == "co" || top.login_layer == "su" ? "": "hide_item";
		return disAry
	};
	_self.hideLevel = function(showObj, disAry) {
		var titAry = util.getObjAry(showObj, ",title_com,title_co,title_su,");
		if (titAry["title_com"]) titAry["title_com"].style.display = disAry["com"] != "" ? "none": "";
		if (titAry["title_co"]) titAry["title_co"].style.display = disAry["co"] != "" ? "none": "";
		if (titAry["title_su"]) titAry["title_su"].style.display = disAry["su"] != "" ? "none": ""
	};
	_self.hideLevelAry = function(showObj, disAry) {
		for (var keys in disAry) if (disAry[keys] != "") {
			var ary = dom.getElementsByName("title_" + keys);
			for (var i = 0; i < ary.length; i++) ary[i].style.display = "none"
		}
	};
	_self.set_scroll_top = function() {
		util.echo("[report_index]set_scroll_top");
		if (lazy_page == 1) dom.getElementById("ma_content").scrollTop = 0
	};
	_self.set_scroll_left = function() {
		dom.getElementById("re_body_scroll").scrollLeft = scroll_left
	};
	_self.setPossessClick = function(ary) {
		for (var i = 0; i < ary.length; i++) {
			var _open = dom.getElementById("open_poss_" + ary[i]);
			if (_open != null) _open.style.display = "";
			var par = new Object;
			par.id = "box_poss_" + ary[i];
			par.target = "div_poss_" + ary[i];
			par.closeObj = "close_poss_" + ary[i];
			util.addEvent(_open, "click", _self.setPossess, par)
		}
	};
	_self.setPossess = function(e, _param) {
		var target = dom.getElementById(_param.target);
		if (target.children.length == 0) {
			var urlParams = "";
			var data_winloss = target.getAttribute("data-winloss");
			eval("data_winloss=" + data_winloss);
			urlParams += "uid=" + top.uid;
			urlParams += "&login_layer=" + top.login_layer;
			for (var k in data_winloss) urlParams += "&" + k + "=" + data_winloss[k];
			urlParams += "&date_start=" + _self.dateFormat(par["date_start"]);
			urlParams += "&date_end=" + _self.dateFormat(par["date_end"]);
			urlParams = "p=get_winloss_detail&ver=" + top.ver + "&" + urlParams;
			var getHTML = new HttpRequest;
			getHTML.addEventListener("onError", _self.onError);
			getHTML.addEventListener("LoadComplete", _self.buildPossess);
			getHTML.loadURL(top.url, "POST", urlParams)
		}
		var box_Obj = dom.getElementById(_param.id);
		if (!box_Obj.classList.contains("active")) _self.possess_open(box_Obj);
		else _self.possess_close(null, box_Obj)
	};
	_self.possess_open = function(do_Obj) {
		do_Obj.classList.add("active");
		possess_openAry[do_Obj.id] = do_Obj;
		isOpenPossess = true
	};
	_self.possess_close = function(evt, do_Obj) {
		do_Obj.classList.remove("active");
		delete possess_openAry[do_Obj.id];
		isOpenPossess = false
	};
	_self.possess_close_all = function() {
		for (var key in possess_openAry) _self.possess_close(null, possess_openAry[key])
	};
	_self.buildPossess = function(hash) {
		var dataAry = JSON.parse(hash);
		var winlossAry = dataAry["data"]["winloss_data"];
		var edit_model = dom.getElementById("edit_poss_container");
		var tpl = new fastTemplate_a1;
		tpl.init(edit_model.cloneNode(true));
		ary = new Array("WINLOSS0", "DATE0", "TIME0");
		for (var i = 0; i < winlossAry.length; i++) {
			tpl.addBlock("info");
			for (var a = 0; a < ary.length; a++) {
				var keys = ary[a];
				if (keys == "DATE0") tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), util.showTxt(_self.dateReplace(winlossAry[i][keys], "set")));
				else tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), util.showTxt(winlossAry[i][keys]))
			}
		}
		tpl.replace(new RegExp("\\\*" + "ID0" + "\\\*", "gi"), util.showTxt(dataAry["data"]["id"]));
		var showObj = dom.getElementById("div_poss_" + dataAry["data"]["id"]);
		showObj.innerHTML = tpl.fastPrint();
		util.addEvent(dom.getElementById("close_poss_" + dataAry["data"]["id"]), "click", _self.possess_close, dom.getElementById("box_poss_" + dataAry["data"]["id"]))
	};
	_self.setCancelClick = function(ary) {
		for (var i = 0; i < ary.length; i++) {
			var _div = dom.getElementById("open_anno_" + ary[i]);
			var par = new Object;
			par.isShow = true;
			par.id = "open_anno_" + ary[i];
			util.addEvent(_div, "click", _self.showCancel, par);
			var _close = dom.getElementById("close_anno_" + ary[i]);
			var par_close = new Object;
			par_close.isShow = false;
			par_close.id = "open_anno_" + ary[i];
			util.addEvent(_close, "click", _self.showCancel, par_close)
		}
	};
	_self.showCancel = function(e, par) {
		for (var i = 0; i < cancelAry.length; i++) dom.getElementById("open_anno_" + cancelAry[i]).classList.remove("active");
		if (par.isShow) {
			if (!dom.getElementById(par.id).classList.contains("active")) dom.getElementById(par.id).classList.add("active");
			isOpenCancel = true
		} else {
			if (dom.getElementById(par.id).classList.contains("active")) dom.getElementById(par.id).classList.remove("active");
			isOpenCancel = false
		}
	};
	_self.setUserClick = function(view_layer) {
		var objs = document.getElementsByName("user_btn");
		for (var i = 0; i < objs.length; i++) if (objs[i].innerHTML != "*NAME0*") _self.addUserClick(objs[i], objs[i].getAttribute("data-url"), view_layer);
		if (cookie.get("isclick") != null) _self.giveColor(objs)
	};
	_self.giveColor = function(objs) {
		var isclickarr = cookie.get("isclick").split("*");
		for (i = 0; i < objs.length; i++) {
			var url = objs[i].getAttribute("data-url");
			if (url.indexOf("sub_user_name") != -1) {
				var regex = new RegExp(` ( ^ |&) sub_user_name = ([ ^ &] * )`);
				var match = url.match(regex)
			} else {
				var _tmpViewLayer = postHash["view_layer"] + "_user";
				var regex = new RegExp(` ( ^ |&) $ {
					_tmpViewLayer
				} = ([ ^ &] * )`);
				var match = url.match(regex)
			}
			if (typeof match != "undefined" && match !== null) { 
				var substrMatch = match[0].substring(1);
				if (isclickarr.indexOf(substrMatch) >= 0) {
					var test = objs[i];
					test.classList.add("on")
				}
			}
		}
	};
	_self.addUserClick = function(obj, _post, view_layer) {
		var p = _post && _post.indexOf("*") == -1 ? _post: "";
		var hash = _self.coverToHash(_post);
		var pHash = new Object;
		pHash["report_kind"] = par["report_kind"];
		pHash["report_type"] = par["report_type"];
		pHash["result_type"] = par["result_type"];
		pHash["date"] = par["date"];
		pHash["date_start"] = par["date_start"];
		pHash["date_end"] = par["date_end"];
		pHash["gtype"] = par["gtype"];
		pHash["wtype"] = par["wtype"];
		pHash["view_layer"] = view_layer;
		pHash["account"] = par["account"];
		if (view_layer == "list_bet") pHash["username"] = obj.textContent;
		pHash["url_param"] = p;
		if (postHash["is_from_acc"] != null) pHash["is_from_acc"] = postHash["is_from_acc"];
		if (postHash["from_acc_layer"] != null) pHash["from_acc_layer"] = postHash["from_acc_layer"];
		var param = new Object;
		param["page"] = "report_" + view_layer;
		param["postHash"] = pHash;
		param["post"] = "view_layer=" + view_layer;
		param["extendsClass"] = "report_index";
		util.addEvent(obj, "click", _self.gotoNext, param)
	};
	_self.setSortClick = function(isSet) {
		var objs = document.getElementsByName("sort_btn");
		for (var i = 0; i < objs.length; i++) {
			var obj = objs[i];
			var tmp_sort = obj.getAttribute("data-sort");
			if (isSet) _self.addSortClick(obj, tmp_sort);
			obj.classList.remove("sort_up");
			obj.classList.remove("sort_down");
			if (sort_type == tmp_sort) {
				var sty = sort_asc ? "sort_down": "sort_up";
				obj.classList.add(sty)
			}
		}
	};
	_self.coverToHash = function(_post) {
		var hash = new Object;
		var tmp = _post.split("&");
		for (var i = 0; i < tmp.length; i++) {
			var t = tmp[i].split("=");
			hash[t[0]] = t[1]
		}
		return hash
	};
	_self.setDetailClick = function(dataAry) {
		for (var i = 0; i < dataAry.length; i++) {
			var _name = "";
			if (postHash["view_layer"] == "list_bet") {
				_name = "tid_" + dataAry[i]["WAGERS_ID"];
				util.addEvent(dom.getElementById(_name), "click", _self.viewDetail, dataAry[i])
			} else {
				_name = "accid_" + dataAry[i]["ID0"];
				util.addEvent(dom.getElementById(_name), "click", _self.viewAccDetail, dataAry[i])
			}
		}
	};
	_self.viewDetail = function(e, param) {
		try {
			if (e.target.id.indexOf("anno") != -1) return;
			if (isOpenCancel == true) return;
			_self.closeAccDetail();
			nowDetail = "tid_" + param["WAGERS_ID"];
			dom.getElementById(nowDetail).classList.add("tr_bgebf7ff")
		} catch(e) {}
		parentClass.dispatchEvent("showReportDetail", {
			"username": postHash["username"],
			"view_layer": postHash["view_layer"],
			"result_type": par["result_type"],
			"row0": param,
			"isFrom": "report_index"
		})
	};
	_self.viewAccDetail = function(e, param) {
		try {
			if (e.target.getAttribute("data-url") != null) return;
			if (e.target.id.indexOf("_poss_") != -1) return;
			if (isOpenPossess == true) return;
			_self.closeAccDetail();
			nowDetail = "accid_" + param["ID0"];
			dom.getElementById(nowDetail).classList.add("tr_bgebf7ff")
		} catch(e) {}
		var model_name = util_report.getReportModel(top.report_model, getView, par["report_kind"], postHash["is_from_acc"], null, useBigScreen);
		parentClass.dispatchEvent("showAccDetail", {
			"view_layer": postHash["view_layer"],
			"report_type": par["report_type"],
			"row0": param,
			"model": dom.getElementById(model_name).outerHTML,
			"isFrom": "report_index"
		})
	};
	_self.closeAccDetail = function() {
		if (dom.getElementById(nowDetail)) dom.getElementById(nowDetail).classList.remove("tr_bgebf7ff")
	};
	_self.addSortClick = function(obj, sort_type) {
		if (!sort_type) return;
		util.addEvent(obj, "click", _self.chgSortField, {
			"sort_type": sort_type
		})
	};
	_self.chgSortField = function(e, param) {
		if (sort_type == param.sort_type) sort_asc = !sort_asc;
		else {
			sort_type = param.sort_type;
			sort_asc = true
		}
		_self.setSortClick(false);
		_self.reSetLazy(dataHash["data"]["array"]["row0"]);
		_self.set_scroll_top();
		_self.parseData(dataHash)
	};
	_self.chgToArray = function(datas) {
		var data_ary = new Array;
		if (datas == null);
		else if (datas[0] == null) data_ary[data_ary.length] = datas;
		else data_ary = datas;
		return data_ary
	};
	_self.sortData = function(ary, types, up_down) {
		if (ary.length <= 1) return ary;
		var string_type = ",NAME0,ALIAS0,DATETIME,";
		if (string_type.indexOf(types) == -1) {
			var reTag = /<(?:.|\s)*?>/g;
			if (up_down) var sortfun = function(a, b) {
				var ret;
				a[types] = a[types] + "";
				b[types] = b[types] + "";
				var a_val = a[types].replace(/,/g, "").replace(reTag, "") * 1;
				var b_val = b[types].replace(/,/g, "").replace(reTag, "") * 1;
				if (isNaN(a_val)) a_val = 0;
				if (isNaN(b_val)) b_val = 0;
				ret = b_val - a_val;
				return ret
			};
			else var sortfun = function(a, b) {
				var ret;
				a[types] = a[types] + "";
				b[types] = b[types] + "";
				var a_val = a[types].replace(/,/g, "").replace(reTag, "") * 1;
				var b_val = b[types].replace(/,/g, "").replace(reTag, "") * 1;
				if (isNaN(a_val)) a_val = 0;
				if (isNaN(b_val)) b_val = 0;
				ret = a_val - b_val;
				return ret
			}
		} else if (up_down) var sortfun = function(a, b) {
			var ret;
			ret = b[types].localeCompare(a[types]);
			return ret
		};
		else var sortfun = function(a, b) {
			var ret;
			ret = a[types].localeCompare(b[types]);
			return ret
		};
		return ary.sort(sortfun)
	};
	_self.gotoNext = function(e, param, isFromLinkLayer = false) {
		_self.checkReport(_self.chg_page, param);
		if (isFromLinkLayer == false) _self.setPurple(param)
	};
	_self.setPurple = function(param) {
		var _tmpurl = param.postHash.url_param;
		if (_tmpurl.indexOf("sub_user_name") != -1) {
			var regex = new RegExp(` ( ^ |&) sub_user_name = ([ ^ &] * )`);
			var match = _tmpurl.match(regex)
		} else {
			var _tmpViewLayer = postHash["view_layer"] + "_user";
			var regex = new RegExp(` ( ^ |&) $ {
				_tmpViewLayer
			} = ([ ^ &] * )`);
			var match = _tmpurl.match(regex)
		}
		var substrMatch
		if (typeof match != "undefined" && match !== null) {
			substrMatch = match[0].substring(1);
		}
		if (substrMatch != null) if (cookie.get("isclick") == undefined) {
			cookie.set("isclick", "");
			cookie.set("isclick", substrMatch + "*" + cookie.get("isclick"))
		} else if (cookie.get("isclick").match(substrMatch) == null) cookie.set("isclick", substrMatch + "*" + cookie.get("isclick"))
	};
	_self.dateFormat = function(d) {
		d = d.replace(/ /g, "");
		d = d.replace(/\//g, "-");
		return d
	};
	_self.showDate = function(d) {
		var date = d;
		date = date.replace(/ /g, "");
		date = date.replace(/-/g, "-");
		return date
	};
	_self.checkReport = function(retFun, param) {
		lastResultType = selPar["result_type"];
		if (selPar["result_type"] == "D" || selPar["result_type"] == "D4") {
			selPar["report_kind"] = selPar["result_type"];
			selPar["result_type"] = "Y"
		}
		if (isPcUser) {
			selPar["date_start"] = _self.dateFormat(dom.getElementById("input_all_start").value);
			selPar["date_end"] = _self.dateFormat(dom.getElementById("input_all_end").value)
		} else {
			selPar["date_start"] = _self.dateFormat(dom.getElementById("f_input_all_start").value);
			selPar["date_end"] = _self.dateFormat(dom.getElementById("f_input_all_end").value)
		}
		var str = "";
		str += top.param;
		str += "&p=check_report";
		str += "&date_start=" + selPar["date_start"];
		str += "&date_end=" + selPar["date_end"];
		str += "&result_type=" + selPar["result_type"];
		str += "&report_kind=" + selPar["report_kind"];
		str += "&account=" + selPar["account"];
		hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), postHash["chkFrame"]);
		hr.setParentclass(childClass);
		hr.addEventListener("onError",
		function() {});
		hr.addEventListener("LoadComplete",
		function(json) {
			var hash;
			try {
				hash = JSON.parse(json);
				if (util.chkErrorMsg(hash, LS_code)) return
			} catch(e) {
				util.err("[" + classname + "]", e);
				return
			}
			if (hash["status"] == "200") {
				par = util.clone(selPar);
				retFun(param)
			} else {
				selPar = util.clone(par);
				if (par["report_kind"] == "A") _self.chgSel(null, {
					"rtype": "result_type",
					"type": par["result_type"]
				});
				else _self.chgSel(null, {
					"rtype": "report_kind",
					"type": par["report_kind"]
				});
				_self.chgSel(null, {
					"rtype": "gtype",
					"type": par["gtype"]
				});
				_self.chgSel(null, {
					"rtype": "wtype",
					"type": par["wtype"]
				});
				util.showErrorMsg(hash["msg"])
			}
		});
		hr.loadURL(top.url, "POST", str)
	};
	_self.chg_page = function(param) {
		_self.chgPage(null, param)
	};
	_self.chgPage = function(e, param) {
		if (postHash["is_from_acc"]) {
			var clonePostHash = util.clone(param["postHash"]);
			clonePostHash["chkFrame"] = postHash["chkFrame"];
			param["target"] = "div_acc_report";
			param["retFun"] = parentClass.loadSubFrame;
			param["postHash"] = clonePostHash;
			parentClass.dispatchEvent("goToPage", param)
		} else parentClass.dispatchEvent("bodyGoToPage", param)
	};
	_self.chgReportType = function(e, param) {
		par["report_type"] = param.type;
		selPar["report_type"] = param.type;
		_self.initReportType();
		_self.getModel(true)
	};
	_self.initReportType = function() {
		for (var i = 0; i < reportTypeAry.length; i++) {
			var _name = reportTypeAry[i];
			dom.getElementById(_name + "_btn").classList.remove("on")
		}
		dom.getElementById(par["report_type"] + "_btn").classList.add("on")
	};
	_self.setColumn = function(_totalAry, _rowAry, _tfootAry) {
		excel_totalAry = _totalAry;
		excel_rowAry = _rowAry;
		excel_tfootAry = _tfootAry
	};
	_self.exportExcel = function(e, param) {
		var param = new Object;
		param["page"] = "report_excel";
		param["target"] = "excel_model";
		param["useDefineParent"] = "Y";
		param["parentClass"] = _self;
		param["retFun"] = _self.openExcelDivComplete;
		param["retParam"] = dataHash;
		parentClass.dispatchEvent("goToPage", param)
	};
	_self.copyData = function(e, param) {
		var param = new Object;
		param["page"] = "report_excel";
		param["target"] = "excel_model";
		param["useDefineParent"] = "Y";
		param["parentClass"] = _self;
		param["retFun"] = _self.copyDataComplete;
		param["retParam"] = dataHash;
		parentClass.dispatchEvent("goToPage", param)
	};
	_self.copyDataComplete = function(hash) {
		if (par["account"] != "main" && top.login_layer == postHash["view_layer"]) var now_model = "report_" + postHash["view_layer"] + "_sub_excel";
		else var now_model = "report_" + postHash["view_layer"] + "_excel";
		var modelObj = dom.getElementById(now_model);
		var showObj = dom.getElementById("myText");
		var tpl = new fastTemplate_a1;
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
					if (totalData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), totalData[keys])
				}
				tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
				tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
				tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"]);
				for (var i = 0; i < excel_row0.length; i++) {
					var row0Data = excel_row0[i];
					var isP = row0Data["IS_P"] != null && row0Data["IS_P"] != "";
					if (isP) for (var k = 0; k < row0Data["TNAME_P"].length; k++) {
						tpl.addBlock("row0");
						var rAry = excel_rowAry[tmpLoginLayer];
						for (var a = 0; a < rAry.length; a++) {
							var keys = rAry[a];
							if (k == 0) {
								if (keys == "IS_P" && row0Data[keys] != "") {
									var parlay_count = row0Data["TNAME_P"].length;
									row0Data[keys] = row0Data[keys] + "<br>(" + parlay_count + " " + LS_report.get("parlay_selection") + ")"
								}
							} else row0Data[keys] = "";
							var parlayData = row0Data["TNAME_P"][k];
							if (keys == "TNAME") {
								var par_model = dom.getElementById("parlay_detail_model");
								var tmp = par_model.cloneNode(true);
								var tmpAry = new Array("DATE", "WAGERS_TYPE", "LEAGUE", "TEAM_H", "CON_H", "TEAM_C", "CON_C", "NUM_H", "NUM_C", "ORDER_TYPE", "ORDER_CON", "IORATIO");
								for (var p = 0; p < tmpAry.length; p++) {
									var par_key = tmpAry[p];
									if (parlayData["STRONG"] == "Y") if (parlayData["BET_TYPE"] == "H") {
										parlayData["CON_H"] = parlayData["CON"];
										parlayData["CON_C"] = ""
									} else {
										parlayData["CON_C"] = parlayData["CON"];
										parlayData["CON_H"] = ""
									} else if (parlayData["STRONG"] == "N") {
										if (parlayData["BET_TYPE"] == "H") {
											parlayData["CON_C"] = parlayData["CON"];
											parlayData["CON_H"] = ""
										} else {
											parlayData["CON_H"] = parlayData["CON"];
											parlayData["CON_C"] = ""
										}
										parlayData["ORDER_CON"] = ""
									}
									if (parlayData[par_key] != null) tmp.innerHTML = tmp.innerHTML.replace(new RegExp("\\\*" + par_key + "\\\*", "gi"), parlayData[par_key])
								}
								row0Data[keys] = tmp.innerHTML
							} else if (keys == "RESULT_WL") {
								var tmp_data = par["result_type"] == "N" ? "_": parlayData[keys];
								row0Data[keys] = tmp_data
							}
							if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys])
						}
						tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
						tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
						tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"])
					} else {
						tpl.addBlock("row0");
						var rAry = excel_rowAry[tmpLoginLayer];
						for (var a = 0; a < rAry.length; a++) {
							var keys = rAry[a];
							if (keys == "RESULT_WL") {
								var tmp_data = par["result_type"] == "N" ? "_": row0Data[keys];
								row0Data[keys] = tmp_data
							}
							if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys])
						}
						tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
						tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
						tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"])
					}
				}
				showObj.innerHTML = tpl.fastPrint()
			}
		}
		if (postHash["view_layer"] == "list_bet") _self.hideLevel(showObj, disAry);
		_self.hideLevelAry(showObj, disAry);
		var param = new Array;
		var adiv = dom.createElement("div");
		var tmpDiv = dom.getElementById("myText").cloneNode(true);
		tmpDiv = _self.removeHideDiv(tmpDiv);
		var tmp_html = tmpDiv.innerHTML;
		adiv.innerHTML = tmp_html
	};
	_self.copyTable = function() {
		var el = dom.getElementById("myText");
		el.style.display = "";
		var range = dom.createRange();
		range.selectNodeContents(el);
		var sel = window.getSelection();
		sel.removeAllRanges();
		sel.addRange(range);
		document.execCommand("copy");
		sel.empty();
		el.style.display = "none";
		parentClass.dispatchEvent("showFadeOutMesg", {
			"text": LS.get("str_copied"),
			"s": 1,
			"showCopy": "N",
			"value": ""
		})
	};
	_self.openExcelDivComplete = function(hash) {
		if (par["account"] != "main" && top.login_layer == postHash["view_layer"]) var now_model = "report_" + postHash["view_layer"] + "_sub_excel";
		else var now_model = "report_" + postHash["view_layer"] + "_excel";
		util.echo("[report_excel][now_model]" + now_model);
		var modelObj = dom.getElementById(now_model);
		var showObj = dom.getElementById("excel_show");
		var tpl = new fastTemplate_a1;
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
					if (totalData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), totalData[keys])
				}
				tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
				tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
				tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"]);
				var tfootData = hash["data"]["array"]["tfoot"];
				if (tfootData && excel_tfootAry) {
					tpl.addBlock("tfoot");
					for (var a = 0; a < excel_tfootAry.length; a++) {
						var keys = excel_tfootAry[a];
						if (tfootData[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), tfootData[keys])
					}
				}
				for (var i = 0; i < excel_row0.length; i++) {
					var row0Data = excel_row0[i];
					var isP = row0Data["IS_P"] != null && row0Data["IS_P"] != "";
					if (isP) for (var k = 0; k < row0Data["TNAME_P"].length; k++) {
						tpl.addBlock("row0");
						var rAry = excel_rowAry[tmpLoginLayer];
						for (var a = 0; a < rAry.length; a++) {
							var keys = rAry[a];
							if (k == 0) {
								if (keys == "IS_P" && row0Data[keys] != "") {
									var parlay_count = row0Data["TNAME_P"].length;
									row0Data[keys] = row0Data[keys] + "<br>(" + parlay_count + " " + LS_report.get("parlay_selection") + ")"
								}
							} else row0Data[keys] = "";
							var parlayData = row0Data["TNAME_P"][k];
							if (keys == "TNAME") {
								var par_model = dom.getElementById("parlay_detail_model");
								var tmp = par_model.cloneNode(true);
								var tmpAry = new Array("DATE", "WAGERS_TYPE", "LEAGUE", "TEAM_H", "CON_H", "TEAM_C", "CON_C", "NUM_H", "NUM_C", "ORDER_TYPE", "ORDER_CON", "IORATIO");
								for (var p = 0; p < tmpAry.length; p++) {
									var par_key = tmpAry[p];
									if (parlayData["STRONG"] == "Y") if (parlayData["BET_TYPE"] == "H") {
										parlayData["CON_H"] = parlayData["CON"];
										parlayData["CON_C"] = ""
									} else {
										parlayData["CON_C"] = parlayData["CON"];
										parlayData["CON_H"] = ""
									} else if (parlayData["STRONG"] == "N") {
										if (parlayData["BET_TYPE"] == "H") {
											parlayData["CON_C"] = parlayData["CON"];
											parlayData["CON_H"] = ""
										} else {
											parlayData["CON_H"] = parlayData["CON"];
											parlayData["CON_C"] = ""
										}
										parlayData["ORDER_CON"] = ""
									}
									if (parlayData[par_key] != null) tmp.innerHTML = tmp.innerHTML.replace(new RegExp("\\\*" + par_key + "\\\*", "gi"), parlayData[par_key])
								}
								row0Data[keys] = tmp.innerHTML
							} else if (keys == "RESULT_WL") {
								var tmp_data = par["result_type"] == "N" ? "_": parlayData[keys];
								row0Data[keys] = tmp_data
							}
							if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys])
						}
						tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
						tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
						tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"])
					} else {
						tpl.addBlock("row0");
						var rAry = excel_rowAry[tmpLoginLayer];
						for (var a = 0; a < rAry.length; a++) {
							var keys = rAry[a];
							if (keys == "RESULT_WL") {
								var tmp_data = par["result_type"] == "N" ? "_": row0Data[keys];
								row0Data[keys] = tmp_data
							}
							if (row0Data[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), row0Data[keys])
						}
						tpl.replace(new RegExp("\\\*DIS_COM\\\*", "gi"), disAry["com"]);
						tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
						tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"])
					}
				}
				showObj.innerHTML = tpl.fastPrint()
			}
		}
		if (postHash["view_layer"] == "list_bet") _self.hideLevel(showObj, disAry);
		_self.hideLevelAry(showObj, disAry);
		var param = new Array;
		var adiv = dom.createElement("div");
		var tmpDiv = dom.getElementById("excel_show").cloneNode(true);
		tmpDiv = _self.removeHideDiv(tmpDiv);
		var tmp_html = tmpDiv.innerHTML;
		tmp_html = tmp_html.replace("<table", '<table border="1" cellspacing="0" bordercolor="#66666" ');
		tmp_html = tmp_html.replace("<td", '<td style="collapse;border:1px solid black;" ');
		adiv.innerHTML = tmp_html;
		param["mydata"] = adiv.innerHTML;
		param["filename"] = par["date_start"] + "~" + par["date_end"];
		param["p"] = "transExcel";
		_self.post_to_url(top.url, param)
	};
	_self.removeHideDiv = function(div) {
		var ary = div.children;
		_self.remove_hide_div(ary);
		return div
	};
	_self.remove_hide_div = function(ary) {
		var len = ary.length;
		for (var i = 0; i < len; i++) {
			var obj = ary[i];
			if (obj.style.display == "none" || obj.className == "hide_item") {
				obj.parentNode.removeChild(obj);
				len--;
				i--
			} else if (obj.children.length > 0) _self.remove_hide_div(obj.children)
		}
	};
	_self.post_to_url = function(paths, params) {
		var form = document.createElement("form");
		form.setAttribute("method", "post");
		form.setAttribute("action", paths);
		form.setAttribute("target", "_top");
		for (var keys in params) {
			var hiddenField = document.createElement("input");
			hiddenField.setAttribute("type", "hidden");
			hiddenField.setAttribute("name", keys);
			hiddenField.setAttribute("value", params[keys]);
			form.appendChild(hiddenField)
		}
		document.body.appendChild(form);
		form.submit();
		_self.removeSelf(form)
	};
	_self.removeSelf = function(dom) {
		var _pNode = dom.parentNode;
		_pNode.removeChild(dom)
	};
	_self.get_index = function(ary, txt) {
		for (var i = 0; i < ary.length; i++) if (ary[i] == txt) return i;
		return - 1
	};
	_self.initChooseName = function() {
		if (postHash["url_param"]) {
			var hash = new Object;
			var tmp = postHash["url_param"].split("&");
			for (var i = 0; i < tmp.length; i++) {
				var t = tmp[i].split("=");
				hash[t[0]] = t[1]
			}
			hash["main_user"] = "main";
			var ary = new Array("main", "co", "su", "ag", "mem");
			var _view = false;
			var acc_layer = _self.get_index(ary, postHash["from_acc_layer"]);
			var view_layer = _self.get_index(ary, postHash["view_layer"]);
			var _show = false;
			for (var j = 0; j < ary.length; j++) {
				_show = false;
				var layer = ary[j] + "_user";
				var obj = dom.getElementById(layer);
				if (postHash["is_from_acc"]) {
					if (acc_layer != view_layer && (j >= acc_layer && (j < view_layer || view_layer == -1))) _show = true;
					if (layer != "main_user") if (hash[layer] && _show) {
						if (layer == "mem_user" && postHash["username"]) obj.innerHTML = postHash["username"];
						else obj.innerHTML = hash[layer];
						obj.style.display = "";
						util.addEvent(obj, "click", _self.linkLayer, {
							"view_layer": ary[j]
						})
					} else {
						obj.style.display = "none";
						util.removeEvent(obj, "click", _self.linkLayer)
					} else obj.style.display = "";
					if (layer == "co_user") {
						obj.style.display = "none";
						util.removeEvent(obj, "click", _self.linkLayer)
					}
				} else {
					if (postHash["view_layer"] == ary[j]) _view = true;
					if (hash[layer] && !_view) {
						if (layer != "main_user") if (layer != "mem_user") if (hash["sub_user_name"] != null && ary[j] == top.login_layer) obj.innerHTML = hash["sub_user_name"];
						else obj.innerHTML = hash[layer];
						else if (postHash["username"]) obj.innerHTML = postHash["username"];
						else obj.innerHTML = hash[layer];
						obj.style.display = "";
						if (ary[j] != "mem") if (ary[j] == "main") util.addEvent(obj, "click", _self.linkLayer, {
							"view_layer": top.login_layer
						});
						else util.addEvent(obj, "click", _self.linkLayer, {
							"view_layer": ary[j + 1]
						})
					} else {
						obj.style.display = "none";
						util.removeEvent(obj, "click", _self.linkLayer)
					}
				}
			}
		}
		if (postHash["is_from_acc"]) dom.getElementById("main_user").innerHTML = LS.get("acc_main_user");
		else dom.getElementById("main_user").innerHTML = LS.get("main_user");
		if (postHash["view_layer"] == null) postHash["view_layer"] = "main";
		_self.setBreadClass(postHash["view_layer"])
	};
	_self.setBreadClass = function(view_layer) {
		if (!postHash["from_acc_layer"]) {
			var useClassAry = new Array("main", "co", "su", "ag", "mem", "list_bet");
			for (var c = 0; c < useClassAry.length; c++) {
				if (useClassAry[c] != "list_bet") {
					var layer = useClassAry[c] + "_user";
					dom.getElementById(layer).classList.remove("--on")
				}
				if (top.login_layer == view_layer) dom.getElementById("main_user").classList.add("--on");
				else if (view_layer == useClassAry[c]) dom.getElementById(useClassAry[c - 1] + "_user").classList.add("--on")
			}
		} else dom.getElementById("main_user").classList.add("--on")
	};
	_self.gotoReportMain = function(e, param) {
		parentClass.dispatchEvent("bodyGoToPage", param)
	};
	_self.linkLayer = function(e, param) {
		var pHash = new Object;
		pHash["report_kind"] = par["report_kind"];
		pHash["report_type"] = par["report_type"];
		pHash["result_type"] = par["result_type"];
		pHash["date_start"] = par["date_start"];
		pHash["date_end"] = par["date_end"];
		pHash["gtype"] = par["gtype"];
		pHash["wtype"] = par["wtype"];
		pHash["view_layer"] = param["view_layer"];
		pHash["account"] = par["account"];
		if (param["view_layer"] == top.login_layer) {
			var delUrlParams = new URLSearchParams(postHash["url_param"]);
			delUrlParams.delete("manager_uid");
			delUrlParams.delete("sub_user_id");
			delUrlParams.delete("sub_user_name");
			pHash["url_param"] = delUrlParams.toString()
		} else pHash["url_param"] = postHash["url_param"];
		if (postHash["is_from_acc"] != null) pHash["is_from_acc"] = postHash["is_from_acc"];
		if (postHash["from_acc_layer"] != null) pHash["from_acc_layer"] = postHash["from_acc_layer"];
		var parObj = new Object;
		parObj["page"] = "report_" + param["view_layer"];
		parObj["postHash"] = pHash;
		parObj["post"] = "view_layer=" + param["view_layer"];
		parObj["extendsClass"] = "report_index";
		_self.gotoNext(null, parObj, true)
	};
	_self.showNodata = function(isShow) {
		dom.getElementById("div_show").style.display = isShow ? "none": "";
		dom.getElementById("nodata_show").style.display = isShow ? "": "none"
	};
	_self.addEventListener = function(eventname, eventFunction) {
		eventHandler[eventname] = eventFunction
	};
	_self.dispatchEvent = function(eventname, param) {
		if (eventHandler[eventname]) eventHandler[eventname](param)
	};
	_self.setRtypeLis = function(evt, param) {
		var DOM = evt.target;
		var clas = param["className"];
		var DOMClassVal = DOM.classList.value || DOM.className;
		if (DOM.tagName == "INPUT") {
			if (DOM.type == "button") document.getElementById("searchWtype").focus()
		} else document.getElementById("focusBtn").focus();
		if (DOM.tagName == "DIV") {
			if (DOM.className.indexOf("re_sreachitem") == -1 && DOM.className.indexOf("re_sreachitem_title") == -1) return;
			if (DOM.className.indexOf("re_sreachitem_title") != -1) DOM = DOM.parentElement;
			displayWtype = false;
			var claName = DOM.classList.value || DOM.className;
			_self.chkActive(DOM.classList, claName, "active");
			return
		}
		if (DOM.tagName == "SPAN") {
			DOM = DOM.parentElement;
			if (DOM.className.indexOf("re_sreachitem_title") != -1) DOM = DOM.parentElement;
			displayWtype = false;
			var claName = DOM.classList.value || DOM.className;
			_self.chkActive(DOM.classList, claName, "active");
			return
		}
		if (DOM.tagName == "LI" && DOMClassVal == "") {
			param.InnerText.innerHTML = DOM.innerHTML;
			var wtypeIdSplit = DOM.id.split("_");
			selPar["wtype"] = wtypeIdSplit[wtypeIdSplit.length * 1 - 1];
			displayWtype = true
		}
		_self.vanishWtype("active")
	};
	_self.vanishWtype = function(clasName) {
		var view = dom.getElementById("wtype_div");
		if (displayWtype) {
			view.classList.remove(clasName);
			_self.closeAllWtype_list(clasName)
		}
	};
	_self.setMouseLeave = function(e) {
		inWtype = true
	};
	_self.setMouseIn = function(e) {
		inWtype = false
	};
	_self.hideWtypeSel = function(evt, param) {
		if (!param.view || !param.className) return;
		var DOM = evt.target;
		if (inWtype) {
			param.view.classList.remove(param.className);
			_self.closeAllWtype_list(param.className)
		}
	};
	_self.chkActive = function(domcls, val, classStr) {
		if (classStr == "") return;
		if (val.indexOf(classStr) != -1) domcls.remove(classStr);
		else domcls.add(classStr);
		if (val.indexOf("re_sreachitem") != -1) _self.closeAllWtype_list(classStr);
		return
	};
	_self.closeAllWtype_list = function(clasName) {
		var aryDom = document.getElementsByName("wtype_list");
		for (var i = 0,
		len = aryDom.length; i < len; i++) aryDom[i].classList.remove(clasName);
		dom.getElementById("searchWtype").value = "";
		_self.recoveyDispalyWtype()
	};
	_self.setInfEvent = function(icon, param) {
		param.info_mode != false ? param.info_mode = true: param.info_mode = false;
		param._focus.prev_scroll_lock = true;
		util.addEvent(icon, "click", _self.showInfEvent, {
			"icon": icon,
			"param": param
		})
	};
	_self.showInfEvent = function(e, _par) {
		var icon = _par.icon;
		var param = _par.param;
		if (param.expected != null || param.expected != undefined) if (e.target != param.expected) return;
		var all = param._focus.getElementsByTagName("*");
		for (var i = 0,
		max = all.length; i < max; i++) if (all[i] == e.target) return false;
		if (e.target == param._focus) return false;
		var top_node = util.getTopParentNode(param._focus, "DIV");
		if (param._setView.classList.contains(param._viewClass)) {
			param._setView.classList.remove(param._viewClass);
			if (param.info_mode) util.removeEvent(param._focus, "click");
			util.removeEvent(top_node, "mousedown");
			util.removeEvent(top_node, "touchstart")
		} else {
			param._setView.classList.add(param._viewClass);
			if (param.info_mode) util.addEvent(param._focus, "click", _self.closeInfElmt, param);
			util.addEvent(top_node, "mousedown", _self.InfBlurEvent, _par);
			util.addEvent(top_node, "touchstart", _self.InfBlurEvent, _par);
			param._focus.scrollTop = 0
		}
	};
	_self.InfBlurEvent = function(e, _par) {
		var icon = _par.icon;
		var param = _par.param;
		var mouseIN = false;
		var all = param._focus.getElementsByTagName("*");
		for (var i = 0,
		max = all.length; i < max; i++) if (all[i] == e.target) mouseIN = true;
		if (param._focus == e.target) mouseIN = true;
		if (e.target.id != "icon_all") setTimeout(function() {
			_mc["date_now"].setAttribute("style", "display:")
		},
		100);
		if (!mouseIN) {
			var all = icon.getElementsByTagName("*");
			for (var i = 0,
			max = all.length; i < max; i++) if (all[i] == e.target) return false;
			if (e.target == icon) return false;
			_self.closeInfElmt(null, param)
		}
	};
	_self.closeInfElmt = function(e, param) {
		dom.activeElement.blur();
		if (param._setView.classList.contains(param._viewClass)) param._setView.classList.remove(param._viewClass);
		if (param._focus != null) {
			util.removeEvent(param._focus, "click");
			var top_node = util.getTopParentNode(param._focus, "DIV");
			if (top_node != null) {
				util.removeEvent(top_node, "mousedown");
				util.removeEvent(top_node, "touchstart")
			}
		}
	};
	_self.hideCalEvent = function(evt) {
		allDate.blurEvent();
		if (!isPcUser) document.getElementById("f_date_now").setAttribute("style", "display:")
	};
	_self.cleanTextEvent = function(evt, param) {
		param.dom.value = "";
		param.dom.focus();
		_self.recoveyDispalyWtype()
	};
	_self.serchSelEvent = function(evt, param) {
		var DOM = evt.target;
		if (DOM.tagName == "LI") {
			selPar["wtype"] = DOM.id.split("_")[1];
			dom.getElementById("wtype_div").classList.remove(param.className);
			_self.recoveyDispalyWtype();
			dom.getElementById("wtype_now").innerHTML = DOM.innerHTML;
			dom.getElementById("searchWtype").value = ""
		}
	};
	_self.changeSearchText = function(evt, param) {
		var DOM = evt.target;
		var searchStr = DOM.value;
		if (searchStr == "") _self.recoveyDispalyWtype();
		else {
			var allULWtype = document.getElementById("allULWtype");
			var wtypeLIId = allULWtype.getElementsByTagName("LI");
			for (var i = 0,
			len = wtypeLIId.length; i < len; i++) {
				var targerDOMid = wtypeLIId[i].textContent.toLowerCase();
				var vanishLI = "none";
				if (targerDOMid.indexOf(searchStr) != -1) vanishLI = "";
				wtypeLIId[i].style.display = vanishLI
			}
		}
	};
	_self.recoveyDispalyWtype = function() {
		var allULWtype = document.getElementById("allULWtype");
		var wtypeLIId = allULWtype.getElementsByTagName("LI");
		for (var i = 0,
		len = wtypeLIId.length; i < len; i++) wtypeLIId[i].style.display = ""
	};
	_self.exitEvent = function() {
		clearTimeout(retryTimer);
		_self.setLzayLoadingVisible(false);
		util.removeEvent(dom.getElementById("ma_content"), "scroll");
		dom.getElementById("body_show").classList.add("--report");
		parentClass.dispatchEvent("showCenterDiv", false);
		return true
	};
	_self.getSubAccount = function() {
		var par = "";
		par += "uid=" + top.uid;
		par += "&user_name=";
		par += "&login_layer=" + top.login_layer;
		par += "&sort_type=asc";
		par += "&sort_name=username";
		par = "p=get_acc_sub_list&ver=" + top.ver + "&" + par;
		var getHTML = new HttpRequest;
		getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete", _self.getSubAccComplete);
		getHTML.loadURL(top.url, "POST", par)
	};
	_self.getSubAccComplete = function(data) {
		var arr_data = JSON.parse(data);
		var accountAry = arr_data.account;
		var accSelObj = dom.getElementById("account_sel");
		var accSelObj_600 = dom.getElementById("account_div_600");
		accSelObj.parentNode.replaceChild(originalAccountSel.cloneNode(true), accSelObj);
		accSelObj_600.parentNode.replaceChild(originalAccountSel_600.cloneNode(true), accSelObj_600);
		for (var i = 0; i < accountAry.length; i++) {
			var accObj = document.createElement("li");
			var accObj_600 = document.createElement("option");
			accObj.innerHTML = accountAry[i]["username"];
			accObj_600.innerHTML = accountAry[i]["username"];
			accObj.id = "account_" + accountAry[i]["id"];
			accObj_600.id = "account_" + accountAry[i]["id"];
			accObj_600.value = accountAry[i]["id"];
			selObj["account"].push(accountAry[i]["id"]);
			dom.getElementById("account_sel").appendChild(accObj);
			dom.getElementById("account_div_600").appendChild(accObj_600)
		}
		dom.getElementById("account_div").setAttribute("style", "display:");
		dom.getElementById("account_label_600").setAttribute("style", "display:");
		if (isInitAccSelect) {
			_self.chgSel(null, {
				"rtype": "account",
				"type": par["account"]
			});
			isInitAccSelect = false
		} else _self.chgSel(null, {
			"rtype": "account",
			"type": selPar["account"]
		});
		_self.setSelectEvent()
	}
};