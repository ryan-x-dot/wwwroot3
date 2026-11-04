<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js"];
$arr_css = [
    "control/reset.css",
    "control/overcss.css",
    "control/alert.css",
    "control/guide.css",
];
include_once INCLUDE_DIR."/getHtml.php";