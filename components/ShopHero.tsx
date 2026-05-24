import { Store } from "lucide-react";
import { shopTemplates } from "@/lib/data";
import { Button } from "./ui/Button";
import { site } from "@/lib/site";

// ── SheetGrid — same as ToolsHero ────────────────────────────
const COLS = 9;
const ROWS = 7;
const CW = 100 / COLS;
const CH = 100 / ROWS;

const HIGHLIGHT_CELLS = [
  { col: 0, row: 0, delay: "0s" },
  { col: 3, row: 1, delay: "0.8s" },
  { col: 6, row: 0, delay: "1.6s" },
  { col: 1, row: 3, delay: "2.0s" },
  { col: 5, row: 4, delay: "1.1s" },
  { col: 8, row: 2, delay: "0.4s" },
  { col: 2, row: 5, delay: "1.8s" },
];

function SheetGrid() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-[32px]"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: [
            `repeating-linear-gradient(to right, rgba(99,120,200,0.13) 0px, rgba(99,120,200,0.13) 1px, transparent 1px, transparent ${CW}%)`,
            `repeating-linear-gradient(to bottom, rgba(99,120,200,0.13) 0px, rgba(99,120,200,0.13) 1px, transparent 1px, transparent ${CH}%)`,
          ].join(", "),
        }}
      />
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

export function ShopHero() {
  const total = shopTemplates.length;

  return (
    <section className="bg-white px-3 pb-0 pt-3 sm:px-5 sm:pt-5 lg:px-10">
      <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-4 pb-16 pt-28 sm:rounded-[32px] sm:px-8 sm:pt-36 lg:px-10 lg:pb-20 lg:pt-[165px]">
        <SheetGrid />

        <div className="relative z-10 mx-auto flex max-w-[890px] flex-col items-center text-center">

          {/* Eyebrow */}
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-muted shadow-card">
            <Store className="h-4 w-4" />
            Toko Template
          </p>

          {/* Headline */}
          <h1 className="mt-6 text-balance font-primary text-[36px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink sm:text-[48px] sm:tracking-[-2px] lg:text-[62px] lg:tracking-[-3.5px]">
            Semua template{" "}
            Pakarsheet.
          </h1>

          <p className="mt-6 max-w-2xl text-pretty font-secondary text-[18px] font-normal leading-[1.56] text-muted">
            Pilih template yang paling dekat dengan alur kerja bisnis kamu. Langsung bisa dipakai, tanpa setup dari nol.
          </p>

          {/* CTA */}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="#templates" size="lg">
              Lihat Template
            </Button>
            <Button href={site.contactUrl} variant="secondary" size="lg">
              Konsultasi Kebutuhan
            </Button>
          </div>

          {/* Trust strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
            {[
              `${total} template tersedia`,
              "Format Google Sheets",
              "Langsung bisa dipakai",
              "Panduan disertakan",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full bg-white/80 px-3 py-1.5 text-sm font-semibold text-muted shadow-card"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
