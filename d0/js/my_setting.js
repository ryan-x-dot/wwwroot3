function my_setting(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var LS_code;
    var eventHandler = new Object();
    var _mc = new Object();
    var title_is_fixed = false;//title 目前是否置頂
    var _viewType = new Object();//畫面所需玩法容器

    var keepScrollTop = 60;
    var overScrollTop = 60;

    _viewType["gtypelist"] = new Array("FT", "BK", "OP", "FS");
    _viewType["rtypeFT"] = new Array("R", "RE", "M", "DT", "RDT");
    _viewType["rtypeBK"] = new Array("R", "RE", "M", "DT");
    _viewType["rtypeOP"] = new Array("R", "RE", "M", "DT");
    _viewType["rtypeFS"] = new Array("FS");
    _viewType["Rlist"] = new Array("A", "B", "C", "D", "SC", "SO");
    _viewType["RElist"] = new Array("A", "B", "C", "D", "SC", "SO");
    _viewType["Mlist"] = new Array("A", "SC", "SO");
    _viewType["DTlist"] = new Array("A", "SC", "SO");
    _viewType["RDTlist"] = new Array("A", "SC", "SO");
    _viewType["FSlist"] = new Array("A", "SC", "SO");
    var nowShow = "FT";//目前顯示的畫面

    _self.init = function () {
        parentClass.dispatchEvent("chgPageName", { "pageName": "mysetting" });
        util.echo("my setting complete");
        _self.getSettingData();
        _self.getViewAllEle();//取得畫面所需元素
        _self.addHyperLink();//建立監聽事件(進態)
        parentClass.dispatchEvent("showLoading", { "showLoading": false });
        //判斷畫面拉動 是否要置頂
        util.addEvent(dom.getElementById("body_show"), "scroll", _self.scrollEvent, dom.getElementById("setting_body"));
        topFrame.closeRightPanel();
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        LS_code = parentClass.getThis("LS_code");
        topFrame = parentClass.getThis("topFrame");
    }

    _self.getSettingData = function () {

        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;
        urlParams += "&layer_id=" + top.layer_id;
        urlParams = "p=get_my_setting&ver=" + top.ver + "&" + urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams);
    }

    _self.connectComplete = function (data) {
        try {
            var arr_data = JSON.parse(data);
            if (util.chkErrorMsg(arr_data, LS_code)) return;
            _self.parseData(arr_data);
        } catch (e) {
            util.echo(e);
        }

    }
    _self.getViewAllEle = function (){
        //建立畫面元素物件
        for (var i = 0; i < _viewType["gtypelist"].length; i++) {
            var gtype = _viewType["gtypelist"][i];

            _mc[gtype + "_title_box"] = dom.getElementById(gtype + "_title_box");
            _mc[gtype + "_table"] = dom.getElementById(gtype + "_table");

            var rtype_arr = _viewType["rtype" + gtype];
            for (var j = 0; j < rtype_arr.length; j++) {
                var rtype = rtype_arr[j];
                var rtypelist_arr = _viewType[rtype + "list"];
                for (var k = 0; k < rtypelist_arr.length; k++) {
                    var rtypelist = rtypelist_arr[k];
                    _mc[gtype + "_" + rtype + "_" + rtypelist + "_td"] = dom.getElementById(gtype + "_" + rtype + "_" + rtypelist + "_td");
                }
            }
        }
        _mc["maxcredit_td"] = dom.getElementById("credits_code");
        _mc["available_td"] = dom.getElementById("balance_code");
    }

    _self.parseData = function (data) {
        for (var key in data["data"]){
            if (_mc[key + "_td"]){
                if (key == "maxcredit" || key == "available" ){
                    _mc[key + "_td"].innerHTML = util.mprintf(data["data"][key] * 1, 0, 2, false, true);
                } else if ((key.indexOf("SO") != -1) || (key.indexOf("SC") != -1)){
                    _mc[key + "_td"].innerHTML = _self._number_format(data["data"][key]);
                }else{
                    _mc[key + "_td"].innerHTML = data["data"][key];
                }
            }
        }
        keepScrollTop = dom.getElementById("set_moneyG").offsetHeight;
        overScrollTop = dom.getElementById("set_moneyG").offsetHeight;
    }

    _self.addHyperLink = function(){
        util.addEvent(_mc["FT_title_box"],"click",_self.titleClick,"FT_title_box");
        util.addEvent(_mc["BK_title_box"],"click",_self.titleClick,"BK_title_box");
        util.addEvent(_mc["OP_title_box"],"click",_self.titleClick,"OP_title_box");
        util.addEvent(_mc["FS_title_box"],"click",_self.titleClick,"FS_title_box");
    }
    _self.titleClick = function (e, param){
        var tempAry = param.split("_");//截開 FT_title_box
        // console.log(nowShow);
        _self.showAndHidden(_mc[nowShow + "_title_box"]," on");//復原原本的
        _self.showAndHidden(_mc[param] , " on");//切換 標題 class
        //顯示隱藏對應table
        _mc[nowShow + "_table"].style.display = "none";
        _mc[tempAry[0] + "_table"].style.display = "";
        nowShow = tempAry[0];
    }
    //舊管理端搬過來的 數字顯示轉換
    _self._number_format = function (num, decimals, dec_point, thousands_sep) {
        if (num == undefined) return "";
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
                num0 = num0.substr(1, num0.length);
            }
            (num_ary[1] == undefined) ?
                num1 = "" :
                num1 = num_ary[1];
            len = num0.length;
            for (var i = 1; i <= len; i++) {
                ans = num0.substr(len - i, 1) + ans;
                if (i % 3 == 0 && i != len) ans = thousands_sep + ans;
            }
            num0 = ans;
            if (decimals != 0) {
                ans = "";
                for (var i = 0; i < decimals; i++) {
                    if (num1.charAt(i) == "") ans += 0;
                    else ans += num1.substr(i, 1);
                }
                num1 = ans;
                ret_str = sign + num0 + dec_point + num1;
            } else {
                ret_str = sign + num0;
            }
            return ret_str;
        } else {
            return num;
        }
    }
    //開關div
    _self.showAndHidden = function (titleObj, cName) {
        var classname = titleObj.className;
        var newClassname = "";

        if (classname.search(cName) == -1) {
            newClassname = classname + cName;
        } else {
            newClassname = classname.replace(cName, "");
        }

        _self.setObjectClass(titleObj, newClassname);

    }
    //set obj class
    _self.setObjectClass = function (targetObj, classStr) {
        if (targetObj.className != undefined) {
            targetObj.className = classStr;
        } else {
            targetObj.setAttribute("class", classStr);
        }
    }
    _self.onError = function () {
        util.echo("onError");
    }


    _self.getThis = function (varible) {
        return eval(varible);
    }

    //exit
    _self.exitEvent = function () {
        // util.echo("top exit");
        return true;
    }

    _self.backPage = function (e, param) {
        parentClass.dispatchEvent("backPage", { "retFun": _self.backPageComplete });
    }

    _self.backPageComplete = function () {
        // util.echo("backPageComplete");
    }

    _self.changePage = function (e, param) {
        param.retFun = _self.changePageComplete;
        parentClass.dispatchEvent("bodyGoToPage", param);
    }

    _self.changePageComplete = function () {
        // util.echo("changePageComplete");
    }

    _self.addEventListener = function (eventname, eventFunction) {
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent = function (eventname, param) {
        if (eventHandler[eventname]) eventHandler[eventname](param);
    }
    //判斷畫面拉動 是否需要載入資料
    _self.scrollEvent = function (e, target) {
        var newScrollTop = e.target.scrollTop;
        if (newScrollTop >= overScrollTop) {
            if (!target.issticky) {
                util.classFunc(target, "title_fixed");
                overScrollTop = e.target.scrollTop;
                target.issticky = true;
            }
        } else {
            if (target.issticky) {
                util.classFunc(target, "title_fixed", "remove");
                overScrollTop = keepScrollTop;
                target.issticky = false;
            }
        }
    }
}