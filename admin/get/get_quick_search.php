<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = $cc->get_quick_search();

$cc->insertLog("搜索账号");
exit(json_encode($para));