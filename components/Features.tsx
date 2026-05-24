"use client";

import { LayoutDashboard } from "lucide-react";
import { features } from "@/lib/data";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { FeatureCard } from "./ui/FeatureCard";
import { SectionHeader } from "./ui/SectionHeader";

export function Features() {
  const ref = useGsapReveal<HTMLElement>();

  return (
    <section id="features" ref={ref} className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">
        <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr]">
          <SectionHeader
            eyebrow="Fitur utama"
            icon={LayoutDashboard}
            title="Dari sheet berantakan ke sistem kerja yang enak dipakai."
            description="Pakarsheet menyiapkan struktur, formula, dashboard, dan alur kerja supaya spreadsheet terasa lebih niat tanpa bikin software dari nol."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            {features.map((item) => (
              <FeatureCard key={item.title} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
