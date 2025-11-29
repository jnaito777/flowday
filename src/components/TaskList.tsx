import type { Task } from '../types';
import { TaskItem } from './TaskItem';
import './TaskList.css';

interface TaskListProps {
  tasks: Task[];
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskList({ tasks, onComplete, onDelete }: TaskListProps) {
  const unscheduledTasks = tasks.filter((t) => !t.scheduledStart && !t.completed);
  const scheduledTasks = tasks.filter((t) => t.scheduledStart && !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="task-list-container">
      {unscheduledTasks.length > 0 && (
        <div className="task-section">
          <h3 className="task-section-title">Unscheduled Tasks</h3>
          <div className="task-items">
            {unscheduledTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {scheduledTasks.length > 0 && (
        <div className="task-section">
          <h3 className="task-section-title">Scheduled Tasks</h3>
          <div className="task-items">
            {scheduledTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {completedTasks.length > 0 && (
        <div className="task-section">
          <h3 className="task-section-title">Completed</h3>
          <div className="task-items">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onComplete={onComplete}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {tasks.length === 0 && (
        <div className="empty-state">
          <p>No tasks yet. Add one to get started!</p>
        </div>
      )}
    </div>
  );
}
