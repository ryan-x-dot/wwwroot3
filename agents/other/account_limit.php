<?php
global $db_c,$db_s,$database_s,$database_c;
$_p = unserialize(_POST_);
$bl = new BetList($_p);
$userArr = $bl->getUID();//uid验证
$ary = [];
if($userArr["status"]=="error"){exit(json_encode($ary));}

exit(json_encode($ary));