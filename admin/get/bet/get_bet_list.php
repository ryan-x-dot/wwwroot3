<?php
$_p = unserialize(_POST_);
$bet = new BetList($_p);
$userArr = $bet->getUID();//uid验证
if ($userArr["status"] == "error") {
    exit(json_encode($userArr));
}
$start_time = microtime(true);
$ary = $bet->get_bet_list();
exit(json_encode($ary));
// print_r(microtime(true) - $start_time);
// print_r(json_encode($ary));
// print_r(microtime(true) - $start_time);
// exit;
