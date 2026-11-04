<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","acc_report.js","lib/ClassSelect.js"];
$arr_css = [
    "control/reset.css",
    "control/cal.css",
    "control/account_control.css",
    "control/overcss.css",
    "control/dates.css",
    "control/alert.css",
    "control/main_control.css",
    "control/zidingyi/account.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";