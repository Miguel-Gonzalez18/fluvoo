"use client";

import { useEffect, useMemo, useState } from "react";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export interface SequentialTypewriterOptions {
  speed?: number;
  initialDelay?: number;
  pauseBetween?: number;
}

export interface SequentialTypewriterResult {
  displayed: string[];
  activeSegmentIndex: number;
  isComplete: boolean;
  isTyping: boolean;
}

export function useSequentialTypewriter(
  segments: string[],
  options: SequentialTypewriterOptions = {}
): SequentialTypewriterResult {
  const { speed = 16, initialDelay = 400, pauseBetween = 140 } = options;
  const segmentKey = useMemo(() => segments.join("\u0000"), [segments]);

  const [displayed, setDisplayed] = useState<string[]>(() =>
    segments.map(() => "")
  );
  const [activeSegmentIndex, setActiveSegmentIndex] = useState(-1);
  const [isComplete, setIsComplete] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!segments.length) {
      setDisplayed([]);
      setActiveSegmentIndex(-1);
      setIsComplete(true);
      setIsTyping(false);
      return;
    }

    let cancelled = false;

    async function run() {
      if (prefersReducedMotion()) {
        setDisplayed(segments);
        setActiveSegmentIndex(-1);
        setIsComplete(true);
        setIsTyping(false);
        return;
      }

      setDisplayed(segments.map(() => ""));
      setActiveSegmentIndex(0);
      setIsComplete(false);
      setIsTyping(true);

      await delay(initialDelay);
      if (cancelled) return;

      for (let segmentIndex = 0; segmentIndex < segments.length; segmentIndex += 1) {
        if (cancelled) return;

        const text = segments[segmentIndex] ?? "";
        setActiveSegmentIndex(segmentIndex);

        for (let charIndex = 0; charIndex <= text.length; charIndex += 1) {
          if (cancelled) return;

          setDisplayed((current) => {
            const next = [...current];
            next[segmentIndex] = text.slice(0, charIndex);
            return next;
          });

          if (charIndex < text.length) {
            await delay(speed);
          }
        }

        if (segmentIndex < segments.length - 1) {
          await delay(pauseBetween);
        }
      }

      if (cancelled) return;

      setActiveSegmentIndex(-1);
      setIsComplete(true);
      setIsTyping(false);
    }

    void run();

    return () => {
      cancelled = true;
    };
  }, [segmentKey, segments, speed, initialDelay, pauseBetween]);

  return {
    displayed,
    activeSegmentIndex,
    isComplete,
    isTyping,
  };
}
