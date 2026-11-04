<?php
global $db_c;
$_p = unserialize(_POST_);
$cf = new Configure($_p);
$userArr = $cf->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = $cf->get_new_url();
exit(json_encode($para));