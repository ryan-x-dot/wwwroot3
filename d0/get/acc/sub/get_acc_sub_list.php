<?php
global $max_sub;
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证

if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = [
    "account" => $cc->acc_sub_list(),
    "sub_max" => $max_sub//最多5个子账号
];

$cc->insertLog("账号管理->子账号");
exit(json_encode($para));