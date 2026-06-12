import type { Metadata } from "next";
import { Header } from "./components/shared/Header";
import { Hero } from "./components/Hero";
import { WhyFluvoo } from "./components/WhyFluvoo";
import { ProductPreview } from "./components/ProductPreview";
import { Benefits } from "./components/Benefits";
import { HowItWorks } from "./components/HowItWorks";
import { Profiles } from "./components/Profiles";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Footer } from "./components/shared/Footer";

export const metadata: Metadata = {
  title: "Fluvoo | Claridad financiera para cada Dominicano",
  description:
    "Descubre Fluvoo, la app financiera diseñada para dominicanos. Controla tus gastos, ahorra mejor y toma decisiones inteligentes con tu dinero.",
};

export default function HomePage() {
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
