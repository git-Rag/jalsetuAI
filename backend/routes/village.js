const express = require('express');
const { fetchAllData, searchCoordinates } = require('../services/dataFetcher');
const { analyzeWaterWithGroq } = require('../services/groqService');

const router = express.Router();

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

/**
 * GET /api/village-data?lat=&lon=&lang=en|hi
 * Optional: ?q=VillageName (forward geocode via Nominatim; then same pipeline)
 */
router.get('/village-data', async (req, res) => {
  const langRaw = (req.query.lang || 'en').toLowerCase();
  const lang = langRaw === 'hi' ? 'hi' : 'en';

  let lat = req.query.lat != null ? parseFloat(req.query.lat) : NaN;
  let lon = req.query.lon != null ? parseFloat(req.query.lon) : NaN;
  const q = typeof req.query.q === 'string' ? req.query.q.trim() : '';

  try {
    if ((Number.isNaN(lat) || Number.isNaN(lon)) && q) {
      const found = await searchCoordinates(q);
      if (!found) {
        return badRequest(res, 'Location not found for query; try different spelling or pass lat/lon.');
      }
      lat = found.lat;
      lon = found.lon;
    }

    if (Number.isNaN(lat) || Number.isNaN(lon)) {
      return badRequest(res, 'Valid lat and lon query parameters are required (or use q= for place search).');
    }

    if (lat < -90 || lat > 90 || lon < -180 || lon > 180) {
      return badRequest(res, 'Coordinates out of range.');
    }

    const fetched = await fetchAllData(lat, lon);

    // Restrict to Madhya Pradesh villages/districts only
    const state = fetched?.admin?.state || null;
    const countryCode = fetched?.admin?.countryCode || null;
    const district = fetched?.admin?.district || null;

    if (countryCode && String(countryCode).toLowerCase() !== 'in') {
      return res.status(403).json({
        error: 'LOCATION_NOT_ALLOWED',
        message: 'This API is restricted to Madhya Pradesh, India.',
        detected: { state, district, countryCode, location: fetched.location },
      });
    }

    if (state && state !== 'Madhya Pradesh') {
      return res.status(403).json({
        error: 'LOCATION_NOT_ALLOWED',
        message: 'This API is restricted to villages/districts in Madhya Pradesh, India.',
        detected: { state, district, countryCode, location: fetched.location },
      });
    }

    if (!state) {
      return res.status(400).json({
        error: 'LOCATION_NOT_VERIFIED',
        message: 'Could not verify state from coordinates; MP-only restriction enforced.',
        detected: { state, district, countryCode, location: fetched.location },
      });
    }

    try {
      const insights = await analyzeWaterWithGroq(fetched, lang);
      const actions = Array.isArray(insights.actions) ? insights.actions : [];

      const payload = {
        location: fetched.location,
        coordinates: { lat: fetched.lat, lon: fetched.lon },
        waterAvailability: insights.waterAvailability ?? 'Moderate',
        riskLevel: insights.riskLevel ?? 'Medium',
        trend: insights.trend ?? '',
        tankerPrediction: insights.tankerPrediction ?? '',
        actions,
        summary: insights.summary ?? '',
        lang,
        district: fetched.admin?.district || null,
        state: fetched.admin?.state || null,
        meta: {
          groq: true,
          weather: fetched.weather?.ok === true,
          groundwaterData: fetched.cgwb ? 'cgwb-india-data-portal' : null,
        },
      };

      return res.json(payload);
    } catch (e) {
      // Mock fallback disabled: return fetched inputs and error so you can debug Groq/keys.
      console.warn('[village-data] Groq failed (no mock fallback):', e?.message || e);
      return res.status(502).json({
        error: 'GROQ_ANALYSIS_FAILED',
        message: e?.message || 'Groq analysis failed',
        lang,
        fetched: {
          location: fetched.location,
          coordinates: { lat: fetched.lat, lon: fetched.lon },
          rainfall: fetched.rainfall,
          humidity: fetched.humidity,
          groundwater: fetched.groundwater,
          reservoir: fetched.reservoir,
          weather: fetched.weather,
        },
        meta: { groq: false, weather: fetched.weather?.ok === true },
      });
    }
  } catch (err) {
    console.error('[village-data]', err);
    const fallbackCoords = !Number.isNaN(lat) && !Number.isNaN(lon) ? { lat, lon } : null;
    res.status(500).json({
      location: fallbackCoords ? `${fallbackCoords.lat.toFixed(4)}, ${fallbackCoords.lon.toFixed(4)}` : 'Unknown',
      coordinates: fallbackCoords,
      error: 'VILLAGE_DATA_FAILED',
      message: err?.message || 'Unhandled error',
      lang,
      meta: { groq: false, weather: false, error: true },
    });
  }
});

module.exports = router;
