// Utilidades de síntesis de voz (SpeechSynthesis API) para meditaciones guiadas.
// Algunos navegadores requieren un gesto de usuario y un "calentamiento" previo
// para que la voz comience a funcionar de forma fiable.

let cachedVoices = [];

function loadVoices() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const v = window.speechSynthesis.getVoices();
  if (v && v.length) cachedVoices = v;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = () => loadVoices();
}

function pickFemaleEsVoice() {
  const pool = cachedVoices.filter((v) => v.lang && v.lang.toLowerCase().startsWith("es"));
  const list = pool.length ? pool : cachedVoices;
  if (!list.length) return null;
  const female = list.find((v) =>
    /female|mujer|femenino|helena|laura|monic|paulina|sabina|marisol|lucia|soledad|esperanza|carmen|elvira|victoria|lorena|isabel/i.test(v.name)
  );
  return female || list[0];
}

let speechUnlocked = false;

// Llamar dentro de un gesto de usuario (clic en "Comenzar") para activar el motor
// de síntesis en navegadores que lo exigen.
export function unlockSpeech() {
  if (speechUnlocked || typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    u.lang = "es-ES";
    window.speechSynthesis.speak(u);
    speechUnlocked = true;
  } catch (e) {}
}

export function speak(text) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  unlockSpeech();
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "es-ES";
  u.rate = 0.58;
  u.pitch = 0.98;
  const v = pickFemaleEsVoice();
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
  // Chrome a veces deja el motor en pausa tras cancelar
  window.speechSynthesis.resume();
}

export function cancelSpeech() {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export const COUNTDOWN_WORDS = { 3: "tres", 2: "dos", 1: "uno" };