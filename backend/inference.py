import pandas as pd
import numpy as np
import tensorflow as tf
import joblib
import warnings
warnings.filterwarnings("ignore")
from pandas.tseries.offsets import DateOffset

# Configuration (MUST match training)
WINDOW_SIZE = 60
VOLATILITY_WINDOW = 15


# Custom layer for loading
@tf.keras.utils.register_keras_serializable(package="CustomLayers")
class PositionalEncoding(tf.keras.layers.Layer):
    def __init__(self, d_model, **kwargs):
        super().__init__(**kwargs)
        self.d_model = d_model
        
    def get_config(self):
        return {'d_model': self.d_model}
    
    def call(self, inputs):
        seq_length = tf.shape(inputs)[1]
        position = tf.range(seq_length, dtype=tf.float32)
        i = tf.range(self.d_model, dtype=tf.float32)
        
        angle_rates = 1 / tf.pow(10000.0, (2 * (i // 2))) / tf.cast(self.d_model, tf.float32)
        angle_rads = position[:, tf.newaxis] * angle_rates[tf.newaxis, :]
        
        mask = tf.cast(tf.math.floormod(i, 2), tf.float32)
        pos_encoding = tf.where(
            tf.math.equal(mask, 0),
            tf.sin(angle_rads),
            tf.cos(angle_rads)
        )
        return inputs + pos_encoding[tf.newaxis, ...]



# Load assets
model = tf.keras.models.load_model("autoscaler_model.keras", 
                                  custom_objects={'PositionalEncoding': PositionalEncoding})
scaler = joblib.load("scaler.save")



def preprocess_new_data(file_path):
    new_data = pd.read_csv(file_path, 
                          parse_dates=['timestamp'],
                          index_col='timestamp')
    
    new_data['volatility'] = new_data['http_requests'].rolling(VOLATILITY_WINDOW).std().fillna(0)
    new_data['hour'] = new_data.index.hour / 23.0
    new_data['minute'] = new_data.index.minute / 59.0
    new_data['day_of_week'] = new_data.index.dayofweek / 6.0
    new_data['is_weekend'] = new_data.index.dayofweek.isin([5,6]).astype(float)
    
    new_data[['http_requests', 'volatility']] = scaler.transform(
        new_data[['http_requests', 'volatility']]
    )
    
    if len(new_data) < WINDOW_SIZE:
        raise ValueError(f"Need at least {WINDOW_SIZE} data points")
        
    return new_data, new_data.drop(columns=['http_requests']).iloc[-WINDOW_SIZE:].values

def generate_forecast(model, new_data_df, initial_window, steps):
    current_window = initial_window.copy()
    forecasts = []
    last_timestamp = pd.to_datetime(new_data_df.index[-1])
    
    for i in range(steps):
        pred = model.predict(current_window[np.newaxis, ...], verbose=0)[0][0]
        forecasts.append(pred)
        
        new_time = last_timestamp + DateOffset(minutes=i+1)
        time_features = [
            new_time.hour / 23.0,
            new_time.minute / 59.0,
            new_time.dayofweek / 6.0,
            float(new_time.dayofweek in [5,6])
        ]
        
        new_row = np.array([
            0.0,  # volatility placeholder
            *time_features
        ])
        
        current_window = np.vstack([current_window[1:], new_row])
    
    scaled_forecasts = np.array(forecasts).reshape(-1, 1)
    dummy_vol = np.zeros_like(scaled_forecasts)
    return scaler.inverse_transform(np.hstack([scaled_forecasts, dummy_vol]))[:, 0]

if __name__ == "__main__":
    new_data, new_data_window = preprocess_new_data("30_day_traffic_with_metrics.csv")
    forecast_values = generate_forecast(model, new_data, new_data_window, 60)
    
    start_time = pd.to_datetime(new_data.index[-1]) + DateOffset(minutes=1)
    forecast_dates = pd.date_range(
        start=start_time,
        periods=60,
        freq='T'
    )
    
    output_df = pd.DataFrame({
        'timestamp': forecast_dates,
        'forecasted_requests': forecast_values
    })
    
    output_df.to_csv("hourly_forecast.csv", index=False)
    print("Forecast saved to hourly_forecast.csv")
    # print(forecast_values)