@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>nul
if errorlevel 1 (
  echo.
  echo Node.js was not found on this machine.
  echo This Vite React app needs Node.js and npm to run locally.
  echo.
  echo Install the current Node.js LTS release from:
  echo https://nodejs.org/en/download/
  echo.
  echo After installation, close this window and run RunAegisStay.bat again.
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo.
  echo npm was not found on this machine.
  echo Node.js may be installed incorrectly or PATH may not be updated yet.
  echo.
  echo Reopen your terminal after installing Node.js, then run this file again.
  echo.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing project dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed.
    pause
    exit /b 1
  )
)

echo Starting the Vite development server...
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 3; Start-Process 'http://localhost:5173'"
call npm run dev
