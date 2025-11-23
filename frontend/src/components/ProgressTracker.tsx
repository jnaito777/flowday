import { Card } from "@/components/ui/card";
import { Trophy, Target, TrendingUp } from "lucide-react";

interface ProgressTrackerProps {
  completedTasks: number;
  totalTasks: number;
  totalTimeSpent: number;
  totalTimeScheduled: number;
}

export const ProgressTracker = ({
  completedTasks,
  totalTasks,
  totalTimeSpent,
  totalTimeScheduled
}: ProgressTrackerProps) => {
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const timeProgress = totalTimeScheduled > 0 ? Math.round((totalTimeSpent / totalTimeScheduled) * 100) : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-secondary/30 border-primary/20">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-bold text-card-foreground">Today's Progress</h2>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <Target className="h-4 w-4" />
              Tasks Completed
            </span>
            <span className="font-semibold text-card-foreground">
              {completedTasks} / {totalTasks}
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-3 overflow-hidden">
            <div 
              className="h-full gradient-primary transition-smooth shadow-glow"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-right text-muted-foreground">{completionRate}% complete</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Time Investment
            </span>
            <span className="font-semibold text-card-foreground">
              {totalTimeSpent} / {totalTimeScheduled} min
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-3 overflow-hidden">
            <div 
              className="h-full gradient-accent transition-smooth"
              style={{ width: `${Math.min(timeProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-right text-muted-foreground">{timeProgress}% of scheduled time</p>
        </div>
      </div>
    </Card>
  );
};
