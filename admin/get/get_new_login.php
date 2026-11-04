<?php
/**
 * 后台"登录提示音"轮询接口
 *
 * 入参（POST）：
 *   p            = get_new_login
 *   uid          = 当前登录管理员 uid（必填）
 *   login_layer  = ad/ads/d0/co/su/ag
 *   langx        = zh-cn / zh-tw / en-us
 *   since        = int，上次轮询到的服务器时间戳
 *   layers       = "mem,ag" / "mem" / "ag"（可选，默认全监听）
 *   max          = int，单次最多返回条数（可选，默认 20，上限 50）
 *
 * 返回 JSON：
 *   {"status":"success","server_time":1725600000,"events":[{"layer":"mem","name":"...","logintime":...,"loginip":"...","ip_address":"..."}, ...]}
 */
$_p = unserialize(_POST_);
$log = new Eventlog($_p);
$userArr = $log->getUID();//uid验证
if ($userArr["status"] == "error") {
    exit(json_encode($userArr));
}
$para = $log->get_new_login();
exit(json_encode($para));
