"use client";

import { useLayoutEffect, useRef } from "react";
import { MessageCircle, Quote } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { testimonials } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { SectionHeader } from "./ui/SectionHeader";

gsap.registerPlugin(ScrollTrigger);

// Split into two columns for masonry effect
const col1 = testimonials.filter((_, i) => i % 2 === 0); // 0,2,4,6
const col2 = testimonials.filter((_, i) => i % 2 === 1); // 1,3,5,7

type CardProps = {
  quote: string;
  name: string;
  role: string;
  accent: string;
  featured?: boolean;
};

function TestimonialCard({ quote, name, role, accent, featured }: CardProps) {
  return (
    <article
      className={`
        flex flex-col rounded-3xl border p-6 sm:p-7
        ${featured
          ? "border-transparent bg-ink text-white shadow-soft"
          : "border-line bg-white text-ink shadow-card"
        }
      `}
    >
      <Quote
        className={`mb-4 h-7 w-7 shrink-0 ${featured ? "text-sheet" : "text-line"}`}
        aria-hidden="true"
      />
      <p className={`flex-1 font-secondary text-[15px] leading-[1.65] sm:text-base ${featured ? "text-white/90" : "text-ink"}`}>
        "{quote}"
      </p>
      <div className="mt-6 flex items-center gap-3">
        <div
          className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-primary text-base font-semibold
            ${featured ? "bg-sheet text-ink" : `${accent} text-ink`}
          `}
        >
          {name.charAt(0)}
        </div>
        <div>
          <p className={`font-primary text-sm font-semibold ${featured ? "text-white" : "text-ink"}`}>
            {name}
          </p>
          <p className={`text-xs font-semibold ${featured ? "text-white/50" : "text-muted"}`}>
            {role}
          </p>
        </div>
      </div>
    </article>
  );
}

export function Testimonials() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);
  const col1Ref = useRef<HTMLDivElement | null>(null);
  const col2Ref = useRef<HTMLDivElement | null>(null);
  const mobileRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = sectionRef.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Header reveal — scoped via ref
      if (headerRef.current) {
        gsap.fromTo(
          headerRef.current,
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: root, start: "top 78%", once: true },
          }
        );
      }

      // Desktop cards stagger — scoped via ref, col1 from left, col2 from right
      if (col1Ref.current) {
        const col1Cards = gsap.utils.toArray<HTMLElement>(".testimonial-card", col1Ref.current);
        gsap.fromTo(
          col1Cards,
          { autoAlpha: 0, x: -32, y: 20 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.72,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current ?? root, start: "top 80%", once: true },
          }
        );
      }

      if (col2Ref.current) {
        const col2Cards = gsap.utils.toArray<HTMLElement>(".testimonial-card", col2Ref.current);
        gsap.fromTo(
          col2Cards,
          { autoAlpha: 0, x: 32, y: 20 },
          {
            autoAlpha: 1,
            x: 0,
            y: 0,
            duration: 0.72,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: gridRef.current ?? root, start: "top 80%", once: true },
          }
        );
      }

      // Mobile cards stagger — scoped via ref
      if (mobileRef.current) {
        const mobileCards = gsap.utils.toArray<HTMLElement>(".testimonial-card", mobileRef.current);
        gsap.fromTo(
          mobileCards,
          { autoAlpha: 0, y: 24 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: mobileRef.current, start: "top 82%", once: true },
          }
        );
      }
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={sectionRef} className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">

        {/* Header */}
        <div ref={headerRef} className="testimonials-header">
          <SectionHeader
            eyebrow="Cerita pengguna"
            icon={MessageCircle}
            title="Kerja harian lebih rapi, laporan lebih gampang dibaca."
            description="Pakarsheet dibuat untuk owner dan admin yang ingin spreadsheet tetap familiar, tapi tidak bikin kerja makin berat."
            align="left"
          />
        </div>

        {/* ── Mobile: horizontal scroll strip ── */}
        <div ref={mobileRef} className="testimonial-mobile mt-8 sm:hidden">
          <div
            className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {testimonials.map((item, i) => (
              <div
                key={item.name}
                className="testimonial-card w-[min(300px,78vw)] shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <TestimonialCard
                  quote={item.quote}
                  name={item.name}
                  role={item.role}
                  accent={item.accent}
                  featured={i === 4}
                />
              </div>
            ))}
          </div>
          {/* Scroll hint fade */}
          <div
            aria-hidden="true"
            className="pointer-events-none -mt-4 h-4 bg-gradient-to-t from-white to-transparent"
          />
        </div>

        {/* ── Desktop: 2-column masonry grid ── */}
        <div ref={gridRef} className="testimonials-grid mt-10 hidden gap-5 sm:grid sm:grid-cols-2">
          {/* Column 1 */}
          <div ref={col1Ref} className="testimonial-col-1 flex flex-col gap-5">
            {col1.map((item, i) => (
              <div key={item.name} className="testimonial-card">
                <TestimonialCard
                  quote={item.quote}
                  name={item.name}
                  role={item.role}
                  accent={item.accent}
                  featured={i === 2}
                />
              </div>
            ))}
          </div>
          {/* Column 2 — offset top for masonry feel */}
          <div ref={col2Ref} className="testimonial-col-2 flex flex-col gap-5 sm:mt-10">
            {col2.map((item, i) => (
              <div key={item.name} className="testimonial-card">
                <TestimonialCard
                  quote={item.quote}
                  name={item.name}
                  role={item.role}
                  accent={item.accent}
                  featured={i === 1}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
