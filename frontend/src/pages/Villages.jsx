import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useVillages } from '../hooks/useVillages';
import { useGroundwater } from '../hooks/useGroundwater';
import RiskBadge from '../components/UI/RiskBadge';
import './Villages.css';

export default function Villages() {
  const { data: villages, loading, error } = useVillages();
  const { data: groundwater } = useGroundwater();
  const [filter, setFilter] = useState('');

  const visible = useMemo(() => {
    return villages.filter(v => v.name.toLowerCase().includes(filter.toLowerCase()) || v.district.toLowerCase().includes(filter.toLowerCase()));
  }, [villages, filter]);

  if (loading) return <p>Loading villages...</p>;
  if (error) return <p>Failed to load villages: {error}</p>;

  return (
    <div>
      <h2>Villages · ग्राम</h2>
      <div className='top-bar'>
        <input value={filter} placeholder='Search by village/district' onChange={e=>setFilter(e.target.value)} />
      </div>
      <div className='village-grid'>
        {visible.map(v => {
          const gw = groundwater.find(g => g.villageId === v.id);
          return (
            <div key={v.id} className='village-card'>
              <div className='villa-title'><span>{v.name}</span><RiskBadge risk={v.riskLevel} /></div>
              <div>{v.district} · {v.block}</div>
              <div>💧 Stock: {v.waterStockLiters.toLocaleString()} L</div>
              <div>👥 Pop: {v.population}</div>
              <div>⏱ Days Left: {v.daysLeft}</div>
              <div>🚚 Last Tanker: {v.lastTankerDate}</div>
              <div className='gw-banner'>
                <strong>🌊 GROUNDWATER</strong>
                <div>Depth: {gw?.currentDepthMeters ?? '-'}m</div>
                <div>Health: {gw?.aquiferHealthScore ?? '-'}% </div>
                <div>Status: {gw?.depletionStatus ?? '-'}</div>
              </div>
              <Link className='view-detail' to={`/villages/${v.id}`}>View Details →</Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
