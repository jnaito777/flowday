import React from 'react'

type Props = {
  onNavigate?: (tab: 'dashboard' | 'schedule' | 'statistics' | 'profile') => void
  onSignOut?: () => void
  activeTab?: 'dashboard' | 'schedule' | 'statistics' | 'profile'
}

export default function NavBar({ onNavigate, onSignOut, activeTab = 'dashboard' }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">FlowDay</div>
      </div>
      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate?.('dashboard')}
          title="Dashboard"
        >
          <span className="icon">📊</span>
          <span className="label">Dashboard</span>
        </button>
        <button
          className={`sidebar-nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => onNavigate?.('schedule')}
          title="Schedule"
        >
          <span className="icon">📅</span>
          <span className="label">Schedule</span>
        </button>
        <button
          className={`sidebar-nav-item ${activeTab === 'statistics' ? 'active' : ''}`}
          onClick={() => onNavigate?.('statistics')}
          title="Statistics"
        >
          <span className="icon">📈</span>
          <span className="label">Statistics</span>
        </button>
        <button
          className={`sidebar-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => onNavigate?.('profile')}
          title="Profile"
        >
          <span className="icon">👤</span>
          <span className="label">Profile</span>
        </button>
      </nav>
      <div className="sidebar-footer">
        <button className="btn-sign-out" onClick={() => onSignOut?.()}>Sign Out</button>
      </div>
    </aside>
  )
}
