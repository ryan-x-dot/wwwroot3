function calendar(_win, _dom){
	var _self=this;
	_self.classname = "calendar";

	var win = _win;
	var dom = _dom;
	var parentClass;
	var _priv={};
	var name = "";
	var lagnx;
	var CalendarClass;
	var WEB_TIME_ZONE;
	var util;
	var _mc = new Object();
	var limitDate = "";
	var maxDate = "null";


	_self.init=function(parObj){
			_self.echo("calendar_ag init");
			_priv.disabled = true;

			langx = parObj.langx;
			CalendarClass = parObj.CalendarClass;
			WEB_TIME_ZONE = parObj.WEB_TIME_ZONE;

			limitDate = parObj.period_ls;
			if(parObj.hasOwnProperty("period_le")){
				maxDate = parObj.period_le;
			}

			_mc["date_input"] = parObj.input;
			_mc["date_photo"] = parObj.photo;

			// _mc["date_input"].id = "date_input";
			// util.addEvent(_mc["date_input"], "press", _self.keyPressEvent);
			//util.addEvent(_mc["date_input"], "keyup", _self.keyUpEvent);
			util.addEvent(_mc["date_input"], "blur", _self.blurEvent);
			_self.setDateInit(parObj);
	}

	_self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
		util = parentClass.getThis("util");
	}

	_self.setName=function(_name){
		name = _name;
	}

	_self.setDateInit=function(parObj){

			_mc["parObj"] = parObj;

			_self.dateInit(_mc["date_input"],_mc["date_photo"], _mc["parObj"].div);

			var date = _mc["parObj"].def_date;

			_self.echo("init===>"+date);
			_self.echo("init===>"+_self.checkFormat(date));

			var _date = (date==undefined||!_self.checkFormat(date))?_self.getToday():date;

			_self.echo("init===>"+_date);
			_self.setDateValue(_date);

	}

	_self.dateInit=function (dateObj, dateClickObj, parentScreen){
			var dateClickObj = dateClickObj || dateObj;
			var _set = {};
			if(langx == "zh-tw" ||langx == "zh-cn"){
				_set.monthName = ["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"]; // 月份語系;
				_set.weekName = ["日","一","二","三","四","五","六"]; // 星期語系;
			}
			if(langx == "en-us"){
				_set.monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"]; // 月份語系;
				// _set.weekName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; // 星期語系;
				_set.weekName = ["SU","MO","TU","WE","TH","FR","SA"]; // 星期語系;
			}
			_set.futureYear = 0; // 未來年份數;
			_set.cssShow = false;
			_set.outday = _mc["parObj"].over_date;
			var tmpdate = _self.getToday();
			_set.tmptoday = _self.dateReplace(tmpdate,"get");

			// 僅提供一年份的月份/年份拉霸選項 使用(上個月＋當月＋未來10個月)
			var _todayObj = new Date();
			var _limitHead = new Date(limitDate);
			var _limitTail = new Date();
			if(maxDate){
				_limitTail = new Date(maxDate);
			}else{
				_limitTail.setMonth(_todayObj.getMonth()+10);
			}

			_set.limitHead = _limitHead;
			_set.limitTail = _limitTail;


			var _name = dateObj.id+"_cal";

			if(_mc[_name] == undefined){
					_mc[_name] = new CalendarClass(parentScreen,_set);
					_mc[_name].id = _name;
			}

			var tmpName = dateObj.id;
			var input_id = "";
			var photo_id = "";
			if(tmpName.indexOf("f_")!=-1){
				input_id = "f_input";
				photo_id = "f_photo";
			}else{
				input_id = "input";
				photo_id = "date";
			}

			_mc[_name].addEventListener("DATE_CHOOSE",function(evt,obj){
					var getDate = _self.dateReplace(obj.date,"get");
					var choseDate = new Date(getDate);

					var _abs = new Object();
					var isEnd = false;
					var date_tmp = "";

					_mc[_name].close();
					dateObj.value = _self.dateReplace(obj.date,"set");
					var dates = "";
					if(_mc["date_input"].value == "" || _mc["date_input"].value==0 || _mc["date_input"].value==undefined){
						dates = _self.getTodays();
					}else{
						dates = _mc["date_input"].value;
					}
					parentClass.dispatchEvent("choseDateEvent", {"name":name,"date":dates});

			});
			_mc[_name].addEventListener("ERROR_DATE",_self.errorDate);
			//dateClickObj.inputId = dateObj.id;
			util.addEvent(dateClickObj, "click", _self.openCalendar);

	}

	_self.getDateValue=function(){

			if(_mc["parObj"]==null) return "";

			var val = _mc["date_input"].value;

			if(!_self.checkFormat(val)){
					_self.setDateValue(_mc["parObj"].def_date);
					return _mc["parObj"].def_date;
			}else{
					return _self.dateReplace(val, "get");;
			}

	}

	_self.setDateValue=function(date){
			_mc["date_input"].value = _self.dateReplace(date,"set");
	}

	_self.openCalendar = function(evt, obj){
			//63.*需求*(新管理端,舊帳,登0,登0舊帳)報表查詢頁,修改報表篩選頁-所有點擊日期的欄位, 當是點擊日期文字時, 日曆也要顯示[CRP-111#7]
			/*try{
				if(evt.target.id==_mc["date_input"].id) return;
			}catch(e){}*/
			// 84.*需求*(新管理端,舊帳,登0,登0舊帳)所有報表查詢頁&篩選頁-更改日曆欄位若點擊後不要有輸入符號“ | ” , 使用戶只能用小日曆更改日期(CRP-131)
			try{
				var isOpen = _mc[_mc["date_input"].id + "_cal"].getisOpen();
				if (evt.target.id == _mc["date_input"].id){
					_mc["date_input"].blur();
					if (!isOpen)	setTimeout(function () { _mc["date_photo"].click(); }, 0 );
					return;
				}
			}catch(e){}

			_self.echo("openCalendar: "+_priv.disabled);
			if(_priv.disabled){
				var tarObj = _mc["date_input"];
				var _abs = new Object();
				var isEnd = false;
				//var _abs = _self.getObjAbsolute_new(tarObj,"report_contain");
				var date = _self.dateReplace(tarObj.value,"get");
				var date_tmp = "";
				var obj_id = evt.target.id;
				var input_id = "";
				if(obj_id.indexOf("f_")!=-1){
					input_id = "f_input";
				}else{
					input_id = "input";
				}
				if(date == 0 || date=='' || date==undefined){date=_self.getTodays();}

				_abs["x"] = _mc["date_photo"].offsetLeft;
				_abs["y"] = _mc["date_photo"].offsetTop+_mc["date_photo"].clientHeight+3;
				var enddate = document.getElementById(input_id+"_enddate").value;
				if (enddate == undefined || enddate == 0 || enddate==""){
					enddate = _self.getTodays();
				}
				date_tmp = _self.dateReplace(enddate,"get");

				_mc[tarObj.id+"_cal"].open(_abs["x"],_abs["y"],date,date_tmp,null,isEnd);
			}

	}

	_self.blurEvent = function(keyEvent, targetObj){
		var tarObj = _mc["date_input"];
		_mc[tarObj.id+"_cal"].close();
	}

	_self.errorDate=function(evt,obj){
			//alert("date format error: "+obj.date);
			_self.showError(obj.date,"");



	}

	_self.showError=function(date, msg){
			_self.echo("date format error: "+date);
			_self.setDateValue(_mc["parObj"].def_date);
			parentClass.dispatchEvent("dateErrorHandler", {"date":date});

	}

	_self.dateReplace=function(str,type){
			var ret_str = str;
			if(ret_str == 0){
				return ret_str;
			}
			if(type=="get"){
					ret_str = ret_str.replace(/ /g,"");
			}
			if(type=="set"){
					ret_str = ret_str.replace(/-/g,"-");
			}
			return ret_str;
	}


	//key event
	_self.keyPressEvent=function(keyEvent, targetObj){
			var keyCode=(window.event)?window.event.keyCode:keyEvent.which;
			if(keyCode==13){


					var val =_mc["date_input"].value;
					_self.echo("keyPressEvent===>enter: "+_self.checkFormat(val));

					if(!_self.checkFormat(val)){
							_self.showError(val,"");
					}

					parentClass.dispatchEvent("enterDateEvent", {"date":val});
			}
	}

	_self.keyUpEvent=function(keyEvent, targetObj){
			var keyCode=(window.event)?window.event.keyCode:keyEvent.which;
			var val = _self.dateReplace(_mc["date_input"].value,"get");
			var tarObj = _mc["date_input"];

			try{
				if(val.length==10){
					if(_self.checkFormat(val) && Date.parse(val) >= Date.parse(limitDate)){
						var isEnd = false;
						var _abs = new Object();
						var obj_id = keyEvent.target.id;
						var targetParent = keyEvent.target.parentNode;
						if(obj_id.indexOf("start")!=-1){
							_abs["x"] = targetParent.offsetLeft;
							_abs["y"] = targetParent.offsetTop+targetParent.clientHeight+3;
							date_tmp = _self.dateReplace(document.getElementById("input_end").value,"get");
						}else{
							//_abs["x"] = targetParent.offsetLeft+targetParent.clientWidth;
							//_abs["y"] = targetParent.offsetTop+targetParent.clientHeight+3;
							_abs["x"] = _mc["date_photo"].offsetLeft + _mc["date_photo"].clientWidth;
							_abs["y"] = _mc["date_photo"].offsetTop + _mc["date_photo"].clientHeight + 3;
							date_tmp = _self.dateReplace(document.getElementById("input_start").value,"get");
							isEnd = true;
						}
						_mc[tarObj.id+"_cal"].open(_abs["x"],_abs["y"],val,date_tmp,null,isEnd);
					}else{
						_self.showError(val,"");
					}
				}
			}catch(e){
				console.log(e);
			}

	}


	//check date format
	_self.checkFormat=function(date){
			if(date == 0){
				return true;
			}
			var _date = _self.dateReplace(date, "get");

			var dateObj = new Date(0);
			var year = _date.split("-")[0];

			if(!_date.match(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/g)){
					return false;
			}

			if(year*1 < dateObj.getFullYear()*1){
					return false;
			}

			_self.echo("_date====>"+_date);



			if(_mc["parObj"].range_s!=null){
					if(_date < _mc["parObj"].range_s){
							return false;
					}
			}

			if(_mc["parObj"].range_e!=null){
					if(_date > _mc["parObj"].range_e){
							return false;
					}
			}

			return true;
	}

	_self.getToday=function(){

			var zone = WEB_TIME_ZONE;
			var obj = _self.DateTimezone(((zone)?zone:8));
			var year = obj.getFullYear();
			var month = obj.getMonth()+1;
			var day = obj.getDate();
			return _self.addZero(year) + " - " + _self.addZero(month) + " - " + _self.addZero(day);

	}

	_self.getTodays=function(){

		var zone = WEB_TIME_ZONE;
		var obj = _self.DateTimezone(((zone)?zone:8));
		var year = obj.getFullYear();
		var month = obj.getMonth()+1;
		var day = obj.getDate();
		return _self.addZero(year) + "-" + _self.addZero(month) + "-" + _self.addZero(day);

	}

	_self.addZero=function(code){
			return (code*1 < 10)?"0"+code:code;
	}

	_self.DateTimezone=function(offset) {

		// 建立現在時間的物件
		d = new Date();

		// 取得 UTC time
		utc = d.getTime() + (d.getTimezoneOffset() * 60000);

		// 新增不同時區的日期資料
		return new Date(utc + (3600000*offset));

	}

	_self.setDisabled = function(_val){
		if(_val==null){
			return _priv.disabled;
		}else{
			_priv.disabled = _val;
		}
	}

	_self.getObjAbsolute_new=function(obj,stop_name){
		var abs = new Object();

		abs["left"] = obj.offsetLeft;
		abs["top"] = obj.offsetTop;

		while(obj = obj.offsetParent){
				if(_self.getStyle(obj,"position") == "relative"){
						////console.log(obj.id+"|"+obj.offsetParent.id+"|"+_self.getStyle(obj,"top")+"|"+_self.getStyle(obj,"margin-top")+"|"+obj.offsetTop);
						if((obj.id!="" && obj.offsetParent.id!="") && _self.getStyle(obj,"top")!="auto" && _self.getStyle(obj,"margin-top")!="auto" && _self.getStyle(obj,"margin-top")!="0px"){
								abs["top"] += -obj.offsetTop;
								continue;
						}
				}

				if(stop_name!=undefined && obj.id==stop_name){
						break;
				}else if(_self.getStyle(obj,"position") == "absolute"){
						break;
				}

				abs["left"] += obj.offsetLeft;
				abs["top"] += obj.offsetTop;
		}
		return abs;
	}

	_self.getStyle=function(oElm,strCssRule){
		var strValue = "";
		if(document.defaultView && document.defaultView.getComputedStyle){
				strValue = document.defaultView.getComputedStyle(oElm,"").getPropertyValue(strCssRule);
		}else if(oElm.currentStyle){
				strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
						return p1.toUpperCase();
				});
				strValue = oElm.currentStyle[strCssRule];
		}else{
				return "error";
		}
		return strValue;
	}

	_self.restart = function(){ //重起月曆
		var tarObj = _mc["date_input"];
		var  isOpen =_mc[tarObj.id+"_cal"].getisOpen();
		if(isOpen){
			_mc[tarObj.id+"_cal"].close();
			_mc["date_photo"].click();
		}
	}

	_self.echo=function(msg){
		 //console.log(msg, "[calendar]");
	}


}