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
      task.completed && "bg-gray-100 opacity-75"
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-semibold",
              task.completed 
                ? "line-through text-gray-500" 
                : "text-black"
            )}>
              {task.title}
            </h3>
            {task.isPaused && (
              <Badge variant="outline" className="text-xs">
                Paused
              </Badge>
            )}
          </div>
          
          <div className={cn(
            "flex items-center gap-2 text-sm",
            task.completed ? "text-gray-500" : "text-black"
          )}>
            <Clock className={cn(
              "h-4 w-4",
              task.completed ? "text-gray-500" : "text-black"
            )} />
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
                <Play className="h-4 w-4 text-black" />
              ) : (
                <Pause className="h-4 w-4 text-black" />
              )}
            </Button>
          )}
          
          <Button
            size="icon"
            variant={task.completed ? "secondary" : "default"}
            onClick={() => onComplete(task.id)}
            className={cn(
              "h-9 w-9",
              task.completed && "bg-gray-300 hover:bg-gray-400"
            )}
          >
            <Check className={cn(
              "h-4 w-4",
              task.completed ? "text-gray-600" : "text-white"
            )} />
          </Button>
        </div>
      </div>
    </Card>
  );
};
