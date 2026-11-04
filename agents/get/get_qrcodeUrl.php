<?php
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
//{"qrcode_url":"https:\/\/mos011.com\/","qrcode_str":"https:\/\/mos011.com\/?q=uvTYAX4KrZRnsnhPi5KHvdvA7kFYSpEirBCCp2hpyLvx-ujYPSCAh-nSzNxxVg9p1vSc9zSBpLKtC4SWR2L9cA","status":"success"}
$domain = $_SERVER['HTTP_HOST'];
$para = [
    "qrcode_url" => $_SERVER['REQUEST_SCHEME'] . "://" . $domain,
    "qrcode_str" => $_SERVER['REQUEST_SCHEME'] . "://" . "$domain/?q=" . $userArr['user']['id'],
    "status" => "success"
];
$cc->insertLog("账号管理->生成二维码信息");
exit(json_encode($para));