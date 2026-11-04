<?PHP
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
$refreshTime = 30;//刷新时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php';
$dir = ROOT_PATH .'/member/';
//首页抓取  
$rs = $db_s->select("SELECT `url` FROM ".Constant::T_URL." WHERE `status`='ok' LIMIT 1","Row");
if ($rs){  
    $path = $rs["url"]."/index.html";
    $response = file_get_contents($path);
    if($response){ 
        file_put_contents($dir."/html/index.html",$response);
    }
}

// $html_ary = traverseDirectory( $dir . "html");
// if(count($html_ary) > 0){ 
//     foreach($html_ary as $k => $v){ 
//         $path = str_replace("","", $v);
//     }
// }
function traverseDirectory($dir) {
    $ary = [];
    $files = glob($dir . "/*");
    foreach ($files as $file) {
        if (is_file($file)) {
            $ary[] = $file;
        } elseif (is_dir($file)) {
            traverseDirectory($file);
        }
    }
    return $ary;
}

?>