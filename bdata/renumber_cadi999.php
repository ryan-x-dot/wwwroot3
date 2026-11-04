<?php
/**
 * 仅对 cadi999 的两笔指定订单改号，不修改余额、金额、赛果或推送留证。
 * 默认/--check：只读检查；--apply：正式改号；--rollback：恢复原号。
 * --self-test：仅使用内存 SQLite，不连接业务数据库。
 * 原始完整记录、新旧号映射、目标身份与提交状态在同一事务中保存。
 * 恢复时要求订单快照未变且原号未被其他订单占用，禁止强制覆盖。
 */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit('Forbidden'); }

const RN_TABLE = 'ops_cadi999_renumber_20261018';
const RN_BATCH = 'cadi999_renumber_20261018_v1';
const RN_MAP = [
    2074 => ['old' => 'OU22712002074', 'new' => 'OU92712002074', 'time' => '1792293133', 'result' => 'W'],
    2078 => ['old' => 'OU22712002078', 'new' => 'OU92712002078', 'time' => '1792293909', 'result' => 'L'],
];

function rnRequire($ok, $message) {
    if (!$ok) { throw new RuntimeException($message); }
}
function rnJson($value) {
    return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
}
function rnRows(PDO $db, $sql, array $params = []) {
    $s = $db->prepare($sql);
    $s->execute($params);
    return $s->fetchAll(PDO::FETCH_ASSOC);
}
function rnExec(PDO $db, $sql, array $params = []) {
    $s = $db->prepare($sql);
    $s->execute($params);
    return $s->rowCount();
}
function rnNormal(array $row) {
    foreach ($row as $key => $value) { $row[$key] = $value === null ? null : (string)$value; }
    ksort($row);
    return $row;
}
function rnSame(array $a, array $b) {
    return rnNormal($a) === rnNormal($b);
}
function rnLockSuffix(PDO $db, $lock) {
    return $lock && $db->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql' ? ' FOR UPDATE' : '';
}
function rnBets(PDO $db, $lock = false) {
    $rows = rnRows($db, 'SELECT * FROM bets WHERE ID IN (2074,2078) ORDER BY ID' . rnLockSuffix($db, $lock));
    rnRequire(count($rows) === 2, '指定的两笔订单不完整，停止操作');
    $out = [];
    foreach ($rows as $row) { $out[(int)$row['ID']] = rnNormal($row); }
    return $out;
}
function rnInitial(PDO $db, array $rows) {
    foreach (RN_MAP as $id => $map) {
        $r = $rows[$id];
        rnRequire($r['m_name'] === 'cadi999' && $r['ticket_id'] === $map['old']
            && $r['bet_time'] === $map['time'] && $r['bet_golds'] === '1000'
            && $r['isResult'] === '1' && $r['result'] === $map['result'], "订单身份或状态不符：ID={$id}");
        $old = rnRows($db, 'SELECT ID FROM bets WHERE ticket_id=?', [$map['old']]);
        rnRequire(count($old) === 1 && (int)$old[0]['ID'] === $id, "原号存在非预期记录：{$map['old']}");
        rnRequire(!rnRows($db, 'SELECT ID FROM bets WHERE ticket_id=?', [$map['new']]), "新号已被订单占用：{$map['new']}");
        rnRequire(!rnRows($db, 'SELECT ticket_id FROM bet_mail_queue WHERE ticket_id=?', [$map['new']]), "新号已被留证队列使用：{$map['new']}");
    }
}
function rnGuards(PDO $db) {
    return [
        'balances' => rnRows($db, "SELECT name,credit,balance_credit FROM mem WHERE name IN ('cadi999','cadi014','cadi015') ORDER BY name"),
        'cadi014_order' => rnRows($db, 'SELECT * FROM bets WHERE ID=2079'),
        'queue' => rnRows($db, "SELECT * FROM bet_mail_queue WHERE ticket_id IN ('OU22712002074','OU22712002078','OU22712002079','OU92712002074','OU92712002078') ORDER BY id"),
    ];
}
function rnAudit(PDO $db, array $identity, $lock) {
    $a = rnRows($db, 'SELECT * FROM `' . RN_TABLE . '` WHERE batch_id=?' . rnLockSuffix($db, $lock), [RN_BATCH]);
    if (!$a) { return null; }
    rnRequire(count($a) === 1, '批次记录不唯一');
    $a = $a[0];
    rnRequire(hash_equals($a['payload_hash'], hash('sha256', $a['payload'])), '备份校验失败');
    $p = json_decode($a['payload'], true, 512, JSON_THROW_ON_ERROR);
    rnRequire(($p['version'] ?? null) === 1 && ($p['identity'] ?? null) === $identity, '备份版本或数据库身份不匹配');
    rnRequire(isset($p['rows']) && count($p['rows']) === 2, '备份订单数量不符');
    foreach (RN_MAP as $id => $map) {
        rnRequire(isset($p['rows'][$id]['before'], $p['rows'][$id]['after']), '备份缺少完整快照');
        $before = $p['rows'][$id]['before'];
        $after = $p['rows'][$id]['after'];
        rnRequire((string)$before['ID'] === (string)$id && $before['m_name'] === 'cadi999'
            && $before['ticket_id'] === $map['old'] && $after['ticket_id'] === $map['new'], '备份映射不匹配');
        $expected = $before;
        $expected['ticket_id'] = $map['new'];
        rnRequire(rnSame($after, $expected), '备份包含改号以外的变更');
    }
    $a['decoded'] = $p;
    return $a;
}
function rnChange(PDO $db, array $from, array $to) {
    foreach (RN_MAP as $id => $map) {
        $n = rnExec($db, "UPDATE bets SET ticket_id=? WHERE ID=? AND m_name='cadi999' AND ticket_id=?",
            [$to[$id]['ticket_id'], $id, $from[$id]['ticket_id']]);
        rnRequire($n === 1, "改号命中行数不符：ID={$id}");
    }
    $actual = rnBets($db);
    foreach ($to as $id => $expected) {
        rnRequire(rnSame($actual[$id], $expected), "回读校验失败：ID={$id}");
        $owners = rnRows($db, 'SELECT ID FROM bets WHERE ticket_id=?', [$expected['ticket_id']]);
        rnRequire(count($owners) === 1 && (int)$owners[0]['ID'] === $id, '目标单号不唯一');
    }
}
/** 调用者负责事务；只在此函数内更新两笔单号与专用审计表。 */
function rnRun(PDO $db, $mode, array $identity) {
    $write = $mode !== '--check';
    $audit = rnAudit($db, $identity, $write);
    $current = rnBets($db, $write);
    if (!$audit) {
        rnInitial($db, $current);
        if ($mode !== '--apply') { return ['state' => 'NOT_APPLIED', 'changed' => false]; }
        $guard = rnGuards($db);
        $after = $current;
        $records = [];
        foreach (RN_MAP as $id => $map) {
            $after[$id]['ticket_id'] = $map['new'];
            $records[$id] = ['before' => $current[$id], 'after' => $after[$id]];
        }
        $payload = rnJson(['version' => 1, 'identity' => $identity, 'rows' => $records, 'guard_before' => $guard]);
        rnChange($db, $current, $after);
        rnRequire(rnGuards($db) === $guard, '保护对象发生变化，停止提交');
        $n = rnExec($db, 'INSERT INTO `' . RN_TABLE . '` (batch_id,state,payload,payload_hash,created_at) VALUES (?,?,?,?,?)',
            [RN_BATCH, 'APPLIED', $payload, hash('sha256', $payload), gmdate('Y-m-d H:i:s')]);
        rnRequire($n === 1, '审计记录写入失败');
        rnRequire(rnAudit($db, $identity, false)['state'] === 'APPLIED', '审计回读失败');
        return ['state' => 'APPLIED', 'changed' => true];
    }
    rnRequire(in_array($audit['state'], ['APPLIED', 'ROLLED_BACK'], true), '未知批次状态');
    $side = $audit['state'] === 'APPLIED' ? 'after' : 'before';
    foreach (RN_MAP as $id => $map) {
        rnRequire(rnSame($current[$id], $audit['decoded']['rows'][$id][$side]), "ID={$id} 已被后续业务修改，禁止自动覆盖");
    }
    if ($mode === '--check' || ($mode === '--apply' && $audit['state'] === 'APPLIED')
        || ($mode === '--rollback' && $audit['state'] === 'ROLLED_BACK')) {
        return ['state' => $audit['state'], 'changed' => false];
    }
    rnRequire($mode === '--rollback' && $audit['state'] === 'APPLIED', '本批次已经恢复，禁止重新执行改号');
    $restore = [];
    foreach (RN_MAP as $id => $map) {
        rnRequire(!rnRows($db, 'SELECT ID FROM bets WHERE ticket_id=? AND ID<>?', [$map['old'], $id]),
            "原号 {$map['old']} 已被其他订单占用；须先处理后续迁移，禁止覆盖");
        $restore[$id] = $audit['decoded']['rows'][$id]['before'];
    }
    $guard = rnGuards($db);
    rnChange($db, $current, $restore);
    rnRequire(rnGuards($db) === $guard, '恢复时保护对象发生变化，停止提交');
    $n = rnExec($db, 'UPDATE `' . RN_TABLE . "` SET state='ROLLED_BACK',rolled_back_at=? WHERE batch_id=? AND state='APPLIED'",
        [gmdate('Y-m-d H:i:s'), RN_BATCH]);
    rnRequire($n === 1, '恢复状态写入失败');
    return ['state' => 'ROLLED_BACK', 'changed' => true];
}
function rnSchema(PDO $db, $create) {
    $row = rnRows($db, 'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?', [RN_TABLE]);
    if (!$row && $create) {
        // DDL 独立于业务事务；空审计表不代表改号已执行。
        $db->exec('CREATE TABLE `' . RN_TABLE . '` (
            batch_id varchar(64) NOT NULL PRIMARY KEY,
            state varchar(20) NOT NULL,
            payload longtext NOT NULL,
            payload_hash char(64) NOT NULL,
            created_at datetime NOT NULL,
            rolled_back_at datetime DEFAULT NULL
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
        $row = rnRows($db, 'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?', [RN_TABLE]);
    }
    if (!$row) { return false; }
    rnRequire($row[0]['ENGINE'] === 'InnoDB', '审计表不是事务表');
    $cols = rnRows($db, 'SHOW COLUMNS FROM `' . RN_TABLE . '`');
    rnRequire(array_column($cols, 'Field') === ['batch_id','state','payload','payload_hash','created_at','rolled_back_at'], '审计表结构不符');
    $keys = rnRows($db, 'SHOW INDEX FROM `' . RN_TABLE . '` WHERE Non_unique=0');
    rnRequire(count($keys) === 1 && $keys[0]['Key_name'] === 'PRIMARY' && $keys[0]['Column_name'] === 'batch_id', '审计表主键不符');
    return true;
}
function rnSafety(PDO $db) {
    $engine = rnRows($db, "SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME='bets'");
    rnRequire(count($engine) === 1 && $engine[0]['ENGINE'] === 'InnoDB', '注单表不是事务表');
    $triggers = rnRows($db, 'SELECT TRIGGER_NAME FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA=DATABASE() AND EVENT_OBJECT_TABLE IN (?,?)', ['bets', RN_TABLE]);
    rnRequire(!$triggers, '目标表存在触发器，须另行核查');
    $fk = rnRows($db, "SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE (REFERENCED_TABLE_SCHEMA=DATABASE() AND REFERENCED_TABLE_NAME='bets' AND REFERENCED_COLUMN_NAME='ticket_id') OR (TABLE_SCHEMA=DATABASE() AND TABLE_NAME='bets' AND COLUMN_NAME='ticket_id' AND REFERENCED_TABLE_NAME IS NOT NULL)");
    rnRequire(!$fk, '单号存在外键依赖，须另行核查');
}
function rnFixture() {
    $db = new PDO('sqlite::memory:', null, null, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]);
    $db->exec('CREATE TABLE bets (ID INTEGER PRIMARY KEY,m_name TEXT,ticket_id TEXT,bet_time TEXT,bet_golds TEXT,isResult TEXT,result TEXT)');
    $db->exec('CREATE TABLE mem (name TEXT,credit TEXT,balance_credit TEXT)');
    $db->exec('CREATE TABLE bet_mail_queue (id INTEGER PRIMARY KEY,ticket_id TEXT,status TEXT)');
    $db->exec('CREATE TABLE `' . RN_TABLE . '` (batch_id TEXT PRIMARY KEY,state TEXT,payload TEXT,payload_hash TEXT,created_at TEXT,rolled_back_at TEXT)');
    foreach (RN_MAP as $id => $map) {
        rnExec($db, 'INSERT INTO bets VALUES (?,?,?,?,?,?,?)', [$id,'cadi999',$map['old'],$map['time'],'1000','1',$map['result']]);
        rnExec($db, 'INSERT INTO bet_mail_queue VALUES (?,?,?)', [$id,$map['old'],'1']);
    }
    $db->exec("INSERT INTO bets VALUES (2079,'cadi014','OU22712002079','1792293920','1000','1','L')");
    $db->exec("INSERT INTO mem VALUES ('cadi999','110005','110005'),('cadi014','31873','31873'),('cadi015','35669','35669')");
    return $db;
}
function rnTestTxn(PDO $db, $mode, array $identity = ['test' => 'memory-only']) {
    $db->beginTransaction();
    try { $r = rnRun($db, $mode, $identity); $db->commit(); return $r; }
    catch (Throwable $e) { if ($db->inTransaction()) { $db->rollBack(); } throw $e; }
}
function rnTestReject(PDO $db, $mode, array $identity = ['test' => 'memory-only']) {
    $before = rnJson([rnBets($db), rnGuards($db), rnRows($db, 'SELECT * FROM `' . RN_TABLE . '`')]);
    $failed = false;
    try { rnTestTxn($db, $mode, $identity); } catch (Throwable $e) { $failed = true; }
    rnRequire($failed, '应拒绝的场景未被拒绝');
    rnRequire($before === rnJson([rnBets($db), rnGuards($db), rnRows($db, 'SELECT * FROM `' . RN_TABLE . '`')]), '失败场景留下了业务变更');
}
function rnSelfTest() {
    $db = rnFixture();
    $original = rnJson([rnBets($db),rnGuards($db)]);
    rnRequire(!rnTestTxn($db, '--check')['changed'], '只读预检发生写入');
    rnRequire(!rnTestTxn($db, '--rollback')['changed'], '未执行时错误恢复');
    rnRequire(rnTestTxn($db, '--apply')['changed'], '首次改号失败');
    rnRequire(!rnTestTxn($db, '--apply')['changed'], '重复改号不幂等');
    rnRequire(rnTestTxn($db, '--rollback')['changed'], '恢复失败');
    rnRequire(!rnTestTxn($db, '--rollback')['changed'], '重复恢复不幂等');
    rnRequire($original === rnJson([rnBets($db),rnGuards($db)]), '恢复未还原原始记录');
    rnTestReject($db, '--apply');
    $db = rnFixture();
    $db->exec("CREATE TRIGGER fail_second BEFORE UPDATE ON bets WHEN OLD.ID=2078 BEGIN SELECT RAISE(ABORT,'injected failure'); END");
    rnTestReject($db, '--apply');
    $db = rnFixture();
    rnTestTxn($db, '--apply');
    $db->exec("UPDATE bets SET bet_golds='999' WHERE ID=2074");
    rnTestReject($db, '--rollback');
    $db = rnFixture();
    rnTestTxn($db, '--apply');
    $db->exec("INSERT INTO bets VALUES (9000,'cadi014','OU22712002074','1','500','1','L')");
    rnTestReject($db, '--rollback');
    $db = rnFixture();
    rnTestTxn($db, '--apply');
    rnTestReject($db, '--rollback', ['test' => 'wrong-server']);
    $db->exec('DELETE FROM `' . RN_TABLE . '`');
    rnTestReject($db, '--rollback');
    $db = rnFixture();
    rnTestTxn($db, '--apply');
    $db->exec('UPDATE `' . RN_TABLE . "` SET payload_hash='bad'");
    rnTestReject($db, '--rollback');
    echo "SELF_TEST_OK：正常改号/恢复、重复执行、部分失败、快照变化、原号被占、身份错误、备份缺失及损坏均通过；仅内存数据库。\n";
}

$mode = $argv[1] ?? '--check';
if (count($argv) > 2 || !in_array($mode, ['--check','--apply','--rollback','--self-test'], true)) {
    fwrite(STDERR, "参数错误：仅支持 --check、--apply、--rollback、--self-test；默认只读。\n");
    exit(2);
}
$db = null;
$locked = false;
$commitAttempted = false;
$committed = false;
$exit = 0;
try {
    if ($mode === '--self-test') { rnSelfTest(); exit(0); }
    $cfg = require dirname(__DIR__) . '/common/include/mysql.local.php';
    rnRequire(is_array($cfg) && $cfg['host'] === '202.61.84.134' && $cfg['database_c'] === 'db_client', '目标配置变化，拒绝连接其他数据库');
    $db = new PDO("mysql:host={$cfg['host']};port=3306;dbname={$cfg['database_c']};charset=utf8mb4", $cfg['username'], $cfg['password'],
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, PDO::ATTR_EMULATE_PREPARES => false, PDO::ATTR_TIMEOUT => 10]);
    $identity = rnNormal(rnRows($db, 'SELECT @@hostname AS hostname,@@port AS port,@@server_id AS server_id,DATABASE() AS db_name')[0]);
    rnRequire($identity === rnNormal(['hostname'=>'33612-WHQ622800','port'=>'3306','server_id'=>'1','db_name'=>'db_client']), '实际数据库身份变化，停止操作');
    rnSafety($db);
    if ($mode !== '--check') {
        $lock = rnRows($db, 'SELECT GET_LOCK(?,0) AS acquired', [RN_BATCH])[0]['acquired'];
        rnRequire((string)$lock === '1', '另一次改号或恢复正在执行，请勿并发运行');
        $locked = true;
        $db->exec('SET SESSION innodb_lock_wait_timeout=5');
    }
    $hasAudit = rnSchema($db, $mode === '--apply');
    rnSafety($db);
    if ($mode === '--check') {
        $db->exec('SET TRANSACTION READ ONLY');
    } else {
        $db->exec('SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
    }
    $db->beginTransaction();
    if (!$hasAudit) {
        rnInitial($db, rnBets($db, $mode !== '--check'));
        $r = ['state'=>'NOT_APPLIED','changed'=>false];
    } else {
        $r = rnRun($db, $mode, $identity);
    }
    if ($r['changed']) {
        $commitAttempted = true;
        $db->commit();
        $committed = true;
    } else {
        $db->rollBack();
    }
    echo rnJson(['batch'=>RN_BATCH, 'state'=>$r['state'], 'changed'=>$r['changed'], 'audit_table'=>RN_TABLE]) . "\n";
    foreach (rnBets($db) as $row) { echo "ID={$row['ID']} account={$row['m_name']} ticket={$row['ticket_id']}\n"; }
    echo "仅修改指定订单的 ticket_id；资金、赛果及历史推送留证未由本脚本修改。\n";
} catch (Throwable $e) {
    $exit = 1;
    $state = 'NOT_COMMITTED';
    if ($committed) {
        $state = 'COMMITTED_POSTCHECK_FAILED';
    } elseif ($commitAttempted) {
        // 提交响应丢失时不能推断成功或失败，更不能盲目反向写入。
        $state = 'COMMIT_OUTCOME_UNKNOWN';
    } elseif ($db && $db->inTransaction()) {
        try { $db->rollBack(); $state = 'TRANSACTION_ROLLED_BACK'; }
        catch (Throwable $rollbackError) { $state = 'ROLLBACK_UNCONFIRMED'; }
    }
    fwrite(STDERR, $state . ': ' . $e->getMessage() . "\n");
    fwrite(STDERR, "请保持维护，使用本脚本 --check 核实批次；不能把数据库连接失败解释为已恢复。\n");
} finally {
    if ($db && $locked) {
        try { rnRows($db, 'SELECT RELEASE_LOCK(?)', [RN_BATCH]); } catch (Throwable $ignored) {}
    }
}
exit($exit);
