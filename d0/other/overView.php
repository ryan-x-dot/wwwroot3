<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","lib/ClassSelect.js"];
$arr_css = [
    "control/reset.css",
    "control/totalbet_control.css",
    "control/report_control00.css",
    "control/overcss.css",
    "control/alert.css",
    "control/main_control.css"
];
include_once INCLUDE_DIR."/getHtml.php";