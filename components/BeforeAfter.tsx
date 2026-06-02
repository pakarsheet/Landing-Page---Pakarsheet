"use client";

import { useGsapReveal } from "@/hooks/useGsapReveal";
import { BeforeAfterSlider } from "./ui/BeforeAfterSlider";
import { Sparkles } from "lucide-react";
import { SectionHeader } from "./ui/SectionHeader";

export function BeforeAfter() {
  const ref = useGsapReveal<HTMLElement>();

  return (
    <section ref={ref} className="bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-10">
      <div className="mx-auto max-w-[1068px]">
        <SectionHeader
          eyebrow="Perbedaan Nyata"
          icon={Sparkles}
          title="Bukti nyata, bukan cuma janji."
          description="Geser slider di bawah untuk melihat bedanya bekerja dengan spreadsheet manual yang berantakan versus sistem Pakarsheet yang sudah terstruktur rapi."
          align="center"
        />

        <div className="mt-12 md:mt-16 mx-auto w-full max-w-[900px] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] rounded-2xl md:rounded-3xl border border-line bg-white p-2 sm:p-4">
          <BeforeAfterSlider
            beforeImage="/before.png"
            afterImage="/after.png"
            beforeLabel="Spreadsheet Manual"
            afterLabel="Pakarsheet System"
          />
        </div>
      </div>
    </section>
  );
}
