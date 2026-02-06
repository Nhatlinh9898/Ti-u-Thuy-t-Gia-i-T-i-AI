@echo off
echo ========================================
echo   TIỂU THUYẾT GIA ĐẠI TÀI AI - SETUP
echo ========================================
echo.

echo [1/3] Dang cai dat dependencies...
npm install
if %errorlevel% neq 0 (
    echo ERROR: Khong the cai dat dependencies!
    pause
    exit /b 1
)

echo.
echo [2/3] Kiem tra file .env.local...
if not exist ".env.local" (
    echo Tao file .env.local moi...
    echo # Gemini API Key > .env.local
    echo GEMINI_API_KEY=YOUR_API_KEY_HERE >> .env.local
    echo.
    echo !!! QUAN TRONG: Hay mo file .env.local va thay YOUR_API_KEY_HERE bang API key cua ban !!!
    echo API key co the lay tai: https://makersuite.google.com/app/apikey
    echo.
) else (
    echo File .env.local da ton tai.
)

echo.
echo [3/3] Hoan thanh setup!
echo.
echo Chay ung dung:
echo   npm run dev
echo.
echo Mo trinh duyet tai: http://localhost:5173
echo.
pause
