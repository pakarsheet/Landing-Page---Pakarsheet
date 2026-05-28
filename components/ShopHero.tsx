import { Store } from "lucide-react";
import { shopTemplates } from "@/lib/data";
import { Button } from "./ui/Button";
import { SheetGrid } from "./SheetGrid";
import { site } from "@/lib/site";
import { getSiteSettings, buildWaUrl } from "@/lib/supabase/queries";

export async function ShopHero() {
  const settings = await getSiteSettings();
  const waUrl = buildWaUrl(settings) || site.contactUrl;
  const total = shopTemplates.length;

  return (
    <section className="bg-white px-3 pb-0 pt-3 sm:px-5 sm:pt-5 lg:px-10">
      <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] px-4 pb-16 pt-28 sm:rounded-[32px] sm:px-8 sm:pt-36 lg:px-10 lg:pb-20 lg:pt-[165px]">
        <SheetGrid className="rounded-[20px] sm:rounded-[32px]" />

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
            <Button href={waUrl} variant="secondary" size="lg">
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
