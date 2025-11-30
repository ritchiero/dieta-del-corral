import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

const STORAGE_KEY = 'dieta-del-corral-progress';

// Helpers para localStorage
const getLocalProgress = (): GlobalProgress | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setLocalProgress = (progress: GlobalProgress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
};

export function useProgress() {
  const { user } = useAuthContext();
  const [progress, setProgress] = useState<GlobalProgress>({
    startDate: null,
    completedDays: 0,
    totalDays: 22,
    history: []
  });
  const [loading, setLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Load progress - intenta Supabase, fallback a localStorage
  const loadProgress = useCallback(async () => {
    setLoading(true);
    
    // Si no hay usuario, intentar cargar de localStorage
    if (!user) {
      const localProgress = getLocalProgress();
      if (localProgress) {
        setProgress(localProgress);
        setUseLocalStorage(true);
      }
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('day_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('day', { ascending: true });

      if (error) throw error;

      const history = data || [];
      const completedDays = history.filter((d) => d.completed).length;
      const startDate = history.length > 0 ? history[0].created_at : null;

      const newProgress = {
        startDate,
        completedDays,
        totalDays: 22,
        history,
      };
      
      setProgress(newProgress);
      setUseLocalStorage(false);
    } catch (error) {
      console.warn('Supabase no disponible, usando localStorage:', error);
      // Fallback a localStorage
      const localProgress = getLocalProgress();
      if (localProgress) {
        setProgress(localProgress);
      }
      setUseLocalStorage(true);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const startChallenge = async () => {
    const startDate = new Date().toISOString();
    
    const newProgress: GlobalProgress = {
      startDate,
      completedDays: 0,
      totalDays: 22,
      history: []
    };

    // Intentar guardar en Supabase si hay usuario
    if (user && !useLocalStorage) {
      try {
        const { error } = await supabase
          .from('day_progress')
          .insert({
            user_id: user.id,
            day: 1,
            tasks: [],
            completed: false,
          });

        if (error) throw error;

        setProgress(newProgress);
        await loadProgress();
        toast.success('¡Reto iniciado!', {
          description: '22 días de disciplina comienzan ahora.',
        });
        return;
      } catch (error) {
        console.warn('Error en Supabase, guardando localmente:', error);
      }
    }

    // Fallback: guardar en localStorage con el día 1 inicializado
    const progressWithDay1: GlobalProgress = {
      ...newProgress,
      history: [{
        id: 'local-1',
        user_id: 'local',
        day: 1,
        completed: false,
        completed_at: null,
        tasks: [],
        created_at: startDate,
        updated_at: startDate,
      }]
    };
    setProgress(progressWithDay1);
    setLocalProgress(progressWithDay1);
    setUseLocalStorage(true);
    toast.success('¡Reto iniciado!', {
      description: '22 días de disciplina comienzan ahora.',
    });
  };

  const markTask = async (day: number, taskId: string, isCompleted: boolean) => {
    // Si usamos localStorage - usar función de actualización para estado más reciente
    if (useLocalStorage || !user) {
      setProgress(currentProgress => {
        const dayProgress = currentProgress.history.find((d) => d.day === day);
        let tasks: Task[] = dayProgress?.tasks ? [...dayProgress.tasks] : [];
        
        if (isCompleted) {
          if (!tasks.find(t => t.id === taskId)) {
            tasks.push({ id: taskId, title: '', completed: true });
          }
        } else {
          tasks = tasks.filter(t => t.id !== taskId);
        }

        const updatedHistory = [...currentProgress.history];
        const existingIndex = updatedHistory.findIndex(d => d.day === day);
        
        if (existingIndex >= 0) {
          updatedHistory[existingIndex] = { ...updatedHistory[existingIndex], tasks };
        } else {
          updatedHistory.push({
            id: `local-${day}`,
            user_id: 'local',
            day,
            completed: false,
            completed_at: null,
            tasks,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }

        const newProgress = { ...currentProgress, history: updatedHistory };
        setLocalProgress(newProgress);
        return newProgress;
      });
      return;
    }

    // Supabase
    const dayProgress = progress.history.find((d) => d.day === day);
    let tasks: Task[] = dayProgress?.tasks || [];

    // Intentar Supabase
    try {
      if (dayProgress) {
        const { error } = await supabase
          .from('day_progress')
          .update({ tasks })
          .eq('user_id', user.id)
          .eq('day', day);
        
        if (error) throw error;
      } else {
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

      await loadProgress();
    } catch (error) {
      console.error('Error marking task:', error);
      toast.error('Error al guardar', {
        description: 'No se pudo guardar el progreso.',
      });
    }
  };

  const completeDay = async (day: number) => {
    // Si usamos localStorage
    if (useLocalStorage || !user) {
      const updatedHistory = progress.history.map(d => 
        d.day === day 
          ? { ...d, completed: true, completed_at: new Date().toISOString() }
          : d
      );
      const completedDays = updatedHistory.filter(d => d.completed).length;
      
      const newProgress = { ...progress, history: updatedHistory, completedDays };
      setProgress(newProgress);
      setLocalProgress(newProgress);
      
      toast.success(`¡Día ${day} completado!`, {
        description: `${22 - completedDays} días restantes.`,
      });
      return;
    }

    // Supabase
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

        await loadProgress();
        toast.success(`¡Día ${day} completado!`);
      }
    } catch (error) {
      console.error('Error completing day:', error);
      toast.error('Error al completar el día');
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
