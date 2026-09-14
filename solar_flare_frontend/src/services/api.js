import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const getForecast = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/forecast`);
        return response.data;
    } catch (error) {
        console.error("Error fetching forecast", error);
        // Return dummy data if backend is not running yet
        return {
            probability_5m: 0.85,
            probability_15m: 0.60,
            probability_30m: 0.30,
            lead_time_minutes: 8.5,
            temperature_mk: 22.4,
            emission_measure: 4.2e48
        };
    }
};

export const getFlares = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/flares`);
        return response.data;
    } catch (error) {
        console.error("Error fetching flares", error);
        return [];
    }
};

export const triggerIngestion = async () => {
    try {
        const response = await axios.post(`${API_BASE_URL}/ingest`);
        return response.data;
    } catch (error) {
        console.error("Error triggering ingestion", error);
        return { status: "error", message: "Failed to connect to ISRO backend" };
    }
};

export const simulateFlare = async (params) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/simulate`, params);
        return response.data;
    } catch (error) {
        console.error("Error simulating flare event", error);
        return null;
    }
};
