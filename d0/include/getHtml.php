<?php
global $dirHtml,$arr_js,$arr_css,$js,$css;
$setHtml = new SetHtml();
$html = $setHtml->getHtml($dirHtml,$arr_js,$arr_css,$js,$css);
print_r($html);
exit;