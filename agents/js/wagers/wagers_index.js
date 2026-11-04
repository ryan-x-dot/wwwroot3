function wagers_index(_win, _dom, paramObj){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var param;
    var getView;
    var eventHandler = new Object();
    var par = new Object();
    var _mc = new Object();

    var _set = new Object();
    _set["nowPage"]="";
    _set["target"] = "viewAccount";
    _self.init=function(){
        try{
            param = paramObj;
            var objid = ",viewAccount,viewDetails,wager_show,game_info,info_model,";
            ary = util.getObjAry(dom, objid);
            _mc = util.mergeArray(_mc, ary);

            _self.parseGameInfo(param); // 賽事資訊
            _self.initClickEvent(); // 按鍵初始化
            // console.log("wagers_index",param);
            if(param.sub_getDataPage == "wagers_account" || param.sub_getDataPage == "wagers_list_bet"){
                _set["nowPage"] =  param.sub_getDataPage;

                if(param.sub_getDataPage == "wagers_account")_set["target"] ="viewAccount";
                if(param.sub_getDataPage == "wagers_list_bet")_set["target"] ="viewDetails";

            }
            _self.goTarget({"page":"wagers_account"},true);
        }catch(e){
            console.log(e);
        }
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        getView = parentClass.getThis("getView");
    }

    _self.initClickEvent = function(){
        util.addEvent(_mc["viewAccount"], "click", _self.clickTabEvent, {"target":"viewAccount", "page" : "wagers_account"});
        util.addEvent(_mc["viewDetails"], "click", _self.clickTabEvent, {"target":"viewDetails", "page" : "wagers_list_bet"});
    }

    _self.parseGameInfo = function(dataHash){
        // console.log(dataHash);
        var tmp = _mc["info_model"].cloneNode(true);
        var tmpAry = new Array("LEAGUE","TEAM_H","TEAM_C","WTYPE","RTYPE");
        for(var p =0; p < tmpAry.length; p++){
            var _key = tmpAry[p];

            if(_key=="WTYPE"){
                tmp.innerHTML = tmp.innerHTML.replace(new RegExp("\\\*" + _key + "\\\*", "gi"), dataHash[_key]);
            }else{
                tmp.innerHTML = tmp.innerHTML.replace(new RegExp("\\\*" + _key + "\\\*", "gi"), dataHash[_key]);
            }

        }
        if(dataHash["TEAM_H"]==null||dataHash["TEAM_C"]==null){
            tmp.innerHTML = tmp.innerHTML.replace(new RegExp("\\\*TEAMDISPLAY\\\*", "gi"), "none");
        }else{
            tmp.innerHTML = tmp.innerHTML.replace(new RegExp("\\\*TEAMDISPLAY\\\*", "gi"), "");
        }
        _mc["game_info"].innerHTML = tmp.innerHTML;
    }

    _self.clickTabEvent = function(e,param){
        _self.clickTab(param,false)
    }

    _self.clickTab = function(param,isinit){
        // console.log("clickTab",isinit);
        // var tabAry = new Array("viewAccount","viewDetails");
        // for(var i = 0; i < tabAry.length; i++){
        //     dom.getElementById(tabAry[i]).className = "";
        // }
        // dom.getElementById(param["target"]).classList.add("on");
        _self.goTarget(param,isinit);
        parentClass.dispatchEvent("showLoading", {"showLoading":true});
    }

    _self.goTarget = function(_par,isinit){
        var par = new Object();
        // par["page"] = _par["page"];
        // par["target"] = "wagers_model"
        // par["useDefineParent"] = "Y";
        // par["retFun"] = _self.getTargetComplete;
        // par["postHash"] = param;
        // parentClass.dispatchEvent("goToPage", par);

        var tabAry = new Array("viewAccount","viewDetails");
        for(var i = 0; i < tabAry.length; i++){
            dom.getElementById(tabAry[i]).className = "";
        }
        dom.getElementById(_set["target"]).classList.add("on");

        if(isinit){
            // console.log("_set",_set["nowPage"])
            par["page"] = (_set["nowPage"]!="")? _set["nowPage"] : _par["page"];
            par["target"] = "wagers_model"
            par["useDefineParent"] = "Y";
            par["retFun"] = _self.getTargetComplete;
            par["postHash"] = param;
            parentClass.dispatchEvent("goToPage", par);
        }else{

            param.nowLayer= top.login_layer;
            param.next_param="";
            par["page"] = "totalbet_header";
            par["postHash"] = param;

            par.postHash["sub_page"] = "wagers_index";
            par.postHash["sub_getDataPage"] = _par["page"];
            par.postHash["sub_target"] = "totalbet_body";
            parentClass.dispatchEvent("bodyGoToPage", par);
        }


    }

    _self.getTargetComplete = function(){
        // console.log("getTargetComplete");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }
}