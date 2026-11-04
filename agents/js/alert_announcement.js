function alert_announcement(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "alert_announcement";
    var util;
    var _mc = new Object;
    var keepScrollTop = "";
    var overScrollTop = "";
    var keepStyle = {};
    _self.init = function() {
        util.echo(classname + " load complete");
        _mc["close_btn"] = dom.getElementById("close_btn");
        _mc["ok_btn"] = dom.getElementById("anno_ok_btn");
        _mc["anno_div"] = dom.getElementById("anno_div");
        _mc["ul_show"] = dom.getElementById("ul_show");
        _mc["anno_title"] = dom.getElementById("anno_title");
        keepScrollTop = _mc["anno_title"].offsetHeight;
        overScrollTop = _mc["anno_title"].offsetHeight;
        util.addEvent(_mc["close_btn"], "click", _self.clickEvent, {
            "type": "close"
        });
        util.addEvent(_mc["ok_btn"], "click", _self.clickEvent, {
            "type": "close"
        });
        util.addEvent(_mc["anno_div"], "scroll", _self.scrollEvent, _mc["anno_title"])
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.showAnno = function(hash) {
        var out = "";
        for (var i = 0; i < hash.length; i++) {
            var tmpdata = hash[i].split("|");
            var li_content = dom.getElementById("li_content").innerHTML;
            li_content = li_content.replace(/\*TEXT\*/g, tmpdata[2]);
            out += li_content
        }
        _mc["ul_show"].innerHTML = out;
        keepStyle.body_show = dom.getElementById("body_show").style;
        keepStyle.body = dom.body.style;
        dom.getElementById("body_show").setAttribute("style", "overflow-y:hidden;");
        dom.body.setAttribute("style", "position:fixed; overflow-y:hidden;")
    };
    _self.clickEvent = function(e, param) {
        if (param.type == "close") {
            parentClass.dispatchEvent("hideAnno");
            dom.getElementById("body_show").removeAttribute("style");
            dom.body.removeAttribute("style")
        }
        if (param.retFun)
            param.retFun(param.postHash)
    };
    _self.clearMsg = function() {
        _self.clearContent()
    };
    _self.clearContent = function() {
        _mc["anno_div"].innerHTML = ""
    };
    _self.removeEvent = function() {
        util.removeEvent(_mc["close_btn"], "click");
        util.removeEvent(_mc["ok_btn"], "click")
    };
    _self.scrollEvent = function(e, target) {
        var newScrollTop = e.target.scrollTop;
        if (newScrollTop >= overScrollTop) {
            util.classFunc(target, "scroll");
            overScrollTop = e.target.scrollTop
        } else {
            util.classFunc(target, "scroll", "remove");
            overScrollTop = keepScrollTop
        }
    }
};
