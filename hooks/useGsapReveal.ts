"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

type RevealOptions = {
  selector?: string;
  delay?: number;
  stagger?: number;
  y?: number;
};

gsap.registerPlugin(ScrollTrigger);

export function useGsapReveal<T extends HTMLElement>({
  selector = ".reveal-item",
  delay = 0,
  stagger = 0.12,
  y = 28
}: RevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const targets = gsap.utils.toArray<HTMLElement>(selector);

      gsap.fromTo(
        targets,
        { autoAlpha: 0, y },
        {
          autoAlpha: 1,
          y: 0,
          delay,
          stagger,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            once: true
          }
        }
      );
    }, root);

    return () => ctx.revert();
  }, [delay, prefersReducedMotion, selector, stagger, y]);

  return ref;
}
