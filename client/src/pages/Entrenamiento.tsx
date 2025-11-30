import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function Entrenamiento() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold">Entrenamiento</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Horario: 6:00 AM - 8:00 AM. No se piensa, solo se hace.
        </p>
      </div>

      <Tabs defaultValue="lunes" className="w-full">
        <div className="flex justify-center mb-8">
          <TabsList className="grid w-full max-w-md grid-cols-4 bg-secondary/50">
            <TabsTrigger value="lunes">Lun</TabsTrigger>
            <TabsTrigger value="martes">Mar</TabsTrigger>
            <TabsTrigger value="jueves">Jue</TabsTrigger>
            <TabsTrigger value="viernes">Vie</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="lunes" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-serif font-bold">Lunes: Pecho y Tríceps</h2>
            <p className="text-sm text-muted-foreground">Enfoque en fuerza y volumen</p>
          </div>
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-0">
              <img 
                src="/IMG_8458.JPG" 
                alt="Rutina de Lunes" 
                className="w-full h-auto object-cover"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="martes" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-serif font-bold">Martes: Espalda y Bíceps</h2>
            <p className="text-sm text-muted-foreground">Construcción de amplitud</p>
          </div>
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-0">
              <img 
                src="/IMG_8467.JPG" 
                alt="Rutina de Martes" 
                className="w-full h-auto object-cover"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jueves" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-serif font-bold">Jueves: Pierna</h2>
            <p className="text-sm text-muted-foreground">La base del poder</p>
          </div>
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-0">
              <img 
                src="/IMG_8465.JPG" 
                alt="Rutina de Jueves" 
                className="w-full h-auto object-cover"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="viernes" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-serif font-bold">Viernes: Hombro y Core</h2>
            <p className="text-sm text-muted-foreground">Estética y estabilidad</p>
          </div>
          <Card className="overflow-hidden border-none shadow-lg">
            <CardContent className="p-0">
              <img 
                src="/IMG_8469.JPG" 
                alt="Rutina de Viernes" 
                className="w-full h-auto object-cover"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-border/40">
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold">Cardio</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">Miércoles:</span>
              Obligatorio (40 min caminata)
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">Sábado:</span>
              Cardio o descanso activo
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">Modalidad:</span>
              Caminata rápida (caminadora o calle)
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="font-serif text-xl font-bold">Descanso</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">Domingo:</span>
              Descanso total + Meal Prep
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-primary">Sueño:</span>
              7+ horas diarias (No negociable)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
