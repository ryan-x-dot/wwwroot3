function footer(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var choose_lanF;
    var new_urlF;
    var featureF;
    var requirementsF;
    var live_chatF;
    var lang_listF;
    var lang_selectF;
    var PC_check;
    var check = true;
    _self.init = function() {
        choose_lanF = dom.getElementById("choose_lanF");
        new_urlF = dom.getElementById("new_urlF");
        featureF = dom.getElementById("featureF");
        requirementsF = dom.getElementById("requirementsF");
        live_chatF = dom.getElementById("live_chatF");
        lang_listF = dom.getElementById("lang_listF");
        lang_selectF = dom.getElementById("lang_selectF");
        util.addEvent(choose_lanF, "click", _self.choose_lan);
        util.addEvent(new_urlF, "click", _self.changePage, {
            "page": "new_url"
        });
        util.addEvent(featureF, "click", _self.changePage, {
            "page": "feature"
        });
        util.addEvent(requirementsF, "click", _self.changePage, {
            "page": "requirements"
        });
        util.addEvent(live_chatF, "click", _self.liveChatOpen);
        util.addEvent(choose_lanF, "blur", _self.onBlurEventHandler);
        PC_check = _self.isPC();
        if (PC_check)
            _self.showLS(top.ls);
        else
            _self.showLS_Ph()
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.choose_lan = function() {
        var _param = new Array;
        try {
            var selLayer = "";
            if (top.login_layer == "co")
                selLayer = "A";
            else if (top.login_layer == "su")
                selLayer = "B";
            else if (top.login_layer == "ag")
                selLayer = "C";
            var _postHashCN = new Object;
            _postHashCN["langx"] = "zh-cn";
            _postHashCN["ls"] = "cn";
            _postHashCN["selLayer"] = selLayer;
            var _postHashTW = new Object;
            _postHashTW["langx"] = "zh-tw";
            _postHashTW["ls"] = "tw";
            _postHashCN["selLayer"] = selLayer;
            var _postHashUS = new Object;
            _postHashUS["langx"] = "en-us";
            _postHashUS["ls"] = "us";
            _postHashCN["selLayer"] = selLayer;
            _param = [_postHashCN, _postHashTW, _postHashUS];
            if (PC_check) {
                lang_listF.style.display = "";
                _self.addContentEvent("langx", _param)
            } else {
                lang_selectF.style.display = "";
                util.addEvent(lang_selectF, "change", _self.choose_lan_PH, _param)
            }
        } catch (e) {
            util.err("[alert_choose]", e)
        }
    };
    _self.choose_lan_PH = function(e, param) {
        var lang_target = e.target;
        var _post = "";
        for (i = 0; i < param.length; i++)
            if (lang_target.value == param[i]["langx"]) {
                _post = param[i];
                break
            }
        lang_selectF.style.display = "none";
        parentClass.dispatchEvent("chgLangx", {
            "langx": _post.langx,
            "ls": _post.ls,
            "selLayer": _post.selLayer,
            "rightChg": "Y"
        })
    };
    _self.addContentEvent = function(type, hash) {
        for (i = 0; i < hash.length; i++)
            util.addEvent(dom.getElementById(hash[i]["langx"] + "F"), "click", _self.clickEvent, {
                "type": type,
                "postHash": hash[i]
            })
    };
    _self.clickEvent = function(e, param) {
        var _post = param.postHash;
        if (PC_check)
            _self.showLS(_post.ls);
        else
            _self.showLS_Ph();
        if (param.type == "langx") {
            lang_listF.style.display = "none";
            parentClass.dispatchEvent("chgLangx", {
                "langx": _post.langx,
                "ls": _post.ls,
                "selLayer": _post.selLayer,
                "rightChg": "Y"
            })
        }
    };
    _self.showLS = function(ls) {
        var zh_cnF = dom.getElementById("zh-cnF");
        var zh_twF = dom.getElementById("zh-twF");
        var en_usF = dom.getElementById("en-usF");
        if (ls == "cn") {
            zh_cnF.classList.add("active");
            zh_twF.classList.remove("active");
            en_usF.classList.remove("active")
        } else if (ls == "tw") {
            zh_twF.classList.add("active");
            zh_cnF.classList.remove("active");
            en_usF.classList.remove("active")
        } else if (ls == "us") {
            en_usF.classList.add("active");
            zh_cnF.classList.remove("active");
            zh_twF.classList.remove("active")
        }
    };
    _self.showLS_Ph = function() {
        var zh_cnFsel = dom.getElementById("zh-cnFsel");
        var zh_twFsel = dom.getElementById("zh-twFsel");
        var en_usFsel = dom.getElementById("en-usFsel");
        if (top.ls == "cn") {
            zh_cnFsel.selected = true;
            zh_twFsel.selected = false;
            en_usFsel.selected = false
        } else if (top.ls == "tw") {
            zh_twFsel.selected = true;
            zh_cnFsel.selected = false;
            en_usFsel.selected = false
        } else if (top.ls == "us") {
            en_usFsel.selected = true;
            zh_cnFsel.selected = false;
            zh_twFsel.selected = false
        }
    };
    _self.onBlurEventHandler = function(e) {
        lang_listF.style.display = "none"
    };
    _self.changePage = function(e, param) {
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "rightPanel"
        });
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.liveChatOpen = function() {
        var LPM_obj = document.getElementsByClassName("LPMcontainer")[0];
        var LPM_obj1 = document.getElementsByClassName("LPMcontainer")[1];
        if (LPM_obj) {
            LPM_obj.click();
            LPM_obj1.click()
        } else
            util.showErrorMsg(LS.get("noliveChat"))
    };
    _self.isPC = function() {
        var userAgentInfo = top.navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad");
        for (i = 0; i < Agents.length; i++)
            if (userAgentInfo.indexOf(Agents[i]) > 0) {
                check = false;
                break
            }
        return check
    }
};
