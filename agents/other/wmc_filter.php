<?php
global $dirHtml;
$_p = unserialize(_POST_);
$arr_js = ["wmc/wmc_filter.js","lib/util_report.js","lib/calendar_ag.js","lib/ClassFankCal_ag.js","lib/CookieManager.js"];
$arr_css = [];
$js = "
        top.ver = 'version-12-29';
";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";