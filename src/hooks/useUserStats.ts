import { useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

function inRange(dateStr?: string | null, from?: Date, to?: Date) {
  if (!dateStr || !from || !to) return false;
  const d = new Date(dateStr);
  return d.getTime() >= from.getTime() && d.getTime() < to.getTime();
}

export type UsageStats = {
  total: number;
  completed: number;
  rate: number; // percentage 0-100
};

export function useUserStats() {
  const { user } = useAuth();

  const fetchStatsForRange = useCallback(
    async (from: Date, to: Date): Promise<UsageStats | null> => {
      if (!user) return null;

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching tasks for stats:', error);
        return null;
      }

      const tasks = data || [];

      // Total: tasks that were created or scheduled in the range
      const total = tasks.filter((t: any) => {
        return (
          inRange(t.created_at, from, to) ||
          inRange(t.scheduled_start, from, to)
        );
      }).length;

      // Completed: tasks with completed_at in the range
      const completed = tasks.filter((t: any) => {
        return t.completed && inRange(t.completed_at, from, to);
      }).length;

      const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

      return { total, completed, rate };
    },
    [user]
  );

  const getDaily = useCallback(
    async (date: Date) => {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      return fetchStatsForRange(start, end);
    },
    [fetchStatsForRange]
  );

  const getMonthly = useCallback(
    async (year: number, month: number) => {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month - 1 + 1, 1);
      return fetchStatsForRange(start, end);
    },
    [fetchStatsForRange]
  );

  const getYearly = useCallback(
    async (year: number) => {
      const start = new Date(year, 0, 1);
      const end = new Date(year + 1, 0, 1);
      return fetchStatsForRange(start, end);
    },
    [fetchStatsForRange]
  );

  return { getDaily, getMonthly, getYearly };
}

export default useUserStats;
