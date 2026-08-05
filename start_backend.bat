@echo off
:: ============================================================
:: PinIT Voice Cache Backend — Windows Startup Script
:: Starts Redis (if available) and the FastAPI backend server
:: ============================================================

echo.
echo  ╔══════════════════════════════════════════════╗
echo  ║   PinIT Voice Cache Backend  v2.0            ║
echo  ║   FastAPI + Redis + Kokoro TTS               ║
echo  ╚══════════════════════════════════════════════╝
echo.

:: ── Step 1: Try to start Redis ───────────────────────────────
echo [1/3] Starting Redis...
where redis-server >nul 2>&1
if %ERRORLEVEL% == 0 (
    start /B redis-server redis\redis.conf
    echo       Redis started on port 6379
    timeout /t 2 /nobreak >nul
) else (
    echo       Redis not found in PATH.
    echo       Install from: https://github.com/microsoftarchive/redis/releases
    echo       Or use: winget install Redis.Redis
    echo       Backend will start without Redis (cache disabled).
)

:: ── Step 2: Install Python dependencies if needed ────────────
echo [2/3] Checking Python dependencies...
cd backend
pip show fastapi >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo       Installing dependencies from requirements.txt...
    pip install -r requirements.txt
) else (
    echo       Dependencies already installed.
)

:: ── Step 3: Start FastAPI backend ────────────────────────────
echo [3/3] Starting FastAPI Voice Backend on http://localhost:8000
echo.
echo  API Docs:   http://localhost:8000/docs
echo  Health:     http://localhost:8000/health
echo  TTS:        POST http://localhost:8000/api/tts
echo  Cache:      GET  http://localhost:8000/api/cache/stats
echo.
echo  Press Ctrl+C to stop.
echo.

python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

cd ..
