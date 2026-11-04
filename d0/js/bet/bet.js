function bet(_win, _dom, param){
	var _self=this;
	var _top=null;
    var win = _win;
    var dom = _dom;
	var classname = "bet.js";
	var tmpScreen;
	var paramObj;
	var parentClass;
    var util;
    var LS;
	var _myTop;
	var _mc = new Object();
	var _gtypeAry = new Array();
	var _totalCnt = 100;
	var config_set;

	var par = new Object();
	var _stake = new Object();
	var timerObj = new Object();
	var musicObj = null;

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
	_set["sel_maxid"] = "0";
	_set["gold"] = "";//stake
	_set["down_id"] = "";
	_set["market"] = "";
	_set["league_id"] = "";
	_set["event"] = "";
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



	var filterInitParam = new Object();
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
			"_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"],
			"_listSub":["ALL","","Basketball / American Football","Tennis","Volleyball","Badminton","Table Tennis","Baseball","Snooker","Other Sports"],
			"mode":1,
			"_chkClass":"",
			"_default":"ALL",
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
			"_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"],
			"_default":{
				"mode":"ALL",
				"listGold":{
					"ALL":0,
					"FT":0,
					"BK":0,
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
		"downline":{
			"mode":3,
			"info_mode":false,
			"title_mode":true,
			"_setDiv":null,
			"_titleView":null,
			"_titleName":"",
			"_contantView":null,
			"_type":null,
			"_data":null, //1002: {id: "1002", alias: "stanNew", username: "stanNew"}
			"_viewClass":"active",
			"_chkClass":"",
			"_default":"1002",
			"_limitCount":5,
			"_limitCountAlertMsg":"",
			"_searchOpen":true,
			"_searchItem":"downlineID",
			"_searchDiv":null,
			"_dataShowDiv":null,
			"_breakpoint":[
				{
					"div":null,
					"amount":0
				}
			],
			"_chkBtnMode":false,
			"_chkBtnDiv":
			{
				"SAVE":
				{
					"div":null,
					"disappear":true,
				},
				"CLEAR":
				{
					"div":null,
					"disappear":true,
				}

			},
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
		}
	}
	var filterBigObj = null;
	var filterUse = new Object();


	_self.init=function(){

		_top.popWindow = new Object();
		getView = parentClass.getThis("getView");
		view_w = getView().viewportwidth;//螢幕畫面大小
		// if(view_w>=764)ret_xmp="764_up";
		// else ret_xmp="764_down";

		// console.log("[bet] Load Complete!!!");

		var pauseBtn = dom.getElementById(ret_xmp_big+"_pause_btn");
		var clearBtn = dom.getElementById(ret_xmp_big+"_clear_btn");

		var pauseBtn_small = dom.getElementById(ret_xmp_small+"_pause_btn");
		var clearBtn_small = dom.getElementById(ret_xmp_small+"_clear_btn");

		var musicBtn = dom.getElementById("music_btn");
		var musicBox = dom.getElementById("musicBox");
		var remenberFilter = dom.getElementById("remenberFilter");
		var remenberFilterSmall = dom.getElementById("remenberFilter_small");


		util.addEvent(pauseBtn,"click",_self.pauseEvent,{});
		util.addEvent(clearBtn,"click",_self.clearEvent,{});
		util.addEvent(pauseBtn_small,"click",_self.pauseEvent,{});
		util.addEvent(clearBtn_small,"click",_self.clearEvent,{});

		util.addEvent(musicBtn,"click",_self.musicEvent,{});
		util.addEvent(remenberFilter,"click",_self.remenberFilter,{"_dom":remenberFilter,"_otherID":"remenberFilter_small"});
		util.addEvent(remenberFilterSmall,"click",_self.remenberFilter,{"_dom":remenberFilterSmall,"_otherID":"remenberFilter"});


		// musicBtn.click();
        // var obj_ids = ",musicBox,music_btn,pause_btn,clear_btn,";
		// obj_ids += "gtype_div,gtype_now,gtype_sel,";
		// obj_ids += "stake_div,";
		// obj_ids += "tdnoneCO,tdnoneSMA,tdnoneMA,";
		// _mc = util.getObjAry(dom, obj_ids);

		// // 暫停 / 清除 / 提醒 按鈕事件
		// _self.addEventListener("MouseEvent.CLICK", _self.clearEvent, _mc["clear_btn"]);
		// _self.addEventListener("MouseEvent.CLICK", _self.pauseEvent, _mc["pause_btn"]);
		// _self.addEventListener("MouseEvent.CLICK", _self.musicEvent, _mc["music_btn"]);

		levelClassAry = ["AGCLASS","MACLASS","SMACLASS","D0CLASS","ADCLASS"];
		levelNum = 0;
		levelWagerObj = new Object();
		switch(top.login_layer){
			case "ads":
			case "ad":
				levelNum=5;
				break;
			case "d0":
				levelNum=4;
				break;
			case "co":
				levelNum=3;
				break;
			case "su":
				levelNum=1;
				break;
			case "ag":
				levelNum=0;
				break;
		}

		for(var i=0;i<levelClassAry.length;i++){
			var levelDom = dom.getElementById(levelClassAry[i]);
			if(i>levelNum){
				util.classFunc(levelDom, "hide_item");
				levelWagerObj[levelClassAry[i]] = "hide_item";
			}
			else{
				util.classFunc(levelDom, "hide_item","remove");
				levelWagerObj[levelClassAry[i]] = "";
			}
		}

		// 提醒按鈕元件
		if(!util.isIE()){
			musicBox.innerHTML = "<audio id=\"obj_music\" name=\"obj_music\" hidden=\"true\" src=\"/TPBTLOW.WAV\"></audio>";
		}else{
			musicBox.innerHTML = "<embed id='obj_music' name='obj_music' hidden='true' src='/TPBTLOW.WAV'></embed>";
		}

		musicObj = util.getObj(musicBox, "obj_music");
		musicObj.onerror=function(){
			musicObj.load();
			musicObj.play();
		}

		musicObj.load();
		// musicObj.play();

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

		clearBtn.click();
		clearBtn_small.click();


		// // 各層級登入顯示欄位不同
		// if(top.login_layer == "su"){
		// 	_set["tdnoneCO"] = "tdNone";
		// 	_set["tdnoneSMA"] = "tdNone";
		// 	_set["width_sty"] = "bet_betDetail32";
		// 	var tdnoneCO_sty = util.getObjectClass(_mc["tdnoneCO"]);
		// 	var tdnoneSMA_sty = util.getObjectClass(_mc["tdnoneSMA"]);
		// 	util.setObjectClass(_mc["tdnoneCO"], tdnoneCO_sty+" "+_set["tdnoneCO"]);
		// 	util.setObjectClass(_mc["tdnoneSMA"], tdnoneSMA_sty+" "+_set["tdnoneSMA"]);
		// }else if(top.login_layer == "ag"){
		// 	_set["tdnoneCO"] = "tdNone";
		// 	_set["tdnoneSMA"] = "tdNone";
		// 	_set["tdnoneMA"] = "tdNone";
		// 	_set["width_sty"] = "bet_betDetail42";
		// 	var tdnoneCO_sty = util.getObjectClass(_mc["tdnoneCO"]);
		// 	var tdnoneSMA_sty = util.getObjectClass(_mc["tdnoneSMA"]);
		// 	var tdnoneMA_sty = util.getObjectClass(_mc["tdnoneMA"]);
		// 	util.setObjectClass(_mc["tdnoneCO"], tdnoneCO_sty+" "+_set["tdnoneCO"]);
		// 	util.setObjectClass(_mc["tdnoneSMA"], tdnoneSMA_sty+" "+_set["tdnoneSMA"]);
		// 	util.setObjectClass(_mc["tdnoneMA"], tdnoneMA_sty+" "+_set["tdnoneMA"]);

		// }


		// // 初始化模組
		// if(_mc["div_content"]!=null) util.setObjectClass(_mc["div_content"], _set["width_sty"]);
		// _mc["init_divShow"] = _mc["div_show"].innerHTML;





		// if(paramObj.sel_name != undefined) _mc["now_sel"].innerHTML = paramObj.sel_name;
		// if(paramObj.gtype != undefined)	_set["gtype"] = paramObj.gtype;
		// if(paramObj.sel_maxid != undefined)	_set["sel_maxid"] = paramObj.sel_maxid;
		// for(var i=0; i<_gtypeAry.length; i++){
		// 	util.setObjectClass(_mc[_gtypeAry[i]+"_sel"], "");
		// 	_self.addEventListener("MouseEvent.CLICK", _self.changeSelect, _mc[_gtypeAry[i]+"_sel"]);
		// 	_self.addEventListener("MouseEvent.MOUSE_OVER", _self.moveOver, _mc[_gtypeAry[i]+"_sel"]);
		// 	_self.addEventListener("MouseEvent.MOUSE_OUT", _self.moveOut, _mc[_gtypeAry[i]+"_sel"]);
		// }
		// _self.addEventListener("MouseEvent.MOUSE_OVER", _self.chgGtype, _mc["gtype_sel"]);
		// _self.addEventListener("MouseEvent.MOUSE_OUT", _self.chgGtype, _mc["gtype_sel"]);
		// util.setObjectClass(_mc[_set["gtype"]+"_sel"], "On");
		// _mc["bets_search_setting"].JS.setParentclass(_self);
		// _mc["bets_search_setting"].JS.setParamObj(paramObj);

		// var obj = new Object();
		// obj.gtype = _set["gtype"];
		// _mc["bets_search_setting"].JS.setParam(obj);

		// _self.addEventListener("loadDataEventHandler", _self.loadData);

		// _self.initSearchFilterData();

    }

    _self.setParentclass = function(_parentclass){
		parentClass = _parentclass;
		util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
		Cookie = parentClass.getThis("cookie");
		config_set = parentClass.getThis("config_set");
		_top = parentClass.getThis("top");
		storage = parentClass.getThis("storage");
    }

	_self.clearEvent=function(mouseEvent, targetObj){
		var wagers_show_big = document.getElementById(ret_xmp_big+"_wager_show");
		var wagers_show_small = document.getElementById(ret_xmp_small+"_wager_show");
		wagers_show_big.innerHTML="";
		wagers_show_small.innerHTML="";
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

	_self.musicEvent=function(mouseEvent){
		_set["musicflg"] = (_set["musicflg"] == "on")?"off":"on";
		musicObj.load();
		// musicObj.play();
	}

	_self.bigOrSmall = function(){
		util.setInfEvent(dom.getElementById("burger_div"), { "_focus": dom.getElementById("burger_sel"), "_setView": dom.getElementById("burger_div"), "_viewClass": "active" });
	}

	_self.initFilterParam = function(top_filter,top_filterFlag){
		if(top_filterFlag)dom.getElementById("remenberFilter").click();
		if(top_filter && top_filterFlag){
			for(var key in top_filter){
				filterInitParam[key]["_default"] = top_filter[key];

				if(key=="gtype"){

					_set[key] = filterInitParam[key]["_default"];
				}
			}
		}
	}

	_self.openSmallFilter = function(e,_par){
		var _param = _par;

		_param.dataSet["rtype"] = _param["rtype"];

		if (getView().viewportwidth < 1024) {
            parentClass.dispatchEvent("showFilter", _param.dataSet);
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
		_self.reloadFilterData();
	}

	_self.reloadFilterData=function(){
		var par = "";
		// var gtype ="ALL";
        par+=top.param;
		par+="&p=get_SearchFilter_data";
		par+="&totalBets=bet";
		par+="&gtype="+_set["gtype"];


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
		par+="&p=get_bet_list_bet";
		par+="&totalBets=bet";
		par+="&gtype=ALL";
		par+= "&sel_maxid="+_set["sel_maxid"];



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
		// console.log(hash);
		if (hash["maxid"] <= _set["sel_maxid"]) return ;

		_set["sel_maxid"] = hash["maxid"];
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
		var wagers_show_big = document.getElementById(ret_xmp_big+"_wager_show");
		var wagers_show_small = document.getElementById(ret_xmp_small+"_wager_show");

		var wagers_show_str_big = wagers_show_big.innerHTML;
		var wagers_show_str_small = wagers_show_small.innerHTML;
		for(var prop in allwagers){
			var gtype = allwagers[prop].GTYPE;
			var stake = allwagers[prop].GOLD;
			var downline = allwagers[prop].DOWNLINE;
			var market = allwagers[prop].MARKET;
			var league = allwagers[prop].LEAGUE;
			var _event = allwagers[prop]._EVENT;


			if(!_self.chkCanParse(gtype,stake,downline,market,league,_event))	continue;

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

				xmp_tmp = xmp_tmp.replace(new RegExp("\\\*GT\\\*", "gi"), allwagers[prop].GT);
				xmp_tmp = xmp_tmp.replace(new RegExp("\\\*WAGERSTYPE\\\*", "gi"), allwagers[prop].WAGERSTYPE);
				// xmp_tmp = xmp_tmp.replace(new RegExp("\\\*SRV_IP\\\*", "gi"), allwagers[prop].SRV_IP);

				xmp_tmp = xmp_tmp.replace(new RegExp("\\\*TNAME\\\*", "gi"), tname);
				xmp_tmp = xmp_tmp.replace(new RegExp("\\\*BALL_ACT\\\*", "gi"), allwagers[prop].BALL_ACT);


				xmp_tmp = xmp_tmp.replace(new RegExp("\\\*STAKE\\\*", "gi"), allwagers[prop].GOLD);
				xmp_tmp = xmp_tmp.replace(new RegExp("\\\*AG\\\*", "gi"), allwagers[prop].ARESULT);
				xmp_tmp = xmp_tmp.replace(new RegExp("\\\*MA\\\*", "gi"), allwagers[prop].SRESULT);
				xmp_tmp = xmp_tmp.replace(new RegExp("\\\*SMA\\\*", "gi"), allwagers[prop].CRESULT);
				xmp_tmp = xmp_tmp.replace(new RegExp("\\\*D0\\\*", "gi"), allwagers[prop].D0RESULT);

				xmp_tmp = xmp_tmp.replace(new RegExp("\\\*SITE\\\*", "gi"), allwagers[prop].SITE);

				for(var i=0;i<levelClassAry.length;i++){
					var classKey = levelClassAry[i];
					xmp_tmp = xmp_tmp.replace(new RegExp("\\\*" + classKey + "\\\*", "gi"), levelWagerObj[classKey]);
				}

				if(chg_ret_xmp == "764_up"){
					outStr_big +=xmp_tmp;
				}else{
					outStr_small +=xmp_tmp;
				}

			}

			_self.chk_music();
			_self.initScroll();
		}

		wagers_show_big.innerHTML = outStr_big+wagers_show_str_big;
		wagers_show_small.innerHTML = outStr_small+wagers_show_str_small;
		return;
		var xmlObj = new Object();

		try{
				xmlnode = new _mc["XmlNode"].JS_Obj(xml.getElementsByTagName("serverresponse"));
		}catch(e){
				return;
		}
		xmlnodeRoot = xml.getElementsByTagName("serverresponse")[0];

		var _status = util.showTxt(xmlnode.getNodeVal(xmlnode.Node(xmlnodeRoot,"status")));
		if(_status == "error"){
			var code = util.showTxt(xmlnode.getNodeVal(xmlnode.Node(xmlnodeRoot,"code")));
			if(!util.checkErrorCode(code, _top))	return;
		}

		xmlObj["maxid"] = xmlnode.Node(xmlnodeRoot,"maxid");
		var maxid = util.showTxt(xmlnode.getNodeVal(xmlObj["maxid"]));

		_set["sel_maxid"] = maxid;

		xmlObj["wagers"] = xmlnode.Node(xmlnodeRoot,"wagers",false);

		if(xmlObj["wagers"].length > 0){
			var tpl = _mc["fastTemplate_ag"].JS;
			tpl.init(_mc["div_model"].cloneNode(true));

			var show_count = 0;

			for(var i=0; i<xmlObj["wagers"].length; i++){
				xmlObj["gtype"] = xmlnode.Node(xmlObj["wagers"][i],"gtype");
				var gtype = util.showTxt(xmlnode.getNodeVal(xmlObj["gtype"]));

				xmlObj["date"] = xmlnode.Node(xmlObj["wagers"][i],"date");
				var date = util.showTxt(xmlnode.getNodeVal(xmlObj["date"]));

				xmlObj["MC"] = xmlnode.Node(xmlObj["wagers"][i],"MC");
				var MC = util.showTxt(xmlnode.getNodeVal(xmlObj["MC"]));

				xmlObj["bettypes"] = xmlnode.Node(xmlObj["wagers"][i],"bettypes");
				var bettypes = util.showTxt(xmlnode.getNodeVal(xmlObj["bettypes"]));

				xmlObj["detail"] = xmlnode.Node(xmlObj["wagers"][i],"detail");
				var detail = util.showTxt(xmlnode.getNodeVal(xmlObj["detail"]));

				xmlObj["stake"] = xmlnode.Node(xmlObj["wagers"][i],"stake");
				var stake = util.showTxt(xmlnode.getNodeVal(xmlObj["stake"]));

				xmlObj["ag"] = xmlnode.Node(xmlObj["wagers"][i],"ag");
				var ag = util.showTxt(xmlnode.getNodeVal(xmlObj["ag"]));

				xmlObj["su"] = xmlnode.Node(xmlObj["wagers"][i],"su");
				var su = util.showTxt(xmlnode.getNodeVal(xmlObj["su"]));

				xmlObj["co"] = xmlnode.Node(xmlObj["wagers"][i],"co");
				var co = util.showTxt(xmlnode.getNodeVal(xmlObj["co"]));

				xmlObj["d0"] = xmlnode.Node(xmlObj["wagers"][i],"d0");
				var d0 = util.showTxt(xmlnode.getNodeVal(xmlObj["d0"]));


				xmlObj["downline"] = xmlnode.Node(xmlObj["wagers"][i],"downline");
				var downline = util.showTxt(xmlnode.getNodeVal(xmlObj["downline"]));

				xmlObj["market"] = xmlnode.Node(xmlObj["wagers"][i],"market");
				var market = util.showTxt(xmlnode.getNodeVal(xmlObj["market"]));

				xmlObj["league"] = xmlnode.Node(xmlObj["wagers"][i],"league");
				var league = util.showTxt(xmlnode.getNodeVal(xmlObj["league"]));

				xmlObj["event"] = xmlnode.Node(xmlObj["wagers"][i],"event");
				var _event = util.showTxt(xmlnode.getNodeVal(xmlObj["event"]));

				xmlObj["bettype"] = xmlnode.Node(xmlObj["wagers"][i],"bettype");
				var bettype = util.showTxt(xmlnode.getNodeVal(xmlObj["bettype"]));

				xmlObj["site"] = xmlnode.Node(xmlObj["wagers"][i],"site");
				var site = util.showTxt(xmlnode.getNodeVal(xmlObj["site"]));

				if(!_self.chkCanParse(gtype,stake,downline,market,league,_event,bettype,site))	continue;

				show_count++;

				tpl.addBlock("GAME");
				tpl.replace(/\*DATETIME\*/g,date);
				tpl.replace(/\*MEM_COM\*/g,MC);
				tpl.replace(/\*BETDATA\*/g,bettypes);
				tpl.replace(/\*DETAILS\*/g,detail);
				tpl.replace(/\*STAKE\*/g,util.mprintf(stake*1,0,2,false,true));
				tpl.replace(/\*AGENT\*/g,ag);
				tpl.replace(/\*MA\*/g,su);
				tpl.replace(/\*CO\*/g,co);
				tpl.replace(/\*D0\*/g,d0);
				tpl.replace(/\*TDNONE2\*/g,_set["tdnoneSMA"]);
				tpl.replace(/\*TDNONE3\*/g,_set["tdnoneMA"]);


			}

			_self.debugPrint("show_count====>"+show_count);

			if(show_count > 0){
				var divObj = document.createElement("div");
				divObj.innerHTML = tpl.fastPrint();

				var tab_show = _mc["div_show"].children[0];
				var tab_acc = divObj.children[0];
				var tmp_tab_show = (tab_show.children[0].tagName.toUpperCase()=="TBODY")?tab_show.children[0]:tab_show;
				var tmp_tab = (tab_acc.children[0].tagName.toUpperCase()=="TBODY")?tab_acc.children[0]:tab_acc;

				for(var i=0; i<tmp_tab.children.length; i++){
					var trObj = tmp_tab.children[i].cloneNode(true);

					if(tmp_tab_show.children.length == 1){
						var oClassName = util.getObjectClass(trObj);
						util.setObjectClass(trObj,oClassName+" bottom_line");
						tmp_tab_show.appendChild(trObj);
					}else{
						tmp_tab_show.insertBefore(trObj, tmp_tab_show.children[1]);
					}
				}

				var _totalCnt_tmp = (tab_show.children[0].tagName.toUpperCase()=="TBODY")?_totalCnt+1:_totalCnt;

				if(tmp_tab_show.children.length > _totalCnt_tmp ){
					tmp_tab_show.removeChild(tmp_tab_show.children[tmp_tab_show.children.length-1]);
				}

				_self.chk_music();
			}
		}

		_self.loadingFun(false);
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
		// console.log(hash);
		var downline = hash["downline"];
		var league = hash["league"];
		var team = hash["team"];
		var outStr="";

		// var downline_show = document.getElementById("downline_show");
		// var downline_header = document.getElementById("xmp_downline_header").innerHTML;
		// var league_show = document.getElementById("league_show");
		// var league_header = document.getElementById("xmp_league_header").innerHTML;
		// var league_part = document.getElementById("xmp_league_contant_part").innerHTML;




		// var events_show = document.getElementById("events_show");
		// var events_header = document.getElementById("xmp_events_header").innerHTML;

		// var xmp_tmp="";

		// outStr += downline_header;
		// for(var prop in downline ){
		// 	xmp_tmp = document.getElementById("xmp_downline_contant").innerHTML;
		// 	xmp_tmp = xmp_tmp.replace(new RegExp("\\\*USERID\\\*", "gi"), downline[prop].id);
		// 	xmp_tmp = xmp_tmp.replace(new RegExp("\\\*USERNAME\\\*", "gi"), downline[prop].username);
		// 	xmp_tmp = xmp_tmp.replace(new RegExp("\\\*NAME\\\*", "gi"), downline[prop].alias);
		// 	outStr+=xmp_tmp;
		// }
		// downline_show.innerHTML = outStr;

		// outStr = league_header;

		// for(var prop in league){
		// 	xmp_tmp = document.getElementById("xmp_league_contant_popular").innerHTML;
		// 	xmp_tmp = xmp_tmp.replace(new RegExp("\\\*LID\\\*", "gi"), league[prop].id);
		// 	xmp_tmp = xmp_tmp.replace(new RegExp("\\\*LEAGUENAME\\\*", "gi"), league[prop].leaguename);
		// 	outStr+=xmp_tmp;
		// }
		// outStr += league_part;
		// for(var prop in league){
		// 	xmp_tmp = document.getElementById("xmp_league_contant_az").innerHTML;
		// 	xmp_tmp = xmp_tmp.replace(new RegExp("\\\*LID\\\*", "gi"), league[prop].id);
		// 	xmp_tmp = xmp_tmp.replace(new RegExp("\\\*LEAGUENAME\\\*", "gi"), league[prop].leaguename);
		// 	outStr+=xmp_tmp;
		// }
		// league_show.innerHTML = outStr;

		// outStr = events_header;
		// for(var prop in team){
		// 	xmp_tmp = document.getElementById("xmp_events_contant").innerHTML;
		// 	xmp_tmp = xmp_tmp.replace(new RegExp("\\\*EID\\\*", "gi"), team[prop].id);
		// 	xmp_tmp = xmp_tmp.replace(new RegExp("\\\*EVENTNAME\\\*", "gi"), team[prop].teams);
		// 	outStr+=xmp_tmp;
		// }
		// events_show.innerHTML = outStr;
		data_filter = hash;
		_self.setSelectEvent();
	}

	_self.chkCanParse=function(gtype,stake,downline,market,league,_event){
		// var symbol = _stake[gtype+"_symbol"];
		// var gold = _stake[gtype+"_gold"]*1;

		// if(_stake["radio"]){
		// 	symbol = _set["symbol"];
		// 	gold = _set["gold"]*1
		// }

		// if(symbol == "more"){
		// 	if(stake*1 <= gold)	return false;
		// }else if(symbol == "less"){
		// 	if(stake*1 >= gold)	return false;
		// }else if(symbol == "same"){
		// 	if(stake*1 != gold)	return false;
		// }

		// console.log(filterUse);
		if(filterUse["gtype"] != "ALL"){
			if(filterUse["gtype"]!=gtype){
				return false;
			}
		}

		if(filterUse["downline"] != "ALL"){
			var checkAry = filterUse["downline"].toString().split(",");
			if(checkAry.indexOf(downline)*1 == -1){
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

		timerObj["bet"] = new Timer(config_set.get("WMC_RELOAD"));
        timerObj["bet"].setParentclass(_self);
        timerObj["bet"].dont_clear = true; //設定為不清除timer
		timerObj["bet"].init();
		timerObj["bet"].addEventListener("TimerEvent.TIMER", _self.betTimerRun);
		timerObj["bet"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.betTimerFinish);
		timerObj["bet"].startTimer();

	}


    _self.stopDangerTimer = function () {
        util.echo("bet stopTimer");
        timerObj["bet"].stopTimer();
    }

	_self.clearDangerTimer=function(){
        util.echo("bet clearTimer");
		if(timerObj["bet"]!=null){
				timerObj["bet"].clearObj();
				timerObj["bet"]=null;
		}
		return true;
	}

	_self.betTimerRun=function(count){
		if(testTimerTurn)_self.reloadData();
	}

	_self.betTimerFinish=function(){
		util.echo("timerComplete");
	}

/*	舊管理端使用的
	_self.createTimer=function(){
		console.log("createTimer");
		_self.debugPrint("createTimer===>");

		// var sec = _top["ConfigSet"].getConfig("WMC_RELOAD");
		var sec = config_set.get("WMC_RELOAD")
		console.log("SCR===>"+sec);
		_myTop["timerObj"]["bet"+_set["gtype"]] = new _mc["Timer"].JS_Obj(sec);
		_myTop["timerObj"]["bet"+_set["gtype"]].setParentclass(_self);
		_myTop["timerObj"]["bet"+_set["gtype"]].addEventListener("TimerEvent.TIMER", _self.timerRun);
		_myTop["timerObj"]["bet"+_set["gtype"]].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerFinish);
		_myTop["timerObj"]["bet"+_set["gtype"]].start();

		_self.debugPrint("createTimer===>"+_myTop["timerObj"]["bet"+_set["gtype"]].isClear);
	}

	//clear timer
	_self.clearTimer=function(){
		_self.debugPrint("clearTimer===>");

		if(_myTop["timerObj"]["bet"+_set["gtype"]] != null){
			_myTop["timerObj"]["bet"+_set["gtype"]].clearObj();
		}
	}

	_self.timerRun=function(count){
		_self.debugPrint("run===>");
		_self.reloadData();
	}

	_self.timerFinish=function(count){
		_self.debugPrint("finish===>");
	}
*/
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
						filterInitParam[rtype]["_listSub"][i] = LS.get("str_bet_"+status+_list[i]);

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

				if(rtype=="downline"){
					filterInitParam[rtype]["_limitCountAlertMsg"] = LS.get("filter_err_downline_max");
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
			var tmpAry = ["league","event","downline"];
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
					if(rtype == "downline"){
						tmpObj[rtype] = {"_data":data_filter[rtype],"_default":filterInitParam["downline"]["_default"],"_breakpoint":tmp};
					}else{
						tmpObj[rtype] = {"_data":data_filter[rtype],"_default":"ALL","_breakpoint":tmp};
					}
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
		// console.log("take===>",obj);
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
				script.src = '../../js/bet/bet_open_page.js';
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
