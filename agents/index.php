<?php
include_once "./include/config.php";

global $db_c;
$con_table = Constant::T_CONFIG_DEFAULT;
$conn = $db_c->select("SELECT * FROM {$con_table} WHERE `id`>0 LIMIT 1","Row");
$maintain_sw = isset($conn["website"]) && $conn["website"]==1 ? "Y"  : "N";//是否维护
if($maintain_sw == "Y"){
    $css_arr = [
        "/style/control/reset.css",
        "/style/control/report_control00.css",
        "/style/control/overcss.css",
        "/style/control/main_control.css",
    ];
    $js_arr  = [
        "/js/refresh.js",
        "/js/lib/HttpRequest.js",
        "/js/lib/util.js"
    ];
    $js = "
        top.ver = 'version-12-29';
        top.ls = 'cn';
        top.langx = 'zh-cn';
        top.login_layer = 'co';
        top.uid = '';
        var oldSite = 'https://205.201.4.141';  
    ";
    $name = "maintain.html";
}else{
    $css_arr = [
        "/style/control/reset.css",
        "/style/control/report_control00.css",
        "/style/control/overcss.css",
        "/style/control/main_control.css",
    ];
    $js_arr  = [
        "/js/lib/bodyPreventDefault.js",
        "/js/lib/Timer.js",
        "/js/lib/CookieManager.js",
        "/js/lib/LocalstorageManager.js",
        "/js/lib/parseHTML.js",
        "/js/lib/getView.js",
        "/js/lib/fastTemplate_a1.js",
        "/js/conf/config_set.js",
        "/js/conf/LS_tw.js",
        "/js/conf/LS_code_tw.js",
        "/js/conf/LS_report_tw.js",
        "/js/conf/LS_account_tw.js",
        "/js/conf/LS_cn.js",
        "/js/conf/LS_code_cn.js",
        "/js/conf/LS_report_cn.js",
        "/js/conf/LS_account_cn.js",
        "/js/conf/LS_us.js",
        "/js/conf/LS_code_us.js",
        "/js/conf/LS_report_us.js",
        "/js/conf/LS_account_us.js",
        "/js/index.js",
        "/js/lib/HttpRequest.js",
        "/js/lib/util.js"
    ];

    $js = "
        top.ver = 'version-12-29';
        top.ls = 'cn';
        top.langx = 'zh-cn';
        top.login_layer = 'co';
        top.uid = '';
        var oldSite = 'https://205.201.4.141';  
    ";
    $js .= getFileTxt(DIR_ADMIN."/js/lib/bodyPreventDefault.js");
    $js .= "
            if(typeof console === undefined){
                window.console = new Object();
                window.console.log = emptyFun;
                window.console.error = emptyFun;
            }
    
            var emptyFun = function(){
    
            }
    ";
    $name = "index.html";
}



$css = "";
foreach ($css_arr as $v) {
    $css .= getFileTxt(DIR_ADMIN.$v);
}


foreach ($js_arr as $v){
    $js .= getFileTxt(DIR_ADMIN.$v);
    $js .= "\n";
}

$html = getFileTxt(DIR_ADMIN."/html/{$name}");
$html = str_replace('{JS}',$js,$html);
$html = str_replace('{CSS}',$css,$html);
if($maintain_sw == "Y"){
    $html = str_replace('{TIME}',$conn["webstr"],$html);
}
print_r($html);exit;
?>
<script language="javascript">
    document.cookie = "protocolstr=" + location.protocol.replace(":", "") + ";path=/;";
    top.popWindow = new Array();
    if (!!window.onunload) {
        window.onUnloadDWinObj = window.onunload;
    } else {
        window.onUnloadDWinObj = function() {}
    }

    window.onunload = function() {
        window.onUnloadDWinObj();
        for (var i in popWindow) {
            if (!popWindow[i].closed) {
                popWindow[i].window.close();
            }
        }
    }

    if (!!window.onbeforeunload) {
        window.onbeforeUnloadDWinObj = window.onbeforeunload;
    } else {
        window.onbeforeUnloadDWinObj = function() {}
    }

    window.onbeforeunload = function() {
        window.onbeforeUnloadDWinObj();
        for (var i = 0; i < popWindow.length; i++) {
            if (!popWindow[i].closed) {
                popWindow[i].window.close();
            }
        }
    }
</script>

