<?php
$_p = unserialize(_POST_);
global $dirHtml;
$gtype = $_p["gtype"];
$result_detail = strtolower($gtype)."/".strtoupper($gtype)."_match_edit";
$dirHtml = str_replace("match/match_edit",$result_detail,$dirHtml);
$arr_js = [
    "match/".strtoupper($gtype)."_match_edit.js"
];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/overcss.css",
    "control/account_control.css"
];
include_once INCLUDE_DIR . "/getHtml.php";