"use client";

import { useLayoutEffect, useRef } from "react";
import { Clock, CreditCard, Wrench, ArrowRight, Check } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { site } from "@/lib/site";

gsap.registerPlugin(ScrollTrigger);

const alternatives = [
  {
    icon: Wrench,
    label: "Bikin sendiri dari nol",
    accent: "bg-blush text-coral",
    problems: [
      "Buang 10–20 jam kerja hanya untuk setup struktur dasar",
      "Belum tentu hasilnya rapi atau bisa dipakai tim",
      "Kalau ada yang salah, harus debug sendiri dari awal",
      "Tidak ada panduan — semua tergantung skill kamu",
    ],
    verdict: "Mahal di waktu, hasilnya tidak pasti.",
  },
  {
    icon: CreditCard,
    label: "Hire freelancer",
    accent: "bg-blush text-coral",
    problems: [
      "Biaya mulai Rp500rb – 2jt hanya untuk satu template",
      "Revisi bolak-balik, waktu tunggu bisa berminggu-minggu",
      "Kalau freelancer-nya hilang, tidak ada yang bisa maintain",
      "Tidak ada dokumentasi — tim bingung cara pakainya",
    ],
    verdict: "Mahal di uang, prosesnya tidak efisien.",
  },
  {
    icon: Clock,
    label: "Langganan software per bulan",
    accent: "bg-blush text-coral",
    problems: [
      "Bayar Rp150rb – 500rb setiap bulan, selamanya",
      "Tim harus belajar aplikasi baru dari nol",
      "Data tersimpan di platform orang lain",
      "Kalau berhenti bayar, akses langsung hilang",
    ],
    verdict: "Biaya terus jalan meski tidak aktif dipakai.",
  },
];

export function WhyNot() {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".wn-header",
        { autoAlpha: 0, y: 24 },
        { autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true } }
      );
      gsap.fromTo(".wn-card",
        { autoAlpha: 0, y: 32, scale: 0.97 },
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.65, stagger: 0.1, ease: "power3.out",
          scrollTrigger: { trigger: ".wn-grid", start: "top 82%", once: true } }
      );
    }, root);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={ref} className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">

        {/* Header */}
        <div className="wn-header mb-12 text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">
            <Wrench className="h-4 w-4" />
            Kenapa bukan yang lain?
          </p>
          <h2 className="text-balance font-primary text-[28px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[38px] sm:tracking-[-1px] lg:text-[44px] lg:tracking-[-1.8px]">
            Kenapa alternatif lain<br className="hidden sm:block" /> tidak worth it?
          </h2>
          <p className="mx-auto mt-4 max-w-md font-secondary text-[16px] leading-[1.65] text-muted">
            Sebelum kamu coba jalan lain, ini yang biasanya terjadi.
          </p>
        </div>

        {/* Cards */}
        <div className="wn-grid grid gap-5 sm:grid-cols-3">
          {alternatives.map((alt) => {
            const Icon = alt.icon;
            return (
              <article key={alt.label} className="wn-card flex flex-col rounded-3xl border border-line bg-white p-6 shadow-card">

                {/* Icon + label */}
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${alt.accent}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-secondary text-sm font-bold text-ink">{alt.label}</h3>
                </div>

                {/* Problems */}
                <ul className="mt-5 flex flex-col gap-3">
                  {alt.problems.map((p) => (
                    <li key={p} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-coral/10">
                        <span className="h-1.5 w-1.5 rounded-full bg-coral" />
                      </span>
                      <span className="font-secondary text-sm leading-[1.55] text-muted">{p}</span>
                    </li>
                  ))}
                </ul>

                {/* Verdict */}
                <div className="mt-5 rounded-2xl bg-[#fafbff] px-4 py-3">
                  <p className="font-secondary text-xs font-bold text-ink">{alt.verdict}</p>
                </div>

              </article>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-8 flex flex-col items-center gap-5 rounded-3xl bg-ink px-8 py-8 sm:flex-row sm:justify-between">
          <div>
            <p className="font-primary text-xl font-semibold text-white">
              Pakarsheet: Rp149rb, sekali bayar, langsung pakai.
            </p>
            <p className="mt-1 font-secondary text-sm text-white/50">
              Tidak ada waktu terbuang, tidak ada biaya bulanan, tidak ada ketergantungan.
            </p>
          </div>
          <a
            href={site.templateUrl}
            className="group flex shrink-0 items-center gap-2 rounded-2xl bg-sheet px-6 py-3.5 font-secondary text-sm font-bold text-ink transition duration-200 hover:bg-sheet/90"
          >
            Beli sekarang
            <ArrowRight size={14} className="transition duration-300 group-hover:translate-x-0.5" />
          </a>
        </div>

      </div>
    </section>
  );
}
