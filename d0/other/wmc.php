<?php
global $dirHtml;
$_p = unserialize(_POST_);
$arr_js = ["wmc/wmc.js"];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/overcss.css",
];
$js = "
        top.ver = 'version-12-29';
";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";