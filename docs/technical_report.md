# Technical Report: Aditya-L1 Solar Flare Nowcasting & Forecasting Pipeline

## 1. Introduction
This report documents the architectural design and algorithms underpinning the automated space weather forecasting pipeline built for the ISRO Aditya-L1 mission payloads (SoLEXS and HEL1OS).

## 2. Data Preprocessing
Data is ingested from the ISRO PRADAN portal. 
*   **Synchronization**: Both SXR and HXR time series are aligned to a strict 1-second cadence.
*   **Background Removal**: A 5-minute sliding median filter is used to separate ambient solar background flux from transient flare events.

## 3. Nowcasting (Onset Detection)
The system employs a multi-stage trigger:
1.  Count rate must exceed $3\sigma$ above the background.
2.  Condition must be sustained for $\ge 3$ consecutive seconds.
3.  The Neupert Effect is cross-validated ($\int HXR(t) dt \approx SXR(t)$) to reject non-thermal false positives.

## 4. Deep Learning Forecasting
The predictive engine utilizes a Hybrid PyTorch Architecture (`SolarFlareNet`):
*   **Conv1D**: Extracts local temporal features (e.g., rapid $dF/dt$ rises).
*   **BiLSTM**: Captures longer-term sequential dependencies.
*   **Transformer Encoder**: Models long-range contextual relationships across the entire 30-minute input window.
*   **Focal Loss**: Ensures the model aggressively penalizes misclassifications on rare X-class flares.

## 5. Deployment
The engine runs on a FastAPI backend, delivering sub-second latency predictions to a React-based interactive dashboard monitoring 5m, 15m, and 30m forecasting horizons.
