function bet_mem_index(_win, _dom,_toppar){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "bet_mem_index";
    var util;
    var LS;
    var config_set;
    var Timer;
    var LS_code;
    var _mc = new Object();
    var eventHandler = new Object();
    var toppar = _toppar;
    var Cookie;
    var _top;

    var bodyFrame = null;
    var tmpScreen;
    var paramObj;
    var parentClass;
    var _myTop;
    var _gtypeAry = new Array();
    var _totalCnt = 100;

    var par = new Object();
    var _stake = new Object();
    var timerHash = new Object();
    var musicObj = null;

    var nowDetail = "";
    var getView;
    var view_w;
    var ret_xmp = ["764_up","764_down"];  //選用框架 //改兩邊做
    var ret_xmp_big = "764_up";    	//改兩邊做
    var ret_xmp_small = "764_down";		//改兩邊做
    var testTimerTurn = true;  //測試用 reloadData開關
    var storage;
    var data_filter;
    var levelClassAry = ["AGCLASS","MACLASS","SMACLASS","COCLASS"];
    var levelNum = 0;
    var levelWagerObj=null;

    _stake["radio"] = "";
    _stake["ALL_gold"] = "";
    _stake["FT_gold"] = "";
    _stake["BK_gold"] = "";
    _stake["TN_gold"] = "";
    _stake["VB_gold"] = "";
    _stake["BM_gold"] = "";
    _stake["TT_gold"] = "";
    _stake["BS_gold"] = "";
    _stake["OP_gold"] = "";
    _stake["SK_gold"] = "";
    _stake["FS_gold"] = "";

    var _set = new Object();
    _set["remenberflg"] = false;
    _set["musicflg"] = "on";
    _set["init_divShow"] = "";
    _set["tdnoneMA"] = "";
    _set["tdnoneSMA"] = "";
    _set["tdnoneCO"] = "";
    _set["width_sty"] = "bet_betDetail22";
    _set["gtype"] = "ALL";
    _set["result"] = "0";
    _set["sel_maxid"] = "0";
    _set["gold"] = "";//stake
    _set["down_id"] = "";
    _set["market"] = "";
    _set["league_id"] = "";
    _set["event"] = "";
    _set["dates"] = "TODAY";
    _set["bettype"] = "";
    _set["site"] = "";

    _set["typeMap"] = new Object();
    _set["typeMap"]["FT"] = new Object();
    _set["typeMap"]["FT"]["P3"] = ["FT_P"];
    _set["typeMap"]["FT"]["R"] = ["FT_R","FT_HR","FT_RE","FT_HRE"];
    _set["typeMap"]["FT"]["OU"] = ["FT_OU","FT_HOU","FT_ROU","FT_HROU"];
    _set["typeMap"]["FT"]["M"] = ["FT_M","FT_HM","FT_RM","FT_HRM"];
    _set["typeMap"]["FT"]["PD"] = ["FT_PD","FT_HPD","FT_RPD","FT_HRPD"];
    _set["typeMap"]["FT"]["M15"] = ["FT_AR","FT_BR","FT_CR","FT_DR","FT_ER","FT_FR","FT_AOU","FT_BOU","FT_COU","FT_DOU","FT_EOU","FT_FOU",
        "FT_AM","FT_BM","FT_CM","FT_DM","FT_EM","FT_FM","FT_ARE","FT_BRE","FT_CRE","FT_DRE","FT_ERE","FT_FRE",
        "FT_AROU","FT_BROU","FT_CROU","FT_DROU","FT_EROU","FT_FROU","FT_ARM","FT_BRM","FT_CRM","FT_DRM","FT_ERM","FT_FRM"];
    _set["typeMap"]["FT"]["T"] = ["FT_T","FT_HT","FT_RT","FT_HRT"];
    _set["typeMap"]["FT"]["OUALL"] = ["FT_OUH","FT_OUC","FT_HOUH","FT_HOUC","FT_ROUH","FT_ROUC","FT_HRUH","FT_HRUC"];
    _set["typeMap"]["FT"]["EO"] = ["FT_ODD","FT_EVEN","FT_HODD","FT_HEVEN","FT_RODD","FT_REVEN","FT_HRODD","FT_HREVEN"];
    _set["typeMap"]["FT"]["F"] = ["FT_F","FT_RF"];
    _set["typeMap"]["FT"]["WM"] = ["FT_WM","FT_RWM"];
    _set["typeMap"]["FT"]["DC"] = ["FT_DC","FT_RDC"];
    _set["typeMap"]["FT"]["FS"] = ["FT_FS"];
    _set["typeMap"]["FT"]["CS"] = ["FT_CS","FT_RCS"];
    _set["typeMap"]["FT"]["WN"] = ["FT_WN","FT_RWN"];
    _set["typeMap"]["FT"]["RCD"] = ["FT_RCD"];
    _set["typeMap"]["FT"]["F2G"] = ["FT_F2G"];
    _set["typeMap"]["FT"]["F3G"] = ["FT_F3G"];
    _set["typeMap"]["FT"]["HMG"] = ["FT_HG","FT_MG","FT_RHG","FT_RMG"];
    _set["typeMap"]["FT"]["SB"] = ["FT_SB","FT_RSB"];
    _set["typeMap"]["FT"]["FG"] = ["FT_FG"];
    _set["typeMap"]["FT"]["T1G"] = ["FT_T1G","FT_RT1G"];
    _set["typeMap"]["FT"]["T3G"] = ["FT_T3G","FT_RT3G"];
    _set["typeMap"]["FT"]["W3"] = ["FT_W3"];
    _set["typeMap"]["FT"]["BH"] = ["FT_BH"];
    _set["typeMap"]["FT"]["WE"] = ["FT_WE","FT_RWE"];
    _set["typeMap"]["FT"]["WB"] = ["FT_WB","FT_RWB"];
    _set["typeMap"]["FT"]["TK"] = ["FT_TK"];
    _set["typeMap"]["FT"]["PA"] = ["FT_PA"];
    _set["typeMap"]["FT"]["ST"] = ["FT_STFH","FT_STFC","FT_STFN","FT_STLH","FT_STLC","FT_STLN"];
    _set["typeMap"]["FT"]["OS"] = ["FT_OSFH","FT_OSFC","FT_OSFN","FT_OSLH","FT_OSLC","FT_OSLN"];

    //2016 新玩法 & 修正
    _set["typeMap"]["FT"]["TS"] = ["FT_TS","FT_RTS","FT_HTS","FT_RTS2"];
    _set["typeMap"]["FT"]["EOALL"] = ["FT_EOH","FT_EOC","FT_HEOH","FT_HEOC"];
    _set["typeMap"]["FT"]["PG"] = ["FT_PGFH","FT_PGFC","FT_PGFN","FT_PGLH","FT_PGLC","FT_PGLN",
        "FT_ARG","FT_BRG","FT_CRG","FT_DRG","FT_ERG","FT_FRG","FT_GRG","FT_HRG","FT_IRG","FT_JRG"];
    _set["typeMap"]["FT"]["MQ"] = ["FT_MQ","FT_MW"];
    _set["typeMap"]["FT"]["MOU"] = ["FT_MOUA","FT_MOUB","FT_MOUC","FT_MOUD","FT_RMUA","FT_RMUB","FT_RMUC","FT_RMUD"];
    _set["typeMap"]["FT"]["MPG"] = ["FT_MPG","FT_RMPG"];
    _set["typeMap"]["FT"]["MTS"] = ["FT_MTS","FT_RMTS"];
    _set["typeMap"]["FT"]["OUT"] = ["FT_OUTA","FT_OUTB","FT_OUTC","FT_OUTD","FT_RUTA","FT_RUTB","FT_RUTC","FT_RUTD"];
    _set["typeMap"]["FT"]["RSX"] = ["FT_RSHA","FT_RSHB","FT_RSHC","FT_RSHD","FT_RSHE","FT_RSHF","FT_RSHG","FT_RSHH","FT_RSHI","FT_RSHJ","FT_RSHK","FT_RSHL","FT_RSHM","FT_RSHN","FT_RSHO",
        "FT_RSCA","FT_RSCB","FT_RSCC","FT_RSCD","FT_RSCE","FT_RSCF","FT_RSCG","FT_RSCH","FT_RSCI","FT_RSCJ","FT_RSCK","FT_RSCL","FT_RSCM","FT_RSCN","FT_RSCO"];
    _set["typeMap"]["FT"]["CN"] = ["FT_CNFH","FT_CNFC","FT_CNFN","FT_CNLH","FT_CNLC","FT_CNLN",
        "FT_RNC1","FT_RNC2","FT_RNC3","FT_RNC4","FT_RNC5","FT_RNC6","FT_RNC7","FT_RNC8","FT_RNC9","FT_RNCA",
        "FT_RNCB","FT_RNCC","FT_RNCD","FT_RNCE","FT_RNCF","FT_RNCG","FT_RNCH","FT_RNCI","FT_RNCJ","FT_RNCK",
        "FT_RNCL","FT_RNCM","FT_RNCN","FT_RNCO","FT_RNCP","FT_RNCQ","FT_RNCR","FT_RNCS","FT_RNCT","FT_RNCU"];
    _set["typeMap"]["FT"]["CD"] = ["FT_CDFH","FT_CDFC","FT_CDFN","FT_CDLH","FT_CDLC","FT_CDLN",
        "FT_RNBA","FT_RNBB","FT_RNBC","FT_RNBD","FT_RNBE","FT_RNBF","FT_RNBG","FT_RNBH","FT_RNBI","FT_RNBJ","FT_RNBK","FT_RNBL","FT_RNBM","FT_RNBN","FT_RNBO"];
    _set["typeMap"]["FT"]["OG"] = ["FT_OG"];
    _set["typeMap"]["FT"]["OUE"] = ["FT_OUEA","FT_OUEB","FT_OUEC","FT_OUED","FT_RUEA","FT_RUEB","FT_RUEC","FT_RUED"];
    _set["typeMap"]["FT"]["OUP"] = ["FT_OUPA","FT_OUPB","FT_OUPC","FT_OUPD","FT_RUPA","FT_RUPB","FT_RUPC","FT_RUPD"];
    _set["typeMap"]["FT"]["DU"] = ["FT_DUA","FT_DUB","FT_DUC","FT_DUD","FT_RDUA","FT_RDUB","FT_RDUC","FT_RDUD"];
    _set["typeMap"]["FT"]["DS"] = ["FT_DS","FT_RDS"];
    _set["typeMap"]["FT"]["DG"] = ["FT_DG","FT_RDG"];
    _set["typeMap"]["FT"]["OT"] = ["FT_OT","FT_ROT"];
    _set["typeMap"]["FT"]["YC"] = ["FT_YCFH","FT_YCFC","FT_YCFN","FT_YCLH","FT_YCLC","FT_YCLN"];
    _set["typeMap"]["FT"]["RC"] = ["FT_RCFH","FT_RCFC","FT_RCFN","FT_RCLH","FT_RCLC","FT_RCLN"];
    _set["typeMap"]["FT"]["GA"] = ["FT_GAFH","FT_GAFC","FT_GAFN","FT_GALH","FT_GALC","FT_GALN"];
    _set["typeMap"]["FT"]["ET5"] = ["FT_TARU","FT_TBRU","FT_TCRU","FT_TDRU","FT_TERU","FT_TFRU"];
    _set["typeMap"]["FT"]["RPX"] = ["FT_RPXA","FT_RPXB","FT_RPXC","FT_RPXD","FT_RPXE","FT_RPXF"];
    _set["typeMap"]["FT"]["RTW"] = ["FT_RTW"];
    _set["typeMap"]["FT"]["RPF"] = ["FT_RPF"];
    _set["typeMap"]["FT"]["RPS"] = ["FT_RPS"];


    _set["typeMap"]["BK"] = new Object();
    _set["typeMap"]["BK"]["R"] = ["BK_R","BK_RE"];
    _set["typeMap"]["BK"]["OU"] = ["BK_OU","BK_ROU"];
    _set["typeMap"]["BK"]["OUALL"] = ["BK_OUH","BK_OUC","BK_ROUH","BK_ROUC"];
    _set["typeMap"]["BK"]["PDALL"] = ["BK_PD","BK_RPD"];
    _set["typeMap"]["BK"]["M"] = ["BK_M","BK_RM"];
    _set["typeMap"]["BK"]["EO"] = ["BK_ODD","BK_EVEN","BK_RODD","BK_REVEN"];
    _set["typeMap"]["BK"]["P3"] = ["BK_P"];

    _set["typeMap"]["BM"] = new Object();
    _set["typeMap"]["BM"]["M"] = ["BM_M","BM_RM"];
    _set["typeMap"]["BM"]["R"] = ["BM_R","BM_RE"];
    _set["typeMap"]["BM"]["OU"] = ["BM_OU","BM_ROU"];
    _set["typeMap"]["BM"]["Rms"] = ["BM_Rms","BM_REms"];
    _set["typeMap"]["BM"]["OUms"] = ["BM_OUms","BM_ROUms"];
    _set["typeMap"]["BM"]["OUALL"] = ["BM_OUH","BM_OUC","BM_ROUH","BM_ROUC"];
    _set["typeMap"]["BM"]["PDALL"] = ["BM_PD3","BM_PD5","BM_RPD3","BM_RPD5"];
    _set["typeMap"]["BM"]["EO"] = ["BM_ODD","BM_EVEN","BM_RODD","BM_REVEN"];
    _set["typeMap"]["BM"]["EOms"] = ["BM_ODDms","BM_EVENms","BM_RODDms","BM_REVENms"];
    _set["typeMap"]["BM"]["P3"] = ["BM_P"];

    _set["typeMap"]["TT"] = new Object();
    _set["typeMap"]["TT"]["M"] = ["TT_M","TT_RM"];
    _set["typeMap"]["TT"]["R"] = ["TT_R","TT_RE"];
    _set["typeMap"]["TT"]["OU"] = ["TT_OU","TT_ROU"];
    _set["typeMap"]["TT"]["Rms"] = ["TT_Rms","TT_REms"];
    _set["typeMap"]["TT"]["OUms"] = ["TT_OUms","TT_ROUms"];
    _set["typeMap"]["TT"]["OUALL"] = ["TT_OUH","TT_OUC","TT_ROUH","TT_ROUC"];
    _set["typeMap"]["TT"]["PDALL"] = ["TT_PD3","TT_PD5","TT_RPD3","TT_RPD5"];
    _set["typeMap"]["TT"]["EO"] = ["TT_ODD","TT_EVEN","TT_RODD","TT_REVEN"];
    _set["typeMap"]["TT"]["EOms"] = ["TT_ODDms","TT_EVENms","TT_RODDms","TT_REVENms"];
    _set["typeMap"]["TT"]["P3"] = ["TT_P"];

    _set["typeMap"]["TN"] = new Object();
    _set["typeMap"]["TN"]["M"] = ["TN_M","TN_RM"];
    _set["typeMap"]["TN"]["R"] = ["TN_R","TN_RE"];
    _set["typeMap"]["TN"]["OU"] = ["TN_OU","TN_ROU"];
    _set["typeMap"]["TN"]["Rms"] = ["TN_Rms","TN_REms"];
    _set["typeMap"]["TN"]["OUms"] = ["TN_OUms","TN_ROUms"];
    _set["typeMap"]["TN"]["OUALL"] = ["TN_OUH","TN_OUC","TN_ROUH","TN_ROUC"];
    _set["typeMap"]["TN"]["PDALL"] = ["TN_PD5","TN_PD7","TN_RPD5","TN_RPD7"];
    _set["typeMap"]["TN"]["EO"] = ["TN_ODD","TN_EVEN","TN_RODD","TN_REVEN"];
    _set["typeMap"]["TN"]["EOms"] = ["TN_ODDms","TN_EVENms","TN_RODDms","TN_REVENms"];
    _set["typeMap"]["TN"]["P3"] = ["TN_P"];

    _set["typeMap"]["VB"] = new Object();
    _set["typeMap"]["VB"]["M"] = ["VB_M","VB_RM"];
    _set["typeMap"]["VB"]["R"] = ["VB_R","VB_RE"];
    _set["typeMap"]["VB"]["OU"] = ["VB_OU","VB_ROU"];
    _set["typeMap"]["VB"]["Rms"] = ["VB_Rms","VB_REms"];
    _set["typeMap"]["VB"]["OUms"] = ["VB_OUms","VB_ROUms"];
    _set["typeMap"]["VB"]["OUALL"] = ["VB_OUH","VB_OUC","VB_ROUH","VB_ROUC"];
    _set["typeMap"]["VB"]["PDALL"] = ["VB_PD3","VB_PD5","VB_RPD3","VB_RPD5"];
    _set["typeMap"]["VB"]["EO"] = ["VB_ODD","VB_EVEN","VB_RODD","VB_REVEN"];
    _set["typeMap"]["VB"]["EOms"] = ["VB_ODDms","VB_EVENms","VB_RODDms","VB_REVENms"];
    _set["typeMap"]["VB"]["P3"] = ["VB_P"];

    _set["typeMap"]["BS"] = new Object();
    _set["typeMap"]["BS"]["R"] = ["BS_R","BS_RE","BS_HR","BS_HRE"];
    _set["typeMap"]["BS"]["OU"] = ["BS_OU","BS_ROU","BS_HOU","BS_HROU"];
    _set["typeMap"]["BS"]["M"] = ["BS_M","BS_RM","BS_HM","BS_HRM"];
    _set["typeMap"]["BS"]["EO"] = ["BS_EOO","BS_EOE","BS_REOO","BS_REOE"];
    _set["typeMap"]["BS"]["OUALL"] = ["BS_OUH","BS_OUC","BS_ROUH","BS_ROUC","BS_HOUH","BS_HOUC","BS_HRUH","BS_HRUC"];
    _set["typeMap"]["BS"]["WM"] = ["BS_WM","BS_RWM","BS_HWM","BS_HRWM"];
    _set["typeMap"]["BS"]["OT"] = ["BS_OT","BS_ROT"];
    _set["typeMap"]["BS"]["P3"] = ["BS_P"];

    _set["typeMap"]["OP"] = new Object();
    _set["typeMap"]["OP"]["R"] = ["OP_R","OP_RE"];
    _set["typeMap"]["OP"]["OU"] = ["OP_OU","OP_ROU"];
    _set["typeMap"]["OP"]["M"] = ["OP_M","OP_RM"];
    _set["typeMap"]["OP"]["EO"] = ["OP_ODD","OP_EVEN","OP_RODD","OP_REVEN"];
    _set["typeMap"]["OP"]["P3"] = ["OP_P"];

    _set["typeMap"]["SK"] = new Object();
    _set["typeMap"]["SK"]["R"] = ["OP_R","OP_RE"];
    _set["typeMap"]["SK"]["OU"] = ["OP_OU","OP_ROU"];
    _set["typeMap"]["SK"]["M"] = ["OP_M","OP_RM"];
    _set["typeMap"]["SK"]["EO"] = ["OP_EOO","OP_EOE","OP_REOO","OP_REOE"];
    _set["typeMap"]["SK"]["FALL"] = ["F01","F02","RF01","RF02","RF03","RF04","RF05","RF06","RF07","RF08","RF09","RF10",
        "RF11","RF12","RF13","RF14","RF15","RF16","RF17","RF18","RF19","RF20","RF21","RF22",
        "RF23","RF24","RF25","RF26","RF27","RF28","RF29","RF30","RF31","RF32","RF33","RF34","RF35"];
    _set["typeMap"]["SK"]["P3"] = ["OP_P"];


    var myDate = new Date();
    var filterInitParam = new Object();
    var dateHash = JSON.parse(win.jsonDate);
    filterInitParam = {
        "gtype":{
            "info_mode":true,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_titleName":"",
            "_contantView":null,
            "_type":null,
            "_viewClass":"active",
            "_list":["ALL","FT","BK","ES","TN","VB","BM","TT","BS","SK","OP","FS"],
            "_listSub":["ALL","","Basketball / American Football","Tennis","Volleyball","Badminton","Table Tennis","Baseball","Snooker","Other Sports"],
            "mode":1,
            "_chkClass":"",
            "_default":"ALL",
            "_act":true,
        },
        "result":{
            "info_mode":true,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_titleName":"",
            "_contantView":null,
            "_type":null,
            "_viewClass":"active",
            "_list":["ALL","0","1","W","HW","L","HL","T"],
            "_listSub":["所有","未结算","已结算","赢","半赢","输","半输","退还"],
            "mode":1,
            "_chkClass":"",
            "_default":"0",
            "_act":true,
        },
        "stake":{
            "mode":2,
            "info_mode":false,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_titleName":"",
            "_contantView":null,
            "_type":null,
            "_viewClass":"active",
            "_group":["ALL","PER"],
            "_list":["ALL","FT","BK","ES","TN","VB","BM","TT","BS","SK","OP","FS"],
            "_default":{
                "mode":"ALL",
                "listGold":{
                    "ALL":0,
                    "FT":0,
                    "BK":0,
                    "ES":0,
                    "TN":0,
                    "VB":0,
                    "BM":0,
                    "TT":0,
                    "BS":0,
                    "SK":0,
                    "OP":0,
                },
            },
            "listItem":"",
            "_act":true,
        },
        "market":{
            "info_mode":true,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_titleName":"",
            "_contantView":null,
            "_type":null,
            "_viewClass":"active",
            "_chkClass":"",
            "_list":["ALL","rb","ft","fu"],
            "_listSub":["ALL","LIVE","TODAY","EARLY"],
            "_default":"ALL",
            "mode":1,
            "_act":true,
        },
        "league":{
            "mode":4,
            "info_mode":false,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_titleName":"",
            "_contantView":null,
            "_dataShowDiv":null,
            "_data":null, //4: {id: "4", leaguename: "Test"}
            "_viewClass":"active",
            "_chkClass":"",
            "_default":"111",
            // "_limitCount":5,
            "_searchOpen":true,
            "_searchItem":"leagueID",
            "_searchDiv":null,
            "_breakpoint":[
                {
                    "div":null,
                    "amount":0
                },
                {
                    "div":null,
                    "amount":12
                }
            ],
            "_act":true,
        },
        "event":{
            "mode":4,
            "info_mode":false,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_titleName":"",
            "_contantView":null,
            "_dataShowDiv":null,
            "_data":null, //4: {id: "4", leaguename: "Test"}
            "_viewClass":"active",
            "_chkClass":"",
            "_default":"ALL",
            // "_limitCount":5,
            "_searchOpen":true,
            "_searchItem":"eventsID",
            "_searchDiv":null,
            "_breakpoint":[],
            "_act":true,
        },
        "dates":{
            "mode":1,
            "info_mode":false,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_titleName":"",
            "_contantView":null,
            "_dataShowDiv":null,
            "_data":null, //4: {id: "4", leaguename: "Test"}
            "_viewClass":"active",
            "_chkClass":"",
            "_list":dateHash._list,
            "_listSub":dateHash._listSub,
            "_default":"TODAY",//
            // "_limitCount":5,
            "_searchOpen":true,
            "_searchItem":"datessID",
            "_searchDiv":null,
            "_breakpoint":[],
            "_act":true,
        }
    }
    var filterBigObj = null;
    var filterUse = new Object();


    _self.init=function(){
        //console.log(myDate.toLocaleDateString().replace(/\//g,'-'));
        for (var key in filterInitParam["dates"]["_list"]){ 
            var newLi = document.createElement("li");
            // 设置 <li> 元素的内容
            newLi.textContent = filterInitParam["dates"]["_listSub"][key];
            var id = "w_dates_" + filterInitParam["dates"]["_list"][key];
            newLi.setAttribute("id", id);
            dom.getElementById("dates_sel").appendChild(newLi);
        }
        _top.popWindow = new Object();
        getView = parentClass.getThis("getView");
        view_w = getView().viewportwidth;//螢幕畫面大小

        var remenberFilter = dom.getElementById("remenberFilter");
        var remenberFilterSmall = dom.getElementById("remenberFilter_small");

        util.addEvent(remenberFilter,"click",_self.remenberFilter,{"_dom":remenberFilter,"_otherID":"remenberFilter_small"});
        util.addEvent(remenberFilterSmall,"click",_self.remenberFilter,{"_dom":remenberFilterSmall,"_otherID":"remenberFilter"});



        util.setInfEvent(dom.getElementById("bet_burger_div"), { "_focus": dom.getElementById("bet_burger_sel"), "_setView": dom.getElementById("bet_burger_div"), "_viewClass": "active" });

        // _self.bigOrSmall();

        var storage_filter_bet =  storage.get(top.login_layer+"_"+top.user_id+"_filter_bet");
        var storage_remenberflg_bet=  storage.get(top.login_layer+"_"+top.user_id+"_remenberflg_bet");
        var filter_bet_Obj;
        var remenberflg_bet_Obj;
        // console.log(storage_filter_bet,storage_remenberflg_bet);
        if(storage_filter_bet!="null") filter_bet_Obj = JSON.parse(storage_filter_bet);
        if(storage_remenberflg_bet!="null" && typeof(storage_remenberflg_bet)!='undefined')  remenberflg_bet_Obj = JSON.parse(storage_remenberflg_bet);
        _self.initFilterParam(filter_bet_Obj,remenberflg_bet_Obj);
        _self.loadFilterData();
        _self.loadData();
        _self.createWmcTimer();
        _self.initScroll();
        util.addEvent(dom.getElementById("filter_submit"),"click",_self.reloadData);
        //bodyFrame.addEventListener("changeFilter",_self.changeFilter);
        bodyFrame.closeAccDetail = function () {
            _self.closeAccDetail11();
        }
        bodyFrame.closeAccEditDetail = function () {
            _self.closeAccEditDetail11();
        }
        parentClass.dispatchEvent("showLoading", {"showLoading":false});

    }

    _self.setParentclass = function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        Cookie = parentClass.getThis("cookie");
        config_set = parentClass.getThis("config_set");
        _top = parentClass.getThis("top");
        storage = parentClass.getThis("Storage");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash");
        bodyFrame = parentClass.getThis("bodyFrame");
    }


    _self.pauseEvent=function(mouseEvent, targetObj){
        var obj = new Object();
        obj.filename = "betPop";
        obj.title = "_blank";
        obj.toolbar = "no";
        obj.scrollbars = "no";
        obj.resizable = "no";
        obj.location = "no";
        obj.menubar = "no";
        obj.status = "no";
        obj.height = "720px";
        obj.width = "1024px";
        obj.dowrite = true;
        obj._body = _dom.getElementById("detail_data").innerHTML;
        _self.newOpenPageHandler(obj);
    }

    _self.bigOrSmall = function(){
        util.setInfEvent(dom.getElementById("burger_div"), { "_focus": dom.getElementById("burger_sel"), "_setView": dom.getElementById("burger_div"), "_viewClass": "active" });
    }

    _self.initFilterParam = function(top_filter,top_filterFlag){
        if(top_filterFlag)dom.getElementById("remenberFilter").click();
        if(top_filter && top_filterFlag){
            for(var key in top_filter){
                if(filterInitParam[key]){
                    filterInitParam[key]["_default"] = top_filter[key];

                    if(key=="gtype" || key=="result" || key =="dates"){

                        _set[key] = filterInitParam[key]["_default"];
                    }
                }
            }
        }
    }

    _self.openSmallFilter = function(e,_par){
        var _param = _par;
        _param.dataSet["rtype"] = _param["rtype"];

        if (getView().viewportwidth < 1024) {
            parentClass.dispatchEvent("showOverviewFilter", _param.dataSet);
        } else {
            // _self.hideBtn();
            // _self.showEditFilter();
        }
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



    _self.loadFilterData=function(){
        //_self.reloadFilterData();
    }

    _self.reloadFilterData=function(){
        var par = "";
        // var gtype ="ALL";
        par+=top.param;
        par+="&p=get_bet_SearchFilter_data";
        par+="&totalBets=bet";
        par+="&gtype="+_set["gtype"];
        par+="&result="+_set["result"];


        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadFilterFinish);
        getHttp.loadURL(top.url, "POST", par);
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
        par+="&p=get_bet_list";
        par+="&totalBets="+toppar["bet_showtype"];
        par+="&gtype="+_set["gtype"];
        par+="&result="+_set["result"];
        par+="&date="+_set["dates"];
        par+="&username="+toppar["username"];
        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadFinish);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.onError = function(){
        // console.log("[Error]");
        //dom.getElementById("err404").style.display = "";
    }

    _self.initMySet=function(){
        _stake = _mc["bets_search_setting"].JS.getStakeFilter();

        var param = _mc["bets_search_setting"].JS.getBetsSearchParam();
        param = param.substr(1,param.length);

        var paramAry = param.split("&");

        //console.log(paramAry);

        for(var i=0; i<paramAry.length; i++){
            var oneAry = paramAry[i].split("=");

            var k = oneAry[0];
            var v = oneAry[1];

            if(k=="symbol" || k=="gold" || k=="site" || v=="all"){
                _set[k] = v;
            }else{
                v = v.replace(/\'/g,"");
                v = v.split(",");
                _set[k] = v;
            }
        }
        //console.log(_set);
        if(_set["bettype"] != "all"){
            var bt = new Array();
            for(var i=0; i<_set["bettype"].length; i++){
                var k = _set["bettype"][i];
                var tmpGtype = _set["gtype"];
                var z = k;

                if(k.indexOf("_") != -1){
                    var tmp = k.split("_");
                    tmpGtype = tmp[0];
                    z = tmp[1];
                }

                if((tmpGtype=="ALL" && z=="P3") || tmpGtype=="ALL"){
                    for(var j=0; j<_gtypeAry.length; j++){
                        var tg = _gtypeAry[j];

                        if(_set["typeMap"][tg] != undefined){
                            if(_set["typeMap"][tg][z] != undefined)	bt = bt.concat(_set["typeMap"][tg][z]);
                        }
                    }
                }else{
                    if(_set["typeMap"][tmpGtype] != undefined){
                        if(_set["typeMap"][tmpGtype][z] != undefined)	bt = bt.concat(_set["typeMap"][tmpGtype][z]);
                        if(tmpGtype == "BM"){
                            if(_set["typeMap"]["TT"][z] != undefined)	bt = bt.concat(_set["typeMap"]["TT"][z]);
                        }
                    }
                }
            }

            bt = _self.my_unique(bt);
            _set["bettype"] = bt;
        }

        //console.log("bet =============");
        //console.log(_set["bettype"]);
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
            if (util.chkErrorMsg(hash, LS_code)) return;
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }
        data_filter = hash;
        _self.setSelectEvent();

        var outStr_big ="";
        var outStr_small ="";
        // if (view_w < 600) {
        //     ret = "xmp_360";
        // } else if (view_w >= 600 && view_w < 768) {
        //     ret = "xmp_360";
        // } else if (view_w >= 768 && view_w < 1024) {
        //     ret = "xmp_1024";
        // } else if (view_w >= 1024) {
        //     ret = "xmp_1024";
        // }

        var allwagers =  hash["wagers"];
        var row0 = new Array();
        var detail_head = dom.getElementById("detail_head").innerHTML;
        dom.getElementById("detail_head").innerHTML = detail_head.replace("*ADD_TD*", hash["header"]);
        /*var wagers_show_big = document.getElementById(ret_xmp_big+"_wager_show");
        var wagers_show_small = document.getElementById(ret_xmp_small+"_wager_show");

        var wagers_show_str_big = wagers_show_big.innerHTML;
        var wagers_show_str_small = wagers_show_small.innerHTML;*/
        for(var prop in allwagers){
            var gtype = allwagers[prop].GTYPE;
            var stake = allwagers[prop].GOLD;
            var market = allwagers[prop].MARKET;
            var league = allwagers[prop].LEAGUE;
            var dates = allwagers[prop].M_DATE;
            var _event = allwagers[prop]._EVENT;

            if(!_self.chkCanParse(gtype,stake,market,league,_event,dates))	continue;
            row0[prop] = allwagers[prop];
            for(var j=0;j<ret_xmp.length;j++){
                var tname = "";
                var chg_ret_xmp = ret_xmp[j];

                if(chg_ret_xmp == "764_up"){

                    if(allwagers[prop].SHOWTEXT_LEAGUE) tname +=  allwagers[prop].SHOWTEXT_LEAGUE;
                    if(allwagers[prop].SHOWTEXT_TEAM_NUM) tname +=  allwagers[prop].SHOWTEXT_TEAM_NUM;
                    if(allwagers[prop].SHOWTEXT_TEAM) tname +=  allwagers[prop].SHOWTEXT_TEAM;
                    if(allwagers[prop].SHOWTEXT_ORDER_TYPE_IORATIO) tname +=  allwagers[prop].SHOWTEXT_ORDER_TYPE_IORATIO;

                    // $retWagers_Single["SHOWTEXT_LEAGUE"]=$tnameHash["SHOWTEXT_LEAGUE"];
                    // $retWagers_Single["SHOWTEXT_TEAM_NUM"]=$tnameHash["SHOWTEXT_TEAM_NUM"];
                    // $retWagers_Single["SHOWTEXT_TEAM"]=$tnameHash["SHOWTEXT_TEAM"];
                    // $retWagers_Single["SHOWTEXT_ORDER_TYPE_IORATIO"]=$tnameHash["SHOWTEXT_ORDER_TYPE_IORATIO"];


                }else{
                    if(allwagers[prop].SHOWTEXT_ORDER_TYPE_IORATIO) tname +=  allwagers[prop].SHOWTEXT_ORDER_TYPE_IORATIO;
                    if(allwagers[prop].RPWAGERSTYPE !=""){
                        tname +=  allwagers[prop].RPWAGERSTYPE+"<br>"
                    }else{
                        if(allwagers[prop].WAGERSTYPE) tname +=  allwagers[prop].WAGERSTYPE+"<br>";
                    }
                    if(allwagers[prop].GT) tname +=  allwagers[prop].GT+"<br><br>";
                    if(allwagers[prop].SHOWTEXT_LEAGUE) tname +=  allwagers[prop].SHOWTEXT_LEAGUE;
                    if(allwagers[prop].SHOWTEXT_TEAM) tname +=  allwagers[prop].SHOWTEXT_TEAM;
                    if(allwagers[prop].SHOWTEXT_TEAM_NUM) tname +=  allwagers[prop].SHOWTEXT_TEAM_NUM;
                }

                if(tname=="") tname= allwagers[prop].TNAME;
                var xmp_tmp = document.getElementById("xmp_"+chg_ret_xmp+"_wagers_content").innerHTML;
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*DATE\\\*", "gi"), allwagers[prop].DATE);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*TIME\\\*", "gi"), allwagers[prop].TIME);

                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*NAME0\\\*", "gi"), allwagers[prop].NAME0);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*M_TYPE\\\*", "gi"), allwagers[prop].M_TYPE);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*IN_RADIO\\\*", "gi"), allwagers[prop].IN_RADIO);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*ODDF_TYPE\\\*", "gi"), allwagers[prop].ODDF_TYPE);

                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*TID\\\*", "gi"), allwagers[prop].TID);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*WAGERS_ID\\\*", "gi"), allwagers[prop].WAGERS_ID);

                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*GT\\\*", "gi"), allwagers[prop].GT);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*WAGERSTYPE\\\*", "gi"), allwagers[prop].WAGERSTYPE);
                // xmp_tmp = xmp_tmp.replace(new RegExp("\\\*SRV_IP\\\*", "gi"), allwagers[prop].SRV_IP);

                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*TNAME\\\*", "gi"), tname);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*BALL_ACT\\\*", "gi"), allwagers[prop].BALL_ACT);


                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*STAKE\\\*", "gi"), allwagers[prop].GOLD);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*WIN_GOLD\\\*", "gi"), allwagers[prop].WIN_GOLD);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*K_WIN_GOLD\\\*", "gi"), allwagers[prop].K_WIN_GOLD);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*WIN_GOLD_CLASS\\\*", "gi"), allwagers[prop].WIN_GOLD_CLASS);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*RESULT_WL\\\*", "gi"), allwagers[prop].RESULT_WL);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*RESULT_WL_CLASS\\\*", "gi"), allwagers[prop].RESULT_WL_CLASS);

                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*ADD_TD_CONTENT\\\*", "gi"), allwagers[prop].TD_CONTENT);
                var small_td_content = allwagers[prop].TD_CONTENT.replace(new RegExp(" \/ ", "gi"),"");
                small_td_content = small_td_content.replace(new RegExp("_"+allwagers[prop].ID, "gi"),"_small_"+allwagers[prop].ID);
                small_td_content = small_td_content.replace('<br>',"");
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*ADD_TD_SMALL_CONTENT\\\*", "gi"), small_td_content);
                /*xmp_tmp = xmp_tmp.replace(new RegExp("\\\*AG\\\*", "gi"), allwagers[prop].ARESULT);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*MA\\\*", "gi"), allwagers[prop].SRESULT);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*SMA\\\*", "gi"), allwagers[prop].CRESULT);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*D0\\\*", "gi"), allwagers[prop].D0RESULT);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*AD\\\*", "gi"), allwagers[prop].ADRESULT);*/

                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*SITE\\\*", "gi"), allwagers[prop].SITE);

                if(allwagers[prop].HIDDEN == 1){
                    xmp_tmp = xmp_tmp.replace(new RegExp("\\\*BGCOLOR\\\*", "gi"), 'style="background-color:#D5D5D6;"');

                }

                /*for(var i=0;i<levelClassAry.length;i++){
                    var classKey = levelClassAry[i];
                    xmp_tmp = xmp_tmp.replace(new RegExp("\\\*" + classKey + "\\\*", "gi"), levelWagerObj[classKey]);
                }*/

                if(chg_ret_xmp == "764_up"){
                    outStr_big +=xmp_tmp;
                }else{
                    outStr_small +=xmp_tmp;
                }

            }

            //_self.chk_music();

            _self.initScroll();
        }

//console.log(outStr_small);
        document.getElementById(ret_xmp_big+"_wager_show").innerHTML = outStr_big;
        document.getElementById(ret_xmp_small+"_wager_show").innerHTML = outStr_small;
        _self.setDetailClick(row0);
        return;
    }

    _self.setDetailClick = function (dataAry) {
        for(var i in dataAry){
            var _name = "tid_" + dataAry[i]["WAGERS_ID"];
            var _name_samll = "tid_small_" + dataAry[i]["WAGERS_ID"];
            util.addEvent(dom.getElementById(_name), "click", _self.viewDetail, dataAry[i]);
            util.addEvent(dom.getElementById(_name_samll), "click", _self.viewDetail, dataAry[i]);

            var _swap = "swap_"+dataAry[i]["ID"];
            var _swap_small = "swap_small_"+dataAry[i]["ID"];
            util.addEvent(dom.getElementById(_swap), "click", _self.viewSwap, dataAry[i]);
            util.addEvent(dom.getElementById(_swap_small), "click", _self.viewSwap, dataAry[i]);

            var _delete = "delete_"+dataAry[i]["ID"];
            var _delete_small = "delete_small_"+dataAry[i]["ID"];
            util.addEvent(dom.getElementById(_delete), "click", _self.viewDelete, dataAry[i]);
            util.addEvent(dom.getElementById(_delete_small), "click", _self.viewDelete, dataAry[i]);

            var _hidden = "hidden_"+dataAry[i]["ID"];
            var _hidden_small = "hidden_small_"+dataAry[i]["ID"];
            util.addEvent(dom.getElementById(_hidden), "click", _self.viewHidden, dataAry[i]);
            util.addEvent(dom.getElementById(_hidden_small), "click", _self.viewHidden, dataAry[i]);

            var _manage = "manage_"+dataAry[i]["ID"];
            var _manage_small = "manage_small_"+dataAry[i]["ID"];
            util.addEvent(dom.getElementById(_manage), "change", _self.viewManage, dataAry[i]);
            util.addEvent(dom.getElementById(_manage_small), "change", _self.viewManage, dataAry[i]);

            var _add = "add_"+dataAry[i]["ID"];
            var _add_small = "add_small_"+dataAry[i]["ID"];
            util.addEvent(dom.getElementById(_add), "click", _self.viewAdd, dataAry[i]);
            util.addEvent(dom.getElementById(_add_small), "click", _self.viewAdd, dataAry[i]);
			
            var _edit = "edit_"+dataAry[i]["ID"];
            var _edit_small = "edit_small_"+dataAry[i]["ID"];
            util.addEvent(dom.getElementById(_edit), "click", _self.viewEdit, dataAry[i]);
            util.addEvent(dom.getElementById(_edit_small), "click", _self.viewEdit, dataAry[i]);

            var _result = "result_"+dataAry[i]["ID"];
            var _result_small = "result_small_"+dataAry[i]["ID"];
            util.addEvent(dom.getElementById(_result), "click", _self.viewResult, dataAry[i]);
            util.addEvent(dom.getElementById(_result_small), "click", _self.viewResult, dataAry[i]);
        }
        /*console.log(dataAry.length);
        for (var i = 0; i < dataAry.length; i++) {

        }*/
    }



    _self.viewManage = function(e,param){
        var par = "";
        par+=top.param;
        par+="&p=get_bet_edit";
        par+="&action=manage";
        par+="&betid="+param["ID"];
        par+="&status="+e.target.value;
        _self.loadBetEdit(par);
    }

    _self.viewHidden = function(e,param){
        var par = "";
        par+=top.param;
        par+="&p=get_bet_edit";
        par+="&action=hidden";
        par+="&betid="+param["ID"];
        _self.loadBetEdit(par);
    }

    _self.viewDelete = function(e,param){
        var msg = "删除后不能恢复,现金玩家会退还额度,您确定要删除该注单吗？";
        if (confirm(msg)==true) {
            var par = "";
            par+=top.param;
            par+="&p=get_bet_edit";
            par+="&action=delete";
            par+="&betid="+param["ID"];
            _self.loadBetEdit(par);
        }
    }

    _self.viewSwap = function(e,param){
        var par = "";
        par+=top.param;
        par+="&p=get_bet_edit";
        par+="&action=swap";
        par+="&betid="+param["ID"];
        _self.loadBetEdit(par);

    }

    _self.loadBetEdit = function(par){
        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadBetEditFinish);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.loadBetEditFinish = function(json){
        var hash;
        try {
            hash = JSON.parse(json);
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }

        if(hash.status == "success"){
            parentClass.dispatchEvent("showFadeOutMesg", { "text": hash.msg ,"s":5 , "showCopy":"N","value":"" });
            _self.reloadData();
        }else{
            parentClass.showAlertMsg(hash);
        }
    }

    _self.viewResult = function(e,param){
        try {
            if (e.target.id.indexOf("anno") != -1) return;
            // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
            _self.closeAccDetail11();
            nowDetail = "tid_"+param["TID"];
            dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
        } catch (e) { }
        parentClass.dispatchEvent("showBetResult", {"row0": param });
    }
	
  _self.viewAdd = function(e,param){
        try {
            if (e.target.id.indexOf("anno") != -1) return;
            // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
            _self.closeAccDetail();
            nowDetail = "tid_"+param["TID"];
            dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
        } catch (e) { }
        parentClass.dispatchEvent("showBetAdd", {"row0": param });
    }
	
    _self.viewEdit = function(e,param){
        try {
            if (e.target.id.indexOf("anno") != -1) return;
            // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
            _self.closeAccDetail11();
            nowDetail = "tid_"+param["TID"];
            dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
        } catch (e) { }
        parentClass.dispatchEvent("showBetEdit", {"row0": param });
    }

    _self.closeBetEditSuccess = function(){
        _self.reloadData();
    }

    _self.viewDetail = function (e, param) {
        try {
            if (e.target.id.indexOf("anno") != -1) return;
            // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
            _self.closeAccDetail11();
            nowDetail = "tid_"+param["TID"];
            dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
        } catch (e) { }
        parentClass.dispatchEvent("showBetDetail", {"row0": param });
    }

    _self.closeAccDetail11 = function(){
        if(dom.getElementById(nowDetail)) dom.getElementById(nowDetail).classList.remove("tr_bgebf7ff");
    }

    _self.closeAccEditDetail11 = function(){
        _self.reloadData();
        if(dom.getElementById(nowDetail)) dom.getElementById(nowDetail).classList.remove("tr_bgebf7ff");
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
        var league = hash["league"];
        var team = hash["team"];
        var outStr="";
        data_filter = hash;
        _self.setSelectEvent();
    }

    _self.chkCanParse=function(gtype,stake,market,league,_event,dates){
        if(filterUse["gtype"] != "ALL"){
            if(filterUse["gtype"]!=gtype){
                return false;
            }
        }

        if(filterUse["market"]!="ALL"){
            if(filterUse["market"]!=market) {
                return false;
            }
        }

        if(filterUse["league"]!="ALL"){
            if(filterUse["league"]!=league && league*1 != 0){
                return false;
            }
        }

        if(filterUse["event"]!="ALL"){
            if(filterUse["event"]!=_event){
                return false;
            }
        }

        // if(filterUse["dates"]!="ALL"){
        //     if(filterUse["dates"]!=dates){
        //         return false;
        //     }
        // }

        if(filterUse["stake"]["mode"]=="ALL"){
            if(filterUse["stake"]["listGold"]["ALL"]*1 >= stake*1){
                return false;
            }
        }else{
            if(filterUse["stake"]["listGold"][gtype]*1 >= stake*1){
                return false;
            }
        }


        return true;
    }

    //---------------- timer ----------------
    _self.createWmcTimer=function(){
        _self.clearDangerTimer();
        timerHash["bet_mem"] = new Timer(config_set.get("BETLIST_RELOAD"));
        timerHash["bet_mem"].setParentclass(_self);
        timerHash["bet_mem"].dont_clear = false; //設定為不清除timer
        timerHash["bet_mem"].init();
        timerHash["bet_mem"].addEventListener("TimerEvent.TIMER", _self.betTimerRun);
        timerHash["bet_mem"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.betTimerFinish);
        timerHash["bet_mem"].startTimer();

    }


    _self.stopDangerTimer = function () {
        util.echo("bet stopTimer");
        timerHash["bet_mem"].stopTimer();
    }

    _self.clearDangerTimer=function(){
        util.echo("bet clearTimer");
        if(timerHash["bet_mem"]!=null){
            timerHash["bet_mem"].clearObj();
            timerHash["bet_mem"]=null;
        }
        return true;
    }

    _self.betTimerRun=function(count){
        if(testTimerTurn)_self.reloadData();
    }

    _self.betTimerFinish=function(){
        util.echo("timerComplete");
    }

    //---------------- timer ----------------

    _self.chk_music=function(){
        if(_set["musicflg"] == "on"){
            if(musicObj!=null){
                musicObj.play();
            }
        }
    }

    _self.my_unique=function(a){
        var a = a.concat();

        for(var i=0; i<a.length; ++i){
            for(var j=i+1; j<a.length; ++j){
                if(a[i] === a[j])	a.splice(j, 1);
            }
        }

        return a;
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



    _self.setSelectEvent=function(){
        // return;
        if(filterBigObj==null){
            for(var rtype in filterInitParam){

                var rDom = dom.getElementById(rtype + "_div");
                var rSel = dom.getElementById(rtype + "_sel");
                var rNow = dom.getElementById(rtype + "_now");
                var rSearch = dom.getElementById( rtype+"_search");
                var rShowDiv = dom.getElementById( rtype+"_show");
                filterInitParam[rtype]["_titleName"] = LS.get("btns_"+rtype);

                if(filterInitParam[rtype]["mode"]*1==4 || filterInitParam[rtype]["mode"]*1==3){
                    var tmpAry = [];
                    for(var i=0;i<filterInitParam[rtype]["_breakpoint"].length;i++){
                        var tmpObj = new Object();
                        var rpoint = dom.getElementById(rtype + "_point"+(i+1));
                        filterInitParam[rtype]["_breakpoint"][i].div = rpoint;
                    }
                }

                if(rtype=="gtype" || rtype=="market"){
                    var _list = filterInitParam[rtype]["_list"];
                    var status="";
                    if(rtype=="market") status ="market_";
                    for(var i=0;i<_list.length;i++){
                        var lll = status+_list[i];
                        if(lll == "market_ft"){
                            lll = "market_ft1";
                        }
                        filterInitParam[rtype]["_listSub"][i] = LS.get("str_wmc_"+lll);
                        //util.addEvent(dom.getElementById(rtype+"_"+type), "click", selectFun[rtype], {"rtype":rtype,"type":type});
                    }
                }

                if(rtype=="stake"){
                    if(filterInitParam["gtype"]["_default"]=="ALL"){
                        filterInitParam[rtype]["_default"]["listItem"] = "";
                    }else{
                        filterInitParam[rtype]["_default"]["listItem"] = filterInitParam["gtype"]["_default"];
                    }
                }

                if(rtype=="league"){
                    if(filterInitParam["gtype"]["_default"]=="ALL"){
                        filterInitParam[rtype]["_breakpoint"][1].amount = 120;
                    }else{
                        filterInitParam[rtype]["_breakpoint"][1].amount = 12;
                    }
                }


                filterInitParam[rtype]["_setDiv"] = rDom;
                filterInitParam[rtype]["_contantView"] = rSel;
                filterInitParam[rtype]["_titleView"] = rNow;
                if(rSearch) filterInitParam[rtype]["_searchDiv"] = rSearch;
                if(rShowDiv) filterInitParam[rtype]["_dataShowDiv"] = rShowDiv;
                if(data_filter[rtype]) filterInitParam[rtype]["_data"] = data_filter[rtype];


                util.addEvent(dom.getElementById("f_"+rtype+"_small"),"click",_self.openSmallFilter,
                    {
                        "dataSet":filterInitParam[rtype],
                        "rtype":rtype,
                    }

                );


            }


            filterBigObj = new util.filterBig(win,dom);
            filterBigObj.setParentclass(parentClass);
            filterBigObj.addEventListenEvent();
            filterBigObj.addEventListener("autoBackParam",_self.takeParam);
            filterBigObj.init(filterInitParam);
        }else{
            var tmpObj = new Object();
            var tmpAry = ["league","event"];//,"dates"
            for(var i=0;i<tmpAry.length;i++){
                var rtype = tmpAry[i];
                var tmp =  filterInitParam[rtype]["_breakpoint"];
                if(rtype == "league"){
                    if(filterInitParam["gtype"]["_default"]=="ALL"){
                        tmp[1].amount=120;
                    }else{
                        tmp[1].amount=12;
                    }

                }

                if(data_filter[rtype]){
                    filterInitParam[rtype]["_data"]=data_filter[rtype];
                    tmpObj[rtype] = {"_data":data_filter[rtype],"_default":filterInitParam[rtype]["_default"],"_breakpoint":tmp};

                }else{
                    filterInitParam[rtype]["_data"]={};
                    tmpObj[rtype] = {"_data":{},"_default":"ALL","_breakpoint":tmp};
                }


            }
            filterBigObj.reinit(tmpObj);


            if(filterInitParam["gtype"]["_default"]=="ALL"){
                filterInitParam["stake"]["_default"]["listItem"] = "";
            }else{
                filterInitParam["stake"]["_default"]["listItem"] = filterInitParam["gtype"]["_default"];
            }

            filterBigObj.reDefault("stake",filterInitParam["stake"]["_default"]);


        }

    }

    _self.takeParam = function(obj){
        //console.log("take===>",obj);
        for(var key in obj){
            if(obj[key]){
                filterUse[key] =obj[key];
                filterInitParam[key]["_default"]=obj[key];
                title = dom.getElementById("f_"+key+"_small").children[1];
                title.innerHTML = dom.getElementById(key+"_now").innerHTML;
            }
        }

        if(_set["gtype"] != filterUse["gtype"])
        {
            _set["gtype"] = filterUse["gtype"];
            _self.loadFilterData();
        }

        if(_set["result"] != filterUse["result"])
        {
            _set["result"] = filterUse["result"];
            _self.loadFilterData();
        }

        if(_set["dates"] != filterUse["dates"])
        {
            _set["dates"] = filterUse["dates"];
            _self.loadFilterData();
        }

        _top["remenberflg_bet"] = _set["remenberflg"];
        _self.backOpenerTop("remenberflg_bet");
        _self.backOpenerTop("filter_bet");


    }




    _self.newOpenPageHandler =  function(obj){
        _self.newOpenPageEvent(obj);
    }



    //new open page
    _self.newOpenPageEvent = function(obj){
        var dowrite = (obj.dowrite == undefined)?false:obj.dowrite;
        _self.newOpenPage(obj.filename, (obj.title)?obj.title:"",  _self.getNewOpenParam(obj), dowrite, obj._body);
    }

    _self.newOpenPageNoParEvent = function(obj){
        var dowrite = (obj.dowrite == undefined)?false:obj.dowrite;
        _self.newOpenPage(obj.filename, (obj.title)?obj.title:"", "" , dowrite, obj._body);
    }

    _self.getNewOpenParam = function(obj){

        var par = "config='";
        par+="location="+((obj.location!=null)?obj.location:"no");
        par+=",status="+((obj.status)?obj.status:"no");
        par+=",width="+((obj.width)?obj.width:"600px");
        par+=",height="+((obj.height)?obj.height:"600px");
        par+=",toolbar="+((obj.toolbar)?obj.toolbar:"no");
        par+=",top="+((obj.top)?obj.top:"0px");
        par+=",left="+((obj.left)?obj.left:"0px");
        par+=",scrollbars="+((obj.scrollbars)?obj.scrollbars:"no");
        par+=",resizable="+((obj.resizable)?obj.resizable:"yes");
        par+=",personalbar="+((obj.personalbar)?obj.personalbar:"yes");
        par+= "'";
        return par;

    }

    _self.newOpenPage = function(filename, _title, param, dowrite, _body){
        if(util.showTxt(filename)=="" && !dowrite) return;
        if(_title!="history"){
            if(_top.popWindow[filename] != null){
                _top.popWindow[filename].focus();
                if(!_top.popWindow[filename].closed)	return;
            }
        }

        _top.popWindow[filename] = window.open(filename, _title, param);
        _top.popWindow[filename].focus();

        if(dowrite){
            var headStr = "";
            // _top.popWindow[filename].document.write("<html><body></body></html>");

            for(var i=0; i < window.document.head.children.length; i++){
                var node = document.head.children[i];
                var tag = node.tagName;
                if(tag=="META" || tag=="LINK" || tag=="STYLE"){
                    headStr += node.outerHTML;
                }
            }

            var script =  document.createElement('script');
            script.src = '../../js/wmc/wmc_open_page.js';
            headStr += script.outerHTML;

            var script_util =  document.createElement('script');
            script_util.src = '../../js/lib/util.js';
            headStr += script_util.outerHTML;

            htmlStr = "<html><head>"+headStr+"</head><body onload='initO();'><div id='bet_other_page' class='ma_contentfull'>"+_body+"</div></body></html>";

            _top.popWindow[filename].document.write(htmlStr);
            _top.popWindow[filename].document.close();
        }

    }


    _self.backOpenerTop = function(name){
        var name = name;
        var storageParam = _top[name];
        if(name=="filter_bet"){
            if(_set["remenberflg"]!=true) storageParam = null;
        }
        var jsonStr = JSON.stringify(storageParam);
        storage.set(top.login_layer+"_"+top.user_id+"_"+name,jsonStr);
    }

    _self.changeFilter = function (param) {
        var title;
        var param_obj = param.param;
        var param_rtype = param.rtype;
        var param_name = param.name[param_rtype];
        // bet_burger_div
        title = dom.getElementById("f_"+param_rtype+"_small").children[1];
        if(param_rtype=="stake"){
            var mode = param_obj[param_rtype]["mode"];
            if(mode=="ALL") title.innerHTML =  param_obj[param_rtype]["mode"];
            else   title.innerHTML =  " "	;
        }else{
            title.innerHTML = param_name;
        }


        filterUse[param_rtype] =  param_obj[param_rtype];
        filterInitParam[param_rtype]["_default"] =  param_obj[param_rtype];

        var tmpObj = new Object();
        tmpObj[param_rtype] = new Object();
        tmpObj[param_rtype]["_default"]= param_obj[param_rtype];
        filterBigObj.reDefault(param_rtype,param_obj[param_rtype]);
        _self.takeParam(param_obj);
        _self.reloadData();
    }


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
