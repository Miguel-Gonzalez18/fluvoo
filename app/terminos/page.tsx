import type { Metadata } from "next";
import { TermsPage } from "@/modules/legal/TermsPage";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Lee los términos y condiciones de uso de Fluvoo. Define los derechos y obligaciones de usuarios y de la plataforma.",
  alternates: {
    canonical: "/terminos",
  },
};

export default function Page() {
  return <TermsPage />;
}
