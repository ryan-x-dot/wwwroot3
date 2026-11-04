function alert_msg(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "alert_msg";
    var util;
    var divBox = new Array("alert_ok", "alert_confirm", "status_pop", "possess_pop", "safe_pop", "loginid_pop", "AllAccount_pop", "account_type_pop", "credit_exceeded_pop", "acc_comm_pop", "account_popup_data", "modal_popup_betl", "modal_popup_data", "modal_popup_acct", "modal_popup_createm", "modal_popup_editm");
    var _mc;
    var keepStyle = {};
    _self.init = function() {
        obj_ids = ",alert_ok,msg_ok,ok_btn,";
        obj_ids += "alert_confirm,msg_confirm,no_btn,yes_btn,";
        obj_ids += "status_pop,possess_pop,safe_pop,loginid_pop,AllAccount_pop,";
        obj_ids += "account_type_pop,credit_exceeded_pop,acc_comm_pop,account_popup_data,";
        obj_ids += "modal_popup_betl,modal_popup_data,modal_popup_acct,modal_popup_createm,modal_popup_editm,";
        _mc = util.getObjAry(dom.getElementById("alert_show"), obj_ids);
        for (key in _mc)
            if (key.search("_pop") != -1) {
                var _mArr = util.getObjAry(_mc[key], ",pop_close,");
                util.addEvent(_mArr["pop_close"], "click", _self.clickEvent, {})
            }
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.showMsg = function(param) {
        _self.initAlert();
        if (param._id != null) {
            if (_mc[param._id] != null) {
                var tmp_obj = _mc[param._id].children[0];
                util.addEvent(tmp_obj, "blur", _self.clickEvent, {});
                _mc[param._id].style.display = ""
            }
            if (param.do == "comm_msg")
                _self.show_comm_msg(_mc[param._id], param)
        } else {
            if (param.confirm == "Y") {
                _mc["msg_confirm"].innerHTML = param.msg;
                _mc["alert_confirm"].style.display = ""
            } else {
                _mc["msg_ok"].innerHTML = param.msg;
                _mc["alert_ok"].style.display = ""
            }
            _self.addEvent(param)
        }
        keepStyle.body_show = dom.getElementById("body_show").style;
        keepStyle.body = dom.body.style;
        dom.getElementById("body_show").setAttribute("style", "overflow-y:hidden;");
        dom.body.setAttribute("style", "position:fixed; overflow-y:hidden;")
    };
    _self.initAlert = function() {
        for (key in divBox)
            _mc[divBox[key]].style.display = "none";
        _mc["msg_confirm"].innerHTML = "";
        _mc["msg_ok"].innerHTML = ""
    };
    _self.clearMsg = function() {
        _self.initAlert();
        _self.removeEvent()
    };
    _self.clickEvent = function(e, param) {
        if (_mc["status_pop"].style.display == "")
            _mc["status_pop"].children[0].scrollTop = 0;
        dom.getElementById("body_show").removeAttribute("style");
        dom.body.removeAttribute("style");
        if (param.dont_close != "Y")
            parentClass.dispatchEvent("hideAlertMsg", {});
        if (param.retFun)
            param.retFun(param.type)
    };
    _self.addEvent = function(param) {
        if (param.confirm == "Y") {
            util.addEvent(_mc["no_btn"], "click", _self.clickEvent, {
                "type": "no",
                "retFun": param.retFun
            });
            util.addEvent(_mc["yes_btn"], "click", _self.clickEvent, {
                "type": "yes",
                "retFun": param.retFun
            })
        } else
            util.addEvent(_mc["ok_btn"], "click", _self.clickEvent, {
                "type": "ok",
                "retFun": param.retFun
            })
    };
    _self.removeEvent = function() {
        util.removeEvent(_mc["no_btn"], "click");
        util.removeEvent(_mc["yes_btn"], "click");
        util.removeEvent(_mc["ok_btn"], "click")
    };
    _self.show_comm_msg = function(_Obj, _par) {
        var tmp_obj = util.getObjAry(_Obj, ",gtype_show,rtype_show,");
        if (tmp_obj["gtype_show"] != null && _par.gtype_show != "")
            tmp_obj["gtype_show"].innerHTML = _par.gtype_show;
        if (tmp_obj["rtype_show"] != null && _par.rtype_show != "")
            tmp_obj["rtype_show"].innerHTML = _par.rtype_show
    }
};
