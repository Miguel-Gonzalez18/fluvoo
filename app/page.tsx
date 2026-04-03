import { Header } from "@/src/components/HomePage/Header";
import Image from "next/image";
import { GetStartedButton } from "@/src/components/ui/get-started-button";
import { Button } from "@/src/components/ui/button";
import { ProductPreview } from "@/src/components/HomePage/ProductPreview";

export default function Home() {
  return (
    <main className="flex flex-col min-h-dvh md:px-16 py-8 px-8">
      <Header />
      {/* Hero */}
      <section className="h-dvh flex flex-col md:flex-row gap-8 items-center justify-center relative overflow-hidden">
        {/* Background decorative pattern */}
        <div className="pointer-events-none absolute inset-0">
          {/* Halo superior: cambia el último valor rgba (0.20) para más/menos intensidad. */}
          <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(52,168,100,0.20),transparent_60%)] blur-2xl" />
          {/* Halo inferior: ajusta -bottom-32 para moverlo y rgba(...) para opacidad. */}
          <div className="absolute -bottom-32 left-2/2 h-[520px] w-[520px] -translate-x-2/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(52,168,100,0.12),transparent_60%)] blur-2xl" />
          {/* Cuadrícula: bg-size controla separación (ej: 32x32 densa, 64x64 más amplia). opacity controla visibilidad. */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[48px_48px] opacity-80" />
        </div>

        <div className="w-full md:w-3/5 flex flex-col gap-4 relative z-10">
          <p className="text-xs mt-20 md:mt-0 mx-auto md:mx-0 text-center md:text-left text-primary-800 px-3 py-1 border border-neutral-200 rounded-lg w-fit">Claridad financiera para cada dominicano</p>
          <h1 className="md:text-5xl text-4xl text-center md:text-left font-bold font-heading text-balance">Tu dinero <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">analizado</span>, <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">planificado</span> y bajo control.</h1>
          <p className="text-lg text-center md:text-left text-neutral-600 mt-4">Descubre cómo Fluvoo transforma tu relación con el dinero.</p>
          <div className="w-full flex items-center gap-2 justify-center md:justify-start">
            <Button variant="outline" className="cursor-pointer p-4">Comenzar ahora</Button>
            <GetStartedButton label="Iniciar prueba" />
          </div>
        </div>

        <div className="w-full md:w-2/5 flex items-center justify-center">
          <Image src="/finance-img.svg" alt="Hero" width={500} height={500} />
        </div>
      </section>
      <ProductPreview />
    </main>
  );
}
