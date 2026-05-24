import { Store } from "lucide-react";
import { shopTemplates } from "@/lib/data";
import { Button } from "./ui/Button";
import { site } from "@/lib/site";

export function ShopHero() {
  const total = shopTemplates.length;

  return (
    <section className="bg-white px-3 pb-0 pt-3 sm:px-5 sm:pt-5 lg:px-10">
      {/* Gradient panel — same pattern as Hero & Pricing */}
      <div className="mx-auto max-w-[1380px] rounded-[20px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-4 pb-16 pt-28 sm:rounded-[32px] sm:px-8 sm:pt-36 lg:px-10 lg:pb-20 lg:pt-[165px]">
        <div className="mx-auto flex max-w-[890px] flex-col items-center text-center">

          {/* Eyebrow — same pattern as Hero */}
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-muted shadow-card">
            <Store className="h-4 w-4" />
            Toko Template
          </p>

          {/* Headline — h1 scale from design system */}
          <h1 className="mt-6 text-balance font-primary text-[36px] font-semibold leading-[1.1] tracking-[-0.5px] text-ink sm:text-[48px] sm:tracking-[-2px] lg:text-[62px] lg:tracking-[-3.5px]">
            Semua template{" "}
            <span className="relative inline-block whitespace-nowrap">
              Pakarsheet
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-1 left-0 h-[6px] w-full rounded-full bg-sheet"
              />
            </span>
            .
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
