"use client";

import { useRef } from "react";
import { MessageCircle, Quote } from "lucide-react";
import { testimonials } from "@/lib/data";
import { SectionHeader } from "./ui/SectionHeader";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">

        {/* Header */}
        <SectionHeader
          eyebrow="Cerita pengguna"
          icon={MessageCircle}
          title="Kerja harian lebih rapi, laporan lebih gampang dibaca."
          description="Pakarsheet dibuat untuk owner dan admin yang ingin spreadsheet tetap familiar, tapi tidak bikin kerja makin berat."
          align="left"
        />

        {/* ── Mobile: horizontal scroll strip ── */}
        <div className="mt-8 sm:hidden">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {testimonials.map((item, i) => (
              <div
                key={item.name}
                className="w-[min(300px,78vw)] shrink-0"
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
        <div className="mt-10 hidden gap-5 sm:grid sm:grid-cols-2">
          {/* Column 1 */}
          <div className="flex flex-col gap-5">
            {col1.map((item, i) => (
              <TestimonialCard
                key={item.name}
                quote={item.quote}
                name={item.name}
                role={item.role}
                accent={item.accent}
                featured={i === 2} // 5th item overall (index 4) = col1[2]
              />
            ))}
          </div>
          {/* Column 2 — offset top for masonry feel */}
          <div className="flex flex-col gap-5 sm:mt-10">
            {col2.map((item, i) => (
              <TestimonialCard
                key={item.name}
                quote={item.quote}
                name={item.name}
                role={item.role}
                accent={item.accent}
                featured={i === 1} // 4th item overall (index 3) = col2[1]
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
