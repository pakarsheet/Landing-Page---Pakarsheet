import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileSpreadsheet,
  MessageCircle,
  Users,
  Zap,
  Star,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { BgTransition } from "@/components/BgTransition";
import { Button } from "@/components/ui/Button";
import { ProductImageCarousel } from "@/components/ProductImageCarousel";
import { shopTemplates } from "@/lib/data";
import { site } from "@/lib/site";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return shopTemplates.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const template = shopTemplates.find((t) => t.slug === slug);
  if (!template) return {};
  return {
    title: `${template.title} — ${site.name}`,
    description: template.description,
    openGraph: {
      title: `${template.title} — ${site.name}`,
      description: template.description,
      images: template.previewImages[0] ? [template.previewImages[0]] : [],
      type: "website",
    },
  };
}

export default async function TemplateDetailPage({ params }: Props) {
  const { slug } = await params;
  const template = shopTemplates.find((t) => t.slug === slug);
  if (!template) notFound();

  const {
    title,
    badge,
    price,
    originalPrice,
    longDescription,
    features,
    whatsIncluded,
    previewImages,
    isNew,
    isBestSeller,
    ctaUrl,
  } = template;

  // Parse harga asli: "Rp149rb" → 149000, "Rp1.499.000" → 1499000
  const parsePrice = (str: string) => {
    const lower = str.toLowerCase().replace(/\./g, "").replace(/\s/g, "");
    const rbMatch = lower.match(/(\d+)rb/);
    if (rbMatch) return parseInt(rbMatch[1], 10) * 1000;
    return parseInt(lower.replace(/\D/g, ""), 10);
  };

  const discountPct = originalPrice
    ? Math.round((1 - template.priceRaw / parsePrice(originalPrice)) * 100)
    : null;

  return (
    <>
      <BgTransition />
      <main id="main-content" className="bg-white">

        {/* ── Breadcrumb ─────────────────────────────────────────── */}
        <div className="mx-auto max-w-[1068px] px-5 pb-0 pt-8 lg:px-10 lg:pt-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-secondary text-sm text-muted">
            <Link href="/" className="transition hover:text-cobalt">Beranda</Link>
            <span aria-hidden="true">/</span>
            <Link href="/shop" className="transition hover:text-cobalt">Toko</Link>
            <span aria-hidden="true">/</span>
            <span className="text-ink">{title}</span>
          </nav>
        </div>

        {/* ── Main layout ────────────────────────────────────────── */}
        <div className="mx-auto max-w-[1068px] px-5 py-10 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start lg:gap-12">

            {/* ── Left column ──────────────────────────────────── */}
            <div>
              {/* Back link */}
              <Link
                href="/shop"
                className="mb-8 inline-flex items-center gap-2 font-secondary text-sm font-medium text-muted transition hover:text-cobalt"
              >
                <ArrowLeft className="h-4 w-4" />
                Kembali ke toko
              </Link>

              {/* Image carousel — 1:1 */}
              <ProductImageCarousel
                images={previewImages}
                title={title}
                isNew={isNew}
                isBestSeller={isBestSeller}
                discountPct={discountPct}
              />

              {/* ── About section — h2 scale from design system */}
              <div className="mt-12">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">
                  Tentang template
                </p>
                <h2 className="text-balance font-primary text-[30px] font-semibold leading-[1.2] tracking-[-0.2px] text-ink sm:text-[40px] sm:tracking-[-1px]">
                  {title}
                </h2>
                <p className="mt-4 font-secondary text-[18px] leading-[1.56] text-muted">
                  {longDescription}
                </p>
              </div>

              {/* ── Features — FeatureCard-like checklist */}
              <div className="mt-12">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 font-secondary text-sm font-semibold leading-none text-cobalt shadow-card">
                  Fitur utama
                </p>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 rounded-3xl border border-line bg-white p-5 shadow-card transition duration-300 hover:-translate-y-0.5 hover:shadow-soft"
                    >
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sheet text-ink">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-secondary text-base font-medium text-ink">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* ── Trust signals — StatCard-like pattern */}
              <div className="mt-12 grid grid-cols-3 gap-4 rounded-3xl border border-line bg-[linear-gradient(180deg,#eaf0ff_0%,#f2ffe0_100%)] p-6">
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sheet text-ink">
                    <FileSpreadsheet className="h-5 w-5" />
                  </span>
                  <span className="font-secondary text-sm font-semibold text-ink">Google Sheets</span>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky text-cobalt">
                    <Zap className="h-5 w-5" />
                  </span>
                  <span className="font-secondary text-sm font-semibold text-ink">Langsung pakai</span>
                </div>
                <div className="flex flex-col items-center gap-3 text-center">
                  <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-leaf text-cobalt">
                    <Users className="h-5 w-5" />
                  </span>
                  <span className="font-secondary text-sm font-semibold text-ink">Bisa tim</span>
                </div>
              </div>
            </div>

            {/* ── Right column — sticky purchase panel ─────────── */}
            <aside className="lg:sticky lg:top-28">
              {/* Card — PricingCard-like pattern */}
              <div className="rounded-3xl border border-line bg-white p-6 shadow-card">

                {/* Category badge */}
                <span className="rounded-full border border-line bg-white px-3 py-1 font-secondary text-xs font-bold text-cobalt shadow-card">
                  {badge}
                </span>

                {/* Title */}
                <h1 className="mt-4 font-primary text-2xl font-semibold leading-[1.25] tracking-[-0.6px] text-ink">
                  {title}
                </h1>

                {/* Price */}
                <div className="mt-6">
                  <div className="flex items-end gap-3">
                    <strong className="font-primary text-[42px] font-semibold leading-none tracking-[-1.8px] text-ink">
                      {price}
                    </strong>
                    {originalPrice && (
                      <span className="mb-1 font-secondary text-base text-muted line-through">
                        {originalPrice}
                      </span>
                    )}
                  </div>
                  {(discountPct || originalPrice) && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {discountPct && discountPct > 0 && (
                        <span className="rounded-full bg-[#b8ff4f] px-3 py-1 font-secondary text-xs font-bold text-ink">
                          Hemat {discountPct}%
                        </span>
                      )}
                      <span className="font-secondary text-xs text-muted">
                        Sekali bayar, akses selamanya.
                      </span>
                    </div>
                  )}
                </div>

                {/* CTA — Button component */}
                <div className="mt-7 flex flex-col gap-3">
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-14 w-full items-center justify-center gap-2 rounded-full bg-ink font-secondary text-base font-semibold text-white shadow-soft transition duration-300 hover:-translate-y-0.5 hover:bg-cobalt"
                  >
                    <span className="relative block overflow-hidden">
                      <span className="block transition duration-300 group-hover:-translate-y-full">Beli Sekarang</span>
                      <span className="absolute left-0 top-full block transition duration-300 group-hover:-translate-y-full">Beli Sekarang</span>
                    </span>
                    <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1" />
                  </a>
                  <a
                    href={site.contactUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-line bg-white font-secondary text-sm font-semibold text-ink transition duration-300 hover:-translate-y-0.5 hover:border-ink"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Tanya Dulu
                  </a>
                </div>

                {/* What's included — same checklist as PricingCard */}
                <div className="mt-7 border-t border-line pt-6">
                  <p className="mb-4 font-secondary text-xs font-bold uppercase tracking-[0.08em] text-muted">
                    Yang kamu dapat
                  </p>
                  <ul className="space-y-3">
                    {whatsIncluded.map((item) => (
                      <li key={item} className="flex items-center gap-3 font-secondary text-sm font-medium text-ink">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-leaf text-cobalt">
                          <Check className="h-3.5 w-3.5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          </div>
        </div>

        {/* ── Bottom CTA strip ───────────────────────────────────── */}
        <div className="mx-auto max-w-[1068px] px-5 pb-20 lg:px-10">
          <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-line bg-sky/30 px-6 py-6 sm:flex-row sm:items-center">
            <div>
              <p className="font-primary text-xl font-semibold leading-[1.25] tracking-[-0.5px] text-ink">
                Cari template lain?
              </p>
              <p className="mt-1 font-secondary text-sm text-muted">
                Lihat semua pilihan template yang tersedia.
              </p>
            </div>
            <Button href="/shop" variant="primary" size="md">
              Lihat semua template
            </Button>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
