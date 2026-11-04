# 维护配置功能交接文档（FastAdmin 迁移版）

> 交接日期：2026-10-19
> 功能范围：会员站"系统维护"提示的配置与开关
> 目标：在新的 FastAdmin（ThinkPHP 5.x）项目里加一个配置项，通过远程数据库连接现有生产库，保存后让维护真正生效

---

## 1. 一句话结论

维护开关的真实落点是远程库 **`db_client`.`cfg_default` 表 `id=1` 这一行**：
- `website=1` → 会员站进入维护（弹维护提示）
- `website=0` → 会员站正常访问

新端（FastAdmin）只要能正确 UPDATE 这一行并校验生效，就能完整接管维护开关。**不要去写 `cfg` 表**（原因见第 4 节）。

> **日常开关维护的标准操作**：直接按第 8 节 SOP 执行（三步 SQL + 回读验证，均为生产实操验证过的原样语句）；FastAdmin 开发完成后由页面替代手工 SQL，但验证方法不变。

---

## 2. 数据库事实

### 2.1 连接信息

| 项 | 值 |
|---|---|
| MySQL 地址 | `202.61.84.134:3306`（远程） |
| 库名 | `db_client` |
| 用户名/密码 | 与现生产一致，取自 `d:\wwwroot3\common\include\mysql.local.php`（本文档不落密码明文） |
| 权限现状 | 该账号对 `db_client.cfg_default` 有 SELECT/UPDATE（已实测 UPDATE 影响 1 行成功） |

**新环境接入前置条件**：远程 MySQL 只对已授权 IP 开放。新工厂服务器 IP 需要先在 MySQL 侧授权（`GRANT SELECT, UPDATE ON db_client.cfg_default TO '用户'@'新IP'`），建议只授这一张表的权限，不要整库。

### 2.2 表结构（`db_client.cfg_default`，实测 SHOW COLUMNS）

| 字段 | 类型 | 说明 |
|---|---|---|
| id | tinyint(10) | 恒为 1，全表只有这一行有效 |
| **website** | int(11) | **维护开关：1=维护中，0=正常**。会员端 `service_mainget` 的 `maintain_sw` 据此返回 Y/N |
| **isrg** | int(11) | 人工维护标记。手动开关时与 website 同值（1/1 或 0/0）；`isrg=0` 的行会被采集脚本视为"可自动改写"（见 7.3） |
| **webstr** | varchar(100) NOT NULL | 维护时间窗展示文本，格式严格为 `YYYY-MM-DD HH:MM:SS~HH:MM:SS`（如 `2026-10-18 13:15:00~14:30:00`） |
| **webend** | varchar(100) NULL | 旧后台"维护时间【结束】"输入框的值，**客户端不消费**，仅回显/预留 |
| isgoogle / google_code | int / varchar(64) | 登录谷歌验证开关，与本功能无关，**勿动** |
| m_min…fs_max 等 | int | 单注限额，与本功能无关，**勿动** |

### 2.3 当前值快照（2026-10-18 实测）

```
id=1, website=0（正常）, isrg=0,
webstr='2026-10-18 13:15:00~14:30:00',
webend='2026-10-18 13:15:00~14:30:00'
```

---

## 3. 会员端生效链路（接手后必须知道的）

### 3.1 谁在读维护状态

| 文件 | 位置 | 用途 |
|---|---|---|
| member/transform.php | L50-84 | `p=service_mainget` 接口，**主通道**，返回 code=619 + maintain_sw/maintain_time |
| member/transform_nl.php | L51 起 | 同接口的副本 |
| member/index.php | L4-11 | 首屏注入 `top.maintain_sw`（注意：模板内无消费点，实际无效字段） |
| agents/index.php | L5 起 | 代理后台维护页（website=1 时加载 maintain.html） |
| agents/app/showMaintain.php | L6 起 | 代理端维护时间输出 |

### 3.2 生效时机（重要）

- 前端维护检查挂在 `SerTimer` 轮询里：`CONFIG_FIX_CLEAN_N = 60 × 1000ms`，且 `setInterval` 首次触发要等一个完整周期 → **开关变更后最长约 60 秒才在会员端体现**。
- 服务端**只认 `website` 开关，不校验 `webstr` 时间窗**：14:30 到了不会自动结束维护，必须手动把 website 改回 0。
- `webstr` 只用于弹窗里展示文字，不参与任何逻辑判断。

### 3.3 接口响应样例（验证用）

```
POST /transform.php
p=service_mainget&login=N&langx=zh-cn

<?xml version="1.0" encoding="UTF-8"?>
<serverresponse><code>619</code><urgent_sw></urgent_sw><emergency_sw>N</emergency_sw>
<maintain_sw>Y</maintain_sw><maintain_time>2026-10-18 13:15:00~14:30:00</maintain_time>
<clean_data_sw>N</clean_data_sw>…</serverresponse>
```

`maintain_sw=Y` 即维护生效中。注意：uid 校验失败时该接口会被覆盖成 `error/doubleLogin`（transform.php L75-82），所以验证时用 `login=N` 的无登录参数最稳。

---

## 4. 为什么旧后台"保存成功"却不生效（别在新端复现）

旧后台 `common/contorller/admin/Account.php::setting_edit()`（L3325-3337）的写表逻辑：

```php
$where = "`id`=1";
if($this->login_layer==Constant::AD){          // 公司层登录
    $connTable = Constant::T_CONFIG;           // → 写 cfg 表
    $where = "`nid`='{$this->sup["nid"]}'";    // 16 位主账号 nid
}
$this->dbc->update($connTable,$update,$where); // 不校验受影响行数
$this->dbc->commit();
$this->insertLog("系统设置->维护设置->修改成功!");  // 0 行也记成功
```

两个坑：
1. **写错表**：公司层写 `cfg`，条件 `nid=16位`，而 `cfg.nid` 实际存 32 位 → UPDATE 影响 0 行；会员端只读 `cfg_default`，配置永远到不了客户端。
2. **假成功**：`mysqldb::update()` 只返回 execute 布尔（不返回 rowCount），0 行更新照样 commit + 记成功日志 + 返回 success。

**新端铁律**：只写 `cfg_default WHERE id=1`；UPDATE 后必须回读校验生效（见 5.3）。

---

## 5. FastAdmin 实现方案

### 5.1 总体思路

在 FastAdmin 后台加一个"维护配置"页面：读 `cfg_default` id=1 → 表单编辑（开关 + 时间窗）→ UPDATE 远程表 → 回读校验 → 展示实际生效值。不使用 FastAdmin 自带的 `fa_config`（那是本地表），直接远程连接操作目标表。

### 5.2 数据库连接（ThinkPHP 5.x）

`application/database.php` 增加独立连接（凭据建议放 `.env`，不要提交 git）：

```php
// database.php 的 connections 数组里追加
'remote_maintain' => [
    'type'     => 'mysql',
    'hostname' => '202.61.84.134',
    'database' => 'db_client',
    'username' => Env::get('remote.db_user', ''),
    'password' => Env::get('remote.db_pass', ''),
    'hostport' => '3306',
    'charset'  => 'utf8',
    // 生产库，禁用部署同步类操作
    'deploy'   => 0,
],
```

### 5.3 控制器骨架（核心：写对表 + 回读校验）

```php
<?php
// application/admin/controller/Maintain.php
namespace app\admin\controller;
use app\common\controller\Backend;
use think\Db;

class Maintain extends Backend
{
    private function remote()
    {
        return Db::connect('remote_maintain');
    }

    public function index()
    {
        $row = $this->remote()->table('cfg_default')->where('id', 1)->find();
        $this->assign('row', $row);
        return $this->view->fetch();
    }

    public function save()
    {
        $params  = $this->request->post();
        $website = intval($params['website']) === 1 ? 1 : 0;
        $webstr  = trim($params['webstr']);
        $webend  = trim($params['webend']);

        // 与生产后台同一条格式正则，必须保持一致
        $pattern = '/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s(0\d|1[0-9]|2[0-3]):[0-5]\d:[0-5]\d~(0\d|1[0-9]|2[0-3]):[0-5]\d:[0-5]\d$/';
        if ($website === 1 && !preg_match($pattern, $webstr)) {
            $this->error('维护时间格式必须为 YYYY-MM-DD HH:MM:SS~HH:MM:SS');
        }

        // 铁律：只写 cfg_default WHERE id=1；isrg 与 website 同值
        $this->remote()->table('cfg_default')->where('id', 1)->update([
            'webstr'  => $webstr,
            'webend'  => $webend !== '' ? $webend : null,
            'website' => $website,
            'isrg'    => $website,
        ]);

        // 铁律：UPDATE 后回读校验（rowCount=0 无法区分"没改"与"失败"，一律以回读为准）
        $row = $this->remote()->table('cfg_default')->where('id', 1)->find();
        if (intval($row['website']) !== $website || $row['webstr'] !== $webstr) {
            $this->error('保存未生效！请检查远程库连接、权限（是否只授了 SELECT）');
        }

        // 建议自带审计日志（旧库 ad_record 不适用新端）
        \think\Log::record('maintain save: website=' . $website . ' webstr=' . $webstr);
        $this->success($website === 1 ? '已开启维护' : '已关闭维护', null, $row);
    }
}
```

视图（`application/admin/view/maintain/index.html`）做三个控件即可：开关（1/0 单选或 switch）、`webstr` 文本框（placeholder 显示格式）、`webend` 文本框（可留空），提交到 `maintain/save`。FastAdmin 自带权限节点（`maintain/index`、`maintain/save`）记得在权限管理里分配。

### 5.4 可选增强（强烈建议）

1. **一键开/关按钮**：比 radio 更不易误操作。
2. **到期自动关闭**：服务端不看时间窗，可在 FastAdmin 侧加一个每分钟的定时任务（crontab 或 tp5 command），解析 `webstr` 的结束时刻，到点自动 `website=0, isrg=0`。注意只处理 `isrg=1`（人工开启）的行，别动 `isrg=0`（自动维护，见 7.3）。
3. **保存前显示当前线上状态**：避免多人/多端同时操作导致状态误判。

### 5.5 给新工程的对接要点（自包含说明，可整段复制给对方开发）

**目标**：连接远程 MySQL `2026.61.84.134:3306`（凭据见 2.1），库 `db_client`，表 `cfg_default`，**只更新 `id=1` 这一行**。

**可更新字段（仅以下四个，同表其他字段勿动）**：

| 字段 | 类型 | 取值 | 说明 |
|---|---|---|---|
| website | int(11) | 1=维护中 / 0=正常 | 维护总开关，会员端只认这个字段 |
| isrg | int(11) | 与 website 同值 | 人工维护标记（开启时=1，关闭时=0） |
| webstr | varchar(100) | 文本 | 维护时间窗（展示用），格式见下 |
| webend | varchar(100) | 文本 | 后台"结束时间"回显字段，与 webstr 写同值即可，客户端不消费 |

**时间日期格式（重点，最容易搞错）**：

- `webstr` / `webend` 是**一个字符串字段，不是 datetime 类型，也不是开始/结束两个字段**；存的是一整段时间窗的文本。
- 格式：`YYYY-MM-DD HH:MM:SS~HH:MM:SS`，用**半角波浪号 `~` 分隔**，波浪号两边不能有空格：
  - 开始段：完整日期 + 时间，如 `2026-10-18 13:15:00`
  - 结束段：**只有时间不带日期**，如 `14:30:00`
- 示例：`2026-10-18 13:15:00~14:30:00`（表示 2026-10-18 的 13:15 至 14:30）
- 保存前必须用生产同款正则校验（格式不对必须拒收）：
```php
$pattern = '/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])\s(0\d|1[0-9]|2[0-3]):[0-5]\d:[0-5]\d~(0\d|1[0-9]|2[0-3]):[0-5]\d:[0-5]\d$/';
```
- 常见错误写法（都不匹配正则，会被拒）：`13:15~14:30`（缺日期缺秒）、`2026-10-18 13:15:00 ~ 14:30:00`（波浪号两边多了空格）、`2026-10-18 13:15:00~2026-10-18 14:30:00`（结束段不能带日期）。

**SQL 实例（2026-10-18 生产实操、验证生效的原样语句；换时间时只改 webstr/webend 两个值）**：

① 设置维护时间（不开启，不影响线上）：
```sql
UPDATE `cfg_default`
SET `webstr`='2026-10-18 13:15:00~14:30:00',
    `webend`='2026-10-18 13:15:00~14:30:00',
    `website`=0,
    `isrg`=0
WHERE `id`=1;
```

② 开启维护：
```sql
UPDATE `cfg_default` SET `website`=1, `isrg`=1 WHERE `id`=1;
```

③ 关闭维护：
```sql
UPDATE `cfg_default` SET `website`=0, `isrg`=0 WHERE `id`=1;
```

④ 回读验证（每次 UPDATE 后必做，库值对不上 = 没生效）：
```sql
SELECT `id`,`website`,`isrg`,`webstr`,`webend` FROM `cfg_default` WHERE `id`=1;
```

（注：以上按连接时已选中 `db_client` 库的写法；若客户端未指定库，表名写 `db_client`.`cfg_default`。）

**场景 → 字段值对照表（新工程界面按钮按此映射）**：

| 场景 | website | isrg | webstr / webend |
|---|---|---|---|
| 只配时间不开启 | 0 | 0 | 写入新时间串（两字段同值） |
| 开启维护 | 1 | 1 | 不动（用现有值） |
| 关闭维护 | 0 | 0 | 不动（保留旧值，不影响访问） |

**生效与验证**：会员端约 60 秒内体现；接口验证 `POST p=service_mainget&login=N&langx=zh-cn` 看 `maintain_sw`（Y=维护中/N=正常）；服务端只看 website 不看时间窗，到期需手动关闭。

---

## 6. 验证清单（每次变更后照做）

1. **SQL 回读**：`SELECT id,website,isrg,webstr,webend FROM db_client.cfg_default WHERE id=1;` → website 与预期一致。
2. **接口验证**（无副作用，可反复执行）：
   ```
   curl -s -X POST "https://www.aoyu365.com/transform.php" --data "p=service_mainget&login=N&langx=zh-cn"
   ```
   看 `maintain_sw`：Y=维护中，N=正常。
3. **会员端观察**：开关变更后等满 60 秒再下结论（SerTimer 首检周期），必要时刷新页面。

---

## 7. 风险与注意事项

### 7.1 权限与安全
- 新环境直连生产库：只授 `cfg_default` 的 SELECT/UPDATE；不要整库、不要 DROP/ALTER。
- FastAdmin 后台页面走登录 + 权限节点；凭据放 `.env` 不进 git。
- 禁止做"任意 SQL 执行"类工具。

### 7.2 误操作面（同表无关字段）
`cfg_default` 同表还有单注限额（m_min/fs_max 等）和谷歌验证（isgoogle/google_code），新端表单只提交维护相关四个字段，UPDATE 不要用 `Db::table(...)->save($row)` 整行覆盖。

### 7.3 生产侧耦合点
- `bdata/uid-1.php`（L70/86/90）会按上游返回的维护状态自动改写 `cfg_default.website`，它只改 `isrg=0` 的行。当前该脚本未运行（bat.txt 只调度 uid.bat，uid.php 第 2 行 exit）；若将来恢复，会与新端手动开关互相覆盖——届时需二选一：新端写入时恒置 `isrg=1`（人工值，脚本不动）。
- 旧 admin 后台的"维护设置"保存仍是假成功（写 cfg 表 0 行），上线新端后建议告知所有操作员**弃用旧后台维护页**，避免双向写造成状态混乱。

### 7.4 客户端体验限制（本期不改，知悉即可）
- 变更最长 60 秒后才在会员端体现（首屏注入的 `top.maintain_sw` 无消费点，不构成即时通道）。
- 维护期间 uid 已失效的老会话收到的是 doubleLogin 而非维护提示（transform.php L75-82 覆盖逻辑）。

---

## 8. 标准操作 SOP（以下 SQL 全部为 2026-10-18 生产实操、验证生效的原样语句）

> **以后设置维护就按本节格式执行**：三步走，每步执行后必须做回读验证。操作库 `db_client`（远程 202.61.84.134:3306），操作表 `cfg_default`，**只动 `id=1` 这一行**。
> 注：以下 SQL 按连接时已选中 `db_client` 库的写法（与上次实际执行一致）；若客户端未指定库，表名写成 `db_client`.`cfg_default`。

### 8.1 第一步：设置维护时间（先不开启，不影响线上）

```sql
UPDATE `cfg_default`
SET `webstr`='2026-10-18 13:15:00~14:30:00',
    `webend`='2026-10-18 13:15:00~14:30:00',
    `website`=0,
    `isrg`=0
WHERE `id`=1;
```

- 改时间窗只需改 `webstr` / `webend` 两个值（保持同值），格式必须严格 `YYYY-MM-DD HH:MM:SS~HH:MM:SS`。
- 此时 `website=0`，会员站不受任何影响。

**回读验证**（预期返回 1 行，website=0，webstr 为新写入的时间）：

```sql
SELECT `id`,`website`,`isrg`,`webstr`,`webend` FROM `cfg_default` WHERE `id`=1;
```

### 8.2 第二步：开启维护（确认要挂维护时执行）

```sql
UPDATE `cfg_default` SET `website`=1, `isrg`=1 WHERE `id`=1;
```

**回读验证**（预期 website=1, isrg=1）：

```sql
SELECT `id`,`website`,`isrg`,`webstr`,`webend` FROM `cfg_default` WHERE `id`=1;
```

**接口验证**（无副作用，可反复执行，预期返回 `maintain_sw=Y`）：

```
curl -s -X POST "https://www.aoyu365.com/transform.php" --data "p=service_mainget&login=N&langx=zh-cn"
```

预期响应片段：
```xml
<code>619</code><maintain_sw>Y</maintain_sw><maintain_time>2026-10-18 13:15:00~14:30:00</maintain_time>
```

（本机测试也可用 `http://127.0.0.1/transform.php`，与线上等价。）

### 8.3 第三步：关闭维护（恢复访问）

```sql
UPDATE `cfg_default` SET `website`=0, `isrg`=0 WHERE `id`=1;
```

**回读验证**（预期 website=0, isrg=0；`webstr`/`webend` 保留旧时间值不影响访问，下次开启可直接复用或先按 8.1 改时间）：

```sql
SELECT `id`,`website`,`isrg`,`webstr`,`webend` FROM `cfg_default` WHERE `id`=1;
```

**接口验证**（预期返回 `maintain_sw=N`）：

```
curl -s -X POST "https://www.aoyu365.com/transform.php" --data "p=service_mainget&login=N&langx=zh-cn"
```

### 8.4 操作铁律（与上文风险项一致，执行前必读）

1. **只写 `cfg_default` 表**，绝不写 `cfg` 表（写了就是 0 行无效更新）。
2. **只动 `id=1`**，同表的限额（m_min/fs_max 等）与谷歌验证（isgoogle/google_code）字段不在本 SQL 范围内，勿改。
3. **服务端只认 `website` 开关、不校验时间窗**：到 14:30 不会自动结束维护，必须手动执行 8.3 关闭。
4. 会员端最长约 **60 秒**后才体现开关变化（前端轮询周期），验证时等满 60 秒再下结论。
5. 每条 UPDATE 后**必须**执行对应的 SELECT 回读：库值对不上 = 没生效，立刻停下排查连接/权限，不要相信"执行没报错就是成功"。

---

## 9. 生产端相关文件索引（如需回查）

| 文件 | 作用 |
|---|---|
| common/contorller/admin/Account.php | 旧后台保存（setting_edit L3241-3354，假成功所在地）/ 回显（upperConf L5282-5325） |
| common/class/mysqldb.php L170-203 | update() 只返回布尔，不返回受影响行数 |
| common/class/Constant.php L31-32 | T_CONFIG=`db_client.cfg`，T_CONFIG_DEFAULT=`db_client.cfg_default` |
| member/transform.php L50-84 | service_mainget 主通道（含 doubleLogin 覆盖逻辑） |
| member/html/index&*.html 内嵌 JS | SerTimer 轮询（CONFIG_FIX_CLEAN_N=60×1000）、619 响应处理 |
| admin/js/setting/setting_system.js L185-262 | 旧后台维护保存前端（success 即提示，不回读） |
