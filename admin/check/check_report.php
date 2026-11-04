<?php
$_p = unserialize(_POST_);
$rp = new Report($_p);
$userArr = $rp->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$ary = ["status"=>"200","msg"=>"success"];
exit(json_encode($ary));
