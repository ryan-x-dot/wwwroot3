<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","account_status.js","lib/ClassSelect.js"];
$arr_css = [
    "control/reset.css",
    "control/account_control.css",
    "control/sub_all_list.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";
