@echo off
rem ============================================================
rem  betmail.bat - bet mail notify daemon launcher (hidden window)
rem  Normal start (double-click / BAT.exe): window hides itself.
rem    betmail.bat stop   - kill hidden daemon (php + host cmd)
rem    betmail.bat debug  - run visible in a console window
rem    betmail.bat once   - single round, visible
rem ============================================================
if /i "%~1"=="stop" goto :stop
if /i "%~1"=="debug" goto :debug
if /i "%~1"=="once" goto :once
if "%~1"=="__hidden__" goto :run

rem ---- guard: BAT.exe restarts this bat hourly; skip if daemon already alive ----
powershell -NoProfile -Command "if (Get-CimInstance Win32_Process -Filter \"Name='php.exe'\" | Where-Object { $_.CommandLine -like '*betmail.php*' }) { exit 1 }"
if errorlevel 1 exit /b

rem ---- relaunch self in a fully hidden window ----
wscript.exe "%~dp0betmail_hidden.vbs" "%~f0"
exit /b

:run
cd /d "%~dp0"
chcp 65001 >nul
title betmail daemon
:loop
php ../betmail.php start
rem auto-revive if php exits unexpectedly (5s cooldown)
ping -n 6 127.0.0.1 >nul
goto :loop

:debug
cd /d "%~dp0"
chcp 65001 >nul
title betmail daemon (debug, visible)
php ../betmail.php start
pause
exit /b

:once
cd /d "%~dp0"
chcp 65001 >nul
title betmail daemon (once)
php ../betmail.php once
pause
exit /b

:stop
powershell -NoProfile -Command "Get-CimInstance Win32_Process | Where-Object { ($_.Name -eq 'php.exe' -and $_.CommandLine -like '*betmail.php*') -or ($_.Name -eq 'cmd.exe' -and $_.CommandLine -like '*betmail.bat*__hidden__*') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }"
echo betmail daemon stopped.
pause
exit /b
