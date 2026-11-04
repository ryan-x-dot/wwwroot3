function report_main(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "report_main";
    var util;
    var LS;
    var LS_code;
    var cookie;
    var config_set;
    var fastTemplate_a1;
    var eventHandler = new Object();

    var par = new Object();
    var selObj = new Object();
    selObj["result_type"] = new Array("Y","N");
    selObj["report_kind"] = new Array("D","D4");
    selObj["date"] = new Array("yes","to","tm","tw","lw","tp","lp");

    var selectFun = new Object();
    var dateHash = new Object();
    var currencyHash = new Object();
    var periodHash = new Object();
    var boxAry = new Array("summary","period","exchange");

    //arvin
    var displayWtype = null;
    var inWtype = null;

    var sDate = null;
    var eDate = null;

    _self.init=function(){
        util.echo("report_main load complete");
        parentClass.dispatchEvent("chgLeftMenuColor", { "target": "report" });
        selObj["gtype"] = config_set.get("REPORT_GTYPE");
        // selObj["wtype"] = config_set.get("REPORT_WTYPE"); ARVIN wtype 監聽另外做

        //2019-03-29 Ricky 報表玩法查詢展開時，背景下方會空白一塊，補class (orange)
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        //if (getView().viewportwidth <= 767) dom.getElementById("re_mlef767").classList.add("re_mleft767G");

        _self.parseJSON();
        _self.initSelectFun();
        _self.initCalendar();　
        _self.initBar();
        _self.initGameFinish();
        _self.initCurrency();
        _self.initPeriod();
        _self.setSelectEvent();
        _self.setBoxClick();
        _self.setPeriod();

        _self.addEventListener("choseDateEvent", _self.choseDateEvent);
        _self.addEventListener("dateErrorEvent", _self.dateErrorEvent);
        _self.addEventListener("enterDateEvent", _self.enterDateEvent);

        util.addEvent(dom.getElementById("btn_wager"), "click", _self.chgReportType, {"type":"wager","value":"A"});
        util.addEvent(dom.getElementById("btn_cancel"), "click", _self.chgReportType, {"type":"cancel","value":"D"});
        util.addEvent(dom.getElementById("clear_btn"), "click", _self.clearEvent);
        util.addEvent(dom.getElementById("search_btn"), "click", _self.searchEvent);

        _self.setSearchSel(dom.getElementById("wtype_div"), { "_focus": dom.getElementById("wtype_div_sel"), "_setView": dom.getElementById("wtype_div"), "_viewClass": "active" });
        // util.addEvent(dom.getElementById("cleanText"), "click", _self.cleanTextEvent, { "dom": dom.getElementById("searchWtype")});
        util.addEvent(dom.getElementById("wtype_div_600"), "change", _self.selChgEvent, { "rtype": "wtype" });
        util.addEvent(dom.getElementById("allULWtype"), "click", _self.serchSelEvent, { "className": "active" });
        // util.addEvent(dom.getElementById("searchWtype"), "input", _self.changeSearchText,"");
        util.addEvent(win, "resize", _self.orientation);

        parentClass.dispatchEvent("showLoading", {"showLoading":false});
    }

    _self.initPeriod = function(){
        var div_model = dom.getElementById("period_box_model").innerText;
        div_model = div_model.replace("*YEAR*",periodHash["y"]);
        div_model = div_model.replace("*LAST_YEAR*",periodHash["ly"]);

        var html = "";
        var tr_model = dom.getElementById("period_box_tr_model").innerText;
        var data = periodHash["data"];
        for(var i=1;i<=13;i++){
            var str = tr_model;
            var year_id = periodHash["y"]+"_"+i;//
            var last_year_id = periodHash["ly"]+"_"+i;//
            str = str.replace("*ID*",i);
            str = str.replace("*YEAR_ID*",year_id);
            str = str.replace("*LAST_YEAR_ID*",last_year_id);
            str = str.replace("*SE*",data[i]["se"]);
            str = str.replace("*L_SE*",data[i]["l_se"]);
            html+= str;
        }

        div_model = div_model.replace("*CONTENT*",html);
        dom.getElementById("period_box").innerHTML = div_model;
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        config_set = parentClass.getThis("config_set");
        cookie = parentClass.getThis("cookie");
        fastTemplate_a1 = parentClass.getThis("fastTemplate_a1");
    }

    _self.getParentThis=function(varible){
        return parentClass.getThis(varible);
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.parseJSON=function(){
        dateHash = JSON.parse(win.jsonDate);
        currencyHash = JSON.parse(win.jsonCurrency);
        periodHash = JSON.parse(win.jsonPeriod);
        util.echo(dateHash);
    }

    _self.initSelectFun=function(){
        selectFun["result_type"] = _self.chgSel;
        selectFun["report_kind"] = _self.chgSel;
        selectFun["date"] = _self.chgDate;
        selectFun["gtype"] = _self.chgSel;
        // selectFun["wtype"] = _self.chgSel; //ARVIN  wtype 特殊選單 監聽另外寫
    }

    _self.orientation = function () {
        var orientation = win.Math.abs(win.orientation);
        if (orientation == 90 || orientation == 0) {
            _self.initCalendar();
        }
    }

    _self.initCalendar=function(){
        _self.setCalendar(dateHash, "start");
        _self.setCalendar(dateHash, "end");
    }
    //初始預設值
    _self.initBar=function(){
        par["result_type"] = "Y";
        par["gtype"] = "ALL";
        par["wtype"] = "ALL";
        par["date"] = "yes";
        if(!par["report_kind"]) par["report_kind"]="A";

        for(var keys in par){
            var k = par[keys];
            if(keys=="report_kind"){
                if(par[keys]!="A"){
                    k = "D";
                }else{
                    continue;
                }
            }
            _self.chgSel(null,{"rtype":keys,"type":k});
        }
    }

    _self.initGameFinish=function(){

        var ary = new Array("today", "yesterday");
        for(var i=0; i<ary.length; i++){
            var dat = ary[i];
            var obj = dom.getElementById(dat+"_finish");
            obj.innerHTML = dateHash[dat+"_finish"]+"<br>("+dateHash[dat]+")";
            obj.classList.add(dateHash[dat+"_finish_class"]);
        }


        var gAry = config_set.get("GTYPEARY");
        gAry = gAry.concat(new Array("FS"));
        var data = dateHash["game_over_yn"];

        for(var j=0; j<gAry.length; j++){
            var gtype = gAry[j];
            dom.getElementById(gtype+"_yes_set").innerHTML = data[gtype]["yes"]["RESULT_Y"];
            dom.getElementById(gtype+"_yes_un").innerHTML = data[gtype]["yes"]["RESULT_N"];
            dom.getElementById(gtype+"_to_set").innerHTML = data[gtype]["to"]["RESULT_Y"];
            dom.getElementById(gtype+"_to_un").innerHTML = data[gtype]["to"]["RESULT_N"];
        }
    }

    _self.initCurrency=function(){

        // util.echo(currencyHash, "currencyHash");
        if(currencyHash.length==0) return;

        var div_model = dom.getElementById("exchange_box_model");
        var tpl = new fastTemplate_a1();
        tpl.init(div_model.cloneNode(true));

        var curAry = new Array("CODE_NAME","CODE","CODE_VALUE");
        for(var i=0; i<currencyHash.length; i++){
            var curData = currencyHash[i];
            tpl.addBlock("CURRENCY");
            for(var a=0; a<curAry.length; a++){
                var keys = curAry[a];
                tpl.replace(new RegExp("\\\*"+keys+"\\\*","gi"),curData[keys]);
            }
        }

        dom.getElementById("exchange_box").innerHTML = tpl.fastPrint();

    }

    _self.setPeriod=function(){
        var _name = "y"+dateHash["period_year"]+"_"+dateHash["period_num"];
        dom.getElementById(_name).classList.add("on");
    }

    _self.setCalendar=function(dateHash, _name){
        var sPar = new Object();
        sPar.div = dom.getElementById("div_date");
        sPar.input = dom.getElementById("input_"+_name);
        sPar.photo = dom.getElementById("date_"+_name);
        sPar.def_date = dateHash.yesterday;
        sPar.langx = top.langx;
        sPar.CalendarClass = win.ClassFankCal_ag;
        sPar.period_ls = dateHash.period_ls;
        sPar.WEB_TIME_ZONE = dateHash.WEB_TIME_ZONE;

        // var sDate = new win.calendar_ag(win,dom);
        // sDate.setParentclass(_self);
        // sDate.init(sPar);

        if(_name=="start"){
            if(sDate==null){
                sDate = new win.calendar_ag(win,dom);
                sDate.setParentclass(_self);
                sDate.init(sPar);
            }else{
                sDate.restart();
            }
        }
        if(_name=="end"){
            if(eDate==null){
                eDate = new win.calendar_ag(win,dom);
                eDate.setParentclass(_self);
                eDate.init(sPar);
            } else {
                eDate.restart();
            }
        }
    }



    _self.chgReportType=function(e, param){
        var type = param.type;
        par["report_kind"] = param.value;
        dom.getElementById("btn_wager").classList.remove("on");
        dom.getElementById("btn_cancel").classList.remove("on");
        dom.getElementById("btn_"+type).classList.add("on");
        if(type=="wager"){
            dom.getElementById("result_type_div").style.display = "";
            dom.getElementById("report_kind_div").style.display = "none";
            dom.getElementById("result_type_div_600").parentNode.style.display = "";
            dom.getElementById("report_kind_div_600").parentNode.style.display = "none";
        }else{
            dom.getElementById("result_type_div").style.display = "none";
            dom.getElementById("report_kind_div").style.display = "";
            dom.getElementById("result_type_div_600").parentNode.style.display = "none";
            dom.getElementById("report_kind_div_600").parentNode.style.display = "";
        }

    }

    _self.setBoxClick=function(){
        for(var i=0; i<boxAry.length; i++){
            var _name = boxAry[i];
            util.addEvent(dom.getElementById(_name+"_btn"), "click", _self.chgBoxDiv, {"type":_name});
            util.addEvent(dom.getElementById(_name+"_600"), "click", _self.goto600, {"type":_name});
        }
    }

    _self.chgBoxDiv=function(e, param){
        for(var i=0; i<boxAry.length; i++){
            var _name = boxAry[i];
            dom.getElementById(_name+"_box").style.display = "none";
            dom.getElementById(_name+"_btn").classList.remove("on");
        }
        dom.getElementById(param.type+"_box").style.display = "";
        dom.getElementById(param.type+"_btn").classList.add("on");
    }

    _self.goto600=function(e, param){
        parentClass.dispatchEvent("bodyGoToPage", {"page":"report_"+param.type,"pageName":param.type});
    }

    _self.setSelectEvent=function(){
        for(var rtype in selObj){

            var rDom_600 = dom.getElementById(rtype + "_div_600");
            util.addEvent(rDom_600, "change", _self.selChgEvent, { "rtype": rtype });

            var ary = selObj[rtype];
            var rDom = dom.getElementById(rtype + "_div");
            var rSel = dom.getElementById(rtype + "_sel");
            util.setInfEvent(rDom, { "_focus": rSel, "_setView": rDom, "_viewClass": "active" });
            for(var i=0; i<ary.length; i++){
                var type = ary[i];
                util.addEvent(dom.getElementById(rtype+"_"+type), "click", selectFun[rtype], {"rtype":rtype,"type":type});
            }

        }
    }

    _self.showDiv=function(e, param){
        var obj = dom.getElementById(param.rtype+"_div");
        if (obj.classList.contains("active")){
            obj.classList.remove("active");
        }else{
            obj.classList.add("active");
            obj.focus();
        }
    }

    _self.selChgEvent=function(e, param){
        param.type = e.target.value;
        if (param.rtype == "date"){
            _self.chgDate(e, param);
        }else{
            _self.chgSel(e, param);
        }
    }

    //畫面顯示對應的預設值
    _self.chgSel=function(e, param){
        var rtype = param.rtype;
        var type = param.type;
        // util.echo("["+classname+"][chgSel]"+rtype+","+type);
        par[rtype] = type;
        dom.getElementById(rtype+"_now").innerHTML = dom.getElementById(rtype+"_"+type).innerHTML;

        try {
            dom.getElementById(rtype + "_div_600").value = type;
        } catch (e) {
            util.err("[chgSel]" + rtype + "_div_600" + type, e);
        }
    }

    _self.chgDate=function(e, param){
        util.echo("["+classname+"][chgDate]"+param.type);
        // selObj["date"] = new Array("yes","to","tm","tw","lw","tp","lp");
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
                // date_s = _self.getWeek(1, 0 ,dateHash);
                // date_e = _self.getWeek(7, 0 ,dateHash);
                break;
            case "lw":
                date_s = dateHash["last_week_s"];
                date_e = dateHash["last_week_e"];
                // date_s = _self.getWeek(1, -1 ,dateHash);
                // date_e = _self.getWeek(7, -1 ,dateHash);
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
        // date_s = date_s.replace(/-/g," - ");
        date_e = date_e.replace(/ /g,"");
        // date_e = date_e.replace(/-/g," - ");
        util.echo(date_s);
        util.echo(date_e);
        dom.getElementById("input_start").value = date_s;
        dom.getElementById("input_end").value = date_e;
        _self.chgSel(e, param);
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

    _self.choseDateEvent=function(param){
        // util.echo("["+classname+"][choseDateEvent]"+param.date);
    }

    _self.dateErrorEvent=function(param){
        // util.echo("["+classname+"][dateErrorEvent]");
    }

    _self.enterDateEvent=function(param){
        // util.echo("["+classname+"][enterDateEvent]");
    }

    //clear
    _self.clearEvent=function(){
        _self.initCalendar();
        _self.initBar();
    }

    //search
    _self.searchEvent=function(){
        util.checkReportTeach(cookie, parentClass);
        if(cookie.get("isclick")){
            cookie.del("isclick");
        }
        _self.checkReport(_self.gotoReport);
        if (cookie.get("moreTip20190130")) cookie.del("moreTip20190130");
    }

    _self.checkReport=function(retFun){
        var str = "";
        str+=top.param;
        str+="&p=check_report";

        var d_s = dom.getElementById("input_start").value;
        var d_e = dom.getElementById("input_end").value;
        d_s = d_s.replace(/ /g,"");
        d_e = d_e.replace(/ /g,"");

        str+="&date_start="+d_s;
        str+="&date_end="+d_e;
        str+="&result_type="+par["result_type"];
        str+="&report_kind="+par["report_kind"];

        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
        hr.setParentclass(_self);
        hr.addEventListener("onError", function(){});
        hr.addEventListener("LoadComplete", function(json){
            var hash;
            try{
                hash = JSON.parse(json);
                if(util.chkErrorMsg(hash,LS_code)) return;
            }catch(e){
                util.err("["+classname+"]", e);
                util.showErrorMsg("data error");
                return;
            }

            if(hash["status"]=="200"){
                retFun();
            }else{
                util.showErrorMsg(hash["msg"]);
            }
        });
		hr.loadURL(top.url, "POST", str);
    }

    _self.gotoReport=function(){
        var d_s = dom.getElementById("input_start").value;
        var d_e = dom.getElementById("input_end").value;

        d_s = d_s.replace(/ /g,"");
        d_e = d_e.replace(/ /g,"");

        var postHash = new Object();
        postHash["report_kind"] = par["report_kind"];
        postHash["report_type"] = "set";
        postHash["result_type"] = par["result_type"];
        if(postHash["report_kind"]=="D"||postHash["report_kind"]=="D4"){
            postHash["result_type"] = "N";
        }
        postHash["date"] = par["date"];
        postHash["date_start"] = d_s;
        postHash["date_end"] = d_e;
        postHash["gtype"] = par["gtype"];
        postHash["wtype"] = par["wtype"];
        postHash["view_layer"] = top.login_layer;
        postHash["WEB_TIME_ZONE"] = dateHash.WEB_TIME_ZONE;
        var param = new Object();
        param["page"] = "report_"+top.login_layer;
        param["post"] = "view_layer="+top.login_layer;
        param["postHash"] = postHash;
        param["extendsClass"] = "report_index";
        parentClass.dispatchEvent("bodyGoToPage", param);

    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
	}
    //----------------------------------------------------------------------------------------------------------------------------------------
    _self.setSearchSel = function (icon, param){
        util.addEvent(icon, "click", _self.setSCEvent, { "icon": icon, "param": param });
    }

    _self.setSCEvent = function (e, _par){
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

    _self.cleanTextEvent = function(evt,param){
        param.dom.value = "";
        param.dom.focus();
        _self.recoveyDispalyWtype();
    }

    _self.serchSelEvent = function (evt, param){
        var DOM = evt.target;
        if (DOM.tagName == "LI"){
            par["wtype"] = DOM.id.split("_")[1];
            dom.getElementById("wtype_div").classList.remove(param.className);
            _self.recoveyDispalyWtype();
            //印上innerHTML 與 清空 text
            dom.getElementById("wtype_now").innerHTML = DOM.innerHTML
            dom.getElementById("searchWtype").value = "";
        }
    }
    //輸入匡異動
    _self.changeSearchText = function (evt, param){
        var DOM = evt.target;
        var searchStr = DOM.value;
        if (searchStr == ""){
            _self.recoveyDispalyWtype();
        }else{
            var allULWtype = document.getElementById("allULWtype");
            var wtypeLIId = allULWtype.getElementsByTagName("LI");
            for (var i = 0, len = wtypeLIId.length; i < len; i++) {
                var targerDOMid = wtypeLIId[i].textContent.toLowerCase();
                var vanishLI = "none";
                if (targerDOMid.indexOf(searchStr.toLowerCase()) != -1) vanishLI = "";
                wtypeLIId[i].style.display = vanishLI;
            }
        }
    }
    //恢復所有選項
    _self.recoveyDispalyWtype = function(){
        var allULWtype = document.getElementById("allULWtype");
        var wtypeLIId = allULWtype.getElementsByTagName("LI");
        for (var i = 0, len = wtypeLIId.length; i < len; i++) {
            wtypeLIId[i].style.display = "";
        }
    }
    //----------------------------------------------------------------------------------------------------------------------------------------

}