<?php
$_p = unserialize(_POST_);
$arr_js = [
    "bet/{$_p["p"]}.js",
    "lib/CountdownTimer.js",
    "lib/source_date.js",
    "lib/Timer.js",
    "lib/LocalstorageManager.js"
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/totalbet_control.css",
    "control/overcss.css"
];
include_once INCLUDE_DIR."/getHtml.php";
