import React, { useState, useEffect } from 'react';
import { Calendar, Clock, CheckCircle, Circle, Play, Pause, TrendingUp, BarChart3, User, Plus, Edit2, Trash2, X } from 'lucide-react';

// Types
interface Task {
  id: string;
  title: string;
  date: string;
  startTime?: string;
  duration?: number; // in minutes
  endTime?: string;
  completed: boolean;
  inProgress: boolean;
  timeSpent: number; // in minutes
  timerStartedAt?: number;
  category?: 'work' | 'personal' | 'other';
}

// Storage utility
const storage = {
  getTasks: (): Task[] => {
    const data = localStorage.getItem('taskflow-tasks');
    return data ? JSON.parse(data) : [];
  },
  saveTasks: (tasks: Task[]) => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks));
  }
};

// Format time helper
const formatTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const secs = 0;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Task Form Component
const TaskForm = ({ task, onSave, onCancel }: { task?: Task; onSave: (task: Partial<Task>) => void; onCancel: () => void }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [date, setDate] = useState(task?.date || new Date().toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(task?.startTime || '');
  const [duration, setDuration] = useState(task?.duration?.toString() || '');
  const [category, setCategory] = useState(task?.category || 'work');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      date,
      startTime: startTime || undefined,
      duration: duration ? parseInt(duration) : undefined,
      category: category as 'work' | 'personal' | 'other',
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">{task ? 'Edit Task' : 'New Task'}</h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What do you need to do?"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Not set</option>
                <option value="15">15 min</option>
                <option value="30">30 min</option>
                <option value="45">45 min</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
                <option value="180">3 hours</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              {task ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App
export default function TaskFlowApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<'dashboard' | 'schedule' | 'stats' | 'profile'>('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    setTasks(storage.getTasks());
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    storage.saveTasks(tasks);
  }, [tasks]);

  const today = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.date === today);
  const completedToday = todayTasks.filter(t => t.completed).length;
  const totalDurationToday = todayTasks.reduce((sum, t) => sum + (t.duration || 0), 0);
  
  const totalTimeSpentToday = todayTasks.reduce((sum, task) => {
    let spent = task.timeSpent;
    if (task.inProgress && task.timerStartedAt) {
      const elapsed = Math.floor((currentTime - task.timerStartedAt) / 60000);
      spent += elapsed;
    }
    return sum + spent;
  }, 0);

  const completionRate = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;
  const timeProgress = totalDurationToday > 0 ? Math.round((totalTimeSpentToday / totalDurationToday) * 100) : 0;

  const upcomingTasks = tasks
    .filter(t => t.date > today && !t.completed)
    .sort((a, b) => a.date.localeCompare(b.date) || (a.startTime || '').localeCompare(b.startTime || ''))
    .slice(0, 5);

  const addTask = (taskData: Partial<Task>) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: taskData.title!,
      date: taskData.date!,
      startTime: taskData.startTime,
      duration: taskData.duration,
      category: taskData.category,
      completed: false,
      inProgress: false,
      timeSpent: 0,
    };
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
  };

  const updateTask = (taskData: Partial<Task>) => {
    if (!editingTask) return;
    setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } : t));
    setEditingTask(undefined);
  };

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const toggleComplete = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (task.inProgress) {
          const elapsed = Math.floor((Date.now() - (task.timerStartedAt || 0)) / 60000);
          return {
            ...task,
            completed: !task.completed,
            inProgress: false,
            timeSpent: task.timeSpent + elapsed,
            timerStartedAt: undefined,
          };
        }
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  const toggleTimer = (taskId: string) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (task.inProgress) {
          const elapsed = Math.floor((Date.now() - (task.timerStartedAt || 0)) / 60000);
          return {
            ...task,
            inProgress: false,
            timeSpent: task.timeSpent + elapsed,
            timerStartedAt: undefined,
          };
        } else {
          return {
            ...task,
            inProgress: true,
            timerStartedAt: Date.now(),
          };
        }
      } else if (task.inProgress) {
        const elapsed = Math.floor((Date.now() - (task.timerStartedAt || 0)) / 60000);
        return {
          ...task,
          inProgress: false,
          timeSpent: task.timeSpent + elapsed,
          timerStartedAt: undefined,
        };
      }
      return task;
    }));
  };

  const getElapsedTime = (task: Task): number => {
    if (!task.inProgress || !task.timerStartedAt) return task.timeSpent;
    const elapsed = Math.floor((currentTime - task.timerStartedAt) / 60000);
    return task.timeSpent + elapsed;
  };

  // Dashboard View
  const DashboardView = () => {
    const runningTask = todayTasks.find(t => t.inProgress);

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Today's Focus</h1>
            <p className="text-gray-600 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <button
            onClick={() => setShowTaskForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-lg"
          >
            <Plus size={20} />
            Add Task
          </button>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="text-blue-600" size={24} />
              <span className="text-sm font-medium text-gray-700">Tasks Completed</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{completedToday} / {todayTasks.length}</div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
              <div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${completionRate}%` }}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-purple-600" size={24} />
              <span className="text-sm font-medium text-gray-700">Time Progress</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{formatDuration(totalTimeSpentToday)}</div>
            <div className="text-sm text-gray-600 mt-1">of {formatDuration(totalDurationToday)} planned</div>
            <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
              <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${Math.min(timeProgress, 100)}%` }}></div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="text-green-600" size={24} />
              <span className="text-sm font-medium text-gray-700">Completion Rate</span>
            </div>
            <div className="text-3xl font-bold text-gray-900">{completionRate}%</div>
            <div className="text-sm text-gray-600 mt-1">{completedToday} tasks done today</div>
          </div>
        </div>

        {/* Active Timer */}
        {runningTask && (
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-300 rounded-xl p-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-orange-500 p-3 rounded-full">
                  <Clock className="text-white" size={24} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Currently Working On</div>
                  <div className="text-xl font-bold text-gray-900">{runningTask.title}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-mono font-bold text-orange-600">
                  {formatTime(getElapsedTime(runningTask))}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {runningTask.duration ? `Expected: ${formatDuration(runningTask.duration)}` : 'No time limit'}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Today's Tasks */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Tasks</h2>
          {todayTasks.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
              <Calendar className="mx-auto text-gray-400 mb-3" size={48} />
              <p className="text-gray-600">No tasks for today. Click "Add Task" to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTasks.map(task => {
                const elapsed = getElapsedTime(task);
                const progress = task.duration ? Math.min((elapsed / task.duration) * 100, 100) : 0;
                
                return (
                  <div
                    key={task.id}
                    className={`bg-white border-2 rounded-xl p-4 transition-all ${
                      task.inProgress ? 'border-orange-400 shadow-lg' : 'border-gray-200 hover:border-gray-300'
                    } ${task.completed ? 'opacity-60' : ''}`}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleComplete(task.id)}
                        className="mt-1 flex-shrink-0"
                      >
                        {task.completed ? (
                          <CheckCircle className="text-green-600" size={24} />
                        ) : (
                          <Circle className="text-gray-400 hover:text-gray-600" size={24} />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className={`font-semibold text-gray-900 ${task.completed ? 'line-through' : ''}`}>
                              {task.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                              {task.startTime && (
                                <span className="flex items-center gap-1">
                                  <Clock size={14} />
                                  {task.startTime}
                                </span>
                              )}
                              {task.duration && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                  {formatDuration(task.duration)}
                                </span>
                              )}
                              {task.category && (
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  task.category === 'work' ? 'bg-purple-100 text-purple-700' :
                                  task.category === 'personal' ? 'bg-green-100 text-green-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {task.category}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {!task.completed && (
                              <button
                                onClick={() => toggleTimer(task.id)}
                                className={`p-2 rounded-lg font-medium transition-colors ${
                                  task.inProgress
                                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                                    : 'bg-green-600 text-white hover:bg-green-700'
                                }`}
                              >
                                {task.inProgress ? <Pause size={20} /> : <Play size={20} />}
                              </button>
                            )}
                            <button
                              onClick={() => setEditingTask(task)}
                              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>

                        {task.duration && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs text-gray-600">
                              <span>Time Spent: {formatDuration(elapsed)}</span>
                              <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  progress >= 100 ? 'bg-red-500' : task.inProgress ? 'bg-orange-500' : 'bg-blue-500'
                                }`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Coming Up */}
        {upcomingTasks.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Coming Up</h2>
            <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-200">
              {upcomingTasks.map(task => (
                <div key={task.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <h3 className="font-medium text-gray-900">{task.title}</h3>
                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                      {task.startTime && (
                        <span className="flex items-center gap-1">
                          <Clock size={14} />
                          {task.startTime}
                        </span>
                      )}
                    </div>
                  </div>
                  {task.duration && (
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                      {formatDuration(task.duration)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Simple placeholder views
  const ScheduleView = () => (
    <div className="text-center py-12">
      <Calendar className="mx-auto text-gray-400 mb-4" size={64} />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule View</h2>
      <p className="text-gray-600">Full calendar view coming soon</p>
    </div>
  );

  const StatsView = () => (
    <div className="text-center py-12">
      <BarChart3 className="mx-auto text-gray-400 mb-4" size={64} />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Statistics</h2>
      <p className="text-gray-600">Detailed analytics coming soon</p>
    </div>
  );

  const ProfileView = () => (
    <div className="text-center py-12">
      <User className="mx-auto text-gray-400 mb-4" size={64} />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Profile</h2>
      <p className="text-gray-600">User settings coming soon</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="text-white" size={24} />
              </div>
              <span className="text-xl font-bold text-gray-900">TaskFlow</span>
            </div>
            <div className="flex gap-2">
              {[
                { id: 'dashboard', icon: CheckCircle, label: 'Dashboard' },
                { id: 'schedule', icon: Calendar, label: 'Schedule' },
                { id: 'stats', icon: BarChart3, label: 'Stats' },
                { id: 'profile', icon: User, label: 'Profile' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="hidden sm:inline">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'schedule' && <ScheduleView />}
        {currentView === 'stats' && <StatsView />}
        {currentView === 'profile' && <ProfileView />}
      </main>

      {/* Task Form Modal */}
      {(showTaskForm || editingTask) && (
        <TaskForm
          task={editingTask}
          onSave={editingTask ? updateTask : addTask}
          onCancel={() => {
            setShowTaskForm(false);
            setEditingTask(undefined);
          }}
        />
      )}
    </div>
  );
}