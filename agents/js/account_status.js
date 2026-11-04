function account_status(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var ParentName;
    var parentTop;
    var util;
    var LS;
    var paramObj = new Object;
    var _mc = new Object;
    var level = "";
    var def_input = "";
    var up_data = new Object;
    _self.init = function() {
        var obj_ids = ",master_box,head_select,sel_upper_box,sel_upper_box_768,sel_upper_text,sel_upper_list,upper_list_768,sel_upper_btn,ph_search_class,btn_ph_search,";
        obj_ids += "box_search,input_search,btn_delete,btn_search,btn_add_acc,";
        _mc = util.getObjAry(dom, obj_ids);
        if (_mc["head_select"] != null) {
            var obj_ids = ",sel_view,sel_btn,sel_text,sel_list,sel_768,";
            var _EL = util.getObjAry(_mc["head_select"], obj_ids);
            _mc["ClassSelect"] = new win.ClassSelect(win, dom);
            _mc["ClassSelect"].setParentclass(_self);
            _mc["ClassSelect"].setSelCss("md_status_item", "", true);
            _mc["ClassSelect"].init(_EL["sel_text"], _EL["sel_list"], _EL["sel_view"], _EL["sel_btn"]);
            _mc["ClassSelect"].addEvent("ONCHANGE", _self.reloadData);
            _mc["ClassSelect"].addEvent("ONOPEN", _self.show_box, _EL["sel_view"]);
            _mc["ClassSelect"].addEvent("ONCLOSE", _self.close_box, _EL["sel_view"]);
            if (_EL["sel_768"] != null)
                _mc["ClassSelect"].creatSelOpt(_EL["sel_768"]);
            var obj_ids = ",sel_paytype_view,sel_paytype_btn,sel_paytype_text,sel_paytype_list,sel_paytype_768,";
            var _EL = util.getObjAry(_mc["head_select"], obj_ids);
            if (_EL["sel_paytype_view"] != null) {
                _mc["ClassSelect_paytype"] = new win.ClassSelect(win, dom);
                _mc["ClassSelect_paytype"].setParentclass(_self);
                _mc["ClassSelect_paytype"].setSelCss("md_status_item", "", true);
                _mc["ClassSelect_paytype"].init(_EL["sel_paytype_text"], _EL["sel_paytype_list"], _EL["sel_paytype_view"], _EL["sel_paytype_btn"]);
                _mc["ClassSelect_paytype"].addEvent("ONCHANGE", _self.reloadData);
                _mc["ClassSelect_paytype"].addEvent("ONOPEN", _self.show_box, _EL["sel_paytype_view"]);
                _mc["ClassSelect_paytype"].addEvent("ONCLOSE", _self.close_box, _EL["sel_paytype_view"]);
                if (_EL["sel_paytype_768"] != null)
                    _mc["ClassSelect_paytype"].creatSelOpt(_EL["sel_paytype_768"])
            }
            var obj_ids = ",ltype_sel,ltype_btn,ltype_text,ltype_list,ltype_768,";
            var _EL = util.getObjAry(_mc["head_select"], obj_ids);
            if (_EL["ltype_sel"] != null) {
                _mc["ClassSelect_ltype"] = new win.ClassSelect(win, dom);
                _mc["ClassSelect_ltype"].setParentclass(_self);
                _mc["ClassSelect_ltype"].setSelCss("md_status_item", "", true);
                _mc["ClassSelect_ltype"].init(_EL["ltype_text"], _EL["ltype_list"], _EL["ltype_sel"], _EL["ltype_btn"]);
                _mc["ClassSelect_ltype"].addEvent("ONCHANGE", _self.reloadData);
                _mc["ClassSelect_ltype"].addEvent("ONOPEN", _self.show_box, _EL["ltype_sel"]);
                _mc["ClassSelect_ltype"].addEvent("ONCLOSE", _self.close_box, _EL["ltype_sel"]);
                if (_EL["ltype_768"] != null)
                    _mc["ClassSelect_ltype"].creatSelOpt(_EL["ltype_768"])
            }
        }
        util.ChkKeyUser(_mc["input_search"]);
        util.addEvent(_mc["input_search"], "focus", _self.show_box_search, {
            "target": _mc["box_search"],
            "act": "add",
            "class_name": "focus"
        });
        util.addEvent(_mc["input_search"], "blur", _self.show_box_search, {
            "target": _mc["box_search"],
            "act": "remove",
            "class_name": "focus"
        });
        util.addEvent(_mc["input_search"], "keyup", _self.keyup_dsearch, {
            "target": _mc["input_search"],
            "clean_target": _mc["btn_delete"]
        });
        util.addEvent(_mc["input_search"], "keypress", _self.keyPressEvent, _mc["input_search"]);
        util.addEvent(_mc["btn_delete"], "click", _self.clean_search, {
            "target": _mc["btn_delete"],
            "target_txt": _mc["input_search"]
        });
        util.addEvent(_mc["btn_search"], "click", _self.click_btn_search, _mc["btn_search"]);
        _mc["btn_search"].search_input_show = false;
        if (util.isIE()) {
            util.addEvent(_mc["input_search"], "focus", _self.inputFocus, _mc["input_search"]);
            util.addEvent(_mc["input_search"], "blur", _self.inputBlur, _mc["input_search"]);
            def_input = LS.get("input_acc");
            _mc["input_search"].value = def_input
        }
        if (!(top.user_type != "1" && top.pri_type.indexOf("B1") == -1))
            util.addEvent(_mc["btn_add_acc"], "click", _self.addAccountEventPrev, _mc["btn_add_acc"]);
        _self.chkUserEnable();
        if (top.user_type != "1" && top.pri_type.indexOf("B1") == -1)
            _mc["btn_add_acc"].style.display = "none";
        if (top.login_layer == "su" && level == "ag" || top.login_layer == "ag" && level == "mem") {
            _mc["sel_upper_box"].style.display = "none";
            _mc["sel_upper_box"] = null;
            _mc["sel_upper_box_768"].style.display = "none";
            _mc["sel_upper_box_768"] = null
        }
    };
    _self.getEnable = function() {
        return _mc["ClassSelect"] != null ? _mc["ClassSelect"].value() : "ALL"
    };
    _self.setEnable = function(_val) {
        if (_mc["ClassSelect"] != null)
            _mc["ClassSelect"].setSelected(_val)
    };
    _self.getPaytype = function() {
        return _mc["ClassSelect_paytype"] != null ? _mc["ClassSelect_paytype"].value() : "Y"
    };
    _self.setPaytype = function(_val) {
        if (_mc["ClassSelect_paytype"] != null)
            _mc["ClassSelect_paytype"].setSelected(_val)
    };
    _self.getltype = function() {
        return _mc["ClassSelect_ltype"] != null ? _mc["ClassSelect_ltype"].value() : "Y"
    };
    _self.setltype = function(_val) {
        if (_mc["ClassSelect_ltype"] != null)
            _mc["ClassSelect_ltype"].setSelected(_val)
    };
    _self.setUpper = function(_val) {
        if (_mc["ClassSelectU"] != null)
            _mc["ClassSelectU"].setSelected(_val)
    };
    _self.reloadData = function(changeEvent, targetObj) {
        parentClass.reloadEventHandler()
    };
    _self.click_btn_search = function(changeEvent, targetObj) {
        if (getView().viewportwidth >= 1024)
            _self.reloadData();
        else if (targetObj.search_input_show)
            if (_self.getSearchName() != "")
                _self.reloadData();
            else {
                _mc["box_search"].classList.remove("search_on");
                targetObj.search_input_show = false
            }
        else {
            _mc["box_search"].classList.add("search_on");
            targetObj.search_input_show = true
        }
    };
    _self.show_box = function(e, elmObj) {
        if (!elmObj.classList.contains("on"))
            elmObj.classList.add("on");
        if (dom.getElementById("sel_list") != null)
            _self.setLiClass("sel_list", "sel_text", "on");
        if (dom.getElementById("sel_upper_list") != null)
            _self.setLiClass("sel_upper_list", "sel_upper_text", "on");
        if (dom.getElementById("sel_paytype_list") != null)
            _self.setLiClass("sel_paytype_list", "sel_paytype_text", "on");
        if (dom.getElementById("ltype_list") != null)
            _self.setLiClass("ltype_list", "ltype_text", "on")
    };
    _self.close_box = function(e, elmObj) {
        if (elmObj.classList.contains("on"))
            elmObj.classList.remove("on")
    };
    _self.setLiClass = function(ul_id, text_id, add_class) {
        var sel_li = dom.getElementById(ul_id).getElementsByTagName("li");
        for (var _i = 0, end = sel_li.length; _i < end; _i++)
            if (sel_li[_i].innerHTML == dom.getElementById(text_id).innerHTML)
                sel_li[_i].classList.add(add_class)
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        level = parentClass.getThis("level");
        ParentName = parentClass.getThis("ClassName")
    };
    _self.setParam = function(Param) {
        paramObj = Param;
        if (paramObj.enable != null && _mc["ClassSelect"] != null)
            _mc["ClassSelect"].setSelected(paramObj.enable)
    };
    _self.setTopParent = function(_top) {
        parentTop = _top
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.keyPressEvent = function(keyEvent, targetObj) {
        var keyCode = util.getKeyCode();
        if (keyCode == 13)
            parentClass.reloadEventHandler()
    };
    _self.getSearchName = function() {
        if (_mc["input_search"] != null)
            if (_mc["input_search"].value != def_input)
                return _mc["input_search"].value;
        return ""
    };
    _self.inputFocus = function(mouseEvent, targetObj) {
        if (targetObj.value == LS.get("input_acc"))
            targetObj.value = ""
    };
    _self.inputBlur = function(mouseEvent, targetObj) {
        if (targetObj.value == "")
            targetObj.value = LS.get("input_acc")
    };
    _self.clearEvent = function(mouseEvent, targetObj) {
        if (_mc["input_search"] != null) {
            var tmp_input = util.isIE() ? def_input : "";
            _mc["input_search"].value = tmp_input;
            targetObj.focus()
        }
        _self.reloadData()
    };
    _self.addAccountEventPrev = function(mouseEvent, targetObj) {
        parentTop.dispatchEvent("showLoading", {
            "showLoading": true
        });
        var getHttp = new HttpRequest;
        var param = "";
        getHttp.addEventListener("LoadComplete", _self.addAccountEvent);
        param = _self.getBaseParam() + "&keys=addAccount";
        param = "p=prevData&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param)
    };
    _self.chkUserEnable = function() {
        var showType = "";
        if (top.user_enable == "Y")
            showType = "";
        else {
            showType = "none";
            util.removeEvent(_mc["btn_add_acc"], "click")
        }
        _mc["btn_add_acc"].style.display = showType
    };
    _self.getBaseParam = function() {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&langx=" + top.langx;
        return par
    };
    _self.addAccountEvent = function(data) {
        parentTop.dispatchEvent("showLoading", {
            "showLoading": false
        });
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        var code = arr_data.code;
        if (_status == "error") {
            var tmp = code.split("|");
            _self.showErrorMsg(tmp[1], arr_data)
        } else
            try {
                if (level != "") {
                    var obj = new Object;
                    obj.postHash = new Object;
                    obj.page = "acc_" + level + "_add";
                    obj.postHash.up_id = _self.getUpperLayerId_sql();
                    obj.postHash.back_param = paramObj;
                    obj.postHash.back_page = ParentName;
                    if (_mc["sel_upper_box"] != null)
                        obj.postHash.up_data = _mc["sel_upper_box"].dataObj;
                    else if (typeof _self.up_data == "object")
                        obj.postHash.pay_type = _self.up_data["pay_type"];
                    parentClass.addAccountEventHandler(obj)
                }
            } catch (e) {}
    };
    _self.showErrorMsg = function(code, arr_data) {
        if (code == "clean_db")
            parentTop.dispatchEvent("showAlertMsg", arr_data)
    };
    _self.getUpperLayerId_sql = function() {
        var ret = "";
        if (top.login_layer == "su" && level == "ag")
            ret = top.layer_id;
        else if (top.login_layer == "ag" && level == "mem")
            ret = top.layer_id;
        else if (_mc["sel_upper_list"] != null)
            if (_mc["sel_upper_list"].children.length > 0)
                ret = _mc["ClassSelectU"].value().split("_")[1];
            else {
                if (paramObj.up_id != null)
                    ret = paramObj.up_id
            }
        else if (paramObj.up_id != null)
            ret = paramObj.up_id;
        return ret
    };
    _self.getUpperLayerName = function() {
        var ret = "";
        if (top.login_layer == "su" && level == "ag" || top.login_layer == "ag" && level == "mem")
            ret = top.username;
        else
            ret = _mc["ClassSelectU"] != null ? _mc["ClassSelectU"].value().split("_")[0] : "";
        return ret
    };
    _self.show_noadd = function() {
        var arr_ = new Object;
        arr_["msg"] = LS.get("no_upper_add");
        parentTop.dispatchEvent("showAlertMsg", arr_)
    };
    _self.setUpperLayer = function(uplayer_user) {
        if (uplayer_user.length == 0)
            util.addEvent(_mc["btn_add_acc"], "click", _self.show_noadd);
        var uplayer_user_change = uplayer_user.length != _mc["sel_upper_list"].children.length;
        if (!uplayer_user_change)
            return true;
        if (typeof _mc["ClassSelectU"] != "undefined")
            var old_chose = _mc["ClassSelectU"].value();
        var old_exists = false;
        if (uplayer_user.length != 0 && (_mc["sel_upper_list"].children.length == 0 || uplayer_user_change)) {
            _mc["sel_upper_list"].innerHTML = "";
            for (var i = 0; i < uplayer_user.length; i++) {
                var tmp_li = document.createElement("li");
                tmp_li.classList.add("md_status_item");
                tmp_li.id = uplayer_user[i].username + "_" + uplayer_user[i].id;
                if (tmp_li.id == old_chose)
                    old_exists = true;
                tmp_li.innerHTML = uplayer_user[i].username;
                _mc["sel_upper_list"].appendChild(tmp_li)
            }
        }
        if (_mc["sel_upper_box"]) {
            _mc["sel_upper_box"].dataObj = uplayer_user;
            _mc["ClassSelectU"] = new win.ClassSelect(win, dom);
            _mc["ClassSelectU"].setParentclass(_self);
            _mc["ClassSelectU"].setSelCss("md_status_item", "", true);
            _mc["ClassSelectU"].init(_mc["sel_upper_text"], _mc["sel_upper_list"], _mc["sel_upper_box"], _mc["sel_upper_btn"]);
            _mc["ClassSelectU"].addEvent("ONCHANGE", _self.reloadData);
            _mc["ClassSelectU"].addEvent("ONOPEN", _self.show_box, _mc["sel_upper_box"]);
            _mc["ClassSelectU"].addEvent("ONCLOSE", _self.close_box, _mc["sel_upper_box"]);
            if (_mc["upper_list_768"] != null)
                _mc["ClassSelectU"].creatSelOpt(_mc["upper_list_768"])
        }
        if (paramObj.up_id != null && _mc["ClassSelectU"] != null) {
            var tmp_val = paramObj.up_username + "_" + paramObj.up_id;
            _mc["ClassSelectU"].setSelected(tmp_val);
            paramObj.up_id = null
        }
        if (uplayer_user_change && old_exists && old_chose != null)
            _mc["ClassSelectU"].setSelected(old_chose);
        if (old_chose != null && !old_exists)
            return false;
        else
            return true
    };
    _self.setPHsearchIcon = function(evt, param) {
        param.tarDom.classList.add(param.className);
        param.searchDom.focus()
    };
    _self.setSearchInpBlur = function(evt, param) {
        var DOM = evt.target;
        if (param.tarDom.classList.contains(param.className) && DOM.value == "")
            param.tarDom.classList.remove(param.className)
    };
    _self.show_box_search = function(event, param) {
        if (param.target == null)
            return;
        if (param.act == "add")
            param.target.classList.add("focus");
        else if (param.act == "remove")
            param.target.classList.remove("focus")
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
    _self.clean_search = function(e, param) {
        if (param.target_txt)
            param.target_txt.value = "";
        if (param.target)
            param.target.style.display = "none";
        _self.reloadData()
    }
};
