import React from 'react';

interface NavBarProps {
  activeTab: 'tasks' | 'schedule' | 'summary';
  onChange: (tab: 'tasks' | 'schedule' | 'summary') => void;
  onSignOut: () => void;
}

export default function NavBar({ activeTab, onChange, onSignOut }: NavBarProps) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="brand">
          <div className="logo" aria-hidden />
          <div className="brand-text">
            <div className="brand-title">FlowDay</div>
            <div className="brand-sub">Your daily productivity companion</div>
          </div>
        </div>

        <nav className="topnav" aria-label="Main navigation">
          <button className={`topnav-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => onChange('tasks')}>Tasks</button>
          <button className={`topnav-btn ${activeTab === 'schedule' ? 'active' : ''}`} onClick={() => onChange('schedule')}>Schedule</button>
          <button className={`topnav-btn ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => onChange('summary')}>Summary</button>
        </nav>

        <div className="top-actions">
          <button className="sign-out-btn" onClick={onSignOut}>Sign Out</button>
        </div>
      </div>
    </header>
  );
}
