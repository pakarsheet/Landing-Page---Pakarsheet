import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BgTransition } from "@/components/BgTransition";
import { SheetGrid } from "@/components/SheetGrid";
import { tools } from "@/lib/tools";
import { site } from "@/lib/site";
import { shopTemplates } from "@/lib/data";

// ── Dynamic imports — each calculator is only bundled when its page is visited
const KalkulatorMargin           = dynamic(() => import("@/components/calculators/KalkulatorMargin").then(m => ({ default: m.KalkulatorMargin })));
const KalkulatorHPP              = dynamic(() => import("@/components/calculators/KalkulatorHPP").then(m => ({ default: m.KalkulatorHPP })));
const KalkulatorHargaJual        = dynamic(() => import("@/components/calculators/KalkulatorHargaJual").then(m => ({ default: m.KalkulatorHargaJual })));
const KalkulatorROAS             = dynamic(() => import("@/components/calculators/KalkulatorROAS").then(m => ({ default: m.KalkulatorROAS })));
const KalkulatorDiskon           = dynamic(() => import("@/components/calculators/KalkulatorDiskon").then(m => ({ default: m.KalkulatorDiskon })));
const KalkulatorProfitMarketplace = dynamic(() => import("@/components/calculators/KalkulatorProfitMarketplace").then(m => ({ default: m.KalkulatorProfitMarketplace })));
const KalkulatorLabaRugi         = dynamic(() => import("@/components/calculators/KalkulatorLabaRugi").then(m => ({ default: m.KalkulatorLabaRugi })));
const KalkulatorEfektivitasIklan = dynamic(() => import("@/components/calculators/KalkulatorEfektivitasIklan").then(m => ({ default: m.KalkulatorEfektivitasIklan })));

const DETAIL_CELLS = [
  { col: 0, row: 0, delay: "0s" },
  { col: 3, row: 1, delay: "0.8s" },
  { col: 6, row: 0, delay: "1.6s" },
  { col: 1, row: 3, delay: "2.0s" },
  { col: 5, row: 4, delay: "1.1s" },
  { col: 8, row: 2, delay: "0.4s" },
  { col: 2, row: 5, delay: "1.8s" },
];

// Per-tool CTA copy for ToolCard and related section
const toolCta: Record<string, string> = {
  "kalkulator-margin":             "Hitung margin →",
  "kalkulator-hpp":                "Hitung HPP →",
  "kalkulator-harga-jual":         "Simulasi harga →",
  "kalkulator-roas":               "Cek ROAS →",
  "kalkulator-diskon-bertingkat":  "Hitung diskon →",
  "kalkulator-profit-marketplace": "Hitung profit →",
  "kalkulator-laba-rugi":          "Hitung laba rugi →",
  "kalkulator-efektivitas-iklan":  "Cek efektivitas →",
};

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tools.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};

  const title = `${tool.title} Gratis Online — ${site.name}`;
  const description = tool.longDescription;

  return {
    title,
    description,
    keywords: tool.keywords,
    alternates: { canonical: `/tools/${slug}` },
    openGraph: { title, description, type: "website" },
  };
}

function CalculatorForSlug({ slug }: { slug: string }) {
  switch (slug) {
    case "kalkulator-margin":             return <KalkulatorMargin />;
    case "kalkulator-hpp":                return <KalkulatorHPP />;
    case "kalkulator-harga-jual":         return <KalkulatorHargaJual />;
    case "kalkulator-roas":               return <KalkulatorROAS />;
    case "kalkulator-diskon-bertingkat":  return <KalkulatorDiskon />;
    case "kalkulator-profit-marketplace": return <KalkulatorProfitMarketplace />;
    case "kalkulator-laba-rugi":          return <KalkulatorLabaRugi />;
    case "kalkulator-efektivitas-iklan":  return <KalkulatorEfektivitasIklan />;
    default:                              return null;
  }
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) notFound();

  const Icon = tool.icon;
  const related = tools.filter((t) => t.slug !== slug).slice(0, 3);

  // Resolve the related shop template for the specific CTA
  const relatedTemplate = tool.relatedShopSlug
    ? shopTemplates.find((t) => t.slug === tool.relatedShopSlug)
    : null;
  const ctaHref  = relatedTemplate ? `/shop/${relatedTemplate.slug}` : "/shop";
  const ctaLabel = relatedTemplate ? relatedTemplate.shortTitle : "template premium";

  return (
    <>
      <BgTransition />
      <Navbar />
      <main id="main-content" className="bg-white">

        {/* ── Hero panel ─────────────────────────────────────────── */}
        <section className="bg-white px-3 pb-0 pt-3 sm:px-5 sm:pt-5 lg:px-10">
          <div className="relative mx-auto max-w-[1380px] overflow-hidden rounded-[20px] bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] sm:rounded-[32px]">
            <SheetGrid cells={DETAIL_CELLS} />

            <div className="px-5 pb-12 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pb-16 lg:pt-36">
              {/* Back link */}
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 font-secondary text-sm font-semibold text-muted transition hover:text-cobalt"
              >
                <ArrowLeft className="h-4 w-4" />
                Semua kalkulator
              </Link>

              {/* Content — two-col on lg */}
              <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-[640px]">
                  {/* Icon + badge row */}
                  <div className="flex items-center gap-3">
                    <span className={`flex h-16 w-16 items-center justify-center rounded-2xl ${tool.accent}`}>
                      <Icon className="h-8 w-8" />
                    </span>
                    <span className="rounded-full border border-line bg-white px-3 py-1.5 font-secondary text-xs font-bold text-cobalt shadow-card">
                      {tool.badge}
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="mt-5 text-balance font-primary text-[32px] font-semibold leading-[1.15] tracking-[-0.5px] text-ink sm:text-[44px] sm:tracking-[-1.5px] lg:text-[52px] lg:tracking-[-2px]">
                    {tool.title}
                  </h1>
                  <p className="mt-4 text-pretty font-secondary text-[18px] leading-[1.56] text-muted">
                    {tool.longDescription}
                  </p>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                  {["Kalkulasi real-time", "Tanpa login", "100% gratis"].map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-4 py-2 font-secondary text-sm font-semibold text-muted shadow-card"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-cobalt" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Calculator ─────────────────────────────────────────── */}
        <section className="bg-white px-5 py-14 sm:py-20 lg:px-10">
          <div className="mx-auto max-w-[1280px]">
            <CalculatorForSlug slug={slug} />
          </div>
        </section>

        {/* ── CTA — upgrade to template ──────────────────────────── */}
        <section className="bg-white px-5 pb-12 lg:px-10">
          <div className="mx-auto max-w-[1280px]">
            <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
              <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-sheet/20 blur-3xl" />
              <div aria-hidden="true" className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-cobalt/20 blur-3xl" />

              <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-secondary text-xs font-bold uppercase tracking-[0.1em] text-sheet">
                    Upgrade ke template premium
                  </p>
                  <h2 className="mt-2 font-primary text-[26px] font-semibold leading-[1.2] tracking-[-0.6px] text-white sm:text-[32px] sm:tracking-[-1px]">
                    Mau yang lebih otomatis?
                  </h2>
                  <p className="mt-2 font-secondary text-base leading-[1.56] text-white/60">
                    Template Google Sheets Pakarsheet sudah punya semua formula ini — tinggal isi data, laporan langsung jadi.
                  </p>
                  {relatedTemplate && (
                    <p className="mt-1 font-secondary text-sm font-semibold text-sheet/80">
                      Rekomendasi: {relatedTemplate.title}
                    </p>
                  )}
                </div>
                <Link
                  href={ctaHref}
                  className="group inline-flex h-14 shrink-0 items-center gap-2 rounded-full bg-sheet px-7 font-secondary text-base font-semibold text-ink shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-white"
                >
                  <span className="relative block overflow-hidden">
                    <span className="block transition duration-300 group-hover:-translate-y-full">Lihat {ctaLabel}</span>
                    <span className="absolute left-0 top-full block transition duration-300 group-hover:-translate-y-full">Lihat {ctaLabel}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Related tools ──────────────────────────────────────── */}
        <section className="bg-white px-5 pb-20 lg:px-10">
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
                Kalkulator lainnya
              </p>
              <Link href="/tools" className="font-secondary text-sm font-semibold text-cobalt transition hover:underline">
                Lihat semua →
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {related.map((t) => {
                const RelIcon = t.icon;
                return (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="group relative overflow-hidden rounded-3xl border border-line bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft"
                  >
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${t.accent}`}>
                          <RelIcon className="h-4 w-4" />
                        </span>
                        <span className="rounded-full border border-line bg-white px-2.5 py-0.5 font-secondary text-[10px] font-bold text-cobalt shadow-card">
                          {t.badge}
                        </span>
                      </div>
                      <p className="mt-3 font-secondary text-sm font-semibold text-ink group-hover:text-cobalt">
                        {t.shortTitle}
                      </p>
                      <p className="mt-1 font-secondary text-xs leading-[1.5] text-muted line-clamp-2">
                        {t.description}
                      </p>
                      <div className="mt-3 inline-flex items-center gap-1 font-secondary text-xs font-semibold text-cobalt">
                        {toolCta[t.slug] ?? "Buka →"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
