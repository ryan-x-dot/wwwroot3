<?php

$_REQUEST["langx"] = "zh-cn";
include_once "../include/config.php";
global $db_c;
$con_table = Constant::T_CONFIG_DEFAULT;
$conn = $db_c->select("SELECT * FROM {$con_table} WHERE `id`>0 LIMIT 1","Row");
$maintain_sw = isset($conn["website"]) && $conn["website"]==1 ? "Y"  : "N";//是否维护
exit($conn["webstr"].",".$maintain_sw.",14:50:00,N");