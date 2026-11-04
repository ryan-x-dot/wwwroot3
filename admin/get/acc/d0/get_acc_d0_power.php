<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证

if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = $cc->getAccountPower(Constant::D0);
$cc->insertLog("账号管理->分公司->修改页面->权限设定[加载数据]");
exit(json_encode($para));