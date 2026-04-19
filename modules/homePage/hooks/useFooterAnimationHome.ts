"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function useFooterAnimationHome(): void {
  useEffect((): (() => void) => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".footer-section", {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".footer-content",
        start: "top 80%",
      },
    });

    return () => {};
  }, []);
}
