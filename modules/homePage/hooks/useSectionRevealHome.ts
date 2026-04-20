"use client";
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

export interface SectionRevealOptions {
  headerTrigger: string;
  titleSelector: string;
  subtitleSelector?: string;
  descriptionSelector?: string;
  cardSelector?: string;
  containerSelector?: string;
  containerStart?: string;
  order?: "subtitle-title-desc" | "title-subtitle-desc";
  titleSlide?: "x" | "y";
}

export function useSectionRevealHome({
  headerTrigger,
  titleSelector,
  subtitleSelector,
  descriptionSelector,
  cardSelector,
  containerSelector,
  containerStart = "top 75%",
  order = "subtitle-title-desc",
  titleSlide = "x",
}: SectionRevealOptions): void {
  useEffect((): (() => void) => {
    gsap.registerPlugin(ScrollTrigger, SplitText);

    const ctx = gsap.context(() => {
      const splitTitle = new SplitText(titleSelector, {
        type: "words",
        wordsClass: "word",
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: headerTrigger, start: "top 80%" },
      });

      const titleVars =
        titleSlide === "x"
          ? { opacity: 0, x: 30, duration: 0.6, stagger: 0.05, ease: "power3.out" }
          : { opacity: 0, y: 16, duration: 0.5, stagger: 0.1, ease: "power3.out" };

      if (order === "subtitle-title-desc") {
        if (subtitleSelector) {
          tl.from(subtitleSelector, { opacity: 0, y: 16, duration: 0.5, ease: "power3.out" });
        }
        tl.from(splitTitle.words, titleVars, subtitleSelector ? "-=0.2" : undefined);
        if (descriptionSelector) {
          tl.from(descriptionSelector, { opacity: 0, y: 16, duration: 0.5, ease: "power3.out" }, "-=0.2");
        }
      } else {
        tl.from(splitTitle.words, titleVars);
        if (subtitleSelector) {
          tl.from(subtitleSelector, { opacity: 0, y: 16, duration: 0.5, ease: "power3.out" });
        }
        if (descriptionSelector) {
          tl.from(descriptionSelector, { opacity: 0, y: 16, duration: 0.5, ease: "power3.out" });
        }
      }

      if (cardSelector && containerSelector) {
        gsap.fromTo(
          cardSelector,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: { trigger: containerSelector, start: containerStart },
          }
        );
      }
    });

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
