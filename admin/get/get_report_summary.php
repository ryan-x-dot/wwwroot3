<?php
global $currencys,$langx,$ls_msg,$web_time_zone;
$ary = [];

$last_week = date_between("lw");
$this_week = date_between("tw");
$les = date_between("lp");
$es = date_between("tp");
$issue = issue();
$game_over_yn = Dashboard::sum_matchs()["game_over_yn"];
$ary["period"] = [
    "period_ls"=>date("Y-m-d",strtotime($les["start"])),
    "period_le"=>date("Y-m-d",strtotime($les["end"])),
    "period_s"=>date("Y-m-d",strtotime($es["start"])),
    "period_e"=>date("Y-m-d",strtotime($es["end"])),
    "period_year"=>date("Y"),
    "period_num"=>$issue["k"],
    "today"=>date("Y-m-d"),
    "tomorrow"=>date("Y-m-d",strtotime("+1 day")),
    "this_week_s"=>date("Y-m-d",strtotime($this_week["start"])),
    "this_week_e"=>date("Y-m-d",strtotime($this_week["end"])),
    "last_week_s"=>date("Y-m-d",strtotime($last_week["start"])),
    "last_week_e"=>date("Y-m-d",strtotime($last_week["end"])),
    "yesterday"=>date("Y-m-d",strtotime("-1 day")),
    "today_finish"=>$ls_msg[$langx]["4X002"],
    "yesterday_finish"=>$ls_msg[$langx]["4X001"],
    "today_finish_class"=>"word_red",
    "yesterday_finish_class"=>"word_green",
    "game_over_yn"=>$game_over_yn,
    "WEB_TIME_ZONE"=>$web_time_zone //web时区
];

exit(json_encode($ary));