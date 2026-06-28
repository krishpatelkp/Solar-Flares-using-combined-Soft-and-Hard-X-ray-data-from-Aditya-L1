import numpy as np
import pandas as pd
from typing import Tuple

class SignalProcessingService:
    @staticmethod
    def compute_dynamic_baseline(flux_data: pd.Series, window_minutes: int = 5) -> Tuple[pd.Series, pd.Series]:
        """
        Compute rolling median (μ) and standard deviation (σ) to establish a dynamic baseline.
        Using 1-second cadence, 5 minutes = 300 samples.
        """
        window_samples = window_minutes * 60
        rolling_median = flux_data.rolling(window=window_samples, min_periods=1).median()
        rolling_std = flux_data.rolling(window=window_samples, min_periods=1).std().fillna(0)
        return rolling_median, rolling_std

    @staticmethod
    def detect_onset(flux_data: pd.Series, median: pd.Series, std: pd.Series) -> pd.Series:
        """
        Trigger condition: I(t) > μ(t) + 3σ(t) for 3 consecutive seconds.
        """
        threshold = median + (3 * std)
        exceeds = flux_data > threshold
        # Debounce: check if current and previous 2 seconds all exceed threshold
        trigger = exceeds & exceeds.shift(1).fillna(False) & exceeds.shift(2).fillna(False)
        return trigger
        
    @staticmethod
    def compute_neupert_correlation(sxr_flux: pd.Series, hxr_flux: pd.Series) -> float:
        """
        Cross-correlate derivative of Soft X-Ray with Hard X-Ray flux.
        """
        sxr_derivative = sxr_flux.diff().fillna(0)
        # Using pearson correlation
        correlation = sxr_derivative.corr(hxr_flux)
        return float(correlation) if not pd.isna(correlation) else 0.0

processing_service = SignalProcessingService()
