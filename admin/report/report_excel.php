<?php
$_p = unserialize(_POST_);
$arr_js = ["report/report_excel.js"];
$arr_css = [];
$js = "
        top.ver = 'version-10-13';
";
$css = "";
include_once INCLUDE_DIR."/getHtml.php";