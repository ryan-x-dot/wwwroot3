<?php
/**
 * Class SetHtml 生成HTML文件
 */

class SetHtml
{
    private $jsDir = "";
    private $cssDir = "";
    private $htmlDir = "";

    public function __construct(){
        
        $this->jsDir = DIR_ADMIN."/js/";
        $this->cssDir = DIR_ADMIN."/style/";
        $this->htmlDir = DIR_ADMIN."/html/";
    }


    /**
     * 读取js文件
     * @param $arr js文件名数组
     * @param $str 其他js字符串
     * @return string js字符串
     */
    public function jsFilesOrStr($arr,$str=""){
        $js = "";
        foreach ($arr as $v){
            $js .= getFileTxt($this->jsDir.$v);
        }
        $js .= $str;

        return $js;
    }

    /**
     * 读取css文件
     * @param $arr css文件名数组
     * @param $str 其他html字符串
     * @return string css字符串
     */
    public function cssFilesOrStr($arr,$str=""){
        $css = "";
        foreach ($arr as $v) {
            $css .= getFileTxt($this->cssDir.$v);
        }
        $css .= $str;
        return $css;
    }

    /**
     * 生成html
     * @param $dirHtml html文件路径
     * @param $arr_js js文件集
     * @param $arr_css css文件集
     * @param string $jsStr 其他js字符串
     * @param string $cssStr 其他css字符串
     * @return false|string|string[]
     */
    public function getHtml($dirHtml,$arr_js,$arr_css,$jsStr="",$cssStr=""){ 
        $html = file_get_contents($this->htmlDir.$dirHtml);
        $js = $this->jsFilesOrStr($arr_js,$jsStr);
        $css = $this->cssFilesOrStr($arr_css,$cssStr);
        $html = str_replace('{JS}',$js,$html);
        $html = str_replace('{CSS}',$css,$html);
        return $html;
    }
}