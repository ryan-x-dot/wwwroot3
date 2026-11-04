<?php
header('Content-type: text/html;charset=utf-8');
include_once '../../../include/config.php'; 
$_p = $_REQUEST;
$tf = new Transform();
$tf->getUserCurl(1);
header("Location: https://125.252.69.119/app/member/account/index.php?uid={$tf->web["uid"]}&langx={$_p["langx"]}&mem_status={$_p["mem_status"]}&protocol=https");
?>

