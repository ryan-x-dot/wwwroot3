<?php
global $db_c;
$_p = unserialize(_POST_);
$cc = new Account($_p);
$userArr = $cc->getUID();//uid验证
if($userArr["status"]=="error"){exit(json_encode($userArr));}
$table = Constant::T_MEMBER;
$nid = $userArr["user"]["nid"];
$sql = "SELECT * FROM {$table} WHERE `status`=2 and `nid` like '{$nid}%' ";//order by `name` asc
if (!empty($_p["user_name"])) {
    $sql .= " and name like '%{$_p["user_name"]}%' ";
}
$sql .= " order by ";
if (!empty($_p["sort_name"])) {
    switch ($_p["sort_name"]) {
        case "currency":
            $sql .= " currency ";
            break;
        case "maxcredit":
            $sql .= " credit ";
            break;
        default:
            $sql .= " name ";
            break;
    }
} else {
    $sql .= " name ";
}

if (!empty($_p["sort_type"])) {
    switch ($_p["sort_type"]) {
        case "asc":
            $sql .= " asc ";
            break;
        case "desc":
            $sql .= " desc ";
            break;
        default:
            $sql .= " asc ";
            break;
    }
} else {
    $sql .= " asc ";
}

$rs = $db_c->select($sql,"All");
foreach ($rs as &$r) {
    $r["maxcredit"] = $r["balance_credit"];
    $r["username"] = $r["name"];
    $r["user_id"] = $r["id"];
}

$para = [
    "this_layer" => "mem",
    "lower_layer" => null,
    "account" => $rs
];

$cc->insertLog("账号管理->额度回收[加载数据]");
exit(json_encode($para));