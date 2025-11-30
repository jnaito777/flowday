import { useMemo } from 'react';
import type { Task, DaySummary as DaySummaryType } from '../types';
import { format, isToday, startOfDay } from 'date-fns';
import { StatCard } from './StatCard';
import { TaskItemCard } from './TaskItemCard';
import './DaySummary.css';

interface DaySummaryProps {
  tasks: Task[];
}

export default function DaySummary({ tasks }: DaySummaryProps) {
  const summary = useMemo(() => {
    const today = startOfDay(new Date());
    const todayTasks = tasks.filter((task) => {
      if (!task.completedAt) return false;
      const taskDate = startOfDay(new Date(task.completedAt));
      return taskDate.getTime() === today.getTime();
    });

    const todayIncompleteTasks = tasks.filter((task) => {
      if (task.completed) return false;
      // Consider task part of today if scheduledStart is today or created today
      if (task.scheduledStart) {
        const s = startOfDay(new Date(task.scheduledStart));
        if (s.getTime() === today.getTime()) return true;
      }
      // If not scheduled, include unscheduled tasks as part of today's actionable tasks
      return true;
    });

    const completedTasks = todayTasks.filter((t) => t.completed);
    const totalEstimated = completedTasks.reduce(
      (sum, task) => sum + (task.estimatedMinutes || 0),
      0
    );

    // Calculate actual time (difference between scheduled start and completion)
    const actualMinutes = completedTasks.reduce((sum, task) => {
      if (task.scheduledStart && task.completedAt) {
        const start = new Date(task.scheduledStart);
        const end = new Date(task.completedAt);
        const diff = (end.getTime() - start.getTime()) / (1000 * 60);
        return sum + Math.max(0, diff);
      }
      return sum + (task.estimatedMinutes || 0);
    }, 0);

    return {
      date: today,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      totalEstimatedMinutes: totalEstimated,
      actualMinutes: Math.round(actualMinutes),
      tasks: completedTasks,
      incompleteTasks: todayIncompleteTasks,
    } as DaySummaryType;
  }, [tasks]);

  const completionRate =
    summary.totalTasks > 0
      ? Math.round((summary.completedTasks / summary.totalTasks) * 100)
      : 0;

  const timeAccuracy =
    summary.totalEstimatedMinutes > 0
      ? Math.round(
          (summary.totalEstimatedMinutes / summary.actualMinutes) * 100
        )
      : 100;

  if (summary.completedTasks === 0) {
    return (
      <div className="day-summary">
        <div className="summary-header">
          <h2>End of Day Summary</h2>
          <div className="summary-date">
            {isToday(summary.date)
              ? 'Today'
              : format(summary.date, 'MMMM d, yyyy')}
          </div>
        </div>
        <div className="summary-empty">
          <p>Complete some tasks to see your summary!</p>
        </div>

        {summary.incompleteTasks && summary.incompleteTasks.length > 0 && (
          <div className="incomplete-alert">
            <h3>Incomplete Tasks (Today)</h3>
            <ul>
              {summary.incompleteTasks.map((t) => (
                <li key={t.id} className="incomplete-item">
                  {t.title} — {t.estimatedMinutes} min
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="day-summary">
      <div className="summary-header">
        <h2>End of Day Summary</h2>
        <div className="summary-date">
          {isToday(summary.date)
            ? 'Today'
            : format(summary.date, 'MMMM d, yyyy')}
        </div>
      </div>

      <div className="summary-stats">
        <StatCard
          title="Tasks Completed"
          value={summary.completedTasks}
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
        />
        <StatCard
          title="Estimated Minutes"
          value={summary.totalEstimatedMinutes}
        />
        <StatCard
          title="Actual Minutes"
          value={summary.actualMinutes}
        />
      </div>

      <div className="summary-insights">
        <h3>Insights</h3>
        <div className="insight-item">
          <span className="insight-label">Time Accuracy:</span>
          <span className={`insight-value ${timeAccuracy > 100 ? 'over' : timeAccuracy < 90 ? 'under' : 'good'}`}>
            {timeAccuracy > 100
              ? `${timeAccuracy - 100}% over estimate`
              : timeAccuracy < 90
              ? `${100 - timeAccuracy}% under estimate`
              : 'On track!'}
          </span>
        </div>
        <div className="insight-item">
          <span className="insight-label">Productivity Score:</span>
          <span className="insight-value">
            {Math.round(
              (completionRate * 0.6 + Math.min(100, timeAccuracy) * 0.4)
            )}
            /100
          </span>
        </div>
      </div>

      <div className="completed-tasks-list">
        <h3>Completed Tasks</h3>
        <div className="tasks-grid">
          {summary.tasks.map((task) => (
            <TaskItemCard key={task.id} task={task} isCompleted showTime />
          ))}
        </div>
      </div>

      {summary.incompleteTasks && summary.incompleteTasks.length > 0 && (
        <div className="incomplete-section">
          <h3 style={{ color: '#b91c1c' }}>Incomplete Tasks (Today)</h3>
          <div className="tasks-grid">
            {summary.incompleteTasks.map((t) => (
              <TaskItemCard key={t.id} task={t} isCompleted={false} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
