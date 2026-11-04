<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$para = $cc->d0_edit();
exit(json_encode($para));