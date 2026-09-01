import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import DiaryTabNav from "@/components/diary/DiaryTabNav";
import NewEntryTab from "@/components/diary/NewEntryTab";
import InterpreterTab from "@/components/diary/InterpreterTab";
import PatternsTab from "@/components/diary/PatternsTab";

export default function Diario() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("nueva");

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-3">
        <button
          onClick={() => navigate("/")}
          className="w-9 h-9 rounded-full flex items-center justify-center text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
          aria-label="Volver"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display text-xl font-semibold">Diario</h1>
      </header>

      <DiaryTabNav active={tab} onChange={setTab} />

      {tab === "nueva" && <NewEntryTab onSaved={() => setTab("patrones")} />}
      {tab === "interprete" && <InterpreterTab />}
      {tab === "patrones" && <PatternsTab />}
    </div>
  );
}