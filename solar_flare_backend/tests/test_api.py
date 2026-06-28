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
    # Ensure temperature calculation doesn't throw division by zero errors
    assert data["temperature_mk"] > 0
