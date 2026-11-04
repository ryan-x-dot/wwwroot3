<?PHP
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
$refreshTime = 30;//刷新时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php'; 
define("DIR_MEMBER",ROOT_PATH."/member/");
$dir_html = DIR_MEMBER."html";
$dir_style = DIR_MEMBER."style"; 
do{ 
    $pathAry = $db_s->select("SELECT `path` FROM ".Constant::T_HTML);

    if(is_dir($dir_html)){
        $acf = new AutoCurlFile();
        traverseFolder($dir_html);
    }
    if(is_dir($dir_style)){ 
        $acf = new AutoCurlFile();
        traverseFolder($dir_style);
    }
    print_r(" {$refreshTime}秒后开始检测图片情况...\n");
    sleep($refreshTime);
} while(true);


function traverseFolder($folderPath) {
    global $acf,$pathAry;
    $paths = [];
    if(count($pathAry)>0){ 
        $paths = array_column($pathAry,"path");
    }
    
    $files = glob(rtrim($folderPath, '/') . '/*');
    foreach ($files as $file) {
        if (is_file($file)) {
            $content = file_get_contents($file);
            $content = preg_replace("/url\(..\/images\/(.*?)\)/is","url('../images/$1')", $content);

            //图片
            preg_match_all("/url\('..\/(.*?)'\)/s", $content, $matches);
            foreach($matches[1] as $k => $v){ 
                $isSave = false; 
                if (count($paths)==0){ 
                    $isSave = true;
                }else{ 
                    if(!in_array(ltrim(explode("?", $v)[0],"/"),$paths)){ 
                        $isSave = true;
                    }
                }
                if ($isSave){
                    $acf->curlImages($v);
                    print_r("[{$v}] 更新成功!!!\n");
                }
            }

            preg_match_all("/\"..\/images\/(.*?)\"/is", $content, $matches);
            foreach($matches[1] as $k => $v){ 
                $v = "images/".$v;
                $isSave = false; 
                if (count($paths)==0){ 
                    $isSave = true;
                }else{ 
                    if(!in_array(ltrim(explode("?", $v)[0],"/"),$paths)){ 
                        $isSave = true;
                    }
                }
                if ($isSave){
                    $acf->curlImages($v);
                    print_r("[{$v}] 更新成功!!!\n");
                }
            }

            preg_match_all("/\"..\/..\/images\/(.*?)\"/is", $content, $matches);
            foreach($matches[1] as $k => $v){ 
                $v = "images/".$v;
                $isSave = false; 
                if (count($paths)==0){ 
                    $isSave = true;
                }else{ 
                    if(!in_array(ltrim(explode("?", $v)[0],"/"),$paths)){ 
                        $isSave = true;
                    }
                }
                if ($isSave){
                    $acf->curlImages($v);
                    print_r("[{$v}] 更新成功!!!\n");
                }
            }

            preg_match_all("/\"..\/..\/..\/images\/(.*?)\"/is", $content, $matches);
            foreach($matches[1] as $k => $v){ 
                $v = "images/".$v;
                $isSave = false; 
                if (count($paths)==0){ 
                    $isSave = true;
                }else{ 
                    if(!in_array(ltrim(explode("?", $v)[0],"/"),$paths)){ 
                        $isSave = true;
                    }
                }
                if ($isSave){
                    $acf->curlImages($v);
                    print_r("[{$v}] 更新成功!!!\n");
                }
            }


        }
        if (is_dir($file)) {
            traverseFolder($file); // 递归遍历子文件夹
        }
    }
}
?>