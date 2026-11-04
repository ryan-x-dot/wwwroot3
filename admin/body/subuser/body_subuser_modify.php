<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$layer = strlen($userArr["sup"]["nid"]) == 16 ? Constant::ADS : Constant::AD;
$para = $cc->sub_add($layer);
exit(json_encode($para));