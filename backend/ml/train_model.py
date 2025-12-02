"""
ML Model Training Script for ChainSight
Trains RandomForest and XGBoost models to predict shipment delays and detect anomalies
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from xgboost import XGBClassifier, XGBRegressor
from sklearn.metrics import accuracy_score, mean_squared_error, classification_report
import joblib
import os
import json
from datetime import datetime, timedelta

# Create models directory if it doesn't exist
os.makedirs('models', exist_ok=True)

def generate_synthetic_data(n_samples=1000):
    """
    Generate synthetic shipment data for training
    In production, this would be replaced with actual historical data from MongoDB
    """
    np.random.seed(42)
    
    # Generate features
    data = {
        'shipment_id': [f'SH{i:05d}' for i in range(n_samples)],
        'distance_km': np.random.uniform(100, 5000, n_samples),
        'temperature_avg': np.random.normal(20, 10, n_samples),
        'temperature_variance': np.random.uniform(0, 15, n_samples),
        'carrier_rating': np.random.uniform(1, 5, n_samples),
        'package_weight': np.random.uniform(1, 100, n_samples),
        'route_complexity': np.random.randint(1, 6, n_samples),
        'weather_score': np.random.uniform(0, 10, n_samples),
        'season': np.random.choice(['Spring', 'Summer', 'Fall', 'Winter'], n_samples),
        'day_of_week': np.random.randint(0, 7, n_samples),
        'is_fragile': np.random.choice([0, 1], n_samples, p=[0.7, 0.3]),
        'is_express': np.random.choice([0, 1], n_samples, p=[0.6, 0.4]),
    }
    
    df = pd.DataFrame(data)
    
    # Generate target variables based on features
    # Delay probability increases with distance, temperature variance, and route complexity
    delay_probability = (
        0.1 + 
        (df['distance_km'] / 10000) * 0.3 +
        (df['temperature_variance'] / 20) * 0.2 +
        (df['route_complexity'] / 10) * 0.2 +
        (1 - df['carrier_rating'] / 5) * 0.15 +
        (1 - df['weather_score'] / 10) * 0.15
    )
    
    df['is_delayed'] = (np.random.random(n_samples) < delay_probability).astype(int)
    
    # Delay hours (if delayed)
    df['delay_hours'] = np.where(
        df['is_delayed'] == 1,
        np.random.exponential(scale=12, size=n_samples),
        0
    )
    
    # Temperature breach detection
    temp_breach_prob = (df['temperature_variance'] / 15) * 0.5
    df['temperature_breach'] = (np.random.random(n_samples) < temp_breach_prob).astype(int)
    
    # Risk score (0-100)
    df['risk_score'] = (
        delay_probability * 40 +
        temp_breach_prob * 30 +
        (df['route_complexity'] / 5) * 15 +
        (1 - df['carrier_rating'] / 5) * 15
    ) * 100
    
    return df

def train_delay_classifier(df):
    """Train a model to predict if a shipment will be delayed"""
    print("\n🔄 Training Delay Classification Model...")
    
    # Prepare features
    feature_cols = ['distance_km', 'temperature_avg', 'temperature_variance', 
                    'carrier_rating', 'package_weight', 'route_complexity', 
                    'weather_score', 'day_of_week', 'is_fragile', 'is_express']
    
    # Encode categorical variables
    le_season = LabelEncoder()
    df['season_encoded'] = le_season.fit_transform(df['season'])
    feature_cols.append('season_encoded')
    
    X = df[feature_cols]
    y = df['is_delayed']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train RandomForest
    rf_model = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
    rf_model.fit(X_train, y_train)
    rf_pred = rf_model.predict(X_test)
    rf_accuracy = accuracy_score(y_test, rf_pred)
    
    # Train XGBoost
    xgb_model = XGBClassifier(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42)
    xgb_model.fit(X_train, y_train)
    xgb_pred = xgb_model.predict(X_test)
    xgb_accuracy = accuracy_score(y_test, xgb_pred)
    
    print(f"✅ RandomForest Accuracy: {rf_accuracy:.4f}")
    print(f"✅ XGBoost Accuracy: {xgb_accuracy:.4f}")
    
    # Use the better model
    best_model = xgb_model if xgb_accuracy > rf_accuracy else rf_model
    best_model_name = "XGBoost" if xgb_accuracy > rf_accuracy else "RandomForest"
    
    print(f"\n🏆 Best Model: {best_model_name}")
    print("\nClassification Report:")
    print(classification_report(y_test, xgb_pred if xgb_accuracy > rf_accuracy else rf_pred))
    
    # Save model
    joblib.dump(best_model, 'models/delay_classifier.pkl')
    joblib.dump(le_season, 'models/season_encoder.pkl')
    joblib.dump(feature_cols, 'models/feature_cols.pkl')
    
    return best_model, feature_cols

def train_delay_regressor(df):
    """Train a model to predict delay duration in hours"""
    print("\n🔄 Training Delay Duration Regression Model...")
    
    # Only use delayed shipments
    df_delayed = df[df['is_delayed'] == 1].copy()
    
    feature_cols = ['distance_km', 'temperature_avg', 'temperature_variance', 
                    'carrier_rating', 'package_weight', 'route_complexity', 
                    'weather_score', 'day_of_week', 'is_fragile', 'is_express', 'season_encoded']
    
    X = df_delayed[feature_cols]
    y = df_delayed['delay_hours']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train XGBoost Regressor
    model = XGBRegressor(n_estimators=100, max_depth=6, learning_rate=0.1, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    
    print(f"✅ RMSE: {rmse:.2f} hours")
    
    # Save model
    joblib.dump(model, 'models/delay_regressor.pkl')
    
    return model

def train_anomaly_detector(df):
    """Train a model to detect temperature breaches and other anomalies"""
    print("\n🔄 Training Anomaly Detection Model...")
    
    feature_cols = ['temperature_avg', 'temperature_variance', 'distance_km', 
                    'route_complexity', 'weather_score']
    
    X = df[feature_cols]
    y = df['temperature_breach']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Train RandomForest
    model = RandomForestClassifier(n_estimators=100, max_depth=8, random_state=42)
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"✅ Accuracy: {accuracy:.4f}")
    
    # Save model
    joblib.dump(model, 'models/anomaly_detector.pkl')
    
    return model

def save_model_metadata():
    """Save metadata about trained models"""
    metadata = {
        'trained_at': datetime.now().isoformat(),
        'models': {
            'delay_classifier': 'models/delay_classifier.pkl',
            'delay_regressor': 'models/delay_regressor.pkl',
            'anomaly_detector': 'models/anomaly_detector.pkl',
            'season_encoder': 'models/season_encoder.pkl',
            'feature_cols': 'models/feature_cols.pkl'
        },
        'version': '1.0.0'
    }
    
    with open('models/metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("\n✅ Model metadata saved")

def main():
    print("=" * 60)
    print("ChainSight ML Model Training")
    print("=" * 60)
    
    # Generate or load data
    print("\n📊 Generating synthetic training data...")
    df = generate_synthetic_data(n_samples=5000)
    print(f"✅ Generated {len(df)} samples")
    
    # Train models
    delay_classifier, feature_cols = train_delay_classifier(df)
    delay_regressor = train_delay_regressor(df)
    anomaly_detector = train_anomaly_detector(df)
    
    # Save metadata
    save_model_metadata()
    
    print("\n" + "=" * 60)
    print("✅ All models trained and saved successfully!")
    print("=" * 60)
    print("\nModel files:")
    print("  - models/delay_classifier.pkl")
    print("  - models/delay_regressor.pkl")
    print("  - models/anomaly_detector.pkl")
    print("  - models/season_encoder.pkl")
    print("  - models/feature_cols.pkl")
    print("  - models/metadata.json")
    print("\n")

if __name__ == "__main__":
    main()
