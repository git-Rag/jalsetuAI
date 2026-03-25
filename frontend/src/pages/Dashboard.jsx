import { useMemo } from 'react';
import { useVillages } from '../hooks/useVillages';
import { useGroundwater } from '../hooks/useGroundwater';
import StatCard from '../components/UI/StatCard';
import RiskBadge from '../components/UI/RiskBadge';
import './Dashboard.css';

export default function Dashboard() {
  const { data: villages, loading: vLoading, error: vError } = useVillages();
  const { data: groundwater, summary, loading: gwLoading, error: gwError } = useGroundwater();

  const stats = useMemo(() => {
    if (!villages.length || !groundwater.length) return null;
    const criticalSurface = villages.filter(v => v.riskLevel === 'CRITICAL').length;
    const highSurface = villages.filter(v => v.riskLevel === 'HIGH').length;
    const avgDays = Math.round(villages.reduce((s,v) => s + (v.daysLeft || 0), 0)/villages.length);
    const aquiferStable = groundwater.filter(g => g.depletionStatus === 'STABLE').length;
    const dual = villages.filter(v => v.riskLevel === 'CRITICAL').filter(v => {
      const gw = groundwater.find(g => g.villageId === v.id);
      return gw && (gw.depletionStatus === 'CRITICAL' || gw.depletionStatus === 'DEPLETED');
    }).length;
    return { criticalSurface, highSurface, avgDays, aquiferStable, dual };
  }, [villages, groundwater]);

  if (vLoading || gwLoading) return <p>Loading dashboard...</p>;
  if (vError || gwError) return <p>Error loading dashboard: {vError || gwError}</p>;

  return (
    <div className='dashboard'>
      <section className='dashboard-hero'>
        <div className='dashboard-hero-overlay' />
        <div className='dashboard-hero-content'>
          <h2>JalSetu Dashboard</h2>
          <p>Village-level water intelligence for sustainable rural management.</p>
        </div>
      </section>

      <section className='dashboard-summary container'>
        <h3>Water Status</h3>
        <div className='stat-grid'>
          <StatCard title='Villages Monitored' value={villages.length} subtitle='MP Pilot' />
          <StatCard title='Critical Risk' value={stats?.criticalSurface || 0} subtitle='Surface water critical' color='var(--danger)' />
          <StatCard title='High Risk' value={stats?.highSurface || 0} subtitle='Requires action' color='var(--warning)' />
          <StatCard title='Avg Days Left' value={stats?.avgDays || 0} subtitle='Water availability' />
          <StatCard title='Aquifer Stable' value={`${stats?.aquiferStable || 0}/${groundwater.length}`} subtitle='Undertaking monitoring' color='var(--groundwater)' />
          <StatCard title='Dual Riskvillages' value={stats?.dual || 0} subtitle='Surface + Aquifer' color='var(--danger)' />
        </div>
      </section>

      <section className='dashboard-section container'>
        <h3>Predictions</h3>
        <div className='mini-grid'>
          <article className='info-card'><span>📈</span><h4>Short Long Forecast</h4><p>3-6 day stream and aquifer projection.</p></article>
          <article className='info-card'><span>🚚</span><h4>Tanker Needs</h4><p>Top 5 villages with urgent tanker dispatch need.</p></article>
          <article className='info-card'><span>💧</span><h4>Rain Capture Potential</h4><p>Actionable sites for rapid recharging.</p></article>
        </div>
      </section>

      <section className='dashboard-section container'>
        <h3>Alerts</h3>
        <div className='alerts-grid'>
          <article className='alert-card high'><h4>High Risk: 10 villages</h4><p>Immediate outreach required in Dewas, Sehore, and Hoshangabad.</p></article>
          <article className='alert-card warning'><h4>Moderate Risk: 14 villages</h4><p>Enhanced conservation and monitoring suggested across four zones.</p></article>
          <article className='alert-card stable'><h4>Stable: 8 villages</h4><p>Schedule regular site inspection and extend support to lower-risk zones.</p></article>
        </div>
      </section>

      <section className='dashboard-section container'>
        <h3>All Villages Summary</h3>
        <div className='table-wrap'>
          <table>
            <thead>
              <tr><th>Village</th><th>District</th><th>Population</th><th>Days Left</th><th>Risk</th><th>Aquifer Health</th><th>Last Tanker</th></tr>
            </thead>
            <tbody>
              {villages.slice(0,22).map(v => {
                const gw = groundwater.find(g => g.villageId === v.id);
                return (
                  <tr key={v.id} className={`row-${v.riskLevel?.toLowerCase()}`}>
                    <td>{v.name}</td>
                    <td>{v.district}</td>
                    <td>{v.population}</td>
                    <td>{v.daysLeft}</td>
                    <td><RiskBadge risk={v.riskLevel} /></td>
                    <td>{gw ? `${gw.aquiferHealthScore}%` : 'N/A'}</td>
                    <td>{v.lastTankerDate}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
