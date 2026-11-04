<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$domain = $_SERVER['HTTP_HOST'];
$tp = new Template($_p);
$arr = $tp->list();
$newarr = [];
foreach ($arr as &$v) {
    $newarr[$v["id"]] = $v;
}
$para = [
    "template_sw" => true,
    "template_value" => $newarr,
    "qr_url" => $domain,
    "qr_sw" => "Y"
];

$cc->insertLog("帐户管理->新增会员[加载数据]");
exit(json_encode($para));