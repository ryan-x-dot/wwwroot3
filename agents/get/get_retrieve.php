<?php
global $db_c;
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$table = Constant::T_MEMBER;
$nid = $userArr["user"]["nid"];

if ($_p["act"] == "total_retrieve") {
    if ($_p["active"] == "N") {
        $rsSum1 = $db_c->select("SELECT sum(`credit`) as maxTotal FROM {$table} WHERE `status`=2 and `nid` like '{$nid}%'","Row");
        $rsSum2 = $db_c->select("SELECT sum(`balance_credit`) as retrieveTotal FROM {$table} WHERE `status`=2 and `balance_credit` > 1 and `nid` like '{$nid}%'","Row");
        $rsCount = $db_c->select("SELECT count(*) as lower_layer_num FROM {$table} WHERE `status`=2 and `nid` like '{$nid}%'","Row");

        $lower_layer_num = 0;
        if (is_array($rsCount) && array_key_exists("lower_layer_num", $rsCount)) {
            $lower_layer_num = intval($rsCount["lower_layer_num"]);
        }

        $maxTotal = 0;
        if (is_array($rsSum1) && array_key_exists("maxTotal", $rsSum1)) {
            $maxTotal = intval($rsSum1["maxTotal"]);
        }

        $retrieveTotal = 0;
        if (is_array($rsSum2) && array_key_exists("retrieveTotal", $rsSum2) && intval($rsSum2["retrieveTotal"]) >= $lower_layer_num) {
            $retrieveTotal = intval($rsSum2["retrieveTotal"]) - $lower_layer_num;
        }

        $para = [
            "status" => "OK",
            "act" => "total_retrieve",
            "active" => "N",
            "retrieve_data" => [
                "retrieveTotal" => $retrieveTotal,
                "maxTotal" => $maxTotal,
                "status" => "OK",
                "lower_layer" => "mem",
                "lower_layer_num" => $lower_layer_num
            ]
        ];

        $cc->insertLog("账号管理->额度回收[加载数据]");
        exit(json_encode($para));
    } else if ($_p["active"] == "Y") {
        $db_c->update($table, ["credit" => 1,"balance_credit" => 1], "`status`=2 and `nid` like '{$nid}%'");
        $rsCount = $db_c->select("SELECT count(*) as lower_layer_num FROM {$table} WHERE `status`=2 and `nid` like '{$nid}%'","Row");

        $lower_layer_num = 0;
        if (is_array($rsCount) && array_key_exists("lower_layer_num", $rsCount)) {
            $lower_layer_num = intval($rsCount["lower_layer_num"]);
        }

        $para = [
            "status" => "OK",
            "act" => "total_retrieve",
            "active" => "Y",
            "retrieve_data" => [
                "status" => "OK",
                "lower_layer" => "mem",
                "lower_layer_num" => $lower_layer_num
            ]
        ];
        
        $cc->insertLog("账号管理->额度回收->全部回收");
        exit(json_encode($para));
    }
} else if ($_p["act"] == "one_retrieve") {
    $uid = $_p["nowId"];

    if ($_p["active"] == "N") {
        $rsSum1 = $db_c->select("SELECT sum(`credit`) as maxTotal FROM {$table} WHERE `status`=2 and `nid` like '{$nid}%'","Row");
        $rsSum2 = $db_c->select("SELECT sum(`balance_credit`) as retrieveTotal FROM {$table} WHERE `status`=2 and `balance_credit` > 1 and `nid` like '{$nid}%'","Row");

        $maxTotal = 0;
        if (is_array($rsSum1) && array_key_exists("maxTotal", $rsSum1)) {
            $maxTotal = intval($rsSum1["maxTotal"]);
        }

        $retrieveTotal = 0;
        if (is_array($rsSum2) && array_key_exists("retrieveTotal", $rsSum2)) {
            $retrieveTotal = intval($rsSum2["retrieveTotal"]);
            if ($retrieveTotal > 0) {
                $retrieveTotal -= 1;
            }
        }
        $para = [
            "status" => "OK",
            "act" => "one_retrieve",
            "active" => "N",
            "retrieve_data" => [
                "retrieveTotal" => $retrieveTotal,
                "maxTotal" => $maxTotal,
                "status" => "OK",
                "now_layer" => "mem"
            ]
        ];
        
        $cc->insertLog("账号管理->额度回收[加载数据]");
        exit(json_encode($para));
    }
    else if ($_p["active"] == "Y") {
        $db_c->update($table, ["credit" => 1,"balance_credit" => 1], "`status`=2 and `id` = {$uid}");
        $para = [
            "status" => "OK",
            "act" => "one_retrieve",
            "active" => "Y",
            "retrieve_data" => [
                "status" => "OK",
                "now_layer" => "mem"
            ]
        ];
        
        $cc->insertLog("账号管理->额度回收->回收");
        exit(json_encode($para));
    }
}
