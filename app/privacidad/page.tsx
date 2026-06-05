import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/modules/legal/PrivacyPolicyPage";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Conoce cómo Fluvoo recopila, usa y protege tu información personal. Tu privacidad es nuestra prioridad.",
  alternates: {
    canonical: "/privacidad",
  },
};

export default function Page() {
  return <PrivacyPolicyPage />;
}
