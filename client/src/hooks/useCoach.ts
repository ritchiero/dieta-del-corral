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

      // Lógica de Bloques del Día
      if (hour >= 5 && hour < 12) {
        block = 'morning';
        greeting = `Buenos días, Ritch.`;
        message = day === 0 
          ? 'Domingo de estrategia. Prepara tu mente para la semana.' 
          : 'La disciplina empieza temprano. A darle a los fierros.';
        
        // En la mañana mostramos el desglose completo del entreno
        tasks = [
          ...workoutTasks,
          { id: 'm1', label: 'Ayuno activo (Solo agua/café)', time: 'Hasta 2:00 PM', completed: false, type: 'meal' },
        ];
      } else if (hour >= 12 && hour < 18) {
        block = 'afternoon';
        greeting = 'Seguimos, Ritch.';
        message = 'Mantén el enfoque. Comida 1 es tu combustible.';
        tasks = [
          { id: 'm2', label: 'Romper Ayuno (Huevos + Frijoles)', time: '14:00', completed: false, type: 'meal' },
          { id: 'w_check', label: `Hoy toca: ${todayWorkout}`, time: '6:00 AM', completed: false, type: 'workout' },
          { id: 'h1', label: '2 Litros de agua', time: 'Todo el día', completed: false, type: 'water' },
        ];
      } else if (hour >= 18 && hour < 22) {
        block = 'evening';
        greeting = 'Recta final.';
        message = 'Cierra el día fuerte. Nada de picar entre horas.';
        tasks = [
          { id: 'm3', label: 'Cena de Proteína (Pollo + Verduras)', time: '20:00', completed: false, type: 'meal' },
          { id: 'p1', label: 'Preparar ropa mañana', time: '21:00', completed: false, type: 'workout' },
        ];
      } else {
        block = 'night';
        greeting = 'Descansa.';
        message = 'El sueño es parte del entrenamiento. 7 horas mínimo.';
        tasks = [
          { id: 's1', label: 'Dormir (Recuperación)', time: '22:00', completed: false, type: 'sleep' },
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
