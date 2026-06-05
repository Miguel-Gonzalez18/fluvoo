import type { Metadata } from "next";
import { CookiesPolicyPage } from "@/modules/legal/CookiesPolicyPage";

export const metadata: Metadata = {
  title: "Política de Cookies",
  description:
    "Conoce cómo Fluvoo utiliza cookies para mejorar tu experiencia, medir el uso del sitio y gestionar preferencias de privacidad.",
  alternates: {
    canonical: "/cookies",
  },
};

export default function Page() {
  return <CookiesPolicyPage />;
}
