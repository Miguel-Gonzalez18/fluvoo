"use client";

import { useCallback } from "react";
import { CookieConsent } from "./cookies-consent";
import { ShieldCheck, BarChart3, Megaphone } from "lucide-react";

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
    gtag: (...args: unknown[]) => void;
  }
}

const CATEGORIES = [
  {
    id: "essential",
    name: "Cookies esenciales",
    description: "Necesarias para el funcionamiento básico del sitio web, navegación y seguridad. No se pueden desactivar.",
    icon: <ShieldCheck className="h-4 w-4 text-green-600" />,
    isEssential: true,
  },
  {
    id: "analytics",
    name: "Cookies de analítica",
    description: "Nos ayudan a entender cómo los visitantes interactúan con el sitio recopilando datos de uso anónimos.",
    icon: <BarChart3 className="h-4 w-4 text-blue-600" />,
  },
  {
    id: "marketing",
    name: "Cookies de marketing",
    description: "Permiten mostrar anuncios personalizados y contenido de marketing relevante para ti.",
    icon: <Megaphone className="h-4 w-4 text-purple-600" />,
  },
];

export function CookieConsentGTM() {
  const handleAccept = useCallback((preferences: boolean[]) => {
    if (typeof window === "undefined") return;

    const consentUpdate = {
      analytics_storage: preferences[1] ? "granted" : "denied",
      ad_storage: preferences[2] ? "granted" : "denied",
      ad_user_data: preferences[2] ? "granted" : "denied",
      ad_personalization: preferences[2] ? "granted" : "denied",
    };

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "cookie_consent_update", ...consentUpdate });

    if (typeof window.gtag === "function") {
      window.gtag("consent", "update", consentUpdate);
    }
  }, []);

  return (
    <CookieConsent
      cookiePolicyUrl="/privacidad"
      categories={CATEGORIES}
      onAccept={handleAccept}
    />
  );
}
