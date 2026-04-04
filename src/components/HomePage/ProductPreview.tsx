"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function ProductPreview() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        imageRef.current,
        {
          rotateX: 22,
          scale: 0.9,
          opacity: 0.7,
          transformOrigin: "center top",
        },
        {
          rotateX: 0,
          scale: 1,
          opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 15%",
            scrub: 1.2,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="w-full max-w-4xl mx-auto relative py-4">
      {/* Decorative glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(52,168,100,0.18),transparent_60%)] blur-2xl" />
        <div className="absolute -bottom-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(52,168,100,0.12),transparent_60%)] blur-2xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[48px_48px] opacity-40" />
      </div>

      {/* Perspective wrapper — necesario para el efecto 3D */}
      <div style={{ perspective: "1200px" }}>
        <div ref={imageRef} className="relative z-10">
          <Image
            className="w-full h-auto rounded-2xl shadow-2xl border-4 border-neutral-200"
            src="/images/Dashboard.webp"
            alt="Objetivos y Ahorros"
            width={1200}
            height={800}
            priority={false}
          />
        </div>
      </div>
    </section>
  );
}
