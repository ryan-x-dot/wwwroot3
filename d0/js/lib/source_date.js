function source_date(){
	var _self=this;
	var classname = "source_date.js";
	
	_self.tmpScreen;
	_self._top;
	_self.paramObj;
	
	var set = new Object();
	
	var LANGX = "en-us";
	var ZONE = 8;
	var WAY = 1;
	var groupNum = 3;
	
	_self.init=function(Top, Div, Param){
		_top = Top
		tmpScreen = Div;
		paramObj = Param;
		
		_self.setLangx(LANGX);
	}
	
	_self.setLangx=function(langx){
		LANGX = langx.toLowerCase();
		
		if(LANGX=="zh-tw" || LANGX=="zh-cn"){
			set["monthName"] = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
			set["weekName"] = ["日","一","二","三","四","五","六"];
		}
		if(LANGX == "en-us"){
			set["monthName"] = ["January","February","March","April","May","June","July","August","September","October","November","December"];
			set["weekName"] = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
		}
	}
	
	_self.setTimeZone=function(zone){
		if(zone==undefined || zone=="")	return;
		ZONE = zone*1;
	}
	
	_self.setWay=function(wzy){
		if(wzy*1 == -1){
			WAY = -1;
		}else{
			WAY = 1;
		}
	}
	
	_self.getMonthArea=function(){
		var monthArea = new Object();
		monthArea["month"] = new Array();
		monthArea["text"] = new Array();
		
		var d = _self.DateTimezone(1);
		var year = d.getFullYear();
		var month = d.getMonth();
		
		var len = set["monthName"].length/groupNum;
		
		var tmpMonth = new Array();
		var tmpText = new Array();
		for(var i=0; i<len; i++){
			tmpMonth[i] = [(i*3),((i*3)+2)];
			tmpText[i] = _self.getSubWord(set["monthName"][(i*3)],3) + " - " + _self.getSubWord(set["monthName"][((i*3)+2)],3);
		}
		
		var j = 0;
		var idx = Math.ceil(((month+1)/groupNum)-1);
		var nextYear = year*1+1;
		
		monthArea = _self.setMonthArea(monthArea,tmpMonth,tmpText,idx,len,year);
		monthArea = _self.setMonthArea(monthArea,tmpMonth,tmpText,0,idx,nextYear);
		
		return monthArea;
	}
	
	_self.setMonthArea=function(monthArea,tmpMonth,tmpText,start,end,year){
		for(var i=start; i<end; i++){
			var s = _self.addZero(year) + "-" + _self.addZero(tmpMonth[i][0]+1) + "-" + _self.addZero("1");
			var e = _self.addZero(year) + "-" + _self.addZero(tmpMonth[i][1]+1) + "-" + _self.addZero("31");
			
			monthArea["month"][monthArea["month"].length] = s + "," + e;
			monthArea["text"][monthArea["text"].length] = tmpText[i] + " " + _self.addZero(year);
		}
		
		return monthArea;
	}
	
	/**
		daterange: 日期天數
		monthlength: 月份長度( 小於等於0,不做截字 )
		weeklength: 星期長度( 小於等於0,不做截字 )
	 **/
	_self.getDateSource=function(daterange,monthlength,weeklength){
		var sourceDate = new Object();
		sourceDate["date"] = new Array();
		sourceDate["month"] = new Array();
		sourceDate["week"] = new Array();
		
		daterange = (daterange)?daterange:1;
		monthlength = (monthlength && monthlength > 0)?monthlength:0;
		weeklength = (weeklength && weeklength > 0)?weeklength:0;
		
		for(var i=0; i<daterange; i++){
			var d = _self.DateTimezone(i);
			var year = d.getFullYear();
			var month = d.getMonth();
			var day = d.getDate();
			var week = d.getDay();
			
			var oD = _self.addZero(year) + "-" + _self.addZero(month+1) + "-" + _self.addZero(day);
			var mN = _self.getSubWord(set["monthName"][month],monthlength);
			var wN = _self.getSubWord(set["weekName"][week],weeklength);
			
			sourceDate["date"][i] = oD;
			sourceDate["month"][i] = mN;
			sourceDate["week"][i] = wN;
		}
		
		return sourceDate;
	}
	
	_self.DateTimezone=function(n){
		// 建立現在時間的物件
		var d = new Date();
		
		// 取得 UTC time
		var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
		
		return new Date(utc + (3600000*ZONE) + (86400000*n*WAY));
	}
	
	_self.addZero=function(code){
		return (code*1 < 10)?"0"+code:code;
	}
	
	_self.getSubWord=function(str,len){
		if(LANGX == "en-us"){
			if(len && len > 0)	str = str.substr(0,len);
		}
		
		return str;
	}
	
	_self.debugPrint=function(msg){
		try{
			//console.log(msg);
		}catch(e){
			alert("["+classname+"]"+msg);
		}
	}
}