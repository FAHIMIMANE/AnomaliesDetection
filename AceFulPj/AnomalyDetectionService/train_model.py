import requests
import pandas as pd
import numpy as np
import joblib
import os
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import tensorflow as tf
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Input, Dense, Dropout
from tensorflow.keras.optimizers import Adam
import matplotlib.pyplot as plt

# Constants
VEHICLE_SERVICE_URL = "http://localhost:8081/api/trajectories/vehicle"
MODEL_DIR = "anomaly_detection/models"

# Create directory if not exists
def create_directory(path):
    if not os.path.exists(path):
        os.makedirs(path)

# Fetch trajectory data for all vehicles
def fetch_data(vehicle_ids):
    all_data = []
    for vehicle_id in vehicle_ids:
        response = requests.get(f"{VEHICLE_SERVICE_URL}/{vehicle_id}")
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                for record in data:
                    record['vehicle_id'] = vehicle_id
                all_data.extend(data)
    return pd.DataFrame(all_data)

# Preprocess data
def preprocess_data(df):
    required_fields = ['latitude', 'longitude', 'speed', 'heading', 'timestamp', 'vehicle_id']
    print(f"Initial DataFrame shape: {df.shape}")
    print("Sample data before preprocessing:")
    print(df.head())

    # Check for missing required fields
    for field in required_fields:
        if field not in df.columns:
            raise ValueError(f"Missing field: {field}")

    # Convert timestamp column to datetime
    df['timestamp'] = pd.to_datetime(df['timestamp'], errors='coerce')
    df = df.dropna(subset=['timestamp'])

    # Calculate time difference in seconds
    df['time_diff'] = df['timestamp'].diff().dt.total_seconds()
    df['time_diff'] = df['time_diff'].fillna(0)  # Replace NaN caused by diff()

    # Ensure numeric fields are valid
    numeric_fields = ['latitude', 'longitude', 'speed', 'heading', 'time_diff', 'vehicle_id']
    for field in numeric_fields:
        df[field] = pd.to_numeric(df[field], errors='coerce')

    # Drop rows with NaN in numeric fields
    df = df.dropna(subset=numeric_fields)

    # Standardize data
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df[numeric_fields])
    print(f"Final shape of scaled data: {scaled_data.shape}")

    return df, scaled_data, scaler

# Build Autoencoder
def build_autoencoder(input_dim):
    input_layer = Input(shape=(input_dim,))
    encoded = Dense(128, activation='relu')(input_layer)
    encoded = Dropout(0.2)(encoded)
    encoded = Dense(64, activation='relu')(encoded)
    bottleneck = Dense(32, activation='relu')(encoded)

    decoded = Dense(64, activation='relu')(bottleneck)
    decoded = Dense(128, activation='relu')(decoded)
    output_layer = Dense(input_dim, activation='linear')(decoded)

    autoencoder = Model(inputs=input_layer, outputs=output_layer)
    autoencoder.compile(optimizer=Adam(learning_rate=0.001), loss='mse')
    return autoencoder

# Train model and save
def train_autoencoder(train_data, val_data):
    input_dim = train_data.shape[1]
    autoencoder = build_autoencoder(input_dim)

    history = autoencoder.fit(
        train_data, train_data,
        epochs=50,
        batch_size=64,
        validation_data=(val_data, val_data),
        verbose=2
    )
    return autoencoder, history

# Plot training and validation loss
def plot_loss(history):
    plt.plot(history.history['loss'], label='Train Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.xlabel('Epochs')
    plt.ylabel('Loss')
    plt.title('Autoencoder Training and Validation Loss')
    plt.legend()
    plt.savefig(f"{MODEL_DIR}/training_validation_loss.png")
    plt.close()

# Calculate reconstruction error
def calculate_reconstruction_error(model, data):
    predictions = model.predict(data)
    mse = np.mean(np.square(data - predictions), axis=1)  # Mean Squared Error
    return mse

# Train a shared model for all vehicles
def train_general_model(vehicle_ids):
    print("Fetching and preprocessing data for all vehicles...")
    df = fetch_data(vehicle_ids)
    df, scaled_data, scaler = preprocess_data(df)

    # Split data
    train_data, test_data = train_test_split(scaled_data, test_size=0.2, random_state=42)
    train_data, val_data = train_test_split(train_data, test_size=0.2, random_state=42)

    print("Training the shared Autoencoder...")
    autoencoder, history = train_autoencoder(train_data, val_data)

    # Save model and preprocessing artifacts
    create_directory(MODEL_DIR)
    autoencoder.save(f"{MODEL_DIR}/autoencoder_model.keras", save_format="keras")
    joblib.dump(scaler, f"{MODEL_DIR}/scaler.pkl")

    plot_loss(history)
    print("Model and scaler saved.")

    # Calculate reconstruction error threshold
    reconstruction_errors = calculate_reconstruction_error(autoencoder, train_data)
    threshold = np.percentile(reconstruction_errors, 95)
    joblib.dump(threshold, f"{MODEL_DIR}/threshold.pkl")
    print(f"Shared threshold calculated and saved: {threshold:.4f}")

# Detect anomalies for specific vehicle data
def detect_anomalies(vehicle_id, live_data):
    autoencoder = tf.keras.models.load_model(f"{MODEL_DIR}/shared_autoencoder_model.keras")
    scaler = joblib.load(f"{MODEL_DIR}/shared_scaler.pkl")
    threshold = joblib.load(f"{MODEL_DIR}/shared_threshold.pkl")

    # Preprocess live data
    df_live = pd.DataFrame(live_data)
    df_live['vehicle_id'] = vehicle_id
    required_fields = ['latitude', 'longitude', 'speed', 'heading', 'time_diff', 'vehicle_id']
    df_live = df_live[required_fields].fillna(0)
    scaled_data = scaler.transform(df_live)

    # Calculate reconstruction errors
    reconstruction_errors = calculate_reconstruction_error(autoencoder, scaled_data)
    anomalies = reconstruction_errors > threshold

    # Append anomaly status to data
    df_live['reconstruction_error'] = reconstruction_errors
    df_live['is_anomaly'] = anomalies
    return df_live

# Main Function
def main():
    vehicle_ids = [1, 2, 3]  # Add your vehicle IDs here
    print("Training shared model for all vehicles...")
    train_general_model(vehicle_ids)

    # Simulate live data
    live_data = [
        {"latitude": 40.7128, "longitude": -74.0060, "speed": 50, "heading": 180, "time_diff": 10},
        {"latitude": 40.7306, "longitude": -73.9352, "speed": 120, "heading": 200, "time_diff": 5},  # Anomaly
    ]

    # Detect anomalies in live data for a specific vehicle
    print("Detecting anomalies in live data for vehicle ID 1...")
    result = detect_anomalies(1, live_data)
    print(result)

if __name__ == "__main__":
    main()
