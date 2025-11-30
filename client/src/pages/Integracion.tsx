import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Bell, Smartphone } from "lucide-react";

export default function Integracion() {
  return (
    <div className="space-y-8 pb-20">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-serif font-bold">Conectar con iPhone</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Usa la potencia de iOS para potenciar tu Coach.
        </p>
      </div>

      <div className="space-y-6">
        <Card className="border-none shadow-sm bg-secondary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Activity className="h-5 w-5 text-primary" />
              Leer Anillos de Actividad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Para que el Coach sepa si cerraste tus anillos, crea una <strong>Automatización Personal</strong> en la app "Atajos" (Shortcuts) de tu iPhone.
            </p>
            <div className="bg-background rounded-lg p-4 text-sm space-y-2 border border-border/50">
              <ol className="list-decimal list-inside space-y-2">
                <li>Abre la app <strong>Atajos</strong> en tu iPhone.</li>
                <li>Ve a la pestaña <strong>Automatización</strong> {'>'} Nueva Automatización.</li>
                <li>Elige <strong>"Momento del día"</strong> (ej. 9:00 PM).</li>
                <li>Añade la acción: <strong>"Obtener resumen de actividad"</strong>.</li>
                <li>Añade un bloque <strong>"Si"</strong>: <em>Si [Calorías activas] es menor que [Tu Meta]</em>.</li>
                <li>Acción: <strong>Mostrar notificación</strong> "⚠️ No has cerrado anillos".</li>
                <li>En "Si no": <strong>Mostrar notificación</strong> "✅ Objetivo cumplido".</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-secondary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Bell className="h-5 w-5 text-primary" />
              Notificaciones Inteligentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Las notificaciones web están limitadas por Apple. La solución robusta es usar tu <strong>Calendario</strong>.
            </p>
            <div className="bg-background rounded-lg p-4 text-sm space-y-2 border border-border/50">
              <p>
                Usa los botones de <strong>"Sincronizar Google Calendar"</strong> en la pantalla de Inicio.
              </p>
              <p>
                Cada botón abrirá tu Google Calendar con el evento ya configurado para repetirse diariamente. Solo dale <strong>"Guardar"</strong> y tendrás tus notificaciones listas en todos tus dispositivos.
              </p>
              <ul className="list-disc list-inside pl-2 text-muted-foreground">
                <li>Entrenamiento (6:00 AM - 8:00 AM)</li>
                <li>Comida 1 (2:00 PM - 3:00 PM)</li>
                <li>Comida 2 (8:00 PM - 9:00 PM)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
