const NOMINATIM_UA = process.env.NOMINATIM_USER_AGENT || 'JalSetu-AI/1.0 (water-intelligence; contact@jalsetu.local)';
const CGWB_RESOURCE_ID = '580a8f6e-3d86-4ca7-ac7d-cd5df12b443c'; // India Data Portal (CGWB) groundwater dataset (datastore)

// NOTE: Mock/simulated groundwater + reservoir classification has been disabled
// to test Groq intelligence first with only real fetched sources (reverse geocode + weather).
// If you later add a real groundwater/reservoir API, populate these fields from that source.

async function nominatimFetch(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': NOMINATIM_UA, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Nominatim HTTP ${res.status}`);
  return res.json();
}

/**
 * @returns {Promise<{ lat: number, lon: number, displayName: string } | null>}
 */
async function searchCoordinates(query) {
  if (!query || typeof query !== 'string') return null;
  const q = encodeURIComponent(query.trim());
  const url = `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1&addressdetails=1`;
  const data = await nominatimFetch(url);
  const hit = Array.isArray(data) && data[0];
  if (!hit) return null;
  return {
    lat: parseFloat(hit.lat),
    lon: parseFloat(hit.lon),
    displayName: hit.display_name || query,
  };
}

function formatLocationFromNominatim(data) {
  if (!data || typeof data !== 'object') return null;
  const a = data.address || {};
  const village =
    a.village ||
    a.hamlet ||
    a.neighbourhood ||
    a.suburb ||
    a.town ||
    a.city ||
    a.county;
  const district = a.state_district || a.county || a.region;
  const state = a.state;
  const parts = [village, district, state].filter(Boolean);
  if (parts.length) return parts.join(', ');
  return data.display_name || null;
}

/**
 * @returns {Promise<{ label: string, address: any }>}
 */
async function reverseGeocodeDetailed(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const data = await nominatimFetch(url);
  const label = formatLocationFromNominatim(data);
  const fallback = data?.display_name || `${Number(lat).toFixed(4)}, ${Number(lon).toFixed(4)}`;
  return { label: label || fallback, address: data?.address || null };
}

/**
 * @returns {Promise<string>}
 */
async function reverseGeocode(lat, lon) {
  const { label } = await reverseGeocodeDetailed(lat, lon);
  return label;
}

/**
 * OpenWeatherMap: current conditions + next ~24h forecast precipitation sum (mm).
 */
async function fetchOpenWeatherMetrics(lat, lon, apiKey) {
  if (!apiKey) {
    return {
      ok: false,
      rainfallMm24h: null,
      humidity: null,
      temperatureC: null,
      description: null,
      source: 'openweather',
    };
  }

  const base = 'https://api.openweathermap.org/data/2.5';
  const [curRes, fcRes] = await Promise.all([
    fetch(`${base}/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
    fetch(`${base}/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`),
  ]);

  if (!curRes.ok) {
    return { ok: false, rainfallMm24h: null, humidity: null, temperatureC: null, description: null, source: 'openweather' };
  }

  const current = await curRes.json();
  const humidity = current.main?.humidity ?? null;
  const temperatureC = current.main?.temp ?? null;
  const description = current.weather?.[0]?.description ?? null;

  let rainfallMm24h = 0;
  if (current.rain) {
    rainfallMm24h += current.rain['1h'] || current.rain['3h'] || 0;
  }

  if (fcRes.ok) {
    const fc = await fcRes.json();
    const list = fc.list || [];
    for (let i = 0; i < Math.min(8, list.length); i++) {
      const r = list[i].rain;
      if (r) rainfallMm24h += r['3h'] || 0;
    }
  }

  return {
    ok: true,
    rainfallMm24h: Math.round(rainfallMm24h * 100) / 100,
    humidity,
    temperatureC,
    description,
    source: 'openweather',
  };
}

function toISODate(d) {
  return d.toISOString().slice(0, 10);
}

function getIndiaSeason(date = new Date()) {
  const m = date.getMonth() + 1; // 1-12
  if (m >= 6 && m <= 9) return { season: 'Monsoon', month: m };
  if (m >= 10 && m <= 11) return { season: 'Post-monsoon', month: m };
  if (m >= 12 || m <= 2) return { season: 'Winter', month: m };
  return { season: 'Summer', month: m }; // Mar-May
}

async function fetchOpenMeteoRainHistory(lat, lon, days) {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - days);
  const url = new URL('https://archive-api.open-meteo.com/v1/archive');
  url.searchParams.set('latitude', String(lat));
  url.searchParams.set('longitude', String(lon));
  url.searchParams.set('start_date', toISODate(start));
  url.searchParams.set('end_date', toISODate(end));
  url.searchParams.set('daily', 'precipitation_sum');
  url.searchParams.set('timezone', 'Asia/Kolkata');
  url.searchParams.set('models', 'best_match');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`Open-Meteo HTTP ${res.status}`);
  const json = await res.json();
  const arr = json?.daily?.precipitation_sum;
  if (!Array.isArray(arr) || arr.length === 0) return null;
  const total = arr.reduce((s, v) => s + (typeof v === 'number' ? v : 0), 0);
  return Math.round(total * 100) / 100;
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

async function fetchCgwbNearestTrend({ lat, lon, stateName, districtName }) {
  if (!stateName && !districtName) return null;

  const url = new URL('https://ckandev.indiadataportal.com/api/3/action/datastore_search');
  url.searchParams.set('resource_id', CGWB_RESOURCE_ID);
  url.searchParams.set('limit', '5000');
  url.searchParams.set('fields', 'date,state_name,district_name,station_name,latitude,longitude,currentlevel,level_diff,source');

  // Prefer strict filters if we have them (smaller + more accurate)
  const filters = {};
  if (stateName) filters.state_name = stateName;
  if (districtName) filters.district_name = districtName;
  url.searchParams.set('filters', JSON.stringify(filters));

  const res = await fetch(url.toString(), { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`CGWB datastore HTTP ${res.status}`);
  const json = await res.json();
  if (!json?.success) throw new Error('CGWB datastore response not success');
  const records = json?.result?.records;
  if (!Array.isArray(records) || records.length === 0) return null;

  // Pick nearest station (using its latest two readings)
  const candidates = records
    .filter((r) => typeof r.latitude === 'number' && typeof r.longitude === 'number' && r.station_name)
    .map((r) => ({ ...r, distKm: haversineKm(lat, lon, r.latitude, r.longitude) }))
    .sort((a, b) => a.distKm - b.distKm);

  const nearest = candidates[0];
  if (!nearest) return null;

  const stationName = nearest.station_name;
  const stationRecords = records
    .filter((r) => r.station_name === stationName && typeof r.currentlevel === 'number' && r.date)
    .slice()
    .sort((a, b) => String(b.date).localeCompare(String(a.date))); // latest first

  const latest = stationRecords[0];
  const prev = stationRecords[1];
  if (!latest) return null;

  let trend = 'stable';
  if (prev && typeof prev.currentlevel === 'number') {
    const delta = latest.currentlevel - prev.currentlevel; // depth-to-water: higher = deeper (worse)
    if (delta > 0.25) trend = 'declining';
    else if (delta < -0.25) trend = 'recovering';
  }

  return {
    source: latest.source || 'CGWB',
    stationName,
    stationDistanceKm: Math.round(nearest.distKm * 10) / 10,
    latestDate: latest.date,
    latestDepthToWater: latest.currentlevel,
    prevDate: prev?.date || null,
    prevDepthToWater: prev?.currentlevel ?? null,
    trend,
  };
}

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<{
 *   location: string,
 *   lat: number,
 *   lon: number,
 *   rainfall: number|null,
 *   humidity: number|null,
 *   groundwater: string,
 *   reservoir: string,
 *   weather: object,
 *   groundwaterSynthetic: boolean
 *   season: string,
 *   rainfallPast30d: number|null,
 *   rainfallPast90d: number|null,
 *   cgwb: object|null
 * }>}
 */
async function fetchAllData(lat, lon) {
  const la = Number(lat);
  const lo = Number(lon);

  const { season } = getIndiaSeason(new Date());

  const [geo, weather, rain30, rain90] = await Promise.all([
    reverseGeocodeDetailed(la, lo).catch(() => ({ label: `${la.toFixed(4)}, ${lo.toFixed(4)}`, address: null })),
    fetchOpenWeatherMetrics(la, lo, process.env.OPENWEATHER_API_KEY),
    fetchOpenMeteoRainHistory(la, lo, 30).catch(() => null),
    fetchOpenMeteoRainHistory(la, lo, 90).catch(() => null),
  ]);

  const admin = {
    country: geo?.address?.country || null,
    countryCode: geo?.address?.country_code || null,
    state: geo?.address?.state || null,
    district: geo?.address?.state_district || geo?.address?.county || null,
    village:
      geo?.address?.village ||
      geo?.address?.hamlet ||
      geo?.address?.town ||
      geo?.address?.city ||
      geo?.address?.suburb ||
      null,
  };

  const stateName = geo?.address?.state || null;
  const districtName = geo?.address?.state_district || geo?.address?.county || null;
  const cgwb = await fetchCgwbNearestTrend({
    lat: la,
    lon: lo,
    stateName,
    districtName,
  }).catch(() => null);

  return {
    location: geo.label,
    lat: la,
    lon: lo,
    rainfall: weather.rainfallMm24h,
    humidity: weather.humidity,
    groundwater: cgwb?.trend || null,
    reservoir: null,
    weather,
    groundwaterSynthetic: false,
    season,
    rainfallPast30d: rain30,
    rainfallPast90d: rain90,
    cgwb,
    admin,
  };
}

module.exports = {
  fetchAllData,
  searchCoordinates,
  reverseGeocode,
};
