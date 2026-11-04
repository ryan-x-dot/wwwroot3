<?php
$_p = unserialize(_POST_);
global $ls_msg,$langx,$web_time_zone;
$arr_js = [
    "data/{$_p["p"]}.js",
    "lib/CountdownTimer.js",
    "lib/source_date.js",
    "lib/Timer.js",
    "lib/LocalstorageManager.js",
    "lib/ClassFankCal_ag.js",
    "lib/calendar_data.js"
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/totalbet_control.css",
    "control/overcss.css",
    "control/account_control.css",
    "control/cal.css"
];
$css = "
    .setting input{height: 30px;padding: 0 10px;font-size: 14px;border-radius: 3px;border: #c8c8c8 solid 1px;color: rgba(0,0,0,0.8);background: #fff;}
    .setting td{padding:8px 10px;}
";

$last_week = date_between("lw");
$this_week = date_between("tw");
$les = date_between("lp");
$es = date_between("tp");
$issue = issue();
$game_over_yn = Dashboard::sum_matchs()["game_over_yn"];
$jsonDate = [
    "period_ls"=>date("Y-m-d",strtotime($les["start"])),
    "period_le"=>date("Y-m-d",strtotime($les["end"])),
    "period_s"=>date("Y-m-d",strtotime($es["start"])),
    "period_e"=>date("Y-m-d",strtotime($es["end"])),
    "period_year"=>date("Y"),
    "period_num"=>$issue["k"],
    "today"=>date("Y-m-d",strtotime("-1 month")),
    "tomorrow"=>date("Y-m-d",strtotime("+1 day")),
    "this_week_s"=>date("Y-m-d",strtotime($this_week["start"])),
    "this_week_e"=>date("Y-m-d",strtotime($this_week["end"])),
    "last_week_s"=>date("Y-m-d",strtotime($last_week["start"])),
    "last_week_e"=>date("Y-m-d",strtotime($last_week["end"])),
    "yesterday"=>date("Y-m-d",strtotime("-1 day")),
    "today_finish"=>$ls_msg[$langx]["4X002"],
    "yesterday_finish"=>$ls_msg[$langx]["4X001"],
    "today_finish_class"=>"word_red",
    "yesterday_finish_class"=>"word_green",
    "game_over_yn"=>$game_over_yn,
    "WEB_TIME_ZONE"=>$web_time_zone //web时区
];
$jsonDate = json_encode($jsonDate);
$js = "var jsonDate = '{$jsonDate}';";
include_once INCLUDE_DIR."/getHtml.php";
