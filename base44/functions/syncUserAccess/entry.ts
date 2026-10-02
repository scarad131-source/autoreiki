import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';

// Sincroniza el campo access_active del usuario segun sus compras de Hotmart.
// - Llamado por el workflow "Sincronizar Acceso Hotmart" al registrarse/iniciar sesion
//   (recibe user_id y email en el body).
// - Llamado desde el frontend (sin args) para re-verificar acceso tras comprar;
//   en ese caso usa el usuario autenticado.
export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    let email, userId;
    try {
      const body = await req.json();
      email = (body.email || "").toLowerCase().trim();
      userId = body.user_id;
    } catch (e) {}

    // Sin args (llamada frontend): usar el usuario autenticado
    if (!email || !userId) {
      const me = await base44.auth.me();
      if (!me) return Response.json({ error: "Unauthorized" }, { status: 401 });
      email = (me.email || "").toLowerCase().trim();
      userId = me.id;
    }

    // Acceso activo si existe al menos una compra aprobada y activa para este email
    const purchases = await base44.asServiceRole.entities.HotmartPurchase.filter({ buyer_email: email });
    const hasAccess = Array.isArray(purchases) && purchases.some(
      (p) => p.access_active === true && p.status === "approved"
    );

    await base44.asServiceRole.entities.User.update(userId, { access_active: hasAccess });
    return Response.json({ ok: true, email, access_active: hasAccess });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}