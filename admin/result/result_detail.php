<?php
$_p = unserialize(_POST_);
global $dirHtml;
$gtype = $_p["gtype"];
$result_detail = strtolower($gtype)."/".strtoupper($gtype)."_results_detail";
$dirHtml = str_replace("result/result_detail",$result_detail,$dirHtml);
$arr_js = [
    "totalbet/".strtoupper($gtype)."_result_detail.js"
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/overcss.css"
];
include_once INCLUDE_DIR . "/getHtml.php";