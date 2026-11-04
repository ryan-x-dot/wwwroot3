<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}

$tp = new Template($_p);
$para = $tp->add();

$cc->insertLog("模板->创建模板");
exit(json_encode($para));