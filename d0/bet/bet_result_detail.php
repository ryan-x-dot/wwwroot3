<?php
$_p = unserialize(_POST_);
$arr_js = ["bet/bet_result_detail.js"];
$arr_css = ["control/reset.css","control/account_control.css","control/overcss.css"];
$js = "
        top.ver = 'version-12-29';
";
$css = "
    .accadd_box {padding: 10px 14px;margin: 10px 0px;}
    .accadd_box input[type=\"text\"]{height:36px;padding: 0 10px;}
    .accadd_box > div {
        margin-bottom: 5px;
    }
    .ior{
        height:36px;
        width:100%;
        padding: 0 10px;
        font-size: 16px;
        border-radius: 3px;
        border: #c8c8c8 solid 1px;
        color: rgba(0,0,0,0.8);
        background: #fff;
    }
    .re_sreachitem{padding:6px 0px;}
    
";//.accadd_box .re_sreachitem{margin: -10px 0px 0px -10px;}
include_once INCLUDE_DIR."/getHtml.php";