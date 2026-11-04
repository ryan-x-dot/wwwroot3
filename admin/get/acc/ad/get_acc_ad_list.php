<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证

if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = [
    "up_id" => $userArr["user"]["id"],
    "account" => $cc->acc_ad_list(Constant::AD)
];

$cc->insertLog("账号管理->公司");
exit(json_encode($para));