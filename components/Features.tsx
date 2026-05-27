"use client";

import { useLayoutEffect, useRef } from "react";
import {
  LayoutDashboard,
  DatabaseZap,
  Sparkles,
  UsersRound,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

/* ── Mini visuals ─────────────────────────────────────── */

function SheetVisual() {
  const rows = [
    { label: "Pemasukan", value: "Rp42,8jt", up: true },
    { label: "Pengeluaran", value: "Rp27,1jt", up: false },
    { label: "Cashflow", value: "Rp15,7jt", up: true },
    { label: "Piutang", value: "Rp8,2jt", up: null },
  ];
  return (
    <div className="mt-auto pt-6">
      <div className="overflow-hidden rounded-2xl border border-line bg-[#fafbff]">
        <div className="grid grid-cols-3 border-b border-line px-4 py-2">
          {["Kategori", "Jumlah", ""].map((h) => (
            <span key={h} className="font-secondary text-[10px] font-bold uppercase tracking-wider text-muted/50">{h}</span>
          ))}
        </div>
        {rows.map((r) => (
          <div key={r.label} className="grid grid-cols-3 items-center border-b border-line/60 px-4 py-2.5 last:border-0">
            <span className="font-secondary text-xs text-muted">{r.label}</span>
            <span className="font-secondary text-xs font-bold text-ink">{r.value}</span>
            {r.up === true && <span className="font-secondary text-[10px] font-bold text-cobalt">↑ naik</span>}
            {r.up === false && <span className="font-secondary text-[10px] font-bold text-coral">↓ turun</span>}
            {r.up === null && <span className="font-secondary text-[10px] text-muted/40">—</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardVisual() {
  const bars = [40, 65, 50, 80, 60, 90, 72, 95];
  const max = Math.max(...bars);
  return (
    <div className="mt-auto pt-5">
      <div className="flex items-end justify-between mb-3">
        <div>
          <p className="font-primary text-3xl font-bold leading-none tracking-tight text-ink">Rp24,8jt</p>
          <p className="mt-1 font-secondary text-xs text-muted">Revenue bulan ini</p>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-leaf px-2.5 py-1 font-secondary text-xs font-bold text-cobalt">
          <TrendingUp size={10} />+18%
        </span>
      </div>
      <div className="flex items-end gap-1.5 h-16 rounded-2xl bg-[#fafbff] border border-line px-3 py-3">
        {bars.map((v, i) => (
          <div
            key={i}
            className={`flex-1 rounded-t-sm ${i === bars.length - 1 ? "bg-sheet" : i >= bars.length - 3 ? "bg-cobalt/70" : "bg-line"}`}
            style={{ height: `${(v / max) * 100}%` }}
          />
        ))}
      </div>
    </div>
  );
}

function AutoVisual() {
  const steps = [
    { label: "Input data harian", done: true },
    { label: "Formula otomatis jalan", done: true },
    { label: "Rekap bulanan siap", done: true },
  ];
  return (
    <div className="mt-auto pt-5 flex flex-col gap-2">
      {steps.map((s) => (
        <div key={s.label} className="flex items-center gap-3 rounded-xl border border-line bg-[#fafbff] px-4 py-2.5">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sheet/30">
            <CheckCircle2 size={11} className="text-cobalt" />
          </span>
          <span className="font-secondary text-xs font-semibold text-ink">{s.label}</span>
          <span className="ml-auto rounded-full bg-leaf px-2 py-0.5 font-secondary text-[9px] font-bold text-cobalt">Auto</span>
        </div>
      ))}
    </div>
  );
}

function TeamVisual() {
  const roles = [
    { initial: "O", role: "Owner", bg: "bg-ink text-white" },
    { initial: "A", role: "Admin", bg: "bg-cobalt text-white" },
    { initial: "S", role: "Sales", bg: "bg-sheet text-ink" },
    { initial: "F", role: "Finance", bg: "bg-sky text-cobalt" },
  ];
  return (
    <div className="mt-auto pt-5 grid grid-cols-2 gap-2">
      {roles.map((r) => (
        <div key={r.role} className="flex items-center gap-2.5 rounded-xl border border-line bg-[#fafbff] px-3 py-2.5">
          <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl font-primary text-sm font-bold ${r.bg}`}>{r.initial}</span>
          <span className="font-secondary text-xs font-semibold text-ink">{r.role}</span>
        </div>
      ))}
    </div>
  );
}

function SyncVisual() {
  return (
    <div className="mt-auto pt-5">
      <div className="flex items-center justify-between gap-2 rounded-2xl border border-line bg-[#fafbff] px-4 py-4">
        {[
          { icon: DatabaseZap, label: "Input", bg: "bg-leaf text-cobalt" },
          { icon: RefreshCw, label: "Sync", bg: "bg-sheet text-ink" },
          { icon: LayoutDashboard, label: "Pantau", bg: "bg-sky text-cobalt" },
        ].map(({ icon: Icon, label, bg }, i) => (
          <div key={label} className="flex flex-1 flex-col items-center gap-2">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${bg}`}>
              <Icon size={16} />
            </div>
            <span className="font-secondary text-[10px] font-semibold text-muted">{label}</span>
            {i < 2 && (
              <div className="absolute" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GrowthVisual() {
  const items = [
    { label: "Template siap pakai", pct: 100, color: "bg-sheet" },
    { label: "Custom & kembangkan", pct: 65, color: "bg-cobalt" },
  ];
  return (
    <div className="mt-auto pt-5 flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="mb-1.5 flex justify-between">
            <span className="font-secondary text-xs font-semibold text-ink">{item.label}</span>
            <span className="font-secondary text-xs font-bold text-muted">{item.pct}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-line">
            <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Card definitions ─────────────────────────────────── */
const CARDS = [
  {
    id: "struktur",
    title: "Struktur data rapi",
    description: "Tabel, kolom, dan alur input dibuat jelas supaya tim tidak bingung mulai dari mana.",
    icon: DatabaseZap,
    accent: "bg-sheet text-ink",
    visual: "sheet",
  },
  {
    id: "dashboard",
    title: "Dashboard siap pantau",
    description: "Angka penting langsung kebaca tanpa harus bongkar banyak tab.",
    icon: LayoutDashboard,
    accent: "bg-sky text-cobalt",
    visual: "dashboard",
  },
  {
    id: "laporan",
    title: "Laporan lebih otomatis",
    description: "Formula dan summary sudah disiapkan agar rekap kerja tidak selalu mulai dari nol.",
    icon: Sparkles,
    accent: "bg-lilac text-ink",
    visual: "auto",
  },
  {
    id: "tim",
    title: "Mudah dipakai tim",
    description: "Bahasa sheet dibuat dekat dengan kerja harian owner, admin, sales, dan finance.",
    icon: UsersRound,
    accent: "bg-sky text-cobalt",
    visual: "team",
  },
  {
    id: "software",
    title: "Rasa mini software",
    description: "Tetap Google Sheets, tapi terasa lebih terarah seperti sistem kerja siap pakai.",
    icon: ShieldCheck,
    accent: "bg-sheet text-ink",
    visual: "sync",
  },
  {
    id: "kembang",
    title: "Siap dikembangkan",
    description: "Cocok jadi pondasi sebelum bisnis butuh software custom yang lebih besar.",
    icon: CheckCircle2,
    accent: "bg-sky text-cobalt",
    visual: "growth",
  },
];

function Visual({ id }: { id: string }) {
  if (id === "sheet") return <SheetVisual />;
  if (id === "dashboard") return <DashboardVisual />;
  if (id === "auto") return <AutoVisual />;
  if (id === "team") return <TeamVisual />;
  if (id === "sync") return <SyncVisual />;
  if (id === "growth") return <GrowthVisual />;
  return null;
}

/* ── Main component ───────────────────────────────────── */
export function Features() {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(".feat-header", { autoAlpha: 0, y: 24 }, {
        autoAlpha: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: root, start: "top 78%", once: true },
      });
      gsap.fromTo(".feat-card", { autoAlpha: 0, y: 32, scale: 0.97 }, {
        autoAlpha: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.08, ease: "power3.out",
        scrollTrigger: { trigger: ".feat-bento", start: "top 82%", once: true },
      });
    }, root);
    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const [c0, c1, c2, c3, c4, c5] = CARDS;

  return (
    <section id="features" ref={ref} className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="mx-auto max-w-[1068px]">

        {/* Header */}
        <div className="feat-header mb-12 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">
              <LayoutDashboard className="h-4 w-4" />
              Fitur utama
            </p>
            <h2 className="text-balance font-primary text-[30px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[40px] sm:tracking-[-1px] lg:text-[48px] lg:tracking-[-1.8px]">
              Dari sheet berantakan ke<br className="hidden sm:block" /> sistem kerja yang enak dipakai.
            </h2>
          </div>
          <p className="max-w-[260px] font-secondary text-[16px] leading-[1.6] text-muted sm:text-right">
            Struktur, formula, dashboard, dan alur kerja — semua sudah disiapkan.
          </p>
        </div>

        {/* ── Bento: row 1 — [wide 2/3] + [narrow 1/3] ── */}
        <div className="feat-bento grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* Card 0 — wide, struktur data */}
          <article className="feat-card group flex flex-col rounded-3xl border border-line bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:col-span-2">
            <div className="flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${c0.accent}`}>
                <c0.icon className="h-5 w-5 transition duration-300 group-hover:-rotate-6" />
              </div>
              <ArrowUpRight size={16} className="text-line transition duration-200 group-hover:text-cobalt" />
            </div>
            <h3 className="mt-5 font-primary text-xl font-semibold leading-snug tracking-[-0.4px] text-ink">{c0.title}</h3>
            <p className="mt-2 font-secondary text-sm leading-[1.6] text-muted">{c0.description}</p>
            <Visual id={c0.visual} />
          </article>

          {/* Card 1 — narrow, dashboard */}
          <article className="feat-card group flex flex-col rounded-3xl border border-line bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
            <div className="flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${c1.accent}`}>
                <c1.icon className="h-5 w-5 transition duration-300 group-hover:-rotate-6" />
              </div>
              <ArrowUpRight size={16} className="text-line transition duration-200 group-hover:text-cobalt" />
            </div>
            <h3 className="mt-5 font-primary text-xl font-semibold leading-snug tracking-[-0.4px] text-ink">{c1.title}</h3>
            <p className="mt-2 font-secondary text-sm leading-[1.6] text-muted">{c1.description}</p>
            <Visual id={c1.visual} />
          </article>

          {/* ── Row 2 — [narrow 1/3] + [wide 2/3] ── */}

          {/* Card 2 — narrow, laporan */}
          <article className="feat-card group flex flex-col rounded-3xl border border-line bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
            <div className="flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${c2.accent}`}>
                <c2.icon className="h-5 w-5 transition duration-300 group-hover:-rotate-6" />
              </div>
              <ArrowUpRight size={16} className="text-line transition duration-200 group-hover:text-cobalt" />
            </div>
            <h3 className="mt-5 font-primary text-xl font-semibold leading-snug tracking-[-0.4px] text-ink">{c2.title}</h3>
            <p className="mt-2 font-secondary text-sm leading-[1.6] text-muted">{c2.description}</p>
            <Visual id={c2.visual} />
          </article>

          {/* Card 3 — wide, tim */}
          <article className="feat-card group flex flex-col rounded-3xl border border-line bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:col-span-2">
            <div className="flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${c3.accent}`}>
                <c3.icon className="h-5 w-5 transition duration-300 group-hover:-rotate-6" />
              </div>
              <ArrowUpRight size={16} className="text-line transition duration-200 group-hover:text-cobalt" />
            </div>
            <h3 className="mt-5 font-primary text-xl font-semibold leading-snug tracking-[-0.4px] text-ink">{c3.title}</h3>
            <p className="mt-2 font-secondary text-sm leading-[1.6] text-muted">{c3.description}</p>
            <Visual id={c3.visual} />
          </article>

          {/* ── Row 3 — equal 3 cols ── */}

          {/* Card 4 */}
          <article className="feat-card group flex flex-col rounded-3xl border border-line bg-white p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
            <div className="flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-105 ${c4.accent}`}>
                <c4.icon className="h-5 w-5 transition duration-300 group-hover:-rotate-6" />
              </div>
              <ArrowUpRight size={16} className="text-line transition duration-200 group-hover:text-cobalt" />
            </div>
            <h3 className="mt-5 font-primary text-xl font-semibold leading-snug tracking-[-0.4px] text-ink">{c4.title}</h3>
            <p className="mt-2 font-secondary text-sm leading-[1.6] text-muted">{c4.description}</p>
            <Visual id={c4.visual} />
          </article>

          {/* Card 5 — spans 2 */}
          <article className="feat-card group flex flex-col rounded-3xl border border-line bg-ink p-7 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft sm:col-span-2">
            <div className="flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 transition duration-300 group-hover:scale-105">
                <c5.icon className="h-5 w-5 text-sheet transition duration-300 group-hover:-rotate-6" />
              </div>
              <ArrowUpRight size={16} className="text-white/20 transition duration-200 group-hover:text-sheet" />
            </div>
            <h3 className="mt-5 font-primary text-xl font-semibold leading-snug tracking-[-0.4px] text-white">{c5.title}</h3>
            <p className="mt-2 font-secondary text-sm leading-[1.6] text-white/55">{c5.description}</p>
            <div className="mt-auto pt-5 flex flex-col gap-3">
              {[
                { label: "Template siap pakai", pct: 100, color: "bg-sheet" },
                { label: "Custom & kembangkan", pct: 65, color: "bg-cobalt" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-1.5 flex justify-between">
                    <span className="font-secondary text-xs font-semibold text-white/70">{item.label}</span>
                    <span className="font-secondary text-xs font-bold text-white/40">{item.pct}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </article>

        </div>
      </div>
    </section>
  );
}
