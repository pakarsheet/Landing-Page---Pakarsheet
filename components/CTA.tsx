"use client";

import { Sparkles } from "lucide-react";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { Button } from "./ui/Button";
import { site } from "@/lib/site";

export function CTA() {
  const ref = useGsapReveal<HTMLElement>();

  return (
    <section ref={ref} className="bg-white px-5 py-10 lg:px-10">
      <div className="mx-auto max-w-[1380px] rounded-[32px] bg-ink px-5 py-20 text-center text-white sm:px-8 lg:px-10 lg:py-24">
        <p className="reveal-item inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white/75">
          <Sparkles className="h-4 w-4" />
          Spreadsheet bisa lebih rapi mulai hari ini
        </p>
        <h2 className="reveal-item mt-6 text-balance font-primary text-[30px] font-semibold leading-[1.2] tracking-[-0.2px] sm:text-[40px] sm:tracking-[-1px] lg:text-[48px] lg:tracking-[-1.8px]">
          Bisnis kamu boleh masih pakai spreadsheet. Yang penting, jangan bikin kerjaan makin ribet.
        </h2>
        <p className="reveal-item mx-auto mt-5 max-w-2xl font-secondary text-[18px] font-normal leading-[1.56] text-white/70">
          Mulai dari template siap pakai, lalu rapikan alur data, laporan, dan dashboard bisnis.
        </p>
        <div className="reveal-item mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href={site.templateUrl} variant="secondary" size="lg">
            {site.primaryCta}
          </Button>
          <Button href={site.contactUrl} variant="ghost" size="lg" className="text-white hover:text-white/75">
            Tanya Dulu
          </Button>
        </div>
      </div>
    </section>
  );
}
