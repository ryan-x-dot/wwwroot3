
function report_filter(_win, _dom, _post){
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

    var sDate = null;
    var eDate = null;

    selObj["result_type"] = new Array("Y","N");
    selObj["report_kind"] = new Array("D","D4");
    selObj["date"] = new Array("yes","to","tm","tw","lw","tp","lp");

    _self.init=function(){
        util.echo(classname+" load complete");

        selObj["gtype"] = config_set.get("REPORT_GTYPE");
        // selObj["wtype"] = config_set.get("REPORT_WTYPE");

        util.addEvent(dom.getElementById("back_btn"), "click", _self.backEvent);
        util.addEvent(dom.getElementById("f_search_btn"), "click", _self.filterSubmit);
        _self.initSelectFun();
        _self.setSelectEvent();

        _self.setSearchSel(dom.getElementById("f_wtype_div"), { "_focus": dom.getElementById("f_wtype_div_sel"), "_setView": dom.getElementById("f_wtype_div"), "_viewClass": "active" });
        // util.addEvent(dom.getElementById("f_cleanText"), "click", _self.cleanTextEvent, { "dom": dom.getElementById("f_searchWtype") });
        util.addEvent(dom.getElementById("f_wtype_div_600"), "change", _self.selChgEvent, { "rtype": "wtype" });
        util.addEvent(dom.getElementById("f_allULWtype"), "click", _self.serchSelEvent, { "className": "active" });
        // util.addEvent(dom.getElementById("f_searchWtype"), "input", _self.changeSearchText, "");
        util.addEvent(win, "resize", _self.orientation);

        parentClass.dispatchEvent("showLoading", { "showLoading": false });
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

        /*var sDate = new win.calendar_ag(win,dom);
        sDate.setParentclass(_self);
        sDate.setName(_name);
        sDate.init(sPar);*/
        if (_name == "start") {
            if (sDate == null) {
                sDate = new win.calendar_ag(win, dom);
                sDate.setParentclass(_self);
                sDate.setName(_name);
                sDate.init(sPar);
            } else {
                sDate.restart();
            }
        }
        if (_name == "end") {
            if (eDate == null) {
                eDate = new win.calendar_ag(win, dom);
                eDate.setParentclass(_self);
                eDate.setName(_name);
                eDate.init(sPar);
            } else {
                eDate.restart();
            }
        }
    }

    _self.initFilter=function(param){
        par["result_type"] = param["result_type"];
        par["gtype"] = param["gtype"];
        par["wtype"] = param["wtype"];
        par["report_kind"] = param["report_kind"];
        par["date"] = param["date"];
        par["date_start"] = param["date_start"];
        par["date_end"] = param["date_end"];
        par["report_type"] = param["report_type"];
        selPar = util.clone(par);

        if(par["report_kind"]=="A"){
            _self.chgSel(null,{"rtype":"result_type","type":par["result_type"]});
        }else{
            _self.chgSel(null,{"rtype":"report_kind","type":par["report_kind"]});
        }
        _self.chgSel(null,{"rtype":"date","type":par["date"]});
        _self.chgSel(null,{"rtype":"gtype","type":par["gtype"]});
        _self.chgSel(null,{"rtype":"wtype","type":par["wtype"]});
        _self.setPageName(param);
        _self.getData();
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
        // }

        var tmpRtype = (rtype=="report_kind")? "result_type":rtype;
        // util.echo("f_"+tmpRtype+"_now");
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

}