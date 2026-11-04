<?php
global $web_time_zone;
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","zxcvbn.js"];
$arr_css = [
    "control/reset.css",
    "control/overcss.css",
];

$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";