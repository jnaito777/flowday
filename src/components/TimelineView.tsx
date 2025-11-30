import type { Task } from '../types';
import { Clock } from 'lucide-react';

interface TimelineViewProps {
  tasks: Task[];
  date: string;
}

export function TimelineView({ tasks, date }: TimelineViewProps) {
  // Filter and sort tasks for the day
  const dayTasks = tasks
    .filter(task => task.date === date && task.startTime)
    .sort((a, b) => (a.startTime || '').localeCompare(b.startTime || ''));

  // Generate hourly slots from 6 AM to 10 PM
  const hours = Array.from({ length: 17 }, (_, i) => i + 6);

  const getTaskPosition = (task: Task) => {
    if (!task.startTime) return null;
    
    const [hours, minutes] = task.startTime.split(':').map(Number);
    const startMinutes = (hours - 6) * 60 + minutes;
    const top = (startMinutes / 60) * 80; // 80px per hour
    
    let height = 80; // Default 1 hour
    if (task.duration) {
      height = (task.duration / 60) * 80;
    } else if (task.endTime) {
      const [endHours, endMinutes] = task.endTime.split(':').map(Number);
      const endTotalMinutes = endHours * 60 + endMinutes;
      const startTotalMinutes = hours * 60 + minutes;
      const durationMinutes = endTotalMinutes - startTotalMinutes;
      height = (durationMinutes / 60) * 80;
    }
    
    return { top, height };
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-gray-900 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Timeline View
        </h3>
      </div>
      
      <div className="p-6">
        <div className="relative">
          {/* Hour labels and grid */}
          {hours.map((hour) => (
            <div key={hour} className="relative" style={{ height: '80px' }}>
              <div className="absolute left-0 top-0 text-gray-600 w-16">
                {`${hour % 12 || 12}:00 ${hour < 12 ? 'AM' : 'PM'}`}
              </div>
              <div className="absolute left-20 right-0 top-0 border-t border-gray-200"></div>
            </div>
          ))}
          
          {/* Tasks overlay */}
          <div className="absolute left-20 right-0 top-0" style={{ height: `${hours.length * 80}px` }}>
            {dayTasks.map(task => {
              const position = getTaskPosition(task);
              if (!position) return null;
              
              return (
                <div
                  key={task.id}
                  className={`absolute left-0 right-0 mx-2 p-3 rounded-lg border-l-4 ${
                    task.completed 
                      ? 'bg-gray-100 border-gray-400 opacity-60' 
                      : task.type === 'work'
                      ? 'bg-blue-50 border-blue-500'
                      : 'bg-purple-50 border-purple-500'
                  }`}
                  style={{
                    top: `${position.top}px`,
                    height: `${position.height}px`,
                    minHeight: '40px',
                  }}
                >
                  <div className="h-full flex flex-col justify-between">
                    <div>
                      <h4 className={`text-gray-900 ${task.completed ? 'line-through' : ''}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className="text-gray-600 line-clamp-2">{task.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 mt-1">
                      <span className={`px-2 py-0.5 rounded text-white ${
                        task.type === 'work' ? 'bg-blue-500' : 'bg-purple-500'
                      }`}>
                        {task.type}
                      </span>
                      {task.duration && (
                        <span>{task.duration} min</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
