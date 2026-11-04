<?PHP

use function PHPSTORM_META\type;

class AutoCurlFile
{
    private $url;
    private $uid;
    private $web;
    private $curl; 
    private $db;
    private $html_path = DIR_MEMBER."/html/";

    public function __construct(){
        global $db_s;
        $this->db = $db_s;
        $rs = $db_s->select("SELECT * FROM ".Constant::VIEW_CLIENT_CURL." WHERE `status`='ok' LIMIT 1","Row");
        if(!empty($rs)){ 
            $this->url = $rs["url"];
            $this->uid = $rs["uid"];
            $this->web = $rs;
        }
        $this->curl = new Curl_HTTP_Client();
        $this->curl->set_user_agent("Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1");
    }

    /**
     * 获取首页
     * @param string $filename 文件名
     * @param string $langx 语言
     * @param string $type cu:采集路径
     * @param bool $isSave 是否强制更新
     * @return $content 获取html内容
     */
    public function curlIndex($filename,$langx,$type="",$isSave=true){ 
        if($type == "cu"){ 
            $url=$this->url."/?cu=N&uid=".$this->uid."&pay_type=1&username=&passwd_safe=&mid=".$this->web["mid"]."&ltype=3&currency=RMB&odd_f=H,M,I,E&domain=&odd_f_type=H&four_pwd=second&msg=&langx=".$langx;
            $html = $this->curl->fetch_url($url);
        }else{ 
            $post = [
                "detection" => "Y",
                "sub_doubleLogin" => "", 
                "isapp"=> "",
                "appversion" => "",
                "langx" => $langx,
            ];
            $html = $this->curl->send_post_data($this->url."/index.php",$post,"",10);
            $html = preg_replace("/console\.log\((.*?)\)/","", $html);
        }
        
        if(!empty($html)){
            
            $is_put = $this->checkFile($filename,$html);
            //文件有变化、强制更新、文件不存在 
            if($is_put || $isSave || !file_exists($this->html_path.$filename)){ 
                $this->_write_file($html, $filename, $this->html_path);
            }
             
            preg_match_all("/url\('..\/(.*?)'\);/s", $html, $matches);
            foreach($matches[1] as $k => $v){ 
                $this->curlImages($v);
            }


        }
        return $html;
    }

    /**
     * 获取其他页面
     * @param string $filename 文件名 
     * @param array $_p POST参数 
     * @param bool $isSave 是否强制更新
     * @return $content 获取html内容
     */
    public function curlOther($filename,$_p = []){ 
        $userId = 0;
        if(isset($_p["uid"]) && !empty($_p["uid"])){ 
            $sql = "";
            $rs = $this->db->select("SELECT `id` FROM ".Constant::T_MEMBER." WHERE `uid`='{$_p["uid"]}' LIMIT 1","Row");
            if(!empty($rs)){ 
                $userId = $rs["id"];
            }
        }
        $tf = new Transform();
        $tf->getUserCurl(1,0);
        $html = $tf->get_curl_data_html($_p);
        // 获取当前协议（http或https）
        $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] != 'off' ? 'https' : 'http';
        // 获取主机名
        $host = $_SERVER['HTTP_HOST'];
        // 组合成完整的URL
        $currentDomain = $protocol . '://' . $host;
        $html = preg_replace("/href=\"http\:\/\/(.*?)\/(.*?).css\"/is","href=\"/$2.css\"",$html);
        if(isset($html["status"])){
            print_r($html);exit;
        }
        if(!empty($html)){
            // $html = preg_replace("/console\.log\((.*?)\)/","", $html);
            $this->checkFile($filename,$html); 
            file_put_contents($this->html_path.$filename,$html);
             
            //图片
            preg_match_all("/url\('..\/(.*?)'\)/s", $html, $matches);
            foreach($matches[1] as $k => $v){ 
                $this->curlImages($v);
            }

            //css 
            preg_match_all("/\/style\/(.*?).css/is", $html, $styles); 
            
            foreach($styles[0] as $k => $v){
                $this->curlStyle($v);
            }
        }

        
        return $html;
    }

    /**
     * 检测是否需要替换文件 
     * @param string $path 文件路径 
     * @param string $content 内容
     * @return string $is_put 是否需要替换
     */
    public function checkFile($path,$content) { 
        if (!empty($path) && !empty($content)) {
            $content = md5($content);
            $ary = [
                "md5"    => $content, 
                "path"   => $path,
                "isSave" => 0,
                "datetime" => date("Y-m-d H:i:s")
            ]; 
            $this->db->replace(Constant::T_HTML,$ary);
        }
    }

    /** 
     * 获取图片
     * @param string $v 图片路径和名字
     */
    public function curlImages($v) { 
        $img_path = ltrim(explode("?", $v)[0],"/");
        $paths = explode("/", $img_path);
        $count = count($paths) - 1;
        $filename = $paths[$count];
        $dir = DIR_MEMBER;
        if($count>0){ //有目录
            $dir .= str_replace($filename,"",$img_path);
        }
        try{ 
            $imgStr = $this->curl->fetch_url_no_error($this->url."/".$img_path);
            if (!empty($imgStr)){ 
                $this->checkFile($img_path,$imgStr);
                $this->_write_file($imgStr,$filename,$dir);
            }
        }catch(Exception $e){
            return false;
        }
        
    }

    /**
     * 获取css文件
     */
    public function curlStyle($v){ 
        $path = ltrim(explode("?", $v)[0],"/");
        $paths = explode("/", $path);
        $count = count($paths) - 1;
        $filename = $paths[$count];
        $dir = DIR_MEMBER;
        if($count>0){ //有目录
            $dir .= str_replace($filename,"",$path);
        }
        try{ 
            $content = $this->curl->fetch_url_no_error($this->url."/".$path);
            if (!empty($content)){ 
                $this->checkFile($path,$content);
                $this->_write_file($content,$filename,$dir);
            }
        }catch(Exception $e){
            return false;
        }
    }

    /**
     * 写入文件
     *
     * @param string $str
     * @param string $filename
     * @param string $dir
     * @return boolean
     */
    private function _write_file($str, $filename, $dir="") {
        // 创建目录
        if (!is_dir($dir)) { 
            mkdir ($dir, 0777, true );
        }
        file_put_contents($dir.$filename,$str);
    }
}
?>