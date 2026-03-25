import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationCard from '../components/LocationCard';
import FeatureCard from '../components/FeatureCard';
import { getVillageData } from '../services/api';
import { useGroundwater } from '../hooks/useGroundwater';
import AquiferGauge from '../components/UI/AquiferGauge';
import DepletionTrend from '../components/UI/DepletionTrend';
import './Home.css';

const images = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
  'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e',
  'https://images.unsplash.com/photo-1470770841072-f978cf4d019e',
];

const translations = {
  en: {
    detectVillage: 'Detect My Village',
    goDashboard: 'Go to Dashboard',
    heroTitle: 'JalSetu AI – Smart Water Intelligence for Madhya Pradesh',
    heroSubtitle: 'Predict. Manage. Sustain.',
    insightsTitle: 'Insights Preview',
    insightsDesc: 'Deep village water intelligence in three precincts.',
    whyTitle: 'Why JalSetu',
    whyDesc: 'Authority-grade water insights built for rural governance.',
    finalCta: 'Empowering Villages Through Data',
    reports: 'Location Detection',
    noLocation: 'Enter your location or allow browser access for village-level water insights.',
    locationName: 'Location Name',
    waterAvailability: 'Water Availability',
    riskLevel: 'Risk Level',
    recommendation: 'Recommendation',
    waterTrend: 'Water Trend Insight',
    tankerPrediction: 'Tanker Requirement Prediction',
    suggestedActions: 'Suggested Actions',
    aiSummary: 'AI Insight Summary',
    feature1Title: 'Water Availability Trends',
    feature1Desc: 'Track reservoir, groundwater, and seasonal trends to predict shortages.',
    feature2Title: 'Tanker Requirement Prediction',
    feature2Desc: 'AI-driven demand forecasts for tanker dispatch and rural relief.',
    feature3Title: 'Usage Analytics',
    feature3Desc: 'Monitor consumption by village clusters, usage categories, and time frames.',
    why1Title: 'Predictive AI',
    why1Desc: 'Machine learning models anticipate risk and deliver proactive advisories.',
    why2Title: 'Rural Focus',
    why2Desc: 'Designed for villages, belted to local context, languages, and workflows.',
    why3Title: 'Government Ready',
    why3Desc: 'Secure, transparent reporting with audit-grade charting and alerts.',
    why4Title: 'Real-time Insights',
    why4Desc: 'Live dashboards and alerts for aquifer depletion, tanker scheduling, and supply.',
  },
  hi: {
    detectVillage: 'मेरे गाँव का पता लगाएं',
    goDashboard: 'डैशबोर्ड खोलें',
    heroTitle: 'जलसेतु एआई – मध्यप्रदेश के लिए स्मार्ट वाटर इंटेलिजेंस',
    heroSubtitle: 'अनुमान लगाएं। प्रबंधित करें। स्थायी बनाएं।',
    insightsTitle: 'इनसाइट्स पूर्वावलोकन',
    insightsDesc: 'त्रि-भुज गांव-स्तरीय जल डेटा इंटेलिजेंस।',
    whyTitle: 'क्यों जलसेतु',
    whyDesc: 'ग्रामीण शासन के लिए अधिकार-ग्रेड जल इनसाइट्स।',
    finalCta: 'डेटा के माध्यम से गांवों को सशक्त बनाना',
    reports: 'स्थान पहचान',
    noLocation: 'गाँव दर्ज करें या ब्राउज़र पहुंच की अनुमति दें।',
    locationName: 'स्थान का नाम',
    waterAvailability: 'जल उपलब्धता',
    riskLevel: 'जोखिम स्तर',
    recommendation: 'सुझाव',
    waterTrend: 'जल प्रवृत्ति विश्लेषण',
    tankerPrediction: 'टैंकर आवश्यकता पूर्वानुमान',
    suggestedActions: 'सुझाए गए कार्य',
    aiSummary: 'एआई सारांश',
    feature1Title: 'जल उपलब्धता प्रवृत्तियाँ',
    feature1Desc: 'भंडार, भूजल और मौसमी प्रवृत्तियों को ट्रैक करें ताकि कमी का पूर्वानुमान लगाया जा सके।',
    feature2Title: 'टैंकर आवश्यकता पूर्वानुमान',
    feature2Desc: 'टैंकर प्रेषण और ग्रामीण राहत के लिए एआई-संचालित मांग पूर्वानुमान।',
    feature3Title: 'उपयोग विश्लेषण',
    feature3Desc: 'गाँव समूहों, उपयोग श्रेणियों और समय सीमाओं द्वारा खपत की निगरानी करें।',
    why1Title: 'पूर्वानुमानित एआई',
    why1Desc: 'मशीन लर्निंग मॉडल जोखिम का पूर्वानुमान लगाते हैं और सक्रिय सलाह देते हैं।',
    why2Title: 'ग्रामीण फोकस',
    why2Desc: 'गाँवों के लिए डिज़ाइन किया गया, स्थानीय संदर्भ, भाषाओं और कार्यप्रवाह से जुड़ा।',
    why3Title: 'सरकार तैयार',
    why3Desc: 'ऑडिट-ग्रेड चार्टिंग और अलर्ट के साथ सुरक्षित, पारदर्शी रिपोर्टिंग।',
    why4Title: 'रियल-टाइम इनसाइट्स',
    why4Desc: 'जलाशय ह्रास, टैंकर निर्धारण और आपूर्ति के लिए लाइव डैशबोर्ड और अलर्ट।',
  },
};

const fallbackDetails = {
  locationName: 'Sehore',
  waterAvailability: 'Moderate',
  riskLevel: 'Medium',
  trendInsight: 'Groundwater levels are declining over the past 3 months.',
  tankerPrediction: 'Likely need: 2–3 tankers/week if no rainfall.',
  suggestedActions: ['Reduce irrigation usage', 'Promote rainwater harvesting', 'Repair local water infrastructure'],
  aiSummary:
    'Local groundwater is under stress. Immediate action on conservation and infrastructure will lower shortage risk, while simulating realtime demand for tanker support.',
};

export default function Home() {
  const navigate = useNavigate();
  const { data: groundwater, summary, loading: gwLoading, error: gwError } = useGroundwater();
  const [language, setLanguage] = useState(localStorage.getItem('jalsetu-lang') || 'en');
  const [locationInput, setLocationInput] = useState('');
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);

  const t = useMemo(() => translations[language] || translations.en, [language]);

  useEffect(() => {
    localStorage.setItem('jalsetu-lang', language);
    const event = new CustomEvent('language-change', { detail: language });
    window.dispatchEvent(event);
  }, [language]);

  useEffect(() => {
    const listener = (event) => {
      if (event?.detail) setLanguage(event.detail);
    };
    window.addEventListener('language-change', listener);
    return () => window.removeEventListener('language-change', listener);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const heroStyle = {
    backgroundImage: `linear-gradient(rgba(0, 20, 35, 0.5), rgba(15, 76, 92, 0.65)), url('${images[index]}')`,
  };

  const sampleFrames = [
    { villageId: 'V001', aquiferType: 'Vidisha', currentDepthMeters: 18.4, criticalDepthMeters: 25, aquiferHealthScore: 26, daysUntilCritical: 110, depletionRateMetersPerMonth: 1.8, rechargeZone: 'Low', wellCount: 4, wellCondition: 'Operational', monthlyReadings: [22, 21.5, 21, 20.3] },
    { villageId: 'V003', aquiferType: 'Dindori', currentDepthMeters: 22.1, criticalDepthMeters: 25, aquiferHealthScore: 12, daysUntilCritical: 36, depletionRateMetersPerMonth: 2.4, rechargeZone: 'Low', wellCount: 2, wellCondition: 'Degraded', monthlyReadings: [23, 22.7, 22.4, 22.1] },
    { villageId: 'V015', aquiferType: 'Gondwana Sandstone', currentDepthMeters: 14.2, criticalDepthMeters: 30, aquiferHealthScore: 53, daysUntilCritical: 430, depletionRateMetersPerMonth: 1.1, rechargeZone: 'Moderate', wellCount: 6, wellCondition: 'Operational', monthlyReadings: [20, 19.8, 19.1, 18.9] },
    { villageId: 'V007', aquiferType: 'Mandla', currentDepthMeters: 20.1, criticalDepthMeters: 25, aquiferHealthScore: 20, daysUntilCritical: 73, depletionRateMetersPerMonth: 2.0, rechargeZone: 'Low', wellCount: 5, wellCondition: 'Degraded', monthlyReadings: [21, 20.6, 20.3, 20.1] },
    { villageId: 'V002', aquiferType: 'Alluvial', currentDepthMeters: 16.8, criticalDepthMeters: 28, aquiferHealthScore: 38, daysUntilCritical: 180, depletionRateMetersPerMonth: 1.5, rechargeZone: 'Moderate', wellCount: 3, wellCondition: 'Operational', monthlyReadings: [19, 18.7, 18.4, 18.1] },
    { villageId: 'V009', aquiferType: 'Basalt', currentDepthMeters: 19.5, criticalDepthMeters: 26, aquiferHealthScore: 35, daysUntilCritical: 95, depletionRateMetersPerMonth: 2.1, rechargeZone: 'Low', wellCount: 4, wellCondition: 'Operational', monthlyReadings: [21.5, 21.1, 20.7, 20.3] },
    { villageId: 'V012', aquiferType: 'Sandstone', currentDepthMeters: 15.6, criticalDepthMeters: 32, aquiferHealthScore: 62, daysUntilCritical: 520, depletionRateMetersPerMonth: 0.9, rechargeZone: 'High', wellCount: 7, wellCondition: 'Operational', monthlyReadings: [17, 16.8, 16.5, 16.3] },
    { villageId: 'V018', aquiferType: 'Alluvial', currentDepthMeters: 21.3, criticalDepthMeters: 24, aquiferHealthScore: 15, daysUntilCritical: 42, depletionRateMetersPerMonth: 2.2, rechargeZone: 'Low', wellCount: 3, wellCondition: 'Degraded', monthlyReadings: [23.8, 23.4, 23.0, 22.6] },
    { villageId: 'V021', aquiferType: 'Gondwana Sandstone', currentDepthMeters: 13.1, criticalDepthMeters: 29, aquiferHealthScore: 67, daysUntilCritical: 380, depletionRateMetersPerMonth: 1.3, rechargeZone: 'Moderate', wellCount: 5, wellCondition: 'Operational', monthlyReadings: [14.8, 14.4, 14.1, 13.8] },
  ];
  const parseCoordString = (raw) => {
    if (!raw || typeof raw !== 'string') return null;
    const parts = raw.split(/[,\s]+/).map((p) => parseFloat(p));
    if (parts.length >= 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
      return { lat: parts[0], lon: parts[1] };
    }
    return null;
  };

  const reportVillage = async (location) => {
    setError(null);
    setLoading(true);
    setDetails(null);

    try {
      const trimmed = typeof location === 'string' ? location.trim() : '';
      const coords = typeof location === 'object' && location?.lat != null && location?.lon != null
        ? { lat: location.lat, lon: location.lon }
        : parseCoordString(trimmed);

      const params = coords
        ? { lat: coords.lat, lon: coords.lon, lang: language }
        : { q: trimmed || 'Sehore, Madhya Pradesh', lang: language };

      const response = await getVillageData(params);
      const data = response?.data || fallbackDetails;
      setDetails({
        locationName: data.location || data.village || trimmed || '—',
        waterAvailability: data.waterAvailability || data.waterLevel || 'Moderate',
        riskLevel: data.riskLevel || data.risk || 'Medium',
        trendInsight: data.trend || data.trendInsight || fallbackDetails.trendInsight,
        tankerPrediction: data.tankerPrediction || fallbackDetails.tankerPrediction,
        suggestedActions: data.actions || data.suggestedActions || fallbackDetails.suggestedActions,
        aiSummary: data.summary || data.aiSummary || fallbackDetails.aiSummary,
      });
    } catch (err) {
      console.warn('Village data fallback:', err?.message || err);
      setDetails(fallbackDetails);
      setError(language === 'hi' ? 'लाइव API उपलब्ध नहीं; नमूना डेटा दिखाया जा रहा है।' : 'Live API unavailable, showing sample village data.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocate = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser.');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const loc = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
        setLocationInput(loc);
        reportVillage({ lat: coords.latitude, lon: coords.longitude });
      },
      (geoErr) => {
        setLoading(false);
        setError('Could not fetch location; please enter village name manually.');
        console.error(geoErr);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = (value) => {
    if (!value?.trim()) {
      setError('Enter village name or location first.');
      return;
    }
    reportVillage(value);
  };

  return (
    <div className='home-page'>
      <section className='home-hero' style={heroStyle} id='top-hero'>
        <div className='home-hero-overlay' />
        <div className='home-hero-content container'>
          <p className='kicker'>Madhya Pradesh | जलसेतु परियोजना</p>
          <h1>{t.heroTitle}</h1>
          <p className='subtitle'>{t.heroSubtitle}</p>
          <div className='hero-actions'>
            <button className='btn btn-primary' onClick={handleLocate}>{t.detectVillage}</button>
            <button className='btn btn-secondary' onClick={() => navigate('/dashboard')}>{t.goDashboard}</button>
          </div>
        </div>
      </section>

      <section className='section location-section' id='location-section'>
        <div className='container'>
          <LocationCard
            lang={language}
            translations={t}
            details={details}
            loading={loading}
            error={error}
            onLocate={handleLocate}
            onSubmit={handleSubmit}
            inputValue={locationInput}
            setInputValue={setLocationInput}
          />
        </div>
      </section>

      <section className='section features-section'>
        <div className='container'>
          <h2>Groundwater Data Frames</h2>
          <p>Scroll through village groundwater insights.</p>
          {gwLoading && <p className='loading-hint'>Loading groundwater frames...</p>}
          <div className='horizontal-scroll'>
            {(groundwater.length > 0 ? groundwater.slice(0, 10) : sampleFrames).map(gw => (
              <div key={gw.villageId} className='gw-card'>
                <h4>{gw.villageId} · {gw.aquiferType}</h4>
                <AquiferGauge currentDepth={gw.currentDepthMeters} criticalDepth={gw.criticalDepthMeters} healthScore={gw.aquiferHealthScore} />
                <div className='gw-attrs'>
                  <div>Days to failure: {gw.daysUntilCritical}</div>
                  <div>Depletion: {gw.depletionRateMetersPerMonth}m/month</div>
                  <div>Recharge: {gw.rechargeZone}</div>
                  <div>Wells: {gw.wellCount} ({gw.wellCondition})</div>
                </div>
                <div className='gw-trend'><DepletionTrend monthlyReadings={gw.monthlyReadings} /></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className='section why-section'>
        <div className='container'>
          <h2>{t.whyTitle}</h2>
          <p>{t.whyDesc}</p>
          <div className='why-grid'>
            <article>
              <h3>{t.why1Title}</h3>
              <p>{t.why1Desc}</p>
            </article>
            <article>
              <h3>{t.why2Title}</h3>
              <p>{t.why2Desc}</p>
            </article>
            <article>
              <h3>{t.why3Title}</h3>
              <p>{t.why3Desc}</p>
            </article>
            <article>
              <h3>{t.why4Title}</h3>
              <p>{t.why4Desc}</p>
            </article>
          </div>
        </div>
      </section>

      <section className='section cta-footer'>
        <div className='cta-overlay' />
        <div className='container cta-content'>
          <h2>{t.finalCta}</h2>
          <button className='btn btn-primary' onClick={() => navigate('/dashboard')}>{t.goDashboard}</button>
        </div>
      </section>
    </div>
  );
}

