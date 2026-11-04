<?php
global $dirHtml;

$_p = unserialize(_POST_);
$view_layer = $_p["view_layer"];
$bs = new Base($_p);
$userArr = $bs->getUID();
if($userArr["status"]=="error"){
    exit(json_encode($userArr));
}
switch ($view_layer){
    case Constant::MEM:
        $report_layer = "report_mem";
        break;
    case Constant::AG:
        $report_layer = "report_ag";
        break;
    case Constant::SU:
        $report_layer = "report_su";
        break;
    case Constant::CO:
        $report_layer = "report_co";
        break;
    case Constant::D0:
        $report_layer = "report_d0";
        break;
    case Constant::AD:
        $report_layer = "report_ad";
        break;
    case Constant::ADS:
        $report_layer = "report_ads";
        break;
    default:
        exit("");
        break;
}
$dirHtml = str_replace($report_layer,"report_index",$dirHtml);

$arr_js = [
    "lib/jquery.min.js",
    "lib/util_report.js",
    "lib/calendar_ag.js",
    "lib/ClassFankCal_ag.js",
    "lib/calendar2_ag.js",
    "lib/ClassFankCal2_ag.js",
    "report/report_index.js",
    "report/{$report_layer}.js",
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/overcss.css",
    "control/calendar.css",
    "control/alert.css",
    "control/main_control.css"
];

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
        top.ver = 'version-12-29';
        var jsonCurrency = '{$jsonCurrency}';
        var jsonDate = '{$jsonDate}';
        var jsonPeriod = '{$jsonPeriod}';
";
$css = "
#div_date .cal_div {
    display: flex;
    width: 584px;
}
";
include_once INCLUDE_DIR."/getHtml.php";