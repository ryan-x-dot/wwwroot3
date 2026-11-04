<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = [
    "up_id" => $userArr["user"]["id"],
    "account" => $cc->get_ad_list()
];

$cc->insertLog("账号管理->公司->修改[加载数据]");
exit(json_encode($para));