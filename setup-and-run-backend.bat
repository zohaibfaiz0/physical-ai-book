@echo off
echo Physical AI and Humanoid Robotics RAG Chatbot - Setup and Run
echo ================================================================================

REM Change to the project directory
cd /d "%~dp0"

echo.
echo Creating virtual environment...
python -m venv backend\venv
if errorlevel 1 (
    echo Failed to create virtual environment
    pause
    exit /b 1
)

echo.
echo Activating virtual environment...
call backend\venv\Scripts\activate.bat

if not defined VIRTUAL_ENV (
    echo Failed to activate virtual environment
    pause
    exit /b 1
)

echo.
echo Upgrading pip...
python -m pip install --upgrade pip

echo.
echo Installing dependencies from requirements.txt...
pip install -r backend\requirements.txt --verbose

if errorlevel 1 (
    echo.
    echo Standard installation failed. Attempting alternative installation...

    REM Read requirements.txt and install packages one by one
    for /f "usebackq tokens=*" %%i in ("backend\requirements.txt") do (
        echo Installing %%i...
        pip install "%%i"
        if errorlevel 1 (
            echo Warning: Failed to install %%i
        )
    )
)

echo.
echo Checking for .env file...
if not exist "backend\.env" (
    if exist "backend\.env.example" (
        echo Creating .env from .env.example...
        copy "backend\.env.example" "backend\.env"
        echo Created .env file. Please update it with your actual API keys.
    ) else (
        echo Warning: Neither .env nor .env.example found
    )
)

echo.
echo Starting backend server...
echo Server will be available at http://127.0.0.1:8000
echo Press Ctrl+C to stop the server
echo.

REM Start the backend server
cd backend
python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000 --log-level info

echo.
echo Server stopped.
pause