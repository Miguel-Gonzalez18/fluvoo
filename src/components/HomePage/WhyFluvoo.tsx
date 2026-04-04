"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, Calculator, PiggyBank, Sparkles } from "lucide-react";
const cardData = [
  {
    icon: Sparkles,
    title: "Detección automática",
    description: "Lee las notificaciones de tu banco desde tu correo. Sin acceder a tu cuenta bancaria.",
  },
  {
    icon: Bot,
    title: "Análisis con IA",
    description: "Recibe recomendaciones accionables en lenguaje simple para mejorar tus hábitos financieros.",
  },
  {
    icon: Calculator,
    title: "Calculadoras locales",
    description: "Nómina con TSS/SFS/SIPEN, ISR según DGII, ARS, préstamos e inflación en RD.",
  },
  {
    icon: PiggyBank,
    title: "Planes de ahorro",
    description: "Metas personalizadas que se adaptan a tu ingreso real y evolucionan contigo.",
  },
];

export function WhyFluvoo() {
    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.fromTo('.why-fluvoo-card', {
            opacity: 0,
            y: 50,
        }, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.2,
            scrollTrigger: {
                trigger: '.why-fluvoo-card',
                start: 'top 80%',
                markers: false,
            },
        });
    }, []);
    return (
      <section className="w-full max-w-6xl mx-auto relative py-12">
        <div className="rounded-2xl md:grid md:grid-cols-4 md:divide-x md:divide-neutral-300 divide-y md:divide-y-0 divide-neutral-300">
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