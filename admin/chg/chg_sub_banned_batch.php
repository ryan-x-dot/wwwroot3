<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();
if($userArr["status"]=="error"){exit(json_encode($userArr));}

$para = $cc->chg_sub_banned_batch();
$cc->insertLog("账号管理->代理子账号->批量启用/禁用");
exit(json_encode($para));
