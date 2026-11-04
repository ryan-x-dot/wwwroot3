<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js","account_status.js","lib/ClassSelect.js", "lib/echarts.min.js","lib/Chart.js", "lib/Charts.js", "lib/ChartJs.js"];
$arr_css = [
    "control/reset.css",
    "control/overcss.css",
    "control/alert.css",
    "control/retrieve.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";