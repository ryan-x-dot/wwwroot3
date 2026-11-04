<?php
$_p = unserialize(_POST_);
$arr_js = ["lib/util_report.js","lib/calendar_ag.js","lib/ClassFankCal_ag.js","report/CookieManager.js","report/{$_p["p"]}.js"];
$arr_css = ["control/reset.css","control/report_control00.css","control/overcss.css","control/cal.css"];
$js = "
        top.ver = 'version-10-13';
";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";