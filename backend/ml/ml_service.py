"""
ML Prediction Service for ChainSight
Provides predictions and insights using trained ML models
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import os
import json

app = Flask(__name__)
CORS(app)

# Load models
models = {}
encoders = {}
feature_cols = []

def load_models():
    """Load all trained models"""
    global models, encoders, feature_cols
    
    try:
        models['delay_classifier'] = joblib.load('models/delay_classifier.pkl')
        models['delay_regressor'] = joblib.load('models/delay_regressor.pkl')
        models['anomaly_detector'] = joblib.load('models/anomaly_detector.pkl')
        encoders['season'] = joblib.load('models/season_encoder.pkl')
        feature_cols = joblib.load('models/feature_cols.pkl')
        print("✅ All models loaded successfully")
        return True
    except Exception as e:
        print(f"⚠️  Error loading models: {e}")
        print("Please run train_model.py first to train the models")
        return False

def get_current_season():
    """Get current season based on month"""
    month = datetime.now().month
    if month in [3, 4, 5]:
        return 'Spring'
    elif month in [6, 7, 8]:
        return 'Summer'
    elif month in [9, 10, 11]:
        return 'Fall'
    else:
        return 'Winter'

def prepare_features(shipment_data):
    """Prepare features for prediction"""
    season = get_current_season()
    season_encoded = encoders['season'].transform([season])[0]
    
    features = {
        'distance_km': shipment_data.get('distance_km', 500),
        'temperature_avg': shipment_data.get('temperature_avg', 20),
        'temperature_variance': shipment_data.get('temperature_variance', 5),
        'carrier_rating': shipment_data.get('carrier_rating', 4.0),
        'package_weight': shipment_data.get('package_weight', 10),
        'route_complexity': shipment_data.get('route_complexity', 3),
        'weather_score': shipment_data.get('weather_score', 7),
        'day_of_week': datetime.now().weekday(),
        'is_fragile': shipment_data.get('is_fragile', 0),
        'is_express': shipment_data.get('is_express', 0),
        'season_encoded': season_encoded
    }
    
    return pd.DataFrame([features])[feature_cols]

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    models_loaded = all(key in models for key in ['delay_classifier', 'delay_regressor', 'anomaly_detector'])
    
    return jsonify({
        'status': 'ok',
        'service': 'ChainSight ML Service',
        'models_loaded': models_loaded,
        'timestamp': datetime.now().isoformat()
    })

@app.route('/predict/delay', methods=['POST'])
def predict_delay():
    """Predict if a shipment will be delayed"""
    try:
        data = request.json
        features = prepare_features(data)
        
        # Predict delay
        delay_prob = models['delay_classifier'].predict_proba(features)[0][1]
        is_delayed = models['delay_classifier'].predict(features)[0]
        
        # If delayed, predict duration
        delay_hours = 0
        if is_delayed:
            delay_hours = models['delay_regressor'].predict(features)[0]
        
        return jsonify({
            'success': True,
            'prediction': {
                'is_delayed': bool(is_delayed),
                'delay_probability': float(delay_prob),
                'estimated_delay_hours': float(delay_hours) if is_delayed else 0,
                'risk_level': 'high' if delay_prob > 0.7 else 'medium' if delay_prob > 0.4 else 'low'
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/predict/anomaly', methods=['POST'])
def predict_anomaly():
    """Predict temperature breaches and anomalies"""
    try:
        data = request.json
        
        anomaly_features = pd.DataFrame([{
            'temperature_avg': data.get('temperature_avg', 20),
            'temperature_variance': data.get('temperature_variance', 5),
            'distance_km': data.get('distance_km', 500),
            'route_complexity': data.get('route_complexity', 3),
            'weather_score': data.get('weather_score', 7)
        }])
        
        # Predict anomaly
        anomaly_prob = models['anomaly_detector'].predict_proba(anomaly_features)[0][1]
        has_anomaly = models['anomaly_detector'].predict(anomaly_features)[0]
        
        return jsonify({
            'success': True,
            'prediction': {
                'has_anomaly': bool(has_anomaly),
                'anomaly_probability': float(anomaly_prob),
                'risk_level': 'high' if anomaly_prob > 0.7 else 'medium' if anomaly_prob > 0.4 else 'low'
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/insights', methods=['POST'])
def get_insights():
    """Get comprehensive insights for shipments"""
    try:
        data = request.json
        shipments = data.get('shipments', [])
        
        if not shipments:
            return jsonify({
                'success': True,
                'insights': {
                    'total_shipments': 0,
                    'delayed_shipments': 0,
                    'delay_percentage': 0,
                    'average_delay_hours': 0,
                    'high_risk_shipments': 0,
                    'anomalies_detected': 0,
                    'trends': [],
                    'predictions': []
                }
            })
        
        predictions = []
        total_delayed = 0
        total_delay_hours = 0
        high_risk_count = 0
        anomaly_count = 0
        
        for shipment in shipments:
            features = prepare_features(shipment)
            
            # Delay prediction
            delay_prob = models['delay_classifier'].predict_proba(features)[0][1]
            is_delayed = models['delay_classifier'].predict(features)[0]
            
            delay_hours = 0
            if is_delayed:
                delay_hours = models['delay_regressor'].predict(features)[0]
                total_delayed += 1
                total_delay_hours += delay_hours
            
            # Anomaly detection
            anomaly_features = pd.DataFrame([{
                'temperature_avg': shipment.get('temperature_avg', 20),
                'temperature_variance': shipment.get('temperature_variance', 5),
                'distance_km': shipment.get('distance_km', 500),
                'route_complexity': shipment.get('route_complexity', 3),
                'weather_score': shipment.get('weather_score', 7)
            }])
            
            anomaly_prob = models['anomaly_detector'].predict_proba(anomaly_features)[0][1]
            
            if delay_prob > 0.7 or anomaly_prob > 0.7:
                high_risk_count += 1
            
            if anomaly_prob > 0.5:
                anomaly_count += 1
            
            predictions.append({
                'shipment_id': shipment.get('shipment_id', 'unknown'),
                'delay_probability': float(delay_prob),
                'estimated_delay_hours': float(delay_hours),
                'anomaly_probability': float(anomaly_prob),
                'risk_score': float((delay_prob * 0.6 + anomaly_prob * 0.4) * 100)
            })
        
        # Calculate statistics
        total_shipments = len(shipments)
        delay_percentage = (total_delayed / total_shipments * 100) if total_shipments > 0 else 0
        avg_delay_hours = (total_delay_hours / total_delayed) if total_delayed > 0 else 0
        
        # Generate trends (mock data for now - in production, use historical data)
        trends = [
            {'week': 'Week 1', 'delayed': 5, 'on_time': 45},
            {'week': 'Week 2', 'delayed': 8, 'on_time': 42},
            {'week': 'Week 3', 'delayed': 6, 'on_time': 44},
            {'week': 'Week 4', 'delayed': int(total_delayed), 'on_time': total_shipments - int(total_delayed)}
        ]
        
        return jsonify({
            'success': True,
            'insights': {
                'total_shipments': total_shipments,
                'delayed_shipments': total_delayed,
                'delay_percentage': round(delay_percentage, 2),
                'average_delay_hours': round(avg_delay_hours, 2),
                'high_risk_shipments': high_risk_count,
                'anomalies_detected': anomaly_count,
                'trends': trends,
                'predictions': predictions[:10],  # Return top 10 for performance
                'risk_distribution': {
                    'low': len([p for p in predictions if p['risk_score'] < 40]),
                    'medium': len([p for p in predictions if 40 <= p['risk_score'] < 70]),
                    'high': len([p for p in predictions if p['risk_score'] >= 70])
                }
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/model/info', methods=['GET'])
def model_info():
    """Get information about loaded models"""
    try:
        with open('models/metadata.json', 'r') as f:
            metadata = json.load(f)
        
        return jsonify({
            'success': True,
            'metadata': metadata
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

if __name__ == '__main__':
    print("=" * 60)
    print("ChainSight ML Prediction Service")
    print("=" * 60)
    
    # Load models
    if load_models():
        print("\n🚀 Starting ML service on port 5000...")
        app.run(host='0.0.0.0', port=5000, debug=True)
    else:
        print("\n❌ Failed to start service. Please train models first.")
        print("Run: python train_model.py")
