import webpush from 'npm:web-push@3.6.7';

// Web Push estándar (W3C): el aviso lo entrega el servicio push del navegador,
// así que llega al teléfono aunque la app esté cerrada.
const SUBJECT = 'https://reiki-flow-guide.com';

export async function loadVapidKeys(base44) {
  const records = await base44.asServiceRole.entities.PushKey.list('-created_date', 1);
  return records[0] || null;
}

// Envía un aviso a todos los dispositivos suscritos de un usuario.
// Devuelve cuántos se entregaron y borra las suscripciones caducadas.
export async function sendToUser(base44, userId, payload) {
  const keys = await loadVapidKeys(base44);
  if (!keys || !userId) return 0;

  webpush.setVapidDetails(SUBJECT, keys.public_key, keys.private_key);

  const subscriptions = await base44.asServiceRole.entities.PushSubscription.filter(
    { created_by_id: userId },
    { limit: 20 }
  );
  const items = subscriptions.items || subscriptions || [];

  let sent = 0;
  for (const sub of items) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify(payload),
        { TTL: 3600, urgency: 'high' }
      );
      sent++;
    } catch (error) {
      const status = error && (error.statusCode || error.status);
      // 404 / 410: el dispositivo ya no acepta avisos (app desinstalada o permiso retirado).
      if (status === 404 || status === 410) {
        await base44.asServiceRole.entities.PushSubscription.delete(sub.id).catch(() => {});
      }
    }
  }
  return sent;
}