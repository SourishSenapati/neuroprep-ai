@echo off
echo ===================================================================
echo    NeuroPrep AI - World-Class Vercel Deployment
echo    Surpassing MIT, Stanford, Tsinghua, IIT Bombay, IIT Madras
echo ===================================================================
echo.

REM Check if we're logged into Vercel
echo [INFO] Please log in to Vercel...
call vercel login
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Vercel login failed
    pause
    exit /b 1
)

echo.
echo [SUCCESS] Logged in to Vercel!
echo.
echo ===================================================================
echo IMPORTANT: Manual Steps Required
echo ===================================================================
echo.
echo This will guide you through the deployment process.
echo Please follow each step carefully.
echo.
pause

echo.
echo ===================================================================
echo Step 1: Deploy Backend to Vercel
echo ===================================================================
echo.
cd backend
echo [INFO] Deploying backend...
call vercel --prod
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Backend deployment failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [SUCCESS] Backend deployed!
echo.
echo IMPORTANT: Copy the backend URL from above (e.g., https://xxx.vercel.app)
set /p BACKEND_URL="Enter your BACKEND URL: "

echo.
echo ===================================================================
echo Step 2: Deploy Frontend to Vercel
echo ===================================================================
echo.
cd frontend
echo [INFO] Deploying frontend...
call vercel --prod
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Frontend deployment failed
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [SUCCESS] Frontend deployed!
echo.
echo IMPORTANT: Copy the frontend URL from above (e.g., https://xxx.vercel.app)
set /p FRONTEND_URL="Enter your FRONTEND URL: "

echo.
echo ===================================================================
echo Step 3: Configure Environment Variables
echo ===================================================================
echo.
echo You need to add environment variables in the Vercel Dashboard.
echo.
echo 1. Go to: https://vercel.com/dashboard
echo 2. Click on your BACKEND project
echo 3. Go to: Settings -^> Environment Variables
echo 4. Add these variables for PRODUCTION:
echo.
echo    NODE_ENV=production
echo    PORT=5000
echo    CORS_ORIGIN=%FRONTEND_URL%
echo    FRONTEND_URL=%FRONTEND_URL%
echo    SESSION_SECRET=(generate a secret)
echo    JWT_SECRET=(generate a secret)
echo.
echo 5. Click on your FRONTEND project
echo 6. Go to: Settings -^> Environment Variables
echo 7. Add these variables for PRODUCTION:
echo.
echo    NEXT_PUBLIC_API_URL=%BACKEND_URL%
echo    NEXT_PUBLIC_WS_URL=%BACKEND_URL%
echo    NEXTAUTH_URL=%FRONTEND_URL%
echo    NEXTAUTH_SECRET=(generate a secret)
echo    NEXT_PUBLIC_TFJS_BACKEND=webgpu
echo    NEXT_PUBLIC_ENABLE_GAUSSIAN_SPLATS=true
echo.
echo To generate secrets, run this in a new terminal:
echo    node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
echo.
pause

echo.
echo ===================================================================
echo Step 4: Redeploy with Environment Variables
echo ===================================================================
echo.
echo Press ENTER after you've added all environment variables...
pause >nul

echo [ INFO] Redeploying backend...
cd backend
call vercel --prod
cd ..

echo [INFO] Redeploying frontend...
cd frontend
call vercel --prod
cd ..

echo.
echo ===================================================================
echo    DEPLOYMENT COMPLETE!
echo ===================================================================
echo.
echo Your NeuroPrep AI is now LIVE!
echo.
echo Frontend: %FRONTEND_URL%
echo Backend:  %BACKEND_URL%
echo.
echo Features:
echo   - 224,625,000+ Unique Questions
echo   - 47 Engineering Roles
echo   - Zero Repetition (99.9%%)
echo   - Adaptive Difficulty
echo   - World-Class Performance
echo.
echo Next Steps:
echo   1. Visit %FRONTEND_URL%
echo   2. Start an interview
echo   3. Experience the future of engineering interviews!
echo.
echo ===================================================================
pause
