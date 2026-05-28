import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ShopHero } from "@/components/ShopHero";
import { TemplateGrid } from "@/components/TemplateGrid";
import { BgTransition } from "@/components/BgTransition";
import { site } from "@/lib/site";
import { getActiveProducts, getSiteSettings, buildWaUrl } from "@/lib/supabase/queries";

export const revalidate = 60;

export const metadata: Metadata = {
  title: `Toko Template — ${site.name}`,
  description:
    "Semua template Google Sheets premium Pakarsheet. Pilih template yang paling dekat dengan alur kerja bisnis kamu.",
  openGraph: {
    title: `Toko Template — ${site.name}`,
    description:
      "Semua template Google Sheets premium Pakarsheet. Pilih template yang paling dekat dengan alur kerja bisnis kamu.",
    type: "website",
  },
};

export default async function ShopPage() {
  const [products, settings] = await Promise.all([
    getActiveProducts(),
    getSiteSettings(),
  ]);
  const waUrl = buildWaUrl(settings) || site.contactUrl;

  // Strip fields not needed by client component (no functions to pass)
  const templates = products.map((p) => ({
    slug: p.slug,
    title: p.title,
    shortTitle: p.short_title,
    description: p.description,
    longDescription: p.long_description,
    badge: p.badge,
    category: p.category,
    price: p.price,
    priceRaw: p.price_raw,
    originalPrice: p.original_price ?? undefined,
    accent: p.accent,
    features: p.features,
    whatsIncluded: p.whats_included,
    previewImages: p.preview_images,
    isNew: p.is_new,
    isBestSeller: p.is_best_seller,
    ctaUrl: p.cta_url,
  }));

  return (
    <>
      <BgTransition />
      <Navbar />
      <main id="main-content">
        <ShopHero />
        <TemplateGrid templates={templates} contactUrl={waUrl} />
      </main>
      <Footer />
    </>
  );
}
