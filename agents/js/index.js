function index(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "index";
    var classHash = new Object;
    var _top = new Object;
    var timerHash = new Object;
    var pageHash = new Object;
    var util = new win.util(win, dom);
    var config_set = new win.config_set;
    var Timer = win.Timer;
    var LS;
    var LS_code;
    var LS_report;
    var LS_account;
    var getView = win.getView;
    var fastTemplate_a1 = win.fastTemplate_a1;
    var cookie = new CookieManager;
    var Storage = new LocalstorageManager;
    var selLayer = "A";
    var cache_html_sw = false;
    var topFrame = null;
    var leftFrame = null;
    var footFrame = null;
    var bodyFrame = null;
    var alertFrame = null;
    var alertChooseFrame = null;
    var noticeFrame = null;
    var annoFrame = null;
    var filterFrame = null;
    var detailFrame = null;
    var teachFrame = null;
    var loginFrame;
    var homePage = false;
    var eventHandler = new Object;
    var first_load = false;
    var failCount = new Object;
    var retryTimer;
    var originHeight = 0;
    var codeAlert = null;
    var setTimeContainer = null;
    var codeAlertClassName;
    var defalutPage = false;
    var filter_set = new Object;
    var arr_check_all_div = {
        "top_menu_show": false,
        "left_menu_show": false,
        "alert_show": false,
        "newnote_show": false,
        "anno_show": false,
        "footer_show": false
    };
    win._history = new Array;
    top.url = util.getWebUrl() + "/transform.php";
    top.param = "";
    top.keep_head = ",index,top_menu,left_menu,footer,alert_msg,lpChatStyle,lpStyle,lpDragAccessibilityStyle,";
    top.popWindow = new Object;
    _self.init = function() {
        chk_iOSversion();
        for (var key in arr_check_all_div)
            arr_check_all_div[key] = false;
        _self.clearAllOpenWindow();
        _self.chg_langx(top.ls);
        config_set.init();
        _self.lockScaled();
        if (win.addEventListener)
            win.addEventListener("popstate", _self.popstate);
        if (win.addEventListener)
            win.addEventListener("orientationchange", _self.Allorientation);
        _self.addEventListener("bodyGoToPage", _self.bodyGoToPage);
        _self.addEventListener("goToPage", _self.goToPageEvent);
        _self.addEventListener("newOpenPage", _self.newOpenPageEvent);
        _self.addEventListener("newOpenPageNoPar", _self.newOpenPageNoParEvent);
        _self.addEventListener("showLoading", _self.showLoading);
        _self.addEventListener("backPage", _self.backPage);
        _self.addEventListener("hideDiv", _self.hideDiv);
        _self.addEventListener("chgPwdSafe", _self.chgPwdSafe);
        _self.addEventListener("chgLoginID", _self.chgLoginID);
        _self.addEventListener("chgPwd", _self.chgPwd);
        _self.addEventListener("forgotPwd", _self.forgotPwd);
        _self.addEventListener("show_requirements", _self.show_requirements);
        _self.addEventListener("backToIdex", _self.backToIdex);
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("hideAlertMsg", _self.hideAlertMsg);
        _self.addEventListener("showAlertChooseMsg", _self.showAlertChooseMsg);
        _self.addEventListener("hideAlertChooseMsg", _self.hideAlertChooseMsg);
        _self.addEventListener("showAnno", _self.showAnno);
        _self.addEventListener("hideAnno", _self.hideAnno);
        _self.addEventListener("chgPageName", _self.chgPageName);
        _self.addEventListener("showFilter", _self.showFilter);
        _self.addEventListener("showOverviewFilter", _self.showOverviewFilter);
        _self.addEventListener("hideFilter", _self.hideFilter);
        _self.addEventListener("changeFilter", _self.changeFilter);
        _self.addEventListener("showFilterLoading", _self.showFilterLoading);
        _self.addEventListener("closeFilterLoading", _self.closeFilterLoading);
        _self.addEventListener("openLeftMenu", _self.openLeftMenu);
        _self.addEventListener("closeLeftMenu", _self.closeLeftMenu);
        _self.addEventListener("closeNote", _self.closeNote);
        _self.addEventListener("closeNotice", _self.closeNotice);
        _self.addEventListener("showReportDetail", _self.showReportDetail);
        _self.addEventListener("hideReportDetail", _self.hideRightDetail);
        _self.addEventListener("showCenterDiv", _self.showCenterDiv);
        _self.addEventListener("hidePopUpDiv", _self.hidePopUpDiv);
        _self.addEventListener("showAccDetail", _self.showAccDetail);
        _self.addEventListener("hideAccDetail", _self.hideRightDetail);
        _self.addEventListener("showMemHistory", _self.showMemHistory);
        _self.addEventListener("hideMemHistory", _self.hideCenterDetail);
        _self.addEventListener("showProblemAccDetail", _self.showProblemAccDetail);
        _self.addEventListener("hideProblemAccDetail", _self.hideRightDetail);
        _self.addEventListener("viewReportTeach", _self.viewReportTeach);
        _self.addEventListener("hideReportTeach", _self.hideReportTeach);
        _self.addEventListener("showReport", _self.showReport);
        _self.addEventListener("showFadeOutMesg", _self.showFadeOutMesg);
        _self.addEventListener("AnnCountBroadcastData", _self.AnnCountBroadcastData);
        _self.addEventListener("getPromblemCount", _self.getPromblemCount);
        _self.addEventListener("backToTop", _self.backToTop);
        _self.addEventListener("chooseLayer", _self.chooseLayer);
        _self.addEventListener("chgLeftMenuColor", _self.chgLeftMenuColor);
        _self.addEventListener("chgLangx", _self.chgLangx);
        _self.addEventListener("loadImportantAnno", _self.loadImportantAnno);
        _self.addEventListener("SetConfirmExit", _self.SetConfirmExit);
        _self.addEventListener("CloseConfirmExit", _self.CloseConfirmExit);
        _self.addEventListener("ConfirmExitAlert", _self.ConfirmExitAlert);
        _self.addEventListener("showResultDetail", _self.showResultDetail);
        _self.addEventListener("hideResultDetail", _self.hideRightDetail);
        _self.addEventListener("show_modal_step", _self.show_modal_step);
        _self.addEventListener("set_modal_step", _self.set_modal_step);
        _self.addEventListener("show_add_user_btn", _self.show_add_user_btn);
        _self.addEventListener("set_add_user", _self.set_add_user);
        if (top.rightChg == "Y") {
            _self.clearAllTimer(true);
            _self.hideDiv({
                "target": "acc_show"
            })
        } else if (util.chg_site()) {
            var protocol = dom.location.protocol;
            window.location.href = protocol + "//" + document.domain + "/app/outdated_browser.php?langx=" + top.langx
        } else {
            _self.goToPage("acc_show", "login", function() {
                loginFrame = new win.login(win, dom);
                loginFrame.setParentclass(_self);
                loginFrame.init()
            }, {});
            util.setParentclass(_self)
        }
        try {
            var load_name = dom.getElementById("load_txt");
            load_name.innerHTML = LS.get("loading_txt");
            var load_requirements = load_name.getElementsByTagName("a")[0];
            util.addEvent(load_requirements, "click", _self.go_requirements);
            var load_name02 = dom.getElementById("load_txt02");
            load_name02.innerHTML = LS.get("loading_txt");
            var load_requirements2 = load_name02.getElementsByTagName("a")[0];
            util.addEvent(load_requirements2, "click", _self.go_requirements)
        } catch (e) {}
        var tarDiv = dom.getElementById("body_show");
        var tarObj = new Object;
        tarObj["menu"] = dom.getElementById("top_menu_show");
        tarObj["main"] = dom.getElementById("dashboard_main");
        tarObj["backtop"] = dom.getElementById("backtop");
        var retFun = function(e) {
            util.checkScrollToHide(e, tarObj)
        };
        util.addEvent(dom.getElementById("backtop"), "click", _self.backToTop);
        try {
            codeAlert = dom.getElementById("codeAlert");
            codeAlertClassName = codeAlert.className;
            codeMsg = dom.getElementById("codeMsg");
            dom.addEventListener("touchmove", _self.doOnTouchMove);
            dom.getElementById("body_show").addEventListener("touchmove", _self.doOnTouchMove);
            lockscroll = new bodyPreventDefault;
            lockscroll.init()
        } catch (e) {}
    };
    _self.Allorientation = function() {
        var orientation = win.Math.abs(win.orientation);
        if (orientation == 90) {
            dom.body.scrollTop = 0;
            setTimeout(function() {
                window.scrollTo(0, 1)
            }, 500)
        } else {
            var mainObj = dom.getElementById("main");
            mainObj.className = "main_rotate";
            setTimeout(function() {
                mainObj.className = "main"
            }, 500)
        }
        document.getElementById("viewport").setAttribute("content", "width=device-width, initial-scale=1.0,user-scalable=no");
        _self.sizeChange()
    };
    _self.sizeChange = function() {
        var tmpObj = dom.getElementById("main");
        if (tmpObj) {
            tmpObj.classList.add("nofixed");
            setTimeout(function() {
                tmpObj.classList.remove("nofixed")
            }, 450)
        }
    };
    _self.chgLangx = function(param) {
        if (bodyFrame && bodyFrame.exitConfirm && !bodyFrame.LeaveChk && !param.LeaveChkPass) {
            dom.getElementById("alert_choose_show").style.display = "none";
            return _self.exitConfirm(_self.chgLangx, param, bodyFrame.exitConfirm)
        }
        top.ls = param.ls;
        top.langx = param.langx;
        selLayer = param.selLayer;
        if (param.rightChg == "Y")
            top.rightChg = "Y";
        else
            top.rightChg = "N";
        _self.init();
        dom.getElementById("alert_choose_show").style.display = "none"
    };
    _self.clearAllOpenWindow = function() {
        for (var i in top.popWindow)
            try {
                if (!top.popWindow[i].closed)
                    top.popWindow[i].window.close()
            } catch (e) {}
    };
    _self.chg_langx = function(ls) {
        LS = eval("new LS_" + ls + "();");
        LS_code = eval("new LS_code_" + ls + "();");
        LS_report = eval("new LS_report_" + ls + "();");
        LS_account = eval("new LS_account_" + ls + "();");
        LS.init();
        LS_code.init();
        LS_report.init();
        LS_account.init()
    };
    _self.backToTop = function() {
        dom.getElementById("ma_content").scrollTop = 0
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.addCSSretry = function() {
        var ary = dom.getElementsByTagName("link");
        for (var i = 0; i < ary.length; i++)
        ;
    };
    _self.showLoading = function(param) { 
        if (!defalutPage) {
            defalutPage = param.defalutPage;
            if (param.defalutPage && !param.showLoading)
                _self.setLoadingVisible(param.showLoading)
        } else
            _self.setLoadingVisible(param.showLoading)
    };
    _self.setLoadingVisible = function(isShow) {
        if (first_load)
            dom.getElementById("loading").style.display = isShow ? "" : "none"
    };
    _self.bodyGoToPage = function(param) {
        if (!defalutPage && param.page != "dashboard_main")
            return;
        if (bodyFrame && bodyFrame.exitConfirm && !bodyFrame.LeaveChk && !param.LeaveChkPass) {
            _self.exitConfirm(_self.bodyGoToPage, param, bodyFrame.exitConfirm);
            return
        } else {
            dom.getElementById("top_menu_show").className = "ma_header";
            dom.getElementById("dashboard_main").className = "ma_main";
            dom.getElementById("left_menu_show").className = "ma_left";
            if (top.mu_isOpen == "open")
                dom.getElementById("left_menu_show").classList.add("ma_extend");
            if (topFrame)
                topFrame.onKeyBoardOpen(false);
            dom.getElementById("body_show").className = "ma_body body_pb";
            _self.setLoadingVisible(true);
            var ret = false;
            if (bodyFrame && bodyFrame.exitEvent)
                ret = bodyFrame.exitEvent();
            else
                ret = true;
            var main_header = dom.getElementById("main_header");
            var page_name = dom.getElementById("page_name");
            if (win._history.length > 0)
                if (param.page == "dashboard_main") {
                    topFrame.closebackBtn();
                    win._history = new Array;
                    homePage = true;
                    main_header.style.display = "none";
                    page_name.style.display = "none"
                } else {
                    homePage = false;
                    topFrame.openbackBtn();
                    main_header.style.display = "";
                    page_name.style.display = ""
                }
            if (ret) {
                ret = _self.clearAllTimer();
                if (ret)
                    _self.goToPage("body_show", param.page, _self.definedParent, param)
            }
        }
    };
    _self.definedParent = function(param) {
        try {
            var obj = classHash[param.page];
            if (param["extendsClass"])
                obj = util.extendsClass(eval("new " + param["extendsClass"] + "(win,dom,param.postHash)"), eval(param.page), win, dom, param["postHash"]);
            else
                obj = eval("new " + param.page + "(win,dom,param.postHash);");
            if (param.isTrans == "Y") {
                var parantClass = param.parentClass != null ? param.parentClass : _self;
                obj.setParentclass(parantClass);
                obj.init();
                if (param.retChild)
                    param.retChild(obj)
            } else {
                bodyFrame = obj;
                bodyFrame.setParentclass(_self);
                bodyFrame.init()
            }
        } catch (e) {
            util.err("[definedParent][" + param.page + "]", e)
        }
        _self.backToTop();
        if ((param.back != "Y" || homePage) && param.isTrans != "Y")
            _self.pushHistory(param, "", param.page);
        if (param.retFun)
            param.retFun(param.retParam);
        if (param.pageName)
            _self.chgPageName({
                "pageType": param.pageType,
                "pageName": param.pageName,
                "uniqText": param.uniqText
            })
    };
    _self.chgPageName = function(param) {
        if (topFrame)
            topFrame.setPageName(param)
    };
    _self.changePage = function(e, param) {
        var target = {
            "target": "rightPanel"
        };
        _self.chgLeftMenuColor(target);
        _self.bodyGoToPage(param)
    };
    // _self.showReportDetail = function(param) {
    //     param.parse = "Y";
    //     param.page = "report_detail";
    //     _self.showRigthDetail(param, _self.show_report_detail)
    // };
    
      _self.showReportDetail = function(param) {
        param.parse = "Y";
        param.page = "report_detail";
        if (param.isFrom != null && param.isFrom == "report_index") _self.showCenterDetail(param, _self.show_center_report_detail);
        else _self.showRigthDetail(param, _self.show_report_detail)
    };
    _self.show_center_report_detail = function() {
        _self.showCenterDiv(true)
    };
    _self.showAccDetail = function(param) {
        param.parse = "Y";
        param.page = "acc_detail";
        if (param.isFrom != null && param.isFrom == "report_index") _self.showCenterDetail(param, _self.show_center_acc_detail);
        else _self.showRigthDetail(param, _self.show_acc_detail)
    };
    _self.show_center_acc_detail = function() {
        _self.showCenterDiv(true)
    };
     _self.showCenterDiv = function(isShow) {
        dom.getElementById("center_show").style.display = isShow ? "": "none";
        if (!isShow) {
            dom.getElementById("center_show").innerHTML = "";
            detailFrame = null
        }
    };
      _self.hidePopUpDiv = function(param = null) {
        if (param != null && param.isFrom == "report_index") _self.showCenterDiv(false);
        else _self.hideRightDetail(param)
    };
    
    _self.show_report_detail = function() {
        _self.chgRightClass("report_detail")
    };
    // _self.showAccDetail = function(param) {
    //     param.parse = "Y";
    //     param.page = "acc_detail";
    //     _self.showRigthDetail(param, _self.show_acc_detail)
    // };
    _self.show_acc_detail = function() {
        _self.chgRightClass("acc_detail")
    };
    _self.showMemHistory = function(param) {
        _self.showCenterDetail(param, _self.show_mem_history)
    };
    _self.show_mem_history = function() {
        _self.chgRightClass("mem_history")
    };
    _self.showProblemAccDetail = function(param) {
        param.parse = "Y";
        param.page = "problem_accounts_detail";
        _self.showRigthDetail(param, _self.show_ProBlemAcc_detail)
    };
    _self.show_ProBlemAcc_detail = function() {
        _self.chgRightClass("problem")
    };
    _self.showResultDetail = function(param) {
        _self.showResultRigthDetail(param, _self.show_result_detail)
    };
    _self.show_result_detail = function() {
        _self.chgRightClass("result_detail")
    };
    _self.showResultRigthDetail = function(param, showFun) {
        dom.getElementById("right_show").style.display = "";
        if (detailFrame == null)
            _self.goToPage("right_show", param.page, function() {
                try {
                    detailFrame = eval("new win." + param.gtype + "_" + param.page + "(win,dom,param.postHash);");
                    detailFrame.setParentclass(_self);
                    detailFrame.init();
                    if (param.parse == "Y")
                        detailFrame.parseData(param);
                    _self.clearDuplicate();
                    if (showFun)
                        showFun()
                } catch (e) {
                    util.err("[loadRigthDetail][" + param.page + "]", e)
                }
            }, param);
        else {
            if (param.parse == "Y")
                detailFrame.parseData(param);
            else
                detailFrame.reinit(param.postHash);
            if (showFun)
                showFun()
        }
    };
    _self.chgRightClass = function(targetObj) {
        var sty = "";
        util.classFunc(dom.getElementById("right_show"), ["w200px", "w360px", "w100per"], "remove");
        switch (targetObj) {
            case "problem":
            case "acc_detail":
                sty = "w200px";
                break;
            case "mem_history":
                sty = getView().viewportwidth < 599 ? "w100per" : "w360px";
                break;
            case "report_detail":
                sty = getView().viewportwidth < 768 ? "w200px" : "w360px";
                break;
            case "result_detail":
                sty = getView().viewportwidth < 768 ? "w100per" : "w360px";
                break
        }
        util.classFunc(dom.getElementById("right_show"), [sty, "ma_extend"])
    };
    _self.showRigthDetail = function(param, showFun) {
        dom.getElementById("right_show").style.display = "";
        if (detailFrame == null)
            _self.goToPage("right_show", param.page, function() {
                try {
                    detailFrame = eval("new win." + param.page + "(win,dom,param.postHash);");
                    detailFrame.setParentclass(_self);
                    detailFrame.init();
                    if (param.parse == "Y")
                        detailFrame.parseData(param);
                    _self.clearDuplicate();
                    if (showFun)
                        showFun()
                } catch (e) {
                    util.err("[loadRigthDetail][" + param.page + "]", e)
                }
            }, param);
        else {
            if (param.parse == "Y")
                detailFrame.parseData(param);
            else
                detailFrame.reinit(param.postHash);
            if (showFun)
                showFun()
        }
    };
    _self.showCenterDetail = function(param, showFun) {
        if (detailFrame == null)
            _self.goToPage("center_show", param.page, function() {
                try {
                    detailFrame = eval("new win." + param.page + "(win,dom,param.postHash);");
                    detailFrame.setParentclass(_self);
                    detailFrame.init();
                    _self.clearDuplicate()
                } catch (e) {
                    util.err("[loadCenterDetail][" + param.page + "]", e)
                }
            }, param);
        else
            if (param.parse == "Y") detailFrame.parseData(param);
            else detailFrame.reinit(param.postHash);
            if (showFun) showFun()
    };
    

    
    _self.hideRightDetail = function(isGoPage) {
        if (dom.getElementById("right_show").classList)
            dom.getElementById("right_show").classList.remove("ma_extend");
        else
            dom.getElementById("right_show").className = "ma_right w200px";
        if (bodyFrame != null && bodyFrame._super && isGoPage == null)
            bodyFrame._super.closeAccDetail();
        if (bodyFrame != null && bodyFrame.closeAccDetail && isGoPage == null)
            bodyFrame.closeAccDetail();
        detailFrame = null
    };
    _self.hideCenterDetail = function(isShow) {
        dom.getElementById("center_show").style.display = isShow ? "none" : ""
    };
    _self.viewReportTeach = function(param) {
        _self.goToPage("acc_show", "report_teach", function() {
            try {
                dom.getElementById("home_show").style.display = "none";
                dom.getElementById("acc_show").style.display = "";
                teachFrame = new win.report_teach(win, dom);
                teachFrame.setParentclass(_self);
                teachFrame.init()
            } catch (e) {
                util.err("[viewReportTeach][report_teach]", e)
            }
        }, param)
    };
    _self.showReport = function(param) {
        dom.getElementById("home_show").style.display = ""
    };
    _self.hideReportTeach = function(param) {
        dom.getElementById("acc_show").style.display = "none";
        teachFrame = null
    };
    _self.showFilter = function(param) {
        if (filterFrame == null)
            _self.goToPage("filter_show", "report_filter", function() {
                try {
                    filterFrame = new win.report_filter(win, dom);
                    filterFrame.setParentclass(_self);
                    filterFrame.init();
                    filterFrame.initFilter(param)
                } catch (e) {
                    util.err("[showFilter][report_filter]", e)
                }
            }, param);
        else
            filterFrame.initFilter(param);
        _self.showDiv({
            "type": "filter_show"
        })
    };
    _self.showOverviewFilter = function(param) {
        if (filterFrame == null)
            _self.goToPage("filter_show", "wmc_filter", function() {
                try {
                    filterFrame = new win.wmc_filter(win, dom);
                    filterFrame.setParentclass(_self);
                    filterFrame.init();
                    filterFrame.initFilter(param)
                } catch (e) {
                    util.err("[showFilter][wmc_filter]", e)
                }
            }, param);
        else
            filterFrame.initFilter(param);
        _self.showFilterLoading();
        _self.showDiv({
            "type": "filter_show"
        })
    };
    _self.hideFilter = function(param) {
        _self.showDiv({
            "type": "home_show"
        });
        try {
            bodyFrame.hideFilter(param)
        } catch (e) {
            util.err("[hideFilter]", e)
        }
        filterFrame = null
    };
    _self.changeFilter = function(param) {
        try {
            bodyFrame.changeFilter(param)
        } catch (e) {
            util.err("[changeFilter]", e)
        }
        _self.hideFilter(null)
    };
    _self.showFilterLoading = function(param) {
        try {
            dom.getElementById("filter_loading").style.display = ""
        } catch (e) {}
    };
    _self.closeFilterLoading = function(param) {
        try {
            dom.getElementById("filter_loading").style.display = "none"
        } catch (e) {}
    };
    _self.goToPageEvent = function(param) { 
        param.isTrans = param.isTrans || "Y";
        var retFunc = param.useDefineParent == "Y" ? _self.definedParent : param.retFun;
        if ((param.back != "Y" || homePage) && param.backGoToPage == "Y")
            _self.pushHistory(param, "", param.page);
        _self.goToPage(param.target, param.page, retFunc, param)
    };
    _self.goToPage = function(target, page, retFun, param) {
        _self.hideRightDetail(true);
        clearTimeout(retryTimer);
        if (!failCount[page])
            failCount[page] = 0;
        var page_name = target + "_" + page + "_" + top.ver;
        var retryLimit = config_set.get("RETRY_LIMIT");
        var retryTime = config_set.get("RETRY_TIME");
        if (page.indexOf("report") == -1)
            util.removeEvent(win, "orientationchange");
        var ht = new win.HttpRequest;
        ht.addEventListener("onError", function() {
            if (failCount[page] < retryLimit) {
                failCount[page]++;
                retryTimer = setTimeout(_self.goToPage, retryTime, target, page, retFun, param)
            } else {
                if (target == "body_show")
                    bodyFrame.init();
                _self.setLoadingVisible(false)
            }
        });
        ht.addEventListener("LoadComplete", function(html) {
            failCount[page] = 0;
            var tempHtml = new win.parseHTML(html);
            var dbody = tempHtml.getTag("div")[0];
            var sty = tempHtml.getTag("style");
            var scp = tempHtml.getTag("script");
            if (!dbody)
                try {
                    var errHash = JSON.parse(html);
                    if (util.chkErrorMsg(errHash, LS_code))
                        return
                } catch (e) {
                    util.err("[" + classname + "]", e)
                }
            var ret = false;
            if (first_load && target == "body_show" && !_self.check_show_alert())
                ret = _self.clearHead();
            else {
                _self.clearDuplicate();
                ret = true
            }
            if (ret) {
                for (var j = 0; j < scp.length; j++)
                    try {
                        var scpt = document.createElement("script");
                        if (scp[j].src)
                            scpt.src = scp[j].src;
                        else {
                            scpt.innerHTML = scp[j].innerHTML;
                            scpt.id = page + "JS"
                        }
                        dom.getElementsByTagName("head")[0].appendChild(scpt)
                    } catch (e) {
                        util.err("[" + classname + "]", e)
                    }
                for (var i = 0; i < sty.length; i++) {
                    sty[i].id = page + "CS";
                    dom.getElementsByTagName("head")[0].appendChild(sty[i])
                }
                pageHash[page_name] = dbody.innerHTML;
                dom.getElementById(target).innerHTML = dbody.innerHTML;
                retFun(param)
            }
        });
        if (cache_html_sw && pageHash[page_name]) {
            dom.getElementById(target).innerHTML = pageHash[page_name];
            retFun(param)
        } else {
            var _post = "p=" + page + "&ver=" + top.ver + "&login_layer=" + top.login_layer + "&langx=" + top.langx;
            if (top.uid != "")
                _post += "&uid=" + top.uid;
            if (param.post)
                _post += "&" + param.post;
            ht.loadURL(top.url, "POST", _post)
        }
    };
    _self.footHide = function(e) {
        var resizeHeight = dom.documentElement.clientHeight || dom.body.clientHeight;
        var chk_android_keygoard_open = true;
        if (e.type == "resize")
            if (originHeight < resizeHeight)
                chk_android_keygoard_open = false;
        var id = dom.activeElement.id;
        if ((dom.activeElement.tagName == "INPUT" && id != "loginBtn" || dom.activeElement.tagName == "SELECT" && id != "loginBtn") && chk_android_keygoard_open) {
            dom.getElementById("dashboard_main").className = "ma_main_foothide";
            if (topFrame)
                topFrame.onKeyBoardOpen(true);
            originHeight = resizeHeight
        } else {
            dom.getElementById("dashboard_main").className = "ma_main";
            if (topFrame)
                topFrame.onKeyBoardOpen(false);
            originHeight = resizeHeight
        }
    };
    _self.footHide_SF = function(e) {
        if (top.uid != "") {
            var resizeHeight = dom.documentElement.clientHeight || dom.body.clientHeight;
            if (e.target.height + 30 < resizeHeight) {
                dom.getElementById("dashboard_main").className = "ma_main_foothide";
                if (topFrame)
                    topFrame.onKeyBoardOpen(true)
            } else {
                dom.getElementById("dashboard_main").className = "ma_main";
                if (topFrame)
                    topFrame.onKeyBoardOpen(false);
                dom.body.scrollTop = 0;
                win.scrollTo(0, 0)
            }
        }
    };
    _self.clearHead = function() {
        var ori_head = dom.getElementsByTagName("head")[0].children;
        var sty_len = ori_head.length;
        for (var i = sty_len - 1; i >= 0; i--) {
            if (ori_head[i].id.substr(-2) == "JS" || ori_head[i].id.substr(-2) == "CS")
                var realID = ori_head[i].id.substr(0, ori_head[i].id.length - 2);
            else
                var realID = ori_head[i].id;
            if ((ori_head[i].tagName == "STYLE" || ori_head[i].tagName == "SCRIPT") && top.keep_head.indexOf("," + realID + ",") == -1)
                ori_head[i].parentNode.removeChild(ori_head[i])
        }
        return true
    };
    _self.clearDuplicate = function() {
        var ori_head = dom.getElementsByTagName("head")[0].children;
        var sty_len = ori_head.length;
        var classHash = new Array;
        for (var i = sty_len - 1; i >= 0; i--) {
            var realID = ori_head[i].id;
            if ((ori_head[i].tagName == "STYLE" || ori_head[i].tagName == "SCRIPT") && top.keep_head.indexOf("," + realID + ",") == -1 && util.in_array(realID, classHash))
                ori_head[i].parentNode.removeChild(ori_head[i]);
            classHash.push(realID)
        }
    };
    _self.pushHistory = function(state, title, page) {
        try {
            win.history.pushState(null, title, util.getWebUrl());
            if (page != "")
                win._history.push({
                    "state": util.clone(state),
                    "page": page
                })
        } catch (e) {
            util.err("[pushHistory]", e)
        }
    };
    _self.popstate = function(e) {
        _self.pushHistory(null, "", "");
        _self.backPage({
            "retFun": null
        })
    };
    _self.clearAllTimer = function(isInit) {
        for (var keys in timerHash)
            if (isInit) {
                if (timerHash[keys] != null) {
                    timerHash[keys].clearObj();
                    timerHash[keys] = null
                }
            } else if (timerHash[keys] != null && !timerHash[keys].dont_clear) {
            timerHash[keys].clearObj();
            timerHash[keys] = null
        }
        return true
    };
    _self.SetConfirmExit = function(param) {
        bodyFrame.LeaveChk = false;
        bodyFrame.exitConfirm = param
    };
    _self.CloseConfirmExit = function() {
        bodyFrame.LeaveChk = true;
        bodyFrame.exitConfirm = null
    };
    _self.ConfirmExitAlert = function(param) {
        if (bodyFrame && bodyFrame.exitConfirm && !bodyFrame.LeaveChk)
            _self.exitConfirm(_self.ConfirmExitAlert, param, bodyFrame.exitConfirm);
        else if (param && param.func)
            param.func(param.Event, param.Param)
    };
    _self.exitConfirm = function(retFun, param, confirm_par) { 
        if (confirm_par.isEdit && !confirm_par.isEdit()) {
            bodyFrame.LeaveChk = true;
            retFun(param);
            return
        }
        _self.showLoading({
            "showLoading": false
        });
        util.showMsg(confirm_par["Alert"].msg, confirm_par["Alert"].mode, function(msg) {
            if (msg == "yes") {
                bodyFrame.LeaveChk = true;
                if (confirm_par.ifYes)
                    confirm_par.ifYes(confirm_par.YesParam);
                retFun(param)
            } else {
                bodyFrame.LeaveChk = false;
                if (confirm_par.ifNo)
                    confirm_par.ifNo(confirm_par.NoParam);
                return false
            }
        })
    };
    _self.backPage = function(param) { 
        if (bodyFrame && bodyFrame.exitConfirm && !bodyFrame.LeaveChk) { 
            _self.exitConfirm(_self.backPage, param, bodyFrame.exitConfirm);
            return false
        } else
            try {
                if (teachFrame != null)
                    return;
                if (win._history.length > 1) {
                    win._history.pop();
                    var obj = win._history[win._history.length - 1];
                    var hash = obj.state;
                    hash.page = obj.page;
                    hash.back = "Y";
                    if (hash.postHash != null)
                        hash.postHash.back = "Y";
                    hash.retFun = param.retFun;
                    if (hash.backGoToPage == "Y")
                        _self.goToPageEvent(hash);
                    else
                        _self.bodyGoToPage(hash)
                }
                if (win._history.length <= 1) {
                    topFrame.closebackBtn();
                    _self.chgPageName({
                        "pageName": "dashboard"
                    })
                }
            } catch (e) {
                util.err("[backPage]", e)
            }
    };
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname])
            eventHandler[eventname](param)
    };
    _self.showDiv = function(param) {
        dom.getElementById("acc_show").style.display = "none";
        if (param.type != "acc_show")
            dom.getElementById("acc_show").innerHTML = "";
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("filter_show").style.display = "none";
        dom.getElementById(param.type).style.display = ""
    };
    _self.hideDiv = function(param) {
        if (param.target == "acc_show") {
            top.param = "login_layer=" + top.login_layer + "&uid=" + top.uid + "&langx=" + top.langx + "&ver=" + top.ver;
            _self.showDiv({
                "type": "home_show"
            });
            _self.goToPage("top_menu_show", "top_menu", function() {
                try {
                    topFrame = new win.top_menu(win, dom);
                    topFrame.setParentclass(_self);
                    topFrame.init();
                    _self.check_all_div("top_menu_show", param)
                } catch (e) {
                    util.err("[hideDiv][top_menu]", e)
                }
            }, {});
            _self.goToPage("left_menu_show", "left_menu", function() {
                try {
                    leftFrame = new win.left_menu(win, dom);
                    leftFrame.setParentclass(_self);
                    leftFrame.init();
                    _self.check_all_div("left_menu_show", param)
                } catch (e) {
                    util.err("[hideDiv][left_menu]", e)
                }
            }, {});
            _self.goToPage("footer_show", "footer", function() {
                try {
                    footFrame = new win.footer(win, dom);
                    footFrame.setParentclass(_self);
                    footFrame.init();
                    _self.check_all_div("footer_show", param)
                } catch (e) {
                    util.err("[hideDiv][footer]", e)
                }
            }, {});
            _self.goToPage("alert_show", "alert_msg", function() {
                try {
                    alertFrame = new win.alert_msg(win, dom);
                    alertFrame.setParentclass(_self);
                    alertFrame.init();
                    _self.check_all_div("alert_show", param)
                } catch (e) {
                    util.err("[alert_msg]", e)
                }
            }, {});
            var str = "ag_" + top.login_layer + "_" + top.user_id;
            var cke = cookie.get(str + "_alert_note202405");
            if ((cke == undefined || cke == "N") && top.user_type == 1)
                _self.goToPage("newnote_show", "alert_note", function() {
                    try {
                        noticeFrame = new win.alert_note(win, dom);
                        noticeFrame.setParentclass(_self);
                        noticeFrame.init();
                        _self.check_all_div("newnote_show", param);
                        _self.lockBodyScroll();
                        dom.getElementById("newnote_show").style.display = ""
                    } catch (e) {
                        util.err("[alert_note]", e)
                    }
                }, {});
            else
                _self.check_all_div("newnote_show", param);
            _self.goToPage("anno_show", "alert_announcement", function() {
                try {
                    annoFrame = new win.alert_announcement(win, dom);
                    annoFrame.setParentclass(_self);
                    annoFrame.init();
                    _self.check_all_div("anno_show", param)
                } catch (e) {
                    util.err("[alert_announcement]", e)
                }
            }, {})
        }
    };
    _self.check_all_div = function(div_name, param) {
        arr_check_all_div[div_name] = true;
        var chk_do_main = true;
        var main_header = dom.getElementById("main_header");
        for (var i in arr_check_all_div)
            if (!arr_check_all_div[i]) {
                chk_do_main = false;
                break
            }
        if (chk_do_main) {
            _self.loadAnnounce_Prombel_luminous();
            _self.createTimer();
            _self.startTimer();
            resetHTMLHight();
            _self.set_noScroll_style();
            _self.bodyGoToPage({
                "page": "dashboard_main",
                "retFun": _self.showImportantAnno
            });
            main_header.style.display = "none"
        }
    };
    _self.showImportantAnno = function() {
        first_load = true;
        _self.loadImportantAnno()
    };
    _self.set_noScroll_style = function() {
        dom.body.className = "noScroll"
    };
    _self.lockBodyScroll = function() {
        dom.getElementById("body_show").setAttribute("style", "overflow-y:hidden;");
        dom.body.setAttribute("style", "position:fixed; overflow-y:hidden;")
    };
    _self.openBodyScroll = function() {
        dom.getElementById("body_show").removeAttribute("style");
        dom.body.removeAttribute("style")
    };
    _self.showAlertMsg = function(param) {
        alertFrame.showMsg(param);
        dom.getElementById("alert_show").style.display = ""
    };
    _self.showAlertChooseMsg = function(param) {
        alertChooseFrame.showMsg(param);
        dom.getElementById("alert_choose_show").style.display = ""
    };
    _self.openLeftMenu = function() {
        dom.getElementById("left_menu_show").className = "ma_left ma_extend";
        dom.getElementById("body_show").className = "ma_body ma_extend body_pb";
        dom.getElementById("ma_content").className = "ma_content ma_extend";
        leftFrame.openMenu()
    };
    _self.closeLeftMenu = function() {
        dom.getElementById("left_menu_show").className = "ma_left";
        dom.getElementById("body_show").className = "ma_body body_pb";
        dom.getElementById("ma_content").className = "ma_content";
        leftFrame.closeMenu()
    };
    _self.closeNote = function() {
        dom.getElementById("newnote_show").style.display = "none";
        noticeFrame = null;
        var str = "ag_" + top.login_layer + "_" + top.user_id;
        cookie.set(str + "_alert_note202308", "Y", 180);
        _self.openBodyScroll()
    };
    _self.hideAlertMsg = function(param) {
        alertFrame.clearMsg();
        dom.getElementById("alert_show").style.display = "none"
    };
    _self.hideAlertChooseMsg = function(param) {
        alertChooseFrame.clearChoose();
        dom.getElementById("alert_choose_show").style.display = "none"
    };
    _self.hideDivComplete = function() {};
    _self.chgPwdSafe = function() {
        _self.goToPage("acc_show", "old_chg_pwd_safe", function() {
            try {
                loginFrame = new win.old_chg_pwd_safe(win, dom);
                loginFrame.setParentclass(_self);
                loginFrame.init()
            } catch (e) {
                util.err("[chgPwdSafe][old_chg_pwd_safe]", e)
            }
        }, {})
    };
    _self.chgLoginID = function() {
        _self.goToPage("acc_show", "old_chg_login_ID", function() {
            try {
                loginFrame = new win.old_chg_login_ID(win, dom);
                loginFrame.setParentclass(_self);
                loginFrame.init()
            } catch (e) {
                util.err("[chgLoginID][old_chg_login_ID]", e)
            }
        }, {})
    };
    _self.backToIdex = function() {
        util.goToIndex()
    };
    _self.chgPwd = function() {
        _self.goToPage("acc_show", "old_chg_pwd", function() {
            try {
                loginFrame = new win.old_chg_pwd(win, dom);
                loginFrame.setParentclass(_self);
                loginFrame.init()
            } catch (e) {
                util.err("[chgPwd][old_chg_pwd]", e)
            }
        }, {
            "post": "isFirst=Y"
        })
    };
    _self.forgotPwd = function() {
        _self.goToPage("acc_show", "pre_forgot_pwd", function() {
            try {
                loginFrame = new win.pre_forgot_pwd(win, dom);
                loginFrame.setParentclass(_self);
                loginFrame.init()
            } catch (e) {
                util.err("[forgotPwd][pre_forgot_pwd]", e)
            }
        }, {})
    };
    _self.go_requirements = function() {
        dom.getElementById("home_show").style.display = "none";
        dom.getElementById("acc_show").style.display = "";
        _self.showFilterLoading();
        _self.show_requirements();
        _self.showLoading({
            "showLoading": false,
            "defalutPage": true
        })
    };
    _self.show_requirements = function() {
        _self.goToPage("acc_show", "requirements", function() {
            try {
                loginFrame = new win.requirements(win, dom);
                loginFrame.setParentclass(_self);
                loginFrame.setfromindex(true);
                loginFrame.init();
                setTimeout(_self.closeFilterLoading, 200)
            } catch (e) {
                util.err("[show_requirements][requirements]", e)
            }
        }, {})
    };
    _self.chooseLayer = function() {
        _self.goToPage("alert_choose_show", "alert_choose", function() {
            try {
                alertChooseFrame = new win.alert_choose(win, dom);
                alertChooseFrame.setParentclass(_self);
                alertChooseFrame.init();
                var view_co = new Array("su", "ag", "mem", "sub", "retrieve");
                var view_su = new Array("ag", "mem", "sub", "retrieve");
                var view_ag = new Array("mem", "sub", "retrieve");
                var selLayer = "";
                if (top.login_layer == "co")
                    selLayer = "A";
                else if (top.login_layer == "su")
                    selLayer = "B";
                else if (top.login_layer == "ag")
                    selLayer = "C";
                var _postHashSU = new Object;
                _postHashSU["page"] = "acc_su_list";
                _postHashSU["type"] = "account";
                _postHashSU["pageType"] = "account";
                _postHashSU["selLayer"] = selLayer;
                var _postHashAG = new Object;
                _postHashAG["page"] = "acc_ag_list";
                _postHashAG["type"] = "account";
                _postHashSU["pageType"] = "account";
                _postHashAG["selLayer"] = selLayer;
                var _postHashMEM = new Object;
                _postHashMEM["page"] = "acc_mem_list";
                _postHashMEM["type"] = "account";
                _postHashSU["pageType"] = "account";
                _postHashMEM["selLayer"] = selLayer;
                var _postHashSUB = new Object;
                _postHashSUB["page"] = "acc_sub_list";
                _postHashSUB["type"] = "account";
                _postHashSU["pageType"] = "account";
                _postHashSUB["selLayer"] = selLayer;
                var _postHashRetrieve = new Object;
                _postHashRetrieve["page"] = "retrieve_credit";
                _postHashRetrieve["type"] = "account";
                _postHashRetrieve["pageType"] = "account";
                var _su = {
                    "id": "layer_su",
                    "style": "",
                    "content": LS.get("acc_su"),
                    "postHash": _postHashSU
                };
                var _ag = {
                    "id": "layer_ag",
                    "style": "",
                    "content": LS.get("acc_ag"),
                    "postHash": _postHashAG
                };
                var _mem = {
                    "id": "layer_mem",
                    "style": "",
                    "content": LS.get("acc_mem"),
                    "postHash": _postHashMEM
                };
                var _sub = {
                    "id": "layer_sub",
                    "style": "",
                    "content": LS.get("acc_sub"),
                    "postHash": _postHashSUB
                };
                var _retrieve = {
                    "id": "layer_retrieve",
                    "style": "",
                    "content": LS.get("acc_retrieve"),
                    "postHash": _postHashRetrieve
                };
                var _param = new Array;
                var tmp_view = eval("view_" + top.login_layer);
                for (var i = 0; i < tmp_view.length; i++) {
                    if ((tmp_view[i] == "sub" || tmp_view[i] == "retrieve") && (top.user_type == 2 || top.user_type == 3))
                        continue;
                    if (tmp_view[i] == "retrieve" && (top.retrieve_sw != "Y" || top.pay_type != "0" || top.user_enable != "Y"))
                        continue;
                    var pushData = eval("_" + tmp_view[i]);
                    _param.push(pushData)
                }
                alertChooseFrame.parseChoose("account", _param);
                alertChooseFrame.showTitle(false);
                dom.getElementById("alert_choose_show").style.display = ""
            } catch (e) {
                util.err("[alert_choose]", e)
            }
        }, {})
    };
    _self.createTimer = function() {
        timerHash["Ann_ProAcc"] = new Timer(config_set.get("ANNOUNCE_PROBLEMACCOUNT_TIME"));
        timerHash["Ann_ProAcc"].setParentclass(_self);
        timerHash["Ann_ProAcc"].dont_clear = true;
        timerHash["Ann_ProAcc"].init();
        timerHash["Ann_ProAcc"].addEventListener("TimerEvent.TIMER", _self.timerRun);
        timerHash["Ann_ProAcc"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerComplete)
    };
    _self.startTimer = function() {
        util.echo("dashboard startTimer");
        timerHash["Ann_ProAcc"].startTimer()
    };
    _self.stopTimer = function() {
        util.echo("dashboard stopTimer");
        timerHash["Ann_ProAcc"].stopTimer()
    };
    _self.clearTimer = function() {
        util.echo("dashboard clearTimer");
        timerHash["Ann_ProAcc"].clearObj()
    };
    _self.timerRun = function() {
        util.echo("DASHBOARD timer");
        _self.loadAnnounce_Prombel_luminous()
    };
    _self.timerComplete = function() {
        util.echo("timerComplete")
    };
    _self.lockScaled = function() {
        util.addEvent(dom.documentElement, "touchstart", _self.touchstartEvent)
    };
    _self.showFadeOutMesg = function(param) {
        var fadeName = "item_disappear2s";
        if (codeAlert.classList.contains(fadeName))
            codeAlert.style.display = "none";
        else
            codeAlert.className = "ps_sendCode";
        if (typeof param.set_class_name != "undefined")
            if (param.set_class_id != "" && param.set_class_name != "")
                dom.getElementById(param.set_class_id).classList.add(param.set_class_name);
        clearTimeout(setTimeContainer);
        if (typeof param !== "object" || !param.text || param.text == "")
            return;
        var secClassAry = [2, 5];
        var delayAni = 2;
        var sec = 0;
        if (secClassAry.indexOf(param.s) != -1)
            fadeName = fadeName.replace(/[0-9]+/g, param.s);
        sec = fadeName.match(/[0-9]+/g)[0];
        codeMsg.innerHTML = param.text;
        codeAlert.classList.add(fadeName);
        setTimeout(function() {
            codeAlert.style.display = ""
        }, 1);
        setTimeContainer = setTimeout(function() {
            codeMsg.innerHTML = "";
            codeAlert.classList.remove(fadeName);
            if (typeof param.set_class_name != "undefined")
                if (param.set_class_id != "" && param.set_class_name != "")
                    dom.getElementById(param.set_class_id).classList.remove(param.set_class_name)
        }, (sec * 1 + delayAni) * 1E3);
        if (param.showCopy == "Y") {
            dom.getElementById("btn_copy").value = param.value;
            dom.getElementById("btn_copy").style.display = "";
            dom.getElementById("btn_copy").classList.add("txtl")
        } else
            dom.getElementById("btn_copy").style.display = "none"
    };
    _self.touchstartEvent = function(event) {
        if (event.touches.length > 1)
            event.preventDefault()
    };
    _self.getPromblemCount = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams = "p=get_ncr_count&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.ProCountBroadcastData);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.getAnnouncementCount = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&announcement=count";
        urlParams += "&langx=" + top.langx;
        urlParams = "p=get_announcement&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.AnnCountBroadcastData);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.loadAnnounce_Prombel_luminous = function() {
        var times = 50;
        setTimeout(function() {
            if (topFrame) {
                _self.getAnnouncementCount();
                if (top.login_layer == "co")
                    _self.getPromblemCount()
            } else
                setTimeout(arguments.callee, times)
        }, times)
    };
    _self.AnnCountBroadcastData = function(data) {
        topFrame.AnnComplete(data)
    };
    _self.ProCountBroadcastData = function(data) {
        topFrame.ProAccComplete(data)
    };
    _self.chgLeftMenuColor = function(param) {
        leftFrame.chgColor(param)
    };
    _self.loadImportantAnno = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&announcement=count";
        urlParams += "&action=init";
        urlParams += "&scoll_type=home_important";
        urlParams += "&scoll_date=all";
        urlParams += "&sort=desc";
        urlParams += "&langx=" + top.langx;
        urlParams = "p=get_announcement&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.loadImportantAnnoComplete);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.loadImportantAnnoComplete = function(data) {
        try {
            var arr_data = JSON.parse(data);
            if (arr_data["code"] != "none") {
                var tmpData = arr_data["code"].split("@@");
                var count = tmpData.length;
                if (count > 0)
                    _self.showAnno(tmpData)
            }
            _self.showLoading({
                "showLoading": false,
                "defalutPage": false
            })
        } catch (e) {
            util.echo(e)
        }
    };
    _self.showAnno = function(data) {
        annoFrame.showAnno(data);
        dom.getElementById("anno_show").style.display = ""
    };
    _self.hideAnno = function() {
        annoFrame.clearMsg();
        dom.getElementById("anno_show").style.display = "none"
    };
    _self.doOnTouchMove = function() {
        dom.activeElement.blur()
    };
    _self.newOpenPageEvent = function(obj) {
        var dowrite = obj.dowrite == undefined ? false : obj.dowrite;
        _self.newOpenPage(obj.filename, obj.title ? obj.title : "", _self.getNewOpenParam(obj), dowrite, obj._body)
    };
    _self.newOpenPageNoParEvent = function(obj) {
        var dowrite = obj.dowrite == undefined ? false : obj.dowrite;
        _self.newOpenPage(obj.filename, obj.title ? obj.title : "", "", dowrite, obj._body)
    };
    _self.getNewOpenParam = function(obj) {
        var par = "config='";
        par += "location=" + (obj.location != null ? obj.location : "no");
        par += ",status=" + (obj.status ? obj.status : "no");
        par += ",width=" + (obj.width ? obj.width : "600px");
        par += ",height=" + (obj.height ? obj.height : "600px");
        par += ",toolbar=" + (obj.toolbar ? obj.toolbar : "no");
        par += ",top=" + (obj.top ? obj.top : "0px");
        par += ",left=" + (obj.left ? obj.left : "0px");
        par += ",scrollbars=" + (obj.scrollbars ? obj.scrollbars : "no");
        par += ",resizable=" + (obj.resizable ? obj.resizable : "yes");
        par += ",personalbar=" + (obj.personalbar ? obj.personalbar : "yes");
        par += "'";
        return par
    };
    _self.newOpenPage = function(filename, _title, param, dowrite, _body) {
        if (util.showTxt(filename) == "" && !dowrite)
            return;
        if (_title != "history")
            if (top.popWindow[filename] != null) {
                top.popWindow[filename].focus();
                if (!top.popWindow[filename].closed)
                    return
            }
        top.popWindow[filename] = window.open(filename, _title, param);
        top.popWindow[filename].focus();
        if (dowrite) {
            var headStr = "";
            top.popWindow[filename].document.write("<html><body></body></html>");
            for (var i = 0; i < window.document.head.childNodes.length; i++) {
                var node = document.head.childNodes[i];
                var tag = node.tagName;
                if (tag == "META" || tag == "LINK")
                    headStr += node.outerHTML
            }
            htmlStr = "<html>" + headStr + "<body>" + _body + "</body></html>";
            top.popWindow[filename].document.write(htmlStr);
            top.popWindow[filename].document.close()
        }
    };

    function chk_iOSversion() {
        var obj_html = dom.getElementsByTagName("html")[0];
        var iosVer = iOSversion();
        var useUA = getUA();
        var chk_iosversion = false;
        if (iosVer.version == 15) {
            var tmp_version = iosVer.info.split(".");
            if (tmp_version[1] < 2)
                chk_iosversion = true
        }
        try {
            if (iosVer.status && chk_iosversion && (useUA.isSafari == true && useUA.isChrome == false)) {
                obj_html.classList.add("ios15_height");
                if (win.visualViewport.addEventListener)
                    win.visualViewport.addEventListener("resize", _self.footHide_SF)
            } else
                obj_html.classList.remove("ios15_height")
        } catch (e) {
            util.echo(e)
        }
    }

    function iOSversion() {
        var d, v;
        if (/iP(hone|od|ad)/.test(navigator.platform)) {
            v = navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
            d = {
                status: true,
                version: parseInt(v[1], 10),
                info: parseInt(v[1], 10) + "." + parseInt(v[2], 10) + "." + parseInt(v[3] || 0, 10)
            }
        } else
            d = {
                status: false,
                version: false,
                info: ""
            };
        return d
    }

    function getUA() {
        var ua = navigator.userAgent.toLowerCase();
        var ieMode = (s = ua.match(/msie ([\d.]+)/)) ? s[1] : null,
            isIE = !!window.ActiveXObject,
            isIE6 = isIE && !window.XMLHttpRequest;
        var isEdge = /edge/i.test(ua),
            isOpera = /opr\//i.test(ua);
        var isIpad = /(ipad).*os\s([\d_]+)/i.test(ua);
        var UA = {
            isMobile: /applewebkit.*mobile.*/.test(ua) || /applewebKit/.test(ua) || /[aA]{1}ndroid/.test(ua),
            isMac: /mac os x/.test(ua),
            isAndroid: ua.indexOf("android") > -1 || ua.indexOf("linux") > -1 || /[aA]{1}ndroid/.test(ua),
            isIPhone: !isIpad && /(iphone\sos)\s([\d_]+)/i.test(ua),
            isIPad: isIpad,
            isIos: isIpad || /(iphone\sos)\s([\d_]+)/i.test(ua),
            isWeiXin: /micromessenger/i.test(ua),
            isUC: ua.indexOf("ucbrowser") > -1,
            isUC_Webkit: /uc\sapplewebkit\/([\d.]+)/i.test(ua),
            isUC_Proxy: /(ucweb)(\d.+?(?=\/))/i.test(ua),
            isWeibo: /weibo/i.test(ua),
            isQQ: /(qq)\//i.test(ua),
            isChrome: (/chrome\/([\d.]+)/.test(ua) || /crios\/([\d.]+)/.test(ua)) && !isEdge,
            isMozilla: ua.indexOf("gecko") > -1 && ua.indexOf("khtml") == -1,
            isWebkit: /applewebkit/i.test(ua),
            isOpera: isOpera,
            isSafari: /safari/i.test(ua) && !/chrome\/([\d.]+)/.test(ua) && !isOpera,
            isBlackberry: /(blackberry).*version\/([\d.]+)/i.test(ua),
            isFirefox: /(firefox)\//i.test(ua),
            isEdge: isEdge,
            isIE: isIE,
            ieModes: "ieMode" + ieMode,
            isIE6: isIE6,
            isIE7: isIE && !isIE6 && !ieMode || ieMode == 7,
            isIE8: isIE && ieMode == 8,
            isIE9: isIE && ieMode == 9,
            isIE10: isIE && ieMode == 10,
            isIE11: /rv:([\d.]+)\) like gecko/.test(ua),
            is360mse: /360 aphone browser|wow|qhbrowser/i.test(ua),
            isHorizontal: window.orientation == 90 || window.orientation == -90,
            isVertical: window.orientation == 0 || window.orientation == 180
        };
        return UA
    }

    function resetHTMLHight() {
        var obj_html = dom.getElementsByTagName("html")[0];
        obj_html.classList.add("main_rotate");
        setTimeout(function() {
            obj_html.classList.remove("main_rotate")
        }, 500)
    }
    _self.show_modal_step = function(param) {
        if (topFrame)
            topFrame.show_modal_step(param)
    };
    _self.set_modal_step = function(param) {
        if (topFrame)
            topFrame.set_modal_step(param)
    };
    _self.show_add_user_btn = function(param) {
        if (topFrame)
            topFrame.show_add_user_btn(param)
    };
    _self.set_add_user = function(param) {
        if (topFrame)
            topFrame.set_add_user(param)
    };
    _self.check_show_alert = function() {
        var is_alert = false;
        var _obj = dom.getElementsByClassName("ma_alert");
        for (var i = 0; i < _obj.length; i++)
            if (_obj[i].style.display == "") {
                is_alert = true;
                break
            }
        return is_alert
    }
};
