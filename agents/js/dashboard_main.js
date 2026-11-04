function dashboard_main(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "dashboard_main";
    var util;
    var LS;
    var config_set;
	  var AD = new win.AD(win,dom);
    var Timer;
    var timerHash;
    var hr = null;
    var eventHandler = new Object;
    var LS_code;
    var retrieve_banner_btn;
    var report_btn;
    var acc_btn;
    var bet_btn;
    var credits;
    var balance;
    var balance_show;
    var this_period_performance;
    var this_period;
    var remaining_days;
    var completed_days;
    var logindate;
    var amount_mem;
    var lastdate;
    var dashboard_search;
    var now_dsearch_type = "";
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
    var dashboard_chart;
    var nowOverView = "yes";
    var originalOverView = "yes";
    var nowTurnOver = "tp";
    var nowWinLoss = "tp";
    var nowPossess = "tp";
    var nowMembers = "tp";
    var nowMem = "tp";
    var showWinLoss_mode = "mem";
    var WL_mode_arr = ["mem", "ag"];
    var date_s = "";
    var date_e = "";
    var dashHash = new Object;
    var now_dash_type = "";
    var pri_type = top.pri_type;
    var cookie;
    var Storage;
    var use_Storage_code = ",possess,members,turnover,winloss,";
    var storage_uid = top.uid;
    var search_last = "N";
    var _mc = new Object;
    var list = new Object;
    var OverView_arr = ["profit", "result", "stock"];
    var downlineSummary = new Object;
    var downline_summary_options = {
        tooltip: {
            show: false,
            trigger: "item"
        },
        legend: {
            show: true,
            right: "20%",
            align: "left",
            y: "center",
            itemGap: 20,
            itemWidth: 20,
            itemHeight: 20,
            textStyle: {
                fontFamily: "Arial",
                fontSize: 14,
                color: "rgba(0, 0, 0, 0.56)"
            },
            orient: "vertical",
            formatter: function(name) {
                var value;
                list.forEach(item => {
                    if (item.name == name)
                        value = item.value
                });
                return name + "  " + value
            }
        },
        series: [{
            type: "pie",
            center: ["30%", "50%"],
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 5,
                borderColor: "#fff",
                borderWidth: 2
            },
            label: {
                show: false,
                formatter: "{b}\n{c}",
                position: "center",
                lineHeight: 30,
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: "20"
                    }
                }
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: "30",
                    fontWeight: "bold"
                }
            },
            labelLine: {
                show: false
            },
            animation: "auto",
            animationDuration: 1E3,
            animationDelay: 600,
            data: [{
                value: 0,
                name: "Y",
                this_enable: "Y",
                this_user_type: "ma",
                itemStyle: {
                    normal: {
                        color: "#29C2CC"
                    },
                    emphasis: {
                        color: "#22A2AA"
                    }
                }
            }, {
                value: 0,
                name: "N",
                this_enable: "N",
                this_user_type: "ma",
                itemStyle: {
                    normal: {
                        color: "#FF4E65"
                    },
                    emphasis: {
                        color: "#FF1A37"
                    }
                }
            }, {
                value: 0,
                name: "S",
                this_enable: "S",
                this_user_type: "ma",
                itemStyle: {
                    normal: {
                        color: "#F3B932"
                    },
                    emphasis: {
                        color: "#ECA90E"
                    }
                }
            }, {
                value: 0,
                name: "F",
                this_enable: "F",
                this_user_type: "ma",
                itemStyle: {
                    normal: {
                        color: "#A3ACB1"
                    },
                    emphasis: {
                        color: "#8E999F"
                    }
                }
            }]
        }]
    };
    var original_width_model = "";
    var dsearch_view = {
        "all": ["su", "ag", "mem", "sub"],
        "co": ["su", "ag", "mem"],
        "su": ["ag", "mem"],
        "ag": ["mem"]
    };
    var popular_quick_btn = new Object;
	var report_quick_btn = [{
		"date": "yesterday",
		"result_type": "Y"
	}, {
		"date": "today",
		"result_type": "Y"
	}, {
		"date": "this_week",
		"result_type": "Y"
	}, {
		"date": "last_week",
		"result_type": "Y"
	}, {
		"date": "today",
		"result_type": "N"
	}];
	var data_value_show_cokie = "data_value_show_" + top.login_layer + top.user_id;
	var data_value_show = "Y";
	var problem_acc_data = {
		"su": {
			"get_data": false,
			"dataAry": {},
			"total_count": 0
		},
		"ag": {
			"get_data": false,
			"dataAry": {},
			"total_count": 0
		}
	};
	var now_show_problem_acc = "";
    _self.init = function() {
        util.echo("dashboard_main load complete");
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        _self.addEventListener("startTimer", _self.startTimer);
        _self.addEventListener("stopTimer", _self.stopTimer);
        _self.addEventListener("clearTimer", _self.clearTimer);
        _self.addEventListener("setNowDashboard", _self.setNowDashboard);
        if (win.addEventListener)
            win.addEventListener("resize", _self.do_resize);
        if (win.addEventListener)
            win.addEventListener("orientationchange", _self.do_resize);
        retrieve_banner_btn = dom.getElementById("retrieve_banner_btn");
        report_btn = dom.getElementById("report_btn");
        acc_btn = dom.getElementById("acc_btn");
        bet_btn = dom.getElementById("bet_btn");
        _self.show_banner();
        var objid = ",div_value_show,type_quick_scroll,div_quick_title,model_quick_btn_page,model_quick_btn_report,";
		var tmpObj = util.getObjAry(dom, objid);
		_mc = util.mergeArray(_mc, tmpObj);
        _mc = util.mergeArray(_mc, tmpObj);
		if (cookie.get(data_value_show_cokie) != null) data_value_show = cookie.get(data_value_show_cokie);
		_self.set_value_show();
		var obj_icon_hide = _mc["div_value_show"].getElementsByClassName("icon_hide");
		for (var key in obj_icon_hide) {
			var this_obj = obj_icon_hide[key];
			util.addEvent(this_obj, "click", _self.chg_value_show)
		}
        util.addEvent(_mc["type_quick_scroll"], "scroll", _self.roll, {
			"chk_obj": _mc["type_quick_scroll"],
			"do_obj": _mc["div_quick_title"]
		});
		
		popular_quick_btn = {
			"report": {
				"show_pri": "C",
				"_fun": _self.chgPage,
				"_fun_param": {
					"page": "report_main",
					"type": "report",
					"pageName": "report"
				}
			},
			"acc": {
				"show_pri": "B",
				"_fun": _self.chooseLayer,
				"_fun_param": {}
			},
			"bet": {
				"show_pri": "A",
				"_fun": _self.chgPage,
				"_fun_param": {
					"page": "overView",
					"pageType": "totalbet",
					"pageName": "overview",
					"target": "analysis"
				}
			},
			"wmc": {
				"show_pri": "A",
				"_fun": _self.wmcOpen,
				"_fun_param": {}
			}
		};
		_self.createQuick_btn();
       
        if (top.user_type == 1 || pri_type.indexOf("C") != -1) {
            yesterDay = dom.getElementById("per_yes");
            lastWeek = dom.getElementById("per_lw");
            thisPeriod = dom.getElementById("per_tp");
            util.addEvent(yesterDay, "click", _self.showPerformance, {
                "range": "yes"
            });
            util.addEvent(lastWeek, "click", _self.showPerformance, {
                "range": "lw"
            });
            util.addEvent(thisPeriod, "click", _self.showPerformance, {
                "range": "tp"
            });
            util.addEvent(dom.getElementById("per_box_scroll"), "scroll", _self.roll, {
                "chk_obj": dom.getElementById("per_box_scroll"),
                "do_obj": dom.getElementById("per_box_scroll").parentNode
            });
            _self.getOverView()
        } else
            dom.getElementById("box_per").style.display = "none";
       
        credits = dom.getElementById("credits");
        balance = dom.getElementById("balance");
        balance_show = dom.getElementById("balance_show");
        this_period_performance = dom.getElementById("this_period_performance");
        this_period = dom.getElementById("this_period");
        remaining_days = dom.getElementById("remaining_days");
        completed_days = dom.getElementById("completed_days");
        logindate = dom.getElementById("last_login");
        amount_mem = dom.getElementById("amount_mem");
        lastdate = dom.getElementById("lastdate");
        dashboard_search = dom.getElementById("dashboard_search");
        if (top.user_type == 1 || pri_type.indexOf("B") != -1) {
            _mc["da_SU"] = dom.getElementById("da_SU");
            _mc["da_A"] = dom.getElementById("da_A");
            _mc["da_M"] = dom.getElementById("da_M");
            _mc["downline_summary"] = dom.getElementById("downline_summary");
            _mc["d_go_retrieve_btn"] = dom.getElementById("d_go_retrieve_btn");
            downline_summary_options["series"][0]["data"][0]["name"] = LS.get("enable_Y");
            downline_summary_options["series"][0]["data"][1]["name"] = LS.get("enable_N");
            downline_summary_options["series"][0]["data"][2]["name"] = LS.get("enable_S");
            downline_summary_options["series"][0]["data"][3]["name"] = LS.get("enable_F");
            if (top.login_layer == "su")
                _mc["da_SU"].style.display = "none";
            if (top.login_layer == "ag") {
                _mc["da_SU"].style.display = "none";
                _mc["da_A"].style.display = "none"
            }
            util.addEvent(_mc["da_SU"], "click", _self.show_downline_summary, "su");
            util.addEvent(_mc["da_A"], "click", _self.show_downline_summary, "a");
            util.addEvent(_mc["da_M"], "click", _self.show_downline_summary, "m");
            util.addEvent(dom.getElementById("da_box_scroll"), "scroll", _self.roll, {
                "chk_obj": dom.getElementById("da_box_scroll"),
                "do_obj": dom.getElementById("da_box_scroll").parentNode
            })
        } else
            dom.getElementById("downlineS").style.display = "none";
        if (top.user_type == 1 || pri_type.match(/B[0-9A-Za-z]/) != null)
            _self.set_dashboard_search();
        else
            dashboard_search.style.display = "none";
        
        util.addEvent(acc_btn, "click", _self.chooseLayer);
        util.addEvent(report_btn, "click", _self.chgPage, {
            "page": "report_main",
            "type": "report",
            "pageName": "report"
        });
        util.addEvent(bet_btn, "click", _self.chgPage, {
            "page": "overView",
            "pageType": "totalbet",
            "pageName": "overview",
            "target": "analysis"
        });
     
        _self.addEventListener("choseDateEvent", _self.choseDateEvent);
        _self.addEventListener("viewReportTeach", _self.viewReportTeach);
      
        // if (top.user_type == 1 && top.pay_type == "0" && top.retrieve_sw == "Y" && top.user_enable == "Y"){
        //     util.addEvent(retrieve_banner_btn, "click", _self.chgPage, {
        //         "page": "retrieve_credit"
        //     });
        // }else{
        //     retrieve_banner_btn.style.display = "none";
        // }

        

       
        if (top.user_type != 1) {
           /* if (pri_type.indexOf("A") == -1) {
                bet_btn.style.display = "none";
                util.removeEvent(bet_btn, "click")
            }
            if (pri_type.indexOf("B") == -1) {
                acc_btn.style.display = "none";
                util.removeEvent(acc_btn, "click")
            }
            if (pri_type.indexOf("C") == -1) {
                report_btn.style.display = "none";
                util.removeEvent(report_btn, "click")
            }*/
        }
        
        _self.getTmpData();
        _self.initHttpRequest();
        if ((top.user_type == 1 || pri_type.indexOf("C") != -1) && false){
            // _self.getPossess();
            // _self.getMembers();
            // _self.getWinLoss();
            // for (var key in WL_mode_arr) {
            //     var this_type = WL_mode_arr[key];
            //     _mc["WL_mode_" + this_type] = dom.getElementById("WL_mode_" + this_type);
            //     util.addEvent(_mc["WL_mode_" + this_type], "click", _self.chg_WL_mode, {
            //         "chg_type": this_type
            //     })
            // }
        } else {
            dom.getElementById("box_possess").style.display = "none";
            dom.getElementById("box_members").style.display = "none";
            dom.getElementById("box_turnover").style.display = "none";
            dom.getElementById("box_winloss").style.display = "none"
        }
        
        _self.do_resize()
    };

    _self.createQuick_btn = function() {
		var show_div = _mc["type_quick_scroll"];
		show_div.innerHTML = "";
		var show_report_type = true;
		var show_div_display = "none"; 
		for (var key in popular_quick_btn) {
			var this_obj = popular_quick_btn[key];
			var show_this_type = true;
			if (top.user_type != 1 && this_obj["show_pri"] != "" && pri_type.indexOf(this_obj["show_pri"]) == -1) {
				show_this_type = false;
				if (key == "report") show_report_type = false
			}
			if (key == "wmc" && top.user_enable == "S") show_this_type = false;
			if (show_this_type) {
				var model_score = _mc["model_quick_btn_page"].children[0].cloneNode(true);
				var tmp_div = document.createElement("div");
				tmp_div.appendChild(model_score);
				tmp_div.innerHTML = tmp_div.innerHTML.replace(/\*SHOWBTNNAME\*/g, LS.get("quick_btn_name_popular"));
				tmp_div.innerHTML = tmp_div.innerHTML.replace(/\*SHOWPAGENAME\*/g, LS.get("quick_btn_" + key));
				var child = tmp_div.children[0].cloneNode(true);
				show_div.appendChild(child);
				util.addEvent(child, "click", this_obj["_fun"], this_obj["_fun_param"]);
				show_div_display = ""
			}
		}
        
		if (show_report_type) for (var key in report_quick_btn) {
			var this_obj = report_quick_btn[key];
			var model_score = _mc["model_quick_btn_report"].children[0].cloneNode(true);
			var tmp_div = document.createElement("div");
			tmp_div.appendChild(model_score);

            
			tmp_div.innerHTML = tmp_div.innerHTML.replace(/\*SHOWREPORTDATE\*/g, LS.get("report_quick_btn_" + this_obj["date"]));//
			tmp_div.innerHTML = tmp_div.innerHTML.replace(/\*SHOWREPORTTYPE\*/g, LS.get("report_quick_btn_" + this_obj["result_type"]));
			var child = tmp_div.children[0].cloneNode(true);
			show_div.appendChild(child); 
        
			var this_param = _self.get_goReportParam(this_obj["date"], this_obj["result_type"], jsonDate);
			util.addEvent(child, "click", _self.goToRepoort, this_param)
		}
		_mc["div_quick_title"].style.display = show_div_display
	};

    _self.wmcOpen = function() {
		var obj = new Object;
		obj.filename = "app/wmc/index.php";
		obj.title =
			"_blank";
		parentClass.dispatchEvent("newOpenPageNoPar", obj)
	};
	_self.get_goReportParam = function(this_date, this_result_type, this_Daterange) {
		var date_s = "";
		var date_e = "";
		if (this_date == "yesterday") {
			date_s = this_Daterange["yesterday"];
			date_e = this_Daterange["yesterday"]
		} else if (this_date == "today") {
			date_s = this_Daterange["today"];
			date_e = this_Daterange["today"]
		} else if (this_date == "this_week") {
			date_s = this_Daterange["this_week_s"];
			date_e = this_Daterange["this_week_e"]
		} else if (this_date == "last_week") {
			date_s = this_Daterange["last_week_s"];
			date_e = this_Daterange["last_week_e"]
		}
		return {
			"date_start": date_s,
			"date_end": date_e,
			"result_type": this_result_type
		}
	};
	_self.set_value_show = function() {
		if (data_value_show == "Y") {
			if (_mc["div_value_show"].classList.contains("--hide")) _mc["div_value_show"].classList.remove("--hide")
		} else if (!_mc["div_value_show"].classList.contains("--hide")) _mc["div_value_show"].classList.add("--hide")
	};
	_self.chg_value_show = function() {
		if (data_value_show == "Y") data_value_show = "N";
		else data_value_show = "Y";
		cookie.set(data_value_show_cokie,
			data_value_show);
		_self.set_value_show()
	};

    _self.initHttpRequest = function() {
        var _time = config_set.get("RETRY_TIME");
        var _limit = config_set.get("RETRY_LIMIT");
        hr = new win.HttpRequestRetry(win.HttpRequest, _time, _limit);
        hr.setParentclass(_self);
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadComplete)
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        config_set = parentClass.getThis("config_set");
        Timer = parentClass.getThis("Timer");
        timerHash = parentClass.getThis("timerHash");
        getView = parentClass.getThis("getView");
        cookie = parentClass.getThis("cookie");
        Storage = parentClass.getThis("Storage")
    };
    _self.getParentThis = function(varible) {
        return parentClass.getThis(varible)
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.exitEvent = function() {
        util.echo("dashboard_main exit");
        now_dash_type = "";
        hr.clearObj();
        _self.destroyDashboard();
        if (win.removeEventListener) {
            win.removeEventListener("resize", _self.do_resize);
            win.removeEventListener("orientationchange", _self.do_resize)
        }
        return true
    };
    _self.destroyDashboard = function() {
        for (var keys in dashHash)
            dashHash[keys].destroy()
    };
    _self.roll = function(e, param) {
        if (param.chk_obj.scrollLeft == 0)
            param.do_obj.classList.remove("scroll");
        else
            param.do_obj.classList.add("scroll")
    };
    _self.setNowDashboard = function(param) {
        now_dash_type = param.dash_type
    };
    
    _self.choseDateEvent = function(param) {
        var postHash = new Object;
        postHash["report_kind"] = "A";
        postHash["report_type"] = "set";
        postHash["result_type"] = "Y";
        postHash["date_start"] = param.date;
        postHash["date_end"] = param.date;
        postHash["gtype"] = "ALL";
        postHash["wtype"] = "ALL";
        postHash["view_layer"] = top.login_layer;
        postHash["account"] = "main";
        var param = new Object;
        param["page"] = "report_" + top.login_layer;
        param["post"] = "view_layer=" + top.login_layer;
        param["postHash"] = postHash;
        param["extendsClass"] = "report_index";
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.viewReportTeach = function(param) {
        parentClass.dispatchEvent("viewReportTeach", param)
    };
    _self.createTimer = function() {
        timerHash["dashboard"] = new Timer(config_set.get("DASHBOARD"));
        timerHash["dashboard"].setParentclass(_self);
        timerHash["dashboard"].init();
        timerHash["dashboard"].addEventListener("TimerEvent.TIMER", _self.timerRun);
        timerHash["dashboard"].addEventListener("TimerEvent.TIMER_COMPLETE", _self.timerComplete)
    };
    _self.startTimer = function() {
        util.echo("dashboard startTimer")
    };
    _self.stopTimer = function() {
        util.echo("dashboard stopTimer");
        timerHash["dashboard"].stopTimer()
    };
    _self.clearTimer = function() {
        util.echo("dashboard clearTimer");
        if (typeof timerHash["dashboard"] != "undefined")
            timerHash["dashboard"].clearObj()
    };
    _self.timerRun = function() {
        util.echo("DASHBOARD timer");
        _self.getData()
    };
    _self.timerComplete = function() {
        util.echo("timerComplete")
    };
    _self.getData = function() {
        hr.loadURL(top.url, "POST", "p=get_dashboard&ver=" + top.ver)
    };
    
    
    _self.getTmpData = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&user_id=" + top.user_id;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&langx=" + top.langx;
        urlParams += "&layer_id=" + top.layer_id;
        urlParams = "p=get_dashboard&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.LoadComplete);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.onError = function() {
        util.echo("onError")
    };
    _self.LoadComplete = function(json) {
        util.echo(json);
        try {
            var hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code))
                return;
            if (hash["now_maxcredit"] == "-") {
                credits.innerHTML = "-";
                balance.innerHTML = "-"
            } else {
                _self.set_fz(credits, hash["now_maxcredit"] * 1);
                var float_bit = Math.abs(hash["now_maxcredit"] * 1) >= 1E8 ? 0 : 2;
                _self.show_scroll_numbers(credits, 0, hash["now_maxcredit"] * 1, float_bit, false);
                if (top.pay_type == "1")
                    balance_show.style.display = "none";
                else {
                    balance_show.style.display = "";
                    var tmp_balance = hash["now_maxcredit"] * 1 - hash["lv_maxcredit"] * 1;
                    _self.set_fz(balance, tmp_balance);
                    var float_bit = Math.abs(tmp_balance * 1) >= 1E8 ? 0 : 2;
                    _self.show_scroll_numbers(balance, 0, tmp_balance * 1, float_bit, false)
                }
            }
            _self.show_scroll_numbers(amount_mem, 0, hash["amount_mem"] * 1, 0, false);
            if (hash["logindate"] != "")
                logindate.innerHTML = hash["logindate"];
            lastdate.innerHTML = hash["lastdate"];
            if (hash["this_period"]["show"] == "Y") {
                this_period_performance.innerHTML = hash["this_period"]["this_period"];
                this_period.innerHTML = hash["this_period"]["this_period"];
                remaining_days.innerHTML = hash["this_period"]["remaining_days"];
                completed_days.innerHTML = hash["this_period"]["completed_days"]
            } else {
                this_period_performance.innerHTML = LS.get("period_not_set");
                this_period.innerHTML = LS.get("period_not_set");
                remaining_days.innerHTML = "-";
                completed_days.innerHTML = "-"
            }
            if (top.user_type == 1 || pri_type.indexOf("B") != -1) {
                su_enable_Y = hash["su_enable_Y"];
                su_enable_N = hash["su_enable_N"];
                su_pri_Y = hash["su_pri_Y"];
                su_pri_N = hash["su_pri_N"];
                a_enable_Y = hash["a_enable_Y"];
                a_enable_N = hash["a_enable_N"];
                a_pri_Y = hash["a_pri_Y"];
                a_pri_N = hash["a_pri_N"];
                m_enable_Y = hash["m_enable_Y"];
                m_enable_N = hash["m_enable_N"];
                m_pri_Y = hash["m_pri_Y"];
                m_pri_N = hash["m_pri_N"];
                var tmp_user_type = "su";
                if (top.login_layer == "su")
                    tmp_user_type = "a";
                else if (top.login_layer == "ag")
                    tmp_user_type = "m";
                dashboard_chart = hash["dashboard_chart"];
                if (dashboard_chart == "Y") {
                    var e = null;
                    _self.show_downline_summary(e, tmp_user_type);
                    if (downlineSummary != null) {
                        downlineSummary.on("click", function(params) {
                            if (params.componentType === "series")
                                _self.goToQuick({
                                    "search_type": params.data.this_user_type,
                                    "enable": params.data.this_enable
                                })
                        });
                        downlineSummary.on("legendselectchanged", function(params) {
                            var option = this.getOption();
                            option.legend[0].selected[params.name] = true;
                            this.setOption(option);
                            var this_user_type = this_enable = "";
                            list.forEach(item => {
                                if (item.name == params.name) {
                                    this_user_type = item.this_user_type;
                                    this_enable = item.this_enable
                                }
                            });
                            if (this_user_type != "" && this_enable != "")
                                _self.goToQuick({
                                    "search_type": this_user_type,
                                    "enable": this_enable
                                })
                        });
                        _self.setSysMsgVisible("downline_summary", "div")
                    } else
                        _self.setSysMsgVisible("downline_summary", "sysmsg")
                } else
                    _self.setSysMsgVisible("downline_summary", "sysmsg")
            }
        } catch (e) {
            util.echo("onError");
            return
        }
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "home"
        });
        dom.getElementById("body_show").classList.add("body_pb");
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false,
            "defalutPage": true
        })
    };
    _self.show_downline_summary = function(e, show_user_type) {
        if (dashboard_chart != "Y")
            return;
        var obj_width = _mc["downline_summary"].offsetWidth;
        if (getView().viewportwidth < 600) {
            delete downline_summary_options.legend.right;
            downline_summary_options["legend"]["top"] = "bottom";
            var summary_height = "570px";
            downline_summary_options["series"][0]["center"] = ["50%", "35%"];
            if (obj_width <= 313) {
                summary_height = "400px";
                downline_summary_options["series"][0]["center"] = ["50%", "30%"]
            } else if (obj_width < 360) {
                summary_height = "440px";
                downline_summary_options["series"][0]["center"] = ["50%", "30%"]
            } else if (obj_width < 410)
                summary_height = "480px";
            else if (obj_width < 460)
                summary_height = "520px";
            else if (obj_width < 510)
                summary_height = "560px";
            _mc["downline_summary"].style.height = summary_height
        } else {
            var right_per = "20%";
            if (obj_width <= 315)
                right_per = "0%";
            else if (obj_width <= 355)
                right_per = "5%";
            else if (obj_width <= 430)
                right_per = "10%";
            else if (obj_width < 505)
                right_per = "15%";
            _mc["downline_summary"].style.height = "320px";
            downline_summary_options["legend"]["right"] = right_per;
            delete downline_summary_options.legend.top;
            downline_summary_options["series"][0]["center"] = ["30%", "50%"]
        }
        if (getView().viewportwidth <= 1024)
            downline_summary_options["series"][0]["label"]["emphasis"]["show"] = false;
        else
            downline_summary_options["series"][0]["label"]["emphasis"]["show"] = true;
        try {
            downlineSummary = echarts.init(_mc["downline_summary"])
        } catch (e) {
            downlineSummary = null
        }
        var all_show_user_type = ["su", "a", "m"];
        for (var key in all_show_user_type)
            _mc["da_" + all_show_user_type[key].toUpperCase()].classList.remove("active");
        _mc["da_" + show_user_type.toUpperCase()].classList.add("active");
        downline_summary_options["series"][0]["data"][0]["value"] = eval(show_user_type + "_enable_Y");
        downline_summary_options["series"][0]["data"][1]["value"] = eval(show_user_type + "_enable_N");
        downline_summary_options["series"][0]["data"][2]["value"] = eval(show_user_type + "_pri_Y");
        downline_summary_options["series"][0]["data"][3]["value"] = eval(show_user_type + "_pri_N");
        var top_user_type = "su";
        if (top.login_layer == "su")
            top_user_type = "a";
        else if (top.login_layer == "ag")
            top_user_type = "m";
        if (top_user_type == show_user_type && top.user_type == 1 && top.pay_type == "0" && top.retrieve_sw == "Y" && top.user_enable == "Y") {
            if (_mc["d_go_retrieve_btn"].classList.contains("disabled"))
                _mc["d_go_retrieve_btn"].classList.remove("disabled");
            util.addEvent(_mc["d_go_retrieve_btn"], "click", _self.chgPage, {
                "page": "retrieve_credit"
            });
            _mc["d_go_retrieve_btn"].style.display = ""
        } else {
            _mc["d_go_retrieve_btn"].style.display = "none";
            util.removeEvent(_mc["d_go_retrieve_btn"], "click")
        }
        var search_type = "ma";
        if (show_user_type == "a")
            search_type = "ag";
        else if (show_user_type == "m")
            search_type = "mem";
        downline_summary_options["series"][0]["data"][0]["this_user_type"] = search_type;
        downline_summary_options["series"][0]["data"][1]["this_user_type"] = search_type;
        downline_summary_options["series"][0]["data"][2]["this_user_type"] = search_type;
        downline_summary_options["series"][0]["data"][3]["this_user_type"] = search_type;
        list = downline_summary_options["series"][0]["data"];
        if (downlineSummary != null)
            downlineSummary.setOption(downline_summary_options)
    };
    _self.goToQuick = function(_obj) {
        var paramHash = new Object;
        paramHash["search_layer"] = top.login_layer;
        paramHash["search_id"] = top.layer_id;
        for (var key in _obj)
            paramHash[key] = _obj[key];
        var obj = new Object;
        obj["page"] = "quick_search";
        obj["postHash"] = paramHash;
        parentClass.dispatchEvent("bodyGoToPage", obj)
    };
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname])
            eventHandler[eventname](param)
    };
    _self.showPerformance = function(e, param) {
        util.echo("showPerformance");
        if (param.range == "yes") {
            yesterDay.classList.add("active");
            lastWeek.classList.remove("active");
            thisPeriod.classList.remove("active")
        } else if (param.range == "lw") {
            yesterDay.classList.remove("active");
            lastWeek.classList.add("active");
            thisPeriod.classList.remove("active")
        } else if (param.range == "tp") {
            yesterDay.classList.remove("active");
            lastWeek.classList.remove("active");
            thisPeriod.classList.add("active")
        }
        nowOverView = param.range;
        var OverView_arr_len = OverView_arr.length;
        for (var i = 0; i < OverView_arr_len; i++) {
            var OverView_obj = dom.getElementById("div_" + OverView_arr[i]);
            util.addEvent(OverView_obj, "click", _self.chk_ErrorMsg)
        }
        _self.getOverView()
    };
    _self.chk_ErrorMsg = function() {
        var errHash = new Object;
        errHash["code"] = "m_rep";
        errHash["msg"] = LS.get("err_rp");
        errHash["status"] = "error";
        util.chkErrorMsg(errHash, LS_code)
    };
    _self.getOverView = function() {
        _self.setSysMsgVisible("po", "loading");
        if (top.user_type != 1 && pri_type.indexOf("C") == -1)
            return;
        _self.get_performace("overview", nowOverView, _self.getOverViewComplete)
    };
    _self.getOverViewComplete = function(json) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code)) {
                _self.set_showPerformance(originalOverView);
                return
            }
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return
        }
        if (hash["status"] == "200") {
            if (hash["date"] != nowOverView)
                _self.set_showPerformance(hash["date"]);
            originalOverView = nowOverView;
            if (search_last == "Y") {
                var show_last = hash["show_last"];
                var json = JSON.stringify(show_last);
                Storage.set(top.login_layer + top.user_id + storage_uid + "overview" + nowOverView + top.langx + top.ver, json, 1 / 24)
            } else
                var show_last = JSON.parse(Storage.get(top.login_layer + top.user_id + storage_uid + "overview" + nowOverView + top.langx + top.ver));
            _self.set_OverView("profit", hash, show_last);
            _self.set_OverView("result", hash, show_last);
            _self.set_OverView("stock", hash, show_last);
            _self.setSysMsgVisible("po", "div")
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "term_all")
                _self.setSysMsgVisible("po", "sysmsg");
            else if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
                _self.setSysMsgVisible("po", "sysmsg");
                Storage.vague_del(top.login_layer + top.user_id + storage_uid + "overview")
            } else
                util.showErrorMsg(msg)
        }
    };
    _self.set_showPerformance = function(showOverView) {
        if (showOverView == "yes") {
            yesterDay.classList.add("active");
            lastWeek.classList.remove("active");
            thisPeriod.classList.remove("active")
        } else if (showOverView == "lw") {
            yesterDay.classList.remove("active");
            lastWeek.classList.add("active");
            thisPeriod.classList.remove("active")
        } else if (showOverView == "tp") {
            yesterDay.classList.remove("active");
            lastWeek.classList.remove("active");
            thisPeriod.classList.add("active")
        }
        nowOverView = showOverView
    };
    _self.set_OverView = function(type, hash, show_last) {
        var this_Obj = dom.getElementById("div_" + type);
        if (this_Obj) {
            util.addEvent(this_Obj, "click", _self.goToRepoort, {
                "date_start": hash["date_start"],
                "date_end": hash["date_end"]
            });
            var obj_ids = ",show_compare_" + type + ",per_" + type + ",compare_" + type + ",compare_per_" + type + ",";
            var tmpObj = util.getObjAry(this_Obj, obj_ids);
            _self.set_fz(tmpObj["per_" + type], hash[type]);
            tmpObj["per_" + type].classList.remove("word_red");
            if (hash[type] < 0)
                tmpObj["per_" + type].classList.add("word_red");
            var show_per = false;
            if (type == "profit")
                show_per = true;
            var float_bit = Math.abs(hash[type] * 1) >= 1E8 ? 0 : 2;
            _self.show_scroll_numbers(tmpObj["per_" + type], 0, hash[type] * 1, float_bit, show_per);
            dom.getElementById("show_compare_" + type).style.display = "none";
            if (show_last != null)
                if (show_last["show_compare_" + type]) {
                    tmpObj["show_compare_" + type].classList.remove("increase");
                    tmpObj["show_compare_" + type].classList.remove("decrease");
                    if (show_last["class_" + type] != "")
                        tmpObj["show_compare_" + type].classList.add(show_last["class_" + type]);
                    tmpObj["compare_" + type].dataset.inc = LS.get("overView_inc_" + nowOverView);
                    tmpObj["compare_" + type].dataset.dec = LS.get("overView_dec_" + nowOverView);
                    tmpObj["compare_" + type].innerHTML = show_last["compare_" + type] + "%";
                    tmpObj["compare_per_" + type].style.width = show_last["compare_" + type] > 100 ? "100%" : show_last["compare_" + type] + "%";
                    tmpObj["show_compare_" + type].style.display = "";
                    dom.getElementById("show_compare_" + type).style.display = ""
                }
        }
    };
    _self.show_scroll_numbers = function(_obj, value_s, value_e, float_bit, show_per) {
        var str_per = show_per ? "%" : "";
        var total = 100;
        _obj.innerHTML = value_s + str_per;
        var final = value_s;
        var random = value_e;
        var diff = random - final;
        var plus = Math.round(diff / total * 100) / 100;
        var cnt = 0;
        var i = setInterval(function() {
            final = final + plus;
            if (cnt >= total) {
                _obj.innerHTML = util.mprintf(random * 1, 0, float_bit, false, true) + str_per;
                clearInterval(i);
                return
            }
            _obj.innerHTML = util.mprintf(final * 1, 0, float_bit, false, true) + str_per;
            cnt++
        }, 1)
    };
    _self.set_fz = function(_obj, value) {
        var value_arr = new Array;
        value = value + "";
        value_arr = value.split(".");
        var value_bit = value_arr[0].replace("-", "").length;
        _obj.classList.remove("fz36", "fz33", "fz30", "fz27", "fz24", "fz21", "fz18");
        var show_size = "36";
        if (value_bit >= 18)
            show_size = "18";
        else if (value_bit >= 17)
            show_size = "21";
        else if (value_bit >= 16)
            show_size = "24";
        else if (value_bit >= 15)
            show_size = "27";
        else if (value_bit >= 14)
            show_size = "30";
        else if (value_bit >= 13)
            show_size = "33";
        _obj.classList.add("fz" + show_size)
    };
    _self.goToRepoort = function(e, date) {
        var postHash = new Object;
        postHash["report_kind"] = "A";
        postHash["report_type"] = "set";
        postHash["result_type"] = date["result_type"] || "Y";
        postHash["date_start"] = date["date_start"];
        postHash["date_end"] = date["date_end"];
        postHash["gtype"] = "ALL";
        postHash["wtype"] = "ALL";
        postHash["view_layer"] = top.login_layer;
        postHash["account"] = "main";
        var param = new Object;
        param["page"] = "report_" + top.login_layer;
        param["post"] = "view_layer=" + top.login_layer;
        param["postHash"] = postHash;
        param["extendsClass"] = "report_index";
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.setSysMsgVisible = function(type, isShowtype) {
        var arr_do_type = {
            "div": "none",
            "sysmsg": "none",
            "loading": "none"
        };
        var loading_obj = dom.getElementById("loading_" + type);
        if (loading_obj)
            loading_obj.classList.remove("--success");
        arr_do_type[isShowtype] = "";
        var show_time = 0;
        for (var key in arr_do_type) {
            show_time = 0;
            var do_obj = dom.getElementById(key + "_" + type);
            if (do_obj) {
                if (isShowtype == "div") {
                    show_time = 200;
                    if (loading_obj)
                        loading_obj.classList.add("--success")
                }
                setTimeout(function(do_obj, do_type) {
                    do_obj.style.display = do_type
                }, show_time, do_obj, arr_do_type[key])
            }
        }
    };
    _self.getPossess = function() {
        _self.get_performace("possess", nowPossess, _self.getPossessComplete)
    };
    _self.getPossessComplete = function(json, isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code))
                return
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return
        }
        if (hash["status"] == "200") {
            if (!isStorage)
                Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
            var click_flag = true;
            var labelAry = _self.getLabel(hash["data"]["value"]);
            var showObj = dom.getElementById("show_possess");
            if (dashHash["possess"] != null)
                dashHash["possess"].destroy();
            dashHash["possess"] = new win.dashboard(win, dom);
            dashHash["possess"].setParentclass(_self);
            dashHash["possess"].init();
            dashHash["possess"].show("possess", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"], click_flag);
            _self.setSysMsgVisible("possess", "div");
            util.addEvent(dom.getElementById("div_possess"), "scroll", _self.roll, {
                "chk_obj": dom.getElementById("div_possess"),
                "do_obj": dom.getElementById("div_possess")
            })
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
                _self.setSysMsgVisible("possess", "sysmsg");
                Storage.vague_del(top.login_layer + top.user_id + storage_uid + "possess")
            } else
                util.showErrorMsg(msg)
        }
    };
    _self.getMembers = function() {
        _self.get_performace("members", nowMembers, _self.getMembersComplete)
    };
    _self.getMembersComplete = function(json, isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code))
                return
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return
        }
        if (hash["status"] == "200") {
            if (!isStorage)
                Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
            var click_flag = true;
            var labelAry = _self.getLabel(hash["data"]["value"]);
            var showObj = dom.getElementById("show_members");
            if (dashHash["members"] != null)
                dashHash["members"].destroy();
            dashHash["members"] = new win.dashboard(win, dom);
            dashHash["members"].setParentclass(_self);
            dashHash["members"].init();
            dashHash["members"].show("members", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"], click_flag);
            _self.setSysMsgVisible("members", "div");
            util.addEvent(dom.getElementById("div_members"), "scroll", _self.roll, {
                "chk_obj": dom.getElementById("div_members"),
                "do_obj": dom.getElementById("div_members")
            })
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
                _self.setSysMsgVisible("members", "sysmsg");
                Storage.vague_del(top.login_layer + top.user_id + storage_uid + "members")
            } else
                util.showErrorMsg(msg)
        }
    };
    _self.getTurnOver = function() {
        _self.get_performace("turnover", nowTurnOver, _self.getTurnOverComplete)
    };
    _self.getTurnOverComplete = function(json, isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code))
                return
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return
        }
        if (hash["status"] == "200") {
            if (!isStorage)
                Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
            var click_flag = true;
            var labelAry = _self.getLabel(hash["data"]["value"]);
            var showObj = dom.getElementById("show_turnover");
            if (dashHash["turnover"] != null)
                dashHash["turnover"].destroy();
            dashHash["turnover"] = new win.dashboard(win, dom);
            dashHash["turnover"].setParentclass(_self);
            dashHash["turnover"].init();
            dashHash["turnover"].show("turnover", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"], click_flag);
            _self.setSysMsgVisible("turnover", "div");
            util.addEvent(dom.getElementById("div_turnover"), "scroll", _self.roll, {
                "chk_obj": dom.getElementById("div_turnover"),
                "do_obj": dom.getElementById("div_turnover")
            })
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
                _self.setSysMsgVisible("turnover", "sysmsg");
                Storage.vague_del(top.login_layer + top.user_id + storage_uid + "turnover")
            } else
                util.showErrorMsg(msg)
        }
    };
    _self.getWinLoss = function() {
        _self.get_performace("winloss", nowWinLoss, _self.getWinLossComplete)
    };
    _self.getWinLossComplete = function(json, isStorage) {
        var hash;
        try {
            hash = JSON.parse(json);
            if (util.chkErrorMsg(hash, LS_code))
                return
        } catch (e) {
            util.err("[" + classname + "]", e);
            util.showErrorMsg("data error");
            return
        }
        if (hash["status"] == "200") {
            if (!isStorage)
                Storage.set(top.login_layer + top.user_id + storage_uid + hash["data"]["code"] + hash["data"]["pdate"] + top.langx + top.ver, json, 1 / 24);
            var click_flag = true;
            var labelAry = _self.getLabel(hash["data"]["value"]);
            if (showWinLoss_mode == "ag")
                hash["data"]["value"] = _self.transform_WinLoss_mode(hash["data"]["value"]);
            var showObj = dom.getElementById("show_winloss");
            if (dashHash["winloss"] != null)
                dashHash["winloss"].destroy();
            dashHash["winloss"] = new win.dashboard(win, dom);
            dashHash["winloss"].setParentclass(_self);
            dashHash["winloss"].init();
            dashHash["winloss"].show("winloss", showObj, labelAry, hash["data"]["value"], hash["data"]["date"], hash["data"]["org_date"], click_flag, showWinLoss_mode);
            _self.setSysMsgVisible("winloss", "div");
            util.addEvent(dom.getElementById("div_winloss"), "scroll", _self.roll, {
                "chk_obj": dom.getElementById("div_winloss"),
                "do_obj": dom.getElementById("div_winloss")
            })
        } else {
            var msg = hash["msg"] ? hash["msg"] : LS_code.get(hash["code"]);
            if (hash["code"] == "4X039" || hash["code"] == "ag_dashboard_chart") {
                _self.setSysMsgVisible("winloss", "sysmsg");
                Storage.vague_del(top.login_layer + top.user_id + storage_uid + "winloss")
            } else
                util.showErrorMsg(msg)
        }
    };
    _self.getLabel = function(data) {
        var ret = new Array;
        var singleDay = getView().viewportwidth < 768;
        for (var i = 0; i < data.length; i++)
            ret[i] = i + 1;
        return ret
    };
    _self.get_performace = function(code, _date, retFun) {
        if (use_Storage_code.indexOf("," + code + ",") != -1) {
            var cdata = Storage.get(top.login_layer + top.user_id + storage_uid + code + _date + top.langx + top.ver);
            if (cdata != null) {
                retFun(cdata, true);
                return
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
            var overview_last = Storage.get(top.login_layer + top.user_id + storage_uid + "overview" + _date + top.langx + top.ver);
            search_last = overview_last != null ? "N" : "Y";
            param += "&search_last=" + search_last
        }
        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
        hr.setParentclass(_self);
        hr.addEventListener("onError", _self.perOnError);
        hr.addEventListener("LoadComplete", retFun);
        hr.loadURL(top.url, "POST", param)
    };
    _self.perOnError = function() {};
    _self.formatThousand = function(num) {
        num = num + "";
        var tmp = num.split(".");
        num = tmp[0];
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) {
            num = num.replace(re, ",");
        }
        if (tmp.length > 1)
            num = num + "." + tmp[1];
        return num
    };
    _self.chgPage = function(e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.chooseLayer = function() {
        parentClass.dispatchEvent("chooseLayer", {})
    };
    _self.hideDiv = function(e, param) {
        dom.getElementById("show_" + param.type).style.display = "none"
    };
    _self.do_resize = function(e) {
        var tmp_width = getView().viewportwidth;
        var now_width_model = "320";
        var do_reload = false;
        if (tmp_width > 1024)
            now_width_model = "1024";
        if (original_width_model != "")
            if (original_width_model != now_width_model)
                do_reload = true;
        if (typeof e != "undefined")
            if (e.type == "orientationchange")
                do_reload = true;
        original_width_model = now_width_model;
        if (do_reload)
            parentClass.dispatchEvent("bodyGoToPage", {
                "target": "home",
                "page": "dashboard_main"
            })
    };
    _self.set_dashboard_search = function() {
        var obj_ids = ",dsearch_box,dsearch_txt,dsearch_clean,dsearch_btn,";
        obj_ids += "dsearch_user_type,dsearch_user_type_show,dsearch_user_type_btn,";
        var tmpObj = util.getObjAry(dashboard_search, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        util.ChkKeyUser(_mc["dsearch_txt"]);
        util.addEvent(_mc["dsearch_txt"], "focus", _self.show_dsearch_box, {
            "target": _mc["dsearch_box"],
            "act": "add",
            "class_name": "focus"
        });
        util.addEvent(_mc["dsearch_txt"], "blur", _self.show_dsearch_box, {
            "target": _mc["dsearch_box"],
            "act": "remove",
            "class_name": "focus"
        });
        util.addEvent(_mc["dsearch_txt"], "keyup", _self.keyup_dsearch, {
            "target": _mc["dsearch_txt"],
            "clean_target": _mc["dsearch_clean"]
        });
        util.addEvent(_mc["dsearch_txt"], "keypress", _self.Press_Search, "", false);
        util.addEvent(_mc["dsearch_clean"], "click", _self.clean_dsearch, {
            "target": _mc["dsearch_clean"],
            "target_txt": _mc["dsearch_txt"]
        });
        util.addEvent(_mc["dsearch_btn"], "click", _self.dsearch_go, {
            "target_txt": _mc["dsearch_txt"]
        });
        var obj_ids = ",sel_user_type_su,sel_user_type_ag,sel_user_type_mem,sel_user_type_sub,";
        var sel_Obj = util.getObjAry(_mc["dsearch_user_type"], obj_ids);
        var obj_ids = ",btn_user_type_su,btn_user_type_ag,btn_user_type_mem,btn_user_type_sub,";
        var btn_Obj = util.getObjAry(_mc["dsearch_user_type_btn"], obj_ids);
        _mc = util.mergeArray(_mc, btn_Obj);
        var view_all = dsearch_view["all"];
        var this_view = dsearch_view[top.login_layer];
        if (top.user_type == 1)
            this_view.push("sub");
        for (var key in view_all) {
            var tmp_view = view_all[key];
            if (this_view.indexOf(tmp_view) != -1)
                util.addEvent(_mc["btn_user_type_" + tmp_view], "click", _self.dsearch_btn_click, {
                    "click_view": tmp_view,
                    "click_class": "active"
                });
            else {
                sel_Obj["sel_user_type_" + tmp_view].remove();
                btn_Obj["btn_user_type_" + tmp_view].style.display = "none"
            }
        }
        if (now_dsearch_type == "")
            now_dsearch_type = "mem";
        _mc["dsearch_user_type"].value = now_dsearch_type;
        _mc["btn_user_type_" + now_dsearch_type].classList.add("active");
        _self.dsearch_change(null, {
            "target": _mc["dsearch_user_type"],
            "show_target": _mc["dsearch_user_type_show"]
        });
        util.addEvent(_mc["dsearch_user_type"], "change", _self.dsearch_change, {
            "target": _mc["dsearch_user_type"],
            "show_target": _mc["dsearch_user_type_show"]
        });
        _self.doSelToUL(_mc["dsearch_user_type"], "dsearch_user_type_LB")
    };
    _self.show_dsearch_box = function(e, param) {
        var use_target = param.target;
        if (use_target)
            if (param.act == "add")
                use_target.classList.add(param.class_name);
            else if (param.act == "remove")
            use_target.classList.remove(param.class_name)
    };
    _self.keyup_dsearch = function(e, param) {
        var use_target = param.target;
        if (use_target)
            if (use_target.value.length > 0) {
                if (param.clean_target)
                    param.clean_target.style.display = ""
            } else if (param.clean_target)
            param.clean_target.style.display = "none"
    };
    _self.Press_Search = function(e, param) {
        var keyCode = util.getKeyCode(e);
        if (keyCode == 13)
            _self.dsearch_go(e, {
                "target_txt": _mc["dsearch_txt"]
            })
    };
    _self.clean_dsearch = function(e, param) {
        if (param.target_txt)
            param.target_txt.value = "";
        if (param.target)
            param.target.style.display = "none"
    };
    _self.dsearch_change = function(e, param) {
        var use_target = param.target;
        if (use_target) {
            var this_value = use_target.value;
            var all_select = use_target.getElementsByTagName("option");
            var _show = all_select[0].innerHTML;
            for (var i = 0; i < all_select.length; i++)
                if (all_select[i].value == this_value) {
                    var _show = all_select[i].innerHTML;
                    break
                }
            now_dsearch_type = this_value;
            if (param.show_target)
                param.show_target.innerHTML = _show
        }
    };
    _self.dsearch_btn_click = function(e, param) {
        var view_all = dsearch_view["all"];
        if (_mc["dsearch_user_type"].value == param.click_view)
            return;
        _mc["dsearch_user_type"].value = param.click_view;
        for (var key in view_all) {
            var tmp_view = view_all[key];
            if (tmp_view == param.click_view)
                _mc["btn_user_type_" + tmp_view].classList.add(param.click_class);
            else
                _mc["btn_user_type_" + tmp_view].classList.remove(param.click_class)
        }
        now_dsearch_type = param.click_view
    };
    _self.dsearch_go = function(e, param) {
        if (param.target_txt.value != "") {
            var user_type = {
                "su": "ma",
                "ag": "ag",
                "mem": "mem",
                "sub": "subAcc"
            };
            _self.goToQuick({
                "search_type": user_type[now_dsearch_type],
                "search_txt": param.target_txt.value,
                "e": e
            })
        }
    };
    _self.doSelToUL = function(DOMSel, labelId) {
        var obj_ids = ",sel_text,sel_list,";
        var elmt = util.getObjAry(dom.getElementById(labelId), obj_ids);
        elmt["sel_label"] = dom.getElementById(labelId);
        elmt["sel_list"].innerHTML = "";
        var options = DOMSel.options;
        for (i = 0; i < options.length; i++) {
            var tmp_li = document.createElement("li");
            tmp_li.id = options[i].value;
            tmp_li.innerHTML = options[i].innerHTML;
            elmt["sel_list"].appendChild(tmp_li)
        }
        var sel_js = new win.ClassSelect(win, dom); 
        sel_js.setParentclass(_self);
        sel_js.init(elmt["sel_text"], elmt["sel_list"], elmt["sel_label"], elmt["sel_label"]);
        sel_js.setSelected(DOMSel.value);
        sel_js.setSelCss("active", "", false);
        sel_js.addEvent("ONCHANGE", _self.set_SEL_value, DOMSel);
        sel_js.addEvent("ONOPEN", _self.show_sel_box, elmt["sel_label"]);
        sel_js.addEvent("ONCLOSE", _self.close_sel_box, elmt["sel_label"]);
        DOMSel["JS_UL"] = sel_js
    };
    _self.set_SEL_value = function(e, ElmObj) {
        ElmObj.value = ElmObj.JS_UL.value();
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            ElmObj.dispatchEvent(evt)
        } else
            ElmObj.fireEvent("onchange")
    };
    _self.show_sel_box = function(e, ElmObj) {
        if (!ElmObj.classList.contains("on")) {
            ElmObj.classList.add("on");
            _self.show_dsearch_box(null, {
                "target": _mc["dsearch_box"],
                "act": "add",
                "class_name": "focus"
            })
        }
    };
    _self.close_sel_box = function(e, ElmObj) {
        if (ElmObj.classList.contains("on")) {
            ElmObj.classList.remove("on");
            _self.show_dsearch_box(null, {
                "target": _mc["dsearch_box"],
                "act": "remove",
                "class_name": "focus"
            })
        }
    };
    _self.transform_WinLoss_mode = function(this_data) {
        var out_data = Array();
        for (var key in this_data)
            if (this_data[key] != "")
                if (this_data[key] != 0)
                    out_data[key] = this_data[key] * -1;
                else
                    out_data[key] = this_data[key];
        else
            out_data[key] = this_data[key];
        return out_data
    };
    _self.chg_WL_mode = function(e, param) {
        if (showWinLoss_mode != param.chg_type) {
            for (var key in WL_mode_arr) {
                var this_type = WL_mode_arr[key];
                _mc["WL_mode_" + this_type].classList.remove("--on")
            }
            _mc["WL_mode_" + param.chg_type].classList.add("--on");
            showWinLoss_mode = param.chg_type;
            _self.getWinLoss()
        }
    }
	_self.show_banner = function() {
		var arr_create = [];
		arr_create.push("1");
		arr_create.push("4");
		var objid = ",div_entrance_banner,div_banner_show,div_banner_model,";
		var tmpObj = util.getObjAry(dom, objid);
		_mc = util.mergeArray(_mc, tmpObj);
		var click_set = {
			"banner_1": {
				"is_click": false
			},
			"banner_2": {
				"is_click": false
			},
			"banner_3": {
				"is_click": false
			},
			"banner_4": {
				"is_click": false,
			}
		};
		if (arr_create.length > 0) {
			var chk_ = _self.create_banner(_mc["div_banner_show"], _mc["div_banner_model"], arr_create, click_set);
			if (!chk_)
				_mc["div_entrance_banner"].style.display = "none"
		} else
			_mc["div_entrance_banner"].style.display = "none"
	}
	_self.create_banner = function(div_show, div_model, arr_create, click_set) {
		var chk_create = true;
		div_show.innerHTML = "";
		var model_html = div_model.innerHTML;
		var str_show = "";
		var create_num = 0;
		if (arr_create){
			for (var key in arr_create)
				if (arr_create[key] != "") {
					var this_html = model_html;
					this_html = this_html.replace(/\*BANNER_NUM\*/g, arr_create[key]);
					var use_id = "banner_" + arr_create[key];
					var calss_pointer = "";
					if (click_set[use_id])
						if (click_set[use_id]["is_click"])
							calss_pointer = "--pointer";
					this_html = this_html.replace(/\*BANNER_POINTER\*/g, calss_pointer);
					str_show += this_html;
					create_num++
				}
		}
		if (str_show != "") {
			div_show.innerHTML = str_show;
			AD.setParentclass(parentClass);
			var swiper_settings = new Object;
			swiper_settings["click_set"] = click_set;
			swiper_settings["multiple_flag"] = create_num <= 1 ? false : true;
			swiper_settings["autoplay_sec"] = 1E4;
			try {
				AD.setSwiper(swiper_settings)
			} catch (e) {
				util.echo("onError");
				return
			}
		} else{
			chk_create = false;
		}
		return chk_create
	}
	
};
