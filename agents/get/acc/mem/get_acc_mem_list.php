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
$uu = $cc->uplayer_user(Constant::AG);//上级查询
if($uu["status"]=="success" && !empty($uu["up_id"])) {
    if($_p["login_layer"] == Constant::AG){
        $para = [
            "up_id" => $uu["up_id"],
            "account" => $cc->acc_mem_list($uu["up_id"]),
            "up_pay_type" => $uu["data"][0]["pay_type"]
        ];
    } else {
        $para = [
            "up_id" => $uu["up_id"],
            "account" => $cc->acc_mem_list($uu["up_id"]),
            "uplayer_user" => $uu["data"]
        ];
    }
}
$cc->insertLog("账号管理->会员");
exit(json_encode($para));