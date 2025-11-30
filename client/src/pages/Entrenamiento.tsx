import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Dumbbell, Timer, Check, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import confetti from "canvas-confetti";
import { toast } from "sonner";
import { useProgress } from "@/hooks/useProgress";

// Definir ejercicios por tipo de día
const workoutsByType: Record<string, { name: string; exercises: { id: string; name: string; sets: string; reps: string }[] }> = {
  pecho_triceps: {
    name: "Pecho y Tríceps",
    exercises: [
      { id: "l1", name: "Press banca plano", sets: "4", reps: "8-10" },
      { id: "l2", name: "Press inclinado mancuernas", sets: "3", reps: "10-12" },
      { id: "l3", name: "Aperturas en máquina", sets: "3", reps: "12-15" },
      { id: "l4", name: "Fondos en paralelas", sets: "3", reps: "Al fallo" },
      { id: "l5", name: "Extensión tríceps polea", sets: "3", reps: "12-15" },
      { id: "l6", name: "Press francés", sets: "3", reps: "10-12" },
    ],
  },
  espalda_biceps: {
    name: "Espalda y Bíceps",
    exercises: [
      { id: "m1", name: "Dominadas o jalón al pecho", sets: "4", reps: "8-10" },
      { id: "m2", name: "Remo con barra", sets: "4", reps: "8-10" },
      { id: "m3", name: "Remo en máquina", sets: "3", reps: "10-12" },
      { id: "m4", name: "Pull over", sets: "3", reps: "12" },
      { id: "m5", name: "Curl bíceps barra", sets: "3", reps: "10-12" },
      { id: "m6", name: "Curl martillo", sets: "3", reps: "12" },
    ],
  },
  cardio: {
    name: "Cardio",
    exercises: [
      { id: "mi1", name: "Caminata rápida (caminadora/calle)", sets: "1", reps: "45 min" },
      { id: "mi2", name: "Estiramientos", sets: "1", reps: "10 min" },
    ],
  },
  pierna: {
    name: "Pierna",
    exercises: [
      { id: "j1", name: "Sentadilla profunda", sets: "4", reps: "8-10" },
      { id: "j2", name: "Prensa inclinada", sets: "4", reps: "10-12" },
      { id: "j3", name: "Extensión de cuádriceps", sets: "3", reps: "12-15" },
      { id: "j4", name: "Curl femoral acostado", sets: "3", reps: "12" },
      { id: "j5", name: "Peso muerto rumano", sets: "3", reps: "10-12" },
      { id: "j6", name: "Elevación de pantorrillas", sets: "4", reps: "15-20" },
    ],
  },
  hombro_core: {
    name: "Hombro y Core",
    exercises: [
      { id: "v1", name: "Press militar", sets: "4", reps: "8-10" },
      { id: "v2", name: "Elevaciones laterales", sets: "4", reps: "12-15" },
      { id: "v3", name: "Elevaciones frontales", sets: "3", reps: "12" },
      { id: "v4", name: "Face pulls", sets: "3", reps: "15" },
      { id: "v5", name: "Plancha", sets: "3", reps: "45-60 seg" },
      { id: "v6", name: "Crunch en polea", sets: "3", reps: "15-20" },
    ],
  },
  cardio_abs: {
    name: "Cardio + Abdominales",
    exercises: [
      { id: "s1", name: "Caminata o bicicleta", sets: "1", reps: "30-40 min" },
      { id: "s2", name: "Plancha lateral", sets: "3", reps: "30 seg c/lado" },
      { id: "s3", name: "Elevación de piernas", sets: "3", reps: "15" },
      { id: "s4", name: "Russian twists", sets: "3", reps: "20" },
    ],
  },
  descanso: {
    name: "Descanso + Meal Prep",
    exercises: [
      { id: "d1", name: "Preparar pollo de la semana", sets: "-", reps: "2-3 kg" },
      { id: "d2", name: "Cocinar frijoles", sets: "-", reps: "1 kg" },
      { id: "d3", name: "Preparar verduras", sets: "-", reps: "Al gusto" },
      { id: "d4", name: "Estiramientos suaves", sets: "1", reps: "15 min" },
    ],
  },
};

// Mapear día de la semana a tipo de entrenamiento
const dayOfWeekToWorkoutType: Record<number, string> = {
  0: "descanso",      // Domingo
  1: "pecho_triceps", // Lunes
  2: "espalda_biceps",// Martes
  3: "cardio",        // Miércoles
  4: "pierna",        // Jueves
  5: "hombro_core",   // Viernes
  6: "cardio_abs",    // Sábado
};

const dayOfWeekNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const dayImages: Record<string, string> = {
  pecho_triceps: "/IMG_8458.JPG",
  espalda_biceps: "/IMG_8467.JPG",
  pierna: "/IMG_8465.JPG",
  hombro_core: "/IMG_8469.JPG",
};

// Fecha de inicio del reto (30 Nov 2024)
const CHALLENGE_START_DATE = new Date("2024-11-30T00:00:00");

export default function Entrenamiento() {
  const { progress } = useProgress();
  
  // Calcular día actual del reto
  const calculateCurrentChallengeDay = () => {
    if (!progress.startDate) return 1;
    const start = new Date(progress.startDate);
    const now = new Date();
    start.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = now.getTime() - start.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(diffDays, 22));
  };

  const currentChallengeDay = calculateCurrentChallengeDay();
  const [selectedDay, setSelectedDay] = useState(currentChallengeDay);
  
  // Calcular qué día de la semana corresponde a cada día del reto
  const getDayOfWeekForChallengeDay = (challengeDay: number) => {
    const startDate = progress.startDate ? new Date(progress.startDate) : CHALLENGE_START_DATE;
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + challengeDay - 1);
    return targetDate.getDay();
  };

  const getWorkoutTypeForDay = (challengeDay: number) => {
    const dayOfWeek = getDayOfWeekForChallengeDay(challengeDay);
    return dayOfWeekToWorkoutType[dayOfWeek];
  };

  const getDateForChallengeDay = (challengeDay: number) => {
    const startDate = progress.startDate ? new Date(progress.startDate) : CHALLENGE_START_DATE;
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + challengeDay - 1);
    return targetDate;
  };

  // Estado para ejercicios completados (por día del reto)
  const [completedExercises, setCompletedExercises] = useState<Record<number, string[]>>(() => {
    const saved = localStorage.getItem("workoutProgressByDay");
    return saved ? JSON.parse(saved) : {};
  });

  // Guardar progreso en localStorage
  useEffect(() => {
    localStorage.setItem("workoutProgressByDay", JSON.stringify(completedExercises));
  }, [completedExercises]);

  const toggleExercise = (day: number, exerciseId: string) => {
    setCompletedExercises((prev) => {
      const dayExercises = prev[day] || [];
      const isCompleted = dayExercises.includes(exerciseId);
      
      let newDayExercises: string[];
      if (isCompleted) {
        newDayExercises = dayExercises.filter((id) => id !== exerciseId);
      } else {
        newDayExercises = [...dayExercises, exerciseId];
      }

      const newState = { ...prev, [day]: newDayExercises };

      // Verificar si se completaron todos los ejercicios del día
      const workoutType = getWorkoutTypeForDay(day);
      const workout = workoutsByType[workoutType];
      if (workout && newDayExercises.length === workout.exercises.length && !isCompleted) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
        toast.success("¡Entrenamiento completado! 💪", {
          description: `Día ${day}/22 - ${workout.name} terminado.`,
        });
      }

      return newState;
    });
  };

  const getProgress = (day: number) => {
    const workoutType = getWorkoutTypeForDay(day);
    const workout = workoutsByType[workoutType];
    if (!workout) return 0;
    const completed = completedExercises[day]?.length || 0;
    return Math.round((completed / workout.exercises.length) * 100);
  };

  const workoutType = getWorkoutTypeForDay(selectedDay);
  const workout = workoutsByType[workoutType];
  const progressPercent = getProgress(selectedDay);
  const completed = completedExercises[selectedDay] || [];
  const hasImage = dayImages[workoutType];
  const dateForDay = getDateForChallengeDay(selectedDay);
  const dayOfWeekName = dayOfWeekNames[dateForDay.getDay()];

  // Navegación entre días
  const goToPreviousDay = () => setSelectedDay((d) => Math.max(1, d - 1));
  const goToNextDay = () => setSelectedDay((d) => Math.min(22, d + 1));
  const goToToday = () => setSelectedDay(currentChallengeDay);

  // Contar días completados
  const completedDaysCount = Object.entries(completedExercises).filter(([day, exercises]) => {
    const dayNum = parseInt(day);
    const wType = getWorkoutTypeForDay(dayNum);
    const w = workoutsByType[wType];
    return w && exercises.length === w.exercises.length;
  }).length;

  return (
    <div className="space-y-6 pb-24">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-serif font-bold">Entrenamiento</h1>
        <p className="text-sm text-muted-foreground">
          {completedDaysCount}/22 días completados
        </p>
      </div>

      {/* Navegación de días */}
      <div className="flex items-center justify-between bg-secondary/30 rounded-xl p-3">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToPreviousDay}
          disabled={selectedDay === 1}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl font-bold">Día {selectedDay}</span>
            {selectedDay === currentChallengeDay && (
              <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">HOY</span>
            )}
            {progressPercent === 100 && (
              <Check className="h-5 w-5 text-green-600" />
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {dayOfWeekName}, {dateForDay.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goToNextDay}
          disabled={selectedDay === 22}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>

      {/* Botón para ir al día actual */}
      {selectedDay !== currentChallengeDay && (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToToday}
          className="w-full"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Ir al día de hoy (Día {currentChallengeDay})
        </Button>
      )}

      {/* Mini-calendario visual */}
      <div className="grid grid-cols-11 gap-1">
        {Array.from({ length: 22 }, (_, i) => i + 1).map((day) => {
          const isCompleted = getProgress(day) === 100;
          const isCurrent = day === currentChallengeDay;
          const isSelected = day === selectedDay;
          const isPast = day < currentChallengeDay;
          
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`
                h-7 w-full text-xs font-medium rounded transition-all
                ${isSelected ? "ring-2 ring-primary ring-offset-1" : ""}
                ${isCompleted ? "bg-green-500 text-white" : ""}
                ${isCurrent && !isCompleted ? "bg-primary text-primary-foreground" : ""}
                ${isPast && !isCompleted ? "bg-red-100 text-red-600 dark:bg-red-900/30" : ""}
                ${!isPast && !isCurrent && !isCompleted ? "bg-secondary/50 text-muted-foreground" : ""}
                hover:scale-110
              `}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Tipo de entrenamiento */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-serif font-bold">{workout.name}</h2>
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Dumbbell className="h-4 w-4" />
          <span>{workout.exercises.length} ejercicios</span>
        </div>
      </div>

      {/* Barra de progreso */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progreso del día</span>
          <span className="font-medium">{progressPercent}%</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
      </div>

      {/* Checklist de ejercicios */}
      <Card className="border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Timer className="h-4 w-4 text-primary" />
            Ejercicios
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {workout.exercises.map((exercise) => {
            const isExerciseCompleted = completed.includes(exercise.id);
            return (
              <label
                key={exercise.id}
                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                  isExerciseCompleted
                    ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                    : "bg-secondary/30 hover:bg-secondary/50 border border-transparent"
                }`}
              >
                <Checkbox
                  checked={isExerciseCompleted}
                  onCheckedChange={() => toggleExercise(selectedDay, exercise.id)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <div className="flex-1">
                  <p className={`font-medium ${isExerciseCompleted ? "line-through text-muted-foreground" : ""}`}>
                    {exercise.name}
                  </p>
                </div>
                <div className="text-right text-sm text-muted-foreground">
                  <span className="font-medium">{exercise.sets}</span>
                  <span className="mx-1">×</span>
                  <span>{exercise.reps}</span>
                </div>
              </label>
            );
          })}
        </CardContent>
      </Card>

      {/* Imagen de referencia (si existe) */}
      {hasImage && (
        <Card className="overflow-hidden border-none shadow-lg">
          <CardContent className="p-0">
            <details className="group">
              <summary className="cursor-pointer p-4 bg-secondary/30 flex items-center justify-between hover:bg-secondary/50 transition-colors">
                <span className="font-medium">📸 Ver imagen de referencia</span>
                <span className="text-muted-foreground group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <img
                src={hasImage}
                alt={`Rutina de ${workout.name}`}
                className="w-full h-auto object-cover"
              />
            </details>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
