@echo off
chcp 65001 >nul
title Bang diem bong ro - vMix / OBS
cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo  [!] Chua cai Node.js tren may.
  echo      Hay tai va cai ban LTS tai: https://nodejs.org
  echo      Cai xong, chay lai file nay.
  echo.
  pause
  exit /b
)

echo.
echo  ============================================================
echo    BANG DIEM BONG RO dang chay!
echo    - Bang diem (them vao vMix/OBS): http://localhost:8000/scoreboard
echo    - Bang dieu khien (bam diem)   : http://localhost:8000/control
echo.
echo    GIU CUA SO NAY MO trong suot buoi live.
echo    Dong cua so = tat bang diem.
echo  ============================================================
echo.

node server.js
echo.
echo  (Server da dung.) Nhan phim bat ky de dong.
pause >nul
