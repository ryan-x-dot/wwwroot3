<?php
$_p = unserialize(_POST_);
$lg = new Login($_p);
$userArr = $lg->getUID();//uid验证
if ($userArr["status"] == "error") {
    exit(json_encode($userArr));
}
$para = $lg->get_out();
exit(json_encode($para));