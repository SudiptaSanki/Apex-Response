@echo off
setlocal
title AegisStay Launch Pad

cd /d "%~dp0"

echo.
echo  =====================================================
echo    AEGISSTAY - Crisis Coordination Platform Launcher
echo  =====================================================
echo.

:: ── Check Node.js ──────────────────────────────────────────────────
where node >nul 2>nul
if errorlevel 1 (
  echo  [ERROR] Node.js was not found on this machine.
  echo  Install the current LTS from: https://nodejs.org/en/download/
  echo  Then close this window and run RunAegisStay.bat again.
  echo.
  pause
  exit /b 1
)

:: ── Check npm ──────────────────────────────────────────────────────
where npm >nul 2>nul
if errorlevel 1 (
  echo  [ERROR] npm was not found. Reinstall Node.js and retry.
  echo.
  pause
  exit /b 1
)

:: ── Install root dependencies if needed ────────────────────────────
if not exist node_modules (
  echo  [SETUP] Installing frontend dependencies...
  call npm install
  if errorlevel 1 (
    echo  [ERROR] Frontend dependency installation failed.
    pause
    exit /b 1
  )
)

:: ── Install blockchain dependencies if needed ──────────────────────
if not exist blockchain\node_modules (
  echo  [SETUP] Installing blockchain dependencies...
  cd blockchain
  call npm install
  if errorlevel 1 (
    echo  [ERROR] Blockchain dependency installation failed.
    cd ..
    pause
    exit /b 1
  )
  cd ..
)

:: ── Install backend dependencies if needed ─────────────────────────
if not exist backend\node_modules (
  echo  [SETUP] Installing backend dependencies...
  cd backend
  call npm install
  if errorlevel 1 (
    echo  [ERROR] Backend dependency installation failed.
    cd ..
    pause
    exit /b 1
  )
  cd ..
)

:: ── Compile Smart Contract ─────────────────────────────────────────
echo  [BLOCKCHAIN] Compiling smart contract...
cd blockchain
call npx hardhat compile >nul 2>nul
cd ..

:: ── Start Hardhat Local Node (new window) ──────────────────────────
echo  [BLOCKCHAIN] Starting Hardhat local node on http://127.0.0.1:8545 ...
start "AegisStay - Hardhat Node" cmd /k "cd /d "%~dp0blockchain" && npx hardhat node"

:: ── Wait for Hardhat to boot ───────────────────────────────────────
echo  [WAIT] Waiting 5 seconds for Hardhat node to start...
timeout /t 5 /nobreak >nul

:: ── Deploy Smart Contract ──────────────────────────────────────────
echo  [BLOCKCHAIN] Deploying AegisStayBadge contract to localhost...
cd blockchain
call npx hardhat run scripts/deploy.js --network localhost
if errorlevel 1 (
  echo  [WARN] Contract deployment failed. The Hardhat node may still be starting.
  echo         If this is your first run, close all windows and try again.
)
cd ..

:: ── Start Backend Server (new window) ─────────────────────────────
echo  [BACKEND] Starting Express backend on http://localhost:5000 ...
start "AegisStay - Backend API" cmd /k "cd /d "%~dp0backend" && npm start"

:: ── Open Browser after short delay ────────────────────────────────
start "" powershell -NoProfile -WindowStyle Hidden -Command "Start-Sleep -Seconds 4; Start-Process 'http://localhost:3000'"

:: ── Start Vite Frontend (this window) ─────────────────────────────
echo.
echo  [FRONTEND] Starting Vite dev server...
echo.
echo  -------------------------------------------------------
echo   All services starting:
echo     Hardhat Node  ->  http://127.0.0.1:8545
echo     Backend API   ->  http://localhost:5000
echo     Frontend App  ->  http://localhost:3000
echo  -------------------------------------------------------
echo.
echo  NOTE: MetaMask setup (first time only):
echo    1. Network Name : AegisStay Local (Hardhat)
echo    2. RPC URL      : http://127.0.0.1:8545
echo    3. Chain ID     : 31337
echo    4. Symbol       : ETH
echo    Import account private key from the Hardhat Node window.
echo.
call npm run dev
