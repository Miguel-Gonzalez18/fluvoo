"use client";
import { useEffect } from "react";
import gsap from "gsap";

export function useHeaderAnimationHome(): void {
  useEffect(() => {
    gsap.fromTo(
      "#header",
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power4.inOut", delay: 0.8 }
    );
  }, []);
}
