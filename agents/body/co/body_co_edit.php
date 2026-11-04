<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$para = $cc->co_edit();
exit(json_encode($para));