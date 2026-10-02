import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Verifica si un correo tiene una compra activa en Hotmart y si ya existe una
// cuenta de usuario con ese correo. Es llamado desde la pantalla de Login
// (antes de autenticar) para enrutar al comprador hacia Login o Register.
//
// Devuelve únicamente { authorized: boolean, hasAccount: boolean }.
// No expone datos de HotmartPurchase (transaction ID, estado, producto),
// ni información personal de usuarios. Los dos booleanos son suficientes
// para que el frontend decija a qué pantalla ir, sin filtrar nada más.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let email = "";
    try {
      const body = await req.json();
      email = (body.email || "").toLowerCase().trim();
    } catch (e) {}

    // Validación mínima de formato para evitar consultas sin sentido.
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return Response.json({ authorized: false, hasAccount: false });
    }

    // Compra activa: access_active === true y status === "approved".
    // Un reembolso/chargeback pone access_active en false, así que no autoriza.
    const purchases = await base44.asServiceRole.entities.HotmartPurchase.filter({ buyer_email: email });
    const authorized = Array.isArray(purchases) && purchases.some(
      (p) => p.access_active === true && p.status === "approved"
    );

    // ¿Existe ya una cuenta de usuario con ese correo? (para enrutar a Login
    // en lugar de Register y evitar crear duplicados)
    const users = await base44.asServiceRole.entities.User.list("-created_date", 500);
    const hasAccount = Array.isArray(users) && users.some(
      (u) => (u.email || "").toLowerCase() === email
    );

    return Response.json({ authorized, hasAccount });
  } catch (error) {
    // En cualquier fallo, no autoriza: el acceso se decide en backend.
    return Response.json({ authorized: false, hasAccount: false });
  }
}