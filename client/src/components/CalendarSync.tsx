import { Button } from "@/components/ui/button";
import { CalendarCheck, BellRing, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function CalendarSync() {
  // Helper para generar URLs de Google Calendar
  const getGoogleCalendarUrl = (title: string, details: string, startTime: string, endTime: string) => {
    const baseUrl = "https://calendar.google.com/calendar/render?action=TEMPLATE";
    // Fechas fijas para el ejemplo (ajustables por el usuario al abrir el link)
    // Formato: YYYYMMDDTHHMMSSZ
    // Usamos fechas relativas al día actual para facilitar la creación
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    return `${baseUrl}&text=${encodeURIComponent(title)}&details=${encodeURIComponent(details)}&dates=${today}T${startTime}00/${today}T${endTime}00&recur=RRULE:FREQ=DAILY;COUNT=22`;
  };

  const openGoogleCalendar = (type: 'workout' | 'meal1' | 'meal2') => {
    let url = '';
    switch (type) {
      case 'workout':
        url = getGoogleCalendarUrl(
          "🏋️‍♂️ Entrenamiento Corral",
          "No se piensa, solo se hace. Revisa la app para la rutina de hoy.",
          "0600", "0800"
        );
        break;
      case 'meal1':
        url = getGoogleCalendarUrl(
          "🍳 Comida 1 (Romper Ayuno)",
          "Huevos + Frijoles + Verduras. Sin negociar.",
          "1400", "1500"
        );
        break;
      case 'meal2':
        url = getGoogleCalendarUrl(
          "🍗 Comida 2 (Cierre)",
          "Pollo + Frijoles + Verduras. Cierra el día fuerte.",
          "2000", "2100"
        );
        break;
    }
    window.open(url, '_blank');
    toast.success("Abriendo Google Calendar", {
      description: "Guarda el evento recurrente para activar las alarmas.",
    });
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BellRing className="h-4 w-4 text-primary" />
        <h3 className="font-serif font-bold text-primary">Sincronizar Google Calendar</h3>
      </div>
      
      <div className="grid gap-2">
        <Button variant="outline" onClick={() => openGoogleCalendar('workout')} className="justify-between w-full bg-white/50">
          <span>🏋️‍♂️ Agregar Entrenamientos (6 AM)</span>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </Button>
        <Button variant="outline" onClick={() => openGoogleCalendar('meal1')} className="justify-between w-full bg-white/50">
          <span>🍳 Agregar Comida 1 (2 PM)</span>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </Button>
        <Button variant="outline" onClick={() => openGoogleCalendar('meal2')} className="justify-between w-full bg-white/50">
          <span>🍗 Agregar Comida 2 (8 PM)</span>
          <ExternalLink className="h-3 w-3 opacity-50" />
        </Button>
      </div>
      
      <p className="text-[10px] text-muted-foreground text-center pt-1">
        *Se abrirá Google Calendar para crear eventos recurrentes por 22 días.
      </p>
    </div>
  );
}
