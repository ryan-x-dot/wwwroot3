function LocalstorageManager() {
	var _self = this;
	var Storage = window.localStorage;
	_self.set = function(lname, value, exdays) {
		exdays = exdays || 30;
		var d = new Date;
		d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1E3);
		var expire = d.toUTCString();
		obj = {
			time: (new Date).getTime(),
			value: value,
			expire: expire
		};
		objStr = JSON.stringify(obj);
		Storage.setItem(lname, objStr)
	};
	_self.get = function(lname) {
		var str = Storage.getItem(lname);
		var data = {};
		try {
			data = JSON.parse(str)
		} catch (e) {
			return null
		}
		if (data == null)
			return null;
		var ltime = new Date(data.expire);
		var nowTime = new Date;
		if (nowTime.getTime() > ltime.getTime()) {
			_self.del(lname);
			return null
		}
		return data.value
	};
	_self.del = function(lname) {
		Storage.removeItem(lname)
	};
	_self.vague_del = function(lname) {
		for (var key in Storage)
			if (key.indexOf(lname) != -1)
				Storage.removeItem(key)
	}
};
