export function generateCalendar() {
  const startDate = new Date('2024-11-30');
  const endDate = new Date('2024-12-22');
  const events = [];

  // Helper para formatear fecha ICS
  const formatICSDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  // Generar eventos para cada día
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0].replace(/-/g, '');
    
    // 1. Entrenamiento (6:00 AM - 8:00 AM)
    events.push(`BEGIN:VEVENT
DTSTART:${dateStr}T120000Z
DTEND:${dateStr}T140000Z
SUMMARY:🏋️‍♂️ Entrenamiento Corral
DESCRIPTION:No se piensa, solo se hace. Revisa la app para la rutina de hoy.
ALARM:DISPLAY
TRIGGER:-PT15M
END:VEVENT`);

    // 2. Comida 1 (2:00 PM - 3:00 PM)
    events.push(`BEGIN:VEVENT
DTSTART:${dateStr}T200000Z
DTEND:${dateStr}T210000Z
SUMMARY:🍳 Comida 1 (Romper Ayuno)
DESCRIPTION:Huevos + Frijoles + Verduras. Sin negociar.
ALARM:DISPLAY
TRIGGER:-PT5M
END:VEVENT`);

    // 3. Comida 2 (8:00 PM - 9:00 PM)
    events.push(`BEGIN:VEVENT
DTSTART:${dateStr}T020000Z
DTEND:${dateStr}T030000Z
SUMMARY:🍗 Comida 2 (Cierre)
DESCRIPTION:Pollo + Frijoles + Verduras. Cierra el día fuerte.
ALARM:DISPLAY
TRIGGER:-PT5M
END:VEVENT`);
  }

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Dieta del Corral//Coach//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:Dieta del Corral
X-WR-TIMEZONE:America/Mexico_City
${events.join('\n')}
END:VCALENDAR`;

  // Crear y descargar archivo
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', 'calendario_corral.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
