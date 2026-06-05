import type { Metadata } from "next";
import { BusinessComingSoonPage } from "@/modules/dashboard/business/pages/ComingSoonPage";

export const metadata: Metadata = {
  title: "Módulo empresarial",
  description: "Herramientas para dueños de negocio — próximamente en Fluvoo.",
};

export default function Page() {
  return <BusinessComingSoonPage />;
}
