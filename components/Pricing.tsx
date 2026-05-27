"use client";

import { useLayoutEffect, useRef } from "react";
import {
  WalletCards, Check, ArrowRight, Zap, User, Clock,
  FileSpreadsheet, LayoutDashboard, BookOpen, MessageCircle, Shield,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { site } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const included = [
  { icon: FileSpreadsheet, label: "Template siap pakai",          accent: "bg-sheet text-ink"   },
  { icon: LayoutDashboard, label: "Dashboard & formula otomatis", accent: "bg-sky text-cobalt"  },
  { icon: BookOpen,        label: "Panduan penggunaan lengkap",   accent: "bg-lilac text-ink"   },
  { icon: MessageCircle,   label: "Support setup via WhatsApp",   accent: "bg-leaf text-cobalt" },
  { icon: Shield,          label: "Lisensi 1 akun, lifetime",     accent: "bg-sky text-cobalt"  },
];

export function Pricing() {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".price-header",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true } }
      );
      gsap.fromTo(".price-main",
        { autoAlpha: 0, y: 36, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: ".price-main", start: "top 82%", once: true } }
      );
    }, root);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="pricing" ref={ref} className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">

        {/* Header */}
        <div className="price-header mb-10 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">
            <WalletCards className="h-4 w-4" />
            Harga
          </p>
          <h2 className="text-balance font-primary text-[32px] font-semibold leading-[1.1] tracking-[-0.8px] text-ink sm:text-[44px] sm:tracking-[-1.5px] lg:text-[52px] lg:tracking-[-2.5px]">
            Satu harga. Sekali bayar.<br className="hidden sm:block" /> Selamanya.
          </h2>
          <p className="mx-auto mt-4 max-w-sm font-secondary text-[16px] leading-[1.65] text-muted">
            Tidak ada langganan, tidak ada biaya tersembunyi.
          </p>
        </div>

        {/* Main card */}
        <div className="price-main overflow-hidden rounded-[28px] border border-line bg-white shadow-soft">
          <div className="grid lg:grid-cols-[1fr_1px_1fr]">

            {/* Left — price + CTA */}
            <div className="flex flex-col justify-between p-8 lg:p-10">

              {/* Price */}
              <div>
                <p className="font-secondary text-xs font-semibold uppercase tracking-widest text-muted/50">
                  Harga template
                </p>
                <strong className="mt-3 block font-primary text-[72px] font-bold leading-none tracking-[-4px] text-ink">
                  Rp149rb
                </strong>
                <p className="mt-3 font-secondary text-sm text-muted">
                  sekali bayar · lifetime · 1 akun
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-col gap-3">
                {[
                  { icon: Zap,   label: "Lifetime access",   sub: "Bayar sekali, pakai selamanya"     },
                  { icon: User,  label: "1 akun / lisensi",  sub: "Untuk satu pengguna"               },
                  { icon: Clock, label: "Langsung bisa pakai", sub: "Tidak perlu setup panjang"       },
                ].map(({ icon: Icon, label, sub }) => (
                  <div key={label} className="flex items-center gap-3 rounded-2xl border border-line bg-[#fafbff] px-4 py-3">
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
                href={site.templateUrl}
                className="group mt-8 flex items-center justify-center gap-2 rounded-2xl bg-ink px-6 py-4 font-secondary text-sm font-bold text-white transition duration-200 hover:bg-ink/85"
              >
                Beli sekarang — Rp149rb
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
                  const Icon = item.icon;
                  return (
                    <li key={item.label} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${item.accent}`}>
                        <Icon className="h-5 w-5" />
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
                  <span className="font-bold">Rp149rb</span>.{" "}
                  <span className="text-cobalt">Tidak ada add-on berbayar.</span>
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
