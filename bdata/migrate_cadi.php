<?php
/**
 * 六笔历史注单迁移 v3。默认只读，--dry 也只读，--apply 才正式提交。
 * 迁移已结算快照，不重新下注或开奖；生产 ID2079 改号为 OU92712002079。
 * 两会员分别按当前 credit/balance_credit 补扣净额，资金流水和恢复凭证同事务保存。
 * --self-test 仅在内存 SQLite 测试，不连接源库或生产库。
 * 回滚：php rollback_cadi.php --apply；回滚不依赖旧库，并保留历史资金审计。
 */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit('Forbidden'); }
require_once __DIR__ . '/include/CadiMigration.php';
// 源凭据沿用旧脚本已有配置，只在需要读取旧库时创建连接；禁止作为写入目标。
$sourceFactory = static function () {
    return new PDO('mysql:host=127.0.0.1;dbname=db_client;charset=utf8mb4', 'root', '597db5081fd2', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
        PDO::ATTR_TIMEOUT => 10,
    ]);
};
if (defined('CM_SOURCE_CONFIG_ONLY') && CM_SOURCE_CONFIG_ONLY) { return $sourceFactory; }
exit(cmMain('migrate', $sourceFactory));
