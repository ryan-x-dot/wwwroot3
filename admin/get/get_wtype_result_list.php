<?php
header('Content-type: text/html;charset=utf-8');
$_p = unserialize(_POST_);
include_once "include/config.php";
$bet = new BetList($_p);
$userArr = $bet->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$ary = $bet->get_wtype_result_list($_p);
exit(json_encode($ary));