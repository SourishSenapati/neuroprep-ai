@echo off
echo ===================================
echo NeuroPrep AI - Vercel Deployment
echo ===================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel CLI not found. Installing...
    npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Failed to install Vercel CLI
        exit /b 1
    )
)

echo [OK] Vercel CLI found
echo.

REM Login to Vercel
echo Step 1: Logging in to Vercel...
vercel login
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Failed to login
    exit /b 1
)

echo.
echo ===================================
echo Deploying Backend
echo ===================================
cd backend

echo [INFO] Deploying backend to production...
vercel --prod
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend deployment failed
    cd ..
    exit /b 1
)

echo [OK] Backend deployed successfully
cd ..

echo.
echo ===================================
echo Deploying Frontend
echo ===================================
cd frontend

echo [INFO] Deploying frontend to production...
vercel --prod
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend deployment failed
    cd ..
    exit /b 1
)

echo [OK] Frontend deployed successfully
cd ..

echo.
echo ===================================
echo Deployment Complete!
echo ===================================
echo.
echo NEXT STEPS:
echo 1. Copy your backend URL from the deployment output
echo 2. Go to Vercel dashboard: https://vercel.com/dashboard
echo 3. Update frontend environment variables:
echo    - NEXT_PUBLIC_API_URL = your-backend-url
echo    - NEXT_PUBLIC_WS_URL = your-backend-url
echo 4. Update backend environment variable:
echo    - CORS_ORIGIN = your-frontend-url
echo 5. Redeploy both frontend and backend
echo.
echo For detailed instructions, see VERCEL_DEPLOYMENT.md
echo.
pause
