<?PHP
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit('Forbidden');
}
header('Content-type: text/html;charset=utf-8');
$refreshTime = 3*50;//刷新时间
$refreshTime_one = 5;//单次刷新间隔时间
set_time_limit(0);// 通过set_time_limit(0)可以让程序无限制的执行下去
include_once 'include/config.php'; 
do{
   print_r("============解封检查[START]============\n");
    $is = "NO";
    $table = Constant::T_UID;
    $rs = $db_s->select("SELECT * FROM {$table} WHERE `status` <> 'ok' and status!='线路不通！'");
    if(count($rs)==0){ 
        print_r("暂无需要解封的账号\n");
    }else{ 
        $tf = new TransformAG();
        $tf->randUser();
        foreach ($rs as $k => $v) { 
            $re = json_decode($tf->longerr_Edit($v["mid"]),true);
            // print_r($re);
            if(isset($re["code"]) && $re["code"]=="longerrSuccess"){
                print_r("账号:{$v["user"]} 解封成功!\n");
            }else{
                if(isset($re["code"]) && isset($re["msg"])){ 
                    print_r("账号:{$v["user"]} 解封失败![code:{$re["code"]},msg:{$re["msg"]}]\n");
					if (strpos($re["msg"], "unblock") !== false || strpos($re["msg"], "Error") !== false) {
						$regsta=autureguser($v);
						if($regsta["status"]=="ok"){
							$ary["uid"]=$regsta["uid"];
							$ary["user"]=$regsta["user"];
							$ary["pwd"]=$regsta["pwd"];
							$ary["mid"]=$regsta["mid"];
							$ary["status"]="ok";
							$db_s->update($table,$ary,"id='".$rs['id']."'");
						}
					}
                }else{ 
                    print_r("账号:{$v["user"]} 解封失败!\n");
                }
                
            }
        }
    }
    print_r("============解封检查[ END ]============\n\n");
    sleep($refreshTime); 
}while(true);
?>