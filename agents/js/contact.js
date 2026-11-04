function contact(_win, _dom) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    _self.init = function() {
        util.echo("contact completed");
        dom.getElementById("body_show").classList.add("bgf0f0f0");
        parentClass.dispatchEvent("chgPageName", {
            "pageName": "contactus"
        });
        parentClass.dispatchEvent("showLoading", {
            "showLoading": false
        });
        topFrame.closeRightPanel()
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        topFrame = parentClass.getThis("topFrame")
    }
};