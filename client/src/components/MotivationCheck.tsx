import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Brain, Zap, ShieldAlert } from "lucide-react";
import { getUniqueMotivation } from "@/lib/motivationDb";
import { toast } from "sonner";

export default function MotivationCheck() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTruth, setCurrentTruth] = useState("");

  const handleLowMotivation = () => {
    // Usar el motor de no-repetición
    const uniqueTruth = getUniqueMotivation();
    setCurrentTruth(uniqueTruth);
    setIsOpen(true);
  };

  const handleHighMotivation = () => {
    toast.success("Esa es la actitud.", {
      description: "Mantén el fuego encendido. Nadie te para.",
      duration: 3000,
    });
  };

  return (
    <>
      <div className="bg-card border border-border/40 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Brain className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Estado Mental</span>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button 
            variant="outline" 
            className="h-12 border-primary/20 hover:bg-primary/5 hover:text-primary transition-colors"
            onClick={handleHighMotivation}
          >
            <Zap className="mr-2 h-4 w-4 text-yellow-500" />
            Sólido
          </Button>
          
          <Button 
            variant="destructive" 
            className="h-12 bg-red-50 text-red-600 border-red-100 hover:bg-red-100 hover:border-red-200"
            onClick={handleLowMotivation}
          >
            <ShieldAlert className="mr-2 h-4 w-4" />
            Bajo / Tentado
          </Button>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-sm rounded-2xl border-none bg-destructive text-destructive-foreground">
          <DialogHeader className="space-y-4 text-center pt-6">
            <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-2">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-2xl font-serif font-bold text-white">
              ¡Alto ahí!
            </DialogTitle>
            <DialogDescription className="text-white/90 text-lg font-medium leading-relaxed italic">
              "{currentTruth}"
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center pt-4 pb-2">
            <Button 
              variant="secondary" 
              size="lg" 
              className="w-full font-bold bg-white text-destructive hover:bg-white/90"
              onClick={() => setIsOpen(false)}
            >
              Entendido. Sigo firme.
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
