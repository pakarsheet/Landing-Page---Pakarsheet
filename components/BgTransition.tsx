"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function BgTransition() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Wait one tick so all sections are mounted in DOM
    const timer = setTimeout(() => {
      const darkSections = ["#templates", "#cta-section"];

      const triggers = darkSections.map((selector) => {
        const el = document.querySelector(selector);
        if (!el) return null;

        return ScrollTrigger.create({
          trigger: el,
          start: "top 65%",
          end: "bottom 35%",
          onEnter: () =>
            gsap.to(document.body, { backgroundColor: "#01112b", duration: 0.5, ease: "power2.inOut" }),
          onLeave: () =>
            gsap.to(document.body, { backgroundColor: "#ffffff", duration: 0.5, ease: "power2.inOut" }),
          onEnterBack: () =>
            gsap.to(document.body, { backgroundColor: "#01112b", duration: 0.5, ease: "power2.inOut" }),
          onLeaveBack: () =>
            gsap.to(document.body, { backgroundColor: "#ffffff", duration: 0.5, ease: "power2.inOut" }),
        });
      });

      return () => {
        triggers.forEach((t) => t?.kill());
        gsap.set(document.body, { backgroundColor: "#ffffff" });
      };
    }, 100);

    return () => clearTimeout(timer);
  }, [prefersReducedMotion]);

  return null;
}
