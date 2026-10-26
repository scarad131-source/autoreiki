import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction } from
"@/components/ui/alert-dialog";

// Reinicia el seguimiento del reto: borra los días marcados del recorrido para
// que el contador vuelva a empezar desde el día 1. Las sesiones y las entradas
// del diario se conservan.
export default function ResetJourneyButton({ onReset }) {
  const [resetting, setResetting] = useState(false);

  const handleReset = async () => {
    setResetting(true);
    try {
      const entries = await base44.entities.JourneyProgress.list("-created_date", 100);
      await Promise.all(entries.map((e) => base44.entities.JourneyProgress.delete(e.id)));
      onReset();
    } finally {
      setResetting(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button
          type="button"
          className="w-full rounded-full border border-primary/40 bg-primary/10 text-primary font-body font-semibold py-3 flex items-center justify-center gap-2 transition-colors hover:bg-primary/20 active:scale-[0.99]">

          <RotateCcw className="w-4 h-4" />
          Reiniciar reto
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-sm rounded-3xl">
        <AlertDialogHeader>
          <AlertDialogTitle>¿Reiniciar el reto de 21 días?</AlertDialogTitle>
          <AlertDialogDescription>
            Tu contador de días vuelve a cero para empezar un seguimiento nuevo.
            Tus sesiones y entradas del diario se conservan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row gap-2">
          <AlertDialogCancel className="mt-0">Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={handleReset} disabled={resetting}>
            {resetting ? "Reiniciando…" : "Reiniciar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>);

}