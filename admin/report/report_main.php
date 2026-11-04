<?php
$_p = unserialize(_POST_);
global $currencys,$langx,$ls_msg,$web_time_zone;
$arr_js = ["lib/calendar_ag.js","lib/ClassFankCal_ag.js","report/report_main.js"];
$arr_css = ["control/reset.css","control/report_control00.css","control/overcss.css","control/cal.css"];
$time = time();
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
    "today"=>date("Y-m-d"),
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

$Period = period_box();

$currency = [];
foreach ($currencys[$langx] as $k=>$v){
    $currency[] = [
        "CODE" => $v["code"],
        "CODE_NAME" => $v["name"],
        "CODE_VALUE" => $v["value"]
    ];
}
$jsonCurrency = json_encode($currency);
$jsonDate = json_encode($jsonDate);
$jsonPeriod = json_encode($Period);
$js = "
        top.ver = 'version-10-13';
        var jsonCurrency = '{$jsonCurrency}';
        var jsonDate = '{$jsonDate}';
        var jsonPeriod = '{$jsonPeriod}';
";
$css = "";
// print_r(time()-$time);
// print_r("========");
include_once INCLUDE_DIR."/getHtml.php";
// print_r(time()-$time);