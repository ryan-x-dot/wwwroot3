function setting_autoreg_index(_win, _dom, _toppar){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "setting_autoreg_index";
    var util;
    var LS;
    var LS_code;
    var _mc = new Object();
    var eventHandler = new Object();
    var toppar = _toppar;

    _self.init = function(){
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        parentClass.dispatchEvent("chgPageName", {"pageType": "setting", "pageName": "curl"});
        parentClass.dispatchEvent("chgLeftMenuColor", {"target": "setting"});

        if (toppar["setting_showtype"] == null) {
            toppar["setting_showtype"] = top.setting_showtype;
        } else {
            top.setting_showtype = toppar["setting_showtype"];
        }

        util.addEvent(dom.getElementById("btn_save_autoreg"), "click", _self.saveAutoRegEvent);
        _self.loadAutoRegConf();
        parentClass.dispatchEvent("showLoading", {"showLoading": false});
    }

    _self.getConfParam = function(){
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        return par;
    }

    // 加载自动开号配置
    _self.loadAutoRegConf = function(){
        var getHttp = new HttpRequest();
        var param = _self.getConfParam();
        getHttp.addEventListener("LoadComplete", _self.loadAutoRegFinish);
        param = "p=get_setting_curl&ver=" + top.ver + "&showtype=AUTOREG&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.loadAutoRegFinish = function(data){
        var arr_data;
        try {
            arr_data = JSON.parse(data);
        } catch(e){
            util.err("[" + classname + "]", e);
            return;
        }
        if(arr_data && arr_data.auto_reg_num){
            dom.getElementById("input_auto_reg_num").value = arr_data.auto_reg_num;
        }
        if(arr_data && arr_data.auto_reg_interval){
            dom.getElementById("input_auto_reg_interval").value = arr_data.auto_reg_interval;
        }
        if(arr_data && arr_data.auto_reg_mem_url){
            dom.getElementById("input_auto_reg_mem_url").value = arr_data.auto_reg_mem_url;
        }
    }

    // 保存配置并打开新窗口执行开号
    _self.saveAutoRegEvent = function(mouseEvent, targetObj){
        var num = dom.getElementById("input_auto_reg_num").value;
        var interval = dom.getElementById("input_auto_reg_interval").value;
        var memUrl = dom.getElementById("input_auto_reg_mem_url").value;

        if(num == "" || parseInt(num) < 1){
            dom.getElementById("msg_auto_reg_num").innerHTML = "请输入有效的数量(1-100)";
            dom.getElementById("msg_auto_reg_num").style.color = "red";
            return;
        }
        if(memUrl == "" || memUrl.trim() === ""){
            dom.getElementById("msg_auto_reg_mem_url").innerHTML = "请输入会员登录URL（前台域名）";
            dom.getElementById("msg_auto_reg_mem_url").style.color = "red";
            return;
        }
        // 重置错误提示
        dom.getElementById("msg_auto_reg_num").innerHTML = "设置每次自动开号的账号数量(1-100)";
        dom.getElementById("msg_auto_reg_num").style.color = "";
        dom.getElementById("msg_auto_reg_mem_url").innerHTML = "会员前台域名（chk_login 接口地址），不是代理域名";
        dom.getElementById("msg_auto_reg_mem_url").style.color = "";

        memUrl = memUrl.replace(/\/+$/, ""); // 去掉末尾斜杠

        // 1. 先保存配置（数量+间隔+mem_url）
        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", function(data){
            var arr_data;
            try { arr_data = JSON.parse(data); } catch(e){ arr_data = {}; }
            if(arr_data.status == "error"){
                var error_msg = util.showTxt(arr_data.msg);
                util.chkErrorMsg(arr_data, error_msg);
                return;
            }
            // 2. 保存成功后弹出新窗口执行开号
            var runUrl = "ag_autoreg.php?num=" + encodeURIComponent(num) + "&interval=" + encodeURIComponent(interval || "5") + "&mem_url=" + encodeURIComponent(memUrl) + "&uid=" + encodeURIComponent(top.uid) + "&_=" + (new Date().getTime());
            var w = win.open(runUrl, "ag_autoreg_run", "width=700,height=600,scrollbars=yes,resizable=yes");
            if(!w){
                parentClass.dispatchEvent("showFadeOutMesg", {"text": "请允许弹出窗口后重试", "s": 5});
            }else{
                parentClass.dispatchEvent("showFadeOutMesg", {"text": "已启动开号任务窗口", "s": 5});
            }
        });
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&type=AUTOREG";
        par += "&auto_reg_num=" + num;
        par += "&auto_reg_interval=" + (interval || "5");
        par += "&auto_reg_enabled=0"; // 不再依赖后台定时任务，始终传 0
        par += "&auto_reg_mem_url=" + encodeURIComponent(memUrl);
        var param = "p=body_setting_curl_add&ver=" + top.ver + "&" + par;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.saveAutoRegFinish = function(data){
        // 已合并到 saveAutoRegEvent 的回调中，保留空函数避免外部调用报错
    }

    _self.setParentclass = function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
    }

    _self.getThis = function(varible){
        return eval(varible);
    }

    _self.exitEvent = function(){
        return true;
    }

    _self.addEventListener = function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

    _self.getComplete = function(){
    }

    _self.onError = function(){
    }
}
