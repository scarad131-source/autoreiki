import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import DiaryPatterns from "@/components/DiaryPatterns";
import DiaryEntryCard from "@/components/DiaryEntryCard";

export default function DiaryHistory() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const list = await base44.entities.DiaryEntry.list("-created_date", 100);
        setEntries(list);
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="h-24 rounded-2xl bg-card/60 animate-pulse" />;
  if (!entries.length)
    return (
      <p className="text-sm text-muted-foreground text-center py-10">
        Aún no hay entradas. Cuando escribas la primera, aparecerá aquí.
      </p>
    );

  return (
    <div className="space-y-6">
      <DiaryPatterns entries={entries} />
      <div className="space-y-3">
        {entries.map((e) => (
          <DiaryEntryCard key={e.id} entry={e} />
        ))}
      </div>
    </div>
  );
}