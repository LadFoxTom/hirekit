@echo off
echo 🚀 Deploying LadderFox to UAT environment...

REM Check if we're on the main branch
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="main" (
    echo ⚠️  Warning: You're not on the main branch. Current branch: %CURRENT_BRANCH%
    set /p CONTINUE="Continue anyway? (y/N): "
    if /i not "%CONTINUE%"=="y" (
        echo ❌ Deployment cancelled
        exit /b 1
    )
)

REM Check if there are uncommitted changes
git status --porcelain >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  Warning: You have uncommitted changes
    git status --short
    set /p CONTINUE="Continue anyway? (y/N): "
    if /i not "%CONTINUE%"=="y" (
        echo ❌ Deployment cancelled
        exit /b 1
    )
)

REM Build the application
echo 📦 Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)

echo ✅ Build successful

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
call vercel --env UAT --prod
if %errorlevel% equ 0 (
    echo ✅ UAT deployment successful!
    echo 🌐 UAT URL: https://uat.ladderfox.com
    echo.
    echo 📋 Next steps:
    echo 1. Test the application at https://uat.ladderfox.com
    echo 2. Verify all features work correctly
    echo 3. Check database connections
    echo 4. Test payment flows (using test cards)
) else (
    echo ❌ UAT deployment failed
    exit /b 1
) 