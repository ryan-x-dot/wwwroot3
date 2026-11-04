<?php
$_p = unserialize(_POST_);
global $web_time_zone;
$arr_js = ["{$_p["p"]}.js"];
$arr_css = [
    "control/reset.css",
    "control/account_list.css",
    "control/report_main.css",    
    "control/overcss.css",
    "control/alert.css",
    "control/outdated.css",
];

$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";