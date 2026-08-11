import type { Metadata } from "next";
import { ComingSoonPage } from "@/modules/comingSoon/ComingSoonPage";

export const metadata: Metadata = {
  title: "Fluvoo | Estamos construyendo algo nuevo",
  description:
    "Fluvoo está en construcción. Pronto lanzamos algo distinto, hecho con calma desde República Dominicana.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  return <ComingSoonPage />;
}
