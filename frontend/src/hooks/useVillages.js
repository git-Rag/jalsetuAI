import { useEffect, useState } from 'react';
import { getVillages } from '../services/api';

export function useVillages() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVillages()
      .then((res) => {
        console.debug('[useVillages] success', res.data?.length);
        setData(res.data);
      })
      .catch((err) => {
        console.error('[useVillages] error', err?.message ?? err);
        setError(err?.message ?? String(err));
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}
