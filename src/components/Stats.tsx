import { useEffect, useState } from 'react';
import { Task } from '../types';
import { storage } from '../utils/storage';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, CheckCircle, Clock, Target } from 'lucide-react';

type PeriodType = 'daily' | 'weekly' | 'monthly';

export function Stats() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [period, setPeriod] = useState<PeriodType>('weekly');

  useEffect(() => {
    setTasks(storage.getTasks());
  }, []);

  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const getDateRange = () => {
    switch (period) {
      case 'daily':
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(today);
          date.setDate(today.getDate() - 6 + i);
          return date.toISOString().split('T')[0];
        });
      case 'weekly':
        return Array.from({ length: 4 }, (_, i) => {
          const weekStart = new Date(startOfWeek);
          weekStart.setDate(startOfWeek.getDate() - (3 - i) * 7);
          return weekStart.toISOString().split('T')[0];
        });
      case 'monthly':
        return Array.from({ length: 6 }, (_, i) => {
          const monthStart = new Date(startOfMonth);
          monthStart.setMonth(startOfMonth.getMonth() - 5 + i);
          return monthStart.toISOString().split('T')[0];
        });
    }
  };

  const calculateStats = () => {
    const dateRange = getDateRange();
    
    const chartData = dateRange.map(date => {
      let tasksInPeriod: Task[];
      let label: string;

      if (period === 'daily') {
        tasksInPeriod = tasks.filter(task => task.date === date);
        label = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      } else if (period === 'weekly') {
        const weekEnd = new Date(date);
        weekEnd.setDate(weekEnd.getDate() + 7);
        tasksInPeriod = tasks.filter(task => {
          const taskDate = new Date(task.date);
          return taskDate >= new Date(date) && taskDate < weekEnd;
        });
        label = `Week ${new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else {
        const monthEnd = new Date(date);
        monthEnd.setMonth(monthEnd.getMonth() + 1);
        tasksInPeriod = tasks.filter(task => {
          const taskDate = new Date(task.date);
          return taskDate >= new Date(date) && taskDate < monthEnd;
        });
        label = new Date(date).toLocaleDateString('en-US', { month: 'short' });
      }

      const completed = tasksInPeriod.filter(t => t.completed).length;
      const total = tasksInPeriod.length;

      return {
        name: label,
        completed,
        pending: total - completed,
        total,
        rate: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });

    return chartData;
  };

  const chartData = calculateStats();

  // Type distribution
  const workTasks = tasks.filter(t => t.type === 'work');
  const personalTasks = tasks.filter(t => t.type === 'personal');
  const typeData = [
    { name: 'Work', value: workTasks.length, color: '#3b82f6' },
    { name: 'Personal', value: personalTasks.length, color: '#a855f7' },
  ];

  // Overall stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const overallCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const avgCompletionRate = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, d) => sum + d.rate, 0) / chartData.length) 
    : 0;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-gray-900 mb-2">Statistics</h2>
          <p className="text-gray-600">Track your productivity over time</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setPeriod('daily')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'daily' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'weekly' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setPeriod('monthly')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              period === 'monthly' 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            Monthly
          </button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Total Tasks</p>
            <p className="text-gray-900">{totalTasks}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Completed</p>
            <p className="text-gray-900">{completedTasks}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Pending</p>
            <p className="text-gray-900">{totalTasks - completedTasks}</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-gray-600 mb-1">Avg Completion</p>
            <p className="text-gray-900">{avgCompletionRate}%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Completion Chart */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-gray-900 mb-4">Task Completion</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="pending" fill="#f59e0b" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Type Distribution */}
          <div className="bg-white p-6 rounded-xl border border-gray-200">
            <h3 className="text-gray-900 mb-4">Task Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Completion Rate Trend */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-gray-900 mb-4">Completion Rate Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="rate" 
                stroke="#6366f1" 
                strokeWidth={2}
                name="Completion Rate (%)" 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
