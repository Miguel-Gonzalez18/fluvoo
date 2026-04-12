"use client";
import { useEffect } from "react";
import { User, Link, ChartNoAxesColumn } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

const cardsData = [
    {
        id: 1,
        title: "Cuéntanos quién eres",
        description: "Selecciona tu perfil asalariado, freelancer, o dueño de negocio. Fluvoo adapta toda la experiencia a tu realidad financiera específica desde el primer minuto.",
        icon: User,
    },
    {
        id: 2,
        title: "Conecta tus notificaciones bancarias",
        description: "Autoriza el correo donde llegan las alertas de tu banco. Fluvoo lee solo esos mensajes, nada personal y empieza a detectar tus gastos automáticamente.",
        icon: Link,
    },
    {
        id: 3,
        title: "Recibe claridad financiera",
        description: "Tu dashboard se llena con datos reales. La IA analiza tus patrones, resume tu estado financiero, y te propone planes de acción concretos y personalizados.",
        icon: ChartNoAxesColumn,
    },
];

export function HowItWorks() {
    useEffect((): () => void => {
        gsap.registerPlugin(ScrollTrigger, SplitText);

        // Divide el h2 en palabras para animarlas de izquierda a derecha
        const splitTitle = new SplitText('#how-it-works-title', {
            type: 'words',
            wordsClass: 'word',
        });

        // Timeline del header: se dispara cuando #how-it-works-header entra al viewport
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#how-it-works-header',
                start: 'top 80%',
            },
        });

        tl.from('#how-it-works-subtitle', {
            opacity: 0,
            y: 16,
            duration: 0.5,
            ease: 'power3.out',
        })
        .from(splitTitle.words, {
            opacity: 0,
            x: 30,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
        }, '-=0.2')
        .from('#how-it-works-description', {
            opacity: 0,
            y: 16,
            duration: 0.5,
            ease: 'power3.out',
        }, '-=0.2');

        // Cards: stagger de entrada desde abajo cuando el contenedor entra al viewport
        gsap.fromTo('.how-it-works-card', {
            opacity: 0,
            y: 60,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.how-it-works-container',
                start: 'top 75%',
            },
        });

        return () => tl.kill();
    }, []);

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