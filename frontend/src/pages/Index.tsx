import { useState } from "react";
import { TaskCard } from "@/components/TaskCard";
import { ProgressTracker } from "@/components/ProgressTracker";
import { AddTaskDialog } from "@/components/AddTaskDialog";
import { ScheduleView } from "@/components/ScheduleView";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Task {
  id: string;
  title: string;
  duration: number;
  completed: boolean;
  isPaused: boolean;
  timeSpent: number;
}

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Review project documentation",
      duration: 45,
      completed: false,
      isPaused: false,
      timeSpent: 15,
    },
    {
      id: "2",
      title: "Team standup meeting",
      duration: 15,
      completed: true,
      isPaused: false,
      timeSpent: 15,
    },
  ]);

  const handleAddTask = (title: string, duration: number) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title,
      duration,
      completed: false,
      isPaused: false,
      timeSpent: 0,
    };
    setTasks([...tasks, newTask]);
    toast.success("Task added successfully!");
  };

  const handleCompleteTask = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;
        toast.success(newCompleted ? "Task completed! 🎉" : "Task marked as incomplete");
        return { 
          ...task, 
          completed: newCompleted,
          timeSpent: newCompleted ? task.duration : task.timeSpent
        };
      }
      return task;
    }));
  };

  const handleTogglePause = (id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newPaused = !task.isPaused;
        toast.info(newPaused ? "Task paused - life happens! 🌟" : "Task resumed - let's go!");
        return { ...task, isPaused: newPaused };
      }
      return task;
    }));
  };

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTimeSpent = tasks.reduce((sum, task) => sum + task.timeSpent, 0);
  const totalTimeScheduled = tasks.reduce((sum, task) => sum + task.duration, 0);

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Flexible & Accountable</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            FlexFlow
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A productivity app that adapts to real life. Schedule your work, handle interruptions gracefully, 
            and stay accountable to your progress.
          </p>
        </header>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column - Tasks */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-card-foreground">Today's Tasks</h2>
              <AddTaskDialog onAddTask={handleAddTask} />
            </div>

            <div className="space-y-4">
              {tasks.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="mb-4">No tasks yet. Start by adding your first task!</p>
                </div>
              ) : (
                tasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onTogglePause={handleTogglePause}
                  />
                ))
              )}
            </div>
          </div>

          {/* Right Column - Progress & Schedule */}
          <div className="space-y-6">
            <ProgressTracker
              completedTasks={completedTasks}
              totalTasks={tasks.length}
              totalTimeSpent={totalTimeSpent}
              totalTimeScheduled={totalTimeScheduled}
            />
            
            <ScheduleView tasks={tasks} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
