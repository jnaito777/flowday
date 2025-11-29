export interface Task {
  id: string;
  title: string;
  estimatedMinutes: number;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  completed: boolean;
  completedAt?: Date;
}

// Database representation of a task row from Supabase
export interface DBTask {
  id: string;
  user_id: string;
  title: string;
  estimated_minutes: number | null;
  scheduled_start: string | null;
  scheduled_end: string | null;
  completed: boolean;
  completed_at: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TimeBlock {
  id: string;
  taskId: string;
  start: Date;
  end: Date;
}

export interface DaySummary {
  date: Date;
  totalTasks: number;
  completedTasks: number;
  totalEstimatedMinutes: number;
  actualMinutes: number;
  tasks: Task[];
  incompleteTasks?: Task[];
}
