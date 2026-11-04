function util(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;

    _self.init = function () {

    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
    }

    _self.getThis = function (varible) {
        return eval(varible);
    }
    
    _self.addEvent = function (targetObj, eventName, fun, parObj, clean_old_sw) {
        if (typeof clean_old_sw == 'undefined'){
            clean_old_sw = true ;
        }
        try {
            var retFun = function (e) {
                fun(e, parObj);
            }
            if (targetObj.eventName == null){
                targetObj.eventName = new Array();
            }else{
                if (clean_old_sw){ //需不需要將原本的事件移除
                    _self.removeEvent(targetObj, eventName);
                }
            }
            targetObj.eventName[eventName] = retFun;
            targetObj.addEventListener(eventName, retFun, false);
            // targetObj.addEventListener(eventName, function(e){
            //     fun(e, parObj);
            // },false);

        } catch (ex) {
            // console.error(ex.toString());
            try {
                targetObj.attachEvent("on" + eventName, retFun);
                if (targetObj.eventName == null) targetObj.eventName = new Array();
                targetObj.eventName[eventName] = retFun;

                // targetObj.attachEvent("on"+eventName, function(e){
                //     fun(e, parObj);
                // });
            } catch (exx) {
                // console.error(exx.toString());
            }
        }
    }

    _self.removeEvent = function (targetObj, eventName) {
        if (targetObj.eventName == null) return;
        //console.log(eventName + ":" + targetObj.eventName[eventName]);
        try {
            targetObj.removeEventListener(eventName, targetObj.eventName[eventName]);
        } catch (ex) {
            //console.error(ex.toString());
            try {
                targetObj.detachEvent("on" + eventName, targetObj.eventName[eventName]);
            } catch (exx) {
                //console.error(exx.toString());
            }
        }
    }

    _self.mergeArray = function () {

        var newArray = new Object();

        for (i = 0; i < arguments.length; i++) {
            for (var key in arguments[i]) {
                newArray[key] = arguments[i][key];
            }
        }
        return newArray;
    }

    _self.getProtocal = function () {
        return dom.location.protocol;
    }

    _self.getWebDomain = function () {
        return dom.domain;
    }

    _self.getWebUrl = function () {
        return _self.getProtocal() + "//" + _self.getWebDomain();
    }

    _self.goToIndex = function () {
        _self.topGoToUrl(_self.getWebUrl());
    }

    _self.topGoToUrl = function (_url, par) {
        var tmpForm = document.createElement("form");
        tmpForm.action = _url;
        tmpForm.method = "POST";
        tmpForm.target = "_top";

        if(par){
            for(var keys in par){
                var inp = document.createElement("input");
                inp.type = "hidden";
                inp.name = keys;
                inp.value = par[keys];
                tmpForm.appendChild(inp);
            }
        }
        document.body.appendChild(tmpForm);
        tmpForm.submit();
        // top.location.href = _url;
    }

    _self.chkErrorMsg = function (errHash, LS_code) {
        if (errHash["status"]!= null && errHash["status"] == "error") {
            if (errHash["code"]!=null && errHash["code"] == "4X014") {
                if(!top.doubleLogin){
                    top.doubleLogin = true;
                    alert(LS_code.get(errHash["code"]));
                }
                _self.goToIndex();
                return true;
            } else if (errHash["code"] != null && (errHash["code"].indexOf("clean_db")!=-1 || errHash["code"].indexOf("m_rep")!=-1 )){
                if (errHash["msg"]) _self.showErrorMsg(errHash["msg"]);
                parentClass.dispatchEvent("showLoading", { "showLoading": false });
                return true;
            }

        }
        return false;
    }

    //need to trans page
    _self.checkErrorCode = function (code, LS) {
        if (code == "doubleLogin") {  //check uid
            alert(LS.get(code));
            _self.goToIndex();
            return false;
        }

        if (code == "goToHome") {
            _self.goToIndex();
            return false;
        }
        return true;

    }

    //onblur
    _self.initOnBlurDiv = function (showObj, clickObj, clickFun, clickParam) {
        clickObj.tabIndex = 100;

        var param = new Object();
        param.showObj = showObj;
        param.clickObj = clickObj;
        param.clickFun = clickFun;
        param.clickParam = clickParam;
        _self.addEvent(clickObj, "blur", _self.onBlurEvent, param);
    }

    _self.onBlurEvent = function (e, param) {
        //_self.echo("on blur");
        //param.showObj.style.display = 'none';
        //_self.removeEvent(param.clickObj, "click");
	//_self.echo(param.clickObj);
	if(param.clickParam && param.clickParam.className) _self.classFunc(param.clickObj,param.clickParam.className,"remove");

        //setTimeout(_self.addEvent, 500, param.clickObj, "click", param.clickFun, param.clickParam);
    }

    //隱藏顯示提示窗
    _self.setInfEvent = function (icon,param) {
        //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
        // param.info_mode = true; //點內容要消失的模式
        param.info_mode != false ? param.info_mode = true : param.info_mode = false; //點內容要消失的模式
        param._focus.prev_scroll_lock = true;
        _self.addEvent(icon, "click", _self.showInfEvent, { "icon": icon, "param": param});
    }

    _self.showInfEvent = function (e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i] == e.target) {
                return false;
            }
        }
        if (e.target == param._focus) return false;

        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
            if (param.info_mode) _self.removeEvent(param._focus, "click");
            _self.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
            _self.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");
        } else {
            param._setView.classList.add(param._viewClass);
            if (param.info_mode) _self.addEvent(param._focus, "click", _self.closeInfElmt, param);
            _self.addEvent(dom.getElementsByTagName("div")[0], "mousedown", _self.InfBlurEvent, _par);
            _self.addEvent(dom.getElementsByTagName("div")[0], "touchstart", _self.InfBlurEvent, _par);
            param._focus.scrollTop= 0;
        }
    }

    _self.InfBlurEvent = function (e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
        var mouseIN = false;
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++) {
            if(all[i] == e.target){
                mouseIN = true;
            }
        }
        if (param._focus == e.target) mouseIN = true;

        if (!mouseIN){
            var all = icon.getElementsByTagName("*");
            for (var i = 0, max = all.length; i < max; i++) {
                if (all[i] == e.target) {
                    return false;
                }
            }
            if (e.target == icon) return false;

            _self.closeInfElmt(null,param);

        }
    }

    _self.closeInfElmt = function (e,param) {
        dom.activeElement.blur();
        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
        }

        _self.removeEvent(param._focus, "click");
        _self.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
        _self.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");
    }
    //隱藏顯示提示窗

    _self.clone = function (obj) {
        //Handle the 3 simple types, and null or undefined
        if (null == obj || typeof obj != "object") return obj;

        //Handle Date
        if (obj instanceof Date) {
            var copy = new Date();
            copy.setTime(obj.getTime());

            return copy;
        }

        //Handle Array
        if (obj instanceof Array) {
            var copy = [];

            for (var i = 0, len = obj.length; i < len; ++i) {
                copy[i] = _self.clone(obj[i]);
            }

            return copy;
        }

        //Handle Object
        if (obj instanceof Object) {
            var copy = {};

            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = _self.clone(obj[attr]);
            }

            return copy;
        }

        throw new Error("Unable to copy obj! Its type isn't supported.");
    }

    _self.showErrorMsg = function (msg) {
        // alert(msg);
        _self.showMsg(msg, "N", null);
    }

    _self.showMsg = function (msg, _confirm, retFun) {
        parentClass.dispatchEvent("showAlertMsg", { "confirm": _confirm, "msg": msg, "retFun": retFun });
    }

    _self.showTxt = function (msg) {
        if(msg+""=="undefined" || msg+""=="null" || msg+""=="NaN")  return "";
        return msg;
        //return (!msg && msg!=0) ? "" : msg;
    }

    _self.echo = function (msg) {
        //win.console.trace(msg);
        //win.console.log(msg);
    }

    _self.err = function (title, e) {
        _self.echo(title+"\n"+e.stack);
        win.console.error(title, e.stack);
    }

    _self.formatThousand = function (num) {
        num = num + "";
        var re = /(-?\d+)(\d{3})/;
        while (re.test(num)) {
            num = num.replace(re, '\$1,\$2');
        }
        return num;
    }

    _self.mprintf = function (vals, fronts, points, comma, thousand) {
        var out = _self.printf(vals, fronts, points, comma);
        if (thousand) out = _self.formatThousand(out);
        return out;
    }

    _self.printf = function (vals, fronts, points, comma) {
        vals = "" + vals;
        var cmd = new Array();
        cmd = vals.split(".");
        if (cmd.length > 1) { //cut the unnecessary points
            if (cmd[1].length > points) {
                if (points != 0) {
                    tmp = Math.pow(10, points * 1);
                    vals = Math.round(vals * tmp + 0.0001) / tmp;
                    vals = "" + vals;
                    cmd = vals.split(".");
                } else {
                    cmd = new Array(cmd[0]);
                    vals = cmd[0];
                }
            }
        }
        //integer+0
        for (ii = 0; ii < (fronts - cmd[0].length); ii++) {
            vals = "0" + vals;
        }

        //add comma
        if (comma) {
            valarr = vals.split(".");
            tmpval = valarr[0];
            for (ii = valarr[0].length; ii > 3; ii -= 3) {
                comma_index = ii - 3;
                strA = tmpval.substring(0, comma_index);
                strB = tmpval.substring(comma_index);
                tmpval = strA + "," + strB;
            }
            if (valarr.length > 1) {
                tmpval += "." + valarr[1];
            }
            vals = tmpval;
        }

        //point+0
        if (points > 0) {
            if (cmd.length > 1) { //has point
                for (ii = 0; ii < (points - cmd[1].length); ii++) {
                    vals = vals + "0";
                }
            } else { //no point
                vals = vals + ".";
                for (ii = 0; ii < points; ii++) {
                    vals = vals + "0";
                }
            }
        }
        return vals;
    }

    _self.getObjAry = function (tmpScreen, aryStr, attribute, isOnly) {
        var newAry = new Array();
        var _attribute = attribute;

        if (tmpScreen != null & aryStr != null) {

            if (_attribute == null) _attribute = "id";
            newAry = _self.getChildAry(tmpScreen.getElementsByTagName("*"), aryStr, newAry, _attribute, isOnly);

        }
        return newAry;
    }

    _self.getChildAry = function (objAry, aryStr, newAry, attribute, isOnly) {

        for (var i = 0; i < objAry.length; i++) {
            var obj = objAry[i];
            var _id = obj.getAttribute(attribute);

            if (_id != null) {
                if (aryStr.indexOf("," + _id + ",") != -1) {
                    if (attribute == "id") {
                        newAry[_id] = obj;
                    } else {
                        newAry.push(obj);
                    }
                    if (isOnly) return newAry;
                }
            }

            // if (obj.children.length > 0) {
            //     _self.getChildAry(obj.children, aryStr, newAry, attribute, isOnly);

            // }

        }
        return newAry;
    }

    //get span
    _self.getSpan = function (divObj, spanid) {
        return _self.getObj(divObj, spanid);
    }


    //get obj
    _self.getObj = function (divObj, tagID) {
        var obj = null;
        try {
            obj = divObj.children[tagID];
        } catch (e) {
            obj = null;
        }
        return obj;
    }

    _self.setObjectClass = function (targetObj, classStr) {
        if (targetObj.className != undefined) {
            targetObj.className = classStr;
        } else {
            targetObj.setAttribute("class", classStr);
        }
    }

    _self.getObjAbsolute_new = function (obj, stop_name) {
        var abs = new Object();

        abs["left"] = obj.offsetLeft;
        abs["top"] = obj.offsetTop;

        while (obj = obj.offsetParent) {
            ////console.log(obj);
            ////console.log(obj.offsetLeft+" >> "+obj.offsetTop);
            if (_self.getStyle(obj, "position") == "relative") {
                ////console.log(obj.id+"|"+obj.offsetParent.id+"|"+_self.getStyle(obj,"top")+"|"+_self.getStyle(obj,"margin-top")+"|"+obj.offsetTop);
                if ((obj.id != "" && obj.offsetParent.id != "") && _self.getStyle(obj, "top") != "auto" && _self.getStyle(obj, "margin-top") != "auto" && _self.getStyle(obj, "margin-top") != "0px") {
                    abs["top"] += -obj.offsetTop;
                    continue;
                }
            }

            if (stop_name != undefined && obj.id == stop_name) {
                break;
            } else if (_self.getStyle(obj, "position") == "absolute") {
                break;
            }

            abs["left"] += obj.offsetLeft;
            abs["top"] += obj.offsetTop;
        }

        return abs;
    }

    _self.getStyle = function (oElm, strCssRule) {
        var strValue = "";
        if (document.defaultView && document.defaultView.getComputedStyle) {
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        } else if (oElm.currentStyle) {
            strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1) {
                return p1.toUpperCase();
            });
            strValue = oElm.currentStyle[strCssRule];
        } else {
            return "error";
        }
        return strValue;
    }

    //return true/false
    _self.checkFormat = function (msg, type) {
        var ret = null;
        var _msg = msg + "";
        switch (type) {
            case 0:
                ret = _msg.match("^[a-zA-Z0-9]*$");
                break;
            case 1:
                ret = _msg.match("^[0-9]*$");
                break;
            case 2://密碼專用
                ret = _msg.match("^[a-zA-Z0-9]*$");
                if (ret) {
                    if (_msg.match("^[a-zA-Z]*$") || _msg.match("^[0-9]*$")) {
                        ret = false;
                    }
                    if (_msg.length < 6 || _msg.length > 12) ret = false;
                }
                break;
            default:
                ret = _msg.match("^[a-zA-Z0-9]*$");
                break;
        }
        return (ret) ? true : false;
    }

    _self.getKeyCode = function (e) {
        return (win.event) ? win.event.keyCode : e.which;
    }

    _self.prevDefault = function (e) {
        if (e.preventDefault) {
            e.preventDefault();
        } else {
            e.returnValue = false;
        }
    }

    //============== check username keyBoard==============
    _self.ChkKeyUser = function (target, FunParam) {
        //FunParam{onErr:funOnErr(), param:param}
        if (_self.isAndroid()) {
            _self.addEvent(target, "input", _self.ChkInpKeyUser, FunParam);
        }else{
            _self.addEvent(target, "keypress", _self.ChkBoardKeyUser, FunParam);
        }
    }

    _self.ChkBoardKeyUser = function (e, FunParam) {
        //FunParam{onErr:funOnErr(), initShow:initShow(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow) FunParam.initShow(e, _par);
        }
        var keyCode = _self.getKeyCode(e);
        if (keyCode == 13) _self.prevDefault(e);
        else if (keyCode == 8) { }
        else if ((keyCode < 48 || keyCode > 57) && (keyCode > 95 || keyCode < 106) && !((keyCode > 64 && keyCode < 91) || (keyCode > 96 && keyCode < 123))) {
            _self.prevDefault(e);
            if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
        }
    }

    _self.ChkInpKeyUser = function (e, FunParam) {
        //FunParam{onErr:funOnErr(), initShow:initShow(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow) FunParam.initShow(e, _par);
        }
        var inCode = e.data;
        if (inCode != null) {
            if (inCode.match(/[^a-zA-Z0-9]/)) {
                var St = e.target;
                var position = _self.getCaretPosition(St) - inCode.length;
                var result = St.value.split('');
                result.splice(position, inCode.length);
                St.value = result.join('');
                _self.setSelectionRange(e.target, position, position);
                if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
            }
        }
    }

    //============== check Credit keyBoard==============
    _self.ChkKeyCash = function (target, FunParam) {
        //FunParam{initShow:initShow(), onErr:funOnErr(), onSuc:funOnSuc(), param:param}
        if (_self.isAndroid() || _self.isiPhone() ) {
            _self.addEvent(target, "input", _self.ChkInpKeyCash, FunParam);
        } else {
            _self.addEvent(target, "keydown", _self.ChkPasteKeyCash, FunParam);
            _self.addEvent(target, "keypress", _self.ChkBoardKeyCash, FunParam);
            _self.addEvent(target, "keyup", _self.doSucKeyCash, FunParam);
        }
    }
    _self.ChkPasteKeyCash = function (e, FunParam) {
        // 內容是用貼上的 要觸發過濾輸入的數字
        if ((e.ctrlKey || e.metaKey) && e.key === "v") {
            if (FunParam != null) FunParam.isCHK = true;
        }
    }

    _self.ChkBoardKeyCash = function (e, FunParam) {

        //FunParam{initShow:initShow(), onErr:funOnErr(), onSuc:funOnSuc(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null){
            if (FunParam.initShow) FunParam.initShow(e, _par);
            FunParam.isCHK = false;
        }

        var keyCode = _self.getKeyCode(e);
        if (keyCode == 13){
            _self.prevDefault(e);
            return false;
        }
        else if ((keyCode >= 48 && keyCode <= 57) || keyCode == 8) { }
        else if (keyCode < 96 || keyCode > 105) {
            if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
            _self.prevDefault(e);
            return false;
        } else if (e.code || e.key) {
            var charCode = e.code || e.key;
            charCode = charCode.replace(/\D/g, '');
            if (charCode == '') {
                if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
                _self.prevDefault(e);
                return false;
            }
        }
        if (FunParam != null) FunParam.isCHK = true;
    }
    _self.doSucKeyCash = function (e, FunParam) {
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null && FunParam.onSuc && FunParam.isCHK) FunParam.onSuc(e, _par);
    }

    _self.ChkInpKeyCash = function (e, FunParam) {

        //FunParam{initShow:initShow(), onErr:funOnErr(), onSuc:funOnSuc(), param:param}
        var _par = (FunParam != null) ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow) FunParam.initShow(e, _par);
            FunParam.isCHK = false;
        }

        var inCode = e.data;
        if (inCode != null) {
            if (inCode.match(/[^0-9]/)) {
                if (FunParam != null && FunParam.onErr) FunParam.onErr(e, _par);
                var St = e.target;
                var position = _self.getCaretPosition(St) - inCode.length;
                var result = St.value.split('');
                result.splice(position, inCode.length);
                St.value = result.join('');
                _self.setSelectionRange(e.target, position, position);
                return false;
            }
        }
        if (FunParam != null) FunParam.isCHK = true;
        if (FunParam != null && FunParam.onSuc) FunParam.onSuc(e, _par);
    }

    //信用額度轉換千位顯示
    _self.Replace_credits = function (targetObj, credit_old, e) {
        var keyCode = _self.getKeyCode(e);
        var position = _self.getCaretPosition(targetObj);
        //var credit = targetObj.value.replace(/\D/g, '');
        // 現金輸入會有小數點 小數點之後直接捨去
        var credit = targetObj.value.replace(/[^\d.]/g, '');
        if (credit != "" && credit == credit * 1) {
            credit = credit * 1;
            var num_length = credit.toString().length;

            if ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105)) {
                if (credit_old * 1 != credit && num_length % 3 == 1) position++;
                //if (credit_old * 1 == credit && position > 0) position--;
            } else if (keyCode == 8) {
                if (num_length % 3 == 0 && (credit_old * 1 != credit) && position > 0) position--;
            } else if ((keyCode >= 37 && keyCode <= 40) || keyCode == 13){
                return true;
            }
            targetObj.value = _self.mprintf(credit, 0, 0, false, true);
            _self.setSelectionRange(targetObj, position, position);
        } else {
            targetObj.value = "";
        }

    }

    //信用額度轉換千位顯示
    _self.Replace_Input_credits = function (targetObj, credit_old, e) {
        var inCode = e.data;
        var position = _self.getCaretPosition(targetObj);
        // var credit = targetObj.value.replace(/\D/g, '');
        // 現金輸入會有小數點 小數點之後直接捨去
        var credit = targetObj.value.replace(/[^\d.]/g, '');
        if (credit != "" && credit == credit * 1) {
            credit = credit * 1;
            var num_length = credit.toString().length;

            if (inCode != null) {
                if (num_length % 3 == 1 && inCode.match(/\d/)){
                    position += inCode.length;
                }
                if (inCode.match(/\D/)){
                    position -= inCode.length;
                }
                //console.log(inCode.length);
            } else {
                if (num_length % 3 == 0 && (credit_old * 1 != credit) && position > 0) position--;
            }
            //console.log(position);
            targetObj.value = _self.mprintf(credit, 0, 0, false, true);
            _self.setSelectionRange(targetObj, position, position)
        }else{
            targetObj.value = "";
        }

    }

    _self.getCaretPosition = function (oField) {
        var iCaretPos = 0;

        // IE Support
        if (document.selection) {
            oField.focus();
            var oSel = document.selection.createRange(); // To get cursor position, get empty selection range
            oSel.moveStart("character", 0 - oField.value.length); // Move selection start to 0th position
            iCaretPos = oSel.text.length; // The caret position is selection length
        }
        // Firefox Chrome support
        else if (oField.selectionStart || oField.selectionStart == "0") {
            iCaretPos = oField.selectionStart;
        }

        return (iCaretPos);
    }



    _self.setSelectionRange = function (input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionStart);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', selectionEnd);
            range.moveStart('character', selectionStart);
            range.select();
        }
    }

    //增加 / 刪除 className
    // ex: 刪除 util.classFunc(dom.getElementById("right_show"), ["w200px","w360px","w100per"], "remove");
    // ex: 新增 util.classFunc(dom.getElementById("right_show"), ["w100per","ma_extend"]);
    _self.classFunc = function (dom, c, a) {
        //dom指定的元素
        //c 可以是字串或是陣列
        //a=remove 剔除
        a = a || "";
        if (!Array.isArray) {
            Array.isArray = function (arg) {
                return Object.prototype.toString.call(arg) === '[object Array]';
            };
        }
        if (!(typeof c == "string") && !Array.isArray(c)) return;
        var o = dom.className.split(" ");
        if (!Array.isArray(c)) c = c.split(" ");

        Array.prototype.push.apply(o, c);
        o = _self.unique(o);
        if (a == "remove") {
            var z = JSON.parse(JSON.stringify(c));
            for (var i = 0, len = z.length; i < len; i++) {
                var ind = o.indexOf(z[i]);
                if (ind != -1) o.splice(ind, 1);
            }
        }
        dom.className = o.join(" ");
    }
    //陣列使用 剔除相同元素
    _self.unique = function (array) {
        var r = [];
        for (var i = 0, l = array.length; i < l; i++) {
            for (var j = i + 1; j < l; j++)
                if (array[i] === array[j]) j = ++i;
            r.push(array[i]);
        }
        return r;
    }

    _self.isIE = function () {
        if (win.navigator.userAgent.toUpperCase().indexOf("MSIE") != -1) {
            return true;
        }
        return false;
    }

    _self.isAndroid = function () {
        if (win.navigator.userAgent.toUpperCase().indexOf("ANDROID") != -1) {
            return true;
        }
        return false;
    }

    _self.isiPhone = function () {
        if (win.navigator.userAgent.toUpperCase().indexOf("IPHONE") != -1) {
            return true;
        }
        return false;
    }

    _self.checkScrollToHide=function(e, targetObj){
        //需要有 "返回至頂部按鈕" 的頁面
        var newScrollTop = e.target.scrollTop;
        if(newScrollTop > 0){
            targetObj["backtop"].style.display = "";
        }else if(newScrollTop <= 0){
            targetObj["backtop"].style.display = "none";
        }
    }


    //檢查流程
    //EngNeed 至少需要幾個字母組成
    _self.str_chk=function(str,EngNeed){
        var str_char=0;
        var arr_char = new Array();
        var str_len = str.length;
        for (var i=0; i < str_len;i++){
            var tmp_str = str.substr(i,1);
            if(tmp_str.match(/[aA-zZ]/))str_char++;
            arr_char[tmp_str] = true;
        }
        //低於6個字或是大於12個字
        if(str_len < 6 || str_len > 12 ){
            return "err_length";
        }
        //不是由英數字組成
        if(!str.match(/^[a-zA-Z0-9]*$/)){
            return "err_combination";
        }
        //裡面含有空格或是底線
        if (str.match(/\s/) || str.match(/_/) || str.match(/\^/)){
            return "err_contain";
        }
        //2019-10-25 英文+數字 要有超過2個字元
        if (Object.keys(arr_char).length <=2) {
            return "err_charactersNum";
        }
        //2019-10-25 過於簡易的密碼, 要做阻擋
        var arr_block_string = new Array("abc111","abc222","abc333","abc444","abc555","abc666","abc777","abc888","abc999","abc000","111abc","222abc","333abc","444abc","555abc","666abc","777abc","888abc","999abc","000abc","abc123","123abc","aaa123","123aaa","aaa1234","1234aaa","aa1234","1234aa","aa12345","12345aa","bbb123","123bbb","bbb1234","1234bbb","bb1234","1234bb","bb12345","12345bb","ccc123","123ccc","ccc1234","1234ccc","cc1234","1234cc","cc12345","12345cc","qwe123","123qwe","qwe1234","1234qwe","qwe12345","12345qwe") ;
        if (arr_block_string.indexOf(str.toLowerCase()) >= 0) {
            return "err_block_string";
        }

        //至少要有 EngNeed 個英文字 , 不可全英文或全數字
        if(str_char >= EngNeed && str_len > str_char){
            return "chk_OK";
        }else{
     		return "chk_wrong";
     	}
    }


    _self.in_array=function(txt, ary){
		for(var i=0; i<ary.length; i++){
			if(ary[i]==txt)  return true;
		}
		return false;
    }

    _self.isUCBrowser=function(){
        return (navigator.userAgent.indexOf("UCBrowser")!=-1)?true:false;
    }

    _self.extendsClass=function(parentClass, childClass, _win, _dom, _postHash){
        childClass.prototype=parentClass;
        objClass = new childClass(_win, _dom, _postHash);
        objClass._super = parentClass;
        return objClass;
    }

    _self.checkReportTeach=function(cookie, parentClass){
        // if(cookie.get("view_report_teach")!="Y"){
        //     parentClass.dispatchEvent("viewReportTeach", {"page":"report_teach"});
        // }
    }

    _self.isIE=function(){
        if(window.navigator.userAgent.toUpperCase().indexOf("MSIE")!=-1){
                return true;
        }
        return false;
    }

    //大版面的過濾器
    _self.filterBig = function(_win,_dom){
        var _self = this;
        var win =_win;
        var dom =_dom;
        var util;
        var parentClass;
        var eventHandler = new Object();
        var _param = new Object();
        var _paramTmp = new Object();
        var now_parObj = new Object();
        var LS;
        /*
            config.info_mode = true; //點內容要消失的模式
            config._setView	  整個包起來的div
            config._title   		標題選取顯示
            config.title_mode   標題選取功能開關
            config._focus   下拉選單
            config._viewClass  下拉選單動作 使用active
            config._act  是否啟用過濾選項 true close 目前沒在用
            config._default 預設選項 stake回傳物件 其餘回傳字串
            config._list   在mode_1中要跟可選取的li相等 在mode_2中跟群組相等
            config._listSub  在mode_1中要跟可選取的_list相等 顯示選項文字
            config._dataShowDiv 在dom底下顯示資料
            config._searchOpen 搜尋框框是否開啟
            config._searchItem 搜尋項目的名字
            config._searchDiv  搜尋項目所屬的div
            config._breakpoint 陣列 裡面放入物件 物件有div:dom,amount:數字 多少資料後顯示分組文字 預設[]不顯示
            config._default  在mode_1 回傳 list中的選項 預設ALL
                             在mode_2 回傳 物件{mode:_group中之一,_list:全部數值}
                             在mode_3 回傳 data中的id 多選項的用逗號串起 全選 ALL 全不選 NONE
                             在mode_5 回傳 data中的id 無多選項 預設ALL

            重置單一過濾器可使用 _self.reinit
            主動取得回傳參數    _self.getNowParam
                             _self.autoBackParam
        */


        _Mode  = new Object();
        _Mode["mode_1"]  = new Object();
        _Mode["mode_1"]["_config"]= {   //基本下拉樣式
            "mode":1,
            "info_mode":true,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_contantView":null,
            "_viewClass":"active",
            "_chkClass":"on",
            "_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"],
            "_listSub":["ALL","Soccer","BK","TN","VB","BM","TT","BS","SK","OP","FS"],
            "_act":true,
            "_default":"ALL",
            "_setAllTitleName":""
        } ;

        _Mode["mode_2"]  = new Object();
        _Mode["mode_2"]["_config"]= {   //stake樣式
            "mode":2,
            "info_mode":false,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_contantView":null,
            "_type":null,
            "_viewClass":"active",
            "_group":["ALL,PER"],
            "_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"],//跟者html選項
            "_act":true,
            "_default":{
                "mode":"ALL", 	//跟者_group
                "listGold":{ 	//跟者_list
                    "ALL":0,
                    "FT":0,
                    "BK":0,
                    "TN":0,
                    "VB":0,
                    "BM":0,
                    "TT":0,
                    "BS":0,
                    "SK":0,
                    "OP":0,
                    "FS":0
                },
                "listItem":"" //若使用per 可指定title顯示哪個一選項
            }
        } ;

        _Mode["mode_3"]  = new Object();
        _Mode["mode_3"]["_config"]= {   // downline下現樣式 搜尋 複選筐
            "mode":3,
            "info_mode":true,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_contantView":null,
            "_data":null, //1002: {id: "1002", alias: "stanNew", username: "stanNew"}
            "_viewClass":"active",
            "_list":["ALL","FT","BK","TN","VB","BM","TT","BS","SK","OP","FS"],
            "_act":true,
            "_default":"ALL",
            "_limitCount":5, //限制check數目 0不限制
            "_limitCountAlertMsg":"", //超過選取項目出現的警告訊息
            "_searchOpen":true,
            "_searchItem":"downlineID",
            "_searchDiv":null,
            "_dataShowDiv":null,
            "_breakpoint":[
                {
                    "div":null,
                    "amount":12
                }
            ],
            "_chkBtnMode":false, //開啟確定取消按鈕模式
            "_chkBtnDiv":        //確定取消案扭 dom 和 是否消失下拉選單
            {
                "SAVE":
                {
                    "div":null,
                    "disappear":true
                },
                "CANCEL":
                {
                    "div":null,
                    "disappear":true
                }

            },
            "_setAllTitleName":"",
            "_setItemTitleName":""
        } ;

        _Mode["mode_4"]  = new Object();
        _Mode["mode_4"]["_config"]= {   // 聯盟樣式 單選 群組 搜尋
            "mode":4,
            "info_mode":false,
            "title_mode":true,
            "_setDiv":null,
            "_titleView":null,
            "_contantView":null,
            "_dataShowDiv":null,
            "_data":null, //4: {id: "4", leaguename: "Test"}
            "_viewClass":"active",
            "_chkClass":"on",
            "_act":true,
            "_default":"ALL",
            "_searchOpen":true,
            "_searchItem":"leagueID",
            "_searchDiv":null,
            "_breakpoint":[
                    {
                        "div":null,
                        "amount":12
                    }
            ],
            "_setAllTitleName":""
        } ;

        _self.addEventListenEvent = function(){
            _self.addEventListener("getNowParam", _self.getNowParam);
            _self.addEventListener("autoBackParam", _self.autoBackParam);
        }
        _self.init = function(parObj){
            for(var key in parObj){
                var chosen_mode =  parObj[key].mode ;
                var mode = _Mode["mode_"+chosen_mode];

                if(mode){
                    var tmpObj = new Object();
                    for(var item in mode["_config"]){
                        if(typeof parObj[key][item] !== 'undefined')tmpObj[item] = parObj[key][item];
                        else tmpObj[item] = mode["_config"][item];
                    }
                    if(tmpObj._act){
                        now_parObj[key] =tmpObj;
                        _param[key] = new Object;
                        if(mode*1==3) _paramTmp[key] = new Object();
                    }
                }else{

                }

            }
            //console.log(now_parObj);
            _self.initDiv(now_parObj);
        }


        _self.setParentclass = function(_parentclass){
            parentClass = _parentclass;
            util = parentClass.getThis("util");
            LS = parentClass.getThis("LS");
            // Cookie = parentClass.getThis("cookie");
            // config_set = parentClass.getThis("config_set");
        }

        _self.reinit = function(parObj){
            var tmpParObj = new Object();
            for(var key in parObj){
                if(typeof now_parObj[key] !== 'undefined'){
                    tmpParObj[key]= new Object();
                    for(var item  in now_parObj[key]){
                        // console.log(typeof parObj[key][item]!=='undefined');
                        if(typeof parObj[key][item]!=='undefined') tmpParObj[key][item] = parObj[key][item];
                        else  tmpParObj[key][item] = now_parObj[key][item];
                    }
                    now_parObj[key] = tmpParObj[key];
                }
            }

            _self.initDiv(tmpParObj);
        }


        _self.returnSet = function(){
            return _set;
        }

        _self.initDiv = function(nowParObj){
            for(var key in nowParObj){
                if(!key || !nowParObj[key]) return;
                var icon = nowParObj[key]["_setDiv"];
                var contant = nowParObj[key]["_contantView"];
                var list = nowParObj[key]["_list"];
                var defaultValue =  nowParObj[key]["_default"];
                var mode = nowParObj[key]["mode"];
                var viewClass = nowParObj[key]["_viewClass"];
                var titleView =  nowParObj[key]["_titleView"];

                if(mode==1){
                    var frag = dom.createDocumentFragment();
                    for(var item in list){
                        var sample = contant.children[0].cloneNode(true);
                        sample.id = key+"_"+list[item];
                        sample.value = list[item];
                        sample.innerHTML = nowParObj[key]["_listSub"][item];
                        frag.appendChild(sample);
                    }
                    while(contant.firstChild){
                        contant.removeChild(contant.firstChild);
                    }

                    contant.appendChild(frag);
                    _self.setlistClick(mode,contant,titleView,key,list,nowParObj[key]["_chkClass"],nowParObj[key].title_mode,"");
                    _self.reDefault(key,defaultValue);

                }else if(mode==2){
                    var allGroupDIv = contant.children;
                    var allInput = contant.getElementsByTagName("Input");
                    var group =  nowParObj[key]["_group"];
                    for(var i=0;i<allGroupDIv.length;i++){
                        util.addEvent(allGroupDIv[i], "change", _self.chgRatio, {
                            "rtype": key, "group": group[i] ,"_viewClass": "wmc_stake_checked" ,
                            "mode":mode,
                            "allGroupDIv":allGroupDIv,
                            "titleView":titleView,
                            "titleMode":nowParObj[key]["title_mode"],
                            "allInput":allInput,
                            "now":i
                            });
                    }

                    var id_str=",";
                    for(var i=0;i<list.length;i++){
                        id_str+=list[i]+"_input,";
                    }
                    var obj_ids =  util.getObjAry(contant,id_str);
                    for(var key_sub in  obj_ids){
                        if(obj_ids[key_sub]){
                            util.addEvent(obj_ids[key_sub], "input", _self.keep_credit,{"target":obj_ids[key_sub]});
                        }
                    }

                    _self.reDefault(key,defaultValue);
                }else if(mode==3){
                    var data =  nowParObj[key]["_data"];
                    var dataShow =  nowParObj[key]["_dataShowDiv"];
                    var searchItem =  nowParObj[key]["_searchItem"];
                    var frag = dom.createDocumentFragment();
                    var searchOpen  = nowParObj[key]["_searchOpen"];
                    var searchDiv  = nowParObj[key]["_searchDiv"];
                    var limitCount = nowParObj[key]["_limitCount"];
                    var title_mode = nowParObj[key]["title_mode"];
                    var breakpoint = nowParObj[key]["_breakpoint"];
                    var chkBtnMode =  nowParObj[key]["_chkBtnMode"];
                    var setAllTitleName = nowParObj[key]["_setAllTitleName"];
                    var setItemTitleName = nowParObj[key]["_setItemTitleName"];
                    var limitCountAlertMsg =  LS.get("filter_err_"+key+"_max");
                    var now_count = 0;
                    var point_count = 0;
                    dataShow.children[0].getElementsByTagName("input")[0].checked=false;
                    for(var prop in data){
                        var id = data[prop]["id"];
                        var alias = data[prop]["alias"];
                        var username = data[prop]["username"];
                        var sample = dataShow.children[0].cloneNode(true);
                        var label = sample.getElementsByTagName("label")[0];
                        var input = sample.getElementsByTagName("input")[0];
                        var txt = label.getElementsByTagName("tt")[0];
                        input.name = searchItem;
                        input.value = username;
                        txt.className = "wmc_search_chkTxt";
                        txt.innerHTML = username+"<br><tt class='word_gray'>"+alias+"</tt>";
                        sample.id=key+"_"+id;

                        if(breakpoint[point_count]){
                            if(now_count*1 == breakpoint[point_count].amount*1 || id=="00000"){
                                frag.appendChild(breakpoint[point_count].div);
                                breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
                                point_count++;
                            }
                        }

                        if(id=="00000") continue;
                        frag.appendChild(sample);
                        now_count++;
                    }
                    for(var i=point_count;i< breakpoint.length;i++){
                        frag.appendChild(breakpoint[i].div);
                        breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
                    }

                    while(dataShow.children[0] != dataShow.children[dataShow.children.length*1-1]){
                        dataShow.removeChild(dataShow.children[(dataShow.children.length)*1-1]);
                    }
                    dataShow.appendChild(frag);
                    var allTagLi =  dataShow.getElementsByTagName("li");
                    var searchItemDiv = dataShow;
                    var status="";
                    for(var i=0;i<allTagLi.length;i++){
                        if(allTagLi[i].children.length>0){
                            var checkBox = allTagLi[i].getElementsByTagName("input")[0];
                            (allTagLi[i].id)? status="single" :status="ALL";
                            util.addEvent(checkBox, "click", _self.chgcheckBox, {
                                "id":allTagLi[i].id,
                                "status":status,
                                "rtype": key,
                                "title":titleView,
                                "searchItem":searchItem,
                                "searchDiv":searchItemDiv,
                                "limitCount":limitCount,
                                "titleMode":title_mode,
                                "chkBtnMode":chkBtnMode,
                                "setAllTitleName":setAllTitleName,
                                "setItemTitleName":setItemTitleName
                                }
                            );
                        }
                    }
                    if(searchOpen){
                        var text = searchDiv.getElementsByTagName("input")[0];
                        var clearBtn = searchDiv.getElementsByTagName("input")[1];
                        util.addEvent(text, "input", _self.searchItem, { "target":text,"item":searchItem });
                        util.addEvent(clearBtn, "click", _self.clearSearch, { "target":text,"item":searchItem});
                    }else{
                        searchDiv.style.display="none";
                    }
                    if( typeof limitCountAlertMsg !== 'undefined' && limitCountAlertMsg!=""){
                        now_parObj[key]["_limitCountAlertMsg"] = limitCountAlertMsg.replace(new RegExp("\\\*LIMITCOUNT\\\*", "gi"), limitCount);
                    }

                    _self.reDefault(key,defaultValue);
                    if(chkBtnMode){
                        var chkBtnDiv = nowParObj[key]["_chkBtnDiv"];
                        for(var btn in chkBtnDiv ){
                            if(btn=="SAVE"){
                                util.addEvent(chkBtnDiv[btn].div, "click", _self.saveParam, {"rtype":key,"icon":icon,"act":viewClass,"disappear":chkBtnDiv[btn].disappear});
                            }
                            if(btn=="CANCEL"){
                                util.addEvent(chkBtnDiv[btn].div, "click", _self.resetIcon, {"rtype":key,"icon":icon,"act":viewClass,"disappear":chkBtnDiv[btn].disappear});
                            }

                        }
                    }

                }else if(mode==4){
                    var data =  nowParObj[key]["_data"];
                    var dataShow =  nowParObj[key]["_dataShowDiv"];
                    var searchItem =  nowParObj[key]["_searchItem"];
                    var frag = dom.createDocumentFragment();
                    var searchOpen  = nowParObj[key]["_searchOpen"];
                    var searchDiv  = nowParObj[key]["_searchDiv"];
                    var limitCount = nowParObj[key]["_limitCount"];
                    var breakpoint = nowParObj[key]["_breakpoint"];
                    var setAllTitleName = nowParObj[key]["_setAllTitleName"];
                    var now_count = 0;
                    var point_count = 0;

                    for(var prop in data){
                        var id = data[prop]["id"];
                        var name = data[prop]["name"];
                        var sample = dataShow.children[0].cloneNode(true);
                        sample.id = key+"_"+id;
                        sample.children[0].setAttribute("name",searchItem);
                        sample.children[0].innerHTML =  name;

                        if(breakpoint[point_count]){
                            if(now_count*1 == breakpoint[point_count].amount*1 ||id=="00000"){
                                frag.appendChild(breakpoint[point_count].div);
                                breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
                                point_count++;
                            }
                        }
                        if(id=="00000") continue;
                        frag.appendChild(sample);
                        now_count++;

                    }

                    for(var i=point_count;i< breakpoint.length;i++){
                        frag.appendChild(breakpoint[i].div);
                        breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);

                    }

                    while(dataShow.children[0] != dataShow.children[dataShow.children.length*1-1]){
                        dataShow.removeChild(dataShow.children[(dataShow.children.length)*1-1]);
                    }
                    dataShow.children[0].id = key+"_ALL";
                    dataShow.appendChild(frag);


                    if(searchOpen){ //收尋框框
                        var text = searchDiv.getElementsByTagName("input")[0];
                        var clearBtn = searchDiv.getElementsByTagName("input")[1];
                        util.addEvent(text, "input", _self.searchItem, { "target":text,"item":searchItem });
                        util.addEvent(clearBtn, "click", _self.clearSearch, { "target":text,"item":searchItem});

                    }else{
                        searchDiv.style.display="none";
                    }

                    _self.setlistClick(mode,contant,titleView,key,null,nowParObj[key]["_chkClass"],nowParObj[key].title_mode,setAllTitleName);
                    _self.reDefault(key,defaultValue);
                }

                if(viewClass!=""){
                    util.addEvent(icon, "click", _self.showInfEventTEST, { "icon": icon, "param":{ "_focus":contant, "_setView": icon, "_viewClass":viewClass,"info_mode":now_parObj[key]["info_mode"],"rtype":key,"mode":mode }   });
                }


            }

        }


        _self.showInfEventTEST = function (e, _par) {
            var icon = _par.icon;
            var param = _par.param;
            //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
            var all = param._focus.getElementsByTagName("*");
            var close_self = false;
            for (var i = 0, max = all.length; i < max; i++) {
                if (all[i] == e.target) {
                    return false;
                }
            }
            if (e.target == param._focus) return false;
            if (param._setView.classList.contains(param._viewClass)) {
                param._setView.classList.remove(param._viewClass);
                close_self = true;
                if (param.info_mode) util.removeEvent(param._focus, "click");
                util.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
                util.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");

                if(param.mode==2){
                    var tmpObj=new Object;
                    var list = now_parObj[param.rtype]["_list"];
                    var id_str=",";
                    for(var i=0;i<list.length;i++){
                        id_str+=list[i]+"_input,";
                    }
                    var obj_ids =  util.getObjAry(param._setView,id_str);
                    for(var key_sub in  obj_ids){
                        if(obj_ids[key_sub]){
                            var itemType = key_sub.split('_')[0];
                            var itemGold = obj_ids[key_sub].value*1;
                            tmpObj[itemType] = itemGold;
                        }
                    }
                    _param[param.rtype]["listGold"] = tmpObj;
                    now_parObj[param.rtype]["_default"] = _param[param.rtype];
                    _self.dispatchEvent("autoBackParam",_param);
                }else if(param.mode==3){
                    var chkBtnMode = now_parObj[param.rtype]["_chkBtnMode"];
                    if(chkBtnMode){
                        if(close_self){
                            var chkBtnDiv = now_parObj[param.rtype]["_chkBtnDiv"];
                            chkBtnDiv.CANCEL.div.click();
                        }
                    }else{
                        if(_param[param.rtype]=="ALL"){
                            _self.reDefault(param.rtype,"ALL");
                        }
                    }
                }

            } else {
                param._setView.classList.add(param._viewClass);
                if (param.info_mode) util.addEvent(param._focus, "click", _self.closeInfElmtTEST, param);
                util.addEvent(dom.getElementsByTagName("div")[0], "mousedown", _self.InfBlurEventTEST, _par);
                util.addEvent(dom.getElementsByTagName("div")[0], "touchstart", _self.InfBlurEventTEST, _par);
                _self.scrollToTop(param.rtype);

            }
        }

        _self.InfBlurEventTEST = function (e, _par) {
            var icon = _par.icon;
            var param = _par.param;
            //param:{ "_focus": _mc["xx_txt"], "_setView": _mc["xx_txt"], "_viewClass":"on" }
            var mouseIN = false;
            var all = param._focus.getElementsByTagName("*");
            for (var i = 0, max = all.length; i < max; i++) {
                if(all[i] == e.target){
                    mouseIN = true;
                }
            }

            if (param._focus == e.target) mouseIN = true;

            if (!mouseIN){
                var all = icon.getElementsByTagName("*");
                for (var i = 0, max = all.length; i < max; i++) {
                    if (all[i] == e.target) {
                        return false;
                    }
                }
                if (e.target == icon) return false;

                _self.closeInfElmtTEST(null,param);
            }

        }

        _self.closeInfElmtTEST = function (e,param) {
            dom.activeElement.blur();
            var close_outside = false;
            if (param._setView.classList.contains(param._viewClass)) {
                param._setView.classList.remove(param._viewClass);
                close_outside =true;
            }

            util.removeEvent(param._focus, "click");
            util.removeEvent(dom.getElementsByTagName("div")[0], "mousedown");
            util.removeEvent(dom.getElementsByTagName("div")[0], "touchstart");

            if(param.mode==2){
                var tmpObj=new Object;
                var list = now_parObj[param.rtype]["_list"];
                var id_str=",";
                var itemGold_ALL = 0;
                for(var i=0;i<list.length;i++){
                    id_str+=list[i]+"_input,";
                }
                var obj_ids =  util.getObjAry(param._setView,id_str);
                for(var key_sub in  obj_ids){
                    if(obj_ids[key_sub]){
                        var itemType = key_sub.split('_')[0];
                        var itemGold = obj_ids[key_sub].value*1;
                        tmpObj[itemType] = itemGold;
                        if (itemType == "ALL") itemGold_ALL = itemGold;
                    }
                }
                _param[param.rtype]["listGold"] = tmpObj;
                now_parObj[param.rtype]["_default"] = _param[param.rtype];
                _self.dispatchEvent("autoBackParam",_param);


                if (dom.getElementById("ALL_radio").checked) {
                    dom.getElementById("stake_now").innerHTML = LS.get("filter_more") + " " + itemGold_ALL;
                }


            }else if(param.mode==3){
                var chkBtnMode = now_parObj[param.rtype]["_chkBtnMode"];
                if(chkBtnMode){
                    if(close_outside){
                        var chkBtnDiv = now_parObj[param.rtype]["_chkBtnDiv"];
                        chkBtnDiv.CANCEL.div.click();
                    }
                }else{
                    if(_param[param.rtype]=="ALL"){
                        _self.reDefault(param.rtype,"ALL");
                    }

                }
            }

        }
        //隱藏顯示提示窗


        _self.setlistClick = function(mode,contant,titleView,nowRtype,list,chkClass,titleMode,setAllTitleName){
            var contant = contant;
            var mode = mode ;
            var all = contant.getElementsByTagName("li");

            if(mode==1){
                for(var i =0;i<all.length;i++){
                    var tmpObj = new Object();
                    tmpObj["target"] = titleView;
                    tmpObj["mode"] = mode;
                    tmpObj["sel_dom"] = all[i];
                    tmpObj["value"] = list[i];
                    tmpObj["nowRtype"] = nowRtype;
                    tmpObj["chkClass"] = chkClass;
                    tmpObj["all"] = all;
                    tmpObj["sel"] = all[i];
                    tmpObj["titleMode"] = titleMode;
                    tmpObj["setAllTitleName"]="";
                    util.addEvent(all[i],"click",_self.chgInfTitleTEST,tmpObj)
                }
            }else if(mode ==4){
                for(var i =0;i<all.length;i++){
                    if(all[i].children[0]){
                        var tmpObj = new Object();
                        tmpObj["target"] = titleView;
                        tmpObj["mode"] = mode;
                        tmpObj["sel_dom"] = all[i].children[0];
                        tmpObj["value"] = all[i].id.split("_")[1];
                        tmpObj["nowRtype"] = nowRtype;
                        tmpObj["chkClass"] = chkClass;
                        tmpObj["all"] = all;
                        tmpObj["sel"] = all[i];
                        tmpObj["titleMode"] = titleMode;
                        if(i==0 && setAllTitleName!=""){
                            tmpObj["setAllTitleName"] = setAllTitleName;
                        }else{
                            tmpObj["setAllTitleName"] = "";
                        }
                        util.addEvent(all[i],"click",_self.chgInfTitleTEST,tmpObj)

                    }
                }
            }
        }


        _self.chgInfTitleTEST = function(e,_par){
            var target = _par.target;
            var self_dom = _par.sel_dom;
            var mode = _par.mode;
            var value = _par.value;
            var nowRtype = _par.nowRtype;
            var chkClass = _par.chkClass;
            var all = _par.all;
            var sel = _par.sel;
            var titleMode = _par.titleMode;
            var setAllTitleName = _par.setAllTitleName;

            for(var i=0;i<all.length;i++){
                util.classFunc(all[i], chkClass, "remove");
            }
            util.classFunc(sel, chkClass);
            if(titleMode){
                if(setAllTitleName!="") target.innerHTML = setAllTitleName;
                else target.innerHTML = self_dom.innerHTML;
            }
            _param[nowRtype] = value;
            now_parObj[nowRtype]["_default"] = _param[nowRtype];
            _self.dispatchEvent("autoBackParam",_param);

            if(mode==4 && now_parObj[nowRtype]["_setDiv"].classList.contains(now_parObj[nowRtype]["_viewClass"])){
                now_parObj[nowRtype]["_setDiv"].click();
            }

        }




        _self.chgRatio = function(e,_par){
            var rtype = _par.rtype;
            var group = _par.group;
            var now = _par.now;
            var titleView = _par.titleView;
            var titleMode = _par.titleMode;
            var allInput = _par.allInput;
            var allGroupDIv = _par.allGroupDIv;
            var className = _par._viewClass;
            var allValue =0;
            var id_str;
            var obj_ids;
            var contant = now_parObj[rtype]["_contantView"];
            for (var i=0;i<allGroupDIv.length;i++) {
                util.classFunc(allGroupDIv[i], className, "remove");
                allGroupDIv[i].children[0].children[0].checked=false;
            }
            util.classFunc(allGroupDIv[now], className);
            allGroupDIv[now].children[0].children[0].checked=true;

            for(var i=0;i<allInput.length;i++){
                if(allInput[i].type=="radio"){
                    allInput[i].disabled = false;
                }else{
                    allInput[i].disabled = true;
                }
            }

            if(group=="ALL"){
                id_str=","+group+"_input,";
                obj_ids =  util.getObjAry(contant,id_str);
                for(var key_sub in  obj_ids){
                    if(obj_ids[key_sub]){
                        obj_ids[key_sub].disabled = false;
                    }
                }
            }else{
                id_str=",";
                for(var i=0;i<now_parObj[rtype]["_list"].length;i++){
                    if(now_parObj[rtype]["_list"][i]!="ALL")id_str+=now_parObj[rtype]["_list"][i]+"_input,";
                }
                obj_ids =  util.getObjAry(contant,id_str);
                for(var key_sub in  obj_ids){
                    if(obj_ids[key_sub]){
                        obj_ids[key_sub].disabled = false;
                    }
                }
            }

            if(titleMode){
                if(group=="ALL"){
                    for(var key_sub in  obj_ids){
                        if(obj_ids[key_sub]){
                            allValue = obj_ids[key_sub].value;
                        }
                    }
                    titleView.style.display="";
                    // titleView.innerHTML = "> "+ allValue*1;
                    titleView.innerHTML = LS.get("filter_more")+" "+ allValue*1;
                }else{
                    titleView.style.display="";
                    var def_list =  _param[rtype]["listItem"];

                    if(now_parObj[rtype]["_list"].indexOf(def_list)!="-1"){
                        for(var key_sub in  obj_ids){
                            if(obj_ids[key_sub]){
                                // allValue = allInput[i].value;
                                if(obj_ids[key_sub].id ==def_list+"_input" ){
                                    titleView.innerHTML = LS.get("filter_more")+" " +obj_ids[key_sub].value*1;
                                    break;
                                }
                            }
                        }

                    }
                    else{
                        // titleView.innerHTML = "> ...";
                        titleView.innerHTML = LS.get("filter_more")+" " + "...";
                    }
                }
            }
            _param[rtype]["mode"] = group;
            now_parObj[rtype]["_default"] = _param[rtype];
            _self.dispatchEvent("autoBackParam",_param);
        }

        _self.chgcheckBox = function(e,_par){
            var status = _par.status;
            var rtype = _par.rtype;
            var id = _par.id;
            var title = _par.title;
            var searchItem = _par.searchItem;
            var searchDiv = _par.searchDiv;
            var limitCount = _par.limitCount;
            var titleMode = _par.titleMode;
            var chkBtnMode = _par.chkBtnMode;
            var setAllTitleName = _par.setAllTitleName;
            var setItemTitleName = _par.setItemTitleName;;
            var all_single = dom.getElementsByName(searchItem);
            var downlineStatus="NONE";
            var count=0;
            var  allcheck = searchDiv.getElementsByTagName("input")[0];
            if(status=="ALL"){
                for(var i=0;i<all_single.length;i++){
                    if(allcheck.checked==true){
                        all_single[i].checked = true;
                        all_single[i].disabled = true;
                        util.classFunc(all_single[i].parentNode.parentNode, "disabled");
                        downlineStatus="ALL";
                    }else{
                        all_single[i].checked= false;
                        all_single[i].disabled =false;
                        util.classFunc(all_single[i].parentNode.parentNode, "disabled","remove");
                        downlineStatus="ALL";
                    }
                }
            }else{
                var single = dom.getElementById(id);
                var single_checkbox = single.getElementsByTagName("input")[0];
                var tmpAry=[];
                    for(var i=0;i<all_single.length;i++){
                        all_single[i].disabled =false;
                        if(all_single[i].checked==true){
                            tmpAry.push(all_single[i].parentNode.parentNode.id.split("_")[1]);
                            count++;
                        }
                    }

                    /* //超過限制數量凍結選項
                    if(count>limitCount  && limitCount*1!=0){
                        for(var i=0;i<all_single.length;i++){
                            if(all_single[i].checked==false){
                                all_single[i].disabled =true;
                            }
                        }
                    }
                    */
                    if(count>limitCount && limitCount*1!=0){
                        tmpAry = tmpAry.filter(function(value){
                            return value != _par.id.split("_")[1];
                        });
                        single_checkbox.checked=false;
                        if(now_parObj[rtype]["_limitCountAlertMsg"]!=""){
                            _self.showErrorMsg("limitCount",now_parObj[rtype]["_limitCountAlertMsg"]);
                        }

                    }

                    if(tmpAry.length>0)	downlineStatus=tmpAry.join(",");
                    if(tmpAry.length == all_single.length){
                        // allcheck.checked=true; //全部勾選不要勾all
                        // downlineStatus="ALL";
                    }else{
                        allcheck.checked=false;
                    }
            }
            if(titleMode){
                if(downlineStatus=="ALL" || downlineStatus=="NONE"){
                    if(setAllTitleName!=""){
                        title.innerHTML=setAllTitleName;
                    }else{
                        var li_all =  searchDiv.getElementsByTagName("li")[0];
                        title.innerHTML=li_all.getElementsByTagName("tt")[0].innerHTML;
                    }
                }else{
                    title.innerHTML=setItemTitleName+ " ("+tmpAry.length+")";
                }
            }
            if(downlineStatus=="NONE")downlineStatus="ALL";
            if(chkBtnMode){
                _paramTmp[rtype] = downlineStatus;
            }else{
                _param[rtype]=downlineStatus;
                now_parObj[rtype]["_default"] = _param[rtype];
                _self.dispatchEvent("autoBackParam",_param);
            }


        }

        _self.searchItem = function(e,_par){
            var target = _par.target;
            var itemName = _par.item;
            var item = dom.getElementsByName(itemName);
            var reg = new RegExp("" + target.value + "","i");
            for(var i=0;i<item.length;i++){
                var value = item[i].value;
                var text = item[i].innerText;
                var searchMain = (value)? value:text;

                if(searchMain.match(reg) == null)item[i].parentNode.style.display="none";
                else item[i].parentNode.style.display="";

            }
        }

        _self.clearSearch = function(e,_par){
            var target = _par.target;
            var itemName = _par.item;
            target.value="";
            _self.searchItem(e,{"target":target,"item":itemName});

        }

        _self.getNowParam = function(type){
            if(_param[type]){
                return _param[type];
            }else{
                return _param;
            }
        }


        _self.autoBackParam = function(obj){
            alert("override take param");
            return obj;
        }

        _self.saveParam = function(e,_par){
            // {"rtyep":rtype,"icon":icon,"act":viewClass,"disappear":chkBtnDiv[key].disappear}
            var rtype = _par.rtype;
            var disappear = _par.disappear;
            var act = _par.act;
            var icon = _par.icon;

            if(disappear){
                util.classFunc(icon, act, "remove");
            }
            _param[rtype]= _paramTmp[rtype];
            now_parObj[rtype]["_default"] = _param[rtype];
            _self.dispatchEvent("autoBackParam",_param);
            if(_param[rtype]=="ALL"){
                _self.reDefault(rtype,"ALL","N");
            }
        }

        _self.resetIcon = function(e,_par){
            var rtype = _par.rtype;
            var disappear = _par.disappear;
            var act = _par.act;
            var icon = _par.icon;
            if(disappear){
                util.classFunc(icon, act, "remove");
            }
            var tmpObj = new Object();
            tmpObj[rtype] = now_parObj[rtype]["_default"];
            _self.reDefault(rtype,tmpObj[rtype],"N");
        }

        _self.reDefault=  function(_rtype,_def,isOut){
            isOut = isOut || "Y";
            if(!now_parObj[_rtype]){
                console.log("NO FILTER")
                return;
            }
            var key = _rtype;
            var mode = now_parObj[key]["mode"]
            var def = _def;
            var contant = now_parObj[key]["_contantView"];
            if(mode==1){

                var list = now_parObj[key]["_list"];
                var num = list.indexOf(def);
                if(num!=-1){
                    var defautitem =contant.getElementsByTagName("li")[num];
                    defautitem.click();
                }else{
                    var defautitem =contant.getElementsByTagName("li")[0];
                    defautitem.click();
                }
            }

            if(mode==2){
                var allGroupDIv = contant.children;
                var allInput = contant.getElementsByTagName("Input");
                var group =  now_parObj[key]["_group"];
                var titleView =  now_parObj[key]["_titleView"];

                var num = group.indexOf(def["mode"]);
                var preitem = def["listGold"];
                var tmpObj = new Object();

                for(var sub in preitem){
                    if(preitem[sub]*1 > 0) tmpObj[sub] = (preitem[sub])*1/1;
                    else  tmpObj[sub]=0;
                    if(dom.getElementById(sub+"_input"))dom.getElementById(sub+"_input").value = tmpObj[sub]*1;
                }
                _param[key]["listGold"] = tmpObj;
                if(def["listItem"])_param[key]["listItem"] = def["listItem"];
                else{
                    _param[key]["listItem"] = "";
                }

                if(num!=-1){
                    _self.chgRatio(null,{
                        "rtype": key, "group": group[num] ,"_viewClass": "wmc_stake_checked" ,
                        "mode":mode,
                        "allGroupDIv":allGroupDIv,
                        "titleView":titleView,
                        "titleMode":now_parObj[key]["title_mode"],
                        "allInput":allInput,
                        "now":num
                    });
                }else{
                    _param[key]["mode"] = def["mode"];
                    // now_parObj[key]["_default"] = _param[key];
                    _self.dispatchEvent("autoBackParam",_param);
                }
            }

            if(mode==3){
                var dataShow =  now_parObj[key]["_dataShowDiv"];
                var searchItem = now_parObj[key]["_searchItem"];
                var chkBtnMode =  now_parObj[key]["_chkBtnMode"];
                var all_single = dom.getElementsByName(searchItem);
                var allcheck = dataShow.getElementsByTagName("input")[0];
                def = def.toString();
                for(var i=0;i<all_single.length;i++){
                    all_single[i].checked =false;
                    all_single[i].disabled =false;
                }
                allcheck.checked = false;
                allcheck.disabled = false;

                if(def=="ALL"){
                    dataShow.getElementsByTagName("input")[0].click();
                }else if(def!=""){
                    var downlineIdAry = def.split(",");
                    for(var i =0;i<downlineIdAry.length;i++){
                        var downlineIdItem = dom.getElementById(key+"_"+downlineIdAry[i]);
                        if(downlineIdItem)downlineIdItem.getElementsByTagName("input")[0].click();
                        else{
                            dataShow.getElementsByTagName("input")[0].click();
                        }
                    }
                }

                if(chkBtnMode && isOut!="N"){
                    var chkBtnDiv = now_parObj[key]["_chkBtnDiv"];
                    chkBtnDiv.SAVE.div.click();
                }
            }

            if(mode==4){
                var dataShow =  now_parObj[key]["_dataShowDiv"];
                def = def.toString();
                if(def=="ALL"){
                    dataShow.getElementsByTagName("li")[0].click();
                }else if(def!=""){
                    var downlineIdAry = def.split(",");
                    for(var i =0;i<downlineIdAry.length;i++){
                        var downlineIdItem = dom.getElementById(key+"_"+downlineIdAry[i]);
                        if(downlineIdItem)downlineIdItem.click();
                        else dataShow.getElementsByTagName("li")[0].click();
                    }
                }
            }


        }


        _self.scrollToTop = function(rtype){
            now_parObj[rtype]["_contantView"].scrollTop=0;
        }

        _self.keep_credit=function(e){
            e.target.value = e.target.value.replace(/\D/g,'')*1;
        }

        _self.showErrorMsg = function(code, arr_data){
            if(code == "limitCount"){
                util.showErrorMsg(arr_data);
            }
        }

        _self.closeAllDownlist = function(){
            for(var key in now_parObj ){
                var icon = now_parObj[key]["_setDiv"];
                if(icon.classList.contains(now_parObj[key]["_viewClass"]))
                {
                    now_parObj[key]["_setDiv"].click();
                }

            }

        }



        _self.addEventListener=function(eventname, eventFunction){
            eventHandler[eventname] = eventFunction;
        }

        _self.dispatchEvent=function(eventname, param){
            if(eventHandler[eventname]) eventHandler[eventname](param);
        }


    }



}
