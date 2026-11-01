@echo off
cd /d "%~dp0"
echo Starting portfolio at http://localhost:5173
echo Keep this window open while using the local preview.
call npm.cmd run dev
pause
