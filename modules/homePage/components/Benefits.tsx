"use client";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useBenefitsScrollHome } from "../hooks/useBenefitsScrollHome";
import { benefitsData } from "../config/benefitsHome";

export function Benefits() {
    const { cardRefs, activeIndex, scrollToCard } = useBenefitsScrollHome();

    return (
        <section id="beneficios" className="mx-auto max-w-full px-4 md:px-12 relative py-12 flex flex-col md:flex-row gap-16">
            {/* Textos en sticky */}
            <div id="benefits-container" className="flex flex-col gap-2 md:sticky md:top-24 md:self-start w-full md:w-2/5 space-y-2 text-center md:text-left">
                <p className="text-md text-primary" id="benefits-subtitle">En la práctica</p>
                <h2 className="text-3xl font-heading text-neutral-800 font-bold" id="benefits-title">Lo que Fluvoo hace por ti <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">cada día</span></h2>
                <p className="text-md text-neutral-600" id="benefits-paragraph">No solo es lo que promete es lo que ves en pantalla cada vez que abres la app.</p>
                {/* Items del índice: se activan por scroll o al hacer clic */}
                <div id="benefits-container-items" className="flex flex-col gap-2">
                    {benefitsData.map((item, i) => (
                        <div
                            key={i}
                            onClick={() => scrollToCard(i)}
                            className={cn(
                                // Base: tamaño, espaciado, layout
                                "text-sm px-4 py-3 rounded-lg flex items-center gap-2 cursor-pointer transition-colors duration-200",
                                // Activo: fondo verde primario, texto blanco
                                // Inactivo: fondo blanco, borde gris, texto oscuro
                                activeIndex === i
                                    ? "bg-primary text-white border border-primary"
                                    : "bg-white border border-neutral-200 text-neutral-700 hover:border-primary/40"
                            )}
                        >
                            <item.icon
                                className={cn(
                                    "h-4 w-4",
                                    // El icono también cambia de color al activarse
                                    activeIndex === i ? "text-white" : "text-primary"
                                )}
                                aria-hidden="true"
                            />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
            {/* Cards de detalle — cada uno recibe su ref via callback para ScrollTrigger */}
            <div className="grid grid-cols-1 gap-6 w-full md:w-3/5">
                {benefitsData.map((item, i) => (
                    <div
                        key={i}
                        // ref callback: asigna el elemento DOM al índice correcto del array
                        ref={(el) => { cardRefs.current[i] = el; }}
                        className="bg-neutral-100 border border-neutral-200 rounded-lg p-6 space-y-4 heading-card-container"
                    >
                        <h3 className="heading-card-title text-xl font-heading text-neutral-800 font-bold">{item.cardTitle}</h3>
                        <Image
                            className="border-10 border-white rounded-lg"
                            src={item.cardImage}
                            alt={item.cardImageAlt}
                            width={1300}
                            height={800}
                        />
                        <p className="text-md text-neutral-900">{item.cardDescription}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}