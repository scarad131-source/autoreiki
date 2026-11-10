import { base44 } from "@/api/base44Client";

// Avisos push del navegador: llegan al teléfono aunque la app esté cerrada.
// Requieren HTTPS, la app instalada en la pantalla de inicio (en iPhone/iPad)
// y el permiso de notificaciones del dispositivo.

export function isPushSupported() {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

export function isiOSDevice() {
  if (typeof navigator === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = window.atob(base64);
  const output = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) output[i] = raw.charCodeAt(i);
  return output;
}

async function getRegistration() {
  if (!isPushSupported()) return null;
  return (await navigator.serviceWorker.getRegistration()) || null;
}

export async function currentSubscription() {
  const reg = await getRegistration();
  if (!reg || !reg.pushManager) return null;
  return reg.pushManager.getSubscription();
}

export async function getPushState() {
  if (!isPushSupported()) return { supported: false, permission: "default", subscribed: false };
  const subscribed = !!(await currentSubscription());
  return { supported: true, permission: Notification.permission, subscribed };
}

// Suscribe este dispositivo y guarda el aviso en la cuenta.
export async function enablePush() {
  if (!isPushSupported()) throw new Error("unsupported");

  const reg = await getRegistration();
  if (!reg) throw new Error("no-service-worker");

  const permission = await Notification.requestPermission();
  if (permission !== "granted") throw new Error("denied");

  const { data } = await base44.functions.invoke("getPushKey", {});
  if (!data || !data.publicKey) throw new Error("no-key");

  const subscription = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(data.publicKey),
  });

  const json = subscription.toJSON();
  const existing = await base44.entities.PushSubscription.filter({ endpoint: json.endpoint });

  if (!existing || existing.length === 0) {
    await base44.entities.PushSubscription.create({
      endpoint: json.endpoint,
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
      device: `${isiOSDevice() ? "iOS" : "Navegador"} · ${navigator.userAgent.slice(0, 100)}`,
    });
  }

  return true;
}

// Desuscribe este dispositivo y borra el aviso guardado.
export async function disablePush() {
  const subscription = await currentSubscription();
  if (!subscription) return;

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe().catch(() => {});

  const records = await base44.entities.PushSubscription.filter({ endpoint });
  for (const record of records || []) {
    await base44.entities.PushSubscription.delete(record.id).catch(() => {});
  }
}

export async function sendTestPush() {
  const { data } = await base44.functions.invoke("sendPushTest", {});
  return data;
}