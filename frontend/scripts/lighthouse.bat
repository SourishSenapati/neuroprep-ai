@echo off
REM Lighthouse Performance Audit Script (Windows)
REM Runs comprehensive performance testing and generates report

echo.
echo 🚀 NeuroPrep AI - Lighthouse Performance Audit
echo ================================================
echo.

REM Check if URL is provided
if "%~1"=="" (
    set URL=http://localhost:3000
) else (
    set URL=%~1
)

echo 📍 Target URL: %URL%
echo 🕐 Starting audit...
echo.

REM Run Lighthouse CLI
call npx lighthouse "%URL%" ^
  --preset=desktop ^
  --view ^
  --output=html ^
  --output-path=lighthouse-report.html ^
  --chrome-flags="--headless --no-sandbox --disable-gpu" ^
  --only-categories=performance,accessibility,best-practices,seo ^
  --throttling-method=simulate ^
  --throttling.cpuSlowdownMultiplier=1 ^
  --quiet

echo.
echo ✅ Audit Complete!
echo 📊 Report saved to: lighthouse-report.html
echo.
echo 🎯 Target for Hackathon: 100/100 Performance
echo.

pause
