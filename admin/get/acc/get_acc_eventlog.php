<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if ($userArr["status"] == "error") {
    exit(json_encode($userArr));
}
$log = new Eventlog($_p);
$para = $log->get_acc_eventlog();
exit(json_encode($para));