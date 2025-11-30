import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function Reglas() {
  return (
    <div className="space-y-16">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold">Reglas Absolutas</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Estas reglas no son negociables. Son la ley del corral.
        </p>
      </div>

      <div className="grid gap-6 max-w-2xl mx-auto">
        {[
          "Cero alcohol.",
          "Cero refrescos (ni light después de la Fase 1).",
          "Cero pan, tortilla, arroz o pasta.",
          "Cero frituras ni alimentos ultraprocesados.",
          "No se come NADA que no esté en el plan.",
          "Dormir 7+ horas diarias.",
          "Beber 3+ litros de agua diarios (4L en Fase 2).",
          "Si dormiste mal, el plan se ejecuta igual."
        ].map((rule, i) => (
          <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border/40 bg-card hover:border-primary/30 transition-colors">
            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary font-serif font-bold text-lg">
              {i + 1}
            </span>
            <p className="text-lg font-medium">{rule}</p>
          </div>
        ))}
      </div>

      <Separator className="bg-border/40" />

      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif font-bold">Fortaleza Mental</h2>
          <p className="text-muted-foreground">Cómo ganar la batalla contra ti mismo.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="border-none shadow-sm bg-secondary/30">
            <CardHeader>
              <CardTitle className="font-serif">Manejo de Tentaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <blockquote className="pl-4 border-l-2 border-primary italic text-muted-foreground">
                "El antojo dura 10 minutos, el arrepentimiento dura días."
              </blockquote>
              <blockquote className="pl-4 border-l-2 border-primary italic text-muted-foreground">
                "¿Qué quiero más: esto ahora o mi meta el día 22?"
              </blockquote>
              <div className="space-y-2 pt-4">
                <h4 className="font-bold text-sm uppercase tracking-wide">Si caes:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>No conviertas un error en un desastre.</li>
                  <li>La siguiente comida vuelve a ser la del plan.</li>
                  <li>Prohibido pensar "ya valió, retomo el lunes".</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-secondary/30">
            <CardHeader>
              <CardTitle className="font-serif">Energía Mental</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <h4 className="font-bold text-sm uppercase tracking-wide text-red-500">Lo que drena:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Decidir qué comer cada vez.</li>
                  <li>Negociar contigo mismo.</li>
                  <li>Tener comida chatarra accesible.</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-sm uppercase tracking-wide text-green-600">Lo que suma:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Eliminar decisiones (menú fijo).</li>
                  <li>Ambiente limpio (sin tentaciones en casa).</li>
                  <li>Identidad: "Soy alguien disciplinado".</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
