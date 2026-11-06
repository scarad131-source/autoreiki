import { useRef, useState } from "react";
import { ArrowDown, Loader2 } from "lucide-react";

const THRESHOLD = 64;
const MAX = 96;

// Gesto de "deslizar para actualizar" para listas que usan el scroll de la
// página. Solo se activa cuando la página está arriba del todo, así no roza
// con el header fijo ni con la barra inferior.
export default function PullToRefresh({ onRefresh, children, className = "" }) {
  const [pull, setPull] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);

  const handleStart = (e) => {
    if (refreshing || window.scrollY > 0) return;
    startY.current = e.touches[0].clientY;
    setDragging(true);
  };

  const handleMove = (e) => {
    if (startY.current == null || refreshing) return;
    const dy = e.touches[0].clientY - startY.current;
    if (dy <= 0 || window.scrollY > 0) {
      startY.current = null;
      setPull(0);
      return;
    }
    // Resistencia: el indicador avanza más despacio que el dedo.
    setPull(Math.min(MAX, dy * 0.5));
  };

  const handleEnd = async () => {
    if (startY.current == null) {
      setDragging(false);
      return;
    }
    startY.current = null;
    setDragging(false);
    if (pull < THRESHOLD) {
      setPull(0);
      return;
    }
    setRefreshing(true);
    setPull(THRESHOLD);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
      setPull(0);
    }
  };

  const ready = pull >= THRESHOLD;

  return (
    <div
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onTouchCancel={handleEnd}
      className={className}
    >
      <div
        className="overflow-hidden flex items-end justify-center"
        style={{
          height: pull,
          transition: dragging ? "none" : "height 180ms ease-out",
        }}
      >
        <div className="flex flex-col items-center gap-1 pb-2">
          {refreshing ? (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          ) : (
            <ArrowDown
              className={`w-4 h-4 text-primary transition-transform duration-200 ${
                ready ? "rotate-180" : ""
              }`}
            />
          )}
          <span className="text-[11px] leading-none text-muted-foreground">
            {refreshing ? "Actualizando..." : ready ? "Suelta para actualizar" : "Desliza para actualizar"}
          </span>
        </div>
      </div>

      {children}
    </div>
  );
}