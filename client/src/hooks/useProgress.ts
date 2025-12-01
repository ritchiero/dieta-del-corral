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
  const [progress, setProgress] = useState<GlobalProgress>(() => {
    // Inicializar desde localStorage si existe
    const local = getLocalProgress();
    return local || {
      startDate: null,
      completedDays: 0,
      totalDays: 22,
      history: []
    };
  });
  const [loading, setLoading] = useState(true);
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Iniciar reto automáticamente (usado internamente)
  const autoStartChallenge = useCallback(async (userId: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = today.toISOString();

    try {
      // Crear entrada en challenge_info
      await supabase
        .from('challenge_info')
        .upsert({ user_id: userId, start_date: startDate });

      // Crear día 1
      await supabase
        .from('day_progress')
        .upsert({ user_id: userId, day: 1, tasks: [], completed: false });

      return startDate;
    } catch (error) {
      console.warn('Error auto-iniciando reto:', error);
      return startDate; // Retornar fecha aunque falle Supabase
    }
  }, []);

  // Load progress - intenta Supabase, fallback a localStorage
  const loadProgress = useCallback(async () => {
    setLoading(true);
    
    // Si no hay usuario, usar localStorage
    if (!user) {
      const localProgress = getLocalProgress();
      if (localProgress && localProgress.startDate) {
        setProgress(localProgress);
        setUseLocalStorage(true);
      }
      setLoading(false);
      return;
    }

    try {
      // Cargar fecha de inicio desde challenge_info
      const { data: challengeData } = await supabase
        .from('challenge_info')
        .select('start_date')
        .eq('user_id', user.id)
        .single();

      let startDate = challengeData?.start_date;

      // Si no existe challenge_info, crear automáticamente (usuario nuevo)
      if (!startDate) {
        console.log('Usuario nuevo detectado, iniciando reto automáticamente...');
        startDate = await autoStartChallenge(user.id);
      }

      // Cargar progreso de días
      const { data: progressData, error } = await supabase
        .from('day_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('day', { ascending: true });

      if (error) throw error;

      const history = progressData || [];
      const completedDays = history.filter((d) => d.completed).length;

      const newProgress = {
        startDate,
        completedDays,
        totalDays: 22,
        history,
      };
      
      setProgress(newProgress);
      setLocalProgress(newProgress);
      setUseLocalStorage(false);
    } catch (error) {
      console.warn('Supabase no disponible, usando localStorage:', error);
      const localProgress = getLocalProgress();
      if (localProgress && localProgress.startDate) {
        setProgress(localProgress);
      } else {
        // Si no hay localStorage, iniciar con fecha de hoy
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const newProgress: GlobalProgress = {
          startDate: today.toISOString(),
          completedDays: 0,
          totalDays: 22,
          history: [{
            id: 'local-1',
            user_id: 'local',
            day: 1,
            completed: false,
            completed_at: null,
            tasks: [],
            created_at: today.toISOString(),
            updated_at: today.toISOString(),
          }]
        };
        setProgress(newProgress);
        setLocalProgress(newProgress);
      }
      setUseLocalStorage(true);
    } finally {
      setLoading(false);
    }
  }, [user, autoStartChallenge]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const startChallenge = async () => {
    // Usar medianoche de hoy como fecha de inicio
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startDate = today.toISOString();
    
    const newProgress: GlobalProgress = {
      startDate,
      completedDays: 0,
      totalDays: 22,
      history: []
    };

    // Intentar guardar en Supabase si hay usuario
    if (user && !useLocalStorage) {
      try {
        // Guardar fecha de inicio en challenge_info
        const { error: challengeError } = await supabase
          .from('challenge_info')
          .upsert({
            user_id: user.id,
            start_date: startDate,
          });

        if (challengeError) throw challengeError;

        // Crear registro del día 1
        const { error: dayError } = await supabase
          .from('day_progress')
          .insert({
            user_id: user.id,
            day: 1,
            tasks: [],
            completed: false,
          });

        if (dayError) throw dayError;

        await loadProgress();
        toast.success('¡Reto iniciado!', {
          description: '22 días de disciplina comienzan ahora.',
        });
        return;
      } catch (error) {
        console.warn('Error en Supabase, guardando localmente:', error);
      }
    }

    // Fallback: guardar en localStorage
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
    // Si usamos localStorage
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
    
    if (isCompleted) {
      if (!tasks.find(t => t.id === taskId)) {
        tasks = [...tasks, { id: taskId, title: '', completed: true }];
      }
    } else {
      tasks = tasks.filter(t => t.id !== taskId);
    }

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

  // Calcular día actual del reto
  const getCurrentChallengeDay = () => {
    if (!progress.startDate) return 1;
    const start = new Date(progress.startDate);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(diffDays, progress.totalDays));
  };

  return {
    progress,
    loading,
    startChallenge,
    markTask,
    completeDay,
    getDailyCompletion,
    getDayProgress,
    getCurrentChallengeDay,
    refreshProgress: loadProgress,
  };
}
