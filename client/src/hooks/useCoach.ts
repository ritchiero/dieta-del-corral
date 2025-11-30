import { useState, useEffect } from 'react';

interface DailyTask {
  id: string;
  label: string;
  time: string;
  completed: boolean;
  type: 'meal' | 'workout' | 'water' | 'sleep';
}

interface CoachState {
  greeting: string;
  message: string;
  dateString: string;
  currentBlock: 'morning' | 'afternoon' | 'evening' | 'night';
  tasks: DailyTask[];
}

export function useCoach() {
  const [state, setState] = useState<CoachState>({
    greeting: '',
    message: '',
    dateString: '',
    currentBlock: 'morning',
    tasks: []
  });

  useEffect(() => {
    const updateCoach = () => {
      const now = new Date();
      const hour = now.getHours();
      const day = now.getDay(); // 0 = Domingo, 1 = Lunes, etc.
      
      const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
      const dateString = now.toLocaleDateString('es-ES', options);
      const capitalizedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

      let block: CoachState['currentBlock'] = 'morning';
      let greeting = '';
      let message = '';
      let tasks: DailyTask[] = [];

      // Definir Rutinas Detalladas (Checklist de Batalla)
      let workoutTasks: DailyTask[] = [];

      // Nombre del entrenamiento del día para mostrar en recordatorios
      const workoutNames: Record<number, string> = {
        0: 'Descanso + Meal Prep',
        1: 'Pecho y Tríceps',
        2: 'Espalda y Bíceps',
        3: 'Cardio (Caminata 45 min)',
        4: 'Pierna',
        5: 'Hombro y Core',
        6: 'Cardio + Abdominales',
      };
      const todayWorkout = workoutNames[day];

      switch (day) {
        case 1: // Lunes (Pecho)
          workoutTasks = [
            { id: 'w1', label: 'Press de Pecho Máquina (4x8)', time: 'Rutina', completed: false, type: 'workout' },
            { id: 'w2', label: 'Press Inclinado Mancuernas (3x10)', time: 'Rutina', completed: false, type: 'workout' },
            { id: 'w3', label: 'Fondos (3x al fallo)', time: 'Rutina', completed: false, type: 'workout' },
          ];
          break;
        case 2: // Martes (Espalda/Bíceps)
          workoutTasks = [
            { id: 'w1', label: 'Dominadas o Jalón (4x8)', time: 'Rutina', completed: false, type: 'workout' },
            { id: 'w2', label: 'Remo con Barra (4x8)', time: 'Rutina', completed: false, type: 'workout' },
            { id: 'w3', label: 'Curl de Bíceps (3x10)', time: 'Rutina', completed: false, type: 'workout' },
          ];
          break;
        case 3: // Miércoles (Descanso Activo)
          workoutTasks = [
            { id: 'w1', label: 'Caminata ligera (45 min)', time: 'Cardio', completed: false, type: 'workout' },
            { id: 'w2', label: 'Estiramientos / Movilidad', time: 'Recuperación', completed: false, type: 'workout' },
          ];
          break;
        case 4: // Jueves (Pierna)
          workoutTasks = [
            { id: 'w1', label: 'Sentadilla (4x8)', time: 'Rutina', completed: false, type: 'workout' },
            { id: 'w2', label: 'Peso Muerto Romano (4x8)', time: 'Rutina', completed: false, type: 'workout' },
            { id: 'w3', label: 'Prensa (3x12)', time: 'Rutina', completed: false, type: 'workout' },
          ];
          break;
        case 5: // Viernes (Hombro)
          workoutTasks = [
            { id: 'w1', label: 'Press Militar (4x8)', time: 'Rutina', completed: false, type: 'workout' },
            { id: 'w2', label: 'Elevaciones Laterales (3x12)', time: 'Rutina', completed: false, type: 'workout' },
            { id: 'w3', label: 'Plancha (3x45 seg)', time: 'Core', completed: false, type: 'workout' },
          ];
          break;
        case 6: // Sábado (Cardio/Abs)
          workoutTasks = [
            { id: 'w1', label: 'Cardio Moderado (30 min)', time: 'Cardio', completed: false, type: 'workout' },
            { id: 'w2', label: 'Circuito de Abdominales', time: 'Core', completed: false, type: 'workout' },
          ];
          break;
        case 0: // Domingo (Planificación)
          workoutTasks = [
            { id: 'w1', label: 'Caminata Reflexiva (30 min)', time: 'Mente', completed: false, type: 'workout' },
            { id: 'w2', label: 'Meal Prep Semanal', time: 'Cocina', completed: false, type: 'meal' },
          ];
          break;
      }

      // Tareas base que aplican todo el día
      const baseTasks: DailyTask[] = [
        { id: 'h1', label: '3+ Litros de agua', time: 'Todo el día', completed: false, type: 'water' },
        { id: 's1', label: 'Dormir 7+ horas', time: '22:00 - 5:00', completed: false, type: 'sleep' },
      ];

      // Lógica de Bloques del Día
      if (hour >= 5 && hour < 12) {
        block = 'morning';
        greeting = `Buenos días, Ritch.`;
        message = day === 0 
          ? 'Domingo de estrategia. Prepara tu mente para la semana.' 
          : 'La disciplina empieza temprano. A darle a los fierros.';
        
        // En la mañana: entrenamiento + ayuno activo
        tasks = [
          ...workoutTasks,
          { id: 'ayuno', label: 'Mantener ayuno (solo agua/café)', time: 'Hasta 14:00', completed: false, type: 'meal' },
          ...baseTasks,
        ];
      } else if (hour >= 12 && hour < 18) {
        block = 'afternoon';
        greeting = 'Seguimos, Ritch.';
        message = 'Mantén el enfoque. Comida 1 es tu combustible.';
        tasks = [
          { id: 'w_check', label: `Entreno: ${todayWorkout}`, time: '6:00 AM', completed: false, type: 'workout' },
          { id: 'm1', label: 'Comida 1: 5 huevos + frijoles + verduras', time: '14:00 - 15:00', completed: false, type: 'meal' },
          { id: 'no_snack', label: 'Sin snacks entre comidas', time: '15:00 - 19:00', completed: false, type: 'meal' },
          { id: 'm2', label: 'Comida 2: 350g pollo + verduras', time: '19:00 - 20:00', completed: false, type: 'meal' },
          ...baseTasks,
        ];
      } else if (hour >= 18 && hour < 22) {
        block = 'evening';
        greeting = 'Recta final.';
        message = 'Cierra el día fuerte. Última comida antes de las 8PM.';
        tasks = [
          { id: 'w_check', label: `Entreno: ${todayWorkout}`, time: '6:00 AM', completed: false, type: 'workout' },
          { id: 'm1', label: 'Comida 1: Huevos + frijoles', time: '14:00', completed: false, type: 'meal' },
          { id: 'm2', label: 'Comida 2: 350g pollo + verduras', time: '19:00 - 20:00', completed: false, type: 'meal' },
          { id: 'cutoff', label: 'Cerrar cocina (inicia ayuno)', time: '20:00', completed: false, type: 'meal' },
          ...baseTasks,
        ];
      } else {
        block = 'night';
        greeting = 'Descansa.';
        message = 'El sueño es parte del entrenamiento. 7 horas mínimo.';
        tasks = [
          { id: 'w_check', label: `Entreno: ${todayWorkout}`, time: '6:00 AM', completed: false, type: 'workout' },
          { id: 'm1', label: 'Comida 1 completada', time: '14:00', completed: false, type: 'meal' },
          { id: 'm2', label: 'Comida 2 completada', time: '20:00', completed: false, type: 'meal' },
          { id: 'ayuno_noche', label: 'Ayuno nocturno activo', time: '20:00 - 14:00', completed: false, type: 'meal' },
          ...baseTasks,
        ];
      }

      setState({
        greeting,
        message,
        dateString: capitalizedDate,
        currentBlock: block,
        tasks
      });
    };

    updateCoach();
    const interval = setInterval(updateCoach, 60000);
    return () => clearInterval(interval);
  }, []);

  return state;
}
