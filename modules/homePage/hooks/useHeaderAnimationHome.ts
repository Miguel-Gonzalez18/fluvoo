"use client";
import { useEffect } from "react";
import gsap from "gsap";

export function useHeaderAnimationHome(): void {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "#header",
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power4.inOut", delay: 0.8 }
      );
    });
    return () => ctx.revert();
  }, []);
}
