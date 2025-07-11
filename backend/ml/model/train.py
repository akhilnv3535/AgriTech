import pandas as pd
import numpy as np
import pickle
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from pathlib import Path

# Load dataset
data_path = Path("data/Crop_recommendation new.csv")
crop = pd.read_csv(data_path)

# Map crop labels to numbers
crop_dict = {
    'rice': 1, 'maize': 2, 'jute': 3, 'cotton': 4, 'coconut': 5, 'papaya': 6, 'orange': 7, 'apple': 8,
    'muskmelon': 9, 'watermelon': 10, 'grapes': 11, 'mango': 12, 'banana': 13, 'pomegranate': 14,
    'lentil': 15, 'blackgram': 16, 'mungbean': 17, 'mothbeans': 18, 'pigeonpeas': 19,
    'kidneybeans': 20, 'chickpea': 21, 'coffee': 22
}
crop['crop_num'] = crop['label'].map(crop_dict)

# Prepare features and labels
X = crop.drop(['label', 'crop_num'], axis=1)
y = crop['crop_num']

# Apply scaling
minmax_scaler = MinMaxScaler()
X_scaled = minmax_scaler.fit_transform(X)

std_scaler = StandardScaler()
X_final = std_scaler.fit_transform(X_scaled)

# Train model
model = RandomForestClassifier()
model.fit(X_final, y)

# Save model and scalers
Path("models").mkdir(exist_ok=True)
with open("models/model.pkl", "wb") as f:
    pickle.dump(model, f)

with open("models/minmaxscaler.pkl", "wb") as f:
    pickle.dump(minmax_scaler, f)

with open("models/standscaler.pkl", "wb") as f:
    pickle.dump(std_scaler, f)

print("✅ Model and scalers saved successfully.")
