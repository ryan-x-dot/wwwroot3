<?php
$_p = unserialize(_POST_);
$arr_js = [
    "bet/{$_p["p"]}.js",
    "lib/CountdownTimer.js",
    "lib/source_date.js",
    "lib/Timer.js",
    "lib/LocalstorageManager.js"
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/totalbet_control.css",
    "control/overcss.css"
];
$jsonDate = [
    "_list"=>["FULL","TODAY","YESTERDAY"],
    "_listSub" => ["早盘","今日","昨日"],
];
for($i=2;$i<=14;$i++){//查询两周的日期
    $jsonDate["_list"][] = $jsonDate["_listSub"][] = date("Y-m-d",strtotime("-{$i} day"));
}
$jsonDate = json_encode($jsonDate);
$js = " var jsonDate = '{$jsonDate}';";
include_once INCLUDE_DIR."/getHtml.php";
