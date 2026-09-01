import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

const sensationLabels = {
  hormigueo: "hormigueo",
  calor: "calor suave",
  frio: "frío o brisa",
  liberacion: "liberación emocional",
  somnolencia: "somnolencia",
  nada: "nada en particular",
  dolor: "dolor persistente"
};

const zoneLabels = {
  manos: "manos", brazos: "brazos", piernas: "piernas", pies: "pies",
  cabeza: "cabeza", cuello: "cuello", pecho: "pecho", abdomen: "abdomen",
  espalda: "espalda", general: "todo el cuerpo"
};

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { sensation, zone, intensity, persists, worries } = body;

    if (!sensation) {
      return Response.json({ error: "Sensación requerida" }, { status: 400 });
    }

    const prompt = `Eres un guía de Reiki y meditación. Un practicante describe su experiencia:
- Sensación principal: ${sensationLabels[sensation] || sensation}
- Zona del cuerpo: ${zoneLabels[zone] || zone || "no especificada"}
- Intensidad percibida: ${intensity || 0}/5
- La sensación persiste después de la sesión: ${persists ? "sí" : "no"}
- Le preocupa: ${worries ? "sí" : "no"}

Proporciona una orientación prudente y un siguiente paso claro. No asignes significados absolutos a la sensación ni sustituyas atención sanitaria. Responde en español, en 2-3 párrafos breves, con tono cálido y respetuoso.`;

    const guidance = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
    });

    return Response.json({ guidance });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}