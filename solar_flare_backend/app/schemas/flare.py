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
