<?php
global $web_time_zone;
$_p = unserialize(_POST_);
$arr_js = ["lib/calendar.js","lib/ClassFankCal.js","{$_p["p"]}.js","lib/ClassSelect.js","zxcvbn.js"];
$arr_css = [
    "control/reset.css",
    "control/cal.css",
    "control/account_control.css",
    "control/overcss.css",
    "control/dates.css",
    "control/main_control.css",
    "control/zidingyi/account.css"
];
$jsonDate = [
    "today"=>date("Y-m-d"),//input显示日期date("Y-m-d")
    "period_ls" => date("Y-m-d"),//最低时间 "1900-1-1"
    "period_le"=>date("Y-m-d",strtotime("+2 year")),//最高时间 "2099-12-31"
    "WEB_TIME_ZONE"=>$web_time_zone //web时区
];
$jsonDate = json_encode($jsonDate);
$js = " var jsonDate = '{$jsonDate}';";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";