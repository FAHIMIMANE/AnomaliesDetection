import os
import pandas as pd
import numpy as np
import joblib
import requests
import random
import time
import logging
import tensorflow as tf
import geopy.distance
from flask import Flask, jsonify, request, Response
from py_eureka_client import eureka_client
import socket
from flask_cors import CORS


# Flask app
app = Flask(__name__)


CORS(app, origins=["http://localhost:8080"], allow_headers=["Content-Type"], methods=["POST", "GET", "OPTIONS"])

# Eureka configuration
EUREKA_SERVER = "http://ace-eureka:8761/eureka/"
EUREKA_APP_NAME = "ANOMALY-DETECTION-SERVICE"
# Get the host IP dynamically
INSTANCE_HOST = socket.gethostbyname(socket.gethostname())
INSTANCE_PORT = 5000

# Initialize Eureka client
eureka_client.init(
    eureka_server=EUREKA_SERVER,
    app_name=EUREKA_APP_NAME,
    instance_ip=INSTANCE_HOST,
    instance_port=INSTANCE_PORT,
    region="default"
)
logging.info(f"Registered service {EUREKA_APP_NAME} with Eureka at {INSTANCE_HOST}:{INSTANCE_PORT}")
# Constants
MODEL_DIR = "anomaly_detection/models"
MODEL_PATH = os.path.join(MODEL_DIR, "autoencoder_model.keras")
SCALER_PATH = os.path.join(MODEL_DIR, "scaler.pkl")
THRESHOLD_PATH = os.path.join(MODEL_DIR, "threshold.pkl")

# Load Keras model, scaler, and threshold
autoencoder = tf.keras.models.load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
threshold = joblib.load(THRESHOLD_PATH)

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# In-memory storage for previous locations
previous_locations = {}  # Format: {car_id: (latitude, longitude)}


# Helper function: Calculate distance between two GPS points
def calculate_distance(lat1, lon1, lat2, lon2):
    coords_1 = (lat1, lon1)
    coords_2 = (lat2, lon2)
    return geopy.distance.distance(coords_1, coords_2).km


# Helper function: Classify anomaly type
def classify_anomaly(row, threshold, prev_lat=None, prev_lon=None):
    anomalies = []

    # Reconstruction error anomaly
    if row['reconstruction_error'] > threshold:
        anomalies.append("Reconstruction Error Anomaly")

    # Speed anomaly
    if row['speed'] > 100:  # Example speed limit
        anomalies.append("Speed Anomaly")

    # Latitude/Longitude range check
    if row['latitude'] < -90 or row['latitude'] > 90:
        anomalies.append("Latitude Range Anomaly")
    if row['longitude'] < -180 or row['longitude'] > 180:
        anomalies.append("Longitude Range Anomaly")

    # Location change anomaly
    if prev_lat is not None and prev_lon is not None:
        distance = calculate_distance(prev_lat, prev_lon, row['latitude'], row['longitude'])
        if distance > 10:  # Example: Distance greater than 10 km in one second
            anomalies.append("Location Change Anomaly")

    if not anomalies:
        anomalies.append("No Specific Anomaly Detected")

    return anomalies


# Route: Analyze live data
# Route: Analyze live data
@app.route("/analyze", methods=["POST"])
def analyze_live_data():
    try:
        # Get JSON payload
        data = request.json
        required_fields = ['latitude', 'longitude', 'speed', 'heading', 'time_diff', 'car_id']

        # Validate input data
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Convert to DataFrame
        df_live = pd.DataFrame([data])

        # Rename 'car_id' to 'vehicle_id' if expected by the model
        if 'vehicle_id' in scaler.feature_names_in_:
            df_live['vehicle_id'] = df_live['car_id']

        # Select required model features
        model_features = ['latitude', 'longitude', 'speed', 'heading', 'time_diff']
        if 'vehicle_id' in scaler.feature_names_in_:
            model_features.append('vehicle_id')

        # Ensure all required features are present
        missing_features = [feature for feature in model_features if feature not in df_live.columns]
        if missing_features:
            return jsonify({"error": f"Missing features for analysis: {missing_features}"}), 400

        # Preprocess the data
        scaled_data = scaler.transform(df_live[model_features])

        # Predict reconstruction error
        predictions = autoencoder.predict(scaled_data)
        reconstruction_error = np.mean(np.square(predictions - scaled_data), axis=1)

        df_live['reconstruction_error'] = reconstruction_error
        df_live['is_anomaly'] = reconstruction_error > threshold

        if df_live['is_anomaly'].iloc[0]:
            # Fetch previous location for distance anomaly
            car_id = df_live['car_id'].iloc[0]
            prev_lat, prev_lon = previous_locations.get(car_id, (None, None))

            # Classify anomaly types
            anomaly_types = classify_anomaly(df_live.iloc[0], threshold, prev_lat, prev_lon)

            # Update previous location
            previous_locations[car_id] = (df_live['latitude'].iloc[0], df_live['longitude'].iloc[0])

            result = {
                "is_anomaly": True,
                "anomaly_types": anomaly_types,
                "details": df_live.iloc[0].to_dict()
            }
            return jsonify(result), 200
        else:
            # Update previous location even if no anomaly
            car_id = df_live['car_id'].iloc[0]
            previous_locations[car_id] = (df_live['latitude'].iloc[0], df_live['longitude'].iloc[0])

            return jsonify({"is_anomaly": False, "message": "No anomaly detected."}), 200
    except Exception as e:
        logging.error(f"Error in /analyze endpoint: {e}")
        return jsonify({"error": str(e)}), 500

# Route: Simulate real-time trajectory
@app.route("/simulate", methods=["GET"])
def simulate_real_map_trajectory():
    try:
        # Define starting and ending points
        start_location = {"lat": 40.7128, "lng": -74.0060}  # New York
        end_location = {"lat": 40.7306, "lng": -73.9352}  # Brooklyn

        # Fetch route from Google Maps Directions API
        def get_route(api_key, start, end):
            url = "https://maps.googleapis.com/maps/api/directions/json"
            params = {
                "origin": f"{start['lat']},{start['lng']}",
                "destination": f"{end['lat']},{end['lng']}",
                "key": api_key
            }
            response = requests.get(url, params=params)
            if response.status_code == 200 and response.json().get("status") == "OK":
                return response.json()["routes"][0]["legs"][0]["steps"]
            else:
                logging.error(f"Failed to fetch route: {response.status_code} - {response.text}")
                return []

        api_key = "AIzaSyBqGDXVFu8z386xLHiQjIh6S1qP7kwEEB0"
        route = get_route(api_key, start_location, end_location)
        if not route:
            return jsonify({"error": "Failed to fetch route. Check your API key or parameters."}), 500

        # Generate real-time trajectory data
        def generate_real_data():
            for step in route:
                start_location = step["start_location"]
                end_location = step["end_location"]
                distance = geopy.distance.distance(
                    (start_location["lat"], start_location["lng"]),
                    (end_location["lat"], end_location["lng"])
                ).km
                num_points = int(distance * 10)
                for i in range(num_points):
                    latitude = start_location["lat"] + (end_location["lat"] - start_location["lat"]) * i / num_points
                    longitude = start_location["lng"] + (end_location["lng"] - start_location["lng"]) * i / num_points
                    speed = random.uniform(40, 60)
                    heading = random.uniform(0, 360)
                    time_diff = 1
                    timestamp = time.time()
                    data = {
                        "latitude": latitude,
                        "longitude": longitude,
                        "speed": speed,
                        "heading": heading,
                        "time_diff": time_diff,
                        "timestamp": timestamp
                    }
                    yield f"data: {json.dumps(data)}\n\n"
                    time.sleep(1)

        return Response(generate_real_data(), content_type="text/event-stream")
    except Exception as e:
        logging.error(f"Error in simulation: {e}")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
