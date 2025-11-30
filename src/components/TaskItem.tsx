import type { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onComplete, onDelete }: TaskItemProps) {
  const categoryColor = 
    task.category === 'work' ? '#667eea' :
    task.category === 'personal' ? '#764ba2' :
    '#999';

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      <div className="task-content">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onComplete(task.id)}
          className="task-checkbox"
        />
        <div className="task-info">
          <div className="task-header">
            <span className="task-title">{task.title}</span>
            {task.category && (
              <span 
                className="task-category"
                style={{ backgroundColor: categoryColor }}
              >
                {task.category}
              </span>
            )}
          </div>
          {task.description && (
            <span className="task-description">{task.description}</span>
          )}
          <span className="task-time">{task.estimatedMinutes} min</span>
        </div>
      </div>
      {task.scheduledStart && (
        <div className="task-scheduled">
          {new Date(task.scheduledStart).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      )}
      <button
        onClick={() => onDelete(task.id)}
        className="delete-btn"
        aria-label="Delete task"
      >
        ×
      </button>
    </div>
  );
}
