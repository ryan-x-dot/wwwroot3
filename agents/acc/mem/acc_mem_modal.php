<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js"];
$arr_css = [
    "control/reset.css",
    "control/account_control.css",
    "control/overcss.css",
    "control/account_list.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";
?>