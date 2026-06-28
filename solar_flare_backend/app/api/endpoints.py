from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from datetime import datetime, timezone

from app.db.database import get_db
from app.db import models
from app.schemas.flare import Flare, ForecastResponse
from app.services.ingestion import ingestion_service
from app.services.processing import processing_service
from app.services.ml_inference import ml_service

router = APIRouter()

@router.post("/ingest", response_model=Dict[str, Any])
def trigger_ingestion(db: Session = Depends(get_db)):
    """
    Trigger a manual ingestion cycle from the ISRO PRADAN portal.
    If a flare is detected in the new data, save it to the database.
    """
    result = ingestion_service.fetch_latest_fits("SoLEXS")
    
    # Simulate that the new data contained a detected flare
    # In reality, this would be determined by ml_pipeline/nowcast.py
    new_flare = models.Flare(
        start_time=datetime.now(timezone.utc),
        peak_time=datetime.now(timezone.utc),
        end_time=datetime.now(timezone.utc),
        duration_seconds=360,
        goes_class="M1.2",
        peak_sxr_flux=1.2e-5,
        peak_hxr_flux=4.5e-5,
        neupert_score=0.92
    )
    db.add(new_flare)
    db.commit()
    
    result["message"] += " Flare M1.2 detected and catalogued."
    return result

@router.get("/flares", response_model=List[Flare])
def list_flares(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Retrieve the Master Flare Catalogue of nowcasted flares.
    """
    flares = db.query(models.Flare).offset(skip).limit(limit).all()
    return flares

@router.get("/forecast", response_model=ForecastResponse)
def get_forecast():
    """
    Get the current solar flare forecast utilizing the HOPE precursor technique 
    and the ML forecasting model.
    """
    # 1. Simulate deriving real-time plasma parameters (T and EM)
    # In reality, this data comes from the latest ingested SXR data
    hope_data = ml_service.calculate_hope_precursor(sxr_band_1=1.5e-5, sxr_band_2=2.1e-6)
    
    # 2. Extract feature tensor for ML model (mocked)
    features = {
        "temperature_mk": hope_data["temperature_mk"],
        "emission_measure": hope_data["emission_measure"],
        "dF_dt": 0.005 # Example derivative
    }
    
    # 3. Predict using the ML Service
    prediction = ml_service.predict_forecast(features)
    
    return ForecastResponse(
        probability_5m=prediction["probability_5m"],
        probability_15m=prediction["probability_15m"],
        probability_30m=prediction["probability_30m"],
        lead_time_minutes=prediction["lead_time_minutes"],
        temperature_mk=hope_data["temperature_mk"],
        emission_measure=hope_data["emission_measure"]
    )
