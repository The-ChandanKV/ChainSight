# ChainSight - Quick Start Guide

## Starting All Services

ChainSight consists of three services that need to run simultaneously:

### 1. Backend API Server (Node.js)
```bash
cd backend
npm start
```
Runs on: `http://localhost:3001`

### 2. Frontend Dev Server (React)
```bash
npm run dev
```
Runs on: `http://localhost:5173`

### 3. ML Service (Python) - Optional but Recommended
```bash
cd backend/ml
python ml_service.py
```
Runs on: `http://localhost:5000`

## First Time Setup

### ML Service Setup
```bash
# Install Python dependencies
cd backend/ml
pip install -r requirements.txt

# Train models (first time only)
python train_model.py

# Start service
python ml_service.py
```

### Quick Start (Windows)
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend  
npm run dev

# Terminal 3 - ML Service
cd backend\ml
start_ml_service.bat
```

### Quick Start (Linux/Mac)
```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
npm run dev

# Terminal 3 - ML Service
cd backend/ml
chmod +x start_ml_service.sh
./start_ml_service.sh
```

## Accessing the Application

1. **Home Page**: http://localhost:5173
2. **Dashboard**: http://localhost:5173/dashboard
3. **AI Insights**: http://localhost:5173/ai-insights ⭐ NEW!

## Features

### Dashboard
- View all shipments
- Track shipment status
- Add new shipments
- Blockchain verification

### AI Insights ⭐ NEW
- Delay predictions
- Anomaly detection
- Risk distribution charts
- Shipment trends
- Predictive analytics
- High-risk shipment alerts

## Environment Setup

Create `backend/.env`:
```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/chainsight
ML_SERVICE_URL=http://localhost:5000
CONTRACT_ADDRESS=your_contract_address
RPC_URL=your_rpc_url
PRIVATE_KEY=your_private_key
```

## Troubleshooting

### ML Service Not Available
If ML service is not running, the app will still work with mock data.

### Port Already in Use
- Backend (3001): Change `PORT` in `.env`
- Frontend (5173): Automatically uses next available port
- ML Service (5000): Change port in `ml_service.py`

### Models Not Found
Run: `python backend/ml/train_model.py`

## Testing AI Insights

1. Start all three services
2. Navigate to AI Insights page
3. Click "Refresh" to fetch latest predictions
4. View charts and metrics

Enjoy ChainSight! 🚀
