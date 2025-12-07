@echo off
echo Starting Physical AI and Humanoid Robotics RAG Backend...
echo.

REM Change to backend directory
cd /d "%~dp0backend"

REM Activate virtual environment if it exists
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo Virtual environment activated
) else (
    echo Warning: Virtual environment not found. Make sure you've run setup-and-run-backend.bat first.
)

echo Installing dependencies (if needed)...
pip install -r requirements.txt

echo.
echo Starting backend server...
echo.
echo ========================================
echo    BACKEND RUNNING ON PORT 8000
echo ========================================
echo.

REM Start the backend server with detailed logging
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --log-level info