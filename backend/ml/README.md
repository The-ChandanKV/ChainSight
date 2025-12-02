# ChainSight ML Service

AI-powered analytics for supply chain predictions using Machine Learning.

## Overview

This ML service provides intelligent insights for ChainSight including:
- **Delay Prediction**: Predicts if shipments will be delayed
- **Delay Duration**: Estimates delay duration in hours
- **Anomaly Detection**: Detects temperature breaches and other anomalies
- **Risk Scoring**: Calculates risk scores for shipments

## Models Used

- **RandomForest Classifier**: For delay classification
- **XGBoost Classifier**: For improved delay prediction accuracy
- **XGBoost Regressor**: For delay duration estimation
- **RandomForest Classifier**: For anomaly detection

## Setup

### 1. Install Python Dependencies

```bash
cd backend/ml
pip install -r requirements.txt
```

### 2. Train Models

Train the ML models on synthetic data (or your historical data):

```bash
python train_model.py
```

This will:
- Generate synthetic training data (5000 samples)
- Train all ML models
- Save models to `models/` directory
- Display accuracy metrics

Expected output:
```
🔄 Training Delay Classification Model...
✅ RandomForest Accuracy: 0.8234
✅ XGBoost Accuracy: 0.8567
🏆 Best Model: XGBoost

🔄 Training Delay Duration Regression Model...
✅ RMSE: 3.45 hours

🔄 Training Anomaly Detection Model...
✅ Accuracy: 0.8912
```

### 3. Start ML Service

```bash
python ml_service.py
```

The service will start on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### Predict Delay
```
POST /predict/delay
Content-Type: application/json

{
  "distance_km": 1500,
  "temperature_avg": 22,
  "temperature_variance": 8,
  "carrier_rating": 4.2,
  "package_weight": 25,
  "route_complexity": 4,
  "weather_score": 6,
  "is_fragile": 1,
  "is_express": 0
}
```

Response:
```json
{
  "success": true,
  "prediction": {
    "is_delayed": true,
    "delay_probability": 0.73,
    "estimated_delay_hours": 8.5,
    "risk_level": "high"
  }
}
```

### Predict Anomaly
```
POST /predict/anomaly
Content-Type: application/json

{
  "temperature_avg": 35,
  "temperature_variance": 15,
  "distance_km": 2000,
  "route_complexity": 5,
  "weather_score": 3
}
```

### Get Insights
```
POST /insights
Content-Type: application/json

{
  "shipments": [
    {
      "shipment_id": "SH001",
      "distance_km": 1500,
      "temperature_avg": 22,
      ...
    }
  ]
}
```

Response includes:
- Total shipments analyzed
- Delay statistics
- Risk distribution
- Trends
- Top predictions

## Features

### Delay Prediction
- Analyzes multiple factors: distance, temperature, carrier rating, route complexity
- Provides probability scores (0-1)
- Classifies risk levels: low, medium, high

### Anomaly Detection
- Monitors temperature variations
- Detects unusual patterns
- Flags high-risk shipments

### Predictive Analytics
- Historical trend analysis
- Risk score calculation
- Performance metrics

## Model Training

### Using Historical Data

To train on your actual shipment data:

1. Export shipment data from MongoDB
2. Modify `train_model.py` to load your data
3. Ensure data has these features:
   - distance_km
   - temperature_avg
   - temperature_variance
   - carrier_rating
   - package_weight
   - route_complexity
   - weather_score
   - is_fragile
   - is_express

### Retraining Models

Retrain periodically with new data:

```bash
python train_model.py
```

Models are saved to `models/` and automatically loaded by the service.

## Integration with Backend

The main backend (`src/server.js`) proxies requests to this ML service:

```javascript
// Backend endpoint
POST /api/insights

// Proxies to ML service
http://localhost:5000/insights
```

Set `ML_SERVICE_URL` in `.env`:
```
ML_SERVICE_URL=http://localhost:5000
```

## Production Deployment

### Option 1: Separate Service
Deploy ML service separately on a Python-capable server.

### Option 2: Docker
```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "ml_service.py"]
```

### Option 3: Serverless
Deploy as AWS Lambda or Google Cloud Function.

## Performance

- **Delay Prediction Accuracy**: ~85-90%
- **Anomaly Detection Accuracy**: ~89%
- **Response Time**: <100ms per prediction
- **Batch Processing**: Supports up to 1000 shipments

## Future Enhancements

- [ ] Real-time model updates
- [ ] A/B testing for models
- [ ] Deep learning models (LSTM for time series)
- [ ] Automated retraining pipeline
- [ ] Model versioning
- [ ] Feature importance analysis
- [ ] Explainable AI (SHAP values)

## Troubleshooting

### Models not found
```
⚠️ Error loading models
Please run train_model.py first
```
**Solution**: Run `python train_model.py`

### Port already in use
**Solution**: Change port in `ml_service.py` or kill process on port 5000

### Low accuracy
**Solution**: Retrain with more data or tune hyperparameters

## License

MIT
