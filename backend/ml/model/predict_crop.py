import pickle
# from model.preprocess import preprocess_input
from model.preprocess import preprocess_input

with open("models/model.pkl", "rb") as f:
    model = pickle.load(f)

crop_dict = {
    1: "Rice", 2: "Maize", 3: "Jute", 4: "Cotton", 5: "Coconut", 6: "Papaya", 7: "Orange",
    8: "Apple", 9: "Muskmelon", 10: "Watermelon", 11: "Grapes", 12: "Mango", 13: "Banana",
    14: "Pomegranate", 15: "Lentil", 16: "Blackgram", 17: "Mungbean", 18: "Mothbeans",
    19: "Pigeonpeas", 20: "Kidneybeans", 21: "Chickpea", 22: "Coffee"
}


def predict_crop(input_values):
    features = preprocess_input(input_values)
    print('Feat:', model.predict(features))
    pred = model.predict(features)[0]
    print(pred)
    return crop_dict.get(pred, "Unknown Crop")
