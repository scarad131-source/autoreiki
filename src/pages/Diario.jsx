import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import DiaryTabNav from "@/components/diary/DiaryTabNav";
import NewEntryTab from "@/components/diary/NewEntryTab";
import InterpreterTab from "@/components/diary/InterpreterTab";
import PatternsTab from "@/components/diary/PatternsTab";

export default function Diario() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("nueva");
  const [entries, setEntries] = useState([]);
  const [entriesLoaded, setEntriesLoaded] = useState(false);

  const refreshEntries = useCallback(async () => {
    try {
      const list = await base44.entities.DiaryEntry.list("-created_date", 100);
      setEntries(list);
    } catch (e) {}
    setEntriesLoaded(true);
  }, []);

  useEffect(() => {
    refreshEntries();
  }, [refreshEntries]);

  const handleSaved = useCallback(() => {
    refreshEntries();
    setTab("patrones");
  }, [refreshEntries]);

  return (
    <div className="space-y-6">
      <header className="relative flex items-center justify-center min-h-[2.75rem]">
        <button
          onClick={() => navigate("/")}
          className="absolute left-0 px-3 py-1.5 rounded-full text-sm text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          aria-label="Volver"
        >
          Volver
        </button>
        {/* Título centrado y destacado (el ! mantiene el tamaño en móvil,
            donde la compactación global reduce los h1). */}
        <h1 className="font-display !text-3xl font-semibold text-center neon-text">Diario</h1>
      </header>

      <DiaryTabNav active={tab} onChange={setTab} />

      {tab === "nueva" && <NewEntryTab onSaved={handleSaved} />}
      {tab === "interprete" && <InterpreterTab />}
      {tab === "patrones" && <PatternsTab entries={entries} loaded={entriesLoaded} />}
    </div>
  );
}