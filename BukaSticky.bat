@echo off
cd /d "%~dp0"
start "" /min cmd /c "npm run dev"
timeout /t 4 >nul
start chrome --app="http://localhost:5173"
exit