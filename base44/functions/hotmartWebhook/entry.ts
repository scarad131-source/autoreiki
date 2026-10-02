import { createClientFromRequest } from 'npm:@base44/sdk@0.8.52';
import { secrets } from 'base44:runtime';

// Endpoint publico de webhook para Hotmart.
// URL: https://reiki-flow-guide.base44.app/functions/hotmartWebhook
//
// Valida cada peticion con el header X-HOTMART-HOTTOK contra el secreto HOTMART_HOTTOK.
// Registra/actualiza la compra en HotmartPurchase (idempotente por email) y
// sincroniza el acceso del usuario si ya tiene cuenta en AUTOREIKI.
export default async function(req) {
  try {
    // 1. Validar que la peticion realmente viene de Hotmart (HOTTOK)
    const hottok = req.headers.get('X-HOTMART-HOTTOK') || req.headers.get('x-hotmart-hottok');
    const expected = secrets.get("HOTMART_HOTTOK");
    if (!expected || !hottok || hottok !== expected) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const eventType = body.event;
    const eventId = body.id;
    const creationDate = body.creation_date;
    const data = body.data || {};
    const buyer = data.buyer || {};
    const product = data.product || {};
    const purchase = data.purchase || {};

    const email = (buyer.email || "").toLowerCase().trim();
    if (!email) return Response.json({ error: "No buyer email" }, { status: 400 });

    // 2. Mapear evento de Hotmart a estado y acceso
    let status, accessActive;
    if (eventType === "PURCHASE_APPROVED" || eventType === "PURCHASE_COMPLETE") {
      status = "approved";
      accessActive = true;
    } else if (eventType === "PURCHASE_REFUNDED") {
      status = "refunded";
      accessActive = false;
    } else if (eventType === "PURCHASE_CHARGEBACK") {
      status = "chargeback";
      accessActive = false;
    } else if (eventType === "PURCHASE_CANCELED" || eventType === "PURCHASE_EXPIRED") {
      status = "canceled";
      accessActive = false;
    } else {
      // Eventos no relevantes para el control de acceso (billet printed, etc.)
      return Response.json({ ok: true, ignored: eventType });
    }

    const base44 = createClientFromRequest(req);
    const incomingDate = creationDate || Date.now();

    // 3. Proteccion anti-desorden: si ya procesamos un evento mas reciente para este
    //    comprador, ignoramos el evento viejo para no revertir el estado (ej. un
    //    reenvio atrasado de PURCHASE_APPROVED despues de un PURCHASE_REFUNDED).
    const existing = await base44.asServiceRole.entities.HotmartPurchase.filter({ buyer_email: email });
    const prev = existing && existing[0];
    if (prev && prev.last_event_date && prev.last_event_id !== String(eventId) && prev.last_event_date > incomingDate) {
      return Response.json({ ok: true, skipped: "out_of_order", email });
    }

    // 4. Upsert idempotente por email: un registro por comprador. Recibir el mismo
    //    evento dos veces solo actualiza el mismo registro con los mismos valores.
    const purchaseDate = purchase.approved_date
      ? new Date(purchase.approved_date).toISOString()
      : (creationDate ? new Date(creationDate).toISOString() : new Date().toISOString());

    const record = {
      buyer_name: buyer.name || "",
      buyer_email: email,
      transaction_id: String(eventId || ""),
      product_id: product.id != null ? String(product.id) : (product.ucode || ""),
      product_name: product.name || "",
      purchase_date: purchaseDate,
      status,
      access_active: accessActive,
      last_event_id: String(eventId || ""),
      last_event_date: incomingDate,
    };

    await base44.asServiceRole.entities.HotmartPurchase.upsert([record], { key: "buyer_email" });

    // 5. Sincronizar el acceso en el usuario si ya tiene cuenta creada con ese email
    let userUpdated = false;
    try {
      const users = await base44.asServiceRole.entities.User.list("-created_date", 500);
      const user = users.find((u) => u.email && u.email.toLowerCase() === email);
      if (user) {
        await base44.asServiceRole.entities.User.update(user.id, { access_active: accessActive });
        userUpdated = true;
      }
    } catch (e) {
      // La actualizacion del usuario es best-effort; la compra ya queda registrada.
    }

    return Response.json({
      ok: true,
      status,
      access_active: accessActive,
      email,
      userUpdated
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}