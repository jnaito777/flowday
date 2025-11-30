import { useState, useCallback, useEffect } from 'react';
import type { Task, DBTask } from '../types';
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

      // Convert database format to Task format (keep ISO strings)
      const formattedTasks: Task[] = (data || []).map((task: DBTask) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        estimatedMinutes: task.estimated_minutes ?? 0,
        scheduledStart: task.scheduled_start ?? undefined,
        scheduledEnd: task.scheduled_end ?? undefined,
        completed: task.completed,
        completedAt: task.completed_at ?? undefined,
        createdAt: task.created_at ?? undefined,
        date: task.scheduled_start ? task.scheduled_start.split('T')[0] : (task.created_at ? task.created_at.split('T')[0] : new Date().toISOString().split('T')[0]),
      }));

      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = useCallback(
    async (title: string, estimatedMinutes: number, category?: string, description?: string) => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('tasks')
          .insert({
            user_id: user.id,
            title,
            description: description || null,
            category: category || null,
            estimated_minutes: estimatedMinutes,
            completed: false,
          })
          .select()
          .single();

        if (error) throw error;

          const newTask: Task = {
          id: (data as DBTask).id,
          title: (data as DBTask).title,
          description: (data as DBTask).description,
          category: (data as DBTask).category,
          estimatedMinutes: (data as DBTask).estimated_minutes ?? 0,
            completed: false,
            date: new Date().toISOString().split('T')[0],
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
        const dbUpdates: Record<string, unknown> = {};
        if (updates.title !== undefined) dbUpdates.title = updates.title;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.category !== undefined) dbUpdates.category = updates.category;
        if (updates.estimatedMinutes !== undefined)
          dbUpdates.estimated_minutes = updates.estimatedMinutes;
        if (updates.completed !== undefined) dbUpdates.completed = updates.completed;
        if (updates.scheduledStart !== undefined) {
          if (typeof updates.scheduledStart === 'string') dbUpdates.scheduled_start = updates.scheduledStart;
          else dbUpdates.scheduled_start = (updates.scheduledStart as any)?.toISOString?.();
        }
        if (updates.scheduledEnd !== undefined) {
          if (typeof updates.scheduledEnd === 'string') dbUpdates.scheduled_end = updates.scheduledEnd;
          else dbUpdates.scheduled_end = (updates.scheduledEnd as any)?.toISOString?.();
        }
        if (updates.completedAt !== undefined) {
          if (typeof updates.completedAt === 'string') dbUpdates.completed_at = updates.completedAt;
          else dbUpdates.completed_at = (updates.completedAt as any)?.toISOString?.();
        }

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
      if (!user) return;

      try {
        await updateTask(id, { completed: true, completedAt: new Date().toISOString() });

        // Record an analytic event for completion
        const { error: eventError } = await supabase.from('task_events').insert({
          user_id: user.id,
          task_id: id,
          event_type: 'completed',
          event_at: new Date().toISOString(),
        });

        if (eventError) console.warn('Error recording task event:', eventError);
      } catch (err) {
        console.error('Error completing task:', err);
        throw err;
      }
    },
    [updateTask, user]
  );

  const scheduleTask = useCallback(
    async (id: string, start: Date, end: Date) => {
      await updateTask(id, { scheduledStart: start.toISOString(), scheduledEnd: end.toISOString() });
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
