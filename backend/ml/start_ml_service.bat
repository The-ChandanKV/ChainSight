@echo off
echo =========================================
echo ChainSight ML Service Setup
echo =========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed. Please install Python 3.8 or higher.
    exit /b 1
)

echo ✅ Python is installed
echo.

REM Install dependencies
echo 📦 Installing Python dependencies...
python -m pip install -r requirements.txt

if errorlevel 1 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo.
echo ✅ Dependencies installed
echo.

REM Check if models exist
if not exist "models\delay_classifier.pkl" (
    echo 🔄 Training ML models (first time setup)...
    python train_model.py
    
    if errorlevel 1 (
        echo ❌ Failed to train models
        exit /b 1
    )
    echo.
)

REM Start the ML service
echo =========================================
echo 🚀 Starting ML Service on port 5000
echo =========================================
echo.
python ml_service.py
