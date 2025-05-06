from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import tensorflow as tf

app = FastAPI()

# Load the Keras model
model = tf.keras.models.load_model("model_1.keras")

# Input validation using Pydantic
class RequestData(BaseModel):
    http_requests: int

@app.post("/predict")
def predict_scale_decision(data: RequestData):
    # Prepare data for prediction
    input_array = np.array([[data.http_requests]])

    # Get model prediction
    prediction = model.predict(input_array)

    # If it's classification, you may need to convert from probabilities
    predicted_class = int(np.argmax(prediction)) if prediction.shape[1] > 1 else int(np.round(prediction[0][0]))

    return {
        "http_requests": data.http_requests,
        "scale_decision": predicted_class
    }
