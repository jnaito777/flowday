import type { Task, UserProfile } from '../types';

const TASKS_KEY = 'taskflow_tasks';
const PROFILE_KEY = 'taskflow_profile';

export const storage = {
  getTasks: (): Task[] => {
    const data = localStorage.getItem(TASKS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveTasks: (tasks: Task[]) => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  },

  getProfile: (): UserProfile => {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : {
      name: 'User',
      email: 'user@example.com',
      workHoursStart: '09:00',
      workHoursEnd: '17:00',
      calendarSyncEnabled: false,
    };
  },

  saveProfile: (profile: UserProfile) => {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  },
};
