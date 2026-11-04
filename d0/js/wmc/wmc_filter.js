function wmc_filter(_win, _dom, _post){
    var _self = this;
    var classname = "report_filter";
    var cookie = new CookieManager();
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var util;
    var config_set;
    var LS;
    var LS_code;
    var eventHandler = new Object();
    var selectFun = new Object();
    var dateHash = new Object();
    var par = new Object();
    var selPar = new Object();
    var selObj = new Object();
    var nowMode ;
    var now_parObj = new Object();
    var myDate = new Date();
    selObj["result_type"] = new Array("Y","N");
    selObj["report_kind"] = new Array("D","D4");
    selObj["date"] = new Array("yes","to","tm","tw","lw","tp","lp");
    var _set = new Object();
    _set["gtype"] = ["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"];
    // _set["stake"] = {"mode":"PER","list":{"ALL":0,"FT":0,"BK":0,"TN":0,"VB":0,"BM":0,"TT":0,"BS":0,"SK":0,"OP":0,"FS":0}};
    _set["stake"] = ["ALL","PER"];
	_set["downline"] = "ALL";
	_set["market"] = ["ALL","rb","ft","fu"];
	_set["league"] = "ALL";
	_set["events"] = "ALL";
	_set["dates"] = myDate.toLocaleDateString().replace(/\//g,'-');

    var _param = new Object();
    var _paramName = new Object();


    _ModeDiv = ["title_mode","_setDiv","_titleView","_contantView","_viewClass","_dataShowDiv","_searchDiv","_searchItem","_chkClass"];
    _Mode  = new Object();
	_Mode["mode_1"]  = new Object();
	_Mode["mode_1"]["_config"]= {   //基本下拉樣式
		"mode":1,
		"info_mode":false,
		"title_mode":false,
		"_setDiv":null,
        "_titleView":null,
        "_titleName":"",
		"_contantView":null,
		"_viewClass":"active",
		"_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"],
		"_listSub":["ALL","Soccer","BK","TN","VB","BM","TT","BS","SK","OP","FS"],
        "_act":false,
        "_chkClass":'on',
        "_default":"ALL",
        "_setAllTitleName":"",
        "_setItemTitleName":""
    } ;
    _Mode["mode_2"]  = new Object();
    _Mode["mode_2"]["_config"]= {   //基本下拉樣式
		"mode":2,
		"info_mode":false,
		"title_mode":false,
		"_setDiv":null,
        "_titleView":null,
        "_titleName":"",
		"_contantView":null,
		"_viewClass":"active",
        "_group":["ALL,PER"],
		"_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"],//跟者html選項
        "_act":false,
        "_chkClass":'on',
        "_default":{
			"mode":"ALL", 	//跟者_group
			"listGold":{ 	//跟者_list
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
				"FS":0
            },
            "listItem":""
		}
    } ;

    _Mode["mode_3"]  = new Object();
	_Mode["mode_3"]["_config"]= {   // downline下現樣式 搜尋 複選筐
		"mode":3,
		"info_mode":false,
		"title_mode":false,
		"_setDiv":null,
        "_titleView":null,
        "_titleName":"",
		"_contantView":null,
		"_data":null, //1002: {id: "1002", alias: "stanNew", username: "stanNew"}
		"_viewClass":"active",
		"_default":"ALL",
        "_limitCount":5,
        "_limitCountAlertMsg":"", //超過選取項目出現的警告訊息
		"_searchOpen":true,
		"_searchItem":"downlineID_f",
		"_searchDiv":null,
		"_dataShowDiv":null,
		"_breakpoint":[
			{
				"div":null,
				"amount":0
			}
        ],
        "_setAllTitleName":""
	} ;

    _Mode["mode_4"]  = new Object();
	_Mode["mode_4"]["_config"]= {   // downline下現樣式 搜尋 複選筐
		"mode":4,
		"info_mode":false,
		"title_mode":false,
		"_setDiv":null,
        "_titleView":null,
        "_titleName":"",
		"_contantView":null,
		"_dataShowDiv":null,
		"_data":null, //4: {id: "4", leaguename: "Test"}
		"_viewClass":"active",
		"_chkClass":"on",
		"_act":false,
		"_default":"ALL",
		"_searchOpen":true,
		"_searchItem":"leagueID_f",
		"_searchDiv":null,
		"_breakpoint":[
				{
					"div":null,
					"amount":0
				}
        ],
        "_setAllTitleName":""
	} ;

    _self.init=function(){
        util.echo(classname+" load complete");
        for(var key in _Mode){
            var _config = _Mode[key]["_config"];
            _config._setDiv = dom.getElementById(key+"_dom");
            _config._titleView = dom.getElementById("f_title_small");
            _config._viewClass = "viewClass";

            if(key=="mode_2")_config._contantView = dom.getElementById(key+"_dom");
            else _config._contantView = dom.getElementById(key+"_sel");

            if(key=="mode_3"|| key=="mode_4"){
                var breakpoint = _config._breakpoint;
                for(var i=0;i<breakpoint.length;i++){
                    breakpoint[i]["div"] = dom.getElementById(key + "_point"+(i+1));
                }
                _config._dataShowDiv = dom.getElementById(key+"_show");
                _config._searchDiv = dom.getElementById(key+"_search");
            }

        }

        util.addEvent(dom.getElementById("f_back_btn"), "click", _self.backEvent);
        util.addEvent(dom.getElementById("f_cancel_btn"), "click", _self.backEvent);
        util.addEvent(dom.getElementById("f_chk_btn"), "click", _self.chkEvent);
        util.addEvent(dom.getElementById("f_ok_btn"), "click", _self.hideAlertMsg);
        _self.sizeChange();

        // util.addEvent(dom.getElementById("f_search_btn"), "click", _self.filterSubmit);
        // _self.initSelectFun();
        // _self.setSelectEvent();

        // _self.setSearchSel(dom.getElementById("f_wtype_div"), { "_focus": dom.getElementById("f_wtype_div_sel"), "_setView": dom.getElementById("f_wtype_div"), "_viewClass": "active" });

        // util.addEvent(dom.getElementById("f_wtype_div_600"), "change", _self.selChgEvent, { "rtype": "wtype" });
        // util.addEvent(dom.getElementById("f_allULWtype"), "click", _self.serchSelEvent, { "className": "active" });
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        config_set = parentClass.getThis("config_set");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.getParentThis=function(varible){
        return parentClass.getThis(varible);
    }

    _self.initSelectFun=function(){
        selectFun["result_type"] = _self.chgSel;
        selectFun["report_kind"] = _self.chgSel;
        selectFun["date"] = _self.chgDate;
        selectFun["gtype"] = _self.chgSel;
        selectFun["wtype"] = _self.chgSel;
    }

    _self.initCalendar=function(){
        _self.setCalendar(dateHash, "start");
        _self.setCalendar(dateHash, "end");
    }

    _self.setSelectEvent=function(){
        for(var rtype in selObj){
            var ary = selObj[rtype];
            if (rtype != "report_kind") {
                var rDiv = dom.getElementById("f_" + rtype + "_div");
                var rSel = dom.getElementById("f_" + rtype + "_sel");
                util.setInfEvent(rDiv, { "_focus": rSel, "_setView": rDiv, "_viewClass": "active" });

                var rDom_600 = dom.getElementById("f_" + rtype + "_div_600");
                util.addEvent(rDom_600, "change", _self.selChgEvent, { "rtype": rtype });
            }

            for (var i = 0; i < ary.length; i++) {
                var type = ary[i];
                var targetDom = dom.getElementById("f_" + rtype + "_" + type);
                if (rtype != "report_kind") {
                    util.addEvent(targetDom, "click", selectFun[rtype], { "rtype": rtype, "type": type });
                } else {
                    util.addEvent(targetDom, "click", selectFun[rtype], { "rtype": rtype, "type": type });
                }
            }

        }
    }

    _self.setCalendar=function(dateHash, _name){

        var sPar = new Object();
        sPar.div = dom.getElementById("f_div_date");
        sPar.input = dom.getElementById("f_input_"+_name);
        sPar.photo = dom.getElementById("f_photo_"+_name);
        sPar.def_date = par["date_"+_name];
        sPar.langx = top.langx;
        sPar.CalendarClass = win.ClassFankCal_ag;
        sPar.period_ls = dateHash.period_ls;
        sPar.WEB_TIME_ZONE = dateHash.WEB_TIME_ZONE;

        var sDate = new win.calendar_ag(win,dom);
        sDate.setParentclass(_self);
        sDate.setName(_name);
        sDate.init(sPar);
    }

    _self.initFilter=function(param){
        // console.log("initFilter",param);
        if(dom.getElementById("loading_filter_s")) dom.getElementById("loading_filter_s").style.display = "none";
        var mode = param.mode;
        var rtype = param.rtype;
        var defaultMode = _Mode["mode_"+mode]["_config"];
        var tmpObj = new Object();
        for(var key in defaultMode){
            if(_ModeDiv.indexOf(key)!= -1)tmpObj[key] = defaultMode[key];
            else{
                if(typeof param[key]!=='undefined')    tmpObj[key] = param[key];
                else{
                    tmpObj[key] = defaultMode[key];
                }
            }
        }

        if(mode==2 && tmpObj["_default"]["mode"]=="SIN"){
            tmpObj["_setDiv"] = dom.getElementById("mode_2_5_dom");
            tmpObj["_contantView"] = dom.getElementById("mode_2_5_dom");
            tmpObj["_subMode"] = 5;
        }


        now_parObj[rtype] = tmpObj;
        _param[rtype] = new Object();
        _paramName[rtype] = new Object();
        nowMode = rtype;
        _self.initDiv(now_parObj);
        return;
        if(type=="gtype" || type=="market"){
            var type_sel = dom.getElementById("f_"+type+"_sel");
            for(var i=0;i<type_sel.children.length;i++){
                util.addEvent(type_sel.children[i], "click", _self.typeChgSel, { "list":type_sel,"rtype": type, "target":type_sel.children[i] ,"_viewClass": "on" });
            }

            var num = _set[type].indexOf(_default);
            if(num!=-1){
                var defautitem =type_sel.getElementsByTagName("li")[num];
                defautitem.click();
            }else{
                var defautitem =type_sel.getElementsByTagName("li")[0];
                defautitem.click();
            }

        }

        if(type=="stake"){
            var type_dom = dom.getElementById("f_"+type+"_dom");
            var inputALL =  type_dom.getElementsByTagName("input");
            var allRadio = [];
            for(var i=0; i<inputALL.length;i++){
                if(inputALL[i].type=="radio"){
                    util.addEvent(inputALL[i], "change", _self.typeChgRadioSel, { "list":type_dom,"rtype": type, "target":inputALL[i],"name":inputALL[i].name ,"_viewClass": "wmc_stake_checked" });
                }

                if(inputALL[i].type=="text"){
                    util.ChkKeyCash(inputALL[i], { initShow: null, onErr: null, onSuc: null });
                }

            }

            var num = _set[type].indexOf(_default["mode"]);
            var preitem = _default["list"];
            var tmpObj = new Object();
            for(var sub in preitem){
                if(preitem[sub]*1 > 0) tmpObj[sub] = (preitem[sub])*1/1;
                else  tmpObj[sub]=0;

                dom.getElementById(sub+"_input_f").value = tmpObj[sub]*1;
            }

            for(var i=0;i<type_dom.children.length;i++){

                util.classFunc(type_dom.children[i], "wmc_stake_checked", "remove");
            }
            util.classFunc(type_dom.children[num], "wmc_stake_checked");


        }

        if(type=="downline"){
            var type_dom = dom.getElementById("f_"+type+"_dom");
            var downline_show = document.getElementById("f_downline_show");
            var downline_header = document.getElementById("xmp_f_downline_header").innerHTML;
            var downline = data[type];
            outStr = downline_header;
            for(var prop in downline){
                xmp_tmp = document.getElementById("xmp_f_downline_contant").innerHTML;
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*USERID\\\*", "gi"), downline[prop].id);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*USERNAME\\\*", "gi"), downline[prop].username);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*NAME\\\*", "gi"), downline[prop].alias);
                outStr+=xmp_tmp;
            }
            downline_show.innerHTML = outStr;


            var allCheckBox =  type_dom.getElementsByTagName("input");
            for(var i=0;i<allCheckBox.length;i++){
                if(allCheckBox[i].type=="checkbox"){
                    util.addEvent(allCheckBox[i], "click", _self.chgcheckBox, { "id":allCheckBox[i].id,"name":allCheckBox[i].name,"rtype": type,"title":null});
                }else if(allCheckBox[i].type=="text"){
                    util.addEvent(allCheckBox[i], "input", _self.searchItem, { "target":allCheckBox[i],"item":"checkboxSinF" });
                }
            }
        }

        if(type=="league"){
            var type_dom = dom.getElementById("f_"+type+"_dom");
            var league_header = document.getElementById("xmp_f_league_header").innerHTML;
            var league_show = document.getElementById("f_league_show");
            var league_part = document.getElementById("xmp_f_league_contant_part").innerHTML;

            var league = data[type];

            outStr = league_header;
            for(var prop in league){
                xmp_tmp = document.getElementById("xmp_f_league_contant_popular").innerHTML;
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*LID\\\*", "gi"), league[prop].id);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*LEAGUENAME\\\*", "gi"), league[prop].leaguename);
                outStr+=xmp_tmp;
            }
            outStr += league_part;
            for(var prop in league){
                xmp_tmp = document.getElementById("xmp_f_league_contant_az").innerHTML;
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*LID\\\*", "gi"), league[prop].id);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*LEAGUENAME\\\*", "gi"), league[prop].leaguename);
                outStr+=xmp_tmp;
            }
            league_show.innerHTML = outStr;

            var searchItem = "leagueItemF";;
            var sign = "flz";
            var allBox =  type_dom.getElementsByTagName("input");

            for(var i=0;i<allBox.length;i++){
                if(allBox[i].type=="text"){
                    util.addEvent(allBox[i], "input", _self.searchItem, { "target":allBox[i],"item":searchItem });
                }
                if(allBox[i].type=="button"){
                    var searchText = type_dom.getElementsByTagName("input");
                    util.addEvent(allBox[i], "click", _self.clearSearch, { "target":searchText[0],"item":searchItem});
                }
            }
            var type_sel =  dom.getElementById("f_"+type+"_show");
            var all = type_dom.getElementsByTagName("li");
            for(var i=0;i<all.length;i++){

                if(all[i].children[0]) util.addEvent(type_sel.children[i], "click", _self.typeChgSel, { "list":type_sel,"rtype": type, "target":type_sel.children[i] ,"_viewClass": "on" });

            }


            // if( _set[key]["_config"].title_mode){
            //     _self.setlistClick(key,contant,_set[key]["_config"]["_title"]);
            // }
            // if(defaultValue!=""){
            //     var defaulIdItem = dom.getElementById(sign+"_"+defaultValue);
            //     if(defaulIdItem)defaulIdItem.click();
            // }

        }

        if( type=="events"){
            var type_dom = dom.getElementById("f_"+type+"_dom");
            var events_show = document.getElementById("f_events_show");
		    var events_header = document.getElementById("xmp_f_events_header").innerHTML;
            var team = data["team"];
            outStr = events_header;
            for(var prop in team){
                xmp_tmp = document.getElementById("xmp_f_events_contant").innerHTML;
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*EID\\\*", "gi"), team[prop].id);
                xmp_tmp = xmp_tmp.replace(new RegExp("\\\*EVENTNAME\\\*", "gi"), team[prop].teams);
                outStr+=xmp_tmp;
            }
            events_show.innerHTML = outStr;

            var searchItem = "eventsItemF";;
            var sign = "fe";
            var allBox =  type_dom.getElementsByTagName("input");

            for(var i=0;i<allBox.length;i++){
                if(allBox[i].type=="text"){
                    util.addEvent(allBox[i], "input", _self.searchItem, { "target":allBox[i],"item":searchItem });
                }
                if(allBox[i].type=="button"){
                    var searchText = type_dom.getElementsByTagName("input");
                    util.addEvent(allBox[i], "click", _self.clearSearch, { "target":searchText[0],"item":searchItem});
                }
            }
            var type_sel =  dom.getElementById("f_"+type+"_show");
            var all = type_dom.getElementsByTagName("li");
            for(var i=0;i<all.length;i++){

                if(all[i].children[0]) util.addEvent(type_sel.children[i], "click", _self.typeChgSel, { "list":type_sel,"rtype": type, "target":type_sel.children[i] ,"_viewClass": "on" });

            }

        }




        return;

    }



    _self.initDiv = function(nowParObj){
		for(var key in nowParObj){
            if(!key || !nowParObj[key]) return;
            var icon = nowParObj[key]["_setDiv"];
			var contant = nowParObj[key]["_contantView"];
			var list = nowParObj[key]["_list"];
			var defaultValue =  nowParObj[key]["_default"];
			var mode = nowParObj[key]["mode"];
			var viewClass = nowParObj[key]["_viewClass"];
            var titleView =  nowParObj[key]["_titleView"];
            var setAllTitleName =  nowParObj[key]["_setAllTitleName"];

			if(mode==1){
				var frag = dom.createDocumentFragment();
				for(var item in list){
					var sample = contant.children[0].cloneNode(true);
					sample.id = key+"_"+list[item]+"_f";
					sample.value = list[item];
					sample.children[0].innerHTML = nowParObj[key]["_listSub"][item];
					frag.appendChild(sample);
				}
				while(contant.firstChild){
					contant.removeChild(contant.firstChild);
				}

				contant.appendChild(frag);
				_self.setlistClick(mode,contant,titleView,key,list,nowParObj[key]["_chkClass"],nowParObj[key].title_mode,setAllTitleName);
				var num = list.indexOf(defaultValue);
				if(num!=-1){
					var defautitem =contant.getElementsByTagName("li")[num];
					defautitem.click();
				}else{
					var defautitem =contant.getElementsByTagName("li")[0];
					defautitem.click();
                }

			}else if(mode==2){
				var allGroupDIv = contant.children;
				var allInput = contant.getElementsByTagName("Input");
                var group =  nowParObj[key]["_group"];

				for(var i=0;i<allGroupDIv.length;i++){
					util.addEvent(allGroupDIv[i], "change", _self.chgRatio, {
						"rtype": key, "group": group[i] ,"_viewClass": "wmc_stake_checked" ,
						"mode":mode,
						"allGroupDIv":allGroupDIv,
						"titleView":titleView,
						"titleMode":nowParObj[key]["title_mode"],
						"allInput":allInput,
						"now":i
						});
				}
				// for(var i=0;i<allInput.length;i++){
				// 	if(allInput[i].type=="text"){
                //         // util.ChkKeyCash(allInput[i], { initShow: null, onErr: null, onSuc: null });
                //         util.addEvent(allInput[i], "input", _self.keep_credit,{"target":allInput[i]});
				// 	}
                // }
                var id_str=",";
                for(var i=0;i<list.length;i++){
                    id_str+=list[i]+"_input_f,";
                }
                var obj_ids =  util.getObjAry(contant,id_str);
                for(var key_sub in  obj_ids){
                    if(obj_ids[key_sub]){
                        util.addEvent(obj_ids[key_sub], "input", _self.keep_credit,{"target":obj_ids[key_sub]});
                    }
                }

                var num = group.indexOf(defaultValue["mode"]);
                var preitem = defaultValue["listGold"];
                var listItem = defaultValue["listItem"];
                if(num*1 !=-1){
                    var tmpObj = new Object();
                    for(var sub in preitem){
                        if(preitem[sub]*1 > 0) tmpObj[sub] = (preitem[sub])*1/1;
                        else  tmpObj[sub]=0;
                        dom.getElementById(sub+"_input_f").value = tmpObj[sub]*1;
                    }
                    _param[key]["listGold"] = tmpObj;
                    _param[key]["listItem"] = listItem;

                    _self.chgRatio(null,{
                        "rtype": key, "group": group[num] ,"_viewClass": "wmc_stake_checked" ,
                        "mode":mode,
                        "allGroupDIv":allGroupDIv,
                        "titleView":titleView,
                        "titleMode":nowParObj[key]["title_mode"],
                        "allInput":allInput,
                        "now":num
                    });
                }else{
                    if(preitem[listItem]*1 > 0){
                        dom.getElementById("SIN_input_f").value = preitem[listItem]*1;
                    }else{
                        dom.getElementById("SIN_input_f").value = 0;
                    }
                    util.addEvent(dom.getElementById("SIN_input_f"), "input", _self.keep_credit,{"target":dom.getElementById("SIN_input_f")});


                }



			}else if(mode==3){
                var data =  nowParObj[key]["_data"];
				var dataShow =  nowParObj[key]["_dataShowDiv"];
				var searchItem =  nowParObj[key]["_searchItem"];
				var frag = dom.createDocumentFragment();
				var searchOpen  = nowParObj[key]["_searchOpen"];
				var searchDiv  = nowParObj[key]["_searchDiv"];
                var limitCount = nowParObj[key]["_limitCount"];
				var title_mode = nowParObj[key]["title_mode"];
                var breakpoint = nowParObj[key]["_breakpoint"];
                var setAllTitleName = nowParObj[key]["_setAllTitleName"];
                var setItemTitleName = nowParObj[key]["_setItemTitleName"];
                // var limitCountAlertMsg = now_parObj[key]["_limitCountAlertMsg"];
                var limitCountAlertMsg =  LS.get("filter_err_"+key+"_max");
				var now_count = 0;
				var point_count = 0;

				for(var prop in data){
					var id = data[prop]["id"];
					var alias = data[prop]["alias"];
					var username = data[prop]["username"];
					var sample = dataShow.children[0].cloneNode(true);
					var label = sample.getElementsByTagName("label")[0];
					var input = sample.getElementsByTagName("input")[0];
					var txt = label.getElementsByTagName("tt")[0];
					input.name = searchItem;
					input.value = username;
					txt.className = "wmc_search_chkTxt";
					txt.innerHTML = username+"<br><tt class='word_gray'>"+alias+"</tt>";
					sample.id=key+"_"+id+"_f";

					if(breakpoint[point_count]){
						if(now_count*1 == breakpoint[point_count].amount*1 || id=="00000"){
							frag.appendChild(breakpoint[point_count].div);
							breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
							point_count++;
						}
					}
                    if(id=="00000") continue;
					frag.appendChild(sample);
					now_count++;
                }
				for(var i=point_count;i< breakpoint.length;i++){
					frag.appendChild(breakpoint[i].div);
					breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
					// breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);

				}

				// dataShow.removeChild(dataShow.children[(dataShow.children.length)*1-1]);
				while(dataShow.children[0] != dataShow.children[dataShow.children.length*1-1]){
					dataShow.removeChild(dataShow.children[(dataShow.children.length)*1-1]);
				}
				dataShow.appendChild(frag);
				var allTagLi =  dataShow.getElementsByTagName("li");
				var searchItemDiv = dataShow;
				var status="";
				for(var i=0;i<allTagLi.length;i++){
					if(allTagLi[i].children.length>0){
						var checkBox = allTagLi[i].getElementsByTagName("input")[0];
						(allTagLi[i].id)? status="single" :status="ALL";
						util.addEvent(checkBox, "click", _self.chgcheckBox, {
							"id":allTagLi[i].id,
							"status":status,
							"rtype": key,
							"title":titleView,
							"searchItem":searchItem,
							"searchDiv":searchItemDiv,
							"limitCount":limitCount,
                            "titleMode":title_mode,
                            "setAllTitleName":setAllTitleName,
                            "setItemTitleName":setItemTitleName
							}
						);
					}
				}
				if(searchOpen){
                    var text = searchDiv.getElementsByTagName("input")[0];
                    var clearBtn = searchDiv.getElementsByTagName("input")[1];
                    util.addEvent(text, "input", _self.searchItem, { "target":text,"item":searchItem });
                    util.addEvent(clearBtn, "click", _self.clearSearch, { "target":text,"item":searchItem});
				}else{
					searchDiv.style.display="none";
				}

                if( typeof limitCountAlertMsg !== 'undefined' && limitCountAlertMsg!=""){
                    now_parObj[key]["_limitCountAlertMsg"] = limitCountAlertMsg.replace(new RegExp("\\\*LIMITCOUNT\\\*", "gi"), limitCount);
                }

				if(defaultValue=="ALL"){
					dataShow.getElementsByTagName("input")[0].click();
				}else if(defaultValue!=""){
					var downlineIdAry = defaultValue.split(",");
					for(var i =0;i<downlineIdAry.length;i++){
                        var downlineIdItem = dom.getElementById(key+"_"+downlineIdAry[i]+"_f");
                        if(downlineIdItem)downlineIdItem.getElementsByTagName("input")[0].click();
                        else dataShow.getElementsByTagName("input")[0].click();
					}
				}

			}else if(mode==4){
				var data =  nowParObj[key]["_data"];
				var dataShow =  nowParObj[key]["_dataShowDiv"];
				var searchItem =  nowParObj[key]["_searchItem"];
				var frag = dom.createDocumentFragment();
				var searchOpen  = nowParObj[key]["_searchOpen"];
				var searchDiv  = nowParObj[key]["_searchDiv"];
				var limitCount = nowParObj[key]["_limitCount"];
                var breakpoint = nowParObj[key]["_breakpoint"];
                var setAllTitleName = nowParObj[key]["_setAllTitleName"];

				var now_count = 0;
				var point_count = 0;

				for(var prop in data){

					var id = data[prop]["id"];
					var name = data[prop]["name"];

					var sample = dataShow.children[0].cloneNode(true);
					sample.id = key+"_"+id+"_f";
					sample.children[0].setAttribute("name",searchItem);
					sample.children[0].innerHTML =  name;


					if(breakpoint[point_count]){
						if(now_count*1 == breakpoint[point_count].amount*1 || id=="00000"){
							frag.appendChild(breakpoint[point_count].div);
							breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
							point_count++;
						}
					}
					if(id=="00000") continue;
					frag.appendChild(sample);
					now_count++;

				}
				for(var i=point_count;i< breakpoint.length;i++){
					frag.appendChild(breakpoint[i].div);
					breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);

				}

				while(dataShow.children[0] != dataShow.children[dataShow.children.length*1-1]){
					dataShow.removeChild(dataShow.children[(dataShow.children.length)*1-1]);
				}
				dataShow.children[0].id = key+"_ALL"+"_f";
				dataShow.appendChild(frag);


				if(searchOpen){ //收尋框框
					var text = searchDiv.getElementsByTagName("input")[0];
					var clearBtn = searchDiv.getElementsByTagName("input")[1];
					util.addEvent(text, "input", _self.searchItem, { "target":text,"item":searchItem });
					util.addEvent(clearBtn, "click", _self.clearSearch, { "target":text,"item":searchItem});

				}else{
					searchDiv.style.display="none";
				}

				_self.setlistClick(mode,dataShow,titleView,key,null,nowParObj[key]["_chkClass"],nowParObj[key].title_mode,setAllTitleName);


				if(defaultValue=="ALL"){
					dataShow.getElementsByTagName("li")[0].click();
				}else if(defaultValue!=""){
					var downlineIdAry = defaultValue.split(",");
					for(var i =0;i<downlineIdAry.length;i++){
						var downlineIdItem = dom.getElementById(key+"_"+downlineIdAry[i]+"_f");
                        if(downlineIdItem)downlineIdItem.click();
                        else dataShow.getElementsByTagName("li")[0].click();
					}
				}

			}
			// util.addEvent(icon, "click", _self.showInfEventTEST, { "icon": icon, "param":{ "_focus":contant, "_setView": icon, "_viewClass":viewClass,"info_mode":now_parObj[key]["info_mode"],"rtype":key,"mode":mode }   });
            icon.style.display="";
            titleView.innerHTML  = nowParObj[key]["_titleName"];
        }
        // dom.getElementById("loading_filter_s").style.display = "none";
        _self.showLoading({ "showLoading": false });
	}



    _self.clearSearch = function(e,_par){
		var target = _par.target;
		var itemName = _par.item;
		target.value="";
		_self.searchItem(e,{"target":target,"item":itemName});

	}

	_self.searchItem = function(e,_par){
		var target = _par.target;
		var itemName = _par.item;
        var item = dom.getElementsByName(itemName);
		var reg = new RegExp("" + target.value + "","i");
		for(var i=0;i<item.length;i++){
			var value = item[i].value;
			var text = (item[i].innerText);
			var searchMain = (value)? value:text;
			if(searchMain.match(reg) == null)item[i].parentNode.style.display="none";
			else item[i].parentNode.style.display="";

		}
	}


	_self.chgcheckBox = function(e,_par){
		// "list":list,"rtype": key

		// "id":allTagLi[i].id,
		// "name":checkBox.name,
		// "rtype": key,
		// "title":titleView,
		// "searchItem":searchItem

		var status = _par.status;
		var rtype = _par.rtype;
		var id = _par.id;
		var title = _par.title;
		var searchItem = _par.searchItem;
		var searchDiv = _par.searchDiv;
		var limitCount = _par.limitCount;
		var titleMode = _par.titleMode;
        var setAllTitleName = _par.setAllTitleName;
        var setItemTitleName = _par.setItemTitleName;;
		var all_single = dom.getElementsByName(searchItem);
        var downlineStatus="NONE";
        var downlineName;
		var count=0;
        var allcheck = searchDiv.getElementsByTagName("input")[0];
		if(status=="ALL"){
			for(var i=0;i<all_single.length;i++){
				if(allcheck.checked==true){
					all_single[i].checked = true;
                    all_single[i].disabled = true;
                    util.classFunc(all_single[i].parentNode.parentNode, "disabled");
					downlineStatus="ALL";
				}else{
					all_single[i].checked= false;
                    all_single[i].disabled =false;
                    util.classFunc(all_single[i].parentNode.parentNode, "disabled","remove");
					downlineStatus="ALL";
				}
			}
		}else{
			var single = dom.getElementById(id);
			var single_checkbox = single.getElementsByTagName("input")[0];
			var tmpAry=[];
				for(var i=0;i<all_single.length;i++){
					all_single[i].disabled =false;
					if(all_single[i].checked==true){
						tmpAry.push(all_single[i].parentNode.parentNode.id.split("_")[1]);
						count++;
					}
				}

                /* 原本是超過不要給點 現在要出現阻黨視窗
				if(count>limitCount &&  limitCount*1!=0){
					for(var i=0;i<all_single.length;i++){
						if(all_single[i].checked==false){
							all_single[i].disabled =true;
						}
					}
                }
                */

				if(count>limitCount && limitCount*1!=0){
					tmpAry = tmpAry.filter(function(value){
						return value != _par.id.split("_")[1];
					});
                    single_checkbox.checked=false;
                    if(now_parObj[rtype]["_limitCountAlertMsg"]!=""){
                        _self.showErrorMsg("limitCount",now_parObj[rtype]["_limitCountAlertMsg"]);
                    }
				}

				if(tmpAry.length>0)	downlineStatus=tmpAry.join(",");
				if(tmpAry.length == all_single.length){
                    // allcheck.checked=true; //全部勾選不要勾all
                    // downlineStatus="ALL";
                }else{
                    allcheck.checked=false;
                }



        }




            // title.innerHTML = downlineName;
            if(downlineStatus=="ALL" || downlineStatus=="NONE"){
                if(setAllTitleName!=""){
                    // title.innerHTML=setAllTitleName;
                    downlineName = setAllTitleName;
                }else{
                    var li_all =  searchDiv.getElementsByTagName("li")[0];
                    // title.innerHTML=li_all.getElementsByTagName("tt")[0].innerHTML;
                    downlineName =  li_all.getElementsByTagName("tt")[0].innerHTML;
                }
            }else{
                // title.innerHTML=count;
                downlineName = tmpAry.length;
                // title.innerHTML=setItemTitleName+ " ("+count+")";

            }

            if(titleMode){
                title.innerHTML=downlineName;
            }
        if(downlineStatus=="NONE")downlineStatus="ALL";
        _param[rtype]=downlineStatus;
        _paramName[rtype] = downlineName;
		_self.dispatchEvent("autoBackParam",_param);
	}

	_self.setlistClick = function(mode,contant,titleView,nowRtype,list,chkClass,titleMode,setAllTitleName){
		var contant = contant;
		var mode = mode ;
		var all = contant.getElementsByTagName("li");
		if(mode==1){
			for(var i =0;i<all.length;i++){
				var tmpObj = new Object();
				tmpObj["target"] = titleView;
				tmpObj["mode"] = mode;
				tmpObj["sel_dom"] = all[i];
                tmpObj["value"] = list[i];
				tmpObj["nowRtype"] = nowRtype;
				tmpObj["chkClass"] = chkClass;
				tmpObj["all"] = all;
				tmpObj["sel"] = all[i];
                tmpObj["titleMode"] = titleMode;
                if(i==0 && setAllTitleName!=""){
                    tmpObj["setAllTitleName"] = setAllTitleName;
                    tmpObj["name"] = setAllTitleName;
                }else{
                    tmpObj["setAllTitleName"] = "";
                    tmpObj["name"] = all[i].children[0].innerHTML;
                }
				util.addEvent(all[i],"click",_self.chgInfTitleTEST,tmpObj)
			}
		}else if(mode ==4){
			for(var i =0;i<all.length;i++){
				if(all[i].children[0]){
					var tmpObj = new Object();
					tmpObj["target"] = titleView;
					tmpObj["mode"] = mode;
					tmpObj["sel_dom"] = all[i].children[0];
                    tmpObj["value"] = all[i].id.split("_")[1];
					tmpObj["nowRtype"] = nowRtype;
					tmpObj["chkClass"] = chkClass;
					tmpObj["all"] = all;
                    tmpObj["sel"] = all[i];
                    tmpObj["titleMode"] = titleMode;
                    if(i==0 && setAllTitleName!=""){
                        tmpObj["setAllTitleName"] = setAllTitleName;
                        tmpObj["name"] = setAllTitleName;
                    }else{
                        tmpObj["setAllTitleName"] = "";
                        tmpObj["name"] = all[i].children[0].innerHTML;
                    }
					util.addEvent(all[i],"click",_self.chgInfTitleTEST,tmpObj)

				}
			}
		}
	}

    _self.chgInfTitleTEST = function(e,_par){

		var target = _par.target;
		var self_dom = _par.sel_dom;
		var mode = _par.mode;
		var value = _par.value;
		var nowRtype = _par.nowRtype;
		var chkClass = _par.chkClass;
		var all = _par.all;
        var sel = _par.sel;
        var name = _par.name;
		var titleMode = _par.titleMode;
        var setAllTitleName = _par.setAllTitleName;

		for(var i=0;i<all.length;i++){
			util.classFunc(all[i], chkClass, "remove");
		}
		util.classFunc(sel, chkClass);
		if(titleMode){
            // target.innerHTML = self_dom.innerHTML;
            if(setAllTitleName!="") target.innerHTML = setAllTitleName;
            else target.innerHTML = self_dom.innerHTML;
		}
        _param[nowRtype] = value;
        _paramName[nowRtype] = name;
		_self.dispatchEvent("autoBackParam",_param);
	}


    _self.typeChgSel = function(e,_par){
        var list = _par.list;
        var rtype = _par.rtype;
        var _default = _par._default;
        var _viewClass = _par._viewClass;
        var target = _par.target;
        var saveVaule;
        var saveTitle;
        // for(var i=0;i<type_dom.children.length;i++){
        //     util.classFunc(type_dom.children[i], _viewClass, "remove");
        // }
        // util.classFunc(target, _viewClass);

        var all = list.getElementsByTagName("li");
        if(rtype=="gtype" ||rtype=="market"){
			for(var i =0;i<all.length;i++){
                util.classFunc(all[i], _viewClass, "remove");
            }
            saveVaule =target.id.split("_")[2];
            saveTitle =target.children[0].innerHTML;

        }else if(rtype=="league" || rtype=="events" || rtype=="dates"){
			for(var i =0;i<all.length;i++){
				if(all[i].children[0]){
                    util.classFunc(all[i], _viewClass, "remove");
				}
            }

            saveVaule =target.children[0].id.split("_")[1];
            saveTitle =target.children[0].innerHTML;
		}
        util.classFunc(target, _viewClass);

        _param[rtype]["value"] =saveVaule;
        _param[rtype]["title"] =saveTitle;
    }

	_self.typeChgRadioSel = function(e,_par){
        var type_dom = _par.list;
        var rtype = _par.rtype;
        var _default = _par._default;
        var _viewClass = _par._viewClass;
        var target = _par.target;
        var name = _par.name;
        var radioAll =  dom.getElementsByName(name);

        for(var i=0;i<type_dom.children.length;i++){
            util.classFunc(type_dom.children[i], _viewClass, "remove");
        }
        util.classFunc(target.parentNode.parentNode, _viewClass);
        // _param[nowMode] = target.value;
        _param[rtype]["mode"] = target.value;
        _param[rtype]["title"] =target.value;
	}

    _self.setPageName=function(param){
        var pageType = "";
        if(param["report_kind"]!="A"){
            pageType = "cancel";
        }else{
            pageType = (param["result_type"]=="Y")? "set":"un";
        }
        dom.getElementById("title_name").innerHTML = LS.get("page_"+pageType);
    }

    _self.selChgEvent = function (e, param) {
        param.type = e.target.value;
        if (param.rtype == "date") {
            _self.chgDate(e, param);
        } else if(param.rtype=="result_type"){
            if( e.target.value=="D" || e.target.value=="D4"){
                param.rtype = "report_kind";
            }
            _self.chgSel(e, param);
        } else {
            _self.chgSel(e, param);
        }
    }

    _self.chgSel=function(e, param){
        var rtype = param.rtype;
        var type = param.type;

        // if(rtype!="date"){
            selPar[rtype] = type;
            if(rtype=="report_kind"){

                selPar["result_type"] = "Y";

            }else if(rtype=="result_type"){

                selPar["report_kind"] = "A";

            }


        var tmpRtype = (rtype=="report_kind")? "result_type":rtype;

        try{
            dom.getElementById("f_"+tmpRtype+"_now").innerHTML = dom.getElementById("f_"+rtype+"_"+type).innerHTML;
        }catch(e){
            util.err("[chgSel]"+"f_"+rtype+"_"+type, e);
        }

        try{
            dom.getElementById("f_" + tmpRtype + "_div_600").value = type;
        } catch (e) {
            util.err("[chgSel]" + "f_" + tmpRtype + "_div_600" + type, e);
        }
    }

	_self.chgRatio = function(e,_par){
		var rtype = _par.rtype;
		var group = _par.group;
		var now = _par.now;
		var titleView = _par.titleView;
		var titleMode = _par.titleMode;
		var allInput = _par.allInput;
		var allGroupDIv = _par.allGroupDIv;
		var className = _par._viewClass;
        var allValue =0;
        var id_str;
        var obj_ids;
        var contant = now_parObj[rtype]["_contantView"];

        util.classFunc(allGroupDIv[now], className);
        for (var i=0;i<allGroupDIv.length;i++) {
            util.classFunc(allGroupDIv[i], className, "remove");
            allGroupDIv[i].children[0].children[0].checked=false;
        }
        util.classFunc(allGroupDIv[now], className);
        allGroupDIv[now].children[0].children[0].checked=true;

        for(var i=0;i<allInput.length;i++){
            if(allInput[i].type=="radio"){
                allInput[i].disabled = false;
            }else{
                allInput[i].disabled = true;
            }
        }

        if(group=="ALL"){
            id_str=","+group+"_input_f,";
            obj_ids =  util.getObjAry(contant,id_str);
            for(var key_sub in  obj_ids){
                if(obj_ids[key_sub]){
                    obj_ids[key_sub].disabled = false;
                }
            }
        }else{
            id_str=",";
            for(var i=0;i<now_parObj[rtype]["_list"].length;i++){
                if(now_parObj[rtype]["_list"][i]!="ALL")id_str+=now_parObj[rtype]["_list"][i]+"_input_f,";
            }

            obj_ids =  util.getObjAry(contant,id_str);
            for(var key_sub in  obj_ids){
                if(obj_ids[key_sub]){
                    obj_ids[key_sub].disabled = false;
                }
            }
        }
		if(titleMode){
			if(group=="ALL"){
				// for(var i=0;i<allInput.length;i++){
				// 	if(allInput[i].type=="text" && allInput[i].id == group+"_input"){
				// 		allValue = allInput[i].value;
				// 		break;
				// 	}
                // }
                for(var key_sub in  obj_ids){
                    if(obj_ids[key_sub]){
                        allValue = obj_ids[key_sub].value;
                    }
                }
				titleView.style.display="";
                // titleView.innerHTML = "> "+ allValue*1;
                titleView.innerHTML = LS.get("filter_more")+" "+ allValue*1;
			}else{
				titleView.style.display="none";
                // titleView.innerHTML = "> 0";
                titleView.innerHTML = LS.get("filter_more")+" " + allInput[i].value*1;
			}
		}
		_param[rtype]["mode"] = group;
		_self.dispatchEvent("autoBackParam",_param);
	}

    _self.getData=function(){
        var str = "";
        str+=top.param;
        str+="&p=get_report_summary";
        str+="&type=summary";

        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"), "filterFrame");
        hr.setParentclass(_self);
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _self.LoadComplete);
        hr.loadURL(top.url, "POST", str);
    }

    _self.onError=function(){

    }

    _self.LoadComplete=function(json){
        var hash;
        try{
            hash = JSON.parse(json);
            if(util.chkErrorMsg(hash,LS_code)) return;
        }catch(e){
            util.err("["+classname+"]", e);
            return;
        }

        dateHash = hash["period"];
        _self.initCalendar();
    }

    _self.choseDateEvent=function(param){
        selPar["date_"+param.name] = param.date;
    }

    _self.filterSubmit=function(e, param){
        cookie.del("isclick");//清上色的cookie
        _self.checkReport(_self.filter_submit);
    }

    _self.dateFormat=function(d){
        return d.replace(/ /g, "");
    }

    _self.showDate=function(d){
        var date = d;
        date = date.replace(/ /g, "");
        date = date.replace(/-/g, " - ");
        return date;
    }

    _self.filter_submit=function(param){
        parentClass.dispatchEvent("changeFilter", param);
    }


    _self.checkReport=function(retFun){

        var str = "";
        str+=top.param;
        str+="&p=check_report";
        str+="&date_start="+_self.dateFormat(dom.getElementById("f_input_start").value);
        str+="&date_end="+_self.dateFormat(dom.getElementById("f_input_end").value);
        str+="&result_type="+selPar["result_type"];
        str+="&report_kind="+selPar["report_kind"];
        selPar["date_start"] = dom.getElementById("f_input_start").value;
        selPar["date_end"] = dom.getElementById("f_input_end").value;

        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"),"filterFrame");
        hr.setParentclass(_self);
        hr.addEventListener("onError", function(){});
        hr.addEventListener("LoadComplete", function(json){
            var hash;
            try{
                hash = JSON.parse(json);
                if(util.chkErrorMsg(hash,LS_code)) return;
            }catch(e){
                util.err("["+classname+"]", e);
                return;
            }

            if(hash["status"]=="200"){
                par = util.clone(selPar);
                retFun(par);
            }else{
                selPar = util.clone(par);
                if(par["report_kind"]=="A"){
                    _self.chgSel(null,{"rtype":"result_type","type":par["result_type"]});
                }else{
                    _self.chgSel(null,{"rtype":"report_kind","type":par["report_kind"]});
                }
                _self.chgSel(null,{"rtype":"date","type":par["date"]});
                _self.chgSel(null,{"rtype":"gtype","type":par["gtype"]});
                // _self.chgSel(null,{"rtype":"wtype","type":par["wtype"]});
                dom.getElementById("f_input_start").value = _self.showDate(par["date_start"]);
                dom.getElementById("f_input_end").value = _self.showDate(par["date_end"]);
                _self.backEvent(null, null);
                util.showErrorMsg(hash["msg"]);
            }
        });
		hr.loadURL(top.url, "POST", str);
    }

    _self.chgDate=function(e, param){
        util.echo("["+classname+"][chgDate]"+param.type);
        var date_s = "";
        var date_e = "";
        switch(param.type){
            case "yes":
                date_s = dateHash["yesterday"];
                date_e = dateHash["yesterday"];
                break;
            case "to":
                date_s = dateHash["today"];
                date_e = dateHash["today"];
                break;
            case "tm":
                date_s = dateHash["tomorrow"];
                date_e = dateHash["tomorrow"];
                break;
            case "tw":
                date_s = dateHash["this_week_s"];
                date_e = dateHash["this_week_e"];
                break;
            case "lw":
                date_s = dateHash["last_week_s"];
                date_e = dateHash["last_week_e"];
                break;
            case "tp":
                date_s = dateHash["period_s"];
                date_e = dateHash["period_e"];
                break;
            case "lp":
                date_s = dateHash["period_ls"];
                date_e = dateHash["period_le"];
                break;
        }

        date_s = date_s.replace(/ /g,"");
        date_s = date_s.replace(/-/g," - ");
        date_e = date_e.replace(/ /g,"");
        date_e = date_e.replace(/-/g," - ");
        dom.getElementById("f_input_start").value = date_s;
        dom.getElementById("f_input_end").value = date_e;
        par["date_start"] = date_s;
        par["date_end"] = date_e;
        _self.chgSel(e, param);
    }

    _self.getWeek=function(d, w, dateHash){
        var date_obj = _self. chg_date("","",dateHash["today"],1);
        var wday= date_obj.getDay();
        if(wday=="0")wday=7;
        return _self.getNowDateTime("yyyy-mm-dd","d",0-wday+d+w*7,dateHash);
    }

    _self.getNowDateTime=function(fomat,field,num,dateHash){
		var yyyy=mm=dd=H=i=s=0;
		var gDate = new Date();
		yyyy = gDate.getUTCFullYear();
		mm = gDate.getUTCMonth()+1;
		dd = gDate.getUTCDate();
		H = gDate.getUTCHours();
		i = gDate.getUTCMinutes();
		s = gDate.getUTCSeconds();
		gDate = new Date(parseInt(yyyy, 10),parseInt(mm, 10) - 1,parseInt(dd, 10) ,parseInt(H,10)+parseInt(dateHash["WEB_TIME_ZONE"],10),parseInt(i,10),parseInt(s,10),0)
		yyyy = gDate.getFullYear();
		mm = gDate.getMonth()+1;
		dd = gDate.getDate();
		H = gDate.getHours();
		i = gDate.getMinutes();
		s = gDate.getSeconds();
		if(field=="y"||field=="m"||field=="d"){
			gDate = _self. chg_date(field,num,yyyy+"-"+mm+"-"+dd,1);
			yyyy = gDate.getFullYear();
			mm = gDate.getMonth()+1;
			dd = gDate.getDate();
		}
		if(mm*1< 10)mm = "0"+mm;
		if(dd*1< 10)dd = "0"+dd;
		if(H*1< 10)H = "0"+H;
		if(i*1< 10)i = "0"+i;
		if(s*1< 10)s = "0"+s;
		if(fomat=="yyyy-mm-dd")return yyyy+"-"+mm+"-"+dd;
		if(fomat=="H:i:s") return H+":"+i+":"+s;
		if(fomat=="yyyy-mm-dd H:i:s")return yyyy+"-"+mm+"-"+dd+" "+H+":"+i+":"+s;

		return yyyy+"-"+mm+"-"+dd+" "+H+":"+i+":"+s;
    }

    _self.chg_date = function(fix_type,shift,today,Obj){
		var y_num=m_num=d_num=0;
		if(fix_type == "y") y_num = shift;
		if(fix_type == "m") m_num = shift;
		if(fix_type == "d") d_num = shift;
		var aDate = today.split("-");
		var newDate = new Date(parseInt(aDate[0], 10)+y_num,parseInt(aDate[1], 10) - 1+m_num,parseInt(aDate[2], 10) + d_num);
		if(Obj==1)return newDate;
		else {
			var yyyy = newDate.getFullYear();
			var mm = newDate.getMonth()+1;
			var dd = newDate.getDate();
			if(mm*1< 10)mm = "0"+mm;
			if(dd*1< 10)dd = "0"+dd;
			return yyyy+"-"+mm+"-"+dd;
		}
    }

    _self.backEvent=function(e, param){
        _self.clearFilter();
        parentClass.dispatchEvent("hideFilter", param);
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
	}
    //----------------------------------------------------------------------------------------------------------------------------------------
    _self.setSearchSel = function (icon, param) {
        util.addEvent(icon, "click", _self.setSCEvent, { "icon": icon, "param": param });
    }

    _self.setSCEvent = function (e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i] == e.target) {
                return false;
            }
        }
        if (e.target == param._focus) return false;

        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
            util.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
            util.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");
        } else {
            param._setView.classList.add(param._viewClass);
            util.addEvent(dom.getElementsByTagName("div")[0], "mousedown", _self.InfBlurEvent, _par);
            util.addEvent(dom.getElementsByTagName("div")[0], "touchstart", _self.InfBlurEvent, _par);
        }
    }

    _self.InfBlurEvent = function (e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        var mouseIN = false;
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i] == e.target) {
                mouseIN = true;
            }
        }
        if (param._focus == e.target) mouseIN = true;

        if (!mouseIN) {
            var all = icon.getElementsByTagName("*");
            for (var i = 0, max = all.length; i < max; i++) {
                if (all[i] == e.target) {
                    return false;
                }
            }
            if (e.target == icon) return false;
            _self.closeInfElmt(param);
        } else if (param.info_mode && mouseIN) {
            _self.closeInfElmt(param);
        }
    }

    _self.closeInfElmt = function (param) {
        dom.activeElement.blur();
        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
        }
        util.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
        util.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");
    }

    _self.cleanTextEvent = function (evt, param) {
        param.dom.value = "";
        param.dom.focus();
        _self.recoveyDispalyWtype();
    }

    _self.serchSelEvent = function (evt, param) {
        var DOM = evt.target;
        if (DOM.tagName == "LI") {
            selPar["wtype"] = DOM.id.split("_")[2];
            dom.getElementById("f_wtype_div").classList.remove(param.className);
            _self.recoveyDispalyWtype();
            //印上innerHTML 與 清空 text
            dom.getElementById("f_wtype_now").innerHTML = DOM.innerHTML
            dom.getElementById("f_searchWtype").value = "";
        }
    }
    //輸入匡異動
    _self.changeSearchText = function (evt, param) {
        var DOM = evt.target;
        var searchStr = DOM.value;
        if (searchStr == "") {
            _self.recoveyDispalyWtype();
        } else {
            var allULWtype = document.getElementById("f_allULWtype");
            var wtypeLIId = allULWtype.getElementsByTagName("LI");
            for (var i = 0, len = wtypeLIId.length; i < len; i++) {
                var targerDOMid = wtypeLIId[i].textContent.toLowerCase();
                var vanishLI = "none";
                if (targerDOMid.indexOf(searchStr) != -1) vanishLI = "";
                wtypeLIId[i].style.display = vanishLI;
            }
        }
    }
    //恢復所有選項
    _self.recoveyDispalyWtype = function () {
        var allULWtype = document.getElementById("f_allULWtype");
        var wtypeLIId = allULWtype.getElementsByTagName("LI");
        for (var i = 0, len = wtypeLIId.length; i < len; i++) {
            wtypeLIId[i].style.display = "";
        }
    }
    //----------------------------------------------------------------------------------------------------------------------------------------


    _self.chkEvent  = function(){
        var mode = now_parObj[nowMode].mode;
        var subMode = now_parObj[nowMode]._subMode;
        var setDiv = now_parObj[nowMode]._setDiv;
        var rtype = nowMode;
        if(mode == 2 &&  typeof subMode!=='undefined'){
            var def_mode =  now_parObj[rtype]._default["mode"];
            var def_listItem =  now_parObj[rtype]._default["listItem"];
            var def_listGold =  now_parObj[rtype]._default["listGold"];

            def_listGold[def_listItem] = dom.getElementById("SIN_input_f").value;
            _param[rtype]["mode"] = def_mode;
            _param[rtype]["listItem"] = def_listItem;
            _param[rtype]["listGold"] = def_listGold;


        }else if(mode == 2){
            var tmpObj=new Object;
            var list = now_parObj[rtype]["_list"];
            var id_str=",";
            for(var i=0;i<list.length;i++){
                id_str+=list[i]+"_input_f,";
            }
            var obj_ids =  util.getObjAry(setDiv,id_str);
            for(var key_sub in  obj_ids){
                if(obj_ids[key_sub]){
                    var itemType = key_sub.split('_')[0];
                    var itemGold = obj_ids[key_sub].value*1;
                    tmpObj[itemType] = itemGold;
                }
            }
            _param[rtype]["listGold"] = tmpObj;

            for(var i=0;i<setDiv.children.length;i++){
                if(setDiv.children[i].classList.value.indexOf("wmc_stake_checked")!=-1){
                    _param[rtype]["mode"] = now_parObj[nowMode]._group[i];
                }
            }
        }
        _self.filter_submit({"param":_param,"rtype":nowMode,"name":_paramName});
        _self.clearFilter();
    }


    _self.keep_credit=function(e){
        e.target.value = e.target.value.replace(/\D/g,'')*1;
    }

    _self.showErrorMsg = function(code, arr_data){
        if(code == "limitCount"){
            _self.showAlertMsg(arr_data);
        }
    }


    _self.showAlertMsg=function(arr_data){
        // alertFrame.showMsg(param);
        dom.getElementById("f_msg_ok").innerHTML =arr_data;
        dom.getElementById("f_tbet_alert").style.display = "";
    }

    _self.hideAlertMsg=function(param){
        dom.getElementById("f_tbet_alert").style.display = "none";
    }

    _self.clearFilter = function(){
        now_parObj[nowMode]._setDiv.style.display="none";
        dom.getElementById("f_title_small").innerHTML="";
    }


    _self.showLoading = function(param){
        _self.setLoadingVisible(param.showLoading);
    }

    _self.setLoadingVisible = function(isShow){
        if(isShow)parentClass.dispatchEvent("showFilterLoading", null);
        else parentClass.dispatchEvent("closeFilterLoading", null);
    }

    //異動class 觸發畫面重新偵測
    _self.sizeChange = function () {
        var tmpObj = dom.getElementById("main");
        if (tmpObj) {
            tmpObj.classList.add("main_rotate");
            setTimeout(function () { tmpObj.classList.remove("main_rotate"); }, 400);
        }
    }
}