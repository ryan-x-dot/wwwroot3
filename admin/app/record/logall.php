
<!DOCTYPE html>
<html>
<head>
    <title></title>
    <meta http-equiv="Content-type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0,user-scalable=no">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <script id="indexJS">// 2018-01-15 iphone UC 瀏覽器使用body position:fixed 造成螢幕最下方會有黑色遮住交易單
function bodyPreventDefault(){
    var _self = this;
    var ts = new Object;
    //🌖538.ios-safari&uc-報表-在細單層滑動時, 點開右側在滑動左邊區空, 上方標題列不應該被滑動(PJP-553)
    // 多3px 誤差 讓左右還可以滑動
    var fixY = 10;
    var bet_content = document.getElementById("body_show");


    var top_menu = document.getElementById("top_menu_show");
    var main_menu = document.getElementById("dashboard_main");
    var bottom_menu = document.getElementById("bottom_menu_show");

    _self.init = function(){

        // document.body.addEventListener("touchstart",_self.bodyScroll);
        // document.body.addEventListener("touchmove",_self.bodyScroll);

        _self.blockMovedownRefresh(window, document, "prev_scroll_lock");
    }

    // _self.remove=function(){
    //     document.body.removeEventListener("touchstart",_self.bodyScroll);
    //     document.body.removeEventListener("touchmove",_self.bodyScroll);
    // }


    // _self.bodyScroll = function (e){
    //     _self.listenEvent(e,document.getElementById(e.target.id));
    // }

    // _self.touchObject = function(targetObject, eventObject){
    //     try{
    //         // 取得當下指定物件以下的所有物件
    //         var allobj = targetObject.getElementsByTagName("*");
    //         // 最底層的物件（只有他自己）
    //         if (allobj.length==0) return true;
    //         for (var i=0;i<allobj.length;i++){
    //             if (allobj[i]==eventObject){
    //                 return true;
    //             }
    //         }
    //     }catch(e){
    //         return false;
    //     }

    //     return true;
    // }

    // _self.listenEvent = function (e,targetObject){
    //     var touch=e.targetTouches[0];
    //     if (e.type=="touchstart"){
    //         ts.x=touch.pageX;
    //         ts.y=touch.pageY;
    //     }

    //     //例外的物件（必須執行的指定物件）之外的物件
    //     if (!_self.touchObject(targetObject,e.target)){
    //         // e.target.id = "" 代表物件移轉到body身上
    //         if(e.target.id!="") _self.stopBodyDefaultEvent(e);
    //     }else{
    //         // 捲到捲到指定物件頁首
    //         if (targetObject.scrollTop==0){
    //             if (ts.y-touch.pageY<0){
    //                 if (e.type=="touchmove"){
    //                     _self.stopBodyDefaultEvent(e);
    //                 }
    //             }
    //         }

    //         // 捲到指定物件的頁尾
    //         if ((targetObject.scrollTop+targetObject.clientHeight)==targetObject.scrollHeight){
    //             if (ts.y-touch.pageY>0){
    //                 if (e.type=="touchmove"){
    //                     _self.stopBodyDefaultEvent(e);
    //                 }
    //             }
    //         }
    //     }
    // }

    // _self.stopBodyDefaultEvent = function(e){
    //     // if(top.username=="pp") alert("stopBodyDefaultEvent");
    //     e.preventDefault();
    //     e.stopPropagation();
    // }

    //========= block move down refresh =========

    _self.blockMovedownRefresh = function (wd, doc, lock_tag) {

        var isWindowTop = false;
        var isWindowBottom = false;
        var startTouchY = 0;

        //roland
        var isTopMove = false;
        var isBottomMove = false;

        var touchStartHandler = function(e) {
            if (e.touches.length !== 1) return;
            startTouchY = e.touches[0].clientY;

            // isWindowTop = (wd.pageYOffset <= 10);
            // console.log("event:"+e.target.id);
            var scrollObj = getScrollObj(e);
            // console.log(scrollObj);
            if(scrollObj==null) return;

            // isWindowTop = (scrollObj.scrollTop <= 0);
            var urlHeight=document.body.scrollTop;

            // var urlHeightBody = document.body.scrollHeight - document.body.clientHeight;
            // if(urlHeight > urlHeightBody) urlHeight = urlHeightBody;

            isWindowTop = (scrollObj.scrollTop+urlHeight <= 0);
            isWindowBottom = (scrollObj.scrollTop + scrollObj.clientHeight >= scrollObj.scrollHeight);
            isWindowBottom = isWindowBottom && (!getBottomIgnoreObj(e)); //特定物件 需要使用x軸向不跑該邏輯 EX報表

            writeLog("urlHeight:"+urlHeight+" scrollTop:"+scrollObj.scrollTop+" clientHeight:"+scrollObj.clientHeight+" scrollHeight:"+scrollObj.scrollHeight);
            writeLog("scrollObj.id = "+scrollObj.id+"  "+"isWindowTop = "+isWindowTop+" isWindowBottom = "+isWindowBottom);
        };

        var getScrollObj = function(e){
            var obj = e.target;
            return checkParentNode(obj);
        }

        var checkParentNode = function(obj){
            //writeLog("[checkParentNode] id:"+obj.id+" name:"+obj.name+" className:"+obj.className);
            if (obj.getAttribute && obj.getAttribute("name") == lock_tag){
                return obj;
            } else if (obj["prev_scroll_lock"] == true){
                return obj;
            } else if (obj.classList && obj.classList.contains("re_detail_scroll")) {
                return obj;
            }else{
                obj = getParentNode(obj);
                //writeLog("[getParentNode]"+obj.id);
                if(obj==null) return null;
                return checkParentNode(obj);
            }
        }

        var getBottomIgnoreObj = function (e) {
            var obj = e.target;
            return checkParentBottomIgnore(obj);
        }

        var checkParentBottomIgnore = function (obj) {
            writeLog("[checkParentNode]"+obj.id);
            if (obj.prevScrollBottomIgnore) {
                return true;
            } else {
                obj = getParentNode(obj);
                //writeLog("[getParentNode]"+obj.id);
                if (obj == null) return false;
                return checkParentBottomIgnore(obj);
            }
        }

        var getParentNode = function(_node){
            return _node.parentNode;
        }

        var touchMoveHandler = function(e) {
            var nowTouchY = e.touches[0].clientY;

            writeLog("[touch move]isWindowTop="+isWindowTop+" isWindowBottom="+isWindowBottom+", "+startTouchY+" >< "+nowTouchY+" -+ "+fixY);
            if (isWindowTop) {
                if( startTouchY < nowTouchY - fixY){  //往下
                    writeLog("[touch move]block down");
                    e.preventDefault();
                    _self.androidBlock(true);
                    return false;
                }
            }
            if (isWindowBottom) {
                if (startTouchY > nowTouchY + fixY) {
                    writeLog("[touch move]block up");
                    e.preventDefault();
                    _self.androidBlock(true);
                    return false;
                }
            }
            /*
            writeLog("[window.screen.height]  "+window.screen.height);
            writeLog("[document.body.clientHeight]  "+document.body.clientHeight);

            writeLog("[top_menu][offsetTop]  "+top_menu.offsetTop);
            writeLog("[top_menu][offsetHeight]  "+top_menu.offsetHeight);

            writeLog("[main_menu][offsetTop]  "+main_menu.offsetTop);
            writeLog("[main_menu][offsetHeight]  "+main_menu.offsetHeight);

            writeLog("[bottom_menu][offsetTop]  "+bottom_menu.offsetTop);
            writeLog("[bottom_menu][offsetHeight]  "+bottom_menu.offsetHeight);

            if ( top_menu.offsetTop < 0 ) {
                writeLog("[touch move][offsetTop]block down");
                e.preventDefault();
                _self.androidBlock(true);
                return false;
            }
            if (top_menu.offsetTop+top_menu.offsetHeight > document.body.clientHeight) {
                writeLog("[touch move][offsetTop]block up");
                e.preventDefault();
                _self.androidBlock(true);
                return false;
            }
            if (bottom_menu.offsetTop+bottom_menu.offsetHeight > document.body.clientHeight) {
                writeLog("[touch move][offsetTop]block up");
                e.preventDefault();
                _self.androidBlock(true);
                return false;
            }
            */
        };

        var in_array = function(txt, ary){
            for(var i=0; i<ary.length; i++){
                if(ary[i]==txt)  return true;
            }
            return false;
        }


        var touchEndHandler = function(e) {
            _self.androidBlock(false);
        }

        doc.body.addEventListener('touchstart', touchStartHandler, false);
        doc.body.addEventListener('touchmove', touchMoveHandler, {passive: false});
        doc.body.addEventListener('touchend', touchEndHandler, false);

    }

    _self.androidBlock=function(isBlock){
        var sty = document.body.getAttribute("style") || "";
        sty = sty.replace(/touch-action:none;/gi,"");
        var blk = (isBlock)? "touch-action:none;" : "";
        document.body.setAttribute("style", sty+blk);
    }

    function writeLog(msg){
        if(top.username=="roland"){
            //console.log(msg);
            return "";
            var _url = document.location.protocol+"//"+document.domain + "/lib/write_log.php";
            var param = "";
            param+="user="+top.username;
            param+="&msg="+encodeURIComponent(msg);
            //param+="&msg="+msg;

            var hr = new HttpRequest();
            hr.addEventListener("LoadComplete", function(){});
            hr.loadURL(_url,"POST",param);
        }
    }

    //========= block move down refresh =========

}


        if(typeof console === undefined){
            window.console = new Object();
            window.console.log = emptyFun;
            window.console.error = emptyFun;
        }

        var emptyFun = function(){

        }
// 2018-01-15 iphone UC 瀏覽器使用body position:fixed 造成螢幕最下方會有黑色遮住交易單
function bodyPreventDefault(){
    var _self = this;
    var ts = new Object;
    //🌖538.ios-safari&uc-報表-在細單層滑動時, 點開右側在滑動左邊區空, 上方標題列不應該被滑動(PJP-553)
    // 多3px 誤差 讓左右還可以滑動
    var fixY = 10;
    var bet_content = document.getElementById("body_show");


    var top_menu = document.getElementById("top_menu_show");
    var main_menu = document.getElementById("dashboard_main");
    var bottom_menu = document.getElementById("bottom_menu_show");

    _self.init = function(){

        // document.body.addEventListener("touchstart",_self.bodyScroll);
        // document.body.addEventListener("touchmove",_self.bodyScroll);

        _self.blockMovedownRefresh(window, document, "prev_scroll_lock");
    }

    // _self.remove=function(){
    //     document.body.removeEventListener("touchstart",_self.bodyScroll);
    //     document.body.removeEventListener("touchmove",_self.bodyScroll);
    // }


    // _self.bodyScroll = function (e){
    //     _self.listenEvent(e,document.getElementById(e.target.id));
    // }

    // _self.touchObject = function(targetObject, eventObject){
    //     try{
    //         // 取得當下指定物件以下的所有物件
    //         var allobj = targetObject.getElementsByTagName("*");
    //         // 最底層的物件（只有他自己）
    //         if (allobj.length==0) return true;
    //         for (var i=0;i<allobj.length;i++){
    //             if (allobj[i]==eventObject){
    //                 return true;
    //             }
    //         }
    //     }catch(e){
    //         return false;
    //     }

    //     return true;
    // }

    // _self.listenEvent = function (e,targetObject){
    //     var touch=e.targetTouches[0];
    //     if (e.type=="touchstart"){
    //         ts.x=touch.pageX;
    //         ts.y=touch.pageY;
    //     }

    //     //例外的物件（必須執行的指定物件）之外的物件
    //     if (!_self.touchObject(targetObject,e.target)){
    //         // e.target.id = "" 代表物件移轉到body身上
    //         if(e.target.id!="") _self.stopBodyDefaultEvent(e);
    //     }else{
    //         // 捲到捲到指定物件頁首
    //         if (targetObject.scrollTop==0){
    //             if (ts.y-touch.pageY<0){
    //                 if (e.type=="touchmove"){
    //                     _self.stopBodyDefaultEvent(e);
    //                 }
    //             }
    //         }

    //         // 捲到指定物件的頁尾
    //         if ((targetObject.scrollTop+targetObject.clientHeight)==targetObject.scrollHeight){
    //             if (ts.y-touch.pageY>0){
    //                 if (e.type=="touchmove"){
    //                     _self.stopBodyDefaultEvent(e);
    //                 }
    //             }
    //         }
    //     }
    // }

    // _self.stopBodyDefaultEvent = function(e){
    //     // if(top.username=="pp") alert("stopBodyDefaultEvent");
    //     e.preventDefault();
    //     e.stopPropagation();
    // }

    //========= block move down refresh =========

    _self.blockMovedownRefresh = function (wd, doc, lock_tag) {

        var isWindowTop = false;
        var isWindowBottom = false;
        var startTouchY = 0;

        //roland
        var isTopMove = false;
        var isBottomMove = false;

        var touchStartHandler = function(e) {
            if (e.touches.length !== 1) return;
            startTouchY = e.touches[0].clientY;

            // isWindowTop = (wd.pageYOffset <= 10);
            // console.log("event:"+e.target.id);
            var scrollObj = getScrollObj(e);
            // console.log(scrollObj);
            if(scrollObj==null) return;

            // isWindowTop = (scrollObj.scrollTop <= 0);
            var urlHeight=document.body.scrollTop;

            // var urlHeightBody = document.body.scrollHeight - document.body.clientHeight;
            // if(urlHeight > urlHeightBody) urlHeight = urlHeightBody;

            isWindowTop = (scrollObj.scrollTop+urlHeight <= 0);
            isWindowBottom = (scrollObj.scrollTop + scrollObj.clientHeight >= scrollObj.scrollHeight);
            isWindowBottom = isWindowBottom && (!getBottomIgnoreObj(e)); //特定物件 需要使用x軸向不跑該邏輯 EX報表

            writeLog("urlHeight:"+urlHeight+" scrollTop:"+scrollObj.scrollTop+" clientHeight:"+scrollObj.clientHeight+" scrollHeight:"+scrollObj.scrollHeight);
            writeLog("scrollObj.id = "+scrollObj.id+"  "+"isWindowTop = "+isWindowTop+" isWindowBottom = "+isWindowBottom);
        };

        var getScrollObj = function(e){
            var obj = e.target;
            return checkParentNode(obj);
        }

        var checkParentNode = function(obj){
            //writeLog("[checkParentNode] id:"+obj.id+" name:"+obj.name+" className:"+obj.className);
            if (obj.getAttribute && obj.getAttribute("name") == lock_tag){
                return obj;
            } else if (obj["prev_scroll_lock"] == true){
                return obj;
            } else if (obj.classList && obj.classList.contains("re_detail_scroll")) {
                return obj;
            }else{
                obj = getParentNode(obj);
                //writeLog("[getParentNode]"+obj.id);
                if(obj==null) return null;
                return checkParentNode(obj);
            }
        }

        var getBottomIgnoreObj = function (e) {
            var obj = e.target;
            return checkParentBottomIgnore(obj);
        }

        var checkParentBottomIgnore = function (obj) {
            writeLog("[checkParentNode]"+obj.id);
            if (obj.prevScrollBottomIgnore) {
                return true;
            } else {
                obj = getParentNode(obj);
                //writeLog("[getParentNode]"+obj.id);
                if (obj == null) return false;
                return checkParentBottomIgnore(obj);
            }
        }

        var getParentNode = function(_node){
            return _node.parentNode;
        }

        var touchMoveHandler = function(e) {
            var nowTouchY = e.touches[0].clientY;

            writeLog("[touch move]isWindowTop="+isWindowTop+" isWindowBottom="+isWindowBottom+", "+startTouchY+" >< "+nowTouchY+" -+ "+fixY);
            if (isWindowTop) {
                if( startTouchY < nowTouchY - fixY){  //往下
                    writeLog("[touch move]block down");
                    e.preventDefault();
                    _self.androidBlock(true);
                    return false;
                }
            }
            if (isWindowBottom) {
                if (startTouchY > nowTouchY + fixY) {
                    writeLog("[touch move]block up");
                    e.preventDefault();
                    _self.androidBlock(true);
                    return false;
                }
            }
            /*
            writeLog("[window.screen.height]  "+window.screen.height);
            writeLog("[document.body.clientHeight]  "+document.body.clientHeight);

            writeLog("[top_menu][offsetTop]  "+top_menu.offsetTop);
            writeLog("[top_menu][offsetHeight]  "+top_menu.offsetHeight);

            writeLog("[main_menu][offsetTop]  "+main_menu.offsetTop);
            writeLog("[main_menu][offsetHeight]  "+main_menu.offsetHeight);

            writeLog("[bottom_menu][offsetTop]  "+bottom_menu.offsetTop);
            writeLog("[bottom_menu][offsetHeight]  "+bottom_menu.offsetHeight);

            if ( top_menu.offsetTop < 0 ) {
                writeLog("[touch move][offsetTop]block down");
                e.preventDefault();
                _self.androidBlock(true);
                return false;
            }
            if (top_menu.offsetTop+top_menu.offsetHeight > document.body.clientHeight) {
                writeLog("[touch move][offsetTop]block up");
                e.preventDefault();
                _self.androidBlock(true);
                return false;
            }
            if (bottom_menu.offsetTop+bottom_menu.offsetHeight > document.body.clientHeight) {
                writeLog("[touch move][offsetTop]block up");
                e.preventDefault();
                _self.androidBlock(true);
                return false;
            }
            */
        };

        var in_array = function(txt, ary){
            for(var i=0; i<ary.length; i++){
                if(ary[i]==txt)  return true;
            }
            return false;
        }


        var touchEndHandler = function(e) {
            _self.androidBlock(false);
        }

        doc.body.addEventListener('touchstart', touchStartHandler, false);
        doc.body.addEventListener('touchmove', touchMoveHandler, {passive: false});
        doc.body.addEventListener('touchend', touchEndHandler, false);

    }

    _self.androidBlock=function(isBlock){
        var sty = document.body.getAttribute("style") || "";
        sty = sty.replace(/touch-action:none;/gi,"");
        var blk = (isBlock)? "touch-action:none;" : "";
        document.body.setAttribute("style", sty+blk);
    }

    function writeLog(msg){
        if(top.username=="roland"){
            //console.log(msg);
            return "";
            var _url = document.location.protocol+"//"+document.domain + "/lib/write_log.php";
            var param = "";
            param+="user="+top.username;
            param+="&msg="+encodeURIComponent(msg);
            //param+="&msg="+msg;

            var hr = new HttpRequest();
            hr.addEventListener("LoadComplete", function(){});
            hr.loadURL(_url,"POST",param);
        }
    }

    //========= block move down refresh =========

}


function Timer(_frequency, _count){
	var _self = this;
	var parentClass;
	
	var frequency = _frequency;	//frequency(ms)
	var init_count = _count;
	var count;
	var timerObj;
	var eventArr = new Array();
	var running = false;
	var isClear = false; //clear timer
	var dont_clear = false; // 
	var tmpTimer;
	
	//-------------------init-------------------------
	_self.init=function(){
		if(frequency==undefined){
			//alert("init error!!");
			return;
		}
		_self.addEventListener("TimerEvent.TIMER", _self.TIMER);
		_self.addEventListener("TimerEvent.TIMER_COMPLETE", _self.TIMER_COMPLETE);
	} 
	
	_self.setParentclass=function(_parentClass){
		parentClass = _parentClass;
  	}
 
  	_self.getThis=function(varible){
		return eval(varible);
  	}
  	
  	_self.setPrivate=function(varible,val){
      	eval(varible+"='"+val+"'");
    }
   	//-------------------init-------------------------
   	
   	
   	//add EventListener
	_self.addEventListener=function(funName, eventHandler){
		eventArr[funName] = eventHandler;
	}
	
	//remove EventListener
	_self.removeEventListener=function(funName){
		eventArr[funName] = null;
	}
	
	//start timer
	_self.startTimer=function(){
		if(!running){
			running=true;
			count = init_count;
			tmpTimer = setTimeout(_self.run, frequency);
		}
	}
	
	//stop timer
	_self.stopTimer=function(){
		if(running){
			clearTimeout(timerObj);
			clearTimeout(tmpTimer);
			running=false;
		}
	}		
	
	
	//run
	_self.run=function(){
		//console.log(count);
		//alert(count);
		if(isClear) return;
		
		if(count!=null) count--;
		
		if(count>0||count==null){
				eventArr["TimerEvent.TIMER"](count);
				timerObj = setTimeout(_self.run, frequency);
		}else{
				eventArr["TimerEvent.TIMER_COMPLETE"](count);
				_self.stopTimer();
		}  
	}
	
	
	_self.isRunning=function(){
		return running;
	}
	
	
	//run event
	_self.TIMER=function(){
		alert("run");
	}
	
	//finish event
	_self.TIMER_COMPLETE=function(){
		alert("finish");
	}
	
	
	_self.clearObj=function(){
		isClear = true;
		_self.stopTimer();
		_self.removeEventListener("TimerEvent.TIMER");
		_self.removeEventListener("TimerEvent.TIMER_COMPLETE");
		timerObj = null;
		frequency = 0;
		count = 0;
	}
  
  	_self.init();
}

function CookieManager(){
	var _self = this;
	var _domain = document.domain.split(".");
	var MainDomain = "";
	if(_domain.length!=4){
		MainDomain = "domain=.";
		for(var i=1; i < _domain.length; i++){
			if(i == _domain.length-1){
				MainDomain += _domain[i];
			}else{
				MainDomain += _domain[i]+".";
			}
		}
	}else{
		MainDomain = document.domain;
	}

	_self.set = function(cname, cvalue, exdays , path){
			exdays = exdays || 30;
			path = path || "/";

			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+d.toUTCString();
			var paths = "path="+path;

			document.cookie = cname + "=" + cvalue + "; " + expires+"; "+paths+"; "+MainDomain;
			//console.log(cname + "=" + cvalue + "; " + expires+"; "+paths+"; "+MainDomain);
	}

	_self.get = function(cname){
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
			}

			return undefined;
    }

    _self.del = function(cname){
			var d = new Date();
			d.setTime(d.getTime() - 1);
			var cookieVal = _self.get(cname);
			if(cookieVal != null) document.cookie= cname + "="+cookieVal+";expires="+d.toGMTString()+"; "+MainDomain;
    }

}
function parseHTML(html){
	var _self=this;

	var divObj=document.createElement("div");

	divObj.innerHTML="<body>"+html+"</body>";
	//divObj.innerHTML = html;

	_self.getTag=function(tagID,divobj){

		if (divobj==undefined) divobj=divObj;
		var retobj=new Array();
		var children = divobj.getElementsByTagName("*");
		for (var i = 0; i < children.length;i++){
			if (children[i].tagName.toUpperCase()==tagID.toUpperCase()){
				retobj.push(children[i]);
			}
		}
		return retobj;

		}
	_self.getChildren=function(){
		return divobj.getElementsByTagName("*");
	}

 	_self.getObj=function(tagID,divobj){
 		if (divobj==undefined) divobj=divObj;
        var obj=null;
        try{
			obj = divobj.getElementsByTagName("*")[tagID];
        }catch(e){
            obj=null;
        }

        return obj;
    }

     _self.remove=function(){
	   	//自己實作移除每一個div下面的物件
	   	//實作完丟一份回來給我
	   	divObj=null;

   	}
    _self.removeMC=function(){}
 }
function HttpRequest(){
		var self=this;
		var req;
		var eventHandler=new Array();
		var parentClass;
		
		self.init=function(){
				self.addEventListener("LoadComplete",self.cmd_proc);
				//self.removeEventListener("LoadComplete");
				//alert("onload");
				}
		self.help=function(){
				var str="";
				str+="EventName:LoadComplete Method:function(html)\n";
				str+="Method:loadURL(url,post/get,pamam)\n";
				return str;
		}
		
		self.setParentclass=function(parentclass){
				parentClass=parentclass;
				//util=parentClass.util;
		}
		
		self.getThis=function(varible){
				return eval(varible);
		}
	
		self.test=function(){
				alert("test");	
		}

		
		self.loadURL=function(url,method,params) {
				req = false;
		    // branch for native XMLHttpRequest object
		   
		    if(window.XMLHttpRequest && !(window.ActiveXObject)) {
			    	try{
								req = new XMLHttpRequest();
			      }catch(e){
								req = false;
			      }
			    // branch for IE/Windows ActiveX version
		    }else if(window.ActiveXObject){
		       	try{
		        		req = new ActiveXObject("Msxml2.XMLHTTP");
		      	}catch(e){
			        	try{
			          		req = new ActiveXObject("Microsoft.XMLHTTP");
			        	}catch(e){
			          		req = false;
			        	}
						}
		    }
		    
		 
				if(req){
				
						req.onreadystatechange = self.processReqChange;
						if(method==undefined) method="POST";
						if(method.toUpperCase()=="POST"){
								req.open("POST", url, true);
								  //req.setRequestHeader("Content-Type","text/xml;charset=utf8");
								// xmlHttp.setRequestHeader("Content-Type","text/xml;charset="+charset);
								// params = "lorem=ipsum&name=binny";
					  		req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
								//php:·í½s½X¤£¬°utf-8®É­n¥[¦bphp  header('Content-Type:text/html;charset=big5');
								//	req.setRequestHeader("Content-length", params.length);
								//	if (params!="" && params!=undefined)
								req.send(params);
				
						}else{
								req.open("GET", url+"?"+params, true);
								req.send("");
						}
				}
		}
		
		self.processReqChange=function() {
				// only if req shows "loaded"
		 		//   alert(req.status);
		    if(req.readyState == 4){
		        // only if "OK"
		        //alert("req.status="+req.status);
		        if(req.status == 200){
		            // ...processing statements go here...
		            //self.cmd_proc(req.responseText);
		          	self.eventhandler("LoadComplete",req.responseText);
		            //self.eventhandler("LoadComplete",req.responseXML);
		            
		        }else{
		            //alert("There was a problem retrieving the XML data:\n" +req.statusText);	
		            self.eventhandler("onError",req.responseText);
		        }
		    }
		}
		
		self.addEventListener=function(eventname,eventFunction){
				eventHandler[eventname]=eventFunction;
		}
		
		self.removeEventListener=function(eventname){
				EventHandler[eventname]=undefined;
		}
		
		self.eventhandler=function(eventname,param){
				if(eventHandler[eventname]!=undefined){
						eventHandler[eventname](param);
				}
		}
		
		self.cmd_proc=function(html){
				alert(html);
				//return html;
		}
		

		//self.addEventLisition("LoadComplete",self.cmd_proc);
		self.init();
}

function util(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;

    _self.init = function () {

    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }
    
    _self.addEvent = function (targetObj, eventName, fun, parObj, clean_old_sw) {
        if (typeof clean_old_sw == 'undefined'){
            clean_old_sw = true ;
        }
        try {
            var retFun = function (e) {
                fun(e, parObj);
            }
            if (targetObj.eventName == null){
                targetObj.eventName = new Array();
            }else{
                if (clean_old_sw){ //需不需要將原本的事件移除
                    _self.removeEvent(targetObj, eventName);
                }
            }
            targetObj.eventName[eventName] = retFun;
            targetObj.addEventListener(eventName, retFun, false);
            // targetObj.addEventListener(eventName, function(e){
            //     fun(e, parObj);
            // },false);

        } catch (ex) {
            // console.error(ex.toString());
            try {
                targetObj.attachEvent("on" + eventName, retFun);
                if (targetObj.eventName == null) targetObj.eventName = new Array();
                targetObj.eventName[eventName] = retFun;

                // targetObj.attachEvent("on"+eventName, function(e){
                //     fun(e, parObj);
                // });
            } catch (exx) {
                // console.error(exx.toString());
            }
        }
    }

    _self.removeEvent = function (targetObj, eventName) {
        if (targetObj.eventName == null) return;
        //console.log(eventName + ":" + targetObj.eventName[eventName]);
        try {
            targetObj.removeEventListener(eventName, targetObj.eventName[eventName]);
        } catch (ex) {
            //console.error(ex.toString());
            try {
                targetObj.detachEvent("on" + eventName, targetObj.eventName[eventName]);
            } catch (exx) {
                //console.error(exx.toString());
            }
        }
    }

    _self.mergeArray = function () {

        var newArray = new Object();

        for (i = 0; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                newArray[key] = arguments[i][key];
            }
        }
        return newArray;
    }

    _self.getProtocal = function () {
        return dom.location.protocol;
    }

    _self.getWebDomain = function () {
        return dom.domain;
    }

    _self.getWebUrl = function () {
        return _self.getProtocal() + "//" + _self.getWebDomain();
    }

    _self.goToIndex = function () {
        _self.topGoToUrl(_self.getWebUrl());
    }

    _self.topGoToUrl = function (_url, par) {
        var tmpForm = document.createElement("form");
        tmpForm.action = _url;
        tmpForm.method = "POST";
        tmpForm.target = "_top";

        if(par){
            for(var keys in par){
                var inp = document.createElement("input");
                inp.type = "hidden";
                inp.name = keys;
                inp.value = par[keys];
                tmpForm.appendChild(inp);
            }
        }
        document.body.appendChild(tmpForm);
        tmpForm.submit();
        // top.location.href = _url;
    }

    _self.chkErrorMsg = function (errHash, LS_code) {
        if (errHash["status"]!= null && errHash["status"] == "error") {
            if (errHash["code"]!=null && errHash["code"] == "4X014") {
                if(!top.doubleLogin){
                    top.doubleLogin = true;
                    alert(LS_code.get(errHash["code"]));
                }
                _self.goToIndex();
                return true;
            } else if (errHash["code"] != null && (errHash["code"].indexOf("clean_db")!=-1 || errHash["code"].indexOf("m_rep")!=-1 )){
                if (errHash["msg"]) _self.showErrorMsg(errHash["msg"]);
                parentClass.dispatchEvent("showLoading", { "showLoading": false });
                return true;
            }

        }
        return false;
    }

    //need to trans page
    _self.checkErrorCode = function (code, LS) {
        if (code == "doubleLogin") {  //check uid
            alert(LS.get(code));
            _self.goToIndex();
            return false;
        }

        if (code == "goToHome") {
            _self.goToIndex();
            return false;
        }
        return true;

    }

    //onblur
    _self.initOnBlurDiv = function (showObj, clickObj, clickFun, clickParam) {
        clickObj.tabIndex = 100;

        var param = new Object();
        param.showObj = showObj;
        param.clickObj = clickObj;
        param.clickFun = clickFun;
        param.clickParam = clickParam;
        _self.addEvent(clickObj, "blur", _self.onBlurEvent, param);
    }

    _self.onBlurEvent = function (e, param) {
        //_self.echo("on blur");
        //param.showObj.style.display = 'none';
        //_self.removeEvent(param.clickObj, "click");
	//_self.echo(param.clickObj);
	if(param.clickParam && param.clickParam.className) _self.classFunc(param.clickObj,param.clickParam.className,"remove");

        //setTimeout(_self.addEvent, 500, param.clickObj, "click", param.clickFun, param.clickParam);
    }

    //隱藏顯示提示窗
    _self.setInfEvent = function (icon,param) {
        //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
        // param.info_mode = true; //點內容要消失的模式
        param.info_mode != false ? param.info_mode = true : param.info_mode = false; //點內容要消失的模式
        param._focus.prev_scroll_lock = true;
        _self.addEvent(icon, "click", _self.showInfEvent, { "icon": icon, "param": param});
    }

    _self.showInfEvent = function (e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i] == e.target) {
                return false;
            }
        }
        if (e.target == param._focus) return false;

        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
            if (param.info_mode) _self.removeEvent(param._focus, "click");
            _self.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
            _self.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");
        } else {
            param._setView.classList.add(param._viewClass);
            if (param.info_mode) _self.addEvent(param._focus, "click", _self.closeInfElmt, param);
            _self.addEvent(dom.getElementsByTagName("div")[0], "mousedown", _self.InfBlurEvent, _par);
            _self.addEvent(dom.getElementsByTagName("div")[0], "touchstart", _self.InfBlurEvent, _par);
            param._focus.scrollTop= 0;
        }
    }

    _self.InfBlurEvent = function (e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
        var mouseIN = false;
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if(all[i] == e.target){
                mouseIN = true;
            }
        }
        if (param._focus == e.target) mouseIN = true;

        if (!mouseIN){
            var all = icon.getElementsByTagName("*");
            for (var i = 0, max = all.length; i < max; i++) {
                if (all[i] == e.target) {
                    return false;
                }
            }
            if (e.target == icon) return false;

            _self.closeInfElmt(null,param);

        }
    }

    _self.closeInfElmt = function (e,param) {
        dom.activeElement.blur();
        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
        }

        _self.removeEvent(param._focus, "click");
        _self.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
        _self.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");
    }
    //隱藏顯示提示窗

    _self.clone = function (obj) {
        //Handle the 3 simple types, and null or undefined
        if (null == obj || typeof obj != "object") return obj;

        //Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());

            return copy;
        }

        //Handle Array
        if (obj instanceof Array) {
            var copy = [];

            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = _self.clone(obj[i]);
            }

            return copy;
        }

        //Handle Object
        if (obj instanceof Object) {
            var copy = {};

            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = _self.clone(obj[attr]);
            }

            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    _self.showErrorMsg = function (msg) {
        // alert(msg);
        _self.showMsg(msg, "N", null);
    }

    _self.showMsg = function (msg, _confirm, retFun) {
        parentClass.dispatchEvent("showAlertMsg", { "confirm": _confirm, "msg": msg, "retFun": retFun });
    }

    _self.showTxt = function (msg) {
        if(msg+""=="undefined" || msg+""=="null" || msg+""=="NaN")  return "";
        return msg;
        //return (!msg && msg!=0) ? "" : msg;
    }

    _self.echo = function (msg) {
        //win.console.trace(msg);
        //win.console.log(msg);
    }

    _self.err = function (title, e) {
        _self.echo(title+"\n"+e.stack);
        win.console.error(title, e.stack);
    }

    _self.formatThousand = function (num) {
        num = num + "";
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) {
            num = num.replace(re, '\$1,\$2');
        }
        return num;
    }

    _self.mprintf = function (vals, fronts, points, comma, thousand) {
        var out = _self.printf(vals, fronts, points, comma);
        if (thousand) out = _self.formatThousand(out);
        return out;
    }

    _self.printf = function (vals, fronts, points, comma) {
        vals = "" + vals;
        var cmd = new Array();
        cmd = vals.split(".");
        if (cmd.length > 1) { //cut the unnecessary points
            if (cmd[1].length > points) {
                if (points != 0) {
                    tmp = Math.pow(10, points * 1);
                    vals = Math.round(vals * tmp + 0.0001) / tmp;
                    vals = "" + vals;
                    cmd = vals.split(".");
                } else {
                    cmd = new Array(cmd[0]);
                    vals = cmd[0];
                }
            }
        }
        //integer+0
        for (ii = 0; ii < (fronts - cmd[0].length); ii++) {
            vals = "0" + vals;
        }

        //add comma
        if (comma) {
            valarr = vals.split(".");
            tmpval = valarr[0];
            for (ii = valarr[0].length; ii > 3; ii -= 3) {
                comma_index = ii - 3;
                strA = tmpval.substring(0, comma_index);
                strB = tmpval.substring(comma_index);
                tmpval = strA + "," + strB;
            }
            if (valarr.length > 1) {
                tmpval += "." + valarr[1];
            }
            vals = tmpval;
        }

        //point+0
        if (points > 0) {
            if (cmd.length > 1) { //has point
                for (ii = 0; ii < (points - cmd[1].length); ii++) {
                    vals = vals + "0";
                }
            } else { //no point
                vals = vals + ".";
                for (ii = 0; ii < points; ii++) {
                    vals = vals + "0";
                }
            }
        }
        return vals;
    }

    _self.getObjAry = function (tmpScreen, aryStr, attribute, isOnly) {
        var newAry = new Array();
        var _attribute = attribute;

        if (tmpScreen != null & aryStr != null) {

            if (_attribute == null) _attribute = "id";
            newAry = _self.getChildAry(tmpScreen.getElementsByTagName("*"), aryStr, newAry, _attribute, isOnly);

        }
        return newAry;
    }

    _self.getChildAry = function (objAry, aryStr, newAry, attribute, isOnly) {

        for (var i = 0; i < objAry.length; i++) {
            var obj = objAry[i];
            var _id = obj.getAttribute(attribute);

            if (_id != null) {
                if (aryStr.indexOf("," + _id + ",") != -1) {
                    if (attribute == "id") {
                        newAry[_id] = obj;
                    } else {
                        newAry.push(obj);
                    }
                    if (isOnly) return newAry;
                }
            }

            // if (obj.children.length > 0) {
            //     _self.getChildAry(obj.children, aryStr, newAry, attribute, isOnly);

            // }

        }
        return newAry;
    }

    //get span
    _self.getSpan = function (divObj, spanid) {
        return _self.getObj(divObj, spanid);
    }


    //get obj
    _self.getObj = function (divObj, tagID) {
        var obj = null;
        try {
            obj = divObj.children[tagID];
        } catch (e) {
            obj = null;
        }
        return obj;
    }

    _self.setObjectClass = function (targetObj, classStr) {
        if (targetObj.className != undefined) {
            targetObj.className = classStr;
        } else {
            targetObj.setAttribute("class", classStr);
        }
    }

    _self.getObjAbsolute_new = function (obj, stop_name) {
        var abs = new Object();

        abs["left"] = obj.offsetLeft;
        abs["top"] = obj.offsetTop;

        while (obj = obj.offsetParent) {
            ////console.log(obj);
            ////console.log(obj.offsetLeft+" >> "+obj.offsetTop);
            if (_self.getStyle(obj, "position") == "relative") {
                ////console.log(obj.id+"|"+obj.offsetParent.id+"|"+_self.getStyle(obj,"top")+"|"+_self.getStyle(obj,"margin-top")+"|"+obj.offsetTop);
                if ((obj.id != "" && obj.offsetParent.id != "") && _self.getStyle(obj, "top") != "auto" && _self.getStyle(obj, "margin-top") != "auto" && _self.getStyle(obj, "margin-top") != "0px") {
                    abs["top"] += -obj.offsetTop;
                    continue;
                }
            }

            if (stop_name != undefined && obj.id == stop_name) {
                break;
            } else if (_self.getStyle(obj, "position") == "absolute") {
                break;
            }

            abs["left"] += obj.offsetLeft;
            abs["top"] += obj.offsetTop;
        }

        return abs;
    }

    _self.getStyle = function (oElm, strCssRule) {
        var strValue = "";
        if (document.defaultView && document.defaultView.getComputedStyle) {
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        } else if (oElm.currentStyle) {
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
            strValue = oElm.currentStyle[strCssRule];
        } else {
            return "error";
        }
        return strValue;
    }

    //return true/false
    _self.checkFormat = function (msg, type) {
        var ret = null;
        var _msg = msg + "";
        switch (type) {
            case 0:
                ret = _msg.match("^[a-zA-Z0-9]*$");
                break;
            case 1:
                ret = _msg.match("^[0-9]*$");
                break;
            case 2://密碼專用
                ret = _msg.match("^[a-zA-Z0-9]*$");
                if (ret) {
                    if (_msg.match("^[a-zA-Z]*$") || _msg.match("^[0-9]*$")) {
                        ret = false;
                    }
                    if (_msg.length < 6 || _msg.length > 12) ret = false;
                }
                break;
            default:
                ret = _msg.match("^[a-zA-Z0-9]*$");
                break;
        }
        return (ret) ? true : false;
    }

    _self.getKeyCode = function (e) {
        return (win.event) ? win.event.keyCode : e.which;
    }

    _self.prevDefault = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    //============== check username keyBoard==============
    _self.ChkKeyUser = function (target, FunParam) {
        //FunParam{onErr:funOnErr(), param:param}
        if (_self.isAndroid()) {
            _self.addEvent(target, "input", _self.ChkInpKeyUser, FunParam);
        }else{
            _self.addEvent(target, "keypress", _self.ChkBoardKeyUser, FunParam);
        }
    }

    _self.ChkBoardKeyUser = function (e, FunParam) {
        //FunParam{onErr:funOnErr(), initShow:initShow(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow) FunParam.initShow(e, _par);
        }
        var keyCode = _self.getKeyCode(e);
        if (keyCode == 13) _self.prevDefault(e);
        else if (keyCode == 8) { }
        else if ((keyCode < 48 || keyCode > 57) && (keyCode > 95 || keyCode < 106) && !((keyCode > 64 && keyCode < 91) || (keyCode > 96 && keyCode < 123))) {
            _self.prevDefault(e);
            if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
        }
    }

    _self.ChkInpKeyUser = function (e, FunParam) {
        //FunParam{onErr:funOnErr(), initShow:initShow(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow) FunParam.initShow(e, _par);
        }
        var inCode = e.data;
        if (inCode != null) {
            if (inCode.match(/[^a-zA-Z0-9]/)) {
                var St = e.target;
                var position = _self.getCaretPosition(St) - inCode.length;
                var result = St.value.split('');
                result.splice(position, inCode.length);
                St.value = result.join('');
                _self.setSelectionRange(e.target, position, position);
                if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
            }
        }
    }

    //============== check Credit keyBoard==============
    _self.ChkKeyCash = function (target, FunParam) {
        //FunParam{initShow:initShow(), onErr:funOnErr(), onSuc:funOnSuc(), param:param}
        if (_self.isAndroid() || _self.isiPhone() ) {
            _self.addEvent(target, "input", _self.ChkInpKeyCash, FunParam);
        } else {
            _self.addEvent(target, "keydown", _self.ChkPasteKeyCash, FunParam);
            _self.addEvent(target, "keypress", _self.ChkBoardKeyCash, FunParam);
            _self.addEvent(target, "keyup", _self.doSucKeyCash, FunParam);
        }
    }
    _self.ChkPasteKeyCash = function (e, FunParam) {
        // 內容是用貼上的 要觸發過濾輸入的數字
        if ((e.ctrlKey || e.metaKey) && e.key === "v") {
            if (FunParam != null) FunParam.isCHK = true;
        }
    }

    _self.ChkBoardKeyCash = function (e, FunParam) {

        //FunParam{initShow:initShow(), onErr:funOnErr(), onSuc:funOnSuc(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null){
            if (FunParam.initShow) FunParam.initShow(e, _par);
            FunParam.isCHK = false;
        }

        var keyCode = _self.getKeyCode(e);
        if (keyCode == 13){
            _self.prevDefault(e);
            return false;
        }
        else if ((keyCode >= 48 && keyCode <= 57) || keyCode == 8) { }
        else if (keyCode < 96 || keyCode > 105) {
            if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
            _self.prevDefault(e);
            return false;
        } else if (e.code || e.key) {
            var charCode = e.code || e.key;
            charCode = charCode.replace(/\D/g, '');
            if (charCode == '') {
                if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
                _self.prevDefault(e);
                return false;
            }
        }
        if (FunParam != null) FunParam.isCHK = true;
    }
    _self.doSucKeyCash = function (e, FunParam) {
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null && FunParam.onSuc && FunParam.isCHK) FunParam.onSuc(e, _par);
    }

    _self.ChkInpKeyCash = function (e, FunParam) {

        //FunParam{initShow:initShow(), onErr:funOnErr(), onSuc:funOnSuc(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow) FunParam.initShow(e, _par);
            FunParam.isCHK = false;
        }

        var inCode = e.data;
        if (inCode != null) {
            if (inCode.match(/[^0-9]/)) {
                if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
                var St = e.target;
                var position = _self.getCaretPosition(St) - inCode.length;
                var result = St.value.split('');
                result.splice(position, inCode.length);
                St.value = result.join('');
                _self.setSelectionRange(e.target, position, position);
                return false;
            }
        }
        if (FunParam != null) FunParam.isCHK = true;
        if (FunParam != null && FunParam.onSuc) FunParam.onSuc(e, _par);
    }

    //信用額度轉換千位顯示
    _self.Replace_credits = function (targetObj, credit_old, e) {
        var keyCode = _self.getKeyCode(e);
        var position = _self.getCaretPosition(targetObj);
        //var credit = targetObj.value.replace(/\D/g, '');
        // 現金輸入會有小數點 小數點之後直接捨去
        var credit = targetObj.value.replace(/[^\d.]/g, '');
        if (credit != "" && credit == credit * 1) {
            credit = credit * 1;
            var num_length = credit.toString().length;

            if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
                if (credit_old * 1 != credit && num_length % 3 == 1) position++;
                //if (credit_old * 1 == credit && position > 0) position--;
            } else if (keyCode == 8) {
                if (num_length % 3 == 0 && (credit_old * 1 != credit) && position > 0) position--;
            } else if ((keyCode >= 37 && keyCode <= 40) || keyCode == 13){
                return true;
            }
            targetObj.value = _self.mprintf(credit, 0, 0, false, true);
            _self.setSelectionRange(targetObj, position, position);
        } else {
            targetObj.value = "";
        }

    }

    //信用額度轉換千位顯示
    _self.Replace_Input_credits = function (targetObj, credit_old, e) {
        var inCode = e.data;
        var position = _self.getCaretPosition(targetObj);
        // var credit = targetObj.value.replace(/\D/g, '');
        // 現金輸入會有小數點 小數點之後直接捨去
        var credit = targetObj.value.replace(/[^\d.]/g, '');
        if (credit != "" && credit == credit * 1) {
            credit = credit * 1;
            var num_length = credit.toString().length;

            if (inCode != null) {
                if (num_length % 3 == 1 && inCode.match(/\d/)){
                    position += inCode.length;
                }
                if (inCode.match(/\D/)){
                    position -= inCode.length;
                }
                //console.log(inCode.length);
            } else {
                if (num_length % 3 == 0 && (credit_old * 1 != credit) && position > 0) position--;
            }
            //console.log(position);
            targetObj.value = _self.mprintf(credit, 0, 0, false, true);
            _self.setSelectionRange(targetObj, position, position)
        }else{
            targetObj.value = "";
        }

    }

    _self.getCaretPosition = function (oField) {
        var iCaretPos = 0;

        // IE Support
        if (document.selection) {
            oField.focus();
            var oSel = document.selection.createRange(); // To get cursor position, get empty selection range
            oSel.moveStart("character", 0 - oField.value.length); // Move selection start to 0th position
            iCaretPos = oSel.text.length; // The caret position is selection length
        }
        // Firefox Chrome support
        else if (oField.selectionStart || oField.selectionStart == "0") {
            iCaretPos = oField.selectionStart;
        }

        return (iCaretPos);
    }



    _self.setSelectionRange = function (input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionStart);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }

    //增加 / 刪除 className
    // ex: 刪除 util.classFunc(dom.getElementById("right_show"), ["w200px","w360px","w100per"], "remove");
    // ex: 新增 util.classFunc(dom.getElementById("right_show"), ["w100per","ma_extend"]);
    _self.classFunc = function (dom, c, a) {
        //dom指定的元素
        //c 可以是字串或是陣列
        //a=remove 剔除
        a = a || "";
        if (!Array.isArray) {
            Array.isArray = function (arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
        if (!(typeof c == "string") && !Array.isArray(c)) return;
        var o = dom.className.split(" ");
        if (!Array.isArray(c)) c = c.split(" ");

        Array.prototype.push.apply(o, c);
        o = _self.unique(o);
        if (a == "remove") {
            var z = JSON.parse(JSON.stringify(c));
            for (var i = 0, len = z.length; i < len; i++) {
                var ind = o.indexOf(z[i]);
                if (ind != -1) o.splice(ind, 1);
            }
        }
        dom.className = o.join(" ");
    }
    //陣列使用 剔除相同元素
    _self.unique = function (array) {
        var r = [];
        for (var i = 0, l = array.length; i < l; i++) {
            for (var j = i + 1; j < l; j++)
                if (array[i] === array[j]) j = ++i;
            r.push(array[i]);
        }
        return r;
    }

    _self.isIE = function () {
        if (win.navigator.userAgent.toUpperCase().indexOf("MSIE") != -1) {
            return true;
        }
        return false;
    }

    _self.isAndroid = function () {
        if (win.navigator.userAgent.toUpperCase().indexOf("ANDROID") != -1) {
            return true;
        }
        return false;
    }

    _self.isiPhone = function () {
        if (win.navigator.userAgent.toUpperCase().indexOf("IPHONE") != -1) {
            return true;
        }
        return false;
    }

    _self.checkScrollToHide=function(e, targetObj){
        //需要有 "返回至頂部按鈕" 的頁面
        var newScrollTop = e.target.scrollTop;
        if(newScrollTop > 0){
            targetObj["backtop"].style.display = "";
        }else if(newScrollTop <= 0){
            targetObj["backtop"].style.display = "none";
        }
    }


    //檢查流程
    //EngNeed 至少需要幾個字母組成
    _self.str_chk=function(str,EngNeed){
        var str_char=0;
        var arr_char = new Array();
        var str_len = str.length;
        for (var i=0; i < str_len;i++){
            var tmp_str = str.substr(i,1);
            if(tmp_str.match(/[aA-zZ]/))str_char++;
            arr_char[tmp_str] = true;
        }
        //低於6個字或是大於12個字
        if(str_len < 6 || str_len > 12 ){
            return "err_length";
        }
        //不是由英數字組成
        if(!str.match(/^[a-zA-Z0-9]*$/)){
            return "err_combination";
        }
        //裡面含有空格或是底線
        if (str.match(/\s/) || str.match(/_/) || str.match(/\^/)){
            return "err_contain";
        }
        //2019-10-25 英文+數字 要有超過2個字元
        if (Object.keys(arr_char).length <=2) {
            return "err_charactersNum";
        }
        //2019-10-25 過於簡易的密碼, 要做阻擋
        var arr_block_string = new Array("abc111","abc222","abc333","abc444","abc555","abc666","abc777","abc888","abc999","abc000","111abc","222abc","333abc","444abc","555abc","666abc","777abc","888abc","999abc","000abc","abc123","123abc","aaa123","123aaa","aaa1234","1234aaa","aa1234","1234aa","aa12345","12345aa","bbb123","123bbb","bbb1234","1234bbb","bb1234","1234bb","bb12345","12345bb","ccc123","123ccc","ccc1234","1234ccc","cc1234","1234cc","cc12345","12345cc","qwe123","123qwe","qwe1234","1234qwe","qwe12345","12345qwe") ;
        if (arr_block_string.indexOf(str.toLowerCase()) >= 0) {
            return "err_block_string";
        }

        //至少要有 EngNeed 個英文字 , 不可全英文或全數字
        if(str_char >= EngNeed && str_len > str_char){
            return "chk_OK";
        }else{
     		return "chk_wrong";
     	}
    }


    _self.in_array=function(txt, ary){
		for(var i=0; i<ary.length; i++){
			if(ary[i]==txt)  return true;
		}
		return false;
    }

    _self.isUCBrowser=function(){
        return (navigator.userAgent.indexOf("UCBrowser")!=-1)?true:false;
    }

    _self.extendsClass=function(parentClass, childClass, _win, _dom, _postHash){
        childClass.prototype=parentClass;
        objClass = new childClass(_win, _dom, _postHash);
        objClass._super = parentClass;
        return objClass;
    }

    _self.checkReportTeach=function(cookie, parentClass){
        // if(cookie.get("view_report_teach")!="Y"){
        //     parentClass.dispatchEvent("viewReportTeach", {"page":"report_teach"});
        // }
    }

    _self.isIE=function(){
        if(window.navigator.userAgent.toUpperCase().indexOf("MSIE")!=-1){
                return true;
        }
        return false;
    }

    //大版面的過濾器
    _self.filterBig = function(_win,_dom){
        var _self = this;
        var win =_win;
        var dom =_dom;
        var util;
        var parentClass;
        var eventHandler = new Object();
        var _param = new Object();
        var _paramTmp = new Object();
        var now_parObj = new Object();
        var LS;
        /*
            config.info_mode = true; //點內容要消失的模式
            config._setView	  整個包起來的div
            config._title   		標題選取顯示
            config.title_mode   標題選取功能開關
            config._focus   下拉選單
            config._viewClass  下拉選單動作 使用active
            config._act  是否啟用過濾選項 true close 目前沒在用
            config._default 預設選項 stake回傳物件 其餘回傳字串
            config._list   在mode_1中要跟可選取的li相等 在mode_2中跟群組相等
            config._listSub  在mode_1中要跟可選取的_list相等 顯示選項文字
            config._dataShowDiv 在dom底下顯示資料
            config._searchOpen 搜尋框框是否開啟
            config._searchItem 搜尋項目的名字
            config._searchDiv  搜尋項目所屬的div
            config._breakpoint 陣列 裡面放入物件 物件有div:dom,amount:數字 多少資料後顯示分組文字 預設[]不顯示
            config._default  在mode_1 回傳 list中的選項 預設ALL
                             在mode_2 回傳 物件{mode:_group中之一,_list:全部數值}
                             在mode_3 回傳 data中的id 多選項的用逗號串起 全選 ALL 全不選 NONE
                             在mode_5 回傳 data中的id 無多選項 預設ALL

            重置單一過濾器可使用 _self.reinit
            主動取得回傳參數    _self.getNowParam
                             _self.autoBackParam
        */


        _Mode  = new Object();
        _Mode["mode_1"]  = new Object();
        _Mode["mode_1"]["_config"]= {   //基本下拉樣式
            "mode":1,
            "info_mode":true,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_contantView":null,
            "_viewClass":"active",
            "_chkClass":"on",
            "_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"],
            "_listSub":["ALL","Soccer","BK","TN","VB","BM","TT","BS","SK","OP","FS"],
            "_act":true,
            "_default":"ALL",
            "_setAllTitleName":""
        } ;

        _Mode["mode_2"]  = new Object();
        _Mode["mode_2"]["_config"]= {   //stake樣式
            "mode":2,
            "info_mode":false,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_contantView":null,
            "_type":null,
            "_viewClass":"active",
            "_group":["ALL,PER"],
            "_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"],//跟者html選項
            "_act":true,
            "_default":{
                "mode":"ALL", 	//跟者_group
                "listGold":{ 	//跟者_list
                    "ALL":0,
                    "FT":0,
                    "BK":0,
                    "TN":0,
                    "VB":0,
                    "BM":0,
                    "TT":0,
                    "BS":0,
                    "SK":0,
                    "OP":0,
                    "FS":0
                },
                "listItem":"" //若使用per 可指定title顯示哪個一選項
            }
        } ;

        _Mode["mode_3"]  = new Object();
        _Mode["mode_3"]["_config"]= {   // downline下現樣式 搜尋 複選筐
            "mode":3,
            "info_mode":true,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_contantView":null,
            "_data":null, //1002: {id: "1002", alias: "stanNew", username: "stanNew"}
            "_viewClass":"active",
            "_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"],
            "_act":true,
            "_default":"ALL",
            "_limitCount":5, //限制check數目 0不限制
            "_limitCountAlertMsg":"", //超過選取項目出現的警告訊息
            "_searchOpen":true,
            "_searchItem":"downlineID",
            "_searchDiv":null,
            "_dataShowDiv":null,
            "_breakpoint":[
                {
                    "div":null,
                    "amount":12
                }
            ],
            "_chkBtnMode":false, //開啟確定取消按鈕模式
            "_chkBtnDiv":        //確定取消案扭 dom 和 是否消失下拉選單
            {
                "SAVE":
                {
                    "div":null,
                    "disappear":true
                },
                "CANCEL":
                {
                    "div":null,
                    "disappear":true
                }

            },
            "_setAllTitleName":"",
            "_setItemTitleName":""
        } ;

        _Mode["mode_4"]  = new Object();
        _Mode["mode_4"]["_config"]= {   // 聯盟樣式 單選 群組 搜尋
            "mode":4,
            "info_mode":false,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_contantView":null,
            "_dataShowDiv":null,
            "_data":null, //4: {id: "4", leaguename: "Test"}
            "_viewClass":"active",
            "_chkClass":"on",
            "_act":true,
            "_default":"ALL",
            "_searchOpen":true,
            "_searchItem":"leagueID",
            "_searchDiv":null,
            "_breakpoint":[
                    {
                        "div":null,
                        "amount":12
                    }
            ],
            "_setAllTitleName":""
        } ;

        _self.addEventListenEvent = function(){
            _self.addEventListener("getNowParam", _self.getNowParam);
            _self.addEventListener("autoBackParam", _self.autoBackParam);
        }
        _self.init = function(parObj){
            for(var key in parObj){
                var chosen_mode =  parObj[key].mode ;
                var mode = _Mode["mode_"+chosen_mode];

                if(mode){
                    var tmpObj = new Object();
                    for(var item in mode["_config"]){
                        if(typeof parObj[key][item] !== 'undefined')tmpObj[item] = parObj[key][item];
                        else tmpObj[item] = mode["_config"][item];
                    }
                    if(tmpObj._act){
                        now_parObj[key] =tmpObj;
                        _param[key] = new Object;
                        if(mode*1==3) _paramTmp[key] = new Object();
                    }
                }else{

                }

            }
            //console.log(now_parObj);
            _self.initDiv(now_parObj);
        }


        _self.setParentclass = function(_parentclass){
            parentClass = _parentclass;
            util = parentClass.getThis("util");
            LS = parentClass.getThis("LS");
            // Cookie = parentClass.getThis("cookie");
            // config_set = parentClass.getThis("config_set");
        }

        _self.reinit = function(parObj){
            var tmpParObj = new Object();
            for(var key in parObj){
                if(typeof now_parObj[key] !== 'undefined'){
                    tmpParObj[key]= new Object();
                    for(var item  in now_parObj[key]){
                        // console.log(typeof parObj[key][item]!=='undefined');
                        if(typeof parObj[key][item]!=='undefined') tmpParObj[key][item] = parObj[key][item];
                        else  tmpParObj[key][item] = now_parObj[key][item];
                    }
                    now_parObj[key] = tmpParObj[key];
                }
            }

            _self.initDiv(tmpParObj);
        }


        _self.returnSet = function(){
            return _set;
        }

        _self.initDiv = function(nowParObj){
            for(var key in nowParObj){
                if(!key || !nowParObj[key]) return;
                var icon = nowParObj[key]["_setDiv"];
                var contant = nowParObj[key]["_contantView"];
                var list = nowParObj[key]["_list"];
                var defaultValue =  nowParObj[key]["_default"];
                var mode = nowParObj[key]["mode"];
                var viewClass = nowParObj[key]["_viewClass"];
                var titleView =  nowParObj[key]["_titleView"];

                if(mode==1){
                    var frag = dom.createDocumentFragment();
                    for(var item in list){
                        var sample = contant.children[0].cloneNode(true);
                        sample.id = key+"_"+list[item];
                        sample.value = list[item];
                        sample.innerHTML = nowParObj[key]["_listSub"][item];
                        frag.appendChild(sample);
                    }
                    while(contant.firstChild){
                        contant.removeChild(contant.firstChild);
                    }

                    contant.appendChild(frag);
                    _self.setlistClick(mode,contant,titleView,key,list,nowParObj[key]["_chkClass"],nowParObj[key].title_mode,"");
                    _self.reDefault(key,defaultValue);

                }else if(mode==2){
                    var allGroupDIv = contant.children;
                    var allInput = contant.getElementsByTagName("Input");
                    var group =  nowParObj[key]["_group"];
                    for(var i=0;i<allGroupDIv.length;i++){
                        util.addEvent(allGroupDIv[i], "change", _self.chgRatio, {
                            "rtype": key, "group": group[i] ,"_viewClass": "wmc_stake_checked" ,
                            "mode":mode,
                            "allGroupDIv":allGroupDIv,
                            "titleView":titleView,
                            "titleMode":nowParObj[key]["title_mode"],
                            "allInput":allInput,
                            "now":i
                            });
                    }

                    var id_str=",";
                    for(var i=0;i<list.length;i++){
                        id_str+=list[i]+"_input,";
                    }
                    var obj_ids =  util.getObjAry(contant,id_str);
                    for(var key_sub in  obj_ids){
                        if(obj_ids[key_sub]){
                            util.addEvent(obj_ids[key_sub], "input", _self.keep_credit,{"target":obj_ids[key_sub]});
                        }
                    }

                    _self.reDefault(key,defaultValue);
                }else if(mode==3){
                    var data =  nowParObj[key]["_data"];
                    var dataShow =  nowParObj[key]["_dataShowDiv"];
                    var searchItem =  nowParObj[key]["_searchItem"];
                    var frag = dom.createDocumentFragment();
                    var searchOpen  = nowParObj[key]["_searchOpen"];
                    var searchDiv  = nowParObj[key]["_searchDiv"];
                    var limitCount = nowParObj[key]["_limitCount"];
                    var title_mode = nowParObj[key]["title_mode"];
                    var breakpoint = nowParObj[key]["_breakpoint"];
                    var chkBtnMode =  nowParObj[key]["_chkBtnMode"];
                    var setAllTitleName = nowParObj[key]["_setAllTitleName"];
                    var setItemTitleName = nowParObj[key]["_setItemTitleName"];
                    var limitCountAlertMsg =  LS.get("filter_err_"+key+"_max");
                    var now_count = 0;
                    var point_count = 0;
                    dataShow.children[0].getElementsByTagName("input")[0].checked=false;
                    for(var prop in data){
                        var id = data[prop]["id"];
                        var alias = data[prop]["alias"];
                        var username = data[prop]["username"];
                        var sample = dataShow.children[0].cloneNode(true);
                        var label = sample.getElementsByTagName("label")[0];
                        var input = sample.getElementsByTagName("input")[0];
                        var txt = label.getElementsByTagName("tt")[0];
                        input.name = searchItem;
                        input.value = username;
                        txt.className = "wmc_search_chkTxt";
                        txt.innerHTML = username+"<br><tt class='word_gray'>"+alias+"</tt>";
                        sample.id=key+"_"+id;

                        if(breakpoint[point_count]){
                            if(now_count*1 == breakpoint[point_count].amount*1 || id=="00000"){
                                frag.appendChild(breakpoint[point_count].div);
                                breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
                                point_count++;
                            }
                        }

                        if(id=="00000") continue;
                        frag.appendChild(sample);
                        now_count++;
                    }
                    for(var i=point_count;i< breakpoint.length;i++){
                        frag.appendChild(breakpoint[i].div);
                        breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
                    }

                    while(dataShow.children[0] != dataShow.children[dataShow.children.length*1-1]){
                        dataShow.removeChild(dataShow.children[(dataShow.children.length)*1-1]);
                    }
                    dataShow.appendChild(frag);
                    var allTagLi =  dataShow.getElementsByTagName("li");
                    var searchItemDiv = dataShow;
                    var status="";
                    for(var i=0;i<allTagLi.length;i++){
                        if(allTagLi[i].children.length>0){
                            var checkBox = allTagLi[i].getElementsByTagName("input")[0];
                            (allTagLi[i].id)? status="single" :status="ALL";
                            util.addEvent(checkBox, "click", _self.chgcheckBox, {
                                "id":allTagLi[i].id,
                                "status":status,
                                "rtype": key,
                                "title":titleView,
                                "searchItem":searchItem,
                                "searchDiv":searchItemDiv,
                                "limitCount":limitCount,
                                "titleMode":title_mode,
                                "chkBtnMode":chkBtnMode,
                                "setAllTitleName":setAllTitleName,
                                "setItemTitleName":setItemTitleName
                                }
                            );
                        }
                    }
                    if(searchOpen){
                        var text = searchDiv.getElementsByTagName("input")[0];
                        var clearBtn = searchDiv.getElementsByTagName("input")[1];
                        util.addEvent(text, "input", _self.searchItem, { "target":text,"item":searchItem });
                        util.addEvent(clearBtn, "click", _self.clearSearch, { "target":text,"item":searchItem});
                    }else{
                        searchDiv.style.display="none";
                    }
                    if( typeof limitCountAlertMsg !== 'undefined' && limitCountAlertMsg!=""){
                        now_parObj[key]["_limitCountAlertMsg"] = limitCountAlertMsg.replace(new RegExp("\\\*LIMITCOUNT\\\*", "gi"), limitCount);
                    }

                    _self.reDefault(key,defaultValue);
                    if(chkBtnMode){
                        var chkBtnDiv = nowParObj[key]["_chkBtnDiv"];
                        for(var btn in chkBtnDiv ){
                            if(btn=="SAVE"){
                                util.addEvent(chkBtnDiv[btn].div, "click", _self.saveParam, {"rtype":key,"icon":icon,"act":viewClass,"disappear":chkBtnDiv[btn].disappear});
                            }
                            if(btn=="CANCEL"){
                                util.addEvent(chkBtnDiv[btn].div, "click", _self.resetIcon, {"rtype":key,"icon":icon,"act":viewClass,"disappear":chkBtnDiv[btn].disappear});
                            }

                        }
                    }

                }else if(mode==4){
                    var data =  nowParObj[key]["_data"];
                    var dataShow =  nowParObj[key]["_dataShowDiv"];
                    var searchItem =  nowParObj[key]["_searchItem"];
                    var frag = dom.createDocumentFragment();
                    var searchOpen  = nowParObj[key]["_searchOpen"];
                    var searchDiv  = nowParObj[key]["_searchDiv"];
                    var limitCount = nowParObj[key]["_limitCount"];
                    var breakpoint = nowParObj[key]["_breakpoint"];
                    var setAllTitleName = nowParObj[key]["_setAllTitleName"];
                    var now_count = 0;
                    var point_count = 0;

                    for(var prop in data){
                        var id = data[prop]["id"];
                        var name = data[prop]["name"];
                        var sample = dataShow.children[0].cloneNode(true);
                        sample.id = key+"_"+id;
                        sample.children[0].setAttribute("name",searchItem);
                        sample.children[0].innerHTML =  name;

                        if(breakpoint[point_count]){
                            if(now_count*1 == breakpoint[point_count].amount*1 ||id=="00000"){
                                frag.appendChild(breakpoint[point_count].div);
                                breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
                                point_count++;
                            }
                        }
                        if(id=="00000") continue;
                        frag.appendChild(sample);
                        now_count++;

                    }

                    for(var i=point_count;i< breakpoint.length;i++){
                        frag.appendChild(breakpoint[i].div);
                        breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);

                    }

                    while(dataShow.children[0] != dataShow.children[dataShow.children.length*1-1]){
                        dataShow.removeChild(dataShow.children[(dataShow.children.length)*1-1]);
                    }
                    dataShow.children[0].id = key+"_ALL";
                    dataShow.appendChild(frag);


                    if(searchOpen){ //收尋框框
                        var text = searchDiv.getElementsByTagName("input")[0];
                        var clearBtn = searchDiv.getElementsByTagName("input")[1];
                        util.addEvent(text, "input", _self.searchItem, { "target":text,"item":searchItem });
                        util.addEvent(clearBtn, "click", _self.clearSearch, { "target":text,"item":searchItem});

                    }else{
                        searchDiv.style.display="none";
                    }

                    _self.setlistClick(mode,contant,titleView,key,null,nowParObj[key]["_chkClass"],nowParObj[key].title_mode,setAllTitleName);
                    _self.reDefault(key,defaultValue);
                }

                if(viewClass!=""){
                    util.addEvent(icon, "click", _self.showInfEventTEST, { "icon": icon, "param":{ "_focus":contant, "_setView": icon, "_viewClass":viewClass,"info_mode":now_parObj[key]["info_mode"],"rtype":key,"mode":mode }   });
                }


            }

        }


        _self.showInfEventTEST = function (e, _par) {
            var icon = _par.icon;
            var param = _par.param;
            //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
            var all = param._focus.getElementsByTagName("*");
            var close_self = false;
            for (var i = 0, max = all.length; i < max; i++) {
                if (all[i] == e.target) {
                    return false;
                }
            }
            if (e.target == param._focus) return false;
            if (param._setView.classList.contains(param._viewClass)) {
                param._setView.classList.remove(param._viewClass);
                close_self = true;
                if (param.info_mode) util.removeEvent(param._focus, "click");
                util.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
                util.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");

                if(param.mode==2){
                    var tmpObj=new Object;
                    var list = now_parObj[param.rtype]["_list"];
                    var id_str=",";
                    for(var i=0;i<list.length;i++){
                        id_str+=list[i]+"_input,";
                    }
                    var obj_ids =  util.getObjAry(param._setView,id_str);
                    for(var key_sub in  obj_ids){
                        if(obj_ids[key_sub]){
                            var itemType = key_sub.split('_')[0];
                            var itemGold = obj_ids[key_sub].value*1;
                            tmpObj[itemType] = itemGold;
                        }
                    }
                    _param[param.rtype]["listGold"] = tmpObj;
                    now_parObj[param.rtype]["_default"] = _param[param.rtype];
                    _self.dispatchEvent("autoBackParam",_param);
                }else if(param.mode==3){
                    var chkBtnMode = now_parObj[param.rtype]["_chkBtnMode"];
                    if(chkBtnMode){
                        if(close_self){
                            var chkBtnDiv = now_parObj[param.rtype]["_chkBtnDiv"];
                            chkBtnDiv.CANCEL.div.click();
                        }
                    }else{
                        if(_param[param.rtype]=="ALL"){
                            _self.reDefault(param.rtype,"ALL");
                        }
                    }
                }

            } else {
                param._setView.classList.add(param._viewClass);
                if (param.info_mode) util.addEvent(param._focus, "click", _self.closeInfElmtTEST, param);
                util.addEvent(dom.getElementsByTagName("div")[0], "mousedown", _self.InfBlurEventTEST, _par);
                util.addEvent(dom.getElementsByTagName("div")[0], "touchstart", _self.InfBlurEventTEST, _par);
                _self.scrollToTop(param.rtype);

            }
        }

        _self.InfBlurEventTEST = function (e, _par) {
            var icon = _par.icon;
            var param = _par.param;
            //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
            var mouseIN = false;
            var all = param._focus.getElementsByTagName("*");
            for (var i = 0, max = all.length; i < max; i++) {
                if(all[i] == e.target){
                    mouseIN = true;
                }
            }

            if (param._focus == e.target) mouseIN = true;

            if (!mouseIN){
                var all = icon.getElementsByTagName("*");
                for (var i = 0, max = all.length; i < max; i++) {
                    if (all[i] == e.target) {
                        return false;
                    }
                }
                if (e.target == icon) return false;

                _self.closeInfElmtTEST(null,param);
            }

        }

        _self.closeInfElmtTEST = function (e,param) {
            dom.activeElement.blur();
            var close_outside = false;
            if (param._setView.classList.contains(param._viewClass)) {
                param._setView.classList.remove(param._viewClass);
                close_outside =true;
            }

            util.removeEvent(param._focus, "click");
            util.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
            util.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");

            if(param.mode==2){
                var tmpObj=new Object;
                var list = now_parObj[param.rtype]["_list"];
                var id_str=",";
                var itemGold_ALL = 0;
                for(var i=0;i<list.length;i++){
                    id_str+=list[i]+"_input,";
                }
                var obj_ids =  util.getObjAry(param._setView,id_str);
                for(var key_sub in  obj_ids){
                    if(obj_ids[key_sub]){
                        var itemType = key_sub.split('_')[0];
                        var itemGold = obj_ids[key_sub].value*1;
                        tmpObj[itemType] = itemGold;
                        if (itemType == "ALL") itemGold_ALL = itemGold;
                    }
                }
                _param[param.rtype]["listGold"] = tmpObj;
                now_parObj[param.rtype]["_default"] = _param[param.rtype];
                _self.dispatchEvent("autoBackParam",_param);


                if (dom.getElementById("ALL_radio").checked) {
                    dom.getElementById("stake_now").innerHTML = LS.get("filter_more") + " " + itemGold_ALL;
                }


            }else if(param.mode==3){
                var chkBtnMode = now_parObj[param.rtype]["_chkBtnMode"];
                if(chkBtnMode){
                    if(close_outside){
                        var chkBtnDiv = now_parObj[param.rtype]["_chkBtnDiv"];
                        chkBtnDiv.CANCEL.div.click();
                    }
                }else{
                    if(_param[param.rtype]=="ALL"){
                        _self.reDefault(param.rtype,"ALL");
                    }

                }
            }

        }
        //隱藏顯示提示窗


        _self.setlistClick = function(mode,contant,titleView,nowRtype,list,chkClass,titleMode,setAllTitleName){
            var contant = contant;
            var mode = mode ;
            var all = contant.getElementsByTagName("li");

            if(mode==1){
                for(var i =0;i<all.length;i++){
                    var tmpObj = new Object();
                    tmpObj["target"] = titleView;
                    tmpObj["mode"] = mode;
                    tmpObj["sel_dom"] = all[i];
                    tmpObj["value"] = list[i];
                    tmpObj["nowRtype"] = nowRtype;
                    tmpObj["chkClass"] = chkClass;
                    tmpObj["all"] = all;
                    tmpObj["sel"] = all[i];
                    tmpObj["titleMode"] = titleMode;
                    tmpObj["setAllTitleName"]="";
                    util.addEvent(all[i],"click",_self.chgInfTitleTEST,tmpObj)
                }
            }else if(mode ==4){
                for(var i =0;i<all.length;i++){
                    if(all[i].children[0]){
                        var tmpObj = new Object();
                        tmpObj["target"] = titleView;
                        tmpObj["mode"] = mode;
                        tmpObj["sel_dom"] = all[i].children[0];
                        tmpObj["value"] = all[i].id.split("_")[1];
                        tmpObj["nowRtype"] = nowRtype;
                        tmpObj["chkClass"] = chkClass;
                        tmpObj["all"] = all;
                        tmpObj["sel"] = all[i];
                        tmpObj["titleMode"] = titleMode;
                        if(i==0 && setAllTitleName!=""){
                            tmpObj["setAllTitleName"] = setAllTitleName;
                        }else{
                            tmpObj["setAllTitleName"] = "";
                        }
                        util.addEvent(all[i],"click",_self.chgInfTitleTEST,tmpObj)

                    }
                }
            }
        }


        _self.chgInfTitleTEST = function(e,_par){
            var target = _par.target;
            var self_dom = _par.sel_dom;
            var mode = _par.mode;
            var value = _par.value;
            var nowRtype = _par.nowRtype;
            var chkClass = _par.chkClass;
            var all = _par.all;
            var sel = _par.sel;
            var titleMode = _par.titleMode;
            var setAllTitleName = _par.setAllTitleName;

            for(var i=0;i<all.length;i++){
                util.classFunc(all[i], chkClass, "remove");
            }
            util.classFunc(sel, chkClass);
            if(titleMode){
                if(setAllTitleName!="") target.innerHTML = setAllTitleName;
                else target.innerHTML = self_dom.innerHTML;
            }
            _param[nowRtype] = value;
            now_parObj[nowRtype]["_default"] = _param[nowRtype];
            _self.dispatchEvent("autoBackParam",_param);

            if(mode==4 && now_parObj[nowRtype]["_setDiv"].classList.contains(now_parObj[nowRtype]["_viewClass"])){
                now_parObj[nowRtype]["_setDiv"].click();
            }

        }




        _self.chgRatio = function(e,_par){
            var rtype = _par.rtype;
            var group = _par.group;
            var now = _par.now;
            var titleView = _par.titleView;
            var titleMode = _par.titleMode;
            var allInput = _par.allInput;
            var allGroupDIv = _par.allGroupDIv;
            var className = _par._viewClass;
            var allValue =0;
            var id_str;
            var obj_ids;
            var contant = now_parObj[rtype]["_contantView"];
            for (var i=0;i<allGroupDIv.length;i++) {
                util.classFunc(allGroupDIv[i], className, "remove");
                allGroupDIv[i].children[0].children[0].checked=false;
            }
            util.classFunc(allGroupDIv[now], className);
            allGroupDIv[now].children[0].children[0].checked=true;

            for(var i=0;i<allInput.length;i++){
                if(allInput[i].type=="radio"){
                    allInput[i].disabled = false;
                }else{
                    allInput[i].disabled = true;
                }
            }

            if(group=="ALL"){
                id_str=","+group+"_input,";
                obj_ids =  util.getObjAry(contant,id_str);
                for(var key_sub in  obj_ids){
                    if(obj_ids[key_sub]){
                        obj_ids[key_sub].disabled = false;
                    }
                }
            }else{
                id_str=",";
                for(var i=0;i<now_parObj[rtype]["_list"].length;i++){
                    if(now_parObj[rtype]["_list"][i]!="ALL")id_str+=now_parObj[rtype]["_list"][i]+"_input,";
                }
                obj_ids =  util.getObjAry(contant,id_str);
                for(var key_sub in  obj_ids){
                    if(obj_ids[key_sub]){
                        obj_ids[key_sub].disabled = false;
                    }
                }
            }

            if(titleMode){
                if(group=="ALL"){
                    for(var key_sub in  obj_ids){
                        if(obj_ids[key_sub]){
                            allValue = obj_ids[key_sub].value;
                        }
                    }
                    titleView.style.display="";
                    // titleView.innerHTML = "> "+ allValue*1;
                    titleView.innerHTML = LS.get("filter_more")+" "+ allValue*1;
                }else{
                    titleView.style.display="";
                    var def_list =  _param[rtype]["listItem"];

                    if(now_parObj[rtype]["_list"].indexOf(def_list)!="-1"){
                        for(var key_sub in  obj_ids){
                            if(obj_ids[key_sub]){
                                // allValue = allInput[i].value;
                                if(obj_ids[key_sub].id ==def_list+"_input" ){
                                    titleView.innerHTML = LS.get("filter_more")+" " +obj_ids[key_sub].value*1;
                                    break;
                                }
                            }
                        }

                    }
                    else{
                        // titleView.innerHTML = "> ...";
                        titleView.innerHTML = LS.get("filter_more")+" " + "...";
                    }
                }
            }
            _param[rtype]["mode"] = group;
            now_parObj[rtype]["_default"] = _param[rtype];
            _self.dispatchEvent("autoBackParam",_param);
        }

        _self.chgcheckBox = function(e,_par){
            var status = _par.status;
            var rtype = _par.rtype;
            var id = _par.id;
            var title = _par.title;
            var searchItem = _par.searchItem;
            var searchDiv = _par.searchDiv;
            var limitCount = _par.limitCount;
            var titleMode = _par.titleMode;
            var chkBtnMode = _par.chkBtnMode;
            var setAllTitleName = _par.setAllTitleName;
            var setItemTitleName = _par.setItemTitleName;;
            var all_single = dom.getElementsByName(searchItem);
            var downlineStatus="NONE";
            var count=0;
            var  allcheck = searchDiv.getElementsByTagName("input")[0];
            if(status=="ALL"){
                for(var i=0;i<all_single.length;i++){
                    if(allcheck.checked==true){
                        all_single[i].checked = true;
                        all_single[i].disabled = true;
                        util.classFunc(all_single[i].parentNode.parentNode, "disabled");
                        downlineStatus="ALL";
                    }else{
                        all_single[i].checked= false;
                        all_single[i].disabled =false;
                        util.classFunc(all_single[i].parentNode.parentNode, "disabled","remove");
                        downlineStatus="ALL";
                    }
                }
            }else{
                var single = dom.getElementById(id);
                var single_checkbox = single.getElementsByTagName("input")[0];
                var tmpAry=[];
                    for(var i=0;i<all_single.length;i++){
                        all_single[i].disabled =false;
                        if(all_single[i].checked==true){
                            tmpAry.push(all_single[i].parentNode.parentNode.id.split("_")[1]);
                            count++;
                        }
                    }

                    /* //超過限制數量凍結選項
                    if(count>limitCount  && limitCount*1!=0){
                        for(var i=0;i<all_single.length;i++){
                            if(all_single[i].checked==false){
                                all_single[i].disabled =true;
                            }
                        }
                    }
                    */
                    if(count>limitCount && limitCount*1!=0){
                        tmpAry = tmpAry.filter(function(value){
                            return value != _par.id.split("_")[1];
                        });
                        single_checkbox.checked=false;
                        if(now_parObj[rtype]["_limitCountAlertMsg"]!=""){
                            _self.showErrorMsg("limitCount",now_parObj[rtype]["_limitCountAlertMsg"]);
                        }

                    }

                    if(tmpAry.length>0)	downlineStatus=tmpAry.join(",");
                    if(tmpAry.length == all_single.length){
                        // allcheck.checked=true; //全部勾選不要勾all
                        // downlineStatus="ALL";
                    }else{
                        allcheck.checked=false;
                    }
            }
            if(titleMode){
                if(downlineStatus=="ALL" || downlineStatus=="NONE"){
                    if(setAllTitleName!=""){
                        title.innerHTML=setAllTitleName;
                    }else{
                        var li_all =  searchDiv.getElementsByTagName("li")[0];
                        title.innerHTML=li_all.getElementsByTagName("tt")[0].innerHTML;
                    }
                }else{
                    title.innerHTML=setItemTitleName+ " ("+tmpAry.length+")";
                }
            }
            if(downlineStatus=="NONE")downlineStatus="ALL";
            if(chkBtnMode){
                _paramTmp[rtype] = downlineStatus;
            }else{
                _param[rtype]=downlineStatus;
                now_parObj[rtype]["_default"] = _param[rtype];
                _self.dispatchEvent("autoBackParam",_param);
            }


        }

        _self.searchItem = function(e,_par){
            var target = _par.target;
            var itemName = _par.item;
            var item = dom.getElementsByName(itemName);
            var reg = new RegExp("" + target.value + "","i");
            for(var i=0;i<item.length;i++){
                var value = item[i].value;
                var text = item[i].innerText;
                var searchMain = (value)? value:text;

                if(searchMain.match(reg) == null)item[i].parentNode.style.display="none";
                else item[i].parentNode.style.display="";

            }
        }

        _self.clearSearch = function(e,_par){
            var target = _par.target;
            var itemName = _par.item;
            target.value="";
            _self.searchItem(e,{"target":target,"item":itemName});

        }

        _self.getNowParam = function(type){
            if(_param[type]){
                return _param[type];
            }else{
                return _param;
            }
        }


        _self.autoBackParam = function(obj){
            alert("override take param");
            return obj;
        }

        _self.saveParam = function(e,_par){
            // {"rtyep":rtype,"icon":icon,"act":viewClass,"disappear":chkBtnDiv[key].disappear}
            var rtype = _par.rtype;
            var disappear = _par.disappear;
            var act = _par.act;
            var icon = _par.icon;

            if(disappear){
                util.classFunc(icon, act, "remove");
            }
            _param[rtype]= _paramTmp[rtype];
            now_parObj[rtype]["_default"] = _param[rtype];
            _self.dispatchEvent("autoBackParam",_param);
            if(_param[rtype]=="ALL"){
                _self.reDefault(rtype,"ALL","N");
            }
        }

        _self.resetIcon = function(e,_par){
            var rtype = _par.rtype;
            var disappear = _par.disappear;
            var act = _par.act;
            var icon = _par.icon;
            if(disappear){
                util.classFunc(icon, act, "remove");
            }
            var tmpObj = new Object();
            tmpObj[rtype] = now_parObj[rtype]["_default"];
            _self.reDefault(rtype,tmpObj[rtype],"N");
        }

        _self.reDefault=  function(_rtype,_def,isOut){
            isOut = isOut || "Y";
            if(!now_parObj[_rtype]){
                console.log("NO FILTER")
                return;
            }
            var key = _rtype;
            var mode = now_parObj[key]["mode"]
            var def = _def;
            var contant = now_parObj[key]["_contantView"];
            if(mode==1){

                var list = now_parObj[key]["_list"];
                var num = list.indexOf(def);
                if(num!=-1){
                    var defautitem =contant.getElementsByTagName("li")[num];
                    defautitem.click();
                }else{
                    var defautitem =contant.getElementsByTagName("li")[0];
                    defautitem.click();
                }
            }

            if(mode==2){
                var allGroupDIv = contant.children;
                var allInput = contant.getElementsByTagName("Input");
                var group =  now_parObj[key]["_group"];
                var titleView =  now_parObj[key]["_titleView"];

                var num = group.indexOf(def["mode"]);
                var preitem = def["listGold"];
                var tmpObj = new Object();

                for(var sub in preitem){
                    if(preitem[sub]*1 > 0) tmpObj[sub] = (preitem[sub])*1/1;
                    else  tmpObj[sub]=0;
                    if(dom.getElementById(sub+"_input"))dom.getElementById(sub+"_input").value = tmpObj[sub]*1;
                }
                _param[key]["listGold"] = tmpObj;
                if(def["listItem"])_param[key]["listItem"] = def["listItem"];
                else{
                    _param[key]["listItem"] = "";
                }

                if(num!=-1){
                    _self.chgRatio(null,{
                        "rtype": key, "group": group[num] ,"_viewClass": "wmc_stake_checked" ,
                        "mode":mode,
                        "allGroupDIv":allGroupDIv,
                        "titleView":titleView,
                        "titleMode":now_parObj[key]["title_mode"],
                        "allInput":allInput,
                        "now":num
                    });
                }else{
                    _param[key]["mode"] = def["mode"];
                    // now_parObj[key]["_default"] = _param[key];
                    _self.dispatchEvent("autoBackParam",_param);
                }
            }

            if(mode==3){
                var dataShow =  now_parObj[key]["_dataShowDiv"];
                var searchItem = now_parObj[key]["_searchItem"];
                var chkBtnMode =  now_parObj[key]["_chkBtnMode"];
                var all_single = dom.getElementsByName(searchItem);
                var allcheck = dataShow.getElementsByTagName("input")[0];
                def = def.toString();
                for(var i=0;i<all_single.length;i++){
                    all_single[i].checked =false;
                    all_single[i].disabled =false;
                }
                allcheck.checked = false;
                allcheck.disabled = false;

                if(def=="ALL"){
                    dataShow.getElementsByTagName("input")[0].click();
                }else if(def!=""){
                    var downlineIdAry = def.split(",");
                    for(var i =0;i<downlineIdAry.length;i++){
                        var downlineIdItem = dom.getElementById(key+"_"+downlineIdAry[i]);
                        if(downlineIdItem)downlineIdItem.getElementsByTagName("input")[0].click();
                        else{
                            dataShow.getElementsByTagName("input")[0].click();
                        }
                    }
                }

                if(chkBtnMode && isOut!="N"){
                    var chkBtnDiv = now_parObj[key]["_chkBtnDiv"];
                    chkBtnDiv.SAVE.div.click();
                }
            }

            if(mode==4){
                var dataShow =  now_parObj[key]["_dataShowDiv"];
                def = def.toString();
                if(def=="ALL"){
                    dataShow.getElementsByTagName("li")[0].click();
                }else if(def!=""){
                    var downlineIdAry = def.split(",");
                    for(var i =0;i<downlineIdAry.length;i++){
                        var downlineIdItem = dom.getElementById(key+"_"+downlineIdAry[i]);
                        if(downlineIdItem)downlineIdItem.click();
                        else dataShow.getElementsByTagName("li")[0].click();
                    }
                }
            }


        }


        _self.scrollToTop = function(rtype){
            now_parObj[rtype]["_contantView"].scrollTop=0;
        }

        _self.keep_credit=function(e){
            e.target.value = e.target.value.replace(/\D/g,'')*1;
        }

        _self.showErrorMsg = function(code, arr_data){
            if(code == "limitCount"){
                util.showErrorMsg(arr_data);
            }
        }

        _self.closeAllDownlist = function(){
            for(var key in now_parObj ){
                var icon = now_parObj[key]["_setDiv"];
                if(icon.classList.contains(now_parObj[key]["_viewClass"]))
                {
                    now_parObj[key]["_setDiv"].click();
                }

            }

        }



        _self.addEventListener=function(eventname, eventFunction){
            eventHandler[eventname] = eventFunction;
        }

        _self.dispatchEvent=function(eventname, param){
            if(eventHandler[eventname]) eventHandler[eventname](param);
        }


    }



}

function getView(){
	 	var view=new Object();
	 	var viewportwidth;
	 	var viewportheight;
	 
	 	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	 
		if(typeof window.innerWidth != 'undefined'){
			
	  		viewportwidth = window.innerWidth,
	 			viewportheight = window.innerHeight;
	 	
	 	// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)		
		}else if(typeof document.documentElement != 'undefined'&& typeof document.documentElement.clientWidth !='undefined' && document.documentElement.clientWidth != 0){

	       viewportwidth = document.documentElement.clientWidth,
	       viewportheight = document.documentElement.clientHeight;
	       
	 	// older versions of IE
	 	}else{
	 		
	       viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
	       viewportheight = document.getElementsByTagName('body')[0].clientHeight;
	       
	 	}
		view.viewportwidth=viewportwidth;
		view.viewportheight=viewportheight;
	 	return view;
}
/*
* add multiple block version
*/
function fastTemplate_a1(){
	var _self=this;
	var parentClass;
	var Hashtabl=new Array();
	var dataHash=new Array();
	var keyHash=new Array();
	var SampleTable;
	var samplelayer;
	var tempTag;

	_self.init=function(obj){
		SampleTable = obj.innerHTML.replace(/<XMP>/gi,"").replace(/<\/XMP>/gi,"");
		// SampleTable = obj.innerHTML.replace("<XMP>","").replace("</XMP>","").replace("<xmp>","").replace("</xmp>","");
		// samplelayer = "";
		samplelayer = SampleTable;
		dataHash=new Array();
		keyHash=new Array();
	}

	_self.setParentclass=function(parentclass){
		parentClass=parentclass;
	}

	_self.getThis=function(varible){
		return eval(varible);
	}

	_self.setPrivate=function(varible,val){
		eval(varible+"='"+val+"'");
	}

	_self.addBlock=function(tag){
		var s_srt="<!-- START DYNAMIC BLOCK: "+tag+" -->";
		var e_srt="<!-- END DYNAMIC BLOCK: "+tag+" -->";
		var n_start =SampleTable.indexOf(s_srt,0);
		var n_end   =SampleTable.lastIndexOf(e_srt,SampleTable.length);
		var sampleTag =SampleTable.substring(n_start,n_end);

		sampleTag =sampleTag.replace(s_srt,"");

		// samplelayer = SampleTable.replace(s_srt+sampleTag+e_srt,"*TAG_"+tag+"*");
		samplelayer = samplelayer.replace(s_srt+sampleTag+e_srt,"*TAG_"+tag+"*");

		if (dataHash[tag]==undefined){
			dataHash[tag]=new Array();
			keyHash[keyHash.length]=tag;
		}
		tempTag=tag;
		dataHash[tag][dataHash[tag].length]=sampleTag;
	}

	_self.replace=function(oldTag,newTag){
		dataHash[tempTag][dataHash[tempTag].length-1]=dataHash[tempTag][dataHash[tempTag].length-1].replace(oldTag,newTag);
	}

	_self.fastPrint=function(){
		var output=samplelayer;
		for (var i=0;i<keyHash.length;i++){
			allLayer="";
			for (var j=0;j<dataHash[keyHash[i]].length;j++){
				allLayer+=dataHash[keyHash[i]][j];
			}
			output=output.replace("*TAG_"+keyHash[i]+"*",allLayer);
		}
		return output;
	}

	_self.getBlock=function(tag){
		if (dataHash[tag] == null) return "";
		var allLayer = "";
		for (var j=0; j<dataHash[tag].length; j++){
			allLayer += dataHash[tag][j];
		}
		return allLayer;
	}

}
function config_set(){
    var _self = this;
    var parentClass;
    var ConfigAry;

    _self.init=function(){
        ConfigAry = _self.set();
    }

    _self.set=function(){
        var ary = new Object();
        ary["GTYPEARY"] = new Array("FT","BK","ES","TN","VB","TT","BM","BS","SK","OP");
        ary["REPORT_GTYPE"] = ary["GTYPEARY"].concat(new Array("ALL","FS"));
        ary["REPORT_WTYPE"] = new Array("ALL","R","RE","P","OU","ROU","PD","RPD","PD3","RPD3","PD5","RPD5","T","RDT","RT","M","RM","FALL","RFALL","SP","F","RF","HR","HOU","HM","HRE","HROU","HRM","HPD","HRPD","OUALL","EOALL","HOUALL","HEOALL","ROUALL","HRUALL","HT","HRT","WM","RWM","HWM","HRWM","DC","RDC","W3","MOUALL","MPG","MTS","DUALL","DG","DS","OUEALL","OUPALL","OUTALL","RMUALL","RMPG","RMTS","RDUALL","RDG","RDS","RUEALL","RUPALL","RUTALL","ARGALL","RNCALL","RNBALL","RSALL","CS","RCS","WN","RWN","HTS","RTS2","TS","RTS","WB","RWB","WE","RWE","SB","RSB","HG","RHG","MG","RMG","F2G","F3G","T1G","RT1G","T3G","RT3G","R15","OU15","M15","RE15","ROU15","RM15","TK","OT","ROT","PA","OG","RCD","FG","MWMQ","BH","RPS","TRUALL","RTW","RPF","RPXALL");

        ary["RETRY_LIMIT"] = 6;
        ary["RETRY_TIME"] = 5000;
        ary["DASHBOARD"] = 10000;
        ary["AD_TIME"] = 5000;
        ary["RESEND_TIME"] = 5000;
        ary["ANNOUNCE_PROBLEMACCOUNT_TIME"] = 1000 * 60 * 3;

        ary["NCR_SHOWCOUNT_DEF"] = 50;  //NCR預設顯示筆數
        ary["ACCOUNT_SHOWCOUNT_DEF"] = 50;  //帳號預設顯示筆數
        ary["ACCOUNT_SHOWCOUNT_ARY"] = [25, 50, 100];  //帳號顯示筆數陣列

        ary["ADD_D0_CO_WINLOSS"] = 100;  //新增股东的預設成數
        ary["CONF_BAR_RANGE"] = 0.25;  //詳細設定的拉霸間隔
        ary["SU_WINLOSS_RANGE"] = 1;  //新增代理的su佔成拉霸間隔
        ary["SU_WINLOSS_MAX"] = 100;  //新增代理的su最大成數
        ary["AG_WINLOSS_RANGE"] = 1;  //新增代理的ag佔成拉霸間隔
        ary["AG_WINLOSS_MAX"] = 100;  //新增代理的ag最大成數
        ary["CO_WINLOSS_RANGE"] = 1;  //新增總代理的co佔成拉霸間隔
        ary["CO_WINLOSS_MAX"] = 100;  //新增總代理的co最大成數
        ary["D0_WINLOSS_MAX"] = 100;  //新增分公司的預設成數

        ary["LTYPE_ARY"] = { "1": "A", "2": "B", "3": "C", "4": "D" };  //ltype值
        ary["DEF_LTYPE"] = 4;  //預設ltype
        ary["CONFIG_DANGEROUS"] = 10 * 1000; //危險球更新(下注單&交易狀況)
        ary["LAZY_SW"] = true; //lazy loading開關
        ary["LAZY_COUNT"] = 10 //lazy loading筆數
        ary["LAZY_COUNT_BIG_PAGE"] = 20 //lazy loading筆數(大畫面)
        ary["WMC_RELOAD"] = 10 * 1000;  //WMC更新秒數
        ary["RECORD_LIMIT"] = 6;//RECORD默认显示条数
        ary["RECORD_RELOAD"]= 20 * 1000;  //RECORD更新秒數
        ary["BETLIST_RELOAD"]= 30 * 1000;  //流水注单更新秒數
        // ary["NCR_RELOAD"] = 180 * ConfigAry["SECOND"];  //NCR更新秒數
        // ary["APN_RELOAD"] = 180 * ConfigAry["SECOND"];  //APN更新秒數

        ary["LEAGUE_RELOAD"] = 180 * 1000;  //盤面league更新秒數
        // ary["ALLBETS_FT_RELOAD"] = 180 * 1000;  //單式盤面allbets更新秒數
        // ary["ALLBETS_RB_RELOAD"] = 180 * 1000;  //滾球盤面allbets更新秒數
        ary["ALLBETS_LEAGUE_ACTIVE"] = 10; //聯盟預設展開數量
        ary["WEB_TIME_ZONE"] = -4;
        ary["ONLINE_MEM"] = 30 *1000;  //線上會員 自動更新秒數
        ary["LOG_LOGIN_TIME"] = 60 *1000;//登陆日志 自动更新秒数
        return ary;
    }

    _self.get=function(_key){
        return ConfigAry[_key];
    }

}
function LS_tw(){
    var _self = this;
    var parentClass;
    var LangxAry;

    _self.init=function(){
        LangxAry = _self.set();
    }

    _self.set=function(){
        var array = new Object();
        array["loading_txt"] = "加載中";
        array["page_dashboard"] = "首頁";
        array["page_report"] = "報表";
        array["page_totalbet"] = "即時注單";
        array["page_set"] = "有結果";
        array["page_un"] = "未有結果";
        array["page_summary"] = "賽事結果概要";
        array["page_period"] = "月帳期數表";//Accounting Period
        array["page_exchange"] = "匯率";
        array["page_cancel"] = "取消單";
        array["page_cancel"] = "取消單";
        array["page_quicksearch"] = "快速搜索";
        array["page_onlinemem"] = "線上會員";
        array["page_mysetting"] = "我的設定";
        array["page_myactivities"] = "我的活動記錄";
        array["page_feature"] = "特色";
        array["page_requirements"] = "系統需求";
        array["page_newurl"] = "最新網址";
        array["page_contactus"] = "聯繫我們";
        array["page_pwd_recovery"] = "密碼恢復";
        array["page_chg_pwd_inside"] = "更改密碼";
	    array["page_problem_accounts"] = "問題帳號";
        array["page_announcement"] = "公告";
        array["page_account"] = "帳戶管理";//A/C Mgmt
        array["page_sub"] = "子帳號";
        array["page_su_add"] = "新增總代理";
        array["page_ag_add"] = "新增代理";
        array["page_mem_add"] = "新增會員";
        array["page_sub_add"] = "新增子帳號";//New Sub Agent

        array["str_copied"] = "資料已複製";

        array["page_overview"] = "總覽";
        array["page_INPLAY"] = "滾球";
        array["page_TODAY"] = "今日";
        array["page_EARLY"] = "早盤";
        array["page_STARTED"] = "已開賽";
        array["page_PARLAY"] = "過關";
        array["page_OUTRIGHT"] = "冠軍";
        array["page_RESULTS"] = "賽果";

        //new_url Start
        array["newcro666"] = "會員端";
        array["phcro666"] = "手機會員端";
        array["newagcro666"] = "管理端";//New Manager Site
        array["agphonecro666"] = "手機管理端";
        array["acc"] = "舊帳";
        //new_url End
        //恢復密碼
        array["0X001"] = "參數錯誤";
        array["4X001"] = "IP不合法";
        array["4X002"] = "帳號停用";
        array["4X003"] = "帳號禁止登入";
        array["4X004"] = "密碼錯誤多次被鎖";
        array["4X005"] = "帳密不正確";
        array["4X006"] = "三分鐘後再試";
        array["4X007"] = "未設定email";
        array["4X025"] = "此功能暫時已被禁用，請聯繫您的上線。";
        array["4X026"] = "驗證碼發送次數過多，系統暫時不能接受申請，請檢查您的資料是否正確。";
        array["4X027"] = "連不到MailServer";
        array["4X028"] = "MailServer發送驗證碼失敗";
        array["4O005"] = "驗證碼已發送到您的電子郵件";
        array["4O006"] = "已成功註冊";
        array["get_mail_canceal"] = "請輸入有效的電子郵件";//Please enter a valid email address
        array["input_verify_cancel"] = "取消密碼恢復？";
        array["remove_email"] = "密碼恢復電子郵件已被刪除";
        array["remove_email_message"] = "刪除密碼恢復電郵？";

        array["enable_Y"] = "啓用";
        array["enable_N"] = "停用";
        array["enable_S"] = "只能看帳";
        array["enable_F"] = "禁止登入";
        array["input_acc"] = "請輸入帳號";//Enter User Code

        //額度模式
        array["pay_type_0"] = "自動恢復";
        array["pay_type_1"] = "餘額浮動";
        array["long_pay_type_0"] = "自動恢復";
        array["long_pay_type_1"] = "餘額浮動";

        array["str_co"] = "股東";//Corprator
        array["str_su"] = "總代理";//Agency
        array["str_ag"] = "代理商";
        array["str_mem"] = "會員";

        array["str_co_sub"] = "股東 子帳號";//Corprator
        array["str_su_sub"] = "總代理 子帳號";//Agency
        array["str_ag_sub"] = "代理商 子帳號";

        array["str_ags"] = "代理";//Agents
        array["str_mems"] = "會員";//Members

        //帳戶新增修改
        array["max_limit_head"] = "最高: "//最大限額字串 Max: RMB 1,100,000
        array["empty_user"] = "此處不能留空"; //帳號請務必輸入
        array["empty_alias"] = "此處不能留空"; //名稱請務必輸入
        array["empty_passwd"] = "此處不能留空"; //請輸入新密碼
        array["empty_confirm"] = "此處不能留空"; //請輸入新密碼
        array["empty_credit"] = "此處不能留空"; //總信用額度請務必輸入
        array["empty_safe"] = "此處不能留空";
        array["empty_enddate"] = "此處不能留空";
        array["empty_enddate1"] = "此處日期格式不正確";
        array["str_confirm_add_su"] = "是否確定寫入總代理"; //是否確定寫入總代理
        array["str_confirm_add_ag"] = "是否確定寫入代理商";//是否確定寫入代理商
        array["str_confirm_add_mem"] = "是否確定寫入會員資料";//是否確定寫入會員資料
        array["credit_over"] = "您輸入的額度大於剩餘額度，請重新輸入.";
        array["user_limit"] = "帳號至少四個字元長.";
        array["user_manage"] = "你沒有勾選 ‘管理帳號’，請勾選其中一個或是全選。";
        array["cash_sw_in_edit_user"] = "因未知原因，系統暫時停止修改額度功能，請稍後再試。";
        array["cash_sw_in_add_user"] = "功能未開放使用，我們將在短期內完成測試並開放功能。";

        array["add_account_success"] = "新增帳戶成功";
        array["copy_success"] = "登入帳號和密碼已複製到剪貼板";
        array["copy_user"] = "帳號：";
        array["copy_pwd"] = "密碼：";
        array["winloss_percent"] = "%";
        //array["su_ag_winloss_error"] = "股東及總代理及代理商的成數總和須在 5 - 8 成內 , 請重新設定 !!";//股東及總代理及代理商的成數總和須在 5 - 8 成內 , 請重新設定 !!
        array["su_ag_winloss_error"] = "成數總和必须要xx% - yy%内， 請重新設定。";
        array["su_ag_winloss8_error"] = "成數總和必須要xx％， 請重新設定。";
        array["status_update"] = "更改帳戶狀態成功";
        array["credit_update"] = "更改信用額度成功";
        array["account_copy"] = "複製";

        //子帳號
        array["max_sub3"] = "已超過可使用子帳戶限制, 無法新增子帳戶。";
        array["sub_mlimit"] = "您最多可選";//You may select maximum of
        array["sub_mlimit2"] = "個帳號。";//accounts at a time.
        array["listsub_safe"] = "安全代碼";
        array["listsub_safe_ag"] = "登入帳號";


        //修改成數
        array["str_possess_down"] = "最低可設";
        array["str_possess_up"] = "最高可設";
        array["str_possess_allowed"] = "可設";//Allowed:
        array["RMB"] = "人民幣";

        //密碼強度
        array["pwd_Very Weak"] = "非常弱";
        array["pwd_Weak"] = "弱";
        array["pwd_Fair"] = "一般";
        array["pwd_Good"] = "好";
        array["pwd_Strong"] = "強";

        //破解時間
        array["pwd_break_Seconds"] = "秒";
        array["pwd_break_Minutes"] = "分鐘";
        array["pwd_break_Hours"] = "小時";
        array["pwd_break_Days"] = "天";
        array["pwd_break_Months"] = "個月";
        array["pwd_break_Years"] = "年";
        array["pwd_break_Centuries"] = "世紀";

        array["pwd_TRILLION"] = "兆";
        array["pwd_100_BILLION"] = "千億";
        array["pwd_10_BILLION"] = "百億";
        array["pwd_BILLION"] = "十億";
        array["pwd_100_MILLION"] = "億";
        array["pwd_10_MILLION"] = "千萬";
        array["pwd_MILLION"] = "百萬";
        array["pwd_100_THOUSAND"] = "十萬";
        array["pwd_10_THOUSAND"] = "萬";
        array["pwd_THOUSAND"] = "千";
        array["pwd_HUNDRED"] = "百";

        //信用額度
        array["str_maxcre"] = "總信用額度僅能輸入數字";
        array["str_maxcre_zero"] = "信用額度不可為0";//0 is not a valid value.
        array["str_maxcre_zero1"] = "請輸入大於 0 的信用額度";//Credit limit should be greater than 0.
        array["str_edit_credit_confirm"] = "是否確定修改信用額度?";//Make sure to modify the credit limit?

        // array["empty_credit"] = "總信用額度請務必輸入"; //總信用額度請務必輸入
        array["empty_credit"] = "此處不能留空";
        array["str_maxcre_zero"] = "信用額度不可為 0";//0 is not a valid value.
        array["str_maxcre_zero1"] = "請輸入大於 0 的信用額度";//Credit limit should be greater than 0
        array["str_maxcre"] = "總信用額度僅能輸入數字";//Credit Limit only accept numbers.

        array["sub_selMax"] = "可管理帳號的權限已達最大使用數。請聯絡您的上線移除已暫停使用的帳號";//You have exceeded the number of ‘Managed Accounts’ allowed.  Please contact your upline to remove inactive accounts.
        //快速搜尋
        //2019-03-28 Ricky 248.登一帳號-Quick Search快速搜尋-sub account，level(層級)幫改為SMA，目前秀錯字Corprator
        //array["layer_type_name_corprator"] = "Corprator";
        array["layer_type_name_corprator"] = "股東";//SMA
        array["layer_type_name_super_agents"] = "總代理";
        array["layer_type_name_agents"] = "代理商";
        array["layer_type_name_members"] = "會員";
        array["enable_str_Active"] = "啓用";
        array["enable_str_Suspended"] = "禁止登入";
        array["enable_str_ViewOnly"] = "只能看帳";
        array["enable_str_Inactive"] = "停用";
        array["layer_type_name_subAccount"] = "子帳號";//Sub Account
        //我的紀錄
        // array["myAct_str_Create_Account"] = "啓用";
        array["myAct_str_Create_Account"] = "新增帳號";
        array["myAct_str_Password_Reset"] = "更改密碼";
        // array["myAct_str_Change_Credits"] = "修改額度"//Change Credits
        array["myAct_str_Change_Credits"] = "更改額度"
        array["myAct_str_super_admin"] = "超帳";//Super Admin
        array["myAct_str_corprator"] = "股東";//Corprator
        array["myAct_str_super_agents"] = " 總代理商";
        array["myAct_str_agents"] = "代理商";
        array["myAct_str_mem"] = "會員";

        //帳戶管理
        array["acc_su"]     = "總代理";
        array["acc_ag"]     = "代理商";
        array["acc_mem"]    = "會員";
        array["acc_sub"]    = "子帳號";
        // array["acc_str_credit"] = "修改額度";//Change Credits
        array["acc_str_credit"] = "更改額度";
        array["acc_str_enable"] = "更改帳戶狀態";//Change Status
        array["acc_str_add"] = "新增帳號";//Account created
        array["acc_str_beadd"] = "此帳號被誰新增";//Account Update By
        array["acc_str_password"] = "更改密碼";//Change Password

        //密碼恢復
        array["recv_enable"] = "啓用";
        array["recv_disable"] = "禁用";

        array['upd_success'] = "更改成功";//更改成功

        // dashboard
        array["dash_D"] = "第";
        array["dash_Ds"] = "天";
        array["dash_PR"] = "佔成收入";
        array["dash_MW"] = "投注人數";
        array["dash_TO"] = "實貨量";
        array["dash_WL"] = "贏 / 輸";

        // totalBets result detail start
        array["PGF"]="最先進球";
        array["OSF"]="最先越位";
        array["STF"]="最先替補球員";
        array["CNF"]="第一顆角球";
        array["CDF"]="第一張卡";
        array["RCF"]="會進球";
        array["YCF"]="第一張黃卡";
        array["GAF"]="有失球";
        array["PGL"]="最後進球";
        array["OSL"]="最後越位";
        array["STL"]="最後替補球員";
        array["CNL"]="最後一顆角球";
        array["CDL"]="最後一張卡";
        array["RCL"]="不會進球";
        array["YCL"]="最後一張黃卡";
        array["GAL"]="沒有失球";
        array["PG"]="最先/最後進球球隊";
        array["OS"]="最先/最後越位球隊";
        array["ST"]="最先/最後替補球員球隊";
        array["CN"]="第一顆/最後一顆角球";
        array["CD"]="第一張/最後一張卡";
        array["RC"]="會進球/不會進球";
        array["YC"]="第一張/最後一張黃卡";
        array["GA"]="有失球/沒有失球";

        array["No"] = "無";
        array["Y"] = "是";
        array["N"] = "否";
        array["FG_S"] = "射門";
        array["FG_H"] = "頭球";
        array["FG_N"] = "無進球";
        array["FG_P"] = "點球";
        array["FG_F"] = "任意球";
        array["FG_O"] = "烏龍球";

        array["RPF_1"] = "第三輪";
        array["RPF_2"] = "第四輪";
        array["RPF_3"] = "第五輪";
        array["RPF_OV"] = "第六輪或之後";

        array["T3G_1"] = "26分鐘以下";
        array["T3G_2"] = "27分鐘+";
        array["T3G_N"] = "無進球";

        array["T1G_N"] = "無進球";
        array["T1G_1"] = "0 - 14:59";
        array["T1G_2"] = "15 - 29:59";
        array["T1G_3"] = "30 – 半場";
        array["T1G_4"] = "45 – 59:59";
        array["T1G_5"] = "60 – 74:59";
        array["T1G_6"] = "75 – 全場";

        array["MQ_H"]=" - 90分鐘";
        array["MQ_C"]=" - 90分鐘";
        array["MQ_HOT"]=" - 加時賽";
        array["MQ_COT"]=" - 加時賽";
        array["MQ_HPK"]=" - 點球";
        array["MQ_CPK"]=" - 點球";
        array["RNB_P"]="沒有罰牌";
        array["RNC_P"]="沒有角球";
        array["RS_P"]="沒有點球";
        array["RS_Y"]="進球";
        array["RS_N"]="無進球";

        // array["AGMH"] = "0 - 14:59";
        // array["BGMH"] = "15 - 29:59";
        // array["CGMH"] = "30 – 半場";
        // array["DGMH"] = "45 – 59:59";
        // array["EGMH"] = "60 – 74:59";
        // array["FGMH"] = "75 – 全場";
        array["FT_title1"]="進球數";
        array["FT_title2"]="進球數";

        array["AGMH"] = "上半場開始 - 14:59 分鐘";
        array["BGMH"] = "15:00 - 29:59 分鐘";
        array["CGMH"] = "30:00 分鐘 - 半場";
        array["HGMH"] = "半場";
        array["DGMH"] = "下半場開始 - 59:59 分鐘";
        array["EGMH"] = "60:00 - 74:59 分鐘";
        array["FGMH"] = "75:00 分鐘 - 全場";
        array["GMH"] = "全場";

        array["TAGMH"] = "開始 - 04:59 分鐘";
        array["TBGMH"] = "05:00 - 09:59 分鐘";
        array["TCGMH"] = "10:00 分鐘 - 半場";
        array["THGMH"] = "半場";
        array["TDGMH"] = "下半場開始 - 19:59 分鐘";
        array["TEGMH"] = "20:00 - 24:59分鐘";
        array["TFGMH"] = "25:00分鐘 - 全場";
        array["TGMH"] = "全場";

        array["BH"] = "落後反超獲勝";
        array["ARG"] = "第一進球";
        array["BRG"] = "第二進球";
        array["CRG"] = "第三進球";
        array["DRG"] = "第四進球";
        array["ERG"] = "第五進球";
        array["FRG"] = "第六進球";
        array["GRG"] = "第七進球";
        array["HRG"] = "第八進球";
        array["IRG"] = "第九進球";
        array["JRG"] = "第十進球";
        array["FG"] = "首個進球方式";
        array["F2G"] = "先進2球的一方";
        array["F3G"] = "先進3球的一方";
        array["T1G"] = "首個進球時間";
        array["T3G"] = "首個進球時間-三項";
        array["TK"] = "先開球球隊";
        array["PA"] = "點球懲罰";
        array["RCD"] = "紅卡(球員)";
        array["RPS"] = "點球大戰";

        array["MQ"]="晉級方法";
        array["MW"]="獲勝方法";
        array["OG"]="烏龍球";
        array["OT"]="加時賽";
        array["RSHA"]="點球大戰 - 第一回合";
        array["RSHB"]="點球大戰 - 第二回合";
        array["RSHC"]="點球大戰 - 第三回合";
        array["RSHD"]="點球大戰 - 第四回合";
        array["RSHE"]="點球大戰 - 第五回合";
        array["RSHF"]="點球大戰 - 第六回合";
        array["RSHG"]="點球大戰 - 第七回合";
        array["RSHH"]="點球大戰 - 第八回合";
        array["RSHI"]="點球大戰 - 第九回合";
        array["RSHJ"]="點球大戰 - 第十回合";
        array["RSHK"]="點球大戰 - 第十一回合";
        array["RSHL"]="點球大戰 - 第十二回合";
        array["RSHM"]="點球大戰 - 第十三回合";
        array["RSHN"]="點球大戰 - 第十四回合";
        array["RSHO"]="點球大戰 - 第十五回合";
        array["RPF"]="最後結束回合";
        array["RNC1"]="第一個角球";
        array["RNC2"]="第二個角球";
        array["RNC3"]="第三個角球";
        array["RNC4"]="第四個角球";
        array["RNC5"]="第五個角球";
        array["RNC6"]="第六個角球";
        array["RNC7"]="第七個角球";
        array["RNC8"]="第八個角球";
        array["RNC9"]="第九個角球";
        array["RNCA"]="第十個角球";
        array["RNCB"]="第十一個角球";
        array["RNCC"]="第十二個角球";
        array["RNCD"]="第十三個角球";
        array["RNCE"]="第十四個角球";
        array["RNCF"]="第十五個角球";
        array["RNCG"]="第十六個角球";
        array["RNCH"]="第十七個角球";
        array["RNCI"]="第十八個角球";
        array["RNCJ"]="第十九個角球";
        array["RNCK"]="第二十個角球";
        array["RNCL"]="第二一個角球";
        array["RNCM"]="第二二個角球";
        array["RNCN"]="第二三個角球";
        array["RNCO"]="第二四個角球";
        array["RNCP"]="第二五個角球";
        array["RNCQ"]="第二六個角球";
        array["RNCR"]="第二七個角球";
        array["RNCS"]="第二八個角球";
        array["RNCT"]="第二九個角球";
        array["RNCU"]="第三十個角球";
        array["RNBA"]="第一個罰牌";
        array["RNBB"]="第二個罰牌";
        array["RNBC"]="第三個罰牌";
        array["RNBD"]="第四個罰牌";
        array["RNBE"]="第五個罰牌";
        array["RNBF"]="第六個罰牌";
        array["RNBG"]="第七個罰牌";
        array["RNBH"]="第八個罰牌";
        array["RNBI"]="第九個罰牌";
        array["RNBJ"]="第十個罰牌";
        array["RNBK"]="第十一個罰牌";
        array["RNBL"]="第十二個罰牌";
        array["RNBM"]="第十三個罰牌";
        array["RNBN"]="第十四個罰牌";
        array["RNBO"]="第十五個罰牌";

        array["F01"] = "第1局";
        array["F02"] = "第2局";
        array["F03"] = "第3局";
        array["F04"] = "第4局";
        array["F05"] = "第5局";
        array["F06"] = "第6局";
        array["F07"] = "第7局";
        array["F08"] = "第8局";
        array["F09"] = "第9局";
        array["F10"] = "第10局";
        array["F11"] = "第11局";
        array["F12"] = "第12局";
        array["F13"] = "第13局";
        array["F14"] = "第14局";
        array["F15"] = "第15局";
        array["F16"] = "第16局";
        array["F17"] = "第17局";
        array["F18"] = "第18局";
        array["F19"] = "第19局";
        array["F20"] = "第20局";
        array["F21"] = "第21局";
        array["F22"] = "第22局";
        array["F23"] = "第23局";
        array["F24"] = "第24局";
        array["F25"] = "第25局";
        array["F26"] = "第26局";
        array["F27"] = "第27局";
        array["F28"] = "第28局";
        array["F29"] = "第29局";
        array["F30"] = "第30局";
        array["F31"] = "第31局";
        array["F32"] = "第32局";
        array["F33"] = "第33局";
        array["F34"] = "第34局";
        array["F35"] = "第35局";

        array["RFA01"] = "第一局";
        array["RFA02"] = "第二局";
        array["RFA03"] = "第三局";
        array["RFA04"] = "第四局";
        array["RFA05"] = "第五局";
        array["RFA06"] = "第六局";
        array["RFA07"] = "第七局";
        array["RFA08"] = "第八局";
        array["RFA09"] = "第九局";
        array["RFA10"] = "第十局";
        array["RFA11"] = "第十一局";
        array["RFA12"] = "第十二局";
        array["RFA13"] = "第十三局";

        array["RFB01"] = "第一局";
        array["RFB02"] = "第二局";
        array["RFB03"] = "第三局";
        array["RFB04"] = "第四局";
        array["RFB05"] = "第五局";
        array["RFB06"] = "第六局";
        array["RFB07"] = "第七局";
        array["RFB08"] = "第八局";
        array["RFB09"] = "第九局";
        array["RFB10"] = "第十局";
        array["RFB11"] = "第十一局";
        array["RFB12"] = "第十二局";
        array["RFB13"] = "第十三局";

        array["RFC01"] = "第一局";
        array["RFC02"] = "第二局";
        array["RFC03"] = "第三局";
        array["RFC04"] = "第四局";
        array["RFC05"] = "第五局";
        array["RFC06"] = "第六局";
        array["RFC07"] = "第七局";
        array["RFC08"] = "第八局";
        array["RFC09"] = "第九局";
        array["RFC10"] = "第十局";
        array["RFC11"] = "第十一局";
        array["RFC12"] = "第十二局";
        array["RFC13"] = "第十三局";
        array["RFC14"] = "第十四局";
        array["RFC15"] = "第十五局";
        array["RFC16"] = "第十六局";
        array["RFC17"] = "第十七局";
        array["RFC18"] = "第十八局";
        array["RFC19"] = "第十九局";
        array["RFC20"] = "第二十局";
        array["RFC21"] = "第二十一局";
        array["RFC22"] = "第二十二局";
        array["RFC23"] = "第二十三局";
        array["RFC24"] = "第二十四局";
        array["RFC25"] = "第二十五局";
        array["RFC26"] = "第二十六局";
        array["RFC27"] = "第二十七局";
        array["RFC28"] = "第二十八局";
        array["RFC29"] = "第二十九局";
        array["RFC30"] = "第三十局";
        array["RFC31"] = "第三十一局";
        array["RFC32"] = "第三十二局";
        array["RFC33"] = "第三十三局";
        array["RFC34"] = "第三十四局";
        array["RFC35"] = "第三十五局";
        array["RFC36"] = "第三十六局";
        array["RFC37"] = "第三十七局";
        array["RFC38"] = "第三十八局";
        array["RFC39"] = "第三十九局";
        array["RFC40"] = "第四十局";
        array["RFC41"] = "第四十一局";
        array["RFC42"] = "第四十二局";
        array["RFC43"] = "第四十三局";
        array["RFC44"] = "第四十四局";
        array["RFC45"] = "第四十五局";
        array["RFC46"] = "第四十六局";
        array["RFC47"] = "第四十七局";
        array["RFC48"] = "第四十八局";
        array["RFC49"] = "第四十九局";
        array["RFC50"] = "第五十局";

        array["RFD01"] = "第一局";
        array["RFD02"] = "第二局";
        array["RFD03"] = "第三局";
        array["RFD04"] = "第四局";
        array["RFD05"] = "第五局";
        array["RFD06"] = "第六局";
        array["RFD07"] = "第七局";
        array["RFD08"] = "第八局";
        array["RFD09"] = "第九局";
        array["RFD10"] = "第十局";
        array["RFD11"] = "第十一局";
        array["RFD12"] = "第十二局";
        array["RFD13"] = "第十三局";

        array["RFE01"] = "第一局";
        array["RFE02"] = "第二局";
        array["RFE03"] = "第三局";
        array["RFE04"] = "第四局";
        array["RFE05"] = "第五局";
        array["RFE06"] = "第六局";
        array["RFE07"] = "第七局";
        array["RFE08"] = "第八局";
        array["RFE09"] = "第九局";
        array["RFE10"] = "第十局";
        array["RFE11"] = "第十一局";
        array["RFE12"] = "第十二局";
        array["RFE13"] = "第十三局";
        array["RFE14"] = "第十四局";
        array["RFE15"] = "第十五局";
        array["RFE16"] = "第十六局";
        array["RFE17"] = "第十七局";
        array["RFE18"] = "第十八局";
        array["RFE19"] = "第十九局";
        array["RFE20"] = "第二十局";
        array["RFE21"] = "第二十一局";
        array["RFE22"] = "第二十二局";
        array["RFE23"] = "第二十三局";
        array["RFE24"] = "第二十四局";
        array["RFE25"] = "第二十五局";
        array["RFE26"] = "第二十六局";
        array["RFE27"] = "第二十七局";
        array["RFE28"] = "第二十八局";
        array["RFE29"] = "第二十九局";
        array["RFE30"] = "第三十局";
        array["RFE31"] = "第三十一局";
        array["RFE32"] = "第三十二局";
        array["RFE33"] = "第三十三局";
        array["RFE34"] = "第三十四局";
        array["RFE35"] = "第三十五局";
        array["RFE36"] = "第三十六局";
        array["RFE37"] = "第三十七局";
        array["RFE38"] = "第三十八局";
        array["RFE39"] = "第三十九局";
        array["RFE40"] = "第四十局";
        array["RFE41"] = "第四十一局";
        array["RFE42"] = "第四十二局";
        array["RFE43"] = "第四十三局";
        array["RFE44"] = "第四十四局";
        array["RFE45"] = "第四十五局";
        array["RFE46"] = "第四十六局";
        array["RFE47"] = "第四十七局";
        array["RFE48"] = "第四十八局";
        array["RFE49"] = "第四十九局";
        array["RFE50"] = "第五十局";

        // basketball
        array["str_BK_0"] ="第一節";
        array["str_BK_1"] ="第二節";
        array["str_BK_2"] ="第三節";
        array["str_BK_3"] ="第四節";
        array["str_BK_4"] ="上半場";
        array["str_BK_5"] ="下半場";
        array["str_BK_6"] ="加時";
        array["str_BK_7"] ="總計";

        // tennis game
        array["str_TN_game_1"] = "第一盤";
        array["str_TN_game_2"] = "第二盤";
        array["str_TN_game_3"] = "第三盤";
        array["str_TN_game_4"] = "第四盤";
        array["str_TN_game_5"] = "第五盤";

        // tennis overall result
        array["str_TN_0"] = "第一盤";
        array["str_TN_1"] = "第二盤";
        array["str_TN_2"] = "第三盤";
        array["str_TN_3"] = "第四盤";
        array["str_TN_4"] = "第五盤";
        array["str_TN_5"] = "讓局";
        array["str_TN_6"] = "球員局數: 大 / 小";
        array["str_TN_7"] = "完賽";

        // volleyball
        array["str_VB_0"] = "第一局";
        array["str_VB_1"] = "第二局";
        array["str_VB_2"] = "第三局";
        array["str_VB_3"] = "第四局";
        array["str_VB_4"] = "第五局";
        array["str_VB_5"] = "第六局";
        array["str_VB_6"] = "第七局";
        array["str_VB_7"] = "讓分";
        array["str_VB_8"] = "完賽"

        // badminton tabletennis
        array["str_BMTT_0"] = "第一局";
        array["str_BMTT_1"] = "第二局";
        array["str_BMTT_2"] = "第三局";
        array["str_BMTT_3"] = "第四局";
        array["str_BMTT_4"] = "第五局";
        array["str_BMTT_5"] = "第六局";
        array["str_BMTT_6"] = "第七局";
        array["str_BMTT_7"] = "讓分";
        array["str_BMTT_8"] = "球員得分: 大 / 小";
        array["str_BMTT_9"] = "完賽"

        //baseball
        array["str_BS_Y"] = "是";
        array["str_BS_N"] = "不是";
        array["str_BS_0"] = "首五局";
        array["str_BS_1"] = "全場";

        //shooker
        array["str_SK_0"] = "第1 - 5局";
        array["str_SK_1"] = "第6 - 8局";
        array["str_SK_2"] = "第10 - 14局";
        array["str_SK_3"] = "第15 - 17局";
        array["str_SK_4"] = "第19 - 23局";
        array["str_SK_5"] = "第24 - 26局";
        array["str_SK_6"] = "全場";
        // totalBets result detail end

        //過濾器
		array["str_ALL"] = "所有球類";
		array["str_FT"] = "足球";
		array["str_BK"] = "籃球 / 美式足球";
        array["str_ES"] = "電子競技";
		array["str_TN"] = "網球";
		array["str_VB"] = "排球";
		array["str_BM"] = "羽毛球";
		array["str_TT"] = "乒乓球";
		array["str_BS"] = "棒球";
		array["str_SK"] = "斯諾克/台球";
		array["str_OP"] = "其他球類";
		array["str_SFS"] = "特殊冠軍";
        array["str_FS"] = "冠軍";

        array["str_wmc_ALL"] = array["str_ALL"];
        array["str_wmc_FT"] = array["str_FT"];
        array["str_wmc_BK"] = array["str_BK"];
        array["str_wmc_ES"] = array["str_ES"];
        array["str_wmc_TN"] = array["str_TN"];
        array["str_wmc_VB"] = array["str_VB"];
        array["str_wmc_BM"] = array["str_BM"];
        array["str_wmc_TT"] = array["str_TT"];
        array["str_wmc_BS"] = array["str_BS"];
        array["str_wmc_SK"] = array["str_SK"];
        array["str_wmc_OP"] = array["str_OP"];
        array["str_wmc_SFS"] =array["str_SFS"];
        array["str_wmc_FS"] = array["str_FS"];

        array["btns_gtype"] = "球類";
		array["btns_stake"] = "下注金額";
		array["btns_view"] = "觀看";
		array["btns_downline"] = "下線";
		array["btns_league"] = "聯盟";
		array["btns_datestarted"] = "日期";
		array["btns_market"] = "盤口類型";
		array["btns_eventdate"] = "賽事日期";
		array["btns_class"] = "冠軍類別";
		array["btns_dateoutright"] = "日期";
		array["btns_date"] = "日期";
		array["btns_dateresult"] = "日期";
		array["btns_event"] = "賽事";
		array["btns_bettype"] = "玩法";
        array["btns_site"] = "網站";

        array["str_market_ALL"] = "所有盤口";
        array["str_market_rb"] = "滾球";
        array["str_market_ft"] = "今日";
        array["str_market_fu"] = "早盤";

        array["str_wmc_market_ALL"] =array["str_market_ALL"];
        array["str_wmc_market_rb"] = array["str_market_rb"];
        array["str_wmc_market_ft"] = array["str_market_ft"];
        array["str_wmc_market_fu"] = array["str_market_fu"];

        array["filter_view_full"] = "顯示所有";
        array["filter_view_com"] = "公司佔成" ;
        array["filter_view_c"] = "股東佔成" ;
        array["filter_view_s"] = "總代理佔成" ;
        array["filter_view_a"] = "代理商佔成" ;
        array["filter_view_csa"] = "股東 + 總代理 + 代理商佔成" ;
        array["filter_view_cs"] = "股東 + 總代理佔成" ;
        array["filter_view_sa"] = "總代理 + 代理商佔成" ;
        array["filter_view_my"] = "我的佔成";

        array["filter_date_yesterday"] = "昨日";
        array["filter_date_today"] = "今日";
        array["filter_date_future"] = "未來";
        array["filter_date_all"] = "所有";
        array["filter_date_show"] = "日期";

        array["filter_downline_show"] = "下線";
        array["filter_league_show"] = "聯盟";
        array["filter_market_show"] = "盤口類型";

        array["filter_err_downline_max"] = "您最多可選擇*LIMITCOUNT*個帳號";

        array["filter_market_all"] = "所有";
        array["filter_market_rb"] = "滾球";
        array["filter_market_pl"] = "單式";

        array["filter_more"] = "大於";
		array["filter_less"] = "小於";
		array["filter_same"] = "等於";

        array["str_day"] = "日";

        array["CancelType0"]  = "正式比分";
        array["CancelType-1"]  = "賽事取消";
        array["CancelType-2"]  = "隊名錯誤";
        array["CancelType-3"]  = "賽事延賽";
        array["CancelType-4"]  = "賽事時間不正規";
        array["CancelType-5"]  = "賽事腰斬";
        array["CancelType-6"]  = "球員棄權";
        array["CancelType-7"]  = "主客場錯誤";
        array["CancelType-8"]  = "聯賽名稱錯誤";
        array["CancelType-9"]  = "賽事無PK/ 加時";
        array["CancelType-10"] = "賽程錯誤";
        array["CancelType-11"] = "不顯示賽程";
        array["CancelType-12"] = "取消";
        array["CancelType-13"] = "賽事腰斬";
        array["CancelType-14"] = "無局數";
        array["CancelType_SK-14"] = "無局數";

        //Ricky 2018-03-06 PJB-188 CRM-249網球下一局獨贏
        array["title_RFA01_0_TN"] = "獨贏 - 第一盤 第一局";
        array["title_RFA02_0_TN"] = "獨贏 - 第一盤 第二局";
        array["title_RFA03_0_TN"] = "獨贏 - 第一盤 第三局";
        array["title_RFA04_0_TN"] = "獨贏 - 第一盤 第四局";
        array["title_RFA05_0_TN"] = "獨贏 - 第一盤 第五局";
        array["title_RFA06_0_TN"] = "獨贏 - 第一盤 第六局";
        array["title_RFA07_0_TN"] = "獨贏 - 第一盤 第七局";
        array["title_RFA08_0_TN"] = "獨贏 - 第一盤 第八局";
        array["title_RFA09_0_TN"] = "獨贏 - 第一盤 第九局";
        array["title_RFA10_0_TN"] = "獨贏 - 第一盤 第十局";
        array["title_RFA11_0_TN"] = "獨贏 - 第一盤 第十一局";
        array["title_RFA12_0_TN"] = "獨贏 - 第一盤 第十二局";
        array["title_RFA13_0_TN"] = "獨贏 - 第一盤 第十三局";
        array["title_RFB01_0_TN"] = "獨贏 - 第二盤 第一局";
        array["title_RFB02_0_TN"] = "獨贏 - 第二盤 第二局";
        array["title_RFB03_0_TN"] = "獨贏 - 第二盤 第三局";
        array["title_RFB04_0_TN"] = "獨贏 - 第二盤 第四局";
        array["title_RFB05_0_TN"] = "獨贏 - 第二盤 第五局";
        array["title_RFB06_0_TN"] = "獨贏 - 第二盤 第六局";
        array["title_RFB07_0_TN"] = "獨贏 - 第二盤 第七局";
        array["title_RFB08_0_TN"] = "獨贏 - 第二盤 第八局";
        array["title_RFB09_0_TN"] = "獨贏 - 第二盤 第九局";
        array["title_RFB10_0_TN"] = "獨贏 - 第二盤 第十局";
        array["title_RFB11_0_TN"] = "獨贏 - 第二盤 第十一局";
        array["title_RFB12_0_TN"] = "獨贏 - 第二盤 第十二局";
        array["title_RFB13_0_TN"] = "獨贏 - 第二盤 第十三局";
        array["title_RFC01_0_TN"] = "獨贏 - 第三盤 第一局";
        array["title_RFC02_0_TN"] = "獨贏 - 第三盤 第二局";
        array["title_RFC03_0_TN"] = "獨贏 - 第三盤 第三局";
        array["title_RFC04_0_TN"] = "獨贏 - 第三盤 第四局";
        array["title_RFC05_0_TN"] = "獨贏 - 第三盤 第五局";
        array["title_RFC06_0_TN"] = "獨贏 - 第三盤 第六局";
        array["title_RFC07_0_TN"] = "獨贏 - 第三盤 第七局";
        array["title_RFC08_0_TN"] = "獨贏 - 第三盤 第八局";
        array["title_RFC09_0_TN"] = "獨贏 - 第三盤 第九局";
        array["title_RFC10_0_TN"] = "獨贏 - 第三盤 第十局";
        array["title_RFC11_0_TN"] = "獨贏 - 第三盤 第十一局";
        array["title_RFC12_0_TN"] = "獨贏 - 第三盤 第十二局";
        array["title_RFC13_0_TN"] = "獨贏 - 第三盤 第十三局";
        array["title_RFC14_0_TN"] = "獨贏 - 第三盤 第十四局";
        array["title_RFC15_0_TN"] = "獨贏 - 第三盤 第十五局";
        array["title_RFC16_0_TN"] = "獨贏 - 第三盤 第十六局";
        array["title_RFC17_0_TN"] = "獨贏 - 第三盤 第十七局";
        array["title_RFC18_0_TN"] = "獨贏 - 第三盤 第十八局";
        array["title_RFC19_0_TN"] = "獨贏 - 第三盤 第十九局";
        array["title_RFC20_0_TN"] = "獨贏 - 第三盤 第二十局";
        array["title_RFC21_0_TN"] = "獨贏 - 第三盤 第二十一局";
        array["title_RFC22_0_TN"] = "獨贏 - 第三盤 第二十二局";
        array["title_RFC23_0_TN"] = "獨贏 - 第三盤 第二十三局";
        array["title_RFC24_0_TN"] = "獨贏 - 第三盤 第二十四局";
        array["title_RFC25_0_TN"] = "獨贏 - 第三盤 第二十五局";
        array["title_RFC26_0_TN"] = "獨贏 - 第三盤 第二十六局";
        array["title_RFC27_0_TN"] = "獨贏 - 第三盤 第二十七局";
        array["title_RFC28_0_TN"] = "獨贏 - 第三盤 第二十八局";
        array["title_RFC29_0_TN"] = "獨贏 - 第三盤 第二十九局";
        array["title_RFC30_0_TN"] = "獨贏 - 第三盤 第三十局";
        array["title_RFC31_0_TN"] = "獨贏 - 第三盤 第三十一局";
        array["title_RFC32_0_TN"] = "獨贏 - 第三盤 第三十二局";
        array["title_RFC33_0_TN"] = "獨贏 - 第三盤 第三十三局";
        array["title_RFC34_0_TN"] = "獨贏 - 第三盤 第三十四局";
        array["title_RFC35_0_TN"] = "獨贏 - 第三盤 第三十五局";
        array["title_RFC36_0_TN"] = "獨贏 - 第三盤 第三十六局";
        array["title_RFC37_0_TN"] = "獨贏 - 第三盤 第三十七局";
        array["title_RFC38_0_TN"] = "獨贏 - 第三盤 第三十八局";
        array["title_RFC39_0_TN"] = "獨贏 - 第三盤 第三十九局";
        array["title_RFC40_0_TN"] = "獨贏 - 第三盤 第四十局";
        array["title_RFC41_0_TN"] = "獨贏 - 第三盤 第四十一局";
        array["title_RFC42_0_TN"] = "獨贏 - 第三盤 第四十二局";
        array["title_RFC43_0_TN"] = "獨贏 - 第三盤 第四十三局";
        array["title_RFC44_0_TN"] = "獨贏 - 第三盤 第四十四局";
        array["title_RFC45_0_TN"] = "獨贏 - 第三盤 第四十五局";
        array["title_RFC46_0_TN"] = "獨贏 - 第三盤 第四十六局";
        array["title_RFC47_0_TN"] = "獨贏 - 第三盤 第四十七局";
        array["title_RFC48_0_TN"] = "獨贏 - 第三盤 第四十八局";
        array["title_RFC49_0_TN"] = "獨贏 - 第三盤 第四十九局";
        array["title_RFC50_0_TN"] = "獨贏 - 第三盤 第五十局";
        array["title_RFD01_0_TN"] = "獨贏 - 第四盤 第一局";
        array["title_RFD02_0_TN"] = "獨贏 - 第四盤 第二局";
        array["title_RFD03_0_TN"] = "獨贏 - 第四盤 第三局";
        array["title_RFD04_0_TN"] = "獨贏 - 第四盤 第四局";
        array["title_RFD05_0_TN"] = "獨贏 - 第四盤 第五局";
        array["title_RFD06_0_TN"] = "獨贏 - 第四盤 第六局";
        array["title_RFD07_0_TN"] = "獨贏 - 第四盤 第七局";
        array["title_RFD08_0_TN"] = "獨贏 - 第四盤 第八局";
        array["title_RFD09_0_TN"] = "獨贏 - 第四盤 第九局";
        array["title_RFD10_0_TN"] = "獨贏 - 第四盤 第十局";
        array["title_RFD11_0_TN"] = "獨贏 - 第四盤 第十一局";
        array["title_RFD12_0_TN"] = "獨贏 - 第四盤 第十二局";
        array["title_RFD13_0_TN"] = "獨贏 - 第四盤 第十三局";
        array["title_RFE01_0_TN"] = "獨贏 - 第五盤 第一局";
        array["title_RFE02_0_TN"] = "獨贏 - 第五盤 第二局";
        array["title_RFE03_0_TN"] = "獨贏 - 第五盤 第三局";
        array["title_RFE04_0_TN"] = "獨贏 - 第五盤 第四局";
        array["title_RFE05_0_TN"] = "獨贏 - 第五盤 第五局";
        array["title_RFE06_0_TN"] = "獨贏 - 第五盤 第六局";
        array["title_RFE07_0_TN"] = "獨贏 - 第五盤 第七局";
        array["title_RFE08_0_TN"] = "獨贏 - 第五盤 第八局";
        array["title_RFE09_0_TN"] = "獨贏 - 第五盤 第九局";
        array["title_RFE10_0_TN"] = "獨贏 - 第五盤 第十局";
        array["title_RFE11_0_TN"] = "獨贏 - 第五盤 第十一局";
        array["title_RFE12_0_TN"] = "獨贏 - 第五盤 第十二局";
        array["title_RFE13_0_TN"] = "獨贏 - 第五盤 第十三局";
        array["title_RFE14_0_TN"] = "獨贏 - 第五盤 第十四局";
        array["title_RFE15_0_TN"] = "獨贏 - 第五盤 第十五局";
        array["title_RFE16_0_TN"] = "獨贏 - 第五盤 第十六局";
        array["title_RFE17_0_TN"] = "獨贏 - 第五盤 第十七局";
        array["title_RFE18_0_TN"] = "獨贏 - 第五盤 第十八局";
        array["title_RFE19_0_TN"] = "獨贏 - 第五盤 第十九局";
        array["title_RFE20_0_TN"] = "獨贏 - 第五盤 第二十局";
        array["title_RFE21_0_TN"] = "獨贏 - 第五盤 第二十一局";
        array["title_RFE22_0_TN"] = "獨贏 - 第五盤 第二十二局";
        array["title_RFE23_0_TN"] = "獨贏 - 第五盤 第二十三局";
        array["title_RFE24_0_TN"] = "獨贏 - 第五盤 第二十四局";
        array["title_RFE25_0_TN"] = "獨贏 - 第五盤 第二十五局";
        array["title_RFE26_0_TN"] = "獨贏 - 第五盤 第二十六局";
        array["title_RFE27_0_TN"] = "獨贏 - 第五盤 第二十七局";
        array["title_RFE28_0_TN"] = "獨贏 - 第五盤 第二十八局";
        array["title_RFE29_0_TN"] = "獨贏 - 第五盤 第二十九局";
        array["title_RFE30_0_TN"] = "獨贏 - 第五盤 第三十局";
        array["title_RFE31_0_TN"] = "獨贏 - 第五盤 第三十一局";
        array["title_RFE32_0_TN"] = "獨贏 - 第五盤 第三十二局";
        array["title_RFE33_0_TN"] = "獨贏 - 第五盤 第三十三局";
        array["title_RFE34_0_TN"] = "獨贏 - 第五盤 第三十四局";
        array["title_RFE35_0_TN"] = "獨贏 - 第五盤 第三十五局";
        array["title_RFE36_0_TN"] = "獨贏 - 第五盤 第三十六局";
        array["title_RFE37_0_TN"] = "獨贏 - 第五盤 第三十七局";
        array["title_RFE38_0_TN"] = "獨贏 - 第五盤 第三十八局";
        array["title_RFE39_0_TN"] = "獨贏 - 第五盤 第三十九局";
        array["title_RFE40_0_TN"] = "獨贏 - 第五盤 第四十局";
        array["title_RFE41_0_TN"] = "獨贏 - 第五盤 第四十一局";
        array["title_RFE42_0_TN"] = "獨贏 - 第五盤 第四十二局";
        array["title_RFE43_0_TN"] = "獨贏 - 第五盤 第四十三局";
        array["title_RFE44_0_TN"] = "獨贏 - 第五盤 第四十四局";
        array["title_RFE45_0_TN"] = "獨贏 - 第五盤 第四十五局";
        array["title_RFE46_0_TN"] = "獨贏 - 第五盤 第四十六局";
        array["title_RFE47_0_TN"] = "獨贏 - 第五盤 第四十七局";
        array["title_RFE48_0_TN"] = "獨贏 - 第五盤 第四十八局";
        array["title_RFE49_0_TN"] = "獨贏 - 第五盤 第四十九局";
        array["title_RFE50_0_TN"] = "獨贏 - 第五盤 第五十局";

        array["HT"] = "半場";
        array["1H"] = "上半場";
        array["2H"] = "下半場";
        array["BK_HT"] = "上半場";
        array["BK_H2"] = "下半場";
        array["BK_Q1"] = "第一節";
        array["BK_Q2"] = "第二節";
        array["BK_Q3"] = "第三節";
        array["BK_Q4"] = "第四節";
        array["BK_OT"] = "加時";
        array["BK_half_time"] = "半場";

        array["BK_HT_allbet"] = "上半場";
        array["BK_H2_allbet"] = "下半場";
        array["BK_Q1_allbet"] = "第一節";
        array["BK_Q2_allbet"] = "第二節";
        array["BK_Q3_allbet"] = "第三節";
        array["BK_Q4_allbet"] = "第四節";
        array["BK_OT_allbet"] = "加時";
        array["BK_half_time_allbet"] = "半場";

        array["Best_of_3"] = "三盤兩勝";
        array["Best_of_5"] = "五盤三勝";
        array["Best_of_7"] = "七盤四勝";
        array["Best_of_12"] = "十二盤制";

        array["midfield"] = "中";
        array["live"] = "滾球";
        array["ES_Match"] = "";
		array["ES_Specials"] = "第*TYPE*局 - ";
		array["ES_M10"] = "第*TYPE*局 選陣容 - 第9分59秒 - ";
		array["ES_M20"] = "第*TYPE*局 第10分 - 第19分59秒 - ";
		array["ES_HT"] = "第*TYPE*局 上半場 - ";
		array["ES_1"] = "";
		array["ES_2"] = "持續時間";
		array["ES_3"] = "擊殺數";
		array["ES_4"] = "*TEAM_H* 擊殺數";
		array["ES_5"] = "*TEAM_C* 擊殺數";
		array["ES_6"] = "防禦塔";
		array["ES_7"] = "*TEAM_H* 防禦塔";
		array["ES_8"] = "*TEAM_C* 防禦塔";
		array["ES_9"] = "元素巨龍";
		array["ES_10"] = "納什男爵";
		array["ES_11"] = "水晶兵營";
		array["ES_12"] = "肉山";
		array["ES_13"] = "兵營";
		array["ES_14"] = "*TEAM_H* 回合";
		array["ES_15"] = "*TEAM_C* 回合";
		array["ES_GameNumber"] = "第*GAME_NUMBER*局";

        return array;
    }

    _self.get=function(_key){
        return LangxAry[_key];
    }

}

function LS_cn() {
    var _self = this;
    var parentClass;
    var LangxAry;

    _self.init = function () {
        LangxAry = _self.set();
    }

    _self.set = function () {
        var array = new Object();
        array["loading_txt"] = "加载中";
        array["page_dashboard"] = "首页";
        array["page_report"] = "报表";
        array["page_setting"] = "系统设置";
        array["page_curl"] = "采集设置";
        array["page_data"] = "数据管理";
        array["page_totalbet"] = "即时注单";
        array["page_match"] = "操盘";
        array["page_bet"] = "注单管理";
        array["page_set"] = "有结果";
        array["page_un"] = "未有结果";
        array["page_summary"] = "赛事结果概要";
        array["page_period"] = "月帐期数表";//Accounting Period
        array["page_exchange"] = "汇率";
        array["page_cancel"] = "取消单";
        array["page_cancel"] = "取消单";
        array["page_quicksearch"] = "搜帐号";
        array["page_onlinemem"] = "线上会员";
        array["page_onlineag"] = "线上代理";
        array["page_onlinesu"] = "线上总代";
        array["page_onlineco"] = "线上股东";
        array["page_onlined0"] = "线上分公司";
        array["page_onlinead"] = "线上公司";
        array["page_mysetting"] = "我的设定";
        array["page_myactivities"] = "我的活动记录";
        array["page_feature"] = "特色";
        array["page_requirements"] = "系统需求";
        array["page_newurl"] = "最新网址";
        array["page_contactus"] = "联系我们";
        array["page_pwd_recovery"] = "密码恢复";
        array["page_chg_pwd_inside"] = "更改密码";
	    array["page_problem_accounts"] = "问题帐号";
        array["page_announcement"] = "公告";
        array["page_important_announcement"] = "新增重要公告";
        array["page_personal_announcement"] = "新增股东/代理公告";
        array["page_proNews_announcement"] = "新增私人消息";
        array["page_proChat_announcement"] = "新增私人会话";
        array["page_edit_important_announcement"] = "修改重要公告";
        array["page_edit_personal_announcement"] = "修改股东/代理公告";
        array["page_edit_proNews_announcement"] = "修改私人消息";
        array["page_edit_proChat_announcement"] = "修改私人会话";
        array["page_edit_ok"] = "修改成功";
        array["page_ann_one"] = "请选择至少一条公告";
        array["add_success"] = "新增成功";
        array["dele_success"] = "删除成功";
        array["page_account"] = "帐户管理";//A/C Mgmt
        array["page_sub"] = "子帐号";
        array["page_ad_add"] = "新增公司";
        array["page_d0_add"] = "新增分公司";
        array["page_co_add"] = "新增股东";
        array["page_su_add"] = "新增总代理";
        array["page_ag_add"] = "新增代理";
        array["page_mem_add"] = "新增会员";
        array["page_sub_add"] = "新增子帐号";//New Sub Agent
        array["page_log"] = "日志管理";

        array["str_copied"] = "資料已复制";

        array["page_overview"] = "总览";
        array["page_INPLAY"] = "滚球";
        array["page_TODAY"] = "今日";
        array["page_EARLY"] = "早盘";
        array["page_STARTED"] = "已开赛";
        array["page_PARLAY"] = "过关";
        array["page_OUTRIGHT"] = "冠军";
        array["page_RESULTS"] = "赛果";
        array["page_MATCH"] = "赛程";
        array["page_SCORE"] = "比分";

        //new_url Start
        array["newcro666"] = "代理端";
        array["phcro666"] = "会员端";
        array["newagcro666"] = "管理端";//New Manager Site
        array["agphonecro666"] = "手机管理端";
        array["acc"] = "旧帐";
        //new_url End
        //恢复密码
        array["0X001"] = "参数错误";
        array["4X001"] = "IP不合法";
        array["4X002"] = "帐号停用";
        array["4X003"] = "帐号禁止登入";
        array["4X004"] = "密码错误多次被锁";
        array["4X005"] = "帐密不正确";
        array["4X006"] = "三分钟后再试";
        array["4X007"] = "未设定email";
        array["4X025"] = "此功能暂时已被禁用，请联系您的上线。";
        array["4X026"] = "验证码发送次数过多，系统暂时不能接受申请，请检查您的资料是否正确。";
        array["4X027"] = "连不到MailServer";
        array["4X028"] = "MailServer发送验证码失败";
        array["4O005"] = "验证码已发送到您的电子邮件";
        array["4O006"] = "已成功注册";
        array["get_mail_canceal"] = "请输入有效的电子邮件";//Please enter a valid email address
        array["input_verify_cancel"] = "取消密码恢复？";
        array["remove_email"] = "密码恢复电子邮件已被删除";
        array["remove_email_message"] = "删除密码恢复电邮？";

        array["enable_Y"] = "启用";
        array["enable_N"] = "停用";
        array["enable_S"] = "只能看帐";
        array["enable_F"] = "禁止登入";
        array["input_acc"] = "请输入帐号";//Enter User Code

        //額度模式
        array["pay_type_0"] = "自动恢复";
        array["pay_type_1"] = "余额浮动";
        array["long_pay_type_0"] = "自动恢复";
        array["long_pay_type_1"] = "余额浮动";

        array["str_ad"] = "公司";
        array["str_d0"] = "分公司";
        array["str_co"] = "股东";//Corprator
        array["str_su"] = "总代理";//Agency
        array["str_ag"] = "代理商";
        array["str_mem"] = "会员";

        array["str_ad_sub"] = "公司 子帐号";
        array["str_d0_sub"] = "分公司 子帐号";
        array["str_co_sub"] = "股东 子帐号";//Corprator
        array["str_su_sub"] = "总代理 子帐号";//Agency
        array["str_ag_sub"] = "代理商 子帐号";


        array["str_d0s"] = "分公司";
        array["str_cos"] = "股东";//Corprator
        array["str_sus"] = "总代";//Agency
        array["str_ags"] = "代理";//Agents
        array["str_mems"] = "会员";//Members

        //帐户新增修改
        array["max_limit_head"] = "最高: "//最大限额字串 Max: RMB 1,100,000
        array["empty_user"] = "此处不能留空"; //帐号请务必输入
        array["empty_alias"] = "此处不能留空"; //名称请务必输入
        array["empty_passwd"] = "此处不能留空"; //请输入新密码
        array["empty_confirm"] = "此处不能留空"; //请输入新密码
        array["empty_credit"] = "此处不能留空"; //总信用额度请务必输入
        array["empty_safe"] = "此处不能留空";
        array["empty_content"] = "此处不能留空";
        array["empty_enddate"] = "此处不能留空";
        array["empty_enddate1"] = "此处日期格式不正确";
        array["str_confirm_add_su"] = "是否确定写入总代理"; //是否确定写入总代理
        array["str_confirm_add_ag"] = "是否确定写入代理商";//是否确定写入代理商
        array["str_confirm_add_mem"] = "是否确定写入会员资料";//是否确定写入会员资料
        array["credit_over"] = "您输入的额度大于剩余额度，请重新输入.";
        array["user_limit"] = "帐号至少四个字元长.";
        array["user_manage"] = "你没有勾选 ‘管理帐号’，请勾选其中一个或是全选。";
        array["cash_sw_in_edit_user"] = "因未知原因，系统暂时停止修改额度功能，请稍后再试。";
        array["cash_sw_in_add_user"] = "功能未开放使用，我们将在短期内完成测试并开放功能。";

        array["add_account_success"] = "新增帐户成功";
        array["copy_success"] = "登入帐号和密码已复制到剪贴板";
        array["copy_user"] = "帐号：";
        array["copy_pwd"] = "密码：";
        array["winloss_percent"] = "%";
        //array["su_ag_winloss_error"] = "股东及总代理及代理商的成数总和须在 5 - 8 成内 , 请重新设定 !!";//股东及总代理及代理商的成数总和须在 5 - 8 成内 , 请重新设定 !!
        array["su_ag_winloss_error"] = "成数总和必须要xx% - yy%内， 请重新设定。";
        array["su_ag_winloss8_error"] = "成数总和必须要xx％， 请重新设定。";
        array["status_update"] = "更改帐户状态成功";
        array["hide_user_update"] = "更改隐单账号成功";
        array["setip_update"] = "更改绑定ip成功";
        array["seturl_update"] = "更改登陆网址成功";
        array["credit_update"] = "更改信用额度成功";
        array["account_copy"] = "复制";

        //子帐号
        array["max_sub3"] = "已超过可使用子帐户限制, 无法新增子帐户。";
        array["sub_mlimit"] = "您最多可选";//You may select maximum of
        array["sub_mlimit2"] = "个帐号。";//accounts at a time.
        array["listsub_safe"] = "安全代码";
        array["listsub_safe_ag"] = "登入帐号";


        //修改成数
        array["str_possess_down"] = "最低可设";
        array["str_possess_up"] = "最高可设";
        array["str_possess_allowed"] = "可设";//Allowed:
        array["RMB"] = "人民币";

        //密码强度
        array["pwd_Very Weak"] = "非常弱";
        array["pwd_Weak"] = "弱";
        array["pwd_Fair"] = "一般";
        array["pwd_Good"] = "好";
        array["pwd_Strong"] = "强";

        //破解时间
        array["pwd_break_Seconds"] = "秒";
        array["pwd_break_Minutes"] = "分钟";
        array["pwd_break_Hours"] = "小时";
        array["pwd_break_Days"] = "天";
        array["pwd_break_Months"] = "个月";
        array["pwd_break_Years"] = "年";
        array["pwd_break_Centuries"] = "世纪";

        array["pwd_TRILLION"] = "兆";
        array["pwd_100_BILLION"] = "千亿";
        array["pwd_10_BILLION"] = "百亿";
        array["pwd_BILLION"] = "十亿";
        array["pwd_100_MILLION"] = "亿";
        array["pwd_10_MILLION"] = "千万";
        array["pwd_MILLION"] = "百万";
        array["pwd_100_THOUSAND"] = "十万";
        array["pwd_10_THOUSAND"] = "万";
        array["pwd_THOUSAND"] = "千";
        array["pwd_HUNDRED"] = "百";

        //信用额度
        array["str_maxcre"] = "总信用额度仅能输入数字";
        array["str_maxcre_zero"] = "信用额度不可为0";//0 is not a valid value.
        array["str_maxcre_zero1"] = "请输入大于 0 的信用额度";//Credit limit should be greater than 0.
        array["str_edit_credit_confirm"] = "是否确定修改信用额度?";//Make sure to modify the credit limit?

        // array["empty_credit"] = "总信用额度请务必输入"; //总信用额度请务必输入
        array["empty_credit"] = "此处不能留空";
        array["str_min_m"] = "独赢, 滚球独赢 单注最低限额,请输入大于0的数字";
        array["str_min_r"] = "让球, 大 / 小, 单 / 双 单注最低限额,请输入大于0的输入数字";
        array["str_min_re"] = "滚球让球, 滚球大 / 小, 滚球单 / 双 单注最低限额,请输入大于0的输入数字";
        array["str_min_dt"] = "其他玩法 单注最低限额,请输入大于0的输入数字";
        array["str_min_rdt"] = "滚球其他玩法 单注最低限额,请输入大于0的输入数字";
        array["str_min_fs"] = "冠军单注最低限额,请输入大于0的输入数字";

        array["str_max_m"] = "独赢, 滚球独赢 单注最高派彩,请输入大于0的数字";
        array["str_max_r"] = "让球, 大 / 小, 单 / 双 单注最高派彩,请输入大于0的输入数字";
        array["str_max_re"] = "滚球让球, 滚球大 / 小, 滚球单 / 双 单注最高派彩,请输入大于0的输入数字";
        array["str_max_dt"] = "其他玩法 单注最高派彩,请输入大于0的输入数字";
        array["str_max_rdt"] = "滚球其他玩法 单注最高派彩,请输入大于0的输入数字";
        array["str_max_fs"] = "冠军单注最高派彩,请输入大于0的输入数字";

        array["sub_selMax"] = "可管理帐号的权限已达最大使用数。请联络您的上线移除已暂停使用的帐号";//You have exceeded the number of ‘Managed Accounts’ allowed.  Please contact your upline to remove inactive accounts.
        //快速搜寻
        //2019-03-28 Ricky 248.登一帐号-Quick Search快速搜寻-sub account，level(层级)帮改为SMA，目前秀错字Corprator
        //array["layer_type_name_corprator"] = "Corprator";
        array["layer_type_name_corprator"] = "股东";//SMA
        array["layer_type_name_super_agents"] = "总代理";
        array["layer_type_name_agents"] = "代理商";
        array["layer_type_name_members"] = "会员";
        array["enable_str_Active"] = "启用";
        array["enable_str_Suspended"] = "禁止登入";
        array["enable_str_ViewOnly"] = "只能看帐";
        array["enable_str_Inactive"] = "停用";
        array["layer_type_name_subAccount"] = "子帐号";//Sub Account
        //我的纪录
        // array["myAct_str_Create_Account"] = "启用";
        array["myAct_str_Create_Account"] = "新增帐号";
        array["myAct_str_Password_Reset"] = "更改密码";
        // array["myAct_str_Change_Credits"] = "修改额度"//Change Credits
        array["myAct_str_Change_Credits"] = "更改額度"
        array["myAct_str_super_admin"] = "超帐";//Super Admin
        array["myAct_str_corprator"] = "股东";//Corprator
        array["myAct_str_super_agents"] = " 总代理商";
        array["myAct_str_agents"] = "代理商";
        array["myAct_str_mem"] = "会员";

        //帐户管理
        array["acc_ad"]     = "公司";
        array["acc_d0"]     = "分公司";
        array["acc_co"]     = "股东";
        array["acc_su"]     = "总代理";
        array["acc_ag"]     = "代理商";
        array["acc_mem"]    = "会员";
        array["acc_sub"]    = "子帐号";
        // array["acc_str_credit"] = "修改额度";//Change Credits
        array["acc_str_credit"] = "更改額度";
        array["acc_str_enable"] = "更改帐户状态";//Change Status
        array["acc_str_add"] = "新增帐号";//Account created
        array["acc_str_beadd"] = "此帐号被谁新增";//Account Update By
        array["acc_str_password"] = "更改密码";//Change Password

        //密码恢复
        array["recv_enable"] = "启用";
        array["recv_disable"] = "禁用";

        array['upd_success'] = "更改成功";//更改成功

        // dashboard
        array["dash_D"] = "第";
        array["dash_Ds"] = "天";
        array["dash_PR"] = "占成收入";
        array["dash_MW"] = "投注人数";
        array["dash_TO"] = "实货量";
        array["dash_WL"] = "赢 / 输";

        // totalBets result detail start
        array["PGF"]="最先进球";
        array["OSF"]="最先越位";
        array["STF"]="最先替补球员";
        array["CNF"]="第一颗角球";
        array["CDF"]="第一张卡";
        array["RCF"]="会进球";
        array["YCF"]="第一张黄卡";
        array["GAF"]="有失球";
        array["PGL"]="最后进球";
        array["OSL"]="最后越位";
        array["STL"]="最后替补球员";
        array["CNL"]="最后一颗角球";
        array["CDL"]="最后一张卡";
        array["RCL"]="不会进球";
        array["YCL"]="最后一张黄卡";
        array["GAL"]="没有失球";
        array["PG"]="最先/最后进球球队";
        array["OS"]="最先/最后越位球队";
        array["ST"]="最先/最后替补球员球队";
        array["CN"]="第一颗/最后一颗角球";
        array["CD"]="第一张/最后一张卡";
        array["RC"]="会进球/不会进球";
        array["YC"]="第一张/最后一张黄卡";
        array["GA"]="有失球/没有失球";

        array["No"] = "无";
        array["Y"] = "是";
        array["N"] = "否";
        array["FG_S"] = "射门";
        array["FG_H"] = "头球";
        array["FG_N"] = "无进球";
        array["FG_P"] = "点球";
        array["FG_F"] = "任意球";
        array["FG_O"] = "乌龙球";

        array["RPF_1"] = "第三轮";
        array["RPF_2"] = "第四轮";
        array["RPF_3"] = "第五轮";
        array["RPF_OV"] = "第六轮或之后";

        array["T3G_1"] = "26分钟以下";
        array["T3G_2"] = "27分钟+";
        array["T3G_N"] = "无进球";

        array["T1G_N"] = "无进球";
        array["T1G_1"] = "0 - 14:59";
        array["T1G_2"] = "15 - 29:59";
        array["T1G_3"] = "30 – 半场";
        array["T1G_4"] = "45 – 59:59";
        array["T1G_5"] = "60 – 74:59";
        array["T1G_6"] = "75 – 全场";

        array["MQ_H"]=" - 90分钟";
        array["MQ_C"]=" - 90分钟";
        array["MQ_HOT"]=" - 加时赛";
        array["MQ_COT"]=" - 加时赛";
        array["MQ_HPK"]=" - 点球";
        array["MQ_CPK"]=" - 点球";
        array["RNB_P"]="没有罚牌";
        array["RNC_P"]="没有角球";
        array["RS_P"]="没有点球";
        array["RS_Y"]="进球";
        array["RS_N"]="无进球";

        // array["AGMH"] = "0 - 14:59";
        // array["BGMH"] = "15 - 29:59";
        // array["CGMH"] = "30 – 半场";
        // array["DGMH"] = "45 – 59:59";
        // array["EGMH"] = "60 – 74:59";
        // array["FGMH"] = "75 – 全场";
        array["FT_title1"]="进球数";
        array["FT_title2"]="进球数";

        array["AGMH"] = "上半场开始 - 14:59 分钟";
        array["BGMH"] = "15:00 - 29:59 分钟";
        array["CGMH"] = "30:00 分钟 - 半场";
        array["HGMH"] = "半场";
        array["DGMH"] = "下半场开始 - 59:59 分钟";
        array["EGMH"] = "60:00 - 74:59 分钟";
        array["FGMH"] = "75:00 分钟 - 全场";
        array["GMH"] = "全场";

        array["TAGMH"] = "开始 - 04:59 分钟";
        array["TBGMH"] = "05:00 - 09:59 分钟";
        array["TCGMH"] = "10:00 分钟 - 半场";
        array["THGMH"] = "半场";
        array["TDGMH"] = "下半场开始 - 19:59 分钟";
        array["TEGMH"] = "20:00 - 24:59分钟";
        array["TFGMH"] = "25:00分钟 -全场";
        array["TGMH"] = "全场";

        array["BH"] = "落后反超获胜";
        array["ARG"] = "第一进球";
        array["BRG"] = "第二进球";
        array["CRG"] = "第三进球";
        array["DRG"] = "第四进球";
        array["ERG"] = "第五进球";
        array["FRG"] = "第六进球";
        array["GRG"] = "第七进球";
        array["HRG"] = "第八进球";
        array["IRG"] = "第九进球";
        array["JRG"] = "第十进球";
        array["FG"] = "首个进球方式";
        array["F2G"] = "先进2球的一方";
        array["F3G"] = "先进3球的一方";
        array["T1G"] = "首个进球时间";
        array["T3G"] = "首个进球时间-三项";
        array["TK"] = "先开球球队";
        array["PA"] = "点球惩罚";
        array["RCD"] = "红卡(球员)";
        array["RPS"] = "点球大战";

        array["MQ"]="晋级方法";
        array["MW"]="胜出方法";
        array["OG"]="乌龙球";
        array["OT"]="加时赛";
        array["RSHA"]="点球大战 - 第一回合";
        array["RSHB"]="点球大战 - 第二回合";
        array["RSHC"]="点球大战 - 第三回合";
        array["RSHD"]="点球大战 - 第四回合";
        array["RSHE"]="点球大战 - 第五回合";
        array["RSHF"]="点球大战 - 第六回合";
        array["RSHG"]="点球大战 - 第七回合";
        array["RSHH"]="点球大战 - 第八回合";
        array["RSHI"]="点球大战 - 第九回合";
        array["RSHJ"]="点球大战 - 第十回合";
        array["RSHK"]="点球大战 - 第十一回合";
        array["RSHL"]="点球大战 - 第十二回合";
        array["RSHM"]="点球大战 - 第十三回合";
        array["RSHN"]="点球大战 - 第十四回合";
        array["RSHO"]="点球大战 - 第十五回合";
        array["RPF"]="最后结束回合";
        array["RNC1"]="第一个角球";
        array["RNC2"]="第二个角球";
        array["RNC3"]="第三个角球";
        array["RNC4"]="第四个角球";
        array["RNC5"]="第五个角球";
        array["RNC6"]="第六个角球";
        array["RNC7"]="第七个角球";
        array["RNC8"]="第八个角球";
        array["RNC9"]="第九个角球";
        array["RNCA"]="第十个角球";
        array["RNCB"]="第十一个角球";
        array["RNCC"]="第十二个角球";
        array["RNCD"]="第十三个角球";
        array["RNCE"]="第十四个角球";
        array["RNCF"]="第十五个角球";
        array["RNCG"]="第十六个角球";
        array["RNCH"]="第十七个角球";
        array["RNCI"]="第十八个角球";
        array["RNCJ"]="第十九个角球";
        array["RNCK"]="第二十个角球";
        array["RNCL"]="第二一个角球";
        array["RNCM"]="第二二个角球";
        array["RNCN"]="第二三个角球";
        array["RNCO"]="第二四个角球";
        array["RNCP"]="第二五个角球";
        array["RNCQ"]="第二六个角球";
        array["RNCR"]="第二七个角球";
        array["RNCS"]="第二八个角球";
        array["RNCT"]="第二九个角球";
        array["RNCU"]="第三十个角球";
        array["RNBA"]="第一个罚牌";
        array["RNBB"]="第二个罚牌";
        array["RNBC"]="第三个罚牌";
        array["RNBD"]="第四个罚牌";
        array["RNBE"]="第五个罚牌";
        array["RNBF"]="第六个罚牌";
        array["RNBG"]="第七个罚牌";
        array["RNBH"]="第八个罚牌";
        array["RNBI"]="第九个罚牌";
        array["RNBJ"]="第十个罚牌";
        array["RNBK"]="第十一个罚牌";
        array["RNBL"]="第十二个罚牌";
        array["RNBM"]="第十三个罚牌";
        array["RNBN"]="第十四个罚牌";
        array["RNBO"]="第十五个罚牌";

        array["F01"] = "第1局";
        array["F02"] = "第2局";
        array["F03"] = "第3局";
        array["F04"] = "第4局";
        array["F05"] = "第5局";
        array["F06"] = "第6局";
        array["F07"] = "第7局";
        array["F08"] = "第8局";
        array["F09"] = "第9局";
        array["F10"] = "第10局";
        array["F11"] = "第11局";
        array["F12"] = "第12局";
        array["F13"] = "第13局";
        array["F14"] = "第14局";
        array["F15"] = "第15局";
        array["F16"] = "第16局";
        array["F17"] = "第17局";
        array["F18"] = "第18局";
        array["F19"] = "第19局";
        array["F20"] = "第20局";
        array["F21"] = "第21局";
        array["F22"] = "第22局";
        array["F23"] = "第23局";
        array["F24"] = "第24局";
        array["F25"] = "第25局";
        array["F26"] = "第26局";
        array["F27"] = "第27局";
        array["F28"] = "第28局";
        array["F29"] = "第29局";
        array["F30"] = "第30局";
        array["F31"] = "第31局";
        array["F32"] = "第32局";
        array["F33"] = "第33局";
        array["F34"] = "第34局";
        array["F35"] = "第35局";

        array["RFA01"] = "第一局";
        array["RFA02"] = "第二局";
        array["RFA03"] = "第三局";
        array["RFA04"] = "第四局";
        array["RFA05"] = "第五局";
        array["RFA06"] = "第六局";
        array["RFA07"] = "第七局";
        array["RFA08"] = "第八局";
        array["RFA09"] = "第九局";
        array["RFA10"] = "第十局";
        array["RFA11"] = "第十一局";
        array["RFA12"] = "第十二局";
        array["RFA13"] = "第十三局";

        array["RFB01"] = "第一局";
        array["RFB02"] = "第二局";
        array["RFB03"] = "第三局";
        array["RFB04"] = "第四局";
        array["RFB05"] = "第五局";
        array["RFB06"] = "第六局";
        array["RFB07"] = "第七局";
        array["RFB08"] = "第八局";
        array["RFB09"] = "第九局";
        array["RFB10"] = "第十局";
        array["RFB11"] = "第十一局";
        array["RFB12"] = "第十二局";
        array["RFB13"] = "第十三局";

        array["RFC01"] = "第一局";
        array["RFC02"] = "第二局";
        array["RFC03"] = "第三局";
        array["RFC04"] = "第四局";
        array["RFC05"] = "第五局";
        array["RFC06"] = "第六局";
        array["RFC07"] = "第七局";
        array["RFC08"] = "第八局";
        array["RFC09"] = "第九局";
        array["RFC10"] = "第十局";
        array["RFC11"] = "第十一局";
        array["RFC12"] = "第十二局";
        array["RFC13"] = "第十三局";
        array["RFC14"] = "第十四局";
        array["RFC15"] = "第十五局";
        array["RFC16"] = "第十六局";
        array["RFC17"] = "第十七局";
        array["RFC18"] = "第十八局";
        array["RFC19"] = "第十九局";
        array["RFC20"] = "第二十局";
        array["RFC21"] = "第二十一局";
        array["RFC22"] = "第二十二局";
        array["RFC23"] = "第二十三局";
        array["RFC24"] = "第二十四局";
        array["RFC25"] = "第二十五局";
        array["RFC26"] = "第二十六局";
        array["RFC27"] = "第二十七局";
        array["RFC28"] = "第二十八局";
        array["RFC29"] = "第二十九局";
        array["RFC30"] = "第三十局";
        array["RFC31"] = "第三十一局";
        array["RFC32"] = "第三十二局";
        array["RFC33"] = "第三十三局";
        array["RFC34"] = "第三十四局";
        array["RFC35"] = "第三十五局";
        array["RFC36"] = "第三十六局";
        array["RFC37"] = "第三十七局";
        array["RFC38"] = "第三十八局";
        array["RFC39"] = "第三十九局";
        array["RFC40"] = "第四十局";
        array["RFC41"] = "第四十一局";
        array["RFC42"] = "第四十二局";
        array["RFC43"] = "第四十三局";
        array["RFC44"] = "第四十四局";
        array["RFC45"] = "第四十五局";
        array["RFC46"] = "第四十六局";
        array["RFC47"] = "第四十七局";
        array["RFC48"] = "第四十八局";
        array["RFC49"] = "第四十九局";
        array["RFC50"] = "第五十局";

        array["RFD01"] = "第一局";
        array["RFD02"] = "第二局";
        array["RFD03"] = "第三局";
        array["RFD04"] = "第四局";
        array["RFD05"] = "第五局";
        array["RFD06"] = "第六局";
        array["RFD07"] = "第七局";
        array["RFD08"] = "第八局";
        array["RFD09"] = "第九局";
        array["RFD10"] = "第十局";
        array["RFD11"] = "第十一局";
        array["RFD12"] = "第十二局";
        array["RFD13"] = "第十三局";

        array["RFE01"] = "第一局";
        array["RFE02"] = "第二局";
        array["RFE03"] = "第三局";
        array["RFE04"] = "第四局";
        array["RFE05"] = "第五局";
        array["RFE06"] = "第六局";
        array["RFE07"] = "第七局";
        array["RFE08"] = "第八局";
        array["RFE09"] = "第九局";
        array["RFE10"] = "第十局";
        array["RFE11"] = "第十一局";
        array["RFE12"] = "第十二局";
        array["RFE13"] = "第十三局";
        array["RFE14"] = "第十四局";
        array["RFE15"] = "第十五局";
        array["RFE16"] = "第十六局";
        array["RFE17"] = "第十七局";
        array["RFE18"] = "第十八局";
        array["RFE19"] = "第十九局";
        array["RFE20"] = "第二十局";
        array["RFE21"] = "第二十一局";
        array["RFE22"] = "第二十二局";
        array["RFE23"] = "第二十三局";
        array["RFE24"] = "第二十四局";
        array["RFE25"] = "第二十五局";
        array["RFE26"] = "第二十六局";
        array["RFE27"] = "第二十七局";
        array["RFE28"] = "第二十八局";
        array["RFE29"] = "第二十九局";
        array["RFE30"] = "第三十局";
        array["RFE31"] = "第三十一局";
        array["RFE32"] = "第三十二局";
        array["RFE33"] = "第三十三局";
        array["RFE34"] = "第三十四局";
        array["RFE35"] = "第三十五局";
        array["RFE36"] = "第三十六局";
        array["RFE37"] = "第三十七局";
        array["RFE38"] = "第三十八局";
        array["RFE39"] = "第三十九局";
        array["RFE40"] = "第四十局";
        array["RFE41"] = "第四十一局";
        array["RFE42"] = "第四十二局";
        array["RFE43"] = "第四十三局";
        array["RFE44"] = "第四十四局";
        array["RFE45"] = "第四十五局";
        array["RFE46"] = "第四十六局";
        array["RFE47"] = "第四十七局";
        array["RFE48"] = "第四十八局";
        array["RFE49"] = "第四十九局";
        array["RFE50"] = "第五十局";

        // basketball
        array["str_BK_0"] ="第一节";
        array["str_BK_1"] ="第二节";
        array["str_BK_2"] ="第三节";
        array["str_BK_3"] ="第四节";
        array["str_BK_4"] ="上半场";
        array["str_BK_5"] ="下半场";
        array["str_BK_6"] ="加时";
        array["str_BK_7"] ="总计";

        // tennis game
        array["str_TN_game_1"] = "第一盘";
        array["str_TN_game_2"] = "第二盘";
        array["str_TN_game_3"] = "第三盘";
        array["str_TN_game_4"] = "第四盘";
        array["str_TN_game_5"] = "第五盘";

        // tennis overall result
        array["str_TN_0"] = "第一盘";
        array["str_TN_1"] = "第二盘";
        array["str_TN_2"] = "第三盘";
        array["str_TN_3"] = "第四盘";
        array["str_TN_4"] = "第五盘";
        array["str_TN_5"] = "让局";
        array["str_TN_6"] = "球员得分: 大 / 小";
        array["str_TN_7"] = "完赛";

        // volleyball
        array["str_VB_0"] = "第一局";
        array["str_VB_1"] = "第二局";
        array["str_VB_2"] = "第三局";
        array["str_VB_3"] = "第四局";
        array["str_VB_4"] = "第五局";
        array["str_VB_5"] = "第六局";
        array["str_VB_6"] = "第七局";
        array["str_VB_7"] = "让分";
        array["str_VB_8"] = "完赛"

        // badminton tabletennis
        array["str_BMTT_0"] = "第一局";
        array["str_BMTT_1"] = "第二局";
        array["str_BMTT_2"] = "第三局";
        array["str_BMTT_3"] = "第四局";
        array["str_BMTT_4"] = "第五局";
        array["str_BMTT_5"] = "第六局";
        array["str_BMTT_6"] = "第七局";
        array["str_BMTT_7"] = "让分";
        array["str_BMTT_8"] = "球员局数: 大 / 小";
        array["str_BMTT_9"] = "完赛"

        //baseball
        array["str_BS_Y"] = "是";
        array["str_BS_N"] = "不是";
        array["str_BS_0"] = "首五局";
        array["str_BS_1"] = "全场";

        //shooker
        array["str_SK_0"] = "第1 - 5局";
        array["str_SK_1"] = "第6 - 8局";
        array["str_SK_2"] = "第10 - 14局";
        array["str_SK_3"] = "第15 - 17局";
        array["str_SK_4"] = "第19 - 23局";
        array["str_SK_5"] = "第24 - 26局";
        array["str_SK_6"] = "全场";
        // totalBets result detail end

        //過濾器
        array["str_ALL"] = "所有球类";
		array["str_FT"] = "足球";
		array["str_BK"] = "篮球 / 美式足球";
        array["str_ES"] = "电子竞技";
		array["str_TN"] = "网球";
		array["str_VB"] = "排球";
		array["str_BM"] = "羽毛球";
		array["str_TT"] = "乒乓球";
		array["str_BS"] = "棒球";
		array["str_SK"] = "斯诺克/台球";
		array["str_OP"] = "其他球类";
        array["str_SFS"] = "特殊冠军";
        array["str_FS"] = "冠军";

        array["str_wmc_ALL"] = array["str_ALL"];
        array["str_wmc_FT"] = array["str_FT"];
        array["str_wmc_BK"] = array["str_BK"];
        array["str_wmc_ES"] = array["str_ES"];
        array["str_wmc_TN"] = array["str_TN"];
        array["str_wmc_VB"] = array["str_VB"];
        array["str_wmc_BM"] = array["str_BM"];
        array["str_wmc_TT"] = array["str_TT"];
        array["str_wmc_BS"] = array["str_BS"];
        array["str_wmc_SK"] = array["str_SK"];
        array["str_wmc_OP"] = array["str_OP"];
        array["str_wmc_SFS"] =array["str_SFS"];
        array["str_wmc_FS"] = array["str_FS"];

        array["btns_gtype"] = "球类";
		array["btns_stake"] = "下注金额";
		array["btns_view"] = "观看";
		array["btns_downline"] = "下线";
		array["btns_league"] = "联盟";
		array["btns_datestarted"] = "日期";
		array["btns_market"] = "盘口类型";
		array["btns_eventdate"] = "赛事日期";
		array["btns_class"] = "冠军类别";
		array["btns_dateoutright"] = "日期";
		array["btns_date"] = "日期";
		array["btns_dateresult"] = "日期";
		array["btns_event"] = "赛事";
		array["btns_bettype"] = "玩法";
        array["btns_bet"] = "注单";
        array["btns_score"] = "比分";

        array["btns_site"] = "网站";

        array["str_market_ALL"] = "所有盘口";
        array["str_market_rb"] = "滚球";
        array["str_market_ft"] = "今日";
        array["str_market_fu"] = "早盘";

        array["str_wmc_market_ALL"] =array["str_market_ALL"];
        array["str_wmc_market_rb"] = array["str_market_rb"];
        array["str_wmc_market_ft"] = array["str_market_ft"];
        array["str_wmc_market_ft1"] = "初盘";
        array["str_wmc_market_fu"] = array["str_market_fu"];

        array["filter_view_full"] = "显示所有";
        array["filter_view_com"] = "公司占成" ;
        array["filter_view_d"] = "分公司占成" ;
        array["filter_view_c"] = "股东占成" ;
        array["filter_view_s"] = "总代理占成" ;
        array["filter_view_a"] = "代理商占成" ;
        array["filter_view_dcsa"] = "分公司 + 股东 + 总代理 + 代理商占成" ;
        array["filter_view_dcs"] = "分公司 + 股东 + 总代理占成" ;
        array["filter_view_dc"] = "分公司 + 股东占成" ;
        array["filter_view_csa"] = "股东 + 总代理 + 代理商占成" ;
        array["filter_view_cs"] = "股东 + 总代理占成" ;
        array["filter_view_sa"] = "总代理 + 代理商占成" ;
        array["filter_view_my"] = "我的占成";

        array["filter_date_yesterday"] = "昨日";
        array["filter_date_today"] = "今日";
        array["filter_date_future"] = "未来";
        array["filter_date_all"] = "所有";
        array["filter_date_show"] = "日期";

        array["filter_downline_show"] = "下线";
        array["filter_league_show"] = "联盟";
        array["filter_market_show"] = "盘口类型";

        array["filter_err_downline_max"] = "您最多可选择*LIMITCOUNT*个帐号";

        array["filter_market_all"] = "所有";
        array["filter_market_rb"] = "滚球";
        array["filter_market_pl"] = "单式";

        array["filter_more"] = "大于";
		array["filter_less"] = "小于";
        array["filter_same"] = "等于";

        array["str_day"] = "日";

        //簡體
        array["CancelType0"] = "正式比分";
        array["CancelType-1"] = "赛事取消";
        array["CancelType-2"] = "队名错误";
        array["CancelType-3"] = "赛事延赛";
        array["CancelType-4"] = "赛事时间不正规";
        array["CancelType-5"] = "赛事腰斩";
        array["CancelType-6"] = "球员弃权";
        array["CancelType-7"] = "主客场错误";
        array["CancelType-8"] = "联赛名称错误";
        array["CancelType-9"] = "赛事无PK/ 加时";
        array["CancelType-10"] = "赛程错误";
        array["CancelType-11"] = "不显示赛程";
        array["CancelType-12"] = "取消";
        array["CancelType-13"] = "赛事腰斩";
        array["CancelType-14"] = "无局数";
        array["CancelType_SK-14"] = "无局数";

        //Ricky 2018-03-06 PJB-188 CRM-249網球下一局独赢
        array["title_RFA01_0_TN"] = "独赢 - 第一盘 第一局";
        array["title_RFA02_0_TN"] = "独赢 - 第一盘 第二局";
        array["title_RFA03_0_TN"] = "独赢 - 第一盘 第三局";
        array["title_RFA04_0_TN"] = "独赢 - 第一盘 第四局";
        array["title_RFA05_0_TN"] = "独赢 - 第一盘 第五局";
        array["title_RFA06_0_TN"] = "独赢 - 第一盘 第六局";
        array["title_RFA07_0_TN"] = "独赢 - 第一盘 第七局";
        array["title_RFA08_0_TN"] = "独赢 - 第一盘 第八局";
        array["title_RFA09_0_TN"] = "独赢 - 第一盘 第九局";
        array["title_RFA10_0_TN"] = "独赢 - 第一盘 第十局";
        array["title_RFA11_0_TN"] = "独赢 - 第一盘 第十一局";
        array["title_RFA12_0_TN"] = "独赢 - 第一盘 第十二局";
        array["title_RFA13_0_TN"] = "独赢 - 第一盘 第十三局";
        array["title_RFB01_0_TN"] = "独赢 - 第二盘 第一局";
        array["title_RFB02_0_TN"] = "独赢 - 第二盘 第二局";
        array["title_RFB03_0_TN"] = "独赢 - 第二盘 第三局";
        array["title_RFB04_0_TN"] = "独赢 - 第二盘 第四局";
        array["title_RFB05_0_TN"] = "独赢 - 第二盘 第五局";
        array["title_RFB06_0_TN"] = "独赢 - 第二盘 第六局";
        array["title_RFB07_0_TN"] = "独赢 - 第二盘 第七局";
        array["title_RFB08_0_TN"] = "独赢 - 第二盘 第八局";
        array["title_RFB09_0_TN"] = "独赢 - 第二盘 第九局";
        array["title_RFB10_0_TN"] = "独赢 - 第二盘 第十局";
        array["title_RFB11_0_TN"] = "独赢 - 第二盘 第十一局";
        array["title_RFB12_0_TN"] = "独赢 - 第二盘 第十二局";
        array["title_RFB13_0_TN"] = "独赢 - 第二盘 第十三局";
        array["title_RFC01_0_TN"] = "独赢 - 第三盘 第一局";
        array["title_RFC02_0_TN"] = "独赢 - 第三盘 第二局";
        array["title_RFC03_0_TN"] = "独赢 - 第三盘 第三局";
        array["title_RFC04_0_TN"] = "独赢 - 第三盘 第四局";
        array["title_RFC05_0_TN"] = "独赢 - 第三盘 第五局";
        array["title_RFC06_0_TN"] = "独赢 - 第三盘 第六局";
        array["title_RFC07_0_TN"] = "独赢 - 第三盘 第七局";
        array["title_RFC08_0_TN"] = "独赢 - 第三盘 第八局";
        array["title_RFC09_0_TN"] = "独赢 - 第三盘 第九局";
        array["title_RFC10_0_TN"] = "独赢 - 第三盘 第十局";
        array["title_RFC11_0_TN"] = "独赢 - 第三盘 第十一局";
        array["title_RFC12_0_TN"] = "独赢 - 第三盘 第十二局";
        array["title_RFC13_0_TN"] = "独赢 - 第三盘 第十三局";
        array["title_RFC14_0_TN"] = "独赢 - 第三盘 第十四局";
        array["title_RFC15_0_TN"] = "独赢 - 第三盘 第十五局";
        array["title_RFC16_0_TN"] = "独赢 - 第三盘 第十六局";
        array["title_RFC17_0_TN"] = "独赢 - 第三盘 第十七局";
        array["title_RFC18_0_TN"] = "独赢 - 第三盘 第十八局";
        array["title_RFC19_0_TN"] = "独赢 - 第三盘 第十九局";
        array["title_RFC20_0_TN"] = "独赢 - 第三盘 第二十局";
        array["title_RFC21_0_TN"] = "独赢 - 第三盘 第二十一局";
        array["title_RFC22_0_TN"] = "独赢 - 第三盘 第二十二局";
        array["title_RFC23_0_TN"] = "独赢 - 第三盘 第二十三局";
        array["title_RFC24_0_TN"] = "独赢 - 第三盘 第二十四局";
        array["title_RFC25_0_TN"] = "独赢 - 第三盘 第二十五局";
        array["title_RFC26_0_TN"] = "独赢 - 第三盘 第二十六局";
        array["title_RFC27_0_TN"] = "独赢 - 第三盘 第二十七局";
        array["title_RFC28_0_TN"] = "独赢 - 第三盘 第二十八局";
        array["title_RFC29_0_TN"] = "独赢 - 第三盘 第二十九局";
        array["title_RFC30_0_TN"] = "独赢 - 第三盘 第三十局";
        array["title_RFC31_0_TN"] = "独赢 - 第三盘 第三十一局";
        array["title_RFC32_0_TN"] = "独赢 - 第三盘 第三十二局";
        array["title_RFC33_0_TN"] = "独赢 - 第三盘 第三十三局";
        array["title_RFC34_0_TN"] = "独赢 - 第三盘 第三十四局";
        array["title_RFC35_0_TN"] = "独赢 - 第三盘 第三十五局";
        array["title_RFC36_0_TN"] = "独赢 - 第三盘 第三十六局";
        array["title_RFC37_0_TN"] = "独赢 - 第三盘 第三十七局";
        array["title_RFC38_0_TN"] = "独赢 - 第三盘 第三十八局";
        array["title_RFC39_0_TN"] = "独赢 - 第三盘 第三十九局";
        array["title_RFC40_0_TN"] = "独赢 - 第三盘 第四十局";
        array["title_RFC41_0_TN"] = "独赢 - 第三盘 第四十一局";
        array["title_RFC42_0_TN"] = "独赢 - 第三盘 第四十二局";
        array["title_RFC43_0_TN"] = "独赢 - 第三盘 第四十三局";
        array["title_RFC44_0_TN"] = "独赢 - 第三盘 第四十四局";
        array["title_RFC45_0_TN"] = "独赢 - 第三盘 第四十五局";
        array["title_RFC46_0_TN"] = "独赢 - 第三盘 第四十六局";
        array["title_RFC47_0_TN"] = "独赢 - 第三盘 第四十七局";
        array["title_RFC48_0_TN"] = "独赢 - 第三盘 第四十八局";
        array["title_RFC49_0_TN"] = "独赢 - 第三盘 第四十九局";
        array["title_RFC50_0_TN"] = "独赢 - 第三盘 第五十局";
        array["title_RFD01_0_TN"] = "独赢 - 第四盘 第一局";
        array["title_RFD02_0_TN"] = "独赢 - 第四盘 第二局";
        array["title_RFD03_0_TN"] = "独赢 - 第四盘 第三局";
        array["title_RFD04_0_TN"] = "独赢 - 第四盘 第四局";
        array["title_RFD05_0_TN"] = "独赢 - 第四盘 第五局";
        array["title_RFD06_0_TN"] = "独赢 - 第四盘 第六局";
        array["title_RFD07_0_TN"] = "独赢 - 第四盘 第七局";
        array["title_RFD08_0_TN"] = "独赢 - 第四盘 第八局";
        array["title_RFD09_0_TN"] = "独赢 - 第四盘 第九局";
        array["title_RFD10_0_TN"] = "独赢 - 第四盘 第十局";
        array["title_RFD11_0_TN"] = "独赢 - 第四盘 第十一局";
        array["title_RFD12_0_TN"] = "独赢 - 第四盘 第十二局";
        array["title_RFD13_0_TN"] = "独赢 - 第四盘 第十三局";
        array["title_RFE01_0_TN"] = "独赢 - 第五盘 第一局";
        array["title_RFE02_0_TN"] = "独赢 - 第五盘 第二局";
        array["title_RFE03_0_TN"] = "独赢 - 第五盘 第三局";
        array["title_RFE04_0_TN"] = "独赢 - 第五盘 第四局";
        array["title_RFE05_0_TN"] = "独赢 - 第五盘 第五局";
        array["title_RFE06_0_TN"] = "独赢 - 第五盘 第六局";
        array["title_RFE07_0_TN"] = "独赢 - 第五盘 第七局";
        array["title_RFE08_0_TN"] = "独赢 - 第五盘 第八局";
        array["title_RFE09_0_TN"] = "独赢 - 第五盘 第九局";
        array["title_RFE10_0_TN"] = "独赢 - 第五盘 第十局";
        array["title_RFE11_0_TN"] = "独赢 - 第五盘 第十一局";
        array["title_RFE12_0_TN"] = "独赢 - 第五盘 第十二局";
        array["title_RFE13_0_TN"] = "独赢 - 第五盘 第十三局";
        array["title_RFE14_0_TN"] = "独赢 - 第五盘 第十四局";
        array["title_RFE15_0_TN"] = "独赢 - 第五盘 第十五局";
        array["title_RFE16_0_TN"] = "独赢 - 第五盘 第十六局";
        array["title_RFE17_0_TN"] = "独赢 - 第五盘 第十七局";
        array["title_RFE18_0_TN"] = "独赢 - 第五盘 第十八局";
        array["title_RFE19_0_TN"] = "独赢 - 第五盘 第十九局";
        array["title_RFE20_0_TN"] = "独赢 - 第五盘 第二十局";
        array["title_RFE21_0_TN"] = "独赢 - 第五盘 第二十一局";
        array["title_RFE22_0_TN"] = "独赢 - 第五盘 第二十二局";
        array["title_RFE23_0_TN"] = "独赢 - 第五盘 第二十三局";
        array["title_RFE24_0_TN"] = "独赢 - 第五盘 第二十四局";
        array["title_RFE25_0_TN"] = "独赢 - 第五盘 第二十五局";
        array["title_RFE26_0_TN"] = "独赢 - 第五盘 第二十六局";
        array["title_RFE27_0_TN"] = "独赢 - 第五盘 第二十七局";
        array["title_RFE28_0_TN"] = "独赢 - 第五盘 第二十八局";
        array["title_RFE29_0_TN"] = "独赢 - 第五盘 第二十九局";
        array["title_RFE30_0_TN"] = "独赢 - 第五盘 第三十局";
        array["title_RFE31_0_TN"] = "独赢 - 第五盘 第三十一局";
        array["title_RFE32_0_TN"] = "独赢 - 第五盘 第三十二局";
        array["title_RFE33_0_TN"] = "独赢 - 第五盘 第三十三局";
        array["title_RFE34_0_TN"] = "独赢 - 第五盘 第三十四局";
        array["title_RFE35_0_TN"] = "独赢 - 第五盘 第三十五局";
        array["title_RFE36_0_TN"] = "独赢 - 第五盘 第三十六局";
        array["title_RFE37_0_TN"] = "独赢 - 第五盘 第三十七局";
        array["title_RFE38_0_TN"] = "独赢 - 第五盘 第三十八局";
        array["title_RFE39_0_TN"] = "独赢 - 第五盘 第三十九局";
        array["title_RFE40_0_TN"] = "独赢 - 第五盘 第四十局";
        array["title_RFE41_0_TN"] = "独赢 - 第五盘 第四十一局";
        array["title_RFE42_0_TN"] = "独赢 - 第五盘 第四十二局";
        array["title_RFE43_0_TN"] = "独赢 - 第五盘 第四十三局";
        array["title_RFE44_0_TN"] = "独赢 - 第五盘 第四十四局";
        array["title_RFE45_0_TN"] = "独赢 - 第五盘 第四十五局";
        array["title_RFE46_0_TN"] = "独赢 - 第五盘 第四十六局";
        array["title_RFE47_0_TN"] = "独赢 - 第五盘 第四十七局";
        array["title_RFE48_0_TN"] = "独赢 - 第五盘 第四十八局";
        array["title_RFE49_0_TN"] = "独赢 - 第五盘 第四十九局";
        array["title_RFE50_0_TN"] = "独赢 - 第五盘 第五十局";

        array["HT"] = "半场";
        array["1H"] = "上半场";
        array["2H"] = "下半场";
        array["BK_HT"] = "上半场";
        array["BK_H2"] = "下半场";
        array["BK_Q1"] = "第一节";
        array["BK_Q2"] = "第二节";
        array["BK_Q3"] = "第三节";
        array["BK_Q4"] = "第四节";
        array["BK_OT"] = "加时";
        array["BK_half_time"] = "半场";

        array["BK_HT_allbet"] = "上半场";
        array["BK_H2_allbet"] = "下半场";
        array["BK_Q1_allbet"] = "第一节";
        array["BK_Q2_allbet"] = "第二节";
        array["BK_Q3_allbet"] = "第三节";
        array["BK_Q4_allbet"] = "第四节";
        array["BK_OT_allbet"] = "加时";
        array["BK_half_time_allbet"] = "半场";

        array["Best_of_3"] = "三盘两胜";
        array["Best_of_5"] = "五盘三胜";
        array["Best_of_7"] = "七盘四胜";
        array["Best_of_12"] = "十二盘制";

        array["midfield"] = "中";
        array["live"] = "滚球";

        array["ES_Match"] = "";
		array["ES_Specials"] = "第*TYPE*局 - ";
		array["ES_M10"] = "第*TYPE*局 选阵容 - 第9分59秒 - ";
		array["ES_M20"] = "第*TYPE*局 第10分 - 第19分59秒 - ";
		array["ES_HT"] = "第*TYPE*局 上半场 - ";
		array["ES_1"] = "";
		array["ES_2"] = "持续时间";
		array["ES_3"] = "击杀数";
		array["ES_4"] = "*TEAM_H* 击杀数";
		array["ES_5"] = "*TEAM_C* 击杀数";
		array["ES_6"] = "防御塔";
		array["ES_7"] = "*TEAM_H* 防御塔";
		array["ES_8"] = "*TEAM_C* 防御塔";
		array["ES_9"] = "元素巨龙";
		array["ES_10"] = "纳什男爵";
		array["ES_11"] = "水晶兵营";
		array["ES_12"] = "肉山";
		array["ES_13"] = "兵营";
		array["ES_14"] = "*TEAM_H* 回合";
		array["ES_15"] = "*TEAM_C* 回合";
		array["ES_GameNumber"] = "第*GAME_NUMBER*局";

        return array;
    }

    _self.get = function (_key) {
        return LangxAry[_key];
    }

}

function LS_us() {
    var _self = this;
    var parentClass;
    var LangxAry;

    _self.init = function () {
        LangxAry = _self.set();
    }

    _self.set = function () {
        var array = new Object();
        array["loading_txt"] = "LOADING";
        array["page_dashboard"] = "Dashboard";
        array["page_report"] = "Reports";
        array["page_totalbet"] = "Total Bets";
        array["page_set"] = "Settled Wager";
        array["page_un"] = "Unsettled Wager";
        array["page_summary"] = "Settlement Summary";
        array["page_period"] = "Accounting Period";
        array["page_exchange"] = "Exchange Rate";
        array["page_cancel"] = "Cancelled Report";
        array["page_cancel"] = "Cancelled Report";
        array["page_quicksearch"] = "Quick Search";
        array["page_onlinemem"] = "Online Members";
        array["page_mysetting"] = "My Settings";
        array["page_myactivities"] = "My Activities";
        array["page_newurl"] = "New URL";
        array["page_feature"] = "Features";
        array["page_requirements"] = "System Requirements";
        array["page_contactus"] = "Contact Us";
        array["page_pwd_recovery"] = "Password Recovery";
        array["page_chg_pwd_inside"] = "Change Password";
	    array["page_problem_accounts"] = "Problem Accounts";
        array["page_announcement"] = "Announcement";
        array["page_account"] = "A/C Mgmt";
        array["page_sub"] = "Sub Account";
        array["page_su_add"] = "New Master Agent";
        array["page_ag_add"] = "New Agent";
        array["page_mem_add"] = "New Member";
        array["page_sub_add"] = "New Sub Account";

        array["str_copied"] = "The data has been copied.";

        array["page_overview"] = "Overview";
        array["page_INPLAY"] = "In-Play";
        array["page_TODAY"] = "Today";
        array["page_EARLY"] = "Early";
        array["page_STARTED"] = "Started";
        array["page_PARLAY"] = "Parlay";
        array["page_OUTRIGHT"] = "Outright";
        array["page_RESULTS"] = "Results";

        //new_url Start
        array["newcro666"] = "Member Site";
        array["phcro666"] = "Mobile Member Site";
        array["newagcro666"] = "New Manager Site";
        array["agphonecro666"] = "Mobile Manager Site";
        array["acc"] = "Historical Report Site";
        //new_url End
        //恢復密碼
        array["0X001"] = "參數錯誤";
        array["4X001"] = "IP不合法";
        array["4X002"] = "Your account is inactive.  Please contact your upline for assistance.";
        array["4X003"] = "Your account was Suspended. Please contact your upline to active your account！";
        array["4X004"] = "Your account has been locked due to multiple failed login attempts.  Please contact your upline to unlock.";
        array["4X005"] = "Login ID, Password or Safe Code entered is invalid.";
        array["4X006"] = "三分鐘後再試";
        array["4X007"] = "未設定email";
        array["4X025"] = "Password Recovery is currently disabled.  Please contact your upline.";
        array["4X026"] = "You have exceeded the number of new verification code allowed.  Unable to generate a new verification code.  Please verify your information.";
        array["4X027"] = "連不到MailServer";
        array["4X028"] = "MailServer發送驗證碼失敗";
        array["4O005"] = "Verification Code has been sent to your email.";
        array["4O006"] = "Successfully Registered.";
        array["get_mail_canceal"] = "Please enter a valid email address.";
        array["input_verify_cancel"] = "Cancel Password Recovery?";
        array["remove_email"] = "You have deleted your Password Recovery Email.";
        array["remove_email_message"] = "Delete Password Recovery Email?";

        array["enable_Y"] = "Active";
        array["enable_N"] = "Inactive";
        array["enable_S"] = "View Only";
        array["enable_F"] = "Suspended";
        array["input_acc"] = "Enter User Code";

        //額度模式
        array["pay_type_0"] = "AR";
        array["pay_type_1"] = "W/L";
        array["long_pay_type_0"] = "Auto Recovery Account";
        array["long_pay_type_1"] = "Win/Loss Account";

        array["str_co"] = "Corprator";
        array["str_su"] = "Master Agent";
        array["str_ag"] = "Agent";
        array["str_mem"] = "Member";

        array["str_co_sub"] = "Corprator Sub";
        array["str_su_sub"] = "Master Agent Sub";
        array["str_ag_sub"] = "Agent Sub";

        
        array["str_ags"] = "Agents";
        array["str_mems"] = "Members";

        //帳戶新增修改
        array["max_limit_head"] = "Max: "//最大限額字串 Max: RMB 1,100,000
        array["empty_user"] = "You cannot leave this empty."; //帳號請務必輸入
        array["empty_alias"] = "You cannot leave this empty."; //名稱請務必輸入
        array["empty_passwd"] = "You cannot leave this empty."; //請輸入新密碼
        array["empty_confirm"] = "You cannot leave this empty."; //請輸入新密碼
        array["empty_credit"] = "You cannot leave this empty."; //總信用額度請務必輸入
        array["empty_safe"] = "You cannot leave this empty.";
        array["empty_enddate"] = "You cannot leave this empty.";
        array["empty_enddate1"] = "Wrong date format here.";
        array["str_confirm_add_su"] = "Confirm Write this agency?"; //是否確定寫入總代理
        array["str_confirm_add_ag"] = "Confirm wrtied this agent?";//是否確定寫入代理商
        array["str_confirm_add_mem"] = "Confirm writed this member's data?";//是否確定寫入會員資料
        array["credit_over"] = "Credits entered exceeds the Credit Balance. Please try again.";
        array["user_limit"] = "User code should contain at least 4 characters.";
        array["user_manage"] = "You do not have any Managed Accounts selected.Please select a Managed Account or select\"All\"";
        //array["add_account_success"] = "Account successfully created";
        array["add_account_success"] = "New Account Created";
        array["copy_success"] = "ID and password has been copied to clipboard.";
        array["copy_user"] = "ID：";
        array["copy_pwd"] = "PW：";
        array["winloss_percent"] = "%";
        array["su_ag_winloss_error"] = "Total Possess should be between xx% to yy%.  Please try again.";//股東及總代理及代理商的成數總和須在 5 - 8 成內 , 請重新設定 !!
        array["su_ag_winloss8_error"] = "Total Posess should be exactly xx%.  Please try again.";
        array["status_update"] = "Status successfully updated";
        array["credit_update"] = "Credit successfully updated";
        array["account_copy"] = "COPY";
        array["cash_sw_in_edit_user"] = "Due to unknown reason,  changing of credit function is temporarily unavailable. Please try again later.";
        array["cash_sw_in_add_user"] = "This function is not yet release to public. We will get it fully tested and release to public as soon as possible.";


        //子帳號
        array["max_sub3"] = "You have exceeded the maxiumum number of Sub Account.  Unable to proceed with account creation.";
        array["sub_mlimit"] = "You may select maximum of ";
        array["sub_mlimit2"] = " accounts at a time.";
        array["listsub_safe"] = "Safe Code";
        array["listsub_safe_ag"] = "Login ID";


        //修改成數
        array["str_possess_down"] = "Min. Allowed:";
        array["str_possess_up"] = "Max. Allowed:";
        array["str_possess_allowed"] = "Allowed:";
        array["RMB"] = "RMB";

        //密碼強度
        array["pwd_Very Weak"] = "Very Weak";
        array["pwd_Weak"] = "Weak";
        array["pwd_Fair"] = "Fair";
        array["pwd_Good"] = "Good";
        array["pwd_Strong"] = "Strong";

        //破解時間
        array["pwd_break_Seconds"] = "Seconds";
        array["pwd_break_Minutes"] = "Minutes";
        array["pwd_break_Hours"] = "Hours";
        array["pwd_break_Days"] = "Days";
        array["pwd_break_Months"] = "Months";
        array["pwd_break_Years"] = "Years";
        array["pwd_break_Centuries"] = "Centuries";

        array["pwd_TRILLION"] = "TRILLION";
        array["pwd_BILLION"] = "BILLION";
        array["pwd_MILLION"] = "MILLION";
        array["pwd_THOUSAND"] = "THOUSAND";
        array["pwd_HUNDRED"] = "HUNDRED";

        //信用額度
        array["str_maxcre"] = "Credit Limit only accept numbers.";
        array["str_maxcre_zero"] = "0 is not a valid value.  ";
        // array["str_maxcre_zero1"] = "Credit limit should be greater than 0.";
        array["str_maxcre_zero1"] = "Please enter a value greater than 0."; //更改信用額度時不能輸入0的錯誤訊息
        array["str_edit_credit_confirm"] = "Make sure to modify the credit limit?";

        array["empty_credit"] = "You cannot leave this empty."; //總信用額度請務必輸入
        array["str_maxcre_zero"] = "0 is not a valid value.  ";
        // array["str_maxcre_zero1"] = "Credit limit should be greater than 0.";
        array["str_maxcre_zero1"] = "Please enter a value greater than 0.";
        array["str_maxcre"] = "Credit Limit only accept numbers.";

        array["sub_selMax"] = "You have exceeded the number of ‘Managed Accounts’ allowed.  Please contact your upline to remove inactive accounts.";
        //快速搜尋
        //2019-03-28 Ricky 248.登一帳號-Quick Search快速搜尋-sub account，level(層級)幫改為SMA，目前秀錯字Corprator
        //array["layer_type_name_corprator"] = "Corprator";
        array["layer_type_name_corprator"] = "SMA";
        array["layer_type_name_super_agents"] = "Master Agent";
        array["layer_type_name_agents"] = "Agent";
        array["layer_type_name_members"] = "Member";
        array["enable_str_Active"] = "Active";
        array["enable_str_Suspended"] = "Suspended";
        array["enable_str_ViewOnly"] = "View Only";
        array["enable_str_Inactive"] = "Inactive";
        array["layer_type_name_subAccount"] = "Sub Account";
        //我的紀錄
        array["myAct_str_Create_Account"] = "Account Created";
        array["myAct_str_Password_Reset"] = "Password Reset";
        array["myAct_str_Change_Credits"] = "Change Credit";
        array["myAct_str_Change_Status"] = "Change Status";
        array["myAct_str_super_admin"] = "Super Admin";
        array["myAct_str_corprator"] = "Corprator";
        array["myAct_str_super_agents"] = "Master Agent";
        array["myAct_str_agents"] = "Agent";
        array["myAct_str_mem"] = "Member";

        //帳戶管理
        array["acc_su"]     = "Master Agent";
        array["acc_ag"]     = "Agent";
        array["acc_mem"]    = "Member";
        array["acc_sub"]    = "Sub Account";
        array["acc_str_credit"] = "Change Credit";
        array["acc_str_enable"] = "Change Status";
        array["acc_str_add"] = "Account created";
        array["acc_str_beadd"] = "Account created By";
        array["acc_str_password"] = "Change Password";

        //密碼恢復
        array["recv_enable"] = "Enabled";
        array["recv_disable"] = "Disabled";

        array['upd_success'] = "Successfully updated";//更改成功


        // dashboard
        array["dash_D"] = "Day";
        array["dash_Ds"] = "";
        array["dash_PR"] = "Possess Revenue";
        array["dash_MW"] = "Members with Wagers";
        array["dash_TO"] = "Turnover";
        array["dash_WL"] = "Win / Loss";


        // totalBets result detail start

        array["PGF"]="First team to score";
        array["OSF"]="First offside";
        array["STF"]="First substitution";
        array["CNF"]="First corner";
        array["CDF"]="First card";
        array["RCF"]="To Score";
        array["YCF"]="First yellow card";
        array["GAF"]="No clean sheet";
        array["PGL"]="Last team to score";
        array["OSL"]="Last offside";
        array["STL"]="Last substitution";
        array["CNL"]="Last corner";
        array["CDL"]="Last card";
        array["RCL"]="Not To Score";
        array["YCL"]="Last yellow card";
        array["GAL"]="Clean sheet";
        array["PG"]="First / Last team to score";
        array["OS"]="First offside / Last offside";
        array["ST"]="First substitution / Last substitution";
        array["CN"]="First corner / Last corner";
        array["CD"]="First card / Last card";
        array["RC"]="To Score / Not To Score";
        array["YC"]="First yellow card / Last yellow card";
        array["GA"]="No clean sheet / Clean sheet";

        array["No"] = "No";
        array["Y"] = "YES";
        array["N"] = "NO";
        array["FG_S"] = "Shot";
        array["FG_H"] = "Header";
        array["FG_N"] = "No Goal";
        array["FG_P"] = "Penalty";
        array["FG_F"] = "Free Kick";
        array["FG_O"] = "Own Goal";

        array["RPF_1"] = "3rd Round";
        array["RPF_2"] = "4th Round";
        array["RPF_3"] = "5th Round";
        array["RPF_OV"] = "6th Round or Later";

        array["T3G_1"] = "U26";
        array["T3G_2"] = "U27+";
        array["T3G_N"] = "No Goal";

        array["T1G_N"] = "No Goal";
        array["T1G_1"] = "0 - 14:59 Mins";
        array["T1G_2"] = "15 - 29:59 Mins";
        array["T1G_3"] = "30 Mins – Half Time";
        array["T1G_4"] = "Start of 2nd Half – 59:59 Mins";
        array["T1G_5"] = "60 – 74:59 Mins";
        array["T1G_6"] = "75 – Full Time End of 90 Mins";

        array["MQ_H"]=" - U90";
        array["MQ_C"]=" - U90";
        array["MQ_HOT"]=" - Extra Time";
        array["MQ_COT"]=" - Extra Time";
        array["MQ_HPK"]=" - Penalty";
        array["MQ_CPK"]=" - Penalty";
        array["RNB_P"]="No Booking";
        array["RNC_P"]="No Corner";
        array["RS_P"]="No Penalty";
        array["RS_Y"]="Goal";
        array["RS_N"]="No Goal";

        array["FT_title1"]="GOALS";
        array["FT_title2"]="GOALS";
        // array["AGMH"] = "0 - 14:59 Mins";
        // array["BGMH"] = "15 - 29:59 Mins";
        // array["CGMH"] = "30 Mins – Half Time";
        // array["DGMH"] = "Start of 2nd Half – 59:59 Mins";
        // array["EGMH"] = "60 – 74:59 Mins";
        // array["FGMH"] = "75 – Full Time End of 90 Mins";

        array["AGMH"] = "Start of 1st Half - 14:59 Mins";
        array["BGMH"] = "15:00 - 29:59 Mins";
        array["CGMH"] = "30:00 Mins - Half Time";
        array["HGMH"] = "Half Time";
        array["DGMH"] = "Start of 2nd Half - 59:59 Mins";
        array["EGMH"] = "60:00 - 74:59 Mins";
        array["FGMH"] = "75:00 Mins - Full Time";
        array["GMH"] = "Full Time";

        array["TAGMH"] = "Start of Match - 4:59 Mins";
        array["TBGMH"] = "5:00 - 9:59 Mins";
        array["TCGMH"] = "10:00 Mins - Half Time";
        array["THGMH"] = "Half Time";
        array["TDGMH"] = "Start of 2nd Half - 19:59 Mins";
        array["TEGMH"] = "20:00 - 24:59 Mins";
        array["TFGMH"] = " 25:00 Mins - Full Time";
        array["TGMH"] = "Full Time";

        array["BH"] = "To Win from Behind";
        array["ARG"] = "1st Goal";
        array["BRG"] = "2nd Goal";
        array["CRG"] = "3rd Goal";
        array["DRG"] = "4th Goal";
        array["ERG"] = "5th Goal";
        array["FRG"] = "6th Goal";
        array["GRG"] = "7th Goal";
        array["HRG"] = "8th Goal";
        array["IRG"] = "9th Goal";
        array["JRG"] = "10th Goal";
        array["FG"] = "First Goal Method";
        array["F2G"] = "Race to 2 Goals";
        array["F3G"] = "Race to 3 Goals";
        array["T1G"] = "Time of 1st Goal";
        array["T3G"] = "Time of 1st Goal - 3-Way";
        array["TK"] = "Team to Kick Off";
        array["PA"] = "Penalty Awarded";
        array["RCD"] = "Red Card(Player)";
        array["RPS"] = "Penalty Shootout";

        array["MQ"]="Qualifying Method";
        array["MW"]="Winning Method";
        array["OG"]="Own Goal";
        array["OT"]="Extra Time";
        array["RSHA"]="1st Penalty Shootout";
        array["RSHB"]="2nd Penalty Shootout";
        array["RSHC"]="3rd Penalty Shootout";
        array["RSHD"]="4th Penalty Shootout";
        array["RSHE"]="5th Penalty Shootout";
        array["RSHF"]="6th Penalty Shootout";
        array["RSHG"]="7th Penalty Shootout";
        array["RSHH"]="8th Penalty Shootout";
        array["RSHI"]="9th Penalty Shootout";
        array["RSHJ"]="10th Penalty Shootout";
        array["RSHK"]="11th Penalty Shootout";
        array["RSHL"]="12th Penalty Shootout";
        array["RSHM"]="13th Penalty Shootout";
        array["RSHN"]="14th Penalty Shootout";
        array["RSHO"]="15th Penalty Shootout";
        array["RPF"]="Finishing Round";
        array["RNC1"]="1st Corner";
        array["RNC2"]="2nd Corner";
        array["RNC3"]="3rd Corner";
        array["RNC4"]="4th Corner";
        array["RNC5"]="5th Corner";
        array["RNC6"]="6th Corner";
        array["RNC7"]="7th Corner";
        array["RNC8"]="8th Corner";
        array["RNC9"]="9th Corner";
        array["RNCA"]="10th Corner";
        array["RNCB"]="11th Corner";
        array["RNCC"]="12th Corner";
        array["RNCD"]="13th Corner";
        array["RNCE"]="14th Corner";
        array["RNCF"]="15th Corner";
        array["RNCG"]="16th Corner";
        array["RNCH"]="17th Corner";
        array["RNCI"]="18th Corner";
        array["RNCJ"]="19th Corner";
        array["RNCK"]="20th Corner";
        array["RNCL"]="21th Corner";
        array["RNCM"]="22th Corner";
        array["RNCN"]="23th Corner";
        array["RNCO"]="24th Corner";
        array["RNCP"]="25th Corner";
        array["RNCQ"]="26th Corner";
        array["RNCR"]="27th Corner";
        array["RNCS"]="28th Corner";
        array["RNCT"]="29th Corner";
        array["RNCU"]="30th Corner";
        array["RNBA"]="1st Booking";
        array["RNBB"]="2nd Booking";
        array["RNBC"]="3rd Booking";
        array["RNBD"]="4th Booking";
        array["RNBE"]="5th Booking";
        array["RNBF"]="6th Booking";
        array["RNBG"]="7th Booking";
        array["RNBH"]="8th Booking";
        array["RNBI"]="9th Booking";
        array["RNBJ"]="10th Booking";
        array["RNBK"]="11th Booking";
        array["RNBL"]="12th Booking";
        array["RNBM"]="13th Booking";
        array["RNBN"]="14th Booking";
        array["RNBO"]="15th Booking";

        array["F01"] = "Frame 1";
        array["F02"] = "Frame 2";
        array["F03"] = "Frame 3";
        array["F04"] = "Frame 4";
        array["F05"] = "Frame 5";
        array["F06"] = "Frame 6";
        array["F07"] = "Frame 7";
        array["F08"] = "Frame 8";
        array["F09"] = "Frame 9";
        array["F10"] = "Frame 10";
        array["F11"] = "Frame 11";
        array["F12"] = "Frame 12";
        array["F13"] = "Frame 13";
        array["F14"] = "Frame 14";
        array["F15"] = "Frame 15";
        array["F16"] = "Frame 16";
        array["F17"] = "Frame 17";
        array["F18"] = "Frame 18";
        array["F19"] = "Frame 19";
        array["F20"] = "Frame 20";
        array["F21"] = "Frame 21";
        array["F22"] = "Frame 22";
        array["F23"] = "Frame 23";
        array["F24"] = "Frame 24";
        array["F25"] = "Frame 25";
        array["F26"] = "Frame 26";
        array["F27"] = "Frame 27";
        array["F28"] = "Frame 28";
        array["F29"] = "Frame 29";
        array["F30"] = "Frame 30";
        array["F31"] = "Frame 31";
        array["F32"] = "Frame 32";
        array["F33"] = "Frame 33";
        array["F34"] = "Frame 34";
        array["F35"] = "Frame 35";

        array["RFA01"] = "Game 1";
        array["RFA02"] = "Game 2";
        array["RFA03"] = "Game 3";
        array["RFA04"] = "Game 4";
        array["RFA05"] = "Game 5";
        array["RFA06"] = "Game 6";
        array["RFA07"] = "Game 7";
        array["RFA08"] = "Game 8";
        array["RFA09"] = "Game 9";
        array["RFA10"] = "Game 10";
        array["RFA11"] = "Game 11";
        array["RFA12"] = "Game 12";
        array["RFA13"] = "Game 13";

        array["RFB01"] = "Game 1";
        array["RFB02"] = "Game 2";
        array["RFB03"] = "Game 3";
        array["RFB04"] = "Game 4";
        array["RFB05"] = "Game 5";
        array["RFB06"] = "Game 6";
        array["RFB07"] = "Game 7";
        array["RFB08"] = "Game 8";
        array["RFB09"] = "Game 9";
        array["RFB10"] = "Game 10";
        array["RFB11"] = "Game 11";
        array["RFB12"] = "Game 12";
        array["RFB13"] = "Game 13";

        array["RFC01"] = "Game 1";
        array["RFC02"] = "Game 2";
        array["RFC03"] = "Game 3";
        array["RFC04"] = "Game 4";
        array["RFC05"] = "Game 5";
        array["RFC06"] = "Game 6";
        array["RFC07"] = "Game 7";
        array["RFC08"] = "Game 8";
        array["RFC09"] = "Game 9";
        array["RFC10"] = "Game 10";
        array["RFC11"] = "Game 11";
        array["RFC12"] = "Game 12";
        array["RFC13"] = "Game 13";
        array["RFC14"] = "Game 14";
        array["RFC15"] = "Game 15";
        array["RFC16"] = "Game 16";
        array["RFC17"] = "Game 17";
        array["RFC18"] = "Game 18";
        array["RFC19"] = "Game 19";
        array["RFC20"] = "Game 20";
        array["RFC21"] = "Game 21";
        array["RFC22"] = "Game 22";
        array["RFC23"] = "Game 23";
        array["RFC24"] = "Game 24";
        array["RFC25"] = "Game 25";
        array["RFC26"] = "Game 26";
        array["RFC27"] = "Game 27";
        array["RFC28"] = "Game 28";
        array["RFC29"] = "Game 29";
        array["RFC30"] = "Game 30";
        array["RFC31"] = "Game 31";
        array["RFC32"] = "Game 32";
        array["RFC33"] = "Game 33";
        array["RFC34"] = "Game 34";
        array["RFC35"] = "Game 35";
        array["RFC36"] = "Game 36";
        array["RFC37"] = "Game 37";
        array["RFC38"] = "Game 38";
        array["RFC39"] = "Game 39";
        array["RFC40"] = "Game 40";
        array["RFC41"] = "Game 41";
        array["RFC42"] = "Game 42";
        array["RFC43"] = "Game 43";
        array["RFC44"] = "Game 44";
        array["RFC45"] = "Game 45";
        array["RFC46"] = "Game 46";
        array["RFC47"] = "Game 47";
        array["RFC48"] = "Game 48";
        array["RFC49"] = "Game 49";
        array["RFC50"] = "Game 50";

        array["RFD01"] = "Game 1";
        array["RFD02"] = "Game 2";
        array["RFD03"] = "Game 3";
        array["RFD04"] = "Game 4";
        array["RFD05"] = "Game 5";
        array["RFD06"] = "Game 6";
        array["RFD07"] = "Game 7";
        array["RFD08"] = "Game 8";
        array["RFD09"] = "Game 9";
        array["RFD10"] = "Game 10";
        array["RFD11"] = "Game 11";
        array["RFD12"] = "Game 12";
        array["RFD13"] = "Game 13";

        array["RFE01"] = "Game 1";
        array["RFE02"] = "Game 2";
        array["RFE03"] = "Game 3";
        array["RFE04"] = "Game 4";
        array["RFE05"] = "Game 5";
        array["RFE06"] = "Game 6";
        array["RFE07"] = "Game 7";
        array["RFE08"] = "Game 8";
        array["RFE09"] = "Game 9";
        array["RFE10"] = "Game 10";
        array["RFE11"] = "Game 11";
        array["RFE12"] = "Game 12";
        array["RFE13"] = "Game 13";
        array["RFE14"] = "Game 14";
        array["RFE15"] = "Game 15";
        array["RFE16"] = "Game 16";
        array["RFE17"] = "Game 17";
        array["RFE18"] = "Game 18";
        array["RFE19"] = "Game 19";
        array["RFE20"] = "Game 20";
        array["RFE21"] = "Game 21";
        array["RFE22"] = "Game 22";
        array["RFE23"] = "Game 23";
        array["RFE24"] = "Game 24";
        array["RFE25"] = "Game 25";
        array["RFE26"] = "Game 26";
        array["RFE27"] = "Game 27";
        array["RFE28"] = "Game 28";
        array["RFE29"] = "Game 29";
        array["RFE30"] = "Game 30";
        array["RFE31"] = "Game 31";
        array["RFE32"] = "Game 32";
        array["RFE33"] = "Game 33";
        array["RFE34"] = "Game 34";
        array["RFE35"] = "Game 35";
        array["RFE36"] = "Game 36";
        array["RFE37"] = "Game 37";
        array["RFE38"] = "Game 38";
        array["RFE39"] = "Game 39";
        array["RFE40"] = "Game 40";
        array["RFE41"] = "Game 41";
        array["RFE42"] = "Game 42";
        array["RFE43"] = "Game 43";
        array["RFE44"] = "Game 44";
        array["RFE45"] = "Game 45";
        array["RFE46"] = "Game 46";
        array["RFE47"] = "Game 47";
        array["RFE48"] = "Game 48";
        array["RFE49"] = "Game 49";
        array["RFE50"] = "Game 50";

        // basketball
        array["str_BK_0"] ="1st Quarter";
        array["str_BK_1"] ="2nd Quarter";
        array["str_BK_2"] ="3rd Quarter";
        array["str_BK_3"] ="4th Quarter";
        array["str_BK_4"] ="1st Half";
        array["str_BK_5"] ="2nd Half";
        array["str_BK_6"] ="Extra Time";
        array["str_BK_7"] ="Full Time";

        // tennis game
        array["str_TN_game_1"] = "SET 1";
        array["str_TN_game_2"] = "SET 2";
        array["str_TN_game_3"] = "SET 3";
        array["str_TN_game_4"] = "SET 4";
        array["str_TN_game_5"] = "SET 5";

        // tennis overall result
        array["str_TN_0"] = "1st Set";
        array["str_TN_1"] = "2nd Set";
        array["str_TN_2"] = "3rd Set";
        array["str_TN_3"] = "4th Set";
        array["str_TN_4"] = "5th Set";
        array["str_TN_5"] = "Game Handicap";
        array["str_TN_6"] = "Player Games Over / Under";
        array["str_TN_7"] = "Final";

        // volleyball
        array["str_VB_0"] = "1st Set";
        array["str_VB_1"] = "2nd Set";
        array["str_VB_2"] = "3rd Set";
        array["str_VB_3"] = "4th Set";
        array["str_VB_4"] = "5th Set";
        array["str_VB_5"] = "6th Set";
        array["str_VB_6"] = "7th Set";
        array["str_VB_7"] = "Point Handicap";
        array["str_VB_8"] = "Final"

        //  badminton tabletennis
        array["str_BMTT_0"] = "1st Game";
        array["str_BMTT_1"] = "2nd Game";
        array["str_BMTT_2"] = "3rd Game";
        array["str_BMTT_3"] = "4th Game";
        array["str_BMTT_4"] = "5th Game";
        array["str_BMTT_5"] = "6th Game";
        array["str_BMTT_6"] = "7th Game";
        array["str_BMTT_7"] = "Point Handicap";
        array["str_BMTT_8"] = "Player Points Over / Under";
        array["str_BMTT_9"] = "Final"

        //baseball
        array["str_BS_Y"] = "YES";
        array["str_BS_N"] = "NO";
        array["str_BS_0"] = "1st 5 Innings";
        array["str_BS_1"] = "Full Time";

        //shooker
        array["str_SK_0"] = "Frames 1 - 5";
        array["str_SK_1"] = "Frames 6 - 8";
        array["str_SK_2"] = "Frames 10 - 14";
        array["str_SK_3"] = "Frames 15 - 17";
        array["str_SK_4"] = "Frames 19 - 23";
        array["str_SK_5"] = "Frames 24 - 26";
        array["str_SK_6"] = "Full Time";
        // totalBets result detail end

        //過濾器
        array["str_ALL"] = "All Sports";
        array["str_FT"] = "Soccer";
        array["str_BK"] = "Basketball / American Football";
        array["str_ES"] = "eSports";
        array["str_TN"] = "Tennis";
        array["str_VB"] = "Volleyball";
        array["str_BM"] = "Badminton";
        array["str_TT"] = "Table Tennis";
        array["str_BS"] = "Baseball";
        array["str_SK"] = "Snooker";
        array["str_OP"] = "Other Sports";
        array["str_SFS"] = "S Outright";
        array["str_FS"] = "Outright";

        array["str_wmc_ALL"] = "All";
        array["str_wmc_FT"] = array["str_FT"];
        array["str_wmc_BK"] = array["str_BK"];
        array["str_wmc_ES"] = array["str_ES"];
        array["str_wmc_TN"] = array["str_TN"];
        array["str_wmc_VB"] = array["str_VB"];
        array["str_wmc_BM"] = array["str_BM"];
        array["str_wmc_TT"] = array["str_TT"];
        array["str_wmc_BS"] = array["str_BS"];
        array["str_wmc_SK"] = array["str_SK"];
        array["str_wmc_OP"] = array["str_OP"];
        array["str_wmc_SFS"] =array["str_SFS"];
        array["str_wmc_FS"] = array["str_FS"];

        array["btns_gtype"] = "SPORTS";
        array["btns_stake"] = "STAKE";
        array["btns_view"] = "VIEW";
        array["btns_downline"] = "DOWNLINE";
        array["btns_league"] = "LEAGUE";
        array["btns_datestarted"] = "DATE";
        array["btns_market"] = "MARKET";
        array["btns_eventdate"] = "EVENT DATE";
        array["btns_class"] = "CLASS";
        array["btns_dateoutright"] = "DATE";
        array["btns_date"] = "DATE";
        array["btns_dateresult"] = "DATE";
        array["btns_event"] = "EVENT";
        array["btns_bettype"] = "BET TYPE";
        array["btns_site"] = "SITE";

        array["str_market_ALL"] = "All Market";
        array["str_market_rb"] = "In-Play";
        array["str_market_ft"] = "Today";
        array["str_market_fu"] = "Early";

        array["str_wmc_market_ALL"] ="All";
        array["str_wmc_market_rb"] = array["str_market_rb"];
        array["str_wmc_market_ft"] = array["str_market_ft"];
        array["str_wmc_market_fu"] = array["str_market_fu"];

        array["filter_view_full"] = "Full Percentage";
        array["filter_view_com"] = "Company %" ;
        array["filter_view_c"] = "SMA %" ;
        array["filter_view_s"] = "MA %" ;
        array["filter_view_a"] = "Agent %" ;
        array["filter_view_csa"] = "SMA + MA + Agent %" ;
        array["filter_view_cs"] = "SMA + MA %" ;
        array["filter_view_sa"] = "MA + Agent %" ;
        array["filter_view_my"] = "My Percentage";

        array["filter_date_yesterday"] = "Yesterday";
        array["filter_date_today"] = "Today";
        array["filter_date_future"] = "Future";
        array["filter_date_all"] = "All";
        array["filter_date_show"] = "Dates";

        array["filter_downline_show"] = "Downline";
        array["filter_league_show"] = "League";
        array["filter_market_show"] = "Market";

        array["filter_err_downline_max"] = "You may select a maximum of *LIMITCOUNT* accounts at a time";

        array["filter_market_all"] = "All";
        array["filter_market_rb"] = "In-Play only";
        array["filter_market_pl"] = "Pre-Start only";

        array["filter_more"] = ">";
		array["filter_less"] = "<";
		array["filter_same"] = "=";

        array["str_day"] = "Day";

        array["CancelType0"]  = "Result";
        array["CancelType-1"]  = "Match Cancelled";
        array["CancelType-2"]  = "Wrong Team Name";
        array["CancelType-3"]  = "Postponed";
        array["CancelType-4"]  = "Irregular Event Time";
        array["CancelType-5"]  = "Suspended";
        array["CancelType-6"]  = "Retirement";
        array["CancelType-7"]  = "Wrong Home / away";
        array["CancelType-8"]  = "Wrong League Name";
        array["CancelType-9"]  = "No PK / Extra Time";
        array["CancelType-10"] = "Fixture Event Error";
        array["CancelType-11"] = "Invisible Match";
        array["CancelType-12"] = "Cancel";
        array["CancelType-13"] = "Suspended";
        array["CancelType-14"] = "No Set";
        array["CancelType_SK-14"] = "No Frame";




        //Ricky 2018-03-06 PJB-188 CRM-249網球下一局獨贏
        array["title_RFA01_0_TN"] = "Money Line - Set 1 Game 1";
        array["title_RFA02_0_TN"] = "Money Line - Set 1 Game 2";
        array["title_RFA03_0_TN"] = "Money Line - Set 1 Game 3";
        array["title_RFA04_0_TN"] = "Money Line - Set 1 Game 4";
        array["title_RFA05_0_TN"] = "Money Line - Set 1 Game 5";
        array["title_RFA06_0_TN"] = "Money Line - Set 1 Game 6";
        array["title_RFA07_0_TN"] = "Money Line - Set 1 Game 7";
        array["title_RFA08_0_TN"] = "Money Line - Set 1 Game 8";
        array["title_RFA09_0_TN"] = "Money Line - Set 1 Game 9";
        array["title_RFA10_0_TN"] = "Money Line - Set 1 Game 10";
        array["title_RFA11_0_TN"] = "Money Line - Set 1 Game 11";
        array["title_RFA12_0_TN"] = "Money Line - Set 1 Game 12";
        array["title_RFA13_0_TN"] = "Money Line - Set 1 Game 13";
        array["title_RFB01_0_TN"] = "Money Line - Set 2 Game 1";
        array["title_RFB02_0_TN"] = "Money Line - Set 2 Game 2";
        array["title_RFB03_0_TN"] = "Money Line - Set 2 Game 3";
        array["title_RFB04_0_TN"] = "Money Line - Set 2 Game 4";
        array["title_RFB05_0_TN"] = "Money Line - Set 2 Game 5";
        array["title_RFB06_0_TN"] = "Money Line - Set 2 Game 6";
        array["title_RFB07_0_TN"] = "Money Line - Set 2 Game 7";
        array["title_RFB08_0_TN"] = "Money Line - Set 2 Game 8";
        array["title_RFB09_0_TN"] = "Money Line - Set 2 Game 9";
        array["title_RFB10_0_TN"] = "Money Line - Set 2 Game 10";
        array["title_RFB11_0_TN"] = "Money Line - Set 2 Game 11";
        array["title_RFB12_0_TN"] = "Money Line - Set 2 Game 12";
        array["title_RFB13_0_TN"] = "Money Line - Set 2 Game 13";
        array["title_RFC01_0_TN"] = "Money Line - Set 3 Game 1";
        array["title_RFC02_0_TN"] = "Money Line - Set 3 Game 2";
        array["title_RFC03_0_TN"] = "Money Line - Set 3 Game 3";
        array["title_RFC04_0_TN"] = "Money Line - Set 3 Game 4";
        array["title_RFC05_0_TN"] = "Money Line - Set 3 Game 5";
        array["title_RFC06_0_TN"] = "Money Line - Set 3 Game 6";
        array["title_RFC07_0_TN"] = "Money Line - Set 3 Game 7";
        array["title_RFC08_0_TN"] = "Money Line - Set 3 Game 8";
        array["title_RFC09_0_TN"] = "Money Line - Set 3 Game 9";
        array["title_RFC10_0_TN"] = "Money Line - Set 3 Game 10";
        array["title_RFC11_0_TN"] = "Money Line - Set 3 Game 11";
        array["title_RFC12_0_TN"] = "Money Line - Set 3 Game 12";
        array["title_RFC13_0_TN"] = "Money Line - Set 3 Game 13";
        array["title_RFC14_0_TN"] = "Money Line - Set 3 Game 14";
        array["title_RFC15_0_TN"] = "Money Line - Set 3 Game 15";
        array["title_RFC16_0_TN"] = "Money Line - Set 3 Game 16";
        array["title_RFC17_0_TN"] = "Money Line - Set 3 Game 17";
        array["title_RFC18_0_TN"] = "Money Line - Set 3 Game 18";
        array["title_RFC19_0_TN"] = "Money Line - Set 3 Game 19";
        array["title_RFC20_0_TN"] = "Money Line - Set 3 Game 20";
        array["title_RFC21_0_TN"] = "Money Line - Set 3 Game 21";
        array["title_RFC22_0_TN"] = "Money Line - Set 3 Game 22";
        array["title_RFC23_0_TN"] = "Money Line - Set 3 Game 23";
        array["title_RFC24_0_TN"] = "Money Line - Set 3 Game 24";
        array["title_RFC25_0_TN"] = "Money Line - Set 3 Game 25";
        array["title_RFC26_0_TN"] = "Money Line - Set 3 Game 26";
        array["title_RFC27_0_TN"] = "Money Line - Set 3 Game 27";
        array["title_RFC28_0_TN"] = "Money Line - Set 3 Game 28";
        array["title_RFC29_0_TN"] = "Money Line - Set 3 Game 29";
        array["title_RFC30_0_TN"] = "Money Line - Set 3 Game 30";
        array["title_RFC31_0_TN"] = "Money Line - Set 3 Game 31";
        array["title_RFC32_0_TN"] = "Money Line - Set 3 Game 32";
        array["title_RFC33_0_TN"] = "Money Line - Set 3 Game 33";
        array["title_RFC34_0_TN"] = "Money Line - Set 3 Game 34";
        array["title_RFC35_0_TN"] = "Money Line - Set 3 Game 35";
        array["title_RFC36_0_TN"] = "Money Line - Set 3 Game 36";
        array["title_RFC37_0_TN"] = "Money Line - Set 3 Game 37";
        array["title_RFC38_0_TN"] = "Money Line - Set 3 Game 38";
        array["title_RFC39_0_TN"] = "Money Line - Set 3 Game 39";
        array["title_RFC40_0_TN"] = "Money Line - Set 3 Game 40";
        array["title_RFC41_0_TN"] = "Money Line - Set 3 Game 41";
        array["title_RFC42_0_TN"] = "Money Line - Set 3 Game 42";
        array["title_RFC43_0_TN"] = "Money Line - Set 3 Game 43";
        array["title_RFC44_0_TN"] = "Money Line - Set 3 Game 44";
        array["title_RFC45_0_TN"] = "Money Line - Set 3 Game 45";
        array["title_RFC46_0_TN"] = "Money Line - Set 3 Game 46";
        array["title_RFC47_0_TN"] = "Money Line - Set 3 Game 47";
        array["title_RFC48_0_TN"] = "Money Line - Set 3 Game 48";
        array["title_RFC49_0_TN"] = "Money Line - Set 3 Game 49";
        array["title_RFC50_0_TN"] = "Money Line - Set 3 Game 50";
        array["title_RFD01_0_TN"] = "Money Line - Set 4 Game 1";
        array["title_RFD02_0_TN"] = "Money Line - Set 4 Game 2";
        array["title_RFD03_0_TN"] = "Money Line - Set 4 Game 3";
        array["title_RFD04_0_TN"] = "Money Line - Set 4 Game 4";
        array["title_RFD05_0_TN"] = "Money Line - Set 4 Game 5";
        array["title_RFD06_0_TN"] = "Money Line - Set 4 Game 6";
        array["title_RFD07_0_TN"] = "Money Line - Set 4 Game 7";
        array["title_RFD08_0_TN"] = "Money Line - Set 4 Game 8";
        array["title_RFD09_0_TN"] = "Money Line - Set 4 Game 9";
        array["title_RFD10_0_TN"] = "Money Line - Set 4 Game 10";
        array["title_RFD11_0_TN"] = "Money Line - Set 4 Game 11";
        array["title_RFD12_0_TN"] = "Money Line - Set 4 Game 12";
        array["title_RFD13_0_TN"] = "Money Line - Set 4 Game 13";
        array["title_RFE01_0_TN"] = "Money Line - Set 5 Game 1";
        array["title_RFE02_0_TN"] = "Money Line - Set 5 Game 2";
        array["title_RFE03_0_TN"] = "Money Line - Set 5 Game 3";
        array["title_RFE04_0_TN"] = "Money Line - Set 5 Game 4";
        array["title_RFE05_0_TN"] = "Money Line - Set 5 Game 5";
        array["title_RFE06_0_TN"] = "Money Line - Set 5 Game 6";
        array["title_RFE07_0_TN"] = "Money Line - Set 5 Game 7";
        array["title_RFE08_0_TN"] = "Money Line - Set 5 Game 8";
        array["title_RFE09_0_TN"] = "Money Line - Set 5 Game 9";
        array["title_RFE10_0_TN"] = "Money Line - Set 5 Game 10";
        array["title_RFE11_0_TN"] = "Money Line - Set 5 Game 11";
        array["title_RFE12_0_TN"] = "Money Line - Set 5 Game 12";
        array["title_RFE13_0_TN"] = "Money Line - Set 5 Game 13";
        array["title_RFE14_0_TN"] = "Money Line - Set 5 Game 14";
        array["title_RFE15_0_TN"] = "Money Line - Set 5 Game 15";
        array["title_RFE16_0_TN"] = "Money Line - Set 5 Game 16";
        array["title_RFE17_0_TN"] = "Money Line - Set 5 Game 17";
        array["title_RFE18_0_TN"] = "Money Line - Set 5 Game 18";
        array["title_RFE19_0_TN"] = "Money Line - Set 5 Game 19";
        array["title_RFE20_0_TN"] = "Money Line - Set 5 Game 20";
        array["title_RFE21_0_TN"] = "Money Line - Set 5 Game 21";
        array["title_RFE22_0_TN"] = "Money Line - Set 5 Game 22";
        array["title_RFE23_0_TN"] = "Money Line - Set 5 Game 23";
        array["title_RFE24_0_TN"] = "Money Line - Set 5 Game 24";
        array["title_RFE25_0_TN"] = "Money Line - Set 5 Game 25";
        array["title_RFE26_0_TN"] = "Money Line - Set 5 Game 26";
        array["title_RFE27_0_TN"] = "Money Line - Set 5 Game 27";
        array["title_RFE28_0_TN"] = "Money Line - Set 5 Game 28";
        array["title_RFE29_0_TN"] = "Money Line - Set 5 Game 29";
        array["title_RFE30_0_TN"] = "Money Line - Set 5 Game 30";
        array["title_RFE31_0_TN"] = "Money Line - Set 5 Game 31";
        array["title_RFE32_0_TN"] = "Money Line - Set 5 Game 32";
        array["title_RFE33_0_TN"] = "Money Line - Set 5 Game 33";
        array["title_RFE34_0_TN"] = "Money Line - Set 5 Game 34";
        array["title_RFE35_0_TN"] = "Money Line - Set 5 Game 35";
        array["title_RFE36_0_TN"] = "Money Line - Set 5 Game 36";
        array["title_RFE37_0_TN"] = "Money Line - Set 5 Game 37";
        array["title_RFE38_0_TN"] = "Money Line - Set 5 Game 38";
        array["title_RFE39_0_TN"] = "Money Line - Set 5 Game 39";
        array["title_RFE40_0_TN"] = "Money Line - Set 5 Game 40";
        array["title_RFE41_0_TN"] = "Money Line - Set 5 Game 41";
        array["title_RFE42_0_TN"] = "Money Line - Set 5 Game 42";
        array["title_RFE43_0_TN"] = "Money Line - Set 5 Game 43";
        array["title_RFE44_0_TN"] = "Money Line - Set 5 Game 44";
        array["title_RFE45_0_TN"] = "Money Line - Set 5 Game 45";
        array["title_RFE46_0_TN"] = "Money Line - Set 5 Game 46";
        array["title_RFE47_0_TN"] = "Money Line - Set 5 Game 47";
        array["title_RFE48_0_TN"] = "Money Line - Set 5 Game 48";
        array["title_RFE49_0_TN"] = "Money Line - Set 5 Game 49";
        array["title_RFE50_0_TN"] = "Money Line - Set 5 Game 50";

        array["HT"] = "HT";
        array["1H"] = "1H";
        array["2H"] = "2H";
        array["BK_HT"] = "1st Half";
        array["BK_H2"] = "2nd Half";
        array["BK_Q1"] = "Q1";
        array["BK_Q2"] = "Q2";
        array["BK_Q3"] = "Q3";
        array["BK_Q4"] = "Q4";
        array["BK_OT"] = "OT";
        array["BK_half_time"] = "Half Time";

        array["BK_HT_allbet"] = "1st Half";
        array["BK_H2_allbet"] = "2nd Half";
        array["BK_Q1_allbet"] = "Q1";
        array["BK_Q2_allbet"] = "Q2";
        array["BK_Q3_allbet"] = "Q3";
        array["BK_Q4_allbet"] = "Q4";
        array["BK_OT_allbet"] = "OT";
        array["BK_half_time_allbet"] = "Half Time";

        array["Best_of_3"] = "Best of 3";
        array["Best_of_5"] = "Best of 5";
        array["Best_of_7"] = "Best of 7";
        array["Best_of_12"] = "Best of 12";

        array["midfield"] = "N";
        array["live"] = "live";

        array["ES_Match"] = "";
		array["ES_Specials"] = "GAME *TYPE* - ";
		array["ES_M10"] = "GAME *TYPE* DRAFT - 09:59 - ";
		array["ES_M20"] = "GAME *TYPE* 10:00 - 19:59 - ";
		array["ES_HT"] = "GAME *TYPE* 1ST HALF - ";
		array["ES_1"] = "";
		array["ES_2"] = "DURATION";
		array["ES_3"] = "KILLS";
		array["ES_4"] = "*TEAM_H* KILLS";
		array["ES_5"] = "*TEAM_C* KILLS";
		array["ES_6"] = "TOWERS";
		array["ES_7"] = "*TEAM_H* TOWERS";
		array["ES_8"] = "*TEAM_C* TOWERS";
		array["ES_9"] = "DRAGONS";
		array["ES_10"] = "BARONS";
		array["ES_11"] = "INHIBITORS";
		array["ES_12"] = "ROSHANS";
		array["ES_13"] = "BARRACKS";
		array["ES_14"] = "*TEAM_H* ROUNDS";
		array["ES_15"] = "*TEAM_C* ROUNDS";
		array["ES_GameNumber"] = "Game *GAME_NUMBER*";

        return array;
    }

    _self.get = function (_key) {
        // if(LangxAry[_key]==null)return _key;
        return LangxAry[_key];
    }

}

function record_index(_win, _dom){
    var _self = this;
    var classname = "records_index";
    var win = _win;
    var dom = _dom;
    var parentClass;

    var util = new win.util(win,dom);
    var config_set = new win.config_set();
    var storage = new LocalstorageManager();
    var Timer = win.Timer;
    var getView = win.getView;
    var fastTemplate_a1 = win.fastTemplate_a1;
    var cookie = new CookieManager();
    var eventHandler = new Object();
    var retryTimer;
    var bodyFrame = null;
    var failCount = new Object();
    var first_load = false;
    var cache_html_sw = false;
    var pageHash = new Object();
    var classHash = new Object();
    var timerHash = new Object();
    var defalutPage = false;
    var filterFrame = null;
    var LS;
    var LS_code;
    var alertFrame = null;
    var _top;
    var paramObj = new Object();



    top.url = util.getWebUrl()+"/transform.php";
    top["htmlAry"] = new Array();
    top["keepCss"] = new Array();

    _self.init = function(){
        if(opener == null){
            // alert("I want to play a Game.");
            window.close();
            return;
        }
		top.uid = <?php echo json_encode(isset($_GET['uid']) ? $_GET['uid'] : ''); ?>;
		top.langx = <?php echo json_encode(isset($_GET['langx']) ? $_GET['langx'] : ''); ?>;
		top.login_layer = <?php echo json_encode(isset($_GET['login_layer']) ? $_GET['login_layer'] : ''); ?>;
		top.ver = <?php echo json_encode(isset($_GET['ver']) ? $_GET['ver'] : ''); ?>;
		top.ls = <?php echo json_encode(isset($_GET['ls']) ? $_GET['ls'] : ''); ?>;
		top.username = <?php echo json_encode(isset($_GET['username']) ? $_GET['username'] : ''); ?>;
		top.user_id = <?php echo json_encode(isset($_GET['user_id']) ? $_GET['user_id'] : ''); ?>;
		top.view_user = <?php echo json_encode(isset($_GET['view_user']) ? $_GET['view_user'] : ''); ?>;
		top.view_id = <?php echo json_encode(isset($_GET['view_id']) ? $_GET['view_id'] : ''); ?>;
		top.view_layer = <?php echo json_encode(isset($_GET['view_layer']) ? $_GET['view_layer'] : ''); ?>;
        top.param = "login_layer="+top.login_layer+"&uid="+top.uid+"&langx="+top.langx+"&ver="+top.ver;
    

        var query = _win.location.search.substring(1);
        var vars = query.split("&");
        for (var i=0;i<vars.length;i++) {
            var p = vars[i].split("=");
            paramObj[p[0]] = p[1];
        }
        var pp = "login_layer="+top.login_layer+"&uid="+top.uid+"&langx="+top.langx+"&ver="+top.ver;
        if(paramObj.hasOwnProperty("id")){ pp += "&id="+paramObj["id"];}
        if(paramObj.hasOwnProperty("layer")){ pp += "&layer="+paramObj["layer"];}
        top.param = pp;
        _self.initTool();
        _self.setParentclass();
        try{
            var load_name = dom.getElementById("load_txt");
            var load_name02 = dom.getElementById("load_txt02");
            load_name.innerHTML = LS.get("loading_txt");
            load_name02.innerHTML = LS.get("loading_txt");
        }catch(e){}

        _self.bodyGoToPage({"page":"app_record_list","retFun":_self.checkOpener});
    }


    _self.initTool = function(){
        config_set.init();
        LS = eval("new LS_"+top.ls+"();");
        LS_code = eval("new LS_code_"+top.ls+"();");
        LS.init();
        LS_code.init();
    }

    _self.setParentclass = function(){
        util.setParentclass(_self);
    }

    _self.getThis = function(varible){
        return eval(varible);
    }

    _self.getParentThis = function(varible){
        return parentClass.getThis(varible);
    }

    _self.checkOpener = function(){
        // console.log("WMC Complete!!!!");
        _self.setLoadingVisible(false);

    }

    _self.showLoading = function(param){
        if(!defalutPage) defalutPage = param.defalutPage;
        else _self.setLoadingVisible(param.showLoading);
    }

    _self.setLoadingVisible = function(isShow){
        dom.getElementById("loading").style.display = isShow?"":"none";
    }

    _self.bodyGoToPage = function(param){
        if (bodyFrame && bodyFrame.exitConfirm && !bodyFrame.LeaveChk && !param.LeaveChkPass) {
            //exitConfirm 離開確認參數
            //LeaveChk confirm後可否離開
            //LeaveChkPass param帶參數強制掉過此判斷
            _self.exitConfirm(_self.bodyGoToPage, param, bodyFrame.exitConfirm);
            return;
        } else {
            _self.setLoadingVisible(true);

            var ret = false;
            if (bodyFrame && bodyFrame.exitEvent){
                ret = bodyFrame.exitEvent();
            }else{
                ret = true;
            }

            if(ret){
                ret = _self.clearAllTimer();
                if(ret) _self.goToPage("body_show", param.page, _self.definedParent, param);
            }
        }
    }

    _self.definedParent = function(param){
        // console.log(param);
        try{
            var obj = classHash[param.page];
            if(param["extendsClass"]){
                obj = util.extendsClass(eval("new "+param["extendsClass"]+"(win,dom,param.postHash)"), eval(param.page), win, dom, param["postHash"]);
            }else{
                obj = eval("new "+param.page+"(win,dom,param.postHash);");
            }
            if(param.isTrans=="Y"){
                var parantClass = (param.parentClass!=null)?param.parentClass:_self;
                obj.setParentclass(parantClass);
                obj.init();
                if (param.retChild) param.retChild(obj);
            }else{
                bodyFrame = obj;
                bodyFrame.setParentclass(_self);
                bodyFrame.init();
            }
        }catch(e){
            util.err("[definedParent]["+param.page+"]", e);
        }

        if(param.retFun) param.retFun(param.retParam);
    }

    _self.exitConfirm = function (retFun, param, confirm_par) {
        if (confirm_par.isEdit && !confirm_par.isEdit()){
            bodyFrame.LeaveChk = true;
            retFun(param);
            return;
        }
        _self.showLoading({ "showLoading": false });
        util.showMsg(confirm_par["Alert"].msg, confirm_par["Alert"].mode, function (msg) {
            if (msg == "yes") {
                bodyFrame.LeaveChk = true;
                //當確認離開時有留下遺言 做ifYes
                if (confirm_par.ifYes) {
                    confirm_par.ifYes(confirm_par.YesParam);
                }
                retFun(param);
            } else {
                bodyFrame.LeaveChk = false;
                //當不想離開時要把畫面還原等動作 做ifNo
                if (confirm_par.ifNo) {
                    confirm_par.ifNo(confirm_par.NoParam);
                }
                return false;
            }
        });
    }

    _self.goToPage = function(target, page, retFun, param){

        clearTimeout(retryTimer);
        if(!failCount[page]) failCount[page] = 0;

        var page_name = target+"_"+page+"_"+top.ver;
        var retryLimit = config_set.get("RECORD_LIMIT");
        var retryTime = config_set.get("RECORD_RELOAD");

        var ht = new HttpRequest();
        ht.addEventListener("onError", function(){
            if(failCount[page] < retryLimit){
                failCount[page]++;
                retryTimer = setTimeout(_self.goToPage, retryTime, target, page, retFun, param);
            }else{
                if(target=="body_show") bodyFrame.init();
                _self.setLoadingVisible(false);
            }
        });

        ht.addEventListener("LoadComplete", function(html){
            failCount[page] = 0;

            var tempHtml = new win.parseHTML(html);
            var dbody = tempHtml.getTag("div")[0];
            var sty = tempHtml.getTag("style");
            var scp = tempHtml.getTag("script");

            if(!dbody){
                try{
                    var errHash = JSON.parse(html);
                    if(util.chkErrorMsg(errHash,LS_code)) return;
                }catch(e){
                    util.err("["+classname+"]", e);
                }
            }

            // 將不必要的js css移除，避免負擔
            var ret = false;
            if (first_load && target=="body_show"){
                ret =  _self.clearHead();
            }else{
                ret = true;
            }

            if(ret){
                for(var j=0; j<scp.length; j++){
                    try{
                        var scpt = document.createElement("script");
                        if(scp[j].src){
                            scpt.src = scp[j].src;
                        }else{
                            scpt.innerHTML = scp[j].innerHTML;
                            scpt.id = page+"JS";
                        }
                        dom.getElementsByTagName("head")[0].appendChild(scpt);
                    }catch(e){
                        util.err("["+classname+"]", e);
                    }
                }

                for(var i=0; i<sty.length; i++){
                    sty[i].id = page+"CS";
                    dom.getElementsByTagName("head")[0].appendChild(sty[i]);
                }

                pageHash[page_name] = dbody.innerHTML;
                dom.getElementById(target).innerHTML = dbody.innerHTML;

                retFun(param);
            }
        });

        if(cache_html_sw && pageHash[page_name]){
            dom.getElementById(target).innerHTML = pageHash[page_name];
            retFun(param);
        }else{
            var _post = "p="+page+"&ver="+top.ver+"&login_layer="+top.login_layer+"&langx="+top.langx;
            if(top.uid!="")_post+="&uid="+top.uid;
            if(param.post) _post+="&"+param.post;
            ht.loadURL(top.url, "POST" , _post);
        }

    }

    _self.addEventListener = function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.clearAllTimer = function(isInit){
        for(var keys in timerHash){
            if(isInit){
                if(timerHash[keys]!=null){
                    timerHash[keys].clearObj();
                    timerHash[keys] = null;
                }
            }else{
                if(timerHash[keys]!=null && !timerHash[keys].dont_clear){
                    timerHash[keys].clearObj();
                    timerHash[keys] = null;
                }
            }
        }

        return true;
    }

    _self.dispatchEvent=function(eventname, param){
        // util.echo("["+classname+"][dispatchEvent]"+eventname);
        // console.log(eventname);
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }




}
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
function LS_code_cn() {
    var _self = this;
    var parentClass;
    var LangxAry;

    _self.init = function () {
        LangxAry = _self.set();
    }

    _self.set = function () {
        var ary = new Object();
        ary["0X000"] = "无此code码";
        ary["0X001"] = "参数错误";
        ary["0X002"] = "系统错误";

        ary["4X001"] = "IP不合法";
        ary["4X002"] = "您的帐号已被停用，请联系您的上线开启你的帐号.";
        ary["4X003"] = "您的帐号已被禁止登入，请联系您的上线开启你的帐号！";
        ary["4X004"] = "您的帐户已被锁定，由于多次失败的登入。请联系您的上线解封。";
        ary["4X035"] = "您的帐户已到期，请联系您的上线开启你的帐号。";
        ary["4X005"] = "您输入的帐号, 密码或安全码不正确，请再尝试输入。";
        ary["4X006"] = "三分钟后再试";
        ary["4X007"] = "未设定email";
        ary["4X008"] = "无资料";
        ary["4X009"] = "含有特殊字元";
        ary["4X010"] = "登入帐号规则错误";
        //ary["4X011"] = "安全代码规则错误";
        ary["4X011"] = "您的安全代码必须根据以下规则:</br>1. 至少要有两个大或小写英文字母和数字(0 - 9)组合, 字数最少6至12个。</br>2. 三个不同的字母数字。</br>3. 不准许有空格。";
        ary["4X011_ag"] = "登入帐号必须由2个英文大小写字母(A-Z和a-z)和数字(0-9)组合, 输入限制6-12字元.";
        ary["4X012"] = "uid格式错误";
        ary["4X013"] = "首次登入";

        ary["4X014"] = "您已被强制登出。请重新登入。\n";
        ary["4X014"] += "您可能因以下其一原因被登出：\n";
        ary["4X014"] += "1.系统登出。\n";
        ary["4X014"] += "2.您的帐号在多个地方登录。\n";
        ary["4X014"] += "请重新登入。如有任何疑问，请联系上线或客服中心。\n";

        //登3
        ary["4X015_ag"] = "您的登入帐号请勿和帐号或密码相同。";
        //登1或登2
        ary["4X015"] = "您的安全代码请勿和帐号或密码相同。";
        ary["4X016"] = "您输入的帐号已经有人使用了,请回上一页重新输入";
        ary["4X017"] = "已设置过安全代码";
        ary["4X018"] = "原密码错误";
        ary["4X019"] = "您的新密码不能和现用密码相同,请重新輸入。";
        ary["4X020"] = "密码不匹配, 请重新输入。";
        //ary["4X021"] = "密码必须至少6个字元长，最多12个字元长，并只能有数字(0-9)，及英文大小写字母";
        ary["4X021"] = "您的密码必须根据以下规则:</br>1. 至少要有两个大或小写英文字母和数字(0 - 9)组合, 字数最少6至12个。</br>2. 三个不同的字母数字。</br>3. 不准许有空格。";
        ary["4X022"] = "您的密码请勿和帐号或登陆账号相同。";
        ary["4X023"] = "您的密码请勿和帐号或安全代码相同。";
        ary["4X024"] = "您的密码请勿和帐号相同。";
        ary["4X042"] = "验证码不正确, 请重新输入。";
        //2019-10-25 密碼強度 新增語系
        ary["4X040"] = "密码过于简易会导致安全性的问题，请尝试使用其他密码组合。";
        ary["4X041"] = "安全代码过于简易会导致安全性的问题，请尝试使用其他安全代码组合。";

        ary["4X024"] = "该密码您已使用过，为了安全起见，请使用新密码.";
        ary["4X025"] = "此功能暂时已被禁用，请联系您的上线。";
        ary["4X026"] = "验证码发送次数过多，系统暂时不能接受申请，请检查您的资料是否正确。";
        ary["4X027"] = "连不到MailServer";
        ary["4X028"] = "MailServer发送验证码失败";
        ary["4X029"] = "您已超过此验证码的可尝试次数,请重新获取新的验证码。";
        ary["4X030"] = "您输入的验证码不正确，请再尝试输入。";
        ary["4X031"] = "验证码不正确";
        ary["4X032"] = "mail enabled不为Y";
        ary["4X033"] = "您输入的帐户或登入帐号跟电子邮件不匹配, 请再尝试输入。";
        ary["4X034"] = "您已超过每天可获取新验证码的次数,请联络您的上线为你解决密码的问题。";
        ary["4O005"] = "验证码已发送到您的电子邮件";
        ary["4O006"] = "已成功注册";

        return ary;
    }

    _self.get=function(_key){
        return LangxAry[_key]? LangxAry[_key] : _key;
    }

}

function LS_code_tw() {
    var _self = this;
    var parentClass;
    var LangxAry;

    _self.init = function () {
        LangxAry = _self.set();
    }

    _self.set = function () {
        var ary = new Object();
        ary["0X000"] = "無此code碼";
        ary["0X001"] = "參數錯誤";
        ary["0X002"] = "系統錯誤";

        ary["4X001"] = "IP不合法";
        ary["4X002"] = "您的帳號已被停用，請聯繫您的上線開啟你的帳號.";
        ary["4X003"] = "您的帳號已被禁止登入，請聯繫您的上線開啟你的帳號！";
        ary["4X004"] = "您的帳戶已被鎖定，由於多次失敗的登入。請聯繫您的上線解封。";
        ary["4X035"] = "您的帳戶已到期，請聯系您的上線開啟妳的帳號。";
        ary["4X005"] = "您輸入的帳號, 密碼或安全碼不正確，請再嘗試輸入。";
        ary["4X006"] = "三分鐘後再試";
        ary["4X007"] = "未設定email";
        ary["4X008"] = "無資料";
        ary["4X009"] = "含有特殊字元";
        ary["4X010"] = "登入帳號規則錯誤";
        //ary["4X011"] = "安全代碼規則錯誤";
        ary["4X011"] = "您的安全代碼必須根據以下規則:</br>1. 至少要有兩個大或小寫英文字母和數字(0 - 9)組合, 字數最少6至12個。</br>2. 三個不同的字母數字。</br>3. 不准許有空格。";
        ary["4X011_ag"] = "登入帳號必須由2個英文大小寫字母(A-Z和a-z)和數字(0-9)組合, 輸入限制6-12字元.";
        ary["4X012"] = "uid格式錯誤";
        ary["4X013"] = "首次登入";

        ary["4X014"] = "您已被強制登出。請重新登入。\n";
        ary["4X014"] += "您可能因以下其一原因被登出：\n";
        ary["4X014"] += "1.系統登出。\n";
        ary["4X014"] += "2.您的帳號在多個地方登錄。\n";
        ary["4X014"] += "請重新登入。如有任何疑問，請聯繫上線或客服中心。\n";

        //登3
        ary["4X015_ag"] = "您的登入帳號請勿和帳號或密碼相同。";
        //登1或登2
        ary["4X015"] = "您的安全代碼請勿和帳號或密碼相同。";
        ary["4X016"] = "您輸入的帳號已經有人使用了,請回上一頁重新輸入";
        ary["4X017"] = "已設置過安全代碼";
        ary["4X018"] = "原密碼錯誤";
        ary["4X019"] = "您的新密碼不能和現用密碼相同,請重新輸入。";
        ary["4X020"] = "密碼不匹配, 請重新輸入。";
        //ary["4X021"] = "密碼必須至少6個字元長，最多12個字元長，並只能有數字(0-9)，及英文大小寫字母";
        ary["4X021"] = "您的密碼必須根據以下規則:</br>1. 至少要有兩個大或小寫英文字母和數字(0 - 9)組合, 字數最少6至12個。</br>2. 三個不同的字母數字。</br>3. 不准許有空格。";
        ary["4X022"] = "您的密碼請勿和帳號或登陸賬號相同。";
        ary["4X023"] = "您的密碼請勿和帳號或安全代碼相同。";
        ary["4X024"] = "您的密碼請勿和帳號相同。";
        ary["4X042"] = "驗證碼不正確, 請重新輸入。";
        //2019-10-25 密碼強度 新增語系
        ary["4X040"] = "密碼過於簡易會導致安全性的問題，請嘗試使用其他密碼組合。";
        ary["4X041"] = "安全代碼過於簡易會導致安全性的問題，請嘗試使用其他安全代碼組合。";

        ary["4X024"] = "該密碼您已使用過，為了安全起見，請使用新密碼.";
        ary["4X025"] = "此功能暫時已被禁用，請聯繫您的上線。";
        ary["4X026"] = "驗證碼發送次數過多，系統暫時不能接受申請，請檢查您的資料是否正確。";
        ary["4X027"] = "連不到MailServer";
        ary["4X028"] = "MailServer發送驗證碼失敗";
        ary["4X029"] = "您已超過此驗證碼的可嘗試次數,請重新獲取新的驗證碼。";
        ary["4X030"] = "您輸入的驗證碼不正確，請再嘗試輸入。";
        ary["4X031"] = "驗證碼不正確";
        ary["4X032"] = "mail enabled不為Y";
        ary["4X033"] = "您輸入的帳戶或登入帳號跟電子郵件不匹配, 請再嘗試輸入。";
        ary["4X034"] = "您已超過每天可獲取新驗證碼的次數,請聯絡您的上線為你解決密碼的問題。";
        ary["4O005"] = "驗證碼已發送到您的電子郵件";
        ary["4O006"] = "已成功註冊";

        return ary;
    }

    _self.get=function(_key){
        return LangxAry[_key]? LangxAry[_key] : _key;
    }

}
function LS_code_us(){
    var _self = this;
    var parentClass;
    var LangxAry;

    _self.init=function(){
        LangxAry = _self.set();
    }

    _self.set=function(){
        var ary = new Object();
        ary["0X000"] = "無此code碼";
        ary["0X001"] = "參數錯誤";
        ary["0X002"] = "系統錯誤";

        ary["4X001"] = "IP不合法";
        ary["4X002"] = "Your account is inactive.  Please contact your upline for assistance.";
        ary["4X003"] = "Your account was Suspended. Please contact your upline to active your account！";
        ary["4X004"] = "Your account has been locked due to multiple failed login attempts.  Please contact your upline to unlock.";
        ary["4X035"] = "Your account has expired. Please contact your upline to active your account！";
        ary["4X005"] = "Login ID, Password or Safe Code entered is invalid.";
        ary["4X006"] = "三分鐘後再試";
        ary["4X007"] = "未設定email";
        ary["4X008"] = "no data";
        ary["4X009"] = "含有特殊字元";
        ary["4X010"] = "1. Your login ID must be between 6 to 12 alphanumeric characters with at least 2 capital (A-Z) or lowercase letters (a-z) and at least 1 numeric character (0-9)</br>2. Your safe code must not contain any spaces.";
        //ary["4X011"] = "1. Your safe code must be between 6 to 12 alphanumeric characters with at least 2 capital (A-Z) or lowercase letters (a-z) and at least 1 numeric character (0-9)</br>2. Your safe code must not contain any spaces.";
        ary["4X011"] = "Your Safe Code must:</br>1. Be between 6 - 12 alphanumeric characters with at least 2 upper (A - Z) or lowercase letters (a - z) and at least 1 numeric characters (0 - 9).</br>2. Contain at least 3 different alphanumeric characters.</br>3. Not contain any spaces.";
        ary["4X011_ag"] = "Login ID must be between 6 to 12 alphanumeric characters with at least 2 capital (A-Z) or lowercase letters (a - z) and at least 1 numeric character (0 - 9).";
        ary["4X012"] = "uid格式錯誤";
        ary["4X013"] = "首次登入";

        ary["4X014"] = "You have been logged out from this session. Please log in again.\n";
        ary["4X014"] += "You have been logged out for one of the following reasons:\n";
        ary["4X014"] += "1.Your session has timed-out.\n";
        ary["4X014"] += "2.You are logged in on another session.\n";
        ary["4X014"] += "Please log in again. If you have questions or need assistance, please contact you upline or customer service.\n";

        //登3
        ary["4X015_ag"] = "Your Login ID cannot be the same as your password or user code.";
        //登1或登2
        ary["4X015"] = "Your Safe Code cannot be the same as your Password or User Code.";
        ary["4X016"] = "The user name currently used,please go back and input again";
        ary["4X017"] = "已設置過安全代碼";
        ary["4X018"] = "Current Password is invalid.";
        //ary["4X019"] = "Password has been used already.  Please choose another.";
        ary["4X019"] = "Your new Password cannot be the same as your Current Password. Please try again.";
        ary["4X020"] = "Passwords do not match.  Please try again.";
        //ary["4X021"] = "Password must include 6 - 12 words and involve numbers (0-9) and letters (a-z)";
        ary["4X021"] = "Your Password must:</br>1. Be between 6 - 12 alphanumeric characters with at least 2 upper (A - Z) or lowercase letters (a - z) and at least 1 numeric characters (0 - 9).</br>2. Contain at least 3 different alphanumeric characters.</br>3. Not contain any spaces.";
        //ary["4X022"] = "Login ID cannot be the same as your password or user code.";
        //ary["4X023"] = "New Password cannot be the same as you login ID or safe code.";
        ary["4X022"] = "Your Password cannot be the same as you login ID.";
        ary["4X023"] = "Your Password cannot be the same as you login ID or safe code.";
        ary["4X024"] = "Your Password cannot be the same as you login ID.";
        ary["4X042"] = "The verification code is incorrect, Please try again.";
        //2019-10-25 密碼強度 新增語系
        ary["4X040"] = "A simple Password may cause security problems. Please use a different Password combination.";
        ary["4X041"] = "A simple Safe Code may cause security problems. Please use a different Safe Code combination.";

        ary["4X024"] = "Password has been used already.  Please choose another.";
        ary["4X025"] = "Password Recovery is currently disabled.  Please contact your upline.";
        ary["4X026"] = "You have exceeded the number of new verification code allowed.  Unable to generate a new verification code.  Please verify your information.";
        ary["4X027"] = "連不到MailServer";
        ary["4X028"] = "MailServer發送驗證失敗";
        ary["4X029"] = "You have exceeded the number of tries for this verification code.  Please generate a new verification code.";
        ary["4X030"] = "Verification Code entered is invalid.  Please try again.";
        ary["4X031"] = "Invalid verification code.";
        ary["4X032"] = "mail enabled不為Y";
        ary["4X033"] = "The User Code or Login ID and Email Address does not match.  Please try again.";
        ary["4X034"] = "You have exceeded the number of new verification code allowed per day.  Please contact your upline.";
        ary["4O005"] = "Verification Code has been sent to your email.";
        ary["4O006"] = "Successfully Registered.";

        return ary;
    }

    _self.get=function(_key){
        return LangxAry[_key]? LangxAry[_key] : _key;
    }

}
</script>
    <style id="indexCS">@charset "UTF-8";
/*@import url('https://fonts.googleapis.com/css?family=Roboto');*/

html, body, div, span, applet, object, iframe, h1, h2, h3, h4, h5, h6, p, blockquote, pre, a, abbr, acronym, address, big, cite, code, del, dfn, em, font, img, ins, kbd, q, s, samp, small, strike, strong, sub, sup, tt, var, b, u, i, center, dl, dt, dd, ol, ul, li, fieldset, form, label, legend, caption {margin: 0;padding: 0;border: 0;outline: 0;font-size: 100%;vertical-align: baseline;background: transparent;}

html, body {
	width: 100%;
	height:100%;
	background: #F0F0F0;
	font-size: 14px;
	color: rgba(0, 0, 0, .8);
}

ol, ul {list-style: none;}

h1, h2, h3, h4, h5, h6, th{ font-weight:normal;}
a,a:hover{text-decoration:none;color: inherit;}

* {font-family: 'Helvetica', sans-serif;
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	-webkit-touch-callout: none;
	-webkit-text-size-adjust:none;
}
*:hover,*:focus,*:active{outline: 0;-webkit-tap-highlight-color: transparent;}
.hide{display:none}
/* tables still need 'cellspacing="0"' in the markup */
table {border-collapse: collapse;border-spacing: 0;}

tt, em{font-family: 'Helvetica', sans-serif;}
input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button,input[type="button"], input[type="text"], input[type="number"], select, textarea{
	outline:none;
	font-family: 'Helvetica', sans-serif;
	-webkit-appearance: none;
	-moz-appearance: none;
	-ms-appearance: none;
	appearance: none;
}
input[type="text"], input[type="number"], select, textarea{ color: rgba(0, 0, 0, .8);}
input::-ms-clear{display: none;}
input::-ms-reveal{display: none;}
input[type="password"]::-webkit-textfield-decoration-container{	visibility: hidden;}
select{border-radius: 0;}

.nofloat:after{ content:''; display:table; clear:both;}

.green{color: green;}
.red{color: red;}
.blue{color: blue;}
.blueviolet{color: blueviolet;}
.tcenter{text-align: center;}

@media only screen and (min-width: 1024px) {
	::-webkit-scrollbar{ width:10px;height: 10px; background-color:#f1f1f1;}
	::-webkit-scrollbar-thumb { background-color:#c1c1c1; border: 3px #f1f1f1 solid; border-radius:10px;cursor:pointer;
		-webkit-transition:background .5s linear;
		transition:background .5s linear;
	}
	*:hover::-webkit-scrollbar-thumb{background-color:#a9a9a9;}
	::-webkit-scrollbar-corner { background-color:#f1f1f1;}
}


/*架構區*/
.main{
	width: 100%;
	height: 100%;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
}
.main_rotate{height: 100.1%;}/*解決ios12網址+功能列消失 高度出錯及fixed物件原地不動問題*/


.ma_all{
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;

}
.ma_header{
	width: 100%;
	height: 56px;
	z-index: 8;
}
.ma_main, .ma_main_foothide{
	position: relative;
	display: flex;
	width: 100%;
	min-width: 100%;
	height: calc(100% - 56px);
	padding-left: 56px;
	flex-direction: row;
	flex: 0 0 100%;
	overflow: hidden;
}
.ma_foot{
	position: absolute;
	width: 100%;
	height: 56px;
	background-color: #b03427;
	bottom: 0;
	-webkit-transform: translate3d(0,100%,0);
	transform: translate3d(0,100%,0);
	z-index: 7;
}
.ma_right{
	position: fixed;
	top: 0;
	right: 0;
	height: 100%;
	z-index: 1000;
	background-color: #fff;
	box-shadow: -2px 0 4px 0 rgba(0, 0, 0, 0);
	-webkit-transform: translate3d(100%,0,0);
	transform: translate3d(100%,0,0);
}
.ma_right.ma_extend{
	box-shadow: -2px 0 4px 0 rgba(0, 0, 0, .2);
	-webkit-transform: translate3d(0%,0,0);
	transform: translate3d(0%,0,0);
}
.ma_alert{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	z-index: 1000;/*為了報表fixed head問題 因此數值只能再更大*/
}
.ma_loading,
.ma_loadingfull{
	position: absolute;
	right: 0;
	width: calc(100% - 56px);
	height: 100%;
	z-index: 7;
}
.ma_loadingfull{
	position: fixed;
	width: 100%;
	height: calc(100% - 120px);
	top: 120px;
}
.ma_extend ~ .ma_loading{width: calc(100% - 240px);}
.pwd_loading{
	position: fixed;
	width: 100%;
	height: 100%;
	top: 56px;
	left: 0;
	z-index: 7;
}
.filter_loading{
	position: fixed;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	z-index: 3;
}
.ma_onepage{
	width: 100%;
	height: 100%;
}
.ma_left{
	position: absolute;
	display: inline-block;
	width: 56px;
	height: 100%;
	background: #2d4150;
	cursor: pointer;
	-webkit-overflow-scrolling: touch;
	left: 0;
	z-index: 1000;
}
.ma_left.ma_extend{
 	visibility: visible;
	width: 240px;
	-webkit-flex: 0 0 240px;
	-ms-flex: 0 0 240px;
	flex: 0 0 240px;
}
.ma_content{
	position: relative;
	display: inline-block;
	width: 100%;
	height: 100%;
	-webkit-flex: 0 0 100%;
	-ms-flex: 0 0 100%;
	flex: 0 0 100%;
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}
.ma_content>div{
	width: auto;
	height: auto;
	min-height: 100%;
	padding-bottom: 30px;
	overflow: visible;
}
.ma_contentfull{
	width: 100%;
	height: 100%;
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}
.ma_extend ~ .ma_left_mask{position: fixed;width:calc(100vw - 240px);height: 100vh;top: 0;right: 0;}
.ma_extend ~ .ma_right_mask{position: fixed;width:100vw;height: 100vh;top: 0;left: 0;z-index: 8;}
@media only screen and (max-width:1023px){
	.ma_main{
		padding-left: 0;
	}
	.ma_left{
	 	width: 0;
		visibility: collapse;
		transform: translate3d(-56px,0,0);
	}
	.ma_left.ma_extend{
		visibility: visible;
		width: 240px;
		-webkit-transform: translate3d(0%,0,0);
		transform: translate3d(0%,0,0);
	}
	.ma_loading{
		width: 100%;
	}

}
@media only screen and (max-width:767px){
	.ma_left{
		width: 0;
	}
}

/*手機橫版不要有foot*/
@media only screen and (orientation:portrait) and (max-width:767px){
	.ma_main{
		height: calc(100% - 112px);
	}
	.ma_main_foothide{
		height: calc(100% - 56px);
		padding-left: 0;
	}
	.ma_foot{
		-webkit-transform: translate3d(0,0%,0);
		transform: translate3d(0,0%,0);
	}
}

/*橫板若有兩個以上的分頁 將會擋住表單無法滑至底*/
@media only screen and (orientation:landscape) and (max-width:812px){
	.ma_content>div{
		padding-bottom: 96px;
	}
}


@media only screen and (min-width: 1024px){
	.select_min{display: none!important;}
	.accadd_content{
		width: calc(50% - 24px);
		max-width: 668px;
	}
	.accadd_content.content_l{
		float: left;
		clear: left;
		margin: 0 16px 24px 16px;
	}
	.accadd_content.content_r{
		display: inline-block;
		margin-right: 16px;
	}
}
@media only screen and (min-width:1px) and (max-width: 1023px){
	.select_min{position: relative;}
	.select_max{display: none!important;}
	.accadd_content{
		width: calc(100% - 32px);
		margin: 0 16px 24px 16px;
	}
}
@charset "UTF-8";

/*回到頂端鈕*/
.backtop_btn{
	position: fixed;
	width: 40px;
	height: 40px;
	border-radius: 2px;
	background-color: rgba(0, 0, 0, 0.32);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
	bottom: 16px;
	right: 16px;
	z-index: 7;
	-webkit-animation: backAN .5s cubic-bezier(0.42, 0, 0.58, 1.0);
	animation: backAN .5s cubic-bezier(0.42, 0, 0.58, 1.0);
}
.backtop_btn:before{
	content: '';
	position: absolute;
	display: block;
	width: 14px;
	height: 9px;
	background:url(../../images/control/arrowU.svg) no-repeat;
	background-size: cover;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
}

@-webkit-keyframes backAN{
	0%{opacity: 0;}
	100%{opacity: 1;}
}
@keyframes backAN{
	0%{opacity: 0;}
	100%{opacity: 1;}
}



/*可共用按鈕*/
.re_titleG{
	max-width: 100%;
	height: 48px;
	box-shadow:0 -1px 0 #e0e0e0 inset;
	border-radius: 2px 2px 0 0;
	overflow: hidden;
	white-space: nowrap;
	overflow-x: auto;
	overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-justify-content: flex-start;
	-ms-justify-content: flex-start;
	justify-content: flex-start;
}

.re_titleG li{
	position: relative;
	height: 100%;
	padding: 0 16px;
	color: rgba(0, 0, 0, .4);
	letter-spacing:-.5px;
	text-align: center;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
	-webkit-justify-content: center;
	-ms-justify-content: center;
	justify-content: center;
}
.re_titleG.equal li{width: 50%;}
*::-ms-backdrop,
.re_titleG.equal li{ width: 180px; } /*IE11*/
.re_main600 .re_titleG li{
	padding-right: 24px;
	padding-left: 24px;
}
.re_titleG li:before{
	content: '';
	position: absolute;
	display: block;
	width:0;
	height: 2px;
	background-color:#c0392b;
	transform-origin:0 center;
	bottom: 1px;left: 0;
	-webkit-transition::width 200ms ease-in-out;
	-ms-transition::width 200ms ease-in-out;
	transition:width 200ms ease-in-out;
}
.re_titleG li.on{color: #c0392b;}
.re_titleG li.on:before{width: 100%;}
.re_titleG li:after{
	content: '';
	position: absolute;
	display: block;
	width: 100%;
	height: 1px;
	background-color:#e0e0e0;
	bottom: 0;
	left: 0;
}
.ps_submit_btn{
	width: 100%;
	height: 48px;
	line-height: 48px;
	background-color: rgba(56, 187, 143, 1);
	border: 0;
	border-radius: 3px;
	color: #fff;
	font-size: 14px;
	font-weight: bold;
	text-align: center;
	margin-top: 16px;
}
.re_main600 .ps_submit_btn{ margin-top: 0; }

.ps_mini_btnG input,
.re_down_btnG input,
.re_sreachitem_btnG input,
.gray_bg_btn,
.re_sma_submit_btn,
.search_title_btnG input{
	padding: 0 16px;
	height: 48px;
	line-height: 48px;
	border: 0;
	border-radius: 3px;
	font-weight: bold;
	font-size: 14px;
}
.re_sreachitem_btnG input,
.search_title_btnG input{
	height: 40px;
	line-height: 40px;
}

.search_title_btnG{
	padding:10px 16px;
	box-shadow:0 -1px 0 #e0e0e0 inset;
	text-align: right;
}
.ps_mini_cancel_btn{
	background-color:#fff;
	box-shadow:0 0 0 1px rgba(130, 130, 130, .4) inset;
	color: rgba(0, 0, 0, .6);
}
.ps_mini_submit_btn{
	background-color: rgba(56, 187, 143, 1);
	color: #fff;
}

.ps_miniDone_btn{
	padding: 0 21px;
	height: 48px;
	line-height: 48px;
	background-color: rgba(56, 187, 143, 1);
	color: #fff;
	border: 0;
	border-radius: 3px;
	font-weight: bold;
	margin:28px auto auto;
}

.ps_submit_btn:disabled,
.ps_submit_btn:disabled:hover,
.ps_mini_submit_btn:disabled,
.ps_mini_submit_btn:disabled:hover{
	background-color: rgba(56, 187, 143, .4);
	cursor:default;
}

.re_sma_submit_btn{
	width: 100%;
	background-color: #2980b9;
	border-radius: 2px;color: #fff;
}
.gray_bg_btn{
	background-color: #757575;
	color: #fff;
	letter-spacing: .8px;
}
input.input_center{
	text-align: center;
	padding: 0 16px;
	text-transform: uppercase;
}



/*可共用checkbox*/
.checkbox_blue input{display: none;}
.checkbox_blue span{
	display:inline-block;
	width: 16px;
	height: 16px;
	background-color:#fff;
	border: solid 1px #b4b4b4;
	border-radius: 3px;
}
.checkbox_blue input:checked + span{
	background:url(../../images/control/W_check.svg) no-repeat center #2980b9;
	border-color: transparent;
}



/*可共用搜尋*/
/*小的*/
.search_functionG,
.search_function_fullG{
	width: 100%;
	height: 100%;
	background-color: #fff;
	border: solid 1px #c8c8c8;
	border-radius: 3px;
	overflow: hidden;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
}
.search_functionG:after{
	content: '';
	position: absolute;
	width: 40px;
	height: 38px;
	border-width: 1px 1px 1px 0;
	border-color: #7f7f7f;
	border-style: solid;
	border-top-right-radius: 3px;
	border-bottom-right-radius: 3px;
	top: 0;
	right: 0;
	pointer-events: none;
}
.quick_searchG .search_functionG:after{
	width: 48px;
	height: 46px;
}
.wmc_searchG .search_functionG:after{
	top: 16px;
	right: 16px;
}
.re_betSearchG .search_functionG:after{content: none;}
.search_functionTxt{
	height:100%;
	padding: 0 0 0 16px;
	border: 0;
	font-size: 14px;
	-webkit-flex:1 1 auto;
	-ms-flex:1 1 auto;
	flex:1 1 auto;
}
.quick_searchG.tw .search_functionTxt{
	font-size: 16px;
}
.search_functionSubmit_btn,
.search_functionClose_btn,
.search_functionSubmit_tran_btn{
	height: 100%;
	padding: 0;
	background: url(../../images/control/search_white.svg) no-repeat center #7f7f7f;
	border: 0;
	opacity: 1;
	-webkit-flex:0 0 40px;
	-ms-flex:0 0 40px;
	flex:0 0 40px;
}
.quick_searchG .search_functionSubmit_btn,
.quick_searchG .search_functionClose_btn{
	-webkit-flex:0 0 48px;
	-ms-flex:0 0 48px;
	flex:0 0 48px;
}
.search_functionSubmit_btn{border-radius: 0; margin: 0;}
.search_functionClose_btn{background: url(../../images/control/close_x.svg) no-repeat center transparent; opacity: .6;right: 40px;}
.search_functionSubmit_tran_btn{ background: url(../../images/control/search.svg) no-repeat center;
	-webkit-flex:0 0 62px;
	-ms-flex:0 0 62px;
	flex:0 0 62px;
	}/*透明搜尋鈕*/

/*大的*/
.search_function_fullG{border: 0;border-radius: 0;}
.search_function_fullG .search_functionSubmit_btn,
.search_function_fullG .search_functionClose_btn{	
	-webkit-flex:0 0 62px;
	-ms-flex:0 0 62px;
	flex:0 0 62px;
}
.search_function_fullG .search_functionSubmit_btn{background-image: none;}
.search_function_fullG .search_functionSubmit_btn i{
	display: block;
	width: 16px;
	height: 16px;
	margin: auto;
}
.search_function_fullG .search_functionSubmit_btn svg{	fill:#fff;}
.err_input .search_functionSubmit_btn{box-shadow:1px 0px 0 #c0382b inset; }
.search_function_err{
	position: relative;
	padding-left: 20px;
	color: #c0382b;
	font-size: 13px;
	margin-top: 7px;
}
.search_function_err:before,
.search_function_scss:before{
	content: '';
	display: block;
	position: absolute;
	width: 12px;
	height:12px;
	background:url(../../images/control/error.svg) no-repeat;
	top: 2px;
	left: 0;
}





/*可共用內下拉選單*/
/*避免被td其他狀態影響要加上字顏色粗細*/
.select_in_tdG{
	position: relative;
	width: 112px;
	display: inline-block;
	color: rgba(0, 0, 0, .8);
}
.select_in_tdG:after{
	content: '';
	position: absolute;
	display:block;
	width: 11px;height: 7px;
	background: url(../../images/control/re_sreachArr_D.svg) no-repeat;
	top: 0;
	bottom: 0;
	right: 16px;
	margin: auto;
	opacity: .6;
	pointer-events: none;
}
.select_in_tdTitle{font-weight: 600;}
.select_in_tdUL{
	position: absolute;
	width: 128px;
	padding: 8px 0;
	background-color: #fff;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.24);
	text-align: left;
	top: -23px;
	left: -17px;
	z-index: 2;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
}
.select_in_tdUL li{
	position: relative;
	width: 100%;
	height: 48px;
	line-height: 48px;
	padding: 0 17px;
}
.select_in_tdUL li.on{order: 0;}
.select_in_tdUL li.on:after{
	content: '';
	display: block;
	position: absolute;
	width: 11px;
	height: 7px;
	background:url(../../images/control/re_sreachArr_D.svg) no-repeat;
	top: 0;
	bottom: 0;
	right: 16px;
	margin: auto;
}
.select_in_tdUL li span{position: relative;}
.select_in_tdG select{
	background-color: transparent;
	border: 0;
	font-size: 14px;
	font-weight: 600;
}


/*可共用加減號*/
.add_infoG,
.less_infoG{
	width: 16px;
	height: 16px;
	background: url(../../images/control/B_plus.svg) no-repeat;
	margin: auto;
}
.less_infoG{background-image: url(../../images/control/B_less.svg) ;}


/*alert windows*/
.ar_bg{
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .48);
	top: 0;
	left: 0;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-justify-content: center;
	-ms-justify-content: center;
	justify-content: center;
	-webkit-align-items: flex-start;
	-ms-align-items: flex-start;
	align-items: flex-start;
	z-index: 2;
}
.ar_main,
.ar_annG{
	width: 280px;
	padding: 22px 16px 24px; 
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
	margin-top: 178px;
}
.ar_ann_note{
	width: 300px;
	max-height: calc(100% - 120px);
	padding: 0 0 16px;
	background-color: #fff;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
	margin-top: 64px;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
}
.ar_main>h1{
	height: 55px;
	line-height: 59px;
	padding-left: 17px;
	box-shadow: 0 -1px 0 #e1e1e1 inset;
	color: rgba(0, 0, 0, .6);
	font-size: 16px;
}
.ar_annG{
	position: relative;
	width: 520px;
	max-height: calc(100% - 129px);
	padding: 0 0 24px;
	margin-top: 89px;
	overflow-x: hidden;
	overflow-y: auto;	
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
}
.ar_annG._ver_width{
	width: 360px;
}
.ar_title{
	position: relative;
	width: 100%;
	height: 54px;
	padding:0 17px;
	background-color: #fff;
	border-top-left-radius: 3px;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0);
	top: 0;
	border-top-right-radius: 3px;
	font-size: 16px;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-justify-content: space-between;
	-ms-justify-content: space-between;
	justify-content: space-between;
	-webkit-align-items: center;
	-ms-align-items: center;
	align-items: center;
	flex:none;
}
.ar_ann_note .ar_title{
	width: 100%;
	height: 48px;
	padding:0 17px;
	color: #fff;
	background-color: #b03427;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0);
	border-radius: 0;
	top: 0;
	font-size: 16px;
	font-weight: bold;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-justify-content: center;
	-ms-justify-content: center;
	justify-content: center;
	-webkit-align-items: center;
	-ms-align-items: center;
	align-items: center;
	-webkit-flex:0 0 48px;
	-ms-flex:0 0 48px;
	flex:0 0 48px;
}
._ver_width  .ar_title{
	height: 32px;
	padding: 0 31px 0 17px;
}
.ar_title.scroll{box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);}
.ar_x_btn{
	width: 12px;
	height: 12px;
	background:url(../../images/control/close_x_w.svg) no-repeat center;
	border: 0;
	background-size: contain;
	opacity: .6;
}
.ar_ann_note .ar_x_btn{
	position: absolute;
	right: 17px;
	top: 17px;
	width: 14px;
	height: 14px;
}
.ar_ann_note .ar_gray_btn{
	width: 100%;
}
.ar_scroll{
	padding:5px 17px 0;
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}
.ar_ann_note .ar_scroll{padding: 16px 16px 0;}
.ar_ann_txtUL li{
	padding-bottom: 14px;
	border-bottom: 1px solid #e1e1e1;
	margin-bottom: 12px;
	word-break: break-word;
}
.ar_ann_txtUL li:last-child{
	padding-bottom: 0;
	border-bottom: 0;
}
.ar_note_txtUL li{
	margin-bottom: 16px;
	color: rgba(0, 0, 0, 0.64);
}
.ar_note_txtUL h1{
	font-weight: bold;
	height: 24px;
	line-height: 24px;
}
.ar_note_txtUL.EN h1{
	height: 20px;
	line-height: 20px;
}
.ar_note_txtUL p{
	display: block;
	margin-top: 20px;
}
.ar_note_txtUL h1 + p{
	margin-top: 0;
}
.ar_note_txtUL div + div{
	margin-top: 16px;
}
.ar_note_txtUL span{
	display: block;
	width: 100%;
	min-height: 130px;
	box-shadow: 0 0 0 1px #e0e0e0 inset;
	margin-bottom: 8px;
}
.ar_note_txtUL img{
	width: 100%;
	vertical-align: middle;
}
.ar_main_txt{line-height: 18px;}
.ar_main_txt h1{
	font-weight: 600;
	font-size: 16px;
	margin-bottom: 17px;
}
.ar_main_txtUL li{
	line-height: 17px;
	margin-bottom: 19px;
}
.ar_main_txtUL li:last-child{margin-bottom: 0;}
.ar_main_txtUL span{
	display: block;
	font-weight: 600;
	margin-bottom: 2px;
}
.ar_btnG{
	text-align: right;
	margin-top: 21px;
}
.ar_gray_btn{
	min-width: 65px;
	height: 48px;
	line-height: 48px;
	background-color: rgba(0, 0, 0, 0.54);
	border-radius: 3px;
	border: 0;
	color: #fff;
	font-size: 14px;
}
.ar_green_btn{
	width: 100%;
	height: 48px;
	line-height: 48px;
	padding: 0 16px;
	background-color: #38bb8f;
	border-radius: 3px;
	border: 0;
	color: #fff;
	font-size: 14px;
}


.ps_sendCode{
	position:fixed;
	width: 315px;
	height: 40px;
	padding: 0 16px;
	background-color: #404040;
	border-radius: 1px;
	bottom: 16px;
	left: 0;
	right: 0;
	margin: auto;
	visibility: collapse;
	z-index: 2;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-justify-content: space-between;
	-ms-justify-content: space-between;
	justify-content: space-between;
	-webkit-align-items: center;
	-ms-align-items: center;
	align-items: center;
}
.ps_sendCode span{
	color: #fff;
	font-weight: normal;
	text-align: center;
	-webkit-flex:1 1 auto;
	-ms-flex:1 1 auto;
	flex:1 1 auto;
}
.ps_sendCode_btn{
	padding: 0;
	background-color: transparent;
	border: 0;
	color: #38bb8f;
	font-weight: bold;
	flex: none;
}
.ps_copyArea{
	position: absolute;
	opacity: 0;
}



/*共用無資料畫面*/
.data_noneG{
	padding-top: 26px;
	text-align: center;
	color: rgba(0, 0, 0, .6);
}
.re_detail_scroll .data_noneG{border-top: 1px solid #e0e0e0;}
.err404{
	position: fixed;
	width: 100%;
	height: 100%;
	background:url(../../images/control/err404.png)  #fff center no-repeat;
	top: 0;
	left: 0;
	z-index: 2;
}

/*width height*/
.w100per{width: 100%;}
.w192px{width: 192px;}
.w200px{width: 200px;}
.w360px{width: 360px;}
.h100per{height: 100%;}
.h93px{height: 93px;}
.minH35{min-height: 35vh;}
.minH50{min-height: 50vh;}
.accadd_content.content_l.minH50{min-height: 500px;}
.minH80{min-height: 80vh;}
.m_noH{margin:0;}

.mt13{margin-top: 13px;}

.mb12{margin-bottom: 12px;}

.ml7{margin-left: 7px;}
.ml12{margin-left: 12px;}
.ml15{margin-left: 15px;}

.mr6{margin-right: 6px;}
.mr7{margin-right: 7px;}
.mr28{margin-right: 28px;}

.down_txt{vertical-align: bottom;}
.top_txt{vertical-align: top;}

/*position*/
.por{
	position: relative;
	height: 100%;
}
.poa{position: absolute;}



/*background border */
.bgf0f0f0{
	min-height: 100%;
	background-color: #f0f0f0;
}
.noborder{border: 0;}

/*狀態變化border*/
.err_input{border-color:#c0382b;}
.focus_input{
	box-shadow: 0 0 4px 0 rgba(69, 144, 194, 0.16);
	border: solid 1px #4590c2;
}/*很多線都是外層div做成非input 所以無法用:focus*/




/*word*/
.word_link{
	color: #2980b9;
	font-weight: 600;
}
.word_link.on{color: #660099;}
.txtc,
.re_table_main td.txtc,
td.txtc, th.txtc, span.txtc, div.txtc{text-align: center;}
.txtl, td.txtl, th.txtl, span.txtl, div.txtl{text-align: left;}
.txtr, td.txtr, th.txtr, span.txtr, div.txtr{text-align: right;}
.word_bold, td.word_bold, li.word_bold{font-weight: bold;}
.word_bold300, td.word_bold300{font-weight: 300;}
.word_bold500, td.word_bold500{font-weight: 600;}/*客人臨時改600*/
.word_nomal, td.word_nomal{font-weight: normal;}
.word_paleRed{color: #b14334;}
.word_lightpink{color: #ffc7c1;}
.word_lightRed{color: #dc7480;}
.word_red{color: #c0382b;}
.word_canvOrange{color: #f38b12;}
.word_orange{color: #f3b932;}
.word_lightOrange{color: #eba01e;}
.word_darkOrange{color: #bb9742;}
.word_milkOrange{color: #c09552;}
.word_lightGreen{color: #38bb8f;}
.word_paleGreen, .re_table_head02G td.word_lightGreen{color: #96e6cd;}
.word_green{color: #27a67b;}
.word_green_a8{color: rgba(39,166,123,8);}
.word_darkGreen{color: #33ab82;}
.word_lightBlue{color: rgba(93, 200, 238, .8);}
.word_canvBlue{color: #2b82ba;}
.word_blue{color: #2980b9;}
.word_lightGray{color: #666;}
.word_gray{color: rgba(0, 0, 0, .6);}
.word_black{color: #000;}
.word_black_a8{color: rgba(0, 0, 0, .8);}
.word_white02_a8{color: rgba(248, 248, 248, .8);}
.word_white_a6,
tr.tbet_table_head02G td.word_white_a6{color: rgba(255, 255, 255, .6);}
.word_white_a8{color: rgba(255, 255, 255, .8);}
.word_brown{color: #987e66;}
.word_select, .word_select_txt::selection {
	color:#4b4600;
	background: rgb(255,240,40);
}
.word_delline{text-decoration:line-through; }

.fz12{font-size: 12px;}
.fz16{font-size: 16px;}

/*input[type=password]{font-size: 22px;letter-spacing: 3px;}密碼點點變大如果需要再開啟*/
::-webkit-input-placeholder{color:rgba(0, 0, 0, .6);}
::-moz-placeholder{color:rgba(0, 0, 0, .6);}
::-ms-input-placeholder {color:rgba(0, 0, 0, .6);}

/*animate*/
/*開啟加上active*/
.use_animate{
	opacity: 0;
	visibility: collapse;
	z-index: 6;
	-webkit-transform: scale(1, 0);
	-ms-transform: scale(1, 0);
	transform: scale(1, 0);
	-webkit-transform-origin:0 0;
	-ms-transform-origin:0 0;
	transform-origin:0 0;
	-webkit-transition:all 300ms cubic-bezier(.55,0,.42,1);
	-ms-transition:all 300ms cubic-bezier(.55,0,.42,1);
	transition:all 300ms cubic-bezier(.55,0,.42,1);
}

.active .use_animate,
.active + .use_animate{
	opacity: 1;
	visibility: visible;
	-webkit-transform: scale(1, 1);
	-ms-transform: scale(1, 1);
	transform: scale(1, 1);
}


/*關閉加上active*/
.high_animate{
	height: 100%;
	opacity: 1;
	visibility: visible;
	-webkit-transform-origin:center 0;
	-ms-transform-origin:center 0;
	transform-origin:center 0;
	-webkit-transform: scale(1, 1);
	-ms-transform: scale(1, 1);
	transform: scale(1, 1);
	-webkit-transition:all 300ms cubic-bezier(.55,0,.42,1);
	-ms-transition:all 300ms cubic-bezier(.55,0,.42,1);
	transition:all 300ms cubic-bezier(.55,0,.42,1);
}

.active .high_animate,
.active + .high_animate{
	height: 0;
	opacity: 0;
	visibility: collapse;
	-webkit-transform: scale(1, 0);
	-ms-transform: scale(1, 0);
	transform: scale(1, 0);
}

.ma_main,
.ma_header,
.ma_left,
.ma_foot,
.ma_right,
.mu_memberDetailG,
.lg_input,
.ma_loading,
.re_functionG{ 
	-webkit-transition:all 300ms cubic-bezier(.55,0,.42,1);
	-ms-transition:all 300ms cubic-bezier(.55,0,.42,1);
	transition:all 300ms cubic-bezier(.55,0,.42,1);
}

/*X秒出現後消失 X=顯示的秒數*/
.item_disappear5s{
	-webkit-animation: item_5sdisappear 7s cubic-bezier(0.42, 0, 0.58, 1.0) both;
	animation: item_5sdisappear 7s cubic-bezier(0.42, 0, 0.58, 1.0) both;
}
.item_disappear2s{
	-webkit-animation: item_2sdisappear 4s cubic-bezier(0.42, 0, 0.58, 1.0) both;
	animation: item_2sdisappear 4s cubic-bezier(0.42, 0, 0.58, 1.0) both;
}

@-webkit-keyframes item_5sdisappear{
	0%{opacity: 0; visibility: visible;}
	14%{opacity: 1;}
	85%{opacity: 1;}
	100%{opacity: 0;}
}
@keyframes item_5sdisappear{
	0%{opacity: 0; visibility: visible;}
	14%{opacity: 1;}
	85%{opacity: 1;}
	100%{opacity: 0;}
}

@-webkit-keyframes item_2sdisappear{
	0%{opacity: 0; visibility: visible;}
	50%{opacity: 1;}
	75%{opacity: 1;}
	100%{opacity: 0;}
}
@keyframes item_2sdisappear{
	0%{opacity: 0; visibility: visible;}
	50%{opacity: 1;}
	75%{opacity: 1;}
	100%{opacity: 0;}
}



/*Hand*/
.lg_stratum li, .lg_lan_title img, .lg_adcomDot_btn li, .lg_adcomL_btn, .lg_adcomR_btn, .lg_login_btn, .ps_back_btn, .ps_submit_btn, .ps_mini_submit_btn, .ps_mini_cancel_btn, .ps_reset_btn, .ar_gray_btn, .ps_noteIconG, .mu_hab, .mu_back_btn, .mu_btnG li, .le_small_btnG li, .le_small_btnG li:before, .le_big_btnG h1:before, .le_big_btnG h1, .bm_btnG li, .mu_btnG i, .re_selectG>ul li, .re_bettypesG li, .re_dateInfo, .re_titleG li, .re_linkG:after, .backtop_btn, .re_searchclose_btn, .da_linkG span:after, .da_linkG span:hover:before, .re_export_select li, .re_export_select_twoLines li, .re_sreachtermtxt, .re_sreachitem, .re_sreachitem_select, .re_sreachitem>ul>li, .cal_date, .cal_date_left, .re_detailclose_btn, .re_Ibtn, .re_betdetail_close_btn, .re_table_body td, .mu_memberUL li:not(.mu_memberUL_title), .word_link, .re_sma_submit_btn, .lg_lanUL li, .ar_choose_Info li, .url_list_item, .re_table_body_auto td, .re_bet_selectG, .re_td_fixedShadow:after, .re_betdetail_cancelN, .re_betdetail_cancelY, .re_more_btn, .re_more_btn_360, .search_functionSubmit_btn, .search_functionClose_btn, .search_functionSubmit_tran_btn, .checkbox_blue span, .wmc_search_chkG span, .select_in_tdUL, .select_in_tdUL li, .re_settlement_tb tr:not(.fix_trColor), .re_accounting_tb tr:not(.fix_trColor), .re_main600_tb, .wmc_pause_btn, .wmc_clear_btn, .wmc_stake_option span, .wmc_stake_option span:before, .wmc_filter600_info48UL li, .wmc_searchUL li:not(.wmc_searchUL_sp):not(.disabled), .wmc_filter600_info48UL li:after, .tbet_wagers_searchLi, .tbet_menu_txt, .tbet_collapse_img, .tbet_collapse_switch, .tbet_table_body_auto td, .lg_loginold_btn, .tbet_wagers_teamUL, .tbet_inside_btn, .tbet_title_btnG li, .tbet_datatitle_btnG li, .tbet_td_indside_arrIcon,.tbet_td_indside_eidtIcon, .ps_chk_btn, .teach_next_btn, .teach_ok_btn, .re_main600_tb tr:not(.fix_trColor), .aclist-tr.content, .searchbar .select, .titlebar_menu .save, .titlebar_menu .cancel, .credits_item03 .btn_save, .credits_item03 .btn_cancel, .menu_save .save, .menu_save .save_new, .menu_save .cancel, .search_functionSubmit_btn, .ps_sendCode_btn, .ar_x_btn, .ar_title, .ar_notice_btn, .ar_green_btn, .tbet_div_body [class^="tbet_inbody_item"], .tbet_div_body [class^="tbet_body_item"], .tbody_line td, .ver_x_btn, .ver_foot>input, .ver_reset_btn{
	-webkit-transition: color .3s linear, background-color .3s linear,opacity .3s linear,box-shadow .3s linear;
	-ms-transition: color .3s linear, background-color .3s linear,opacity .3s linear,box-shadow .3s linear;
	transition: color .3s linear, background-color .3s linear,opacity .3s linear,box-shadow .3s linear;
}
.hand, .lg_stratum li, .lg_lan_title, .lg_lanUL li, .lg_adcomPage1 span, .lg_adcomL_btn, .lg_adcomR_btn, .lg_adcomDot_btn li, .lg_forget, .lg_login_btn, .ps_back_btn, .ps_submit_btn, .ps_mini_submit_btn, .ps_mini_cancel_btn, .ps_reset_btn, .ar_gray_btn, .ps_noteIconG, .ps_miniDone_btn, .mu_name li, .mu_hab, .mu_back_btn, .mu_btnG li, .le_small_btnG li, .le_big_btnG h1:before, .le_big_btnG h1, .le_big_inside li, .bm_btnG li, .mu_btnG i, .re_selectG>ul li, .re_selectG,.re_bettypesG li , .re_dateInfo, .re_titleG li, .re_linkG, .backtop_btn, .re_searchclose_btn, .da_linkG span, .re_export_select li, .re_export_select_twoLines li, .re_exportG, .re_sort, .re_sreachitem, .re_sreachitem_select, .re_sreachitem>ul>li, .re_detailclose_btn, .re_Ibtn, .re_betdetail_close_btn, .mu_memberUL li:not(.mu_memberUL_title), .eye_icon, .no_eye_icon, .word_link, .re_sma_submit_btn, .ar_choose_Info li, .url_list_item, .search_functionSubmit_btn, .search_functionClose_btn, .select_in_tdUL li, .select_in_tdG, .add_infoG, .wmc_pause_btn, .wmc_clear_btn, .wmc_volume_btn, .wmc_stake_input span, .re_filter_back_btn, .wmc_searchUL li:not(.wmc_searchUL_sp):not(.disabled), .wmc_filter600_back_btn, .wmc_filter600_info48UL li, .tbet_menu_sportsUL li, .tbet_collapse_img, .tbet_collapse_switch, .tbet_inside_btn, .tbet_table_body_auto td, .lg_loginold_btn, .tbet_wagers_teamUL, .tbet_title_btnG li, .tbet_datatitle_btnG li, .tbet_td_indside_arrIcon,.tbet_td_indside_editIcon, .ps_chk_btn.on, .re_breadUL li, .teach_next_btn, .teach_ok_btn, .le_small_inside li, .re_sreachtermtxt, .re_more_btn, .checkbox, .searchbar .select, .menu_save .save, .menu_save .save_new, .menu_save .cancel, .ac_sort, .drop_down li, .mem_detail_backbtn, .ps_sendCode_btn, .ar_x_btn, .ar_notice_btn, .wmc_stake_option, .wmc_search_chkG, .ar_green_btn, .tbet_collapse_td, .tbet_div_headG, .tbet_div_body [class^="tbet_inbody_item"], .tbet_div_body [class^="tbet_body_item"], .tbet_breadG li, .mu_profile, .re_copy_btn, .ver_x_btn, .ver_foot>input, .ver_reset_btn{cursor: pointer;}





@media (pointer:fine),
screen and (-ms-high-contrast: active),
(-ms-high-contrast: none) {	
	.lg_lan_title:hover img,
	.lg_side_title:hover img,
	.da_linkG span:hover:before,
	.da_linkG span:hover:after,
	.re_searchclose_btn:hover,
	.re_detailclose_btn:hover,
	.re_linkG:hover:after,
	.re_selectG:hover:before,
	.re_dateInfo:hover:after,	
	.re_betdetail_close_btn:hover,
	.re_detailclose_btn:hover,
	.tbet_collapse_img:hover,
	.tbet_table_head02G:hover .tbet_collapse_switch,
	.tbet_div_headG:hover .tbet_collapse_switch,
	.lg_adcomL_btn:hover,
	.lg_adcomR_btn:hover,
	.hover_op1,
	.ver_x_btn:hover{opacity:1;}

	.ps_noteIconG:hover:after,
	.re_Ibtn:hover,
	.hover_op084{opacity: .84;}


	.ps_back_btn:hover,
	.le_small_btnG li:hover:before,
	.le_big_btnG h1:hover:before,
	h1.le_titleOn:before,
	.search_functionSubmit_btn:hover,
	.searchbar .select:hover,
	.ar_x_btn:hover,
	.hover_op08,
	.ver_reset_btn:hover{opacity: .8;}
	

	.mu_hab:hover,
	.mu_back_btn:hover,
	.mu_btnG li:hover,
	.add_infoG:hover,
	.ps_reset_btn:hover,
	.wmc_pause_btn:hover,
	.wmc_clear_btn:hover,
	.wmc_filter600_back_btn:hover,
	.re_filter_back_btn:hover,
	.tbet_inside_btn:hover,
	.lg_loginold_btn:hover,
	.hover_op06{opacity: .6;}



	.search_functionClose_btn:hover,
	.search_functionSubmit_tran_btn:hover,
	.tbet_td_indside_arrIcon:hover,
	.tbet_td_indside_editIcon:hover,
	.teach_next_btn:hover,
	.hover_op03{opacity: .3;}

	



	.lg_stratum li:hover,
	.hover_bgc0382b{background-color: #c0382b;color: #fff;}




	.lg_lanUL li:hover,
	.ar_choose_Info li:hover,
	.re_selectG>ul li:hover,
	.cal_date:not(.cal_space):hover,
	.cal_date_left:not(.cal_space):hover,
	.re_bettypesG li:hover,
	.re_sreachitem>ul>li:hover,
	.select_in_tdUL li:hover,
	.wmc_searchUL li:not(.wmc_searchUL_sp):not(.disabled):hover,
	.wmc_filter600_info48UL li:hover,
	.tbet_wagers_searchLi:hover,
	.re_export_select li:hover,
	.re_export_select_twoLines li:hover,
	.re_sreachtermtxt:hover,
	.hover_bge3e3e3{background-color: #e3e3e3;}



	.lg_adcomDot_btn li:hover,
	.hover_bgfff{background-color:#fff;}


	.url_list_item:hover,
	.re_sreachitem:hover,
	.re_sreachitem_select:hover,
	.re_sreachitem.active,
	.re_table_body:hover td,
	.re_table_body_auto:hover td,
	.tbet_table_body_auto:hover td,
	.tbet_wagers_teamUL:hover,
	.re_settlement_tb tr:not(.fix_trColor):hover,
	.re_accounting_tb tr:not(.fix_trColor):hover,
	.re_exchange_tb tr:not(.fix_trColor):hover,
	.re_main600_tb tr:not(.fix_trColor):hover,
	.aclist-tr.content:hover,
	.tr_bgebf7ff td,
	.re_result_div_body:hover,
	.tbet_div_body [class^="tbet_inbody_item"]:hover,
	.tbet_div_body [class^="tbet_body_item"]:hover,	
	.tbody_line:hover td,
	.hover_tr_bgebf7ff{background-color: #ebf7ff;}
	


	
	.hover_text_op08{color: rgba(255, 255, 255, .8);}
	
	
	.ps_submit_btn:hover,
	.ps_mini_submit_btn:hover,
	.ps_miniDone_btn:hover,
	.teach_ok_btn:hover,
	.titlebar_menu .save:hover,
	.credits_item03 .btn_save:hover,
	.menu_save .save:hover,
	.menu_save .save_new:hover,
	.ar_green_btn:hover,
	.hover_bg38bb8f_op06,
	.ver_submit_btn:hover{background-color: rgba(56, 187, 143, .6);}

	.re_sma_submit_btn:hover,
	.hover_bg2980b9_op06{background-color: rgba(41, 128, 185, .6);}

	.lg_login_btn:hover,
	.hover_bg38bb8f_op04{background-color:rgba(56, 187, 143, .4);}


	.ar_gray_btn:hover,
	.hover_bg000_op03,
	.ver_cancel_btn:hover{background-color: rgba(0, 0, 0, .3);}


	.backtop_btn:hover,
	.hover_bg000_op02{background-color: rgba(0, 0, 0, .2);}



	.ps_mini_cancel_btn:hover,
	.titlebar_menu .cancel:hover,
	.credits_item03 .btn_cancel:hover,
	.menu_save .cancel:hover,
	.hover_graybtn{
		background-color: rgba(130, 130, 130, .4);
		box-shadow:0 0 0 1px rgba(130, 130, 130, 0) inset;
		color: #fff;
	}

	
	.mu_memberUL li:not(.mu_memberUL_title):hover,
	.hover_bg000_op01{background-color: rgba(0,0,0,.1);}



	.bm_btnG li:hover,
	.hover_bg000_op008{background-color: rgba(0, 0, 0, 0.08);}



	.le_small_btnG>li:hover,
	.le_big_btnG h1:hover,
	.hover_menuoutside_btn{
		background-color: rgba(0, 0, 0, 0.24);
		color: rgba(255, 255, 255, .8);
	}

	.le_small_inside li:hover,
	.le_big_inside li:hover,
	.hover_textb4e1ff{color:#b4e1ff;}


	
	.re_title600type li.word_red:hover,
	.re_titleG li:hover,
	.hover_textc0392b{color: #c0392b;}

	
	.tbet_menu_sportsUL li:hover .tbet_menu_txt,
	.hover_textc0382b{color: #c0382b;}


	.tbet_datatitle_btnG li:hover,
	.hover_textc34235{color: #c34235;}


	.re_title600type li.word_green:hover,
	.ps_sendCode_btn:hover,
	.hover_text27a67b{color: #27a67b;}
	
		
	.word_link:hover,
	.hover_text660099{color: #660099;}

	.re_selectG:hover,
	.re_dateInfo:hover,
	.hover_shadow_op016{box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.16);}

	.tbet_menu_sportsUL li:hover .tbet_menu_img,
	.hover_allbetmenu_btn{background-position: center top;}

	.tbet_title_btnG li:hover,
	.hover_allbetmenu_text{background-color: #fff;color: #000;}


	.ar_notice_btn:hover{background-color: #ee8b2f;color: #fff;}

}


	.lg_lan_title:active img,
	.lg_side_title:active img,
	.da_linkG span:active:before,
	.da_linkG span:active:after,
	.re_searchclose_btn:active,
	.re_detailclose_btn:active,
	.re_linkG:active:after,
	.re_selectG:active:before,
	.re_dateInfo:active:after,
	.re_betdetail_close_btn:active,
	.re_detailclose_btn:active,
	.tbet_collapse_img:active,
	.tbet_table_head02G:active .tbet_collapse_switch,
	.tbet_div_headG:active .tbet_collapse_switch,
	.lg_adcomL_btn:active,
	.lg_adcomR_btn:active,
	.active_op1,
	.ver_x_btn:active{opacity:1;}

	.ps_noteIconG:active:after,
	.re_Ibtn:active,
	.active_op084{opacity: .84;}


	.ps_back_btn:active,
	.le_small_btnG li:active:before,
	.le_big_btnG h1:active:before,
	h1.le_titleOn:before,
	.search_functionSubmit_btn:active,
	.ar_x_btn:active,
	.searchbar .select:active,
	.active_op08,
	.ver_reset_btn:active{opacity: .8;}
	

	.mu_hab:active,
	.mu_back_btn:active,
	.mu_btnG li:active,
	.add_infoG:active,
	.ps_reset_btn:active,
	.wmc_pause_btn:active,
	.wmc_clear_btn:active,
	.wmc_filter600_back_btn:active,
	.re_filter_back_btn:active,
	.tbet_inside_btn:active,
	.lg_loginold_btn:active,
	.active_op06{opacity: .6;}



	.search_functionClose_btn:active,
	.search_functionSubmit_tran_btn:active,
	.tbet_td_indside_arrIcon:active,
	.tbet_td_indside_editIcon:active,
	.teach_next_btn:active,
	.active_op03{opacity: .3;}

	



	.lg_stratum li:active,
	.active_bgc0382b{
		background-color: #c0382b;
		color: #fff;
	}




	.lg_lanUL li:active,
	.ar_choose_Info li:active,
	.cal_date:active,
	.cal_date_left:active,
	.re_bettypesG li:active,
	.select_in_tdUL li:active,
	.wmc_searchUL li:not(.wmc_searchUL_sp):not(.disabled):active,
	.wmc_filter600_info48UL li:active,
	.tbet_wagers_searchLi:active,
	.re_export_select li:active,
	.re_export_select_twoLines li:active,
	.re_sreachtermtxt:active,
	.active_bge3e3e3{background-color: #e3e3e3;}



	.lg_adcomDot_btn li:active,
	.active_bgfff{background-color:#fff;}


	.url_list_item:active,
	.re_sreachitem:active,
	.re_sreachitem_select:hover,
	.re_sreachitem.active,
	.re_table_body:active td,
	.re_table_body_auto:active td,
	.tbet_table_body_auto:active td,
	.tbet_wagers_teamUL:active,
	.re_settlement_tb tr:not(.fix_trColor):hover,
	.re_accounting_tb tr:not(.fix_trColor):hover,
	.re_exchange_tb tr:not(.fix_trColor):hover,
	.re_main600_tb tr:not(.fix_trColor):hover,
	.aclist-tr.content:hover,
	.tr_bgebf7ff td,
	.re_result_div_body:active,
	.tbet_div_body [class^="tbet_inbody_item"]:active,
	.tbet_div_body [class^="tbet_body_item"]:active,
	.active_tr_bgebf7ff{background-color: #ebf7ff;}
	


	
	.active_text_op08{color: rgba(255, 255, 255, .8);}
	
	
	.ps_submit_btn:active,
	.ps_mini_submit_btn:active,
	.ps_miniDone_btn:active,
	.teach_ok_btn:active,
	.titlebar_menu .save:active,
	.credits_item03 .btn_save:active,
	.menu_save .save:active,
	.menu_save .save_new:active,
	.ar_green_btn:active,
	.active_bg38bb8f_op06,
	.ver_submit_btn:active{background-color: rgba(56, 187, 143, .6);}

	.re_sma_submit_btn:active,
	.active_bg2980b9_op06{background-color: rgba(41, 128, 185, .6);}

	.lg_login_btn:active,
	.active_bg38bb8f_op04{background-color:rgba(56, 187, 143, .4);}


	.ar_gray_btn:active,
	.active_bg000_op03,
	.ver_cancel_btn:active{background-color: rgba(0, 0, 0, .3);}


	.backtop_btn:active,
	.active_bg000_op02{background-color: rgba(0, 0, 0, .2);}



	.ps_mini_cancel_btn:active,
	.titlebar_menu .cancel:active,
	.credits_item03 .btn_cancel:active,
	.menu_save .cancel:active,
	.active_graybtn{
		background-color: rgba(130, 130, 130, .4);
		box-shadow:0 0 0 1px rgba(130, 130, 130, 0) inset;
		color: #fff;
	}

	
	.mu_memberUL li:not(.mu_memberUL_title):active,
	.active_bg000_op01{background-color: rgba(0,0,0,.1);}



	.bm_btnG li:active,
	.active_bg000_op008{background-color: rgba(0, 0, 0, 0.08);}



	.le_small_btnG>li:active,
	.le_big_btnG h1:active,
	.active_menuoutside_btn{
		background-color: rgba(0, 0, 0, 0.24);
		color: rgba(255, 255, 255, .8);
	}

	.le_small_inside li:active,
	.le_big_inside li:active,
	.active_textb4e1ff{color:#b4e1ff;}


	
	.re_title600type li.word_red:active,
	.re_titleG li:active,
	.active_textc0392b{color: #c0392b;}

	
	.tbet_menu_sportsUL li:active .tbet_menu_txt,
	.active_textc0382b{color: #c0382b;}


	.tbet_datatitle_btnG li:active,
	.active_textc34235{color: #c34235;}


	.re_title600type li.word_green:active,
	.ps_sendCode_btn:active,
	.active_text27a67b{color: #27a67b;}
	
		
	.word_link:active,
	.active_text660099{color: #660099;}

	.re_selectG:active,
	.re_dateInfo:active,
	.active_shadow_op016{box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.16);}

	.tbet_menu_sportsUL li:active .tbet_menu_img,
	.active_allbetmenu_btn{background-position: center top;}

	.tbet_title_btnG li:active,
	.active_allbetmenu_text{
		background-color: #fff;
		color: #000;
	}

	.ar_notice_btn:active{
		background-color: #ee8b2f;
		color: #fff;
	}


/*保留功能但清除scrollbar外觀*/
.re_sreachtermG::-webkit-scrollbar,
.tbet_menu_sportsUL::-webkit-scrollbar,
.tbet_datatitle_btnG::-webkit-scrollbar,
.tbet_wagers_amount::-webkit-scrollbar,
.re_titleG:not(.scroll)::-webkit-scrollbar{display: none;}

/*hide*/
.hide_item,
.LPMcontainer{display: none!important;}

@media only screen and (max-width: 1279px){
	.hide_on_1279down_only{display:none!important;}
}/*沒幾個需要用到乾脆獨立*/


@media only screen and (min-width: 1024px){
	.hide_on_large_only{display:none!important;}
}
@media only screen and (min-width: 768px) and (max-width: 1023px){
	.hide_on_med_only{display:none!important; }
}


/*偷渡放這邊*/
@media only screen and (min-width:1px) and (max-width:1023px){
	.accadd_content.content_l.minH50{min-height: auto!important;}
}
@media only screen and (orientation:portrait) and (max-width:767px){
	.ps_sendCode{bottom: 56px;}
	
}
@media only screen and (max-width: 797px){	
	.ps_sendCode{width: 100%;}
	.ps_sendCode span{text-align: left;}
	.backtop_btn{bottom: 72px;}
	.ar_annG{width: calc(100% - 80px);}
}


@media only screen and (min-width: 600px) and (max-width: 767px){
	.hide_on_small_only{display:none!important;}
}


@media only screen and (max-width: 599px){
	.hide_on_mini_only{display:none!important;}	
	.ar_ann_note{max-height:calc(100% - 32px);margin-top: 16px;}	
}

@media only screen and (max-height: 414px){	
	.ar_bg{
		-webkit-align-items: center;
		-ms-align-items: center;
		align-items: center;
	}
	.ar_main, .ar_annG{margin-top: 0;}
}

/*no hand opcity0*/
.opcity0{opacity: 0;}
.no_hand,
.ps_reset_btn.on,
li.wmc_searchUL_sp{cursor: default;}

.mwc_bg_color td{background-color: #a78025;}


@charset "UTF-8";


/*report main*/
.re_main{
    padding: 16px 8px 0;
    background-color:#f0f0f0;
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
    -webkit-align-content: flex-start;
    -ms-align-content: flex-start;
    align-content: flex-start;
}

.re_mleftG,
.re_mrightG{
    padding: 0 8px;
    margin-bottom: 15px;
}
.re_mrightG{
    width: 55%;
    max-width: 674px;
}
.re_bg{
    background-color: #fff;
    border-radius: 2px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16);
}

.re_searchG{padding: 16px;}
.re_selectG{
    position: relative;
    height: 48px;
    border-radius: 3px;
    margin-bottom: 16px;
    box-shadow:1px 0 #c8c8c8 inset,
    -1px 0 0 #c8c8c8 inset,
    0 1px #c8c8c8 inset,
    0 -1px 0 #c8c8c8 inset,
    0 0 4px 0 rgba(0, 0, 0, 0);
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_searchG>div:nth-of-type(1){margin-bottom: 16px;}
.re_searchG>div:nth-of-type(5){margin-bottom: 17px;}
.re_selectG:before, .re_selectG:after{
    content: '';
    position: absolute;
    display: block;
    width: 48px;
    height: calc(100% - 2px);
    top: 1px;
    right: 1px;
    pointer-events: none;
}
.re_selectG:before{background-color: #fff;}
.re_selectG:after{
    background: url(../../images/control/re_sreachArr_D.svg) center no-repeat;
    opacity: .6
}
.re_selectG>span{
    line-height: 48px;
    padding:0 45px 0 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.re_selectG>ul{
    position: absolute;
    width: 100%;
    max-height: 496px;
    padding: 8px 0;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .2);
    top:46px;
    left: 0;
    z-index: 2;
    overflow-x: hidden;overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.re_selectG>ul li{
    position: relative;
    height: 48px;
    line-height: 48px;
    padding: 0 16px;
    background-color: rgba(227, 227, 227, 0);
}
.re_selectG>ul li.on{
    color: #2980b9;
    font-weight: bold;
}
.re_selectG>ul li:after{
    content: '';
    position: absolute;
    display: block;
    width: 11px;
    height: 8px;
    background: url(../../images/control/tick.svg) no-repeat;
    top: 0;
    bottom: 0;
    right: 16px;
    margin: auto;
    opacity: 0;
}
.re_selectG>ul li.on:after{opacity: 1;}
.re_inputG{
    position: relative;
    height: 48px;
    padding: 0 13px;
    border-radius: 3px;
    box-shadow:1px 0 #c8c8c8 inset,
    -1px 0 0 #c8c8c8 inset,
    0 1px #c8c8c8 inset,
    0 -1px 0 #c8c8c8 inset,
    0 0 4px 0 rgba(0, 0, 0, 0);
    font-size: 14px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_inputG span{
    margin-right: 7px;
    white-space: nowrap;
}
.re_inputG input{
    width: 100%;
    background-color: transparent;
    border: 0;
    -webkit-flex:1 1 auto;
    -ms-flex:1 1 auto;
    flex:1 1 auto;
}
.re_inputG input::-webkit-input-placeholder{color: rgba(0, 0, 0, .8);}
.re_inputG input::-moz-placeholder{color: rgba(0, 0, 0, .8);}
.re_inputG input::-ms-input-placeholder {color: rgba(0, 0, 0, .8);}
.re_dateG{
    position: relative;
    margin-bottom: 16px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: space-between;
    -ms-justify-content: space-between;
    justify-content: space-between;
}
.re_selectG select{
    width: 100%;
    height: 100%;
    padding: 0 16px;
    background-color: transparent;
    border: 0;
    font-size: 14px;
}
.re_dateInfo{
    position: relative;
    width:calc(50% - 20px);
    height: 48px;
    line-height: 48px;
    padding:0 30px 0 15px;
    border-radius: 3px;
    box-shadow:1px 0 #c8c8c8 inset,
    -1px 0 0 #c8c8c8 inset,
    0 1px #c8c8c8 inset,
    0 -1px 0 #c8c8c8 inset,
    0 0 4px 0 rgba(0, 0, 0, 0);
}
.re_dateInfo input{
    width: 100%;
    padding: 0;
    background-color: transparent;
    border: 0;
    font-size: 14px;
    letter-spacing: -.3px;
}
.re_dateInfo:after{
    content: '';
    position: absolute;
    display: block;
    width: 14px;
    height: 14px;
    background: url(../../images/control/calendar.svg) no-repeat;
    top: 0;
    bottom: 0;
    right: 13px;
    margin: auto;
    opacity: .6;
}
.re_dateG>span{
    display: block;
    width: 48px;
    height: 48px;
    line-height: 48px;
    color: rgba(0, 0, 0, .4);
    text-align: center;
}
.re_down_btnG{text-align: right;}
.re_betSelectG{
    position: absolute;
    width: 100%;
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .2);
    border-radius: 3px;top: 46px;
    left: 0;
    overflow: hidden;
}
.re_selectDownG{
    max-height:496px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.re_betSearchG{
    height: 56px;
    padding: 8px;
    background-color: #f6f6f6;
    border-bottom: solid 1px #e0e0e0;
    overflow: hidden;
}

.re_bettypesG{
    padding: 8px 0;
    background-color: #fff;
}
.re_bettypesG li{
    min-height: 48px;
    padding: 0 16px;
    border-bottom: 1px solid #fbfbfb;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_bettypesG li:last-child{border: 0;}

/*600以下搜尋*/
.re_filter600{
    padding: 0 8px;
    background-color: #fff;
    min-height: 100vh;
}
.re_filter_titleG{
    width: 100%;
    height: 56px;
    padding: 0 16px;
}
.re_filter_title_item{
    position: relative;
    height: 100%;
    padding-left: 2px;
}
.re_filter_title_item:before{
    content: attr(data-filtertitle);
    position: absolute;
    color: rgba(0, 0, 0, .6);
    font-size: 13px;
    top: 18px;
    left: 38px;
}
.re_filter_titleTxt{
    position: absolute;
    font-size: 18px;
    font-weight: bold;
    top: 35px;
    left: 38px;
}
.re_filter_back_btn{
    width: 37px;
    height: 100%;
    background:url(../../images/control/back_left.svg) no-repeat 0 28px;
    border: 0;
}
.re_filter600 .re_searchG>div:nth-of-type(5){margin-bottom: 0;}
.re_filter600 .ps_submit_btn{font-size: 14px;}

.re_main600{
    height: 100%;
    background-color:#fff;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    -webkit-transform: translate3d(0,0,0);
    transform: translate3d(0,0,0);
}
.re_settlementG{padding:7px 0 16px;}
.re_settlement_tb, .re_accounting_tb, .re_exchange_tb, .re_main600_tb{
    width: 100%;
    text-align: center;
}
.re_settlement_tb tr, .re_accounting_tb tr, .re_main600_tb tr{background-color: rgba(235, 247, 255, 0);}
.re_acc600type td{position: relative;}
.re_acc600type td:before{
    content: attr(data-accmonth);
    position: absolute;
    height: 15px;
    color: rgba(0, 0, 0, .8);
    font-size: 12px;
    top: 0;
    bottom: 0;
    left:24px;
    margin: auto;
}
.re_acc600type td.word_blue{opacity: .8;}
.re_settlement_th01{height: 28px;}
.re_table_title_th{
    height: 27px;
    border-bottom: 2px solid #e0e0e0;
}
.re_table_title_th th{font-size: 12px;}
.re_settlement_tb td{
    padding:16px;
    box-shadow:0 -1px 0 #e0e0e0 inset;
}
.re_settlement_tb td:nth-child(1){text-align: left;}

.re_accountingG, .re_exchangeG{padding:0 0 16px;}
.re_accounting_th, .re_exchange_th{
    font-size: 12px;
    height: 49px;
    border-bottom: 2px solid #e0e0e0;
}
.re_accounting_tb td, .re_exchange_tb td{
    padding:16px;
    box-shadow:0 -1px 0 #e0e0e0 inset;
}
.re_accounting_tb td:nth-child(1){
    text-align: left;
    font-size: 12px;
}

.re_exchange_tb{text-align: left;}
.re_exchange_tb th{
    padding: 0 16px;
    text-align: left;
}
.re_accounting_tb td.on{
    color: #2980b9;
    font-weight: bold;
}

.re_linkG{
    position: relative;
    height: 48px;
    line-height: 48px;
    padding: 0 38px 0 16px;
    background-color: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .16);
    color: rgba(0, 0, 0, 0.64);
    font-weight: bold;
    border-radius: 2px;
    margin-bottom: 8px;
}
.re_linkG:after{
    content: '';
    position: absolute;
    display: block;
    width: 6px;
    height: 10px;
    background: url(../../images/control/B_arrowR.svg) no-repeat;
    background-size: cover;
    top: 0;
    bottom: 0;
    right: 16px;
    margin: auto;
    opacity:.6;
}

.re_main600_tb tr:last-child td{border: none;}
.re_main600_tb th{
    height: 49px;
    padding: 0 25px;
    border-bottom: 2px solid #e0e0e0;
    font-size: 12px;
}
.re_main600_tb td{
    position: relative;
    padding: 16px 25px;
    box-shadow:0 -1px 0 #e0e0e0 inset;
}

.re-acc600type td:before{
    content: attr(data-accmonth);
    position: absolute;
    font-size: 12px;
    left: 25px;
}

.re_titleG.re_title600type li{
    padding-top: 8px;
    line-height: 14px;
}
.re_title600type li.word_red.on{color: #c0392b;}
.re_title600type li.word_green.on{color: #27a67b;}

.re_exc600type th:nth-child(1),
.re_exc600type td:nth-child(1),
.re_set600type th:nth-child(1),
.re_set600type td:nth-child(1) {text-align: left;}
.re_exchange_tb th:nth-child(3),
.re_exchange_tb td:nth-child(3),
.re_exc600type th:nth-child(3),
.re_exc600type td:nth-child(3){text-align: right;}
.re_set600type tr td:nth-child(1){padding: 16px 28px 16px 25px;}




/*報表上方資訊欄*/
.re_main_container {
    position: relative;
    background-color: #fff;
}

.re_breadG{
    position: relative;
    display: flex;
    align-items: center;
    height: 52px;
    padding-right: 16px;
    background-color: #fff;
    border-bottom: 4px solid #e0e0e0;
}
.re_breadUL{
    position: relative;
    display: flex;
    align-items: center;
    flex: 1 1 100%;
    height: 100%;
    padding-left: 16px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}
.re_breadUL::after{
    content: '';
    flex: none;
    width: 16px;
    height: 100%;
}
.re_breadUL li{
    position: relative;
    display: inline-block;
    padding-left: 18px;
    color: #2980b9;
    font-weight: bold;
    white-space: nowrap;
}
.re_breadUL li:first-child{padding-left: 0;}
.re_breadUL li+li:before{
    content: '';
    position: absolute;
    width: 16px;
    height: 100%;
    background: url(../../images/control/bread.svg) no-repeat  center;
    top:0;
    left: -1px;
    text-align: center;
}
.re_copy_btn{
    position: relative;
    flex: none;
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    background-color: #38bb8f;
    border-radius: 3px;
    border: 0;
    color: #fff;
    font-size: 14px;
    font-weight: bold;
    margin: 0 16px 0 8px;
}
.re_copy_btn::before{
    content: '';
    position: absolute;
    width: 16px;
    height: 100%;
    background: linear-gradient(270deg, #fff 0%, rgba(255, 255, 255, 0) 100%);
    top: 0;
    right: calc(100% + 8px);
}
.re_copy_btn i{
    width: 100%;
    height: 100%;
    background: url(../../images/control/icon_copy.svg) no-repeat center;
    display: none;
}
.re_exportG{
    position:absolute;
    width: 20px;
    height:100%;
    top: 0;
    right: 16px;
}
/* 報表特製 */
.re_copy_btn + .re_exportG{
    position: relative;
    flex: none;
    top: auto;
    right: auto;
}
.re_export_icon{
    position: absolute;
    width: 20px;
    height: 16px;
    background:url(../../images/control/more_filter.svg) no-repeat center;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
}
.re_export_select,
.re_export_select_twoLines{
    position: absolute;
    width: 168px;
    padding: 8px 0;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .2);
    top:44px;
    right: -4px;
}
.re_export_select_twoLines{
    max-height:calc(100vh - 230px);
    min-height: 64px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.re_export_select li{
    height: 48px;
    line-height: 48px;
    padding: 0 16px;
    background-color: rgba(227, 227, 227, 0);
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: space-between;
    -ms-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_export_select .re_sort,
.re_export_select_twoLines .re_sort{position: relative;}
.re_export_select .re_sort:after,
.re_export_select_twoLines .re_sort:after{right: 16px;}
.re_export_select_twoLines li{
    height: 48px;
    padding: 0 16px;
    background-color: rgba(227, 227, 227, 0);
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-justify-content: center;
    -ms-justify-content: center;
    justify-content: center;
    -webkit-align-items: flex-start;
    -ms-align-items: flex-start;
    align-items: flex-start;
}
.re_export_select_twoLines div{
    color: rgba(0, 0, 0, .6);
    font-size: 12px;
}
.re_export_select_twoLines span{
    display: inline-block;
    width: 100%;
    font-weight: bold;
    overflow : hidden;
    text-overflow : ellipsis;
    white-space: nowrap;
}

.re_sreachtermG{
    padding:7px 9px;
    background-color: #f0f0f0;
    border-bottom: 4px solid #e0e0e0;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}
.re_sreachterm_title{
    font-size: 12px;
    margin: 0 4px 0 6px;
}
.re_sreachtermtxt{
    display: inline-block;
    padding: 6px 10px;
    background-color: #fff;
    font-size: 12px;
    margin: 0 2px;
    border-radius: 22px;
}

.re_sreachterm_allG1{height: 60px;line-height: 60px;}

.re_sreachterm_allG{
    position: relative;
    height: 60px;
    background-color: #fff;
    border-bottom: 4px solid #e0e0e0;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    -ms-justify-content: flex-start;
    justify-content: flex-start;
}
.title_fixed .re_sreachterm_allG,
.re_sreachterm_allG.noborder{
    height: 56px;
    border-bottom: 0;
}
.re_sreachitem,
.re_sreachitem_select{
    position: relative;
    height: 100%;
    padding: 14px 35px 0 16px;
}
.wmc .re_sreachitem{padding: 14px 25px 0 16px;}
.re_sreachitem_select{
    display: block;
    padding-right: 16px;
}
.re_sreachitem_select select{
    max-width: 134px;
    height: 16px;
    padding: 0;
    background-color: transparent;
    border: 0;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: -.5px;
}
.re_sreachitem:before,
.re_sreachitem_select:before{
    content:attr(data-sreachitem);
    position: relative;
    display: block;
    color: rgba(0, 0, 0, .6);
    font-size: 12px;
    white-space: nowrap;
    top: -1px;
}
.re_sreachitem_dateinput{
    width: 70px;
    padding: 0;
    background-color: transparent;
    border: 0;
    font-size: 14px;
    letter-spacing: -.3px;
}
.re_sreachitem_title{
    position: relative;
    display: inline-block;
    font-weight: bold;
}
.re_sreachitem_title:after{
    position: absolute;
    content: '';
    display:block;
    width: 11px;
    height: 7px;
    background: url(../../images/control/re_sreachArr_D.svg) no-repeat;
    background-size: cover;
    top: 4px;
    right: -19px;
    opacity: .6;
    pointer-events: none;
}
.re_sreachitem_select i{
    position: relative;
    display:inline-block;
    width: 11px;
    height: 7px;
    background: url(../../images/control/re_sreachArr_D.svg) no-repeat;
    background-size: cover;
    top: -1px;
    opacity: .6;
    pointer-events: none;
}
/*客人想換成寬度固定並刪字 多一層span是為了符合程式層級*/
.re_sreachitem_title span{
    position: relative;
    display: inline-block;
    max-width:134px;
    letter-spacing: -.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    top: -2px;
}
.re_sreachitem>ul{
    position: absolute;
    width: 312px;
    max-height:calc(100vh - 300px);
    min-height: 120px;
    padding: 8px 0;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .2);
    top:52px;
    left: 0;
    overflow-x: hidden;
    overflow-y:auto;
    -webkit-overflow-scrolling: touch;
}
.re_sreachitem>ul.right{
    left: auto;
    right: 16px;
}
ul.wmc_sreachitem{width: 264px;}
.re_sreachitem>ul li{
    position: relative;
    height: 48px;
    padding: 0 16px;
    background-color: rgba(227, 227, 227, 0);
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_sreachitem>ul li.on,
.wmc_filter600_info48UL li.on{
    color: #2980b9;
    font-weight: bold;
}
.re_sreachitem>ul li:after,
.wmc_filter600_info48UL li:after{
    content: '';
    position: absolute;
    display: block;
    width: 11px;
    height: 8px;
    background: url(../../images/control/tick.svg) no-repeat;
    top: 0;
    bottom: 0;
    right: 16px;
    margin: auto;
    opacity: 0;
}
.re_sreachitem>ul li.on:after,
.wmc_filter600_info48UL li.on:after{opacity: 1;}
.re_sreachitem .re_betSelectG{
    width: 312px;
    top: 52px;
}
.re_sreachitem_btnG{
    position: absolute;
    top: 10px;
    right: 16px;
}
.re_stake_input{
    position: relative;
    width: 95px;
    height: 16px;
    line-height: 15px;
    padding: 0 5px;
    background-color: #fff;
    border: 1px solid #c8c8c8;
    border-radius: 3px;
    font-size: 14px;
    font-weight: bold;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
}
.re_stake_input span{
    position: relative;
    margin-right: 3px;
    white-space: nowrap;
}
.re_stake_input input{
    width: 44px;
    height: 100%;
    min-width: 0;
    padding: 0;
    border:0;
    font-weight: bold;
    -webkit-flex: 1;
    -ms-flex: 1;
    flex: 1;
}
.re_stake_input input::-webkit-input-placeholder{color: rgba(0, 0, 0, .8);}
.re_stake_input input::-moz-placeholder{color: rgba(0, 0, 0, .8);}
.re_stake_input input::-ms-input-placeholder {color: rgba(0, 0, 0, .8);}
.re_sysMag{
    position: relative;
    padding:14px 36px 16px;
    color: #c0382b;
    font-size: 13px;
}
.re_sysMag:before{
    content: '';
    display: block;
    position: absolute;
    width: 12px;
    height:12px;
    background:url(../../images/control/error.svg) no-repeat;top: 16px;
    left: 16px;
}



.re_table_main,
.re_table_main_mini{
    width: 100%;
    text-align: right;
}
.re_table_main td,
.re_table_main_mini td{
    padding-left: 12px;
    padding-right: 12px;
    background-color: #fff;
    font-size: 14px;
}
.re_table_head01G td{
    height: 56px;
    font-size: 12px;
}/*第一行head*/
.re_table_head02G td{
    height: 40px;
    background-color: #7391a5;
    color: #fff;
    font-weight: bold;
}/*第二行head*/
.re_table_head03G td{
    height: 32px;
    background-color: #8caabe;
    color: #fff;
    font-weight: bold;
}/*第三行head*/

.re_table_body td{
    height: 48px;
    box-shadow:0 -1px 0 #e0e0e0 inset;
}/*資料行model*/
.re_table_body_auto td{
    padding: 16px 12px;
    box-shadow:0 -1px 0 #e0e0e0 inset;
}/*高度變動資料行model*/
.re_table_head_actG td{
    height: 56px;
    border-bottom:2px solid #e0e0e0;
    font-size: 12px;
}/*高度56px資料行model*/
.re_table_main_mini td{
    height: 48px;
    padding-left: 12px;
    padding-right: 12px;
    box-shadow:0 -1px 0 #e0e0e0 inset;
    color: rgba(0, 0, 0, .64);
    font-weight: bold;
}/*sma 小螢幕專用*/

.re_table_main tr td:first-child,
.re_table_main_mini tr td:first-child,
.re_table_body_auto tr td:first-child{padding-left: 16px;}
.re_table_main tr td:last-child,
.re_table_main_mini tr td:last-child,
.re_table_body_auto tr td:last-child{padding-right: 12px;}



.re_table_main_mini td:first-child{
    font-weight: normal;
    text-align: left;
}
tr.re_table_mini_tr{border-bottom: 2px solid #c8c8c8;}
.re_table_mini_tr td,
.re_table_main_mini tr:nth-last-child(2) td,
.re_table_main_mini tr:last-child td{box-shadow:none;}
.re_table_main_mini tr:last-child td{padding: 0;}

.re_tdTxt,
.re_tdTxt_br{display: inline-block;}
.re_tdTxt_br{line-height: 15px;}





/*重寫成div*/
.re_head_fixed{
    position: fixed;
    top: 0;
    display: none;
}
.re_head_fixed.original{
    position: static;
    display: block;
}
.re_right_scroll{
    padding-bottom: 140px;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}
.re_div_head,
.re_div_body{
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
}
.re_div_head>div,
.re_div_body>div{height: 100%;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_div_moveG{
    display: -webkit-inline-flex;
    display: -ms-inline-flex;
    display: inline-flex;
}
.re_div_body>div,
.re_left_fixed>div{ box-shadow:0 -1px 0 #e0e0e0 inset;}
.re_div_head>div:first-child,
.re_div_body>div:first-child{
    padding-left: 16px;
    -webkit-flex:0 0 120px;
    -ms-flex:0 0 120px;
    flex:0 0 120px;
}
.re_div_head>div:first-child{font-weight: normal;}
.en .re_div_head.re_headbg03G>div:first-child{
    line-height: 12px;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
}
.mem .re_div_head>div:first-child,
.mem .re_div_body>div:first-child{
    -webkit-flex:0 0 152px;
    -ms-flex:0 0 152px;
    flex:0 0 152px;
}/*會員層*/

.re_div_head>div:last-child,
.re_div_body>div:last-child{
    width:calc(100% - 120px);
    padding-right: 16px;
    -webkit-flex:1 1 calc(100% - 120px);
    -ms-flex:1 1 calc(100% - 120px);
    flex:1 1 calc(100% - 120px);
}
.mem .re_div_head>div:last-child,
.mem .re_div_body>div:last-child{
    width:calc(100% - 152px);
    -webkit-flex:1 1 calc(100% - 152px);
    -ms-flex:1 1 calc(100% - 152px);
    flex:1 1 calc(100% - 152px);
}/*會員層*/

.re_div_moveG>div{
    height: 100%;
    padding:0 12px;
    text-align: right;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: flex-end;
    -ms-justify-content: flex-end;
    justify-content: flex-end;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.overview .re_div_moveG>div{
    -webkit-align-content: center;
    -ms-align-content: center;
    align-content: center;
}
.re_div_moveG.break>div{
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
.re_div_moveG.break>div>div{width: 100%;}
.re_div_moveG>div:last-child{padding-right: 0;}
.re_left_fixed{
    width: 120px;
    position: absolute;
    background: #fff;
    top: 0;
    left: 16px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-flex-direction: column;
    -moz-flex-direction: column;
    -ms-flex-direction: column;
    -o-flex-direction: column;
    flex-direction: column;
}
.mem .re_left_fixed{width: 152px;}
.overview .re_left_fixed{
    width: 152px;
    height: 528px;
    background: linear-gradient(to bottom, #fff 1%,#fff 10.6%,#7391a5 10.6%,#7391a5 18.2%,#fff 18.2%,#fff 100%);
}/*overview*/

.re_left_fixed>div{
    height: 48px;
    padding-left: 16px;
    background-color: #fff;
    text-align: left;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_left_br{
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
}

div.re_headbg01G{
    height: 56px;
    background-color: #fff;
    font-size: 12px;
    box-shadow:none;}
div.re_headbg02G,
div.re_headbg03G{
    height: 40px;
    background-color: #7391a5;
    color: #fff;
    font-weight: bold;
    box-shadow:none;
}
div.re_headbg03G{
    height: 32px;
    background-color: #8caabe;
}
.re_left_fixed>div.re_headbg02G,
.re_left_fixed>div.re_headbg03G{font-weight: normal;}
.en .re_left_fixed>div.re_headbg03G{
    line-height: 12px;
    align-items: flex-start;
    flex-direction: column;
    justify-content: center;
}
.re_bodybg01G{
    height: 48px;
    background-color: #fff;
}



.re_td_fixedShadow:after {
    content: '';
    position: absolute;
    width: 20px;
    height: 100%;
    background: linear-gradient(to right, rgba(0,0,0,0.2) 0%,rgba(0,0,0,0) 85%);
    top: 0;
    right:-20px;
    opacity: 0;
    z-index: 2;
}

.re_td_fixedShadow.fixed:after {opacity: 1;}
.re_more_btn,
.re_more_btn_360{
    position: absolute;
    width: 24px;
    height: 24px;
    background:url(../../images/control/more.svg);
    border:0;
    top: 16px;
    right: 20px;
    opacity: 0;
    visibility: collapse;
    z-index: 10;
}
.report_fixed .re_more_btn,
.report_fixed .re_more_btn_360{
    position: fixed;
    top: 72px;
    right: 30px;
}

/*凍結第一塊td*/
.first_td.fixed,
.sec_td.fixed,
.third_td.fixed{
    position: fixed;
    width: 120px;
    height: 56px;
    background-color: #fff;
    z-index: 2;
}
.sec_td.fixed{
    height: 40px;
    background-color: #7391a5;
}
.third_td.fixed{
    height: 32px;
    background-color: #8caabe;
}
.fixed + .re_div_moveG{margin-left: 120px;}
.mem .fixed{
    width: 152px;
}
.mem .fixed + .re_div_moveG{margin-left: 152px;}



/*報表凍結表格*/
.re_table_outside,
.re_div_outside{
    position: relative;
    padding: 0 0 16px;
}
.re_table_outside_mini{
    position: relative;
    padding: 0 16px 16px;
}

.re_fixedW_1440,
.re_fixedW_1024,
.re_fixedW_768,
.re_autoW{width: 100%;}
.re_fixedW_1440{min-width: 1352px;}
.re_fixedW_1024{min-width: 968px;}
.re_fixedW_768{min-width: 768px;}
.re_table_autoW{width:auto;}

.re_headauto_fixed,
.re_head1440_fixed,
.re_head1024_fixed,
.re_head768_fixed{
    width: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: auto;
}
.re_head1440_fixed{max-width: 1374px;}
.re_head1024_fixed{max-width: 968px;}
.re_head768_fixed{max-width: 768px;}


.title_fixed .title_fixed_item,
.report_fixed .re_head_fixed,
.title_fixed .title_fixed_itemfull,
.wmc_pause .title_fixed_itemfull{
    position: fixed;
    display: block;
    width:calc(100% - 66px);
    border-bottom: 0;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
    top: 56px;
    overflow: hidden;
    z-index: 3;
}
.title_fixed .title_fixed_itemfull,
.wmc_pause .title_fixed_itemfull{
    display: flex;
    width:calc(100% - 10px);
    top: 0;
}
.title_fixed .title_fixed_itemfull.head{top: 56px;}
.wmc_pause,
.parlay.report_fixed {padding-top: 56px;}
/*非table head不動時用title_fixed 指定物件加上title_fixed_item*/

/*fixed位置無效修正*/
/*.nofixed .title_fixed .title_fixed_item,
.nofixed .report_fixed .re_head_fixed,
.nofixed .title_fixed .title_fixed_itemfull,
.nofixed .wmc_pause .title_fixed_itemfull{top:55px;}
.nofixed .first_td.re_td_fixed{position: absolute;}*/

/*因每一層head高度不固定*/
.report_fixed .body2tr{padding-top: 76px;}/*56+20*/
.report_fixed .body3tr{padding-top: 116px;}/*56+40+20*/




/*表格td寬度*/
.re_td_w80{width: 80%;}
.re_td_w75{width: 75%;}
.re_td_w70{width: 70%;}
.re_td_w65{width: 65%;}
.re_td_w60{width: 60%;}
.re_td_w55{width: 55%;}
.re_td_w50{width: 50%;}
.re_td_w45{width: 45%;}
.re_td_w40{width: 40%;}
.re_td_w35{width: 35%;}
.re_td_w34{width: 34%;}
.re_td_w30{width: 30%;}
.re_td_w25{width: 25%;}
.re_td_w24{width: 24%;}
.re_td_w23{width: 23%;}
.re_td_w22{width: 22%;}
.re_td_w20{width: 20%;}
.re_td_w18{width: 18%;}
.re_td_w17{width: 17%;}
.re_td_w16{width: 16%;}
.re_td_w15{width: 15%;}
.re_td_w14{width: 14%;}
.re_td_w13{width: 13%;}
.re_td_w12{width: 12%;}
.re_td_w11{width: 11%;}
.re_td_w10{width: 10%;}
.re_td_w9{width: 9%;}
.re_td_w8{width: 8%;}
.re_td_w7{width: 7%;}
.re_td_w6{width: 6%;}
.re_td_w5{width: 5%;}
.re_td_w4{width: 4%;}
.re_td_w3{width: 3%;}
/*表格td寬度end*/


.re_sort{
    position: relative;
    padding-right: 13px;
}
.re_sort:after{
    content: '';
    position: absolute;
    display: block;
    width: 8px;
    height: 14px;
    background: url(../../images/control/sort_nomal.svg) no-repeat center;
    top: 0;
    bottom: 0;
    right: 0;
    margin: auto;
}
.re_sort_i i{
    display: block;
    width: 8px;
    height: 14px;
    background: url(../../images/control/sort_nomal.svg) no-repeat center;
    margin-left: 10px;
}
.re_sort.sort_down:after,
.re_sort_i.sort_down i{ background-image: url(../../images/control/sort_down.svg);}
.re_sort.sort_up:after,
.re_sort_i.sort_up i{ background-image: url(../../images/control/sort_up.svg);}


.re_resultG{
    position:absolute;
    width: 14px;
    height: 14px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
}
div.por:last-child .re_resultG{left: 14px;}
.re_resultG{
    top: 16px;
    bottom: auto;
}
.re_resultG_b{
    position: absolute;
    width: 200px;
    background-color: #fff;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .2);
    border-radius: 3px;
    top:21px;
    right: -7px;
    opacity: 0;
    z-index: 2;
}
.re_resultG_b:last-child:nth-child(n+3):not(:nth-last-child(2)) .re_betdetail_cancelY{
    top: auto;
    bottom: 14px;
}
.re_Ibtn{
    display: inline-block;
    width: 14px;
    height: 14px;
    background:url(../../images/control/info.svg) no-repeat;
    background-size: cover;
    margin-right: 4px;
    opacity: .6;
    -webkit-flex:0 0 14px;
    -ms-flex:0 0 14px;
    flex:0 0 14px;
}

.re_resultUL{
    padding: 5px 11px;
    text-align: left;
}
.re_resultUL>li{padding: 8px 5px;}
.re_resultUL>li:not(:last-child){
    padding-bottom: 11px;
    border-bottom: 1px dotted rgba(0, 0, 0, .16);
}
.re_result_possess{font-weight: bold;}
.re_result_date{
    font-size: 12px;
    color: rgba(0, 0, 0, .52);
}

.re_betDetailUL li{
    letter-spacing: -.5px;
    margin-bottom: 4px;
}
li.re_betdetail_liBold{
    font-weight: bold;
    margin-top: 10px;
}
li.re_betdetail_liMini{
    font-size: 12px;
    color: rgba(0, 0, 0, .6);
    font-weight: bold;
    word-break: break-word;
}
li.re_betdetail_liTime{
    font-size: 12px;
    color: rgba(0, 0, 0, .6);
    margin-bottom: 2px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: space-between;
    -ms-justify-content: space-between;
    justify-content: space-between;
}
li.re_betdetail_liParlay{
    color: #000;
    font-weight: bold;
    margin-bottom: 10px;
}
li.re_betdetail_liResult{
    margin-top: 12px;
    font-size: 13px;
}
li.re_betdetail_liPending{font-size: 13px;}
li.re_betdetail_liWl{
    position: relative;
    margin-top: 9px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: space-between;
    -ms-justify-content: space-between;
    justify-content: space-between;
}
.re_betdetail_liWlTxt{width: 50%;}
.re_betdetail_liWlTxt:last-child{
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: flex-end;
    -ms-justify-content: flex-end;
    justify-content: flex-end;
    -webkit-align-content: flex-start;
    -ms-align-content: flex-start;
    align-content: flex-start;
}
.re_betdetail_liWlTxt>tt{
    font-size: 12px;
    margin-right: 5px;
    white-space: nowrap;
}
.re_betdetail_cancelG{
    position: relative;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: flex-end;
    -ms-justify-content: flex-end;
    justify-content: flex-end;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_betdetail_UNcancelG{
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_betdetail_cancelBox{
    position: relative;
    z-index: 2;
    -webkit-flex:0 0 1px;
    -ms-flex:0 0 1px;
    flex:0 0 1px;
}
.re_betdetail_cancelY{
    position: absolute;
    width: 328px;
    padding: 17px 16px 16px;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.2);
    text-align: left;
    top: 14px;
    left: -178px;
    letter-spacing:0;
    z-index: 3;
}
.re_table_body_auto:last-child:nth-child(n+3):not(:nth-last-child(2)) .re_betdetail_cancelY{
    top: auto;
    bottom: 14px;
}

.re_betdetail_close_btn{
    position: absolute;
    display: block;
    width: 14px;
    height: 14px;
    background:url(../../images/control/close_x.svg) no-repeat center;
    background-size: cover;
    top: 16px;
    right: 16px;
    opacity: .6;
}
.re_betdetail_cancelY tt{
    font-size: 14px;
    font-weight: bold;
    margin-left: 5px;
}
.re_betdetail_cancelY li:first-child{margin-bottom: 10px;}
.re_betdetail_cancelY li:last-child{
    color: rgba(0, 0, 0, .52);
    font-size: 13px;
    word-break: break-word;
}






/*右邊按下跑出的資料區*/
.re_detailG,
.re_detailbigG,
.pro_detailG,
.re_result_detailG,
.mem_detailG{
    height: 100%;
    background-color: #fff;
    z-index: 3;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
}
.re_detailG h1,
.re_detailbigG h1,
.pro_detailG h1,
.re_result_detailG h1,
.mem_detail_head h1{
    position:relative;
    width: 100%;
    height: 56px;
    line-height: 15px;
    padding: 11px 16px 0;
    background-color: #f8f8f8;
    top: 0;
    right: 0;
    z-index: 2;
}
.re_result_detailG h1{
    height: auto;
    padding: 13px 16px 12px;
    background-color: #fff;
}
.re_result_detailG .word_ellipsis{
    line-height: 17px;
    font-size: 16px;
    color: #000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.mem_detail_head{
    width: 100%;
    background-color: #fff;
    border-bottom: 3px solid #e0e0e0;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0);
    z-index: 2;
}
.title_fixed.mem_detail_head{
    border-bottom: 0;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}
.mem_detail_head h1{
    position: relative;
    background-color: #fff;
}
.re_result_detail_selectG{
    width: 100%;
    border-top: 1px solid #e0e0e0;
    box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .24);
    text-transform: uppercase;
}
.re_detailclose_btn{
    position: absolute;
    display: block;
    width: 14px;
    height: 14px;
    background:url(../../images/control/close_x.svg) no-repeat center;
    background-size: cover;
    margin-top: 2px;
    opacity: .6;
    top: 14px;
    right: 16px;
}
.re_detail_title{
    font-size: 16px;
    font-weight: bold;
    text-transform : capitalize;
}
.re_detail_title span{
    display: block;
    font-size: 14px;
    color: rgba(0, 0, 0, .6);
    font-weight: normal;
}
.re_detail_title tt{
    color: rgba(0, 0, 0, .6);
    font-size: 14px;
    margin-left: 5px;
}
.re_result_detail_title{
    width: calc(100% - 30px);
    font-size: 12px;
}
.re_detail_scroll{
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}

.re_detailUL{padding: 8px 0 48px;}
.re_detailUL li{padding: 8px 16px;}
.re_detailUL h2{
    height: 16px;
    line-height: 16px;
    font-size: 14px;
    font-weight: 300;
}
.re_detailUL h3{
    height: 24px;
    line-height: 24px;
    font-size: 16px;
    font-weight: bold;
}

.mem_detail_backbtn{
    width: 55px;
    height:56px;
    background: url(../../images/control/back_left.svg) no-repeat 16px center;
    border: 0;
}
.re_detailbig_txtG{padding: 0 10px 48px;}
.mem_detail_statement{border-top: 4px solid #e0e0e0;}
.mem_detail_statement .re_body_scroll,
.mem_detail_openbets{padding:0 0 48px;}

.mem_detail_dataG h2{
    padding: 10px 16px;
    background-color: #7391a5;
    color: #fff;
    font-weight: bold;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: space-between;
    -ms-justify-content: space-between;
    justify-content: space-between;
}
.mem_detail_dataBox{
    padding:14px 16px 13px;
    border-bottom: 1px solid #e0e0e0;
}

.re_detailbigUL,
.re_detaillastUL{padding:12px 6px 14px;}
.re_detailbigUL + .re_detailbigUL{border-top:1px dotted rgba(0, 0, 0, .16);}
.hide_item + .re_detaillastUL{border-top:1px dotted rgba(0, 0, 0, .16);}
.re_table_body_auto .re_detailbigUL{padding: 0 0 14px;}/*wmc專用*/
.re_table_body_auto .re_detailbigUL + ul{padding: 17px 0 0;}/*wmc專用*/
.re_detailbig_titleUL{padding:17px 6px 0;}
.re_detailbig_levelUL{
    padding:0 6px 14px;
    border-bottom:1px dotted rgba(0, 0, 0, .16);
}
.re_detail_line{
    width: 100%;
    border-bottom:1px dotted rgba(0, 0, 0, .16);
    margin-bottom: 6px;
}
.re_detailbig_bettype{
    color: rgba(0, 0, 0, .6);
    font-weight: bold;
    margin-bottom: 6px;
}
.re_detailbig_odds{color: #000;font-weight: bold;}
.re_detailbig_type{color: rgba(0, 0, 0, .6);}
.re_detailbig_minitime{
    color: rgba(0, 0, 0, .6);
    font-size: 12px;
    margin-top: 11px;
}
.re_detailbig_no{
    color: rgba(0, 0, 0, .6);
    margin-bottom: 11px;
}
.re_detailbig_team{margin:9px auto 4px auto;}
.re_detailbig_vs{
    color: rgba(0, 0, 0, .6);
    margin-bottom: 7px;
}
.re_detailbig_percent,
.wmc_detailbig_percent{
    color: #000;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
.re_detailbig_percent span,
.wmc_detailbig_percent span{
    width: 25%;
    font-weight: 300;
}
.re_detailbig_percent tt,
.wmc_detailbig_percent tt{font-weight: bold;}
.re_detailbig_result{
    font-size: 12px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: space-between;
    -ms-justify-content: space-between;
    justify-content: space-between;
    -webkit-align-items: flex-start;
    -ms-align-items: flex-start;
    align-items: flex-start;
}
.re_detailbig_result span{width: 50%;}
.re_detailbig_result tt{
    display: block;
    font-size: 14px;
}
.re_detailbig_status{margin-top: 14px;}
.acc_loading{
    position: absolute;
    width: 100%;
    height: calc(100% - 107px);
    top: 107px;
    left: 0;
}

.re_reault_divG{padding-bottom: 48px;}
.re_result_div_head{
    position: relative;
    max-height: 48px;
    padding: 16px 0;
    background-color: #999;
    transform: translate3d(0, 0, 0);
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_result_div_head.fix{
    position: absolute;
    width: 100%;
    top: 72px;
    z-index: 2;
}
.re_result_detail_selectG + .re_result_div_head.fix{top:120px; }
.re_result_div_head.new{
    background: #E0E0E0;
    padding: 0;
}
.re_result_div_head.new .re_result_div_item{
    font-size: 14px;
    font-weight: bold;
    color: #999;
    padding: 16px 0;
    max-height: none;
    cursor: pointer;
    -webkit-transition: color .3s linear, background-color .3s linear,opacity .3s linear,box-shadow .3s linear;
    -ms-transition: color .3s linear, background-color .3s linear,opacity .3s linear,box-shadow .3s linear;
    transition: color .3s linear, background-color .3s linear,opacity .3s linear,box-shadow .3s linear;

}
.re_result_div_head.new .re_result_div_item:first-child{
    text-align: center;
}
.re_result_div_head.new .re_result_div_item.on{
    background-color: #FFF;
    color: #000;
}
.re_result_div_body{
    min-height: 48px;
    padding: 13px 0;
    box-shadow:0 -1px 0 #e0e0e0 inset;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.re_result_div_item{
    padding: 0 16px;
    text-align: center;
}
.re_result_div_head .re_result_div_item{
    max-height:32px;
    color: #fff;
    font-size: 12px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    overflow: hidden;
}
.re_result_div_head .re_result_div_item:first-child{
    font-size: 14px;
    font-weight: bold;
    text-align: left;
    text-transform:uppercase;
}
.re_result_div_body .re_result_div_item{
    color: #987e66;
    font-weight: bold;
    text-align: center;
    word-break: break-word;
}
.re_result_div_body .re_result_div_item:first-child{
    color: rgba(0, 0, 0, .8);
    font-weight: normal;
    text-align: left;
}



/*my_activities*/
.re_act_list{
    font-size: 14px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    -ms-justify-content: flex-start;
    justify-content: flex-start;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
}
.re_act_list li{
    height: 16px;
    line-height: 16px;
}
.re_act_newoldTxt{
    height: 16px;
    line-height: 16px;
    font-size: 14px;
    margin-bottom: 4px;
    font-weight: 300;
}


/*online_member*/
.re_table_head_onmG td{
    height: 40px;
    background-color: rgba(0, 70, 120, 0.4);
    color: #fff;
    font-size: 14px;
}
.re_table_head_onmG tt,
.pro_detailG li:first-child tt{
    margin-left: 5px;
    font-weight: bold;
}
.re_table_head_onmG ~ .re_table_head_actG td{ height: 48px;}
.report_fixed .re_table_head_actG td{border: 0;}
.re_onm_acc{
    height: 16px;
    line-height: 16px;
    font-weight: bold;
}
.re_onm_mane{color: rgba(0, 0, 0, .6);}


/*announcement*/
.ann_title_btnG ~ .re_sreachterm_allG{
    height: 63px;
    border-top: 3px solid #e0e0e0;
}
.ann_li_dot i:before{
    content: '';
    position: absolute;
    display: block;
    width: 7px;
    height: 7px;
    background-color: #38bb8f;
    border-radius:7px;
    top:14px;
    right: 6px;
}
.ann_searchG{
    position: absolute;
    width: 296px;
    height: 40px;
    line-height: 38px;
    background-color: #fff;
    top: 8px;
    right: 16px;
}
.ann_searchG:before{
    content: '';
    background: url(../../images/control/search_white.svg);
    opacity: 0;
}
.ann_table_autoW .re_table_body_auto td{
    padding: 13px 16px;
    color: rgba(0, 0, 0, .6);
}
.ann_date{
    position: relative;
    display: inline-block;
    font-weight: bold;
    margin-bottom: 4px;
    color: rgba(0, 0, 0, .8);
}
.ann_new_icon:after{
    content: '';
    position: absolute;
    display: block;
    width: 27px;
    height: 14px;
    background: url(../../images/control/new.svg) no-repeat;
    top: 1px;
    right: -33px;
}


/*problem_accounts*/
.pro_acc_reviewG{
    padding: 10px 16px;
    background-color: #fff;
    border-bottom: 1px solid #e0e0e0;
}
.pro_detail_title{
    font-size: 13px;
    color: rgba(0, 0, 0, .6);
}
.pro_detail_title span{
    display: block;
    font-size: 18px;
    font-weight: bold;
}
.pro_gray_tr .checkbox_blue span{
    background:url(../../images/control/W_check.svg) no-repeat center #2980b9;
    border-color: transparent;
    opacity: .4;
}
.pro_gray_tr{background-color: rgba(224, 224, 224, .88);}
.pro_gray_tr,
.pro_gray_tr .word_gray{ color: rgba(0, 0, 0, .4); }
.pro_detailG h1{background-color: #fff;}
.pro_detailG .re_detailUL{padding: 0 0 48px;}
.pro_detailG .re_detailUL li{
    border-bottom: 1px solid #e0e0e0;
    line-height: 15px;
}
.pro_detailG .re_detailUL li:first-child{
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    background-color: rgba(0, 70, 120, 0.4);
    color: #fff;
    font-size: 14px;
}
.pro_detailG .re_detailUL h2,
.pro_detailG .re_detailUL h3{
    font-size: 14px;
    font-weight: normal;
}
.pro_detailG .re_detailUL h3{color: rgba(0, 0, 0, .6);}
.ma_extend .pro_mask{
    position: fixed;
    width: 100vw;
    height: 100vh;
    top: 0;
    right: 0;
    z-index: 2;
}

/*wmc*/
.wmc_functionG{
    position: relative;
    height: 60px;
    background-color: #fff;
    border-bottom: 4px solid #e0e0e0;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;

}/*768以下下線變成1px因此需獨立*/
.title_fixed .wmc_functionG{height: 56px;}
.wmc_function_title{
    padding-left: 16px;
    font-size: 16px;
    font-weight: bold;
}
.wmc_volume_btn{
    width: 16px;
    height: 16px;
    margin-left: 24px;
}
.wmc_volume_btn input{display: none;}
.wmc_volume_btn span{
    display: block;
    width: 100%;
    height: 100%;
    background: url(../../images/control/volume.svg) no-repeat center top;
}
.wmc_volume_btn input:checked + span{background-position: center bottom;}
.wmc_member{
    position: absolute;
    font-weight: bold;
    text-align: right;
    top: 16px;
    right: 16px;
}
.wmc_searchG{
    position: relative;
    width: 100%;
    padding: 16px 16px 8px;
}
.wmc_searchG .search_functionG{height: 40px;}
.wmc_funtion_btnG{
    position: absolute;
    top: 10px;
    right: 16px;
}
.re_sreachterm_allG .wmc_funtion_btnG{
    right: auto;
    left: 16px;
}
.wmc_pause_btn,
.wmc_clear_btn{
    width: 80px;
    height: 36px;
    line-height: 35px;
    padding-left: 32px;
    padding-right: 10px;
    background:url(../../images/control/pause.svg) no-repeat 10px center #757575;
    border: 0;
    color: #fff;
    border-radius: 3px;
    font-weight: bold;
    font-size: 14px;
}
.wmc_clear_btn{background-image: url(../../images/control/close_circle.svg);}
.wmc_remenberG{
    position: absolute;
    top: 14px;
    right: 25px;
}
.wmc_remenberG .checkbox_blue span{
    float: left;
    position: relative;
    top: 6px;
}
.wmc_remenberTxt{
    float: left;
    line-height: 14px;
    margin-left: 9px;
}
li.wmc_select_checkbox{padding-top: 10px;}
.wmc_select_checkbox .checkbox_blue span{
    position: relative;
    float: left;
    top: 6px;
}
.wmc_detailbig_type{
    color: rgba(0, 0, 0, .6);
    font-weight: bold;
}
.wmc_detailbig_team{
    color: rgba(0, 0, 0, .6);
    margin-bottom: 13px;
}
.wmc_select_scroll{
    max-height:calc(100vh - 340px);
    min-height:120px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
}
.wmc_stake_select01G{padding: 22px 15px 11px;}
.wmc_stake_select02G{padding: 13px 15px 8px;}
.wmc_stake_option{
    margin-bottom: 13px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    -ms-justify-content: flex-start;
    justify-content: flex-start;
    -webkit-align-content: center;
    -ms-align-content: center;
    align-content: center;
}
.wmc_stake_option input{display: none;}
.wmc_stake_option input + span{
    position:relative;
    display: inline-block;
    width: 15px;
    height: 15px;
    border: solid 2px rgba(180, 180, 180, .87);
    border-radius: 15px;
    margin-right: 4px;
}
.wmc_stake_option input + :before{
    content: '';
    position: absolute;
    display: block;
    width: 7px;
    height: 7px;
    background-color:rgba(69, 144, 194, .87);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    border-radius: 7px;
    opacity: 0;
}
.wmc_stake_option input:checked + span,
.wmc_stake_checked .wmc_stake_option input + span{border-color:rgba(69, 144, 194, .87); }
.wmc_stake_option input:checked + span:before,
.wmc_stake_checked .wmc_stake_option input + span:before{opacity: 1;}
.wmc_stake_input{
    position: relative;
    width: 100%;
    height: 40px;
    border-radius: 3px;
    border: solid 1px rgba(200, 200, 200, .4);
    color: rgba(0, 0, 0, .4);
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: flex-start;
    -ms-justify-content: flex-start;
    justify-content: flex-start;
    -webkit-align-content: center;
    -ms-align-content: center;
    align-content: center;
}

.wmc_stake_input span{
    display: inline-block;
    line-height: 38px;
    padding-left: 14px;
    margin-right: 2px;
}
.wmc_stake_input input{
    border: 0;
    color:rgba(0, 0, 0, .4);
    font-size: 14px;
    background: transparent;
    -webkit-flex: 1 1 auto;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
}
.wmc_stake_input input:disabled::-webkit-input-placeholder{color:rgba(0, 0, 0, .4);}
.wmc_stake_input input:disabled::-moz-placeholder{color:rgba(0, 0, 0, .4);}
.wmc_stake_input input:disabled::-ms-input-placeholder {color:rgba(0, 0, 0, .4);}
.wmc_stake_checked .wmc_stake_input{
    border-color:#c8c8c8 ;
    color: rgba(0, 0, 0, .8);
}
.wmc_stake_checked .wmc_stake_input input{color:rgba(0, 0, 0, .8);}
.wmc_stake_checked .wmc_stake_input input::-webkit-input-placeholder{color:rgba(0, 0, 0, .8);}
.wmc_stake_checked .wmc_stake_input input::-moz-placeholder{color:rgba(0, 0, 0, .8);}
.wmc_stake_checked .wmc_stake_input input::-ms-input-placeholder {color:rgba(0, 0, 0, .8);}

.wmc_stake_select02G .wmc_stake_option{margin-bottom: 6px;}
.wmc_stake_select02UL li{padding: 24px 0 9px;}
.wmc_stake_input:before{
    content: attr(data-option);
    position: absolute;
    font-size: 12px;
    color: rgba(0, 0, 0, .4);
    top: -20px;
}
.wmc_stake_checked .wmc_stake_input:before{color: rgba(0, 0, 0, .6);}
.wmc_searchUL{
    padding: 8px 0;
    background-color: #fff;
}
.tbet_wagers_searchLi + .wmc_searchUL_sp{border-top: 1px solid #e0e0e0;}
.wmc_filter600_info48UL li>div{
    padding: 0 16px;
    height: 48px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.tbet_wagers_searchLi .word_bold500{word-break: break-word;}
.wmc_searchUL li>div{
    padding: 0 16px;
    height: 48px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-justify-content: center;
    -ms-justify-content: center;
    justify-content: center;
}
.wmc_search_chkG{
    display: block;
    height: 48px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
.wmc_search_chkG{padding-left: 24px;}
.wmc_search_chkG input{display: none;}
.wmc_search_chkG span{
    width: 16px;
    height: 16px;
    background-color:#fff;
    border: solid 1px #b4b4b4;
    border-radius: 3px;
    margin-right: 14px;
    -webkit-flex:0 0 16px;
    -ms-flex:0 0 16px;
    flex:0 0 16px;
}
.wmc_search_chkG input:checked + span{
    background:url(../../images/control/W_check.svg) no-repeat center #2980b9;
    border-color: transparent;
}
.wmc_search_chkTxt{
    -webkit-flex:1 1 auto;
    -ms-flex:1 1 auto;
    flex:1 1 auto;
}
.disabled .wmc_search_chkG input:checked + span{background-color: rgba(41, 128, 185, .4);}

li.wmc_searchUL_sp.middle{
    height: 40px;
    padding: 0 16px;
    color: rgba(0, 0, 0, .6);
    font-size: 12px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
}
li.wmc_searchUL_sp.title{
    height: 40px;
    line-height: 40px;
    padding: 0 16px;
    background-color: #f8f8f8;
    border-top: 2px solid #e0e0e0;
    color: rgba(0, 0, 0, .522);
    font-size: 12px;
    font-weight: bold;
}



/*wmc_filters_600*/
.filter_container{
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: #fff;
    padding-top: 60px;
    overflow-x: hidden;
    overflow-y: auto;
    top: 0;
    left: 0;
    -webkit-overflow-scrolling: touch;
}
.wmc_filter600_titleG{
    position: fixed;
    width: 100%;
    height: 60px;
    background-color: #fff;
    border-bottom: 4px solid #e0e0e0;
    top: 0;
    z-index: 2;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
}
.wmc_filter600_back_btn{
    width: 54px;
    height: 100%;
    background:url(../../images/control/back_left.svg) 20px center no-repeat;
    border: 0;
}
.wmc_filter600_titleG span{
    height: 55px;
    line-height: 55px;
    font-size: 16px;
    font-weight: bold;
}
.wmc_filter600_info48UL li{
    position: relative;
    height: 48px;
}
.wmc_filter600_search{
    position: relative;
    padding: 16px;
    height: 72px;
}
.wmc_filter600_search .search_functionG:after{
    top: 16px;
    right: 16px;
}
.wmc_filter600_infoG{min-height: 400px;}
.main_rotate .wmc_filter600_infoG{min-height: 500px;}/*讓使用者回到內層捲軸*/
/*因需使用多數report_control.css裡面的class,因此allbet需用的class放在這*/
.tbet_searchG{
    padding: 16px 8px;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-flex-wrap: wrap;
    -ms-flex-wrap: wrap;
    flex-wrap: wrap;
}
.tbet_filter600_infoG{
    width: 50%;
    padding: 0 8px;
}
.tbet_filteritemG{
    position: absolute;
    width: 100%;
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .2);
    top:46px;
    left: 0;
    z-index: 2;
    opacity: 1;
}



/*quick_search*/
.quick_searchtitleG{padding: 16px 18px 12px;}
.quick_searchG{
    position: relative;
    width: 568px;
    height: 48px;
}
.quick_username{
    color: #2980b9;
    font-weight: bold;
}




/*acc_creditlogs*/
tr.cdlog td:last-child{padding-left: 40px; }
.cglog_list {
    display: block;
    width: 100%;
    height: auto;
    border-width: 0 0 1px 0;
    border-style: solid;
    border-color: #e0e0e0;
}
.cglog_list .re_table_body_auto{
    display:flex;
    height: 56px;
    justify-content: center;
    align-items: center;
}
.cglog_list .re_table_body_auto>div {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
    padding: 12px 16px 12px 0;
}
.cglog_list .re_table_body_auto>div:first-child { justify-content:flex-start;}
.cglog_list .re_table_body_auto tt {
    display: inline-block;
    vertical-align: middle;
    width: 75px;
}
.Retractable {
    position: relative;
    display: inline-block;
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin: 0 16px;
}
.Retractable:before,
.Retractable:after {
    content:'';
    position: absolute;
    display: block;
    top: 7px;
    left: 0px;
    width: 16px;
    height: 2px;
    background-color: rgba(2,2,3,.6);
}
.Retractable:before {
    content: none;
    transform: rotateZ(90deg);
}
.active .Retractable:before {content:'';}
.cglog_list .re_td_w18 {
    width: 40%;
    padding: 16px 0;
}
.cglog_list .re_td_w15 {
    width: 30%;
    padding: 16px;
}
.cglog_list_other{
    height: 50px;
}
.cglog_list_other ul{padding:2px 16px 16px}
.cglog_list_other span{
    font-size: 12px;
    margin-bottom: 0px;
}

/*RWD*/
@media only screen and (min-width: 1441px){
    .re_body_scroll, .re_right_scroll{padding: 0 16px 140px;}
    .re_head_fixed{padding: 0 16px;}
    .report_fixed .re_head_fixed:before,
    .report_fixed .re_head_fixed:after{
        content: '';
        display: block;
        position: absolute;
        width: 16px;
        height: 128px;
        background: linear-gradient(to bottom, #fff 1%,#fff 44%,#7391a5 33%,#7391a5 33%,#7391a5 75%,#8caabe 66%,#8caabe 66%,#8caabe 100%);
        top: 0;
        left: 0;
    }
    .report_fixed .re_head_fixed:after{
        left: auto;
        right: 0;
    }
    .mem_detail_statement .re_body_scroll{padding: 0 0 48px;}

}

@media only screen and (max-width: 1439px){
    .re_table_outside{padding: 0;}
    .re_left_fixed{left: 0;}
    .re_fixedW_1440 .re_more_btn{
        opacity: 1;
        visibility: visible;
    }

}

@media only screen and (max-width: 1104px){
    .re_mrightG .re_titleG li{letter-spacing: -.5px;}
    .re_mrightG .re_titleG span{
        white-space: pre-line;
        line-height: 14px;
    }
}

@media only screen and (max-width: 1024px){
    .report_fixed .re_head_fixed{width:calc(100% - 56px);}
}


@media only screen and (max-width:968px){
    .re_fixedW_1024 .re_more_btn{
        opacity: 1;
        visibility: visible;
    }
}

@media only screen and (min-width:968px){
    .re_head1024_fixed{max-width:100%;}
    .re_table_fixedW_1024{min-width: 100%;}
}

@media only screen and (min-width: 768px) and (max-width:1023px) {
    .re_table_outside{min-height: auto;}
    .re_accounting_tb td{
        padding: 16px 8px;
        letter-spacing: -.6px;
    }
    .re_accounting_tb td:nth-child(1){text-align: center;}
    .cdlog td.re_td_w18{
        width: 20%;
        padding-right: 0px;
    }
    .cdlog td.re_td_w15,
    .cdlog td.re_td_w22{width: 16%;}
    tr.cdlog .word_green{display: none;}
}

@media only screen and (min-width: 1px) and (max-width: 1023px) {
    .title_fixed .title_fixed_item, .report_fixed .re_head_fixed, .title_fixed .title_fixed_itemfull {
        width: 100%;
    }
    .report_fixed .re_more_btn,
    .report_fixed .re_more_btn_360{
        right: 20px;
    }
    .re_betdetail_cancelBox{
        position: absolute;
        width: 100vw;
        right: -16px;
    }
    .re_betdetail_cancelY{
        left: auto;
        right: 16px;
    }

    .re_betdetail_UNcancelG .re_betdetail_cancelBox{right: 0;}
    .re_betdetail_UNcancelG .re_betdetail_cancelY{left: 16px;}

    .re_copy_btn{
        width: 40px;
        padding: 0;
    }
    .re_copy_btn span{
        display: none;
    }
    .re_copy_btn i{
        display: block;
    }

}

/*為解決IE11問題*/
@media only screen and (min-width: 768px) {
    .re_mleftG{
        width: 45%;
        max-width: 529px;
    }
}

/*為解決IE11問題*/
@media only screen and (min-width:1px) and (max-width: 767px){
    .re_mleftG{
        width: 100%;
        max-width: 100%;
    }
}

@media only screen and (max-width: 767px) {
    .re_fixedW_768 .re_more_btn{
        opacity: 1;
        visibility: visible;
    }
    .re_mrightG_600{
        width: 100%;
        padding:0 8px;
    }
    .parlay.report_fixed {padding-top: 0;}


    .re_act_list li{margin-bottom: 4px;}
    .re_act_list li:last-child{margin-bottom: 0;}

    .ann_searchG{
        width: 100%;
        height: 100%;
        top: 0;
        right: 0;
        display: -webkit-flex;
        display: -ms-flex;
        display: flex;
        -webkit-justify-content: flex-end;
        -ms-justify-content: flex-end;
        justify-content: flex-end;
    }

    .wmc_functionG{
        border-bottom-width: 1px;
        -webkit-justify-content: space-between;
        -ms-justify-content: space-between;
        justify-content: space-between;
    }
    .wmc_volume_btn{margin-right: 24px;}

    .tbet_filter600_infoG{width: 100%;}

    .re_detailbig_percent span{width: 50%;}

    .quick_searchG{width: 100%;}
    .selectlong{
        width: 224px;
        letter-spacing: -.4px;
    }
    .re_detailbigG{width: 200px;}

    .re_export_select_twoLines,
    .wmc_searchUL,
    .wmc_select_scroll{max-height: calc(100vh - 422px);}
}

@media only screen and (max-width: 599px){
    .re_dateInfo{letter-spacing: -.5px;}
    .re_sreachterm_title{display: none;}

    .re_more_btn_360{
        opacity: 1;
        visibility: visible;
    }

    .re_act_newoldTxt{
        display: inline-block;
        min-width: 24px;
    }
    .re_betdetail_cancelG{
        display: -webkit-inline-flex;
        display: -ms-inline-flex;
        display: inline-flex;
        -webkit-align-items: flex-start;
        -ms-align-items: flex-start;
        align-items: flex-start;
    }
    .re_betdetail_cancelY{
        width: calc(100% - 32px);
        top: 21px;
        left: 0;
        right: 0;
        margin: auto;
    }
    .re_table_body_auto:last-child:nth-child(n+2):not(:nth-last-child(2)) .re_betdetail_cancelY{
        top: auto;
        bottom: 7px;
    }
    .re_betdetail_cancelG .re_betdetail_cancelTxt{
        max-width: 74px;
        text-align: left;
    }
    .re_betdetail_UNcancelG .re_betdetail_cancelY{left: 0;}
    .mini select{max-width: 100px;}
}

@media only screen and (orientation:landscape) and (max-width:812px){
    .re_export_select_twoLines{min-height: 88px}
    .re_detailUL,
    .re_detailbig_txtG,
    .mem_detail_openbets,
    .pro_detailG .re_detailUL,
    .re_reault_divG,
    .filter_container{padding-bottom: 96px;}
}




/*outdated browser*/
.outdated {
    padding: 50px 43px;
}

.od_title {
    position: relative;
    color: rgba(0, 0, 0, 0.8);
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    height: 21px;
    margin-bottom: 21px;
}

.outdated p {
    position: relative;
    color: rgba(0, 0, 0, 0.8);
    font-size: 13px;
    line-height: 21px;
    margin-bottom: 5px;
}

.od_click {
    font-weight: bold;
    text-transform: uppercase;
    text-decoration: underline;
    cursor: pointer;
}

.browser {
    width: 700px;
}


.chrome,
.firefox,
.safari {
    position: relative;
    float: left;
    width: 208px;
    height: 204px;
    text-align: center;
    padding-top: 20px;
    margin-right: 3%;
    margin-top: 20px;
    background: url('../../images/control/browser_bg.png') -208px 0 no-repeat;
}

.chrome .pic {
    background: url('../../images/control/browser_chrome.png') center no-repeat;
}

.firefox .pic {
    background: url('../../images/control/browser_firefox.png') center no-repeat;
}

.safari .pic {
    background: url('../../images/control/browser_safari.png') center no-repeat;
}

.chrome .pic,
.firefox .pic,
.safari .pic {
    display: block;
    height: 87px;
}

.chrome p,
.firefox p,
.safari p {
    color: #6a6a6a;
    height: 19px;
    font-size: 14px;
    text-align: center;
    line-height: 16px;
    margin-top: 10px;
    margin-bottom: 8px;
}

.chrome .download,
.firefox .download,
.safari .download {
    display:inline-block;
    color: #fff;
    width: 94px;
    height: 39px;
    text-align: center;
    line-height: 39px;
    background: url('../../images/control/browser_icon.png') -48px 0 no-repeat;
    cursor: pointer;
}

.re_like,
.chrome:hover,
.firefox:hover,
.safari:hover {
    background: url('../../images/control/browser_bg.png') no-repeat;
    cursor: pointer;
}
.browser a{text-decoration: none;}

.like {
    position: absolute;
    top: -10px;
    left: 8px;
    width: 42px;
    height: 42px;
    background: url('../../images/control/browser_icon.png') no-repeat;
}

.bw_main {
    width: 700px;
    padding-top: 31px;
}

.bw_title {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
}
.ie5high{

    clear: left;
    height: 80px;
}

.whyup {
    float: left;
    width: 335px;
    height: 80px;
}

.whyup .pic{
    float: left;
    width: 27px;
    height: 80px;
    margin-top: 12px;
    margin-right: 10px;
}

.whyup .title {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4em;
    margin-top: 12px;
}

.whyup p {
    font-size: 13px;
    line-height: 1.2em;
}

.settings,
.better {
    margin-left: 30px;
}

.speed,
.better {
    margin-top: 13px;
}

.security .pic{
    background: url('../../images/control/browser_security.png') no-repeat;
}

.settings .pic{
    background: url('../../images/control/browser_settings.png') no-repeat;
}

.speed .pic{
    background: url('../../images/control/browser_speed.png') no-repeat;
}

.better .pic{
    background: url('../../images/control/browser_better.png') no-repeat;
}


/*loading*/
.lds_main {
    position:absolute;
    width: 100%;
    height: 100%;
    background-color: #f0f0f0;
    top: 0;
    left: 0;
    z-index: 11;
}
.inside_lds_main{
    position: fixed;
    width: 100%;
    height: 52px;
    background-color: #f0f0f0;
    bottom: 0;
    bottom: constant(safe-area-inset-bottom);
    bottom: env(safe-area-inset-bottom);
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-justify-content: center;
    -ms-justify-content: center;
    justify-content: center;
    -webkit-align-items: center;
    -ms-align-items: center;
    align-items: center;
    z-index: 5;
}
.lds_all{
    position: absolute;
    width:54px;
    top:130px;
    left: 0;
    right: 0;
    margin: auto;
}
.lds_spinner{
    width:54px;height: 54px;
}

.inside_lds_main .lds_spinner{
    -webkit-transform: scale(.5);
    -ms-transform: scale(.5);
    transform: scale(.5);
}
.lds_txt {
    padding-top: 7px;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
}

.lds_spinner div{
    transform-origin:27px 27px;
    animation: lds_spinner 1.2s linear infinite;
}
.lds_spinner div:after {
    content:"";
    display: block;
    position: absolute;
    top: 3px;
    left:25px;
    width:4px;
    height:14px;
    border-radius:30%;
    background: #000;
}

.lds_spinner div:nth-child(1) {
    transform: rotate(0deg);
    animation-delay: -1.1s;
}

.lds_spinner div:nth-child(2) {
    transform: rotate(30deg);
    animation-delay: -1s;
}

.lds_spinner div:nth-child(3) {
    transform: rotate(60deg);
    animation-delay: -0.9s;
}

.lds_spinner div:nth-child(4) {
    transform: rotate(90deg);
    animation-delay: -0.8s;
}

.lds_spinner div:nth-child(5) {
    transform: rotate(120deg);
    animation-delay: -0.7s;
}

.lds_spinner div:nth-child(6) {
    transform: rotate(150deg);
    animation-delay: -0.6s;
}

.lds_spinner div:nth-child(7) {
    transform: rotate(180deg);
    animation-delay: -0.5s;
}

.lds_spinner div:nth-child(8) {
    transform: rotate(210deg);
    animation-delay: -0.4s;
}

.lds_spinner div:nth-child(9) {
    transform: rotate(240deg);
    animation-delay: -0.3s;
}

.lds_spinner div:nth-child(10) {
    transform: rotate(270deg);
    animation-delay: -0.2s;
}

.lds_spinner div:nth-child(11) {
    transform: rotate(300deg);
    animation-delay: -0.1s;
}

.lds_spinner div:nth-child(12) {
    transform: rotate(330deg);
    animation-delay: 0s;
}

@-webkit-keyframes lds_spinner {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}


@keyframes lds_spinner {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}


/*alert_notice.html*/
.ar_notice{
    width: 300px;
    height: 480px;
    background-color: #fff;
    display: -webkit-flex;
    display: -ms-flex;
    display: flex;
    -webkit-flex-direction: column;
    -ms-flex-direction: column;
    flex-direction: column;
    -webkit-justify-content: space-between;
    -ms-justify-content: space-between;
    justify-content: space-between;
}
.ar_notice h1{
    height: 40px;
    line-height: 40px;
    background-color: #ef9644;
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
}
.ar_notice_txt{
    height:calc(100% - 134px);
    line-height: 18px;
    padding: 26px 24px 0;
    color: #4a4a4a;
    overflow: auto;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    -webkit-flex:1 1 calc(100% - 134px);
    -ms-flex:1 1 calc(100% - 134px);
    flex:1 1 calc(100% - 134px);
}
.ar_notice_txt li{margin-bottom: 18px;}
.ar_notice_txt.EN li{letter-spacing: .5px;}
.ar_notice_bottom{
    height: 94px;
    padding: 24px 0;
    text-align: center;
}
.ar_notice_btn{
    width: 220px;
    height: 46px;
    background-color: #fff;
    border-radius: 3px;
    border:2px solid #ee8b2f;
    color: #ee8b2f;
    font-size: 18px;
    text-align: center;
}


/*showMaintain.html*/
/*1024以上*/
.show_main{ padding-top:126px;}
.show_top{
    width:786px;
    height:195px;
    background:url(../../images/control/showMaintain_top.jpg) no-repeat;
    margin:auto;
}
.show_bottom{
    width:100%;
    background-color:#513f33;
    margin:73px auto auto;
}
.show_txtG{
    width:1020px;
    height:281px;
    margin:auto;
}
.show_txt{
    position:relative;
    float:left;
    width:340px;
    height:281px;
    padding:25px 0 0 28px;
    font-size:15px;
    text-align:left;
    border-right:1px solid #423329;
}
.show_noline{ border-right:0}
.show_txt ul{
    color:#dabf93;
    margin-bottom:6px;
}
ul.show_lightTxt{ color:#c8c4b0}
.show_txt li{ line-height:23px;}
.show_txt tt{ font-size:14px; font-weight:bold}
.show_space{ margin-left:38px;}
.show_mail{
    position:absolute;
    color:#c8c4b0;
    left:26px;
    bottom:28px;
}

ul.US{
    font-size:14px;
    margin-bottom:7px;
}
.US li{line-height:20px;}
.US .show_space{ margin-left:50px}
.show_copyright{
    color:#ac956c;
    font-size:12px;
    text-align:center;
    margin-top:19px;
}

/*1024以下*/
.show_mini_title {
    margin: 0 auto;
    padding-top: 60px;
    padding-bottom: 20px;
    height: 260px;
    text-align:center;
}
.show_mini_title > img {
    margin-bottom:21px;
    width: 100px;
    height: 99px;
    border:0;
}
.show_mini_title > h1 {
    font-size: 20px;
    font-weight: 900;
    color: #705636;
    line-height: 29px;
}
.show_mini_title > h2 {
    margin-top: 3px;
    font-size:16px;
    font-weight: bold;
    color: #ac956c;
    line-height: 19px;
}

.show_mini_txt {
    margin: 0 auto;
    padding-top:25px;
    min-height:338px;
    color:#dabf93;
    text-align:center;
    background-color: #513f33;
}
.show_mini_txt > h3 {
    font-size: 14px;
    line-height: 1.29em;
}
.show_mini_txt > h4 {
    font-size: 13px;
    line-height: 1.29em;
    margin-top: 4px;
}
.show_mini_txt > h5 {
    font-size: 14px;
    font-weight: bold;
    margin-top: 13px;
}
.show_mini_txt > h6 {
    font-size: 12px;
    margin-top: 13px;
    margin-bottom: 2px;
    color: #c8c4b0;
}
.show_mini_txt > p.p1 {
    font-size: 12px;
    line-height: 1.25em;
}
.show_mini_txt > .phone {
    font-size: 14px;
    font-weight: bold;
    color: #c8c4b0;
}
.show_mini_txt > .phone > span {
    display: inline-block;
    margin: 0 16px;
}
.show_mini_txt > .phone a {
    color: #c8c4b0;
    text-decoration: none;
}
footer {
    line-height: 42px;
    font-size: 12px;
    color: #ac956c;
    text-align: center;
}

/* requirements.html */
.require_header{
    width: 100%;
    height: 56px;
    background: #B03427;
    display: none;
    align-items: center;
}
.require_back_btn{
    display: block;
    width: 16px;
    height: 100%;
    background: url(../../images/control/back_white.svg) no-repeat center;
    margin: 0 24px 0 20px;
}
.require_header span{
    font-size: 16px;
    line-height: 16px;
    font-weight: bold;
    color: #fff;
}
.require_box{
    padding: 24px 0;
}
.require_boxWidth{
    width: calc(100% - 32px);
    max-width: 640px;
    margin: auto;
}
.require_title{
    line-height: 16px;
    margin-bottom: 16px;
}
.require_tb{
    width: 100%;
    color: #000;
    margin-bottom: 16px;
}
.require_tb caption{
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 16px;
    text-align: left;
}
.require_tb th{
    height: 40px;
    background: #F0F0F0;
    border-bottom: 1px solid #fff;
    color: rgba(0, 0, 0, 0.72);
    text-align: left;
}
.require_tb td{
    height: 48px;
    border-top: 1px solid #E0E0E0;
}
.require_tb td:first-child,
.require_tb th:first-child{
    padding: 0 8px 0 16px;
    border-radius: 4px 0 0 4px;
}
.require_tb td:last-child,
.require_tb th:last-child{
    padding: 0 16px 0 8px;
    border-radius: 0 4px 4px 0;
}
.require_txt{
    line-height: 16px;
    color: rgba(0, 0, 0, .8);
}
.require_box h2{
    color: #000;
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 16px;
}
.require_txt li + li{
    margin-top: 16px;
}
.require_btn{
    display: none;
    width: 328px;
    height: 48px;
    margin: 16px auto 0;
    font-size: 14px;
    border-radius: 4px;
    border: 1px solid #757575;
    color: rgba(0, 0, 0, .64);
    background: #fff;
    cursor: pointer;
}

/* 外層樣式 */
.login_page{
    background: #fff;
    overflow-y: auto;
    overflow-x: hidden;
}
.login_page .require_box{
    height: calc(100% - 56px);
    padding: 16px 0 24px;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

}
.login_page .require_header{
    display: flex;
}
.login_page .require_btn{
    display: block;
}





/*hover*/
@media (pointer: fine) and (max-resolution: 2dppx),
screen and (pointer: fine) and (-webkit-max-device-pixel-ratio: 2),
(-moz-touch-enabled: 0), screen and (-ms-high-contrast: active), (-ms-high-contrast: none){
    .word_link_new:hover{
        color: #49B6FF;
    }
}






/*RWD*/

@media only screen and (orientation:portrait) and (max-width:767px){
    .inside_lds_main{
        bottom: 56px;
    }


}


@media only screen and (orientation:landscape) and (max-width:812px){
    .ar_notice{
        height: auto;
        max-height:calc(100vh - 40px);
    }
}/*register_email*/
.mail_functionG{
    position: relative;
    padding: 0 16px 21px;
    border-bottom: 1px solid #e0e0e0;
}
.mail_function_title{
    font-size: 12px;
    font-weight: 300;
    margin-bottom: 2px;
}
.mail_function_btnG{
    position: absolute;
    top: 8px;
    right:23px;
}
.mail_edit_btn,
.mail_del_btn{
    width: 16px;
    height: 16px;
    background: url(../../images/control/edit.svg) no-repeat;
    border: 0;
}
.mail_del_btn{
    background-image: url(../../images/control/delete.svg);
    margin-right: 29px;
}
.mail_infoG{padding: 22px 16px 0;}
.mail_infoG ~ .mail_infoG{padding: 16px 16px 0;}
.mail_infoG .ps_end_note{margin-top: 0;}
.mail_infoG .ps_miniDone_btn{margin-top: 16px;}/*RWD*/
@media only screen and (min-width: 768px) and (max-width:1023px) {
    .set_type_itemG{width: 100%;}

}


@media only screen and (max-width: 767px) {
    .da_linkG{
        -webkit-flex-wrap: wrap;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
    }
    .da_linkG li:not(:last-child){margin-bottom: 8px; }
    .da_valueG{
        width: 100%;
        margin-bottom: 56px;
    }
    .da_valueG:nth-child(3){margin: 0;}

    .da_valueG1{
        width: 100%;
        margin-bottom: 56px;
    }
    .da_valueG1:nth-child(3){margin: 0;}

    .set_type_itemG, .contact_type_itemG, .url_link_itemG{width: 100%;}
    .url_link_itemG:nth-child(1),.url_link_itemG:nth-child(3){float: none;}
}



@media only screen and (min-width:600px) and (max-width: 767px){
    .contact_infoTxtUL{width: 47%;}
}



@media only screen and (max-width: 599px){

    .da_canvas_box {padding-bottom: 10px;}
    .da_canvas_box:after{bottom: 11px;}
    .da_canvas_box.tw:after{bottom: 8px;}

    .set_soprt_btnG .re_titleG span{white-space: pre-line;}
}

@media only screen and (max-height: 414px) {
    .ar_bg{
        -webkit-align-items: center;
        -ms-align-items: center;
        align-items: center;
    }
    .ar_main, .ar_annG{margin-top: 0;}
}@charset "UTF-8";

/*回到頂端鈕*/
.backtop_btn{
	position: fixed;
	width: 40px;
	height: 40px;
	border-radius: 2px;
	background-color: rgba(0, 0, 0, 0.32);
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);
	bottom: 16px;
	right: 16px;
	z-index: 7;
	-webkit-animation: backAN .5s cubic-bezier(0.42, 0, 0.58, 1.0);
	animation: backAN .5s cubic-bezier(0.42, 0, 0.58, 1.0);
}
.backtop_btn:before{
	content: '';
	position: absolute;
	display: block;
	width: 14px;
	height: 9px;
	background:url(../../images/control/arrowU.svg) no-repeat;
	background-size: cover;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	margin: auto;
}

@-webkit-keyframes backAN{
	0%{opacity: 0;}
	100%{opacity: 1;}
}
@keyframes backAN{
	0%{opacity: 0;}
	100%{opacity: 1;}
}



/*可共用按鈕*/
.re_titleG{
	max-width: 100%;
	height: 48px;
	box-shadow:0 -1px 0 #e0e0e0 inset;
	border-radius: 2px 2px 0 0;
	overflow: hidden;
	white-space: nowrap;
	overflow-x: auto;
	overflow-y: hidden;
	-webkit-overflow-scrolling: touch;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-justify-content: flex-start;
	-ms-justify-content: flex-start;
	justify-content: flex-start;
}

.re_titleG li{
	position: relative;
	height: 100%;
	padding: 0 16px;
	color: rgba(0, 0, 0, .4);
	letter-spacing:-.5px;
	text-align: center;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
	-webkit-justify-content: center;
	-ms-justify-content: center;
	justify-content: center;
}
.re_titleG.equal li{width: 50%;}
*::-ms-backdrop,
.re_titleG.equal li{ width: 180px; } /*IE11*/
.re_main600 .re_titleG li{
	padding-right: 24px;
	padding-left: 24px;
}
.re_titleG li:before{
	content: '';
	position: absolute;
	display: block;
	width:0;
	height: 2px;
	background-color:#c0392b;
	transform-origin:0 center;
	bottom: 1px;left: 0;
	-webkit-transition::width 200ms ease-in-out;
	-ms-transition::width 200ms ease-in-out;
	transition:width 200ms ease-in-out;
}
.re_titleG li.on{color: #c0392b;}
.re_titleG li.on:before{width: 100%;}
.re_titleG li:after{
	content: '';
	position: absolute;
	display: block;
	width: 100%;
	height: 1px;
	background-color:#e0e0e0;
	bottom: 0;
	left: 0;
}
.ps_submit_btn{
	width: 100%;
	height: 48px;
	line-height: 48px;
	background-color: rgba(56, 187, 143, 1);
	border: 0;
	border-radius: 3px;
	color: #fff;
	font-size: 14px;
	font-weight: bold;
	text-align: center;
	margin-top: 16px;
}
.re_main600 .ps_submit_btn{ margin-top: 0; }

.ps_mini_btnG input,
.re_down_btnG input,
.re_sreachitem_btnG input,
.gray_bg_btn,
.re_sma_submit_btn,
.search_title_btnG input{
	padding: 0 16px;
	height: 48px;
	line-height: 48px;
	border: 0;
	border-radius: 3px;
	font-weight: bold;
	font-size: 14px;
}
.re_sreachitem_btnG input,
.search_title_btnG input{
	height: 40px;
	line-height: 40px;
}

.search_title_btnG{
	padding:10px 16px;
	box-shadow:0 -1px 0 #e0e0e0 inset;
	text-align: right;
}
.ps_mini_cancel_btn{
	background-color:#fff;
	box-shadow:0 0 0 1px rgba(130, 130, 130, .4) inset;
	color: rgba(0, 0, 0, .6);
}
.ps_mini_submit_btn{
	background-color: rgba(56, 187, 143, 1);
	color: #fff;
}

.ps_miniDone_btn{
	padding: 0 21px;
	height: 48px;
	line-height: 48px;
	background-color: rgba(56, 187, 143, 1);
	color: #fff;
	border: 0;
	border-radius: 3px;
	font-weight: bold;
	margin:28px auto auto;
}

.ps_submit_btn:disabled,
.ps_submit_btn:disabled:hover,
.ps_mini_submit_btn:disabled,
.ps_mini_submit_btn:disabled:hover{
	background-color: rgba(56, 187, 143, .4);
	cursor:default;
}

.re_sma_submit_btn{
	width: 100%;
	background-color: #2980b9;
	border-radius: 2px;color: #fff;
}
.gray_bg_btn{
	background-color: #757575;
	color: #fff;
	letter-spacing: .8px;
}
input.input_center{
	text-align: center;
	padding: 0 16px;
	text-transform: uppercase;
}



/*可共用checkbox*/
.checkbox_blue input{display: none;}
.checkbox_blue span{
	display:inline-block;
	width: 16px;
	height: 16px;
	background-color:#fff;
	border: solid 1px #b4b4b4;
	border-radius: 3px;
}
.checkbox_blue input:checked + span{
	background:url(../../images/control/W_check.svg) no-repeat center #2980b9;
	border-color: transparent;
}



/*可共用搜尋*/
/*小的*/
.search_functionG,
.search_function_fullG{
	width: 100%;
	height: 100%;
	background-color: #fff;
	border: solid 1px #c8c8c8;
	border-radius: 3px;
	overflow: hidden;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
}
.search_functionG:after{
	content: '';
	position: absolute;
	width: 40px;
	height: 38px;
	border-width: 1px 1px 1px 0;
	border-color: #7f7f7f;
	border-style: solid;
	border-top-right-radius: 3px;
	border-bottom-right-radius: 3px;
	top: 0;
	right: 0;
	pointer-events: none;
}
.quick_searchG .search_functionG:after{
	width: 48px;
	height: 46px;
}
.wmc_searchG .search_functionG:after{
	top: 16px;
	right: 16px;
}
.re_betSearchG .search_functionG:after{content: none;}
.search_functionTxt{
	height:100%;
	padding: 0 0 0 16px;
	border: 0;
	font-size: 14px;
	-webkit-flex:1 1 auto;
	-ms-flex:1 1 auto;
	flex:1 1 auto;
}
.quick_searchG.tw .search_functionTxt{
	font-size: 16px;
}
.search_functionSubmit_btn,
.search_functionClose_btn,
.search_functionSubmit_tran_btn{
	height: 100%;
	padding: 0;
	background: url(../../images/control/search_white.svg) no-repeat center #7f7f7f;
	border: 0;
	opacity: 1;
	-webkit-flex:0 0 40px;
	-ms-flex:0 0 40px;
	flex:0 0 40px;
}
.quick_searchG .search_functionSubmit_btn,
.quick_searchG .search_functionClose_btn{
	-webkit-flex:0 0 48px;
	-ms-flex:0 0 48px;
	flex:0 0 48px;
}
.search_functionSubmit_btn{border-radius: 0; margin: 0;}
.search_functionClose_btn{background: url(../../images/control/close_x.svg) no-repeat center transparent; opacity: .6;right: 40px;}
.search_functionSubmit_tran_btn{ background: url(../../images/control/search.svg) no-repeat center;
	-webkit-flex:0 0 62px;
	-ms-flex:0 0 62px;
	flex:0 0 62px;
	}/*透明搜尋鈕*/

/*大的*/
.search_function_fullG{border: 0;border-radius: 0;}
.search_function_fullG .search_functionSubmit_btn,
.search_function_fullG .search_functionClose_btn{	
	-webkit-flex:0 0 62px;
	-ms-flex:0 0 62px;
	flex:0 0 62px;
}
.search_function_fullG .search_functionSubmit_btn{background-image: none;}
.search_function_fullG .search_functionSubmit_btn i{
	display: block;
	width: 16px;
	height: 16px;
	margin: auto;
}
.search_function_fullG .search_functionSubmit_btn svg{	fill:#fff;}
.err_input .search_functionSubmit_btn{box-shadow:1px 0px 0 #c0382b inset; }
.search_function_err{
	position: relative;
	padding-left: 20px;
	color: #c0382b;
	font-size: 13px;
	margin-top: 7px;
}
.search_function_err:before,
.search_function_scss:before{
	content: '';
	display: block;
	position: absolute;
	width: 12px;
	height:12px;
	background:url(../../images/control/error.svg) no-repeat;
	top: 2px;
	left: 0;
}





/*可共用內下拉選單*/
/*避免被td其他狀態影響要加上字顏色粗細*/
.select_in_tdG{
	position: relative;
	width: 112px;
	display: inline-block;
	color: rgba(0, 0, 0, .8);
}
.select_in_tdG:after{
	content: '';
	position: absolute;
	display:block;
	width: 11px;height: 7px;
	background: url(../../images/control/re_sreachArr_D.svg) no-repeat;
	top: 0;
	bottom: 0;
	right: 16px;
	margin: auto;
	opacity: .6;
	pointer-events: none;
}
.select_in_tdTitle{font-weight: 600;}
.select_in_tdUL{
	position: absolute;
	width: 128px;
	padding: 8px 0;
	background-color: #fff;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.24);
	text-align: left;
	top: -23px;
	left: -17px;
	z-index: 2;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
}
.select_in_tdUL li{
	position: relative;
	width: 100%;
	height: 48px;
	line-height: 48px;
	padding: 0 17px;
}
.select_in_tdUL li.on{order: 0;}
.select_in_tdUL li.on:after{
	content: '';
	display: block;
	position: absolute;
	width: 11px;
	height: 7px;
	background:url(../../images/control/re_sreachArr_D.svg) no-repeat;
	top: 0;
	bottom: 0;
	right: 16px;
	margin: auto;
}
.select_in_tdUL li span{position: relative;}
.select_in_tdG select{
	background-color: transparent;
	border: 0;
	font-size: 14px;
	font-weight: 600;
}


/*可共用加減號*/
.add_infoG,
.less_infoG{
	width: 16px;
	height: 16px;
	background: url(../../images/control/B_plus.svg) no-repeat;
	margin: auto;
}
.less_infoG{background-image: url(../../images/control/B_less.svg) ;}


/*alert windows*/
.ar_bg{
	position: fixed;
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, .48);
	top: 0;
	left: 0;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-justify-content: center;
	-ms-justify-content: center;
	justify-content: center;
	-webkit-align-items: flex-start;
	-ms-align-items: flex-start;
	align-items: flex-start;
	z-index: 2;
}
.ar_main,
.ar_annG{
	width: 280px;
	padding: 22px 16px 24px; 
	background-color: #fff;
	border-radius: 3px;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
	margin-top: 178px;
}
.ar_ann_note{
	width: 300px;
	max-height: calc(100% - 120px);
	padding: 0 0 16px;
	background-color: #fff;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.16);
	margin-top: 64px;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
}
.ar_main>h1{
	height: 55px;
	line-height: 59px;
	padding-left: 17px;
	box-shadow: 0 -1px 0 #e1e1e1 inset;
	color: rgba(0, 0, 0, .6);
	font-size: 16px;
}
.ar_annG{
	position: relative;
	width: 520px;
	max-height: calc(100% - 129px);
	padding: 0 0 24px;
	margin-top: 89px;
	overflow-x: hidden;
	overflow-y: auto;	
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-flex-direction: column;
	-ms-flex-direction: column;
	flex-direction: column;
}
.ar_annG._ver_width{
	width: 360px;
}
.ar_title{
	position: relative;
	width: 100%;
	height: 54px;
	padding:0 17px;
	background-color: #fff;
	border-top-left-radius: 3px;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0);
	top: 0;
	border-top-right-radius: 3px;
	font-size: 16px;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-justify-content: space-between;
	-ms-justify-content: space-between;
	justify-content: space-between;
	-webkit-align-items: center;
	-ms-align-items: center;
	align-items: center;
	flex:none;
}
.ar_ann_note .ar_title{
	width: 100%;
	height: 48px;
	padding:0 17px;
	color: #fff;
	background-color: #b03427;
	box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0);
	border-radius: 0;
	top: 0;
	font-size: 16px;
	font-weight: bold;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-justify-content: center;
	-ms-justify-content: center;
	justify-content: center;
	-webkit-align-items: center;
	-ms-align-items: center;
	align-items: center;
	-webkit-flex:0 0 48px;
	-ms-flex:0 0 48px;
	flex:0 0 48px;
}
._ver_width  .ar_title{
	height: 32px;
	padding: 0 31px 0 17px;
}
.ar_title.scroll{box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .2);}
.ar_x_btn{
	width: 12px;
	height: 12px;
	background:url(../../images/control/close_x_w.svg) no-repeat center;
	border: 0;
	background-size: contain;
	opacity: .6;
}
.ar_ann_note .ar_x_btn{
	position: absolute;
	right: 17px;
	top: 17px;
	width: 14px;
	height: 14px;
}
.ar_ann_note .ar_gray_btn{
	width: 100%;
}
.ar_scroll{
	padding:5px 17px 0;
	overflow-x: hidden;
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}
.ar_ann_note .ar_scroll{padding: 16px 16px 0;}
.ar_ann_txtUL li{
	padding-bottom: 14px;
	border-bottom: 1px solid #e1e1e1;
	margin-bottom: 12px;
	word-break: break-word;
}
.ar_ann_txtUL li:last-child{
	padding-bottom: 0;
	border-bottom: 0;
}
.ar_note_txtUL li{
	margin-bottom: 16px;
	color: rgba(0, 0, 0, 0.64);
}
.ar_note_txtUL h1{
	font-weight: bold;
	height: 24px;
	line-height: 24px;
}
.ar_note_txtUL.EN h1{
	height: 20px;
	line-height: 20px;
}
.ar_note_txtUL p{
	display: block;
	margin-top: 20px;
}
.ar_note_txtUL h1 + p{
	margin-top: 0;
}
.ar_note_txtUL div + div{
	margin-top: 16px;
}
.ar_note_txtUL span{
	display: block;
	width: 100%;
	min-height: 130px;
	box-shadow: 0 0 0 1px #e0e0e0 inset;
	margin-bottom: 8px;
}
.ar_note_txtUL img{
	width: 100%;
	vertical-align: middle;
}
.ar_main_txt{line-height: 18px;}
.ar_main_txt h1{
	font-weight: 600;
	font-size: 16px;
	margin-bottom: 17px;
}
.ar_main_txtUL li{
	line-height: 17px;
	margin-bottom: 19px;
}
.ar_main_txtUL li:last-child{margin-bottom: 0;}
.ar_main_txtUL span{
	display: block;
	font-weight: 600;
	margin-bottom: 2px;
}
.ar_btnG{
	text-align: right;
	margin-top: 21px;
}
.ar_gray_btn{
	min-width: 65px;
	height: 48px;
	line-height: 48px;
	background-color: rgba(0, 0, 0, 0.54);
	border-radius: 3px;
	border: 0;
	color: #fff;
	font-size: 14px;
}
.ar_green_btn{
	width: 100%;
	height: 48px;
	line-height: 48px;
	padding: 0 16px;
	background-color: #38bb8f;
	border-radius: 3px;
	border: 0;
	color: #fff;
	font-size: 14px;
}


.ps_sendCode{
	position:fixed;
	width: 315px;
	height: 40px;
	padding: 0 16px;
	background-color: #404040;
	border-radius: 1px;
	bottom: 16px;
	left: 0;
	right: 0;
	margin: auto;
	visibility: collapse;
	z-index: 2;
	display: -webkit-flex;
	display: -ms-flex;
	display: flex;
	-webkit-justify-content: space-between;
	-ms-justify-content: space-between;
	justify-content: space-between;
	-webkit-align-items: center;
	-ms-align-items: center;
	align-items: center;
}
.ps_sendCode span{
	color: #fff;
	font-weight: normal;
	text-align: center;
	-webkit-flex:1 1 auto;
	-ms-flex:1 1 auto;
	flex:1 1 auto;
}
.ps_sendCode_btn{
	padding: 0;
	background-color: transparent;
	border: 0;
	color: #38bb8f;
	font-weight: bold;
	flex: none;
}
.ps_copyArea{
	position: absolute;
	opacity: 0;
}



/*共用無資料畫面*/
.data_noneG{
	padding-top: 26px;
	text-align: center;
	color: rgba(0, 0, 0, .6);
}
.re_detail_scroll .data_noneG{border-top: 1px solid #e0e0e0;}
.err404{
	position: fixed;
	width: 100%;
	height: 100%;
	background:url(../../images/control/err404.png)  #fff center no-repeat;
	top: 0;
	left: 0;
	z-index: 2;
}

/*width height*/
.w100per{width: 100%;}
.w192px{width: 192px;}
.w200px{width: 200px;}
.w360px{width: 360px;}
.h100per{height: 100%;}
.h93px{height: 93px;}
.minH35{min-height: 35vh;}
.minH50{min-height: 50vh;}
.accadd_content.content_l.minH50{min-height: 500px;}
.minH80{min-height: 80vh;}
.m_noH{margin:0;}

.mt13{margin-top: 13px;}

.mb12{margin-bottom: 12px;}

.ml7{margin-left: 7px;}
.ml12{margin-left: 12px;}
.ml15{margin-left: 15px;}

.mr6{margin-right: 6px;}
.mr7{margin-right: 7px;}
.mr28{margin-right: 28px;}

.down_txt{vertical-align: bottom;}
.top_txt{vertical-align: top;}

/*position*/
.por{
	position: relative;
	height: 100%;
}
.poa{position: absolute;}



/*background border */
.bgf0f0f0{
	min-height: 100%;
	background-color: #f0f0f0;
}
.noborder{border: 0;}

/*狀態變化border*/
.err_input{border-color:#c0382b;}
.focus_input{
	box-shadow: 0 0 4px 0 rgba(69, 144, 194, 0.16);
	border: solid 1px #4590c2;
}/*很多線都是外層div做成非input 所以無法用:focus*/




/*word*/
.word_link{
	color: #2980b9;
	font-weight: 600;
}
.word_link.on{color: #660099;}
.txtc,
.re_table_main td.txtc,
td.txtc, th.txtc, span.txtc, div.txtc{text-align: center;}
.txtl, td.txtl, th.txtl, span.txtl, div.txtl{text-align: left;}
.txtr, td.txtr, th.txtr, span.txtr, div.txtr{text-align: right;}
.word_bold, td.word_bold, li.word_bold{font-weight: bold;}
.word_bold300, td.word_bold300{font-weight: 300;}
.word_bold500, td.word_bold500{font-weight: 600;}/*客人臨時改600*/
.word_nomal, td.word_nomal{font-weight: normal;}
.word_paleRed{color: #b14334;}
.word_lightpink{color: #ffc7c1;}
.word_lightRed{color: #dc7480;}
.word_red{color: #c0382b;}
.word_canvOrange{color: #f38b12;}
.word_orange{color: #f3b932;}
.word_lightOrange{color: #eba01e;}
.word_darkOrange{color: #bb9742;}
.word_milkOrange{color: #c09552;}
.word_lightGreen{color: #38bb8f;}
.word_paleGreen, .re_table_head02G td.word_lightGreen{color: #96e6cd;}
.word_green{color: #27a67b;}
.word_green_a8{color: rgba(39,166,123,8);}
.word_darkGreen{color: #33ab82;}
.word_lightBlue{color: rgba(93, 200, 238, .8);}
.word_canvBlue{color: #2b82ba;}
.word_blue{color: #2980b9;}
.word_lightGray{color: #666;}
.word_gray{color: rgba(0, 0, 0, .6);}
.word_black{color: #000;}
.word_black_a8{color: rgba(0, 0, 0, .8);}
.word_white02_a8{color: rgba(248, 248, 248, .8);}
.word_white_a6,
tr.tbet_table_head02G td.word_white_a6{color: rgba(255, 255, 255, .6);}
.word_white_a8{color: rgba(255, 255, 255, .8);}
.word_brown{color: #987e66;}
.word_select, .word_select_txt::selection {
	color:#4b4600;
	background: rgb(255,240,40);
}
.word_delline{text-decoration:line-through; }

.fz12{font-size: 12px;}
.fz16{font-size: 16px;}

/*input[type=password]{font-size: 22px;letter-spacing: 3px;}密碼點點變大如果需要再開啟*/
::-webkit-input-placeholder{color:rgba(0, 0, 0, .6);}
::-moz-placeholder{color:rgba(0, 0, 0, .6);}
::-ms-input-placeholder {color:rgba(0, 0, 0, .6);}

/*animate*/
/*開啟加上active*/
.use_animate{
	opacity: 0;
	visibility: collapse;
	z-index: 6;
	-webkit-transform: scale(1, 0);
	-ms-transform: scale(1, 0);
	transform: scale(1, 0);
	-webkit-transform-origin:0 0;
	-ms-transform-origin:0 0;
	transform-origin:0 0;
	-webkit-transition:all 300ms cubic-bezier(.55,0,.42,1);
	-ms-transition:all 300ms cubic-bezier(.55,0,.42,1);
	transition:all 300ms cubic-bezier(.55,0,.42,1);
}

.active .use_animate,
.active + .use_animate{
	opacity: 1;
	visibility: visible;
	-webkit-transform: scale(1, 1);
	-ms-transform: scale(1, 1);
	transform: scale(1, 1);
}


/*關閉加上active*/
.high_animate{
	height: 100%;
	opacity: 1;
	visibility: visible;
	-webkit-transform-origin:center 0;
	-ms-transform-origin:center 0;
	transform-origin:center 0;
	-webkit-transform: scale(1, 1);
	-ms-transform: scale(1, 1);
	transform: scale(1, 1);
	-webkit-transition:all 300ms cubic-bezier(.55,0,.42,1);
	-ms-transition:all 300ms cubic-bezier(.55,0,.42,1);
	transition:all 300ms cubic-bezier(.55,0,.42,1);
}

.active .high_animate,
.active + .high_animate{
	height: 0;
	opacity: 0;
	visibility: collapse;
	-webkit-transform: scale(1, 0);
	-ms-transform: scale(1, 0);
	transform: scale(1, 0);
}

.ma_main,
.ma_header,
.ma_left,
.ma_foot,
.ma_right,
.mu_memberDetailG,
.lg_input,
.ma_loading,
.re_functionG{ 
	-webkit-transition:all 300ms cubic-bezier(.55,0,.42,1);
	-ms-transition:all 300ms cubic-bezier(.55,0,.42,1);
	transition:all 300ms cubic-bezier(.55,0,.42,1);
}

/*X秒出現後消失 X=顯示的秒數*/
.item_disappear5s{
	-webkit-animation: item_5sdisappear 7s cubic-bezier(0.42, 0, 0.58, 1.0) both;
	animation: item_5sdisappear 7s cubic-bezier(0.42, 0, 0.58, 1.0) both;
}
.item_disappear2s{
	-webkit-animation: item_2sdisappear 4s cubic-bezier(0.42, 0, 0.58, 1.0) both;
	animation: item_2sdisappear 4s cubic-bezier(0.42, 0, 0.58, 1.0) both;
}

@-webkit-keyframes item_5sdisappear{
	0%{opacity: 0; visibility: visible;}
	14%{opacity: 1;}
	85%{opacity: 1;}
	100%{opacity: 0;}
}
@keyframes item_5sdisappear{
	0%{opacity: 0; visibility: visible;}
	14%{opacity: 1;}
	85%{opacity: 1;}
	100%{opacity: 0;}
}

@-webkit-keyframes item_2sdisappear{
	0%{opacity: 0; visibility: visible;}
	50%{opacity: 1;}
	75%{opacity: 1;}
	100%{opacity: 0;}
}
@keyframes item_2sdisappear{
	0%{opacity: 0; visibility: visible;}
	50%{opacity: 1;}
	75%{opacity: 1;}
	100%{opacity: 0;}
}



/*Hand*/
.lg_stratum li, .lg_lan_title img, .lg_adcomDot_btn li, .lg_adcomL_btn, .lg_adcomR_btn, .lg_login_btn, .ps_back_btn, .ps_submit_btn, .ps_mini_submit_btn, .ps_mini_cancel_btn, .ps_reset_btn, .ar_gray_btn, .ps_noteIconG, .mu_hab, .mu_back_btn, .mu_btnG li, .le_small_btnG li, .le_small_btnG li:before, .le_big_btnG h1:before, .le_big_btnG h1, .bm_btnG li, .mu_btnG i, .re_selectG>ul li, .re_bettypesG li, .re_dateInfo, .re_titleG li, .re_linkG:after, .backtop_btn, .re_searchclose_btn, .da_linkG span:after, .da_linkG span:hover:before, .re_export_select li, .re_export_select_twoLines li, .re_sreachtermtxt, .re_sreachitem, .re_sreachitem_select, .re_sreachitem>ul>li, .cal_date, .cal_date_left, .re_detailclose_btn, .re_Ibtn, .re_betdetail_close_btn, .re_table_body td, .mu_memberUL li:not(.mu_memberUL_title), .word_link, .re_sma_submit_btn, .lg_lanUL li, .ar_choose_Info li, .url_list_item, .re_table_body_auto td, .re_bet_selectG, .re_td_fixedShadow:after, .re_betdetail_cancelN, .re_betdetail_cancelY, .re_more_btn, .re_more_btn_360, .search_functionSubmit_btn, .search_functionClose_btn, .search_functionSubmit_tran_btn, .checkbox_blue span, .wmc_search_chkG span, .select_in_tdUL, .select_in_tdUL li, .re_settlement_tb tr:not(.fix_trColor), .re_accounting_tb tr:not(.fix_trColor), .re_main600_tb, .wmc_pause_btn, .wmc_clear_btn, .wmc_stake_option span, .wmc_stake_option span:before, .wmc_filter600_info48UL li, .wmc_searchUL li:not(.wmc_searchUL_sp):not(.disabled), .wmc_filter600_info48UL li:after, .tbet_wagers_searchLi, .tbet_menu_txt, .tbet_collapse_img, .tbet_collapse_switch, .tbet_table_body_auto td, .lg_loginold_btn, .tbet_wagers_teamUL, .tbet_inside_btn, .tbet_title_btnG li, .tbet_datatitle_btnG li, .tbet_td_indside_arrIcon,.tbet_td_indside_eidtIcon, .ps_chk_btn, .teach_next_btn, .teach_ok_btn, .re_main600_tb tr:not(.fix_trColor), .aclist-tr.content, .searchbar .select, .titlebar_menu .save, .titlebar_menu .cancel, .credits_item03 .btn_save, .credits_item03 .btn_cancel, .menu_save .save, .menu_save .save_new, .menu_save .cancel, .search_functionSubmit_btn, .ps_sendCode_btn, .ar_x_btn, .ar_title, .ar_notice_btn, .ar_green_btn, .tbet_div_body [class^="tbet_inbody_item"], .tbet_div_body [class^="tbet_body_item"], .tbody_line td, .ver_x_btn, .ver_foot>input, .ver_reset_btn{
	-webkit-transition: color .3s linear, background-color .3s linear,opacity .3s linear,box-shadow .3s linear;
	-ms-transition: color .3s linear, background-color .3s linear,opacity .3s linear,box-shadow .3s linear;
	transition: color .3s linear, background-color .3s linear,opacity .3s linear,box-shadow .3s linear;
}
.hand, .lg_stratum li, .lg_lan_title, .lg_lanUL li, .lg_adcomPage1 span, .lg_adcomL_btn, .lg_adcomR_btn, .lg_adcomDot_btn li, .lg_forget, .lg_login_btn, .ps_back_btn, .ps_submit_btn, .ps_mini_submit_btn, .ps_mini_cancel_btn, .ps_reset_btn, .ar_gray_btn, .ps_noteIconG, .ps_miniDone_btn, .mu_name li, .mu_hab, .mu_back_btn, .mu_btnG li, .le_small_btnG li, .le_big_btnG h1:before, .le_big_btnG h1, .le_big_inside li, .bm_btnG li, .mu_btnG i, .re_selectG>ul li, .re_selectG,.re_bettypesG li , .re_dateInfo, .re_titleG li, .re_linkG, .backtop_btn, .re_searchclose_btn, .da_linkG span, .re_export_select li, .re_export_select_twoLines li, .re_exportG, .re_sort, .re_sreachitem, .re_sreachitem_select, .re_sreachitem>ul>li, .re_detailclose_btn, .re_Ibtn, .re_betdetail_close_btn, .mu_memberUL li:not(.mu_memberUL_title), .eye_icon, .no_eye_icon, .word_link, .re_sma_submit_btn, .ar_choose_Info li, .url_list_item, .search_functionSubmit_btn, .search_functionClose_btn, .select_in_tdUL li, .select_in_tdG, .add_infoG, .wmc_pause_btn, .wmc_clear_btn, .wmc_volume_btn, .wmc_stake_input span, .re_filter_back_btn, .wmc_searchUL li:not(.wmc_searchUL_sp):not(.disabled), .wmc_filter600_back_btn, .wmc_filter600_info48UL li, .tbet_menu_sportsUL li, .tbet_collapse_img, .tbet_collapse_switch, .tbet_inside_btn, .tbet_table_body_auto td, .lg_loginold_btn, .tbet_wagers_teamUL, .tbet_title_btnG li, .tbet_datatitle_btnG li, .tbet_td_indside_arrIcon,.tbet_td_indside_editIcon, .ps_chk_btn.on, .re_breadUL li, .teach_next_btn, .teach_ok_btn, .le_small_inside li, .re_sreachtermtxt, .re_more_btn, .checkbox, .searchbar .select, .menu_save .save, .menu_save .save_new, .menu_save .cancel, .ac_sort, .drop_down li, .mem_detail_backbtn, .ps_sendCode_btn, .ar_x_btn, .ar_notice_btn, .wmc_stake_option, .wmc_search_chkG, .ar_green_btn, .tbet_collapse_td, .tbet_div_headG, .tbet_div_body [class^="tbet_inbody_item"], .tbet_div_body [class^="tbet_body_item"], .tbet_breadG li, .mu_profile, .re_copy_btn, .ver_x_btn, .ver_foot>input, .ver_reset_btn{cursor: pointer;}





@media (pointer:fine),
screen and (-ms-high-contrast: active),
(-ms-high-contrast: none) {	
	.lg_lan_title:hover img,
	.lg_side_title:hover img,
	.da_linkG span:hover:before,
	.da_linkG span:hover:after,
	.re_searchclose_btn:hover,
	.re_detailclose_btn:hover,
	.re_linkG:hover:after,
	.re_selectG:hover:before,
	.re_dateInfo:hover:after,	
	.re_betdetail_close_btn:hover,
	.re_detailclose_btn:hover,
	.tbet_collapse_img:hover,
	.tbet_table_head02G:hover .tbet_collapse_switch,
	.tbet_div_headG:hover .tbet_collapse_switch,
	.lg_adcomL_btn:hover,
	.lg_adcomR_btn:hover,
	.hover_op1,
	.ver_x_btn:hover{opacity:1;}

	.ps_noteIconG:hover:after,
	.re_Ibtn:hover,
	.hover_op084{opacity: .84;}


	.ps_back_btn:hover,
	.le_small_btnG li:hover:before,
	.le_big_btnG h1:hover:before,
	h1.le_titleOn:before,
	.search_functionSubmit_btn:hover,
	.searchbar .select:hover,
	.ar_x_btn:hover,
	.hover_op08,
	.ver_reset_btn:hover{opacity: .8;}
	

	.mu_hab:hover,
	.mu_back_btn:hover,
	.mu_btnG li:hover,
	.add_infoG:hover,
	.ps_reset_btn:hover,
	.wmc_pause_btn:hover,
	.wmc_clear_btn:hover,
	.wmc_filter600_back_btn:hover,
	.re_filter_back_btn:hover,
	.tbet_inside_btn:hover,
	.lg_loginold_btn:hover,
	.hover_op06{opacity: .6;}



	.search_functionClose_btn:hover,
	.search_functionSubmit_tran_btn:hover,
	.tbet_td_indside_arrIcon:hover,
	.tbet_td_indside_editIcon:hover,
	.teach_next_btn:hover,
	.hover_op03{opacity: .3;}

	



	.lg_stratum li:hover,
	.hover_bgc0382b{background-color: #c0382b;color: #fff;}




	.lg_lanUL li:hover,
	.ar_choose_Info li:hover,
	.re_selectG>ul li:hover,
	.cal_date:not(.cal_space):hover,
	.cal_date_left:not(.cal_space):hover,
	.re_bettypesG li:hover,
	.re_sreachitem>ul>li:hover,
	.select_in_tdUL li:hover,
	.wmc_searchUL li:not(.wmc_searchUL_sp):not(.disabled):hover,
	.wmc_filter600_info48UL li:hover,
	.tbet_wagers_searchLi:hover,
	.re_export_select li:hover,
	.re_export_select_twoLines li:hover,
	.re_sreachtermtxt:hover,
	.hover_bge3e3e3{background-color: #e3e3e3;}



	.lg_adcomDot_btn li:hover,
	.hover_bgfff{background-color:#fff;}


	.url_list_item:hover,
	.re_sreachitem:hover,
	.re_sreachitem_select:hover,
	.re_sreachitem.active,
	.re_table_body:hover td,
	.re_table_body_auto:hover td,
	.tbet_table_body_auto:hover td,
	.tbet_wagers_teamUL:hover,
	.re_settlement_tb tr:not(.fix_trColor):hover,
	.re_accounting_tb tr:not(.fix_trColor):hover,
	.re_exchange_tb tr:not(.fix_trColor):hover,
	.re_main600_tb tr:not(.fix_trColor):hover,
	.aclist-tr.content:hover,
	.tr_bgebf7ff td,
	.re_result_div_body:hover,
	.tbet_div_body [class^="tbet_inbody_item"]:hover,
	.tbet_div_body [class^="tbet_body_item"]:hover,	
	.tbody_line:hover td,
	.hover_tr_bgebf7ff{background-color: #ebf7ff;}
	


	
	.hover_text_op08{color: rgba(255, 255, 255, .8);}
	
	
	.ps_submit_btn:hover,
	.ps_mini_submit_btn:hover,
	.ps_miniDone_btn:hover,
	.teach_ok_btn:hover,
	.titlebar_menu .save:hover,
	.credits_item03 .btn_save:hover,
	.menu_save .save:hover,
	.menu_save .save_new:hover,
	.ar_green_btn:hover,
	.hover_bg38bb8f_op06,
	.ver_submit_btn:hover{background-color: rgba(56, 187, 143, .6);}

	.re_sma_submit_btn:hover,
	.hover_bg2980b9_op06{background-color: rgba(41, 128, 185, .6);}

	.lg_login_btn:hover,
	.hover_bg38bb8f_op04{background-color:rgba(56, 187, 143, .4);}


	.ar_gray_btn:hover,
	.hover_bg000_op03,
	.ver_cancel_btn:hover{background-color: rgba(0, 0, 0, .3);}


	.backtop_btn:hover,
	.hover_bg000_op02{background-color: rgba(0, 0, 0, .2);}



	.ps_mini_cancel_btn:hover,
	.titlebar_menu .cancel:hover,
	.credits_item03 .btn_cancel:hover,
	.menu_save .cancel:hover,
	.hover_graybtn{
		background-color: rgba(130, 130, 130, .4);
		box-shadow:0 0 0 1px rgba(130, 130, 130, 0) inset;
		color: #fff;
	}

	
	.mu_memberUL li:not(.mu_memberUL_title):hover,
	.hover_bg000_op01{background-color: rgba(0,0,0,.1);}



	.bm_btnG li:hover,
	.hover_bg000_op008{background-color: rgba(0, 0, 0, 0.08);}



	.le_small_btnG>li:hover,
	.le_big_btnG h1:hover,
	.hover_menuoutside_btn{
		background-color: rgba(0, 0, 0, 0.24);
		color: rgba(255, 255, 255, .8);
	}

	.le_small_inside li:hover,
	.le_big_inside li:hover,
	.hover_textb4e1ff{color:#b4e1ff;}


	
	.re_title600type li.word_red:hover,
	.re_titleG li:hover,
	.hover_textc0392b{color: #c0392b;}

	
	.tbet_menu_sportsUL li:hover .tbet_menu_txt,
	.hover_textc0382b{color: #c0382b;}


	.tbet_datatitle_btnG li:hover,
	.hover_textc34235{color: #c34235;}


	.re_title600type li.word_green:hover,
	.ps_sendCode_btn:hover,
	.hover_text27a67b{color: #27a67b;}
	
		
	.word_link:hover,
	.hover_text660099{color: #660099;}

	.re_selectG:hover,
	.re_dateInfo:hover,
	.hover_shadow_op016{box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.16);}

	.tbet_menu_sportsUL li:hover .tbet_menu_img,
	.hover_allbetmenu_btn{background-position: center top;}

	.tbet_title_btnG li:hover,
	.hover_allbetmenu_text{background-color: #fff;color: #000;}


	.ar_notice_btn:hover{background-color: #ee8b2f;color: #fff;}

}


	.lg_lan_title:active img,
	.lg_side_title:active img,
	.da_linkG span:active:before,
	.da_linkG span:active:after,
	.re_searchclose_btn:active,
	.re_detailclose_btn:active,
	.re_linkG:active:after,
	.re_selectG:active:before,
	.re_dateInfo:active:after,
	.re_betdetail_close_btn:active,
	.re_detailclose_btn:active,
	.tbet_collapse_img:active,
	.tbet_table_head02G:active .tbet_collapse_switch,
	.tbet_div_headG:active .tbet_collapse_switch,
	.lg_adcomL_btn:active,
	.lg_adcomR_btn:active,
	.active_op1,
	.ver_x_btn:active{opacity:1;}

	.ps_noteIconG:active:after,
	.re_Ibtn:active,
	.active_op084{opacity: .84;}


	.ps_back_btn:active,
	.le_small_btnG li:active:before,
	.le_big_btnG h1:active:before,
	h1.le_titleOn:before,
	.search_functionSubmit_btn:active,
	.ar_x_btn:active,
	.searchbar .select:active,
	.active_op08,
	.ver_reset_btn:active{opacity: .8;}
	

	.mu_hab:active,
	.mu_back_btn:active,
	.mu_btnG li:active,
	.add_infoG:active,
	.ps_reset_btn:active,
	.wmc_pause_btn:active,
	.wmc_clear_btn:active,
	.wmc_filter600_back_btn:active,
	.re_filter_back_btn:active,
	.tbet_inside_btn:active,
	.lg_loginold_btn:active,
	.active_op06{opacity: .6;}



	.search_functionClose_btn:active,
	.search_functionSubmit_tran_btn:active,
	.tbet_td_indside_arrIcon:active,
	.tbet_td_indside_editIcon:active,
	.teach_next_btn:active,
	.active_op03{opacity: .3;}

	



	.lg_stratum li:active,
	.active_bgc0382b{
		background-color: #c0382b;
		color: #fff;
	}




	.lg_lanUL li:active,
	.ar_choose_Info li:active,
	.cal_date:active,
	.cal_date_left:active,
	.re_bettypesG li:active,
	.select_in_tdUL li:active,
	.wmc_searchUL li:not(.wmc_searchUL_sp):not(.disabled):active,
	.wmc_filter600_info48UL li:active,
	.tbet_wagers_searchLi:active,
	.re_export_select li:active,
	.re_export_select_twoLines li:active,
	.re_sreachtermtxt:active,
	.active_bge3e3e3{background-color: #e3e3e3;}



	.lg_adcomDot_btn li:active,
	.active_bgfff{background-color:#fff;}


	.url_list_item:active,
	.re_sreachitem:active,
	.re_sreachitem_select:hover,
	.re_sreachitem.active,
	.re_table_body:active td,
	.re_table_body_auto:active td,
	.tbet_table_body_auto:active td,
	.tbet_wagers_teamUL:active,
	.re_settlement_tb tr:not(.fix_trColor):hover,
	.re_accounting_tb tr:not(.fix_trColor):hover,
	.re_exchange_tb tr:not(.fix_trColor):hover,
	.re_main600_tb tr:not(.fix_trColor):hover,
	.aclist-tr.content:hover,
	.tr_bgebf7ff td,
	.re_result_div_body:active,
	.tbet_div_body [class^="tbet_inbody_item"]:active,
	.tbet_div_body [class^="tbet_body_item"]:active,
	.active_tr_bgebf7ff{background-color: #ebf7ff;}
	


	
	.active_text_op08{color: rgba(255, 255, 255, .8);}
	
	
	.ps_submit_btn:active,
	.ps_mini_submit_btn:active,
	.ps_miniDone_btn:active,
	.teach_ok_btn:active,
	.titlebar_menu .save:active,
	.credits_item03 .btn_save:active,
	.menu_save .save:active,
	.menu_save .save_new:active,
	.ar_green_btn:active,
	.active_bg38bb8f_op06,
	.ver_submit_btn:active{background-color: rgba(56, 187, 143, .6);}

	.re_sma_submit_btn:active,
	.active_bg2980b9_op06{background-color: rgba(41, 128, 185, .6);}

	.lg_login_btn:active,
	.active_bg38bb8f_op04{background-color:rgba(56, 187, 143, .4);}


	.ar_gray_btn:active,
	.active_bg000_op03,
	.ver_cancel_btn:active{background-color: rgba(0, 0, 0, .3);}


	.backtop_btn:active,
	.active_bg000_op02{background-color: rgba(0, 0, 0, .2);}



	.ps_mini_cancel_btn:active,
	.titlebar_menu .cancel:active,
	.credits_item03 .btn_cancel:active,
	.menu_save .cancel:active,
	.active_graybtn{
		background-color: rgba(130, 130, 130, .4);
		box-shadow:0 0 0 1px rgba(130, 130, 130, 0) inset;
		color: #fff;
	}

	
	.mu_memberUL li:not(.mu_memberUL_title):active,
	.active_bg000_op01{background-color: rgba(0,0,0,.1);}



	.bm_btnG li:active,
	.active_bg000_op008{background-color: rgba(0, 0, 0, 0.08);}



	.le_small_btnG>li:active,
	.le_big_btnG h1:active,
	.active_menuoutside_btn{
		background-color: rgba(0, 0, 0, 0.24);
		color: rgba(255, 255, 255, .8);
	}

	.le_small_inside li:active,
	.le_big_inside li:active,
	.active_textb4e1ff{color:#b4e1ff;}


	
	.re_title600type li.word_red:active,
	.re_titleG li:active,
	.active_textc0392b{color: #c0392b;}

	
	.tbet_menu_sportsUL li:active .tbet_menu_txt,
	.active_textc0382b{color: #c0382b;}


	.tbet_datatitle_btnG li:active,
	.active_textc34235{color: #c34235;}


	.re_title600type li.word_green:active,
	.ps_sendCode_btn:active,
	.active_text27a67b{color: #27a67b;}
	
		
	.word_link:active,
	.active_text660099{color: #660099;}

	.re_selectG:active,
	.re_dateInfo:active,
	.active_shadow_op016{box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.16);}

	.tbet_menu_sportsUL li:active .tbet_menu_img,
	.active_allbetmenu_btn{background-position: center top;}

	.tbet_title_btnG li:active,
	.active_allbetmenu_text{
		background-color: #fff;
		color: #000;
	}

	.ar_notice_btn:active{
		background-color: #ee8b2f;
		color: #fff;
	}


/*保留功能但清除scrollbar外觀*/
.re_sreachtermG::-webkit-scrollbar,
.tbet_menu_sportsUL::-webkit-scrollbar,
.tbet_datatitle_btnG::-webkit-scrollbar,
.tbet_wagers_amount::-webkit-scrollbar,
.re_titleG:not(.scroll)::-webkit-scrollbar{display: none;}

/*hide*/
.hide_item,
.LPMcontainer{display: none!important;}

@media only screen and (max-width: 1279px){
	.hide_on_1279down_only{display:none!important;}
}/*沒幾個需要用到乾脆獨立*/


@media only screen and (min-width: 1024px){
	.hide_on_large_only{display:none!important;}
}
@media only screen and (min-width: 768px) and (max-width: 1023px){
	.hide_on_med_only{display:none!important; }
}


/*偷渡放這邊*/
@media only screen and (min-width:1px) and (max-width:1023px){
	.accadd_content.content_l.minH50{min-height: auto!important;}
}
@media only screen and (orientation:portrait) and (max-width:767px){
	.ps_sendCode{bottom: 56px;}
	
}
@media only screen and (max-width: 797px){	
	.ps_sendCode{width: 100%;}
	.ps_sendCode span{text-align: left;}
	.backtop_btn{bottom: 72px;}
	.ar_annG{width: calc(100% - 80px);}
}


@media only screen and (min-width: 600px) and (max-width: 767px){
	.hide_on_small_only{display:none!important;}
}


@media only screen and (max-width: 599px){
	.hide_on_mini_only{display:none!important;}	
	.ar_ann_note{max-height:calc(100% - 32px);margin-top: 16px;}	
}

@media only screen and (max-height: 414px){	
	.ar_bg{
		-webkit-align-items: center;
		-ms-align-items: center;
		align-items: center;
	}
	.ar_main, .ar_annG{margin-top: 0;}
}

/*no hand opcity0*/
.opcity0{opacity: 0;}
.no_hand,
.ps_reset_btn.on,
li.wmc_searchUL_sp{cursor: default;}

.mwc_bg_color td{background-color: #a78025;}


</style>
</head>
<body onload = "new record_index(window, document).init();">
<div id="body_show" class="ma_contentfull"></div>

<div id="wmc_filter_show"></div>
<!-- loading -->
<div class="ma_loadingfull" id="loading">
    <div class="lds_main">
        <div class="lds_all">
            <div class="lds_spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div id="load_txt" class="lds_txt">LOADING</div>
        </div>
    </div>
</div>
<!-- loading end -->



<!-- filter_loading -->
<div class="filter_loading" id="filter_loading" style="display: none">
    <div class="lds_main">
        <div class="lds_all">
            <div class="lds_spinner">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
            <div id="load_txt02" class="lds_txt">LOADING</div>
        </div>
    </div>
</div>
<!-- loading end -->


<!-- alert -->
<div id="alert_show" class="ma_alert" style="display:none"></div>
<!-- alert end -->

</body>
</html>