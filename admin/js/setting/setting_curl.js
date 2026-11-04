function setting_curl(_win, _dom){

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
    var keepScrollTop = 56;
    var overScrollTop = 56;
    var datas = [];
    var dataCount = 0;
    var type = "setting";
    var inputAry = ["uid","user","pwd","url","status"];

    _self.init=function() {
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        parentClass.dispatchEvent("chgPageName", {"pageType": "setting", "pageName": "setting"});
        parentClass.dispatchEvent("chgLeftMenuColor", {"target": "setting"});

        var obj_ids = ",setting_info,maintain_info,autoReg_info,btn_new,btn_save,scroll_div,";
        obj_ids += "box_top,box_bottom,";
        _mc = util.getObjAry(dom, obj_ids);



        var obj_ids = ",setting_title_box,maintain_title_box,autoReg_title_box,";
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

        _self.loadUpperConf();
        util.addEvent(_mc["btn_new"], "click", _self.newEvent, _mc["btn_new"]);
        util.addEvent(_mc["btn_save"], "click", _self.saveEvent, _mc["btn_save"]);

        // 自动开号保存按钮
        var btnAutoReg = dom.getElementById("btn_save_autoreg");
        if(btnAutoReg){
            util.addEvent(btnAutoReg, "click", _self.saveAutoRegEvent, btnAutoReg);
        }

        keepScrollTop = _mc["setting_title_box"].parentElement.offsetHeight;
        overScrollTop = _mc["setting_title_box"].parentElement.offsetHeight;
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, _mc["scroll_div"]);
        dom.getElementById("body_show").scrollTop = 0;

        parentClass.dispatchEvent("showLoading", { "showLoading": false });
    }

    //============== save ==============
    _self.saveEvent = function (mouseEvent, targetObj) {
        var isSave = true;
        var div = dom.getElementById("setting_div");
        if(type == "maintain"){
            div = dom.getElementById("maintain_div");
        }
        var divs = div.querySelectorAll('div[id^="accad_content_"]');
        var postAry = [];
        for(var k in divs){
            var id = divs[k].id;
            if(typeof(id) == "string"){
                var sonAry = [];
                id = parseInt(id.replace("accad_content_",""));
                for(var i in inputAry) {
                    var iss = _self.showSaveError(dom.getElementById("input_"+inputAry[i]+"_" + id), {id: id, type: inputAry[i]});
                    if (iss == false) {
                        isSave = false;
                    }else{
                        sonAry.push(dom.getElementById("input_"+inputAry[i]+"_" + id).value);
                    }
                }
                postAry.push(sonAry);
            }
        }
        if(isSave == true){
            var getHttp = new HttpRequest();
            getHttp.addEventListener("LoadComplete", function (data) {
                _self.saveFinish(data, targetObj);
            });

            var par = "";
            par += "login_layer=" + top.login_layer;
            par += "&uid=" + top.uid;
            par += "&type="+type;
            var param = "p=body_setting_curl_add&ver=" + top.ver + "&" + par+"&ary="+JSON.stringify(postAry);
            getHttp.loadURL(top.url, "POST", param);
        }
    }

    _self.showSaveError = function(e, targetObj){
        var id = targetObj.id;
        var t = targetObj.type;
        if(dom.getElementById("input_"+t+"_"+id).value == ""){
            dom.getElementById("msg_"+t+"_"+id).innerHTML = LS.get("empty_user");
            _self.setBoxClass(dom.getElementById("box_"+t+"_"+id), "accadd_error", "add");
            return false;
        }else{
            dom.getElementById("msg_"+t+"_"+id).innerHTML = "Text";
            dom.getElementById("box_"+t+"_"+id).classList.remove("accadd_error");
            return true;
        }
    }

    _self.newEvent = function (mouseEvent, targetObj) {
        var xmpHtml = dom.getElementById("defult_div").innerHTML;
        var div = "";
        var i = 0;
        if(type == "setting"){
            div = dom.getElementById("setting_div");
        }else{
            div = dom.getElementById("maintain_div");
        }
        i = dataCount+1;
        dataCount = i;

        var cl = "l";
        if(i%2 == 0){ cl = "r"; }
        var contanttmp = xmpHtml;//clone contant 資料
        contanttmp = contanttmp.replaceAll(/\*NUM\*/g, i);
        contanttmp = contanttmp.replace(/\*LR\*/g, cl);
        contanttmp = contanttmp.replace(/\*USER\*/g, "");
        contanttmp = contanttmp.replace(/\*PWD\*/g, "");
        contanttmp = contanttmp.replace(/\*UID\*/g, "");
        contanttmp = contanttmp.replace(/\*URL\*/g, "");
        contanttmp = contanttmp.replaceAll(/\*STATUS\*/g, "ok");
        div.innerHTML = div.innerHTML + contanttmp;
        _self.btnDeleteClick();
    }

    _self.btnDeleteClick = function (){
        var div = dom.getElementById("setting_div");
        if(type == "maintain"){
            div = dom.getElementById("maintain_div");
        }
        var dis = div.querySelectorAll('span[id^="btn_delete_"]');
        for(var k in dis){
            if(typeof(dis[k])=="object"){
                var ids = dis[k].getAttribute("ids");
                var idd = parseInt(ids);
                util.addEvent(dis[k], "click", _self.ondelete, {id:idd});
                for(var i in inputAry){
                    util.addEvent(dom.getElementById("input_"+inputAry[i]+"_"+idd), "blur", _self.showSaveError, {id:idd,type:inputAry[i]});
                }

            }
        }

    }

    _self.saveFinish = function (data, targetObj) {
        var arr_data = JSON.parse(data);
        var _status = arr_data.status;
        if (_status == "error") {
            var error_msg = util.showTxt(arr_data.msg);
            util.chkErrorMsg(arr_data, error_msg);
        } else {
            //2019-04-09 Ricky 150.新增帳號-成功創建新帳戶後，將會顯示7秒的短暫訊息“成功新增帳戶。現在大概只有2秒，且應有copy的字眼可以複製帳密，現在訊息account successfully created，應該是New Account Created
            //parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("add_account_success")});
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("page_edit_ok") ,"s":5});
            util.addEvent(dom.getElementById("btn_copy"), "click", _self.copyInput);
            _self.loadUpperConf();
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



    //============== save ==============


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
        param = "p=get_setting_curl&ver=" + top.ver + "&type="+type+"&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.loadConfFinish=function(data){
        var arr_data = JSON.parse(data);
        datas = arr_data;
        _self.loadAddDiv(datas);
    }

    _self.loadAddDiv = function(arr_data){
        var xmpHtml = dom.getElementById("defult_div").innerHTML;
        if(arr_data != ""){
            var bodyTemp = "";
            dataCount = arr_data.length;
            for(var i in arr_data){
                var cl = "l";
                if(i%2 == 1){
                    cl = "r";
                }
                var contanttmp = xmpHtml;//clone contant 資料
                contanttmp = contanttmp.replaceAll(/\*NUM\*/g, i);
                contanttmp = contanttmp.replace(/\*LR\*/g, cl);
                contanttmp = contanttmp.replace(/\*USER\*/g, util.showTxt(arr_data[i].user));
                contanttmp = contanttmp.replace(/\*PWD\*/g, util.showTxt(arr_data[i].pwd));
                contanttmp = contanttmp.replace(/\*UID\*/g, util.showTxt(arr_data[i].uid));
                contanttmp = contanttmp.replace(/\*URL\*/g, util.showTxt(arr_data[i].url));
                if(arr_data[i].status == "" || arr_data[i].status == null) arr_data[i].status = "ok";
                contanttmp = contanttmp.replaceAll(/\*STATUS\*/g, util.showTxt(arr_data[i].status));
                bodyTemp += contanttmp;
            }
            if(type == "setting"){
                dom.getElementById("setting_div").innerHTML = bodyTemp;
            }else{
                dom.getElementById("maintain_div").innerHTML = bodyTemp;
            }

        }
        _self.btnDeleteClick();
    }

    _self.ondelete = function(mouseEvent, obj){
        var i = obj.id;
        var div = dom.getElementById("accad_content_"+i);
        div.remove();
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
        var isUp = true;
        if(element.id == "maintain_title_box"){
            if(type == "maintain"){
                isUp = false;
            }
            type = "maintain";
            dom.getElementById("setting_div").innerHTML = "";
        }else if(element.id == "autoReg_title_box"){
            if(type == "autoReg"){
                isUp = false;
            }
            type = "autoReg";
            dom.getElementById("setting_div").innerHTML = "";
            dom.getElementById("maintain_div").innerHTML = "";
            // 隐藏新增和保存按钮(自动开号有独立的保存按钮)
            _mc["btn_new"].style.display = "none";
            _mc["btn_save"].style.display = "none";
            _self.loadAutoRegConf();
        }else{
            if(type == "setting"){
                isUp = false;
            }
            type = "setting";
            dom.getElementById("maintain_div").innerHTML = "";
        }

        // 非自动开号tab时恢复按钮显示
        if(element.id != "autoReg_title_box"){
            _mc["btn_new"].style.display = "";
            _mc["btn_save"].style.display = "";
        }

        dataCount = 0;
        if (!element.classList.contains("on")) {
            element.classList.add("on");
        }

        var setView = ""+element.mapA + element.mapB;
        _mc[setView].style.display = "";

        if(isUp && element.id != "autoReg_title_box") {
            _self.loadUpperConf();
        }
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
        if (e.target == ctlObj["input_m"].input) {
            _self.showErrorCtl("input_m", LS.get("str_m"));
        }

        if (e.target == ctlObj["input_r"].input) {
            _self.showErrorCtl("input_r", LS.get("str_r"));
        }

        if (e.target == ctlObj["input_ou"].input) {
            _self.showErrorCtl("input_ou", LS.get("str_ou"));
        }

        if (e.target == ctlObj["input_pd"].input) {
            _self.showErrorCtl("input_pd", LS.get("str_pd"));
        }

        if (e.target == ctlObj["input_t"].input) {
            _self.showErrorCtl("input_t", LS.get("str_t"));
        }

        if (e.target == ctlObj["input_f"].input) {
            _self.showErrorCtl("input_f", LS.get("str_f"));
        }

        if (e.target == ctlObj["input_p"].input) {
            _self.showErrorCtl("input_rp", LS.get("str_p"));
        }

        if (e.target == ctlObj["input_fs"].input) {
            _self.showErrorCtl("input_fs", LS.get("str_fs"));
        }

        if (e.target == ctlObj["input_max"].input) {
            _self.showErrorCtl("input_max", LS.get("str_max"));
        }
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

    //============== 自动开号 ==============
    _self.loadAutoRegConf = function(){
        var getHttp = new HttpRequest();
        var param = _self.getConfParam();
        getHttp.addEventListener("LoadComplete", _self.loadAutoRegFinish);
        param = "p=get_setting_curl&ver=" + top.ver + "&showtype=AUTOREG&" + param;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.loadAutoRegFinish = function(data){
        var arr_data = JSON.parse(data);
        if(arr_data && arr_data.auto_reg_num){
            dom.getElementById("input_auto_reg_num").value = arr_data.auto_reg_num;
        }
        if(arr_data && arr_data.auto_reg_interval){
            dom.getElementById("input_auto_reg_interval").value = arr_data.auto_reg_interval;
        }
        if(arr_data && arr_data.auto_reg_enabled){
            if(arr_data.auto_reg_enabled == "1"){
                dom.getElementById("input_auto_reg_yes").checked = true;
                dom.getElementById("input_auto_reg_no").checked = false;
            }else{
                dom.getElementById("input_auto_reg_yes").checked = false;
                dom.getElementById("input_auto_reg_no").checked = true;
            }
        }
    }

    _self.saveAutoRegEvent = function(mouseEvent, targetObj){
        var num = dom.getElementById("input_auto_reg_num").value;
        var interval = dom.getElementById("input_auto_reg_interval").value;
        var enabled = dom.getElementById("input_auto_reg_yes").checked ? "1" : "0";

        if(num == "" || parseInt(num) < 1){
            dom.getElementById("msg_auto_reg_num").innerHTML = "请输入有效的数量(1-100)";
            dom.getElementById("msg_auto_reg_num").style.color = "red";
            return;
        }

        var getHttp = new HttpRequest();
        getHttp.addEventListener("LoadComplete", _self.saveAutoRegFinish);
        var par = "";
        par += "login_layer=" + top.login_layer;
        par += "&uid=" + top.uid;
        par += "&type=AUTOREG";
        par += "&auto_reg_num=" + num;
        par += "&auto_reg_interval=" + (interval || "5");
        par += "&auto_reg_enabled=" + enabled;
        var param = "p=body_setting_curl_add&ver=" + top.ver + "&" + par;
        getHttp.loadURL(top.url, "POST", param);
    }

    _self.saveAutoRegFinish = function(data){
        var arr_data = JSON.parse(data);
        if(arr_data.status == "error"){
            var error_msg = util.showTxt(arr_data.msg);
            util.chkErrorMsg(arr_data, error_msg);
        }else{
            parentClass.dispatchEvent("showFadeOutMesg", { "text": LS.get("page_edit_ok") ,"s":5});
        }
    }
    //============== 自动开号 end ==============

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