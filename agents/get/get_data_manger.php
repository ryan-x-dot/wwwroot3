<?php
global $db_c,$db_s,$database_s,$database_c;
$_p = unserialize(_POST_);
$bl = new BetList($_p);
$userArr = $bl->getUID();//uid验证
$ary = [
    "status" => "error",
    "msg" => ""
];
switch ($_p["action"]){
    case "OPTIMIZE":
        $rs = $db_c->select("SELECT TABLE_NAME FROM information_schema.tables WHERE  table_schema='{$database_c}'");
        foreach ($rs as $v){
            $db_c->select("OPTIMIZE TABLE `{$v["TABLE_NAME"]}`");
        }
        $rs = $db_c->select("SELECT TABLE_NAME FROM information_schema.tables WHERE  table_schema='{$database_s}'");

        foreach ($rs as $v){

            $db_c->select("OPTIMIZE TABLE `{$v["TABLE_NAME"]}`");
        }
        $ary["status"] = "success";
        $ary["msg"] = "优化完成!";
        break;
    case "REPAIR":
        $rs = $db_c->select("SELECT TABLE_NAME FROM information_schema.tables WHERE  table_schema='{$database_c}'");
        foreach ($rs as $v){
            $db_c->select("REPAIR TABLE `{$v["TABLE_NAME"]}`");
        }
        $rs = $db_c->select("SELECT TABLE_NAME FROM information_schema.tables WHERE  table_schema='{$database_s}'");

        foreach ($rs as $v){

            $db_c->select("REPAIR TABLE `{$v["TABLE_NAME"]}`");
        }
        $ary["status"] = "success";
        $ary["msg"] = "修复完成!";
        break;
    case "COPY":
        try{
            $file_path_name=ROOT_PATH.'/sqlbackup/';//保存到的路径
            $db_c->backup("",$file_path_name."db_client/");
            $db_s->backup("",$file_path_name."db_sports/");
            $ary["status"] = "success";
            $ary["msg"] = "备份成功!";
        }catch (\Exception $e){
            $ary["msg"] = $e->getMessage();
        }
        break;
    case "DELETE":
        $ary = $bl->delete_bet_list();
        break;
    default:
        $ary["msg"] = "参数错误";
        break;
}
exit(json_encode($ary));
