<?php
header('Content-type: text/html;charset=utf-8');
$_p = unserialize(_POST_);
include_once "include/config.php";
$tf = new TransformAG();
$json = $tf->get_curl_ad_data($_p);
echo $json;exit;