<?php
header('Content-type: text/html;charset=utf-8');
$_p = unserialize(_POST_);
include_once "include/config.php";
$ma = new MatchResult($_p);
$userArr = $ma->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$ary = $ma->get_bet_filter_data($_p);
exit(json_encode($ary));