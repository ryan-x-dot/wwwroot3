<?php
$_p = unserialize(_POST_);
$arr_js = [
    "lib/HttpRequest.js",
    "lib/HttpRequestRetry.js",
    "lib/echarts.min.js",
    "lib/Chart.js",
    "lib/Charts.js",
    "lib/ChartJs.js",
    "lib/ClassSelect.js",
	"lib/AD.js",
    "dashboard.js",
    "{$_p["p"]}.js"
];
$arr_css = [
    "control/reset.css",
    "control/main_control.css",
    "control/overcss.css",
    "control/report_control00.css"
];
$last_week = date_between("lw");
$this_week = date_between("tw");
$jsonDate = [
    "today"=>date("Y-m-d"),
    "yesterday"=>date("Y-m-d",strtotime("-1 day")),
    "this_week_s"=>date("Y-m-d",strtotime($this_week["start"])),
    "this_week_e"=>date("Y-m-d",strtotime($this_week["end"])),
    "last_week_s"=>date("Y-m-d",strtotime($last_week["start"])),
    "last_week_e"=>date("Y-m-d",strtotime($last_week["end"]))
];
$jsonDate = json_encode($jsonDate);
$js = "var jsonDate = {$jsonDate};";
$css = "";
$_p = unserialize(_POST_);
$cc = new Account($_p);
if($cc->user['is_banned'] == 'Y'){
    print_r($cc->user['is_banned']);exit;
}

//$para = $cc->chk_username();
include_once INCLUDE_DIR."/getHtml.php";