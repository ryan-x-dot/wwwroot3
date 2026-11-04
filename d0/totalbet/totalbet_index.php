<?php
$_p = unserialize(_POST_);
$arr_js = [
    "totalbet/{$_p["p"]}.js",
    "lib/CountdownTimer.js",
    "lib/source_date.js"
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/overcss.css",
    "control/totalbet_control.css"
];
include_once INCLUDE_DIR."/getHtml.php";
