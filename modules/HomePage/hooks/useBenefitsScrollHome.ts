"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export function useBenefitsScrollHome() {
  const [activeIndex, setActiveIndex] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect((): (() => void) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: "#benefits-container", start: "top 80%" },
    });
    tl.from("#benefits-subtitle", { opacity: 0, y: 20, duration: 0.5 })
      .from("#benefits-title", { opacity: 0, x: 20, duration: 0.5 }, "-=0.2")
      .from("#benefits-paragraph", { opacity: 0, y: 20, duration: 0.5 }, "-=0.2");
    return () => tl.kill();
  }, []);

  useEffect((): (() => void) => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: "#benefits-container-items", start: "top 80%" },
    });
    tl.from("#benefits-container-items > div", { opacity: 0, y: 20, duration: 0.5, stagger: 0.2 });
    return () => tl.kill();
  }, []);

  useEffect((): (() => void) => {
    gsap.registerPlugin(SplitText);
    const splitText = new SplitText(".heading-card-title", {
      type: "words,chars",
      charsClass: "char",
      wordsClass: "word",
    });
    const tl = gsap.timeline({
      scrollTrigger: { trigger: ".heading-card-container", start: "top 70%" },
    });
    tl.from(splitText.words, {
      opacity: 0,
      x: 20,
      filter: "blur(10px)",
      duration: 0.5,
      stagger: 0.2,
    });
    return () => {
      tl.kill();
      splitText.revert();
    };
  }, []);

  useEffect((): (() => void) => {
    gsap.registerPlugin(ScrollTrigger);
    const triggers: ScrollTrigger[] = [];

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      const st = ScrollTrigger.create({
        trigger: card,
        start: "top center",
        end: "bottom center",
        onEnter: () => setActiveIndex(i),
        onEnterBack: () => setActiveIndex(i),
      });
      triggers.push(st);
    });

    return () => triggers.forEach((t) => t.kill());
  }, []);

  const scrollToCard = (i: number) => {
    const card = cardRefs.current[i];
    if (!card) return;
    const top = card.getBoundingClientRect().top + window.scrollY - 96;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return { cardRefs, activeIndex, scrollToCard };
}
