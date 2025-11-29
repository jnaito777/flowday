import type { ReactNode } from 'react';

export interface StatCardProps {
  title: string;
  value: ReactNode;
  subtitle?: string;
  progressBar?: number; // 0-100 for progress bar width
}

export function StatCard({ title, value, subtitle, progressBar }: StatCardProps) {
  return (
    <div className="stat-card">
      <div className="stat-title">{title}</div>
      <div className="stat-content">
        <div className="stat-number">{value}</div>
        {subtitle && <div className="stat-rate">{subtitle}</div>}
      </div>
      {progressBar !== undefined && (
        <div className="stat-bar">
          <div
            className="stat-bar-fill"
            style={{ width: `${Math.min(100, Math.max(0, progressBar))}%` }}
          />
        </div>
      )}
    </div>
  );
}
