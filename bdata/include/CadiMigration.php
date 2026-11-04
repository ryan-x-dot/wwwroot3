<?php
/**
 * 一次性生产迁移内核。仅迁入核实过的六笔已结算注单，并改动生产 ID2079 的票号。
 * 凭证与业务修改同事务提交；回滚按目标主键和完整快照校验，资金独立按实际差额补偿。
 * 不调用投注、结算、推送业务代码，不触碰其他未结算订单。源连接始终只读。
 */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit('Forbidden'); }
const CM_TABLE = 'ops_cadi_migration_20261018_v3';
const CM_BATCH = 'cadi_six_bets_20261018_v3';
const CM_OLD = 'OU22712002079';
const CM_NEW = 'OU92712002079';
const CM_SPEC = [
    2070 => ['cadi015','DT22712002070','1792252967','4000','-4000','L'],
    2071 => ['cadi015','DT22712002071','1792253172','5000','-5000','L'],
    2072 => ['cadi015','DT22712002072','1792253211','5000','-5000','L'],
    2074 => ['cadi014','OU22712002074','1792257274','1000','-1000','L'],
    2078 => ['cadi014','OU22712002078','1792260319','500','420','W'],
    2079 => ['cadi014','OU22712002079','1792260798','500','0','T'],
];
const CM_NIDS = [
    'cadi014'=>'d2819f8316763cca632a7a14d3fc613a25888b081f06c6eced1bbefab1029b183fb255d6610ff9c2e268990c035ca72c4dbb9941131b2a76',
    'cadi015'=>'d2819f8316763cca632a7a14d3fc613a25888b081f06c6eced1bbefab1029b183fb255d6610ff9c2e268990c035ca72c87bf5353c5ec7981',
];
function cmAssert($ok, $message) { if (!$ok) { throw new RuntimeException($message); } }
function cmJson($v) { return json_encode($v, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR); }
function cmRows(PDO $p, $sql, array $args = []) {
    $s = $p->prepare($sql); $s->execute($args); return $s->fetchAll(PDO::FETCH_ASSOC);
}
function cmExec(PDO $p, $sql, array $args = []) {
    $s = $p->prepare($sql); $s->execute($args); return $s->rowCount();
}
function cmNorm(array $r) {
    foreach ($r as $k => $v) { $r[$k] = $v === null ? null : (string)$v; }
    ksort($r); return $r;
}
function cmEqual(array $a, array $b) { return cmNorm($a) === cmNorm($b); }
function cmCents($v) {
    $v = (string)$v;
    cmAssert(preg_match('/^(-?)(\d{1,10})(?:\.(\d{1,2}))?$/D', $v, $m) === 1, '非法金额格式');
    return ($m[1] === '-' ? -1 : 1) * ((int)$m[2] * 100 + (int)str_pad($m[3] ?? '', 2, '0'));
}
function cmMoney($cents) {
    cmAssert(is_int($cents), '金额必须使用整数分');
    return ($cents < 0 ? '-' : '') . intdiv(abs($cents),100) . '.' . str_pad((string)(abs($cents)%100),2,'0',STR_PAD_LEFT);
}
function cmLock(PDO $p, $write) { return $write && $p->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql' ? ' FOR UPDATE' : ''; }
function cmOne(PDO $p, $table, $id, $write = false) {
    cmAssert(in_array($table,['bets','credit_log'],true), '非法表');
    $rows = cmRows($p, "SELECT * FROM `{$table}` WHERE id=?" . cmLock($p,$write), [$id]);
    cmAssert(count($rows) === 1, "记录缺失：{$table}/{$id}"); return cmNorm($rows[0]);
}
function cmInsert(PDO $p, $table, array $row) {
    cmAssert(in_array($table,['bets','credit_log'],true), '非法插入表');
    $cols = array_keys($row);
    foreach ($cols as $c) { cmAssert(preg_match('/^[a-zA-Z_][a-zA-Z_0-9]*$/D',$c) === 1, '非法字段'); }
    $sql = 'INSERT INTO `' . $table . '` (`' . implode('`,`',$cols) . '`) VALUES (' . implode(',',array_fill(0,count($cols),'?')) . ')';
    cmAssert(cmExec($p,$sql,array_values($row)) === 1, '插入失败');
    $id = $p->lastInsertId(); cmAssert(ctype_digit((string)$id) && (int)$id > 0, '目标主键无效');
    return cmOne($p,$table,$id);
}
function cmSourceValidate(array $src) {
    cmAssert(count($src) === 6, '源注单不是六条');
    $delta = ['cadi014'=>0,'cadi015'=>0];
    foreach (CM_SPEC as $id => $s) {
        cmAssert(isset($src[$id]), '源ID缺失'); $r = $src[$id];
        cmAssert((string)$r['ID'] === (string)$id && $r['m_name'] === $s[0] && $r['ticket_id'] === $s[1]
            && (string)$r['bet_time'] === $s[2] && cmCents($r['bet_golds']) === cmCents($s[3])
            && cmCents($r['mem_result']) === cmCents($s[4]) && $r['result'] === $s[5]
            && (string)$r['isResult'] === '1' && (string)$r['danger'] === '3' && (string)$r['hidden'] === '0'
            && (string)$r['cancel'] === '0' && (string)$r['pay_type'] === '1'
            && $r['nid'] === CM_NIDS[$s[0]], '源注单身份、金额或结算状态变化');
        $delta[$s[0]] += cmCents($r['mem_result']);
    }
    cmAssert($delta === ['cadi014'=>-58000,'cadi015'=>-1400000], '实际净额不符'); return $delta;
}
function cmMembers(PDO $p, $write) {
    $rows = cmRows($p,"SELECT id,name,nid,pay_type,credit,balance_credit FROM mem WHERE name IN ('cadi014','cadi015') ORDER BY id" . cmLock($p,$write));
    cmAssert(count($rows) === 2, '会员记录不完整'); $out = [];
    foreach ($rows as $r) {
        cmAssert(isset(CM_NIDS[$r['name']]) && $r['nid'] === CM_NIDS[$r['name']] && (string)$r['pay_type'] === '1', '会员身份或资金类型变化');
        cmCents($r['credit']); cmCents($r['balance_credit']); $out[$r['name']] = cmNorm($r);
    }
    return $out;
}
function cmIndependent(PDO $p) {
    return [
        'cadi999_bets'=>cmRows($p,'SELECT * FROM bets WHERE ID IN (2074,2078) ORDER BY ID'),
        'queue'=>cmRows($p,"SELECT * FROM bet_mail_queue WHERE ticket_id IN ('DT22712002070','DT22712002071','DT22712002072','OU22712002074','OU22712002078','OU22712002079','OU92712002079') ORDER BY id"),
    ];
}
function cmBefore(PDO $p, $write) {
    $members = cmMembers($p,$write);
    $collision = cmOne($p,'bets',2079,$write);
    cmAssert($collision['ticket_id'] === CM_OLD && $collision['m_name'] === 'cadi014'
        && $collision['bet_time'] === '1792293920' && cmCents($collision['bet_golds']) === 100000
        && $collision['isResult'] === '1' && $collision['result'] === 'L', '生产撞号单身份变化');
    foreach (CM_SPEC as $id=>$s) {
        $rows = cmRows($p,'SELECT ID FROM bets WHERE ticket_id=?',[$s[1]]);
        cmAssert($id === 2079 ? (count($rows) === 1 && (int)$rows[0]['ID'] === 2079) : !$rows, '原号被非预期记录占用');
    }
    cmAssert(!cmRows($p,'SELECT ID FROM bets WHERE ticket_id=?',[CM_NEW]), '新号已占用');
    cmAssert(!cmRows($p,'SELECT id FROM bet_mail_queue WHERE ticket_id=?',[CM_NEW]), '新号已有推送留证');
    foreach ([2074=>'OU92712002074',2078=>'OU92712002078'] as $id=>$ticket) {
        $r = cmOne($p,'bets',$id); cmAssert($r['m_name'] === 'cadi999' && $r['ticket_id'] === $ticket, '之前的独立改号状态变化');
    }
    return [$members,$collision];
}
function cmCash(PDO $p, array $before, array $delta, $undo) {
    $changes = []; $logs = [];
    foreach (['cadi014','cadi015'] as $name) {
        $b = $before[$name]; $d = $delta[$name]; $a = $b;
        foreach (['credit','balance_credit'] as $field) {
            $next = cmCents($b[$field]) + $d[$field]; cmAssert($next >= 0, '余额不足'); $a[$field] = cmMoney($next);
        }
        // 两个余额独立使用原子增量，避免复制彼此的数值，并与正常增量派彩相容。
        $n = cmExec($p,'UPDATE mem SET credit=credit+?,balance_credit=balance_credit+? WHERE id=? AND name=? AND nid=? AND pay_type=1 AND credit=? AND balance_credit=?',
            [cmMoney($d['credit']),cmMoney($d['balance_credit']),$b['id'],$name,$b['nid'],$b['credit'],$b['balance_credit']]);
        cmAssert($n === 1, '余额更新未准确命中一行');
        $actual = cmMembers($p,false)[$name];
        foreach (['credit','balance_credit'] as $field) { cmAssert(cmCents($actual[$field]) === cmCents($a[$field]), '余额回读不符'); }
        $log = cmInsert($p,'credit_log',[
            'nid'=>$b['nid'],'s_name'=>$name,'ss_name'=>'migration_v3','type'=>$d['credit'] < 0 ? 'N' : 'Y',
            'old_cash'=>$b['credit'],'new_cash'=>$actual['credit'],'cash'=>cmMoney($d['credit']),
            'usertype'=>$undo ? '历史迁移回退' : '历史迁移补扣','logintime'=>(string)time(),
        ]);
        $changes[$name] = ['before'=>$b,'after'=>$actual,'delta'=>$d]; $logs[$name] = $log;
    }
    return ['members'=>$changes,'credit_logs'=>$logs];
}
function cmTicketUnique(PDO $p, array $r) {
    $ids = cmRows($p,'SELECT ID FROM bets WHERE ticket_id=?',[$r['ticket_id']]);
    cmAssert(count($ids) === 1 && (string)$ids[0]['ID'] === (string)$r['ID'], '迁移相关票号不唯一');
}
function cmAudit(PDO $p, array $identity, $write) {
    $rows = cmRows($p,'SELECT * FROM `' . CM_TABLE . '` WHERE batch_id=?' . cmLock($p,$write),[CM_BATCH]);
    if (!$rows) { return null; }
    cmAssert(count($rows) === 1, '批次不唯一'); $a = $rows[0];
    cmAssert(hash_equals($a['payload_hash'],hash('sha256',$a['payload'])), '批次备份损坏');
    $j = json_decode($a['payload'],true,512,JSON_THROW_ON_ERROR);
    cmAssert(($j['version'] ?? null) === 3 && ($j['target'] ?? null) === $identity, '批次版本或目标身份不符');
    $delta = cmSourceValidate($j['source']['rows']);
    cmAssert(count($j['inserted']) === 6 && count($j['funds']['members']) === 2 && count($j['funds']['credit_logs']) === 2, '批次记录不完整');
    $ids = [];
    foreach (CM_SPEC as $sourceId=>$s) {
        cmAssert(isset($j['inserted'][$sourceId]), '新增主键映射缺失');
        $r = $j['inserted'][$sourceId]; $expected = $j['source']['rows'][$sourceId];
        cmAssert(ctype_digit((string)$r['ID']) && (int)$r['ID'] > 0 && !in_array((int)$r['ID'],[2074,2078,2079],true), '新增主键无效');
        $expected['ID'] = $r['ID']; cmAssert(cmEqual($r,$expected), '迁入快照与源数据不符'); $ids[] = $r['ID'];
    }
    cmAssert(count(array_unique($ids)) === 6, '新增主键重复');
    $before = $j['renumber']['before']; $after = $j['renumber']['after']; $expected = $before; $expected['ticket_id'] = CM_NEW;
    cmAssert($before['ID'] === '2079' && $before['m_name'] === 'cadi014' && $before['ticket_id'] === CM_OLD && cmEqual($after,$expected), '改号凭证不符');
    foreach (CM_NIDS as $name=>$nid) {
        $f = $j['funds']['members'][$name];
        cmAssert($f['before']['name'] === $name && $f['before']['nid'] === $nid && $f['before']['id'] === $f['after']['id'], '资金凭证身份不符');
        foreach (['credit','balance_credit'] as $field) {
            cmAssert($f['delta'][$field] === $delta[$name] && cmCents($f['after'][$field])-cmCents($f['before'][$field]) === $delta[$name], '实际扣款凭证不符');
        }
        $l = $j['funds']['credit_logs'][$name];
        cmAssert($l['nid'] === $nid && $l['s_name'] === $name && cmCents($l['cash']) === $delta[$name]
            && cmCents($l['old_cash']) === cmCents($f['before']['credit']) && cmCents($l['new_cash']) === cmCents($f['after']['credit']), '资金流水凭证不符');
    }
    cmAssert(in_array($a['state'],['APPLIED','ROLLED_BACK'],true), '未知批次状态'); $a['data'] = $j; return $a;
}
function cmVerifyApplied(PDO $p, array $j, $write) {
    $current = cmOne($p,'bets',2079,$write); cmAssert(cmEqual($current,$j['renumber']['after']), '生产改号单被后续修改'); cmTicketUnique($p,$current);
    foreach ($j['inserted'] as $r) {
        $actual = cmOne($p,'bets',$r['ID'],$write); cmAssert(cmEqual($actual,$r), '迁入订单被后续修改，禁止自动删除'); cmTicketUnique($p,$actual);
    }
    foreach ($j['funds']['credit_logs'] as $r) { cmAssert(cmEqual(cmOne($p,'credit_log',$r['id'],$write),$r), '原扣款流水被修改'); }
}
/** 只进行事务内操作，不提交；提交及异常状态由入口统一处理。 */
function cmRun(PDO $p, $action, array $identity, $source = null) {
    $write = $action !== 'check';
    $audit = cmAudit($p,$identity,$write);
    if (!$audit) {
        list($members,$collision) = cmBefore($p,$write);
        if ($action !== 'apply') {
            if ($source !== null) { cmSourceValidate($source['rows']); }
            return ['state'=>'NOT_APPLIED','changed'=>false,'members'=>$members];
        }
        cmAssert($source !== null, '缺少源数据'); $net = cmSourceValidate($source['rows']);
        $guard = cmIndependent($p);
        $after = $collision; $after['ticket_id'] = CM_NEW;
        cmAssert(cmExec($p,"UPDATE bets SET ticket_id=? WHERE ID=2079 AND m_name='cadi014' AND ticket_id=?",[CM_NEW,CM_OLD]) === 1, '生产改号失败');
        cmAssert(cmEqual(cmOne($p,'bets',2079),$after), '改号触及其他字段');
        $inserted = [];
        foreach ($source['rows'] as $id=>$r) {
            $copy = $r; unset($copy['ID']); $actual = cmInsert($p,'bets',$copy);
            $expected = $r; $expected['ID'] = $actual['ID']; cmAssert(cmEqual($actual,$expected), '迁入字段与源快照不一致');
            cmTicketUnique($p,$actual); $inserted[$id] = $actual;
        }
        $delta = [];
        foreach ($net as $name=>$v) { $delta[$name] = ['credit'=>$v,'balance_credit'=>$v]; }
        $funds = cmCash($p,$members,$delta,false);
        cmAssert(cmIndependent($p) === $guard, '独立订单或留证队列变化');
        $j = ['version'=>3,'target'=>$identity,'source'=>$source,'inserted'=>$inserted,'renumber'=>['before'=>$collision,'after'=>$after],
            'funds'=>$funds,'untouched'=>$guard];
        cmVerifyApplied($p,$j,false);
        $payload = cmJson($j);
        cmAssert(cmExec($p,'INSERT INTO `' . CM_TABLE . '` (batch_id,state,payload,payload_hash,created_at) VALUES (?,?,?,?,?)',
            [CM_BATCH,'APPLIED',$payload,hash('sha256',$payload),gmdate('Y-m-d H:i:s')]) === 1, '批次凭证写入失败');
        cmAudit($p,$identity,false);
        return ['state'=>'APPLIED','changed'=>true,'inserted_ids'=>array_column($inserted,'ID'),'funds'=>$funds['members'],'new_ticket'=>CM_NEW];
    }
    $j = $audit['data'];
    if ($audit['state'] === 'ROLLED_BACK') {
        cmAssert($action !== 'apply', '已回滚批次禁止自动再次迁入');
        cmAssert(cmEqual(cmOne($p,'bets',2079),$j['renumber']['before']), '已回滚订单又发生变化');
        foreach ($j['inserted'] as $r) { cmAssert(!cmRows($p,'SELECT ID FROM bets WHERE ID=?',[$r['ID']]), '已回滚主键被重新使用'); }
        return ['state'=>'ROLLED_BACK','changed'=>false];
    }
    $members = cmMembers($p,$write);
    cmVerifyApplied($p,$j,$write);
    if ($action !== 'rollback') { return ['state'=>'APPLIED','changed'=>false,'members'=>$members,'new_ticket'=>CM_NEW]; }
    $guard = cmIndependent($p);
    foreach ($j['inserted'] as $r) {
        cmAssert(cmExec($p,'DELETE FROM bets WHERE ID=? AND ticket_id=? AND m_name=?',[$r['ID'],$r['ticket_id'],$r['m_name']]) === 1, '精确删除未命中');
    }
    cmAssert(!cmRows($p,'SELECT ID FROM bets WHERE ticket_id=?',[CM_OLD]), '恢复原号仍有其他占用');
    cmAssert(cmExec($p,"UPDATE bets SET ticket_id=? WHERE ID=2079 AND m_name='cadi014' AND ticket_id=?",[CM_OLD,CM_NEW]) === 1, '原号恢复失败');
    cmAssert(cmEqual(cmOne($p,'bets',2079),$j['renumber']['before']), '恢复后快照不符');
    $delta = [];
    foreach ($j['funds']['members'] as $name=>$f) {
        cmAssert($members[$name]['id'] === $f['before']['id'], '回滚会员主键变化');
        $delta[$name] = ['credit'=>-$f['delta']['credit'],'balance_credit'=>-$f['delta']['balance_credit']];
    }
    $undo = cmCash($p,$members,$delta,true);
    cmAssert(cmIndependent($p) === $guard, '恢复误动独立订单或队列');
    foreach ($j['inserted'] as $r) { cmAssert(!cmRows($p,'SELECT ID FROM bets WHERE ID=?',[$r['ID']]), '迁入主键残留'); }
    $undoJson = cmJson($undo);
    cmAssert(cmExec($p,'UPDATE `' . CM_TABLE . "` SET state='ROLLED_BACK',rollback_payload=?,rollback_hash=?,rolled_back_at=? WHERE batch_id=? AND state='APPLIED'",
        [$undoJson,hash('sha256',$undoJson),gmdate('Y-m-d H:i:s'),CM_BATCH]) === 1, '回滚状态更新失败');
    return ['state'=>'ROLLED_BACK','changed'=>true,'funds'=>$undo['members']];
}
function cmIdentity(PDO $p) {
    return cmNorm(cmRows($p,'SELECT @@hostname AS hostname,@@port AS port,@@server_id AS server_id,DATABASE() AS db_name')[0]);
}
function cmSafety(PDO $p) {
    $tables = ['bets','mem','credit_log'];
    foreach ($tables as $t) {
        $r = cmRows($p,'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?',[$t]);
        cmAssert(count($r) === 1 && $r[0]['ENGINE'] === 'InnoDB', '业务表不支持事务：' . $t);
    }
    $tr = cmRows($p,'SELECT TRIGGER_NAME FROM information_schema.TRIGGERS WHERE TRIGGER_SCHEMA=DATABASE() AND EVENT_OBJECT_TABLE IN (?,?,?,?)',array_merge($tables,[CM_TABLE]));
    cmAssert(!$tr, '存在未审查的触发器');
    $fk = cmRows($p,"SELECT CONSTRAINT_NAME FROM information_schema.KEY_COLUMN_USAGE WHERE (REFERENCED_TABLE_SCHEMA=DATABASE() AND REFERENCED_TABLE_NAME IN ('bets','mem','credit_log')) OR (TABLE_SCHEMA=DATABASE() AND TABLE_NAME IN ('bets','mem','credit_log') AND REFERENCED_TABLE_NAME IS NOT NULL)");
    cmAssert(!$fk, '存在未审查的外键依赖');
}
function cmSchema(PDO $p, $create) {
    $exists = cmRows($p,'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?',[CM_TABLE]);
    if (!$exists && $create) {
        // DDL 位于业务事务之前；空表不能作为迁移或补款的凭据。
        $p->exec('CREATE TABLE `' . CM_TABLE . '` (batch_id varchar(64) NOT NULL PRIMARY KEY,state varchar(20) NOT NULL,
            payload longtext NOT NULL,payload_hash char(64) NOT NULL,created_at datetime NOT NULL,
            rollback_payload longtext DEFAULT NULL,rollback_hash char(64) DEFAULT NULL,rolled_back_at datetime DEFAULT NULL)
            ENGINE=InnoDB DEFAULT CHARSET=utf8mb4');
        $exists = cmRows($p,'SELECT ENGINE FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?',[CM_TABLE]);
    }
    if (!$exists) { return false; }
    cmAssert($exists[0]['ENGINE'] === 'InnoDB', '批次表不支持事务');
    $cols = cmRows($p,'SHOW COLUMNS FROM `' . CM_TABLE . '`');
    cmAssert(array_column($cols,'Field') === ['batch_id','state','payload','payload_hash','created_at','rollback_payload','rollback_hash','rolled_back_at'], '批次表结构不符');
    $key = cmRows($p,'SHOW INDEX FROM `' . CM_TABLE . '` WHERE Non_unique=0');
    cmAssert(count($key) === 1 && $key[0]['Column_name'] === 'batch_id' && $key[0]['Key_name'] === 'PRIMARY', '批次唯一键不符');
    return true;
}
function cmLoadSource(PDO $local, PDO $target) {
    $local->setAttribute(PDO::ATTR_ERRMODE,PDO::ERRMODE_EXCEPTION);
    $local->exec('SET TRANSACTION READ ONLY'); $local->beginTransaction();
    try {
        $identity = cmIdentity($local);
        cmAssert($identity['hostname'] === 'WIN-TE63F9O7CVS' && $identity['db_name'] === 'db_client' && $identity !== cmIdentity($target), '源库身份不符');
        $colsL = cmRows($local,'SHOW COLUMNS FROM bets'); $colsR = cmRows($target,'SHOW COLUMNS FROM bets');
        $a = array_column($colsL,'Field'); $b = array_column($colsR,'Field'); sort($a); sort($b);
        cmAssert($a === $b, '源与目标注单字段集合不同');
        $rows = cmRows($local,'SELECT * FROM bets WHERE ID IN (2070,2071,2072,2074,2078,2079) ORDER BY ID'); $src = [];
        foreach ($rows as $r) { $src[(int)$r['ID']] = cmNorm($r); }
        cmSourceValidate($src); $local->rollBack();
        return ['identity'=>$identity,'rows'=>$src,'sha256'=>hash('sha256',cmJson($src))];
    } catch (Throwable $e) { if ($local->inTransaction()) { $local->rollBack(); } throw $e; }
}
function cmLog($handle, array $message) {
    $line = cmJson(['utc'=>gmdate('c')] + $message) . PHP_EOL;
    cmAssert(fwrite($handle,$line) === strlen($line) && fflush($handle), '本地审计日志写入失败');
}
function cmMain($role, $sourceFactory = null) {
    global $argv;
    $arg = $argv[1] ?? '--check';
    if (count($argv) > 2 || !in_array($arg,['--check','--dry','--apply','--self-test'],true)) {
        fwrite(STDERR,"参数错误：--check/--dry 只读，--apply 正式执行，--self-test 仅内存测试。\n"); return 2;
    }
    if ($arg === '--self-test') { try { cmSelfTest(); return 0; } catch (Throwable $e) { fwrite(STDERR,'SELF_TEST_FAILED: '.$e->getMessage()."\n"); return 1; } }
    $action = $arg === '--apply' ? ($role === 'rollback' ? 'rollback' : 'apply') : 'check';
    $p = null; $lf = null; $locked = []; $commitAttempted = false; $committed = false;
    try {
        $cfg = require dirname(__DIR__,2) . '/common/include/mysql.local.php';
        cmAssert($cfg['host'] === '202.61.84.134' && $cfg['database_c'] === 'db_client', '目标配置变化');
        $p = new PDO("mysql:host={$cfg['host']};port=3306;dbname={$cfg['database_c']};charset=utf8mb4",$cfg['username'],$cfg['password'],
            [PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC,PDO::ATTR_EMULATE_PREPARES=>false,PDO::ATTR_TIMEOUT=>10]);
        $identity = cmIdentity($p);
        cmAssert($identity === cmNorm(['hostname'=>'33612-WHQ622800','port'=>'3306','server_id'=>'1','db_name'=>'db_client']), '实际目标服务器变化');
        cmSafety($p);
        if ($action !== 'check') {
            $maintenance = cmRows($p,'SELECT website FROM cfg_default WHERE id>0 LIMIT 1');
            cmAssert(count($maintenance) === 1 && (string)$maintenance[0]['website'] === '1', '必须保持维护并停止人工调账及前台投注');
            foreach ([CM_BATCH,'cadi999_renumber_20261018_v1'] as $lockName) {
                $l = cmRows($p,'SELECT GET_LOCK(?,0) AS acquired',[$lockName]);
                cmAssert((string)$l[0]['acquired'] === '1', '另一迁移或改号正在执行'); $locked[] = $lockName;
            }
            $p->exec('SET SESSION innodb_lock_wait_timeout=5');
            $p->exec('SET SESSION lock_wait_timeout=5');
            $lf = fopen(dirname(__DIR__) . '/migrate_cadi.log','ab'); cmAssert($lf !== false, '审计日志不可写');
        }
        $exists = cmSchema($p,false);
        $prior = $exists ? cmAudit($p,$identity,false) : null;
        $source = null;
        if (!$prior && $role === 'migrate') {
            cmAssert(is_callable($sourceFactory), '缺少只读源连接'); $source = cmLoadSource($sourceFactory(),$p);
        }
        // 业务预检先于建表，不符合条件时不产生任何数据库写入。
        if (!$prior) { cmBefore($p,false); }
        if ($action === 'apply' && !$exists) { $exists = cmSchema($p,true); }
        cmSafety($p);
        $p->exec($action === 'check' ? 'SET TRANSACTION READ ONLY' : 'SET TRANSACTION ISOLATION LEVEL READ COMMITTED');
        $p->beginTransaction();
        if ($exists) { $r = cmRun($p,$action,$identity,$source); }
        else { list($members) = cmBefore($p,false); $r = ['state'=>'NOT_APPLIED','changed'=>false,'members'=>$members]; }
        if ($r['changed']) {
            cmLog($lf,['batch'=>CM_BATCH,'phase'=>'PREPARED','action'=>$action,'result'=>$r]);
            $commitAttempted = true; $p->commit(); $committed = true;
            cmLog($lf,['batch'=>CM_BATCH,'phase'=>'COMMITTED','action'=>$action,'result'=>$r]);
        } else { $p->rollBack(); }
        echo cmJson(['batch'=>CM_BATCH,'action'=>$action,'audit_table'=>CM_TABLE] + $r) . PHP_EOL;
        return 0;
    } catch (Throwable $e) {
        $state = 'NOT_COMMITTED';
        if ($committed) { $state = 'COMMITTED_POSTCHECK_FAILED'; }
        elseif ($commitAttempted) { $state = 'COMMIT_OUTCOME_UNKNOWN'; }
        elseif ($p && $p->inTransaction()) {
            try { $p->rollBack(); $state = 'TRANSACTION_ROLLED_BACK'; } catch (Throwable $ignored) { $state = 'ROLLBACK_UNCONFIRMED'; }
        }
        fwrite(STDERR,$state . ': ' . $e->getMessage() . PHP_EOL);
        fwrite(STDERR,"请保持维护，用 --check 查询实际批次。连接中断或提交后日志失败不代表已经回滚。\n"); return 1;
    } finally {
        if ($p) { foreach (array_reverse($locked) as $name) { try { cmRows($p,'SELECT RELEASE_LOCK(?)',[$name]); } catch (Throwable $ignored) {} } }
        if (is_resource($lf)) { fclose($lf); }
    }
}

/** 隔离测试只使用内存 SQLite，覆盖相同迁移与补偿内核，不连接任何业务库。 */
function cmFixture() {
    $p = new PDO('sqlite::memory:',null,null,[PDO::ATTR_ERRMODE=>PDO::ERRMODE_EXCEPTION,PDO::ATTR_DEFAULT_FETCH_MODE=>PDO::FETCH_ASSOC]);
    $p->exec('CREATE TABLE bets (ID INTEGER PRIMARY KEY AUTOINCREMENT,m_name TEXT,ticket_id TEXT,bet_time TEXT,bet_golds TEXT,mem_result TEXT,result TEXT,isResult TEXT,danger TEXT,hidden TEXT,cancel TEXT,pay_type TEXT,nid TEXT)');
    $p->exec('CREATE TABLE mem (id INTEGER PRIMARY KEY,name TEXT,nid TEXT,pay_type TEXT,credit NUMERIC,balance_credit NUMERIC)');
    $p->exec('CREATE TABLE credit_log (id INTEGER PRIMARY KEY AUTOINCREMENT,nid TEXT,s_name TEXT,ss_name TEXT,type TEXT,old_cash TEXT,new_cash TEXT,cash TEXT,usertype TEXT,logintime TEXT)');
    $p->exec('CREATE TABLE bet_mail_queue (id INTEGER PRIMARY KEY,ticket_id TEXT,status TEXT)');
    $p->exec('CREATE TABLE `' . CM_TABLE . '` (batch_id TEXT PRIMARY KEY,state TEXT,payload TEXT,payload_hash TEXT,created_at TEXT,rollback_payload TEXT,rollback_hash TEXT,rolled_back_at TEXT)');
    $source = [];
    foreach (CM_SPEC as $id=>$s) {
        $source[$id] = cmNorm(['ID'=>$id,'m_name'=>$s[0],'ticket_id'=>$s[1],'bet_time'=>$s[2],'bet_golds'=>$s[3],'mem_result'=>$s[4],
            'result'=>$s[5],'isResult'=>'1','danger'=>'3','hidden'=>'0','cancel'=>'0','pay_type'=>'1','nid'=>CM_NIDS[$s[0]]]);
    }
    foreach ([2074=>'OU92712002074',2078=>'OU92712002078',2079=>CM_OLD] as $id=>$ticket) {
        $r = $source[$id]; $r['ticket_id'] = $ticket; $r['m_name'] = $id === 2079 ? 'cadi014' : 'cadi999';
        $r['bet_time'] = $id === 2079 ? '1792293920' : $r['bet_time']; $r['bet_golds'] = '1000'; $r['result'] = 'L';
        cmInsert($p,'bets',$r); cmExec($p,'INSERT INTO bet_mail_queue VALUES (?,?,?)',[$id,CM_SPEC[$id][1],'1']);
    }
    cmExec($p,'INSERT INTO mem VALUES (?,?,?,?,?,?)',[14,'cadi014',CM_NIDS['cadi014'],'1','31873.25','31000.75']);
    cmExec($p,'INSERT INTO mem VALUES (?,?,?,?,?,?)',[15,'cadi015',CM_NIDS['cadi015'],'1','35669.50','35000.50']);
    return [$p,['identity'=>['test'=>'source'],'rows'=>$source,'sha256'=>hash('sha256',cmJson($source))]];
}
function cmTestTxn(PDO $p,$action,$source=null,$identity=['test'=>'target']) {
    $p->beginTransaction();
    try { $r = cmRun($p,$action,$identity,$source); $p->commit(); return $r; }
    catch (Throwable $e) { if ($p->inTransaction()) { $p->rollBack(); } throw $e; }
}
function cmTestState(PDO $p) {
    $out = [];
    foreach (['bets','mem','credit_log','bet_mail_queue',CM_TABLE] as $t) { $out[$t] = cmRows($p,'SELECT * FROM `' . $t . '`'); }
    return cmJson($out);
}
function cmReject(PDO $p,$action,$source=null,$identity=['test'=>'target']) {
    $before = cmTestState($p); $failed = false;
    try { cmTestTxn($p,$action,$source,$identity); } catch (Throwable $e) { $failed = true; }
    cmAssert($failed && cmTestState($p) === $before, '故障场景未拒绝或留下部分变更');
}
function cmSelfTest() {
    cmAssert(cmCents('123.45') === 12345 && cmMoney(-58000) === '-580.00', '金额换算失败');
    list($p,$src) = cmFixture(); $beforeBets = cmRows($p,'SELECT * FROM bets'); $beforeMem = cmMembers($p,false);
    cmAssert(!cmTestTxn($p,'rollback')['changed'], '未迁移时发生补款');
    cmAssert(cmTestTxn($p,'apply',$src)['changed'], '迁移失败');
    cmAssert(!cmTestTxn($p,'apply',$src)['changed'], '重复扣款');
    $after = cmMembers($p,false);
    cmAssert(cmCents($after['cadi014']['credit']) === 3129325 && cmCents($after['cadi014']['balance_credit']) === 3042075, '独立余额字段被覆盖');
    cmAssert(cmTestTxn($p,'rollback')['changed'], '回滚失败');
    cmAssert(cmMembers($p,false) === $beforeMem && cmRows($p,'SELECT * FROM bets') === $beforeBets, '业务数据未还原');
    cmAssert(count(cmRows($p,'SELECT * FROM credit_log')) === 4, '扣款或补偿流水缺失');
    cmAssert(!cmTestTxn($p,'rollback')['changed'], '重复补款'); cmReject($p,'apply',$src);
    list($p,$src) = cmFixture(); cmTestTxn($p,'apply',$src);
    $p->exec("UPDATE mem SET credit=credit-100,balance_credit=balance_credit-50 WHERE name='cadi014'");
    cmTestTxn($p,'rollback'); $m = cmMembers($p,false)['cadi014'];
    cmAssert(cmCents($m['credit']) === 3177325 && cmCents($m['balance_credit']) === 3095075, '回滚覆盖了后续正常资金变化');
    list($p,$src) = cmFixture();
    $p->exec("CREATE TRIGGER fail_insert BEFORE INSERT ON bets WHEN NEW.ticket_id='DT22712002072' BEGIN SELECT RAISE(ABORT,'fault'); END");
    cmReject($p,'apply',$src);
    list($p,$src) = cmFixture();
    $p->exec("CREATE TRIGGER fail_second_cash BEFORE UPDATE ON mem WHEN OLD.name='cadi015' BEGIN SELECT RAISE(ABORT,'fault'); END");
    cmReject($p,'apply',$src);
    list($p,$src) = cmFixture(); cmTestTxn($p,'apply',$src);
    $p->exec("UPDATE bets SET bet_golds='99' WHERE ticket_id='DT22712002070'"); cmReject($p,'rollback');
    list($p,$src) = cmFixture(); cmTestTxn($p,'apply',$src);
    $p->exec("INSERT INTO bets(m_name,ticket_id) VALUES('other','DT22712002070')"); cmReject($p,'rollback');
    list($p,$src) = cmFixture(); cmTestTxn($p,'apply',$src);
    cmReject($p,'rollback',null,['test'=>'wrong-target']);
    $p->exec('DELETE FROM `' . CM_TABLE . '`'); cmReject($p,'rollback');
    list($p,$src) = cmFixture(); cmTestTxn($p,'apply',$src);
    $p->exec('UPDATE `' . CM_TABLE . "` SET payload_hash='bad'"); cmReject($p,'rollback');
    list($p,$src) = cmFixture(); $src['rows'][2070]['isResult'] = '0'; cmReject($p,'apply',$src);
    echo "SELF_TEST_OK: isolated SQLite migration, compensation, idempotency, independent decimals, later activity, partial failures, corrupt/missing audit, identity and snapshot guards.\n";
}
