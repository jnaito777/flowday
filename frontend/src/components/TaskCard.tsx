import { Check, Clock, Pause, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  isPaused: boolean;
  timeSpent: number;
}

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  onTogglePause: (id: string) => void;
}

export const TaskCard = ({ task, onComplete, onTogglePause }: TaskCardProps) => {
  const progress = (task.timeSpent / task.duration) * 100;
  
  return (
    <Card className={cn(
      "p-4 transition-smooth hover:shadow-soft",
      task.completed && "opacity-60"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-semibold text-card-foreground",
              task.completed && "line-through text-muted-foreground"
            )}>
              {task.title}
            </h3>
            {task.isPaused && (
              <Badge variant="outline" className="text-xs">
                Paused
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{task.timeSpent} / {task.duration} min</span>
          </div>

          {!task.completed && (
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="h-full gradient-primary transition-smooth"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {!task.completed && (
            <Button
              size="icon"
              variant="outline"
              onClick={() => onTogglePause(task.id)}
              className="h-9 w-9"
            >
              {task.isPaused ? (
                <Play className="h-4 w-4" />
              ) : (
                <Pause className="h-4 w-4" />
              )}
            </Button>
          )}
          
          <Button
            size="icon"
            variant={task.completed ? "secondary" : "default"}
            onClick={() => onComplete(task.id)}
            className={cn(
              "h-9 w-9",
              task.completed && "bg-success hover:bg-success/90"
            )}
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
