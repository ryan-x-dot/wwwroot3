<?php
$_p = unserialize(_POST_);
global $dirHtml,$gtypes;
$ary = ["fu","parlay","results_outright","outright"];//,"today"
$t_hn = $hn = "{$_p["tbet_gtype"]}_".$_p["tbet_showtype"]."_allbet";
$match_model = "match_model_allbet";
if(isset($gtypes[$_p["tbet_gtype"]])){
    $hn = $_p["tbet_gtype"]."/".$hn;
    $match_model = "match/match_model_allbet";
}

if(in_array($_p["tbet_showtype"],$ary)){
    $hn = "FT/FT_".$_p["tbet_showtype"]."_allbet";
    $match_model = "match/match_model_allbet";
}

$dirHtml = str_replace($match_model,$hn,$dirHtml);
$arr_js = [];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/totalbet_control.css",
    "control/overcss.css"
];
$js = "top.match_model_allbet = '{$t_hn}';";
include_once INCLUDE_DIR . "/getHtml.php";