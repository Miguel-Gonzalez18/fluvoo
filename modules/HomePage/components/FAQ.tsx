"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/modules/HomePage/components/ui/accordion";
import Image from "next/image";
import { faqItems } from "../config/faqHome";

export function FAQ() {
    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item) => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer,
            },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
            />
            <section id="faq" className="relative py-12 bg-white">
            <div className="mx-auto max-w-full px-4 md:px-12 flex flex-col md:flex-row gap-4">
                {/* Left column */}
                <div className="flex flex-col gap-4 w-full md:w-2/5 text-center md:text-left md:sticky md:top-24 md:self-start">
                    <p className="text-sm font-medium text-primary uppercase tracking-widest">
                        Preguntas frecuentes
                    </p>
                    <h2 className="text-3xl font-heading text-neutral-800 font-bold leading-tight">
                        Respuestas{" "}
                        <span className="text-primary bg-[linear-gradient(180deg,transparent_55%,rgba(52,168,100,0.22)_55%)]">
                            directas
                        </span>
                    </h2>
                    <p className="text-neutral-500 text-sm mx-auto md:mx-0">
                        Lo que más nos preguntan, respondido sin rodeos.
                    </p>

                    {/* Decorative stat block */}
                    <div className="mt-6 hidden md:flex items-start gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10 max-w-xs">
                        <div className="flex items-center justify-center size-20 rounded-xl bg-primary/10 shrink-0">
                            <Image src="/images/illustrationFAQ.svg" alt="FAQ Icon" width={100} height={100} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-neutral-800">
                                ¿Tienes otra duda?
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                Escríbenos y te respondemos en menos de 24 horas.
                            </p>
                            <a
                                id="faq-link-soporte-desktop"
                                href="mailto:hola@fluvoo.com"
                                className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                            >
                                Contactar soporte →
                            </a>
                        </div>
                    </div>
                </div>

                {/* Right column — accordion */}
                <div className="w-full md:w-3/5">
                    <Accordion type="single" collapsible className="w-full space-y-3">
                        {faqItems.map((item, index) => (
                            <AccordionItem
                                id={`faq-item-${item.id}`}
                                key={item.id}
                                value={item.id}
                                className="border border-neutral-200 rounded-xl px-5 overflow-hidden bg-white transition-colors hover:border-primary/30 data-[state=open]:border-primary/40 data-[state=open]:bg-primary/2"
                            >
                                <AccordionTrigger className="py-5 text-left text-sm font-semibold text-neutral-800 hover:no-underline [&[data-state=open]>svg]:rotate-180 cursor-pointer">
                                    <span className="flex items-center gap-3">
                                        <span className="flex items-center justify-center size-6 rounded-full bg-neutral-100 text-[11px] font-bold text-neutral-400 shrink-0 tabular-nums">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                        {item.question}
                                    </span>
                                </AccordionTrigger>
                                <AccordionContent className="text-sm text-neutral-700 leading-relaxed pb-5 pl-9">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>

                    {/* Mobile CTA */}
                    <div className="mt-6 flex md:hidden items-start gap-4 p-5 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center justify-center size-20 rounded-xl bg-primary/10 shrink-0">
                            <Image src="/images/illustrationFAQ.svg" alt="FAQ Icon" width={100} height={100} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-neutral-800">
                                ¿Tienes otra duda?
                            </p>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                Escríbenos y te respondemos en menos de 24 horas.
                            </p>
                            <a
                                id="faq-link-soporte-mobile"
                                href="mailto:hola@fluvoo.com"
                                className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                            >
                                Contactar soporte →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}