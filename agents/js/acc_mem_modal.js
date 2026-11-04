function acc_mem_modal(_win, _dom, param) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var create_btn;
    var div_err_msg_top;
    var total_modal = 0;
    var total_modal_limit = 0;
    var arr_div_data = new Array;
    _self.init = function() {
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "account",
            "id": "MEM"
        });
        dom.getElementById("body_show").classList.remove("body_pb");
        parentClass.dispatchEvent("chgPageName", {
            "pageName": "acc_mem_modal"
        });
        create_btn = dom.getElementById("create_btn");
        util.addEvent(create_btn, "click", _self.create_template);
        div_err_msg_top = dom.getElementById("div_err_msg_top");
        _self.getModalData()
    };
    _self.getModalData = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams = "p=get_acc_mem_modal&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.connectComplete = function(data) {
        try {
            var arr_data = JSON.parse(data);
            _self.parseData(arr_data)
        } catch (e) {
            util.echo(e)
        }
    };
    _self.parseData = function(data) {
        var parentDiv = dom.getElementById("div_show").parentNode;
        var div_show = dom.getElementById("div_show");
        _self.show_top_error("");
        if (arr_div_data.length > 0) {
            for (var key in arr_div_data) {
                var parentObj = arr_div_data[key].parentNode;
                parentObj.removeChild(arr_div_data[key])
            }
            arr_div_data = new Array
        }
        var _num = 0;
        for (var key in data["data"]["modal_data"]) {
            var tmp_data = data["data"]["modal_data"][key];
            var htmlModel = dom.getElementById("div_model").children[0].cloneNode(true);
            var tmp_div = dom.createElement("div");
            tmp_div.appendChild(htmlModel);
            tmp_div.innerHTML = tmp_div.innerHTML.replace(/\*ID\*/g, tmp_data["id"]);
            tmp_div.innerHTML = tmp_div.innerHTML.replace(/\*TEMPLATENAME\*/g, tmp_data["templatename"]);
            var child = tmp_div.children[0].cloneNode(true);
            parentDiv.insertBefore(child, div_show);
            var obj_ids = ",div_edit,div_copy,div_del,div_box,";
            var tmp_obj = util.getObjAry(dom.getElementById("div_data_" + tmp_data["id"]), obj_ids);
            arr_div_data[_num] = dom.getElementById("div_data_" + tmp_data["id"]);
            util.addEvent(tmp_obj["div_edit"], "click", _self.edit_data, tmp_data);
            util.addEvent(tmp_obj["div_copy"], "click", _self.copy_data, tmp_data);
            util.addEvent(tmp_obj["div_del"], "click", _self.del_data, tmp_data);
            _num++
        }
        total_modal = _num;
        total_modal_limit = data["data"]["modal_limit"];
        if (_num >= data["data"]["modal_limit"])
            create_btn.disabled = true;
        else
            create_btn.disabled = false;
        _self.loadingFun(false);
        dom.getElementById("body_show").classList.add("body_pb")
    };
    _self.edit_data = function(e, _obj) {
        var obj = new Object;
        obj.postHash = new Object;
        obj["page"] = "acc_mem_add_modal";
        obj["postHash"]["act"] = "editm";
        obj["postHash"]["act_id"] = _obj.id;
        obj["postHash"]["act_user_id"] = _obj.user_id;
        parentClass.dispatchEvent("bodyGoToPage", obj)
    };
    _self.copy_data = function(e, _obj) {
        if (total_modal < total_modal_limit) {
            var obj = new Object;
            obj.postHash = new Object;
            obj["page"] = "acc_mem_add_modal";
            obj["postHash"]["act"] = "copym";
            obj["postHash"]["act_id"] = _obj.id;
            obj["postHash"]["act_user_id"] = _obj.user_id;
            parentClass.dispatchEvent("bodyGoToPage", obj)
        } else
            _self.show_top_error(LS.get("max_template"))
    };
    _self.del_data = function(e, _obj) {
        util.showMsg(LS.get("template_del_confirm"), "Y", function(x) {
            if (x == "yes")
                _self.do_delete(_obj)
        })
    };
    _self.do_delete = function(_obj) {
        _self.loadingFun(true);
        var getHttp = new HttpRequest;
        getHttp.addEventListener("LoadComplete", _self.getModalData);
        var param = _self.getDeleteParam(_obj);
        param = "p=body_modal_conf_set&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param)
    };
    _self.getDeleteParam = function(_obj) {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&keys=delm";
        par += "&template_del_id=" + _obj.id;
        par += "&langx=" + top.langx;
        return par
    };
    _self.create_template = function(e) {
        var obj = new Object;
        obj.postHash = new Object;
        obj["page"] = "acc_mem_add_modal";
        obj["postHash"]["act"] = "createm";
        parentClass.dispatchEvent("bodyGoToPage", obj)
    };
    _self.loadingFun = function(show) {
        parentClass.dispatchEvent("showLoading", {
            "showLoading": show
        })
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.exitEvent = function() {
        return true
    };
    _self.show_top_error = function(show_msg) {
        if (div_err_msg_top)
            div_err_msg_top.innerHTML = show_msg
    }
};
