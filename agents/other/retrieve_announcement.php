<?php
$_p = unserialize(_POST_);
$arr_js = ["show_announcement.js"];
$arr_css = [
    "control/reset.css",
    "control/guide.css",
];
include_once INCLUDE_DIR."/getHtml.php";