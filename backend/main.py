"""
FastAPI backend for Student Exam Performance Predictor.
Wraps the existing ML pipeline without modifying any ML code.
"""

import sys
from enum import Enum
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from src.pipeline.predict_pipelien import CustomData, PredictPipeline

# ---------------------------------------------------------------------------
# App
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Student Performance Predictor API",
    description="Predict student math scores based on demographic and academic factors.",
    version="1.0.0",
)

# CORS — allow all origins for Render cross-service communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Pydantic models
# ---------------------------------------------------------------------------

class GenderEnum(str, Enum):
    male = "male"
    female = "female"

class EthnicityEnum(str, Enum):
    group_a = "group A"
    group_b = "group B"
    group_c = "group C"
    group_d = "group D"
    group_e = "group E"

class EducationEnum(str, Enum):
    associates = "associate's degree"
    bachelors = "bachelor's degree"
    high_school = "high school"
    masters = "master's degree"
    some_college = "some college"
    some_high_school = "some high school"

class LunchEnum(str, Enum):
    free_reduced = "free/reduced"
    standard = "standard"

class CourseEnum(str, Enum):
    none = "none"
    completed = "completed"

class PredictRequest(BaseModel):
    gender: GenderEnum
    race_ethnicity: EthnicityEnum
    parental_level_of_education: EducationEnum
    lunch: LunchEnum
    test_preparation_course: CourseEnum
    reading_score: int = Field(..., ge=0, le=100, description="Reading score (0-100)")
    writing_score: int = Field(..., ge=0, le=100, description="Writing score (0-100)")

    model_config = {"json_schema_extra": {
        "examples": [{
            "gender": "male",
            "race_ethnicity": "group B",
            "parental_level_of_education": "bachelor's degree",
            "lunch": "standard",
            "test_preparation_course": "none",
            "reading_score": 72,
            "writing_score": 68,
        }]
    }}

class PredictResponse(BaseModel):
    prediction: float

# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------

@app.get("/health")
async def health():
    """Health-check endpoint for Render."""
    return {"status": "healthy"}


@app.post("/predict", response_model=PredictResponse)
async def predict(data: PredictRequest):
    """Run the ML prediction pipeline and return the predicted math score."""
    try:
        custom_data = CustomData(
            gender=data.gender.value,
            race_ethnicity=data.race_ethnicity.value,
            parental_level_of_education=data.parental_level_of_education.value,
            lunch=data.lunch.value,
            test_preparation_course=data.test_preparation_course.value,
            reading_score=data.reading_score,
            writing_score=data.writing_score,
        )
        pred_df = custom_data.get_data_as_dataframe()

        pipeline = PredictPipeline()
        preds = pipeline.predict(features=pred_df)

        # Clip to 0-100 like the original Flask app
        prediction = float(max(0, min(100, preds[0])))

        return PredictResponse(prediction=prediction)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")
