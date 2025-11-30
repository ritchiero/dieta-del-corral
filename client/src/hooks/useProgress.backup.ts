import { useState, useEffect } from 'react';

interface DayProgress {
  date: string;
  completedTasks: string[]; // IDs de tareas completadas
  isDayComplete: boolean;
}

interface GlobalProgress {
  startDate: string | null;
  completedDays: number;
  totalDays: number;
  history: DayProgress[];
}

const STORAGE_KEY = 'manus_corral_progress';

export function useProgress() {
  const [progress, setProgress] = useState<GlobalProgress>({
    startDate: null,
    completedDays: 0,
    totalDays: 22,
    history: []
  });

  // Cargar progreso al iniciar
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  // Guardar progreso al cambiar
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const startChallenge = () => {
    setProgress({
      startDate: new Date().toISOString(),
      completedDays: 0,
      totalDays: 22,
      history: []
    });
  };

  const markTask = (taskId: string, isCompleted: boolean) => {
    const today = new Date().toDateString();
    
    setProgress(prev => {
      const history = [...prev.history];
      let dayEntry = history.find(d => d.date === today);

      if (!dayEntry) {
        dayEntry = { date: today, completedTasks: [], isDayComplete: false };
        history.push(dayEntry);
      }

      if (isCompleted) {
        if (!dayEntry.completedTasks.includes(taskId)) {
          dayEntry.completedTasks.push(taskId);
        }
      } else {
        dayEntry.completedTasks = dayEntry.completedTasks.filter(id => id !== taskId);
      }

      return { ...prev, history };
    });
  };

  const completeDay = () => {
    const today = new Date().toDateString();
    setProgress(prev => {
      const history = [...prev.history];
      const dayEntry = history.find(d => d.date === today);
      
      if (dayEntry && !dayEntry.isDayComplete) {
        dayEntry.isDayComplete = true;
        return {
          ...prev,
          completedDays: prev.completedDays + 1,
          history
        };
      }
      return prev;
    });
  };

  const getDailyCompletion = (totalTasksOfDay: number) => {
    const today = new Date().toDateString();
    const dayEntry = progress.history.find(d => d.date === today);
    const completedCount = dayEntry ? dayEntry.completedTasks.length : 0;
    
    return totalTasksOfDay > 0 ? (completedCount / totalTasksOfDay) * 100 : 0;
  };

  return {
    progress,
    startChallenge,
    markTask,
    completeDay,
    getDailyCompletion
  };
}
