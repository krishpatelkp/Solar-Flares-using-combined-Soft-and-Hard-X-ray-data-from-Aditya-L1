"""
Phase 3: Nowcasting Algorithm Development
Real-time detection system with sliding baseline and sigma thresholds.
"""
import pandas as pd
import numpy as np

def map_goes_class(sxr_flux_peak: float) -> str:
    """Map peak SXR flux to equivalent GOES class."""
    if sxr_flux_peak < 1e-7:
        return "A"
    elif sxr_flux_peak < 1e-6:
        return "B"
    elif sxr_flux_peak < 1e-5:
        return "C"
    elif sxr_flux_peak < 1e-4:
        return "M"
    else:
        return "X"

class Nowcaster:
    @staticmethod
    def detect_onset(flux: pd.Series, sigma_multiplier: int = 3) -> pd.Series:
        """
        Trigger when count-rate > 3σ above the 5-minute sliding baseline
        for >= 3 consecutive seconds.
        """
        rolling_median = flux.rolling(window=300, min_periods=1).median()
        rolling_std = flux.rolling(window=300, min_periods=1).std().fillna(0)
        
        threshold = rolling_median + (sigma_multiplier * rolling_std)
        exceeds = flux > threshold
        
        # Require 3 consecutive seconds of threshold crossing
        trigger = exceeds & exceeds.shift(1).fillna(False) & exceeds.shift(2).fillna(False)
        return trigger
