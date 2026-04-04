import { Header } from "@/src/components/HomePage/Header";
import { Hero } from "@/src/components/HomePage/Hero";
import { WhyFluvoo } from "@/src/components/HomePage/WhyFluvoo";
import { ProductPreview } from "@/src/components/HomePage/ProductPreview";
import { Benefits } from "@/src/components/HomePage/Benefits";
import { HowItWorks } from "@/src/components/HomePage/HowItWorks";

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
    </main>
  );
}
