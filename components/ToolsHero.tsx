"use client";

import { useLayoutEffect, useRef } from "react";
import { Calculator, Zap, Lock, Sparkles } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { SheetGrid } from "./SheetGrid";
import { tools } from "@/lib/tools";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const TOOLS_HERO_CELLS = [
  { col: 0, row: 0, delay: "0s" },
  { col: 3, row: 1, delay: "0.8s" },
  { col: 6, row: 0, delay: "1.6s" },
  { col: 1, row: 3, delay: "2.0s" },
  { col: 5, row: 4, delay: "1.1s" },
  { col: 8, row: 2, delay: "0.4s" },
  { col: 2, row: 5, delay: "1.8s" },
];

const badges = [
  { icon: Calculator, label: `${tools.length} kalkulator` },
  { icon: Zap,        label: "Real-time" },
  { icon: Lock,       label: "Tanpa login" },
  { icon: Sparkles,   label: "100% gratis" },
];

export function ToolsHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(".tools-panel",  { autoAlpha: 0, y: 18, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 })
        .fromTo(".tools-reveal", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.09 }, "-=0.35")
        .fromTo(".tools-word",   { autoAlpha: 0, yPercent: 90, rotateX: -18 }, { autoAlpha: 1, yPercent: 0, rotateX: 0, duration: 0.65, stagger: 0.04 }, "-=0.5");
    }, rootRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const headline = "Kalkulator bisnis gratis.";

  return (
    <section ref={rootRef} className="bg-white px-3 pb-0 pt-3 sm:px-5 sm:pt-5 lg:px-10">
      <div className="tools-panel relative mx-auto max-w-[1380px] overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-4 pb-16 pt-28 sm:rounded-[32px] sm:px-8 sm:pt-36 lg:px-10 lg:pb-20 lg:pt-[165px]">
        <SheetGrid cells={TOOLS_HERO_CELLS} />

        <div className="relative z-10 mx-auto flex max-w-[890px] flex-col items-center text-center">
          {/* Eyebrow */}
          <p className="tools-reveal inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-secondary text-sm font-bold text-muted shadow-card">
            <Calculator className="h-4 w-4" />
            Tools Gratis Pakarsheet
          </p>

          {/* Headline — word-by-word */}
          <h1 className="tools-reveal mt-6 text-balance font-primary text-[36px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink sm:text-[48px] sm:tracking-[-2px] lg:text-[62px] lg:tracking-[-3.5px]">
            {headline.split(" ").map((word, i) => {
              const isGratis = word === "gratis.";
              return (
                <span
                  key={i}
                  className="tools-word inline-block origin-bottom pr-[0.18em]"
                >
                  {isGratis ? (
                    <span>gratis.</span>
                  ) : (
                    word
                  )}
                </span>
              );
            })}
          </h1>

          {/* Sub */}
          <p className="tools-reveal mt-6 max-w-2xl text-pretty font-secondary text-[18px] font-normal leading-[1.56] text-muted">
            Tahu persis berapa margin kamu, harga jual yang aman di marketplace, dan iklan yang benar-benar untung — tanpa rumus rumit, langsung di browser.
          </p>

          {/* Badge strip */}
          <div className="tools-reveal mt-10 flex flex-wrap items-center justify-center gap-2">
            {badges.map(({ icon: Icon, label }) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 font-secondary text-sm font-semibold text-muted shadow-card"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
