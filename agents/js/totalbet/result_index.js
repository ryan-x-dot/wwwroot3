function result_index(_win, _dom, _toppar) {
	var _self = this;
	var win = _win;
	var dom = _dom;
	var parentClass;
	var classname = "result_index";
	var util;
	var LS;
	var LS_code;
	var bodyFrame = null;
	var eventHandler = new Object;
	var toppar = _toppar;
	var par = new Object;
	var _mc = new Object;
	var gtypeAry = new Array("FT", "BK", "ES", "TN", "VB", "BM", "TT", "BS", "SK", "OP");
	var tabAry = new Array("matches", "outright");
	var nowTab = "matches";
	var dateAry = new Array;
	var today;
	var choDay = "today";
	var choWeek = "";
	var sort_time_asc = false;
	var sort_league_asc =
		false;
	var dataHash = new Object;
	var data_filter;
	var choLeagueId = "all";
	var nowDetail = "";
	var rmbFilterLid = new Object;
	var rmbStorageHead = new Object;
	var nowStorageAry = new Array;
	var arr_leagueid = new Array;
	var num_leagueid = 0;
	var fixed_div_height = 0;
	var now_fix_league = 0;
	var front_league_bak_height = 0;
	var footer_height = 0;
	var header_height = 0;
	var pb_height = 0;
	var filterInitParam = new Object;
	filterInitParam = {
		"downline": {
			"_titleName": "",
			"mode": 3,
			"info_mode": false,
			"title_mode": false,
			"_setDiv": null,
			"_titleView": null,
			"_contantView": null,
			"_data": null,
			"_viewClass": "active",
			"_default": "ALL",
			"_limitCount": 0,
			"_searchOpen": true,
			"_searchItem": "downlineID",
			"_searchDiv": null,
			"_dataShowDiv": null,
			"_breakpoint": [{
				"div": null,
				"amount": 0
			}, {
				"div": null,
				"amount": 12
			}],
			"_chkBtnMode": true,
			"_chkBtnDiv": {
				"SAVE": {
					"div": null,
					"disappear": true
				},
				"CANCEL": {
					"div": null,
					"disappear": true
				}
			}
		}
	};
	var filterBigObj = null;
	var filterUse = new Object;
	var isChgDate = false;
	var lazy_sw = null;
	var lazy_count = null;
	var lazy_page = null;
	var lazy_total_page = null;
	var lazy_loading =
		false;
	_self.init = function() {
		util.echo("result_index complete");
		parentClass.dispatchEvent("chgPageName", {
			"pageType": "totalbet",
			"pageName": top.tbet_showtype
		});
		dom.getElementById("body_show").classList.remove("body_pb");
		if (top.tbet_gtype == undefined) top.tbet_gtype = "FT";
		if (top.tbet_gtype == undefined) top.tbet_gtype = "FT";
		if (toppar["tbet_gtype"] == null) toppar["tbet_gtype"] = top.tbet_gtype;
		else top.tbet_gtype = toppar["tbet_gtype"];
		for (var i = 0; i < gtypeAry.length; i++) {
			var _name = gtypeAry[i];
			dom.getElementById("tbet_" +
				_name).classList.remove("on")
		}
		dom.getElementById("tbet_" + toppar["tbet_gtype"]).classList.add("on");
		_self.scroll_gtype(toppar["tbet_gtype"]);
		for (var i = 0; i < gtypeAry.length; i++) {
			var _name = gtypeAry[i];
			util.addEvent(dom.getElementById("tbet_" + _name), "click", _self.chgGtype, {
				"type": _name
			})
		}
		util.addEvent(dom.getElementById("matches_page"), "click", _self.chgResultTpye, "matches");
		if (toppar["tbet_gtype"] != "ES") {
			dom.getElementById("outright_page").classList.remove("--disabled");
			util.addEvent(dom.getElementById("outright_page"),
				"click", _self.chgResultTpye, "outright")
		} else dom.getElementById("outright_page").classList.add("--disabled");
		choDay = "today";
		_self.getDateList();
		_self.loadFilterData();
		_self.getModel(choDay, true);
		_self.addEventListener("goToPage", _self.indexGoToPageEvent);
		_self.addEventListener("showResultDetail", _self.indexShowResultsDetail);
		bodyFrame.addEventListener("changeFilter", _self.changeFilter);
		_self.initLazy();
		bodyFrame.closeAccDetail = function() {
			_self.closeAccDetail()
		}
	};
	_self.indexGoToPageEvent = function(parObj) {
		parentClass.dispatchEvent("goToPage",
			parObj)
	};
	_self.indexShowResultsDetail = function(parObj) {
		parentClass.dispatchEvent("showResultDetail", parObj)
	};
	_self.setParentclass = function(_parentclass) {
		parentClass = _parentclass;
		util = parentClass.getThis("util");
		LS = parentClass.getThis("LS");
		bodyFrame = parentClass.getThis("bodyFrame")
	};
	_self.transUniqText = function(name) {
		var tmp_name = LS.get("page_" + name);
		if (tmp_name == null) tmp_name = LS.get("page_INPLAY");
		return tmp_name
	};
	_self.transShowtypeName = function(name) {
		var nameHash = new Object;
		nameHash[name] = "";
		nameHash["INPLAY"] =
			"re";
		nameHash["TODAY"] = "today";
		nameHash["EARLY"] = "fu";
		nameHash["STARTED"] = "started";
		nameHash["PARLAY"] = "parly";
		nameHash["OUTRIGHT"] = "outright";
		if (nowTab != "outright") nameHash["RESULTS"] = "results";
		else nameHash["RESULTS"] = "results_outright";
		if (nameHash[name] == null) nameHash[name] = "results";
		return nameHash[name]
	};
	_self.transSessionName = function(name) {
		var nameHash = new Object;
		nameHash[name] = "";
		nameHash["re"] = "RB";
		nameHash["today"] = "FT";
		nameHash["fu"] = "FU";
		nameHash["started"] = "PL";
		nameHash["parly"] = "FT";
		nameHash["outright"] = "FT";
		nameHash["results"] = "FT";
		if (nameHash[name] == null) nameHash[name] = "RB";
		return nameHash[name]
	};
	_self.scroll_gtype = function(gtype) {
		var obj = document.getElementById("tbet_" + gtype);
		var obj_left = obj.offsetWidth * 1 + obj.offsetLeft * 1;
		var ul = obj.parentElement;
		var go_left = obj_left * 1 - ul.offsetWidth * 1;
		if (go_left < 0) go_left = 0;
		ul.scrollLeft = go_left
	};
	_self.changeFilter = function(param) {
		var set_rtype = param["rtype"];
		if (set_rtype == "stake") {
			filterBigObj.reDefault(set_rtype, param["param"][set_rtype]);
			filterUse["stake"] = param["param"][set_rtype]
		} else filterBigObj.reDefault(set_rtype, param["param"][set_rtype].toString())
	};
	_self.chgGtype = function(e, param) {
		choLeagueId = "all";
		var oldGtype = "FT";
		oldGtype = toppar["tbet_gtype"];
		toppar["tbet_gtype"] = param.type;
		_self.initGtype();
		if (toppar["tbet_gtype"] == oldGtype) _self.getModel(choDay, false);
		else _self.getModel(today, false);
		_self.initFilterView();
		_self.initSortBtn()
	};
	_self.initGtype = function() {
		for (var i = 0; i < gtypeAry.length; i++) {
			var _name = gtypeAry[i];
			dom.getElementById("tbet_" +
				_name).classList.remove("on")
		}
		dom.getElementById("tbet_" + toppar["tbet_gtype"]).classList.add("on");
		top.tbet_gtype = toppar["tbet_gtype"]
	};
	_self.chgResultTpye = function(e, tabStr) {
		choDay = "today";
		for (var i = 0; i < tabAry.length; i++) {
			var tmp_type = tabAry[i];
			dom.getElementById(tmp_type + "_page").classList.remove("on")
		}
		dom.getElementById(tabStr + "_page").classList.add("on");
		nowTab = tabStr;
		dom.getElementById("today_btn").classList.remove("on");
		for (var i = 0; i < dateAry.length; i++) dom.getElementById("before_" + i + "_btn").classList.remove("on");
		dom.getElementById("today_btn").classList.add("on");
		_self.initFilterView();
		_self.reloadFilterData();
		_self.initSortBtn()
	};
	_self.chgDate = function(e, obj) {
		isChgDate = true;
		var _type = obj["day_type"];
		var _date = obj["date"];
		var _week = obj["week"];
		dom.getElementById("today_btn").classList.remove("on");
		for (var i = 0; i < dateAry.length; i++) dom.getElementById("before_" + i + "_btn").classList.remove("on");
		if (_type != "today") {
			var whichDay = obj["which_day"];
			dom.getElementById("before_" + whichDay + "_btn").classList.add("on")
		} else dom.getElementById("today_btn").classList.add("on");
		choDay = _date;
		choWeek = _week;
		_self.reloadFilterData();
		_self.inputFilterView();
		_self.initSortBtn();
		_self.getModel(choDay, true)
	};
	_self.getDateList = function() {
		var param = "";
		param += top.param;
		param += "&p=get_result_date";
		hr = new HttpRequest;
		hr.addEventListener("onError", _self.onError);
		hr.addEventListener("LoadComplete", _self.LoadDateComplete);
		hr.loadURL(top.url, "POST", param)
	};
	_self.LoadDateComplete = function(json) {
		var data = JSON.parse(json);
		dateAry = data["dateValue"];
		today = data["today"];
		var dateList = data["dateList"];
		_self.parseDateList(dateList)
	};
	_self.parseDateList = function(dateList) {
		for (var i = 0; i < dateList.length; i++) dom.getElementById("before_" + i + "_btn").innerHTML = dateList[i];
		choWeek = dateAry[0].substr(-1, 1) * 1 + 1 > 7 ? "0" : dateAry[0].substr(-1, 1) * 1 + 1;
		dom.getElementById("today_btn").classList.remove("on");
		for (var i = 0; i < 6; i++) dom.getElementById("before_" + i + "_btn").classList.remove("on");
		util.addEvent(dom.getElementById("today_btn"), "click", _self.chgDate, {
			"day_type": "today",
			"date": today,
			"week": dateAry[0].substr(-1,
				1) * 1 + 1 > 7 ? "0" : dateAry[0].substr(-1, 1) * 1 + 1
		});
		if (choDay == today || choDay == "today" || choDay == "all" || choDay == undefined) dom.getElementById("today_btn").classList.add("on");
		for (var i = 0; i < dateAry.length; i++) {
			var tmp = dateAry[i].substring(0, dateAry[i].length - 2);
			if (choDay == tmp) dom.getElementById("before_" + i + "_btn").classList.add("on");
			var _dateValue = dateAry[i].substr(0, dateAry[i].length - 2);
			util.addEvent(dom.getElementById("before_" + i + "_btn"), "click", _self.chgDate, {
				"day_type": "before",
				"which_day": i,
				"date": _dateValue,
				"week": dateAry[i].substr(-1, 1) * 1
			})
		}
	};
	_self.getModel = function(date, isInit) {
		parentClass.dispatchEvent("showLoading", {
			"showLoading": true
		});
		if (isInit) {
			var param = new Object;
			param["page"] = "totalbet_model";
			param["target"] = "totalbet_model";
			param["retFun"] = _self.getModelComplete;
			param["retParam"] = date;
			param["post"] = "tbet_showtype=" + _self.transShowtypeName("RESULTS") + "&tbet_gtype=" + toppar["tbet_gtype"];
			parentClass.dispatchEvent("goToPage", param)
		} else {
			var param = new Object;
			par["sub_page"] = "totalbet_model";
			par["tab"] =
				nowTab;
			par["date"] = date;
			param["page"] = "totalbet_header";
			param["postHash"] = par;
			parentClass.dispatchEvent("bodyGoToPage", param)
		}
	};
	_self.getModelComplete = function(date) {
		_self.getData(date["retParam"])
	};
	_self.getData = function(date) {
		if (choDay == "today") choDay = today;
		if (rmbFilterLid[choDay] != undefined)
			if (rmbFilterLid[choDay] == "ALL") choLeagueId = "all";
			else choLeagueId = rmbFilterLid[choDay];
		else choLeagueId = "all";
		var param = "";
		param += top.param;
		if (nowTab != "outright")
			if (top.tbet_gtype == "ES") param += "&p=get_result_es";
			else param += "&p=get_result";
		else param += "&p=get_result_FS";
		param += "&session=" + _self.transSessionName(par["tbet_showtype"]);
		param += "&gtype=" + top.tbet_gtype;
		param += "&date=" + date;
		param += "&league_id=" + choLeagueId;
		hr = new HttpRequest;
		hr.addEventListener("onError", _self.onError);
		hr.addEventListener("LoadComplete", _self.LoadComplete);
		hr.loadURL(top.url, "POST", param)
	};
	_self.LoadComplete = function(json) {
		var hash;
		try {
			hash = JSON.parse(json);
			if (util.chkErrorMsg(hash, LS_code)) return
		} catch (e) {
			util.err("[" + classname +
				"]", e);
			return
		}
		if (nowTab != "outright") {
			if (hash["results_data"].length == 0) {
				dom.getElementById("totalbet_show").style.display = "none";
				dom.getElementById("totalbet_nodata").style.display = ""
			} else {
				dom.getElementById("totalbet_show").style.display = "";
				dom.getElementById("totalbet_nodata").style.display = "none";
				dataHash = _self.deepClone(hash);
				var finishData = _self.initSortData(dataHash["results_data"], sort_time_asc);
				_self.reSetLazy(finishData.length);
				_self.parseData(finishData)
			}
			var sort_time_btn = document.getElementById("sort_time_btn");
			sort_time_btn.classList.remove("sort_up");
			sort_time_btn.classList.remove("sort_down");
			sort_time_btn.classList.add("sort_up")
		} else if (hash["league"].length == 0) {
			dom.getElementById("totalbet_show").style.display = "none";
			dom.getElementById("totalbet_nodata").style.display = ""
		} else {
			dom.getElementById("totalbet_show").style.display = "";
			dom.getElementById("totalbet_nodata").style.display = "none";
			dataHash = _self.deepClone(hash);
			_self.reSetLazy(dataHash.length);
			_self.parseData(dataHash);
			var sort_time_btn = document.getElementById("sort_time_btn");
			sort_time_btn.classList.remove("sort_up");
			sort_time_btn.classList.remove("sort_down");
			sort_time_btn.classList.add("sort_up")
		}
		parentClass.dispatchEvent("showLoading", {
			"showLoading": false
		});
		dom.getElementById("body_show").classList.add("body_pb");
		pb_height = util.countPaddingPx(dom.getElementById("body_show").children[0])
	};
	_self.parseData = function(hash) {
		var objid = ",totalbet_show,sort_model,league_model,";
		var tmpObj = util.getObjAry(dom, objid);
		_mc = util.mergeArray(_mc, tmpObj);
		if (lazy_page == 1) {
			_mc["totalbet_show"].innerHTML =
				"";
			_mc["totalbet_show"].innerHTML = _mc["sort_model"].innerHTML;
			arr_leagueid = new Array
		}
		var showTitle = true;
		var previous_league_id = "";
		if (nowTab != "outright") {
			for (var i = (lazy_page - 1) * lazy_count; i < lazy_page * lazy_count; i++) {
				var tpl = new fastTemplate;
				var game_data = hash[i]["gid"];
				if (previous_league_id == hash[i]["league_id"]) showTitle = false;
				else showTitle = true;
				previous_league_id = hash[i]["league_id"];
				for (var j = 0; j < game_data.length; j++) {
					tpl.init(_mc["league_model"].cloneNode(true));
					tpl.addBlock("tbody");
					var tmpData =
						game_data[j];
					if (top.tbet_gtype == "ES") tpl.replace(new RegExp("\\\*GAME_ID\\\*", "gi"), tmpData["pe_segid"]);
					else tpl.replace(new RegExp("\\\*GAME_ID\\\*", "gi"), tmpData["gid"]);
					tpl.replace(new RegExp("\\\*DATETIME\\\*", "gi"), tmpData["datetime"]);
					tpl.replace(new RegExp("\\\*DATE\\\*", "gi"), tmpData["datetime"].substr(0, 5));
					tpl.replace(new RegExp("\\\*TIME\\\*", "gi"), tmpData["datetime"].substr(6, 11));
					tpl.replace(new RegExp("\\\*TEAM_H\\\*", "gi"), tmpData["team_h"]);
					tpl.replace(new RegExp("\\\*TEAM_C\\\*",
						"gi"), tmpData["team_c"]);
					if (top.tbet_gtype == "FT") {
						if (Object.keys(tmpData).indexOf("HGMH") != -1)
							if (tmpData["HGMC"] == undefined) {
								tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_H\\\*", "gi"), tmpData["HGMH"]);
								tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_C\\\*", "gi"), tmpData["HGMH"])
							} else {
								tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_H\\\*", "gi"), tmpData["HGMH"]);
								tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_C\\\*", "gi"), tmpData["HGMC"])
							}
						else {
							tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_H\\\*", "gi"), "");
							tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_C\\\*",
								"gi"), "")
						}
						if (Object.keys(tmpData).indexOf("GMH") != -1)
							if (tmpData["GMC"] == undefined) {
								tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_H\\\*", "gi"), tmpData["GMH"]);
								tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_C\\\*", "gi"), tmpData["GMH"])
							} else {
								tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_H\\\*", "gi"), tmpData["GMH"]);
								tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_C\\\*", "gi"), tmpData["GMC"])
							}
						else {
							tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_H\\\*", "gi"), "");
							tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_C\\\*",
								"gi"), "")
						}
						var tmpGameKeys = new Array;
						for (var key in tmpData)
							if (tmpData.hasOwnProperty(key)) tmpGameKeys.push(key);
						var rs_more_length = 0;
						for (var key in tmpData["rs_more"])
							if (tmpData["rs_more"].hasOwnProperty(key)) rs_more_length++;
						var rs_sfs_length = 0;
						for (var key in tmpData["rs_sfs"])
							if (tmpData["rs_sfs"].hasOwnProperty(key)) rs_sfs_length++;
						if (tmpGameKeys.indexOf("AGMH") == -1 && rs_more_length == 0 && rs_sfs_length == 0) tpl.replace(/\*STATUS\*(="")?/gi, "style='display:none;'");
						else tpl.replace(/\*STATUS\*/g, "")
					} else if (top.tbet_gtype ==
						"BK") {
						if ("GMH1" in tmpData) {
							tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_H\\\*", "gi"), tmpData["GMH1"]["result_h"]);
							tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_C\\\*", "gi"), tmpData["GMH1"]["result_c"])
						} else {
							tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_H\\\*", "gi"), "");
							tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_C\\\*", "gi"), "")
						}
						if ("GMH2" in tmpData) {
							tpl.replace(new RegExp("\\\*2nd_HALF_TEAM_H\\\*", "gi"), tmpData["GMH2"]["result_h"]);
							tpl.replace(new RegExp("\\\*2nd_HALF_TEAM_C\\\*", "gi"), tmpData["GMH2"]["result_c"])
						} else {
							tpl.replace(new RegExp("\\\*2nd_HALF_TEAM_H\\\*",
								"gi"), "");
							tpl.replace(new RegExp("\\\*2nd_HALF_TEAM_C\\\*", "gi"), "")
						}
						if ("GMH" in tmpData) {
							tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_H\\\*", "gi"), tmpData["GMH"]["result_h"]);
							tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_C\\\*", "gi"), tmpData["GMH"]["result_c"])
						} else {
							tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_H\\\*", "gi"), "");
							tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_C\\\*", "gi"), "")
						}
					} else if (top.tbet_gtype == "TN") {
						tpl.replace(new RegExp("\\\*SCOREH_S\\\*", "gi"), tmpData["GMH6"]["result_h"]);
						tpl.replace(new RegExp("\\\*SCOREH_G\\\*", "gi"), tmpData["GMH"]["result_h"]);
						tpl.replace(new RegExp("\\\*SCOREC_S\\\*", "gi"), tmpData["GMH6"]["result_c"]);
						tpl.replace(new RegExp("\\\*SCOREC_G\\\*", "gi"), tmpData["GMH"]["result_c"])
					} else if (top.tbet_gtype == "VB") {
						tpl.replace(new RegExp("\\\*SCOREH_S\\\*", "gi"), tmpData["GMH"]["result_h"]);
						tpl.replace(new RegExp("\\\*SCOREH_G\\\*", "gi"), tmpData["GMH2"]["result_h"]);
						tpl.replace(new RegExp("\\\*SCOREC_S\\\*", "gi"), tmpData["GMH"]["result_c"]);
						tpl.replace(new RegExp("\\\*SCOREC_G\\\*",
							"gi"), tmpData["GMH2"]["result_c"])
					} else if (top.tbet_gtype == "BM" || top.tbet_gtype == "TT") {
						tpl.replace(new RegExp("\\\*SCOREH_S\\\*", "gi"), tmpData["GMH"]["result_h"]);
						tpl.replace(new RegExp("\\\*SCOREH_G\\\*", "gi"), tmpData["GMH1"]["result_h"]);
						tpl.replace(new RegExp("\\\*SCOREC_S\\\*", "gi"), tmpData["GMH"]["result_c"]);
						tpl.replace(new RegExp("\\\*SCOREC_G\\\*", "gi"), tmpData["GMH1"]["result_c"])
					} else if (top.tbet_gtype == "BS") {
						tpl.replace(new RegExp("\\\*HGMH_H\\\*", "gi"), tmpData["HGMH"]["result_h"]);
						tpl.replace(new RegExp("\\\*HGMH_C\\\*", "gi"), tmpData["HGMH"]["result_c"]);
						tpl.replace(new RegExp("\\\*GMH_H\\\*", "gi"), tmpData["GMH"]["result_h"]);
						tpl.replace(new RegExp("\\\*GMH_C\\\*", "gi"), tmpData["GMH"]["result_c"])
					} else if (top.tbet_gtype == "SK") {
						tpl.replace(new RegExp("\\\*SC_GAME_H\\\*", "gi"), tmpData["GMH"]["result_h"]);
						tpl.replace(new RegExp("\\\*SC_GAME_A\\\*", "gi"), tmpData["GMH"]["result_c"])
					} else if (top.tbet_gtype == "OP") {
						tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_H\\\*", "gi"),
							tmpData["HGMH"]["result_h"]);
						tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_H\\\*", "gi"), tmpData["GMH"]["result_h"]);
						tpl.replace(new RegExp("\\\*1ST_HALF_TEAM_C\\\*", "gi"), tmpData["HGMH"]["result_c"]);
						tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_C\\\*", "gi"), tmpData["GMH"]["result_c"])
					} else if (top.tbet_gtype == "ES") {
						var tmp_score_h = typeof tmpData["GMH"] != "undefined" ? tmpData["GMH"] : "-";
						var tmp_score_c = typeof tmpData["GMC"] != "undefined" ? tmpData["GMC"] : "-";
						tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_H\\\*",
							"gi"), tmp_score_h);
						tpl.replace(new RegExp("\\\*FULL_TIME_TEAM_C\\\*", "gi"), tmp_score_c);
						if (typeof tmpData["DURATION"] != "undefined" && tmpData["DURATION"] != "") tpl.replace(new RegExp("\\\*DURATION\\\*", "gi"), tmpData["DURATION"]);
						else tpl.replace(new RegExp("\\\*DURATION\\\*", "gi"), "-")
					}
				}
				var tmp_league_html = tpl.fastPrint();
				if (showTitle) tmp_league_html = tmp_league_html.replace(/\*SHOWTITLE\*/g, "");
				else tmp_league_html = tmp_league_html.replace(/\*SHOWTITLE\*/g, "none");
				tmp_league_html = tmp_league_html.replace(/\*ID\*/g,
					i);
				tmp_league_html = tmp_league_html.replace(/\*LEAGUE_ID\*/g, hash[i]["league_id"]);
				tmp_league_html = tmp_league_html.replace(/\*LEAGUE\*/g, hash[i]["league_name"]);
				_mc["totalbet_show"].innerHTML += tmp_league_html;
				arr_leagueid.push("re_head_fixed_" + i);
				if (i == hash.length - 1) break
			}
			num_leagueid = arr_leagueid.length;
			if (rmbStorageHead[choDay] != null)
				for (var i = 0; i < rmbStorageHead[choDay].length; i++) {
					var storageNoAry = rmbStorageHead[choDay];
					var lid = storageNoAry[i];
					var divAry = document.getElementsByName(lid);
					for (var j =
							0; j < divAry.length; j++) {
						var tmpDiv = divAry[j];
						tmpDiv.classList.add("active")
					}
				}
			_self.setSortClick(true);
			for (var i = 0; i < hash.length; i++) {
				util.addEvent(dom.getElementById("re_head_fixed_" + i), "click", _self.foldResults, {
					"id": i
				});
				var game_data = hash[i]["gid"];
				for (var j = 0; j < game_data.length; j++) {
					var tmp_data = game_data[j];
					if (top.tbet_gtype == "ES") util.addEvent(dom.getElementById("show_details_" + tmp_data["pe_segid"]), "click", _self.viewDetail, {
						"gtype": top.tbet_gtype,
						"pe_segid": tmp_data["pe_segid"],
						"game_data": tmp_data,
						"week": choWeek
					});
					else util.addEvent(dom.getElementById("show_details_" + tmp_data["gid"]), "click", _self.viewDetail, {
						"gtype": top.tbet_gtype,
						"gid": tmp_data["gid"],
						"game_data": tmp_data,
						"week": choWeek
					})
				}
			}
		} else {
			var leagueCnt = 0;
			for (tmp in hash["league"]) {
				var tpl = new fastTemplate;
				var league_data = hash["league"][tmp];
				var all_game_data = league_data["gid"];
				for (var i = 0; i < all_game_data.length; i++) {
					var game_data = all_game_data[i];
					var winnerAry = new Array;
					if (game_data["winner"] != "") var winnerAry = game_data["winner"].split(",");
					var tmp_winner = "";
					for (var k = 0; k < winnerAry.length; k++) {
						tmp_winner += winnerAry[k];
						if (k + 1 < winnerAry.length) tmp_winner += "<BR>"
					}
					tpl.init(_mc["league_model"].cloneNode(true));
					tpl.addBlock("tbody");
					tpl.replace(new RegExp("\\\*DATETIME\\\*", "gi"), game_data["date"].substr(5) + " " + game_data["time"].substr(0, 5));
					tpl.replace(new RegExp("\\\*DATE\\\*", "gi"), game_data["date"].substr(5));
					tpl.replace(new RegExp("\\\*TIME\\\*", "gi"), game_data["time"].substr(0, 5));
					tpl.replace(new RegExp("\\\*NAME\\\*", "gi"),
						game_data["name"]);
					tpl.replace(new RegExp("\\\*WINNER\\\*", "gi"), tmp_winner)
				}
				var tmp_league_html = tpl.fastPrint();
				if (showTitle) tmp_league_html = tmp_league_html.replace(/\*SHOWTITLE\*/g, "");
				else tmp_league_html = tmp_league_html.replace(/\*SHOWTITLE\*/g, "none");
				tmp_league_html = tmp_league_html.replace(/\*ID\*/g, leagueCnt);
				tmp_league_html = tmp_league_html.replace(/\*LEAGUE_ID\*/g, league_data["league_id"]);
				tmp_league_html = tmp_league_html.replace(/\*LEAGUE\*/g, league_data["league_name"]);
				_mc["totalbet_show"].innerHTML +=
					tmp_league_html;
				arr_leagueid.push("re_head_fixed_" + leagueCnt);
				leagueCnt++
			}
			num_leagueid = arr_leagueid.length;
			if (rmbStorageHead[choDay] != null)
				for (var i = 0; i < rmbStorageHead[choDay].length; i++) {
					var storageNoAry = rmbStorageHead[choDay];
					var lid = storageNoAry[i];
					var divAry = document.getElementsByName(lid);
					for (var j = 0; j < divAry.length; j++) {
						var tmpDiv = divAry[j];
						tmpDiv.classList.add("active")
					}
				}
			_self.setSortClick(true);
			for (var i = 0; i < hash["league"].length; i++) util.addEvent(dom.getElementById("re_head_fixed_" + i), "click",
				_self.foldResults, {
					"id": i
				})
		}
		if (lazy_page == 1) _self.initScroll();
		_self.setLzayLoadingVisible(false)
	};
	_self.foldResults = function(e, obj) {
		var no = obj["id"];
		if (rmbStorageHead[choDay] != null) nowStorageAry = rmbStorageHead[choDay];
		var status = dom.getElementById("re_head_fixed_" + no).classList;
		var tmpLid = dom.getElementById("re_head_fixed_" + no).getAttribute("name");
		var hasActive;
		var headerClass = dom.getElementById("re_head_fixed_" + no).className;
		if (headerClass.indexOf("active") == -1) hasActive = true;
		else hasActive = false;
		if (hasActive) {
			status.add("active");
			if (nowStorageAry.indexOf(no) == -1) nowStorageAry.push(tmpLid)
		} else {
			status.remove("active");
			var tmpAry = new Array;
			for (var i = 0; i < nowStorageAry.length; i++) {
				var tmp = nowStorageAry[i];
				if (tmp != tmpLid) tmpAry.push(tmpLid)
			}
			nowStorageAry = tmpAry
		}
		rmbStorageHead[choDay] = nowStorageAry
	};
	_self.viewDetail = function(e, obj) {
		var postHash = new Object;
		if (obj.gtype == "ES") postHash["pe_segid"] = obj.pe_segid;
		else postHash["gid"] = obj.gid;
		postHash["data"] = obj.game_data;
		postHash["gtype"] = obj.gtype;
		postHash["week"] = obj.week;
		var param = new Object;
		param["page"] = "result_detail";
		param["postHash"] = postHash;
		param["post"] = "gtype=" + obj.gtype;
		param["gtype"] = obj.gtype;
		_self.closeAccDetail();
		nowDetail = obj.gtype == "ES" ? "game_" + obj.pe_segid : "game_" + obj.gid;
		dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
		parentClass.dispatchEvent("showResultDetail", param)
	};
	_self.closeAccDetail = function() {
		if (dom.getElementById(nowDetail)) dom.getElementById(nowDetail).classList.remove("tr_bgebf7ff");
		nowDetail = ""
	};
	_self.initScroll = function() {
		header_height = dom.getElementById("main_header").clientHeight;
		footer_height = dom.getElementById("footer_show").clientHeight;
		util.removeEvent(dom.getElementById("ma_content"), "scroll");
		if (top.tbet_showtype == "OUTRIGHT") fixed_div_height = 0;
		else fixed_div_height = dom.getElementById("totalbet_show").children[0].nextElementSibling.clientHeight;
		util.addEvent(dom.getElementById("ma_content"), "scroll", _self.scrollVerEvent, dom.getElementById("totalbet_show"));
		now_fix_league = 0;
		var t =
			new Object;
		t.target = dom.getElementById("ma_content");
		_self.scrollVerEvent(t, dom.getElementById("totalbet_show"))
	};
	_self.scrollVerEvent = function(e, targetObj) {
		_self.scroll_ver_event(e, targetObj)
	};
	_self.scroll_ver_event = function(e, targetObj) {
		if (e == null || !dom.getElementById("re_function")) return;
		if (filterBigObj) filterBigObj.closeAllDownlist();
		var newScrollTop = e.target.scrollTop;
		var func_h = dom.getElementById("re_function").clientHeight + dom.getElementById("re_function").offsetTop + header_height;
		if (fixed_div_height ==
			0 && top.tbet_showtype != "OUTRIGHT") fixed_div_height = dom.getElementById("totalbet_show").children[0].nextElementSibling.clientHeight;
		if (newScrollTop >= func_h) {
			util.classFunc(targetObj, "tbet_title_fixed");
			if (top.tbet_showtype == "RESULTS") util.classFunc(targetObj, "results");
			var use_class = "tbet_fixed_2rditem";
			if (now_fix_league == 0)
				for (var key in arr_leagueid) {
					var tmp_ = dom.getElementById(arr_leagueid[key]);
					if (newScrollTop + fixed_div_height + tmp_.clientHeight >= tmp_.offsetTop + targetObj.offsetTop + header_height) {
						now_fix_league =
							key;
						front_league_bak_height = tmp_.offsetTop + targetObj.offsetTop + header_height
					} else {
						if (now_fix_league > 0) now_fix_league++;
						break
					}
				}
			if (num_leagueid > 0 && now_fix_league < num_leagueid) {
				var fixed_league = dom.getElementById(arr_leagueid[now_fix_league]);
				var fixed_league_height = fixed_league.offsetTop + targetObj.offsetTop + header_height;
				if (now_fix_league > 0) fixed_league_height += fixed_league.clientHeight;
				else fixed_league_height -= 8;
				if (newScrollTop + fixed_div_height + fixed_league.clientHeight >= fixed_league_height) {
					if (now_fix_league >
						0) {
						util.classFunc(dom.getElementById(arr_leagueid[now_fix_league - 1]), use_class, "remove");
						util.classFunc(dom.getElementById(arr_leagueid[now_fix_league - 1]), "down_head");
						util.classFunc(fixed_league, use_class)
					} else util.classFunc(fixed_league, use_class);
					front_league_bak_height = fixed_league_height;
					now_fix_league++
				} else if (now_fix_league > 1) {
					var front_fixed_league = dom.getElementById(arr_leagueid[now_fix_league - 1]);
					var front_fixed_league2 = dom.getElementById(arr_leagueid[now_fix_league - 2]);
					if (newScrollTop +
						fixed_div_height + front_fixed_league.clientHeight <= front_league_bak_height) {
						if (top.tbet_showtype == "OUTRIGHT") front_league_bak_height = front_fixed_league2.offsetTop + targetObj.offsetTop - fixed_div_height;
						else front_league_bak_height = front_fixed_league2.offsetTop + targetObj.offsetTop - fixed_div_height + front_fixed_league2.clientHeight;
						util.classFunc(front_fixed_league, use_class, "remove");
						util.classFunc(front_fixed_league2, "down_head", "remove");
						util.classFunc(front_fixed_league2, use_class);
						now_fix_league--
					} else {
						util.classFunc(front_fixed_league,
							use_class);
						util.classFunc(front_fixed_league2, "down_head")
					}
				} else util.classFunc(fixed_league, use_class, "remove")
			} else {
				if (num_leagueid < 2) return;
				var front_fixed_league = dom.getElementById(arr_leagueid[now_fix_league - 1]);
				var front_fixed_league2 = dom.getElementById(arr_leagueid[now_fix_league - 2]);
				if (newScrollTop + fixed_div_height + front_fixed_league.clientHeight <= front_league_bak_height) {
					if (top.tbet_showtype == "OUTRIGHT") front_league_bak_height = front_fixed_league2.offsetTop + targetObj.offsetTop - fixed_div_height;
					else front_league_bak_height = front_fixed_league2.offsetTop + 12 + targetObj.offsetTop - fixed_div_height + front_fixed_league2.clientHeight;
					util.classFunc(front_fixed_league, use_class, "remove");
					util.classFunc(front_fixed_league2, use_class);
					now_fix_league--
				} else util.classFunc(front_fixed_league, use_class)
			}
		} else {
			util.classFunc(targetObj, "tbet_title_fixed", "remove");
			if (top.tbet_showtype == "RESULTS") util.classFunc(targetObj, "results", "remove")
		}
		_self.checkShowLazyLoading(e.target)
	};
	_self.sortData = function(ary,
		types, up_down) {
		if (ary.length <= 1) return ary;
		if (types == "league_name") var string_type = "league_name";
		else if (types == "time") var string_type = "time";
		if (string_type.indexOf(types) == -1)
			if (up_down) var sortfun = function(a, b) {
				var ret;
				a[types] = a[types] + "";
				b[types] = b[types] + "";
				var a_val = a[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
				var b_val = b[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
				if (isNaN(a_val)) a_val = 0;
				if (isNaN(b_val)) b_val = 0;
				ret = a_val - b_val;
				return ret
			};
			else var sortfun =
				function(a, b) {
					var ret;
					a[types] = a[types] + "";
					b[types] = b[types] + "";
					var a_val = a[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
					var b_val = b[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
					if (isNaN(a_val)) a_val = 0;
					if (isNaN(b_val)) b_val = 0;
					ret = b_val - a_val;
					return ret
				};
		else if (up_down) var sortfun = function(a, b) {
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
	_self.setSortClick = function(isSet) {
		var sort_time_btn = document.getElementById("sort_time_btn");
		var sort_league_btn = document.getElementById("sort_league_btn");
		var _sort_time_type = sort_time_btn.getAttribute("data-sort");
		var _sort_league_type = sort_league_btn.getAttribute("data-sort");
		if (isSet) {
			_self.addSortClick(sort_time_btn, _sort_time_type);
			_self.addSortClick(sort_league_btn, _sort_league_type)
		}
	};
	_self.addSortClick = function(obj, _sort_type) {
		util.addEvent(obj, "click", _self.chgSortField, {
			"sort_type": _sort_type
		})
	};
	_self.chgSortField = function(e, param) {
		lazy_page = 1;
		_self.set_scroll_top();
		if (param.sort_type == "time") {
			sort_time_asc = !sort_time_asc;
			_self.setSortClick(false);
			if (nowTab != "outright") {
				var finishSortTimeData;
				var tmpSortTimeData = _self.deepClone(dataHash);
				finishSortTimeData = _self.initSortData(tmpSortTimeData["results_data"], sort_time_asc);
				_self.parseData(finishSortTimeData)
			} else {
				var finishSortData = new Object;
				var readySortData = new Array;
				var resultData_league = dataHash["league"];
				for (var i = 0; i < resultData_league.length; i++) {
					var resultData_game =
						resultData_league[i]["gid"];
					var tmpLeague_id;
					var tmpLeague_name;
					var tmpGame_time;
					for (var j = 0; j < resultData_game.length; j++) {
						var gameData = new Object;
						var tmpGameData = new Array;
						tmpGameData.push(resultData_game[j]);
						tmpLeague_id = resultData_league[i]["league_id"];
						tmpLeague_name = resultData_league[i]["league_name"];
						tmpGame_time = resultData_game[j]["time"];
						gameData["gid"] = tmpGameData;
						gameData["league_id"] = tmpLeague_id;
						gameData["league_name"] = tmpLeague_name;
						gameData["time"] = tmpGame_time;
						readySortData.push(gameData)
					}
				}
				_self.sortData(readySortData,
					param.sort_type, sort_time_asc);
				finishSortData["league"] = readySortData;
				_self.parseData(finishSortData)
			}
			var sort_time_btn = document.getElementById("sort_time_btn");
			var str_time_sort = sort_time_asc ? "sort_down" : "sort_up";
			sort_time_btn.classList.remove("sort_up");
			sort_time_btn.classList.remove("sort_down");
			sort_time_btn.classList.add(str_time_sort)
		} else if (param.sort_type == "league_name") {
			sort_league_asc = !sort_league_asc;
			_self.setSortClick(false);
			var tmpSortLeagueData = _self.deepClone(dataHash);
			if (nowTab !=
				"outright") {
				if (param.sort_type == "league_name") _self.sortData(tmpSortLeagueData["results_data"], param.sort_type, sort_league_asc);
				for (var i = 0; i < tmpSortLeagueData["results_data"].length; i++) {
					var tmpData = tmpSortLeagueData["results_data"][i]["gid"];
					_self.sortData(tmpData, "time", true);
					tmpSortLeagueData["results_data"][i]["gid"] = tmpData
				}
				_self.parseData(tmpSortLeagueData["results_data"])
			} else {
				if (param.sort_type == "league_name") _self.sortData(tmpSortLeagueData["league"], param.sort_type, sort_league_asc);
				for (var i =
						0; i < tmpSortLeagueData["league"].length; i++) {
					var tmpData = tmpSortLeagueData["league"][i]["gid"];
					_self.sortData(tmpData, "time", true);
					tmpSortLeagueData["league"][i]["gid"] = tmpData
				}
				_self.parseData(tmpSortLeagueData)
			}
			var sort_league_btn = document.getElementById("sort_league_btn");
			var str_league_sort = sort_league_asc ? "sort_down" : "sort_up";
			sort_league_btn.classList.remove("sort_up");
			sort_league_btn.classList.remove("sort_down");
			sort_league_btn.classList.add(str_league_sort)
		}
	};
	_self.initSortData = function(_data,
		up_down) {
		var readySortData = new Array;
		var resultData_league = _data;
		for (var i = 0; i < resultData_league.length; i++) {
			var resultData_game = resultData_league[i]["gid"];
			var tmpLeague_id;
			var tmpLeague_name;
			var tmpGame_time;
			for (var j = 0; j < resultData_game.length; j++) {
				var gameData = new Object;
				var tmpGameData = new Array;
				tmpGameData.push(resultData_game[j]);
				tmpLeague_id = resultData_game[j]["league_id"];
				tmpLeague_name = resultData_game[j]["league_name"];
				tmpGame_time = resultData_game[j]["time"];
				gameData["gid"] = tmpGameData;
				gameData["league_id"] = tmpLeague_id;
				gameData["league_name"] = tmpLeague_name;
				gameData["time"] = tmpGame_time;
				readySortData.push(gameData)
			}
		}
		_self.sortData(readySortData, "time", up_down);
		var finData = new Array;
		var finObj = new Object;
		var gameDataAry = new Array;
		var preLeagueId = "";
		var isFirst = true;
		var num = 0;
		for (var i = 0; i < readySortData.length; i++) {
			var _data = readySortData[i]["gid"][0];
			var _lid = readySortData[i]["league_id"];
			var _lname = readySortData[i]["league_name"];
			if (preLeagueId != _lid) {
				var gameDataAry = new Array;
				var finObj = new Object;
				if (isFirst) isFirst = false;
				else num++
			}
			gameDataAry.push(_data);
			finObj["gid"] = gameDataAry;
			finObj["league_id"] = _lid;
			finObj["league_name"] = _lname;
			finData[num] = finObj;
			preLeagueId = readySortData[i]["league_id"]
		}
		return finData
	};
	_self.initSortBtn = function() {
		var sort_time_btn = document.getElementById("sort_time_btn");
		var sort_league_btn = document.getElementById("sort_league_btn");
		sort_time_btn.classList.remove("sort_up");
		sort_time_btn.classList.remove("sort_down");
		sort_league_btn.classList.remove("sort_up");
		sort_league_btn.classList.remove("sort_down")
	};
	_self.loadFilterData = function() {
		_self.reloadFilterData()
	};
	_self.reloadFilterData = function() {
		if (nowTab != "outright") {
			var par = "";
			par += top.param;
			par += "&p=get_result_filter_data";
			par += "&totalBets=result_" + nowTab;
			par += "&gtype=" + top.tbet_gtype;
			par += "&date=" + choDay;
			var getHttp = new HttpRequest;
			getHttp.addEventListener("onError", _self.onError);
			getHttp.addEventListener("LoadComplete", _self.loadFilterFinish);
			getHttp.loadURL(top.url, "POST", par)
		} else {
			var par = "";
			par +=
				top.param;
			par += "&p=get_result_filter_data";
			par += "&totalBets=outright_ft_league";
			par += "&session=FS";
			par += "&gtype=" + top.tbet_gtype;
			par += "&date=" + choDay;
			var getHttp = new HttpRequest;
			getHttp.addEventListener("onError", _self.onError);
			getHttp.addEventListener("LoadComplete", _self.loadFilterFinish);
			getHttp.loadURL(top.url, "POST", par)
		}
	};
	_self.loadFilterFinish = function(json) {
		var hash;
		try {
			hash = JSON.parse(json)
		} catch (e) {
			util.err("[" + classname + "]", e);
			return
		}
		var _hash = new Array;
		for (var key in hash["popular"]) _hash.push(hash["popular"][key]);
		for (var key in hash["normal"]) _hash.push(hash["normal"][key]);
		data_filter = _hash;
		_self.setSelectEvent()
	};
	_self.setSelectEvent = function() {
		if (filterBigObj == null) {
			for (var rtype in filterInitParam) {
				var rDom = dom.getElementById(rtype + "_div");
				var rSel = dom.getElementById(rtype + "_sel");
				var rNow = dom.getElementById(rtype + "_now");
				var rSearch = dom.getElementById(rtype + "_search");
				var rShowDiv = dom.getElementById(rtype + "_show");
				filterInitParam[rtype]["_titleName"] = LS.get("btns_league");
				if (filterInitParam[rtype]["mode"] *
					1 == 3) {
					var tmpAry = [];
					for (var i = 0; i < filterInitParam[rtype]["_breakpoint"].length; i++) {
						var tmpObj = new Object;
						var rpoint = dom.getElementById(rtype + "_point" + (i + 1));
						filterInitParam[rtype]["_breakpoint"][i].div = rpoint
					}
					var tmpkeysAry = Object.keys(filterInitParam[rtype]["_chkBtnDiv"]);
					for (var i = 0; i < tmpkeysAry.length; i++) {
						var tmpKey = tmpkeysAry[i];
						var rbtn = dom.getElementById(rtype + "_chkBtn" + (i + 1));
						filterInitParam[rtype]["_chkBtnDiv"][tmpKey].div = rbtn
					}
				}
				filterInitParam[rtype]["_setDiv"] = rDom;
				filterInitParam[rtype]["_contantView"] =
					rSel;
				filterInitParam[rtype]["_titleView"] = rNow;
				if (rSearch) filterInitParam[rtype]["_searchDiv"] = rSearch;
				if (rShowDiv) filterInitParam[rtype]["_dataShowDiv"] = rShowDiv;
				filterInitParam[rtype]["_data"] = data_filter;
				util.addEvent(dom.getElementById("f_" + rtype + "_small"), "click", _self.openSmallFilter, {
					"dataSet": filterInitParam[rtype],
					"rtype": rtype
				})
			}
			filterBigObj = new util.filterBig(win, dom);
			filterBigObj.setParentclass(parentClass);
			filterBigObj.addEventListenEvent();
			filterBigObj.addEventListener("autoBackParam",
				_self.takeParam);
			filterBigObj.init(filterInitParam)
		} else {
			var tmpObj = new Object;
			var tmpAry = ["downline"];
			for (var i = 0; i < tmpAry.length; i++) {
				var rtype = tmpAry[i];
				if (data_filter) {
					filterInitParam[rtype]["_data"] = data_filter;
					var tmpStr = "";
					if (rmbFilterLid[choDay] == undefined) tmpStr = "ALL";
					else tmpStr = rmbFilterLid[choDay];
					tmpObj[rtype] = {
						"_data": data_filter,
						"_default": tmpStr
					}
				} else tmpObj[rtype] = {
					"_data": {},
					"_default": "ALL"
				}
			}
			filterBigObj.reinit(tmpObj)
		}
		util.addEvent(dom.getElementById("search_txt"), "focus", _self.onFocusEventHandler, {
			"target": dom.getElementById("search_Div")
		});
		util.addEvent(dom.getElementById("search_txt"), "blur", _self.onBlurEventHandler, {
			"target": dom.getElementById("search_Div")
		})
	};
	_self.takeParam = function(obj) {
		if (isChgDate != true) {
			if (choDay == "today") rmbFilterLid[today] = obj.downline;
			else rmbFilterLid[choDay] = obj.downline;
			filterUse = obj;
			_self.inputFilterView();
			_self.getModel(choDay, true)
		}
		isChgDate = false
	};
	_self.initFilterView = function() {
		dom.getElementById("all_league_title").style.display = "";
		dom.getElementById("downline_now").style.display =
			"none";
		dom.getElementById("league_count_title").style.display = "none";
		dom.getElementById("all_league_title_small").style.display = "";
		dom.getElementById("downline_now_small").style.display = "none";
		dom.getElementById("league_count_title_small").style.display = "none";
		filterInitParam.downline._default = "ALL"
	};
	_self.inputFilterView = function() {
		if (rmbFilterLid[choDay] != undefined)
			if (rmbFilterLid[choDay] == "ALL") {
				dom.getElementById("all_league_title").style.display = "";
				dom.getElementById("downline_now").style.display =
					"none";
				dom.getElementById("league_count_title").style.display = "none";
				dom.getElementById("all_league_title_small").style.display = "";
				dom.getElementById("downline_now_small").style.display = "none";
				dom.getElementById("league_count_title_small").style.display = "none"
			} else {
				dom.getElementById("all_league_title").style.display = "none";
				dom.getElementById("downline_now").style.display = "";
				dom.getElementById("league_count_title").style.display = "";
				dom.getElementById("all_league_title_small").style.display = "none";
				dom.getElementById("downline_now_small").style.display = "";
				dom.getElementById("league_count_title_small").style.display = "";
				var tmpAry = rmbFilterLid[choDay].split(",");
				var choLeagueNum = tmpAry.length;
				dom.getElementById("downline_now").innerHTML = choLeagueNum;
				dom.getElementById("downline_now_small").innerHTML = choLeagueNum
			}
		else {
			dom.getElementById("all_league_title").style.display = "";
			dom.getElementById("downline_now").style.display = "none";
			dom.getElementById("league_count_title").style.display = "none";
			dom.getElementById("all_league_title_small").style.display =
				"";
			dom.getElementById("downline_now_small").style.display = "none";
			dom.getElementById("league_count_title_small").style.display = "none"
		}
	};
	_self.openSmallFilter = function(e, _par) {
		var _par = _par;
		_par.dataSet["rtype"] = _par["rtype"];
		_par.dataSet["_default"] = "";
		if (_par["rtype"] == "stake") _par.dataSet["_default"] = toppar["stake_obj"];
		else _par.dataSet["_default"] = rmbFilterLid[choDay];
		if (getView().viewportwidth < 1024) parentClass.dispatchEvent("showOverviewFilter", _par.dataSet);
		else;
	};
	_self.onFocusEventHandler = function(e,
		param) {
		param.target.classList.add("focus_input")
	};
	_self.onBlurEventHandler = function(e, param) {
		param.target.classList.remove("focus_input")
	};
	_self.deepClone = function(initalObj) {
		var obj = new Object;
		obj = JSON.parse(JSON.stringify(initalObj));
		return obj
	};
	_self.onError = function() {
		console.log("onError")
	};
	_self.getThis = function(varible) {
		return eval(varible)
	};
	_self.exitEvent = function() {
		return true
	};
	_self.backPage = function(e, param) {
		parentClass.dispatchEvent("backPage", {
			"retFun": _self.backPageComplete
		})
	};
	_self.backPageComplete =
		function() {};
	_self.changePage = function(e, param) {
		param.retFun = _self.changePageComplete;
		parentClass.dispatchEvent("bodyGoToPage", param)
	};
	_self.changePageComplete = function() {};
	_self.addEventListener = function(eventname, eventFunction) {
		eventHandler[eventname] = eventFunction
	};
	_self.dispatchEvent = function(eventname, param) {
		if (eventHandler[eventname]) eventHandler[eventname](param)
	};
	_self.checkShowLazyLoading = function(target) {
		if (!lazy_sw) return;
		var newScrollTop = target.scrollTop;
		var s_h = target.scrollHeight;
		var c_h =
			target.clientHeight;
		var scroll_bottom = newScrollTop >= s_h - c_h - footer_height - pb_height;
		if (scroll_bottom && !lazy_loading)
			if (lazy_page < lazy_total_page) {
				_self.setLzayLoadingVisible(true);
				retryTimer = setTimeout(_self.loadLazyData, 300)
			}
	};
	_self.setLzayLoadingVisible = function(isShow) {
		if (!lazy_sw) return;
		lazy_loading = isShow;
		dom.getElementById("report_loading").style.display = isShow ? "" : "none"
	};
	_self.loadLazyData = function() {
		if (!lazy_sw) return;
		lazy_loading = true;
		if (lazy_page < lazy_total_page) {
			lazy_page++;
			var finishData =
				_self.initSortData(dataHash["results_data"], sort_time_asc);
			_self.parseData(finishData)
		}
	};
	_self.initLazy = function() {
		lazy_sw = config_set.get("LAZY_SW") || false;
		lazy_page = 1;
		lazy_total_page = 1;
		lazy_count = 10
	};
	_self.reSetLazy = function(row0) {
		_self.initLazy();
		lazy_total_page = row0 ? Math.ceil(row0 / lazy_count) : 1
	};
	_self.set_scroll_top = function() {
		dom.getElementById("ma_content").scrollTop = 0
	}
};