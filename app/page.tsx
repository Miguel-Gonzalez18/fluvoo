import { Header } from "@/src/components/HomePage/Header";
import Image from "next/image";
import { GetStartedButton } from "@/src/components/ui/get-started-button";
import { Button } from "@/src/components/ui/button";
import { ProductPreview } from "@/src/components/HomePage/ProductPreview";
import { Bot, Calculator, PiggyBank, Sparkles, Star } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-dvh md:px-16 py-8 px-4">
      <Header />
      {/* Hero */}
      <section className="flex flex-col md:flex-row gap-8 items-center justify-center relative overflow-hidden py-4 md:py-16">
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

        <div className="w-full md:w-2/5 flex flex-col items-center md:items-start justify-center gap-2">
          <Image src="/finance-img.svg" alt="Hero" width={500} height={500} />
          <p className="text-sm text-center md:text-left text-balance text-neutral-500">Fluvoo es el asistente financiero personal con IA diseñado para la realidad dominicana. Entiende tus ingresos, gastos y metas y te guía hacia donde quieres llegar.</p>
          <div className="flex items-center flex-col md:flex-row gap-1">
            <span className="flex items-center gap-1">
              {Array(5).fill(<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
            </span>
            <small className="text-xs text-neutral-800">Calificado 4.8 por los primeros usuarios beta en RD</small>
          </div>
        </div>
      </section>

      {/* Imagen preview */}
      <ProductPreview />

      {/* Por qué Fluvoo */}
      <section className="w-full max-w-6xl mx-auto relative py-12">
        <div className="rounded-2xl md:grid md:grid-cols-4 md:divide-x md:divide-neutral-300 divide-y md:divide-y-0 divide-neutral-300">
          <div className="p-6 space-y-3">
            <Sparkles className="h-5 w-5 text-primary-700" aria-hidden="true" />
            <h2 className="text-lg font-bold">Detección automática</h2>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Lee las notificaciones de tu banco desde tu correo. Sin acceder a tu cuenta bancaria.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <Bot className="h-5 w-5 text-primary-700" aria-hidden="true" />
            <h2 className="text-lg font-bold">Análisis con IA</h2>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Recibe recomendaciones accionables en lenguaje simple para mejorar tus hábitos financieros.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <Calculator className="h-5 w-5 text-primary-700" aria-hidden="true" />
            <h2 className="text-lg font-bold">Calculadoras locales</h2>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Nómina con TSS/SFS/SIPEN, ISR según DGII, ARS, préstamos e inflación en RD.
            </p>
          </div>

          <div className="p-6 space-y-3">
            <PiggyBank className="h-5 w-5 text-primary-700" aria-hidden="true" />
            <h2 className="text-lg font-bold">Planes de ahorro</h2>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Metas personalizadas que se adaptan a tu ingreso real y evolucionan contigo.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
