<?php

class DB
{
    protected static  $_instance = null;

    private $pdo;//连接标识

    private $database;

    private $user;

    private $password;


    private $ds = "\n";

    private $host;

    private $conn;


    /**
     * 新建数据库连接对象
     * @param $host 服务器地址
     * @param $user 用户名
     * @param $password 密码
     * @param $charset 编码
     * @param $database 数据库名
     */
    public function __construct($host, $user, $password, $charset, $database)
    {
        $driver_options = [
            PDO::ATTR_PERSISTENT => false,
            PDO::MYSQL_ATTR_INIT_COMMAND => "set names utf8",
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ];

        try{
            $str = "mysql:host={$host};dbname={$database};charset={$charset}";
            $this->pdo = new PDO($str, $user, $password, $driver_options);
            $this->database = $database;
            $this->host = $host;
            $this->user = $user;
            $this->password = $password;
            $this->conn = mysqli_connect($this->host,$this->user,$this->password,$this->database);
        }catch (PDOException $e){
            $this->outputError($e->getMessage());
        }
    }

    /**
     * __clone 是对象进行浅复制（只被复制引用）
     * 在方法中再次进行clone 就是深复制（其中一个修改另外一个也会被修改）
     */
    private  function  __clone()
    {

    }

    /**
     * 单例类
     * Singleton instance
     * @return Object
     */
    public static function getInstance($host, $user, $password, $charset, $database)
    {
        if(self::$_instance === null)
        {
            self::$_instance = new self($host, $user, $password, $charset, $database);
        }
        return self::$_instance;
    }

    /**
     * select 查询
     * @param String $sql SQL语句
     * @param String $queryMode 查询方式(All or Row)
     * @param Boolean $debug
     * @return Array
     */
    public function select($sql, $queryMode = 'All', $debug = false)
    {
        if ($debug === true) $this->debug($sql);
        /*$sqls = explode(";",$sql);
        $result = null;
        if(count($sqls)>1){
            unset($sqls[0]);
            unset($sqls[count($sqls)-1]);
            foreach ($sqls as $sql){
                $this->pdo->exec($sql);
            }
        }else{*/
            $recordset = $this->pdo->query($sql);
            $this->getPDOError();
            if ($recordset) {
                $recordset->setFetchMode(PDO::FETCH_ASSOC);
                if ($queryMode == 'All') {
                    $result = $recordset->fetchAll(2);
                } elseif ($queryMode == 'Row') {
                    $result = $recordset->fetch(2);
                }
            } else {
                $result = null;
            }
        //}

        return $result;
    }

    public function selectNew($sql, $params = [], $queryMode = 'All', $debug = false)
    {
        if ($debug === true) $this->debug($sql);

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $this->getPDOError();

        if ($stmt) {
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            if ($queryMode == 'All') {
                $result = $stmt->fetchAll();
            } elseif ($queryMode == 'Row') {
                $result = $stmt->fetch();
            } else {
                $result = null;
            }
        } else {
            $result = null;
        }

        return $result;
    }

    /**
     * Update 更新
     * @param String $table 表名
     * @param Array $arrayDataValue 字段与值
     * @param String $where 条件
     * @param Boolean $debug
     * @return Int
     */
    public function updateOld($table, $arrayDataValue, $where = '', $debug = false)
    {
        $this->checkFields($table, $arrayDataValue);
        if ($where) {
            $sql = '';
            foreach ($arrayDataValue as $key => $value) {
                if(empty($value) && !is_numeric($value)){
                    $sql .= ", `$key`=NULL";
                }else{
                    $sql .= ", `$key`='{$value}'";
                }

            }
            $sql = ltrim($sql,",");
            $sql = "UPDATE {$table} SET {$sql} WHERE {$where}";
            //print_r($sql);exit;
        } else {
            $sql = "REPLACE INTO {$table} (`".implode('`,`', array_keys($arrayDataValue))."`) VALUES ('".implode("','", $arrayDataValue)."')";
        }
        if ($debug === true) $this->debug($sql);
        $result = $this->pdo->exec($sql);
        $this->getPDOError();
        return $result;
    }


    public function update($table, $arrayDataValue, $where = '', $debug = false)
    {
        $this->checkFields($table, $arrayDataValue);

        if ($where) {
            $sql = "UPDATE {$table} SET ";
            $params = [];

            foreach ($arrayDataValue as $key => $value) {
                if (empty($value) && !is_numeric($value)) {
                    $sql .= "`$key` = NULL, ";
                } else {
                    $sql .= "`$key` = :$key, ";
                    $params[":$key"] = $value;
                }
            }

            $sql = rtrim($sql, ", ");
            $sql .= " WHERE {$where}";
        } else {
            $sql = "REPLACE INTO {$table} (`" . implode('`,`', array_keys($arrayDataValue)) . "`) VALUES (:" . implode(",:", array_keys($arrayDataValue)) . ")";
            $params = [];
            foreach ($arrayDataValue as $key => $value) {
                $params[":$key"] = $value;
            }
        }

        if ($debug === true) $this->debug($sql);
        $stmt = $this->pdo->prepare($sql);
        $result = $stmt->execute($params);
        $this->getPDOError();

        return $result;
    }

    /**
     * Insert 插入
     *
     * @param String $table 表名
     * @param Array $arrayDataValue 字段与值
     * @param Bool $isInsertID 是否返回新增id
     * @param Boolean $debug
     * @return Int
     */
    public function insertOld($table, $arrayDataValue, $isInsertID = false,$debug = false)
    {
        $this->checkFields($table, $arrayDataValue);
        $sql = "INSERT INTO {$table} (`".implode('`,`', array_keys($arrayDataValue))."`) VALUES ('".implode("','", $arrayDataValue)."')";
        //print_r($sql);exit;
        if ($debug === true) $this->debug($sql);
        $result = $this->pdo->exec($sql);
        if($isInsertID === true){
            $result = $this->pdo->lastInsertId();
        }
        $this->getPDOError();
        return $result;
    }

    public function insert($table, $arrayDataValue, $isInsertID = false, $debug = false)
    {
        $this->checkFields($table, $arrayDataValue);

        $fields = array_keys($arrayDataValue);
        $placeholders = array_fill(0, count($fields), '?');

        $sql = "INSERT INTO {$table} (`" . implode('`,`', $fields) . "`) VALUES (" . implode(",", $placeholders) . ")";

        if ($debug === true) $this->debug($sql);

        $stmt = $this->pdo->prepare($sql);
        $result = $stmt->execute(array_values($arrayDataValue));

        if ($isInsertID === true) {
            $result = $this->pdo->lastInsertId();
        }

        $this->getPDOError();
        return $result;
    }

    /**
     * Replace 覆盖方式插入
     *
     * @param String $table 表名
     * @param Array $arrayDataValue 字段与值
     * @param Boolean $debug
     * @return Int
     */
    public function replace($table, $arrayDataValue, $debug = false)
    {
        $this->checkFields($table, $arrayDataValue);
        $sql = "REPLACE INTO {$table} (`".implode('`,`', array_keys($arrayDataValue))."`) VALUES ('".implode("','", $arrayDataValue)."')";
        if ($debug === true) $this->debug($sql);
        $result = $this->pdo->exec($sql);
        $this->getPDOError();
        return $result;
    }

    /**
     * 参数化覆盖插入
     * @param String $table 表名
     * @param Array $arrayDataValue 字段与值
     * @param Boolean $debug
     * @return Int
     */
    public function replaceNew($table, $arrayDataValue, $debug = false)
    {
        $this->checkFields($table, $arrayDataValue);
        $fields = array_keys($arrayDataValue);
        $placeholders = array_fill(0, count($fields), '?');
        $sql = "REPLACE INTO {$table} (`" . implode('`,`', $fields) . "`) VALUES (" . implode(",", $placeholders) . ")";
        if ($debug === true) $this->debug($sql);
        $stmt = $this->pdo->prepare($sql);
        $result = $stmt->execute(array_values($arrayDataValue));
        $this->getPDOError();
        return $result;
    }

    /**
     * Delete 删除
     *
     * @param String $table 表名
     * @param String $where 条件
     * @param Boolean $debug
     * @return Int
     */
    public function delete($table, $where = '', $debug = false)
    {
        if (empty($where)) {
            $this->outputError("'WHERE' is Null");
        } else {
            $sql = "DELETE FROM {$table} WHERE {$where}";
            if ($debug === true) $this->debug($sql);
            $result = $this->pdo->exec($sql);
            $this->getPDOError();
            return $result;
        }
    }

    /**
     * 参数化删除
     * @param String $table 表名
     * @param String $where 带占位符的条件
     * @param Array $params 绑定参数
     * @param Boolean $debug
     * @return Int
     */
    public function deleteNew($table, $where, $params = [], $debug = false)
    {
        if (empty($where)) {
            $this->outputError("'WHERE' is Null");
        }
        $sql = "DELETE FROM {$table} WHERE {$where}";
        if ($debug === true) $this->debug($sql);
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $this->getPDOError();
        return $stmt->rowCount();
    }

    /**
     * execSql 执行SQL语句
     *
     * @param String $sql
     * @param Boolean $debug
     * @return Int
     */
    public function execSql($sql, $debug = false)
    {
        if ($debug === true) $this->debug($sql);
        $result = $this->pdo->exec($sql);
        $this->getPDOError();
        return $result;
    }

    /**
     * 参数化执行SQL语句
     * @param String $sql 带占位符的SQL
     * @param Array $params 绑定参数
     * @param Boolean $debug
     * @return Int
     */
    public function execSqlNew($sql, $params = [], $debug = false)
    {
        if ($debug === true) $this->debug($sql);
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $this->getPDOError();
        return $stmt->rowCount();
    }

    /**
     * 获取字段最大值
     *
     * @param string $table 表名
     * @param string $field_name 字段名
     * @param string $where 条件
     */
    public function getMaxValue($table, $field_name, $where = '', $debug = false)
    {
        $sql = "SELECT MAX({$field_name}) AS MAX_VALUE FROM {$table}";
        if (!empty($where)) $sql .= " WHERE {$where}";
        if ($debug === true) $this->debug($sql);
        $arrTemp = $this->select($sql, 'Row');
        $maxValue = $arrTemp["MAX_VALUE"];
        if ($maxValue == "" || $maxValue == null) {
            $maxValue = 0;
        }
        return $maxValue;
    }

    /**
     * 参数化获取最大值
     * @param String $table 表名
     * @param String $field_name 字段名
     * @param String $where 带占位符的条件
     * @param Array $params 绑定参数
     * @param Boolean $debug
     * @return mixed
     */
    public function getMaxValueNew($table, $field_name, $where = '', $params = [], $debug = false)
    {
        $sql = "SELECT MAX({$field_name}) AS MAX_VALUE FROM {$table}";
        if (!empty($where)) $sql .= " WHERE {$where}";
        if ($debug === true) $this->debug($sql);
        $arrTemp = $this->selectNew($sql, $params, 'Row');
        $maxValue = $arrTemp["MAX_VALUE"];
        if ($maxValue == "" || $maxValue == null) {
            $maxValue = 0;
        }
        return $maxValue;
    }

    /**
     * 获取指定列的数量
     * @param string $table 表名
     * @param string $field_name 字段名
     * @param string $where 条件
     * @param bool $debug
     * @return int
     */
    public function getCount($table, $field_name, $where = '', $debug = false)
    {
        $sql = "SELECT COUNT({$field_name}) AS `NUM` FROM {$table}";
        if (!empty($where)) $sql .= " WHERE {$where}";
        /*if($table == Constant::S_VB){
            print_R($sql);exit;
        }*/

        //print_r($sql."\n");
        if ($debug === true) $this->debug($sql);
        $arrTemp = $this->select($sql, 'Row');
        return empty($arrTemp['NUM']) ? 0 : $arrTemp['NUM'];
    }

    /**
     * 参数化获取数量
     * @param String $table 表名
     * @param String $field_name 字段名
     * @param String $where 带占位符的条件
     * @param Array $params 绑定参数
     * @param Boolean $debug
     * @return int
     */
    public function getCountNew($table, $field_name, $where = '', $params = [], $debug = false)
    {
        $sql = "SELECT COUNT({$field_name}) AS `NUM` FROM {$table}";
        if (!empty($where)) $sql .= " WHERE {$where}";
        if ($debug === true) $this->debug($sql);
        $arrTemp = $this->selectNew($sql, $params, 'Row');
        return empty($arrTemp['NUM']) ? 0 : $arrTemp['NUM'];
    }

    /**
     * 获取表引擎
     *
     * @param String $dbName 库名
     * @param String $tableName 表名
     * @param Boolean $debug
     * @return String
     */
    public function getTableEngine($dbName, $tableName)
    {
        $sql = "SHOW TABLE STATUS FROM {$dbName} WHERE Name={$tableName}";
        $arrayTableInfo = $this->select($sql);
        $this->getPDOError();
        return $arrayTableInfo[0]['Engine'];
    }

    /**
     * beginTransaction 事务开始
     */
    public function beginTransaction()
    {
        $this->pdo->beginTransaction();
    }

    /**
     * commit 事务提交
     */
    public function commit()
    {
        $this->pdo->commit();
    }

    /**
     * rollback 事务回滚
     */
    public function rollback()
    {
        $this->pdo->rollback();
    }

    /**
     * transaction 通过事务处理多条SQL语句
     * 调用前需通过getTableEngine判断表引擎是否支持事务
     *
     * @param array $arraySql
     * @return Boolean
     */
    public function execTransaction($arraySql)
    {
        $this->beginTransaction();
        try{
            foreach ($arraySql as $sql) {
                $this->execSql($sql);
            }
            $this->commit();
            return ["status" => "success"];
        }catch (\Exception $e){
            $this->rollback();
            return [
                "status" => "error",
                "msg"    => $e->getMessage()
            ];
        }

    }

    /**
     * 参数化事务执行 - 每个元素为 [$sql, $params] 数组
     * @param Array $sqlParamsArr [[$sql, $params], ...]
     * @return Array
     */
    public function execTransactionNew($sqlParamsArr)
    {
        $this->beginTransaction();
        try{
            foreach ($sqlParamsArr as $item) {
                $sql = $item[0];
                $params = isset($item[1]) ? $item[1] : [];
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute($params);
            }
            $this->commit();
            return ["status" => "success"];
        }catch (\Exception $e){
            $this->rollback();
            return [
                "status" => "error",
                "msg"    => $e->getMessage()
            ];
        }
    }

    /**
     * checkFields 检查指定字段是否在指定数据表中存在
     *
     * @param String $table
     * @param array $arrayField
     */
    private function checkFields($table, $arrayFields)
    {
        $fields = $this->getFields($table);
        foreach ($arrayFields as $key => $value) {
            if (!in_array($key, $fields)) {
                $this->outputError("Unknown column `$key` in field list.");
            }
        }
    }

    /**
     * getFields 获取指定数据表中的全部字段名
     *
     * @param String $table 表名
     * @return array
     */
    private function getFields($table)
    {
        $fields = array();
        $recordset = $this->pdo->query("SHOW COLUMNS FROM $table");
        $this->getPDOError();
        $recordset->setFetchMode(PDO::FETCH_ASSOC);
        $result = $recordset->fetchAll();
        foreach ($result as $rows) {
            $fields[] = $rows['Field'];
        }
        return $fields;
    }

    /**
     * getPDOError 捕获PDO错误信息
     */
    private function getPDOError()
    {
        if ($this->pdo->errorCode() != '00000') {
            $arrayError = $this->pdo->errorInfo();
            $this->outputError($arrayError[2]);
        }
    }

    /**
     * debug
     * @param mixed $debuginfo
     */
    public function debug($debuginfo){
        var_dump($debuginfo);
        exit();
    }

    /**
     * 关闭连接
     */
    public function close(){
        $this->pdo = null;
    }

    /**
     * 输出错误信息
     * @param String $strErrMsg
     */
    private function outputError($strErrMsg)
    {
        throw new Exception('MySQL Error: '.$strErrMsg);
    }

    /*
     *
     * ------------------------------------------数据库备份start----------------------------------------------------------
     */

    /**
     * 数据库备份
     * 参数：备份哪个表(可选),备份目录(可选，默认为backup),分卷大小(可选,默认2000，即2M)
     *
     * @param $string $dir
     * @param int $size
     * @param $string $tablename
     */
    function backup($tablename = '', $dir='./', $size=20480) {
        $dir = $dir ? $dir : './';
        // 创建目录
        if (!is_dir($dir)) {
            @mkdir ($dir, 0777, true ) or die ( '创建文件夹失败' );
        }
        $size = $size ? $size : 1024*20;
        $sql = '';
        // 只备份某个表
        if (!empty($tablename)) {
            $stmt = $this->pdo->query("SHOW TABLES LIKE '".$tablename."'");
            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $num_rows = count($rows);
            if(count($rows) == 1) {
            } else {
                $this->_showMsg('表-<b>' . $tablename .'</b>-不存在，请检查！',true);
                die();
            }
            $this->_showMsg('正在备份表 <span class="imp">' . $tablename.'</span>');
            // 插入dump信息
            $sql = $this->_retrieve ();
            // 插入表结构信息
            $sql .= $this->_insert_table_structure ( $tablename );
            // 插入数据
            $data = $this->pdo->query( "SELECT * FROM `{$tablename}`");
            // 文件名前面部分
            $filename = date ( 'YmdHis' ) . "_" . $tablename;
            $num_fields = $this->getFields($tablename);
            $p = 1;
            // $num_fields = mysqli_num_fields($data);
            // 第几分卷
            // 循环每条记录
            foreach ($data as $k => $v) {
                // 单条记录
                $sql .= $this->_insert_record($tablename, $num_fields, $v);
                // 如果大于分卷大小，则写入文件
                if (strlen ($sql) >= $size * 1024) {
                    $file = $filename . "_v" . $p . ".sql";
                    if ($this->_write_file ( $sql, $file, $dir )) {
                        $this->_showMsg("表-<b>" . $tablename . "</b>-卷-<b>" . $p . "</b>-数据备份完成,备份文件 [ <span class='imp'>" .$dir . $file ."</span> ]");
                    } else {
                        $this->_showMsg("备份表 -<b>" . $tablename . "</b>- 失败",true);
                        return false;
                    }
                    $p++;
                    // 重置$sql变量为空，重新计算该变量大小
                    $sql = "";
                }
            }
            // 及时清除数据
            unset($data,$record);
            // sql大小不够分卷大小
            if ($sql != "") {
                $filename .= "_v" . $p . ".sql";
                if ($this->_write_file ( $sql, $filename, $dir )) {
                    $this->_showMsg( "表-<b>" . $tablename . "</b>-卷-<b>" . $p . "</b>-数据备份完成,备份文件 [ <span class='imp'>" .$dir . $filename ."</span> ]");
                } else {
                    $this->_showMsg("备份卷-<b>" . $p . "</b>-失败<br />");
                    return false;
                }
            }
            $this->_showMsg("恭喜您! <span class='imp'>备份成功</span>");
        } else {
            $this->_showMsg('正在备份');
            // 备份全部表
            if ($tables = $this->pdo->query( "show table status from " . $this->database)) {
                $this->_showMsg("读取数据库结构成功！");
            } else {
                $this->_showMsg("读取数据库结构失败！");
                exit ( 0 );
            }
            // 插入dump信息
            $sql .= $this->_retrieve ();
            // 文件名前面部分
            $filename = date ( 'YmdHis' ) . "_all";
            // 查出所有表
            $tables = $this->select( 'SHOW TABLES' );
            // 第几分卷
            $p = 1;
            // 循环所有表
            
            foreach ($tables as $table){
                $table_name = array_values($table)[0];
                // 获取表名
                $tablename = "`{$table_name}`";
                // 获取表结构
                $sql .= $this->_insert_table_structure ($tablename);
                $data = $this->select( "SELECT * FROM {$tablename}");
                $num_fields = $this->getFields($tablename);

                // 循环每条记录
                foreach ($data as $record) {
                    // 单条记录
                    $sql .= $this->_insert_record( $tablename, $num_fields, $record );
                    // 如果大于分卷大小，则写入文件
                    if (strlen ( $sql ) >= $size * 1000) {

                        $file = $filename . "_v" . $p . ".sql";
                        // 写入文件
                        if ($this->_write_file ( $sql, $file, $dir )) {
                            $this->_showMsg("-卷-<b>" . $p . "</b>-数据备份完成,备份文件 [ <span class='imp'>".$dir.$file."</span> ]");
                        } else {
                            $this->_showMsg("卷-<b>" . $p . "</b>-备份失败!",true);
                            return false;
                        }
                        // 下一个分卷
                        $p ++;
                        // 重置$sql变量为空，重新计算该变量大小
                        $sql = "";
                    }
                }
            }
            // sql大小不够分卷大小
            if ($sql != "") {
                $filename .= "_v" . $p . ".sql";
                if ($this->_write_file ( $sql, $filename, $dir )) {
                    $this->_showMsg("-卷-<b>" . $p . "</b>-数据备份完成,备份文件 [ <span class='imp'>".$dir.$filename."</span> ]");
                } else {
                    $this->_showMsg("卷-<b>" . $p . "</b>-备份失败",true);
                    return false;
                }
            }
            $this->_showMsg("恭喜您! <span class='imp'>备份成功</span>");
        }
    }

    //  及时输出信息
    private function _showMsg($msg,$err=false){
        flush();
        $err = $err ? "<span class='err'>ERROR:</span>" : '' ;
        return "<p class='dbDebug'>".$err . $msg."</p>";


    }

    /**
     * 插入数据库备份基础信息
     *
     * @return string
     */
    private function _retrieve() {
        $value = '';
        $value .= '--' . $this->ds;
        $value .= '-- MySQL database dump' . $this->ds;
        $value .= '-- Created by DbManage class, Power By yanue. ' . $this->ds;
        $value .= '--' . $this->ds;
        $value .= '-- 主机: ' . $this->host . $this->ds;
        $value .= '-- 生成日期: ' . date ( 'Y' ) . ' 年  ' . date ( 'm' ) . ' 月 ' . date ( 'd' ) . ' 日 ' . date ( 'H:i' ) . $this->ds;
        $value .= $this->ds;
        $value .= '--' . $this->ds;
        $value .= '-- 数据库: `' . $this->database . '`' . $this->ds;
        $value .= '--' . $this->ds . $this->ds;
        $value .= '-- -------------------------------------------------------';
        $value .= $this->ds . $this->ds;
        return $value;
    }

    /**
     * 插入表结构
     *
     * @param unknown_type $table
     * @return string
     */
    private function _insert_table_structure($table) {
        $sql = '';
        $sql .= "--" . $this->ds;
        $sql .= "-- 表的结构" . $table . $this->ds;
        $sql .= "--" . $this->ds . $this->ds;

        // 如果存在则删除表
        $sql .= "DROP TABLE IF EXISTS {$table}  {$this->ds}";
        // 获取详细表信息
        $res = $this->select( "SHOW CREATE TABLE {$table}","Row");
        $sql .= $res["Create Table"];
        $sql .= $this->ds;
        // 加上
        $sql .= $this->ds;
        $sql .= "--" . $this->ds;
        $sql .= "-- 转存表中的数据 " . $table . $this->ds;
        $sql .= "--" . $this->ds;
        $sql .= $this->ds;
        return $sql;
    }

    /**
     * 插入单条记录
     *
     * @param string $table
     * @param array $num_fields
     * @param array $record
     * @return string
     */
    private function _insert_record($table, $num_fields, $record) {
        // sql字段逗号分割
        $insert = '';
        $comma = "";
        $insert .= "INSERT INTO `" . $table . "` VALUES(";
        // 循环每个子段下面的内容
        foreach($num_fields as $v) {
            $insert .= ($comma . "'" . mysqli_real_escape_string($this->conn,$record[$v]) . "'");
            $comma = ",";
        }
        $insert .= ");" . $this->ds;
        return $insert;
    }

    /**
     * 写入文件
     *
     * @param string $sql
     * @param string $filename
     * @param string $dir
     * @return boolean
     */
    private function _write_file($sql, $filename, $dir) {
        $dir = $dir ? $dir : '../backup/';
        // 创建目录
        if (!is_dir($dir)) {
            mkdir ($dir, 0777, true );
        }
        $re = true;
        if (! @$fp = fopen ( $dir . $filename, "w+" )) {
            $re = false;
            $this->_showMsg("打开sql文件失败！",true);
        }
        if (! @fwrite ( $fp, $sql )) {
            $re = false;
            $this->_showMsg("写入sql文件失败，请文件是否可写",true);
        }
        if (! @fclose ( $fp )) {
            $re = false;
            $this->_showMsg("关闭sql文件失败！",true);
        }
        return $re;
    }
}