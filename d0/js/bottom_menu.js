function bottom_menu(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var Cookie;
    var CookieKey;
    var CookieImp;
    var CookieGen;

    var bm_problem_li;
    var bm_announcement_li;
    var bm_wmc;

    _self.init=function(){
        util.echo("bottome load complete");

        bm_problem_li = dom.getElementById("bm_problem_li");
        bm_announcement_li = dom.getElementById("bm_announcement_li");
        bm_live_chat = dom.getElementById("bm_live_chat");
        bm_quick_search = dom.getElementById("bm_quick_search");
        bm_wmc = dom.getElementById("bm_wmc");

        util.addEvent(bm_problem_li, "click", _self.changePage, { "page": "problem_accounts" });
        util.addEvent(bm_announcement_li, "click", _self.changePage, { "page": "announcement" });
        util.addEvent(bm_quick_search, "click", _self.changePage, { "page": "quick_search" });
        util.addEvent(bm_live_chat, "click", _self.liveChatOpen);
        util.addEvent(bm_wmc, "click", _self.wmcOpen);
        _self.setLayerDisplay();

        var src = document.createElement("script");
        src.textContent = "window.lpTag=window.lpTag||{},'undefined'==typeof window.lpTag._tagCount?(window.lpTag={site:'9137304'||'',section:lpTag.section||'',tagletSection:lpTag.tagletSection||null,autoStart:lpTag.autoStart!==!1,ovr:lpTag.ovr||{},_v:'1.8.0',_tagCount:1,protocol:'https:',events:{bind:function(t,e,i){lpTag.defer(function(){lpTag.events.bind(t,e,i)},0)},trigger:function(t,e,i){lpTag.defer(function(){lpTag.events.trigger(t,e,i)},1)}},defer:function(t,e){0==e?(this._defB=this._defB||[],this._defB.push(t)):1==e?(this._defT=this._defT||[],this._defT.push(t)):(this._defL=this._defL||[],this._defL.push(t))},load:function(t,e,i){var n=this;setTimeout(function(){n._load(t,e,i)},0)},_load:function(t,e,i){var n=t;t||(n=this.protocol+'//'+(this.ovr&&this.ovr.domain?this.ovr.domain:'lptag.liveperson.net')+'/tag/tag.js?site='+this.site);var a=document.createElement('script');a.setAttribute('charset',e?e:'UTF-8'),i&&a.setAttribute('id',i),a.setAttribute('src',n),document.getElementsByTagName('head').item(0).appendChild(a)},init:function(){this._timing=this._timing||{},this._timing.start=(new Date).getTime();var t=this;window.attachEvent?window.attachEvent('onload',function(){t._domReady('domReady')}):(window.addEventListener('DOMContentLoaded',function(){t._domReady('contReady')},!1),window.addEventListener('load',function(){t._domReady('domReady')},!1)),'undefined'==typeof window._lptStop&&this.load()},start:function(){this.autoStart=!0},_domReady:function(t){this.isDom||(this.isDom=!0,this.events.trigger('LPT','DOM_READY',{t:t})),this._timing[t]=(new Date).getTime()},vars:lpTag.vars||[],dbs:lpTag.dbs||[],ctn:lpTag.ctn||[],sdes:lpTag.sdes||[],hooks:lpTag.hooks||[],ev:lpTag.ev||[]},lpTag.init()):window.lpTag._tagCount+=1;";
        (document.getElementsByTagName("head")[0] || document.body).appendChild(src);

        if (top.user_enable == "S") {
            bm_wmc.style.display = "none";
        }

        //判斷子帳號有哪些權限來隱藏header
        if(top.user_type == 2 || top.user_type == 3){
            if(pri_type.indexOf("A")==-1){ //即時注單
                bm_wmc.style.display = "none";
                util.removeEvent(bm_wmc, "click");
            }
            if (!pri_type.match(/B[0-9aA-zZ]/)) { //帳號管理
                //子帳號-當管理帳戶的三個權限，只有view only的權限時，problem accounts和quick search快速鍵應該要隱藏(PJP-578)
                bm_quick_search.style.display = "none";
                util.removeEvent(bm_quick_search, "click");

                bm_problem_li.style.display = "none";
                util.removeEvent(bm_problem_li, "click");
            }
            //if(pri_type.indexOf("C")==-1){ //報表

            //}
        }
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        Cookie = parentClass.getThis("cookie");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.changePage = function (e, param) {
        top.mu_isOpen = "close";
        parentClass.dispatchEvent("closeLeftMenu",{});
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.changePageComplete = function () {
        // util.echo("changePageComplete");
    }
    //在線客服
    _self.liveChatOpen = function () {
        document.getElementsByClassName("LPMcontainer")[1].click();
        //var path = "https://lpcdn.lpsnmedia.net/le_unified_window/index.html?lpUnifiedWindowConfig=%7B%22accountId%22%3A%229137304%22%2C%22env%22%3A%22prod%22%2C%22clickedChannel%22%3A%22-lpuw-chat%22%2C%22external%22%3Atrue%2C%22supportBlockCCPattern%22%3Afalse%2C%22scp%22%3A%22uw%22%2C%22secureStorageType%22%3A%22indexedDB%22%2C%22engConf%22%3A%7B%22async%22%3Afalse%2C%22scid%22%3A%221%22%2C%22cid%22%3A491517112%2C%22eid%22%3A491517512%2C%22lang%22%3A%22zh-CN%22%2C%22svid%22%3A%22E0ZTEzOGVhZDVkMmYxZDFi%22%2C%22ssid%22%3A%22Il-CKUUqQCmE8J0qV0xEqA%22%2C%22lewid%22%3A491517412%2C%22allowUnauthMsg%22%3Afalse%2C%22availabilityPolicy%22%3A0%7D%7D";
        //window.open(path, "dns", config = 'height=400,width=475');
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
        _self.setAccRingAlert(arr_data["count"], CookieImp, CookieGen);
    }
    //上方鈴鐺亮燈
    _self.setAccRingAlert = function (countStr, I, G) {    //重要訊息 與 個人訊息 必須與 上方鈴鐺變數分開，不然會有前後存取變數問題
        var chkLight = "remove";
        var numAry = countStr.split("|");
        if (numAry[0] > I) chkLight = "";
        if (numAry[1] > G) chkLight = "";
        util.classFunc(bm_announcement_i, "mu_dot", chkLight);
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
    }
    //上方鈴鐺亮燈
    _self.setProRingAlert = function (countStr) {    //重要訊息 與 個人訊息 必須與 上方鈴鐺變數分開，不然會有前後存取變數問題
        var chkLight = "remove";
        if (countStr * 1 > 0) chkLight = "";
        util.classFunc(dom.getElementById("bm_problem_i"), "mu_dot", chkLight);
    }

    _self.setLayerDisplay = function () {
        if (top.login_layer != "co") bm_problem_li.style.display = "none";
    }

    _self.wmcOpen = function(){
        var obj = new Object();
        obj.filename = "app/wmc/index.php";
        obj.title = "_blank";
        parentClass.dispatchEvent("newOpenPageNoPar", obj);
    }
}