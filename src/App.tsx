import { useState } from 'react';
import { useTasks } from './hooks/useTasks';
import { useAuth } from './contexts/AuthContext';
import TaskInput from './components/TaskInput';
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
    addTask,
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
      <NavBar activeTab={activeTab} onChange={setActiveTab} onSignOut={signOut} />
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
                  onTaskSchedule={handleScheduleTask}
                  onTaskUnschedule={(taskId: string) => unscheduleTask(taskId)}
                />
              )}

              {activeTab === 'summary' && <DaySummary tasks={tasks} />}
              {activeTab === 'summary' && <UsageStats />}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
