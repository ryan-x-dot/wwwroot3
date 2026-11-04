var util = null;

function initO(){
    util = new util(window,document);
    initScroll();
}



//=============---------=------------fix
function initScroll(){
    util.addEvent( document.getElementById("wmc_other_page"), "scroll", scrollVerEvent, document.getElementById("wmc_other_page"));	
}

function scrollVerEvent(e,targetObj) {
    scroll_e = e;
    scroll_ver_event(e, targetObj);
}

function scroll_ver_event(e, targetObj) {
    if (e == null || !document.getElementById("detail_head")) return;
    var newScrollTop = e.target.scrollTop;
    var ori_h = e.target.scrollHeight;
    var now_h = 0;
    var func_h = document.getElementById("detail_head").clientHeight + document.getElementById("detail_head").offsetTop ;
    if (newScrollTop > func_h) {
        util.classFunc(targetObj, "wmc_pause");
        now_h = e.target.scrollHeight;
        if (now_h != 0) stop_h = func_h - (ori_h - now_h);
    }
    if(newScrollTop <= func_h){
        util.classFunc(targetObj, "wmc_pause", "remove");
    }

}

