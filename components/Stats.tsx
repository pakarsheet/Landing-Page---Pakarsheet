"use client";

import { stats } from "@/lib/data";
import { useGsapReveal } from "@/hooks/useGsapReveal";
import { StatCard } from "./ui/StatCard";

export function Stats() {
  const ref = useGsapReveal<HTMLElement>();

  return (
    <section ref={ref} className="bg-white px-5 py-16 lg:px-10">
      <div className="mx-auto grid max-w-[1068px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
