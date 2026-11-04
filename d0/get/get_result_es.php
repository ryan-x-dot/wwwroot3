<?php
header('Content-type: text/html;charset=utf-8');
$_p = unserialize(_POST_);
include_once "include/config.php";
$mr = new MatchResult($_p);
$userArr = $mr->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}

$tf = new TransformAG();
$json = $tf->get_curl_ad_data($_p,$userArr["user"]["id"]);
echo $json;exit;