import type { Task } from '../types';
import { format } from 'date-fns';

interface TaskItemCardProps {
  task: Task;
  isCompleted?: boolean;
  showTime?: boolean;
}

export function TaskItemCard({ task, isCompleted = false, showTime = false }: TaskItemCardProps) {
  return (
    <div className={`task-item-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-item-title">
        {isCompleted && '✓ '}
        {task.title}
      </div>
      <div className="task-item-meta">
        {task.estimatedMinutes} min
        {showTime && task.completedAt && ` • ${format(new Date(task.completedAt), 'h:mm a')}`}
      </div>
    </div>
  );
}
