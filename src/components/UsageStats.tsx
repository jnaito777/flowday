import { useEffect, useState } from 'react';
import { useUserStats } from '../hooks/useUserStats';
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
        <div className="stat-card">
          <div className="stat-title">Today</div>
          <div className="stat-content">
            <div className="stat-number">
              {stats.daily.completed}/{stats.daily.total}
            </div>
            <div className="stat-rate">
              {stats.daily.rate.toFixed(0)}% Complete
            </div>
          </div>
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{ width: `${stats.daily.rate}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">This Month</div>
          <div className="stat-content">
            <div className="stat-number">
              {stats.monthly.completed}/{stats.monthly.total}
            </div>
            <div className="stat-rate">
              {stats.monthly.rate.toFixed(0)}% Complete
            </div>
          </div>
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{ width: `${stats.monthly.rate}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">This Year</div>
          <div className="stat-content">
            <div className="stat-number">
              {stats.yearly.completed}/{stats.yearly.total}
            </div>
            <div className="stat-rate">
              {stats.yearly.rate.toFixed(0)}% Complete
            </div>
          </div>
          <div className="stat-bar">
            <div
              className="stat-bar-fill"
              style={{ width: `${stats.yearly.rate}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
