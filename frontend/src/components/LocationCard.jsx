import './LocationCard.css';

const riskStyles = {
  Low: 'var(--success)',
  Medium: 'var(--warning)',
  High: 'var(--danger)',
  कम: 'var(--success)',
  मध्यम: 'var(--warning)',
  उच्च: 'var(--danger)',
};

export default function LocationCard({
  lang,
  translations,
  details,
  loading,
  error,
  onLocate,
  onSubmit,
  inputValue,
  setInputValue,
}) {
  const t = translations;

  return (
    <div className='location-card'>
      <h3>{t.reports || 'Location Detection'}</h3>
      <p>{t.noLocation || 'Enter your location or allow browser access for village-level water insights.'}</p>

      <div className='location-actions'>
        <button className='btn btn-secondary' onClick={onLocate}>
          📍 {lang === 'hi' ? 'स्थान का पता लगाएं' : 'Use My Location'}
        </button>
        <div className='manual-input'>
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={lang === 'hi' ? 'गाँव का नाम दर्ज करें (जैसे सेहोर)' : 'Enter village name (e.g., Sehore)'}
            aria-label='Village name'
          />
          <button className='btn btn-primary' onClick={() => onSubmit(inputValue)}>
            🗺️ {lang === 'hi' ? 'खोजें' : 'Detect'}
          </button>
        </div>
      </div>

      {loading && <div className='spinner'>⏳ {lang === 'hi' ? 'लोड किया जा रहा है...' : 'Loading village data...'}</div>}
      

      {details && (
        <div className='location-result'>
          <h4>{details.locationName || details.village || 'N/A'}</h4>
          <div className='result-row'>
            <span>📍 {t.locationName}:{' '}</span>
            <strong>{details.locationName || details.village}</strong>
          </div>
          <div className='result-row'>
            <span>💧 {t.waterAvailability}:{' '}</span>
            <strong>{details.waterAvailability}</strong>
          </div>
          <div className='result-row'>
            <span>⚠️ {t.riskLevel}:{' '}</span>
            <strong style={{ color: riskStyles[details.riskLevel] || '#000' }}>{details.riskLevel}</strong>
          </div>
          <div className='result-row'>
            <span>📊 {t.waterTrend}</span>
            <p>{details.trendInsight}</p>
          </div>
          <div className='result-row'>
            <span>🚰 {t.tankerPrediction}</span>
            <p>{details.tankerPrediction}</p>
          </div>
          <div className='result-row'>
            <span>🌱 {t.suggestedActions}</span>
            <ul>
              {(details.suggestedActions || []).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className='result-row'>
            <span>🧠 {t.aiSummary}</span>
            <p>{details.aiSummary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
