function acc_mem_add(_win, _dom, _paramObj) {
            var _self = this;
            var win = _win;
            var dom = _dom;
            var parentClass;
            var util;
            var LS;
            var LS_code;
            var LS_account;
            var config_set;
            var topFrame;
            var paramObj = _paramObj;
            var _mc = new Object;
            var ctlObj = new Array;
            var confObj = new Array;
            var ltpObj = new Array;
            var titleObj = new Array;
            var templateObj = new Array;
            var credit_old;
            var commiss_gtype = "FT";
            var balance = 0;
            var MainCurrency = "RMB";
            var up_userData = new Array;
            var templateData = new Array;
            var do_set_template = false;
            var now_template = "";
            var mem_url = "";
            var mem_url_QR = "";
            var user_information = new Array;
            _self.init = function() {
                dom.getElementById("body_show").classList.add("bgf0f0f0");
                // parentClass.dispatchEvent("chgPageName", {
                //     "pageType": "account",
                //     "pageName": "mem_add"
                // });
                parentClass.dispatchEvent("chgLeftMenuColor", {
                    "target": "account",
                    "id": "MEM"
                });
                var obj = new Object();
                obj["Alert"] = {
                    "msg": LS_account.get("str_unsave"),
                    "mode": "Y"
                };
                obj["ifNo"] = _self.exitConfirmNo();
                parentClass.dispatchEvent("SetConfirmExit", obj);
                var _history_num = win._history.length;
                if (win._history[_history_num - 1].page == _self.constructor.name) win._history.splice( - 1, 1);
                var obj_ids = ",div_all,template_illustrate,template_learnmore,btn_create_template,";
                obj_ids += "div_template,template_scroll,template_model,msg_template,";
                _mc = util.getObjAry(dom, obj_ids);
                util.addEvent(_mc["template_learnmore"], "click", topFrame.show_modal_more);
                util.addEvent(_mc["btn_create_template"], "click", _self.go_create_template);
                util.addEvent(_mc["template_scroll"], "scroll", _self.roll, {
                    "chk_obj": _mc["template_scroll"],
                    "do_obj": _mc["div_template"]
                });
                var obj_ids = ",step_account,step_commission,step_finish,account_info,commission_info,finish_info,";
                obj_ids += "sel_upper,sel_ltype,upper_user,sel_upper_LB,sel_upper_SL,";
                obj_ids += "box_user,input_user,msg_user,btn_create_name,create_name_loading,box_alias,input_alias,msg_alias,";
                obj_ids += "box_passwd,input_passwd,msg_passwd,passwd_rule,";
                obj_ids += "eye_pwd,pwd_light,div_show_strong,complexity,strengthTxt,first_estimate,";
                obj_ids += "show_pay_type,balance,box_credit,input_credit,msg_credit,";
                obj_ids += "sel_currency,input_credit_RMB,div_rate,currency_name,currency_def,";
                obj_ids += "FT_commis_info,BK_commis_info,OP_commis_info,FS_commis_info,";
                var tmpObj = util.getObjAry(dom, obj_ids);
                _mc = util.mergeArray(_mc, tmpObj);
                if (top.login_layer == "ag") {
                    _mc["sel_upper_LB"].style.display = "none";
                    _mc["sel_upper_SL"].style.display = "none"
                }
                ctlObj["user"] = new Object;
                ctlObj["user"].box = _mc["box_user"];
                ctlObj["user"].input = _mc["input_user"];
                ctlObj["user"].msg = _mc["msg_user"];
                ctlObj["alias"] = new Object;
                ctlObj["alias"].box = _mc["box_alias"];
                ctlObj["alias"].input = _mc["input_alias"];
                ctlObj["alias"].msg = _mc["msg_alias"];
                ctlObj["passwd"] = new Object;
                ctlObj["passwd"].box = _mc["box_passwd"];
                ctlObj["passwd"].input = _mc["input_passwd"];
                ctlObj["passwd"].msg = _mc["msg_passwd"];
                _mc["eye_pwd"].isShow = true;
                _mc["eye_pwd"].BlurPwdOFF = false;
                ctlObj["credit"] = new Object;
                ctlObj["credit"].box = _mc["box_credit"];
                ctlObj["credit"].input = _mc["input_credit"];
                ctlObj["credit"].msg = _mc["msg_credit"];
                util.ChkKeyUser(ctlObj["user"].input);
                util.addEvent(ctlObj["user"].input, "blur", _self.checkUserNameEvent, ctlObj["user"].input);
                util.addEvent(ctlObj["user"].input, "blur", _self.inputboxBlurEvent, ctlObj["user"], false);
                util.addEvent(ctlObj["user"].input, "focus", _self.inputboxFocusEvent, ctlObj["user"]);
                util.addEvent(_mc["btn_create_name"], "click", _self.create_random_name, {
                    "doObj": ctlObj["user"].input,
                    "create_num": 6
                });
                util.addEvent(_mc["btn_create_name"], "mousedown", _self.BlurUserOFF, _mc["btn_create_name"]);
                _mc["btn_create_name"].BlurUserOFF = false;
                util.ChkKeyAlias(ctlObj["alias"].input);
                util.addEvent(ctlObj["alias"].input, "blur", _self.checkNameEvent, ctlObj["alias"].input);
                util.addEvent(ctlObj["alias"].input, "blur", _self.inputboxBlurEvent, ctlObj["alias"], false);
                util.addEvent(ctlObj["alias"].input, "focus", _self.inputboxFocusEvent, ctlObj["alias"]);
                util.ChkKeyUser(ctlObj["passwd"].input);
                util.addEvent(ctlObj["passwd"].input, "keyup", _self.checkThisPassword, ctlObj["passwd"].input);
                util.addEvent(ctlObj["passwd"].input, "blur", _self.checkThisPassword, ctlObj["passwd"].input);
                util.addEvent(ctlObj["passwd"].input, "blur", _self.inputboxBlurEvent, ctlObj["passwd"], false);
                util.addEvent(ctlObj["passwd"].input, "focus", _self.inputboxFocusEvent, ctlObj["passwd"]);
                util.addEvent(ctlObj["credit"].input, "keydown", _self.keep_credit);
                util.ChkKeyCash(ctlObj["credit"].input, {
                    initShow: _self.initShow,
                    onErr: _self.ChkCreditErr,
                    onSuc: _self.show_credits
                });
                util.addEvent(ctlObj["credit"].input, "focus", _self.inputboxFocusEvent, ctlObj["credit"]);
                util.addEvent(ctlObj["credit"].input, "blur", _self.inputboxBlurEvent, ctlObj["credit"]);
                util.addEvent(_mc["sel_upper"], "change", _self.chgReload, _mc["sel_upper"]);
                util.addEvent(_mc["sel_ltype"], "change", _self.chgReload, _mc["sel_ltype"]);
                util.addEvent(_mc["sel_currency"], "change", _self.chgCurrencyEvent, _mc["sel_currency"]);
                util.addEvent(_mc["eye_pwd"], "click", _self.showPwd, _mc["eye_pwd"]);
                util.addEvent(_mc["eye_pwd"], "mousedown", _self.BlurPwdOFF, _mc["eye_pwd"]);
                _self.showPwd(null, _mc["eye_pwd"]);
                var obj_ids = ",div_commis_title,commis_title_scroll,";
                var tmpObj = util.getObjAry(_mc["commission_info"], obj_ids);
                _mc = util.mergeArray(_mc, tmpObj);
                util.addEvent(_mc["commis_title_scroll"], "scroll", _self.roll, {
                    "chk_obj": _mc["commis_title_scroll"],
                    "do_obj": _mc["div_commis_title"]
                });
                var obj_ids = ",FT_commis_title,BK_commis_title,OP_commis_title,FS_commis_title,";
                var tmpObj = util.getObjAry(_mc["commission_info"], obj_ids);
                _mc = util.mergeArray(_mc, tmpObj);
                for (var objid in tmpObj) {
                    var ta = objid.split("_");
                    tmpObj[objid].mapA = ta[0];
                    tmpObj[objid].mapB = "_commis_info";
                    titleObj[objid] = tmpObj[objid];
                    util.addEvent(tmpObj[objid], "click", _self.ShowAndHidden, tmpObj[objid])
                }
                var obj_ids = ",FT_R_0_WAR,FT_R_0_SC,FT_R_0_SO,FT_RE_0_WAR,FT_RE_0_SC,FT_RE_0_SO,FT_M_0_WAR,FT_M_0_SC,FT_M_0_SO,FT_DT_0_WAR,FT_DT_0_SC,FT_DT_0_SO,FT_RDT_0_WAR,FT_RDT_0_SC,FT_RDT_0_SO,";
                obj_ids += "BK_R_0_WAR,BK_R_0_SC,BK_R_0_SO,BK_RE_0_WAR,BK_RE_0_SC,BK_RE_0_SO,BK_M_0_WAR,BK_M_0_SC,BK_M_0_SO,BK_DT_0_WAR,BK_DT_0_SC,BK_DT_0_SO,";
                obj_ids += "OP_R_0_WAR,OP_R_0_SC,OP_R_0_SO,OP_RE_0_WAR,OP_RE_0_SC,OP_RE_0_SO,OP_M_0_WAR,OP_M_0_SC,OP_M_0_SO,OP_DT_0_WAR,OP_DT_0_SC,OP_DT_0_SO,";
                obj_ids += "FS_FS_0_WAR,FS_FS_0_SC,FS_FS_0_SO,";
                obj_ids += "FT_R_0_SC_limit,FT_R_0_SO_limit,FT_RE_0_SC_limit,FT_RE_0_SO_limit,FT_M_0_SC_limit,FT_M_0_SO_limit,FT_DT_0_SC_limit,FT_DT_0_SO_limit,FT_RDT_0_SC_limit,FT_RDT_0_SO_limit,";
                obj_ids += "BK_R_0_SC_limit,BK_R_0_SO_limit,BK_RE_0_SC_limit,BK_RE_0_SO_limit,BK_M_0_SC_limit,BK_M_0_SO_limit,BK_DT_0_SC_limit,BK_DT_0_SO_limit,";
                obj_ids += "OP_R_0_SC_limit,OP_R_0_SO_limit,OP_RE_0_SC_limit,OP_RE_0_SO_limit,OP_M_0_SC_limit,OP_M_0_SO_limit,OP_DT_0_SC_limit,OP_DT_0_SO_limit,";
                obj_ids += "FS_FS_0_SC_limit,FS_FS_0_SO_limit,";
                obj_ids += "boxCMS_FT_R_SC,boxCMS_FT_RE_SC,boxCMS_FT_M_SC,boxCMS_FT_DT_SC,boxCMS_FT_RDT_SC,boxCMS_BK_R_SC,boxCMS_BK_RE_SC,boxCMS_BK_M_SC,boxCMS_BK_DT_SC,boxCMS_OP_R_SC,boxCMS_OP_RE_SC,boxCMS_OP_M_SC,boxCMS_OP_DT_SC,boxCMS_FS_FS_SC,";
                obj_ids += "boxCMS_FT_R_SO,boxCMS_FT_RE_SO,boxCMS_FT_M_SO,boxCMS_FT_DT_SO,boxCMS_FT_RDT_SO,boxCMS_BK_R_SO,boxCMS_BK_RE_SO,boxCMS_BK_M_SO,boxCMS_BK_DT_SO,boxCMS_OP_R_SO,boxCMS_OP_RE_SO,boxCMS_OP_M_SO,boxCMS_OP_DT_SO,boxCMS_FS_FS_SO,";
                obj_ids += "msgCMS_FT_R,msgCMS_FT_RE,msgCMS_FT_M,msgCMS_FT_DT,msgCMS_FT_RDT,msgCMS_BK_R,msgCMS_BK_RE,msgCMS_BK_M,msgCMS_BK_DT,msgCMS_OP_R,msgCMS_OP_RE,msgCMS_OP_M,msgCMS_OP_DT,msgCMS_FS_FS,";
                var tmpObj = util.getObjAry(_mc["commission_info"], obj_ids);
                _mc = util.mergeArray(_mc, tmpObj);
                for (var objid in tmpObj) if (objid.search("CMS") == -1) {
                    var tmp = objid.split("_");
                    confObj[objid] = tmpObj[objid];
                    confObj[objid].gtype = tmp[0];
                    confObj[objid].rtype = tmp[1];
                    confObj[objid].ltype = tmp[2];
                    confObj[objid].ftype = tmp[3];
                    confObj[objid].limit = tmp[4];
                    if (tmp[3] == "SC" || tmp[3] == "SO") {
                        confObj[objid].box = _mc["boxCMS_" + tmp[0] + "_" + tmp[1] + "_" + tmp[3]];
                        confObj[objid].msg = _mc["msgCMS_" + tmp[0] + "_" + tmp[1]]
                    }
                }
                var obj_ids = ",FT_R_0_ltype_pc,FT_RE_0_ltype_pc,BK_R_0_ltype_pc,BK_RE_0_ltype_pc,OP_R_0_ltype_pc,OP_RE_0_ltype_pc,";
                obj_ids += "FT_R_0_ltype_ph,FT_RE_0_ltype_ph,BK_R_0_ltype_ph,BK_RE_0_ltype_ph,OP_R_0_ltype_ph,OP_RE_0_ltype_ph,";
                var tmpObj = util.getObjAry(dom, obj_ids);
                for (var objid in tmpObj) ltpObj[objid] = tmpObj[objid];
                var tip_GENERALDATAicon = document.getElementsByName("tip_GENERALDATAicon");
                var len = tip_GENERALDATAicon.length;
                for (var i = 0; i < len; i++) {
                    var icon = tip_GENERALDATAicon[i];
                    util.addEvent(icon, "click", _self.showIconMsg, {
                        "_id": "modal_popup_data"
                    })
                }
                var tip_TYPECREDITicon = document.getElementsByName("tip_TYPECREDITicon");
                var len = tip_TYPECREDITicon.length;
                for (var i = 0; i < len; i++) {
                    var icon = tip_TYPECREDITicon[i];
                    util.addEvent(icon, "click", _self.showIconMsg, {
                        "_id": "modal_popup_acct"
                    })
                }
                var tip_BETLIMITicon = document.getElementsByName("tip_BETLIMITicon");
                var len = tip_BETLIMITicon.length;
                for (var i = 0; i < len; i++) {
                    var icon = tip_BETLIMITicon[i];
                    util.addEvent(icon, "click", _self.showIconMsg, {
                        "_id": "modal_popup_betl"
                    })
                }
                _self.show_info(null, {
                    "show": "account",
                    "set_step": 1
                });
                parentClass.dispatchEvent("show_modal_step", {
                    "show_step": true
                });
                up_userData = Array();
                if (paramObj.up_data != null) for (var key in paramObj.up_data) up_userData[paramObj.up_data[key]["id"]] = paramObj.up_data[key];
                else {
                    var tmp_data = Array();
                    tmp_data["id"] = paramObj.up_id;
                    tmp_data["username"] = paramObj.up_user;
                    tmp_data["pay_type"] = paramObj.pay_type;
                    up_userData[paramObj.up_id] = tmp_data
                }
                _mc["show_pay_type"].innerHTML = LS.get("long_pay_type_" + up_userData[paramObj.up_id]["pay_type"]);
                var obj_ids = ",div_QRcode,div_createQR,createUrl_showQR,btn_createQR,div_showQR,img_showQR,useUrl_showQR,";
                obj_ids += "show_alias,show_user,mem_copyArea,btn_copy_user,btn_copy_QR,";
                obj_ids += "btn_add_another,btn_go_list,";
                var tmpObj = util.getObjAry(_mc["finish_info"], obj_ids);
                _mc = util.mergeArray(_mc, tmpObj);
                util.addEvent(_mc["btn_copy_user"], "click", _self.copyInput, "user");
                util.addEvent(_mc["btn_copy_QR"], "click", _self.copyPic, _mc["img_showQR"]);
                util.addEvent(_mc["btn_add_another"], "click", _self.goPage, "new");
                util.addEvent(_mc["btn_go_list"], "click", _self.goPage, "list");
                _self.get_template_data();
                _self.initLtype()
            };
            _self.go_create_template = function() {
                var obj = new Object;
                obj.postHash = new Object;
                obj["page"] = "acc_mem_add_modal";
                obj["postHash"]["act"] = "createm";
                parentClass.dispatchEvent("bodyGoToPage", obj)
            };
            _self.goPage = function(mouseEvent, go_type) {
                if (go_type == "new") {
                    var obj = new Object;
                    obj.page = "acc_mem_add";
                    obj.postHash = paramObj;
                    obj.LeaveChkPass = true;
                    parentClass.dispatchEvent("bodyGoToPage", obj)
                } else if (go_type == "list") {
                    if (typeof paramObj.back_param == "undefined") paramObj.back_param = new Object;
                    paramObj.back_param.up_id = _mc["sel_upper"].value;
                    paramObj.back_param.up_username = up_userData[_mc["sel_upper"].value]["username"];
                    paramObj.back_param.pay_type = up_userData[_mc["sel_upper"].value]["pay_type"];
                    var obj = new Object;
                    obj.postHash = paramObj.back_param;
                    obj.page = "acc_mem_list";
                    obj.LeaveChkPass = true;
                    parentClass.dispatchEvent("bodyGoToPage", obj)
                }
            };
            _self.exitConfirmNo = function() {
                parentClass.dispatchEvent("chgLeftMenuColor", {
                    "target": "account",
                    "id": "MEM"
                })
            };
            _self.ShowAndHidden = function(mouseEvent, element) {
                for (var id in titleObj) if (titleObj[id].classList.contains("--on") && element.id != id) {
                    titleObj[id].classList.remove("--on");
                    var setNone = "" + titleObj[id].mapA + titleObj[id].mapB;
                    _mc[setNone].style.display = "none"
                }
                if (!element.classList.contains("--on")) element.classList.add("--on");
                var setView = "" + element.mapA + element.mapB;
                _mc[setView].style.display = ""
            };
            _self.loadUpperConf = function() {
                var getHttp = new HttpRequest;
                var param = _self.getConfParam();
                getHttp.addEventListener("LoadComplete", _self.loadConfFinish);
                param = "p=get_upper_conf&ver=" + top.ver + "&" + param;
                getHttp.loadURL(top.url, "POST", param)
            };
            _self.loadConfFinish = function(data) {
                var xmlObj = new Object;
                var arr_data = JSON.parse(data);
                if (util.chkErrorMsg(arr_data, LS_code)) return;
                var use_comm_value = arr_data.game;
                if (do_set_template) use_comm_value = templateData[now_template].game;
                xmlObj["user"] = arr_data.user;
                balance = util.showTxt(xmlObj["user"].surplus_maxcredit) * 1;
                _mc["show_pay_type"].innerHTML = LS.get("long_pay_type_" + up_userData[xmlObj["user"].id]["pay_type"]);
                _mc["balance"].org_value = balance * 1;
                _mc["balance"].innerHTML = util.mprintf(balance * 1, 0, 2, false, true);
                _mc["currency"] = arr_data.currency;
                _self.set_comm_value(arr_data.game, use_comm_value);
                _self.initCurrency();
                if (do_set_template) do_set_template = false;
                parentClass.dispatchEvent("showLoading", {
                    "showLoading": false
                })
            };
            _self.set_comm_value = function(up_value, _valueObj) {
                for (var objid in confObj) {
                    var obj = confObj[objid];
                    var gameObj = _valueObj[obj.gtype];
                    if (gameObj == null) continue;
                    var dataObj = gameObj.data[obj.rtype + "_" + _mc["sel_ltype"].value];
                    if (dataObj == null) continue;
                    var war = util.showTxt(dataObj.war);
                    var sc = util.showTxt(dataObj.sc);
                    var so = util.showTxt(dataObj.so);
                    var up_dataObj = up_value[obj.gtype].data[obj.rtype + "_" + _mc["sel_ltype"].value];
                    if (up_dataObj) {
                        var up_war = util.showTxt(up_dataObj.war);
                        var up_sc = util.showTxt(up_dataObj.sc);
                        var up_so = util.showTxt(up_dataObj.so)
                    } else {
                        var up_war = 0;
                        var up_sc = 0;
                        var up_so = 0
                    }
                    obj.war = war;
                    obj.sc = sc;
                    obj.so = so;
                    obj.up_war = up_war;
                    obj.up_sc = up_sc;
                    obj.up_so = up_so;
                    if (obj.limit != null) {
                        var setV = "";
                        if (obj.ftype == "SC") setV = up_sc;
                        else setV = up_so;
                        obj.innerHTML = LS.get("max_limit_head") + MainCurrency + " " + util.mprintf(setV * 1, 0, 0, false, true);
                        obj.setK = obj.gtype + "_" + obj.rtype + "_" + obj.ltype + "_" + obj.ftype;
                        obj.setV = setV
                    } else if (obj.ftype == "WAR") _self.initOption(obj, up_war, war, config_set.get("CONF_BAR_RANGE"));
                    else if (obj.ftype == "SC" || obj.ftype == "SO") {
                        if (obj.ftype == "SC") {
                            obj.value = util.mprintf(sc * 1, 0, 0, false, false);
                            obj.chgK = obj.gtype + "_" + obj.rtype + "_" + obj.ltype + "_SO";
                            util.addEvent(obj, "keydown", _self.keep_credit);
                            util.ChkKeyCash(obj, {
                                initShow: _self.initShow,
                                onErr: _self.ChkCreditErr,
                                onSuc: _self.count_so
                            })
                        } else {
                            obj.value = util.mprintf(so * 1, 0, 0, false, false);
                            util.addEvent(obj, "keydown", _self.keep_credit);
                            util.ChkKeyCash(obj, {
                                initShow: _self.initShow,
                                onErr: _self.ChkCreditErr,
                                onSuc: _self.show_credits
                            })
                        }
                        util.addEvent(obj, "focus", _self.inputboxFocusEvent, obj);
                        util.addEvent(obj, "blur", _self.inputboxBlurEvent, obj)
                    }
                }
            };
            _self.formatCredit = function(credit, def, currency) {
                var num = Math.floor(credit * 1 / def * 1 * 1E3 + 1E-5) / 1E3;
                return num
            };
            _self.chgReload = function(changeEvent) {
                if (changeEvent) _self.set_UL_value(changeEvent);
                var idx = _mc["sel_upper"].selectedIndex;
                if (idx == -1) {
                    idx = 0;
                    _mc["sel_upper"].selectedIndex = idx
                }
                var l_value = _mc["sel_ltype"].value;
                var ary_ltype = config_set.get("LTYPE_ARY");
                var l_name = ary_ltype[l_value].toLowerCase();
                for (var objid in ltpObj) ltpObj[objid].innerHTML = ary_ltype[l_value];
                _mc["upper_user"].innerHTML = l_name + _mc["sel_upper"].options[idx].text.substring(0, 3);
                _self.loadUpperConf()
            };
            _self.count_so = function(keyEvent) {
                _self.show_credits(keyEvent);
                var now_val = keyEvent.target.value.replace(/[^\d]*/g, "");
                var so_v = now_val * 1 / 2;
                confObj[keyEvent.target.chgK].value = util.mprintf(so_v, 0, 0, false, false)
            };
            _self.getConfParam = function() {
                var par = "";
                par += "login_layer=" + top.login_layer;
                par += "&uid=" + top.uid;
                par += "&up_layer=ag";
                par += "&up_id=" + _mc["sel_upper"].value;
                par += "&pay_type=" + up_userData[_mc["sel_upper"].value]["pay_type"];
                par += "&langx=" + top.langx;
                return par
            };
            _self.initOption = function(targetObj, _max, _set, range) {
                if (targetObj == null) return;
                targetObj.options.length = 0;
                var _set_num = -1;
                var i = 0;
                for (var j = 0; j <= _max; j += range) {
                    if (j == _set) _set_num = i;
                    var varItem = new Option(j, j, false, false);
                    targetObj.options.add(varItem);
                    i++
                }
                if (_set_num == -1) _set_num = i - 1;
                targetObj.selectedIndex = _set_num;
                _self.doSelToUL(targetObj, targetObj.id + "_LB");
                util.addEvent(targetObj, "change", _self.set_UL_value)
            };
            _self.saveEvent = function(mouseEvent) {
                parentClass.dispatchEvent("showAlertMsg", {
                    "_id": "modal_popup_createm"
                });
                var ret = _self.submitCheck();
                if (ret) {
                    var getHttp = new HttpRequest;
                    getHttp.addEventListener("LoadComplete",
                        function(data) {
                            setTimeout(function(data) {
                                    _self.saveFinish(data)
                                },
                                500, data)
                        });
                    var param = _self.getSaveParam();
                    param = "p=body_mem_add&ver=" + top.ver + "&" + param;
                    getHttp.loadURL(top.url, "POST", param)
                } else parentClass.dispatchEvent("hideAlertMsg", {})
            };
            _self.saveFinish = function(data, targetObj) {
                var arr_data = JSON.parse(data);
                var _status = arr_data.status;
                if (_status == "error") {
                    var error_code = util.showTxt(arr_data.code);
                    var error_msg = util.showTxt(arr_data.msg);
                    if (error_msg != null && error_msg != "") _self.show_Error(error_code, error_msg, arr_data);
                    else util.chkErrorMsg(arr_data, LS_code)
                } else {
                    user_information = arr_data.user_information;
                    _mc["show_alias"].innerHTML = user_information.alias;
                    _mc["show_user"].innerHTML = user_information.username;
                    _mc["div_all"].className = "acc_sum";
                    _self.show_info(null, {
                        "show": "finish",
                        "set_step": 0,
                        "go_top": true
                    });
                    parentClass.dispatchEvent("show_modal_step", {
                        "show_step": false
                    });
                    parentClass.dispatchEvent("chgPageName", {
                        "pageType": "account",
                        "pageName": "mem_add",
                        "uniqText": _mc["show_user"].innerHTML
                    });
                    parentClass.dispatchEvent("CloseConfirmExit")
                }
                parentClass.dispatchEvent("hideAlertMsg", {})
            };
            _self.copyInput = function(e, do_url) {
                var showDiv = _mc["mem_copyArea"];
                var tmp_copy = "";
                if (do_url == "user") {
                    var mem_url_ary = mem_url.split("://");
                    var tmp_mem_url = "";
                    if (mem_url_ary[1] != "undefined") tmp_mem_url = mem_url_ary[1].replace(/\//g, "");
                    tmp_copy = tmp_mem_url + "<br>";
                    tmp_copy += user_information.username
                } else if (do_url == "QR") tmp_copy = mem_url_QR;
                showDiv.innerHTML = tmp_copy;
                var range = dom.createRange();
                range.selectNode(showDiv);
                getSelection().removeAllRanges();
                getSelection().addRange(range);
                try {
                    var successful = dom.execCommand("copy");
                    var msg = successful ? "successful": "fail"
                } catch(e) {}
                util.echo("copy :" + msg);
                if (msg == "successful") parentClass.dispatchEvent("showFadeOutMesg", {
                    "text": LS.get("str_copied")
                });
                else util.echo("copy_fail")
            };
            _self.getSaveParam = function() {
                var par = "";
                par += "login_layer=" + top.login_layer;
                par += "&uid=" + top.uid;
                par += "&keys=add";
                par += "&ratio=";
                par += "&odd_f_str=H,M,I,E";
                par += "&username=" + _mc["upper_user"].innerHTML + _mc["input_user"].value;
                par += "&sname=" + _mc["input_user"].value;
                par += "&alias=" + _mc["input_alias"].value;
                par += "&passwords=" + _mc["input_passwd"].value;
                par += "&maxcredit=" + _mc["input_credit"].value.replace(/\D/g, "");
                par += "&type=" + _mc["sel_ltype"].value;
                par += "&currency=" + _mc["sel_currency"].value;
                par += "&up_layer=ag";
                par += "&up_id=" + _mc["sel_upper"].value;
                par += "&pay_type=" + up_userData[_mc["sel_upper"].value]["pay_type"];
                par += "&langx=" + top.langx;
                par += _self.getConfAryUrl();
                return par
            };
            _self.getConfAryUrl = function() {
                var par = "";
                for (var objid in confObj) {
                    var obj = confObj[objid];
                    if (obj.limit == null) {
                        var _name = objid.replace("_0_", "_" + _mc["sel_ltype"].value + "_");
                        par += "&" + _name;
                        if (obj.ftype == "SC" || obj.ftype == "SO") par += "=" + obj.value.replace(/\D/g, "");
                        else par += "=" + obj.value
                    }
                }
                return par
            };
            _self.setBoxClass = function(targetObj, style, _doSome) {
                if (targetObj == null) return;
                if (targetObj.initclass == null) targetObj.initclass = targetObj.className;
                else targetObj.className = targetObj.initclass;
                if (_doSome == "add" && !targetObj.classList.contains(style)) targetObj.classList.add(style)
            };
            _self.checkUserNameEvent = function(e, targetObj) {
                if (e.type == "blur" && _mc["btn_create_name"].BlurUserOFF) {
                    _mc["btn_create_name"].BlurUserOFF = false;
                    return
                }
                if (targetObj.value != "") {
                    if (!util.checkFormat(targetObj.value, 0)) {
                        _self.showErrorCtl("user", LS.get("username_err"));
                        return false
                    }
                    var getHttp = new HttpRequest;
                    var param = _self.getCheckParam(targetObj.value);
                    param += "&upper_layer=ag";
                    param += "&upper_id=" + _mc["sel_upper"].value;
                    getHttp.addEventListener("LoadComplete", _self.loadCheckFinish);
                    param = "p=chk_username&ver=" + top.ver + "&" + param;
                    getHttp.loadURL(top.url, "POST", param)
                } else {
                    ctlObj["user"].msg.innerHTML = LS.get("empty_user");
                    _self.setBoxClass(ctlObj["user"].box, "--err", "add")
                }
            };
            _self.checkNameEvent = function(e, targetObj) {
                if (targetObj.value == "") {
                    ctlObj["alias"].msg.innerHTML = LS.get("empty_alias");
                    _self.setBoxClass(ctlObj["alias"].box, "--err", "add")
                }
            };
            _self.loadCheckFinish = function(data) {
                var arr_data = JSON.parse(data);
                var _status = arr_data.status;
                var code = util.showTxt(arr_data.code);
                var msg = util.showTxt(arr_data.msg);
                if (_status == "error") if (msg != null && msg != "") {
                    ctlObj[code].input.value = "";
                    _self.showErrorCtl(code, msg)
                } else util.chkErrorMsg(arr_data, LS_code);
                else if (_status == "no_use") {
                    ctlObj[code].msg.innerHTML = msg;
                    _self.setBoxClass(ctlObj[code].box, "", "")
                }
            };
            _self.getCheckParam = function(username) {
                var par = "";
                par += "login_layer=" + top.login_layer;
                par += "&uid=" + top.uid;
                par += "&view_layer=mem";
                par += "&username=" + _mc["upper_user"].innerHTML + username;
                par += "&langx=" + top.langx;
                return par
            };
            _self.ChkCreditErr = function(e) {
                if (e.target == ctlObj["credit"].input) _self.showErrorCtl("credit", LS.get("str_maxcre"));
                else _self.showError(e.target.id, LS.get("str_maxcre"))
            };
            _self.showError = function(tarObj_id, msg) {
                var tmpAry = tarObj_id.split("_");
                var _grType = tmpAry[0] + "_" + tmpAry[1];
                var err_id = "msgCMS_" + _grType;
                _mc[tarObj_id].parentElement.classList.add("--err");
                _mc[err_id].innerHTML = msg;
                _mc[err_id].style.display = ""
            };
            _self.keep_credit = function(e) {
                credit_old = e.target.value.replace(/\D/g, "")
            };
            _self.show_credits = function(e) {
                var do_target = new Object;
                var ctl_tmp = e.target.id.replace("input_", "");
                if (ctlObj[ctl_tmp]) do_target = ctlObj[ctl_tmp];
                else for (var key in confObj) if (confObj[key] == e.target) {
                    do_target = confObj[key];
                    break
                }
                _self.inputboxFocusEvent(e, do_target);
                if (e.type == "input") util.Replace_Input_credits(e.target, credit_old, e);
                else util.Replace_credits(e.target, credit_old, e);
                if (e.target == _mc["input_credit"]) _self.TransRMB();
                if (e.target == _mc["input_credit"]) {
                    var credit = _mc["input_credit"].value.replace(/\D/g, "");
                    _mc["balance"].innerHTML = util.mprintf(balance - credit, 0, 2, false, true)
                }
            };
            _self.TransRMB = function() {
                var credit = _mc["input_credit"].value.replace(/\D/g, "");
                credit = credit * 1;
                if (_mc["currency_def"].innerHTML * 1 == 1) {
                    _mc["input_credit_RMB"].parentElement.parentElement.style.display = "none";
                    _mc["div_rate"].style.display = "none"
                } else {
                    var trans = _mc["currency_def"].innerHTML * credit;
                    _mc["input_credit_RMB"].value = util.mprintf(trans, 0, 2, false, true);
                    _mc["input_credit_RMB"].parentElement.parentElement.style.display = "";
                    _mc["div_rate"].style.display = ""
                }
            };
            _self.showErrorCtl = function(code, msg) {
                if (code == "system") code = "user";
                if (code) _self.clearErrorStatusCtl(null, ctlObj[code]);
                else _self.clearErrorStatusCtl();
                var _obj = ctlObj[code];
                var error_class = "--err";
                if (_obj != null) {
                    _obj.msg.innerHTML = msg;
                    _self.setBoxClass(_obj.box, error_class, "add");
                    _self.show_info(null, {
                        "show": "account",
                        "set_step": 1
                    })
                }
            };
            _self.inputboxFocusEvent = function(e, target) {
                _self.clearErrorStatusCtl(null, target);
                _self.clearErrorStatusConf(null, target);
                _self.setBoxClass(target.box, "--on", "add")
            };
            _self.inputboxBlurEvent = function(e, target) {
                if (!target.box.classList.contains("--err")) _self.setBoxClass(target.box, "--on", "")
            };
            _self.clearErrorStatusCtl = function(e, target) {
                if (target != null) {
                    _self.setBoxClass(target.box, "--err", "");
                    target.msg.innerHTML = ""
                } else for (var key in ctlObj) {
                    _self.setBoxClass(ctlObj[key].box, "--err", "");
                    ctlObj[key].msg.innerHTML = ""
                }
            };
            _self.showErrorPwd = function(code, msg) {
                var obj = ctlObj[code];
                if (obj != null) {
                    _self.setBoxClass(ctlObj["passwd"].box, "--err", "add");
                    if (msg == "4X021_mem") {
                        _self.setBoxClass(_mc["passwd_rule"], "word_midRed", "add");
                        ctlObj[code].msg.innerHTML = ""
                    } else {
                        _self.setBoxClass(_mc["passwd_rule"], "word_midRed", "");
                        ctlObj[code].msg.innerHTML = msg
                    }
                    _self.show_info(null, {
                        "show": "account",
                        "set_step": 1
                    })
                }
            };
            _self.clearErrorStatusConf = function(e, target) {
                if (target != null) {
                    if (target.ftype == "SC") {
                        var tmp_obj = confObj[target.gtype + "_" + target.rtype + "_" + target.ltype + "_SO"];
                        _self.setBoxClass(tmp_obj.box, "", "")
                    } else if (target.ftype == "SO") {
                        var tmp_obj = confObj[target.gtype + "_" + target.rtype + "_" + target.ltype + "_SC"];
                        _self.setBoxClass(tmp_obj.box, "", "")
                    }
                    _self.setBoxClass(target.box, "", "");
                    if (target.msg) target.msg.innerHTML = ""
                } else for (var key in confObj) {
                    _self.setBoxClass(confObj[key].box, "", "");
                    if (confObj[key].msg) confObj[key].msg.innerHTML = ""
                }
            };
            _self.show_Error = function(code, msg, arr_data) {
                var tmp = code.split("|");
                if (tmp[0] == "errormsg") _self.showErrorMsg(tmp[1], msg);
                else if (tmp[0] == "ctl") {
                    _self.showErrorCtl(tmp[1], msg);
                    _self.goTarget_scrollTop(ctlObj[tmp[1]].box)
                } else if (tmp[0] == "conf") _self.showErrorConf(tmp[1], msg);
                else if (msg != null && msg != "") parentClass.dispatchEvent("showAlertMsg", arr_data);
                else util.chkErrorMsg(arr_data, LS_code)
            };
            _self.showErrorMsg = function(code, msg) {
                if (code == "clean_db") {
                    var obj = new Object;
                    obj.msg = msg;
                    obj.backPage = "account";
                    parentClass.dispatchEvent("showAlertMsg", obj)
                } else if (code == "err_cash_sw") {
                    var obj = new Object;
                    obj.msg = msg;
                    obj.backPage = "account";
                    parentClass.dispatchEvent("showAlertMsg", obj)
                }
            };
            _self.showErrorConf = function(code, msg) {
                var obj = confObj[code.replace(/\d/g, "0")];
                if (obj != null) if (obj.ftype != null && obj.limit == null) {
                    _self.initShow();
                    obj.msg.innerHTML = msg;
                    _self.setBoxClass(obj.box, "--err", "add");
                    commiss_gtype = obj.gtype;
                    _self.show_info(null, {
                        "show": "commission",
                        "set_step": 2
                    });
                    _self.ShowAndHidden(null, _mc[commiss_gtype + "_commis_title"])
                }
            };
            _self.submitCheck = function() {
                _self.initShow();
                if (_mc["sel_upper"].value == "") return false;
                for (var key in ctlObj) if (ctlObj[key].input.value == "") {
                    _self.showErrorCtl(key, LS.get("empty_" + key));
                    _self.goTarget_scrollTop(ctlObj[key].box);
                    return false
                }
                if (!util.checkFormat(ctlObj["user"].input.value, 0)) {
                    _self.showErrorCtl("user", LS.get("username_err"));
                    _self.goTarget_scrollTop(ctlObj["user"].box);
                    return false
                }
                if (!util.checkFormat(ctlObj["alias"].input.value, 3)) {
                    _self.showErrorCtl("alias", LS.get("alias_no_SPChar"));
                    _self.goTarget_scrollTop(ctlObj["alias"].box);
                    return false
                }
                if (!util.checkFormat(ctlObj["passwd"].input.value, 0)) {
                    _self.showErrorCtl("passwd", LS.get("empty_passwd"));
                    _self.goTarget_scrollTop(ctlObj["passwd"].box);
                    return false
                }
                if (!_self.str_chk(ctlObj["passwd"].input.value)) {
                    _self.goTarget_scrollTop(ctlObj["passwd"].box);
                    return false
                }
                if (ctlObj["credit"].input.value.replace(/\D/g, "") * 1 == 0) {
                    if (top.langx != "en-us") _self.showErrorCtl("credit", LS.get("str_maxcre_zero1") + "," + LS.get("str_maxcre_zero") + ".");
                    else _self.showErrorCtl("credit", LS.get("str_maxcre_zero") + LS.get("str_maxcre_zero1"));
                    _self.goTarget_scrollTop(ctlObj["credit"].box);
                    return false
                }
                var currObj = _mc["currency"][_mc["sel_currency"].value];
                var def = currObj.def;
                var balance_tmp = _self.formatCredit(_mc["balance"].org_value * 1, def, _mc["sel_currency"].value);
                if (ctlObj["credit"].input.value.replace(/\D/g, "") * 1 > balance_tmp * 1) {
                    _self.showErrorCtl("credit", LS.get("credit_over"));
                    _self.goTarget_scrollTop(ctlObj["credit"].box);
                    return false
                }
                for (var objid in confObj) if (confObj[objid].value == "") {
                    _self.showErrorConf(objid, LS.get("empty_user"));
                    _self.goTarget_scrollTop(confObj[objid].box);
                    return false
                }
                return true
            };
            _self.goTarget_scrollTop = function(target) {
                if (target) {
                    var window_height = dom.getElementById("ma_content").clientHeight;
                    dom.getElementById("ma_content").scrollTop = target.offsetTop - window_height / 2 * 2 / 3
                }
            };
            _self.initUpperLayer = function() {
                _mc["sel_upper"].options.length = 0;
                if (top.login_layer == "co" || top.login_layer == "su") {
                    var upObj = paramObj.up_data;
                    if (upObj != null) {
                        var upAccount = new Array;
                        var count = 0;
                        for (var i = 0; i < upObj.length; i++) {
                            var _id = upObj[i].id;
                            var _name = upObj[i].username;
                            var _alias = upObj[i].alias;
                            var _enable = upObj[i].enable;
                            if (_enable != "Y") continue;
                            upAccount[count] = new Object;
                            upAccount[count].acc_id = _id;
                            upAccount[count].username = _name;
                            upAccount[count].alias = _alias;
                            var varItem = new Option(_name, _id, false, false);
                            _mc["sel_upper"].options.add(varItem);
                            count++
                        }
                        if (count <= 0) {
                            var obj = new Object;
                            obj.page = "acc_mem_list";
                            obj.LeaveChkPass = true;
                            parentClass.dispatchEvent("bodyGoToPage", obj);
                            return
                        }
                    } else {
                        var varItem = new Option(paramObj.up_user, paramObj.up_id, false, false);
                        _mc["sel_upper"].options.add(varItem)
                    }
                    _mc["sel_upper"].value = paramObj.up_id
                } else if (top.login_layer == "ag") {
                    var varItem = new Option(top.layer_username, top.layer_id, false, false);
                    _mc["sel_upper"].options.add(varItem)
                }
                _self.doSelToUL(_mc["sel_upper"], "sel_upper_LB");
                _self.chgReload()
            };
            _self.initLtype = function() {
                var ary_ltype = config_set.get("LTYPE_ARY");
                var def_ltype = config_set.get("DEF_LTYPE");
                _mc["sel_ltype"].options.length = 0;
                for (var key in ary_ltype) {
                    var varItem = new Option(ary_ltype[key], key, false, false);
                    _mc["sel_ltype"].options.add(varItem)
                }
                _mc["sel_ltype"].value = def_ltype;
                _self.doSelToUL(_mc["sel_ltype"], "sel_ltype_LB");
                _self.initUpperLayer()
            };
            _self.initCurrency = function() {
                var old_Currency = _mc["sel_currency"].value || "";
                _mc["sel_currency"].options.length = 0;
                for (key in _mc["currency"]) {
                    var code = _mc["currency"][key].code;
                    var _name = _mc["currency"][key].name;
                    var varItem = new Option(_name, code, false, false);
                    _mc["sel_currency"].options.add(varItem)
                }
                if (old_Currency != "") _mc["sel_currency"].value = old_Currency;
                _self.doSelToUL(_mc["sel_currency"], "sel_currency_LB");
                _mc["currency_name"].innerHTML = _mc["sel_currency"].options[_mc["sel_currency"].selectedIndex].value;
                _self.chgCurrencyEvent(null, _mc["sel_currency"].options[_mc["sel_currency"].selectedIndex]);
                MainCurrency = _mc["sel_currency"].options[_mc["sel_currency"].selectedIndex].innerHTML
            };
            _self.chgCurrencyEvent = function(changeEvent, targetObj) {
                if (changeEvent) _self.set_UL_value(changeEvent);
                var currObj = _mc["currency"][targetObj.value];
                var def = limit_def = util.showTxt(currObj.def);
                var code_name = util.showTxt(currObj.name);
                _mc["currency_def"].innerHTML = def;
                _mc["currency_name"].innerHTML = _mc["currency"][targetObj.value]["name"];
                MainCurrency = currObj.name;
                _self.TransRMB();
                var balance_tmp = _self.formatCredit(_mc["balance"].org_value * 1, def, _mc["sel_currency"].value);
                _mc["balance"].innerHTML = util.mprintf(balance_tmp, 0, 2, false, true);
                balance = balance_tmp * 1;
                var credit = _mc["input_credit"].value.replace(/\D/g, "");
                _mc["balance"].innerHTML = util.mprintf(balance - credit, 0, 2, false, true);
                if (do_set_template) {
                    if (templateData[now_template]["default_curr_sw"] == "Y") def = "1";
                    for (key in confObj) {
                        var obj = confObj[key];
                        var total = obj.ftype == "SC" ? obj.sc: obj.so;
                        var tmp = _self.formatCredit(total * 1, def, _mc["sel_currency"].value);
                        var limit_total = obj.ftype == "SC" ? obj.up_sc: obj.up_so;
                        var limit_tmp = _self.formatCredit(limit_total * 1, limit_def, _mc["sel_currency"].value);
                        if (tmp > limit_tmp) tmp = limit_tmp;
                        if (obj.limit != null) {
                            obj.innerHTML = LS.get("max_limit_head") + MainCurrency + " " + util.mprintf(limit_tmp * 1, 0, 0, false, true);
                            obj.setV = limit_tmp
                        } else if (obj.ftype != "WAR") obj.value = util.mprintf(tmp * 1, 0, 0, false, false)
                    }
                } else for (key in confObj) {
                    var obj = confObj[key];
                    var total = obj.ftype == "SC" ? obj.sc: obj.so;
                    var tmp = _self.formatCredit(total * 1, def, _mc["sel_currency"].value);
                    var limit_total = obj.ftype == "SC" ? obj.up_sc: obj.up_so;
                    var limit_tmp = _self.formatCredit(limit_total * 1, limit_def, _mc["sel_currency"].value);
                    if (now_template == "") tmp = limit_tmp;
                    else {
                        var use_curr = templateData[now_template].default_curr_sw == "N" || templateData[now_template].currency == "" ? "RMB": templateData[now_template].currency;
                        if (templateData[now_template].default_comm_sw != "Y" || targetObj.value != use_curr) {
                            tmp = _self.formatCredit(total * 1 * _mc["currency"][use_curr]["def"], def, _mc["sel_currency"].value);
                            if (tmp > limit_tmp) tmp = limit_tmp
                        } else {
                            tmp = _self.formatCredit(total * 1, 1, _mc["sel_currency"].value);
                            if (tmp > limit_tmp) tmp = limit_tmp
                        }
                    }
                    if (obj.limit != null) {
                        obj.innerHTML = LS.get("max_limit_head") + MainCurrency + " " + util.mprintf(limit_tmp * 1, 0, 0, false, true);
                        obj.setV = tmp
                    } else if (obj.ftype != "WAR") obj.value = util.mprintf(tmp * 1, 0, 0, false, false)
                }
            };
            _self.initShow = function(e) {
                var target = new Object;
                if (e) {
                    var ctl_tmp = e.target.id.replace("input_", "");
                    if (ctlObj[ctl_tmp]) target = ctlObj[ctl_tmp];
                    else for (var key in confObj) if (confObj[key] == e.target) {
                        target = confObj[key];
                        break
                    }
                    if (target.length > 0) {
                        _self.clearErrorStatusCtl(e, target);
                        _self.setBoxClass(target.box, "--on", "add")
                    }
                    _self.clearErrorStatusConf(e, target);
                    if (confObj[e.target.id] != null) {
                        target = confObj[e.target.id];
                        _self.setBoxClass(target.box, "--on", "add")
                    }
                }
            };
            _self.checkThisPassword = function(keyEvent, targetObj) {
                if (keyEvent.type == "blur" && _mc["eye_pwd"].BlurPwdOFF) {
                    _mc["eye_pwd"].BlurPwdOFF = false;
                    return
                }
                if (keyEvent.type == "blur" && ctlObj["passwd"].input.value == "") {
                    _self.showErrorCtl("passwd", LS.get("empty_passwd"));
                    return
                }
                _mc["strengthTxt"].style.display = "";
                var password = _mc["input_passwd"].value;
                var checked = zxcvbn(password);
                var timetocrack = checked.crack_time;
                var strength = checked.score;
                var timeinwords = _self.toWords(timetocrack);
                _mc["first_estimate"].innerHTML = timeinwords;
                if (password == "") {
                    _mc["strengthTxt"].style.display = "none";
                    strength = 5;
                    _mc["div_show_strong"].classList.add("hide_item")
                } else if (_mc["div_show_strong"].classList.contains("hide_item")) _mc["div_show_strong"].classList.remove("hide_item");
                _self.displayStrength(strength);
                _self.str_chk(ctlObj["passwd"].input.value)
            };
            _self.displayStrength = function(c) {
                var arr_use_word = Array("pwd_Very Weak", "pwd_Weak", "pwd_Fair", "pwd_Good", "pwd_Strong", "");
                var use_word = typeof arr_use_word[c] != "undefined" ? arr_use_word[c] : "pwd_Very Weak";
                f = use_word != "" ? LS.get(use_word) : "";
                for (var i = 0; i <= 5; i++) if (_mc["div_show_strong"].classList.contains("lv" + i)) _mc["div_show_strong"].classList.remove("lv" + i);
                var show_lv = c + 1;
                if (show_lv <= 5) _mc["div_show_strong"].classList.add("lv" + show_lv);
                _mc["complexity"].innerHTML = f
            };
            _self.toWords = function(number) {
                if (number < 120) return _self.getNumberWords(number, true) + " " + LS.get("pwd_break_Seconds");
                var hour = 60 * 60;
                if (number < hour) {
                    minutes = number / 60;
                    return _self.getNumberWords(minutes, true) + " " + LS.get("pwd_break_Minutes")
                }
                var day = hour * 24;
                if (number < 2 * day) {
                    hours = number / hour;
                    return _self.getNumberWords(hours) + " " + LS.get("pwd_break_Hours")
                }
                var month = day * 30;
                if (number < month) {
                    days = number / day;
                    return _self.getNumberWords(days) + " " + LS.get("pwd_break_Days")
                }
                var year = day * 365;
                if (number < year) {
                    months = number / month;
                    return _self.getNumberWords(months) + " " + LS.get("pwd_break_Months")
                }
                var century = year * 100;
                if (number < century * 10) {
                    years = number / year;
                    return _self.getNumberWords(years) + " " + LS.get("pwd_break_Years")
                }
                if (number < century * 100) {
                    centuries = number / century;
                    return _self.getNumberWords(centuries) + " " + LS.get("pwd_break_Centuries")
                }
                years = number / year;
                return _self.getNumberWords(years) + " " + LS.get("pwd_break_Years")
            };
            _self.getNumberWords = function(number, twoDP) {
                var numberWords = "";
                var trillion = Math.pow(10, 12);
                var billion = Math.pow(10, 9);
                var hundred_million = Math.pow(10, 8);
                var million = Math.pow(10, 6);
                var ten_thousand = Math.pow(10, 4);
                var thousand = Math.pow(10, 3);
                var hundred = Math.pow(10, 2);
                if (top.langx == "en-us") if (number / trillion >= 1) {
                    numberWords = "TRILLION";
                    number = number / trillion
                } else if (number / billion >= 1) {
                    numberWords = "BILLION";
                    number = number / billion
                } else if (number / million >= 1) {
                    numberWords = "MILLION";
                    number = number / million
                } else if (number / thousand >= 1) {
                    numberWords = "THOUSAND";
                    number = number / thousand
                } else {
                    if (number / hundred >= 1) {
                        numberWords = "HUNDRED";
                        number = number / hundred
                    }
                } else if (top.langx == "zh-tw" || top.langx == "zh-cn") if (number / trillion >= 1) {
                    numberWords = LS.get("pwd_TRILLION");
                    number = number / trillion
                } else if (number / hundred_million >= 1) {
                    numberWords = LS.get("pwd_100_MILLION");
                    number = number / hundred_million
                } else if (number / ten_thousand >= 1) {
                    numberWords = LS.get("pwd_10_THOUSAND");
                    number = number / ten_thousand
                } else if (number / thousand >= 1) {
                    numberWords = LS.get("pwd_THOUSAND");
                    number = number / thousand
                } else if (number / hundred >= 1) {
                    numberWords = LS.get("pwd_HUNDRED");
                    number = number / hundred
                }
                if (twoDP) decimalPoint = 100;
                else decimalPoint = 1;
                number = Math.round(number * decimalPoint) / decimalPoint;
                numberWords = number + numberWords;
                return numberWords
            };
            _self.str_chk = function(str) {
                if (str != "" && str == _mc["upper_user"].innerHTML + ctlObj["user"].input.value) {
                    _self.showErrorPwd("passwd", LS_code.get("4X022"));
                    return false
                }
                var res = util.str_chk_mem(str, 1);
                if (res != "chk_OK") {
                    _self.strchk_Msg(res);
                    return false
                } else {
                    _self.setBoxClass(ctlObj["passwd"].box, "--on", "add");
                    _self.setBoxClass(_mc["passwd_rule"], "word_midRed", "");
                    ctlObj["passwd"].msg.innerHTML = "";
                    return true
                }
            };
            _self.strchk_Msg = function(str) {
                if (str == "err_combination") _self.showErrorPwd("passwd", "4X021_mem");
                else if (str == "err_length") _self.showErrorPwd("passwd", "4X021_mem");
                else if (str == "err_contain") _self.showErrorPwd("passwd", "4X021_mem");
                else if (str == "err_charactersNum") _self.showErrorPwd("passwd", LS_code.get("4X040"));
                else if (str == "err_block_string") _self.showErrorPwd("passwd", LS_code.get("4X040"));
                else {
                    util.echo("chk wrong!!");
                    _self.showErrorPwd("passwd", "4X021_mem")
                }
            };
            _self.showPwd = function(mouseEvent, targetObj) {
                if (!targetObj.isShow) {
                    ctlObj["passwd"].input.setAttribute("type", "text");
                    targetObj.className = "icon_pw_visible";
                    targetObj.isShow = true
                } else {
                    ctlObj["passwd"].input.setAttribute("type", "password");
                    targetObj.className = "icon_pw_hidden";
                    targetObj.isShow = false
                }
                if (mouseEvent != null) _mc["input_passwd"].focus()
            };
            _self.BlurPwdOFF = function(mouseEvent, targetObj) {
                _mc["eye_pwd"].BlurPwdOFF = true
            };
            _self.showIconMsg = function(mouseEvent, par) {
                parentClass.dispatchEvent("showAlertMsg", par);
                dom.getElementById(par._id).children[0].focus()
            };
            _self.create_random_name = function(mouseEvent, param) {
                var create_name = "";
                var arr_base = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
                var total_base_num = arr_base.length;
                var create_num = param["create_num"];
                var doObj = param["doObj"];
                for (var i = 0; i < create_num; i++) create_name += arr_base[getRandom(total_base_num)];
                doObj.value = create_name;
                doObj.focus();
                _mc["btn_create_name"].BlurUserOFF = false
            };
            _self.BlurUserOFF = function(mouseEvent, targetObj) {
                _mc["btn_create_name"].BlurUserOFF = true
            };
            function getRandom(x) {
                return Math.floor(Math.random() * x)
            }
            _self.setParentclass = function(_parentclass) {
                parentClass = _parentclass;
                util = parentClass.getThis("util");
                LS = parentClass.getThis("LS");
                LS_code = parentClass.getThis("LS_code");
                LS_account = parentClass.getThis("LS_account");
                config_set = parentClass.getThis("config_set");
                topFrame = parentClass.getThis("topFrame")
            };
            _self.exitEvent = function() {
                parentClass.dispatchEvent("show_modal_step", {
                    "show_step": false
                });
                return true
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
                    elmt["sel_list"].appendChild(tmp_li)
                }
                var sel_js = new win.ClassSelect(win, dom);
                sel_js.setParentclass(_self);
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
                } else ElmObj.fireEvent("onchange")
            };
            _self.set_UL_value = function(e) {
                e.target.JS_UL.setSelected(e.target.value)
            };
            _self.show_sel_box = function(e, ElmObj) {
                if (!ElmObj.classList.contains("--on")) ElmObj.classList.add("--on")
            };
            _self.close_sel_box = function(e, ElmObj) {
                if (ElmObj.classList.contains("--on")) ElmObj.classList.remove("--on")
            };
            _self.getThis = function(varible) {
                return eval(varible)
            };
            _self.show_info = function(e, param) {
                var div_body_show = dom.getElementById("body_show");
                if (div_body_show.classList.contains("bgf0f0f0")) div_body_show.classList.remove("bgf0f0f0");
                var arr_step = Array("account", "commission", "finish");
                var front_show = true;
                for (var key in arr_step) {
                    var tmp_step_Obj = _mc["step_" + arr_step[key]];
                    var tmp_info_Obj = _mc[arr_step[key] + "_info"];
                    if (arr_step[key] == param.show) {
                        if (tmp_step_Obj.classList.contains("--ok")) tmp_step_Obj.classList.remove("--ok");
                        tmp_step_Obj.classList.add("--on");
                        front_show = false;
                        tmp_info_Obj.style.display = "";
                        if (param.show == "account" || param.show == "commission") div_body_show.classList.add("bgf0f0f0")
                    } else {
                        tmp_step_Obj.classList.remove("--on");
                        if (front_show) tmp_step_Obj.classList.add("--ok");
                        tmp_info_Obj.style.display = "none"
                    }
                }
                if (param.go_top) dom.getElementById("ma_content").scrollTop = 0;
                _self.set_modal_step_btn(param.set_step)
            };
            _self.set_modal_step_btn = function(show_now_step) {
                var obj = new Object;
                if (show_now_step == 1) {
                    obj["btn_left"] = new Object;
                    obj["btn_left"].show_msg = LS.get("step_cancel");
                    obj["btn_left"].class = {
                        "action": "add",
                        "classname": "--cancel"
                    };
                    obj["btn_left"].disabled = false;
                    obj["btn_left"].fun = _self.closeEvent;
                    obj["btn_left"].funvalue = "cancel";
                    obj["btn_right"] = new Object;
                    obj["btn_right"].show_msg = LS.get("step_next");
                    obj["btn_right"].disabled = false;
                    obj["btn_right"].fun = _self.show_info;
                    obj["btn_right"].funvalue = {
                        "show": "commission",
                        "set_step": 2,
                        "go_top": true
                    }
                } else if (show_now_step == 2) {
                    obj["btn_left"] = new Object;
                    obj["btn_left"].show_msg = LS.get("step_back");
                    obj["btn_left"].disabled = false;
                    obj["btn_left"].fun = _self.show_info;
                    obj["btn_left"].funvalue = {
                        "show": "account",
                        "set_step": 1,
                        "go_top": true
                    };
                    obj["btn_right"] = new Object;
                    obj["btn_right"].show_msg = LS.get("step_createm");
                    obj["btn_right"].disabled = false;
                    obj["btn_right"].fun = _self.saveEvent
                }
                parentClass.dispatchEvent("set_modal_step", obj)
            };
            _self.closeEvent = function(e) {
                var obj = new Object;
                if (paramObj.back_page == "acc_mem_list") {
                    paramObj.back_param = new Object;
                    paramObj.back_param.up_id = _mc["sel_upper"].value;
                    paramObj.back_param.up_username = up_userData[_mc["sel_upper"].value]["username"];
                    paramObj.back_param.pay_type = up_userData[_mc["sel_upper"].value]["pay_type"]
                }
                obj.postHash = paramObj.back_param;
                obj.page = paramObj.back_page;
                if (e == "save") obj.LeaveChkPass = true;
                parentClass.dispatchEvent("bodyGoToPage", obj)
            };
            _self.get_template_data = function() {
                var getHttp = new HttpRequest;
                var param = "";
                param += "login_layer=" + top.login_layer;
                param += "&uid=" + top.uid;
                param += "&langx=" + top.langx;
                getHttp.addEventListener("LoadComplete", _self.loadTemplateFinish);
                param = "p=get_template_data&ver=" + top.ver + "&" + param;
                getHttp.loadURL(top.url, "POST", param)
            };
            _self.loadTemplateFinish = function(data) {
                var arr_data = JSON.parse(data);
                if (util.chkErrorMsg(arr_data, LS_code)) return;
                templateObj = new Array;
                if (arr_data.template_sw) {
                    templateData = arr_data["template_value"];
                    
                    if (Object.keys(templateData).length > 0) {
                        _mc["template_illustrate"].style.display = "none";
                        _mc["div_template"].style.display = "";
                        var parentDiv = _mc["template_model"].parentNode;
                        for (var key in templateData) {
                            var _thisData = templateData[key];
                            var htmlModel = _mc["template_model"].cloneNode(true);
                            htmlModel.innerHTML = _thisData.templatename;
                            htmlModel.style.display = "";
                            htmlModel.setAttribute("id", "template_" + _thisData.id);
                            util.addEvent(htmlModel, "click", _self.set_template, _thisData.id);
                            parentDiv.insertBefore(htmlModel, parentDiv.children[0]);
                            templateObj["template_" + _thisData.id] = htmlModel
                        }
                    } else {
                        _mc["template_illustrate"].style.display = "";
                        _mc["div_template"].style.display = "none"
                    }
                } else {
                    _mc["template_illustrate"].style.display = "none";
                    _mc["div_template"].style.display = "none";
                    util.removeEvent(_mc["template_learnmore"], "click");
                    util.removeEvent(_mc["btn_create_template"], "click")
                }
                mem_url = arr_data.qr_url;
                if (arr_data.qr_sw == "Y") {
                    _mc["div_QRcode"].style.display = "";
                    _mc["createUrl_showQR"].innerHTML = arr_data.qr_url;
                    util.addEvent(_mc["btn_createQR"], "click", _self.get_QRcode)
                } else _mc["div_QRcode"].style.display = "none"
            };
            _self.set_template = function(e, targetId) {
                var target_data = templateData[targetId];
                _mc["msg_template"].innerHTML = "";
                if (now_template == "" || now_template != targetId) {
                    if (now_template != "") templateObj["template_" + now_template].classList.remove("--on");
                    now_template = targetId;
                    templateObj["template_" + now_template].classList.add("--on");
                    _mc["sel_ltype"].value = target_data.type;
                    _mc["sel_ltype"].JS_UL.setSelected(_mc["sel_ltype"].value);
                    if (target_data.default_curr_sw == "Y") {
                        _mc["sel_currency"].value = target_data.currency;
                        _mc["sel_currency"].JS_UL.setSelected(_mc["sel_currency"].value);
                        _mc["input_credit"].value = target_data.maxcredit
                    } else {
                        _mc["sel_currency"].value = "";
                        _mc["sel_currency"].JS_UL.setSelected(_mc["sel_currency"].value);
                        _mc["input_credit"].value = ""
                    }
                    if (target_data.default_comm_sw == "Y") do_set_template = true
                } else {
                    templateObj["template_" + now_template].classList.remove("--on");
                    _mc["sel_ltype"].value = config_set.get("DEF_LTYPE");
                    _mc["sel_ltype"].JS_UL.setSelected(_mc["sel_ltype"].value);
                    _mc["sel_currency"].value = "";
                    _mc["sel_currency"].JS_UL.setSelected(_mc["sel_currency"].value);
                    _mc["input_credit"].value = "";
                    now_template = ""
                }
                _self.chgReload()
            };
            _self.roll = function(e, param) {
                if (param.chk_obj.scrollLeft == 0) param.do_obj.classList.remove("--scroll");
                else {
                    param.do_obj.classList.add("--scroll");
                    if (param.chk_obj.scrollLeft + param.chk_obj.offsetWidth == param.chk_obj.scrollWidth) param.do_obj.classList.add("--right_no_scroll");
                    else param.do_obj.classList.remove("--right_no_scroll")
                }
            };
            _self.get_QRcode = function() {
                parentClass.dispatchEvent("showLoading", {
                    "showLoading": true
                });
                if (user_information.status == "success") _self.loadUpperQRcode(user_information)
            };
            _self.loadUpperQRcode = function(_user) {
                var getHttp = new HttpRequest;
                var param = "";
                param += "login_layer=" + top.login_layer;
                param += "&uid=" + top.uid;
                param += "&langx=" + top.langx;
                param += "&mid=" + _user.mid;
                param += "&pay_type=" + _user.pay_type;
                getHttp.addEventListener("LoadComplete", _self.loadQRcodeFinish);
                param = "p=get_qrcodeUrl&ver=" + top.ver + "&" + param;
                getHttp.loadURL(top.url, "POST", param)
            };
            _self.loadQRcodeFinish = function(data) {
                var arr_data = JSON.parse(data);
                if (util.chkErrorMsg(arr_data, LS_code)) return;
                var _status = arr_data.status;
                if (_status == "error") {
                    _mc["btn_copy_QR"].style.display = "none";
                    _mc["btn_createQR"].style.display = "none"
                } else {
                    mem_url = arr_data.qrcode_url;
                    if (_status == "success") {
                        _mc["div_createQR"].style.display = "none";
                        _mc["div_showQR"].style.display = "";
                        mem_url_QR = arr_data.qrcode_str;
                        _self.create_QRcode(arr_data.qrcode_str);
                        _mc["useUrl_showQR"].innerHTML = arr_data.qrcode_url;
                        _mc["btn_copy_QR"].style.display = "";
                        _mc["btn_createQR"].style.display = ""
                    } else {
                        _mc["btn_copy_QR"].style.display = "none";
                        _mc["btn_createQR"].style.display = "none"
                    }
                }
                dom.getElementById("ma_content").scrollTop = 0;
                parentClass.dispatchEvent("showLoading", {
                    "showLoading": false
                })
            };
            _self.create_QRcode = function(use_url) {
                var qrDiv = _mc["img_showQR"];
                var qrObj = new QRCode(qrDiv, {
                    "width": qrDiv.offsetWidth,
                    "height": qrDiv.offsetHeight
                });
                qrObj.makeCode(use_url)
            };
            _self.copyPic = async function(e, up_img_target) {
                let img = up_img_target.getElementsByTagName("img")[0];
                const src = img.src;
                const imageMimeType = "image/png";
                try {
                    await navigator.clipboard.write([new ClipboardItem({ [imageMimeType] : imageMimeType === "image/svg" ? _self.getTextBlobFromUrl(src) : _self.getImageBlobFromUrl(src)
                    })]);
                    parentClass.dispatchEvent("showFadeOutMesg", {
                        "text": LS.get("str_copied")
                    })
                } catch(err) {
                    util.showMsg(LS.get("str_copy_err"), "N", null)
                }
            };
            const isSafari =navigator.vendor.match(/apple/i) && !navigator.userAgent.match(/crios/i) && !navigator.userAgent.match(/fxios/i) && !navigator.userAgent.match(/Opera|OPT\//);
            _self.getImageMimeTypeFromUrl = function(url) {
                return`image / $ {
			url.match(/([a-z]+)$/)
		}`
            };
            _self.getTextBlobFromUrl = async   function(url) {
                const response = await fetch(url);
                const source = await response.text();
                return new Blob([source], {
                    type: "text/plain"
                })
            };

            _self.getImageBlobFromUrl = async  function(url) {
                const fetchedImageData = await fetch(url);
                const blob = await fetchedImageData.blob();
                return blob
            }

        };