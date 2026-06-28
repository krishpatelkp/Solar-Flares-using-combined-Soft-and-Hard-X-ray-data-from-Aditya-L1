import pytest
import pandas as pd
import numpy as np
from app.services.processing import processing_service
from app.services.ml_inference import ml_service

def test_dynamic_baseline():
    # Create a dummy flat signal
    dates = pd.date_range("2024-01-01", periods=600, freq="1s")
    signal = pd.Series(np.ones(600) * 10, index=dates)
    
    median, std = processing_service.compute_dynamic_baseline(signal, window_minutes=5)
    
    # After 300 seconds (5 min), median should exactly match
    assert median.iloc[-1] == 10.0
    # Flat line means zero std dev
    assert std.iloc[-1] == 0.0

def test_calculate_hope_precursor_normal():
    # Normal fluxes
    res = ml_service.calculate_hope_precursor(1.5e-5, 2.1e-6)
    assert res["temperature_mk"] > 2.0
    assert res["emission_measure"] > 0.0

def test_calculate_hope_precursor_zero_division():
    # Test edge case: zero or negative hxr band
    res = ml_service.calculate_hope_precursor(1.5e-5, 0.0)
    assert res["temperature_mk"] == 0.0
    assert res["emission_measure"] == 0.0
