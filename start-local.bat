@echo off
REM ============================================
REM Decarbonize Local Development Starter
REM Windows için
REM ============================================

echo.
echo ========================================
echo    Decarbonize Local Development
echo ========================================
echo.

REM Check MySQL
echo [1/4] Checking MySQL...
mysql --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] MySQL not found. Please install MySQL 8.0+
    pause
    exit /b 1
)
echo [OK] MySQL found
echo.

REM Test MySQL connection
echo [2/4] Testing database connection...
mysql -u decarbonize -pKrateia1@ -e "USE decarbonize_dev;" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Database not ready!
    echo.
    echo Please run these commands in MySQL:
    echo   CREATE DATABASE IF NOT EXISTS decarbonize_dev;
    echo   CREATE USER IF NOT EXISTS 'decarbonize'@'localhost' IDENTIFIED BY 'Krateia1@';
    echo   GRANT ALL PRIVILEGES ON decarbonize_dev.* TO 'decarbonize'@'localhost';
    echo   FLUSH PRIVILEGES;
    echo.
    pause
) else (
    echo [OK] Database ready
)
echo.

REM Backend
echo [3/4] Starting Backend...
cd backend

if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
)

if not exist ".env.local" (
    echo [WARNING] Backend .env.local not found
) else (
    echo [OK] Backend .env.local exists
)

REM Run migrations (first time)
if not exist "dist\" (
    echo Running database migrations...
    call npm run migrate
    if %errorlevel% neq 0 (
        echo [WARNING] Migrations failed - continuing anyway
    )
    echo Building backend...
    call npm run build
)

echo Starting backend on port 3002...
start "Decarbonize Backend" cmd /k "npm start"
timeout /t 5 /nobreak >nul
echo [OK] Backend started
echo.

REM Frontend
echo [4/4] Starting Frontend...
cd ..

if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
)

if not exist ".env.local" (
    echo [WARNING] Frontend .env.local not found
) else (
    echo [OK] Frontend .env.local exists
)

echo Starting frontend on port 5173...
start "Decarbonize Frontend" cmd /k "npm run dev"
timeout /t 3 /nobreak >nul
echo [OK] Frontend started
echo.

echo ========================================
echo        Decarbonize is running!
echo ========================================
echo.
echo URLs:
echo   Frontend: http://localhost:5173
echo   Backend:  http://localhost:3002
echo   Projects: http://localhost:5173/projects
echo.
echo Press any key to open in browser...
pause >nul

start http://localhost:5173/projects

echo.
echo To stop: Close the terminal windows or press Ctrl+C
echo.
