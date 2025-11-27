import { useState, useEffect } from 'react';
import type { Task } from '../types';
import { addHours, startOfDay, setHours } from 'date-fns';
import './ScheduleBuilder.css';

interface ScheduleBuilderProps {
  tasks: Task[];
  onTaskSchedule: (taskId: string, startTime: Date, endTime: Date) => void;
}

interface TimeBlock {
  hour: number;
  task: Task | null;
  isDraggingOver: boolean;
}

export default function ScheduleBuilder({
  tasks,
  onTaskSchedule,
}: ScheduleBuilderProps) {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([]);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  useEffect(() => {
    const blocks: TimeBlock[] = [];
    for (let hour = 9; hour < 17; hour++) {
      blocks.push({
        hour,
        task: null,
        isDraggingOver: false,
      });
    }
    setTimeBlocks(blocks);
  }, []);

  const unscheduledTasks = tasks.filter((t) => !t.scheduledStart && !t.completed);

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, hour: number) => {
    e.preventDefault();
    if (!draggedTask) return;

    const today = startOfDay(new Date());
    const startTime = setHours(today, hour);
    const estimatedHours = Math.ceil(draggedTask.estimatedMinutes / 60);
    const endTime = addHours(startTime, estimatedHours);

    onTaskSchedule(draggedTask.id, startTime, endTime);
    setDraggedTask(null);
  };

  return (
    <div className="schedule-builder">
      <div className="schedule-container">
        <div className="schedule-timeline">
          <h2>Today's Schedule</h2>
          <div className="time-grid">
            {timeBlocks.map((block) => (
              <div
                key={`block-${block.hour}`}
                className="time-block"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, block.hour)}
              >
                <div className="time-label">
                  {block.hour === 12 ? '12 PM' : block.hour < 12 ? `${block.hour} AM` : `${block.hour - 12} PM`}
                </div>
                <div className="task-slot">
                  {block.task && (
                    <div className="scheduled-task">
                      <strong>{block.task.title}</strong>
                      <div className="task-duration">
                        {block.task.estimatedMinutes} min
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="unscheduled-panel">
          <h3>Unscheduled Tasks ({unscheduledTasks.length})</h3>
          <div className="unscheduled-list">
            {unscheduledTasks.length === 0 ? (
              <p className="empty-state">All tasks are scheduled or completed!</p>
            ) : (
              unscheduledTasks.map((task) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className="draggable-task"
                >
                  <div className="task-name">{task.title}</div>
                  <div className="task-time">
                    {task.estimatedMinutes} min
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="schedule-info">
        <h3>Instructions</h3>
        <ul>
          <li>Drag tasks from the left panel to time blocks on the schedule</li>
          <li>Tasks will automatically adjust duration based on estimated time</li>
          <li>Scheduled tasks appear in the Tasks view</li>
        </ul>
      </div>
    </div>
  );
}
