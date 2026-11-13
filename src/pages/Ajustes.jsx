import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import PersonalizationCard from "@/components/PersonalizationCard";
import ReminderSettings from "@/components/ReminderSettings";
import InstallAppButton from "@/components/InstallAppButton";
import DeleteAccountButton from "@/components/DeleteAccountButton";

// Pantalla de ajustes pensada para el teléfono: todo lo configurable de la app
// (nombre y nivel, recordatorio diario, avisos con la app cerrada, instalación
// y cuenta) en un solo lugar accesible desde la sección "Más".
export default function Ajustes() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setUser(await base44.auth.me());
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const refreshUser = async () => {
    try {
      setUser(await base44.auth.me());
    } catch (e) {}
  };

  return (
    <div className="flex flex-col gap-6 pt-2">
      <header className="text-center">
        <p className="text-[11px] tracking-[0.28em] uppercase text-muted-foreground font-medium">
          Configuración
        </p>
        <h1 className="font-display !text-3xl font-semibold tracking-tight mt-1.5 neon-text">Ajustes</h1>
        <p className="text-sm text-muted-foreground mt-2 leading-relaxed max-w-sm mx-auto">
          Tu nombre, tu recordatorio diario y los avisos del teléfono.
        </p>
      </header>

      {loading && (
        <>
          <div className="h-56 rounded-3xl border border-white/10 bg-card/50 animate-pulse" />
          <div className="h-24 rounded-3xl border border-white/10 bg-card/50 animate-pulse" />
        </>
      )}

      {!loading && user && (
        <>
          <PersonalizationCard user={user} onSaved={refreshUser} variant="settings" />
          <ReminderSettings user={user} onSaved={refreshUser} />
        </>
      )}

      {!loading && !user && (
        <p className="text-center text-sm text-muted-foreground">
          No pudimos cargar tu perfil. Vuelve a abrir la pantalla en un momento.
        </p>
      )}

      <section className="rounded-3xl border border-glow/20 bg-card/50 p-5 flex flex-col items-center gap-4 text-center">
        <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">Aplicación</p>
        <InstallAppButton />
        <DeleteAccountButton />
      </section>
    </div>
  );
}