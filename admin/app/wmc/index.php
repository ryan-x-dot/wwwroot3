<?php
include_once "../../include/config.php";
$css_arr = [
    "/style/control/reset.css",
    "/style/control/overcss.css",
];
$js_arr  = [
    "/js/lib/bodyPreventDefault.js",
    "/js/lib/Timer.js",
    "/js/lib/CookieManager.js",
    "/js/lib/parseHTML.js",
    "/js/lib/HttpRequest.js",
    "/js/lib/util.js",
    "/js/lib/getView.js",
    "/js/lib/fastTemplate_a1.js",
    "/js/conf/config_set.js",
    "/js/conf/LS_tw.js",
    "/js/conf/LS_cn.js",
    "/js/conf/LS_us.js",
    "/js/wmc/wmc_index.js",
    "/js/lib/LocalstorageManager.js",
    "/js/lib/login_monitor.js",
    "/js/conf/LS_code_cn.js",
    "/js/conf/LS_code_tw.js",
    "/js/conf/LS_code_us.js",
];

$js = "
        if(typeof console === undefined){
            window.console = new Object();
            window.console.log = emptyFun;
            window.console.error = emptyFun;
        }

        var emptyFun = function(){

        }
";

foreach ($js_arr as $v){
    $js .= getFileTxt(DIR_ADMIN.$v);
    $js .= "\n";
}
$css = "";
$html = getFileTxt(DIR_ADMIN."/html/wmc_index.html");
$html = str_replace('{JS}',$js,$html);
$html = str_replace('{CSS}',$css,$html);
print_r($html);exit;