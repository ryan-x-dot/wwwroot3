<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js"];
$arr_css = [
    "control/main_control.css",
    "control/alert_choose_lan.css",
    "control/my_setting.css",
    "control/new_url.css",
    "control/contact.css",
    "control/rwd.css"
];
$js = "";
$css = "";
include_once INCLUDE_DIR . "/getHtml.php";