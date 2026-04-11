import type { Metadata } from "next";
import { Header } from "@/src/components/HomePage/Header";
import { Hero } from "@/src/components/HomePage/Hero";
import { WhyFluvoo } from "@/src/components/HomePage/WhyFluvoo";
import { ProductPreview } from "@/src/components/HomePage/ProductPreview";
import { Benefits } from "@/src/components/HomePage/Benefits";
import { HowItWorks } from "@/src/components/HomePage/HowItWorks";
import { Profiles } from "@/src/components/HomePage/Profiles";
import { FAQ } from "@/src/components/HomePage/FAQ";
import { CTA } from "@/src/components/HomePage/CTA";
import {Footer} from "@/src/components/HomePage/Footer";

export const metadata: Metadata = {
  title: "Fluvoo | Claridad financiera para cada Dominicano",
  description: "Descubre Fluvoo, la app financiera diseñada para dominicanos. Controla tus gastos, ahorra mejor y toma decisiones inteligentes con tu dinero.",
  openGraph: {
    title: "Fluvoo - Tu finanzas, claras y sencillas",
    description: "La mejor herramienta financiera para dominicanos. Empieza hoy a tomar control de tu dinero.",
    url: 'https://fluvoo.com',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Fluvoo - App financiera para dominicanos',
      },
    ],
  },
};

export default function Home() {
  return (
    <main className="flex flex-col min-h-dvh">
      <Header />
      {/* Hero */}
      <Hero />

      {/* Imagen preview */}
      <ProductPreview />

      {/* Por qué Fluvoo */}
      <WhyFluvoo />
      
      {/* Beneficios Reales */}
      <Benefits />

      {/* Como funciona */}
      <HowItWorks />

      {/* Hecho para tí */}
      <Profiles />

      {/* FAQ */}
      <FAQ />

      {/* CTA */}
      <CTA />

      {/* Footer */}
      <Footer />
    </main>
  );
}
