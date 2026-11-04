<?php
$_p = unserialize(_POST_);
$ov = new OverView($_p);
$userArr = $ov->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$ary = $ov->get_league_wagers_fs();
exit(json_encode($ary));
