function util(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    _self.init = function() {};
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.addEvent = function(targetObj, eventName, fun, parObj, clean_old_sw) {
        if (typeof clean_old_sw == "undefined")
            clean_old_sw = true;
        try {
            var retFun = function(e) {
                fun(e, parObj)
            };
            if (targetObj.eventName == null)
                targetObj.eventName = new Array;
            else if (clean_old_sw)
                _self.removeEvent(targetObj, eventName);
            targetObj.eventName[eventName] = retFun;
            targetObj.addEventListener(eventName, retFun, false)
        } catch (ex) {
            try {
                targetObj.attachEvent("on" + eventName, retFun);
                if (targetObj.eventName == null)
                    targetObj.eventName = new Array;
                targetObj.eventName[eventName] = retFun
            } catch (exx) {}
        }
    };
    _self.removeEvent = function(targetObj, eventName) {
        if (targetObj.eventName == null)
            return;
        try {
            targetObj.removeEventListener(eventName, targetObj.eventName[eventName])
        } catch (ex) {
            try {
                targetObj.detachEvent("on" + eventName, targetObj.eventName[eventName])
            } catch (exx) {}
        }
    };
    _self.mergeArray = function() {
        var newArray = new Object;
        for (i = 0; i < arguments.length; i++)
            for (var key in arguments[i])
                newArray[key] = arguments[i][key];
        return newArray
    };
    _self.getProtocal = function() {
        return dom.location.protocol
    };
    _self.getWebDomain = function() {
        return dom.domain
    };
    _self.getWebUrl = function() {
        return _self.getProtocal() + "//" + _self.getWebDomain()
    };
    _self.goToIndex = function() {
        _self.topGoToUrl(_self.getWebUrl(), {
            "langx": top.langx
        })
    };
    _self.topGoToUrl = function(_url, par) {
        var tmpForm = document.createElement("form");
        tmpForm.action = _url;
        tmpForm.method = "POST";
        tmpForm.target = "_top";
        if (par)
            for (var keys in par) {
                var inp = document.createElement("input");
                inp.type = "hidden";
                inp.name = keys;
                inp.value = par[keys];
                tmpForm.appendChild(inp)
            }
        document.body.appendChild(tmpForm);
        tmpForm.submit()
    };
    _self.chkErrorMsg = function(errHash, LS_code) {
        if (errHash["status"] != null && errHash["status"] == "error")
            if (errHash["code"] != null && errHash["code"] == "4X014") {
                if (!top.doubleLogin) {
                    top.doubleLogin = true;
                    alert(LS_code.get(errHash["code"]))
                }
                _self.goToIndex();
                return true
            } else if (errHash["code"] != null && (errHash["code"].indexOf("clean_db") != -1 || errHash["code"].indexOf("m_rep") != -1)) {
            if (errHash["msg"])
                _self.showErrorMsg(errHash["msg"]);
            parentClass.dispatchEvent("showLoading", {
                "showLoading": false
            });
            return true
        }
        return false
    };
    _self.checkErrorCode = function(code, LS) {
        if (code == "doubleLogin") {
            alert(LS.get(code));
            _self.goToIndex();
            return false
        }
        if (code == "goToHome") {
            _self.goToIndex();
            return false
        }
        return true
    };
    _self.initOnBlurDiv = function(showObj, clickObj, clickFun, clickParam) {
        clickObj.tabIndex = 100;
        var param = new Object;
        param.showObj = showObj;
        param.clickObj = clickObj;
        param.clickFun = clickFun;
        param.clickParam = clickParam;
        _self.addEvent(clickObj, "blur", _self.onBlurEvent, param)
    };
    _self.onBlurEvent = function(e, param) {
        if (param.clickParam && param.clickParam.className)
            _self.classFunc(param.clickObj, param.clickParam.className, "remove")
    };
    _self.setInfEvent = function(icon, param) {
        param.info_mode != false ? param.info_mode = true : param.info_mode = false;
        param._focus.prev_scroll_lock = true;
        _self.addEvent(icon, "click", _self.showInfEvent, {
            "icon": icon,
            "param": param
        })
    };
    _self.showInfEvent = function(e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++)
            if (all[i] == e.target)
                return false;
        if (e.target == param._focus)
            return false;
        var top_node = util.getTopParentNode(param._focus, "DIV");
        if (param._setView.classList.contains(param._viewClass)) {
            param._setView.classList.remove(param._viewClass);
            if (param.info_mode)
                _self.removeEvent(param._focus, "click");
            _self.removeEvent(top_node, "mousedown");
            _self.removeEvent(top_node, "touchstart")
        } else {
            param._setView.classList.add(param._viewClass);
            if (param.info_mode)
                _self.addEvent(param._focus, "click", _self.closeInfElmt, param);
            _self.addEvent(top_node, "mousedown", _self.InfBlurEvent, _par);
            _self.addEvent(top_node, "touchstart", _self.InfBlurEvent, _par);
            param._focus.scrollTop = 0
        }
    };
    _self.InfBlurEvent = function(e, _par) {
        var icon = _par.icon;
        var param = _par.param;
        var mouseIN = false;
        var all = param._focus.getElementsByTagName("*");
        for (var i = 0, max = all.length; i < max; i++)
            if (all[i] == e.target)
                mouseIN = true;
        if (param._focus == e.target)
            mouseIN = true;
        if (!mouseIN) {
            var all = icon.getElementsByTagName("*");
            for (var i = 0, max = all.length; i < max; i++)
                if (all[i] == e.target)
                    return false;
            if (e.target == icon)
                return false;
            _self.closeInfElmt(null, param)
        }
    };
    _self.closeInfElmt = function(e, param) {
        dom.activeElement.blur();
        if (param._setView.classList.contains(param._viewClass))
            param._setView.classList.remove(param._viewClass);
        if (param._focus != null) {
            _self.removeEvent(param._focus, "click");
            var top_node = util.getTopParentNode(param._focus, "DIV");
            if (top_node != null) {
                _self.removeEvent(top_node, "mousedown");
                _self.removeEvent(top_node, "touchstart")
            }
        }
    };
    _self.clone = function(obj) {
        if (null == obj || typeof obj != "object")
            return obj;
        if (obj instanceof Date) {
            var copy = new Date;
            copy.setTime(obj.getTime());
            return copy
        }
        if (obj instanceof Array) {
            var copy = [];
            for (var i = 0, len = obj.length; i < len; ++i)
                copy[i] = _self.clone(obj[i]);
            return copy
        }
        if (obj instanceof Object) {
            var copy = {};
            for (var attr in obj)
                if (obj.hasOwnProperty(attr))
                    copy[attr] = _self.clone(obj[attr]);
            return copy
        }
        throw new Error("Unable to copy obj! Its type isn't supported.");
    };
    _self.showErrorMsg = function(msg) {
        _self.showMsg(msg, "N", null)
    };
    _self.showMsg = function(msg, _confirm, retFun) {
        parentClass.dispatchEvent("showAlertMsg", {
            "confirm": _confirm,
            "msg": msg,
            "retFun": retFun
        })
    };
    _self.showTxt = function(msg) {
        return !msg && typeof msg != "number" ? "" : msg
    };
    _self.echo = function(msg) {};
    _self.err = function(title, e) {
        _self.echo(title + "\n" + e.stack)
    };
    _self.formatThousand = function(num) {
        num = num + "";
        var tmp = num.split(".");
        num = tmp[0];
        num = num.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        if (tmp.length > 1)
            num = num + "." + tmp[1];
        return num
    };
    _self.mprintf = function(vals, fronts, points, comma, thousand) {
        var out = _self.printf(vals, fronts, points, comma);
        if (thousand)
            out = _self.formatThousand(out);
        return out
    };
    _self.printf = function(vals, fronts, points, comma) {
        vals = "" + vals;
        var cmd = new Array;
        cmd = vals.split(".");
        if (cmd.length > 1)
            if (cmd[1].length > points)
                if (points != 0) {
                    tmp = Math.pow(10, points * 1);
                    vals = Math.round(vals * tmp + 1E-4) / tmp;
                    vals = "" + vals;
                    cmd = vals.split(".")
                } else {
                    cmd = new Array(cmd[0]);
                    vals = cmd[0]
                }
        for (ii = 0; ii < fronts - cmd[0].length; ii++)
            vals = "0" + vals;
        if (comma) {
            valarr = vals.split(".");
            tmpval = valarr[0];
            for (ii = valarr[0].length; ii > 3; ii -= 3) {
                comma_index = ii - 3;
                strA = tmpval.substring(0, comma_index);
                strB = tmpval.substring(comma_index);
                tmpval = strA + "," + strB
            }
            if (valarr.length > 1)
                tmpval += "." + valarr[1];
            vals = tmpval
        }
        if (points > 0)
            if (cmd.length > 1)
                for (ii = 0; ii < points - cmd[1].length; ii++)
                    vals = vals + "0";
            else {
                vals = vals + ".";
                for (ii = 0; ii < points; ii++)
                    vals = vals + "0"
            }
        return vals
    };
    _self.getObjAry = function(tmpScreen, aryStr, attribute, isOnly) {
        var newAry = new Array;
        var _attribute = attribute;
        if (tmpScreen != null & aryStr != null) {
            if (_attribute == null)
                _attribute = "id";
            newAry = _self.getChildAry(tmpScreen.getElementsByTagName("*"), aryStr, newAry, _attribute, isOnly)
        }
        return newAry
    };
    _self.getChildAry = function(objAry, aryStr, newAry, attribute, isOnly) {
        for (var i = 0; i < objAry.length; i++) {
            var obj = objAry[i];
            var _id = obj.getAttribute(attribute);
            if (_id != null)
                if (aryStr.indexOf("," + _id + ",") != -1) {
                    if (attribute == "id")
                        newAry[_id] = obj;
                    else
                        newAry.push(obj);
                    if (isOnly)
                        return newAry
                }
        }
        return newAry
    };
    _self.getSpan = function(divObj, spanid) {
        return _self.getObj(divObj, spanid)
    };
    _self.getObj = function(divObj, tagID) {
        var obj = null;
        try {
            obj = divObj.children[tagID]
        } catch (e) {
            obj = null
        }
        return obj
    };
    _self.setObjectClass = function(targetObj, classStr) {
        if (targetObj.className != undefined)
            targetObj.className = classStr;
        else
            targetObj.setAttribute("class", classStr)
    };
    _self.getObjAbsolute_new = function(obj, stop_name) {
        var abs = new Object;
        abs["left"] = obj.offsetLeft;
        abs["top"] = obj.offsetTop;
        while (obj = obj.offsetParent) {
            if (_self.getStyle(obj, "position") == "relative")
                if (obj.id != "" && obj.offsetParent.id != "" && _self.getStyle(obj, "top") != "auto" && _self.getStyle(obj, "margin-top") != "auto" && _self.getStyle(obj, "margin-top") != "0px") {
                    abs["top"] += -obj.offsetTop;
                    continue
                }
            if (stop_name != undefined && obj.id == stop_name)
                break;
            else if (_self.getStyle(obj, "position") == "absolute")
                break;
            abs["left"] += obj.offsetLeft;
            abs["top"] += obj.offsetTop
        }
        return abs
    };
    _self.getStyle = function(oElm, strCssRule) {
        var strValue = "";
        if (document.defaultView && document.defaultView.getComputedStyle)
            strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
        else if (oElm.currentStyle) {
            strCssRule = strCssRule.replace(/\-(\w)/g, function(strMatch, p1) {
                return p1.toUpperCase()
            });
            strValue = oElm.currentStyle[strCssRule]
        } else
            return "error";
        return strValue
    };
    _self.checkFormat = function(msg, type) {
        var ret = null;
        var _msg = msg + "";
        switch (type) {
            case 0:
                ret = _msg.match("^[a-zA-Z0-9]*$");
                break;
            case 1:
                ret = _msg.match("^[0-9]*$");
                break;
            case 2:
                ret = _msg.match("^[a-zA-Z0-9]*$");
                if (ret) {
                    if (_msg.match("^[a-zA-Z]*$") || _msg.match("^[0-9]*$"))
                        ret = false;
                    if (_msg.length < 6 || _msg.length > 12)
                        ret = false
                }
                break;
            case 3:
                ret = !_msg.match(/[#%\^&\*\-='"\(\)~\[\]\/,!\+\|\}\{:;\?><`\\\u00a1\u2122\u00a3\u00a2\u221e\u00a7\u00b6\u2022\u00aa\u00ba\u2013\u2260\u00ab\u00e6\u00f7\u2265\u2264\u2026]/);
                break;
            default:
                ret = _msg.match("^[a-zA-Z0-9]*$");
                break
        }
        return ret ? true : false
    };
    _self.getKeyCode = function(e) {
        return win.event ? win.event.keyCode : e.which
    };
    _self.prevDefault = function(e) {
        if (e.preventDefault)
            e.preventDefault();
        else
            e.returnValue = false
    };
    _self.ChkKeyUser = function(target, FunParam) {
        if (_self.isAndroid())
            _self.addEvent(target, "input", _self.ChkInpKeyUser, FunParam);
        else
            _self.addEvent(target, "keypress", _self.ChkBoardKeyUser, FunParam)
    };
    _self.ChkBoardKeyUser = function(e, FunParam) {
        var _par = FunParam != null ? FunParam.param : null;
        if (FunParam != null)
            if (FunParam.initShow)
                FunParam.initShow(e, _par);
        var keyCode = _self.getKeyCode(e);
        if (keyCode == 13)
            _self.prevDefault(e);
        else if (keyCode == 8)
        ;
        else if ((keyCode < 48 || keyCode > 57) && (keyCode > 95 || keyCode < 106) && !(keyCode > 64 && keyCode < 91 || keyCode > 96 && keyCode < 123)) {
            _self.prevDefault(e);
            if (FunParam != null && FunParam.onErr)
                FunParam.onErr(e, _par)
        }
    };
    _self.ChkInpKeyUser = function(e, FunParam) {
        var _par = FunParam != null ? FunParam.param : null;
        if (FunParam != null)
            if (FunParam.initShow)
                FunParam.initShow(e, _par);
        var inCode = e.data;
        if (inCode != null)
            if (inCode.match(/[^a-zA-Z0-9]/)) {
                var St = e.target;
                var position = _self.getCaretPosition(St) - inCode.length;
                var result = St.value.split("");
                result.splice(position, inCode.length);
                St.value = result.join("");
                _self.setSelectionRange(e.target, position, position);
                if (FunParam != null && FunParam.onErr)
                    FunParam.onErr(e, _par)
            }
    };
    _self.ChkKeyAlias = function(target, FunParam) {
        if (_self.isAndroid())
            _self.addEvent(target, "input", _self.ChkInpKeyAlias, FunParam);
        else
            _self.addEvent(target, "keypress", _self.ChkBoardKeyAlias, FunParam)
    };
    _self.ChkBoardKeyAlias = function(e, FunParam) {
        var _par = FunParam != null ? FunParam.param : null;
        if (FunParam != null)
            if (FunParam.initShow)
                FunParam.initShow(e, _par);
        var keyCode = _self.getKeyCode(e);
        if (keyCode == 13)
            _self.prevDefault(e);
        else if (keyCode == 8 || keyCode == 36 || keyCode == 46 || keyCode == 64 || keyCode == 95)
        ;
        else if ((keyCode < 48 || keyCode > 57) && (keyCode > 95 || keyCode < 106) && !(keyCode > 64 && keyCode < 91 || keyCode > 96 && keyCode < 123)) {
            _self.prevDefault(e);
            if (FunParam != null && FunParam.onErr)
                FunParam.onErr(e, _par)
        }
    };
    _self.ChkInpKeyAlias = function(e, FunParam) {
        var _par = FunParam != null ? FunParam.param : null;
        if (FunParam != null)
            if (FunParam.initShow)
                FunParam.initShow(e, _par);
        var inCode = e.data;
        if (inCode != null)
            if (inCode.match(/[^a-zA-Z0-9.$@_\u4E00-\u9FA5]/)) {
                var St = e.target;
                var position = _self.getCaretPosition(St) - inCode.length;
                var result = St.value.split("");
                result.splice(position, inCode.length);
                St.value = result.join("");
                _self.setSelectionRange(e.target, position, position);
                if (FunParam != null && FunParam.onErr)
                    FunParam.onErr(e, _par)
            }
    };
    _self.ChkKeyCash = function(target, FunParam) {
        if (_self.isAndroid() || _self.isiPhone())
            _self.addEvent(target, "input", _self.ChkInpKeyCash, FunParam);
        else {
            _self.addEvent(target, "keydown", _self.ChkPasteKeyCash, FunParam);
            _self.addEvent(target, "keypress", _self.ChkBoardKeyCash, FunParam);
            _self.addEvent(target, "keyup", _self.doSucKeyCash, FunParam)
        }
    };
    _self.ChkPasteKeyCash = function(e, FunParam) {
        if ((e.ctrlKey || e.metaKey) && e.key === "v" || e.key == "Backspace")
            if (FunParam != null)
                FunParam.isCHK = true
    };
    _self.ChkBoardKeyCash = function(e, FunParam) {
        var _par = FunParam != null ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow)
                FunParam.initShow(e, _par);
            FunParam.isCHK = false
        }
        var keyCode = _self.getKeyCode(e);
        if (keyCode == 13) {
            _self.prevDefault(e);
            return false
        } else if (keyCode >= 48 && keyCode <= 57 || keyCode == 8)
        ;
        else if (keyCode < 96 || keyCode > 105) {
            if (FunParam != null && FunParam.onErr)
                FunParam.onErr(e, _par);
            _self.prevDefault(e);
            return false
        } else if (e.code || e.key) {
            var charCode = e.code || e.key;
            charCode = charCode.replace(/\D/g, "");
            if (charCode == "") {
                if (FunParam != null && FunParam.onErr)
                    FunParam.onErr(e, _par);
                _self.prevDefault(e);
                return false
            }
        }
        if (FunParam != null)
            FunParam.isCHK = true
    };
    _self.doSucKeyCash = function(e, FunParam) {
        var _par = FunParam != null ? FunParam.param : null;
        if (FunParam != null && FunParam.onSuc && FunParam.isCHK)
            FunParam.onSuc(e, _par)
    };
    _self.ChkInpKeyCash = function(e, FunParam) {
        var _par = FunParam != null ? FunParam.param : null;
        if (FunParam != null) {
            if (FunParam.initShow)
                FunParam.initShow(e, _par);
            FunParam.isCHK = false
        }
        var inCode = e.data;
        if (inCode != null)
            if (inCode.match(/[^0-9]/)) {
                if (FunParam != null && FunParam.onErr)
                    FunParam.onErr(e, _par);
                var St = e.target;
                var position = _self.getCaretPosition(St) - inCode.length;
                var result = St.value.split("");
                result.splice(position, inCode.length);
                St.value = result.join("");
                _self.setSelectionRange(e.target, position, position);
                return false
            }
        if (FunParam != null)
            FunParam.isCHK = true;
        if (FunParam != null && FunParam.onSuc)
            FunParam.onSuc(e, _par)
    };
    _self.Replace_credits = function(targetObj, credit_old, e) {
        var keyCode = _self.getKeyCode(e);
        var credit = targetObj.value.replace(/[^\d.]/g, "");
        if (credit != "" && credit == credit * 1) {
            credit = credit * 1;
            if (keyCode >= 37 && keyCode <= 40 || keyCode == 13)
                return true;
            targetObj.value = _self.mprintf(credit, 0, 0, false, false)
        } else
            targetObj.value = ""
    };
    _self.Replace_Input_credits = function(targetObj, credit_old, e) {
        var inCode = e.data;
        var credit = targetObj.value.replace(/[^\d.]/g, "");
        if (credit != "" && credit == credit * 1) {
            credit = credit * 1;
            targetObj.value = _self.mprintf(credit, 0, 0, false, false)
        } else
            targetObj.value = ""
    };
    _self.getCaretPosition = function(oField) {
        var iCaretPos = 0;
        if (document.selection) {
            oField.focus();
            var oSel = document.selection.createRange();
            oSel.moveStart("character", 0 - oField.value.length);
            iCaretPos = oSel.text.length
        } else if (oField.selectionStart || oField.selectionStart == "0")
            iCaretPos = oField.selectionStart;
        return iCaretPos
    };
    _self.setSelectionRange = function(input, selectionStart, selectionEnd) {
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(selectionStart, selectionStart)
        } else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd("character", selectionEnd);
            range.moveStart("character", selectionStart);
            range.select()
        }
    };
    _self.classFunc = function(dom, c, a) {
        a = a || "";
        if (!Array.isArray)
            Array.isArray = function(arg) {
                return Object.prototype.toString.call(arg) === "[object Array]"
            };
        if (!(typeof c == "string") && !Array.isArray(c))
            return;
        var o = dom.className.split(" ");
        if (!Array.isArray(c))
            c = c.split(" ");
        Array.prototype.push.apply(o, c);
        o = _self.unique(o);
        if (a == "remove") {
            var z = JSON.parse(JSON.stringify(c));
            for (var i = 0, len = z.length; i < len; i++) {
                var ind = o.indexOf(z[i]);
                if (ind != -1)
                    o.splice(ind, 1)
            }
        }
        dom.className = o.join(" ")
    };
    _self.unique = function(array) {
        var r = [];
        for (var i = 0, l = array.length; i < l; i++) {
            for (var j = i + 1; j < l; j++)
                if (array[i] === array[j])
                    j = ++i;
            r.push(array[i])
        }
        return r
    };
    _self.isIE = function() {
        if (win.navigator.userAgent.toUpperCase().indexOf("MSIE") != -1)
            return true;
        return false
    };
    _self.isAndroid = function() {
        if (win.navigator.userAgent.toUpperCase().indexOf("ANDROID") != -1)
            return true;
        return false
    };
    _self.isiPhone = function() {
        if (win.navigator.userAgent.toUpperCase().indexOf("IPHONE") != -1)
            return true;
        return false
    };
    _self.checkScrollToHide = function(e, targetObj) {
        var newScrollTop = e.target.scrollTop;
        if (newScrollTop > 0)
            targetObj["backtop"].style.display = "";
        else if (newScrollTop <= 0)
            targetObj["backtop"].style.display = "none"
    };
    _self.str_chk = function(str) {
        var str_char = 0;
        var str_char_B = 0;
        var str_char_S = 0;
        var arr_char = new Array;
        var str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            var tmp_str = str.substr(i, 1);
            if (tmp_str.match(/[A-Z]/))
                str_char_B++;
            if (tmp_str.match(/[a-z]/))
                str_char_S++;
            arr_char[tmp_str] = true
        }
        if (str_len < 8 || str_len > 16)
            return "err_length";
        if (!str.match(/^[a-zA-Z0-9]*$/))
            return "err_combination";
        if (str.match(/\s/) || str.match(/_/) || str.match(/\^/))
            return "err_contain";
        if (Object.keys(arr_char).length <= 3)
            return "err_charactersNum";
        var arr_block_string = new Array("qwe12345", "12345qwe");
        if (arr_block_string.indexOf(str.toLowerCase()) >= 0)
            return "err_block_string";
        str_char = str_char_B + str_char_S;
        if (str_char_B > 0 && str_char_S > 0 && str_len > str_char)
            return "chk_OK";
        else
            return "chk_wrong"
    };
    _self.str_chk_mem = function(str, EngNeed) {
        var str_char = 0;
        var arr_char = new Array;
        var str_len = str.length;
        for (var i = 0; i < str_len; i++) {
            var tmp_str = str.substr(i, 1);
            if (tmp_str.match(/[A-Za-z]/))
                str_char++;
            arr_char[tmp_str] = true
        }
        if (str_len < 6 || str_len > 12)
            return "err_length";
        if (!str.match(/^[a-zA-Z0-9]*$/))
            return "err_combination";
        if (str.match(/\s/) || str.match(/_/) || str.match(/\^/))
            return "err_contain";
        if (Object.keys(arr_char).length <= 2)
            return "err_charactersNum";
        var arr_block_string = new Array("abc111", "abc222", "abc333", "abc444", "abc555", "abc666", "abc777", "abc888", "abc999", "abc000", "111abc", "222abc", "333abc", "444abc", "555abc", "666abc", "777abc", "888abc", "999abc", "000abc", "abc123", "123abc", "aaa123", "123aaa", "aaa1234", "1234aaa", "aa1234", "1234aa", "aa12345", "12345aa", "bbb123", "123bbb", "bbb1234", "1234bbb", "bb1234", "1234bb", "bb12345", "12345bb", "ccc123", "123ccc", "ccc1234", "1234ccc", "cc1234", "1234cc", "cc12345", "12345cc", "qwe123", "123qwe", "qwe1234", "1234qwe", "qwe12345", "12345qwe");
        if (arr_block_string.indexOf(str.toLowerCase()) >= 0)
            return "err_block_string";
        if (str_char >= EngNeed && str_len > str_char)
            return "chk_OK";
        else
            return "chk_wrong"
    };
    _self.in_array = function(txt, ary) {
        for (var i = 0; i < ary.length; i++)
            if (ary[i] == txt)
                return true;
        return false
    };
    _self.isUCBrowser = function() {
        return navigator.userAgent.indexOf("UCBrowser") != -1 ? true : false
    };
    _self.extendsClass = function(parentClass, childClass, _win, _dom, _postHash) {
        childClass.prototype = parentClass;
        objClass = new childClass(_win, _dom, _postHash);
        objClass._super = parentClass;
        return objClass
    };
    _self.checkReportTeach = function(cookie, parentClass) {};
    _self.isIE = function() {
        if (window.navigator.userAgent.toUpperCase().indexOf("MSIE") != -1)
            return true;
        return false
    };
    _self.filterBig = function(_win, _dom) {
        var _self = this;
        var win = _win;
        var dom = _dom;
        var util;
        var parentClass;
        var eventHandler = new Object;
        var _param = new Object;
        var _paramTmp = new Object;
        var now_parObj = new Object;
        var LS;
        _Mode = new Object;
        _Mode["mode_1"] = new Object;
        _Mode["mode_1"]["_config"] = {
            "mode": 1,
            "info_mode": true,
            "title_mode": true,
            "_setDiv": null,
            "_titleView": null,
            "_contantView": null,
            "_viewClass": "active",
            "_chkClass": "on",
            "_list": ["ALL", "FT", "BK", "ES", "TN", "VB", "BM", "TT", "BS", "SK", "OP", "FS"],
            "_listSub": ["ALL", "Soccer", "BK", "ES", "TN", "VB", "BM", "TT", "BS", "SK", "OP", "FS"],
            "_act": true,
            "_default": "ALL",
            "_setAllTitleName": ""
        };
        _Mode["mode_2"] = new Object;
        _Mode["mode_2"]["_config"] = {
            "mode": 2,
            "info_mode": false,
            "title_mode": true,
            "_setDiv": null,
            "_titleView": null,
            "_contantView": null,
            "_type": null,
            "_viewClass": "active",
            "_group": ["ALL,PER"],
            "_list": ["ALL", "FT", "BK", "ES", "TN", "VB", "BM", "TT", "BS", "SK", "OP", "FS"],
            "_act": true,
            "_default": {
                "mode": "ALL",
                "listGold": {
                    "ALL": 0,
                    "FT": 0,
                    "BK": 0,
                    "ES": 0,
                    "TN": 0,
                    "VB": 0,
                    "BM": 0,
                    "TT": 0,
                    "BS": 0,
                    "SK": 0,
                    "OP": 0,
                    "FS": 0
                },
                "listItem": ""
            }
        };
        _Mode["mode_3"] = new Object;
        _Mode["mode_3"]["_config"] = {
            "mode": 3,
            "info_mode": true,
            "title_mode": true,
            "_setDiv": null,
            "_titleView": null,
            "_contantView": null,
            "_data": null,
            "_viewClass": "active",
            "_list": ["ALL", "FT", "BK", "ES", "TN", "VB", "BM", "TT", "BS", "SK", "OP", "FS"],
            "_act": true,
            "_default": "ALL",
            "_limitCount": 5,
            "_limitCountAlertMsg": "",
            "_searchOpen": true,
            "_searchItem": "downlineID",
            "_searchDiv": null,
            "_dataShowDiv": null,
            "_breakpoint": [{
                "div": null,
                "amount": 12
            }],
            "_chkBtnMode": false,
            "_chkBtnDiv": {
                "SAVE": {
                    "div": null,
                    "disappear": true
                },
                "CANCEL": {
                    "div": null,
                    "disappear": true
                }
            },
            "_setAllTitleName": "",
            "_setItemTitleName": ""
        };
        _Mode["mode_4"] = new Object;
        _Mode["mode_4"]["_config"] = {
            "mode": 4,
            "info_mode": false,
            "title_mode": true,
            "_setDiv": null,
            "_titleView": null,
            "_contantView": null,
            "_dataShowDiv": null,
            "_data": null,
            "_viewClass": "active",
            "_chkClass": "on",
            "_act": true,
            "_default": "ALL",
            "_searchOpen": true,
            "_searchItem": "leagueID",
            "_searchDiv": null,
            "_breakpoint": [{
                "div": null,
                "amount": 12
            }],
            "_setAllTitleName": ""
        };
        _self.addEventListenEvent = function() {
            _self.addEventListener("getNowParam", _self.getNowParam);
            _self.addEventListener("autoBackParam", _self.autoBackParam)
        };
        _self.init = function(parObj) {
            for (var key in parObj) {
                var chosen_mode = parObj[key].mode;
                var mode = _Mode["mode_" + chosen_mode];
                if (mode) {
                    var tmpObj = new Object;
                    for (var item in mode["_config"])
                        if (typeof parObj[key][item] !== "undefined")
                            tmpObj[item] = parObj[key][item];
                        else
                            tmpObj[item] = mode["_config"][item];
                    if (tmpObj._act) {
                        now_parObj[key] = tmpObj;
                        _param[key] = new Object;
                        if (mode * 1 == 3)
                            _paramTmp[key] = new Object
                    }
                } else
                ;
            }
            _self.initDiv(now_parObj)
        };
        _self.setParentclass = function(_parentclass) {
            parentClass = _parentclass;
            util = parentClass.getThis("util");
            LS = parentClass.getThis("LS")
        };
        _self.reinit = function(parObj) {
            var tmpParObj = new Object;
            for (var key in parObj)
                if (typeof now_parObj[key] !== "undefined") {
                    tmpParObj[key] = new Object;
                    for (var item in now_parObj[key])
                        if (typeof parObj[key][item] !== "undefined")
                            tmpParObj[key][item] = parObj[key][item];
                        else
                            tmpParObj[key][item] = now_parObj[key][item];
                    now_parObj[key] = tmpParObj[key]
                }
            _self.initDiv(tmpParObj)
        };
        _self.returnSet = function() {
            return _set
        };
        _self.initDiv = function(nowParObj) {
            for (var key in nowParObj) {
                if (!key || !nowParObj[key])
                    return;
                var icon = nowParObj[key]["_setDiv"];
                var contant = nowParObj[key]["_contantView"];
                var list = nowParObj[key]["_list"];
                var defaultValue = nowParObj[key]["_default"];
                var mode = nowParObj[key]["mode"];
                var viewClass = nowParObj[key]["_viewClass"];
                var titleView = nowParObj[key]["_titleView"];
                if (mode == 1) {
                    var frag = dom.createDocumentFragment();
                    for (var item in list) {
                        var sample = contant.children[0].cloneNode(true);
                        sample.id = key + "_" + list[item];
                        sample.value = list[item];
                        sample.innerHTML = nowParObj[key]["_listSub"][item];
                        frag.appendChild(sample)
                    }
                    while (contant.firstChild)
                        contant.removeChild(contant.firstChild);
                    contant.appendChild(frag);
                    _self.setlistClick(mode, contant, titleView, key, list, nowParObj[key]["_chkClass"], nowParObj[key].title_mode, "");
                    _self.reDefault(key, defaultValue)
                } else if (mode == 2) {
                    var allGroupDIv = contant.children;
                    var allInput = contant.getElementsByTagName("Input");
                    var group = nowParObj[key]["_group"];
                    for (var i = 0; i < allGroupDIv.length; i++)
                        util.addEvent(allGroupDIv[i], "change", _self.chgRatio, {
                            "rtype": key,
                            "group": group[i],
                            "_viewClass": "wmc_stake_checked",
                            "mode": mode,
                            "allGroupDIv": allGroupDIv,
                            "titleView": titleView,
                            "titleMode": nowParObj[key]["title_mode"],
                            "allInput": allInput,
                            "now": i
                        });
                    var id_str = ",";
                    for (var i = 0; i < list.length; i++)
                        id_str += list[i] + "_input,";
                    var obj_ids = util.getObjAry(contant, id_str);
                    for (var key_sub in obj_ids)
                        if (obj_ids[key_sub])
                            util.addEvent(obj_ids[key_sub], "input", _self.keep_credit, {
                                "target": obj_ids[key_sub]
                            });
                    _self.reDefault(key, defaultValue)
                } else if (mode == 3) {
                    var data = nowParObj[key]["_data"];
                    var dataShow = nowParObj[key]["_dataShowDiv"];
                    var searchItem = nowParObj[key]["_searchItem"];
                    var frag = dom.createDocumentFragment();
                    var searchOpen = nowParObj[key]["_searchOpen"];
                    var searchDiv = nowParObj[key]["_searchDiv"];
                    var limitCount = nowParObj[key]["_limitCount"];
                    var title_mode = nowParObj[key]["title_mode"];
                    var breakpoint = nowParObj[key]["_breakpoint"];
                    var chkBtnMode = nowParObj[key]["_chkBtnMode"];
                    var setAllTitleName = nowParObj[key]["_setAllTitleName"];
                    var setItemTitleName = nowParObj[key]["_setItemTitleName"];
                    var limitCountAlertMsg = LS.get("filter_err_" + key + "_max");
                    var now_count = 0;
                    var point_count = 0;
                    var txt_addclass = "";
                    if (key == "downline") {
                        txt_addclass = " spFont";
                        searchDiv.getElementsByTagName("input")[0].classList.add("spFont")
                    }
                    dataShow.children[0].getElementsByTagName("input")[0].checked = false;
                    for (var prop in data) {
                        var id = data[prop]["id"];
                        var alias = data[prop]["alias"];
                        var username = data[prop]["username"];
                        var sample = dataShow.children[0].cloneNode(true);
                        var label = sample.getElementsByTagName("label")[0];
                        var input = sample.getElementsByTagName("input")[0];
                        var txt = label.getElementsByTagName("tt")[0];
                        input.name = searchItem;
                        input.value = username;
                        txt.className = "wmc_search_chkTxt" + txt_addclass;
                        txt.innerHTML = username + "<br><tt class='word_gray'>" + alias + "</tt>";
                        sample.id = key + "_" + id;
                        if (breakpoint[point_count])
                            if (now_count * 1 == breakpoint[point_count].amount * 1 || id == "00000") {
                                frag.appendChild(breakpoint[point_count].div);
                                breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
                                point_count++
                            }
                        if (id == "00000")
                            continue;
                        frag.appendChild(sample);
                        now_count++
                    }
                    for (var i = point_count; i < breakpoint.length; i++) {
                        frag.appendChild(breakpoint[i].div);
                        breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true)
                    }
                    while (dataShow.children[0] != dataShow.children[dataShow.children.length * 1 - 1])
                        dataShow.removeChild(dataShow.children[dataShow.children.length * 1 - 1]);
                    dataShow.appendChild(frag);
                    var allTagLi = dataShow.getElementsByTagName("li");
                    var searchItemDiv = dataShow;
                    var status = "";
                    for (var i = 0; i < allTagLi.length; i++)
                        if (allTagLi[i].children.length > 0) {
                            var checkBox = allTagLi[i].getElementsByTagName("input")[0];
                            allTagLi[i].id ? status = "single" : status = "ALL";
                            util.addEvent(checkBox, "click", _self.chgcheckBox, {
                                "id": allTagLi[i].id,
                                "status": status,
                                "rtype": key,
                                "title": titleView,
                                "searchItem": searchItem,
                                "searchDiv": searchItemDiv,
                                "limitCount": limitCount,
                                "titleMode": title_mode,
                                "chkBtnMode": chkBtnMode,
                                "setAllTitleName": setAllTitleName,
                                "setItemTitleName": setItemTitleName
                            })
                        }
                    if (searchOpen) {
                        var text = searchDiv.getElementsByTagName("input")[0];
                        var clearBtn = searchDiv.getElementsByTagName("input")[1];
                        util.addEvent(text, "input", _self.searchItem, {
                            "target": text,
                            "item": searchItem
                        });
                        util.addEvent(clearBtn, "click", _self.clearSearch, {
                            "target": text,
                            "item": searchItem
                        })
                    } else
                        searchDiv.style.display = "none";
                    if (typeof limitCountAlertMsg !== "undefined" && limitCountAlertMsg != "")
                        now_parObj[key]["_limitCountAlertMsg"] = limitCountAlertMsg.replace(new RegExp("\\*LIMITCOUNT\\*", "gi"), limitCount);
                    _self.reDefault(key, defaultValue);
                    if (chkBtnMode) {
                        var chkBtnDiv = nowParObj[key]["_chkBtnDiv"];
                        for (var btn in chkBtnDiv) {
                            if (btn == "SAVE")
                                util.addEvent(chkBtnDiv[btn].div, "click", _self.saveParam, {
                                    "rtype": key,
                                    "icon": icon,
                                    "act": viewClass,
                                    "disappear": chkBtnDiv[btn].disappear
                                });
                            if (btn == "CANCEL")
                                util.addEvent(chkBtnDiv[btn].div, "click", _self.resetIcon, {
                                    "rtype": key,
                                    "icon": icon,
                                    "act": viewClass,
                                    "disappear": chkBtnDiv[btn].disappear
                                })
                        }
                    }
                } else if (mode == 4) {
                    var data = nowParObj[key]["_data"];
                    var dataShow = nowParObj[key]["_dataShowDiv"];
                    var searchItem = nowParObj[key]["_searchItem"];
                    var frag = dom.createDocumentFragment();
                    var searchOpen = nowParObj[key]["_searchOpen"];
                    var searchDiv = nowParObj[key]["_searchDiv"];
                    var limitCount = nowParObj[key]["_limitCount"];
                    var breakpoint = nowParObj[key]["_breakpoint"];
                    var setAllTitleName = nowParObj[key]["_setAllTitleName"];
                    var now_count = 0;
                    var point_count = 0;
                    for (var prop in data) {
                        var id = data[prop]["id"];
                        var name = data[prop]["name"];
                        var sample = dataShow.children[0].cloneNode(true);
                        sample.id = key + "_" + id;
                        sample.children[0].setAttribute("name", searchItem);
                        sample.children[0].innerHTML = name;
                        if (breakpoint[point_count])
                            if (now_count * 1 == breakpoint[point_count].amount * 1 || id == "00000") {
                                frag.appendChild(breakpoint[point_count].div);
                                breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true);
                                point_count++
                            }
                        if (id == "00000")
                            continue;
                        frag.appendChild(sample);
                        now_count++
                    }
                    for (var i = point_count; i < breakpoint.length; i++) {
                        frag.appendChild(breakpoint[i].div);
                        breakpoint[point_count].div = breakpoint[point_count].div.cloneNode(true)
                    }
                    while (dataShow.children[0] != dataShow.children[dataShow.children.length * 1 - 1])
                        dataShow.removeChild(dataShow.children[dataShow.children.length * 1 - 1]);
                    dataShow.children[0].id = key + "_ALL";
                    dataShow.appendChild(frag);
                    if (searchOpen) {
                        var text = searchDiv.getElementsByTagName("input")[0];
                        var clearBtn = searchDiv.getElementsByTagName("input")[1];
                        util.addEvent(text, "input", _self.searchItem, {
                            "target": text,
                            "item": searchItem
                        });
                        util.addEvent(clearBtn, "click", _self.clearSearch, {
                            "target": text,
                            "item": searchItem
                        })
                    } else
                        searchDiv.style.display = "none";
                    _self.setlistClick(mode, contant, titleView, key, null, nowParObj[key]["_chkClass"], nowParObj[key].title_mode, setAllTitleName);
                    _self.reDefault(key, defaultValue)
                }
                if (viewClass != "")
                    util.addEvent(icon, "click", _self.showInfEventTEST, {
                        "icon": icon,
                        "param": {
                            "_focus": contant,
                            "_setView": icon,
                            "_viewClass": viewClass,
                            "info_mode": now_parObj[key]["info_mode"],
                            "rtype": key,
                            "mode": mode
                        }
                    })
            }
        };
        _self.showInfEventTEST = function(e, _par) {
            var icon = _par.icon;
            var param = _par.param;
            var all = param._focus.getElementsByTagName("*");
            var close_self = false;
            for (var i = 0, max = all.length; i < max; i++)
                if (all[i] == e.target)
                    return false;
            if (e.target == param._focus)
                return false;
            if (param._setView.classList.contains(param._viewClass)) {
                param._setView.classList.remove(param._viewClass);
                close_self = true;
                if (param.info_mode)
                    util.removeEvent(param._focus, "click");
                var top_node = util.getTopParentNode(param._focus, "DIV");
                util.removeEvent(top_node, "mousedown");
                util.removeEvent(top_node, "touchstart");
                if (param.mode == 2) {
                    var tmpObj = new Object;
                    var list = now_parObj[param.rtype]["_list"];
                    var id_str = ",";
                    for (var i = 0; i < list.length; i++)
                        id_str += list[i] + "_input,";
                    var obj_ids = util.getObjAry(param._setView, id_str);
                    for (var key_sub in obj_ids)
                        if (obj_ids[key_sub]) {
                            var itemType = key_sub.split("_")[0];
                            var itemGold = obj_ids[key_sub].value * 1;
                            tmpObj[itemType] = itemGold
                        }
                    _param[param.rtype]["listGold"] = tmpObj;
                    now_parObj[param.rtype]["_default"] = _param[param.rtype];
                    _self.dispatchEvent("autoBackParam", _param)
                } else if (param.mode == 3) {
                    var chkBtnMode = now_parObj[param.rtype]["_chkBtnMode"];
                    if (chkBtnMode) {
                        if (close_self) {
                            var chkBtnDiv = now_parObj[param.rtype]["_chkBtnDiv"];
                            chkBtnDiv.CANCEL.div.click()
                        }
                    } else if (_param[param.rtype] == "ALL")
                        _self.reDefault(param.rtype, "ALL")
                }
            } else {
                param._setView.classList.add(param._viewClass);
                if (param.info_mode)
                    util.addEvent(param._focus, "click", _self.closeInfElmtTEST, param);
                var top_node = util.getTopParentNode(param._focus, "DIV");
                util.addEvent(top_node, "mousedown", _self.InfBlurEventTEST, _par);
                util.addEvent(top_node, "touchstart", _self.InfBlurEventTEST, _par);
                _self.scrollToTop(param.rtype)
            }
        };
        _self.InfBlurEventTEST = function(e, _par) {
            var icon = _par.icon;
            var param = _par.param;
            var mouseIN = false;
            var all = param._focus.getElementsByTagName("*");
            for (var i = 0, max = all.length; i < max; i++)
                if (all[i] == e.target)
                    mouseIN = true;
            if (param._focus == e.target)
                mouseIN = true;
            if (!mouseIN) {
                var all = icon.getElementsByTagName("*");
                for (var i = 0, max = all.length; i < max; i++)
                    if (all[i] == e.target)
                        return false;
                if (e.target == icon)
                    return false;
                _self.closeInfElmtTEST(null, param)
            }
        };
        _self.closeInfElmtTEST = function(e, param) {
            dom.activeElement.blur();
            var close_outside = false;
            if (param._setView.classList.contains(param._viewClass)) {
                param._setView.classList.remove(param._viewClass);
                close_outside = true
            }
            util.removeEvent(param._focus, "click");
            var top_node = util.getTopParentNode(param._focus, "DIV");
            util.removeEvent(top_node, "mousedown");
            util.removeEvent(top_node, "touchstart");
            if (param.mode == 2) {
                var tmpObj = new Object;
                var list = now_parObj[param.rtype]["_list"];
                var id_str = ",";
                var itemGold_ALL = 0;
                for (var i = 0; i < list.length; i++)
                    id_str += list[i] + "_input,";
                var obj_ids = util.getObjAry(param._setView, id_str);
                for (var key_sub in obj_ids)
                    if (obj_ids[key_sub]) {
                        var itemType = key_sub.split("_")[0];
                        var itemGold = obj_ids[key_sub].value * 1;
                        tmpObj[itemType] = itemGold;
                        if (itemType == "ALL")
                            itemGold_ALL = itemGold
                    }
                _param[param.rtype]["listGold"] = tmpObj;
                now_parObj[param.rtype]["_default"] = _param[param.rtype];
                _self.dispatchEvent("autoBackParam", _param);
                if (dom.getElementById("ALL_radio").checked)
                    dom.getElementById("stake_now").innerHTML = LS.get("filter_more") + " " + itemGold_ALL
            } else if (param.mode == 3) {
                var chkBtnMode = now_parObj[param.rtype]["_chkBtnMode"];
                if (chkBtnMode) {
                    if (close_outside) {
                        var chkBtnDiv = now_parObj[param.rtype]["_chkBtnDiv"];
                        chkBtnDiv.CANCEL.div.click()
                    }
                } else if (_param[param.rtype] == "ALL")
                    _self.reDefault(param.rtype, "ALL")
            }
        };
        _self.setlistClick = function(mode, contant, titleView, nowRtype, list, chkClass, titleMode, setAllTitleName) {
            var contant = contant;
            var mode = mode;
            var all = contant.getElementsByTagName("li");
            if (mode == 1)
                for (var i = 0; i < all.length; i++) {
                    var tmpObj = new Object;
                    tmpObj["target"] = titleView;
                    tmpObj["mode"] = mode;
                    tmpObj["sel_dom"] = all[i];
                    tmpObj["value"] = list[i];
                    tmpObj["nowRtype"] = nowRtype;
                    tmpObj["chkClass"] = chkClass;
                    tmpObj["all"] = all;
                    tmpObj["sel"] = all[i];
                    tmpObj["titleMode"] = titleMode;
                    tmpObj["setAllTitleName"] = "";
                    util.addEvent(all[i], "click", _self.chgInfTitleTEST, tmpObj)
                }
            else if (mode == 4)
                for (var i = 0; i < all.length; i++)
                    if (all[i].children[0]) {
                        var tmpObj = new Object;
                        tmpObj["target"] = titleView;
                        tmpObj["mode"] = mode;
                        tmpObj["sel_dom"] = all[i].children[0];
                        tmpObj["value"] = all[i].id.split("_")[1];
                        tmpObj["nowRtype"] = nowRtype;
                        tmpObj["chkClass"] = chkClass;
                        tmpObj["all"] = all;
                        tmpObj["sel"] = all[i];
                        tmpObj["titleMode"] = titleMode;
                        if (i == 0 && setAllTitleName != "")
                            tmpObj["setAllTitleName"] = setAllTitleName;
                        else
                            tmpObj["setAllTitleName"] = "";
                        util.addEvent(all[i], "click", _self.chgInfTitleTEST, tmpObj)
                    }
        };
        _self.chgInfTitleTEST = function(e, _par) {
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
            for (var i = 0; i < all.length; i++)
                util.classFunc(all[i], chkClass, "remove");
            util.classFunc(sel, chkClass);
            if (titleMode)
                if (setAllTitleName != "")
                    target.innerHTML = setAllTitleName;
                else
                    target.innerHTML = self_dom.innerHTML;
            _param[nowRtype] = value;
            now_parObj[nowRtype]["_default"] = _param[nowRtype];
            _self.dispatchEvent("autoBackParam", _param);
            if (mode == 4 && now_parObj[nowRtype]["_setDiv"].classList.contains(now_parObj[nowRtype]["_viewClass"]))
                now_parObj[nowRtype]["_setDiv"].click()
        };
        _self.chgRatio = function(e, _par) {
            var rtype = _par.rtype;
            var group = _par.group;
            var now = _par.now;
            var titleView = _par.titleView;
            var titleMode = _par.titleMode;
            var allInput = _par.allInput;
            var allGroupDIv = _par.allGroupDIv;
            var className = _par._viewClass;
            var allValue = 0;
            var id_str;
            var obj_ids;
            var contant = now_parObj[rtype]["_contantView"];
            for (var i = 0; i < allGroupDIv.length; i++) {
                util.classFunc(allGroupDIv[i], className, "remove");
                allGroupDIv[i].children[0].children[0].checked = false
            }
            util.classFunc(allGroupDIv[now], className);
            allGroupDIv[now].children[0].children[0].checked = true;
            for (var i = 0; i < allInput.length; i++)
                if (allInput[i].type == "radio")
                    allInput[i].disabled = false;
                else
                    allInput[i].disabled = true;
            if (group == "ALL") {
                id_str = "," + group + "_input,";
                obj_ids = util.getObjAry(contant, id_str);
                for (var key_sub in obj_ids)
                    if (obj_ids[key_sub])
                        obj_ids[key_sub].disabled = false
            } else {
                id_str = ",";
                for (var i = 0; i < now_parObj[rtype]["_list"].length; i++)
                    if (now_parObj[rtype]["_list"][i] != "ALL")
                        id_str += now_parObj[rtype]["_list"][i] + "_input,";
                obj_ids = util.getObjAry(contant, id_str);
                for (var key_sub in obj_ids)
                    if (obj_ids[key_sub])
                        obj_ids[key_sub].disabled = false
            }
            if (titleMode)
                if (group == "ALL") {
                    for (var key_sub in obj_ids)
                        if (obj_ids[key_sub])
                            allValue = obj_ids[key_sub].value;
                    titleView.style.display = "";
                    titleView.innerHTML = LS.get("filter_more") + " " + allValue * 1
                } else {
                    titleView.style.display = "";
                    var def_list = _param[rtype]["listItem"];
                    if (now_parObj[rtype]["_list"].indexOf(def_list) != "-1")
                        for (var key_sub in obj_ids) {
                            if (obj_ids[key_sub])
                                if (obj_ids[key_sub].id == def_list + "_input") {
                                    titleView.innerHTML = LS.get("filter_more") + " " + obj_ids[key_sub].value * 1;
                                    break
                                }
                        }
                    else
                        titleView.innerHTML = LS.get("filter_more") + " " + "..."
                }
            _param[rtype]["mode"] = group;
            now_parObj[rtype]["_default"] = _param[rtype];
            _self.dispatchEvent("autoBackParam", _param)
        };
        _self.chgcheckBox = function(e, _par) {
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
            var setItemTitleName = _par.setItemTitleName;
            var all_single = dom.getElementsByName(searchItem);
            var downlineStatus = "NONE";
            var count = 0;
            var allcheck = searchDiv.getElementsByTagName("input")[0];
            if (status == "ALL")
                for (var i = 0; i < all_single.length; i++)
                    if (allcheck.checked == true) {
                        all_single[i].checked = true;
                        all_single[i].disabled = true;
                        util.classFunc(all_single[i].parentNode.parentNode, "disabled");
                        downlineStatus = "ALL"
                    } else {
                        all_single[i].checked = false;
                        all_single[i].disabled = false;
                        util.classFunc(all_single[i].parentNode.parentNode, "disabled", "remove");
                        downlineStatus = "ALL"
                    }
            else {
                var single = dom.getElementById(id);
                var single_checkbox = single.getElementsByTagName("input")[0];
                var tmpAry = [];
                for (var i = 0; i < all_single.length; i++) {
                    all_single[i].disabled = false;
                    if (all_single[i].checked == true) {
                        tmpAry.push(all_single[i].parentNode.parentNode.id.split("_")[1]);
                        count++
                    }
                }
                if (count > limitCount && limitCount * 1 != 0) {
                    tmpAry = tmpAry.filter(function(value) {
                        return value != _par.id.split("_")[1]
                    });
                    single_checkbox.checked = false;
                    if (now_parObj[rtype]["_limitCountAlertMsg"] != "")
                        _self.showErrorMsg("limitCount", now_parObj[rtype]["_limitCountAlertMsg"])
                }
                if (tmpAry.length > 0)
                    downlineStatus = tmpAry.join(",");
                if (tmpAry.length == all_single.length)
                ;
                else
                    allcheck.checked = false
            }
            if (titleMode)
                if (downlineStatus == "ALL" || downlineStatus == "NONE")
                    if (setAllTitleName != "")
                        title.innerHTML = setAllTitleName;
                    else {
                        var li_all = searchDiv.getElementsByTagName("li")[0];
                        title.innerHTML = li_all.getElementsByTagName("tt")[0].innerHTML
                    }
            else
                title.innerHTML = setItemTitleName + " (" + tmpAry.length + ")";
            if (downlineStatus == "NONE")
                downlineStatus = "ALL";
            if (chkBtnMode)
                _paramTmp[rtype] = downlineStatus;
            else {
                _param[rtype] = downlineStatus;
                now_parObj[rtype]["_default"] = _param[rtype];
                _self.dispatchEvent("autoBackParam", _param)
            }
        };
        _self.searchItem = function(e, _par) {
            var target = _par.target;
            var itemName = _par.item;
            var item = dom.getElementsByName(itemName);
            var reg = new RegExp("" + target.value + "", "i");
            for (var i = 0; i < item.length; i++) {
                var value = item[i].value;
                var text = item[i].innerText;
                var searchMain = value ? value : text;
                if (searchMain.match(reg) == null)
                    item[i].parentNode.style.display = "none";
                else
                    item[i].parentNode.style.display = ""
            }
        };
        _self.clearSearch = function(e, _par) {
            var target = _par.target;
            var itemName = _par.item;
            target.value = "";
            _self.searchItem(e, {
                "target": target,
                "item": itemName
            })
        };
        _self.getNowParam = function(type) {
            if (_param[type])
                return _param[type];
            else
                return _param
        };
        _self.autoBackParam = function(obj) {
            alert("override take param");
            return obj
        };
        _self.saveParam = function(e, _par) {
            var rtype = _par.rtype;
            var disappear = _par.disappear;
            var act = _par.act;
            var icon = _par.icon;
            if (disappear)
                util.classFunc(icon, act, "remove");
            _param[rtype] = _paramTmp[rtype];
            now_parObj[rtype]["_default"] = _param[rtype];
            _self.dispatchEvent("autoBackParam", _param);
            if (_param[rtype] == "ALL")
                _self.reDefault(rtype, "ALL", "N")
        };
        _self.resetIcon = function(e, _par) {
            var rtype = _par.rtype;
            var disappear = _par.disappear;
            var act = _par.act;
            var icon = _par.icon;
            if (disappear)
                util.classFunc(icon, act, "remove");
            var tmpObj = new Object;
            tmpObj[rtype] = now_parObj[rtype]["_default"];
            _self.reDefault(rtype, tmpObj[rtype], "N")
        };
        _self.reDefault = function(_rtype, _def, isOut) {
            isOut = isOut || "Y";
            if (!now_parObj[_rtype]) {
                console.log("NO FILTER");
                return
            }
            var key = _rtype;
            var mode = now_parObj[key]["mode"];
            var def = _def;
            var contant = now_parObj[key]["_contantView"];
            if (mode == 1) {
                var list = now_parObj[key]["_list"];
                var num = list.indexOf(def);
                if (num != -1) {
                    var defautitem = contant.getElementsByTagName("li")[num];
                    defautitem.click()
                } else {
                    var defautitem = contant.getElementsByTagName("li")[0];
                    defautitem.click()
                }
            }
            if (mode == 2) {
                var allGroupDIv = contant.children;
                var allInput = contant.getElementsByTagName("Input");
                var group = now_parObj[key]["_group"];
                var titleView = now_parObj[key]["_titleView"];
                var num = group.indexOf(def["mode"]);
                var preitem = def["listGold"];
                var tmpObj = new Object;
                for (var sub in preitem) {
                    if (preitem[sub] * 1 > 0)
                        tmpObj[sub] = preitem[sub] * 1 / 1;
                    else
                        tmpObj[sub] = 0;
                    if (dom.getElementById(sub + "_input"))
                        dom.getElementById(sub + "_input").value = tmpObj[sub] * 1
                }
                _param[key]["listGold"] = tmpObj;
                if (def["listItem"])
                    _param[key]["listItem"] = def["listItem"];
                else
                    _param[key]["listItem"] = "";
                if (num != -1)
                    _self.chgRatio(null, {
                        "rtype": key,
                        "group": group[num],
                        "_viewClass": "wmc_stake_checked",
                        "mode": mode,
                        "allGroupDIv": allGroupDIv,
                        "titleView": titleView,
                        "titleMode": now_parObj[key]["title_mode"],
                        "allInput": allInput,
                        "now": num
                    });
                else {
                    _param[key]["mode"] = def["mode"];
                    _self.dispatchEvent("autoBackParam", _param)
                }
            }
            if (mode == 3) {
                var dataShow = now_parObj[key]["_dataShowDiv"];
                var searchItem = now_parObj[key]["_searchItem"];
                var chkBtnMode = now_parObj[key]["_chkBtnMode"];
                var all_single = dom.getElementsByName(searchItem);
                var allcheck = dataShow.getElementsByTagName("input")[0];
                def = def.toString();
                for (var i = 0; i < all_single.length; i++) {
                    all_single[i].checked = false;
                    all_single[i].disabled = false
                }
                allcheck.checked = false;
                allcheck.disabled = false;
                if (def == "ALL")
                    dataShow.getElementsByTagName("input")[0].click();
                else if (def != "") {
                    var downlineIdAry = def.split(",");
                    for (var i = 0; i < downlineIdAry.length; i++) {
                        var downlineIdItem = dom.getElementById(key + "_" + downlineIdAry[i]);
                        if (downlineIdItem)
                            downlineIdItem.getElementsByTagName("input")[0].click();
                        else
                            dataShow.getElementsByTagName("input")[0].click()
                    }
                }
                if (chkBtnMode && isOut != "N") {
                    var chkBtnDiv = now_parObj[key]["_chkBtnDiv"];
                    chkBtnDiv.SAVE.div.click()
                }
            }
            if (mode == 4) {
                var dataShow = now_parObj[key]["_dataShowDiv"];
                def = def.toString();
                if (def == "ALL")
                    dataShow.getElementsByTagName("li")[0].click();
                else if (def != "") {
                    var downlineIdAry = def.split(",");
                    for (var i = 0; i < downlineIdAry.length; i++) {
                        var downlineIdItem = dom.getElementById(key + "_" + downlineIdAry[i]);
                        if (downlineIdItem)
                            downlineIdItem.click();
                        else
                            dataShow.getElementsByTagName("li")[0].click()
                    }
                }
            }
        };
        _self.scrollToTop = function(rtype) {
            now_parObj[rtype]["_contantView"].scrollTop = 0
        };
        _self.keep_credit = function(e) {
            e.target.value = e.target.value.replace(/\D/g, "") * 1
        };
        _self.showErrorMsg = function(code, arr_data) {
            if (code == "limitCount")
                util.showErrorMsg(arr_data)
        };
        _self.closeAllDownlist = function() {
            for (var key in now_parObj) {
                var icon = now_parObj[key]["_setDiv"];
                if (icon.classList.contains(now_parObj[key]["_viewClass"]))
                    now_parObj[key]["_setDiv"].click()
            }
        };
        _self.addEventListener = function(eventname, eventFunction) {
            eventHandler[eventname] = eventFunction
        };
        _self.dispatchEvent = function(eventname, param) {
            if (eventHandler[eventname])
                eventHandler[eventname](param)
        }
    };
    _self.browserdownload = function(e, param) {
        if (param.browser == "chrome")
            window.open("https://www.google.com/chrome/", "_blank");
        else if (param.browser == "uc")
            window.open("http://www.ucweb.com/", "_blank");
        else if (param.browser == "safari")
            window.open("https://support.apple.com/downloads/safari", "_blank");
        else if (param.browser == "firefox")
            window.open("https://www.mozilla.org/", "_blank");
        else if (param.browser == "qq")
            window.open("https://browser.qq.com/", "_blank")
    };
    _self.check_template_enable = function() {
        var check_enable = false;
        if (top.template_sw)
            if (top.user_type != "1") {
                if (top.user_enable == "Y")
                    if (top.pri_type.indexOf("B1") != -1)
                        check_enable = true
            } else if (top.user_enable == "Y")
            check_enable = true;
        return check_enable
    };
    _self.chg_site = function() {
        var ret = false;
        var userAgent = navigator.userAgent;
        var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1;
        var isIE11 = userAgent.indexOf("Trident") > -1 && userAgent.indexOf("rv:11.0") > -1;
        if (isIE || isIE11)
            ret = true;
        return ret
    };
    _self.getTopParentNode = function(_node, parentTag) {
        if (_node.parentNode)
            if (_node.parentNode.nodeName == parentTag)
                return _self.getTopParentNode(_node.parentNode, parentTag);
            else
                return _node
    };
    _self.countPaddingPx = function(tmp_div) {
        var computedStyle = win.getComputedStyle(tmp_div);
        return parseInt(computedStyle.getPropertyValue("padding-bottom"), 10)
    }
};
