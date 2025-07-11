import numpy as np
import pickle

with open("models/minmaxscaler.pkl", "rb") as f:
    minmax_scaler = pickle.load(f)

with open("models/standscaler.pkl", "rb") as f:
    std_scaler = pickle.load(f)


def preprocess_input(input_list):
    input_array = np.array(input_list).reshape(1, -1)
    minmax_scaled = minmax_scaler.transform(input_array)
    final_scaled = std_scaler.transform(minmax_scaled)
    return final_scaled
