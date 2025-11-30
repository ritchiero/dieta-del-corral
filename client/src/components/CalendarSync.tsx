import { Button } from "@/components/ui/button";
import { BellRing, ExternalLink, CalendarPlus } from "lucide-react";
import { toast } from "sonner";

export default function CalendarSync() {
  // Helper para generar URLs de Google Calendar
  const getGoogleCalendarUrl = (title: string, details: string, startTime: string, endTime: string) => {
    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    return `${baseUrl}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${today}T${startTime}00/${today}T${endTime}00&recur=RRULE:FREQ=DAILY;COUNT=22`;
  };

  const urls = {
    workout: getGoogleCalendarUrl(
      "🏋️ Entrenamiento Corral",
      "No se piensa, solo se hace. Revisa la app para la rutina de hoy.\n\n📱 https://dieta-del-corral.vercel.app",
      "0600", "0700"
    ),
    meal1: getGoogleCalendarUrl(
      "🍳 Comida 1 - Romper Ayuno",
      "• 5 huevos revueltos\n• 1 taza frijoles negros\n• Verduras al gusto\n\nSin negociar. 💪",
      "1400", "1430"
    ),
    meal2: getGoogleCalendarUrl(
      "🍗 Comida 2 - Cena",
      "• 350g pollo asado\n• 1 taza frijoles negros\n• Verduras al gusto\n\n⚠️ Cerrar cocina después de esta comida.",
      "1930", "2000"
    ),
  };

  // Sincronizar todo de una vez (abre las 3 ventanas)
  const syncAll = () => {
    // Abrir las 3 URLs con pequeño delay para evitar bloqueo de popups
    window.open(urls.workout, '_blank');
    setTimeout(() => window.open(urls.meal1, '_blank'), 300);
    setTimeout(() => window.open(urls.meal2, '_blank'), 600);
    
    toast.success("¡Sincronizando con Google Calendar!", {
      description: "Se abrieron 3 pestañas. Guarda cada evento para activar las alarmas por 22 días.",
      duration: 6000,
    });
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BellRing className="h-4 w-4 text-primary" />
        <h3 className="font-serif font-bold text-primary">Sincronizar Google Calendar</h3>
      </div>
      
      {/* Botón principal: Sincronizar todo */}
      <Button 
        onClick={syncAll} 
        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        size="lg"
      >
        <CalendarPlus className="h-4 w-4 mr-2" />
        Agregar Todo a Google Calendar
      </Button>
      
      <p className="text-[11px] text-muted-foreground text-center">
        Se abrirán 3 pestañas para crear eventos recurrentes (22 días cada uno).
        <br />Solo guarda cada evento y listo. ✨
      </p>
      
      {/* Separador */}
      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border/50" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-primary/5 px-2 text-muted-foreground">o agregar uno por uno</span>
        </div>
      </div>
      
      {/* Botones individuales */}
      <div className="grid gap-2">
        <Button 
          variant="outline" 
          onClick={() => window.open(urls.workout, '_blank')} 
          className="justify-between w-full bg-white/50 text-sm h-9"
        >
          <span>🏋️ Entrenamientos (6 AM)</span>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.open(urls.meal1, '_blank')} 
          className="justify-between w-full bg-white/50 text-sm h-9"
        >
          <span>🍳 Comida 1 (2 PM)</span>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </Button>
        <Button 
          variant="outline" 
          onClick={() => window.open(urls.meal2, '_blank')} 
          className="justify-between w-full bg-white/50 text-sm h-9"
        >
          <span>🍗 Comida 2 (7:30 PM)</span>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </Button>
      </div>
    </div>
  );
}
