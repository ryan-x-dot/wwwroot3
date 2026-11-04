@echo off
rem 一键运行取证: www.aoyu365.com load_assets.php 404 (全只读)
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0find_loadassets.ps1"
pause
