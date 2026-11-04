<?php
$_p = unserialize(_POST_);
//$cc = new Account($_p);
//$para = $cc->chk_username();
$arr_js = [
    "{$_p["p"]}.js",
    "lib/CountdownTimer.js",
    "lib/source_date.js",
    "lib/Timer.js",
    "lib/LocalstorageManager.js"
];
$arr_css = ["control/{$_p["p"]}.css"];
$js = "";
$css = "
        
        .mu_memberUL_rightTxt{
            font-weight: 600;
        }
        
        .online_li{
            display: flex;
            justify-content: flex-end;
            width: 100%;
            padding: 0px;
            height: 100%;
            color:#ffffff;
        }
        .online_li li{
            position: relative;
            display: flex;
            align-items: center;
            height: 100%;
            padding: 0 8px;
            border-left: 1px solid #E86E68;
        }
        
        .online_li li:hover{
            color:#d5d4d4;
        }
        
        .top_menu_span{
            display: flex;
            justify-content: flex-end;
            width: 100%;
            height: 100%;
        }
    ";
include_once INCLUDE_DIR."/getHtml.php";