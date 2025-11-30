import { useEffect, useState } from "react";
import type { Task } from "../types";
import { storage } from "../utils/storage";
import {
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  TrendingUp,
  Play,
  Pause,
  Calendar,
  Edit2,
  Timer,
} from "lucide-react";

export function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<
    string | null
  >(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    loadTasks();

    // Update time every second for timer display
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadTasks = () => {
    setTasks(storage.getTasks());
  };

  const today = new Date().toISOString().split("T")[0];
  const todayTasks = tasks.filter(
    (task) => task.date === today,
  );
  const completedToday = todayTasks.filter(
    (task) => task.completed,
  ).length;
  const totalToday = todayTasks.length;
  const completionRate =
    totalToday > 0
      ? Math.round((completedToday / totalToday) * 100)
      : 0;

  // Calculate total time for today
  const totalTimeToday = todayTasks.reduce(
    (sum, task) => sum + (task.duration || 0),
    0,
  );
  const timeSpentToday = todayTasks.reduce((sum, task) => {
    let spent = task.timeSpent || 0;
    if (task.inProgress && task.timerStartedAt) {
      const elapsed = Math.floor(
        (currentTime.getTime() -
          new Date(task.timerStartedAt).getTime()) /
          60000,
      );
      spent += elapsed;
    }
    return sum + spent;
  }, 0);

  const upcomingTasks = tasks
    .filter((task) => task.date > today && !task.completed)
    .sort((a, b) => {
      if (a.date !== b.date)
        return a.date.localeCompare(b.date);
      return (a.startTime || "").localeCompare(
        b.startTime || "",
      );
    })
    .slice(0, 5);

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        // If completing a task that's in progress, stop the timer first
        let finalTask = { ...task };
        if (task.inProgress && task.timerStartedAt) {
          const elapsed = Math.floor(
            (new Date().getTime() -
              new Date(task.timerStartedAt).getTime()) /
              60000,
          );
          finalTask.timeSpent = (task.timeSpent || 0) + elapsed;
          finalTask.inProgress = false;
          finalTask.timerStartedAt = undefined;
        }

        return {
          ...finalTask,
          completed: !task.completed,
          completedAt: !task.completed
            ? new Date().toISOString()
            : undefined,
        };
      }
      return task;
    });
    storage.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  };

  const toggleTimer = (taskId: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        if (task.inProgress) {
          // Stop timer
          const elapsed = Math.floor(
            (new Date().getTime() -
              new Date(task.timerStartedAt!).getTime()) /
              60000,
          );
          return {
            ...task,
            inProgress: false,
            timerStartedAt: undefined,
            timeSpent: (task.timeSpent || 0) + elapsed,
          };
        } else {
          // Start timer - stop all other timers first
          return {
            ...task,
            inProgress: true,
            timerStartedAt: new Date().toISOString(),
          };
        }
      } else if (task.inProgress) {
        // Stop other timers
        const elapsed = Math.floor(
          (new Date().getTime() -
            new Date(task.timerStartedAt!).getTime()) /
            60000,
        );
        return {
          ...task,
          inProgress: false,
          timerStartedAt: undefined,
          timeSpent: (task.timeSpent || 0) + elapsed,
        };
      }
      return task;
    });
    storage.saveTasks(updatedTasks);
    setTasks(updatedTasks);
  };

  const getElapsedTime = (task: Task) => {
    let total = task.timeSpent || 0;
    if (task.inProgress && task.timerStartedAt) {
      const elapsed = Math.floor(
        (currentTime.getTime() -
          new Date(task.timerStartedAt).getTime()) /
          1000,
      );
      total += Math.floor(elapsed / 60);
    }
    return total;
  };

  const getElapsedSeconds = (task: Task) => {
    if (task.inProgress && task.timerStartedAt) {
      const elapsed = Math.floor(
        (currentTime.getTime() -
          new Date(task.timerStartedAt).getTime()) /
          1000,
      );
      return elapsed % 60;
    }
    return 0;
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatTimerDisplay = (
    minutes: number,
    seconds: number,
  ) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const addQuickTask = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const type = formData.get("type") as "work" | "personal";
    const duration = formData.get("duration") as string;

    if (!title.trim()) return;

    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      type,
      date: today,
      duration: duration ? parseInt(duration) : undefined,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    const updatedTasks = [...tasks, newTask];
    storage.saveTasks(updatedTasks);
    setTasks(updatedTasks);
    setShowAddTask(false);
  };

  const updateTaskDuration = (
    taskId: string,
    duration: number,
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, duration } : task,
    );
    storage.saveTasks(updatedTasks);
    setTasks(updatedTasks);
    setEditingTaskId(null);
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">Dashboard</h2>
          <p className="text-gray-600">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">
              Completed Today
            </p>
            <p className="text-gray-900">
              {completedToday} / {totalToday}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">
              Completion Rate
            </p>
            <p className="text-gray-900">{completionRate}%</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Time Today</p>
            <p className="text-gray-900">
              {formatTime(timeSpentToday)}{" "}
              {totalTimeToday > 0 &&
                `/ ${formatTime(totalTimeToday)}`}
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Pending Tasks</p>
            <p className="text-gray-900">
              {totalToday - completedToday}
            </p>
          </div>
        </div>

        {/* Daily Progress */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-900">Today's Progress</h3>
            <span className="text-gray-600">
              {completionRate}% Complete
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>

          {/* Time Progress */}
          {totalTimeToday > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">
                  Time Progress
                </span>
                <span className="text-gray-600">
                  {formatTime(timeSpentToday)} /{" "}
                  {formatTime(totalTimeToday)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((timeSpentToday / totalTimeToday) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Add Task */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          {!showAddTask ? (
            <button
              onClick={() => setShowAddTask(true)}
              className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Add Quick Task</span>
            </button>
          ) : (
            <form onSubmit={addQuickTask} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Task title..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                autoFocus
              />
              <div className="flex gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="work"
                    defaultChecked
                  />
                  <span className="text-gray-700">Work</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="type"
                    value="personal"
                  />
                  <span className="text-gray-700">
                    Personal
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-gray-700 mb-2">
                  Expected Duration (minutes)
                </label>
                <select
                  name="duration"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">No duration set</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="240">4 hours</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Add Task
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Today's Tasks */}
        <div className="bg-white rounded-xl border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Today's Tasks</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {todayTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No tasks for today. Add some tasks to get
                started!
              </div>
            ) : (
              todayTasks
                .sort((a, b) => {
                  // Sort by start time, then by creation time
                  if (a.startTime && b.startTime) {
                    return a.startTime.localeCompare(b.startTime);
                  }
                  if (a.startTime) return -1;
                  if (b.startTime) return 1;
                  return (a.createdAt || '').localeCompare(b.createdAt || '');
                })
                .map((task) => {
                  const elapsed = getElapsedTime(task);
                  const seconds = getElapsedSeconds(task);
                  const progress =
                    task.duration && elapsed > 0
                      ? Math.min(
                          (elapsed / task.duration) * 100,
                          100,
                        )
                      : 0;

                  return (
                    <div
                      key={task.id}
                      className={`p-4 transition-colors ${
                        task.inProgress
                          ? "bg-indigo-50 border-l-4 border-indigo-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4
                              className={`text-gray-900 ${task.completed ? "line-through text-gray-400" : ""}`}
                            >
                              {task.title}
                            </h4>
                            {!task.completed && (
                              <button
                                onClick={() =>
                                  toggleTimer(task.id)
                                }
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                  task.inProgress
                                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                                    : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                                }`}
                              >
                                {task.inProgress ? (
                                  <>
                                    <Pause className="w-4 h-4" />
                                    <span>Stop</span>
                                  </>
                                ) : (
                                  <>
                                    <Play className="w-4 h-4" />
                                    <span>Start</span>
                                  </>
                                )}
                              </button>
                            )}
                          </div>

                          {/* Timer Display - Prominent when running */}
                          {task.inProgress && (
                            <div className="mb-3 p-4 bg-white border-2 border-indigo-600 rounded-lg">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Timer className="w-5 h-5 text-indigo-600 animate-pulse" />
                                  <span className="text-gray-600">
                                    Timer Running
                                  </span>
                                </div>
                                <div className="text-indigo-600 tabular-nums">
                                  {formatTimerDisplay(
                                    elapsed,
                                    seconds,
                                  )}
                                </div>
                              </div>
                              {task.duration && (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-gray-600">
                                      Progress
                                    </span>
                                    <span className="text-gray-900">
                                      {Math.round(progress)}% (
                                      {formatTime(elapsed)} /{" "}
                                      {formatTime(
                                        task.duration,
                                      )}
                                      )
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-500"
                                      style={{
                                        width: `${progress}%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          <div className="flex items-center gap-3 text-gray-600 mb-2 flex-wrap">
                            <span
                              className={`px-2 py-1 rounded text-white ${
                                task.type === "work"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                              }`}
                            >
                              {task.type}
                            </span>
                            {task.startTime && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {task.startTime}
                                {task.endTime &&
                                  ` - ${task.endTime}`}
                              </span>
                            )}

                            {/* Expected Duration */}
                            {editingTaskId === task.id ? (
                              <div className="flex items-center gap-2">
                                <select
                                  defaultValue={
                                    task.duration?.toString() ||
                                    ""
                                  }
                                  onChange={(e) => {
                                    const value =
                                      e.target.value;
                                    if (value) {
                                      updateTaskDuration(
                                        task.id,
                                        parseInt(value),
                                      );
                                    }
                                  }}
                                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  autoFocus
                                >
                                  <option value="">
                                    No duration
                                  </option>
                                  <option value="15">
                                    15 min
                                  </option>
                                  <option value="30">
                                    30 min
                                  </option>
                                  <option value="45">
                                    45 min
                                  </option>
                                  <option value="60">
                                    1 hour
                                  </option>
                                  <option value="90">
                                    1.5 hours
                                  </option>
                                  <option value="120">
                                    2 hours
                                  </option>
                                  <option value="180">
                                    3 hours
                                  </option>
                                  <option value="240">
                                    4 hours
                                  </option>
                                </select>
                                <button
                                  onClick={() =>
                                    setEditingTaskId(null)
                                  }
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded ${
                                    task.duration
                                      ? "bg-green-100 text-green-700"
                                      : "bg-gray-100 text-gray-500"
                                  }`}
                                >
                                  Expected:{" "}
                                  {task.duration
                                    ? formatTime(task.duration)
                                    : "Not set"}
                                </span>
                                {!task.completed && (
                                  <button
                                    onClick={() =>
                                      setEditingTaskId(task.id)
                                    }
                                    className="p-1 text-gray-400 hover:text-indigo-600"
                                    title="Set expected duration"
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            )}

                            {/* Time Spent */}
                            {elapsed > 0 &&
                              !task.inProgress && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                  Spent: {formatTime(elapsed)}
                                </span>
                              )}
                          </div>

                          {/* Time Progress Bar for tasks with duration (when not running) */}
                          {task.duration &&
                            !task.completed &&
                            !task.inProgress &&
                            elapsed > 0 && (
                              <div className="mt-2">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-gray-600">
                                    Progress
                                  </span>
                                  <span className="text-gray-600">
                                    {Math.round(progress)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-gray-400 h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${progress}%`,
                                    }}
                                  ></div>
                                </div>
                              </div>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                })
            )}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-gray-900">Coming Up</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingTasks.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No upcoming tasks scheduled
              </div>
            ) : (
              upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <Circle className="w-5 h-5 text-gray-400 mt-1" />
                    <div className="flex-1">
                      <h4 className="text-gray-900 mb-1">
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-3 text-gray-600">
                        <span
                          className={`px-2 py-1 rounded text-white ${
                            task.type === "work"
                              ? "bg-blue-500"
                              : "bg-purple-500"
                          }`}
                        >
                          {task.type}
                        </span>
                        <span>
                          {new Date(
                            task.date,
                          ).toLocaleDateString()}
                        </span>
                        {task.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {task.startTime}
                            {task.duration &&
                              ` (${task.duration} min)`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}