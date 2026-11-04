<?php
$_p = unserialize(_POST_);
$cc = new Configure($_p);
$para = $cc->curlConf();
exit(json_encode($para));