<?php
$_p = unserialize(_POST_);
$acc = new Account($_p);
$userArr = $acc->getUID();//uid验证
if ($userArr["status"] == "error") {exit(json_encode($userArr));}
$para = $acc->get_my_setting();
exit(json_encode($para));