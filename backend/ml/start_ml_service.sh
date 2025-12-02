#!/bin/bash

echo "========================================="
echo "ChainSight ML Service Setup"
echo "========================================="
echo ""

# Check if Python is installed
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null
then
    echo "❌ Python is not installed. Please install Python 3.8 or higher."
    exit 1
fi

# Use python3 if available, otherwise python
PYTHON_CMD="python3"
if ! command -v python3 &> /dev/null
then
    PYTHON_CMD="python"
fi

echo "✅ Using Python: $PYTHON_CMD"
echo ""

# Install dependencies
echo "📦 Installing Python dependencies..."
$PYTHON_CMD -m pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo ""
echo "✅ Dependencies installed"
echo ""

# Check if models exist
if [ ! -d "models" ] || [ ! -f "models/delay_classifier.pkl" ]; then
    echo "🔄 Training ML models (first time setup)..."
    $PYTHON_CMD train_model.py
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to train models"
        exit 1
    fi
    echo ""
fi

# Start the ML service
echo "========================================="
echo "🚀 Starting ML Service on port 5000"
echo "========================================="
echo ""
$PYTHON_CMD ml_service.py
