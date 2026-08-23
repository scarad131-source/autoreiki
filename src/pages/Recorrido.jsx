import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { JOURNEY, computeActiveDays } from "@/lib/journey";
import { Check } from "lucide-react";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

export default function Recorrido() {
  const navigate = useNavigate();
  const [progressCount, setProgressCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [sessions, diary, prog] = await Promise.all([
        base44.entities.MeditationSession.list("-created_date", 100),
        base44.entities.DiaryEntry.list("-created_date", 100),
        base44.entities.JourneyProgress.list("-created_date", 100)]
        );
        const days = computeActiveDays(sessions, diary, prog);
        setProgressCount(Math.min(days.size, 21));
      } catch (e) {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const startDay = (day) => {
    navigate("/meditar", { state: { preset: { ...day.config, journeyDay: day.day } } });
  };

  return null;





















































}