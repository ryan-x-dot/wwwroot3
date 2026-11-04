<?php
$_p = unserialize(_POST_);
$log = new Eventlog($_p);
$userArr = $log->getUID();//uid验证
if ($userArr["status"] == "error") {
    exit(json_encode($userArr));
}
$para = $log->get_record();
exit(json_encode($para));