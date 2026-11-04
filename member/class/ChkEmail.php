<?php


class ChkEmail
{
    protected $param;

    protected $db;

    protected $table;

    protected $ls;

    protected $ls_account;

    public function __construct($_p)
    {
        global $db_c,$ls_ary,$ls_account_ary;
        $this->db = $db_c;
        $this->table = Constant::T_FORGET;
        $this->param = $_p;
        $this->ls = $ls_ary;
        $this->ls_account = $ls_account_ary;
    }

    /**
     * 忘记密码 验证参数
     * @return array|string[]
     */
    public function vaildateEmail(){
        if(empty($this->param["username"])){
            return ["status"=>"error","msg"=>$this->ls["pls_enter_usertag"]];
        }

        if(!preg_match("/^[a-zA-Z0-9._%+-]+@(?!.*\.\..*)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/is",$this->param["email"])){
            return ["status"=>"error","msg"=>$this->ls["pls_enter_email"]];
        }

        return ["status"=>"ok","msg"=>""];
    }

    /**
     * 忘记密码 入库
     * @return array|string[]
     */
    public function setData(){
        $name = $this->param["username"];
        $email = $this->param["email"];
        $table = Constant::T_MEMBER;
        try{
            $usr = $this->db->select("SELECT `id`,`nid`,`setip` FROM {$table} WHERE `name`='{$name}' OR `loginname`='{$name}'","Row");
            if(!$usr){
                return ["status"=>"error","msg"=>$this->ls_account["forgot_pwd_Invaild"]];
            }
            $insert = [
                "name" => $name,
                "content" => $email,
                "nid" => $usr["nid"],
                "adddate" => time()
            ];
            $this->db->insert($this->table,$insert);
            return ["status"=>"ok"];
        }catch (\Exception $e){
            return ["status"=>"error","msg"=>$e->getMessage()];
        }

    }
}