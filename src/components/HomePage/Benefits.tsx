import { Bot, CircleCheckBig, SlidersHorizontal, Telescope } from "lucide-react";
import Image from "next/image";

export function Benefits() {
    return (
        <section className="w-full max-w-6xl mx-auto relative py-12 flex flex-col md:flex-row gap-16">
            {/* Textos en sticky */}
            <div className="flex flex-col gap-2 md:sticky md:top-24 md:self-start w-full md:w-2/5 space-y-2">
                <p className="text-md text-primary">En la práctica</p>
                <h2 className="text-3xl font-heading text-neutral-800 font-bold">Lo que Fluvoo hace por ti <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">cada día</span></h2>
                <p className="text-md text-neutral-600">No solo es lo que promete — es lo que ves en pantalla cada vez que abres la app.</p>
                {/* items indexes */}
                <div className="flex flex-col gap-2">
                    <div className="bg-white border border-neutral-200 text-neutral-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                        <Telescope className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span>Ve a dónde va tu dinero</span>
                    </div>
                    <div className="bg-white border border-neutral-200 text-neutral-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span>Controla sin complicarte</span>
                    </div>
                    <div className="bg-white border border-neutral-200 text-neutral-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                        <CircleCheckBig className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span>Calcula con precisión local</span>
                    </div>
                    <div className="bg-white border border-neutral-200 text-neutral-700 text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                        <Bot className="h-4 w-4 text-primary" aria-hidden="true" />
                        <span>Recibe guía con IA</span>
                    </div>
                </div>
            </div>
            {/* cards */}
            <div className="grid grid-cols-1 gap-6 w-full md:w-3/5">
                {/* Card 1 */}
                <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-heading text-neutral-800 font-bold">Ve exactamente a dónde va tu dinero cada mes.</h3>
                    <Image className="border-10 border-white rounded-lg" src="/images/visibilidad-total.webp" alt="Visibilidad total" width={1300} height={800} />
                    <p className="text-md text-neutral-900">Fluvoo conecta con las notificaciones de tu banco, categoriza cada gasto automáticamente, y te muestra un panorama completo de tus finanzas sin que tengas que hacer nada. Sabes cuánto ganaste, cuánto gastaste, y cuánto te quedó en tiempo real.</p>
                </div>
                {/* Card 2 */}
                <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-heading text-neutral-800 font-bold">Automatiza tu control financiero sin fórmulas ni hojas de cálculo.</h3>
                    <Image className="border-10 border-white rounded-lg" src="/images/sin-complicaciones.webp" alt="Sin complicaciones" width={1300} height={800} />
                    <p className="text-md text-neutral-900">Fluvoo organiza tus movimientos por ti, detecta patrones en tus gastos y te entrega alertas claras para que tomes decisiones rápido. Menos tiempo interpretando datos, más tiempo avanzando tus metas.</p>
                </div>
                {/* Card 3 */}
                <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-heading text-neutral-800 font-bold">Calcula con precisión dominicana: nómina, impuestos y proyecciones.</h3>
                    <Image className="border-10 border-white rounded-lg" src="/images/precision-total.webp" alt="Precisión total" width={1300} height={800} />
                    <p className="text-md text-neutral-900">Incluye reglas locales como TSS, SFS, SIPEN e ISR para darte resultados realistas en RD. Así planificas con cifras correctas, no con estimaciones genéricas que no aplican a tu realidad.</p>
                </div>
                {/* Card 4 */}
                <div className="bg-neutral-100 border border-neutral-200 rounded-lg p-6 space-y-4">
                    <h3 className="text-xl font-heading text-neutral-800 font-bold">Recibe asistencia financiera con IA en español claro y accionable.</h3>
                    <Image className="border-10 border-white rounded-lg" src="/images/asistencia-ia.webp" alt="Asistencia con IA" width={1300} height={800} />
                    <p className="text-md text-neutral-900">Cada mes, Fluvoo analiza tus ingresos y gastos para darte recomendaciones concretas sobre qué ajustar, qué mantener y cómo acercarte a tus metas con decisiones simples basadas en tu realidad dominicana.</p>
                </div>
            </div>
        </section>
    );
}