<?php
include_once "../../include/config.php";
$css_arr = [
    "/style/control/reset.css",
    "/style/control/overcss.css",
    "/style/control/report_control00.css",
    "/style/control/register_email.css",
    "/style/control/rwd.css",
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
    "/js/record/record_index.js",
    "/js/lib/LocalstorageManager.js",
    "/js/conf/LS_code_cn.js",
    "/js/conf/LS_code_tw.js",
    "/js/conf/LS_code_us.js",
];

$css = "";
foreach ($css_arr as $v) {
    $css .= getFileTxt(DIR_ADMIN.$v);
}

$js = getFileTxt(DIR_ADMIN."/js/lib/bodyPreventDefault.js");
$js .= "
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

$html = getFileTxt(DIR_ADMIN."/html/{$langx}/app/record/index.html");
$html = str_replace('{JS}',$js,$html);
$html = str_replace('{CSS}',$css,$html);
print_r($html);exit;
?>