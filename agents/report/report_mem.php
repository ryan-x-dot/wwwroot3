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
    "report/report_index.js",
    "report/{$report_layer}.js",
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/new_layout.css",
    "control/overcss.css",
    "control/cal.css"
];

$js = "
        top.ver = 'version-12-29';
        var limitDate = '2021-07-12';
";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";