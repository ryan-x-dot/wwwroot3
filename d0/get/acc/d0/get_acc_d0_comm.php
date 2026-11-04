<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证

if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = $cc->acc_d0_comm();
$cc->insertLog("账号管理->分公司->修改页面->退水和限额[加载数据]");
exit(json_encode($para));