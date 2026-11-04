function alert_note(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var classname = "alert_note";
    var util;
    var topFrame;
    _self.init = function() {
        util.addEvent(dom.getElementById("note_close_btn"), "click", _self.closeBtn, null);
        util.addEvent(dom.getElementById("confirm_btn"), "click", _self.closeBtn, null)
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.closeBtn = function(e, param) {
        parentClass.dispatchEvent("closeNote", null)
    };
    _self.start = function(e, param) {
        parentClass.dispatchEvent("closeNote", null)
    };
    _self.roll = function() {
        if (document.getElementById("note_div").scrollTop == 0) document.getElementById("note_title").className = "ar_title";
        else document.getElementById("note_title").className = "ar_title scroll"
    };
    _self.fun_note_go_page = function(e, go_pagename) {
        _self.closeBtn();
        parentClass.goToPage("newnote_show", go_pagename,
            function() {
                try {
                    noticeFrame = new win.show_announcement(win, dom);
                    noticeFrame.setParentclass(_self);
                    noticeFrame.init();
                    _self.check_all_div("newnote_show", param);
                    _self.lockBodyScroll();
                    dom.getElementById("newnote_show").style.display = ""
                } catch (e) {
                    util.err("[alert_note]", e)
                }
            }, {})
    };
    _self.go_learn_more = function() {
        _self.closeBtn();
        topFrame = parentClass.getThis("topFrame");
        if (topFrame) topFrame.show_modal_more()
    }
};