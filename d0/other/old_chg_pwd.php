<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","zxcvbn.js"];
$arr_css = [
    "control/reset.css",
    "control/login.css",
    "control/overcss.css"
];
$js = "var isFirst = \"Y\";";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";