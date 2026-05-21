@echo off
chcp 65001 >nul
title 书院 - 经典研读平台

echo ========================================
echo        📚 书院 - 经典研读平台
echo ========================================
echo.

cd /d "%~dp0"

echo [1/2] 正在安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败，请检查网络连接
    pause
    exit /b 1
)

echo.
echo [2/2] 正在启动开发服务器...
echo.
echo ✅ 启动成功！浏览器将自动打开
echo.
start http://localhost:5173
npx vite --host

pause
