<?PHP 
header('Content-type: text/html;charset=utf-8');
$_p = $_GET;
if($_p["langx"] == "cn"){ 
?>

var ts=[];
var scrollObj = null;
var echo = function(){};

function setScrollObject(obj){
		scrollObj = obj;
}

function tryscroll(e){
		
		Log("tryscroll: "+e);
		if(scrollObj==null) return;
		listionEvent(e, scrollObj);
}
function touchObject(targetObject,eventObject){
		return true;
}

function listionEvent(e,targetObject){
	Log(targetObject);
		var action="";
		var touch=e.targetTouches[0];
		if (e.type=="touchstart"){
				ts.x=touch.pageX;
				ts.y=touch.pageY;
		}

		if (!touchObject(targetObject,e.target)){
		 		stopScroll(e)
		}else{
				if (targetObject.scrollTop==0){
						if (ts.y-touch.pageY<0){
							 	if (e.type=="touchmove"){
										Log("[2]"+ts.y+"-"+touch.pageY+"<0");
									 	stopScroll(e)
				 	 			}
			 	 				
				 		}
			 	}
		 		if ((targetObject.scrollTop+targetObject.clientHeight)==targetObject.scrollHeight){
						if (ts.y-touch.pageY>0){
								if (e.type=="touchmove"){
										Log("[3]"+ts.y+"-"+touch.pageY+">0");
										stopScroll(e)
					 			}
				 		
						}
				}
			
		}
}
function FindEventTargetObject(e, cls){
		var TargetObj=null;
		for (var i=0;i<e.path.length;i++){
				TargetObj=e.path[i];
		
				if (e.path[i].clientHeight<e.path[i].scrollHeight && ((TargetObj.style.overflow!=""&&TargetObj.style.overflow!="hidden")||TargetObj.className.indexOf(cls)!=-1)){
						return TargetObj;
				}
		}
		return null;
}

function stopScroll(e){
	try{
		e.preventDefault();
		e.stopPropagation();
	}catch(err){
		Log(err);
	}
}

function Log(msg){

}
function HttpRequest(){
		var _self=this;
		var req;
		var eventHandler=new Array();
		var parentClass;
		var isAbort = false;
		var cancelAbort = false;
		var _url = "";
		var _method = "";
		var _params = "";
		var _pageName = "";
		_self.ts = "";

		_self.init=function(){
				_self.addEventListener("LoadComplete",_self.cmd_proc);
				_self.ts = _self.getTimestamp();

		}
		_self.help=function(){
				var str="";
				str+="EventName:LoadComplete Method:function(html)\n";
				str+="Method:loadURL(url,post/get,pamam)\n";
				return str;
		}
		
		_self.setParentclass=function(parentclass){
				parentClass=parentclass;
		}
		
		_self.getThis=function(varible){
				return eval(varible);
		}
	
		
		
		_self.loadURL=function(url,method,params) {
				req = false;
				_url = url;
				_method = method;
				_params = params;

		    if(window.XMLHttpRequest && !(window.ActiveXObject)) {
			    	try{
								req = new XMLHttpRequest();
			      }catch(e){
								req = false;
			      }
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
						
						_time = new Date();
						var new_par = _self.replaceFromParam(_params);
						
						var isBet = (_pageName.indexOf("bet")!=-1 && _pageName.indexOf("betradar")==-1);
						var isHistory = (_pageName.indexOf("get_history")!=-1);
						if( !isBet && !isHistory) req.timeout = 10000;

						if(top["requestHash"][_method+"_"+new_par]){
							var tmpTS = top["requestHash"][_method+"_"+new_par].ts;
							if(tmpTS!=_self.ts){
								top["requestHash"][_method+"_"+new_par].cancelAbort();
								delete top["requestHash"][_method+"_"+new_par];
							}
						}
						top["requestHash"][_method+"_"+new_par] = _self;
						req.onreadystatechange = _self.processReqChange;
						if(method==undefined) method="POST";
						if(method.toUpperCase()=="POST"){
								req.open("POST", url+_self.getP(params), true);
					  			req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
								req.send(params);
				
						}else{
								req.open("GET", url+"?"+params, true);
								req.send("");
						}
						
				}
		}

		_self.abort=function(){
			try{
				isAbort = true;
				req.abort();
			}catch(e){
				console.error("[abortError] = ",e);
			}
		}

		_self.cancelAbort = function(){
			try{
				cancelAbort = true;
				req.abort();
			}catch(e){
				console.error("[cancelAbortError] = ",e);
			}
		}
		
		_self.processReqChange=function() {
			if(cancelAbort) return;
		    if(req.readyState == 4){
				var new_par = _self.replaceFromParam(_params);
		        if(req.status == 200){
					delete top["requestHash"][_method+"_"+new_par];
					delete top["requestFailedHash"][_method+"_"+new_par];
		          	_self.eventhandler("LoadComplete",req.responseText);
		        }else if(req.status==0){
					if(isAbort){
						_self.eventhandler("onAbort",req);
					}else{
						if(_pageName.indexOf("bet")==-1 || _pageName.indexOf("betradar")!=-1){
							top["requestFailedHash"][_method+"_"+new_par] = "Failed";
							setTimeout(_self.loadURL, 1000, _url, _method, _params);
						}else{
							_self.eventhandler("onError",req);
						}
					}
				}else{
					if(_pageName.indexOf("bet")==-1 || _pageName.indexOf("betradar")!=-1){
						top["requestFailedHash"][_method+"_"+new_par] = "Failed";
						setTimeout(_self.loadURL, 1000, _url, _method, _params);
					}else{
						_self.eventhandler("onError",req);
					}
		        }
		    }else if(req.readyState == 0 && req.status==0){
				if(isAbort){
					_self.eventhandler("onAbort",req);
				}else{
					if(_pageName.indexOf("bet")==-1 || _pageName.indexOf("betradar")!=-1){
						top["requestFailedHash"][_method+"_"+new_par] = "Failed";
						setTimeout(_self.loadURL, 1000, _url, _method, _params);
					}else{
						_self.eventhandler("onError",req);
					}
				}
			}
			isAbort = false;
		}
		
		_self.addEventListener=function(eventname,eventFunction){
				eventHandler[eventname]=eventFunction;
		}
		
		_self.removeEventListener=function(eventname){
				EventHandler[eventname]=undefined;
		}
		
		_self.eventhandler=function(eventname,param){
				if(eventHandler[eventname]!=undefined){
						eventHandler[eventname](param);
				}
		}
		
		_self.cmd_proc=function(html){
				alert(html);
		}
		_self.getP = function(params){
			var p = "?ver="+top.ver;
			if(typeof autoLogin=="function"){
				var par = params.split("&");
				for(var i=0; i<par.length; i++){
					var tmp = par[i].split("=");
					if(tmp[0]=="p"){
						p="?p="+tmp[1]+"&ver="+top.ver;
						break;
					}
				}
			}
			return p;
		}
		_self.replaceFromParam = function(_params){
			var replaceParam = _params;
			var par = _params.split("&");
			for(var i=0; i < par.length; i++){
				if(par[i].indexOf("ver=")!=-1 || par[i].indexOf("ts=")!=-1 || par[i].indexOf("timestamp=")!=-1){
					replaceParam = replaceParam.replace(par[i], "");
				}
				if(par[i].indexOf("p=")!=-1 && _pageName==""){
					_pageName = par[i].split("=")[1];
				}
			}
			return replaceParam;
		}

		_self.getTimestamp = function(){
			return new Date().getTime();
		}
		_self.init();
}
function LS_cn(){
    var _self = this;
    var parentClass;
    var array;

    _self.init=function(){
        array = _self.set();
    }

    _self.set=function(){
        var array = new Object();
        array["RMB"]="人民币";
        array["HKD"]="港币";
        array["USD"]="美金";
        array["MYR"]="马币";
        array["SGD"]="新币";
        array["THB"]="泰铢";
        array["GBP"]="英镑";
        array["JPY"]="日币";
        array["EUR"]="欧元";
        array["IDR"]="印尼盾";
        array["NTD"]="台币";
        array["GOD"]="金币";
        array["BG"]="B金";

        array["gold_k"] = "千";
        array["gold_10k"] = "万";
        array["gold_100m"] = "亿";
                
        array["loading_txt"] = "加载中";
        array["showtype_live"] = "滚球";
        array["showtype_today"] = "今日";
        array["showtype_early"] = "早盘";
        array["showtype_hot"] = "热门赛事";
        array["showtype_soon"] = "即将开赛";
        array["showtype_outrights"] = "冠军";
        array["showtype_parlay"] = "综合过关";
        array["showtype_fs"] = "冠军盘口";
        array["showtype_mygame"] = "我的赛事";

        array["live"] = "滚球赛事";
        array["today"] = "今日赛事";
        array["early"] = "早盘赛事";
        array["outrights"] = "冠军盘口";
        array["fs"] = "冠军盘口";
        array["soon"] = "赛事即将开始";
        array["hot"] = "热门赛事";

        array["str_coupon_rb"] = "滚球赛事";
        array["str_coupon_today"] = "今日赛事";
        array["str_coupon_future"] = "未來赛事";
        array["str_coupon_date"] = "所有赛事";

        array["gtype_all"] = "所有体育";
        array["gtype_bk"] = "篮球 & 美式足球";
        array["gtype_es"] = "电子竞技";
        array["gtype_bm"] = "羽毛球";
        array["gtype_bs"] = "棒球";
        array["gtype_ft"] = "足球";
        array["gtype_op"] = "其他";
        array["gtype_sk"] = "斯诺克/台球";
        array["gtype_tn"] = "网球";
        array["gtype_tt"] = "乒乓球";
        array["gtype_vb"] = "排球";

        array["allGame"] = "所有赛事";
        array["hotGame"] = "热门";

        array["Mon"] = "星期一";
        array["Tue"] = "星期二";
        array["Wed"] = "星期三";
        array["Thu"] = "星期四";
        array["Fri"] = "星期五";
        array["Sat"] = "星期六";
        array["Sun"] = "星期日";

        array["mon_01"] = "一月";
        array["mon_02"] = "二月";
        array["mon_03"] = "三月";
        array["mon_04"] = "四月";
        array["mon_05"] = "五月";
        array["mon_06"] = "六月";
        array["mon_07"] = "七月";
        array["mon_08"] = "八月";
        array["mon_09"] = "九月";
        array["mon_10"] = "十月";
        array["mon_11"] = "十一月";
        array["mon_12"] = "十二月";

        array["mycoupon"] = "我的参赛表";

        array["bet_txt"] = "下注";
        array["betslip_txt"] = "注单";
        array["accept_change_txt"] = "接受变化";
        array["lastBetOption_fast"] = "保留选项";
        array["lastBetOption_total"] = "保留选项";
        array["parlay_txt"] = "综合过关";
        array["single_txt"] = "单注";

        array["datetime_today"] = "今日";

        array["4pwd_new"] = "你要设置一个简易密码以便快速登入吗?";
        array["4pwd_second"] = "您现在的装置 / 浏览器尚未设定简易密码登入，为了让您更快速方便的登入，是否要现在设定呢？"+"<br>"+"<br>"+"注意：使用其他帐户登录将暂时禁用此设备/浏览器上的简易密码登入。";
        array["4pwd_chkdel"] = "此动作将在您的所有设备上停用您的简易密码登录。"+"<br>"+"<br>"+"你确定吗？";
        array["4pwd_del"] = "您已成功取消简易登入功能。";
        array["4pwd_set"] = "设定您的简易密码以便快速登入。";
        array["4pwd_chkAgain"] = "重新输入你的简易密码来登入或是";

        array["connect_retry"] = "网路不稳定，请重新更新。";
        array["connect_fail"] = "网路极度不稳定，请检查你的网路。";
        array["connect_again"] = "重新尝试连线";
        array["connect_ok"] = "确认";
        
        array["pls_chg_pwd"] = "请修改您的新帐号密码以确保安全。";

        array['doubleLogin']="您已被强制登出。请重新登入。\n";
        array['doubleLogin']+="您可能因以下其一原因被登出：\n";
        array['doubleLogin']+="1.系统登出。\n";
        array['doubleLogin']+="2.您的帐户在多个地方登录。\n";
        array['doubleLogin']+="请重新登入。如有任何疑问，请联系上线或客服中心。";

        array["MT_Statistics"] = "统计";
        array["MT_Commentary"] = "时间线";
        array["MT_LineUps"] = "阵容";
        array["MT_HeadToHead"] = "一对一";
        array["MT_LeagueTable"] = "排名";
        array["MT_Ranking"] = "排名";
        array["MT_PointByPoint"] = "逐点";
        array["MT_probabilities"] = "概率";
        array["MT_boxscore"] = "记分卡";

        array["relating_title"] = "相关信息";
        array["timeZone_wagers"] = "交易时间显示时区为GMT-4。";
        array["timeZone_message"] = "显示的时区为GMT-4。";
        array["timeZone_game"] = "今日赛事显示时区为GMT-4。";
        array["relating_content"] = "此实况转播内容仅供参考，本公司会尽量确保转播内容正确，但不对此转播内容之正确性负责。所有依据分数的赌盘，像是让分盘，波胆等等的判定皆以下注的那一刻在下注单里显示的资讯为主。";

        array["mid_title"] = "賽事资讯";
        array["mid_content"] = "中立场地";

        array["fantasy_title"] = "夢幻賽";
        array["fantasy_content"] = "在这些赛事中，来自两场不同比赛的两支队伍被组合在一起，以预测假象中的结果。";

        array["event_not_start"] = "开赛时视频才能播放。";
        array["event_TV_error"] = "直播目前不能播放。<br>请换去别的赛事看直播。";

        array["determine"] = "确定";

        array["league_limit"] = "最多只能选择八场赛事。"; 

        array["order_limit"] = "最多10个选项。"; 

        array["addMyGame_success"] = "已加入我的赛事。";
        array["addMyGame_block"] = "一个体育最多可加至25场。";
        array["myGame_close"] = "抱歉，此功能暂时关闭。请稍后再尝试。";
        array["myGame_backToHome"] = "抱歉，由于之前的页面暂时关闭，你已被带到主页。请稍后再尝试。";

        array["BG_DRM_Y"] = "此视频需要DRM解析，但目前我们不支援需要DRM解析的视频。";
        array["BG_DRM_N"] = "no event";

        array["oddf_H"] = "香港盘";
		array["oddf_M"] = "马来盘";
		array["oddf_I"] = "印尼盘";
        array["oddf_E"] = "欧洲盘";
        
        array["today_wager_A"] = "确认";
        array["ticket_id_str"] = "注单号: ";

        array["delay_001"] = "官方赛果确认中";
        array["delay_002"] = "赛果核实中";
        array["delay_003"] = "赛事中断";
        array["delay_004"] = "赛事改期延续";
        array["delay_005"] = "运营需求";
        array["delay_006"] = "技术问题";

        array["analysisBlock"] = "请把您的设备转为直立以便使用统计。";
        return array;
    }

    _self.get=function(_key){
        return array[_key]? array[_key] : _key;
    }

}
var widget3_ary = new Array("FT");
var widget2;
var loading_ary = new Array("FT","DA");
var sport_id = "";
var echo = function(){};
const tabDataWaitMiliseconds = 1000;
function init(){
    echo("[===getDataMT.js===]");
    window.addEventListener("message", receiveMessageFromWindow, false);
}

function receiveMessageFromWindow ( event ) {
    var cmds=event.data.split("|");
    echo(cmds[1],"監聽成功");
    if (cmds[0]=="001"){
        sendParent('003|loaded');
    }else if(cmds[0]=='123'){
        closePopMsg(cmds[2]);
    }else if(cmds[0]=='456'){
        loadMT(cmds[1],cmds[2],cmds[3]);
    }else if(cmds[0]=='789'){
        chgDirection(cmds[1]);
    }
}
function chgDirection(code){
    if(code == 'addClass')document.getElementById("main_div").classList.add("mt_lan");
    else document.getElementById("main_div").classList.remove("mt_lan");
}

function loadMT(data,ts,showRight){
    var mtData = JSON.parse(data);
    MODE = mtData.Mode;
    if(mtData.NeedsHeader=="Y") document.getElementById("title_div").style.display = "none";
    if(mtData.Mode.indexOf("close")!=-1){
        closeMatch();
        return;
    }else if(mtData.Mode.indexOf("lmt")!=-1){
        document.getElementById("title_div").style.display = "none";
        if(mtData.Status=="open"){
            document.getElementById("loading").className = "timeline_loading";
        }else{
            document.getElementById("loading").className = "mt_loading";
        }
        if(in_array(mtData.Gtype,loading_ary)) document.getElementById("loading").classList.add(mtData.Gtype+"_loading");
    }else{
        document.getElementById("main_div").className = "pop_div";
        document.getElementById("loading").className = "mt_pop_loading";
        setModeTitle(mtData);
    }
    var Langx = chooseLangx(langx);
    document.getElementById("loading").style.display = "";

    if(in_array(mtData.Gtype,widget3_ary)){
        (function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,
        g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),g.onerror=errFunc,h.parentNode.insertBefore(g,h)
        )})(window,document,"script", "https://ws-cdn001.akamaized.net/"+mtData.KeyID+"/widgetloader", "SIR", {
            language: Langx
        });
        document.getElementById("main_div").classList.add("mt_FT");
        if(mtData.Mode.indexOf("lmt")==-1){
            if(showRight=="true")document.getElementById("main_div").classList.add("right_MT");
            else document.getElementById("main_div").classList.remove("right_MT");
        }
        if(mtData.Mode!="") openMatch_3(mtData,ts);
    }else{
        if(mtData.Lmt3){
            sport_id = mtData.SpID;
            (function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,
            g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h)
            )})(window,document,"script", "https://ws-cdn001.akamaized.net/"+mtData.KeyID+"/widgetloader", "SIR", {
                theme: true,
                language: Langx
            });
            if(mtData.Mode!="")openMatch_3_plus(mtData,ts);
        }
        else{
            var scriptObj = document.createElement("script");
            scriptObj.type = "text/javascript";
            var domain = (checkCasino())?"csdev.betradar.com":"cs.betradar.com";
            scriptObj.onerror = errFunc;
            scriptObj.src = "https://"+domain+"/ls/widgets/?/aspen/"+Langx+"/"+mtData.TimeZone+"/widgetloader/widgets";   
            (document.getElementsByTagName("head")[0] || document.body).appendChild(scriptObj);
            if(mtData.Mode!="") openMatch_2(mtData,ts);
        }
        
    }
}

function closePopMsg(gtype){
    if(in_array(gtype,widget3_ary)){
        var obj = document.getElementsByClassName("sr-momentum__tooltip")[0];
        var objDot = document.getElementsByClassName("sr-momentum__eventgroup-active srt-base-1-background")[0];
        if(obj!=null) obj.style.display = "none";
        if(objDot!=null) objDot.style.display = "none";
    }else{
        var obj = document.getElementsByClassName("sr-tooltip")[0];
        if(obj!=null) obj.style.display = "none";
    }
}

function sendParent(data){
    parent.postMessage(data,'*');
}

function setTryScroll(data){
    try{
            if(data.Mode == "standings" || data.Mode == "pointByPoint" || data.Mode == "boxScore")return; 
            var setScrollElement = new Array("match.commentary","timeline");
            var mainObj = document.getElementById("main_div");
            var obj = (in_array(data.Mode,setScrollElement))?document.getElementsByClassName("sr-scrollbars__container")[0].children[0]:mainObj;
            setScrollObject(obj);
            mainObj.addEventListener("touchstart",tryscroll);
            mainObj.addEventListener("touchmove",tryscroll);
    }catch(e){
            console.log(e);	
    }
}

function setModeTitle(data){
    var title = document.getElementById("mt_pop_title");
    LS = new_eval("new LS_"+data.Lang+"();");
    LS.init();
    switch(true){
        case data.Mode.indexOf("statistics")!=-1:
        case data.Mode.indexOf("matchstats")!=-1:
            title.innerHTML = LS.get("MT_Statistics");
            break;
        case data.Mode.indexOf("comment")!=-1:
            title.innerHTML = LS.get("MT_Commentary");
            break;
        case data.Mode.indexOf("lineups")!=-1:
            title.innerHTML = LS.get("MT_LineUps");
            break;
        case data.Mode.indexOf("headTohead")!=-1:
        case data.Mode.indexOf("head2head")!=-1:
            title.innerHTML = LS.get("MT_HeadToHead");
            break;
        case data.Mode.indexOf("liveTable")!=-1:
        case data.Mode.indexOf("livetable")!=-1:
            title.innerHTML = LS.get("MT_LeagueTable");
            break;
        case data.Mode.indexOf("ranking")!=-1:
            title.innerHTML = LS.get("MT_Ranking");
            break;
            
    }
}

function showLS(code){
            if(LS[code]+""=="undefined")  return code;
            return LS[code];
    }

function errFunc(){
    document.getElementById("loading").style.display = "none";
    document.getElementById("main_div").innerHTML = "Connect Failed ! ";
}

function chooseLangx(langx){
    var Langx = "";
    switch(langx){
        case "zh-tw":
        case "zh-cn":
            Langx = "zh";
            break;
        case "en-us":
            Langx = "en";
            break;
    }
    return Langx;
}

function openMatch_3(data,ts){
    SIR("addWidget", "#main_div", data.Mode,
    {
        matchId: data.GameID,
        disableSpottingLine: true,
        disableScoreboard: true,
        disableWidgetHeader: true,
        momentum: "bars",
        pitchCustomBgColor: '#047102', 
        disableMomentum: 'false', 
        disablePitchNoise: 'true', 
        goalBannerImage: 'data:image/png;base64,',
        disablePitchClock: true, 
        disableTabs: true,
        showOnlySelectedGroup: false,
        onTrack: Finish("main_div",data,ts)
    });   
}
function Finish(dom,data,ts){
    return function onTrack(type, doc) {
        if (type !== 'data_change') return;
        waitForData(`${dom} .sr-loader__container`, tabDataWaitMiliseconds).then(function(tabDataAvailable) {
            setTimeout(function(){
                var totalHeight = 0;
                document.getElementById("loading").style.display = "none";
                if(data.Mode.indexOf("lmt")==-1) {
                    totalHeight = document.getElementById("main_div").scrollHeight;
                    totalHeight +=10;
                    setTryScroll(data);
                }
                sendParent("002|"+checkLoading(data.Mode)+"|"+ts+"|"+totalHeight);
            },3000);
        });
    }
}
function openMatch_3_plus(data,ts){
    var tap_model = new Object();
    tap_model[sport_id] = [data.Mode];
    if(data.Mode == "match.lmtPlus"){
        SIR("addWidget", "#main_div", "match.lmtPlus", 
        {
            layout: "topdown", 
            matchId:data.GameID,
            scoreboard:'disable',
            onTrack: Finish("main_div",data,ts)
        });
    }else{
        SIR("addWidget", "#main_div", "match.lmtPlus",
        {
            layout: "topdown",
            scoreboard: "disable",
            detailedScoreboard: "disable",
            matchId: data.GameID,
            disablePitch: true,  
            momentum: "bars",    
            tabs:tap_model, 
            tabsPosition: 'disable', 
            onTrack: loadTab("main_div",data,ts)
        });
    }
}

function openMatch_2(data,ts){
    setTimeout(function(){
        widget2 = SRLive.addWidget({ 
            name: data.Mode,
            config:{
                matchId: data.GameID,
                container: '#main_div',
                showMomentum2:true,
                showScoreboard: false,
                showSidebar: false,
                collapse_enabled: false,
                showTitle: false,
                disableSpottingLine: true,
                showHeatmap: false,
            },
            callback: function(){
                document.getElementById("loading").style.display = "none";
                if(data.Mode.indexOf("lmt")==-1) setTryScroll(data);
                sendParent("002|"+checkLoading(data.Mode)+"|"+ts);
            }
        }); 
    },1500);
}

function checkLoading(name){
    var loading = "";
    if(name.indexOf("lmt")!=-1){
        loading = "mt_loading";
    }else{
        loading = "mt_pop_loading";
    }
    return loading;
}



function closeMatch(){
    document.getElementById("main_div").innerHTML = "";
}

function checkCasino(){
    var domain = document.domain;
    var casino = domain.split(".")[0];
    if(casino.indexOf("cro666")!=-1) return true;
    return false;
}

function in_array(txt, ary){
        for(var key in ary){
                if(ary[key]==txt)  return true;
        }
        return false;
}

function writeLog(msg){

    var _url = "/lib/write_log.php";
    var param = "";
    param+="user="+USERNAME;
    param+="&msg="+encodeURIComponent(msg);

    var hr = new HttpRequest();
    hr.addEventListener("LoadComplete",null);
    hr.loadURL(_url,"POST",param);
}
function loadTab(dom,data,ts){
    return function onTrack(type, doc) {
        if (type !== 'data_change') return;
        waitForData(`${dom} .sr-lmt-plus__comp-size`, tabDataWaitMiliseconds).then(function(tabDataAvailable) {
            if(!tabDataAvailable)sendParent("555|"+true+"|"+ts);
            setTimeout(function(){
                document.getElementById("loading").style.display = "none";
                if(data.Mode.indexOf("lmt")==-1) setTryScroll(data);
                sendParent("002|"+checkLoading(data.Mode)+"|"+ts);
            },3000);
        });
    }
}

function waitForData(selector, timeout) {
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
            var data = document.querySelector("#"+selector);

            if (!data) {
                resolve(false);
                echo("找不到放MT的物件");
                return;
            }

            if (data.children.length) {
                resolve(true);
                return;
            } else {  
                var delayedResolve = function(success) {
                    observer.disconnect();
                    clearTimeout(timeoutRef);

                    resolve(success);
                }

                var observer = new MutationObserver(function() {
                    delayedResolve(true);
                });

                var timeoutRef = setTimeout(function() {
                    delayedResolve(false);
                }, timeout);

                observer.observe(data, { childList: true });
            }
        },timeout);
    });
}

function new_eval(str) {
    var fn = Function;
    return new fn('return ' + str)();
}
<?
}elseif($_p["langx"]=="tw"){
?> 

var ts=[];
var scrollObj = null;
var echo = function(){};

function setScrollObject(obj){
		scrollObj = obj;
}

function tryscroll(e){
		
		Log("tryscroll: "+e);
		if(scrollObj==null) return;
		listionEvent(e, scrollObj);
}
function touchObject(targetObject,eventObject){
		return true;
}

function listionEvent(e,targetObject){
	Log(targetObject);
		var action="";
		var touch=e.targetTouches[0];
		if (e.type=="touchstart"){
				ts.x=touch.pageX;
				ts.y=touch.pageY;
		}

		if (!touchObject(targetObject,e.target)){
		 		stopScroll(e)
		}else{
				if (targetObject.scrollTop==0){
						if (ts.y-touch.pageY<0){
							 	if (e.type=="touchmove"){
										Log("[2]"+ts.y+"-"+touch.pageY+"<0");
									 	stopScroll(e)
				 	 			}
			 	 				
				 		}
			 	}
		 		if ((targetObject.scrollTop+targetObject.clientHeight)==targetObject.scrollHeight){
						if (ts.y-touch.pageY>0){
								if (e.type=="touchmove"){
										Log("[3]"+ts.y+"-"+touch.pageY+">0");
										stopScroll(e)
					 			}
				 		
						}
				}
			
		}
}
function FindEventTargetObject(e, cls){
		var TargetObj=null;
		for (var i=0;i<e.path.length;i++){
				TargetObj=e.path[i];
		
				if (e.path[i].clientHeight<e.path[i].scrollHeight && ((TargetObj.style.overflow!=""&&TargetObj.style.overflow!="hidden")||TargetObj.className.indexOf(cls)!=-1)){
						return TargetObj;
				}
		}
		return null;
}

function stopScroll(e){
	try{
		e.preventDefault();
		e.stopPropagation();
	}catch(err){
		Log(err);
	}
}

function Log(msg){

}
function HttpRequest(){
		var _self=this;
		var req;
		var eventHandler=new Array();
		var parentClass;
		var isAbort = false;
		var cancelAbort = false;
		var _url = "";
		var _method = "";
		var _params = "";
		var _pageName = "";
		_self.ts = "";

		_self.init=function(){
				_self.addEventListener("LoadComplete",_self.cmd_proc);
				_self.ts = _self.getTimestamp();

		}
		_self.help=function(){
				var str="";
				str+="EventName:LoadComplete Method:function(html)\n";
				str+="Method:loadURL(url,post/get,pamam)\n";
				return str;
		}
		
		_self.setParentclass=function(parentclass){
				parentClass=parentclass;
		}
		
		_self.getThis=function(varible){
				return eval(varible);
		}
	
		
		
		_self.loadURL=function(url,method,params) {
				req = false;
				_url = url;
				_method = method;
				_params = params;

		    if(window.XMLHttpRequest && !(window.ActiveXObject)) {
			    	try{
								req = new XMLHttpRequest();
			      }catch(e){
								req = false;
			      }
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
						
						_time = new Date();
						var new_par = _self.replaceFromParam(_params);
						
						var isBet = (_pageName.indexOf("bet")!=-1 && _pageName.indexOf("betradar")==-1);
						var isHistory = (_pageName.indexOf("get_history")!=-1);
						if( !isBet && !isHistory) req.timeout = 10000;

						if(top["requestHash"][_method+"_"+new_par]){
							var tmpTS = top["requestHash"][_method+"_"+new_par].ts;
							if(tmpTS!=_self.ts){
								top["requestHash"][_method+"_"+new_par].cancelAbort();
								delete top["requestHash"][_method+"_"+new_par];
							}
						}
						top["requestHash"][_method+"_"+new_par] = _self;
						req.onreadystatechange = _self.processReqChange;
						if(method==undefined) method="POST";
						if(method.toUpperCase()=="POST"){
								req.open("POST", url+_self.getP(params), true);
					  			req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
								req.send(params);
				
						}else{
								req.open("GET", url+"?"+params, true);
								req.send("");
						}
						
				}
		}

		_self.abort=function(){
			try{
				isAbort = true;
				req.abort();
			}catch(e){
				console.error("[abortError] = ",e);
			}
		}

		_self.cancelAbort = function(){
			try{
				cancelAbort = true;
				req.abort();
			}catch(e){
				console.error("[cancelAbortError] = ",e);
			}
		}
		
		_self.processReqChange=function() {
			if(cancelAbort) return;
		    if(req.readyState == 4){
				var new_par = _self.replaceFromParam(_params);
		        if(req.status == 200){
					delete top["requestHash"][_method+"_"+new_par];
					delete top["requestFailedHash"][_method+"_"+new_par];
		          	_self.eventhandler("LoadComplete",req.responseText);
		        }else if(req.status==0){
					if(isAbort){
						_self.eventhandler("onAbort",req);
					}else{
						if(_pageName.indexOf("bet")==-1 || _pageName.indexOf("betradar")!=-1){
							top["requestFailedHash"][_method+"_"+new_par] = "Failed";
							setTimeout(_self.loadURL, 1000, _url, _method, _params);
						}else{
							_self.eventhandler("onError",req);
						}
					}
				}else{
					if(_pageName.indexOf("bet")==-1 || _pageName.indexOf("betradar")!=-1){
						top["requestFailedHash"][_method+"_"+new_par] = "Failed";
						setTimeout(_self.loadURL, 1000, _url, _method, _params);
					}else{
						_self.eventhandler("onError",req);
					}
		        }
		    }else if(req.readyState == 0 && req.status==0){
				if(isAbort){
					_self.eventhandler("onAbort",req);
				}else{
					if(_pageName.indexOf("bet")==-1 || _pageName.indexOf("betradar")!=-1){
						top["requestFailedHash"][_method+"_"+new_par] = "Failed";
						setTimeout(_self.loadURL, 1000, _url, _method, _params);
					}else{
						_self.eventhandler("onError",req);
					}
				}
			}
			isAbort = false;
		}
		
		_self.addEventListener=function(eventname,eventFunction){
				eventHandler[eventname]=eventFunction;
		}
		
		_self.removeEventListener=function(eventname){
				EventHandler[eventname]=undefined;
		}
		
		_self.eventhandler=function(eventname,param){
				if(eventHandler[eventname]!=undefined){
						eventHandler[eventname](param);
				}
		}
		
		_self.cmd_proc=function(html){
				alert(html);
		}
		_self.getP = function(params){
			var p = "?ver="+top.ver;
			if(typeof autoLogin=="function"){
				var par = params.split("&");
				for(var i=0; i<par.length; i++){
					var tmp = par[i].split("=");
					if(tmp[0]=="p"){
						p="?p="+tmp[1]+"&ver="+top.ver;
						break;
					}
				}
			}
			return p;
		}
		_self.replaceFromParam = function(_params){
			var replaceParam = _params;
			var par = _params.split("&");
			for(var i=0; i < par.length; i++){
				if(par[i].indexOf("ver=")!=-1 || par[i].indexOf("ts=")!=-1 || par[i].indexOf("timestamp=")!=-1){
					replaceParam = replaceParam.replace(par[i], "");
				}
				if(par[i].indexOf("p=")!=-1 && _pageName==""){
					_pageName = par[i].split("=")[1];
				}
			}
			return replaceParam;
		}

		_self.getTimestamp = function(){
			return new Date().getTime();
		}
		_self.init();
}
function LS_tw(){
    var _self = this;
    var parentClass;
    var array;

    _self.init=function(){
        array = _self.set();
    }

    _self.set=function(){
        var array = new Object();
        array["RMB"]="人民幣";
        array["HKD"]="港幣";
        array["USD"]="美金";
        array["MYR"]="馬幣";
        array["SGD"]="新幣";
        array["THB"]="泰銖";
        array["GBP"]="英鎊";
        array["JPY"]="日幣";
        array["EUR"]="歐元";
        array["IDR"]="印尼盾";
        array["NTD"]="台幣";
        array["GOD"]="金幣";
        array["BG"]="B金";

        array["gold_k"] = "千";
        array["gold_10k"] = "萬";
        array["gold_100m"] = "億";
                
        array["loading_txt"] = "加載中";
        array["showtype_live"] = "滾球";
        array["showtype_today"] = "今日";
        array["showtype_early"] = "早盤";
        array["showtype_hot"] = "熱門賽事";
        array["showtype_soon"] = "即將開賽";
        array["showtype_outrights"] = "冠軍";
        array["showtype_parlay"] = "綜合過關";
        array["showtype_fs"] = "冠軍盤口";
        array["showtype_mygame"] = "我的賽事";

        array["live"] = "滾球賽事";
        array["today"] = "今日賽事";
        array["early"] = "早餐賽事";
        array["outrights"] = "冠軍盤口";
        array["fs"] = "冠軍盤口";
        array["soon"] = "賽事即將開始";
        array["hot"] = "熱門賽事";

        array["str_coupon_rb"] = "滾球賽事";
        array["str_coupon_today"] = "今日賽事";
        array["str_coupon_future"] = "未來賽事";
        array["str_coupon_date"] = "所有賽事";
        
        array["gtype_all"] = "所有體育";
        array["gtype_bk"] = "籃球 & 美式足球";
        array["gtype_es"] = "電子競技";
        array["gtype_bm"] = "羽毛球";
        array["gtype_bs"] = "棒球";
        array["gtype_ft"] = "足球";
        array["gtype_op"] = "其他";
        array["gtype_sk"] = "斯諾克/台球";
        array["gtype_tn"] = "網球";
        array["gtype_tt"] = "乒乓球";
        array["gtype_vb"] = "排球";

        array["allGame"] = "所有賽事";
        array["hotGame"] = "熱門";

        array["Mon"] = "星期一";
        array["Tue"] = "星期二";
        array["Wed"] = "星期三";
        array["Thu"] = "星期四";
        array["Fri"] = "星期五";
        array["Sat"] = "星期六";
        array["Sun"] = "星期日";

        array["mon_01"] = "一月";
        array["mon_02"] = "二月";
        array["mon_03"] = "三月";
        array["mon_04"] = "四月";
        array["mon_05"] = "五月";
        array["mon_06"] = "六月";
        array["mon_07"] = "七月";
        array["mon_08"] = "八月";
        array["mon_09"] = "九月";
        array["mon_10"] = "十月";
        array["mon_11"] = "十一月";
        array["mon_12"] = "十二月";

        array["mycoupon"] = "我的參賽表";

        array["bet_txt"] = "下注";
        array["betslip_txt"] = "注單";
        array["accept_change_txt"] = "接受變化";
        array["lastBetOption_fast"] = "保留選項";
        array["lastBetOption_total"] = "保留選項";
        array["parlay_txt"] = "綜合過關";
        array["single_txt"] = "單注";

        array["datetime_today"] = "今日";

        array["4pwd_new"] = "你要設置一個簡易密碼以便快速登入嗎?";
        array["4pwd_second"] = "您現在的裝置 / 瀏覽器尚未設定簡易密碼登入，為了讓您更快速方便的登入，是否要現在設定呢？"+"<br>"+"<br>"+"注意：使用其他帳戶登錄將暫時禁用此設備/瀏覽器上的簡易密碼登入。";
        array["4pwd_chkdel"] = "此動作將在您的所有設備上停用您的簡易密碼登錄。"+"<br>"+"<br>"+"你確定嗎？";
        array["4pwd_del"] = "您已成功取消簡易登入功能。";
        array["4pwd_set"] = "設定您的簡易密碼以便快速登入。";
        array["4pwd_chkAgain"] = "重新輸入你的簡易密碼來登入或是";

        array["connect_retry"] = "網路不穩定，請重新更新。";
        array["connect_fail"] = "網路極度不穩定，請檢查你的網路。";
        array["connect_again"] = "重新嘗試連線";
        array["connect_ok"] = "確認";
        
        array["pls_chg_pwd"] = "請修改您的新帳號密碼以確保安全。";

        array['doubleLogin']="您已被強制登出。請重新登入。\n";
        array['doubleLogin']+="您可能因以下其一原因被登出：\n";
        array['doubleLogin']+="1.系統登出。\n";
        array['doubleLogin']+="2.您的帳戶在多個地方登錄。\n";
        array['doubleLogin']+="請重新登入。如有任何疑問，請聯繫上線或客服中心。";

        array["MT_Statistics"] = "統計";
        array["MT_Commentary"] = "時間線";
        array["MT_LineUps"] = "陣容";
        array["MT_HeadToHead"] = "一對一";
        array["MT_LeagueTable"] = "排名";
        array["MT_Ranking"] = "排名";
        array["MT_PointByPoint"] = "逐點";
        array["MT_probabilities"] = "概率";
        array["MT_boxscore"] = "記分卡";

        array["relating_title"] = "相關信息";
        array["timeZone_wagers"] = "交易時間顯示時區為GMT-4。";
        array["timeZone_message"] = "顯示的時區為GMT-4。";
        array["timeZone_game"] = "今日賽事顯示時區為GMT-4。";
        array["relating_content"] = "此實況轉播內容僅供參考，本公司會盡量確保轉播內容正確，但不對此轉播內容之正確性負責。所有依據分數的賭盤，像是讓分盤，波膽等等的判定皆以下注的那一刻在下注單裡顯示的資訊為主。";
        
        array["mid_title"] = "賽事資訊";
        array["mid_content"] = "中立場地";

        array["fantasy_title"] = "夢幻賽";
        array["fantasy_content"] = "在這些賽事中，來自兩場不同比賽的兩支隊伍被組合在一起，以預測假象中的結果。";

        array["event_not_start"] = "開賽時視頻才能播放。";
        array["event_TV_error"] = "直播目前不能播放。<br>請換去别的賽事看直播。";

        array["determine"] = "確定";

        array["league_limit"] = "最多只能選擇八場賽事。"; 

        array["order_limit"] = "最多10個選項。"; 

        array["addMyGame_success"] = "已加入我的賽事。";
        array["addMyGame_block"] = "一個體育最多可加至25場。";
        array["myGame_close"] = "抱歉，此功能暫時關閉。請稍後再嘗試。";
        array["myGame_backToHome"] = "抱歉，由於之前的頁面暫時關閉，你已被带到主頁。請稍後再嘗試。";

        array["BG_DRM_Y"] = "此視頻需要DRM解析，但目前我們不支援需要DRM解析的視頻。";
        array["BG_DRM_N"] = "no event";

        array["oddf_H"] = "香港盤";
		array["oddf_M"] = "馬來盤";
		array["oddf_I"] = "印尼盤";
        array["oddf_E"] = "歐洲盤";
        
        array["today_wager_A"] = "確認";
        array["ticket_id_str"] = "注單號: ";

        array["delay_001"] = "官方賽果確認中";
        array["delay_002"] = "賽果核實中";
        array["delay_003"] = "賽事中斷";
        array["delay_004"] = "賽事改期延續";
        array["delay_005"] = "運營需求";
        array["delay_006"] = "技術問題";

        array["analysisBlock"] = "請把您的設備轉為直立以便使用統計。";
        return array;
    }

    _self.get=function(_key){
        return array[_key]? array[_key] : _key;
    }

}
var widget3_ary = new Array("FT");
var widget2;
var loading_ary = new Array("FT","DA");
var sport_id = "";
var echo = function(){};
const tabDataWaitMiliseconds = 1000;
function init(){
    echo("[===getDataMT.js===]");
    window.addEventListener("message", receiveMessageFromWindow, false);
}

function receiveMessageFromWindow ( event ) {
    var cmds=event.data.split("|");
    echo(cmds[1],"監聽成功");
    if (cmds[0]=="001"){
        sendParent('003|loaded');
    }else if(cmds[0]=='123'){
        closePopMsg(cmds[2]);
    }else if(cmds[0]=='456'){
        loadMT(cmds[1],cmds[2],cmds[3]);
    }else if(cmds[0]=='789'){
        chgDirection(cmds[1]);
    }
}
function chgDirection(code){
    if(code == 'addClass')document.getElementById("main_div").classList.add("mt_lan");
    else document.getElementById("main_div").classList.remove("mt_lan");
}

function loadMT(data,ts,showRight){
    var mtData = JSON.parse(data);
    MODE = mtData.Mode;
    if(mtData.NeedsHeader=="Y") document.getElementById("title_div").style.display = "none";
    if(mtData.Mode.indexOf("close")!=-1){
        closeMatch();
        return;
    }else if(mtData.Mode.indexOf("lmt")!=-1){
        document.getElementById("title_div").style.display = "none";
        if(mtData.Status=="open"){
            document.getElementById("loading").className = "timeline_loading";
        }else{
            document.getElementById("loading").className = "mt_loading";
        }
        if(in_array(mtData.Gtype,loading_ary)) document.getElementById("loading").classList.add(mtData.Gtype+"_loading");
    }else{
        document.getElementById("main_div").className = "pop_div";
        document.getElementById("loading").className = "mt_pop_loading";
        setModeTitle(mtData);
    }
    var Langx = chooseLangx(langx);
    document.getElementById("loading").style.display = "";

    if(in_array(mtData.Gtype,widget3_ary)){
        (function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,
        g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),g.onerror=errFunc,h.parentNode.insertBefore(g,h)
        )})(window,document,"script", "https://ws-cdn001.akamaized.net/"+mtData.KeyID+"/widgetloader", "SIR", {
            language: Langx
        });
        document.getElementById("main_div").classList.add("mt_FT");
        if(mtData.Mode.indexOf("lmt")==-1){
            if(showRight=="true")document.getElementById("main_div").classList.add("right_MT");
            else document.getElementById("main_div").classList.remove("right_MT");
        }
        if(mtData.Mode!="") openMatch_3(mtData,ts);
    }else{
        if(mtData.Lmt3){
            sport_id = mtData.SpID;
            (function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,
            g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h)
            )})(window,document,"script", "https://ws-cdn001.akamaized.net/"+mtData.KeyID+"/widgetloader", "SIR", {
                theme: true,
                language: Langx
            });
            if(mtData.Mode!="")openMatch_3_plus(mtData,ts);
        }
        else{
            var scriptObj = document.createElement("script");
            scriptObj.type = "text/javascript";
            var domain = (checkCasino())?"csdev.betradar.com":"cs.betradar.com";
            scriptObj.onerror = errFunc;
            scriptObj.src = "https://"+domain+"/ls/widgets/?/aspen/"+Langx+"/"+mtData.TimeZone+"/widgetloader/widgets";   
            (document.getElementsByTagName("head")[0] || document.body).appendChild(scriptObj);
            if(mtData.Mode!="") openMatch_2(mtData,ts);
        }
        
    }
}

function closePopMsg(gtype){
    if(in_array(gtype,widget3_ary)){
        var obj = document.getElementsByClassName("sr-momentum__tooltip")[0];
        var objDot = document.getElementsByClassName("sr-momentum__eventgroup-active srt-base-1-background")[0];
        if(obj!=null) obj.style.display = "none";
        if(objDot!=null) objDot.style.display = "none";
    }else{
        var obj = document.getElementsByClassName("sr-tooltip")[0];
        if(obj!=null) obj.style.display = "none";
    }
}

function sendParent(data){
    parent.postMessage(data,'*');
}

function setTryScroll(data){
    try{
            if(data.Mode == "standings" || data.Mode == "pointByPoint" || data.Mode == "boxScore")return; 
            var setScrollElement = new Array("match.commentary","timeline");
            var mainObj = document.getElementById("main_div");
            var obj = (in_array(data.Mode,setScrollElement))?document.getElementsByClassName("sr-scrollbars__container")[0].children[0]:mainObj;
            setScrollObject(obj);
            mainObj.addEventListener("touchstart",tryscroll);
            mainObj.addEventListener("touchmove",tryscroll);
    }catch(e){
            console.log(e);	
    }
}

function setModeTitle(data){
    var title = document.getElementById("mt_pop_title");
    LS = new_eval("new LS_"+data.Lang+"();");
    LS.init();
    switch(true){
        case data.Mode.indexOf("statistics")!=-1:
        case data.Mode.indexOf("matchstats")!=-1:
            title.innerHTML = LS.get("MT_Statistics");
            break;
        case data.Mode.indexOf("comment")!=-1:
            title.innerHTML = LS.get("MT_Commentary");
            break;
        case data.Mode.indexOf("lineups")!=-1:
            title.innerHTML = LS.get("MT_LineUps");
            break;
        case data.Mode.indexOf("headTohead")!=-1:
        case data.Mode.indexOf("head2head")!=-1:
            title.innerHTML = LS.get("MT_HeadToHead");
            break;
        case data.Mode.indexOf("liveTable")!=-1:
        case data.Mode.indexOf("livetable")!=-1:
            title.innerHTML = LS.get("MT_LeagueTable");
            break;
        case data.Mode.indexOf("ranking")!=-1:
            title.innerHTML = LS.get("MT_Ranking");
            break;
            
    }
}

function showLS(code){
            if(LS[code]+""=="undefined")  return code;
            return LS[code];
    }

function errFunc(){
    document.getElementById("loading").style.display = "none";
    document.getElementById("main_div").innerHTML = "Connect Failed ! ";
}

function chooseLangx(langx){
    var Langx = "";
    switch(langx){
        case "zh-tw":
        case "zh-cn":
            Langx = "zh";
            break;
        case "en-us":
            Langx = "en";
            break;
    }
    return Langx;
}

function openMatch_3(data,ts){
    SIR("addWidget", "#main_div", data.Mode,
    {
        matchId: data.GameID,
        disableSpottingLine: true,
        disableScoreboard: true,
        disableWidgetHeader: true,
        momentum: "bars",
        pitchCustomBgColor: '#047102', 
        disableMomentum: 'false', 
        disablePitchNoise: 'true', 
        goalBannerImage: 'data:image/png;base64,',
        disablePitchClock: true, 
        disableTabs: true,
        showOnlySelectedGroup: false,
        onTrack: Finish("main_div",data,ts)
    });   
}
function Finish(dom,data,ts){
    return function onTrack(type, doc) {
        if (type !== 'data_change') return;
        waitForData(`${dom} .sr-loader__container`, tabDataWaitMiliseconds).then(function(tabDataAvailable) {
            setTimeout(function(){
                var totalHeight = 0;
                document.getElementById("loading").style.display = "none";
                if(data.Mode.indexOf("lmt")==-1) {
                    totalHeight = document.getElementById("main_div").scrollHeight;
                    totalHeight +=10;
                    setTryScroll(data);
                }
                sendParent("002|"+checkLoading(data.Mode)+"|"+ts+"|"+totalHeight);
            },3000);
        });
    }
}
function openMatch_3_plus(data,ts){
    var tap_model = new Object();
    tap_model[sport_id] = [data.Mode];
    if(data.Mode == "match.lmtPlus"){
        SIR("addWidget", "#main_div", "match.lmtPlus", 
        {
            layout: "topdown", 
            matchId:data.GameID,
            scoreboard:'disable',
            onTrack: Finish("main_div",data,ts)
        });
    }else{
        SIR("addWidget", "#main_div", "match.lmtPlus",
        {
            layout: "topdown",
            scoreboard: "disable",
            detailedScoreboard: "disable",
            matchId: data.GameID,
            disablePitch: true,  
            momentum: "bars",    
            tabs:tap_model, 
            tabsPosition: 'disable', 
            onTrack: loadTab("main_div",data,ts)
        });
    }
}

function openMatch_2(data,ts){
    setTimeout(function(){
        widget2 = SRLive.addWidget({ 
            name: data.Mode,
            config:{
                matchId: data.GameID,
                container: '#main_div',
                showMomentum2:true,
                showScoreboard: false,
                showSidebar: false,
                collapse_enabled: false,
                showTitle: false,
                disableSpottingLine: true,
                showHeatmap: false,
            },
            callback: function(){
                document.getElementById("loading").style.display = "none";
                if(data.Mode.indexOf("lmt")==-1) setTryScroll(data);
                sendParent("002|"+checkLoading(data.Mode)+"|"+ts);
            }
        }); 
    },1500);
}

function checkLoading(name){
    var loading = "";
    if(name.indexOf("lmt")!=-1){
        loading = "mt_loading";
    }else{
        loading = "mt_pop_loading";
    }
    return loading;
}



function closeMatch(){
    document.getElementById("main_div").innerHTML = "";
}

function checkCasino(){
    var domain = document.domain;
    var casino = domain.split(".")[0];
    if(casino.indexOf("cro666")!=-1) return true;
    return false;
}

function in_array(txt, ary){
        for(var key in ary){
                if(ary[key]==txt)  return true;
        }
        return false;
}

function writeLog(msg){

    var _url = "/lib/write_log.php";
    var param = "";
    param+="user="+USERNAME;
    param+="&msg="+encodeURIComponent(msg);

    var hr = new HttpRequest();
    hr.addEventListener("LoadComplete",null);
    hr.loadURL(_url,"POST",param);
}
function loadTab(dom,data,ts){
    return function onTrack(type, doc) {
        if (type !== 'data_change') return;
        waitForData(`${dom} .sr-lmt-plus__comp-size`, tabDataWaitMiliseconds).then(function(tabDataAvailable) {
            if(!tabDataAvailable)sendParent("555|"+true+"|"+ts);
            setTimeout(function(){
                document.getElementById("loading").style.display = "none";
                if(data.Mode.indexOf("lmt")==-1) setTryScroll(data);
                sendParent("002|"+checkLoading(data.Mode)+"|"+ts);
            },3000);
        });
    }
}

function waitForData(selector, timeout) {
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
            var data = document.querySelector("#"+selector);

            if (!data) {
                resolve(false);
                echo("找不到放MT的物件");
                return;
            }

            if (data.children.length) {
                resolve(true);
                return;
            } else {  
                var delayedResolve = function(success) {
                    observer.disconnect();
                    clearTimeout(timeoutRef);

                    resolve(success);
                }

                var observer = new MutationObserver(function() {
                    delayedResolve(true);
                });

                var timeoutRef = setTimeout(function() {
                    delayedResolve(false);
                }, timeout);

                observer.observe(data, { childList: true });
            }
        },timeout);
    });
}

function new_eval(str) {
    var fn = Function;
    return new fn('return ' + str)();
}
<?
}else{ 
?>

var ts=[];
var scrollObj = null;
var echo = function(){};

function setScrollObject(obj){
		scrollObj = obj;
}

function tryscroll(e){
		
		Log("tryscroll: "+e);
		if(scrollObj==null) return;
		listionEvent(e, scrollObj);
}
function touchObject(targetObject,eventObject){
		return true;
}

function listionEvent(e,targetObject){
	Log(targetObject);
		var action="";
		var touch=e.targetTouches[0];
		if (e.type=="touchstart"){
				ts.x=touch.pageX;
				ts.y=touch.pageY;
		}

		if (!touchObject(targetObject,e.target)){
		 		stopScroll(e)
		}else{
				if (targetObject.scrollTop==0){
						if (ts.y-touch.pageY<0){
							 	if (e.type=="touchmove"){
										Log("[2]"+ts.y+"-"+touch.pageY+"<0");
									 	stopScroll(e)
				 	 			}
			 	 				
				 		}
			 	}
		 		if ((targetObject.scrollTop+targetObject.clientHeight)==targetObject.scrollHeight){
						if (ts.y-touch.pageY>0){
								if (e.type=="touchmove"){
										Log("[3]"+ts.y+"-"+touch.pageY+">0");
										stopScroll(e)
					 			}
				 		
						}
				}
			
		}
}
function FindEventTargetObject(e, cls){
		var TargetObj=null;
		for (var i=0;i<e.path.length;i++){
				TargetObj=e.path[i];
		
				if (e.path[i].clientHeight<e.path[i].scrollHeight && ((TargetObj.style.overflow!=""&&TargetObj.style.overflow!="hidden")||TargetObj.className.indexOf(cls)!=-1)){
						return TargetObj;
				}
		}
		return null;
}

function stopScroll(e){
	try{
		e.preventDefault();
		e.stopPropagation();
	}catch(err){
		Log(err);
	}
}

function Log(msg){

}
function HttpRequest(){
		var _self=this;
		var req;
		var eventHandler=new Array();
		var parentClass;
		var isAbort = false;
		var cancelAbort = false;
		var _url = "";
		var _method = "";
		var _params = "";
		var _pageName = "";
		_self.ts = "";

		_self.init=function(){
				_self.addEventListener("LoadComplete",_self.cmd_proc);
				_self.ts = _self.getTimestamp();

		}
		_self.help=function(){
				var str="";
				str+="EventName:LoadComplete Method:function(html)\n";
				str+="Method:loadURL(url,post/get,pamam)\n";
				return str;
		}
		
		_self.setParentclass=function(parentclass){
				parentClass=parentclass;
		}
		
		_self.getThis=function(varible){
				return eval(varible);
		}
	
		
		
		_self.loadURL=function(url,method,params) {
				req = false;
				_url = url;
				_method = method;
				_params = params;

		    if(window.XMLHttpRequest && !(window.ActiveXObject)) {
			    	try{
								req = new XMLHttpRequest();
			      }catch(e){
								req = false;
			      }
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
						
						_time = new Date();
						var new_par = _self.replaceFromParam(_params);
						
						var isBet = (_pageName.indexOf("bet")!=-1 && _pageName.indexOf("betradar")==-1);
						var isHistory = (_pageName.indexOf("get_history")!=-1);
						if( !isBet && !isHistory) req.timeout = 10000;

						if(top["requestHash"][_method+"_"+new_par]){
							var tmpTS = top["requestHash"][_method+"_"+new_par].ts;
							if(tmpTS!=_self.ts){
								top["requestHash"][_method+"_"+new_par].cancelAbort();
								delete top["requestHash"][_method+"_"+new_par];
							}
						}
						top["requestHash"][_method+"_"+new_par] = _self;
						req.onreadystatechange = _self.processReqChange;
						if(method==undefined) method="POST";
						if(method.toUpperCase()=="POST"){
								req.open("POST", url+_self.getP(params), true);
					  			req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
								req.send(params);
				
						}else{
								req.open("GET", url+"?"+params, true);
								req.send("");
						}
						
				}
		}

		_self.abort=function(){
			try{
				isAbort = true;
				req.abort();
			}catch(e){
				console.error("[abortError] = ",e);
			}
		}

		_self.cancelAbort = function(){
			try{
				cancelAbort = true;
				req.abort();
			}catch(e){
				console.error("[cancelAbortError] = ",e);
			}
		}
		
		_self.processReqChange=function() {
			if(cancelAbort) return;
		    if(req.readyState == 4){
				var new_par = _self.replaceFromParam(_params);
		        if(req.status == 200){
					delete top["requestHash"][_method+"_"+new_par];
					delete top["requestFailedHash"][_method+"_"+new_par];
		          	_self.eventhandler("LoadComplete",req.responseText);
		        }else if(req.status==0){
					if(isAbort){
						_self.eventhandler("onAbort",req);
					}else{
						if(_pageName.indexOf("bet")==-1 || _pageName.indexOf("betradar")!=-1){
							top["requestFailedHash"][_method+"_"+new_par] = "Failed";
							setTimeout(_self.loadURL, 1000, _url, _method, _params);
						}else{
							_self.eventhandler("onError",req);
						}
					}
				}else{
					if(_pageName.indexOf("bet")==-1 || _pageName.indexOf("betradar")!=-1){
						top["requestFailedHash"][_method+"_"+new_par] = "Failed";
						setTimeout(_self.loadURL, 1000, _url, _method, _params);
					}else{
						_self.eventhandler("onError",req);
					}
		        }
		    }else if(req.readyState == 0 && req.status==0){
				if(isAbort){
					_self.eventhandler("onAbort",req);
				}else{
					if(_pageName.indexOf("bet")==-1 || _pageName.indexOf("betradar")!=-1){
						top["requestFailedHash"][_method+"_"+new_par] = "Failed";
						setTimeout(_self.loadURL, 1000, _url, _method, _params);
					}else{
						_self.eventhandler("onError",req);
					}
				}
			}
			isAbort = false;
		}
		
		_self.addEventListener=function(eventname,eventFunction){
				eventHandler[eventname]=eventFunction;
		}
		
		_self.removeEventListener=function(eventname){
				EventHandler[eventname]=undefined;
		}
		
		_self.eventhandler=function(eventname,param){
				if(eventHandler[eventname]!=undefined){
						eventHandler[eventname](param);
				}
		}
		
		_self.cmd_proc=function(html){
				alert(html);
		}
		_self.getP = function(params){
			var p = "?ver="+top.ver;
			if(typeof autoLogin=="function"){
				var par = params.split("&");
				for(var i=0; i<par.length; i++){
					var tmp = par[i].split("=");
					if(tmp[0]=="p"){
						p="?p="+tmp[1]+"&ver="+top.ver;
						break;
					}
				}
			}
			return p;
		}
		_self.replaceFromParam = function(_params){
			var replaceParam = _params;
			var par = _params.split("&");
			for(var i=0; i < par.length; i++){
				if(par[i].indexOf("ver=")!=-1 || par[i].indexOf("ts=")!=-1 || par[i].indexOf("timestamp=")!=-1){
					replaceParam = replaceParam.replace(par[i], "");
				}
				if(par[i].indexOf("p=")!=-1 && _pageName==""){
					_pageName = par[i].split("=")[1];
				}
			}
			return replaceParam;
		}

		_self.getTimestamp = function(){
			return new Date().getTime();
		}
		_self.init();
}
function LS_us(){
    var _self = this;
    var parentClass;
    var array;

    _self.init=function(){
        array = _self.set();
    }

    _self.set=function(){
        var array = new Object();
        array["RMB"]="RMB";
        array["HKD"]="HKD";
        array["USD"]="USD";
        array["MYR"]="MYR";
        array["SGD"]="SGD";
        array["THB"]="THB";
        array["GBP"]="GBP";
        array["JPY"]="JPY";
        array["EUR"]="EUR";
        array["IDR"]="IDR";
        array["NTD"]="NTD";
        array["GOD"]="GOD";
        array["BG"]="BG";

        array["gold_k"] = "k";
        array["gold_m"] = "m";
        array["gold_b"] = "b";
                
        array["loading_txt"] = "loading";
        array["showtype_live"] = "In-Play";
        array["showtype_today"] = "Today";
        array["showtype_early"] = "Early";
        array["showtype_hot"] = "Hot Games";
        array["showtype_soon"] = "Soon";
        array["showtype_outrights"] = "Outrights";
        array["showtype_parlay"] = "Parlay";
        array["showtype_fs"] = "Outright Markets";
        array["showtype_mygame"] = "My Events";

        array["live"] = "IN-PLAY MATCHES";
        array["today"] = "TODAY'S MATCHES";
        array["early"] = "EARLY MATCHES";
        array["outrights"] = "OUTRIGHT MARKETS";
        array["fs"] = "OUTRIGHT MARKETS";
        array["soon"] = "MATCHES STARTING SOON";
        array["hot"] = "HOT GAMES";

        array["str_coupon_rb"] = "IN-PLAY MATCHES";
        array["str_coupon_today"] = "TODAY'S MATCHES";
        array["str_coupon_future"] = "FUTURE MATCHES";
        array["str_coupon_date"] = "ALL MATCHES";

        array["gtype_all"] = "All Sports";
        array["gtype_bk"] = "Basketball & American Football";
        array["gtype_es"] = "eSports";
        array["gtype_bm"] = "Badminton";
        array["gtype_bs"] = "Baseball";
        array["gtype_ft"] = "Soccer";
        array["gtype_op"] = "Other Sports";
        array["gtype_sk"] = "Snooker";
        array["gtype_tn"] = "Tennis";
        array["gtype_tt"] = "Table Tennis";
        array["gtype_vb"] = "Volleyball";

        array["allGame"] = "ALL MATCHES";
        array["hotGame"] = "Popular";

        array["Mon"] = "MON";
        array["Tue"] = "TUE";
        array["Wed"] = "WED";
        array["Thu"] = "THU";
        array["Fri"] = "FRI";
        array["Sat"] = "SAT";
        array["Sun"] = "SUN";

        array["mon_01"] = "Jan";
        array["mon_02"] = "Feb";
        array["mon_03"] = "Mar";
        array["mon_04"] = "Apr";
        array["mon_05"] = "May";
        array["mon_06"] = "Jun";
        array["mon_07"] = "Jul";
        array["mon_08"] = "Aug";
        array["mon_09"] = "Sep";
        array["mon_10"] = "Oct";
        array["mon_11"] = "Nov";
        array["mon_12"] = "Dec";

        array["mycoupon"] = "MY LIST";

        array["bet_txt"] = "PLACE BET";
        array["betslip_txt"] = "Bet Slip";
        array["accept_change_txt"] = "ACCEPT CHANGES";
        array["lastBetOption_fast"] = "Retain Selection";
        array["lastBetOption_total"] = "Retain Selections";
        array["parlay_txt"] = "Parlay";
        array["single_txt"] = "Single";

        array["datetime_today"] = "Today";

        array["4pwd_new"] = "Do you want to set up a passcode for quicker log in?";
        array["4pwd_second"] = "You are using a device / browser that has not been enabled for Passcode Login. Do you want to enable it now?"+"<br>"+"<br>"+"Note: Logging in using different accounts will temporary disable your Passcode Login on this device / browser.";
        array["4pwd_chkdel"] = "This will deactivate your Passcode Login on all your devices."+"<br>"+"<br>"+"Are you sure?";
        array["4pwd_del"] = "You have successfully removed Passcode Login.";
        array["4pwd_set"] = "Set up your Passcode Login for quicker log in";
        array["4pwd_chkAgain"] = "Re-enter your Passcode Login or";

        array["connect_retry"] = "Sorry, the connection has timed out. Please try again.";
        array["connect_fail"] = "Your internet connection is unstable.Please check your connection and try again.";
        array["connect_again"] = "Reconnect";
        array["connect_ok"] = "CONFIRM";
        
        array["pls_chg_pwd"] = "With the creation of your Login ID, for account security, please change your password.";

        array['doubleLogin']="You have been logged out from this session. Please log in again.\n";
        array['doubleLogin']+="You have been logged out for one of the following reasons:\n";
        array['doubleLogin']+="1.Your session has timed-out.\n";
        array['doubleLogin']+="2.You are logged in on another session.\n";
        array['doubleLogin']+="Please log in again. If you have questions or need assistance, please contact you upline or customer service.";

        array["MT_Statistics"] = "Statistics";
        array["MT_Commentary"] = "Timeline";
        array["MT_LineUps"] = "Line Ups";
        array["MT_HeadToHead"] = "Head to Head";
        array["MT_LeagueTable"] = "Standings";
        array["MT_Ranking"] = "Rankings";
        array["MT_PointByPoint"] = "Point by Point";
        array["MT_probabilities"] = "Probabilities";
        array["MT_boxscore"] = "BOX SCORE";

        array["relating_title"] = "View Information Relating to Content";
        array["timeZone_wagers"] = "Transaction time is based on GMT-4.";
        array["timeZone_message"] = "Time quoted is based on GMT-4.";
        array["timeZone_game"] = "Today's events are based on GMT-4.";
        array["relating_content"] = "All live content displayed in this panel is for information purposes only and members are advised to only use this as a guide. While we make every effort to ensure the content displayed is correct, our company will assume no liability for incorrect information. For markets that are based on the live score, e.g. In-Play Asian Handicaps, the correct score that the market is based off will be displayed in the Bet Slip at time of bet placement.";

        array["mid_title"] = "EVENT INFORMATION";
        array["mid_content"] = "Neutral Venue";

        array["fantasy_title"] = "FANTASY MATCHES";
        array["fantasy_content"] = "These are events where two teams, from two separate matches, are paired together for predicting imaginary outcomes.";

        array["event_not_start"] = "TV streaming available when this event starts.";
        array["event_TV_error"] = "Live coverage is currently not available.<br>Please connect another event to view.";

        array["determine"] = "OK";

        array["league_limit"] = "Max of 8 competitions can be selected."; 

        array["order_limit"] = "Max of 10 selections can be added to the Bet Slip."; 

        array["addMyGame_success"] = "Added to My Events.";
        array["addMyGame_block"] = "Max of 25 events per sport can be added to My Events.";
        array["myGame_close"] = "Sorry, this section is temporarily unavailable. Please try again later.";
        array["myGame_backToHome"] = "Sorry, you have been redirected as it seems the previous area is temporarily unavailable. Please try again later.";

        array["BG_DRM_Y"] = "This video required DRM. However, currently we are not supporting DRM.";
        array["BG_DRM_N"] = "no event";

        array["oddf_H"] = "Hong Kong Odds";
		array["oddf_M"] = "Malay Odds";
		array["oddf_I"] = "Indo Odds";
        array["oddf_E"] = "Euro Decimal Odds";
        
        array["today_wager_A"] = "Confirmed";
        array["ticket_id_str"] = "Ticket No: ";

        array["delay_001"] = "Waiting for Official Update";
        array["delay_002"] = "Verifying Match Result";
        array["delay_003"] = "Match Interrupted";
        array["delay_004"] = "Match Rescheduled";
        array["delay_005"] = "Operational Needs";
        array["delay_006"] = "Technical Issue";

        array["analysisBlock"] = "Please rotate your device to view Statistics.";
        return array;
    }

    _self.get=function(_key){
        return array[_key]? array[_key] : _key;
    }

}
var widget3_ary = new Array("FT");
var widget2;
var loading_ary = new Array("FT","DA");
var sport_id = "";
var echo = function(){};
const tabDataWaitMiliseconds = 1000;
function init(){
    echo("[===getDataMT.js===]");
    window.addEventListener("message", receiveMessageFromWindow, false);
}

function receiveMessageFromWindow ( event ) {
    var cmds=event.data.split("|");
    echo(cmds[1],"監聽成功");
    if (cmds[0]=="001"){
        sendParent('003|loaded');
    }else if(cmds[0]=='123'){
        closePopMsg(cmds[2]);
    }else if(cmds[0]=='456'){
        loadMT(cmds[1],cmds[2],cmds[3]);
    }else if(cmds[0]=='789'){
        chgDirection(cmds[1]);
    }
}
function chgDirection(code){
    if(code == 'addClass')document.getElementById("main_div").classList.add("mt_lan");
    else document.getElementById("main_div").classList.remove("mt_lan");
}

function loadMT(data,ts,showRight){
    var mtData = JSON.parse(data);
    MODE = mtData.Mode;
    if(mtData.NeedsHeader=="Y") document.getElementById("title_div").style.display = "none";
    if(mtData.Mode.indexOf("close")!=-1){
        closeMatch();
        return;
    }else if(mtData.Mode.indexOf("lmt")!=-1){
        document.getElementById("title_div").style.display = "none";
        if(mtData.Status=="open"){
            document.getElementById("loading").className = "timeline_loading";
        }else{
            document.getElementById("loading").className = "mt_loading";
        }
        if(in_array(mtData.Gtype,loading_ary)) document.getElementById("loading").classList.add(mtData.Gtype+"_loading");
    }else{
        document.getElementById("main_div").className = "pop_div";
        document.getElementById("loading").className = "mt_pop_loading";
        setModeTitle(mtData);
    }
    var Langx = chooseLangx(langx);
    document.getElementById("loading").style.display = "";

    if(in_array(mtData.Gtype,widget3_ary)){
        (function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,
        g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),g.onerror=errFunc,h.parentNode.insertBefore(g,h)
        )})(window,document,"script", "https://ws-cdn001.akamaized.net/"+mtData.KeyID+"/widgetloader", "SIR", {
            language: Langx
        });
        document.getElementById("main_div").classList.add("mt_FT");
        if(mtData.Mode.indexOf("lmt")==-1){
            if(showRight=="true")document.getElementById("main_div").classList.add("right_MT");
            else document.getElementById("main_div").classList.remove("right_MT");
        }
        if(mtData.Mode!="") openMatch_3(mtData,ts);
    }else{
        if(mtData.Lmt3){
            sport_id = mtData.SpID;
            (function(a,b,c,d,e,f,g,h,i){a[e]||(i=a[e]=function(){(a[e].q=a[e].q||[]).push(arguments)},i.l=1*new Date,i.o=f,
            g=b.createElement(c),h=b.getElementsByTagName(c)[0],g.async=1,g.src=d,g.setAttribute("n",e),h.parentNode.insertBefore(g,h)
            )})(window,document,"script", "https://ws-cdn001.akamaized.net/"+mtData.KeyID+"/widgetloader", "SIR", {
                theme: true,
                language: Langx
            });
            if(mtData.Mode!="")openMatch_3_plus(mtData,ts);
        }
        else{
            var scriptObj = document.createElement("script");
            scriptObj.type = "text/javascript";
            var domain = (checkCasino())?"csdev.betradar.com":"cs.betradar.com";
            scriptObj.onerror = errFunc;
            scriptObj.src = "https://"+domain+"/ls/widgets/?/aspen/"+Langx+"/"+mtData.TimeZone+"/widgetloader/widgets";   
            (document.getElementsByTagName("head")[0] || document.body).appendChild(scriptObj);
            if(mtData.Mode!="") openMatch_2(mtData,ts);
        }
        
    }
}

function closePopMsg(gtype){
    if(in_array(gtype,widget3_ary)){
        var obj = document.getElementsByClassName("sr-momentum__tooltip")[0];
        var objDot = document.getElementsByClassName("sr-momentum__eventgroup-active srt-base-1-background")[0];
        if(obj!=null) obj.style.display = "none";
        if(objDot!=null) objDot.style.display = "none";
    }else{
        var obj = document.getElementsByClassName("sr-tooltip")[0];
        if(obj!=null) obj.style.display = "none";
    }
}

function sendParent(data){
    parent.postMessage(data,'*');
}

function setTryScroll(data){
    try{
            if(data.Mode == "standings" || data.Mode == "pointByPoint" || data.Mode == "boxScore")return; 
            var setScrollElement = new Array("match.commentary","timeline");
            var mainObj = document.getElementById("main_div");
            var obj = (in_array(data.Mode,setScrollElement))?document.getElementsByClassName("sr-scrollbars__container")[0].children[0]:mainObj;
            setScrollObject(obj);
            mainObj.addEventListener("touchstart",tryscroll);
            mainObj.addEventListener("touchmove",tryscroll);
    }catch(e){
            console.log(e);	
    }
}

function setModeTitle(data){
    var title = document.getElementById("mt_pop_title");
    LS = new_eval("new LS_"+data.Lang+"();");
    LS.init();
    switch(true){
        case data.Mode.indexOf("statistics")!=-1:
        case data.Mode.indexOf("matchstats")!=-1:
            title.innerHTML = LS.get("MT_Statistics");
            break;
        case data.Mode.indexOf("comment")!=-1:
            title.innerHTML = LS.get("MT_Commentary");
            break;
        case data.Mode.indexOf("lineups")!=-1:
            title.innerHTML = LS.get("MT_LineUps");
            break;
        case data.Mode.indexOf("headTohead")!=-1:
        case data.Mode.indexOf("head2head")!=-1:
            title.innerHTML = LS.get("MT_HeadToHead");
            break;
        case data.Mode.indexOf("liveTable")!=-1:
        case data.Mode.indexOf("livetable")!=-1:
            title.innerHTML = LS.get("MT_LeagueTable");
            break;
        case data.Mode.indexOf("ranking")!=-1:
            title.innerHTML = LS.get("MT_Ranking");
            break;
            
    }
}

function showLS(code){
            if(LS[code]+""=="undefined")  return code;
            return LS[code];
    }

function errFunc(){
    document.getElementById("loading").style.display = "none";
    document.getElementById("main_div").innerHTML = "Connect Failed ! ";
}

function chooseLangx(langx){
    var Langx = "";
    switch(langx){
        case "zh-tw":
        case "zh-cn":
            Langx = "zh";
            break;
        case "en-us":
            Langx = "en";
            break;
    }
    return Langx;
}

function openMatch_3(data,ts){
    SIR("addWidget", "#main_div", data.Mode,
    {
        matchId: data.GameID,
        disableSpottingLine: true,
        disableScoreboard: true,
        disableWidgetHeader: true,
        momentum: "bars",
        pitchCustomBgColor: '#047102', 
        disableMomentum: 'false', 
        disablePitchNoise: 'true', 
        goalBannerImage: 'data:image/png;base64,',
        disablePitchClock: true, 
        disableTabs: true,
        showOnlySelectedGroup: false,
        onTrack: Finish("main_div",data,ts)
    });   
}
function Finish(dom,data,ts){
    return function onTrack(type, doc) {
        if (type !== 'data_change') return;
        waitForData(`${dom} .sr-loader__container`, tabDataWaitMiliseconds).then(function(tabDataAvailable) {
            setTimeout(function(){
                var totalHeight = 0;
                document.getElementById("loading").style.display = "none";
                if(data.Mode.indexOf("lmt")==-1) {
                    totalHeight = document.getElementById("main_div").scrollHeight;
                    totalHeight +=10;
                    setTryScroll(data);
                }
                sendParent("002|"+checkLoading(data.Mode)+"|"+ts+"|"+totalHeight);
            },3000);
        });
    }
}
function openMatch_3_plus(data,ts){
    var tap_model = new Object();
    tap_model[sport_id] = [data.Mode];
    if(data.Mode == "match.lmtPlus"){
        SIR("addWidget", "#main_div", "match.lmtPlus", 
        {
            layout: "topdown", 
            matchId:data.GameID,
            scoreboard:'disable',
            onTrack: Finish("main_div",data,ts)
        });
    }else{
        SIR("addWidget", "#main_div", "match.lmtPlus",
        {
            layout: "topdown",
            scoreboard: "disable",
            detailedScoreboard: "disable",
            matchId: data.GameID,
            disablePitch: true,  
            momentum: "bars",    
            tabs:tap_model, 
            tabsPosition: 'disable', 
            onTrack: loadTab("main_div",data,ts)
        });
    }
}

function openMatch_2(data,ts){
    setTimeout(function(){
        widget2 = SRLive.addWidget({ 
            name: data.Mode,
            config:{
                matchId: data.GameID,
                container: '#main_div',
                showMomentum2:true,
                showScoreboard: false,
                showSidebar: false,
                collapse_enabled: false,
                showTitle: false,
                disableSpottingLine: true,
                showHeatmap: false,
            },
            callback: function(){
                document.getElementById("loading").style.display = "none";
                if(data.Mode.indexOf("lmt")==-1) setTryScroll(data);
                sendParent("002|"+checkLoading(data.Mode)+"|"+ts);
            }
        }); 
    },1500);
}

function checkLoading(name){
    var loading = "";
    if(name.indexOf("lmt")!=-1){
        loading = "mt_loading";
    }else{
        loading = "mt_pop_loading";
    }
    return loading;
}



function closeMatch(){
    document.getElementById("main_div").innerHTML = "";
}

function checkCasino(){
    var domain = document.domain;
    var casino = domain.split(".")[0];
    if(casino.indexOf("cro666")!=-1) return true;
    return false;
}

function in_array(txt, ary){
        for(var key in ary){
                if(ary[key]==txt)  return true;
        }
        return false;
}

function writeLog(msg){

    var _url = "/lib/write_log.php";
    var param = "";
    param+="user="+USERNAME;
    param+="&msg="+encodeURIComponent(msg);

    var hr = new HttpRequest();
    hr.addEventListener("LoadComplete",null);
    hr.loadURL(_url,"POST",param);
}
function loadTab(dom,data,ts){
    return function onTrack(type, doc) {
        if (type !== 'data_change') return;
        waitForData(`${dom} .sr-lmt-plus__comp-size`, tabDataWaitMiliseconds).then(function(tabDataAvailable) {
            if(!tabDataAvailable)sendParent("555|"+true+"|"+ts);
            setTimeout(function(){
                document.getElementById("loading").style.display = "none";
                if(data.Mode.indexOf("lmt")==-1) setTryScroll(data);
                sendParent("002|"+checkLoading(data.Mode)+"|"+ts);
            },3000);
        });
    }
}

function waitForData(selector, timeout) {
    return new Promise(function(resolve, reject) {
        setTimeout(function(){
            var data = document.querySelector("#"+selector);

            if (!data) {
                resolve(false);
                echo("找不到放MT的物件");
                return;
            }

            if (data.children.length) {
                resolve(true);
                return;
            } else {  
                var delayedResolve = function(success) {
                    observer.disconnect();
                    clearTimeout(timeoutRef);

                    resolve(success);
                }

                var observer = new MutationObserver(function() {
                    delayedResolve(true);
                });

                var timeoutRef = setTimeout(function() {
                    delayedResolve(false);
                }, timeout);

                observer.observe(data, { childList: true });
            }
        },timeout);
    });
}

function new_eval(str) {
    var fn = Function;
    return new fn('return ' + str)();
}
<?
}
?>