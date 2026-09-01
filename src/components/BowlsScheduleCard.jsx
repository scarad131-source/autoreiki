import { CircleDot, Minus } from "lucide-react";
import { CHAKRAS } from "@/lib/guidedScripts";
import { AUDIO_SOURCES } from "@/lib/audioSources";

const VIOLET = "#6A5ACD";
const INK = "#26212E";
const BORDER = "#DED5C5";
const CREAM = "#F9F4E8";

export default function BowlsScheduleCard({ minutes, selected, audio, bowlsMarkers }) {
  const count = selected.length || 1;
  const ambienteNombre = (AUDIO_SOURCES[audio] && AUDIO_SOURCES[audio].name) || "Ambiente";

  // Distribuye los minutos de forma que la suma de todas las zonas coincida
  // exactamente con la duración total elegida por el usuario.
  const base = Math.floor(minutes / count);
  const remainder = minutes - base * count;

  const items = selected.map((id, i) => {
    const c = CHAKRAS.find((x) => x.id === id);
    return {
      num: String(i + 1).padStart(2, "0"),
      name: c ? c.name : id,
      freq: c ? c.freq : null,
      min: String(i < remainder ? base + 1 : base)
    };
  });

  return (
    <div
      className="rounded-2xl p-4 flex flex-col"
      style={{ background: CREAM, border: `1px solid ${BORDER}`, color: INK }}
    >
      {/* Header */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: VIOLET }}>
        Tus cuencos
      </p>
      <h3
        className="font-bold leading-tight text-xl mt-1"
        style={{ color: INK, fontFamily: "'Cormorant Garamond', serif" }}
      >
        Cuencos tibetanos
      </h3>
      <div className="my-3" style={{ borderTop: `1px solid ${BORDER}` }} />

      {/* Duration */}
      <div className="flex items-end gap-2">
        <span
          className="font-bold text-4xl leading-none"
          style={{ color: INK, fontFamily: "'Cormorant Garamond', serif" }}
        >
          {minutes}
        </span>
        <div className="flex flex-col leading-tight pb-0.5">
          <span className="text-[11px] font-medium" style={{ color: INK }}>minutos de práctica</span>
          <span className="text-[10px]" style={{ color: "#8A8294" }}>+ 5 de preparación</span>
        </div>
      </div>
      <div className="my-3" style={{ borderTop: `1px solid ${BORDER}` }} />

      {/* Ambiente elegido pill */}
      <div
        className="flex items-center gap-2.5 rounded-full px-3 py-2"
        style={{ background: "linear-gradient(90deg,#F3F0FF,#ECE6FF)" }}
      >
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: VIOLET }}
        >
          <CircleDot className="w-4 h-4 text-white" />
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-[9px] font-medium uppercase tracking-wide" style={{ color: VIOLET }}>Ambiente elegido</p>
          <p className="text-[12px] font-bold truncate" style={{ color: INK }}>{ambienteNombre}</p>
        </div>
      </div>

      {/* List */}
      <div className="mt-3 space-y-1.5">
        {items.map((it) => (
          <div key={it.num} className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-2 min-w-0">
              <span className="font-semibold tabular-nums" style={{ color: VIOLET }}>{it.num}</span>
              <span className="font-medium truncate" style={{ color: INK }}>{it.name}</span>
            </span>
            <span className="flex items-center gap-1.5 shrink-0" style={{ color: INK }}>
              <Minus className="w-3 h-3" style={{ color: BORDER }} />
              <span className="font-medium tabular-nums">{it.min} min</span>
            </span>
          </div>
        ))}
      </div>

      {/* Footnote */}
      <p className="mt-3 text-[10px] leading-snug" style={{ color: "#8A8294" }}>
        {bowlsMarkers
          ? "Los cuencos marcarán el cambio de cada zona con un toque suave."
          : "Activa los marcadores con cuencos para escuchar el cambio de zona."}
      </p>
    </div>
  );
}