<?php
$_p = unserialize(_POST_);
$arr_js = [
    "setting/{$_p["p"]}.js",
    "lib/CountdownTimer.js",
    "lib/source_date.js",
    "lib/Timer.js",
    "lib/LocalstorageManager.js"
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/totalbet_control.css",
    "control/overcss.css",
    "control/account_control.css"
];
$css = "
    .setting input{height: 30px;padding: 0 10px;font-size: 14px;border-radius: 3px;border: #c8c8c8 solid 1px;color: rgba(0,0,0,0.8);background: #fff;}
    .setting td{padding:8px 10px;}
";
include_once INCLUDE_DIR."/getHtml.php";
