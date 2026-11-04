<?php
$code = unserialize(IS_NORMAL);
$_p = unserialize(_POST_);
switch($code["code"]){
    case 2:
        $para = [
            "code"=>"102",
            "action"=>"login",
            "status" => "error",
            "status_code" => "4X009"
        ];
        break;
    default:
        if(!isset($_SESSION["login_time"])){
            $_SESSION["login_time"] = time();
            $_SESSION["login_num"] = 1;//次数
            $_SESSION["no_login"] = "N";
        }else{
            if($_SESSION["no_login"] == "Y"){ //3分钟后登陆
                if(time()-$_SESSION["login_time"] > 3 *60){ //解除登陆
                    $_SESSION["login_time"] = time();
                    $_SESSION["login_num"] = 1;//次数
                    $_SESSION["no_login"] = "N";
                }else{
                    $para = [
                        "code"=>"102",
                        "action"=>"login",
                        "status" => "error",
                        "status_code" => "4X006"
                    ];
                    print_r(json_encode($para));exit;
                }
            }

            if(time() - $_SESSION["login_time"] <= 3){ //3秒内
                if($_SESSION["login_num"]>5){//访问5次以上禁止登陆
                    $para = [
                        "code"=>"102",
                        "action"=>"login",
                        "status" => "error",
                        "status_code" => "4X006"
                    ];
                    $_SESSION["no_login"] = "Y";
                    print_r(json_encode($para));exit;
                }else{//5次内记录访问次数
                    $_SESSION["login_num"] += 1;
                }

            }else{//超出3秒恢复初始值
                $_SESSION["login_time"] = time();
                $_SESSION["login_num"] = 1;//次数
            }
        }
        if(!empty($_p["uid"]) && $_p["uid"]!="null") {
            $_p["uid"] = "";
        }
        $login = new Login($_p);
        $para = $login->getLogin();
        //print_r($para);exit;
        break;

}

if($para["status"] == "success"){
    $_SESSION[Constant::LOGIN_LAYER] = $_p["login_layer"];
}
print_r(json_encode($para));exit;

