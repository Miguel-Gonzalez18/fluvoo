"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Button } from "@/components/ui/button";
import PixelBlast from "@/components/ui/PixelBlast";
import { ArrowUpRight } from "lucide-react";

export function CTA() {
    useEffect((): () => void => {
        gsap.registerPlugin(ScrollTrigger, SplitText);

        // Divide el h2 en palabras para animarlas de izquierda a derecha
        const splitTitle = new SplitText('#CTA-title', {
            type: 'words',
            wordsClass: 'word',
        });

        // Timeline del header: se dispara cuando #CTA-header entra al viewport
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#CTA-header',
                start: 'top 80%',
            },
        });
        tl.from(splitTitle.words, {
            opacity: 0,
            x: 30,
            duration: 0.6,
            stagger: 0.05,
            ease: 'power3.out',
        }, '-=0.2')
        .from('#CTA-description', {
            opacity: 0,
            y: 16,
            duration: 0.5,
            ease: 'power3.out',
        }, '-=0.2');

        // Cards: stagger de entrada desde abajo cuando el contenedor entra al viewport
        gsap.fromTo('.CTA-card', {
            opacity: 0,
            y: 60,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.CTA-container',
                start: 'top 75%',
            },
        });

        return () => tl.kill();
    }, []);

    return (
        <section className="relative py-28 bg-foreground overflow-hidden">
            {/* Patrón decorativo de fondo */}
            <div className="absolute inset-0 bg-black/50"></div>
            <div className="absolute inset-0 z-0">
                <PixelBlast
                    className="bg-black"
                    variant="square"
                    pixelSize={4}
                    color="#048059"
                    patternScale={2}
                    patternDensity={1}
                    pixelSizeJitter={0}
                    enableRipples
                    rippleSpeed={0.4}
                    rippleThickness={0.12}
                    rippleIntensityScale={1.5}
                    liquid={false}
                    liquidStrength={0.12}
                    liquidRadius={1.2}
                    liquidWobbleSpeed={5}
                    speed={0.5}
                    edgeFade={0.25}
                    transparent
                />
            </div>

            <div className="mx-auto max-w-full px-4 md:px-12 relative z-10">
                {/* Header de sección */}
                <div id="CTA-header" className="text-center relative space-y-4">
                    <h2 id="CTA-title" className="md:text-6xl text-3xl mx-auto max-w-4xl font-heading font-bold text-neutral-50">
                        Empieza a entender tu <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">dinero</span> Hoy
                    </h2>
                    <p id="CTA-description" className="text-neutral-200 mt-3 text-sm max-w-lg mx-auto leading-relaxed">
                        Sin hojas de cálculo, sin configuraciones complejas.
                    </p>
                    <Button id="hero-button-1" variant="ghost" className="cursor-pointer p-4 text-white border border-white/20 bg-white/10 backdrop-blur-lg">
                        Comenzar ahora
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </section>
    );
}