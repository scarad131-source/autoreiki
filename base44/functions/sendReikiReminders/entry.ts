import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Frases de aliento y motivación para rotar en cada recordatorio.
const PHRASES = [
  "Cada respiración te acerca a tu centro. Sigue adelante.",
  "Tu práctica de hoy es un regalo para tu cuerpo y tu alma.",
  "La constancia transforma. Un día más, un paso más profundo.",
  "Mereces este momento de calma. Honra tu compromiso.",
  "La energía fluye donde pones tu intención. Sigue practicando.",
  "Cada sesión es una semilla que florece con el tiempo.",
  "Tu luz interior brilla más con cada práctica. No te detengas.",
  "El equilibrio se cultiva día a día. Hoy es tu día.",
  "Confía en el proceso. Tu dedicación te transforma.",
  "Respira, suelta, avanza. Tu camino sagrado continúa.",
  "Pequeños pasos diarios construyen grandes cambios.",
  "Tu bienestar es una prioridad. Hoy te eliges a ti.",
];

function pickPhrase(now) {
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  return PHRASES[dayOfYear % PHRASES.length];
}

// Envía una notificación push y/o email a cada usuario con recordatorio activo
// cuya hora local (en su zona horaria) coincide con la ventana de 15 min actual.
// Pensado para ejecutarse desde un workflow programado cada 15 minutos.
// Solo el propietario (admin) puede invocarla: el programador de la plataforma
// ejecuta con la identidad del propietario; las llamadas HTTP directas sin
// autenticación de admin se rechazan con 403.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const caller = await base44.auth.me();
    if (!caller || caller.role !== 'admin') {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const now = new Date();
    const phrase = pickPhrase(now);
    const users = await base44.asServiceRole.entities.User.list("-created_date", 500);
    let sent = 0;
    let checked = 0;

    for (const u of users) {
      if (!u.reminder_enabled || !u.reminder_time) continue;
      const tz = u.reminder_timezone || "UTC";
      try {
        const parts = new Intl.DateTimeFormat("en-GB", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(now);
        const [h, m] = parts.split(":").map(Number);
        const slotMin = Math.floor(m / 15) * 15;
        const currentSlot = `${String(h).padStart(2, "0")}:${String(slotMin).padStart(2, "0")}`;
        if (currentSlot !== u.reminder_time) continue;

        checked++;
        const firstName = u.preferred_name || (u.full_name ? u.full_name.split(" ")[0] : "");

        // Email: llega al móvil (app de correo) sin requerir build nativo.
        let delivered = false;
        if (u.email) {
          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: u.email,
              subject: "Es hora de tu Reiki ✦",
              html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#1a0f2e;font-family:'Mulish',Arial,sans-serif;"><div style="max-width:480px;margin:0 auto;padding:32px 24px;color:#f3e8ff;"><h1 style="font-family:Georgia,serif;font-size:26px;color:#d4a73a;text-align:center;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">Auto-Reiki</h1><p style="text-align:center;color:#c4b5fd;font-size:15px;margin:0 0 28px;">Es hora de volver a ti</p><p style="font-size:16px;line-height:1.6;color:#e9d5ff;">Hola${firstName ? " " + firstName : ""},</p><p style="font-size:16px;line-height:1.6;color:#e9d5ff;">Tu sesión diaria de Reiki te espera. Tómate unos minutos para reconectar, respirar y nutrir tu práctica.</p><div style="margin:24px 0;padding:16px 20px;border-left:3px solid #d4a73a;background:rgba(212,167,58,0.08);border-radius:8px;"><p style="font-size:15px;line-height:1.6;color:#e9d5ff;font-style:italic;margin:0;">${phrase}</p></div><p style="font-size:15px;line-height:1.6;color:#c4b5fd;">Cada día suma en tu recorrido de 21 días. Mantén tu racha sagrada.</p><div style="text-align:center;margin:32px 0;"><a href="https://reiki-flow-guide.base44.app" style="display:inline-block;padding:14px 36px;background:linear-gradient(90deg,#e8b85a,#d4a73a);color:#1a0f2e;font-weight:600;border-radius:50px;text-decoration:none;font-size:15px;">Meditar ahora</a></div><p style="font-size:12px;color:#7c6f99;text-align:center;">Si ya meditaste hoy, ignora este mensaje. ✦</p></div></body></html>`,
            });
            delivered = true;
          } catch (e) {}
        }

        // Push: requiere build nativo con credenciales push configuradas.
        try {
          await base44.asServiceRole.integrations.Core.SendPushNotification({
            user_id: u.id,
            title: "Es hora de tu Reiki",
            content: `Tu sesión diaria te espera. ${phrase}`,
            action_label: "Meditar ahora",
            action_url: "/",
          });
          delivered = true;
        } catch (e) {}

        if (delivered) sent++;
      } catch (e) {
        // usuario individual fallido: continúa con el resto
      }
    }

    return Response.json({ sent, checked, total: users.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}