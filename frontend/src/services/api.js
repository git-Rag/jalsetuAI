import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.trim() || '/api',
  timeout: 15000,
});

export const getVillages = () => api.get('/villages');
export const getVillage = (id) => api.get(`/villages/${id}`);
export const getAllGroundwater = () => api.get('/groundwater');
export const getGroundwater = (id) => api.get(`/groundwater/${id}`);
export const getGroundwaterSummary = () => api.get('/groundwater/summary');
export const getVillageData = (location) => api.get('/village-data', { params: { location } });
export const runPrediction = () => api.post('/predictions/run');
export const getAIInsights = (villageIds) => api.post('/ai/insights', { villageIds });
