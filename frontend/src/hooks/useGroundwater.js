import { useEffect, useState } from 'react';
import { getAllGroundwater, getGroundwaterSummary } from '../services/api';

export function useGroundwater() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getAllGroundwater(), getGroundwaterSummary()])
      .then(([gwRes, summaryRes]) => {
        console.debug('[useGroundwater] success', gwRes.data?.length, summaryRes.data);
        setData(gwRes.data);
        setSummary(summaryRes.data);
      })
      .catch((err) => {
        console.error('[useGroundwater] error', err?.message ?? err);
        setError(err?.message ?? String(err));
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, summary, loading, error };
}
