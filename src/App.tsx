import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './contexts/AuthContext';
import TaskInput from './components/TaskInput';
import TaskList from './components/TaskList';
import ScheduleBuilder from './components/ScheduleBuilder';
import DaySummary from './components/DaySummary';
import Auth from './components/Auth';
import './App.css';

function App() {
  const { user, loading, signOut } = useAuth();
  const {
    tasks,
    loading: tasksLoading,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    scheduleTask,
    unscheduleTask,
  } = useTasks();

  const [activeTab, setActiveTab] = useState<'tasks' | 'schedule' | 'summary'>(
    'tasks'
  );

  const handleScheduleTask = (taskId: string, start: Date, end: Date) => {
    scheduleTask(taskId, start, end);
  };

  const handleMoveTask = (taskId: string, newStart: Date) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const newEnd = new Date(
        newStart.getTime() + task.estimatedMinutes * 60 * 1000
      );
      scheduleTask(taskId, newStart, newEnd);
    }
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
      <header className="app-header">
        <div className="header-content">
      <div>
            <h1 className="app-title">FlowDay</h1>
            <p className="app-subtitle">Your daily productivity companion</p>
          </div>
          <button onClick={signOut} className="sign-out-btn">
            Sign Out
          </button>
      </div>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button
          className={`nav-btn ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule
        </button>
        <button
          className={`nav-btn ${activeTab === 'summary' ? 'active' : ''}`}
          onClick={() => setActiveTab('summary')}
        >
          Summary
        </button>
      </nav>

      <main className="app-main">
        <div className="app-container">
          {tasksLoading ? (
            <div className="loading-container">
              <div className="loading-spinner">Loading tasks...</div>
      </div>
          ) : (
            <>
              {activeTab === 'tasks' && (
                <>
                  <TaskInput onAddTask={addTask} />
                  <TaskList
                    tasks={tasks}
                    onComplete={completeTask}
                    onDelete={deleteTask}
                  />
                </>
              )}

              {activeTab === 'schedule' && (
                <ScheduleBuilder
                  tasks={tasks}
                  onScheduleTask={handleScheduleTask}
                  onUnscheduleTask={unscheduleTask}
                  onMoveTask={handleMoveTask}
                />
              )}

              {activeTab === 'summary' && <DaySummary tasks={tasks} />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
