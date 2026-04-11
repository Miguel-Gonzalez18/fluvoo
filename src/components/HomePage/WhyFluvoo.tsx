"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Bot, Calculator, PiggyBank, Sparkles } from "lucide-react";
const cardData = [
  {
    icon: Sparkles,
    title: "Hecho para RD",
    description: "Diseñado desde cero para la realidad dominicana: pesos, bancos locales, TSS, DGII y ARS.",
  },
  {
    icon: Bot,
    title: "IA que te habla claro",
    description: "Sin jerga financiera. Recibes análisis y recomendaciones en español que puedes entender y aplicar.",
  },
  {
    icon: Calculator,
    title: "Cálculos que confías",
    description: "Nómina, ISR, préstamos y más todos alineados con la normativa actual de la DGII y la TSS.",
  },
  {
    icon: PiggyBank,
    title: "Tu plan, no uno genérico",
    description: "El asistente construye un plan de ahorro basado en tus números reales, no en promedios globales.",
  },
];

export function WhyFluvoo() {
  useEffect((): () => void => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const splitTitle = new SplitText('#why-fluvoo-title', {
      type: 'words',
      wordsClass: 'word',
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#why-fluvoo-header',
        start: 'top 80%',
      },
    });

    tl.from('#why-fluvoo-subtitle', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out',
    })
    .from(splitTitle.words, {
      opacity: 0,
      x: 40,
      duration: 0.6,
      stagger: 0.06,
      ease: 'power3.out',
    }, '-=0.2')
    .from('#why-fluvoo-description', {
      opacity: 0,
      y: 20,
      duration: 0.5,
      ease: 'power3.out',
    }, '-=0.2');

    gsap.fromTo('.why-fluvoo-card', {
      opacity: 0,
      y: 50,
    }, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.2,
      scrollTrigger: {
        trigger: '.why-fluvoo-container',
        start: 'top 80%',
        markers: false,
      },
    });

    return () => tl.kill();
  }, [])

  return (
    <section className="mx-auto max-w-full px-4 md:px-12 relative py-12">
      <div id="why-fluvoo-header" className="mb-8 text-center">
        <p id="why-fluvoo-subtitle" className="text-md text-primary font-medium mb-2">Por qué Fluvoo</p>
        <h2 id="why-fluvoo-title" className="text-3xl font-heading font-bold text-neutral-800">Construido para la <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)] highlight">realidad</span> que vives</h2>
        <p id="why-fluvoo-description" className="text-neutral-700 mt-2 text-sm max-w-xl mx-auto">Únete a los primeros dominicanos que están tomando control de sus finanzas.</p>
      </div>
      <div className="why-fluvoo-container rounded-2xl md:grid md:grid-cols-4 md:divide-x md:divide-neutral-300 divide-y md:divide-y-0 divide-neutral-300">
        {cardData.map((card, index) => (
          <div key={index} className="p-6 space-y-3 why-fluvoo-card">
            <card.icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
            <h2 className="text-lg font-bold">{card.title}</h2>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}