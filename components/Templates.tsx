"use client";

import { useLayoutEffect, useRef } from "react";
import { X, Check, GitCompare, ArrowRight } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

const rows = [
  {
    aspect: "Struktur data",
    before: "Kolom dibuat sendiri, beda-beda tiap file",
    after: "Sudah tertata rapi, siap diisi dari hari pertama",
  },
  {
    aspect: "Laporan bulanan",
    before: "Bikin ulang dari nol setiap bulan",
    after: "Rekap otomatis, tinggal buka dan baca",
  },
  {
    aspect: "Dashboard",
    before: "Tidak ada, harus scroll panjang untuk cari angka",
    after: "Angka penting langsung kelihatan di satu tempat",
  },
  {
    aspect: "Input berulang",
    before: "Admin isi data yang sama di beberapa tempat",
    after: "Satu input, data tersebar otomatis ke tab lain",
  },
  {
    aspect: "Onboarding tim",
    before: "Harus jelasin satu-satu, sering salah format",
    after: "Format jelas, tim baru langsung paham alurnya",
  },
  {
    aspect: "Waktu setup",
    before: "Bisa berhari-hari bikin dari nol",
    after: "Langsung pakai, bisa jalan di hari yang sama",
  },
];

export function Templates() {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".cmp-header",
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true },
        }
      );
      gsap.fromTo(
        ".cmp-row",
        { autoAlpha: 0, y: 20 },
        {
          autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.07, ease: "power3.out",
          scrollTrigger: { trigger: ".cmp-list", start: "top 82%", once: true },
        }
      );
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={ref} className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">

        {/* Header */}
        <div className="cmp-header mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">
              <GitCompare className="h-4 w-4" />
              Perbandingan
            </p>
            <h2 className="text-balance font-primary text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[40px] sm:tracking-[-1px] lg:text-[48px] lg:tracking-[-1.8px]">
              Sheet biasa vs<br className="hidden sm:block" /> Pakarsheet.
            </h2>
          </div>
          <p className="max-w-xs font-secondary text-[16px] leading-[1.6] text-muted sm:text-right">
            Bukan soal ganti aplikasi. Tapi soal struktur yang bikin kerja harian jadi lebih enak.
          </p>
        </div>

        {/* Row list */}
        <div className="cmp-list flex flex-col gap-3">
          {rows.map((row) => (
            <div
              key={row.aspect}
              className="cmp-row group grid grid-cols-1 overflow-hidden rounded-2xl border border-line bg-white shadow-card transition duration-300 hover:shadow-soft sm:grid-cols-[160px_1fr_auto_1fr]"
            >
              {/* Aspect label */}
              <div className="flex items-center border-b border-line bg-[#fafbff] px-5 py-4 sm:border-b-0 sm:border-r">
                <span className="font-secondary text-sm font-bold text-ink">{row.aspect}</span>
              </div>

              {/* Before */}
              <div className="flex items-center gap-3 border-b border-line px-5 py-4 sm:border-b-0 sm:border-r">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coral/10">
                  <X size={11} strokeWidth={3} className="text-coral" />
                </span>
                <p className="font-secondary text-sm leading-[1.5] text-muted line-through decoration-muted/30">
                  {row.before}
                </p>
              </div>

              {/* Arrow */}
              <div className="hidden items-center justify-center px-3 sm:flex">
                <ArrowRight size={14} className="text-line transition duration-300 group-hover:text-cobalt group-hover:translate-x-0.5" />
              </div>

              {/* After */}
              <div className="flex items-center gap-3 bg-leaf/50 px-5 py-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sheet/25">
                  <Check size={11} strokeWidth={3} className="text-cobalt" />
                </span>
                <p className="font-secondary text-sm font-semibold leading-[1.5] text-ink">
                  {row.after}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="mt-8 text-center font-secondary text-sm text-muted">
          Tetap Google Sheets — tapi terasa seperti sistem kerja yang sudah disiapkan.
        </p>

      </div>
    </section>
  );
}
