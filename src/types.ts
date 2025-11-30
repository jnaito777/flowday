export interface Task {
  id: string;
  title: string;
  description?: string;
  category?: string;
  estimatedMinutes?: number;
  // Scheduling/time fields (some components use string timestamps)
  date?: string; // YYYY-MM-DD
  type?: "work" | "personal";
  duration?: number; // in minutes
  startTime?: string; // HH:MM
  endTime?: string; // HH:MM
  inProgress?: boolean;
  timerStartedAt?: string | Date;
  timeSpent?: number; // minutes
  createdAt?: string | Date;
  completed: boolean;
  completedAt?: string | Date;
}

// Database representation of a task row from Supabase
export interface DBTask {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  category?: string;
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

export interface UserProfile {
  name: string;
  email: string;
  workHoursStart: string; // HH:MM
  workHoursEnd: string; // HH:MM
  calendarSyncEnabled: boolean;
  lastSyncDate?: string | null;
}
