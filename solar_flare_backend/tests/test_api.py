import pytest
from fastapi.testclient import TestClient

def test_health_check(client: TestClient):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_trigger_ingestion(client: TestClient):
    # This should return a mock ingestion and write a flare to the test DB
    response = client.post("/api/ingest")
    assert response.status_code == 200
    data = response.json()
    assert "status" in data
    assert "Flare M1.2 detected" in data["message"]

def test_list_flares(client: TestClient):
    # The previous test should have inserted 1 flare
    response = client.get("/api/flares")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    
    first_flare = data[0]
    assert first_flare["goes_class"] == "M1.2"
    assert first_flare["peak_sxr_flux"] == 1.2e-5

def test_get_forecast(client: TestClient):
    response = client.get("/api/forecast")
    assert response.status_code == 200
    data = response.json()
    assert "probability_5m" in data
    assert "temperature_mk" in data
    assert data["temperature_mk"] > 0
    assert "attention_weights" in data
    assert isinstance(data["attention_weights"], list)
    assert len(data["attention_weights"]) == 30
    assert "saliency_focus" in data

def test_simulate_solar_flare(client: TestClient):
    payload = {
        "temperature_mk": 22.5,
        "emission_measure": 8.0e48,
        "df_dt": 0.015
    }
    response = client.post("/api/simulate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_class" in data
    assert "class_probabilities" in data
    assert data["probability_5m"] > 0
    assert data["temperature_mk"] == 22.5
    assert "attention_weights" in data
    assert isinstance(data["attention_weights"], list)
    assert len(data["attention_weights"]) == 30
    assert "saliency_focus" in data

def test_websocket_telemetry_stream(client: TestClient):
    with client.websocket_connect("/ws/telemetry") as ws:
        data = ws.receive_json()
        assert "timestamp" in data
        assert "solexs_flux" in data
        assert "helios_hxr" in data
        assert "temperature_mk" in data
        assert data["satellite"] == "Aditya-L1"
        assert data["status"] == "NOMINAL"

