import { useMemo } from 'react';
import { Task, DaySummary as DaySummaryType } from '../types';
import { format, isToday, startOfDay } from 'date-fns';
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

    const completedTasks = todayTasks.filter((t) => t.completed);
    const totalEstimated = completedTasks.reduce(
      (sum, task) => sum + task.estimatedMinutes,
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
      return sum + task.estimatedMinutes;
    }, 0);

    return {
      date: today,
      totalTasks: tasks.length,
      completedTasks: completedTasks.length,
      totalEstimatedMinutes: totalEstimated,
      actualMinutes: Math.round(actualMinutes),
      tasks: completedTasks,
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
        <div className="stat-card">
          <div className="stat-value">{summary.completedTasks}</div>
          <div className="stat-label">Tasks Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{completionRate}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.totalEstimatedMinutes}</div>
          <div className="stat-label">Estimated Minutes</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{summary.actualMinutes}</div>
          <div className="stat-label">Actual Minutes</div>
        </div>
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
            <div key={task.id} className="completed-task-item">
              <div className="completed-task-title">✓ {task.title}</div>
              <div className="completed-task-meta">
                {task.estimatedMinutes} min •{' '}
                {task.completedAt &&
                  format(new Date(task.completedAt), 'h:mm a')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

