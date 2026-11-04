<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","acc_report.js","lib/ClassSelect.js"];
$arr_css = [
    "control/reset.css",
    "control/login.css",
    "control/overcss.css",
    "control/account_control.css",
    "control/report_control00.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";