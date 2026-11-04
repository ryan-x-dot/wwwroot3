<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","zxcvbn.js"];
$arr_css = [
    "control/reset.css",
    "control/overcss.css",
    "control/main_control.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";
