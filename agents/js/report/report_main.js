function report_main(_win, _dom) {
	var _self = this;
	var win = _win;
	var dom = _dom;
	var parentClass;
	var classname = "report_main";
	var util;
	var LS;
	var LS_code;
	var cookie;
	var config_set;
	var fastTemplate_a1;
	var eventHandler = new Object;
	var par = new Object;
	var quickSearchPar = null;
	var selObj = new Object;
	selObj["result_type"] = new Array("Y", "N", "D", "D4");
	selObj["date"] = new Array("yes", "to", "tm", "tw", "lw", "tp", "lp");
	selObj["account"] = new Array("main", "all_account");
	var selectFun = new Object;
	var dateHash = new Object;
	var currencyHash = new Object;
	var showAllAry = new Array("summary", "period", "exchange");
	var displayWtype = null;
	var inWtype = null;
	var allDate = null;
	var game_ary = new Array("today", "yesterday");
	var _mc = new Object;
	var period_ary = new Array;
	var hr = null;
	var Storage;
	var use_Storage_code = ",turnover,winloss,top10,possess,members,turnover,winloss,";
	var arr_Top10_types = {
		"win": [1, 2, 3],
		"loss": [1, 2, 3],
		"winInside": [1, 2, 3],
		"lossInside": [1, 2, 3]
	};
	var set_Top10_types = {
		"win": 1,
		"loss": 1,
		"winInside": 1,
		"lossInside": 1
	};
	var set_Top10_kind = "all";
	var is_outside_Top10 = true;
	var storage_uid = top.uid;
	var dashHash = new Object;
	var arr_ChartData = {
		"turnover": {
			"status": false,
			"chartdata": new Object
		},
		"winloss": {
			"status": false,
			"chartdata": new Object
		}
	};
	var showWinLoss_mode = "mem";
	var chart_mode_arr = ["mem", "ag"];
	var nowTurnOver = "tp";
	var nowWinLoss = "tp";
	var nowPossess = "tp";
	var nowMembers = "tp";
	var WL_mode_arr = ["mem", "ag"];
	var isPcUser;
	_self.init = function() {
		util.echo("report_main load complete");
		parentClass.dispatchEvent("chgLeftMenuColor", {
			"target": "report"
		});
		selObj["gtype"] = config_set.get("REPORT_GTYPE");
		dom.getElementById("body_show").classList.add("bgf0f0f0");
		var obj_ids = ",yes_Y,to_Y,tw_Y,lw_Y,to_N,";
		var tmp_obj = util.getObjAry(dom, obj_ids);
		for (var obj in tmp_obj) util.addEvent(tmp_obj[obj], "click", _self.quickBtnSearch, {
			"param": obj
		});
		obj_ids = ",div_quick_title,type_quick_scroll,div_type_title,type_title_scroll,div_summary_title,summary_title_scroll,";
		tmp_obj = util.getObjAry(dom, obj_ids);
		util.addEvent(tmp_obj["type_quick_scroll"], "scroll", _self.roll, {
			"chk_obj": tmp_obj["type_quick_scroll"],
			"do_obj": tmp_obj["div_quick_title"]
		});
		util.addEvent(tmp_obj["type_title_scroll"], "scroll", _self.roll, {
			"chk_obj": tmp_obj["type_title_scroll"],
			"do_obj": tmp_obj["div_type_title"]
		});
		util.addEvent(tmp_obj["summary_title_scroll"], "scroll", _self.roll, {
			"chk_obj": tmp_obj["summary_title_scroll"],
			"do_obj": tmp_obj["div_summary_title"]
		});
		obj_ids = ",today_date,today_date_inside,today_finish,today_finish_inside,yesterday_date,yesterday_date_inside,yesterday_finish,yesterday_finish_inside,";
		obj_ids += "today_date_600,yesterday_date_600,year_class,date_now,f_date_now,div_show_all,";
		obj_ids += "summary_box_inside,period_box_inside,exchange_box_inside";
		_mc = util.getObjAry(dom, obj_ids);
		if (getView().viewportwidth >= 1024) isPcUser = true;
		else isPcUser = false;
        
		_self.parseJSON(); 
		_self.initSelectFun(); 
		_self.initCalendar(); 
		_self.initBar();
		_self.initGameFinish();
		_self.initCurrency(); 
		_self.setBoxClick();
		_self.setPeriod();
        
		_self.addEventListener("choseDateEvent", _self.choseDateEvent);
		_self.addEventListener("dateErrorEvent", _self.dateErrorEvent);
		_self.addEventListener("enterDateEvent", _self.enterDateEvent);
		util.addEvent(dom.getElementById("clear_btn"), "click", _self.clearEvent);
		util.addEvent(dom.getElementById("search_btn"), "click", _self.searchEvent);
		util.addEvent(win, "resize", _self.orientation);
		if (top.user_type == 1) _self.getSubAccount();
		else {
			dom.getElementById("div_filter").classList.add("--sub");
			dom.getElementById("account_label_600").setAttribute("style", "display:none");
			_self.setSelectEvent()
		}
		if (top.user_type == 1 || pri_type.indexOf("C") != -1) {
			var obj_ids = ",chart_mode_mem,chart_mode_ag,chart_mode_btn,";
			obj_ids += "div_reportChart,show_reportChart,sysmsg_reportChart,";
			obj_ids += "div_btn_reportChart,btn_reportChart,div_reportChart_table,div_reportChart_table_data,reportChart_table_xmp_contant,";
			var tmpObj = util.getObjAry(dom, obj_ids);
			_mc = util.mergeArray(_mc, tmpObj);
			_self.addEventListener("choseDateReportChart", _self.choseDateReportChart);
			_self.getChartData();
			for (var key in chart_mode_arr) {
				var this_type = chart_mode_arr[key];
				util.addEvent(_mc["chart_mode_" + this_type], "click", _self.chg_chart_mode, {
					"chg_type": this_type
				})
			}
		} else dom.getElementById("box_reportChart").style.display = "none";
		if (top.user_type == 1) {
			var obj_ids = ",div_top10_win,top10_win_show,top10_win_date,top10_win_data,top10_win_nodata,top10_win_sysmsg,";
			obj_ids += "div_top10_loss,top10_loss_show,top10_loss_date,top10_loss_data,top10_loss_nodata,top10_loss_sysmsg,";
			obj_ids += "div_top10_winInside,div_top10_lossInside,top10_winInside_show,top10_winInside_date,top10_winInside_data,top10_winInside_nodata,top10_winInside_sysmsg,";
			obj_ids += "top10_lossInside_box,top10_winInside_box,top10_lossInside_show,top10_lossInside_date,top10_lossInside_data,top10_lossInside_nodata,top10_lossInside_sysmsg,";
			obj_ids += "top10_winInside_date_btn,top10_lossInside_date_btn,view_top10_winInside_btn,view_top10_lossInside_btn,";
			obj_ids += "top10_winInside_close_btn,top10_lossInside_close_btn,";
			obj_ids += "xmp_contant,top10_win_date_btn,top10_loss_date_btn,view_all_win_btn,view_all_loss_btn,";
			var tmpObj = util.getObjAry(dom, obj_ids);
			_mc = util.mergeArray(_mc, tmpObj);
			var obj_ids = ",top10_win_1,top10_win_2,top10_win_3,";
			obj_ids += "top10_loss_1,top10_loss_2,top10_loss_3,";
			obj_ids += "top10_winInside_1,top10_winInside_2,top10_winInside_3,";
			obj_ids += "top10_lossInside_1,top10_lossInside_2,top10_lossInside_3,";
			var tmpObj = util.getObjAry(dom, obj_ids);
			_mc = util.mergeArray(_mc, tmpObj);
			for (var key in tmpObj) {
				var this_Obj = tmpObj[key];
				util.addEvent(this_Obj, "click", _self.setTop10status, this_Obj)
			}
			_self.getTop10Data()
		} else {
			dom.getElementById("div_top10_win").style.display = "none";
			dom.getElementById("div_top10_loss").style.display = "none"
		}
		var obj_ids = ",div_possess,sysmsg_possess,div_members,sysmsg_members,div_winloss,sysmsg_winloss,";
		var tmpObj = util.getObjAry(dom, obj_ids);
		_mc = util.mergeArray(_mc, tmpObj);
		_self.getPossess();
		_self.getMembers();
		_self.getWinLoss2();
		for (var key in WL_mode_arr) {
			var this_type = WL_mode_arr[key];
			_mc["WL_mode_" + this_type] = dom.getElementById("WL_mode_" + this_type);
			util.addEvent(_mc["WL_mode_" + this_type], "click", _self.chg_WL_mode, {
				"chg_type": this_type
			})
		}
		dom.getElementById("body_show").classList.add("body_pb");
		dom.getElementById("body_show").classList.add("--report");
		setTimeout(function() {
			parentClass.dispatchEvent("showLoading", {
				"showLoading": false
			})
		},
		500)
	};
	_self.setParentclass = function(_parentclass) {
		parentClass = _parentclass;
		util = parentClass.getThis("util");
		LS = parentClass.getThis("LS");
		LS_code = parentClass.getThis("LS_code");
		config_set = parentClass.getThis("config_set");
		cookie = parentClass.getThis("cookie");
		fastTemplate_a1 = parentClass.getThis("fastTemplate_a1");
		Storage = parentClass.getThis("Storage")
	};
	_self.getParentThis = function(varible) {
		return parentClass.getThis(varible)
	};
	_self.getThis = function(varible) {
		return eval(varible)
	};
	_self.parseJSON = function() {
		dateHash = JSON.parse(win.jsonDate);
		currencyHash = JSON.parse(win.jsonCurrency);
		util.echo(dateHash)
	};
	_self.initSelectFun = function() {
		selectFun["result_type"] = _self.chgSel;
		selectFun["date"] = _self.chgDate;
		selectFun["gtype"] = _self.chgSel;
		selectFun["account"] = _self.chgSel
	};
	_self.orientation = function() {
		var orientation = win.Math.abs(win.orientation);
		if (orientation == 90 || orientation == 0) _self.initCalendar()
	};
	_self.initCalendar = function() {
        
		if (isPcUser){ _self.setCalendar(dateHash, "all");}
		else{_self.setCalendar(dateHash, "f_all");}
	};
	_self.initBar = function() {
		par["result_type"] = "Y";
		par["gtype"] = "ALL";
		par["wtype"] = "ALL";
		par["date"] = "yes";
		par["account"] = "main";
		if (!par["report_kind"]) par["report_kind"] = "A";
		for (var keys in par) {
			var k = par[keys];
			if (keys == "report_kind") if (par[keys] != "A") k = "D";
			else continue;
			if (keys != "wtype") _self.chgSel(null, {
				"rtype": keys,
				"type": k
			})
		}
	};
	_self.initGameFinish = function() {
		for (var i = 0; i < game_ary.length; i++) {
			var dat = game_ary[i];
			var tmp_ary = Array("_date", "_finish");
			for (var x = 0; x < tmp_ary.length; x++) {
				var key = tmp_ary[x];
				var obj = _mc[dat + key];
				var obj2 = _mc[dat + key + "_inside"];
				var obj3 = _mc[dat + key + "_600"];
				if (key == "_date") {
					obj.innerHTML = dateHash[dat].replace(/\-/g, "/");
					obj2.innerHTML = dateHash[dat].replace(/\-/g, "/");
					obj3.innerHTML = dateHash[dat].replace(/\-/g, "/");
					util.addEvent(obj3, "click", _self.chgDiv, {
						"type": "game",
						"target": obj3
					})
				} else if (key == "_finish") {
					obj.innerHTML = dateHash[dat + key].replace(/\-/g, "/");
					obj2.innerHTML = dateHash[dat + key].replace(/\-/g, "/")
				}
				if (key != "_date") obj.classList.add(dateHash[dat + "_finish_class"]);
				obj2.classList.add(dateHash[dat + "_finish_class"])
			}
		}
		var gAry = config_set.get("GTYPEARY");
		gAry = gAry.concat(new Array("FS"));
		var data = dateHash["game_over_yn"];
		var _gameSetAry = Array("yes_set", "yes_un", "to_set", "to_un");
		var countAry = {
			yes_set: 0,
			yes_un: 0,
			to_set: 0,
			to_un: 0
		};
		for (var j = 0; j < gAry.length; j++) {
			var gtype = gAry[j];
			for (var c = 0; c < _gameSetAry.length; c++) {
				var tmpKey = _gameSetAry[c];
				var tmpSplitAry = tmpKey.split("_");
				var date = tmpSplitAry[0];
				if (tmpSplitAry[1] == "set") {
					dom.getElementById(gtype + "_" + tmpKey).innerHTML = data[gtype][date]["RESULT_Y"];
					countAry[tmpKey] += parseInt(data[gtype][date]["RESULT_Y"], 10)
				} else {
					dom.getElementById(gtype + "_" + tmpKey).innerHTML = data[gtype][date]["RESULT_N"];
					countAry[tmpKey] += parseInt(data[gtype][date]["RESULT_N"], 10)
				}
			}
		}
		for (var a = 0; a < _gameSetAry.length; a++) {
			var tmpKey = _gameSetAry[a];
			dom.getElementById(tmpKey).innerHTML = countAry[tmpKey]
		}
	};
	_self.initCurrency = function() {
		if (currencyHash.length == 0) return;
		var div_model = dom.getElementById("exchange_box_model");
		var tpl = new fastTemplate_a1;
		var curAry = new Array("CODE_NAME", "CODE_VALUE");
		var nowPostion = 0;
		for (var i = 0; i < 2; i++) {
			tpl.init(div_model.cloneNode(true));
			for (var a = 0; a < 2; a++) {
				var curData = currencyHash[nowPostion];
				tpl.addBlock("CURRENCY");
				for (var c = 0; c < curAry.length; c++) {
					var keys = curAry[c];
					tpl.replace(new RegExp("\\*" + keys + "\\*", "gi"), curData[keys])
				}
				nowPostion++
			}
			var _xmlStr = tpl.fastPrint();
			var tempDiv = document.createElement("div");
			tempDiv.innerHTML = _xmlStr;
			while (tempDiv.firstChild) dom.getElementById("exchange_box").appendChild(tempDiv.firstChild)
		}
		var div_model = dom.getElementById("exchange_box_model_inside");
		var tpl = new fastTemplate_a1;
		tpl.init(div_model.cloneNode(true));
		var curAry = new Array("CODE_NAME", "CODE", "CODE_VALUE");
		for (var i = 0; i < currencyHash.length; i++) {
			var curData = currencyHash[i];
			tpl.addBlock("CURRENCY_INSIDE");
			for (var a = 0; a < curAry.length; a++) {
				var keys = curAry[a];
				tpl.replace(new RegExp("\\*" + keys + "\\*", "gi"), curData[keys])
			}
		}
		dom.getElementById("exchange_box_inside").innerHTML = tpl.fastPrint()
	};
	_self.setPeriod = function() {
		var this_period_num = dateHash["period_num"];
		var this_period_year = dateHash["period_year"];
		var last_period_num = this_period_num == "1" ? "13": this_period_num - 1;
		var last_period_year = this_period_num == "1" ? this_period_year - 1 : this_period_year;
		var _this_period = "y" + this_period_year + "_" + this_period_num;
		var _last_period = "y" + last_period_year + "_" + last_period_num;
		var _tmp_obj = dom.getElementById(_this_period);
		var _tmp_obj2 = dom.getElementById(_last_period);
		if (_tmp_obj) {
			_tmp_obj.classList.add("word_green");
			dom.getElementById("this_period").innerHTML = _tmp_obj.textContent;
			if (_tmp_obj2) dom.getElementById("last_period").innerHTML = _tmp_obj2.textContent;
			dom.getElementById("period_no_data").style.display = "none"
		} else dom.getElementById("period_no_data").style.display = ""
	};
	_self.setCalendar = function(dateHash, _name) {
		var sPar = new Object;
		if (_name == "all") {
			sPar.div = dom.getElementById("div_date");
			sPar.photo = dom.getElementById("icon_all");
			sPar.CalendarClass = win.ClassFankCal2_ag; 
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
		sPar.def_date = Array(dateHash.yesterday, dateHash.yesterday);
		sPar.langx = top.langx;
		sPar.period_ls = dateHash.period_ls;
		sPar.WEB_TIME_ZONE = dateHash.WEB_TIME_ZONE;
		if (_name == "all") { 
            
            if (allDate == null) { 
                allDate = new win.calendar2_ag(win, dom); 
                allDate.setParentclass(_self); 
                allDate.init(sPar)
            } else { 
                
                allDate.restart();
            }
            
        }
		if (_name == "f_all") if (allDate == null) {
			allDate = new win.calendar_ag(win, dom);
			allDate.setParentclass(_self);
			allDate.init(sPar)
		} else allDate.restart()
	};
	_self.setBoxClick = function() {
		for (var i = 0; i < showAllAry.length; i++) {
			var _name = showAllAry[i];
			util.addEvent(dom.getElementById("view_" + _name + "_btn"), "click", _self.showAllEvent, {
				"type": _name
			});
			util.addEvent(dom.getElementById(_name + "_close_btn"), "click", _self.closeAllEvent, {
				"type": _name
			});
			util.addEvent(dom.getElementById(_name + "_box_inside"), "scroll", _self.popUpScrollEvent, dom.getElementById("div_" + _name))
		}
	};
	_self.showAllEvent = function(e, param) {
		var tmpType = param.type.split("_");
		if (tmpType.length > 1) {
			is_outside_Top10 = false;
			set_Top10_kind = tmpType[1];
			set_Top10_types[tmpType[1]] = tmpType[1].indexOf("loss") != -1 ? set_Top10_types["loss"] : set_Top10_types["win"];
			_self.getTop10Data()
		}
		dom.getElementById("ma_content").classList.add("md_hidden");
		_mc["div_show_all"].style.display = "";
		var _name = param.type;
		dom.getElementById("div_" + _name).style.display = ""
	};
	_self.closeAllEvent = function(e, param) {
		dom.getElementById("ma_content").classList.remove("md_hidden");
		is_outside_Top10 = true;
		_mc["div_show_all"].style.display = "none";
		var _name = param.type;
		dom.getElementById("div_" + _name).style.display = "none"
	};
	_self.chgDiv = function(e, param) {
		if (param.target.classList.contains("--on")) return;
		else if (param.type == "game") {
			var today_game_id = "";
			var _len = game_ary.length;
			for (var i = 0; i < _len; i++) {
				_mc[game_ary[i] + "_date_600"].classList.remove("--on");
				if (today_game_id == "") today_game_id = _mc[game_ary[i] + "_date_600"].id
			}
			param.target.classList.add("--on");
			if (param.target.id == today_game_id) _mc["summary_box_inside"].classList.add("re_today");
			else _mc["summary_box_inside"].classList.remove("re_today")
		} else if (param.type == "period") {
			var first_year_id = "";
			var _len = period_ary.length;
			for (var i = 0; i < _len; i++) {
				period_ary[i].classList.remove("--on");
				if (first_year_id == "") first_year_id = period_ary[i].id
			}
			param.target.classList.add("--on");
			if (param.target.id == first_year_id) _mc["year_class"].classList.remove("last_year");
			else _mc["year_class"].classList.add("last_year")
		}
	};
	_self.goto600 = function(e, param) {
		parentClass.dispatchEvent("bodyGoToPage", {
			"page": "report_" + param.type,
			"pageName": param.type
		})
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
	};
	_self.showDiv = function(e, param) {
		var obj = dom.getElementById(param.rtype + "_div");
		if (obj.classList.contains("active")) obj.classList.remove("active");
		else {
			obj.classList.add("active");
			obj.focus()
		}
	};
	_self.selChgEvent = function(e, param) {
		param.type = e.target.value;
		if (param.rtype == "date") _self.chgDate(e, param);
		else _self.chgSel(e, param)
	};
	_self.chgSel = function(e, param) {
		var rtype = param.rtype;
		var type = param.type;
		par[rtype] = type;
		dom.getElementById(rtype + "_now").innerHTML = dom.getElementById(rtype + "_" + type).innerHTML;
		if (rtype == "date") {
			dom.getElementById("f_date_now").innerHTML = dom.getElementById(rtype + "_" + type).innerHTML;
			document.getElementById("f_date_now").setAttribute("style", "display:")
		}
		var sel_Now = dom.getElementById(rtype + "_sel").getElementsByTagName("li");
		var sel_obj = rtype + "_" + type;
		for (var i = 0; i < sel_Now.length; i++) sel_Now[i].classList.remove("--on");
		dom.getElementById(sel_obj).classList.add("--on");
		try {
			dom.getElementById(rtype + "_div_600").value = type
		} catch(e) {
			util.err("[chgSel]" + rtype + "_div_600" + type, e)
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
	_self.chg_date = function(fix_type, shift, today, Obj) {
		var y_num = m_num = d_num = 0;
		if (fix_type == "y") y_num = shift;
		if (fix_type == "m") m_num = shift;
		if (fix_type == "d") d_num = shift;
		var aDate = today.split("-");
		var newDate = new Date(parseInt(aDate[0], 10) + y_num, parseInt(aDate[1], 10) - 1 + m_num, parseInt(aDate[2], 10) + d_num);
		if (Obj == 1) return newDate;
		else {
			var yyyy = newDate.getFullYear();
			var mm = newDate.getMonth() + 1;
			var dd = newDate.getDate();
			if (mm * 1 < 10) mm = "0" + mm;
			if (dd * 1 < 10) dd = "0" + dd;
			return yyyy + "-" + mm + "-" + dd
		}
	};
	_self.getWeek = function(d, w, dateHash) {
		var date_obj = _self.chg_date("", "", dateHash["today"], 1);
		var wday = date_obj.getDay();
		if (wday == "0") wday = 7;
		return _self.getNowDateTime("yyyy-mm-dd", "d", 0 - wday + d + w * 7, dateHash)
	};
	_self.getNowDateTime = function(fomat, field, num, dateHash) {
		var yyyy = mm = dd = H = i = s = 0;
		var gDate = new Date;
		yyyy = gDate.getUTCFullYear();
		mm = gDate.getUTCMonth() + 1;
		dd = gDate.getUTCDate();
		H = gDate.getUTCHours();
		i = gDate.getUTCMinutes();
		s = gDate.getUTCSeconds();
		gDate = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10), parseInt(H, 10) + parseInt(dateHash["WEB_TIME_ZONE"], 10), parseInt(i, 10), parseInt(s, 10), 0);
		yyyy = gDate.getFullYear();
		mm = gDate.getMonth() + 1;
		dd = gDate.getDate();
		H = gDate.getHours();
		i = gDate.getMinutes();
		s = gDate.getSeconds();
		if (field == "y" || field == "m" || field == "d") {
			gDate = _self.chg_date(field, num, yyyy + "-" + mm + "-" + dd, 1);
			yyyy = gDate.getFullYear();
			mm = gDate.getMonth() + 1;
			dd = gDate.getDate()
		}
		if (mm * 1 < 10) mm = "0" + mm;
		if (dd * 1 < 10) dd = "0" + dd;
		if (H * 1 < 10) H = "0" + H;
		if (i * 1 < 10) i = "0" + i;
		if (s * 1 < 10) s = "0" + s;
		if (fomat == "yyyy-mm-dd") return yyyy + "-" + mm + "-" + dd;
		if (fomat == "H:i:s") return H + ":" + i + ":" + s;
		if (fomat == "yyyy-mm-dd H:i:s") return yyyy + "-" + mm + "-" + dd + " " + H + ":" + i + ":" + s;
		return yyyy + "-" + mm + "-" + dd + " " + H + ":" + i + ":" + s
	};
	_self.choseDateEvent = function(param) {};
	_self.dateErrorEvent = function(param) {};
	_self.enterDateEvent = function(param) {};
	_self.clearEvent = function() {
		_self.initCalendar();
		_self.initBar();
		_self.chgDate(null, {
			"rtype": "date",
			"type": dom.getElementById("date_div_600").value
		})
	};
	_self.searchEvent = function(e, param) {
		if (!param || !param.quick) quickSearchPar = null;
		util.checkReportTeach(cookie, parentClass);
		if (cookie.get("isclick")) cookie.del("isclick");
		_self.checkReport(_self.gotoReport);
		if (cookie.get("moreTip20190130")) cookie.del("moreTip20190130")
	};
	_self.checkReport = function(retFun) {
		var searchPar = quickSearchPar || par;
		var result_type = searchPar["result_type"] || par["result_type"];
		var report_kind = searchPar["report_kind"] || par["report_kind"];
		if (result_type == "D" || result_type == "D4") {
			report_kind = result_type;
			result_type = "Y";
			if (!quickSearchPar) {
				par["report_kind"] = report_kind;
				par["result_type"] = result_type
			}
		}
		var str = "";
		str += top.param;
		str += "&p=check_report";
		if (isPcUser) {
			var d_s = dom.getElementById("input_all_start").value;
			var d_e = dom.getElementById("input_all_end").value
		} else {
			var d_s = dom.getElementById("f_input_all_start").value;
			var d_e = dom.getElementById("f_input_all_end").value
		}
		d_s = d_s.replace(/ /g, "");
		d_s = d_s.replace(/\//g, "-");
		d_e = d_e.replace(/ /g, "");
		d_e = d_e.replace(/\//g, "-");
		str += "&date_start=" + d_s;
		str += "&date_end=" + d_e;
		str += "&result_type=" + result_type;
		str += "&report_kind=" + report_kind;
		str += "&account=" + par["account"];
		hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
		hr.setParentclass(_self);
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
				util.showErrorMsg("data error");
				quickSearchPar = null;
				return
			}
			if (hash["status"] == "200") retFun();
			else {
				quickSearchPar = null;
				util.showErrorMsg(hash["msg"])
			}
		});
		hr.loadURL(top.url, "POST", str)
	};
	_self.gotoReport = function() {
		var searchPar = quickSearchPar || par;
		var result_type = searchPar["result_type"] || par["result_type"];
		var report_kind = searchPar["report_kind"] || par["report_kind"];
		if (isPcUser) {
			var d_s = dom.getElementById("input_all_start").value;
			var d_e = dom.getElementById("input_all_end").value
		} else {
			var d_s = dom.getElementById("f_input_all_start").value;
			var d_e = dom.getElementById("f_input_all_end").value
		}
		d_s = d_s.replace(/ /g, "");
		d_s = d_s.replace(/\//g, "-");
		d_e = d_e.replace(/ /g, "");
		d_e = d_e.replace(/\//g, "-");
		var postHash = new Object;
		postHash["report_kind"] = report_kind;
		postHash["report_type"] = "set";
		postHash["result_type"] = result_type;
		if (postHash["report_kind"] == "D" || postHash["report_kind"] == "D4") postHash["result_type"] = "N";
		postHash["date"] = searchPar["date"] || par["date"];
		postHash["date_start"] = d_s;
		postHash["date_end"] = d_e;
		postHash["gtype"] = par["gtype"];
		postHash["wtype"] = par["wtype"];
		postHash["account"] = par["account"];
		postHash["view_layer"] = top.login_layer;
		postHash["WEB_TIME_ZONE"] = dateHash.WEB_TIME_ZONE;
		var param = new Object;
		if (par["account"] != "main") {
			param["page"] = "report_" + top.login_layer + "_sub";
			param["post"] = "view_layer=" + top.login_layer + "&account=" + par["account"]
		} else {
			param["page"] = "report_" + top.login_layer;
			param["post"] = "view_layer=" + top.login_layer + "&account=" + par["account"]
		}
		param["postHash"] = postHash;
		param["extendsClass"] = "report_index";
		quickSearchPar = null;
		parentClass.dispatchEvent("bodyGoToPage", param)
	};
	_self.addEventListener = function(eventname, eventFunction) {
		eventHandler[eventname] = eventFunction
	};
	_self.dispatchEvent = function(eventname, param) {
		if (eventHandler[eventname]) eventHandler[eventname](param)
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
			par["wtype"] = DOM.id.split("_")[1];
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
				if (targerDOMid.indexOf(searchStr.toLowerCase()) != -1) vanishLI = "";
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
	_self.quickBtnSearch = function(e, param) {
		var btn_value = param.param.split("_");
		quickSearchPar = {
			"date": btn_value[0],
			"result_type": btn_value[1],
			"report_kind": "A"
		};
		_self.chgDate(null, {
			"rtype": "date",
			"type": btn_value[0]
		});
		_self.chgSel(null, {
			"rtype": "result_type",
			"type": btn_value[1]
		});
		_self.searchEvent(null, {
			"quick": true
		})
	};
	_self.roll = function(e, param) {
		if (param.chk_obj.scrollLeft == 0) param.do_obj.classList.remove("--scroll");
		else {
			param.do_obj.classList.add("--scroll");
			if (param.chk_obj.scrollLeft + param.chk_obj.offsetWidth == param.chk_obj.scrollWidth) param.do_obj.classList.add("--right_no_scroll");
			else param.do_obj.classList.remove("--right_no_scroll")
		}
	};
	_self.getTop10Data = function() {
		var code = "top10";
		if (use_Storage_code.indexOf("," + code + ",") != -1) {
			var cdata = Storage.get(top.login_layer + top.user_id + storage_uid + code + top.langx + top.ver);
			if (cdata != null) {
				_self.connectComplete(cdata, true);
				return
			}
		}
		var urlParams = "";
		urlParams += "uid=" + top.uid;
		urlParams += "&login_layer=" + top.login_layer;
		urlParams += "&layer_id=" + top.layer_id;
		urlParams += "&langx=" + top.langx;
		urlParams = "p=get_Top10Data&ver=" + top.ver + "&" + urlParams;
		var getHTML = new HttpRequest;
		getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete", _self.connectComplete);
		getHTML.loadURL(top.url, "POST", urlParams)
	};
	_self.onError = function() {
		util.echo("onError")
	};
	_self.connectComplete = function(data, isStorage) {
		try {
			var arr_data = JSON.parse(data);
			if (arr_data["status"] == "200") {
				if (!isStorage) Storage.set(top.login_layer + top.user_id + storage_uid + "top10" + top.langx + top.ver, data, 1 / 24);
				if (set_Top10_kind == "all") {
					_self.parseData("win", arr_data);
					_self.parseData("loss", arr_data)
				} else _self.parseData(set_Top10_kind, arr_data)
			} else {
				var msg = arr_data["msg"] ? arr_data["msg"] : LS_code.get(arr_data["code"]);
				if (arr_data["code"] == "term_all") {
					Storage.vague_del(top.login_layer + top.user_id + storage_uid + "top10" + top.langx + top.ver);
					_mc["top10_win_show"].style.display = "none";
					_mc["top10_win_nodata"].style.display = "none";
					_mc["top10_win_sysmsg"].style.display = "";
					_mc["top10_loss_show"].style.display = "none";
					_mc["top10_loss_nodata"].style.display = "none";
					_mc["top10_loss_sysmsg"].style.display = "";
					_mc["top10_win_date_btn"].style.display = "none";
					_mc["top10_loss_date_btn"].style.display = "none";
					_mc["view_top10_winInside_btn"].classList.add("--disabled");
					_mc["view_top10_lossInside_btn"].classList.add("--disabled");
					util.removeEvent(_mc["view_top10_winInside_btn"], "click");
					util.removeEvent(_mc["view_top10_lossInside_btn"], "click")
				} else if (arr_data["code"] == "report_top10") {
					Storage.vague_del(top.login_layer + top.user_id + storage_uid + "top10" + top.langx + top.ver);
					_mc["div_top10_win"].style.display = "none";
					_mc["div_top10_loss"].style.display = "none";
					_mc["view_top10_winInside_btn"].classList.add("--disabled");
					_mc["view_top10_lossInside_btn"].classList.add("--disabled");
					util.removeEvent(_mc["view_top10_winInside_btn"], "click");
					util.removeEvent(_mc["view_top10_lossInside_btn"], "click")
				} else util.showErrorMsg(msg)
			}
		} catch(e) {
			util.echo(e)
		}
	};
	_self.parseData = function(top10_kind, data) {
		var this_type = set_Top10_types[top10_kind];
		var arr_this_types = arr_Top10_types[top10_kind];
		for (var key in arr_this_types) {
			var list_obj = _mc["top10_" + top10_kind + "_" + arr_this_types[key]];
			if (list_obj.classList.contains("--on")) list_obj.classList.remove("--on");
			if (arr_this_types[key] == this_type) list_obj.classList.add("--on")
		}
		var div_show = _mc["top10_" + top10_kind + "_data"];
		div_show.innerHTML = "";
		var this_status = data["outData"]["types_" + this_type]["status"];
		var this_date = data["outData"]["types_" + this_type]["date"];
		var tmp_top10_kind = top10_kind.indexOf("win") != -1 ? "win": "loss";
		if (this_status) {
			var this_data = data["outData"]["types_" + this_type]["data"][tmp_top10_kind];
			var tmp_this_data = is_outside_Top10 == true ? this_data.slice(0, 5) : this_data;
			if (tmp_this_data.length > 0) {
				var show_date = "";
				if (this_type != "1") {
					var tmp_date = this_date.split("|");
					var date_start = tmp_date[0];
					var date_end = tmp_date[1];
					show_date = date_start.replace(/\-/g, "/") + " - " + date_end.replace(/\-/g, "/")
				} else {
					var date_start = this_date;
					var date_end = this_date;
					show_date = this_date.replace(/\-/g, "/")
				}
				_mc["top10_" + top10_kind + "_date"].innerHTML = show_date;
				var bodyTemp = "";
				var xmp_contant = _mc["xmp_contant"].innerHTML;
				var get_div_ids = "";
				for (var key in tmp_this_data) {
					var contanttmp = xmp_contant;
					var obj = tmp_this_data[key];
					get_div_ids += ",div_" + obj["mid"];
					contanttmp = contanttmp.replace(/\*ID\*/g, util.showTxt(obj["mid"]));
					contanttmp = contanttmp.replace(/\*USERNAME\*/g, util.showTxt(obj["username"]));
					contanttmp = contanttmp.replace(/\*ALIAS\*/g, util.showTxt(obj["alias"]));
					contanttmp = contanttmp.replace(/\*AMOUNT\*/g, util.showTxt(obj["amount"]));
					contanttmp = contanttmp.replace(/\*GOLD_D\*/g, util.mprintf(util.showTxt(obj["gold_d"]) * 1, 0, 1, false, true));
					var num_class = obj["val"] * 1 >= 0 ? "": "word_red";
					contanttmp = contanttmp.replace(/\*NUM_COLOR\*/g, num_class);
					contanttmp = contanttmp.replace(/\*VALUE\*/g, util.mprintf(util.showTxt(obj["val"]) * 1, 0, 1, false, true));
					bodyTemp += contanttmp
				}
				div_show.innerHTML = bodyTemp;
				var tmpObj = util.getObjAry(div_show, get_div_ids + ",");
				for (var key in tmp_this_data) {
					var obj = tmp_this_data[key];
					var div = tmpObj["div_" + obj["mid"]];
					var obj_ids = ",btn_user,";
					var _ary = util.getObjAry(div, obj_ids);
					util.addEvent(_ary["btn_user"], "click", _self.addUserClick, {
						"acc_id": obj["mid"],
						"pay_type": obj["pay_type"],
						"date_start": date_start,
						"date_end": date_end,
						"username": obj["username_currency"]
					})
				}
				var div = dom.getElementById("div_" + obj["id"]);
				_mc["top10_" + top10_kind + "_show"].style.display = "";
				_mc["top10_" + top10_kind + "_date_btn"].style.display = "";
				_mc["top10_" + top10_kind + "_nodata"].style.display = "none";
				_mc["top10_" + top10_kind + "_sysmsg"].style.display = "none"
			} else {
				_mc["top10_" + top10_kind + "_show"].style.display = "none";
				_mc["top10_" + top10_kind + "_date_btn"].style.display = "";
				_mc["top10_" + top10_kind + "_nodata"].style.display = "";
				_mc["top10_" + top10_kind + "_sysmsg"].style.display = "none"
			}
		} else {
			_mc["top10_" + top10_kind + "_show"].style.display = "none";
			_mc["top10_" + top10_kind + "_date_btn"].style.display = "";
			_mc["top10_" + top10_kind + "_nodata"].style.display = "";
			_mc["top10_" + top10_kind + "_sysmsg"].style.display = "none"
		}
		if (is_outside_Top10) {
			var _DisableOrNot = true;
			for (var types in data["outData"]) if (data["outData"][types]["data"]) if (data["outData"][types]["data"][tmp_top10_kind].length > 0) _DisableOrNot = false;
			if (_DisableOrNot == true) {
				util.removeEvent(_mc["view_top10_" + top10_kind + "Inside_btn"], "click");
				_mc["view_top10_" + top10_kind + "Inside_btn"].classList.add("--disabled")
			} else {
				util.addEvent(_mc["view_top10_" + top10_kind + "Inside_btn"], "click", _self.showAllEvent, {
					"type": "top10_" + top10_kind + "Inside"
				});
				util.addEvent(_mc["top10_" + top10_kind + "Inside_close_btn"], "click", _self.closeAllEvent, {
					"type": "top10_" + top10_kind + "Inside"
				});
				util.addEvent(_mc["top10_" + top10_kind + "Inside_box"], "scroll", _self.popUpScrollEvent, _mc["div_top10_" + top10_kind + "Inside"]);
				_mc["view_top10_" + top10_kind + "Inside_btn"].classList.remove("--disabled")
			}
		}
	};
	_self.addUserClick = function(obj, param) {
		_mc["div_show_all"].style.display = "none";
		parentClass.dispatchEvent("showLoading", {
			"showLoading": true
		});
		var view_layer = "list_bet";
		var pHash = new Object;
		pHash["report_kind"] = "A";
		pHash["report_type"] = "set";
		pHash["result_type"] = "Y";
		pHash["date_start"] = param["date_start"];
		pHash["date_end"] = param["date_end"];
		pHash["date"] = "yes";
		pHash["gtype"] = "ALL";
		pHash["wtype"] = "ALL";
		pHash["view_layer"] = view_layer;
		pHash["username"] = param.username;
		pHash["account"] = "main";
		var paramPage = new Object;
		paramPage["page"] = "report_" + view_layer;
		paramPage["postHash"] = pHash;
		paramPage["post"] = "view_layer=" + view_layer;
		paramPage["extendsClass"] = "report_index";
		_self.checkReportTop10(_self.getSearchData, {
			"paramPage": paramPage,
			"param": param
		})
	};
	_self.checkReportTop10 = function(retFun, param) {
		var str = "";
		str += top.param;
		str += "&p=check_report";
		str += "&date_start=" + param["param"]["date_start"];
		str += "&date_end=" + param["param"]["date_end"];
		str += "&result_type=Y";
		str += "&report_kind=A";
		hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
		hr.setParentclass(_self);
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
				util.showErrorMsg("data error");
				return
			}
			if (hash["status"] == "200") retFun(param);
			else {
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "top10" + top.langx + top.ver);
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "turnover");
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "winloss");
				util.showErrorMsg(hash["msg"]);
				_self.getTop10Data();
				_self.getChartData()
			}
		});
		hr.loadURL(top.url, "POST", str)
	};
	_self.getSearchData = function(param) {
		var now_id = param["param"]["acc_id"];
		var now_pay_type = param["param"]["pay_type"];
		var urlParams = "";
		urlParams += "uid=" + top.uid;
		urlParams += "&login_layer=" + top.login_layer;
		urlParams += "&pagefrom=report_main";
		urlParams = "p=get_upper_structure&ver=" + top.ver + "&" + urlParams + "&now_layer=mem&now_id=" + now_id + "&now_pay_type=" + now_pay_type;
		var getHTML = new HttpRequest;
		getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete",
		function(data) {
			var arr_data = JSON.parse(data);
			var upper_structure = arr_data["data"];
			var report_set = arr_data["report_set"];
			var tmpurl = "";
			for (var key in upper_structure) tmpurl += upper_structure[key]["report_path"] + "&";
			for (var key in report_set) tmpurl += key + "=" + report_set[key] + "&";
			var paramPage = param["paramPage"];
			paramPage["postHash"]["url_param"] = tmpurl.substr(0, tmpurl.length - 1);
			_self.chgPage(paramPage)
		});
		getHTML.loadURL(top.url, "POST", urlParams)
	};
	_self.chgPage = function(param) {
		parentClass.dispatchEvent("bodyGoToPage", param)
	};
	_self.setTop10status = function(e, _obj) {
		if (!_obj.classList.contains("--on")) {
			var obj_id = _obj.id;
			var tmp = obj_id.split("_");
			is_outside_Top10 = obj_id.indexOf("Inside") != "-1" ? false: true;
			set_Top10_kind = tmp[1];
			set_Top10_types[set_Top10_kind] = tmp[2];
			_self.getTop10Data()
		}
	};
	_self.getChartData = function() {
		_self.get_performace("turnover", "tp", _self.getTurnOverComplete);
		_self.get_performace("winloss", "tp", _self.getWinLossComplete)
	};
	_self.get_performace = function(code, _date, retFun) {
		if (use_Storage_code.indexOf("," + code + ",") != -1) {
			var cdata = Storage.get(top.login_layer + top.user_id + storage_uid + code + _date + top.langx + top.ver);
			if (cdata != null) {
				retFun(cdata, true);
				return
			}
		}
		var param = "";
		param += top.param;
		param += "&p=get_performance";
		param += "&code=" + code;
		param += "&date=" + _date;
		param += "&langx=" + top.langx;
		hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
		hr.setParentclass(_self);
		hr.addEventListener("onError", _self.perOnError);
		hr.addEventListener("LoadComplete", retFun);
		hr.loadURL(top.url, "POST", param)
	};
	_self.perOnError = function() {};
	_self.getTurnOverComplete = function(json, isStorage) {
		var hash;
		try {
			hash = JSON.parse(json);
			if (util.chkErrorMsg(hash, LS_code)) return
		} catch(e) {
			util.err("[" + classname + "]", e);
			util.showErrorMsg("data error");
			return
		}
		if (hash["status"] == "200") {
			if (!isStorage) Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
			arr_ChartData[hash["data"]["code"]]["status"] = true;
			arr_ChartData[hash["data"]["code"]]["chartdata"] = hash
		} else {
			var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
			if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "turnover");
				arr_ChartData["turnover"]["status"] = true;
				arr_ChartData["turnover"]["chartdata"] = "nodata"
			} else util.showErrorMsg(msg)
		}
		_self.checkChartData()
	};
	_self.getWinLossComplete = function(json, isStorage) {
		var hash;
		try {
			hash = JSON.parse(json);
			if (util.chkErrorMsg(hash, LS_code)) return
		} catch(e) {
			util.err("[" + classname + "]", e);
			util.showErrorMsg("data error");
			return
		}
		if (hash["status"] == "200") {
			if (!isStorage) Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
			arr_ChartData[hash["data"]["code"]]["status"] = true;
			arr_ChartData[hash["data"]["code"]]["chartdata"] = hash
		} else {
			var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
			if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "winloss");
				arr_ChartData["winloss"]["status"] = true;
				arr_ChartData["winloss"]["chartdata"] = "nodata"
			} else util.showErrorMsg(msg)
		}
		_self.checkChartData()
	};
	_self.checkChartData = function() {
		var check_all_data = true;
		for (var key in arr_ChartData) if (!arr_ChartData[key]["status"]) {
			check_all_data = false;
			break
		}
		if (check_all_data) _self.parseChart()
	};
	_self.parseChart = function() {
		var data_check = true;
		for (var key in arr_ChartData) if (arr_ChartData[key]["chartdata"] == "nodata") {
			data_check = false;
			break
		}
		if (data_check) {
			var the_same_date = arr_ChartData["turnover"]["chartdata"]["data"]["date"];
			var the_same_org_date = arr_ChartData["turnover"]["chartdata"]["data"]["org_date"];
			var arr_value = new Array;
			arr_value[0] = arr_ChartData["turnover"]["chartdata"]["data"]["value"];
			arr_value[1] = _self.getProfitMargin(arr_ChartData["turnover"]["chartdata"]["data"]["value"], arr_ChartData["winloss"]["chartdata"]["data"]["value"]);
			var click_flag = true;
			var labelAry = _self.getLabel(arr_value[0]);
			var showObj = _mc["show_reportChart"];
			if (dashHash["reportChart"] != null) dashHash["reportChart"].destroy();
			dashHash["reportChart"] = new win.dashboard(win, dom);
			dashHash["reportChart"].setParentclass(_self);
			dashHash["reportChart"].init();
			dashHash["reportChart"].showReportChart("reportChart", showObj, labelAry, arr_value, the_same_date, the_same_org_date, click_flag, showWinLoss_mode);
			_self.setSysMsgVisible("reportChart", "div");
			util.addEvent(_mc["div_reportChart"], "scroll", _self.reportChartroll, {
				"chk_obj": _mc["div_reportChart"],
				"do_obj": _mc["div_reportChart"]
			});
			if (showWinLoss_mode == "mem") _self.parseCharttable(arr_value);
			_mc["chart_mode_btn"].style.display = ""
		} else {
			_self.setSysMsgVisible("reportChart", "sysmsg");
			_mc["div_btn_reportChart"].classList.add("disable");
			_mc["chart_mode_btn"].style.display = "none"
		}
		dom.getElementById("box_reportChart").style.display = ""
	};
	_self.parseCharttable = function(arr_value) {
		var check_data = false;
		var div_show = _mc["div_reportChart_table_data"];
		div_show.innerHTML = "";
		var bodyTemp = "";
		var xmp_contant = _mc["reportChart_table_xmp_contant"].innerHTML;
		var data_num = arr_value[0].length;
		for (var i = 0; i < data_num; i++) {
			var contanttmp = xmp_contant;
			var this_days = i + 1;
			var this_turnover = arr_value[0][i];
			var profitmargin = arr_value[1][i];
			if (this_turnover == "" && profitmargin == "") continue;
			if (this_turnover != "" && profitmargin.toString() != "") check_data = true;
			contanttmp = contanttmp.replace(/\*DAY\*/g, util.showTxt(this_days));
			contanttmp = contanttmp.replace(/\*TURNOVER\*/g, util.mprintf(util.showTxt(this_turnover) * 1, 0, 1, true, false));
			var num_class = profitmargin * 1 >= 0 ? "": "word_red";
			contanttmp = contanttmp.replace(/\*PROFITMARGIN\*/g, util.mprintf(util.showTxt(profitmargin) * 1, 0, 2, false, true));
			contanttmp = contanttmp.replace(/\*NUM_COLOR\*/g, num_class);
			bodyTemp += contanttmp
		}
		div_show.innerHTML = bodyTemp;
		if (check_data) {
			util.addEvent(_mc["btn_reportChart"], "click", _self.show_reportChart_table);
			_mc["div_btn_reportChart"].classList.remove("disable")
		} else {
			util.removeEvent(_mc["btn_reportChart"], "click");
			_mc["div_btn_reportChart"].classList.add("disable")
		}
	};
	_self.show_reportChart_table = function(e, param) {
		var check_table_show = _mc["div_reportChart_table"].style.display != "none";
		if (check_table_show) {
			_mc["div_reportChart_table"].style.display = "none";
			_mc["div_btn_reportChart"].classList.remove("--on")
		} else {
			_mc["div_reportChart_table"].style.display = "";
			_mc["div_btn_reportChart"].classList.add("--on")
		}
	};
	_self.getLabel = function(data) {
		var ret = new Array;
		for (var i = 0; i < data.length; i++) ret[i] = i + 1;
		return ret
	};
	_self.reportChartroll = function(e, param) {
		if (param.chk_obj.scrollLeft == 0) param.do_obj.classList.remove("scroll");
		else param.do_obj.classList.add("scroll")
	};
	_self.setSysMsgVisible = function(type, isShowtype) {
		var arr_do_type = {
			"div": "none",
			"sysmsg": "none",
			"loading": "none"
		};
		var loading_obj = dom.getElementById("loading_" + type);
		if (loading_obj) loading_obj.classList.remove("--success");
		arr_do_type[isShowtype] = "";
		var show_time = 0;
		for (var key in arr_do_type) {
			show_time = 0;
			var do_obj = _mc[key + "_" + type];
			if (do_obj) {
				if (isShowtype == "div") {
					show_time = 200;
					if (loading_obj) loading_obj.classList.add("--success")
				}
				setTimeout(function(do_obj, do_type) {
					do_obj.style.display = do_type
				},
				show_time, do_obj, arr_do_type[key])
			}
		}
	};
	_self.getProfitMargin = function(turnoverdata, winlossdata) {
		var out_array = new Array;
		if (showWinLoss_mode == "ag") winlossdata = _self.transform_WinLoss_mode(winlossdata);
		var data_num = turnoverdata.length;
		for (var i = 0; i < data_num; i++) if (winlossdata[i] == "" && turnoverdata[i] == "") out_array[i] = "";
		else if (winlossdata[i] == 0 || turnoverdata[i] == 0) out_array[i] = util.mprintf(0, 0, 2, false, false) * 1;
		else out_array[i] = util.mprintf(winlossdata[i] / turnoverdata[i] * 100, 0, 2, false, false) * 1;
		return out_array
	};
	_self.transform_WinLoss_mode = function(this_data) {
		var out_data = Array();
		for (var key in this_data) if (this_data[key] != "") if (this_data[key] != 0) out_data[key] = this_data[key] * -1;
		else out_data[key] = this_data[key];
		else out_data[key] = this_data[key];
		return out_data
	};
	_self.chg_chart_mode = function(e, param) {
		if (showWinLoss_mode != param.chg_type) {
			for (var key in chart_mode_arr) {
				var this_type = chart_mode_arr[key];
				_mc["chart_mode_" + this_type].classList.remove("--on")
			}
			_mc["chart_mode_" + param.chg_type].classList.add("--on");
			showWinLoss_mode = param.chg_type;
			_self.getChartData()
		}
	};
	_self.choseDateReportChart = function(param) {
		if (param.date == "") return;
		parentClass.dispatchEvent("showLoading", {
			"showLoading": true
		});
		param["date_start"] = param.date;
		param["date_end"] = param.date;
		_self.checkReportTop10(_self.goDateReportChart, {
			"param": param
		})
	};
	_self.goDateReportChart = function(param) {
		var postHash = new Object;
		postHash["report_kind"] = "A";
		postHash["report_type"] = "set";
		postHash["result_type"] = "Y";
		postHash["date_start"] = param["param"].date;
		postHash["date_end"] = param["param"].date;
		postHash["date"] = "yes";
		postHash["gtype"] = "ALL";
		postHash["wtype"] = "ALL";
		postHash["view_layer"] = top.login_layer;
		postHash["account"] = "main";
		var param = new Object;
		param["page"] = "report_" + top.login_layer;
		param["post"] = "view_layer=" + top.login_layer;
		param["postHash"] = postHash;
		param["extendsClass"] = "report_index";
		parentClass.dispatchEvent("bodyGoToPage", param)
	};
	_self.viewAllEvent = function(event, param) {
		_self.initBar();
		if (isPcUser) {
			dom.getElementById("input_all_start").value = param.date_start;
			dom.getElementById("input_all_end").value = param.date_end
		} else {
			dom.getElementById("f_input_all_start").value = param.date_start;
			dom.getElementById("f_input_all_end").value = param.date_end
		}
		_self.searchEvent()
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
		_self.setSelectEvent()
	};
	_self.getPossess = function() {
		_self.get_performace("possess", nowPossess, _self.getPossessComplete)
	};
	_self.getPossessComplete = function(json, isStorage) {
		var hash;
		try {
			hash = JSON.parse(json);
			if (util.chkErrorMsg(hash, LS_code)) return
		} catch(e) {
			util.err("[" + classname + "]", e);
			util.showErrorMsg("data error");
			return
		}
		if (hash["status"] == "200") {
			if (!isStorage) Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
			var click_flag = true;
			var labelAry = _self.getLabel(hash["data"]["value"]);
			var showObj = dom.getElementById("show_possess");
			if (dashHash["possess"] != null) dashHash["possess"].destroy();
			dashHash["possess"] = new win.dashboard(win, dom);
			dashHash["possess"].setParentclass(_self);
			dashHash["possess"].init();
			dashHash["possess"].show("possess", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"], click_flag);
			_self.setSysMsgVisible("possess", "div");
			util.addEvent(dom.getElementById("div_possess"), "scroll", _self.roll, {
				"chk_obj": dom.getElementById("div_possess"),
				"do_obj": dom.getElementById("div_possess")
			})
		} else {
			var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
			if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
				_self.setSysMsgVisible("possess", "sysmsg");
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "possess")
			} else util.showErrorMsg(msg)
		}
	};
	_self.getMembers = function() {
		_self.get_performace("members", nowMembers, _self.getMembersComplete)
	};
	_self.getMembersComplete = function(json, isStorage) {
		var hash;
		try {
			hash = JSON.parse(json);
			if (util.chkErrorMsg(hash, LS_code)) return
		} catch(e) {
			util.err("[" + classname + "]", e);
			util.showErrorMsg("data error");
			return
		}
		if (hash["status"] == "200") {
			if (!isStorage) Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
			var click_flag = true;
			var labelAry = _self.getLabel(hash["data"]["value"]);
			var showObj = dom.getElementById("show_members");
			if (dashHash["members"] != null) dashHash["members"].destroy();
			dashHash["members"] = new win.dashboard(win, dom);
			dashHash["members"].setParentclass(_self);
			dashHash["members"].init();
			dashHash["members"].show("members", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"], click_flag);
			_self.setSysMsgVisible("members", "div");
			util.addEvent(dom.getElementById("div_members"), "scroll", _self.roll, {
				"chk_obj": dom.getElementById("div_members"),
				"do_obj": dom.getElementById("div_members")
			})
		} else {
			var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
			if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
				_self.setSysMsgVisible("members", "sysmsg");
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "members")
			} else util.showErrorMsg(msg)
		}
	};
	_self.getTurnOver2 = function() {
		_self.get_performace("turnover", nowTurnOver, _self.getTurnOver2Complete)
	};
	_self.getTurnOver2Complete = function(json, isStorage) {
		var hash;
		try {
			hash = JSON.parse(json);
			if (util.chkErrorMsg(hash, LS_code)) return
		} catch(e) {
			util.err("[" + classname + "]", e);
			util.showErrorMsg("data error");
			return
		}
		if (hash["status"] == "200") {
			if (!isStorage) Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
			var click_flag = true;
			var labelAry = _self.getLabel(hash["data"]["value"]);
			var showObj = dom.getElementById("show_turnover");
			if (dashHash["turnover"] != null) dashHash["turnover"].destroy();
			dashHash["turnover"] = new win.dashboard(win, dom);
			dashHash["turnover"].setParentclass(_self);
			dashHash["turnover"].init();
			dashHash["turnover"].show("turnover", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"], click_flag);
			_self.setSysMsgVisible("turnover", "div");
			util.addEvent(dom.getElementById("div_turnover"), "scroll", _self.roll, {
				"chk_obj": dom.getElementById("div_turnover"),
				"do_obj": dom.getElementById("div_turnover")
			})
		} else {
			var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
			if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
				_self.setSysMsgVisible("turnover", "sysmsg");
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "turnover")
			} else util.showErrorMsg(msg)
		}
	};
	_self.getWinLoss2 = function() {
		_self.get_performace("winloss", nowWinLoss, _self.getWinLoss2Complete)
	};
	_self.getWinLoss2Complete = function(json, isStorage) {
		var hash;
		try {
			hash = JSON.parse(json);
			if (util.chkErrorMsg(hash, LS_code)) return
		} catch(e) {
			util.err("[" + classname + "]", e);
			util.showErrorMsg("data error");
			return
		}
		if (hash["status"] == "200") {
			if (!isStorage) Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
			var click_flag = true;
			var labelAry = _self.getLabel(hash["data"]["value"]);
			if (showWinLoss_mode == "ag") hash["data"]["value"] = _self.transform_WinLoss_mode(hash["data"]["value"]);
			var showObj = dom.getElementById("show_winloss");
			if (dashHash["winloss"] != null) dashHash["winloss"].destroy();
			dashHash["winloss"] = new win.dashboard(win, dom);
			dashHash["winloss"].setParentclass(_self);
			dashHash["winloss"].init();
			dashHash["winloss"].show("winloss", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"], click_flag, showWinLoss_mode);
			_self.setSysMsgVisible("winloss", "div");
			util.addEvent(dom.getElementById("div_winloss"), "scroll", _self.roll, {
				"chk_obj": dom.getElementById("div_winloss"),
				"do_obj": dom.getElementById("div_winloss")
			})
		} else {
			var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
			if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
				_self.setSysMsgVisible("winloss", "sysmsg");
				dom.getElementById("winloss_mode_show").style.display = "none";
				Storage.vague_del(top.login_layer + top.user_id + storage_uid + "winloss")
			} else util.showErrorMsg(msg)
		}
	};
	_self.chg_WL_mode = function(e, param) {
		if (showWinLoss_mode != param.chg_type) {
			for (var key in WL_mode_arr) {
				var this_type = WL_mode_arr[key];
				_mc["WL_mode_" + this_type].classList.remove("--on")
			}
			_mc["WL_mode_" + param.chg_type].classList.add("--on");
			showWinLoss_mode = param.chg_type;
			_self.getWinLoss2()
		}
	};
	_self.popUpScrollEvent = function(e, target) {
		if (e.target.scrollTop != "0") util.classFunc(target, "scroll");
		else util.classFunc(target, "scroll", "remove")
	}
};
