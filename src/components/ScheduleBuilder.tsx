import { useMemo } from 'react';
import { Task } from '../types';
import { format, addMinutes, setHours, setMinutes, startOfDay } from 'date-fns';
import './ScheduleBuilder.css';

interface ScheduleBuilderProps {
  tasks: Task[];
  onScheduleTask: (taskId: string, start: Date, end: Date) => void;
  onUnscheduleTask: (taskId: string) => void;
  onMoveTask: (taskId: string, newStart: Date) => void;
}

const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;
const HOUR_HEIGHT = 60; // pixels per hour

export default function ScheduleBuilder({
  tasks,
  onScheduleTask,
  onUnscheduleTask,
  onMoveTask,
}: ScheduleBuilderProps) {
  const today = useMemo(() => startOfDay(new Date()), []);
  const hours = useMemo(() => {
    const hours = [];
    for (let h = WORK_START_HOUR; h < WORK_END_HOUR; h++) {
      hours.push(h);
    }
    return hours;
  }, []);

  const scheduledTasks = useMemo(
    () => tasks.filter((t) => t.scheduledStart && !t.completed),
    [tasks]
  );

  const unscheduledTasks = useMemo(
    () => tasks.filter((t) => !t.scheduledStart && !t.completed),
    [tasks]
  );

  const handleDrop = (e: React.DragEvent, hour: number, minuteSlot: number) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      const start = setMinutes(setHours(today, hour), minuteSlot);
      const end = addMinutes(start, task.estimatedMinutes);
      onScheduleTask(taskId, start, end);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const getTaskPosition = (task: Task) => {
    if (!task.scheduledStart || !task.scheduledEnd) return null;
    const start = new Date(task.scheduledStart);
    const end = new Date(task.scheduledEnd);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const endMinutes = end.getHours() * 60 + end.getMinutes();
    const workStartMinutes = WORK_START_HOUR * 60;
    const top = ((startMinutes - workStartMinutes) / 60) * HOUR_HEIGHT;
    const height = ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT;
    return { top, height };
  };

  return (
    <div className="schedule-builder">
      <div className="schedule-header">
        <h2>Today's Schedule</h2>
        <div className="date-display">{format(today, 'EEEE, MMMM d, yyyy')}</div>
      </div>

      <div className="schedule-content">
        <div className="time-column">
          {hours.map((hour) => (
            <div key={hour} className="time-slot" style={{ height: HOUR_HEIGHT }}>
              {format(setHours(today, hour), 'h:mm a')}
            </div>
          ))}
        </div>

        <div className="schedule-grid">
          {hours.map((hour) => (
            <div
              key={hour}
              className="hour-block"
              style={{ height: HOUR_HEIGHT }}
              onDrop={(e) => handleDrop(e, hour, 0)}
              onDragOver={handleDragOver}
            >
              {scheduledTasks.map((task) => {
                const pos = getTaskPosition(task);
                if (!pos) return null;
                const taskStart = new Date(task.scheduledStart!);
                if (taskStart.getHours() === hour) {
                  return (
                    <TaskBlock
                      key={task.id}
                      task={task}
                      position={pos}
                      onMove={onMoveTask}
                      onUnschedule={onUnscheduleTask}
                    />
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </div>

      {unscheduledTasks.length > 0 && (
        <div className="unscheduled-tasks">
          <h3>Drag tasks to schedule</h3>
          <div className="draggable-tasks">
            {unscheduledTasks.map((task) => (
              <DraggableTask key={task.id} task={task} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TaskBlock({
  task,
  position,
  onMove,
  onUnschedule,
}: {
  task: Task;
  position: { top: number; height: number };
  onMove: (taskId: string, newStart: Date) => void;
  onUnschedule: (taskId: string) => void;
}) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="task-block"
      style={{
        top: `${position.top}px`,
        height: `${position.height}px`,
      }}
      draggable
      onDragStart={handleDragStart}
    >
      <div className="task-block-content">
        <div className="task-block-title">{task.title}</div>
        <div className="task-block-time">
          {new Date(task.scheduledStart!).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}{' '}
          -{' '}
          {new Date(task.scheduledEnd!).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
      <button
        className="task-block-remove"
        onClick={() => onUnschedule(task.id)}
        aria-label="Remove from schedule"
      >
        ×
      </button>
    </div>
  );
}

function DraggableTask({ task }: { task: Task }) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className="draggable-task"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="draggable-task-title">{task.title}</div>
      <div className="draggable-task-time">{task.estimatedMinutes} min</div>
    </div>
  );
}


