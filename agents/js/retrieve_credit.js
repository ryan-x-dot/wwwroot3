function retrieve_credit(_win, _dom, param) {
    var _self = this;
    var level = "su";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var nullchar = "&nbsp;";
    var user_mlimit = -1;
    var magager_count = -1;
    var sort_type = "asc";
    var sort_name = "username";
    var sortObj = new Object;
    var _mc = new Object;
    _mc["credits"] = new Object;
    _mc["status"] = new Object;
    var create_btn_first = false;
    var credit_old;
    var account_status;
    var _nowEdit = "";
    var paramObj = param;
    var ClassName = "retrieve_credit";
    var keepScrollTop = 56;
    var overScrollTop = 56;
    var dataHash = null;
    var lazy_sw = null;
    var lazy_count = null;
    var lazy_page = null;
    var lazy_total_page = null;
    var lazy_loading = false;
    var scroll_e = null;
    var header_height = 0;
    var menu_ul_height = 0;
    var show_total_retrieve_height = 0;
    var footer_show_height = 0;
    var pb_height = 0;
    var show_level = "";
    var this_uplayer_data = new Object;
    var uper_level = {
        "ag": "su",
        "mem": "ag"
    };
    var lower_level = {
        "co": "su",
        "su": "ag",
        "ag": "mem"
    };
    var first_level = lower_level[top.login_layer];
    var list = new Object;
    var totalRievedata = new Object;
    var total_rievedata_options = {
        title: [{
            text: "aaaaaaaaa",
            left: "80%"
        }, {
            subtext: "bbbbbb",
            left: "80%",
            bottom: "0%",
            subtextStyle: {
                fontSize: 14
            }
        }],
        tooltip: {
            show: false,
            trigger: "item"
        },
        legend: {
            show: true,
            left: "80%",
            align: "left",
            y: "center",
            itemGap: 10,
            itemWidth: 20,
            itemHeight: 20,
            textStyle: {
                fontFamily: "Arial",
                fontSize: 14,
                color: "rgba(0, 0, 0, 0.56)"
            },
            orient: "vertical",
            formatter: function(name) {
                var value;
                list.forEach(item => {
                    if (item.name == name)
                        value = item.value
                });
                return name + "  " + util.mprintf(util.showTxt(value) * 1, 0, 0, false, true)
            }
        },
        series: [{
            type: "pie",
            center: ["20%", "50%"],
            radius: ["40%", "70%"],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 5,
                borderColor: "#fff",
                borderWidth: 2
            },
            label: {
                show: false,
                formatter: function(this_obj) {
                    return this_obj["data"]["name"] + "\n" + util.mprintf(util.showTxt(this_obj["data"]["value"]) * 1, 0, 0, false, true)
                },
                position: "center",
                lineHeight: 30,
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: "14"
                    }
                }
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: "30",
                    fontWeight: "bold"
                }
            },
            labelLine: {
                show: false
            },
            animation: "auto",
            animationDuration: 1E3,
            animationDelay: 600,
            data: [{
                value: 0,
                name: "Retrievable Credit",
                itemStyle: {
                    normal: {
                        color: "#29C2CC"
                    },
                    emphasis: {
                        color: "#22A2AA"
                    }
                }
            }, {
                value: 0,
                name: "Non-Retrievable Credit",
                itemStyle: {
                    normal: {
                        color: "#FF4E65"
                    },
                    emphasis: {
                        color: "#FF1A37"
                    }
                }
            }],
            clockwise: false
        }]
    };
    var arrowAnimation_json = "/js/Retrieve.json";
    var retrieve_loading = new Object;
    var search_input_show = false;
    var gap_px = 11;
    var total_retrieve_data_show = new Object;
    _self.init = function() {
        parentClass.dispatchEvent("chgLeftMenuColor", {
            "target": "account",
            "id": "Retrieve"
        });
        _self.initMenu();
        var obj_ids = ",menu_ul,head_select,";
        obj_ids += "show_total_retrieve,div_total_retrieve,btn_total_retrieve,No_total_retrieve_msg,btn_No_total_retrieve,total_retrieve,loading_total_retrieve,";
        obj_ids += "div_retrieve_confirm,titel_retrieve_confirm,btn_close_retrieve_confirm,msg_retrieve_confirm,";
        obj_ids += "be_retrieve_name,be_retrieve_credit,lottie-container,do_retrieve_name,do_retrieve_credit,";
        obj_ids += "btn_cancel_retrieve_confirm,btn_do_retrieve_confirm,";
        obj_ids += "box_upper,upper_list,upper_name_LB,upper_name,";
        obj_ids += "box_search,input_search,btn_delete,btn_search,";
        obj_ids += "div_retrieve_loading,div_loading_box,loading_show,loading_width,loading_be_retrieve_name,loading_lottie-container,loading_do_retrieve_name,div_loading_success,btn_retrieve_success,";
        obj_ids += "div_error_msg,error_msg,btn_close_error_msg,";
        var ary = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, ary);
        var obj_ids = ",menu_su,menu_ag,menu_mem,";
        var ary = util.getObjAry(_mc["menu_ul"], obj_ids);
        _mc = util.mergeArray(_mc, ary);
        if (typeof paramObj != "undefined") {
            show_level = paramObj.show_level;
            this_uplayer_data = paramObj.uplayer_data[uper_level[show_level]]
        }
        if (show_level == "")
            show_level = lower_level[top.login_layer];
        _self.show_menu(show_level);
        header_height = dom.getElementById("main_header").clientHeight;
        menu_ul_height = _mc["menu_ul"].clientHeight;
        footer_show_height = dom.getElementById("footer_show").clientHeight;
        util.addEvent(dom.getElementById("ma_content"), "scroll", _self.scrollEvent, dom.getElementById("div_show").parentNode);
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
        _self.loadData();
        _self.initLazy();
        pb_height = util.countPaddingPx(dom.getElementById("scroll_div"))
    };
    _self.initMenu = function() {
        parentClass.dispatchEvent("chgPageName", {
            "pageType": "account",
            "pageName": "retrieve_credit"
        })
    };
    _self.loadData = function() {
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.dataCompele);
        getHTML.loadURL(top.url, "POST", _self.getParam())
    };
    _self.onError = function() {
        util.echo("onError")
    };
    _self.dataCompele = function(data) {
        dataHash = data;
        var arr_data = JSON.parse(data);
        _self.reSetLazy(arr_data["account"]);
        _self.parseData(data)
    };
    _self.getParam = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&langx=" + top.langx;
        urlParams += "&user_name=" + _self.getSearchName();
        urlParams += "&sort_type=" + sort_type;
        urlParams += "&sort_name=" + sort_name;
        if (show_level != first_level) {
            urlParams += "&up_id=" + _mc["upper_list"].value;
            urlParams += "&up_layer=" + this_uplayer_data.up_layer
        }
        urlParams = "p=get_retrieve_list&ver=" + top.ver + "&" + urlParams;
        return urlParams
    };
    _self.reloadEventHandler = function() {
        _self.loadData()
    };
    _self.parseData = function(data) {
        try {
            var arr_data = JSON.parse(data);
            if (arr_data["status"] == "0X001") {
                var str_err_msg = LS.get("retrieve_err_" + arr_data["status"]);
                var fun_OK = _self.goPageHome;
                _self.retrieve_showErrorMsg(str_err_msg, fun_OK)
            } else {
                var bodyTemp = "";
                var outdata = "";
                var div_show = dom.getElementById("div_show");
                var xmp_kind = "";
                if (arr_data["this_layer"] == "mem")
                    xmp_kind = "_mem";
                var xmp_header = dom.getElementById("xmp_header" + xmp_kind).innerHTML;
                var xmp_contant = dom.getElementById("xmp_contant" + xmp_kind).innerHTML;
                if (arr_data["account"].length > 0) {
                    var s = 0;
                    var e = 0;
                    if (lazy_sw) {
                        s = (lazy_page - 1) * lazy_count;
                        e = lazy_page == lazy_total_page ? arr_data["account"].length : lazy_page * lazy_count
                    } else {
                        s = 0;
                        e = arr_data["account"].length
                    }
                    for (var i = 0; i < e; i++) {
                        var contanttmp = xmp_contant;
                        var obj = arr_data["account"][i];
                        contanttmp = contanttmp.replace(/\*ID\*/g, util.showTxt(obj["id"]));
                        contanttmp = contanttmp.replace(/\*USERNAME\*/g, util.showTxt(obj["username"]));
                        contanttmp = contanttmp.replace(/\*ALIAS\*/g, util.showTxt(obj["alias"]));
                        contanttmp = contanttmp.replace(/\*MAXCREDIT\*/g, util.mprintf(util.showTxt(obj["maxcredit"]) * 1, 0, 2, false, true));
                        if (arr_data["this_layer"] != "mem")
                            contanttmp = contanttmp.replace(/\*LOWERN_COUNT\*/g, util.showTxt(obj["lowerN_count"]));
                        else
                            contanttmp = contanttmp.replace(/\*CURRENCY\*/g, util.showTxt(obj["currency"]));
                        bodyTemp += contanttmp
                    }
                } else
                    bodyTemp = dom.getElementById("xmp_no_data").innerHTML;
                xmp_header = xmp_header.replace(/\*THIS_LAYER_NANE\*/g, util.showTxt(LS.get("str_" + arr_data["this_layer"])));
                xmp_header = xmp_header.replace(/\*LOWER_LAYER_NANE\*/g, util.showTxt(LS.get("str_" + arr_data["lower_layer"])));
                outdata = xmp_header + bodyTemp;
                div_show.innerHTML = outdata;
                _self.setLzayLoadingVisible(false);
                _self.scroll_ver_event(scroll_e, dom.getElementById("body_show"));
                _self.initEvent(arr_data, div_show);
                parentClass.dispatchEvent("showLoading", {
                    "showLoading": false
                })
            }
        } catch (e) {
            util.echo(e)
        }
    };
    _self.initEvent = function(ArrObj, div_show) {
        util.echo("[intEvent]");
        var s = 0;
        var e = 0;
        if (lazy_sw) {
            s = (lazy_page - 1) * lazy_count;
            e = lazy_page == lazy_total_page ? ArrObj["account"].length : lazy_page * lazy_count
        } else {
            s = 0;
            e = ArrObj.length
        }
        for (var i = 0; i < e; i++) {
            var obj = util.clone(ArrObj["account"][i]);
            var _tr = dom.getElementById("tr_" + obj["id"]);
            var obj_ids = ",btn_user,btn_retrieve,";
            var _ary = util.getObjAry(_tr, obj_ids);
            if (top.user_type == "1") {
                _ary["btn_retrieve"].classList.remove("disabled");
                obj["this_layer"] = ArrObj["this_layer"];
                util.addEvent(_ary["btn_retrieve"], "click", _self.retrieveEvent, obj)
            }
            if (ArrObj["this_layer"] != "mem")
                util.addEvent(_ary["btn_user"], "click", _self.listEvent, {
                    "acc_id": obj["id"],
                    "acc_username": obj["username"],
                    "up_layer": show_level,
                    "uplayer_user": ArrObj["account"]
                });
            else
                _ary["btn_user"].classList.add("disabled")
        }
        if (ArrObj["this_layer"] != "mem")
            var objids = ",title_username,title_maxcredit,title_count,";
        else
            var objids = ",title_username,title_maxcredit,title_currency,";
        var ary = util.getObjAry(div_show, objids);
        if (ArrObj["account"].length > 0) {
            for (key in ary) {
                var _type = "empty";
                if (sortObj[key] == null) {
                    if (key == "title_" + sort_name)
                        _type = sort_type
                } else
                    _type = sortObj[key].type;
                sortObj[key] = ary[key];
                sortObj[key].name = key.split("_")[1];
                sortObj[key].type = _type;
                var sty = _self.getSortClass(sortObj[key].type);
                util.setObjectClass(sortObj[key], sty);
                util.addEvent(sortObj[key], "click", _self.sortEvent, sortObj[key])
            }
            var choseObj = sortObj["title_" + sort_name];
            var choseSty = _self.getSortClass(choseObj.type);
            util.setObjectClass(choseObj, choseSty)
        }
        show_total_retrieve_height = _mc["show_total_retrieve"].clientHeight + gap_px;
        keepScrollTop = _mc["head_select"].offsetHeight + header_height + menu_ul_height + show_total_retrieve_height;
        overScrollTop = _mc["head_select"].offsetHeight + header_height + menu_ul_height + show_total_retrieve_height
    };
    _self.sortEvent = function(mouseEvent, targetObj) {
        var _type = targetObj.type;
        for (key in sortObj)
            sortObj[key].type = "empty";
        targetObj.type = _self.transSortStatus(_type);
        sort_type = targetObj.type;
        sort_name = targetObj.name;
        _self.loadData()
    };
    _self.transSortStatus = function(_status) {
        var hash = new Object;
        hash["empty"] = "asc";
        hash["asc"] = "desc";
        hash["desc"] = "asc";
        return hash[_status]
    };
    _self.getSortClass = function(_status) {
        var hash = new Object;
        hash["empty"] = "md_sort_label";
        hash["asc"] = "md_sort_label sort_down";
        hash["desc"] = "md_sort_label sort_up";
        return hash[_status]
    };
    _self.retrieveEvent = function(mouseEvent, param) {
        _self.load_retrieveData(null, {
            "act": "one_retrieve",
            "active": "N",
            "retrieve_total": 0,
            "nowLayer": param["this_layer"],
            "nowId": param["id"],
            "this_param": param
        })
    };
    _self.scrollEvent = function(e, target) {
        var newScrollTop = e.target.scrollTop;
        if (newScrollTop >= overScrollTop) {
            if (!target.issticky) {
                util.classFunc(target, "report_fixed");
                overScrollTop = e.target.scrollTop;
                target.issticky = true
            }
        } else if (target.issticky) {
            util.classFunc(target, "report_fixed", "remove");
            overScrollTop = keepScrollTop;
            target.issticky = false
        }
        scroll_e = e;
        _self.scroll_ver_event(e, target)
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code")
    };
    _self.exitEvent = function() {
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        if (win.removeEventListener)
            win.removeEventListener("orientationchange", _self.do_resize);
        return true
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.listEvent = function(mouseEvent, targetObj) {
        var paramHash = new Object;
        paramHash["uplayer_data"] = new Object;
        if (typeof paramObj != "undefined")
            paramHash["uplayer_data"] = paramObj.uplayer_data;
        var uplayer_data = new Object;
        uplayer_data["up_id"] = targetObj.acc_id;
        uplayer_data["up_layer"] = targetObj.up_layer;
        uplayer_data["up_username"] = targetObj.acc_username;
        uplayer_data["uplayer_user"] = targetObj.uplayer_user;
        paramHash["uplayer_data"][targetObj.up_layer] = uplayer_data;
        paramHash["show_level"] = lower_level[show_level];
        var param = new Object;
        param["page"] = "retrieve_credit";
        param["postHash"] = paramHash;
        if (win.removeEventListener)
            win.removeEventListener("orientationchange", _self.do_resize);
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.scroll_ver_event = function(e, targetObj) {
        if (e == null || !dom.getElementById("scroll_div"))
            return;
        var newScrollTop = e.target.scrollTop;
        var ori_h = e.target.scrollHeight;
        var now_h = 0;
        var func_h = dom.getElementById("scroll_div").clientHeight;
        if (newScrollTop > func_h) {
            now_h = e.target.scrollHeight;
            if (now_h != 0)
                stop_h = func_h - (ori_h - now_h)
        }
        if (newScrollTop <= func_h)
        ;
        _self.checkShowLazyLoading(e.target)
    };
    _self.checkShowLazyLoading = function(target) {
        if (!lazy_sw)
            return;
        var newScrollTop = target.scrollTop;
        var s_h = target.scrollHeight;
        var c_h = target.clientHeight;
        var scroll_bottom = newScrollTop >= s_h - c_h - footer_show_height - pb_height;
        if (scroll_bottom && !lazy_loading)
            if (lazy_page < lazy_total_page) {
                _self.setLzayLoadingVisible(true);
                retryTimer = setTimeout(_self.loadLazyData, 300)
            }
    };
    _self.setLzayLoadingVisible = function(isShow) {
        if (!lazy_sw)
            return;
        lazy_loading = isShow;
        dom.getElementById("report_loading").style.display = isShow ? "" : "none"
    };
    _self.loadLazyData = function() {
        if (!lazy_sw)
            return;
        lazy_loading = true;
        if (lazy_page < lazy_total_page) {
            lazy_page++;
            _self.parseData(dataHash)
        }
    };
    _self.initLazy = function() {
        lazy_sw = config_set.get("LAZY_SW") || false;
        lazy_page = 1;
        lazy_total_page = 1;
        var lazy_cnt = getView().viewportheight > 700 ? "LAZY_COUNT_BIG_PAGE" : "LAZY_COUNT";
        lazy_count = config_set.get(lazy_cnt) || 10
    };
    _self.reSetLazy = function(row0) {
        _self.initLazy();
        lazy_total_page = row0 ? Math.ceil(row0.length / lazy_count) : 1;
        if (lazy_total_page <= 0)
            lazy_total_page = 1
    };
    _self.show_menu = function(show_level) {
        var arr_level = new Array("su", "ag", "mem");
        var is_show = false;
        for (var key in arr_level) {
            var this_level = arr_level[key];
            var obj_menu_go = new Object;
            if (top.login_layer == "co")
                is_show = true;
            else if (top.login_layer == this_level) {
                is_show = true;
                continue
            }
            if (is_show) {
                var this_obj = _mc["menu_" + this_level];
                if (this_level == first_level)
                    this_obj.classList.add("first_item");
                this_obj.style.display = "";
                if (this_level == show_level) {
                    this_obj.classList.add("now");
                    break
                } else {
                    if (typeof paramObj != "undefined")
                        if (typeof uper_level[this_level] != "undefined") {
                            var upper_layer = uper_level[this_level];
                            if (typeof paramObj.uplayer_data[upper_layer] != "undefined") {
                                obj_menu_go["show_level"] = this_level;
                                obj_menu_go["uplayer_data"] = new Object;
                                obj_menu_go["uplayer_data"][upper_layer] = paramObj.uplayer_data[upper_layer]
                            }
                        }
                    util.addEvent(this_obj, "click", _self.menu_go, obj_menu_go)
                }
            }
        }
        if (show_level == first_level) {
            _self.check_total_retrieve();
            _mc["show_total_retrieve"].style.display = ""
        } else if (this_uplayer_data.up_layer != "" && this_uplayer_data.uplayer_user.length > 0) {
            _mc["upper_name_LB"].innerHTML = LS.get("str_" + this_uplayer_data.up_layer);
            _mc["upper_name"].innerHTML = LS.get("str_" + this_uplayer_data.up_layer);
            util.removeEvent(_mc["upper_list"], "change");
            _mc["upper_list"].options.length = 0;
            for (key in this_uplayer_data.uplayer_user) {
                var code = this_uplayer_data.uplayer_user[key].id;
                var _name = this_uplayer_data.uplayer_user[key].username;
                var varItem = new Option(_name, code, false, false);
                _mc["upper_list"].options.add(varItem)
            }
            if (this_uplayer_data.up_id != "")
                _mc["upper_list"].value = this_uplayer_data.up_id;
            _self.doSelToUL(_mc["upper_list"], "upper_list_LB");
            util.addEvent(_mc["upper_list"], "change", function() {
                parentClass.dispatchEvent("showLoading", {
                    "showLoading": true
                });
                _self.reloadEventHandler()
            });
            _mc["box_upper"].style.display = ""
        } else
        ;
    };
    _self.doSelToUL = function(DOMSel, labelId) {
        var obj_ids = ",sel_text,sel_list,";
        var elmt = util.getObjAry(dom.getElementById(labelId), obj_ids);
        elmt["sel_label"] = dom.getElementById(labelId);
        elmt["sel_list"].innerHTML = "";
        var options = DOMSel.options;
        for (i = 0; i < options.length; i++) {
            var tmp_li = document.createElement("li");
            tmp_li.id = options[i].value;
            tmp_li.innerHTML = options[i].innerHTML;
            tmp_li.className = "md_status_item";
            elmt["sel_list"].appendChild(tmp_li)
        }
        var sel_js = new win.ClassSelect(win, dom);
        sel_js.setParentclass(_self);
        sel_js.setSelCss("md_status_item --on", "md_status_item", false);
        sel_js.init(elmt["sel_text"], elmt["sel_list"], elmt["sel_label"], elmt["sel_label"]);
        sel_js.setSelected(DOMSel.value);
        sel_js.addEvent("ONCHANGE", _self.set_SEL_value, DOMSel);
        sel_js.addEvent("ONOPEN", _self.show_sel_box, elmt["sel_label"]);
        sel_js.addEvent("ONCLOSE", _self.close_sel_box, elmt["sel_label"]);
        DOMSel["JS_UL"] = sel_js
    };
    _self.set_SEL_value = function(e, ElmObj) {
        ElmObj.value = ElmObj.JS_UL.value();
        if ("createEvent" in document) {
            var evt = document.createEvent("HTMLEvents");
            evt.initEvent("change", false, true);
            ElmObj.dispatchEvent(evt)
        } else
            ElmObj.fireEvent("onchange")
    };
    _self.show_sel_box = function(e, ElmObj) {
        if (!ElmObj.classList.contains("--on"))
            ElmObj.classList.add("--on")
    };
    _self.close_sel_box = function(e, ElmObj) {
        if (ElmObj.classList.contains("--on"))
            ElmObj.classList.remove("--on")
    };
    _self.getSearchName = function(e) {
        var str_out = "";
        if (_mc["input_search"] != null)
            str_out = _mc["input_search"].value;
        else
            str_out = "";
        return str_out
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
    _self.keyPressEvent = function(keyEvent, targetObj) {
        var keyCode = util.getKeyCode();
        if (keyCode == 13)
            _self.click_btn_search()
    };
    _self.clean_search = function(e, param) {
        if (param.target_txt)
            param.target_txt.value = "";
        if (param.target)
            param.target.style.display = "none";
        _self.loadData()
    };
    _self.click_btn_search = function() {
        if (getView().viewportwidth >= 1024)
            _self.reloadEventHandler();
        else if (search_input_show)
            if (_self.getSearchName() != "")
                _self.reloadEventHandler();
            else {
                _mc["box_search"].classList.remove("search_on");
                search_input_show = false
            }
        else {
            _mc["box_search"].classList.add("search_on");
            search_input_show = true
        }
    };
    _self.show_box_search = function(e, param) {
        var use_target = param.target;
        if (use_target)
            if (param.act == "add")
                use_target.classList.add(param.class_name);
            else if (param.act == "remove")
            use_target.classList.remove(param.class_name)
    };
    _self.menu_go = function(e, targetObj) {
        var param = new Object;
        if (targetObj != null)
            if (Object.keys(targetObj).length > 0)
                param["postHash"] = targetObj;
        param["page"] = "retrieve_credit";
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.check_total_retrieve = function() {
        _self.setSysMsgVisible("total_retrieve", "loading");
        _self.load_retrieveData(null, {
            "act": "total_retrieve",
            "active": "N",
            "retrieve_total": 0
        })
    };
    _self.load_retrieveData = function(e, param) {
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", function(data) {
            _self.retrievedataCompele(data, param.this_param)
        });
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&langx=" + top.langx;
        urlParams += "&act=" + param.act;
        urlParams += "&active=" + param.active;
        if (param.active == "Y")
            urlParams += "&retrieve_total=" + param.retrieve_total;
        if (param.act == "one_retrieve") {
            urlParams += "&nowLayer=" + param.nowLayer;
            urlParams += "&nowId=" + param.nowId
        }
        urlParams = "p=get_retrieve&ver=" + top.ver + "&" + urlParams;
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.retrievedataCompele = function(data, this_param) {
        var arr_data = JSON.parse(data);
        if (arr_data != null)
            if (arr_data["act"] == "total_retrieve")
                if (arr_data["active"] == "N")
                    if (arr_data["status"] == "OK") {
                        if (arr_data["retrieve_data"]["lower_layer_num"] > 0 && arr_data["retrieve_data"]["retrieveTotal"] > 0) {
                            _mc["btn_total_retrieve"].classList.remove("disabled");
                            util.addEvent(_mc["btn_total_retrieve"], "click", _self.show_retrieve_confirm, arr_data)
                        } else
                            _mc["btn_total_retrieve"].classList.add("disabled");
                        _self.setSysMsgVisible("total_retrieve", "div");
                        total_retrieve_data_show = arr_data["retrieve_data"];
                        if (win.addEventListener)
                            win.addEventListener("orientationchange", _self.do_resize);
                        setTimeout(function(retrieve_data) {
                            _self.show_total_Rievedata(retrieve_data)
                        }, 200, arr_data["retrieve_data"])
                    } else if (arr_data["status"] == "0X002") {
            _self.setSysMsgVisible("total_retrieve", "div");
            total_retrieve_data_show = arr_data["retrieve_data"];
            if (win.addEventListener)
                win.addEventListener("orientationchange", _self.do_resize);
            setTimeout(function(retrieve_data) {
                _self.show_total_Rievedata(retrieve_data)
            }, 200, arr_data["retrieve_data"]);
            _mc["btn_total_retrieve"].classList.add("disabled");
            _mc["div_total_retrieve"].classList.add("empty")
        } else if (arr_data["status"] == "0X000") {
            var str_err_msg = LS.get("retrieve_err_" + arr_data["status"]);
            var fun_OK = _self.menu_go;
            _self.retrieve_showErrorMsg(str_err_msg, fun_OK)
        } else {
            var str_err_msg = arr_data["status"];
            if (LS.get("retrieve_err_" + arr_data["status"]) != null)
                str_err_msg = LS.get("retrieve_err_" + arr_data["status"]);
            var fun_OK = null;
            _self.retrieve_showErrorMsg(str_err_msg, fun_OK)
        } else {
            if (arr_data["active"] == "Y") {
                clearInterval(retrieve_loading);
                if (arr_data["status"] == "OK") {
                    _mc["loading_show"].innerHTML = "100%";
                    _mc["loading_width"].style.width = "100%";
                    setTimeout(function() {
                        _mc["div_loading_box"].style.display = "none";
                        _mc["div_loading_success"].style.display = ""
                    }, 200);
                    _self.control_mask(false, "loading_active");
                    util.addEvent(_mc["btn_retrieve_success"], "click", _self.menu_go, new Object)
                } else if (arr_data["status"] == "0X000" || arr_data["status"] == "0X002") {
                    var str_err_msg = LS.get("retrieve_err_0X000");
                    var fun_OK = _self.menu_go;
                    _self.retrieve_showErrorMsg(str_err_msg, fun_OK)
                } else {
                    var str_err_msg = arr_data["status"];
                    if (LS.get("retrieve_err_" + arr_data["status"]) != null)
                        str_err_msg = LS.get("retrieve_err_" + arr_data["status"]);
                    var fun_OK = null;
                    _self.retrieve_showErrorMsg(str_err_msg, fun_OK)
                }
            }
        } else if (arr_data["act"] == "one_retrieve")
            if (arr_data["active"] == "N")
                if (arr_data["status"] == "OK") {
                    arr_data["this_param"] = this_param;
                    _self.show_retrieve_confirm(null, arr_data)
                } else {
                    var str_err_msg = arr_data["status"];
                    if (LS.get("retrieve_err_" + arr_data["status"]) != null)
                        str_err_msg = LS.get("retrieve_err_" + arr_data["status"]);
                    var fun_OK = null;
                    _self.retrieve_showErrorMsg(str_err_msg, fun_OK)
                }
        else {
            if (arr_data["active"] == "Y") {
                clearInterval(retrieve_loading);
                if (arr_data["status"] == "OK") {
                    _mc["loading_show"].innerHTML = "100%";
                    _mc["loading_width"].style.width = "100%";
                    setTimeout(function() {
                        _mc["div_loading_box"].style.display = "none";
                        _mc["div_loading_success"].style.display = ""
                    }, 200);
                    var reload_param = new Object;
                    if (typeof paramObj != "undefined")
                        reload_param = paramObj;
                    _self.control_mask(false, "loading_active");
                    util.addEvent(_mc["btn_retrieve_success"], "click", _self.menu_go, reload_param)
                } else if (arr_data["status"] == "0X000") {
                    var str_err_msg = LS.get("retrieve_err_" + arr_data["status"]);
                    var fun_OK = _self.menu_go;
                    _self.retrieve_showErrorMsg(str_err_msg, fun_OK)
                } else {
                    var str_err_msg = arr_data["status"];
                    if (LS.get("retrieve_err_" + arr_data["status"]) != null)
                        str_err_msg = LS.get("retrieve_err_" + arr_data["status"]);
                    var fun_OK = null;
                    _self.retrieve_showErrorMsg(str_err_msg, fun_OK)
                }
            }
        } else if (arr_data["status"] == "0X001") {
            var str_err_msg = LS.get("retrieve_err_" + arr_data["status"]);
            var fun_OK = _self.goPageHome;
            _self.retrieve_showErrorMsg(str_err_msg, fun_OK)
        }
    };
    _self.setSysMsgVisible = function(type, isShowtype) {
        var arr_do_type = {
            "div": "none",
            "loading": "none"
        };
        var loading_obj = _mc["loading_" + type];
        if (loading_obj)
            loading_obj.classList.remove("--success");
        arr_do_type[isShowtype] = "";
        var show_time = 0;
        for (var key in arr_do_type) {
            show_time = 0;
            var do_obj = _mc[key + "_" + type];
            if (do_obj) {
                if (isShowtype == "div") {
                    show_time = 200;
                    if (loading_obj)
                        loading_obj.classList.add("--success")
                }
                setTimeout(function(do_obj, do_type) {
                    do_obj.style.display = do_type
                }, show_time, do_obj, arr_do_type[key])
            }
        }
    };
    _self.show_total_Rievedata = function(obj_retrieve_data) {
        var obj_width = _mc["total_retrieve"].offsetWidth;
        if (getView().viewportwidth < 1024) {
            delete total_rievedata_options.legend.left;
            total_rievedata_options["title"][0]["left"] = "center";
            total_rievedata_options["title"][1]["left"] = "center";
            total_rievedata_options["legend"]["top"] = "78%";
            var total_retrieve_height = "400px";
            total_rievedata_options["series"][0]["center"] = ["50%", "45%"];
            total_rievedata_options["series"][0]["radius"] = ["30%", "60%"];
            if (obj_width <= 313) {
                total_retrieve_height = "280px";
                total_rievedata_options["series"][0]["radius"] = ["20%", "50%"];
                total_rievedata_options["series"][0]["center"] = ["50%", "40%"];
                total_rievedata_options["legend"]["top"] = "70%"
            } else if (obj_width < 360) {
                total_retrieve_height = "320px";
                total_rievedata_options["series"][0]["center"] = ["50%", "40%"];
                total_rievedata_options["legend"]["top"] = "73%"
            } else if (obj_width < 410) {
                total_retrieve_height = "360px";
                total_rievedata_options["series"][0]["center"] = ["50%", "42%"]
            } else if (obj_width < 510)
                total_retrieve_height = "380px";
            _mc["total_retrieve"].style.height = total_retrieve_height
        } else {
            total_rievedata_options["series"][0]["radius"] = ["40%", "70%"];
            var left_per = "29%";
            _mc["total_retrieve"].style.height = "150px";
            total_rievedata_options["title"][0]["left"] = left_per;
            total_rievedata_options["title"][1]["left"] = left_per;
            total_rievedata_options["legend"]["left"] = left_per;
            delete total_rievedata_options.legend.top;
            total_rievedata_options["series"][0]["center"] = ["15%", "50%"]
        }
        if (getView().viewportwidth <= 1024)
            total_rievedata_options["series"][0]["label"]["emphasis"]["show"] = false;
        else
            total_rievedata_options["series"][0]["label"]["emphasis"]["show"] = true;
        try {
            totalRievedata = echarts.init(_mc["total_retrieve"])
        } catch (e) {
            totalRievedata = null
        }
        var str_rievedata_title = "";
        if (top.langx == "en-us")
            str_rievedata_title = obj_retrieve_data["lower_layer_num"] + " " + LS.get("enable_N") + " " + LS.get("str_" + obj_retrieve_data["lower_layer"]) + "(s)";
        else
            str_rievedata_title = obj_retrieve_data["lower_layer_num"] + " " + LS.get("enable_N") + LS.get("str_" + obj_retrieve_data["lower_layer"]);
        total_rievedata_options["title"][0]["text"] = str_rievedata_title;
        total_rievedata_options["title"][1]["subtext"] = LS.get("totalN_retrieve") + " " + util.mprintf(util.showTxt(obj_retrieve_data["maxTotal"]) * 1, 0, 0, false, true);
        total_rievedata_options["series"][0]["data"][0]["name"] = LS.get("total_retrieve");
        total_rievedata_options["series"][0]["data"][0]["value"] = obj_retrieve_data["retrieveTotal"];
        total_rievedata_options["series"][0]["data"][1]["name"] = LS.get("totalLave_retrieve");
        total_rievedata_options["series"][0]["data"][1]["value"] = obj_retrieve_data["maxTotal"] - obj_retrieve_data["retrieveTotal"];
        list = total_rievedata_options["series"][0]["data"];
        if (totalRievedata != null && (obj_retrieve_data["maxTotal"] > 0 || obj_retrieve_data["retrieveTotal"] > 0)) {
            totalRievedata.setOption(total_rievedata_options);
            totalRievedata.on("legendselectchanged", function(params) {
                var option = this.getOption();
                option.legend[0].selected[params.name] = true;
                this.setOption(option)
            })
        } else
            _mc["total_retrieve"].style.height = 0;
        show_total_retrieve_height = _mc["show_total_retrieve"].clientHeight + gap_px;
        keepScrollTop = _mc["head_select"].offsetHeight + header_height + menu_ul_height + show_total_retrieve_height;
        overScrollTop = _mc["head_select"].offsetHeight + header_height + menu_ul_height + show_total_retrieve_height
    };
    _self.do_resize = function(e) {
        totalRievedata.dispose();
        setTimeout(function(retrieve_data) {
            _self.show_total_Rievedata(retrieve_data)
        }, 200, total_retrieve_data_show)
    };
    _self.show_retrieve_confirm = function(e, retrieve_data) {
        util.addEvent(_mc["btn_close_retrieve_confirm"], "click", _self.close_retrieve_confirm);
        util.addEvent(_mc["btn_cancel_retrieve_confirm"], "click", _self.close_retrieve_confirm);
        _mc["titel_retrieve_confirm"].innerHTML = LS.get("Re_model_" + retrieve_data.act);
        _mc["msg_retrieve_confirm"].innerHTML = LS.get("Re_msg_" + retrieve_data.act);
        var str_be_retrieve_name = "";
        var str_be_retrieve_credit = "";
        var str_do_retrieve_name = "";
        var str_do_retrieve_credit = "";
        if (retrieve_data.act == "total_retrieve") {
            str_be_retrieve_name = LS.get("Re_be_total_retrieve");
            str_be_retrieve_credit = util.mprintf(util.showTxt(retrieve_data.retrieve_data["maxTotal"]) * 1, 0, 2, false, true);
            str_do_retrieve_name = LS.get("Re_to_total_retrieve");
            str_do_retrieve_credit = util.mprintf(util.showTxt(retrieve_data.retrieve_data["retrieveTotal"]) * 1, 0, 2, false, true)
        } else if (retrieve_data.act == "one_retrieve") {
            var this_param = retrieve_data.this_param;
            str_be_retrieve_name = "(" + LS.get("str_retrieve_" + retrieve_data.retrieve_data["now_layer"]) + ") <code class='spFont'>" + this_param.username + "</code>";
            str_be_retrieve_credit = util.mprintf(util.showTxt(retrieve_data.retrieve_data["maxTotal"]) * 1, 0, 2, false, true);
            if (this_param.this_layer == first_level)
                str_do_retrieve_name = LS.get("Re_to_total_retrieve");
            else
                str_do_retrieve_name = "(" + LS.get("str_retrieve_" + this_uplayer_data["up_layer"]) + ") <code class='spFont'>" + this_uplayer_data["up_username"] + "</code>";
            str_do_retrieve_credit = util.mprintf(util.showTxt(retrieve_data.retrieve_data["retrieveTotal"]) * 1, 0, 2, false, true);
            retrieve_data.retrieve_data["lower_layer_num"] = this_param["lowerN_count"]
        }
        _mc["be_retrieve_name"].innerHTML = str_be_retrieve_name;
        _mc["be_retrieve_credit"].innerHTML = str_be_retrieve_credit;
        _mc["do_retrieve_name"].innerHTML = str_do_retrieve_name;
        _mc["do_retrieve_credit"].innerHTML = str_do_retrieve_credit;
        if (retrieve_data.retrieve_data["retrieveTotal"] > 0) {
            _mc["btn_do_retrieve_confirm"].classList.remove("disabled");
            util.addEvent(_mc["btn_do_retrieve_confirm"], "click", _self.do_retrieve_confirm, {
                "data": retrieve_data,
                "str_be_retrieve_name": str_be_retrieve_name,
                "str_do_retrieve_name": str_do_retrieve_name
            })
        } else {
            _mc["btn_do_retrieve_confirm"].classList.add("disabled");
            util.removeEvent(_mc["btn_do_retrieve_confirm"], "click")
        }
        _self.arrowAnimation(_mc["lottie-container"]);
        _self.control_mask(true, "retrieve_active");
        _mc["div_retrieve_confirm"].style.display = "";
        dom.getElementById("ma_content").setAttribute("style", "overflow-y:hidden;");
        dom.body.setAttribute("style", "position:fixed; overflow-y:hidden;")
    };
    _self.close_retrieve_confirm = function(e) {
        _mc["div_retrieve_confirm"].style.display = "none";
        dom.getElementById("ma_content").removeAttribute("style");
        dom.body.removeAttribute("style");
        _self.control_mask(false, "retrieve_active");
        _self.control_mask(false, "loading_active")
    };
    _self.do_retrieve_confirm = function(e, param) {
        var retrieve_data = param.data.retrieve_data;
        _mc["loading_be_retrieve_name"].innerHTML = param.str_be_retrieve_name;
        _mc["loading_do_retrieve_name"].innerHTML = param.str_do_retrieve_name;
        _self.arrowAnimation(_mc["loading_lottie-container"]);
        _self.close_retrieve_confirm();
        _mc["div_loading_box"].style.display = "";
        _mc["div_loading_success"].style.display = "none";
        _mc["div_retrieve_loading"].style.display = "";
        _self.control_mask(true, "loading_active");
        _self.progressBarAnimation(_mc["loading_show"], _mc["loading_width"], retrieve_data.lower_layer_num * 5);
        var send_param = new Object;
        send_param["act"] = param.data.act;
        send_param["active"] = "Y";
        send_param["retrieve_total"] = retrieve_data["retrieveTotal"];
        if (param.data.act == "one_retrieve") {
            send_param["nowLayer"] = param.data.this_param["this_layer"];
            send_param["nowId"] = param.data.this_param["id"]
        }
        _self.load_retrieveData(null, send_param)
    };
    _self.arrowAnimation = function(lottieContainer) {
        var arrowPlayer = document.createElement("lottie-player");
        lottieContainer.innerHTML = "";
        fetch(arrowAnimation_json).then(async res => {
            try {
                var jsonData = await res.json();
                arrowPlayer.setAttribute("id", "animation-player");
                arrowPlayer.background = "transparent";
                arrowPlayer.speed = 1;
                arrowPlayer.loop = true;
                arrowPlayer.width = 92;
                arrowPlayer.height = 67;
                arrowPlayer.autoplay = true;
                arrowPlayer.controls = false;
                arrowPlayer.src = jsonData;
                lottieContainer.appendChild(arrowPlayer);
                arrowPlayer.play()
            } catch (error) {}
        })
    };
    _self.progressBarAnimation = function(obj_loading_show, obj_loading_width, to_end_sec) {
        var width = 0;
        var once_time = Math.round(to_end_sec * 1E3 / 99);
        retrieve_loading = setInterval(frame, once_time);

        function frame() {
            if (width >= 99)
                clearInterval(retrieve_loading);
            else {
                width++;
                obj_loading_width.style.width = width + "%";
                obj_loading_show.innerHTML = width * 1 + "%"
            }
        }
    };
    _self.retrieve_showErrorMsg = function(str_err_msg, fun_OK) {
        util.addEvent(_mc["btn_close_error_msg"], "click", function() {
            if (fun_OK != null)
                fun_OK();
            _mc["div_error_msg"].style.display = "none"
        });
        _mc["error_msg"].innerHTML = str_err_msg;
        _mc["div_error_msg"].style.display = "";
        _self.control_mask(false, "retrieve_active")
    };
    _self.goPageHome = function() {
        parentClass.dispatchEvent("bodyGoToPage", {
            "page": "dashboard_main",
            "pageName": "dashboard"
        })
    };
    _self.control_mask = function(is_show, use_classname) {
        if (is_show)
            dom.getElementById("home_show").classList.add(use_classname);
        else
            dom.getElementById("home_show").classList.remove(use_classname)
    }
};
