from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

class FlareBase(BaseModel):
    start_time: datetime
    peak_time: datetime
    end_time: datetime
    duration_seconds: int
    goes_class: Optional[str] = None
    peak_sxr_flux: Optional[float] = None
    peak_hxr_flux: Optional[float] = None
    neupert_score: Optional[float] = None

class FlareCreate(FlareBase):
    pass

class Flare(FlareBase):
    id: int
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class ForecastResponse(BaseModel):
    probability_5m: float
    probability_15m: float
    probability_30m: float
    lead_time_minutes: float
    temperature_mk: float
    emission_measure: float
    predicted_class: Optional[str] = None
    class_probabilities: Optional[dict[str, float]] = None
    attention_weights: Optional[list[float]] = None
    saliency_focus: Optional[str] = None

class SimulationRequest(BaseModel):
    temperature_mk: float = 14.5
    emission_measure: float = 5.5e47
    df_dt: float = 0.005

class SimulationResponse(BaseModel):
    probability_5m: float
    probability_15m: float
    probability_30m: float
    lead_time_minutes: float
    predicted_class: str
    class_probabilities: dict[str, float]
    temperature_mk: float
    emission_measure: float
    df_dt: float
    attention_weights: Optional[list[float]] = None
    saliency_focus: Optional[str] = None
