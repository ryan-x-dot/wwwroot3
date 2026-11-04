<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","lib/util.js"];
$arr_css = [
    "control/reset.css",
    "control/login.css",
    "control/overcss.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";