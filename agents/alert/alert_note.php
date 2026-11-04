<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js"];
$arr_css = [
    "control/reset.css",
    "control/overcss.css",
    "control/guide.css",
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";