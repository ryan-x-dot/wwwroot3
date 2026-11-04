<?php

/**
 * Class Announcement 公告类
 */
class Announcement extends Base
{
    protected $mes_table = "";

    public function __construct($_p = [])
    {
        parent::__construct($_p);
        $this->mes_table = Constant::T_MESSAGE;
    }

    public function orderBy(){
        $order = "";
        if(isset($this->param["sortName"])){
            $name = "logintime";
            switch ($this->param["sortName"]){
                case "adddate":
                    $name = "logintime";
                    break;
            }
            $type = "ASC";
            if($this->param["sortType"] == "down"){
                $type = " DESC";
            }
            $order = " ORDER BY {$name} {$type}";
        }
        return $order;
    }

    public function scoll_date(){
        $sd = (!isset($this->param["scoll_date"]) || empty($this->param["scoll_date"]) ? "all" : $this->param["scoll_date"]);
        $where = "";
        switch ($sd){
            case "before"://昨日之前
                $where .= " AND `ntime`<".strtotime(date("Y-m-d 00:00:00",strtotime("-1 day")));
                break;
            case "yesterday"://昨日
                $start = strtotime(date("Y-m-d 00:00:00",strtotime("-1 day")));
                $end = strtotime(date("Y-m-d 23:59:59",strtotime("-1 day")));
                $where .= " AND `ntime` BETWEEN '{$start}' AND '{$end}'";
                break;
            case "today"://今日
                $start = strtotime(date("Y-m-d 00:00:00"));
                $end = strtotime(date("Y-m-d 23:59:59"));
                $where .= " AND `ntime` BETWEEN '{$start}' AND '{$end}'";
                break;
        }

        return $where;
    }

    /**
     * 统计 重要公告|一般公告
     * @return array
     */
    public function no_action(){
        $count = [0,0];//统计 0=>重要公告，1=>一般公告
        $where = "";

        switch ($this->login_layer){
            case Constant::AD:
                if(strlen($this->sup["nid"]) == 16) { //超管
                    $where = " AND (`nid` LIKE '{$this->sup["nid"]}%' OR `nid` IS NULL) AND `supid`=0";
                }else{
                    $where = " AND (`nid`='{$this->sup["nid"]}' OR `nid` IS NULL)";
                }
                break;
            default:
                $nid = substr($this->sup["nid"],0,32);
                $time = time();
                $where .= " AND `fb`=1 AND (`nid`='{$nid}' OR `nid` IS NULL)  AND (`dqtime`>'{$time}' OR `dqtime`=0)";
                break;
        }
        $important = $this->dbc->select("SELECT MAX(`id`) as `id` FROM {$this->mes_table} WHERE `type`=3 {$where}","Row");
        if(!$important || empty($important['id'])){$count[0]=0;}else{$count[0] = $important['id'];}
        $general = $this->dbc->select("SELECT MAX(`id`) as `id` FROM {$this->mes_table} WHERE `type`=1 {$where}","Row");
        if(!$general || empty($general['id'])){$count[1]=0;}else{$count[1] = $general['id'];}
        return ["count"=>implode("|",$count)];
    }

    public function chat_init()
    {
        $p = $this->param;
        if (!isset($p["sort"]) || empty($p["sort"])) {
            $p["sort"] = "desc";
        }

        $order = "ORDER BY `time` {$p["sort"]}";
        $where = " WHERE `from_id`={$this->sup["id"]} or `nid` LIKE '{$this->sup["nid"]}%'";
        if(isset($p["search"])){
            $where .= " AND `message` LIKE '%{$p["search"]}%'";
        }

        if(strlen($this->sup["nid"]) > 16){
            $where .= " AND `isdelete` = 0";
        }

        $chat_table = Constant::T_CHAT;
        $ann = $this->dbc->select("SELECT * FROM {$chat_table} {$where} {$order}");
        $arr = [
            "msg"=>"success",
            "code"=>"none",
            "count"=>$this->no_action()["count"]
        ];
        if(!$ann){return $arr;}

        $codeArr = [];
        $css = "";
        switch ($this->langx){
            case "zh-tw":
                $css = "_tw";
                break;
            case "en-us":
                $css = "_en";
                break;
        }
        foreach ($ann as $v){
            $code =[$v["id"],date("Y-m-d H:i:s",$v["time"]),$v["message{$css}"],$v["from_name"],$v["to_name"],$v["from_id"],$v["to_id"],$v["state"]];
            $codeArr[] = implode("|",$code);
        }
        $arr["code"] = implode("@@",$codeArr);
        return $arr;
    }

    public function forget_init()
    {
        $p = $this->param;
        if (!isset($p["sort"]) || empty($p["sort"])) {
            $p["sort"] = "desc";
        }
        $order = "ORDER BY `adddate` {$p["sort"]}";
        $where = " WHERE `id`>0";
        if(isset($p["search"])){
            $where .= " AND `content` LIKE '%{$p["search"]}%'";
        }

        if(strlen($this->sup["nid"]) > 16){
            $where .= " `nid` LIKE '{$this->sup["nid"]}%' AND `isdelete` = 0";
        }

        $chat_table = Constant::T_FORGET;
        $ann = $this->dbc->select("SELECT * FROM {$chat_table} {$where} {$order}");
        $arr = [
            "msg"=>"success",
            "code"=>"none",
            "count"=>$this->no_action()["count"]
        ];
        if(!$ann){return $arr;}

        $codeArr = [];
        foreach ($ann as $v){
            $code =[$v["id"],date("Y-m-d H:i:s",$v["adddate"]),$v["content"],$v["name"]];
            $codeArr[] = implode("|",$code);
        }
        $arr["code"] = implode("@@",$codeArr);
        return $arr;
    }

    /**
     * 公告查询数据
     * @return string[]
     */
    public function init(){
        global $announcements_arr;
        $p = $this->param;
        if(!isset($p["sort"]) || empty($p["sort"])){$p["sort"] = "desc";}
        $sort = isset($p["sort"]) && strtoupper($p["sort"]) == "ASC" ? "ASC" : "DESC";
        if(!isset($p["scoll_type"]) || empty($p["scoll_type"])){$p["scoll_type"] = "important";}
        $scoll_type = $p["scoll_type"];
        $order = "ORDER BY `ntime` {$sort}";

        if($p["scoll_type"] == "home_important"){//弹窗
            $scoll_type = "important";
            $time = time();
            $nid = substr($this->sup["nid"],0,32);
            if($this->login_layer == Constant::MEM){
                //重要公告（弹窗）或者 私人消息
                $where = "WHERE `fb`=1 AND (`dqtime`>'{$time}' OR `dqtime`=0) AND (`member`='{$this->sup["name"]}' OR (`type`=3 AND `isAlert`=1 AND (`nid`='{$nid}' OR LENGTH(`nid`)=16)))";
            }else{
                switch ($this->login_layer){
                    case Constant::ADS:
                    case Constant::AD:
                        $where = "WHERE `fb`=1 AND (`dqtime`>'{$time}' OR `dqtime`=0) AND LENGTH(`nid`)=16  AND `isAlert`=1 AND `type`=2";
                        break;
                    default:
                        $time = time();
                        $where = "WHERE `fb`=1 AND (`dqtime`>'{$time}' OR `dqtime`=0) AND `isAlert`=1 AND (`nid`='{$nid}' OR LENGTH(`nid`)=16) AND `type`=2";
                        break;
                }
            }

        }else{
            $type = announcement_num_str(1,$p["scoll_type"]);
            $where = "WHERE `type`={$type}".$this->scoll_date();

            if(isset($p["search"])){
                $where .= " AND `message` LIKE '%{$p["search"]}%'";
            }

            switch ($this->login_layer){
                case Constant::ADS:
                    $where .= " AND (`nid` LIKE '{$this->sup["nid"]}%' OR `nid` IS NULL)";
                    break;
                case Constant::AD:
                    $where .= " AND (`nid`='{$this->sup["nid"]}' OR `nid` IS NULL)";
                    break;
                default:
                    $nid = substr($this->sup["nid"],0,32);
                    $time = time();
                    $where .= " AND `fb`=1 AND (`nid` LIKE '{$this->sup["nid"]}%'  OR LENGTH(`nid`)=16 OR `nid` IS NULL)  AND (`dqtime`>'{$time}' OR `dqtime`=0)";
                    break;
            }
        }
        if(strlen($this->sup["nid"])>16){//非超管
            $where .= " AND `isdelete` = 0";
        }
        //print_r("SELECT * FROM {$this->mes_table} {$where} {$order}");exit;
        $ann = $this->dbc->select("SELECT * FROM {$this->mes_table} {$where} {$order}");
        $arr = [
            "msg"=>"success",
            "code"=>"none",
            "count"=>$this->no_action()["count"]
        ];
        if(!$ann){return $arr;}

        $codeArr = [];
        $css = "";
        switch ($this->langx){
            case "zh-tw":
                $css = "_tw";
                break;
            case "en-us":
                $css = "_en";
                break;
        }
        foreach ($ann as $v){
            $code =[$v["id"],date("Y-m-d H:i:s",$v["ntime"]),$v["message{$css}"],$v["name"]];
            if($p["scoll_type"] == "proNews"){
                $code[] = $v["readcount"];
                $code[] = $v["tel"];
            }
            $codeArr[] = implode("|",$code);
        }
        $arr["code"] = implode("@@",$codeArr);
        if($p["scoll_type"] != "home_important") {
            $msg = "公告->查询[{$announcements_arr[$scoll_type]}]";
            $this->insertLog($msg);
        }
        return $arr;
    }

    /**
     * 公告入口
     * @return array|string[]
     */
    public function get_announcement(){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        $p = $this->param;
        if(!isset($p["action"])){
            $para = $this->no_action();//公告统计
        }else{
            switch ($p["action"]){
                case "level":
                    $ebl = $this->edit_bet_layer();
                    $para = ["list"=>[]];
                    if(isset($ebl["td_online"]["mes"])){
                        $para["list"]["news"] = [
                            "value" => "proNews",
                            "text"=>"私人消息"
                        ];
                        if($this->login_layer == Constant::ADS || $this->login_layer == Constant::AD || $this->login_layer == Constant::D0 ){
                            $para["list"]["chat"] = [
                                "value" => "proChat",
                                "text"=>"私人会话"
                            ];
                        }
                    }
                    break;
                case "init"://
                    if($p["scoll_type"] == "proChat"){
                        $para = $this->chat_init();//私人会话查询
                    }else if($p["scoll_type"] == "forgetPwd"){
                        $para = $this->forget_init();//密码申诉
                    }else{
                        $para = $this->init();//公告查询
                    }

                    break;
                case "add":
                    if($p["scoll_type"] == "proChat"){
                        $para = $this->chat_add();//添加会话
                    }else{
                        $para = $this->add();//添加
                    }

                    break;
                case "edit_data":
                    if(!isset($p["id"]) || empty($p["id"]) || !is_numeric($p["id"])){
                        $para = ["status" => "error","msg" => $ls["0X003"]];
                    }else {
                        $para = $this->edit_data($p["id"]);
                    }
                    break;
                case "edit":
                    if(!isset($p["id"]) || empty($p["id"]) || !is_numeric($p["id"])){
                        $para = ["status" => "error","msg" => $ls["0X003"]];
                    }else {
                        $para = $this->edit($p["id"]);//修改
                    }
                    break;
                case "delete"://单条删除
                    if(!isset($p["id"]) || empty($p["id"]) || !is_numeric($p["id"])){
                        $para = ["status" => "error","msg" => $ls["0X003"]];
                    }else{
                        if($p["scoll_type"] == "proChat") {
                            $para = $this->chat_delete($p["id"]);//删除
                        }else if($p["scoll_type"] == "forgetPwd") {
                            $para = $this->forget_delete($p["id"]);//删除
                        }else{
                            $para = $this->delete($p["id"]);//删除
                        }
                    }
                    break;
                case "delete_batch"://批量删除
                    if($p["scoll_type"] == "proChat") {
                        $para = $this->chat_delete_batch();//批量删除
                    }elseif($p["scoll_type"] == "forgetPwd") {
                        $para = $this->forget_delete_batch();//批量删除
                    }else{
                        $para = $this->delete_batch();//批量删除
                    }

                    break;
                case "delete7"://删除7天之前的公告
                    $para = $this->delete7();//批量删除
                    break;
            }
        }
        return $para;
    }

    public function edit(){
        global $ls_msg,$announcements_arr;
        $p = $this->param;
        $ls = $ls_msg[$this->langx];
        if(!isset($p["id"]) || empty($p["id"]) || !is_numeric($p["id"])){
            return ["status" => "error","msg" => $ls["0X003"]];
        }
        $rs = $this->dbc->select("SELECT * FROM {$this->mes_table} WHERE `id`={$p["id"]}","Row");
        if(!$rs){return ["status" => "error","code" => $ls["4X008"]];}
        $insert = [];
        $insert["nid"] = $this->sup["nid"];
        $insert["name"] = $this->sup["name"];
        $insert["type"] = announcement_num_str(1,$p["scoll_type"]);
        switch ($p["scoll_type"]){
            case "important":
            case "personal":
            case "general":
                $insert["message"] = $p["txt_cn"];
                $insert["message_tw"] = $p["txt_tw"];
                $insert["message_en"] = $p["txt_en"];
                $insert["isAlert"] = $p["alert"];
                $insert["fb"] = $p["fb"];
                //$insert["sha1"] = sha1($insert["message"].$insert["type"]);
                if($this->param["no_date"] === "true"  || !isset($this->param["end_date"])){
                    $insert["dqtime"] = 0;
                }else{
                    $insert["dqtime"] = strtotime($this->param["end_date"]);
                }
                break;
            case "proNews":
                $insert["message"] = $p["txt"];
                $insert["member"] = $p["user"];
                $insert["fb"] = $p["fb"];
                $insert["tel"] = $p["tel"];
                $insert["sha1"] = $p["txt"].$p["user"]."4";
                if($this->param["no_date"] === "true"  || !isset($this->param["end_date"])){
                    $insert["dqtime"] = 0;
                }else{
                    $insert["dqtime"] = strtotime($this->param["end_date"]);
                }
                break;
        }

        $this->dbc->beginTransaction();
        try{
            /*if($p["scoll_type"] == "important" || $p["scoll_type"] == "personal" || $p["scoll_type"] == "general"){
                if(strlen($this->sup["nid"])==16){ //超管发布重要公告 添加所有下级公司
                    $this->dbc->update($this->mes_table,$insert,"`supid`={$p["id"]}");
                }else{
                    $insert["supid"] = 0;//公司修改之后就表示不是超管的公告
                }
            }*/
            $this->dbc->update($this->mes_table,$insert,"`id`={$p["id"]}");
            $logMsg = "公告->";
            if($p["scoll_type"] == "personal"){
                $logMsg.="修改[股东/代理公告]成功!";
            }else{
                $logMsg.="修改[{$announcements_arr[$p["scoll_type"]]}]成功!";
            }
            $this->insertLog($logMsg);
            $this->dbc->commit();
            return [
                "status" => "success",
                "code" => "edit"
            ];
        }catch (\Exception $e){
            $this->dbc->rollback();
            return [
                "status" => "error",
                "msg" =>$e->getMessage()
            ];
        }

    }

    public function edit_data($id){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        $rs = $this->dbc->select("SELECT * FROM {$this->mes_table} WHERE `id`={$id}","Row");
        if(!$rs){return ["status" => "error","code" => $ls["4X008"]];}
        switch ($rs["type"]){
            case 1://一般公告
            case 2://股东/代理公告
            case 3://重要公告
                $arr = [
                    "content_cn" => $rs["message"],
                    "content_tw" => $rs["message_tw"],
                    "content_en" => $rs["message_en"],
                    "end_date" => empty($rs["dqtime"]) ? 0 : date("Y-m-d",$rs["dqtime"]),
                    "fb" => $rs["fb"],
                    "isAlert" => $rs["isAlert"]
                ];
                break;
            case 4://私人消息
                $arr = [
                    "content" => $rs["message"],
                    "user" => $rs["member"],
                    "end_date" => empty($rs["dqtime"]) ? 0 : date("Y-m-d",$rs["dqtime"]),
                    "fb" => $rs["fb"],
                    "tel" => $rs["tel"]
                ];
                              
                    break;
           
        }

        return ["status"=>"success","data"=>$arr];

    }

    public function delete_batch(){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        $p = $this->param;
        if(!isset($p["ids"]) || empty($p["ids"])){
            return ["status" => "error","msg" => $ls["0X003"]];
        }
        $ids = implode(",",json_decode($p["ids"]));
        try{
            $this->dbc->delete($this->mes_table,"`id` IN ({$ids}) AND `nid` LIKE '{$this->sup["nid"]}%'");
            $this->insertLog("批量删除公告");
            return ["status"=>"success"];
        }catch (\Exception $e){
            return ["status" => "error","msg" => $e->getMessage()];
        }
        return ["status"=>"success"];
    }

    public function chat_delete_batch(){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        $p = $this->param;
        if(!isset($p["ids"]) || empty($p["ids"])){
            return ["status" => "error","msg" => $ls["0X003"]];
        }
        $ids = implode(",",json_decode($p["ids"]));
        try{
            $chat_table = Constant::T_CHAT;
            if(strlen($this->sup["nid"]) > 16){ //非超管删除
                $this->dbc->update($chat_table,["isdelete"=>1],"`id` IN ({$ids}) AND `nid` LIKE '{$this->sup["nid"]}%'");
            } else {
                $this->dbc->delete($chat_table,"`id` IN ({$ids}) AND `nid` LIKE '{$this->sup["nid"]}%'");
            }

            $this->insertLog("批量删除私人会话");
            return ["status"=>"success"];
        }catch (\Exception $e){
            return ["status" => "error","msg" => $e->getMessage()];
        }
        return ["status"=>"success"];
    }

    public function forget_delete_batch(){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        $p = $this->param;
        if(!isset($p["ids"]) || empty($p["ids"])){
            return ["status" => "error","msg" => $ls["0X003"]];
        }
        $ids = implode(",",json_decode($p["ids"]));
        try{
            $chat_table = Constant::T_FORGET;
            if(strlen($this->sup["nid"]) > 16){ //非超管删除
                $this->dbc->update($chat_table,["isdelete"=>1],"`id` IN ({$ids}) AND `nid` LIKE '{$this->sup["nid"]}%'");
            } else {
                $this->dbc->delete($chat_table,"`id` IN ({$ids})");
            }

            $this->insertLog("批量删除密码申诉");
            return ["status"=>"success"];
        }catch (\Exception $e){
            return ["status" => "error","msg" => $e->getMessage()];
        }
        return ["status"=>"success"];
    }

    public function chat_delete($id){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        $chat_table = Constant::T_CHAT;
        $rs = $this->dbc->select("SELECT * FROM {$chat_table} WHERE `id`={$id}","Row");
        if(!$rs){return ["status" => "error","code" => $ls["4X008"]];}
        try{
            if(strlen($this->sup["nid"]) > 16){ //非超管删除
               // $this->dbc->update($chat_table,["isdelete"=>1],"`id`={$id} AND `nid` LIKE '{$this->sup["nid"]}%'");
				
				 $this->dbc->delete($chat_table,"`id`={$id} AND `nid` LIKE '{$this->sup["nid"]}%'");
            } else {
                $this->dbc->delete($chat_table,"`id`={$id} AND `nid` LIKE '{$this->sup["nid"]}%'");
            }

            $this->insertLog("删除私人会话[ID:{$id}]");
            return ["status"=>"success"];
        }catch (\Exception $e){
            return ["status" => "error","msg" => $e->getMessage()];
        }
        return ["status"=>"success"];
    }

    public function forget_delete($id){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        $chat_table = Constant::T_FORGET;
        $rs = $this->dbc->select("SELECT * FROM {$chat_table} WHERE `id`={$id}","Row");
        if(!$rs){return ["status" => "error","code" => $ls["4X008"]];}
        try{
            if(strlen($this->sup["nid"]) > 16){ //非超管删除
                $this->dbc->update($chat_table,["isdelete"=>1],"`id`={$id} AND `nid` LIKE '{$this->sup["nid"]}%'");
            } else {
                $this->dbc->delete($chat_table,"`id`={$id}");
            }

            $this->insertLog("删除密码申诉[ID:{$id}]");
            return ["status"=>"success"];
        }catch (\Exception $e){
            return ["status" => "error","msg" => $e->getMessage()];
        }
        return ["status"=>"success"];
    }

    public function delete($id){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        $rs = $this->dbc->select("SELECT * FROM {$this->mes_table} WHERE `id`={$id}","Row");
        if(!$rs){return ["status" => "error","code" => $ls["4X008"]];}
        try{
            if(strlen($this->sup["nid"]) > 16 && $this->param["scoll_type"] == "proNews") { //非超管删除私人消息
                $this->dbc->update($this->mes_table,["isdelete"=>1],"`id`={$id}");
            }else{
                switch ($this->login_layer){
                    case Constant::ADS:
                        $this->dbc->delete($this->mes_table,"`id`={$id} OR `supid`={$id}");
                        break;
                    case Constant::AD:
                        $this->dbc->delete($this->mes_table,"`id`={$id} AND `nid` = '{$this->sup["nid"]}')");
                        break;
                    default:
                        return ["status" => "error","msg" => "权限不足!"];
                        break;
                }

            }
            $this->insertLog("删除公告[ID:{$id}]");
            return ["status"=>"success"];
        }catch (\Exception $e){
            return ["status" => "error","msg" => $e->getMessage()];
        }
        return ["status"=>"success"];
    }

    public function delete7(){
        $p = $this->param;
        try{
            $day7 = strtotime("-7 day");
            $where = "`ntime`<{$day7} AND `nid` LIKE '{$this->sup["nid"]}%'";
            if($p["scoll_type"] == "important" && strlen($this->sup["nid"])==16) { //超管发布重要公告 添加所有下级公司
                $where .= " AND `nid` LIKE '{$this->sup["nid"]}%'";
            }else{
                $where .= " AND `nid` = '{$this->sup["nid"]}'";
            }
            $this->dbc->delete($this->mes_table,$where);
            $this->insertLog("批量删除7天之前的公告");
            return ["status"=>"success"];
        }catch (\Exception $e){
            return ["status" => "error","msg" => $e->getMessage()];
        }
        return ["status"=>"success"];
    }

    public function chat_add(){
        global $ls_msg,$announcements_arr;
        $ls = $ls_msg[$this->langx];
        $p = $this->param;
        $validate = $this->validate();
        if($validate["status"]=="error"){
            return $validate;
        }
        $table_member = Constant::T_MEMBER;
        $user = $this->dbc->select("SELECT * FROM {$table_member} WHERE `name`='{$p["user"]}' AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
        if(!$user){
            return [
                "status" => "error",
                "code" => "ctl|user",
                "msg" => $ls["5X001"]
            ];
        }

        $insert = [];
        $insert["nid"] = $this->sup["nid"];
        $insert["from_id"] = $this->sup["id"];
        $insert["from_name"] = $this->sup["name"];
        $insert["to_id"] = $user["id"];
        $insert["to_name"] = $user["name"];
        $insert["message"] = $p["txt"];
        $insert["time"] = time();

        $this->dbc->beginTransaction();
        try{
            $table_chat = Constant::T_CHAT;
            $this->dbc->insert($table_chat,$insert);
            $logMsg = "公告->";
            $logMsg.="私人会话->向[账号:{$user["name"]}]发送会话!";

            $this->insertLog($logMsg);
            $this->dbc->commit();
            return [
                "status" => "success",
                "code" => "add"
            ];
        }catch (\Exception $e){
            $this->dbc->rollback();
            return [
                "status" => "error",
                "msg" =>$e->getMessage()
            ];
        }
    }

    /**
     * 新增公告
     * @return array|string[]
     */
    public function add(){
        global $ls_msg,$announcements_arr;
        $ls = $ls_msg[$this->langx];
        $p = $this->param;
        $validate = $this->validate();
        if($validate["status"]=="error"){
            return $validate;
        }
        $ebl = $this->edit_bet_layer();
        if($this->login_layer != Constant::ADS && $this->login_layer != Constant::AD){
           /* return [
                "status" => "error",
                "msg" => $ls["0X001"],
            ];*/
        }
        $insert = [];
        $insert["nid"] = $this->sup["nid"];
        $insert["name"] = $this->sup["name"];
        $insert["type"] = announcement_num_str(1,$p["scoll_type"]);
        switch ($p["scoll_type"]){
            case "important":
            case "personal":
            case "general":
                $insert["message"] = $p["txt_cn"];
                $insert["message_tw"] = $p["txt_tw"];
                $insert["message_en"] = $p["txt_en"];
                $insert["isAlert"] = $p["alert"];
                $insert["fb"] = $p["fb"];
                $insert["sha1"] = sha1($insert["message"].$insert["type"].$insert["nid"].$insert["name"]);
                if($this->param["no_date"] === "true"  || !isset($this->param["end_date"])){
                    $insert["dqtime"] = 0;
                }else{
                    $insert["dqtime"] = strtotime($this->param["end_date"]);
                }
                break;
            case "proNews":
                if(!isset($ebl["td_online"]["mes"])){
                    return [
                        "status" => "error",
                        "msg" => $ls["0X001"],
                    ];
                }
                $table_member = Constant::T_MEMBER;
                $user = $this->dbc->select("SELECT * FROM {$table_member} WHERE `name`='{$p["user"]}' AND `nid` LIKE '{$this->sup["nid"]}%'","Row");
                if(!$user){
                    return [
                        "status" => "error",
                        "code" => "ctl|user",
                        "msg" => $ls["5X001"]
                    ];
                }
                
                $insert["message"] = $p["txt"];
                $insert["member"] = $p["user"];
                $insert["tel"] = $p["tel"];
                $insert["fb"] = $p["fb"];
                $insert["sha1"] = sha1($p["txt"].$p["user"]."4");
                if($this->param["no_date"] === "true"  || !isset($this->param["end_date"])){
                    $insert["dqtime"] = 0;
                }else{
                    $insert["dqtime"] = strtotime($this->param["end_date"]);
                }
                break;

        }

        $insert["ntime"] = time();

        $this->dbc->beginTransaction();
        try{
            $this->dbc->insert($this->mes_table,$insert,true);
            /*$insertID = $this->dbc->insert($this->mes_table,$insert,true);
            $aar = ["important","general","personal"];
            if(in_array($p["scoll_type"],$aar) && strlen($this->sup["nid"])==16){ //超管发布重要公告 添加所有下级公司
                $ad_table = Constant::T_ADMIN;
                $ad = $this->dbc->select("SELECT `nid`,`name` FROM {$ad_table} WHERE `nid` LIKE '{$this->sup["nid"]}%' AND `level`=1 AND `isMaster`=0");
                if($ad){
                    foreach ($ad as $v){
                        $insert["nid"] = $v["nid"];
                        $insert["supid"] = $insertID;
                        $insert["name"] = $v["name"];
                        $insert["sha1"] = sha1($insert["message"].$insert["type"].$insert["name"]);
                        $this->dbc->insert($this->mes_table,$insert);
                    }
                }
            }*/
            $logMsg = "公告->";
            if($p["scoll_type"] == "personal"){
                $logMsg.="新增[股东/代理]成功!";
            }else{
                $logMsg.="新增[{$announcements_arr[$p["scoll_type"]]}]成功!";
            }

            $this->insertLog($logMsg);
            $this->dbc->commit();
            return [
                "status" => "success",
                "code" => "add"
            ];
        }catch (\Exception $e){
            $this->dbc->rollback();
            return [
                "status" => "error",
                "msg" =>$e->getMessage()
            ];
        }
    }

    public function validate(){
        global $ls_msg;
        $ls = $ls_msg[$this->langx];
        $p = $this->param;
        $ctl = "ctl|";
        if($p["scoll_type"] == "important" || $p["scoll_type"] == "personal" || $p["scoll_type"] == "general"){
            if (!isset($p["txt_cn"]) || empty($p["txt_cn"])) {
                $para = [
                    "status" => "error",
                    "code" => $ctl . "content_cn",
                    "msg" => $ls["0X013"]
                ];
                return $para;
            }

            if (!isset($p["txt_tw"]) || empty($p["txt_tw"])) {
                $para = [
                    "status" => "error",
                    "code" => $ctl . "content_tw",
                    "msg" => $ls["0X013"]
                ];
                return $para;
            }

            if (!isset($p["txt_en"]) || empty($p["txt_en"])) {
                $para = [
                    "status" => "error",
                    "code" => $ctl . "content_en",
                    "msg" => $ls["0X013"]
                ];
                return $para;
            }

        }else {
            if (!isset($p["txt"]) || empty($p["txt"])) {
                $para = [
                    "status" => "error",
                    "code" => $ctl . "content",
                    "msg" => $ls["0X013"]
                ];
                return $para;
            }
        }

        if($p["scoll_type"] == "proNews" || $p["scoll_type"] == "proChat"){
            if (!isset($p["user"]) || empty($p["user"])) {
                $para = [
                    "status" => "error",
                    "code" => $ctl . "user",
                    "msg" => $ls["0X013"]
                ];
                return $para;
            }
        }

        if($p["scoll_type"] != "proChat") {
            if (!empty($p["end_date"]) && !regexDate($p["end_date"])) {
                $para = [
                    "status" => "error",
                    "code" => $ctl . "enddate",
                    "msg" => $ls["0X016"]
                ];
                return $para;
            }
        }

        return ["status"=>"success"];
    }

}