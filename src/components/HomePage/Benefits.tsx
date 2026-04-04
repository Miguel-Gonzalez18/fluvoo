"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Bot, CircleCheckBig, SlidersHorizontal, Telescope } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

// Data compartida entre el sidebar y los cards — se vinculan por índice
const benefitsData = [
    {
        icon: Telescope,
        label: "Ve a dónde va tu dinero",
        cardTitle: "Ve exactamente a dónde va tu dinero cada mes.",
        cardImage: "/images/visibilidad-total.webp",
        cardImageAlt: "Visibilidad total",
        cardDescription: "Fluvoo conecta con las notificaciones de tu banco, categoriza cada gasto automáticamente, y te muestra un panorama completo de tus finanzas sin que tengas que hacer nada. Sabes cuánto ganaste, cuánto gastaste, y cuánto te quedó en tiempo real.",
    },
    {
        icon: SlidersHorizontal,
        label: "Controla sin complicarte",
        cardTitle: "Automatiza tu control financiero sin fórmulas ni hojas de cálculo.",
        cardImage: "/images/sin-complicaciones.webp",
        cardImageAlt: "Sin complicaciones",
        cardDescription: "Fluvoo organiza tus movimientos por ti, detecta patrones en tus gastos y te entrega alertas claras para que tomes decisiones rápido. Menos tiempo interpretando datos, más tiempo avanzando tus metas.",
    },
    {
        icon: CircleCheckBig,
        label: "Calcula con precisión local",
        cardTitle: "Calcula con precisión dominicana: nómina, impuestos y proyecciones.",
        cardImage: "/images/precision-total.webp",
        cardImageAlt: "Precisión total",
        cardDescription: "Incluye reglas locales como TSS, SFS, SIPEN e ISR para darte resultados realistas en RD. Así planificas con cifras correctas, no con estimaciones genéricas que no aplican a tu realidad.",
    },
    {
        icon: Bot,
        label: "Recibe guía con IA",
        cardTitle: "Recibe asistencia financiera con IA en español claro y accionable.",
        cardImage: "/images/asistencia-ia.webp",
        cardImageAlt: "Asistencia con IA",
        cardDescription: "Cada mes, Fluvoo analiza tus ingresos y gastos para darte recomendaciones concretas sobre qué ajustar, qué mantener y cómo acercarte a tus metas con decisiones simples basadas en tu realidad dominicana.",
    },
];

export function Benefits() {
    // Índice del card visible en pantalla (0–3), controla qué item del sidebar está activo
    const [activeIndex, setActiveIndex] = useState(0);

    // Array de refs al DOM de cada card — se asignan con el ref callback en el JSX
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#benefits-container',
                start: 'top 80%',
            },
        });

        tl.from('#benefits-subtitle', {
            opacity: 0,
            y: 20,
            duration: 0.5,
        }).from('#benefits-title', {
            opacity: 0,
            x: 20,
            duration: 0.5,
        }, '-=0.2').from('#benefits-paragraph', {
            opacity: 0,
            y: 20,
            duration: 0.5,
        }, '-=0.2')
    }, [])

    useEffect(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#benefits-container-items',
                start: 'top 80%',
            },
        });

        tl.from('#benefits-container-items > div', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.2,
        })
    }, [])

    useEffect(() => {
        gsap.registerPlugin(SplitText);
        const SplitTextHeading = new SplitText('.heading-card-title', {
            type: 'words,chars',
            charsClass: 'char',
            wordsClass: 'word'
        });
        
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '.heading-card-container',
                start: 'top 50%',
            },
        });

        tl.from(SplitTextHeading.words, {
            opacity: 0,
            x: 20,
            filter: 'blur(10px)',
            duration: 0.5,
            stagger: 0.2,
        })
    }, [])

    // ScrollTrigger: detecta qué card ocupa el centro del viewport
    // y sincroniza el item activo del sidebar automáticamente
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        // Guardamos los triggers creados aquí para limpiar solo los nuestros al desmontar
        const triggers: ScrollTrigger[] = [];

        cardRefs.current.forEach((card, i) => {
            if (!card) return;

            const st = ScrollTrigger.create({
                trigger: card,
                // Activa cuando el TOP del card llega al CENTRO de la pantalla
                start: 'top center',
                // Desactiva cuando el BOTTOM del card sale del CENTRO de la pantalla
                end: 'bottom center',
                // Scroll hacia abajo: el card entra en zona activa
                onEnter: () => setActiveIndex(i),
                // Scroll hacia arriba: el card vuelve a la zona activa
                onEnterBack: () => setActiveIndex(i),
            });

            triggers.push(st);
        });

        // Limpieza: mata solo los triggers de este efecto al desmontar
        return () => triggers.forEach(t => t.kill());
    }, []);

    // Scroll suave hacia el card correspondiente al hacer clic en un item del sidebar
    const scrollToCard = (i: number) => {
        const card = cardRefs.current[i];
        if (!card) return;
        // getBoundingClientRect().top → posición relativa al viewport actual
        // + window.scrollY           → convierte a posición absoluta en el documento
        // - 96                       → compensa el header sticky (aprox 96px)
        const top = card.getBoundingClientRect().top + window.scrollY - 96;
        window.scrollTo({
            top,
            behavior: 'smooth',
        });
    };

    return (
        <section className="w-full max-w-6xl mx-auto relative py-12 px-4 flex flex-col md:flex-row gap-16">
            {/* Textos en sticky */}
            <div id="benefits-container" className="flex flex-col gap-2 md:sticky md:top-24 md:self-start w-full md:w-2/5 space-y-2">
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