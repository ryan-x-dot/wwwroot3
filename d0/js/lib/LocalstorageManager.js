function LocalstorageManager(){
	var _self = this;
    var Storage = window.localStorage;
	/*
	var timeStr = "_time";
	_self.set = function(lname, lvalue, exdays){
			exdays = exdays || 30;
			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = d.toUTCString();
            Storage.setItem(lname,lvalue);
			Storage.setItem(lname+timeStr,expires);
	}

	_self.get = function(lname){
			var timeout = Storage.getItem(lname+timeStr);
            if(timeout==null){
                return null;
            }
            var ltime = new Date(timeout);
            var nowTime = new Date();
            if(nowTime.getTime() > ltime.getTime()){
                _self.del(lname);
                return null;
            }
            var ret = Storage.getItem(lname);
			return ret;
    }
    _self.del = function(lname){
        Storage.removeItem(lname);
        Storage.removeItem(lname+timeStr);
	}
	*/
	// /*
	// 有空改 改變localstorage 過期方式
	_self.set = function(lname,value,exdays) {
		exdays = exdays || 30;
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expire = d.toUTCString();
		obj = {
			time:new Date().getTime(),
			value:value,
			expire:expire
		} ;
		//localStorage只能儲存字串，所以要先將物件轉成字串
		objStr = JSON.stringify(obj);
		Storage.setItem(lname,objStr);
	}
	_self.get = function(lname){
		var str = Storage.getItem(lname);
		var data = {};
		try{
			data=JSON.parse(str);
		}catch(e){
			return null;
		}
		if(data == null) return null;
		var ltime = new Date(data.expire);
		var nowTime = new Date();
		if(nowTime.getTime() > ltime.getTime()){
			_self.del(lname);
			return null;
		}
		return data.value;
	}
    _self.del = function(lname){
        Storage.removeItem(lname);
	}
	// */
	// 設定timer 定時去檢查
	// var timer = setInterval(function () {
	// 	if(localStorage.getItem('name')){
	// 		var name = localStorage.getItem('name');
	// 		var nameObj = JSON.parse(name);
	// 		console.log(new Date().getTime() - nameObj.time);
	// 		if(new Date().getTime() - nameObj.time >= nameObj.expire){
	// 			localStorage.removeItem('name')
	// 		}
	// 	}else{
	// 		console.log('timer local name')
	// 		clearInterval(timer);
	// 	}
	// },60*1000)

}