function acc_eventlog(_win, _dom, param) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_account;
    var eventHandler = new Object;
    var _mc = new Object;
    var nowSortDate = "ThisMonths";
    var nowSortField = "ALL";
    var nowSort = "adddate";
    var nowAorD = "down";
    var show_layer = "";
    var show_id = "";
    var user_type = "";
    var keepScrollTop = 109;
    var overScrollTop = 109;
    var lazy_sw = null;
    var lazy_count = null;
    var lazy_page = null;
    var lazy_total_page = null;
    var lazy_loading = false;
    var scroll_e = null;
    var dataHash = null;
    var currentOnLiDate = "";
    var currentOnLiOrder = "";
    var currentSort = "";
    var footer_height = 0;
    var pb_height = 0;
    _self.init = function() {
        dom.getElementById("body_show").classList.remove("body_pb");
        show_layer = param["edit_layer"];
        show_id = param["edit_id"];
        user_type = param["edit_type"];
        util.echo("acc eventlog complete");
        _self.getViewAllEle();
        _self.addStaticListen();
        _self.getSearchData();
        _self.initLazy();
        dom.getElementById("body_show").classList.add("body_pb");
        pb_height = util.countPaddingPx(dom.getElementById("scroll_div"))
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_account = parentClass.getThis("LS_account")
    };
    _self.getViewAllEle = function() {
        _mc["ser_date_view"] = dom.getElementById("ser_date_view");
        _mc["ser_order_view"] = dom.getElementById("ser_order_view");
        _mc["ser_date_title"] = dom.getElementById("ser_date_title");
        _mc["ser_order_title"] = dom.getElementById("ser_order_title");
        _mc["ul_date"] = dom.getElementById("ul_date");
        _mc["ul_order"] = dom.getElementById("ul_order");
        _mc["no_data_view"] = dom.getElementById("no_data_view");
        _mc["sel_date_view"] = dom.getElementById("sel_date_view");
        _mc["sel_order_view"] = dom.getElementById("sel_order_view")
    };
    _self.parseData = function(data) {
        var showmain = dom.getElementById("showmain");
        var parseDate = data["outData"];
        _self.setHidden(_mc["no_data_view"], true);
        _self.setHidden(showmain, false);
        if (parseDate != null && parseDate.length > 0) {
            var xmp_header = dom.getElementById("xmp_header").innerHTML;
            var xmp_foot = dom.getElementById("xmp_foot").innerHTML;
            var outdata = xmp_header;
            var tmp_out_data = "";
            var s = 0;
            var e = 0;
            if (lazy_sw) {
                s = (lazy_page - 1) * lazy_count;
                e = lazy_page == lazy_total_page ? parseDate.length : lazy_page * lazy_count
            } else {
                s = 0;
                e = parseDate.length
            }
            for (var i = s; i < e; i++) {
                var tmpdata = parseDate[i];
                var xmp_contant = dom.getElementById("xmp_contant").innerHTML;
                var adddate = tmpdata["adddate"].replace(/\-/g, "/");
                xmp_contant = xmp_contant.replace(/\*ADDDATE\*/g, adddate);
                var activitiSTR = "";
                activitiSTR = LS.get("acc_str_" + tmpdata["act_field"]);
                if (tmpdata["is_sub"] == "Y" && (tmpdata["act_field"] == "password" || tmpdata["act_field"] == "add") && false)
                    if (tmpdata["act_table"] == "mem") {
                        xmp_contant = xmp_contant.replace(/\*ACTIVITIES\*/g, activitiSTR);
                        xmp_contant = xmp_contant.replace(/\*ACTIVITIES_USER\*/g, LS.get("str_" + tmpdata["act_table"]))
                    } else {
                        xmp_contant = xmp_contant.replace(/\*ACTIVITIES\*/g, activitiSTR);
                        xmp_contant = xmp_contant.replace(/\*ACTIVITIES_USER\*/g, LS.get("str_" + tmpdata["act_table"] + "_sub"))
                    }
                else {
                    xmp_contant = xmp_contant.replace(/\*ACTIVITIES\*/g, activitiSTR);
                    xmp_contant = xmp_contant.replace(/\*ACTIVITIES_USER\*/g, LS.get("str_" + tmpdata["act_table"]))
                }
                var nameAry = tmpdata["uname"].split("|");
                if (nameAry.length > 1) {
                    xmp_contant = xmp_contant.replace(/\*USERNAME\*/g, nameAry[0]);
                    xmp_contant = xmp_contant.replace(/\*USERTYPE\*/g, nameAry[1])
                } else {
                    xmp_contant = xmp_contant.replace(/\*USERNAME\*/g, "");
                    xmp_contant = xmp_contant.replace(/\*USERTYPE\*/g, nameAry[0])
                }
                var oldcr = "-";
                var newcr = "-";
                var oldstr = "";
                var newstr = "";
                if (tmpdata["newValue"] != null)
                    newcr = tmpdata["newValue"];
                if (tmpdata["act_content"].indexOf("->") != -1) {
                    var tmpstr = "";
                    if (tmpdata["act_content"].indexOf("phone edit : ") != -1) {
                        var tmp = tmpdata["act_content"].split("phone edit : ");
                        tmpstr = tmp[1]
                    } else
                        tmpstr = tmpdata["act_content"];
                    var tmpcontent = tmpstr.split("->");
                    if (tmpcontent.length >= 2) {
                        if (tmpdata["act_field"].indexOf("enable") != -1) {
                            oldcr = _self.transLS(tmpcontent[0]);
                            newcr = _self.transLS(tmpcontent[1])
                        } else {
                            oldcr = _self._number_format(tmpcontent[0]);
                            newcr = _self._number_format(tmpcontent[1])
                        }
                        oldstr = LS_account.get("str_old");
                        newstr = LS_account.get("str_new")
                    }
                }
                xmp_contant = xmp_contant.replace(/\*OLDCREADITS\*/g, oldcr);
                xmp_contant = xmp_contant.replace(/\*NEWCREADITS\*/g, newcr);
                xmp_contant = xmp_contant.replace(/\*OLD\*/g, oldstr);
                xmp_contant = xmp_contant.replace(/\*NEW\*/g, newstr);
                tmp_out_data += xmp_contant
            }
            if (lazy_page == 1) {
                outdata += tmp_out_data;
                outdata += xmp_foot;
                showmain.innerHTML = outdata;
                _self.addDynamicListen();
                _self.showAndHidden(_mc[nowSort + "_sort"], "sort_" + nowAorD);
                currentSort = "sort_down";
                parentClass.dispatchEvent("showLoading", {
                    "showLoading": false
                })
            } else
                _self.table_append(showmain.children[0], tmp_out_data);
            _self.scroll_ver_event(scroll_e, dom.getElementById("ma_content"));
            _self.setLzayLoadingVisible(false)
        } else {
            _self.setHidden(showmain, true);
            _self.setHidden(_mc["no_data_view"], false);
            parentClass.dispatchEvent("showLoading", {
                "showLoading": false
            })
        }
    };
    _self.table_append = function(_Obj, str_append) {
        var divObj = document.createElement("div");
        divObj.innerHTML = str_append;
        while (divObj.firstChild)
            _Obj.appendChild(divObj.firstChild)
    };
    _self.addStaticListen = function() {
        util.setInfEvent(_mc["ser_date_view"], {
            "_focus": _mc["ul_date"],
            "_setView": _mc["ser_date_view"],
            "_viewClass": "--on"
        });
        util.setInfEvent(_mc["ser_order_view"], {
            "_focus": _mc["ul_order"],
            "_setView": _mc["ser_order_view"],
            "_viewClass": "--on"
        });
        var ul_dateCh = _mc["ul_date"].children;
        currentOnLiDate = ul_dateCh[0];
        for (var i = 0; i < ul_dateCh.length; i++)
            util.addEvent(ul_dateCh[i], "click", _self.onClickEventHandler, {
                "target": "ul_bar",
                "h1": _mc["ser_date_title"],
                "type": "date"
            });
        util.addEvent(_mc["sel_date_view"], "change", _self.onChangeEventHandler);
        var ul_orderCh = _mc["ul_order"].children;
        currentOnLiOrder = ul_orderCh[0];
        var arr_remove = new Array;
        for (var i = 0; i < ul_orderCh.length; i++) {
            if (show_layer == "ag" || show_layer == "mem") {
                if (typeof param["pay_type"] != "undefined")
                    if (param["pay_type"] == 1 && ul_orderCh[i].getAttribute("value") == "CREDIT") {
                        arr_remove.push(i);
                        continue
                    }
                if (show_layer == "mem" && ul_orderCh[i].getAttribute("value") == "ADD") {
                    arr_remove.push(i);
                    continue
                }
            }
            var this_value = ul_orderCh[i].getAttribute("value").toLowerCase();
            if (this_value.indexOf("retrieve") != -1) {
                if (this_value == "retrieve" && show_layer == "mem") {
                    arr_remove.push(i);
                    continue
                }
                if (top.user_type != 1 || top.pay_type != "0" || top.retrieve_sw != "Y" || top.user_enable != "Y" || param["pay_type"] == 1) {
                    arr_remove.push(i);
                    continue
                }
            }
            util.addEvent(ul_orderCh[i], "click", _self.onClickEventHandler, {
                "target": "ul_bar",
                "h1": _mc["ser_order_title"],
                "type": "order"
            })
        }
        if (arr_remove.length > 0)
            for (var i = arr_remove.length - 1; i >= 0; i--)
                ul_orderCh[arr_remove[i]].parentNode.removeChild(ul_orderCh[arr_remove[i]]);
        var arr_remove = new Array;
        var option_orderCh = _mc["sel_order_view"].children;
        for (var i = 0; i < option_orderCh.length; i++) {
            if (show_layer == "ag" || show_layer == "mem") {
                if (typeof param["pay_type"] != "undefined")
                    if (param["pay_type"] == 1 && option_orderCh[i].value == "CREDIT") {
                        arr_remove.push(i);
                        continue
                    }
                if (show_layer == "mem" && option_orderCh[i].value == "ADD") {
                    arr_remove.push(i);
                    continue
                }
            }
            var this_value = option_orderCh[i].value.toLowerCase();
            if (this_value.indexOf("retrieve") != -1) {
                if (this_value == "retrieve" && show_layer == "mem") {
                    arr_remove.push(i);
                    continue
                }
                if (top.user_type != 1 || top.pay_type != "0" || top.retrieve_sw != "Y" || top.user_enable != "Y" || param["pay_type"] == 1) {
                    arr_remove.push(i);
                    continue
                }
            }
        }
        if (arr_remove.length > 0)
            for (var i = arr_remove.length - 1; i >= 0; i--)
                option_orderCh[arr_remove[i]].parentNode.removeChild(option_orderCh[arr_remove[i]]);
        util.addEvent(_mc["sel_order_view"], "change", _self.onChangeEventHandler);
        _self.setScrollEvent()
    };
    _self.setScrollEvent = function(isset) {
        var ref = dom.getElementById("re_functionG");
        var acceo = dom.getElementById("acc_edit_offset");
        var header_height = dom.getElementById("main_header").clientHeight;
        footer_height = dom.getElementById("footer_show").clientHeight;
        keepScrollTop = ref.offsetHeight + acceo.offsetHeight + header_height;
        overScrollTop = ref.offsetHeight + acceo.offsetHeight + header_height;
        if (!param.disableScrollEvent || isset)
            util.addEvent(dom.getElementById("ma_content"), "scroll", _self.scrollEvent, dom.getElementById("showBody"))
    };
    _self.addDynamicListen = function() {
        _mc["adddate_sort"] = dom.getElementById("adddate_sort");
        _mc["act_field_sort"] = dom.getElementById("act_field_sort");
        util.addEvent(_mc["adddate_sort"], "click", _self.onClickEventHandler, {
            "target": "adddate_sort",
            "data": "adddate"
        });
        util.addEvent(_mc["act_field_sort"], "click", _self.onClickEventHandler, {
            "target": "act_field_sort",
            "data": "act_field"
        })
    };
    _self.onClickEventHandler = function(evt, param) {
        var DOM = evt.target;
        if (param.target == "ul_bar") {
            if (DOM.tagName != "LI")
                return;
            if (param.type == "date") {
                if (currentOnLiDate)
                    currentOnLiDate.classList.remove("--on");
                DOM.classList.add("--on");
                currentOnLiDate = DOM
            } else if (param.type == "order") {
                if (currentOnLiOrder)
                    currentOnLiOrder.classList.remove("--on");
                DOM.classList.add("--on");
                currentOnLiOrder = DOM
            }
            _self.labarFunc(param.h1, DOM.innerHTML);
            if (param.h1.id.indexOf("date") != -1)
                nowSortDate = DOM.getAttribute("value");
            else if (param.h1.id.indexOf("order") != -1)
                nowSortField = DOM.getAttribute("value");
            _self.getSearchData()
        } else if (param.target.indexOf("_sort") != -1) {
            var divClass = DOM.className;
            nowSort = param.data;
            var divClass = DOM.className;
            nowSort = param.data;
            if (divClass.indexOf("sort_up") != -1) {
                nowAorD = "down";
                currentSort = "sort_up"
            } else {
                nowAorD = "up";
                currentSort = "sort_down"
            }
            _self.getSearchData()
        }
    };
    _self.onChangeEventHandler = function(evt) {
        var h1 = evt.target.id;
        if (h1.indexOf("date") != -1)
            nowSortDate = evt.target.value;
        else if (h1.indexOf("order") != -1)
            nowSortField = evt.target.value;
        _self.getSearchData()
    };
    _self.getSearchData = function() {
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&layer_id=" + top.layer_id;
        urlParams += "&sortName=" + nowSort;
        urlParams += "&sortType=" + nowAorD;
        urlParams += "&sortDate=" + nowSortDate;
        urlParams += "&sortField=" + nowSortField;
        urlParams += "&showLayer=" + show_layer;
        urlParams += "&showId=" + show_id;
        urlParams += "&user_type=" + user_type;
        if (typeof param["pay_type"] != "undefined")
            urlParams += "&pay_type=" + param["pay_type"];
        else
            urlParams += "&pay_type=0";
        urlParams += "&langx=" + top.langx;
        urlParams = "p=get_acc_eventlog&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest;
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams)
    };
    _self.connectComplete = function(data) {
        try {
            var arr_data = JSON.parse(data);
            dataHash = arr_data;
            _self.reSetLazy(arr_data["outData"]);
            _self.parseData(arr_data)
        } catch (e) {
            util.echo(e)
        }
    };
    _self.showAndHidden = function(titleObj, cName) {
        if (currentSort == "")
            titleObj.classList.add(cName);
        else {
            titleObj.classList.remove(currentSort);
            titleObj.classList.add(cName)
        }
    };
    _self.setObjectClass = function(targetObj, classStr) {
        if (targetObj.className != undefined)
            targetObj.className = classStr;
        else
            targetObj.setAttribute("class", classStr)
    };
    _self.onError = function() {
        util.echo("onError")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.changePage = function(e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param)
    };
    _self.changePageComplete = function() {};
    _self.addEventListener = function(eventname, eventFunction) {
        eventHandler[eventname] = eventFunction
    };
    _self.dispatchEvent = function(eventname, param) {
        if (eventHandler[eventname])
            eventHandler[eventname](param)
    };
    _self.labarFunc = function(innerDom, val) {
        innerDom.innerHTML = val
    };
    _self.setHidden = function(el, oks) {
        if (el == null)
            return;
        el.style.display = oks ? "none" : ""
    };
    _self._number_format = function(num, decimals, dec_point, thousands_sep) {
        if (num == undefined)
            return "";
        decimals = decimals || 0;
        decimals = decimals * 1;
        dec_point = dec_point || ".";
        thousands_sep = thousands_sep || ",";
        var sign = "";
        var ans = "";
        num = num.toString();
        if (isFinite(num.replace(/,/g, ""))) {
            num = num.replace(/,/g, "");
            num_ary = num.split(".");
            ans = "";
            num0 = num_ary[0];
            if (num0 * 1 < 0) {
                sign = "-";
                num0 = num0.substr(1, num0.length)
            }
            num_ary[1] == undefined ? num1 = "" : num1 = num_ary[1];
            len = num0.length;
            for (var i = 1; i <= len; i++) {
                ans = num0.substr(len - i, 1) + ans;
                if (i % 3 == 0 && i != len)
                    ans = thousands_sep + ans
            }
            num0 = ans;
            if (decimals != 0) {
                ans = "";
                for (var i = 0; i < decimals; i++)
                    if (num1.charAt(i) == "")
                        ans += 0;
                    else
                        ans += num1.substr(i, 1);
                num1 = ans;
                ret_str = sign + num0 + dec_point + num1
            } else
                ret_str = sign + num0;
            return ret_str
        } else
            return num
    };
    _self.transLS = function(val) {
        var hash = new Object;
        hash["Y"] = LS.get("enable_str_Active");
        hash["N"] = LS.get("enable_str_Inactive");
        hash["S"] = LS.get("enable_str_ViewOnly");
        hash["F"] = LS.get("enable_str_Suspended");
        return hash[val] ? hash[val] : ""
    };
    _self.sortData = function(ary, types, up_down) {
        if (ary.length <= 1)
            return ary;
        if (up_down)
            var sortfun = function(a, b) {
                return a[types] > b[types] ? 1 : -1
            };
        else
            var sortfun = function(a, b) {
                return a[types] < b[types] ? 1 : -1
            };
        return ary.sort(sortfun)
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
    _self.scroll_ver_event = function(e, targetObj) {
        if (e == null || !dom.getElementById("showBody"))
            return;
        var newScrollTop = e.target.scrollTop;
        var ori_h = e.target.scrollHeight;
        var now_h = 0;
        var func_h = dom.getElementById("showBody").clientHeight;
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
        var scroll_bottom = newScrollTop >= s_h - c_h - footer_height * 1 - pb_height;
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
    }
};
