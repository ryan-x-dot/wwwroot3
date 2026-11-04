<?php
global $db_c,$currencys,$game_default_config;

$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}

$userArr["user"]["username"] = $userArr["user"]["name"];
$userArr["user"]["enable"] =  $userArr["user"]["status"] == 1? "Y" : "N";

$para = [
    "uplayer_user" => [$userArr["user"]],
    "get_template_value" =>"N",
	"up_id" =>$userArr["user"]["id"],
    "currency" => $currencys[$langx],
    "game" => [
        "up_data" => $game_default_config
    ],
];

if ($_p["get_template_value"] == "Y") {
    $tp = new Template($_p);
    $data = $tp->get();
    $key = "template_data_" . $data["id"];

    $para = [
        "uplayer_user" => [$userArr["user"]],
        "get_template_value" =>"Y",
        "up_id" =>$userArr["user"]["id"],
        "currency" => $currencys[$langx],
        "game" => [
            "up_data" => $game_default_config,
            $key => $data["game"][$key],
        ],
        "template_value" => $data
    ];
}

$cc->insertLog("模板->创建模板[加载数据]");
exit(json_encode($para));