import React from 'react'

type Props = {
  onNavigate?: (tab: 'tasks' | 'schedule' | 'summary') => void
  onSignOut?: () => void
}

export default function NavBar({ onNavigate, onSignOut }: Props) {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#/" onClick={() => onNavigate?.('tasks')}>
          FlowDay
        </a>
        <nav className="topnav">
          <button className="topnav-link" onClick={() => onNavigate?.('tasks')}>
            Today
          </button>
          <button
            className="topnav-link"
            onClick={() => onNavigate?.('schedule')}
          >
            Schedule
          </button>
          <button
            className="topnav-link"
            onClick={() => onNavigate?.('summary')}
          >
            Progress
          </button>
        </nav>
        <div className="top-actions">
          <button className="btn small" onClick={() => onSignOut?.()}>Sign Out</button>
        </div>
      </div>
    </header>
  )
}
