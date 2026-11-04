<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","lib/HttpRequest.js"];
$arr_css = [
    "control/reset.css",
    "control/login.css",
    "control/overcss.css",
    "control/alert.css",
    "control/account_control.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";