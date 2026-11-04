<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();
if($userArr["status"]=="error"){exit(json_encode($userArr));}

$para = $cc->acc_sub_all_list();
$cc->insertLog("账号管理->代理子账号");
exit(json_encode($para));
