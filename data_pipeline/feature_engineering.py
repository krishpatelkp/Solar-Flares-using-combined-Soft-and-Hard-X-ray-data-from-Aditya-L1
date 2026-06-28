"""
Phase 2: Feature Engineering & Physical Parameter Extraction
Extracts Temperature (T), Emission Measure (EM), and handles HOPE/Neupert effect.
"""
import numpy as np
import pandas as pd
import logging

logger = logging.getLogger(__name__)

class FeatureEngineer:
    @staticmethod
    def compute_plasma_parameters(sxr_flux: pd.Series) -> pd.DataFrame:
        """
        Computes Plasma Temperature (T) and Emission Measure (EM).
        Simulates the XRS-A/XRS-B ratio method from White et al. (2005).
        """
        logger.info("Computing T and EM...")
        # Mock formulas representing standard plasma physics curves
        temperature_mk = 2.0 + (np.log10(sxr_flux * 1e8 + 1) * 15)
        emission_measure = sxr_flux * 1e45 / (temperature_mk + 1)
        
        return pd.DataFrame({
            "temperature_mk": temperature_mk,
            "emission_measure": emission_measure
        }, index=sxr_flux.index)

    @staticmethod
    def compute_derivatives(flux: pd.Series) -> pd.Series:
        """
        Calculates dF/dt using numpy gradient for rapid rise detection.
        """
        # Convert index to numeric seconds for accurate dt
        dt_seconds = flux.index.astype(np.int64) / 10**9
        df_dt = np.gradient(flux.values, dt_seconds)
        return pd.Series(df_dt, index=flux.index, name=f"{flux.name}_derivative")

    @staticmethod
    def detect_hope_horizontal_branch(temp: pd.Series, em: pd.Series) -> pd.Series:
        """
        Detect HOPE phase: T is stable between 10-15 MK while EM rises rapidly.
        """
        is_temp_stable = (temp > 10) & (temp < 15)
        em_rising = em.diff(periods=60) > (em * 0.5) # EM grew 50% in 1 minute
        
        return is_temp_stable & em_rising
