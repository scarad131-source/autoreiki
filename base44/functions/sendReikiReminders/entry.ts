import { createClientFromRequest } from 'npm:@base44/sdk@0.8.40';

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

        await base44.asServiceRole.integrations.Core.SendPushNotification({
          user_id: u.id,
          title: "Es hora de tu Reiki",
          content: "Tu sesión diaria te espera. Tómate unos minutos para reconectar.",
          action_label: "Meditar ahora",
          action_url: "/",
        });
        sent++;
      } catch (e) {
        // usuario individual fallido: continúa con el resto
      }
    }

    return Response.json({ sent, checked, total: users.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}