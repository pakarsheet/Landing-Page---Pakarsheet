"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, FileSpreadsheet, ArrowUpRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { tools, worksheets } from "@/lib/tools";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const CALC = tools.slice(0, 4);
const SHEETS = worksheets.slice(0, 2);

export function ToolsTeaser() {
  const ref = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".tt-head", { autoAlpha: 0, y: 22 }, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ref.current, start: "top 78%", once: true },
      });
      gsap.fromTo(".tt-item", { autoAlpha: 0, y: 24, scale: 0.97 }, {
        autoAlpha: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.065, ease: "power3.out",
        scrollTrigger: { trigger: ".tt-body", start: "top 82%", once: true },
      });
    }, ref);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={ref} className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">

        {/* ── Header ── */}
        <div className="tt-head mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">
              <Calculator className="h-4 w-4" />
              Tools Gratis
            </p>
            <h2 className="text-balance font-primary text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[40px] sm:tracking-[-1px] lg:text-[48px] lg:tracking-[-1.8px]">
              Hitung bisnis kamu<br className="hidden sm:block" /> sekarang.
            </h2>
            <p className="mt-3 font-secondary text-[16px] leading-[1.6] text-muted">
              {tools.length} kalkulator + {worksheets.length} worksheet — gratis, tanpa login.
            </p>
          </div>
          <Link
            href="/tools"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-line bg-white px-5 py-2.5 font-secondary text-sm font-semibold text-ink shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-ink sm:self-auto"
          >
            Lihat semua tools
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* ── Body ── */}
        <div className="tt-body space-y-4">

          {/* Row 1 — 4 kalkulator cards equal */}
          <div>
            <p className="mb-3 flex items-center gap-1.5 font-secondary text-[11px] font-bold uppercase tracking-widest text-muted/60">
              <Calculator className="h-3 w-3" /> Kalkulator
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {CALC.map((tool, i) => {
                const Icon = tool.icon;
                const isFeatured = i === 1; // second card gets ink treatment
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.slug}`}
                    className={`tt-item group flex flex-col rounded-3xl border p-5 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft ${
                      isFeatured
                        ? "border-transparent bg-ink"
                        : "border-line bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${
                        isFeatured ? "bg-sheet/20 text-sheet" : tool.accent
                      }`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <ArrowUpRight size={14} className={`transition duration-200 ${isFeatured ? "text-white/20 group-hover:text-sheet" : "text-line group-hover:text-cobalt"}`} />
                    </div>
                    <p className={`mt-4 font-secondary text-sm font-semibold leading-snug ${isFeatured ? "text-white" : "text-ink group-hover:text-cobalt"}`}>
                      {tool.shortTitle}
                    </p>
                    <p className={`mt-1.5 flex-1 font-secondary text-xs leading-[1.55] line-clamp-2 ${isFeatured ? "text-white/50" : "text-muted"}`}>
                      {tool.description}
                    </p>
                    <span className={`mt-3 font-secondary text-xs font-bold ${isFeatured ? "text-sheet" : "text-cobalt"}`}>
                      {tool.ctaText}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Row 2 — worksheet cards full width */}
          <div>
            <p className="mb-3 flex items-center gap-1.5 font-secondary text-[11px] font-bold uppercase tracking-widest text-muted/60">
              <FileSpreadsheet className="h-3 w-3" /> Worksheet
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {SHEETS.map((ws) => {
                const Icon = ws.icon;
                return (
                  <Link
                    key={ws.slug}
                    href={`/tools/${ws.slug}`}
                    className="tt-item group relative overflow-hidden rounded-3xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${ws.accent}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      {ws.estimatedTime && (
                        <span className="rounded-full border border-line bg-[#fafbff] px-2.5 py-1 font-secondary text-[10px] font-bold text-muted">
                          ⏱ {ws.estimatedTime}
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <p className="mt-4 font-secondary text-base font-semibold text-ink group-hover:text-cobalt">
                      {ws.shortTitle}
                    </p>
                    <p className="mt-1.5 font-secondary text-sm leading-[1.6] text-muted">
                      {ws.description}
                    </p>

                    {/* Footer */}
                    <div className="mt-5 flex items-center gap-1.5 font-secondary text-xs font-bold text-cobalt">
                      Buka worksheet
                      <ArrowRight size={13} className="transition duration-300 group-hover:translate-x-0.5" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
