<?php
$_p = unserialize(_POST_);
$arr_js = ["totalbet/{$_p["p"]}.js"];
$arr_css = [
    "control/reset.css",
    "control/report_control00.css",
    "control/totalbet_control.css",
    "control/overcss.css"
];
$css = ' 
#filter_div.re_sreachtermG {
    padding: 7px 9px;
    background-color: #f0f0f0;
    border-bottom: 4px solid #e0e0e0;
    white-space: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}

#filter_div.re_sreachtermG .re_sreachterm_title1 {
    font-size: 12px;
    margin: 0 4px 0 6px;
}


';
include_once INCLUDE_DIR."/getHtml.php";
