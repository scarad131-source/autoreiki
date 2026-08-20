import { Zap, Sun, Wind, Droplet, Moon, Circle, AlertCircle } from "lucide-react";

export const SENSATIONS = [
  {
    id: "hormigueo",
    label: "Hormigueo",
    icon: Zap,
    color: "text-primary",
    desc: "Ese cosquilleo es energía que se mueve. Déjala fluir sin aferrarte a ella; solo observa.",
  },
  {
    id: "calor",
    label: "Calor suave",
    icon: Sun,
    color: "text-primary",
    desc: "El calor es señal de apertura. Tu cuerpo se ablanda y confía; quédate ahí un momento.",
  },
  {
    id: "frio",
    label: "Frío o brisa",
    icon: Wind,
    color: "text-glow-cyan",
    desc: "Una brisa fresca también puede ser liberación. No toda quietud es frío emocional.",
  },
  {
    id: "liberacion",
    label: "Liberación emocional",
    icon: Droplet,
    color: "text-purple",
    desc: "Llorar o soltar también es sanar. Honra lo que se va sin juzgarlo.",
  },
  {
    id: "somnolencia",
    label: "Somnolencia",
    icon: Moon,
    color: "text-purple",
    desc: "El sueño profundo es descanso. Si llegaste cansado, recuéstate sin culpa.",
  },
  {
    id: "nada",
    label: "Nada en particular",
    icon: Circle,
    color: "text-muted-foreground",
    desc: "No sentir nada también es válido. A veces el silencio es la respuesta.",
  },
  {
    id: "dolor",
    label: "Dolor persistente",
    icon: AlertCircle,
    color: "text-destructive",
    desc: "Si algo duele, no lo fuerces. Acompáñate con suavidad y, si persiste, escucha a tu cuerpo.",
  },
];

export const sensationMap = Object.fromEntries(SENSATIONS.map((s) => [s.id, s]));