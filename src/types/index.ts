export interface Task {
  id: string;
  title: string;
  description?: string;
  type: 'work' | 'personal';
  date: string;
  startTime?: string;
  endTime?: string;
  duration?: number; // Duration in minutes
  completed: boolean;
  createdAt: string;
  completedAt?: string;
  inProgress?: boolean;
  timerStartedAt?: string;
  timeSpent?: number; // Time spent in minutes
}

export interface UserProfile {
  name: string;
  email: string;
  workHoursStart: string;
  workHoursEnd: string;
  calendarSyncEnabled: boolean;
  lastSyncDate?: string;
}