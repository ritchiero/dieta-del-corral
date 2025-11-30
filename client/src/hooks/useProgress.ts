import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface DayProgressData {
  id: string;
  user_id: string;
  day: number;
  completed: boolean;
  completed_at: string | null;
  tasks: Task[];
  created_at: string;
  updated_at: string;
}

interface GlobalProgress {
  startDate: string | null;
  completedDays: number;
  totalDays: number;
  history: DayProgressData[];
}

export function useProgress() {
  const { user } = useAuthContext();
  const [progress, setProgress] = useState<GlobalProgress>({
    startDate: null,
    completedDays: 0,
    totalDays: 22,
    history: []
  });
  const [loading, setLoading] = useState(true);

  // Load progress from Supabase
  useEffect(() => {
    if (!user) {
      setProgress({
        startDate: null,
        completedDays: 0,
        totalDays: 22,
        history: []
      });
      setLoading(false);
      return;
    }

    loadProgress();
  }, [user]);

  const loadProgress = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('day_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('day', { ascending: true });

      if (error) throw error;

      const history = data || [];
      const completedDays = history.filter((d) => d.completed).length;
      const startDate = history.length > 0 ? history[0].created_at : null;

      setProgress({
        startDate,
        completedDays,
        totalDays: 22,
        history,
      });
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const startChallenge = async () => {
    if (!user) return;

    const newProgress = {
      startDate: new Date().toISOString(),
      completedDays: 0,
      totalDays: 22,
      history: []
    };

    setProgress(newProgress);
  };

  const markTask = async (day: number, taskId: string, isCompleted: boolean) => {
    if (!user) return;

    try {
      // Get current day progress
      const dayProgress = progress.history.find((d) => d.day === day);
      
      let tasks: Task[] = dayProgress?.tasks || [];
      
      if (isCompleted) {
        // Add task if not already completed
        if (!tasks.find(t => t.id === taskId)) {
          tasks.push({ id: taskId, title: '', completed: true });
        }
      } else {
        // Remove task
        tasks = tasks.filter(t => t.id !== taskId);
      }

      // Save to Supabase
      if (dayProgress) {
        // Update existing record
        const { error } = await supabase
          .from('day_progress')
          .update({ tasks })
          .eq('user_id', user.id)
          .eq('day', day);
        
        if (error) throw error;
      } else {
        // Insert new record
        const { error } = await supabase
          .from('day_progress')
          .insert({
            user_id: user.id,
            day,
            tasks,
            completed: false,
          });
        
        if (error) throw error;
      }

      // Reload progress
      await loadProgress();
    } catch (error) {
      console.error('Error marking task:', error);
    }
  };

  const completeDay = async (day: number) => {
    if (!user) return;

    try {
      const dayProgress = progress.history.find((d) => d.day === day);
      
      if (dayProgress && !dayProgress.completed) {
        const { error } = await supabase
          .from('day_progress')
          .update({
            completed: true,
            completed_at: new Date().toISOString(),
          })
          .eq('user_id', user.id)
          .eq('day', day);

        if (error) throw error;

        // Reload progress
        await loadProgress();
      }
    } catch (error) {
      console.error('Error completing day:', error);
    }
  };

  const getDailyCompletion = (day: number, totalTasksOfDay: number) => {
    const dayProgress = progress.history.find((d) => d.day === day);
    const completedCount = dayProgress ? dayProgress.tasks.filter(t => t.completed).length : 0;
    
    return totalTasksOfDay > 0 ? (completedCount / totalTasksOfDay) * 100 : 0;
  };

  const getDayProgress = (day: number): DayProgressData | undefined => {
    return progress.history.find((p) => p.day === day);
  };

  return {
    progress,
    loading,
    startChallenge,
    markTask,
    completeDay,
    getDailyCompletion,
    getDayProgress,
    refreshProgress: loadProgress,
  };
}
