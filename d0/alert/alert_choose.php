<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js"];
$arr_css = ["control/main_control.css"];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";