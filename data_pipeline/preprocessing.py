"""
Phase 1: Preprocessing
Time synchronization, deadtime correction, and background noise filtering.
"""
import pandas as pd
import numpy as np
from scipy.signal import savgol_filter
import logging

logger = logging.getLogger(__name__)

class DataPreprocessor:
    @staticmethod
    def synchronize_axes(df_sxr: pd.DataFrame, df_hxr: pd.DataFrame) -> pd.DataFrame:
        """
        Align SoLEXS and HEL1OS to common UTC time axis using 1-second cadence.
        Handles missing data via interpolation.
        """
        logger.info("Synchronizing time axes...")
        # Outer join to align timestamps
        df_sync = df_sxr.join(df_hxr, how='outer', lsuffix='_sxr', rsuffix='_hxr')
        
        # Resample to strict 1-second cadence
        df_resampled = df_sync.resample('1s').mean()
        
        # Interpolate missing gaps < 5 seconds
        return df_resampled.interpolate(method='time', limit=5).fillna(0)

    @staticmethod
    def calibrate_and_clean(df: pd.DataFrame, col_name: str) -> pd.Series:
        """
        Apply deadtime correction (stubbed), background subtraction, and Savitzky-Golay filtering.
        """
        logger.info(f"Calibrating and filtering {col_name}...")
        flux = df[col_name]
        
        # 1. Background subtraction (using lowest 5th percentile as ambient background)
        bg_level = np.percentile(flux[flux > 0], 5)
        flux_subtracted = np.maximum(flux - bg_level, 1e-10)
        
        # 2. Savitzky-Golay filter for noise reduction (window 15, poly order 3)
        flux_filtered = savgol_filter(flux_subtracted, window_length=15, polyorder=3)
        return pd.Series(flux_filtered, index=df.index, name=col_name)
