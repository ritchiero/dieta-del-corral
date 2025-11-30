import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Utensils, AlertCircle } from "lucide-react";

export default function Plan() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold">El Plan de Alimentación</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          La nutrición es la base. La estructura está diseñada para maximizar la quema de grasa y minimizar la toma de decisiones.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-none shadow-sm bg-secondary/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif">
              <Clock className="h-5 w-5 text-primary" />
              Estructura Base
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">Ayuno Intermitente (18:6)</h3>
              <p className="text-sm text-muted-foreground">
                No se come nada desde las 8:00 PM hasta las 2:00 PM del día siguiente.
              </p>
            </div>
            <Separator className="bg-border/50" />
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Comida 1</span>
                  <p className="font-serif text-xl mt-1">2:00 PM - 3:00 PM</p>
                </div>
                <ul className="text-sm text-right space-y-1 text-muted-foreground">
                  <li>5 huevos revueltos</li>
                  <li>1 taza de frijoles negros</li>
                  <li>Verduras al gusto</li>
                </ul>
              </div>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">Comida 2</span>
                  <p className="font-serif text-xl mt-1">7:00 PM - 8:00 PM</p>
                </div>
                <ul className="text-sm text-right space-y-1 text-muted-foreground">
                  <li>350-400g pollo asado</li>
                  <li>1 taza de frijoles negros</li>
                  <li>Verduras al gusto</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="font-serif">Fases del Proceso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative pl-6 border-l-2 border-primary/20 pb-6 last:pb-0">
                <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-primary" />
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Fase 1: Semanas 1-2</h4>
                <p className="text-sm text-muted-foreground mb-2">30 Nov - 13 Dic</p>
                <p className="text-sm">Menú completo con frijoles. 1 comida libre por semana (opcional).</p>
              </div>
              <div className="relative pl-6 border-l-2 border-primary/20 pb-6 last:pb-0">
                <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-primary" />
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Fase 2: Semana 3</h4>
                <p className="text-sm text-muted-foreground mb-2">14 Dic - 20 Dic</p>
                <p className="text-sm font-medium text-primary">Eliminar frijoles.</p>
                <p className="text-sm">Solo proteína + verduras. 4L de agua. Cero licencias.</p>
              </div>
              <div className="relative pl-6 border-l-2 border-primary/20 last:pb-0">
                <div className="absolute -left-[5px] top-0 h-2.5 w-2.5 rounded-full bg-primary" />
                <h4 className="font-bold text-sm uppercase tracking-wide mb-1">Fase 3: Final</h4>
                <p className="text-sm text-muted-foreground mb-2">21 Dic - 22 Dic</p>
                <p className="text-sm">Reducir agua a 1.5L. Comer ligero y bajo en sodio.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
            <span className="text-green-600">✅</span> Permitidos
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-600" />Tabasco, Valentina (moderada)</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-600" />Limón, Sal, Pimienta, Ajo, Especias</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-600" />Salsa verde/roja casera (sin azúcar)</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-600" />Café negro, Té sin azúcar</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-green-600" />Refrescos light (Máx 1/día en Fase 1)</li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-serif text-2xl font-bold flex items-center gap-2">
            <span className="text-red-600">❌</span> Prohibidos
          </h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-red-600" />Chamoy</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-red-600" />Salsas comerciales con azúcar</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-red-600" />Aderezos cremosos</li>
            <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-red-600" />Alcohol (Absolutamente prohibido)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
