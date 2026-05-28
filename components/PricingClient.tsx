"use client";

import { useLayoutEffect, useRef } from "react";
import {
  Check, ArrowRight, Zap, User, Clock,
  FileSpreadsheet, LayoutDashboard, BookOpen, MessageCircle, Shield,
  type LucideIcon,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Map icon names to components so we can pass them across the server/client boundary
const ICON_MAP: Record<string, LucideIcon> = {
  FileSpreadsheet,
  LayoutDashboard,
  BookOpen,
  MessageCircle,
  Shield,
};

type IncludedItem = {
  label: string;
  accent: string;
  iconName: string;
};

type Props = {
  price: string;
  ctaUrl: string;
  productSlug?: string;
  included: IncludedItem[];
};

const trustBadges = [
  { icon: Zap,   label: "Lifetime access",     sub: "Bayar sekali, pakai selamanya" },
  { icon: User,  label: "1 akun / lisensi",    sub: "Untuk satu pengguna"           },
  { icon: Clock, label: "Langsung bisa pakai", sub: "Tidak perlu setup panjang"     },
];

export function PricingClient({ price, ctaUrl, included }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root,
        { autoAlpha: 0, y: 36, scale: 0.97 },
        {
          autoAlpha: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 82%", once: true },
        }
      );
    }, root);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-[28px] border border-line bg-white shadow-soft"
    >
      <div className="grid lg:grid-cols-[1fr_1px_1fr]">

        {/* Left — price + CTA */}
        <div className="flex flex-col justify-between p-8 lg:p-10">

          {/* Price */}
          <div>
            <p className="font-secondary text-xs font-semibold uppercase tracking-widest text-muted/50">
              Harga template
            </p>
            <strong className="mt-3 block font-primary text-[72px] font-bold leading-none tracking-[-4px] text-ink">
              {price}
            </strong>
            <p className="mt-3 font-secondary text-sm text-muted">
              sekali bayar · lifetime · 1 akun
            </p>
          </div>

          {/* Trust badges */}
          <div className="mt-8 flex flex-col gap-3">
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-2xl border border-line bg-[#fafbff] px-4 py-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-leaf text-cobalt">
                  <Icon size={15} />
                </div>
                <div>
                  <p className="font-secondary text-sm font-bold text-ink">{label}</p>
                  <p className="font-secondary text-xs text-muted">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <a
            href={ctaUrl}
            target={ctaUrl.startsWith("http") ? "_blank" : undefined}
            rel={ctaUrl.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group mt-8 flex items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-4 font-secondary text-sm font-bold text-white transition duration-200 hover:bg-ink/85"
          >
            Beli sekarang — {price}
            <ArrowRight size={14} className="transition duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Divider */}
        <div className="hidden w-px bg-line lg:block" />

        {/* Right — what's included */}
        <div className="border-t border-line p-8 lg:border-0 lg:p-10">
          <p className="mb-6 font-secondary text-xs font-bold uppercase tracking-widest text-muted/50">
            Yang kamu dapat
          </p>

          <ul className="flex flex-col divide-y divide-line">
            {included.map((item) => {
              const Icon = ICON_MAP[item.iconName];
              return (
                <li key={item.label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.accent}`}>
                    {Icon && <Icon className="h-5 w-5" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={13} className="shrink-0 text-cobalt" />
                    <span className="font-secondary text-sm font-semibold text-ink">{item.label}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Bottom note */}
          <div className="mt-6 rounded-2xl bg-leaf px-5 py-4">
            <p className="font-secondary text-sm font-semibold text-ink">
              Semua sudah termasuk dalam{" "}
              <span className="font-bold">{price}</span>.{" "}
              <span className="text-cobalt">Tidak ada add-on berbayar.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
