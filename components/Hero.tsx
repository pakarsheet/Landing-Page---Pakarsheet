"use client";

import { useLayoutEffect, useRef } from "react";
import { CheckCircle2, TrendingUp, TrendingDown, ShoppingCart, Users, ArrowUpRight, BarChart2, RefreshCw, FileText } from "lucide-react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { MagneticButton } from "./MagneticButton";
import { site } from "@/lib/site";
import { audience, trustedBy } from "@/lib/data";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger);

// Grid dimensions
const COLS = 9;
const ROWS = 7;
const CW = 100 / COLS; // % width per cell
const CH = 100 / ROWS; // % height per cell

const HIGHLIGHT_CELLS = [
  { col: 1, row: 1, delay: "0s" },
  { col: 4, row: 2, delay: "0.6s" },
  { col: 7, row: 1, delay: "1.2s" },
  { col: 2, row: 4, delay: "1.8s" },
  { col: 6, row: 5, delay: "0.9s" },
  { col: 3, row: 6, delay: "2.1s" },
  { col: 8, row: 3, delay: "1.5s" },
];

function SheetGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]"
    >
      {/* Grid lines via CSS repeating-linear-gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `repeating-linear-gradient(to right, rgba(99,120,200,0.13) 0px, rgba(99,120,200,0.13) 1px, transparent 1px, transparent ${CW}%)`,
            `repeating-linear-gradient(to bottom, rgba(99,120,200,0.13) 0px, rgba(99,120,200,0.13) 1px, transparent 1px, transparent ${CH}%)`,
          ].join(", "),
        }}
      />

      {/* Highlight cells — pulse in/out */}
      {HIGHLIGHT_CELLS.map(({ col, row, delay }, i) => (
        <div
          key={i}
          className="sheet-cell absolute"
          style={{
            left: `${col * CW}%`,
            top: `${row * CH}%`,
            width: `${CW}%`,
            height: `${CH}%`,
            background: "rgba(139,237,2,0.18)",
            animationDelay: delay,
          }}
        />
      ))}

      {/* Row sweep — slides top → bottom */}
      <div
        className="sheet-row-sweep absolute inset-x-0"
        style={{
          height: `${CH}%`,
          background:
            "linear-gradient(90deg, transparent 0%, rgba(139,237,2,0.12) 50%, transparent 100%)",
        }}
      />
    </div>
  );
}

// ── Sparkline SVG ────────────────────────────────────────────
function Sparkline({ color, points }: { color: string; points: string }) {
  return (
    <svg viewBox="0 0 80 28" className="h-7 w-20" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ── Mini bar chart ────────────────────────────────────────────
const BAR_DATA = [42, 68, 55, 80, 63, 91, 74, 88, 70, 95, 82, 100];

function BarChart() {
  const max = Math.max(...BAR_DATA);
  // Line overlay points — revenue trend
  const LINE = [38, 52, 48, 65, 58, 75, 68, 80, 72, 88, 82, 100];
  const linePoints = LINE.map((v, i) => {
    const barW = 14;
    const gap = 6;
    const x = i * (barW + gap) + 2 + barW / 2;
    const y = 80 - (v / max) * 72;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox="0 0 240 80" className="h-full w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id="barGradBlue" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3d6bff" />
          <stop offset="100%" stopColor="#023ffc" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="barGradGreen" x1="0" y1="0" x2="0" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#a8f530" />
          <stop offset="100%" stopColor="#8bed02" stopOpacity="0.75" />
        </linearGradient>
      </defs>
      {BAR_DATA.map((v, i) => {
        const barW = 14;
        const gap = 6;
        const x = i * (barW + gap) + 2;
        const barH = (v / max) * 72;
        const y = 80 - barH;
        const isLast = i === BAR_DATA.length - 1;
        const isRecent = i >= BAR_DATA.length - 3 && !isLast;
        const fill = isLast
          ? "url(#barGradGreen)"
          : isRecent
          ? "url(#barGradBlue)"
          : "#e8edf8";
        return (
          <rect key={i} x={x} y={y} width={barW} height={barH} rx="3" ry="3" fill={fill} />
        );
      })}
      {/* Trend line overlay */}
      <polyline
        points={linePoints}
        fill="none"
        stroke="#01112b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="3 2"
        opacity="0.25"
      />
      {/* Dot on last bar top */}
      {(() => {
        const i = BAR_DATA.length - 1;
        const barW = 14; const gap = 6;
        const x = i * (barW + gap) + 2 + barW / 2;
        const y = 80 - (BAR_DATA[i] / max) * 72;
        return <circle cx={x} cy={y} r="3.5" fill="#8bed02" stroke="white" strokeWidth="1.5" />;
      })()}
    </svg>
  );
}

// ── Donut chart ───────────────────────────────────────────────
function DonutChart() {
  const r = 26;
  const cx = 36;
  const cy = 36;
  const circ = 2 * Math.PI * r;
  const segments = [
    { pct: 0.52, color: "#023ffc", label: "Produk", val: "52%" },
    { pct: 0.31, color: "#8bed02", label: "Jasa",   val: "31%" },
    { pct: 0.17, color: "#c8d4f0", label: "Lainnya",val: "17%" },
  ];
  let cumulative = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f3fa" strokeWidth="12" />
        {segments.map((seg, i) => {
          const dash = seg.pct * circ;
          const gap  = circ - dash;
          const rotation = cumulative * 360 - 90;
          cumulative += seg.pct;
          return (
            <circle
              key={i}
              cx={cx} cy={cy} r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="12"
              strokeDasharray={`${dash} ${gap}`}
              strokeDashoffset="0"
              strokeLinecap="butt"
              style={{ transform: `rotate(${rotation}deg)`, transformOrigin: `${cx}px ${cy}px` }}
            />
          );
        })}
        <text x="36" y="38" textAnchor="middle" fontSize="10" fontWeight="700" fill="#01112b">52%</text>
      </svg>
      <div className="space-y-1.5">
        {segments.map((s) => (
          <div key={s.label} className="flex items-center gap-1.5">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: s.color }} />
            <span className="text-[11px] font-semibold text-muted">{s.label}</span>
            <span className="ml-auto pl-2 text-[11px] font-bold text-ink">{s.val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Recent transactions ───────────────────────────────────────
const TRANSACTIONS = [
  { name: "Order #1042", type: "Toko Online", amount: "+Rp 850rb", positive: true },
  { name: "Biaya Iklan", type: "Meta Ads", amount: "-Rp 200rb", positive: false },
  { name: "Order #1041", type: "Marketplace", amount: "+Rp 1.2jt", positive: true },
  { name: "Gaji Tim", type: "Operasional", amount: "-Rp 3.5jt", positive: false },
];

// ── KPI cards data ────────────────────────────────────────────
const KPIS = [
  {
    label: "Revenue Bulan Ini",
    value: "Rp 24.8jt",
    delta: "+18%",
    up: true,
    spark: "0,24 15,18 30,20 45,12 60,8 80,4",
    color: "#023ffc",
  },
  {
    label: "Total Order",
    value: "312",
    delta: "+24%",
    up: true,
    spark: "0,26 15,22 30,18 45,14 60,10 80,4",
    color: "#8bed02",
  },
  {
    label: "Biaya Operasional",
    value: "Rp 8.2jt",
    delta: "-5%",
    up: false,
    spark: "0,4 15,8 30,10 45,14 60,18 80,22",
    color: "#ff6b6b",
  },
  {
    label: "Profit Bersih",
    value: "Rp 16.6jt",
    delta: "+31%",
    up: true,
    spark: "0,26 15,22 30,16 45,12 60,8 80,2",
    color: "#023ffc",
  },
];

// ── Main mockup ───────────────────────────────────────────────
function DashboardMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[1120px]">
      {/* Outer shell */}
      <div className="dashboard-shell dashboard-float relative overflow-hidden rounded-xl border border-white/80 bg-white shadow-[0_34px_100px_rgba(1,17,43,0.18)] sm:rounded-2xl">

        {/* ── Top bar ── */}
        <div className="flex items-center justify-between border-b border-line/60 bg-[#fafbff] px-4 py-2.5 sm:px-5">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-ink text-xs font-bold text-white">P</span>
            <span className="font-primary text-sm font-semibold text-ink">Pakarsheet Dashboard</span>
            <span className="hidden rounded-full bg-sky px-2 py-0.5 text-[11px] font-bold text-cobalt sm:inline">Bisnis Umum v3</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1 rounded-full bg-leaf px-2.5 py-1 text-[11px] font-bold text-ink sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-sheet" />
              Live Sync
            </span>
            <button className="rounded-lg bg-ink px-3 py-1.5 text-[11px] font-bold text-white">+ Tambah Data</button>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <div className="flex gap-1 border-b border-line/60 bg-[#fafbff] px-4 sm:px-5">
          {["Ringkasan", "Penjualan", "Cashflow", "Operasional"].map((tab, i) => (
            <button
              key={tab}
              className={`px-3 py-2 text-[12px] font-semibold transition ${
                i === 0
                  ? "border-b-2 border-cobalt text-cobalt"
                  : "text-muted hover:text-ink"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Body ── */}
        <div className="dashboard-image p-3 sm:p-4">

          {/* KPI row */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
            {KPIS.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-line/60 bg-white p-3 shadow-[0_2px_8px_rgba(1,17,43,0.05)]">
                <p className="text-[11px] font-semibold text-muted">{kpi.label}</p>
                <p className="mt-1 font-primary text-[15px] font-semibold leading-none text-ink sm:text-[17px]">{kpi.value}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className={`flex items-center gap-0.5 text-[11px] font-bold ${kpi.up ? "text-emerald-600" : "text-red-500"}`}>
                    {kpi.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {kpi.delta}
                  </span>
                  <Sparkline color={kpi.color} points={kpi.spark} />
                </div>
              </div>
            ))}
          </div>

          {/* Bar chart — always visible, compact on mobile */}
          <div className="mt-2 rounded-xl border border-line/60 bg-white p-3 shadow-[0_2px_8px_rgba(1,17,43,0.05)] sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="font-primary text-sm font-semibold text-ink">Revenue Bulanan</p>
                <p className="text-[11px] text-muted">Jan – Des 2025</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cobalt" />
                <span className="text-[11px] font-semibold text-muted">Aktual</span>
                <span className="ml-1 h-2 w-2 rounded-full bg-sheet" />
                <span className="text-[11px] font-semibold text-muted">Target</span>
              </div>
            </div>
            <div className="h-24 w-full sm:h-36">
              <BarChart />
            </div>
            <div className="mt-2 flex justify-between">
              {["Jan","Mar","Mei","Jul","Sep","Nov"].map(l => (
                <span key={l} className="text-[10px] text-muted">{l}</span>
              ))}
            </div>
          </div>

          {/* Charts row — hidden on mobile, visible sm+ */}
          <div className="mt-2 hidden grid-cols-1 gap-2 sm:mt-3 sm:grid sm:gap-3 lg:grid-cols-[1.6fr_1fr]">

            {/* Donut + transactions */}
            <div className="flex flex-col gap-2 sm:gap-3">
              {/* Donut */}
              <div className="rounded-xl border border-line/60 bg-white p-3 shadow-[0_2px_8px_rgba(1,17,43,0.05)]">
                <p className="mb-2 font-primary text-sm font-semibold text-ink">Komposisi Revenue</p>
                <DonutChart />
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-line/60 bg-sky/40 p-3">
                  <div className="flex items-center gap-1.5">
                    <ShoppingCart className="h-3.5 w-3.5 text-cobalt" />
                    <span className="text-[11px] font-semibold text-muted">Avg Order</span>
                  </div>
                  <p className="mt-1 font-primary text-sm font-semibold text-ink">Rp 79rb</p>
                </div>
                <div className="rounded-xl border border-line/60 bg-leaf/60 p-3">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-cobalt" />
                    <span className="text-[11px] font-semibold text-muted">Pelanggan</span>
                  </div>
                  <p className="mt-1 font-primary text-sm font-semibold text-ink">248</p>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions — hidden on mobile */}
          <div className="mt-2 hidden rounded-xl border border-line/60 bg-white shadow-[0_2px_8px_rgba(1,17,43,0.05)] sm:mt-3 sm:block">
            <div className="flex items-center justify-between border-b border-line/60 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-cobalt" />
                <p className="font-primary text-sm font-semibold text-ink">Transaksi Terbaru</p>
              </div>
              <button className="flex items-center gap-1 text-[11px] font-bold text-cobalt">
                Lihat semua <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
            <div className="divide-y divide-line/40">
              {TRANSACTIONS.map((tx) => (
                <div key={tx.name} className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2.5">
                    <span className={`grid h-7 w-7 place-items-center rounded-lg text-xs ${tx.positive ? "bg-leaf text-cobalt" : "bg-blush text-muted"}`}>
                      {tx.positive ? <TrendingUp className="h-3.5 w-3.5" /> : <TrendingDown className="h-3.5 w-3.5" />}
                    </span>
                    <div>
                      <p className="text-[12px] font-semibold text-ink">{tx.name}</p>
                      <p className="text-[11px] text-muted">{tx.type}</p>
                    </div>
                  </div>
                  <span className={`text-[12px] font-bold ${tx.positive ? "text-emerald-600" : "text-red-500"}`}>
                    {tx.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export function Hero({ contactUrl }: { contactUrl?: string }) {
  const rootRef = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    if (!rootRef.current || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      timeline
        .fromTo(".hero-panel", { autoAlpha: 0, y: 18, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.7 })
        .fromTo(".hero-reveal", { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.08 }, "-=0.35")
        .fromTo(".hero-word", { autoAlpha: 0, yPercent: 88, rotateX: -18 }, { autoAlpha: 1, yPercent: 0, rotateX: 0, duration: 0.7, stagger: 0.035 }, "-=0.52")
        .fromTo(".dashboard-shell", { autoAlpha: 0, y: 72, scale: 0.96, rotateX: 8 }, { autoAlpha: 1, y: 0, scale: 1, rotateX: 0, duration: 0.95 }, "-=0.28");

      gsap.to(".dashboard-float", {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(".dashboard-image", {
        y: -20,
        ease: "none",
        scrollTrigger: {
          trigger: ".dashboard-shell",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section ref={rootRef} className="relative overflow-x-clip bg-white px-3 pb-16 pt-3 sm:px-5 sm:pt-5 lg:px-10 lg:pt-10">
      <div className="hero-panel relative mx-auto max-w-[1380px] rounded-[20px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-4 pb-6 pt-24 sm:rounded-[32px] sm:px-8 sm:pb-12 sm:pt-36 lg:px-10 lg:pb-16 lg:pt-[165px]">
        <SheetGrid />

        <div className="relative z-10 mx-auto flex max-w-[890px] flex-col items-center text-center">
          <p className="hero-reveal inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-muted shadow-card">
            <CheckCircle2 className="h-4 w-4" />
            Template rasa sistem kerja
          </p>
          <h1 className="hero-reveal mt-6 text-balance font-primary text-[36px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink sm:text-[48px] sm:tracking-[-2px] lg:text-[62px] lg:tracking-[-3.5px]">
            {site.tagline.split(" ").map((word) => (
              <span key={word} className="hero-word inline-block origin-bottom pr-[0.18em]">
                {word}
              </span>
            ))}
          </h1>
          <p className="hero-reveal mt-6 max-w-2xl text-pretty font-secondary text-[18px] font-normal leading-[1.56] text-muted">
            Pakarsheet bantu bisnis naik level dari spreadsheet biasa menjadi sistem kerja yang lebih rapi, otomatis, dan mudah dipantau.
          </p>
          <div className="hero-reveal mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <MagneticButton href={site.templateUrl} size="lg">
              {site.primaryCta}
            </MagneticButton>
            <MagneticButton href={contactUrl ?? site.contactUrl} variant="secondary" size="lg">
              {site.secondaryCta}
            </MagneticButton>
          </div>
          <div className="hero-reveal mt-8 flex flex-wrap justify-center gap-2 sm:justify-start">
            {audience.map((item) => (
              <span key={item} className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-muted shadow-card">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mx-auto mt-4 w-full px-1 sm:mt-16 sm:w-[min(1120px,92vw)] sm:px-0 lg:mt-20">
          <div className="hero-reveal">
            <DashboardMockup />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1068px] flex-wrap items-center justify-center gap-3 px-5 text-center sm:mt-12 lg:mt-14 lg:px-8">
        <span className="text-sm font-bold text-muted">Cocok untuk:</span>
        {trustedBy.map((item) => (
          <span key={item} className="rounded-full bg-[#f4f7ff] px-3 py-1.5 text-sm font-bold text-ink">
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
