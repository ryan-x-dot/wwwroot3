<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = $cc->tmp_loginID_chk();
exit(json_encode(["status"=>$para]));