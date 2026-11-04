function setting_system(_win, _dom){

    var _self = this;
    var win = _win;
    var dom = _dom;

    var parentClass;
    var util;
    var LS;
    var LS_code;
    var LS_account;
    var config_set;

    var _mc = new Object();
    var ctlObj = new Array();
    var confObj = new Array();
    var maintainObj = new Array();
    var titleObj = new Array();
    var dateHash = new Object();
    var eventHandler = new Object();
    var credit_old_min_m;
    var credit_old_min_r;
    var credit_old_min_re;
    var credit_old_min_dt;
    var credit_old_min_rdt;
    var credit_old_min_fs;
    var credit_old_max_m;
    var credit_old_max_r;
    var credit_old_max_re;
    var credit_old_max_dt;
    var credit_old_max_rdt;
    var credit_old_max_fs;
    var balance = 0;
    var keepScrollTop = 56;
    var overScrollTop = 56;

    _self.init=function() {
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        parentClass.dispatchEvent("chgPageName", {"pageType": "setting", "pageName": "setting"});
        parentClass.dispatchEvent("chgLeftMenuColor", {"target": "setting"});

        var obj_ids = ",setting_info,maintain_info,google_info,btn_save,btn_save1,btn_save2,";
        obj_ids += "box_top,box_bottom,input_maintain_no,box_maintain_time,";
        obj_ids += "msg_sports_credit,msg_max_credit,msg_maintain_time,";
        obj_ids += "input_maintain_time,input_maintain_time_end,input_maintain_yes,input_maintain_no,";
        obj_ids += "input_min_m,credit_min_m,";
        obj_ids += "input_min_r,credit_min_r,";
        obj_ids += "input_min_re,credit_min_re,";
        obj_ids += "input_min_dt,credit_min_dt,";
        obj_ids += "input_min_rdt,credit_min_rdt,";
        obj_ids += "input_min_fs,credit_min_fs,";

        obj_ids += "input_max_m,credit_max_m,";
        obj_ids += "input_max_r,credit_max_r,";
        obj_ids += "input_max_re,credit_max_re,";
        obj_ids += "input_max_dt,credit_max_dt,";
        obj_ids += "input_max_rdt,credit_max_rdt,";
        obj_ids += "input_max_fs,credit_max_fs,";
        _mc = util.getObjAry(dom, obj_ids);

        ctlObj["input_min_m"] = new Object();
        ctlObj["input_min_m"].box = _mc["box_top"];
        ctlObj["input_min_m"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_m"].input = _mc["input_min_m"];

        ctlObj["input_min_r"] = new Object();
        ctlObj["input_min_r"].box = _mc["box_top"];
        ctlObj["input_min_r"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_r"].input = _mc["input_min_r"];

        ctlObj["input_min_re"] = new Object();
        ctlObj["input_min_re"].box = _mc["box_top"];
        ctlObj["input_min_re"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_re"].input = _mc["input_min_re"];

        ctlObj["input_min_dt"] = new Object();
        ctlObj["input_min_dt"].box = _mc["box_top"];
        ctlObj["input_min_dt"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_dt"].input = _mc["input_min_dt"];

        ctlObj["input_min_rdt"] = new Object();
        ctlObj["input_min_rdt"].box = _mc["box_top"];
        ctlObj["input_min_rdt"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_rdt"].input = _mc["input_min_rdt"];

        ctlObj["input_min_fs"] = new Object();
        ctlObj["input_min_fs"].box = _mc["box_top"];
        ctlObj["input_min_fs"].msg = _mc["msg_sports_credit"];
        ctlObj["input_min_fs"].input = _mc["input_min_fs"];

        ctlObj["input_max_m"] = new Object();
        ctlObj["input_max_m"].box = _mc["box_top"];
        ctlObj["input_max_m"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_m"].input = _mc["input_max_m"];

        ctlObj["input_max_r"] = new Object();
        ctlObj["input_max_r"].box = _mc["box_top"];
        ctlObj["input_max_r"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_r"].input = _mc["input_max_r"];

        ctlObj["input_max_re"] = new Object();
        ctlObj["input_max_re"].box = _mc["box_top"];
        ctlObj["input_max_re"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_re"].input = _mc["input_max_re"];

        ctlObj["input_max_dt"] = new Object();
        ctlObj["input_max_dt"].box = _mc["box_top"];
        ctlObj["input_max_dt"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_dt"].input = _mc["input_max_dt"];

        ctlObj["input_max_rdt"] = new Object();
        ctlObj["input_max_rdt"].box = _mc["box_top"];
        ctlObj["input_max_rdt"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_rdt"].input = _mc["input_max_rdt"];

        ctlObj["input_max_fs"] = new Object();
        ctlObj["input_max_fs"].box = _mc["box_top"];
        ctlObj["input_max_fs"].msg = _mc["msg_sports_credit"];
        ctlObj["input_max_fs"].input = _mc["input_max_fs"];

        maintainObj["input_maintain_time"] = new Object();
        maintainObj["input_maintain_time"].box = _mc["box_maintain_time"];
        maintainObj["input_maintain_time"].msg = _mc["msg_maintain_time"];
        maintainObj["input_maintain_time"].input = _mc["input_maintain_time"];

        maintainObj["input_maintain_time_end"] = new Object();
        maintainObj["input_maintain_time_end"].box = _mc["box_maintain_time"];
        maintainObj["input_maintain_time_end"].msg = _mc["msg_maintain_time"];
        maintainObj["input_maintain_time_end"].input = _mc["input_maintain_time_end"];



        var obj_ids = ",setting_title_box,maintain_title_box,google_title_box,";
        var tmpObj = util.getObjAry(dom, obj_ids);
        _mc = util.mergeArray(_mc, tmpObj);
        for (var objid in tmpObj) {
            var ta = objid.split("_");
            tmpObj[objid].mapA = ta[0];
            tmpObj[objid].mapB = "_info";
            tmpObj[objid]._type = "TITLE";
            titleObj[objid] = tmpObj[objid];
            util.addEvent(tmpObj[objid], "click", _self.ShowAndHidden, tmpObj[objid]);
        }

        if(top.login_layer == "ad"){
            _mc["maintain_title_box"].remove();
        }
		
        util.addEvent(ctlObj["input_min_m"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_min_r"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_min_re"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_min_dt"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_min_rdt"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_min_fs"].input, "keydown", _self.keep_credits);

        util.addEvent(ctlObj["input_max_m"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_max_r"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_max_re"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_max_dt"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_max_rdt"].input, "keydown", _self.keep_credits);
        util.addEvent(ctlObj["input_max_fs"].input, "keydown", _self.keep_credits);

        util.ChkKeyCash(ctlObj["input_min_m"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_min_r"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_min_re"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_min_dt"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_min_rdt"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_min_fs"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });

        util.ChkKeyCash(ctlObj["input_max_m"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_max_r"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_max_re"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_max_dt"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_max_rdt"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });
        util.ChkKeyCash(ctlObj["input_max_fs"].input, { initShow: _self.initShow, onErr: _self.ChkCreditErr, onSuc: _self.show_credits });

        _self.loadUpperConf();
        util.addEvent(_mc["btn_save"], "click", _self.saveEvent, _mc["btn_save"]);
        util.addEvent(_mc["btn_save1"], "click", _self.saveEvent, _mc["btn_save1"]);
        util.addEvent(_mc["btn_save2"], "click", _self.saveEvent, _mc["btn_save2"]);
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
    }

    //============== save ==============
    _self.saveEvent = function (mouseEvent, targetObj) {
        var id = targetObj.id;
        var ret = _self.submitCheck(targetObj);
        if (ret) {
            var getHttp = new HttpRequest();
            getHttp.addEventListener("LoadComplete", function (data) {
                _self.saveFinish(data, targetObj);
            });
            var param = "p=get_setting_edit&ver=" + top.ver + "&";
            if(id == "btn_save") {
                var para= _self.getSaveParam();
                param += "type=setting&";
                param += para;
            } else if(id == "btn_save1"){ 
                var regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s(0\d|1[0-9]|2[0-3]):[0-5]\d:[0-5]\d~(0\d|1[0-9]|2[0-3]):[0-5]\d:[0-5]\d$/  
                if (!regex.test(_mc["input_maintain_time"].value)){
                    alert("维护时间[开始]:请输入正确的日期时间格式！！！");
                    return false;
                }else{ 
                    param += "login_layer=" + top.login_layer;
                    param += "&uid=" + top.uid;
                    param += "&langx=" + top.langx;
                    param += "&type=maintain&";
                    param += "webstr="+_mc["input_maintain_time"].value;
                    param += "&webend="+_mc["input_maintain_time_end"].value;
                    param += "&google_code="+document.getElementById("google_code").value;
					
                    var radio=document.getElementsByName("input_maintain");
                    for(var i=0;i<radio.length;i++) {
                        if (radio[i].checked == true) {
                            param += "&website=" + radio[i].value;
                            break;
                        }
                    }
					
                   var radio1=document.getElementsByName("isgoogle");
                    for(var i=0;i<radio1.length;i++) {
                        if (radio1[i].checked == true) {
                            param += "&isgoogle=" + radio1[i].value;
                            break;
                        }
                    }
                }
                

            } else { 
                
                param += "login_layer=" + top.login_layer;
                param += "&uid=" + top.uid;
                param += "&langx=" + top.langx;
                param += "&type=saveUI";
                var msg = "将清除所有前端静态页面，你是否继续？";
                if (confirm(msg)==true) {
                    getHttp.loadURL(top.url, "POST", param);
                }
            }
            getHttp.loadURL(top.url, "POST", param);
        }
    }

    _self.saveFinish = function (data, targetObj) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        if (_status == "error") {
            var error_code = util.showTxt(arr_data.code);
            var error_msg = util.showTxt(arr_data.msg);
            if (error_msg != null && error_msg != "") {
                _self.show_Error(error_code, error_msg, arr_data);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
        } else {
            //2019-04-09 Ricky 150.新增帳號-成功創建新帳戶後，將會顯示7秒的短暫訊息“成功新增帳戶。現在大概只有2秒，且應有copy的字眼可以複製帳密，現在訊息account successfully created，應該是New Account Created
            //parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_account_success")});
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("page_edit_ok") ,"s":5});
            util.addEvent(dom.getElementById("btn_copy"), "click", _self.copyInput);

        }
    }

    _self.copyInput = function (){
        var range = dom.createRange();
        var showDiv = dom.getElementById("copyArea");
        //setVisible(showDiv, true);
        range.selectNode(showDiv);
        getSelection().removeAllRanges();
        getSelection().addRange(range);

        try {
            var successful = dom.execCommand("copy");
            var msg = successful ? "successful" : "fail";
        }catch(e){}

        //setVisible(showDiv, false);

        //alert("copy :" + msg);
        util.echo("copy :" + msg);

        //James 19/04/30 498.繁簡-新增帳號成功的訊息
        if(msg == "successful") parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("copy_success") });
        else util.echo("copy_fail");
    }

    _self.getSaveParam = function () {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&langx=" + top.langx;
        par += "&keys=add";
        par += "&min_m=" + _mc["input_min_m"].value.replace(/\,/g,'');
        par += "&min_r=" + _mc["input_min_r"].value.replace(/\,/g,'');
        par += "&min_re=" + _mc["input_min_re"].value.replace(/\,/g,'');
        par += "&min_rdt=" + _mc["input_min_rdt"].value.replace(/\,/g,'');
        par += "&min_dt=" + _mc["input_min_dt"].value.replace(/\,/g,'');
        par += "&min_fs=" + _mc["input_min_fs"].value.replace(/\,/g,'');

        par += "&max_m=" + _mc["input_max_m"].value.replace(/\,/g,'');
        par += "&max_r=" + _mc["input_max_r"].value.replace(/\,/g,'');
        par += "&max_re=" + _mc["input_max_re"].value.replace(/\,/g,'');
        par += "&max_dt=" + _mc["input_max_dt"].value.replace(/\,/g,'');
        par += "&max_rdt=" + _mc["input_max_rdt"].value.replace(/\,/g,'');
        par += "&max_fs=" + _mc["input_max_fs"].value.replace(/\,/g,'');
        return par;
    }

    //============== save ==============

    _self.submitCheck = function (targetObj) {
        _self.initShow();
        if(targetObj.id == "btn_save"){
            for (var key in ctlObj) {
                if (ctlObj[key].input.value == "") {
                    _self.showErrorCtl(key, LS.get("str_" + key.replace("input_","")));
                    return false;
                }
            }

            if(!util.checkFormat(ctlObj["input_min_m"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_min_m", LS.get("str_min_m"));
                return false;
            }

            if(!util.checkFormat(ctlObj["input_min_r"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_min_r", LS.get("str_min_r"));
                return false;
            }

            if(!util.checkFormat(ctlObj["input_min_re"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_min_re", LS.get("str_min_re"));
                return false;
            }

            if(!util.checkFormat(ctlObj["input_min_dt"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_min_dt", LS.get("str_min_dt"));
                return false;
            }

            if(!util.checkFormat(ctlObj["input_min_rdt"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_min_rdt", LS.get("str_min_rdt"));
                return false;
            }

            if(!util.checkFormat(ctlObj["input_min_fs"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_min_fs", LS.get("str_min_fs"));
                return false;
            }


            if(!util.checkFormat(ctlObj["input_max_m"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_max_m", LS.get("str_max_m"));
                return false;
            }

            if(!util.checkFormat(ctlObj["input_max_r"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_max_r", LS.get("str_max_r"));
                return false;
            }

            if(!util.checkFormat(ctlObj["input_max_re"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_max_re", LS.get("str_max_re"));
                return false;
            }

            if(!util.checkFormat(ctlObj["input_max_dt"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_max_dt", LS.get("str_max_dt"));
                return false;
            }

            if(!util.checkFormat(ctlObj["input_max_rdt"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_max_rdt", LS.get("str_max_rdt"));
                return false;
            }

            if(!util.checkFormat(ctlObj["input_max_fs"].input.value.replace(/\,/g,''),1)){
                _self.showErrorCtl("input_max_fs", LS.get("str_max_fs"));
                return false;
            }


            for (var objid in confObj) {
                if (confObj[objid].value == "") {
                    _self.showErrorConf(objid, LS.get("empty_user"))
                    return false;
                }
            }

        }

        return true;

    }

    _self.setBoxClass = function (targetObj, style ,_doSome) {
        if (targetObj== null) return;
        if (targetObj.initclass == null){
            targetObj.initclass = targetObj.className;
        }else{
            targetObj.className = targetObj.initclass;
        }
        if (_doSome == "add" &&!targetObj.classList.contains(style)) {
            targetObj.classList.add(style);
        }
    }

    //============== load conf ==============
    _self.loadUpperConf = function () {
        var getHttp = new HttpRequest();
        var param = _self.getConfParam();
        getHttp.addEventListener("LoadComplete", _self.loadConfFinish);
        param = "p=get_upper_conf&ver=" + top.ver + "&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.loadConfFinish=function(data){
        var xmlObj = new Object();
        var arr_data = JSON.parse(data);
        var conn = arr_data.conn;
        dom.getElementById("input_min_m").value = conn.m_min*1;
        dom.getElementById("input_min_r").value = conn.r_min*1;
        dom.getElementById("input_min_re").value = conn.re_min*1;
        dom.getElementById("input_min_dt").value = conn.dt_min*1;
        dom.getElementById("input_min_rdt").value = conn.rdt_min*1;
        dom.getElementById("input_min_fs").value = conn.fs_min*1;

        dom.getElementById("input_max_m").value = conn.m_max*1;
        dom.getElementById("input_max_r").value = conn.r_max*1;
        dom.getElementById("input_max_re").value = conn.re_max*1;
        dom.getElementById("input_max_dt").value = conn.dt_max*1;
        dom.getElementById("input_max_rdt").value = conn.rdt_max*1;
        dom.getElementById("input_max_fs").value = conn.fs_max*1;






        dom.getElementById("input_maintain_time").value = conn.webstr;
        dom.getElementById("input_maintain_time_end").value = conn.webend;
        if(conn.hasOwnProperty("website") && conn.website == 1){
            dom.getElementById("input_maintain_yes").checked = true;
            dom.getElementById("input_maintain_no").checked = false;
        }else{
            dom.getElementById("input_maintain_yes").checked = false;
            dom.getElementById("input_maintain_no").checked = true;
        }
		
        if(conn.hasOwnProperty("isgoogle") && conn.isgoogle == 1){
            dom.getElementById("isgoogle_yes").checked = true;
            dom.getElementById("isgoogle_no").checked = false;
        }else{
            dom.getElementById("isgoogle_yes").checked = false;
            dom.getElementById("isgoogle_no").checked = true;
        }
		
		var qrImage = document.getElementById('google_qrcode');
		qrImage.src = arr_data.google_qrcode;
		
		var googleCode = document.getElementById('google_code');
		googleCode.value = arr_data.google_code;
    }

    _self.getConfParam = function () {
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&up_layer=ads";
        par += "&up_id=" + top.layer_id;
        par += "&langx=" + top.langx; //19/04/30 James *483.>>>新增帳號時，幣值/阻擋訊息還是沒有翻到
        return par;
    }

    _self.setConfEvent = function (mouseEvent, targetObj) {
        confObj[targetObj.setK].value = targetObj.setV;
    }

    _self.ShowAndHidden = function (mouseEvent, element) {
        for (var id in titleObj) {
            if (titleObj[id].classList.contains("on") && element._type == titleObj[id]._type && element.id != id){
                titleObj[id].classList.remove("on");
                var setNone = ""+titleObj[id].mapA + titleObj[id].mapB;
                _mc[setNone].style.display = "none";
            }
        }
        if (!element.classList.contains("on")) {
            element.classList.add("on");
        }

        var setView = ""+element.mapA + element.mapB;
        _mc[setView].style.display = "";
    }

    _self.initShow = function (e) {
        var target = new Object();
        if(e){
            var ctl_tmp = e.target.id.replace("input_", "") ;
            if (ctlObj[ctl_tmp]){
                target = ctlObj[ctl_tmp];
            } else {
                for (var key in ctlObj) {
                    if (ctlObj[key].input == e.target){
                        target = ctlObj[key] ;
                        break ;
                    }
                }
            }
        }
        _self.clearErrorStatusCtl(e, target);
        _self.clearErrorStatusConf();
    }

    _self.ChkCreditErr = function (e) {
        if (e.target == ctlObj["input_min_m"].input) {
            _self.showErrorCtl("input_min_m", LS.get("str_min_m"));
        }

        if (e.target == ctlObj["input_min_r"].input) {
            _self.showErrorCtl("input_min_r", LS.get("str_min_r"));
        }

        if (e.target == ctlObj["input_min_re"].input) {
            _self.showErrorCtl("input_min_re", LS.get("str_min_re"));
        }

        if (e.target == ctlObj["input_min_dt"].input) {
            _self.showErrorCtl("input_min_dt", LS.get("str_min_dt"));
        }

        if (e.target == ctlObj["input_min_rdt"].input) {
            _self.showErrorCtl("input_min_rdt", LS.get("str_min_rdt"));
        }

        if (e.target == ctlObj["input_min_fs"].input) {
            _self.showErrorCtl("input_min_fs", LS.get("str_min_fs"));
        }

        if (e.target == ctlObj["input_max_m"].input) {
            _self.showErrorCtl("input_max_m", LS.get("str_max_m"));
        }

        if (e.target == ctlObj["input_max_r"].input) {
            _self.showErrorCtl("input_max_r", LS.get("str_max_r"));
        }

        if (e.target == ctlObj["input_max_re"].input) {
            _self.showErrorCtl("input_max_re", LS.get("str_max_re"));
        }

        if (e.target == ctlObj["input_max_dt"].input) {
            _self.showErrorCtl("input_max_dt", LS.get("str_max_dt"));
        }

        if (e.target == ctlObj["input_max_rdt"].input) {
            _self.showErrorCtl("input_max_rdt", LS.get("str_max_rdt"));
        }

        if (e.target == ctlObj["input_max_fs"].input) {
            _self.showErrorCtl("input_max_fs", LS.get("str_max_fs"));
        }
    }

    _self.keep_credits = function (e) {
        var va = e.target.value.replace(/\D/g, '');
        if (e.target == ctlObj["input_min_m"].input) {
            credit_old_min_m = va;
        }

        if (e.target == ctlObj["input_min_r"].input) {
            credit_old_min_r = va;
        }

        if (e.target == ctlObj["input_min_re"].input) {
            credit_old_min_re = va;
        }

        if (e.target == ctlObj["input_min_ou"].input) {
            credit_old_min_ou = va;
        }

        if (e.target == ctlObj["input_min_dt"].input) {
            credit_old_min_dt = va;
        }

        if (e.target == ctlObj["input_min_rdt"].input) {
            credit_old_min_rdt = va;
        }

        if (e.target == ctlObj["input_min_fs"].input) {
            credit_old_min_fs = va;
        }

        if (e.target == ctlObj["input_max_m"].input) {
            credit_old_max_m = va;
        }

        if (e.target == ctlObj["input_max_r"].input) {
            credit_old_max_r = va;
        }

        if (e.target == ctlObj["input_max_re"].input) {
            credit_old_max_re = va;
        }

        if (e.target == ctlObj["input_max_dt"].input) {
            credit_old_max_dt = va;
        }

        if (e.target == ctlObj["input_max_rdt"].input) {
            credit_old_max_rdt = va;
        }

        if (e.target == ctlObj["input_max_fs"].input) {
            credit_old_max_fs = va;
        }
    }

    //信用額度轉換千位顯示
    _self.show_credits = function (e) {
        if (e.target == ctlObj["input_min_m"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_m, e);
        } else if(e.target == ctlObj["input_min_r"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_r, e);
        } else if(e.target == ctlObj["input_min_re"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_re, e);
        } else if(e.target == ctlObj["input_min_dt"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_dt, e);
        } else if(e.target == ctlObj["input_min_rdt"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_rdt, e);
        } else if(e.target == ctlObj["input_min_fs"].input) {
            util.Replace_Input_credits(e.target, credit_old_min_fs, e);
        } else if (e.target == ctlObj["input_max_m"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_m, e);
        } else if(e.target == ctlObj["input_max_r"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_r, e);
        } else if(e.target == ctlObj["input_max_re"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_re, e);
        } else if(e.target == ctlObj["input_max_dt"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_dt, e);
        } else if(e.target == ctlObj["input_max_rdt"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_rdt, e);
        } else if(e.target == ctlObj["input_max_fs"].input) {
            util.Replace_Input_credits(e.target, credit_old_max_fs, e);
        }else if (e.type == "input") {
            util.Replace_Input_credits(e.target, credit_old, e);
        } else {
            util.Replace_credits(e.target, credit_old, e);
        }

    }

    //轉換匯率金額
    _self.TransRMB = function () {
        var credit = _mc["input_credit"].value.replace(/\D/g, '');
        credit = credit * 1;
        var trans = _mc["currency_def"].innerHTML * credit;
        _mc["input_credit_RMB"].innerHTML = util.mprintf(trans, 0, 2, false, true);

    }

    //=================錯誤訊息=================
    _self.showErrorCtl = function (code, msg) {
        if (code == "system") {
            code = "user";
        }
        if(code){
            _self.clearErrorStatusCtl(null,ctlObj[code]);
        }else{
            _self.clearErrorStatusCtl();
        }
        // _self.clearErrorStatusCtl();
        var obj = ctlObj[code];
        var error_class = "accadd_error";
        if (obj != null) {
            ctlObj[code].msg.innerHTML = msg;
            if (code == "passwd") error_class = "psw_error";
            _self.setBoxClass(ctlObj[code].box, error_class, "add");
            //if (code != "user") ctlObj[code].input.focus();
            _self.ShowAndHidden(null, _mc["setting_title_box"]);
        }
    }

    _self.clearErrorStatusCtl = function (e, target) {
        if (target != null) {
            _self.setBoxClass(target.box, "accadd_error", "");
        } else {
            for (var key in ctlObj) {
                if (key != "posses") {
                    _self.setBoxClass(ctlObj[key].box, "", "");
                }
            }
        }
    }

    _self.showErrorPwd = function (code, msg) {
        var obj = ctlObj[code];
        if (obj != null) {
            ctlObj[code].msg.innerHTML = msg;
            _self.setBoxClass(ctlObj[code].box, "psw_error", "add");
        }
    }

    _self.clearErrorStatusConf = function () {
        for (var key in confObj) {
            _self.setBoxClass(confObj[key].box, "", "");
        }
    }

    _self.show_Error = function (code, msg, arr_data) {
        var tmp = code.split("|");
        if (tmp[0] == "errormsg") {
            _self.showErrorMsg(tmp[1], msg);
        } else if (tmp[0] == "ctl") {
            _self.showErrorCtl(tmp[1], msg);
        } else if (tmp[0] == "conf") {
            _self.showErrorConf(tmp[1], msg);
        } else {
            if (msg != null && msg != "") {
                parentClass.dispatchEvent("showAlertMsg", arr_data);
            } else {
                util.chkErrorMsg(arr_data, LS_code);
            }
        }
    }

    _self.showErrorMsg = function (code, msg) {
        if (code == "clean_db") {
            var obj = new Object();
            obj.msg = msg;
            obj.backPage = "account";
            parentClass.dispatchEvent("showAlertMsg", obj);
        }
    }

    //show conf obj error
    _self.showErrorConf = function (code, msg) {
        var obj = confObj[code];
        if (obj != null) {
            if (obj.ftype != null && obj.limit == null) {
                _self.initShow();
                obj.msg.innerHTML = msg;
                _self.setBoxClass(obj.box, "accadd_error", "add");
                commiss_gtype = obj.gtype;
                _self.ShowAndHidden(null, _mc["maintain_title_box"]);
                obj.focus();
            }
        }
    }
    //=================錯誤訊息 end=================

    //判斷向下滑動 設定加上css
    _self.scrollEvent = function (e, target) {
        var newScrollTop = e.target.scrollTop;
        if (newScrollTop >= overScrollTop) {
            if (!target.issticky) {
                util.classFunc(target, "acc_sticky");
                overScrollTop = e.target.scrollTop;
                target.issticky = true;
            }
        } else {
            if (target.issticky) {
                util.classFunc(target, "acc_sticky", "remove");
                overScrollTop = keepScrollTop;
                target.issticky = false;
            }
        }
    }

    //=================提示訊息i=================
    _self.showTip = function (mouseEvent, par) {
        parentClass.dispatchEvent("showAlertMsg", par);
    }
    //=================提示訊息i end=================

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        LS_account = parentClass.getThis("LS_account");
        config_set = parentClass.getThis("config_set");
    }

    //離開此頁移除事件
    _self.exitEvent = function () {
        util.removeEvent(dom.getElementById("body_show"), "scroll");
        return true;
    }
}