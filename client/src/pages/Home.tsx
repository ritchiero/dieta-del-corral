import { useCoach } from "@/hooks/useCoach";
import { useProgress } from "@/hooks/useProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import MotivationCheck from "@/components/MotivationCheck";
import CalendarSync from "@/components/CalendarSync";
import { Dumbbell, Utensils, Droplets, Moon, Trophy, CalendarDays, PartyPopper, ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

// Fecha de inicio del reto
const CHALLENGE_START = new Date(2025, 10, 30); // 30 de noviembre 2025

// Obtener fecha para un día del reto
const getDateForDay = (day: number) => {
  const date = new Date(CHALLENGE_START);
  date.setDate(CHALLENGE_START.getDate() + day - 1);
  return date;
};

// Formatear fecha
const formatDate = (date: Date) => {
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${days[date.getDay()]}, ${date.getDate()} de ${months[date.getMonth()]}`;
};

export default function Home() {
  const { greeting, message, tasks } = useCoach();
  const { progress, markTask, getDailyCompletion, getDayProgress, getCurrentChallengeDay, loading } = useProgress();

  const currentDay = getCurrentChallengeDay();
  const [selectedDay, setSelectedDay] = useState(currentDay);
  
  // Actualizar selectedDay cuando cambia currentDay
  useEffect(() => {
    setSelectedDay(currentDay);
  }, [currentDay]);

  const selectedDate = getDateForDay(selectedDay);
  const dateString = formatDate(selectedDate);
  
  // Calcular progreso del día seleccionado
  const dailyPercentage = getDailyCompletion(selectedDay, tasks.length);
  
  // Calcular progreso global: promedio de todos los días hasta hoy
  const calculateGlobalProgress = () => {
    let totalTasks = 0;
    let completedTasks = 0;
    
    for (let day = 1; day <= currentDay; day++) {
      const dayProgress = getDayProgress(day);
      totalTasks += tasks.length;
      completedTasks += dayProgress?.tasks.length || 0;
    }
    
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };
  
  const globalPercentage = calculateGlobalProgress();
  
  // Contar días 100% completados
  const countCompletedDays = () => {
    let count = 0;
    for (let day = 1; day <= currentDay; day++) {
      const dayProgress = getDayProgress(day);
      if (dayProgress && dayProgress.tasks.length >= tasks.length) {
        count++;
      }
    }
    return count;
  };
  
  const completedDaysCount = countCompletedDays();
  
  // Estado para trackear si ya celebramos hoy
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const prevPercentageRef = useRef(dailyPercentage);

  // Celebración con confeti cuando se llega al 100%
  useEffect(() => {
    if (selectedDay !== currentDay) return; // Solo celebrar en el día actual
    
    if (dailyPercentage === 100 && !hasCelebrated && prevPercentageRef.current < 100) {
      const duration = 3000;
      const end = Date.now() + duration;
      const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

      (function frame() {
        confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0, y: 0.8 }, colors });
        confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1, y: 0.8 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      })();

      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors });
      setHasCelebrated(true);
    }

    if (dailyPercentage < 100) setHasCelebrated(false);
    prevPercentageRef.current = dailyPercentage;
  }, [dailyPercentage, hasCelebrated, selectedDay, currentDay]);

  // Navegación entre días
  const goToPreviousDay = () => setSelectedDay((d) => Math.max(1, d - 1));
  const goToNextDay = () => setSelectedDay((d) => Math.min(currentDay, d + 1));
  const goToToday = () => setSelectedDay(currentDay);

  // Verificar si un día está incompleto
  const isDayIncomplete = (day: number) => {
    if (day > currentDay) return false;
    const dayProgress = getDayProgress(day);
    return !dayProgress || dayProgress.tasks.length < tasks.length;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Cargando tu progreso...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Header con navegación de días */}
      <header className="space-y-3">
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
              <span className="text-xl font-bold">Día {selectedDay}</span>
              {selectedDay === currentDay && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">HOY</span>
              )}
              {selectedDay < currentDay && isDayIncomplete(selectedDay) && (
                <AlertCircle className="h-4 w-4 text-orange-500" />
              )}
              {!isDayIncomplete(selectedDay) && selectedDay <= currentDay && (
                <Check className="h-4 w-4 text-green-600" />
              )}
            </div>
            <p className="text-xs text-muted-foreground">{dateString}</p>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goToNextDay}
            disabled={selectedDay >= currentDay}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Botón para volver a hoy */}
        {selectedDay !== currentDay && (
          <Button variant="outline" size="sm" onClick={goToToday} className="w-full">
            <CalendarDays className="h-4 w-4 mr-2" />
            Volver al día de hoy (Día {currentDay})
          </Button>
        )}

        {/* Mini calendario */}
        <div className="grid grid-cols-11 gap-1">
          {Array.from({ length: 22 }, (_, i) => i + 1).map((day) => {
            const isCompleted = !isDayIncomplete(day) && day <= currentDay;
            const isCurrent = day === currentDay;
            const isSelected = day === selectedDay;
            const isPast = day < currentDay;
            const isIncomplete = isPast && isDayIncomplete(day);
            const isFuture = day > currentDay;
            
            return (
              <button
                key={day}
                onClick={() => day <= currentDay && setSelectedDay(day)}
                disabled={isFuture}
                className={cn(
                  "h-6 w-full text-xs font-medium rounded transition-all",
                  isSelected && "ring-2 ring-primary ring-offset-1",
                  isCompleted && "bg-green-500 text-white",
                  isCurrent && !isCompleted && "bg-primary text-primary-foreground",
                  isIncomplete && "bg-orange-100 text-orange-600 dark:bg-orange-900/30",
                  isFuture && "bg-muted/30 text-muted-foreground/50 cursor-not-allowed",
                  !isFuture && "hover:scale-110 cursor-pointer"
                )}
              >
                {day}
              </button>
            );
          })}
        </div>

        {/* Saludo (solo si es el día actual) */}
        {selectedDay === currentDay && (
          <div className="pt-2">
            <h1 className="text-2xl font-serif font-bold">{greeting}</h1>
            <p className="text-muted-foreground italic">"{message}"</p>
          </div>
        )}
      </header>

      {/* Progreso Global */}
      <Card className="bg-secondary/30 border-none">
        <CardContent className="pt-6 pb-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
              <Trophy className="h-3 w-3" /> Progreso Global
            </p>
            <p className="text-2xl font-bold font-serif">
              {completedDaysCount} <span className="text-muted-foreground text-sm font-sans font-normal">/ {currentDay} días</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {currentDay - completedDaysCount > 0 && (
                <span className="text-orange-600">{currentDay - completedDaysCount} día(s) incompleto(s)</span>
              )}
              {currentDay - completedDaysCount === 0 && currentDay > 0 && (
                <span className="text-green-600">¡Todos los días completos!</span>
              )}
            </p>
          </div>
          <div className="h-14 w-14 relative flex items-center justify-center">
            <span className="font-bold text-sm">{Math.round(globalPercentage)}%</span>
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path className="text-muted/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
              <path className="text-primary" strokeDasharray={`${globalPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
            </svg>
          </div>
        </CardContent>
      </Card>

      {/* Progreso Diario */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Progreso Día {selectedDay}</span>
          <span className={cn(dailyPercentage === 100 && "text-green-600 font-bold")}>
            {Math.round(dailyPercentage)}%
          </span>
        </div>
        <Progress 
          value={dailyPercentage} 
          className={cn("h-2", dailyPercentage === 100 && "[&>div]:bg-green-600")} 
        />
        
        {dailyPercentage === 100 && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in zoom-in duration-500">
            <PartyPopper className="h-5 w-5 text-green-600" />
            <span className="text-green-700 font-semibold">¡Día {selectedDay} completado!</span>
            <PartyPopper className="h-5 w-5 text-green-600" />
          </div>
        )}
        
        {selectedDay < currentDay && dailyPercentage < 100 && (
          <div className="flex items-center gap-2 py-2 px-3 bg-orange-50 border border-orange-200 rounded-lg text-sm">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <span className="text-orange-700">Este día quedó incompleto. Puedes completarlo ahora.</span>
          </div>
        )}
      </div>

      {/* Motivation Check (solo día actual) */}
      {selectedDay === currentDay && <MotivationCheck />}

      {/* Tareas del Día */}
      <div className="space-y-3">
        <h2 className="text-lg font-serif font-bold flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Misiones del Día {selectedDay}
        </h2>
        
        {tasks.map((task) => {
          const isCompleted = getDayProgress(selectedDay)?.tasks.some(t => t.id === task.id) || false;
          
          return (
            <Card key={task.id} className={cn(
              "transition-all duration-300",
              isCompleted ? "opacity-60 bg-muted" : "bg-card hover:shadow-md"
            )}>
              <CardContent className="p-4 flex items-center gap-4">
                <Checkbox 
                  id={`${task.id}-${selectedDay}`} 
                  checked={isCompleted}
                  onCheckedChange={(checked) => markTask(selectedDay, task.id, checked as boolean)}
                  className="h-6 w-6 rounded-full border-2 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <div className="flex-1">
                  <label 
                    htmlFor={`${task.id}-${selectedDay}`} 
                    className={cn(
                      "font-medium cursor-pointer block",
                      isCompleted && "line-through text-muted-foreground"
                    )}
                  >
                    {task.label}
                  </label>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    {task.type === 'workout' && <Dumbbell className="h-3 w-3" />}
                    {task.type === 'meal' && <Utensils className="h-3 w-3" />}
                    {task.type === 'water' && <Droplets className="h-3 w-3" />}
                    {task.type === 'sleep' && <Moon className="h-3 w-3" />}
                    {task.time}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Calendar Sync (solo día actual) */}
      {selectedDay === currentDay && <CalendarSync />}
    </div>
  );
}
