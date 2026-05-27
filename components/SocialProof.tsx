"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const metrics = [
  { value: "1.000+", label: "bisnis sudah pakai" },
  { value: "4.9", label: "rating rata-rata" },
  { value: "1 hari", label: "langsung bisa jalan" },
];

const avatarColors = [
  "bg-cobalt text-white",
  "bg-sheet text-ink",
  "bg-sky text-cobalt",
  "bg-lilac text-ink",
  "bg-ink text-white",
];

const avatarInitials = ["R", "D", "B", "S", "A"];

export function SocialProof() {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".sp-inner",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.65,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 88%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={ref} className="bg-white px-4 pb-2 pt-0 sm:px-5 lg:px-10">
      <div className="sp-inner mx-auto max-w-[1068px]">
        <div className="flex flex-col items-center justify-between gap-6 rounded-3xl border border-line bg-white px-6 py-5 shadow-card sm:flex-row sm:gap-4 sm:px-8">

          {/* Avatars + rating */}
          <div className="flex items-center gap-4">
            {/* Stacked avatars */}
            <div className="flex -space-x-2.5">
              {avatarInitials.map((initial, i) => (
                <div
                  key={i}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-white font-primary text-xs font-bold ${avatarColors[i]}`}
                >
                  {initial}
                </div>
              ))}
            </div>

            {/* Stars + text */}
            <div>
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-sheet text-sheet" />
                ))}
              </div>
              <p className="mt-0.5 font-secondary text-xs font-semibold text-muted">
                Dipercaya <span className="font-bold text-ink">1.000+</span> bisnis di Indonesia
              </p>
            </div>
          </div>

          {/* Divider — desktop only */}
          <div className="hidden h-10 w-px bg-line sm:block" />

          {/* Metrics */}
          <div className="flex w-full items-center justify-around gap-4 sm:w-auto sm:justify-end sm:gap-8">
            {metrics.map((m, i) => (
              <div key={m.label} className="flex flex-col items-center gap-0.5 sm:items-start">
                <strong className="font-primary text-xl font-semibold leading-none tracking-[-0.5px] text-ink">
                  {m.value}
                </strong>
                <span className="font-secondary text-xs font-medium text-muted">{m.label}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
