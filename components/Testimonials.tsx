"use client";

import { MessageCircle } from "lucide-react";
import { testimonials } from "@/lib/data";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { SectionHeader } from "./ui/SectionHeader";

export function Testimonials() {
  const ref = useGsapReveal<HTMLElement>();

  return (
    <section ref={ref} className="bg-white px-5 py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">
        <SectionHeader
          eyebrow="Cerita pengguna"
          icon={MessageCircle}
          title="Kerja harian lebih rapi, laporan lebih gampang dibaca."
          description="Pakarsheet dibuat untuk owner dan admin yang ingin spreadsheet tetap familiar, tapi tidak bikin kerja makin berat."
          align="center"
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {testimonials.map((item) => (
            <article key={item.name} className="reveal-item rounded-[28px] border border-line bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
              <p className="font-secondary text-xl font-semibold leading-[1.56] text-ink">"{item.quote}"</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-leaf font-primary text-lg font-semibold text-ink">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <p className="font-primary font-semibold text-ink">{item.name}</p>
                  <p className="text-sm font-semibold text-muted">{item.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
