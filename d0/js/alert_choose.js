function alert_choose(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var classname = "alert_choose";
    var util;
    var _mc = new Object();

    _self.init=function(){
        util.echo(classname+" load complete");

        _mc["choose_ul"] = dom.getElementById("choose_ul");
        _mc["choose_title"] = dom.getElementById("choose_title");
        var ar_choose_bg = dom.getElementById("ar_choose_bg");  // 黑色遮罩
        var div_choose = dom.getElementById("div_choose");      // div
        _self.setInfEvent(ar_choose_bg, { "_focus": div_choose , "_setView":ar_choose_bg});
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    //隱藏顯示提示窗
    _self.setInfEvent = function (icon, param) {
        util.addEvent(icon, "click", _self.showInfEvent, {"param": param});
    }

    _self.showInfEvent = function (e, _par) {
        var param = _par.param;
        var all = param._setView.getElementsByTagName("*"); // 抓黑色遮罩div裡面所有的元素
        for (var i = 0, max = all.length; i < max; i++) {
            if (all[i] == e.target) { // 如果點擊到跟黑色遮罩同層就不做事情
                return false;
            }
        }
        // 點到其他的都把選項關起來
        parentClass.dispatchEvent("hideAlertChooseMsg", {});
    }

    _self.parseChoose=function(type,hash){
        var out = "";
        for (var i = 0; i < hash.length; i++) {
            var tmpdata = hash[i];
            var li_content = dom.getElementById("li_content").innerHTML;
            li_content = li_content.replace(/\*ID\*/g, tmpdata["id"]); //替換資料
            li_content = li_content.replace(/\*TEXT\*/g, tmpdata["content"]); //替換資料
            li_content = li_content.replace(/\*LI_STYLE\*/g, tmpdata["style"]); //替換資料
            
            out += li_content;
        }
        _mc["choose_ul"].innerHTML = out;
        _self.addContentEvent(type,hash);
    }

    _self.addContentEvent=function(type,hash){
        var liObjs = _mc["choose_ul"].childNodes;
        var ind = 0;
        for(var i = 0; i < liObjs.length; i++){
            if(liObjs[i].tagName=="LI") {
                util.addEvent(liObjs[i], "click", _self.clickEvent, {"type":type, "postHash":hash[ind].postHash});
                ind++;
            }
        }
    }

    _self.clickEvent=function(e, param){
        switch(param.type){
            case "langx":
                var _post = param.postHash;
                parentClass.dispatchEvent("chgLangx", {"langx":_post.langx,"ls":_post.ls,"selLayer":_post.selLayer, "rightChg":"Y"});
                break;  
            case "account":
                var _post = param.postHash;
                parentClass.dispatchEvent("bodyGoToPage", _post);
                parentClass.dispatchEvent("hideAlertChooseMsg", {});
                break;      
        }
    }

    _self.showTitle=function(isShow){
        _mc["choose_title"].style.display = (isShow)?"":"none";
    }

    _self.clearChoose=function(){
        _self.showTitle(false);
        _self.removeEvent();
        _mc["choose_ul"].innerHTML = "";
    }

    _self.removeEvent=function(){
        var liObjs = _mc["choose_ul"].childNodes;
        for(var i = 0; i < liObjs.length; i++){
            if(liObjs[i].tagName=="LI") {
                util.removeEvent(liObjs[i], "click");
            }
        }
    }
}