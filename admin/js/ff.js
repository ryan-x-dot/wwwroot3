function creditlogs(){
    var _self = this;
    var parentClass;
    var creditTitleAry = ["logs","pay","outMoney"];
    var _mc = new Object();
    _self.paramHash = new Object();
    _self.paramHash["errorMsg"] = "";
    _self.classname = "credit_logs.js";

    var xmlnode;
    var div_show;
    var _nowPage = 1;
    var _pageCount = 30;

    _self.setParentclass=function(parentclass){
        parentClass=parentclass;
    }

    _self.getThis=function(varible){
        return eval(varible);
    }

    _self.setPrivate=function(varible,val){
        eval(varible+"='"+val+"'");
    }

    //init
    _self.init=function(){
        _self.initTitleEvent();

        noCreditLogsObj = document.getElementById("noCreditLogs");
        noCreditOutMoneyObj = document.getElementById("noCreditOutMoney");
        noPayList = document.getElementById("noPayList");
        bottom_topObj = document.getElementById("bottom_top");
        div_show = document.getElementById("div_show");
        div_show1 = document.getElementById("div_show1");
        div_show_pay = document.getElementById("div_show_pay");

        sportsdropdownObj = document.getElementById("sportsdropdown");
        util_initDateOption(sportsdropdownObj, _top["seldate_array"]);
        _self.addEventListener("SelectEvent.ONCHANGE",_self.chgDate,sportsdropdownObj);

        sportsdropdownObj1 = document.getElementById("sportsdropdown1");
        util_initDateOption(sportsdropdownObj1, _top["seldate_array"]);
        _self.addEventListener("SelectEvent.ONCHANGE",_self.chgDate,sportsdropdownObj1);

        sportsdropdownObj_pay = document.getElementById("sportsdropdown_pay");
        util_initDateOption(sportsdropdownObj_pay, _top["seldate_array"]);
        _self.addEventListener("SelectEvent.ONCHANGE",_self.chgDate,sportsdropdownObj_pay);

        allsportsObj = document.getElementById("allsports");
        _self.addEventListener("MouseEvent.CLICK",_self.showViewMore,allsportsObj);
        _self.addEventListener("exitEventHandler",_self.exitEventHandler);
        _self.addEventListener("reloadEventHandler", function(){});
        _self.initDataClass();
        // dataClass['bottom'].scrollToShowTop();
        // 2019-01-07 201.鎵嬫鏈冨摗绔�-鐩村悜銆佹┇鍚戝垏鎻�-鎵€鏈夌暙闈�-鍥炲埌闋侀浠ラ潨鎱嬪浐瀹氬湪涓嬫柟锛岃綁姝ｅ悜涔熸噳鍒ゆ柗(CRM-339)
        dataClass['bottom'].checkShowTop();

    }

    _self.initTitleEvent=function(){

        _mc["title_todaywagers"] = document.getElementById("title_todaywagers");
        //_mc["title_creditlogs"] = document.getElementById("title_creditlogs");
        _mc["title_history"] = document.getElementById("title_history");


        _mc["logs"] = document.getElementById("logs");
        _mc["pay"] = document.getElementById("pay");
        _mc["outMoney"] = document.getElementById("outMoney");
        _mc["cancel_btn"] = document.getElementById("cancel_btn");
        _mc["login_btn"] = document.getElementById("login_btn");
        _mc["inputOutMoney"] = document.getElementById("inputOutMoney");
        _mc["outTxt"] = document.getElementById("outTxt");
        _mc["div_error"] = document.getElementById("div_error");
        _mc["code_msg"] = document.getElementById("error_msg");

        _mc["div_logs"] = document.getElementById("div_logs");
        _mc["div_pay"] = document.getElementById("div_pay");
        _mc["div_rank"] = document.getElementById("div_rank");
        _mc["div_currency"] = document.getElementById("div_currency");
        _mc["div_top_currency"] = document.getElementById("div_top_currency");
        _mc["div_outMoney"] = document.getElementById("div_outMoney");
        _mc["div_out"] = document.getElementById("div_out");
        _mc["payAry"] = document.getElementById("payAry");

        _mc["sumbitRank"] = document.getElementById("sumbitRank");
        _mc["sumbitRankList"] = document.getElementById("sumbitRankList");
        _mc["sumbitCurrList"] = document.getElementById("sumbitCurrList");
        _mc["sumbitCurrency"] = document.getElementById("sumbitCurrency");

        _mc["rank_time"] = document.getElementById("rank_time");
        _mc["rank_credit"] = document.getElementById("rank_credit");

        _mc["currency_time"] = document.getElementById("currency_time");
        _mc["currency_credit"] = document.getElementById("currency_credit");
        _mc["currency_type"] = document.getElementById("currency_type");

        _mc["div_pay_list"] = document.getElementById("div_pay_list");
        _mc["title_todaywagers"].url = "todaywagers";
        //_mc["title_creditlogs"].url = "credit_logs";
        _mc["title_history"].url = "history_data";

        _self.addEventListener("MouseEvent.CLICK",_self.goToPageHandler,_mc["title_todaywagers"]);
        _self.addEventListener("MouseEvent.CLICK",_self.goToPageHandler,_mc["title_history"]);

        _self.addEventListener("MouseEvent.CLICK",_self.goToLogs,_mc["logs"]);
        _self.addEventListener("MouseEvent.CLICK",_self.goToOutMoney,_mc["outMoney"]);
        _self.addEventListener("MouseEvent.CLICK",_self.goToOutMoneyCancel,_mc["cancel_btn"]);
        _self.addEventListener("MouseEvent.CLICK",_self.goToOutMoneyLogin,_mc["login_btn"]);

        _self.addEventListener("MouseEvent.CLICK",_self.goTosumbitRankRank,_mc["sumbitRank"]);
        _self.addEventListener("MouseEvent.CLICK",_self.goTosumbitCurr,_mc["sumbitCurrency"]);

        _self.addEventListener("MouseEvent.CLICK",_self.goTosumbitList,_mc["sumbitRankList"]);
        _self.addEventListener("MouseEvent.CLICK",_self.goTosumbitList,_mc["sumbitCurrList"]);

        _self.addEventListener("SelectEvent.ONCHANGE",_self.chgPayAry,_mc["payAry"]);
    }



    _self.goTosumbitCurr = function (){
        var credit = _mc["currency_credit"].value;
        var payDate = _mc["currency_time"].value;
        var currType = _mc["currency_type"].value;
        var reg = /^[1-9][0-9]\d*$/;
        var regDate = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
        if(credit == "" || !reg.test(credit)){
            alert(showLS("betError023"));
            return false;
        }

        if(payDate=="" || !regDate.test(payDate)){
            alert(showLS("betError024"));
            return false;
        }

        if(currType == ""){
            alert(showLS("betError025"));
            return false;
        }

        var urlHash = new Array();
        urlHash["uid"] =  _top["userData"].uid;
        urlHash["langx"] = _top["userData"].langx;
        urlHash["addMoney"] = credit;
        urlHash["payDate"] = payDate;
        urlHash["outTxt"] = currType;

        var getHTML = new loadingRequest();
        getHTML.addEventListener("LoadComplete", _self.connectCompleteCurr);
        getHTML.loadURL("/app/set_rank_log.php","POST",convertParam(urlHash));
    }

    _self.connectCompleteCurr = function(xml){
        xmlnode=parseXml(xml);
        var dataHash = convertNodeToHash(xmlnode.Root[0]);


        if(dataHash["status"]=="success"){
            alert(showLS("credit_outOK"));
            _self.goTosumbitList();
        }else{
            alert(showLS(dataHash["error_code"]));
            return;
        }
    }

    _self.goTosumbitRankRank = function () {
        var credit = _mc["rank_credit"].value;
        var payDate = _mc["rank_time"].value;
        var reg = /^[1-9][0-9]\d*$/;
        var regDate = /^[1-9]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1])\s+(20|21|22|23|[0-1]\d):[0-5]\d:[0-5]\d$/;
        if(credit == "" || !reg.test(credit)){
            alert(showLS("betError023"));
            return false;
        }

        if(payDate=="" || !regDate.test(payDate)){
            alert(showLS("betError024"));
            return false;
        }

        var urlHash = new Array();
        urlHash["uid"] =  _top["userData"].uid;
        urlHash["langx"] = _top["userData"].langx;
        urlHash["addMoney"] = credit;
        urlHash["payDate"] = payDate;
        urlHash["outTxt"] = document.getElementById("rank_rank").innerHTML+"/"+document.getElementById("rank_name").innerHTML+"/"+document.getElementById("rank_number").innerHTML;


        var getHTML = new loadingRequest();
        getHTML.addEventListener("LoadComplete", _self.connectCompleteRank);
        getHTML.loadURL("/app/set_rank_log.php","POST",convertParam(urlHash));
    }


    _self.connectCompleteRank = function(xml){
        xmlnode=parseXml(xml);
        var dataHash = convertNodeToHash(xmlnode.Root[0]);


        if(dataHash["status"]=="success"){
            alert(showLS("credit_outOK"));
            _self.goTosumbitList();
        }else{
            alert(showLS(dataHash["error_code"]));
            return;
        }
    }

    _self.goToOutMoneyLogin = function(){
        var Numflag = 0;
        var Letterflag = 0;
        var outMoney = _mc["inputOutMoney"].value;
        var reg = /^[1-9][0-9]\d*$/;
        if(outMoney == "" || !reg.test(outMoney)){
            _self.errorProc("credit_outErr");
            return false;
        }

        _self.connetToServer();

    }

    _self.connetToServer=function(){

        var urlHash = new Array();
        urlHash["uid"] =  _top["userData"].uid;
        urlHash["langx"] = _top["userData"].langx;
        urlHash["outMoney"] = _mc["inputOutMoney"].value;
        urlHash["outTxt"] = _mc["outTxt"].value;


        var getHTML = new loadingRequest();
        getHTML.addEventListener("LoadComplete", _self.connectComplete);
        getHTML.loadURL("/app/set_credit_out_money.php","POST",convertParam(urlHash));


    }

    _self.connectComplete = function(xml){
        xmlnode=parseXml(xml);
        var dataHash = convertNodeToHash(xmlnode.Root[0]);


        if(dataHash["status"]=="success"){
            alert(showLS("credit_outOK"));
            _mc["inputOutMoney"].value = "";
            _mc["outTxt"].value = "";
            _self.goToOutMoneyCancel();
        }else{
            _self.errorProc(showLS(dataHash["error_code"]));
            return;
        }
    }

    _self.goTosumbitList = function () {
        _mc["currency_credit"].value = "";
        _mc["currency_time"].value = "";
        _mc["currency_type"].value = "";
        _mc["rank_credit"].value = "";
        _mc["rank_time"].value = "";

        _mc["logs"].classList.add("credit_color");
        _mc["outMoney"].classList.remove("credit_color");

        _mc["div_logs"].style.display = "";
        _mc["div_pay"].style.display = "none";
        _mc["div_out"].style.display = "none";
        _mc["div_outMoney"].style.display = "none";
        _mc["div_rank"].style.display = "none";
        _mc["div_currency"].style.display = "none";
        _mc["div_pay_list"].style.display = "";
        _mc["payAry"].value = "-";
    }
        _self.loadCreditOutMoney = function () {
            _self.paramHash["langx"] = _top["userData"].langx;
            _self.paramHash["mid"] = _top["userData"].mid;
            _self.paramHash["selDate"] = sportsdropdownObj1.value;

            var urlHash = new Array();
            urlHash["uid"] = _top["userData"].uid;
            urlHash["langx"] = _top["userData"].langx;
            urlHash["LS"] = _top["userData"].shortlangx;
            urlHash["selDate"] = _self.paramHash["selDate"];

            var getHTML = new loadingRequest();
            getHTML.addEventListener("LoadComplete", _self.loadPayListComplete);
            getHTML.loadURL("app/member/get_paylist_data.php", "POST", convertParam(urlHash));
        }

        _self.loadPayListComplete = function(data){
            var json_data = JSON.parse(data);
            if(alertConnectMsg(_self.paramHash["errorMsg"]))	return;
            var tmp_screen = "";
            var from = 0;
            var limit = _nowPage * _pageCount;
            //console.log(limit);
            var totalLength = json_data["length"];

            if(totalLength > limit) allsportsObj.style.display = "";
            else allsportsObj.style.display = "none";
            if(limit > totalLength) limit = totalLength;

            if(totalLength >= 1){
                _self.showNoPayList(false);

                var SampleTable = document.getElementById("template_model_pay");
                var tpl = new fastTemplate();
                tpl.init(SampleTable);
                for(var i=from; i<limit; i++){
                    gdate = json_data[i]["payDate"];
                    gold = json_data[i]["gold"];
                    status = json_data[i]["status"];
                    handle = json_data[i]["handle"];
                    txt = json_data[i]["txt"];
                    tpl.addBlock("tr");
                    var _date = gdate.split(" ");
                    var data_name = _date[0].substr(_date[0].indexOf("-")+1);
                    tpl.replace("*DATE*",showTxt(_date[0]));
                    tpl.replace("*DATE_NAME*",showTxt(data_name));
                    tpl.replace("*WEEK_NAME*",showTxt(_date[1]));
                    tpl.replace("*BALANCE*",formatThousand(gold.toFixed(2)));
                    tpl.replace("*BANKS*",txt);
                    tpl.replace("*STATUS*",status);
                    tpl.replace("*HANDLE*",handle);
                }

                var tmpDiv = tpl.fastPrint();
                div_show_pay.innerHTML = tmpDiv;
            }
            else{
                div_show_pay.innerHTML = "";
                _self.showNoPayList(true);
            }
            dataClass["bottom"].checkShowTop();
            setLoadingVisible(false);
        }


        _self.goToLogs = function(){
            _mc["logs"].classList.add("credit_color");
            _mc["outMoney"].classList.remove("credit_color");

            _mc["div_logs"].style.display = "";
            _mc["div_pay"].style.display = "none";
            _mc["div_out"].style.display = "none";
            _mc["div_outMoney"].style.display = "none";
            _mc["div_rank"].style.display = "none";
            _mc["div_currency"].style.display = "none";
            _mc["div_pay_list"].style.display = "none";
            _mc["payAry"].value = "-";
            _self.loadCreditLog();
        }

        _self.chgPayAry = function(){
            _mc["logs"].classList.remove("credit_color");
            _mc["outMoney"].classList.remove("credit_color");

            _mc["div_logs"].style.display = "none";
            _mc["div_out"].style.display = "none";
            _mc["div_outMoney"].style.display = "none";
            _mc["div_pay_list"].style.display = "none";
            if(_mc["payAry"].value == "pay"){
                _mc["div_pay"].style.display = "";
                _mc["div_rank"].style.display = "none";
                _mc["div_currency"].style.display = "none";
            }else if(_mc["payAry"].value == "rank"){
                _mc["div_pay"].style.display = "none";
                _mc["div_rank"].style.display = "";
                _mc["div_currency"].style.display = "none";
                _mc["rank_credit"].value = "";
                _mc["rank_time"].value = "";
            }else if(_mc["payAry"].value == "currency"){
                _mc["div_pay"].style.display = "none";
                _mc["div_rank"].style.display = "none";
                _mc["div_currency"].style.display = "";
            }

            _mc["inputOutMoney"].value = "";
            _mc["outTxt"].value = "";
            _self.loadCreditPay();
        }

        _self.goToOutMoney = function(){
            _mc["logs"].classList.remove("credit_color");
            _mc["outMoney"].classList.add("credit_color");

            _mc["div_logs"].style.display = "none";
            _mc["div_pay"].style.display = "none";
            _mc["div_out"].style.display = "";
            _mc["div_outMoney"].style.display = "none";
            _mc["div_rank"].style.display = "none";
            _mc["div_currency"].style.display = "none";
            _mc["div_pay_list"].style.display = "none";
            _mc["payAry"].value = "-";
            _self.loadCreditOutMoney();
        }

        _self.goToOutMoneyCancel = function(){
            _mc["logs"].classList.remove("credit_color");
            _mc["pay"].classList.remove("credit_color");
            _mc["outMoney"].classList.add("credit_color");

            _mc["div_logs"].style.display = "none";
            _mc["div_pay"].style.display = "none";
            _mc["div_out"].style.display = "none";
            _mc["div_pay_list"].style.display = "none";
            _mc["div_outMoney"].style.display = "";

            _mc["inputOutMoney"].value = "";
            _mc["outTxt"].value = "";
        }

        _self.loadCreditPay = function(){
            var urlHash = new Array();
            urlHash["uid"] =  _top["userData"].uid;
            urlHash["langx"] = _top["userData"].langx;

            var getHTML = new loadingRequest();
            getHTML.addEventListener("LoadComplete",_self.loadCreditPayComple);
            getHTML.loadURL("app/member/get_credit_pay.php","POST",convertParam(urlHash));
        }

        _self.loadCreditPayComple = function(data){
            var json_data = JSON.parse(data);
            if(_mc["payAry"].value == "pay"){
                var pay = json_data.pay;
                document.getElementById("ewm").src = "app/member/"+pay.src;
                document.getElementById("qbdz").value = pay.qbdz;
                _mc["copy_qbdz"] = document.getElementById("copy_qbdz");
                _self.addEventListener("MouseEvent.CLICK",_self.copyQbdz,_mc["copy_qbdz"]);
            }

            if(_mc["payAry"].value == "rank"){
                var rank = json_data.rank;
                document.getElementById("rank_rank").innerHTML = rank.rank;
                document.getElementById("rank_name").innerHTML = rank.name;
                document.getElementById("rank_number").innerHTML = rank.number;
            }


            if(_mc["payAry"].value == "currency"){
                var currency = json_data.currency;
                var curr = "";
                var xmpcurr = document.getElementById("xmp_currency").innerHTML;
                for(var i=0;i<currency.length;i++){
                    curr += xmpcurr;
                    curr = curr.replace("<XMP>","").replace("</XMP>","").replace("<xmp>","").replace("</xmp>","");
                    curr = curr.replace("*NUMBERID*",i);
                    curr = curr.replace("*ID*",i);
                    curr = curr.replace("*VALUE*",currency[i]["address"]);
                    curr = curr.replace("*CURRNAME*",currency[i]["name"]);
                }
                _mc["div_top_currency"].innerHTML = curr;
                var copy_qbdz = document.getElementsByName("copy_qbdz");

                for(var k=0;k<copy_qbdz.length;k++){
                    _self.addEventListener("MouseEvent.CLICK",_self.copyQbdz1,copy_qbdz[k],{"i":k});
                }

            }
        }

        _self.copyQbdz1 = function(e,v){
            _self.copyText( document.getElementById('qbdz'+v.getAttribute("number")).value, function (){console.log('复制成功')});
        }

        _self.copyQbdz = function(){ // 点击按钮调用复制
            _self.copyText( document.getElementById('qbdz').value, function (){console.log('复制成功')});
        }

        _self.copyText = function(text, callback){ // text: 要复制的内容， callback: 回调
            var tag = document.createElement('input');
            tag.setAttribute('id', 'cp_hgz_input');
            tag.value = text;
            document.getElementsByTagName('body')[0].appendChild(tag);
            document.getElementById('cp_hgz_input').select();
            document.execCommand('copy');
            document.getElementById('cp_hgz_input').remove();
            if(callback) {callback(text)}
        }




        _self.initDataClass=function(){
            dataClass["header"] = extendsClass(_top["MovieClipClass"], header);
            dataClass["header"].init();
            dataClass["bottom"] = extendsClass(_top["MovieClipClass"], bottom);
            dataClass["bottom"].init();


            dataClass["header"].setParentclass(_self);
            dataClass["bottom"].setParentclass(_self);
            dataClass["header"].setBackPage("home");
            _self.loadCreditLog();

        }

        //exit
        _self.exitEventHandler=function(url){
            loadHtml_loading(url, true);
        }

        _self.loadCreditOutMoney = function(){
            _self.paramHash["langx"] = _top["userData"].langx;
            _self.paramHash["mid"] = _top["userData"].mid;
            _self.paramHash["selDate"] = sportsdropdownObj1.value;

            var urlHash = new Array();
            urlHash["uid"] =  _top["userData"].uid;
            //urlHash["mid"] =  _top["userData"].mid;
            urlHash["langx"] = _top["userData"].langx;
            urlHash["LS"] = _top["userData"].shortlangx;
            urlHash["selDate"] = _self.paramHash["selDate"];

            var getHTML = new loadingRequest();
            getHTML.addEventListener("LoadComplete",_self.loadCreditOutMoneyComplete);
            getHTML.loadURL("app/member/get_credit_out_data.php","POST",convertParam(urlHash));
        }

        _self.loadCreditOutMoneyComplete = function(data){
            var json_data = JSON.parse(data);
            if(alertConnectMsg(_self.paramHash["errorMsg"]))	return;
            var tmp_screen = "";
            var from = 0;
            var limit = _nowPage * _pageCount;
            //console.log(limit);
            var totalLength = json_data["length"];
            //var pay_type = json_data["pay_type"];
            //if(pay_type != 1)document.getElementById("title_creditlogs").style = "display: none;";
            //else document.getElementById("title_creditlogs").style = "";
            if(totalLength > limit) allsportsObj.style.display = "";
            else allsportsObj.style.display = "none";
            if(limit > totalLength) limit = totalLength;

            if(totalLength >= 1){
                _self.showNoCreditOutMoney(false);

                var SampleTable = document.getElementById("template_model1");
                var tpl = new fastTemplate();
                tpl.init(SampleTable);
                for(var i=from; i<limit; i++){
                    gdate = json_data[i]["addTime"];
                    gold = json_data[i]["gold"];
                    status = json_data[i]["status"];
                    handle = json_data[i]["handle"];
                    txt = json_data[i]["txt"];
                    tpl.addBlock("tr");
                    var _date = gdate.split(" ");
                    var data_name = _date[0].substr(_date[0].indexOf("-")+1);
                    tpl.replace("*DATE*",showTxt(_date[0]));
                    tpl.replace("*DATE_NAME*",showTxt(data_name));
                    tpl.replace("*WEEK_NAME*",showTxt(_date[1]));
                    tpl.replace("*BALANCE*",formatThousand(gold.toFixed(2)));
                    tpl.replace("*BANKS*",txt);
                    tpl.replace("*STATUS*",status);
                    tpl.replace("*HANDLE*",handle);
                }

                var tmpDiv = tpl.fastPrint();
                div_show1.innerHTML = tmpDiv;
            }
            else{
                div_show1.innerHTML = "";
                _self.showNoCreditOutMoney(true);
            }
            dataClass["bottom"].checkShowTop();
            setLoadingVisible(false);
        }


        _self.loadCreditLog=function(){
            _self.paramHash["langx"] = _top["userData"].langx;
            _self.paramHash["mid"] = _top["userData"].mid;
            _self.paramHash["selDate"] = sportsdropdownObj.value;

            var urlHash = new Array();
            urlHash["uid"] =  _top["userData"].uid;
            //urlHash["mid"] =  _top["userData"].mid;
            urlHash["langx"] = _top["userData"].langx;
            urlHash["LS"] = _top["userData"].shortlangx;
            urlHash["selDate"] = _self.paramHash["selDate"];


            var getHTML = new loadingRequest();
            getHTML.addEventListener("LoadComplete",_self.loadCreditLogComplete);
            getHTML.loadURL("app/member/get_credit_logs.php","POST",convertParam(urlHash));
        }

        _self.loadCreditLogComplete=function(data){
            var json_data = JSON.parse(data);
            if(alertConnectMsg(_self.paramHash["errorMsg"]))	return;
            var tmp_screen = "";
            var from = 0;
            var limit = _nowPage * _pageCount;
            //console.log(limit);
            var totalLength = json_data["length"];
            //var pay_type = json_data["pay_type"];
            //if(pay_type != 1)document.getElementById("title_creditlogs").style = "display: none;";
            //else document.getElementById("title_creditlogs").style = "";
            if(totalLength > limit) allsportsObj.style.display = "";
            else allsportsObj.style.display = "none";
            if(limit > totalLength) limit = totalLength;

            if(totalLength >= 1){
                _self.showNoCreditLogs(false);

                var SampleTable = document.getElementById("template_model");
                var tpl = new fastTemplate();
                tpl.init(SampleTable);
                for(var i=from; i<limit; i++){
                    gdate = json_data[i]["adddate"];
                    payway = json_data[i]["payway"];
                    gold = json_data[i]["gold"];
                    user_cash = json_data[i]["cash"];
                    tpl.addBlock("tr");
                    var _date = gdate.split(" ");
                    var data_name = _date[0].substr(_date[0].indexOf("-")+1);
                    tpl.replace("*DATE*",showTxt(_date[0]));
                    tpl.replace("*DATE_NAME*",showTxt(data_name));
                    tpl.replace("*WEEK_NAME*",showTxt(_date[1]));

                    // if(i==limit){ // 绗竴绛嗛搴︿慨鏀圭磤閷勮甯跺叆鍒濆椤嶅害
                    // 	tpl.replace("*BALANCE*",formatThousand(json_data["maxcredit"].toFixed(2)));
                    // 	if(payway == 1){
                    // 		tpl.replace("*GOLD_COLOR*","credit_deposit");
                    // 		tpl.replace("*GOLD*","+ "+showTxt(formatThousand(gold)));
                    // 	}
                    // 	else if(payway == -1){
                    // 		tpl.replace("*GOLD_COLOR*","credit_withdraw");
                    // 		tpl.replace("*GOLD*","- "+showTxt(formatThousand(gold)));
                    // 	}
                    // }
                    // else if(i!=limit){
                    if(payway == 1){
                        var tmp_balance = (user_cash*1) - (gold*1);
                        tpl.replace("*BALANCE*",formatThousand(tmp_balance.toFixed(2)));
                        tpl.replace("*GOLD_COLOR*","credit_deposit");
                        tpl.replace("*GOLD*",showTxt(formatThousand(gold)));
                    }
                    else if(payway == -1){
                        var tmp_balance = (user_cash*1) + (gold*1);
                        tpl.replace("*BALANCE*",formatThousand(tmp_balance.toFixed(2)));
                        tpl.replace("*GOLD_COLOR*","credit_withdraw");
                        tpl.replace("*GOLD*","-"+showTxt(formatThousand(gold)));
                    }
                    //}

                    tpl.replace("*NEWBALANCE*",showTxt(formatThousand(user_cash)));
                }

                var tmpDiv = tpl.fastPrint();
                div_show.innerHTML = tmpDiv;
            }
            else{
                div_show.innerHTML = "";
                _self.showNoCreditLogs(true);
            }
            dataClass["bottom"].checkShowTop();
            setLoadingVisible(false);
        }


        _self.showViewMore=function(){
            _nowPage++;
            _self.loadCreditLog();
        }

        _self.showNoCreditLogs=function(isOk){
            if(isOk){
                noCreditLogsObj.style.display = "";
                allsportsObj.style.display = "none";
                bottom_topObj.style.display = "none";
            }else{
                noCreditLogsObj.style.display = "none";
                //allsportsObj.style.display = "";
                //bottom_topObj.style.display = "";
            }
        }

        _self.showNoCreditOutMoney=function(isOk){
            if(isOk){
                noCreditOutMoneyObj.style.display = "";
                allsportsObj.style.display = "none";
                bottom_topObj.style.display = "none";
            }else{
                noCreditOutMoneyObj.style.display = "none";
                //allsportsObj.style.display = "";
                //bottom_topObj.style.display = "";
            }
        }

        _self.showNoPayList=function(isOk){
            if(isOk){
                noPayList.style.display = "";
                allsportsObj.style.display = "none";
                bottom_topObj.style.display = "none";
            }else{
                noPayList.style.display = "none";
                //allsportsObj.style.display = "";
                //bottom_topObj.style.display = "";
            }
        }


        //goToPageHandler
        _self.goToPageHandler=function(mouseEvent,targetObj){
            var url = "tpl/"+_top["userData"].langx+"/"+targetObj.url+".html";
            loadHtml_loading(url,true);

        }

        _self.chgDate=function(){
            _nowPage = 1;
            _self.loadCreditLog();
        }

        /*_self.clearInput=function(){
                for(var i=0; i<objAry.length; i++){
                        _mc[objAry[i]].value = "";
                }
        }*/


        //show code msg
        _self.showCodeMsg=function(isShow){
            _mc["div_error"].style.display=(isShow)?"":"none";
        }


        //set code msg
        _self.setCodeMsg=function(msg, isSuccess){
            _mc["code_msg"].innerHTML = msg;
            setObjectClass(_mc["code_msg"] , (isSuccess==true)?"success_msg":"error_msg");
        }

        _self.errorProc=function(msg){
            _self.setCodeMsg(showLS(msg));
            _self.showCodeMsg(true);
            //_self.clearInput();
        }
    }
//extends
    dataClass["credit_logs"] = extendsClass(_top["MovieClipClass"],creditlogs);
    dataClass["credit_logs"].init();