function data_manger(_win, _dom, _toppar){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "data_manger";
    var util;
    var LS;
    var config_set;
    var LS_code;
    var _mc = new Object();

    var bodyFrame = null;
    var parentClass;
    var storage;
    var ary = ["match","bet","log","mes"];
    var dateHash = new Object();



    _self.init=function(){
        //console.log(myDate.toLocaleDateString().replace(/\//g,'-'));
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        parentClass.dispatchEvent("chgPageName", {"pageType": "setting", "pageName": "data"});
        parentClass.dispatchEvent("chgLeftMenuColor", {"target": "setting"});
        _top.popWindow = new Object();
        getView = parentClass.getThis("getView");

        view_w = getView().viewportwidth;//螢幕畫面大小
        util.addEvent(dom.getElementById("btn_OPTIMIZE"),"click",_self.setManger,{"action":"OPTIMIZE"});
        util.addEvent(dom.getElementById("btn_REPAIR"),"click",_self.setManger,{"action":"REPAIR"});
        util.addEvent(dom.getElementById("btn_COPY"),"click",_self.setManger,{"action":"COPY"});
        if(top.login_layer == "ad"){
            dom.getElementById("div_match_date").remove();
            ary = ["bet","log","mes"];
        }
        _self.parseJSON();
        _self.initCalendar();

        parentClass.dispatchEvent("showLoading", {"showLoading":false});

    }

    _self.initCalendar=function(){
        for (var i in ary){
            _self.setCalendar(dateHash, ary[i]);
            util.addEvent(dom.getElementById("btn_"+ary[i]+"_close"),"click",_self.setManger,{"action":"DELETE","type":ary[i]})
        }
    }

    _self.parseJSON=function(){
        dateHash = JSON.parse(win.jsonDate);
        util.echo(dateHash);
    }

    _self.setCalendar=function(dateHash, _name){
        var sPar = new Object();
        sPar.div = dom.getElementById("div_"+_name+"_date");
        sPar.input = dom.getElementById("input_"+_name);
        sPar.photo = dom.getElementById("date_"+_name);
        sPar.def_date = dateHash.today;
        sPar.langx = top.langx;
        sPar.CalendarClass = win.ClassFankCal_ag;
        sPar.period_ls = dateHash.period_ls;
        sPar.WEB_TIME_ZONE = dateHash.WEB_TIME_ZONE;

        // var sDate = new win.calendar_ag(win,dom);
        // sDate.setParentclass(_self);
        // sDate.init(sPar);

        var sDate = new win.calendar_data(win,dom);
        sDate.setParentclass(_self);
        sDate.init(sPar);
    }

    _self.setManger = function(e,_param){
        parentClass.dispatchEvent("showLoading", {"showLoading":true});
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&action="+_param.action;
        if(_param.action=="DELETE"){
            par += "&showtype="+_param.type;
            par += "&date="+dom.getElementById("input_"+_param.type).value;
        }
        var param = "p=get_data_manger&ver=" + top.ver + "&"+par;

        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.saveFinish);
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.saveFinish = function(json){
        var hash;
        try {
            hash = JSON.parse(json);
        } catch (e) {
            util.err("[" + classname + "]", e);
            return;
        }

        if (hash.status == "error") {
            var error_msg = util.showTxt(hash.msg);
            util.chkErrorMsg(hash, error_msg);
        } else {
            parentClass.dispatchEvent("showFadeOutMesg", { "text": hash.msg ,"s":5});
        }
        parentClass.dispatchEvent("showLoading", {"showLoading":false});
    }

    _self.setParentclass = function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        Cookie = parentClass.getThis("cookie");
        config_set = parentClass.getThis("config_set");
        _top = parentClass.getThis("top");
        timerHash = parentClass.getThis("timerHash");
        bodyFrame = parentClass.getThis("bodyFrame");
        storage = parentClass.getThis("Storage");
    }


}
