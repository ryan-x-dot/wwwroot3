<?php
$_p = unserialize(_POST_);
$cc = new Dashboard($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$user = $userArr["user"];
$sup = $userArr["sup"];
$para = $cc->mainDashboard();

$cc->insertLog("首页");
exit(json_encode($para));
