import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";

// Selector móvil: en lugar del <select> nativo abre una hoja inferior (Vaul)
// con las mismas opciones. Mantiene la misma API de value / onChange.
export default function BottomSheetSelect({
  label,
  value,
  options = [],
  onChange,
  placeholder = "Selecciona una opción",
  triggerClassName,
}) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={cn(
          "w-full min-h-[44px] flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl bg-accent/40 border border-white/10 text-sm text-left outline-none focus:border-primary/50 active:scale-[0.995] transition-transform",
          triggerClassName
        )}
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected?.label || placeholder}
        </span>
        <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
      </button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="max-w-md mx-auto rounded-t-3xl border-primary/40 bg-[hsl(265_50%_14%)] backdrop-blur-[10px] shadow-[0_0_30px_hsl(var(--gold)/0.28),0_18px_45px_rgba(0,0,0,0.55)]">
          <DrawerHeader className="p-4 pb-2 text-center">
            <DrawerTitle className="font-display text-xl font-semibold text-foreground">
              {label}
            </DrawerTitle>
            <DrawerDescription className="text-[11px] uppercase tracking-[0.18em] text-primary">
              Elige una opción
            </DrawerDescription>
          </DrawerHeader>

          <div
            role="listbox"
            className="max-h-[55vh] overflow-y-auto px-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] space-y-1.5"
          >
            {options.map((o) => {
              const active = o.value === value;
              return (
                <button
                  key={o.value}
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange?.(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full min-h-[44px] flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left text-sm transition-colors",
                    active
                      ? "border-primary bg-primary/15 text-primary neon-glow"
                      : "border-white/10 bg-card/60 text-foreground/85 hover:border-primary/50"
                  )}
                >
                  <span>{o.label}</span>
                  {active && <Check className="w-4 h-4 shrink-0" />}
                </button>
              );
            })}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}