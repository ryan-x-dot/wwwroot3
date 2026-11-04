<?php
$_p = unserialize(_POST_);
$arr_js = [
    "wagers/{$_p["p"]}.js"
];
$arr_css = [
    "control/reset.css",
    "control/totalbet_control.css",
    "control/overcss.css"
];
include_once INCLUDE_DIR."/getHtml.php";
