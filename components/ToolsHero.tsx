"use client";

import { useLayoutEffect, useRef } from "react";
import { Calculator, Zap, Lock, Sparkles } from "lucide-react";
import { gsap } from "@/lib/gsap";
import { tools } from "@/lib/tools";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

// Reuse same SheetGrid pattern from Hero
const COLS = 9;
const ROWS = 7;
const CW = 100 / COLS;
const CH = 100 / ROWS;

const HIGHLIGHT_CELLS = [
  { col: 0, row: 0, delay: "0s" },
  { col: 3, row: 1, delay: "0.8s" },
  { col: 6, row: 0, delay: "1.6s" },
  { col: 1, row: 3, delay: "2.0s" },
  { col: 5, row: 4, delay: "1.1s" },
  { col: 8, row: 2, delay: "0.4s" },
  { col: 2, row: 5, delay: "1.8s" },
];

function SheetGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `repeating-linear-gradient(to right, rgba(99,120,200,0.13) 0px, rgba(99,120,200,0.13) 1px, transparent 1px, transparent ${CW}%)`,
            `repeating-linear-gradient(to bottom, rgba(99,120,200,0.13) 0px, rgba(99,120,200,0.13) 1px, transparent 1px, transparent ${CH}%)`,
          ].join(", "),
        }}
      />
      {HIGHLIGHT_CELLS.map(({ col, row, delay }, i) => (
        <div
          key={i}
          className="sheet-cell absolute"
          style={{
            left: `${col * CW}%`,
            top: `${row * CH}%`,
            width: `${CW}%`,
            height: `${CH}%`,
            background: "rgba(139,237,2,0.18)",
            animationDelay: delay,
          }}
        />
      ))}
      <div
        className="sheet-row-sweep absolute inset-x-0"
        style={{
          height: `${CH}%`,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139,237,2,0.12) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

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
    <section ref={rootRef} className="bg-white px-5 pb-0 pt-5 lg:px-10">
      <div className="tools-panel relative mx-auto max-w-[1380px] overflow-hidden rounded-[32px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-5 pb-16 pt-32 sm:px-8 sm:pt-36 lg:px-10 lg:pb-20 lg:pt-[165px]">
        <SheetGrid />

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
                    <span className="relative inline-block">
                      gratis
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-1 left-0 h-[6px] w-full rounded-full bg-sheet"
                      />
                      .
                    </span>
                  ) : (
                    word
                  )}
                </span>
              );
            })}
          </h1>

          {/* Sub */}
          <p className="tools-reveal mt-6 max-w-2xl text-pretty font-secondary text-[18px] font-normal leading-[1.56] text-muted">
            Hitung margin, HPP, harga jual marketplace, ROAS iklan, diskon bertingkat, dan profit bersih — langsung di browser, tanpa login, tanpa instalasi.
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
