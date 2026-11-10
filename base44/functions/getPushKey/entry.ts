import { createClientFromRequest } from 'npm:@base44/sdk@0.8.54';
import { loadVapidKeys } from '../../shared/webpush.ts';

// Devuelve la clave pública VAPID que el navegador necesita para suscribirse
// a los avisos push. La privada nunca sale del servidor.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me().catch((e) => (e.status === 401 ? null : Promise.reject(e)));
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const keys = await loadVapidKeys(base44);
    if (!keys) return Response.json({ error: 'Sin claves push configuradas' }, { status: 400 });

    return Response.json({ publicKey: keys.public_key });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}