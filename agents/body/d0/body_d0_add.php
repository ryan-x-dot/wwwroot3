<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$para = $cc->d0_add();
exit(json_encode($para));