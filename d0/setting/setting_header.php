<?php
$_p = unserialize(_POST_);
$arr_js = ["setting/{$_p["p"]}.js"];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/totalbet_control.css",
    "control/overcss.css"
];
include_once INCLUDE_DIR."/getHtml.php";
