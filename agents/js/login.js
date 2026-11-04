function login(_win, _dom) {
	var _self = this;
	var win = _win;
	var dom = _dom;
	var parentClass;
	var eventHandler = new Object;
	var layerFun = new Object;
	var util;
	var LS_code;
	var LS_account;
	var pwd_isShow = false;
	var pwd_safe_isShow = false;
	var lang_isShow = false;
	var site_isShow = false;
	var totalAD;
	var nowAD = 1;
	var animate_div;
	var selLayer = "A";
	var cookieAry = new Array;
	var login_1;
	var login_2;
	var login_3;
	var lang_btn;
	var sel_lang;
	var zh_tw;
	var zh_cn;
	var en_us;
	var user;
	var user_div;
	var pwd;
	var pwd_div;
	var text_msg;
	var pwd_eye_icon;
	var pwd_safe_eye_icon;
	var pwd_safe;
	var Safe;
	var hr_info;
	var hr_info1;
	var hr_infoTXT;
	var hr_info1TXT;
	var remember;
	var forgot_pwd;
	var login_btn;
	var loginold_btn;
	var pwdHtmlTemp;
	var ver_div;
	var firstTouch = false;
	var touchStartPos = 0;
	var touch = null;
	var touchPoint = 5;
	var timeObj;
	var timeOut = 300;
	var _mc = new Object;
	var tag = "\u2022";
	var isVerifying = false;
	_self.init = function() {
		top.blackbox = "";
		if (typeof iovationURL == "undefined") iovationURL = "";
		if (iovationURL != "") {
			var p = dom.location.protocol;
			p = p.replace(":", "");
			iovation_Proxy = iovation_Proxy.replace("http", "");
			iovation_Proxy = iovation_Proxy.replace("https", "");
			iovationURL = p + iovation_Proxy + "/iovation/vindex.html?webProtocal=" + p + "&webDomain=" + dom.domain;
			dom.getElementById("ddnet_corp_func1").src = iovationURL
		} else top.blackbox = " no blackbox ";
		_self.initLayerFun();
		var objid = ",username_div,pwd_div,Safe,";
		objid += ",hr_info,hr_info1,hr_infoTXT,hr_info1TXT,";
		var ary = util.getObjAry(dom, objid);
		_mc = util.mergeArray(_mc, ary);
		login_1 = dom.getElementById("btn_A");
		login_2 = dom.getElementById("btn_B");
		login_3 = dom.getElementById("btn_C");
		lang_btn = dom.getElementById("lang_btn");
		sel_lang = dom.getElementById("sel_lang");
		zh_tw = dom.getElementById("lg_lan_tw");
		zh_cn = dom.getElementById("lg_lan_cn");
		en_us = dom.getElementById("lg_lan_us");
		user = dom.getElementById("username");
		user_div = dom.getElementById("username_div");
		pwd = dom.getElementById("pwd");
		pwdHtmlTemp = pwd.outerHTML.replace(new RegExp("type=*password*", "gi"), "*TYPE*");
		pwd_div = dom.getElementById("pwd_div");
		pwd_eye_icon = dom.getElementById("pwd_eye_icon");
		pwd_safe_eye_icon = dom.getElementById("pwd_safe_eye_icon");
		pwd_safe = dom.getElementById("pwd_safe");
		text_msg = dom.getElementById("text_msg");
		Safe = dom.getElementById("Safe");
		hr_info = dom.getElementById("hr_info");
		hr_info1 = dom.getElementById("hr_info1");
		hr_infoTXT = dom.getElementById("hr_infoTXT");
		hr_info1TXT = dom.getElementById("hr_info1TXT");
		remember = dom.getElementById("remember");
		forgot_pwd = dom.getElementById("forgot_pwd");
		login_btn = dom.getElementById("loginBtn");
		loginold_btn = dom.getElementById("loginoldBtn");
		ver_div = dom.getElementById("ver_div");
		_mc["pwd"] = pwd;
		_mc["safe"] = pwd_safe;
		_mc["pwd"].val = "";
		_mc["safe"].val = "";
		util.addEvent(pwd, "focus", _self.onFocusEventHandler, {
			"type": "pwd"
		});
		util.addEvent(pwd_safe, "focus", _self.onFocusEventHandler, {
			"type": "safe"
		});
		util.addEvent(pwd, "blur", _self.onBlurEventHandler, {
			"type": "pwd"
		});
		util.addEvent(pwd_safe, "blur", _self.onBlurEventHandler, {
			"type": "safe"
		});
		util.addEvent(login_btn, "click", _self.doLogin);
		util.addEvent(loginold_btn, "click", _self.cntToOldSite);
		util.addEvent(pwd_eye_icon, "click", _self.showPwd);
		util.addEvent(pwd_safe_eye_icon, "click", _self.showPwd_safe);
		util.addEvent(lang_btn, "click", _self.showLang);
		util.addEvent(lang_btn, "focus", _self.onFocusEventHandler);
		util.addEvent(lang_btn, "blur", _self.onBlurEventHandler);
		util.addEvent(login_1, "click", _self.setLayerFun, {
			"layer": "A"
		});
		util.addEvent(login_2, "click", _self.setLayerFun, {
			"layer": "B"
		});
		util.addEvent(login_3, "click", _self.setLayerFun, {
			"layer": "C"
		});
		util.addEvent(zh_tw, "click", _self.chgLang, {
			"langx": "zh-tw",
			"ls": "tw",
			"class": "hk"
		});
		util.addEvent(zh_cn, "click", _self.chgLang, {
			"langx": "zh-cn",
			"ls": "cn",
			"class": "cn"
		});
		util.addEvent(en_us, "click", _self.chgLang, {
			"langx": "en-us",
			"ls": "us",
			"class": "en"
		});
		util.addEvent(dom.getElementById("link_chrome"), "click", util.browserdownload, {
			"browser": "chrome"
		});
		util.addEvent(dom.getElementById("link_uc"), "click", util.browserdownload, {
			"browser": "uc"
		});
		util.addEvent(dom.getElementById("link_safari"), "click", util.browserdownload, {
			"browser": "safari"
		});
		util.addEvent(dom.getElementById("link_firefox"), "click", util.browserdownload, {
			"browser": "firefox"
		});
		_self.addEventListener("startTimer", _self.startTimer);
		_self.addEventListener("stopTimer", _self.stopTimer);
		_self.addEventListener("clearTimer", _self.clearTimer);
		_self.addEventListener("showFadeOutMesg", _self.showFadeOutMesg);
		util.addEvent(user, "keyup", _self.keyupEventHandler, {
			"type": "user"
		});
		util.addEvent(pwd, "keyup", _self.keyupEventHandler, {
			"type": "pwd"
		});
		util.addEvent(pwd_safe, "keyup", _self.keyupEventHandler, {
			"type": "safe"
		});
		util.addEvent(user, "focus", _self.hideLang, {},
		false);
		util.addEvent(pwd, "focus", _self.hideLang, {},
		false);
		util.addEvent(pwd_safe, "focus", _self.hideLang, {},
		false);
		util.addEvent(forgot_pwd, "click", _self.forgotPwd);
		util.addEvent(dom.getElementById("requirements"), "click", _self.show_requirements);
		util.addEvent(user, "input", _self.clearErrMsg);
		util.addEvent(pwd, "input", _self.clearErrMsg);
		util.addEvent(pwd_safe, "input", _self.clearErrMsg);
		_self.setLayerFun(null, {
			"layer": selLayer
		});
		cookieAry = document.cookie.split(";");
		_self.doCookie("ag_user" + selLayer);
		sel_lang.style.display = "none";
		if (util.chg_site()) return;
		animate_div = dom.getElementById("animate_div");
		preBtn = dom.getElementById("preBtn");
		nextBtn = dom.getElementById("nextBtn");
		totalAD = animate_div.children.length;
		util.addEvent(preBtn, "click", _self.preAD);
		util.addEvent(nextBtn, "click", _self.nextAD);
		for (var i = 1; i <= totalAD - 1; i++) util.addEvent(dom.getElementById("dot" + i), "click", _self.chgAD, {
			"now": i
		});
		util.addEvent(animate_div, "touchstart", _self.touchstart);
		util.addEvent(animate_div, "touchmove", _self.touchmove);
		util.addEvent(animate_div, "touchend", _self.touchend)
	};
	_self.setParentclass = function(_parentclass) {
		parentClass = _parentclass;
		util = parentClass.getThis("util");
		LS_code = parentClass.getThis("LS_code");
		LS_account = parentClass.getThis("LS_account");
		config_set = parentClass.getThis("config_set");
		Timer = parentClass.getThis("Timer");
		timerHash = parentClass.getThis("timerHash");
		selLayer = parentClass.getThis("selLayer")
	};
	_self.getThis = function(varible) {
		return eval(varible)
	};
	_self.addEventListener = function(eventname, eventFunction) {
		eventHandler[eventname] = eventFunction
	};
	_self.dispatchEvent = function(eventname, param) {
		if (eventHandler[eventname]) eventHandler[eventname](param)
	};
	_self.keyupEventHandler = function(keyEvent, param) {
		var type = param.type;
		if (keyEvent.keyCode == 0) charCode = keyEvent.which;
		else charCode = keyEvent.keyCode ? keyEvent.keyCode: keyEvent.which;
		if (type != "user") _mc[type].val = _mc[type].value;
		if (charCode == "13") _self.doLogin()
	};
	_self.chgPwd = function(val) {
		var n = val.length;
		var ret = "";
		for (i = 0; i < n; i++) ret += tag;
		return ret
	};
	_self.onFocusEventHandler = function(evt, param) {
		if (evt.target != null) if (pwd_isShow && evt.target.id == "pwd" || pwd_safe_isShow && evt.target.id == "pwd_safe");
		else if (evt.target.value != null) {
			evt.target.value = _mc[param.type].val;
			evt.target.setAttribute("type", "password");
			evt.target.setAttribute("autocomplete", "new-password")
		}
	};
	_self.onBlurEventHandler = function(evt, param) {
		if (evt.target != null) {
			if (pwd_isShow && evt.target.id == "pwd" || pwd_safe_isShow && evt.target.id == "pwd_safe");
			else if (evt.target.value != null) {
				_mc[param.type].val = evt.target.value;
				evt.target.value = _self.chgPwd(evt.target.value);
				evt.target.setAttribute("autocomplete", "off")
			}
			evt.target.setAttribute("type", "text")
		}
	};
	_self.clearErrMsg = function(evt, param) {
		var allInputObj = Array("username_div", "pwd_div", "Safe");
		var allErrMsgInfo = Array("hr_info", "hr_info1");
		for (var inputObj of allInputObj) if (_mc[inputObj].classList.contains("err_input")) _mc[inputObj].classList.remove("err_input");
		for (var msgObj of allErrMsgInfo) _mc[msgObj + "TXT"].innerHTML = ""
	};
	_self.doLogin = function() {
		clearTimeout(timeObj);
		timeObj = setTimeout(_self.loginEventHandler, timeOut)
	};
	_self.loginEventHandler = function(mouseEvent, targetObj) {
		login_btn.focus();
		if (typeof autoLogin == "function") autoLogin();
		user_div.className = "lg_input u_icon";
		pwd_div.className = "lg_input p_icon";
		Safe.className = "lg_input s_icon";
		hr_info.style.display = "none";
		hr_info1.style.display = "none";
		var ret = _self.checkFormat(user.value, pwd.value, pwd_safe.value);
		if (ret == "") {
			if (remember.checked);
			_self.connetToServer()
		} else util.echo("login error")
	};
	_self.cntToOldSite = function() {
		if (oldSite) util.topGoToUrl(oldSite, {
			"langx": top.langx
		})
	};
	_self.checkFormat = function(user, pwd) {
		if (user == "") {
			hr_info.style.display = "";
			hr_infoTXT.innerHTML = LS_account.get("loginID_Null");
			user_div.className = "lg_input u_icon err_input";
			return "login_user"
		}
		if (pwd == "") {
			hr_info1.style.display = "";
			hr_info1TXT.innerHTML = LS_account.get("pwd_Null");
			pwd_div.className = "lg_input p_icon err_input";
			return "login_pwd"
		}
		return ""
	};
	_self.showPwd_safe = function() {
		if (!pwd_safe_isShow) {
			pwd_safe_isShow = true;
			pwd_safe_eye_icon.className = "eye_icon";
			pwd_safe.setAttribute("type", "text");
			pwd_safe.value = _mc["safe"].val
		} else {
			pwd_safe_isShow = false;
			pwd_safe_eye_icon.className = "no_eye_icon";
			pwd_safe.setAttribute("type", "password")
		}
	};
	_self.showPwd = function() {
		var ret = "";
		if (!pwd_isShow) {
			pwd_isShow = true;
			pwd_eye_icon.className = "eye_icon";
			pwd.setAttribute("type", "text");
			pwd.value = _mc["pwd"].val
		} else {
			pwd_isShow = false;
			pwd_eye_icon.className = "no_eye_icon";
			pwd.setAttribute("type", "password")
		}
	};
	_self.showLang = function() {
		if (!lang_isShow) {
			lang_isShow = true;
			sel_lang.style.display = ""
		} else {
			lang_isShow = false;
			sel_lang.style.display = "none"
		}
	};
	_self.hideLang = function() {
		if (lang_isShow) {
			lang_isShow = false;
			sel_lang.style.display = "none";
			lang_btn.blur()
		}
	};
	_self.changePage = function(e, param) {
		param.retFun = _self.changePageComplete;
		parentClass.dispatchEvent("GoToPage", param)
	};
	_self.changePageComplete = function() {};
	_self.connetToServer = function() {
		util.removeEvent(login_btn, "click");
		var urlParams = "";
		urlParams += "login_layer=co";
		top.login_layer = "co";
		if (selLayer == "B") {
			urlParams = "login_layer=su";
			top.login_layer = "su"
		} else if (selLayer == "C") {
			urlParams = "login_layer=ag";
			top.login_layer = "ag"
		}
		urlParams += "&username=" + user.value;
		urlParams += "&pwd=" + _mc["pwd"].val;
		if (pwd_safe.value == "") urlParams += "&pwd_safe=none";
		else urlParams += "&pwd_safe=" + _mc["safe"].val;
		urlParams += "&uid=" + top.uid;
		urlParams += "&langx=" + top.langx;
		urlParams += "&auto=" + top.iovationKey;
		urlParams += "&blackbox=" + convertASCIItoHex(top.blackbox);
		urlParams = "p=login_chk&ver=" + top.ver + "&" + urlParams;
		var getHTML = new HttpRequest;
		getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete", _self.connectComplete);
		getHTML.loadURL(top.url, "POST", urlParams)
	};
	_self.connectComplete = function(data) {
		util.addEvent(login_btn, "click", _self.doLogin);
		try {
			var arr_data = new Object;
			try {
				arr_data = JSON.parse(data)
			} catch(e) {
				arr_data = (new Function("return " + data))()
			}
			if (util.chkErrorMsg(arr_data, LS_code)) return;
			top.uid = arr_data["uid"];
			top.user_id = arr_data["user_id"];
			top.layer_id = arr_data["layer_id"];
			top.pri_type = arr_data["pri_type"];
			top.user_type = arr_data["user_type"];
			top.user_enable = arr_data["enable"];
			top.enable_pri = arr_data["enable_pri"];
			top.username = arr_data["username"];
			top.layer_username = arr_data["layer_username"];
			top.annCookie = "ag_" + top.login_layer + "_ann" + top.user_id;
			top.pay_type = arr_data["pay_type"];
			top.template_sw = true;
			top.retrieve_sw = arr_data["retrieve_sw"];
			top.telbot_sw = arr_data["telbot_sw"];
			if (arr_data["code"] == "102") if (arr_data["status"] == "success") if (util.chg_site()) {
				var protocol = dom.location.protocol;
				window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx
			} else {
				_self.close_verification();
				_self.clearTimer();
				var isChceked = remember.checked;
				if (isChceked) document.cookie = "ag_user" + selLayer + "=" + user.value + ";";
				else {
					cookieAry = document.cookie.split(";");
					var ary = new Array;
					for (var i = 0; i < cookieAry.length; i++) {
						var keys = cookieAry[i];
						var tmp = keys.split("=");
						if (tmp[0].indexOf("ag_user" + selLayer) != -1) {
							var d = new Date;
							d.setTime(d.getTime() - 1 * 3600 * 1E3);
							var _value = tmp[0] + "=;";
							_value += "expires=" + d.toGMTString() + ";";
							ary.unshift(_value)
						} else ary.push(keys)
					}
					document.cookie = ary.join(";")
				}
				if (arr_data["status_code"] == "4O000") parentClass.dispatchEvent("hideDiv", {
					"target": "acc_show",
					"retFun": _self.hideDivComplete
				});
				if (arr_data["status_code"] == "4O001") parentClass.dispatchEvent("chgPwd", {
					"target": "acc_show",
					"retFun": _self.hideDivComplete
				});
				if (arr_data["status_code"] == "4O007") parentClass.dispatchEvent("chgPwd", {
					"target": "acc_show",
					"retFun": _self.hideDivComplete
				});
				if (arr_data["status_code"] == "4O002") if (selLayer == "C") parentClass.dispatchEvent("chgLoginID", {
					"target": "acc_show",
					"retFun": _self.hideDivComplete
				});
				else parentClass.dispatchEvent("chgPwdSafe", {
					"target": "acc_show",
					"retFun": _self.hideDivComplete
				})
			} else {
				if (arr_data["status_code"] == "4X004") {
					user_div.className = "lg_input u_icon";
					pwd_div.className = "lg_input p_icon";
					Safe.className = "lg_input s_icon"
				} else {
					user_div.className = "lg_input u_icon  err_input";
					pwd_div.className = "lg_input p_icon  err_input";
					Safe.className = "lg_input s_icon  err_input"
				}
				hr_info1.style.display = "";
				hr_info1TXT.innerHTML = LS_code.get(arr_data["status_code"]);
				pwd.value = "";
				pwd_safe.value = "";
				_mc["pwd"].val = "";
				_mc["safe"].val = "";
				isVerifying = false;
				if (arr_data["ver_data"] != null) {
					if (arr_data["ver_data"]["is_check"] == "Y") _self.show_verification(arr_data["ver_data"]["Vimage"])
				} else _self.close_verification()
			} else if (arr_data["code"] == "201" && arr_data["is_check"] == "Y") _self.show_verification(arr_data["Vimage"]);
			else {
				hr_info1.style.display = "";
				hr_info1TXT.innerHTML = "connect fail !!"
			}
		} catch(e) {
			util.echo("[login]something wrong !!");
			util.echo(e)
		}
	};
	_self.close_verification = function() {
		dom.getElementById("acc_show").removeAttribute("style");
		dom.body.removeAttribute("style");
		ver_div.style.display = "none";
		_self.cleanClick()
	};
	_self.set_error_msg = function(is_show) {
		if (is_show) {
			util.classFunc(dom.getElementById("click_Ans").parentElement, "err_input");
			dom.getElementById("ver_msg_show").style.display = ""
		} else {
			util.classFunc(dom.getElementById("click_Ans").parentElement, "err_input", "remove");
			dom.getElementById("ver_msg_show").style.display = "none"
		}
	};
	_self.send_Ver = function() {
		if (isVerifying) return;
		isVerifying = true;
		_self.set_error_msg(false);
		if (top.ans_num != top.ans_length) {
			_self.set_error_msg(true);
			return
		}
		var urlParams = "";
		urlParams += "login_layer=co";
		top.login_layer = "co";
		if (selLayer == "B") {
			urlParams = "login_layer=su";
			top.login_layer = "su"
		} else if (selLayer == "C") {
			urlParams = "login_layer=ag";
			top.login_layer = "ag"
		}
		urlParams += top.ans;
		urlParams += "&action=ver_checkresult";
		urlParams = "p=get_verification&" + urlParams;
		var getHTML = new HttpRequest;
		getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete", _self.get_check_ver);
		getHTML.loadURL(top.url, "POST", urlParams)
	};
	_self.change_Ver = function() {
		_self.set_error_msg(false);
		var urlParams = "";
		urlParams += "login_layer=co";
		top.login_layer = "co";
		if (selLayer == "B") {
			urlParams = "login_layer=su";
			top.login_layer = "su"
		} else if (selLayer == "C") {
			urlParams = "login_layer=ag";
			top.login_layer = "ag"
		}
		urlParams += "&action=ver_change";
		urlParams = "p=get_verification&" + urlParams;
		var getHTML = new HttpRequest;
		getHTML.addEventListener("onError", _self.onError);
		getHTML.addEventListener("LoadComplete", _self.get_check_ver);
		getHTML.loadURL(top.url, "POST", urlParams)
	};
	_self.get_check_ver = function(data) {
		try {
			var arr_data = new Object;
			try {
				arr_data = JSON.parse(data)
			} catch(e) {
				arr_data = (new Function("return " + data))()
			}
			if ((arr_data["code"] == "201" || arr_data["code"] == "221") && arr_data["is_check"] == "Y") {
				_self.cleanClick();
				_self.show_verification(arr_data["Vimage"]);
				if (arr_data["code"] == "221") _self.set_error_msg(true);
				isVerifying = false
			} else if (user.value != "" && pwd.value != "") _self.doLogin();
			else _self.close_verification()
		} catch(e) {
			util.echo("[verification]something wrong !!");
			util.echo(e)
		}
	};
	_self.show_verification = function(arr_Img) {
		top.ans = "";
		top.ans_length = 0;
		top.ans_num = 0;
		_self.set_error_msg(false);
		util.addEvent(dom.getElementById("close_ver"), "click", _self.close_verification);
		util.addEvent(dom.getElementById("ver_clean"), "click", _self.cleanClick);
		util.addEvent(dom.getElementById("ver_send"), "click", _self.send_Ver);
		util.addEvent(dom.getElementById("ver_change"), "click", _self.change_Ver);
		if (arr_Img["img_data"] != null) {
			_self.setAnsevent(arr_Img);
			dom.getElementById("acc_show").setAttribute("style", "overflow-y:hidden;");
			dom.body.setAttribute("style", "position:fixed; overflow-y:hidden;");
			ver_div.style.display = "";
			dom.getElementById("ver_scroll").scrollTop = 0
		}
	};
	_self.setAnsevent = function(arr_Img_data) {
		dom.getElementById("show_verdiv").src = arr_Img_data["img_data"];
		var Ans_map_node = dom.getElementById("show_verdiv").nextElementSibling;
		Ans_map_node.innerHTML = "";
		top.ans_length = arr_Img_data.arr_Q.length;
		for (var key in arr_Img_data.arr_Q) {
			var new_obj = dom.createElement("area");
			new_obj.setAttribute("id", arr_Img_data.arr_Q[key]);
			new_obj.setAttribute("shape", "rect");
			new_obj.setAttribute("coords", arr_Img_data.arr_X[key] + "," + arr_Img_data.arr_Y[key] + "," + (arr_Img_data.arr_X[key] + arr_Img_data.qCodeWidth) + "," + (arr_Img_data.arr_Y[key] + arr_Img_data.qCodeHight));
			new_obj.setAttribute("style", "cursor: pointer;");
			util.addEvent(new_obj, "click", _self.getClick, arr_Img_data.arr_P[key]);
			Ans_map_node.appendChild(new_obj)
		}
	};
	_self.getClick = function(e, show_pic) {
		_self.set_error_msg(false);
		if (top.ans_num >= top.ans_length) return;
		top.ans_num++;
		var show_Ans_span = dom.getElementById("click_Ans");
		var click_id = e.target.id;
		top.ans += "&ver_result[]=" + click_id;
		var new_obj = dom.createElement("img");
		new_obj.setAttribute("src", show_pic);
		new_obj.setAttribute("width", 30);
		show_Ans_span.appendChild(new_obj)
	};
	_self.cleanClick = function() {
		var show_Ans_span = dom.getElementById("click_Ans");
		show_Ans_span.innerHTML = "";
		top.ans = "";
		top.ans_num = 0
	};
	_self.onError = function() {
		util.addEvent(login_btn, "click", _self.doLogin);
		util.echo("onError");
		console.log("onError")
	};
	_self.hideDivComplete = function() {};
	_self.initLayerFun = function() {
		layerFun["A"] = _self.chgLoginlayer1;
		layerFun["B"] = _self.chgLoginlayer2;
		layerFun["C"] = _self.chgLoginlayer3
	};
	_self.setLayerFun = function(e, param) {
		if (layerFun[param.layer]) layerFun[param.layer]()
	};
	_self.chgLoginlayer1 = function() {
		selLayer = "A";
		top.login_layer = "co";
		login_1.className = "on";
		login_2.className = "";
		login_3.className = "";
		Safe.style.display = "";
		text_msg.style.display = "";
		hr_info.style.display = "none";
		hr_info1.style.display = "none";
		user_div.className = "lg_input u_icon";
		pwd_div.className = "lg_input p_icon";
		Safe.className = "lg_input s_icon";
		_self.doCookie("ag_user" + selLayer)
	};
	_self.chgLoginlayer2 = function() {
		selLayer = "B";
		top.login_layer = "su";
		login_1.className = "";
		login_2.className = "on";
		login_3.className = "";
		Safe.style.display = "";
		text_msg.style.display = "";
		hr_info.style.display = "none";
		hr_info1.style.display = "none";
		user_div.className = "lg_input u_icon";
		pwd_div.className = "lg_input p_icon";
		Safe.className = "lg_input s_icon";
		_self.doCookie("ag_user" + selLayer)
	};
	_self.chgLoginlayer3 = function() {
		selLayer = "C";
		top.login_layer = "ag";
		login_1.className = "";
		login_2.className = "";
		login_3.className = "on";
		Safe.style.display = "none";
		text_msg.style.display = "none";
		hr_info.style.display = "none";
		hr_info1.style.display = "none";
		user_div.className = "lg_input u_icon";
		pwd_div.className = "lg_input p_icon";
		Safe.className = "lg_input s_icon";
		_self.doCookie("ag_user" + selLayer)
	};
	_self.chgLang = function(e, param) {
		sel_lang.style.display = "none";
		lang_btn.blur();
		parentClass.dispatchEvent("chgLangx", {
			"langx": param.langx,
			"ls": param.ls,
			"selLayer": selLayer
		})
	};
	_self.forgotPwd = function() {
		if (util.chg_site()) {
			var protocol = dom.location.protocol;
			window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx
		} else {
			_self.clearTimer();
			parentClass.dispatchEvent("forgotPwd", {
				"target": "acc_show",
				"retFun": _self.hideDivComplete
			})
		}
	};
	_self.show_requirements = function() {
		if (util.chg_site()) {
			var protocol = dom.location.protocol;
			window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx
		} else {
			_self.clearTimer();
			parentClass.dispatchEvent("show_requirements", {
				"target": "acc_show",
				"retFun": _self.hideDivComplete
			})
		}
	};
	_self.doCookie = function(keys) {
		remember.checked = false;
		for (var i = 0; i < cookieAry.length; i++) {
			var thisCookie = cookieAry[i].split("=");
			if (thisCookie[0].indexOf(keys) != -1) {
				user.value = thisCookie[1];
				remember.checked = true;
				break
			}
		}
	};
	_self.createTimer = function() {
		timerHash["AD"] = new Timer(config_set.get("AD_TIME"));
		timerHash["AD"].setParentclass(_self);
		timerHash["AD"].init();
		timerHash["AD"].addEventListener("TimerEvent.TIMER", _self.timerRun)
	};
	_self.startTimer = function() {
		if (timerHash["AD"] != null) timerHash["AD"].startTimer()
	};
	_self.stopTimer = function() {
		if (timerHash["AD"] != null) timerHash["AD"].stopTimer()
	};
	_self.clearTimer = function() {
		if (timerHash["AD"] != null) timerHash["AD"].clearObj()
	};
	_self.touchstart = function(e) {
		var start_touch = e.touches[0];
		touchStartPos = Number(start_touch.pageX);
		firstTouch = true
	};
	_self.touchmove = function(e) {
		var diff = touchStartPos * 1 - e.touches[0].pageX * 1;
		if (Math.abs(diff) >= 10) e.preventDefault();
		touch = e.touches[0];
		if (timerHash["AD"] != null) _self.stopTimer()
	};
	_self.touchend = function(e) {
		if (!touch) return;
		animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
		var x = Number(touch.pageX);
		var y = Number(touch.pageY);
		var diffPos = touchStartPos - x;
		if (firstTouch) {
			if (diffPos <= touchPoint * -1) nowAD--;
			else if (diffPos >= touchPoint) nowAD++;
			if (nowAD >= totalAD - 1) nowAD = totalAD - 1;
			if (nowAD < 1) nowAD = 1;
			animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
			_self.chkAD(nowAD);
			_self.startTimer()
		}
		firstTouch = false;
		touch = null
	};
	_self.timerRun = function() {
		if (nowAD > totalAD) nowAD = 1;
		else if (nowAD < 1) nowAD = totalAD;
		nowAD++;
		animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
		if (nowAD == totalAD) {
			setTimeout(function() {
				nowAD = 1;
				dot1.className = "on";
				dot2.className = "";
				dot3.className = "";
				animate_div.className = "lg_adcomInner adcom1";
				_self.stopTimer();
				_self.startTimer()
			},
			300);
			_self.chkAD(1)
		} else _self.chkAD(nowAD)
	};
	_self.preAD = function() {
		if (nowAD == 1) nowAD = 1;
		else nowAD--;
		animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
		_self.chkAD(nowAD);
		_self.stopTimer();
		_self.startTimer()
	};
	_self.nextAD = function() {
		if (nowAD == totalAD - 1) nowAD = totalAD - 1;
		else nowAD++;
		animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
		_self.chkAD(nowAD);
		_self.stopTimer();
		_self.startTimer()
	};
	_self.chgAD = function(e, param) {
		_self.chkAD(param.now);
		nowAD = param.now;
		animate_div.className = "lg_adcomInner lg_adcomGO adcom" + nowAD;
		_self.stopTimer();
		_self.startTimer()
	};
	_self.chkAD = function(now) {
		preBtn.style.display = "";
		nextBtn.style.display = "";
		for (var i = 1; i <= totalAD - 1; i++) dom.getElementById("dot" + i).className = "";
		if (now == 1) preBtn.style.display = "none";
		else if (now == totalAD - 1) nextBtn.style.display = "none";
		dom.getElementById("dot" + now).className = "on"
	};
	function convertASCIItoHex(asciiString) {
		var hex = "";
		var tempASCII, tempHex;
		asciiString.split("").map(function(i) {
			tempASCII = i.charCodeAt(0);
			tempHex = tempASCII.toString(16);
			hex = hex + tempHex
		});
		hex = hex.trim();
		return hex
	}
};