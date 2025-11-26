import { useEffect, useState } from 'react';
import useUserStats from '../hooks/useUserStats';

export default function UsageStats() {
  const { getDaily, getMonthly, getYearly } = useUserStats();
  const [daily, setDaily] = useState(null as any);
  const [monthly, setMonthly] = useState(null as any);
  const [yearly, setYearly] = useState(null as any);

  useEffect(() => {
    async function load() {
      const today = new Date();
      const d = await getDaily(today);
      const m = await getMonthly(today.getFullYear(), today.getMonth() + 1);
      const y = await getYearly(today.getFullYear());
      setDaily(d);
      setMonthly(m);
      setYearly(y);
    }
    load();
  }, [getDaily, getMonthly, getYearly]);

  return (
    <div className="usage-stats">
      <h2>Usage</h2>
      <div className="usage-cards">
        <div className="usage-card">
          <div className="usage-title">Today</div>
          <div className="usage-value">
            {daily ? `${daily.completed}/${daily.total} (${daily.rate}%)` : '—'}
          </div>
        </div>
        <div className="usage-card">
          <div className="usage-title">This Month</div>
          <div className="usage-value">
            {monthly ? `${monthly.completed}/${monthly.total} (${monthly.rate}%)` : '—'}
          </div>
        </div>
        <div className="usage-card">
          <div className="usage-title">This Year</div>
          <div className="usage-value">
            {yearly ? `${yearly.completed}/${yearly.total} (${yearly.rate}%)` : '—'}
          </div>
        </div>
      </div>
    </div>
  );
}
