@echo off
echo ========================================
echo    NeuroPrep AI - Starting System
echo ========================================

echo.
echo [1/4] Installing dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install root dependencies
    pause
    exit /b 1
)

echo.
echo [2/4] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [3/4] Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo [4/4] Starting development servers...
cd ..

echo.
echo ========================================
echo    NeuroPrep AI System Ready!
echo ========================================
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:3001
echo Health:   http://localhost:3001/health
echo.
echo Press Ctrl+C to stop servers
echo ========================================

call npm run dev