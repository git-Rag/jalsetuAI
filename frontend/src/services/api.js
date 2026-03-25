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
/**
 * @param {{ lat: number, lon: number, lang?: string } | { q: string, lang?: string } | string} params
 * String form: village name (forward geocode) or legacy "lat, lon" (parsed client-side in Home).
 */
export const getVillageData = (params) => {
  if (typeof params === 'string') {
    return api.get('/village-data', { params: { q: params.trim(), lang: 'en' } });
  }
  return api.get('/village-data', { params });
};
export const runPrediction = () => api.post('/predictions/run');
export const getAIInsights = (villageIds) => api.post('/ai/insights', { villageIds });
