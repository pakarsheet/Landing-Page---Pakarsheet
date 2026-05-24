"use client";

import { useLayoutEffect, useRef } from "react";
import { BarChart3, CheckCircle2, FileSpreadsheet, RefreshCw } from "lucide-react";
import { gsap, ScrollTrigger, DrawSVGPlugin } from "@/lib/gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const panels = [
  {
    kicker: "01",
    title: "Template siap pakai, bukan sheet kosong.",
    description: "Mulai dari struktur data yang sudah disusun untuk pekerjaan harian bisnis.",
    points: ["Kolom dan tab sudah tertata", "Format input mudah diikuti tim", "Bisa langsung dipakai hari pertama"],
    visual: "sheet"
  },
  {
    kicker: "02",
    title: "Workflow lebih otomatis tanpa pindah aplikasi.",
    description: "Formula, status, dan ringkasan dibuat supaya rekap kerja tidak selalu manual.",
    points: ["Update status lebih jelas", "Rekap otomatis dari data input", "Minim input ulang dan salah hitung"],
    visual: "flow"
  },
  {
    kicker: "03",
    title: "Dashboard bikin angka penting cepat kebaca.",
    description: "Owner bisa pantau performa tanpa bongkar banyak tab atau bikin laporan dari nol.",
    points: ["Ringkasan penjualan dan biaya", "Grafik siap untuk evaluasi", "Laporan lebih enak dibagikan"],
    visual: "chart"
  }
];

const panelBackgrounds = [
  "bg-sky",
  "bg-lilac",
  "bg-white",
];

function SheetMockup() {
  return (
    <div className="simplicity-visual w-full max-w-[440px] rounded-[22px] border border-line bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-primary text-lg font-semibold text-ink">Operasional Harian</p>
          <p className="text-sm font-semibold text-muted">Input kerja tim</p>
        </div>
        <FileSpreadsheet className="h-6 w-6 text-cobalt" />
      </div>
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 24 }).map((_, index) => (
          <div
            key={index}
            className={`sheet-cell h-9 rounded-lg ${index < 4 ? "bg-ink" : index === 6 || index === 13 || index === 18 ? "bg-sheet" : index % 4 === 0 ? "bg-sky" : "bg-[#f7f9fd]"}`}
          />
        ))}
      </div>
    </div>
  );
}

function FlowMockup() {
  return (
    <div className="simplicity-visual w-full max-w-[440px] rounded-[22px] border border-line bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <p className="font-primary text-lg font-semibold text-ink">Auto Summary</p>
        <RefreshCw className="flow-icon h-6 w-6 text-cobalt" />
      </div>
      {["Order masuk", "Stok update", "Invoice siap", "Laporan terkirim"].map((item, index) => (
        <div key={item} className="flow-step mb-3 flex items-center gap-3 rounded-2xl bg-[#f7f9fd] p-4 last:mb-0">
          <span className={`grid h-9 w-9 place-items-center rounded-full ${index === 1 ? "bg-sheet text-ink" : "bg-sky text-cobalt"}`}>
            <CheckCircle2 className="flow-check h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-secondary text-sm font-bold text-ink">{item}</p>
            <div className="mt-2 h-2 w-4/5 rounded-full bg-muted/15" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ChartMockup() {
  return (
    <div className="simplicity-visual w-full max-w-[460px] rounded-[22px] border border-line bg-white p-5 shadow-soft">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="font-primary text-lg font-semibold text-ink">Dashboard</p>
          <p className="text-sm font-semibold text-muted">Revenue forecast</p>
        </div>
        <BarChart3 className="h-6 w-6 text-cobalt" />
      </div>
      <div className="relative h-48 overflow-hidden rounded-2xl bg-[linear-gradient(180deg,#f8fbff_0%,#ffffff_100%)] p-4">
        <div className="absolute inset-x-4 top-8 h-px bg-line" />
        <div className="absolute inset-x-4 top-20 h-px bg-line" />
        <div className="absolute inset-x-4 top-32 h-px bg-line" />
        <svg viewBox="0 0 360 170" className="relative h-full w-full overflow-visible">
          <path className="chart-line" d="M0 126 C35 112 45 80 82 86 C120 92 115 126 155 118 C202 108 192 46 235 52 C285 58 254 124 360 94" fill="none" stroke="#023ffc" strokeWidth="5" strokeLinecap="round" />
          <path className="chart-line" d="M0 145 C38 140 48 132 78 90 C115 38 122 98 160 86 C200 73 206 70 240 80 C290 96 294 62 360 52" fill="none" stroke="#8bed02" strokeWidth="5" strokeLinecap="round" />
        </svg>
        <div className="chart-callout absolute left-28 top-16 rounded-2xl border border-line bg-white p-3 shadow-card">
          <p className="text-xs font-bold text-ink">Bulan ini</p>
          <p className="mt-1 text-xs font-semibold text-muted">+32% lebih cepat</p>
        </div>
      </div>
    </div>
  );
}

function PanelVisual({ visual }: { visual: string }) {
  if (visual === "flow") return <FlowMockup />;
  if (visual === "chart") return <ChartMockup />;
  return <SheetMockup />;
}

export function HowItWorks() {
  const ref = useRef<HTMLElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".simplicity-heading",
        { autoAlpha: 0, y: 28 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root, start: "top 78%", once: true }
        }
      );

      const panelEls = gsap.utils.toArray<HTMLElement>(".simplicity-panel");

      panelEls.forEach((panel, index) => {
        const visual = panel.querySelector(".simplicity-visual");
        const copy = panel.querySelectorAll(".simplicity-copy");
        const points = panel.querySelectorAll(".simplicity-point");
        const sheetCells = panel.querySelectorAll(".sheet-cell");
        const flowSteps = panel.querySelectorAll(".flow-step");
        const flowChecks = panel.querySelectorAll(".flow-check");
        const flowIcon = panel.querySelector(".flow-icon");
        const chartLines = panel.querySelectorAll(".chart-line");
        const chartCallout = panel.querySelector(".chart-callout");

        const timeline = gsap.timeline({
          scrollTrigger: { trigger: panel, start: "top 78%", once: true }
        });

        timeline
          .fromTo(panel, { autoAlpha: 0, y: 72, scale: 0.985 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.85, ease: "power3.out" })
          .fromTo(copy, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.08, ease: "power3.out" }, "-=0.42")
          .fromTo(points, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.45, stagger: 0.07, ease: "power2.out" }, "-=0.25");

        if (sheetCells.length) {
          timeline.fromTo(
            sheetCells,
            { autoAlpha: 0, scale: 0.7, transformOrigin: "center center" },
            { autoAlpha: 1, scale: 1, duration: 0.28, stagger: { each: 0.012, from: "random" }, ease: "back.out(1.8)" },
            "-=0.3"
          );
        }

        if (flowSteps.length) {
          timeline
            .fromTo(flowSteps, { autoAlpha: 0, x: 26 }, { autoAlpha: 1, x: 0, duration: 0.42, stagger: 0.09, ease: "power3.out" }, "-=0.34")
            .fromTo(flowChecks, { scale: 0.2, rotate: -24 }, { scale: 1, rotate: 0, duration: 0.32, stagger: 0.07, ease: "back.out(2)" }, "-=0.28");
        }

        if (flowIcon) {
          timeline.to(flowIcon, { rotate: 360, duration: 0.7, ease: "power2.inOut" }, "-=0.3");
        }

        if (chartLines.length) {
          timeline
            .fromTo(chartLines, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.9, stagger: 0.12, ease: "power2.out" }, "-=0.34")
            .fromTo(chartCallout, { autoAlpha: 0, y: 16, scale: 0.9 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.38, ease: "back.out(1.7)" }, "-=0.28");
        }

        if (visual) {
          gsap.fromTo(
            visual,
            { y: 22, rotate: 0.35 },
            {
              y: -14,
              rotate: -0.2,
              ease: "none",
              scrollTrigger: { trigger: panel, start: "top bottom", end: "bottom top", scrub: 0.7 }
            }
          );
        }

        if (index < panelEls.length - 1) {
          gsap.to(panel, {
            scale: 0.94 + index * 0.025,
            y: -16,
            ease: "none",
            scrollTrigger: {
              trigger: panelEls[index + 1],
              start: "top 78%",
              end: "top 28%",
              scrub: 0.8,
            }
          });
        }
      });
    }, root);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <section id="how-it-works" ref={ref} className="bg-white px-4 py-14 sm:px-5 sm:py-20 lg:px-10">
      <div className="simplicity-heading mx-auto max-w-[760px] text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">
          <FileSpreadsheet className="h-4 w-4" />
          All-in-one
        </p>
        <h2 className="text-balance font-primary text-[38px] font-semibold leading-[1.05] tracking-[-0.8px] text-ink sm:text-[52px] sm:tracking-[-2px] lg:text-[64px] lg:tracking-[-3px]">
          Power Meets Simplicity
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-pretty font-secondary text-[18px] leading-[1.56] text-muted">
          Pakarsheet menyatukan template, workflow, dan dashboard dalam satu pengalaman spreadsheet yang rapi.
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-[1068px] sm:mt-20">
        {panels.map((panel, index) => (
          <article
            key={panel.title}
            style={{ top: `${96 + index * 18}px`, zIndex: index + 1 }}
            className={`simplicity-panel sticky grid min-h-[560px] origin-top overflow-hidden rounded-[28px] border border-white p-6 shadow-[0_24px_80px_rgba(1,17,43,0.08)] md:grid-cols-2 md:gap-10 md:p-12 lg:rounded-[32px] lg:p-16 ${index > 0 ? "mt-10 md:mt-14" : ""} ${
              panelBackgrounds[index]
            }`}
          >
            <div className={`relative z-10 flex flex-col justify-center ${index % 2 === 1 ? "md:order-2 md:pl-6" : "md:pr-6"}`}>
              <p className="simplicity-copy font-secondary text-sm font-bold text-cobalt">{panel.kicker}</p>
              <h3 className="simplicity-copy mt-5 max-w-lg font-primary text-[32px] font-semibold leading-[1.08] tracking-[-1.2px] text-ink sm:text-[42px] lg:text-[46px]">
                {panel.title}
              </h3>
              <p className="simplicity-copy mt-5 max-w-md font-secondary text-[17px] leading-[1.56] text-muted">{panel.description}</p>
              <ul className="mt-10 space-y-4">
                {panel.points.map((point) => (
                  <li key={point} className="simplicity-point flex items-center gap-3 font-secondary text-base font-semibold text-ink">
                    <CheckCircle2 className="h-5 w-5 shrink-0 fill-ink text-white" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative z-10 mt-10 flex items-center justify-center md:mt-0">
              <PanelVisual visual={panel.visual} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
