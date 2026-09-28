import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path
import warnings

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Suppress sklearn version mismatch warnings
warnings.filterwarnings("ignore")

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ml-api")

BASE_DIR = Path(__file__).resolve().parent

# Exact 8 features expected by the California Housing model in exact order
FEATURE_NAMES = [
    "MedInc",
    "HouseAge",
    "AveRooms",
    "AveBedrms",
    "Population",
    "AveOccup",
    "Latitude",
    "Longitude",
]

# Global reference for model
model = None


def resolve_model_path() -> Path:
    """
    Safely locates the Random Forest model file across candidate paths.
    Prioritizes ml-api/models/random_forest_model_50.pkl as the primary model,
    with fallbacks to the original filename and sibling directories.
    """
    env_path = os.getenv("MODEL_PATH")
    if env_path:
        env_p = Path(env_path)
        if env_p.is_file():
            return env_p
        if (BASE_DIR / env_p).is_file():
            return (BASE_DIR / env_p).resolve()

    candidate_paths = [
        # Primary: ml-api/models/random_forest_model_50.pkl
        BASE_DIR / "models" / "random_forest_model_50.pkl",
        # Fallbacks for the _50 variant in other locations
        BASE_DIR / ".." / "models" / "random_forest_model_50.pkl",
        BASE_DIR.parent / "models" / "random_forest_model_50.pkl",
        BASE_DIR.parent / "streamlit-app" / "random_forest_model_50.pkl",
        # Legacy fallbacks (original filename)
        BASE_DIR / "models" / "random_forest_model.pkl",
        BASE_DIR / ".." / "models" / "random_forest_model.pkl",
        BASE_DIR.parent / "models" / "random_forest_model.pkl",
        BASE_DIR.parent / "streamlit-app" / "random_forest_model.pkl",
    ]

    for candidate in candidate_paths:
        try:
            resolved = candidate.resolve()
            if resolved.is_file():
                return resolved
        except Exception:
            continue

    # Default to the primary path
    return (BASE_DIR / "models" / "random_forest_model_50.pkl").resolve()


def load_model():
    """Safely loads the model using joblib."""
    global model
    model_path = resolve_model_path()
    if not model_path.is_file():
        logger.warning(f"Model file not found at: {model_path}")
        model = None
        return model

    try:
        logger.info(f"Loading trained model safely from: {model_path}")
        model = joblib.load(model_path)
        logger.info("Random Forest model successfully loaded.")
        return model
    except Exception as e:
        logger.error(f"Error loading model from {model_path}: {e}")
        model = None
        return model


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model on application startup
    load_model()
    yield


app = FastAPI(
    title="House Price Prediction ML API",
    description="FastAPI service for California Housing Random Forest price prediction",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for cross-service calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class PredictionInput(BaseModel):
    MedInc: float = Field(..., description="Median income in block group (in $10,000s)")
    HouseAge: float = Field(..., description="Median house age in block group")
    AveRooms: float = Field(..., description="Average number of rooms per household")
    AveBedrms: float = Field(..., description="Average number of bedrooms per household")
    Population: float = Field(..., description="Block group population")
    AveOccup: float = Field(..., description="Average number of household members")
    Latitude: float = Field(..., description="Block group latitude")
    Longitude: float = Field(..., description="Block group longitude")

    model_config = {
        "json_schema_extra": {
            "example": {
                "MedInc": 8.3252,
                "HouseAge": 41.0,
                "AveRooms": 6.984127,
                "AveBedrms": 1.023810,
                "Population": 322.0,
                "AveOccup": 2.555556,
                "Latitude": 37.88,
                "Longitude": -122.23,
            }
        }
    }


class PredictionResponse(BaseModel):
    raw_prediction: float
    usd_price: float


@app.get("/health")
def health_check():
    """Health check endpoint indicating service and model status."""
    is_loaded = model is not None
    return {
        "status": "healthy" if is_loaded else "degraded",
        "model_loaded": is_loaded,
    }


@app.post("/predict", response_model=PredictionResponse)
def predict(input_data: PredictionInput):
    """
    Generate house price prediction using the 8 features in exact order.
    No preprocessing is applied; raw prediction is multiplied by 100,000 for USD price.
    """
    if model is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Model is not loaded or unavailable.",
        )

    # 8 features in exact order
    input_values = [[
        input_data.MedInc,
        input_data.HouseAge,
        input_data.AveRooms,
        input_data.AveBedrms,
        input_data.Population,
        input_data.AveOccup,
        input_data.Latitude,
        input_data.Longitude,
    ]]

    # Create DataFrame with exact feature names expected by the model
    input_df = pd.DataFrame(input_values, columns=FEATURE_NAMES)

    try:
        # Use existing model directly with no preprocessing
        raw_pred = float(model.predict(input_df)[0])
        # California Housing dataset target represents $100,000 units
        usd_price = float(raw_pred * 100000.0)

        return PredictionResponse(
            raw_prediction=raw_pred,
            usd_price=usd_price,
        )
    except Exception as e:
        logger.error(f"Prediction failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Prediction error: {str(e)}",
        )
