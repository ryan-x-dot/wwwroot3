<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$para = $cc->upperConf();
exit(json_encode($para));