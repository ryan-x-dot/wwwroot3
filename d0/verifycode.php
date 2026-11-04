<?php
include_once "./include/config.php";
header("Content-type:image/png");
$one = rand(1,99);
$two = rand(1,99);
global $prefix;
VerifyCode::get($one,$two,$prefix,46);

