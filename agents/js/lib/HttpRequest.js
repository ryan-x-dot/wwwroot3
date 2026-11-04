function HttpRequest() {
	var self = this;
	var req;
	var eventHandler = new Array;
	var parentClass;
	self.init = function() {
		self.addEventListener("LoadComplete", self.cmd_proc)
	};
	self.help = function() {
		var str = "";
		str += "EventName:LoadComplete Method:function(html)\n";
		str += "Method:loadURL(url,post/get,pamam)\n";
		return str
	};
	self.setParentclass = function(parentclass) {
		parentClass = parentclass
	};
	self.getThis = function(varible) {
		return eval(varible)
	};
	self.test = function() {
		alert("test")
	};
	self.loadURL = function(url, method, params) {
		req = false;
		if (window.XMLHttpRequest && !window.ActiveXObject)
			try {
				req = new XMLHttpRequest
			} catch (e) {
				req = false
			}
		else if (window.ActiveXObject)
			try {
				req = new ActiveXObject("Msxml2.XMLHTTP")
			} catch (e) {
				try {
					req = new ActiveXObject("Microsoft.XMLHTTP")
				} catch (e) {
					req = false
				}
			}
		if (req) {
			req.onreadystatechange = self.processReqChange;
			if (method == undefined)
				method = "POST";
			if (method.toUpperCase() == "POST") {
				req.open("POST", url + "?ver=" + top.ver, true);
				req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				req.send(params)
			} else {
				req.open("GET", url + "?" + params, true);
				req.send("")
			}
		}
	};
	self.processReqChange = function() {
		if (req.readyState == 4)
			if (req.status == 200)
				self.eventhandler("LoadComplete", req.responseText);
			else
				self.eventhandler("onError", req.responseText)
	};
	self.addEventListener = function(eventname, eventFunction) {
		eventHandler[eventname] = eventFunction
	};
	self.removeEventListener = function(eventname) {
		EventHandler[eventname] = undefined
	};
	self.eventhandler = function(eventname, param) {
		if (eventHandler[eventname] != undefined)
			eventHandler[eventname](param)
	};
	self.cmd_proc = function(html) {
		alert(html)
	};
	self.init()
};
