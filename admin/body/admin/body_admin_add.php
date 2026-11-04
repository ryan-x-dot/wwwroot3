<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$para = $cc->admin_add();
exit(json_encode($para));