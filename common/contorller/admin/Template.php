<?php

/**
 * Class Template 会员模板类
 */
class Template extends Base
{
    public function __construct($_p = [])
    {
        parent::__construct($_p);
    }

    public function del(){
        $table = Constant::T_TEMPLATE;

        try{
            $tid = $this->param["template_del_id"];
            $this->dbc->delete($table, "id = $tid");

            $keys = $this->param["keys"];

            return [
                "status" => "success",
                "code" => $keys
            ];
        }catch (\Exception $e){
            return [
                "status" => "error",
                "msg" => $e->getMessage()
            ];
        }
    }


    public function get(){
        $tid = $this->param["template_id"];
        $table = Constant::T_TEMPLATE;
        $data = $this->dbc->select("SELECT * FROM {$table} WHERE `id`='{$tid}' LIMIT 1","Row");
        LOG::write("tid:", $data);
        $data["user_id"] = $data["up_id"];
        $data["game"] = [
            "template_data_" . $data["id"] => json_decode($data["game"])
        ];
        return $data;
    }

    public function list(){
        $uid = $this->user["id"];
        $table = Constant::T_TEMPLATE;
        $arr = $this->dbc->select("SELECT * FROM {$table} WHERE `up_id`='{$uid}' order by id desc LIMIT 5","All");
        foreach($arr as &$it) {
            $it["user_id"] = $uid;
            $it["game"] = [
                "templatee_data_" . $it["id"] => json_decode($it["game"])
            ];
        }
        return $arr;
    }

    public function add(){
        if (!empty($this->param["template_del_id"])) {
            return $this->del();
        }

        $table = Constant::T_TEMPLATE;

        try{
            $ltype = $this->param["type"];
            $gtype = ["BK", "FS", "FT", "OP"];

            $model= ["R", "RE", "M", "DT", "RDT"];
            $option = ["war", "sc", "so"];

            $gameArr = [
                "BK" => [
                    "data" => []
                ],
                "FS" => [
                    "data" => [
                        
                    ]
                ],
                "FT" => [
                    "data" => []
                ],
                "OP" => [
                    "data" => []
                ]
            ];

            foreach ($gtype as $g) {
                foreach($model as $m) {
                    if ($g == "FS") {
                        $m = "FS";
                    }
                    $mt = $m . "_" . $ltype;
                    foreach($option as $o) {
                        $k = $g;
                        $k .= "_";
                        $k .= $mt;
                        $k .= "_";
                        $k .= strtoupper($o);
                        
                        if (array_key_exists($k, $this->param)) {
                            if (!array_key_exists($mt, $gameArr[$g]["data"])) {
                                $gameArr[$g]["data"][$mt] = [];
                            }
                            $gameArr[$g]["data"][$mt][$o] = $this->param[$k];
                        } 
                        else {
                            if (!($g != "FT" && $m == "RDT")) {
                                if (!array_key_exists($mt, $gameArr[$g]["data"])) {
                                    $gameArr[$g]["data"][$mt] = [];
                                }
                                $gameArr[$g]["data"][$mt][$o] = 0;
                            }
                        }
                    }
                }
            }

            $game = json_encode($gameArr);
            
            $arrayDataValue = [
                "templatename" => $this->param["templatename"],
                "type" => $this->param["type"],
                "default_curr_sw" => $this->param["default_curr_sw"],
                "currency" => $this->param["currency"],
                "maxcredit" => $this->param["maxcredit"],
                "default_comm_sw" => $this->param["default_comm_sw"],
                "up_id" => $this->param["up_id"],
                "up_pay_type" => $this->param["up_pay_type"],
                "game" => $game,
            ];
            
            $tid = $this->param["template_edit_id"];
            if (!empty($tid)) {
                $this->dbc->update($table, $arrayDataValue, "id = $tid");
            }
            else {
                $this->dbc->insert($table, $arrayDataValue);
            }
            

            $keys = $this->param["keys"];

            return [
                "status" => "success",
                "code" => $keys
            ];
        }catch (\Exception $e){
            return [
                "status" => "error",
                "msg" => $e->getMessage()
            ];
        }
        
    }
}