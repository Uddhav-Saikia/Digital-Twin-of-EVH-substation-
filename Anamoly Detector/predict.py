# predict.py
import json
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
import pickle

# Import configuration
import config

class AnomalyDetector:
    """A class to detect anomalies using a pre-trained autoencoder."""
    def __init__(self):
        print("Loading model and scaler...")
        self.model = tf.keras.models.load_model(config.MODEL_PATH, custom_objects={"mae": "mae"})
        with open(config.SCALER_PATH, 'rb') as f:
            self.scaler = pickle.load(f)
        self.threshold = config.ANOMALY_THRESHOLD
        print("Anomaly Detector initialized.")

    def detect(self, data_window, metadata):
        """
        Detects if a given window of sensor data is an anomaly.

        Args:
            data_window (np.array): A 2D numpy array of shape (SEQUENCE_LENGTH, num_features).
            metadata (dict): Dictionary with sensor metadata.

        Returns:
            str: A JSON string with the analysis result.
        """
        if data_window.shape[0] != config.SEQUENCE_LENGTH:
            raise ValueError(f"Data window must have length {config.SEQUENCE_LENGTH}")

        # Scale and reshape the data window
        scaled_window = self.scaler.transform(data_window)
        reshaped_window = scaled_window.reshape(1, config.SEQUENCE_LENGTH, -1)
        
        # Get model reconstruction and calculate error
        reconstruction = self.model.predict(reshaped_window, verbose=0)
        reconstruction_error = np.mean(np.abs(reconstruction - reshaped_window))

        # Check for anomaly
        is_anomaly = bool(reconstruction_error > self.threshold)
        
        # Prepare JSON output
        output = {
            "timestamp": metadata.get("timestamp"),
            "sensorId": metadata.get("id"),
            "equipmentId": metadata.get("equipment"),
            "currentValue": data_window[-1].tolist(), # Most recent values
            "is_anomaly": is_anomaly,
            "anomalyScore": float(reconstruction_error),
            "threshold": self.threshold
        }
        
        return json.dumps(output, indent=4)

# --- Example Usage ---
if __name__ == '__main__':
    detector = AnomalyDetector()
    
    # --- 1. Simulate a NORMAL data window ---
    print("\n--- Testing with NORMAL data ---")
    normal_window = np.array([
        [75.1, 85.0, 0.20], [75.3, 85.1, 0.21], [75.2, 85.0, 0.19]
    ] * (config.SEQUENCE_LENGTH // 3)) # Just creating a sequence of 24
    
    normal_metadata = {
        "timestamp": "2025-10-12T15:50:00Z",
        "id": "MULTI-01",
        "equipment": "SUBSTATION-A"
    }
    
    normal_result = detector.detect(normal_window, normal_metadata)
    print(normal_result)
    
    # --- 2. Simulate an ANOMALOUS data window (with a temp spike) ---
    print("\n--- Testing with ANOMALOUS data ---")
    anomalous_window = normal_window.copy()
    anomalous_window[-1, 0] = 98.6  # Inject a sharp temperature spike at the end
    
    anomalous_metadata = {
        "timestamp": "2025-10-12T16:00:00Z",
        "id": "MULTI-01",
        "equipment": "SUBSTATION-A"
    }
    
    anomalous_result = detector.detect(anomalous_window, anomalous_metadata)
    print(anomalous_result)