<?php
$_p = unserialize(_POST_);
$arr_js = ["report/{$_p["p"]}.js"];
$arr_css = ["control/reset.css","control/report_control00.css","control/overcss.css"];
$arr_css = [];
$Period = period_box();
$jsonPeriod = json_encode($Period);
$js = "
        top.ver = 'version-12-29';
        var jsonPeriod = '{$jsonPeriod}';
";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";