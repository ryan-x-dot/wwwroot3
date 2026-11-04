function guide_announcement(_win, _dom, _post) {
    var _self = this;
    var win = _win;
    var dom = _dom;
    var postHash = _post;
    var parentClass;
    var classname = "guide_announcement";
    var util;
    _self.init = function() {
        util.addEvent(dom.getElementById("note_close_btn"), "click", _self.closeBbtn, null);
        util.addEvent(dom.getElementById("btn_modal"), "click", _self.go_create_modal);
        dom.getElementById("newnote_show").style.display = "";
        dom.getElementById("Gann_div").scrollTop = 0;
        util.addEvent(dom.getElementById("Gann_div"), "scroll", _self.roll)
    };
    _self.setParentclass = function(_parentclass) {
        parentClass = _parentclass;
        util = parentClass.getThis("util")
    };
    _self.getThis = function(varible) {
        return eval(varible)
    };
    _self.closeBbtn = function(e, param) {
        dom.getElementById("newnote_show").style.display = "none"
    };
    _self.start = function(e, param) {};
    _self.go_create_modal = function() {
        _self.closeBbtn();
        parentClass.changePage(null, {
            "page": "acc_mem_modal"
        })
    };
    _self.roll = function() {
        var check_obj = dom.getElementById("Gann_div");
        var do_obj = dom.getElementById("Gann_title");
        var use_class = "scroll";
        if (check_obj.scrollTop == 0) {
            if (do_obj.classList.contains(use_class))
                do_obj.classList.remove(use_class)
        } else if (!do_obj.classList.contains(use_class))
            do_obj.classList.add(use_class)
    }
};
