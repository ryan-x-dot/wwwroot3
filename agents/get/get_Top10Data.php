<?php
$_p = unserialize(_POST_);
$cc = new Performance($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = $cc->getTopData($userArr);
exit(json_encode($para));