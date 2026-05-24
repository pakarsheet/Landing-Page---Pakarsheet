"use client";

import { useLayoutEffect, useRef } from "react";
import { FileSpreadsheet } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { templates } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SectionHeader } from "./ui/SectionHeader";

gsap.registerPlugin(ScrollTrigger);

export function Templates() {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".reveal-item",
        { autoAlpha: 0, y: 30 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true }
        }
      );

      gsap.fromTo(
        ".template-card",
        { autoAlpha: 0, y: 58, rotate: 1.4, scale: 0.96 },
        {
          autoAlpha: 1,
          y: 0,
          rotate: 0,
          scale: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: ".template-grid", start: "top 80%", once: true }
        }
      );

      gsap.fromTo(
        ".template-preview-cell",
        { autoAlpha: 0.25, scaleX: 0.22, transformOrigin: "left center" },
        {
          autoAlpha: 1,
          scaleX: 1,
          duration: 0.34,
          stagger: { each: 0.01, from: "random" },
          ease: "power2.out",
          scrollTrigger: { trigger: ".template-grid", start: "top 72%", once: true }
        }
      );
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="templates" ref={ref} className="overflow-hidden bg-white px-5 py-10 lg:px-10">
      <div className="mx-auto max-w-[1380px] rounded-[32px] bg-ink px-5 py-20 text-white sm:px-8 lg:px-10 lg:py-24">
        <SectionHeader
          eyebrow="Pilihan template"
          icon={FileSpreadsheet}
          title="Mulai dari area bisnis yang paling bikin ribet."
          description="Setiap template dirancang untuk pekerjaan harian yang sering nyangkut di spreadsheet biasa."
          align="center"
          theme="dark"
        />
        <div className="template-grid mx-auto mt-12 grid max-w-[1068px] gap-5 md:grid-cols-2 lg:grid-cols-4">
          {templates.map((template, templateIndex) => (
            <article key={template.title} className="template-card group rounded-3xl border border-white/[0.12] bg-white/[0.08] p-6 shadow-card backdrop-blur transition duration-300 hover:-translate-y-2 hover:bg-white/[0.13] hover:shadow-[0_24px_80px_rgba(139,237,2,0.12)]">
              <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-ink">{template.badge}</span>
              <h3 className="mt-7 font-primary text-2xl font-semibold leading-[1.25] tracking-[-0.6px] text-white">{template.title}</h3>
              <p className="mt-3 font-secondary text-base leading-[1.56] text-white/68">{template.description}</p>
              <div className="mt-8 h-28 overflow-hidden rounded-2xl border border-white/[0.12] bg-[linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:20px_20px] p-3">
                <div className="grid h-full grid-cols-4 gap-2">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <span
                      key={index}
                      className={`template-preview-cell rounded-md transition duration-300 group-hover:bg-sheet ${
                        (index + templateIndex) % 5 === 0 ? "bg-sheet/90" : (index + templateIndex) % 3 === 0 ? "bg-cobalt/70" : "bg-white/22"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
