function app_record_list(_win, _dom, param){
    var _self=this;
    var _top=null;
    var win = _win;
    var dom = _dom;
    var classname = "app_record_list.js";
    var paramObj;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var Cookie;
    var _myTop;
    var _mc = new Object();
    var _gtypeAry = new Array();
    var _totalCnt = 100;
    var config_set;

    var _stake = new Object();
    var timerObj = new Object();
    var musicObj = null;

    var getView;
    var view_w;
    var ret_xmp = ["764_up","764_down"];  //選用框架 //改兩邊做
    var ret_xmp_big = "764_up";    	//改兩邊做
    var ret_xmp_small = "764_down";		//改兩邊做
    var testTimerTurn = true;  //測試用 reloadData開關
    var storage;
    var data_filter;
    var levelWagerObj=null;
    var filterBigObj = null;
    var filterUse = new Object();
    var btnMore = [0,0,0,0,0];

    var _set = new Object();
    _set["musicflg"] = "on";
    _set["sel_maxid"] = "0";

    _self.init=function(){

        _top.popWindow = new Object();
        getView = parentClass.getThis("getView");
        view_w = getView().viewportwidth;//螢幕畫面大小

        var musicBtn = dom.getElementById("music_btn");
        var musicBox = dom.getElementById("musicBox");

        util.addEvent(musicBtn,"click",_self.musicEvent,{});
        
        // 提醒按鈕元件
        if(!util.isIE()){
            dom.getElementById("musicBox").innerHTML = "<audio id=\"obj_music\" name=\"obj_music\" hidden=\"true\" src=\"/TPBTLOW.WAV\"></audio>";
        }else{
            dom.getElementById("musicBox").innerHTML = "<embed id='obj_music' name='obj_music' hidden='true' src='/TPBTLOW.WAV'></embed>";
        }
        musicObj = util.getObj(musicBox, "obj_music");
        musicObj.onerror=function(){
            musicObj.load();
            musicObj.play();
        }
        musicObj.load();
        _self.loadData();
        _self.createWmcTimer();
        _self.initScroll();

    }

    _self.setParentclass = function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        Cookie = parentClass.getThis("cookie");
        config_set = parentClass.getThis("config_set");
        _top = parentClass.getThis("top");
        storage = parentClass.getThis("storage");
    }

    _self.clearEvent=function(mouseEvent, targetObj){
        var wagers_show_big = document.getElementById(ret_xmp_big+"_wager_show");
        var wagers_show_small = document.getElementById(ret_xmp_small+"_wager_show");
        wagers_show_big.innerHTML="";
        wagers_show_small.innerHTML="";
    }

    _self.pauseEvent=function(mouseEvent, targetObj){
        var obj = new Object();
        obj.filename = "wmcPop";
        obj.title = "_blank";
        obj.toolbar = "no";
        obj.scrollbars = "no";
        obj.resizable = "no";
        obj.location = "no";
        obj.menubar = "no";
        obj.status = "no";
        obj.height = "720px";
        obj.width = "1024px";
        obj.dowrite = true;
        obj._body = _dom.getElementById("detail_data").innerHTML;
        _self.newOpenPageHandler(obj);
    }

    _self.musicEvent=function(mouseEvent){
        _set["musicflg"] = (_set["musicflg"] == "on")?"off":"on";
        musicObj.load();
        // musicObj.play();
    }



    _self.remenberFilter = function(e,_par){
        var checkDiv = _par._dom;
        var checkBoxBtn = checkDiv.getElementsByTagName("Input")[0];
        var otherID = _par._otherID;
        var otherDom = dom.getElementById(otherID);
        var otherCheckBoxBtn = otherDom.getElementsByTagName("Input")[0];

        if(checkBoxBtn.checked==true){
            checkBoxBtn.checked = false;
            otherCheckBoxBtn.checked = false;
            _set["remenberflg"] = false;
        }else{
            checkBoxBtn.checked = true;
            otherCheckBoxBtn.checked = true;
            _set["remenberflg"] = true;
        }
        _top["remenberflg_wmc"] = _set["remenberflg"];
        _top["filter_wmc"]= filterUse;
        _self.backOpenerTop("remenberflg_wmc");
        _self.backOpenerTop("filter_wmc");
    }

    //load data
    _self.loadData=function(){
        _self.reloadData();
    }

    _self.reloadData=function(){
        var par = "";
        par+=top.param;
        par+="&p=get_record";
        par+="&sel_maxid="+_set["sel_maxid"];
        par+="&view_user="+top.view_user;
        par+="&view_id="+top.view_id;
        par+="&view_layer="+top.view_layer;
        par+="&action=app";
        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadFinish);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.onError = function(){
        // console.log("[Error]");
        //dom.getElementById("err404").style.display = "";
    }

    _self.initMySet=function(){
        _stake = _mc["bets_search_setting"].JS.getStakeFilter();

        var param = _mc["bets_search_setting"].JS.getBetsSearchParam();
        param = param.substr(1,param.length);

        var paramAry = param.split("&");

        //console.log(paramAry);

        for(var i=0; i<paramAry.length; i++){
            var oneAry = paramAry[i].split("=");

            var k = oneAry[0];
            var v = oneAry[1];

            if(k=="symbol" || k=="gold" || k=="site" || v=="all"){
                _set[k] = v;
            }else{
                v = v.replace(/\'/g,"");
                v = v.split(",");
                _set[k] = v;
            }
        }
        //console.log(_set);
        if(_set["bettype"] != "all"){
            var bt = new Array();
            for(var i=0; i<_set["bettype"].length; i++){
                var k = _set["bettype"][i];
                var tmpGtype = _set["gtype"];
                var z = k;

                if(k.indexOf("_") != -1){
                    var tmp = k.split("_");
                    tmpGtype = tmp[0];
                    z = tmp[1];
                }

                if((tmpGtype=="ALL" && z=="P3") || tmpGtype=="ALL"){
                    for(var j=0; j<_gtypeAry.length; j++){
                        var tg = _gtypeAry[j];

                        if(_set["typeMap"][tg] != undefined){
                            if(_set["typeMap"][tg][z] != undefined)	bt = bt.concat(_set["typeMap"][tg][z]);
                        }
                    }
                }else{
                    if(_set["typeMap"][tmpGtype] != undefined){
                        if(_set["typeMap"][tmpGtype][z] != undefined)	bt = bt.concat(_set["typeMap"][tmpGtype][z]);
                        if(tmpGtype == "BM"){
                            if(_set["typeMap"]["TT"][z] != undefined)	bt = bt.concat(_set["typeMap"]["TT"][z]);
                        }
                    }
                }
            }

            bt = _self.my_unique(bt);
            _set["bettype"] = bt;
        }

        //console.log("wmc =============");
        //console.log(_set["bettype"]);
    }

    _self.getParam=function(){
        var par = "";
        par += "uid="+_top["userData"].uid;
        par += "&login_layer="+top.login_layer;
        par += "&gtype="+_set["gtype"];
        par += "&sel_maxid="+_set["sel_maxid"];
        return par;
    }

    //load finish
    _self.loadFinish=function(json){
        // console.log(json);
        var arr_data = JSON.parse(json);
        var outStr_big ="";
        var outStr_small ="";
        var detail_data_xmp = document.getElementById("detail_data_xmp");
        var detail_data = document.getElementById("detail_data");
        document.getElementById("detail_data").innerHTML = detail_data_xmp.innerHTML;

        var wagers_show_big = document.getElementById(ret_xmp_big+"_wager_show");
        var wagers_show_small = document.getElementById(ret_xmp_small+"_wager_show");


        if(arr_data.status == "error"){
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg != null && error_msg != "") {
                var errorXMP = document.getElementById("error").innerHTML;
                errorXMP = errorXMP.replace(new RegExp("\\*ERROR\\*", "gi"), error_msg);
                wagers_show_big.innerHTML = errorXMP;
                wagers_show_small.innerHTML = errorXMP;
                var detail = document.getElementById("detail_data").innerHTML;

                document.getElementById("detail_data").innerHTML = detail.replace(new RegExp("\\*LAYERNAME\\*", "gi"), "账号");
                document.getElementById("btn_more").remove();
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
            return ;
        }

        var data = arr_data.data;
        var html = "";
        for(var lv in data){
            var subHtml = detail_data_xmp.innerHTML;
            subHtml = subHtml.replace(new RegExp("\\*LAYERNAME\\*", "gi"), LS.get("str_"+lv));
            subHtml = subHtml.replace(new RegExp("\\*LAYER\\*", "gi"), lv);

            wagers_show_big.innerHTML = "outStr_big";
            wagers_show_small.innerHTML = "outStr_small";
            html += subHtml;

        }
        detail_data.innerHTML = html;
        var btnMoreKey = 0;
        var isLive = false;
        for(var lv in data){
            var outStr_big = "";
            var outStr_small = "";

            for(var k in data[lv]){
                var d = data[lv][k];
                var xmp_up = document.getElementById("xmp_"+ret_xmp_big+"_wagers_content").innerHTML;
                xmp_up = xmp_up.replace(new RegExp("\\*USERNAME\\*", "gi"), d["username"]);
                xmp_up = xmp_up.replace(new RegExp("\\*TIME\\*", "gi"), d["time"]);
                xmp_up = xmp_up.replace(new RegExp("\\*IP\\*", "gi"), d["ip"]);
                xmp_up = xmp_up.replace(new RegExp("\\*CONTENT\\*", "gi"), d["content"]);
                if(d["color"] == 1){
                    xmp_up = xmp_up.replace(new RegExp("\\*COLOR\\*", "gi"), "mwc_bg_color");
                    isLive = true;
                }else{
                    xmp_up = xmp_up.replace(new RegExp("\\*COLOR\\*", "gi"), "");
                }

                if(k<5){
                    xmp_up = xmp_up.replace(new RegExp("\\*DISPLAY\\*", "gi"), "");
                }else{
                    xmp_up = xmp_up.replace(new RegExp("\\*MORE\\*", "gi"), lv+"_more");
                    if(btnMore[btnMoreKey] == 1){
                        xmp_up = xmp_up.replace(new RegExp("\\*DISPLAY\\*", "gi"), "");
                    } else {
                        xmp_up = xmp_up.replace(new RegExp("\\*DISPLAY\\*", "gi"), "hide");
                    }

                }
                outStr_big +=xmp_up;

                var xmp_down = document.getElementById("xmp_"+ret_xmp_small+"_wagers_content").innerHTML;
                xmp_down = xmp_down.replace(new RegExp("\\*USERNAME\\*", "gi"), d["username"]);
                xmp_down = xmp_down.replace(new RegExp("\\*TIME\\*", "gi"), d["time"]);
                xmp_down = xmp_down.replace(new RegExp("\\*IP\\*", "gi"), d["ip"]);
                xmp_down = xmp_down.replace(new RegExp("\\*CONTENT\\*", "gi"), d["content"]);

                if(d["color"] == 1){
                    xmp_down = xmp_down.replace(new RegExp("\\*COLOR\\*", "gi"), "mwc_bg_color");
                }else{
                    xmp_down = xmp_down.replace(new RegExp("\\*COLOR\\*", "gi"), "");
                }

                if(k<5){
                    xmp_down = xmp_down.replace(new RegExp("\\*DISPLAY\\*", "gi"), "");
                }else{
                    xmp_down = xmp_down.replace(new RegExp("\\*MORE\\*", "gi"), lv+"_more");
                    if(btnMore[btnMoreKey] == 1){
                        xmp_down = xmp_down.replace(new RegExp("\\*DISPLAY\\*", "gi"), "");
                    } else {
                        xmp_down = xmp_down.replace(new RegExp("\\*DISPLAY\\*", "gi"), "hide");
                    }

                }
                outStr_small +=xmp_down;

            }

            var div = document.getElementById("div_"+lv);
            var big = ret_xmp_big+"_wager_show";
            var small = ret_xmp_small+"_wager_show";
            var obj_ids = ","+big+","+small+",btn_more,div_more,";
            var _ary = util.getObjAry(div, obj_ids);
            _ary[big].innerHTML = outStr_big;
            _ary[small].innerHTML = outStr_small;
            if(data[lv].length==0){
                _ary["div_more"].style.display = "none";
            }else {
                _ary["div_more"].style.display = "";
            }
            util.addEvent(_ary["btn_more"], "click", _self.onClickMoreEvent,{"key":btnMoreKey,"lv":lv});

            btnMoreKey++;
        }
        if(isLive){
            _self.chk_music();
        }
        return ;
    }

    _self.onClickMoreEvent = function(evt,param){
        var key = param.key;
        var more = document.getElementsByName(param.lv+"_more");
        if(btnMore[key] == 1){
            btnMore[key] = 0;
            evt.target.value = "查看50条记录";
        }else{
            btnMore[key] = 1;
            evt.target.value = "部分隐藏";
        }

        for(var i in more) {
            if(more.hasOwnProperty(i)) {
                if (btnMore[key] == 1) {
                    more[i].classList.remove("hide");
                } else {
                    more[i].classList.add("hide");
                }
            }
        };
    }

    _self.chkCanParse=function(gtype,stake,downline,market,league,_event){
        if(filterUse["gtype"] != "ALL"){
            if(filterUse["gtype"]!=gtype){
                return false;
            }
        }

        if(filterUse["downline"] != "ALL"){
            var checkAry = filterUse["downline"].toString().split(",");
            if(checkAry.indexOf(downline)*1 == -1){
                return false;
            }
        }

        if(filterUse["market"]!="ALL"){
            if(filterUse["market"]!=market) {
                return false;
            }
        }

        if(filterUse["league"]!="ALL"){
            if(filterUse["league"]!=league && league*1 != 0){
                return false;
            }
        }

        if(filterUse["event"]!="ALL"){
            if(filterUse["event"]!=_event){
                return false;
            }
        }

        if(filterUse["stake"]["mode"]=="ALL"){
            if(filterUse["stake"]["listGold"]["ALL"]*1 >= stake*1){
                return false;
            }
        }else{
            if(filterUse["stake"]["listGold"][gtype]*1 >= stake*1){
                return false;
            }
        }


        return true;
    }

    //---------------- timer ----------------
    _self.createWmcTimer=function(){
        _self.clearDangerTimer();

        timerObj["wmc"] = new Timer(config_set.get("WMC_RELOAD"));
        timerObj["wmc"].setParentclass(_self);
        timerObj["wmc"].dont_clear = true; //設定為不清除timer
        timerObj["wmc"].init();
        timerObj["wmc"].addEventListener("TimerEvent.TIMER", _self.wmcTimerRun);
        timerObj["wmc"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.wmcTimerFinish);
        timerObj["wmc"].startTimer();

    }


    _self.stopDangerTimer = function () {
        util.echo("wmc stopTimer");
        timerObj["wmc"].stopTimer();
    }

    _self.clearDangerTimer=function(){
        util.echo("wmc clearTimer");
        if(timerObj["wmc"]!=null){
            timerObj["wmc"].clearObj();
            timerObj["wmc"]=null;
        }
        return true;
    }

    _self.wmcTimerRun=function(count){
        if(testTimerTurn)_self.reloadData();
    }

    _self.wmcTimerFinish=function(){
        util.echo("timerComplete");
    }


    //---------------- timer ----------------

    _self.chk_music=function(){
        if(_set["musicflg"] == "on"){
            if(musicObj!=null){
                musicObj.play();
            }
        }
    }

    _self.my_unique=function(a){
        var a = a.concat();

        for(var i=0; i<a.length; ++i){
            for(var j=i+1; j<a.length; ++j){
                if(a[i] === a[j])	a.splice(j, 1);
            }
        }

        return a;
    }

    _self.loadingFun=function(types){
        _myTop["obj"].eventhandler("setLoadingVisibleHandler", {"isShow":types,"loadingObj":paramObj.loadingObj});
    }

    _self.debugPrint=function(msg){
        try{
            //console.log("["+classname+"]"+msg);
        }catch(e){
            //alert("["+classname+"]"+msg);
        }
    }






    _self.newOpenPageHandler =  function(obj){
        _self.newOpenPageEvent(obj);
    }



    //new open page
    _self.newOpenPageEvent = function(obj){
        var dowrite = (obj.dowrite == undefined)?false:obj.dowrite;
        _self.newOpenPage(obj.filename, (obj.title)?obj.title:"",  _self.getNewOpenParam(obj), dowrite, obj._body);
    }

    _self.newOpenPageNoParEvent = function(obj){
        var dowrite = (obj.dowrite == undefined)?false:obj.dowrite;
        _self.newOpenPage(obj.filename, (obj.title)?obj.title:"", "" , dowrite, obj._body);
    }

    _self.getNewOpenParam = function(obj){

        var par = "config='";
        par+="location="+((obj.location!=null)?obj.location:"no");
        par+=",status="+((obj.status)?obj.status:"no");
        par+=",width="+((obj.width)?obj.width:"600px");
        par+=",height="+((obj.height)?obj.height:"600px");
        par+=",toolbar="+((obj.toolbar)?obj.toolbar:"no");
        par+=",top="+((obj.top)?obj.top:"0px");
        par+=",left="+((obj.left)?obj.left:"0px");
        par+=",scrollbars="+((obj.scrollbars)?obj.scrollbars:"no");
        par+=",resizable="+((obj.resizable)?obj.resizable:"yes");
        par+=",personalbar="+((obj.personalbar)?obj.personalbar:"yes");
        par+= "'";
        return par;

    }

    _self.newOpenPage = function(filename, _title, param, dowrite, _body){
        if(util.showTxt(filename)=="" && !dowrite) return;
        if(_title!="history"){
            if(_top.popWindow[filename] != null){
                _top.popWindow[filename].focus();
                if(!_top.popWindow[filename].closed)	return;
            }
        }

        _top.popWindow[filename] = window.open(filename, _title, param);
        _top.popWindow[filename].focus();

        if(dowrite){
            var headStr = "";
            // _top.popWindow[filename].document.write("<html><body></body></html>");

            for(var i=0; i < window.document.head.children.length; i++){
                var node = document.head.children[i];
                var tag = node.tagName;
                if(tag=="META" || tag=="LINK" || tag=="STYLE"){
                    headStr += node.outerHTML;
                }
            }

            var script =  document.createElement('script');
            script.src = '../../js/wmc/wmc_open_page.js';
            headStr += script.outerHTML;

            var script_util =  document.createElement('script');
            script_util.src = '../../js/lib/util.js';
            headStr += script_util.outerHTML;

            htmlStr = "<html><head>"+headStr+"</head><body onload='initO();'><div id='wmc_other_page' class='ma_contentfull'>"+_body+"</div></body></html>";

            _top.popWindow[filename].document.write(htmlStr);
            _top.popWindow[filename].document.close();
        }

    }


    _self.backOpenerTop = function(name){
        var name = name;
        var storageParam = _top[name];
        if(name=="filter_wmc"){
            if(_set["remenberflg"]!=true) storageParam = null;
        }
        var jsonStr = JSON.stringify(storageParam);
        storage.set(top.login_layer+"_"+top.user_id+"_"+name,jsonStr);
    }


    //=============---------=------------fix
    _self.initScroll = function () {
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollVerEvent, dom.getElementById("wmc_body"));
    }
    _self.scrollVerEvent = function (e,targetObj) {
        scroll_e = e;
        _self.scroll_ver_event(e, targetObj);
    }

    _self.scroll_ver_event = function (e, targetObj) {
        if (e == null || !dom.getElementById("re_function")) return;
        var newScrollTop = e.target.scrollTop;
        var ori_h = e.target.scrollHeight;
        var now_h = 0;
        var func_h = dom.getElementById("re_function").clientHeight + dom.getElementById("re_function").offsetTop ;
        if (newScrollTop > func_h) {
            util.classFunc(targetObj, "title_fixed");
            now_h = e.target.scrollHeight;
            if (now_h != 0) stop_h = func_h - (ori_h - now_h);
        }
        if(newScrollTop <= func_h){
            util.classFunc(targetObj, "title_fixed", "remove");
            // e.target.scrollTop = func_h;
        }

        // _self.checkShowLazyLoading(e.target);
    }


}