<?php
$_p = unserialize(_POST_);
$arr_js = ["bet/bet_detail.js"];
$arr_css = ["control/reset.css","control/{$_p["p"]}.css","control/overcss.css"];
$arr_css = [];
$js = "
        top.ver = 'version-7-31';
";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";