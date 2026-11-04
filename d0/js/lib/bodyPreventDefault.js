// 2018-01-15 iphone UC 瀏覽器使用body position:fixed 造成螢幕最下方會有黑色遮住交易單
function bodyPreventDefault(){
    var _self = this;
    var ts = new Object;
    //🌖538.ios-safari&uc-報表-在細單層滑動時, 點開右側在滑動左邊區空, 上方標題列不應該被滑動(PJP-553)
    // 多3px 誤差 讓左右還可以滑動
    var fixY = 10;
    var bet_content = document.getElementById("body_show");


    var top_menu = document.getElementById("top_menu_show");
    var main_menu = document.getElementById("dashboard_main");
    var bottom_menu = document.getElementById("bottom_menu_show");

    _self.init = function(){

        // document.body.addEventListener("touchstart",_self.bodyScroll);
        // document.body.addEventListener("touchmove",_self.bodyScroll);

        _self.blockMovedownRefresh(window, document, "prev_scroll_lock");
    }

    // _self.remove=function(){
    //     document.body.removeEventListener("touchstart",_self.bodyScroll);
    //     document.body.removeEventListener("touchmove",_self.bodyScroll);
    // }


    // _self.bodyScroll = function (e){
    //     _self.listenEvent(e,document.getElementById(e.target.id));
    // }

    // _self.touchObject = function(targetObject, eventObject){
    //     try{
    //         // 取得當下指定物件以下的所有物件
    //         var allobj = targetObject.getElementsByTagName("*");
    //         // 最底層的物件（只有他自己）
    //         if (allobj.length==0) return true;
    //         for (var i=0;i<allobj.length;i++){
    //             if (allobj[i]==eventObject){
    //                 return true;
    //             }
    //         }
    //     }catch(e){
    //         return false;
    //     }

    //     return true;
    // }

    // _self.listenEvent = function (e,targetObject){
    //     var touch=e.targetTouches[0];
    //     if (e.type=="touchstart"){
    //         ts.x=touch.pageX;
    //         ts.y=touch.pageY;
    //     }

    //     //例外的物件（必須執行的指定物件）之外的物件
    //     if (!_self.touchObject(targetObject,e.target)){
    //         // e.target.id = "" 代表物件移轉到body身上
    //         if(e.target.id!="") _self.stopBodyDefaultEvent(e);
    //     }else{
    //         // 捲到捲到指定物件頁首
    //         if (targetObject.scrollTop==0){
    //             if (ts.y-touch.pageY<0){
    //                 if (e.type=="touchmove"){
    //                     _self.stopBodyDefaultEvent(e);
    //                 }
    //             }
    //         }

    //         // 捲到指定物件的頁尾
    //         if ((targetObject.scrollTop+targetObject.clientHeight)==targetObject.scrollHeight){
    //             if (ts.y-touch.pageY>0){
    //                 if (e.type=="touchmove"){
    //                     _self.stopBodyDefaultEvent(e);
    //                 }
    //             }
    //         }
    //     }
    // }

    // _self.stopBodyDefaultEvent = function(e){
    //     // if(top.username=="pp") alert("stopBodyDefaultEvent");
    //     e.preventDefault();
    //     e.stopPropagation();
    // }

    //========= block move down refresh =========

    _self.blockMovedownRefresh = function (wd, doc, lock_tag) {

        var isWindowTop = false;
        var isWindowBottom = false;
        var startTouchY = 0;

        //roland
        var isTopMove = false;
        var isBottomMove = false;

        var touchStartHandler = function(e) {
            if (e.touches.length !== 1) return;
            startTouchY = e.touches[0].clientY;

            // isWindowTop = (wd.pageYOffset <= 10);
            // console.log("event:"+e.target.id);
            var scrollObj = getScrollObj(e);
            // console.log(scrollObj);
            if(scrollObj==null) return;

            // isWindowTop = (scrollObj.scrollTop <= 0);
            var urlHeight=document.body.scrollTop;

            // var urlHeightBody = document.body.scrollHeight - document.body.clientHeight;
            // if(urlHeight > urlHeightBody) urlHeight = urlHeightBody;

            isWindowTop = (scrollObj.scrollTop+urlHeight <= 0);
            isWindowBottom = (scrollObj.scrollTop + scrollObj.clientHeight >= scrollObj.scrollHeight);
            isWindowBottom = isWindowBottom && (!getBottomIgnoreObj(e)); //特定物件 需要使用x軸向不跑該邏輯 EX報表

            writeLog("urlHeight:"+urlHeight+" scrollTop:"+scrollObj.scrollTop+" clientHeight:"+scrollObj.clientHeight+" scrollHeight:"+scrollObj.scrollHeight);
            writeLog("scrollObj.id = "+scrollObj.id+"  "+"isWindowTop = "+isWindowTop+" isWindowBottom = "+isWindowBottom);
        };

        var getScrollObj = function(e){
            var obj = e.target;
            return checkParentNode(obj);
        }

        var checkParentNode = function(obj){
            //writeLog("[checkParentNode] id:"+obj.id+" name:"+obj.name+" className:"+obj.className);
            if (obj.getAttribute && obj.getAttribute("name") == lock_tag){
                return obj;
            } else if (obj["prev_scroll_lock"] == true){
                return obj;
            } else if (obj.classList && obj.classList.contains("re_detail_scroll")) {
                return obj;
            }else{
                obj = getParentNode(obj);
                //writeLog("[getParentNode]"+obj.id);
                if(obj==null) return null;
                return checkParentNode(obj);
            }
        }

        var getBottomIgnoreObj = function (e) {
            var obj = e.target;
            return checkParentBottomIgnore(obj);
        }

        var checkParentBottomIgnore = function (obj) {
            writeLog("[checkParentNode]"+obj.id);
            if (obj.prevScrollBottomIgnore) {
                return true;
            } else {
                obj = getParentNode(obj);
                //writeLog("[getParentNode]"+obj.id);
                if (obj == null) return false;
                return checkParentBottomIgnore(obj);
            }
        }

        var getParentNode = function(_node){
            return _node.parentNode;
        }

        var touchMoveHandler = function(e) {
            var nowTouchY = e.touches[0].clientY;

            writeLog("[touch move]isWindowTop="+isWindowTop+" isWindowBottom="+isWindowBottom+", "+startTouchY+" >< "+nowTouchY+" -+ "+fixY);
            if (isWindowTop) {
                if( startTouchY < nowTouchY - fixY){  //往下
                    writeLog("[touch move]block down");
                    e.preventDefault();
                    _self.androidBlock(true);
                    return false;
                }
            }
            if (isWindowBottom) {
                if (startTouchY > nowTouchY + fixY) {
                    writeLog("[touch move]block up");
                    e.preventDefault();
                    _self.androidBlock(true);
                    return false;
                }
            }
            /*
            writeLog("[window.screen.height]  "+window.screen.height);
            writeLog("[document.body.clientHeight]  "+document.body.clientHeight);

            writeLog("[top_menu][offsetTop]  "+top_menu.offsetTop);
            writeLog("[top_menu][offsetHeight]  "+top_menu.offsetHeight);

            writeLog("[main_menu][offsetTop]  "+main_menu.offsetTop);
            writeLog("[main_menu][offsetHeight]  "+main_menu.offsetHeight);

            writeLog("[bottom_menu][offsetTop]  "+bottom_menu.offsetTop);
            writeLog("[bottom_menu][offsetHeight]  "+bottom_menu.offsetHeight);

            if ( top_menu.offsetTop < 0 ) {
                writeLog("[touch move][offsetTop]block down");
                e.preventDefault();
                _self.androidBlock(true);
                return false;
            }
            if (top_menu.offsetTop+top_menu.offsetHeight > document.body.clientHeight) {
                writeLog("[touch move][offsetTop]block up");
                e.preventDefault();
                _self.androidBlock(true);
                return false;
            }
            if (bottom_menu.offsetTop+bottom_menu.offsetHeight > document.body.clientHeight) {
                writeLog("[touch move][offsetTop]block up");
                e.preventDefault();
                _self.androidBlock(true);
                return false;
            }
            */
        };

        var in_array = function(txt, ary){
            for(var i=0; i<ary.length; i++){
                if(ary[i]==txt)  return true;
            }
            return false;
        }


        var touchEndHandler = function(e) {
            _self.androidBlock(false);
        }

        doc.body.addEventListener('touchstart', touchStartHandler, false);
        doc.body.addEventListener('touchmove', touchMoveHandler, {passive: false});
        doc.body.addEventListener('touchend', touchEndHandler, false);

    }

    _self.androidBlock=function(isBlock){
        var sty = document.body.getAttribute("style") || "";
        sty = sty.replace(/touch-action:none;/gi,"");
        var blk = (isBlock)? "touch-action:none;" : "";
        document.body.setAttribute("style", sty+blk);
    }

    function writeLog(msg){
        if(top.username=="roland"){
            //console.log(msg);
            return "";
            var _url = document.location.protocol+"//"+document.domain + "/lib/write_log.php";
            var param = "";
            param+="user="+top.username;
            param+="&msg="+encodeURIComponent(msg);
            //param+="&msg="+msg;

            var hr = new HttpRequest();
            hr.addEventListener("LoadComplete", function(){});
            hr.loadURL(_url,"POST",param);
        }
    }

    //========= block move down refresh =========

}

