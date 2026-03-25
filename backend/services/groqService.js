const Groq = require('groq-sdk');

function buildAnalysisPrompt(data, lang) {
  const rainfallStr =
    data.rainfall == null ? 'unknown (weather API unavailable)' : `${data.rainfall} mm (approx. next 24h incl. current)`;
  const humidityStr = data.humidity == null ? 'unknown' : `${data.humidity}%`;
  const groundwaterStr = data.groundwater == null ? 'unknown (not available)' : String(data.groundwater);
  const reservoirStr = data.reservoir == null ? 'unknown (not available)' : String(data.reservoir);
  const rain30Str = data.rainfallPast30d == null ? 'unknown' : `${data.rainfallPast30d} mm (past 30 days total)`;
  const rain90Str = data.rainfallPast90d == null ? 'unknown' : `${data.rainfallPast90d} mm (past 90 days total)`;
  const seasonStr = data.season || 'unknown';
  const cgwbStr = data.cgwb
    ? `Nearest CGWB station: ${data.cgwb.stationName} (~${data.cgwb.stationDistanceKm} km). Latest depth-to-water: ${data.cgwb.latestDepthToWater} on ${data.cgwb.latestDate}. Previous: ${data.cgwb.prevDepthToWater ?? 'n/a'} on ${data.cgwb.prevDate ?? 'n/a'}. Derived trend: ${data.cgwb.trend}.`
    : 'CGWB station data: unavailable.';

  const base = `You are a water management AI for rural India.
Given the following data for a village:

Location: ${data.location}
Coordinates: ${data.lat}, ${data.lon}
Season context (India): ${seasonStr}
Rainfall (precipitation context): ${rainfallStr}
Rainfall history proxy (existing stored water / recharge signal): ${rain30Str}; ${rain90Str}
Humidity: ${humidityStr}
Groundwater trend label: ${groundwaterStr}
Reservoir storage label: ${reservoirStr}
Weather detail: ${data.weather?.description || 'n/a'}
Groundwater observations: ${cgwbStr}

Generate a JSON object ONLY (no markdown, no code fences) with these exact keys:
{
  "waterAvailability": "Low" | "Moderate" | "High",
  "riskLevel": "Low" | "Medium" | "High",
  "trend": "one concise sentence on water trend for this place",
  "tankerPrediction": "one concise sentence on likely tanker need",
  "actions": ["action 1", "action 2", "action 3"],
  "summary": "short paragraph (2-3 sentences)"
}

IMPORTANT:
- Make the analysis SPECIFIC to the named location and realistic given the numbers.
- Do NOT infer severe scarcity only because near-term rainfall is low during Summer; weigh existing availability using rainfall history (past 90 days) and groundwater trend.
- Keep strings concise.`;

  if (lang === 'hi') {
    return `${base}

Respond entirely in Hindi: all string values must be in Devanagari Hindi only. No English words in the JSON values.`;
  }

  return `${base}

Respond entirely in English.`;
}

function parseGroqJson(text) {
  const trimmed = text.trim();
  const start = trimmed.indexOf('{');
  const end = trimmed.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) throw new Error('No JSON object in Groq response');
  const slice = trimmed.slice(start, end + 1);
  return JSON.parse(slice);
}

/**
 * @param {object} data - result of fetchAllData
 * @param {'en'|'hi'} lang
 */
async function analyzeWaterWithGroq(data, lang) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY missing');
  }

  const groq = new Groq({ apiKey });
  const prompt = buildAnalysisPrompt(data, lang);

  const completion = await groq.chat.completions.create({
    model: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content:
          'You output only valid JSON objects for water intelligence dashboards. No markdown.',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.35,
    max_tokens: 1024,
  });

  const text = completion.choices?.[0]?.message?.content || '';
  try {
    return parseGroqJson(text);
  } catch (e) {
    throw new Error(`Groq JSON parse failed: ${e.message}`);
  }
}

module.exports = {
  analyzeWaterWithGroq,
  buildAnalysisPrompt,
};
