function wmc_index(_win, _dom){
    var _self = this;
    var classname = "wmc_index";
    var win = _win;
    var dom = _dom;
    var parentClass;

    var util = new win.util(win,dom);
    var config_set = new win.config_set();
    var storage = new LocalstorageManager();
    var Timer = win.Timer;
    var getView = win.getView;
    var fastTemplate_a1 = win.fastTemplate_a1;
    var cookie = new CookieManager();
    var eventHandler = new Object();
    var retryTimer;
    var bodyFrame = null;
    var failCount = new Object();
    var first_load = false;
    var cache_html_sw = false;
    var pageHash = new Object();
    var classHash = new Object();
    var timerHash = new Object();
    var defalutPage = false;
    var filterFrame = null;
    var LS;
    var LS_code;
    var alertFrame = null;
    var _top;

    
    
    top.url = util.getWebUrl()+"/transform.php";
    top["htmlAry"] = new Array();
    top["keepCss"] = new Array();

    _self.init = function(){
        if(opener == null){
            // alert("I want to play a Game.");
            window.close();
            return;
        }
        top.uid = opener.top.uid;
        top.langx = opener.top.langx;
        top.login_layer = opener.top.login_layer;
        top.ver = opener.top.ver;
        top.param = "login_layer="+top.login_layer+"&uid="+top.uid+"&langx="+top.langx+"&ver="+top.ver;
        top.ls = opener.top.ls;
        top.username = opener.top.username;
        top.user_id = opener.top.user_id;


        
        _self.initTool();
        // _self.bodyGoToPage({"page":"wmc","isTrans":"Y","parentClass":parentClass,"retFun":_self.checkOpener});
        _self.addEventListener("showAlertMsg", _self.showAlertMsg);
        _self.addEventListener("hideAlertMsg", _self.hideAlertMsg);        
        _self.addEventListener("showFilter", _self.showFilter);
        _self.addEventListener("hideFilter", _self.hideFilter);
        _self.addEventListener("changeFilter", _self.changeFilter);
        _self.addEventListener("showFilterLoading", _self.showFilterLoading);
        _self.addEventListener("closeFilterLoading", _self.closeFilterLoading);
        _self.setParentclass();


        try{
            var load_name = dom.getElementById("load_txt");
            var load_name02 = dom.getElementById("load_txt02");
            load_name.innerHTML = LS.get("loading_txt");
            load_name02.innerHTML = LS.get("loading_txt");
        }catch(e){}
        
        _self.bodyGoToPage({"page":"wmc","retFun":_self.checkOpener});
    }


    _self.initTool = function(){
        config_set.init();
        LS = eval("new LS_"+top.ls+"();");
        LS_code = eval("new LS_code_"+top.ls+"();");
        LS.init();
        LS_code.init();
        _self.showAlert_msg();
    }

    _self.setParentclass = function(){
        util.setParentclass(_self);
    }

    _self.getThis = function(varible){
        return eval(varible);
    }

    _self.getParentThis = function(varible){
        return parentClass.getThis(varible);
    }

    _self.checkOpener = function(){
        // console.log("WMC Complete!!!!");
        _self.setLoadingVisible(false);
        
    }
    
    _self.showLoading = function(param){
        if(!defalutPage) defalutPage = param.defalutPage;
        else _self.setLoadingVisible(param.showLoading);
    }

    _self.setLoadingVisible = function(isShow){
        dom.getElementById("loading").style.display = isShow?"":"none";
    }

    _self.bodyGoToPage = function(param){
        if (bodyFrame && bodyFrame.exitConfirm && !bodyFrame.LeaveChk && !param.LeaveChkPass) {
            //exitConfirm 離開確認參數
            //LeaveChk confirm後可否離開
            //LeaveChkPass param帶參數強制掉過此判斷
            _self.exitConfirm(_self.bodyGoToPage, param, bodyFrame.exitConfirm);
            return;
        } else {
            _self.setLoadingVisible(true);

            var ret = false;
            if (bodyFrame && bodyFrame.exitEvent){
                ret = bodyFrame.exitEvent();
            }else{
                ret = true;
            }

            if(ret){
                ret = _self.clearAllTimer();
                if(ret) _self.goToPage("body_show", param.page, _self.definedParent, param);
            }
        }
    }

    _self.definedParent = function(param){
        // console.log(param);
        try{
            var obj = classHash[param.page];
            if(param["extendsClass"]){
                obj = util.extendsClass(eval("new "+param["extendsClass"]+"(win,dom,param.postHash)"), eval(param.page), win, dom, param["postHash"]);
            }else{
                obj = eval("new "+param.page+"(win,dom,param.postHash);");
            }
            if(param.isTrans=="Y"){
                var parantClass = (param.parentClass!=null)?param.parentClass:_self;
                obj.setParentclass(parantClass);
                obj.init();
                if (param.retChild) param.retChild(obj);
            }else{
                bodyFrame = obj;
                bodyFrame.setParentclass(_self);
                bodyFrame.init();
            }
        }catch(e){
            util.err("[definedParent]["+param.page+"]", e);
        }

        if(param.retFun) param.retFun(param.retParam);
    }

    _self.exitConfirm = function (retFun, param, confirm_par) {
        if (confirm_par.isEdit && !confirm_par.isEdit()){
            bodyFrame.LeaveChk = true;
            retFun(param);
            return;
        }
        _self.showLoading({ "showLoading": false });
        util.showMsg(confirm_par["Alert"].msg, confirm_par["Alert"].mode, function (msg) {
            if (msg == "yes") {
                bodyFrame.LeaveChk = true;
                //當確認離開時有留下遺言 做ifYes
                if (confirm_par.ifYes) {
                    confirm_par.ifYes(confirm_par.YesParam);
                }
                retFun(param);
            } else {
                bodyFrame.LeaveChk = false;
                //當不想離開時要把畫面還原等動作 做ifNo
                if (confirm_par.ifNo) {
                    confirm_par.ifNo(confirm_par.NoParam);
                }
                return false;
            }
        });
    }

    _self.goToPage = function(target, page, retFun, param){

        clearTimeout(retryTimer);
        if(!failCount[page]) failCount[page] = 0;

        var page_name = target+"_"+page+"_"+top.ver;
        var retryLimit = config_set.get("RETRY_LIMIT");
        var retryTime = config_set.get("RETRY_TIME");

        var ht = new HttpRequest();
        ht.addEventListener("onError", function(){
            if(failCount[page] < retryLimit){
                failCount[page]++;
                retryTimer = setTimeout(_self.goToPage, retryTime, target, page, retFun, param);
            }else{
                if(target=="body_show") bodyFrame.init();
                _self.setLoadingVisible(false);
            }
        });

        ht.addEventListener("LoadComplete", function(html){
            failCount[page] = 0;

            var tempHtml = new win.parseHTML(html);
            var dbody = tempHtml.getTag("div")[0];
            var sty = tempHtml.getTag("style");
            var scp = tempHtml.getTag("script");

            if(!dbody){
                try{
                    var errHash = JSON.parse(html);
                    if(util.chkErrorMsg(errHash,LS_code)) return;
                }catch(e){
                    util.err("["+classname+"]", e);
                }
            }

            // 將不必要的js css移除，避免負擔
            var ret = false;
            if (first_load && target=="body_show"){
                ret =  _self.clearHead();
            }else{
                ret = true;
            }

            if(ret){
                for(var j=0; j<scp.length; j++){
                    try{
                        var scpt = document.createElement("script");
                        if(scp[j].src){
                            scpt.src = scp[j].src;
                        }else{
                            scpt.innerHTML = scp[j].innerHTML;
                            scpt.id = page+"JS";
                        }
                        dom.getElementsByTagName("head")[0].appendChild(scpt);
                    }catch(e){
                        util.err("["+classname+"]", e);
                    }
                }

                for(var i=0; i<sty.length; i++){
                    sty[i].id = page+"CS";
                    dom.getElementsByTagName("head")[0].appendChild(sty[i]);
                }

                pageHash[page_name] = dbody.innerHTML;
                dom.getElementById(target).innerHTML = dbody.innerHTML;

                retFun(param);
            }
        });

        if(cache_html_sw && pageHash[page_name]){
            dom.getElementById(target).innerHTML = pageHash[page_name];
            retFun(param);
        }else{
            var _post = "p="+page+"&ver="+top.ver+"&login_layer="+top.login_layer+"&langx="+top.langx;
            if(top.uid!="")_post+="&uid="+top.uid;
            if(param.post) _post+="&"+param.post;
            ht.loadURL(top.url, "POST" , _post);
        }

    }

    _self.addEventListener = function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.clearAllTimer = function(isInit){
        for(var keys in timerHash){
            if(isInit){
                if(timerHash[keys]!=null){
                    timerHash[keys].clearObj();
                    timerHash[keys] = null;
                }
            }else{
                if(timerHash[keys]!=null && !timerHash[keys].dont_clear){
                    timerHash[keys].clearObj();
                    timerHash[keys] = null;
                }
            }
        }

        return true;
    }

    _self.dispatchEvent=function(eventname, param){
        // util.echo("["+classname+"][dispatchEvent]"+eventname);
        // console.log(eventname);
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

//======小過濾器======
    _self.showFilter=function(param){
        // console.log(param);
        if(filterFrame==null){
            _self.goToPage("wmc_filter_show", "wmc_filter", function(){
                try{
                    filterFrame = new win.wmc_filter(win,dom);
                    filterFrame.setParentclass(_self);
                    filterFrame.init();
                    filterFrame.initFilter(param);
                }catch(e){
                    util.err("[showFilter][report_filter]", e);
                }
            }, param);
        }else{
            filterFrame.initFilter(param);
        }
        _self.showFilterLoading();
        _self.showDiv({"type":"wmc_filter_show"});
    }

    _self.hideFilter=function(param){
        // console.log("index");
        _self.showDiv({"type":"body_show"});
        filterFrame = null;
    }

    _self.changeFilter=function(param){
        try{
            bodyFrame.changeFilter(param);
        }catch(e){
            util.err("[changeFilter]", e);
        }
        _self.hideFilter(null);
    }
    
    _self.showDiv=function(param){
        // dom.getElementById("acc_show").style.display = "none";
        // console.log(param);
        dom.getElementById("body_show").style.display = "none";
        dom.getElementById("wmc_filter_show").style.display = "none";
        dom.getElementById(param.type).style.display = "";
    }

    _self.showFilterLoading=function(param){
        try{
            dom.getElementById("filter_loading").style.display = "";
        }catch(e){
            // util.err("[filter_loading]", e);
        }
    }
    _self.closeFilterLoading=function(param){
        try{
            dom.getElementById("filter_loading").style.display = "none";
        }catch(e){
            // util.err("[filter_loading]", e);
        }
    }

//======小過濾器======



//=======alert

_self.showAlert_msg=function(param){
    //alert msg
    _self.goToPage("alert_show", "alert_msg", function(){
        try{
            alertFrame = new win.alert_msg(win,dom);
            alertFrame.setParentclass(_self);
            alertFrame.init();
        }catch(e){
            util.err("[alert_msg]", e);
        }
    },{});
    
}

_self.showAlertMsg=function(param){
    alertFrame.showMsg(param);
    dom.getElementById("alert_show").style.display = "";
}

_self.hideAlertMsg=function(param){
    alertFrame.clearMsg();
    dom.getElementById("alert_show").style.display = "none";
}
//=======alert
    
}