import pandas as pd
import numpy as np
import datetime

# --- 1. Configuration ---
# Define the time range for the dataset (e.g., 4 months of hourly data)
start_date = "2025-01-01"
end_date = "2025-04-30"
data_frequency = 'H' # 'H' for hourly, 'T' for minutely

# --- 2. Create Time Index ---
# This forms the backbone of our time-series data
date_rng = pd.date_range(start=start_date, end=end_date, freq=data_frequency)
df = pd.DataFrame(date_rng, columns=['timestamp'])
df.set_index('timestamp', inplace=True)

# --- 3. Simulate Normal Sensor Data ---

# Sensor 1: Transformer Temperature (TRF-01_Temp_C)
# Characteristics: Base temperature with a daily sine wave cycle (hotter in the day) and some noise.
base_temp = 75.0  # degrees Celsius
daily_amplitude = 10.0  # Fluctuation of +/- 10 degrees
noise_temp = np.random.normal(0, 0.5, size=len(df))
# Create the sine wave for the daily cycle (24 hours)
hours = df.index.hour
temp_cycle = daily_amplitude * np.sin((hours / 24) * 2 * np.pi - (np.pi/2)) # Shifted to peak in the afternoon
df['TRF-01_Temp_C'] = base_temp + temp_cycle + noise_temp

# Sensor 2: Circuit Breaker Pressure (CB-04_Pressure_PSI)
# Characteristics: Stable baseline, slightly influenced by temperature, with minor noise.
base_pressure = 85.0 # PSI
temp_correlation_factor = 0.05
noise_pressure = np.random.normal(0, 0.1, size=len(df))
# The pressure slightly increases as the correlated temperature rises
df['CB-04_Pressure_PSI'] = base_pressure + (df['TRF-01_Temp_C'] - base_temp) * temp_correlation_factor + noise_pressure

# Sensor 3: Generator Vibration (GEN-02_Vib_mm_s)
# Characteristics: Low, stable baseline with very little noise.
base_vibration = 0.2 # mm/s
noise_vibration = np.random.normal(0, 0.02, size=len(df))
df['GEN-02_Vib_mm_s'] = base_vibration + noise_vibration


# --- 4. Final Touches & Save ---

# Round the values for realism
df = df.round(2)

# Save the dataset to a CSV file
output_filename = 'normal_operation_data.csv'
df.to_csv(output_filename)

# --- 5. Display Information ---
print(f"✅ Synthetic training dataset generated successfully!")
print(f"   Saved to: {output_filename}")
print(f"   Data points: {len(df)}")
print(f"   Date range: {df.index.min()} to {df.index.max()}")
print("\n--- Data Preview ---")
print(df.head())
print("\n--- Data Statistics ---")
print(df.describe())