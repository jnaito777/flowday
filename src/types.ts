export interface Task {
  id: string;
  title: string;
  estimatedMinutes: number;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  completed: boolean;
  completedAt?: Date;
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
}

