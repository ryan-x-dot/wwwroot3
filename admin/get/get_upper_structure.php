<?php
global $db_c;
$_p = unserialize(_POST_);
$rp = new Report($_p);
$userArr = $rp->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$ary = $rp->get_upper_structure(Constant::CO);
exit(json_encode($ary));
