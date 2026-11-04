function new_url(_win, _dom){
    var _self = this;
    var win = _win;
    var dom = _dom;
    var parentClass;
    var util;
    var LS;
    var fastTemplate_a1;
    var eventHandler = new Object();

    _self.init=function(){
        util.echo("new_url completed");
        parentClass.dispatchEvent("chgPageName", { "pageName": "newurl" });
        _self.getUrlData();
        parentClass.dispatchEvent("showLoading", {"showLoading":false});
        topFrame.closeRightPanel();
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        LS = parentClass.getThis("LS");
        topFrame = parentClass.getThis("topFrame");
    }

    _self.getUrlData=function(){

        var urlParams = "";
        urlParams += "uid="+top.uid;
        urlParams += "&login_layer="+top.login_layer;
        urlParams += "&layer_id="+top.layer_id;
        urlParams += "&chk_mem=N";
        urlParams = "p=get_new_url&ver="+top.ver+"&"+urlParams;
        var getHTML = new HttpRequest();
        getHTML.addEventListener("onError", _self.onError);
        getHTML.addEventListener("LoadComplete", _self.dataCenter);
        getHTML.loadURL(top.url,"POST",urlParams);
    }

    _self.dataCenter=function(data){
        try{
            var arr_data = JSON.parse(data);
            util.echo(arr_data);
            _self.parseData(arr_data);
        }catch(e){
            util.echo(e);
        }

    }

    _self.onError=function(){
        util.echo("onError");
    }

    _self.parseData=function(hash){
        var titleAry = hash["titleData"];//標頭資料 對應url key
        var urlAry = hash["urlData"];//網址資料
        var showmain = dom.getElementById("showmain");//顯示區
        var xmp_header = dom.getElementById("xmp_header").innerHTML;//modle hrader
        var xmp_foot = dom.getElementById("xmp_foot").innerHTML;//modle foot
        var outdata = "";//輸出資料

        for (var i = 0; i < titleAry.length ; i++){
            var headertmp = xmp_header;//clone header 資料
            var bodyTemp = "";//存放body
            var titleName = titleAry[i];
            headertmp = headertmp.replace("*TITLENAME*", LS.get(titleName));
            for (var j = 0; j < urlAry[titleName].length; j++) {
                var xmp_contant = dom.getElementById("xmp_contant").innerHTML;//modle contant
                xmp_contant = xmp_contant.replace(/\*URL\*/g, urlAry[titleName][j]);//替換資料
                bodyTemp += xmp_contant;
            }
            outdata += headertmp + bodyTemp + xmp_foot;
        }
        showmain.innerHTML = outdata;


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

}