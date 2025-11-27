import { useEffect, useState } from 'react';
import { Task } from '../types';
import { storage } from '../utils/storage';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, CheckCircle2, Circle, Calendar as CalendarIcon, Clock, List, CalendarDays } from 'lucide-react';
import { TimelineView } from './TimelineView';

export function Schedule() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'timeline'>('list');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = () => {
    setTasks(storage.getTasks());
  };

  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const dayTasks = tasks
    .filter(task => task.date === selectedDateStr)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          completed: !task.completed,
          completedAt: !task.completed ? new Date().toISOString() : undefined,
        };
      }
      return task;
    });
    storage.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  };

  const deleteTask = (taskId: string) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    storage.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  };

  const saveTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const startTime = formData.get('startTime') as string || undefined;
    const endTime = formData.get('endTime') as string || undefined;
    const duration = formData.get('duration') as string;
    
    // Calculate end time from start time and duration if duration is provided
    let calculatedEndTime = endTime;
    if (startTime && duration && !endTime) {
      const [hours, minutes] = startTime.split(':').map(Number);
      const durationMinutes = parseInt(duration);
      const totalMinutes = hours * 60 + minutes + durationMinutes;
      const endHours = Math.floor(totalMinutes / 60) % 24;
      const endMinutes = totalMinutes % 60;
      calculatedEndTime = `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}`;
    }
    
    // Calculate duration from start and end time if not provided
    let calculatedDuration = duration ? parseInt(duration) : undefined;
    if (startTime && calculatedEndTime && !duration) {
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      const [endHours, endMinutes] = calculatedEndTime.split(':').map(Number);
      calculatedDuration = (endHours * 60 + endMinutes) - (startHours * 60 + startMinutes);
    }
    
    const taskData: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as 'work' | 'personal',
      date: formData.get('date') as string,
      startTime: startTime,
      endTime: calculatedEndTime,
      duration: calculatedDuration,
      completed: editingTask?.completed || false,
      createdAt: editingTask?.createdAt || new Date().toISOString(),
      completedAt: editingTask?.completedAt,
    };

    let updatedTasks;
    if (editingTask) {
      updatedTasks = tasks.map(task => task.id === editingTask.id ? taskData : task);
    } else {
      updatedTasks = [...tasks, taskData];
    }

    storage.saveTasks(updatedTasks);
    setTasks(updatedTasks);
    setShowAddModal(false);
    setEditingTask(null);
  };

  const goToPreviousDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate);
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const syncCalendar = () => {
    // Mock calendar sync - in a real app, this would use iOS Calendar API
    const mockEvents: Task[] = [
      {
        id: 'sync-' + Date.now(),
        title: 'Team Meeting',
        description: 'Weekly sync with the team',
        type: 'work',
        date: selectedDateStr,
        startTime: '10:00',
        endTime: '11:00',
        duration: 60,
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];

    const updatedTasks = [...tasks, ...mockEvents];
    storage.saveTasks(updatedTasks);
    setTasks(updatedTasks);
    
    const profile = storage.getProfile();
    storage.saveProfile({
      ...profile,
      lastSyncDate: new Date().toISOString(),
    });

    alert('Calendar synced! New events have been imported.');
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-gray-900 mb-2">Schedule</h2>
            <p className="text-gray-600">Manage your tasks and calendar</p>
          </div>
          <div className="flex gap-3">
            <div className="flex gap-2 border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </button>
              <button
                onClick={() => setViewMode('timeline')}
                className={`flex items-center gap-2 px-3 py-2 rounded transition-colors ${
                  viewMode === 'timeline' 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Timeline
              </button>
            </div>
            <button
              onClick={syncCalendar}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <CalendarIcon className="w-5 h-5" />
              Sync Calendar
            </button>
            <button
              onClick={() => {
                setEditingTask(null);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </div>

        {/* Date Navigator */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousDay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="text-center">
              <h3 className="text-gray-900 mb-1">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <button
                onClick={goToToday}
                className="text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Today
              </button>
            </div>

            <button
              onClick={goToNextDay}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Tasks List */}
        {viewMode === 'list' ? (
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-gray-900">Tasks for {selectedDate.toLocaleDateString()}</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {dayTasks.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No tasks scheduled for this day
                </div>
              ) : (
                dayTasks.map(task => (
                  <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="mt-1 text-gray-400 hover:text-indigo-600 transition-colors"
                      >
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <div className="flex-1">
                        <h4 className={`text-gray-900 mb-1 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-gray-600 mb-2">{task.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-gray-600">
                          <span className={`px-2 py-1 rounded text-white ${
                            task.type === 'work' ? 'bg-blue-500' : 'bg-purple-500'
                          }`}>
                            {task.type}
                          </span>
                          {task.startTime && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {task.startTime} {task.endTime && `- ${task.endTime}`}
                              {task.duration && ` (${task.duration} min)`}
                            </span>
                          )}
                          {!task.startTime && task.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {task.duration} minutes
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setShowAddModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this task?')) {
                              deleteTask(task.id);
                            }
                          }}
                          className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <TimelineView tasks={tasks} date={selectedDateStr} />
        )}

        {/* Add/Edit Task Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-md w-full p-6">
              <h3 className="text-gray-900 mb-4">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
              <form onSubmit={saveTask} className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    defaultValue={editingTask?.title}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    defaultValue={editingTask?.description}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Type</label>
                  <select
                    name="type"
                    defaultValue={editingTask?.type || 'work'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={editingTask?.date || selectedDateStr}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 mb-2">Start Time</label>
                    <input
                      type="time"
                      name="startTime"
                      defaultValue={editingTask?.startTime}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 mb-2">End Time</label>
                    <input
                      type="time"
                      name="endTime"
                      defaultValue={editingTask?.endTime}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">
                    Duration (minutes)
                  </label>
                  <select
                    name="duration"
                    defaultValue={editingTask?.duration?.toString() || ''}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select duration</option>
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="45">45 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="90">1.5 hours</option>
                    <option value="120">2 hours</option>
                    <option value="180">3 hours</option>
                    <option value="240">4 hours</option>
                    <option value="480">8 hours</option>
                  </select>
                  <p className="text-gray-600 mt-2">
                    Tip: Set either end time or duration. Duration will calculate end time automatically.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    {editingTask ? 'Update' : 'Add'} Task
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingTask(null);
                    }}
                    className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}