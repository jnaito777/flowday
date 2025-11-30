import React from 'react';

export default function NavBar() {
  return (
    <header className="topbar">
      <div className="topbar-inner">
        <a className="brand" href="#/">FlowDay</a>
        <nav className="topnav">
          <a className="topnav-link" href="#/">Today</a>
          <a className="topnav-link" href="#/schedule">Schedule</a>
          <a className="topnav-link" href="#/progress">Progress</a>
        </nav>
        <div className="top-actions">
          <button className="btn small">New Task</button>
        </div>
      </div>
    </header>
  );
}
