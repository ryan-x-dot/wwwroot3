<?php
$_p = unserialize(_POST_);
global $dirHtml,$gtypes;
$ary = ["fu","parlay","today","results_outright","outright"];
$t_hn = $hn = "{$_p["tbet_gtype"]}_".$_p["tbet_showtype"];
if($_p["tbet_gtype"] == "ES" && $_p["tbet_showtype"] == "fu"){ 
    $t_hn = $hn = "ES_today";
}
$totalbet_model = "totalbet_model";
if(isset($gtypes[$_p["tbet_gtype"]])){
    $hn = $_p["tbet_gtype"]."/".$hn;
    $totalbet_model = "totalbet/totalbet_model";
}

if(in_array($_p["tbet_showtype"],$ary)){
    $hn = "FT/FT_".$_p["tbet_showtype"];
    $totalbet_model = "totalbet/totalbet_model";
}
//print_r($hn);exit;
$dirHtml = str_replace($totalbet_model,$hn,$dirHtml);
$arr_js = [];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/totalbet_control.css",
    "control/overcss.css"
];
$js = "top.totalbet_model = '{$t_hn}';";
include_once INCLUDE_DIR . "/getHtml.php";