import type { Task } from '../types';
import { addHours, startOfDay, setHours } from 'date-fns';
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
  type DroppableProvided,
  type DroppableStateSnapshot,
  type DraggableProvided,
} from 'react-beautiful-dnd';
import './ScheduleBuilder.css';

interface ScheduleBuilderProps {
  tasks: Task[];
  onTaskSchedule: (taskId: string, startTime: Date, endTime: Date) => void;
  onTaskUnschedule?: (taskId: string) => void;
}

const HOURS = Array.from({ length: 8 }, (_, i) => 9 + i); // 9..16 (9AM-4PM inclusive) visually up to 5PM

export default function ScheduleBuilder({ tasks, onTaskSchedule, onTaskUnschedule }: ScheduleBuilderProps) {
  const unscheduledTasks = tasks.filter((t) => !t.scheduledStart && !t.completed);

  // Map scheduled tasks by hour for rendering
  const scheduledByHour: Record<number, Task[]> = {};
  for (const hour of HOURS) scheduledByHour[hour] = [];
  tasks.forEach((t) => {
    if (t.scheduledStart) {
      const h = new Date(t.scheduledStart).getHours();
      if (h >= 9 && h < 17) {
        if (!scheduledByHour[h]) scheduledByHour[h] = [];
        scheduledByHour[h].push(t);
      }
    }
  });

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    // If dropped into an hour lane, compute start/end and schedule
    if (destination.droppableId.startsWith('hour-')) {
      const hour = parseInt(destination.droppableId.replace('hour-', ''), 10);
      const task = tasks.find((t) => t.id === draggableId);
      if (!task) return;

      const today = startOfDay(new Date());
      const startTime = setHours(today, hour);
      const estimatedHours = Math.max(1, Math.ceil((task.estimatedMinutes || 0) / 60));
      const endTime = addHours(startTime, estimatedHours);

      onTaskSchedule(task.id, startTime, endTime);
    }
    // If dropped back to unscheduled list, call unschedule if provided
    if (destination.droppableId === 'unscheduled') {
      const task = tasks.find((t) => t.id === draggableId);
      if (!task) return;
      if (onTaskUnschedule) onTaskUnschedule(task.id);
    }
  };

  const formatLabel = (hour: number) => (hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="schedule-builder">
        <div className="schedule-container">
          <div className="schedule-timeline">
            <h2>Today's Schedule</h2>
            <div className="time-grid">
              {HOURS.map((hour) => (
                <Droppable droppableId={`hour-${hour}`} key={hour}>
                  {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`time-block ${snapshot.isDraggingOver ? 'drag-over' : ''}`}
                    >
                      <div className="time-label">{formatLabel(hour)}</div>
                      <div className="task-slot">
                        {(scheduledByHour[hour] || []).map((task, idx) => {
                          const span = Math.max(1, Math.ceil((task.estimatedMinutes || 0) / 60));
                          // approximate width across columns (span columns visually)
                          const widthPercent = `calc(${span * 100}% + ${ (span - 1) * 12 }px)`;
                          return (
                            <Draggable draggableId={task.id} index={idx} key={task.id}>
                              {(dragProvided: DraggableProvided) => (
                                <div
                                  ref={dragProvided.innerRef}
                                  {...dragProvided.draggableProps}
                                  {...dragProvided.dragHandleProps}
                                  className="scheduled-task"
                                  style={{ width: widthPercent, display: 'inline-block' }}
                                >
                                  <strong>{task.title}</strong>
                                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                    <div className="task-duration">{task.estimatedMinutes} min</div>
                                    {span > 1 && <div className="multi-hour">{span}h</div>}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}

                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              ))}
            </div>
          </div>

          <div className="unscheduled-panel">
            <h3>Unscheduled Tasks ({unscheduledTasks.length})</h3>
            <Droppable droppableId="unscheduled">
              {(provided: DroppableProvided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="unscheduled-list">
                  {unscheduledTasks.length === 0 ? (
                    <p className="empty-state">All tasks are scheduled or completed!</p>
                  ) : (
                    unscheduledTasks.map((task, idx) => (
                      <Draggable draggableId={task.id} index={idx} key={task.id}>
                        {(dragProvided: DraggableProvided) => (
                          <div
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            className="draggable-task"
                          >
                            <div className="task-name">{task.title}</div>
                            <div className="task-time">{task.estimatedMinutes} min</div>
                          </div>
                        )}
                      </Draggable>
                    ))
                  )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>

        <div className="schedule-info">
          <h3>Instructions</h3>
          <ul>
            <li>Drag tasks from the unscheduled list to a time block (9AM–5PM)</li>
            <li>Tasks will use their estimated time to set duration</li>
            <li>Drag between time blocks to reschedule</li>
          </ul>
        </div>
      </div>
    </DragDropContext>
  );
}
