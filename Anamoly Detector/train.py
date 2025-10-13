# train.py
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, RepeatVector, TimeDistributed
from sklearn.preprocessing import MinMaxScaler
import pickle
import json

# Import configuration
import config

def load_and_preprocess_data():
    """Loads and preprocesses the training data."""
    df = pd.read_csv(config.TRAINING_DATA_FILE, index_col='timestamp', parse_dates=True)
    
    # Scale the data
    scaler = MinMaxScaler()
    scaled_data = scaler.fit_transform(df)
    
    # Save the scaler for use in prediction
    with open(config.SCALER_PATH, 'wb') as f:
        pickle.dump(scaler, f)
    
    print("Data scaled and scaler saved.")
    return scaled_data

def create_sequences(data):
    """Creates overlapping sequences from the time-series data."""
    sequences = []
    for i in range(len(data) - config.SEQUENCE_LENGTH + 1):
        sequences.append(data[i:i + config.SEQUENCE_LENGTH])
    return np.array(sequences)

def build_model(input_shape):
    """Builds and compiles the LSTM autoencoder model."""
    model = Sequential([
        LSTM(128, activation='relu', input_shape=input_shape, return_sequences=False),
        RepeatVector(input_shape[0]),
        LSTM(128, activation='relu', return_sequences=True),
        TimeDistributed(Dense(input_shape[1]))
    ])
    model.compile(optimizer='adam', loss='mae')
    model.summary()
    return model

def main():
    """Main training pipeline."""
    # 1. Load and preprocess
    scaled_data = load_and_preprocess_data()
    X_train = create_sequences(scaled_data)
    print(f"Training data shape: {X_train.shape}")

    # 2. Build the model
    model = build_model(input_shape=(X_train.shape[1], X_train.shape[2]))

    # 3. Train the model
    print("\n--- Starting Model Training ---")
    history = model.fit(
        X_train, X_train,
        epochs=50,
        batch_size=32,
        validation_split=0.1,
        callbacks=[tf.keras.callbacks.EarlyStopping(monitor='val_loss', patience=5, mode='min')]
    )
    print("--- Model Training Complete ---")

    # 4. Save the trained model
    model.save(config.MODEL_PATH)
    print(f"Model saved to {config.MODEL_PATH}")

    # 5. Determine the anomaly threshold
    train_reconstructions = model.predict(X_train)
    train_mae_loss = np.mean(np.abs(train_reconstructions - X_train), axis=(1, 2))
    
    # Set threshold to the 99th percentile of training loss
    threshold = np.percentile(train_mae_loss, 99)
    config.ANOMALY_THRESHOLD = threshold
    
    print(f"\nCalculated Anomaly Threshold: {threshold}")
    
    # Update config file with the new threshold
    with open('config.py', 'w') as f:
        f.write(f"TRAINING_DATA_FILE = '{config.TRAINING_DATA_FILE}'\n")
        f.write(f"MODEL_PATH = '{config.MODEL_PATH}'\n")
        f.write(f"SCALER_PATH = '{config.SCALER_PATH}'\n")
        f.write(f"SEQUENCE_LENGTH = {config.SEQUENCE_LENGTH}\n")
        f.write(f"ANOMALY_THRESHOLD = {threshold}\n") # Write the calculated value
    
    print("Configuration updated with new threshold.")

if __name__ == '__main__':
    main()