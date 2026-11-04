<?php
$_p = unserialize(_POST_);
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
    .online_li {
        display: flex;
        color: #FFFFFF;
        margin-left: 30px;
        margin-top:18px;
    }
    .online_li li{
        padding: 0px 5px;
        cursor: pointer;
    }
    .online_li li:hover{
        color:#d5d4d4;
    }
    .mu_memberUL_rightTxt{
        font-weight: 600;
    }
    
    @media screen and (min-width: 0px) and (max-width:1024px){
        .mu_infoG{
            min-width: 100px;
        }
    }
";
include_once INCLUDE_DIR."/getHtml.php";