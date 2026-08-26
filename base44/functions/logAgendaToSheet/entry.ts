import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';
import { secrets } from 'base44:runtime';

const HEADERS = ["Email", "Nombre", "Fecha", "Hora", "Etiqueta", "Registrado el"];

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    let body;
    try { body = await req.json(); } catch (e) { body = {}; }
    const date = body && body.date;
    const sessions = Array.isArray(body && body.sessions) ? body.sessions : [];
    if (!date || !sessions.length) {
      return Response.json({ error: 'date y sessions son requeridos' }, { status: 400 });
    }

    let sheetId = secrets.get("GOOGLE_SHEET_ID") || '';
    // Acepta también la URL completa de la hoja y extrae el ID
    const match = sheetId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) sheetId = match[1];
    sheetId = sheetId.trim();
    if (!sheetId) return Response.json({ error: 'GOOGLE_SHEET_ID no configurado' }, { status: 500 });

    const { accessToken } = await base44.asServiceRole.connectors.getConnection("googlesheets");
    const base = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}`;

    const asJson = async (res) => {
      const text = await res.text();
      try { return JSON.parse(text); } catch (e) { return { _html: text.slice(0, 200) }; }
    };

    // Descubre la primera pestaña de la hoja
    const metaRes = await fetch(`${base}?fields=sheets.properties.title`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const meta = await asJson(metaRes);
    if (!metaRes.ok) return Response.json({ error: meta.error?.message || meta._html || 'No se pudo leer la hoja' }, { status: 502 });
    const tab = meta.sheets && meta.sheets[0] && meta.sheets[0].properties && meta.sheets[0].properties.title;
    if (!tab) return Response.json({ error: 'La hoja no tiene pestañas' }, { status: 502 });
    const range = `${encodeURIComponent(tab)}!A1:F1`;

    // Crea los encabezados si la primera fila está vacía
    const headerRes = await fetch(`${base}/values/${range}`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    const headerJson = await headerRes.json();
    const hasHeader = headerJson.values && headerJson.values[0] && headerJson.values[0][0] === HEADERS[0];
    if (!hasHeader) {
      await fetch(`${base}/values/${range}?valueInputOption=RAW`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ values: [HEADERS] })
      });
    }

    // Agrega una fila por cada sesión programada
    const now = new Date().toISOString();
    const rows = sessions.map((s) => [
      user.email || '',
      user.full_name || '',
      date,
      s.time || '',
      s.label || '',
      now
    ]);

    const appendRes = await fetch(`${base}/values/${encodeURIComponent(tab)}!A:F:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ values: rows })
    });
    const appendJson = await appendRes.json();
    if (!appendRes.ok) return Response.json({ error: appendJson.error?.message || 'No se pudo escribir en la hoja' }, { status: 502 });

    return Response.json({ ok: true, logged: rows.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}