<?php
$_p = unserialize(_POST_);
$mr = new MatchResult($_p);
$userArr = $mr->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$para = $mr->get_result_date();
exit(json_encode($para));