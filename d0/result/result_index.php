<?php
$_p = unserialize(_POST_);
$arr_js = [
    "totalbet/{$_p["p"]}.js",
    "lib/fastTemplate.js"
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/overcss.css"
];
include_once INCLUDE_DIR."/getHtml.php";