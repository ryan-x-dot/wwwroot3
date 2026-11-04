<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = $cc->chg_psw();
exit(json_encode($para));