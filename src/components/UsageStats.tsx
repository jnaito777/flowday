import { useEffect, useState } from 'react';
import { useUserStats } from '../hooks/useUserStats';
import { StatCard } from './StatCard';
import './UsageStats.css';

export default function UsageStats() {
  const { getDaily, getMonthly, getYearly } = useUserStats();
  const [stats, setStats] = useState({
    daily: { total: 0, completed: 0, rate: 0 },
    monthly: { total: 0, completed: 0, rate: 0 },
    yearly: { total: 0, completed: 0, rate: 0 },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        const now = new Date();
        const [daily, monthly, yearly] = await Promise.all([
          getDaily(now),
          getMonthly(now.getFullYear(), now.getMonth() + 1),
          getYearly(now.getFullYear()),
        ]);
        setStats({
          daily: daily || { total: 0, completed: 0, rate: 0 },
          monthly: monthly || { total: 0, completed: 0, rate: 0 },
          yearly: yearly || { total: 0, completed: 0, rate: 0 },
        });
      } catch (err) {
        console.error('Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [getDaily, getMonthly, getYearly]);

  if (loading) {
    return (
      <div className="usage-stats">
        <div className="stats-container">
          <div className="stat-skeleton">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="usage-stats">
      <h2>Usage Statistics</h2>
      <div className="stats-container">
        <StatCard
          title="Today"
          value={`${stats.daily.completed}/${stats.daily.total}`}
          subtitle={`${stats.daily.rate.toFixed(0)}% Complete`}
          progressBar={stats.daily.rate}
        />

        <StatCard
          title="This Month"
          value={`${stats.monthly.completed}/${stats.monthly.total}`}
          subtitle={`${stats.monthly.rate.toFixed(0)}% Complete`}
          progressBar={stats.monthly.rate}
        />

        <StatCard
          title="This Year"
          value={`${stats.yearly.completed}/${stats.yearly.total}`}
          subtitle={`${stats.yearly.rate.toFixed(0)}% Complete`}
          progressBar={stats.yearly.rate}
        />
      </div>
    </div>
  );
}
