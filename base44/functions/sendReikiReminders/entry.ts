import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Token compartido que autoriza la invocación de esta función programada.
// El workflow lo envía en el cuerpo; las llamadas HTTP directas sin él se rechazan.
const EXPECTED_TOKEN = "rk_r3m1nd3r_7f9c2e1a8b";

// Envía una notificación push a cada usuario con recordatorio activo cuya
// hora local (en su zona horaria) coincide con la ventana de 15 min actual.
// Pensado para ejecutarse desde un workflow programado cada 15 minutos.
export default async function(req) {
  try {
    let token;
    try {
      const body = await req.json();
      token = body && body.token;
    } catch (e) {}
    if (!token) token = req.headers.get("x-reminder-token");
    if (token !== EXPECTED_TOKEN) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);
    const users = await base44.asServiceRole.entities.User.list("-created_date", 500);
    const now = new Date();
    let sent = 0;
    let checked = 0;

    for (const u of users) {
      if (!u.reminder_enabled || !u.reminder_time) continue;
      checked++;
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

        const firstName = u.preferred_name || (u.full_name ? u.full_name.split(" ")[0] : "");

        // Email: llega al móvil (app de correo) sin requerir build nativo.
        let delivered = false;
        if (u.email) {
          try {
            await base44.asServiceRole.integrations.Core.SendEmail({
              to: u.email,
              subject: "Es hora de tu Reiki ✦",
              html: `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#1a0f2e;font-family:'Mulish',Arial,sans-serif;"><div style="max-width:480px;margin:0 auto;padding:32px 24px;color:#f3e8ff;"><h1 style="font-family:Georgia,serif;font-size:26px;color:#d4a73a;text-align:center;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">Auto-Reiki</h1><p style="text-align:center;color:#c4b5fd;font-size:15px;margin:0 0 28px;">Es hora de volver a ti</p><p style="font-size:16px;line-height:1.6;color:#e9d5ff;">Hola${firstName ? " " + firstName : ""},</p><p style="font-size:16px;line-height:1.6;color:#e9d5ff;">Tu sesión diaria de Reiki te espera. Tómate unos minutos para reconectar, respirar y nutrir tu práctica.</p><p style="font-size:15px;line-height:1.6;color:#c4b5fd;">Cada día suma en tu recorrido de 21 días. Mantén tu racha sagrada.</p><div style="text-align:center;margin:32px 0;"><a href="https://reiki-flow-guide.base44.app" style="display:inline-block;padding:14px 36px;background:linear-gradient(90deg,#e8b85a,#d4a73a);color:#1a0f2e;font-weight:600;border-radius:50px;text-decoration:none;font-size:15px;">Meditar ahora</a></div><p style="font-size:12px;color:#7c6f99;text-align:center;">Si ya meditaste hoy, ignora este mensaje. ✦</p></div></body></html>`,
            });
            delivered = true;
          } catch (e) {}
        }

        // Push: requiere build nativo con credenciales push configuradas.
        try {
          await base44.asServiceRole.integrations.Core.SendPushNotification({
            user_id: u.id,
            title: "Es hora de tu Reiki",
            content: "Tu sesión diaria te espera. Tómate unos minutos para reconectar.",
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