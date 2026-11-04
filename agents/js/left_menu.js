function left_menu(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var le_smallG;
    var accountM;
    var t_SU;
    var t_AG;
    var t_MEM;
    var t_Sub;
    var t_Retrieve;
    var reportS;
    var t_report;
    var t_analysis;
    var overView;
    var t_wmc;
    var layer;
    var downlayer;
    var menu_analysis;
    var account_class;
    _self.init = function() {
        util.echo("left load complete");
        layer = top.login_layer;
        if (layer == "co")
            downlayer = "su";
        else {
            if (layer == "su") {
                downlayer = "ag";
                account_class = "agent"
            } else if (layer == "ag") {
                downlayer = "mem";
                account_class = "member"
            }
            dom.getElementById("menu_account").classList.add(account_class)
        }
        le_smallG = dom.getElementById("le_smallG");
        util.addEvent(dom.getElementById("menu_home"), "click", _self.expendMenu, {
            "target": "home",
            "page": "dashboard_main",
            "id": "home"
        });
        util.addEvent(dom.getElementById("menu_account"), "click", _self.expendMenu, {
            "target": "account",
            "page": "acc_" + downlayer + "_list",
            "id": downlayer.toUpperCase()
        });
        util.addEvent(dom.getElementById("menu_report"), "click", _self.expendMenu, {
            "target": "report",
            "page": "report_main",
            "id": "report"
        });
        util.addEvent(dom.getElementById("menu_analysis"), "click", _self.expendMenu, {
            "target": "analysis",
            "page": "overView",
            "id": "analysis"
        });
        util.addEvent(dom.getElementById("menu_wmc"), "click", _self.expendMenu, {
            "target": "wmc",
            "id": "wmc"
        });
        util.addEvent(dom.getElementById("leftMask"), "click", _self.hideDiv, {
            "target": "home"
        });
        util.addEvent(dom.getElementById("le_close"), "click", _self.closeLeftPanel);
        util.addEvent(dom.getElementById("t_home"), "click", _self.expendMenu, {
            "target": "home",
            "page": "dashboard_main",
            "id": "home"
        });
        accountM = dom.getElementById("accountM");
        t_SU = dom.getElementById("t_SU");
        t_AG = dom.getElementById("t_AG");
        t_MEM = dom.getElementById("t_MEM");
        t_Sub = dom.getElementById("t_Sub");
        t_Retrieve = dom.getElementById("t_Retrieve");
        t_report = dom.getElementById("t_report");
        util.addEvent(t_report, "click", _self.expendMenu, {
            "page": "report_main",
            "target": "report",
            "id": "report"
        });
        t_analysis = dom.getElementById("t_analysis");
        util.addEvent(t_analysis, "click", _self.expendMenu, {
            "page": "overView",
            "target": "analysis",
            "id": "analysis"
        });
        t_wmc = dom.getElementById("t_wmc");
        util.addEvent(t_wmc, "click", _self.expendMenu, {
            "target": "wmc",
            "id": "wmc"
        });
        if (top.user_enable == "S") {
            dom.getElementById("menu_wmc").style.display = "none";
            t_wmc.style.display = "none"
        }
        menu_analysis = dom.getElementById("menu_analysis");
        if (top.user_type == 2 || top.user_type == 3)
            if (pri_type.indexOf("A") == -1) {
                dom.getElementById("menu_wmc").style.display = "none";
                t_wmc.style.display = "none";
                util.removeEvent(dom.getElementById("menu_wmc"), "click");
                util.removeEvent(t_wmc, "click")
            }
        if (top.login_layer == "su")
            t_SU.style.display = "none";
        if (top.login_layer == "ag") {
            t_SU.style.display = "none";
            t_AG.style.display = "none"
        }
        if (top.user_enable == "S") {
            menu_analysis.style.display = "none";
            t_analysis.style.display = "none"
        }
        if (top.retrieve_sw != "Y" || top.pay_type != "0" || top.user_enable != "Y")
            t_Retrieve.style.display = "none";
        if (top.user_type == 2 || top.user_type == 3) {
            t_Retrieve.style.display = "none";
            t_Sub.style.display = "none";
            if (pri_type.indexOf("A") == -1) {
                menu_analysis.style.display = "none";
                t_analysis.style.display = "none"
            }
            if (pri_type.indexOf("B") == -1) {
                dom.getElementById("menu_account").style.display = "none";
                accountM.style.display = "none"
            }
            if (pri_type.indexOf("C") == -1) {
                dom.getElementById("menu_report").style.display = "none";
                t_report.style.display = "none"
            }
        }
        if (t_SU.style.display != "none")
            util.addEvent(t_SU, "click", _self.expendMenu, {
                "page": "acc_su_list",
                "target": "account",
                "id": "SU"
            });
        if (t_AG.style.display != "none")
            util.addEvent(t_AG, "click", _self.expendMenu, {
                "page": "acc_ag_list",
                "target": "account",
                "id": "AG"
            });
        if (t_MEM.style.display != "none")
            util.addEvent(t_MEM, "click", _self.expendMenu, {
                "page": "acc_mem_list",
                "target": "account",
                "id": "MEM"
            });
        if (t_Sub.style.display != "none")
            util.addEvent(t_Sub, "click", _self.expendMenu, {
                "page": "acc_sub_list",
                "target": "account",
                "id": "Sub"
            });
        if (t_Retrieve.style.display != "none")
            util.addEvent(t_Retrieve, "click", _self.expendMenu, {
                "page": "retrieve_credit",
                "target": "account",
                "id": "Retrieve"
            })
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.chgPage = function(e, param) {
        param.retFun = _self.changePageComplete;
        if (param.page == "report_main")
            param.pageName = "report";
        if (param.page == "dashboard_main")
            param.pageName = "dashboard";
        parentClass.dispatchEvent("bodyGoToPage", param);
        if (param.page == "overView") {
            param.pageName = "overview";
            param.pageType = "totalbet"
        }
        parentClass.dispatchEvent("closeLeftMenu", {
            "retFun": _self.showComplete
        });
        top.mu_isOpen = "close";
        if (param.page == "totalbet_header" && param.tbet_showtype != undefined)
            top.tbet_showtype = param.tbet_showtype
    };
    _self.onFocusEventHandler = function(evt, param) {
        dom.getElementById("show_" + param.target).style.display = ""
    };
    _self.onBlurEventHandler = function(evt, param) {
        dom.getElementById("show_" + param.target).style.display = "none"
    };
    _self.showDiv = function(e, param) {
        dom.getElementById("menu_" + param.target).className = "le_" + param.target + " active"
    };
    _self.hideDiv = function(e, param) {
        if (param.target == "home") {
            var tmpAry = new Array("account", "report", "analysis");
            for (i = 0; i < tmpAry.length; i++) {
                var tmpObj = dom.getElementById("menu_" + tmpAry[i]);
                if (tmpObj.classList.contains("on_smallLi"))
                    tmpObj.className = "le_" + tmpAry[i] + " on_smallLi";
                else
                    tmpObj.className = "le_" + tmpAry[i]
            }
        } else {
            var tmpObj = dom.getElementById("menu_" + param.target);
            if (tmpObj.classList.contains("on_smallLi"))
                tmpObj.className = "le_" + param.target + " on_smallLi";
            else
                tmpObj.className = "le_" + param.target
        }
    };
    _self.openMenu = function() {
        le_smallG.style.display = "none";
        _self.sizeChange()
    };
    _self.closeMenu = function() {
        setTimeout(function() {
            le_smallG.style.display = ""
        }, 300);
        _self.sizeChange()
    };
    _self.closeLeftPanel = function() {
        top.mu_isOpen = "close";
        parentClass.dispatchEvent("closeLeftMenu", {
            "retFun": _self.showComplete
        })
    };
    _self.sizeChange = function() {
        var tmpObj = dom.getElementById("main");
        if (tmpObj) {
            tmpObj.classList.add("nofixed");
            setTimeout(function() {
                tmpObj.classList.remove("nofixed")
            }, 400)
        }
    };
    _self.showComplete = function() {
        util.echo("showComplete")
    };
    _self.expendMenu = function(e, param) {
        var le_class = param.id.toLowerCase();
        if (param.target == "wmc") {
            dom.getElementById("menu_wmc").className = "le_wmc";
            dom.getElementById("t_wmc").className = "le_wmc";
            _self.wmcOpen()
        } else {
            _self.chgColor(param);
            _self.chgPage(e, param);
            if (param.target != "home") {
                if (e.target.id.match(/^menu_/))
                    if (top.login_layer == "co")
                        dom.getElementById("menu_" + param.target).className = "le_" + param.target + " on_smallLi ";
                    else if (top.login_layer == "su" || top.login_layer == "ag")
                    dom.getElementById("menu_" + param.target).className = "le_" + param.target + " on_smallLi " + account_class;
                if (e.target.id.match(/^t_/))
                    dom.getElementById("t_" + param.id).className = "le_" + le_class + " le_titleOn"
            }
        }
    };
    _self.wmcOpen = function() {
        var obj = new Object;
        obj.filename = "app/wmc/index.php";
        obj.title = "_blank";
        parentClass.dispatchEvent("newOpenPageNoPar", obj)
    };
    _self.goToReportOld = function() {
        return false
    };
    _self.chgColor = function(param) {
        util.echo(param.target);
        util.echo("left menu chgColor");
        var menuAry = new Array("home", "account", "report", "analysis");
        var tit_rry = new Array("home", "report", "SU", "AG", "MEM", "Sub", "Retrieve", "analysis");
        for (i = 0; i < menuAry.length; i++) {
            dom.getElementById("menu_" + menuAry[i]).className = "le_" + menuAry[i];
            if (menuAry[i] == "account" && (top.login_layer == "su" || top.login_layer == "ag"))
                dom.getElementById("menu_" + menuAry[i]).classList.add(account_class)
        }
        for (i = 0; i < tit_rry.length; i++){ 
            dom.getElementById("t_" + tit_rry[i]).className = "le_" + tit_rry[i].toLowerCase();
        }
            
        if (param.target == "report")
            param.id = "report";
        else if (param.target == "home")
            param.id = "home";
        else if (param.target == "analysis")
            param.id = "analysis";
        if (menuAry.indexOf(param.target) != -1) {
            dom.getElementById("menu_" + param.target).classList.add("on_smallLi");
            if (typeof param.id != "undefined")
                dom.getElementById("t_" + param.id).classList.add("le_titleOn")
        }
    };
    _self.loadOverview = function() {
        var getHttp = new HttpRequest;
        getHttp.addEventListener("LoadComplete", _self.loadFinish);
        getHttp.loadURL(top.url, "POST", _self.getUrlParam())
    };
    _self.getUrlParam = function() {
        var sendCode = "";
        sendCode += "p=get_overview";
        sendCode += "&uid=" + top.uid;
        sendCode += "&login_layer=" + top.login_layer;
        sendCode += "&id=" + top.layer_id;
        return sendCode
    };
    _self.loadFinish = function(xml) {
        var gtypeAry = config_set.get("GTYPEARY");
        var timeAry = new Array("inplay", "today", "early", "outright", "parlay");
        var ary = JSON.parse(xml);
        var _status = util.showTxt(ary, "status");
        var total = new Array;
        for (var k = 0; k < timeAry.length; k++) {
            var time = timeAry[k];
            total[time] = 0
        }
        for (var j = 0; j < gtypeAry.length; j++) {
            var gtype = gtypeAry[j];
            for (var i = 0; i < timeAry.length; i++) {
                var time = timeAry[i];
                if (top.user_enable != "S")
                    total[time] += _status["period"][gtype][time]["bets"] * 1
            }
        }
        for (var k = 0; k < timeAry.length; k++) {
            var _time = timeAry[k];
            var _total = total[_time];
            document.getElementById(_time + "_total_S").innerHTML = _total;
            document.getElementById(_time + "_total_L").innerHTML = _total
        }
    }
};
