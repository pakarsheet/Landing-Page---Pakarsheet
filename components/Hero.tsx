"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagneticButton } from "./MagneticButton";
import { SheetGrid } from "./SheetGrid";
import { site } from "@/lib/site";
import { audience, trustedBy } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const HERO_CELLS = [
  { col: 1, row: 1, delay: "0s" },
  { col: 4, row: 2, delay: "0.6s" },
  { col: 7, row: 1, delay: "1.2s" },
  { col: 2, row: 4, delay: "1.8s" },
  { col: 6, row: 5, delay: "0.9s" },
  { col: 3, row: 6, delay: "2.1s" },
  { col: 8, row: 3, delay: "1.5s" },
];

// Struktur:
// .dashboard-wrapper  → float bob (di luar overflow-hidden agar tidak terpotong)
//   .dashboard-shell  → overflow-hidden + shadow + entrance anim
//     <Image>         → gambar, parallax via translateY pada shell
function DashboardMockup() {
  return (
    <div className="dashboard-wrapper relative mx-auto w-full max-w-[1120px]">
      <div className="dashboard-shell overflow-hidden rounded-xl border border-white/80 shadow-[0_34px_100px_rgba(1,17,43,0.18)] sm:rounded-2xl">
        <Image
          src="/dashboard-preview.png"
          alt="Pakarsheet Dashboard Preview"
          width={1120}
          height={840}
          className="w-full object-cover object-top"
          priority
        />
      </div>
    </div>
  );
}

export function Hero({ contactUrl }: { contactUrl?: string }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;
    const root = rootRef.current;

    const ctx = gsap.context(() => {
      // ── 1. Entrance timeline ───────────────────────────────
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl
        .fromTo(
          ".hero-panel",
          { autoAlpha: 0, y: 18, scale: 0.985 },
          { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 }
        )
        .fromTo(
          ".hero-reveal",
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.08 },
          "-=0.35"
        )
        .fromTo(
          ".hero-word",
          { autoAlpha: 0, yPercent: 88, rotateX: -18 },
          { autoAlpha: 1, yPercent: 0, rotateX: 0, duration: 0.7, stagger: 0.035 },
          "-=0.52"
        )
        // Shell masuk dari bawah dengan sedikit 3D tilt
        .fromTo(
          ".dashboard-shell",
          { autoAlpha: 0, y: 72, scale: 0.96, rotateX: 8, transformPerspective: 1000 },
          { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 1.0, ease: "power4.out" },
          "-=0.3"
        );

      // ── 2. Float bob — pada wrapper (di luar clip) ─────────
      gsap.to(".dashboard-wrapper", {
        y: -10,
        duration: 3.0,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.5,
      });

      // ── 3. Parallax scroll — geser shell (bukan image) ─────
      // Shell bergerak ke atas saat scroll, gambar ikut karena di dalam
      // Tidak ada overflow-hidden di wrapper jadi tidak terpotong
      gsap.to(".dashboard-shell", {
        y: -28,
        ease: "none",
        scrollTrigger: {
          trigger: ".dashboard-wrapper",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,
        },
      });

    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={rootRef} className="relative overflow-x-clip bg-white px-3 pb-16 pt-3 sm:px-5 sm:pt-5 lg:px-10">
      <div className="hero-panel relative mx-auto max-w-[1380px] rounded-[20px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-4 pb-0 pt-[140px] sm:rounded-[32px] sm:px-8 sm:pb-0 sm:pt-[160px] lg:px-10 lg:pb-0 lg:pt-[210px]">
        <SheetGrid cells={HERO_CELLS} />

        <div className="relative z-10 mx-auto flex max-w-[1000px] flex-col items-center text-center">
          <p className="hero-reveal inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-muted shadow-card">
            <CheckCircle2 className="h-4 w-4" />
            Template rasa sistem kerja
          </p>
          <h1 className="hero-reveal mt-6 text-balance font-primary text-[42px] font-semibold leading-[1.1] tracking-[-1px] text-ink sm:text-[60px] sm:tracking-[-2px] lg:text-[80px] lg:tracking-[-3.5px]">
            {site.tagline.split(" ").map((word) => (
              <span key={word} className="hero-word inline-block origin-bottom pr-[0.18em]">
                {word}
              </span>
            ))}
          </h1>
          <p className="hero-reveal mt-6 max-w-3xl text-pretty font-secondary text-[20px] font-normal leading-[1.56] text-muted sm:text-[22px]">
            Pakarsheet bantu bisnis naik level dari spreadsheet biasa menjadi sistem kerja yang lebih rapi, otomatis, dan mudah dipantau.
          </p>
          <div className="hero-reveal mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <MagneticButton href={site.templateUrl} size="lg">
              {site.primaryCta}
            </MagneticButton>
            <MagneticButton href={contactUrl ?? site.contactUrl} variant="secondary" size="lg">
              {site.secondaryCta}
            </MagneticButton>
          </div>
          <div className="hero-reveal mt-8 flex flex-wrap justify-center gap-2 sm:justify-start">
            {audience.map((item) => (
              <span key={item} className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-muted shadow-card">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-2 w-full px-1 sm:mt-8 sm:w-[min(1120px,92vw)] sm:px-0 lg:mt-10 -mb-32 sm:-mb-48 lg:-mb-64">
          <div className="hero-reveal">
            <DashboardMockup />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1068px] flex-wrap items-center justify-center gap-3 px-5 pt-32 text-center sm:mt-12 sm:pt-48 lg:mt-14 lg:px-8 lg:pt-64">
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
