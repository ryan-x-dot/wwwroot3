<?php
$_p = unserialize(_POST_);
$cc = new Announcement($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = $cc->get_announcement();
exit(json_encode($para));