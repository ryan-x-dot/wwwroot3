<?php
global $dirHtml;

$_p = unserialize(_POST_);
$view_layer = $_p["view_layer"];
$bs = new Base($_p);
$userArr = $bs->getUID();
if($userArr["status"]=="error"){
    exit(json_encode($userArr));
}

switch($_p["view_layer"]){
    case "mem":
        $model = "report_view_mem";
        if($_p["result_type"]=="N"){
            $model = "report_unsettled";
        }
        break;
    case "list_bet":
        $model = "report_list_bet";
        if($_p["result_type"]=="N"){
            $model = "report_list_bet_unsettled";
        }
        break;
    default:
        if($_p["view_layer"] == $_p["login_layer"] || $_p["view_layer"]==Constant::AD || $_p["view_layer"]==Constant::ADS){
            $model = "report_{$_p["view_layer"]}_{$_p["report_type"]}";
        }else{
            $model = "report_view_{$_p["view_layer"]}_{$_p["report_type"]}";
        }

        if($_p["result_type"]=="N"){
            $model = "report_unsettled";
        }
        break;
}
//top.report_model = 'report_ag_set';

$dirHtml = str_replace("report_model",$model,$dirHtml);

$arr_js = [];
$arr_css = [];

$js = "
        top.ver = 'version-12-29';
        top.report_model = '{$model}';
";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";