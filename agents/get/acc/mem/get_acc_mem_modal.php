<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}

$tp = new Template($_p);
$arr = $tp->list();

$para = [
    "data" => [
        "modal_data" => $arr,
        "modal_limit" => 5
    ]
];
$cc->insertLog("模板列表");
exit(json_encode($para));