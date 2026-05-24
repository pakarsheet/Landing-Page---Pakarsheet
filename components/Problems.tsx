"use client";

import { AlertCircle } from "lucide-react";
import { problems } from "@/lib/data";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { FeatureCard } from "./ui/FeatureCard";
import { SectionHeader } from "./ui/SectionHeader";

export function Problems() {
  const ref = useGsapReveal<HTMLElement>();

  return (
    <section ref={ref} className="bg-white px-3 py-6 sm:px-5 sm:py-10 lg:px-10">
      <div className="mx-auto max-w-[1380px] rounded-[20px] bg-[linear-gradient(180deg,#f2ffe0_0%,#eaf0ff_100%)] px-4 py-14 sm:rounded-[32px] sm:px-8 lg:px-10 lg:py-24">
        <SectionHeader
          eyebrow="Masalah yang sering kejadian"
          icon={AlertCircle}
          title="Spreadsheet-mu nggak salah. Tapi kalau makin ribet, itu tanda strukturnya perlu dibenahi."
          description="Banyak bisnis masih nyaman pakai Google Sheets. Masalah mulai muncul saat data makin banyak, orang makin banyak, dan laporan harus makin cepat."
          align="center"
        />
        <div className="mx-auto mt-12 grid max-w-[1068px] gap-5 md:grid-cols-3">
          {problems.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
