"use client";
import { useSectionRevealHome } from "../hooks/useSectionRevealHome";
import { cardsData } from "../config/howItWorksHome";

export function HowItWorks() {
    useSectionRevealHome({
        headerTrigger: '#how-it-works-header',
        titleSelector: '#how-it-works-title',
        subtitleSelector: '#how-it-works-subtitle',
        descriptionSelector: '#how-it-works-description',
        cardSelector: '.how-it-works-card',
        containerSelector: '.how-it-works-container',
    });

    return (
        <section id="como-funciona" className="relative py-20 bg-foreground overflow-hidden">
            {/* Patrón decorativo de fondo */}
            <div className="pointer-events-none absolute inset-0">
                {/* Cuadrícula: líneas blancas sobre fondo oscuro */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-size-[48px_48px]" />
                {/* Halo verde inferior centrado */}
                <div className="absolute -bottom-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(52,168,100,0.30),transparent_60%)] blur-3xl" />
            </div>

            <div className="mx-auto max-w-full px-4 md:px-12 relative z-10">
                {/* Header de sección */}
                <div id="how-it-works-header" className="mb-12 text-center relative">
                    <p id="how-it-works-subtitle" className="text-xs text-primary font-semibold mb-3 uppercase tracking-widest">¿Cómo funciona?</p>
                    <h2 id="how-it-works-title" className="text-4xl font-heading font-bold text-neutral-50">
                        Tres pasos para tomar <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">el control</span>
                    </h2>
                    <p id="how-it-works-description" className="text-neutral-200 mt-3 text-sm max-w-lg mx-auto leading-relaxed">
                        Sin configuraciones complejas. Sin conocimientos financieros previos. Solo conecta y empieza.
                    </p>
                </div>

                {/* Grid de cards */}
                <div className="how-it-works-container grid grid-cols-1 md:grid-cols-3 gap-5">
                    {cardsData.map((card) => (
                        <div
                            key={card.id}
                            className="how-it-works-card relative bg-foreground border border-white/10 rounded-2xl p-6 flex flex-col gap-5 hover:border-primary/40 hover:bg-foreground/50 transition-colors duration-300 overflow-hidden"
                        >
                            {/* Número fantasma de fondo — decorativo */}
                            <span className="pointer-events-none absolute -right-2 -top-3 text-[7rem] font-heading font-bold leading-none text-white/4 select-none">
                                {String(card.id).padStart(2, '0')}
                            </span>

                            {/* Icono + label de paso */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/15 border border-primary/25">
                                    <card.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-primary/60 uppercase tracking-[0.15em]">
                                    Paso {String(card.id).padStart(2, '0')}
                                </span>
                            </div>

                            {/* Contenido */}
                            <div className="space-y-2">
                                <h3 className="text-lg font-heading font-bold text-neutral-50 leading-snug">
                                    {card.title}
                                </h3>
                                <p className="text-sm text-neutral-400 leading-relaxed">
                                    {card.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}