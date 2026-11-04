function ES_result_detail(_win, _dom, _post) {
	var classname = "ES_result_detail";
	var _self = this;
	var win = _win;
	var dom = _dom;
	var parentClass;
	var util;
	var LS;
	var postHash = _post;
	var htmlModel = null;
	var detailData_keys = new Array;
	for (var key in postHash["data"])
		if (postHash["data"].hasOwnProperty(key)) detailData_keys.push(key);
	var periodsCnt = 0;
	for (var i = 0; i < detailData_keys.length; i++) {
		var tmpkey = detailData_keys[i];
		if (tmpkey.indexOf("GMH") != -1) periodsCnt++
	}
	if (top.langx == "zh-tw" || top.langx == "zh-cn") var weekAry = ["日",
		"一", "二", "三", "四", "五", "六"
	];
	else if (top.langx == "en-us") var weekAry = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var week = weekAry[postHash["week"]];
	var minHtml = "";
	var otherHtml = "";
	var header_h;
	var secondHeaderTop;
	_self.init = function() {
		_self.parseData(postHash);
		util.addEvent(dom.getElementById("scroll_control"), "scroll", _self.scrollEvent, dom.getElementById("scroll_control"))
	};
	_self.scrollEvent = function(e, targetObj) {
		scroll_e = e;
		_self.scroll_ver_event(e, targetObj)
	};
	_self.scroll_ver_event =
		function(e, targetObj) {
			if (e == null || !dom.getElementById("scroll_control")) return;
			var newScrollTop = e.target.scrollTop;
			if (newScrollTop == 0) {
				dom.getElementById("scroll_header").style.display = "none";
				dom.getElementById("scroll_header").innerHTML = "";
				dom.getElementById("minute_result").style.visibility = ""
			}
			if (newScrollTop > 0 && newScrollTop < secondHeaderTop) {
				dom.getElementById("scroll_header").innerHTML = minHtml;
				dom.getElementById("scroll_header").style.display = "";
				dom.getElementById("minute_result").style.visibility =
					"hidden";
				dom.getElementById("other_result").style.visibility = ""
			}
			if (newScrollTop >= secondHeaderTop) {
				dom.getElementById("scroll_header").innerHTML = otherHtml;
				dom.getElementById("other_result").style.visibility = "hidden"
			}
		};
	_self.parseData = function(obj) {
		var showOtherTitle = true;
		var gameData = obj["data"];
		var time_title;
		if (htmlModel == null) htmlModel = dom.getElementById("detail_show").cloneNode(true);
		var tpl = new fastTemplate;
		tpl.init(htmlModel.cloneNode(true));
		var score_type_h = Array("GMH");
		var score_type_c = Array("GMC");
		for (var i = 0; i < score_type_h.length; i++) {
			var tmp_score_h = typeof gameData[score_type_h[i]] != "undefined" ? gameData[score_type_h[i]] : "-";
			var tmp_score_c = typeof gameData[score_type_c[i]] != "undefined" ? gameData[score_type_c[i]] : "-";
			tpl.addBlock("GAME");
			tpl.replace(new RegExp("\\\\*MINUTE_STATUS\\\\*", "gi"), "");
			tpl.replace(new RegExp("\\\\*TEAM_H_SCORE\\\\*", "gi"), tmp_score_h);
			tpl.replace(new RegExp("\\\\*TEAM_C_SCORE\\\\*", "gi"), tmp_score_c)
		}
		tpl.addBlock("DURATION");
		var tmp_duration = typeof gameData["DURATION"] !=
			"undefined" ? gameData["DURATION"] : "-";
		tpl.replace(new RegExp("\\\\*DURATION\\\\*", "gi"), tmp_duration);
		var rs_more_length = 0;
		for (var key in gameData["rs_more"])
			if (gameData["rs_more"].hasOwnProperty(key)) rs_more_length++;
		if (rs_more_length != "0")
			for (var x = 0; x < gameData.rs_more.length; x++) Object.entries(gameData.rs_more[x]).forEach(([key, value]) => {
				var tmp_ary = key.split("_");
				var tmp_result = value["GMH_result"] != "0" ? value["GMH_result"] : value["GMH"] + " - " + value["GMC"];
				tpl.addBlock("WTYPE");
				if (tmp_result != undefined) {
					tpl.replace(new RegExp("\\\\*OTHER_STATUS\\\\*",
						"gi"), "");
					tpl.replace(new RegExp("\\\\*MORE_WTYPE\\\\*", "gi"), LS.get("ES_" + tmp_ary[1]));
					tpl.replace(new RegExp("\\\\*RESULT\\\\*", "gi"), tmp_result)
				} else tpl.replace(new RegExp("\\\\*OTHER_STATUS\\\\*", "gi"), "style='display:none;'")
			});
		else {
			tpl.addBlock("WTYPE");
			tpl.replace(new RegExp("\\\\*OTHER_STATUS\\\\*", "gi"), "style='display:none;'");
			showOtherTitle = false
		}
		var div_show = document.getElementById("detail_show");
		div_show.innerHTML = tpl.fastPrint();
		dom.getElementById("minute_result").style.display = "";
		if (showOtherTitle) dom.getElementById("other_result").style.display = "";
		else dom.getElementById("other_result").style.display = "none";
		dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*LEAGUENAME\*/g, gameData["league_name"]);
		dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TIME_TYPE\*/g, time_title);
		dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TEAM_H\*/g,
			gameData["team_h"]);
		dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TEAM_C\*/g, gameData["team_c"]);
		dom.getElementById("detail_show").innerHTML = dom.getElementById("detail_show").innerHTML.replace(/\*TIME\*/g, gameData["datetime"] + " (" + week + ")");
		util.addEvent(dom.getElementById("back_btn"), "click", _self.backEvent);
		minHtml = dom.getElementById("minute_result").innerHTML;
		otherHtml = dom.getElementById("other_result").innerHTML;
		header_h = dom.getElementById("minute_result").clientHeight;
		secondHeaderTop = header_h * (periodsCnt + 1)
	};
	_self.getManualRS = function(_wtype, _result, _type, _team_h, _team_c) {
		var showResult = _result;
		var openResult = _type;
		var out = "";
		if (openResult == "DL") out = "";
		if (openResult == "-") out = "-";
		else if (showResult != "") out = showResult;
		else {
			var newOpenResult = openResult;
			if (_wtype == "FG" || _wtype == "T3G" || _wtype == "T1G" || _wtype == "RPF") newOpenResult = LS.get([_wtype + "_" + newOpenResult]);
			if (_wtype == "MW" || _wtype == "MQ") {
				var teamSide = openResult.substring(0, 1);
				newOpenResult = teamSide == "H" ? _team_h :
					_team_c;
				newOpenResult += LS.get(["MQ_" + openResult])
			} else if (_wtype == "PA" || _wtype == "RCD") newOpenResult = LS.get([newOpenResult]);
			else if (_wtype.match("(RNC|RNB|RS[HC])[1-9A-U]")) {
				var playType;
				if (_wtype.match("RS[HC][A-O]")) playType = _wtype.substring(0, 2);
				else playType = _wtype.substring(0, 3);
				if (openResult == "H") newOpenResult = _team_h;
				else if (openResult == "C") newOpenResult = _team_c;
				else if (openResult == "Y") newOpenResult = LS.get([playType + "_" + newOpenResult]);
				else if (openResult == "N") newOpenResult = LS.get([playType +
					"_" + newOpenResult
				]);
				else if (openResult == "P") newOpenResult = LS.get([playType + "_" + newOpenResult])
			} else if (newOpenResult == "H" || newOpenResult == "Home") newOpenResult = _team_h;
			else if (newOpenResult == "C" || newOpenResult == "Away") newOpenResult = _team_c;
			else if (newOpenResult == "N" || newOpenResult == "No") newOpenResult = LS.get(["N"]);
			else if (newOpenResult == "Y" || newOpenResult == "Yes") newOpenResult = LS.get(["Y"]);
			out = newOpenResult
		}
		return out
	};
	_self.reinit = function(_parHash) {
		postHash = _parHash;
		_self.init()
	};
	_self.setParentclass =
		function(_parentclass) {
			parentClass = _parentclass;
			util = parentClass.getThis("util");
			LS = parentClass.getThis("LS");
			LS_code = parentClass.getThis("LS_code")
		};
	_self.getThis = function(varible) {
		return eval(varible)
	};
	_self.backEvent = function(param) {
		parentClass.dispatchEvent("hideResultDetail", null)
	};
	_self.exitEvent = function() {
		util.removeEvent(dom.getElementById("body_show"), "scroll");
		return true
	};
	_self.addEventListener = function(eventname, eventFunction) {
		eventHandler[eventname] = eventFunction
	};
	_self.dispatchEvent =
		function(eventname, param) {
			if (eventHandler[eventname]) eventHandler[eventname](param)
		}
};