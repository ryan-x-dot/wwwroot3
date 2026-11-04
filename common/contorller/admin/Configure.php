<?php

/**
 * Class Configure 后台配置类
 */
class Configure extends Base
{
    public function __construct($_p = [])
    {
        parent::__construct($_p);
    }

    /**
     * 最新网址查询
     */
    public function get_new_url(){
        if(strlen($this->user["nid"]) == 16){
            $arr = $this->getConnDefaultNewUrl();
        }else{
            $nid = sup_nid(Constant::AD,$this->user["nid"]);
            $conn_table = Constant::T_CONFIG;
            $r = $this->dbc->select("SELECT `new_url` FROM {$conn_table} WHERE `nid`='{$nid}'");
            if(!$r){
                $arr = $this->getConnDefaultNewUrl();
            }else{
                if(empty($r["new_url"])){
                    $arr = $this->getConnDefaultNewUrl();
                }else{
                    $arr = json_decode($r["new_url"],true);
                }
            }
        }

        return $arr;
    }


    /**
     * 读取默认最新网址
     * @return mixed
     */
    public function getConnDefaultNewUrl(){
        $conn_default = Constant::T_CONFIG_DEFAULT;
        $rs = $this->dbc->select("SELECT `new_url` FROM {$conn_default} LIMIT 1","Row");
        return json_decode($rs["new_url"],true);
    }

    /**
     * 查询采集配置
     */
    public function curlConf(){
        if(isset($this->param["showtype"])){ 
            $table = "";
            $type = 1;
            switch (strtoupper($this->param["showtype"])){
                case "UP":
                case "DOWN":
                    $table = Constant::T_UID;
                    $where = "`ctype`=1";
                    if(strtoupper($this->param["showtype"]) == "DOWN"){ 
                        $where = "`ctype`>1";
                    }
                    $rs = $this->dbs->select("SELECT * FROM {$table} WHERE {$where}");
                    return $rs;
                    break;
                case "AG":
                    $table = Constant::T_AGUID;
                    $rs = $this->dbs->select("SELECT `id`,`url`,`username` AS `user`,`password` AS `pwd`,`uid`,`msg` AS `status` ,`ver` FROM {$table}");
                    return $rs;
                    break;
                case "URL": 
                    $table = Constant::T_URL;
                    $rs = $this->dbs->select("SELECT `id`,`url`,`ms`,`status` FROM {$table}");
                    return $rs;
                    break;
                case "AUTOREG":
                    $table = Constant::T_CONFIG_DEFAULT;
                    $rs = $this->dbs->select("SELECT `auto_reg_num`,`auto_reg_interval`,`auto_reg_enabled` FROM {$table} LIMIT 1","Row");
                    if($rs){
                        return $rs;
                    }
                    return ["auto_reg_num"=>"","auto_reg_interval"=>"5","auto_reg_enabled"=>"0"];
                    break;
            } 
        } 
        return [];
    }

    public function curlConfAdd(){
      
        if(isset($this->param["ary"])){
            $ary =json_decode(html_entity_decode($this->param["ary"]),true);
            
            // $ary = serialize($ary);
        }

        $save = [];
        switch (strtoupper($this->param["type"])){
            case "UP":
            case "DOWN":
                $table = Constant::T_UID;
                $ctype = 1; 
                if(strtoupper($this->param["type"])=="DOWN"){ 
                    $ctype = 2;
                }
                try{
                    foreach ($ary as $k => $v){
                        $sql = "INSERT INTO {$table} (`url`,`user`,`pwd`,`uid`,`status`,`ctype`) VALUES ('{$v["url"]}','{$v["user"]}','{$v["pwd"]}','{$v["uid"]}','{$v["status"]}','{$ctype}')";
                        $sql.= " ON DUPLICATE KEY UPDATE";
                        $sql.= "`url`=VALUES(`url`),`user`=VALUES(`user`),`pwd`=VALUES(`pwd`),`uid`=VALUES(`uid`),`status`=VALUES(`status`)";
                        $this->dbs->execSql($sql);
                    }

                    return [
                        "status" => "success",
                        "code" => "add"
                    ];
                }catch (\Exception $e){
                    return [
                        "status" => "error",
                        "msg" => $e->getMessage()
                    ];
                }
                break;
            case "AG":
                $table = Constant::T_AGUID;
                try{
                    foreach ($ary as $k => $v){
                        $sql = "INSERT INTO {$table} (`url`,`username`,`password`,`uid`,`msg`) VALUES ('{$v["url"]}','{$v["user"]}','{$v["pwd"]}','{$v["uid"]}','{$v["status"]}')";
                        $sql.= " ON DUPLICATE KEY UPDATE";
                        $sql.= "`url`=VALUES(`url`),`username`=VALUES(`username`),`password`=VALUES(`password`),`uid`=VALUES(`uid`),`msg`=VALUES(`msg`)";
                        $this->dbs->execSql($sql);
                    }

                    return [
                        "status" => "success",
                        "code" => "add"
                    ];
                }catch (\Exception $e){
                    return [
                        "status" => "error",
                        "msg" => $e->getMessage()
                    ];
                }
                break;
            case "URL":
                $table = Constant::T_URL;
                try{
                    
                    foreach ($ary as $k => $v){
                        $sql = "INSERT INTO {$table} (`url`) VALUES ('{$v["url"]}')";
                        $sql.= " ON DUPLICATE KEY UPDATE";
                        $sql.= "`url`=VALUES(`url`)";
                        #cho $sql;
                        #echo "<br>";
                        $this->dbs->execSql($sql);
                    }
                    return [
                        "status" => "success",
                        "code" => "add"
                    ];
                }catch (\Exception $e){
                    return [
                        "status" => "error",
                        "msg" => $e->getMessage()
                    ];
                }

                break;
            case "DEL_URL":
                if(isset($this->param["id"]) && is_numeric($this->param["id"]) && $this->param["id"]>0){
                    $table = Constant::T_URL;
                    $sql = "DELETE FROM {$table} WHERE `id`={$this->param["id"]}";
                }else{
                    return ["status" => "error","msg"=>"参数错误!"];
                }
                break;
            case "DEL_AG":
                if(isset($this->param["id"]) && is_numeric($this->param["id"]) && $this->param["id"]>0){
                    $table = Constant::T_AGUID;
                    $sql = "DELETE FROM {$table} WHERE `id`={$this->param["id"]}";
                }else{
                    return ["status" => "error","msg"=>"参数错误!"];
                }
                break;
            case "DEL_UID":
                if(isset($this->param["id"]) && is_numeric($this->param["id"]) && $this->param["id"]>0){
                    $table = Constant::T_UID;
                    $sql = "DELETE FROM {$table} WHERE `id`={$this->param["id"]}";
                }else{
                    return ["status" => "error","msg"=>"参数错误!"];
                }
                break;
            case "SET_CURL_URL":
                $table = Constant::T_UID;
                $sql = "UPDATE {$table} SET `url`='{$this->param["url"]}'";
                break;
            case "AUTOREG":
                $table = Constant::T_CONFIG_DEFAULT;
                $auto_reg_num = isset($this->param["auto_reg_num"]) ? intval($this->param["auto_reg_num"]) : 1;
                $auto_reg_interval = isset($this->param["auto_reg_interval"]) ? intval($this->param["auto_reg_interval"]) : 5;
                $auto_reg_mem_url = isset($this->param["auto_reg_mem_url"]) ? trim($this->param["auto_reg_mem_url"]) : '';
                try{
                    if ($auto_reg_mem_url !== '') {
                        $sql = "UPDATE {$table} SET `auto_reg_num`={$auto_reg_num},`auto_reg_interval`={$auto_reg_interval},`auto_reg_mem_url`='{$auto_reg_mem_url}'";
                    } else {
                        $sql = "UPDATE {$table} SET `auto_reg_num`={$auto_reg_num},`auto_reg_interval`={$auto_reg_interval}";
                    }
                    $this->dbs->execSql($sql);
                    return [
                        "status" => "success",
                        "code" => "add"
                    ];
                }catch (\Exception $e){
                    return [
                        "status" => "error",
                        "msg" => $e->getMessage()
                    ];
                }
                break;
        }

        try{
            if(isset($sql)){
                $this->dbs->execSql($sql);
            } else {
                
                $count = $this->dbs->getCount($table, "id");
                if ($count > 0) {
                    $this->dbs->update($table, $save, "id=1");
                } else {
                    $this->dbs->insert($table, $save);
                }
            }
            return [
                "status" => "success",
                "code" => "add"
            ];
        }catch (\Exception $e){
            return [
                "status" => "error",
                "msg" => $e->getMessage()
            ];
        }
    }
}