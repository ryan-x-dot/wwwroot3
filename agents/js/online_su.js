function online_su(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var fastTemplate_a1;
    var eventHandler = new Object();
    var topFrame = new Object();
    var layer = "su";
    var searchObj = {}; //搜尋依據物件

    var onlineMem_count;
    var config_set;
    var Timer;
    var timerHash;


    _self.init=function(){
        util.echo("online member complete");
        parentClass.dispatchEvent("chgPageName", { "pageName": "onlinesu" });
        _self.createTimer();
        _self.connetToServer();
        parentClass.dispatchEvent("showLoading", {"showLoading":false});
        topFrame.closeRightPanel();
    }

    //所有input事件
    _self.onInputEventHandler = function (evt, param) {
        var DOM = evt.target;
        if (param.target == "search_text") {  //手機與電腦 輸入時 一起同步
            param.t1.value = DOM.value;
        }
    }
    //取消事件
    _self.onBlurEventHandler = function (evt, param){
        
    }
    //所有點擊事件
    _self.onClickEventHandler = function(evt,param){
        var DOM = evt.target;
        if (param.target == "search_send"){
            if (evt.type=="click"){
                searchObj["search"] = param.s1.value;
                _self.connetToServer();
            } else if (evt.type =="keypress"){
                var keyCode = util.getKeyCode(evt);
                if (keyCode == 13){
                    searchObj["search"] = param.s1.value;
                    _self.connetToServer();
                }
            }
        }
        else if (param.target == "search_clear"){   //清空訊息
            param.c1.value = "";
            param.c2.value = "";
            searchObj["search"] = "";
            _self.connetToServer();
        }
        else if (param.target == "phone"){
            param.big.style.display = "none";
            param.small.style.display = "";
        }
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        fastTemplate_a1 = parentClass.getThis("fastTemplate_a1");
        topFrame = parentClass.getThis("topFrame");
        config_set = parentClass.getThis("config_set");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash");
    }

    _self.connetToServer=function(){
        var urlParams = "";
        urlParams += "uid="+top.uid;
        urlParams += "&login_layer="+top.login_layer;
        urlParams += "&layer_id="+top.layer_id;
        urlParams += "&chk_mem=N";
        urlParams += "&layer="+layer;
        if(searchObj.hasOwnProperty("search")){
            urlParams += "&search="+searchObj["search"];
        }
        urlParams = "p=get_online_mem&ver="+top.ver+"&"+urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.connectComplete=function(data){
        try{
            util.echo(data);
            var arr_data = JSON.parse(data);
            util.echo(arr_data);
            if (util.chkErrorMsg(arr_data, LS_code)) return;
            var div;
            //目前沒有在線會員
            if(arr_data["msg"] == "nodata"){
                dom.getElementById("div_show").style.display = "none";
                dom.getElementById("div_show_nodata").style.display = "";
                div = dom.getElementById("div_show_nodata");
                _self.searchClick(div);
                _self.startTimer();
            }
            else {
                dom.getElementById("div_show").style.display = "";
                dom.getElementById("div_show_nodata").style.display = "none";
                _self.parseData(arr_data);
            }


        }catch(e){
            util.echo(e);
        }

    }

    _self.searchClick = function (div){
        var obj_ids = ",sear_big_text,sear_big_send,sear_big_clear,sear_small_text,sear_small_send,sear_small_clear,sear_small_btn,sear_big_view,sear_small_view,";
        var _ary = util.getObjAry(div, obj_ids);
        util.addEvent(_ary["sear_small_btn"], "click", _self.onClickEventHandler, { "target": "phone","big":_ary["sear_big_view"],"small":_ary["sear_small_view"]});
        util.addEvent(_ary["sear_big_send"], "click", _self.onClickEventHandler, { "target": "search_send", "s1": _ary["sear_big_text"]});
        util.addEvent(_ary["sear_big_clear"], "click", _self.onClickEventHandler, { "target": "search_clear", "c1": _ary["sear_big_text"],"c2":_ary["sear_small_text"]});
        util.addEvent(_ary["sear_small_send"], "click", _self.onClickEventHandler, { "target": "search_send", "s1": _ary["sear_small_text"]});
        util.addEvent(_ary["sear_small_clear"], "click", _self.onClickEventHandler, { "target": "search_clear", "c1": _ary["sear_big_text"],"c2":_ary["sear_small_text"]});
        util.addEvent(_ary["sear_big_text"], "input", _self.onInputEventHandler, { "target": "search_text", "t1": _ary["sear_small_text"]});
        util.addEvent(_ary["sear_big_text"], "keypress", _self.onClickEventHandler, { "target": "search_send", "s1": _ary["sear_big_text"] });
        util.addEvent(_ary["sear_small_text"], "input", _self.onInputEventHandler, { "target": "search_text", "t1": _ary["sear_big_text"]});
        util.addEvent(_ary["sear_small_text"], "blur", _self.onBlurEventHandler, { "target": "blur", "b1": _ary["sear_small_text"]});
        if(searchObj.hasOwnProperty("search")){
            _ary["sear_small_text"].value = _ary["sear_big_text"].value = searchObj["search"];
        }
    }

    _self.onError=function(){
        util.echo("onError");
    }

    _self.parseData = function (hash) {

        onlineMem_count = hash.length;
        dom.getElementById("memCnt").innerHTML = onlineMem_count;

        var div_model = dom.getElementById("div_model");
        var tpl = new fastTemplate_a1();
        tpl.init(div_model.cloneNode(true));

        var memAry = new Array("memcount","username","ip","time","content","id");
        for(var i=0; i<hash.length; i++){
            tpl.addBlock("onlineM");
            for(var a=0; a<memAry.length; a++){
                var keys = memAry[a];
                if(keys == "ip" && hash[i]["ip"]!=null){
                    var str = '<a href="http://www.ip38.com/ip.php?ip='+hash[i][keys]+'" target="_blank" title="点击查看IP归属地">'+hash[i][keys]+'</a>';
                    tpl.replace(new RegExp("\\\*"+keys+"\\\*","gi"),str);
                }else{
                    tpl.replace(new RegExp("\\\*"+keys+"\\\*","gi"),hash[i][keys]);
                }
                var str = '<tt id="btn_sp" class="word_blue hand" title="点击查看更多记录">更多</tt>';
                tpl.replace(new RegExp("\\\*BTNMORE\\\*","gi"),str);
                var str_small = '<tt id="btn_sp_small" class="word_blue hand" title="点击查看更多记录">更多</tt>';
                tpl.replace(new RegExp("\\\*BTNMORESMALL\\\*","gi"),str_small);
            }
        }
        util.echo(onlineMem_count);
        dom.getElementById("div_show").innerHTML = tpl.fastPrint();
        var div = dom.getElementById("div_show");
        _self.searchClick(div);
        _self.initEvent(hash, div);
        _self.startTimer();
    }

    //init event
    _self.initEvent = function (ArrObj, div_show) {
        for (var i = 0; i < ArrObj.length; i++) {
            //下層資料
            var obj = util.clone(ArrObj[i]);
            var div = dom.getElementById("tr_" + obj["id"]);
            var obj_ids = ",btn_out,btn_sp,btn_out_small,btn_sp_small,";
            var _ary = util.getObjAry(div, obj_ids);

            if (!(top.user_type != "1" && top.pri_type.indexOf("B1") == -1)){
                util.addEvent(_ary["btn_out"], "click", _self.outEvent, obj);
                util.addEvent(_ary["btn_small_out"], "click", _self.outEvent, obj);
                util.addEvent(_ary["btn_sp"], "click", _self.spOpen, obj);
                util.addEvent(_ary["btn_small_sp"], "click", _self.spOpen, obj);
            }
        }
    }

    _self.spOpen = function(mouseEvent, _param){
        var obj = new Object();
        obj.filename = "app/record/index.php";
        obj.title = "_blank";
        top.view_user = _param["username"];
        top.view_id = _param["id"];
        top.view_layer = layer;
        parentClass.dispatchEvent("newOpenPageNoPar", obj,);
    }

    _self.outEvent = function (mouseEvent, _param) {
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.outStatus);
        var param = _self.getBaseParam() + "&keys=out" + "&id=" + _param.id + "&username="+_param.username+"&layer="+layer;
        param = "p=prevData&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.getBaseParam = function () {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&langx="+top.langx;
        return par;
    }

    _self.outStatus = function (data){
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        if (_status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg != null && error_msg != "") {
                _self.show_Error(error_code, error_msg, arr_data);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
        } else {
            parentClass.dispatchEvent("showFadeOutMesg", { "text": "提线成功"});
            _self.connetToServer();
        }
    }

    _self.moreEvent = function (mouseEvent, _param){
        console.log("投注还没做");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }



    //exit
    _self.exitEvent=function(){
        // util.echo("top exit");
        return true;
    }

    _self.backPage=function(e, param){
        parentClass.dispatchEvent("backPage", {"retFun":_self.backPageComplete});
    }

    _self.backPageComplete=function(){
        // util.echo("backPageComplete");
    }

    _self.changePage=function(e, param){
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.changePageComplete=function(){
        // util.echo("changePageComplete");
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

    _self.getOnlineMem_count=function(){
        return onlineMem_count;
    }

    //--------------創建計時器 start-----------------
    _self.createTimer = function () {
        if (timerHash["online_mem"] != null) {
            timerHash["online_mem"].clearObj();
        }
        timerHash["online_mem"] = new Timer(config_set.get("ONLINE_MEM"));
        //timerHash["online_mem"] = new Timer(15*1000);
        timerHash["online_mem"].setParentclass(_self);
        timerHash["online_mem"].dont_clear = false; //設定為不清除timer
        timerHash["online_mem"].init();
        timerHash["online_mem"].addEventListener("TimerEvent.TIMER", _self.timerRun);
        timerHash["online_mem"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerComplete);
    }
    //設定 定時做事
    _self.startTimer = function () {
        // util.echo("online_mem startTimer");
        timerHash["online_mem"].startTimer();
    }

    _self.stopTimer = function () {
        // util.echo("online_mem stopTimer");
        timerHash["online_mem"].stopTimer();
    }

    _self.clearTimer = function () {
        // util.echo("online_mem clearTimer");
        timerHash["online_mem"].clearObj();
        timerHash["online_mem"] = null;
    }

    _self.timerRun = function () {
        _self.connetToServer();
        parentClass.dispatchEvent("showLoading", {"showLoading":false});
    }

    _self.timerComplete = function () {
        // util.echo("totalbet timerComplete"); //no complete
    }
    //--------------創建計時器 end-----------------

    //=================錯誤訊息=================
    _self.showErrorCtl = function (code, msg) {
        if(code){
            _self.clearErrorStatusCtl(null,ctlObj[code]);
        }else{
            _self.clearErrorStatusCtl();
        }
        // _self.clearErrorStatusCtl();
        var obj = ctlObj[code];
        var error_class = "accadd_error";
        if (obj != null) {
            ctlObj[code].msg.innerHTML = msg;
            _self.setBoxClass(ctlObj[code].box, error_class, "add");
        }
    }

    _self.clearErrorStatusCtl = function (e, target) {
        if (target!=null){
            _self.setBoxClass(target.box, "accadd_error", "");
        }else{
            for (var key in ctlObj) {
                _self.setBoxClass(ctlObj[key].box, "accadd_error", "");
            }
        }
    }

    _self.showErrorPwd = function (code, msg) {
        var obj = ctlObj[code];
        if (obj != null) {
            ctlObj[code].msg.innerHTML = msg;
            _self.setBoxClass(ctlObj[code].box, "psw_error", "add");
        }
    }

    _self.show_Error = function (code, msg, arr_data) {
        var tmp = code.split("|");
        if (tmp[0] == "errormsg") {
            _self.showErrorMsg(tmp[1], msg);
        } else if (tmp[0] == "ctl") {
            _self.showErrorCtl(tmp[1], msg);
        } else if (tmp[0] == "conf") {
            _self.showErrorConf(tmp[1], msg);
        } else {
            if (msg != null && msg != "") {
                parentClass.dispatchEvent("showAlertMsg", arr_data);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
        }
    }

    _self.showErrorMsg = function (code, msg) {
        if (code == "clean_db") {
            var obj = new Object();
            obj.msg = msg;
            obj.backPage = "announcement";
            parentClass.dispatchEvent("showAlertMsg", obj);
        } else if (code == "err_cash_sw") {
            var obj = new Object();
            obj.msg = msg;
            obj.backPage = "announcement";
            parentClass.dispatchEvent("showAlertMsg", obj);
        }
    }
    //=================錯誤訊息=================
}