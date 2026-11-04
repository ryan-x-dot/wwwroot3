function left_menu(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;

    var le_smallG;
    var le_bigG;
    var dashB;
    var accountM;
    var sacc_AD;
    var sacc_D0;
    var sacc_CO;
    var sacc_SU;
    var sacc_AG;
    var sacc_MEM;
    var sacc_Sub;
    var sacc_SubAll;

    var acc_AD;
    var acc_D0;
    var acc_CO;
    var acc_SU;
    var acc_AG;
    var acc_MEM;
    var acc_Sub;
    var acc_SubAll;

    var slog_AD;
    var slog_D0;
    var slog_CO;
    var slog_SU;
    var slog_AG;
    var slog_MEM;

    var log_AD;
    var log_D0;
    var log_CO;
    var log_SU;
    var log_AG;
    var log_MEM;

    var bet_list;
    var bet_edit;
    var bet_abnormal;
    var bet_live_dangerous;
    var bet_search;

    var A_isExpend=false;
    var reportS;
    var R_isExpend=false;
    var tit_reportS;
    var wagerR;
    var oldRS;
    var totalB;
    var T_isExpend=false;
    var overView;

    var Betlist_isExpend=false;
    var betlists;
    var Log_isExpend=false;
    var logs;
    var Match_isExpend=false;
    var matchs;
    var Setting_isExpend=false;
    var settings;

    _self.init=function(){
        util.echo("left load complete");

        //縮小menu
        le_smallG = dom.getElementById("le_smallG");
        le_bigG = dom.getElementById("le_bigG");
        sacc_AD = dom.getElementById("sacc_AD");
        sacc_D0 = dom.getElementById("sacc_D0");
        sacc_CO = dom.getElementById("sacc_CO");
        sacc_SU = dom.getElementById("sacc_SU");
        sacc_AG = dom.getElementById("sacc_AG");
        sacc_MEM = dom.getElementById("sacc_MEM");
        sacc_Sub = dom.getElementById("sacc_Sub");
        sacc_SubAll = dom.getElementById("sacc_SubAll");

        slog_AD = dom.getElementById("slog_AD");
        slog_D0 = dom.getElementById("slog_D0");
        slog_CO = dom.getElementById("slog_CO");
        slog_SU = dom.getElementById("slog_SU");
        slog_AG = dom.getElementById("slog_AG");
        slog_MEM = dom.getElementById("slog_MEM");




        util.addEvent(dom.getElementById("menu_home"), "click", _self.expendMenu, {"target":"home","page":"dashboard_main"});
        util.addEvent(dom.getElementById("menu_account"), "click", _self.expendMenu, {"target":"account"});
        util.addEvent(dom.getElementById("menu_report"), "click", _self.expendMenu, {"target":"report"});
        util.addEvent(dom.getElementById("menu_betlist"), "click", _self.expendMenu, {"target":"betlist"});
        util.addEvent(dom.getElementById("menu_match"), "click", _self.expendMenu, {"target":"match"});
        util.addEvent(dom.getElementById("menu_log"), "click", _self.expendMenu, {"target":"log"});
        util.addEvent(dom.getElementById("menu_setting"), "click", _self.expendMenu, {"target":"setting"});

        util.addEvent(dom.getElementById("wager_btn"), "click", _self.chgPage, {"page":"report_main","target":"report"});
        util.addEvent(dom.getElementById("old_btn"), "click", _self.goToReportOld);
        util.addEvent(dom.getElementById("menu_analysis"), "click", _self.expendMenu, {"target":"analysis"});
        util.addEvent(dom.getElementById("leftMask"), "click", _self.hideDiv, {"target":"home"});
        util.addEvent(dom.getElementById("overViewS"), "click", _self.chgPage, {"page":"overView","target":"analysis"});
        util.addEvent(dom.getElementById("re_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "INPLAY", "pageType": "totalbet",  "target": "analysis", "tbet_showtype": "INPLAY" });
        util.addEvent(dom.getElementById("today_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "TODAY", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "TODAY" });
        util.addEvent(dom.getElementById("fu_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "EARLY", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "EARLY" });
        util.addEvent(dom.getElementById("parly_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "PARLAY", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "PARLAY" });
        util.addEvent(dom.getElementById("outright_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "OUTRIGHT", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "OUTRIGHT" });
        util.addEvent(dom.getElementById("started_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "STARTED", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "STARTED" });
        util.addEvent(dom.getElementById("results_S"), "click", _self.chgPage, { "page": "totalbet_header", "pageName": "RESULTS", "pageType": "totalbet", "target": "analysis", "tbet_showtype": "RESULTS" });


        util.addEvent(dom.getElementById("match_S"), "click", _self.chgPage, { "page": "match_header", "pageName": "MATCH", "pageType": "match", "target": "analysis", "tbet_showtype": "MATCH" });
        util.addEvent(dom.getElementById("matchList"), "click", _self.chgPage, { "page": "match_header", "pageName": "MATCH", "pageType": "match", "target": "analysis", "tbet_showtype": "MATCH" });

        //2019-04-10 Ricky 397.左邊控制版，當滑鼠移動到報表或帳號管理圖標後，在移到dashboard圖標後，左邊控制版的圖標選項不會自動收起(PJP-487)
        util.addEvent(dom.getElementById("menu_home"), "mouseenter", _self.hideDiv, {"target":"home"});
        util.addEvent(dom.getElementById("menu_account"), "mouseenter", _self.showDiv, {"target":"account"});
        util.addEvent(dom.getElementById("menu_report"), "mouseenter", _self.showDiv, {"target":"report"});
        util.addEvent(dom.getElementById("menu_analysis"), "mouseenter", _self.showDiv, {"target":"analysis"});
        util.addEvent(dom.getElementById("menu_betlist"), "mouseenter", _self.showDiv, {"target":"betlist"});
        util.addEvent(dom.getElementById("menu_match"), "mouseenter", _self.showDiv, {"target":"match"});
        util.addEvent(dom.getElementById("menu_log"), "mouseenter", _self.showDiv, {"target":"log"});
        util.addEvent(dom.getElementById("menu_setting"), "mouseenter", _self.showDiv, {"target":"setting"});

        util.addEvent(dom.getElementById("menu_account"), "mouseleave", _self.hideDiv, { "target": "account" });
        util.addEvent(dom.getElementById("menu_report"), "mouseleave", _self.hideDiv, { "target": "report" });
        util.addEvent(dom.getElementById("menu_analysis"), "mouseleave", _self.hideDiv, { "target": "analysis" });
        util.addEvent(dom.getElementById("menu_betlist"), "mouseleave", _self.hideDiv, {"target":"betlist"});
        util.addEvent(dom.getElementById("menu_match"), "mouseleave", _self.hideDiv, {"target":"match"});
        util.addEvent(dom.getElementById("menu_log"), "mouseleave", _self.hideDiv, {"target":"log"});
        util.addEvent(dom.getElementById("menu_setting"), "mouseleave", _self.hideDiv, {"target":"setting"});

        //放大menu
        //=== Dashboard ===
        dashB = dom.getElementById("dashB");
        util.addEvent(dom.getElementById("tit_home"), "click", _self.expendMenu, {"target":"home","page":"dashboard_main"});

        //=== Account Management ===
        accountM = dom.getElementById("accountM");
        acc_AD = dom.getElementById("acc_AD");
        acc_D0 = dom.getElementById("acc_D0");
        acc_CO = dom.getElementById("acc_CO");
        acc_SU = dom.getElementById("acc_SU");
        acc_AG = dom.getElementById("acc_AG");
        acc_MEM = dom.getElementById("acc_MEM");
        acc_Sub = dom.getElementById("acc_Sub");
        acc_SubAll = dom.getElementById("acc_SubAll");
        util.addEvent(dom.getElementById("tit_account"), "click", _self.expendMenu, {"target":"account"});

        //=== Reports ===
        reportS = dom.getElementById("reportS");
        util.addEvent(dom.getElementById("tit_report"), "click", _self.expendMenu, {"target":"report"});
        util.addEvent(dom.getElementById("wagerR"), "click", _self.chgPage, {"page":"report_main","target":"report"});
        util.addEvent(dom.getElementById("oldRS"), "click", _self.goToReportOld);

        //=== Total Bets ===
        totalB = dom.getElementById("totalB");
        util.addEvent(dom.getElementById("tit_analysis"), "click", _self.expendMenu, {"target":"analysis"});
        util.addEvent(dom.getElementById("overViewL"), "click", _self.chgPage, {"page":"overView","target":"analysis"});
        util.addEvent(dom.getElementById("re_L"), "click", _self.chgPage, { "page": "totalbet_header", "target": "analysis", "pageName": "INPLAY", "pageType": "totalbet", "tbet_showtype":"INPLAY" });
        util.addEvent(dom.getElementById("today_L"), "click", _self.chgPage, { "page": "totalbet_header", "target": "analysis", "pageName": "TODAY", "pageType": "totalbet", "tbet_showtype": "TODAY" });
        util.addEvent(dom.getElementById("fu_L"), "click", _self.chgPage, { "page": "totalbet_header", "target": "analysis", "pageName": "EARLY", "pageType": "totalbet", "tbet_showtype": "EARLY" });
        util.addEvent(dom.getElementById("parly_L"), "click", _self.chgPage, { "page": "totalbet_header", "target": "analysis", "pageName": "PARLAY", "pageType": "totalbet", "tbet_showtype": "PARLAY" });
        util.addEvent(dom.getElementById("outright_L"), "click", _self.chgPage, { "page": "totalbet_header", "target": "analysis", "pageName": "OUTRIGHT", "pageType": "totalbet", "tbet_showtype": "OUTRIGHT" });
        util.addEvent(dom.getElementById("started_L"), "click", _self.chgPage, { "page": "totalbet_header", "target": "analysis", "pageName": "STARTED", "pageType": "totalbet", "tbet_showtype": "STARTED" });
        util.addEvent(dom.getElementById("results_L"), "click", _self.chgPage, { "page": "totalbet_header", "target": "analysis", "pageName": "RESULTS", "pageType": "totalbet", "tbet_showtype": "RESULTS" });

        //=== BetList ===
        betlists = dom.getElementById("betlists");
        util.addEvent(dom.getElementById("tit_betlist"), "click", _self.expendMenu, {"target":"betlist"});

        util.addEvent(dom.getElementById("bet_list"),"click",_self.chgPage,{"page":"bet_header","target":"betlist", "pageName": "LIST", "pageType": "bet", "tbet_showtype":"LIST"});
        util.addEvent(dom.getElementById("bet_edit"),"click",_self.chgPage,{"page":"bet_header","target":"betlist", "pageName": "EDIT", "pageType": "bet", "tbet_showtype":"EDIT"});
        util.addEvent(dom.getElementById("bet_abnormal"),"click",_self.chgPage,{"page":"bet_header","target":"betlist", "pageName": "ABNORMAL", "pageType": "bet", "tbet_showtype":"ABNORMAL"});
        util.addEvent(dom.getElementById("bet_live_dangerous"),"click",_self.chgPage,{"page":"bet_header","target":"betlist", "pageName": "LIVE", "pageType": "bet", "tbet_showtype":"LIVE"});
        util.addEvent(dom.getElementById("bet_search"),"click",_self.chgPage,{"page":"bet_header","target":"betlist", "pageName": "SEARCH", "pageType": "bet", "tbet_showtype":"SEARCH"});

        util.addEvent(dom.getElementById("betList"),"click",_self.chgPage,{"page":"bet_header","target":"betlist", "pageName": "LIST", "pageType": "bet", "tbet_showtype":"LIST"});
        util.addEvent(dom.getElementById("betEdit"),"click",_self.chgPage,{"page":"bet_headerr","target":"betlist", "pageName": "EDIT", "pageType": "bet", "tbet_showtype":"EDIT"});
        util.addEvent(dom.getElementById("betAbnormal"),"click",_self.chgPage,{"page":"bet_header","target":"betlist", "pageName": "ABNORMAL", "pageType": "bet", "tbet_showtype":"ABNORMAL"});
        util.addEvent(dom.getElementById("betLiveDangerous"),"click",_self.chgPage,{"page":"bet_header","target":"betlist", "pageName": "LIVE", "pageType": "bet", "tbet_showtype":"LIVE"});
        util.addEvent(dom.getElementById("betSearch"),"click",_self.chgPage,{"page":"bet_header","target":"betlist", "pageName": "SEARCH", "pageType": "bet", "tbet_showtype":"SEARCH"});

        //=== Match ===
        matchs = dom.getElementById("matchs");
        util.addEvent(dom.getElementById("tit_match"), "click", _self.expendMenu, {"target":"match"});
        //=== Log ===
        logs = dom.getElementById("logs");
        log_AD = dom.getElementById("log_AD");
        log_D0 = dom.getElementById("log_D0");
        log_CO = dom.getElementById("log_CO");
        log_SU = dom.getElementById("log_SU");
        log_AG = dom.getElementById("log_AG");
        log_MEM = dom.getElementById("log_MEM");
        log_Sub = dom.getElementById("log_Sub");

        util.addEvent(dom.getElementById("tit_log"), "click", _self.expendMenu, {"target":"log"});
        //=== setting ===
        settings = dom.getElementById("settings");
        util.addEvent(dom.getElementById("tit_setting"), "click", _self.expendMenu, {"target":"setting"});
        util.addEvent(dom.getElementById("sset_config"), "click", _self.chgPage, {"page":"setting_system","target":"setting"});
        util.addEvent(dom.getElementById("set_config"), "click", _self.chgPage, {"page":"setting_system","target":"setting"});
        util.addEvent(dom.getElementById("sset_curl"), "click", _self.chgPage, {"page":"setting_header","target":"setting"});
        util.addEvent(dom.getElementById("set_curl"), "click", _self.chgPage, {"page":"setting_header","target":"setting"});
        util.addEvent(dom.getElementById("sset_data_manger"), "click", _self.chgPage, {"page":"data_manger","target":"setting"});
        util.addEvent(dom.getElementById("set_data_manger"), "click", _self.chgPage, {"page":"data_manger","target":"setting"});
        if(top.login_layer == "ad"){
            log_AD.remove();
            acc_AD.remove();
            slog_AD.remove();
            sacc_AD.remove();
            dom.getElementById("sset_curl").remove();
            dom.getElementById("set_curl").remove();
        }

        if (top.user_enable == "S") {
            menu_analysis.style.display = "none";
            totalB.style.display = "none";
        }

        //判斷子帳號有哪些權限來隱藏header
        if(top.user_type == 2 || top.user_type == 3){
            if(sacc_Sub) sacc_Sub.style.display = "none";    //電腦版
            if(acc_Sub) acc_Sub.style.display = "none";     //手機版
            if(sacc_SubAll) sacc_SubAll.style.display = "none";    //代理子账号-電腦版
            if(acc_SubAll) acc_SubAll.style.display = "none";     //代理子账号-手機版
            if(top.login_layer == "ad"){
                dom.getElementById("menu_setting").style.display = "none";
                dom.getElementById("settings").style.display = "none";
            }
            if(pri_type.indexOf("A")==-1){ //即時注單
                menu_analysis.style.display="none";
                totalB.style.display="none";
                dom.getElementById("menu_betlist").style.display = "none";
                dom.getElementById("betlists").style.display = "none";
                dom.getElementById("menu_match").style.display = "none";
                dom.getElementById("matchs").style.display = "none";
            }
            if(pri_type.indexOf("B")==-1){ //帳號管理
                menu_account.style.display="none";
                accountM.style.display="none";
            }
            if(pri_type.indexOf("C")==-1){ //報表
                menu_report.style.display="none";
                reportS.style.display="none";
            }
        }

        if (acc_AD.style.display != "none") util.addEvent(acc_AD, "click", _self.chgPage, { "page": "acc_ad_list", "target": "account" });
        if (sacc_AD.style.display != "none") util.addEvent(sacc_AD, "click", _self.chgPage, { "page": "acc_ad_list", "target": "account" });
        if (acc_D0.style.display != "none") util.addEvent(acc_D0, "click", _self.chgPage, { "page": "acc_d0_list", "target": "account" });
        if (sacc_D0.style.display != "none") util.addEvent(sacc_D0, "click", _self.chgPage, { "page": "acc_d0_list", "target": "account" });
        if (acc_CO.style.display != "none") util.addEvent(acc_CO, "click", _self.chgPage, { "page": "acc_co_list", "target": "account" });
        if (sacc_CO.style.display != "none") util.addEvent(sacc_CO, "click", _self.chgPage, { "page": "acc_co_list", "target": "account" });
        if (acc_SU.style.display != "none") util.addEvent(acc_SU, "click", _self.chgPage, { "page": "acc_su_list", "target": "account" });
        if (sacc_SU.style.display != "none") util.addEvent(sacc_SU, "click", _self.chgPage, { "page": "acc_su_list", "target": "account" });
        if (acc_AG.style.display != "none") util.addEvent(acc_AG, "click", _self.chgPage, { "page": "acc_ag_list", "target": "account" });
        if (sacc_AG.style.display != "none") util.addEvent(sacc_AG, "click", _self.chgPage, { "page": "acc_ag_list", "target": "account" });
        if (acc_MEM.style.display != "none") util.addEvent(acc_MEM, "click", _self.chgPage, { "page": "acc_mem_list", "target": "account" });
        if (sacc_MEM.style.display != "none") util.addEvent(sacc_MEM, "click", _self.chgPage, { "page": "acc_mem_list", "target": "account" });
        util.addEvent(acc_Sub, "click", _self.chgPage, { "page": "acc_sub_list", "target": "account" });
        util.addEvent(sacc_Sub, "click", _self.chgPage, { "page": "acc_sub_list", "target": "account" });
        
        // 代理子账号只对 AD 和 ADS 显示
        if(top.login_layer == "ad" || top.login_layer == "ads"){
            if(acc_SubAll) util.addEvent(acc_SubAll, "click", _self.chgPage, { "page": "acc_sub_all_list", "target": "account" });
            if(sacc_SubAll) util.addEvent(sacc_SubAll, "click", _self.chgPage, { "page": "acc_sub_all_list", "target": "account" });
        }else{
            if(sacc_SubAll) sacc_SubAll.style.display = "none";
            if(acc_SubAll) acc_SubAll.style.display = "none";
        }

        //log
        if (log_AD.style.display != "none") util.addEvent(log_AD, "click", _self.chgPage, { "page": "log_ad", "target": "log" });
        if (slog_AD.style.display != "none") util.addEvent(slog_AD, "click", _self.chgPage, { "page": "log_ad", "target": "log" });
        if (log_D0.style.display != "none") util.addEvent(log_D0, "click", _self.chgPage, { "page": "log_d0", "target": "log" });
        if (slog_D0.style.display != "none") util.addEvent(slog_D0, "click", _self.chgPage, { "page": "log_d0", "target": "log" });
        if (log_CO.style.display != "none") util.addEvent(log_CO, "click", _self.chgPage, { "page": "log_co", "target": "log" });
        if (slog_CO.style.display != "none") util.addEvent(slog_CO, "click", _self.chgPage, { "page": "log_co", "target": "log" });
        if (log_SU.style.display != "none") util.addEvent(log_SU, "click", _self.chgPage, { "page": "log_su", "target": "log" });
        if (slog_SU.style.display != "none") util.addEvent(slog_SU, "click", _self.chgPage, { "page": "log_su", "target": "log" });
        if (log_AG.style.display != "none") util.addEvent(log_AG, "click", _self.chgPage, { "page": "log_ag", "target": "log" });
        if (slog_AG.style.display != "none") util.addEvent(slog_AG, "click", _self.chgPage, { "page": "log_ag", "target": "log" });
        if (log_MEM.style.display != "none") util.addEvent(log_MEM, "click", _self.chgPage, { "page": "log_mem", "target": "log" });
        if (slog_MEM.style.display != "none") util.addEvent(slog_MEM, "click", _self.chgPage, { "page": "log_mem", "target": "log" });

        //_self.loadOverview();
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.chgPage=function(e, param){
        //util.echo("[left chgPage]:"+param);
        param.retFun = _self.changePageComplete;
        if(param.page=="report_main") param.pageName="report";
        if(param.page=="dashboard_main") param.pageName="dashboard";

        parentClass.dispatchEvent("bodyGoToPage", param);
        if(param.page!="dashboard_main") _self.hideDiv(e, param);
        //if(param.page!="dashboard_main") _self.hideDiv(param);
        if (param.page == "overView"){
            param.pageName = "overview";
            param.pageType = "totalbet";
        }
        parentClass.dispatchEvent("closeLeftMenu", {"retFun":_self.showComplete});
        top.mu_isOpen = "close";
        if (param.page == "totalbet_header" && param.tbet_showtype != undefined) top.tbet_showtype = param.tbet_showtype;
        if (param.page == "match_header" && param.tbet_showtype != undefined) top.tbet_showtype = param.tbet_showtype;
        if (param.page == "bet_header" && param.tbet_showtype != undefined) top.bet_showtype = param.tbet_showtype;
    }

    //onFocus
    _self.onFocusEventHandler=function(evt, param){
        //targetObj.placeholder="";
        dom.getElementById("show_"+param.target).style.display = "";
    }

    //onBlur
    _self.onBlurEventHandler=function(evt, param){
        dom.getElementById("show_"+param.target).style.display = "none";
    }

    _self.showDiv=function(e, param){
        dom.getElementById("menu_"+param.target).className = "le_"+param.target+" active";

        //if (param.target == "analysis") _self.loadOverview();
    }

    _self.hideDiv=function(e, param){
        //2019-04-10 Ricky 397.左邊控制版，當滑鼠移動到報表或帳號管理圖標後，在移到dashboard圖標後，左邊控制版的圖標選項不會自動收起(PJP-487)
        if(param.target == "home" ){
            var tmpAry = new Array("account","report","analysis","betlist","match","log");
            for(i=0;i<tmpAry.length;i++){
                var tmpObj = dom.getElementById("menu_"+tmpAry[i]);
                if(tmpObj.classList.contains("on_smallLi"))tmpObj.className = "le_"+tmpAry[i]+" on_smallLi";
                else tmpObj.className = "le_"+tmpAry[i];
            }
        }else{
            var tmpObj = dom.getElementById("menu_"+param.target);
            if(tmpObj.classList.contains("on_smallLi"))tmpObj.className = "le_"+param.target+" on_smallLi";
            else tmpObj.className = "le_"+param.target;
        }
    }

    _self.openMenu=function(){
        le_smallG.style.display="none";
        le_bigG.style.display="";
        _self.sizeChange() ;
    }

    _self.closeMenu=function(){
        le_smallG.style.display="";
        le_bigG.style.display="none";
        _self.sizeChange() ;
    }
    //畫面改變時 fixed 的物件顯示會異常, 異動class 觸發畫面重新偵測
    _self.sizeChange = function () {
        var tmpObj = dom.getElementById("main") ;
        if (tmpObj) {
            tmpObj.classList.add("nofixed");
            setTimeout(function () { tmpObj.classList.remove("nofixed"); }, 400);
        }
    }

    _self.showComplete=function(){
        util.echo("showComplete");
    }

    _self.expendMenu=function(e, param){
        _self.chgColor(param);
        if(param.target=="home"){
            _self.chgPage(e,param);
        }
        if(param.target=="account"){
            //_self.chgPage(e,param);
            if(!A_isExpend){
                A_isExpend = true;
                accountM.className="le_title_down";
            }else{
                A_isExpend = false;
                accountM.className="";
            }
        }
        if(param.target=="report"){
            //_self.chgPage(e,param);
            if(!R_isExpend){
                R_isExpend = true;
                reportS.className="le_title_down";
            }else{
                R_isExpend = false;
                reportS.className="";
            }
        }
        if(param.target=="analysis"){
            //_self.chgPage(e,param);
            if(!T_isExpend){
                T_isExpend = true;
                totalB.className="le_title_down";

            }else{
                T_isExpend = false;
                totalB.className="";
                //_self.loadOverview();
            }
        }

        if(param.target=="betlist"){
            //_self.chgPage(e,param);
            if(!Betlist_isExpend){
                Betlist_isExpend = true;
                betlists.className="le_title_down";

            }else{
                Betlist_isExpend = false;
                betlists.className="";
                //_self.loadOverview();
            }
        }

        if(param.target=="match"){
            //_self.chgPage(e,param);
            if(!Match_isExpend){
                Match_isExpend = true;
                matchs.className="le_title_down";

            }else{
                Match_isExpend = false;
                matchs.className="";
                //_self.loadOverview();
            }
        }

        if(param.target=="log"){
            //_self.chgPage(e,param);
            if(!Log_isExpend){
                Log_isExpend = true;
                logs.className="le_title_down";

            }else{
                Log_isExpend = false;
                logs.className="";
                //_self.loadOverview();
            }
        }

        if(param.target=="setting"){
            //_self.chgPage(e,param);
            if(!Setting_isExpend){
                Setting_isExpend = true;
                settings.className="le_title_down";

            }else{
                Setting_isExpend = false;
                settings.className="";
                //_self.loadOverview();
            }
        }

        if (param.target != "home"){
            if (e.target.id.match(/^menu_/)) dom.getElementById("menu_" + param.target).className = "le_" + param.target + " on_smallLi active";
            if (e.target.id.match(/^tit_/)) dom.getElementById("tit_" + param.target).className = "le_" + param.target + " le_titleOn active";
        }
    }

    _self.goToReportOld=function(){
        util.echo(location.href);
        var nowSite = location.href;
        // var goSite = "https://125.252.69.72";
        //var goSite = "https://nold.hga008.com/";
        var goSite = "https://125.252.69.75";
        if(nowSite.indexOf("cvssp")!=-1){
            goSite = nowSite.replace("a1","accs3");
        }
        //2019-03-27 Ricky 466.左邊儀表版 - reports - old report site 要另彈頁面
        //win.location.href=goSite;
        win.open(goSite);
    }

    //menu變深底色
    _self.chgColor=function(param){
        util.echo(param.target);
        util.echo("left menu chgColor");
        //初始化
        var menuAry = new Array("home","account","report","analysis","betlist","match","log","setting");
        for(i=0;i<menuAry.length;i++){
            dom.getElementById("menu_"+menuAry[i]).className = "le_"+menuAry[i];
            dom.getElementById("tit_"+menuAry[i]).className = "le_"+menuAry[i];
        }
        if(menuAry.indexOf(param.target) != -1){
            dom.getElementById("menu_"+param.target).classList.add("on_smallLi");
            dom.getElementById("tit_"+param.target).classList.add("le_titleOn");
        }
        //dom.getElementById("menu_"+param.target).className = "le_"+param.target+" on_smallLi active";
        //dom.getElementById("tit_"+param.target).className = "le_"+param.target+" le_titleOn active";

    }

    _self.loadOverview = function () {
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.loadFinish);
        getHttp.loadURL(top.url, "POST", _self.getUrlParam());
    }

    _self.getUrlParam = function () {
        var sendCode = "";
        sendCode += "p=get_overview";
        sendCode += "&uid=" + top.uid;
        sendCode += "&login_layer=" + top.login_layer;
        sendCode += "&id=" + top.layer_id;
        return sendCode;
    }

    _self.loadFinish = function (xml) {
        var gtypeAry = config_set.get("GTYPEARY");
        var timeAry = new Array("inplay", "today", "early", "outright", "parlay");
        var ary = JSON.parse(xml);
        var _status = util.showTxt(ary, "status");
        var total = new Array();

        for (var k = 0; k < timeAry.length; k++) {
            var time = timeAry[k];
            total[time] = 0;
        }
        for (var j = 0; j < gtypeAry.length; j++) {
            var gtype = gtypeAry[j];
            for (var i = 0; i < timeAry.length; i++) {
                var time = timeAry[i];
                if (top.user_enable != "S") {
                    total[time] += (_status["period"][gtype][time]["bets"]) * 1;
                }
            }
        }

        for (var k = 0; k < timeAry.length; k++) {
            var _time = timeAry[k];
            var _total = total[_time];
            document.getElementById(_time + "_total_S").innerHTML = _total;
            document.getElementById(_time + "_total_L").innerHTML = _total;
        }

    }

}