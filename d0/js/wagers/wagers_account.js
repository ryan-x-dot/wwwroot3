function wagers_account(_win, _dom, paramObj){
	var _self=this;
	var classname = "wager_account.js";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
	var param;
	var bodyFrame;
    var eventHandler = new Object();
	var getView;
	var _mc = new Object();
	var _set = new Object();
	var dataHash = "";
	var sort_type = "";
	var sort_asc = true; //asc or desc

	var lazy_sw = null;
    var lazy_count = null; //every page count
    var lazy_page = null;
    var lazy_total_page = null;
	var lazy_loading = false;
	var scroll_e = null;
    var scroll_left = 0;

	var nowDataType="";
	var config_set;
	var disAry;
	var nowDetail;
	var accSortAry =["NAME0","COUNT","GOLD0"];
	var listSortAry =["DATETIME","NAME0","GOLD"];

	var isInit = true;

	_set["str_su"] = "";
	_set["str_ag"] = "";
	_set["str_mem"] = "";
	_set["layer"] = "";
	_set["acc_id"] = "";
	_set["gold"] = "0";
	_set["down_id"] = "all";
	_set["game_over"] = "";
	_set["page"] = "1";
	_set["layerConvert"] = new Object();
	_set["layerConvert"]["ads"] = "adsid";
	_set["layerConvert"]["ad"] = "adid";
	_set["layerConvert"]["d0"] = "did";
	_set["layerConvert"]["co"] = "cid";
	_set["layerConvert"]["su"] = "sid";
	_set["layerConvert"]["ag"] = "aid";
	_set["layerConvert"]["mem"] = "mid";
	_set["viewLayer"] = new Object();
	_set["viewLayer"]["ads"] = "ad";
	_set["viewLayer"]["ad"] = "d0";
	_set["viewLayer"]["d0"] = "co";
	_set["viewLayer"]["co"] = "su";
	_set["viewLayer"]["su"] = "ag";
	_set["viewLayer"]["ag"] = "mem";
	_set["upperLayer"] = new Object();
	_set["upperLayer"]["ad"] = "ads";
	_set["upperLayer"]["d0"] = "ad";
	_set["upperLayer"]["co"] = "d0";
	_set["upperLayer"]["su"] = "co";
	_set["upperLayer"]["ag"] = "su";
	_set["upperLayer"]["mem"] = "ag";
	_set["upperID"] = new Object();
	_set["upperID"]["ad"] = "adsid";
	_set["upperID"]["d0"] = "adid";
	_set["upperID"]["co"] = "did";
	_set["upperID"]["su"] = "cid";
	_set["upperID"]["ag"] = "sid";
	_set["upperID"]["mem"] = "aid";
	_set["userAry"] = new Array("ad_user","d0_user","co_user","su_user","ag_user","mem_user");

	_set["sub_page"] = "";
	_set["sub_target"] = "";
	_set["tbet_gtype"] = "";
	_set["tbet_showtype"] = "";
	_set["next_param"] = "";

	_set["upperHash"] = new Object();

	_set["brade_ads"] = [];
	_set["brade_ad"] = ["ads"];
	_set["brade_d0"] = ["ads","ad"];
	_set["brade_co"] = ["ads","ad","d0"];
	_set["brade_su"] = ["ads","ad","d0","co"];
	_set["brade_ag"] = ["ads","ad","d0","co","su"];
	_set["brade_mem"] = ["ads","ad","d0","co","su","ag"];
	_set["brade_all"] = ["ads","ad","d0","co","su","ag","mem"];

	_set["wagersWtype"] = "";
	_set["wagersRtype"] = "";

	_self.init=function(){
		param = paramObj;
		_set["game_over"] = (param.game_over == undefined)?"N":param.game_over;
		_set["str_ads"] = LS.get("acc_ads");
		_set["str_ad"] = LS.get("acc_ad");
		_set["str_d0"] = LS.get("acc_d0");
		_set["str_co"] = LS.get("acc_co");
		_set["str_su"] = LS.get("acc_su");
		_set["str_ag"] = LS.get("acc_ag");
		_set["str_mem"] = LS.get("acc_mem");
		_set["layer"] =(param.nowLayer == undefined)? top.login_layer:param.nowLayer;
		_set["CompleteFunc"] = new Object();
		_set["CompleteFunc"]["ads"] = _self.LoadAccountComplete;
		_set["CompleteFunc"]["ad"] = _self.LoadAccountComplete;
		_set["CompleteFunc"]["d0"] = _self.LoadAccountComplete;
		_set["CompleteFunc"]["co"] = _self.LoadAccountComplete;
		_set["CompleteFunc"]["su"] = _self.LoadAccountComplete;
		_set["CompleteFunc"]["ag"] = _self.LoadAccountComplete;
		_set["CompleteFunc"]["mem"] = _self.LoadListComplete;

		if(param.stake) _set["gold"] = param.stake;
		if(param.downline) _set["down_id"] = param.downline;

		if(param.sub_page)_set["sub_page"] = param.sub_page;
		if(param.sub_target)_set["sub_target"] = param.sub_target;
		if(param.tbet_gtype)_set["tbet_gtype"] = param.tbet_gtype;
		if(param.tbet_showtype)_set["tbet_showtype"] = param.tbet_showtype;
		if(param.next_param) _set["next_param"] = param.next_param;

		if(!param.upperHash)param.upperHash=new Object();



		if(param.wagersWtype)_set["wagersWtype"] = param.wagersWtype;
		if(param.wagersRtype)_set["wagersRtype"] = param.wagersRtype;

		sort_type = (_set["layer"] != "mem"?"NAME0":"DATETIME");
		disAry = _self.getDisObj();
		_self.initUser();
		_self.initLazy();
		_self.loadData();

        //totalbets 側邊細單關掉移除底色
        bodyFrame.closeAccDetail = function () {
            _self.closeAccDetail();
		}

		bodyFrame.closeAccEditDetail = function () {
			_self.closeAccEditDetail();
		}
	}

	_self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
		util = parentClass.getThis("util");
		LS = parentClass.getThis("LS");
		getView = parentClass.getThis("getView");
		config_set = parentClass.getThis("config_set");
		cookie = parentClass.getThis("cookie");
		bodyFrame = parentClass.getThis("bodyFrame");
	}

	_self.getParentThis = function (varible) {
        return parentClass.getThis(varible);
    }

	_self.loadData=function(){
		var par;
		if(_set["next_param"]!=""){
			par = _set["next_param"];
		}else{
			par = _self.getParam();
		}
        hr = new win.HttpRequest();
        hr.addEventListener("onError", _self.onError);
        hr.addEventListener("LoadComplete", _set["CompleteFunc"][_set["layer"]]);
        hr.loadURL(top.url, "POST", par);

	}

	_self.getParam=function(){
		var tarPage = (_set["layer"] != "mem"?"get_wagers_account":"get_wagers_list_bet");
		var par = "";
		par += top.param;
        par += "&p="+tarPage;
		par += "&layer="+_set["layer"];
		par += "&acc_id="+_set["acc_id"];
		par += "&gold="+_set["gold"];
		par += "&down_id="+_set["down_id"];

		if(_set["layer"] == "mem"){
			par += "&page="+_set["page"];
			par += "&game_over="+_set["game_over"];
		}

		par += "&gtype="+param["GTYPE"];
		par += "&gid="+param["GID"];
		par += "&wtype="+param["WTYPE"];
		par += "&rtype="+param["RTYPE"];
		return par;
	}

	_self.LoadListComplete=function(json){
		// console.log("_self.LoadListComplete");
		var hash;
		// dataHash = json;
        try {
            hash = JSON.parse(json);
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
		}
		dataHash = hash;
		nowDataType = "List";
		sort_type="DATETIME";
		_self.reSetLazy(hash["row0"]);
		_self.parseDataList(hash);


	}

	_self.parseDataList = function(data){
		// console.log("[LoadComplete]",data);
		var hash = data
		var row0 = hash["row0"];
		if(row0){
			row0 = _self.sortData(row0, sort_type, sort_asc);
			var now_model = _self.getWagersModel(_set["layer"]);
			var modelObj = dom.getElementById(now_model);
			var tmpModel = modelObj.cloneNode(true);
			var showObj = dom.getElementById("wagers_show");
			// showObj.innerHTML = "";

			var tpl = new fastTemplate_a1();
			tpl.init(tmpModel);
			tpl.addBlock("td");
			tpl.replace("*ADD_TD*", hash["HEADER"]);
			if (lazy_page == 1) {
                showObj.innerHTML = "";
                var totalAry = new Array("WCOUNT", "SGOLD0");
                tpl.addBlock("total");
                for (var a = 0; a < totalAry.length; a++) {
                    var keys = totalAry[a];
                    if (hash[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), hash[keys]);
				}

				var titleAry = new Array("SUCLASS","COCLASS","COMCLASS");
                var titleAry_sub = new Array("su","co","com");
				tpl.addBlock("title");
				for (var a = 0; a < titleAry.length; a++) {
					var keys = titleAry[a];
                        tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"),disAry[titleAry_sub[a]]);
				}
			}

			var s = 0;
			var e = 0;
            if (lazy_sw) {
                s = (lazy_page - 1) * lazy_count;
                e = (lazy_page == lazy_total_page) ? row0.length : lazy_page * lazy_count;
            } else {
                s = 0;
                e = row0.length;
			}
			// var totalAry = new Array("WCOUNT","SGOLD0");
			// tpl.addBlock("total");
			// for (var a = 0; a < totalAry.length; a++) {
			// 	var keys = totalAry[a];
			// 	if (hash[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), hash[keys]);
			// }

			// var subData = hash["subData"];
			// ARESULT: 20
			//BALL_ACT,COMWINLOSS,CRESULT,DATE,GOLD,GT,IN_RADIO,M_TYPE,NAME0,ODDF_TYPE,SRESULT,SRV_IP,TID,TIME,TNAME
			var subDataAry = new Array("DATE","TIME","NAME0","TD_CONTENT","M_TYPE","IN_RADIO","ODDF_TYPE","TID","TID","GT","SRV_IP","TNAME","BALL_ACT","GOLD","ARESULT","SRESULT","CRESULT","D0RESULT","CANCEL_MSG");
			for (var i = s; i < e; i++) {
				tpl.addBlock("row0");
				for (var a = 0; a < subDataAry.length; a++) {
					var subAry = row0[i];
					var keys = subDataAry[a];
					if (subAry[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), subAry[keys]);

					tpl.replace(new RegExp("\\\*DIS_D0\\\*", "gi"), disAry["d0"]);
                    tpl.replace(new RegExp("\\\*DIS_CO\\\*", "gi"), disAry["co"]);
                    tpl.replace(new RegExp("\\\*DIS_SU\\\*", "gi"), disAry["su"]);
					if(keys=="TD_CONTENT"){
						var small_td_content = subAry.TD_CONTENT.replace(new RegExp(" \/ ", "gi"),"");
						small_td_content = small_td_content.replace(new RegExp("_"+subAry.ID, "gi"),"_small_"+subAry.ID);
						small_td_content = small_td_content.replace('<br>',"");
						tpl.replace(new RegExp("\\\*ADD_TD_SMALL_CONTENT\\\*", "gi"), small_td_content);
					}
				}
			}
			if (lazy_page == 1) {
                showObj.innerHTML = tpl.fastPrint();
            } else {
				var obj = dom.getElementById("re_body_scroll").children[0].children[0].children[0];
                obj.innerHTML += tpl.getBlock("row0");
            }
			// showObj.innerHTML = tpl.fastPrint();
			_self.setSortClick(true);
			// _self.setUserClick(hash["layer"]);
			_self.setDetailClick(row0);
			_self.addUserClick( null, hash["UPPER0"], hash["UPPER"],"all");
			_self.initScroll();
			// mid=1676&mem_user=ssssO aid=942 mem
		}


        _self.checkShowLazyLoading(dom.getElementById("body_show"));
        dom.getElementById("body_show").style.overflowY = "scroll";
		_self.set_scroll_left();
        _self.scroll_hor_event(dom.getElementById("re_body_scroll"), true);
        _self.scroll_ver_event(scroll_e, dom.getElementById("totalbet_body"));
		_self.setLzayLoadingVisible(false);

		if(param["GTYPE"]=="FS")dom.getElementById("game_info").getElementsByTagName("li")[1].style.display="none";
		dom.getElementById("game_info").getElementsByTagName("li")[3].innerHTML = _set["wagersWtype"];
		dom.getElementById("game_info").getElementsByTagName("li")[2].innerHTML = _set["wagersRtype"];

		parentClass.dispatchEvent("showLoading", {"showLoading":false});
	}


	_self.LoadAccountComplete = function(json){
		var hash;
		// dataHash = json;
		try {
			hash = JSON.parse(json);
		} catch (e) {
			util.err("[" + classname + "]", e);
			return;
		}
		dataHash = hash;
		if(hash["status"]=="666"){
			nowDataType = "Account";
			if(accSortAry.indexOf(sort_type)*1 ==-1)sort_type="NAME0";
			_self.reSetLazy(hash["row0"]);
			_self.parseDataAccount(hash);
		}

	}


	_self.parseDataAccount = function(data){
		// console.log("[LoadComplete]",data);
		var hash = data;
		var row0 = hash["subData"];

		if(row0){
			// if(listSortAry.indexOf(sort_type)!=-1)sort_type="NAME0";
			row0 = _self.sortData(row0, sort_type, sort_asc);
			var now_layer = (param.nowLayer)? param.nowLayer : _set["layer"];
			var now_model = _self.getWagersModel(param.nowLayer);
			var modelObj = dom.getElementById(now_model);
			var tmpModel = modelObj.cloneNode(true);
			var showObj = dom.getElementById("wagers_show");
			// showObj.innerHTML = "";
			tmpModel.innerHTML = tmpModel.innerHTML.replace(/\*LAYER_NAME\*/g, _set["str_"+hash["layer"]]);

			var tpl = new fastTemplate_a1();
			tpl.init(tmpModel);


			if (lazy_page == 1) {
                showObj.innerHTML = "";
				var totalAry = new Array("SCOUNT","SGOLD0");
				tpl.addBlock("total");
				for (var a = 0; a < totalAry.length; a++) {
					var keys = totalAry[a];
					if (hash[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), hash[keys]);
				}
			}

			var s = 0;
			var e = 0;
            if (lazy_sw) {
                s = (lazy_page - 1) * lazy_count;
                e = (lazy_page == lazy_total_page) ? row0.length : lazy_page * lazy_count;
            } else {
                s = 0;
                e = row0.length;
			}



			var subData = hash["subData"];
			var subDataAry = new Array("ID0","NAME0","ALIAS0","ACTION0","UPPER0","COUNT","GOLD0");
			for (var i = s; i < e; i++) {
				tpl.addBlock("row0");
				for (var a = 0; a < subDataAry.length; a++) {
					var subAry = subData[i];
					var keys = subDataAry[a];
					if (subAry[keys] != null) tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), subAry[keys]);
				}
			}

			if (lazy_page == 1) {
                showObj.innerHTML = tpl.fastPrint();
            } else {
				var obj = dom.getElementById("re_body_scroll").children[0].children[0].children[0];
                obj.innerHTML += tpl.getBlock("row0");
			}

			// showObj.innerHTML = tpl.fastPrint();
			_self.setUserClick(hash["layer"]);
			_self.setSortClick(true);
			_self.initScroll();
		}

        _self.checkShowLazyLoading(dom.getElementById("body_show"));
        dom.getElementById("body_show").style.overflowY = "scroll";
		_self.set_scroll_left();
        _self.scroll_hor_event(dom.getElementById("re_body_scroll"), true);
        _self.scroll_ver_event(scroll_e, dom.getElementById("totalbet_body"));
        _self.setLzayLoadingVisible(false);

		if(hash["gtype"]=="FS")dom.getElementById("game_info").getElementsByTagName("li")[1].style.display="none";
		dom.getElementById("game_info").getElementsByTagName("li")[3].innerHTML = hash["wagersWtype"];
		dom.getElementById("game_info").getElementsByTagName("li")[2].innerHTML = hash["wagersRtype"];

		_set["wagersWtype"] = hash["wagersWtype"];
		_set["wagersRtype"] = hash["wagersRtype"];

		param["wagersWtype"] = _set["wagersWtype"];
		param["wagersRtype"] = _set["wagersRtype"];

		parentClass.dispatchEvent("showLoading", {"showLoading":false});
	}

	_self.setUserClick = function (view_layer) {
		var objs = document.getElementsByName("user_btn");
        for (var i = 0; i < objs.length; i++) {
			if(objs[i] && objs[i].getAttribute("data-url")!="*ACTION0*")_self.addUserClick(objs[i], objs[i].getAttribute("data-url"), objs[i].getAttribute("data-upper"), view_layer);
        }
	}

	_self.setDetailClick = function (dataAry) {
        for (var i = 0; i < dataAry.length; i++) {
            var _name = "";
            _name = "tid_" + dataAry[i]["TID"];
			util.addEvent(dom.getElementById(_name), "click", _self.viewDetail, dataAry[i]);

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

			var _edit = "edit_"+dataAry[i]["ID"];
			var _edit_small = "edit_small_"+dataAry[i]["ID"];
			util.addEvent(dom.getElementById(_edit), "click", _self.viewEdit, dataAry[i]);
			util.addEvent(dom.getElementById(_edit_small), "click", _self.viewEdit, dataAry[i]);

			var _result = "result_"+dataAry[i]["ID"];
			var _result_small = "result_small_"+dataAry[i]["ID"];
			util.addEvent(dom.getElementById(_result), "click", _self.viewResult, dataAry[i]);
			util.addEvent(dom.getElementById(_result_small), "click", _self.viewResult, dataAry[i]);
        }
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
			_self.loadData();
		}else{
			parentClass.showAlertMsg(hash);
		}
	}

	_self.viewResult = function(e,param){
		try {
			if (e.target.id.indexOf("anno") != -1) return;
			// 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
			_self.closeAccDetail();
			nowDetail = "tid_"+param["TID"];
			dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
		} catch (e) { }
		parentClass.dispatchEvent("showBetResult", {"row0": param });
	}

	_self.viewEdit = function(e,param){
		try {
			if (e.target.id.indexOf("anno") != -1) return;
			// 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
			_self.closeAccDetail();
			nowDetail = "tid_"+param["TID"];
			dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
		} catch (e) { }
		parentClass.dispatchEvent("showBetEdit", {"row0": param });
	}

	_self.closeBetEditSuccess = function(){
		_self.loadData();
	}

	_self.closeAccEditDetail = function(){
		_self.loadData();
		if(dom.getElementById(nowDetail)) dom.getElementById(nowDetail).classList.remove("tr_bgebf7ff");
	}

	_self.viewDetail = function (e, param) {
        try {
            if (e.target.id.indexOf("anno") != -1) return;
            // 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
            _self.closeAccDetail();
            nowDetail = "tid_"+param["TID"];
            dom.getElementById(nowDetail).classList.add("tr_bgebf7ff");
        } catch (e) { }
		parentClass.dispatchEvent("showReportDetail", { "view_layer": "list_bet", "result_type": "N", "row0": param });

	}

	// 2019-05-02 511.報表-查看細單層-若點擊某一細單並彈出右側詳細內容後, bet detials底色應要停留在被點擊的那一行注單(PJP-566)
	_self.closeAccDetail = function(){
		if(dom.getElementById(nowDetail)) dom.getElementById(nowDetail).classList.remove("tr_bgebf7ff");
	}

    _self.addUserClick = function (obj, _post, _upper,view_layer) {
		var real_layer="";
		if(_post.indexOf("*") != -1) return; // model模組不需加事件
		if(view_layer=="all"){
			view_layer="mem";
			real_layer="all";
		}else{
			real_layer = view_layer;
		}
		if(_set["viewLayer"][top.login_layer] == view_layer){
			_self.initUser();
			dom.getElementById("bread_bar").style.display = "none";
		}else{
			dom.getElementById("bread_bar").style.display = "";
		}
		var hash = _self.coverToHash(_post);
		var upperAry = _self.coverToHash(_upper);
		var pHash = new Object();
		var _upperID = _set["upperID"][view_layer];

		var _getID = _set["layerConvert"][view_layer];
		pHash["layer"] = view_layer;
		pHash["acc_id"] = hash[_getID];
		pHash["url"] = hash;
		pHash["upper_layer"] = _set["upperLayer"][view_layer];
		pHash["upper_id"] = upperAry[_upperID];
		var breadObjNum = 0;
		for(var i=(breadObjNum*1);i<_set["userAry"].length;i++){
			var otherBreadObj = dom.getElementById(_set["userAry"][i]);
			if(!otherBreadObj.classList.contains("hide_item"))util.classFunc(otherBreadObj, "hide_item");
		}



		_set["layer"] = pHash.layer;
		_set["acc_id"] = pHash.acc_id;


		var upperHash = new Object();
		// 隱藏的麵包屑
		upperHash["layer"] = pHash.layer;
		upperHash["acc_id"] = pHash.acc_id;
		// 返回上層麵包屑
		upperHash["upperlayer"] = pHash.upper_layer;
		upperHash["upper_id"] = pHash.upper_id;
		upperHash["upper_name"] = pHash["url"][pHash.layer+"_user"];
		param.upperHash[pHash.layer] = upperHash;
		for(var key in param.upperHash){
			var upBrade = param.upperHash[key];
			// 設定麵包屑連結
			var breadObj = dom.getElementById(upBrade.layer+"_user");
			if(breadObj && _set["brade_"+real_layer].indexOf(upBrade.layer)!=-1){
				breadObj.innerHTML = upBrade.upper_name;
				if(breadObj.classList.contains("hide_item")){
					breadObj.classList.remove("hide_item");
					util.addEvent(breadObj, "click", _self.goLayer, upBrade);
				}

			}
		}



		// util.addEvent(breadObj, "click", _self.goLayer, upperHash);
		util.addEvent(obj, "click", _self.viewAccountEvent, pHash);
	}

	_self.viewAccountEvent=function(mouseEvent, targetObj){
		parentClass.dispatchEvent("showLoading", {"showLoading":true});

		isInit = false;
		if(isInit){
			_self.loadData();
		}else{
			// var now_par = _self.getParam();;

			var tarPage = (_set["layer"] != "mem"?"get_wagers_account":"get_wagers_list_bet");
			var par_str = "";
			par_str += top.param;
			par_str += "&p="+tarPage;
			par_str += "&layer="+_set["layer"];
			par_str += "&acc_id="+targetObj["acc_id"];
			par_str += "&gold="+_set["gold"];
			par_str += "&down_id="+_set["down_id"];

			if(_set["layer"] == "mem"){
				par_str += "&page="+_set["page"];
				par_str += "&game_over="+_set["game_over"];
				if (typeof (targetObj["url"]["pay_type"] != "undefind")) {
					par_str += "&pay_type=" + targetObj["url"]["pay_type"];
				}
			}

			par_str += "&gtype="+param["GTYPE"];
			par_str += "&gid="+param["GID"];
			par_str += "&wtype="+param["WTYPE"];
			par_str += "&rtype="+param["RTYPE"];

			param.next_param = par_str;

			param.nowLayer = _set["layer"];
			var par = new Object();
            par["page"] = "totalbet_header";
			par["postHash"] = param;
            parentClass.dispatchEvent("bodyGoToPage", par);
		}

	}

	_self.goLayer = function(e, tarObj){
		var breadObj = dom.getElementById(tarObj.layer+"_user");
		if(breadObj!=null){
			breadObj.classList.add("hide_item");
			breadObj.innerHTML = "";
		}
		_set["layer"] = tarObj.upperlayer;
		_set["acc_id"] = tarObj.upper_id;
		param.nowLayer = _set["layer"];
		parentClass.dispatchEvent("showLoading", {"showLoading":true});
		// _self.loadData();

		isInit = false;
		if(isInit){
			_self.loadData();
		}else{
			var now_par = _self.getParam();;
			param.next_param = now_par;
			var par = new Object();
            par["page"] = "totalbet_header";
			par["postHash"] = param;
            parentClass.dispatchEvent("bodyGoToPage", par);
		}

	}

	_self.initUser = function(){
		for(var i = 0; i < _set["userAry"].length; i++){
			dom.getElementById(_set["userAry"][i]).innerHTML = "";
			dom.getElementById(_set["userAry"][i]).classList.add("hide_item");
		}
	}

    _self.setPurple = function (url) {
        var usersp = url.split("&");
        var userorigin = usersp[usersp.indexOf(usersp[usersp.length - 3])];
        var userlayer = userorigin.substr(0, (userorigin.search("=")));
        var username = userorigin.substr((userorigin.search("=") + 1));
        if (userlayer == "co_user" || userlayer == "su_user" || userlayer == "ag_user" || userlayer == "mem_user") {
            if (cookie.get("wager") == undefined) {
                cookie.set("isclick", "");
                cookie.set("isclick", userlayer + "=" + username + "*" + cookie.get("isclick"));
            }else{
                if ((cookie.get("isclick").match(userlayer + "=" + username)) == null) {
                    cookie.set("isclick", userlayer + "=" + username + "*" + cookie.get("isclick"));
                }
            }
        }
    }

	_self.giveColor = function (objs) {
        var isclickarr = cookie.get("isclick").split("*");
        for (i = 0; i < objs.length; i++) {
            var url = objs[i].getAttribute("data-url");
            var usersp = url.split("&");
            var userorigin = usersp[usersp.indexOf(usersp[usersp.length - 3])];
            if (isclickarr.indexOf(userorigin) >= 0) {
                var test = objs[i];
                test.classList.add("on");
            }
        }
    }

	_self.getWagersModel = function(_layer){
        var view_w = getView().viewportwidth;
		var ret = "";
		if(view_w < 1024){
			ret = (_layer=="mem")?"report_list_s_model":"report_s_model";
		}else{
			ret = (_layer=="mem")?"report_list_b_model":"report_b_model";
		}
        return ret;
	}

	_self.coverToHash = function (_post) {
        var hash = new Object();
        var tmp = _post.split("&");
        for (var i = 0; i < tmp.length; i++) {
            var t = tmp[i].split("=");
            hash[t[0]] = t[1];
        }
        return hash;
    }


	_self.setSortClick = function (isSet) {
		var objs = document.getElementsByName("sort_btn");

        for (var i = 0; i < objs.length; i++) {
            var obj = objs[i];
            var tmp_sort = obj.getAttribute("data-sort");
            if (isSet) _self.addSortClick(obj, tmp_sort);

            obj.classList.remove("sort_up");
            obj.classList.remove("sort_down");
            if (sort_type == tmp_sort) {
				var sty = sort_asc ? "sort_down" : "sort_up";
                obj.classList.add(sty);
            }
        }
	}

    _self.addSortClick = function (obj, sort_type) {
        if (!sort_type) return;
        util.addEvent(obj, "click", _self.chgSortField, { "sort_type": sort_type });
    }

    _self.chgSortField = function (e, param) {

        if (sort_type == param.sort_type) {
            sort_asc = !sort_asc;
        } else {
            sort_type = param.sort_type;
            sort_asc = true;
        }
        _self.setSortClick(false);
		_self.reSetLazy(dataHash["row0"]);
        _self.set_scroll_top();
		if(nowDataType=="List"){
			_self.parseDataList(dataHash);
		}else{
			_self.parseDataAccount(dataHash);
		}

	}




    _self.set_scroll_top = function () {
        util.echo("[report_index]set_scroll_top");
		if(lazy_page==1) dom.getElementById("body_show").scrollTop = 0;
		// if(lazy_page==1) dom.getElementById("re_body_scroll").scrollTop = 0;
	}



	_self.sortData = function (ary, types, up_down) {
        //util.echo("[sortData]"+types+","+up_down);

        if (ary.length <= 1) return ary;
        var string_type = ",NAME0,ALIAS0,DATETIME,";
        if (string_type.indexOf(types) == -1) {
            var Reverse_type = ",COUNT,GOLD0,WIN_GOLD,";
            if (Reverse_type.indexOf(types) != -1) up_down = !up_down;
            if (up_down) {
                var sortfun = function (a, b) {
                    var ret;
                    a[types] = a[types] + "";
                    b[types] = b[types] + "";
                    var a_val = a[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
                    var b_val = b[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
                    if (isNaN(a_val)) a_val = 0;
                    if (isNaN(b_val)) b_val = 0;
                    ret = (a_val - b_val);
                    return ret;
                }
            } else {
                var sortfun = function (a, b) {
                    var ret;
                    a[types] = a[types] + "";
                    b[types] = b[types] + "";
                    var a_val = a[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
                    var b_val = b[types].replace(/,/g, "").replace("<s>", "").replace("</s>", "") * 1;
                    if (isNaN(a_val)) a_val = 0;
                    if (isNaN(b_val)) b_val = 0;
                    ret = (b_val - a_val);
                    return ret;
                }
            }

        } else {
            if (up_down) {
                var sortfun = function (a, b) {
                    var ret;
                    ret = (b[types].localeCompare(a[types]));
                    return ret;
                }
            } else {
                var sortfun = function (a, b) {
                    var ret;
                    ret = (a[types].localeCompare(b[types]));
                    return ret;
                }
            }
        }
        return ary.sort(sortfun)
	}


    //============ lazy loading ============

    _self.checkShowLazyLoading = function(target){
        if(!lazy_sw) return;
        var newScrollTop = target.scrollTop;
        var s_h = target.scrollHeight;
        var c_h = target.clientHeight;
        var scroll_bottom = (newScrollTop >= ((s_h-c_h)-10) );

		// util.echo("[checkShowLazyLoading]["+scroll_bottom+"]"+newScrollTop+"=="+s_h+"-"+c_h);
        if(scroll_bottom && !lazy_loading){
			// util.echo("[checkShowLazyLoading]"+lazy_page+"<"+lazy_total_page);
            if(lazy_page < lazy_total_page){
                _self.setLzayLoadingVisible(true);
                retryTimer = setTimeout(_self.loadLazyData, 300);
            }
        }
    }

    _self.setLzayLoadingVisible = function(isShow){
        if(!lazy_sw) return;
        lazy_loading = isShow;
        dom.getElementById("report_loading").style.display = (isShow)? "" : "none";
    }

    _self.loadLazyData = function(){
        if(!lazy_sw) return;
        lazy_loading = true;
        if(lazy_page < lazy_total_page){
            lazy_page++;
			if(nowDataType=="List"){
				_self.parseDataList(dataHash);
			}else{
				_self.parseDataAccount(dataHash);
			}
        }
    }

    _self.initLazy = function(){
        lazy_sw = config_set.get("LAZY_SW") || false;
        lazy_page = 1;
        lazy_total_page = 1;

        var lazy_cnt = (getView().viewportheight > 700) ? "LAZY_COUNT_BIG_PAGE" : "LAZY_COUNT";
        lazy_count = config_set.get(lazy_cnt) || 10;
        // util.echo("[init lazy]"+getView().viewportheight+",lazy_count="+lazy_count);
    }

    _self.reSetLazy = function(row0){
		_self.initLazy();
        lazy_total_page = row0 ? Math.ceil(row0.length / lazy_count) : 1;
    }
	//============ lazy loading ============

	_self.set_scroll_left = function () {
        dom.getElementById("re_body_scroll").scrollLeft = scroll_left;
	}

	_self.scrollHorEvent = function (e) {
        _self.scroll_hor_event(e.target, false);
	}


    _self.scroll_hor_event = function(target, isParse){

        if(dom.getElementById("more_btn") && !isParse) dom.getElementById("more_btn").style.display = "none";
        var obj = dom.getElementById("re_head_scroll");
        if(obj){
            obj.scrollLeft = target.scrollLeft;
            var scorllW = target.scrollWidth - target.clientWidth;

            // if (target.scrollLeft == 0) {
            //     _self.checkHeader(true);
            // } else if (target.scrollLeft == scorllW) {
            //     dom.getElementById("more_btn").style.display = "none";
            //     _self.checkHeader();
            // } else {
            //     _self.checkHeader();
            // }

            scroll_left = target.scrollLeft;
            if (!cookie.get("moreTip20190130") && !isParse) cookie.set("moreTip20190130", "Y");
        }

    }

	_self.initScroll = function () {
        // if (dom.getElementById("more_btn")) dom.getElementById("more_btn").style.display = "none";
        // util.addEvent(dom.getElementById("re_body_scroll"), "scroll", _self.scrollHorEvent);
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollVerEvent, dom.getElementById("totalbet_body"));
        //dom.getElementById("re_body_scroll").prevScrollBottomIgnore = true;//橫向滾軸物件判斷使用

        // if (getView().viewportwidth < 1440) {
        //     if (dom.getElementById("more_btn")) {
        //         if (dom.getElementById("more_btn").onclick != null)
        //             util.removeEvent(dom.getElementById("more_btn"), "click");
        //         if (cookie.get("moreTip20190130") == "Y") {
        //             dom.getElementById("more_btn").style.display = "none";
        //         } else if (!cookie.get("moreTip20190130")) {
        //             dom.getElementById("more_btn").style.display = "";
        //             util.addEvent(dom.getElementById("more_btn"), "click", _self.scrollHorToRight);
        //         }
        //     }
        // }

	}
	_self.scrollHorToRight = function () {
        dom.getElementById("more_btn").style.display = "none";
        dom.getElementById("re_body_scroll").scrollLeft = dom.getElementById("re_body_scroll").clientWidth;
        if (!cookie.get("moreTip20190130")) cookie.set("moreTip20190130", "Y");
    }

	_self.scrollVerEvent = function (e,targetObj) {
        scroll_e = e;
        _self.scroll_ver_event(e, targetObj);
    }

    _self.scroll_ver_event = function (e, targetObj) {
		var headobj = dom.getElementById("wagers_show") ;
		if (e == null || !headobj ) return;
        var newScrollTop = e.target.scrollTop;
        var ori_h = e.target.scrollHeight;
        var now_h = 0;
		var func_h =  headobj.offsetTop ;
		if (newScrollTop > func_h) {
            util.classFunc(targetObj, "report_fixed");
            now_h = e.target.scrollHeight;
            if (now_h != 0) stop_h = func_h - (ori_h - now_h);
        }
        if(newScrollTop <= func_h){
            util.classFunc(targetObj, "report_fixed", "remove");
            // e.target.scrollTop = func_h;
        }

        _self.checkShowLazyLoading(e.target);
    }


	_self.getDisObj=function(){
        var disArySub = new Object();
        switch (top.login_layer){
			case "ad":
				disArySub["ad"] = "";
				disArySub["d0"] = "";
				disArySub["co"] = "";
				disArySub["su"] = "";
				disArySub["ag"] = "";
				break;
			case "d0":
				disArySub["ad"] = "hide_item";
				disArySub["d0"] = "";
				disArySub["co"] = "";
				disArySub["su"] = "";
				disArySub["ag"] = "";
				break;
			case "co":
				disArySub["ad"] = "hide_item";
				disArySub["d0"] = "hide_item";
				disArySub["co"] = "";
				disArySub["su"] = "";
				disArySub["ag"] = "";
				break;
			case "su":
				disArySub["ad"] = "hide_item";
				disArySub["d0"] = "hide_item";
				disArySub["co"] = "hide_item";
				disArySub["su"] = "";
				disArySub["ag"] = "";
				break;
			case "ag":
				disArySub["ad"] = "hide_item";
				disArySub["d0"] = "hide_item";
				disArySub["co"] = "hide_item";
				disArySub["su"] = "hide_item";
				disArySub["ag"] = "";
				break;
		}
        return disArySub;
    }
}