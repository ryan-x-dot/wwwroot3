/*
2019-01-28 
1. 加強版日曆，本月前後日期，補上月底及下個月初

*/

function ClassFankCal_ag(parentClip,setInput,windowEvent){
	var _se = this; // public
		_se.name = "ClassFankCal_ag";
	var _pr = {}; //pravite
	var _myParent = parentClip;
	var _movieClipBox = {};
	var _startObj = new Date(0);
	var _choseObj = new Date();
	var _todayObj;

	var _eventHandler=new Array();
	var _windowEvent = window.event;
	var _isOpen = false;
	var _tmpBox = {};
	var _tmpDay = "";
	


	var _set = Object();
		_set.cssTest = false; // 是否要開啓tag.title = CSS name;
		_set.cssShow = true; // 是否要開啓預設CSS;
		_set.monthName = ["January","February","March","April","May","June","July","August","September","October","November","December"]; // 月份語系;
		_set.weekName = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]; // 星期語系;
		_set.futureYear = 10; // 未來年份數;
		_set.defaultShow = false; // 預設是否為開啓;
		_set.docu = document;
		_set.outClose = true;
		_set.outday = "";//超過日期不能點擊
		_set.outday2 = "";//超過日期不能點擊
		_set.limitHead = "";
		_set.limitTail = "";
		_set.tmptoday = "";

	_pr.eventhandler=function(_evt,_eventName,_obj){
			if (_eventHandler[_eventName]!=undefined){
				_eventHandler[_eventName](_evt,_obj);
			}else{
				alert(_se.name+":"+_eventName+" not override !!");
			}
        }	

	_se.addEventListener=function(eventname,eventFunction){
			_eventHandler[eventname]=eventFunction;
        }	

	_pr.init = function(){
			if(windowEvent!=undefined) _windowEvent = windowEvent;

			_pr.reset_set();
			var _showDiv = _pr.myCreateElement("div");
            _showDiv.style.position = "absolute" ;
            _showDiv.style.display = (_set.defaultShow)?"":"none";
            _movieClipBox["showDiv"] = _showDiv;
            //_top["Util"].setObjectOpacity(_movieClipBox["showDiv"],0);
            _pr.setClass(_showDiv,"cal_div");
			_pr.setToday(_set.tmptoday);
            var _titleDiv = _pr.buildHeader(_choseObj);	
            
            var _calDiv = _pr.buildCalender(_choseObj);

            _showDiv.appendChild(_titleDiv);	
            _showDiv.appendChild(_calDiv);

            // _se.addEventListener("DATE_CHOOSE",_pr.showDateChoose);
            // _se.addEventListener("ERROR_DATE",_pr.showErrorDate);

            _myParent.appendChild(_showDiv);

            //_set.docu.onclick = _pr.chkClose;

            if(_set.cssShow) _pr.setStyle(); 

		}
		
	_pr.buildHeader=function(_dateObj){
			var _titleDiv = _pr.myCreateElement("div");
			_pr.setClass(_titleDiv,"cal_YearContain");
			_movieClipBox["headerDiv"] = _titleDiv;

            var _previousMonth = _pr.myCreateElement("span");	
                if(_set.cssShow) _previousMonth.innerHTML = "&lt;";
                _previousMonth.onclick = function(){_pr.chgMonth(-1);};
				_pr.setClass(_previousMonth,"cal_previous");
				_movieClipBox["previousMonth"] = _previousMonth;

            var _nextMonth = _pr.myCreateElement("span");	
                if(_set.cssShow) _nextMonth.innerHTML = "&gt;";
                _nextMonth.onclick = function(){_pr.chgMonth(+1);};
				_pr.setClass(_nextMonth,"cal_next");
				_movieClipBox["nextMonth"] = _nextMonth;

            var _yearSel = _pr.setYearSel(_dateObj);
            var _monthSel = _pr.setMonthSel(_dateObj);

            var _yearLabel = _pr.myCreateElement("label");
                _yearLabel.appendChild(_yearSel);
                _pr.setClass(_yearLabel,"cal_year_label");

            var _monthLabel = _pr.myCreateElement("label");
                _monthLabel.appendChild(_monthSel);
                _pr.setClass(_monthLabel,"cal_month_label");	

            _titleDiv.appendChild(_previousMonth);
            _titleDiv.appendChild(_monthLabel);
            _titleDiv.appendChild(_yearLabel);
			_titleDiv.appendChild(_nextMonth);
			
			return _titleDiv;
		}

    _pr.myCreateElement = function(tagName){
            var _elm = _set.docu.createElement(tagName);
            if(tagName!="style"){
                _elm.setAttribute("name","fank_calander_element");
            }

            return _elm;
        }

    _pr.reset_set = function(){
            if(setInput!=undefined){
                for(var _key in _set){
                    if(setInput[_key]!=undefined) _set[_key] = setInput[_key];
                }
            }

            return;
        }

    _pr.setYearSel = function(_dateObj){
            var _start = _set.limitHead.getFullYear();
            var _end = _set.limitTail.getFullYear();
            var _selObj = _pr.myCreateElement("select");

            for(var i=_start;i<=_end+_set.futureYear;i++){
                var _opt = new Option(i, i, false, false);
                _selObj.options.add(_opt);
            }

            //selObj.setAttribute("id","yearSel");
            _movieClipBox["yearSel"] = _selObj;
            _selObj.value = (_dateObj!=null)?_dateObj.getFullYear():_end;
            _selObj.onchange = _pr.changeDate;
            _pr.setClass(_selObj,"cal_year");

            return _selObj;
        }

    _pr.setMonthSel = function(_dateObj){
			
            var _now = _choseObj.getMonth();
			var _selObj = _pr.myCreateElement("select");
			var choseYear = _movieClipBox["yearSel"].value;	
			var headYear = _set.limitHead.getFullYear();
			var tailYear = _set.limitTail.getFullYear();

            for(var i=0;i<_set.monthName.length;i++){
				if(headYear!=tailYear){
					if(choseYear== headYear && _set.limitHead!=""){
						if(i+1 > _set.limitHead.getMonth()){
							var _opt = new Option(_set.monthName[i], i, false, false);
							_selObj.options.add(_opt);
						}
					}
					if( choseYear > headYear && choseYear < tailYear && _set.limitHead!="" && _set.limitTail!=""){
						var _opt = new Option(_set.monthName[i], i, false, false);
						_selObj.options.add(_opt);
					}
					if(choseYear== tailYear && _set.limitTail!=""){
						if(i <= _set.limitTail.getMonth()){
							var _opt = new Option(_set.monthName[i], i, false, false);
							_selObj.options.add(_opt);
						}
					}
				}else{
					var _opt = new Option(_set.monthName[i], i, false, false);
					_selObj.options.add(_opt);
				}
            }

			_movieClipBox["monthSel"] = _selObj;
            _selObj.value = _dateObj.getMonth();
            _selObj.onchange = _pr.changeDate;
            _pr.setClass(_selObj,"cal_month");
            
            return _selObj;
		}	

    _pr.buildCalender = function(_dateObj,_tmpDayObj){
            var _endDate = _pr.getLastDate(_dateObj);
            var _showDiv = _pr.myCreateElement("div");
            //showDiv.setAttribute("id","calDiv");
            _movieClipBox["calDiv"] = _showDiv;

            /***** week *****/
            for(var i=0;i<_set.weekName.length;i++){
                var _week = _pr.myCreateElement("span");
                if(i==0) _pr.setClass(_week,"cal_week_left");//week.setAttribute("id","week_left");
                else	 _pr.setClass(_week,"cal_week");//week.setAttribute("id","week");
                _week.innerHTML = _set.weekName[i];
                

                _showDiv.appendChild(_week);
            }

            _showDiv.appendChild(_pr.myCreateElement("br"))

            /***** days *****/ 	
            for(var i=1;i<=_endDate;i++){					
                var _tmpObj = new Date();
                    _tmpObj.setFullYear(_dateObj.getFullYear());
                    _tmpObj.setDate(1);
                    _tmpObj.setMonth(_dateObj.getMonth());
                    _tmpObj.setDate(i);
                var _weekNO = _tmpObj.getDay();

                if(i==1) _pr.addSpace(_showDiv,_weekNO,false,_dateObj);

                var _span = _pr.myCreateElement("span");           
                    _pr.dayShow(_span,_tmpObj,_tmpDayObj);
                
                _showDiv.appendChild(_span);

                if(_weekNO==6) _showDiv.appendChild(_pr.myCreateElement("br"));

                if(i==_endDate) _pr.addSpace(_showDiv,_weekNO,true);
            }

            return _showDiv;
        }

    _pr.getLastDate = function(_dateObj){
            var _chk = 31;
            var _tmpObj = new Date();
            //_tmpObj.setMonth(0);//getMonth bug
            _tmpObj.setDate(1);//getMonth bug
            for(var i=_chk;i>0;i--){
                _tmpObj.setFullYear(_dateObj.getFullYear());
                _tmpObj.setMonth(_dateObj.getMonth());
                _tmpObj.setDate(i);
                if(_dateObj.getMonth()==_tmpObj.getMonth()) return _tmpObj.getDate();
            }

            return 0;
            
        }

    _pr.addSpace = function(_divObj,_spaceCnt,_isEnd,_dateObj){
            var _start = 0;
			var _end = 0;
			var _nowPos = 0;
			
            if(_isEnd){
				var _nextMonthDate = 1;
                _start = _spaceCnt+1 ; _end = 7;
            }else{
				var _lastMonth = new Date();
					_lastMonth.setFullYear(_dateObj.getFullYear());
					_lastMonth.setMonth(_dateObj.getMonth()-1);
				var _lastMonthDate = _pr.getLastDate(_lastMonth);
				var _lastMonthAry = new Array();
				for(var i = _lastMonthDate-6 ; i <= _lastMonthDate; i++){
					_lastMonthAry.push(i);
				}
				_start = 0; 
				_end = _spaceCnt;
				_nowPos = _lastMonthAry.length - (_end - _start);
            }
			
            for(var j=_start;j<_end;j++){
                var _span = _pr.myCreateElement("span");
                if(j==0) _pr.setClass(_span,"cal_date_left cal_space"); 
				else     _pr.setClass(_span,"cal_date cal_space");	
                if(_isEnd){ 
					_span.innerHTML = _nextMonthDate;
					_nextMonthDate++;
				}else{
					_span.innerHTML = _lastMonthAry[_nowPos+j];
				}
                _divObj.appendChild(_span);
            }
        }

    _pr.dayShow = function(_spanObj,_dateObj,_tmpDayObj){
            var _weekNO = _dateObj.getDay();
            var _goalClass = "";
			var _opendate = true;

			if(_tmpDayObj!=null){
				if(_dateObj.getFullYear()==_choseObj.getFullYear()
					&& _dateObj.getMonth()==_choseObj.getMonth()
					&& _dateObj.getDate()==_choseObj.getDate()
					){
						_tmpBox["goalSpan"] = _spanObj; 
						_goalClass = "cal_select";
				}else if( _dateObj < _tmpDayObj && _dateObj > _choseObj ){
					_goalClass = "cal_selectmid";
				}
				if(	_dateObj.getFullYear()==_tmpDayObj.getFullYear()
					&& _dateObj.getMonth()==_tmpDayObj.getMonth()
					&& _dateObj.getDate()==_tmpDayObj.getDate()
					){
						_tmpBox["goalSpan"] = _spanObj; 
						_goalClass = "cal_select";
				}else if( _dateObj > _tmpDayObj && _dateObj < _choseObj ){
					_goalClass = "cal_selectmid";
				}
			}else{
				if(_dateObj.getFullYear()==_choseObj.getFullYear()
					&& _dateObj.getMonth()==_choseObj.getMonth()
					&& _dateObj.getDate()==_choseObj.getDate()
					){
						_tmpBox["goalSpan"] = _spanObj; 
						_goalClass = "cal_select";
				}
			}

			if(_dateObj.getFullYear()==_todayObj.getFullYear()
				&& _dateObj.getMonth()==_todayObj.getMonth()
				&& _dateObj.getDate()==_todayObj.getDate()
				){
					_tmpBox["goalSpan"] = _spanObj; 
					_goalClass += " cal_goal";
			}
			
            

            var _tmpMinDate = new Date();
            var _tmpMin = _set.outday.split("-");
            _tmpMinDate.setFullYear(_tmpMin[0]*1);
            _tmpMinDate.setMonth(_tmpMin[1]*1-1);
            _tmpMinDate.setDate(_tmpMin[2]*1);
            _MindayObj = _tmpMinDate;

            var _tmpMaxDate = new Date();
            var _tmpMax = _set.outday2.split("-");
            _tmpMaxDate.setFullYear(_tmpMax[0]*1);
            _tmpMaxDate.setMonth(_tmpMax[1]*1-1);
            _tmpMaxDate.setDate(_tmpMax[2]*1);
            _MaxdayObj = _tmpMaxDate;

            var currDate = Date.parse(_dateObj.toDateString());
            var outDate = Date.parse(_set.outday);

            if(	(Date.parse(_dateObj)).valueOf() < (Date.parse(_MindayObj)).valueOf()){
                _goalClass = "cal_noselect";
                _opendate = false;
			}
			
			if( (Date.parse(_dateObj)).valueOf() < (Date.parse(_set.limitHead)).valueOf() ){
				_goalClass = "cal_space";
				_opendate = false;
			}

            if(	(Date.parse(_dateObj)).valueOf() > (Date.parse(_MaxdayObj)).valueOf()){
                _goalClass = "cal_noselect";
                _opendate = false;
            }

            if(_weekNO==0) _pr.setClass(_spanObj,"cal_date_left "+_goalClass);//span.setAttribute("id","left");
            else		  _pr.setClass(_spanObj,"cal_date "+_goalClass);	

            _spanObj.innerHTML = _dateObj.getDate();
            _spanObj.dateObj = _dateObj;
            if(_opendate){
                _spanObj.onclick = function(){_pr.dateChoose(_spanObj);};
            }

            return;

        }

    _pr.getMyDateStr = function(_dateObj){
            var _year = _dateObj.getFullYear();
            var _month = _dateObj.getMonth()*1+1;
            var _date = _dateObj.getDate();

            var _out_put_str = _year+"-";
                _out_put_str+= (_month*1<10)?"0"+_month:_month;
                _out_put_str+= "-";
                _out_put_str+= (_date*1<10)?"0"+_date:_date;

            return 	_out_put_str;
        }

	_pr.setToday = function(_targetDay){
			_todayObj = new Date(_targetDay);
		}
	//=================== event ====================//

	

	_se.open = function(_x,_y,_date,_date_tmp,_input,isEnd){
			// console.log("open");
			if(_isOpen == true) return;
			
			var _tmpDate = new Date();
			//_tmpDate.setMonth(0); //模擬問題
			_tmpDate.setDate(1);
			var _tmpStr = _date.split("-");
			////console.log(_startObj.getFullYear()+"|"+_tmpStr[0]*1);
			if(!_date.match(/^[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])$/g)){
				
				_pr.eventhandler(null,"ERROR_DATE",{"date":_date});
				return ;

			}else if(_startObj.getFullYear()*1 > _tmpStr[0]*1){
				_pr.eventhandler(null,"ERROR_DATE",{"date":_date});
				return ;

			}
			_tmpDate.setFullYear(_tmpStr[0]*1);
			_tmpDate.setMonth(_tmpStr[1]*1-1);
			_tmpDate.setDate(_tmpStr[2]*1);

			_choseObj = _tmpDate;
			_movieClipBox["yearSel"].value = _choseObj.getFullYear();
			_movieClipBox["monthSel"].value = _choseObj.getMonth();

			var _tmpDayObj = new Date(_date_tmp);
			_tmpDay = _tmpDayObj;
			_pr.resetCalDiv(_choseObj,_tmpDayObj);

			if(_choseObj.getFullYear()*1 == _set.limitHead.getFullYear() && _choseObj.getMonth() == _set.limitHead.getMonth()){
				_movieClipBox["previousMonth"].classList.add("no_hand");
				_movieClipBox["previousMonth"].onclick = null;
			}else if(_choseObj.getFullYear()*1 == _set.limitTail.getFullYear() && _choseObj.getMonth() == _set.limitTail.getMonth()){
				_movieClipBox["nextMonth"].classList.add("no_hand");
				_movieClipBox["nextMonth"].onclick = null;
			}

			_tmpBox["outInput"] = _input;
			_movieClipBox["showDiv"].style.display = "";
			_movieClipBox["showDiv"].style.top = _y+"px";
			_movieClipBox["showDiv"].style.left = (isEnd)?_x-_movieClipBox["showDiv"].clientWidth+"px":_x+"px";
			
			
			//_se.Ani("cal_opacity1");
			if (_set.outClose){
				_pr.setEvent(_set.docu,"click",_pr.chkClose);
			}else{
				_isOpen = true;
			}
			// console.log("open end");
		}

	_se.close = function(){
			 if (_set.outClose) _pr.delEvent(_set.docu,"click",_pr.chkClose);
			_movieClipBox["showDiv"].style.display = "none";
			//_se.Ani("cal_opacity0");
			_isOpen = false;
		}	
	_se.Ani  = function(cssName){
		var obj = _movieClipBox["showDiv"];
		var animSetting,runtime,cnt;
		var ani = new _top["cssAniClass"](obj);
		animSetting = ani.getAnimationSetting(cssName);
		runtime = animSetting["duration"].replace("s","")*1000;
		//cnt = animSetting["iteration-count"];
		if(ani.browser()=="Firefox"){
			obj.style["animation-name"] = animSetting.name;
		}else{
			obj.style["-webkit-animation-name"] = animSetting.name;
		}
		//ani.setKeyFrame(ani.KeyFrameSize()-1,"0.5");
		ani.finish=function(obj,cssName){
			if(cssName=="cal_opacity1"){
				//obj.style.display="";
			}
			if(cssName=="cal_opacity0"){
				obj.style.display="none";
			}
		}
		ani.play(runtime,1);	
	}
	_pr.chkClose = function(evt){
			evt = evt || _windowEvent;
			var target = evt.target || evt.srcElement ; 

			if(!_isOpen){
				_isOpen = true;
			}else if(target.getAttribute("name") != "fank_calander_element"){
			 	_se.close();
			}
		}	

	_pr.changeDate = function(e){	
			var choseTarget = e.target.className;
			var headYear = _set.limitHead.getFullYear();
			var tailYear = _set.limitTail.getFullYear();
			var _yearSel = _movieClipBox["yearSel"]//document.getElementById("yearSel");
			var _monthSel = _movieClipBox["monthSel"];//document.getElementById("monthSel");
			var _dateObj = new Date();
			//_dateObj.setMonth(0);//getMonth bug
			_dateObj.setDate(1);//getMonth bug
			if(choseTarget.indexOf("year")!=-1){
				if(e.target.value==headYear){
					_dateObj.setFullYear(e.target.value);
					_dateObj.setMonth(_set.limitHead.getMonth());
				}else if(e.target.value==tailYear){
					_dateObj.setFullYear(e.target.value);
					_dateObj.setMonth(_set.limitTail.getMonth());
				}else{
					var nowObj = new Date();
					_dateObj.setFullYear(e.target.value);
					_dateObj.setMonth(nowObj.getMonth());
				}
			}else{
				_dateObj.setFullYear(_yearSel.value);
				_dateObj.setMonth(_monthSel.value);
			}
			_pr.resetCalDiv(_dateObj,_tmpDay);

			if(_dateObj.getFullYear()*1 == _set.limitHead.getFullYear() && _dateObj.getMonth() == _set.limitHead.getMonth()){
				_movieClipBox["previousMonth"].classList.add("no_hand");
				_movieClipBox["previousMonth"].onclick = null;
			}else if(_dateObj.getFullYear()*1 == _set.limitTail.getFullYear() && _dateObj.getMonth() == _set.limitTail.getMonth()){
				_movieClipBox["nextMonth"].classList.add("no_hand");
				_movieClipBox["nextMonth"].onclick = null;
			}
		}			

	_pr.chgMonth = function(_editValue){
			var _dateObj = new Date();
			//_dateObj.setMonth(0);//getMonth bug
			_dateObj.setDate(1);//getMonth bug
			_dateObj.setFullYear(_movieClipBox["yearSel"].value);
			_dateObj.setMonth(_movieClipBox["monthSel"].value*1+_editValue);

			
			if(_startObj.getFullYear()*1 <= _dateObj.getFullYear()*1){
				_movieClipBox["yearSel"].value = _dateObj.getFullYear();
				_movieClipBox["monthSel"].value = _dateObj.getMonth();
				_pr.resetCalDiv(_dateObj,_tmpDay);
			}

			if(_dateObj.getFullYear()*1 == _set.limitHead.getFullYear() && _dateObj.getMonth() == _set.limitHead.getMonth()){
				_movieClipBox["previousMonth"].classList.add("no_hand");
				_movieClipBox["previousMonth"].onclick = null;
			}else if(_dateObj.getFullYear()*1 == _set.limitTail.getFullYear() && _dateObj.getMonth() == _set.limitTail.getMonth()){
				_movieClipBox["nextMonth"].classList.add("no_hand");
				_movieClipBox["nextMonth"].onclick = null;
			}
			
		}	

    _pr.resetCalDiv = function(_dateObj,_tmpDayObj){
			var _oldCalDiv = _movieClipBox["calDiv"];
			var _oldMonthDiv = _movieClipBox["headerDiv"];
			var _monthDiv = _pr.buildHeader(_dateObj);
			var _calDiv = _pr.buildCalender(_dateObj,_tmpDayObj);
			_movieClipBox["showDiv"].replaceChild(_monthDiv, _oldMonthDiv);
            _movieClipBox["showDiv"].replaceChild(_calDiv, _oldCalDiv);

            return;
        }


	_pr.dateChoose = function(_targetObj){
           
            var _dateValue = _pr.getMyDateStr(_targetObj.dateObj);

            _choseObj = _targetObj.dateObj;

            if(_tmpBox["goalSpan"]!=undefined){
                _pr.dayShow(_tmpBox["goalSpan"],_tmpBox["goalSpan"].dateObj);
            }
			_pr.dayShow(_targetObj,_targetObj.dateObj);
			

            if(_tmpBox["outInput"]!=undefined) _tmpBox["outInput"].value = _dateValue;

            var _obj = {"date":_dateValue};
            _pr.eventhandler(null,"DATE_CHOOSE",_obj);
        }				

	_pr.showDateChoose = function(evt,obj){
			//alert("event:DATE_CHOOSE obj.date:"+obj.date);
	    }

	_pr.showErrorDate = function(evt,obj){
			//alert("event:ERROR_DATE obj.date:"+obj.date);
	    }

	//=================== util ======================//

	_pr.setClass = function(targetObj,classStr){
			var browserVar = navigator.userAgent.toLowerCase();
			if(browserVar.indexOf("msie") > -1){
					targetObj.className = classStr;
			}else{
					targetObj.setAttribute("class", classStr);
			}

			if(_set.cssTest) targetObj.setAttribute("title", classStr);
			return;
		}	

	_pr.setEvent = function(target,eventName,func){
			
			if(target.attachEvent!=undefined){
				target.attachEvent("on"+eventName,func);
			}else{
				target.addEventListener(eventName,func,false);
			}
			return;
		}	

	_pr.delEvent = function(target,eventName,func){
		
            if(target.detachEvent!=undefined){
                target.detachEvent("on"+eventName,func);
            }else{
                target.removeEventListener(eventName,func,false);
            }
            return;
        }	


	_pr.setStyle = function(){
			var _css ="";
				_css+=".cal_div{";
				_css+="width:226px;";
				_css+="background-color:pink;";
				_css+="}";
				_css+=".cal_previous , .cal_next{";
				_css+="display:inline-block;";
				_css+="width:38px;";
				_css+="text-align: center;";
				_css+="}";
				_css+=".cal_date , .cal_date_left , .cal_week , .cal_week_left  {";
				_css+="display:inline-block;";
				_css+="width:30px;";
				_css+="height:26px;";
				_css+="text-align: center;";
				_css+="font-size: 20px;";
				_css+="line-height: 33px;";
				_css+="border-color:skyblue;";
				_css+="border-width: 2px;";
				_css+="border-right-style:solid;";
				_css+="border-bottom-style:solid;";
				_css+="background-color:#DDDDDD;";
				_css+="}";
				_css+=".cal_date_left , .cal_week_left {";
				_css+="border-left-style:solid;";
				_css+="}";
				_css+=".cal_week ,  .cal_week_left{";
				_css+="display:inline-block;";
				_css+="height:22px;";
				_css+="text-align: center;";
				_css+="font-size: 12px; ";
				_css+="background-color: black;";
				_css+="color: yellow; ";
				_css+="line-height: 25px;";
				_css+="}";
				_css+=".cal_date ,.cal_date_left {";
				_css+="cursor:pointer; ";
				_css+="}";
				_css+=".cal_goal{";
				_css+="color: red;";
				_css+="}";

			
			var _exist = false;	
			var _styles = _set.docu.getElementsByTagName('style');

			for(var i=0; i<_styles.length ; i++){
				if(_styles[i].id=="fankCal_css"){
					_exist = true;
				}
			}

			if(!_exist){	
				////console.log("exist");

				_head = _set.docu.head || _set.docu.getElementsByTagName('head')[0],
    			_style = _pr.myCreateElement('style');
    			_style.setAttribute("id","fankCal_css");

    			_style.type = 'text/css';
				if (_style.styleSheet){
				  _style.styleSheet.cssText = _css;
				} else {
				  _style.appendChild(_set.docu.createTextNode(_css));
				}

				_head.appendChild(_style);

    		}

		}

	_se.getSet = function(){
		var _str = "";
		for(var _key in _set){
			_str += _key+":"+_set[_key]+",";
		}

		return _str;
	}

	_se.getisOpen = function(){
		return _isOpen;
	}
								
	
	_pr.init();//constructor				
}