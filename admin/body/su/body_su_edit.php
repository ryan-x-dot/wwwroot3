<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$para = $cc->su_edit();
exit(json_encode($para));