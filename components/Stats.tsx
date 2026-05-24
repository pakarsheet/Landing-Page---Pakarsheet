"use client";

import { useLayoutEffect, useRef } from "react";
import { stats } from "@/lib/data";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { StatCard } from "./ui/StatCard";

gsap.registerPlugin(ScrollTrigger);

// Parse numeric value and suffix from stat string e.g. "40%" → { num: 40, suffix: "%" }
function parseStatValue(value: string): { num: number; prefix: string; suffix: string } {
  const match = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  if (!match) return { num: 0, prefix: "", suffix: value };
  return { num: parseFloat(match[2]), prefix: match[1], suffix: match[3] };
}

export function Stats() {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      // Reveal cards with stagger
      gsap.fromTo(
        ".stat-card",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
        }
      );

      // Count-up each stat value
      const valueEls = root.querySelectorAll<HTMLElement>(".stat-value");
      valueEls.forEach((el) => {
        const raw = el.dataset.value ?? "";
        const { num, prefix, suffix } = parseStatValue(raw);
        if (num === 0) return;

        const counter = { val: 0 };
        gsap.to(counter, {
          val: num,
          duration: 1.6,
          ease: "power2.out",
          delay: 0.3,
          scrollTrigger: { trigger: root, start: "top 80%", once: true },
          onUpdate() {
            const display = Number.isInteger(num)
              ? Math.round(counter.val)
              : counter.val.toFixed(1);
            el.textContent = `${prefix}${display}${suffix}`;
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={ref} className="bg-white px-4 py-12 sm:px-5 sm:py-16 lg:px-10">
      <div className="mx-auto grid max-w-[1068px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>
    </section>
  );
}
