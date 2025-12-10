@echo off
echo ========================================
echo NeuroPrep AI - Windows Setup
echo ========================================
echo.

echo [1/4] Installing root dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Root installation failed
    exit /b 1
)

echo.
echo [2/4] Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Backend installation failed
    exit /b 1
)
cd ..

echo.
echo [3/4] Installing frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Frontend installation failed
    exit /b 1
)
cd ..

echo.
echo [4/4] Verifying installation...
call npm list concurrently --depth=0 >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing missing concurrently...
    call npm install concurrently --save-dev
)

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Configure .env files (see QUICK_START.md)
echo 2. Run: npm run dev
echo.
