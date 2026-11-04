function HttpRequestRetry(_HttpRequest, _time, _limit, _frame) {
	var _self = this;
	var parentClass;
	var eventHandler = new Object;
	var HttpRequest = _HttpRequest;
	var hr;
	var limit_count = _limit;
	var now_count = 0;
	var nowFrame = _frame ? _frame : "bodyFrame";
	var timer;
	var sec = _time;
	var url = "";
	var method = "";
	var params = "";
	_self.init = function() {
		_self.clearObj()
	};
	_self.setParentclass = function(_parentclass) {
		parentClass = _parentclass
	};
	_self.loadURL = function(_url, _method, _params) {
		url = _url;
		method = _method;
		params = _params;
		hr = new HttpRequest;
		hr.addEventListener("onError", _self.onError);
		hr.addEventListener("LoadComplete", _self.LoadComplete);
		hr.loadURL(url, method, params)
	};
	_self.addEventListener = function(eventname, eventFunction) {
		eventHandler[eventname] = eventFunction
	};
	_self.eventhandler = function(eventname, param) {
		if (eventHandler[eventname])
			eventHandler[eventname](param)
	};
	_self.onError = function() {
		var bodyFrame = parentClass.getParentThis(nowFrame);
		parentClass.dispatchEvent("stopTimer", null);
		if (bodyFrame == parentClass)
			if (now_count < limit_count) {
				now_count++;
				timer = setTimeout(hr.loadURL, sec, url, method, params)
			} else {
				_self.clearObj();
				parentClass.dispatchEvent("startTimer", null);
				_self.eventhandler("onError", null)
			}
		else {
			_self.clearObj();
			parentClass.dispatchEvent("clearTimer", null);
			console.log("[HttpRequestRetry]change page")
		}
	};
	_self.LoadComplete = function(json) {
		_self.clearObj();
		var bodyFrame = parentClass.getParentThis(nowFrame);
		if (bodyFrame == parentClass) {
			parentClass.dispatchEvent("startTimer", null);
			_self.eventhandler("LoadComplete", json)
		} else {
			parentClass.dispatchEvent("clearTimer", null);
			console.log("[HttpRequestRetry]change page")
		}
	};
	_self.clearObj = function() {
		hr = null;
		url = "";
		method = "";
		params = "";
		now_count = 0;
		clearTimeout(timer)
	}
};
