<?php
$_p = unserialize(_POST_);
$mydata = $_p["mydata"];
$filename = $_p["filename"];
header('Content-Type: application/vnd.ms-excel');
header("Content-Disposition: attachment;filename={$filename}.xls");
$mydata = iconv("UTF-8","GB2312//IGNORE",$mydata);
echo $mydata;exit;
