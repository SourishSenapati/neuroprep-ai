@echo off
echo ========================================
echo NeuroPrep AI - Vercel Deployment Script
echo ========================================
echo.

echo [INFO] Checking current directory...
cd /d "%~dp0"
echo Current directory: %CD%
echo.

echo [STEP 1] Verifying repository status...
git status
echo.

echo [STEP 2] Building frontend locally to verify...
cd frontend
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed! Fix errors before deploying.
    pause
    exit /b 1
)
cd ..
echo [SUCCESS] Build passed!
echo.

echo [STEP 3] Pushing to GitHub...
git add .
git commit -m "deploy: Production deployment - %date% %time%"
git push origin main
echo.

echo ========================================
echo DEPLOYMENT INSTRUCTIONS
echo ========================================
echo.
echo Your code has been pushed to GitHub.
echo.
echo CRITICAL: Update Vercel Settings FIRST:
echo 1. Go to: https://vercel.com/dashboard
echo 2. Select your project
echo 3. Settings ^> General ^> Root Directory
echo 4. Change from "frontend" to "./" (root)
echo 5. Save
echo 6. Deployments tab ^> Click "Redeploy"
echo.
echo OR run this command from PROJECT ROOT:
echo    vercel --prod
echo.
echo ========================================
pause
