<?php
$_p = unserialize(_POST_);
global $dirHtml,$gtypes;
if($_p["tbet_showtype"] == "match_outright") {
    $_p["tbet_gtype"] = "FT";
}
$t_hn = $hn = "{$_p["tbet_gtype"]}_" . $_p["tbet_showtype"];
$match_model = "match_model";
if(isset($gtypes[$_p["tbet_gtype"]])){
    $hn = $_p["tbet_gtype"]."/".$hn;
    $match_model = "match/match_model";
}
$dirHtml = str_replace($match_model,$hn,$dirHtml);
$arr_js = [];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/totalbet_control.css",
    "control/overcss.css"
];
$js = "top.match_model = '{$t_hn}';";
include_once INCLUDE_DIR . "/getHtml.php";