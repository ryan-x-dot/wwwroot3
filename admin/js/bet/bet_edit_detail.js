function bet_edit_detail(_win, _dom, _post){
    var _self = this;
    var classname = "bet_edit_detail";
    var win = _win;
    var dom = _dom;
    var parentClass;
    var postHash = _post;
    var util;
    var fastTemplate_a1;
    var eventHandler = new Object();

    var selObj = new Object();
    var filterUse = new Object();

    var game_name = new Object();
    var dataHash = new Object();
    var ids = new Object();
    var betid;

    _self.init=function(){
        util.echo(classname+" load complete");
    }

    _self.getGameName  = function(id){
        var par = "";
        par+=top.param;
        par+="&p=get_game_name";
        par+="&betid="+id;


        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadGameNameFinish);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.loadGameNameFinish = function (json){
        var hash;
        try {
            hash = JSON.parse(json);
            if(hash.status=="success"){
                game_name = hash["data"];
            }
        } catch (e) {
            util.err("[" + classname + "]", e);
        }

        _self.parseData1();
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

    _self.parseData = function (data){
        dataHash = data;
        util.echo(dataHash);
        var hash;
        hash = util.clone(dataHash["row0"]);
        selObj = new Object();
        game_name = new Object();
        filterUse = new Object();
        ids = new Object();
        betid = hash["ID"];
        _self.getGameName(hash["ID"]);
    }

    _self.parseData1=function(){
        util.echo(dataHash);
        var isP = (dataHash["row0"]["IS_P"]!="");
        // var _name = (isP)?"wager":"wager_p";
        var modelObj = dom.getElementById("wager_model");
        var showObj = dom.getElementById("wager_show");


        var tpl = new fastTemplate_a1();
        tpl.init(modelObj.cloneNode(true));

        var ary;
        var hash;

        //USER
        // hash = Object.assign({}, dataHash["row0"]); ie 不支援
        hash = util.clone(dataHash["row0"]);
        //hash = dataHash["row0"] 此寫作會造成 dataHash["row0"] 被hash異動連帶改變,故使用Object.assign 來copy
        ary = new Array("NAME0","ALIAS0","M_TYPE","IN_RADIO","ALIAS0");
        tpl.addBlock("USER");
        for(var a=0; a<ary.length; a++){
            var keys = ary[a];
            tpl.replace(new RegExp("\\\*"+keys+"\\\*","gi"), util.showTxt(hash[keys]));
        }



        //TITLE
        // hash = Object.assign({},dataHash["row0"]); ie 不支援
        hash = util.clone(dataHash["row0"]);
        ary = new Array("DATE","TIME","ODDF_TYPE","TID","IS_P","BETTIME","SRV_IP","GOLD","GOLD1","ORGSCORE");
        tpl.addBlock("TITLE");
        for(var a=0; a<ary.length; a++){
            var keys = ary[a];
            if (keys == "IS_P" && hash[keys] != "") hash[keys] = "<br><br>" + hash["GT"] + " " + hash[keys]; //要顯示球類過關 EX: Tennis Mix Parlay
            tpl.replace(new RegExp("\\\*"+keys+"\\\*","gi"), util.showTxt(hash[keys]));
        }

        hash = new Array();
        if(isP){
            hash = util.clone(dataHash["row0"]["TNAME_P"]);
        }else{
            // hash.push(Object.assign({},dataHash["row0"])); //ie 不支援
            var tmp = util.clone(dataHash["row0"]);
            hash.push(tmp);
        }
        //console.log(tmp);
        //row0
        ary = new Array("ORDER_TYPE","ID", "CON_H","CON_C", "ORDER_CON", "IORATIO", "WAGERS_TYPE", "DATE", "G_TIME", "LEAGUE", "TEAM_H", "TEAM_C", "SCORE", "DIF_SCORE", "NUM_H", "NUM_C", "RESULT_WL", "RESULT_WL_CLASS", "DEL_CLASS", "FS_DIS", "GT", "IS_P", "SRV_IP");
        for(var k=0; k<hash.length; k++){
            // console.log(hash[k]);
            tpl.addBlock("row0");
            if (dataHash["row0"]["SETTLED"] == "N")     tpl.replace(new RegExp("\\\*RESULT_WL\\\*", "gi"), "");       //未有結果不秀
            if (dataHash["row0"]["CANCEL_MSG"] != "")   tpl.replace(new RegExp("\\\*RESULT_WL\\\*", "gi"), "");       //整張取消不多秀結果
            _self.addSelectEvent(hash[k]);
            ids[k] = hash[k]["ID"];
            for(var a=0; a<ary.length; a++){

                var keys = ary[a];
                if(keys=="RESULT_WL") hash[k][keys]=hash[k][keys].replace(/<br>/gi, " ");
                if(hash[k]["STRONG"]=="Y"){
                    if(hash[k]["BET_TYPE"]=="H"){
                        hash[k]["CON_H"] = hash[k]["CON"];
                        hash[k]["CON_C"] = "";
                    }else{
                        hash[k]["CON_C"] = hash[k]["CON"];
                        hash[k]["CON_H"] = "";
                    }
                }else if(hash[k]["STRONG"]=="N"){
                    if(hash[k]["BET_TYPE"]=="H"){
                        hash[k]["CON_C"] = hash[k]["CON"];
                        hash[k]["CON_H"] = "";
                    }else{
                        hash[k]["CON_H"] = hash[k]["CON"];
                        hash[k]["CON_C"] = "";
                    }
                }
                if(util.showTxt(hash[k]["ORDER_CON"])=="" && util.showTxt(hash[k]["CON"])==""){
                    tpl.replace(new RegExp("\\\*ORDER_DIV_DIS\\\*","gi"), "style='display:none;'");
                    tpl.replace(new RegExp("\\\*ORDER_CON1\\\*","gi"), "");
                }else{
                    tpl.replace(new RegExp("\\\*ORDER_DIV_DIS\\\*","gi"), "");
                    if(util.showTxt(hash[k]["ORDER_CON"])!=""){
                        tpl.replace(new RegExp("\\\*ORDER_CON1\\\*","gi"), hash[k]["ORDER_CON"]);
                    }else{
                        tpl.replace(new RegExp("\\\*ORDER_CON1\\\*","gi"), hash[k]["CON"]);
                    }

                }
                tpl.replace(new RegExp("\\\*" + keys + "\\\*", "gi"), util.showTxt(hash[k][keys]));



            }
        }


        //total
        // hash = Object.assign({},dataHash["row0"]); ie 不支援
        hash = util.clone(dataHash["row0"]);
        ary = new Array("ARESULT","SRESULT","CRESULT","D0RESULT","ADRESULT");
        tpl.addBlock("TOTAL");
        tpl.replace(new RegExp("\\\*RESULT_TYPE_DIS\\\*", "gi"), (dataHash["row0"]["SETTLED"] == "N" && dataHash["row0"]["FROM"] !="totalbet_wager" ) ?"hide_item":"");       //未有結果不顯示成數
        for(var a=0; a<ary.length; a++){
            var keys = ary[a];
            tpl.replace(new RegExp("\\\*"+keys+"\\\*","gi"), util.showTxt(hash[keys]));
        }

        tpl.replace(new RegExp("\\\*COM_CLS\\\*","gi"), (top.login_layer=="su"||top.login_layer=="ag")? "hide_item":"");
        tpl.replace(new RegExp("\\\*CO_CLS\\\*","gi"), (top.login_layer=="su"||top.login_layer=="ag")? "hide_item":"");
        tpl.replace(new RegExp("\\\*SU_CLS\\\*","gi"), (top.login_layer=="ag")? "hide_item":"");


        //winloss
        // hash = Object.assign({},dataHash["row0"]); ie 不支援
        hash = util.clone(dataHash["row0"]);
        ary = new Array("GOLD", "WIN_GOLD","K_WIN_GOLD", "WIN_GOLD_CLASS", "BALL_ACT", "COMWINLOSS");
        tpl.addBlock("WINLOSS");
        if (dataHash["row0"]["CANCEL_MSG"] != "" && dataHash["row0"]["SETTLED"] == "N")     tpl.replace(new RegExp("\\\*BALL_ACT\\\*", "gi"), dataHash["row0"]["CANCEL_MSG"]);      //未有結果危險球顯示位置要秀取消原因
        tpl.replace(new RegExp("\\\*RESULT_TYPE_DIS\\\*", "gi"), (dataHash["row0"]["SETTLED"] == "N") ? "hide_item" : "");          //未有結果不顯示成數
        tpl.replace(new RegExp("\\\*TB_P_RESULT_TYPE_DIS\\\*", "gi"), (dataHash["row0"]["SETTLED"] == "Y") ? "hide_item" : "");          //2019-08-23 調整即時注單過關細單要顯示win_gold
        for(var a=0; a<ary.length; a++){
            var keys = ary[a];
            tpl.replace(new RegExp("\\\*"+keys+"\\\*","gi"), util.showTxt(hash[keys]));
        }

        showObj.innerHTML = tpl.fastPrint();
        showObj.style.display = "";

        _self.setSelectEvent();
        _self.addBackClick();
        _self.addSaveClick();
    }



    _self.addSelectEvent = function(hash){
        selObj["rtype_" + hash["ID"]] = {
            "info_mode": true,
            "title_mode": true,
            "_setDiv": null,
            "_titleView": null,
            "_titleName": "",
            "_contantView": null,
            "_type": null,
            "_viewClass": "active",
            "_list": [hash["RTYPE"].toUpperCase()],
            "_listSub": [hash["ORDER_TYPE"]],
            "_data":[hash["RTYPE"].toUpperCase()],
            "mode": 1,
            "_chkClass": "",
            "_default": hash["RTYPE"].toUpperCase(),
            "_act": true,
        };
        if(game_name[hash["ID"]]){
            var gn = game_name[hash["ID"]];
            selObj["rtype_" + hash["ID"]]["_list"] = [];
            selObj["rtype_" + hash["ID"]]["_data"] = [];
            selObj["rtype_" + hash["ID"]]["_listSub"] = [];
            var num = 0;
            for(var k in gn) {
                selObj["rtype_" + hash["ID"]]["_data"][num] = gn[k]["rtype"];
                selObj["rtype_" + hash["ID"]]["_list"][num] = gn[k]["rtype"];
                selObj["rtype_" + hash["ID"]]["_listSub"][num] = gn[k]["name"];
                num++;
            }
        }

    }



    _self.setSelectEvent=function(){
        for(var rtype in selObj){
            var rDom = dom.getElementById(rtype + "_div");
            var rSel = dom.getElementById(rtype + "_sel");
            var rNow = dom.getElementById(rtype + "_now");
            selObj[rtype]["_setDiv"] = rDom;
            selObj[rtype]["_contantView"] = rSel;
            selObj[rtype]["_titleView"] = rNow;
        }

        var filterBigObj = new util.filterBig(win,dom);
        filterBigObj.setParentclass(parentClass);
        filterBigObj.addEventListenEvent();
        filterBigObj.addEventListener("autoBackParam",_self.takeParam);
        filterBigObj.init(selObj);
    }

    _self.takeParam = function(obj){
        for(var key in obj){
            if(obj[key]){
                filterUse[key] =obj[key];
                selObj[key]["_default"]=obj[key];
            }
        }
    }

    _self.addBackClick=function(){
        var ary = dom.getElementsByName("back_btn");
        for(var i=0; i<ary.length; i++){
            util.addEvent(ary[i], "click", _self.backEvent);
        }
    }

    _self.backEvent=function(e, param){
        parentClass.dispatchEvent("hideReportDetail", param);
    }

    _self.addSaveClick = function (){
        util.addEvent(dom.getElementById("save_submit"), "click", _self.saveEvent,{i:i});
    }

    _self.saveEvent=function(e, param){
        var par = top.param;
        par+="&p=get_bet_edit";
        par+="&betid="+betid;
        par+="&action=edit";
        par+="&ip="+dom.getElementById("input_ip").value;
        par+="&bettime="+dom.getElementById("input_bet_time").value;
        par+="&gold="+dom.getElementById("input_gold").value;
		   par+="&orgscore="+dom.getElementById("input_orgscore").value;
        for(var rtype in filterUse){
            par+="&"+rtype+"="+filterUse[rtype];
        }

        for(var k in ids){
            if(dom.getElementById("input_"+ids[k]+"_order")){
                if(dom.getElementById("input_"+ids[k]+"_order").value != ""){
                    par+="&order_"+ids[k]+"="+dom.getElementById("input_"+ids[k]+"_order").value;
                }

            }

            if(dom.getElementById("input_"+ids[k]+"_ioratio")){
                if(dom.getElementById("input_"+ids[k]+"_ioratio").value != "") {
                    par += "&ioratio_" + ids[k] + "=" + dom.getElementById("input_" + ids[k] + "_ioratio").value;
                }
            }
        }
        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadSaveFinish);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.loadSaveFinish = function (json){
        var hash,param;
        try {
            hash = JSON.parse(json);
            if(hash.status == "success"){
                parentClass.dispatchEvent("showFadeOutMesg", { "text": hash.msg ,"s":5 , "showCopy":"N","value":"" });
                parentClass.dispatchEvent("hideEditDetail");
            }else{
                parentClass.showAlertMsg(hash,param);
            }
        } catch (e) {
            util.err("[" + classname + "]", e);
        }
    }

    _self.addEventListener=function(eventname, eventFunction){
        eventHandler[eventname] = eventFunction;
    }

    _self.dispatchEvent=function(eventname, param){
        if(eventHandler[eventname]) eventHandler[eventname](param);
	}

}