"use client";

import { useEffect } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export function BgTransition() {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Global ScrollTrigger performance config — set once, client-side only
    ScrollTrigger.config({
      ignoreMobileResize: true,
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
    });

    // Store triggers outside setTimeout so the outer cleanup can kill them
    const triggersRef: ReturnType<typeof ScrollTrigger.create>[] = [];

    // Wait one tick so all sections are mounted in DOM
    const timer = setTimeout(() => {
      const darkSections = ["#templates", "#cta-section"];

      darkSections.forEach((selector) => {
        const el = document.querySelector(selector);
        if (!el) return;

        triggersRef.push(
          ScrollTrigger.create({
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
          })
        );
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      triggersRef.forEach((t) => t?.kill());
      gsap.set(document.body, { backgroundColor: "#ffffff" });
    };
  }, [prefersReducedMotion]);

  return null;
}
