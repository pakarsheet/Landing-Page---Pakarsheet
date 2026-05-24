"use client";

import { WalletCards } from "lucide-react";
import { pricing } from "@/lib/data";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { PricingCard } from "./ui/PricingCard";
import { SectionHeader } from "./ui/SectionHeader";

export function Pricing() {
  const ref = useGsapReveal<HTMLElement>();

  return (
    <section id="pricing" ref={ref} className="bg-white px-5 py-10 lg:px-10">
      <div className="mx-auto max-w-[1380px] rounded-[32px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        <SectionHeader
          eyebrow="Harga"
          icon={WalletCards}
          title="Pilih paket yang paling dekat dengan kebutuhan kerja kamu."
          description="Mulai dari satu template sampai bundle untuk merapikan beberapa bagian bisnis sekaligus."
          align="center"
        />
        <div className="mx-auto mt-12 grid max-w-[1068px] gap-5 lg:grid-cols-3">
          {pricing.map((item) => (
            <PricingCard key={item.name} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
