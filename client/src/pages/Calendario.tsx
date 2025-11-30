import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Calendario() {
  const days = [
    { day: 1, date: "Sáb 30 Nov", train: "Cardio", notes: "INICIA EL CORRAL", phase: 1 },
    { day: 2, date: "Dom 1 Dic", train: "Descanso", notes: "Meal prep semanal", phase: 1 },
    { day: 3, date: "Lun 2 Dic", train: "Pecho/Tríceps", notes: "", phase: 1 },
    { day: 4, date: "Mar 3 Dic", train: "Espalda/Bíceps", notes: "", phase: 1 },
    { day: 5, date: "Mié 4 Dic", train: "Cardio", notes: "", phase: 1 },
    { day: 6, date: "Jue 5 Dic", train: "Pierna", notes: "", phase: 1 },
    { day: 7, date: "Vie 6 Dic", train: "Hombro/Core", notes: "", phase: 1 },
    { day: 8, date: "Sáb 7 Dic", train: "Cardio", notes: "", phase: 1 },
    { day: 9, date: "Dom 8 Dic", train: "Descanso", notes: "Meal prep semanal", phase: 1 },
    { day: 10, date: "Lun 9 Dic", train: "Pecho/Tríceps", notes: "", phase: 1 },
    { day: 11, date: "Mar 10 Dic", train: "Espalda/Bíceps", notes: "", phase: 1 },
    { day: 12, date: "Mié 11 Dic", train: "Cardio", notes: "", phase: 1 },
    { day: 13, date: "Jue 12 Dic", train: "Pierna", notes: "", phase: 1 },
    { day: 14, date: "Vie 13 Dic", train: "Hombro/Core", notes: "Último día con frijoles", phase: 1 },
    { day: 15, date: "Sáb 14 Dic", train: "Cardio", notes: "INICIA FASE 2 (SIN FRIJOLES)", phase: 2 },
    { day: 16, date: "Dom 15 Dic", train: "Descanso", notes: "Meal prep (solo pollo/huevo/verduras)", phase: 2 },
    { day: 17, date: "Lun 16 Dic", train: "Pecho/Tríceps", notes: "4 litros de agua", phase: 2 },
    { day: 18, date: "Mar 17 Dic", train: "Espalda/Bíceps", notes: "", phase: 2 },
    { day: 19, date: "Mié 18 Dic", train: "Cardio", notes: "", phase: 2 },
    { day: 20, date: "Jue 19 Dic", train: "Pierna", notes: "", phase: 2 },
    { day: 21, date: "Vie 20 Dic", train: "Hombro/Core", notes: "Reducir sodio", phase: 2 },
    { day: 22, date: "Sáb 21 Dic", train: "Cardio Ligero", notes: "INICIA FASE 3 (Agua a 1.5L)", phase: 3 },
    { day: "FIN", date: "Dom 22 Dic", train: "—", notes: "OBJETIVO CUMPLIDO 🎯", phase: 3 },
  ];

  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-serif font-bold">Calendario de 22 Días</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Cada día cuenta. Marca tu progreso.
        </p>
      </div>

      <div className="rounded-md border border-border/40 overflow-hidden">
        <Table>
          <TableHeader className="bg-secondary/30">
            <TableRow>
              <TableHead className="w-[80px] text-center font-bold">Día</TableHead>
              <TableHead className="w-[120px]">Fecha</TableHead>
              <TableHead>Entrenamiento</TableHead>
              <TableHead className="text-right">Notas</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {days.map((day, index) => (
              <TableRow key={index} className={day.phase === 2 ? "bg-primary/5" : ""}>
                <TableCell className="text-center font-medium font-serif text-lg">
                  {day.day}
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">{day.date}</TableCell>
                <TableCell className="font-medium">{day.train}</TableCell>
                <TableCell className="text-right">
                  {day.notes && (
                    <Badge variant="outline" className="font-normal text-xs border-primary/30 text-primary">
                      {day.notes}
                    </Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
