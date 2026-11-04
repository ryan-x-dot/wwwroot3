<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$para = $cc->chk_username();
exit(json_encode($para));