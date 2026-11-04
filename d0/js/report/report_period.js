
function report_period(_win, _dom, _post){
    var _self = this;
    var classname = "report_period";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var postHash = _post;
    var periodHash = new Object();
    var util;
    var config_set;
    var LS_code;
    var eventHandler = new Object();

    _self.init=function(){
        util.echo(classname+" load complete");
        _self.setPeriod();
        var ary = dom.getElementsByName("menu_btn");
        for(var i=0; i<ary.length; i++){
            var obj = ary[i];
            util.addEvent(obj, "click", _self.chgDiv, {"type":obj.id});
        }

    }

    _self.setPeriod = function (){
        var re_main = dom.getElementById("re_main");
        var tpl = re_main.innerHTML;
        periodHash = JSON.parse(win.jsonPeriod);
        tpl = tpl.replace(new RegExp("\\\*YEAR\\\*","gi"), periodHash["y"]);
        tpl = tpl.replace(new RegExp("\\\*LAST_YEAR\\\*","gi"), periodHash["ly"]);
        re_main.innerHTML = tpl;
        var data = periodHash.data;
        var control = "";
        var control1 = "";
        for(var i=1;i<=13;i++){
            control += '<tr><td id="y'+periodHash["y"]+'_'+i+'" data-accmonth="'+i+'">'+data[i]["se"]+'</td></tr>';
            control1+= '<tr><td id="y'+periodHash["ly"]+'_'+i+'" data-accmonth="'+i+'">'+data[i]["l_se"]+'</td></tr>';
        }
        dom.getElementById("tab_y"+periodHash["y"]).innerHTML = control;
        dom.getElementById("tab_y"+periodHash["ly"]).innerHTML = control1;
        _self.getData();
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        config_set = parentClass.getThis("config_set");
        LS_code = parentClass.getThis("LS_code");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.getParentThis=function(varible){
        return parentClass.getThis(varible);
    }

    _self.getData=function(){
        var str = "";
        str+=top.param;
        str+="&p=get_report_summary";
        str+="&type=period";
    
        hr = new win.HttpRequestRetry(win.HttpRequest, config_set.get("RETRY_TIME"), config_set.get("RETRY_LIMIT"));
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



        var _name = "y"+hash["period"]["period_year"]+"_"+hash["period"]["period_num"];
        dom.getElementById(_name).classList.add("word_blue");

        _self.chgDiv(null, {"type":"y"+hash["period"]["period_year"]});
        parentClass.dispatchEvent("showLoading", {"showLoading":false});
    }

   

    _self.chgDiv=function(e, param){
        var ary = dom.getElementsByName("menu_btn");

        for(var i=0; i<ary.length; i++){
            var obj = ary[i];
            obj.classList.remove("on");
            dom.getElementById("tab_"+obj.id).style.display = "none";
        }

        dom.getElementById(param.type).classList.add("on");
        dom.getElementById("tab_"+param.type).style.display = "";
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
	}

}