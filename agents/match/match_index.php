<?php
$_p = unserialize(_POST_);
$arr_js = [
    "match/{$_p["p"]}.js",
    "lib/CountdownTimer.js",
    "lib/util.js",
    "lib/fastTemplate.js",
    "lib/source_date.js"
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/totalbet_control.css",
    "control/overcss.css"
];
include_once INCLUDE_DIR."/getHtml.php";
