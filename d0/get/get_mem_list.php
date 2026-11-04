<?php
global $db_c;
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = [
    "account" => $cc->get_mem_list(),
];

$cc->insertLog("账号管理->会员->修改->用户详情设定[加载数据]");
exit(json_encode($para));