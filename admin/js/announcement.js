function announcement(_win, _dom,paramObj) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object();
    var util;
    var LS;
    var LS_code;
    var topFrame;
    var Cookie;
    var CookieKey;
    var CookieImp;
    var CookieGen;
    var ClassName = "announcement";
    var ul_scroll;
    var imp;
    var per;
    var gen;
    var news;
    var chat;
    var forget;
    var ser_date_view;
    var ser_order_view;
    var ser_batch_view;
    var ser_date_title;
    var ser_order_title;
    var ser_batch_title;
    var sel_date_view;
    var sel_order_view;
    var sel_batch_view;
    var ul_date;
    var ul_order;
    var btn_add_ann_small;
    var btn_delete_batch_small;
    var btn_delete7_small;
    var btn_add_ann_big;
    var btn_delete_batch_big;
    var btn_delete7_big;
    var sear_big_text;
    var sear_big_send;
    var sear_big_clear;
    var sear_small_text;
    var sear_small_send;
    var sear_small_clear;
    var sear_small_btn;
    var sear_big_view;
    var sear_small_view;
    var ctlObj = new Object();
    var _mc = new Object();
    var searchObj = {}; //搜尋依據物件
    var scoll_type = "important";
    var scoll_date = "all";
    var sort = "desc";
    var search = "";
    _self.init = function () {
        // util.echo("announcement load complete");
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        parentClass.dispatchEvent("chgPageName", { "pageName": "announcement" });



        forget = document.getElementById("forget");
        ser_date_view = document.getElementById("ser_date_view");
        ser_order_view = document.getElementById("ser_order_view");
        ser_batch_view = document.getElementById("ser_batch_view");
        ser_date_title = document.getElementById("ser_date_title");
        ser_order_title = document.getElementById("ser_order_title");
        ser_batch_title = document.getElementById("ser_batch_title");
        ul_date = document.getElementById("ul_date");
        ul_order = document.getElementById("ul_order");
        sear_big_text = document.getElementById("sear_big_text");
        sear_big_send = document.getElementById("sear_big_send");
        sear_big_clear = document.getElementById("sear_big_clear");
        sear_small_text = document.getElementById("sear_small_text");
        sear_small_send = document.getElementById("sear_small_send");
        sear_small_clear = document.getElementById("sear_small_clear");
        sear_small_btn = document.getElementById("sear_small_btn");
        sear_big_view = document.getElementById("sear_big_view");
        sear_small_view = document.getElementById("sear_small_view");
        //James 2019/05/10 495.尺寸600以下-所有下拉選單-改為內建瀏覽器拉霸
        sel_date_view = document.getElementById("sel_date_view");
        sel_order_view = document.getElementById("sel_order_view");
        sel_batch_view = document.getElementById("sel_batch_view");

        btn_cancel = document.getElementById("btn_cancel");
        btn_save = document.getElementById("btn_save");
        var obj_ids = ",box_content,input_content,msg_content,";
        obj_ids += "box_user,input_user,msg_user,";
        obj_ids += "btn_save,btn_cancel,";
        _mc = util.getObjAry(dom, obj_ids);

        ctlObj["user"] = new Object();
        ctlObj["user"].box = _mc["box_user"];
        ctlObj["user"].msg = _mc["msg_user"];
        ctlObj["user"].input = _mc["input_user"];

        ctlObj["content"] = new Object();
        ctlObj["content"].box = _mc["box_content"];
        ctlObj["content"].msg = _mc["msg_content"];
        ctlObj["content"].input = _mc["input_content"];
        util.addEvent(_mc["btn_cancel"], "click", _self.closeEvent, "cancel");
        util.addEvent(_mc["btn_save"], "click", _self.saveEvent, _mc["btn_save"]);
        btn_add_ann_big = document.getElementById("btn_add_ann_big");
        btn_delete_batch_big = document.getElementById("btn_delete_batch_big");
        btn_delete7_big = document.getElementById("btn_delete7_big");
        util.addEvent(btn_add_ann_big, "click", _self.addAnnouncementEvent);
        util.addEvent(btn_delete_batch_big, "click", _self.deleteBatchEvent);
        util.addEvent(btn_delete7_big, "click", _self.delete7Event);
        btn_add_ann_small = document.getElementById("btn_add_ann_small");
        btn_delete_batch_small = document.getElementById("btn_delete_batch_small");
        btn_delete7_small = document.getElementById("btn_delete7_small");
        util.addEvent(btn_add_ann_small, "click", _self.addAnnouncementEvent);
        util.addEvent(btn_delete_batch_small, "click", _self.deleteBatchEvent);
        util.addEvent(btn_delete7_small, "click", _self.delete7Event);

        util.addEvent(sear_small_btn, "click", _self.onClickEventHandler, { "target": "phone"});
        util.addEvent(sear_big_send, "click", _self.onClickEventHandler, { "target": "search_send", "s1": sear_big_text});
        util.addEvent(sear_big_clear, "click", _self.onClickEventHandler, { "target": "search_clear", "c1": sear_big_text,"c2":sear_small_text});
        util.addEvent(sear_small_send, "click", _self.onClickEventHandler, { "target": "search_send", "s1": sear_small_text});
        util.addEvent(sear_small_clear, "click", _self.onClickEventHandler, { "target": "search_clear", "c1": sear_big_text,"c2":sear_small_text});
        util.addEvent(sear_big_text, "input", _self.onInputEventHandler, { "target": "search_text", "t1": sear_small_text});
        util.addEvent(sear_big_text, "keypress", _self.onClickEventHandler, { "target": "search_send", "s1": sear_big_text });
        util.addEvent(sear_small_text, "input", _self.onInputEventHandler, { "target": "search_text", "t1": sear_big_text});
        util.addEvent(sear_small_text, "blur", _self.onBlurEventHandler, { "target": "blur", "b1": sear_small_text});

        util.setInfEvent(ser_date_view, { "_focus": ul_date, "_setView": ser_date_view, "_viewClass": "active" });
        util.setInfEvent(ser_order_view, { "_focus": ul_order, "_setView": ser_order_view, "_viewClass": "active" });
        util.setInfEvent(ser_batch_view, { "_focus": ul_batch, "_setView": ser_batch_view, "_viewClass": "active" });



        var ul_dateCh = ul_date.children;
        for (var i = 0, len = ul_dateCh.length; i < len ; i++){
            util.addEvent(ul_dateCh[i], "click", _self.onClickEventHandler, { "target": "ul_bar", "h1": ser_date_title, "v1": ser_date_view });
        }
        //util.addEvent(sel_date_view, "change", _self.onChangeEventHandler);

        var ul_orderCh = ul_order.children;
        for (var i = 0, len = ul_orderCh.length; i < len; i++){
            util.addEvent(ul_orderCh[i], "click", _self.onClickEventHandler, { "target": "ul_bar", "h1": ser_order_title, "v1": ser_order_view });
        }
        //util.addEvent(sel_order_view, "change", _self.onChangeEventHandler);

        var ul_batchCh = ul_batch.children;
        for (var i = 0, len = ul_batchCh.length; i < len; i++){
            util.addEvent(ul_batchCh[i], "click", _self.onClickEventHandler, { "target": "ul_bar", "h1": ser_batch_title, "v1": ser_batch_view });
        }
        //util.addEvent(sel_batch_view, "change", _self.onChangeEventHandler);
        _self.initLevel();
    }
    _self.initLevel = function(){
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", function (data) {
            var d = JSON.parse(data);
            d = d["list"];
            var k = 0;
            for(var i in d){
                var li = dom.createElement("li");
                li.id = i;
                li.setAttribute("value",d[i]["value"]);
                li.innerHTML = d[i]["text"]+"<i></i>";
                dom.getElementById("ul_scroll").appendChild(li);
                k++;
            }
            if(top.login_layer=="ads"){
                var li = dom.createElement("li");
                li.id = "forget";
                li.setAttribute("value","forgetPwd");
                li.innerHTML = "密码申诉<i></i>";
                dom.getElementById("ul_scroll").appendChild(li);
            }
            ul_scroll = document.getElementById("ul_scroll");
            imp = document.getElementById("imp");
            per = document.getElementById("per");
            gen = document.getElementById("gen");
            if(top.login_layer=="ads"){
                forget = document.getElementById("forget");
            }
            
            if(k==0){

                if(top.login_layer == "ads") {
                    util.addEvent(imp, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": per, "a2": gen, "a3":forget});
                    util.addEvent(per, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": gen, "a3":forget});
                    util.addEvent(gen, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":forget});
                    util.addEvent(forget, "click", _self.onClickEventHandler, {
                        "target": "ann_classify_title",
                        "a1": imp,
                        "a2": per,
                        "a3": gen
                    });
                }else{
                    util.addEvent(imp, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": per, "a2": gen});
                    util.addEvent(per, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": gen});
                    util.addEvent(gen, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per});
                }
            }else if (k==1){
                news = document.getElementById("news");


                if(top.login_layer == "ads") {
                    util.addEvent(imp, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": per, "a2": gen, "a3":forget, "a4":news});
                    util.addEvent(per, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": gen, "a3":forget, "a4":news});
                    util.addEvent(gen, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":forget, "a4":news});
                    util.addEvent(news, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":gen, "a4":forget});
                    util.addEvent(forget, "click", _self.onClickEventHandler, {
                        "target": "ann_classify_title",
                        "a1": imp,
                        "a2": per,
                        "a3": gen,
                        "a4": news
                    });
                
                }else{
                    util.addEvent(imp, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": per, "a2": gen,"a3":news});
                    util.addEvent(per, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": gen,"a3":news});
                    util.addEvent(gen, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":news});
                    util.addEvent(news, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":gen});
                }
            }else{
                news = document.getElementById("news");

                if(top.login_layer == "ads"){
                    chat = document.getElementById("chat");

                    util.addEvent(forget, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":gen, "a4":news, "a5":chat });
                    util.addEvent(imp, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": per, "a2": gen, "a3":forget, "a4":news, "a5":chat });
                    util.addEvent(per, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": gen, "a3":forget, "a4":news, "a5":chat });
                    util.addEvent(gen, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":forget, "a4":news, "a5":chat });
                    util.addEvent(news, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":gen, "a4":forget, "a5":chat });
                    util.addEvent(chat, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":gen, "a4":forget, "a5":news });
                }else if(top.login_layer == "ad"){
                    chat = document.getElementById("chat");

                    
                    util.addEvent(imp, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": per, "a2": gen, "a3":news, "a4":chat });
                    util.addEvent(per, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": gen, "a3":news, "a4":chat });
                    util.addEvent(gen, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":news, "a4":chat });
                    util.addEvent(news, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":gen, "a4":chat });
                    util.addEvent(chat, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":gen, "a4":news });
                }else {
                    util.addEvent(imp, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": per, "a2": gen,  "a3":news });
                    util.addEvent(per, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": gen,  "a3":news });
                    util.addEvent(gen, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":news});
                    util.addEvent(news, "click", _self.onClickEventHandler, { "target": "ann_classify_title", "a1": imp, "a2": per, "a3":gen});
                }



            }


            //預設收尋字串
            if(paramObj){
                if(paramObj.hasOwnProperty("scoll_type")){
                    scoll_type = paramObj.scoll_type;
                    util.classFunc(imp, "on", "remove");
                    util.classFunc(per, "on", "remove");
                    util.classFunc(gen, "on", "remove");
                    util.classFunc(news, "on", "remove");
                    if(top.login_layer == "ads") {
                        util.classFunc(chat, "on", "remove");
                        util.classFunc(forget, "on", "remove");
                    }
                    if(top.login_layer == "ad") {
                        util.classFunc(chat, "on", "remove");
                    }
                    switch (scoll_type){
                        case "important":
                            util.classFunc(imp, "on");
                            break;
                        case "personal":
                            util.classFunc(per, "on");
                            break;
                        case "general":
                            util.classFunc(gen, "on");
                            break;
                        case "proNews":
                            util.classFunc(news, "on");
                            break;
                        case "proChat":
                            if(top.login_layer == "ads") {
                                util.classFunc(chat, "on");
                            }else{
                                util.classFunc(imp, "on");
                            }
                            break;
                        case "forgetPwd":
                            if(top.login_layer == "ads") {
                                util.classFunc(forget, "on");
                            }else{
                                util.classFunc(imp, "on");
                            }
                            break;
                    }

                    if(scoll_type == "proChat" && top.login_layer=="ads"){
                        btn_add_ann_small.style.display = "none";
                        btn_delete7_small.style.display = "none";
                        btn_add_ann_big.style.display = "none";
                        btn_delete7_big.style.display = "none";
                        scroll_div.style.display = "";
                        if(paramObj.hasOwnProperty("username")){
                            dom.getElementById("input_user").value = paramObj.username;
                        }
                    }else if(scoll_type == "proChat" && top.login_layer=="ad"){
                        btn_add_ann_small.style.display = "none";
                        btn_delete7_small.style.display = "none";
                        btn_add_ann_big.style.display = "none";
                        btn_delete7_big.style.display = "none";
                        scroll_div.style.display = "";
                        if(paramObj.hasOwnProperty("username")){
                            dom.getElementById("input_user").value = paramObj.username;
                        }
                    }else if(scoll_type == "forgetPwd" && top.login_layer=="ads"){
                        btn_add_ann_small.style.display = "none";
                        btn_delete7_small.style.display = "none";
                        btn_add_ann_big.style.display = "none";
                        btn_delete7_big.style.display = "none";
                        scroll_div.style.display = "none";
                    } else {
                        btn_add_ann_small.style.display = "";
                        btn_delete7_small.style.display = "";
                        btn_add_ann_big.style.display = "";
                        btn_delete7_big.style.display = "";
                        scroll_div.style.display = "none";
                    }
                }

                if(paramObj.hasOwnProperty("scoll_date")){
                    scoll_date = paramObj.scoll_date;
                }

                if(paramObj.hasOwnProperty("sort")){
                    sort = paramObj.sort;
                }

                if(paramObj.hasOwnProperty("search") ){
                    search = paramObj.search;
                    sear_big_text.value = search;
                    sear_small_text.value = search;
                    if(search != ""){
                        sear_small_view.style.display = "";
                    }
                }
            }
            searchObj["scoll_type"] = scoll_type;
            searchObj["scoll_date"] = scoll_date;
            searchObj["sort"] = sort;
            searchObj["search"] = search;

            _self.initAnnCookie();
            _self.PHPgetdata("init");

        });
        var param = "";
        param += "login_layer=" + top.login_layer;
        param += "&uid=" + top.uid;
        param += "&langx=" + top.langx;
        param += "&action=level";
        param = "p=get_announcement&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }
    //============== save ==============
    _self.saveEvent = function (mouseEvent, targetObj) {
        var ret = _self.submitCheck();
        if (ret) {
            var getHttp = new HttpRequest();
            getHttp.addEventListener("LoadComplete", function (data) {
                _self.saveFinish(data, targetObj);
            });
            var param = _self.getSaveParam();
            param = "p=get_announcement&ver=" + top.ver + "&" + param;
            getHttp.loadURL(top.url, "POST", param);
        }
    }

    _self.saveFinish = function (data, targetObj) {

        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        if (_status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg != null && error_msg != "" && error_msg!="goHome") {
                _self.show_Error(error_code, error_msg, arr_data);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
        } else {
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_success") ,"s":5, "showCopy":"N" });
            _self.closeEvent("save");
            _self.PHPgetdata("init");
        }
    }

    _self.getSaveParam = function () {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&langx=" + top.langx;
        par += "&action=add";
        par += "&txt="+_mc["input_content"].value;
        par += "&user="+_mc["input_user"].value;
        par += "&scoll_type=proChat";
        return par;
    }

    _self.submitCheck = function () {
        if (ctlObj["user"].input.value == "") {
            _self.showErrorCtl("user", LS.get("empty_user"));
            return false;
        }

        if (ctlObj["content"].input.value == "") {
            _self.showErrorCtl("content", LS.get("empty_content"));
            return false;
        }
        return true;
    }



    _self.setBoxClass = function (targetObj, style ,_doSome) {
        if (targetObj== null) return;
        if (targetObj.initclass == null){
            targetObj.initclass = targetObj.className;
        }else{
            targetObj.className = targetObj.initclass;
        }
        if (_doSome == "add" &&!targetObj.classList.contains(style)) {
            targetObj.classList.add(style);
        }
    }

    _self.closeEvent = function(e){
        if(e == "save"){
            _mc["input_content"].value = "";
        }else{
            _mc["input_user"].value = "";
            _mc["input_content"].value = "";
        }

    }

    _self.addAnnouncementEvent = function(){
        var obj = new Object();
        obj.postHash = new Object();
        obj.page = "ann_add";
        obj.postHash.scoll_type = searchObj["scoll_type"];
        obj.postHash.scoll_date = searchObj["scoll_date"];
        obj.postHash.sort = searchObj["sort"];
        obj.postHash.search = searchObj["search"];
        obj.postHash.back_page = ClassName;
        parentClass.dispatchEvent("bodyGoToPage", obj);
    }

    //設定預載對象
    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        Cookie = parentClass.getThis("cookie");
        topFrame = parentClass.getThis("topFrame");
    }
    _self.getThis = function (varible) {
        return eval(varible);
    }
    _self.onError = function () {
        util.echo("onError");
    }
    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }
    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }
    _self.backPage = function (e, param) {
        parentClass.dispatchEvent("backToIdex", { "retFun": _self.backPageComplete });
    }
    _self.backPageComplete = function () {
        util.echo("backPageComplete");
    }
    //php聯繫
    _self.PHPgetdata = function (eventName,param){
        param = param || "";
        var urlParams = "uid=" + top.uid;
        var getHTML = new HttpRequest();
        if (eventName == "init") {   //初始
            param = _self.getAnnouncementInfo();
            urlParams += "&action=init";
            urlParams += "&announcement=count";
            urlParams += "&langx=" + top.langx;
            urlParams += "&login_layer=" + top.login_layer;
            urlParams += "&" + param;
            urlParams = "p=get_announcement&ver=" + top.ver + "&" + urlParams;
            getHTML.addEventListener("LoadComplete", _self.refreshView);
        }
        getHTML.addEventListener("onError", _self.onError);
        getHTML.loadURL(top.url, "POST", urlParams);
    }
    //刷新view
    _self.refreshView = function(data){
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data)) arr_data = JSON.parse(data);
            if (!arr_data) arr_data = data;
        } catch (e) {
            util.echo(e);
        }
        var viewStr = "";
        var maxNun = 1;
        var ann_div_view = document.getElementById("ann_div_view");
        if (arr_data["msg"] == "success"){
            var ann_div_view = document.getElementById("ann_div_view");
            var view_ann_table = document.getElementById("view_ann_table").innerHTML;
            var view_ann_tr = document.getElementById("view_ann_tr").innerHTML;
            _self.setUl_scroll(arr_data["count"]);  //上方亮綠燈
            if (arr_data["code"] == "none"){
                // viewStr = "No Information";
                _self.setFormDisplayIsHiden(true);
            }
            else{
                var exStr = _self.getAnnouncementInfo();
                var mesgAry = arr_data["code"].split("@@");
                var contrast = 0;
                if (exStr.indexOf("important") != -1) contrast = CookieImp;
                if (exStr.indexOf("general") != -1) contrast = CookieGen;
                for (var i = 0, len = mesgAry.length; i < len; i++) {
                    var tmpTr = view_ann_tr;
                    var clasName = "";
                    var detailAry = mesgAry[i].split("|");
                    var dateAry = detailAry[1].split(" ");
                    tmpTr = tmpTr.replace("*ANNDATE*", dateAry[0]);
                    tmpTr = tmpTr.replace(new RegExp("\\*ID\\*", "gi"), detailAry[0]);
                    if(detailAry[5]){
                        tmpTr = tmpTr.replace("*ANNCONTENT*", detailAry[2]+"  <font color=red>"+detailAry[5]+"</font>");
                    }else{
                        tmpTr = tmpTr.replace("*ANNCONTENT*", detailAry[2]);
                    }

                    if(exStr.indexOf("proNews") != -1){
                        var str = '[发布者:'+detailAry[3]+' <span class="red">阅读'+detailAry[4]+'次</span>]';
                        tmpTr = tmpTr.replace("*NAME*", str);
                    }else if(exStr.indexOf("proChat") != -1){
                        var str = '';
                        if(detailAry[7] == 1){
                            str += '[<span class="green">已读</span>]';
                        }else{
                            str += '[<span class="red">未读</span>]';
                        }
                        str += ' (<span class="blueviolet">'+detailAry[3]+'</span>对<span class="blue">'+detailAry[4]+'</span>说)';
                        tmpTr = tmpTr.replace("*NAME*", str);
                    }else if(exStr.indexOf("forgetPwd") != -1){
                        tmpTr = tmpTr.replace("*NAME*", '[申诉账号:'+detailAry[3]+']');
                    }else{
                        tmpTr = tmpTr.replace("*NAME*", '[发布者:'+detailAry[3]+']');
                    }
                    if (detailAry[0] > maxNun) maxNun = detailAry[0];   //先判斷大小
                    if (maxNun > contrast) clasName = "ann_new_icon";   //判斷是否有看過
                    tmpTr = tmpTr.replace("*CLASSNEWS*", clasName);
                    viewStr += tmpTr;
                }
                //刷新cookie 要判斷使用者點的是 important general
                if (exStr.indexOf("important") != -1) CookieImp = maxNun;
                if (exStr.indexOf("general") != -1) CookieGen = maxNun;
                _self.setCookie();
                _self.setFormDisplayIsHiden(false);
            }
            viewStr = view_ann_table.replace("*ANNOUNCEMENTTABLETR*", viewStr);

        }else{
            if(!arr_data.hasOwnProperty("msg")){
                util.chkErrorMsg(arr_data, LS_code);
            }else{
                util.showErrorMsg(LS.get(arr_data["code"]));
            }
        }
        ann_div_view.innerHTML = viewStr;
        if (arr_data["msg"] == "success") {
            var mesgAry = arr_data["code"].split("@@");
            for (var i = 0, len = mesgAry.length; i < len; i++) {
                var detailAry = mesgAry[i].split("|");
                var div = dom.getElementById("div_" + detailAry[0]);
                var obj_ids = ",btn_edit,btn_dele,";
                var _ary = util.getObjAry(div, obj_ids);
                if(searchObj["scoll_type"] == "forgetPwd"){
                    if(_ary["btn_edit"]){
                        _ary["btn_edit"].remove();
                    }
                }else{
                    util.addEvent(_ary["btn_edit"], "click", _self.editEvent, detailAry);
                }

                util.addEvent(_ary["btn_dele"], "click", _self.deleteEvent, detailAry);
            }
        }
    }

    _self.editEvent = function (mouseEvent, _param)  {
        if(searchObj["scoll_type"] == "proChat"){
            _mc["input_user"].value = _param[4];
        } else {
            var paramHash = new Object();
            var obj = new Object();
            paramHash["edit_id"] = _param[0];
            paramHash["scoll_type"] = searchObj["scoll_type"];
            paramHash["scoll_date"] = searchObj["scoll_date"];
            paramHash["sort"] = searchObj["sort"];
            paramHash["search"] = searchObj["search"];
            paramHash["back_page"] = ClassName;
            obj.page = "ann_edit";
            obj.postHash = paramHash;
            parentClass.dispatchEvent("bodyGoToPage", obj);
        }
    }

    _self.deleteEvent = function(mouseEvent, _param){
        var msg = "删除后不能恢复,您确定要删除吗？";
        if (confirm(msg)==true) {
            var getHttp = new HttpRequest();
            getHttp.addEventListener("LoadComplete", _self.deleEvent);
            var param = "p=get_announcement&action=delete&" + _self.getBaseParam() +  "&id=" + _param[0];
            if(searchObj["scoll_type"] == "proChat"){
                param += "&scoll_type=proChat";
            }

            if(searchObj["scoll_type"] == "forgetPwd"){
                param += "&scoll_type=forgetPwd";
            }
            getHttp.loadURL(top.url, "POST", param);
        }
    }

    _self.deleteBatchEvent = function (){
        var chks = document.getElementsByName("chk");
        var check_val = [];
        for (var i = 0; i < chks.length; i++) {
            if (chks[i].checked) {
                check_val.push((parseInt(chks[i].value)));
            }
        }

        if(check_val.length == 0){
            alert(LS.get("page_ann_one"));
        } else {
            var msg = "删除后不能恢复,您确定要删除吗？";
            if (confirm(msg)==true) {
                var getHttp = new HttpRequest();
                getHttp.addEventListener("LoadComplete", _self.deleEvent);
                var param = "p=get_announcement&action=delete_batch&" + _self.getBaseParam() +  "&ids=" + JSON.stringify(check_val);
                if(searchObj["scoll_type"] == "proChat"){
                    param += "&scoll_type=proChat";
                }

                if(searchObj["scoll_type"] == "forgetPwd"){
                    param += "&scoll_type=forgetPwd";
                }
                getHttp.loadURL(top.url, "POST", param);
            }
        }
    }

    _self.delete7Event = function (){
        var msg = "删除后不能恢复,您确定要删除吗？";
        if (confirm(msg)==true) {
            var getHttp = new HttpRequest();
            getHttp.addEventListener("LoadComplete", _self.deleEvent);
            var param = "p=get_announcement&action=delete7&" + _self.getBaseParam();
            getHttp.loadURL(top.url, "POST", param);
        }
    }

    _self.deleEvent = function (data) {
        var arr_data = JSON.parse(data);
        if (arr_data.status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg != null && error_msg != "") {
                _self.show_Error(error_code, error_msg, arr_data);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
        } else {
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("dele_success") ,"s":5 , "showCopy":"N","value":"" });
            _self.PHPgetdata("init");
        }
    }

    _self.getBaseParam = function () {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&scoll_type=" + searchObj["scoll_type"];
        par += "&uid=" + top.uid;
        par += "&langx="+top.langx;
        return par;
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

    //物件轉字串
    _self.getAnnouncementInfo = function(){
        var urlStr = "";
        urlStr += "scoll_type=" + searchObj["scoll_type"];
        urlStr += "&scoll_date=" + searchObj["scoll_date"];
        urlStr += "&sort=" + searchObj["sort"];
        if (searchObj["search"]) urlStr += "&search=" + searchObj["search"];
        return urlStr;
    }
    //所有點擊事件
    _self.onClickEventHandler = function(evt,param){
        var DOM = evt.target;
        if (param.target == "ann_classify_title"){ //重要 個人 一般
            util.classFunc(DOM, "on");
            util.classFunc(param.a1, "on", "remove");
            util.classFunc(param.a2, "on", "remove");
            util.classFunc(param.a3, "on", "remove");
            if(param.a4){
                util.classFunc(param.a4, "on", "remove");
            }
            if(param.a5){
                util.classFunc(param.a5, "on", "remove");
            }

            var scroll_div = document.getElementById("scroll_div");
            searchObj["scoll_type"] = DOM.getAttribute("value");
            if(DOM.id == "chat"){
                btn_add_ann_small.style.display = "none";
                btn_delete7_small.style.display = "none";
                btn_add_ann_big.style.display = "none";
                btn_delete7_big.style.display = "none";
                scroll_div.style.display = "";
            }else if(DOM.id == "forget"){
                btn_add_ann_small.style.display = "none";
                btn_delete7_small.style.display = "none";
                btn_add_ann_big.style.display = "none";
                btn_delete7_big.style.display = "none";
                scroll_div.style.display = "none";
            } else {
                btn_add_ann_small.style.display = "";
                btn_delete7_small.style.display = "";
                btn_add_ann_big.style.display = "";
                btn_delete7_big.style.display = "";
                scroll_div.style.display = "none";
            }
            _self.PHPgetdata("init");
        }
        else if (param.target == "search_send"){
            if (evt.type=="click"){
                searchObj["search"] = param.s1.value;
                _self.PHPgetdata("init");
            } else if (evt.type =="keypress"){
                var keyCode = util.getKeyCode(evt);
                if (keyCode == 13){
                    searchObj["search"] = param.s1.value;
                    _self.PHPgetdata("init");
                }
            }
        }
        else if (param.target == "search_clear"){   //清空訊息
            if (param.c2.value == "") {
                sear_big_view.style.display = "";
                sear_small_view.style.display = "none";
            }
            param.c1.value = "";
            param.c2.value = "";
            searchObj["search"] = "";
        }
        else if (param.target == "ul_bar"){ //點擊 日期 排序 子項目
            if (DOM.tagName != "LI") return;
            _self.labarFunc(param.h1,DOM.innerHTML);

            if (param.h1.id.indexOf("date") != -1) {//日期
                searchObj["scoll_date"] = DOM.getAttribute("value");
                _self.PHPgetdata("init");
            } else if (param.h1.id.indexOf("order") != -1)  {//順序
                searchObj["sort"] = DOM.getAttribute("value");
                _self.PHPgetdata("init");
            } else if (param.h1.id.indexOf("batch") != -1){
                var val = DOM.getAttribute("value");
                var chks = document.getElementsByName("chk");
                switch (val){
                    case "all":
                        for (var i = 0; i < chks.length; i++) {
                            chks[i].checked = true;
                        }
                        break;
                    case "no":
                        for (var i = 0; i < chks.length; i++) {
                            chks[i].checked = false;
                        }
                        break;
                    case "back":
                        for (var i = 0; i < chks.length; i++) {
                            if(chks[i].checked === true){
                                chks[i].checked = false;
                            } else {
                                chks[i].checked = true;
                            }
                        }
                        break;
                }
            }
        }
        else if (param.target == "phone"){
            sear_big_view.style.display = "none";
            sear_small_view.style.display = "";
        }
    }
    //James 2019/05/10 495.尺寸600以下-所有下拉選單-改為內建瀏覽器拉霸
    //所有切換事件
    _self.onChangeEventHandler = function (evt) {
        var h1 = evt.target.id;
        if(h1.indexOf("batch") != -1){//批量选择
        } else {
            if (h1.indexOf("date") != -1) searchObj["scoll_date"] = evt.target.value; //日期
            else if (h1.indexOf("order") != -1) searchObj["sort"] = evt.target.value;   //順序
            _self.PHPgetdata("init");
        }
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
        if (param.b1.value == ""){
            sear_big_view.style.display = "";
            sear_small_view.style.display = "none";
        }
    }
    //============== filter ==============
    //
    _self.setFormDisplayIsHiden = function(param){
        var view = "none";
        var reverse = ""
        if (!param) {
            view = "";
            reverse = "none";
        }
        document.getElementById("ann_div_view").style.display = view;
        document.getElementById("ann_div_no_data").style.display = reverse;
    }

    //設置cookie (TOP 更新cookie就好 bottom不需要)
    _self.initAnnCookie = function(){
        CookieKey = top.annCookie;
        var key = Cookie.get(CookieKey);
        if (key == undefined) {
            CookieImp = 1;
            CookieGen = 1;
        } else {
            var keyAry = key.split("|");
            CookieImp = /^[1-9][0-9]{0,}$/.test(keyAry[0]*1) ? keyAry[0]:1;
            CookieGen = /^[1-9][0-9]{0,}$/.test(keyAry[1]*1) ? keyAry[1]:1;
        }
    }
    //設置cookie  (TOP 更新cookie就好 bottom不需要)
    _self.setCookie = function(){
        var val = CookieImp + "|" + CookieGen;
        Cookie.set(CookieKey, val,30);
    }
    //控制 重要 一般 個人 亮綠點
    _self.setUl_scroll = function (num) {
        var numAry = num.split("|");
        if (numAry[0] > CookieImp)  util.classFunc(imp, "ann_li_dot");
        else                        util.classFunc(imp, "ann_li_dot", "remove");
        if (numAry[1] > CookieGen)  util.classFunc(gen, "ann_li_dot");
        else                        util.classFunc(gen, "ann_li_dot", "remove");

        // topFrame.setRingAlert(num, CookieImp, CookieGen);   //上方鈴鐺亮燈
        parentClass.dispatchEvent("AnnCountBroadcastData", { "count": num });

    }
    //使用者自行收尋
    //拉霸 換字顯示
    _self.labarFunc = function(innerDom,val){
        innerDom.innerHTML = val;
    }

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
