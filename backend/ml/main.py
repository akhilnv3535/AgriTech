from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from model.predict_crop import predict_crop
import uvicorn
app = FastAPI()


# Allow your React frontend origin
origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # or ["*"] to allow all origins
    allow_credentials=True,
    allow_methods=["*"],         # allow all HTTP methods (GET, POST, etc)
    allow_headers=["*"],         # allow all headers
)
# Define a Pydantic model for the request body


class Nutrients(BaseModel):
    Nitrogen: float
    Phosporus: float
    Potassium: float
    Temperature: float
    Humidity: float
    Ph: float
    Rainfall: float


@app.get("/")
async def ping():
    return {"response": "true"}


@app.post("/predict")
async def create_nutrients(data: Nutrients):
    inputs = [
        data.Nitrogen,
        data.Phosporus,
        data.Potassium,
        data.Temperature,
        data.Humidity,
        data.Ph,
        data.Rainfall 
    ]
    inputs = list(map(float, inputs))
    result = predict_crop(inputs)

    # return {
    #     "message": "Nutrients received successfully",
    #     "Nitrogen": data.Nitrogen,
    #     "Phosporus": data.Phosporus
    # }
    return result

if __name__ == "__main__":
    uvicorn.run(app, port=5000, host="0.0.0.0")
