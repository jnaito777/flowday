import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './contexts/AuthContext';
import TaskList from './components/TaskList';
import ScheduleBuilder from './components/ScheduleBuilder';
import DaySummary from './components/DaySummary';
import UsageStats from './components/UsageStats';
import Auth from './components/Auth';
import NavBar from './components/NavBar';
import './App.css';

function App() {
  const { user, loading, signOut } = useAuth();
  const {
    tasks,
    loading: tasksLoading,
    deleteTask,
    completeTask,
    scheduleTask,
    unscheduleTask,
  } = useTasks();

  const [activeTab, setActiveTab] = useState<'dashboard' | 'schedule' | 'statistics' | 'profile'>(
    'dashboard'
  );

  const handleScheduleTask = (taskId: string, start: Date, end: Date) => {
    scheduleTask(taskId, start, end);
  };

  if (loading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="app">
      <NavBar activeTab={activeTab} onNavigate={setActiveTab} onSignOut={signOut} />

      <main className="app-main">
        <div className="app-container">
          {tasksLoading ? (
            <div className="loading-container">
              <div className="loading-spinner">Loading...</div>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <div className="dashboard">
                  <h1 className="page-title">Dashboard</h1>
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-icon">✓</div>
                      <div className="metric-label">Completed Today</div>
                      <div className="metric-value">{tasks.filter(t => t.completed).length} / {tasks.length}</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">📈</div>
                      <div className="metric-label">Completion Rate</div>
                      <div className="metric-value">{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">⏱️</div>
                      <div className="metric-label">Time Today</div>
                      <div className="metric-value">{tasks.filter(t => t.scheduledStart).reduce((sum, t) => sum + (t.estimatedMinutes || 0), 0)}m</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-icon">📋</div>
                      <div className="metric-label">Pending Tasks</div>
                      <div className="metric-value">{tasks.filter(t => !t.completed).length}</div>
                    </div>
                  </div>

                  <div className="progress-section">
                    <div className="progress-header">
                      <h2>Today's Progress</h2>
                      <span className="progress-percent">{tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}% Complete</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: tasks.length > 0 ? `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%` : '0%' }}></div>
                    </div>
                  </div>

                  <div className="quick-task-section">
                    <button className="btn-quick-task">+ Add Quick Task</button>
                  </div>

                  <div className="today-tasks-section">
                    <h2>Today's Tasks</h2>
                    {tasks.length === 0 ? (
                      <p className="empty-state">No tasks for today. Add some tasks to get started!</p>
                    ) : (
                      <TaskList
                        tasks={tasks.slice(0, 5)}
                        onComplete={completeTask}
                        onDelete={deleteTask}
                      />
                    )}
                  </div>

                  <div className="coming-up-section">
                    <h2>Coming Up</h2>
                    {tasks.filter(t => t.scheduledStart && !t.completed).length === 0 ? (
                      <p className="empty-state">No upcoming tasks scheduled</p>
                    ) : (
                      <div className="upcoming-list">
                        {tasks.filter(t => t.scheduledStart && !t.completed).map(task => (
                          <div key={task.id} className="upcoming-item">
                            <div className="upcoming-time">{task.scheduledStart ? new Date(task.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                            <div className="upcoming-title">{task.title}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="schedule-view">
                  <h1 className="page-title">Schedule</h1>
                  <ScheduleBuilder
                    tasks={tasks}
                    onTaskSchedule={handleScheduleTask}
                    onTaskUnschedule={(taskId: string) => unscheduleTask(taskId)}
                  />
                </div>
              )}

              {activeTab === 'statistics' && (
                <div className="statistics-view">
                  <h1 className="page-title">Statistics</h1>
                  <UsageStats />
                  <DaySummary tasks={tasks} />
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="profile-view">
                  <h1 className="page-title">Profile</h1>
                  <div className="profile-card">
                    <p>Email: {user?.email}</p>
                    <button className="btn-sign-out" onClick={signOut}>Sign Out</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
