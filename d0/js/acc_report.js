function acc_report(_win, _dom, paramObj){
    var _self = this;
    var level = "ad";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var _mc = new Object();
    var param;
    var upper_structure = null;

    _self.init=function(){
        param = paramObj;
        _self.getSearchData(param["edit_layer"], param["edit_id"], param["pay_type"]);
    }

    _self.setParentclass = function (_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
    }
    //送php 取資料
    _self.getSearchData = function (now_layer, now_id, now_pay_type) {
        if (typeof (now_pay_type) =="undefined"){
            now_pay_type = "0" ;
        }
        var urlParams = "";
        urlParams += "uid=" + top.uid;
        urlParams += "&login_layer=" + top.login_layer;//登入層級 不可變動
        urlParams = "p=get_upper_structure&ver=" + top.ver + "&" + urlParams + "&now_layer=" + now_layer + "&now_id=" + now_id + "&now_pay_type=" + now_pay_type;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL(top.url, "POST", urlParams);
    }
    _self.connectComplete = function (data) {
        try {
            var arr_data = JSON.parse(data);
            // util.echo(arr_data);
            upper_structure = arr_data["data"];
            _self.openDiv("div_acc_report");
        } catch (e) {
            util.echo(e);
        }

    }
    _self.openDiv = function(name){
        // var paramHash = new Object();
        // paramHash["edit_id"] = param.edit_id;
        // paramHash["user_id"] = param.user_id;
        // paramHash["edit_layer"] = level;
        // paramHash["edit_type"] = param.edit_type;
        // paramHash["edit_enable"] = param.edit_enable;
        // paramHash["back_page"] = param.back_page;


        var parObj = new Object();
        var _name = "report_" + param.edit_layer;
        parObj["target"] = name;
        parObj["retFun"] = parentClass.loadSubFrame;
        parObj["retParam"] = {"page":_name};
        switch(name){
            case "div_acc_report":
                var tmpurl = "";
                for (var key in upper_structure){
                    tmpurl += upper_structure[key]["report_path"] + "&";
                }
                var postHash = new Object();
                postHash["report_kind"] = "A";
                postHash["report_type"] = "set";
                postHash["result_type"] = "Y";
                postHash["date"] = "yes";
                postHash["date_start"] = _self.date_show(-1);
                postHash["date_end"] = _self.date_show(-1);
                // postHash["date_start"] = "2019-03-01";
                // postHash["date_end"] = "2019-03-27";
                postHash["url_param"] = tmpurl.substr(0, (tmpurl.length-1));
                // postHash["url_param"] = "";
                postHash["gtype"] = "ALL";
                postHash["wtype"] = "ALL";
                postHash["view_layer"] = param.edit_layer;
                postHash["view_id"] = param.edit_id;
                postHash["is_from_acc"] = true;
                postHash["from_acc_layer"] = param.edit_layer;
                postHash["chkFrame"] = "subFrame";
                parObj["post"] = "view_layer=" + param.edit_layer;
                parObj["postHash"] = postHash;
                parObj["extendsClass"] = "report_index";
                parObj["page"] = "report_" + param.edit_layer;
                parObj["p"] = "report_" + param.edit_layer;
        }

        parentClass.dispatchEvent("goToPage", parObj);
    }
    //顯示日期
    _self.date_show = function (daynum) {
        var today = new Date();
        var years = today.getFullYear();
        var months = today.getMonth() + 1;
        var days = today.getDate();
        var hours = today.getHours();
        var transday = _self.addDate(years, months - 1, days, hours, 0, daynum);
        // console.log(transday);
        var y = transday.getFullYear();
        var m = transday.getMonth() + 1;
        var d = transday.getDate();
        if (m < 10) m = "0" + m;
        if (d < 10) d = "0" + d;
        var result = y + "-" + m + "-" + d;
        return result;
    }
    _self.addDate = function (dy, dmomth, dd, dh, dm, dadd) {
        var a = new Date(dy, dmomth, dd, dh, dm)
        a = a.valueOf();
        a = a + dadd * 1 * 60 * 60 * 1000 * 24;
        a = new Date(a);
        return a;
    }
}