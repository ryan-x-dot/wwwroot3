function acc_detail(_win, _dom, _post){
    var _self = this;
    var classname = "acc_detail";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var postHash = _post;
    var util;
    var fastTemplate_a1;
    var eventHandler = new Object();

    _self.init=function(){
        // util.echo(classname+" load complete");
    }

    _self.setParentclass=function(_parentclass){
        parentClass = _parentclass;
        util = parentClass.getThis("util");
        fastTemplate_a1 = parentClass.getThis("fastTemplate_a1");
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.getParentThis=function(varible){
        return parentClass.getThis(varible);
    }

    _self.parseData=function(dataHash){
        // util.echo(dataHash);
        if(dataHash["view_layer"]!="list_bet"){
            
            var modelObj = dom.getElementById("acc_model");
            var showObj = dom.getElementById("acc_show");
            var tpl = new fastTemplate_a1();
            tpl.init(modelObj.cloneNode(true));


            //title
            var hash = dataHash["row0"];
            var ary = new Array("NAME0","ALIAS0");
            tpl.addBlock("title");
            for(var a=0; a<ary.length; a++){
                var keys = ary[a];
                tpl.replace(new RegExp("\\\*"+keys+"\\\*","gi"), util.showTxt(hash[keys]));
            }

            //row0
            var dHash = _self.getParseAry(dataHash["model"]);

            for(var keys in dHash){
                var vv = util.showTxt(hash[keys]);
                if(vv==""){
                    vv = "-";
                }
                tpl.addBlock("row0");
                tpl.replace(new RegExp("\\\*TITLE\\\*","gi"), dHash[keys]);
                tpl.replace(new RegExp("\\\*VALUE\\\*","gi"), vv);
            }


            showObj.innerHTML = tpl.fastPrint();
            showObj.style.display = "";

            _self.addBackClick(showObj);

        }
    }

    _self.getParseAry=function(_model){

        var ret = new Object();
        var tmpDiv = document.createElement("div");
        tmpDiv.innerHTML = _model;

        var ary = util.getObjAry(tmpDiv, ",sort_btn,", "name");
        for(var i=0; i<ary.length; i++){
            var obj = ary[i];
            var att = obj.getAttribute("data-sort");
            if(att!="NAME0" && att!="ALIAS0"){
                ret[att] = obj.innerHTML.replace("<br>", " ");
            }
        }
        return ret;
    }

    _self.addBackClick=function(showObj){
        var ary = util.getObjAry(showObj,",back_btn,");
        util.addEvent(ary["back_btn"], "click", _self.backEvent);
    }

    _self.backEvent=function(e, param){
        parentClass.dispatchEvent("hideAccDetail", param);
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
	}

}