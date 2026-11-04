<?php
$_p = unserialize(_POST_);
$arr_js = ["lib/Timer.js","{$_p["p"]}.js","lib/getView.js"];
$arr_css = ["control/reset.css","control/overcss.css","control/main_control.css","control/report_control00.css"];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";