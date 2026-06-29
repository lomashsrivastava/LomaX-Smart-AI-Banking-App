@echo off
echo ====================================================
echo      LomaX Enterprise Banking Platform Startup
echo ====================================================
echo.
echo Initializing services...

:: Start Backend
echo [1/2] Starting Node.js Backend Server on Port 5000...
cd backend
start "LomaX Backend Server" cmd /k "npm run dev"

:: Go back to root
cd ..

:: Start Frontend
echo [2/2] Starting Next.js Frontend Server on Port 3000...
cd frontend
start "LomaX Frontend App" cmd /k "npm run dev"

echo.
echo ====================================================
echo Startup sequence initiated successfully!
echo The applications are booting up in separate windows.
echo.
echo Dashboard URL: http://localhost:3000
echo Backend API:   http://localhost:5000
echo ====================================================
echo.
echo Press any key to close this launcher (servers will keep running in their own windows).
pause > nul
