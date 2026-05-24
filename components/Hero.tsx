"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { Button } from "./ui/Button";
import { MagneticButton } from "./MagneticButton";
import { site } from "@/lib/site";
import { audience, trustedBy } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Grid dimensions
const COLS = 9;
const ROWS = 7;
const CW = 100 / COLS; // % width per cell
const CH = 100 / ROWS; // % height per cell

const HIGHLIGHT_CELLS = [
  { col: 1, row: 1, delay: "0s" },
  { col: 4, row: 2, delay: "0.6s" },
  { col: 7, row: 1, delay: "1.2s" },
  { col: 2, row: 4, delay: "1.8s" },
  { col: 6, row: 5, delay: "0.9s" },
  { col: 3, row: 6, delay: "2.1s" },
  { col: 8, row: 3, delay: "1.5s" },
];

function SheetGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]"
    >
      {/* Grid lines via CSS repeating-linear-gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `repeating-linear-gradient(to right, rgba(99,120,200,0.13) 0px, rgba(99,120,200,0.13) 1px, transparent 1px, transparent ${CW}%)`,
            `repeating-linear-gradient(to bottom, rgba(99,120,200,0.13) 0px, rgba(99,120,200,0.13) 1px, transparent 1px, transparent ${CH}%)`,
          ].join(", "),
        }}
      />

      {/* Highlight cells — pulse in/out */}
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

      {/* Row sweep — slides top → bottom */}
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

function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[1120px]">
      <div className="dashboard-shell dashboard-float relative overflow-hidden rounded-xl border border-white/80 bg-white p-2 shadow-[0_34px_100px_rgba(1,17,43,0.2)] sm:p-3">
        <Image
          src="/dashboard-mockup.png"
          alt="Tampilan dashboard Pakarsheet — ringkasan data penjualan, cashflow, dan laporan operasional"
          className="dashboard-image block h-auto w-full rounded-lg"
          width={3360}
          height={2100}
          priority
          draggable={false}
        />

      </div>
    </div>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(".hero-panel", { autoAlpha: 0, y: 18, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 })
        .fromTo(".hero-reveal", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.08 }, "-=0.35")
        .fromTo(".hero-word", { autoAlpha: 0, yPercent: 88, rotateX: -18 }, { autoAlpha: 1, yPercent: 0, rotateX: 0, duration: 0.7, stagger: 0.035 }, "-=0.52")
        .fromTo(".dashboard-shell", { autoAlpha: 0, y: 72, scale: 0.96, rotateX: 8 }, { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 0.95 }, "-=0.28");

      gsap.to(".dashboard-float", {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".dashboard-image", {
        y: -28,
        scale: 1.035,
        ease: "none",
        scrollTrigger: {
          trigger: ".dashboard-shell",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={rootRef} className="relative overflow-x-clip bg-white px-5 pb-16 pt-5 lg:px-10 lg:pt-10">
      <div className="hero-panel relative mx-auto max-w-[1380px] rounded-[32px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-5 pb-10 pt-32 sm:px-8 sm:pb-12 lg:px-10 lg:pb-16 lg:pt-[165px]">
        <SheetGrid />

        <div className="relative z-10 mx-auto flex max-w-[890px] flex-col items-center text-center">
          <p className="hero-reveal inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-muted shadow-card">
            <CheckCircle2 className="h-4 w-4" />
            Template rasa sistem kerja
          </p>
          <h1 className="hero-reveal mt-6 text-balance font-primary text-[36px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink sm:text-[48px] sm:tracking-[-2px] lg:text-[62px] lg:tracking-[-3.5px]">
            {site.tagline.split(" ").map((word) => (
              <span key={word} className="hero-word inline-block origin-bottom pr-[0.18em]">
                {word}
              </span>
            ))}
          </h1>
          <p className="hero-reveal mt-6 max-w-2xl text-pretty font-secondary text-[18px] font-normal leading-[1.56] text-muted">
            Pakarsheet bantu bisnis naik level dari spreadsheet biasa menjadi sistem kerja yang lebih rapi, otomatis, dan mudah dipantau.
          </p>
          <div className="hero-reveal mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <MagneticButton href={site.templateUrl} size="lg">
              {site.primaryCta}
            </MagneticButton>
            <MagneticButton href={site.contactUrl} variant="secondary" size="lg">
              {site.secondaryCta}
            </MagneticButton>
          </div>
          <div className="hero-reveal mt-8 flex flex-wrap gap-2">
            {audience.map((item) => (
              <span key={item} className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-muted shadow-card">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-14 w-[min(1120px,92vw)] sm:mt-16 lg:mt-20">
          <div className="hero-reveal">
            <DashboardMockup />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1068px] flex-wrap items-center justify-center gap-3 px-5 text-center sm:mt-12 lg:mt-14 lg:px-8">
        <span className="text-sm font-bold text-muted">Cocok untuk:</span>
        {trustedBy.map((item) => (
          <span key={item} className="rounded-full bg-[#f4f7ff] px-3 py-1.5 text-sm font-bold text-ink">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
