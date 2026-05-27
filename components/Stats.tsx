"use client";

import { useLayoutEffect, useRef } from "react";
import { stats } from "@/lib/data";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

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
      gsap.fromTo(
        ".stat-card",
        { autoAlpha: 0, y: 28, scale: 0.97 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.09,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        }
      );

      const valueEls = root.querySelectorAll<HTMLElement>(".stat-value");
      valueEls.forEach((el) => {
        const raw = el.dataset.value ?? "";
        const { num, prefix, suffix } = parseStatValue(raw);
        if (num === 0) return;

        const counter = { val: 0 };
        gsap.to(counter, {
          val: num,
          duration: 1.8,
          ease: "power2.out",
          delay: 0.2,
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
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
      <div className="mx-auto max-w-[1068px]">

        {/* Single card row — horizontal layout */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <article
                key={stat.label}
                className="stat-card group flex flex-col gap-4 rounded-3xl border border-line bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
              >
                {/* Top row: icon + value side by side */}
                <div className="flex items-start justify-between gap-3">
                  <strong
                    className="stat-value font-primary text-[42px] font-semibold leading-none tracking-[-2px] text-ink"
                    data-value={stat.value}
                  >
                    {stat.value}
                  </strong>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-leaf text-cobalt transition duration-300 group-hover:scale-105">
                    <Icon className="h-5 w-5 transition duration-300 group-hover:-rotate-6" />
                  </div>
                </div>

                {/* Label */}
                <span className="font-secondary text-sm font-semibold leading-snug text-ink">
                  {stat.label}
                </span>

                {/* Divider */}
                <div className="h-px w-full bg-line" />

                {/* Description */}
                <p className="font-secondary text-sm leading-[1.56] text-muted">
                  {stat.description}
                </p>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}
