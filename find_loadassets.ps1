# find_loadassets.ps1 - 只读取证: www.aoyu365.com/load_assets.php 404 根因
# 用法: 在服务器上右键"使用 PowerShell 运行", 或双击同目录 find_loadassets.bat
# 输出: 同目录 find_loadassets_result.txt (跑完把该文件内容发回来)
$ErrorActionPreference = 'Continue'
$out = Join-Path $PSScriptRoot 'find_loadassets_result.txt'
"===== load_assets.php 404 forensic, run at $(Get-Date) =====" | Out-File $out -Encoding utf8
function W($s) { $s | Out-File $out -Append -Encoding utf8 }

# [1] 全盘搜索 load_assets*.php
W ""
W "===== [1] search load_assets*.php ====="
foreach ($root in 'D:\wwwroot3','D:\BtSoft','E:\BtSoft','C:\inetpub','D:\www') {
    if (Test-Path $root) {
        W "  [scan] $root"
        Get-ChildItem -Path $root -Recurse -Filter 'load_assets*.php' -File -ErrorAction SilentlyContinue |
            ForEach-Object { W ("  FOUND: {0}  size={1}  mtime={2}" -f $_.FullName, $_.Length, $_.LastWriteTime) }
    }
}

# [2] 找 nginx vhost 中 aoyu365 站点配置(拿到站点根目录)
W ""
W "===== [2] nginx vhost conf containing aoyu365 ====="
$roots = @()
foreach ($vh in 'D:\BtSoft\nginx\conf\vhost','E:\BtSoft\nginx\conf\vhost') {
    if (Test-Path $vh) {
        Get-ChildItem $vh -Filter *.conf -ErrorAction SilentlyContinue | ForEach-Object {
            $hit = Select-String -Path $_.FullName -Pattern 'aoyu365' -SimpleMatch -ErrorAction SilentlyContinue
            if ($hit) {
                W "  CONF: $($_.FullName)"
                $hit | ForEach-Object { W ("    L{0}: {1}" -f $_.LineNumber, $_.Line.Trim()) }
                Select-String -Path $_.FullName -Pattern '^\s*root\s+(.+);' | ForEach-Object {
                    $roots += $_.Matches[0].Groups[1].Value.Trim()
                    W ("    ROOT: " + $_.Matches[0].Groups[1].Value.Trim())
                }
            }
        }
    } else { W "  (skip, not exists: $vh)" }
}

# [3] 列出站点根目录文件清单与修改时间(看 load_assets.php 是否在、10-09 前后谁被动过)
W ""
W "===== [3] site root listing (top level) ====="
foreach ($r in ($roots | Select-Object -Unique)) {
    $rp = $r.Trim('"')
    if (Test-Path $rp) {
        W "  [dir] $rp"
        Get-ChildItem -Path $rp -Force -ErrorAction SilentlyContinue |
            Sort-Object LastWriteTime -Descending | Select-Object -First 40 |
            ForEach-Object { W ("    {0}  {1,10}  {2}" -f $_.LastWriteTime, $_.Length, $_.Name) }
    } else { W "  [dir missing] $rp" }
}

# [4] nginx 日志中 load_assets 的时间线(最早出现/404占比/最近样本)
W ""
W "===== [4] nginx access logs: load_assets timeline ====="
foreach ($lg in 'D:\BtSoft\nginx\logs','E:\BtSoft\nginx\logs') {
    if (Test-Path $lg) {
        $logs = Get-ChildItem $lg -Filter 'access*.log' -ErrorAction SilentlyContinue | Sort-Object Name
        W "  [logdir] $lg  files=$($logs.Count)"
        foreach ($f in $logs) {
            $hits = Select-String -Path $f.FullName -Pattern 'load_assets' -ErrorAction SilentlyContinue
            if ($hits) {
                $c404 = ($hits | Where-Object { $_.Line -match '"\s*404\s' }).Count
                W ("  {0}: total={1} 404={2}" -f $f.Name, $hits.Count, $c404)
                W ("    FIRST: " + $hits[0].Line)
                W ("    LAST : " + $hits[$hits.Count-1].Line)
            }
        }
        # 最新日志尾部 20 行 load_assets 样本
        $newest = $logs | Select-Object -Last 1
        if ($newest) {
            W "  [tail 20 of $($newest.Name)]"
            Select-String -Path $newest.FullName -Pattern 'load_assets' -ErrorAction SilentlyContinue |
                Select-Object -Last 20 | ForEach-Object { W "    " + $_.Line }
        }
    }
}

W ""
W "===== DONE ====="
Get-Content $out
