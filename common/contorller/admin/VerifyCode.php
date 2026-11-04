<?php
session_start();
/**
 * 改造的加减法验证类
 * 使用示例 VerifyCode::get('xxx', 20);
 * 验证示例 VerifyCode::check('1', 'xxx');
 */
class VerifyCode
{
    /**
     * php验证码  算式验证码
     */
    public static function get($one,$two,$prefix = '', $font_size = 28)
    {
        //文件头...
        header("Content-type:image/png");
        ob_end_clean();
        //创建真彩色白纸
        $width            = $font_size*2.1;
        $height           = $font_size;
        $im               = @imagecreatetruecolor($width, $height) or die("建立图像失败");
        //获取背景颜色
        $background_color = imagecolorallocate($im, 255, 255, 255);
        //填充背景颜色
        imagefill($im, 0, 0, $background_color);
        //获取边框颜色
        $border_color     = imagecolorallocate($im, 200, 200, 200);
        //画矩形，边框颜色200,200,200
        imagerectangle($im,0,0,$width - 1, $height - 1,$border_color);


        //逐行炫耀背景，全屏用1或0
        for($i = 2;$i < $height - 2;$i++) {
            //获取随机淡色
            $line_color = imagecolorallocate($im, rand(200,255), rand(200,255), rand(200,255));
            //画线
            //imageline($im, 2, $i, $width - 1, $i, $line_color);   //画一条线  画线条
            imageellipse($im, rand(0, 120), rand(0, 120), rand(0, 120), rand(0, 120), $line_color);   //画椭圆
        }


        //设置印上去的文字
        $firstNum  = $one;
        $secondNum = $two;

        /*
         * 随机获取值来判断是乘除还是加减
         */

        if($one > $two){
            $chu_num = $one/$two;
        }
        $rand_num = mt_rand(1,5);
        if($rand_num != 1  && is_int($chu_num) && $two != 0){   //判断结果是否为整数
            $actionStr = $firstNum > $secondNum ? '/' : '*';
        }else{
            $actionStr = $firstNum > $secondNum ? '-' : '+';
        }

        //获取第1个随机文字
        $imstr[0]["s"] = $firstNum;
        $imstr[0]["x"] = rand(2, 5);
        $imstr[0]["y"] = rand(1, 4);

        //获取第2个随机文字
        $imstr[1]["s"] = $actionStr;
        $imstr[1]["x"] = $imstr[0]["x"] + $font_size - 1 + rand(0, 1);
        $imstr[1]["y"] = rand(1,5);

        //获取第3个随机文字
        $imstr[2]["s"] = $secondNum;
        $imstr[2]["x"] = $imstr[1]["x"] + $font_size - 1 + rand(0, 1);
        $imstr[2]["y"] = rand(1, 5);

        //获取第3个随机文字
        $imstr[3]["s"] = '=';
        $imstr[3]["x"] = $imstr[2]["x"] + $font_size - 1 + rand(0, 1);
        $imstr[3]["y"] = 3;

        //获取第3个随机文字
        $imstr[4]["s"] = '?';
        $imstr[4]["x"] = $imstr[3]["x"] + $font_size - 1 + rand(0, 1);
        $imstr[4]["y"] = 3;

        //文字
        $text = '';
        //获取随机较深颜色
        $text_color = imagecolorallocate($im, rand(50, 180), rand(50, 180), rand(50, 180));

        //写入随机字串
        for($i = 0; $i < 5; $i++) {
            //$text_color = imagecolorallocate($im, rand(50, 180), rand(50, 180), rand(50, 180));//获取随机较深颜色
            $text .= $imstr[$i]["s"];
            //imagechar($im, $font_size, $imstr[$i]["x"], $imstr[$i]["y"], $imstr[$i]["s"], $text_color);//画文字，设置文字大小
        }


        /*
         * 为图片添加噪点，线条，雪花，增加干扰度
         * */
        for ($i=0;$i<6;$i++) {
            $color = imagecolorallocate($im,mt_rand(0,156),mt_rand(0,156),mt_rand(0,156));
            imageline($im,mt_rand(0,140),mt_rand(0,28),mt_rand(0,140),mt_rand(0,28),$color);
        }
        for ($i=0;$i<100;$i++) {
            $color = imagecolorallocate($im,mt_rand(200,255),mt_rand(200,255),mt_rand(200,255));
            imagestring($im,mt_rand(1,5),mt_rand(0,140),mt_rand(0,28),'*',$color);
        }
        imagestring($im, 5, rand(15,20), rand(10,15), $text, $text_color);


        if($rand_num != 1  && is_int($chu_num)){
            $_SESSION[$prefix.'verifycode'] = $firstNum > $secondNum ? ($firstNum / $secondNum) : ($firstNum * $secondNum);
        }else{
            $_SESSION[$prefix.'verifycode'] = $firstNum > $secondNum ? ($firstNum - $secondNum) : ($firstNum + $secondNum);
        }
        //显示图片
        imagepng($im);
        //销毁图片
        imagedestroy($im);

    }
    public static function check($code, $prefix = '')
    {
        if(trim($_SESSION[$prefix.'verifycode']) == trim($code)) {
            return true;
        } else {
            return false;
        }
    }
}
