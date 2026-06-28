from sqlalchemy import Column, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from app.db.database import Base

class Flare(Base):
    __tablename__ = "flares"

    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(DateTime(timezone=True), nullable=False)
    peak_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    duration_seconds = Column(Integer, nullable=False)
    
    # Flux and Classification
    goes_class = Column(String, index=True)
    peak_sxr_flux = Column(Float)
    peak_hxr_flux = Column(Float)
    
    # Metadata
    neupert_score = Column(Float)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
