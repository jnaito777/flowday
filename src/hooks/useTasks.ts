import { useState, useCallback, useEffect } from 'react';
import { Task } from '../types';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from Supabase
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setLoading(false);
      return;
    }

    loadTasks();

    // Subscribe to real-time changes
    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          loadTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadTasks = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Convert database format to Task format
      const formattedTasks: Task[] = (data || []).map((task) => ({
        id: task.id,
        title: task.title,
        estimatedMinutes: task.estimated_minutes,
        scheduledStart: task.scheduled_start ? new Date(task.scheduled_start) : undefined,
        scheduledEnd: task.scheduled_end ? new Date(task.scheduled_end) : undefined,
        completed: task.completed,
        completedAt: task.completed_at ? new Date(task.completed_at) : undefined,
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = useCallback(
    async (title: string, estimatedMinutes: number) => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            user_id: user.id,
            title,
            estimated_minutes: estimatedMinutes,
            completed: false,
          })
          .select()
          .single();

        if (error) throw error;

        const newTask: Task = {
          id: data.id,
          title: data.title,
          estimatedMinutes: data.estimated_minutes,
          completed: false,
        };

        setTasks((prev) => [newTask, ...prev]);
        return newTask;
      } catch (error) {
        console.error('Error adding task:', error);
        throw error;
      }
    },
    [user]
  );

  const updateTask = useCallback(
    async (id: string, updates: Partial<Task>) => {
      if (!user) return;

      try {
        const dbUpdates: any = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.estimatedMinutes !== undefined)
          dbUpdates.estimated_minutes = updates.estimatedMinutes;
        if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
        if (updates.scheduledStart !== undefined)
          dbUpdates.scheduled_start = updates.scheduledStart?.toISOString();
        if (updates.scheduledEnd !== undefined)
          dbUpdates.scheduled_end = updates.scheduledEnd?.toISOString();
        if (updates.completedAt !== undefined)
          dbUpdates.completed_at = updates.completedAt?.toISOString();

        const { error } = await supabase
          .from('tasks')
          .update(dbUpdates)
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        setTasks((prev) =>
          prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
        );
      } catch (error) {
        console.error('Error updating task:', error);
        throw error;
      }
    },
    [user]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      if (!user) return;

      try {
        const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('id', id)
          .eq('user_id', user.id);

        if (error) throw error;

        setTasks((prev) => prev.filter((task) => task.id !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
        throw error;
      }
    },
    [user]
  );

  const completeTask = useCallback(
    async (id: string) => {
      await updateTask(id, { completed: true, completedAt: new Date() });
    },
    [updateTask]
  );

  const scheduleTask = useCallback(
    async (id: string, start: Date, end: Date) => {
      await updateTask(id, { scheduledStart: start, scheduledEnd: end });
    },
    [updateTask]
  );

  const unscheduleTask = useCallback(
    async (id: string) => {
      await updateTask(id, { scheduledStart: undefined, scheduledEnd: undefined });
    },
    [updateTask]
  );

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    completeTask,
    scheduleTask,
    unscheduleTask,
  };
}
