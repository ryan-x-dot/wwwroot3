<?php
$_p = unserialize(_POST_);
$arr_js = ["{$_p["p"]}.js"];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/overcss.css"
];
$js = "";
$css = '
        tt.word_blue{
            -webkit-transition: all 0.1s ease-in-out;
            transition: all 0.1s ease-in-out;
        }
        tt.word_blue:hover{
            color: #660099;
        }
        ';
include_once INCLUDE_DIR . "/getHtml.php";