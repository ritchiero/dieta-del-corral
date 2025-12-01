import { useCoach } from "@/hooks/useCoach";
import { useProgress } from "@/hooks/useProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import MotivationCheck from "@/components/MotivationCheck";
import CalendarSync from "@/components/CalendarSync";
import { Dumbbell, Utensils, Droplets, Moon, Trophy, CalendarDays, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

export default function Home() {
  const { greeting, message, dateString, tasks } = useCoach();
  const { progress, markTask, getDailyCompletion, startChallenge, getDayProgress, getCurrentChallengeDay, loading } = useProgress();

  const currentDay = getCurrentChallengeDay();
  const dailyPercentage = getDailyCompletion(currentDay, tasks.length);
  const globalPercentage = (progress.completedDays / progress.totalDays) * 100;
  
  // Estado para trackear si ya celebramos hoy
  const [hasCelebrated, setHasCelebrated] = useState(false);
  const prevPercentageRef = useRef(dailyPercentage);

  // Celebración con confeti cuando se llega al 100%
  useEffect(() => {
    // Solo celebrar si:
    // 1. El porcentaje es 100%
    // 2. No hemos celebrado aún
    // 3. El porcentaje anterior era menor a 100% (evita celebrar al cargar la página)
    if (dailyPercentage === 100 && !hasCelebrated && prevPercentageRef.current < 100) {
      // ¡Lanzar confeti!
      const duration = 3000;
      const end = Date.now() + duration;

      const colors = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6'];

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.8 },
          colors: colors,
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.8 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();

      // Confeti central explosivo
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: colors,
      });

      setHasCelebrated(true);
    }

    // Resetear celebración si el porcentaje baja de 100
    if (dailyPercentage < 100) {
      setHasCelebrated(false);
    }

    prevPercentageRef.current = dailyPercentage;
  }, [dailyPercentage, hasCelebrated]);

  // Si no ha empezado, mostrar botón de inicio
  if (!progress.startDate) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center space-y-8">
        <h1 className="text-4xl font-serif font-bold">La Dieta del Corral</h1>
        <p className="text-muted-foreground text-lg">22 días de disciplina innegociable.</p>
        <button 
          onClick={startChallenge}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:scale-105 transition-transform"
        >
          INICIAR RETO
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      {/* Header */}
      <header className="space-y-1">
        <p className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
          {dateString}
        </p>
        <h1 className="text-3xl font-serif font-bold">{greeting}</h1>
        <p className="text-muted-foreground text-lg italic">"{message}"</p>
      </header>

      {/* Progreso Global */}
      <Card className="bg-secondary/30 border-none">
        <CardContent className="pt-6 pb-4 flex items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
              <Trophy className="h-3 w-3" /> Progreso Global
            </p>
            <p className="text-2xl font-bold font-serif">
              Día {progress.completedDays + 1} <span className="text-muted-foreground text-sm font-sans font-normal">/ {progress.totalDays}</span>
            </p>
          </div>
          <div className="h-12 w-12 relative flex items-center justify-center">
             {/* Circular Progress Placeholder - using text for simplicity in this iteration */}
             <span className="font-bold text-sm">{Math.round(globalPercentage)}%</span>
             <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-muted/20" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-primary" strokeDasharray={`${globalPercentage}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
             </svg>
          </div>
        </CardContent>
      </Card>

      {/* Progreso Diario */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Progreso Diario</span>
          <span className={cn(dailyPercentage === 100 && "text-green-600 font-bold")}>
            {Math.round(dailyPercentage)}%
          </span>
        </div>
        <Progress 
          value={dailyPercentage} 
          className={cn("h-2", dailyPercentage === 100 && "[&>div]:bg-green-600")} 
        />
        
        {/* Mensaje de celebración */}
        {dailyPercentage === 100 && (
          <div className="flex items-center justify-center gap-2 py-3 px-4 bg-green-50 border border-green-200 rounded-lg animate-in fade-in zoom-in duration-500">
            <PartyPopper className="h-5 w-5 text-green-600" />
            <span className="text-green-700 font-semibold">¡Día completado! Eres imparable.</span>
            <PartyPopper className="h-5 w-5 text-green-600" />
          </div>
        )}
      </div>

      {/* Motivation Check */}
      <MotivationCheck />

      {/* Tareas del Día */}
      <div className="space-y-3">
        <h2 className="text-lg font-serif font-bold flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Misiones de Hoy
        </h2>
        
        {tasks.map((task) => (
          <Card key={task.id} className={cn(
            "transition-all duration-300",
            getDayProgress(currentDay)?.tasks.some(t => t.id === task.id)
              ? "opacity-60 bg-muted" 
              : "bg-card hover:shadow-md"
          )}>
            <CardContent className="p-4 flex items-center gap-4">
              <Checkbox 
                id={task.id} 
                checked={getDayProgress(currentDay)?.tasks.some(t => t.id === task.id) || false}
                onCheckedChange={(checked) => markTask(currentDay, task.id, checked as boolean)}
                className="h-6 w-6 rounded-full border-2 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <div className="flex-1">
                <label 
                  htmlFor={task.id} 
                  className={cn(
                    "font-medium cursor-pointer block",
                    getDayProgress(currentDay)?.tasks.some(t => t.id === task.id) && "line-through text-muted-foreground"
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
        ))}
      </div>

      {/* Calendar Sync */}
      <CalendarSync />
    </div>
  );
}
