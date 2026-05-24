"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { tools } from "@/lib/tools";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { ToolCard } from "./ui/ToolCard";

gsap.registerPlugin(ScrollTrigger);

export function ToolsGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".tools-grid-header",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1, y: 0, duration: 0.65, ease: "power3.out",
          scrollTrigger: { trigger: ".tools-grid-header", start: "top 88%" },
        }
      );
      gsap.fromTo(
        ".tool-card",
        { autoAlpha: 0, y: 36 },
        {
          autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: "power3.out",
          scrollTrigger: { trigger: ".tools-bento", start: "top 85%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} id="tools" className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">

        {/* Section header */}
        <div className="tools-grid-header mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold text-cobalt shadow-card">
              <Sparkles className="h-4 w-4" />
              Semua kalkulator
            </p>
            <h2 className="mt-4 font-primary text-[30px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink sm:text-[40px] sm:tracking-[-1px]">
              Pilih yang kamu butuhkan.
            </h2>
            <p className="mt-3 font-secondary text-base leading-[1.56] text-muted">
              Semua gratis, semua real-time. Tidak perlu daftar atau install apapun.
            </p>
          </div>
          <Link
            href="/shop"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-5 py-2.5 font-secondary text-sm font-semibold text-ink shadow-card transition duration-300 hover:-translate-y-0.5 hover:border-ink"
          >
            Lihat template premium
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 6-card grid — 2 rows × 3 cols */}
        <div className="tools-bento grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-10 flex flex-col items-center gap-4 rounded-3xl border border-line bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-6 py-8 text-center sm:px-10">
          <p className="font-primary text-[22px] font-semibold leading-[1.25] tracking-[-0.5px] text-ink sm:text-[28px]">
            Mau yang lebih dari sekadar kalkulator?
          </p>
          <p className="max-w-lg font-secondary text-base leading-[1.56] text-muted">
            Template Google Sheets premium Pakarsheet sudah punya semua formula ini — tinggal isi data, laporan langsung jadi.
          </p>
          <Link
            href="/shop"
            className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 font-secondary text-sm font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-cobalt"
          >
            <span className="relative block overflow-hidden">
              <span className="block transition duration-300 group-hover:-translate-y-full">Lihat semua template</span>
              <span className="absolute left-0 top-full block transition duration-300 group-hover:-translate-y-full">Lihat semua template</span>
            </span>
            <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

      </div>
    </section>
  );
}
