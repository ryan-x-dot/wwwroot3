<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","lib/ClassSelect.js"];
$arr_css = [
    "control/reset.css",
    "control/account_list.css",
    "control/overcss.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";