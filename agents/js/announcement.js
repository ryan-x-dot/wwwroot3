function announcement(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var eventHandler = new Object;
    var util;
    var LS;
    var topFrame;
    var Cookie;
    var CookieKey;
    var CookieImp;
    var CookieGen;
    var ul_scroll;
    var imp;
    var per;
    var gen;
    var ser_date_view;
    var ser_order_view;
    var ser_date_title;
    var ser_order_title;
    var ul_date;
    var ul_order;
    var sear_big_text;
    var sear_big_send;
    var sear_big_clear;
    var sear_small_text;
    var sear_small_send;
    var sear_small_clear;
    var sear_small_btn;
    var sear_big_view;
    var sear_small_view;
    var searchObj = {};
    _self.init = function() {
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        });
        parentClass.dispatchEvent("chgPageName", {
            "pageName": "announcement"
        });
        ul_scroll = document.getElementById("ul_scroll");
        imp = document.getElementById("imp");
        per = document.getElementById("per");
        gen = document.getElementById("gen");
        ser_date_view = document.getElementById("ser_date_view");
        ser_order_view = document.getElementById("ser_order_view");
        ser_date_title = document.getElementById("ser_date_title");
        ser_order_title = document.getElementById("ser_order_title");
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
        sel_date_view = document.getElementById("sel_date_view");
        sel_order_view = document.getElementById("sel_order_view");
        util.addEvent(sear_small_btn, "click", _self.onClickEventHandler, {
            "target": "phone"
        });
        util.addEvent(sear_big_send, "click", _self.onClickEventHandler, {
            "target": "search_send",
            "s1": sear_big_text
        });
        util.addEvent(sear_big_clear, "click", _self.onClickEventHandler, {
            "target": "search_clear",
            "c1": sear_big_text,
            "c2": sear_small_text
        });
        util.addEvent(sear_small_send, "click", _self.onClickEventHandler, {
            "target": "search_send",
            "s1": sear_small_text
        });
        util.addEvent(sear_small_clear, "click", _self.onClickEventHandler, {
            "target": "search_clear",
            "c1": sear_big_text,
            "c2": sear_small_text
        });
        util.addEvent(sear_big_text, "input", _self.onInputEventHandler, {
            "target": "search_text",
            "t1": sear_small_text
        });
        util.addEvent(sear_big_text, "keypress", _self.onClickEventHandler, {
            "target": "search_send",
            "s1": sear_big_text
        });
        util.addEvent(sear_small_text, "input", _self.onInputEventHandler, {
            "target": "search_text",
            "t1": sear_big_text
        });
        util.addEvent(sear_small_text, "blur", _self.onBlurEventHandler, {
            "target": "blur",
            "b1": sear_small_text
        });
        util.addEvent(imp, "click", _self.onClickEventHandler, {
            "target": "ann_classify_title",
            "a1": per,
            "a2": gen
        });
        util.addEvent(per, "click", _self.onClickEventHandler, {
            "target": "ann_classify_title",
            "a1": imp,
            "a2": gen
        });
        util.addEvent(gen, "click", _self.onClickEventHandler, {
            "target": "ann_classify_title",
            "a1": imp,
            "a2": per
        });
        util.setInfEvent(ser_date_view, {
            "_focus": ul_date,
            "_setView": ser_date_view,
            "_viewClass": "active"
        });
        util.setInfEvent(ser_order_view, {
            "_focus": ul_order,
            "_setView": ser_order_view,
            "_viewClass": "active"
        });
        var ul_dateCh = ul_date.children;
        for (var i = 0, len = ul_dateCh.length; i < len; i++)
            util.addEvent(ul_dateCh[i], "click", _self.onClickEventHandler, {
                "target": "ul_bar",
                "h1": ser_date_title,
                "v1": ser_date_view
            });
        util.addEvent(sel_date_view, "change", _self.onChangeEventHandler);
        var ul_orderCh = ul_order.children;
        for (var i = 0, len = ul_orderCh.length; i < len; i++)
            util.addEvent(ul_orderCh[i], "click", _self.onClickEventHandler, {
                "target": "ul_bar",
                "h1": ser_order_title,
                "v1": ser_order_view
            });
        util.addEvent(sel_order_view, "change", _self.onChangeEventHandler);
        searchObj["scoll_type"] = "important";
        searchObj["scoll_date"] = "all";
        searchObj["sort"] = "desc";
        searchObj["search"] = "";
        _self.initAnnCookie();
        _self.PHPgetdata("init")
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        Cookie = parentClass.getThis("cookie");
        topFrame = parentClass.getThis("topFrame")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.onError = function() {
        util.echo("onError")
    };
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname])
            eventHandler[eventname](param)
    };
    _self.backPage = function(e, param) {
        parentClass.dispatchEvent("backToIdex", {
            "retFun": _self.backPageComplete
        })
    };
    _self.backPageComplete = function() {
        util.echo("backPageComplete")
    };
    _self.PHPgetdata = function(eventName, param) {
        param = param || "";
        var urlParams = "uid=" + top.uid;
        var getHTML = new HttpRequest;
        if (eventName == "init") {
            param = _self.getAnnouncementInfo();
            urlParams += "&action=init";
            urlParams += "&announcement=count";
            urlParams += "&langx=" + top.langx;
            urlParams += "&login_layer=" + top.login_layer;
            urlParams += "&" + param;
            urlParams = "p=get_announcement&ver=" + top.ver + "&" + urlParams;
            getHTML.addEventListener("LoadComplete", _self.refreshView)
        }
        getHTML.addEventListener("onError", _self.onError);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.refreshView = function(data) {
        try {
            var arr_data = "";
            if (/^{.*?}$/g.test(data))
                arr_data = JSON.parse(data);
            if (!arr_data)
                arr_data = data
        } catch (e) {
            util.echo(e)
        }
        var viewStr = "";
        var maxNun = 1;
        var ann_div_view = document.getElementById("ann_div_view");
        if (arr_data["msg"] == "success") {
            var ann_div_view = document.getElementById("ann_div_view");
            var view_ann_table = document.getElementById("view_ann_table").innerHTML;
            var view_ann_tr = document.getElementById("view_ann_tr").innerHTML;
            _self.setUl_scroll(arr_data["count"]);
            if (arr_data["code"] == "none")
                _self.setFormDisplayIsHiden(true);
            else {
                var exStr = _self.getAnnouncementInfo();
                var mesgAry = arr_data["code"].split("@@");
                var contrast = 0;
                if (exStr.indexOf("important") != -1)
                    contrast = CookieImp;
                if (exStr.indexOf("general") != -1)
                    contrast = CookieGen;
                for (var i = 0, len = mesgAry.length; i < len; i++) {
                    var tmpTr = view_ann_tr;
                    var clasName = "";
                    var detailAry = mesgAry[i].split("|");
                    var dateAry = detailAry[1].split(" ");
                    tmpTr = tmpTr.replace("*ANNDATE*", dateAry[0]);
                    tmpTr = tmpTr.replace("*ANNCONTENT*", detailAry[2]);
                    if (detailAry[0] > maxNun)
                        maxNun = detailAry[0];
                    if (maxNun > contrast)
                        clasName = "ann_new_icon";
                    tmpTr = tmpTr.replace("*CLASSNEWS*", clasName);
                    viewStr += tmpTr
                }
                if (exStr.indexOf("important") != -1)
                    CookieImp = maxNun;
                if (exStr.indexOf("general") != -1)
                    CookieGen = maxNun;
                _self.setCookie();
                _self.setFormDisplayIsHiden(false)
            }
            viewStr = view_ann_table.replace("*ANNOUNCEMENTTABLETR*", viewStr)
        } else
            util.showErrorMsg(LS.get(arr_data["code"]));
        ann_div_view.innerHTML = viewStr
    };
    _self.getAnnouncementInfo = function() {
        var urlStr = "";
        urlStr += "scoll_type=" + searchObj["scoll_type"];
        urlStr += "&scoll_date=" + searchObj["scoll_date"];
        urlStr += "&sort=" + searchObj["sort"];
        if (searchObj["search"])
            urlStr += "&search=" + searchObj["search"];
        return urlStr
    };
    _self.onClickEventHandler = function(evt, param) {
        var DOM = evt.target;
        if (param.target == "ann_classify_title") {
            util.classFunc(DOM, "on");
            util.classFunc(param.a1, "on", "remove");
            util.classFunc(param.a2, "on", "remove");
            searchObj["scoll_type"] = DOM.getAttribute("value");
            _self.PHPgetdata("init")
        } else if (param.target == "search_send")
            if (evt.type == "click") {
                searchObj["search"] = param.s1.value;
                _self.PHPgetdata("init")
            } else {
                if (evt.type == "keypress") {
                    var keyCode = util.getKeyCode(evt);
                    if (keyCode == 13) {
                        searchObj["search"] = param.s1.value;
                        _self.PHPgetdata("init")
                    }
                }
            }
        else if (param.target == "search_clear") {
            if (param.c2.value == "") {
                sear_big_view.style.display = "";
                sear_small_view.style.display = "none"
            }
            param.c1.value = "";
            param.c2.value = "";
            searchObj["search"] = ""
        } else if (param.target == "ul_bar") {
            if (DOM.tagName != "LI")
                return;
            _self.labarFunc(param.h1, DOM.innerHTML);
            if (param.h1.id.indexOf("date") != -1)
                searchObj["scoll_date"] = DOM.getAttribute("value");
            else if (param.h1.id.indexOf("order") != -1)
                searchObj["sort"] = DOM.getAttribute("value");
            _self.PHPgetdata("init")
        } else if (param.target == "phone") {
            sear_big_view.style.display = "none";
            sear_small_view.style.display = ""
        }
    };
    _self.onChangeEventHandler = function(evt) {
        var h1 = evt.target.id;
        if (h1.indexOf("date") != -1)
            searchObj["scoll_date"] = evt.target.value;
        else if (h1.indexOf("order") != -1)
            searchObj["sort"] = evt.target.value;
        _self.PHPgetdata("init")
    };
    _self.onInputEventHandler = function(evt, param) {
        var DOM = evt.target;
        if (param.target == "search_text")
            param.t1.value = DOM.value
    };
    _self.onBlurEventHandler = function(evt, param) {
        if (param.b1.value == "") {
            sear_big_view.style.display = "";
            sear_small_view.style.display = "none"
        }
    };
    _self.setFormDisplayIsHiden = function(param) {
        var view = "none";
        var reverse = "";
        if (!param) {
            view = "";
            reverse = "none"
        }
        document.getElementById("ann_div_view").style.display = view;
        document.getElementById("ann_div_no_data").style.display = reverse
    };
    _self.initAnnCookie = function() {
        CookieKey = top.annCookie;
        var key = Cookie.get(CookieKey);
        if (key == undefined) {
            CookieImp = 1;
            CookieGen = 1
        } else {
            var keyAry = key.split("|");
            CookieImp = /^[1-9][0-9]{0,}$/.test(keyAry[0] * 1) ? keyAry[0] : 1;
            CookieGen = /^[1-9][0-9]{0,}$/.test(keyAry[1] * 1) ? keyAry[1] : 1
        }
    };
    _self.setCookie = function() {
        var val = CookieImp + "|" + CookieGen;
        Cookie.set(CookieKey, val, 30)
    };
    _self.setUl_scroll = function(num) {
        var numAry = num.split("|");
        if (numAry[0] > CookieImp)
            util.classFunc(imp, "ann_li_dot");
        else
            util.classFunc(imp, "ann_li_dot", "remove");
        if (numAry[1] > CookieGen)
            util.classFunc(gen, "ann_li_dot");
        else
            util.classFunc(gen, "ann_li_dot", "remove");
        parentClass.dispatchEvent("AnnCountBroadcastData", {
            "count": num
        })
    };
    _self.labarFunc = function(innerDom, val) {
        innerDom.innerHTML = val
    }
};
