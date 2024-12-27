import requests
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

VEHICLE_SERVICE_URL = "http://localhost:8081/api/trajectories/vehicle"

def fetch_trajectory_data(vehicle_id):
    response = requests.get(f"{VEHICLE_SERVICE_URL}/{vehicle_id}")
    return response.json() if response.status_code == 200 else []

def detect_anomalies(vehicle_id):
    data = fetch_trajectory_data(vehicle_id)
    if not data:
        return []

    df = pd.DataFrame(data)
    features = ['latitude', 'longitude', 'speed', 'heading']

    # Handle missing or unexpected fields
    if any(feature not in df.columns for feature in features):
        raise ValueError("Missing required fields in trajectory data.")

    # Load model and scaler
    model = joblib.load("anomaly_detection/models/final_model.pkl")
    scaler = joblib.load("anomaly_detection/models/scaler.pkl")

    # Prepare data
    scaled_data = scaler.transform(df[features])
    predictions = model.predict(scaled_data)
    df['anomaly'] = predictions

    # Filter anomalies
    anomalies = df[df['anomaly'] == -1]
    return anomalies[['latitude', 'longitude', 'speed', 'timestamp', 'startTime', 'status']].to_dict(orient='records')
