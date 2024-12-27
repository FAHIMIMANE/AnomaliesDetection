import pandas as pd
from sklearn.preprocessing import StandardScaler

def preprocess_data(data):
    """
    Converts data to a DataFrame and scales features for training.
    """
    df = pd.DataFrame(data)

    # Ensure required fields exist
    required_fields = ['latitude', 'longitude', 'speed', 'heading', 'status']
    for field in required_fields:
        if field not in df.columns:
            raise ValueError(f"Missing required field: {field}")

    # Drop rows with missing values
    df.dropna(subset=required_fields, inplace=True)

    # Encode categorical 'status' feature
    df = pd.get_dummies(df, columns=['status'], drop_first=True)

    # Scale numerical features
    scaler = StandardScaler()
    scaled_data = scaler.fit_transform(df[['latitude', 'longitude', 'speed', 'heading']])
    return df, scaled_data, scaler
