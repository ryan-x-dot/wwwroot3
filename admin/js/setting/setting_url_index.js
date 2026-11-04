function setting_url_index(_win, _dom, _toppar){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "setting_url_index";
    var util;
    var LS;
    var config_set;
    var Timer;
    var LS_code;
    var _mc = new Object();
    var eventHandler = new Object();
    var toppar = _toppar;

    var bodyFrame = null;
    var paramObj;
    var parentClass;
    var _myTop;

    var par = new Object();


    var ret_xmp = ["764_up","764_down"];  //選用框架 //改兩邊做
    var ret_xmp_big = "764_up";    	//改兩邊做
    var ret_xmp_small = "764_down";		//改兩邊做
    var storage;
    var data_filter;
    var sCount = 0;
    var bCount = 0;



    _self.init=function(){
        //console.log(myDate.toLocaleDateString().replace(/\//g,'-'));
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        parentClass.dispatchEvent("chgPageName", {"pageType": "setting", "pageName": "curl"});
        parentClass.dispatchEvent("chgLeftMenuColor", {"target": "setting"});
        _top.popWindow = new Object();
        getView = parentClass.getThis("getView");
        view_w = getView().viewportwidth;//螢幕畫面大小
        if (toppar["setting_showtype"] == null) {
            toppar["setting_showtype"] = top.setting_showtype;
        } else {
            top.setting_showtype = toppar["setting_showtype"];
        }
        _self.loadData();
        util.addEvent(dom.getElementById("btn_new"), "click", _self.newEvent);
        util.addEvent(dom.getElementById("btn_save"), "click", _self.saveEvent,{showtype:"big"});

        util.addEvent(dom.getElementById("btn_new_small"), "click", _self.newSmallEvent);
        util.addEvent(dom.getElementById("btn_save_small"), "click", _self.saveEvent,{showtype:"small"});

        parentClass.dispatchEvent("showLoading", {"showLoading":false});

    }


    _self.saveEvent = function (mouseEvent,param){
        var showHtml = dom.getElementById("764_up_wager_show");
        if(param.showtype == "small"){
            showHtml = dom.getElementById("764_down_wager_show");
        }

        var k = showHtml.rows.length;
        var paramHash = new Object();
        var isOK = "N";
        for(var i=0;i<k;i++){
            var tr = showHtml.rows[i];
            var url = tr.querySelectorAll('input[id^="url_"]')[0].value;
            if(url!=""){
                paramHash[i] = {url:url};
                isOK = "Y";
            }
        }

        if(isOK == "Y"){
            var par = "";
            par += "login_layer=" + top.login_layer;
            par += "&uid=" + top.uid;
            par += "&type="+toppar["setting_showtype"];
            var param = "p=body_setting_curl_add&ver=" + top.ver + "&" + par+"&ary="+JSON.stringify(paramHash);
            var getHttp = new HttpRequest();
            getHttp.addEventListener("onError", _self.onError);
            getHttp.addEventListener("LoadComplete", _self.saveFinish);
            getHttp.loadURL(top.url, "POST", param);
        }

    }

    _self.saveFinish  = function (json){
        var hash;
        try {
            hash = JSON.parse(json);
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }

        if (hash.status == "error") {
            var error_msg = util.showTxt(hash.msg);
            util.chkErrorMsg(hash, error_msg);
        } else {
            //2019-04-09 Ricky 150.新增帳號-成功創建新帳戶後，將會顯示7秒的短暫訊息“成功新增帳戶。現在大概只有2秒，且應有copy的字眼可以複製帳密，現在訊息account successfully created，應該是New Account Created
            //parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_account_success")});
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("page_edit_ok") ,"s":5});
            _self.loadData();
        }
    }

    _self.newSmallEvent = function () {
        var show_small = dom.getElementById("764_down_wager_show").innerHTML;
        show_small = show_small.replace("<tbody>","");
        show_small = show_small.replace("</tbody>","");

        var str_small = dom.getElementById("xmp_764_down_wagers_content").innerHTML;
        var i = 0;
        i = sCount+1;
        sCount = i;
        str_small = str_small.replace(new RegExp("\\\*ID\\\*", "gi"), i);
        str_small = str_small.replace(new RegExp("\\\*URL\\\*", "gi"), "");
        str_small = str_small.replace(new RegExp("\\\*STATUS\\\*", "gi"), "ok");
        str_small = str_small.replace(new RegExp("\\\*MS\\\*", "gi"), "0");
        str_small = str_small.replace(new RegExp("\\\*DID\\\*", "gi"), "0");
        show_small+= str_small;
        dom.getElementById("764_down_wager_show").innerHTML = show_small;
        _self.btnDeleteClick();
    }

    _self.newEvent = function () {
        var show_big = dom.getElementById("764_up_wager_show").innerHTML;
        show_big = show_big.replace("<tbody>","");
        show_big = show_big.replace("</tbody>","");

        var str = dom.getElementById("xmp_764_up_wagers_content").innerHTML;
        var i = 0;
        i = bCount+1;
        bCount = i;
        str = str.replace(new RegExp("\\\*ID\\\*", "gi"), i);
        str = str.replace(new RegExp("\\\*URL\\\*", "gi"), "");
        str = str.replace(new RegExp("\\\*STATUS\\\*", "gi"), "ok");
        str = str.replace(new RegExp("\\\*MS\\\*", "gi"), "0");
        str = str.replace(new RegExp("\\\*DID\\\*", "gi"), "0");
        show_big+=str;
        dom.getElementById("764_up_wager_show").innerHTML = show_big;
        _self.btnDeleteClick();
    }

    _self.btnDeleteClick = function (){
        var big = dom.getElementById("764_up_wager_show");
        var small = dom.getElementById("764_down_wager_show");
        var dis = big.querySelectorAll('span[id^="btn_delete_"]');
        var dis_small = small.querySelectorAll('span[id^="btn_small_delete_"]');

        var yys = big.querySelectorAll('div[id^="bet_yy_"]');
        var yys_small = big.querySelectorAll('div[id^="bet_yy_small_"]');

        for(var k in yys){
            if(typeof(yys[k])=="object"){
                var id = yys[k].getAttribute("id").replace("bet_yy_","");
                var url = dom.getElementById("url_"+id).value;
                util.addEvent(yys[k], "click", _self.setUrlEvent, {url:url});
            }
        }

        for(var k in yys_small){
            if(typeof(yys_small[k])=="object"){
                var id = yys_small[k].getAttribute("id").replace("bet_yy_small_","");
                var url = dom.getElementById("url_small_"+id).value;
                util.addEvent(yys_small[k], "click", _self.setUrlEvent, {url:url});
            }
        }


        for(var k in dis){
            if(typeof(dis[k])=="object"){
                util.addEvent(dis[k], "click", _self.delEvent, {
                    id:dis[k].getAttribute("id"),
                    type:"big"
                });
            }
        }

        for(var k in dis_small){
            if(typeof(dis_small[k])=="object") {
                util.addEvent(dis_small[k], "click", _self.delEvent, {
                    id: dis_small[k].getAttribute("id"),
                    type: "small"
                });
            }
        }


    }

    _self.setUrlEvent = function(mouseEvent,param){
        if(param.url && param.url!=""){
            if(confirm("确认要所有采集都使用["+param.url+"]吗？") == true){
                var par = "";
                par += "login_layer=" + top.login_layer;
                par += "&uid=" + top.uid;
                par += "&type=SET_CURL_URL";
                var param = "p=body_setting_curl_add&ver=" + top.ver + "&" + par+"&url="+param.url;
                var getHttp = new HttpRequest();
                getHttp.addEventListener("onError", _self.onError);
                getHttp.addEventListener("LoadComplete", function (json){
                    var hash;
                    try {
                        hash = JSON.parse(json);
                    } catch (e) {
                        util.err("[" + classname + "]", e);
                        return;
                    }

                    if (hash.status == "error") {
                        var error_msg = util.showTxt(hash.msg);
                        util.chkErrorMsg(hash, error_msg);
                    } else {
                        parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("page_edit_ok") ,"s":5});
                    }
                });
                getHttp.loadURL(top.url, "POST", param);
            }
        }

        //var trIndex = tr.rowIndex;
        //tbody.deleteRow(trIndex);
    }

    _self.delEvent = function (mouseEvent,param){
        var obj = dom.getElementById(param.id);
        //通过this找到父级元素节点
        if(param.type == "big") {
            var tr = obj.parentNode.parentNode;

        }else{
            var tr = obj.parentNode.parentNode.parentNode.parentNode;
        }
        //找到表格
        var tbody = tr.parentNode;
        var did = obj.getAttribute("did");
        if(did>0){
            if(confirm("删除之后不能恢复，你确定删除吗？") == true){

                var par = "";
                par += "login_layer=" + top.login_layer;
                par += "&uid=" + top.uid;
                par += "&type=DEL_URL";
                var param = "p=body_setting_curl_add&ver=" + top.ver + "&" + par+"&id="+did;
                var getHttp = new HttpRequest();
                getHttp.addEventListener("onError", _self.onError);
                getHttp.addEventListener("LoadComplete", function (json){
                    var hash;
                    try {
                        hash = JSON.parse(json);
                    } catch (e) {
                        util.err("[" + classname + "]", e);
                        return;
                    }

                    if (hash.status == "error") {
                        var error_msg = util.showTxt(hash.msg);
                        util.chkErrorMsg(hash, error_msg);
                    } else {
                        tbody.removeChild(tr);
                        //2019-04-09 Ricky 150.新增帳號-成功創建新帳戶後，將會顯示7秒的短暫訊息“成功新增帳戶。現在大概只有2秒，且應有copy的字眼可以複製帳密，現在訊息account successfully created，應該是New Account Created
                        //parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_account_success")});
                        parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("dele_success") ,"s":5});
                    }
                });
                getHttp.loadURL(top.url, "POST", param);
            }
        }else{
            //删除行
            tbody.removeChild(tr);
        }

        //var trIndex = tr.rowIndex;
        //tbody.deleteRow(trIndex);
    }

    _self.setParentclass = function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        Cookie = parentClass.getThis("cookie");
        config_set = parentClass.getThis("config_set");
        _top = parentClass.getThis("top");
        timerHash = parentClass.getThis("timerHash");
        bodyFrame = parentClass.getThis("bodyFrame");
        storage = parentClass.getThis("Storage");
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
        _top["remenberflg_bet"] = _set["remenberflg"];
        _top["filter_bet"]= filterUse;
        _self.backOpenerTop("remenberflg_bet");
        _self.backOpenerTop("filter_bet");
    }



    //load data
    _self.loadData=function(){
        // console.log("[loadData]");
        // _self.initMySet();
        _self.reloadData();
    }

    _self.reloadData=function(){
        var par = "";
        par+=top.param;
        par+="&p=get_setting_curl";
        par+="&showtype="+toppar["setting_showtype"];

        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadFinish);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.onError = function(){
        // console.log("[Error]");
        //dom.getElementById("err404").style.display = "";
    }

    _self.getParam=function(){
        var par = "";
        par += "uid="+_top["userData"].uid;
        par += "&login_layer="+top.login_layer;
        par += "&gtype="+_set["gtype"];
        par += "&result="+_set["result"];
        par += "&sel_maxid="+_set["sel_maxid"];
        return par;
    }

    //load finish
    _self.loadFinish=function(json){
        // console.log(json);
        var hash;
        try {
            hash = JSON.parse(json);
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }
        var show_big = dom.getElementById("764_up_wager_show");
        var show_small = dom.getElementById("764_down_wager_show");
        var big = dom.getElementById("xmp_764_up_wagers_content").innerHTML;
        var small = dom.getElementById("xmp_764_down_wagers_content").innerHTML;
        var html = "";
        var html_small = "";

        var k = 0;
        for(var i in hash){
            k++;
            var d = hash[i];
            var str = big;
            var str_small = small;
            str = str.replace(new RegExp("\\\*ID\\\*", "gi"), i);
            str = str.replace(new RegExp("\\\*URL\\\*", "gi"), d["url"]);
            str = str.replace(new RegExp("\\\*STATUS\\\*", "gi"), d["status"]);
            str = str.replace(new RegExp("\\\*MS\\\*", "gi"), d["ms"]);
            str = str.replace(new RegExp("\\\*DID\\\*", "gi"), d["id"]);

            str_small = str_small.replace(new RegExp("\\\*ID\\\*", "gi"), i);
            str_small = str_small.replace(new RegExp("\\\*URL\\\*", "gi"), d["url"]);
            str_small = str_small.replace(new RegExp("\\\*STATUS\\\*", "gi"), d["status"]);
            str_small = str_small.replace(new RegExp("\\\*MS\\\*", "gi"), d["ms"]);
            str_small = str_small.replace(new RegExp("\\\*DID\\\*", "gi"), d["id"]);

            html+= str;
            html_small+= str_small;
        }
        show_big.innerHTML = html;
        show_small.innerHTML = html_small;
        bCount = k;
        sCount = k;
        _self.btnDeleteClick();
        _self.initScroll();

        return;
    }



    _self.loadFilterFinish = function(json){
        // console.log(json);
        var hash;
        try {
            hash = JSON.parse(json);
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }
        data_filter = hash;
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
//=====



    //=============---------=------------fix
    _self.initScroll = function () {
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollVerEvent, dom.getElementById("bet_body"));
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
