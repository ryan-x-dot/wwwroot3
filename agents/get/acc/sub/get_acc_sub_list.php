<?php
global $max_sub;
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证

if($userArr["status"]=="error"){exit(json_encode($userArr));}
$arr = $cc->acc_sub_list();
$para = [
    "account" => $arr,
    "sub_max" => $max_sub,//最多5个子账号
    "sub_total_count" => count($arr),
    "pay_type" => $userArr["user"]["pay_type"],
    "id" => $userArr["user"]["id"],
];

$cc->insertLog("账号管理->子账号");
exit(json_encode($para));