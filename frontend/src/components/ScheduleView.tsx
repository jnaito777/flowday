import { Card } from "@/components/ui/card";
import { Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  isPaused: boolean;
  timeSpent: number;
}

interface ScheduleViewProps {
  tasks: Task[];
}

export const ScheduleView = ({ tasks }: ScheduleViewProps) => {
  const getCurrentTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  };

  const formatDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-card-foreground">Today's Schedule</h2>
          </div>
          <p className="text-sm text-muted-foreground">{formatDate()}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
          <Clock className="h-4 w-4 text-primary" />
          <span className="font-mono font-semibold text-primary">{getCurrentTime()}</span>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No tasks scheduled yet. Add your first task to get started!</p>
          </div>
        ) : (
          tasks.map((task, index) => (
            <div
              key={task.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-lg border transition-smooth",
                task.completed 
                  ? "bg-success/5 border-success/20" 
                  : task.isPaused
                  ? "bg-muted/50 border-border"
                  : "bg-card border-primary/20 hover:shadow-soft"
              )}
            >
              <div className={cn(
                "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm",
                task.completed
                  ? "bg-success text-success-foreground"
                  : "bg-primary/10 text-primary"
              )}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <h4 className={cn(
                  "font-medium",
                  task.completed && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {task.duration} minutes
                  {task.isPaused && " • Paused"}
                </p>
              </div>

              <div className="text-right">
                <div className={cn(
                  "text-xs font-medium px-2 py-1 rounded",
                  task.completed
                    ? "bg-success/20 text-success"
                    : task.isPaused
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary/10 text-primary"
                )}>
                  {task.completed 
                    ? "Done" 
                    : task.isPaused 
                    ? "On Hold" 
                    : "Scheduled"}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};
