"use client";
import { useSectionRevealHome } from "../hooks/useSectionRevealHome";
import { cardData } from "../config/whyFluvooHome";

export function WhyFluvoo() {
  useSectionRevealHome({
    headerTrigger: '#why-fluvoo-header',
    titleSelector: '#why-fluvoo-title',
    subtitleSelector: '#why-fluvoo-subtitle',
    descriptionSelector: '#why-fluvoo-description',
    cardSelector: '.why-fluvoo-card',
    containerSelector: '.why-fluvoo-container',
    containerStart: 'top 80%',
  })

  return (
    <section id="nosotros" className="mx-auto max-w-full px-4 md:px-12 relative py-12">
      <div id="why-fluvoo-header" className="mb-8 text-center">
        <p id="why-fluvoo-subtitle" className="text-md text-primary font-medium mb-2">Por qué Fluvoo</p>
        <h2 id="why-fluvoo-title" className="text-3xl font-heading font-bold text-neutral-800">Construido para la <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)] highlight">realidad</span> que vives</h2>
        <p id="why-fluvoo-description" className="text-neutral-700 mt-2 text-sm max-w-xl mx-auto">Únete a los primeros dominicanos que están tomando control de sus finanzas.</p>
      </div>
      <div className="why-fluvoo-container rounded-2xl md:grid md:grid-cols-4 md:divide-x md:divide-neutral-300 divide-y md:divide-y-0 divide-neutral-300">
        {cardData.map((card, index) => (
          <div key={index} className="p-6 space-y-3 why-fluvoo-card">
            <card.icon className="h-5 w-5 text-primary-700" aria-hidden="true" />
            <h3 className="text-lg font-bold">{card.title}</h3>
            <p className="text-neutral-600 text-sm leading-relaxed">
              {card.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}