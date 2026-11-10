import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { sendToUser } from '../../shared/webpush.ts';

// Envía un aviso de prueba a los dispositivos del propio usuario, para que
// compruebe que el recordatorio llega con la app cerrada.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const sent = await sendToUser(base44, user.id, {
      title: 'AutoReiki ✦',
      body: 'Así llegará tu recordatorio, aunque la app esté cerrada.',
      url: '/',
    });

    return Response.json({ sent });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}