"use client";

import { useCallback, useState } from "react";

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}

export function usePushSubscription() {
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscribe = useCallback(async () => {
    setIsSubscribing(true);
    setError(null);

    try {
      if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
        throw new Error("Tu navegador no soporta notificaciones push.");
      }

      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPublicKey) {
        throw new Error("Las notificaciones push no están configuradas.");
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        throw new Error("Debes permitir notificaciones en el navegador.");
      }

      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();

      const subscription =
        existing ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            vapidPublicKey
          ) as BufferSource,
        }));

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
        throw new Error("No se pudo crear la suscripción push.");
      }

      const response = await fetch("/api/notifications/push-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: json.endpoint,
          keys: {
            p256dh: json.keys.p256dh,
            auth: json.keys.auth,
          },
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as { error?: string };
        throw new Error(payload.error ?? "No se pudo guardar la suscripción.");
      }

      setIsSubscribed(true);
    } catch (subscribeError) {
      const message =
        subscribeError instanceof Error
          ? subscribeError.message
          : "Error al activar notificaciones push.";
      setError(message);
      setIsSubscribed(false);
    } finally {
      setIsSubscribing(false);
    }
  }, []);

  return {
    subscribe,
    isSubscribing,
    isSubscribed,
    error,
  };
}
