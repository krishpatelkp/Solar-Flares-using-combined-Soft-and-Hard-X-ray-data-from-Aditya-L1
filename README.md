<div align="center">

# Solar Flare Nowcasting & Forecasting
### Using Combined Soft & Hard X-ray Data from Aditya-L1

[![Python](https://img.shields.io/badge/Python-3.10%2B-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-1.0.0-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0%2B-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

*An end-to-end automated space weather intelligence system for real-time solar flare detection and multi-horizon probabilistic forecasting using ISRO Aditya-L1 satellite data.*

</div>

---

## About the Project

This project builds a complete **Solar Flare Nowcasting & Forecasting Pipeline** leveraging the **SoLEXS** (Soft X-ray Spectrometer) and **HEL1OS** (High Energy L1 Orbiting X-ray Spectrometer) payloads aboard ISRO''s **Aditya-L1** spacecraft — India''s first dedicated solar observatory placed at the Sun-Earth Lagrange Point 1 (L1).

The system combines classical astrophysics techniques (Neupert Effect, HOPE precursor analysis) with a state-of-the-art **hybrid deep learning model (SolarFlareNet)** to deliver:

- **Nowcasting** — Real-time detection of solar flare onset within seconds of occurrence
- **Forecasting** — Probabilistic prediction of flare events at **5-minute**, **15-minute**, and **30-minute** lead times

### Why Aditya-L1?

| Instrument | Band | Role |
|------------|------|------|
| **SoLEXS** | Soft X-ray (1-15 keV) | Thermal plasma diagnostics, flare onset |
| **HEL1OS** | Hard X-ray (10-150 keV) | Non-thermal electron detection, Neupert validation |

Combined SXR + HXR data enables significantly higher accuracy than single-instrument approaches used by NOAA GOES satellites.

---

## System Architecture

```
+-------------------------------------------------------------+
|                    Aditya-L1 Satellite                      |
|              SoLEXS (SXR) + HEL1OS (HXR)                  |
+-------------------------+-----------------------------------+
                          | FITS data via ISRO PRADAN Portal
                          v
+-------------------------------------------------------------+
|                     Data Pipeline                           |
|  ingestion.py -> preprocessing.py -> feature_engineering.py |
|  - 1-sec cadence sync   - 5-min sliding median background  |
|  - 3-sigma trigger      - Neupert Effect cross-validation  |
+-------------------------+-----------------------------------+
                          |
                          v
+-------------------------------------------------------------+
|                      ML Pipeline                            |
|                    SolarFlareNet                            |
|   Conv1D -> BiLSTM -> Transformer Encoder -> FC Classifier  |
|        train.py / run_training.py / nowcast.py             |
+-------------------------+-----------------------------------+
                          |
                          v
+------------------------------------------+
|         FastAPI Backend (REST API)        |
|   /api/ingest  /api/flares  /api/forecast |
+--------------------+---------------------+
                     |
                     v
+-------------------------------------------------------------+
|            React + Vite Dashboard (Frontend)                |
|  Real-time alerts - Telemetry charts - Flare catalogue     |
|  Probability gauges - Model comparison - Pipeline flow     |
+-------------------------------------------------------------+
```

---

## Key Features

### Astrophysics-Driven Detection
- **Multi-stage Nowcast Trigger**: Count rate > 3-sigma above background, sustained for >= 3 consecutive seconds
- **Neupert Effect Validation**: Cross-validates integral(HXR)dt approx SXR(t) to reject non-thermal false positives
- **HOPE Precursor Analysis**: Derives coronal Temperature (Te) and Emission Measure (EM) as predictive features

### Hybrid Deep Learning Model — SolarFlareNet

| Layer | Architecture | Purpose |
|-------|-------------|---------|
| 1 | **Conv1D + BatchNorm** | Extract local temporal features (rapid dF/dt rises) |
| 2 | **Bidirectional LSTM (128 units)** | Capture sequential long-term dependencies |
| 3 | **Transformer Encoder (8-head, 2-layer)** | Model long-range contextual relationships |
| 4 | **Focal Loss + FC Classifier** | Aggressive penalization of rare X-class misclassifications |

### Real-Time Dashboard
- **Live Telemetry Charts** — SXR/HXR flux time series with Recharts
- **Probability Gauges** — 5m / 15m / 30m flare probability meters
- **Master Flare Catalogue** — Searchable database of detected events
- **Alert Panel** — Color-coded GOES-class alerts (A/B/C/M/X)
- **Pipeline Flow** — Visual data flow from satellite to prediction
- **Model Comparison** — Side-by-side ML model performance metrics

---

## Project Structure

```
Solar_Flares/
|
+-- data_pipeline/                  # Raw data ingestion & preprocessing
|   +-- ingestion.py                # FITS file fetching from ISRO PRADAN portal
|   +-- preprocessing.py            # Background removal, cadence synchronization
|   +-- feature_engineering.py      # dF/dt, HOPE precursor feature extraction
|
+-- ml_pipeline/                    # Machine learning models & training
|   +-- models/
|   |   +-- hybrid.py               # SolarFlareNet (Conv1D + BiLSTM + Transformer)
|   +-- notebooks/
|   |   +-- model_evaluation.ipynb  # Model performance & visualization notebook
|   +-- train.py                    # Model training loop
|   +-- run_training.py             # Training entry point with config
|   +-- nowcast.py                  # Real-time nowcasting inference
|   +-- historical_data_generator.py
|   +-- historical_flares.csv       # Historical flare event dataset
|
+-- solar_flare_backend/            # FastAPI REST API
|   +-- app/
|   |   +-- api/endpoints.py        # API routes: /ingest, /flares, /forecast
|   |   +-- core/                   # Config, logging setup
|   |   +-- db/                     # SQLAlchemy models & database session
|   |   +-- schemas/flare.py        # Pydantic request/response schemas
|   |   +-- services/               # Ingestion, processing, ML inference services
|   +-- tests/                      # Pytest test suite
|   +-- init_db.py                  # Database initialization script
|   +-- requirements.txt            # Python dependencies
|
+-- solar_flare_frontend/           # React + Vite interactive dashboard
|   +-- src/
|   |   +-- components/             # 14+ React components
|   |   |   +-- LandingPage.jsx
|   |   |   +-- TelemetryChart.jsx
|   |   |   +-- ProbabilityGauge.jsx
|   |   |   +-- AlertPanel.jsx
|   |   |   +-- FlareCatalogue.jsx
|   |   |   +-- NowcastAlerts.jsx
|   |   |   +-- ModelComparison.jsx
|   |   |   +-- PipelineFlow.jsx
|   |   |   +-- ...
|   |   +-- services/api.js         # Axios API client
|   |   +-- App.jsx                 # Root app component
|   +-- package.json
|
+-- docs/
|   +-- technical_report.md         # Detailed algorithm documentation
|   +-- national_impact.md          # Societal and strategic impact analysis
|
+-- SolarFlare_Nowcasting_Forecasting_Aditya_L1.pptx
+-- generate_ppt.py
+-- .gitignore
+-- README.md
```

---

## Getting Started

### Prerequisites

- Python **3.10+**
- Node.js **18+** and npm
- PyTorch **2.0+** (for ML training)
- Git

---

### 1. Clone the Repository

```bash
git clone https://github.com/PatelShyam04/Solar-Flares-using-combined-Soft-and-Hard-X-ray-data-from-Aditya-L1.git
cd Solar-Flares-using-combined-Soft-and-Hard-X-ray-data-from-Aditya-L1
```

---

### 2. Backend Setup (FastAPI)

```bash
cd solar_flare_backend

# Create and activate virtual environment
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize the database
python init_db.py

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The API will be available at:
- **API Base**: `http://localhost:8000`
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`
- **Health Check**: `http://localhost:8000/health`

---

### 3. Frontend Setup (React + Vite)

```bash
cd solar_flare_frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The dashboard will be available at **`http://localhost:5173`**

---

### 4. ML Pipeline — Training the Model

```bash
cd ml_pipeline

# Generate synthetic historical training data (if needed)
python historical_data_generator.py

# Run the full training pipeline
python run_training.py

# Run real-time nowcasting (requires backend running)
python nowcast.py
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Service health check |
| `GET` | `/api/flares` | Retrieve Master Flare Catalogue |
| `POST` | `/api/ingest` | Trigger manual data ingestion from ISRO PRADAN |
| `GET` | `/api/forecast` | Get current probabilistic forecast (5m/15m/30m) |

### Example: Get Forecast

```bash
curl http://localhost:8000/api/forecast
```

```json
{
  "probability_5m": 0.72,
  "probability_15m": 0.58,
  "probability_30m": 0.41,
  "lead_time_minutes": 5,
  "temperature_mk": 12.4,
  "emission_measure": 1.2e+48
}
```

---

## Running Tests

```bash
cd solar_flare_backend

# Activate virtual environment first
.venv\Scripts\activate   # Windows

# Run the full test suite
pytest tests/ -v
```

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **FastAPI** | >= 0.100 | REST API framework |
| **SQLAlchemy** | >= 2.0 | ORM & database management |
| **Pydantic** | >= 2.0 | Data validation & schemas |
| **Uvicorn** | >= 0.23 | ASGI server |
| **Astropy** | >= 5.3 | FITS file processing |
| **NumPy / Pandas** | Latest | Numerical computing |

### Machine Learning
| Technology | Purpose |
|------------|---------|
| **PyTorch** | SolarFlareNet deep learning model |
| **Conv1D + BiLSTM + Transformer** | Hybrid architecture |
| **Focal Loss** | Handles class imbalance for rare X-flares |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19 | UI framework |
| **Vite** | 8.0 | Build tool & dev server |
| **Recharts** | 3.9 | Telemetry & chart visualizations |
| **Axios** | 1.18 | HTTP client for API calls |
| **Lucide React** | 1.21 | Icon library |

---

## National Impact

This system directly supports:

- **Early Warning Systems** for satellites, power grids, and communication networks
- **Space Asset Protection** for ISRO operational satellites
- **Aviation Safety** by forecasting HF radio blackouts over polar routes
- **Scientific Research** contribution to understanding solar-terrestrial relationships
- **ISRO Space Weather Center** operational capability enhancement

See [`docs/national_impact.md`](docs/national_impact.md) for detailed analysis.

---

## Technical Documentation

For in-depth algorithm documentation including:
- Background subtraction methodology
- Neupert Effect mathematical formulation
- SolarFlareNet architecture details
- HOPE precursor derivation

See [`docs/technical_report.md`](docs/technical_report.md).

---

## Flare Classification (GOES Scale)

| Class | Peak SXR Flux (W/m^2) | Impact |
|-------|----------------------|--------|
| **A** | < 10^-7 | Minimal |
| **B** | 10^-7 to 10^-6 | Minor |
| **C** | 10^-6 to 10^-5 | Moderate |
| **M** | 10^-5 to 10^-4 | **Significant** — HF radio blackouts |
| **X** | > 10^-4 | **Extreme** — widespread disruption |

---

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m "Add: your feature description"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## Author

**Shyam Patel**
- GitHub: [@PatelShyam04](https://github.com/PatelShyam04)
- Project: [Solar-Flares-using-combined-Soft-and-Hard-X-ray-data-from-Aditya-L1](https://github.com/PatelShyam04/Solar-Flares-using-combined-Soft-and-Hard-X-ray-data-from-Aditya-L1)

---

## Acknowledgements

- **ISRO** — For the Aditya-L1 mission and the PRADAN data portal
- **SoLEXS & HEL1OS Teams** — For instrument design and calibration data
- **NOAA Space Weather Prediction Center** — For GOES flare classification reference

---

<div align="center">

*Built with love for Indian Space Science*

**Aditya-L1 | Solar Physics | Deep Learning | ISRO**

</div>
