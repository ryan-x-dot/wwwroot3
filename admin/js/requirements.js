function requirements(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var eventHandler = new Object();
    var fromindex = false ;

    _self.init=function(){
        parentClass.dispatchEvent("chgPageName", { "pageName": "requirements" });
        if (topFrame)   topFrame.closeRightPanel();
        if (fromindex){
            // 只有從首頁來的要這些
            dom.getElementById("acc_show").classList.add("login_page");
            util.addEvent(dom.getElementById("back_btn"), "click", _self.go_back_index);
            util.addEvent(dom.getElementById("back_index_btn"), "click", _self.go_back_index);
        }
        var broswer_link = dom.getElementById("show_equire").getElementsByTagName('a');
        for(var k=0 ; k< broswer_link.length; k++){
            if (broswer_link[k] != null){
                var broswer_name = broswer_link[k].getAttribute("data-browser");
                if (broswer_name!=null){
                    util.addEvent(broswer_link[k], "click", util.browserdownload, { "browser": broswer_name } );
                }
            }
        }

        parentClass.dispatchEvent("showLoading", { "showLoading": false });
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        topFrame = parentClass.getThis("topFrame");
    }

    _self.go_back_index = function () {
        util.goToIndex();
    }

    //exit
    _self.exitEvent=function(){
        // util.echo("top exit");
        return true;
    }

    _self.backPage=function(e, param){
        parentClass.dispatchEvent("backPage", {"retFun":_self.backPageComplete});
    }

    _self.backPageComplete=function(){
        // util.echo("backPageComplete");
    }


    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
    }

    _self.setfromindex = function (isfromindex){
        fromindex = isfromindex ;
    }

}