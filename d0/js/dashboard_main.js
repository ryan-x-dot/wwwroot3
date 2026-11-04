function dashboard_main(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "dashboard_main";
    var util;
    var LS;
    var config_set;
    var Timer;
    var timerHash;
    var hr = null;
    var eventHandler = new Object();
    var LS_code;

    //Ricky
    var report_btn;
    var acc_btn;
    var bet_btn;
    var amount_co;
    var amount_su;
    var amount_ag;
    var amount_mem;
    var credits;
    var balance;
    var lastdate;
    var logindate;
    var active;
    var inactive;
    var viewOnly;
    var viewOnly_br;
    var suspend;

    var co_count;
    var su_agent_count;
    var agent_count;
    var mem_count;
    var matchs_day;
    var matchs_yes;
    var match_today;
    var match_yesterday;
    var bets_day;
    var bets_yes;
    var bet_today;
    var bet_yesterday;

    var co_enable_Y;
    var co_enable_N;
    var co_pri_Y;
    var co_pri_N;
    var su_enable_Y;
    var su_enable_N;
    var su_pri_Y;
    var su_pri_N;
    var a_enable_Y;
    var a_enable_N;
    var a_pri_Y;
    var a_pri_N;
    var m_enable_Y;
    var m_enable_N;
    var m_pri_Y;
    var m_pri_N;
    var nowStatus = "Y";

    var da_MA;
    var da_A;
    var da_M;
    var nowOverView = "yes";
    var nowTurnOver = "tp";
    var nowWinLoss = "tp";
    var nowMembers = "tp";
    var nowPossess = "tp";
    var nowMem = "tp";

    var date_s = "";
    var date_e = "";
    var dashHash = new Object();
    var now_dash_type = "";
    var pri_type = top.pri_type;
    var cookie;
    var Storage;
    var yesterDay;
    var lastWeek;
    var thisPeriod;
    var storage_uid = top.uid;
    var use_Storage_code = ",possess,members,turnover,winloss,matchs";
    _self.init = function () {
        util.echo("dashboard_main load complete");

        _self.addEventListener("startTimer", _self.startTimer);
        _self.addEventListener("stopTimer", _self.stopTimer);
        _self.addEventListener("clearTimer", _self.clearTimer);
        _self.addEventListener("setNowDashboard", _self.setNowDashboard);


        report_btn = dom.getElementById("report_btn");
        acc_btn = dom.getElementById("acc_btn");
        bet_btn = dom.getElementById("bet_btn");
        credits = dom.getElementById("credits");
        balance = dom.getElementById("balance");
        logindate = dom.getElementById("last_login");
        lastdate = dom.getElementById("lastdate");


        //==== Performance Overview ====
        if ( top.user_type== 1 || pri_type.indexOf("C") != -1) {//報表
            yesterDay = dom.getElementById("per_yes");
            lastWeek = dom.getElementById("per_lw");
            thisPeriod = dom.getElementById("per_tp");
            util.addEvent(yesterDay, "click", _self.showPerformance, { "range": "yes" });
            util.addEvent(lastWeek, "click", _self.showPerformance, { "range": "lw" });
            util.addEvent(thisPeriod, "click", _self.showPerformance, { "range": "tp" });

            _self.getOverView();
        }else{
            dom.getElementById("box_per").style.display = "none";
            parentClass.dispatchEvent("showLoading", { "showLoading": false, "defalutPage": true });
        }
        //==== Account Overview ====
        if (top.user_type == 1 || pri_type.indexOf("B") != -1) { //帳號管理
            amount_co = dom.getElementById("amount_co");
            amount_su = dom.getElementById("amount_su");
            amount_ag = dom.getElementById("amount_ag");
            amount_mem = dom.getElementById("amount_mem");


            //==== Downline Status ====

            active = dom.getElementById("active");
            inactive = dom.getElementById("inactive");
            viewOnly = dom.getElementById("viewOnly");
            viewOnly_br = dom.getElementById("viewOnly_br");
            suspend = dom.getElementById("suspend");

            util.addEvent(active, "click", _self.show_Active);
            util.addEvent(inactive, "click", _self.show_Inactive);
            util.addEvent(viewOnly, "click", _self.show_ViewOnly);
            util.addEvent(viewOnly_br, "click", _self.show_ViewOnly);
            util.addEvent(suspend, "click", _self.show_Suspend);
        }else{
            dom.getElementById("downlineS").style.display = "none";
            dom.getElementById("box_acc").style.display = "none";
        }
        //==== Downline Status End====


        util.addEvent(acc_btn, "click", _self.chooseLayer);
        util.addEvent(report_btn, "click", _self.chgPage, { "page": "report_main", "type": "report", "pageName": "report" });
        //util.addEvent(bet_btn, "click", _self.chgPage, { "page": "totalbet_header", "type": "bet", "pageName": "bet" });
        //Dashboard-Total bet按鈕，按下後幫連接到Overview頁面
        util.addEvent(bet_btn, "click", _self.chgPage, { "page": "overView", "pageType": "totalbet", "pageName": "overview", "target":"analysis"});
        _self.addEventListener("choseDateEvent", _self.choseDateEvent);
        _self.addEventListener("viewReportTeach", _self.viewReportTeach);


        //判斷子帳號有哪些權限來隱藏header
        if (top.user_type != 1) {
            if (pri_type.indexOf("A") == -1) { //即時注單
                bet_btn.style.display = "none";
                util.removeEvent(bet_btn, "click");
            }
            if (pri_type.indexOf("B") == -1) { //帳號管理
                acc_btn.style.display = "none";
                util.removeEvent(acc_btn, "click");
            }
            if (pri_type.indexOf("C") == -1) { //報表
                report_btn.style.display = "none";
                util.removeEvent(report_btn, "click");
            }
        }

        _self.getTmpData();
        _self.initHttpRequest();
        //_self.getData();

        if (top.user_type == 1 || pri_type.indexOf("C") != -1) {//報表
            //==== Possess ====
            util.addEvent(dom.getElementById("possess_tp"), "click", _self.chgPossess, { "range": "tp" });
            util.addEvent(dom.getElementById("possess_lp"), "click", _self.chgPossess, { "range": "lp" });

            //==== Members ====
            util.addEvent(dom.getElementById("members_tp"), "click", _self.chgMembers, { "range": "tp" });
            util.addEvent(dom.getElementById("members_lp"), "click", _self.chgMembers, { "range": "lp" });

            //==== TurnOver ====
            util.addEvent(dom.getElementById("turnover_tp"), "click", _self.chgTurnOver, { "range": "tp" });
            util.addEvent(dom.getElementById("turnover_lp"), "click", _self.chgTurnOver, { "range": "lp" });

            //==== WinLoss ====
            util.addEvent(dom.getElementById("winloss_tp"), "click", _self.chgWinLoss, { "range": "tp" });
            util.addEvent(dom.getElementById("winloss_lp"), "click", _self.chgWinLoss, { "range": "lp" });

            _self.getPossess();
            _self.getMembers();
            _self.getTurnOver();
            _self.getWinLoss();
        } else {
            dom.getElementById("box_possess").style.display = "none";
            dom.getElementById("box_members").style.display = "none";
            dom.getElementById("box_turnover").style.display = "none";
            dom.getElementById("box_winloss").style.display = "none";
        }

        // _self.createTimer();
        // _self.startTimer();

        dom.body.addEventListener("touchstart", _self.touchStart);
        dom.body.addEventListener("touchmove", _self.touchMove);
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.onScroll);
        var tmp = dom.getElementsByTagName("CANVAS");
        for(var i = 0; i < tmp.length; i++){
            tmp[i].addEventListener("mousemove", _self.mouseOver);
        }
        //util.showMsg("你好吗");
        // dom.body.addEventListener("touchend", _self.touchEnd);
    }

    _self.mouseOver=function(e){
        var _id = e.target.id;
        now_dash_type = _id.split("_")[1];
    }

    _self.initHttpRequest = function () {
        var _time = config_set.get("RETRY_TIME");
        var _limit = config_set.get("RETRY_LIMIT");
        hr = new win.HttpRequestRetry(win.HttpRequest, _time, _limit);
        hr.setParentclass(_self);
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadComplete);
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        config_set = parentClass.getThis("config_set");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash");
        getView = parentClass.getThis("getView");
        cookie = parentClass.getThis("cookie");
        Storage = parentClass.getThis("Storage");
    }

    _self.getParentThis = function (varible) {
        return parentClass.getThis(varible);
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }

    //exit
    _self.exitEvent = function () {
        util.echo("dashboard_main exit");
        now_dash_type = "";
        hr.clearObj();
        _self.destroyDashboard();
        dom.body.removeEventListener("touchstart", _self.touchStart);
        dom.body.removeEventListener("touchmove", _self.touchMove);
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        var tmp = dom.getElementsByTagName("CANVAS");
        for(var i = 0; i < tmp.length; i++){
            tmp[i].removeEventListener("mousemove", _self.mouseOver);
        }
        // dom.body.removeEventListener("touchend", _self.touchEnd);
        return true;
    }

    _self.destroyDashboard = function () {
        for (var keys in dashHash) {
            dashHash[keys].destroy();
            dashHash[keys].hideToopTip();
        }
    }

    _self.touchStart = function (e) {
        var tag = e.target.tagName;

        writeLog("[touch start]" + tag);

        if (tag.toUpperCase() == "CANVAS") {
            var _id = e.target.id;
            now_dash_type = _id.split("_")[1];
        } else {
            _self.checkRepaint();
        }
    }

    _self.touchMove = function (e) {
        _self.checkRepaint();
    }

    _self.checkRepaint = function () {
        writeLog("[checkRepaint]" + now_dash_type);
        if (now_dash_type != "") {

            var tooltipEl = dom.getElementById('chartjs-tooltip');
            if (tooltipEl.style.opacity != 0) {

                writeLog("some tooltips show");
                if (dashHash[now_dash_type]) dashHash[now_dash_type].repaint();

            }
            // now_dash_type = "";
        }
    }

    _self.onScroll=function(e, param){
        if(now_dash_type!=""){
            dashHash[now_dash_type].repaint();
        }
    }


    _self.setNowDashboard = function (param) {
        now_dash_type = param.dash_type;
    }


    _self.choseDateEvent = function (param) {

        var postHash = new Object();
        postHash["report_kind"] = "A";
        postHash["report_type"] = "set";
        postHash["result_type"] = "Y";
        postHash["date_start"] = param.date;
        postHash["date_end"] = param.date;
        postHash["gtype"] = "ALL";
        postHash["wtype"] = "ALL";
        postHash["view_layer"] = top.login_layer;

        var param = new Object();
        param["page"] = "report_" + top.login_layer;
        param["post"] = "view_layer=" + top.login_layer;
        param["postHash"] = postHash;
        param["extendsClass"] = "report_index";

        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.viewReportTeach = function (param) {
        parentClass.dispatchEvent("viewReportTeach", param);
    }

    _self.createTimer = function () {

        timerHash["dashboard"] = new Timer(config_set.get("DASHBOARD"));
        timerHash["dashboard"].setParentclass(_self);
        //timerHash["dashboard"].dont_clear = true; //設定為不清除timer
        timerHash["dashboard"].init();
        timerHash["dashboard"].addEventListener("TimerEvent.TIMER", _self.timerRun);
        timerHash["dashboard"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerComplete);

    }

    _self.startTimer = function () {
        util.echo("dashboard startTimer");
        // timerHash["dashboard"].startTimer();
    }

    _self.stopTimer = function () {
        util.echo("dashboard stopTimer");
        timerHash["dashboard"].stopTimer();
    }

    _self.clearTimer = function () {
        util.echo("dashboard clearTimer");
        timerHash["dashboard"].clearObj();
    }

    _self.timerRun = function () {
        util.echo("DASHBOARD timer"); //每10秒做一次
        _self.getData();
    }

    _self.timerComplete = function () {
        util.echo("timerComplete"); //no complete
    }

    _self.getData = function () {
        //var url = util.getWebUrl()+"/transform.php";
        hr.loadURL(top.url, "POST", "p=get_dashboard&ver=" + top.ver);
    }

    //新管理端第一階段用
    _self.getTmpData = function () {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&user_id=" + top.user_id;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&langx=" + top.langx;
        urlParams += "&layer_id=" + top.layer_id;
        urlParams = "p=get_dashboard&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.LoadComplete);
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.onError = function () {
        util.echo("onError");
    }

    _self.LoadComplete = function (json) {
        util.echo(json);
        try {
            var hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
            if (hash["now_maxcredit"] == "-") {
                credits.innerHTML = "-";
                balance.innerHTML = "-";
            } else {
                // credits.innerHTML = _self.formatThousand(hash["now_maxcredit"] * 1);
                credits.innerHTML = util.mprintf(hash["now_maxcredit"] * 1, 0, 2, false, true);
                var tmp_balance = hash["now_maxcredit"] * 1 - hash["lv_maxcredit"] * 1;
                if (top.pay_type == "1") tmp_balance = hash["now_maxcredit"];
                // balance.innerHTML = _self.formatThousand(tmp_balance);
                balance.innerHTML = util.mprintf(tmp_balance * 1, 0, 2, false, true);
            }

            if (hash["logindate"] != "") {
                var detetime_arr = hash["logindate"].split(" ");
                var last_login = detetime_arr[0];
                logindate.innerHTML = last_login;
            }else{
                logindate.innerHTML = "-";
            }

            if (hash["lastdate"] != "") {
                lastdate.innerHTML = hash["lastdate"];
            }else{
                lastdate.innerHTML = "-";
            }



            amount_co.innerHTML = hash["amount_co"];
            amount_su.innerHTML = hash["amount_su"];
            amount_ag.innerHTML = hash["amount_ag"];
            amount_mem.innerHTML = hash["amount_mem"];

            co_count = dom.getElementById("co_count");
            su_agent_count = dom.getElementById("su_agent_count");
            agent_count = dom.getElementById("agent_count");
            mem_count = dom.getElementById("mem_count");


            da_MA = dom.getElementById("da_MA");
            da_A = dom.getElementById("da_A");
            da_M = dom.getElementById("da_M");
            //==== Downline Status ====
            if (top.user_type == 1 || pri_type.indexOf("B") != -1) { //帳號管理
                //預設
                co_count.innerHTML = hash["co_enable_Y"];
                su_agent_count.innerHTML = hash["su_enable_Y"];
                agent_count.innerHTML = hash["a_enable_Y"];
                mem_count.innerHTML = hash["m_enable_Y"];

                // 2019-06-20 566.子帳號-無管理帳戶（更改和觀看）的權限-從首頁的下線狀態點擊，在點擊帳號-就可以到修改頁面(PJP-688)
                // >>這點請幫在首頁點擊下線狀態時, 不要有作用;快速搜索頁面點擊帳號名稱, 也不要有作用 - Roy
                if (!(top.user_type != "1" && top.pri_type.indexOf("B1") == -1)){
                    if(hash.hasOwnProperty("ad_enable_Y")){
                        util.addEvent(dom.getElementById("ad_count"), "click", _self.goToQuick, { "search_type": "d0" });
                    }
                    util.addEvent(co_count, "click", _self.goToQuick, { "search_type": "co" });
                    util.addEvent(su_agent_count, "click", _self.goToQuick, { "search_type": "ma" });
                    util.addEvent(agent_count, "click", _self.goToQuick, { "search_type": "ag" });
                    util.addEvent(mem_count, "click", _self.goToQuick, { "search_type": "mem" });
                }

                //Active
                co_enable_Y = hash["co_enable_Y"];
                su_enable_Y = hash["su_enable_Y"];
                a_enable_Y = hash["a_enable_Y"];
                m_enable_Y = hash["m_enable_Y"];

                //Inactive
                co_enable_N = hash["co_enable_N"];
                su_enable_N = hash["su_enable_N"];
                a_enable_N = hash["a_enable_N"];
                m_enable_N = hash["m_enable_N"];

                //ViewOnly
                co_pri_Y = hash["co_pri_Y"];
                su_pri_Y = hash["su_pri_Y"];
                a_pri_Y = hash["a_pri_Y"];
                m_pri_Y = hash["m_pri_Y"];

                //Suspend
                co_pri_N = hash["co_pri_N"];
                su_pri_N = hash["su_pri_N"];
                a_pri_N = hash["a_pri_N"];
                m_pri_N = hash["m_pri_N"];
            }
            //==== Downline Status End====
        } catch (e) {
            util.echo("onError");
            //show error
            return;
        }
    }

    _self.goToQuick = function (e, obj) {
        var paramHash = new Object();
        paramHash["search_layer"] = top.login_layer;
        paramHash["search_id"] = top.layer_id;
        paramHash["search_type"] = obj.search_type;
        paramHash["enable"] = nowStatus

        var obj = new Object();
        obj["page"] = "quick_search";
        obj["postHash"] = paramHash;
        parentClass.dispatchEvent("bodyGoToPage", obj);
    }

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }

    _self.show_Active = function () {
        nowStatus = "Y";
        active.className = "on";
        inactive.className = "";
        viewOnly.className = "hide_on_mini_only hide_on_med_only";
        viewOnly_br.className = "re_title_br hide_on_small_only hide_on_large_only";
        suspend.className = "";


        co_count.innerHTML = co_enable_Y;
        su_agent_count.innerHTML = su_enable_Y;
        agent_count.innerHTML = a_enable_Y;
        mem_count.innerHTML = m_enable_Y;
    }
    _self.show_Inactive = function () {
        nowStatus = "N";
        active.className = "";
        inactive.className = "on";
        viewOnly.className = "hide_on_mini_only hide_on_med_only";
        viewOnly_br.className = "re_title_br hide_on_small_only hide_on_large_only";
        suspend.className = "";

        co_count.innerHTML = co_enable_N;
        su_agent_count.innerHTML = su_enable_N;
        agent_count.innerHTML = a_enable_N;
        mem_count.innerHTML = m_enable_N;
    }
    _self.show_ViewOnly = function () {
        nowStatus = "S";
        active.className = "";
        inactive.className = "";
        viewOnly.className = "hide_on_mini_only hide_on_med_only on";
        viewOnly_br.className = "re_title_br hide_on_small_only hide_on_large_only on";
        suspend.className = "";

        co_count.innerHTML = co_pri_Y;
        su_agent_count.innerHTML = su_pri_Y;
        agent_count.innerHTML = a_pri_Y;
        mem_count.innerHTML = m_pri_Y;
    }

    _self.show_Suspend = function () {
        nowStatus = "F";
        active.className = "";
        inactive.className = "";
        viewOnly.className = "hide_on_mini_only hide_on_med_only";
        viewOnly_br.className = "re_title_br hide_on_small_only hide_on_large_only";
        suspend.className = "on";

        co_count.innerHTML = co_pri_N;
        su_agent_count.innerHTML = su_pri_N;
        agent_count.innerHTML = a_pri_N;
        mem_count.innerHTML = m_pri_N;
    }

    _self.show_Match = function (e,param) {
        var green_num = 0 ,red_num = 0,mm=matchs_day;
        if(param.range == "yes"){
            mm = matchs_yes;
            match_today.className = "";
            match_yesterday.className="on";
        }else{
            match_today.className = "on";
            match_yesterday.className="";
        }
        for(var i in mm){
            dom.getElementById("match_green_"+i).innerHTML = mm[i]["green"];
            dom.getElementById("match_red_"+i).innerHTML = mm[i]["red"];
            green_num += mm[i]["green"];
            red_num += mm[i]["red"];
        }

        dom.getElementById("match_green_SUM").innerHTML = green_num;
        dom.getElementById("match_red_SUM").innerHTML = red_num;

    }

    _self.show_Bets = function (e,param) {
        var green_num = 0 ,red_num = 0,green_money = 0 ,red_money = 0,mm=bets_day;
        if(param.range == "yes"){
            mm = bets_yes;
            bet_today.className = "";
            bet_yesterday.className="on";
        }else{
            bet_today.className = "on";
            bet_yesterday.className="";
        }
        for(var i in mm){
            dom.getElementById("bet_green_num_"+i).innerHTML = mm[i]["num"]["green"];
            dom.getElementById("bet_green_money_"+i).innerHTML = mm[i]["money"]["green"];
            dom.getElementById("bet_red_num_"+i).innerHTML = mm[i]["num"]["red"];
            dom.getElementById("bet_red_money_"+i).innerHTML = mm[i]["money"]["red"];
            green_num += mm[i]["num"]["green"];
            green_money += mm[i]["money"]["green"];
            red_num += mm[i]["num"]["red"];
            red_money += mm[i]["money"]["red"];
        }
        dom.getElementById("bet_green_num_SUM").innerHTML = green_num;
        dom.getElementById("bet_green_money_SUM").innerHTML = green_money;
        dom.getElementById("bet_red_num_SUM").innerHTML = red_num;
        dom.getElementById("bet_red_money_SUM").innerHTML = red_money;
    }

    _self.showPerformance = function (e, param) {
        util.echo("showPerformance");
        if (param.range == "yes") {
            yesterDay.className = "on";
            lastWeek.className = "";
            thisPeriod.className = "";
        } else if (param.range == "lw") {
            yesterDay.className = "";
            lastWeek.className = "on";
            thisPeriod.className = "";
        } else if (param.range == "tp") {
            yesterDay.className = "";
            lastWeek.className = "";
            thisPeriod.className = "on";
        }
        nowOverView = param.range;
        _self.getOverView();
    }

    //==== OverView ====
    _self.getOverView = function () {
        if (top.user_type != 1 && pri_type.indexOf("C") == -1) return;//報表
        _self.get_performace("overview", nowOverView, _self.getOverViewComplete);
    }


    _self.getOverViewComplete = function (json) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return;
        }

        if (hash["status"] == "200") {
            var resultObj = dom.getElementById("per_result");
            var profitObj = dom.getElementById("per_profit");
            var stockObj = dom.getElementById("per_stock");

            resultObj.innerHTML = hash["result"];
            profitObj.innerHTML = hash["profit"];
            stockObj.innerHTML = hash["stock"];

            resultObj.classList.remove("word_red");
            profitObj.classList.remove("word_red");
            stockObj.classList.remove("word_red");

            if (parseFloat(hash["result"])<0) resultObj.classList.add("word_red");
            if (hash["profit"].substring(0, 1) == "-") profitObj.classList.add("word_red");
            if (parseFloat(hash["stock"])<0) stockObj.classList.add("word_red");

            _self.setSysMsgVisible("po", false);
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "term_all") {
                _self.setSysMsgVisible("po", true);
            } else {
                util.showErrorMsg(msg);
            }
        }
        parentClass.dispatchEvent("showLoading", { "showLoading": false, "defalutPage": true });
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "home" });
    }

    _self.setSysMsgVisible = function (type, isShow) {
        dom.getElementById("div_" + type).style.display = isShow ? "none" : "";
        dom.getElementById("sysmsg_" + type).style.display = isShow ? "" : "none";
    }

    function labelsCustom() {
        var dataArray = [];

        for (var i = 1; i <= 28; i++) {
            dataArray.push(i);
        }

        return dataArray;
    }

    function dataCustom(dtype) {
        var dataArray = [68, 90, 590, 606, 25, 182, 642, 480, 786, 744, 167, 238, 445, 296, 6, 346, 70, 569, 734, 143, 461, 561, 732, 83, 367, 639, 378, 490];
        return dataArray;
        for (var i = 0; i < 28; i++) {
            if (dtype == '+') {
                dataArray.push(Math.round((Math.random() * 800)));
            }
            if (dtype == '-') {
                dataArray.push(Math.round((Math.random() * 900) - 350));
            }
        }

        return dataArray;
    }

    //==== Possess ====
    _self.getPossess = function () {
        _self.get_performace("possess", nowPossess, _self.getPossessComplete);
    }

    _self.getPossessComplete = function (json,isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return;
        }

        if (hash["status"] == "200") {
            if(!isStorage){
                Storage.set(top.login_layer+top.user_id+storage_uid+hash["data"]["code"]+hash["data"]["pdate"]+top.langx+top.ver,json,1/24);
            }
            var click_flag = true;
            //if(hash["data"]["pdate"] == "tp")click_flag=true;
            //else click_flag=false;

            var labelAry = _self.getLabel(hash["data"]["value"]);

            var showObj = dom.getElementById("show_possess");
            if (dashHash["possess"] != null) dashHash["possess"].destroy();
            dashHash["possess"] = new win.dashboard(win, dom);
            dashHash["possess"].setParentclass(_self);
            dashHash["possess"].init();
            dashHash["possess"].show("possess", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"],click_flag);
            _self.setSysMsgVisible("possess", false);
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039") {
                _self.setSysMsgVisible("possess", true);
            } else {
                util.showErrorMsg(msg);
            }
        }
    }

    //==== Members ====
    _self.getMembers = function () {
        _self.get_performace("members", nowMembers, _self.getMembersComplete);
    }

    _self.getMembersComplete = function (json,isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return;
        }

        if (hash["status"] == "200") {
            if(!isStorage){
                Storage.set(top.login_layer+top.user_id+storage_uid+hash["data"]["code"]+hash["data"]["pdate"]+top.langx+top.ver,json,1/24);
            }
            var click_flag=false;
            if(hash["data"]["pdate"] == "tp")click_flag=true;
            else click_flag=false;

            var labelAry = _self.getLabel(hash["data"]["value"]);

            var showObj = dom.getElementById("show_members");
            if (dashHash["members"] != null) dashHash["members"].destroy();
            dashHash["members"] = new win.dashboard(win, dom);
            dashHash["members"].setParentclass(_self);
            dashHash["members"].init();
            dashHash["members"].show("members", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"],click_flag);
            _self.setSysMsgVisible("members", false);
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039") {
                _self.setSysMsgVisible("members", true);
            } else {
                util.showErrorMsg(msg);
            }
        }
    }



    //==== TurnOver ====
    _self.getTurnOver = function () {
        _self.get_performace("turnover", nowTurnOver, _self.getTurnOverComplete);
    }


    _self.getTurnOverComplete = function (json,isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return;
        }

        if (hash["status"] == "200") {
            if(!isStorage){
                Storage.set(top.login_layer+top.user_id+storage_uid+hash["data"]["code"]+hash["data"]["pdate"]+top.langx+top.ver,json,1/24);
            }
            var click_flag=false;
            if(hash["data"]["pdate"] == "tp")click_flag=true;
            else click_flag=false;

            var labelAry = _self.getLabel(hash["data"]["value"]);

            var showObj = dom.getElementById("show_turnover");
            if (dashHash["turnover"] != null) dashHash["turnover"].destroy();
            dashHash["turnover"] = new win.dashboard(win, dom);
            dashHash["turnover"].setParentclass(_self);
            dashHash["turnover"].init();
            dashHash["turnover"].show("turnover", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"],click_flag);
            _self.setSysMsgVisible("turnover", false);
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039") {
                _self.setSysMsgVisible("turnover", true);
            } else {
                util.showErrorMsg(msg);
            }
        }
    }

    //==== WinLoss ====
    _self.getWinLoss = function () {
        _self.get_performace("winloss", nowWinLoss, _self.getWinLossComplete);
    }

    _self.getWinLossComplete = function (json,isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return;
        }

        if (hash["status"] == "200") {
            if(!isStorage){
                Storage.set(top.login_layer+top.user_id+storage_uid+hash["data"]["code"]+hash["data"]["pdate"]+top.langx+top.ver,json,1/24);
            }
            var click_flag=false;
            if(hash["data"]["pdate"] == "tp")click_flag=true;
            else click_flag=false;

            var labelAry = _self.getLabel(hash["data"]["value"]);
            var showObj = dom.getElementById("show_winloss");
            if (dashHash["winloss"] != null) dashHash["winloss"].destroy();
            dashHash["winloss"] = new win.dashboard(win, dom);
            dashHash["winloss"].setParentclass(_self);
            dashHash["winloss"].init();
            dashHash["winloss"].show("winloss", showObj, labelAry, hash["data"]["value"],hash["data"]["date"], hash["data"]["org_date"],click_flag);
            _self.setSysMsgVisible("winloss", false);
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039") {
                _self.setSysMsgVisible("winloss", true);
            } else {
                util.showErrorMsg(msg);
            }
        }
    }

    _self.getLabel = function (data) {
        var ret = new Array();
        var singleDay = getView().viewportwidth < 768;

        for (var i = 0; i < data.length; i++) {
            ret[i] = i + 1;
        }

        return ret;
    }

    _self.chgPossess = function (e, param) {
        nowPossess = param.range;
        dom.getElementById("possess_tp").classList.remove("on");
        dom.getElementById("possess_lp").classList.remove("on");
        dom.getElementById("possess_" + nowPossess).classList.add("on");
        _self.getPossess();
    }

    _self.chgMembers = function (e, param) {
        nowMembers = param.range;
        dom.getElementById("members_tp").classList.remove("on");
        dom.getElementById("members_lp").classList.remove("on");
        dom.getElementById("members_" + nowMembers).classList.add("on");
        _self.getMembers();
    }

    _self.chgTurnOver = function (e, param) {
        nowTurnOver = param.range;
        dom.getElementById("turnover_tp").classList.remove("on");
        dom.getElementById("turnover_lp").classList.remove("on");
        dom.getElementById("turnover_" + nowTurnOver).classList.add("on");
        _self.getTurnOver();
    }

    _self.chgWinLoss = function (e, param) {
        nowWinLoss = param.range;
        dom.getElementById("winloss_tp").classList.remove("on");
        dom.getElementById("winloss_lp").classList.remove("on");
        dom.getElementById("winloss_" + nowWinLoss).classList.add("on");
        _self.getWinLoss();
    }



    _self.get_performace = function (code, _date, retFun) {
        if(use_Storage_code.indexOf(","+code+",")!=-1){
            var cdata=Storage.get(top.login_layer+top.user_id+storage_uid+code+_date+top.langx+top.ver);
            if(cdata!=null){
                retFun(cdata,true);
                return;
            }
        }
        var param = "";
        param += top.param;
        param += "&p=get_performance";
        param += "&code=" + code;
        param += "&date=" + _date;
        param += "&langx=" + top.langx;

        if (code == "overview") {
            param += "&report_kind=A";
            param += "&result_type=Y";
            param += "&gtype=";
            param += "&wtype=";
            param += "&langx=" + top.langx;

        }

        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
        hr.setParentclass(_self);
        hr.addEventListener("onError", _self.perOnError);
        hr.addEventListener("LoadComplete", retFun);
        hr.loadURL(top.url, "POST", param);
    }

    _self.perOnError = function () {

    }

    _self.formatThousand = function (num) {
        num = num + "";
        var tmp = num.split(".");
        num = tmp[0];
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) {
            num = num.replace(re, "$1,$2");
        }
        if (tmp.length > 1) {
            num = num + "." + tmp[1];
        }
        return num;
    }


    _self.chgPage = function (e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
        //_self.hideDiv(e, param);
    }

    _self.chooseLayer = function () {
        parentClass.dispatchEvent("chooseLayer", {});
    }


    _self.hideDiv = function (e, param) {
        dom.getElementById("show_" + param.type).style.display = "none";
        //dom.getElementById("menu_"+param.type).className = "le_"+param.type;
    }

    function writeLog(msg) {

        // var _url = util.getWebUrl() + "/lib/write_log.php";
        // var param = "";
        // param+="user="+top.username;
        // param+="&msg="+encodeURIComponent(msg);

        // var hr = new win.HttpRequest();
        // hr.addEventListener("LoadComplete", _self.emptyFun);
        // hr.loadURL(_url,"POST",param);

    }
}