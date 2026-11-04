<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
$para = [
    "up_id" => "",
    "account" => [],
    "uplayer_user" => []
];
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$uu = $cc->uplayer_user(Constant::CO);//上级查询
if($uu["status"]=="success" && !empty($uu["up_id"])) {
    $para = [
        "up_id" => $uu["up_id"],
        "account" => $cc->acc_su_list($uu["up_id"]),
        "uplayer_user" => $uu["data"]
    ];
}
$cc->insertLog("账号管理->股东");
exit(json_encode($para));