<?php
/**
 * MySQL 隔离集成测试：生产库仅开启只读事务；旧库仅只读取六笔来源。
 * 所有测试写入均在本机全新随机测试库中进行，测试库保留供查验。
 * 不写生产库，不修改旧库 db_client，不运行原程序的投注或结算入口。
 */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit('Forbidden'); }
define('CM_SOURCE_CONFIG_ONLY', true);
$factory = require __DIR__ . '/migrate_cadi.php';
function fixtureInsert(PDO $db, $table, array $row) {
    $sql = 'INSERT INTO `' . $table . '` (`' . implode('`,`',array_keys($row)) . '`) VALUES (' . implode(',',array_fill(0,count($row),'?')) . ')';
    cmAssert(cmExec($db,$sql,array_values($row)) === 1, '隔离数据准备失败');
}
try {
    $cfg = require dirname(__DIR__) . '/common/include/mysql.local.php';
    cmAssert($cfg['host'] === '202.61.84.134' && $cfg['database_c'] === 'db_client', '生产只读源配置不符');
    $remote = new PDO("mysql:host={$cfg['host']};dbname={$cfg['database_c']};charset=utf8mb4",$cfg['username'],$cfg['password'],
        [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false]);
    $remote->exec('SET TRANSACTION READ ONLY'); $remote->beginTransaction();
    $local = $factory();
    cmAssert(cmIdentity($local)['hostname'] === 'WIN-TE63F9O7CVS', '本机测试服务器身份不符');
    $src = cmLoadSource($local,$remote);
    $ddl = [];
    foreach (['bets','credit_log','bet_mail_queue'] as $t) { $ddl[$t] = cmRows($remote,'SHOW CREATE TABLE `' . $t . '`')[0]['Create Table']; }
    $bets = cmRows($remote,'SELECT * FROM bets WHERE ID IN (2074,2078,2079,2085,2093,2094,2095,2096) ORDER BY ID');
    $members = cmRows($remote,"SELECT id,name,nid,pay_type,credit,balance_credit FROM mem WHERE name IN ('cadi014','cadi015') ORDER BY id");
    $queue = cmRows($remote,"SELECT * FROM bet_mail_queue WHERE ticket_id IN ('DT22712002070','DT22712002071','DT22712002072','OU22712002074','OU22712002078','OU22712002079') ORDER BY id");
    $memberCols = cmRows($remote,'SHOW COLUMNS FROM mem');
    $remote->rollBack(); $remote = null;
    $scratch = 'mig_cadi_test_20261018_' . bin2hex(random_bytes(4));
    cmAssert(preg_match('/^mig_cadi_test_20261018_[a-f0-9]{8}$/D',$scratch) === 1, '测试库名不安全');
    $local->exec('CREATE DATABASE `' . $scratch . '` DEFAULT CHARACTER SET utf8mb4');
    $local->exec('USE `' . $scratch . '`');
    cmAssert(cmIdentity($local)['db_name'] === $scratch, '未切换到隔离测试库');
    foreach ($ddl as $sql) { $local->exec($sql); }
    // 只复制会员业务字段的真实类型，不复制口令或其他身份验证数据。
    $fields = [];
    foreach ($memberCols as $c) {
        if (in_array($c['Field'],['id','name','nid','pay_type','credit','balance_credit'],true)) {
            $fields[] = '`' . $c['Field'] . '` ' . $c['Type'] . ($c['Field'] === 'id' ? ' PRIMARY KEY' : '');
        }
    }
    cmAssert(count($fields) === 6, '会员测试字段不完整');
    $local->exec('CREATE TABLE mem (' . implode(',',$fields) . ') ENGINE=InnoDB');
    cmSchema($local,true);
    foreach ($bets as $r) { fixtureInsert($local,'bets',$r); }
    foreach ($members as $r) { fixtureInsert($local,'mem',$r); }
    foreach ($queue as $r) { fixtureInsert($local,'bet_mail_queue',$r); }
    $baseBets = cmRows($local,'SELECT * FROM bets ORDER BY ID');
    $baseMembers = cmMembers($local,false); $baseIndependent = cmIndependent($local);
    $identity = ['isolated_schema'=>$scratch];
    $applied = cmTestTxn($local,'apply',$src,$identity);
    cmAssert(count($applied['inserted_ids']) === 6, '真实字段迁入数量不符');
    cmAssert(!cmTestTxn($local,'apply',$src,$identity)['changed'], '真实数据库重复迁移不幂等');
    $a = cmAudit($local,$identity,false); cmVerifyApplied($local,$a['data'],false);
    $compared = 0;
    foreach ($a['data']['inserted'] as $sourceId=>$row) {
        $expected = $src['rows'][$sourceId]; $expected['ID'] = $row['ID'];
        cmAssert(cmEqual($row,$expected), '真实字段比较失败'); $compared += count($row)-1;
    }
    $rolled = cmTestTxn($local,'rollback',null,$identity);
    cmAssert($rolled['changed'] && !cmTestTxn($local,'rollback',null,$identity)['changed'], '真实回滚不幂等');
    cmAssert(cmRows($local,'SELECT * FROM bets ORDER BY ID') === $baseBets && cmMembers($local,false) === $baseMembers
        && cmIndependent($local) === $baseIndependent, '真实表恢复不完整');
    cmAssert(count(cmRows($local,'SELECT * FROM credit_log')) === 4, '真实资金流水不完整');
    echo cmJson(['result'=>'MYSQL_ISOLATED_TEST_OK','schema'=>$scratch,'business_fields_compared'=>$compared,
        'source_rows'=>6,'production_writes'=>0,'source_business_writes'=>0,'rollback_verified'=>true,'audit_retained'=>true]) . PHP_EOL;
} catch (Throwable $e) {
    fwrite(STDERR,'MYSQL_ISOLATED_TEST_FAILED: ' . $e->getMessage() . PHP_EOL); exit(1);
}
