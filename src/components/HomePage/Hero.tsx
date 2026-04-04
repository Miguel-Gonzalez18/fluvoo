"use client";
import { useEffect } from "react";
import { GetStartedButton } from "../ui/get-started-button";
import { Button } from "../ui/button";
import Image from "next/image";
import { Star } from "lucide-react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

export function Hero() {

    useEffect((): () => void => {
        gsap.registerPlugin(SplitText);
        const tl = gsap.timeline();
        
        const splitText = new SplitText('#hero-title', {
            type: 'words,chars',
            charsClass: 'char',
            wordsClass: 'word'
        });
        
        tl.fromTo(splitText.words, {
            opacity: 0,
            x: 150,
        }, {
            opacity: 1,
            x: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out'
        }, 0.5)
        .from('#hero-subtitle', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        }, 0.7)
        .from('#hero-paragraph', {
            opacity: 0,
            y: 50,
            duration: 0.8,
            ease: 'power3.out'
        }, 0.7)
        .fromTo("#hero-button-1", {
            opacity: 0,
            y: 50,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.inOut'
        }, 1.2)
        .fromTo("#hero-button-2", {
            opacity: 0,
            y: 50,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.inOut'
        }, 1.5);
        
        return () => tl.kill();
    }, []);

    useEffect(() => {
        gsap.fromTo("#hero-image", {
            opacity: 0,
            y: 50,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power3.inOut'
        });

        gsap.from(".hero-description", {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: 0.5,
            stagger: 0.2,
            ease: 'power3.inOut'
        });
    }, [])

  return (
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
          <p id="hero-subtitle" className="text-xs mt-20 md:mt-0 mx-auto md:mx-0 text-center md:text-left text-primary-800 px-3 py-1 border border-neutral-200 rounded-lg w-fit">Claridad financiera para cada dominicano</p>
          <h1 id="hero-title" className="md:text-5xl text-4xl text-center md:text-left font-bold font-heading text-balance">Tu dinero <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">analizado</span>, <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">planificado</span> y bajo control.</h1>
          <p id="hero-paragraph" className="text-lg text-center md:text-left text-neutral-600 mt-4">Descubre cómo Fluvoo transforma tu relación con el dinero.</p>
          <div className="w-full flex items-center gap-2 justify-center md:justify-start">
            <Button id="hero-button-1" variant="outline" className="cursor-pointer p-4">Comenzar ahora</Button>
            <GetStartedButton id="hero-button-2" label="Iniciar prueba" />
          </div>
        </div>

        <div className="w-full md:w-2/5 flex flex-col items-center md:items-start justify-center gap-2">
          <Image id="hero-image" src="/images/finance-img.svg" alt="Hero" width={500} height={500} loading="eager" />
          <p className="hero-description text-sm text-center md:text-left text-balance text-neutral-500">Fluvoo es el asistente financiero personal con IA diseñado para la realidad dominicana. Entiende tus ingresos, gastos y metas y te guía hacia donde quieres llegar.</p>
          <div className="flex items-center flex-col md:flex-row gap-1">
            <span className="hero-description flex items-center gap-1">
              {Array(5).fill(<Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
            </span>
            <small className="hero-description text-xs text-neutral-800">Calificado 4.8 por los primeros usuarios beta en RD</small>
          </div>
        </div>
      </section>
  );
}