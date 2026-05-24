"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const bar = barRef.current;
    if (!bar || prefersReducedMotion) return;

    // Set initial state via GSAP (not inline style) so GSAP owns the property
    gsap.set(bar, { scaleX: 0, transformOrigin: "left center" });

    const tween = gsap.to(bar, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.1,
      },
    });

    return () => {
      tween.kill();
      ScrollTrigger.getAll()
        .filter((st) => st.vars.trigger === document.documentElement)
        .forEach((st) => st.kill());
    };
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-[3px] w-full"
    >
      <div
        ref={barRef}
        className="h-full w-full bg-sheet"
        style={{ transformOrigin: "left center", willChange: "transform" }}
      />
    </div>
  );
}
