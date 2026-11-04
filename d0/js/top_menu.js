function top_menu(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var eventHandler = new Object();
    var Cookie;
    var CookieKey;
    var CookieImp;
    var CookieGen;

    var mu_hab;
    var mu_isOpen = false;
    var back;
    var user_code;
    var mu_profile;
    var mu_profile_in;
    var keepStyle = {};
    var rightPanel;
    var RP_isShow = false;
    var mySetting;
    var logOut;
    var pswdRec;
    var chgPswd;
    var contact;
    var troubleshooting;
    var new_url;
    var live_chat;
    var my_activities;
    var quick_search;
    var announcement;
    var problem_accounts;
    var requirements;
    var wmc;
    var choose_lan;
    var topFrame;
    var feature;
    var Timer;
    var timerHash = new Object();
    var testTimerTurn = true;  //測試用 reloadData開關

    var d0_layer = {"co":4,"su":3,"ag":2,"mem":1};
    var co_layer = {"su":3,"ag":2,"mem":1};
    var su_layer = {"ag":2,"mem":1};
    var ag_layer = {"mem":1};

    _self.init = function () {
        util.echo("top load complete");
        mu_hab = dom.getElementById("mu_hab");
        top.mu_isOpen = "close";
        back = dom.getElementById("back");

        //==== Right Panel ====
        mu_profile = dom.getElementById("mu_profile");
        mu_profile_in = dom.getElementById("mu_profile_in");
        user_code = dom.getElementById("user_code");
        rightPanel = dom.getElementById("rightPanel");
        feature = dom.getElementById("feature");
        requirements = dom.getElementById("requirements");
        mySetting = dom.getElementById("mySetting");
        my_activities = dom.getElementById("my_activities");
        pswdRec = dom.getElementById("pswdRec");
        chgPswd = dom.getElementById("chgPswd");
        logOut = dom.getElementById("logOut");
        contact = dom.getElementById("contact");
        troubleshooting = dom.getElementById("troubleshooting");
        new_url = dom.getElementById("new_url");
        live_chat = dom.getElementById("live_chat");
        quick_search = dom.getElementById("quick_search");
        announcement = dom.getElementById("announcement");
        problem_accounts = dom.getElementById("problem_accounts");
        wmc = dom.getElementById("wmc");
        choose_lan = dom.getElementById("choose_lan");
        choose_lan_str = dom.getElementById("choose_lan_str");

        util.addEvent(mu_hab, "click", _self.showLeftPanel);
        util.addEvent(back, "click", _self.backPage);
        util.addEvent(wmc, "click", _self.wmcOpen);
        util.addEvent(announcement, "click", _self.changePage, { "page": "announcement" });
        util.addEvent(mu_profile, "click", _self.showRightPanel);
        util.addEvent(mu_profile_in, "click", _self.closeRightPanel);
        //2019-04-08 Ricky 107.右側控端版-點擊控制版外任何部份   都會將右側控制版收起（待修企劃）
        //加了一層透明遮罩，點到透明遮罩就把右邊控制板收起來
        util.addEvent(dom.getElementById("rightMask"), "click", _self.closeRightPanel);
        util.addEvent(dom.getElementById("leftBigMask"), "click", _self.closeLeftPanel);
        util.addEvent(logOut, "click", _self.logOut);
        util.addEvent(pswdRec, "click", _self.checkEnable);
        util.addEvent(chgPswd, "click", _self.changePage, { "page": "chg_pwd_inside" });
        util.addEvent(contact, "click", _self.changePage, { "page": "contact" });
        util.addEvent(troubleshooting, "click", _self.dnsOpen);
        util.addEvent(new_url, "click", _self.changePage, { "page": "new_url" });
        util.addEvent(feature, "click", _self.changePage, { "page": "feature" });
        util.addEvent(requirements, "click", _self.changePage, { "page": "requirements" });
        util.addEvent(live_chat, "click", _self.liveChatOpen);
        util.addEvent(my_activities, "click", _self.changePage, { "page": "my_activities" });
        util.addEvent(quick_search, "click", _self.changePage, { "page": "quick_search" });
        util.addEvent(problem_accounts, "click", _self.changePage, { "page": "problem_accounts" });
        util.addEvent(choose_lan, "click", _self.choose_lan);

        var src = document.createElement("script");
        src.textContent = "window.lpTag=window.lpTag||{},'undefined'==typeof window.lpTag._tagCount?(window.lpTag={site:'9137304'||'',section:lpTag.section||'',tagletSection:lpTag.tagletSection||null,autoStart:lpTag.autoStart!==!1,ovr:lpTag.ovr||{},_v:'1.8.0',_tagCount:1,protocol:'https:',events:{bind:function(t,e,i){lpTag.defer(function(){lpTag.events.bind(t,e,i)},0)},trigger:function(t,e,i){lpTag.defer(function(){lpTag.events.trigger(t,e,i)},1)}},defer:function(t,e){0==e?(this._defB=this._defB||[],this._defB.push(t)):1==e?(this._defT=this._defT||[],this._defT.push(t)):(this._defL=this._defL||[],this._defL.push(t))},load:function(t,e,i){var n=this;setTimeout(function(){n._load(t,e,i)},0)},_load:function(t,e,i){var n=t;t||(n=this.protocol+'//'+(this.ovr&&this.ovr.domain?this.ovr.domain:'lptag.liveperson.net')+'/tag/tag.js?site='+this.site);var a=document.createElement('script');a.setAttribute('charset',e?e:'UTF-8'),i&&a.setAttribute('id',i),a.setAttribute('src',n),document.getElementsByTagName('head').item(0).appendChild(a)},init:function(){this._timing=this._timing||{},this._timing.start=(new Date).getTime();var t=this;window.attachEvent?window.attachEvent('onload',function(){t._domReady('domReady')}):(window.addEventListener('DOMContentLoaded',function(){t._domReady('contReady')},!1),window.addEventListener('load',function(){t._domReady('domReady')},!1)),'undefined'==typeof window._lptStop&&this.load()},start:function(){this.autoStart=!0},_domReady:function(t){this.isDom||(this.isDom=!0,this.events.trigger('LPT','DOM_READY',{t:t})),this._timing[t]=(new Date).getTime()},vars:lpTag.vars||[],dbs:lpTag.dbs||[],ctn:lpTag.ctn||[],sdes:lpTag.sdes||[],hooks:lpTag.hooks||[],ev:lpTag.ev||[]},lpTag.init()):window.lpTag._tagCount+=1;";
        (document.getElementsByTagName("head")[0] || document.body).appendChild(src);



        if (top.user_enable == "S") {
            wmc.style.display = "none";
        }
        if (top.user_type == "1" || pri_type.indexOf("B") != -1 ){
            util.addEvent(mySetting, "click", _self.changePage, { "page": "my_setting" });
        }else{
            mySetting.style.display = "none";
        }
        //判斷子帳號有哪些權限來隱藏header
        if(top.user_type == 2 || top.user_type == 3){
            if(pri_type.indexOf("A")==-1){ //即時注單
                wmc.style.display = "none";
                util.removeEvent(wmc, "click");
            }
            if (!pri_type.match(/B[0-9aA-zZ]/)){ //帳號管理
                //子帳號-當管理帳戶的三個權限，只有view only的權限時，problem accounts和quick search快速鍵應該要隱藏(PJP-578)
                quick_search.style.display = "none";
                util.removeEvent(quick_search, "click");

                problem_accounts.style.display = "none";
                util.removeEvent(problem_accounts, "click");
            }
            //if(pri_type.indexOf("C")==-1){ //報表

            //}
        }

        _self.connetToServer();
        _self.initAnnCookie();
        _self.setLayerDisplay();
        _self.createTimer();
    }

    //--------------創建計時器 start-----------------
    _self.createTimer = function () {
        timerHash["line"] = new Timer(config_set.get("ONLINE_MEM"));//30秒
        timerHash["line"].setParentclass(_self);
        timerHash["line"].dont_clear = true; //設定為不清除timer
        timerHash["line"].init();
        timerHash["line"].addEventListener("TimerEvent.TIMER", _self.timerRun);
        timerHash["line"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerComplete);
        timerHash["line"].startTimer();
    }
    //設定 定時做事
    _self.startTimer = function () {
        util.echo("dashboard startTimer");
        timerHash["line"].startTimer();
    }

    _self.stopTimer = function () {
        util.echo("dashboard stopTimer");
        timerHash["line"].stopTimer();
    }

    _self.clearTimer = function () {
        util.echo("dashboard clearTimer");
        timerHash["line"].clearObj();
    }

    _self.timerRun = function () {
        util.echo("DASHBOARD timer");
        _self.connetToServer();
    }

    _self.timerComplete = function () {
        util.echo("timerComplete"); //no complete
    }
    //--------------創建計時器 end-----------------

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        Cookie = parentClass.getThis("cookie");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash");
        topFrame = parentClass.getThis("topFrame");
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    //exit
    _self.exitEvent = function () {
        // util.echo("top exit");
        return true;
    }

    _self.backPage = function (e, param) {
        //parentClass.dispatchEvent("backPage", { "retFun": _self.backPageComplete, "back": "Y" });
        parentClass.dispatchEvent("backPage", { "retFun": _self.backPageComplete });
    }

    _self.backPageComplete = function () {
        // util.echo("backPageComplete");
    }

    _self.changePage = function (e, param) {
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "rightPanel" });
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
        if(param.page == "online_member")_self.connetToServer();
    }

    _self.checkEnable=function(e){
        var urlParams = "uid=" + top.uid;
        urlParams += "&action=init";
        urlParams += "&login_layer=" + top.login_layer;
        urlParams = "p=get_pwd_recovery&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("LoadComplete", _self.checkEnableComplete);
        getHTML.addEventListener("onError", _self.onError);
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.checkEnableComplete=function(data){
        arr_data = JSON.parse(data);
        var msg = arr_data["msg"];
        var code = arr_data["code"];
        if (msg == "error" && code=="4X025") {
            util.showErrorMsg(LS.get(code));
        }else{
            _self.changePage(null, {"page" : "pwd_recovery"});
        }
    }

    _self.changePageComplete = function () {
        // util.echo("changePageComplete");
    }

    _self.setPageName = function (param) {
        if (param.pageType) {
            dom.getElementById("page_menu").innerHTML = LS.get("page_" + param.pageType);
            dom.getElementById("page_menu").style.display = "";
        } else {
            dom.getElementById("page_menu").style.display = "none";
        }

        // menu 麵包屑
        if(param.url_hash!=null){
            dom.getElementById("menu_ul").style.display = "";
            dom.getElementById("page_name").style.display = "none";
            var hash = JSON.parse(param.url_hash);
            var layer = eval(top.login_layer+"_layer");
            var tmp = layer[hash["view_layer"]];

            var group_name = document.getElementsByName("menu_group_name");
            for (var i = 0, len = group_name.length ; i < len ; i++){
                var obj = group_name[i];
                var key = obj.id.split("_")[1];
                var _view = false;
                if (layer[key]){
                    if (layer[key] >= tmp) _view = true;
                    if (getView().viewportwidth <= 800 && layer[key] != tmp) _view = false;
                    if (_view) {
                        if(obj.classList.contains("hide_item")) obj.classList.remove("hide_item");
                        util.removeEvent(obj, "click", _self.changePage);
                        util.addEvent(obj, "click", _self.changePage, { "page": "acc_" + key +"_list" });
                    } else {
                        if(!obj.classList.contains("hide_item")) obj.classList.add("hide_item");
                        util.removeEvent(obj, "click", _self.changePage);
                    }
                }else{
                    if(!obj.classList.contains("hide_item")) obj.classList.add("hide_item");
                    util.removeEvent(obj, "click", _self.changePage);
                }
            }
        }else{
            dom.getElementById("menu_ul").style.display = "none";
            dom.getElementById("page_name").style.display = "";
            var _name = LS.get("page_" + param.pageName);
            if (!_name) _name = LS.get("page_dashboard");
            if (param.uniqText) _name = param.uniqText;
            dom.getElementById("page_name").innerHTML = _name;
        }
    }

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }

    // _self.showRightPanel = function () {
    //     _self.connetToServer();
    //     if (!RP_isShow) {
    //         RP_isShow = true;
    //         rightPanel.style.display = "";
    //         //user_code.innerHTML = top.username;
    //     } else {
    //         RP_isShow = false;
    //         rightPanel.style.display = "none";
    //     }

    // }

    _self.showRightPanel = function () {
        _self.connetToServer();
        rightPanel.className = "mu_memberDetailG mu_memberDetail_open";
        user_code.innerHTML = top.username;
        keepStyle.body_show = dom.getElementById("body_show").style;
        keepStyle.le_bigG = dom.getElementById("le_bigG").style;
        keepStyle.body = dom.body.style;
        dom.getElementById("body_show").setAttribute("style", "overflow-y:hidden;");
        dom.getElementById("le_bigG").setAttribute("style", "overflow-y:hidden;");
        dom.body.setAttribute("style", "position:fixed; overflow-y:hidden;");
    }

    _self.closeRightPanel = function () {
        // dom.getElementById("body_show").style = keepStyle.body_show;
        // dom.getElementById("le_bigG").style = keepStyle.le_bigG;
        // dom.body.style = keepStyle.body;
        dom.getElementById("body_show").removeAttribute("style");
        dom.getElementById("le_bigG").removeAttribute("style");
        dom.body.removeAttribute("style");
        rightPanel.className = "mu_memberDetailG";
    }

    _self.connetToServer = function () {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&layer_id=" + top.layer_id;
        urlParams += "&chk_mem=Y";
        urlParams = "p=get_online_mem&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.connectComplete = function (data) {
        try {
            var arr_data = JSON.parse(data);
            util.echo(arr_data);
            if (util.chkErrorMsg(arr_data, LS_code)) return;
            dom.getElementById("mem").innerHTML = arr_data["mem"]["COUNT"]==0 ? "" : arr_data["mem"]["COUNT"];
            var li = dom.getElementById("dynamic_block").innerHTML;
            var li_small = dom.getElementById("dynamic_block_small").innerHTML;
            var onlines = "";
            var onlines_small = "";
            for(var layer in arr_data){
                var ts = arr_data[layer];
                if(layer == "mem" ){
                    if(ts["HIDDEN"]=="Y") {
                        dom.getElementById("onlinemem").style.display = "none";
                        var online = li.replace(new RegExp("\\\*NAME\\\*", "gi"), ts["NAME"]);
                        online = online.replace(new RegExp("\\\*COUNT\\\*", "gi"), ts["COUNT"]);
                        online = online.replace(new RegExp("\\\*LAYER\\\*", "gi"), ts["LAYER"]);
                        onlines += online;

                        var online_small = li_small.replace(new RegExp("\\\*NAME\\\*","gi"),ts["NAME"]);
                        online_small = online_small.replace(new RegExp("\\\*COUNT\\\*","gi"),ts["COUNT"]);
                        online_small = online_small.replace(new RegExp("\\\*LAYER\\\*","gi"),ts["LAYER"]);
                        onlines_small+=online_small;
                    }else{
                        dom.getElementById("onlinemem").style.display = "";
                        util.addEvent(dom.getElementById("onlineMem"), "click", _self.changePage, { "page": "online_member" });
                    }
                }else{
                    var online = li.replace(new RegExp("\\\*NAME\\\*", "gi"), ts["NAME"]);
                    online = online.replace(new RegExp("\\\*COUNT\\\*", "gi"), ts["COUNT"]);
                    online = online.replace(new RegExp("\\\*LAYER\\\*", "gi"), ts["LAYER"]);
                    onlines += online;

                    var online_small = li_small.replace(new RegExp("\\\*NAME\\\*","gi"),ts["NAME"]);
                    online_small = online_small.replace(new RegExp("\\\*COUNT\\\*","gi"),ts["COUNT"]);
                    online_small = online_small.replace(new RegExp("\\\*LAYER\\\*","gi"),ts["LAYER"]);
                    onlines_small+=online_small;
                }
            }
            dom.getElementById("onlines").innerHTML = onlines;
            dom.getElementById("onlines_small").innerHTML = onlines_small;
            for(var layer in arr_data) {
                var ts = arr_data[layer];
                var page = "online_"+ts["LAYER"];
                if(layer=="mem"){page = "online_member";}
                util.addEvent(dom.getElementById("online_"+ts["LAYER"]), "click", _self.changePage, {"page": page});
                util.addEvent(dom.getElementById("online_small_"+ts["LAYER"]), "click", _self.changePage, {"page": page});

            }
        } catch (e) {
                dom.getElementById("mem").innerHTML = "";
                util.echo(e);
        }

    }
    //檢查資料是否需要亮燈
    _self.AnnComplete = function (data) {
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
        } catch (e) {
            util.echo(e);
        }
        _self.initAnnCookie();
        _self.setAccRingAlert(arr_data["count"], CookieImp, CookieGen);
    }
    //上方鈴鐺亮燈
    _self.setAccRingAlert = function(countStr,I,G){    //重要訊息 與 個人訊息 必須與 上方鈴鐺變數分開，不然會有前後存取變數問題
        var chkLight = "remove";
        var numAry = countStr.split("|");
        if (numAry[0] > I) chkLight = "";
        if (numAry[1] > G) chkLight = "";
        util.classFunc(dom.getElementById("mu_announcement"), "mu_dot", chkLight);
    }

    //檢查資料是否需要亮燈
    _self.ProAccComplete = function (data) {
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
        } catch (e) {
            util.echo(e);
        }
        _self.setProRingAlert(arr_data["count"]);
        _self.setAccCookie(arr_data["ncr"]);
    }
    //上方鈴鐺亮燈
    _self.setProRingAlert = function (countStr) {    //重要訊息 與 個人訊息 必須與 上方鈴鐺變數分開，不然會有前後存取變數問題
        var chkLight = "remove";
        if (countStr * 1 > 0) chkLight = "";
        util.classFunc(dom.getElementById("mu_problem"), "mu_dot", chkLight);
    }
    //設置cookie
    _self.initAnnCookie = function () {
        CookieKey = top.annCookie;
        var key = Cookie.get(CookieKey);
        if (key == undefined) {
            CookieImp = 1;
            CookieGen = 1;
        } else {
            var keyAry = key.split("|");
            CookieImp = /^[1-9][0-9]{0,}$/.test(keyAry[0] * 1) ? keyAry[0] : 1;
            CookieGen = /^[1-9][0-9]{0,}$/.test(keyAry[1] * 1) ? keyAry[1] : 1;
        }
    }
    //設置cookie
    _self.setAccCookie = function(param){
        var Str = "ag_" + top.login_layer + "_" + top.layer_id;
        for (var i in param){
            var CookieKey = Str + "_" + i;
            Cookie.set(CookieKey, param[i], 30);
        }
    }

    _self.onError = function () {
        memCount.innerHTML = "0";
        util.echo("onError");
    }

    _self.showLeftPanel = function () {
        if (top.mu_isOpen == "close") {
            //mu_isOpen = true;
            top.mu_isOpen = "open";
            parentClass.dispatchEvent("openLeftMenu", { "retFun": _self.showComplete });
        } else {
            //mu_isOpen = false;
            top.mu_isOpen = "close";
            parentClass.dispatchEvent("closeLeftMenu", { "retFun": _self.showComplete });
        }

    }

    _self.closeLeftPanel = function () {
        top.mu_isOpen = "close";
        parentClass.dispatchEvent("closeLeftMenu", { "retFun": _self.showComplete });
    }

    _self.logOut = function (e, param) {
        var urlParams= "";
        urlParams += "uid="+top.uid;
        urlParams += "&langx="+top.langx;
        urlParams += "&login_layer="+top.login_layer;
        urlParams = "p=get_out&ver="+top.ver+"&"+urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", function(){
            util.goToIndex();
        });
        getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.logOutComplete = function () {
        util.echo("logOutComplete");
    }

    _self.showComplete = function () {
        util.echo("showComplete");
    }

    _self.closebackBtn = function () {
        back.style.display = "none";
    }

    _self.openbackBtn = function () {
        back.style.display = "";
    }
    //故障排除
    _self.dnsOpen = function () {
        var path = "/tpl/" + top.langx + "/index.html";
        window.open(path, "dns", config = 'height=650,width=900');
    }
    //在線客服
    _self.liveChatOpen = function () {
        document.getElementsByClassName("LPMcontainer")[1].click();
        //var path = "https://lpcdn.lpsnmedia.net/le_unified_window/index.html?lpUnifiedWindowConfig=%7B%22accountId%22%3A%229137304%22%2C%22env%22%3A%22prod%22%2C%22clickedChannel%22%3A%22-lpuw-chat%22%2C%22external%22%3Atrue%2C%22supportBlockCCPattern%22%3Afalse%2C%22scp%22%3A%22uw%22%2C%22secureStorageType%22%3A%22indexedDB%22%2C%22engConf%22%3A%7B%22async%22%3Afalse%2C%22scid%22%3A%221%22%2C%22cid%22%3A491517112%2C%22eid%22%3A491517512%2C%22lang%22%3A%22zh-CN%22%2C%22svid%22%3A%22E0ZTEzOGVhZDVkMmYxZDFi%22%2C%22ssid%22%3A%22Il-CKUUqQCmE8J0qV0xEqA%22%2C%22lewid%22%3A491517412%2C%22allowUnauthMsg%22%3Afalse%2C%22availabilityPolicy%22%3A0%7D%7D";
        //window.open(path, "dns", config = 'height=400,width=475');
    }

    //語系選擇
    _self.choose_lan = function () {
        _self.closeRightPanel();
        parentClass.dispatchEvent("chooseLan", {});
    }

    _self.chg_lan_str = function (param) {
        var tmpAry = new Object();
        tmpAry["zh-cn"] = "简体";
        tmpAry["zh-tw"] = "繁體";
        tmpAry["en-us"] = "English";
        dom.getElementById("choose_lan_str").innerHTML = tmpAry[param.lang];
    }

    _self.setLayerDisplay = function(){
        if (top.login_layer != "co") problem_accounts.style.display = "none";
    }

    _self.onKeyBoardOpen = function (value) {
        if (value) dom.getElementById("mu_btn").className = "mu_btnG keyboard";
        else dom.getElementById("mu_btn").className = "mu_btnG";
    }

    _self.wmcOpen = function(){
        var obj = new Object();
        obj.filename = "app/wmc/index.php";
        obj.title = "_blank";
        parentClass.dispatchEvent("newOpenPageNoPar", obj);
    }
}