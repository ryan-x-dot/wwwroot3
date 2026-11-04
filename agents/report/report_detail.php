<?php
$_p = unserialize(_POST_);
$arr_js = ["report/report_detail.js"];
$arr_css = ["control/reset.css","control/{$_p["p"]}.css","control/overcss.css"];
$arr_css = [];
$js = "
        top.ver = 'version-12-29';
";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";