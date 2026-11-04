function online_member(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var fastTemplate_a1;
    var eventHandler = new Object;
    var onlineMem_count;
    var config_set;
    var Timer;
    var timerHash;
    var lazy_sw = null;
    var lazy_count = null;
    var lazy_page = null;
    var lazy_total_page = null;
    var lazy_loading = false;
    var scroll_e = null;
    var dataHash = null;
    var footer_height = 0;
    var pb_height = 0;
    _self.init = function() {
        util.echo("online member complete");
        parentClass.dispatchEvent("chgPageName", {
            "pageName": "onlinemem"
        });
        _self.createTimer();
        _self.connetToServer();
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        });
        topFrame.closeRightPanel();
        pb_height = util.countPaddingPx(dom.getElementById("body_show").children[0])
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        fastTemplate_a1 = parentClass.getThis("fastTemplate_a1");
        topFrame = parentClass.getThis("topFrame");
        config_set = parentClass.getThis("config_set");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash")
    };
    _self.connetToServer = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&layer_id=" + top.layer_id;
        urlParams += "&chk_mem=N";
        urlParams = "p=get_online_mem&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.connectComplete = function(data) {
        try {
            util.echo(data);
            var arr_data = JSON.parse(data);
            util.echo(arr_data);
            if (arr_data["msg"] == "nodata") {
                dom.getElementById("div_show").style.display = "none";
                dom.getElementById("div_show_nodata").style.display = "";
                _self.startTimer();
                parentClass.dispatchEvent("showLoading", {
                    "showLoading": false
                })
            } else {
                dom.getElementById("div_show").style.display = "";
                dom.getElementById("div_show_nodata").style.display = "none";
                dataHash = arr_data;
                _self.setScrollEvent();
                _self.reSetLazy(arr_data);
                _self.parseData(arr_data)
            }
        } catch (e) {
            util.echo(e)
        }
    };
    _self.setScrollEvent = function(isset) {
        footer_height = dom.getElementById("footer_show").clientHeight;
        if (!param.disableScrollEvent || isset)
            util.addEvent(dom.getElementById("ma_content"), "scroll", _self.scrollEvent, dom.getElementById("div_show"))
    };
    _self.scrollEvent = function(e, target) {
        scroll_e = e;
        _self.scroll_ver_event(e, target)
    };
    _self.scroll_ver_event = function(e, targetObj) {
        if (e == null || !dom.getElementById("div_show"))
            return;
        _self.checkShowLazyLoading(e.target)
    };
    _self.onError = function() {
        util.echo("onError")
    };
    _self.parseData = function(hash) {
        var showmain = dom.getElementById("div_show");
        onlineMem_count = hash.length;
        var xmp_header = dom.getElementById("xmp_header").innerHTML;
        xmp_header = xmp_header.replace(/\*MEMCNT\*/g, onlineMem_count);
        var outdata = xmp_header;
        var xmp_foot = dom.getElementById("xmp_foot").innerHTML;
        var tmp_out_data = "";
        var s = 0;
        var e = 0;
        if (lazy_sw) {
            s = (lazy_page - 1) * lazy_count;
            e = lazy_page == lazy_total_page ? hash.length : lazy_page * lazy_count
        } else {
            s = 0;
            e = hash.length
        }
        for (var i = s; i < e; i++) {
            var tmpdata = hash[i];
            var xmp_contant = dom.getElementById("xmp_contant").innerHTML;
            var adddate = tmpdata["adddate"].replace(/\-/g, "/");
            var tmpDateAry = adddate.split(" ");
            xmp_contant = xmp_contant.replace(/\*ADDDATE\*/g, tmpDateAry[0]);
            xmp_contant = xmp_contant.replace(/\*ADDTIME\*/g, tmpDateAry[1]);
            xmp_contant = xmp_contant.replace(/\*USERNAME\*/g, tmpdata["username"]);
            xmp_contant = xmp_contant.replace(/\*ALIAS\*/g, tmpdata["alias"]);
            tmp_out_data += xmp_contant
        }
        if (lazy_page == 1) {
            outdata += tmp_out_data;
            outdata += xmp_foot;
            showmain.innerHTML = outdata;
            parentClass.dispatchEvent("showLoading", {
                "showLoading": false
            })
        } else
            _self.table_append(showmain.children[1].children[0], tmp_out_data);
        _self.scroll_ver_event(scroll_e, dom.getElementById("ma_content"));
        _self.setLzayLoadingVisible(false);
        _self.startTimer()
    };
    _self.table_append = function(_Obj, str_append) {
        var tableObj = document.createElement("table");
        tableObj.innerHTML = str_append;
        var dolength = tableObj.rows.length;
        for (var i = 0; i < dolength; i++) {
            var retObj = tableObj.rows[0];
            _Obj.appendChild(retObj)
        }
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.exitEvent = function() {
        util.removeEvent(dom.getElementById("ma_content"), "scroll");
        return true
    };
    _self.backPage = function(e, param) {
        parentClass.dispatchEvent("backPage", {
            "retFun": _self.backPageComplete
        })
    };
    _self.backPageComplete = function() {};
    _self.changePage = function(e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.changePageComplete = function() {};
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname])
            eventHandler[eventname](param)
    };
    _self.getOnlineMem_count = function() {
        return onlineMem_count
    };
    _self.createTimer = function() {
        if (timerHash["online_mem"] != null)
            timerHash["online_mem"].clearObj();
        timerHash["online_mem"] = new Timer(config_set.get("ONLINE_MEM"));
        timerHash["online_mem"].setParentclass(_self);
        timerHash["online_mem"].dont_clear = false;
        timerHash["online_mem"].init();
        timerHash["online_mem"].addEventListener("TimerEvent.TIMER", _self.timerRun);
        timerHash["online_mem"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerComplete)
    };
    _self.startTimer = function() {
        timerHash["online_mem"].startTimer()
    };
    _self.stopTimer = function() {
        timerHash["online_mem"].stopTimer()
    };
    _self.clearTimer = function() {
        timerHash["online_mem"].clearObj();
        timerHash["online_mem"] = null
    };
    _self.timerRun = function() {
        _self.connetToServer();
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        })
    };
    _self.timerComplete = function() {};
    _self.checkShowLazyLoading = function(target) {
        if (!lazy_sw)
            return;
        var newScrollTop = target.scrollTop;
        var s_h = target.scrollHeight;
        var c_h = target.clientHeight;
        var scroll_bottom = newScrollTop >= s_h - c_h - footer_height * 1 - pb_height;
        if (scroll_bottom && !lazy_loading)
            if (lazy_page < lazy_total_page) {
                _self.setLzayLoadingVisible(true);
                retryTimer = setTimeout(_self.loadLazyData, 300)
            }
    };
    _self.setLzayLoadingVisible = function(isShow) {
        if (!lazy_sw)
            return;
        lazy_loading = isShow;
        dom.getElementById("report_loading").style.display = isShow ? "" : "none"
    };
    _self.loadLazyData = function() {
        if (!lazy_sw)
            return;
        lazy_loading = true;
        if (lazy_page < lazy_total_page) {
            lazy_page++;
            _self.parseData(dataHash)
        }
    };
    _self.initLazy = function() {
        lazy_sw = config_set.get("LAZY_SW") || false;
        lazy_page = 1;
        lazy_total_page = 1;
        var lazy_cnt = getView().viewportheight > 700 ? "LAZY_COUNT_BIG_PAGE" : "LAZY_COUNT";
        lazy_count = config_set.get(lazy_cnt) || 10
    };
    _self.reSetLazy = function(row0) {
        _self.initLazy();
        lazy_total_page = row0 ? Math.ceil(row0.length / lazy_count) : 1;
        if (lazy_total_page <= 0)
            lazy_total_page = 1
    }
};
