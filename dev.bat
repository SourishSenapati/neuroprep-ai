@echo off
echo ==========================================
echo      NeuroPrep AI - Auto Launcher
echo ==========================================
echo.

echo [1/3] Verifying dependencies...
call npm install
echo Dependencies checked.
echo.

echo [2/3] Starting Backend Server...
start "NeuroPrep Backend" cmd /k "npm run dev --workspace=backend"
echo Backend launching in new window...
echo.

echo Waiting for backend to warm up...
timeout /t 5 >nul

echo [3/3] Starting Frontend Server...
start "NeuroPrep Frontend" cmd /k "npm run dev --workspace=frontend"
echo Frontend launching in new window...
echo.

echo ==========================================
echo      Launch Complete!
echo ==========================================
echo.
echo Please wait a moment for the servers to start.
echo Then open: http://localhost:3000
echo.
pause
