<?php
$_p = unserialize(_POST_);
$bet = new BetList($_p);
$userArr = $bet->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$ary = $bet->get_bet_SearchFilter_data();
exit(json_encode($ary));
