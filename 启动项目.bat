@echo off
chcp 65001 >nul
title 数智书院 - 前后端启动

echo ========================================
echo      🏛️  数智书院 · 前后端启动
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 正在安装依赖...
call npm install
if %errorlevel% neq 0 (
    echo ❌ 依赖安装失败，请检查网络连接
    pause
    exit /b 1
)

echo.
echo [2/3] 正在启动后端服务 (端口 3001)...
start "数智书院-后端" cmd /k "cd /d %~dp0 && echo 🏛️ 后端服务启动中... && npm run server"

echo [3/3] 正在启动前端开发服务器...
echo.
echo ✅ 启动成功！浏览器将自动打开
echo    后端 API: http://localhost:3001/api/v1
echo    前端页面: http://localhost:5173
echo.
start http://localhost:5173
npx vite --host

pause
