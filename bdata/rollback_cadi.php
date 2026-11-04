<?php
/**
 * 六笔历史迁移 v3 的精确补偿入口。默认/--dry 只读；--apply 正式回滚。
 * 从已提交批次读取六笔目标ID、完整快照和两个余额字段的实际扣额。
 * 删除本批次新增注单、恢复生产 ID2079 原号、按实际差额补款，并追加回退流水。
 * cadi999 两笔独立改号不在本次补偿范围。后续已修改的迁入订单不会被强制覆盖。
 * 数据库不可达或提交结果未知时明确报错，不虚报回滚成功。
 */
if (PHP_SAPI !== 'cli') { http_response_code(403); exit('Forbidden'); }
require_once __DIR__ . '/include/CadiMigration.php';
exit(cmMain('rollback'));
