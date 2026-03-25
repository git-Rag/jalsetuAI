import { useMemo } from 'react';
import { useGroundwater } from '../hooks/useGroundwater';
import StatCard from '../components/UI/StatCard';
import AquiferGauge from '../components/UI/AquiferGauge';
import DepletionTrend from '../components/UI/DepletionTrend';
import './Groundwater.css';

export default function Groundwater() {
  const { data, summary, loading, error } = useGroundwater();

  const categories = useMemo(() => {
    const stable = data.filter(x => x.depletionStatus === 'STABLE').length;
    const stressed = data.filter(x => x.depletionStatus === 'STRESSED').length;
    const critical = data.filter(x => x.depletionStatus === 'CRITICAL').length;
    const depleted = data.filter(x => x.depletionStatus === 'DEPLETED').length;
    return { stable, stressed, critical, depleted };
  }, [data]);

  if (loading) return <p>Loading groundwater...</p>;
  if (error) return <p>Failed to fetch groundwater: {error}</p>;

  return (
    <div className='groundwater'>
      <h2>भूजल निगरानी केंद्र · Groundwater Monitoring Center</h2>
      <div className='stat-grid'>
        <StatCard title='STABLE' value={`${categories.stable} villages`} subtitle='Avg health' color='var(--groundwater)' />
        <StatCard title='STRESSED' value={`${categories.stressed} villages`} subtitle='' color='var(--warning)' />
        <StatCard title='CRITICAL' value={`${categories.critical} villages`} subtitle='' color='var(--danger)' />
        <StatCard title='DEPLETED' value={`${categories.depleted} villages`} subtitle='' color='var(--danger)' />
      </div>
      <section className='gw-cards'>
        {data.map(gw => (
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
      </section>
      <section className='district-context'>
        <h3>MP Geological Context</h3>
        <p>Vindhya plateau and Bundelkhand region use Deccan Basalt. Narmada valley belt uses Gondwana Sandstone / Alluvial geology. March-June is pre-monsoon stress.</p>
      </section>
    </div>
  );
}
