<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js"];
$arr_css = [
    "control/alert.css",
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";