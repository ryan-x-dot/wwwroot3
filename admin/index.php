<?php
include_once "./include/config.php";
$css_arr = [
    "/style/control/reset.css",
    "/style/control/login.css",
    "/style/control/change-password.css",
    "/style/control/register_email.css",
    "/style/control/rwd.css",
    "/style/control/overcss.css",
];
$js_arr  = [
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

$css = "";
foreach ($css_arr as $v) {
    $css .= getFileTxt(DIR_ADMIN.$v);
}

$js = "
        top.ver = 'version-10-13';
        top.ls = 'cn';
        top.langx = 'zh-cn';
        top.login_layer = 'ad';
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

foreach ($js_arr as $v){
    $js .= getFileTxt(DIR_ADMIN.$v);
    $js .= "\n";
}


$html = getFileTxt(DIR_ADMIN."/html/index.html");
$html = str_replace('{JS}',$js,$html);
$html = str_replace('{CSS}',$css,$html);
print_r($html);exit;
?>
<script language="javascript">
    document.cookie = "protocolstr="+location.protocol.replace(":","")+";path=/;";
    top.popWindow=new Array();
    if(!!window.onunload){
        window.onUnloadDWinObj=window.onunload;
    }else{
        window.onUnloadDWinObj=function(){}
    }


    window.onunload=function(){
        window.onUnloadDWinObj();
        for(var i in popWindow){
            if(!popWindow[i].closed){
                popWindow[i].window.close();
            }
        }
    }


    if(!!window.onbeforeunload){
        window.onbeforeUnloadDWinObj=window.onbeforeunload;
    }else{
        window.onbeforeUnloadDWinObj=function(){}
    }

    window.onbeforeunload=function(){
        window.onbeforeUnloadDWinObj();
        for(var i=0;i<popWindow.length;i++){
            if(!popWindow[i].closed){
                popWindow[i].window.close();
            }
        }
    }
</script>
