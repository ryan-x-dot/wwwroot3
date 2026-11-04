function bet_result_detail(_win, _dom, _post){
    var _self = this;
    var classname = "bet_result_detail";
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
    var _mc = new Object();

    _self.init=function(){
        util.echo(classname+" load complete");
    }

    _self.getGameName  = function(id){
        var par = "";
        par+=top.param;
        par+="&p=get_wtype_result_list";
        par+="&betid="+id;


        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadGameNameFinish);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.loadGameNameFinish = function (json){
        var hash;
        game_name = "no";
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
        _mc = new Object();
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
        ary = new Array("DATE","TIME","ODDF_TYPE","TID","IS_P","BETTIME","SRV_IP","GOLD");
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
            /*_self.addSelectEvent(hash[k]);*/
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
        ary = new Array("ARESULT","SRESULT","CRESULT","D0RESULT");
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
        ary = new Array("GOLD", "WIN_GOLD", "K_WIN_GOLD", "WIN_GOLD_CLASS", "BALL_ACT", "COMWINLOSS");
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
        _self.addInputSelect();
        _self.setSelectEvent();
        _self.addBackClick();
        util.addEvent(dom.getElementById("btn_cancel"), "click",_self.dataCancel);//重置
        util.addEvent(dom.getElementById("btn_save"), "click",_self.saveEvent);
    }


    _self.dataCancel = function(){
        _self.addInputSelect();
    }

    _self.saveEvent=function(e, param){
        var par = top.param;
        par+="&p=get_bet_edit";
        par+="&betid="+betid;
        par+="&action=result";

        if(game_name == "no"){
            var rtype = "select_"+betid;
            par+="&"+rtype+"="+filterUse[rtype];
        }else{//data: {128: []} 需要处理
            for (var id in game_name){
                if(game_name[id].length == 0){
                    var rtype = "select_"+betid;
                    par+="&"+rtype+"="+filterUse[rtype];
                }else {
                    for (var k in game_name[id]) {
                        var types = game_name[id][k]["type"];
                        for (var t in types) {
                            if (t == "input") {
                                if (types[t].hasOwnProperty("GMH")) {
                                    var inputIDH = "input_" + id + "_GMH";
                                    var inputIDC = "input_" + id + "_GMC";
                                    par += "&" + inputIDH + "=" + dom.getElementById(inputIDH).value;
                                    par += "&" + inputIDC + "=" + dom.getElementById(inputIDC).value;
                                }

                                if (types[t].hasOwnProperty("HGMH")) {
                                    var inputIDH = "input_" + id + "_HGMH";
                                    var inputIDC = "input_" + id + "_HGMC";
                                    par += "&" + inputIDH + "=" + dom.getElementById(inputIDH).value;
                                    par += "&" + inputIDC + "=" + dom.getElementById(inputIDC).value;
                                }
                            }
                        }
                    }
                }
            }

            for(var rt in filterUse){
                par += "&"+rt+"="+filterUse[rt];
            }
        }

        var getHttp = new HttpRequest();
        getHttp.addEventListener("onError", _self.onError);
        getHttp.addEventListener("LoadComplete", _self.loadSaveFinish);
        getHttp.loadURL(top.url, "POST", par);
    }

    _self.addInputSelect = function (){
        var inputs  = dom.getElementById("add_input").innerHTML;
        var selects = dom.getElementById("add_select").innerHTML;
        var results = dom.getElementById("add_result").innerHTML;

        if(game_name == "no"){
            var add_i = results;
            add_i = add_i.replace(new RegExp("\\\*ID\\\*","gi"),betid);
            dom.getElementById("input_select_"+betid).innerHTML = add_i;
            selObj["result_" + betid] = {
                "info_mode": true,
                "title_mode": true,
                "_setDiv": null,
                "_titleView": null,
                "_titleName": "",
                "_contantView": null,
                "_type": null,
                "_viewClass": "active",
                "_list": ["W","L","T","HW","HL"],
                "_listSub": ["赢","输","退还","赢一半","输一半"],
                "_data":[],
                "mode": 1,
                "_chkClass": "",
                "_default": "W",
                "_act": true,
            };
        }else{
            for(var id in game_name){
                if(game_name[id] == 0){
                    var add_i = results;
                    add_i = add_i.replace(new RegExp("\\\*ID\\\*","gi"),betid);
                    dom.getElementById("input_select_"+betid).innerHTML = add_i;
                    selObj["result_" + betid] = {
                        "info_mode": true,
                        "title_mode": true,
                        "_setDiv": null,
                        "_titleView": null,
                        "_titleName": "",
                        "_contantView": null,
                        "_type": null,
                        "_viewClass": "active",
                        "_list": ["W","L","T","HW","HL"],
                        "_listSub": ["赢","输","退还","赢一半","输一半"],
                        "_data":[],
                        "mode": 1,
                        "_chkClass": "",
                        "_default": "W",
                        "_act": true,
                    };
                }else{
                    var input_select = "";
                    for(var k in game_name[id]){
                        var types = game_name[id][k]["type"];
                        for(var t in types) {
                            if(t=="input"){
                                var add_i = inputs;
                                add_i = add_i.replace(new RegExp("\\\*ID\\\*","gi"),id);
                                add_i = add_i.replace(new RegExp("\\\*NAME\\\*","gi"),game_name[id][k]["title"]);
                                if(types[t].hasOwnProperty("GMH")){
                                    add_i = add_i.replace(new RegExp("\\\*H_SCORE_NAME\\\*","gi"),"GMH");
                                    add_i = add_i.replace(new RegExp("\\\*C_SCORE_NAME\\\*","gi"),"GMC");
                                    add_i = add_i.replace(new RegExp("\\\*H_VALUE\\\*","gi"),types[t]["GMH"]);
                                    add_i = add_i.replace(new RegExp("\\\*C_VALUE\\\*","gi"),types[t]["GMC"]);
                                }
                                if(types[t].hasOwnProperty("HGMH")){
                                    add_i = add_i.replace(new RegExp("\\\*H_SCORE_NAME\\\*","gi"),"HGMH");
                                    add_i = add_i.replace(new RegExp("\\\*C_SCORE_NAME\\\*","gi"),"HGMC");
                                    add_i = add_i.replace(new RegExp("\\\*H_VALUE\\\*","gi"),types[t]["HGMH"]);
                                    add_i = add_i.replace(new RegExp("\\\*C_VALUE\\\*","gi"),types[t]["HGMC"]);
                                }

                                input_select+=add_i;
                            }

                            if(t=="select"){
                                var add_i = selects;
                                var selectID = id+"_"+k;
                                add_i = add_i.replace(new RegExp("\\\*ID\\\*","gi"),selectID);
                                add_i = add_i.replace(new RegExp("\\\*NAME\\\*","gi"),game_name[id][k]["title"]);
                                input_select+=add_i;
                                selObj["select_" + selectID] = {
                                    "info_mode": true,
                                    "title_mode": true,
                                    "_setDiv": null,
                                    "_titleView": null,
                                    "_titleName": "",
                                    "_contantView": null,
                                    "_type": null,
                                    "_viewClass": "active",
                                    "_list": [],
                                    "_listSub": [],
                                    "_data":[],
                                    "mode": 1,
                                    "_chkClass": "",
                                    "_default": "",
                                    "_act": true,
                                };
                                var key = 0;
                                for(var list in types["select"]){
                                    selObj["select_" + selectID]["_list"][key] = list;
                                    selObj["select_" + selectID]["_data"][key] = list;
                                    selObj["select_" + selectID]["_listSub"][key] = types["select"][list];
                                    selObj["select_" + selectID]["_default"] = game_name[id][k]["title"];
                                    if(game_name[id][k]["default"] && types["select"][game_name[id][k]["default"]]){
                                        selObj["select_" + selectID]["_default"] = game_name[id][k]["default"];
                                    }

                                    key++;
                                }
                            }
                        }
                    }
                    dom.getElementById("input_select_"+id).innerHTML = input_select;
                }

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